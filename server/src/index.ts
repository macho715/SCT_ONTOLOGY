import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { answerQuestion, answerToText, validateGrounding } from "./answer.js";
import { searchCorpus } from "./corpus.js";
import { resolveAnyKey, routeQuestion } from "./router.js";
import type { DomainHint } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const widgetHtml = readFileSync(path.join(ROOT_DIR, "public", "hvdc-answer-widget.html"), "utf8");
const WIDGET_URI = "ui://hvdc/answer-card.html";

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

const answerOutputSchema = {
  answerId: z.string(),
  verdict: z.enum(["PASS", "WARN", "BLOCK", "INFO", "NO_EVIDENCE"]),
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
      parameters: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
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
  piiMasked: z.boolean(),
  generatedAt: z.string()
};

export const HVDC_TOOL_DESCRIPTORS = {
  ask_hvdc_ontology: {
    title: "Ask HVDC ontology",
    description:
      "Use this when the user asks an HVDC logistics question that must be answered from the approved ontology corpus with evidence, validation, and next action.",
    inputSchema: {
      question: z.string().min(1),
      userRole: z.string().default("ops_user").optional(),
      language: z.enum(["ko", "en", "auto"]).default("auto").optional()
    },
    outputSchema: answerOutputSchema,
    _meta: {
      ui: { resourceUri: WIDGET_URI },
      "openai/outputTemplate": WIDGET_URI,
      "openai/toolInvocation/invoking": "Searching HVDC ontology corpus",
      "openai/toolInvocation/invoked": "HVDC ontology answer ready"
    },
    annotations: {
      readOnlyHint: false,
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
    _meta: {
      ui: { resourceUri: WIDGET_URI }
    },
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

export function createHvdcServer(): McpServer {
  const server = new McpServer({ name: "hvdc-ontology-answer-app", version: "0.1.0" });

  registerAppResource(server, "hvdc-answer-widget", WIDGET_URI, {}, async () => ({
    contents: [
      {
        uri: WIDGET_URI,
        mimeType: RESOURCE_MIME_TYPE,
        text: widgetHtml,
        _meta: {
          ui: {
            prefersBorder: true,
            csp: {
              connect_domains: [],
              resource_domains: []
            }
          }
        }
      }
    ]
  }));

  registerAppTool(
    server,
    "ask_hvdc_ontology",
    HVDC_TOOL_DESCRIPTORS.ask_hvdc_ontology,
    async ({ question, userRole, language }) => {
      const answer = answerQuestion({ question, userRole, language });
      return {
        structuredContent: answer,
        content: [{ type: "text", text: answerToText(answer) }],
        _meta: { uiTemplate: WIDGET_URI, piiMasked: answer.piiMasked }
      };
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
        content: [{ type: "text", text: JSON.stringify({ evidenceCount: evidence.length }) }],
        _meta: { uiTemplate: WIDGET_URI }
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
      const findings = validateGrounding({ question, route, evidence });
      return {
        structuredContent: { findings },
        content: [{ type: "text", text: JSON.stringify({ findingCount: findings.length }) }]
      };
    }
  );

  return server;
}

const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";

export const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id"
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" }).end("HVDC Ontology ChatGPT App MCP server");
    return;
  }

  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    const server = createHvdcServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("Error handling MCP request", error);
      if (!res.headersSent) res.writeHead(500).end("Internal server error");
    }
    return;
  }

  res.writeHead(404).end("Not Found");
});

export function startHvdcHttpServer() {
  return httpServer.listen(port, () => {
    console.log(`HVDC Ontology MCP server listening on http://localhost:${port}${MCP_PATH}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startHvdcHttpServer();
}
