export type DomainHint =
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

export type Verdict = "PASS" | "WARN" | "BLOCK" | "INFO" | "NO_EVIDENCE";

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
  | "AMBIGUOUS_ANY_KEY";

export type EvidenceSnippet = {
  id: string;
  docId: string;
  title: string;
  version: string;
  sectionPath: string;
  snippet: string;
  docHash: string;
  confidence: number;
  sourceType: "ontology_corpus" | "sample" | "kg";
};

export type IntentRoute = {
  routeId: string;
  domains: DomainHint[];
  requiredDocs: string[];
  confidence: number;
  routingReason: string;
};

export type ResolvedEntity = {
  entityType: "ShipmentUnit" | "Document" | "Invoice" | "PersonRole" | "Site" | "Unknown";
  identifierScheme: string;
  identifierValue: string;
  normalizedValue: string;
  targetRid: string | null;
  confidence: number;
};

export type GraphPath = {
  startNode: string;
  edges: Array<{ from: string; relation: string; to: string }>;
  endNode: string;
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
  dueAt: string | null;
};

export type EvidenceTraceItem = {
  targetType: "summary" | "businessImpact" | "detail" | "action";
  targetIndex: number | null;
  answerText: string;
  supportState: "SUPPORTED" | "NO_DIRECT_EVIDENCE";
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
