# Technology Stack Research

**Project:** HVDC Ontology Insight MCP Merge
**Dimension:** Stack and platform direction
**Researched:** 2026-05-13
**Overall confidence:** HIGH for local stack and Cloudflare MCP boundary; MEDIUM for exact production storage shape because production MCP code is outside this workspace.

## Recommendation

Use the local prototype as an analysis and validation workbench, not as the public production runtime.

V1 should expose a Cloudflare-hosted MCP endpoint with a small set of read-only, ontology-safe tools. The public boundary should be TypeScript on Cloudflare Workers / Agents, using the MCP TypeScript SDK and OpenAI Apps SDK metadata conventions. Cloudflare D1 should hold resolver indexes and compact read models. Cloudflare R2 should hold evidence artifacts and generated packs. Durable Objects / Agent state should coordinate per-session state, approval state, and lock-like workflows where strong consistency matters.

Keep Apache Jena Fuseki, Flask, pandas extraction, PowerShell scripts, and notebook-style query work local until the semantic adapter and validation gates prove that the local sample vocabulary maps cleanly to the canonical HVDC ontology model. Do not make ngrok, GPTs Actions, or local Flask ports part of the production MCP surface.

## Current Local Stack

| Layer | Current Technology | Role | Research Finding |
|---|---|---|---|
| Language | Python 3 | Flask APIs, extraction, rules, Fuseki deployment helpers, audit utilities, tests | Keep for local analysis and adapter development. Do not make it the public MCP runtime for V1. |
| Local API | Flask 3.0.0 | `hvdc_api.py`, `nlq_query_wrapper_flask.py`, mock gateway, Claude bridge | Useful as prototype wrappers, but currently local-dev and unauthenticated. |
| Graph store | Apache Jena Fuseki 4.10.0 / TDB2 | Local RDF store and SPARQL endpoint at `/hvdc` | Keep as local staging / semantic validation backend. Do not expose directly to ChatGPT or remote MCP clients. |
| Query layer | SPARQL templates in `queries/*.rq` plus NLQ mapping | Operational analytics for stock, invoice risk, customs, DEM/DET, document completeness | Harvest query intent and result shape. Wrap with canonical ontology adapter before production. |
| Business rules | `hvdc_rules.py` | CostGuard, HS risk, certificate checks | Reuse logic as tested rule kernels. Move only stable read outputs to MCP. |
| Local ops | PowerShell scripts | Fuseki setup, query runs, dashboards, ngrok/GPTs setup | Keep for Windows-local maintenance and staging. Archive or mark ngrok flow as dev-only. |
| Legacy public bridge | OpenAPI 3.1 + ngrok + GPTs Actions | Old public development path | Do not continue as production direction. It splits the public surface from Cloudflare MCP. |
| Audit evidence | CSV, NDJSON, hash metadata under `artifacts/` | Local traceability and integrity checks | Convert to R2/D1 evidence records in production. Keep local files as staging outputs only. |
| CI | GitHub Actions smoke flow | Starts Fuseki and runs local checks | Keep as prototype regression. Add Cloudflare MCP contract tests before production readiness. |

### Local Stack Constraints

- The workspace has no first-class Cloudflare Worker, MCP server, `wrangler.toml`, `package.json`, or Cloudflare binding configuration.
- Local APIs bind to development ports and do not enforce production authentication.
- Generated runtime files are mixed with source and sample artifacts.
- Local vocabulary uses prototype concepts such as `ex:Case`, `TransportEvent`, `StockSnapshot`, and `Invoice`; the production MCP must preserve canonical shipment, milestone, routing, evidence, and warehouse-handling semantics.
- The nested Git repository state is broken, so stack migration should avoid depending on local Git metadata until the repository is repaired or moved.

## Target Cloudflare MCP Stack Boundary

