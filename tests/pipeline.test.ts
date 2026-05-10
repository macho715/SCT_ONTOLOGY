import { describe, expect, it } from "vitest";
import { answerQuestion, validateGrounding } from "../server/src/answer.js";
import { maskPii } from "../server/src/redact.js";
import type { EvidenceSnippet, IntentRoute } from "../server/src/types.js";

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

  it("masks email and phone in input", () => {
    const masked = maskPii("Contact user@example.com or +971 50 123 4567");
    expect(masked.piiMasked).toBe(true);
    expect(masked.text).not.toContain("user@example.com");
    expect(masked.text).not.toContain("+971 50 123 4567");
  });
});
