# HVDC Ontology Insight MCP Merge

## What This Is

This project turns the existing local HVDC Ontology Insight prototype into a practical planning stream for the production HVDC ontology MCP.

The existing folder contains a local Fuseki/SPARQL analytics system, Flask APIs, Gateway/OpenAPI examples, audit logging, dashboard scripts, and sample logistics data. The target direction is to reuse the best operational ideas without duplicating or weakening the Cloudflare-hosted HVDC MCP boundary.

The primary user is the HVDC SCM/logistics operator who needs faster answers about invoice risk, customs risk, OOG/HS risk, warehouse stock, milestones, and evidence-backed next actions.

## Core Value

Expose one reliable operational risk view that links HVDC identifiers, evidence, cost risk, customs/milestone status, and responsible next action without breaking the canonical HVDC ontology rules.

## Requirements

### Validated

- ✓ Local Fuseki/SPARQL analytics exist for warehouse stock, case timeline, invoice risk, OOG/HS risk, DEM/DET, customs, and document completeness queries.
- ✓ Local Flask API surfaces exist for health, ingest, evidence lookup, business rules, audit summary, audit verification, Fuseki deployment, and Fuseki validation.
- ✓ Business rules exist for CostGuard, HS risk, and certificate checks.
- ✓ Audit logging exists in CSV and NDJSON forms with hash verification.
- ✓ Gateway/OpenAPI examples exist for MRR draft, ETA prediction, and CostGuard estimates.
- ✓ GSD codebase map exists in `.planning/codebase/` and identifies current architecture, integrations, tests, and concerns.
- ✓ Phase 2 validated a canonical semantic adapter from local prototype vocabulary into canonical HVDC MCP-facing objects.
- ✓ Phase 2 validated Flow Code as warehouse-only through adapter and guardrail tests.
- ✓ Phase 3 validated a read-only Any-key Resolver for supported operational identifiers with confidence, evidence state, source fields, ambiguity/conflict/no-evidence states, and privacy masking.
- ✓ Phase 4 validated a read-only Operational Risk Radar that combines CostGuard, HS/OOG, customs, DEM/DET, milestone, document, and warehouse evidence into operator-facing risk cards.
- ✓ Phase 4 validated a CostGuard Evidence Pack that links invoice lines to BOE, CIPL, tariff, VAT, duty, and warehouse evidence without approving, disputing, paying, escalating, uploading, or writing data.
- ✓ Phase 5 validated a local read-only MCP-style tool surface for key resolution, risk radar, CostGuard evidence pack, evidence search, and output validation.
- ✓ Phase 5 validated structured tool envelopes with evidence refs, read-only annotations, malformed-input handling, no-evidence states, and secret/local-marker redaction.

### Active

- [ ] Decide whether local Fuseki stays as an analysis backend, a staging validator, or a retired prototype once Cloudflare MCP owns the public tool surface.
- [ ] Decide the release path: repair nested Git, move to a healthy repository, or package by file hashes before Cloudflare implementation work.

### Out of Scope

- Building a second public API beside the existing Cloudflare MCP endpoint is out of scope because it would split the client surface.
- Treating `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py` as an MCP server is out of scope because the map identifies it as a Flask bridge, not an MCP implementation.
- Promoting local sample `ex:Case` vocabulary as canonical ontology language is out of scope because the parent HVDC model uses shipment, journey, milestone, and evidence objects.
- Public ngrok/GPTs Actions operation is out of scope for production because Cloudflare MCP is the chosen public runtime.
- Direct graph writes from chat or dashboard actions are out of scope unless a human-gated action and audit record exist.

## Context

The mapped codebase is a brownfield prototype under `C:\Users\jichu\Downloads\HVDC Ontology Grounded\Ontology insight upgrade`.

Important existing files:

- `hvdc_api.py` exposes the local Flask API.
- `hvdc_rules.py` contains CostGuard, HS risk, and certificate checks.
- `nlq_to_sparql.py` and `nlq_query_wrapper_flask.py` map natural language to bounded SPARQL.
- `fuseki_swap_verify.py` handles staging graph upload, validation, backup, swap, and rollback.
- `queries/*.rq` contains the strongest operator-facing query ideas.
- `hvdc-code-mapping-v2.6.2.json` contains useful identifier and source-system mapping rules.
- `audit_logger.py`, `audit_ndjson_and_hash.py`, and `prov_mapping.ttl` provide evidence and audit concepts.
- `openapi.yaml`, `gpts_oneclick.ps1`, and `ngrok_setup.ps1` represent the old GPTs Actions path.

