---
created: 2026-05-11
research_type: stack
---

# Research: Stack

## Scope

This research covers the stack needed to integrate the existing Python `hvdc_openai_agent` rule engine into the parent SCT_ONTOLOGY `ask_hvdc_ontology` MCP answer flow.

## Existing Local Stack

- Python package: `hvdc-openai-agent`, Python `>=3.11`.
- Rule engine source: `src/hvdc_openai_agent/core.py`.
- CLI and optional OpenAI Agents SDK wrapper: `src/hvdc_openai_agent/agent_app.py`.
- Reports: `src/hvdc_openai_agent/reporting.py`.
- Sample data: `data/sample_shipments.json`.
- Tests: `pytest`, `pytest-cov`, `ruff`.

## Parent App Stack To Integrate With

The parent SCT_ONTOLOGY app is a Node.js / TypeScript MCP server with an existing `ask_hvdc_ontology` flow.
The integration should treat the Python engine as a deterministic validation module, not as a replacement for the ontology corpus retrieval layer.

## Recommended Integration Stack

### v1 Recommendation

Use a TypeScript-side adapter that calls or ports the deterministic rule logic behind `ask_hvdc_ontology`.
The first implementation should avoid live ERP/WMS connectivity and should rely on the same sample shipment data boundary already documented in the Python package.

### Preferred Options

1. **Port deterministic rule logic into the TypeScript MCP server**
   - Best fit when the parent app must remain a single Node.js deployable.
   - Easier descriptor and test alignment.
   - Requires keeping behavior parity with Python tests.

2. **Call Python as a local subprocess from the MCP server**
   - Fastest way to reuse current code.
   - Adds deployment and error-handling complexity.
   - Must fail closed when Python, package install, or sample data is unavailable.

3. **Promote the Python package to a small local service**
   - Cleaner runtime boundary.
   - Too much operational overhead for v1 unless multiple tools need the same rule engine.

## OpenAI / MCP Considerations

Official OpenAI Agents SDK documentation supports wrapping Python functions as tools with `@function_tool` and running agents through `Runner.run`.
That confirms the current Python package shape is reasonable for agent-side usage, but the selected v1 target is the parent MCP `ask_hvdc_ontology` flow, not a separate Python agent surface.

OpenAI Apps SDK examples show the MCP pattern of tools returning structured payloads and, where UI is needed, linking resources through metadata such as `_meta.ui.resourceUri`.
For this project, the parent repository rule is stricter: `ask_hvdc_ontology` must remain data-only and must not attach UI metadata.

## Version Guidance

- Keep Python `>=3.11`.
- Keep `pytest`, `pytest-cov`, and `ruff` for the Python package.
- Keep the parent app's existing TypeScript test and descriptor checks as the primary integration gate.
- Avoid adding new infrastructure dependencies until the integration contract is stable.

## Sources

- Local codebase map: `.planning/codebase/STACK.md`.
- Local codebase map: `.planning/codebase/ARCHITECTURE.md`.
- OpenAI Agents SDK tools documentation: https://openai.github.io/openai-agents-python/tools/
- OpenAI Agents SDK running agents documentation: https://openai.github.io/openai-agents-python/running_agents/
- OpenAI Apps SDK examples repository: https://github.com/openai/openai-apps-sdk-examples
