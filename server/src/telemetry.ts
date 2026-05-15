import { trace, SpanStatusCode, type Span } from "@opentelemetry/api";

const SERVICE_NAME = "hvdc-mcp";

export async function withSpan<T>(
  toolName: string,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  const tracer = trace.getTracer(SERVICE_NAME);
  return tracer.startActiveSpan(`mcp.${toolName}`, async (span) => {
    try {
      span.setAttribute("mcp.tool.name", toolName);
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
      throw error;
    } finally {
      span.end();
    }
  });
}
