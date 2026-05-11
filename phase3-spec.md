# Spec: Phase 3 Tool Contract And Regression Gates

Feature ID: phase3-tool-contract-regression-gates
Created: 2026-05-11
Status: Draft
Owner: SCT_ONTOLOGY Maintainer / QA Reviewer
Input: `phase3-plan.md`
Version: v0.1.0

## Summary

Phase 3 locks the SCT_ONTOLOGY MCP tool contract and adds regression gates that stop drift in the data-only answer tool, render ownership, corpus-first validation, and shipment rule validation.

The main user need is simple: the ChatGPT App must keep the same approved six runtime tools, and shipment or rule validation must not create unsupported business conclusions.

Goals:
- Keep server MCP tools and `chatgpt-app-submission.json` aligned on the same six tool names.
- Prove `ask_hvdc_ontology` stays data-only and does not own UI metadata.
- Prove `render_hvdc_answer_card` owns answer-card rendering metadata.
- Block new standalone MCP tools for shipment or rule validation in v1.
- Cover found shipment, not-found shipment, unavailable rule engine, AGI/DAS block, invoice human gate, and unsupported rule-only output.

Non-goals:
- No new standalone shipment, validation, or action MCP tool.
- No ERP, WMS, ATLP, customs, finance, WhatsApp, email, or production write-back.
- No production mutation or approval execution.
- No new widget design.
- No Phase 4 documentation rewrite.

## User Scenarios & Testing

### User Story 1: MCP tool contract parity

As a project maintainer, I want server descriptors and the ChatGPT submission file to expose the same v1 tools, so stale or extra tools cannot reach ChatGPT clients unnoticed.

Given the MCP server descriptors and `chatgpt-app-submission.json`
When descriptor tests compare the exported tool names
Then the sorted names must match exactly and must contain only the approved six v1 tools.

### User Story 2: Data-only answer tool

As a ChatGPT App reviewer, I want `ask_hvdc_ontology` to return data only, so business answers are not mixed with iframe ownership or widget metadata.

Given the descriptor and runtime output for `ask_hvdc_ontology`
When tests inspect descriptor metadata and structured content
Then the tool must not expose `openai/outputTemplate`, `_meta.ui.resourceUri`, `widgetAccessible`, or `structuredContent.ui`.

### User Story 3: Render tool owns presentation

As a UI maintainer, I want `render_hvdc_answer_card` to own the answer-card template, so presentation failures stay separate from business validation.

Given the descriptor for `render_hvdc_answer_card`
When descriptor tests inspect render metadata
Then the render tool must point to the approved widget resource and keep the rendering metadata that `ask_hvdc_ontology` is forbidden to carry.

### User Story 4: Shipment and validation regression gates

As a logistics reviewer, I want shipment validation edge cases to stay covered, so unsupported rule output cannot become a final supported answer.

Given prompts or fixtures for matched shipment, missing shipment, unavailable rule engine, AGI/DAS M130 closure, invoice human gate, and unsupported rule-only output
When pipeline tests run
Then each case must return the expected status and must not create fake evidence IDs or unsupported final claims.

### Edge Cases

- The ChatGPT submission file adds a tool that the server does not expose.
- The server exposes a new standalone shipment or validation tool.
- `ask_hvdc_ontology` starts returning UI metadata.
- `render_hvdc_answer_card` loses its widget resource metadata.
- Rule-only output returns a supported final answer without corpus evidence.
- A not-found shipment or unavailable rule engine turns into a blocking business answer instead of a non-breaking status.

## Requirements

### Functional Requirements

FR-001: The server MCP descriptor and `chatgpt-app-submission.json` MUST expose exactly these six tool names: `ask_hvdc_ontology`, `render_hvdc_answer_card`, `route_question`, `search_ontology_corpus`, `resolve_any_key`, and `validate_answer`.

FR-002: Descriptor tests MUST compare sorted server tool names with sorted ChatGPT submission tool names.

FR-003: Descriptor tests MUST fail if a new standalone shipment, rule, validation, export, action, or write-back MCP tool appears in v1.

FR-004: `ask_hvdc_ontology` MUST NOT attach `openai/outputTemplate`, `_meta.ui.resourceUri`, or widget-accessible UI metadata.

FR-005: `ask_hvdc_ontology` runtime output MUST NOT include `structuredContent.ui`.

FR-006: `render_hvdc_answer_card` MUST own the answer-card rendering contract and point to the approved widget resource URI.

FR-007: Render ownership tests MUST prove presentation metadata belongs to `render_hvdc_answer_card`, not `ask_hvdc_ontology`.

FR-008: Pipeline regression tests MUST cover the found-shipment path and prove a matched shipment can produce a supported validation result.

FR-009: Pipeline regression tests MUST cover the not-found shipment path and prove it returns a non-breaking informational result.

FR-010: Pipeline regression tests MUST cover unavailable shipment-rule infrastructure and prove it returns a non-breaking warning result.

FR-011: Pipeline regression tests MUST cover AGI/DAS M130 site-arrival closure without M115/M116/M117 or an approved exception and prove it blocks closure.

FR-012: Pipeline regression tests MUST cover invoice or CostGuard human-gate behavior for high-risk or approval-required cost cases.

FR-013: Pipeline regression tests MUST prove unsupported rule-only output cannot become a final supported answer and cannot create fake evidence IDs.

FR-014: The focused Phase 3 regression command MUST pass before Phase 3 is marked complete.

