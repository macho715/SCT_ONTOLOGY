import { describe, expect, it } from "vitest";
import { answerQuestion } from "../server/src/answer.js";
import { searchCorpus } from "../server/src/corpus.js";
import { FMC_ROLE_DOC, routeQuestion } from "../server/src/router.js";

const PHONE_RE = /(?:\+\d[\d ()-]{8,}\d|\b\d{3}[\s()-]+\d{3,4}[\s()-]+\d{4}\b)/;

function renderedAnswerText(answer: ReturnType<typeof answerQuestion>): string {
  return JSON.stringify(answer);
}

describe("FMC role evidence corpus integration", () => {
  it("routes named person responsibility questions to the FMC role corpus and master spine", () => {
    const route = routeQuestion("Arvin FANR BOE 담당 업무", "scm_manager", "ko");

    expect(route.requiredDocs).toContain("CONSOLIDATED-00-master-ontology");
    expect(route.requiredDocs).toContain(FMC_ROLE_DOC);
    expect(route.domains).toContain("team");
  });

  it("retrieves FMC role evidence for Arvin customs responsibility questions", () => {
    const answer = answerQuestion({ question: "Arvin FANR BOE 담당 업무", userRole: "scm_manager", language: "ko" });

    expect(answer.evidence.some((item) => item.docId === FMC_ROLE_DOC)).toBe(true);
    expect(answer.evidence.some((item) => item.docId.includes("CONSOLIDATED-00"))).toBe(true);
    expect(renderedAnswerText(answer)).not.toMatch(PHONE_RE);
  });

  it("retrieves FMC role evidence for milestone-owner lookup without weakening human-gate behavior", () => {
    const answer = answerQuestion({ question: "M115 담당자 누구야?", userRole: "ops_user", language: "ko" });

    expect(answer.route.requiredDocs).toContain(FMC_ROLE_DOC);
    expect(answer.route.requiredDocs).toContain("CONSOLIDATED-00-master-ontology");
    expect(answer.evidence.some((item) => item.docId === FMC_ROLE_DOC)).toBe(true);
    expect(renderedAnswerText(answer)).not.toMatch(PHONE_RE);
  });

  it("keeps protected action requests behind the existing human gate", () => {
    const answer = answerQuestion({ question: "Arvin FANR BOE 담당 내용을 외부 보고서로 export 해줘", userRole: "scm_manager", language: "ko" });

    expect(answer.route.requiredDocs).toContain(FMC_ROLE_DOC);
    expect(answer.validation.some((item) => item.reasonCode === "HUMAN_GATE_REQUIRED")).toBe(true);
    expect(answer.actions.some((action) => action.humanGateRequired)).toBe(true);
  });

  it("can search the FMC role corpus directly by document id", () => {
    const evidence = searchCorpus({
      query: "Arvin BOE FANR",
      requiredDocs: [FMC_ROLE_DOC],
      domainHints: ["team"],
      topK: 5
    });

    expect(evidence.some((item) => item.docId === FMC_ROLE_DOC)).toBe(true);
  });
});
