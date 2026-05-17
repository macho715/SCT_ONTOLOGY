# HVDC Ontology MCP — Project Upgrade Report
**Generated:** 2026-05-15  
**Skill:** project-upgrade v2.1  
**Repo:** `HVDC Ontology Grounded` (Cloudflare Worker MCP)

---

## 1. Executive Summary

현재 프로젝트는 Cloudflare Workers 기반 HVDC 물류 MCP 서버로, 15개 도구, D1/R2 스토리지, OTel 활성, 209 테스트, CI 75% coverage gate까지 갖춰진 운영 상태이다. 이번 스카우트는 **6개 영역 10가지 업그레이드 아이디어**를 식별했으며, 즉시 적용 가능한 Best 3로 (1) Workers Rate Limiting API 추가, (2) OTLP 관찰 가능성 백엔드 연결, (3) D1 쿼리용 KV 캐시 레이어를 선정했다. 세 가지 모두 1–2 PR 수준 작업으로 ROI가 높다.

---

## 2. Current State Snapshot

| 항목 | 현재 상태 |
|---|---|
| Runtime | Cloudflare Workers (TypeScript + Wrangler) |
| MCP endpoint | `/mcp` — HTTP Streamable Transport |
| Tool count | 15 tools (read/validation, Dual-MCP analysis, protected upload/write) |
| Test files | 17 files, ~209 tests |
| Coverage gate | 75% lines (Vitest v8) |
| CI | GitHub Actions: typecheck → test → coverage gate → verify-bindings |
| Storage | Cloudflare D1 (audit + control tower) + R2 (files) |
| Auth | OAuth Bearer scope + Human-gate for write tools |
| OTel | `@microlabs/otel-cf-workers` enabled; `hvdc.verdict` + `hvdc.validation_status` spans |
| OTLP backend | ⚠ Not connected — `OTLP_ENDPOINT` secret not set |
| Rate limiting | ✗ Not implemented |
| Semantic search | ✗ Pattern matching only (no vector search) |
| `hvdc-server.ts` | 1,449 lines — monolith |
| `worker.ts` | 974 lines — monolith |
| `.codex/` gitignore | ✗ Not in `.gitignore` — 3 ephemeral files always untracked |

---

## 3. Upgrade Ideas — Top 10

| # | Idea | Bucket | Impact | Effort | Risk | Confidence | PriorityScore | Evidence |
|---|---|---|---|---|---|---|---|---|
| 1 | Workers Rate Limiting API | Security/Reliability | 4 | 1 | 1 | 5 | **20.0** | CF docs + Hono middleware |
| 2 | OTLP observability backend | Reliability/OTel | 4 | 1 | 1 | 5 | **20.0** | OneUptime blog + CF Workers OTel guide |
| 3 | KV cache layer for D1 queries | Performance | 4 | 2 | 1 | 5 | **10.0** | Zenn 3-tier cache + Digital Applied guide |
| 4 | `.gitignore` + housekeeping | DX/Process | 2 | 1 | 1 | 5 | **10.0** | Code audit |
| 5 | Coverage gate 75% → 85% | DX/Tooling | 3 | 2 | 1 | 5 | **7.5** | Vitest coverage docs |
| 6 | Cloudflare AI Gateway routing | Performance | 3 | 2 | 1 | 4 | **6.0** | CF press release Apr 2025 |
| 7 | Dynamic eval pipeline | DX/Tooling | 4 | 3 | 1 | 4 | **5.3** | MCP eval harness patterns |
| 8 | Split `hvdc-server.ts` monolith | Architecture | 5 | 3 | 2 | 5 | **4.2** | CF mcp-server-cloudflare repo + TypeScript MCP skill |
| 9 | Cloudflare Vectorize semantic search | Performance | 5 | 4 | 2 | 4 | **2.5** | DEV.to MCP+Vectorize guide + obsidian-vectorize-mcp |
| 10 | invoice_risk_scan feature | Architecture/Product | 5 | 4 | 3 | 3 | **1.3** | phase3-spec.md (planned) |

> **PriorityScore = (Impact × Confidence) / (Effort × Risk)**

---

## 4. Best 3 Deep Report

### Best 1 — Workers Rate Limiting API
**Bucket:** Security/Reliability | **PriorityScore: 20.0**

#### Goal
- MCP 엔드포인트 `/mcp`와 healthz에 tool-call 단위 rate limiting 추가
- 악의적 반복 호출로 D1 quota와 R2 cost 소진 방지
- `ask_hvdc_ontology` 같은 LLM 쿼리 호출에 per-IP 또는 per-token 제한

