# Coding Conventions

**Analysis Date:** 2026-05-13

## Naming Patterns

**Files:**
- Use importable Python module names with lowercase snake_case: `hvdc_api.py`, `hvdc_rules.py`, `audit_logger.py`, `audit_ndjson_and_hash.py`, `nlq_to_sparql.py`, `system_health_check.py`.
- Treat hyphenated Python files as executable or legacy scripts, not normal imports: `hvdc-code-extractor.py`, `hvdc-integration-demo.py`. When existing code must load them, use the importlib fallback pattern in `hvdc_api.py`.
- Use test file names beginning with `test_` for Python: `test_hvdc_api.py`, `test_gateway_integration.py`, `test_integration.py`, `test_sparql_direct.py`.
- Use lower-kebab PowerShell script names for operational commands: `full-validation.ps1`, `smoke-test.ps1`, `scripts/hvdc-data-loader.ps1`, `scripts/hvdc-query-runner.ps1`, `scripts/hvdc-named-graph-manager.ps1`.
- Keep SPARQL query templates numbered and purpose-named under `queries/`: `queries/01-monthly-warehouse-stock.rq`, `queries/02-case-timeline-events.rq`, `queries/03-invoice-risk-analysis.rq`, `queries/04-oog-hs-risk-assessment.rq`.
- Keep generated runtime outputs under `artifacts/` and `logs/`: `artifacts/audit_log.csv`, `artifacts/audit.ndjson`, `artifacts/health_report.json`, `logs/hvdc-performance.log`.

**Functions:**
- Use Python snake_case for functions and methods: `run_costguard`, `run_hs_risk`, `run_all_rules` in `hvdc_rules.py`; `sanitize_sensitive_data`, `verify_audit_integrity` in `audit_logger.py`; `safe_execute_workflow`, `validate_sparql` in `nlq_to_sparql.py`.
- Use Flask route functions with short endpoint names when the route itself supplies context: `health`, `ingest`, `evidence`, `run_rules`, `nlq` in `hvdc_api.py`.
- Use PowerShell Verb-Noun or task-specific PascalCase function names: `Add-ValidationResult` in `full-validation.ps1`, `Test-Component` in `smoke-test.ps1`, `Test-FusekiHealth` and `Write-Log` in `scripts/hvdc-performance-monitor.ps1`.
- Use test names that state behavior: `test_health_endpoint_should_return_ok_when_system_healthy` in `test_hvdc_api.py`, `test_create_mrr_draft_success` in `test_gateway_integration.py`.

**Variables:**
- Use Python snake_case for local variables and payload keys: `trace_log`, `risk_level`, `case_ids`, `ttl_content` in `hvdc_api.py`.
- Use uppercase Python constants for module-level configuration and enums: `STD_RATE_TABLE`, `HS_PREFIXES`, `REQUIRED_CERTS` in `hvdc_api.py`; `AUDIT_CSV` in `audit_logger.py`; `AUDIT_PATH` and `HASH_META` in `audit_ndjson_and_hash.py`.
- Use uppercase environment variable names and load them through `os.getenv`: `HVDC_GATEWAY_API_KEY`, `HVDC_PROD_API_KEY`, `HVDC_LOG_LEVEL`, `HVDC_SESSION_ID` in `hvdc_gateway_config.py` and `audit_logger.py`.
- Use PowerShell PascalCase variables for command inputs and endpoint state: `$FusekiUrl`, `$ReloadData`, `$DetailedReport` in `full-validation.ps1`; `$BaseUrl`, `$Dataset`, `$TtlFile` in `scripts/hvdc-data-loader.ps1`.
- Use PowerShell hashtables for source maps, thresholds, and grouped validation data: `$SourceGraphs` in `scripts/hvdc-named-graph-manager.ps1`, `$KPI_THRESHOLDS` and `$PERFORMANCE_QUERIES` in `scripts/hvdc-performance-monitor.ps1`.

**Types:**
- Use PascalCase for Python classes, dataclasses, and enums: `GatewayConfig` in `hvdc_gateway_config.py`; `HVDCGatewayClient`, `MRRItem`, `EtaResult`, `CostEstimate`, `RiskLevel` in `hvdc_gateway_client.py`.
- Use enum values as uppercase strings for API payload stability: `Site.MIR`, `Status.OSD`, `TransportMode.ROAD`, `CostBand.CRITICAL` in `hvdc_gateway_client.py`.
- Return plain dictionaries and lists for API-ready business results: `run_all_rules` in `hvdc_rules.py`, `validate_sparql` in `nlq_to_sparql.py`, `verify_hash` in `audit_ndjson_and_hash.py`.

## Code Style

