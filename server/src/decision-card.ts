import type {
  ActionRecommendation,
  EvidenceSnippet,
  GroundedAnswer,
  IntentCode,
  ReasonCode,
  ValidationFinding
} from "./types.js";

// Decision Card v2 — Phase 1 backend contract.
// Source: decision-card-v2.Spec.md v0.1.0, plan_Decision Card v2.md, docs/plans/decision-card-v2-phase1-plan.md
// Spec assumption A1 (React/Next.js) does NOT apply here — this repo is a Cloudflare Worker MCP
// server with a vanilla HTML widget. Phase 1 ships the data/rule/adapter contract only.

// --- Enums (Spec §"Enum Definitions") ---

export type CardVerdict = "PASS" | "WARN" | "BLOCK";
export type PiiStatus = "None" | "Masked" | "Risk";
export type EvidenceDomainStatus = "PASS" | "WARN" | "BLOCK";
export type ApprovalStatus =
  | "NotRequired"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Expired";
export type ActionStatus =
  | "Open"
  | "Pending Input"
  | "Pending Approval"
  | "Done"
  | "Rejected"
  | "Expired"
  | "Unassigned";
export type DataClass = "P0" | "P1" | "P2";
export type ExportType = "Copy JSON" | "Export PDF Draft" | "Publish Report";
export type HumanGateState =
  | "READ_ONLY"
  | "DRY_RUN"
  | "APPROVAL_REQUESTED"
  | "APPROVED_ACTION"
  | "EXECUTED"
  | "AUDITED"
  | "DENIED"
  | "CANCELLED"
  | "EXPIRED"
  | "NEEDS_REVIEW";

// --- Rule matrix ---

export type DecisionRule = {
  ruleId: string;
  ruleName: string;
  reason: string;
  requiredInputs: readonly string[];
  blockedActions: readonly string[];
  severity: "P0" | "P1" | "P2";
};

export const RULE_MATRIX: Readonly<Record<string, DecisionRule>> = {
  "SCT-COST-001": {
    ruleId: "SCT-COST-001",
    ruleName: "Cost evidence required",
    reason: "Cost or invoice decision requires evidence",
    requiredInputs: ["InvoiceLine", "RateRef", "TariffRef"],
    blockedActions: ["Cost judgment", "Invoice approval"],
    severity: "P0"
  },
  "SCT-DOC-002": {
    ruleId: "SCT-DOC-002",
    ruleName: "Operational document evidence required",
    reason: "BOE / DO / Port evidence required for operational decision",
    requiredInputs: ["BOE", "DO", "Port evidence"],
    blockedActions: ["Report publication"],
    severity: "P0"
  },
  "SCT-PII-003": {
    ruleId: "SCT-PII-003",
    ruleName: "PII must be masked",
    reason: "PII unmasked or suspected",
    requiredInputs: ["Redaction proof"],
    blockedActions: ["Export", "Publish", "External share"],
    severity: "P0"
  },
  "SCT-P2-004": {
    ruleId: "SCT-P2-004",
    ruleName: "P2 raw content must not be exposed",
    reason: "P2 raw text / rate / internal link exposed",
    requiredInputs: ["Material ID", "redacted snippet", "sourceHash"],
    blockedActions: ["Export", "Publish"],
    severity: "P0"
  },
  "SCT-APP-005": {
    ruleId: "SCT-APP-005",
    ruleName: "Approval required",
    reason: "Approval is required but has not been granted",
    requiredInputs: ["Approval actor", "Approval status"],
    blockedActions: ["Invoice approval", "Publish", "External send"],
    severity: "P0"
  },
  "SCT-CONF-006": {
    ruleId: "SCT-CONF-006",
    ruleName: "Confidence below high-risk threshold",
    reason: "Confidence is below the high-risk decision threshold",
    requiredInputs: ["Manual review", "Stronger evidence"],
    blockedActions: ["Cost judgment", "Publish"],
    severity: "P1"
  },
  "SCT-SCHEMA-007": {
    ruleId: "SCT-SCHEMA-007",
    ruleName: "Required contract fields missing",
    reason: "Required DecisionCardPayload fields are missing or invalid",
    requiredInputs: ["Valid DecisionCardPayload"],
    blockedActions: ["All high-risk actions"],
    severity: "P0"
  }
};

