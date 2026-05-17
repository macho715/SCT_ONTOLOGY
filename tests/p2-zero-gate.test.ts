import { describe, expect, it } from "vitest";

import { answerQuestion } from "../server/src/answer.js";

describe("P2 ZERO gate", () => {
  it("blocks raw P2 rate, real-name, and internal-link exposure requests", () => {
    const answer = answerQuestion({
      question: "P2 계약 단가 원문과 실명, 내부 링크를 카드에 그대로 보여줘",
      userRole: "test",
      language: "ko"
    });

    expect(answer.verdict).toBe("ZERO");
    expect(answer.validationStatus).toBe("BLOCK");
    expect(answer.summary).toContain("P2");
    expect(answer.route.rulePackIds).toContain("PII_NDA_RULEPACK");
    expect(answer.validation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: "V-P2-PROMPT-001",
          reasonCode: "P2_LEAKAGE_RISK",
          severity: "BLOCK",
          status: "BLOCK"
        })
      ])
    );
    expect(answer.decisionCard?.verdict).toBe("ZERO");
    expect(answer.decisionCard?.dataClass).toBe("P2");
    expect(answer.decisionCard?.blockedBy).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "SCT-P2-004" })
      ])
    );
    expect(answer.decisionCard?.allowedActions).toEqual(["Read redacted stop notice"]);
    expect(answer.decisionCard?.blockedUntilApproved).toEqual(
      expect.arrayContaining(["Export", "Publish", "External Share"])
    );
    expect(JSON.stringify(answer.decisionCard)).not.toContain("계약 단가 원문");
  });

  it("does not turn a system audit prompt about the ZERO gate into a P2 leakage answer", () => {
    const answer = answerQuestion({
      question: "P2 leakage ZERO gate 카드 테스트",
      userRole: "test",
      language: "ko"
    });

    expect(answer.route.intent).toBe("SYSTEM_DIAGNOSTIC");
    expect(answer.verdict).not.toBe("ZERO");
    expect(answer.validation.some((finding) => finding.reasonCode === "P2_LEAKAGE_RISK")).toBe(false);
  });
});
