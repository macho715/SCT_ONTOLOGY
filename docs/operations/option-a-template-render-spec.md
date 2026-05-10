# Option A Template Render Spec

## Summary

Option A changes the HVDC ChatGPT App rendering contract so the main answer tool directly owns the answer-card UI template.

The app must expose `ask_hvdc_ontology` as the single tool that both returns the grounded answer data and links the ChatGPT App component through `_meta.ui.resourceUri` and `_meta["openai/outputTemplate"]`.

The app must not expose `render_hvdc_answer_card` as a callable MCP tool. The answer card remains a registered HTML resource, not a second model-selected tool.

Primary objective:

- A user asks one HVDC ontology question.
- ChatGPT calls `ask_hvdc_ontology`.
- The tool returns `structuredContent`.
- ChatGPT can render the registered answer-card component from the same tool result.

## User Scenarios & Testing

### US-001: Main HVDC Answer Renders From One Tool Call

Given a user asks an HVDC logistics question that needs ontology evidence  
When ChatGPT calls `ask_hvdc_ontology`  
Then the tool result must include grounded `structuredContent` and direct answer-card template metadata.

Independent test:

- Run `tools/list` against the MCP server.
- Confirm `ask_hvdc_ontology._meta.ui.resourceUri` equals `ui://hvdc/answer-card-v4.html`.
- Confirm `ask_hvdc_ontology._meta["openai/outputTemplate"]` equals `ui://hvdc/answer-card-v4.html`.

### US-002: Ambiguous Any-key Result Still Renders

Given a user asks whether `BL-535` and `INVOICE-535` are the same  
When `ask_hvdc_ontology` returns `AMBIGUOUS_ANY_KEY` or `HUMAN_GATE_REQUIRED`  
Then the answer card must still render, and the validation result must block automatic selection.

Independent test:

- Call `ask_hvdc_ontology` with the ambiguity prompt.
- Confirm `verdict` is returned.
- Confirm `validation.reasonCode` includes expected hold/gate codes.
- Confirm evidence and next-action fields are present when available.

### US-003: Search Tool Does Not Attach UI

Given ChatGPT only needs evidence snippets  
When it calls `search_ontology_corpus`  
Then the tool must return evidence data only and must not attach the answer-card component.

Independent test:

- Run `tools/list`.
- Confirm `search_ontology_corpus._meta.ui` is absent.
- Confirm `search_ontology_corpus._meta["openai/outputTemplate"]` is absent.

### US-004: Render Tool Is Not Exposed

Given the MCP server exposes its app tools  
When a client lists tools  
Then `render_hvdc_answer_card` must not be present.

Independent test:

- Run `tools/list`.
- Assert tool names are exactly:
  - `ask_hvdc_ontology`
  - `route_question`
  - `search_ontology_corpus`
  - `resolve_any_key`
  - `validate_answer`

### US-005: Widget Reads Tool Output Without Second Tool Dependency

Given ChatGPT renders the answer-card iframe  
When the iframe starts  
Then it must read the answer from `window.openai.toolOutput` or a tool-result notification, without needing to call `render_hvdc_answer_card`.

Independent test:

- Inspect `public/hvdc-answer-widget.html`.
- Confirm it does not contain `render_hvdc_answer_card`.
- Confirm it still handles `window.openai.toolOutput`, `ui/notifications/tool-result`, and `openai:set_globals`.

## Requirements

### Functional Requirements

