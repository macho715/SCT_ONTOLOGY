import type { EvidenceSnippet, ResolvedEntity, ShipmentRuleResult } from "./types.js";
import { SAMPLE_SHIPMENTS } from "./generated/sample-shipments.js";

type SampleShipment = {
  shipment_id: string;
  routing_pattern: string;
  identifiers?: Record<string, string>;
  milestones?: Array<{ code: string; occurred_at?: string | null; evidence_ref?: string | null }>;
  documents?: Array<{ doc_type: string; ref: string; status?: string }>;
  invoice_lines?: Array<{
    line_id: string;
    item: string;
    quantity: number | string;
    rate: number | string;
    draft_amount: number | string;
    standard_amount?: number | string | null;
    currency?: string;
    evidence_refs?: string[];
  }>;
  open_exceptions?: string[];
};

function isValidShipment(item: unknown): item is SampleShipment {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as Record<string, unknown>).shipment_id === "string" &&
    typeof (item as Record<string, unknown>).routing_pattern === "string"
  );
}

// Returns null on invalid generated data so caller emits WARN instead of false-negative INFO
function loadSampleShipments(): SampleShipment[] | null {
  const raw = SAMPLE_SHIPMENTS as unknown;
  if (!Array.isArray(raw) || !raw.every(isValidShipment)) return null;
  return raw;
}

const KEY_PATTERNS =
  /\b(?:SHP-\d+|PKG-[A-Z0-9-]+|BL-[A-Z0-9-]+|BOE-[A-Z0-9-]+|DO-[A-Z0-9-]+|INV-[A-Z0-9-]+|INVOICE-[A-Z0-9-]+|HVDC-[A-Z0-9-]+|[A-Z]{4}\d{7}|NO-SUCH-BL)\b/gi;
const MILESTONE_ORDER: Record<string, number> = {
  M00: 0,
  M90: 90,
  M91: 91,
  M92: 92,
  M100: 100,
  M115: 115,
  M116: 116,
  M117: 117,
  M130: 130
};
const HUMAN_GATE_THRESHOLD_AED = 100000;

function normalizeKey(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, " ");
}

function baseResult(overrides: Partial<ShipmentRuleResult>): ShipmentRuleResult {
  return {
    found: false,
    source: "sample_shipment_rule_engine",
    supportLevel: "SECONDARY_SAMPLE_VALIDATION",
    status: "INFO",
    matchedKey: null,
    matchedScheme: null,
    shipmentId: null,
    candidates: [],
    risks: [],
    humanGateRequired: false,
    message: "No matching sample shipment rule signal.",
    ...overrides
  };
}

const NON_IDENTIFIER_KEYS = new Set(["cargo_type", "cargo_class", "service_type"]);

function identifierPairs(shipment: SampleShipment): Array<{ scheme: string; value: string }> {
  return [
    { scheme: "shipment_id", value: shipment.shipment_id },
    ...Object.entries(shipment.identifiers ?? {})
      .filter(([scheme]) => !NON_IDENTIFIER_KEYS.has(scheme.toLowerCase()))
      .map(([scheme, value]) => ({ scheme, value }))
  ];
}

function collectCandidates(question: string, resolvedEntities: ResolvedEntity[]): string[] {
  const candidates = new Set<string>();
  for (const match of question.matchAll(KEY_PATTERNS)) {
    candidates.add(normalizeKey(match[0]));
  }
  for (const entity of resolvedEntities) {
    candidates.add(normalizeKey(entity.normalizedValue));
    candidates.add(normalizeKey(entity.identifierValue));
  }
  return [...candidates].filter(Boolean);
}

function hasMilestone(shipment: SampleShipment, code: string): boolean {
  return (shipment.milestones ?? []).some((milestone) => normalizeKey(milestone.code) === code && Boolean(milestone.occurred_at));
}

function currentStage(shipment: SampleShipment): string {
  const completed = (shipment.milestones ?? []).filter(
    (milestone) => Boolean(milestone.occurred_at) && milestone.code in MILESTONE_ORDER
  );
  if (completed.length === 0) return "M00_NOT_STARTED";
  return completed.reduce((latest, item) => (MILESTONE_ORDER[item.code] > MILESTONE_ORDER[latest.code] ? item : latest)).code;
}

