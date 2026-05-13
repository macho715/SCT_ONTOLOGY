# Source Hygiene

**Phase:** 1
**Requirements:** HYGIENE-01, HYGIENE-02
**Evidence mode:** file-hash-only

## Purpose

This document separates maintained source from generated runtime state before any production MCP implementation work begins.

The nested Git repository is currently not usable as evidence. `git status --short` fails with:

```text
fatal: bad object HEAD
```

Until this repository is repaired or replaced by a clean clone, Phase 1 evidence must use `file-hash-only` proof.

Use this command for file evidence:

```powershell
Get-FileHash -Algorithm SHA256 <path>
```

## Classification

| Class | Paths | Source status | Rule |
|---|---|---|---|
| Maintained Python source | `hvdc_api.py`, `hvdc_rules.py`, `audit_logger.py`, `audit_ndjson_and_hash.py`, `hvdc_gateway_client.py`, `nlq_to_sparql.py` | Source | Review and patch deliberately. |
| Maintained query source | `queries/*.rq` | Source | Keep as SPARQL query fixtures or templates. |
| Maintained automation | `scripts/*.ps1`, top-level validation scripts | Source | Keep scripts reviewable and syntax-checked. |
| Generated runtime artifacts | `artifacts/audit_log.csv`, `artifacts/audit.ndjson`, `artifacts/health_report.json`, `artifacts/integration_test_results.json` | Not source | Generated runtime artifacts must not be used as current truth without rerun evidence. |
| Logs | `logs/*.log`, `logs/*.csv` | Not source | Treat as local run output. |
| Python cache | `__pycache__/*.pyc` | Not source | Ignore. |
| Backups | `backup/pre_v37_upgrade/**` | Historical evidence | Do not edit as active implementation. |
| Patch files | `add-audit-workflow.patch`, `hvdc_upgrade.patch` | Patch artifacts | Apply only after review; do not treat as active code. |
| Bundled third-party runtime | `fuseki/apache-jena-fuseki-4.10.0/**` | Third-party runtime | Do not refactor as project source. |
| Curated fixtures | `sample_data/*.xlsx`, root `*.ttl`, `test_*.json` | Fixture candidate | Keep visible until each fixture is explicitly promoted or marked runtime-only. |
| Planning artifacts | `.planning/**` | Planning evidence | Use for GSD workflow state and decisions. |

## Ignore Policy

`.gitignore` excludes generated runtime outputs and local Fuseki runtime state.

It intentionally does not ignore root `*.ttl`, `queries/*.rq`, or `sample_data/*.xlsx` because those may be curated fixtures. A future cleanup may move or classify them, but Phase 1 does not hide them silently.

## Git Evidence Boundary

Git metadata inside this nested folder cannot prove changed files, commits, or branches right now.

Current diagnostic:

```powershell
git status --short
```

Current result:

```text
fatal: bad object HEAD
```

Decision:

- Use `file-hash-only` evidence for Phase 1.
- Do not claim Git commit evidence from this nested repository.
- Repair Git or reclone before relying on branch, diff, commit, or staged-file evidence.

## Done Rule

HYGIENE-01 is satisfied only when source, generated artifacts, logs, backups, runtime state, and curated fixtures are separated.

HYGIENE-02 is satisfied only when the broken Git state and selected fallback path are visible to users.
