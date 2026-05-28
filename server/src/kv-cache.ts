export interface KvCacheEnv {
  HVDC_CACHE?: KVNamespace;
  KV_CACHE_ENABLED?: string;
}

export async function withKvCache<T>(
  env: KvCacheEnv,
  key: string,
  ttlSec: number,
  fn: () => Promise<T>
): Promise<T> {
  if (env.KV_CACHE_ENABLED !== "true" || !env.HVDC_CACHE) {
    return fn();
  }

  let cached: string | null = null;
  try {
    cached = await env.HVDC_CACHE.get(key);
  } catch {
    // KV unavailable — fall through to fn()
  }

  if (cached !== null) {
    return JSON.parse(cached) as T;
  }

  const result = await fn();

  // Fire-and-forget: does not block the response
  env.HVDC_CACHE.put(key, JSON.stringify(result), { expirationTtl: ttlSec }).catch(() => {});

  return result;
}

export async function corpusKey(query: string, domainHints: string[]): Promise<string> {
  const raw = `${query}|${domainHints.slice().sort().join(",")}`;
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  return `corpus:v1:${hex}`;
}

export function ctKey(shipmentUnitId: string): string {
  return `ct:v1:${shipmentUnitId}`;
}

export function whKey(caseNo: string): string {
  return `wh:v1:${caseNo}`;
}
