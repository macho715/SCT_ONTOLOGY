# Project Research Summary

**Project:** HVDC Ontology Insight MCP Merge
**Domain:** HVDC SCM/logistics operational risk and evidence lookup
**Researched:** 2026-05-13
**Confidence:** MEDIUM-HIGH

## Executive Summary

This project is a brownfield merge from a local HVDC Ontology Insight prototype into the production HVDC ontology MCP direction. The product should not become another dashboard, Flask API, or ngrok/OpenAPI public surface. It should become a small set of Cloudflare-hosted MCP tools that let SCM/logistics operators resolve operational keys, see risk across cost/customs/OOG/HS/milestones/documents/warehouse status, and inspect evidence-backed next actions.

The recommended V1 is a read-only Operational Risk Radar backed by the minimum useful Any-key Resolver and a CostGuard Evidence Pack. The local Fuseki/SPARQL, Flask, Python rules, audit files, and dashboards should stay valuable as staging, analysis, and snapshot-generation assets, but production users should see only canonical MCP outputs shaped around `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg`, evidence objects, and `WarehouseHandlingProfile.confirmedFlowCode` for warehouse-only Flow Code.

The main risk is not missing technology. The main risk is letting local prototype vocabulary, unauthenticated endpoints, generated artifacts, or Flow Code route semantics leak into production. The mitigation is strict boundary sequencing: fix source/artifact hygiene, build the semantic adapter and validation gates first, then ship read-only MCP tools, and only later add authenticated upload/write/action flows with human approval and audit evidence.

## Key Findings

### Recommended V1 Direction

V1 should combine Option A and the minimum useful part of Option B from `PROJECT.md`: an Operational Risk Radar plus Any-key Resolver. The operator should enter an HVDC CODE, BL No., BOE No., invoice no., package no., container no., PO no., site code, or a risk question. The system should resolve the context, return risk cards, cite evidence references, state confidence, and provide one next action.

V1 must not write graph data, approve invoices, close milestones, send messages, ingest arbitrary uploads, or expose local Fuseki/Flask/ngrok as production endpoints.

### Stack Decision

Use Cloudflare MCP as the public production boundary and keep the local prototype as an analysis and validation workbench.

**Core technologies:**
- TypeScript on Cloudflare Workers / Agents: owns the remote `/mcp` endpoint, tool schemas, and public runtime boundary.
- MCP TypeScript SDK plus OpenAI Apps SDK conventions: defines tool descriptors, `structuredContent`, schemas, widget resource metadata, and read/write annotations.
- Cloudflare D1: stores resolver indexes, compact risk read models, evidence metadata, and audit hash indexes.
- Cloudflare R2: stores bounded evidence artifacts, generated packs, TTL snapshots, and larger source excerpts.
- Durable Objects or Agent state: reserved for session state, approval state, locks, and future write proposal workflows.
- Python, Flask, Fuseki, pandas, PowerShell: remain local-only for adapter development, SPARQL staging, batch processing, and validation.

Critical version/channel decisions are directional rather than pinned in this research. Use current Cloudflare Workers/Agents, current MCP SDK, current Apps SDK helpers, current Wrangler, and Python 3.11 for local adapter/test alignment. Do not build production on local Python 3.14 observations, local ports, or ngrok.

### Expected Features

**Must have (table stakes):**
- Any-key Resolver: resolves HVDC CODE, BL No., BOE No., invoice no., package no., container no., PO no., and site code into canonical context with confidence.
- Operational Risk Radar: merges CostGuard, HS/OOG, customs, DEM/DET, milestone, document, and warehouse risk into one operator-facing view.
- CostGuard Evidence Pack: links invoice lines to BOE, CIPL, tariff, warehouse evidence, missing inputs, confidence, and review stance.
- HS/OOG and customs risk view: surfaces heavy cargo, controlled HS, OOG, customs delay, and document-completeness exposure.
- Shipment timeline and milestone view: translates local event/timeline ideas into canonical `MilestoneEvent` and `JourneyStage`.
- Warehouse stock and movement summary: keeps Flow Code inside warehouse handling and shows inbound/outbound/net/closing stock.
- Document completeness and evidence status: shows required-vs-complete state, source refs, no-evidence states, and provenance.
- Semantic adapter layer: maps local `Case`, `TransportEvent`, `StockSnapshot`, and `Invoice` outputs into canonical MCP objects before any public answer.

