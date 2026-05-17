import type { DecisionCardPayload } from "./decision-card.js";

export type DomainHint =
  | "system"
  | "master"
  | "warehouse"
  | "document"
  | "marine"
  | "cost"
  | "material"
  | "port"
  | "communication"
  | "operations"
  | "team"
  | "compliance";

export type IntentCode =
  | "SYSTEM_DIAGNOSTIC"
  | "ONTOLOGY_PATCH_REVIEW"
  | "CARD_RENDERING_AUDIT"
  | "RULEPACK_GAP_ANALYSIS"
  | "ROUTER_QA"
  | "EVIDENCE_QA"
  | "SCHEMA_BOUNDARY_REVIEW"
  | "VALIDATION_POLICY_REVIEW"
  | "LOGISTICS_DECISION"
  | "EMAIL_DRAFT"
  | "COST_GUARD"
  | "DOCUMENT_GUARDIAN"
  | "GENERAL_ANSWER";

export type Verdict =
  | "DIAGNOSTIC"
  | "PASS"
  | "PASS_WITH_FINDINGS"
  | "DRAFT_READY"
  | "AMBER"
  | "NEEDS_INPUT"
  | "PENDING_APPROVAL"
  | "DRY_RUN_ONLY"
  | "WARN"
  | "BLOCK"
  | "INFO"
  | "NO_EVIDENCE"
  | "ZERO";

export type ReasonCode =
  | "MISSING_REQUIRED_DOC"
  | "MISSING_MASTER_EVIDENCE"
  | "INSUFFICIENT_EVIDENCE"
  | "FLOW_CODE_SCOPE_VIOLATION"
  | "FLOW_CODE_SCOPE_INFO"
  | "M130_CHAIN_EVIDENCE_REQUIRED"
  | "STALE_SOURCE_RISK"
  | "PII_MASKED"
  | "HUMAN_GATE_REQUIRED"
  | "AMBIGUOUS_ANY_KEY"
  | "SCT_CUSTOMS_EVIDENCE_REQUIRED"
  | "SCT_COST_EVIDENCE_REQUIRED"
  | "SCT_OOG_SAFETY_EVIDENCE_REQUIRED"
  | "SCT_CLAIM_EVIDENCE_REQUIRED"
  | "SHIPMENT_AGIDAS_MOSB_CHAIN_REQUIRED"
  | "SHIPMENT_INVOICE_HUMAN_GATE_REQUIRED"
  | "SHIPMENT_MISSING_DOCUMENTS"
  | "SYSTEM_DIAGNOSTIC_ROUTED"
  | "P2_LEAKAGE_RISK";

export type EvidenceSnippet = {
  id: string;
  docId: string;
  title: string;
  version: string;
  sectionPath: string;
  snippet: string;
  docHash: string;
  confidence: number;
  evidenceScore?: EvidenceScore;
  sourceType: "ontology_corpus" | "sample" | "kg";
};

export type EvidenceScore = {
  evidenceId: string;
  intentRelevance: number;
  domainSpecificity: number;
  directSupport: number;
  authorityLevel: number;
  operationalActionability: number;
  recency: number;
  finalScore: number;
  supportState: "SUPPORTED" | "PARTIAL" | "NO_DIRECT_EVIDENCE" | "CONTRADICTED";
};

export type IntentRoute = {
  routeId: string;
  intent: IntentCode;
  domains: DomainHint[];
  requiredDocs: string[];
  rulePackIds: string[];
  allowedActions: string[];
  blockedActions: string[];
  confidence: number;
  routingReason: string;
};

export type ResolvedEntity = {
  entityType: "ShipmentUnit" | "Document" | "Invoice" | "PersonRole" | "Site" | "SystemComponent" | "Unknown";
  identifierScheme: string;
  identifierValue: string;
  normalizedValue: string;
  targetRid: string | null;
  confidence: number;
};

export type GraphPath = {
  startNode: string;
  startNodes?: string[];
  edges: Array<{ from: string; relation: string; to: string }>;
  riskEdges?: Array<{ from: string; risk: string; to: string; severity: "INFO" | "WARN" | "BLOCK" }>;
  endNode: string;
  operationalObjects?: string[];
  isMetaReview?: boolean;
  pathConfidence: number;
};

export type ValidationFinding = {
  ruleId: string;
  reasonCode: ReasonCode;
  severity: "INFO" | "WARN" | "BLOCK";
  status: "PASS" | "WARN" | "BLOCK";
  targetObject: string;
  evidenceIds: string[];
  message: string;
};

export type ActionRecommendation = {
  actionType: string;
  ownerRole: string;
  parameters: Record<string, string | number | boolean | null>;
  humanGateRequired: boolean;
  auditRecordRequired?: boolean;
  writeBackMode?: WriteBackMode;
  dueBasis?: string | null;
  dueAt: string | null;
};