function hasDocument(shipment: SampleShipment, docType: string): boolean {
  const target = normalizeKey(docType);
  return (shipment.documents ?? []).some((doc) => normalizeKey(doc.doc_type) === target && (doc.status ?? "available").toLowerCase() === "available");
}

function missingDocuments(shipment: SampleShipment): string[] {
  const stage = currentStage(shipment);
  const stageRank = MILESTONE_ORDER[stage] ?? 0;
  const required = new Set<string>();
  if (stageRank >= MILESTONE_ORDER.M90) required.add("BOE");
  if (stageRank >= MILESTONE_ORDER.M92) required.add("DO");
  if (stageRank >= MILESTONE_ORDER.M130) required.add("SITE_RECEIPT");
  return [...required].filter((docType) => !hasDocument(shipment, docType)).sort();
}

function buildRisks(shipment: SampleShipment): Array<Record<string, unknown>> {
  const risks: Array<Record<string, unknown>> = [];
  const missing = missingDocuments(shipment);
  if (missing.length > 0) {
    risks.push({
      severity: missing.includes("SITE_RECEIPT") ? "BLOCK" : "WARN",
      rule: "Missing Document Check",
      detail: `Missing required documents: ${missing.join(", ")}.`,
      human_gate: missing.includes("SITE_RECEIPT")
    });
  }

  const cargoType = normalizeKey(shipment.identifiers?.cargo_type ?? "");
  const missingMosb = ["M115", "M116", "M117"].filter((code) => !hasMilestone(shipment, code));
  if (["AGI", "DAS", "AGI/DAS"].includes(cargoType) && hasMilestone(shipment, "M130") && missingMosb.length > 0) {
    risks.push({
      severity: "WARN",
      rule: "AGI/DAS MOSB Gate",
      detail: `M130 site arrival is accepted as delivered; missing ${missingMosb.join(", ")} MOSB-chain evidence requires backfill.`,
      finding: "MOSB_EVIDENCE_MISSING",
      backfill_required: true,
      human_gate: false
    });
  }

  for (const line of shipment.invoice_lines ?? []) {
    const draftAmount = Number(line.draft_amount);
    const evidenceRefs = line.evidence_refs ?? [];
    if (draftAmount >= HUMAN_GATE_THRESHOLD_AED || evidenceRefs.length === 0) {
      // WR-01/WARN-4: missing evidence is BLOCK (not WARN) and requires human gate
      const severity = draftAmount >= HUMAN_GATE_THRESHOLD_AED || evidenceRefs.length === 0 ? "BLOCK" : "WARN";
      risks.push({
        severity,
        rule: "Invoice Human Gate",
        detail: `${line.line_id} ${line.item} requires review.`,
        draft_amount_aed: draftAmount.toFixed(2),
        human_gate: severity === "BLOCK"
      });
    }
  }
  return risks;
}

