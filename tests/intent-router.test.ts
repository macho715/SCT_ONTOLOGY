import { describe, expect, it } from "vitest";
import { answerQuestion } from "../server/src/answer.js";
import { classifyIntent, resolveRulePackIds, routeQuestion } from "../server/src/router.js";

const systemDiagnosticPrompts = [
  "SCT_ONTOLOGY CARD 전반 점검/패치",
  "CARD router validation evidence schema 점검해줘",
  "SCT_ONTOLOGY 카드가 이메일 답장 intent로 오분류되는지 audit",
  "DecisionCard verdict와 primaryReason consistency 검사",
  "SYSTEM_QA_RULEPACK 회귀 테스트 시나리오 만들어줘",
  "EvidenceRanker directSupport scoring 점검",
  "Renderer widget fallback 상태 확인",
  "answer-card template failed to fetch 원인 진단",
  "CARD_RENDERING_AUDIT: trace tab 누락 점검",
  "validation drawer ruleId 표시 패치 검토",
  "schema v2 blockedBy requiredInputs 확인",
  "router hard-negative rule 확인",
  "SCT card upgrade acceptance criteria 검토",
  "rulepack binding intent domain action matrix 점검",
  "HumanGate state machine 연결 상태 진단",
  "P2 leakage ZERO gate 카드 테스트",
  "SYSTEM_DIAGNOSTIC 프롬프트 라우팅 검증",
  "ontology patch review backlog 생성",
  "card rendering audit with email keyword",
  "email validation rule이 system audit에서 발화하는지 점검",
  "cost approval keyword가 CARD 점검에서 차단되는지 확인",
  "external send rule을 router audit에서 막아라",
  "SCT_ONTOLOGY schema governance upgrade",
  "CARD validation evidence trace 패치 사양 검토",
  "DecisionCard v2 allowedActions blockedActions consistency",
  "sourceHash approvalTrace validationReport ZERO gate 점검",
  "React card tabs schema 점검",
  "Next.js frontend가 아니어도 CARD spec 반영 상태 감사",
  "OpenAI component bridge template render 진단",
  "SCT_ONTOLOGY_CARD_UPGRADE_SPEC_v1.0.md 구현 상태 점검"
];

describe("SCT card upgrade intent router", () => {
  it("P0: system/card diagnostic prompts never route to EMAIL_DRAFT", () => {
    expect(systemDiagnosticPrompts).toHaveLength(30);

    for (const prompt of systemDiagnosticPrompts) {
      const route = routeQuestion(prompt, "test", "ko");

      expect(route.intent, prompt).not.toBe("EMAIL_DRAFT");
      expect(route.blockedActions, prompt).toEqual(
        expect.arrayContaining(["email_draft", "external_send", "cost_approval"])
      );
      expect(route.rulePackIds, prompt).toContain("SYSTEM_QA_RULEPACK");
      expect(route.rulePackIds, prompt).not.toContain("COMM_RULEPACK");
      expect(route.rulePackIds, prompt).not.toContain("COST_RULEPACK");
    }
  });

  it("keeps explicit email draft requests in EMAIL_DRAFT", () => {
    const route = routeQuestion("붙여넣은 이메일 내용을 기준으로 답장 초안 작성", "test", "ko");

    expect(route.intent).toBe("EMAIL_DRAFT");
    expect(route.domains).toContain("communication");
    expect(route.rulePackIds).toContain("COMM_RULEPACK");
    expect(route.blockedActions).toContain("external_send_without_approval");
  });

  it("keeps explicit cost approval/audit requests in COST_GUARD", () => {
    const route = routeQuestion("Invoice 120900 AED 승인 전 CostGuard audit 수행", "test", "ko");

    expect(route.intent).toBe("COST_GUARD");
    expect(route.domains).toContain("cost");
    expect(route.rulePackIds).toContain("COST_RULEPACK");
    expect(route.blockedActions).toContain("invoice_approval_without_rateref_tariffref");
  });

  it("classifyIntent applies the hard-negative before email/cost candidates", () => {
    expect(classifyIntent("SCT CARD email draft validation 점검")).toBe("CARD_RENDERING_AUDIT");
    expect(classifyIntent("SCT_ONTOLOGY CARD cost approval schema 패치")).toBe("CARD_RENDERING_AUDIT");
  });

  it("resolveRulePackIds excludes write rulepacks for system intents", () => {
    const rulePacks = resolveRulePackIds("SYSTEM_DIAGNOSTIC", ["system", "master", "communication", "cost"]);

    expect(rulePacks).toContain("SYSTEM_QA_RULEPACK");
    expect(rulePacks).not.toContain("COMM_RULEPACK");
    expect(rulePacks).not.toContain("COST_RULEPACK");
  });

  it("system diagnostics answer as diagnostics, not email drafts", () => {
    const answer = answerQuestion({
      question: "SCT_ONTOLOGY CARD 이메일 validation 오분류를 점검/패치해줘",
      userRole: "test",
      language: "ko"
    });

    expect(answer.route.intent).toBe("CARD_RENDERING_AUDIT");
    expect(answer.summary).toContain("시스템 점검 요청");
    expect(answer.summary).not.toContain("이메일 답장 작성 요청");
    expect(answer.actions.some((action) => action.actionType === "DRAFT_CONTEXTUAL_EMAIL_REPLY")).toBe(false);
    expect(answer.validation.some((finding) => finding.ruleId === "SYS-ROUTER-001")).toBe(true);
    expect(answer.decisionCard?.intent).toBe("CARD_RENDERING_AUDIT");
  });
});
