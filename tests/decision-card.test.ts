import { describe, expect, it } from "vitest";
import {
  buildBlockedActions,
  buildEvidenceCoverage,
  deriveHumanGateState,
  derivePiiStatus,
  deriveVerdict,
  evaluateActionGate,
  REASON_CODE_TO_RULE,
  RULE_MATRIX,
  toDecisionCardPayload
} from "../server/src/decision-card.js";
import type { GroundedAnswer } from "../server/src/types.js";

const baseDerive = {
  missingRequiredInputs: [] as readonly string[],
  piiStatus: "None" as const,
  approvalRequired: false,
  approvalStatus: "NotRequired" as const,
  lowConfidenceHighRisk: false,
  hasBlockingFindings: false,
  hasWarningFindings: false
};

function makeAnswer(overrides: Partial<GroundedAnswer> = {}): GroundedAnswer {
  return {
    answerId: "ans-001",
    verdict: "PASS",
    dataStatus: "OK",
    businessResultVisible: true,
    fallbackUsed: false,
    summary: "summary",
    businessImpact: "impact",
    details: [],
    evidenceIds: [],
    validationStatus: "PASS",
    route: {
      routeId: "ROUTE-001",
      intent: "GENERAL_ANSWER",
      domains: ["master"],
      requiredDocs: ["CONSOLIDATED-00"],
      rulePackIds: ["SYSTEM_QA_RULEPACK"],
      allowedActions: ["read"],
      blockedActions: ["write_back"],
      confidence: 0.9,
      routingReason: "default"
    },
    resolvedEntities: [],
    evidence: [],
    evidenceTrace: [],
    validation: [],
    actions: [],
    graphPath: null,
    piiMasked: true,
    generatedAt: "2026-05-17T12:00:00Z",
    ...overrides
  };
}

describe("deriveVerdict — fail-safe BLOCK precedence", () => {
  it("returns PASS when nothing is blocking or warning", () => {
    expect(deriveVerdict(baseDerive)).toBe("PASS");
  });

  it("AC-011: returns BLOCK when hasBlockingFindings even if no missing inputs (fail-safe)", () => {
    expect(
      deriveVerdict({ ...baseDerive, hasBlockingFindings: true })
    ).toBe("BLOCK");
  });

  it("returns ZERO when a zero-gate finding is present", () => {
    expect(deriveVerdict({ ...baseDerive, hasZeroFindings: true })).toBe("ZERO");
  });

  it("returns DIAGNOSTIC for system QA verdicts", () => {
    expect(deriveVerdict({ ...baseDerive, hasDiagnosticVerdict: true })).toBe("DIAGNOSTIC");
  });

  it("FR-008: returns BLOCK when piiStatus is Risk", () => {
    expect(deriveVerdict({ ...baseDerive, piiStatus: "Risk" })).toBe("BLOCK");
  });

  it("FR-007: returns BLOCK when missingRequiredInputs is non-empty", () => {
    expect(
      deriveVerdict({ ...baseDerive, missingRequiredInputs: ["RateRef"] })
    ).toBe("BLOCK");
  });

  it("FR-009: returns PENDING_APPROVAL when approval required but status is Pending", () => {
    expect(
      deriveVerdict({
        ...baseDerive,
        approvalRequired: true,
        approvalStatus: "Pending"
      })
    ).toBe("PENDING_APPROVAL");
  });

  it("FR-009: returns PASS when approval required and Approved", () => {
    expect(
      deriveVerdict({
        ...baseDerive,
        approvalRequired: true,
        approvalStatus: "Approved"
      })
    ).toBe("PASS");
  });

  it("returns BLOCK when lowConfidenceHighRisk is true", () => {
    expect(
      deriveVerdict({ ...baseDerive, lowConfidenceHighRisk: true })
    ).toBe("BLOCK");
  });

  it("returns WARN when only warning findings present", () => {
    expect(
      deriveVerdict({ ...baseDerive, hasWarningFindings: true })
    ).toBe("WARN");
  });

  it("piiStatus Risk wins precedence over warning findings", () => {
    expect(
      deriveVerdict({
        ...baseDerive,
        piiStatus: "Risk",
        hasWarningFindings: true
      })
    ).toBe("BLOCK");
  });
});

