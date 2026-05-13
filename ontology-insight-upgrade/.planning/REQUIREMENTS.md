# Requirements

## Project

HVDC Ontology Insight MCP Merge

## Scope Summary

V1 is a read-only operator risk and evidence lookup product. It reuses the local HVDC Ontology Insight prototype as a source of analysis ideas, but exposes production value through the HVDC ontology MCP direction rather than local Flask, direct Fuseki, ngrok, or GPTs Actions.

## v1 Requirements

### Repository Hygiene

- [x] **HYGIENE-01**: The project can distinguish source files from generated artifacts, logs, backups, runtime health reports, and sample evidence outputs.
- [x] **HYGIENE-02**: The project documents the broken nested Git state and defines whether work continues in a repaired repository, clean clone, or file-hash-only mode.
- [x] **HYGIENE-03**: The project marks ngrok/GPTs Actions files as development or migration references, not production public surfaces.

### Semantic Adapter

- [x] **SEM-01**: The system maps local `Case`, `TransportEvent`, `StockSnapshot`, `Invoice`, and query-result shapes into canonical HVDC MCP objects before public output.
- [x] **SEM-02**: The system keeps Flow Code warehouse-only under `WarehouseHandlingProfile.confirmedFlowCode`.
- [x] **SEM-03**: The system uses `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, and `JourneyLeg` for route, customs, marine, and milestone visibility.
- [x] **SEM-04**: The system returns `NO_EVIDENCE`, ambiguity, or conflict states instead of forcing uncertain joins.
- [x] **SEM-05**: The system validates local SPARQL/rule outputs against the canonical ontology boundary before MCP exposure.

### Any-key Resolver

- [x] **RESOLVE-01**: User can enter an HVDC CODE and receive the related shipment/package/evidence context.
- [x] **RESOLVE-02**: User can enter BL No., BOE No., Invoice No., Package No., PO No., container no., or site code and receive matched context with confidence.
- [x] **RESOLVE-03**: User can see which source fields matched and which source system supplied the evidence.
- [x] **RESOLVE-04**: User can see alternate candidates when an identifier match is ambiguous.

### Operational Risk Radar

- [x] **RISK-01**: User can request a consolidated risk view for a resolved shipment, package, invoice, or site context.
- [x] **RISK-02**: The risk view includes CostGuard, invoice, tariff, VAT, and duty status when cost evidence exists.
- [x] **RISK-03**: The risk view includes HS/OOG and customs exposure when cargo, HS, BOE, or document evidence exists.
- [x] **RISK-04**: The risk view includes DEM/DET, milestone, timeline, and document-completeness risks when query evidence exists.
- [x] **RISK-05**: The risk view includes warehouse stock or movement context without using Flow Code as route or cost language.
- [x] **RISK-06**: Every risk card includes status, confidence, evidence reference, missing inputs, owner cue, and one next action.

### CostGuard Evidence Pack

- [x] **COST-01**: User can request a CostGuard Evidence Pack for an invoice or related operational key.
- [x] **COST-02**: The evidence pack links invoice lines to BOE, CIPL, tariff, VAT, duty, and warehouse evidence where available.
- [x] **COST-03**: The evidence pack clearly separates evidence review from final approval, dispute, or payment action.
- [x] **COST-04**: The evidence pack returns missing evidence and review stance instead of unsupported overcharge judgments.

### MCP Public Surface

- [x] **MCP-01**: V1 exposes read-only MCP tools for key resolution, risk radar, CostGuard evidence, evidence search, and validation.
- [x] **MCP-02**: V1 tool outputs use structured content with evidence references and operator-readable summaries.
- [x] **MCP-03**: V1 does not expose raw SPARQL, direct Fuseki graph update, local Flask routes, or ngrok URLs to production users.
- [x] **MCP-04**: V1 tools do not mutate graph data, shipment state, invoice state, warehouse truth, email state, or approval records.
- [x] **MCP-05**: Future upload/write/action tools are separated behind explicit scopes, human gates, audit records, and rollback design.

### Evidence, Audit, and Privacy

- [x] **EVID-01**: Each public answer includes evidence references, source type, confidence, and validation state.
- [x] **EVID-02**: Audit/event concepts remain evidence-layer data and do not directly mutate operational truth.
- [x] **EVID-03**: Sensitive identifiers, local file paths, credentials, tokens, private links, and personal data are masked according to the chosen policy.
- [x] **EVID-04**: Audit claims distinguish prototype local CSV/NDJSON evidence from production audit identity and retention.

### Verification

- [x] **TEST-01**: Adapter fixtures prove local query outputs map to canonical MCP objects.
- [x] **TEST-02**: Flow Code tests block route, customs, marine, cost, and KPI usage outside warehouse handling.
- [x] **TEST-03**: Resolver tests cover exact match, ambiguous match, missing evidence, and conflicting evidence.
- [x] **TEST-04**: MCP contract tests cover malformed input, no evidence, structured output, read-only annotations, and secret redaction.
- [x] **TEST-05**: Live-service checks are reported separately from unit or contract tests.
- [x] **TEST-06**: Warnings, skips, and partial probes do not produce PASS claims.

## v2 Requirements

- [ ] **WRITE-01**: User can create upload URLs only after upload quarantine, content validation, scopes, and audit design exist.
- [ ] **WRITE-02**: User can create dry-run write proposals only after human-gate and rollback design exist.
- [ ] **WRITE-03**: User can commit approved graph or file writes only through scoped, audited, rollback-tested paths.
- [ ] **UI-01**: User can view a dedicated risk radar widget after read-only MCP structured output stabilizes.
- [ ] **PREDICT-01**: User can request ETA prediction or MRR draft only after source evidence, model limitations, and approval boundaries are explicit.

## Out of Scope for V1

- Public ngrok/GPTs Actions production operation.
- Direct public access to local Flask APIs.
- Direct public access to Fuseki SPARQL or update endpoints.
- Direct graph deployment from chat.
- Arbitrary spreadsheet upload or ingestion.
- Autonomous invoice approval, dispute filing, payment approval, shipment mutation, email sending, or escalation.
- Treating local sample `ex:Case` vocabulary as canonical production ontology language.
- Treating Flow Code as route, customs, marine, cost, or KPI language.

## Requirement Traceability

| Requirement | Planned Phase | Status |
|-------------|---------------|--------|
| HYGIENE-01 | Phase 1 - Source Hygiene & Read-only Boundary | Completed |
| HYGIENE-02 | Phase 1 - Source Hygiene & Read-only Boundary | Completed |
| HYGIENE-03 | Phase 1 - Source Hygiene & Read-only Boundary | Completed |
| SEM-01 | Phase 2 - Canonical Semantic Adapter & Guardrails | Completed |
| SEM-02 | Phase 2 - Canonical Semantic Adapter & Guardrails | Completed |
| SEM-03 | Phase 2 - Canonical Semantic Adapter & Guardrails | Completed |
| SEM-04 | Phase 2 - Canonical Semantic Adapter & Guardrails | Completed |
| SEM-05 | Phase 2 - Canonical Semantic Adapter & Guardrails | Completed |
| RESOLVE-01 | Phase 3 - Any-key Resolver & Evidence Contract | Completed |
| RESOLVE-02 | Phase 3 - Any-key Resolver & Evidence Contract | Completed |
| RESOLVE-03 | Phase 3 - Any-key Resolver & Evidence Contract | Completed |
| RESOLVE-04 | Phase 3 - Any-key Resolver & Evidence Contract | Completed |
| RISK-01 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| RISK-02 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| RISK-03 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| RISK-04 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| RISK-05 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| RISK-06 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| COST-01 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| COST-02 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| COST-03 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| COST-04 | Phase 4 - Operational Risk Radar & CostGuard Evidence | Completed |
| MCP-01 | Phase 5 - Read-only MCP Surface & Release Verification | Completed |
| MCP-02 | Phase 5 - Read-only MCP Surface & Release Verification | Completed |
| MCP-03 | Phase 5 - Read-only MCP Surface & Release Verification | Completed |
| MCP-04 | Phase 5 - Read-only MCP Surface & Release Verification | Completed |
| MCP-05 | Phase 5 - Read-only MCP Surface & Release Verification | Completed |
| EVID-01 | Phase 3 - Any-key Resolver & Evidence Contract | Completed |
| EVID-02 | Phase 3 - Any-key Resolver & Evidence Contract | Completed |
| EVID-03 | Phase 3 - Any-key Resolver & Evidence Contract | Completed |
| EVID-04 | Phase 1 - Source Hygiene & Read-only Boundary | Completed |
| TEST-01 | Phase 2 - Canonical Semantic Adapter & Guardrails | Completed |
| TEST-02 | Phase 2 - Canonical Semantic Adapter & Guardrails | Completed |
| TEST-03 | Phase 3 - Any-key Resolver & Evidence Contract | Completed |
| TEST-04 | Phase 5 - Read-only MCP Surface & Release Verification | Completed |
| TEST-05 | Phase 1 - Source Hygiene & Read-only Boundary | Completed |
| TEST-06 | Phase 1 - Source Hygiene & Read-only Boundary | Completed |

---
*Last updated: 2026-05-13 after Phase 5 execution*