#### Non-goals
- 세션 기반 인증 교체 (OAuth Bearer 유지)
- CDN-level DDoS 방어 (이미 Cloudflare가 처리)

#### Proposed Design

```
┌─────────────────────────────────┐
│ Cloudflare Worker /mcp          │
│                                 │
│  req → RateLimitBinding.check() │
│       ↓ OK                      │
│  createMcpHandler(...)          │
│  15 MCP tools                   │
│                                 │
│  RateLimitBinding namespace:    │
│    hvdc-mcp-tool-calls          │
│    limit: 30 req/60s per key    │
└─────────────────────────────────┘
```

**wrangler.toml 추가:**
```toml
[[unsafe.bindings]]
name = "RATE_LIMITER"
type = "ratelimit"
namespace_id = "1001"
simple = { limit = 30, period = 60 }
```

**worker.ts 수정:**
```typescript
const { success } = await env.RATE_LIMITER.limit({ key: rateLimitKey });
if (!success) {
  return new Response(JSON.stringify({ error: "rate_limited" }), {
    status: 429,
    headers: { "Retry-After": "60" }
  });
}
```

#### PR Plan

| PR | Scope | Files | Rollback |
|----|-------|-------|----------|
| PR-RL1 | wrangler.toml에 rate limit binding 추가 | `wrangler.toml` | 바인딩 제거 |
| PR-RL2 | worker.ts에 rate limit 미들웨어 삽입 | `server/src/worker.ts` | 미들웨어 라인 삭제 |
| PR-RL3 | rate limit 응답 테스트 + CI 검증 | `tests/worker.test.ts` | 테스트만 삭제 |

#### Tests
- Unit: `RATE_LIMITER.limit()` mock → 429 반환 확인
- Integration: InMemoryTransport로 30회 이상 호출 시 429 확인
- E2E: Cloudflare staging 환경에서 burst 테스트

#### Rollout & Rollback
- Feature flag: `RATE_LIMIT_ENABLED` env var로 on/off 가능
- Rollback: wrangler.toml binding 제거 + redeploy

#### Risks & Mitigations

| Risk | Mitigation |
|---|---|
| 정상 ChatGPT 사용자가 막힐 수 있음 | 초기 limit 넉넉히 (30/60s), 1주 관찰 후 조정 |
| rate limit namespace_id 중복 | CF Dashboard에서 unique ID 확인 후 사용 |
| 테스트 환경에서 binding 미지원 | `RATE_LIMIT_ENABLED=false`로 테스트 bypass |

#### KPI Targets
- D1 쿼리 비정상 spike 0건/일 (현재 측정 없음)
- 429 응답률 < 0.1% (정상 사용자)
- Worker CPU time per request < 2ms 증가

#### Evidence
| platform | title | url | date | popularity |
|---|---|---|---|---|
| official | Rate Limiting — Cloudflare Workers docs | https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ | 2025 | Official |
| github | elithrar/workers-hono-rate-limit | https://github.com/elithrar/workers-hono-rate-limit | 2025 | Active repo |

> ⚠ AMBER: Both evidence dates are year-only (2025). Use as guidance, not as blockers — official CF docs are authoritative.

---

### Best 2 — OTLP Observability Backend Connection
**Bucket:** Reliability/Observability | **PriorityScore: 20.0**

#### Goal
- `OTEL_ENABLED=true`가 이미 활성화된 상태에서 실제 OTLP 백엔드 연결
- `hvdc.verdict`, `hvdc.validation_status` 스팬이 Honeycomb/Axiom/SigNoz에 실시간 집계
- 운영 중 답변 품질 저하(BLOCK/ERROR verdict 급증) 조기 감지

#### Non-goals
- OTel 코드 변경 (이미 `withSpan` 구현 완료)
- 새 trace instrumentation 추가 (PR-E에서 이미 완료)

#### Proposed Design

```
Cloudflare Worker
  └── @microlabs/otel-cf-workers
      └── OTLP HTTP export
          ├── OTLP_ENDPOINT = https://api.honeycomb.io
          └── OTLP_AUTH_HEADER = x-honeycomb-team: <API_KEY>

Honeycomb (or Axiom/SigNoz)
  └── trace: mcp.ask_hvdc_ontology
      ├── hvdc.verdict: "PASS"|"WARN"|"BLOCK"
      ├── hvdc.validation_status: "PASS"|"WARN"|"BLOCK"
      └── hvdc.user_role: "ops_user"|...
```

