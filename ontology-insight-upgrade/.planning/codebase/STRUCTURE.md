# Codebase Structure

**Analysis Date:** 2026-05-13

## Directory Layout

```text
Ontology insight upgrade/
├── .github/                  # GitHub Actions workflow definitions
├── .planning/                # GSD planning and codebase map outputs
├── artifacts/                # Generated audit, hash, health, and test result artifacts
├── backup/                   # Backup snapshots; not source
├── config/                   # Fuseki/Shiro configuration files
├── fuseki/                   # Bundled Apache Jena Fuseki distribution boundary
├── logs/                     # Generated runtime and upgrade logs
├── queries/                  # Source SPARQL query files
├── sample_data/              # Excel sample fixtures for extraction demos and tests
├── scripts/                  # Operational PowerShell and shell scripts
├── upgrade/                  # v3.7 Claude bridge upgrade code and tests
├── *.py                      # Root-level Python services, utilities, and tests
├── *.ps1                     # Root-level setup, validation, dashboard, and tunnel scripts
├── *.ttl                     # RDF/Turtle ontology, sample, and generated graph data
├── *.yaml                    # OpenAPI schema source and generated public schema
└── *.md                      # User-facing setup, operations, integration, and deployment docs
```

## Directory Purposes

**`.github/`:**
- Purpose: CI/CD workflow definitions.
- Contains: GitHub Actions YAML.
- Key files: `.github/workflows/audit-smoke.yml`

