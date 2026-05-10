# Decoupled Template Render Spec

## Summary

The HVDC ChatGPT App follows the OpenAI Apps SDK decoupled pattern.

`ask_hvdc_ontology` is the data tool. It returns grounded answer JSON and text fallback without `_meta.ui.resourceUri` or `_meta["openai/outputTemplate"]`.

`render_hvdc_answer_card` is the render tool. It accepts the complete `GroundedAnswer` and attaches `_meta.ui.resourceUri` plus `_meta["openai/outputTemplate"]` for `ui://hvdc/answer-card-v6.html`.

Primary objective:

- A user asks an HVDC ontology question.
- ChatGPT calls `ask_hvdc_ontology`.
- ChatGPT may then call `render_hvdc_answer_card` with the answer object when a visual card is useful.
- The card resource renders the same business result while text fallback remains available.

## User Scenarios & Testing

### US-001: Main HVDC Answer Returns Data Only

Given a user asks an HVDC logistics question that needs ontology evidence  
When ChatGPT calls `ask_hvdc_ontology`  
Then the tool result must include grounded `structuredContent` and no answer-card template metadata.

Independent test:

- Run `tools/list` against the MCP server.
- Confirm `ask_hvdc_ontology._meta.ui` is absent.
- Confirm `ask_hvdc_ontology._meta["openai/outputTemplate"]` is absent.

### US-002: Render Tool Owns The Answer Card Template

Given a complete `GroundedAnswer` from `ask_hvdc_ontology`  
When ChatGPT calls `render_hvdc_answer_card`  
Then the render tool result must attach the answer-card template metadata.

Independent test:

- Confirm `render_hvdc_answer_card._meta.ui.resourceUri` equals `ui://hvdc/answer-card-v6.html`.
- Confirm `render_hvdc_answer_card._meta["openai/outputTemplate"]` equals `ui://hvdc/answer-card-v6.html`.
- Confirm the render result `_meta.ui.resourceUri` also equals `ui://hvdc/answer-card-v6.html`.

### US-003: Ambiguous Any-key Result Still Renders

Given a user asks whether `BL-535` and `INVOICE-535` are the same  
When `ask_hvdc_ontology` returns `AMBIGUOUS_ANY_KEY` or `HUMAN_GATE_REQUIRED`  
Then `render_hvdc_answer_card` must still render the validation result and block automatic selection.

Independent test:

- Call `ask_hvdc_ontology` with the ambiguity prompt.
- Call `render_hvdc_answer_card` with the returned structured answer.
- Confirm `verdict`, `validationStatus`, evidence, and next-action fields remain unchanged.

### US-004: Search Tool Does Not Attach UI

Given ChatGPT only needs evidence snippets  
When it calls `search_ontology_corpus`  
Then the tool must return evidence data only and must not attach the answer-card component.

Independent test:

- Run `tools/list`.
- Confirm `search_ontology_corpus._meta.ui` is absent.
- Confirm `search_ontology_corpus._meta["openai/outputTemplate"]` is absent.

### US-005: Widget Reads Render Tool Output

Given ChatGPT renders the answer-card iframe  
When the iframe starts  
Then it must read the answer from render-tool output or host-provided tool-result notifications.

Independent test:

- Inspect `public/hvdc-answer-widget.html`.
- Confirm it handles `ui/notifications/tool-result` and `openai:set_globals`.
- Confirm it does not fetch external resources.

## Requirements

### Functional Requirements

