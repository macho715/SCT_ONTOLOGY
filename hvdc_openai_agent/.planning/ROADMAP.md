# Roadmap: HVDC OpenAI Agent SCT_ONTOLOGY Integration

**Created:** 2026-05-11
**Mode:** Vertical MVP

## Overview

This roadmap integrates deterministic shipment rule validation into the existing SCT_ONTOLOGY `ask_hvdc_ontology` flow.
Each phase keeps corpus evidence primary and preserves the data-only tool contract.

## Phases

### Phase 1: Corpus-First Rule Adapter Contract

**Goal:** Define and implement the narrow adapter contract that lets `ask_hvdc_ontology` request secondary shipment rule validation without changing corpus-first answer behavior.
**Mode:** mvp

**Requirements:** CORP-01, CORP-02, CORP-03, RULE-01, RULE-02, RULE-03, RULE-04

**Success Criteria**:
1. `ask_hvdc_ontology` can detect key-like identifiers and call the rule adapter only when useful.
2. The adapter returns found, not-found, and unavailable states in a stable structured shape.
3. Corpus evidence remains the only primary support for factual claims.
4. Rule output is clearly labeled as secondary validation.
5. Failure in the rule adapter does not break normal ontology answers.

### Phase 2: Validation Signal Merge

**Goal:** Merge deterministic shipment risks into the answer result as validation signals, action guidance, and human-gate context.
**Mode:** mvp

**Requirements:** VAL-01, VAL-02, VAL-03, VAL-04

**Success Criteria**:
1. Matched shipments expose stage, missing documents, risk list, invoice audit, exposure, and human-gate status.
2. AGI/DAS M130 without M115/M116/M117 produces a BLOCK validation signal.
3. Invoice BLOCK/CRITICAL or exposure above 100,000.00 AED requires human or finance gate.
4. Rule-only claims do not create fake evidence IDs.
5. Action recommendations distinguish corpus-supported facts from workflow guidance.

### Phase 3: Tool Contract And Regression Gates

**Goal:** Lock the MCP tool contract and add tests that prevent regressions in corpus-first behavior, data-only output, and rule validation.
**Mode:** mvp

**Requirements:** TOOL-01, TOOL-02, TOOL-03, TEST-01, TEST-02, TEST-03

**Success Criteria**:
1. Tests cover found shipment, not-found shipment, unavailable rule engine, AGI/DAS block, and invoice human gate.
2. Tests prove unsupported rule-only output cannot become a supported final answer.
3. Descriptor or pipeline tests prove `ask_hvdc_ontology` has no UI metadata.
4. Existing render-tool behavior remains unchanged.
5. No new standalone MCP tool appears in the v1 descriptor.

### Phase 4: Documentation And Handoff

**Goal:** Document the operational boundary so users understand that sample shipment rules are secondary validation, not production truth.
**Mode:** mvp

**Requirements:** DOC-01

**Success Criteria**:
1. Documentation explains corpus-first priority.
2. Documentation labels sample shipment rule results as secondary validation.
3. Documentation lists human-gate conditions for AGI/DAS and invoice risk.
4. README or operations docs point to the correct tests.
5. Remaining v2 production evidence work is listed clearly.

## Coverage Validation

All 18 v1 requirements are mapped to exactly one phase.

| Phase | Requirement Count |
|-------|-------------------|
| Phase 1 | 7 |
| Phase 2 | 4 |
| Phase 3 | 6 |
| Phase 4 | 1 |

---
*Roadmap created: 2026-05-11*