describe("derivePiiStatus", () => {
  it("returns Masked when piiMasked=true and no raw markers", () => {
    expect(derivePiiStatus({ piiMasked: true, hasRawPiiMarkers: false })).toBe(
      "Masked"
    );
  });

  it("returns None when piiMasked=false and no raw markers", () => {
    expect(derivePiiStatus({ piiMasked: false, hasRawPiiMarkers: false })).toBe(
      "None"
    );
  });

  it("returns Risk when hasRawPiiMarkers is true (overrides piiMasked)", () => {
    expect(derivePiiStatus({ piiMasked: true, hasRawPiiMarkers: true })).toBe(
      "Risk"
    );
  });
});

describe("buildEvidenceCoverage", () => {
  it("returns PASS for each requiredDoc that is present in evidence", () => {
    const result = buildEvidenceCoverage({
      evidence: [
        {
          id: "e1",
          docId: "CONSOLIDATED-00",
          evidenceScore: {
            evidenceId: "e1",
            intentRelevance: 1,
            domainSpecificity: 1,
            directSupport: 1,
            authorityLevel: 1,
            operationalActionability: 1,
            recency: 1,
            finalScore: 1,
            supportState: "SUPPORTED"
          }
        },
        {
          id: "e2",
          docId: "RATE-REF",
          evidenceScore: {
            evidenceId: "e2",
            intentRelevance: 0.5,
            domainSpecificity: 0.5,
            directSupport: 0.5,
            authorityLevel: 0.5,
            operationalActionability: 0.5,
            recency: 0.5,
            finalScore: 0.5,
            supportState: "PARTIAL"
          }
        }
      ],
      requiredDocs: ["CONSOLIDATED-00", "RATE-REF"]
    });
    expect(result).toHaveLength(2);
    expect(result.every((row) => row.status === "PASS")).toBe(true);
    expect(result.every((row) => row.available === 1)).toBe(true);
    expect(result.find((row) => row.domain === "CONSOLIDATED-00")?.directSupportRatio).toBe(1);
  });

  it("marks a missing requiredDoc as BLOCK", () => {
    const result = buildEvidenceCoverage({
      evidence: [{ id: "e1", docId: "CONSOLIDATED-00" }],
      requiredDocs: ["CONSOLIDATED-00", "RATE-REF"]
    });
    const consolidated = result.find((r) => r.domain === "CONSOLIDATED-00");
    const rate = result.find((r) => r.domain === "RATE-REF");
    expect(consolidated?.status).toBe("PASS");
    expect(rate?.status).toBe("BLOCK");
    expect(rate?.available).toBe(0);
    expect(rate?.required).toBe(1);
  });

  it("marks all requiredDocs as BLOCK when evidence is empty", () => {
    const result = buildEvidenceCoverage({
      evidence: [],
      requiredDocs: ["A", "B", "C"]
    });
    expect(result).toHaveLength(3);
    expect(result.every((row) => row.status === "BLOCK")).toBe(true);
  });
});

describe("buildBlockedActions", () => {
  it("returns empty when PASS + Masked + NotRequired", () => {
    expect(
      buildBlockedActions({
        verdict: "PASS",
        piiStatus: "Masked",
        approvalStatus: "NotRequired",
        approvalRequired: false,
        baseBlockedActions: []
      })
    ).toEqual([]);
  });

  it("AC-005: includes Export and Publish when piiStatus is Risk", () => {
    const result = buildBlockedActions({
      verdict: "BLOCK",
      piiStatus: "Risk",
      approvalStatus: "NotRequired",
      approvalRequired: false,
      baseBlockedActions: []
    });
    expect(result).toContain("Export");
    expect(result).toContain("Publish");
    expect(result).toContain("External Send");
  });

  it("AC-006: includes Invoice approval and Publish Report when approval Pending", () => {
    const result = buildBlockedActions({
      verdict: "BLOCK",
      piiStatus: "Masked",
      approvalStatus: "Pending",
      approvalRequired: true,
      baseBlockedActions: []
    });
    expect(result).toContain("Invoice approval");
    expect(result).toContain("Publish Report");
  });

  it("deduplicates union of base + derived blocked actions", () => {
    const result = buildBlockedActions({
      verdict: "BLOCK",
      piiStatus: "Risk",
      approvalStatus: "NotRequired",
      approvalRequired: false,
      baseBlockedActions: ["Export", "Custom action"]
    });
    const exportCount = result.filter((a) => a === "Export").length;
    expect(exportCount).toBe(1);
    expect(result).toContain("Custom action");
  });
});

