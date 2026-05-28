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

  it("NFR-004: exposes verdict, status, and tab state as text/ARIA, not color alone", () => {
    const html = renderWidgetFixture(decisionCardFixture());

    expect(html).toContain("aria-label=\"Decision verdict BLOCK\"");
    expect(html).toContain(">BLOCK</span>");
    expect(html).toContain("Pending Approval");
    expect(html).toContain("Human gate state");
    expect(html).toContain("Approval is pending");
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain("aria-controls=");
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
    expect(widgetHtml).toContain(".table-scroll");
    expect(widgetHtml).toContain("overflow-x: auto");
    expect(widgetHtml).toContain("grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))");
    expect(widgetHtml).toContain("overflow-wrap: anywhere");
    expect(widgetHtml).toContain("word-break: break-word");
    expect(widgetHtml).toContain("padding: 12px 12px 44px");
    expect(widgetHtml).toContain("class=\"details-body\"");
    expect(widgetHtml).toContain("reasonCode");
  });

  it("keeps case status tables inside scrollable card containers", () => {
    expect(widgetHtml).toContain("case-status-table-section");
    expect(widgetHtml).toContain("aria-label=\"Base Case Card table\"");
    expect(widgetHtml).toContain("aria-label=\"canonicalEvents table\"");
    expect(widgetHtml).toContain("decision-card-table compact");
    expect(widgetHtml).toContain("Timeline columns stay inside the card");
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
      "ui://hvdc/answer-card-v10.html",
      "ui://hvdc/answer-card-v9.html",
      "ui://hvdc/answer-card-v8.html",
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
        templateVersion: "answer-card-v10",
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

  it("scrolls and highlights clicked decision tabs and drawer targets", () => {
    expect(widgetHtml).toContain("scrollAndHighlight");
    expect(widgetHtml).toContain("scrollIntoView");
    expect(widgetHtml).toContain("hvdc-scroll-highlight");
    expect(widgetHtml).toContain("hvdc-section-flash");
    expect(widgetHtml).toContain("data-drawer-key=\"evidence\"");
    expect(widgetHtml).toContain("data-drawer-key=\"ontology-path\"");
    expect(widgetHtml).toContain("window.setTimeout(() => {");
    expect(widgetHtml).toContain("target.classList?.remove?.(\"hvdc-scroll-highlight\")");
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

  it("keeps ISO dates visible while masking phone numbers", () => {
    const html = renderWidgetFixture({
      answerId: "case-date-fixture",
      verdict: "WARN",
      dataStatus: "OK",
      businessResultVisible: true,
      fallbackUsed: false,
      summary: "Case status fixture",
      businessImpact: "Warehouse timeline must keep dates but mask +971 50 123 4567",
      details: [],
      evidenceIds: [],
      validationStatus: "WARN",
      route: { routeId: "r1", requiredDocs: ["CONSOLIDATED-00"], confidence: 0.95, routingReason: "fixture" },
      evidence: [],
      evidenceTrace: [],
      validation: [],
      actions: [],
      piiMasked: true,
      generatedAt: "2026-05-25T00:00:00Z",
      report: {
        shipmentUnitId: "WHCASE-207721",
        reportStatus: "WARN",
        shipment: { currentStage: "M100_FINAL_DELIVERED", currentLocation: "DAS" },
        latestStatus: { latestEventType: "M100_FINAL_DELIVERED", latestEventDate: "2025-05-13" },
        warehouseDates: { warehouseIn: "2024-01-19", warehouseOut: "2025-05-13" },
        whDwell: { warehouseIn: "2024-01-19", warehouseOut: "2025-05-13", dwellDays: 480 },
        siteIntake: { siteReceiptDate: "2025-05-13", siteCodes: "DAS" },
        caseCard: [{ label: "Case No.", value: "207721.0" }],
        canonicalEvents: [
          { eventType: "M040_DEPARTED", eventDate: "2023-12-01", siteCode: "Gothenburg", zoneCode: "-", sourceFile: "hvdc_wh_status.xlsx", sourceRow: 2 },
          { eventType: "M100_FINAL_DELIVERED", eventDate: "2025-05-13", siteCode: "DAS", zoneCode: "-", sourceFile: "hvdc_wh_status.xlsx", sourceRow: 2 }
        ]
      }
    });

    expect(html).toContain("2023-12-01");
    expect(html).toContain("2024-01-19");
    expect(html).toContain("2025-05-13");
    expect(html).toContain("[masked-phone]");
    expect(html).not.toContain("+971 50 123 4567");
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

  it("contains Decision Card v2 widget helpers and styles", () => {
    expect(widgetHtml).toContain("decision-card-v2");
    expect(widgetHtml).toContain("renderDecisionCard");
    expect(widgetHtml).toContain("renderDecisionTabs");
    expect(widgetHtml).toContain("renderBlockReasonBox");
    expect(widgetHtml).toContain("renderUnblockChecklist");
    expect(widgetHtml).toContain("renderHumanGateBanner");
    expect(widgetHtml).toContain("renderEvidenceCoverage");
    expect(widgetHtml).toContain("renderActionTable");
    expect(widgetHtml).toContain("renderDecisionSecurity");
    expect(widgetHtml).toContain("safeCardVerdict");
    expect(widgetHtml).toContain("truncateText");
    expect(widgetHtml).toContain("Human gate state");
    expect(widgetHtml).toContain("Allowed now");
    expect(widgetHtml).toContain("Blocked until approved");
    expect(widgetHtml).toContain("RulePacks");
    expect(widgetHtml).toContain("Decision Card sections");
  });

  it("does not render Decision Card v2 markup when decisionCard is absent", () => {
    const html = renderWidgetFixture({
      answerId: "no-decision-card",
      verdict: "PASS",
      dataStatus: "OK",
      businessResultVisible: true,
      fallbackUsed: false,
      summary: "Legacy answer stays compact",
      businessImpact: "No v2 card payload was provided",
      details: [],
      evidenceIds: [],
      validationStatus: "PASS",
      route: { routeId: "r1", requiredDocs: ["CONSOLIDATED-00"], confidence: 0.95, routingReason: "fixture" },
      evidence: [],
      evidenceTrace: [],
      validation: [],
      actions: [],
      piiMasked: false,
      generatedAt: "2026-05-17T00:00:00Z"
    });

    expect(html).not.toContain("decision-card-v2");
    expect(html).toContain("Legacy answer stays compact");
  });

  it("renders Decision Card v2 before the legacy verdict title", () => {
    const html = renderWidgetFixture(decisionCardFixture());
    expect(html.indexOf("decision-card-v2")).toBeGreaterThan(-1);
    expect(html.indexOf("decision-card-v2")).toBeLessThan(html.indexOf("verdict-title"));
  });

  it("renders text verdict, escaped primary reason, and accessible aria label", () => {
    const html = renderWidgetFixture(decisionCardFixture({
      primaryReason: "A".repeat(90) + "<script>alert(1)</script>"
    }));

    expect(html).toContain("Decision Card v2");
    expect(html).toContain("aria-label=\"Decision verdict BLOCK\"");
    expect(html).toContain("Intent");
    expect(html).toContain("LOGISTICS_DECISION");
    expect(html).toContain("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    expect(html).toContain("…");
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("renders ZERO decision cards without downgrading the verdict to BLOCK", () => {
    const html = renderWidgetFixture({
      ...decisionCardFixture({
        verdict: "ZERO",
        primaryReason: "P2 raw content exposure blocked",
        piiStatus: "Risk",
        dataClass: "P2",
        blockedBy: [
          {
            ruleId: "SCT-P2-004",
            ruleName: "P2 raw content must not be exposed",
            reason: "P2 raw text / rate / internal link exposed",
            requiredInputs: ["Material ID", "redacted snippet", "sourceHash"],
            missingInputs: ["redacted snippet"],
            blockedActions: ["Export", "Publish"],
            severity: "P0"
          }
        ]
      }),
      verdict: "ZERO",
      validationStatus: "BLOCK"
    });

    expect(html).toContain("aria-label=\"Decision verdict ZERO\"");
    expect(html).toContain("SCT-P2-004");
    expect(html).toContain("P2 raw content must not be exposed");
    expect(html).toContain("BlockReasonBox");
    expect(html).toContain("Security");
    expect(html).toContain("Data class");
    expect(html).toContain("External share status");
    expect(html).toContain("raw sensitive content blocked");
  });

  it("renders DIAGNOSTIC decision cards without downgrading the verdict to BLOCK", () => {
    const html = renderWidgetFixture({
      ...decisionCardFixture({
        verdict: "DIAGNOSTIC",
        primaryReason: "System QA prompt isolated from operational action lanes",
        blockedBy: [],
        allowedNow: ["read", "diagnostic_report", "test_scenario"],
        blockedUntilApproved: ["email_draft", "external_send", "cost_approval"]
      }),
      verdict: "DIAGNOSTIC",
      validationStatus: "PASS"
    });

    expect(html).toContain("aria-label=\"Decision verdict DIAGNOSTIC\"");
    expect(html).toContain("diagnostic_report");
    expect(html).not.toContain("Decision verdict BLOCK");
  });

  it("renders blocked-by rule fields and unblock checklist", () => {
    const html = renderWidgetFixture(decisionCardFixture());

    expect(html).toContain("BlockReasonBox");
    expect(html).toContain("SCT-DOC-002");
    expect(html).toContain("Operational document evidence required");
    expect(html).toContain("BOE / DO / Port evidence required");
    expect(html).toContain("Required inputs");
    expect(html).toContain("Blocked actions");
    expect(html).toContain("Report publication");
    expect(html).toContain("BOE");
    expect(html).toContain("DO");
    expect(html).toContain("UnblockChecklist");
    expect(html).toContain("BOE, DO, Port evidence");
  });

  it("renders HumanGateBanner only while approval is pending", () => {
    const pending = renderWidgetFixture(decisionCardFixture());
    const approved = renderWidgetFixture(decisionCardFixture({
      trace: { approvalStatus: "Approved" },
      actions: [
        {
          actionId: "ACT-001",
          ownerRole: "Logistics Lead",
          ownerNameMasked: null,
          actionType: "Publish Report",
          actionLabel: "Publish Report",
          requiredInput: "Approval actor",
          approvalRequired: true,
          approvalStatus: "Approved",
          status: "Open",
          evidenceIds: ["ev1"],
          blockedUntil: [],
          dueBasis: "Before approval-gated execution",
          dueAt: null
        }
      ]
    }));

    expect(pending).toContain("HumanGateBanner");
    expect(pending).toContain("Approval is pending");
    expect(approved).not.toContain("HumanGateBanner");
  });

  it("renders evidence coverage and action table with text statuses", () => {
    const html = renderWidgetFixture(decisionCardFixture());

    expect(html).toContain('role="tablist"');
    expect(html).toContain("Decision Card sections");
    for (const tab of ["Decision", "Evidence", "Validation", "Entities", "Actions", "Security", "Trace"]) {
      expect(html).toContain(`>${tab}</button>`);
    }
    expect(html).toContain("EvidenceCoverageBar");
    expect(html).toContain("Customs");
    expect(html).toContain("BLOCK");
    expect(html).toContain("0 / 1");
    expect(html).toContain("Direct support: 0.92");
    expect(html).toContain("ActionTable v2");
    expect(html).toContain("Publish Report");
    expect(html).toContain("Logistics Lead");
    expect(html).toContain("Pending Approval");
    expect(html).toContain("Approval actor");
    expect(html).toContain("Before approval-gated execution");
    expect(html).toContain("APPROVAL_REQUESTED");
    expect(html).toContain("Detection scope");
    expect(html).toContain("Masked fields");
    expect(html).toContain("External share status");
  });

  it("escapes Decision Card v2 table and trace fields", () => {
    const html = renderWidgetFixture(decisionCardFixture({
      blockedBy: [
        {
          ruleId: "SCT-XSS-001",
          ruleName: "<img src=x onerror=alert(1)>",
          reason: "unsafe <b>reason</b>",
          requiredInputs: ["<script>bad()</script>"],
          missingInputs: ["<svg onload=bad()>"],
          severity: "P0"
        }
      ],
      trace: {
        approvalStatus: "Pending",
        approvalActor: "<script>actor</script>",
        sourceHash: "hash<script>"
      }
    }));

    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).toContain("unsafe &lt;b&gt;reason&lt;/b&gt;");
    expect(html).toContain("&lt;script&gt;bad()&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;actor&lt;/script&gt;");
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain("<script>actor</script>");
  });
});

function decisionCardFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const decisionCard = {
    schemaVersion: "sct.card.v2",
    cardId: "DC-fixture",
    routeId: "r1",
    intent: "LOGISTICS_DECISION",
    generatedAt: "2026-05-17T00:00:00Z",
    verdict: "BLOCK",
    severity: "P0",
    primaryReason: "Missing customs evidence blocks publication",
    unblockSummary: "BOE, DO, Port evidence",
    piiStatus: "Masked",
    dataClass: "P1",
    blockedBy: [
      {
        ruleId: "SCT-DOC-002",
        ruleName: "Operational document evidence required",
        reason: "BOE / DO / Port evidence required",
        requiredInputs: ["BOE", "DO", "Port evidence"],
        missingInputs: ["BOE", "DO"],
        blockedActions: ["Report publication"],
        severity: "P0"
      }
    ],
    allowedActions: ["Copy JSON"],
    blockedActions: ["Publish Report"],
    allowedNow: ["read", "dry_run", "Copy JSON"],
    blockedUntilApproved: ["Publish Report", "External send"],
    humanGateState: "APPROVAL_REQUESTED",
    evidenceCoverage: [
      { domain: "Customs", status: "BLOCK", required: 1, available: 0, directSupportRatio: 0 },
      { domain: "Warehouse", status: "PASS", required: 1, available: 1, directSupportRatio: 0.92 }
    ],
    actions: [
      {
        actionId: "ACT-001",
        ownerRole: "Logistics Lead",
        ownerNameMasked: null,
        actionType: "Publish Report",
        actionLabel: "Publish Report",
        requiredInput: "Approval actor",
        approvalRequired: true,
        approvalStatus: "Pending",
        status: "Pending Approval",
        evidenceIds: ["ev1"],
        blockedUntil: ["Approval actor"],
        dueBasis: "Before approval-gated execution",
        dueAt: "2026-05-18"
      }
    ],
    trace: {
      sourceHash: "sha256:fixture",
      rulePackVersion: "2026.05",
      rulePackIds: ["SYSTEM_QA_RULEPACK", "DOCUMENT_RULEPACK"],
      promptVersion: "test",
      approvalActor: null,
      approvalStatus: "Pending",
      sensitiveAccessed: true,
      generatedAt: "2026-05-17T00:00:00Z",
      routeId: "r1"
    },
    ...overrides
  };

  return {
    answerId: "decision-card-fixture",
    verdict: "BLOCK",
    dataStatus: "OK",
    businessResultVisible: true,
    fallbackUsed: false,
    summary: "Decision Card fixture",
    businessImpact: "Publication is blocked until customs evidence and approval are present",
    details: [],
    evidenceIds: ["ev1"],
    validationStatus: "BLOCK",
    route: { routeId: "r1", requiredDocs: ["CONSOLIDATED-00"], confidence: 0.95, routingReason: "fixture" },
    evidence: [],
    evidenceTrace: [],
    validation: [],
    actions: [],
    decisionCard,
    piiMasked: true,
    generatedAt: "2026-05-17T00:00:00Z"
  };
}
