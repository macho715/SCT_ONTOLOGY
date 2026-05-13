# Domain Pitfalls

**Domain:** HVDC Ontology Insight prototype to production MCP-backed operational risk tool
**Project:** HVDC Ontology Insight MCP Merge
**Researched:** 2026-05-13
**Overall confidence:** HIGH for local codebase risks, MEDIUM for target MCP/Cloudflare design risks because no first-class Cloudflare MCP implementation exists in this workspace.

## Executive Risk Summary

The biggest risk is not a missing framework. The biggest risk is promoting a useful local Flask/Fuseki prototype into production without first separating three boundaries: canonical ontology semantics, public MCP tool contracts, and local generated runtime evidence.

The current codebase has strong operator ideas: CostGuard, HS/OOG risk, document completeness, Fuseki staging, audit logging, and NLQ-to-SPARQL templates. It also has prototype shortcuts that are dangerous in production: unauthenticated write endpoints, file-path ingestion, generated artifacts mixed with source, a broken Git HEAD, and tests that can report success while real integration checks only warned.

The roadmap should therefore start with repository and semantic hygiene, then a read-only MCP risk view, then authentication and human-gated write/upload flows. Write, upload, graph update, export, and action tools should not ship until they have OAuth/scopes, server-side authorization, audit records, and tests for malformed input, no-evidence states, and prompt-injection attempts.

## Critical Pitfalls

### Pitfall 1: Semantic Drift From Local `ex:Case` Vocabulary Into Canonical MCP Answers

**What goes wrong:** Local sample terms such as `ex:Case`, `ex:TransportEvent`, `ex:StockSnapshot`, `ex:warehouseType`, and `ex:hvdcCode` become the production ontology vocabulary.

**Why it happens:** The local prototype's TTL, SPARQL, and NLQ templates already use those terms. The parent repository rules require shipment visibility through `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg`, and evidence objects. Without an adapter, the fastest implementation path will leak sample vocabulary into production.

**Consequences:** Operators may receive answers that look grounded but cannot traverse the canonical shipment, milestone, evidence, cost, customs, or warehouse model. Later SHACL/SPARQL validation will require a rewrite.

**Prevention:**
- Create a semantic adapter before MCP tools.
- Treat local `ex:*` sample vocabulary as source/staging vocabulary, not public schema.
- Define canonical output objects for resolver, risk radar, CostGuard evidence, and evidence snippets.
- Require `CONSOLIDATED-00` coverage for answer-grounding work.
- Return `NO_EVIDENCE` instead of inventing canonical objects when the adapter cannot map a local row.

**Detection:**
- CI grep/SPARQL guard blocks `ex:Case`, `ex:TransportEvent`, and `ex:StockSnapshot` in MCP output fixtures unless they appear inside explicit adapter tests.
- Validation gate includes `A-ROUTE-001` and `A-ANS-001`.
- Contract tests assert stable canonical identifiers for follow-up tool calls.

**Phase mapping:** Phase 1, Semantic Adapter and Validation Gate.

**Confidence:** HIGH. Local planning docs and direct grep confirm local sample vocabulary in `triples.ttl`, `hvdc-integration-demo.py`, `nlq_to_sparql.py`, and `queries/*.rq`.

### Pitfall 2: Flow Code Misuse as Route, Cost, Customs, Marine, or KPI Logic

**What goes wrong:** Flow Code becomes an end-to-end route classifier or risk bucket instead of staying warehouse-only under `WarehouseHandlingProfile.confirmedFlowCode`.

**Why it happens:** The product goal combines cost, customs, DEM/DET, milestone, document, HS/OOG, and warehouse risk. That creates pressure to use one simple classification across all lanes. The parent ontology explicitly forbids using Flow Code as route, customs, cost, marine, or KPI semantics.

**Consequences:** Direct, WH-only, MOSB, mixed, customs, cost, and marine cases become semantically wrong. AGI/DAS offshore flows can miss MOSB staging evidence. CostGuard can incorrectly explain invoice risk as Flow Code risk.

