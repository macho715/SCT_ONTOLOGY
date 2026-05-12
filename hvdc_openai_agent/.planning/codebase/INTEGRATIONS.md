---
last_mapped: 2026-05-11
focus: tech
---

# Integrations

## Summary

The project has one optional external AI integration and otherwise runs from local files.
Offline mode is the operational safety path because it does not require a network call or OpenAI API key.

## OpenAI Agents SDK

- Integration location: `src/hvdc_openai_agent/agent_app.py`.
- Optional imports: `Agent`, `Runner`, and `function_tool` from `agents`.
- If the SDK is missing, offline mode still works because `function_tool` falls back to an identity decorator.
- Online mode builds an `Agent` with logistics instructions and three tools.
- Online execution calls `Runner.run(build_agent(), question)`.

## Agent Tools

The online agent exposes deterministic Python functions as tools:

- `search_shipment(any_key)` resolves BL, BOE, DO, Invoice, Container, HVDC_CODE, Package No., or shipment ID.
- `cost_guard(any_key)` returns invoice exposure, line audit results, and human gate status.
- `port_release_board(any_key)` returns current stage, missing documents, release risks, and human gate status.

## Environment Variables

- `OPENAI_API_KEY` is needed by the OpenAI SDK in online mode.
- `OPENAI_MODEL` overrides the model and defaults to `gpt-5.4-mini`.
- `.env.example` contains placeholder values and should not contain real secrets.

## Local Data Integration

- Primary dataset: `data/sample_shipments.json`.
- Loader: `load_shipments_file()` in `src/hvdc_openai_agent/core.py`.
- The dataset is sample master data, not a live ERP, WMS, port, customs, or finance connection.
- Data validation rejects duplicate identifiers, unknown milestone codes, negative invoice values, and non-AED invoice currencies.

## Reports

- Output renderers live in `src/hvdc_openai_agent/reporting.py`.
- Supported offline formats are `json`, `brief`, and `csv`.
- Sample outputs live in `reports/sample_bl_auh_002.json`, `reports/sample_bl_auh_002.txt`, and `reports/sample_bl_auh_002.csv`.

## CI And Platform Services

- GitHub Actions is the only configured automation service.
- Workflow file: `.github/workflows/ci.yml`.
- No database, webhook, queue, cloud storage, or production deployment integration appears in the current source tree.

## Security Boundary

- Real credentials must stay out of docs, reports, and sample data.
- `docs/VALIDATION.md` defines ZERO behavior when evidence or regulatory source data is missing.
- The README states internal contract rates and PII are not included in samples.
