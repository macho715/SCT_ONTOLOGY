# Architecture Patterns

**Project:** HVDC Ontology Insight MCP Merge
**Domain:** Ontology-grounded logistics risk and evidence tools
**Researched:** 2026-05-13
**Overall confidence:** MEDIUM-HIGH

## Recommendation

Use the existing Cloudflare Workers MCP server as the only production public boundary. Do not promote the local Flask, ngrok, or direct Fuseki dashboards into production.

The local HVDC Ontology Insight prototype should be harvested as an internal analysis and validation backend. Its SPARQL query packs, Fuseki staging workflow, audit concepts, and dashboard ideas are useful, but they must flow through the canonical production MCP contract before users see them.

The target shape is:

```text
ChatGPT / MCP clients
        |
        v
Cloudflare Worker /mcp
  - tool schemas
  - auth and scopes
  - UI resource registration
  - D1 audit hashes
  - R2 managed files
        |
        v
HVDC ontology service layer
  - route question
  - search canonical corpus
  - resolve any key
  - validate answer
  - build operational risk radar
        |
        +----------------------------+
        |                            |
        v                            v
Canonical corpus and Cloudflare      Local Fuseki/SPARQL prototype
read models                          - staging validation
  - generated corpus assets          - query development
  - D1/R2 managed metadata           - offline analytics
  - approved risk snapshots          - dashboard prototyping
```

## Component Boundaries

| Component | Responsibility | Communicates With | Boundary Rule |
|-----------|----------------|-------------------|---------------|
| Cloudflare MCP Worker | Owns `/mcp`, public tool descriptors, OAuth/Bearer handling, widget resources, CORS, and Cloudflare storage adapters. | ChatGPT/MCP clients, D1, R2, internal ontology service functions. | This is the production endpoint. No separate public Flask or ngrok API. |
| MCP tool contract layer | Defines one job per tool, explicit input/output schemas, tool annotations, result `structuredContent`, and widget resource metadata. | Worker runtime, ChatGPT Apps host, tests. | Tool annotations must be honest: tools that write audit rows are not strictly read-only. |
| Ontology answer service | Routes the question, retrieves canonical evidence, resolves identifiers, validates grounding, composes answer and next action. | Corpus, resolver, risk adapter, widget renderer. | Uses `CONSOLIDATED-00` first and preserves Flow Code as WHP-only. |
| Semantic adapter | Maps local `ex:Case`, `TransportEvent`, `StockSnapshot`, `Invoice`, and query outputs to canonical `ShipmentUnit`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg`, `InvoiceLine`, `EvidenceSnippet`, and `WarehouseHandlingProfile`. | Local Fuseki query output, production ontology service. | No local sample vocabulary becomes canonical. |
| Local Fuseki/SPARQL | Supports local graph analysis, staging validation, query development, benchmarking, and offline materialization of risk snapshots. | Local scripts, semantic adapter, optional offline export. | Not public. Not called from production as `localhost`. No direct chat writes. |
| Audit layer | Records minimal evidence that a tool ran by hashing input/output and masking PII. | MCP tools, D1 audit table, local NDJSON/CSV prototype. | Audit evidence does not mutate shipment, cost, warehouse, customs, or route truth. |
| Dashboard/widget layer | Renders the user-facing risk and evidence card. | MCP tool output and registered `ui://hvdc/answer-card-v7.html` resource. | Reads structured tool output. Does not call Fuseki directly from the browser. |
| Legacy Gateway/OpenAPI layer | Keeps old MRR, ETA, and CostGuard OpenAPI examples as reference or dev-only mocks. | Local tests and migration notes. | Do not expose as a second production client surface. |
| Future upload/write layer | Creates upload URLs, records file metadata, attaches uploaded files, and manages write dry-runs/commits inside Cloudflare R2/D1. | OAuth/Bearer auth, R2, D1, approval input, audit. | Human-gated. Does not write ERP/WMS/Fuseki/ontology truth directly. |

## Data Flow

### Read-Only V1 Answer Flow

