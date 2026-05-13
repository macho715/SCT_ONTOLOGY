# Semantic Adapter Contract

**Phase:** 2
**Requirements:** SEM-01, SEM-02, SEM-03, SEM-04, SEM-05, TEST-01, TEST-02

## Decision

Local prototype shapes are input evidence only.

Public MCP-facing output must use canonical HVDC objects before any answer, risk view, or evidence pack can use local query or rule results.

## Local Input Shapes

These local terms may appear in source queries, local TTL, fixtures, and internal development output:

- `Case`
- `TransportEvent`
- `StockSnapshot`
- `Invoice`
- `CargoItem`
- HS/OOG rule alerts

They must not appear as public `objectType` values in canonical MCP output.

## Canonical Output Objects

Allowed public output objects:

| Canonical object | Purpose |
|---|---|
| `OperationalContext` | Resolved operator-facing context for one key or one local evidence group. |
| `ShipmentUnit` | Shipment/package operational twin. |
| `MilestoneEvent` | Time-stamped status transition. |
| `JourneyLeg` | Movement leg between operational nodes. |
| `EvidenceRef` | Source field, query, rule, or fixture evidence reference. |
| `CostGuardResult` | Cost/rate/invoice evidence review result. |
| `WarehouseEvidence` | Warehouse stock or movement evidence. |
| `WarehouseHandlingProfile` | Warehouse-only handling classification. |

## Required Public Fields

Every canonical adapter result must include:

- `dataStatus`
- `evidenceState`
- `identifiers`
- `evidenceRefs`
- one of `shipmentUnit` or `operationalContext`

When evidence exists, route and execution visibility must use:

- `routingPattern`
- `journeyStage`
- `milestoneEvents`
- `journeyLegs`

## Evidence States

Use these exact labels:

- `PASS`: required evidence exists and mapping is valid.
- `WARN`: mapping is valid but optional evidence is incomplete.
- `BLOCK`: local output violates the canonical boundary.
- `NO_EVIDENCE`: no usable evidence exists for the requested object or join.
- `AMBIGUOUS`: multiple candidates match and the adapter refuses to force one.
- `CONFLICT`: sources disagree on a material field.

## Flow Code Boundary

`WarehouseHandlingProfile.confirmedFlowCode` is the only allowed Flow Code location.

Blocked uses:

- route classification
- customs status
- marine routing
- invoice or cost ownership
- KPI bucket for end-to-end movement
- document-extracted operational truth

Allowed use:

- warehouse-only handling classification under `warehouseHandlingProfile.confirmedFlowCode`

Route and movement status must use `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, and `JourneyLeg`.

## Mapping Rules

| Local input | Canonical target | Rule |
|---|---|---|
| `Case` | `ShipmentUnit` or `OperationalContext` | Keep local case number as an identifier, not as object type. |
| `TransportEvent` | `MilestoneEvent` and optional `JourneyLeg` | Map local event type to milestone code and journey stage. |
| `StockSnapshot` | `WarehouseEvidence` | Stock evidence can support warehouse context but cannot define route. |
| `Invoice` | `CostGuardResult` and invoice evidence | Cost result is evidence review, not approval, dispute, or payment action. |
| `CargoItem` / HS/OOG | risk or evidence fields | HS/OOG evidence can inform risk; it cannot define route. |
| uncertain join | `NO_EVIDENCE`, `AMBIGUOUS`, or `CONFLICT` | Never force a single answer without evidence. |

## Read-only Boundary

Phase 2 does not add:

- upload
- write
- graph mutation
- approval
- dispute
- payment
- email send
- escalation
- Cloudflare MCP public tool implementation

Phase 2 only builds the local semantic adapter and deterministic guardrails that future MCP tools must use.

## Verification Rule

TEST-01 is satisfied only when fixture tests prove local outputs map to expected canonical objects.

TEST-02 is satisfied only when Flow Code guardrail tests fail on route, customs, marine, cost, or KPI use outside `WarehouseHandlingProfile.confirmedFlowCode`.

Live Fuseki checks are optional live-service checks. They do not replace deterministic fixture and guardrail tests.