**Formatting:**
- No formatter configuration is detected. `requirements.txt` lists `black`, `flake8`, and `mypy` only as optional commented development tools.
- Use 4-space Python indentation, module docstrings, and type hints where the surrounding module already uses them, as in `hvdc_rules.py`, `hvdc_gateway_client.py`, `audit_logger.py`, and `audit_ndjson_and_hash.py`.
- Preserve the repository's mixed English/Korean comments and user-facing output when editing existing files. Examples appear in `hvdc_api.py`, `system_health_check.py`, and `scripts/hvdc-data-loader.ps1`.
- Keep CLI/demo output human-readable. Python CLI scripts use `print(...)` in `system_health_check.py`, `test_integration.py`, and `check_fuseki_data.py`; service/client modules use `logging` in `hvdc_api.py`, `hvdc_gateway_client.py`, and `fuseki_swap_verify.py`.
- Use UTF-8 for data and artifact writes. Existing code passes `encoding="utf-8"` in `audit_logger.py`, `audit_ndjson_and_hash.py`, `test_integration.py`, and PowerShell `Out-File -Encoding UTF8` in `scripts/hvdc-query-runner.ps1`.

**Linting:**
- Not detected. There is no `.flake8`, `ruff.toml`, `.pylintrc`, `pyproject.toml`, or active lint command in the workspace.
- Before adding a linter, keep the existing runtime scripts working first because many files are operational entry points: `full-validation.ps1`, `smoke-test.ps1`, `hvdc_api.py`, `fuseki_swap_verify.py`.
- Use syntax checks for PowerShell script changes. `full-validation.ps1` tokenizes `scripts/hvdc-data-loader.ps1` and `scripts/hvdc-query-runner.ps1` with `[System.Management.Automation.PSParser]::Tokenize`.

## Import Organization

**Order:**
1. Standard library imports first: `json`, `os`, `pathlib.Path`, `datetime`, `argparse`, `hashlib` in `audit_logger.py` and `audit_ndjson_and_hash.py`.
2. Third-party imports second: `flask`, `requests`, `pandas`, `openpyxl` consumers in `hvdc_api.py`, `fuseki_swap_verify.py`, and `hvdc_one_line.py`.
3. Local imports third: `hvdc_one_line`, `hvdc_rules`, `audit_logger`, `audit_ndjson_and_hash`, `fuseki_swap_verify` in `hvdc_api.py`.

**Path Aliases:**
- Not detected. Imports are direct module imports from the workspace root, such as `from hvdc_rules import run_all_rules` in `hvdc_api.py` and `test_hvdc_api.py`.
- Do not introduce package-relative imports unless the repository is converted into a package. The current scripts assume execution from the repository root.
- For legacy hyphenated modules, keep the dynamic import fallback local and explicit, as in `hvdc_api.py` loading `hvdc-integration-demo.py`.

## Error Handling

**Patterns:**
- Return JSON plus HTTP status from Flask endpoints. Use `jsonify({"error": ...}), 400` for invalid input and `jsonify({"error": str(e)}), 500` for unexpected service failures in `hvdc_api.py`.
- Catch `requests.exceptions.RequestException` for external HTTP API calls that should propagate failure to the caller, as in `HVDCGatewayClient.health_check`, `create_mrr_draft`, `predict_eta`, and `estimate_cost` in `hvdc_gateway_client.py`.
- Use bounded request timeouts for live service checks and integrations: `timeout=5` in `system_health_check.py`, `timeout=10` in `check_fuseki_data.py`, `timeout=30` in `fuseki_swap_verify.py`.
- Use graceful degradation for optional integrations. `hvdc_api.py` falls back to standalone mode when `HVDCIntegrationEngine` is unavailable; `hvdc_gateway_client.py` returns gateway-only ETA when the Claude bridge call fails.
- Treat audit write failures as critical. `write_audit` in `audit_logger.py` logs at critical level and re-raises when audit persistence fails.
- Avoid new bare `except:` blocks. Existing broad handlers in `demo_with_mock.py`, `audit_logger.py`, and `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py` should stay contained unless they are being tightened with tests.
- PowerShell fatal checks should use `Write-Error` followed by `exit 1`, as in `scripts/hvdc-data-loader.ps1`, `scripts/hvdc-named-graph-manager.ps1`, and `full-validation.ps1`.
- PowerShell destructive operations should require confirmation or `-Force`. `scripts/hvdc-data-loader.ps1` prompts before overwriting existing default graph data, and `scripts/hvdc-named-graph-manager.ps1` prompts before deleting a named graph unless `-Force` is present.

## Logging

**Framework:** Python `logging`, PowerShell console logging, and file artifacts.

