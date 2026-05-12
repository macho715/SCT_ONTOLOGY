# Requirements: HVDC OpenAI Agent SCT_ONTOLOGY Integration

**Defined:** 2026-05-11
**Core Value:** `ask_hvdc_ontology` must answer HVDC logistics questions with corpus evidence first, then use the Python shipment rule engine as a secondary validation signal for BL, invoice, and AGI/DAS risk checks.

## v1 Requirements

### Corpus Priority

- [ ] **CORP-01**: `ask_hvdc_ontology` keeps ontology corpus evidence as the primary source for factual HVDC logistics claims.
- [ ] **CORP-02**: If corpus evidence is missing or irrelevant, `ask_hvdc_ontology` does not turn sample shipment rule output into a supported factual answer.
- [ ] **CORP-03**: Rule-derived validation is labeled separately from corpus-supported evidence in the structured answer.

### Rule Adapter

- [ ] **RULE-01**: The integration extracts BL, BOE, DO, Invoice, Container, HVDC_CODE, Package, or shipment ID candidates from the question or routed answer context.
- [ ] **RULE-02**: The integration resolves matching sample shipment data using deterministic any-key logic equivalent to `resolve_any_key()`.
- [ ] **RULE-03**: The integration returns a clear not-found state when no sample shipment matches, without changing the corpus answer verdict by itself.
- [ ] **RULE-04**: The integration fails closed when the rule engine or sample data is unavailable.

### Validation Signals

- [ ] **VAL-01**: The integration exposes current stage, missing documents, risks, invoice audit, invoice exposure, and human gate status for matched sample shipments.
- [ ] **VAL-02**: AGI/DAS cargo at M130 is blocked when M115, M116, or M117 are missing.
- [ ] **VAL-03**: Invoice lines with missing evidence, zero standard, rate mismatch, CRITICAL/BLOCK severity, or exposure above 100,000.00 AED require human or finance gate.
- [ ] **VAL-04**: Rule validation can add warnings, blocks, or action recommendations, but cannot create fake corpus evidence IDs.

### Tool Contract

- [ ] **TOOL-01**: `ask_hvdc_ontology` remains data-only and does not attach `openai/outputTemplate`, `_meta.ui.resourceUri`, or `structuredContent.ui`.
- [ ] **TOOL-02**: Existing render-tool ownership of UI template behavior remains unchanged.
- [ ] **TOOL-03**: The integration does not add a new standalone MCP tool in v1.

### Tests And Documentation

- [ ] **TEST-01**: Tests cover found shipment, not-found shipment, AGI/DAS block, invoice human gate, and unavailable rule-engine states.
- [ ] **TEST-02**: Tests prove corpus-first behavior and prevent unsupported rule-only claims from becoming final supported answers.
- [ ] **TEST-03**: Descriptor or pipeline tests prove `ask_hvdc_ontology` remains data-only.
- [ ] **DOC-01**: Documentation explains that sample shipment rule results are secondary validation, not production operational truth.

## v2 Requirements

### Production Evidence

- **PROD-01**: Replace or augment sample shipment lookup with approved production evidence ingestion.
- **PROD-02**: Represent approved exception evidence explicitly for AGI/DAS closure decisions.
- **PROD-03**: Add broader fixture coverage for more shipment patterns and risk combinations.

### Runtime Architecture

- **RUNT-01**: Decide whether deterministic rules should live in TypeScript, a Python subprocess, or a dedicated local service after v1 contract validation.
- **RUNT-02**: Add mocked or contract-based online OpenAI agent tests if online behavior becomes part of the accepted delivery path.

## Out of Scope

| Feature | Reason |
|---------|--------|
| New standalone MCP tool for v1 | User selected integration inside `ask_hvdc_ontology`. |
| Live ERP, WMS, ATLP, customs, finance, WhatsApp, or email write-back | v1 is read-only validation support. |
| Production shipment truth mutation | The integration must not mutate operational records. |
| LLM-only shipment risk decision | Deterministic rules and corpus evidence must remain explicit. |
| Real OpenAI API calls in default CI | CI should remain deterministic and safe by default. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORP-01 | Phase 1 | Pending |
| CORP-02 | Phase 1 | Pending |
| CORP-03 | Phase 1 | Pending |
| RULE-01 | Phase 1 | Pending |
| RULE-02 | Phase 1 | Pending |
| RULE-03 | Phase 1 | Pending |
| RULE-04 | Phase 1 | Pending |
| VAL-01 | Phase 2 | Pending |
| VAL-02 | Phase 2 | Pending |
| VAL-03 | Phase 2 | Pending |
| VAL-04 | Phase 2 | Pending |
| TOOL-01 | Phase 3 | Pending |
| TOOL-02 | Phase 3 | Pending |
| TOOL-03 | Phase 3 | Pending |
| TEST-01 | Phase 3 | Pending |
| TEST-02 | Phase 3 | Pending |
| TEST-03 | Phase 3 | Pending |
| DOC-01 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-05-11*
*Last updated: 2026-05-11 after roadmap creation*
