<!-- refreshed: 2026-05-13 -->
# Architecture

**Analysis Date:** 2026-05-13

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Client / Automation Layer                 │
├──────────────────┬──────────────────┬───────────────────────┤
│ Flask APIs       │ PowerShell ops   │ GPTs/OpenAPI bridge    │
│ `hvdc_api.py`    │ `scripts/`       │ `openapi.yaml`         │
│ `nlq_query_...`  │ root `*.ps1`     │ `gpts_oneclick.ps1`   │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                    │
         ▼                  ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application / Orchestration Layer            │
│ `hvdc_one_line.py`, `hvdc_rules.py`, `nlq_to_sparql.py`       │
│ `fuseki_swap_verify.py`, `hvdc_gateway_client.py`            │
└────────┬──────────────────┬─────────────────────┬───────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│ RDF/Turtle files, SPARQL query files, Apache Jena Fuseki      │
│ `triples.ttl`, `queries/`, `fuseki/apache-jena-fuseki-4.10.0` │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Generated Evidence / Reports                 │
│ `artifacts/`, `logs/`, generated `hvdc_extracted_*.ttl`       │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Main HVDC API | Exposes health, ingest, evidence, rules, audit, NLQ, and Fuseki deployment endpoints on port 5002. | `hvdc_api.py` |
| Excel extraction utility | Reads Excel files or directories, normalizes headers, extracts HVDC codes, and returns a normalized pandas DataFrame. | `hvdc_one_line.py` |
| Rule engine | Runs CostGuard, HS risk, and certificate checks over extracted tabular data. | `hvdc_rules.py` |
| Fuseki deployment manager | Handles staging graph upload, validation, backup, swap, rollback, and graph statistics. | `fuseki_swap_verify.py` |
| NLQ mapper | Maps known natural language intents to safe SELECT SPARQL templates and validates generated SPARQL. | `nlq_to_sparql.py` |
| NLQ API wrapper | Exposes `/nlq-query` on port 5010, performs ASK dry-run, then executes SPARQL against Fuseki. | `nlq_query_wrapper_flask.py` |
| Gateway client | Calls a remote or mock HVDC Gateway API for MRR drafts, ETA prediction, and CostGuard estimates. | `hvdc_gateway_client.py` |
| Gateway config | Loads gateway base URLs, API keys, timeout, retry, SSL, and local endpoint defaults. | `hvdc_gateway_config.py` |
| Mock Gateway | Provides local `/v1` test endpoints on port 8080 for the OpenAPI/GPTs Actions boundary. | `mock_gateway_server.py` |
| Claude Native bridge | Exposes MACHO command endpoints on port 5003 and calls local HVDC API, Fuseki, and mock Gateway. | `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py` |
| Operational scripts | Load data, run queries, manage named graphs, monitor performance, and run dashboards. | `scripts/` |
| CI smoke workflow | Starts Fuseki, imports core modules, runs integration tests, runs NLQ checks, and uploads failure artifacts. | `.github/workflows/audit-smoke.yml` |

## Pattern Overview

**Overall:** Flat script-oriented service suite around a local RDF triple store.

**Key Characteristics:**
- Flask endpoints are thin orchestration wrappers around root-level Python modules.
- Apache Jena Fuseki is the shared persistence and query boundary at `http://localhost:3030/hvdc`.
- PowerShell scripts are first-class operational entry points for Windows-local usage.
- Public ChatGPT/GPTs access is modeled through OpenAPI + ngrok, not through a first-class MCP server.
- Generated evidence and logs are file-based under `artifacts/` and `logs/`.

## Layers

**HTTP API Layer:**
- Purpose: Accept local API calls and return JSON responses for automation, tests, and bridge clients.
- Location: `hvdc_api.py`, `nlq_query_wrapper_flask.py`, `mock_gateway_server.py`, `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`
- Contains: Flask app instances, route handlers, endpoint-specific request parsing, JSON responses.
- Depends on: `hvdc_one_line.py`, `hvdc_rules.py`, `audit_logger.py`, `audit_ndjson_and_hash.py`, `fuseki_swap_verify.py`, `nlq_to_sparql.py`, `hvdc_gateway_client.py`
- Used by: `test_hvdc_api.py`, `test_logi_master_enhanced_audit.sh`, `demo_with_mock.py`, GPTs Actions through `openapi.yaml`.

