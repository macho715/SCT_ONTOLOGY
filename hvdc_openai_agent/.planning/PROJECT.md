# HVDC OpenAI Agent SCT_ONTOLOGY Integration

## What This Is

This project turns the existing `hvdc_openai_agent` Python rule engine into a support layer for the SCT_ONTOLOGY `ask_hvdc_ontology` flow.
The current Python package already resolves shipment identifiers, checks port-release and cost risks, and blocks AGI/DAS M130 closure when MOSB chain evidence is missing.
The next milestone integrates those deterministic rule results into the ontology-grounded answer path without replacing corpus evidence.

## Core Value

`ask_hvdc_ontology` must answer HVDC logistics questions with corpus evidence first, then use the Python shipment rule engine as a secondary validation signal for BL, invoice, and AGI/DAS risk checks.

## Requirements

### Validated

- ✓ Resolve shipments by BL, BOE, DO, Invoice, Container, HVDC_CODE, Package, or shipment ID — existing `resolve_any_key()` behavior in `src/hvdc_openai_agent/core.py`.
- ✓ Build deterministic shipment snapshots from local sample data — existing offline path in `src/hvdc_openai_agent/agent_app.py`.
- ✓ Detect missing BOE, DO, and SITE_RECEIPT evidence by milestone stage — existing `missing_documents()` behavior in `src/hvdc_openai_agent/core.py`.
- ✓ Detect DEM/DET late or open risk around M92 to M100 — existing `port_release_risks()` behavior in `src/hvdc_openai_agent/core.py`.
- ✓ Block AGI/DAS M130 closure when M115/M116/M117 are missing — existing `agi_das_gate_risk()` behavior in `src/hvdc_openai_agent/core.py`.
- ✓ Audit invoice line variance, missing evidence, zero standard, and human gate conditions — existing `audit_invoice_lines()` behavior in `src/hvdc_openai_agent/core.py`.
- ✓ Render offline results as JSON, brief text, and CSV — existing `src/hvdc_openai_agent/reporting.py` behavior.

### Active

- [ ] Connect the Python shipment rule engine into the SCT_ONTOLOGY `ask_hvdc_ontology` flow.
- [ ] Keep ontology corpus evidence as the primary source for factual answers.
- [ ] Use sample shipment rule results only as secondary validation until real evidence ingestion exists.
- [ ] Preserve the existing data-only contract for `ask_hvdc_ontology`; do not attach UI metadata through this integration.
- [ ] Expose rule result status in a way that can be traced to returned evidence, validation state, and action recommendations.
- [ ] Add tests that prove corpus evidence remains primary and unsupported rule claims do not become final answers.

### Out of Scope

- New standalone MCP tool for the Python agent — the selected v1 direction is integration inside `ask_hvdc_ontology`.
- Live ERP, WMS, ATLP, customs, finance, WhatsApp, or email write-back — this milestone is read-only validation support.
- Production shipment truth mutation — documents and sample data remain evidence inputs, not transaction authority.
- LLM-only risk decisions — deterministic rule results and corpus evidence must remain explicit.
- Real OpenAI API integration tests in CI — current CI should stay deterministic and safe unless a separate mocked contract is added.

## Context

The existing codebase is a Python 3.11+ package named `hvdc-openai-agent`.
It has a deterministic offline mode and an optional OpenAI Agents SDK online wrapper.
The package uses local sample data at `data/sample_shipments.json`.

The user selected this integration path during initialization:

- Add the function to `SCT_ONTOLOGY` as an MCP capability.
- Do not create a separate new MCP tool for v1.
- Connect it inside the existing `ask_hvdc_ontology` answer flow.
- Use ontology corpus evidence first.
- Use sample shipment rule results as secondary validation.

The parent SCT_ONTOLOGY app already has an ontology-grounded MCP server and the `ask_hvdc_ontology` tool.
That parent app has strict boundaries: factual answers require corpus evidence, `ask_hvdc_ontology` stays data-only, and UI rendering belongs to the render tool.

## Constraints

- **Evidence priority**: Corpus evidence is primary — the Python rule result cannot become unsupported business truth.
- **Tool contract**: `ask_hvdc_ontology` remains data-only — it must not attach `openai/outputTemplate`, `_meta.ui.resourceUri`, or `structuredContent.ui`.
- **Data maturity**: `data/sample_shipments.json` has only two sample shipments — it can support v1 validation behavior but not production coverage claims.
- **Safety**: Human gate conditions remain mandatory for high-value invoices, BLOCK or CRITICAL results, AGI/DAS missing chain evidence, and missing closure documents.
- **Testing**: Offline deterministic tests remain the default CI path — real API calls are out of scope for normal verification.
- **Security**: Planning docs and generated reports must not include real secrets, PII, private URLs, or internal commercial terms.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Integrate through `ask_hvdc_ontology` instead of a new MCP tool | User selected the existing ontology answer path as the v1 integration point | — Pending |
| Use corpus evidence first and sample shipment rules second | SCT_ONTOLOGY is an evidence-grounded app, while the Python package currently uses sample shipment data | — Pending |
| Preserve deterministic offline rule behavior | The current package is testable without OpenAI API access and should stay safe for CI | — Pending |
| Keep write-back out of scope | The integration is validation support, not an operational mutation system | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check -> still the right priority?
3. Audit Out of Scope -> reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-11 after initialization*
