import { describe, expect, it } from "vitest";
import goldenPrompts from "./golden_prompts.json" with { type: "json" };
import { answerQuestion, answerToText } from "../server/src/answer.js";
import type { ReasonCode, Verdict } from "../server/src/types.js";

type EvidenceCondition = "present" | "absent";

type GoldenPrompt = {
  id: string;
  question: string;
  expectedVerdicts: Verdict[];
  requiredRuleIds: string[];
  requiredReasonCodes?: ReasonCode[];
  requiredDocsContain: string[];
  requiredEvidenceDocsContain?: string[];
  evidenceCondition: EvidenceCondition;
  piiMasked?: boolean;
  rawMustNotAppear?: string[];
  unsupportedTermsMustNotAppear?: string[];
  humanGateRequired?: boolean;
};

function hasRequiredDoc(requiredDocs: string[], docFragment: string): boolean {
  return requiredDocs.some((doc) => doc.includes(docFragment));
}

function renderedAnswerText(answer: ReturnType<typeof answerQuestion>): string {
  return JSON.stringify(answer) + "\n" + answerToText(answer);
}

describe("golden prompt validation gates", () => {
  const prompts = goldenPrompts as GoldenPrompt[];

  it("keeps at least 10 golden prompts for validation coverage", () => {
    expect(prompts.length).toBeGreaterThanOrEqual(14);
  });

  it.each(prompts)("$id validates verdict, rules, docs, and evidence condition", (prompt) => {
    const answer = answerQuestion({ question: prompt.question, userRole: "eval", language: "ko" });
    const ruleIds = new Set(answer.validation.map((finding) => finding.ruleId));
    const reasonCodes = new Set(answer.validation.map((finding) => finding.reasonCode));

    expect(prompt.expectedVerdicts).toContain(answer.verdict);

    for (const ruleId of prompt.requiredRuleIds) {
      expect(ruleIds.has(ruleId), `${prompt.id} missing validation rule ${ruleId}`).toBe(true);
    }

    for (const reasonCode of prompt.requiredReasonCodes ?? []) {
      expect(reasonCodes.has(reasonCode), `${prompt.id} missing reason code ${reasonCode}`).toBe(true);
    }

    for (const docFragment of prompt.requiredDocsContain) {
      expect(hasRequiredDoc(answer.route.requiredDocs, docFragment), `${prompt.id} missing required doc ${docFragment}`).toBe(true);
    }

    if (prompt.evidenceCondition === "present") {
      expect(answer.evidence.length, `${prompt.id} should carry EvidenceSnippet entries`).toBeGreaterThan(0);
      expect(answer.evidence.some((item) => item.docId.includes("CONSOLIDATED-00")), `${prompt.id} should include master evidence`).toBe(true);
      for (const docFragment of prompt.requiredEvidenceDocsContain ?? []) {
        expect(
          answer.evidence.some((item) => item.docId.includes(docFragment)),
          `${prompt.id} missing required evidence doc ${docFragment}`
        ).toBe(true);
      }
    } else {
      expect(answer.evidence.length, `${prompt.id} should fail closed without EvidenceSnippet entries`).toBe(0);
      expect(answer.evidenceIds.length, `${prompt.id} should not cite unsupported evidence`).toBe(0);
      expect(answer.validation.some((finding) => finding.ruleId === "A-ANS-001")).toBe(true);
      expect(answer.validation.some((finding) => finding.reasonCode === "INSUFFICIENT_EVIDENCE")).toBe(true);
    }

    if (prompt.humanGateRequired) {
      expect(answer.actions.some((action) => action.humanGateRequired), `${prompt.id} should require Human-gate action`).toBe(true);
    }

    if (prompt.piiMasked !== undefined) {
      expect(answer.piiMasked).toBe(prompt.piiMasked);
    }

    for (const raw of prompt.rawMustNotAppear ?? []) {
      expect(renderedAnswerText(answer), `${prompt.id} leaked raw PII: ${raw}`).not.toContain(raw);
    }

    for (const term of prompt.unsupportedTermsMustNotAppear ?? []) {
      expect(renderedAnswerText(answer), `${prompt.id} included unsupported term: ${term}`).not.toContain(term);
    }
  });
});
