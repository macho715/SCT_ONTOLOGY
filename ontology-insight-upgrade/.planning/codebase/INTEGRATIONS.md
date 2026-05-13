# External Integrations

**Analysis Date:** 2026-05-13

## APIs & External Services

**HVDC Gateway API:**
- Gateway service - used for health checks, MRR draft creation, ETA prediction, and CostGuard estimates.
  - SDK/Client: custom `HVDCGatewayClient` in `hvdc_gateway_client.py`.
  - Base URLs: `https://api.hvdc-gateway.example.com/v1` and `https://dev-api.hvdc-gateway.example.com/v1` in `hvdc_gateway_config.py`.
  - Auth: `X-API-Key` header from `HVDC_GATEWAY_API_KEY` / `HVDC_PROD_API_KEY` in `hvdc_gateway_config.py`.
  - Local mock: `mock_gateway_server.py` serves compatible `/v1/health`, `/v1/mrr/draft`, `/v1/predict/eta`, `/v1/costguard/estimate`, and `/v1/admin/status` endpoints on `localhost:8080`.

**Apache Jena Fuseki:**
- Local RDF triple store - used for SPARQL queries, Graph Store Protocol uploads, staging graph validation, backup/swap/rollback, and dashboard data.
  - SDK/Client: direct HTTP via `requests` in `fuseki_swap_verify.py`, `hvdc-integration-demo.py`, `check_fuseki_data.py`, and `nlq_query_wrapper_flask.py`; PowerShell `Invoke-RestMethod` in `scripts/*.ps1`.
  - Endpoints: `http://localhost:3030/$/ping`, `http://localhost:3030/hvdc`, `http://localhost:3030/hvdc/sparql`, `http://localhost:3030/hvdc/update`, and `http://localhost:3030/hvdc/data`.
  - Auth: Shiro config files exist at `config/shiro-dev.ini` and `config/shiro-prod.ini`; active local scripts call unauthenticated localhost endpoints.

**ChatGPT GPTs Actions:**
- GPTs Actions integration - exposes HVDC Gateway endpoints to ChatGPT through OpenAPI 3.1 schemas and ngrok public URLs.
  - Schema: `openapi.yaml` and `openapi.updated.yaml`.
  - Automation: `gpts_oneclick.ps1`, `ngrok_setup.ps1`, and `update_openapi_schema.py`.
  - Docs: `HVDC_GPTS_ACTIONS_GUIDE.md`, `HVDC_GPTS_ONECLICK_GUIDE.md`, and `PRIVACY.md`.
  - Auth: OpenAPI `ApiKeyAuth` uses `X-API-Key` in `openapi.yaml`; ngrok can add basic auth through `BasicAuthUser` / `BasicAuthPass` parameters in `ngrok_setup.ps1`.

**ngrok:**
- Public tunnel provider - exposes local `localhost:8080` Gateway mock and optional schema server `localhost:8000` for GPT Builder import.
  - Client: ngrok CLI invoked by `ngrok_setup.ps1` and `gpts_oneclick.ps1`.
  - Local inspector: `http://127.0.0.1:4040/api/tunnels` in `ngrok_setup.ps1`, `gpts_oneclick.ps1`, and `HVDC_GPTS_ACTIONS_GUIDE.md`.
  - Auth: `AuthToken` script parameter in `ngrok_setup.ps1` / `gpts_oneclick.ps1`; token values are not stored in repo files.

**Claude Native / MACHO-GPT Bridge:**
- Local bridge service - maps MACHO-GPT commands to system status, KPI dashboard, MRR draft, ETA, and recommended Claude tools.
  - Implementation: `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`.
  - Endpoints: `/claude/execute`, `/claude/workflow`, `/claude/status`, `/claude/mrr-draft`, and `/claude/eta-prediction`.
  - Local dependencies: `http://localhost:5002` HVDC API, `http://localhost:5003` bridge, `http://localhost:3030/hvdc` Fuseki, and Gateway client code in `hvdc_gateway_client.py`.
  - Auth: Not detected in the bridge implementation.

**GitHub and GitHub Actions:**
- CI and workflow dispatch - scheduled/manual/push audit smoke tests run in `.github/workflows/audit-smoke.yml`.
  - Client/tools: GitHub Actions, `actions/checkout@v4`, `actions/setup-python@v4`, `actions/cache@v4`, `actions/setup-java@v3`, `actions/upload-artifact@v4`, and `slackapi/slack-github-action@v2.0.0-rc.2`.
  - CLI helper: `gh-run.sh` uses authenticated GitHub CLI `gh` to trigger workflow dispatch.
  - Auth: GitHub repository secrets and local `gh auth login`.

