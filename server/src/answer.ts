import fs from "node:fs";
import path from "node:path";
import type {
  ActionRecommendation,
  EvidenceSnippet,
  GraphPath,
  GroundedAnswer,
  IntentRoute,
  ResolvedEntity,
  ValidationFinding,
  Verdict
} from "./types.js";
import { loadCorpus, searchCorpus } from "./corpus.js";
import { resolveAnyKey, routeQuestion } from "./router.js";
import { maskPii, sha256 } from "./redact.js";

const CURRENTNESS_TERMS = /moiat|fanr|dcd|adnoc|cicpa|permit|tariff|rate|law|regulation|규정|허가|요율/i;
const AGI_DAS_M130 = /\b(AGI|DAS)\b/i;
const M130 = /\bM130\b|site receipt|site closure|닫아도|close/i;
const FLOW_CODE = /flow code|confirmedflowcode|confirmed flow code/i;
const FLOW_CODE_MISUSE = /route|routing|customs|invoice|kpi|bucket|classification|분류|경로|통관|비용|청구|지표/i;
const ANY_KEY_AMBIGUITY = /ambiguous|ambiguity|unclear|multiple|duplicate|same|which|모호|중복|여러|둘 다|같은|어느|하나만/i;
const HUMAN_GATE_TERMS =
  /write[- ]?back|send|export|publish|approve|approval|invoice|cost|rate|tariff|report|whatsapp|email|청구|정산|승인|보고서|전송|발송|내보내기/i;
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

