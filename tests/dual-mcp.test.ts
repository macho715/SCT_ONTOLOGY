import { describe, expect, it } from "vitest";
import { calcCostGuard } from "../server/src/cost-guard.js";
import { checkDocGuardian } from "../server/src/doc-guardian.js";
import { checkMosbGate } from "../server/src/mosb-gate.js";
import { routeTeamAction } from "../server/src/team-action-router.js";

// ─── COST-GUARD ─────────────────────────────────────────────────────────────

describe("COST-GUARD engine", () => {
  it("returns PASS band for delta within 2%", () => {
    const result = calcCostGuard("INV-001", [
      { lineNo: "1", qty: 10, rate: 100, draftAmount: 1000, standardAmount: 1010, evidenceIds: ["EVD-1"] }
    ]);
    expect(result.overallBand).toBe("PASS");
    expect(result.overallVerdict).toBe("PASS");
    expect(result.humanGateRequired).toBe(false);
  });

  it("returns WARN band for delta 2.01–5%", () => {
    // qty×rate = 10×103 = 1030 = draftAmount → no rateMismatch; delta vs standard = 3% → WARN
    const result = calcCostGuard("INV-002", [
      { lineNo: "1", qty: 10, rate: 103, draftAmount: 1030, standardAmount: 1000, evidenceIds: ["EVD-2"] }
    ]);
    expect(result.overallBand).toBe("WARN");
    expect(result.overallVerdict).toBe("PASS");
  });

  it("returns CRITICAL and BLOCK_FOR_REVIEW for HIGH delta > 10%", () => {
    const result = calcCostGuard("INV-003", [
      { lineNo: "1", qty: 10, rate: 100, draftAmount: 1200, standardAmount: 1000, evidenceIds: ["EVD-3"] }
    ]);
    expect(result.overallBand).toBe("CRITICAL");
    expect(result.overallVerdict).toBe("BLOCK_FOR_REVIEW");
    expect(result.humanGateRequired).toBe(true);
  });

  it("triggers human gate when invoice total > 100,000 AED", () => {
    const result = calcCostGuard("INV-004", [
      { lineNo: "1", qty: 1, rate: 120000, draftAmount: 120000, standardAmount: 120000, evidenceIds: ["EVD-4"] }
    ]);
    expect(result.humanGateRequired).toBe(true);
    expect(result.blockReasons.some((r) => r.includes("V-COST-GATE"))).toBe(true);
  });

  it("flags V-COST-001 when qty×rate does not equal draftAmount", () => {
    const result = calcCostGuard("INV-005", [
      { lineNo: "1", qty: 5, rate: 100, draftAmount: 600, standardAmount: 500, evidenceIds: ["EVD-5"] }
    ]);
    expect(result.lines[0].rateMismatch).toBe(true);
    expect(result.lines[0].ruleViolations.some((v) => v.includes("V-COST-001"))).toBe(true);
    expect(result.lines[0].band).toBe("CRITICAL");
  });

  it("flags V-COST-003 for missing evidence", () => {
    const result = calcCostGuard("INV-006", [
      { lineNo: "1", qty: 2, rate: 50, draftAmount: 100, standardAmount: 100 }
    ]);
    expect(result.lines[0].missingEvidence).toBe(true);
    expect(result.lines[0].ruleViolations.some((v) => v.includes("V-COST-003"))).toBe(true);
  });

  it("invoice total delta > 2% adds V-COST-002 block reason", () => {
    const result = calcCostGuard("INV-007", [
      { lineNo: "1", qty: 10, rate: 100, draftAmount: 1040, standardAmount: 1000, evidenceIds: ["EVD-7"] },
      { lineNo: "2", qty: 5, rate: 100, draftAmount: 520, standardAmount: 500, evidenceIds: ["EVD-7b"] }
    ]);
    expect(result.blockReasons.some((r) => r.includes("V-COST-002"))).toBe(true);
  });
});

