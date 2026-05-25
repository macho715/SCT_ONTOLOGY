import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { answerQuestion, answerToText, buildAuditRecord, type AuditRecord, validateGrounding } from "./answer.js";
import { withSpan } from "./telemetry.js";
import { searchCorpus } from "./corpus.js";
import { calcCostGuard } from "./cost-guard.js";
import { checkDocGuardian } from "./doc-guardian.js";
import { DEFAULT_WIDGET_HTML } from "./generated/widget-html.js";
import { checkMosbGate, type MilestoneRecord } from "./mosb-gate.js";
import { resolveAnyKey, routeQuestion } from "./router.js";
import { routeTeamAction, type ActionProposal } from "./team-action-router.js";
import type { DomainHint, GroundedAnswer, ResolvedEntity } from "./types.js";
import { LEGACY_WIDGET_URI, logUiRenderFailure, PREVIOUS_WIDGET_URI, V5_WIDGET_URI, V6_WIDGET_URI, WIDGET_URI, withUiState } from "./ui.js";

export type HvdcServerOptions = {
  widgetHtml?: string;
  widgetDomain?: string;
  audit?: (record: AuditRecord) => void | Promise<void>;
  auth?: HvdcAuthContext;
  storage?: HvdcProtectedStorage;
  controlTower?: HvdcControlTowerLookup;
};

const DEFAULT_WIDGET_DOMAIN = "https://hvdc-ontology-chatgpt-app.mscho715.workers.dev";

export type ControlTowerShipmentUnit = {
  shipmentUnitId: string;
  sourceLineId: string | null;
  vendor: string | null;
  category: string | null;
  poNo: string | null;
  invoiceNo: string | null;
  incoterms: string | null;
  declaredDestinationSet: string | null;
  declaredDestinationCount: number | null;
  currentStage: string | null;
  currentLocation: string | null;
  routingPattern: string | null;
  latestReceiptDt: string | null;
  finalDeliveryDt: string | null;
  siteCompletionRate: number | null;
  missingRequiredDestination: string | null;
  receivedWithoutFlag: string | null;
};

export type ControlTowerMilestoneEvent = {
  milestoneCode: string;
  occurredAt: string | null;
  sourceColumn: string | null;
  sourceLineId: string | null;
};

export type ControlTowerDestinationRequirement = {
  requirementId: string;
  destinationCode: string;
  requiredFlag: boolean;
  sourceColumn: string | null;
  sourceLineId: string | null;
  validationStatus: string | null;
  reasonCode: string | null;
};

export type ControlTowerReceiptEvent = {
  receiptEventId: string;
  locationCode: string;
  locationType: string | null;
  actualReceiptDt: string | null;
  sourceColumn: string | null;
  sourceLineId: string | null;
  matchedRequiredDestination: boolean;
  validationStatus: string | null;
  reasonCode: string | null;
};

export type ControlTowerValidationFinding = {
  validationId: string;
  ruleId: string;
  severity: string | null;
  field: string | null;
  value: string | null;
  reasonCode: string | null;
};

export type ControlTowerShipmentDates = {
  etd: string | null;
  atd: string | null;
  eta: string | null;
  ata: string | null;
  attestation: string | null;
  doCollected: string | null;
  customsStarted: string | null;
  customsClosed: string | null;
  finalDelivered: string | null;
};

export type ControlTowerWarehouseDates = {
  warehouseIn: string | null;
  warehouseOut: string | null;
  warehouseInMilestone: string | null;
  warehouseOutMilestone: string | null;
};

export type ControlTowerCaseCardField = {
  label: string;
  value: string | null;
  isoDate: string | null;
};

export type ControlTowerCanonicalEvent = {
  eventId: string;
  eventType: string;
  eventDate: string | null;
  siteCode: string | null;
  zoneCode: string | null;
  sourceFile: string;
  sourceRow: number | null;
  ingestId: string;
};

export type ControlTowerLatestStatus = {
  latestEventType: string | null;
  latestEventDate: string | null;
  siteCode: string | null;
  zoneCode: string | null;
};

export type ControlTowerWhDwell = {
  warehouseIn: string | null;
  warehouseOut: string | null;
  dwellDays: number | null;
};

export type ControlTowerSiteIntake = {
  siteReceiptDate: string | null;
  siteCodes: string | null;
};

export type ControlTowerCargoSummary = {
  sourceLineId: string | null;
  vendor: string | null;
  category: string | null;
  poNo: string | null;
  invoiceNo: string | null;
  incoterms: string | null;
};

export type ControlTowerSiteReceiptSummary = {
  requiredDestinationCount: number | null;
  receivedDestinationCount: number;
  latestReceiptDt: string | null;
  finalDeliveryDt: string | null;
  siteCompletionRate: number | null;
  missingRequiredDestination: string | null;
  receivedWithoutFlag: string | null;
};

export type ControlTowerShipmentReport = {
  shipmentUnitId: string;
  cargoSummary: ControlTowerCargoSummary;
  shipment: ControlTowerShipmentUnit | null;
  shipmentDates: ControlTowerShipmentDates;
  warehouseDates: ControlTowerWarehouseDates;
  caseCard: ControlTowerCaseCardField[];
  canonicalEvents: ControlTowerCanonicalEvent[];
  latestStatus: ControlTowerLatestStatus | null;
  whDwell: ControlTowerWhDwell | null;
  siteIntake: ControlTowerSiteIntake | null;
  milestones: ControlTowerMilestoneEvent[];
  destinationRequirements: ControlTowerDestinationRequirement[];
  siteReceipts: ControlTowerReceiptEvent[];
  siteReceiptSummary: ControlTowerSiteReceiptSummary;
  validationFindings: ControlTowerValidationFinding[];
  openActions: ActionProposal[];
  reportStatus: "PASS" | "WARN" | "BLOCK" | "NO_EVIDENCE";
  message: string;
  generatedAt: string;
};

export type HvdcControlTowerLookup = {
  resolveAnyKey?: (identifierOrQuestion: string) => Promise<ResolvedEntity[]>;
  getCaseStatus?: (caseNo: string) => Promise<ControlTowerShipmentReport | null>;
  getShipmentUnit?: (shipmentUnitId: string) => Promise<ControlTowerShipmentUnit | null>;
  getShipmentReport?: (shipmentUnitId: string) => Promise<ControlTowerShipmentReport | null>;
  listMilestones?: (shipmentUnitId: string) => Promise<MilestoneRecord[]>;
  listActionQueue?: (shipmentUnitId: string, milestoneCode?: string, domain?: string) => Promise<ActionProposal[]>;
};

export type HvdcAuthContext = {
  authenticated: boolean;
  subject?: string;
  scopes: string[];
};

export type ApprovalInput = {
  approvedByRole: string;
  approvalRef: string;
  reason: string;
};

export type UploadPurpose = "evidence_attachment" | "source_document" | "audit_support" | "ops_working_file";

export type ProtectedToolStatus =
  | "AUTH_REQUIRED"
  | "INSUFFICIENT_SCOPE"
  | "STORAGE_UNAVAILABLE"
  | "VALIDATION_FAILED"
  | "UPLOAD_URL_READY"
  | "UPLOAD_PENDING"
  | "UPLOADED"
  | "ATTACHED"
  | "DRY_RUN_READY"
  | "COMMITTED"
  | "NOT_FOUND"
  | "CONFLICT";

export type CreateUploadUrlInput = {
  fileName: string;
  mimeType: string;
  byteLength?: number;
  purpose: UploadPurpose;
  ttlSeconds?: number;
  approval: ApprovalInput;
  auth: HvdcAuthContext;
};

export type CreateUploadUrlResult = {
  status: ProtectedToolStatus;
  uploadId?: string;
  uploadUrl?: string;
  method?: "PUT";
  expiresAt?: string;
  objectKey?: string;
  maxBytes?: number;
  requiredHeaders?: Record<string, string>;
  humanGateRequired: true;
  auditId?: string;
  message: string;
  requiredScopes?: string[];
};

