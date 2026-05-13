# Testing Patterns

**Analysis Date:** 2026-05-13

## Test Framework

**Runner:**
- `pytest` 7.4.2 is listed in `requirements.txt` and used directly in `test_hvdc_api.py`.
- Python `unittest` from the standard library is used in `test_gateway_integration.py`.
- PowerShell scripts provide operator smoke and validation gates: `smoke-test.ps1`, `full-validation.ps1`, `scripts/hvdc-data-loader.ps1`, `scripts/hvdc-query-runner.ps1`, `scripts/hvdc-named-graph-manager.ps1`.
- Shell smoke coverage exists in `test_logi_master_enhanced_audit.sh`.
- CI smoke coverage exists in `.github/workflows/audit-smoke.yml`.
- Config: Not detected. There is no `pytest.ini`, `tox.ini`, `setup.cfg`, or `pyproject.toml` test configuration in this workspace.

**Assertion Library:**
- Use plain `assert` for pytest tests in `test_hvdc_api.py`.
- Use `unittest.TestCase` assertions such as `assertEqual`, `assertIn`, `assertIsInstance`, and `assertGreaterEqual` in `test_gateway_integration.py`.
- Use process exit codes and PASS/FAIL collections for PowerShell scripts, especially `smoke-test.ps1` and `full-validation.ps1`.

**Run Commands:**
```bash
python -m pytest test_hvdc_api.py -v --tb=short              # Run Flask API and business-rule pytest tests
python test_gateway_integration.py                           # Run mocked gateway client unittest suite
python test_integration.py                                   # Run business rules + live Fuseki + NLQ integration flow
python test_sparql_direct.py                                 # Run direct live Fuseki SPARQL probes
python system_health_check.py                                # Run local health, audit, API, Fuseki, and rule checks
python audit_ndjson_and_hash.py --write-hash                 # Write audit NDJSON hash metadata
python audit_ndjson_and_hash.py --verify                     # Verify audit NDJSON integrity
powershell -NoProfile -ExecutionPolicy Bypass -File .\smoke-test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\full-validation.ps1 -DetailedReport
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hvdc-data-loader.ps1 -Force -Validate
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hvdc-query-runner.ps1 -AllQueries
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hvdc-named-graph-manager.ps1 -Action validate
```

## Test File Organization

**Location:**
- Python tests are mostly top-level files: `test_hvdc_api.py`, `test_gateway_integration.py`, `test_integration.py`, `test_sparql_direct.py`.
- Upgrade-specific integration tests live near the upgrade code: `upgrade/v3.7-CLAUDE-NATIVE/test_claude_integration.py`.
- PowerShell smoke tests are top-level or under `scripts/`: `smoke-test.ps1`, `full-validation.ps1`, `test-proxy.ps1`, `scripts/hvdc-query-runner.ps1`.
- Shell smoke tests are top-level or under `scripts/`: `test_logi_master_enhanced_audit.sh`, `scripts/hvdc-batch-processor.sh`.
- CI test orchestration lives in `.github/workflows/audit-smoke.yml`.

**Naming:**
- Use `test_*.py` for Python files that can be discovered by pytest: `test_hvdc_api.py`, `test_gateway_integration.py`, `test_integration.py`, `test_sparql_direct.py`.
- Use `Test*` classes for grouped test suites: `TestHealthEndpoint`, `TestIngestEndpoint`, `TestBusinessRules` in `test_hvdc_api.py`; `TestHVDCGatewayClient`, `TestHVDCGatewayIntegration`, `TestGatewayEndToEnd` in `test_gateway_integration.py`.
- Use descriptive `test_<behavior>` function names for individual behaviors: `test_run_rules_should_execute_all_business_rules`, `test_costguard_should_detect_price_deviations`, `test_sync_mrr_with_local_success`.
- Use script names that state the gate being run: `smoke-test.ps1`, `full-validation.ps1`, `test_logi_master_enhanced_audit.sh`.

**Structure:**
```text
./
├── test_hvdc_api.py                         # pytest Flask endpoint and business-rule tests
├── test_gateway_integration.py              # unittest gateway client tests with mocks
├── test_integration.py                      # live-ish end-to-end integration script
├── test_sparql_direct.py                    # live Fuseki SPARQL probes
├── smoke-test.ps1                           # PowerShell environment/Fuseki/query smoke gate
├── full-validation.ps1                      # PowerShell data/query/script validation gate
├── test_logi_master_enhanced_audit.sh       # shell production smoke script
├── upgrade/v3.7-CLAUDE-NATIVE/test_claude_integration.py
├── sample_data/                             # Excel fixtures
├── queries/                                 # SPARQL query fixtures/templates
└── artifacts/                               # generated test and audit outputs
```

## Test Structure

