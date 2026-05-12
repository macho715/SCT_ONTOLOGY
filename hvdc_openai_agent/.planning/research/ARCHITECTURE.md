---
created: 2026-05-11
research_type: architecture
---

# Research: Architecture

## Scope

This architecture research describes how to connect `hvdc_openai_agent` rule checks to the parent SCT_ONTOLOGY `ask_hvdc_ontology` flow.

## Current Local Architecture

The Python package has this flow:

1. Load `data/sample_shipments.json`.
2. Convert rows into `ShipmentUnit` dataclasses.
3. Validate milestone, invoice, and identifier consistency.
4. Resolve any-key identifiers through `resolve_any_key()`.
5. Build a `shipment_snapshot()` with missing documents, risks, invoice audit, exposure, and human gate status.
6. Render offline output as JSON, brief text, or CSV.

## Target Parent Flow

The parent SCT_ONTOLOGY app already owns:

1. Question routing.
2. Corpus retrieval.
3. Grounded answer generation.
4. Validation status.
5. Evidence trace.
6. Render-only UI card path.

The new rule engine integration should sit after routing and evidence retrieval, then contribute secondary validation before final answer assembly.

## Recommended Data Flow

```text
User question
  -> ask_hvdc_ontology
  -> route_question
  -> search_ontology_corpus
  -> extract any-key candidates
  -> run shipment rule adapter
  -> merge rule validation into GroundedAnswer
  -> validate_answer / evidence trace
  -> text fallback + structuredContent
```

## Proposed Components

### Shipment Rule Adapter

Responsibilities:

- Accept question text and optional extracted identifiers.
- Resolve matching sample shipment data.
- Return a normalized result with found/not-found state.
- Fail closed when data or runtime is unavailable.

### Rule Result Schema

Suggested structured fields:

- `found`
- `query`
- `shipmentId`
- `currentStage`
- `missingDocuments`
- `risks`
- `invoiceAudit`
- `invoiceExposureAed`
- `humanGateRequired`
- `source`
- `supportLevel`

`source` should make the boundary visible, for example `sample_shipment_rule_engine`.
`supportLevel` should distinguish corpus-supported facts from secondary sample validation.

### Answer Merge Layer

Responsibilities:

- Use corpus evidence for factual claims.
- Add rule result to validation or business impact only when clearly labeled.
- Avoid creating fake `EvidenceSnippet` IDs for rule-only facts.
- Keep action recommendations tied to either evidence IDs or `NO_DIRECT_EVIDENCE`.

## Build Order

1. Define the integration contract and result schema.
2. Add adapter with deterministic sample-data behavior.
3. Connect adapter to `ask_hvdc_ontology` behind a narrow condition.
4. Update answer assembly and evidence trace semantics.
5. Add tests for contract, not-found behavior, and AGI/DAS block behavior.
6. Update docs and submission descriptors only if tool contract changes.

## Key Architectural Decision

The v1 integration should not treat Python sample shipment data as production operational truth.
It should return a secondary validation signal that can block risky action recommendations but cannot replace missing corpus evidence.

## Sources

- Local architecture map: `.planning/codebase/ARCHITECTURE.md`.
- Local testing map: `.planning/codebase/TESTING.md`.
- Parent app instructions supplied in `AGENTS.md`.
- OpenAI Apps SDK examples repository: https://github.com/openai/openai-apps-sdk-examples
