# Feature Landscape

**Project:** HVDC Ontology Insight MCP Merge
**Domain:** HVDC SCM/logistics operational risk and evidence lookup
**Researched:** 2026-05-13
**Scope:** Features useful to an HVDC SCM/logistics operator when merging the local Ontology Insight prototype with the production HVDC ontology MCP.
**Overall confidence:** HIGH for local feature evidence; MEDIUM for production delivery details because this workspace does not contain the Cloudflare MCP implementation.

## Evidence Basis

This research is based only on the requested local planning files, codebase maps, SPARQL queries, and `hvdc-code-mapping-v2.6.2.json`.

The strongest local assets are the operational SPARQL queries, the HVDC code/source mapping rules, the CostGuard/HS/certificate business-rule layer, the audit/evidence utilities, and the existing local Fuseki analysis boundary.

The main merge constraint is semantic alignment. Local sample vocabulary such as `ex:Case`, `ex:TransportEvent`, `ex:StockSnapshot`, `ex:warehouseType`, and local Flow-Code-like route language must not become canonical MCP language. The MCP-facing model should adapt those ideas to `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg`, and `WarehouseHandlingProfile.confirmedFlowCode`.

## Table Stakes

Features users will expect. Missing these makes the merged MCP feel incomplete for daily SCM/logistics work.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Any-key operational resolver | Operators start from whatever key they have: HVDC CODE, BL No., BOE No., invoice no., package no., container no., PO no., or site code. | High | Build this first as a read-only resolver. Use `hvdc-code-mapping-v2.6.2.json` header normalization and PKGS/OFCO/DSV/PAY join-recovery rules, then return canonical shipment context instead of local `ex:Case` as the public answer shape. |
| Operational Risk Radar | The project goal is one reliable risk view across cost, customs, OOG/HS, milestones, documents, warehouse status, and next action. | High | This should be the primary operator view. It should aggregate existing query ideas from `queries/03-invoice-risk-analysis.rq`, `queries/04-oog-hs-risk-assessment.rq`, and `queries/operational-queries.rq`. |
| CostGuard Evidence Pack | Invoice review needs evidence before dispute, approval, or overcharge judgment. | High | Show invoice line, BOE/CIPL/tariff evidence, VAT/duty presence, warehouse evidence where relevant, risk reason, confidence, and missing inputs. Do not issue final dispute judgment without source evidence. |
| HS/OOG and customs risk view | Heavy cargo, controlled HS codes, and customs delays are high-impact daily risks in HVDC logistics. | Medium | Reuse weight tiers, HS categories, OOG criteria, customs clearance performance, and document completeness concepts. Map local HS/OOG outputs to canonical cargo, routing, and milestone language. |
| Shipment timeline and milestone view | Operators need to see where a shipment is and what event blocks the next step. | Medium | Reuse the case timeline query, but translate `TransportEvent` and `FINAL_OUT` into canonical `MilestoneEvent`, `JourneyStage`, and site receipt status. |
| Warehouse stock and movement summary | Warehouse status is a basic operational need, especially for inbound, outbound, net movement, and closing stock. | Medium | Use the monthly warehouse stock query as a V1 report. Keep Flow Code strictly warehouse-internal through `WarehouseHandlingProfile.confirmedFlowCode`. |
| DEM/DET and free-time KPI | Demurrage and detention are direct cost risks that operators monitor by port, terminal, container type, and month. | Medium | Reuse operational queries for demurrage, detention, and free-time utilization. Tie results to the resolver so the user can drill into affected shipments. |
| Document completeness and evidence status | Logistics work depends on CI, PL, BL, BOE, DO, MRR, POD/GRN, and related evidence. | Medium | Show required-vs-complete status, source document references, and no-evidence states. This should be read-only in V1. |
| Bounded NLQ-to-SPARQL lookup | Operators will ask natural questions, but the tool must stay safe and predictable. | Medium | Support approved read-only intents only. Preserve SELECT-only checks, forced `LIMIT`, and no destructive SPARQL operations. |
| Audit and provenance summary | Users need to know why a result is trusted and where it came from. | Medium | Reuse CSV/NDJSON audit concepts, hash verification, and provenance mapping ideas, but redact domain-sensitive identifiers in public or shared outputs. |
| Semantic adapter layer | The merge cannot work if local sample vocabulary leaks into the production ontology. | High | This is a prerequisite, not a cosmetic refactor. It converts local `Case`, `TransportEvent`, `StockSnapshot`, and `Invoice` shapes to the canonical MCP model. |
| Read-only MCP tool contract | The first production merge should not add graph writes or upload actions. | Medium | Expose resolver, radar, evidence pack, timeline, warehouse summary, and KPI reads through MCP tools with explicit schemas and `readOnlyHint: true` where applicable. |