**Should have (differentiators):**
- Evidence-backed next-action card with category, evidence, confidence, blocking input, owner cue, and one next action.
- Multi-source HVDC key recovery across PKGS, OFCO, DSV, PAY, PO, supplier, invoice, BL, container, package, payment ref, and amount.
- Cross-risk correlation by shipment or package so the operator sees one risk story instead of disconnected reports.
- No-evidence, partial-evidence, and conflicting-evidence states instead of guessed answers.
- Explainable matching confidence with matched fields, source system, match method, and fallback status.

**Defer (v2+):**
- Upload/write tools, graph deploy, and arbitrary spreadsheet ingestion until auth, quarantine, human gates, and audit mutation models exist.
- Direct Fuseki deploy from MCP until graph URI allowlists, locks, TTL validation, SHACL/SPARQL gates, and rollback tests exist.
- Full dashboard rewrite until the MCP structured output contract is stable.
- Predictive ETA, MRR drafting, autonomous disputes, approvals, and public ngrok/GPTs Actions.

### Architecture Approach

The architecture should enforce one production public boundary: Cloudflare MCP. Local Flask, OpenAPI, ngrok, direct Fuseki dashboards, and generated dashboard files are prototype or staging assets only. The production answer path should route through MCP schemas, canonical corpus search, identifier resolution, semantic validation, risk read models, and optional widget rendering. Local Fuseki may materialize risk snapshots, but production should not call `localhost:3030` or expose raw SPARQL to users.

**Major components:**
1. Cloudflare MCP Worker: owns `/mcp`, auth/scopes, tool descriptors, CORS, D1/R2 bindings, and widget resources.
2. MCP tool contract layer: defines focused read tools, explicit schemas, result `structuredContent`, and honest read/write annotations.
3. Ontology answer service: routes questions, searches canonical evidence, validates grounding, and composes operator-readable answers.
4. Semantic adapter: converts local Fuseki/query/rule outputs into canonical shipment, milestone, evidence, cost, customs, and warehouse objects.
5. Local Fuseki/SPARQL workbench: supports staging validation, query development, and offline materialization only.
6. Audit layer: records hashes, masking state, actor/tool correlation, and evidence references without mutating operational truth.
7. Widget/dashboard layer: renders MCP structured output and does not call Fuseki directly.
8. Future upload/write layer: uses R2/D1, OAuth/scopes, approval objects, dry-run proposals, and audit records.

### Critical Pitfalls

1. **Semantic drift from local `ex:*` vocabulary:** Build a semantic adapter first and block local `ex:Case`, `TransportEvent`, `StockSnapshot`, and local invoice shapes from public MCP outputs.
2. **Flow Code misuse outside warehouse handling:** Enforce `WarehouseHandlingProfile.confirmedFlowCode` as the only allowed Flow Code owner and use routing/milestone concepts elsewhere.
3. **Dual public surfaces:** Make Cloudflare MCP the only production endpoint and mark Flask, ngrok, OpenAPI, and local dashboards as dev-only or migration references.
4. **Unauthenticated write/upload/deploy behavior:** Keep V1 read-only and require OAuth/scopes, server-side authorization, human approval, and audit records before any write or upload tool.
5. **Unsafe graph swap/deploy semantics:** Keep graph mutation out of V1 and later add graph allowlists, locks, unique backups, TTL validation, semantic gates, and rollback tests.
6. **Broken Git and generated artifacts:** Repair Git or use explicit file hashes before implementation; separate source from generated outputs before release evidence is trusted.
7. **False green tests:** Split unit, contract, live service, semantic, security, and UI checks; warnings and skips must not be reported as PASS.
8. **Audit overclaiming:** Treat local CSV/NDJSON hashes as prototype evidence only until production audit identity, redaction, concurrency, and retention are designed.

## Direct Implications for REQUIREMENTS.md

Requirements should define V1 as a read-only operator risk and evidence lookup product.

Add or preserve these V1 requirements:
- Users can submit any supported operational key and receive canonical shipment/package/evidence context.
- Users can request an Operational Risk Radar and receive cost, customs, OOG/HS, DEM/DET, milestone, document, and warehouse risk cards.
- Users can request a CostGuard Evidence Pack and receive invoice-line evidence, missing inputs, confidence, and a review stance without final approval/dispute automation.
- Every public answer must use canonical ontology language, not local sample vocabulary.
- Flow Code must remain warehouse-only under `WarehouseHandlingProfile.confirmedFlowCode`.
- Results must include evidence references, confidence, and no-evidence or conflicting-evidence states where applicable.
- V1 tools must not mutate graph data, shipment state, invoice state, warehouse truth, email state, or approval records.