**Prevention:**
- Use `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, and `JourneyLeg` for route and milestone visibility.
- Use `WarehouseHandlingProfile.confirmedFlowCode` only after warehouse receipt semantics are available.
- Keep CostGuard evidence tied to invoice, BOE/CIPL/tariff, warehouse handling evidence, and route-based cost drivers.
- Add a Flow Code boundary validator before any risk answer leaves the MCP layer.

**Detection:**
- Block `assignedFlowCode`, `extractedFlowCode`, `costByFlowCode`, and route/KPI prose framed as Flow Code analytics.
- Require tests for `A-FLOW-001: Flow Code WHP-only`.
- Add fixtures where route risk exists but warehouse Flow Code is absent; expected answer should use `RoutingPattern`, not Flow Code.

**Phase mapping:** Phase 1, Semantic Adapter and Validation Gate; Phase 2, Read-only Operational Risk Radar.

**Confidence:** HIGH for ontology rule; MEDIUM for local code because current workspace grep found no direct Flow Code terms, so this is a merge-design risk rather than a current code misuse.

### Pitfall 3: Duplicating the Local Flask/OpenAPI Surface as a Second Production API

**What goes wrong:** Cloudflare MCP becomes a wrapper around existing local Flask routes or the old GPTs/OpenAPI/ngrok schema, creating two public surfaces with different auth, validation, data shape, and lifecycle rules.

**Why it happens:** The prototype already has `hvdc_api.py`, `nlq_query_wrapper_flask.py`, `mock_gateway_server.py`, `openapi.yaml`, generated `openapi.updated.yaml`, and ngrok scripts. No `wrangler.toml`, `package.json`, `server.ts`, or `mcp.json` was detected in this workspace.

**Consequences:** ChatGPT, Cloudflare MCP, local Flask, PowerShell scripts, and OpenAPI Actions can disagree on what a risk answer means. Security fixes can land in one surface but not the others. Operators can call stale ngrok or local endpoints instead of the production MCP endpoint.

**Prevention:**
- Make Cloudflare MCP the only public client surface.
- Keep local Flask/Fuseki as private backend, staging validator, or retired prototype.
- Design a small set of goal-shaped MCP tools instead of exposing every Flask route.
- Reuse one query/adapter contract across local tests and MCP tools.
- Archive or clearly mark GPTs/ngrok files as dev-only before production docs are written.

**Detection:**
- No production docs point users to ngrok or local ports.
- MCP contract tests compare local adapter output and Cloudflare tool output for the same fixture.
- Tool inventory review rejects full API-schema wrapping.

**Phase mapping:** Phase 0, Repository and Artifact Hygiene; Phase 2, Read-only MCP Risk Tools.

**Confidence:** HIGH. Local architecture and integrations map identify OpenAPI/ngrok as active prototype path and no first-class Cloudflare MCP code in this workspace. Cloudflare MCP docs also warn against treating an MCP server as a wrapper around a full API schema.

### Pitfall 4: Shipping Write, Upload, Audit, or Graph Update Endpoints Without Production Auth

**What goes wrong:** Public or semi-public clients can ingest files, read audit summaries, verify logs, run rules, or deploy TTL to Fuseki without enforced identity, authorization scopes, or human confirmation.

**Why it happens:** `openapi.yaml` declares `X-API-Key`, but `hvdc_api.py`, `nlq_query_wrapper_flask.py`, `mock_gateway_server.py`, and the Claude bridge do not enforce production auth. `hvdc_api.py` accepts uploaded files and JSON file paths, and `/fuseki/deploy` accepts `ttl_content` plus `target_graph`.

**Consequences:** An attacker or mistaken client can read local files, upload unsafe spreadsheets, mutate graph data, expose audit details, or corrupt the production graph. In an MCP context, prompt injection can turn a risk lookup into an unsafe action unless server-side checks enforce scope and confirmation.

**Prevention:**
- Phase production as read-only first.
- Use OAuth/scoped auth for remote MCP. Enforce scopes server-side on every tool call.
- Mark read tools with `readOnlyHint: true`; mark destructive/open-world tools with the relevant annotations and still enforce authorization on the server.
- Require Human-gate plus `AuditRecord` for write/action/export/upload/send tools.
- Restrict uploads to a quarantine directory; normalize names; block `..`; validate MIME, size, extension, and workbook shape.
- Whitelist graph URIs and block arbitrary `target_graph` values.

**Detection:**
- Tests call write/upload/deploy tools without auth and expect `401` or `403`.
- Tests call the same tools with insufficient scope and expect denial.
- Path traversal fixtures such as `../`, absolute paths, and reserved Windows paths are rejected.
- Prompt-injection test prompts cannot trigger write/action/export tools without Human-gate.

**Phase mapping:** Phase 2 only read-only; Phase 3 Auth and Human-Gated Actions; Phase 4 Upload/Write.

**Confidence:** HIGH. Direct code inspection confirms unauthenticated Flask routes and upload/deploy behavior. OpenAI Apps SDK security guidance requires least privilege, explicit consent for write access, server-side validation, audit logs, and scope enforcement.

### Pitfall 5: Unsafe Graph Swap and Rollback Semantics

**What goes wrong:** A tool or API call deploys arbitrary TTL into an arbitrary graph, drops the target graph, and performs backup/swap/rollback without locks, scoped authorization, or canonical semantic validation.

**Why it happens:** `FusekiSwapManager` is useful for local staging, but it accepts `ttl_content` and `target_graph`; it uses fixed staging and backup graph names; it verifies counts but does not enforce a production graph allowlist, SHACL gate, write lock, or concurrent deployment protection.

**Consequences:** Production graph data can be overwritten, backup graphs can collide, rollback can restore the wrong snapshot, and count-based validation can pass while semantic quality is wrong.

**Prevention:**
- Keep graph update outside V1.
- Introduce graph URI allowlists, deployment locks, versioned backups, size budgets, TTL parsing, SHACL/SPARQL semantic gates, and dry-run summaries.
- Treat graph deploy as an administrative action, not a normal operator risk lookup.
- Store deployment evidence as `ApprovalAction` or audit evidence, not as direct operational truth.

**Detection:**
- Tests reject unknown target graphs.
- Two concurrent deploy tests cannot overlap the same staging/backup graph.
- Validation requires semantic guard pass, not only triple count equality.
- Rollback test proves restoration from a uniquely named backup graph.

**Phase mapping:** Phase 4 Upload/Write; Phase 5 Operational Hardening.

**Confidence:** HIGH for local code behavior; MEDIUM for production design because write tooling may be deferred.

### Pitfall 6: Broken Git State Makes Research, Diff, and Phase Completion Untrustworthy

**What goes wrong:** GSD phases, reviews, and commits use a broken nested Git repository as evidence of changed files or clean state.

**Why it happens:** `git status --short` currently fails with `fatal: bad object HEAD`. The codebase concerns document that `.git/HEAD` points to `refs/heads/main`, but the referenced object is missing.

**Consequences:** Researchers and implementers cannot reliably separate source changes, generated artifacts, and parallel-agent edits. Roadmap execution can miss files or overwrite another worker's changes.

**Prevention:**
- Repair Git before implementation phases, or move verified files into a healthy clone.
- Until repaired, use path-scoped write rules, checksums, file inventories, and explicit changed-file lists.
- Do not make commit readiness, branch state, or changed-file claims from this broken `.git` directory.

**Detection:**
- Phase 0 gate runs `git status --short` and blocks if it fails.
- File-level hashes are captured before wide edits.
- Implementation tasks list modified paths explicitly instead of relying on Git.

**Phase mapping:** Phase 0, Repository and Artifact Hygiene.

**Confidence:** HIGH. Current command execution reproduced `fatal: bad object HEAD`.

### Pitfall 7: Generated Artifacts Treated as Canonical Source or Current Evidence

**What goes wrong:** Files under `artifacts/`, `logs/`, generated TTL files, generated `openapi.updated.yaml`, generated smoke reports, and local health JSON are treated as source of truth.

**Why it happens:** Runtime outputs are committed or stored beside source files. Tests and health checks write into `artifacts/`. The generated OpenAPI file contains a specific ngrok URL. The local workspace has `hvdc_extracted_*.ttl`, audit logs, health reports, integration results, and upgrade logs.

**Consequences:** Roadmap and production docs can cite stale local runtime state as if it were current production evidence. Tests can dirty the workspace. Private paths or endpoint URLs can leak into public artifacts.

**Prevention:**
- Add a generated-artifact policy and `.gitignore` before broad implementation.
- Curate fixtures into clearly named fixture directories.
- Write runtime output to ignored paths.
- Treat `openapi.yaml` as source and `openapi.updated.yaml` as generated dev output.
- Never use artifact timestamps or health reports as proof of current MCP behavior.

**Detection:**
- CI fails if generated files change during unit tests.
- Secret/path scanner checks artifacts before release.
- Docs include a "source vs generated" table.

**Phase mapping:** Phase 0, Repository and Artifact Hygiene; Phase 5 Operational Hardening.

**Confidence:** HIGH. Planning docs and direct file inventory confirm generated files and runtime outputs in normal workspace paths.

### Pitfall 8: False Green Test Results

**What goes wrong:** Tests or smoke scripts print PASS even when integration, ingestion, NLQ, or deployment checks only warned, skipped, or accepted failure states.

**Why it happens:** `test_hvdc_api.py` accepts `[200, 500]` for an NLQ path. `.github/workflows/audit-smoke.yml` runs `python test_integration.py || echo warning`, so that integration failure does not fail the job. `test_logi_master_enhanced_audit.sh` prints final PASS labels for business rules, Fuseki deploy, integration tests, and audit integrity even when earlier steps warn or skip.

**Consequences:** A phase can be marked complete without a working read-only risk radar, live Fuseki integration, or production-safe MCP behavior. Broken semantics and auth gaps can pass CI.

**Prevention:**
- Split unit, contract, live service, semantic, security, and UI tests.
- Make each release gate fail on unmet required conditions.
- Record skipped checks as `SKIP`, not PASS.
- Add MCP contract tests for malformed input, no evidence, read-only annotations, and auth failures.
- Add semantic tests for Flow Code boundary and canonical adapter output.

**Detection:**
- CI status fails when integration tests fail.
- Test report includes counts for PASS, WARN, BLOCK, NO_EVIDENCE, SKIP, and FAIL.
- Coverage threshold is introduced only after fragile tests are corrected.

**Phase mapping:** Phase 1 validation; Phase 2 read-only MCP; Phase 5 hardening.

**Confidence:** HIGH. Current test and workflow files show permissive assertions and warning-only paths.

### Pitfall 9: Audit Logs Look Stronger Than They Are

**What goes wrong:** The system claims production-grade auditability because CSV and NDJSON logs exist with hashes.

**Why it happens:** The prototype writes audit rows and hash metadata, but the audit store is local flat files under `artifacts/`; redaction misses HVDC-specific identifiers such as PO, BL, BOE, container, invoice, phone, full names, and local paths; concurrent writes and cross-host deployment are not covered.

**Consequences:** Sensitive operational identifiers can leak. Audit trails can fork by host, be overwritten by tests, or fail to prove action provenance for production MCP tools.

**Prevention:**
- Define audit as an append-only production service or transactional store before action tools.
- Add domain-specific redaction patterns.
- Store stable action IDs, actor identity, scope, approval state, evidence hash, and tool-call correlation ID.
- Keep evidence records separate from operational truth mutation.

**Detection:**
- Redaction tests include phone, email, token, private link, PO, BL, BOE, container, invoice, local path, and raw rate examples.
- Audit integrity tests use temporary paths and do not mutate committed artifacts.
- Write/action tests assert an `AuditRecord` or explicit no-write result.

**Phase mapping:** Phase 3 Auth and Human-Gated Actions; Phase 4 Upload/Write; Phase 5 hardening.

**Confidence:** HIGH. Local audit modules and planning docs confirm current redaction scope and flat-file storage.

### Pitfall 10: Local Runtime Assumptions Masquerade as Production Readiness

**What goes wrong:** A green local run on Windows ports `3030`, `5002`, `5010`, `5003`, `8080`, or dashboard ports is treated as evidence that a remote MCP-backed operational tool is production ready.

**Why it happens:** The prototype is script-oriented and local-first. Flask apps bind to local/dev interfaces. PowerShell scripts are first-class operational tools. Fuseki paths, dashboards, and health checks assume local machine topology.

**Consequences:** Linux CI, Cloudflare Workers, remote ChatGPT clients, OAuth callbacks, TLS, rate limits, retries, and durable storage can fail after local success.

**Prevention:**
- Define separate dev, CI, staging, and production profiles.
- Move endpoints, ports, graph URIs, artifact directories, and secrets into configuration.
- Use Cloudflare MCP only as the public surface and local Fuseki only behind private backend boundaries.
- Add deployment smoke tests against the real MCP endpoint before release claims.

**Detection:**
- CI runs on a clean environment with no local artifacts.
- Production smoke validates remote MCP route, auth challenge, read-only tool call, and no-evidence response.
- No release checklist accepts local health endpoints as production proof.

**Phase mapping:** Phase 0 hygiene; Phase 2 read-only MCP; Phase 5 hardening.

**Confidence:** HIGH for local assumptions; MEDIUM for Cloudflare production shape because implementation is not present yet.

## Moderate Pitfalls

### Pitfall 11: Natural Language to SPARQL Safety Is Partial

**What goes wrong:** NLQ support expands beyond bounded templates and allows unsafe or misleading queries.

**Prevention:** Keep V1 query generation template-based; validate generated SPARQL; block update operations; enforce result limits; add tests for injection-like input and unsupported questions.

**Phase mapping:** Phase 2.

### Pitfall 12: CostGuard Becomes a Judgment Tool Without Evidence Packs

**What goes wrong:** CostGuard returns overcharge or dispute conclusions without BOE, CIPL, tariff, warehouse handling, and approval evidence.

**Prevention:** Make CostGuard output evidence completeness, confidence, and next action. Do not label a financial dispute as final without required evidence and human review.

**Phase mapping:** Phase 2 for read-only evidence; Phase 3 for human-gated action.

### Pitfall 13: Any-Key Resolver Creates False Joins

**What goes wrong:** HVDC CODE, BL, BOE, DO, invoice, container, PO, package, and site identifiers are matched by weak string similarity instead of source-system-aware identity rules.

**Prevention:** Use identifier objects with scheme, value, normalized value, source system, primary flag, and validity window. Return ambiguous matches as multiple candidates with confidence, not a single forced answer.

**Phase mapping:** Phase 1 adapter; Phase 2 resolver.

### Pitfall 14: Dashboard Scripts Become the UI Contract

**What goes wrong:** Generated dashboards and local PowerShell proxies become the operator UI contract instead of a stable MCP response schema and widget contract.

**Prevention:** Build the risk radar around MCP `structuredContent` and a stable output schema. Use `_meta` only for component-only hydration and avoid secrets in transcript-visible fields.

**Phase mapping:** Phase 2.

### Pitfall 15: Dependency and Platform Drift

**What goes wrong:** Clean installs, CI, Windows PowerShell, Linux shell, and Cloudflare runtime resolve different dependencies and paths.

**Prevention:** Add a lock or constraints file for Python; isolate Cloudflare dependencies separately; verify PowerShell syntax for Windows scripts; keep production TypeScript/Cloudflare code outside generated Fuseki folders.

**Phase mapping:** Phase 0; Phase 5.

## Minor Pitfalls

### Pitfall 16: Hyphenated Python Files Stay in Service Imports

**What goes wrong:** Dynamic imports for files like `hvdc-integration-demo.py` make service startup fragile.

**Prevention:** Move reusable logic into importable snake_case modules and keep demos as wrappers.

### Pitfall 17: Placeholder Credentials Become Trusted Defaults

**What goes wrong:** Demo keys, example Gateway URLs, Shiro config, or generated ngrok metadata are reused in production docs.

**Prevention:** Replace values with obvious placeholders, read secrets from environment or Cloudflare bindings, and run secret scanning before release.

### Pitfall 18: Health Checks Prove Liveness but Not Risk Correctness

**What goes wrong:** `/health`, Fuseki ping, or NLQ status are treated as proof that operational risk answers are correct.

**Prevention:** Separate liveness, readiness, semantic correctness, evidence completeness, and authorization checks.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation | Required Gate |
|-------------|----------------|------------|---------------|
| Phase 0: Repo and artifact hygiene | Broken Git and generated files hide real source changes | Repair/reclone Git; add artifact policy; inventory source vs generated files | `git status --short` works, or phase explicitly uses non-Git file hashes |
| Phase 1: Semantic adapter | Local `ex:Case` vocabulary becomes canonical | Build adapter and canonical output fixtures first | Adapter tests plus Flow Code boundary tests |
| Phase 1: Validation gate | Validation only counts triples | Add route, evidence, Flow Code, currentness, PII, and action gates | `ValidationFinding[]` covers PASS/WARN/BLOCK/NO_EVIDENCE |
| Phase 2: Read-only Risk Radar | Tool wraps full Flask API surface | Build few goal-shaped tools: resolve key, get risk radar, get evidence pack | MCP schema tests and `readOnlyHint: true` |
| Phase 2: Any-key Resolver | Weak joins create false operational context | Use identifier scheme/source/validity; return ambiguity | Ambiguous ID fixture returns candidates, not forced truth |
| Phase 2: Widget/UI | Secrets leak through `structuredContent` | Keep transcript-visible content minimal; put component-only data in `_meta` only when safe | Snapshot test for no secrets/PII in tool result |
| Phase 3: Auth | API key examples are mistaken for production auth | Use OAuth/scopes for remote MCP and enforce scopes server-side | Unauthorized calls return `401`; wrong scope returns `403` |
| Phase 3: Human-gated actions | Model-triggered action bypasses operator review | Require explicit human confirmation and audit record | Write/action/export/send fixture blocks without confirmation |
| Phase 4: Upload/write | Upload path or TTL deploy mutates graph unsafely | Quarantine files, validate content, whitelist graph URIs, version backups | Path traversal and unknown graph tests fail safely |
| Phase 5: CI/hardening | Smoke scripts print PASS for warnings or skips | Make release gates fail on required check failures | CI report separates PASS/WARN/SKIP/FAIL and exits non-zero on blockers |

## Prevention Strategy by Roadmap Order

1. **Repository and source boundary first.**
   - Repair Git or move to a healthy clone.
   - Add source/generated artifact policy.
   - Mark ngrok/GPTs Actions files as dev-only.
   - Do not begin wide implementation while diff evidence is broken.

2. **Semantic adapter before feature polish.**
   - Map local Fuseki/sample data into canonical shipment, milestone, evidence, cost, customs, and warehouse objects.
   - Add Flow Code WHP-only tests.
   - Add no-evidence and ambiguous-ID fixtures.

3. **Read-only MCP tools before write tools.**
   - Start with `resolve_operational_key`, `get_operational_risk_radar`, and `get_costguard_evidence_pack`.
   - Mark read tools with `readOnlyHint: true`.
   - Keep outputs concise and schema-backed.

4. **Authentication and human gate before upload/write.**
   - Add OAuth/scoped auth.
   - Enforce scopes in the server, not just tool annotations.
   - Require Human-gate plus audit records for graph updates, exports, approvals, or email/send actions.

5. **Production validation before production claims.**
   - Fix false-green tests.
   - Add contract tests shared by local adapter and Cloudflare MCP.
   - Add production smoke tests against the real MCP endpoint and auth path.

## Required Test Additions

| Risk Area | Tests to Add | Why |
|-----------|--------------|-----|
| Semantic drift | Adapter fixtures for local `ex:Case` to canonical shipment/evidence output | Prevents sample vocabulary from becoming production output |
| Flow Code misuse | BLOCK tests for Flow Code outside `WarehouseHandlingProfile.confirmedFlowCode` | Protects route/cost/marine/milestone semantics |
| Auth | No-token, expired-token, wrong-scope, correct-scope tests | Prevents public write/read leakage |
| Upload | Path traversal, unsafe filename, wrong MIME, oversize workbook, malformed workbook | Prevents unsafe file ingestion |
| Graph deploy | Unknown graph, oversized TTL, invalid TTL, failed SHACL, concurrent deploy | Prevents graph corruption |
| MCP contract | Malformed input, no evidence, ambiguous resolver match, read-only annotations | Makes ChatGPT behavior predictable |
| PII/redaction | Email, phone, token, private URL, PO, BL, BOE, container, invoice, local path | Prevents logistics-sensitive leakage |
| CI truthfulness | Warning-only and skipped check fixtures | Stops false PASS reporting |

## Research Flags for Deeper Phase Work

- **Phase 1 semantic adapter:** Needs deeper research against `CONSOLIDATED-00-master-ontology.md` and target extension docs before final field mapping.
- **Phase 2 MCP contract:** Needs app-side design once the Cloudflare/Apps SDK package exists. Current workspace has no deployable MCP code.
- **Phase 3 auth:** Needs final decision on Cloudflare Access vs third-party OAuth vs internal OAuth provider.
- **Phase 4 upload/write:** Needs threat modeling for spreadsheets, TTL graph deploy, audit storage, and approval actions before implementation.
- **Phase 5 CI:** Needs a clean Git repository or clean clone before reliable changed-file and release evidence can exist.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Semantic drift | HIGH | Local vocabulary is present in source TTL, query, and demo files; canonical target is specified in repository rules and planning docs. |
| Flow Code misuse | MEDIUM | Current workspace does not show direct Flow Code terms, but the parent ontology rule makes this a high-impact merge risk. |
| Local-vs-Cloudflare duplication | HIGH | Planning docs identify local Flask/OpenAPI/ngrok surfaces and no first-class Cloudflare MCP files in the workspace. |
| Auth/write/upload | HIGH | Direct code inspection shows unauthenticated local routes and unconstrained path/upload/deploy behavior. |
| Broken Git | HIGH | `git status --short` fails with `fatal: bad object HEAD`. |
| Generated artifacts | HIGH | Artifact, log, generated TTL, and generated OpenAPI files are present in normal workspace paths. |
| Test coverage | HIGH | Test and CI files contain permissive or warning-only success paths. |
| Cloudflare production specifics | MEDIUM | Official docs are current, but target implementation is absent locally. |

## Sources

### Local planning and codebase sources

- `.planning/PROJECT.md` - project value, scope, Cloudflare MCP direction, validated/active requirements, constraints.
- `.planning/config.json` - GSD settings, research enabled, parallelization enabled, no branching strategy.
- `.planning/codebase/CONCERNS.md` - broken Git, security gaps, generated artifacts, semantic drift, test gaps.
- `.planning/codebase/TESTING.md` - current test commands, live service dependencies, permissive tests, missing coverage.
- `.planning/codebase/ARCHITECTURE.md` - local Flask/Fuseki/OpenAPI/ngrok architecture and MCP merge implications.
- `.planning/codebase/INTEGRATIONS.md` - external services, auth gaps, ngrok/GPTs Actions, no Cloudflare implementation detected.
- `.planning/codebase/CONVENTIONS.md` - source/generated conventions, masking rules, MCP/validation skill constraints.
- `hvdc_api.py` - unauthenticated ingest, evidence, rules, audit, Fuseki deploy, and `0.0.0.0:5002` local service behavior.
- `fuseki_swap_verify.py` - staging, validation, backup, swap, rollback, and graph deployment behavior.
- `nlq_to_sparql.py`, `triples.ttl`, `sample_invoice_data.ttl`, `queries/*.rq` - local sample ontology vocabulary.
- `test_hvdc_api.py`, `.github/workflows/audit-smoke.yml`, `test_logi_master_enhanced_audit.sh` - false-green and coverage risk evidence.
- `../.agents/skills/mcp-tool-contract/SKILL.md`, `../.agents/skills/validation-gate/SKILL.md`, `../.agents/skills/answer-grounding/SKILL.md` - project-local MCP, validation, and grounding gates.

### Official documentation sources

- OpenAI Apps SDK Reference: tool annotations require read/write/destructive/open-world hints, and servers must still enforce authorization. Tool `structuredContent` and `content` appear in the transcript; `_meta` is component-only. https://developers.openai.com/apps-sdk/reference
- OpenAI Apps SDK Security and Privacy: production connectors need least privilege, explicit consent for write access, server-side validation, audit logs, PII redaction, OAuth 2.1, scope enforcement, and `401` for bad tokens. https://developers.openai.com/apps-sdk/guides/security-privacy
- Cloudflare Agents MCP overview: remote MCP uses Streamable HTTP plus OAuth, and tool design should not wrap a full API schema. https://developers.cloudflare.com/agents/model-context-protocol/
- Cloudflare Agents MCP authorization: MCP authorization uses OAuth 2.1 patterns; scopes and permissions should map to MCP tools and be enforced. https://developers.cloudflare.com/agents/model-context-protocol/authorization/
- Cloudflare Agents MCP handler/transport docs: `createMcpHandler`, auth context, per-request server creation, stateful transports, and OAuth provider patterns for Worker-hosted MCP. https://developers.cloudflare.com/agents/model-context-protocol/mcp-handler-api/ and https://developers.cloudflare.com/agents/model-context-protocol/transport/