**Extraction and Normalization Layer:**
- Purpose: Convert Excel source files into normalized HVDC code extraction rows.
- Location: `hvdc_one_line.py`, `hvdc-code-extractor.py`, `hvdc-code-mapping-v2.6.2.json`
- Contains: Regex patterns, header aliases, logical source normalization, confidence scoring, mapping rules.
- Depends on: `pandas`, `openpyxl`, local mapping JSON.
- Used by: `hvdc_api.py`, `hvdc-integration-demo.py`, tests, sample-data demos.

**Business Rule Layer:**
- Purpose: Evaluate CostGuard, HS risk, and certificate completeness alerts.
- Location: `hvdc_rules.py`
- Contains: Pure functions that accept pandas DataFrames and return alert dictionaries.
- Depends on: `pandas`.
- Used by: `hvdc_api.py`, `test_integration.py`, `test_hvdc_api.py`.

**NLQ and SPARQL Layer:**
- Purpose: Convert approved natural-language intents into bounded SPARQL SELECT queries.
- Location: `nlq_to_sparql.py`, `nlq_query_wrapper_flask.py`, `queries/`
- Contains: Intent detection, parameter sanitization, SPARQL templates, safety checks, ASK dry-runs.
- Depends on: Fuseki SPARQL endpoint at `http://localhost:3030/hvdc/sparql`.
- Used by: `README.md`, `.github/workflows/audit-smoke.yml`, `test_integration.py`.

**Fuseki Data Operations Layer:**
- Purpose: Load, stage, validate, query, swap, and roll back RDF graphs.
- Location: `fuseki_swap_verify.py`, `scripts/hvdc-data-loader.ps1`, `scripts/hvdc-named-graph-manager.ps1`, `scripts/migrate-to-named-graphs.ps1`, `scripts/rollback-named-graphs.ps1`
- Contains: GSP upload calls, SPARQL SELECT/UPDATE calls, named graph URI policy, archive and backup flows.
- Depends on: Apache Jena Fuseki under `fuseki/apache-jena-fuseki-4.10.0`, Java 11+, `requests`, PowerShell.
- Used by: `hvdc_api.py`, `full-validation.ps1`, `smoke-test.ps1`, CI.

**Gateway and Public Boundary Layer:**
- Purpose: Provide an Actions-friendly API surface and local-to-public tunnel workflow.
- Location: `hvdc_gateway_client.py`, `hvdc_gateway_config.py`, `mock_gateway_server.py`, `openapi.yaml`, `openapi.updated.yaml`, `gpts_oneclick.ps1`, `ngrok_setup.ps1`, `update_openapi_schema.py`
- Contains: OpenAPI schema, API key header convention, mock `/v1` endpoints, ngrok tunnel bootstrap, schema server URL patching.
- Depends on: `requests`, Flask, ngrok, optional remote gateway base URLs.
- Used by: `HVDC_GPTS_ACTIONS_GUIDE.md`, `HVDC_GPTS_ONECLICK_GUIDE.md`, `quick_demo.py`, `demo_with_mock.py`.

**Audit and Evidence Layer:**
- Purpose: Record operations, redact sensitive values, and store hash metadata.
- Location: `audit_logger.py`, `audit_ndjson_and_hash.py`, `artifacts/`
- Contains: CSV audit log, NDJSON audit log, SHA-256 metadata, integrity verification, summary stats.
- Depends on: Local filesystem under `artifacts/`.
- Used by: `hvdc_api.py`, `system_health_check.py`, tests.

## Data Flow

### Primary Ingest and Deployment Path