| Production Boundary | Recommended Technology | Purpose | Why |
|---|---|---|---|
| Remote MCP endpoint | Cloudflare Workers / Agents with TypeScript | Serve `/mcp` over Streamable HTTP | Cloudflare documents Workers/Agents as a supported way to build and deploy remote MCP servers. Remote MCP should use Streamable HTTP, not local stdio or deprecated SSE for new clients. |
| MCP implementation | `agents/mcp` + `@modelcontextprotocol/sdk` | Define MCP server and tools | Official examples use `McpServer`, `createMcpHandler`, and `McpAgent.serve("/mcp")` for Workers-hosted MCP servers. |
| Tool contract | OpenAI Apps SDK conventions on top of MCP | Make ChatGPT-facing tools predictable and UI-capable | Tools should declare schemas, `structuredContent`, `_meta.ui.resourceUri` for widgets, and `readOnlyHint: true` for read-only tools. |
| Auth | OAuth Provider / Cloudflare Access / scoped bearer tokens | Gate MCP access and tool scope | Remote MCP must not inherit the unauthenticated Flask/ngrok posture. Use scoped permissions for read tools first and separate write scopes later. |
| Resolver read model | Cloudflare D1 | Store operational key indexes, compact risk rows, evidence metadata, and tool execution audit summaries | D1 gives Workers a bound SQL database through `env.DB`, which fits resolver lookup and compact read models better than a full RDF store at the edge. |
| Evidence object store | Cloudflare R2 | Store source excerpts, generated evidence packs, TTL snapshots, NDJSON exports, and larger artifacts | R2 bindings let Workers read/write objects directly without calling Cloudflare REST APIs from inside the Worker. |
| Session / approval state | Durable Objects or Agent state | Coordinate session state, per-user pending approvals, locks, and write proposals | Durable Objects provide stateful serverless functions with persistent SQLite-backed storage and consistent per-object coordination. |
| Observability / governance | Cloudflare Access logs, Worker logs, MCP server portal where available | Audit who used which MCP server and tool | Cloudflare Access can govern MCP servers by identity, conditions, scope, and request/tool execution logs. |

### Boundary Rules

1. The public endpoint is one Cloudflare MCP endpoint, not Flask plus ngrok plus OpenAPI plus MCP.
2. MCP tools call canonical read models and evidence stores, not arbitrary local paths or raw uploaded spreadsheets.
3. Local Fuseki remains behind the migration boundary. It can produce validated snapshots, but the Worker should not depend on live `localhost:3030`.
4. Uploads, graph writes, and action registration stay out of V1 unless they use OAuth scopes, human approval, dry-run proposals, and audit records.
5. Tool schemas must encode canonical HVDC vocabulary: `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg`, `WarehouseHandlingProfile.confirmedFlowCode`, `AuditRecord`, `CommunicationEvent`, and `ApprovalAction`.

## What Stays Local

| Capability | Keep Local For V1 | Reason |
|---|---|---|
| Apache Jena Fuseki | Yes | Strong local SPARQL workbench and staging validator. Cloudflare D1/R2 should not be forced into becoming a full RDF/SPARQL engine in V1. |
| Excel extraction with pandas/openpyxl | Yes | Spreadsheet ingestion needs file quotas, validation, and quarantine before public use. Local batch processing is safer for V1. |
| PowerShell Fuseki loaders and dashboard scripts | Yes | They are Windows-local operator tools and are too coupled to ports and generated files for production MCP. |
| `fuseki_swap_verify.py` | Yes | Useful for staging graph validation and rollback experiments. Public graph mutation is out of scope for read-only V1. |
| SPARQL templates | Partially | Keep source templates local, then promote only vetted query intents and result schemas to Cloudflare read models. |
| Local audit CSV/NDJSON | Yes, as staging output | Preserve for local traceability; mirror production-grade evidence metadata to D1/R2 only after redaction and schema normalization. |
| ngrok/GPTs Actions flow | Dev-only or archive | It served the prototype, but it conflicts with a single Cloudflare MCP production boundary. |

## What Moves To MCP