## Differentiators

Features that make the merge more useful than a simple dashboard or query wrapper.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Evidence-backed next-action card | Turns raw risk signals into an operator decision aid. | Medium | For each risk, return category, evidence, confidence, blocking inputs, owner cue if known, and one next action. Keep the card read-only unless the user explicitly requests registration/escalation. |
| Multi-source HVDC code recovery | Recovers operational context even when OFCO, DSV, or PAY rows lack HVDC CODE. | High | Use mapping rules that join from PKGS/OFCO/DSV/PAY by PO, supplier, invoice, BL, container, package, payment ref, and amount. Surface match confidence and fallback status. |
| Cross-risk correlation by shipment | Shows when invoice, customs, document, cargo, and milestone risks point to the same operational blockage. | High | The value is not five separate reports. The value is one merged risk story for the shipment or package. |
| No-evidence and contradiction handling | Prevents false confidence when local data is missing, stale, or inconsistent. | Medium | Return `NO_EVIDENCE`, `PARTIAL_EVIDENCE`, or `CONFLICTING_EVIDENCE` states instead of guessing. This is essential because local artifacts and generated data are mixed with source files. |
| Warehouse-only Flow Code guardrail | Protects the production ontology from a known semantic failure mode. | Medium | Flag route, customs, invoice, marine, or KPI uses of Flow Code as invalid unless they are explicitly migrated or deprecated. |
| Read-only MCP facade over local analytics | Lets production MCP harvest useful Fuseki analytics without exposing local Flask/ngrok as the public surface. | Medium | Cloudflare MCP remains the public boundary. Local Fuseki can serve staging, offline validation, or internal analytics behind a typed contract. |
| Operator-safe risk drilldown | Lets users move from a risk radar summary into the evidence rows, timeline events, and source IDs that explain it. | Medium | This is better than static query output because the user can follow the reason chain from alert to evidence. |
| Explainable matching confidence | Makes join-recovered keys operationally trustworthy. | Medium | Show matched fields, match method, confidence tier, and fallback reason for recovered HVDC context. |

## Anti-Features / Out of Scope