// ─── MOSB GATE ───────────────────────────────────────────────────────────────

describe("MOSB Route Gate (V-AGIDAS-001)", () => {
  it("PASS when destination is not AGI/DAS", () => {
    const result = checkMosbGate("SU-001", "RUW", "DIRECT", [
      { code: "M130", actualDt: "2025-01-10T00:00:00Z" }
    ]);
    expect(result.status).toBe("PASS");
    expect(result.appliedRule).toBeNull();
    expect(result.humanGateRequired).toBe(false);
  });

  it("BLOCK when AGI destination + M130 closed + M115 missing (V-AGIDAS-001)", () => {
    const result = checkMosbGate("SU-002", "AGI", "MOSB_DIRECT", [
      { code: "M130", actualDt: "2025-01-10T00:00:00Z" }
    ]);
    expect(result.status).toBe("BLOCK");
    expect(result.appliedRule).toBe("V-AGIDAS-001");
    expect(result.missingMilestones).toContain("M115");
    expect(result.humanGateRequired).toBe(true);
  });

  it("PASS when all MOSB chain milestones present for AGI", () => {
    const result = checkMosbGate("SU-003", "AGI", "WH_MOSB", [
      { code: "M115", actualDt: "2025-01-05T00:00:00Z" },
      { code: "M116", actualDt: "2025-01-07T00:00:00Z" },
      { code: "M117", actualDt: "2025-01-08T00:00:00Z" },
      { code: "M130", actualDt: "2025-01-10T00:00:00Z" }
    ]);
    expect(result.status).toBe("PASS");
    expect(result.humanGateRequired).toBe(false);
  });

  it("WARN when M116/M117 missing without exception (V-AGIDAS-002)", () => {
    const result = checkMosbGate("SU-004", "DAS", "MOSB_DIRECT", [
      { code: "M115", actualDt: "2025-01-05T00:00:00Z" }
    ]);
    expect(result.status).toBe("WARN");
    expect(result.appliedRule).toBe("V-AGIDAS-002");
    expect(result.missingMilestones).toContain("M116");
    expect(result.missingMilestones).toContain("M117");
  });

  it("PASS when M116/M117 have approved exception refs", () => {
    const result = checkMosbGate("SU-005", "AGI", "MOSB_DIRECT", [
      { code: "M115", actualDt: "2025-01-05T00:00:00Z" },
      { code: "M116", approvedExceptionRef: "EXC-2025-001" },
      { code: "M117", approvedExceptionRef: "EXC-2025-002" }
    ]);
    expect(result.status).toBe("PASS");
  });

  it("DAS destination triggers the same BLOCK rule as AGI", () => {
    const result = checkMosbGate("SU-006", "DAS", "MOSB_DIRECT", [
      { code: "M130", actualDt: "2025-01-10T00:00:00Z" }
    ]);
    expect(result.status).toBe("BLOCK");
    expect(result.appliedRule).toBe("V-AGIDAS-001");
  });

  it("BLOCK when D1-style destination and routing strings imply AGI MOSB delivery", () => {
    const result = checkMosbGate("SU-007", "AGI|MIR", "WH_MOSB_SITE", [
      { code: "M130_SITE_RECEIVED", actualDt: "2025-01-10T00:00:00Z" }
    ]);
    expect(result.status).toBe("BLOCK");
    expect(result.appliedRule).toBe("V-AGIDAS-001");
    expect(result.missingMilestones).toContain("M115");
  });
});

// ─── DOC GUARDIAN ────────────────────────────────────────────────────────────

