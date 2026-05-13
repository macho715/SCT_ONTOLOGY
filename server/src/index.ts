import { appendFileSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { type AuditRecord, auditRecordToJsonLine } from "./answer.js";
import { createHvdcServer, HVDC_TOOL_DESCRIPTORS } from "./hvdc-server.js";

export { createHvdcServer, HVDC_TOOL_DESCRIPTORS };

const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";

function localFileAudit(record: AuditRecord): void {
  const outDir = path.resolve(process.cwd(), "out");
  mkdirSync(outDir, { recursive: true });
  appendFileSync(path.join(outDir, "audit.jsonl"), auditRecordToJsonLine(record), "utf8");
}

export const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  const allowedOrigin = process.env.NODE_ENV === "production"
    ? (process.env.ALLOWED_ORIGIN ?? "https://chatgpt.com")
    : "*";

  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id"
    });
    res.end();
    return;
  }

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/healthz")) {
    res
      .writeHead(200, { "content-type": "text/plain; charset=utf-8" })
      .end("HVDC Ontology Cloudflare-ready MCP server");
    return;
  }

  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    const server = createHvdcServer({
      widgetDomain: process.env.WIDGET_DOMAIN,
      audit: localFileAudit
    });
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