The existing production direction outside this folder is Cloudflare Workers/Agents MCP plus R2/D1/DO. Therefore this project should harvest useful local ideas, not move the public runtime back to local Flask or ngrok.

The codebase map identified several high-priority concerns:

- The nested Git repository has a broken HEAD, so commits from this folder currently fail.
- No first-class Cloudflare or MCP implementation exists inside this folder.
- Local APIs bind to development ports and do not enforce production authentication.
- Generated artifacts are mixed with source files.
- Current local sample vocabulary does not yet match the canonical master-spine ontology.

## Constraints

- **Runtime boundary**: Cloudflare MCP remains the public endpoint; local Fuseki can only support staging, analysis, or offline validation.
- **Ontology boundary**: Flow Code must stay inside `WarehouseHandlingProfile.confirmedFlowCode` and must not become route, customs, cost, or KPI language.
- **Evidence boundary**: Audit records, communication events, and approval actions provide evidence; they do not directly mutate shipment, cost, warehouse, or customs truth.
- **Git health**: The nested folder's Git HEAD is broken, so GSD commit steps cannot be trusted until Git is repaired or the work is moved into a healthy repository.
- **Security**: Upload, write, graph update, and audit access require authentication, scope checks, and human-gated actions before public use.
- **Data hygiene**: Runtime outputs in `artifacts/`, `logs/`, generated TTL, generated schemas, and sample Excel files must not be treated as canonical source unless explicitly curated.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Cloudflare MCP as the public surface | The parent HVDC system already moved toward Cloudflare Workers/Agents MCP, R2, and D1/DO. | - Pending |
| Treat local Fuseki as backend/staging, not public endpoint | Existing scripts are valuable for SPARQL validation but local ports/ngrok are not production-safe. | - Pending |
| Start with read-only risk and evidence tools | Upload/write tools require stronger auth, audit, and human-gate design. | Phase 5 implemented and verified local read-only MCP surface contract |
| Build Operational Risk Radar first | It directly supports the user's SCM work by merging cost, customs, OOG/HS, document, and milestone risk. | Phase 4 implemented read-only radar and CostGuard evidence pack |
| Preserve canonical ontology vocabulary | Prevents local sample model drift from becoming production semantic debt. | - Pending |
| Keep Any-key Resolver read-only for V1 | Identifier lookup is useful now, but upload/write/OAuth mutation work requires a later scoped design. | Phase 3 implemented read-only resolver and privacy masking only |

## Initial Project Options

### Option A: Operational Risk Radar

Create a read-only MCP-backed risk view that answers questions like:

- Which invoices need CostGuard evidence review?
- Which BOE/customs cases are late or missing documents?
- Which cargo has OOG/HS risk?
- Which DEM/DET or milestone risks need attention today?

This is the recommended first project because it produces immediate work value without requiring write tools.

### Option B: Any-key Resolver

Create a resolver that starts from any operational key and returns connected evidence:

- HVDC CODE
- BL No.
- BOE No.
- Invoice No.
- Package No.
- Container No.
- Site Code

This is a strong foundation for all later tools, but it may need more schema mapping before it becomes visible value.

### Option C: CostGuard Evidence Pack

Create a finance-focused evidence pack for invoice review:

- invoice header and line
- CIPL/BOE/tariff evidence
- VAT and duty presence
- warehouse handling evidence where relevant
- approval or dispute next action

This is valuable for invoice disputes, but it should follow or share the Any-key Resolver.

## Recommended V1

V1 should combine Option A and the minimum useful part of Option B:

1. User enters an operational key or asks a risk question.
2. System resolves the key to known evidence.
3. System returns an Operational Risk Radar answer with source documents, risk category, confidence, and next action.
4. System does not write graph data or operational state.

## Evolution

This document evolves at phase transitions and milestone boundaries.

After each phase transition:

1. Requirements invalidated? Move to Out of Scope with reason.
2. Requirements validated? Move to Validated with phase reference.
3. New requirements emerged? Add to Active.
4. Decisions to log? Add to Key Decisions.
5. "What This Is" still accurate? Update if drifted.

After each milestone:

1. Full review of all sections.
2. Core Value check: still the right priority?
3. Audit Out of Scope: reasons still valid?
4. Update Context with current state.

---
*Last updated: 2026-05-13 after Phase 5 execution*