| Capability | Move To Cloudflare MCP For V1 | Target Shape |
|---|---|---|
| Any-key lookup | Yes | `resolve_hvdc_key` read-only MCP tool backed by D1 identifier index. |
| Operational Risk Radar | Yes | `get_operational_risk_radar` read-only tool returning risk categories, evidence refs, confidence, and next action. |
| CostGuard Evidence Pack | Yes, read-only | `get_costguard_evidence_pack` tool returning invoice-line evidence, BOE/CIPL/tariff/warehouse refs, and blocking inputs. |
| Evidence retrieval | Yes, bounded | `get_evidence_trace` or embedded evidence refs backed by R2 object metadata and D1 indexes. |
| ChatGPT UI widget | Yes, optional V1.1 | Register an app resource such as `ui://hvdc/operational-risk-radar.html` and attach it through `_meta.ui.resourceUri`. |
| Tool-level auth and scopes | Yes | Read scopes first, for example `risk.read`, `evidence.read`, and `resolver.read`. Defer write scopes. |
| Human-gated writes | No for V1 | Introduce later as dry-run proposal tools, not direct graph mutations. |

## Recommended V1 Stack

### Core Runtime

| Technology | Version / Channel | Purpose | Why |
|---|---|---|---|
| TypeScript | Current stable Node-compatible toolchain | MCP server source | Strong schema typing and direct fit with MCP SDK examples. |
| Cloudflare Workers | Current Cloudflare platform | Public HTTPS runtime | Low-latency edge endpoint for ChatGPT and other MCP clients. |
| Cloudflare Agents SDK | Current | MCP server helper and state-capable agent runtime | Official Cloudflare MCP examples use Agents SDK primitives. |
| `@modelcontextprotocol/sdk` | Current v1.x/v2-compatible API | MCP tool/resource definitions | Standard MCP server implementation with typed schemas and structured tool results. |
| `@modelcontextprotocol/ext-apps` | Current | ChatGPT app resource/tool helpers | Needed if the V1 includes a rendered Operational Risk Radar widget. |
| Zod | Current | Runtime input/output validation | Matches MCP TypeScript examples and keeps tool schemas explicit. |
| Wrangler | Current | Deploy, configure bindings, secrets, and migrations | Cloudflare Worker deployment and D1/R2/Durable Object binding management. |

### Cloudflare Storage

| Technology | Purpose | V1 Use |
|---|---|---|
| D1 | Compact relational read model | Identifier resolution, risk summary rows, evidence metadata, status snapshots, tool audit index. |
| R2 | Artifact/object storage | Evidence packs, source excerpts, generated reports, TTL snapshots, NDJSON/hash exports. |
| Durable Objects / Agent SQL state | Coordinated state | Per-session state, pending approval records, locks, write proposal lifecycle after V1. |
| Workers Secrets | Secret storage | OAuth credentials, signing keys, upstream tokens. |

### Local Support Stack

| Technology | Purpose | V1 Use |
|---|---|---|
| Python 3.11 target | Local adapter, tests, batch jobs | Align with existing GitHub Actions instead of the local Python 3.14 observation. |
| Flask | Prototype API only | Keep for local testing while MCP tools are built in TypeScript. |
| Apache Jena Fuseki / Java 17 | RDF staging and SPARQL validation | Continue local validation and snapshot generation. |
| pytest | Regression checks | Add adapter and rule-output tests before promoting data to D1/R2. |
| PowerShell 7 | Windows local operations | Keep setup, query running, and local validation scripts. |

## V1 Tool Set

Start with three read-only tools.

| Tool | Input | Output | Storage |
|---|---|---|---|
| `resolve_hvdc_key` | `{ keyType?, keyValue }` | Canonical entity refs, matched identifiers, confidence, source systems | D1 identifier tables |
| `get_operational_risk_radar` | `{ keyValue?, riskTypes?, asOfDate? }` | Cost, customs, OOG/HS, DEM/DET, milestone, document risks with next action | D1 risk read model + R2 evidence refs |
| `get_costguard_evidence_pack` | `{ invoiceNo?, hvdcCode?, packageNo? }` | Invoice line summary, BOE/CIPL/tariff/warehouse evidence, blocking inputs, recommendation | D1 evidence index + R2 pack artifacts |