**Suite Organization:**
```python
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

class TestRulesEndpoint:
    def test_run_rules_should_execute_all_business_rules(self, client, sample_data):
        response = client.post('/run-rules', json=payload)
        assert response.status_code == 200
        assert 'summary' in response.get_json()
```

Use this pytest fixture/class pattern for Flask endpoint coverage in `test_hvdc_api.py`.

```python
class TestHVDCGatewayClient(unittest.TestCase):
    def setUp(self):
        self.config = get_config("dev")
        self.client = HVDCGatewayClient(
            base_url=self.config.base_url,
            api_key=self.config.api_key,
        )

    @patch('requests.Session.get')
    def test_health_check_success(self, mock_get):
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"status": "ok"}
        mock_get.return_value = mock_response
```

Use this unittest/mock pattern for external gateway client behavior in `test_gateway_integration.py`.

**Patterns:**
- Keep Flask API tests local with `app.test_client()` when endpoint behavior does not require a live server. Use `test_hvdc_api.py` as the pattern.
- Mock external `requests` calls for deterministic client tests. Use `@patch('requests.Session.get')`, `@patch('requests.Session.post')`, and `@patch('requests.post')` as in `test_gateway_integration.py`.
- Use live service tests only in scripts that clearly require local services: `test_integration.py`, `test_sparql_direct.py`, `system_health_check.py`, `smoke-test.ps1`, `full-validation.ps1`.
- Write generated test outputs under `artifacts/`: `artifacts/test_extraction_trace.csv`, `artifacts/integration_test_results.json`, `artifacts/health_report.json`.
- Clean temporary files created by a test when practical. `test_hvdc_api.py` removes `artifacts/test_extraction_trace.csv` after `test_run_rules_should_execute_all_business_rules`.

## Mocking

**Framework:** `unittest.mock`

**Patterns:**
```python
@patch('requests.Session.post')
def test_estimate_cost_success(self, mock_post):
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "estimated_cost": 0.045,
        "band": "PASS",
        "thresholds": {"pass": 0.02, "warn": 0.05, "high": 0.10},
    }
    mock_post.return_value = mock_response
```

**What to Mock:**
- Mock gateway HTTP calls in `hvdc_gateway_client.py` tests.
- Mock Claude bridge and local API calls made by `HVDCGatewayIntegration` in `test_gateway_integration.py`.
- Mock or avoid live Fuseki when testing pure logic in `hvdc_rules.py`, `nlq_to_sparql.py`, and audit sanitization.

**What NOT to Mock:**
- Do not mock rule calculations in `hvdc_rules.py` when validating CostGuard, HS Risk, or CertChk behavior. Use small `pandas.DataFrame` fixtures as in `test_hvdc_api.py`.
- Do not mock audit sanitization or hash generation when testing leakage/integrity behavior. Test `audit_logger.py` and `audit_ndjson_and_hash.py` with temporary artifact paths where possible.
- Do not mock Fuseki in operator smoke scripts. `smoke-test.ps1`, `full-validation.ps1`, and `scripts/hvdc-named-graph-manager.ps1 -Action validate` are intended to validate the running service.

## Fixtures and Factories

**Test Data:**
```python
@pytest.fixture
def sample_data():
    return pd.DataFrame({
        'HVDC_CODE': ['HVDC-ADOPT-SCT-0001', 'HVDC-ADOPT-SCT-0002'],
        'INVOICE_VALUE': [1000.0, 750.0],
        'QTY': [1, 1],
        'UNIT_PRICE': [1000.0, 750.0],
        'HS_CODE': ['8504.40.90', '8544.60.90'],
        'CERTS': 'MOIAT,FANR',
    })
```

**Location:**
- Inline DataFrame fixtures live in `test_hvdc_api.py` and `test_integration.py`.
- Excel sample fixtures live in `sample_data/DSV_Sample.xlsx`, `sample_data/OFCO_Sample.xlsx`, `sample_data/PKGS_Sample.xlsx`, `sample_data/DSV_Sample_copy.xlsx`, `sample_data/OFCO_Sample.(1).xlsx`.
- RDF fixtures live in `triples.ttl`, `test_deployment.ttl`, `sample_invoice_data.ttl`, and `prov_mapping.ttl`.
- SPARQL fixtures live in `queries/01-monthly-warehouse-stock.rq`, `queries/02-case-timeline-events.rq`, `queries/03-invoice-risk-analysis.rq`, `queries/04-oog-hs-risk-assessment.rq`, and `queries/operational-queries.rq`.
- JSON request fixtures live in `test_logi_master.json`, `test_nlq_query.json`, `test_nlq_final.json`, `test_claude_gateway.json`, and `test_claude_command.json`.

## Coverage

**Requirements:** None enforced.

**View Coverage:**
```bash
python -m pytest test_hvdc_api.py --cov=. --cov-report=term-missing
python -m pytest test_hvdc_api.py test_gateway_integration.py --cov=. --cov-report=html
```

