import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HVDC_TOOL_DESCRIPTORS } from "../server/src/index.js";

type SubmissionTool = {
  annotations: {
    readOnlyHint: boolean;
    openWorldHint: boolean;
    destructiveHint: boolean;
  };
};

type Submission = {
  tools: Record<string, SubmissionTool>;
};

const submission = JSON.parse(
  readFileSync(path.resolve("chatgpt-app-submission.json"), "utf8")
) as Submission;

describe("Apps SDK/MCP descriptor contract parity", () => {
  it("keeps the five server tool names in sync with the ChatGPT app submission", () => {
    expect(Object.keys(HVDC_TOOL_DESCRIPTORS).sort()).toEqual(Object.keys(submission.tools).sort());
    expect(Object.keys(HVDC_TOOL_DESCRIPTORS)).toHaveLength(5);
  });

  it("defines schema, metadata, and annotations for every server tool descriptor", () => {
    for (const [toolName, descriptor] of Object.entries(HVDC_TOOL_DESCRIPTORS)) {
      expect(descriptor.inputSchema, `${toolName} inputSchema`).toBeDefined();
      expect(descriptor.outputSchema, `${toolName} outputSchema`).toBeDefined();
      expect(descriptor._meta, `${toolName} _meta`).toBeDefined();
      expect(descriptor.annotations, `${toolName} annotations`).toBeDefined();
      expect(descriptor.annotations.openWorldHint, `${toolName} openWorldHint`).toBe(false);
      expect(descriptor.annotations.destructiveHint, `${toolName} destructiveHint`).toBe(false);
    }
  });

  it("matches submission annotations and read-only hints exactly", () => {
    for (const [toolName, descriptor] of Object.entries(HVDC_TOOL_DESCRIPTORS)) {
      expect(descriptor.annotations).toEqual(submission.tools[toolName].annotations);
    }

    expect(HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology.annotations.readOnlyHint).toBe(false);

    for (const [toolName, descriptor] of Object.entries(HVDC_TOOL_DESCRIPTORS)) {
      if (toolName !== "ask_hvdc_ontology") {
        expect(descriptor.annotations.readOnlyHint, `${toolName} readOnlyHint`).toBe(true);
      }
    }
  });
});
