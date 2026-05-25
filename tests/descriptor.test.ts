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
  test_cases: Array<{
    user_prompt: string;
    tools_triggered: string | null;
    expected_output: string;
  }>;
};

const APPROVED_V1_TOOL_NAMES = [
  "ask_hvdc_ontology",
  "attach_uploaded_file",
  "check_cost_guard",
  "check_doc_guardian",
  "check_mosb_gate",
  "complete_upload",
  "create_upload_url",
  "get_hvdc_case_status",
  "get_team_actions",
  "render_hvdc_answer_card",
  "route_question",
  "search_ontology_corpus",
  "resolve_any_key",
  "validate_answer",
  "write_file_commit",
  "write_file_dry_run"
].sort();

const FORBIDDEN_STANDALONE_TOOL_NAME_PARTS = [
  "shipment",
  "rule",
  "validation",
  "export",
  "action",
  "write_back",
  "writeback"
];

const submission = JSON.parse(
  readFileSync(path.resolve("chatgpt-app-submission.json"), "utf8")
) as Submission;
const serverSource = readFileSync(path.resolve("server", "src", "hvdc-server.ts"), "utf8");
const workerSource = readFileSync(path.resolve("server", "src", "worker.ts"), "utf8");
const rateLimitSource = readFileSync(path.resolve("server", "src", "rate-limit.ts"), "utf8");
const rootAgentGuidance = readFileSync(path.resolve("AGENTS.md"), "utf8");
const systemArchitecture = readFileSync(path.resolve("SYSTEM_ARCHITECTURE.md"), "utf8");
const codexAgentGuidance = readFileSync(path.resolve("docs", "codex", "AGENTS.patched.md"), "utf8");