export type CompleteUploadInput = {
  uploadId: string;
  approval: ApprovalInput;
  auth: HvdcAuthContext;
};

export type CompleteUploadResult = {
  status: ProtectedToolStatus;
  uploadId?: string;
  objectKey?: string;
  fileName?: string;
  mimeType?: string;
  byteLength?: number;
  uploadedAt?: string;
  humanGateRequired: true;
  auditId?: string;
  message: string;
  requiredScopes?: string[];
};

export type AttachUploadedFileInput = {
  uploadId: string;
  targetType: "ShipmentUnit" | "Document" | "Invoice" | "CommunicationEvent" | "AuditRecord" | "Other";
  targetRef: string;
  evidenceNote: string;
  approval: ApprovalInput;
  auth: HvdcAuthContext;
};

export type AttachUploadedFileResult = {
  status: ProtectedToolStatus;
  attachmentId?: string;
  uploadId?: string;
  targetType?: string;
  targetRef?: string;
  objectKey?: string;
  humanGateRequired: true;
  auditId?: string;
  message: string;
  requiredScopes?: string[];
};

export type WriteFileDryRunInput = {
  targetPath: string;
  content: string;
  baseContentHash?: string;
  changeReason: string;
  approval: ApprovalInput;
  auth: HvdcAuthContext;
};

export type WriteFileDryRunResult = {
  status: ProtectedToolStatus;
  proposalId?: string;
  targetPath?: string;
  proposedObjectKey?: string;
  contentHash?: string;
  diffSummary?: {
    mode: "CREATE" | "UPDATE";
    addedLines: number;
    removedLines: number;
    previousHash: string | null;
  };
  humanGateRequired: true;
  auditId?: string;
  message: string;
  requiredScopes?: string[];
};

export type WriteFileCommitInput = {
  proposalId: string;
  commitReason: string;
  approval: ApprovalInput;
  auth: HvdcAuthContext;
};

export type WriteFileCommitResult = {
  status: ProtectedToolStatus;
  proposalId?: string;
  commitId?: string;
  targetPath?: string;
  objectKey?: string;
  contentHash?: string;
  humanGateRequired: true;
  auditId?: string;
  message: string;
  requiredScopes?: string[];
};

export type HvdcProtectedStorage = {
  createUploadUrl?: (input: CreateUploadUrlInput) => Promise<CreateUploadUrlResult>;
  completeUpload?: (input: CompleteUploadInput) => Promise<CompleteUploadResult>;
  attachUploadedFile?: (input: AttachUploadedFileInput) => Promise<AttachUploadedFileResult>;
  createWriteProposal?: (input: WriteFileDryRunInput) => Promise<WriteFileDryRunResult>;
  commitWriteProposal?: (input: WriteFileCommitInput) => Promise<WriteFileCommitResult>;
};

const domainEnum = z.enum([
  "system",
  "master",
  "warehouse",
  "document",
  "marine",
  "cost",
  "material",
  "port",
  "communication",
  "operations",
  "team",
  "compliance"
]);

const intentEnum = z.enum([
  "SYSTEM_DIAGNOSTIC",
  "ONTOLOGY_PATCH_REVIEW",
  "CARD_RENDERING_AUDIT",
  "RULEPACK_GAP_ANALYSIS",
  "ROUTER_QA",
  "EVIDENCE_QA",
  "SCHEMA_BOUNDARY_REVIEW",
  "VALIDATION_POLICY_REVIEW",
  "LOGISTICS_DECISION",
  "EMAIL_DRAFT",
  "COST_GUARD",
  "DOCUMENT_GUARDIAN",
  "GENERAL_ANSWER"
]);

const approvalSchema = z.object({
  approvedByRole: z.string().min(2).max(80),
  approvalRef: z.string().min(3).max(120),
  reason: z.string().min(5).max(500)
});

const protectedToolStatusSchema = z.enum([
  "AUTH_REQUIRED",
  "INSUFFICIENT_SCOPE",
  "STORAGE_UNAVAILABLE",
  "VALIDATION_FAILED",
  "UPLOAD_URL_READY",
  "UPLOAD_PENDING",
  "UPLOADED",
  "ATTACHED",
  "DRY_RUN_READY",
  "COMMITTED",
  "NOT_FOUND",
  "CONFLICT"
]);

const protectedBaseOutputSchema = {
  status: protectedToolStatusSchema,
  humanGateRequired: z.literal(true),
  auditId: z.string().optional(),
  message: z.string(),
  requiredScopes: z.array(z.string()).optional()
};

const uploadPurposeSchema = z.enum(["evidence_attachment", "source_document", "audit_support", "ops_working_file"]);

const createUploadUrlOutputSchema = {
  ...protectedBaseOutputSchema,
  uploadId: z.string().optional(),
  uploadUrl: z.string().optional(),
  method: z.literal("PUT").optional(),
  expiresAt: z.string().optional(),
  objectKey: z.string().optional(),
  maxBytes: z.number().optional(),
  requiredHeaders: z.record(z.string(), z.string()).optional()
};

const completeUploadOutputSchema = {
  ...protectedBaseOutputSchema,
  uploadId: z.string().optional(),
  objectKey: z.string().optional(),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  byteLength: z.number().optional(),
  uploadedAt: z.string().optional()
};

const attachUploadedFileOutputSchema = {
  ...protectedBaseOutputSchema,
  attachmentId: z.string().optional(),
  uploadId: z.string().optional(),
  targetType: z.string().optional(),
  targetRef: z.string().optional(),
  objectKey: z.string().optional()
};

const writeDryRunOutputSchema = {
  ...protectedBaseOutputSchema,
  proposalId: z.string().optional(),
  targetPath: z.string().optional(),
  proposedObjectKey: z.string().optional(),
  contentHash: z.string().optional(),
  diffSummary: z
    .object({
      mode: z.enum(["CREATE", "UPDATE"]),
      addedLines: z.number(),
      removedLines: z.number(),
      previousHash: z.string().nullable()
    })
    .optional()
};

const writeCommitOutputSchema = {
  ...protectedBaseOutputSchema,
  proposalId: z.string().optional(),
  commitId: z.string().optional(),
  targetPath: z.string().optional(),
  objectKey: z.string().optional(),
  contentHash: z.string().optional()
};

const evidenceScoreSchema = z.object({
  evidenceId: z.string(),
  intentRelevance: z.number(),
  domainSpecificity: z.number(),
  directSupport: z.number(),
  authorityLevel: z.number(),
  operationalActionability: z.number(),
  recency: z.number(),
  finalScore: z.number(),
  supportState: z.enum(["SUPPORTED", "PARTIAL", "NO_DIRECT_EVIDENCE", "CONTRADICTED"])
});

const evidenceSchema = z.object({
  id: z.string(),
  docId: z.string(),
  title: z.string(),
  version: z.string(),
  sectionPath: z.string(),
  snippet: z.string(),
  docHash: z.string(),
  confidence: z.number(),
  evidenceScore: evidenceScoreSchema.optional(),
  sourceType: z.string()
});

const routeSchema = z.object({
  routeId: z.string(),
  intent: intentEnum,
  domains: z.array(domainEnum),
  requiredDocs: z.array(z.string()),
  rulePackIds: z.array(z.string()),
  allowedActions: z.array(z.string()),
  blockedActions: z.array(z.string()),
  confidence: z.number(),
  routingReason: z.string()
});

const resolvedEntitySchema = z.object({
  entityType: z.string(),
  identifierScheme: z.string(),
  identifierValue: z.string(),
  normalizedValue: z.string(),
  targetRid: z.string().nullable(),
  confidence: z.number()
});

const actionProposalSchema = z.object({
  actionType: z.string(),
  targetObject: z.string(),
  ownerRole: z.string(),
  backupRole: z.string().nullable(),
  humanGateRequired: z.boolean(),
  dueAt: z.string().nullable(),
  requiredDocs: z.array(z.string()),
  piiMasked: z.literal(true)
});