Features to explicitly avoid for V1.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| A second public Flask/OpenAPI/ngrok API | It would split the public client surface and conflict with the production Cloudflare MCP direction. | Keep Cloudflare MCP as the public endpoint and treat Flask/ngrok as local development or staging only. |
| Direct graph writes from chat | Current local APIs expose ingest and Fuseki deployment without production-grade auth, scopes, or human gates. | Start with read-only tools. Add write actions only after auth, scope checks, AuditRecord creation, and explicit human approval exist. |
| Promoting local `ex:Case` as canonical | The parent ontology requires shipment, journey, milestone, leg, evidence, and warehouse profile concepts. | Add a semantic adapter and keep local sample vocabulary behind the adapter. |
| Using Flow Code as route, customs, cost, marine, or KPI language | Repository rules define Flow Code as warehouse handling only. | Use `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg`, and route-based cost/customs concepts outside the warehouse boundary. |
| Treating the Claude Native bridge as an MCP server | The codebase map identifies it as a Flask bridge, not a first-class MCP implementation. | Use it only as legacy/local bridge evidence. Build MCP contracts in the production MCP layer. |
| Public upload or arbitrary spreadsheet ingestion in V1 | Upload paths, file constraints, malware/content validation, and quotas are not safe enough for public use. | Defer upload. Use curated read-only data and controlled staging validators first. |
| Dashboard variants that call SPARQL directly | The workspace has duplicated dashboard scripts and generated HTML with fragile direct query behavior. | Route dashboard reads through one stable read API or MCP tool contract. |
| Black-box risk scores | Operators need evidence, not unexplained labels. | Return risk reason, evidence source, confidence, and missing data alongside any score. |
| Treating generated artifacts as current truth | Logs, audit outputs, extracted TTL, health reports, and generated schemas can be stale or machine-specific. | Treat artifacts as evidence snapshots only when their provenance and timestamp are shown. |
| Production claims from local-only tests | Local Fuseki and Flask checks do not prove Cloudflare MCP readiness. | Separate local validation, MCP contract tests, and production deployment checks. |

## Feature Dependencies

```text
Semantic adapter -> Any-key resolver
Semantic adapter -> Operational Risk Radar
Semantic adapter -> CostGuard Evidence Pack
Semantic adapter -> Shipment timeline and milestone view

Any-key resolver -> Operational Risk Radar
Any-key resolver -> CostGuard Evidence Pack
Any-key resolver -> Shipment timeline and milestone view
Any-key resolver -> Warehouse stock drilldown
Any-key resolver -> DEM/DET and customs drilldown

Evidence/provenance model -> CostGuard Evidence Pack
Evidence/provenance model -> No-evidence and contradiction handling
Evidence/provenance model -> Evidence-backed next-action card

Read-only MCP tool contract -> Operational Risk Radar
Read-only MCP tool contract -> Bounded NLQ-to-SPARQL lookup
Read-only MCP tool contract -> Operator-safe risk drilldown

Flow Code guardrail -> Warehouse stock and movement summary
Flow Code guardrail -> Operational Risk Radar
Flow Code guardrail -> Cost and customs risk views

Auth, scopes, and human-gated audit -> Any future upload/write/action feature
Upload quarantine and file validation -> Any future spreadsheet ingestion feature
Centralized configuration -> Any production use of Fuseki-backed analysis
```

## Recommended V1 Feature Bundle

V1 should be a read-only operator risk and evidence bundle. It should combine the visible value of the Operational Risk Radar with the minimum resolver needed to make every result traceable.

Prioritize:

1. **Any-key Resolver**
   - Input: HVDC CODE, invoice no., BL No., BOE No., package no., container no., PO no., or site code.
   - Output: canonical shipment/package context, matched fields, source systems, confidence, and no-evidence state.
   - Why first: every useful operator feature depends on finding the right operational context.

2. **Operational Risk Radar**
   - Input: resolved context or broad operational filter such as risk type, status, month, warehouse, customs office, or supplier.
   - Output: cost, HS/OOG, customs, DEM/DET, document, milestone, and warehouse risk cards with evidence and one next action.
   - Why first: this is the project-level core value and gives immediate SCM value without write tools.

3. **CostGuard Evidence Pack**
   - Input: invoice number, supplier, PO, package, or resolved shipment context.
   - Output: invoice anomaly flags, VAT/duty checks, linked BOE/CIPL/tariff/warehouse evidence, confidence, missing inputs, and review stance.
   - Why first: invoice disputes require evidence-backed decisions, and existing local queries/rules already support this direction.

4. **HS/OOG and Customs Risk Detail**
   - Input: resolved shipment/package/cargo context.
   - Output: weight tier, OOG trigger, HS category, customs delay, document completeness, and handling notes.
   - Why first: high-weight and controlled-code shipments have high operational impact.