describe("Apps SDK/MCP descriptor contract parity", () => {
  it("keeps the six server tool names in sync with the ChatGPT app submission", () => {
    const serverToolNames = Object.keys(HVDC_TOOL_DESCRIPTORS).sort();
    const submissionToolNames = Object.keys(submission.tools).sort();

    expect(serverToolNames).toEqual(APPROVED_V1_TOOL_NAMES);
    expect(submissionToolNames).toEqual(APPROVED_V1_TOOL_NAMES);
    expect(serverToolNames).toEqual(submissionToolNames);
  });

  it("blocks new standalone shipment, rule, validation, export, action, or write-back MCP tools in v1", () => {
    const toolNames = [...Object.keys(HVDC_TOOL_DESCRIPTORS), ...Object.keys(submission.tools)];
    const approvedToolNames = new Set(APPROVED_V1_TOOL_NAMES);
    const unexpectedStandaloneTools = toolNames.filter((toolName) => {
      if (approvedToolNames.has(toolName)) return false;
      return FORBIDDEN_STANDALONE_TOOL_NAME_PARTS.some((forbiddenPart) => toolName.includes(forbiddenPart));
    });

    expect(unexpectedStandaloneTools).toEqual([]);
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

    const sideEffectTools = new Set([
      "ask_hvdc_ontology",
      "create_upload_url",
      "complete_upload",
      "attach_uploaded_file",
      "write_file_dry_run",
      "write_file_commit"
    ]);

    for (const [toolName, descriptor] of Object.entries(HVDC_TOOL_DESCRIPTORS)) {
      if (sideEffectTools.has(toolName)) {
        expect(descriptor.annotations.readOnlyHint, `${toolName} readOnlyHint`).toBe(false);
      } else {
        expect(descriptor.annotations.readOnlyHint, `${toolName} readOnlyHint`).toBe(true);
      }
    }
  });

  it("links user-visible answer tools to the widget resource without embedding ui in ask structuredContent", () => {
    const askMeta = HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology._meta;
    const askMetaRecord = askMeta as Record<string, unknown>;
    const renderMeta = HVDC_TOOL_DESCRIPTORS.render_hvdc_answer_card._meta;
    const renderMetaRecord = renderMeta as Record<string, unknown>;
    const askOutputSchema = HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology.outputSchema as Record<string, unknown>;

    expect(HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology.description).toContain("HVDC answer card");
    expect(HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology.description).toContain("답장 작성하라");
    expect(HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology.description).toContain("draft email");
    expect(HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology.description).toContain("EmailActionCard");
    expect(HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology.description).toContain("current user-provided email/thread");
    expect(HVDC_TOOL_DESCRIPTORS.render_hvdc_answer_card.description).toContain(
      "after every user-visible ask_hvdc_ontology answer"
    );
    expect(askOutputSchema.shipmentRule).toBeDefined();
    expect((askOutputSchema as { ui?: unknown }).ui).toBeUndefined();
    expect((askMetaRecord.ui as { resourceUri?: string }).resourceUri).toBe("ui://hvdc/answer-card-v10.html");
    expect(askMetaRecord["openai/outputTemplate"]).toBe("ui://hvdc/answer-card-v10.html");
    expect(askMetaRecord["openai/widgetAccessible"]).toBe(true);
    expect(renderMeta.ui.resourceUri).toBe("ui://hvdc/answer-card-v10.html");
    expect(renderMetaRecord["openai/outputTemplate"]).toBe("ui://hvdc/answer-card-v10.html");
    expect(renderMetaRecord["openai/widgetAccessible"]).toBe(true);
    expect((HVDC_TOOL_DESCRIPTORS.search_ontology_corpus._meta as Record<string, unknown>).ui).toBeUndefined();
    expect(Object.keys(HVDC_TOOL_DESCRIPTORS)).toContain("render_hvdc_answer_card");
    expect(serverSource).toContain("PREVIOUS_WIDGET_URI");
    expect(serverSource).toContain("V6_WIDGET_URI");
    expect(serverSource).toContain("V5_WIDGET_URI");
    expect(serverSource).toContain('const renderToolWidgetAliasUri = "ui://hvdc/render_hvdc_answer_card.html"');
    expect(serverSource).toContain('"hvdc-answer-widget-v8-compat"');
    expect(serverSource).toContain('"hvdc-answer-widget-v7-compat"');
    expect(serverSource).toContain('"hvdc-answer-widget-v6-compat"');
    expect(serverSource).toContain('"hvdc-answer-widget-v5-compat"');
    expect(serverSource).toContain('"render_hvdc_answer_card"');
  });

  it("keeps active Codex guidance aligned with the versioned widget resource", () => {
    for (const guidance of [rootAgentGuidance, codexAgentGuidance]) {
      expect(guidance).toContain("ui://hvdc/answer-card-v10.html");
      expect(guidance).toContain("ui://hvdc/answer-card-v9.html");
      expect(guidance).toContain("ui://hvdc/answer-card-v8.html");
      expect(guidance).toContain("ui://hvdc/answer-card-v6.html");
      expect(guidance).toContain("ui://hvdc/answer-card-v5.html");
      expect(guidance).not.toContain("ui://hvdc/answer-card-v4.html");
    }

    expect(systemArchitecture).toContain("ui://hvdc/answer-card-v10.html");
    expect(systemArchitecture).toContain("ui://hvdc/answer-card-v9.html");
    expect(systemArchitecture).toContain("ui://hvdc/answer-card-v8.html");
    expect(systemArchitecture).toContain("ui://hvdc/answer-card-v6.html");
    expect(systemArchitecture).toContain("ui://hvdc/answer-card-v5.html");
    expect(systemArchitecture).toContain("ui://hvdc/render_hvdc_answer_card.html");
    expect(systemArchitecture).not.toContain("ui://hvdc/answer-card-v4.html");
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

  it("serves the canonical v9 widget, v8/v7/v6/v5 aliases, and render tool alias with identical HTML", async () => {
    const mcpServer = createHvdcServer();
    const client = new Client({ name: "descriptor-resource-test", version: "0.0.1" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([mcpServer.connect(serverTransport), client.connect(clientTransport)]);

    try {
      const canonical = await client.readResource({ uri: "ui://hvdc/answer-card-v10.html" });
      const previous = await client.readResource({ uri: "ui://hvdc/answer-card-v9.html" });
      const legacy = await client.readResource({ uri: "ui://hvdc/answer-card-v8.html" });
      const v6Alias = await client.readResource({ uri: "ui://hvdc/answer-card-v6.html" });
      const v5Alias = await client.readResource({ uri: "ui://hvdc/answer-card-v5.html" });
      const renderAlias = await client.readResource({ uri: "ui://hvdc/render_hvdc_answer_card.html" });
      const canonicalContent = canonical.contents[0];
      const previousContent = previous.contents[0];
      const legacyContent = legacy.contents[0];
      const v6AliasContent = v6Alias.contents[0];
      const v5AliasContent = v5Alias.contents[0];
      const renderAliasContent = renderAlias.contents[0];

      expect(canonicalContent?.uri).toBe("ui://hvdc/answer-card-v10.html");
      expect(previousContent?.uri).toBe("ui://hvdc/answer-card-v9.html");
      expect(legacyContent?.uri).toBe("ui://hvdc/answer-card-v8.html");
      expect(v6AliasContent?.uri).toBe("ui://hvdc/answer-card-v6.html");
      expect(v5AliasContent?.uri).toBe("ui://hvdc/answer-card-v5.html");
      expect(renderAliasContent?.uri).toBe("ui://hvdc/render_hvdc_answer_card.html");
      expect(canonicalContent?.mimeType).toBe("text/html;profile=mcp-app");
      expect(previousContent?.mimeType).toBe(canonicalContent?.mimeType);
      expect(legacyContent?.mimeType).toBe(canonicalContent?.mimeType);
      expect(v6AliasContent?.mimeType).toBe(canonicalContent?.mimeType);
      expect(v5AliasContent?.mimeType).toBe(canonicalContent?.mimeType);
      expect(renderAliasContent?.mimeType).toBe(canonicalContent?.mimeType);
      expect(canonicalContent && "text" in canonicalContent).toBe(true);
      expect(previousContent && "text" in previousContent).toBe(true);
      expect(legacyContent && "text" in legacyContent).toBe(true);
      expect(v6AliasContent && "text" in v6AliasContent).toBe(true);
      expect(v5AliasContent && "text" in v5AliasContent).toBe(true);
      expect(renderAliasContent && "text" in renderAliasContent).toBe(true);
      expect((previousContent as { text: string }).text).toBe((canonicalContent as { text: string }).text);
      expect((legacyContent as { text: string }).text).toBe((canonicalContent as { text: string }).text);
      expect((v6AliasContent as { text: string }).text).toBe((canonicalContent as { text: string }).text);
      expect((v5AliasContent as { text: string }).text).toBe((canonicalContent as { text: string }).text);
      expect((renderAliasContent as { text: string }).text).toBe((canonicalContent as { text: string }).text);
      expect((canonicalContent as { _meta?: { ui?: { domain?: string; csp?: unknown }; [key: string]: unknown } })._meta?.ui?.domain).toBe(
        "https://hvdc-ontology-chatgpt-app.mscho715.workers.dev"
      );
      expect((canonicalContent as { _meta?: { ui?: { csp?: { connectDomains?: string[]; resourceDomains?: string[] } } } })._meta?.ui?.csp).toEqual({
        connectDomains: [],
        resourceDomains: []
      });
      expect((canonicalContent as { _meta?: Record<string, unknown> })._meta?.["openai/widgetDomain"]).toBe(
        "https://hvdc-ontology-chatgpt-app.mscho715.workers.dev"
      );
      expect((canonicalContent as { _meta?: Record<string, unknown> })._meta?.["openai/widgetCSP"]).toEqual({
        connect_domains: [],
        resource_domains: [],
        frame_domains: [],
        redirect_domains: []
      });
    } finally {
      await client.close();
      await mcpServer.close();
    }
  });

  it("returns card metadata on ask results while keeping ask structuredContent free of ui state", async () => {
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

      expect(askMeta["openai/outputTemplate"]).toBe("ui://hvdc/answer-card-v10.html");
      expect(askMeta.ui?.resourceUri).toBe("ui://hvdc/answer-card-v10.html");
      expect(askMeta.piiMasked).toBe(false);
      expect((askResult.structuredContent as { ui?: unknown }).ui).toBeUndefined();

      const renderResult = await client.callTool({
        name: "render_hvdc_answer_card",
        arguments: askResult.structuredContent as Record<string, unknown>
      });
      const renderMeta = renderResult._meta as { ui?: { resourceUri?: string; visibility?: string[] }; [key: string]: unknown };

      expect(renderMeta["openai/outputTemplate"]).toBe("ui://hvdc/answer-card-v10.html");
      expect(renderMeta.ui?.resourceUri).toBe("ui://hvdc/answer-card-v10.html");
      expect(renderMeta.ui?.visibility).toEqual(["model", "app"]);
      expect((renderResult.structuredContent as { ui?: { templateUrl?: string } }).ui?.templateUrl).toBe(
        "ui://hvdc/answer-card-v10.html"
      );

      const legacyStructuredContent = { ...(askResult.structuredContent as Record<string, unknown>) };
      delete legacyStructuredContent.evidenceTrace;
      const legacyRenderResult = await client.callTool({
        name: "render_hvdc_answer_card",
        arguments: legacyStructuredContent
      });
      expect((legacyRenderResult.structuredContent as { evidenceTrace?: unknown[] }).evidenceTrace).toEqual([]);
    } finally {
      await client.close();
      await mcpServer.close();
    }
  });

  it("asks ChatGPT review cases to use ask directly for user-visible answer cards", () => {
    const hvdcAnswerPrompts = new Set([
      "AGI M130 닫아도 돼? BL-535 관련",
      "Flow Code 어디에 써?",
      "붙여넣은 이메일 내용을 기준으로 답장 작성하라."
    ]);
    const hvdcAnswerCases = submission.test_cases.filter((testCase) => hvdcAnswerPrompts.has(testCase.user_prompt));

    expect(hvdcAnswerCases.length).toBe(hvdcAnswerPrompts.size);
    for (const testCase of hvdcAnswerCases) {
      expect(testCase.tools_triggered).toContain("ask_hvdc_ontology");
      expect(testCase.expected_output).toMatch(/card|카드|EmailActionCard|EMAIL_ACTION_CARD/i);
    }
  });

  it("uses the Cloudflare Worker MCP entrypoint instead of a legacy deployment config", () => {
    expect(workerSource).toContain('import { createMcpHandler } from "agents/mcp"');
    expect(workerSource).toContain("MCP_PATH");
    expect(rateLimitSource).toContain('export const MCP_PATH = "/mcp"');
    expect(workerSource).toContain("MCP_AUDIT_DB");
    expect(workerSource).toContain("HVDC_FILES");
  });

  it("declares OAuth-protected upload and write tools with Human-gate language", () => {
    for (const toolName of [
      "create_upload_url",
      "complete_upload",
      "attach_uploaded_file",
      "write_file_dry_run",
      "write_file_commit"
    ]) {
      const descriptor = HVDC_TOOL_DESCRIPTORS[toolName as keyof typeof HVDC_TOOL_DESCRIPTORS];
      expect(descriptor.description, `${toolName} description`).toMatch(/OAuth|Bearer|scope/i);
      expect(descriptor.description, `${toolName} description`).toMatch(/Human-gate|approval/i);
      expect(descriptor.inputSchema, `${toolName} input schema`).toHaveProperty("approval");
      expect(descriptor.outputSchema, `${toolName} output schema`).toHaveProperty("status");
      expect(descriptor.annotations.readOnlyHint, `${toolName} readOnlyHint`).toBe(false);
      expect(descriptor.annotations.destructiveHint, `${toolName} destructiveHint`).toBe(false);
      expect(descriptor.annotations.openWorldHint, `${toolName} openWorldHint`).toBe(false);
    }
  });
});
