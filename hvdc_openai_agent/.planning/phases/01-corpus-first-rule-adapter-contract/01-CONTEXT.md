# Phase 1: Corpus-First Rule Adapter Contract - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase defines and implements the narrow adapter contract that lets SCT_ONTOLOGY `ask_hvdc_ontology` request secondary shipment rule validation without changing corpus-first answer behavior.
The phase covers adapter placement, result shape, identifier extraction, and not-found or unavailable handling.
It does not merge full validation signal details, create a new standalone MCP tool, or change render-tool ownership.

</domain>

<decisions>
## Implementation Decisions

### Adapter Position

- **D-01:** Run the shipment rule adapter after corpus search has produced candidate evidence and before `validateGrounding()` runs.
- **D-02:** The adapter must receive the masked question, resolved entity context when available, and the corpus-supported state needed to avoid treating sample rule data as primary evidence.
- **D-03:** The adapter must not run before corpus retrieval because corpus-first behavior is a locked project decision.

### Rule Result Shape

- **D-04:** Add a single structured `shipmentRule` object to the answer data contract.
- **D-05:** `shipmentRule` should include at least `found`, `source`, `supportLevel`, `status`, `matchedKey`, `shipmentId`, `risks`, and `humanGateRequired`.
- **D-06:** The `shipmentRule.source` value must make the boundary explicit, for example `sample_shipment_rule_engine`.
- **D-07:** The `shipmentRule.supportLevel` value must distinguish secondary sample validation from corpus-supported evidence.
- **D-08:** Do not represent sample rule results as normal `EvidenceSnippet` corpus evidence in Phase 1.

### Not-Found And Unavailable Handling

- **D-09:** If no sample shipment matches, set `shipmentRule.status` to an INFO-style not-found state.
- **D-10:** A not-found sample shipment result must not change the corpus answer verdict by itself.
- **D-11:** If the adapter or sample data is unavailable, set `shipmentRule.status` to a WARN-style unavailable state.
- **D-12:** An unavailable rule adapter must not break the normal ontology answer path unless the question explicitly depends on the secondary rule signal.

### Identifier Extraction

- **D-13:** Use both raw question text and existing `resolvedEntities` from the SCT_ONTOLOGY pipeline to identify BL, BOE, DO, Invoice, Container, HVDC_CODE, Package, or shipment ID candidates.
- **D-14:** Reuse the parent pipeline's existing `resolveAnyKey()` context when possible.
- **D-15:** Also scan the question text for Python sample key patterns that may not exist in the current parent router.
- **D-16:** If multiple candidate identifiers are found, the adapter should preserve ambiguity rather than silently choosing an unsafe target.

### the agent's Discretion

The planner may choose the exact TypeScript type names and enum literal names if they preserve the decisions above.
The planner may decide whether Phase 1 ports Python deterministic logic into TypeScript or uses a thin local adapter stub, as long as the resulting contract is stable and testable.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning

- `.planning/PROJECT.md` — Project goal, locked integration direction, and out-of-scope boundaries.
- `.planning/REQUIREMENTS.md` — Phase 1 requirements `CORP-01` through `RULE-04`.
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria.
- `.planning/research/SUMMARY.md` — Research summary for stack, feature, architecture, and pitfalls.

### Existing Python Rule Engine

- `src/hvdc_openai_agent/core.py` — Deterministic shipment model, any-key resolution, missing document checks, DEM/DET risk, AGI/DAS gate, and invoice audit logic.
- `src/hvdc_openai_agent/agent_app.py` — Offline snapshot path and optional OpenAI Agents SDK wrapper.
- `data/sample_shipments.json` — Current sample shipment data boundary.
- `.planning/codebase/ARCHITECTURE.md` — Existing Python package architecture map.
- `.planning/codebase/INTEGRATIONS.md` — Existing integration and local data boundary map.

### Parent SCT_ONTOLOGY Integration Points

- `../server/src/answer.ts` — Current `answerQuestion()`, corpus search, `validateGrounding()`, `composeSummary()`, and `GroundedAnswer` assembly.
- `../server/src/types.ts` — Current `GroundedAnswer`, `ValidationFinding`, `EvidenceSnippet`, and related answer contract types.
- `../server/src/index.ts` — Current MCP tool descriptors and `ask_hvdc_ontology` data-only output schema.
- `../tests/pipeline.test.ts` — Existing corpus-first, AGI/DAS, evidence trace, and UI separation tests.
- `../tests/descriptor.test.ts` — Existing data-only descriptor and render-tool contract tests.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `resolve_any_key()` in `src/hvdc_openai_agent/core.py`: reference behavior for sample shipment any-key lookup.
- `shipment_snapshot()` in `src/hvdc_openai_agent/core.py`: reference result content for secondary validation output.
- `answerQuestion()` in `../server/src/answer.ts`: parent function where the adapter should be inserted after corpus search and before `validateGrounding()`.
- `GroundedAnswer` in `../server/src/types.ts`: data contract that should receive the new optional `shipmentRule` object.

### Established Patterns

- Parent `ask_hvdc_ontology` is data-only and returns no UI metadata.
- Parent validation uses `ValidationFinding[]` and derives `verdict` from evidence plus findings.
- Parent evidence trace links answer statements only to evidence IDs returned in the same answer.
- Python rule engine is deterministic and offline-testable.

### Integration Points

- Add adapter execution in `../server/src/answer.ts` after `candidateEvidence` / `evidence` and `resolvedEntities` are available.
- Extend `../server/src/types.ts` and the corresponding zod output schema in `../server/src/index.ts`.
- Add pipeline and descriptor tests under `../tests/`.

</code_context>

<specifics>
## Specific Ideas

The user selected all four recommended gray areas.
The user selected the recommended option for every area:
adapter after corpus search before validation, `shipmentRule` object shape, not-found INFO and unavailable WARN, and question text plus `resolvedEntities` for identifier extraction.

</specifics>

<deferred>
## Deferred Ideas

Full validation signal merge belongs to Phase 2.
Tool contract regression gates belong to Phase 3.
Documentation and handoff belong to Phase 4.
Live production evidence ingestion remains v2.

</deferred>

---

*Phase: 1-Corpus-First Rule Adapter Contract*
*Context gathered: 2026-05-11*