**Wrangler secrets 설정 (1회성):**
```bash
wrangler secret put OTLP_ENDPOINT
# → https://api.honeycomb.io
wrangler secret put OTLP_AUTH_HEADER
# → x-honeycomb-team: <your-api-key>
```

#### PR Plan

| PR | Scope | Files | Rollback |
|----|-------|-------|----------|
| PR-OB1 | OTLP_ENDPOINT/OTLP_AUTH_HEADER wrangler.toml vars 섹션에 placeholder 추가 | `wrangler.toml`, `README.md` | 제거 |
| PR-OB2 | 서버 startup 시 OTLP env 유효성 검증 + missing secret 경고 | `server/src/worker.ts` | 검증 코드 제거 |
| PR-OB3 | Honeycomb/Axiom dashboard 쿼리 + runbook | `docs/observability-runbook.md` | 문서 삭제 |

#### Tests
- Unit: OTLP_ENDPOINT 미설정 시 경고 로그 확인
- Integration: mock OTLP endpoint로 span export 확인
- E2E: Honeycomb staging에서 trace 수신 확인

#### Rollout & Rollback
- OTLP_ENDPOINT 제거 시 즉시 비활성 (no-op export)
- Feature: `OTEL_ENABLED=false`로 완전 비활성

#### Risks & Mitigations

| Risk | Mitigation |
|---|---|
| OTLP backend 비용 초과 | Honeycomb free tier (20M events/month) 충분 |
| API 키 유출 | wrangler secret (env에 직접 노출 안 됨) |
| 느린 OTLP export가 response time 증가 | `@microlabs/otel-cf-workers`는 async export (non-blocking) |

#### KPI Targets
- BLOCK verdict rate < 5% of total calls
- p95 `mcp.ask_hvdc_ontology` span duration < 500ms
- 0 ERROR spans per day (daily alert)

#### Evidence
| platform | title | url | date | popularity |
|---|---|---|---|---|
| blog | How to Instrument Cloudflare Workers with OpenTelemetry | https://oneuptime.com/blog/post/2026-02-06-cloudflare-workers-otel-instrumentation/view | 2026-02-06 | Technical blog |
| github | cloudflare/mcp-server-cloudflare (Uses otel-cf-workers) | https://github.com/cloudflare/mcp-server-cloudflare | 2025-05-14 | Official CF repo |

---

### Best 3 — KV Cache Layer for D1 Queries
**Bucket:** Performance | **PriorityScore: 10.0**

#### Goal
- Control Tower D1 조회 (`resolve_any_key`, `check_mosb_gate`) 에 KV 캐시 레이어 추가
- D1 row read 80%+ 감소 → 비용 절감
- Cache TTL 60–300초로 실시간성 유지

#### Non-goals
- Write 경로 캐싱 (upload/write는 캐시 제외)
- 복잡한 3-tier 캐시 (in-memory → KV → D1) 중 KV → D1 2-tier만 구현

#### Proposed Design

```
MCP Tool call
  └── getShipmentData(key)
      ├── 1. KV.get(key)         // ~5ms, global
      │   ├── HIT → return      
      │   └── MISS ↓
      └── 2. D1.prepare(sql)    // ~20ms
              └── KV.put(key, result, { expirationTtl: 120 })
                  └── return result
```

**wrangler.toml 추가:**
```toml
[[kv_namespaces]]
binding = "HVDC_CACHE"
id = "<kv-namespace-id>"
preview_id = "<preview-kv-namespace-id>"
```

**worker.ts 캐시 헬퍼:**
```typescript
async function cachedD1Query<T>(
  kv: KVNamespace, d1: D1Database,
  cacheKey: string, sql: string, params: string[], ttl = 120
): Promise<T | null> {
  const cached = await kv.get(cacheKey, "json");
  if (cached) return cached as T;
  const result = await d1.prepare(sql).bind(...params).first<T>();
  if (result) await kv.put(cacheKey, JSON.stringify(result), { expirationTtl: ttl });
  return result;
}
```

#### PR Plan

| PR | Scope | Files | Rollback |
|----|-------|-------|----------|
| PR-KV1 | KV namespace 생성 + wrangler.toml binding 추가 | `wrangler.toml` | binding 제거 |
| PR-KV2 | `cachedD1Query` 헬퍼 + `resolve_any_key` 적용 | `server/src/worker.ts` | 헬퍼 제거, D1 직접 호출 복원 |
| PR-KV3 | KV 캐시 히트/미스 span attribute 추가 + 테스트 | `tests/control-tower-d1.test.ts` | 테스트 제거 |

