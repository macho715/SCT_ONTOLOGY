import { describe, expect, it } from "vitest";
import { answerQuestion, validateGrounding } from "../server/src/answer.js";
import { maskPii } from "../server/src/redact.js";
import { evaluateShipmentRule } from "../server/src/shipment-rule.js";
import { mergeShipmentValidation } from "../server/src/shipment-validation.js";
import type { EvidenceSnippet, IntentRoute, ShipmentRuleResult } from "../server/src/types.js";
import { withUiState } from "../server/src/ui.js";

function ask(question: string) {
  return answerQuestion({ question, userRole: "test", language: "ko" });
}

function actionText(action: ReturnType<typeof ask>["actions"][number]): string {
  return `${action.actionType} - ${action.ownerRole}${action.humanGateRequired ? " (Human-gate required)" : ""}`;
}

describe("HVDC ontology grounded answer pipeline", () => {
  it("blocks AGI/DAS M130 closure without MOSB/LCT chain evidence", () => {
    const answer = ask("AGI M130 닫아도 돼? BL-535 관련");
    expect(answer.verdict).toBe("BLOCK");
    expect(answer.validation.some((item) => item.ruleId === "V-AGIDAS-001")).toBe(true);
    expect(answer.validation.some((item) => item.reasonCode === "M130_CHAIN_EVIDENCE_REQUIRED")).toBe(true);
    expect(answer.route.requiredDocs.some((doc) => doc.includes("CONSOLIDATED-00"))).toBe(true);
  });

  it("adds a secondary shipment rule match without creating corpus evidence", () => {
    const answer = ask("BL-AUH-002 shipment rule 상태 확인해줘");

    expect(answer.shipmentRule).toEqual(
      expect.objectContaining({
        found: true,
        source: "sample_shipment_rule_engine",
        supportLevel: "SECONDARY_SAMPLE_VALIDATION",
        matchedKey: "BL-AUH-002",
        shipmentId: "SHP-0002"
      })
    );
    expect(answer.shipmentRule?.risks.length).toBeGreaterThan(0);
    expect(answer.shipmentRule?.humanGateRequired).toBe(true);
    expect(answer.evidenceIds).toEqual(answer.evidence.map((item) => item.id));
    expect(answer.evidence.every((item) => item.sourceType === "ontology_corpus")).toBe(true);
    expect(answer.evidenceTrace.every((trace) => trace.evidenceIds.every((id) => answer.evidenceIds.includes(id)))).toBe(true);
  });

  it("keeps unsupported rule-only shipment output from becoming a supported final answer", () => {
    const answer = ask("BL-AUH-002");

    expect(answer.shipmentRule).toEqual(
      expect.objectContaining({
        found: true,
        source: "sample_shipment_rule_engine",
        supportLevel: "SECONDARY_SAMPLE_VALIDATION",
        matchedKey: "BL-AUH-002",
        shipmentId: "SHP-0002"
      })
    );
    expect(answer.verdict).toBe("NO_EVIDENCE");
    expect(answer.validationStatus).toBe("NO_EVIDENCE");
    expect(answer.evidence).toHaveLength(0);
    expect(answer.evidenceIds).toHaveLength(0);
    expect(answer.validation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "V-SHIPMENT-AGIDAS-001", evidenceIds: [] }),
        expect.objectContaining({ ruleId: "V-SHIPMENT-INVOICE-001", evidenceIds: [] })
      ])
    );
    expect(answer.evidenceTrace.every((trace) => trace.supportState === "NO_DIRECT_EVIDENCE")).toBe(true);
    expect(answer.evidenceTrace.every((trace) => trace.evidenceIds.length === 0)).toBe(true);
  });

  it("matches package identifiers that are not resolved by the parent router", () => {
    const answer = ask("PKG-AGI-02 package secondary validation 확인해줘");

    expect(answer.shipmentRule).toEqual(
      expect.objectContaining({
        found: true,
        matchedKey: "PKG-AGI-02",
        shipmentId: "SHP-0002",
        source: "sample_shipment_rule_engine"
      })
    );
  });

  it("keeps not-found shipment rule state informational", () => {
    const answer = ask("Flow Code 어디에 써? NO-SUCH-BL");

    expect(answer.shipmentRule).toEqual(
      expect.objectContaining({
        found: false,
        status: "INFO",
        matchedKey: "NO-SUCH-BL",
        shipmentId: null
      })
    );
    expect(answer.verdict).toBe("INFO");
    expect(answer.validation.some((item) => item.ruleId === "SHIPMENT-RULE-001")).toBe(false);
  });

  it("returns WARN when the secondary shipment rule data is unavailable", () => {
    const result = evaluateShipmentRule({
      question: "BL-AUH-002 shipment rule 상태 확인해줘",
      resolvedEntities: [],
      evidence: [],
      sampleShipments: null
    });

    expect(result).toEqual(
      expect.objectContaining({
        found: false,
        status: "WARN",
        source: "sample_shipment_rule_engine",
        supportLevel: "SECONDARY_SAMPLE_VALIDATION"
      })
    );
  });

  it("preserves ambiguity when multiple sample shipments match candidate identifiers", () => {
    const result = evaluateShipmentRule({
      question: "BL-AUH-002 and PKG-OTHER-02 중 어느 shipment인지 확인해줘",
      resolvedEntities: [],
      evidence: [],
      sampleShipments: [
        {
          shipment_id: "SHP-0002",
          routing_pattern: "PORT_TO_MOSB_TO_SITE",
          identifiers: { BL: "BL-AUH-002" }
        },
        {
          shipment_id: "SHP-0099",
          routing_pattern: "PORT_TO_SITE",
          identifiers: { Package: "PKG-OTHER-02" }
        }
      ]
    });

    expect(result).toEqual(
      expect.objectContaining({
        found: false,
        status: "INFO",
        shipmentId: null
      })
    );
    expect(result.message).toContain("Multiple sample shipments matched");
    expect(result.risks).toEqual(
      expect.arrayContaining([expect.objectContaining({ rule: "Ambiguous Shipment Candidate" })])
    );
  });

  it("exposes matched shipment validation details for stage, missing documents, invoice audit, and exposure", () => {
    const answer = ask("BL-AUH-002 shipment validation merge 확인해줘");

    expect(answer.shipmentRule).toEqual(
      expect.objectContaining({
        found: true,
        currentStage: "M130",
        routingPattern: "PORT_TO_MOSB_TO_SITE",
        missingDocuments: expect.arrayContaining(["DO", "SITE_RECEIPT"]),
        invoiceExposureAed: "120900.00",
        humanGateRequired: true
      })
    );
    expect(answer.shipmentRule?.invoiceAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ lineId: "L1", severity: "BLOCK", humanGate: true }),
        expect.objectContaining({ lineId: "L2", severity: "BLOCK", humanGate: true })
      ])
    );
  });

  it("maps shipment rule risks into validation findings and human gate actions without fake evidence ids", () => {
    const shipmentRule = evaluateShipmentRule({
      question: "BL-AUH-002 shipment validation merge 확인해줘",
      resolvedEntities: [],
      evidence: []
    });
    const merged = mergeShipmentValidation(shipmentRule);

    expect(merged.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: "V-SHIPMENT-AGIDAS-001",
          reasonCode: "SHIPMENT_AGIDAS_MOSB_CHAIN_REQUIRED",
          status: "BLOCK",
          evidenceIds: []
        }),
        expect.objectContaining({
          ruleId: "V-SHIPMENT-INVOICE-001",
          reasonCode: "SHIPMENT_INVOICE_HUMAN_GATE_REQUIRED",
          status: "BLOCK",
          evidenceIds: []
        })
      ])
    );
    expect(merged.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionType: "REQUEST_SHIPMENT_RULE_HUMAN_GATE",
          ownerRole: "Marine / Material Chain Owner",
          humanGateRequired: true
        }),
        expect.objectContaining({
          actionType: "REQUEST_FINANCE_GATE_REVIEW",
          ownerRole: "Finance Reviewer",
          humanGateRequired: true
        })
      ])
    );
  });

  it("merges shipment validation into final answer verdict and actions while preserving corpus evidence ids", () => {
    const answer = ask("BL-AUH-002 shipment validation merge 확인해줘");

    expect(answer.verdict).toBe("BLOCK");
    expect(answer.validationStatus).toBe("BLOCK");
    expect(answer.validation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "V-SHIPMENT-AGIDAS-001", evidenceIds: [] }),
        expect.objectContaining({ ruleId: "V-SHIPMENT-INVOICE-001", evidenceIds: [] })
      ])
    );
    expect(answer.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ actionType: "REQUEST_SHIPMENT_RULE_HUMAN_GATE", humanGateRequired: true }),
        expect.objectContaining({ actionType: "REQUEST_FINANCE_GATE_REVIEW", humanGateRequired: true })
      ])
    );
    expect(answer.evidenceIds).toEqual(answer.evidence.map((item) => item.id));
    expect(answer.evidenceTrace.every((trace) => trace.evidenceIds.every((id) => answer.evidenceIds.includes(id)))).toBe(true);
  });

  it("keeps Flow Code as WHP-only", () => {
    const answer = ask("Flow Code 어디에 써?");
    expect(["INFO", "PASS"]).toContain(answer.verdict);
    expect(answer.summary).toContain("WHP");
    expect(answer.details.join(" ")).toMatch(/route|RoutingPattern/i);
  });

  it("warns for current compliance or rate questions", () => {
    const answer = ask("FANR permit 현재 기준으로 필요한가?");
    expect(["WARN", "BLOCK"]).toContain(answer.verdict);
    expect(answer.validation.some((item) => item.ruleId === "A-CURRENT-001")).toBe(true);
    expect(answer.validation.some((item) => item.reasonCode === "STALE_SOURCE_RISK")).toBe(true);
  });

  it("blocks missing CONSOLIDATED-00 route coverage with a standard reason code", () => {
    const route: IntentRoute = {
      routeId: "route_test_missing_master",
      intent: "GENERAL_ANSWER",
      domains: ["operations"],
      requiredDocs: ["CONSOLIDATED-09-operations"],
      rulePackIds: ["SYSTEM_QA_RULEPACK"],
      allowedActions: ["read"],
      blockedActions: ["write_back"],
      confidence: 0.9,
      routingReason: "test fixture without master spine"
    };
    const evidence: EvidenceSnippet[] = [
      {
        id: "ev_test_ops",
        docId: "CONSOLIDATED-09-operations",
        title: "Operations",
        version: "test",
        sectionPath: "Fixture",
        snippet: "Operations evidence fixture.",
        docHash: "hash",
        confidence: 0.9,
        sourceType: "ontology_corpus"
      }
    ];
    const findings = validateGrounding({ question: "월간 보고서 기준 알려줘", route, evidence });
    expect(findings.some((item) => item.ruleId === "A-ROUTE-001")).toBe(true);
    expect(findings.some((item) => item.reasonCode === "MISSING_REQUIRED_DOC")).toBe(true);
  });

  it("blocks Flow Code customs-stage misuse with a standard reason code", () => {
    const answer = ask("Flow Code로 customs stage 분류해줘");
    expect(answer.verdict).toBe("BLOCK");
    expect(answer.validation.some((item) => item.ruleId === "A-FLOW-001")).toBe(true);
    expect(answer.validation.some((item) => item.reasonCode === "FLOW_CODE_SCOPE_VIOLATION")).toBe(true);
  });

  it("warns on ambiguous any-key requests instead of auto-selecting one identifier", () => {
    const answer = ask("BL-535 invoice cost INVOICE-535가 같은 건지 모호해. 자동으로 하나만 골라줘");
    expect(["WARN", "BLOCK"]).toContain(answer.verdict);
    expect(answer.validation.some((item) => item.ruleId === "A-ANYKEY-001")).toBe(true);
    expect(answer.validation.some((item) => item.reasonCode === "AMBIGUOUS_ANY_KEY")).toBe(true);
  });

  it("routes daily logistics KPI questions to operations instead of CostGuard audit", () => {
    const answer = ask(
      "업로드된 daily report(2).pdf에서 HVDC daily logistics KPI를 추출한다. 날짜별 Delivery/Collection, Customs Clearance, ETA/New ETA, DET/DEM risk, SR/Lifting Inspection, vessel movement, packing list, return/rectification, scrap activity를 KPI 관점으로 정리하는 기준과 next action을 제시해줘."
    );

    expect(answer.summary).toContain("Daily logistics KPI");
    expect(answer.summary).not.toContain("CostGuard evidence pack");
    expect(answer.details.join(" ")).not.toContain("CostGuard evidence pack");
    expect(answer.route.domains).toEqual(expect.arrayContaining(["master", "document", "operations", "port", "marine"]));
    expect(answer.route.domains).not.toContain("cost");
    expect(answer.route.requiredDocs).toEqual(
      expect.arrayContaining([
        "CONSOLIDATED-00-master-ontology",
        "CONSOLIDATED-03-document-ocr",
        "CONSOLIDATED-09-operations"
      ])
    );
    expect(answer.route.requiredDocs).not.toContain("CONSOLIDATED-05-invoice-cost");
    expect(answer.details.join(" ")).toMatch(/operations delay\/cost exposure watchlist|운영 리스크 KPI/);
    expect(answer.actions[0]?.actionType).toBe("BUILD_DAILY_LOGISTICS_KPI_DASHBOARD");
  });

  it("keeps Daily KPI Dashboard lock requests in operations with a human gate", () => {
    const answer = ask(
      "Daily KPI Dashboard 원장에서 Owner / Risk / Next Action 컬럼만 현장 확인 후 확정값으로 잠금 처리한다. 원본 근거는 26-30 Apr 2026 daily report PDF이며 Date / Site / Activity / Shipment No는 원장 기준으로 유지한다. Owner, Risk, Next Action은 draft에서 locked confirmed 상태로 전환한다."
    );

    expect(answer.summary).toContain("Daily logistics KPI");
    expect(answer.summary).not.toContain("CostGuard evidence pack");
    expect(answer.details.join(" ")).not.toContain("CostGuard evidence pack");
    expect(answer.route.domains).toEqual(expect.arrayContaining(["master", "document", "operations"]));
    expect(answer.route.domains).not.toContain("cost");
    expect(answer.route.domains).not.toContain("material");
    expect(answer.route.domains).not.toContain("communication");
    expect(answer.route.requiredDocs).toEqual(
      expect.arrayContaining([
        "CONSOLIDATED-00-master-ontology",
        "CONSOLIDATED-03-document-ocr",
        "CONSOLIDATED-09-operations"
      ])
    );
    expect(answer.route.requiredDocs).not.toContain("CONSOLIDATED-05-invoice-cost");
    expect(answer.route.requiredDocs).not.toContain("CONSOLIDATED-06-material-chain");
    expect(answer.route.requiredDocs).not.toContain("CONSOLIDATED-08-communication");
    expect(answer.validation.some((item) => item.reasonCode === "HUMAN_GATE_REQUIRED")).toBe(true);
    expect(answer.actions.some((action) => action.actionType === "REQUEST_HUMAN_GATE_REVIEW")).toBe(true);
  });

  it("routes email draft requests to communication without reusing a fixed prior case", () => {
    const answer = ask(
      "A1a가 'This need to request branch office'라고 답한 상황에서 Faiz에게 branch office로 Sponsor Emirates ID 또는 POA + Emirates ID 요청을 보내는 이메일 초안을 작성해줘. Context: DSV clearing agent requires the Emirates ID of the sponsor mentioned in trade license, alternatively POA plus Emirates ID of the person named in the POA, for urgent Egypt to Abu Dhabi airfreight clearance Q100008617 / 194-00033224."
    );

    expect(answer.summary).toContain("HVDC 물류 이메일 답장 작성 요청");
    expect(answer.verdict).toBe("DRAFT_READY");
    expect(answer.decisionCard?.verdict).toBe("DRAFT_READY");
    expect(answer.summary).not.toContain("CostGuard evidence pack");
    expect(answer.summary).not.toContain("branch office에 Sponsor Emirates ID 또는 POA + Emirates ID");
    expect(answer.details.join(" ")).not.toContain("Dear Faiz");
    expect(answer.actions[0]?.actionType).toBe("DRAFT_CONTEXTUAL_EMAIL_REPLY");
    expect(answer.actions[0]?.humanGateRequired).toBe(false);
    expect(answer.actions[0]?.parameters.draftSource).toBe("current user-provided email/thread only");
    expect(answer.actions[0]?.parameters.hardcodedPriorCase).toBe("forbidden");
    expect(answer.route.domains).toContain("communication");
    expect(answer.route.domains).not.toContain("cost");
    expect(answer.route.requiredDocs).toContain("CONSOLIDATED-08-communication");
    expect(answer.route.requiredDocs).not.toContain("CONSOLIDATED-05-invoice-cost");
    expect(answer.validation.some((item) => item.reasonCode === "STALE_SOURCE_RISK")).toBe(false);
  });

  it("keeps generic email reply requests generic", () => {
    const answer = ask("붙여넣은 이메일 내용을 기준으로 답장작성");
    const answerText = [answer.summary, answer.businessImpact, ...answer.details, ...answer.actions.map((action) => action.actionType)].join(" ");

    expect(answer.summary).toContain("HVDC 물류 이메일 답장 작성 요청");
    expect(answer.verdict).toBe("DRAFT_READY");
    expect(answerText).not.toContain("Sponsor Emirates ID");
    expect(answerText).not.toContain("POA + Emirates ID");
    expect(answerText).not.toContain("branch office");
    expect(answerText).not.toContain("Dear Faiz");
    expect(answer.actions[0]?.actionType).toBe("DRAFT_CONTEXTUAL_EMAIL_REPLY");
    expect(answer.route.domains).toContain("communication");
  });

  it("keeps external email send behind approval and audit gate", () => {
    const answer = ask("이메일 보내줘");

    expect(answer.route.intent).toBe("EMAIL_DRAFT");
    expect(answer.verdict).toBe("PENDING_APPROVAL");
    expect(answer.decisionCard?.verdict).toBe("PENDING_APPROVAL");
    expect(answer.actions[0]?.actionType).toBe("REQUEST_EMAIL_SEND_APPROVAL");
    expect(answer.actions[0]?.humanGateRequired).toBe(true);
    expect(answer.actions[0]?.auditRecordRequired).toBe(true);
    expect(answer.actions[0]?.writeBackMode).toBe("DRY_RUN");
    expect(answer.decisionCard?.actions[0]).toEqual(
      expect.objectContaining({
        allowedNow: ["DRY_RUN"],
        blockedUntilApproved: ["APPROVAL", "WRITE", "AUDIT_RECORD"],
        humanGateRequired: true,
        auditRecordRequired: true,
        writeBackMode: "DRY_RUN",
        status: "Pending Approval"
      })
    );
  });

  it("keeps business result status separate from render-only card UI status", () => {
    const answer = ask("SCT_ONTOLOGY 카드 UI에서 failed to fetch template가 표시되는 이유와 조치가 무엇인지 설명해줘");
    expect(answer.dataStatus).toBe("OK");
    expect(answer.businessResultVisible).toBe(true);
    expect(answer.fallbackUsed).toBe(false);
    expect(answer.ui).toBeUndefined();

    const rendered = withUiState(answer);
    expect(rendered.ui?.dataStatus).toBe("OK");
    expect(rendered.ui?.uiRenderStatus).toBe("READY");
    expect(rendered.ui?.businessResultVisible).toBe(true);
    expect(rendered.ui?.fallbackUsed).toBe(false);
    expect(rendered.ui?.doNotChange).toEqual(["verdict", "validationStatus", "evidenceIds", "actions"]);
  });

  it("marks card fallback without mutating the business result", () => {
    const answer = ask("SCT_ONTOLOGY 카드 UI에서 failed to fetch template가 표시되는 이유와 조치가 무엇인지 설명해줘");
    const fallback = withUiState(answer, "FALLBACK_RENDERED", "simulated widget render failure");

    expect(fallback.verdict).toBe(answer.verdict);
    expect(fallback.validationStatus).toBe(answer.validationStatus);
    expect(fallback.evidenceIds).toEqual(answer.evidenceIds);
    expect(fallback.actions).toEqual(answer.actions);
    expect(fallback.dataStatus).toBe("OK");
    expect(fallback.businessResultVisible).toBe(true);
    expect(fallback.fallbackUsed).toBe(true);
    expect(fallback.ui?.uiRenderStatus).toBe("FALLBACK_RENDERED");
    expect(fallback.ui?.fallbackUsed).toBe(true);
    expect(fallback.ui?.errorCode).toBe("CARD_TEMPLATE_RENDER_FAILED");
  });

  it("maps supported answer statements only to evidence ids returned in the same response", () => {
    const answer = ask("Flow Code 어디에 써?");
    const evidenceTrace = answer.evidenceTrace;
    const returnedEvidenceIds = new Set(answer.evidence.map((item) => item.id));

    expect(answer.evidence.length).toBeGreaterThan(0);
    expect(evidenceTrace?.some((item) => item.supportState === "SUPPORTED")).toBe(true);
    expect(evidenceTrace?.filter((item) => item.targetType === "action").every((item) => item.supportState === "NO_DIRECT_EVIDENCE")).toBe(true);
    expect(evidenceTrace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ targetType: "summary", targetIndex: null, answerText: answer.summary }),
        expect.objectContaining({ targetType: "businessImpact", targetIndex: null, answerText: answer.businessImpact })
      ])
    );
    answer.details.forEach((detail, index) => {
      expect(evidenceTrace).toContainEqual(expect.objectContaining({ targetType: "detail", targetIndex: index, answerText: detail }));
    });
    answer.actions.forEach((action, index) => {
      expect(evidenceTrace).toContainEqual(
        expect.objectContaining({ targetType: "action", targetIndex: index, answerText: actionText(action) })
      );
    });
    for (const trace of evidenceTrace ?? []) {
      for (const evidenceId of trace.evidenceIds) {
        expect(returnedEvidenceIds.has(evidenceId), `trace cited missing evidence id ${evidenceId}`).toBe(true);
      }
    }
  });

  it("shows no-direct-evidence trace states without inventing evidence for unsupported answers", () => {
    const answer = ask("ZXQ999999 FROBULATOR 확인해줘");
    const evidenceTrace = (answer as { evidenceTrace?: Array<{ supportState: string; evidenceIds: string[] }> }).evidenceTrace;

    expect(answer.verdict).toBe("NO_EVIDENCE");
    expect(answer.evidence).toHaveLength(0);
    expect(answer.evidenceIds).toHaveLength(0);
    expect(evidenceTrace?.length).toBeGreaterThan(0);
    expect(evidenceTrace?.every((item) => item.supportState === "NO_DIRECT_EVIDENCE" && item.evidenceIds.length === 0)).toBe(true);
  });

  it("keeps blocked validation and actions intact while adding trace display data", () => {
    const answer = ask("Flow Code로 customs stage 분류해줘");

    expect(answer.verdict).toBe("BLOCK");
    expect(answer.validationStatus).toBe("BLOCK");
    expect(answer.validation.some((item) => item.reasonCode === "FLOW_CODE_SCOPE_VIOLATION")).toBe(true);
    expect(answer.actions).toEqual(
      expect.arrayContaining([expect.objectContaining({ actionType: "KEEP_FLOW_CODE_WHP_ONLY", humanGateRequired: false })])
    );
    expect(answer.evidenceTrace.length).toBeGreaterThan(0);
    expect(answer.evidenceTrace.every((trace) => trace.evidenceIds.every((id) => answer.evidenceIds.includes(id)))).toBe(true);
  });

  it("masks email and phone in input", () => {
    const masked = maskPii("Contact user@example.com or +971 50 123 4567");
    expect(masked.piiMasked).toBe(true);
    expect(masked.text).not.toContain("user@example.com");
    expect(masked.text).not.toContain("+971 50 123 4567");
  });
});

