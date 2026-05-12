# Phase 1: Pattern Map

**Mapped:** 2026-05-11

## Files To Modify

| File | Role | Closest Existing Pattern |
|------|------|--------------------------|
| `../server/src/types.ts` | Type contract | Existing `GroundedAnswer`, `ValidationFinding`, `EvidenceSnippet` type definitions |
| `../server/src/index.ts` | Zod output schema and tool descriptor contract | Existing `answerOutputSchema`, `answerDataOutputSchema`, descriptor tests |
| `../server/src/answer.ts` | Adapter call placement and answer assembly | Existing `answerQuestion()` flow |
| `../server/src/shipment-rule.ts` | New adapter module | Existing pure helpers in `answer.ts` and `router.ts` |
| `../tests/pipeline.test.ts` | Behavior tests | Existing `ask()` pipeline tests |
| `../tests/descriptor.test.ts` | Data-only contract tests | Existing ask/render descriptor tests |

## Established Patterns To Reuse

- Keep pure logic in TypeScript modules and test through `answerQuestion()`.
- Keep `ask_hvdc_ontology` data-only by omitting `ui` from `answerDataOutputSchema`.
- Use explicit status enums instead of free-form strings.
- Do not mutate `evidenceIds`, `validationStatus`, or render state for UI-only concerns.
- Use tests to prove unsupported claims stay out of supported answer fields.

## Concrete Anchors

- In `../server/src/answer.ts`, insert adapter execution after:
  - `const evidence = ...`
  - `const resolvedEntities = resolveAnyKey(maskedQuestion.text);`
- In `../server/src/types.ts`, add optional `shipmentRule?: ShipmentRuleResult` to `GroundedAnswer`.
- In `../server/src/index.ts`, add `shipmentRule` to `answerOutputSchema` before destructuring `ui` out into `answerDataOutputSchema`.
- In tests, use the existing `ask(question)` helper in `../tests/pipeline.test.ts`.
