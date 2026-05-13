# Phase 1 Research: Source Hygiene & Read-only Boundary

**Phase:** 1
**Name:** Source Hygiene & Read-only Boundary
**Created:** 2026-05-13
**Mode:** Inline GSD research because Codex subagent spawning was not requested for this turn.
**Context status:** No `CONTEXT.md` exists for this phase. This research uses roadmap, requirements, project research, and codebase maps only.

## Research Question

What needs to be true before implementation evidence can be trusted?

## Inputs Read

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/research/SUMMARY.md`
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`
- Current repository file inventory from `rg --files`
- Current nested Git probe from `git status --short`

## Findings

### 1. Git evidence is not usable yet

The nested repository fails `git status --short` with:

```text
fatal: bad object HEAD
```

This means completion evidence cannot depend on branch, commit, diff, or staged-file state inside this folder.

Recommended Phase 1 decision:

- Use `file-hash-only` evidence until the nested repo is repaired or replaced by a clean clone.
- Record exact file hashes for Phase 1 outputs.
- Do not claim Git-based completion from this nested repository.

### 2. Source and generated files are mixed

The workspace contains active source, generated runtime files, local logs, backups, third-party Fuseki internals, sample spreadsheets, patch files, and planning artifacts in the same tree.

Important observed examples:

- Source or maintained logic: `hvdc_api.py`, `hvdc_rules.py`, `audit_logger.py`, `audit_ndjson_and_hash.py`, `queries/*.rq`, `scripts/*.ps1`.
- Generated/runtime artifacts: `artifacts/audit_log.csv`, `artifacts/audit.ndjson`, `artifacts/health_report.json`, `artifacts/integration_test_results.json`, `logs/*.log`, `__pycache__/*.pyc`.
- Backup or historical artifacts: `backup/pre_v37_upgrade/**`, `upgrade_v37.ps1`, `HVDC_UPGRADE_SUMMARY.md`, `*.patch`.
- Bundled third-party runtime: `fuseki/apache-jena-fuseki-4.10.0/**`.
- Local fixtures that need explicit status: `sample_data/*.xlsx`, root `*.ttl`, `test_*.json`.

Recommended Phase 1 decision:

- Create a source inventory that categorizes these paths.
- Add a `.gitignore` policy for generated outputs and local runtime state.
- Do not automatically ignore curated fixtures until each fixture is explicitly promoted or marked runtime-only.

### 3. Legacy public surfaces must be marked as non-production

The project direction is Cloudflare-hosted MCP. Existing local surfaces are useful for staging and migration, but they should not be presented as V1 production surfaces.

Observed local or legacy surfaces:

- `hvdc_api.py` Flask API on local port `5002`.
- `nlq_query_wrapper_flask.py` Flask wrapper on local port `5010`.
- Fuseki at `http://localhost:3030/hvdc`.
- `openapi.yaml` and `openapi.updated.yaml` for GPTs Actions.
- `gpts_oneclick.ps1`, `ngrok_setup.ps1`, `HVDC_GPTS_ACTIONS_GUIDE.md`, `HVDC_GPTS_ONECLICK_GUIDE.md`.
- Local dashboard HTML and PowerShell launchers.

Recommended Phase 1 decision:

- Add a public-surface boundary document.
- Add visible "development or migration reference only" markers to GPTs/ngrok/OpenAPI assets.
- Keep Cloudflare MCP as the only V1 production public direction.

### 4. Local audit evidence is useful but not production audit identity

Current audit evidence is file-based:

- `artifacts/audit_log.csv`
- `artifacts/audit.ndjson`
- `artifacts/audit.ndjson.hash.json`
- `audit_logger.py`
- `audit_ndjson_and_hash.py`

This proves local audit/hash behavior. It does not prove production actor identity, retention, concurrency, or Cloudflare-side audit storage.

Recommended Phase 1 decision:

- Document the difference between local CSV/NDJSON evidence and future production audit.
- Do not claim production audit readiness from local file hashes alone.

### 5. Verification language must separate test classes

The test map shows a mix of deterministic tests and live-service checks.

Examples:

- Unit/API local tests: `python -m pytest test_hvdc_api.py -v --tb=short`.
- Mocked gateway tests: `python test_gateway_integration.py`.
- Live-service checks: `python test_sparql_direct.py`, `python system_health_check.py`, `smoke-test.ps1`, `full-validation.ps1`.
- Audit integrity checks: `python audit_ndjson_and_hash.py --write-hash` and `python audit_ndjson_and_hash.py --verify`.

Recommended Phase 1 decision:

- Create a verification reporting rule.
- Warnings, skips, partial probes, missing local services, and outdated generated reports must not be reported as PASS.
- Live-service checks must be reported separately from unit or contract checks.

## Phase 1 Plan Shape

Use one executable plan:

- It is safer than multiple parallel plans because the files are cross-linked and the Git evidence mode affects every task.
- It can still group internal work into clear tasks: inventory, Git mode, dev-only surfaces, audit boundary, verification language, and final self-check.

## ASSUMPTIONS

- `CONTEXT.md` is absent by user-approved continuation. Phase 1 will use requirements and existing research only.
- The selected fallback for Phase 1 is `file-hash-only` until Git is repaired or a clean clone exists.
- Phase 1 is documentation and guardrail work. It must not expose upload, write, graph mutation, approval, dispute, payment, email, or escalation flows.

## Validation Strategy

Phase 1 completion should require:

1. Required artifacts exist.
2. Each Phase 1 requirement ID appears in the plan and summary.
3. Dev-only markers exist in GPTs/ngrok/OpenAPI assets.
4. Audit boundary text explicitly separates local CSV/NDJSON from production audit identity and retention.
5. Verification rules explicitly separate unit, contract, and live-service checks.
6. Git evidence is reported as broken or repaired, not assumed.
7. SHA-256 hashes are generated for new Phase 1 evidence files because Git is unavailable.

## RESEARCH COMPLETE

This research is sufficient to create the Phase 1 execution plan.
