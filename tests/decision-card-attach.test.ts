import { describe, expect, it } from "vitest";

import { answerQuestion } from "../server/src/answer.js";

describe("Decision Card v2 attachment", () => {
  it("attaches a decisionCard payload to every grounded answer", () => {
    const answer = answerQuestion({
      question: "Flow Code를 routing classification으로 써도 되나?",
      userRole: "test",
      language: "ko"
    });

    expect(answer.decisionCard).toBeDefined();
    expect(answer.decisionCard?.cardId).toBeTruthy();
  });

  it("keeps the decisionCard verdict aligned with the answer verdict family", () => {
    const answer = answerQuestion({
      question: "Flow Code를 routing classification으로 써도 되나?",
      userRole: "test",
      language: "ko"
    });

    expect(answer.verdict).toBe("BLOCK");
    expect(answer.decisionCard?.verdict).toBe("BLOCK");
  });

  it("preserves route traceability from the base answer", () => {
    const answer = answerQuestion({
      question: "BOE와 DO evidence 기준으로 customs release 판단해줘",
      userRole: "test",
      language: "ko"
    });

    expect(answer.decisionCard?.routeId).toBe(answer.route.routeId);
    expect(answer.decisionCard?.trace.routeId).toBe(answer.route.routeId);
  });

  it("surfaces blocked actions and unblock guidance in the attached payload", () => {
    const answer = answerQuestion({
      question: "AGI M130 site closure를 M115 없이 닫아도 되나?",
      userRole: "test",
      language: "ko"
    });

    expect(answer.decisionCard?.blockedActions).toContain("Report publication");
    expect(answer.decisionCard?.unblockSummary).toContain("BOE");
  });
});