`pytest-cov` is listed in `requirements.txt`, but no coverage threshold or report path is configured.

## Test Types

**Unit Tests:**
- Business-rule unit tests live in `test_hvdc_api.py` and cover `run_costguard`, `run_hs_risk`, and `run_cert_check` from `hvdc_rules.py`.
- Gateway client unit tests live in `test_gateway_integration.py` and mock external HTTP calls from `hvdc_gateway_client.py`.
- NLQ/SPARQL generation has callable pure functions in `nlq_to_sparql.py`, but dedicated assertion-based unit tests are not detected.

**API Tests:**
- Flask API tests use `app.test_client()` in `test_hvdc_api.py` for `/health`, `/ingest`, `/evidence/<case_id>`, `/run-rules`, and `/nlq`.
- Mock gateway server behavior lives in `mock_gateway_server.py` and can be exercised through `quick_demo.py` or `demo_with_mock.py`.

**Integration Tests:**
- `test_integration.py` combines `hvdc_rules.py`, `fuseki_swap_verify.py`, and `nlq_to_sparql.py`. It writes `artifacts/integration_test_results.json`.
- `test_sparql_direct.py` sends live SPARQL queries to `http://localhost:3030/hvdc/sparql`.
- `upgrade/v3.7-CLAUDE-NATIVE/test_claude_integration.py` probes the Claude bridge at `http://localhost:5003`.
- `system_health_check.py` checks Python packages, core files, `http://localhost:5002/health`, `http://localhost:3030/$/ping`, audit integrity, business rules, and artifact size.

**Smoke Tests:**
- `smoke-test.ps1` checks Java, Fuseki reachability, SPARQL endpoint count, Graph Store Protocol, `triples.ttl`, query templates, and automation script presence.
- `full-validation.ps1` checks Fuseki, optional data reload, triple count, expected class counts, four core query files, and PowerShell syntax for `scripts/hvdc-data-loader.ps1` and `scripts/hvdc-query-runner.ps1`.
- `test_logi_master_enhanced_audit.sh` checks API health, NLQ service startup, sample ingestion, business rules, NLQ queries, Fuseki deploy, audit integrity, integration tests, stats, and response time.
- `.github/workflows/audit-smoke.yml` starts Fuseki, imports core Python modules, runs `test_integration.py`, and probes NLQ wrapper queries.

**E2E Tests:**
- No browser E2E framework is detected. Dashboard scripts such as `start-dashboard-ultimate.ps1`, `start-dashboard-clean.ps1`, and `check-dashboard-status.ps1` provide manual/local operational checks instead.

## Common Patterns

**Async Testing:**
```text
Not used. Tests are synchronous HTTP, Flask test-client, PowerShell, shell, or direct Python script checks.
```

**Error Testing:**
```python
response = client.post('/ingest', json={})
assert response.status_code == 400
data = response.get_json()
assert 'No file provided' in data['error']
```

Use this pattern from `test_hvdc_api.py` for invalid input paths.

```python
response = client.post('/nlq', json={"q": "What is the weather today?"})
assert response.status_code == 400
assert 'unsupported NLQ' in response.get_json()['error']
```

Use this pattern from `test_hvdc_api.py` for unsupported NLQ behavior.

**Live Service Guards:**
- Check Fuseki before claiming live data validation. `smoke-test.ps1` calls `$FusekiUrl`; `scripts/hvdc-data-loader.ps1` calls `$BaseUrl/$/ping`; `system_health_check.py` calls `http://localhost:3030/$/ping`.
- Check API health before API smoke claims. `system_health_check.py` calls `http://localhost:5002/health`; `test_logi_master_enhanced_audit.sh` calls `$API_BASE/health`.
- Use bounded timeouts for probes: `TimeoutSeconds` in `smoke-test.ps1`, `TimeoutSec 5` in `scripts/hvdc-data-loader.ps1`, and `timeout=5` in `system_health_check.py`.

**SPARQL Validation:**
- Use `validate_sparql` in `nlq_to_sparql.py` to block `DROP`, `CLEAR`, `INSERT`, `DELETE`, and `CREATE` operations for generated SELECT queries.
- Use `full-validation.ps1` for the four core business query templates: `queries/01-monthly-warehouse-stock.rq`, `queries/02-case-timeline-events.rq`, `queries/03-invoice-risk-analysis.rq`, `queries/04-oog-hs-risk-assessment.rq`.
- Use `scripts/hvdc-named-graph-manager.ps1 -Action validate` for named graph counts and stock integrity checks.