// Map existing ValidationFinding.reasonCode → ruleId in RULE_MATRIX.
// Unknown codes fall back to SCT-SCHEMA-007 (see resolveRuleForFinding).
export const REASON_CODE_TO_RULE: Readonly<Record<string, string>> = {
  SCT_COST_EVIDENCE_REQUIRED: "SCT-COST-001",
  SCT_CUSTOMS_EVIDENCE_REQUIRED: "SCT-DOC-002",
  SCT_OOG_SAFETY_EVIDENCE_REQUIRED: "SCT-DOC-002",
  SCT_CLAIM_EVIDENCE_REQUIRED: "SCT-DOC-002",
  PII_MASKED: "SCT-PII-003",
  HUMAN_GATE_REQUIRED: "SCT-APP-005",
  SHIPMENT_INVOICE_HUMAN_GATE_REQUIRED: "SCT-APP-005",
  INSUFFICIENT_EVIDENCE: "SCT-SCHEMA-007",
  MISSING_REQUIRED_DOC: "SCT-SCHEMA-007",
  MISSING_MASTER_EVIDENCE: "SCT-SCHEMA-007",
  STALE_SOURCE_RISK: "SCT-CONF-006",
  AMBIGUOUS_ANY_KEY: "SCT-CONF-006",
  FLOW_CODE_SCOPE_VIOLATION: "SCT-SCHEMA-007",
  FLOW_CODE_SCOPE_INFO: "SCT-SCHEMA-007",
  M130_CHAIN_EVIDENCE_REQUIRED: "SCT-DOC-002",
  SHIPMENT_AGIDAS_MOSB_CHAIN_REQUIRED: "SCT-DOC-002",
  SHIPMENT_MISSING_DOCUMENTS: "SCT-SCHEMA-007",
  SYSTEM_DIAGNOSTIC_ROUTED: "SCT-SCHEMA-007"
};

// --- Output types (Spec §"DecisionCardPayload Contract") ---

export type BlockedByEntry = {
  ruleId: string;
  ruleName: string;
  reason: string;
  requiredInputs: string[];
  missingInputs: string[];
  blockedActions: string[];
  severity: "P0" | "P1" | "P2";
};

export type EvidenceCoverageItem = {
  domain: string;
  status: EvidenceDomainStatus;
  required: number;
  available: number;
  directSupportRatio: number;
};

export type ActionItem = {
  actionId: string;
  ownerRole: string;
  ownerNameMasked: string | null;
  actionType: string;
  actionLabel: string;
  requiredInput: string | null;
  approvalRequired: boolean;
  approvalStatus: ApprovalStatus;
  status: ActionStatus;
  evidenceIds: string[];
  blockedUntil: string[];
  dueBasis: string;
  dueAt: string | null;
};

export type DecisionCardTrace = {
  sourceHash: string;
  rulePackVersion: string;
  rulePackIds: string[];
  promptVersion: string;
  approvalActor: string | null;
  approvalStatus: ApprovalStatus;
  sensitiveAccessed: boolean;
  generatedAt: string;
  routeId: string;
};

export type DecisionCardPayload = {
  schemaVersion: "sct.card.v2";
  cardId: string;
  routeId: string;
  intent: IntentCode;
  generatedAt: string;
  verdict: CardVerdict;
  severity: "P0" | "P1" | "P2";
  primaryReason: string;
  unblockSummary: string;
  piiStatus: PiiStatus;
  dataClass: DataClass;
  blockedBy: BlockedByEntry[];
  allowedActions: string[];
  blockedActions: string[];
  allowedNow: string[];
  blockedUntilApproved: string[];
  humanGateState: HumanGateState;
  evidenceCoverage: EvidenceCoverageItem[];
  actions: ActionItem[];
  trace: DecisionCardTrace;
};