Add explicit non-requirements for V1:
- No public Flask/OpenAPI/ngrok endpoint.
- No direct Fuseki public access.
- No direct graph deploy from chat.
- No arbitrary upload or spreadsheet ingestion.
- No autonomous approval, dispute, escalation, email send, or operational state mutation.

Add validation requirements:
- Adapter fixtures prove local query outputs map into canonical objects.
- Flow Code boundary tests block route, customs, marine, cost, or KPI usage.
- Resolver tests return ambiguity instead of forced joins.
- MCP contract tests cover malformed input, no evidence, structured output, and read-only behavior.
- Security tests are required before any future write/upload/action phase.

## Implications for ROADMAP.md

Based on research, suggested phase structure:

### Phase 0: Repository and Artifact Hygiene

**Rationale:** Git is reported broken and generated artifacts are mixed with source, so implementation evidence cannot be trusted yet.
**Delivers:** Healthy Git or file-hash fallback, source/generated inventory, dev-only markings for ngrok/OpenAPI, artifact policy, and clean fixture boundaries.
**Addresses:** Production boundary clarity and release evidence.
**Avoids:** Broken Git evidence, generated artifact drift, stale ngrok/public URL leakage, false completion claims.

### Phase 1: Semantic Adapter and Validation Gate

**Rationale:** Every useful feature depends on canonical mapping and Flow Code guardrails.
**Delivers:** Local-to-canonical adapter, canonical output fixtures, Flow Code WHP-only tests, no-evidence/ambiguous-ID handling, and validation findings with PASS/WARN/BLOCK/NO_EVIDENCE.
**Addresses:** Semantic adapter, Any-key Resolver foundation, CostGuard evidence shape, milestone/timeline mapping.
**Avoids:** `ex:*` vocabulary leakage, Flow Code route semantics, forced false joins.

### Phase 2: Read-only V1 MCP Risk Tools

**Rationale:** This is the first visible user value and does not require unsafe write/upload flows.
**Delivers:** `resolve_hvdc_operational_key`, `get_operational_risk_radar`, `get_costguard_evidence_pack`, and optional detail tools for HS/OOG/customs, milestones, warehouse stock, and evidence search.
**Uses:** Cloudflare Workers/Agents, MCP SDK, Apps SDK conventions, D1 read models, R2 evidence references.
**Implements:** MCP tool contract layer, ontology answer service, risk read model, and evidence reference output.
**Avoids:** Full Flask API wrapping, raw SPARQL exposure, production claims from local-only tests.

### Phase 3: Operator UI, Audit, and Auth Clarity

**Rationale:** Once the read contract is stable, the operator view and governance details can be made durable.
**Delivers:** Risk radar widget or answer card, evidence drawer, transcript-safe structured output, D1 audit hash policy, PII/domain redaction tests, and final read-scope auth decision.
**Addresses:** Evidence-backed next-action card, drilldown, audit/provenance summary, and production-safe result rendering.
**Avoids:** Dashboard-as-data-access, secret/PII leakage through tool output, audit overclaiming, incorrect `readOnlyHint` annotations when audit writes occur.

### Phase 4: Future Upload/Write and Human-gated Actions

**Rationale:** Upload and write actions are valuable but unsafe until read tools, auth, evidence, and audit boundaries are stable.
**Delivers:** OAuth/scoped authorization, upload quarantine, file validation, graph URI allowlists, dry-run write proposals, approval objects, audit IDs, and rollback-tested graph deployment if still needed.
**Addresses:** Deferred upload/write/action features.
**Avoids:** Direct chat graph mutation, unsafe file paths, arbitrary TTL deploy, action without human confirmation.

### Phase 5: Production Hardening and Release Gates

**Rationale:** Local success does not prove remote MCP production readiness.
**Delivers:** CI gates that fail on required check failures, remote MCP smoke tests, contract tests, semantic/security test suites, dependency locks, environment profiles, and release evidence.
**Addresses:** Production deployment confidence and maintainability.
**Avoids:** False PASS reports, platform drift, local runtime assumptions, stale artifact evidence.

### Phase Ordering Rationale