describe("Document Guardian cross-doc consistency", () => {
  it("PASS for consistent qty across CI and BL", () => {
    const result = checkDocGuardian([
      { docId: "CI-001", docType: "CI", qty: 100 },
      { docId: "BL-001", docType: "BL", qty: 100 }
    ]);
    expect(result.verificationStatus).toBe("PASS");
    expect(result.numericIntegrityPct).toBe(100);
    expect(result.crossDocIssues).toHaveLength(0);
  });

  it("BLOCK when qty diverges between documents", () => {
    const result = checkDocGuardian([
      { docId: "CI-002", docType: "CI", qty: 100 },
      { docId: "BL-002", docType: "BL", qty: 90 }
    ]);
    expect(result.verificationStatus).toBe("BLOCK");
    expect(result.humanGateRequired).toBe(true);
    expect(result.crossDocIssues.some((i) => i.field === "qty" && i.severity === "BLOCK")).toBe(true);
  });

  it("WARN for weight mismatch between documents", () => {
    const result = checkDocGuardian([
      { docId: "PL-001", docType: "PL", weight: 500.5 },
      { docId: "BL-003", docType: "BL", weight: 499.0 }
    ]);
    expect(result.verificationStatus).toBe("WARN");
    expect(result.crossDocIssues.some((i) => i.field === "weight" && i.severity === "WARN")).toBe(true);
  });

  it("BLOCK for container number mismatch", () => {
    const result = checkDocGuardian([
      { docId: "BL-004", docType: "BL", containerNo: "TCKU1234567" },
      { docId: "DO-001", docType: "DO", containerNo: "MSCU9876543" }
    ]);
    expect(result.verificationStatus).toBe("BLOCK");
    expect(result.crossDocIssues.some((i) => i.field === "containerNo")).toBe(true);
  });

  it("reports the actual mismatching container document and value when later documents diverge", () => {
    const result = checkDocGuardian([
      { docId: "EVD-CI-001", docType: "CI", qty: 10, weight: 12500, containerNo: "TCLU1234567", packageCount: 10 },
      { docId: "EVD-PL-001", docType: "PL", qty: 10, weight: 12500, containerNo: "TCLU1234567", packageCount: 10 },
      { docId: "EVD-DO-001", docType: "DO", qty: 10, weight: 12500, containerNo: "TCLU1234567", packageCount: 10 },
      { docId: "EVD-BL-001", docType: "BL", qty: 10, weight: 12500, containerNo: "TGHU7654321", packageCount: 10 }
    ]);

    const issue = result.crossDocIssues.find((i) => i.field === "containerNo");

    expect(result.verificationStatus).toBe("BLOCK");
    expect(result.numericIntegrityPct).toBe(92.86);
    expect(issue).toMatchObject({
      sourceDoc: "EVD-CI-001",
      targetDoc: "EVD-BL-001",
      sourceValue: "TCLU1234567",
      targetValue: "TGHU7654321",
      delta: "MISMATCH",
      severity: "BLOCK"
    });
  });

  it("WARN when CI and PL packageCount differ", () => {
    const result = checkDocGuardian([
      { docId: "CI-003", docType: "CI", packageCount: 24 },
      { docId: "PL-002", docType: "PL", packageCount: 25 }
    ]);
    expect(result.verificationStatus).toBe("WARN");
    expect(result.crossDocIssues.some((i) => i.field === "packageCount")).toBe(true);
  });

  it("numericIntegrityPct is 100 when all checks pass", () => {
    const result = checkDocGuardian([
      { docId: "CI-004", docType: "CI", qty: 50, weight: 200, containerNo: "TCKU0000001", packageCount: 10 },
      { docId: "PL-003", docType: "PL", qty: 50, weight: 200, containerNo: "TCKU0000001", packageCount: 10 }
    ]);
    expect(result.numericIntegrityPct).toBe(100);
    expect(result.verificationStatus).toBe("PASS");
  });

  it("generates a unique auditRecordId on each call", () => {
    const r1 = checkDocGuardian([{ docId: "X-001", docType: "CI", qty: 1 }]);
    const r2 = checkDocGuardian([{ docId: "X-002", docType: "CI", qty: 1 }]);
    expect(r1.auditRecordId).not.toBe(r2.auditRecordId);
  });
});

