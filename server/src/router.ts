import type { DomainHint, IntentCode, IntentRoute, ResolvedEntity } from "./types.js";
import { expandIdentifierVariants } from "./identifier-normalizer.js";
import { sha256 } from "./redact.js";

export const FMC_ROLE_DOC = "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined";

const DOMAIN_RULES: Array<{ domain: DomainHint; docs: string[]; patterns: RegExp[]; reason: string }> = [
  {
    domain: "team",
    docs: [FMC_ROLE_DOC],
    patterns: [
      /\b(?:arvin|haitham|karthik|roldan|dan|ken|kEn|jhysn|jhason|jason|ronnel|ronpap20|minkyu|shariff)\b|차민규|정상욱|상욱/i,
      /\b(?:actorrole|role|owner|responsib|escalation|backup|handover)\b|담당|담당자|책임자|역할|업무|경계|에스컬레이션|인수인계/i,
      /\bM(?:80|90|91|92|100|110|111|115|116|117|120|121|130|131|132|140|150|160)\b.*(?:owner|담당|책임|역할)|(?:owner|담당|책임|역할).*\bM(?:80|90|91|92|100|110|111|115|116|117|120|121|130|131|132|140|150|160)\b/i
    ],
    reason: "FMC role/person/milestone responsibility keyword detected"
  },
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
    patterns: [/\b(?:invoice|cost|costguard|rate|rateref|tariff|tariffref|dem|det|demurrage|detention|aed|usd)\b|비용|청구|정산/i],
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

const DAILY_LOGISTICS_KPI =
  /daily report|daily logistics|daily kpi|kpi dashboard|delivery\/collection|delivery|collection|customs clearance|new eta|\bETA\b|det\/dem|dem\/det|sr\b|lifting inspection|vessel movement|packing list|return\/rectification|rectification|scrap|owner|next action|risk|locked|confirmed|원장|확정|잠금|일일|데일리|날짜별|물류\s*kpi|운영\s*kpi/i;
const EXPLICIT_INVOICE_COST_AUDIT =
  /invoice audit|costguard|overcharge|과청구|invoice line|rateref|rate ref|tariffref|tariff ref|line amount|invoice total|청구서\s*검토|비용\s*감사|정산\s*승인/i;
const COST_DECISION_TERMS =
  /\b(?:invoice|cost|costguard|rate|rateref|tariff|tariffref|dem|det|demurrage|detention|aed|usd)\b|청구|정산|비용|요율/i;
const SYSTEM_DIAGNOSTIC_TERMS =
  /(?:sct[_\s-]?ontology|ontology|card|decision\s*card|router|validation|evidence|schema|rulepack|renderer|rendering|widget|template|ui|mcp|answer\s*card|카드|위젯|템플릿|라우터|검증|근거|스키마|룰팩|렌더|점검|진단|감사|audit|diagnostic|health)/i;
const SYSTEM_SUBJECT_TERMS =
  /(?:sct[_\s-]?ontology|ontology|system[_\s-]?qa[_\s-]?rulepack|system[_\s-]?diagnostic|card[_\s-]?rendering[_\s-]?audit|ontology[_\s-]?patch[_\s-]?review|decision\s*card|decisioncard|evidenceranker|actionplanner|humangate|zero\s*gate|sourcehash|approvaltrace|validationreport|card|router|validation|schema|rulepack|renderer|rendering|widget|template|ui|mcp|answer\s*card|카드|위젯|템플릿|라우터|스키마|룰팩|렌더)/i;
const SYSTEM_MODULE_TERMS =
  /(?:sct[_\s-]?ontology|ontology|system[_\s-]?qa[_\s-]?rulepack|system[_\s-]?diagnostic|card[_\s-]?rendering[_\s-]?audit|ontology[_\s-]?patch[_\s-]?review|decision\s*card|decisioncard|intentrouter|rulepackselector|evidenceranker|actionplanner|humangate|actiongate|validationengine|zero\s*gate|sourcehash|approvaltrace|validationreport|card|router|schema|rulepack|renderer|rendering|widget|template|ui|mcp|answer\s*card|카드|위젯|템플릿|라우터|스키마|룰팩|렌더)/i;
const SYSTEM_HARD_NEGATIVE_TERMS =
  /점검|진단|패치|개선|업그레이드|upgrade|patch|audit|diagnostic|health|card|router|validation|evidence|schema|rulepack|renderer|rendering|widget|template|카드|라우터|검증|근거|스키마|룰팩|렌더|위젯/i;
const OPERATIONAL_OBJECT_TERMS =
  /\b(?:BL|BOE|DO|CI|PL|PO|INV|INVOICE|PKG)(?:[-_/#][A-Z0-9]+|\d{2,}|[A-Z]{2,}\d+)\b|\bHVDC[-_/][A-Z0-9-]+\b|\bM\d{2,3}\b|shipment|shipmentunit|container|site|warehouse|mosb|invoice|통관|창고|현장|선적|화물|자재/i;
const CARD_RENDERING_TERMS =
  /card[_\s-]?rendering[_\s-]?audit|answer\s*card\s*(?:render|template)|decision\s*card\s*(?:render|template)|renderer|rendering|widget|template|ui|fallback|failed to fetch|위젯|템플릿|렌더|화면|표시/i;
const PATCH_REVIEW_TERMS =
  /패치|개선|업그레이드|upgrade|patch|governance|rulepack|schema|acceptance criteria|backlog|roadmap|사양|spec|수정안/i;
const RULEPACK_GAP_TERMS =
  /rulepack.*(?:gap|coverage|matrix|selector|binding|분석|공백)|(?:gap|coverage|matrix|selector|binding|공백).*(?:rulepack|룰팩)|rulepack_gap_analysis/i;
const ROUTER_QA_TERMS =
  /intentrouter|intent\s*router|router|routing\s*qa|hard-negative|classification|오분류|라우터|분류/i;
const EVIDENCE_QA_TERMS =
  /evidenceranker|evidence\s*qa|evidence|directsupport|sourcehash|근거|증거/i;
const SCHEMA_BOUNDARY_TERMS =
  /schema_boundary_review|schema|contract|boundary|data\s*class|스키마|계약|경계/i;
const VALIDATION_POLICY_TERMS =
  /validation_policy_review|validation\s*policy|validation|rule\s*policy|policy|검증|정책/i;
const EMAIL_DRAFT_TERMS =
  /(?:email|e-mail|mail|thread|이메일|메일|회신|답장|수신자).*(?:draft|write|compose|reply|send|초안|작성|회신|답장|보내|발송|전송)|(?:draft|write|compose|reply|send|초안|작성|회신|답장|보내|발송|전송).*(?:email|e-mail|mail|thread|이메일|메일|수신자)/i;
const COST_APPROVAL_ACTION_TERMS =
  /approve|approval|accept|pay|release|post|write|confirm|confirmed|승인|확정|반영|지급|릴리즈/i;
const DOCUMENT_GUARDIAN_TERMS =
  /\b(?:ci|pl|bl|boe|do|ocr|coo|permit)\b|packing list|delivery order|첨부|서류|문서|통관/i;
const LOGISTICS_DECISION_TERMS =
  /\b(?:eta|etd|ata|atd|berth|tide|wh|warehouse|customs|mosb|site|delivery|shipment|container|invoice|dem|det)\b|물류|통관|창고|현장|선적|배송|해상|비용/i;
const P2_NDA_MARKER = /\bP2\b|보안등급\s*P2|P2\s*자료/i;
const P2_NDA_RAW_TERMS =
  /원문|원본|계약\s*단가|실명|내부\s*링크|raw\s+(?:text|content|contract|rate)|unit\s*price|contract\s*rate|unredacted|비식별\s*전/i;
const P2_NDA_OUTPUT_TERMS =
  /보여|출력|노출|포함|include|expose|render|export|publish|share|카드|card|붙여|그대로/i;
const SYSTEM_COMPONENTS: Array<{ name: string; regex: RegExp }> = [
  { name: "IntentRouter", regex: /\bintent\s*router\b|\bintentrouter\b|라우터/i },
  { name: "RulePackSelector", regex: /\brule\s*pack\s*selector\b|\brulepackselector\b|\brulepack\b|룰팩/i },
  { name: "EvidenceRanker", regex: /\bevidence\s*ranker\b|\bevidenceranker\b|\bdirectsupport\b|\bsourcehash\b|근거/i },
  { name: "DecisionCard", regex: /\bdecision\s*card\b|\bdecisioncard\b|\banswer\s*card\b|\bcard\b|카드/i },
  { name: "Renderer", regex: /\brenderer\b|\brendering\b|\bwidget\b|\btemplate\b|\bui\b|렌더|위젯|템플릿/i },
  { name: "ActionGate", regex: /\baction\s*gate\b|\bactiongate\b|\bhuman\s*gate\b|\bhumangate\b|승인\s*게이트/i },
  { name: "ValidationEngine", regex: /\bvalidation\s*engine\b|\bvalidationengine\b|\bvalidation\b|검증/i }
];

const SYSTEM_INTENTS = new Set<IntentCode>([
  "SYSTEM_DIAGNOSTIC",
  "ONTOLOGY_PATCH_REVIEW",
  "CARD_RENDERING_AUDIT",
  "RULEPACK_GAP_ANALYSIS",
  "ROUTER_QA",
  "EVIDENCE_QA",
  "SCHEMA_BOUNDARY_REVIEW",
  "VALIDATION_POLICY_REVIEW"
]);

export const RULEPACK_REGISTRY: Readonly<Record<string, { domains: DomainHint[]; intents: IntentCode[] }>> = {
  SYSTEM_QA_RULEPACK: {
    domains: ["system", "master"],
    intents: [
      "SYSTEM_DIAGNOSTIC",
      "ONTOLOGY_PATCH_REVIEW",
      "CARD_RENDERING_AUDIT",
      "RULEPACK_GAP_ANALYSIS",
      "ROUTER_QA",
      "EVIDENCE_QA",
      "SCHEMA_BOUNDARY_REVIEW",
      "VALIDATION_POLICY_REVIEW"
    ]
  },
  IDENTITY_RULEPACK: {
    domains: ["master", "material", "document"],
    intents: ["LOGISTICS_DECISION", "DOCUMENT_GUARDIAN", "GENERAL_ANSWER"]
  },
  MARINE_RULEPACK: {
    domains: ["marine"],
    intents: ["LOGISTICS_DECISION"]
  },
  CUSTOMS_RULEPACK: {
    domains: ["document", "port", "compliance"],
    intents: ["LOGISTICS_DECISION", "DOCUMENT_GUARDIAN"]
  },
  COST_RULEPACK: {
    domains: ["cost"],
    intents: ["COST_GUARD"]
  },
  DOCUMENT_RULEPACK: {
    domains: ["document"],
    intents: ["DOCUMENT_GUARDIAN", "LOGISTICS_DECISION"]
  },
  WAREHOUSE_RULEPACK: {
    domains: ["warehouse"],
    intents: ["LOGISTICS_DECISION"]
  },
  COMM_RULEPACK: {
    domains: ["communication"],
    intents: ["EMAIL_DRAFT"]
  },
  PII_NDA_RULEPACK: {
    domains: ["communication", "document", "cost"],
    intents: ["EMAIL_DRAFT", "COST_GUARD", "DOCUMENT_GUARDIAN", "LOGISTICS_DECISION"]
  }
};

export function isDailyLogisticsKpiQuestion(question: string): boolean {
  return DAILY_LOGISTICS_KPI.test(question) && /kpi|dashboard|report|보고서|대시보드|관점|추출|정리/i.test(question);
}

function isExplicitInvoiceCostAuditQuestion(question: string): boolean {
  return EXPLICIT_INVOICE_COST_AUDIT.test(question);
}

function isP2NdaExposureQuestion(question: string): boolean {
  return P2_NDA_RAW_TERMS.test(question) && (P2_NDA_MARKER.test(question) || P2_NDA_OUTPUT_TERMS.test(question));
}

export function classifyIntent(question: string): IntentCode {
  const hasExplicitCostGuard =
    COST_DECISION_TERMS.test(question) &&
    (EXPLICIT_INVOICE_COST_AUDIT.test(question) || COST_APPROVAL_ACTION_TERMS.test(question));
  const hasSystemSubject = SYSTEM_SUBJECT_TERMS.test(question);
  const hasOperationalObject = OPERATIONAL_OBJECT_TERMS.test(question);
  const hasSystemModule = SYSTEM_MODULE_TERMS.test(question);
  const hasSystemHardNegative = SYSTEM_HARD_NEGATIVE_TERMS.test(question) && hasSystemSubject && (!hasOperationalObject || hasSystemModule);

  if (hasExplicitCostGuard && !hasSystemSubject) return "COST_GUARD";

  if (hasSystemHardNegative && RULEPACK_GAP_TERMS.test(question)) return "RULEPACK_GAP_ANALYSIS";
  if (hasSystemHardNegative && ROUTER_QA_TERMS.test(question) && !CARD_RENDERING_TERMS.test(question)) return "ROUTER_QA";
  if (hasSystemHardNegative && EVIDENCE_QA_TERMS.test(question) && !CARD_RENDERING_TERMS.test(question)) return "EVIDENCE_QA";
  if (hasSystemHardNegative && SCHEMA_BOUNDARY_TERMS.test(question) && !CARD_RENDERING_TERMS.test(question)) return "SCHEMA_BOUNDARY_REVIEW";
  if (hasSystemHardNegative && VALIDATION_POLICY_TERMS.test(question) && !CARD_RENDERING_TERMS.test(question)) return "VALIDATION_POLICY_REVIEW";
  if (hasSystemHardNegative && CARD_RENDERING_TERMS.test(question)) return "CARD_RENDERING_AUDIT";
  if (hasSystemHardNegative && /전반|overall|health/i.test(question)) return "SYSTEM_DIAGNOSTIC";
  if (hasSystemHardNegative && PATCH_REVIEW_TERMS.test(question)) return "ONTOLOGY_PATCH_REVIEW";
  if (hasSystemHardNegative) return "SYSTEM_DIAGNOSTIC";

  if (EMAIL_DRAFT_TERMS.test(question)) return "EMAIL_DRAFT";

  if (hasExplicitCostGuard) return "COST_GUARD";

  if (DOCUMENT_GUARDIAN_TERMS.test(question)) return "DOCUMENT_GUARDIAN";
  if (LOGISTICS_DECISION_TERMS.test(question)) return "LOGISTICS_DECISION";
  return "GENERAL_ANSWER";
}

function buildIntentActions(intent: IntentCode): Pick<IntentRoute, "allowedActions" | "blockedActions"> {
  switch (intent) {
    case "SYSTEM_DIAGNOSTIC":
    case "CARD_RENDERING_AUDIT":
    case "RULEPACK_GAP_ANALYSIS":
    case "ROUTER_QA":
    case "EVIDENCE_QA":
    case "SCHEMA_BOUNDARY_REVIEW":
    case "VALIDATION_POLICY_REVIEW":
      return {
        allowedActions: ["read", "diagnostic_report", "test_scenario"],
        blockedActions: ["email_draft", "external_send", "cost_approval", "write_back"]
      };
    case "ONTOLOGY_PATCH_REVIEW":
      return {
        allowedActions: ["read", "patch_spec", "backlog", "acceptance_criteria"],
        blockedActions: ["email_draft", "write_back_without_approval", "external_send", "cost_approval"]
      };
    case "EMAIL_DRAFT":
      return {
        allowedActions: ["read", "internal_draft"],
        blockedActions: ["external_send_without_approval", "kg_mutation_without_explicit_instruction"]
      };
    case "COST_GUARD":
      return {
        allowedActions: ["read", "dry_run", "variance_report"],
        blockedActions: ["invoice_approval_without_rateref_tariffref", "write_back_without_approval"]
      };
    case "DOCUMENT_GUARDIAN":
      return {
        allowedActions: ["read", "extract", "compare", "missing_field_list"],
        blockedActions: ["customs_submission_without_approval", "write_back_without_approval"]
      };
    case "LOGISTICS_DECISION":
      return {
        allowedActions: ["read", "dry_run", "risk_memo", "input_request"],
        blockedActions: ["final_authority_decision_without_evidence", "write_back_without_approval"]
      };
    case "GENERAL_ANSWER":
      return {
        allowedActions: ["read", "evidence_review"],
        blockedActions: ["external_send", "write_back", "publish"]
      };
  }
}

export function resolveRulePackIds(intent: IntentCode, domains: Iterable<DomainHint>): string[] {
  const domainSet = new Set(domains);
  const selected = new Set<string>();

  for (const [rulePackId, entry] of Object.entries(RULEPACK_REGISTRY)) {
    if (entry.intents.includes(intent) || entry.domains.some((domain) => domainSet.has(domain))) {
      selected.add(rulePackId);
    }
  }

  if (SYSTEM_INTENTS.has(intent)) {
    selected.delete("COST_RULEPACK");
    selected.delete("COMM_RULEPACK");
  }

  return Array.from(selected);
}

export function routeQuestion(question: string, userRole = "ops_user", language = "auto"): IntentRoute {
  const domains = new Set<DomainHint>(["master"]);
  const docs = new Set<string>(["CONSOLIDATED-00-master-ontology"]);
  const reasons: string[] = [];
  const dailyKpiQuestion = isDailyLogisticsKpiQuestion(question);
  const intent = classifyIntent(question);

  for (const rule of DOMAIN_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(question))) {
      domains.add(rule.domain);
      rule.docs.forEach((doc) => docs.add(doc));
      reasons.push(rule.reason);
    }
  }

  if (dailyKpiQuestion && !isExplicitInvoiceCostAuditQuestion(question)) {
    domains.delete("cost");
    domains.delete("material");
    domains.delete("communication");
    docs.delete("CONSOLIDATED-05-invoice-cost");
    docs.delete("CONSOLIDATED-06-material-chain");
    docs.delete("CONSOLIDATED-08-communication");
    domains.add("document");
    domains.add("operations");
    domains.add("port");
    domains.add("marine");
    docs.add("CONSOLIDATED-03-document-ocr");
    docs.add("CONSOLIDATED-09-operations");
    docs.add("CONSOLIDATED-07-port-operations");
    docs.add("CONSOLIDATED-04-barge-bulk-cargo");
    reasons.push("daily logistics KPI override: DET/DEM treated as operations risk, not CostGuard audit");
  }

  if (SYSTEM_INTENTS.has(intent)) {
    domains.add("system");
    domains.delete("cost");
    domains.delete("communication");
    docs.delete("CONSOLIDATED-05-invoice-cost");
    docs.delete("CONSOLIDATED-08-communication");
    reasons.push(`system hard-negative intent: ${intent} cannot route to email draft, external send, or cost approval`);
  }

  if (isP2NdaExposureQuestion(question)) {
    domains.add("document");
    docs.add("CONSOLIDATED-03-document-ocr");
    reasons.push("P2/NDA exposure marker: PII_NDA_RULEPACK required for raw content boundary");
  }

  if (intent === "EMAIL_DRAFT") {
    domains.add("communication");
    docs.add("CONSOLIDATED-08-communication");
    domains.delete("cost");
    docs.delete("CONSOLIDATED-05-invoice-cost");
    reasons.push("email draft intent: communication evidence lane only; send remains human-gated");
  }

  if (intent === "COST_GUARD") {
    domains.add("cost");
    domains.add("document");
    docs.add("CONSOLIDATED-05-invoice-cost");
    docs.add("CONSOLIDATED-03-document-ocr");
    reasons.push("cost guard intent: cost rulepack requires explicit audit or approval action");
  }

  if (domains.size === 1) {
    domains.add("operations");
    docs.add("CONSOLIDATED-09-operations");
    reasons.push("fallback: operations context");
  }

  const actions = buildIntentActions(intent);
  const rulePackIds = resolveRulePackIds(intent, domains);

  return {
    routeId: `route_${sha256(`${question}|${userRole}|${language}`).slice(0, 10)}`,
    intent,
    domains: Array.from(domains),
    requiredDocs: Array.from(docs),
    rulePackIds,
    allowedActions: actions.allowedActions,
    blockedActions: actions.blockedActions,
    confidence: Number(Math.min(0.98, 0.72 + reasons.length * 0.04).toFixed(2)),
    routingReason: reasons.join("; ")
  };
}

export function resolveAnyKey(identifierOrQuestion: string): ResolvedEntity[] {
  const text = identifierOrQuestion;
  const candidates: ResolvedEntity[] = [];
  const seen = new Set<string>();

  function pushCandidate(candidate: ResolvedEntity): void {
    const key = `${candidate.entityType}|${candidate.identifierScheme}|${candidate.normalizedValue}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push(candidate);
  }

  for (const component of SYSTEM_COMPONENTS) {
    if (!component.regex.test(text)) continue;
    pushCandidate({
      entityType: "SystemComponent",
      identifierScheme: "SYSTEM_COMPONENT",
      identifierValue: component.name,
      normalizedValue: component.name,
      targetRid: `rid_${sha256(`SYSTEM_COMPONENT:${component.name}`).slice(0, 12)}`,
      confidence: 0.9
    });
  }

  for (const rawToken of text.match(/[A-Za-z0-9][A-Za-z0-9._/-]{2,}/g) ?? []) {
    for (const variant of expandIdentifierVariants(rawToken)) {
      const hvdcCodeMatch = /^HVDC-ADOPT-[A-Z]{2,8}-(\d{4,})(?:-[A-Z0-9]{1,8})?$/.exec(variant.normalized);
      if (!hvdcCodeMatch) continue;
      if (Number.parseInt(hvdcCodeMatch[1], 10) <= 0) continue;
      pushCandidate({
        entityType: "ShipmentUnit",
        identifierScheme: "HVDC_CODE",
        identifierValue: variant.raw,
        normalizedValue: variant.normalized,
        targetRid: `rid_${sha256(`HVDC_CODE:${variant.normalized}`).slice(0, 12)}`,
        confidence: 0.95
      });
    }
  }

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
      const hvdcAdoptMatch = scheme === "HVDC_CODE"
        ? /^HVDC-ADOPT-[A-Z]{2,8}-(\d{4,})(?:-[A-Z0-9]{1,8})?$/.exec(normalized)
        : null;
      if (hvdcAdoptMatch && Number.parseInt(hvdcAdoptMatch[1], 10) <= 0) continue;
      pushCandidate({
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
