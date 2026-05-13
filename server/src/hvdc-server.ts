import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { answerQuestion, answerToText, buildAuditRecord, type AuditRecord, validateGrounding } from "./answer.js";
import { searchCorpus } from "./corpus.js";
import { DEFAULT_WIDGET_HTML } from "./generated/widget-html.js";
import { resolveAnyKey, routeQuestion } from "./router.js";
import type { DomainHint, GroundedAnswer } from "./types.js";
import { LEGACY_WIDGET_URI, logUiRenderFailure, PREVIOUS_WIDGET_URI, WIDGET_URI, withUiState } from "./ui.js";

export type HvdcServerOptions = {
  widgetHtml?: string;
  widgetDomain?: string;
  audit?: (record: AuditRecord) => void | Promise<void>;
};

const DEFAULT_WIDGET_DOMAIN = "https://hvdc-ontology-chatgpt-app.mscho715.workers.dev";

const domainEnum = z.enum([
  "master",
  "warehouse",
  "document",
  "marine",
  "cost",
  "material",
  "port",
  "communication",
  "operations",
  "team",
  "compliance"
]);

const evidenceSchema = z.object({
  id: z.string(),
  docId: z.string(),
  title: z.string(),
  version: z.string(),
  sectionPath: z.string(),
  snippet: z.string(),
  docHash: z.string(),
  confidence: z.number(),
  sourceType: z.string()
});

const routeSchema = z.object({
  routeId: z.string(),
  domains: z.array(domainEnum),
  requiredDocs: z.array(z.string()),
  confidence: z.number(),
  routingReason: z.string()
});

const evidenceTraceSchema = z.object({
  targetType: z.enum(["summary", "businessImpact", "detail", "action"]),
  targetIndex: z.number().nullable(),
  answerText: z.string(),
  supportState: z.enum(["SUPPORTED", "NO_DIRECT_EVIDENCE"]),
  evidenceIds: z.array(z.string())
});

const shipmentRuleSchema = z
  .object({
    found: z.boolean(),
    source: z.literal("sample_shipment_rule_engine"),
    supportLevel: z.literal("SECONDARY_SAMPLE_VALIDATION"),
    status: z.enum(["PASS", "INFO", "WARN", "BLOCK"]),
    matchedKey: z.string().nullable(),
    matchedScheme: z.string().nullable().optional(),
    shipmentId: z.string().nullable(),
    currentStage: z.string().nullable().optional(),
    routingPattern: z.string().nullable().optional(),
    missingDocuments: z.array(z.string()).optional(),
    openExceptions: z.array(z.string()).optional(),
    invoiceAudit: z.array(z.record(z.string(), z.unknown())).optional(),
    invoiceExposureAed: z.string().nullable().optional(),
    candidates: z.array(z.string()).optional(),
    risks: z.array(z.record(z.string(), z.unknown())),
    humanGateRequired: z.boolean(),
    message: z.string(),
    unavailableReason: z.string().optional()
  })
  .optional();

