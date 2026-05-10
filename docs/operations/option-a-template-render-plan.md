# Option A Template Render Plan

## Overview

This plan changes the ChatGPT App rendering strategy back to the OpenAI Apps SDK direct-template pattern.

Current state:

- `ask_hvdc_ontology` creates the HVDC answer data.
- `render_hvdc_answer_card` is a separate callable tool that renders the card.
- ChatGPT must call a second tool for the visual card to appear.

Target state:

- `ask_hvdc_ontology` creates the answer and directly links the UI template.
- `render_hvdc_answer_card` is removed as a callable tool.
- The card resource remains registered as the reusable HTML component.

Assumption: The stable runtime behavior we want is one tool call from ChatGPT for the main HVDC answer and automatic inline component rendering from that same tool result.

## Goals

- Make `ask_hvdc_ontology` the single primary answer tool.
- Attach `_meta.ui.resourceUri` and `_meta["openai/outputTemplate"]` directly to `ask_hvdc_ontology`.
- Keep `structuredContent` aligned with `outputSchema`.
- Keep the answer card hydrated from `window.openai.toolOutput` and tool result metadata.
- Remove `render_hvdc_answer_card` from the exposed callable tool list.
- Keep submission metadata, tests, and docs aligned with the runtime tool surface.

## Scope

### In Scope

- Update `server/src/index.ts` tool descriptors.
- Remove the `render_hvdc_answer_card` callable tool registration.
- Keep `registerAppResource` for `ui://hvdc/answer-card-v6.html`.
- Attach the answer card resource directly to `ask_hvdc_ontology`.
- Remove widget self-heal logic that tries to call `render_hvdc_answer_card`.
- Update `chatgpt-app-submission.json` back to 5 exposed tools.
- Update descriptor and widget tests.
- Update root docs that mention 6 tools or render-tool separation.
- Run local and production MCP smoke checks after deployment.

### Out of Scope

- Changing ontology corpus semantics.
- Changing reasonCode definitions.
- Changing Railway project settings.
- Adding new external integrations.
- Changing UI visual design beyond the render path fix.
- Removing existing untracked UIUX draft files.

## Constraints

- Do not delete files.
- Do not commit untracked local draft files unless explicitly requested.
- Do not expose secrets or production credentials.
- Keep `RESOURCE_MIME_TYPE` for the registered HTML resource.
- Keep CSP narrow: no external fetches from the widget.
- Keep `HUMAN_GATE_REQUIRED` and `AMBIGUOUS_ANY_KEY` as renderable states, not render blockers.
- Keep `ask_hvdc_ontology` `readOnlyHint: false` if the private audit hash log remains part of its behavior.

## Phases

### Phase 1: Runtime Contract Patch

Move UI template metadata from `render_hvdc_answer_card` to `ask_hvdc_ontology`.

Expected result:

- `ask_hvdc_ontology._meta.ui.resourceUri = ui://hvdc/answer-card-v6.html`
- `ask_hvdc_ontology._meta["openai/outputTemplate"] = ui://hvdc/answer-card-v6.html`
- `render_hvdc_answer_card` no longer appears in `HVDC_TOOL_DESCRIPTORS`.

### Phase 2: Widget Simplification

Remove render-tool-specific recovery code from the iframe.

Expected result:

- Widget reads `window.openai.toolOutput`.
- Widget handles `ui/notifications/tool-result`.
- Widget keeps `openai:set_globals` compatibility.
- Widget does not require a second callable render tool.

### Phase 3: Submission And Docs Alignment

Return the app submission and docs to a 5-tool surface.

Expected result:

- `chatgpt-app-submission.json` lists 5 tools.
- README, AGENTS, SYSTEM_ARCHITECTURE, and SPEC no longer claim 6 tools.
- Docs explain that `ask_hvdc_ontology` directly renders the answer card.

### Phase 4: Verification And Deploy

Run automated tests, local MCP smoke, GitHub Actions, Railway deployment, and production MCP smoke.

Expected result:

- `npm run verify` passes.
- Local MCP shows `ask_hvdc_ontology` has the UI template.
- Production MCP shows the same contract after Railway deploy.

## Tasks

| No | Task | Output |
|---:|---|---|
| 1 | Patch `server/src/index.ts` descriptor and registration | Direct `ask_hvdc_ontology` template link |
| 2 | Patch `public/hvdc-answer-widget.html` | No render-tool dependency |
| 3 | Patch descriptor/widget tests | Tests enforce 5 tools and direct template link |
| 4 | Patch `chatgpt-app-submission.json` | Submission matches runtime tools |
| 5 | Patch docs | User-facing docs match implementation |
| 6 | Run local checks | `npm run verify`, JSON validation, MCP smoke |
| 7 | Commit and push | One focused commit |
| 8 | Deploy to Railway | Production app updated |
| 9 | Run production smoke | Contract verified at live MCP endpoint |

## Risks

- ChatGPT may cache a previous app session; users may need a new conversation or app reconnect.
- If `outputSchema` and returned `structuredContent` drift, component rendering may still fail.
- If `ask_hvdc_ontology` keeps private audit logging, its `readOnlyHint` should remain `false` even though the user-visible behavior is read-like.
- If the widget relies only on `window.openai.toolOutput`, older hosts may need the existing message listener fallback.

## Review Criteria

- `render_hvdc_answer_card` is not listed by `tools/list`.
- `ask_hvdc_ontology` has `_meta.ui.resourceUri`.
- `ask_hvdc_ontology` has `_meta["openai/outputTemplate"]`.
- `search_ontology_corpus` has no UI resource.
- The registered resource URI exactly matches the tool descriptor URI.
- The resource MIME type is `text/html;profile=mcp-app`.
- `npm run verify` passes.
- Production MCP returns `verdict`, `validationStatus`, `reasonCode`, and evidence for the sample ambiguity prompt.

## Deliverables

- Runtime patch for direct answer-card rendering.
- Updated submission JSON.
- Updated tests.
- Updated docs.
- GitHub commit and push.
- Railway production deployment.
- Production smoke evidence.