- FR-001: `ask_hvdc_ontology` MUST NOT attach `_meta.ui.resourceUri`.
- FR-002: `ask_hvdc_ontology` MUST NOT attach `_meta["openai/outputTemplate"]`.
- FR-003: `ask_hvdc_ontology` MUST return `structuredContent` that conforms to its declared `outputSchema`.
- FR-004: `ask_hvdc_ontology` MUST keep `_meta["openai/toolInvocation/invoking"]` and `_meta["openai/toolInvocation/invoked"]` user-facing status strings.
- FR-005: `render_hvdc_answer_card` MUST be registered as a callable MCP tool.
- FR-006: `render_hvdc_answer_card` MUST set `_meta.ui.resourceUri` to `ui://hvdc/answer-card-v6.html`.
- FR-007: `render_hvdc_answer_card` MUST set `_meta["openai/outputTemplate"]` to `ui://hvdc/answer-card-v6.html`.
- FR-008: `search_ontology_corpus` MUST NOT attach `_meta.ui.resourceUri` or `_meta["openai/outputTemplate"]`.
- FR-009: The answer-card resource MUST use `RESOURCE_MIME_TYPE`.
- FR-010: The widget MUST render `WARN`, `BLOCK`, `NO_EVIDENCE`, `HUMAN_GATE_REQUIRED`, and `AMBIGUOUS_ANY_KEY` states instead of treating them as render failures.
- FR-011: `chatgpt-app-submission.json` MUST list the same exposed tool names as the server descriptor.
- FR-012: Documentation that describes tool count or render flow MUST match the 6-tool decoupled design.

### Non-Functional Requirements

- NFR-001: The widget MUST NOT fetch external resources.
- NFR-002: Widget CSP metadata MUST remain narrow with empty connect/resource domains unless a real asset dependency is added.
- NFR-003: The change MUST preserve existing answer grounding, evidence, validation, PII masking, and audit behavior.
- NFR-004: The implementation MUST not delete files except replacing stale planning/spec content when explicitly updating those docs.
- NFR-005: The implementation MUST not commit untracked local draft files unless explicitly requested.
- NFR-006: The production deployment MUST be verified through the live Railway MCP URL.

## Assumptions & Dependencies

- Assumption: OpenAI Apps SDK decoupled behavior is the target behavior because direct-template `ask_hvdc_ontology` still produced intermittent ChatGPT `Failed to fetch template` errors.
- Assumption: `ui://hvdc/answer-card-v6.html` remains the canonical resource URI.
- Assumption: `ui://hvdc/answer-card-v5.html` remains a legacy fetch alias only.
- Assumption: Existing `ask_hvdc_ontology` private audit hash logging remains in scope, so `readOnlyHint` may remain `false`.
- Dependency: `@modelcontextprotocol/ext-apps` provides `registerAppResource`, `registerAppTool`, and `RESOURCE_MIME_TYPE`.
- Dependency: Railway production MCP URL remains `https://hvdc-ontology-chatgpt-app-production.up.railway.app/mcp`.
- Dependency: `npm run verify` remains the repository verification gate.

## Success Criteria

- SC-001: `npm run verify` passes.
- SC-002: `python -m json.tool chatgpt-app-submission.json` passes.
- SC-003: Local MCP `tools/list` returns exactly 6 tools.
- SC-004: Local MCP confirms `ask_hvdc_ontology` has no `_meta.ui.resourceUri`.
- SC-005: Local MCP confirms `ask_hvdc_ontology` has no `_meta["openai/outputTemplate"]`.
- SC-006: Local MCP confirms `render_hvdc_answer_card` has `_meta.ui.resourceUri`.
- SC-007: Local MCP confirms `render_hvdc_answer_card` has `_meta["openai/outputTemplate"]`.
- SC-008: Local MCP confirms `search_ontology_corpus` has no UI resource.
- SC-009: Production MCP confirms the same decoupled contract after Railway deploy.
- SC-010: Production `ask_hvdc_ontology` daily KPI prompt returns operations KPI routing, not CostGuard summary.

## Open Questions

- Whether ChatGPT will automatically choose `render_hvdc_answer_card` after `ask_hvdc_ontology` for all target prompts must be verified in the ChatGPT UI.

## Clarifications Log

| Date | Clarification |
|---|---|
| 2026-05-10 | Direct-template rendering was tried with `ask_hvdc_ontology`. |
| 2026-05-10 | Because ChatGPT still showed `Failed to fetch template`, the runtime contract returns to the official decoupled pattern. |

## Reviewer Checklist

- [ ] Tool list remains 6 exposed tools.
- [ ] `ask_hvdc_ontology` is data-only.
- [ ] `render_hvdc_answer_card` owns the answer-card resource.
- [ ] Submission JSON matches server tool descriptors.
- [ ] Widget fallback still handles host delivery paths.
- [ ] Production smoke evidence is recorded after deployment.