1. User asks an operational question or provides an identifier.
2. Cloudflare MCP receives the request at `/mcp`.
3. `route_question` identifies ontology domains and required corpus documents.
4. `resolve_any_key` extracts and normalizes BL, BOE, DO, Invoice, HVDC code, site, milestone, and related keys.
5. `search_ontology_corpus` retrieves canonical evidence from generated corpus assets.
6. The risk adapter adds local-prototype-derived signals only after semantic mapping to canonical objects.
7. `validate_answer` blocks or warns on missing master evidence, Flow Code misuse, M130/MOSB chain gaps, cost evidence gaps, customs evidence gaps, stale source risk, and human-gate needs.
8. `render_hvdc_answer_card` renders the structured answer through the registered HVDC widget.
9. Audit writes only hashes and PII-mask flags to D1 or local audit artifacts. It does not update operational truth.

### Local Fuseki Materialization Flow

1. Source TTL, sample workbooks, or curated extracts load into local Fuseki staging graphs.
2. Existing query packs run for warehouse stock, case timeline, invoice risk, OOG/HS risk, DEM/DET, customs, and document completeness.
3. `fuseki_swap_verify.py` validates staging graph content before any local swap.
4. A semantic adapter converts approved query results into canonical risk read-model records.
5. The approved read model is exported as generated corpus data, D1 rows, or R2 snapshots for the production MCP to read.

Production should not call `http://localhost:3030` from Cloudflare. If live production SPARQL is later needed, place it behind a protected remote service with Cloudflare Access or export the graph-derived read model into Cloudflare storage.

### Future Upload/Write Flow

1. User requests upload or write.
2. Tool checks OAuth/Bearer auth, required scope, approval object, size, path, and purpose.
3. Upload goes to short-lived R2 object URL and records token/file metadata in D1.
4. Attachment links an uploaded object to a target reference as metadata only.
5. Write creates a dry-run proposal in R2/D1.
6. Commit copies a prior approved proposal into managed R2 storage.
7. A separate curation process may later transform approved files into ontology or Fuseki updates after semantic validation.

This keeps upload/write capabilities useful without letting chat or dashboard actions mutate the knowledge graph directly.

## Local Fuseki Role

Local Fuseki should stay as an analysis backend and staging validator.

Use it for:

- SPARQL query development and regression checks.
- Named graph staging, backup, swap, and rollback drills.
- Offline validation of query packs before materializing production read models.
- Operator-only dashboard prototypes and performance measurements.
- Comparing legacy sample vocabulary against canonical ontology vocabulary.

Do not use it for:

- Production public MCP traffic.
- Direct browser dashboard access in the deployed app.
- Chat-triggered SPARQL Update or Graph Store Protocol writes.
- Route, customs, cost, or KPI truth if the data still uses Flow Code route semantics.
- A second source of truth beside the Cloudflare MCP and canonical corpus.

The Fuseki boundary is valuable because Apache Jena Fuseki supports SPARQL query/update and Graph Store Protocol. That makes it suitable for local RDF validation, but it also makes its write endpoints sensitive. Production exposure would require auth, graph allowlists, limits, and approval gates that the local prototype does not currently enforce.

## Cloudflare MCP Role

Cloudflare MCP should own the production conversation boundary.

Use it for:

- The remote `/mcp` endpoint.
- Tool discovery, tool invocation, and schema enforcement.
- ChatGPT widget resource registration.
- R2 storage for managed uploaded files and write proposals.
- D1 storage for audit hashes, upload tokens, uploaded file metadata, attachments, and write proposals.
- OAuth/Bearer metadata and scope checks for protected tools.

The parent production app already follows this direction:

- `server/src/worker.ts` routes `/mcp` through `createMcpHandler`.
- `wrangler.toml` binds `HVDC_FILES` R2 and `MCP_AUDIT_DB` D1.
- `server/src/hvdc-server.ts` registers MCP tools and widget resources.
- `server/src/ui.ts` defines `ui://hvdc/answer-card-v7.html` plus compatibility aliases.
- Migrations define D1 tables for audit, upload tokens, uploaded files, attachments, and write proposals.

