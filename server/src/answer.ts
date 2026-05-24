import type {
  ActionRecommendation,
  EvidenceTraceItem,
  EvidenceSnippet,
  GraphPath,
  GroundedAnswer,
  IntentRoute,
  ResolvedEntity,
  ValidationFinding,
  Verdict
} from "./types.js";
import { loadCorpus, searchCorpus } from "./corpus.js";
import { isDailyLogisticsKpiQuestion, resolveAnyKey, routeQuestion } from "./router.js";
import { maskPii, sha256 } from "./redact.js";
import { evaluateShipmentRule } from "./shipment-rule.js";
import { mergeShipmentValidation } from "./shipment-validation.js";
import { toDecisionCardPayload } from "./decision-card.js";

const CURRENTNESS_TERMS = /\b(?:moiat|fanr|dcd|adnoc|cicpa|permit|tariff|rate|law|regulation)\b|규정|허가|요율/i;
const AGI_DAS_M130 = /\b(AGI|DAS)\b/i;
const M130 = /\bM130\b|site receipt|site closure|닫아도|close/i;
const MISSING_EVIDENCE_TERMS = /without|missing|없|없이|누락|미결|부재|만\s*있|only/i;
const CUSTOMS_DECISION_TERMS = /customs|boe|release|permit|ci\/pl|hs|coo|통관|반출|허가/i;
const COST_DECISION_TERMS = /\b(?:invoice|cost|costguard|rate|rateref|tariff|tariffref|aed|usd)\b|청구|정산|비용|요율/i;
const COST_FINAL_DECISION_TERMS = /approve|approval|confirm|confirmed|post|write|반영|승인|확정|가능/i;
const OOG_SAFETY_TERMS = /oog|lift plan|lifting plan|lashing|cog|dims|weight|permit|중량|리프팅|양중|안전/i;
const CLAIM_TERMS = /claim|claim letter|pod|survey|photo|mrr|bl clause|클레임|손상|분쟁/i;
const FLOW_CODE = /flow code|confirmedflowcode|confirmed flow code/i;
const FLOW_CODE_MISUSE = /route|routing|customs|invoice|kpi|bucket|classification|분류|경로|통관|비용|청구|지표/i;
const ANY_KEY_AMBIGUITY = /ambiguous|ambiguity|unclear|multiple|duplicate|same|which|모호|중복|여러|둘 다|같은|어느|하나만/i;
const P2_MARKER = /\bP2\b|보안등급\s*P2|P2\s*자료/i;
const P2_RAW_CONTENT_TERMS =
  /원문|원본|계약\s*단가|실명|내부\s*링크|raw\s+(?:text|content|contract|rate)|unit\s*price|contract\s*rate|unredacted|비식별\s*전/i;
const P2_OUTPUT_ACTION_TERMS =
  /보여|출력|노출|포함|include|expose|render|export|publish|share|카드|card|붙여|그대로/i;
const HUMAN_GATE_TERMS =
  /write[- ]?back|send|export|publish|approve|approval|invoice|cost|rate|tariff|report|lock|locked|confirm|confirmed|whatsapp|email|청구|정산|승인|보고서|확정|잠금|전송|발송|보내|이메일|메일|내보내기/i;
const EMAIL_EXTERNAL_SEND_TERMS =
  /(?:send|external\s+send|send\s+email|이메일\s*보내|메일\s*보내|보내줘|발송해|전송해|발송|전송)/i;
const EMAIL_DRAFT_ONLY_TERMS =
  /draft|compose|write|초안|작성|draft\s+reply|답장\s*작성|회신\s*작성/i;
const SYSTEM_INTENTS = new Set([
  "SYSTEM_DIAGNOSTIC",
  "ONTOLOGY_PATCH_REVIEW",
  "CARD_RENDERING_AUDIT",
  "RULEPACK_GAP_ANALYSIS",
  "ROUTER_QA",
  "EVIDENCE_QA",
  "SCHEMA_BOUNDARY_REVIEW",
  "VALIDATION_POLICY_REVIEW"
]);
const GENERIC_QUERY_TERMS = new Set([
  "the",
  "and",
  "for",
  "with",
  "status",
  "current",
  "needed",
  "please",
  "알려줘",
  "확인해줘",
  "어디에",
  "현재",
  "기준",
  "되나",
  "돼"
]);
const TRACE_GENERIC_TERMS = new Set([
  ...GENERIC_QUERY_TERMS,
  "owner",
  "action",
  "review",
  "next",
  "required",
  "request",
  "ontology",
  "data",
  "ops",
  "user"
]);