1. The main API receives `/ingest` with an uploaded file or JSON file path (`hvdc_api.py:74`).
2. `hvdc_one_line()` reads Excel sources, normalizes headers, extracts HVDC codes, and returns a DataFrame (`hvdc_one_line.py:90`).
3. `write_audit()` and `append_event()` write sanitized audit entries to `artifacts/audit_log.csv` and `artifacts/audit.ndjson` (`audit_logger.py:49`, `audit_ndjson_and_hash.py:17`).
4. If `HVDCIntegrationEngine` is available, `build_ttl_from_df()` generates TTL and `FusekiSwapManager.deploy_with_validation()` stages it (`hvdc_api.py:129`, `fuseki_swap_verify.py:313`).
5. `FusekiSwapManager` checks Fuseki health, uploads to `http://samsung.com/graph/STAGING`, validates required classes, creates backup, swaps to the target production graph, and clears staging (`fuseki_swap_verify.py:21`, `fuseki_swap_verify.py:313`).
6. The API returns a compact row count and trace log path (`hvdc_api.py:188`).

### NLQ Query Path

1. The NLQ wrapper receives `/nlq-query` on port 5010 (`nlq_query_wrapper_flask.py:52`).
2. `generate_sparql()` maps known intent text to a SELECT query (`nlq_to_sparql.py:67`).
3. `ensure_limit()` adds a bounded LIMIT when missing (`nlq_query_wrapper_flask.py:22`).
4. `ask_dry_run_from_select()` confirms data exists before running the SELECT (`nlq_query_wrapper_flask.py:27`).
5. `run_sparql()` posts the query to `SPARQL_ENDPOINT`, defaulting to `http://localhost:3030/hvdc/sparql` (`nlq_query_wrapper_flask.py:11`, `nlq_query_wrapper_flask.py:16`).
6. The wrapper returns `{status: "ok", data: ...}` or a structured error (`nlq_query_wrapper_flask.py:52`).

### Business Rule Path

1. `/run-rules` receives case IDs or a trace CSV path (`hvdc_api.py:218`).
2. The API reads extraction trace CSV files from `artifacts/` into a DataFrame (`hvdc_api.py:234`).
3. `run_all_rules()` calls CostGuard, HS risk, and certificate checks (`hvdc_rules.py:99`).
4. `write_audit()` records the rule run with risk level based on alert count (`hvdc_api.py:252`).
5. The API returns alerts and summary counts (`hvdc_api.py:257`).

### Gateway and GPTs Actions Path

1. `mock_gateway_server.py` serves local `/v1/health`, `/v1/mrr/draft`, `/v1/predict/eta`, and `/v1/costguard/estimate` endpoints on port 8080 (`mock_gateway_server.py:24`, `mock_gateway_server.py:32`, `mock_gateway_server.py:59`, `mock_gateway_server.py:100`).
2. `openapi.yaml` defines the public schema for those `/v1` endpoints and `X-API-Key` authentication.
3. `ngrok_setup.ps1` checks local health, launches ngrok, reads the public URL from `http://127.0.0.1:4040/api/tunnels`, and writes the URL to a temp file (`ngrok_setup.ps1`).
4. `update_openapi_schema.py` rewrites `servers.url` to `<public-url>/v1` and emits `openapi.updated.yaml` (`update_openapi_schema.py`).
5. `gpts_oneclick.ps1` optionally starts the mock server, opens the tunnel, patches the schema, and prints the GPT Builder connection details (`gpts_oneclick.ps1`).

### Claude Native Bridge Path

1. The bridge starts on port 5003 (`upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py:258`).
2. `/claude/execute` dispatches MACHO command names to local methods (`upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py:70`, `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py:153`).
3. `/claude/status` checks local HVDC API, Fuseki, and Gateway health (`upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py:107`, `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py:206`).
4. Gateway routes delegate MRR and ETA work to `HVDCGatewayIntegration` (`upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py:124`, `hvdc_gateway_client.py:215`).