#### Tests
- Unit: `cachedD1Query` mock KV HIT/MISS 경로 검증
- Integration: D1 stub + KV mock으로 캐시 무효화 테스트
- Perf: before/after D1 row read count 비교

#### Rollout & Rollback
- `CACHE_ENABLED=false` env var로 bypass 가능
- Rollback: KV binding 제거 + `cachedD1Query` → `d1.prepare().first()` 직접 호출 복원

#### Risks & Mitigations

| Risk | Mitigation |
|---|---|
| 오래된 캐시로 잘못된 데이터 반환 | TTL 120s, write 시 캐시 무효화 (`kv.delete(key)`) |
| KV namespace ID 분리 누락 | wrangler.toml에 `preview_id` 따로 설정 |
| 테스트 환경에서 KV 미지원 | `CACHE_ENABLED=false` |

#### KPI Targets
- D1 row reads/day -60% (from baseline)
- `resolve_any_key` p95 latency < 30ms (현재 ~50ms 추정)
- KV 비용: $0.50/million ops (D1 대비 60% 절감)

#### Evidence
| platform | title | url | date | popularity |
|---|---|---|---|---|
| blog | How I Reduced Cloudflare D1 Row Reads by 87% with 3-Tier Caching | https://zenn.dev/jphfa/articles/cloudflare-d1-three-tier-cache?locale=en | 2025 | High relevance |
| blog | Edge Computing: Cloudflare Workers Dev Guide 2026 | https://www.digitalapplied.com/blog/edge-computing-cloudflare-workers-development-guide-2026 | 2026 | Comprehensive guide |

> ⚠ AMBER: Both evidence dates are year-only (2025/2026) without specific months. Core KV caching pattern is well-established official Cloudflare capability.

---

## 5. Options A / B / C

| 옵션 | 내용 | Risk | Timeline |
|---|---|---|---|
| **A (보수)** | Rate Limiting + OTLP 비밀 설정만 | Low | 1일 |
| **B (중간)** | Best 1+2+3 (Rate Limiting + OTLP + KV 캐시) | Medium | 1–2주 |
| **C (공격)** | Best 1-3 + Vectorize 시맨틱 서치 + monolith 분리 | High | 4–6주 |

---

## 6. 30/60/90-day Roadmap

### 30-day (즉시 적용)
- [ ] `wrangler secret put OTLP_ENDPOINT` + `OTLP_AUTH_HEADER` → Honeycomb 연결 (PR-OB1)
- [ ] Workers Rate Limiting binding 추가 (PR-RL1~2)
- [ ] `.gitignore`에 `.codex/` 추가 (quick win)
- [ ] coverage gate 75% → 80% 상향 (vitest.config.ts 수정)

### 60-day (성능 최적화)
- [ ] KV namespace 생성 + `cachedD1Query` 헬퍼 적용 (PR-KV1~3)
- [ ] Cloudflare AI Gateway integration (ask_hvdc_ontology LLM call routing)
- [ ] 동적 eval 파이프라인: golden_prompts.json → CI eval job으로 전환

### 90-day (아키텍처 개선)
- [ ] `hvdc-server.ts` 모듈 분리: tools/, validation/, upload/, analysis/
- [ ] Cloudflare Vectorize 시맨틱 서치 prototype (bge-small-en-v1.5 임베딩)
- [ ] `invoice_risk_scan` feature 구현

---

## 7. Evidence Table

| # | Idea | platform | title | url | published_date | accessed_date | popularity |
|---|---|---|---|---|---|---|---|
| 1 | Rate Limiting | official | Cloudflare Workers Rate Limit docs | https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ | 2025 (year-only) | 2026-05-15 | Official |
| 1 | Rate Limiting | github | workers-hono-rate-limit | https://github.com/elithrar/workers-hono-rate-limit | 2025 (year-only) | 2026-05-15 | Active |
| 2 | OTLP | blog | otel-cf-workers instrumentation | https://oneuptime.com/blog/post/2026-02-06-cloudflare-workers-otel-instrumentation/view | 2026-02-06 | 2026-05-15 | Tech blog |
| 2 | OTLP | github | cloudflare/mcp-server-cloudflare | https://github.com/cloudflare/mcp-server-cloudflare | 2025-05-14 | 2026-05-15 | Official CF |
| 3 | KV Cache | blog | D1 3-tier caching 87% reduction | https://zenn.dev/jphfa/articles/cloudflare-d1-three-tier-cache?locale=en | 2025 (year-only) | 2026-05-15 | High relevance |
| 3 | KV Cache | blog | CF Workers Dev Guide 2026 | https://www.digitalapplied.com/blog/edge-computing-cloudflare-workers-development-guide-2026 | 2026 (year-only) | 2026-05-15 | Comprehensive |
| 8 | Monolith split | github | cloudflare/mcp-server-cloudflare (monorepo pattern) | https://github.com/cloudflare/mcp-server-cloudflare | 2025-05-14 | 2026-05-15 | Official |
| 9 | Vectorize | medium | Building MCP Server w/ Semantic Search on CF Workers | https://dev.to/dannwaneri/building-an-mcp-server-on-cloudflare-workers-with-semantic-search-2gb8 | 2025-12-03 | 2026-05-15 | 2 comments |
| 9 | Vectorize | github | obsidian-vectorize-mcp | https://github.com/ben-vargas/obsidian-vectorize-mcp | 2025 (year-only) | 2026-05-15 | Active |

