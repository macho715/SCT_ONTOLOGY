type RateLimitBinding = {
  limit: (options: { key: string }) => Promise<{
    success: boolean;
    limit?: number;
    remaining?: number;
    reset?: number;
  }>;
};

export const MCP_PATH = "/mcp";
const RATE_LIMIT_RETRY_DEFAULT_SECONDS = 60;
const RATE_LIMIT_DEFAULTS = {
  token: { limit: 200, retryAfter: 60 },
  tool: { limit: 10, retryAfter: 3600 },
  ip: { limit: 2000, retryAfter: 60 }
} as const;

type RateLimitReason = keyof typeof RATE_LIMIT_DEFAULTS;
type RateLimitResult = { success: boolean; limit?: number; remaining?: number; reset?: number };

export type RateLimitEnv = {
  RATE_LIMIT_ENABLED?: string;
  RATE_LIMITER?: RateLimitBinding;
  RATE_LIMITER_IP?: RateLimitBinding;
  RATE_LIMITER_TOOL?: RateLimitBinding;
};

export function featureEnabled(value: string | undefined): boolean {
  if (value === undefined) return true;
  return value.toLowerCase() !== "false";
}

export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization") ?? "";
  const tokenMatch = /^Bearer\s+(.+)$/i.exec(authHeader);
  return tokenMatch ? tokenMatch[1] : null;
}

export async function parseMcpToolName(request: Request): Promise<string | null> {
  if (request.method !== "POST") return null;
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) return null;
  try {
    const payloadText = await request.clone().text();
    if (!payloadText.trim()) return null;
    const payload = JSON.parse(payloadText) as { method?: string; params?: Record<string, unknown> };
    const method = payload?.method;
    if (method !== "tools/call") return null;
    const params = payload?.params;
    const toolName = params && typeof params.name === "string" ? params.name : null;
    return toolName;
  } catch (_error) {
    return null;
  }
}

export async function safeRateLimitCheck(
  limiter: RateLimitBinding | undefined,
  key: string
): Promise<RateLimitResult | null> {
  if (!limiter?.limit) return null;
  try {
    return await limiter.limit({ key });
  } catch (_error) {
    return null;
  }
}

function finiteNumber(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function retryAfterSeconds(result: RateLimitResult, reason: RateLimitReason): number {
  const reset = finiteNumber(result.reset);
  return reset !== null && reset > 0 ? Math.max(1, Math.ceil(reset)) : RATE_LIMIT_DEFAULTS[reason].retryAfter;
}

export function limitHeaders(result: RateLimitResult, reason: RateLimitReason): HeadersInit {
  const limit = finiteNumber(result.limit) ?? RATE_LIMIT_DEFAULTS[reason].limit;
  const remaining = Math.max(0, finiteNumber(result.remaining) ?? 0);
  const retryAfter = retryAfterSeconds(result, reason);
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Retry-After": String(retryAfter),
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reason": reason
  };
}

export async function applyRateLimit(
  request: Request,
  env: RateLimitEnv,
  toolName: string | null
): Promise<Response | null> {
  if (!featureEnabled(env.RATE_LIMIT_ENABLED)) return null;
  const isMcpRequest = request.method === "POST" && new URL(request.url).pathname === MCP_PATH;
  if (!isMcpRequest) return null;

  const token = extractBearerToken(request);
  if (token && env.RATE_LIMITER?.limit) {
    const result = await safeRateLimitCheck(env.RATE_LIMITER, `token:${token}`);
    if (result && !result.success) {
      return Response.json(
        { error: "rate_limited", message: "Too many requests. Please retry after 60 seconds.", retryAfter: retryAfterSeconds(result, "token") },
        { status: 429, headers: limitHeaders(result, "token") }
      );
    }

    if (toolName === "ask_hvdc_ontology") {
      const toolResult = await safeRateLimitCheck(env.RATE_LIMITER_TOOL, `token:${token}:tool:ask_hvdc_ontology`);
      if (toolResult && !toolResult.success) {
        return Response.json(
          {
            error: "rate_limited",
            message: "Too many requests for this tool. Please retry after 60 minutes.",
            retryAfter: retryAfterSeconds(toolResult, "tool")
          },
          { status: 429, headers: limitHeaders(toolResult, "tool") }
        );
      }
    }
    return null;
  }

  if (env.RATE_LIMITER_IP?.limit) {
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const ipResult = await safeRateLimitCheck(env.RATE_LIMITER_IP, `ip:${ip}`);
    if (ipResult && !ipResult.success) {
      return Response.json(
        { error: "rate_limited", message: "Too many requests. Please retry after 60 seconds.", retryAfter: retryAfterSeconds(ipResult, "ip") },
        { status: 429, headers: limitHeaders(ipResult, "ip") }
      );
    }
  }

  return null;
}