The merge should extend this runtime. It should not add another public OpenAPI gateway for the local prototype.

## Read-Only V1 Tool Surface

V1 should be business-read-only: it may search, resolve, validate, summarize, and render risk, but it must not write graph data, approve invoices, send messages, close milestones, or publish reports.

Recommended V1 tools:

| Tool | Purpose | Annotation Guidance |
|------|---------|---------------------|
| `resolve_any_key` | Resolve BL, BOE, DO, Invoice, HVDC code, site, milestone, package, or shipment key into candidate canonical entities. | `readOnlyHint: true` if it does not write audit state. |
| `search_ontology_corpus` | Retrieve canonical evidence snippets from approved ontology corpus documents. | `readOnlyHint: true`. |
| `get_operational_risk_radar` | Return a consolidated risk view for CostGuard, HS/OOG, customs, DEM/DET, milestones, document completeness, and next action. | `readOnlyHint: true` only if no audit row is written. If D1 audit is written inside the tool, mark false and explain business-read-only behavior. |
| `get_costguard_evidence_pack` | Link invoice lines to BOE/CIPL/tariff/warehouse evidence and return review status without approval. | Same audit caveat as above. |
| `validate_answer` | Check grounding, Flow Code boundary, missing evidence, and human-gate rules. | `readOnlyHint: true`. |
| `render_hvdc_answer_card` | Render the answer/risk card from structured content. | `readOnlyHint: true` and `_meta.ui.resourceUri` set to the registered widget URI. |

Avoid a wide tool set in V1. The strongest pattern is one visible operator answer/radar tool plus small helper tools for routing, search, resolve, validation, and rendering.

Important annotation rule: official Apps SDK review guidance treats tools that create/update/delete data, trigger jobs, or write logs as not strictly read-only. If the project keeps mandatory D1 audit writes on the main answer tool, call the tool business-read-only in product language but do not label it `readOnlyHint: true`.

## Future Upload/Write Boundary

Future upload/write work should use the existing Cloudflare protected storage pattern, not local Flask uploads or Fuseki GSP writes.

Required boundary rules:

- Require OAuth/Bearer authentication and scope checks.
- Require a human approval object with approver role, approval reference, and reason.
- Store files in R2 and metadata in D1.
- Keep write proposals as dry-run first.
- Commit only prior approved proposals.
- Return audit IDs, hashes, object keys, and status.
- Do not write to ERP, WMS, email, messaging, production Fuseki, or canonical ontology files from the chat tool.
- Convert approved uploaded data into ontology updates only through a separate curation and validation process.

This boundary lets the app collect evidence while preserving the repository rule that evidence and approval records do not directly mutate shipment, warehouse, customs, cost, or route truth.

## Dashboard Boundary

The production dashboard should be a widget or dashboard view backed by MCP structured output.

Use local dashboard scripts only to harvest:

- Useful risk cards.
- Operator filter ideas.
- Query groupings.
- Thresholds and KPI names.
- Performance checks.

Do not carry forward:

- Browser-to-Fuseki direct calls.
- PowerShell proxy variants as production service code.
- Duplicate dashboard HTML files.
- Runtime-generated dashboard HTML as canonical source.

The dashboard read model should be shaped for operator scanning:

- Identifier row: shipment, BL, BOE, invoice, container, site.
- Risk lanes: CostGuard, HS/OOG, customs, DEM/DET, milestone, document completeness.
- Evidence drawer: document, section, hash, confidence, source type.
- Next action: one owner role, one requested input, human-gate flag.
- Trace status: supported vs no direct evidence.

## Patterns to Follow

### Pattern 1: Canonical Adapter Before Risk Logic

**What:** Convert local prototype vocabulary into canonical HVDC ontology objects before risk scoring.

**When:** Any local query result or sample model enters the production MCP answer path.

**Example:**

