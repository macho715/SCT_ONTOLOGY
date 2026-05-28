import { describe, it, expect, vi, beforeEach } from "vitest";
import { withKvCache, corpusKey, ctKey, whKey } from "../server/src/kv-cache.js";
import type { KvCacheEnv } from "../server/src/kv-cache.js";

function makeMockKv(store: Map<string, string> = new Map()): KVNamespace {
  return {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => { store.set(key, value); }),
    delete: vi.fn(async (key: string) => { store.delete(key); }),
    list: vi.fn(async () => ({ keys: [], list_complete: true, cacheStatus: null })),
    getWithMetadata: vi.fn(async (key: string) => ({ value: store.get(key) ?? null, metadata: null, cacheStatus: null })),
  } as unknown as KVNamespace;
}

function makeEnv(opts: { enabled?: boolean; kv?: KVNamespace } = {}): KvCacheEnv {
  return {
    HVDC_CACHE: opts.kv ?? makeMockKv(),
    KV_CACHE_ENABLED: opts.enabled === false ? "false" : "true",
  };
}

describe("withKvCache", () => {
  let store: Map<string, string>;
  let kv: KVNamespace;
  let env: KvCacheEnv;

  beforeEach(() => {
    store = new Map();
    kv = makeMockKv(store);
    env = makeEnv({ kv });
  });

  it("calls fn on cache miss and returns result", async () => {
    const fn = vi.fn(async () => ({ v: 42 }));
    const result = await withKvCache(env, "test:key", 60, fn);
    expect(result).toEqual({ v: 42 });
    expect(fn).toHaveBeenCalledOnce();
  });

  it("stores result in KV after miss", async () => {
    const fn = vi.fn(async () => "hello");
    await withKvCache(env, "test:key", 60, fn);
    await vi.waitFor(() => expect(store.has("test:key")).toBe(true));
  });

  it("returns cached value without calling fn on hit", async () => {
    store.set("test:key", JSON.stringify({ cached: true }));
    const fn = vi.fn(async () => ({ cached: false }));
    const result = await withKvCache(env, "test:key", 60, fn);
    expect(result).toEqual({ cached: true });
    expect(fn).not.toHaveBeenCalled();
  });

  it("falls back to fn when KV get throws", async () => {
    const brokenKv = {
      ...kv,
      get: vi.fn(async () => { throw new Error("KV unavailable"); }),
    } as unknown as KVNamespace;
    const envBroken = makeEnv({ kv: brokenKv });
    const fn = vi.fn(async () => "fallback");
    const result = await withKvCache(envBroken, "test:key", 60, fn);
    expect(result).toBe("fallback");
    expect(fn).toHaveBeenCalledOnce();
  });

  it("does not throw when KV put fails", async () => {
    const putFailKv = {
      ...kv,
      get: vi.fn(async () => null),
      put: vi.fn(async () => { throw new Error("KV put failed"); }),
    } as unknown as KVNamespace;
    const envPutFail = makeEnv({ kv: putFailKv });
    const fn = vi.fn(async () => "value");
    await expect(withKvCache(envPutFail, "test:key", 60, fn)).resolves.toBe("value");
  });

  it("bypasses KV entirely when KV_CACHE_ENABLED=false", async () => {
    const envDisabled = makeEnv({ enabled: false, kv });
    const fn = vi.fn(async () => "direct");
    const result = await withKvCache(envDisabled, "test:key", 60, fn);
    expect(result).toBe("direct");
    expect(kv.get).not.toHaveBeenCalled();
    expect(kv.put).not.toHaveBeenCalled();
  });

  it("bypasses KV when HVDC_CACHE is undefined", async () => {
    const envNoKv: KvCacheEnv = { KV_CACHE_ENABLED: "true" };
    const fn = vi.fn(async () => 99);
    const result = await withKvCache(envNoKv, "test:key", 60, fn);
    expect(result).toBe(99);
    expect(fn).toHaveBeenCalledOnce();
  });

  it("second call for same key returns cached value", async () => {
    const fn = vi.fn(async () => ({ count: 1 }));
    await withKvCache(env, "same:key", 60, fn);
    await vi.waitFor(() => expect(store.has("same:key")).toBe(true));
    const result2 = await withKvCache(env, "same:key", 60, fn);
    expect(result2).toEqual({ count: 1 });
    expect(fn).toHaveBeenCalledOnce();
  });

  it("different keys are cached independently", async () => {
    const fn1 = vi.fn(async () => "a");
    const fn2 = vi.fn(async () => "b");
    const r1 = await withKvCache(env, "key:1", 60, fn1);
    const r2 = await withKvCache(env, "key:2", 60, fn2);
    expect(r1).toBe("a");
    expect(r2).toBe("b");
    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledOnce();
  });
});

describe("KV key builders", () => {
  it("corpusKey produces deterministic key for identical inputs", async () => {
    const k1 = await corpusKey("question about shipment", ["warehouse", "port"]);
    const k2 = await corpusKey("question about shipment", ["warehouse", "port"]);
    expect(k1).toBe(k2);
    expect(k1).toMatch(/^corpus:v1:/);
  });

  it("corpusKey differs for different queries", async () => {
    const k1 = await corpusKey("query A", []);
    const k2 = await corpusKey("query B", []);
    expect(k1).not.toBe(k2);
  });

  it("ctKey follows expected scheme", () => {
    expect(ctKey("SHPT-001")).toBe("ct:v1:SHPT-001");
  });

  it("whKey follows expected scheme", () => {
    expect(whKey("207721")).toBe("wh:v1:207721");
  });

  it("corpusKey does not include ISO dates in plain text (no false positive masking risk)", async () => {
    const key = await corpusKey("2024-01-19 shipment status", []);
    expect(key).toMatch(/^corpus:v1:[a-f0-9]+$/);
    expect(key).not.toContain("2024-01-19");
  });
});