**State Management:**
- Application services keep minimal in-memory state such as `hvdc_api.py` module globals `engine`, `STD_RATE_TABLE`, `HS_PREFIXES`, and `REQUIRED_CERTS`.
- Persistent operational state is in Fuseki graphs, `artifacts/`, `logs/`, generated TTL files, and optional dashboard outputs.
- The gateway client keeps a `requests.Session` with headers in `hvdc_gateway_client.py`.

## Key Abstractions

**HVDC Extraction Row:**
- Purpose: Standard row representation for source file, logical source, HVDC code, method, confidence, sheet, and row index.
- Examples: `hvdc_one_line.py`, `test_hvdc_api.py`
- Pattern: Pandas DataFrame contract with explicit output columns.

**FusekiSwapManager:**
- Purpose: Encapsulate staged RDF deployment and graph rollback.
- Examples: `fuseki_swap_verify.py`, `hvdc_api.py`
- Pattern: Service object with remote endpoint URLs and named graph constants.

**Named Graph URI Policy:**
- Purpose: Separate source and lifecycle graphs.
- Examples: `fuseki_swap_verify.py`, `scripts/hvdc-named-graph-manager.ps1`, `scripts/migrate-to-named-graphs.ps1`
- Pattern: Fixed `http://samsung.com/graph/*` URIs for `OFCO`, `DSV`, `PKGS`, `PAY`, `META`, `STAGING`, `BACKUP`, and archive graphs.

**Gateway Dataclasses and Enums:**
- Purpose: Normalize Gateway request and response types.
- Examples: `hvdc_gateway_client.py`
- Pattern: Python `Enum` and `dataclass` types wrapping JSON payloads.

**Audit Events:**
- Purpose: Record user/system action evidence and integrity hashes.
- Examples: `audit_logger.py`, `audit_ndjson_and_hash.py`
- Pattern: Append-only CSV/NDJSON files with redaction and hash metadata.

**SPARQL Query Templates:**
- Purpose: Keep operational analytics and NLQ outputs bounded and reusable.
- Examples: `queries/01-monthly-warehouse-stock.rq`, `queries/03-invoice-risk-analysis.rq`, `nlq_to_sparql.py`
- Pattern: Static query files and code-generated SELECT templates with `LIMIT`.

## Entry Points

**Main Local API:**
- Location: `hvdc_api.py`
- Triggers: `python hvdc_api.py`, tests, CI, bridge clients.
- Responsibilities: Ingest, evidence lookup, rule execution, audit summaries, Fuseki stats/deploy/validate.

**NLQ API:**
- Location: `nlq_query_wrapper_flask.py`
- Triggers: `python nlq_query_wrapper_flask.py`, CI NLQ checks, direct POST to `/nlq-query`.
- Responsibilities: Intent mapping, SPARQL safety limit, ASK dry-run, Fuseki query execution.

**Fuseki Server Start:**
- Location: `start-hvdc-fuseki.bat`, `start-hvdc-fuseki.sh`, `setup-fuseki.ps1`
- Triggers: Local setup, CI, quick-start flow.
- Responsibilities: Start Apache Jena Fuseki with the `hvdc` dataset on port 3030.

**Data Loader and Query Runner:**
- Location: `scripts/hvdc-data-loader.ps1`, `scripts/hvdc-query-runner.ps1`
- Triggers: Local PowerShell operations.
- Responsibilities: Upload TTL to default graph, validate triple counts, run all or selected `queries/*.rq`.

**Named Graph Operations:**
- Location: `scripts/hvdc-named-graph-manager.ps1`, `scripts/migrate-to-named-graphs.ps1`, `scripts/rollback-named-graphs.ps1`
- Triggers: Local data migration and recovery tasks.
- Responsibilities: Upload/delete/list/validate source graphs, migrate default graph to archives, restore data.

**Mock Gateway:**
- Location: `mock_gateway_server.py`
- Triggers: `python mock_gateway_server.py`, `gpts_oneclick.ps1 -StartMock`.
- Responsibilities: Serve local OpenAPI-compatible `/v1` endpoints for GPTs Actions testing.