All three tools should use:

- `annotations: { readOnlyHint: true }`
- explicit `inputSchema` and `outputSchema`
- `structuredContent` for machine-readable answers
- `content` for compact operator-readable summary
- stable evidence references instead of inline full documents
- no direct graph writes, no direct email sending, and no mutation of shipment or cost truth

## Data Promotion Path

```text
Local Excel / TTL / Fuseki
  -> local semantic adapter
  -> canonical validation gate
  -> snapshot export
  -> D1 resolver and risk read-model load
  -> R2 evidence artifact load
  -> Cloudflare MCP read-only tools
  -> ChatGPT answer or widget
```

This path keeps the local prototype valuable while preventing prototype vocabulary from becoming production ontology language.

## Stack Risks

| Risk | Severity | Why It Matters | Mitigation |
|---|---|---|---|
| Treating Flask/ngrok as production | High | Splits public access and keeps unauthenticated local-dev assumptions alive | Make Cloudflare MCP the only production endpoint; mark ngrok/OpenAPI as dev-only. |
| Duplicating SPARQL logic in TypeScript | High | Local and MCP answers can diverge | Promote result contracts, not ad hoc rewrites; add contract tests against snapshots. |
| Moving raw graph writes into MCP too early | High | Could mutate ontology or evidence without human review | V1 read-only. Add write proposal tools later with OAuth scope, dry-run, approval, and audit. |
| Local vocabulary drift | High | Prototype `ex:Case` concepts can weaken canonical HVDC ontology rules | Require semantic adapter before D1/R2 load. Validate Flow Code warehouse-only boundary. |
| Missing auth and scope model | High | MCP exposes business-sensitive logistics and cost data | Use OAuth/Cloudflare Access, narrow scopes, and tool-level `securitySchemes`. |
| File and evidence leakage | Medium | BL, BOE, invoice, path, and container data may leak through artifacts | Store only redacted summaries in D1; gate R2 object access through scoped tools. |
| Broken Git metadata | Medium | Research and implementation diffs can be hard to trust | Repair/reclone before implementation milestones; do not use current Git state as completion evidence. |
| Lack of lockfile | Medium | Python local runs and CI can drift | Add constraints or lockfile for local adapter/test work. Add a Node lockfile for MCP source. |

## Technology Decisions

| Decision | Recommendation | Confidence | Reason |
|---|---|---|---|
| Public runtime | Cloudflare Workers / Agents MCP | HIGH | Official Cloudflare docs support building and deploying MCP servers on Cloudflare. |
| Remote MCP transport | Streamable HTTP at `/mcp` | HIGH | Cloudflare docs identify Streamable HTTP as the standard remote transport and SSE as deprecated for new remote clients. |
| Tool design | Few goal-shaped tools | HIGH | Cloudflare best practices warn against wrapping the full API schema and recommend focused tools. |
| ChatGPT result contract | Apps SDK metadata and `structuredContent` | HIGH | OpenAI Apps SDK docs specify tool descriptors, UI resource URI metadata, annotations, and structured content. |
| Main production read store | D1 + R2 | MEDIUM | Fits resolver/risk/evidence read models, but exact production schema needs phase-specific design. |
| Full RDF production query engine | Keep Fuseki local for V1 | MEDIUM | Local stack already has Fuseki; no Cloudflare RDF/SPARQL implementation exists in this workspace. |
| Write tools | Defer | HIGH | Existing project scope says read-only risk lookup first; local write endpoints lack production auth and gates. |

## Installation Direction

Do not add this stack inside the current prototype root until the repo state is healthy. When implementation starts, create a separate Cloudflare MCP package or production MCP workspace with a clear boundary.

