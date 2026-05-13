# Phase 2 Research: Canonical Semantic Adapter & Guardrails

**Phase:** 2 - Canonical Semantic Adapter & Guardrails
**Researched:** 2026-05-13
**Mode:** inline current Codex session
**Context status:** No phase `CONTEXT.md` exists. This research uses `PROJECT.md`, `ROADMAP.md`, `REQUIREMENTS.md`, Phase 1 summary, codebase maps, local source inspection, and parent canonical ontology docs.

## Purpose

Phase 2 must prevent local prototype vocabulary from leaking into future MCP answers.

The local prototype is useful, but its public output cannot expose `Case`, `TransportEvent`, `StockSnapshot`, or local `Invoice` shapes as canonical production objects. Public MCP-facing output must use canonical HVDC language: `ShipmentUnit`, `ShipmentRoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg`, evidence objects, cost/customs context, and warehouse-only `WarehouseHandlingProfile.confirmedFlowCode`.

## Local Findings

Local prototype vocabulary appears in these active source and fixture areas:

- `hvdc-code-mapping-v2.6.2.json` maps local `Case`, `Invoice`, `Package`, `CargoItem`, and `HSCode` classes to `ex:*` terms.
- `queries/01-monthly-warehouse-stock.rq` reads `ex:StockSnapshot` and `ex:warehouseType`.
- `queries/02-case-timeline-events.rq` reads `ex:TransportEvent` and `ex:belongsToCase`.
- `queries/03-invoice-risk-analysis.rq` reads local `ex:Invoice` and invoice risk fields.
- `queries/04-oog-hs-risk-assessment.rq` reads local `ex:CargoItem`, HS, and OOG fields.
- `queries/operational-queries.rq`, dashboard scripts, and Fuseki validation scripts repeatedly use `ex:Case`.
- `hvdc_rules.py` returns local rule alerts with `case_id`, `hvdc_code`, severity, and evidence, but not canonical evidence status or MCP output shape.
- `nlq_to_sparql.py` generates SELECT-only SPARQL, but the resulting shapes are still local `ex:*` query outputs.

## Canonical Findings

Parent canonical docs establish the Phase 2 target boundary:

- `../ontology/CONSOLIDATED-00-master-ontology.md` states that any key resolves to one operational twin, routing uses `RoutingPattern`, execution uses `MilestoneEvent`, evidence uses documents, and warehouse handling uses `WarehouseHandlingProfile` only.
- `../ontology/CONSOLIDATED-00-master-ontology.md` defines `ShipmentRoutingPattern`, `JourneyStage`, `JourneyLeg`, `MilestoneEvent`, and validation checks such as `V-FLOW-001`.
- `../ontology/CONSOLIDATED-02-warehouse-flow.md` limits `confirmedFlowCode` to `WarehouseHandlingProfile` after warehouse evidence.
- `../ontology/CONSOLIDATED-03-document-ocr.md` treats OCR/document output as evidence only, not route or warehouse truth.
- `../ontology/CONSOLIDATED-04-barge-bulk-cargo.md` uses `MarineRoutingPattern` for marine legs and keeps route truth separate.
- `../ontology/CONSOLIDATED-05-invoice-cost.md` treats cost as invoice/rate evidence and blocks cost-owned Flow Code semantics.
- `../ontology/CONSOLIDATED-09-operations.md` consumes route, milestone, stock, and cost semantics without redefining them.

## Adapter Direction

Create a small importable Python adapter first.

Recommended source file:

- `hvdc_semantic_adapter.py`

Recommended contract file:

- `docs/SEMANTIC-ADAPTER-CONTRACT.md`

Recommended fixtures:

- `fixtures/semantic_adapter/local_case_timeline.json`
- `fixtures/semantic_adapter/local_stock_snapshot.json`
- `fixtures/semantic_adapter/local_invoice_risk.json`
- `fixtures/semantic_adapter/local_conflict_join.json`
- `fixtures/semantic_adapter/expected_canonical_*.json`

Recommended tests:

- `test_semantic_adapter.py`
- `scripts/verify-semantic-guardrails.ps1`

## Canonical Output States

The adapter should use explicit evidence states:

- `PASS`: required evidence exists and mapping is valid.
- `WARN`: mapping is valid but optional evidence is incomplete.
- `BLOCK`: local output violates canonical boundaries.
- `NO_EVIDENCE`: no usable evidence exists for the requested join or object.
- `AMBIGUOUS`: multiple candidates match and the adapter refuses to force one.
- `CONFLICT`: sources disagree on a material field.

## Mapping Targets

| Local shape | Canonical target | Boundary rule |
|---|---|---|
| `Case` | `ShipmentUnit` or `OperationalContext` keyed by identifiers | Do not expose `Case` in public output. |
| `TransportEvent` | `MilestoneEvent` plus optional `JourneyLeg` evidence | Event type maps to milestone/stage, not Flow Code. |
| `StockSnapshot` | `StockSnapshot` plus warehouse evidence | May reference `WarehouseHandlingProfile`; cannot infer route. |
| `Invoice` | `Invoice`, `InvoiceLine`, `CostGuardResult`, evidence refs | Cost reads route/warehouse evidence; does not own route truth. |
| `CargoItem` / HS/OOG | `CargoUnit`, `Material`, `DocumentEvidence`, risk evidence | HS/OOG risk is evidence for risk radar, not a route classifier. |
| join failure | `NO_EVIDENCE`, `AMBIGUOUS`, or `CONFLICT` | Do not force uncertain joins. |

## Guardrails Needed

1. Public adapter output must not contain local class names as top-level production object types.
2. `confirmedFlowCode` can appear only inside `warehouseHandlingProfile`.
3. Route and milestone fields must use `routingPattern`, `journeyStage`, `milestoneEvents`, and `journeyLegs`.
4. Cost output must use `costGuardResult`, `invoiceEvidence`, and `routeBasedCostDriver` only as evidence.
5. Uncertain joins must return `NO_EVIDENCE`, `AMBIGUOUS`, or `CONFLICT`.
6. Validation scripts must distinguish deterministic unit/contract checks from live Fuseki checks.

## Planning Implication

Phase 2 should produce one implementation plan with six tasks:

1. Write the semantic adapter contract document.
2. Implement the adapter module and canonical schemas.
3. Add local-to-canonical fixtures.
4. Add Flow Code and local-vocabulary guardrail tests.
5. Wire local rule/query wrappers to use the adapter at their public-output boundary.
6. Create a Phase 2 summary with file hashes and explicit no-Git evidence mode.

## Risks

- The workspace has no first-class Cloudflare MCP source package yet, so Phase 2 should stop at local adapter and contract tests.
- Parent canonical docs exist outside this nested folder. Plans must reference them, but execution must avoid editing parent ontology docs unless explicitly requested.
- Live Fuseki checks depend on local services and cannot be counted as contract PASS unless services are running.
- Git remains broken in the nested folder, so Phase 2 evidence must remain file-hash based.