const answerOutputSchema = {
  answerId: z.string(),
  verdict: z.enum(["PASS", "WARN", "BLOCK", "INFO", "NO_EVIDENCE"]),
  dataStatus: z.literal("OK"),
  businessResultVisible: z.boolean(),
  fallbackUsed: z.boolean(),
  summary: z.string(),
  businessImpact: z.string(),
  details: z.array(z.string()),
  evidenceIds: z.array(z.string()),
  validationStatus: z.enum(["PASS", "WARN", "BLOCK", "NO_EVIDENCE"]),
  route: routeSchema,
  resolvedEntities: z.array(
    z.object({
      entityType: z.string(),
      identifierScheme: z.string(),
      identifierValue: z.string(),
      normalizedValue: z.string(),
      targetRid: z.string().nullable(),
      confidence: z.number()
    })
  ),
  evidence: z.array(evidenceSchema),
  evidenceTrace: z.array(evidenceTraceSchema).default([]),
  shipmentRule: shipmentRuleSchema,
  validation: z.array(
    z.object({
      ruleId: z.string(),
      reasonCode: z.string(),
      severity: z.string(),
      status: z.string(),
      targetObject: z.string(),
      evidenceIds: z.array(z.string()),
      message: z.string()
    })
  ),
  actions: z.array(
    z.object({
      actionType: z.string(),
      ownerRole: z.string(),
      parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
      humanGateRequired: z.boolean(),
      dueAt: z.string().nullable()
    })
  ),
  graphPath: z
    .object({
      startNode: z.string(),
      edges: z.array(z.object({ from: z.string(), relation: z.string(), to: z.string() })),
      endNode: z.string(),
      pathConfidence: z.number()
    })
    .nullable(),
  ui: z
    .object({
      dataStatus: z.literal("OK"),
      uiRenderStatus: z.enum([
        "READY",
        "RESOURCE_REGISTERED",
        "RESOURCE_LOADED",
        "TOOL_RESULT_RECEIVED",
        "RENDERED",
        "RESOURCE_NOT_REGISTERED",
        "RESOURCE_MIME_INVALID",
        "RESOURCE_CSP_BLOCKED",
        "SCHEMA_MISMATCH",
        "WIDGET_RENDER_ERROR",
        "FALLBACK_RENDERED",
        "TEMPLATE_FETCH_FAILED"
      ]),
      businessResultVisible: z.boolean(),
      fallbackUsed: z.boolean(),
      cardEnabled: z.boolean(),
      templateUrl: z.string(),
      templateVersion: z.string(),
      schemaVersion: z.string(),
      errorCode: z.literal("CARD_TEMPLATE_RENDER_FAILED").optional(),
      errorMessage: z.string().optional(),
      doNotChange: z.array(z.enum(["verdict", "validationStatus", "evidenceIds", "actions"]))
    })
    .optional(),
  piiMasked: z.boolean(),
  generatedAt: z.string()
};

const { ui: _uiOutputSchema, ...answerDataOutputSchema } = answerOutputSchema;