function hasP2LeakageRisk(question: string): boolean {
  return P2_RAW_CONTENT_TERMS.test(question) && (P2_MARKER.test(question) || P2_OUTPUT_ACTION_TERMS.test(question));
}

function isEmailExternalSendRequest(question: string): boolean {
  return EMAIL_EXTERNAL_SEND_TERMS.test(question) && !EMAIL_DRAFT_ONLY_TERMS.test(question);
}

export function validateGrounding(args: {
  question: string;
  route: IntentRoute;
  evidence: EvidenceSnippet[];
  resolvedEntities?: ResolvedEntity[];
  piiMasked?: boolean;
}): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const evidenceIds = args.evidence.map((item) => item.id);
  const isSystemIntent = SYSTEM_INTENTS.has(args.route.intent);

  if (isSystemIntent) {
    findings.push({
      ruleId: "SYS-ROUTER-001",
      reasonCode: "SYSTEM_DIAGNOSTIC_ROUTED",
      severity: "INFO",
      status: "PASS",
      targetObject: "IntentRoute",
      evidenceIds,
      message: "System/card diagnostic intent is isolated from email draft, external send, and cost approval rulepacks."
    });
  }

  if (hasP2LeakageRisk(args.question)) {
    findings.push({
      ruleId: "V-P2-PROMPT-001",
      reasonCode: "P2_LEAKAGE_RISK",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "P2NdaBoundary",
      evidenceIds,
      message: "P2 raw text, rates, real names, and internal links must be redacted before any card, export, or publication output."
    });
  }

  if (!args.route.requiredDocs.some((doc) => doc.includes("CONSOLIDATED-00"))) {
    findings.push({
      ruleId: "A-ROUTE-001",
      reasonCode: "MISSING_REQUIRED_DOC",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "IntentRoute",
      evidenceIds: [],
      message: "CONSOLIDATED-00 master spine is mandatory for ontology/operations answers."
    });
  }

  const hasMaster = args.evidence.some((item) => item.docId.includes("CONSOLIDATED-00"));
  if (!hasMaster) {
    findings.push({
      ruleId: "A-ROUTE-002",
      reasonCode: "MISSING_MASTER_EVIDENCE",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "EvidenceSnippet",
      evidenceIds,
      message: "CONSOLIDATED-00 evidence was not retrieved; answer must pause."
    });
  }

  if (args.evidence.length === 0) {
    findings.push({
      ruleId: "A-ANS-001",
      reasonCode: "INSUFFICIENT_EVIDENCE",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "GroundedAnswer",
      evidenceIds: [],
      message: "No EvidenceSnippet was found for factual answer."
    });
  }

  if (FLOW_CODE.test(args.question)) {
    const isMisuse = FLOW_CODE_MISUSE.test(args.question);
    findings.push({
      ruleId: "A-FLOW-001",
      reasonCode: isMisuse ? "FLOW_CODE_SCOPE_VIOLATION" : "FLOW_CODE_SCOPE_INFO",
      severity: isMisuse ? "BLOCK" : "INFO",
      status: isMisuse ? "BLOCK" : "PASS",
      targetObject: "WarehouseFlowPolicy",
      evidenceIds,
      message: "Flow Code is WHP-only and must not be used as shipment route, customs stage, invoice field, or operations KPI bucket."
    });
  }

  if (AGI_DAS_M130.test(args.question) && M130.test(args.question)) {
    findings.push({
      ruleId: "V-AGIDAS-001",
      reasonCode: "MOSB_EVIDENCE_MISSING",
      severity: "WARN",
      status: "WARN",
      targetObject: "SiteReceipt/M130",
      evidenceIds,
      message: "AGI/DAS site date is accepted as M130 Site Arrived / delivered; missing M115/M116/M117 MOSB-chain evidence is an AMBER backfill gap."
    });
  }

  if (CUSTOMS_DECISION_TERMS.test(args.question) && MISSING_EVIDENCE_TERMS.test(args.question)) {
    findings.push({
      ruleId: "SCT-CUSTOMS-001",
      reasonCode: "SCT_CUSTOMS_EVIDENCE_REQUIRED",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "CustomsEvidenceMatrix",
      evidenceIds,
      message: "Customs decisions require CI/PL, HS, COO, BOE, and permit evidence before release or approval."
    });
  }

  if (!isSystemIntent && COST_DECISION_TERMS.test(args.question) && COST_FINAL_DECISION_TERMS.test(args.question)) {
    findings.push({
      ruleId: "SCT-COST-001",
      reasonCode: "SCT_COST_EVIDENCE_REQUIRED",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "CostEvidenceMatrix",
      evidenceIds,
      message: "Cost or invoice decisions require InvoiceLine, RateRef, TariffRef, and BOE/DO/Port evidence before approval or write-back."
    });
  }

  if (OOG_SAFETY_TERMS.test(args.question) && MISSING_EVIDENCE_TERMS.test(args.question)) {
    findings.push({
      ruleId: "SCT-OOG-001",
      reasonCode: "SCT_OOG_SAFETY_EVIDENCE_REQUIRED",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "OogSafetyEvidenceMatrix",
      evidenceIds,
      message: "OOG/Safety decisions require dims, weight, COG, lift plan, lashing, and permit evidence before proceeding."
    });
  }

  if (CLAIM_TERMS.test(args.question) && MISSING_EVIDENCE_TERMS.test(args.question)) {
    findings.push({
      ruleId: "SCT-CLAIM-001",
      reasonCode: "SCT_CLAIM_EVIDENCE_REQUIRED",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "ClaimEvidenceMatrix",
      evidenceIds,
      message: "Claim decisions require POD, MRR, photo, survey, and BL clause evidence before final claim position or letter issue."
    });
  }

  if (CURRENTNESS_TERMS.test(args.question)) {
    findings.push({
      ruleId: "A-CURRENT-001",
      reasonCode: "STALE_SOURCE_RISK",
      severity: "WARN",
      status: "WARN",
      targetObject: "RegulatoryOrRateAnswer",
      evidenceIds,
      message: "Current regulation/rate/SOP claims require approved current source refresh before final operational use."
    });
  }

  if (args.piiMasked) {
    findings.push({
      ruleId: "A-PII-001",
      reasonCode: "PII_MASKED",
      severity: "INFO",
      status: "PASS",
      targetObject: "RedactedInput",
      evidenceIds,
      message: "Raw phone, email, or token-like text was masked before routing, retrieval, answer composition, and audit."
    });
  }

  if (
    !isSystemIntent &&
    HUMAN_GATE_TERMS.test(args.question) &&
    (args.route.intent !== "EMAIL_DRAFT" || isEmailExternalSendRequest(args.question))
  ) {
    findings.push({
      ruleId: "A-ACTION-001",
      reasonCode: "HUMAN_GATE_REQUIRED",
      severity: "WARN",
      status: "WARN",
      targetObject: "HumanGate",
      evidenceIds,
      message: "Write, send, export, report publication, invoice, cost, or approval actions require Human-gate before operational use."
    });
  }

  if (hasAmbiguousAnyKey(args.question, args.resolvedEntities ?? [])) {
    findings.push({
      ruleId: "A-ANYKEY-001",
      reasonCode: "AMBIGUOUS_ANY_KEY",
      severity: "WARN",
      status: "WARN",
      targetObject: "ResolvedEntity",
      evidenceIds,
      message: "Multiple any-key identifier schemes were detected in an ambiguous request; require Data Steward review before selecting one."
    });
  }

  return findings;
}