**Patterns:**
- Use module-level `logging.basicConfig` for Python service or client modules: `hvdc_api.py`, `hvdc_gateway_client.py`, `hvdc_rules.py`, `fuseki_swap_verify.py`, `mock_gateway_server.py`.
- Use `logger = logging.getLogger(__name__)` when a module has multiple client operations, as in `hvdc_gateway_client.py` and `mock_gateway_server.py`.
- Use structured audit logs for security-sensitive activity rather than console-only output. `audit_logger.py` writes CSV audit entries to `artifacts/audit_log.csv`; `audit_ndjson_and_hash.py` writes hashable NDJSON to `artifacts/audit.ndjson`.
- Use `Write-Host` with colors for operator-facing PowerShell scripts, as in `smoke-test.ps1`, `full-validation.ps1`, `scripts/hvdc-query-runner.ps1`, and `check-dashboard-status.ps1`.
- Use `Write-Log` when a PowerShell script persists operational metrics. `scripts/hvdc-performance-monitor.ps1` writes both `logs/hvdc-performance.log` and `logs/hvdc-performance.csv`.
- Do not log raw credentials, tokens, private links, raw commercial rates, or unmasked personal data. Redaction rules live in `audit_logger.py` and `audit_ndjson_and_hash.py`.

## Security Masking

**Patterns:**
- Sanitize audit CSV data with `sanitize_sensitive_data` before writing actor and detail fields in `audit_logger.py`.
- Sanitize NDJSON audit events with `sanitize_event` before append in `audit_ndjson_and_hash.py`.
- Mask emails, passwords, API keys, and card-like numbers before persistence. `SENSITIVE_PATTERNS` in `audit_logger.py` and `sensitive_patterns` in `audit_ndjson_and_hash.py` define the current mask coverage.
- Compute integrity hashes after sanitization. `calculate_integrity_hash` in `audit_logger.py`, `sha256_of_file`, `write_hash_meta`, and `verify_hash` in `audit_ndjson_and_hash.py` provide the current integrity pattern.
- Load real API keys from environment variables, not committed files. `GatewayConfig.from_env` in `hvdc_gateway_config.py` reads `HVDC_GATEWAY_API_KEY`; `PROD_CONFIG` reads `HVDC_PROD_API_KEY`.
- Treat placeholder API keys in `hvdc_gateway_client.py` and `hvdc_gateway_config.py` as demo defaults only. Replace with environment loading when production code is touched.
- Do not read or print `.env` files. `hvdc_gateway.env.example` exists as a configuration example; inspect variable names through code such as `hvdc_gateway_config.py` when possible.
- Follow project skill constraints from `../.agents/skills/privacy-redactor/SKILL.md`: check UI content, structured output, logs, README examples, and tests for email, phone, token, private link, and raw rate leakage.

## Comments

**When to Comment:**
- Use comments to document domain assumptions, validation intent, and operational warnings. Examples include CostGuard assumptions in `hvdc_rules.py`, SPARQL safety notes in `nlq_to_sparql.py`, and endpoint path notes in `scripts/hvdc-data-loader.ps1`.
- Keep comments near the behavior they explain. `full-validation.ps1` labels each validation step directly above the relevant checks.
- Mark production caveats directly in the module that contains the shortcut. `nlq_to_sparql.py` notes that production LLM-generated SPARQL requires validation and ASK/DRY-RUN before execution.

**JSDoc/TSDoc:**
- Not applicable. No TypeScript source is detected in this workspace.
- Use Python docstrings for modules, functions, dataclasses, and tests. Existing examples are in `hvdc_gateway_client.py`, `audit_logger.py`, `audit_ndjson_and_hash.py`, `test_hvdc_api.py`, and `test_gateway_integration.py`.

## Function Design

**Size:** Keep pure business logic small and return serializable data. `run_costguard`, `run_hs_risk`, and `run_cert_check` in `hvdc_rules.py` are the preferred pattern for rule functions.

**Parameters:** Pass explicit data and configuration into logic functions. `run_all_rules(df_items, std_rate_table, hs_prefixes, required_certs)` in `hvdc_rules.py` is the clearest pattern.

**Return Values:** Return dictionaries/lists with stable keys for API responses and tests. Examples: `{"cost_alerts", "hs_alerts", "cert_alerts", "summary"}` from `hvdc_rules.py`; `{"status", "verified_entries", "corrupted_entries"}` from `audit_logger.py`; `{"sparql", "intent", "description"}` from `nlq_to_sparql.py`.

**HTTP Calls:** Use `requests` with timeouts and parse JSON only after status validation. `hvdc_gateway_client.py` calls `response.raise_for_status()` before `response.json()`.

