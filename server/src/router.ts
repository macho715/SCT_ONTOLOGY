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

const DAILY_LOGISTICS_KPI =
  /daily report|daily logistics|delivery\/collection|delivery|collection|customs clearance|new eta|\bETA\b|det\/dem|dem\/det|sr\b|lifting inspection|vessel movement|packing list|return\/rectification|rectification|scrap|일일|데일리|날짜별|물류\s*kpi|운영\s*kpi/i;
const EXPLICIT_INVOICE_COST_AUDIT =
  /invoice audit|costguard|overcharge|과청구|invoice line|rateref|rate ref|tariffref|tariff ref|line amount|invoice total|청구서\s*검토|비용\s*감사|정산\s*승인/i;

export function isDailyLogisticsKpiQuestion(question: string): boolean {
  return DAILY_LOGISTICS_KPI.test(question) && /kpi|dashboard|report|보고서|대시보드|관점|추출|정리/i.test(question);
}

function isExplicitInvoiceCostAuditQuestion(question: string): boolean {
  return EXPLICIT_INVOICE_COST_AUDIT.test(question);
}

export function routeQuestion(question: string, userRole = "ops_user", language = "auto"): IntentRoute {
  const domains = new Set<DomainHint>(["master"]);
  const docs = new Set<string>(["CONSOLIDATED-00-master-ontology"]);
  const reasons: string[] = [];
  const dailyKpiQuestion = isDailyLogisticsKpiQuestion(question);

  for (const rule of DOMAIN_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(question))) {
      domains.add(rule.domain);
      rule.docs.forEach((doc) => docs.add(doc));
      reasons.push(rule.reason);
    }
  }

  if (dailyKpiQuestion && !isExplicitInvoiceCostAuditQuestion(question)) {
    domains.delete("cost");
    docs.delete("CONSOLIDATED-05-invoice-cost");
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
