# Technology Stack

**Analysis Date:** 2026-05-13

## Languages

**Primary:**
- Python 3 - Flask APIs, data extraction, audit logging, Fuseki deployment helpers, tests, and CLI utilities in `hvdc_api.py`, `nlq_query_wrapper_flask.py`, `hvdc_one_line.py`, `fuseki_swap_verify.py`, `mock_gateway_server.py`, and `test_hvdc_api.py`.
- PowerShell 7 / Windows PowerShell - local setup, Fuseki operations, dashboards, validation, GPTs/ngrok automation, and operational scripts in `setup-fuseki.ps1`, `start-dashboard-clean.ps1`, `full-validation.ps1`, `gpts_oneclick.ps1`, and `scripts/hvdc-data-loader.ps1`.

**Secondary:**
- HTML/CSS/JavaScript - local dashboard artifacts in `dashboard_clean_8099.html`, `dashboard_temp_8090.html`, and generated dashboard bodies inside `start-dashboard-*.ps1`.
- Bash / shell - Linux/macOS helpers and GitHub workflow dispatch helper in `start-hvdc-fuseki.sh`, `scripts/hvdc-batch-processor.sh`, `test_logi_master_enhanced_audit.sh`, and `gh-run.sh`.
- RDF/Turtle and SPARQL - ontology payloads and query templates in `triples.ttl`, `hvdc_extracted_fixed.ttl`, `prov_mapping.ttl`, `queries/operational-queries.rq`, and `queries/01-monthly-warehouse-stock.rq`.
- YAML - OpenAPI and GitHub Actions configuration in `openapi.yaml`, `openapi.updated.yaml`, and `.github/workflows/audit-smoke.yml`.

## Runtime

**Environment:**
- Python runtime: GitHub Actions uses Python 3.11 in `.github/workflows/audit-smoke.yml`; the current local `python --version` reports Python 3.14.4.
- Java runtime: Apache Jena Fuseki requires Java 11+ per `setup-fuseki.ps1` and `install-java.md`; the current local `java -version` reports OpenJDK 17.0.18.
- PowerShell runtime: the current local `$PSVersionTable.PSVersion` reports 7.5.5.

**Package Manager:**
- pip - dependencies are listed in `requirements.txt`.
- Lockfile: missing. No `requirements.lock`, `poetry.lock`, `Pipfile.lock`, or package-manager lockfile was detected.
- Node/npm: Not detected. No `package.json` or frontend package manager was detected.

## Frameworks

**Core:**
- Flask 3.0.0 - local HTTP APIs in `hvdc_api.py`, `mock_gateway_server.py`, `nlq_query_wrapper_flask.py`, and `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`.
- Apache Jena Fuseki 4.10.0 - local RDF triple store installed under `fuseki/apache-jena-fuseki-4.10.0` and started by `start-hvdc-fuseki.bat` / `start-hvdc-fuseki.sh`.
- Apache Jena TDB2 - Fuseki storage mode via `fuseki-server.bat --tdb2 --loc .\data\tdb-hvdc --update /hvdc` in `start-hvdc-fuseki.bat`.
- OpenAPI 3.1.0 - GPTs Actions schema in `openapi.yaml` and patched public schema in `openapi.updated.yaml`.

**Testing:**
- pytest 7.4.2 - API tests and fixtures in `test_hvdc_api.py`; configured through `requirements.txt`.
- pytest-cov 4.1.0 - coverage dependency in `requirements.txt`; no coverage config file was detected.
- unittest - gateway integration tests in `test_gateway_integration.py`.
- GitHub Actions - scheduled/manual/push smoke tests in `.github/workflows/audit-smoke.yml`.

**Build/Dev:**
- requests 2.31.0 - HTTP clients for Fuseki, Gateway API, Claude bridge, ngrok health checks, and tests in `fuseki_swap_verify.py`, `hvdc_gateway_client.py`, `ngrok_setup.ps1`, and `test_sparql_direct.py`.
- pandas 2.1.0 / openpyxl 3.1.2 - Excel ingestion and tabular extraction in `hvdc_one_line.py`, `hvdc-integration-demo.py`, and `test_hvdc_api.py`.
- numpy 1.24.3 / rapidfuzz 3.5.2 - data processing dependencies declared in `requirements.txt`; direct imports were not detected in the non-backup Python files scanned.
- cryptography 41.0.4 - security/compliance dependency declared in `requirements.txt`; direct imports were not detected in the non-backup Python files scanned.
- PyYAML - required by `update_openapi_schema.py` via `import yaml`, but not listed in `requirements.txt`.

## Key Dependencies

**Critical:**
- `flask==3.0.0` - serves `/health`, `/ingest`, `/run-rules`, `/nlq`, `/fuseki/*`, `/v1/*`, and `/claude/*` endpoints in `hvdc_api.py`, `mock_gateway_server.py`, `nlq_query_wrapper_flask.py`, and `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`.
- `requests==2.31.0` - all HTTP integration paths use it, including Fuseki Graph Store/SPARQL calls in `fuseki_swap_verify.py` and Gateway API calls in `hvdc_gateway_client.py`.
- `pandas==2.1.0` - Excel-to-dataframe ingestion and rules execution use it in `hvdc_one_line.py`, `hvdc_api.py`, and `hvdc_rules.py`.
- `openpyxl==3.1.2` - Excel file support for sample workbooks in `sample_data/*.xlsx` and ingestion paths in `hvdc_one_line.py`.
- Apache Jena Fuseki 4.10.0 - local triple-store dependency downloaded by `setup-fuseki.ps1` and bundled under `fuseki/apache-jena-fuseki-4.10.0`.