// ─── TEAM ACTION ROUTER ──────────────────────────────────────────────────────

describe("Team Action Router", () => {
  it("routes M85 customs to Inbound Customs Documentation role with 24h due", () => {
    const result = routeTeamAction("SU-100", "M85", "customs");
    expect(result.proposals).toHaveLength(1);
    const p = result.proposals[0];
    expect(p.ownerRole).toBe("Inbound Customs Documentation");
    expect(p.actionType).toBe("REQUEST_CUSTOMS_DOC_FOLLOWUP");
    expect(p.humanGateRequired).toBe(true);
    expect(p.dueAt).not.toBeNull();
    expect(p.piiMasked).toBe(true);
    expect(p.requiredDocs).toContain("BOE");
  });

  it("routes M100 port to Port/Field Gate Coordinator", () => {
    const result = routeTeamAction("SU-101", "M100", "port");
    const p = result.proposals[0];
    expect(p.ownerRole).toBe("Port/Field Gate Coordinator");
    expect(p.actionType).toBe("CONFIRM_GATE_RELEASE");
    expect(p.humanGateRequired).toBe(false);
  });

  it("routes M115 marine to Marine Supervisor with 12h due", () => {
    const result = routeTeamAction("SU-102", "M115", "marine");
    const p = result.proposals[0];
    expect(p.ownerRole).toBe("Marine Supervisor");
    expect(p.actionType).toBe("REQUEST_MOSB_M115_EVIDENCE");
    expect(p.humanGateRequired).toBe(true);
    expect(p.dueAt).not.toBeNull();
  });

  it("routes M116 to REQUEST_LCT_LOAD_MANIFEST", () => {
    const result = routeTeamAction("SU-103", "M116", "marine");
    expect(result.proposals[0].actionType).toBe("REQUEST_LCT_LOAD_MANIFEST");
  });

  it("routes M117 to REQUEST_SAIL_AWAY_APPROVAL", () => {
    const result = routeTeamAction("SU-104", "M117", "marine");
    expect(result.proposals[0].actionType).toBe("REQUEST_SAIL_AWAY_APPROVAL");
  });

  it("routes M130 site to Site Receiving Coordinator", () => {
    const result = routeTeamAction("SU-105", "M130", "site");
    const p = result.proposals[0];
    expect(p.ownerRole).toBe("Site Receiving Coordinator");
    expect(p.actionType).toBe("CONFIRM_SITE_ARRIVAL_POD");
    expect(p.requiredDocs).toContain("MRR");
  });

  it("routes M160 cost to Material/Cost Review with 48h due and human gate", () => {
    const result = routeTeamAction("SU-106", "M160", "cost");
    const p = result.proposals[0];
    expect(p.ownerRole).toBe("Material/Cost Review");
    expect(p.actionType).toBe("REVIEW_INVOICE_COST_DISCREPANCY");
    expect(p.humanGateRequired).toBe(true);
    expect(p.dueAt).not.toBeNull();
    expect(p.requiredDocs).toContain("invoice");
  });

  it("does not add exception proposal when exception domain has no matrix entry covering the milestone", () => {
    // M130 is a site milestone; "invoice" maps to cost domain (M160 only) which doesn't cover M130
    const result = routeTeamAction("SU-107", "M130", "site", ["invoice amount mismatch"]);
    expect(result.proposals).toHaveLength(1);
    expect(result.proposals[0].piiMasked).toBe(true);
  });

  it("always sets piiMasked=true on all proposals", () => {
    const result = routeTeamAction("SU-108", "M110", "warehouse", ["doc missing"]);
    for (const p of result.proposals) {
      expect(p.piiMasked).toBe(true);
    }
  });

  it("returns empty proposals with message for unknown milestone/domain", () => {
    const result = routeTeamAction("SU-109", "M999", "unknown");
    expect(result.proposals).toHaveLength(0);
    expect(result.message).toContain("No action matrix entry");
  });
});
