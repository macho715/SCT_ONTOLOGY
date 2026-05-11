import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HVDC_CLAUDE_TOOL_NAMES } from "../server/src/claude-server.js";
import { parseGroundedAnswer, renderAnswerMarkdown } from "../server/src/claude-render.js";
import type { GroundedAnswer } from "../server/src/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const submission = JSON.parse(readFileSync(path.join(ROOT, "claude-app-submission.json"), "utf8"));

// --- Descriptor parity ---

describe("claude-app-submission.json <-> claude-server.ts tool parity", () => {
  const submissionTools = Object.keys(submission.tools) as string[];
  const serverTools = [...HVDC_CLAUDE_TOOL_NAMES] as string[];

  it("submission and server expose the same number of tools", () => {
    expect(submissionTools.length).toBe(serverTools.length);
  });

  it("every submission tool exists in the server", () => {
    for (const name of submissionTools) {
      expect(serverTools).toContain(name);
    }
  });

  it("every server tool exists in the submission", () => {
    for (const name of serverTools) {
      expect(submissionTools).toContain(name);
    }
  });

  it("submission has required app_info fields", () => {
    expect(submission.app_info.display_name).toBeTruthy();
    expect(submission.app_info.category).toBe("BUSINESS");
  });

  it("submission has claude_desktop_config snippet", () => {
    expect(submission.claude_desktop_config?.mcpServers).toBeTruthy();
  });
});

// --- Fixtures ---

const minimalAnswer: GroundedAnswer = {
  answerId: "test-001",
  verdict: "PASS",
  dataStatus: "OK",
  businessResultVisible: true,
  fallbackUsed: false,
  summary: "Test summary",
  businessImpact: "Low impact",
  details: ["Detail A"],
  evidenceIds: ["e1"],
  validationStatus: "PASS",
  route: {
    routeId: "r1",
    domains: ["document"],
    requiredDocs: ["CONSOLIDATED-00"],
    confidence: 0.9,
    routingReason: "Test route"
  },
  resolvedEntities: [],
  evidence: [
    {
      id: "e1",
      docId: "DOC-01",
      title: "Test Doc",
      version: "v1",
      sectionPath: "§1.1",
      snippet: "Relevant text here",
      docHash: "abc123",
      confidence: 0.85,
      sourceType: "ontology_corpus"
    }
  ],
  validation: [
    {
      ruleId: "R001",
      reasonCode: "MISSING_REQUIRED_DOC",
      severity: "INFO",
      status: "PASS",
      targetObject: "CONSOLIDATED-00",
      evidenceIds: ["e1"],
      message: "Master spine included"
    }
  ],
  actions: [
    {
      actionType: "REVIEW",
      ownerRole: "ops_lead",
      parameters: {},
      humanGateRequired: false,
      dueAt: null
    }
  ],
  graphPath: null,
  piiMasked: false,
  generatedAt: "2026-05-11T00:00:00Z"
};

const chatGptFormatInput = {
  structuredContent: {
    ...minimalAnswer,
    ui: {
      dataStatus: "OK",
      uiRenderStatus: "READY",
      businessResultVisible: true,
      fallbackUsed: false,
      cardEnabled: true,
      templateUrl: "ui://hvdc/answer-card-v6.html",
      templateVersion: "answer-card-v6",
      schemaVersion: "1.0.0",
      doNotChange: ["verdict", "validationStatus", "evidenceIds", "actions"]
    }
  },
  _meta: {
    "openai/outputTemplate": "ui://hvdc/answer-card-v6.html",
    uiTemplate: "ui://hvdc/answer-card-v6.html",
    piiMasked: false
  }
};

const claudeFormatInput = { ...minimalAnswer };

// --- parseGroundedAnswer ---

describe("parseGroundedAnswer — ChatGPT format", () => {
  it("extracts GroundedAnswer from structuredContent", () => {
    const result = parseGroundedAnswer(chatGptFormatInput);
    expect(result.verdict).toBe("PASS");
    expect(result.answerId).toBe("test-001");
  });

  it("strips the ui field from ChatGPT format", () => {
    const result = parseGroundedAnswer(chatGptFormatInput) as GroundedAnswer & { ui?: unknown };
    expect(result.ui).toBeUndefined();
  });

  it("preserves evidence array", () => {
    const result = parseGroundedAnswer(chatGptFormatInput);
    expect(result.evidence).toHaveLength(1);
    expect(result.evidence[0].docId).toBe("DOC-01");
  });
});

describe("parseGroundedAnswer — Claude format", () => {
  it("accepts direct GroundedAnswer object", () => {
    const result = parseGroundedAnswer(claudeFormatInput);
    expect(result.verdict).toBe("PASS");
    expect(result.answerId).toBe("test-001");
  });

  it("strips ui field if present in Claude format", () => {
    const withUi = { ...claudeFormatInput, ui: { templateUrl: "ui://hvdc/test.html" } };
    const result = parseGroundedAnswer(withUi) as GroundedAnswer & { ui?: unknown };
    expect(result.ui).toBeUndefined();
  });
});

describe("parseGroundedAnswer — error cases", () => {
  it("throws on null input", () => {
    expect(() => parseGroundedAnswer(null)).toThrow();
  });

  it("throws on primitive input", () => {
    expect(() => parseGroundedAnswer("bad")).toThrow();
  });
});

// --- renderAnswerMarkdown ---

describe("renderAnswerMarkdown — required fields", () => {
  let md: string;

  beforeAll(() => {
    md = renderAnswerMarkdown(minimalAnswer);
  });

  it("contains verdict in heading", () => {
    expect(md).toContain("PASS");
  });

  it("contains required route document", () => {
    expect(md).toContain("CONSOLIDATED-00");
  });

  it("contains summary text", () => {
    expect(md).toContain("Test summary");
  });

  it("contains business impact", () => {
    expect(md).toContain("Low impact");
  });

  it("contains evidence section with count", () => {
    expect(md).toMatch(/Evidence \(1건\)/);
  });

  it("contains evidence doc id", () => {
    expect(md).toContain("DOC-01");
  });

  it("contains validation section", () => {
    expect(md).toContain("Validation");
    expect(md).toContain("R001");
  });

  it("contains actions section", () => {
    expect(md).toContain("Next Actions");
    expect(md).toContain("REVIEW");
  });
});

describe("renderAnswerMarkdown — verdict badges", () => {
  const verdicts = ["PASS", "WARN", "BLOCK", "INFO", "NO_EVIDENCE"] as const;

  for (const verdict of verdicts) {
    it(`renders badge for ${verdict}`, () => {
      const answer = { ...minimalAnswer, verdict };
      const md = renderAnswerMarkdown(answer);
      expect(md).toContain(verdict);
    });
  }
});

describe("renderAnswerMarkdown — PII masking notice", () => {
  it("shows PII notice when piiMasked=true", () => {
    const answer = { ...minimalAnswer, piiMasked: true };
    const md = renderAnswerMarkdown(answer);
    expect(md).toContain("PII");
  });

  it("no PII notice when piiMasked=false", () => {
    const md = renderAnswerMarkdown(minimalAnswer);
    expect(md).not.toContain("PII fields have been masked");
  });
});

describe("renderAnswerMarkdown — human gate", () => {
  it("flags human-gate-required action", () => {
    const answer = {
      ...minimalAnswer,
      actions: [{ ...minimalAnswer.actions[0], humanGateRequired: true }]
    };
    const md = renderAnswerMarkdown(answer);
    expect(md).toContain("Human gate required");
  });
});

// vitest needs beforeAll — import it
import { beforeAll } from "vitest";
