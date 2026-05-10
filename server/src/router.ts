import type { DomainHint, IntentRoute, ResolvedEntity } from "./types.js";
import { sha256 } from "./redact.js";

const DOMAIN_RULES: Array<{ domain: DomainHint; docs: string[]; patterns: RegExp[]; reason: string }> = [
  {
    domain: "warehouse",
    docs: ["CONSOLIDATED-02-warehouse-flow"],
    patterns: [/warehouse|\bwh\b|whp|flow code|confirmedflowcode|창고|입고|출고|재고/i],
    reason: "warehouse/WHP keyword detected"
  },
  {
    domain: "document",
    docs: ["CONSOLIDATED-03-document-ocr"],
    patterns: [/\bbl\b|boe|delivery order|\bdo\b|ci\/pl|packing list|ocr|invoice doc|통관|서류|문서/i],
    reason: "document/customs evidence keyword detected"
  },
  {
    domain: "marine",
    docs: ["CONSOLIDATED-04-barge-bulk-cargo"],
    patterns: [/mosb|lct|barge|roro|lolo|marine|stowage|lashing|lifting|berth|해상|바지|선적/i],
    reason: "marine/MOSB/LCT keyword detected"
  },
  {
    domain: "cost",
    docs: ["CONSOLIDATED-05-invoice-cost"],
    patterns: [/invoice|cost|rate|tariff|dem|det|demurrage|detention|aed|usd|비용|청구|정산/i],
    reason: "invoice/cost keyword detected"
  },
  {
    domain: "material",
    docs: ["CONSOLIDATED-06-material-chain"],
    patterns: [/m\d{2,3}|shipment|shipmentunit|agi|das|mir|shu|site|material|cargo|자재|화물|현장/i],
    reason: "material chain/site milestone keyword detected"
  },
  {
    domain: "port",
    docs: ["CONSOLIDATED-07-port-operations"],
    patterns: [/port|terminal|ofco|release|gate out|mzp|khalifa|항만|포트/i],
    reason: "port/terminal keyword detected"
  },
  {
    domain: "communication",
    docs: ["CONSOLIDATED-08-communication"],
    patterns: [/email|chat|whatsapp|approval|owner|담당|승인|메일|와츠앱/i],
    reason: "communication/approval keyword detected"
  },
  {
    domain: "operations",
    docs: ["CONSOLIDATED-09-operations"],
    patterns: [/report|dashboard|kpi|monthly|weekly|보고서|대시보드|월간|주간/i],
    reason: "operations/reporting keyword detected"
  },
  {
    domain: "compliance",
    docs: ["CONSOLIDATED-01-core-framework-infra"],
    patterns: [/moiat|fanr|dcd|adnoc|cicpa|permit|incoterm|compliance|규정|허가/i],
    reason: "compliance/regulatory keyword detected"
  }
];

export function routeQuestion(question: string, userRole = "ops_user", language = "auto"): IntentRoute {
  const domains = new Set<DomainHint>(["master"]);
  const docs = new Set<string>(["CONSOLIDATED-00-master-ontology"]);
  const reasons: string[] = [];

  for (const rule of DOMAIN_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(question))) {
      domains.add(rule.domain);
      rule.docs.forEach((doc) => docs.add(doc));
      reasons.push(rule.reason);
    }
  }

  if (domains.size === 1) {
    domains.add("operations");
    docs.add("CONSOLIDATED-09-operations");
    reasons.push("fallback: operations context");
  }

  return {
    routeId: `route_${sha256(`${question}|${userRole}|${language}`).slice(0, 10)}`,
    domains: Array.from(domains),
    requiredDocs: Array.from(docs),
    confidence: Number(Math.min(0.98, 0.72 + reasons.length * 0.04).toFixed(2)),
    routingReason: reasons.join("; ")
  };
}

export function resolveAnyKey(identifierOrQuestion: string): ResolvedEntity[] {
  const text = identifierOrQuestion;
  const candidates: ResolvedEntity[] = [];

  const patterns: Array<{ scheme: string; entityType: ResolvedEntity["entityType"]; regex: RegExp }> = [
    { scheme: "BL", entityType: "Document", regex: /\bBL[-_ ]?[A-Z0-9-]{3,}\b/gi },
    { scheme: "BOE", entityType: "Document", regex: /\bBOE[-_ ]?\d{3,}\b/gi },
    { scheme: "DO", entityType: "Document", regex: /\bDO[-_ ]?[A-Z0-9-]{3,}\b/gi },
    { scheme: "INVOICE", entityType: "Invoice", regex: /\b(?:INV|INVOICE)[-_ ]?[A-Z0-9-]{3,}\b/gi },
    { scheme: "HVDC_CODE", entityType: "ShipmentUnit", regex: /\bHVDC[-_ ][A-Z0-9-]{3,}\b/gi },
    { scheme: "SITE", entityType: "Site", regex: /\b(?:AGI|DAS|MIR|SHU|MOSB)\b/gi },
    { scheme: "MILESTONE", entityType: "ShipmentUnit", regex: /\bM\d{2,3}\b/gi }
  ];

  for (const { scheme, entityType, regex } of patterns) {
    for (const match of text.matchAll(regex)) {
      const raw = match[0];
      const normalized = raw.toUpperCase().replace(/\s+/g, "-");
      candidates.push({
        entityType,
        identifierScheme: scheme,
        identifierValue: raw,
        normalizedValue: normalized,
        targetRid: entityType === "Site" || scheme === "MILESTONE" ? null : `rid_${sha256(`${scheme}:${normalized}`).slice(0, 12)}`,
        confidence: scheme === "SITE" || scheme === "MILESTONE" ? 0.82 : 0.95
      });
    }
  }

  return candidates;
}
