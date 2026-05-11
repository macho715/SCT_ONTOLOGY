import { createServer } from "node:http";
import { fileURLToPath, pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { answerQuestion, answerToText, validateGrounding } from "./answer.js";
import { searchCorpus } from "./corpus.js";
import { resolveAnyKey, routeQuestion } from "./router.js";
import type { DomainHint, GroundedAnswer } from "./types.js";
import { parseGroundedAnswer, renderAnswerMarkdown } from "./claude-render.js";

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

export const HVDC_CLAUDE_TOOL_NAMES = [
  "ask_hvdc_ontology",
  "render_hvdc_answer_card",
  "route_question",
  "search_ontology_corpus",
  "resolve_any_key",
  "validate_answer"
] as const;

export function createClaudeServer(): McpServer {
  const server = new McpServer({ name: "hvdc-ontology-claude-app", version: "0.1.0" });

  server.tool(
    "ask_hvdc_ontology",
    "HVDC logistics question answered from ontology corpus with evidence, validation, and next action. Use this when the user asks an HVDC project logistics question.",
    {
      question: z.string().min(1),
      userRole: z.string().default("ops_user").optional(),
      language: z.enum(["ko", "en", "auto"]).default("auto").optional()
    },
    async ({ question, userRole, language }) => {
      const answer = answerQuestion({ question, userRole, language });
      return {
        structuredContent: answer,
        content: [{ type: "text", text: renderAnswerMarkdown(answer) }]
      };
    }
  );

  server.tool(
    "render_hvdc_answer_card",
    "Render HVDC answer card as markdown. Accepts both ChatGPT-format (with openai/_meta) and Claude-format GroundedAnswer. Pass the complete ask_hvdc_ontology output.",
    answerOutputSchema,
    async (input) => {
      const answer = parseGroundedAnswer(input);
      return {
        structuredContent: answer,
        content: [{ type: "text", text: renderAnswerMarkdown(answer) }]
      };
    }
  );

  server.tool(
    "route_question",
    "Classify an HVDC logistics question into ontology domains and required corpus documents.",
    {
      question: z.string().min(1),
      userRole: z.string().default("ops_user").optional(),
      language: z.enum(["ko", "en", "auto"]).default("auto").optional()
    },
    async ({ question, userRole, language }) => {
      const route = routeQuestion(question, userRole, language);
      return {
        structuredContent: { route },
        content: [{ type: "text", text: JSON.stringify(route, null, 2) }]
      };
    }
  );

  server.tool(
    "search_ontology_corpus",
    "Retrieve evidence snippets from approved HVDC ontology documents. Do not use for public web search.",
    {
      query: z.string().min(1),
      requiredDocs: z.array(z.string()).optional(),
      domainHints: z.array(domainEnum).optional(),
      topK: z.number().min(1).max(20).default(8).optional()
    },
    async ({ query, requiredDocs, domainHints, topK }) => {
      const evidence = searchCorpus({
        query,
        requiredDocs,
        domainHints: domainHints as DomainHint[] | undefined,
        topK
      });
      return {
        structuredContent: { evidence },
        content: [{ type: "text", text: JSON.stringify({ evidenceCount: evidence.length }, null, 2) }]
      };
    }
  );

  server.tool(
    "resolve_any_key",
    "Resolve BL, BOE, DO, invoice, HVDC code, site, or milestone identifiers from a user question.",
    { identifierOrQuestion: z.string().min(1) },
    async ({ identifierOrQuestion }) => {
      const candidates = resolveAnyKey(identifierOrQuestion);
      return {
        structuredContent: { candidates },
        content: [{ type: "text", text: JSON.stringify({ candidateCount: candidates.length }, null, 2) }]
      };
    }
  );

  server.tool(
    "validate_answer",
    "Validate evidence coverage, master spine use, currentness, and human-gate requirements before final answer.",
    {
      question: z.string().min(1),
      evidenceIds: z.array(z.string()).optional()
    },
    async ({ question }) => {
      const route = routeQuestion(question);
      const evidence = searchCorpus({ query: question, requiredDocs: route.requiredDocs, domainHints: route.domains });
      const findings = validateGrounding({ question, route, evidence });
      return {
        structuredContent: { findings },
        content: [{ type: "text", text: JSON.stringify({ findingCount: findings.length }, null, 2) }]
      };
    }
  );

  return server;
}

const port = Number(process.env.CLAUDE_PORT ?? 8788);
const MCP_PATH = "/mcp";

export const claudeHttpServer = createServer(async (req, res) => {
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
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" }).end("HVDC Ontology Claude App MCP server");
    return;
  }

  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    const server = createClaudeServer();
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
      console.error("Error handling Claude MCP request", error);
      if (!res.headersSent) res.writeHead(500).end("Internal server error");
    }
    return;
  }

  res.writeHead(404).end("Not Found");
});

export function startClaudeHttpServer() {
  return claudeHttpServer.listen(port, () => {
    console.log(`HVDC Ontology Claude MCP server listening on http://localhost:${port}${MCP_PATH}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startClaudeHttpServer();
}