export function validateGrounding(args: {
  question: string;
  route: IntentRoute;
  evidence: EvidenceSnippet[];
  resolvedEntities?: ResolvedEntity[];
  piiMasked?: boolean;
}): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const evidenceIds = args.evidence.map((item) => item.id);

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
      reasonCode: "M130_CHAIN_EVIDENCE_REQUIRED",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "SiteReceipt/M130",
      evidenceIds,
      message: "AGI/DAS M130 closure requires MOSB/LCT chain evidence such as M115/M116/M117 or approved exception."
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

  if (HUMAN_GATE_TERMS.test(args.question)) {
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

function deriveVerdict(evidence: EvidenceSnippet[], findings: ValidationFinding[]): Verdict {
  if (evidence.length === 0) return "NO_EVIDENCE";
  if (findings.some((f) => f.status === "BLOCK")) return "BLOCK";
  if (findings.some((f) => f.status === "WARN")) return "WARN";
  if (findings.some((f) => f.ruleId === "A-FLOW-001")) return "INFO";
  return "PASS";
}

function buildGraphPath(question: string): GraphPath | null {
  const entities = resolveAnyKey(question);
  const site = entities.find((item) => item.identifierScheme === "SITE")?.normalizedValue ?? "HVDC Logistics Question";
  const milestone = entities.find((item) => item.identifierScheme === "MILESTONE")?.normalizedValue ?? "MilestoneEvent";

  if (entities.length === 0 && !FLOW_CODE.test(question)) return null;

  return {
    startNode: entities[0]?.normalizedValue ?? "Question",
    edges: [
      { from: entities[0]?.normalizedValue ?? "Question", relation: "routes_to", to: "CONSOLIDATED-00 Master Ontology" },
      { from: "CONSOLIDATED-00 Master Ontology", relation: "grounds", to: "ShipmentUnit / Document / Invoice" },
      { from: "ShipmentUnit / Document / Invoice", relation: "checks", to: milestone },
      { from: milestone, relation: "applies_to", to: site }
    ],
    endNode: site,
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

function hasEvidenceSupport(question: string, evidence: EvidenceSnippet[]): boolean {
  if (evidence.length === 0) return false;
  const terms = tokenizeForSupport(question);
  if (terms.length === 0) return true;
  const searchableEvidence = evidence
    .map((item) => `${item.docId} ${item.title} ${item.sectionPath} ${item.snippet}`.toLowerCase())
    .join("\n");
  return terms.some((term) => searchableEvidence.includes(term));
}

function composeSummary(question: string, verdict: Verdict): Pick<GroundedAnswer, "summary" | "businessImpact" | "details" | "actions"> {
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
      summary: "AGI/DAS M130 closure는 현재 근거만으로 확정할 수 없습니다. MOSB/LCT chain evidence 확인 전 BLOCK입니다.",
      businessImpact: "M115/M116/M117 등 선행 evidence 없이 site receipt를 닫으면 false receipt, claim, cost audit exposure가 발생할 수 있습니다.",
      details: [
        "CONSOLIDATED-00 master spine을 기준으로 material chain과 marine evidence를 함께 봐야 합니다.",
        "MOSB-inclusive route는 M115/M116/M117 evidence 또는 승인된 exception이 필요합니다.",
        "승인 없는 write/action/report close는 Human-gate 대상으로 처리합니다."
      ],
      actions: [
        {
          actionType: "REQUEST_MOSB_LCT_EVIDENCE",
          ownerRole: "Marine / Material Chain Owner",
          parameters: { requiredEvidence: "M115/M116/M117 or approved exception" },
          humanGateRequired: true,
          dueAt: null
        }
      ]
    };
  }

  if (/invoice|cost|rate|tariff|dem|det|청구|정산/i.test(question)) {
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
  const evidence = hasEvidenceSupport(maskedQuestion.text, candidateEvidence) ? candidateEvidence : [];
  const resolvedEntities = resolveAnyKey(maskedQuestion.text);
  const validation = validateGrounding({
    question: maskedQuestion.text,
    route,
    evidence,
    resolvedEntities,
    piiMasked: maskedQuestion.piiMasked
  });
  const verdict = deriveVerdict(evidence, validation);
  const core = composeSummary(maskedQuestion.text, verdict);
  const actions = [...core.actions];
  if (validation.some((finding) => finding.ruleId === "A-ACTION-001") && !actions.some((action) => action.humanGateRequired)) {
    actions.push({
      actionType: "REQUEST_HUMAN_GATE_REVIEW",
      ownerRole: "Responsible Approver",
      parameters: { reason: "write/send/export/report/cost/approval gate" },
      humanGateRequired: true,
      dueAt: null
    });
  }
  const graphPath = buildGraphPath(maskedQuestion.text);
  const generatedAt = new Date().toISOString();

  const answer: GroundedAnswer = {
    answerId: `ans_${sha256(`${maskedQuestion.text}|${generatedAt}`).slice(0, 12)}`,
    verdict,
    summary: core.summary,
    businessImpact: core.businessImpact,
    details: core.details,
    evidenceIds: evidence.map((item) => item.id),
    validationStatus: verdict === "NO_EVIDENCE" ? "NO_EVIDENCE" : verdict === "BLOCK" ? "BLOCK" : verdict === "WARN" ? "WARN" : "PASS",
    route,
    resolvedEntities,
    evidence,
    validation,
    actions,
    graphPath,
    piiMasked: maskedQuestion.piiMasked,
    generatedAt
  };

  auditToolCall("ask_hvdc_ontology", args, answer, answer.piiMasked);
  return answer;
}

export function answerToText(answer: GroundedAnswer): string {
  const lines = [
    `Verdict: ${answer.verdict}`,
    `Summary: ${answer.summary}`,
    `Business impact: ${answer.businessImpact}`,
    `Route: ${answer.route.requiredDocs.join(" -> ")}`,
    `Evidence: ${answer.evidence.map((item) => `${item.docId}/${item.sectionPath}`).join("; ") || "none"}`,
    `Next action: ${answer.actions.map((action) => `${action.actionType} (${action.ownerRole})`).join("; ")}`
  ];
  return lines.join("\n");
}

export function auditToolCall(toolName: string, input: unknown, output: unknown, piiMasked: boolean): void {
  try {
    const outDir = path.resolve(process.cwd(), "out");
    fs.mkdirSync(outDir, { recursive: true });
    const record = {
      toolName,
      inputHash: sha256(JSON.stringify(input)),
      outputHash: sha256(JSON.stringify(output)),
      timestamp: new Date().toISOString(),
      piiMasked
    };
    fs.appendFileSync(path.join(outDir, "audit.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
  } catch {
    // Audit failure must not expose sensitive input in errors. Production should route this to secure logging.
  }
}