// --- Pure derivation functions ---

export function deriveVerdict(input: {
  missingRequiredInputs: readonly string[];
  piiStatus: PiiStatus;
  approvalRequired: boolean;
  approvalStatus: ApprovalStatus;
  lowConfidenceHighRisk: boolean;
  hasBlockingFindings: boolean;
  hasWarningFindings: boolean;
}): CardVerdict {
  if (input.piiStatus === "Risk") return "BLOCK";
  if (input.missingRequiredInputs.length > 0) return "BLOCK";
  if (input.approvalRequired && input.approvalStatus !== "Approved") return "BLOCK";
  if (input.lowConfidenceHighRisk) return "BLOCK";
  if (input.hasBlockingFindings) return "BLOCK";
  if (input.hasWarningFindings) return "WARN";
  return "PASS";
}

export function derivePiiStatus(args: {
  piiMasked: boolean;
  hasRawPiiMarkers: boolean;
}): PiiStatus {
  if (args.hasRawPiiMarkers) return "Risk";
  return args.piiMasked ? "Masked" : "None";
}

export function buildEvidenceCoverage(args: {
  evidence: ReadonlyArray<{ id: string; docId: string; evidenceScore?: EvidenceSnippet["evidenceScore"] }>;
  requiredDocs: readonly string[];
}): EvidenceCoverageItem[] {
  return args.requiredDocs.map((doc) => {
    const matches = args.evidence.filter((e) => e.docId.includes(doc));
    const available = matches.length;
    const directSupportRatio = available === 0
      ? 0
      : Number(
          (
            matches.reduce((total, item) => total + (item.evidenceScore?.directSupport ?? 0), 0) /
            available
          ).toFixed(2)
        );
    return {
      domain: doc,
      status: available > 0 ? ("PASS" as const) : ("BLOCK" as const),
      required: 1,
      available,
      directSupportRatio
    };
  });
}

const PII_RISK_BLOCKED = ["Export", "Publish", "External Send"] as const;
const APPROVAL_PENDING_BLOCKED = [
  "Invoice approval",
  "Publish Report",
  "External Send"
] as const;

export function buildBlockedActions(args: {
  verdict: CardVerdict;
  piiStatus: PiiStatus;
  approvalStatus: ApprovalStatus;
  approvalRequired: boolean;
  baseBlockedActions: readonly string[];
}): string[] {
  const collected = new Set<string>(args.baseBlockedActions);
  if (args.piiStatus === "Risk") {
    for (const action of PII_RISK_BLOCKED) collected.add(action);
  }
  if (args.approvalRequired && args.approvalStatus !== "Approved") {
    for (const action of APPROVAL_PENDING_BLOCKED) collected.add(action);
  }
  return Array.from(collected);
}

export function deriveHumanGateState(args: {
  approvalRequired: boolean;
  approvalStatus: ApprovalStatus;
}): HumanGateState {
  if (!args.approvalRequired) return "READ_ONLY";
  switch (args.approvalStatus) {
    case "Approved":
      return "APPROVED_ACTION";
    case "Pending":
      return "APPROVAL_REQUESTED";
    case "Rejected":
      return "DENIED";
    case "Expired":
      return "EXPIRED";
    case "NotRequired":
      return "NEEDS_REVIEW";
  }
}

// --- Internal helpers ---

function resolveRuleForFinding(finding: ValidationFinding): DecisionRule {
  const mapped = REASON_CODE_TO_RULE[finding.reasonCode as ReasonCode];
  if (mapped && RULE_MATRIX[mapped]) return RULE_MATRIX[mapped];
  return RULE_MATRIX["SCT-SCHEMA-007"];
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)) + "…";
}

function buildUnblockSummary(missing: readonly string[]): string {
  if (missing.length === 0) return "";
  if (missing.length <= 5) return missing.join(", ");
  const head = missing.slice(0, 5).join(", ");
  return `${head} +${missing.length - 5} more`;
}