```bash
npm create cloudflare@latest hvdc-ontology-mcp
cd hvdc-ontology-mcp
npm install agents @modelcontextprotocol/sdk @modelcontextprotocol/ext-apps zod
npm install -D typescript wrangler
```

Then add:

- `wrangler.toml` or `wrangler.jsonc` with D1, R2, Durable Object, and secret bindings
- D1 migrations for resolver, risk, evidence metadata, and audit indexes
- MCP tool contract tests
- snapshot loader tests from local adapter output
- Cloudflare deployment checks

## Sources

### Local Sources

- `.planning/PROJECT.md` - project scope, target Cloudflare MCP direction, V1 recommendation, and out-of-scope boundaries. Confidence: HIGH.
- `.planning/config.json` - GSD workflow config and research settings. Confidence: HIGH.
- `.planning/codebase/STACK.md` - current Python, Flask, Fuseki, PowerShell, OpenAPI, and dependency inventory. Confidence: HIGH.
- `.planning/codebase/INTEGRATIONS.md` - local integrations, ngrok/GPTs Actions, Fuseki, auth gaps, and missing Cloudflare files. Confidence: HIGH.
- `.planning/codebase/ARCHITECTURE.md` - current service boundaries and MCP/Cloudflare merge implications. Confidence: HIGH.
- `.planning/codebase/CONCERNS.md` - stack risks, security gaps, test gaps, and missing MCP implementation. Confidence: HIGH.

### Official / Documentation Sources

- Cloudflare Agents MCP overview: https://developers.cloudflare.com/agents/model-context-protocol/ - remote vs local MCP, focused tool design, scoped permissions. Confidence: HIGH.
- Cloudflare MCP transport: https://developers.cloudflare.com/agents/model-context-protocol/transport/ - Streamable HTTP for remote MCP and SSE deprecation note. Confidence: HIGH.
- Cloudflare `McpAgent` API: https://developers.cloudflare.com/agents/api-reference/mcp-agent-api/ - `McpAgent.serve("/mcp")` and OAuth integration. Confidence: HIGH.
- Cloudflare `createMcpHandler` API: https://developers.cloudflare.com/agents/api-reference/mcp-handler-api/ - stateless and stateful MCP handler patterns. Confidence: HIGH.
- Cloudflare MCP governance: https://developers.cloudflare.com/agents/model-context-protocol/governance/ - Access-based MCP governance, identity, conditions, scope, and logs. Confidence: HIGH.
- Cloudflare Workers docs via Context7: D1 bindings, R2 bindings, Durable Objects, Workers best practices. Confidence: HIGH.
- MCP TypeScript SDK docs via Context7: `registerTool`, schemas, annotations, and `structuredContent`. Confidence: HIGH.
- OpenAI Apps SDK reference: https://developers.openai.com/apps-sdk/reference - `_meta.ui.resourceUri`, `structuredContent`, `outputSchema`, and tool annotations including `readOnlyHint`. Confidence: HIGH.
- OpenAI Apps SDK MCP server guide: https://developers.openai.com/apps-sdk/build/mcp-server - `registerAppTool`, app resources, HTTPS deployment, and widget integration. Confidence: HIGH.
- OpenAI Apps SDK auth guide: https://developers.openai.com/apps-sdk/build/auth - OAuth metadata and `_meta["mcp/www_authenticate"]` behavior. Confidence: HIGH.

## Open Questions For Planning

- Will production MCP read from a curated D1/R2 snapshot only, or will it also call a private upstream ontology service?
- Which canonical identifier table owns conflicts between HVDC CODE, BL No., BOE No., invoice no., package no., container no., and site code?
- What is the minimum evidence redaction policy before BL/BOE/invoice artifacts move into R2?
- Does V1 need a ChatGPT widget, or is structured text output enough for the first milestone?
- Where will Cloudflare production code live: inside the parent HVDC ontology MCP repo, or as a separate package fed by this planning stream?