FR-015: The full repository verification command MUST pass before Phase 3 is marked complete.

FR-016: Default CI and local regression tests MUST NOT require live OpenAI API calls or production system access.

### Non-Functional Requirements

NFR-001: Tests MUST be deterministic and runnable offline from local repository fixtures.

NFR-002: Evidence safety MUST remain intact: every supported final claim needs returned corpus evidence, and unsupported rule-only claims remain unsupported.

NFR-003: Existing render compatibility behavior MUST remain stable unless a later approved phase changes the widget contract.

NFR-004: Regression failures MUST be visible through local commands and CI-friendly test output.

## Assumptions & Dependencies

### Assumptions

A-001: Phase 1 tool descriptor boundaries remain in place.

A-002: Phase 2 validation signal merge remains in place.

A-003: The six current MCP tool names are the v1 runtime contract.

A-004: `npm run verify` is the full local repository verification command.

A-005: Phase 3 is a contract and regression-gate phase. It does not add production write-back behavior.

### Dependencies

D-001: Server tool descriptors in `server/src/index.ts`.

D-002: ChatGPT submission descriptor in `chatgpt-app-submission.json`.

D-003: Descriptor tests in `tests/descriptor.test.ts`.

D-004: Pipeline tests in `tests/pipeline.test.ts`.

D-005: Widget regression tests in `tests/widget.test.ts`.

D-006: Answer and validation source in `server/src/answer.ts`, `server/src/shipment-rule.ts`, and `server/src/shipment-validation.ts`.

D-007: Repository scripts in `package.json`.

## Success Criteria

SC-001: Descriptor tests prove the server and ChatGPT submission expose exactly the same six v1 tool names.

SC-002: Descriptor or pipeline tests prove `ask_hvdc_ontology` has no UI metadata, no `openai/outputTemplate`, no `_meta.ui.resourceUri`, and no `structuredContent.ui`.

SC-003: Descriptor tests prove `render_hvdc_answer_card` owns the approved widget resource metadata.

SC-004: Descriptor tests prove no new standalone shipment, rule, validation, export, action, or write-back MCP tool exists in v1.

SC-005: Pipeline tests cover found shipment, not-found shipment, unavailable rule engine, AGI/DAS block, and invoice human gate.

SC-006: Pipeline tests prove unsupported rule-only output cannot become a supported final answer and cannot create fake evidence IDs.

SC-007: Focused verification passes with `npm test -- tests/pipeline.test.ts tests/descriptor.test.ts`.

SC-008: Full verification passes with `npm run verify`.

## Open Questions & Clarifications

OQ-001: Should Claude descriptor parity be included in Phase 3 acceptance, or should Phase 3 rely on existing full verification coverage only?

OQ-002: Should compatibility widget alias coverage be an explicit Phase 3 success criterion, or should it remain covered by existing widget tests outside this phase?

Clarifications Log:
- 2026-05-11: User requested `$spec-studio phase3-plan.md`.
- 2026-05-11: Scope is limited to a Spec document derived from `phase3-plan.md`; no implementation code is part of this step.

## Risks & Mitigations

R-001: Server and submission descriptors drift apart.
Mitigation: Compare sorted server tool names to sorted submission tool names in descriptor tests.

R-002: A new standalone validation tool bypasses the approved v1 boundary.
Mitigation: Fail descriptor tests when unexpected shipment, rule, validation, export, action, or write-back tool names appear.

R-003: UI metadata moves back into `ask_hvdc_ontology`.
Mitigation: Add negative assertions for output templates, UI resource metadata, widget-accessible metadata, and `structuredContent.ui`.

R-004: Rule-only output becomes an unsupported final claim.
Mitigation: Assert evidence IDs and final support state for unsupported rule-only cases.

R-005: Existing render behavior regresses while descriptor tests pass.
Mitigation: Run focused Phase 3 tests first, then `npm run verify` before completion.

## Traceability

| Plan item | Covered by | Success criteria |
|---|---|---|
| TOOL-01 ask data-only | FR-004, FR-005 | SC-002 |
| TOOL-02 render ownership | FR-006, FR-007 | SC-003 |
| TOOL-03 no new standalone MCP tool | FR-001, FR-003 | SC-001, SC-004 |
| TEST-01 shipment and gate coverage | FR-008, FR-009, FR-010, FR-011, FR-012 | SC-005 |
| TEST-02 unsupported rule-only safety | FR-013 | SC-006 |
| TEST-03 descriptor and pipeline proof | FR-002, FR-014, FR-015 | SC-001, SC-007, SC-008 |

## Reviewer Checklist

- [ ] The spec keeps the six-tool v1 contract unchanged.
- [ ] The spec does not add a new MCP tool.
- [ ] The spec keeps `ask_hvdc_ontology` data-only.
- [ ] The spec keeps rendering ownership on `render_hvdc_answer_card`.
- [ ] The spec includes found shipment, not-found shipment, unavailable rule engine, AGI/DAS block, invoice human gate, and unsupported rule-only regression cases.
- [ ] The spec separates local fixture-based tests from production write-back or live API behavior.
- [ ] The spec has stable FR, NFR, and SC IDs.
- [ ] Open questions are accepted, answered, or explicitly deferred before execution.

## Approval Readiness

Status: Draft.

This spec is ready for review, but not ready for execution approval until OQ-001 and OQ-002 are answered or explicitly deferred by the project owner.

## Changelog

- v0.1.0: Initial Phase 3 Spec drafted from `phase3-plan.md`.