**CLI Entry Points:** Put executable behavior under `if __name__ == "__main__":` so modules remain importable by tests. Examples: `hvdc_api.py`, `audit_ndjson_and_hash.py`, `test_hvdc_api.py`, `test_gateway_integration.py`, `system_health_check.py`.

**PowerShell Scripts:** Put parameters at the top in a `param(...)` block, define endpoint constants once, then perform pre-flight checks before mutation. Use `scripts/hvdc-data-loader.ps1`, `full-validation.ps1`, and `scripts/hvdc-named-graph-manager.ps1` as the pattern.

## Module Design

**Exports:** There are no package `__init__.py` exports. Import functions/classes directly from root modules: `from hvdc_rules import run_all_rules`, `from audit_logger import write_audit`, `from hvdc_gateway_config import get_config`.

**Barrel Files:** Not used.

**Module Roles:**
- API service code lives in `hvdc_api.py` and `nlq_query_wrapper_flask.py`.
- Business rules live in `hvdc_rules.py`.
- Audit persistence and integrity live in `audit_logger.py` and `audit_ndjson_and_hash.py`.
- Gateway client DTOs and integration helpers live in `hvdc_gateway_client.py` and `hvdc_gateway_config.py`.
- Fuseki staging, upload, swap, rollback, and stats logic lives in `fuseki_swap_verify.py` and `scripts/hvdc-named-graph-manager.ps1`.
- Operator validation scripts live in `smoke-test.ps1`, `full-validation.ps1`, `system_health_check.py`, and `scripts/hvdc-performance-monitor.ps1`.
- Sample data stays in `sample_data/`; query templates stay in `queries/`; generated artifacts stay in `artifacts/`.

## PowerShell Patterns

**Script Shape:**
- Start with a short purpose comment and `param(...)` block. Examples: `smoke-test.ps1`, `full-validation.ps1`, `scripts/hvdc-query-runner.ps1`.
- Define endpoint URLs from base parameters once: `$PingUrl`, `$SparqlUrl`, `$DataUrl`, `$GspDefault` in `scripts/hvdc-data-loader.ps1` and `scripts/hvdc-named-graph-manager.ps1`.
- Use `try { ... } catch { ... }` around service calls and convert failures into explicit `FAIL`, `WARN`, or `exit 1` states.
- Use `Invoke-WebRequest` for simple reachability and `Invoke-RestMethod` for JSON/SPARQL responses. Existing examples are in `smoke-test.ps1`, `full-validation.ps1`, and `scripts/hvdc-query-runner.ps1`.
- Use `curl` as a SPARQL JSON parsing fallback only when an existing script already follows that pattern: `scripts/hvdc-data-loader.ps1`, `scripts/hvdc-named-graph-manager.ps1`, `scripts/hvdc-performance-monitor.ps1`.
- Use `-Force` or an explicit prompt before destructive Fuseki graph operations: `scripts/hvdc-data-loader.ps1`, `scripts/hvdc-named-graph-manager.ps1`.

## Project Skill Constraints

**Answer grounding:**
- `../.agents/skills/answer-grounding/SKILL.md` requires `CONSOLIDATED-00` coverage, EvidenceSnippet support, operational-truth/evidence separation, Flow Code boundary checks, currentness checks, and Human-gate review for grounded answer flows.

**Validation gates:**
- `../.agents/skills/validation-gate/SKILL.md` defines required validation outputs for routes, answers, Flow Code, currentness, PII, and actions. New validation code should return `ValidationFinding[]`-style structured results and cover PASS/WARN/BLOCK/NO_EVIDENCE.

**MCP tool contracts:**
- `../.agents/skills/mcp-tool-contract/SKILL.md` requires one job per tool, explicit input/output schemas, `readOnlyHint: true` for search/routing/validation/resolve tools, Human-gate plus AuditRecord for write/action/export tools, and no secrets in `structuredContent`.

**Corpus indexing:**
- `../.agents/skills/ontology-corpus-indexer/SKILL.md` constrains corpus indexing to `data/corpus/*.md`, requires `CONSOLIDATED-00-master-ontology.md`, and expects deterministic section/hash evidence outputs.

**Submission and UI:**
- `../.agents/skills/submission-readiness/SKILL.md` requires `npm run verify` for the ChatGPT app path, HTTPS `/mcp`, `text/html;profile=mcp-app` widget resources, no P2 sample data, privacy policy readiness, and PII-free screenshots.
- `../.agents/skills/uiux-component/SKILL.md` requires widgets to render `structuredContent`, show verdict first, preserve evidence hash visibility, keep Evidence Drawer expandable, show Human-gate next actions, and avoid external fetches unless CSP is updated.

---

*Convention analysis: 2026-05-13*
