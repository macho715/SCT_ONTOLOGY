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

  it("surfaces AGI/DAS MOSB backfill guidance in the attached payload", () => {
    const answer = answerQuestion({
      question: "AGI M130 site closure를 M115 없이 닫아도 되나?",
      userRole: "test",
      language: "ko"
    });

    expect(answer.decisionCard?.verdict).toBe("WARN");
    expect(answer.decisionCard?.blockedActions).not.toContain("Report publication");
    expect(answer.decisionCard?.nextAction).toContain("BACKFILL_MOSB_CHAIN_EVIDENCE");
    expect(answer.decisionCard?.actions[0]?.requiredInput).toContain("M115/M116/M117");
  });
});
