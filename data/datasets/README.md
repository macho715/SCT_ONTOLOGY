# logistics_status → control-tower datasets

Generated from `data/raw/logistics_status.xlsx` via
`scripts/build_logistics_dataset.py`.

The spec separates two semantically distinct column ranges that earlier passes
conflated:

| Source range | Meaning                                         | Output table              |
| ------------ | ----------------------------------------------- | ------------------------- |
| `K:N`        | Destination requirement (배송 요구 현장 flag, `O`)   | `destination_requirement` |
| `BP:CD`      | Actual receipt date at each location/warehouse  | `receipt_event`           |
| `BE:BL`,`CF` | Shipping/customs/final-delivery milestones      | `milestone_event`         |

Important: column order in `K:N` is `SHU/DAS/MIR/AGI`, but `BP:BS` is
`SHU/MIR/DAS/AGI`. Mapping is done by location code, never by positional
order.

## Files

| File                          | Description                                                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `destination_requirement.csv` | One row per `(shipment, destinationCode)` flagged `O` in `K:N`.                                                              |
| `receipt_event.csv`           | One row per non-empty receipt date in `BP:CD`. `matchedRequiredDestination` flags whether the location was declared in `K:N`. |
| `milestone_event.csv`         | ETD/ATD/ETA/ATA/Attestation/DO/Customs/Final delivery events from `BE:BL` and `CF`.                                          |
| `shipment_unit.csv`           | One row per source shipment with derived `declaredDestinationSet`, `currentStage`, `currentLocation`, `routingPattern`, `siteCompletionRate`, `missingRequiredDestination`, `receivedWithoutFlag`. |
| `validation_log.csv`          | Rule hits per `V-DEST-*`, `V-REC-*`, `V-MOSB-*`.                                                                              |
| `action_queue.csv`            | Follow-up actions derived from validation hits, keyed to `ownerRole`.                                                         |
| `_summary.txt`                | Build summary plus required-vs-received gap by site.                                                                          |

## Derived field rules (`shipment_unit`)

- `declaredDestinationSet`: pipe-joined codes from `K:N` only — never inferred
  from receipt dates.
- `currentStage` priority (highest reached wins):
  `M140_FINAL_DELIVERED` (CF) > `M130_SITE_RECEIVED` (`BP:BS`) >
  `M115_MOSB_STAGED` (`BZ`) > `M110_WAREHOUSE_RECEIVED`
  (`BT:BY`,`CA:CD`) > customs/ATA/ETA/ATD/ETD milestones.
- `currentLocation`: location with the latest `actualReceiptDt`. Ties resolve
  to `MULTI_LOCATION`.
- `siteCompletionRate`: required site receipts present ÷ required site count.
- `missingRequiredDestination`: required sites without a matching site
  receipt date.
- `receivedWithoutFlag`: sites with a receipt date but no `O` flag in `K:N`.

## Rebuild

```bash
python3 scripts/build_logistics_dataset.py
```

The script reads `data/raw/logistics_status.xlsx`, writes CSVs into this
directory, and prints summary counts to stdout (also captured in
`_summary.txt`).
