import { trace, SpanStatusCode, type Span } from "@opentelemetry/api";

const SERVICE_NAME = "hvdc-mcp";
const SERVICE_VERSION = "1.0.0";
const DEFAULT_AXIOM_OTLP_ENDPOINT = "https://api.axiom.co/v1/traces";
const DEFAULT_AXIOM_DATASET = "hvdc-mcp-prod";
const DEFAULT_EMPTY_HEADER: Readonly<Record<string, string>> = {};

type OTelEnv = {
  OTEL_ENABLED?: string;
  OTEL_EXPORTER_OTLP_ENDPOINT?: string;
  OTEL_EXPORTER_OTLP_HEADERS?: string;
  AXIOM_TOKEN?: string;
  AXIOM_DATASET?: string;
};

export type OtelConfig = {
  enabled: boolean;
  exporter: {
    url: string;
    headers: Record<string, string>;
  };
  service: {
    name: string;
    version: string;
  };
};

export function resolveTelemetryConfig(env: OTelEnv): OtelConfig {
  const endpoint =
    env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim() ||
    (env.AXIOM_TOKEN || env.AXIOM_DATASET ? DEFAULT_AXIOM_OTLP_ENDPOINT : "");

  const headersFromEnv = parseHeaderPairs(env.OTEL_EXPORTER_OTLP_HEADERS);
  const headers: Record<string, string> = {
    ...headersFromEnv,
    ...(env.AXIOM_TOKEN ? { Authorization: `Bearer ${env.AXIOM_TOKEN}` } : {})
  };

  if (endpoint === DEFAULT_AXIOM_OTLP_ENDPOINT && !("X-Axiom-Dataset" in headers)) {
    headers["X-Axiom-Dataset"] = env.AXIOM_DATASET?.trim() || DEFAULT_AXIOM_DATASET;
  }

  return {
    enabled: env.OTEL_ENABLED === "true",
    exporter: {
      url: endpoint,
      headers
    },
    service: {
      name: SERVICE_NAME,
      version: SERVICE_VERSION
    }
  };
}

function parseHeaderPairs(raw?: string): Record<string, string> {
  if (!raw?.trim()) return { ...DEFAULT_EMPTY_HEADER };
  const entries = raw
    .split(",")
    .map((pair) => {
      const idx = pair.indexOf("=");
      if (idx < 0) return null;
      return [pair.slice(0, idx).trim(), pair.slice(idx + 1).trim()];
    })
    .filter((entry): entry is [string, string] => Boolean(entry && entry[0]));
  return Object.fromEntries(entries);
}

export const hasTelemetryEndpoint = (env: OTelEnv): boolean =>
  Boolean(resolveTelemetryConfig(env).exporter.url);

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
