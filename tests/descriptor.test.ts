import { readFileSync } from "node:fs";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import { createHvdcServer, HVDC_TOOL_DESCRIPTORS } from "../server/src/index.js";

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
const rootAgentGuidance = readFileSync(path.resolve("AGENTS.md"), "utf8");
const systemArchitecture = readFileSync(path.resolve("SYSTEM_ARCHITECTURE.md"), "utf8");
const codexAgentGuidance = readFileSync(path.resolve("docs", "codex", "AGENTS.patched.md"), "utf8");

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
    expect(HVDC_TOOL_DESCRIPTORS.render_hvdc_answer_card.annotations.readOnlyHint).toBe(true);

    for (const [toolName, descriptor] of Object.entries(HVDC_TOOL_DESCRIPTORS)) {
      if (toolName !== "ask_hvdc_ontology") {
        expect(descriptor.annotations.readOnlyHint, `${toolName} readOnlyHint`).toBe(true);
      }
    }
  });

  it("keeps ask data-only while linking only the render tool to the widget resource", () => {
    const askMeta = HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology._meta;
    const askMetaRecord = askMeta as Record<string, unknown>;
    const renderMeta = HVDC_TOOL_DESCRIPTORS.render_hvdc_answer_card._meta;
    const renderMetaRecord = renderMeta as Record<string, unknown>;

    expect((askMetaRecord.ui as unknown) ?? undefined).toBeUndefined();
    expect(askMetaRecord["openai/outputTemplate"]).toBeUndefined();
    expect(askMetaRecord["openai/widgetAccessible"]).toBeUndefined();
    expect(renderMeta.ui.resourceUri).toBe("ui://hvdc/answer-card-v6.html");
    expect(renderMetaRecord["openai/outputTemplate"]).toBe("ui://hvdc/answer-card-v6.html");
    expect(renderMetaRecord["openai/widgetAccessible"]).toBe(true);
    expect((HVDC_TOOL_DESCRIPTORS.search_ontology_corpus._meta as Record<string, unknown>).ui).toBeUndefined();
    expect(Object.keys(HVDC_TOOL_DESCRIPTORS)).toContain("render_hvdc_answer_card");
    expect(serverSource).toContain('const legacyWidgetUri = "ui://hvdc/answer-card-v5.html"');
    expect(serverSource).toContain('const renderToolWidgetAliasUri = "ui://hvdc/render_hvdc_answer_card.html"');
    expect(serverSource).toContain('"hvdc-answer-widget-legacy"');
    expect(serverSource).toContain('"render_hvdc_answer_card"');
  });

  it("keeps active Codex guidance aligned with the versioned widget resource", () => {
    for (const guidance of [rootAgentGuidance, systemArchitecture, codexAgentGuidance]) {
      expect(guidance).toContain("ui://hvdc/answer-card-v6.html");
      expect(guidance).not.toContain("ui://hvdc/answer-card-v4.html");
      expect(guidance).not.toContain("ui://hvdc/answer-card-v5.html");
    }
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

  it("serves the canonical v6 widget, legacy v5 alias, and render tool alias with identical HTML", async () => {
    const mcpServer = createHvdcServer();
    const client = new Client({ name: "descriptor-resource-test", version: "0.0.1" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([mcpServer.connect(serverTransport), client.connect(clientTransport)]);

    try {
      const canonical = await client.readResource({ uri: "ui://hvdc/answer-card-v6.html" });
      const legacy = await client.readResource({ uri: "ui://hvdc/answer-card-v5.html" });
      const renderAlias = await client.readResource({ uri: "ui://hvdc/render_hvdc_answer_card.html" });
      const canonicalContent = canonical.contents[0];
      const legacyContent = legacy.contents[0];
      const renderAliasContent = renderAlias.contents[0];

      expect(canonicalContent?.uri).toBe("ui://hvdc/answer-card-v6.html");
      expect(legacyContent?.uri).toBe("ui://hvdc/answer-card-v5.html");
      expect(renderAliasContent?.uri).toBe("ui://hvdc/render_hvdc_answer_card.html");
      expect(canonicalContent?.mimeType).toBe("text/html;profile=mcp-app");
      expect(legacyContent?.mimeType).toBe(canonicalContent?.mimeType);
      expect(renderAliasContent?.mimeType).toBe(canonicalContent?.mimeType);
      expect(canonicalContent && "text" in canonicalContent).toBe(true);
      expect(legacyContent && "text" in legacyContent).toBe(true);
      expect(renderAliasContent && "text" in renderAliasContent).toBe(true);
      expect((legacyContent as { text: string }).text).toBe((canonicalContent as { text: string }).text);
      expect((renderAliasContent as { text: string }).text).toBe((canonicalContent as { text: string }).text);
    } finally {
      await client.close();
      await mcpServer.close();
    }
  });

  it("returns data-only answer results and render-only Apps SDK template metadata", async () => {
    const mcpServer = createHvdcServer();
    const client = new Client({ name: "descriptor-result-meta-test", version: "0.0.1" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([mcpServer.connect(serverTransport), client.connect(clientTransport)]);

    try {
      const askResult = await client.callTool({
        name: "ask_hvdc_ontology",
        arguments: {
          question: "SCT_ONTOLOGY result-level template metadata smoke",
          userRole: "ops_user",
          language: "ko"
        }
      });
      const askMeta = askResult._meta as { ui?: { resourceUri?: string; visibility?: string[] }; [key: string]: unknown };

      expect(askMeta["openai/outputTemplate"]).toBeUndefined();
      expect(askMeta.ui?.resourceUri).toBeUndefined();
      expect(askMeta.piiMasked).toBe(false);
      expect((askResult.structuredContent as { ui?: unknown }).ui).toBeUndefined();

      const renderResult = await client.callTool({
        name: "render_hvdc_answer_card",
        arguments: askResult.structuredContent as Record<string, unknown>
      });
      const renderMeta = renderResult._meta as { ui?: { resourceUri?: string; visibility?: string[] }; [key: string]: unknown };

      expect(renderMeta["openai/outputTemplate"]).toBe("ui://hvdc/answer-card-v6.html");
      expect(renderMeta.ui?.resourceUri).toBe("ui://hvdc/answer-card-v6.html");
      expect(renderMeta.ui?.visibility).toEqual(["model", "app"]);
      expect((renderResult.structuredContent as { ui?: { templateUrl?: string } }).ui?.templateUrl).toBe(
        "ui://hvdc/answer-card-v6.html"
      );
    } finally {
      await client.close();
      await mcpServer.close();
    }
  });
});
