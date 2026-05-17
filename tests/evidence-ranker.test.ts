import { describe, expect, it } from "vitest";
import { searchCorpus } from "../server/src/corpus.js";
import { answerQuestion } from "../server/src/answer.js";

function topThreeDirectSupportRatio(query: string): number {
  const evidence = searchCorpus({
    query,
    requiredDocs: ["CONSOLIDATED-00-master-ontology"],
    domainHints: ["master", "warehouse", "document"],
    topK: 5
  });
  const topThree = evidence.slice(0, 3);
  return topThree.filter((item) => (item.evidenceScore?.directSupport ?? 0) >= 0.8).length / topThree.length;
}

describe("EvidenceRanker v2", () => {
  it("attaches EvidenceScore fields to retrieved ontology evidence", () => {
    const [first] = searchCorpus({
      query: "Flow Code confirmedFlowCode warehouse handling profile",
      requiredDocs: ["CONSOLIDATED-00-master-ontology"],
      domainHints: ["master", "warehouse"],
      topK: 1
    });

    expect(first.evidenceScore).toEqual(
      expect.objectContaining({
        evidenceId: first.id,
        supportState: "SUPPORTED"
      })
    );
    expect(first.evidenceScore?.directSupport).toBeGreaterThanOrEqual(0.8);
    expect(first.evidenceScore?.finalScore).toBeGreaterThan(0);
  });

  it("keeps direct-support evidence at or above the P1 top-3 threshold for canonical queries", () => {
    expect(topThreeDirectSupportRatio("Flow Code confirmedFlowCode warehouse handling profile")).toBeGreaterThanOrEqual(0.8);
    expect(topThreeDirectSupportRatio("BOE DO customs release evidence")).toBeGreaterThanOrEqual(0.8);
  });

  it("surfaces directSupportRatio in DecisionCard evidence coverage", () => {
    const answer = answerQuestion({
      question: "Flow Code confirmedFlowCode warehouse handling profile",
      userRole: "ops_user",
      language: "ko"
    });

    expect(answer.decisionCard?.evidenceCoverage.length).toBeGreaterThan(0);
    expect(
      answer.decisionCard?.evidenceCoverage.some((item) => item.directSupportRatio >= 0.8)
    ).toBe(true);
  });
});
