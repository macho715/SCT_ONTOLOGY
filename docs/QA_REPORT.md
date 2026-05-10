# QA Report Template

## Local checks

```bash
npm run typecheck
npm test
npm run index
```

## Golden prompts

| No | Prompt | Expected |
|---:|---|---|
| 1.00 | AGI M130 닫아도 돼? BL-535 관련 | BLOCK |
| 2.00 | Flow Code 어디에 써? | INFO, WHP-only |
| 3.00 | 이 invoice 과청구야? | WARN/BLOCK until CostGuard evidence pack exists |
| 4.00 | BOE 123 지연 원인? | Document/Port chronology evidence |
| 5.00 | 월간 보고서 만들어줘 | Operations/report artifact guidance |

## Exit criteria

| KPI | Target |
|---|---:|
| Answer Grounding Coverage | 100.00% for core claims |
| Source Traceability | ≥95.00% |
| Validation p95 | <5.00s |
| PII Leakage | 0.00 |
| Human-gate enforcement | 100.00% for write/action |
