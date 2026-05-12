---
created: 2026-05-11
research_type: summary
---

# Research Summary

## Decision

Integrate the `hvdc_openai_agent` rule engine into SCT_ONTOLOGY through the existing `ask_hvdc_ontology` flow.
The rule engine should provide secondary validation for shipment, invoice, and AGI/DAS closure risk.
Corpus evidence remains the primary source for factual claims.

## Stack Finding

The existing Python rule engine is suitable as a deterministic validation source.
For v1, the safest architecture is either a TypeScript adapter that mirrors the deterministic rules or a fail-closed Python subprocess wrapper.
The integration should not add live production system dependencies.

## Feature Finding

The minimum useful feature set is:

- identifier extraction from ontology questions,
- sample shipment lookup,
- secondary rule validation,
- AGI/DAS M130 missing-chain block,
- invoice and human-gate signal,
- data-only answer contract preservation,
- tests proving corpus-first behavior.

## Architecture Finding

The rule adapter should run after corpus retrieval and before final answer assembly.
The answer object should clearly separate corpus-supported facts from sample rule validation.
No fake evidence rows should be created for rule-only data.

## Pitfall Finding

The biggest risk is making sample data look like production truth.
The second biggest risk is accidentally breaking the `ask_hvdc_ontology` data-only contract.
Both risks need explicit tests.

## Recommended Requirement Direction

The requirements should focus on a narrow v1 integration:

1. Preserve current ontology answer behavior.
2. Add a secondary shipment rule validation block.
3. Keep unsupported claims blocked or clearly labeled.
4. Add descriptor and pipeline tests.
5. Leave live operational write-back and real system integrations out of scope.

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONCERNS.md`
- OpenAI Agents SDK tools documentation: https://openai.github.io/openai-agents-python/tools/
- OpenAI Agents SDK running agents documentation: https://openai.github.io/openai-agents-python/running_agents/
- OpenAI Apps SDK examples repository: https://github.com/openai/openai-apps-sdk-examples
