/**
 * Node.js HTTP server path tests — httpServer shape and handler behaviour.
 *
 * Tests createHvdcServer (MCP protocol) and the httpServer exported from
 * server/src/index.ts without requiring a live port or cloudflare: modules.
 */

import http from "node:http";
import { AddressInfo } from "node:net";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createHvdcServer, HVDC_TOOL_DESCRIPTORS, httpServer } from "../server/src/index.js";

// ─── HTTP integration helpers ─────────────────────────────────────────────────

let baseUrl: string;

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    httpServer.listen(0, "127.0.0.1", () => resolve());
  });
  const addr = httpServer.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${addr.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    httpServer.close((err) => (err ? reject(err) : resolve()))
  );
});

function get(path: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}${path}`, (res) => {
      let body = "";
      res.on("data", (chunk: Buffer) => { body += chunk.toString(); });
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body }));
    }).on("error", reject);
  });
}

function options(path: string): Promise<{ status: number; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const req = http.request(`${baseUrl}${path}`, { method: "OPTIONS" }, (res) => {
      res.resume();
      res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers }));
    });
    req.on("error", reject);
    req.end();
  });
}

// ─── HVDC_TOOL_DESCRIPTORS export ────────────────────────────────────────────

describe("HVDC_TOOL_DESCRIPTORS export", () => {
  it("exports a non-empty object", () => {
    expect(typeof HVDC_TOOL_DESCRIPTORS).toBe("object");
    expect(Object.keys(HVDC_TOOL_DESCRIPTORS).length).toBeGreaterThan(0);
  });

  it("every descriptor value has title and description strings", () => {
    for (const d of Object.values(HVDC_TOOL_DESCRIPTORS)) {
      const desc = d as { title?: string; description?: string };
      expect(typeof desc.title).toBe("string");
      expect(typeof desc.description).toBe("string");
    }
  });

  it("includes ask_hvdc_ontology tool", () => {
    expect("ask_hvdc_ontology" in HVDC_TOOL_DESCRIPTORS).toBe(true);
  });
});

// ─── createHvdcServer re-export ───────────────────────────────────────────────

describe("createHvdcServer re-export", () => {
  it("creates a connectable MCP server", async () => {
    const server = createHvdcServer({});
    const client = new Client({ name: "index-test", version: "0.0.1" });
    const [cT, sT] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(sT), client.connect(cT)]);
    const tools = await client.listTools();
    expect(tools.tools.length).toBeGreaterThan(0);
    await client.close();
    await server.close();
  });
});

// ─── HTTP server: health endpoints ───────────────────────────────────────────

describe("httpServer — health endpoints", () => {
  it("GET / returns 200 with text body", async () => {
    const { status, body } = await get("/");
    expect(status).toBe(200);
    expect(body).toMatch(/HVDC/i);
  });

  it("GET /healthz returns 200", async () => {
    const { status } = await get("/healthz");
    expect(status).toBe(200);
  });

  it("GET /unknown returns 404", async () => {
    const { status } = await get("/unknown-path-xyz");
    expect(status).toBe(404);
  });
});

// ─── HTTP server: CORS preflight ──────────────────────────────────────────────

describe("httpServer — CORS preflight on /mcp", () => {
  it("OPTIONS /mcp returns 204 with CORS headers", async () => {
    const { status, headers } = await options("/mcp");
    expect(status).toBe(204);
    expect(headers["access-control-allow-methods"]).toMatch(/POST/i);
    expect(headers["access-control-allow-headers"]).toMatch(/content-type/i);
  });
});