function pickHighestSeverity(entries: BlockedByEntry[]): "P0" | "P1" | "P2" {
  if (entries.some((e) => e.severity === "P0")) return "P0";
  if (entries.some((e) => e.severity === "P1")) return "P1";
  if (entries.length > 0) return "P2";
  return "P1";
}

function deterministicSourceHash(evidence: readonly EvidenceSnippet[]): string {
  if (evidence.length === 0) return "sha256:none";
  // Deterministic concat of docHashes — no Date.now(), no crypto required.
  return `sha256:${evidence.map((e) => e.docHash).join("|")}`;
}

function buildBlockedByEntries(findings: readonly ValidationFinding[]): BlockedByEntry[] {
  const blocking = findings.filter((f) => f.severity === "BLOCK");
  const seen = new Set<string>();
  const entries: BlockedByEntry[] = [];
  for (const finding of blocking) {
    const rule = resolveRuleForFinding(finding);
    if (seen.has(rule.ruleId)) continue;
    seen.add(rule.ruleId);
    entries.push({
      ruleId: rule.ruleId,
      ruleName: rule.ruleName,
      reason: rule.reason,
      requiredInputs: Array.from(rule.requiredInputs),
      missingInputs: Array.from(rule.requiredInputs),
      blockedActions: Array.from(rule.blockedActions),
      severity: rule.severity
    });
  }
  return entries;
}

function mapActions(
  actions: readonly ActionRecommendation[],
  approvalStatus: ApprovalStatus
): ActionItem[] {
  const firstStringParameter = (
    parameters: ActionRecommendation["parameters"],
    keys: readonly string[]
  ): string | null => {
    for (const key of keys) {
      const value = parameters?.[key];
      if (typeof value === "string" && value.trim()) return value;
      if (typeof value === "number" || typeof value === "boolean") return String(value);
    }
    return null;
  };

  return actions.map((action, index) => {
    const requiredInput = firstStringParameter(action.parameters, [
      "input",
      "requiredInput",
      "requiredEvidence",
      "requiredSource",
      "reason",
      "scope",
      "next",
      "semanticBoundary"
    ]);
    const dueBasis =
      action.dueBasis ??
      firstStringParameter(action.parameters, ["dueBasis", "deadlineBasis"]) ??
      (action.humanGateRequired ? "Before approval-gated execution" : "Before operational use");
    return {
      actionId: `ACT-${String(index + 1).padStart(3, "0")}`,
      ownerRole: action.ownerRole,
      ownerNameMasked: null,
      actionType: action.actionType,
      actionLabel: requiredInput
        ? `${action.actionType} — ${requiredInput}`
        : action.actionType,
      requiredInput,
      approvalRequired: action.humanGateRequired,
      approvalStatus: action.humanGateRequired ? approvalStatus : "NotRequired",
      status: action.humanGateRequired && approvalStatus !== "Approved" ? "Pending Approval" : "Open",
      evidenceIds: [],
      blockedUntil: requiredInput ? [requiredInput] : [],
      dueBasis,
      dueAt: action.dueAt
    };
  });
}

// --- Adapter ---