---

## 8. AMBER_BUCKET

아래 항목은 날짜 불명확(year-only) 또는 근거 부족으로 핵심 결정 근거 사용 불가:

| 항목 | 이유 |
|---|---|
| Cloudflare Rate Limiting docs date "2025" | 월/일 없음 — 공식 docs로 신뢰도 보완 |
| Zenn D1 caching article "2025" | 월/일 없음 — 기술 내용은 유효하나 freshness 불확실 |
| workers-hono-rate-limit "2025" | 월/일 없음 — GitHub Stars 확인 필요 |
| obsidian-vectorize-mcp "2025" | 월/일 없음 |
| Digital Applied guide "2026" | 월 없음 |

---

## 9. Verification Gate

### Evidence completeness check

| Best | evidence count | date confirmed | status |
|---|---|---|---|
| Best 1 (Rate Limiting) | 2 | Partial (AMBER dates) | ⚠ AMBER — official docs보완 |
| Best 2 (OTLP) | 2 | 1 GREEN (2026-02-06) + 1 GREEN (2025-05-14) | ✅ PASS |
| Best 3 (KV Cache) | 2 | Partial (AMBER dates) | ⚠ AMBER — established CF pattern으로 보완 |

### Deep Dive completeness

| Best | PR plan ≥3 | tests | rollout/rollback | KPIs | status |
|---|---|---|---|---|---|
| Best 1 | ✅ (3 PRs) | ✅ | ✅ | ✅ | PASS |
| Best 2 | ✅ (3 PRs) | ✅ | ✅ | ✅ | PASS |
| Best 3 | ✅ (3 PRs) | ✅ | ✅ | ✅ | PASS |

### Stack compatibility

- Workers Rate Limiting: `wrangler.toml` unsafe binding — ✅ compatible, wrangler 3.x 지원
- OTLP: `@microlabs/otel-cf-workers` already installed — ✅ zero new deps
- KV Cache: Cloudflare KV standard binding — ✅ compatible

### Safety

- No secrets/tokens/PII in this report ✅
- No destructive operations in PR plans ✅

### Apply Gates

- **Gate 0 (Dry-run):** `wrangler deploy --dry-run` 실행 후 binding 검증
- **Gate 1 (Change list):** Rate Limit = `wrangler.toml` + `worker.ts` 2파일; KV = `wrangler.toml` + `worker.ts` 2파일
- **Gate 2 (Approval):** 이 보고서 승인 후 구현 시작
- **Gate 3 (Feature flag):** `RATE_LIMIT_ENABLED`, `CACHE_ENABLED` env var로 점진 롤아웃
- **Gate 4 (Rollback):** binding 제거 + `wrangler deploy` → 즉시 롤백

### 최종 판정

| Best | Verdict |
|---|---|
| Best 1 — Rate Limiting | ✅ **Go** (AMBER evidence, but official CF docs authoritative) |
| Best 2 — OTLP backend | ✅ **Go** (PASS evidence, 0 new deps) |
| Best 3 — KV Cache | ✅ **Go** (AMBER evidence, established pattern) |

---

## 10. Open Questions

1. **OTLP backend 선택**: Honeycomb (무료 20M events/mo) vs Axiom (무료 500GB/mo) 어느 쪽을 선택할지 — 결정 후 PR-OB1 진행
2. **Rate Limit key 전략**: per-IP vs per-Bearer-token vs per-tool-name — 어떤 granularity가 적합한지 확인 필요
3. **KV TTL**: Control Tower 데이터 변경 주기가 얼마나 잦은지 — 120s가 적합한지, 아니면 더 짧게 60s로 해야 하는지