function money(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildInvoiceAudit(shipment: SampleShipment): Array<Record<string, unknown>> {
  return (shipment.invoice_lines ?? []).map((line) => {
    const quantity = money(line.quantity);
    const rate = money(line.rate);
    const draftAmount = money(line.draft_amount);
    const expectedByRate = quantity * rate;
    const standardAmount = line.standard_amount === undefined || line.standard_amount === null ? expectedByRate : money(line.standard_amount);
    const zeroStandard = standardAmount === 0;
    const deltaAmount = draftAmount - standardAmount;
    // WR-04: null instead of misleading 0 when standardAmount is zero
    const deltaPct = zeroStandard ? null : (deltaAmount / standardAmount) * 100;
    const rateMismatch = Math.abs(draftAmount - expectedByRate) > 0.01;
    const missingEvidence = (line.evidence_refs ?? []).length === 0;
    const severity = zeroStandard || rateMismatch || missingEvidence || draftAmount >= HUMAN_GATE_THRESHOLD_AED ? "BLOCK" : deltaPct !== null && Math.abs(deltaPct) > 5 ? "WARN" : "PASS";
    return {
      lineId: line.line_id,
      item: line.item,
      currency: line.currency ?? "AED",
      draftAmountAed: draftAmount.toFixed(2),
      standardAmountAed: standardAmount.toFixed(2),
      deltaAmountAed: deltaAmount.toFixed(2),
      deltaPct: deltaPct !== null ? deltaPct.toFixed(2) : "N/A",
      expectedByRateAed: expectedByRate.toFixed(2),
      rateMismatch,
      missingEvidence,
      zeroStandard,
      severity,
      humanGate: severity === "BLOCK" || draftAmount >= HUMAN_GATE_THRESHOLD_AED,
      evidenceRefs: line.evidence_refs ?? []
    };
  });
}

function invoiceExposureAed(shipment: SampleShipment): string {
  const exposure = (shipment.invoice_lines ?? []).reduce((sum, line) => sum + money(line.draft_amount), 0);
  return exposure.toFixed(2);
}

export function evaluateShipmentRule(args: {
  question: string;
  resolvedEntities: ResolvedEntity[];
  evidence: EvidenceSnippet[];
  sampleShipments?: SampleShipment[] | null;
}): ShipmentRuleResult {
  const sampleShipments =
    args.sampleShipments === undefined
      ? loadSampleShipments()
      : Array.isArray(args.sampleShipments)
        ? args.sampleShipments
        : null;
  if (!Array.isArray(sampleShipments)) {
    return baseResult({
      status: "WARN",
      message: "Secondary sample shipment rule data is unavailable.",
      unavailableReason: "sample_shipments_unavailable"
    });
  }

  const candidates = collectCandidates(args.question, args.resolvedEntities);
  if (candidates.length === 0) {
    return baseResult({ candidates, message: "No shipment identifier candidate was found in the question." });
  }

  const matches: Array<{ shipment: SampleShipment; scheme: string; value: string }> = [];
  for (const candidate of candidates) {
    for (const shipment of sampleShipments) {
      const pair = identifierPairs(shipment).find((item) => normalizeKey(item.value) === candidate);
      if (pair) matches.push({ shipment, scheme: pair.scheme, value: pair.value });
    }
  }

  const uniqueShipmentIds = [...new Set(matches.map((match) => match.shipment.shipment_id))];
  if (uniqueShipmentIds.length > 1) {
    return baseResult({
      status: "INFO",
      candidates,
      risks: [{ severity: "WARN", rule: "Ambiguous Shipment Candidate", detail: `Multiple shipments matched: ${uniqueShipmentIds.join(", ")}.` }],
      message: "Multiple sample shipments matched; preserving ambiguity instead of selecting one."
    });
  }

  const match = matches[0];
  if (!match) {
    return baseResult({
      status: "INFO",
      matchedKey: candidates[0] ?? null,
      candidates,
      message: "No sample shipment matched the candidate identifiers."
    });
  }

  const risks = buildRisks(match.shipment);
  const invoiceAudit = buildInvoiceAudit(match.shipment);
  const invoiceHasBlock = invoiceAudit.some((line) => line.severity === "BLOCK");
  const invoiceHasWarn = invoiceAudit.some((line) => line.severity === "WARN");
  const status =
    risks.some((risk) => risk.severity === "BLOCK") || invoiceHasBlock ? "BLOCK"
    : risks.some((risk) => risk.severity === "WARN") || invoiceHasWarn ? "WARN"
    : "PASS";
  return baseResult({
    found: true,
    status,
    matchedKey: match.value,
    matchedScheme: match.scheme,
    shipmentId: match.shipment.shipment_id,
    currentStage: currentStage(match.shipment),
    routingPattern: match.shipment.routing_pattern,
    missingDocuments: missingDocuments(match.shipment),
    openExceptions: match.shipment.open_exceptions ?? [],
    invoiceAudit,
    invoiceExposureAed: invoiceExposureAed(match.shipment),
    candidates,
    risks,
    humanGateRequired: risks.some((risk) => risk.human_gate === true) || invoiceAudit.some((line) => line.humanGate === true),
    message: `Matched sample shipment ${match.shipment.shipment_id}.`
  });
}
