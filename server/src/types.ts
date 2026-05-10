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

export type UiRenderStatus = "READY" | "TEMPLATE_FETCH_FAILED";

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
  summary: string;
  businessImpact: string;
  details: string[];
  evidenceIds: string[];
  validationStatus: "PASS" | "WARN" | "BLOCK" | "NO_EVIDENCE";
  route: IntentRoute;
  resolvedEntities: ResolvedEntity[];
  evidence: EvidenceSnippet[];
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