5. **Shipment Timeline and Milestone View**
   - Input: resolved shipment/package/case key.
   - Output: canonical milestone sequence, current stage, late/missing milestone, final delivery or site receipt state, and source event evidence.
   - Why first: operators need the reason behind a risk, not just the risk label.

6. **Warehouse Stock Summary**
   - Input: warehouse, month, project/site, package, or material filter.
   - Output: inbound, outbound, net movement, average closing stock, and warehouse-only handling context.
   - Why first: it reuses a strong query asset while respecting the Flow Code boundary.

Defer:

| Feature | Reason to Defer |
|---------|-----------------|
| Upload/write tools | Need auth, scoped permissions, upload quarantine, human gate, and audit mutation model first. |
| Direct Fuseki deploy from MCP | Current graph update paths are too broad for public use and need graph URI allowlists, size limits, locks, and rollback tests. |
| Full dashboard rewrite | The V1 value is the read contract and evidence model. UI can follow after stable tools exist. |
| Predictive ETA and MRR drafting | Gateway examples exist, but they are secondary to risk evidence lookup and need production contract review. |
| Public ngrok/GPTs Actions path | Production direction is Cloudflare MCP, so ngrok should stay dev-only. |
| Autonomous dispute/approval decisions | The system should prepare evidence and next action; humans decide approval, dispute, or escalation. |

## Suggested MCP Tool Shape

Use small read-only tools first:

| Tool | Purpose | Key Output |
|------|---------|------------|
| `resolve_hvdc_operational_key` | Resolve any supported logistics key to canonical context. | matched entity, source systems, confidence, related identifiers |
| `get_operational_risk_radar` | Return cross-domain risk cards for a context or filter. | risk cards, evidence refs, next action, confidence |
| `get_costguard_evidence_pack` | Explain invoice risk and supporting evidence. | invoice checks, linked BOE/CIPL/tariff/warehouse evidence |
| `get_hs_oog_customs_risk` | Explain cargo, HS, OOG, and customs exposure. | risk tier, trigger fields, customs/doc status |
| `get_shipment_milestone_timeline` | Show movement and milestone history. | canonical milestone list, current stage, missing/late events |
| `get_warehouse_stock_summary` | Summarize warehouse movement and stock. | inbound, outbound, net movement, average closing stock |
| `search_evidence_for_context` | Return source evidence snippets and audit/provenance status. | source refs, freshness, no-evidence or contradiction state |

## Sources

- `.planning/PROJECT.md` - project value, V1 direction, constraints, and out-of-scope boundaries.
- `.planning/config.json` - GSD workflow context and local search/tooling flags.
- `.planning/codebase/STRUCTURE.md` - source locations for API, query, mapping, audit, Fuseki, gateway, and generated artifacts.
- `.planning/codebase/ARCHITECTURE.md` - component boundaries, data flow, MCP/Cloudflare merge implications, and anti-patterns.
- `.planning/codebase/TESTING.md` - validation commands, live-service boundaries, SPARQL safety checks, and MCP testing gates.
- `.planning/codebase/CONCERNS.md` - security, scaling, semantic-alignment, and missing-feature risks.
- `queries/01-monthly-warehouse-stock.rq` - monthly warehouse movement and stock feature source.
- `queries/02-case-timeline-events.rq` - shipment/case timeline and final delivery tracking feature source.
- `queries/03-invoice-risk-analysis.rq` - invoice anomaly and CostGuard evidence feature source.
- `queries/04-oog-hs-risk-assessment.rq` - OOG, HS code, weight-tier, and cargo risk feature source.
- `queries/operational-queries.rq` - HS risk, OOG cost, DEM/DET, cost efficiency, dashboard, alert, document, and customs KPI feature source.
- `hvdc-code-mapping-v2.6.2.json` - identifier normalization, source-system join recovery, validation rules, and risk-scoring inputs.
