import { createMcpHandler } from "agents/mcp";
import type { AuditRecord } from "./answer.js";
import { createHvdcServer } from "./hvdc-server.js";

type Env = {
  ALLOWED_ORIGIN?: string;
  WIDGET_DOMAIN?: string;
  MCP_AUDIT_DB?: D1Database;
  HVDC_FILES?: R2Bucket;
};

const MCP_PATH = "/mcp";

function corsOrigin(env: Env): string {
  return env.ALLOWED_ORIGIN ?? "https://chatgpt.com";
}

async function writeD1Audit(env: Env, record: AuditRecord): Promise<void> {
  if (!env.MCP_AUDIT_DB) return;
  await env.MCP_AUDIT_DB.prepare(
    `INSERT INTO mcp_audit_logs
      (id, tool_name, input_hash, output_hash, pii_masked, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      record.toolName,
      record.inputHash,
      record.outputHash,
      record.piiMasked ? 1 : 0,
      record.timestamp
    )
    .run();
}

function healthResponse(request: Request, env: Env): Response {
  const url = new URL(request.url);
  const payload = {
    service: "hvdc-ontology-chatgpt-app",
    runtime: "cloudflare-workers",
    mcpPath: MCP_PATH,
    storage: {
      r2: Boolean(env.HVDC_FILES),
      d1Audit: Boolean(env.MCP_AUDIT_DB)
    },
    widgetDomain: env.WIDGET_DOMAIN ?? url.origin
  };
  return Response.json(payload, {
    headers: { "Access-Control-Allow-Origin": corsOrigin(env) }
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/healthz")) {
      return healthResponse(request, env);
    }

    const server = createHvdcServer({
      widgetDomain: env.WIDGET_DOMAIN ?? url.origin,
      audit: (record) => writeD1Audit(env, record)
    });
    const handler = createMcpHandler(server, {
      route: MCP_PATH,
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
      corsOptions: {
        origin: corsOrigin(env),
        methods: "POST, GET, DELETE, OPTIONS",
        headers: "content-type, mcp-session-id, mcp-protocol-version",
        exposeHeaders: "Mcp-Session-Id"
      }
    });

    return handler(request, env, ctx);
  }
};
