import { describe, expect, it } from "vitest";
import { answerQuestion } from "../server/src/answer.js";
import { maskPii } from "../server/src/redact.js";

function ask(question: string) {
  return answerQuestion({ question, userRole: "test", language: "ko" });
}

describe("HVDC ontology grounded answer pipeline", () => {
  it("blocks AGI/DAS M130 closure without MOSB/LCT chain evidence", () => {
    const answer = ask("AGI M130 닫아도 돼? BL-535 관련");
    expect(answer.verdict).toBe("BLOCK");
    expect(answer.validation.some((item) => item.ruleId === "V-AGIDAS-001")).toBe(true);
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
  });

  it("masks email and phone in input", () => {
    const masked = maskPii("Contact user@example.com or +971 50 123 4567");
    expect(masked.piiMasked).toBe(true);
    expect(masked.text).not.toContain("user@example.com");
    expect(masked.text).not.toContain("+971 50 123 4567");
  });
});