**`.planning/`:**
- Purpose: Planning metadata and codebase maps for GSD workflows.
- Contains: Generated mapper documents.
- Key files: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`

**`artifacts/`:**
- Purpose: Runtime evidence and generated test output.
- Contains: Audit CSV, audit NDJSON, hash metadata, health reports, integration result JSON.
- Key files: `artifacts/audit_log.csv`, `artifacts/audit.ndjson`, `artifacts/audit.ndjson.hash.json`, `artifacts/health_report.json`, `artifacts/integration_test_results.json`

**`backup/`:**
- Purpose: Local backup snapshots.
- Contains: Pre-upgrade backup directories.
- Key files: `backup/pre_v37_upgrade`

**`config/`:**
- Purpose: Fuseki/Shiro environment configuration.
- Contains: Development and production Shiro INI files.
- Key files: `config/shiro-dev.ini`, `config/shiro-prod.ini`

**`fuseki/`:**
- Purpose: Bundled Apache Jena Fuseki runtime package.
- Contains: Extracted Fuseki distribution and original zip.
- Key files: `fuseki/apache-jena-fuseki-4.10.0`, `fuseki/apache-jena-fuseki-4.10.0.zip`

**`logs/`:**
- Purpose: Generated performance and upgrade logs.
- Contains: CSV/log files from local scripts.
- Key files: `logs/hvdc-performance.csv`, `logs/hvdc-performance.log`, `logs/upgrade_v37_20250818_002849.log`

**`queries/`:**
- Purpose: Canonical operational SPARQL query files.
- Contains: Query files for warehouse stock, case timeline, invoice risk, OOG/HS risk, and operational reports.
- Key files: `queries/01-monthly-warehouse-stock.rq`, `queries/02-case-timeline-events.rq`, `queries/03-invoice-risk-analysis.rq`, `queries/04-oog-hs-risk-assessment.rq`, `queries/operational-queries.rq`

**`sample_data/`:**
- Purpose: Excel fixture inputs for demos and extraction tests.
- Contains: OFCO, DSV, and PKGS sample workbooks.
- Key files: `sample_data/OFCO_Sample.xlsx`, `sample_data/DSV_Sample.xlsx`, `sample_data/PKGS_Sample.xlsx`

**`scripts/`:**
- Purpose: Operational automation around Fuseki, named graphs, query execution, monitoring, and batch processing.
- Contains: PowerShell, shell, and batch scripts.
- Key files: `scripts/hvdc-data-loader.ps1`, `scripts/hvdc-query-runner.ps1`, `scripts/hvdc-named-graph-manager.ps1`, `scripts/migrate-to-named-graphs.ps1`, `scripts/rollback-named-graphs.ps1`, `scripts/hvdc-operational-dashboard.ps1`, `scripts/hvdc-performance-monitor.ps1`

**`upgrade/`:**
- Purpose: v3.7 Claude Native bridge implementation and integration test.
- Contains: Python bridge server and bridge test.
- Key files: `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`, `upgrade/v3.7-CLAUDE-NATIVE/test_claude_integration.py`

## Key File Locations

**Entry Points:**
- `hvdc_api.py`: Main Flask API on port 5002.
- `nlq_query_wrapper_flask.py`: NLQ-to-SPARQL Flask wrapper on port 5010.
- `mock_gateway_server.py`: Local mock Gateway API on port 8080.
- `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`: Claude/MACHO bridge on port 5003.
- `start-hvdc-fuseki.bat`: Windows Fuseki startup.
- `start-hvdc-fuseki.sh`: Unix-style Fuseki startup.
- `setup-fuseki.ps1`: Local Fuseki setup.
- `gpts_oneclick.ps1`: One-command GPTs Actions/ngrok setup.

**Configuration:**
- `requirements.txt`: Python dependency list.
- `hvdc_gateway_config.py`: Gateway runtime defaults and env loading.
- `hvdc_gateway.env.example`: Environment variable example; do not store real secrets here.
- `openapi.yaml`: Canonical OpenAPI source for Gateway/GPTs Actions.
- `openapi.updated.yaml`: Generated OpenAPI schema with a public ngrok server URL.
- `config/shiro-dev.ini`: Fuseki/Shiro development config.
- `config/shiro-prod.ini`: Fuseki/Shiro production config.

**Core Logic:**
- `hvdc_one_line.py`: Excel-to-HVDC-code extraction utility.
- `hvdc-code-extractor.py`: Mapping-based HVDC code extraction/enrichment engine.
- `hvdc-code-mapping-v2.6.2.json`: Header normalization and business-rule mapping config.
- `hvdc_rules.py`: CostGuard, HS risk, and certificate rule functions.
- `fuseki_swap_verify.py`: Staging, validation, backup, swap, rollback, and stats.
- `nlq_to_sparql.py`: Intent detection, SPARQL generation, and SPARQL safety validation.
- `audit_logger.py`: CSV audit log with redaction and row integrity hash.
- `audit_ndjson_and_hash.py`: NDJSON audit append, hash metadata, verification, stats, rotation.
- `hvdc_gateway_client.py`: Gateway API client and local integration helper.
- `hvdc_gateway_config.py`: Gateway config dataclass and environment lookup.
- `hvdc-integration-demo.py`: Demo integration engine for extraction, TTL generation, Fuseki upload, and validation.

**Data and Queries:**
- `triples.ttl`: Base RDF/Turtle dataset for local loading.
- `sample_invoice_data.ttl`: Invoice sample RDF/Turtle data.
- `prov_mapping.ttl`: Provenance mapping RDF/Turtle data.
- `test_deployment.ttl`: Test deployment RDF/Turtle fixture.
- `hvdc_extracted_fixed.ttl`: Generated or fixed extraction output; treat as data artifact unless promoted deliberately.
- `queries/*.rq`: SPARQL source queries.

**Testing:**
- `test_hvdc_api.py`: Pytest coverage for API endpoints, rules, and audit logging.
- `test_gateway_integration.py`: Unit tests for Gateway client/integration classes.
- `test_integration.py`: Script-style integration tests for rules, Fuseki, and NLQ.
- `test_sparql_direct.py`: Direct Fuseki SPARQL query smoke tests.
- `test_logi_master_enhanced_audit.sh`: Shell smoke script for LogiMaster/audit flow.
- `upgrade/v3.7-CLAUDE-NATIVE/test_claude_integration.py`: Claude bridge integration probes.

**Operations and Documentation:**
- `README.md`: Main system overview and quick usage.
- `QUICK-START.md`: Fast local setup and validation path.
- `HVDC-SYSTEM-GUIDE.md`: Full system guide and architecture overview.
- `operational-checklist.md`: Operational routines.
- `troubleshooting-guide.md`: Local troubleshooting.
- `production_deployment_guide.md`: Production deployment guidance.
- `HVDC_GPTS_ACTIONS_GUIDE.md`: GPTs Actions setup guide.
- `HVDC_GPTS_ONECLICK_GUIDE.md`: One-click GPTs/ngrok guide.
- `PRIVACY.md`: Privacy notes for local and tunnel usage.

## Naming Conventions

**Files:**
- Python modules mostly use snake_case: `hvdc_api.py`, `audit_logger.py`, `nlq_to_sparql.py`.
- Some legacy/demo Python files use hyphenated names: `hvdc-integration-demo.py`, `hvdc-code-extractor.py`; do not import these directly from new modules.
- PowerShell scripts use descriptive kebab-case: `start-dashboard-clean.ps1`, `ngrok_setup.ps1`, `full-validation.ps1`.
- Operational scripts under `scripts/` use `hvdc-*` prefixes: `scripts/hvdc-data-loader.ps1`, `scripts/hvdc-query-runner.ps1`.
- SPARQL queries use numeric prefixes for ordered operational reports: `queries/01-monthly-warehouse-stock.rq`.
- Generated timestamped files use embedded date/time: `hvdc_extracted_20250817_204248.ttl`, `logs/upgrade_v37_20250818_002849.log`.

**Directories:**
- Operational script grouping goes under `scripts/`.
- Generated evidence goes under `artifacts/`.
- Runtime logs go under `logs/`.
- Sample fixture workbooks go under `sample_data/`.
- Versioned bridge code goes under `upgrade/v3.7-CLAUDE-NATIVE/`.
- Bundled third-party runtime code stays under `fuseki/apache-jena-fuseki-4.10.0/`.

## Where to Add New Code

**New Flask API endpoint:**
- Primary code: `hvdc_api.py` for local HVDC API behavior.
- Tests: `test_hvdc_api.py`.
- Shared helper logic: create or extend a snake_case root module such as `hvdc_rules.py`, `nlq_to_sparql.py`, or a new importable `hvdc_*.py` file.

**New NLQ intent or SPARQL template:**
- Primary code: `nlq_to_sparql.py`.
- API wrapper behavior: `nlq_query_wrapper_flask.py`.
- Static operational query: `queries/<nn>-<purpose>.rq`.
- Tests: `test_integration.py` or a new `test_nlq_*.py`.

**New Fuseki graph operation:**
- Python orchestration: `fuseki_swap_verify.py`.
- Local operator script: `scripts/hvdc-named-graph-manager.ps1` or a new `scripts/hvdc-*.ps1`.
- Validation query: `queries/`.
- Tests or smoke checks: `test_integration.py`, `full-validation.ps1`, or `.github/workflows/audit-smoke.yml`.

**New Gateway/OpenAPI operation:**
- Client types and methods: `hvdc_gateway_client.py`.
- Config defaults: `hvdc_gateway_config.py`.
- Mock endpoint: `mock_gateway_server.py`.
- Schema: `openapi.yaml`.
- Generated schema: regenerate `openapi.updated.yaml` with `update_openapi_schema.py`; do not hand-edit it as canonical source.
- Tests: `test_gateway_integration.py`.

**New Claude bridge command:**
- Implementation: `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`.
- Tests: `upgrade/v3.7-CLAUDE-NATIVE/test_claude_integration.py`.
- Launcher updates: `start-claude-native-bridge.bat` only if the start command changes.

**New extraction or mapping logic:**
- General Excel extraction: `hvdc_one_line.py`.
- Mapping and enrichment rules: `hvdc-code-mapping-v2.6.2.json` plus an importable snake_case Python module.
- Fixtures: `sample_data/`.
- Tests: `test_hvdc_api.py` or a new extraction-focused `test_*.py`.

**New audit or evidence output:**
- Audit CSV behavior: `audit_logger.py`.
- NDJSON/hash behavior: `audit_ndjson_and_hash.py`.
- Output location: `artifacts/`.
- Tests: `test_hvdc_api.py`.

**Utilities:**
- Shared Python helpers: root-level snake_case `*.py` modules.
- Operator automation: `scripts/hvdc-*.ps1`.
- One-off demos: keep separate from importable core modules and avoid importing hyphenated demo filenames from services.

## Special Directories

**`artifacts/`:**
- Purpose: Generated evidence files from audit, health, and integration runs.
- Generated: Yes.
- Committed: Present in workspace.
- Source status: Do not treat as source unless a specific fixture is promoted and documented.

**`logs/`:**
- Purpose: Generated runtime, performance, and upgrade logs.
- Generated: Yes.
- Committed: Present in workspace.
- Source status: Do not edit as implementation source.

**`backup/`:**
- Purpose: Local backup snapshots such as `backup/pre_v37_upgrade`.
- Generated: Yes.
- Committed: Present in workspace.
- Source status: Do not scan or refactor as active source.

**`fuseki/apache-jena-fuseki-4.10.0/`:**
- Purpose: Bundled Apache Jena Fuseki runtime.
- Generated: Vendor/runtime distribution.
- Committed: Present in workspace.
- Source status: Treat as third-party runtime internals, not project source.

**`fuseki/apache-jena-fuseki-4.10.0.zip`:**
- Purpose: Bundled Fuseki archive.
- Generated: Vendor binary archive.
- Committed: Present in workspace.
- Source status: Do not modify for application changes.

**`.planning/codebase/`:**
- Purpose: Generated codebase maps for GSD orchestration.
- Generated: Yes.
- Committed: Workspace planning artifact.
- Source status: Only mappers should write their assigned files here.

**`sample_data/`:**
- Purpose: Sample Excel fixtures for demos and tests.
- Generated: Can be generated by `hvdc_one_line.py`.
- Committed: Present in workspace.
- Source status: Treat as fixtures, not production data.

**`upgrade/v3.7-CLAUDE-NATIVE/`:**
- Purpose: Versioned bridge implementation.
- Generated: No.
- Committed: Present in workspace.
- Source status: Active source for bridge behavior, despite versioned upgrade naming.

## Files Not To Treat As Canonical Source

- `openapi.updated.yaml`: Generated from `openapi.yaml` by `update_openapi_schema.py`.
- `hvdc_extracted_20250817_204248.ttl`: Timestamped generated extraction output.
- `artifacts/audit_log.csv`: Runtime audit output.
- `artifacts/audit.ndjson`: Runtime audit output.
- `artifacts/audit.ndjson.hash.json`: Runtime hash metadata.
- `artifacts/health_report.json`: Generated health report.
- `artifacts/integration_test_results.json`: Generated integration result.
- `logs/*.log`: Runtime or upgrade logs.
- `logs/*.csv`: Runtime performance output.
- `backup/**`: Backup snapshots.
- `fuseki/apache-jena-fuseki-4.10.0/**`: Bundled Apache Fuseki internals.
- `fuseki/apache-jena-fuseki-4.10.0.zip`: Bundled vendor archive.
- `dashboard_temp_8090.html`: Generated or temporary dashboard HTML.
- `dashboard_clean_8099.html`: Generated dashboard HTML.
- `add-audit-workflow.patch`: Patch artifact, not active implementation.
- `hvdc_upgrade.patch`: Patch artifact, not active implementation.

## Boundary Guidance

- Keep canonical public API schema changes in `openapi.yaml`; regenerate `openapi.updated.yaml` for the current tunnel or hosted endpoint.
- Keep Fuseki source data and operational graph fixtures in root `*.ttl` files and `queries/*.rq`; keep runtime graph evidence in `artifacts/` or `logs/`.
- Keep Cloudflare, MCP, or edge runtime additions in a new explicit source directory if introduced; do not mix them into `fuseki/`, `artifacts/`, or `logs/`.
- Keep Apps SDK/MCP conventions separate from the existing GPTs Actions path until first-class MCP source files exist in this workspace.
- Preserve the parent skill constraints when extending architecture: grounded answer flows use `../.agents/skills/answer-grounding/SKILL.md`, validation gates use `../.agents/skills/validation-gate/SKILL.md`, and future MCP tool contracts use `../.agents/skills/mcp-tool-contract/SKILL.md`.

---

*Structure analysis: 2026-05-13*