export function toDecisionCardPayload(args: {
  answer: GroundedAnswer;
  approvalState?: {
    required: boolean;
    status: ApprovalStatus;
    actor?: string | null;
  };
  rulePackVersion?: string;
  promptVersion?: string;
  dataClass?: DataClass;
  cardId?: string;
}): DecisionCardPayload {
  const { answer } = args;

  let blockedBy = buildBlockedByEntries(answer.validation);

  const piiStatus = derivePiiStatus({
    piiMasked: answer.piiMasked,
    hasRawPiiMarkers: false
  });

  const hasHumanGateFinding = answer.validation.some(
    (f) => f.reasonCode === "HUMAN_GATE_REQUIRED"
  );
  const hasHumanGateAction = answer.actions.some((a) => a.humanGateRequired);
  const approvalRequired =
    args.approvalState?.required ?? (hasHumanGateFinding || hasHumanGateAction);
  const approvalStatus: ApprovalStatus =
    args.approvalState?.status ?? "NotRequired";

  if (approvalRequired && approvalStatus !== "Approved" && !blockedBy.some((entry) => entry.ruleId === "SCT-APP-005")) {
    const rule = RULE_MATRIX["SCT-APP-005"];
    blockedBy = [
      ...blockedBy,
      {
        ruleId: rule.ruleId,
        ruleName: rule.ruleName,
        reason: rule.reason,
        requiredInputs: Array.from(rule.requiredInputs),
        missingInputs: Array.from(rule.requiredInputs),
        blockedActions: Array.from(rule.blockedActions),
        severity: rule.severity
      }
    ];
  }

  const missingRequiredInputs = Array.from(
    new Set(blockedBy.flatMap((entry) => entry.requiredInputs))
  );

  const hasBlockingFindings = answer.validation.some(
    (f) => f.severity === "BLOCK"
  );
  const hasWarningFindings = answer.validation.some(
    (f) => f.severity === "WARN"
  );

  const verdict = deriveVerdict({
    missingRequiredInputs,
    piiStatus,
    approvalRequired,
    approvalStatus,
    lowConfidenceHighRisk: false,
    hasBlockingFindings,
    hasWarningFindings
  });

  const baseBlockedActions = Array.from(
    new Set(blockedBy.flatMap((entry) => RULE_MATRIX[entry.ruleId].blockedActions))
  );
  const blockedActions = buildBlockedActions({
    verdict,
    piiStatus,
    approvalStatus,
    approvalRequired,
    baseBlockedActions
  });

  const evidenceCoverage = buildEvidenceCoverage({
    evidence: answer.evidence.map((e) => ({ id: e.id, docId: e.docId, evidenceScore: e.evidenceScore })),
    requiredDocs: answer.route.requiredDocs
  });

  const primaryReason = (() => {
    const firstBlock = answer.validation.find((f) => f.severity === "BLOCK");
    const source = firstBlock?.message ?? blockedBy[0]?.reason ?? (verdict === "BLOCK" ? "Blocked by decision card consistency validator" : "No blocking finding");
    return truncate(source, 80);
  })();

  const unblockSummary = buildUnblockSummary(missingRequiredInputs);

  const allowedActions: string[] = [];
  if (verdict !== "BLOCK") allowedActions.push("Copy JSON");
  if (verdict === "PASS" && approvalStatus === "Approved") {
    allowedActions.push("Publish Report");
  }
  if (verdict === "BLOCK") allowedActions.push("Copy JSON");

  const humanGateState = deriveHumanGateState({ approvalRequired, approvalStatus });
  const allowedNow = Array.from(new Set([...answer.route.allowedActions, ...allowedActions]));
  const blockedUntilApproved = Array.from(
    new Set([...answer.route.blockedActions, ...blockedActions])
  );

  return {
    schemaVersion: "sct.card.v2",
    cardId: args.cardId ?? `DC-${answer.answerId}`,
    routeId: answer.route.routeId,
    intent: answer.route.intent,
    generatedAt: answer.generatedAt,
    verdict,
    severity: pickHighestSeverity(blockedBy),
    primaryReason,
    unblockSummary,
    piiStatus,
    dataClass: args.dataClass ?? "P1",
    blockedBy,
    allowedActions,
    blockedActions,
    allowedNow,
    blockedUntilApproved,
    humanGateState,
    evidenceCoverage,
    actions: mapActions(answer.actions, approvalStatus),
    trace: {
      sourceHash: deterministicSourceHash(answer.evidence),
      rulePackVersion: args.rulePackVersion ?? "2026.05",
      rulePackIds: answer.route.rulePackIds,
      promptVersion: args.promptVersion ?? "unknown",
      approvalActor: args.approvalState?.actor ?? null,
      approvalStatus,
      sensitiveAccessed: piiStatus !== "None",
      generatedAt: answer.generatedAt,
      routeId: answer.route.routeId
    }
  };
}
