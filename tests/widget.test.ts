import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const widgetHtml = readFileSync(resolve(process.cwd(), "public", "hvdc-answer-widget.html"), "utf8");

function renderWidgetFixture(answer: Record<string, unknown>): string {
  const script = widgetHtml.match(/<script>([\s\S]*)<\/script>/)?.[1];
  expect(script).toBeTruthy();
  const root = {
    innerHTML: "",
    addEventListener: () => undefined,
    querySelector: () => null
  };
  const sandbox = {
    console,
    Map,
    Set,
    JSON,
    String,
    Number,
    Array,
    Error,
    HTMLElement: class HTMLElement {},
    document: { getElementById: () => root },
    window: {
      parent: { postMessage: () => undefined },
      addEventListener: () => undefined,
      setTimeout: () => 0,
      setInterval: () => 0,
      clearInterval: () => undefined,
      clearTimeout: () => undefined,
      CSS: { escape: (value: string) => value.replace(/["\\\]\[]/g, "\\$&") },
      openai: {}
    }
  };
  vm.createContext(sandbox);
  vm.runInContext(script ?? "", sandbox);
  (sandbox as unknown as { render: (value: unknown) => void }).render(answer);
  return root.innerHTML;
}

describe("HVDC answer widget", () => {
  it("renders verdict before route and evidence sections", () => {
    const verdictIndex = widgetHtml.indexOf("Verdict");
    const routeIndex = widgetHtml.indexOf("Route documents");
    const evidenceIndex = widgetHtml.indexOf("Evidence Drawer");

    expect(verdictIndex).toBeGreaterThan(-1);
    expect(routeIndex).toBeGreaterThan(verdictIndex);
    expect(evidenceIndex).toBeGreaterThan(routeIndex);
  });

  it("shows evidence inspection fields and review warnings", () => {
    for (const label of [
      "Source doc",
      "Section path",
      "Raw evidence ID",
      "Connected answer statements",
      "Document hash",
      "Confidence",
      "Validation status",
      "PII state",
      "Stale or review warnings"
    ]) {
      expect(widgetHtml).toContain(label);
    }
  });

  it("keeps accessible fallback and focus-visible behavior", () => {
    expect(widgetHtml).toContain("Text fallback");
    expect(widgetHtml).toContain("aria-live=\"polite\"");
    expect(widgetHtml).toContain("aria-labelledby=\"verdict-title\"");
    expect(widgetHtml).toContain("focus-visible");
  });

  it("separates template rendering warnings from business answer data", () => {
    expect(widgetHtml).toContain("Card UI warning");
    expect(widgetHtml).toContain("Data status");
    expect(widgetHtml).toContain("UI render status");
    expect(widgetHtml).toContain("TEMPLATE_FETCH_FAILED");
    expect(widgetHtml).toContain("FALLBACK_RENDERED");
    expect(widgetHtml).toContain("CARD_TEMPLATE_RENDER_FAILED");
    expect(widgetHtml).toContain("Protected fields");
  });

  it("initializes the MCP Apps bridge before relying on one-shot tool results", () => {
    expect(widgetHtml).toContain("ui/initialize");
    expect(widgetHtml).toContain("ui/notifications/initialized");
    expect(widgetHtml).toContain("ui/notifications/tool-input");
    expect(widgetHtml).toContain("ui/notifications/tool-result");
    expect(widgetHtml).not.toContain("window.openai.callTool");
    expect(widgetHtml).not.toContain("tools/call");
    expect(widgetHtml).not.toContain('name: "ask_hvdc_ontology"');
    expect(widgetHtml).not.toContain("render_hvdc_answer_card");
  });

  it("polls legacy ChatGPT output surfaces when structuredContent arrives after load", () => {
    expect(widgetHtml).toContain("startLegacyOutputPolling");
    expect(widgetHtml).toContain("getLegacyToolOutput");
    for (const surface of ["toolOutput", "toolResult", "structuredContent", "response", "data", "globals"]) {
      expect(widgetHtml).toContain(surface);
    }
  });

  it("subscribes to the official ChatGPT component bridge globals event", () => {
    expect(widgetHtml).toContain("openai:set_globals");
    expect(widgetHtml).toContain("handleOpenAiGlobals");
    expect(widgetHtml).toContain("event.detail?.globals");
  });

  it("constrains long drawers to prevent parent page layout jitter", () => {
    expect(widgetHtml).toContain("overflow-x: hidden");
    expect(widgetHtml).toContain("scrollbar-gutter: stable");
    expect(widgetHtml).toContain("overscroll-behavior: contain");
    expect(widgetHtml).toContain("grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))");
    expect(widgetHtml).toContain("overflow-wrap: anywhere");
    expect(widgetHtml).toContain("word-break: break-word");
    expect(widgetHtml).toContain("padding: 12px 12px 44px");
    expect(widgetHtml).toContain("class=\"details-body\"");
    expect(widgetHtml).toContain("reasonCode");
  });

  it("does not fetch external resources from the iframe", () => {
    expect(widgetHtml).not.toMatch(/\bfetch\s*\(/);
    expect(widgetHtml).not.toMatch(/\bXMLHttpRequest\b/);
    expect(widgetHtml).not.toMatch(/\bWebSocket\b/);
    expect(widgetHtml).not.toMatch(/\bEventSource\b/);
    expect(widgetHtml).not.toMatch(/\bsendBeacon\s*\(/);
    expect(widgetHtml).not.toMatch(/\bimportScripts\s*\(/);
    expect(widgetHtml).not.toMatch(/https?:\/\//i);
    expect(widgetHtml).not.toMatch(/<script\s+[^>]*src=/i);
    expect(widgetHtml).not.toMatch(/<link\s+[^>]*href=/i);
    expect(widgetHtml).not.toMatch(/<img\s+[^>]*src=/i);
  });

  it("keeps the iframe HTML resource-URI agnostic for compatibility aliases", () => {
    for (const resourceUri of [
      "ui://hvdc/answer-card-v8.html",
      "ui://hvdc/answer-card-v7.html",
      "ui://hvdc/answer-card-v6.html",
      "ui://hvdc/answer-card-v5.html",
      "ui://hvdc/render_hvdc_answer_card.html"
    ]) {
      expect(widgetHtml).not.toContain(resourceUri);
    }

    expect(widgetHtml).not.toContain("window.location");
    expect(widgetHtml).not.toContain("document.location");
  });

  it("renders UI failures without overwriting protected business fields", () => {
    const html = renderWidgetFixture({
      answerId: "ui-failure-fixture",
      verdict: "PASS",
      dataStatus: "OK",
      businessResultVisible: true,
      fallbackUsed: true,
      summary: "Business verdict remains PASS",
      businessImpact: "Business impact remains visible",
      details: ["Business detail remains visible"],
      evidenceIds: ["ev-protected"],
      validationStatus: "WARN",
      route: { routeId: "r-protected", requiredDocs: ["CONSOLIDATED-00"], confidence: 0.95, routingReason: "fixture" },
      evidence: [
        {
          id: "ev-protected",
          docId: "DOC-PROTECTED",
          title: "Protected Business Evidence",
          version: "v1",
          sectionPath: "Protected Section",
          snippet: "Evidence remains visible",
          docHash: "protected-hash",
          confidence: 0.9,
          sourceType: "ontology_corpus"
        }
      ],
      evidenceTrace: [
        {
          targetType: "summary",
          targetIndex: null,
          answerText: "Business verdict remains PASS",
          supportState: "SUPPORTED",
          evidenceIds: ["ev-protected"]
        },
        {
          targetType: "action",
          targetIndex: 0,
          answerText: "Review protected action",
          supportState: "SUPPORTED",
          evidenceIds: ["ev-protected"]
        }
      ],
      validation: [
        {
          ruleId: "fixture-rule",
          reasonCode: "FIXTURE_WARN",
          severity: "WARN",
          status: "WARN",
          targetObject: "fixture",
          evidenceIds: ["ev-protected"],
          message: "Validation status remains WARN"
        }
      ],
      actions: [
        {
          actionType: "Review protected action",
          ownerRole: "Ops reviewer",
          parameters: {},
          humanGateRequired: true,
          dueAt: null
        }
      ],
      ui: {
        dataStatus: "OK",
        uiRenderStatus: "TEMPLATE_FETCH_FAILED",
        businessResultVisible: true,
        fallbackUsed: true,
        cardEnabled: false,
        templateVersion: "answer-card-v8",
        schemaVersion: "1.0.0",
        errorCode: "CARD_TEMPLATE_RENDER_FAILED",
        errorMessage: "Fixture template failure",
        doNotChange: ["verdict", "validationStatus", "evidenceIds", "actions"]
      },
      piiMasked: false,
      generatedAt: "2026-05-11T00:00:00Z"
    });

    expect(html).toContain("Card UI warning");
    expect(html).toContain("TEMPLATE_FETCH_FAILED");
    expect(html).toContain("CARD_TEMPLATE_RENDER_FAILED");
    expect(html).toContain("Protected fields");
    expect(html).toContain("verdict, validationStatus, evidenceIds, actions");
    expect(html).toContain("PASS");
    expect(html).toContain("Business verdict remains PASS");
    expect(html).toContain("WARN");
    expect(html).toContain("Validation status remains WARN");
    expect(html).toContain("ev-protected");
    expect(html).toContain("Review protected action");
    expect(html).toContain("Human-gate required");
    expect(html).toContain("E1");
  });

  it("renders evidence trace labels and no-direct-evidence state without changing protected fields", () => {
    expect(widgetHtml).toContain("evidenceTrace");
    expect(widgetHtml).toContain("buildEvidenceDisplayLabels");
    expect(widgetHtml).toContain("No direct evidence");
    expect(widgetHtml).toContain('if (!trace) return ""');
    expect(widgetHtml).toContain("trace-chip");
    expect(widgetHtml).toContain("trace-missing");
    expect(widgetHtml).toContain("focusEvidence");
    expect(widgetHtml).toContain("rawEvidenceId");
    expect(widgetHtml).toContain("connectedStatements");
    expect(widgetHtml).toContain("Protected fields");
  });

  it("renders mixed evidence trace fixture into answer content and drawer rows", () => {
    const html = renderWidgetFixture({
      answerId: "fixture",
      verdict: "PASS",
      dataStatus: "OK",
      businessResultVisible: true,
      fallbackUsed: false,
      summary: "Supported summary",
      businessImpact: "Unsupported impact",
      details: ["Supported detail", "Unsupported detail"],
      evidenceIds: ["ev1"],
      validationStatus: "PASS",
      route: { routeId: "r1", requiredDocs: ["CONSOLIDATED-00"], confidence: 0.95, routingReason: "fixture" },
      evidence: [
        {
          id: "ev1",
          docId: "DOC-01",
          title: "Fixture Doc",
          version: "v1",
          sectionPath: "Section 1",
          snippet: "Supported summary and Supported detail",
          docHash: "hash",
          confidence: 0.9,
          sourceType: "ontology_corpus"
        }
      ],
      evidenceTrace: [
        { targetType: "summary", targetIndex: null, answerText: "Supported summary", supportState: "SUPPORTED", evidenceIds: ["ev1"] },
        {
          targetType: "businessImpact",
          targetIndex: null,
          answerText: "Unsupported impact",
          supportState: "NO_DIRECT_EVIDENCE",
          evidenceIds: []
        },
        { targetType: "detail", targetIndex: 0, answerText: "Supported detail", supportState: "SUPPORTED", evidenceIds: ["ev1"] },
        {
          targetType: "detail",
          targetIndex: 1,
          answerText: "Unsupported detail",
          supportState: "NO_DIRECT_EVIDENCE",
          evidenceIds: []
        }
      ],
      validation: [],
      actions: [],
      piiMasked: false,
      generatedAt: "2026-05-11T00:00:00Z"
    });

    expect(html).toContain("E1");
    expect(html).toContain("No direct evidence");
    expect(html).toContain("Raw evidence ID");
    expect(html).toContain("ev1");
    expect(html).toContain("Connected answer statements");
    expect(html).toContain("Supported summary");
    expect(html).toContain("Supported detail");
    expect(html).not.toContain("data-raw-evidence-id=\"NO_DIRECT_EVIDENCE\"");
  });

  it("masks token-like strings in fallback text and evidence snippets", () => {
    const html = renderWidgetFixture({
      answerId: "fixture",
      verdict: "WARN",
      dataStatus: "OK",
      businessResultVisible: true,
      fallbackUsed: false,
      summary: "Token redaction check",
      businessImpact: "Token sk-proj-abcdefghijklmnopqrstuvwxyz123456 should not show",
      details: ["Bearer-like aaaabbbbccccddddeeee.ffffgggghhhhiiiijjjj.kkkkllllmmmmnnnnoooo should not show"],
      evidenceIds: ["ev-token"],
      validationStatus: "WARN",
      route: { routeId: "r1", requiredDocs: ["CONSOLIDATED-00"], confidence: 0.95, routingReason: "fixture" },
      evidence: [
        {
          id: "ev-token",
          docId: "DOC-01",
          title: "Fixture Doc",
          version: "v1",
          sectionPath: "Secret Section",
          snippet: "Do not expose sk-proj-abcdefghijklmnopqrstuvwxyz123456",
          docHash: "hash",
          confidence: 0.9,
          sourceType: "ontology_corpus"
        }
      ],
      evidenceTrace: [],
      validation: [],
      actions: [],
      piiMasked: true,
      generatedAt: "2026-05-11T00:00:00Z"
    });

    expect(html).toContain("[masked-token]");
    expect(html).not.toContain("sk-proj-abcdefghijklmnopqrstuvwxyz123456");
    expect(html).not.toContain("aaaabbbbccccddddeeee.ffffgggghhhhiiiijjjj.kkkkllllmmmmnnnnoooo");
  });

  it("renders ONTOLOGY PATH graphPath start, edges, end, and confidence", () => {
    const html = renderWidgetFixture({
      answerId: "graph-path-fixture",
      verdict: "PASS",
      dataStatus: "OK",
      businessResultVisible: true,
      fallbackUsed: false,
      summary: "Graph path available",
      businessImpact: "Path traceability is visible in the card",
      details: [],
      evidenceIds: [],
      validationStatus: "PASS",
      route: { routeId: "r1", requiredDocs: ["CONSOLIDATED-00"], confidence: 0.95, routingReason: "fixture" },
      evidence: [],
      evidenceTrace: [],
      validation: [],
      actions: [],
      graphPath: {
        startNode: "HVDC-ANSWER",
        edges: [
          { from: "HVDC-ANSWER", relation: "routes_to", to: "CONSOLIDATED-00 Master Ontology" },
          { from: "CONSOLIDATED-00 Master Ontology", relation: "grounds", to: "ShipmentUnit / Document / Invoice" },
          { from: "ShipmentUnit / Document / Invoice", relation: "checks", to: "MilestoneEvent" },
          { from: "MilestoneEvent", relation: "applies_to", to: "HVDC Logistics Question" }
        ],
        endNode: "HVDC Logistics Question",
        pathConfidence: 0.88
      },
      piiMasked: false,
      generatedAt: "2026-05-15T09:11:31Z"
    });

    expect(html).toContain("ONTOLOGY PATH");
    expect(html).toContain("Start node");
    expect(html).toContain("HVDC-ANSWER");
    expect(html).toContain("End node");
    expect(html).toContain("HVDC Logistics Question");
    expect(html).toContain("Path confidence");
    expect(html).toContain("0.88");
    expect(html).toContain("Edge count");
    expect(html).toContain("4");
    expect(html).toContain("Ontology path edges");
    expect(html).toContain("routes_to");
    expect(html).toContain("grounds");
    expect(html).toContain("checks");
    expect(html).toContain("applies_to");
  });
});