- FR-001: `ask_hvdc_ontology` MUST be the only tool that attaches the answer-card UI template.
- FR-002: `ask_hvdc_ontology` MUST set `_meta.ui.resourceUri` to `ui://hvdc/answer-card-v4.html`.
- FR-003: `ask_hvdc_ontology` MUST also set `_meta["openai/outputTemplate"]` to `ui://hvdc/answer-card-v4.html` as a ChatGPT compatibility alias.
- FR-004: `ask_hvdc_ontology` MUST return `structuredContent` that conforms to its declared `outputSchema`.
- FR-005: `ask_hvdc_ontology` MUST keep `_meta["openai/toolInvocation/invoking"]` and `_meta["openai/toolInvocation/invoked"]` user-facing status strings.
- FR-006: `render_hvdc_answer_card` MUST NOT be registered as a callable MCP tool.
- FR-007: `search_ontology_corpus` MUST NOT attach `_meta.ui.resourceUri` or `_meta["openai/outputTemplate"]`.
- FR-008: The registered app resource URI MUST exactly match the URI attached to `ask_hvdc_ontology`.
- FR-009: The answer-card resource MUST use `RESOURCE_MIME_TYPE`.
- FR-010: The widget MUST render `WARN`, `BLOCK`, `NO_EVIDENCE`, `HUMAN_GATE_REQUIRED`, and `AMBIGUOUS_ANY_KEY` states instead of treating them as render failures.
- FR-011: `chatgpt-app-submission.json` MUST list the same exposed tool names as the server descriptor.
- FR-012: Documentation that describes tool count or render flow MUST match the 5-tool direct-template design.

### Non-Functional Requirements

- NFR-001: The widget MUST NOT fetch external resources.
- NFR-002: Widget CSP metadata MUST remain narrow with empty connect/resource domains unless a real asset dependency is added.
- NFR-003: The change MUST preserve existing answer grounding, evidence, validation, PII masking, and audit behavior.
- NFR-004: The implementation MUST not delete files.
- NFR-005: The implementation MUST not commit untracked local draft files unless explicitly requested.
- NFR-006: The production deployment MUST be verified through the live Railway MCP URL.

## Assumptions & Dependencies

- Assumption: OpenAI Apps SDK direct-template behavior is the target behavior for this app because the user wants the card to render from the main ontology answer call.
- Assumption: `ui://hvdc/answer-card-v4.html` remains the correct resource URI for cache-busting current ChatGPT sessions.
- Assumption: Existing `ask_hvdc_ontology` private audit hash logging remains in scope, so `readOnlyHint` may remain `false`.
- Dependency: `@modelcontextprotocol/ext-apps` provides `registerAppResource`, `registerAppTool`, and `RESOURCE_MIME_TYPE`.
- Dependency: Railway production MCP URL remains `https://hvdc-ontology-chatgpt-app-production.up.railway.app/mcp`.
- Dependency: `npm run verify` remains the repository verification gate.

## Success Criteria

- SC-001: `npm run verify` passes.
- SC-002: `python -m json.tool chatgpt-app-submission.json` passes.
- SC-003: Local MCP `tools/list` returns exactly 5 tools.
- SC-004: Local MCP confirms `ask_hvdc_ontology` has `_meta.ui.resourceUri`.
- SC-005: Local MCP confirms `ask_hvdc_ontology` has `_meta["openai/outputTemplate"]`.
- SC-006: Local MCP confirms `render_hvdc_answer_card` is absent.
- SC-007: Local MCP confirms `search_ontology_corpus` has no UI resource.
- SC-008: Production MCP confirms the same direct-template contract after Railway deploy.
- SC-009: Production `ask_hvdc_ontology` ambiguity prompt returns `verdict`, `validationStatus`, and `validation.reasonCode`.
- SC-010: GitHub Actions latest `HVDC ontology verification` run succeeds after push.

## Open Questions

- None blocking for implementation.

## Clarifications Log

| Date | Clarification |
|---|---|
| 2026-05-10 | User approved Option A. |
| 2026-05-10 | `render_hvdc_answer_card` is to be removed as a callable tool and treated only as the conceptual resource/card role. |

## Reviewer Checklist

- [ ] Tool list is back to 5 exposed tools.
- [ ] `ask_hvdc_ontology` directly links the answer-card resource.
- [ ] No second render tool is required for normal ChatGPT card rendering.
- [ ] Submission JSON matches server tool descriptors.
- [ ] Widget fallback still handles older bridge delivery paths.
- [ ] Production smoke evidence is recorded after deployment.
