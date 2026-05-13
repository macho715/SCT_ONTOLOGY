# Operational Risk Radar Contract

## Purpose

The Operational Risk Radar is a read-only evidence review boundary for Phase 4.
It consumes the Phase 3 any-key resolver and returns risk cards for a resolved shipment, package, invoice, or site context.

This contract covers requirements `RISK-01`, `RISK-02`, `RISK-03`, `RISK-04`, `RISK-05`, `RISK-06`, `COST-01`, `COST-02`, `COST-03`, and `COST-04`.

## Read-only Boundary

The radar and CostGuard Evidence Pack must not:

- write files
- mutate graph data
- upload files
- create OAuth state
- approve invoices
- dispute invoices
- pay invoices
- send email
- escalate workflow state
- commit operational truth

The output is evidence review only.

## Output Types

### `OperationalRiskRadarResult`

Required fields:

- `dataStatus`
- `objectType`
- `query`
- `resolvedContext`
- `riskSummary`
- `riskCards`
- `evidenceRefs`
- `missingInputs`
- `privacy`
- `actionBoundary`
- `nextAction`

### `RiskCard`

Every risk card must include:

- `riskType`
- `status`
- `severity`
- `confidence`
- `evidenceRefs`
- `missingInputs`
- `ownerCue`
- `nextAction`
- `reviewStance`

### `CostGuardEvidencePack`

Required fields:

- `invoiceIdentity`
- `invoiceLines`
- `linkedEvidence`
- `warehouseEvidence`
- `costGuardResult`
- `evidenceRefs`
- `missingInputs`
- `reviewStance`
- `actionBoundary`
- `nextAction`

## Risk Dimensions

Phase 4 must cover these dimensions when evidence exists:

- `COST_GUARD`
- `INVOICE_TAX`
- `TARIFF_DUTY`
- `HS_OOG`
- `CUSTOMS`
- `DEM_DET`
- `MILESTONE`
- `DOCUMENT`
- `WAREHOUSE`

Missing evidence must be represented with `MISSING_EVIDENCE`.

## Severity

Use this order:

1. `CRITICAL`
2. `HIGH`
3. `WARN`
4. `INFO`
5. `PASS`
6. `NO_EVIDENCE`

The radar must rank higher-severity cards first.

## Evidence Rules

Each card must contain at least one `EvidenceRef` when evidence exists.

Each card must show missing evidence through `missingInputs`.

The system must not convert missing evidence into an unsupported overcharge, customs, warehouse, or site-delivery judgment.

## CostGuard Evidence Pack Rules

The pack may link:

- invoice line evidence
- BOE evidence
- CIPL evidence
- tariff evidence
- VAT evidence
- duty evidence
- warehouse evidence

The pack must separate evidence review from final finance action.
It may return `REVIEW_REQUIRED` or `EVIDENCE_MISSING`.
It must not claim that an invoice is approved, disputed, or paid.

## Flow Code Boundary

Warehouse evidence may reference warehouse handling context only.

The radar must not use Flow Code as:

- route classification
- customs status
- marine routing
- invoice ownership
- cost ownership
- KPI bucket for end-to-end movement

Route and movement status must use `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, and `JourneyLeg`.

## Verification

Phase 4 completion requires:

```powershell
python -m py_compile hvdc_operational_risk_radar.py hvdc_any_key_resolver.py hvdc_semantic_adapter.py
python -m pytest test_operational_risk_radar.py -v --tb=short
python -m pytest test_any_key_resolver.py -v --tb=short
python -m pytest test_semantic_adapter.py -v --tb=short
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-operational-risk-radar.ps1
```