**Documentation-only production targets:**
- AWS ECR/EKS, Redis/ElastiCache, JWT, Prometheus/Grafana, OpenWeatherMap, port congestion API, SMTP, and Slack are described in `production_deployment_guide.md` as production examples. They are not active runtime dependencies in `requirements.txt` or committed deployment manifests.
- Cloudflare-specific Workers, Pages, R2, D1, Wrangler, or Cloudflare Tunnel integrations were not detected in the scanned repo files.

## Data Storage

**Databases:**
- Apache Jena Fuseki / TDB2
  - Connection: local endpoint `http://localhost:3030/hvdc` in `start-hvdc-fuseki.bat`, `fuseki_swap_verify.py`, `full-validation.ps1`, and `scripts/hvdc-data-loader.ps1`.
  - Client: HTTP SPARQL/Graph Store Protocol through `requests` and PowerShell web cmdlets.
  - Dataset: `/hvdc`.
  - Storage path: `fuseki/apache-jena-fuseki-4.10.0/data/tdb-hvdc` configured in `start-hvdc-fuseki.bat`.

**File Storage:**
- Local filesystem only for committed data and generated artifacts.
- Sample Excel inputs live in `sample_data/*.xlsx`.
- RDF/Turtle inputs live in `triples.ttl`, `sample_invoice_data.ttl`, `test_deployment.ttl`, and `hvdc_extracted_fixed.ttl`.
- Audit outputs live in `artifacts/audit_log.csv`, `artifacts/audit.ndjson`, and `artifacts/audit.ndjson.hash.json`.
- Health/performance outputs live in `artifacts/health_report.json`, `artifacts/integration_test_results.json`, and `logs/`.

**Caching:**
- Active runtime cache: Not detected.
- Documentation-only cache: Redis examples appear in `production_deployment_guide.md`.

## Authentication & Identity

**Auth Provider:**
- Gateway API key
  - Implementation: `HVDCGatewayClient` sets `X-API-Key` in `hvdc_gateway_client.py`; `openapi.yaml` declares the same header under `ApiKeyAuth`.
  - Configuration: `HVDC_GATEWAY_API_KEY` and `HVDC_PROD_API_KEY` in `hvdc_gateway_config.py`.

**Local service auth:**
- Local Flask API `hvdc_api.py`: Not detected. Endpoints accept actor fields in JSON/form payloads but do not enforce authentication.
- Local mock Gateway `mock_gateway_server.py`: Not detected. It validates required fields but does not enforce API key checks.
- Claude bridge `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`: Not detected.
- Fuseki local scripts: call localhost endpoints without credentials; Shiro config files exist at `config/shiro-dev.ini` and `config/shiro-prod.ini`.

**Planned/documented auth:**
- JWT bearer auth and rate limiting are shown as production examples in `production_deployment_guide.md`.
- ngrok basic auth is supported by `BasicAuthUser` / `BasicAuthPass` parameters in `ngrok_setup.ps1`.

## Monitoring & Observability

**Error Tracking:**
- Dedicated external error tracking service: Not detected.
- CI failure artifacts: `.github/workflows/audit-smoke.yml` uploads `artifacts/audit.ndjson`, `artifacts/audit.ndjson.hash.json`, `logs/**`, and `artifacts/integration_test_results.json` on failure.

**Logs:**
- Python logging is used in `hvdc_api.py`, `hvdc_gateway_client.py`, `fuseki_swap_verify.py`, `mock_gateway_server.py`, and `system_health_check.py`.
- Structured local audit logs are written by `audit_logger.py` to CSV and by `audit_ndjson_and_hash.py` to NDJSON/hash metadata under `artifacts/`.
- Performance logs are written under `logs/` by `scripts/hvdc-performance-monitor.ps1`.
- Documentation-only monitoring: Prometheus/Grafana examples appear in `production_deployment_guide.md`.

## CI/CD & Deployment

**Hosting:**
- Active local hosting:
  - Flask API on `0.0.0.0:5002` from `hvdc_api.py`.
  - Mock Gateway on `localhost:8080` from `mock_gateway_server.py`.
  - NLQ wrapper on `0.0.0.0:5010` by default from `nlq_query_wrapper_flask.py`.
  - Claude bridge on `localhost:5003` from `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`.
  - Fuseki on `localhost:3030` from `start-hvdc-fuseki.bat`.
  - PowerShell dashboard servers on ports such as `8099`, `8092`, and alternatives from `start-dashboard-clean.ps1`, `start-dashboard-proxy.ps1`, and `start-dashboard-ultimate.ps1`.