export type WriteBackMode =
  | "READ_ONLY"
  | "DRY_RUN"
  | "APPROVAL_REQUIRED"
  | "WRITE"
  | "AUDIT_RECORD"
  | "BLOCKED";

export type EvidenceTraceItem = {
  targetType: "summary" | "businessImpact" | "detail" | "action";
  targetIndex: number | null;
  answerText: string;
  supportState: "SUPPORTED" | "PARTIAL" | "NO_DIRECT_EVIDENCE" | "CONTRADICTED";
  evidenceIds: string[];
};

export type ShipmentRuleStatus = "PASS" | "INFO" | "WARN" | "BLOCK";

export type ShipmentRuleSupportLevel = "SECONDARY_SAMPLE_VALIDATION";

export type ShipmentRuleResult = {
  found: boolean;
  source: "sample_shipment_rule_engine";
  supportLevel: ShipmentRuleSupportLevel;
  status: ShipmentRuleStatus;
  matchedKey: string | null;
  matchedScheme?: string | null;
  shipmentId: string | null;
  currentStage?: string | null;
  routingPattern?: string | null;
  missingDocuments?: string[];
  openExceptions?: string[];
  invoiceAudit?: Array<Record<string, unknown>>;
  invoiceExposureAed?: string | null;
  candidates?: string[];
  risks: Array<Record<string, unknown>>;
  humanGateRequired: boolean;
  message: string;
  unavailableReason?: string;
};

export type UiRenderStatus =
  | "READY"
  | "RESOURCE_REGISTERED"
  | "RESOURCE_LOADED"
  | "TOOL_RESULT_RECEIVED"
  | "RENDERED"
  | "RESOURCE_NOT_REGISTERED"
  | "RESOURCE_MIME_INVALID"
  | "RESOURCE_CSP_BLOCKED"
  | "SCHEMA_MISMATCH"
  | "WIDGET_RENDER_ERROR"
  | "FALLBACK_RENDERED"
  | "TEMPLATE_FETCH_FAILED";

export type UiAnswerState = {
  dataStatus: "OK";
  uiRenderStatus: UiRenderStatus;
  businessResultVisible: boolean;
  fallbackUsed: boolean;
  cardEnabled: boolean;
  templateUrl: string;
  templateVersion: string;
  schemaVersion: string;
  errorCode?: "CARD_TEMPLATE_RENDER_FAILED";
  errorMessage?: string;
  doNotChange: Array<"verdict" | "validationStatus" | "evidenceIds" | "actions">;
};

export type GroundedAnswer = {
  answerId: string;
  verdict: Verdict;
  dataStatus: "OK";
  businessResultVisible: boolean;
  fallbackUsed: boolean;
  summary: string;
  businessImpact: string;
  details: string[];
  evidenceIds: string[];
  validationStatus: "PASS" | "WARN" | "BLOCK" | "NO_EVIDENCE";
  route: IntentRoute;
  resolvedEntities: ResolvedEntity[];
  evidence: EvidenceSnippet[];
  evidenceTrace: EvidenceTraceItem[];
  shipmentRule?: ShipmentRuleResult;
  validation: ValidationFinding[];
  actions: ActionRecommendation[];
  graphPath: GraphPath | null;
  decisionCard?: DecisionCardPayload;
  ui?: UiAnswerState;
  piiMasked: boolean;
  generatedAt: string;
};

export type CorpusChunk = {
  id: string;
  docId: string;
  title: string;
  version: string;
  sectionPath: string;
  text: string;
  docHash: string;
  domains: DomainHint[];
};

// Re-exports from dual-MCP engine modules
export type { CostGuardBand, CostGuardVerdict, CostGuardLineResult, CostGuardResult, InvoiceLineInput } from "./cost-guard.js";
export type { RouteGateStatus, RouteGateCard, MilestoneRecord } from "./mosb-gate.js";
export type { DocGuardianStatus, CrossDocIssue, DocGuardianResult, DocumentInput } from "./doc-guardian.js";
export type { ActionProposal, TeamActionResult } from "./team-action-router.js";

// Re-exports from Decision Card v2 backend contract (Phase 1)
export type {
  CardVerdict,
  FinalGovernanceVerdict,
  PiiStatus,
  SecurityStatus,
  EvidenceDomainStatus,
  ApprovalStatus,
  ActionStatus,
  DataClass,
  ExportType,
  IntentGroup,
  HumanGateState,
  DecisionRule,
  BlockedByEntry,
  EvidenceCoverageItem,
  ActionItem,
  DecisionCardTrace,
  RulePackExecutionItem,
  VerdictMappingRule,
  DecisionCardSecurity,
  DecisionCardPayload
} from "./decision-card.js";
