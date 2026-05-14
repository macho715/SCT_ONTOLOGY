import { describe, it, expect, vi } from "vitest";
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { withSpan } from "../server/src/telemetry.js";

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
});
