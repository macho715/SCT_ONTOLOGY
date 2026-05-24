import { describe, expect, it } from "vitest";
import { answerQuestion } from "../server/src/answer.js";
import type { ReasonCode, Verdict } from "../server/src/types.js";

type GovernanceGate = "AMBER" | "ZERO";

type RuntimeScenario = {
  name: string;
  question: string;
  governanceGate: GovernanceGate;
  acceptedRuntimeVerdicts: Verdict[];
  requiredReasonCodes: ReasonCode[];
  humanGateRequired?: boolean;
};

const scenarios: RuntimeScenario[] = [
  {
    name: "FANR current authority questions stay warning-gated",
    question: "FANR permit 현재 기준으로 필요한가?",
    governanceGate: "AMBER",
    acceptedRuntimeVerdicts: ["WARN", "BLOCK"],
    requiredReasonCodes: ["STALE_SOURCE_RISK"]
  },
  {
    name: "customs release without COO and permit is blocked",
    question: "CI/PL과 HS code는 있는데 COO와 permit 없이 BOE release 진행해도 돼?",
    governanceGate: "ZERO",
    acceptedRuntimeVerdicts: ["BLOCK", "NO_EVIDENCE"],
    requiredReasonCodes: ["SCT_CUSTOMS_EVIDENCE_REQUIRED"]
  },
  {
    name: "invoice approval above the human-gate threshold is blocked",
    question: "Invoice exposure 120900 AED 승인하고 Finance에 반영해도 돼?",
    governanceGate: "ZERO",
    acceptedRuntimeVerdicts: ["BLOCK", "NO_EVIDENCE"],
    requiredReasonCodes: ["SCT_COST_EVIDENCE_REQUIRED", "HUMAN_GATE_REQUIRED"],
    humanGateRequired: true
  },
  {
    name: "tariff support with RateRef only is blocked",
    question: "이 항목은 최신 tariff 기준으로 청구 가능하다고 답해도 돼? RateRef만 있어.",
    governanceGate: "ZERO",
    acceptedRuntimeVerdicts: ["BLOCK", "NO_EVIDENCE"],
    requiredReasonCodes: ["SCT_COST_EVIDENCE_REQUIRED", "STALE_SOURCE_RISK"],
    humanGateRequired: true
  },
  {
    name: "DEM/DET with partial timestamps stays warning-gated",
    question: "컨테이너 DEM/DET 노출을 확정해도 돼? discharge와 free time만 확인됐어.",
    governanceGate: "AMBER",
    acceptedRuntimeVerdicts: ["WARN", "BLOCK", "NO_EVIDENCE"],
    requiredReasonCodes: ["HUMAN_GATE_REQUIRED"],
    humanGateRequired: true
  },
  {
    name: "AGI DAS M130 close without chain evidence is delivered with MOSB backfill",
    question: "BL-AUH-002 AGI/DAS M130 닫아도 돼? M115/M116/M117은 아직 없어.",
    governanceGate: "AMBER",
    acceptedRuntimeVerdicts: ["WARN", "BLOCK", "NO_EVIDENCE"],
    requiredReasonCodes: ["MOSB_EVIDENCE_MISSING"],
    humanGateRequired: false
  },
  {
    name: "site receipt without SITE_RECEIPT does not pass",
    question: "BL-AUH-002 DO는 있는데 SITE_RECEIPT가 없다. 자재가 현장 도착한 것으로 처리해도 돼?",
    governanceGate: "AMBER",
    acceptedRuntimeVerdicts: ["WARN", "BLOCK", "NO_EVIDENCE"],
    requiredReasonCodes: ["SHIPMENT_MISSING_DOCUMENTS"],
    humanGateRequired: true
  },
  {
    name: "ETA based on a single carrier update stays warning-gated",
    question: "ETA가 carrier update 하나뿐인데 확정해도 돼?",
    governanceGate: "AMBER",
    acceptedRuntimeVerdicts: ["WARN", "BLOCK", "NO_EVIDENCE"],
    requiredReasonCodes: ["HUMAN_GATE_REQUIRED"],
    humanGateRequired: true
  },
  {
    name: "OOG cargo without lift plan is blocked",
    question: "OOG cargo lift plan 없이 진행해도 돼?",
    governanceGate: "ZERO",
    acceptedRuntimeVerdicts: ["BLOCK", "NO_EVIDENCE"],
    requiredReasonCodes: ["SCT_OOG_SAFETY_EVIDENCE_REQUIRED"]
  },
  {
    name: "claim letter without POD and survey is blocked",
    question: "Claim letter를 POD와 survey 없이 발행해도 돼?",
    governanceGate: "ZERO",
    acceptedRuntimeVerdicts: ["BLOCK", "NO_EVIDENCE"],
    requiredReasonCodes: ["SCT_CLAIM_EVIDENCE_REQUIRED"]
  }
];

describe("sct_ontology governance scenarios match ask_hvdc_ontology runtime gates", () => {
  it.each(scenarios)("$name", (scenario) => {
    const answer = answerQuestion({ question: scenario.question, userRole: "test", language: "ko" });
    const reasonCodes = new Set(answer.validation.map((finding) => finding.reasonCode));

    expect(scenario.acceptedRuntimeVerdicts).toContain(answer.verdict);
    expect(answer.verdict, `${scenario.governanceGate} scenarios must not pass`).not.toBe("PASS");

    for (const reasonCode of scenario.requiredReasonCodes) {
      expect(reasonCodes.has(reasonCode), `${scenario.name} missing ${reasonCode}`).toBe(true);
    }

    if (scenario.humanGateRequired) {
      expect(answer.actions.some((action) => action.humanGateRequired), `${scenario.name} should require human gate`).toBe(true);
    }

    for (const trace of answer.evidenceTrace) {
      for (const evidenceId of trace.evidenceIds) {
        expect(answer.evidenceIds).toContain(evidenceId);
      }
    }
  });
});
