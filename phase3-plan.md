# Plan: Phase 3 Tool Contract And Regression Gates

Purpose: Lock the SCT_ONTOLOGY MCP tool contract and add regression gates that prevent corpus-first, data-only, render ownership, and rule-validation behavior from drifting.

## Overview

Phase 3 protects the behavior already introduced in Phase 1 and Phase 2.
The plan focuses on MCP descriptor parity, `ask_hvdc_ontology` data-only output, no new standalone v1 tool, render-tool ownership, corpus-first behavior, and shipment-rule regression coverage.

Assumption: Phase 1 and Phase 2 implementation remain in place before Phase 3 starts.

## Goals

- G1: Lock the six-tool MCP contract between `server/src/index.ts` and `chatgpt-app-submission.json`.
- G2: Prove `ask_hvdc_ontology` remains data-only and does not attach UI metadata.
- G3: Prove `render_hvdc_answer_card` remains the owner of widget template metadata and rendering.
- G4: Prove no new standalone MCP tool appears in v1.
- G5: Add regression coverage for found shipment, not-found shipment, unavailable rule engine, AGI/DAS block, invoice human gate, and unsupported rule-only output.

## Scope

### In Scope

- `TOOL-01`: `ask_hvdc_ontology` remains data-only and does not attach `openai/outputTemplate`, `_meta.ui.resourceUri`, or `structuredContent.ui`.
- `TOOL-02`: Existing render-tool ownership of UI template behavior remains unchanged.
- `TOOL-03`: v1 descriptor does not add a new standalone MCP tool.
- `TEST-01`: Tests cover found shipment, not-found shipment, AGI/DAS block, invoice human gate, and unavailable rule-engine states.
- `TEST-02`: Tests prove corpus-first behavior and prevent unsupported rule-only claims from becoming final supported answers.
- `TEST-03`: Descriptor or pipeline tests prove `ask_hvdc_ontology` remains data-only.
- Regression checks for `server/src/index.ts`, `chatgpt-app-submission.json`, `tests/descriptor.test.ts`, `tests/pipeline.test.ts`, and existing widget tests.

### Out of Scope

- New standalone MCP tool for shipment rules.
- Live ERP, WMS, ATLP, customs, finance, WhatsApp, or email write-back.
- Production shipment truth mutation.
- New UI widget design.
- Phase 4 documentation handoff.
- v2 production evidence ingestion.

## Constraints

- `ask_hvdc_ontology` must stay data-only.
- `render_hvdc_answer_card` must keep `openai/outputTemplate` ownership.
- The v1 server and ChatGPT submission must stay aligned on the existing six tool names.
- Rule-derived validation must not add fake corpus evidence IDs.
- Existing render-tool behavior must remain unchanged.
- Default CI/test path must remain deterministic and must not require real OpenAI API calls.

## Phases

### Phase 3.1: Contract Inventory

Confirm the current six MCP tool names, descriptor metadata, output schema shape, and submission JSON alignment.

### Phase 3.2: Descriptor Regression Gates

Add or tighten tests that prove the ask tool is data-only, render owns UI metadata, and no new standalone MCP tool appears.

### Phase 3.3: Pipeline Regression Gates

Add or tighten tests that prove corpus-first behavior, unsupported rule-only output handling, found/not-found/unavailable shipment states, AGI/DAS block, and invoice human gate behavior.

### Phase 3.4: Full Verification

Run focused tests and full repository verification before claiming completion.

## Tasks

- T1: Inspect `HVDC_TOOL_DESCRIPTORS` and `chatgpt-app-submission.json` for exact tool-name parity.
- T2: Add descriptor assertions that `Object.keys(HVDC_TOOL_DESCRIPTORS)` remains six tools and matches submission tools.
- T3: Add descriptor assertions that `ask_hvdc_ontology._meta` has no `ui`, no `openai/outputTemplate`, and no widget accessibility metadata.
- T4: Add descriptor assertions that `render_hvdc_answer_card._meta` keeps `ui.resourceUri` and `openai/outputTemplate`.
- T5: Add regression tests for found shipment and not-found shipment states if any coverage gap remains.
- T6: Add regression tests for unavailable rule-engine state if any coverage gap remains.
- T7: Add regression tests for AGI/DAS shipment-rule BLOCK validation and invoice human or finance gate if any coverage gap remains.
- T8: Add regression tests proving unsupported rule-only claims cannot create supported final answers or fake evidence IDs.
- T9: Run `npm test -- tests/pipeline.test.ts tests/descriptor.test.ts`.
- T10: Run `npm run verify`.

## Risks

- R1: Descriptor tests may pass while submission JSON drifts. Mitigation: compare server descriptor tool keys directly to `chatgpt-app-submission.json`.
- R2: A rule-only regression may appear supported if only verdict is checked. Mitigation: assert `evidence[]`, `evidenceIds`, and `evidenceTrace.evidenceIds`.
- R3: Render ownership may regress silently. Mitigation: assert ask metadata and render metadata separately.
- R4: Existing Claude-specific tests may expose schema drift. Mitigation: run full `npm run verify`, not only focused tests.
- R5: Phase 3 may duplicate Phase 1 or Phase 2 tests. Mitigation: tighten existing tests when sufficient instead of creating redundant scenarios.

## Review Criteria

- RC1: Server descriptor and ChatGPT submission expose the same six tool names.
- RC2: `ask_hvdc_ontology` has no UI template metadata.
- RC3: `render_hvdc_answer_card` keeps widget template metadata.
- RC4: No new standalone shipment MCP tool exists in v1.
- RC5: Found shipment, not-found shipment, unavailable rule engine, AGI/DAS block, and invoice human gate are covered by automated tests.
- RC6: Unsupported rule-only output cannot become a supported final answer.
- RC7: Rule-derived findings/actions do not create fake corpus evidence IDs.
- RC8: `npm test -- tests/pipeline.test.ts tests/descriptor.test.ts` passes.
- RC9: `npm run verify` passes.

## Deliverables

- Updated descriptor regression tests.
- Updated pipeline regression tests.
- Any necessary schema parity adjustments.
- Focused test result for `tests/pipeline.test.ts` and `tests/descriptor.test.ts`.
- Full `npm run verify` result.
- Commit containing only Phase 3 contract/regression-gate changes.
