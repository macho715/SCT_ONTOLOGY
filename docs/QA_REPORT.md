# QA Report

Current verification date: 2026-05-13

## Current verified state

- `ask_hvdc_ontology` is data-only. It returns no `openai/outputTemplate`, no `_meta.ui.resourceUri`, and no `structuredContent.ui`.
- `render_hvdc_answer_card` owns the answer-card template `ui://hvdc/answer-card-v7.html`.
- Registered UI resources include canonical v7, previous v6, legacy v5, and render tool alias:
  - `ui://hvdc/answer-card-v7.html`
  - `ui://hvdc/answer-card-v6.html`
  - `ui://hvdc/answer-card-v5.html`
  - `ui://hvdc/render_hvdc_answer_card.html`
- Daily KPI Dashboard lock prompts route to operations KPI, not Invoice/CostGuard default summary.
- The card widget wraps long action names, protected-field lists, route reasons, and validation text to reduce overflow.
- Protected upload/write tools are available as MCP tools, but they fail closed without OAuth Bearer scopes and Human-gate approval.

## Local checks

```bash
npm run typecheck
npm test
npm run index
```

Latest local verification:

```bash
npm run verify
```

Result: TypeScript typecheck passed, Vitest 8 files / 113 tests passed, and `wrangler deploy --dry-run` passed.

Current Cloudflare production verification: `/healthz`, OAuth protected resource metadata, MCP `initialize`, MCP `tools/list`, `ask_hvdc_ontology`, unauthenticated protected-tool fail-closed behavior, and D1 audit logging were checked against `https://hvdc-ontology-chatgpt-app.mscho715.workers.dev/mcp`.

## Golden prompts

| No | Prompt | Expected |
|---:|---|---|
| 1.00 | AGI M130 닫아도 돼? BL-535 관련 | BLOCK |
| 2.00 | Flow Code 어디에 써? | INFO, WHP-only |
| 3.00 | 이 invoice 과청구야? | WARN/BLOCK until invoice line, rate, and tariff evidence exists |
| 4.00 | BOE 123 지연 원인? | Document/Port chronology evidence |
| 5.00 | 월간 보고서 만들어줘 | Operations/report artifact guidance |
| 6.00 | Daily KPI Dashboard 원장에서 Owner / Risk / Next Action 잠금 처리 | WARN with operations KPI summary and Human-gate |

## Exit criteria

| KPI | Target |
|---|---:|
| Answer Grounding Coverage | 100.00% for core claims |
| Source Traceability | ≥95.00% |
| Validation p95 | <5.00s |
| PII Leakage | 0.00 |
| Human-gate enforcement | 100.00% for write/action |
| Protected upload/write fail-closed | 100.00% without required Bearer scope |

## Manual ChatGPT checks

| Check | Expected |
|---|---|
| Ask result template | `ask_hvdc_ontology` result has no `openai/outputTemplate` |
| Ask result UI payload | `ask_hvdc_ontology` result has no `ui` object |
| Render template | `render_hvdc_answer_card` result uses `ui://hvdc/answer-card-v7.html` |
| Template loading | No `Failed to fetch template` message |
| Daily KPI wording | Summary starts with `Daily logistics KPI` |
| Daily KPI wording | No invoice/cost evidence-pack wording in Daily KPI answer |
| Human-gate | Owner/Risk/Next Action lock request returns `HUMAN_GATE_REQUIRED` |
| Visual overflow | Long actions and protected fields wrap inside card columns |
