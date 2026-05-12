# Phase 1: Corpus-First Rule Adapter Contract - Research

**Researched:** 2026-05-11
**Status:** Complete

## Phase Goal

Define and implement the narrow adapter contract that lets SCT_ONTOLOGY `ask_hvdc_ontology` request secondary shipment rule validation without changing corpus-first answer behavior.

## What The Planner Needs To Know

### Current Parent Flow

`../server/src/answer.ts` currently builds an answer in this order:

1. Mask PII with `maskPii()`.
2. Route the question with `routeQuestion()`.
3. Load and search corpus evidence with `loadCorpus()` and `searchCorpus()`.
4. Reduce candidate evidence to supported `evidence`.
5. Resolve any-key entities with `resolveAnyKey()`.
6. Run `validateGrounding()`.
7. Derive `verdict`.
8. Compose summary, details, actions, evidence trace, graph path, and `GroundedAnswer`.

The Phase 1 adapter must be inserted after step 5 and before step 6.
That gives the adapter access to masked question text, returned corpus evidence, and resolved parent entities.

### Current Data Contract

`../server/src/types.ts` defines `GroundedAnswer`.
The new field should be optional during rollout so old answer fixtures and render inputs do not break.

Recommended new type:

- `ShipmentRuleResult`

Recommended fields:

- `found: boolean`
- `source: "sample_shipment_rule_engine"`
- `supportLevel: "SECONDARY_SAMPLE_VALIDATION"`
- `status: "PASS" | "INFO" | "WARN" | "BLOCK"`
- `matchedKey: string | null`
- `shipmentId: string | null`
- `risks: Array<Record<string, unknown>>`
- `humanGateRequired: boolean`
- `message: string`

Optional fields can be added for planner/executor judgment:

- `matchedScheme`
- `candidates`
- `unavailableReason`

### Existing Parent Schema Point

`../server/src/index.ts` defines the zod schema for `answerDataOutputSchema`.
The plan must update both TypeScript types and the zod output schema.
The plan must preserve the current data-only descriptor for `ask_hvdc_ontology`.

### Identifier Extraction

`../server/src/router.ts` already extracts BL, BOE, DO, Invoice, HVDC_CODE, site, and milestone candidates.
It does not currently include the Python sample `Package` key pattern.
The adapter should combine:

- existing `resolvedEntities`,
- raw question text scan for sample package or shipment IDs,
- ambiguity preservation when multiple candidate keys exist.

Suggested extra text patterns:

- `SHP-\d+`
- `PKG-[A-Z0-9-]+`
- existing BL/BOE/DO/INV/HVDC patterns if needed for adapter-local fallback

### Corpus-First Behavior

The adapter must not create `EvidenceSnippet` objects.
It must not add fake evidence IDs.
It must not convert sample shipment data into corpus-supported claims.

Not-found state:

- `shipmentRule.found = false`
- `shipmentRule.status = "INFO"`
- `verdict` unchanged by this state alone

Unavailable state:

- `shipmentRule.found = false`
- `shipmentRule.status = "WARN"`
- `verdict` unchanged unless the question explicitly depends on shipment rule validation

### Implementation Choice

For Phase 1, the safest planning target is a TypeScript adapter stub or TypeScript port of the minimal sample lookup contract.
Using a Python subprocess would add deployment complexity before the data contract is stable.

Recommended Phase 1 implementation files:

- `../server/src/shipment-rule.ts` for adapter types and logic.
- `../server/src/types.ts` for the exported answer contract.
- `../server/src/index.ts` for zod schema output.
- `../server/src/answer.ts` for adapter call placement.
- `../tests/pipeline.test.ts` for behavior tests.
- `../tests/descriptor.test.ts` for data-only contract tests.

## Validation Architecture

The plan should include tests that prove:

1. A matching sample key returns `shipmentRule.found === true`.
2. A non-matching key returns `shipmentRule.status === "INFO"` and does not change `verdict`.
3. Simulated adapter unavailable returns `shipmentRule.status === "WARN"` and does not break the answer.
4. `shipmentRule` is not added to `evidence[]`.
5. `shipmentRule` does not create fake `evidenceTrace.evidenceIds`.
6. `ask_hvdc_ontology` output still has no `ui`.

## Key Risk

The highest-risk failure is making sample shipment data look like production evidence.
The plan must make the secondary boundary visible in type names, field names, tests, and acceptance criteria.

## Research Complete

This research is sufficient to plan Phase 1.