**Public GPTs Actions Setup:**
- Location: `gpts_oneclick.ps1`, `ngrok_setup.ps1`, `update_openapi_schema.py`, `openapi.yaml`
- Triggers: Manual setup for ChatGPT GPT Builder Actions.
- Responsibilities: Expose local port 8080 over HTTPS, patch the OpenAPI server URL, and provide schema import values.

**Claude Native Bridge:**
- Location: `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`
- Triggers: `python upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py` or `start-claude-native-bridge.bat`.
- Responsibilities: Bridge MACHO commands to HVDC API, Fuseki, and Gateway checks.

**CI Smoke Test:**
- Location: `.github/workflows/audit-smoke.yml`
- Triggers: Schedule, manual dispatch, push to `main`.
- Responsibilities: Install dependencies, start Fuseki, import core modules, run integration/NLQ smoke checks, upload failure artifacts.

## Local / Remote Boundary

- Local-only services use `localhost` ports: Fuseki `3030`, HVDC API `5002`, NLQ wrapper `5010`, Mock Gateway `8080`, Claude bridge `5003`.
- Remote Gateway URLs are configured in `hvdc_gateway_client.py` and `hvdc_gateway_config.py` as `https://api.hvdc-gateway.example.com/v1` and `https://dev-api.hvdc-gateway.example.com/v1`.
- GPTs Actions exposure uses ngrok through `ngrok_setup.ps1` and `gpts_oneclick.ps1`; `openapi.updated.yaml` is generated from `openapi.yaml` for the current public URL.
- GitHub Actions runs a Linux CI boundary in `.github/workflows/audit-smoke.yml` and starts bundled Fuseki from `fuseki/apache-jena-fuseki-4.10.0`.
- Cloudflare Worker or Cloudflare Tunnel files are not detected in this workspace.
- First-class Apps SDK MCP server files are not detected in this workspace. The parent project skill `../.agents/skills/mcp-tool-contract/SKILL.md` defines expected MCP tool contract rules, but current runtime code exposes Flask/OpenAPI/GPTs Actions instead.

## MCP / Cloudflare Merge Implications

- Treat the current public integration as OpenAPI/GPTs Actions, centered on `openapi.yaml`, `mock_gateway_server.py`, `ngrok_setup.ps1`, and `gpts_oneclick.ps1`.
- Do not treat `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py` as an MCP server; it is a Flask bridge with `/claude/*` and `/gateway/*` routes.
- Do not place Cloudflare runtime code inside `fuseki/apache-jena-fuseki-4.10.0` or generated artifact folders.
- If an MCP/Cloudflare merge is introduced, keep the boundary explicit: Flask local services and Fuseki remain local backends; the edge/MCP layer calls them through typed tool contracts and never rewrites graph data without a human/action gate.
- The skill-defined MCP convention uses explicit schemas, `readOnlyHint: true` for read tools, and `_meta.ui.resourceUri` only for rendered widgets; these conventions are from `../.agents/skills/mcp-tool-contract/SKILL.md` and are not implemented in the current source tree.

## Architectural Constraints

- **Threading:** Flask apps run with development-server defaults in `hvdc_api.py`, `nlq_query_wrapper_flask.py`, `mock_gateway_server.py`, and `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`; no worker queue is present.
- **Global state:** `hvdc_api.py` initializes `app`, `engine`, `STD_RATE_TABLE`, `HS_PREFIXES`, and `REQUIRED_CERTS` at module import; `mock_gateway_server.py` keeps sample lists at module scope; `hvdc_gateway_client.py` has module-level default URLs and API-key placeholders.
- **Circular imports:** No circular import chain is detected in the inspected entry points. `hvdc_api.py` uses dynamic import fallback for `hvdc-integration-demo.py` because the filename contains a hyphen.
- **Persistence:** Fuseki is the RDF store; audit and health evidence are filesystem artifacts under `artifacts/` and `logs/`.
- **Source of truth:** RDF source fixtures and operational query files live in `*.ttl` and `queries/*.rq`; generated logs and `openapi.updated.yaml` are not canonical source.
- **Platform:** Windows PowerShell scripts are primary operational tooling; CI also supports Linux shell execution through `.github/workflows/audit-smoke.yml`.

