import { describe, it, expect, vi } from "vitest";
import { applyRateLimit, parseMcpToolName } from "../server/src/rate-limit.js";

type LimitResult = { success: boolean; limit: number; remaining: number; reset: number };

type TestEnv = {
  RATE_LIMIT_ENABLED?: string;
  RATE_LIMITER?: { limit: (options: { key: string }) => Promise<LimitResult> };
  RATE_LIMITER_IP?: { limit: (options: { key: string }) => Promise<LimitResult> };
  RATE_LIMITER_TOOL?: { limit: (options: { key: string }) => Promise<LimitResult> };
};

function makeResult(overrides: Partial<LimitResult> = {}): LimitResult {
  return {
    success: true,
    limit: 200,
    remaining: 10,
    reset: 60,
    ...overrides
  };
}

describe("applyRateLimit", () => {
  it("returns null when RATE_LIMIT_ENABLED is false", async () => {
    const request = new Request("https://example.test/mcp", {
      method: "POST",
      headers: { Authorization: "Bearer bad-token" }
    });
    const env: TestEnv = {
      RATE_LIMIT_ENABLED: "false",
      RATE_LIMITER: {
        limit: vi.fn(async () => makeResult({ success: false }))
      }
    };
    const response = await applyRateLimit(request, env as never, null);
    expect(response).toBeNull();
    expect(env.RATE_LIMITER?.limit).not.toHaveBeenCalled();
  });

  it("allows requests when token limiter allows", async () => {
    const request = new Request("https://example.test/mcp", {
      method: "POST",
      headers: {
        Authorization: "Bearer token-123",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "initialize"
      })
    });
    const env: TestEnv = {
      RATE_LIMITER: {
        limit: vi.fn(async () => makeResult({ success: true, remaining: 99 }))
      },
      RATE_LIMITER_TOOL: {
        limit: vi.fn(async () => makeResult({ success: true, remaining: 9 }))
      }
    };
    const response = await applyRateLimit(request, env as never, "ask_hvdc_ontology");
    expect(response).toBeNull();
    expect(env.RATE_LIMITER?.limit).toHaveBeenCalledWith({ key: "token:token-123" });
    expect(env.RATE_LIMITER_TOOL?.limit).toHaveBeenCalledWith({ key: "token:token-123:tool:ask_hvdc_ontology" });
  });

  it("rejects when token limiter fails", async () => {
    const request = new Request("https://example.test/mcp", {
      method: "POST",
      headers: {
        Authorization: "Bearer token-200",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: { name: "ask_hvdc_ontology" }
      })
    });
    const env: TestEnv = {
      RATE_LIMITER: {
        limit: vi.fn(async () => makeResult({ success: false, remaining: 0, reset: 60, limit: 200 }))
      },
      RATE_LIMITER_TOOL: {
        limit: vi.fn(async () => makeResult({ success: true }))
      }
    };
    const response = await applyRateLimit(request, env as never, "ask_hvdc_ontology");
    expect(response).not.toBeNull();
    expect(response?.status).toBe(429);
    const payload = await response?.json();
    expect(payload).toMatchObject({
      error: "rate_limited",
      retryAfter: 60
    });
    expect(response?.headers.get("X-RateLimit-Reason")).toBe("token");
    expect(response?.headers.get("Retry-After")).toBe("60");
  });

  it("rejects ask_hvdc_ontology when tool limiter fails", async () => {
    const request = new Request("https://example.test/mcp", {
      method: "POST",
      headers: {
        Authorization: "Bearer token-tool",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: { name: "ask_hvdc_ontology" }
      })
    });
    const env: TestEnv = {
      RATE_LIMITER: {
        limit: vi.fn(async () => makeResult({ success: true, remaining: 10 }))
      },
      RATE_LIMITER_TOOL: {
        limit: vi.fn(async () => makeResult({
          success: false,
          limit: 10,
          remaining: 0,
          reset: 3600
        }))
      }
    };
    const response = await applyRateLimit(request, env as never, "ask_hvdc_ontology");
    expect(response).not.toBeNull();
    expect(response?.status).toBe(429);
    const payload = await response?.json();
    expect(payload).toMatchObject({
      error: "rate_limited"
    });
    expect(response?.headers.get("X-RateLimit-Reason")).toBe("tool");
    expect(response?.headers.get("Retry-After")).toBe("3600");
    expect(env.RATE_LIMITER_TOOL?.limit).toHaveBeenCalledWith({ key: "token:token-tool:tool:ask_hvdc_ontology" });
  });

  it("uses fallback headers when Cloudflare returns sparse limiter failure", async () => {
    const request = new Request("https://example.test/mcp", {
      method: "POST",
      headers: {
        Authorization: "Bearer token-sparse",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: { name: "ask_hvdc_ontology" }
      })
    });
    const env: TestEnv = {
      RATE_LIMITER: {
        limit: vi.fn(async () => makeResult({ success: true, remaining: 10 }))
      },
      RATE_LIMITER_TOOL: {
        limit: vi.fn(async () => ({ success: false }) as LimitResult)
      }
    };
    const response = await applyRateLimit(request, env as never, "ask_hvdc_ontology");
    const payload = await response?.json();
    expect(response?.status).toBe(429);
    expect(payload).toMatchObject({
      error: "rate_limited",
      retryAfter: 3600
    });
    expect(response?.headers.get("X-RateLimit-Limit")).toBe("10");
    expect(response?.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response?.headers.get("Retry-After")).toBe("3600");
  });

  it("falls back to IP limiter when token is missing", async () => {
    const request = new Request("https://example.test/mcp", {
      method: "POST",
      headers: {
        "cf-connecting-ip": "10.0.0.9",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call"
      })
    });
    const env: TestEnv = {
      RATE_LIMITER_IP: {
        limit: vi.fn(async () => makeResult({ success: false, remaining: 0, reset: 120, limit: 2000 }))
      }
    };
    const response = await applyRateLimit(request, env as never, "check_mosb_gate");
    expect(response).not.toBeNull();
    expect(response?.status).toBe(429);
    const payload = await response?.json();
    expect(payload).toMatchObject({
      error: "rate_limited",
      retryAfter: 120
    });
    expect(response?.headers.get("X-RateLimit-Reason")).toBe("ip");
    expect(response?.headers.get("X-RateLimit-Limit")).toBe("2000");
  });

  it("returns null for non /mcp requests", async () => {
    const request = new Request("https://example.test/healthz", {
      method: "GET"
    });
    const env: TestEnv = {
      RATE_LIMITER: {
        limit: vi.fn(async () => makeResult({ success: false }))
      }
    };
    const response = await applyRateLimit(request, env as never, null);
    expect(response).toBeNull();
  });
});

describe("parseMcpToolName", () => {
  it("returns null when content type is not JSON", async () => {
    const request = new Request("https://example.test/mcp", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "hello"
    });
    const toolName = await parseMcpToolName(request);
    expect(toolName).toBeNull();
  });

  it("extracts tool name for tools/call payload", async () => {
    const request = new Request("https://example.test/mcp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: { name: "ask_hvdc_ontology" }
      })
    });
    const toolName = await parseMcpToolName(request);
    expect(toolName).toBe("ask_hvdc_ontology");
  });

  it("returns null for initialize payload", async () => {
    const request = new Request("https://example.test/mcp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "initialize",
        params: {}
      })
    });
    const toolName = await parseMcpToolName(request);
    expect(toolName).toBeNull();
  });
});