function hasAmbiguousAnyKey(question: string, resolvedEntities: ResolvedEntity[]): boolean {
  if (!ANY_KEY_AMBIGUITY.test(question)) return false;
  const schemes = new Set(resolvedEntities.map((entity) => entity.identifierScheme));
  return schemes.size >= 2;
}

function deriveVerdict(evidence: EvidenceSnippet[], findings: ValidationFinding[], route: IntentRoute, question: string): Verdict {
  if (findings.some((f) => f.reasonCode === "P2_LEAKAGE_RISK")) return "ZERO";
  if (SYSTEM_INTENTS.has(route.intent)) return "DIAGNOSTIC";
  if (route.intent === "EMAIL_DRAFT") return isEmailExternalSendRequest(question) ? "PENDING_APPROVAL" : "DRAFT_READY";
  if (evidence.length === 0) return "NO_EVIDENCE";
  if (findings.some((f) => f.status === "BLOCK")) return "BLOCK";
  if (findings.some((f) => f.status === "WARN")) return "WARN";
  if (findings.some((f) => f.ruleId === "A-FLOW-001")) return "INFO";
  return "PASS";
}

function buildGraphPath(question: string, route: IntentRoute): GraphPath | null {
  const entities = resolveAnyKey(question);
  const isMetaReview = SYSTEM_INTENTS.has(route.intent);
  const systemComponents = entities.filter((item) => item.entityType === "SystemComponent");
  const operationalObjects = entities
    .filter((item) => item.entityType !== "SystemComponent")
    .map((item) => item.normalizedValue);

  if (isMetaReview) {
    const startNodes = systemComponents.length > 0
      ? systemComponents.map((item) => item.normalizedValue)
      : ["SCT_ONTOLOGY CARD"];
    const firstStart = startNodes[0];
    return {
      startNode: firstStart,
      startNodes,
      edges: [
        { from: firstStart, relation: "diagnoses", to: route.intent },
        { from: route.intent, relation: "selects", to: "SYSTEM_QA_RULEPACK" },
        { from: "SYSTEM_QA_RULEPACK", relation: "blocks", to: "EMAIL_DRAFT / COST_APPROVAL / WRITE_BACK" },
        { from: "SYSTEM_QA_RULEPACK", relation: "renders", to: "DecisionCard" }
      ],
      riskEdges: [
        {
          from: firstStart,
          risk: "meta-review prompt could be misclassified as operational action without hard-negative routing",
          to: "EMAIL_DRAFT / COST_APPROVAL / WRITE_BACK",
          severity: "WARN"
        }
      ],
      endNode: "DecisionCard DIAGNOSTIC",
      operationalObjects,
      isMetaReview: true,
      pathConfidence: route.confidence
    };
  }

  const site = entities.find((item) => item.identifierScheme === "SITE")?.normalizedValue ?? "HVDC Logistics Question";
  const milestone = entities.find((item) => item.identifierScheme === "MILESTONE")?.normalizedValue ?? "MilestoneEvent";

  if (entities.length === 0 && !FLOW_CODE.test(question)) return null;
  const startNodes = entities.length > 0
    ? entities.map((item) => item.normalizedValue)
    : ["WarehouseHandlingProfile.confirmedFlowCode"];

  return {
    startNode: startNodes[0] ?? "Question",
    startNodes,
    edges: [
      { from: startNodes[0] ?? "Question", relation: "routes_to", to: "CONSOLIDATED-00 Master Ontology" },
      { from: "CONSOLIDATED-00 Master Ontology", relation: "grounds", to: "ShipmentUnit / Document / Invoice" },
      { from: "ShipmentUnit / Document / Invoice", relation: "checks", to: milestone },
      { from: milestone, relation: "applies_to", to: site }
    ],
    endNode: site,
    operationalObjects,
    isMetaReview: false,
    pathConfidence: 0.88
  };
}

