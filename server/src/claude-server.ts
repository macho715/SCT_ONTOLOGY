import { createServer } from "node:http";
import { fileURLToPath, pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { answerQuestion, answerToText, validateGrounding } from "./answer.js";
import { searchCorpus } from "./corpus.js";
import { resolveAnyKey, routeQuestion } from "./router.js";
import type { DomainHint, GroundedAnswer } from "./types.js";
import { parseGroundedAnswer, renderAnswerMarkdown } from "./claude-render.js";

const domainEnum = z.enum([
  "system",
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

const intentEnum = z.enum([
  "SYSTEM_DIAGNOSTIC",
  "ONTOLOGY_PATCH_REVIEW",
  "CARD_RENDERING_AUDIT",
  "LOGISTICS_DECISION",
  "EMAIL_DRAFT",
  "COST_GUARD",
  "DOCUMENT_GUARDIAN",
  "GENERAL_ANSWER"
]);

const approvalSchema = z.object({
  approvedByRole: z.string().min(2).max(80),
  approvalRef: z.string().min(3).max(120),
  reason: z.string().min(5).max(500)
});

const protectedOutputSchema = {
  status: z.enum(["AUTH_REQUIRED", "STORAGE_UNAVAILABLE"]),
  humanGateRequired: z.literal(true),
  message: z.string(),
  requiredScopes: z.array(z.string()).optional()
};

const evidenceScoreSchema = z.object({
  evidenceId: z.string(),
  intentRelevance: z.number(),
  domainSpecificity: z.number(),
  directSupport: z.number(),
  authorityLevel: z.number(),
  operationalActionability: z.number(),
  recency: z.number(),
  finalScore: z.number(),
  supportState: z.enum(["SUPPORTED", "PARTIAL", "NO_DIRECT_EVIDENCE", "CONTRADICTED"])
});

const evidenceSchema = z.object({
  id: z.string(),
  docId: z.string(),
  title: z.string(),
  version: z.string(),
  sectionPath: z.string(),
  snippet: z.string(),
  docHash: z.string(),
  confidence: z.number(),
  evidenceScore: evidenceScoreSchema.optional(),
  sourceType: z.string()
});

const routeSchema = z.object({
  routeId: z.string(),
  intent: intentEnum,
  domains: z.array(domainEnum),
  requiredDocs: z.array(z.string()),
  rulePackIds: z.array(z.string()),
  allowedActions: z.array(z.string()),
  blockedActions: z.array(z.string()),
  confidence: z.number(),
  routingReason: z.string()
});

const evidenceTraceSchema = z.object({
  targetType: z.enum(["summary", "businessImpact", "detail", "action"]),
  targetIndex: z.number().nullable(),
  answerText: z.string(),
  supportState: z.enum(["SUPPORTED", "PARTIAL", "NO_DIRECT_EVIDENCE", "CONTRADICTED"]),
  evidenceIds: z.array(z.string())
});

const decisionCardSchema = z.object({
  schemaVersion: z.literal("sct.card.v2"),
  cardId: z.string(),
  routeId: z.string(),
  intent: intentEnum,
  generatedAt: z.string(),
  verdict: z.enum(["PASS", "WARN", "BLOCK"]),
  severity: z.enum(["P0", "P1", "P2"]),
  primaryReason: z.string(),
  unblockSummary: z.string(),
  piiStatus: z.enum(["None", "Masked", "Risk"]),
  dataClass: z.enum(["P0", "P1", "P2"]),
  blockedBy: z.array(
    z.object({
      ruleId: z.string(),
      ruleName: z.string(),
      reason: z.string(),
      requiredInputs: z.array(z.string()),
      missingInputs: z.array(z.string()),
      blockedActions: z.array(z.string()),
      severity: z.enum(["P0", "P1", "P2"])
    })
  ),
  allowedActions: z.array(z.string()),
  blockedActions: z.array(z.string()),
  allowedNow: z.array(z.string()),
  blockedUntilApproved: z.array(z.string()),
  humanGateState: z.enum([
    "READ_ONLY",
    "DRY_RUN",
    "APPROVAL_REQUESTED",
    "APPROVED_ACTION",
    "EXECUTED",
    "AUDITED",
    "DENIED",
    "CANCELLED",
    "EXPIRED",
    "NEEDS_REVIEW"
  ]),
  evidenceCoverage: z.array(
    z.object({
      domain: z.string(),
      status: z.enum(["PASS", "WARN", "BLOCK"]),
      required: z.number(),
      available: z.number(),
      directSupportRatio: z.number()
    })
  ),
  actions: z.array(
    z.object({
      actionId: z.string(),
      ownerRole: z.string(),
      ownerNameMasked: z.string().nullable(),
      actionType: z.string(),
      actionLabel: z.string(),
      requiredInput: z.string().nullable(),
      approvalRequired: z.boolean(),
      approvalStatus: z.enum(["NotRequired", "Pending", "Approved", "Rejected", "Expired"]),
      status: z.enum(["Open", "Pending Input", "Pending Approval", "Done", "Rejected", "Expired", "Unassigned"]),
      evidenceIds: z.array(z.string()),
      blockedUntil: z.array(z.string()),
      dueBasis: z.string(),
      dueAt: z.string().nullable()
    })
  ),
  trace: z.object({
    sourceHash: z.string(),
    rulePackVersion: z.string(),
    rulePackIds: z.array(z.string()),
    promptVersion: z.string(),
    approvalActor: z.string().nullable(),
    approvalStatus: z.enum(["NotRequired", "Pending", "Approved", "Rejected", "Expired"]),
    sensitiveAccessed: z.boolean(),
    generatedAt: z.string(),
    routeId: z.string()
  })
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
  evidenceTrace: z.array(evidenceTraceSchema).default([]),
  decisionCard: decisionCardSchema.optional(),
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
  piiMasked: z.boolean(),
  generatedAt: z.string()
};

export const HVDC_CLAUDE_TOOL_NAMES = [
  "ask_hvdc_ontology",
  "create_upload_url",
  "complete_upload",
  "attach_uploaded_file",
  "render_hvdc_answer_card",
  "route_question",
  "search_ontology_corpus",
  "resolve_any_key",
  "validate_answer",
  "write_file_dry_run",
  "write_file_commit"
] as const;

export function createClaudeServer(): McpServer {
  const server = new McpServer({ name: "hvdc-ontology-claude-app", version: "0.1.0" });
  const authRequired = (requiredScopes: string[]) => ({
    structuredContent: {
      status: "AUTH_REQUIRED",
      humanGateRequired: true,
      requiredScopes,
      message: `Use the Cloudflare remote MCP endpoint with OAuth Bearer scope ${requiredScopes.join(" ")}.`
    },
    content: [
      {
        type: "text" as const,
        text: `AUTH_REQUIRED: OAuth Bearer scope ${requiredScopes.join(" ")} is required on the Cloudflare remote MCP endpoint.`
      }
    ]
  });

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

  server.tool(
    "create_upload_url",
    "Create a Human-gate approved R2 upload URL. Local fallback requires Cloudflare remote MCP OAuth Bearer scope files:upload.",
    {
      fileName: z.string().min(1).max(240),
      mimeType: z.string().min(3).max(120),
      byteLength: z.number().int().min(0).max(100 * 1024 * 1024).optional(),
      purpose: z.enum(["evidence_attachment", "source_document", "audit_support", "ops_working_file"]),
      ttlSeconds: z.number().int().min(60).max(3600).default(600).optional(),
      approval: approvalSchema
    },
    async () => authRequired(["files:upload"])
  );

  server.tool(
    "complete_upload",
    "Complete a Human-gate approved R2 upload. Local fallback requires Cloudflare remote MCP OAuth Bearer scope files:upload.",
    {
      uploadId: z.string().min(8).max(160),
      approval: approvalSchema
    },
    async () => authRequired(["files:upload"])
  );

  server.tool(
    "attach_uploaded_file",
    "Attach an uploaded file to an HVDC target. Local fallback requires Cloudflare remote MCP OAuth Bearer scope files:write.",
    {
      uploadId: z.string().min(8).max(160),
      targetType: z.enum(["ShipmentUnit", "Document", "Invoice", "CommunicationEvent", "AuditRecord", "Other"]),
      targetRef: z.string().min(1).max(160),
      evidenceNote: z.string().min(5).max(500),
      approval: approvalSchema
    },
    async () => authRequired(["files:write"])
  );

  server.tool(
    "write_file_dry_run",
    "Create a Human-gate approved write dry-run proposal. Local fallback requires Cloudflare remote MCP OAuth Bearer scope files:write.",
    {
      targetPath: z.string().min(1).max(240),
      content: z.string().min(1).max(512 * 1024),
      baseContentHash: z.string().max(128).optional(),
      changeReason: z.string().min(5).max(500),
      approval: approvalSchema
    },
    async () => authRequired(["files:write"])
  );

  server.tool(
    "write_file_commit",
    "Commit a Human-gate approved write dry-run proposal. Local fallback requires Cloudflare remote MCP OAuth Bearer scope files:write.",
    {
      proposalId: z.string().min(8).max(160),
      commitReason: z.string().min(5).max(500),
      approval: approvalSchema
    },
    async () => authRequired(["files:write"])
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

export async function startClaudeStdioServer() {
  const server = createClaudeServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] === "--stdio") {
    startClaudeStdioServer().catch((e) => { console.error(e); process.exit(1); });
  } else {
    startClaudeHttpServer();
  }
}