**Infrastructure:**
- ngrok v3 - exposes local Gateway/mock APIs to GPTs Actions through `ngrok_setup.ps1` and `gpts_oneclick.ps1`.
- GitHub CLI `gh` - manual workflow dispatch helper in `gh-run.sh`.
- Java 11+ - Fuseki runtime dependency documented in `install-java.md` and enforced by `setup-fuseki.ps1`.
- GitHub Actions hosted Ubuntu runner - CI runtime for `.github/workflows/audit-smoke.yml`.
- Slack GitHub Action - optional CI notifications via `slackapi/slack-github-action@v2.0.0-rc.2` in `.github/workflows/audit-smoke.yml`.

## Configuration

**Environment:**
- Gateway client config is loaded from environment variables in `hvdc_gateway_config.py`, including `HVDC_GATEWAY_URL`, `HVDC_GATEWAY_API_KEY`, `HVDC_GATEWAY_TIMEOUT`, `HVDC_GATEWAY_RETRIES`, `HVDC_GATEWAY_SSL_VERIFY`, `HVDC_LOG_LEVEL`, `HVDC_LOG_REQUESTS`, and `HVDC_PROD_API_KEY`.
- NLQ wrapper config is loaded from `SPARQL_ENDPOINT`, `SPARQL_TIMEOUT`, `SPARQL_MAX_ROWS`, and `NLQ_PORT` in `nlq_query_wrapper_flask.py`.
- GitHub Actions reads `HVDC_API_URL`, `TRACE_SAMPLE_PATH`, `SLACK_WEBHOOK_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` from repository secrets in `.github/workflows/audit-smoke.yml`.
- `hvdc_gateway.env.example` exists as an example environment file; do not treat it as a runtime secret source.
- `config/shiro-dev.ini` and `config/shiro-prod.ini` exist for Fuseki/Shiro authentication configuration; contents were not quoted because auth config may contain sensitive values.

**Build:**
- Dependency manifest: `requirements.txt`.
- OpenAPI schemas: `openapi.yaml`, `openapi.updated.yaml`.
- Fuseki setup/startup: `setup-fuseki.ps1`, `start-hvdc-fuseki.bat`, `start-hvdc-fuseki.sh`.
- Validation scripts: `smoke-test.ps1`, `full-validation.ps1`, `test_logi_master_enhanced_audit.sh`, `.github/workflows/audit-smoke.yml`.
- Dashboard scripts: `start-dashboard-auto.ps1`, `start-dashboard-clean.ps1`, `start-dashboard-proxy.ps1`, `start-dashboard-ultimate.ps1`.

## Scripts and Local Services

**Local APIs:**
- `hvdc_api.py` runs Flask on `0.0.0.0:5002` and owns ingestion, evidence lookup, rule execution, audit verification, NLQ proof of concept, and Fuseki deploy/stats/validate endpoints.
- `mock_gateway_server.py` runs Flask on `localhost:8080` and serves mock Gateway endpoints under `/v1`.
- `nlq_query_wrapper_flask.py` runs Flask on `0.0.0.0:${NLQ_PORT:-5010}` and sends generated SPARQL to `${SPARQL_ENDPOINT:-http://localhost:3030/hvdc/sparql}`.
- `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py` runs Flask on `localhost:5003` and bridges MACHO-GPT commands to local APIs and Gateway client code.

**Local datastore:**
- `start-hvdc-fuseki.bat` and `start-hvdc-fuseki.sh` start Fuseki at `http://localhost:3030/hvdc` with SPARQL at `http://localhost:3030/hvdc/sparql`.
- `fuseki_swap_verify.py` manages staging, validation, backup, swap, rollback, and named graph operations against Fuseki.

**Operational automation:**
- `scripts/hvdc-data-loader.ps1` loads `triples.ttl` into Fuseki.
- `scripts/hvdc-query-runner.ps1` runs SPARQL templates from `queries/*.rq`.
- `scripts/migrate-to-named-graphs.ps1` and `scripts/rollback-named-graphs.ps1` manage named graph migration and rollback.
- `scripts/hvdc-performance-monitor.ps1` writes runtime telemetry under `logs/`.
- `gpts_oneclick.ps1` starts the mock Gateway, opens ngrok tunnels, patches OpenAPI schema, and optionally hosts schema through `python -m http.server`.

## Platform Requirements

**Development:**
- Install Python packages with `python -m pip install -r requirements.txt`.
- Install Java 11+ before running Fuseki; use `install-java.md` and `setup-fuseki.ps1`.
- Start Fuseki with `start-hvdc-fuseki.bat` on Windows or `start-hvdc-fuseki.sh` on Linux/macOS.
- Use `python hvdc_api.py`, `python mock_gateway_server.py`, `python nlq_query_wrapper_flask.py`, and `python upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py` for local API services.

**Production:**
- No active production deployment manifest is present. `production_deployment_guide.md` documents a target Python 3.11 slim Docker image, gunicorn on port 8080, Redis rate limiting/cache, JWT auth, AWS ECR/EKS deployment, Prometheus/Grafana monitoring, and GPTs Actions schema updates, but those are guide examples rather than committed runtime manifests.

---

*Stack analysis: 2026-05-13*
