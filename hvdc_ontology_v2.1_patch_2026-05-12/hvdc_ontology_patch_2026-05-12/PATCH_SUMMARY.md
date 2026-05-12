# HVDC Ontology Patch Summary — v2.1 Flow Boundary Hardening

- Patch date: `2026-05-12`
- Timezone: `Asia/Dubai`
- Bundle: `HVDC_Logistics_Ontology_v2.1_flow_boundary_hardening_2026-05-12`
- Validation result: `PASS`

## 1. Patch intent

This patch removes the remaining ambiguity between end-to-end route semantics and warehouse handling semantics.

Canonical rule after patch:

```text
Shipment route/state  = ShipmentRoutingPattern + JourneyStage + JourneyLeg + MilestoneEvent
Warehouse handling    = WarehouseHandlingProfile.confirmedFlowCode only
Evidence-only layers  = Document/OCR + Port + Cost + Communication records
MOSB                  = OffshoreStagingNode / MarineInterfaceNode, not Warehouse
```

## 2. Files changed

| File | Change |
|---|---|
| `CONSOLIDATED-00-master-ontology.md` | Replaced route-like `confirmedFlowCode` values with warehouse storage / handling classes aligned to `CONSOLIDATED-02` Section 3.4. Added explicit no-WH / pre-arrival / MOSB-direct prohibition note. |
| `CONSOLIDATED-09-operations.md` | Added missing `PREFIX` declarations to all SPARQL examples so the snippets are copy-paste executable. |
| `AGENTS.md` | Added repository-wide rule requiring master Part 12.3 and WHP extension Section 3.4 to keep the same `confirmedFlowCode` dictionary. |
| `HVDC_Logistics_Ontology.combined.md` | Regenerated from patched consolidated documents. |
| `scripts/validate_logi_ontology_docs.py` | Added executable semantic guard for Flow Code leakage, MOSB class collapse, master/WHP dictionary alignment, and SPARQL prefix completeness. |

## 3. Confirmed Flow Code dictionary after patch

| Code | Canonical WH handling class | Korean name | Meaning |
|---:|---|---|---|
| 0 | `STANDARD_INDOOR` | 표준 실내 | Standard dry indoor storage |
| 1 | `STANDARD_OUTDOOR` | 표준 야적 | Standard outdoor / covered yard storage |
| 2 | `SPECIAL_INDOOR` | 특수 실내 | Temperature, humidity, shock, precision, preservation, or high-value indoor handling |
| 3 | `SPECIAL_OUTDOOR` | 특수 야적 | Covered yard, dunnage, corrosion protection, oversized yard control, or abnormal outdoor handling |
| 4 | `HAZMAT_DG` | 위험물 | DG / hazardous cargo segregated storage |
| 5 | `OOG_ABNORMAL` | 초대형·이상화물 | OOG/heavy/abnormal cargo requiring engineered handling |

## 4. Explicitly not encoded in `confirmedFlowCode`

| Route / state concept | Correct field |
|---|---|
| `PRE_ARRIVAL` | `ShipmentRoutingPattern` or pre-arrival milestone state |
| `DIRECT` | `ShipmentRoutingPattern` |
| `WH_ONLY` | `ShipmentRoutingPattern` |
| `MOSB_DIRECT` | `ShipmentRoutingPattern` / `MarineRoutingPattern` |
| `WH_MOSB` | `ShipmentRoutingPattern` / `MarineRoutingPattern` |
| `MIXED` | `ShipmentRoutingPattern` with exception/review evidence |
| No-WH / bypass shipment | no confirmed WHP class unless real M110/M111 warehouse evidence exists |

## 5. Validation command

```bash
cd hvdc_ontology_patch_2026-05-12
python3 scripts/validate_logi_ontology_docs.py
```

Expected output:

```text
PASS
- Flow Code route leakage: 0.00 blockers
- Master/WHP confirmedFlowCode dictionary alignment: PASS
- MOSB top-level Warehouse typing: 0.00 blockers
- CONSOLIDATED-09 SPARQL prefix completeness: PASS
```

## 6. Human-gate

Keep Human-gate mandatory for:

- `HAZMAT_DG` (`confirmedFlowCode = 4.00`)
- `OOG_ABNORMAL` (`confirmedFlowCode = 5.00`)
- high-value invoice / cost object over `100,000.00 AED`
- AGI/DAS site arrival where `M130` exists but required MOSB/LCT evidence is missing

