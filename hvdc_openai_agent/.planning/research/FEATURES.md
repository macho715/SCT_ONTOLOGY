---
created: 2026-05-11
research_type: features
---

# Research: Features

## Scope

This feature research defines what the SCT_ONTOLOGY integration should provide when `ask_hvdc_ontology` uses the Python shipment rule engine as secondary validation.

## Table Stakes

### Corpus-First Answering

- `ask_hvdc_ontology` must still retrieve ontology corpus evidence before making factual HVDC claims.
- `CONSOLIDATED-00` remains the required semantic spine for ontology and operations questions in the parent app.
- Missing or irrelevant corpus evidence must keep returning `NO_EVIDENCE`, `WARN`, or `BLOCK` as appropriate.

### Shipment Rule Signal

- When the question contains a BL, BOE, DO, Invoice, Container, HVDC_CODE, Package, or shipment ID, the integration should try to resolve the shipment key.
- If a shipment is found in sample data, return a secondary rule signal with current stage, missing documents, risks, invoice audit, exposure, and human gate status.
- If no sample shipment is found, do not invent a rule result.

### AGI/DAS Gate

- AGI/DAS cargo at M130 must block when M115/M116/M117 evidence is missing.
- The final answer must explain that this is a validation signal and must not close the site arrival without chain evidence or an approved exception.

### Cost Guard

- Invoice lines should show BLOCK, CRITICAL, HIGH, WARN, or PASS according to deterministic rule output.
- High-value exposure or BLOCK/CRITICAL results must require human or finance gate.

### UI Contract Preservation

- `ask_hvdc_ontology` remains data-only.
- The integration must not attach `openai/outputTemplate`, `_meta.ui.resourceUri`, or `structuredContent.ui`.
- Rendering remains owned by the existing render path in the parent app.

## Differentiators

- Evidence trace can connect visible answer statements to corpus evidence and separately mark rule-derived validation as secondary.
- Rule result summaries can help the user understand why a closure, receipt, or invoice should be blocked.
- A future implementation can add a production evidence adapter without changing the user-facing answer contract.

## Anti-Features

- Do not make the LLM decide shipment risk without deterministic rule output.
- Do not allow sample data to override corpus evidence.
- Do not add write-back to ERP, WMS, ATLP, Foundry, WhatsApp, email, or finance systems.
- Do not add a separate MCP tool for v1 because the user selected integration inside `ask_hvdc_ontology`.

## Suggested v1 Requirements

- Detect key-like identifiers in `ask_hvdc_ontology` input.
- Run or reproduce deterministic shipment validation for matched sample shipments.
- Merge secondary rule output into the answer object without changing UI ownership.
- Add tests for found shipment, not-found shipment, AGI/DAS block, invoice gate, and corpus-first behavior.

## Sources

- Local project context: `.planning/PROJECT.md`.
- Local rule map: `.planning/codebase/ARCHITECTURE.md`.
- Local concerns: `.planning/codebase/CONCERNS.md`.
- OpenAI Apps SDK examples repository: https://github.com/openai/openai-apps-sdk-examples
