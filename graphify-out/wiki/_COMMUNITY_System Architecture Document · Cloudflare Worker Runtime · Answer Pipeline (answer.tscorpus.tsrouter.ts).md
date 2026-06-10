---
type: community
cohesion: 0.24
members: 10
---

# System Architecture Document · Cloudflare Worker Runtime · Answer Pipeline (answer.ts/corpus.ts/router.ts)

**Cohesion:** 0.24 - loosely connected
**Members:** 10 nodes

## Members
- [[Answer Pipeline (answer.tscorpus.tsrouter.ts)]] - concept - docs/SYSTEM_ARCHITECTURE.md
- [[Axiom Telemetry Integration]] - concept - docs/observability-runbook.md
- [[Claude HVDC Ontology App Historical Plan (2026-05-11)]] - document - docs/claude-plan-20260511.md
- [[Cloudflare Remote MCP Endpoint]] - concept - docs/claude-plan-20260511.md
- [[Cloudflare Worker Runtime_1]] - concept - docs/SYSTEM_ARCHITECTURE.md
- [[Corpus Bundle (datacorpus + generated assets)]] - concept - docs/SYSTEM_ARCHITECTURE.md
- [[MCP Tool Registry (hvdc-server.ts)]] - concept - docs/SYSTEM_ARCHITECTURE.md
- [[Observability Runbook (Axiom APL queries)]] - document - docs/observability-runbook.md
- [[System Architecture Document]] - document - docs/SYSTEM_ARCHITECTURE.md
- [[WH Status SSOT (D1 projections)]] - concept - docs/SYSTEM_ARCHITECTURE.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/System_Architecture_Document__Cloudflare_Worker_Runtime__Answer_Pipeline_answerts/corpusts/routerts
SORT file.name ASC
```