function tokenizeForSupport(input: string): string[] {
  return Array.from(
    new Set(
      input
        .toLowerCase()
        .replace(/[^a-z0-9가-힣_/-]+/g, " ")
        .split(/\s+/)
        .filter((term) => term.length >= 2 && !GENERIC_QUERY_TERMS.has(term))
    )
  );
}

function hasEvidenceSupport(question: string, evidence: EvidenceSnippet[], piiMasked = false): boolean {
  if (evidence.length === 0) return false;
  const terms = tokenizeForSupport(question);
  if (terms.length === 0) return true;
  const searchableEvidence = evidence
    .map((item) => `${item.docId} ${item.title} ${item.sectionPath} ${item.snippet}`.toLowerCase())
    .join("\n");
  if (terms.some((term) => searchableEvidence.includes(term))) return true;
  // PII-masked questions are inherently about contact/identity; accept evidence from
  // master-ontology or communication docs as they are canonical references for such queries.
  if (piiMasked) {
    return evidence.some((e) => /master-ontology|communication/i.test(e.docId));
  }
  return false;
}

function matchingEvidenceIds(text: string, evidence: EvidenceSnippet[]): string[] {
  if (evidence.length === 0) return [];
  const terms = tokenizeForSupport(text).filter((term) => !TRACE_GENERIC_TERMS.has(term));
  if (terms.length === 0) return [];
  return evidence
    .filter((item) => {
      const haystack = `${item.docId} ${item.title} ${item.sectionPath} ${item.snippet}`.toLowerCase();
      return terms.filter((term) => haystack.includes(term)).length >= Math.min(2, terms.length);
    })
    .map((item) => item.id);
}

function buildEvidenceTrace(args: {
  core: Pick<GroundedAnswer, "summary" | "businessImpact" | "details" | "actions">;
  evidence: EvidenceSnippet[];
}): EvidenceTraceItem[] {
  const formatActionAnswerText = (action: ActionRecommendation): string =>
    `${action.actionType} - ${action.ownerRole}${action.humanGateRequired ? " (Human-gate required)" : ""}`;
  const traceInputs: Array<{
    targetType: EvidenceTraceItem["targetType"];
    targetIndex: number | null;
    answerText: string;
  }> = [
    { targetType: "summary", targetIndex: null, answerText: args.core.summary },
    { targetType: "businessImpact", targetIndex: null, answerText: args.core.businessImpact },
    ...args.core.details.map((answerText, index) => ({ targetType: "detail" as const, targetIndex: index, answerText })),
    ...args.core.actions.map((action, index) => ({
      targetType: "action" as const,
      targetIndex: index,
      answerText: formatActionAnswerText(action)
    }))
  ];

  return traceInputs.map((item) => {
    const evidenceIds = item.targetType === "action" ? [] : matchingEvidenceIds(item.answerText, args.evidence);
    return {
      ...item,
      supportState: evidenceIds.length > 0 ? "SUPPORTED" : "NO_DIRECT_EVIDENCE",
      evidenceIds
    };
  });
}