- Public dev exposure: ngrok tunnels in `ngrok_setup.ps1` and `gpts_oneclick.ps1`.
- Production target: Not committed as deployable infrastructure. `production_deployment_guide.md` documents Docker/gunicorn/AWS EKS as a target path.

**CI Pipeline:**
- `.github/workflows/audit-smoke.yml` runs on a daily schedule, manual dispatch, and push to `main`.
- CI installs Python dependencies from `requirements.txt`, starts Fuseki from `fuseki/apache-jena-fuseki-4.10.0`, checks `http://localhost:3030/$/ping`, imports core modules, runs `test_integration.py` if present, starts `nlq_query_wrapper_flask.py`, and posts sample NLQ queries to `http://localhost:5010/nlq-query`.
- Optional Slack notification uses `SLACK_WEBHOOK_URL` through `slackapi/slack-github-action`.

## Environment Configuration

**Required env vars:**
- Gateway: `HVDC_GATEWAY_URL`, `HVDC_GATEWAY_API_KEY`, `HVDC_GATEWAY_TIMEOUT`, `HVDC_GATEWAY_RETRIES`, `HVDC_GATEWAY_SSL_VERIFY`, `HVDC_LOG_LEVEL`, `HVDC_LOG_REQUESTS`, `HVDC_PROD_API_KEY`.
- NLQ/Fuseki wrapper: `SPARQL_ENDPOINT`, `SPARQL_TIMEOUT`, `SPARQL_MAX_ROWS`, `NLQ_PORT`.
- CI/secrets: `HVDC_API_URL`, `TRACE_SAMPLE_PATH`, `SLACK_WEBHOOK_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
- ngrok scripts: `AuthToken`, `Domain`, `BasicAuthUser`, `BasicAuthPass` are script parameters in `ngrok_setup.ps1` and `gpts_oneclick.ps1`.
- Documentation-only production variables: `WEATHER_API_KEY`, `PORT_API_KEY`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` appear in `production_deployment_guide.md`.

**Secrets location:**
- GitHub Actions secrets are referenced in `.github/workflows/audit-smoke.yml`.
- Local examples are listed in `hvdc_gateway.env.example`; do not store real values there.
- ngrok auth token is passed at runtime to `ngrok_setup.ps1` / `gpts_oneclick.ps1`.
- Fuseki/Shiro auth config files exist in `config/`; treat them as sensitive configuration and avoid quoting contents.

## Webhooks & Callbacks

**Incoming:**
- HVDC API receives local HTTP requests on `hvdc_api.py` endpoints: `/health`, `/ingest`, `/evidence/<case_id>`, `/run-rules`, `/nlq`, `/audit/summary`, `/audit/verify`, `/fuseki/deploy`, `/fuseki/stats`, and `/fuseki/validate`.
- Mock Gateway receives GPTs-compatible requests on `mock_gateway_server.py` endpoints under `/v1`.
- Claude bridge receives command/workflow requests in `upgrade/v3.7-CLAUDE-NATIVE/claude_native_bridge.py`.
- NLQ wrapper receives `/nlq-query` in `nlq_query_wrapper_flask.py`.
- Dashboard PowerShell servers expose local `/api/sparql` proxies in `start-dashboard-clean.ps1`, `start-dashboard-proxy.ps1`, and `start-dashboard-ultimate.ps1`.

**Outgoing:**
- Fuseki HTTP calls from `hvdc_api.py`, `fuseki_swap_verify.py`, `nlq_query_wrapper_flask.py`, `hvdc-integration-demo.py`, and `scripts/*.ps1`.
- Gateway API calls from `hvdc_gateway_client.py`.
- Claude bridge calls from `hvdc_gateway_client.py` and `demo_with_mock.py`.
- ngrok inspector calls from `ngrok_setup.ps1`, `gpts_oneclick.ps1`, and documented checks in `HVDC_GPTS_ACTIONS_GUIDE.md`.
- Slack webhook notifications from `.github/workflows/audit-smoke.yml`.
- Optional email notifications are documented but commented in `.github/workflows/audit-smoke.yml`.

---

*Integration audit: 2026-05-13*
