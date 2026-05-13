# Any-key Resolver Contract

## Purpose

The any-key resolver is a read-only lookup boundary for Phase 3.
It accepts supported HVDC operational identifiers and returns canonical context with evidence, source fields, confidence, and privacy-safe excerpts.

This contract covers requirements `RESOLVE-01`, `RESOLVE-02`, `RESOLVE-03`, `RESOLVE-04`, `EVID-01`, `EVID-02`, `EVID-03`, and `TEST-03`.

## Read-only Boundary

The resolver must not:

- write files
- mutate graph data
- upload files
- create OAuth state
- call remote services
- commit operational truth

The resolver may read a local fixture/index file and return deterministic JSON-serializable dictionaries.

## Supported Identifier Schemes

| Scheme | Examples | Purpose |
| --- | --- | --- |
| `HVDC_CODE` | `HVDC-ADOPT-SCT-0001` | Primary engineering/logistics tag |
| `PACKAGE_NO` | `PKG-AGI-0001` | Package lookup |
| `CASE_NO` | `CASE-2026-0001` | Case lookup |
| `BL_NO` | `BL-0049` | Bill of lading lookup |
| `CONTAINER_NO` | `CONT-AMB-01`, `MSCU1234567` | Container lookup |
| `INVOICE_NO` | `INV-2026-0002` | Invoice lookup |
| `PO_NO` | `PO-2026-7788` | Procurement lookup |
| `BOE_NO` | `BOE-2026-0001` | Customs lookup |
| `DO_NO` | `DO-2026-0001` | Delivery order lookup |
| `SITE_CODE` | `AGI`, `DAS`, `MIR`, `MOSB` | Site lookup |
| `VENDOR_CODE` | `VEND-001` | Vendor lookup |

## Normalization

Normalization is deterministic and conservative:

- trim leading and trailing whitespace
- uppercase values
- convert spaces and underscores to hyphens
- collapse repeated hyphens
- do not infer operational truth from a partial key

## Resolver Statuses

| Status | Meaning |
| --- | --- |
| `MATCHED` | One candidate matched the key |
| `AMBIGUOUS` | More than one candidate matched the key |
| `NOT_FOUND` | The scheme is supported but no evidence matched |
| `CONFLICTING_EVIDENCE` | Sources disagree on material fields |
| `UNSUPPORTED_KEY` | The key is empty or not supported |
| `MASKED` | A value was masked before user-facing output |

## Confidence

Confidence is a decimal between `0.0` and `1.0`.

| Range | Use |
| --- | --- |
| `0.90` to `1.00` | Strong single-source or joined match |
| `0.60` to `0.89` | Useful but needs source review |
| `0.01` to `0.59` | Ambiguous or conflicting evidence |
| `0.00` | No evidence or unsupported key |

## Response Shape

Every resolver response must include:

- `query`
- `detectedScheme`
- `normalizedKey`
- `status`
- `confidence`
- `canonicalContext`
- `sourceFields`
- `evidenceRefs`
- `evidenceState`
- `privacy`
- `nextAction`

## Evidence State

`evidenceState` must include:

- `status`
- `candidateCount`
- `missingEvidence`
- `conflicts`

Ambiguous or conflicting evidence must be surfaced as a state.
The resolver must not force a single answer when the evidence is not decisive.

## Source Fields

`sourceFields` must show what matched:

- `sourceSystem`
- `sourceField`
- `sourceValue`
- `recordRef`

Raw source rows are not exposed by default.
Only user-safe evidence excerpts are returned.

## Privacy-safe Output

The resolver masks:

- local file paths
- email addresses
- bearer tokens and token-like strings
- OpenAI-style secret keys
- MCP token-like strings
- Cloudflare-style 32-character account IDs

The `privacy` block must include:

- `rawEvidenceExposed`
- `piiMasked`
- `maskingApplied`

## Canonical Semantics Boundary

Resolver output must preserve the Phase 2 semantic adapter boundary.

Allowed:

- `RoutingPattern`
- `JourneyStage`
- `MilestoneEvent`
- `JourneyLeg`
- `WarehouseHandlingProfile.confirmedFlowCode` only for warehouse handling evidence
- `EvidenceRef`

Not allowed:

- `assignedFlowCode`
- `extractedFlowCode`
- Flow Code as route, customs, marine, cost, or KPI lifecycle language
- local public `Case`, `TransportEvent`, `StockSnapshot`, or `Invoice` object types

## Verification

Phase 3 completion requires:

```powershell
python -m py_compile hvdc_any_key_resolver.py hvdc_semantic_adapter.py
python -m pytest test_any_key_resolver.py -v --tb=short
python -m pytest test_semantic_adapter.py -v --tb=short
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-any-key-resolver.ps1
```
