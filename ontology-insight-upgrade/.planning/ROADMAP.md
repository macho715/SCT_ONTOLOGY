# Roadmap: HVDC Ontology Insight MCP Merge

## Overview

V1 turns the local HVDC Ontology Insight prototype into a read-only MCP planning stream for operational risk and evidence lookup. The work first makes the repository evidence trustworthy, then maps local query/rule output into canonical HVDC ontology objects, then delivers any-key resolution, risk radar, CostGuard evidence, and read-only MCP contracts without exposing local Flask, Fuseki, ngrok, upload, write, or action flows as production behavior.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Source Hygiene & Read-only Boundary** - Make source/generated status, broken Git state, dev-only surfaces, and verification language explicit.
- [x] **Phase 2: Canonical Semantic Adapter & Guardrails** - Convert local prototype shapes into canonical HVDC objects and block Flow Code misuse before MCP exposure.
- [x] **Phase 3: Any-key Resolver & Evidence Contract** - Resolve operational identifiers into canonical context with confidence, source fields, evidence state, and privacy masking.
- [x] **Phase 4: Operational Risk Radar & CostGuard Evidence** - Provide the read-only risk view and CostGuard evidence pack with evidence-backed next actions.
- [x] **Phase 5: Read-only MCP Surface & Release Verification** - Expose read-only MCP tools and prove the contract without mutation, raw SPARQL, or local public endpoints.

## Phase Details

### Phase 1: Source Hygiene & Read-only Boundary
**Goal**: Users and implementers can trust what is source, what is generated, what Git evidence is unavailable, and which local/public surfaces are excluded from V1 production behavior.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: HYGIENE-01, HYGIENE-02, HYGIENE-03, EVID-04, TEST-05, TEST-06
**Success Criteria** (what must be TRUE):
  1. User can distinguish source files from generated artifacts, logs, backups, runtime health reports, and sample evidence outputs before implementation begins.
  2. User can see the broken nested Git state and the selected fallback path: repaired repo, clean clone, or file-hash-only mode.
  3. User can identify ngrok, GPTs Actions, OpenAPI, local Flask, and local Fuseki assets as development or migration references, not V1 production public surfaces.
  4. User can tell local CSV/NDJSON audit evidence apart from any future production audit identity, retention, or actor model.
  5. User can distinguish unit, contract, and live-service checks, and warnings or skips cannot be reported as PASS.
**Plans**:
- [x] `01-01-PLAN.md` - Build source/generated inventory, Git fallback evidence, dev-only surface markings, audit boundary, and verification language.

### Phase 2: Canonical Semantic Adapter & Guardrails
**Goal**: Local query, rule, and sample outputs become canonical HVDC MCP objects before any public answer can use them.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: SEM-01, SEM-02, SEM-03, SEM-04, SEM-05, TEST-01, TEST-02
**Success Criteria** (what must be TRUE):
  1. User receives canonical shipment, milestone, evidence, cost, customs, and warehouse objects instead of local `Case`, `TransportEvent`, `StockSnapshot`, or `Invoice` vocabulary.
  2. User sees Flow Code only under `WarehouseHandlingProfile.confirmedFlowCode`, while route, customs, marine, and milestone status use canonical routing and journey terms.
  3. User receives `NO_EVIDENCE`, ambiguity, or conflict states when joins are uncertain.
  4. Adapter fixtures prove local query outputs map to canonical MCP objects before public exposure.
  5. Flow Code tests block route, customs, marine, cost, and KPI usage outside warehouse handling.
**Plans**:
- [x] `02-01-PLAN.md` - Build canonical adapter contract, fixture-driven adapter, no-evidence/conflict states, and Flow Code guardrail tests.

### Phase 3: Any-key Resolver & Evidence Contract
**Goal**: Users can start from supported operational identifiers and receive matched canonical context with source, confidence, evidence state, and privacy controls.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: RESOLVE-01, RESOLVE-02, RESOLVE-03, RESOLVE-04, EVID-01, EVID-02, EVID-03, TEST-03
**Success Criteria** (what must be TRUE):
  1. User can enter HVDC CODE, BL No., BOE No., Invoice No., Package No., PO No., container no., or site code and receive related shipment, package, and evidence context.
  2. User can see which source fields matched, which source system supplied evidence, and how confident the match is.
  3. User can see alternate candidates, missing evidence, or conflicting evidence instead of a forced single answer.
  4. User receives masked sensitive identifiers, local paths, tokens, private links, and personal data according to the chosen policy.
  5. User can see that audit and event references are evidence-layer records and do not mutate operational truth.
**Plans**:
- [x] `03-01-PLAN.md` - Build read-only identifier resolver, fixture-backed evidence contract, privacy-safe output, and resolver guardrail tests.

### Phase 4: Operational Risk Radar & CostGuard Evidence
**Goal**: Users can request one read-only operational risk view and a CostGuard evidence pack for a resolved shipment, package, invoice, or site context.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: RISK-01, RISK-02, RISK-03, RISK-04, RISK-05, RISK-06, COST-01, COST-02, COST-03, COST-04
**Success Criteria** (what must be TRUE):
  1. User can request a consolidated risk view for a resolved shipment, package, invoice, or site context.
  2. Risk cards show cost, invoice, tariff, VAT, duty, HS/OOG, customs, DEM/DET, milestone, document, and warehouse stock or movement context when evidence exists.
  3. Every risk card includes status, confidence, evidence reference, missing inputs, owner cue, and one next action.
  4. User can request a CostGuard Evidence Pack that links invoice lines to BOE, CIPL, tariff, VAT, duty, and warehouse evidence where available.
  5. User can see missing evidence and review stance without unsupported overcharge, approval, dispute, or payment action claims.
**Plans**:
- [x] `04-01-PLAN.md` - Build read-only operational risk radar, CostGuard evidence pack, fixture-backed risk cards, and no-action guardrail tests.
**UI hint**: yes

### Phase 5: Read-only MCP Surface & Release Verification
**Goal**: V1 exposes only read-only MCP tools with structured outputs, contract tests, and a clear separation from future upload, write, and action work.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: MCP-01, MCP-02, MCP-03, MCP-04, MCP-05, TEST-04
**Success Criteria** (what must be TRUE):
  1. User can call read-only MCP tools for key resolution, risk radar, CostGuard evidence, evidence search, and validation.
  2. Tool outputs use structured content with evidence references and operator-readable summaries.
  3. Production users do not see raw SPARQL, direct Fuseki graph updates, local Flask routes, or ngrok URLs.
  4. V1 tools cannot mutate graph data, shipment state, invoice state, warehouse truth, email state, or approval records.
  5. Future upload, write, and action tools remain separated behind explicit scopes, human gates, audit records, rollback design, and contract tests for malformed input, no evidence, read-only annotations, and secret redaction.
**Plans**:
- [x] `05-01-PLAN.md` - Build local read-only MCP tool surface, structured outputs, contract fixtures, and release verification guardrails.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Source Hygiene & Read-only Boundary | 1/1 | Completed | 2026-05-13 |
| 2. Canonical Semantic Adapter & Guardrails | 1/1 | Completed | 2026-05-13 |
| 3. Any-key Resolver & Evidence Contract | 1/1 | Completed | 2026-05-13 |
| 4. Operational Risk Radar & CostGuard Evidence | 1/1 | Completed | 2026-05-13 |
| 5. Read-only MCP Surface & Release Verification | 1/1 | Completed | 2026-05-13 |

## Coverage

All 37 V1 requirements are mapped to exactly one phase.