function composeSummary(question: string, verdict: Verdict, route: IntentRoute): Pick<GroundedAnswer, "summary" | "businessImpact" | "details" | "actions"> {
  if (verdict === "ZERO") {
    return {
      summary: "P2 원문, 계약 단가, 실명, 내부 링크 노출 요청은 중단했습니다. 비식별 요약과 sourceHash 기준으로 다시 요청해야 합니다.",
      businessImpact: "P2 자료가 카드, export, publish 출력에 섞이면 NDA와 내부 보안 분리 원칙을 위반할 수 있습니다.",
      details: [
        "원문, 실명, 단가표, 내부 링크는 카드 본문이나 보고서 산출물에 그대로 넣지 않습니다.",
        "필요한 경우 Material ID, redacted snippet, sourceHash만 남기고 원문은 Evidence Drawer 내부 보안 경계 밖으로 내보내지 않습니다.",
        "ZERO 판정은 확정 산출, 외부 공유, publish, export를 차단합니다."
      ],
      actions: [
        {
          actionType: "REQUEST_REDACTED_P2_SUMMARY",
          ownerRole: "Data Protection / Ontology Owner",
          parameters: { requiredInput: "Material ID, redacted snippet, sourceHash" },
          humanGateRequired: true,
          dueBasis: "Before any redacted operational summary is reused",
          dueAt: null
        }
      ]
    };
  }

  if (verdict === "NO_EVIDENCE") {
    return {
      summary: "관련 온톨로지 근거를 찾지 못해 업무 답변을 중단했습니다.",
      businessImpact: "근거 없는 답변은 현장 지시, 통관, 비용, site receipt 판단 오류로 이어질 수 있습니다.",
      details: [
        "CONSOLIDATED-00 master spine 또는 target extension 문서에서 EvidenceSnippet을 확보해야 합니다.",
        "질문에 BL/BOE/DO/Invoice/HVDC_CODE/Site/Milestone 중 하나를 추가하면 재조회 정확도가 올라갑니다."
      ],
      actions: [
        {
          actionType: "REQUEST_SOURCE_OR_IDENTIFIER",
          ownerRole: "Ontology/Data Owner",
          parameters: { requiredInput: "doc section or any-key identifier" },
          humanGateRequired: true,
          dueAt: null
        }
      ]
    };
  }

  if (FLOW_CODE.test(question)) {
    return {
      summary: "Flow Code는 WHP/warehouse flow 용어로만 사용하며 route classification, customs stage, invoice bucket으로 쓰면 안 됩니다.",
      businessImpact: "Flow Code를 route나 cost KPI로 오용하면 WMS-Operations-KG 간 semantic mismatch가 발생합니다.",
      details: [
        "WHP/warehouse 질문에는 CONSOLIDATED-02를 target extension으로 사용합니다.",
        "Shipment routing은 RoutingPattern 또는 MilestoneEvent로 분리하십시오.",
        "문서/통관/비용 판단에는 Document/OCR, Port, CostGuard evidence를 별도로 조회해야 합니다."
      ],
      actions: [
        {
          actionType: "KEEP_FLOW_CODE_WHP_ONLY",
          ownerRole: "Ontology Owner",
          parameters: { semanticBoundary: "WHP only" },
          humanGateRequired: false,
          dueAt: null
        }
      ]
    };
  }

  if (AGI_DAS_M130.test(question) && M130.test(question)) {
    return {
      summary: "AGI/DAS site date가 있으면 M130 Site Arrived / 현장 배송 완료로 인정합니다. M115/M116/M117 누락은 BLOCK이 아니라 AMBER backfill 대상입니다.",
      businessImpact: "site receipt를 부정하면 실제 배송 완료 건이 미완료로 남아 KPI와 재고가 왜곡됩니다. MOSB chain 누락은 배송 부정이 아니라 evidence gap으로 관리합니다.",
      details: [
        "CONSOLIDATED-00 master spine을 기준으로 material chain과 marine evidence를 함께 봐야 합니다.",
        "Site track과 MOSB track을 분리해 AGI/DAS site date는 M130.actualDt로 먼저 인정합니다.",
        "M115/M116/M117이 없으면 MOSB_EVIDENCE_MISSING finding을 만들고 Backfill Required로 처리합니다."
      ],
      actions: [
        {
          actionType: "BACKFILL_MOSB_CHAIN_EVIDENCE",
          ownerRole: "Marine / Material Chain Owner",
          parameters: { requiredEvidence: "M115/M116/M117 backfill evidence", dataQualityFinding: "MOSB_EVIDENCE_MISSING" },
          humanGateRequired: false,
          dueAt: null
        }
      ]
    };
  }

  if (isDailyLogisticsKpiQuestion(question)) {
    return {
      summary: "Daily logistics KPI 질문은 operations dashboard 기준으로 정리합니다. DET/DEM은 CostGuard audit이 아니라 지연·비용 노출 운영 리스크 KPI로 집계합니다.",
      businessImpact: "Delivery, customs, ETA, vessel, packing, return, scrap 활동을 날짜별 KPI로 분리하면 지연 원인과 follow-up owner를 빠르게 확인할 수 있습니다.",
      details: [
        "날짜, site, owner, activity type, shipment key, risk status 기준으로 daily report 행을 정규화합니다.",
        "Delivery/Collection, Customs Clearance, ETA/New ETA, SR/Lifting Inspection, vessel movement, packing list, return/rectification, scrap activity를 각각 KPI bucket으로 집계합니다.",
        "DET/DEM은 invoice approval이 아니라 operations delay/cost exposure watchlist로 표시하고, 별도 비용 감사 질문이 들어올 때만 invoice/cost 검토로 분리합니다."
      ],
      actions: [
        {
          actionType: "BUILD_DAILY_LOGISTICS_KPI_DASHBOARD",
          ownerRole: "Operations Analyst",
          parameters: {
            primaryDocs: "CONSOLIDATED-00, CONSOLIDATED-03, CONSOLIDATED-09",
            detDemHandling: "operations risk KPI only"
          },
          humanGateRequired: false,
          dueAt: null
        }
      ]
    };
  }

  if (SYSTEM_INTENTS.has(route.intent)) {
    const actionByIntent: Partial<Record<IntentRoute["intent"], string>> = {
      CARD_RENDERING_AUDIT: "RUN_CARD_RENDERING_AUDIT",
      ONTOLOGY_PATCH_REVIEW: "REVIEW_ONTOLOGY_CARD_PATCH_SPEC",
      RULEPACK_GAP_ANALYSIS: "RUN_RULEPACK_GAP_ANALYSIS",
      ROUTER_QA: "RUN_ROUTER_QA",
      EVIDENCE_QA: "RUN_EVIDENCE_QA",
      SCHEMA_BOUNDARY_REVIEW: "REVIEW_SCHEMA_BOUNDARY",
      VALIDATION_POLICY_REVIEW: "REVIEW_VALIDATION_POLICY"
    };
    const actionType = actionByIntent[route.intent] ?? "RUN_SYSTEM_QA_RULEPACK";
    return {
      summary: "SCT_ONTOLOGY CARD 시스템 점검 요청으로 분류했습니다. 이메일 초안이나 비용 승인으로 처리하지 않습니다.",
      businessImpact: "router, validation, evidence, schema 점검은 운영 판단 카드 품질을 확인하는 읽기/진단 작업입니다.",
      details: [
        "SYSTEM_QA_RULEPACK을 우선 적용하고 COMM/COST write rulepack은 차단합니다.",
        "email, cost 같은 단어가 포함되어도 초안 작성이나 승인 실행 intent로 승격하지 않습니다.",
        "필요한 출력은 진단 결과, patch backlog, acceptance criteria, 회귀 테스트 시나리오입니다."
      ],
      actions: [
        {
          actionType,
          ownerRole: "Ontology Platform Owner",
          parameters: {
            intent: route.intent,
            rulePacks: route.rulePackIds.join(", "),
            blockedActions: route.blockedActions.join(", ")
          },
          humanGateRequired: false,
          dueAt: null
        }
      ]
    };
  }

  if (route.intent === "EMAIL_DRAFT") {
    const sendRequested = isEmailExternalSendRequest(question);
    return {
      summary: sendRequested
        ? "이 질문은 HVDC 물류 이메일 외부 발송 요청입니다. 초안 검토와 승인 전에는 실제 발송하지 않습니다."
        : "이 질문은 HVDC 물류 이메일 답장 작성 요청입니다. sct_ontology 검토 후 현재 제공된 이메일 문맥에 맞춰 초안을 분리해야 합니다.",
      businessImpact: sendRequested
        ? "승인 없는 외부 발송은 잘못된 수신자, 미검증 운영 지시, PII/NDA 노출로 이어질 수 있습니다."
        : "이메일 초안 내용을 특정 과거 케이스로 고정하지 않으면 잘못된 수신자, 요청 문서, 운송 목적이 포함되는 리스크를 줄일 수 있습니다.",
      details: [
        "OntologyReview를 먼저 분리하고, 그 다음 EMAIL_ACTION_CARD와 Draft를 출력합니다.",
        "Draft는 현재 사용자가 제공한 이메일 본문, 첨부, 수신자, 요청 목적에만 근거해야 합니다.",
        sendRequested
          ? "외부 발송은 APPROVAL과 AUDIT_RECORD가 확인되기 전까지 DRY_RUN으로만 둡니다."
          : "이전 문의의 수신자, 증빙명, route, 목적 문구를 재사용하지 않습니다."
      ],
      actions: [
        {
          actionType: sendRequested ? "REQUEST_EMAIL_SEND_APPROVAL" : "DRAFT_CONTEXTUAL_EMAIL_REPLY",
          ownerRole: "Ops User / Communication Owner",
          parameters: {
            requiredProcess: "OntologyReview -> EMAIL_ACTION_CARD -> Draft",
            draftSource: "current user-provided email/thread only",
            hardcodedPriorCase: "forbidden",
            nextGate: sendRequested ? "DRY_RUN -> APPROVAL -> WRITE -> AUDIT_RECORD" : "draft review only"
          },
          humanGateRequired: sendRequested,
          auditRecordRequired: sendRequested,
          writeBackMode: sendRequested ? "DRY_RUN" : "READ_ONLY",
          dueAt: null
        }
      ]
    };
  }

  if (route.intent === "COST_GUARD") {
    return {
      summary: "Invoice/Cost 질문은 CostGuard evidence pack 기준으로 검토해야 하며, 금액·요율·TariffRef 근거가 없으면 최종 판단을 보류합니다.",
      businessImpact: "RateRef/TariffRef/InvoiceLine 정합성 없이 과청구 판단을 확정하면 정산 dispute 또는 recovery 누락이 발생할 수 있습니다.",
      details: [
        "InvoiceLine, RateRef, TariffRef, BOE/DO/Port evidence를 연결합니다.",
        "100,000.00 AED 초과 또는 HIGH/CRITICAL은 Finance approval gate가 필요합니다.",
        "AED/USD 원통화 보존 후 variance를 계산하십시오."
      ],
      actions: [
        {
          actionType: "REQUEST_COST_EVIDENCE_PACK",
          ownerRole: "CostGuard / Finance Reviewer",
          parameters: { requiredEvidence: "InvoiceLine, RateRef, TariffRef, support docs" },
          humanGateRequired: true,
          dueAt: null
        }
      ]
    };
  }

  return {
    summary: "온톨로지 corpus 근거를 기준으로 답변 가능한 상태입니다. Evidence Drawer에서 문서·section·hash를 확인하십시오.",
    businessImpact: "동일한 HVDC 물류 기준으로 답변하여 사용자별 해석 편차와 환각 리스크를 줄입니다.",
    details: [
      "CONSOLIDATED-00 master spine을 먼저 조회했습니다.",
      "질문 도메인에 맞는 target extension 문서를 함께 조회했습니다.",
      "실시간 ERP/WMS 상태가 필요한 경우 live KG/Foundry 연결 전에는 corpus-based로 표시해야 합니다."
    ],
    actions: [
      {
        actionType: "REVIEW_EVIDENCE_DRAWER",
        ownerRole: "Ops User",
        parameters: { next: "Check source section and validation finding" },
        humanGateRequired: false,
        dueAt: null
      }
    ]
  };
}