const controlTowerShipmentReportSchema = z.object({
  shipmentUnitId: z.string(),
  cargoSummary: z.object({
    sourceLineId: z.string().nullable(),
    vendor: z.string().nullable(),
    category: z.string().nullable(),
    poNo: z.string().nullable(),
    invoiceNo: z.string().nullable(),
    incoterms: z.string().nullable()
  }),
  shipment: z
    .object({
      shipmentUnitId: z.string(),
      sourceLineId: z.string().nullable(),
      vendor: z.string().nullable(),
      category: z.string().nullable(),
      poNo: z.string().nullable(),
      invoiceNo: z.string().nullable(),
      incoterms: z.string().nullable(),
      declaredDestinationSet: z.string().nullable(),
      declaredDestinationCount: z.number().nullable(),
      currentStage: z.string().nullable(),
      currentLocation: z.string().nullable(),
      routingPattern: z.string().nullable(),
      latestReceiptDt: z.string().nullable(),
      finalDeliveryDt: z.string().nullable(),
      siteCompletionRate: z.number().nullable(),
      missingRequiredDestination: z.string().nullable(),
      receivedWithoutFlag: z.string().nullable()
    })
    .nullable(),
  shipmentDates: z.object({
    etd: z.string().nullable(),
    atd: z.string().nullable(),
    eta: z.string().nullable(),
    ata: z.string().nullable(),
    attestation: z.string().nullable(),
    doCollected: z.string().nullable(),
    customsStarted: z.string().nullable(),
    customsClosed: z.string().nullable(),
    finalDelivered: z.string().nullable()
  }),
  warehouseDates: z.object({
    warehouseIn: z.string().nullable(),
    warehouseOut: z.string().nullable(),
    warehouseInMilestone: z.string().nullable(),
    warehouseOutMilestone: z.string().nullable()
  }),
  caseCard: z.array(
    z.object({
      label: z.string(),
      value: z.string().nullable(),
      isoDate: z.string().nullable()
    })
  ),
  canonicalEvents: z.array(
    z.object({
      eventId: z.string(),
      eventType: z.string(),
      eventDate: z.string().nullable(),
      siteCode: z.string().nullable(),
      zoneCode: z.string().nullable(),
      sourceFile: z.string(),
      sourceRow: z.number().nullable(),
      ingestId: z.string()
    })
  ),
  latestStatus: z.object({
    latestEventType: z.string().nullable(),
    latestEventDate: z.string().nullable(),
    siteCode: z.string().nullable(),
    zoneCode: z.string().nullable()
  }).nullable(),
  whDwell: z.object({
    warehouseIn: z.string().nullable(),
    warehouseOut: z.string().nullable(),
    dwellDays: z.number().nullable()
  }).nullable(),
  siteIntake: z.object({
    siteReceiptDate: z.string().nullable(),
    siteCodes: z.string().nullable()
  }).nullable(),
  milestones: z.array(
    z.object({
      milestoneCode: z.string(),
      occurredAt: z.string().nullable(),
      sourceColumn: z.string().nullable(),
      sourceLineId: z.string().nullable()
    })
  ),
  destinationRequirements: z.array(
    z.object({
      requirementId: z.string(),
      destinationCode: z.string(),
      requiredFlag: z.boolean(),
      sourceColumn: z.string().nullable(),
      sourceLineId: z.string().nullable(),
      validationStatus: z.string().nullable(),
      reasonCode: z.string().nullable()
    })
  ),
  siteReceipts: z.array(
    z.object({
      receiptEventId: z.string(),
      locationCode: z.string(),
      locationType: z.string().nullable(),
      actualReceiptDt: z.string().nullable(),
      sourceColumn: z.string().nullable(),
      sourceLineId: z.string().nullable(),
      matchedRequiredDestination: z.boolean(),
      validationStatus: z.string().nullable(),
      reasonCode: z.string().nullable()
    })
  ),
  siteReceiptSummary: z.object({
    requiredDestinationCount: z.number().nullable(),
    receivedDestinationCount: z.number(),
    latestReceiptDt: z.string().nullable(),
    finalDeliveryDt: z.string().nullable(),
    siteCompletionRate: z.number().nullable(),
    missingRequiredDestination: z.string().nullable(),
    receivedWithoutFlag: z.string().nullable()
  }),
  validationFindings: z.array(
    z.object({
      validationId: z.string(),
      ruleId: z.string(),
      severity: z.string().nullable(),
      field: z.string().nullable(),
      value: z.string().nullable(),
      reasonCode: z.string().nullable()
    })
  ),
  openActions: z.array(actionProposalSchema),
  reportStatus: z.enum(["PASS", "WARN", "BLOCK", "NO_EVIDENCE"]),
  message: z.string(),
  generatedAt: z.string()
});

const evidenceTraceSchema = z.object({
  targetType: z.enum(["summary", "businessImpact", "detail", "action"]),
  targetIndex: z.number().nullable(),
  answerText: z.string(),
  supportState: z.enum(["SUPPORTED", "PARTIAL", "NO_DIRECT_EVIDENCE", "CONTRADICTED"]),
  evidenceIds: z.array(z.string())
});

const shipmentRuleSchema = z
  .object({
    found: z.boolean(),
    source: z.literal("sample_shipment_rule_engine"),
    supportLevel: z.literal("SECONDARY_SAMPLE_VALIDATION"),
    status: z.enum(["PASS", "INFO", "WARN", "BLOCK"]),
    matchedKey: z.string().nullable(),
    matchedScheme: z.string().nullable().optional(),
    shipmentId: z.string().nullable(),
    currentStage: z.string().nullable().optional(),
    routingPattern: z.string().nullable().optional(),
    missingDocuments: z.array(z.string()).optional(),
    openExceptions: z.array(z.string()).optional(),
    invoiceAudit: z.array(z.record(z.string(), z.unknown())).optional(),
    invoiceExposureAed: z.string().nullable().optional(),
    candidates: z.array(z.string()).optional(),
    risks: z.array(z.record(z.string(), z.unknown())),
    humanGateRequired: z.boolean(),
    message: z.string(),
    unavailableReason: z.string().optional()
  })
  .optional();

