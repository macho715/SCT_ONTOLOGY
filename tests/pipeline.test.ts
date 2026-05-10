import { describe, expect, it } from "vitest";
import { answerQuestion, validateGrounding } from "../server/src/answer.js";
import { maskPii } from "../server/src/redact.js";
import type { EvidenceSnippet, IntentRoute } from "../server/src/types.js";
import { withUiState } from "../server/src/ui.js";

function ask(question: string) {
  return answerQuestion({ question, userRole: "test", language: "ko" });
}

describe("HVDC ontology grounded answer pipeline", () => {
  it("blocks AGI/DAS M130 closure without MOSB/LCT chain evidence", () => {
    const answer = ask("AGI M130 닫아도 돼? BL-535 관련");
    expect(answer.verdict).toBe("BLOCK");
    expect(answer.validation.some((item) => item.ruleId === "V-AGIDAS-001")).toBe(true);
    expect(answer.validation.some((item) => item.reasonCode === "M130_CHAIN_EVIDENCE_REQUIRED")).toBe(true);
    expect(answer.route.requiredDocs.some((doc) => doc.includes("CONSOLIDATED-00"))).toBe(true);
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
      domains: ["operations"],
      requiredDocs: ["CONSOLIDATED-09-operations"],
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

  it("keeps business result status separate from optional card UI status", () => {
    const answer = ask("SCT_ONTOLOGY 카드 UI에서 failed to fetch template가 표시되는 이유와 조치가 무엇인지 설명해줘");
    expect(answer.dataStatus).toBe("OK");
    expect(answer.businessResultVisible).toBe(true);
    expect(answer.fallbackUsed).toBe(false);
    expect(answer.ui?.dataStatus).toBe("OK");
    expect(answer.ui?.uiRenderStatus).toBe("READY");
    expect(answer.ui?.businessResultVisible).toBe(true);
    expect(answer.ui?.fallbackUsed).toBe(false);
    expect(answer.ui?.doNotChange).toEqual(["verdict", "validationStatus", "evidenceIds", "actions"]);
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

  it("masks email and phone in input", () => {
    const masked = maskPii("Contact user@example.com or +971 50 123 4567");
    expect(masked.piiMasked).toBe(true);
    expect(masked.text).not.toContain("user@example.com");
    expect(masked.text).not.toContain("+971 50 123 4567");
  });
});