**Audit and Security Testing:**
- Use `python audit_ndjson_and_hash.py --write-hash` followed by `python audit_ndjson_and_hash.py --verify` for NDJSON integrity.
- Use `POST /audit/verify` in `hvdc_api.py` or `system_health_check.py` for CSV audit integrity checks.
- Add explicit redaction tests before changing `SENSITIVE_PATTERNS` in `audit_logger.py` or `sensitive_patterns` in `audit_ndjson_and_hash.py`. The project skill `../.agents/skills/privacy-redactor/SKILL.md` expects email, phone, token, private link, and raw rate leakage coverage.

## Validation Commands Before Claiming Done

**Python-only logic changes:**
```bash
python -m pytest test_hvdc_api.py -v --tb=short
python test_gateway_integration.py
```

**Flask API changes in `hvdc_api.py`:**
```bash
python -m pytest test_hvdc_api.py -v --tb=short
python system_health_check.py
```

**Gateway client changes in `hvdc_gateway_client.py` or `hvdc_gateway_config.py`:**
```bash
python test_gateway_integration.py
python quick_demo.py
```

**Fuseki, TTL, graph, or query changes:**
```bash
powershell -NoProfile -ExecutionPolicy Bypass -File .\smoke-test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\full-validation.ps1 -DetailedReport
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hvdc-named-graph-manager.ps1 -Action validate
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\hvdc-query-runner.ps1 -AllQueries
```

**Audit logging or redaction changes:**
```bash
python -m pytest test_hvdc_api.py -v --tb=short
python audit_ndjson_and_hash.py --write-hash
python audit_ndjson_and_hash.py --verify
python system_health_check.py
```

**PowerShell automation changes:**
```bash
powershell -NoProfile -Command "[System.Management.Automation.PSParser]::Tokenize((Get-Content .\scripts\hvdc-data-loader.ps1 -Raw), [ref]$null) | Out-Null"
powershell -NoProfile -ExecutionPolicy Bypass -File .\smoke-test.ps1
```

**Release or CI smoke claims:**
```bash
bash test_logi_master_enhanced_audit.sh
gh workflow run audit-smoke.yml -f target_branch=main -f run_smoke=true
```

Use the live commands only when the required services are running: Fuseki on `http://localhost:3030`, local API on `http://localhost:5002`, NLQ wrapper on `http://localhost:5010`, and Claude bridge on `http://localhost:5003` where applicable.

## Likely Gaps

**Not configured:**
- No central pytest configuration is detected: `pytest.ini`, `tox.ini`, `setup.cfg`, and `pyproject.toml` are absent.
- No enforced coverage threshold is detected, even though `pytest-cov` is listed in `requirements.txt`.
- No active lint or type-check command is configured. Optional `black`, `flake8`, and `mypy` entries are commented in `requirements.txt`.

**Test isolation:**
- Some tests and health checks write persistent artifacts under `artifacts/`, including `artifacts/audit_log.csv`, `artifacts/audit.ndjson`, `artifacts/health_report.json`, and `artifacts/integration_test_results.json`.
- Some integration tests depend on live services and local ports. `test_integration.py`, `test_sparql_direct.py`, `system_health_check.py`, `smoke-test.ps1`, and `full-validation.ps1` should be reported as live environment checks, not pure unit tests.

**Coverage gaps:**
- Dedicated unit tests for `nlq_to_sparql.validate_sparql` dangerous-operation blocking are not detected.
- Dedicated tests for `audit_logger.sanitize_sensitive_data` and `audit_ndjson_and_hash.sanitize_event` are not detected.
- Dedicated tests for PowerShell scripts through Pester are not detected.
- Browser/UI tests for dashboard HTML and dashboard PowerShell launchers are not detected.
- CI workflow `.github/workflows/audit-smoke.yml` runs imports, Fuseki startup, `test_integration.py`, and NLQ probes, but it does not run `python -m pytest test_hvdc_api.py` or `python test_gateway_integration.py` explicitly.

## Project Skill Gates

**Grounded answer work:**
- For answer grounding changes, apply `../.agents/skills/answer-grounding/SKILL.md`: require EvidenceSnippet coverage, `CONSOLIDATED-00` coverage, Flow Code boundary validation, currentness checks, and PII redaction checks.

**Validation work:**
- For validation changes, apply `../.agents/skills/validation-gate/SKILL.md`: test PASS/WARN/BLOCK/NO_EVIDENCE and include checks for A-ROUTE-001, A-ANS-001, A-FLOW-001, A-CURRENT-001, A-PII-001, and A-ACTION-001.

**MCP or ChatGPT app work:**
- For MCP tool changes, apply `../.agents/skills/mcp-tool-contract/SKILL.md`: malformed input and no-evidence states need tests, write/action/export tools need Human-gate and AuditRecord, and structured content must not expose secrets.
- For submission work, apply `../.agents/skills/submission-readiness/SKILL.md`: `npm run verify` is the expected app-side release gate when the ChatGPT app package is present.

---

*Testing analysis: 2026-05-13*
