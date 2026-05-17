import { describe, it, expect, vi } from "vitest";
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createHvdcServer } from "../server/src/index.js";
import { withSpan } from "../server/src/telemetry.js";
import { resolveTelemetryConfig } from "../server/src/telemetry.js";

describe("withSpan", () => {
  it("creates a span named mcp.<toolName> and ends it on success", async () => {
    const spans: Array<{ name: string; status: { code: number } }> = [];
    const mockTracer = {
      startActiveSpan: vi.fn(async (name: string, fn: (span: unknown) => Promise<unknown>) => {
        const span = {
          setAttribute: vi.fn(),
          setStatus: vi.fn((s: { code: number }) => { spans.push({ name, status: s }); }),
          end: vi.fn(),
          recordException: vi.fn()
        };
        return fn(span);
      })
    };
    vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer as never);

    const result = await withSpan("test_tool", async (span) => {
      span.setAttribute("test", "value");
      return "ok";
    });

    expect(result).toBe("ok");
    expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
      "mcp.test_tool", expect.any(Function)
    );
    expect(spans[0].status.code).toBe(SpanStatusCode.OK);
    vi.restoreAllMocks();
  });

  it("records exception and sets ERROR status on throw", async () => {
    const mockSpan = {
      setAttribute: vi.fn(),
      setStatus: vi.fn(),
      end: vi.fn(),
      recordException: vi.fn()
    };
    const mockTracer = {
      startActiveSpan: vi.fn(async (_name: string, fn: (span: unknown) => Promise<unknown>) => fn(mockSpan))
    };
    vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer as never);

    await expect(
      withSpan("fail_tool", async () => { throw new Error("boom"); })
    ).rejects.toThrow("boom");

    expect(mockSpan.recordException).toHaveBeenCalled();
    expect(mockSpan.setStatus).toHaveBeenCalledWith(
      expect.objectContaining({ code: SpanStatusCode.ERROR })
    );
    expect(mockSpan.end).toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("sets mcp.tool.name attribute on the span with the exact tool name value", async () => {
    const setAttributeCalls: Array<[string, unknown]> = [];
    const mockSpan = {
      setAttribute: vi.fn((key: string, val: unknown) => { setAttributeCalls.push([key, val]); }),
      setStatus: vi.fn(),
      end: vi.fn(),
      recordException: vi.fn()
    };
    const mockTracer = {
      startActiveSpan: vi.fn(async (_name: string, fn: (span: unknown) => Promise<unknown>) => fn(mockSpan))
    };
    vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer as never);

    await withSpan("my_tool", async () => "result");

    expect(setAttributeCalls).toContainEqual(["mcp.tool.name", "my_tool"]);
    vi.restoreAllMocks();
  });

  it("calls span.end() exactly once on the success path", async () => {
    const mockSpan = {
      setAttribute: vi.fn(),
      setStatus: vi.fn(),
      end: vi.fn(),
      recordException: vi.fn()
    };
    const mockTracer = {
      startActiveSpan: vi.fn(async (_name: string, fn: (span: unknown) => Promise<unknown>) => fn(mockSpan))
    };
    vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer as never);

    await withSpan("end_test", async () => 42);

    expect(mockSpan.end).toHaveBeenCalledTimes(1);
    vi.restoreAllMocks();
  });

  it("calls trace.getTracer with service name 'hvdc-mcp'", async () => {
    const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue({
      startActiveSpan: vi.fn(async (_name: string, fn: (span: unknown) => Promise<unknown>) =>
        fn({ setAttribute: vi.fn(), setStatus: vi.fn(), end: vi.fn(), recordException: vi.fn() })
      )
    } as never);

    await withSpan("svc_name_test", async () => "x");

    expect(getTracerSpy).toHaveBeenCalledWith("hvdc-mcp");
    vi.restoreAllMocks();
  });
});