describe("evaluateActionGate", () => {
  it("FR-012: blocks write/send actions at DRY_RUN until approval and audit record", () => {
    const gate = evaluateActionGate({
      actionType: "REQUEST_EMAIL_SEND_APPROVAL",
      humanGateRequired: true,
      approvalStatus: "Pending"
    });

    expect(gate.allowedNow).toEqual(["DRY_RUN"]);
    expect(gate.blockedUntilApproved).toEqual(["APPROVAL", "WRITE", "AUDIT_RECORD"]);
    expect(gate.humanGateRequired).toBe(true);
    expect(gate.auditRecordRequired).toBe(true);
    expect(gate.writeBackMode).toBe("DRY_RUN");
    expect(gate.status).toBe("Pending Approval");
  });

  it("FR-012: approved actions expose WRITE and AUDIT_RECORD stages", () => {
    const gate = evaluateActionGate({
      actionType: "WRITE_BACK_TO_FOUNDRY",
      humanGateRequired: true,
      approvalStatus: "Approved"
    });

    expect(gate.allowedNow).toEqual(["DRY_RUN", "WRITE", "AUDIT_RECORD"]);
    expect(gate.blockedUntilApproved).toEqual([]);
    expect(gate.auditRecordRequired).toBe(true);
    expect(gate.writeBackMode).toBe("AUDIT_RECORD");
    expect(gate.status).toBe("Open");
  });
});

describe("deriveHumanGateState", () => {
  it("maps not-required approval to READ_ONLY", () => {
    expect(
      deriveHumanGateState({ approvalRequired: false, approvalStatus: "NotRequired" })
    ).toBe("READ_ONLY");
  });

  it("maps pending approval to APPROVAL_REQUESTED", () => {
    expect(
      deriveHumanGateState({ approvalRequired: true, approvalStatus: "Pending" })
    ).toBe("APPROVAL_REQUESTED");
  });

  it("maps rejected and expired approval to terminal guard states", () => {
    expect(
      deriveHumanGateState({ approvalRequired: true, approvalStatus: "Rejected" })
    ).toBe("DENIED");
    expect(
      deriveHumanGateState({ approvalRequired: true, approvalStatus: "Expired" })
    ).toBe("EXPIRED");
  });
});

describe("RULE_MATRIX and REASON_CODE_TO_RULE", () => {
  it("RULE_MATRIX contains all minimum rules from Spec", () => {
    expect(RULE_MATRIX["SCT-COST-001"]).toBeDefined();
    expect(RULE_MATRIX["SCT-DOC-002"]).toBeDefined();
    expect(RULE_MATRIX["SCT-PII-003"]).toBeDefined();
    expect(RULE_MATRIX["SCT-P2-004"]).toBeDefined();
    expect(RULE_MATRIX["SCT-APP-005"]).toBeDefined();
    expect(RULE_MATRIX["SCT-CONF-006"]).toBeDefined();
    expect(RULE_MATRIX["SCT-SCHEMA-007"]).toBeDefined();
  });

  it("REASON_CODE_TO_RULE maps known reasonCodes to existing rules", () => {
    for (const ruleId of Object.values(REASON_CODE_TO_RULE)) {
      expect(RULE_MATRIX[ruleId]).toBeDefined();
    }
  });

  it("Spec required ReasonCodes are mapped", () => {
    expect(REASON_CODE_TO_RULE["SCT_COST_EVIDENCE_REQUIRED"]).toBe("SCT-COST-001");
    expect(REASON_CODE_TO_RULE["SCT_CUSTOMS_EVIDENCE_REQUIRED"]).toBe("SCT-DOC-002");
    expect(REASON_CODE_TO_RULE["P2_LEAKAGE_RISK"]).toBe("SCT-P2-004");
    expect(REASON_CODE_TO_RULE["HUMAN_GATE_REQUIRED"]).toBe("SCT-APP-005");
  });
});