// ─── mergeShipmentValidation unit coverage ────────────────────────────────────

describe("mergeShipmentValidation unit coverage", () => {
  function makeRule(overrides: Partial<ShipmentRuleResult> = {}): ShipmentRuleResult {
    return {
      found: true,
      source: "sample_shipment_rule_engine",
      supportLevel: "SECONDARY_SAMPLE_VALIDATION",
      status: "PASS",
      matchedKey: "UNIT-001",
      shipmentId: "UNIT-SHIP-001",
      risks: [],
      missingDocuments: [],
      openExceptions: [],
      invoiceAudit: [],
      invoiceExposureAed: null,
      humanGateRequired: false,
      message: "Unit test stub.",
      ...overrides
    };
  }

  it("returns empty findings and actions when shipmentRule is undefined", () => {
    const result = mergeShipmentValidation(undefined);
    expect(result.findings).toHaveLength(0);
    expect(result.actions).toHaveLength(0);
  });

  it("returns empty findings and actions when found is false", () => {
    const result = mergeShipmentValidation(makeRule({ found: false }));
    expect(result.findings).toHaveLength(0);
    expect(result.actions).toHaveLength(0);
  });

  it("missing SITE_RECEIPT document produces BLOCK severity finding", () => {
    const result = mergeShipmentValidation(makeRule({ missingDocuments: ["SITE_RECEIPT", "DN"] }));
    const finding = result.findings.find((f) => f.ruleId === "V-SHIPMENT-DOCS-001");
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe("BLOCK");
    expect(finding?.status).toBe("BLOCK");
  });

  it("missing document without SITE_RECEIPT produces WARN severity finding", () => {
    const result = mergeShipmentValidation(makeRule({ missingDocuments: ["PACKING_LIST"] }));
    const finding = result.findings.find((f) => f.ruleId === "V-SHIPMENT-DOCS-001");
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe("WARN");
    expect(finding?.status).toBe("WARN");
  });

  it("invoice exposure exactly at 100000 does NOT trigger finance gate", () => {
    const result = mergeShipmentValidation(makeRule({ invoiceExposureAed: "100000" }));
    expect(result.findings.some((f) => f.ruleId === "V-SHIPMENT-INVOICE-001")).toBe(false);
    expect(result.actions.some((a) => a.actionType === "REQUEST_FINANCE_GATE_REVIEW")).toBe(false);
  });

  it("invoice exposure above 100000 triggers finance gate finding and action", () => {
    const result = mergeShipmentValidation(makeRule({ invoiceExposureAed: "100000.01" }));
    const finding = result.findings.find((f) => f.ruleId === "V-SHIPMENT-INVOICE-001");
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe("BLOCK");
    expect(result.actions.some((a) => a.actionType === "REQUEST_FINANCE_GATE_REVIEW")).toBe(true);
  });

  it("invoice audit with BLOCK severity triggers finance gate even when exposure is 0", () => {
    const result = mergeShipmentValidation(makeRule({
      invoiceAudit: [{ severity: "BLOCK", humanGate: false }]
    }));
    expect(result.findings.some((f) => f.ruleId === "V-SHIPMENT-INVOICE-001")).toBe(true);
  });

  it("invoice audit with CRITICAL severity triggers finance gate", () => {
    const result = mergeShipmentValidation(makeRule({
      invoiceAudit: [{ severity: "CRITICAL", humanGate: false }]
    }));
    expect(result.findings.some((f) => f.ruleId === "V-SHIPMENT-INVOICE-001")).toBe(true);
  });

  it("invoice audit with humanGate=true triggers finance gate", () => {
    const result = mergeShipmentValidation(makeRule({
      invoiceAudit: [{ severity: "INFO", humanGate: true }]
    }));
    expect(result.findings.some((f) => f.ruleId === "V-SHIPMENT-INVOICE-001")).toBe(true);
  });

  it("no risks and no missing documents produces no findings", () => {
    const result = mergeShipmentValidation(makeRule());
    expect(result.findings).toHaveLength(0);
    expect(result.actions).toHaveLength(0);
  });

  it("AGI/DAS MOSB Gate risk produces BLOCK finding and human gate action", () => {
    const result = mergeShipmentValidation(makeRule({
      risks: [{ rule: "AGI/DAS MOSB Gate check", detail: "Missing M115 evidence." }]
    }));
    const finding = result.findings.find((f) => f.ruleId === "V-SHIPMENT-AGIDAS-001");
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe("BLOCK");
    expect(finding?.reasonCode).toBe("SHIPMENT_AGIDAS_MOSB_CHAIN_REQUIRED");
    const action = result.actions.find((a) => a.actionType === "REQUEST_SHIPMENT_RULE_HUMAN_GATE");
    expect(action).toBeDefined();
    expect(action?.humanGateRequired).toBe(true);
  });

  it("all rule findings always carry empty evidenceIds array", () => {
    const result = mergeShipmentValidation(makeRule({
      risks: [{ rule: "AGI/DAS MOSB Gate check", detail: "Missing chain." }],
      missingDocuments: ["SITE_RECEIPT"],
      invoiceExposureAed: "200000"
    }));
    for (const finding of result.findings) {
      expect(finding.evidenceIds).toEqual([]);
    }
  });

  it("missing documents finding message contains the shipment ID", () => {
    const result = mergeShipmentValidation(makeRule({
      shipmentId: "HVDC-UNIT-999",
      missingDocuments: ["DN"]
    }));
    const finding = result.findings.find((f) => f.ruleId === "V-SHIPMENT-DOCS-001");
    expect(finding?.message).toContain("HVDC-UNIT-999");
  });
});
