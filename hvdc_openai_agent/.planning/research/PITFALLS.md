---
created: 2026-05-11
research_type: pitfalls
---

# Research: Pitfalls

## Pitfall 1: Sample Data Becomes Treated As Production Truth

### Warning Signs

- The answer says a shipment is closed, released, or approved based only on `data/sample_shipments.json`.
- Rule output is presented as corpus evidence.
- Evidence trace links rule-only claims to invented evidence IDs.

### Prevention

- Label the rule result source as sample shipment validation.
- Keep corpus evidence as the primary support for factual answer statements.
- Use `NO_DIRECT_EVIDENCE` for workflow actions that are recommendations rather than directly quoted corpus statements.

## Pitfall 2: Breaking The Data-Only Tool Contract

### Warning Signs

- `ask_hvdc_ontology` starts returning `structuredContent.ui`.
- `ask_hvdc_ontology` gets `_meta.ui.resourceUri` or `openai/outputTemplate`.
- Widget rendering starts depending on the data tool directly.

### Prevention

- Keep UI template ownership in the render tool.
- Add descriptor tests that assert `ask_hvdc_ontology` stays data-only.
- Keep rule result data inside structured answer fields only.

## Pitfall 3: Runtime Coupling To Python Subprocesses

### Warning Signs

- Parent MCP server fails when Python venv is missing.
- Railway or production runtime lacks the Python package path.
- Tool timeout turns a normal ontology answer into a hard failure.

### Prevention

- Prefer a TypeScript adapter or a fail-closed subprocess wrapper.
- If subprocess reuse is selected, make timeouts and unavailable states explicit.
- Do not let rule engine failure alter corpus answer verdict unless the task depends on the rule result.

## Pitfall 4: Double Validation Confuses Users

### Warning Signs

- Corpus says one thing and sample rule result says another without explanation.
- Answer mixes `validationStatus`, `verdict`, and rule severity into one unclear label.
- User cannot tell whether a block came from corpus evidence or sample validation.

### Prevention

- Separate corpus validation from secondary shipment rule validation.
- Show the rule result as a named validation signal.
- Use short labels such as `Corpus evidence`, `Sample shipment rule`, and `Human gate`.

## Pitfall 5: Missing Test Coverage Around Edge Cases

### Warning Signs

- Tests only cover the happy path with `BL-AUH-002`.
- No test for no matching shipment key.
- No test proves unsupported rule claims do not enter final answer.

### Prevention

- Add tests for found and not-found identifiers.
- Add tests for AGI/DAS missing M115/M116/M117.
- Add tests for high invoice exposure and missing evidence.
- Add tests that `ask_hvdc_ontology` remains data-only.

## Sources

- Local concerns map: `.planning/codebase/CONCERNS.md`.
- Local testing map: `.planning/codebase/TESTING.md`.
- OpenAI Agents SDK tools documentation: https://openai.github.io/openai-agents-python/tools/
- OpenAI Apps SDK examples repository: https://github.com/openai/openai-apps-sdk-examples