## Anti-Patterns

### Importing Hyphenated Modules Directly

**What happens:** `hvdc_api.py` dynamically loads `hvdc-integration-demo.py` through `importlib.util.spec_from_file_location`.
**Why it's wrong:** Hyphenated Python filenames cannot be imported normally and force special-case import logic in entry-point code.
**Do this instead:** Put reusable Python implementation in importable snake_case modules such as `hvdc_integration_demo.py`; keep demo wrappers separate from service imports.

### Treating Generated Runtime Files as Source

**What happens:** Runtime files such as `artifacts/audit.ndjson`, `artifacts/health_report.json`, `logs/hvdc-performance.log`, `openapi.updated.yaml`, and `hvdc_extracted_20250817_204248.ttl` sit beside source files.
**Why it's wrong:** Generated files change based on local runtime state and can make source changes hard to distinguish from evidence output.
**Do this instead:** Treat canonical source as `*.py`, `scripts/*.ps1`, `queries/*.rq`, `triples.ttl`, `openapi.yaml`, and docs; treat `artifacts/`, `logs/`, `backup/`, and generated `hvdc_extracted_*.ttl` as outputs.

### Splitting One Boundary Across Several Ports Without Shared Config

**What happens:** Local services default to ports 3030, 5002, 5010, 8080, and 5003 in separate files.
**Why it's wrong:** Endpoint drift can break bridge and test flows when one file changes a port or path.
**Do this instead:** Keep endpoint changes synchronized in `hvdc_gateway_config.py`, `hvdc_gateway_client.py`, `nlq_query_wrapper_flask.py`, `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`, and `openapi.yaml`.

## Error Handling

**Strategy:** Use defensive `try`/`except` blocks around network, filesystem, and parsing boundaries; return JSON errors from Flask routes; exit non-zero in operational scripts when pre-flight checks fail.

**Patterns:**
- Flask routes return `400`, `422`, `500`, or `503` JSON errors for missing inputs, dry-run failures, execution errors, and unavailable Fuseki services.
- Fuseki operations log failures and return structured step dictionaries in `fuseki_swap_verify.py`.
- PowerShell scripts stop after failed health checks, missing TTL files, or inaccessible SPARQL update endpoints.
- Audit logging treats write failure as critical in `audit_logger.py`.

## Cross-Cutting Concerns

**Logging:** Python modules use `logging` and print statements; PowerShell scripts write console output and optional log files such as `logs/hvdc-performance.log`.

**Validation:** Validation happens at several boundaries: SPARQL safety in `nlq_to_sparql.py`, ASK dry-run in `nlq_query_wrapper_flask.py`, staging data checks in `fuseki_swap_verify.py`, named graph checks in `scripts/hvdc-named-graph-manager.ps1`, and CI smoke checks in `.github/workflows/audit-smoke.yml`.

**Authentication:** Local Flask services do not enforce production authentication. Gateway/OpenAPI auth uses `X-API-Key` in `openapi.yaml` and `hvdc_gateway_client.py`. Fuseki auth configuration files exist in `config/shiro-dev.ini` and `config/shiro-prod.ini`, but their contents are not treated as source code in this map.

**Privacy and Redaction:** `audit_logger.py` and `audit_ndjson_and_hash.py` mask emails, password-like values, API-key-like values, and card-like patterns before writing audit output.

**Project Skill Constraints:** Parent skills define architecture expectations that matter when extending this workspace: `../.agents/skills/answer-grounding/SKILL.md` requires the canonical semantic spine before grounded answers, `../.agents/skills/validation-gate/SKILL.md` defines validation gates, and `../.agents/skills/mcp-tool-contract/SKILL.md` defines the future MCP contract style. These files are outside the workspace source tree.

---

*Architecture analysis: 2026-05-13*
