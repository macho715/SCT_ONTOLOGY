import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

const requiredFiles = [
  "core/mission-statement.md",
  "core/mcp-default-context-policy.md",
  "schemas/sct-answer-contract.schema.json",
  "rules/sct-evidence-matrix.md",
  "rules/sct-amber-zero-rulebook.md",
  "evals/sct-golden-qa.csv"
];

const requiredDomains = ["Customs", "Cost", "DEM/DET", "ETA", "Warehouse", "OOG/Safety", "Claim"];

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

describe("sct_ontology operating contract", () => {
  it("keeps all approved P1 operating files present", () => {
    for (const file of requiredFiles) {
      expect(existsSync(path.join(root, file)), `${file} should exist`).toBe(true);
    }
  });

  it("defines the mission and default MCP context policy", () => {
    const mission = readRepoFile("core/mission-statement.md");
    const policy = readRepoFile("core/mcp-default-context-policy.md");

    expect(mission).toContain("reduce hallucination");
    expect(mission).toContain("MR.CHA");
    expect(mission).toContain("team-standard LLM operating layer");
    expect(policy).toContain("HVDC logistics operating context");
    expect(policy).toContain("resolveAnyKey");
    expect(policy).toContain("AMBER/ZERO gate");
  });

  it("keeps the answer contract schema parseable with required gate and audit fields", () => {
    const schema = JSON.parse(readRepoFile("schemas/sct-answer-contract.schema.json")) as {
      required: string[];
      properties: Record<string, unknown>;
    };

    for (const field of ["verdict", "evidence", "evidenceIds", "validationStatus", "validation", "actions", "decisionCard", "humanGateRequired", "audit"]) {
      expect(schema.required).toContain(field);
      expect(schema.properties[field], `${field} schema`).toBeDefined();
    }

    const decisionCard = schema.properties.decisionCard as {
      required: string[];
      properties: Record<string, unknown>;
    };
    for (const field of ["schemaVersion", "intent", "blockedBy", "allowedNow", "blockedUntilApproved", "humanGateState", "trace"]) {
      expect(decisionCard.required).toContain(field);
      expect(decisionCard.properties[field], `decisionCard.${field} schema`).toBeDefined();
    }

    const evidence = schema.properties.evidence as {
      items: { required: string[]; properties: Record<string, unknown> };
    };
    expect(evidence.items.required).toContain("evidenceScore");
    expect(evidence.items.properties.evidenceScore).toBeDefined();

    const evidenceCoverage = (decisionCard.properties.evidenceCoverage as {
      items: { required: string[]; properties: Record<string, unknown> };
    });
    expect(evidenceCoverage.items.required).toContain("directSupportRatio");
    expect(evidenceCoverage.items.properties.directSupportRatio).toBeDefined();

    const actionItems = decisionCard.properties.actions as {
      items: { required: string[]; properties: Record<string, unknown> };
    };
    for (const field of ["allowedNow", "blockedUntilApproved", "humanGateRequired", "auditRecordRequired", "writeBackMode", "dueBasis"]) {
      expect(actionItems.items.required).toContain(field);
      expect(actionItems.items.properties[field], `decisionCard.actions[].${field} schema`).toBeDefined();
    }

    const resolvedEntities = schema.properties.resolvedEntities as {
      items: { properties: Record<string, { enum?: string[] }> };
    };
    expect(resolvedEntities.items.properties.entityType.enum).toContain("SystemComponent");

    const graphPath = schema.properties.graphPath as {
      properties: Record<string, unknown>;
    };
    for (const field of ["startNodes", "riskEdges", "operationalObjects", "isMetaReview"]) {
      expect(graphPath.properties[field], `graphPath.${field} schema`).toBeDefined();
    }
  });

  it("covers governance v2 system QA intents and verdict vocabulary", () => {
    const schema = JSON.parse(readRepoFile("schemas/sct-answer-contract.schema.json")) as {
      properties: Record<string, unknown>;
    };
    const decisionCard = schema.properties.decisionCard as {
      properties: Record<string, { enum?: string[] }>;
    };
    const rootVerdict = schema.properties.verdict as { enum: string[] };
    const cardVerdict = decisionCard.properties.verdict as { enum: string[] };
    const cardIntent = decisionCard.properties.intent as { enum: string[] };

    for (const intent of [
      "SYSTEM_DIAGNOSTIC",
      "ONTOLOGY_PATCH_REVIEW",
      "CARD_RENDERING_AUDIT",
      "RULEPACK_GAP_ANALYSIS",
      "ROUTER_QA",
      "EVIDENCE_QA",
      "SCHEMA_BOUNDARY_REVIEW",
      "VALIDATION_POLICY_REVIEW"
    ]) {
      expect(cardIntent.enum).toContain(intent);
    }

    for (const verdict of [
      "DIAGNOSTIC",
      "PASS",
      "PASS_WITH_FINDINGS",
      "DRAFT_READY",
      "AMBER",
      "NEEDS_INPUT",
      "PENDING_APPROVAL",
      "DRY_RUN_ONLY",
      "BLOCK",
      "ZERO"
    ]) {
      expect(rootVerdict.enum).toContain(verdict);
      expect(cardVerdict.enum).toContain(verdict);
    }
  });

  it("covers every required risk domain in the evidence matrix", () => {
    const matrix = readRepoFile("rules/sct-evidence-matrix.md");

    for (const domain of requiredDomains) {
      expect(matrix, `${domain} should be covered`).toContain(domain);
    }

    expect(matrix).toContain("ZERO");
    expect(matrix).toContain("AMBER");
    expect(matrix).toContain("Rule output must not create fake corpus evidence IDs");
  });

  it("defines AMBER and ZERO gate behavior for high-risk decisions", () => {
    const rulebook = readRepoFile("rules/sct-amber-zero-rulebook.md");

    expect(rulebook).toContain("AMBER means");
    expect(rulebook).toContain("ZERO means");
    expect(rulebook).toContain("AGI/DAS M130 close");
    expect(rulebook).toContain("M115/M116/M117");
    expect(rulebook).toContain("production system without human approval");
    expect(rulebook).toContain("closeAllowed");
  });

  it("keeps Golden Q&A rows structured for verdict and high-risk gate regression", () => {
    const rows = parseCsv(readRepoFile("evals/sct-golden-qa.csv"));

    expect(rows.length).toBeGreaterThanOrEqual(7);

    for (const row of rows) {
      expect(row.id).toMatch(/^SCT-GQA-\d{3}$/);
      expect(row.question).toBeTruthy();
      expect(["AMBER", "ZERO"]).toContain(row.expectedVerdict);
      expect(requiredDomains).toContain(row.riskDomain);
      expect(row.requiredEvidence).toBeTruthy();
      expect(["true", "false"]).toContain(row.humanGateRequired);
    }

    expect(rows.filter((row) => row.expectedVerdict === "ZERO").length).toBeGreaterThanOrEqual(4);
    expect(rows.some((row) => row.requiredEvidence.includes("M115/M116/M117"))).toBe(true);
  });
});