```typescript
type LocalInvoiceRiskRow = {
  caseId: string;
  invoiceNo: string;
  riskLevel: string;
  flowCode?: string;
};

type CanonicalCostEvidence = {
  shipmentUnitId: string | null;
  invoiceNo: string;
  riskSeverity: "INFO" | "WARN" | "BLOCK";
  evidenceIds: string[];
  routingPattern: string | null;
  warehouseHandlingProfileId: string | null;
};
```

Flow Code-like fields in local rows must not drive route, customs, cost, or KPI categories. They either map to `WarehouseHandlingProfile.confirmedFlowCode` with M110+ warehouse evidence or stay out of the canonical result.

### Pattern 2: Materialized Risk Read Model

**What:** Run richer SPARQL locally or in a protected staging environment, then publish small canonical risk records for MCP reads.

**When:** A query is too heavy, too local, or too sensitive to run on every chat request.

**Example:**

```json
{
  "riskId": "risk_INV_001",
  "targetType": "Invoice",
  "targetRef": "INV-001",
  "riskLane": "CostGuard",
  "severity": "WARN",
  "evidenceIds": ["ev_boe_001", "ev_cipl_001"],
  "humanGateRequired": true,
  "source": "fuseki_materialized_snapshot"
}
```

### Pattern 3: Widget Reads Tool Output

**What:** The widget renders what the MCP tool returns. It does not run its own SPARQL.

**When:** Any user-visible dashboard, risk radar, or evidence card.

**Example:**

```typescript
return {
  structuredContent: riskRadar,
  content: [{ type: "text", text: summarizeRiskRadar(riskRadar) }],
  _meta: { ui: { resourceUri: "ui://hvdc/answer-card-v7.html" } }
};
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Cloudflare Worker Calls Localhost Fuseki

**What:** The deployed Worker tries to call `http://localhost:3030/hvdc/sparql`.
**Why bad:** In Cloudflare, localhost is the Worker runtime, not the operator PC. This would fail or hit the wrong boundary.
**Instead:** Use local Fuseki to materialize approved snapshots, or expose a protected remote graph service deliberately.

### Anti-Pattern 2: Dual Public Surfaces

**What:** Keep both Cloudflare MCP and ngrok/OpenAPI as production user surfaces.
**Why bad:** Tool behavior, auth, audit, and schema drift across two entry points.
**Instead:** Cloudflare MCP is production. OpenAPI/ngrok remains dev-only or archived.

### Anti-Pattern 3: Dashboard Owns Data Access

**What:** Browser dashboard sends SPARQL directly to Fuseki.
**Why bad:** It bypasses auth, audit, semantic adapter, and MCP schema controls.
**Instead:** Dashboard consumes MCP structured output or a protected read model API behind the same auth boundary.

### Anti-Pattern 4: Chat Writes Graph Truth

**What:** Upload/write tools mutate Fuseki, ontology docs, milestones, invoices, or warehouse state directly.
**Why bad:** It bypasses human approval, semantic validation, and rollback planning.
**Instead:** Store evidence and proposals in R2/D1, then run a separate curated validation and deployment workflow.

### Anti-Pattern 5: Flow Code Risk Buckets

**What:** Cost, customs, route, or operations dashboards classify end-to-end state by Flow Code.
**Why bad:** Repository rules limit Flow Code to `WarehouseHandlingProfile.confirmedFlowCode`.
**Instead:** Use `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg`, and WHP only when warehouse evidence supports it.

## Build Order Implications

1. **Freeze the public boundary**
   - Declare Cloudflare MCP `/mcp` as the only production surface.
   - Mark local Flask, OpenAPI, and ngrok paths as dev-only.

2. **Define the semantic adapter**
   - Map local `Case`, event, stock, invoice, and query fields to canonical objects.
   - Add Flow Code boundary tests before risk work.

3. **Harvest query packs**
   - Select the useful SPARQL queries from `queries/*.rq`.
   - Normalize output into canonical risk read-model rows.
   - Do not expose raw SPARQL as a public tool.

4. **Build V1 Operational Risk Radar**
   - Add a small read-oriented MCP tool or extend `ask_hvdc_ontology` output with `operationalRiskRadar`.
   - Cover CostGuard, HS/OOG, customs, DEM/DET, milestones, and document completeness.