describe("toDecisionCardPayload — adapter", () => {
  it("AC-001: BLOCK input produces verdict=BLOCK, primaryReason ≤ 80 chars, unblockSummary set", () => {
    const answer = makeAnswer({
      verdict: "BLOCK",
      validation: [
        {
          ruleId: "A-COST-001",
          reasonCode: "SCT_COST_EVIDENCE_REQUIRED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "Cost",
          evidenceIds: [],
          message: "Cost evidence missing"
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.schemaVersion).toBe("sct.card.v2.1");
    expect(payload.intent).toBe("GENERAL_ANSWER");
    expect(payload.verdict).toBe("BLOCK");
    expect(payload.primaryReason.length).toBeLessThanOrEqual(80);
    expect(payload.primaryReason).not.toBe("No blocking finding");
    expect(payload.unblockSummary).not.toBe("");
  });

  it("AC-002: blockedBy entry has ruleId, ruleName, reason, requiredInputs, blockedActions", () => {
    const answer = makeAnswer({
      verdict: "BLOCK",
      validation: [
        {
          ruleId: "A-COST-001",
          reasonCode: "SCT_COST_EVIDENCE_REQUIRED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "Cost",
          evidenceIds: [],
          message: "Cost evidence missing"
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.blockedBy.length).toBeGreaterThan(0);
    const entry = payload.blockedBy[0];
    expect(entry.ruleId).toBe("SCT-COST-001");
    expect(entry.ruleName).toBeTruthy();
    expect(entry.reason).toBeTruthy();
    expect(entry.requiredInputs.length).toBeGreaterThan(0);
    expect(entry.blockedActions.length).toBeGreaterThan(0);
    expect(RULE_MATRIX[entry.ruleId].blockedActions.length).toBeGreaterThan(0);
    expect(entry.severity).toBe("P0");
  });

  it("AC-005: piiMasked=false + PII finding → blockedActions contains Export and Publish", () => {
    const answer = makeAnswer({
      verdict: "BLOCK",
      piiMasked: false,
      validation: [
        {
          ruleId: "A-PII-001",
          reasonCode: "PII_MASKED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "Pii",
          evidenceIds: [],
          message: "PII not masked"
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.piiStatus === "Risk" || payload.piiStatus === "None").toBe(true);
    expect(payload.blockedActions).toContain("Export");
    expect(payload.blockedActions).toContain("Publish");
  });

  it("AC-007: each action has ownerRole, actionType, and default status Open", () => {
    const answer = makeAnswer({
      actions: [
        {
          actionType: "REQUEST_INPUT",
          ownerRole: "Cost Owner",
          parameters: { input: "RateRef" },
          humanGateRequired: true,
          dueAt: null
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.actions.length).toBe(1);
    expect(payload.actions[0].ownerRole).toBe("Cost Owner");
    expect(payload.actions[0].actionType).toBe("REQUEST_INPUT");
    expect(payload.actions[0].requiredInput).toBe("RateRef");
    expect(payload.actions[0].dueBasis).toBe("Before approval-gated execution");
    expect(payload.actions[0].allowedNow).toEqual(["DRY_RUN"]);
    expect(payload.actions[0].blockedUntilApproved).toEqual(["APPROVAL", "WRITE", "AUDIT_RECORD"]);
    expect(payload.actions[0].humanGateRequired).toBe(true);
    expect(payload.actions[0].auditRecordRequired).toBe(true);
    expect(payload.actions[0].writeBackMode).toBe("DRY_RUN");
    expect(payload.actions[0].status).toBe("Pending Approval");
    expect(payload.humanGateState).toBe("APPROVAL_REQUESTED");
  });

  it("AC-008: trace contains generatedAt, sourceHash, rulePackVersion, approvalStatus, routeId", () => {
    const answer = makeAnswer();
    const payload = toDecisionCardPayload({
      answer,
      rulePackVersion: "2026.05",
      promptVersion: "prompt-v3"
    });
    expect(payload.trace.generatedAt).toBe("2026-05-17T12:00:00Z");
    expect(payload.trace.routeId).toBe("ROUTE-001");
    expect(payload.trace.rulePackVersion).toBe("2026.05");
    expect(payload.trace.rulePackIds).toEqual(["SYSTEM_QA_RULEPACK"]);
    expect(payload.trace.promptVersion).toBe("prompt-v3");
    expect(payload.trace.approvalStatus).toBe("NotRequired");
    expect(payload.trace.sourceHash).toBeTypeOf("string");
  });

  it("AC-011: verdict=PASS input but BLOCK validation finding → output verdict=BLOCK (fail-safe)", () => {
    const answer = makeAnswer({
      verdict: "PASS",
      validationStatus: "PASS",
      validation: [
        {
          ruleId: "A-DOC-001",
          reasonCode: "SCT_CUSTOMS_EVIDENCE_REQUIRED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "Doc",
          evidenceIds: [],
          message: "BOE evidence missing"
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.verdict).toBe("BLOCK");
  });

  it("maps P2 leakage findings to ZERO and SCT-P2-004", () => {
    const answer = makeAnswer({
      verdict: "ZERO",
      validationStatus: "BLOCK",
      validation: [
        {
          ruleId: "V-P2-PROMPT-001",
          reasonCode: "P2_LEAKAGE_RISK",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "P2NdaBoundary",
          evidenceIds: [],
          message: "P2 raw content exposure blocked"
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.verdict).toBe("ZERO");
    expect(payload.dataClass).toBe("P2");
    expect(payload.trace.sensitiveAccessed).toBe(true);
    expect(payload.allowedActions).toEqual(["Read redacted stop notice"]);
    expect(payload.blockedBy.some((entry) => entry.ruleId === "SCT-P2-004")).toBe(true);
    expect(payload.blockedActions).toEqual(expect.arrayContaining(["Export", "Publish", "External Share"]));
  });

  it("EC7: 7 missing inputs → unblockSummary shows first 5 + ' +N more'", () => {
    const answer = makeAnswer({
      verdict: "BLOCK",
      validation: [
        {
          ruleId: "A-1",
          reasonCode: "SCT_COST_EVIDENCE_REQUIRED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "x",
          evidenceIds: [],
          message: "cost"
        },
        {
          ruleId: "A-2",
          reasonCode: "SCT_CUSTOMS_EVIDENCE_REQUIRED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "x",
          evidenceIds: [],
          message: "doc"
        },
        {
          ruleId: "A-3",
          reasonCode: "PII_MASKED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "x",
          evidenceIds: [],
          message: "pii"
        },
        {
          ruleId: "A-4",
          reasonCode: "HUMAN_GATE_REQUIRED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "x",
          evidenceIds: [],
          message: "appr"
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.unblockSummary).toMatch(/\+\d+ more/);
  });

  it("EC12: 200-char rule message → primaryReason truncated to 80 chars with ellipsis", () => {
    const longMessage = "A".repeat(200);
    const answer = makeAnswer({
      verdict: "BLOCK",
      validation: [
        {
          ruleId: "A-1",
          reasonCode: "SCT_COST_EVIDENCE_REQUIRED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "x",
          evidenceIds: [],
          message: longMessage
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.primaryReason.length).toBeLessThanOrEqual(80);
    expect(payload.primaryReason).toMatch(/…$/);
  });

  it("NFR-003: payload JSON does NOT contain raw evidence snippet text", () => {
    const sensitiveSnippet = "SENSITIVE_RAW_P2_CONTENT_XYZ";
    const answer = makeAnswer({
      verdict: "BLOCK",
      evidence: [
        {
          id: "e1",
          docId: "CONSOLIDATED-00",
          title: "title",
          version: "v1",
          sectionPath: "path",
          snippet: sensitiveSnippet,
          docHash: "hash123",
          confidence: 0.9,
          sourceType: "ontology_corpus"
        }
      ],
      validation: [
        {
          ruleId: "A-COST",
          reasonCode: "SCT_COST_EVIDENCE_REQUIRED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "x",
          evidenceIds: ["e1"],
          message: "cost"
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    const json = JSON.stringify(payload);
    expect(json).not.toContain(sensitiveSnippet);
  });

  it("Determinism: same input produces identical output", () => {
    const answer = makeAnswer({
      verdict: "BLOCK",
      validation: [
        {
          ruleId: "A-COST",
          reasonCode: "SCT_COST_EVIDENCE_REQUIRED",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "x",
          evidenceIds: [],
          message: "cost evidence missing"
        }
      ]
    });
    const p1 = toDecisionCardPayload({ answer });
    const p2 = toDecisionCardPayload({ answer });
    expect(JSON.stringify(p1)).toBe(JSON.stringify(p2));
  });

  it("Unknown reasonCode falls back to SCT-SCHEMA-007", () => {
    const answer = makeAnswer({
      verdict: "BLOCK",
      validation: [
        {
          ruleId: "A-UNKNOWN",
          // @ts-expect-error testing fallback path with non-standard reason code
          reasonCode: "TOTALLY_UNKNOWN_CODE",
          severity: "BLOCK",
          status: "BLOCK",
          targetObject: "x",
          evidenceIds: [],
          message: "unknown finding"
        }
      ]
    });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.blockedBy[0].ruleId).toBe("SCT-SCHEMA-007");
  });

  it("cardId defaults to DC-<answerId> when not provided", () => {
    const answer = makeAnswer({ answerId: "ans-xyz" });
    const payload = toDecisionCardPayload({ answer });
    expect(payload.cardId).toBe("DC-ans-xyz");
  });

  it("dataClass defaults to P1 when not provided", () => {
    const answer = makeAnswer();
    const payload = toDecisionCardPayload({ answer });
    expect(payload.dataClass).toBe("P1");
  });
});
