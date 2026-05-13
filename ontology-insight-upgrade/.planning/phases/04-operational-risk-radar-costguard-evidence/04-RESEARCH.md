# Phase 4 Research: Operational Risk Radar & CostGuard Evidence

## Phase

Phase 4: Operational Risk Radar & CostGuard Evidence

## Goal

Users can request one read-only operational risk view and a CostGuard evidence pack for a resolved shipment, package, invoice, or site context.

## Local Findings

### Available foundations from prior phases

- Phase 2 created `hvdc_semantic_adapter.py`.
- Phase 2 exposes canonical contexts for timeline, stock, invoice/rule, no-evidence, ambiguity, and conflict behavior.
- Phase 3 created `hvdc_any_key_resolver.py`.
- Phase 3 resolves supported operational keys and returns confidence, source fields, evidence refs, evidence state, privacy metadata, and next action.
- Phase 4 should consume Phase 3 resolver output instead of creating a second key resolver.

### Existing risk sources

- `hvdc_rules.py` includes rule functions for:
  - `run_costguard`
  - `run_hs_risk`
  - `run_cert_check`
  - `run_all_rules`
  - `run_all_rules_canonical`
- `hvdc_semantic_adapter.py` includes `adapt_invoice_risk` and `canonicalize_rule_results`.
- `nlq_to_sparql.py` contains local query intent coverage for invoice risk, OOG cargo, cost analysis, and HS code risk.
- `queries/03-invoice-risk-analysis.rq` covers invoice risk types such as missing VAT, missing duty, negative amount, and missing date.
- `queries/04-oog-hs-risk-assessment.rq` covers OOG and HS risk.
- `queries/operational-queries.rq` contains HS/OOG, DEM/DET, document completeness, and customs query ideas.
- `queries/01-monthly-warehouse-stock.rq` covers warehouse stock evidence.
- `queries/02-case-timeline-events.rq` covers milestone/timeline evidence.

### Output model needed

The Phase 4 module should create two read-only structures:

1. `OperationalRiskRadarResult`
   - resolved context
   - risk summary
   - risk cards
   - evidence refs
   - missing evidence
   - privacy metadata
   - next action

2. `CostGuardEvidencePack`
   - invoice identity
   - invoice line evidence
   - BOE/CIPL/tariff/VAT/duty links
   - warehouse evidence where available
   - review stance
   - missing evidence
   - non-action boundary

### Risk card dimensions

Minimum dimensions for Phase 4:

- `COST_GUARD`
- `INVOICE_TAX`
- `TARIFF_DUTY`
- `HS_OOG`
- `CUSTOMS`
- `DEM_DET`
- `MILESTONE`
- `DOCUMENT`
- `WAREHOUSE`

Every risk card should include:

- `riskType`
- `status`
- `severity`
- `confidence`
- `evidenceRefs`
- `missingInputs`
- `ownerCue`
- `nextAction`
- `reviewStance`

### Required boundaries

- Risk cards are review aids, not operational mutations.
- CostGuard Evidence Pack is not approval, dispute, or payment authority.
- Missing evidence must stay explicit.
- Flow Code must not be used as route, cost, customs, marine, or KPI language.
- Warehouse handling evidence can mention `WarehouseHandlingProfile.confirmedFlowCode` only under warehouse handling context.
- Phase 4 must remain local and fixture-backed until Phase 5 creates the MCP surface.

## Recommended Implementation Shape

Create:

- `docs/OPERATIONAL-RISK-RADAR-CONTRACT.md`
- `hvdc_operational_risk_radar.py`
- `fixtures/risk_radar/risk_evidence_index.json`
- `fixtures/risk_radar/query_radar_invoice.json`
- `fixtures/risk_radar/expected_radar_invoice.json`
- `fixtures/risk_radar/query_radar_site.json`
- `fixtures/risk_radar/expected_radar_site.json`
- `fixtures/risk_radar/query_costguard_pack.json`
- `fixtures/risk_radar/expected_costguard_pack.json`
- `fixtures/risk_radar/query_missing_evidence.json`
- `fixtures/risk_radar/expected_missing_evidence.json`
- `test_operational_risk_radar.py`
- `scripts/verify-operational-risk-radar.ps1`

Update:

- `README.md` for the Phase 4 verification command.
- Planning files after execution.

## Risks

- Radar cards can become unsupported judgments if evidence is missing. The output must show `missingInputs`.
- CostGuard can be misunderstood as approval or dispute advice. The contract must state review-only behavior.
- Risk vocabulary can drift back into legacy Flow Code route semantics. Tests must reuse semantic guardrails.
- Phase 4 can grow into UI work. UI should remain a future concern unless a minimal structured preview is needed.
