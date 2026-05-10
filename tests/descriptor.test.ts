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
const serverSource = readFileSync(path.resolve("server", "src", "index.ts"), "utf8");

describe("Apps SDK/MCP descriptor contract parity", () => {
  it("keeps the six server tool names in sync with the ChatGPT app submission", () => {
    expect(Object.keys(HVDC_TOOL_DESCRIPTORS).sort()).toEqual(Object.keys(submission.tools).sort());
    expect(Object.keys(HVDC_TOOL_DESCRIPTORS)).toHaveLength(6);
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

  it("keeps ontology answering separate from the versioned Apps SDK render resource", () => {
    const askMeta = HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology._meta;
    const renderMeta = HVDC_TOOL_DESCRIPTORS.render_hvdc_answer_card._meta;
    const askMetaRecord = askMeta as Record<string, unknown>;
    const renderMetaRecord = renderMeta as Record<string, unknown>;

    expect(askMetaRecord["openai/outputTemplate"]).toBeUndefined();
    expect(askMetaRecord.ui).toBeUndefined();
    expect(renderMeta.ui.resourceUri).toBe("ui://hvdc/answer-card-v4.html");
    expect(renderMetaRecord["openai/outputTemplate"]).toBe("ui://hvdc/answer-card-v4.html");
    expect(renderMetaRecord["openai/widgetAccessible"]).toBe(true);
  });

  it("declares review-facing widget metadata and a narrow CSP", () => {
    for (const expected of [
      "openai/widgetDescription",
      "openai/widgetPrefersBorder",
      "openai/widgetDomain",
      "openai/widgetCSP",
      "connect_domains: []",
      "resource_domains: []",
      "frame_domains: []",
      "redirect_domains: []"
    ]) {
      expect(serverSource).toContain(expected);
    }
  });
});