const decisionCardSchema = z.object({
  schemaVersion: z.literal("sct.card.v2.1"),
  cardId: z.string(),
  routeId: z.string(),
  intent: intentEnum,
  intentGroup: z.enum(["SYSTEM_QA", "OPERATIONAL"]),
  generatedAt: z.string(),
  verdict: z.enum(["DIAGNOSTIC", "PASS", "PASS_WITH_FINDINGS", "DRAFT_READY", "AMBER", "NEEDS_INPUT", "PENDING_APPROVAL", "DRY_RUN_ONLY", "WARN", "BLOCK", "ZERO"]),
  finalGovernanceVerdict: z.enum(["PASS", "WARN", "BLOCK", "ZERO"]),
  verdictMappingRule: z.object({
    ruleId: z.literal("CARD-GOV-VERDICT-001"),
    inputVerdict: z.string(),
    mappedVerdict: z.enum(["PASS", "WARN", "BLOCK", "ZERO"]),
    reason: z.string()
  }),
  severity: z.enum(["P0", "P1", "P2"]),
  primaryReason: z.string(),
  nextAction: z.string(),
  unblockSummary: z.string(),
  piiStatus: z.enum(["None", "Masked", "Risk"]),
  dataClass: z.enum(["P0", "P1", "P2"]),
  security: z.object({
    piiStatus: z.enum(["PASS", "WARN", "BLOCK"]),
    ndaStatus: z.enum(["PASS", "WARN", "BLOCK"]),
    sourceCorpusAuditStatus: z.enum(["PASS", "WARN", "BLOCK"]),
    sensitiveAccessed: z.boolean(),
    piiMasked: z.boolean(),
    rawContactExposed: z.boolean(),
    internalRateExposed: z.boolean(),
    auditRuleIds: z.array(z.string())
  }),
  blockedBy: z.array(
    z.object({
      ruleId: z.string(),
      ruleName: z.string(),
      reason: z.string(),
      requiredInputs: z.array(z.string()),
      missingInputs: z.array(z.string()),
      blockedActions: z.array(z.string()),
      severity: z.enum(["P0", "P1", "P2"])
    })
  ),
  allowedActions: z.array(z.string()),
  blockedActions: z.array(z.string()),
  allowedNow: z.array(z.string()),
  blockedUntilApproved: z.array(z.string()),
  humanGateState: z.enum([
    "READ_ONLY",
    "DRY_RUN",
    "APPROVAL_REQUESTED",
    "APPROVED_ACTION",
    "EXECUTED",
    "AUDITED",
    "DENIED",
    "CANCELLED",
    "EXPIRED",
    "NEEDS_REVIEW"
  ]),
  evidenceCoverage: z.array(
    z.object({
      domain: z.string(),
      status: z.enum(["PASS", "WARN", "BLOCK"]),
      required: z.number(),
      available: z.number(),
      directSupportRatio: z.number()
    })
  ),
  actions: z.array(
    z.object({
      actionId: z.string(),
      ownerRole: z.string(),
      ownerNameMasked: z.string().nullable(),
      actionType: z.string(),
      actionLabel: z.string(),
      requiredInput: z.string().nullable(),
      allowedNow: z.array(z.string()),
      blockedUntilApproved: z.array(z.string()),
      humanGateRequired: z.boolean(),
      auditRecordRequired: z.boolean(),
      writeBackMode: z.enum(["READ_ONLY", "DRY_RUN", "APPROVAL_REQUIRED", "WRITE", "AUDIT_RECORD", "BLOCKED"]),
      approvalRequired: z.boolean(),
      approvalStatus: z.enum(["NotRequired", "Pending", "Approved", "Rejected", "Expired"]),
      status: z.enum(["Open", "Pending Input", "Pending Approval", "Done", "Rejected", "Expired", "Unassigned"]),
      evidenceIds: z.array(z.string()),
      blockedUntil: z.array(z.string()),
      dueBasis: z.string(),
      dueAt: z.string().nullable()
    })
  ),
  trace: z.object({
    sourceHash: z.string(),
    rulePackVersion: z.string(),
    rulePackIds: z.array(z.string()),
    rulePackExecution: z.array(z.object({
      rulePackId: z.string(),
      fired: z.boolean(),
      skippedReason: z.string().nullable(),
      evidenceOnly: z.boolean(),
      blockedByRuleId: z.string().nullable(),
      decisionImpact: z.string(),
      checkedAt: z.string()
    })),
    schemaPatchVersion: z.string(),
    sourceCorpusVersion: z.string(),
    promptVersion: z.string(),
    approvalActor: z.string().nullable(),
    approvalStatus: z.enum(["NotRequired", "Pending", "Approved", "Rejected", "Expired"]),
    sensitiveAccessed: z.boolean(),
    generatedAt: z.string(),
    routeId: z.string()
  })
});

const answerOutputSchema = {
  answerId: z.string(),
  verdict: z.enum(["DIAGNOSTIC", "PASS", "PASS_WITH_FINDINGS", "DRAFT_READY", "AMBER", "NEEDS_INPUT", "PENDING_APPROVAL", "DRY_RUN_ONLY", "WARN", "BLOCK", "INFO", "NO_EVIDENCE", "ZERO"]),
  dataStatus: z.literal("OK"),
  businessResultVisible: z.boolean(),
  fallbackUsed: z.boolean(),
  summary: z.string(),
  businessImpact: z.string(),
  details: z.array(z.string()),
  evidenceIds: z.array(z.string()),
  validationStatus: z.enum(["PASS", "WARN", "BLOCK", "NO_EVIDENCE"]),
  route: routeSchema,
  resolvedEntities: z.array(resolvedEntitySchema),
  evidence: z.array(evidenceSchema),
  evidenceTrace: z.array(evidenceTraceSchema).default([]),
  shipmentRule: shipmentRuleSchema,
  decisionCard: decisionCardSchema.optional(),
  validation: z.array(
    z.object({
      ruleId: z.string(),
      reasonCode: z.string(),
      severity: z.string(),
      status: z.string(),
      targetObject: z.string(),
      evidenceIds: z.array(z.string()),
      message: z.string()
    })
  ),
  actions: z.array(
    z.object({
      actionType: z.string(),
      ownerRole: z.string(),
      parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
      humanGateRequired: z.boolean(),
      auditRecordRequired: z.boolean().optional(),
      writeBackMode: z.enum(["READ_ONLY", "DRY_RUN", "APPROVAL_REQUIRED", "WRITE", "AUDIT_RECORD", "BLOCKED"]).optional(),
      dueBasis: z.string().nullable().optional(),
      dueAt: z.string().nullable()
    })
  ),
  graphPath: z
    .object({
      startNode: z.string(),
      startNodes: z.array(z.string()).optional(),
      edges: z.array(z.object({ from: z.string(), relation: z.string(), to: z.string() })),
      riskEdges: z.array(z.object({
        from: z.string(),
        risk: z.string(),
        to: z.string(),
        severity: z.enum(["INFO", "WARN", "BLOCK"])
      })).optional(),
      endNode: z.string(),
      operationalObjects: z.array(z.string()).optional(),
      isMetaReview: z.boolean().optional(),
      pathConfidence: z.number()
    })
    .nullable(),
  ui: z
    .object({
      dataStatus: z.literal("OK"),
      uiRenderStatus: z.enum([
        "READY",
        "RESOURCE_REGISTERED",
        "RESOURCE_LOADED",
        "TOOL_RESULT_RECEIVED",
        "RENDERED",
        "RESOURCE_NOT_REGISTERED",
        "RESOURCE_MIME_INVALID",
        "RESOURCE_CSP_BLOCKED",
        "SCHEMA_MISMATCH",
        "WIDGET_RENDER_ERROR",
        "FALLBACK_RENDERED",
        "TEMPLATE_FETCH_FAILED"
      ]),
      businessResultVisible: z.boolean(),
      fallbackUsed: z.boolean(),
      cardEnabled: z.boolean(),
      templateUrl: z.string(),
      templateVersion: z.string(),
      schemaVersion: z.string(),
      errorCode: z.literal("CARD_TEMPLATE_RENDER_FAILED").optional(),
      errorMessage: z.string().optional(),
      doNotChange: z.array(z.enum(["verdict", "validationStatus", "evidenceIds", "actions"]))
    })
    .optional(),
  piiMasked: z.boolean(),
  generatedAt: z.string()
};

const { ui: _uiOutputSchema, ...answerDataOutputSchema } = answerOutputSchema;