describe("resolveTelemetryConfig", () => {
  it("returns Axiom endpoint and headers when AXIOM_TOKEN is provided", () => {
    const config = resolveTelemetryConfig({
      OTEL_ENABLED: "true",
      AXIOM_TOKEN: "xyz123",
      AXIOM_DATASET: "hvdc-test"
    });
    expect(config.enabled).toBe(true);
    expect(config.exporter.url).toBe("https://api.axiom.co/v1/traces");
    expect(config.exporter.headers.Authorization).toBe("Bearer xyz123");
    expect(config.exporter.headers["X-Axiom-Dataset"]).toBe("hvdc-test");
    expect(config.service.name).toBe("hvdc-mcp");
    expect(config.service.version).toBe("1.0.0");
  });

  it("uses custom OTLP endpoint and preserves parsed headers", () => {
    const config = resolveTelemetryConfig({
      OTEL_ENABLED: "true",
      OTEL_EXPORTER_OTLP_ENDPOINT: "https://otel.local/v1/traces",
      OTEL_EXPORTER_OTLP_HEADERS: "x-test=abc, another=xyz",
      AXIOM_TOKEN: "xyz123"
    });
    expect(config.exporter.url).toBe("https://otel.local/v1/traces");
    expect(config.exporter.headers["x-test"]).toBe("abc");
    expect(config.exporter.headers["another"]).toBe("xyz");
    expect(config.exporter.headers.Authorization).toBe("Bearer xyz123");
  });

  it("keeps telemetry disabled when OTEL_ENABLED is false", () => {
    const config = resolveTelemetryConfig({ OTEL_ENABLED: "false" });
    expect(config.enabled).toBe(false);
    expect(config.exporter.url).toBe("");
  });
});

// ─── OTel span attributes on ask_hvdc_ontology ───────────────────────────────

describe("ask_hvdc_ontology span attributes (PR-E)", () => {
  it("withSpan callback receives span that accepts multiple attribute calls", async () => {
    const attrs: Record<string, string> = {};
    const mockSpan = {
      setAttribute: vi.fn((k: string, v: unknown) => { attrs[k] = String(v); }),
      setStatus: vi.fn(),
      end: vi.fn(),
      recordException: vi.fn()
    };
    const mockTracer = {
      startActiveSpan: vi.fn(async (_n: string, fn: (s: unknown) => Promise<unknown>) => fn(mockSpan))
    };
    vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer as never);

    await withSpan("ask_hvdc_ontology", async (span) => {
      span.setAttribute("hvdc.user_role", "ops_user");
      span.setAttribute("hvdc.verdict", "PASS");
      span.setAttribute("hvdc.validation_status", "PASS");
      return "ok";
    });

    expect(attrs["hvdc.verdict"]).toBe("PASS");
    expect(attrs["hvdc.validation_status"]).toBe("PASS");
    expect(attrs["hvdc.user_role"]).toBe("ops_user");
    vi.restoreAllMocks();
  });

  it("hvdc.verdict and hvdc.validation_status are set by ask_hvdc_ontology tool call", async () => {
    const allAttrs: Array<[string, unknown]> = [];
    const makeSpan = () => ({
      setAttribute: vi.fn((k: string, v: unknown) => { allAttrs.push([k, v]); }),
      setStatus: vi.fn(),
      end: vi.fn(),
      recordException: vi.fn()
    });
    const mockTracer = {
      startActiveSpan: vi.fn(async (_n: string, fn: (s: unknown) => Promise<unknown>) => fn(makeSpan()))
    };
    vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer as never);

    const server = createHvdcServer({});
    const client = new Client({ name: "span-attr-test", version: "0.0.1" });
    const [cT, sT] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(sT), client.connect(cT)]);

    await client.callTool({ name: "ask_hvdc_ontology", arguments: { question: "상태 확인", userRole: "test", language: "ko" } });

    await client.close();
    await server.close();
    vi.restoreAllMocks();

    const keys = allAttrs.map(([k]) => k);
    expect(keys).toContain("hvdc.verdict");
    expect(keys).toContain("hvdc.validation_status");
  });

  it("hvdc.verdict attribute value matches the answer verdict field", async () => {
    const verdictAttrs: string[] = [];
    const makeSpan = () => ({
      setAttribute: vi.fn((k: string, v: unknown) => { if (k === "hvdc.verdict") verdictAttrs.push(String(v)); }),
      setStatus: vi.fn(),
      end: vi.fn(),
      recordException: vi.fn()
    });
    const mockTracer = {
      startActiveSpan: vi.fn(async (_n: string, fn: (s: unknown) => Promise<unknown>) => fn(makeSpan()))
    };
    vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer as never);

    const server = createHvdcServer({});
    const client = new Client({ name: "verdict-attr-test", version: "0.0.1" });
    const [cT, sT] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(sT), client.connect(cT)]);

    const res = await client.callTool({ name: "ask_hvdc_ontology", arguments: { question: "상태 확인", userRole: "test", language: "ko" } });

    await client.close();
    await server.close();
    vi.restoreAllMocks();

    const answerVerdict = (res.structuredContent as { verdict?: string })?.verdict;
    expect(verdictAttrs).toHaveLength(1);
    expect(verdictAttrs[0]).toBe(answerVerdict);
  });
});