export const HVDC_TOOL_DESCRIPTORS = {
  ask_hvdc_ontology: {
    title: "Ask HVDC ontology",
    description:
      "Use this when the user asks any HVDC logistics question or HVDC logistics email reply/draft request, including '답장 작성하라', '메일 회신 작성', 'draft email', customs clearance, shipping schedule, document request, cost clarification, or attachment-based reply requests. Run it before drafting so ChatGPT surfaces sct_ontology/OntologyReview, evidence, validation, next action, the EmailActionCard, and the HVDC answer card. Email draft content must come from the current user-provided email/thread, not from a prior fixed case.",
    inputSchema: {
      question: z.string().min(1),
      userRole: z.string().default("ops_user").optional(),
      language: z.enum(["ko", "en", "auto"]).default("auto").optional()
    },
    outputSchema: answerDataOutputSchema,
    _meta: {
      ui: { resourceUri: WIDGET_URI, visibility: ["model", "app"] },
      "openai/outputTemplate": WIDGET_URI,
      "openai/widgetAccessible": true,
      "openai/toolInvocation/invoking": "Searching HVDC ontology corpus",
      "openai/toolInvocation/invoked": "HVDC ontology answer ready"
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  render_hvdc_answer_card: {
    title: "Render HVDC answer card",
    description:
      "Use this after every user-visible ask_hvdc_ontology answer to render the final HVDC answer card. Pass through the complete ask_hvdc_ontology structured answer.",
    inputSchema: answerDataOutputSchema,
    outputSchema: answerOutputSchema,
    _meta: {
      ui: { resourceUri: WIDGET_URI, visibility: ["model", "app"] },
      "openai/outputTemplate": WIDGET_URI,
      "openai/widgetAccessible": true,
      "openai/toolInvocation/invoking": "Rendering HVDC answer card",
      "openai/toolInvocation/invoked": "HVDC answer card ready"
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  route_question: {
    title: "Route HVDC question",
    description: "Use this to classify an HVDC question into ontology domains and required corpus documents.",
    inputSchema: {
      question: z.string().min(1),
      userRole: z.string().default("ops_user").optional(),
      language: z.enum(["ko", "en", "auto"]).default("auto").optional()
    },
    outputSchema: { route: routeSchema },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  search_ontology_corpus: {
    title: "Search HVDC ontology corpus",
    description:
      "Use this when you need evidence snippets from approved HVDC ontology documents. Do not use for public web search.",
    inputSchema: {
      query: z.string().min(1),
      requiredDocs: z.array(z.string()).optional(),
      domainHints: z.array(domainEnum).optional(),
      topK: z.number().min(1).max(20).default(8).optional()
    },
    outputSchema: { evidence: z.array(evidenceSchema) },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  resolve_any_key: {
    title: "Resolve HVDC any-key",
    description: "Use this to resolve BL, BOE, DO, invoice, HVDC code, site, or milestone identifiers from a user question.",
    inputSchema: { identifierOrQuestion: z.string().min(1) },
    outputSchema: {
      candidates: z.array(
        z.object({
          entityType: z.string(),
          identifierScheme: z.string(),
          identifierValue: z.string(),
          normalizedValue: z.string(),
          targetRid: z.string().nullable(),
          confidence: z.number()
        })
      )
    },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  },
  validate_answer: {
    title: "Validate HVDC answer grounding",
    description: "Use this to validate evidence coverage, master spine use, currentness, and human-gate requirements before final answer.",
    inputSchema: {
      question: z.string().min(1),
      evidenceIds: z.array(z.string()).optional()
    },
    outputSchema: {
      findings: z.array(
        z.object({
          ruleId: z.string(),
          reasonCode: z.string(),
          severity: z.string(),
          status: z.string(),
          targetObject: z.string(),
          evidenceIds: z.array(z.string()),
          message: z.string()
        })
      )
    },
    _meta: {},
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  }
};

export type HvdcToolName = keyof typeof HVDC_TOOL_DESCRIPTORS;

function buildRenderResultMeta(answer: GroundedAnswer): Record<string, unknown> {
  return {
    "openai/outputTemplate": WIDGET_URI,
    uiTemplate: WIDGET_URI,
    piiMasked: answer.piiMasked,
    ui: {
      ...answer.ui,
      resourceUri: WIDGET_URI,
      visibility: ["model", "app"]
    }
  };
}

function buildAskResultMeta(answer: GroundedAnswer): Record<string, unknown> {
  return {
    "openai/outputTemplate": WIDGET_URI,
    uiTemplate: WIDGET_URI,
    piiMasked: answer.piiMasked,
    ui: {
      resourceUri: WIDGET_URI,
      visibility: ["model", "app"]
    }
  };
}

export function createHvdcServer(options: HvdcServerOptions = {}): McpServer {
  const server = new McpServer({ name: "hvdc-ontology-answer-app", version: "0.1.0" });
  const widgetHtml = options.widgetHtml ?? DEFAULT_WIDGET_HTML;
  const widgetDomain = options.widgetDomain ?? DEFAULT_WIDGET_DOMAIN;
  const renderToolWidgetAliasUri = "ui://hvdc/render_hvdc_answer_card.html";
  const widgetResourceMeta = {
    ui: {
      prefersBorder: true,
      domain: widgetDomain,
      csp: {
        connectDomains: [],
        resourceDomains: []
      }
    },
    "openai/widgetDescription": "HVDC ontology answer card showing verdict, route documents, evidence, validation findings, and next action.",
    "openai/widgetPrefersBorder": true,
    "openai/widgetDomain": widgetDomain,
    "openai/widgetCSP": {
      connect_domains: [],
      resource_domains: [],
      frame_domains: [],
      redirect_domains: []
    }
  };
  const createWidgetResource = (uri: string) => ({
    contents: [
      {
        uri,
        mimeType: RESOURCE_MIME_TYPE,
        text: widgetHtml,
        _meta: widgetResourceMeta
      }
    ]
  });

  registerAppResource(server, "hvdc-answer-widget", WIDGET_URI, {}, async () => createWidgetResource(WIDGET_URI));
  registerAppResource(
    server,
    "hvdc-answer-widget-v6-compat",
    PREVIOUS_WIDGET_URI,
    {},
    async () => createWidgetResource(PREVIOUS_WIDGET_URI)
  );
  registerAppResource(
    server,
    "hvdc-answer-widget-legacy",
    LEGACY_WIDGET_URI,
    {},
    async () => createWidgetResource(LEGACY_WIDGET_URI)
  );
  registerAppResource(
    server,
    "render_hvdc_answer_card",
    renderToolWidgetAliasUri,
    {},
    async () => createWidgetResource(renderToolWidgetAliasUri)
  );

  registerAppTool(
    server,
    "ask_hvdc_ontology",
    HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology,
    async ({ question, userRole, language }) => {
      const answer = answerQuestion({ question, userRole, language });
      await options.audit?.(buildAuditRecord("ask_hvdc_ontology", { question, userRole, language }, answer, answer.piiMasked));
      return {
        structuredContent: answer,
        content: [{ type: "text", text: answerToText(answer) }],
        _meta: buildAskResultMeta(answer)
      };
    }
  );

  registerAppTool(
    server,
    "render_hvdc_answer_card",
    HVDC_TOOL_DESCRIPTORS.render_hvdc_answer_card,
    async (answer) => {
      try {
        const groundedAnswer = withUiState({ ...answer, evidenceTrace: answer.evidenceTrace ?? [] } as GroundedAnswer);
        return {
          structuredContent: groundedAnswer,
          content: [{ type: "text", text: answerToText(groundedAnswer) }],
          _meta: buildRenderResultMeta(groundedAnswer)
        };
      } catch (error) {
        const renderError = error instanceof Error ? error : new Error(String(error));
        const fallbackAnswer = withUiState(
          { ...answer, evidenceTrace: answer.evidenceTrace ?? [] } as GroundedAnswer,
          "TEMPLATE_FETCH_FAILED",
          renderError.message
        );
        logUiRenderFailure(fallbackAnswer, renderError);
        return {
          structuredContent: fallbackAnswer,
          content: [{ type: "text", text: answerToText(fallbackAnswer) }],
          _meta: buildRenderResultMeta(fallbackAnswer)
        };
      }
    }
  );

  registerAppTool(
    server,
    "route_question",
    HVDC_TOOL_DESCRIPTORS.route_question,
    async ({ question, userRole, language }) => {
      const route = routeQuestion(question, userRole, language);
      return {
        structuredContent: { route },
        content: [{ type: "text", text: JSON.stringify(route) }]
      };
    }
  );

  registerAppTool(
    server,
    "search_ontology_corpus",
    HVDC_TOOL_DESCRIPTORS.search_ontology_corpus,
    async ({ query, requiredDocs, domainHints, topK }) => {
      const evidence = searchCorpus({
        query,
        requiredDocs,
        domainHints: domainHints as DomainHint[] | undefined,
        topK
      });
      return {
        structuredContent: { evidence },
        content: [{ type: "text", text: JSON.stringify({ evidenceCount: evidence.length }) }]
      };
    }
  );

  registerAppTool(
    server,
    "resolve_any_key",
    HVDC_TOOL_DESCRIPTORS.resolve_any_key,
    async ({ identifierOrQuestion }) => {
      const candidates = resolveAnyKey(identifierOrQuestion);
      return {
        structuredContent: { candidates },
        content: [{ type: "text", text: JSON.stringify({ candidateCount: candidates.length }) }]
      };
    }
  );

  registerAppTool(
    server,
    "validate_answer",
    HVDC_TOOL_DESCRIPTORS.validate_answer,
    async ({ question }) => {
      const route = routeQuestion(question);
      const evidence = searchCorpus({ query: question, requiredDocs: route.requiredDocs, domainHints: route.domains });
      const resolvedEntities = resolveAnyKey(question);
      const findings = validateGrounding({ question, route, evidence, resolvedEntities });
      return {
        structuredContent: { findings },
        content: [{ type: "text", text: JSON.stringify({ findingCount: findings.length }) }]
      };
    }
  );

  return server;
}