- Phase 0 comes first because the research flags broken Git and source/generated confusion as blockers for trustworthy implementation evidence.
- Phase 1 must precede user-facing features because resolver, risk radar, CostGuard, timeline, and warehouse summaries all depend on canonical adapter output.
- Phase 2 should ship the read-only V1 value before upload/write because the existing local prototype lacks production auth and human gates.
- Phase 3 follows the read contract because UI and audit semantics should render and govern stable tool outputs, not define the data boundary.
- Phase 4 is deliberately later because upload/write/graph mutation requires threat modeling, scopes, approval, and rollback.
- Phase 5 formalizes release proof after the core product path exists.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Needs field-level mapping against `CONSOLIDATED-00-master-ontology.md` and relevant extension docs.
- **Phase 2:** Needs final MCP package location and exact Cloudflare implementation context because this workspace has no deployable MCP code.
- **Phase 3:** Needs final decision on Cloudflare Access, OAuth provider, or internal OAuth for read scopes and audit identity.
- **Phase 4:** Needs threat modeling for spreadsheet upload, TTL deploy, graph mutation, approval actions, and audit storage.
- **Phase 5:** Needs clean Git or clean clone before release evidence can rely on changed-file status.

Phases with standard patterns where deeper research can be skipped unless implementation context changes:
- **Phase 0:** Source/generated inventory, `.gitignore` policy, and dev-only documentation markings are standard repo hygiene.
- **Phase 2:** Basic read-only MCP tool schema patterns are well documented; research should focus on domain mapping, not generic tool registration.
- **Phase 5:** Dependency locks, CI separation, and smoke-test reporting are standard once the production package exists.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Local stack and Cloudflare MCP boundary are strongly supported by research; exact production storage schema remains a planning decision. |
| Features | HIGH | Table-stakes features are repeated across project scope, query assets, rules, and feature research. |
| Architecture | MEDIUM-HIGH | Boundary direction is clear; exact production code location is outside this workspace. |
| Pitfalls | HIGH | Local risks are backed by codebase maps, direct inspection, and repeated research findings; some Cloudflare-specific risks depend on future implementation. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- Production MCP package location: decide whether implementation lives in the parent HVDC MCP repo, a new Cloudflare package, or a separate package fed by this planning stream.
- D1/R2 schema shape: design exact resolver, risk, evidence, and audit tables during Phase 2 planning.
- Auth model: choose Cloudflare Access, OAuth provider, or internal OAuth before any protected production rollout.
- Evidence redaction policy: define how BL, BOE, invoice, container, PO, site, personal, local path, and rate data are masked.
- Semantic mapping detail: validate local query fields against `CONSOLIDATED-00` and target extension docs before implementation.
- Git health: repair or move to a clean clone before using Git status, commits, or diffs as completion evidence.

## Sources

### Primary Local Sources

- `.planning/PROJECT.md` - project scope, V1 direction, active requirements, constraints, and out-of-scope boundaries.
- `.planning/research/STACK.md` - recommended stack, local/prod boundary, Cloudflare MCP direction, D1/R2/DO roles, and stack risks.
- `.planning/research/FEATURES.md` - table-stakes features, differentiators, anti-features, dependencies, and V1 feature bundle.
- `.planning/research/ARCHITECTURE.md` - component boundaries, data flow, MCP/Fuseki boundary, read-only tool surface, and build order.
- `.planning/research/PITFALLS.md` - critical pitfalls, mitigations, phase warnings, required tests, and deeper research flags.

### Supporting Local Sources Cited by Research

- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/INTEGRATIONS.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/TESTING.md`
- `queries/*.rq`
- `hvdc-code-mapping-v2.6.2.json`
- `hvdc_api.py`
- `hvdc_rules.py`
- `fuseki_swap_verify.py`
- `audit_logger.py`
- `audit_ndjson_and_hash.py`
- `openapi.yaml`

### Official Documentation Sources Cited by Research

- OpenAI Apps SDK reference and MCP server guidance: tool descriptors, `structuredContent`, `_meta.ui.resourceUri`, auth behavior, and read/write annotations.
- OpenAI Apps SDK security and privacy guidance: least privilege, explicit consent for writes, server-side validation, audit logs, PII redaction, OAuth, and scope enforcement.
- Cloudflare Agents MCP documentation: remote MCP, Streamable HTTP, MCP handlers, OAuth/scopes, governance, and focused tool design.
- Cloudflare Workers, D1, R2, Durable Objects, and Wrangler documentation: runtime, bindings, object storage, SQL storage, and deployment patterns.
- MCP TypeScript SDK and schema references: tool schemas, annotations, and structured results.
- Apache Jena Fuseki documentation: local SPARQL/query/update and Graph Store Protocol capabilities.

---
*Research completed: 2026-05-13*
*Ready for requirements and roadmap: yes*