function isEmailDraftRequest(question: string): boolean {
  return /email|e-mail|mail|이메일|메일/i.test(question) && /draft|write|compose|request|send|초안|작성|요청|보내|발송|전송/i.test(question);
}

export function answerQuestion(args: {
  question: string;
  userRole?: string;
  language?: "ko" | "en" | "auto";
}): GroundedAnswer {
  const maskedQuestion = maskPii(args.question);
  const route = routeQuestion(maskedQuestion.text, args.userRole ?? "ops_user", args.language ?? "auto");
  const corpus = loadCorpus();
  const candidateEvidence = searchCorpus({
    query: maskedQuestion.text,
    requiredDocs: route.requiredDocs,
    domainHints: route.domains,
    topK: 8,
    corpus
  });
  const evidence = hasEvidenceSupport(maskedQuestion.text, candidateEvidence, maskedQuestion.piiMasked) ? candidateEvidence : [];
  const resolvedEntities = resolveAnyKey(maskedQuestion.text);
  const shipmentRule = evaluateShipmentRule({
    question: maskedQuestion.text,
    resolvedEntities,
    evidence
  });
  const validation = validateGrounding({
    question: maskedQuestion.text,
    route,
    evidence,
    resolvedEntities,
    piiMasked: maskedQuestion.piiMasked
  });
  const shipmentValidation = mergeShipmentValidation(shipmentRule);
  const mergedValidation = [...validation, ...shipmentValidation.findings];
  const verdict = deriveVerdict(evidence, mergedValidation, route, maskedQuestion.text);
  const core = composeSummary(maskedQuestion.text, verdict, route);
  // WARN-6: Build actions immutably to avoid shared reference between evidenceTrace and answer
  const baseActions = [...core.actions, ...shipmentValidation.actions];
  const needsHumanGate = mergedValidation.some((finding) => finding.ruleId === "A-ACTION-001") && !baseActions.some((action) => action.humanGateRequired);
  const actions = needsHumanGate
    ? [...baseActions, {
        actionType: "REQUEST_HUMAN_GATE_REVIEW",
        ownerRole: "Responsible Approver",
        parameters: { reason: "write/send/export/report/cost/approval gate" },
        humanGateRequired: true,
        dueAt: null
      }]
    : baseActions;
  const evidenceTrace = buildEvidenceTrace({ core: { ...core, actions }, evidence });
  const graphPath = buildGraphPath(maskedQuestion.text, route);
  const generatedAt = new Date().toISOString();

  const answer: GroundedAnswer = {
    answerId: `ans_${sha256(`${maskedQuestion.text}|${generatedAt}`).slice(0, 12)}`,
    verdict,
    dataStatus: "OK",
    businessResultVisible: true,
    fallbackUsed: false,
    summary: core.summary,
    businessImpact: core.businessImpact,
    details: core.details,
    evidenceIds: evidence.map((item) => item.id),
    // WR-02: INFO is a boundary signal; surface as WARN rather than silent PASS
    validationStatus:
      verdict === "NO_EVIDENCE"
        ? "NO_EVIDENCE"
        : verdict === "BLOCK" || verdict === "ZERO"
          ? "BLOCK"
          : ["WARN", "INFO", "AMBER", "PENDING_APPROVAL", "DRY_RUN_ONLY", "NEEDS_INPUT", "PASS_WITH_FINDINGS"].includes(verdict)
            ? "WARN"
            : "PASS",
    route,
    resolvedEntities,
    evidence,
    evidenceTrace,
    shipmentRule,
    validation: mergedValidation,
    actions,
    graphPath,
    piiMasked: maskedQuestion.piiMasked,
    generatedAt
  };

  return { ...answer, decisionCard: toDecisionCardPayload({ answer }) };
}