5. **Render the dashboard through MCP output**
   - Update the widget/card to show risk lanes and evidence drawer.
   - Keep browser code free of direct Fuseki calls.

6. **Wire audit carefully**
   - D1 audit should hash inputs and outputs and record PII masking.
   - If a tool writes audit rows, do not claim strict `readOnlyHint: true`.

7. **Add future upload/write only after V1 reads are stable**
   - Use existing R2/D1 protected storage.
   - Require auth scopes, approval object, dry-run, commit, and audit ID.

8. **Retire or quarantine legacy public assets**
   - Keep OpenAPI/Gateway examples as migration references.
   - Remove generated public tunnel URLs from any production path.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Query execution | Generated corpus and small D1/R2 read models are enough. | Materialize heavy SPARQL snapshots and cache risk lanes. | Use partitioned read models, versioned snapshots, and async refresh jobs. |
| Local Fuseki | Developer/operator staging only. | Separate protected graph service or batch export pipeline if needed. | Treat Fuseki as offline validation or replace with managed production graph service. |
| Audit | D1 hash rows are enough. | Add retention, partitioning, and audit query views. | Move long-term audit to durable append-only storage with export. |
| Dashboard | Render MCP structured output. | Add pagination and lane-level filtering. | Precompute dashboards by role, site, and date. |
| Upload/write | Manual human-gated proposals. | Add approval queues and status polling. | Add workflow engine, immutable evidence IDs, and signed provenance bundles. |

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Local prototype architecture | HIGH | Requested codebase maps and local docs consistently describe Flask, Fuseki, audit, OpenAPI, and dashboard boundaries. |
| Production Cloudflare MCP boundary | HIGH | Parent source contains Cloudflare Worker `/mcp`, R2/D1 bindings, tool descriptors, widget resources, and migrations. |
| Local Fuseki production role | HIGH | Project constraints explicitly restrict local Fuseki to staging, analysis, or offline validation. |
| Read-only V1 tool design | MEDIUM-HIGH | Official Apps SDK/MCP guidance is clear, but existing answer tool writes audit rows, so annotation strategy needs an explicit product decision. |
| Future upload/write boundary | HIGH | Parent source already implements the R2/D1/human-gate pattern; graph mutation remains intentionally outside that path. |

## Sources

Local project sources:

- `.planning/PROJECT.md`
- `.planning/config.json`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/INTEGRATIONS.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/CONCERNS.md`
- `fuseki_swap_verify_usage.md`
- `operational-checklist.md`
- `HVDC-SYSTEM-GUIDE.md`
- `../server/src/worker.ts`
- `../server/src/hvdc-server.ts`
- `../server/src/router.ts`
- `../server/src/answer.ts`
- `../server/src/ui.ts`
- `../wrangler.toml`
- `../migrations/0001_mcp_audit_logs.sql`
- `../migrations/0002_mcp_upload_write.sql`
- `../.agents/skills/mcp-tool-contract/SKILL.md`

Official and external documentation:

- OpenAI Apps SDK reference: https://developers.openai.com/apps-sdk/reference
- OpenAI Apps SDK tool planning: https://developers.openai.com/apps-sdk/plan/tools
- OpenAI Apps SDK authentication: https://developers.openai.com/apps-sdk/build/auth
- OpenAI Apps SDK changelog, 2026-05-06 output schema note: https://developers.openai.com/apps-sdk/changelog
- Cloudflare Agents remote MCP server guide: https://developers.cloudflare.com/agents/guides/remote-mcp-server/
- Cloudflare `McpAgent` API reference: https://developers.cloudflare.com/agents/api-reference/mcp-agent-api/
- Cloudflare MCP client API reference: https://developers.cloudflare.com/agents/api-reference/mcp-client-api/
- Cloudflare MCP servers overview: https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/
- Apache Jena Fuseki documentation: https://jena.apache.org/documentation/fuseki2/
- MCP schema reference, ToolAnnotations: https://modelcontextprotocol.io/specification/2025-11-25/schema