export const HVDC_TOOL_DESCRIPTORS = {
  ask_hvdc_ontology: {
    title: "Ask HVDC ontology",
    description:
      "Use this when the user asks any HVDC logistics question or HVDC logistics email reply/draft request, including '답장 작성하라', '메일 회신 작성', 'draft email', customs clearance, shipping schedule, document request, cost clarification, or attachment-based reply requests. Run it before drafting so ChatGPT surfaces sct_ontology/OntologyReview, evidence, validation, next action, the EmailActionCard, and the HVDC answer card. Email draft content must come from the current user-provided email/thread, not from a prior fixed case.",
    inputSchema: {
      question: z.string().min(1),
      userRole: z.string().default("ops_user").optional(),
      language: z.enum(["ko", "en", "auto"]).default("auto").optional()
    },
    outputSchema: answerDataOutputSchema,
    _meta: {
      ui: { resourceUri: WIDGET_URI, visibility: ["model", "app"] },
      "openai/outputTemplate": WIDGET_URI,
      "openai/widgetAccessible": true,
      "openai/toolInvocation/invoking": "Searching HVDC ontology corpus",
      "openai/toolInvocation/invoked": "HVDC ontology answer ready"
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  render_hvdc_answer_card: {
    title: "Render HVDC answer card",
    description:
      "Use this after every user-visible ask_hvdc_ontology answer to render the final HVDC answer card. Pass through the complete ask_hvdc_ontology structured answer.",
    inputSchema: answerDataOutputSchema,
    outputSchema: answerOutputSchema,
    _meta: {
      ui: { resourceUri: WIDGET_URI, visibility: ["model", "app"] },
      "openai/outputTemplate": WIDGET_URI,
      "openai/widgetAccessible": true,
      "openai/toolInvocation/invoking": "Rendering HVDC answer card",
      "openai/toolInvocation/invoked": "HVDC answer card ready"
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  route_question: {
    title: "Route HVDC question",
    description: "Use this to classify an HVDC question into ontology domains and required corpus documents.",
    inputSchema: {
      question: z.string().min(1),
      userRole: z.string().default("ops_user").optional(),
      language: z.enum(["ko", "en", "auto"]).default("auto").optional()
    },
    outputSchema: { route: routeSchema },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  search_ontology_corpus: {
    title: "Search HVDC ontology corpus",
    description:
      "Use this when you need evidence snippets from approved HVDC ontology documents. Do not use for public web search.",
    inputSchema: {
      query: z.string().min(1),
      requiredDocs: z.array(z.string()).optional(),
      domainHints: z.array(domainEnum).optional(),
      topK: z.number().min(1).max(20).default(8).optional()
    },
    outputSchema: { evidence: z.array(evidenceSchema) },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  resolve_any_key: {
    title: "Resolve HVDC any-key",
    description: "Use this to resolve BL, BOE, DO, invoice, HVDC code, site, SHPT, or milestone identifiers from a user question. When the resolved object is a ShipmentUnit, return the Cloudflare D1 Control Tower one-shot shipment report with ETD/ATD/ETA/ATA, cargo summary, destination requirements, site receipt dates, validation findings, and open actions.",
    inputSchema: { identifierOrQuestion: z.string().min(1) },
    outputSchema: {
      candidates: z.array(resolvedEntitySchema),
      controlTowerReports: z.array(controlTowerShipmentReportSchema).default([])
    },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  get_hvdc_case_status: {
    title: "Get HVDC WH Status case",
    description: "Use this to return the D1 Control Tower status projection for one HVDC WH Status Case No. from hvdc_wh_status.xlsx.",
    inputSchema: { caseNo: z.string().min(1) },
    outputSchema: { report: controlTowerShipmentReportSchema.nullable() },
    _meta: {
      "openai/outputTemplate": WIDGET_URI,
      "openai/widgetAccessible": true,
      ui: {
        resourceUri: WIDGET_URI,
        visibility: ["model", "app"]
      }
    },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  validate_answer: {
    title: "Validate HVDC answer grounding",
    description: "Use this to validate evidence coverage, master spine use, currentness, and human-gate requirements before final answer.",
    inputSchema: {
      question: z.string().min(1),
      evidenceIds: z.array(z.string()).optional()
    },
    outputSchema: {
      findings: z.array(
        z.object({
          ruleId: z.string(),
          reasonCode: z.string(),
          severity: z.string(),
          status: z.string(),
          targetObject: z.string(),
          evidenceIds: z.array(z.string()),
          message: z.string()
        })
      )
    },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  create_upload_url: {
    title: "Create HVDC upload URL",
    description:
      "Use this to create an OAuth Bearer-scope protected, Human-gate approved upload URL for an HVDC evidence attachment or source document. Requires files:upload scope and an approval record.",
    inputSchema: {
      fileName: z.string().min(1).max(240),
      mimeType: z.string().min(3).max(120),
      byteLength: z.number().int().min(0).max(100 * 1024 * 1024).optional(),
      purpose: uploadPurposeSchema,
      ttlSeconds: z.number().int().min(60).max(3600).default(600).optional(),
      approval: approvalSchema
    },
    outputSchema: createUploadUrlOutputSchema,
    _meta: {},
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false }
  },
  complete_upload: {
    title: "Complete HVDC upload",
    description:
      "Use this after a direct upload to confirm the OAuth Bearer-scope protected, Human-gate approved file is present in R2. Requires files:upload scope and an approval record.",
    inputSchema: {
      uploadId: z.string().min(8).max(160),
      approval: approvalSchema
    },
    outputSchema: completeUploadOutputSchema,
    _meta: {},
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false }
  },
  attach_uploaded_file: {
    title: "Attach uploaded HVDC file",
    description:
      "Use this to attach an uploaded R2 object to an HVDC target after OAuth Bearer authorization and Human-gate approval. Requires files:write scope and an approval record.",
    inputSchema: {
      uploadId: z.string().min(8).max(160),
      targetType: z.enum(["ShipmentUnit", "Document", "Invoice", "CommunicationEvent", "AuditRecord", "Other"]),
      targetRef: z.string().min(1).max(160),
      evidenceNote: z.string().min(5).max(500),
      approval: approvalSchema
    },
    outputSchema: attachUploadedFileOutputSchema,
    _meta: {},
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false }
  },
  write_file_dry_run: {
    title: "Dry-run HVDC file write",
    description:
      "Use this to create an OAuth Bearer-scope protected, Human-gate approved dry-run write proposal in the Cloudflare R2/D1 managed file store. Requires files:write scope and never mutates external ERP/WMS systems.",
    inputSchema: {
      targetPath: z.string().min(1).max(240),
      content: z.string().min(1).max(512 * 1024),
      baseContentHash: z.string().max(128).optional(),
      changeReason: z.string().min(5).max(500),
      approval: approvalSchema
    },
    outputSchema: writeDryRunOutputSchema,
    _meta: {},
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false }
  },
  write_file_commit: {
    title: "Commit HVDC file write",
    description:
      "Use this to commit a prior OAuth Bearer-scope protected, Human-gate approved dry-run write proposal into the Cloudflare R2/D1 managed file store. Requires files:write scope and an approval record.",
    inputSchema: {
      proposalId: z.string().min(8).max(160),
      commitReason: z.string().min(5).max(500),
      approval: approvalSchema
    },
    outputSchema: writeCommitOutputSchema,
    _meta: {},
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false }
  },
  check_cost_guard: {
    title: "Check HVDC invoice COST-GUARD",
    description:
      "Run the COST-GUARD engine on invoice lines. Returns per-line delta%, band (PASS/WARN/HIGH/CRITICAL), rate-mismatch flags, and human-gate requirement. Human gate fires when invoice total > 100,000 AED or band is HIGH/CRITICAL.",
    inputSchema: {
      invoiceNo: z.string().min(1),
      currency: z.enum(["AED", "USD"]).default("AED").optional(),
      lines: z.array(
        z.object({
          lineNo: z.string(),
          item: z.string().optional(),
          qty: z.number(),
          rate: z.number(),
          draftAmount: z.number(),
          standardAmount: z.number().nullable().optional(),
          currency: z.enum(["AED", "USD"]).optional(),
          evidenceIds: z.array(z.string()).optional()
        })
      )
    },
    outputSchema: {
      invoiceNo: z.string(),
      lines: z.array(z.object({
        lineNo: z.string(),
        item: z.string(),
        qty: z.number(),
        rate: z.number(),
        draftAmount: z.number(),
        standardAmount: z.number(),
        expectedByRate: z.number(),
        currency: z.enum(["AED", "USD"]),
        deltaPct: z.number().nullable(),
        band: z.enum(["PASS", "WARN", "HIGH", "CRITICAL"]),
        rateMismatch: z.boolean(),
        zeroStandard: z.boolean(),
        missingEvidence: z.boolean(),
        verdict: z.enum(["PASS", "BLOCK_FOR_REVIEW"]),
        humanGateRequired: z.boolean(),
        ruleViolations: z.array(z.string()),
        evidenceIds: z.array(z.string())
      })),
      invoiceTotalDraft: z.number(),
      invoiceTotalStandard: z.number(),
      invoiceTotalDeltaPct: z.number().nullable(),
      currency: z.enum(["AED", "USD"]),
      overallBand: z.enum(["PASS", "WARN", "HIGH", "CRITICAL"]),
      overallVerdict: z.enum(["PASS", "BLOCK_FOR_REVIEW"]),
      humanGateRequired: z.boolean(),
      blockReasons: z.array(z.string()),
      evidenceIds: z.array(z.string()),
      generatedAt: z.string()
    },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  check_mosb_gate: {
    title: "Check MOSB route gate (V-AGIDAS-001)",
    description:
      "Validate AGI/DAS offshore MOSB milestone chain. If milestone input is omitted, reads Cloudflare D1 milestone_event rows for the shipment. AGI/DAS site date/M130 is accepted as delivered; missing M115/M116/M117 MOSB evidence returns AMBER/WARN backfill required.",
    inputSchema: {
      shipmentUnitId: z.string().min(1),
      declaredDestination: z.string().min(1).optional(),
      routingPattern: z.string().min(1).optional(),
      milestones: z.array(
        z.object({
          code: z.string(),
          actualDt: z.string().nullable().optional(),
          approvedExceptionRef: z.string().nullable().optional()
        })
      ).optional()
    },
    outputSchema: {
      shipmentUnitId: z.string(),
      declaredDestination: z.string(),
      routingPattern: z.string(),
      status: z.enum(["PASS", "WARN", "BLOCK"]),
      appliedRule: z.string().nullable(),
      missingMilestones: z.array(z.string()),
      requiredEvidence: z.array(z.string()),
      siteReceiptStatus: z.literal("ARRIVED").optional(),
      deliveryStatus: z.literal("DELIVERED").optional(),
      dataQualityFinding: z.object({
        code: z.literal("MOSB_EVIDENCE_MISSING"),
        severity: z.literal("AMBER"),
        action: z.string(),
        backfillRequired: z.literal(true)
      }).optional(),
      ownerRole: z.string(),
      nextAction: z.string(),
      humanGateRequired: z.boolean(),
      message: z.string(),
      generatedAt: z.string()
    },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  check_doc_guardian: {
    title: "Check document guardian cross-doc consistency",
    description:
      "Cross-validate a set of HVDC shipment documents (CI, PL, BL, BOE, DO, MRR, etc.) for numeric integrity: qty, weight, containerNo, and packageCount consistency. Returns NumericIntegrityPct and BLOCK/WARN/PASS findings.",
    inputSchema: {
      documents: z.array(
        z.object({
          docId: z.string(),
          docType: z.string(),
          docNo: z.string().optional(),
          docHash: z.string().optional(),
          shipmentUnitId: z.string().optional(),
          qty: z.number().nullable().optional(),
          weight: z.number().nullable().optional(),
          currency: z.enum(["AED", "USD"]).optional(),
          amount: z.number().nullable().optional(),
          containerNo: z.string().nullable().optional(),
          packageCount: z.number().nullable().optional()
        })
      )
    },
    outputSchema: {
      docIds: z.array(z.string()),
      verificationStatus: z.enum(["PASS", "WARN", "BLOCK"]),
      crossDocIssues: z.array(
        z.object({
          field: z.string(),
          sourceDoc: z.string(),
          targetDoc: z.string(),
          sourceValue: z.string(),
          targetValue: z.string(),
          delta: z.string(),
          severity: z.enum(["WARN", "BLOCK"])
        })
      ),
      numericIntegrityPct: z.number(),
      evidenceAssertions: z.array(z.string()),
      auditRecordId: z.string(),
      humanGateRequired: z.boolean(),
      message: z.string(),
      generatedAt: z.string()
    },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  get_team_actions: {
    title: "Get HVDC team action proposals",
    description:
      "Route a shipment milestone and domain to the correct owner role and produce ActionProposals with required documents and due dates. Reads Cloudflare D1 action_queue rows for the shipment when available. PII is always masked (role-first, no raw contacts).",
    inputSchema: {
      shipmentUnitId: z.string().min(1),
      milestoneCode: z.string().min(1),
      domain: z.string().min(1),
      openExceptions: z.array(z.string()).optional()
    },
    outputSchema: {
      shipmentUnitId: z.string(),
      milestoneCode: z.string(),
      domain: z.string(),
      proposals: z.array(
        z.object({
          actionType: z.string(),
          targetObject: z.string(),
          ownerRole: z.string(),
          backupRole: z.string().nullable(),
          humanGateRequired: z.boolean(),
          dueAt: z.string().nullable(),
          requiredDocs: z.array(z.string()),
          piiMasked: z.literal(true)
        })
      ),
      message: z.string(),
      generatedAt: z.string()
    },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  }
};

export type HvdcToolName = keyof typeof HVDC_TOOL_DESCRIPTORS;

function buildRenderResultMeta(answer: GroundedAnswer): Record<string, unknown> {
  return {
    "openai/outputTemplate": WIDGET_URI,
    uiTemplate: WIDGET_URI,
    piiMasked: answer.piiMasked,
    ui: {
      ...answer.ui,
      resourceUri: WIDGET_URI,
      visibility: ["model", "app"]
    }
  };
}

function buildAskResultMeta(answer: GroundedAnswer): Record<string, unknown> {
  return {
    "openai/outputTemplate": WIDGET_URI,
    uiTemplate: WIDGET_URI,
    piiMasked: answer.piiMasked,
    ui: {
      resourceUri: WIDGET_URI,
      visibility: ["model", "app"]
    }
  };
}

function buildCaseStatusResultMeta(): Record<string, unknown> {
  return {
    "openai/outputTemplate": WIDGET_URI,
    uiTemplate: WIDGET_URI,
    piiMasked: true,
    ui: {
      resourceUri: WIDGET_URI,
      visibility: ["model", "app"]
    }
  };
}

function mergeResolvedEntities(primary: ResolvedEntity[], secondary: ResolvedEntity[]): ResolvedEntity[] {
  const seen = new Set<string>();
  const merged: ResolvedEntity[] = [];
  for (const entity of [...primary, ...secondary]) {
    const key = `${entity.entityType}|${entity.identifierScheme}|${entity.normalizedValue}|${entity.targetRid ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(entity);
  }
  return merged;
}

async function loadControlTowerShipmentReports(
  controlTower: HvdcControlTowerLookup | undefined,
  candidates: ResolvedEntity[]
): Promise<ControlTowerShipmentReport[]> {
  if (!controlTower?.getShipmentReport) return [];
  const shipmentIds = [
    ...new Set(
      candidates
        .filter((candidate) => candidate.entityType === "ShipmentUnit" && Boolean(candidate.targetRid))
        .map((candidate) => candidate.targetRid as string)
    )
  ].slice(0, 3);
  const reports = await Promise.all(
    shipmentIds.map(async (shipmentUnitId) => {
      try {
        return await controlTower.getShipmentReport?.(shipmentUnitId);
      } catch {
        return null;
      }
    })
  );
  return reports.filter((report): report is ControlTowerShipmentReport => Boolean(report));
}

function currentAuth(options: HvdcServerOptions): HvdcAuthContext {
  return options.auth ?? { authenticated: false, scopes: [] };
}

function missingAuth(requiredScopes: string[]): CreateUploadUrlResult {
  return {
    status: "AUTH_REQUIRED",
    humanGateRequired: true,
    requiredScopes,
    message: `OAuth Bearer token with scope ${requiredScopes.join(" ")} is required.`
  };
}

function insufficientScope(requiredScopes: string[]): CreateUploadUrlResult {
  return {
    status: "INSUFFICIENT_SCOPE",
    humanGateRequired: true,
    requiredScopes,
    message: `Bearer token is missing required scope ${requiredScopes.join(" ")}.`
  };
}

function storageUnavailable(feature: string): CreateUploadUrlResult {
  return {
    status: "STORAGE_UNAVAILABLE",
    humanGateRequired: true,
    message: `${feature} storage adapter is not configured for this runtime.`
  };
}

function requireScopes(options: HvdcServerOptions, requiredScopes: string[]): CreateUploadUrlResult | null {
  const auth = currentAuth(options);
  if (!auth.authenticated) return missingAuth(requiredScopes);
  const grantedScopes = new Set(auth.scopes);
  const hasAllScopes = requiredScopes.every((scope) => grantedScopes.has(scope));
  if (!hasAllScopes) return insufficientScope(requiredScopes);
  return null;
}

async function auditProtectedTool(
  options: HvdcServerOptions,
  toolName: string,
  input: unknown,
  output: unknown
): Promise<Record<string, unknown>> {
  const auditId = crypto.randomUUID();
  await options.audit?.(buildAuditRecord(toolName, input, { auditId, output }, true));
  if (output && typeof output === "object") {
    return { ...(output as Record<string, unknown>), auditId };
  }
  return { status: "VALIDATION_FAILED", humanGateRequired: true, auditId, message: "Invalid protected tool output." };
}

export function createHvdcServer(options: HvdcServerOptions = {}): McpServer {
  const server = new McpServer({ name: "hvdc-ontology-answer-app", version: "0.1.0" });
  const widgetHtml = options.widgetHtml ?? DEFAULT_WIDGET_HTML;
  const widgetDomain = options.widgetDomain ?? DEFAULT_WIDGET_DOMAIN;
  const renderToolWidgetAliasUri = "ui://hvdc/render_hvdc_answer_card.html";
  const widgetResourceMeta = {
    ui: {
      prefersBorder: true,
      domain: widgetDomain,
      csp: {
        connectDomains: [],
        resourceDomains: []
      }
    },
    "openai/widgetDescription": "HVDC ontology answer card showing verdict, route documents, evidence, validation findings, and next action.",
    "openai/widgetPrefersBorder": true,
    "openai/widgetDomain": widgetDomain,
    "openai/widgetCSP": {
      connect_domains: [],
      resource_domains: [],
      frame_domains: [],
      redirect_domains: []
    }
  };
  const createWidgetResource = (uri: string) => ({
    contents: [
      {
        uri,
        mimeType: RESOURCE_MIME_TYPE,
        text: widgetHtml,
        _meta: widgetResourceMeta
      }
    ]
  });

  registerAppResource(server, "hvdc-answer-widget", WIDGET_URI, {}, async () => createWidgetResource(WIDGET_URI));
  registerAppResource(
    server,
    "hvdc-answer-widget-v8-compat",
    PREVIOUS_WIDGET_URI,
    {},
    async () => createWidgetResource(PREVIOUS_WIDGET_URI)
  );
  registerAppResource(
    server,
    "hvdc-answer-widget-v7-compat",
    LEGACY_WIDGET_URI,
    {},
    async () => createWidgetResource(LEGACY_WIDGET_URI)
  );
  registerAppResource(
    server,
    "hvdc-answer-widget-v6-compat",
    V6_WIDGET_URI,
    {},
    async () => createWidgetResource(V6_WIDGET_URI)
  );
  registerAppResource(
    server,
    "hvdc-answer-widget-v5-compat",
    V5_WIDGET_URI,
    {},
    async () => createWidgetResource(V5_WIDGET_URI)
  );
  registerAppResource(
    server,
    "render_hvdc_answer_card",
    renderToolWidgetAliasUri,
    {},
    async () => createWidgetResource(renderToolWidgetAliasUri)
  );

  registerAppTool(
    server,
    "ask_hvdc_ontology",
    HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology,
    async ({ question, userRole, language }) => {
      return withSpan("ask_hvdc_ontology", async (span) => {
        span.setAttribute("hvdc.user_role", userRole ?? "ops_user");
        const answer = answerQuestion({ question, userRole, language });
        span.setAttribute("hvdc.verdict", answer.verdict);
        span.setAttribute("hvdc.validation_status", answer.validationStatus);
        await options.audit?.(buildAuditRecord("ask_hvdc_ontology", { question, userRole, language }, answer, answer.piiMasked));
        return {
          structuredContent: answer,
          content: [{ type: "text", text: answerToText(answer) }],
          _meta: buildAskResultMeta(answer)
        };
      });
    }
  );

  registerAppTool(
    server,
    "render_hvdc_answer_card",
    HVDC_TOOL_DESCRIPTORS.render_hvdc_answer_card,
    async (answer) => {
      try {
        const groundedAnswer = withUiState({ ...answer, evidenceTrace: answer.evidenceTrace ?? [] } as GroundedAnswer);
        return {
          structuredContent: groundedAnswer,
          content: [{ type: "text", text: answerToText(groundedAnswer) }],
          _meta: buildRenderResultMeta(groundedAnswer)
        };
      } catch (error) {
        const renderError = error instanceof Error ? error : new Error(String(error));
        const fallbackAnswer = withUiState(
          { ...answer, evidenceTrace: answer.evidenceTrace ?? [] } as GroundedAnswer,
          "TEMPLATE_FETCH_FAILED",
          renderError.message
        );
        logUiRenderFailure(fallbackAnswer, renderError);
        return {
          structuredContent: fallbackAnswer,
          content: [{ type: "text", text: answerToText(fallbackAnswer) }],
          _meta: buildRenderResultMeta(fallbackAnswer)
        };
      }
    }
  );

  registerAppTool(
    server,
    "route_question",
    HVDC_TOOL_DESCRIPTORS.route_question,
    async ({ question, userRole, language }) => {
      const route = routeQuestion(question, userRole, language);
      return {
        structuredContent: { route },
        content: [{ type: "text", text: JSON.stringify(route) }]
      };
    }
  );

  registerAppTool(
    server,
    "search_ontology_corpus",
    HVDC_TOOL_DESCRIPTORS.search_ontology_corpus,
    async ({ query, requiredDocs, domainHints, topK }) => {
      return withSpan("search_ontology_corpus", async (span) => {
        span.setAttribute("hvdc.query_length", String(query?.length ?? 0));
        const evidence = searchCorpus({
          query,
          requiredDocs,
          domainHints: domainHints as DomainHint[] | undefined,
          topK
        });
        return {
          structuredContent: { evidence },
          content: [{ type: "text", text: JSON.stringify({ evidenceCount: evidence.length }) }]
        };
      });
    }
  );

  registerAppTool(
    server,
    "resolve_any_key",
    HVDC_TOOL_DESCRIPTORS.resolve_any_key,
    async ({ identifierOrQuestion }) => {
      return withSpan("resolve_any_key", async (span) => {
        span.setAttribute("hvdc.identifier", String(identifierOrQuestion ?? "").slice(0, 64));
        const controlTowerCandidates = await options.controlTower?.resolveAnyKey?.(identifierOrQuestion) ?? [];
        const candidates = mergeResolvedEntities(controlTowerCandidates, resolveAnyKey(identifierOrQuestion));
        const controlTowerReports = await loadControlTowerShipmentReports(options.controlTower, candidates);
        span.setAttribute("hvdc.candidate_count", candidates.length);
        span.setAttribute("hvdc.report_count", controlTowerReports.length);
        return {
          structuredContent: { candidates, controlTowerReports },
          content: [{ type: "text", text: JSON.stringify({ candidateCount: candidates.length, reportCount: controlTowerReports.length }) }]
        };
      });
    }
  );

  registerAppTool(
    server,
    "get_hvdc_case_status",
    HVDC_TOOL_DESCRIPTORS.get_hvdc_case_status,
    async ({ caseNo }) => {
      return withSpan("get_hvdc_case_status", async (span) => {
        span.setAttribute("hvdc.case_no", String(caseNo ?? "").slice(0, 64));
        const report = await options.controlTower?.getCaseStatus?.(caseNo) ?? null;
        span.setAttribute("hvdc.report_found", report ? "true" : "false");
        return {
          structuredContent: { report },
          content: [{ type: "text", text: JSON.stringify({ found: Boolean(report), shipmentUnitId: report?.shipmentUnitId ?? null }) }],
          _meta: buildCaseStatusResultMeta()
        };
      });
    }
  );

  registerAppTool(
    server,
    "validate_answer",
    HVDC_TOOL_DESCRIPTORS.validate_answer,
    async ({ question }) => {
      return withSpan("validate_answer", async (span) => {
        span.setAttribute("hvdc.question_length", String(question?.length ?? 0));
        const route = routeQuestion(question);
        const evidence = searchCorpus({ query: question, requiredDocs: route.requiredDocs, domainHints: route.domains });
        const resolvedEntities = resolveAnyKey(question);
        const findings = validateGrounding({ question, route, evidence, resolvedEntities });
        return {
          structuredContent: { findings },
          content: [{ type: "text", text: JSON.stringify({ findingCount: findings.length }) }]
        };
      });
    }
  );

  registerAppTool(
    server,
    "create_upload_url",
    HVDC_TOOL_DESCRIPTORS.create_upload_url,
    async (input) => {
      const authFailure = requireScopes(options, ["files:upload"]);
      const result = authFailure ?? (options.storage?.createUploadUrl
        ? await options.storage.createUploadUrl({ ...(input as Omit<CreateUploadUrlInput, "auth">), auth: currentAuth(options) })
        : storageUnavailable("R2 upload"));
      const structuredContent = await auditProtectedTool(options, "create_upload_url", input, result);
      return {
        structuredContent,
        content: [{ type: "text", text: JSON.stringify(structuredContent) }]
      };
    }
  );

  registerAppTool(
    server,
    "complete_upload",
    HVDC_TOOL_DESCRIPTORS.complete_upload,
    async (input) => {
      const authFailure = requireScopes(options, ["files:upload"]);
      const result = authFailure ?? (options.storage?.completeUpload
        ? await options.storage.completeUpload({ ...(input as Omit<CompleteUploadInput, "auth">), auth: currentAuth(options) })
        : storageUnavailable("R2 upload completion"));
      const structuredContent = await auditProtectedTool(options, "complete_upload", input, result);
      return {
        structuredContent,
        content: [{ type: "text", text: JSON.stringify(structuredContent) }]
      };
    }
  );

  registerAppTool(
    server,
    "attach_uploaded_file",
    HVDC_TOOL_DESCRIPTORS.attach_uploaded_file,
    async (input) => {
      const authFailure = requireScopes(options, ["files:write"]);
      const result = authFailure ?? (options.storage?.attachUploadedFile
        ? await options.storage.attachUploadedFile({ ...(input as Omit<AttachUploadedFileInput, "auth">), auth: currentAuth(options) })
        : storageUnavailable("R2 attachment"));
      const structuredContent = await auditProtectedTool(options, "attach_uploaded_file", input, result);
      return {
        structuredContent,
        content: [{ type: "text", text: JSON.stringify(structuredContent) }]
      };
    }
  );

  registerAppTool(
    server,
    "write_file_dry_run",
    HVDC_TOOL_DESCRIPTORS.write_file_dry_run,
    async (input) => {
      const authFailure = requireScopes(options, ["files:write"]);
      const result = authFailure ?? (options.storage?.createWriteProposal
        ? await options.storage.createWriteProposal({ ...(input as Omit<WriteFileDryRunInput, "auth">), auth: currentAuth(options) })
        : storageUnavailable("R2/D1 write proposal"));
      const structuredContent = await auditProtectedTool(options, "write_file_dry_run", input, result);
      return {
        structuredContent,
        content: [{ type: "text", text: JSON.stringify(structuredContent) }]
      };
    }
  );

  registerAppTool(
    server,
    "write_file_commit",
    HVDC_TOOL_DESCRIPTORS.write_file_commit,
    async (input) => {
      const authFailure = requireScopes(options, ["files:write"]);
      const result = authFailure ?? (options.storage?.commitWriteProposal
        ? await options.storage.commitWriteProposal({ ...(input as Omit<WriteFileCommitInput, "auth">), auth: currentAuth(options) })
        : storageUnavailable("R2/D1 write commit"));
      const structuredContent = await auditProtectedTool(options, "write_file_commit", input, result);
      return {
        structuredContent,
        content: [{ type: "text", text: JSON.stringify(structuredContent) }]
      };
    }
  );

  registerAppTool(
    server,
    "check_cost_guard",
    HVDC_TOOL_DESCRIPTORS.check_cost_guard,
    async ({ invoiceNo, currency, lines }) => {
      return withSpan("check_cost_guard", async (span) => {
        const result = calcCostGuard(invoiceNo, lines, currency ?? "AED");
        await options.audit?.(buildAuditRecord("check_cost_guard", { invoiceNo, currency, lineCount: lines.length }, result, true));
        return {
          structuredContent: result,
          content: [{ type: "text", text: JSON.stringify({ invoiceNo, overallBand: result.overallBand, humanGateRequired: result.humanGateRequired, blockReasons: result.blockReasons }) }]
        };
      });
    }
  );

  registerAppTool(
    server,
    "check_mosb_gate",
    HVDC_TOOL_DESCRIPTORS.check_mosb_gate,
    async ({ shipmentUnitId, declaredDestination, routingPattern, milestones }) => {
      const shipment = await options.controlTower?.getShipmentUnit?.(shipmentUnitId);
      const d1Milestones = milestones && milestones.length > 0
        ? milestones
        : await options.controlTower?.listMilestones?.(shipmentUnitId) ?? [];
      const result = checkMosbGate(
        shipmentUnitId,
        declaredDestination ?? shipment?.declaredDestinationSet ?? "UNKNOWN",
        routingPattern ?? shipment?.routingPattern ?? "UNKNOWN",
        d1Milestones
      );
      await options.audit?.(buildAuditRecord("check_mosb_gate", { shipmentUnitId, declaredDestination, routingPattern }, result, true));
      return {
        structuredContent: result,
        content: [{ type: "text", text: JSON.stringify({ status: result.status, appliedRule: result.appliedRule, missingMilestones: result.missingMilestones, humanGateRequired: result.humanGateRequired }) }]
      };
    }
  );

  registerAppTool(
    server,
    "check_doc_guardian",
    HVDC_TOOL_DESCRIPTORS.check_doc_guardian,
    async ({ documents }) => {
      const result = checkDocGuardian(documents);
      await options.audit?.(buildAuditRecord("check_doc_guardian", { docCount: documents.length }, result, true));
      return {
        structuredContent: result,
        content: [{ type: "text", text: JSON.stringify({ verificationStatus: result.verificationStatus, numericIntegrityPct: result.numericIntegrityPct, issueCount: result.crossDocIssues.length }) }]
      };
    }
  );

  registerAppTool(
    server,
    "get_team_actions",
    HVDC_TOOL_DESCRIPTORS.get_team_actions,
    async ({ shipmentUnitId, milestoneCode, domain, openExceptions }) => {
      const d1Proposals = await options.controlTower?.listActionQueue?.(shipmentUnitId, milestoneCode, domain) ?? [];
      const result = d1Proposals.length > 0
        ? {
            shipmentUnitId,
            milestoneCode,
            domain,
            proposals: d1Proposals,
            message: `${d1Proposals.length} action proposal(s) loaded from Control Tower action_queue for ${shipmentUnitId}.`,
            generatedAt: new Date().toISOString()
          }
        : routeTeamAction(shipmentUnitId, milestoneCode, domain, openExceptions ?? []);
      await options.audit?.(buildAuditRecord("get_team_actions", { shipmentUnitId, milestoneCode, domain }, result, true));
      return {
        structuredContent: result,
        content: [{ type: "text", text: JSON.stringify({ proposalCount: result.proposals.length, message: result.message }) }]
      };
    }
  );

  return server;
}