export function answerToText(answer: GroundedAnswer): string {
  const lines = [
    `Verdict: ${answer.verdict}`,
    `Data status: ${answer.dataStatus}`,
    `Business result visible: ${answer.businessResultVisible}`,
    `Fallback used: ${answer.fallbackUsed}`,
    `Summary: ${answer.summary}`,
    `Business impact: ${answer.businessImpact}`,
    `Route: ${answer.route.requiredDocs.join(" -> ")}`,
    `Evidence: ${answer.evidence.map((item) => `${item.docId}/${item.sectionPath}`).join("; ") || "none"}`,
    `Evidence trace: ${
      (answer.evidenceTrace ?? [])
        .map((item) => `${item.targetType}${item.targetIndex === null ? "" : `[${item.targetIndex}]`}: ${item.supportState}`)
        .join("; ") || "none"
    }`,
    `Next action: ${answer.actions.map((action) => `${action.actionType} (${action.ownerRole})`).join("; ")}`,
    `UI render status: ${answer.ui?.uiRenderStatus ?? "READY"}`,
    ...(answer.ui?.errorCode ? [`UI warning: ${answer.ui.errorCode} - ${answer.ui.errorMessage ?? "card template render failed"}`] : [])
  ];
  return lines.join("\n");
}

export type AuditRecord = {
  toolName: string;
  inputHash: string;
  outputHash: string;
  timestamp: string;
  piiMasked: boolean;
};

export function buildAuditRecord(toolName: string, input: unknown, output: unknown, piiMasked: boolean): AuditRecord {
  return {
    toolName,
    inputHash: sha256(JSON.stringify(input)),
    outputHash: sha256(JSON.stringify(output)),
    timestamp: new Date().toISOString(),
    piiMasked
  };
}

export function auditRecordToJsonLine(record: AuditRecord): string {
  return `${JSON.stringify(record)}\n`;
}
