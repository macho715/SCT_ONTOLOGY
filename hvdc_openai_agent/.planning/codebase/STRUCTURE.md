---
last_mapped: 2026-05-11
focus: arch
---

# Structure

## Root Files

- `README.md` explains product purpose, install, execution, tests, schema, and fail-safe behavior.
- `pyproject.toml` defines packaging, dependencies, pytest, coverage, and ruff configuration.
- `Makefile` provides local test, coverage, lint, format, offline, and clean commands.
- `.env.example` documents environment variable placeholders.
- `MANIFEST.json` records package files and hashes.

## Source Layout

- `src/hvdc_openai_agent/__init__.py` marks the package.
- `src/hvdc_openai_agent/core.py` contains dataclasses, data validation, rule evaluation, and snapshot assembly.
- `src/hvdc_openai_agent/agent_app.py` contains CLI parsing, OpenAI Agents SDK wrapping, tool definitions, and offline execution.
- `src/hvdc_openai_agent/reporting.py` contains brief, JSON, and CSV renderers.

## Test Layout

- `tests/test_core.py` covers data loading, any-key resolution, milestone order, missing documents, cost guard, DEM/DET, AGI/DAS, and validation failures.
- `tests/test_agent_app.py` covers offline snapshot behavior, SDK-missing behavior, tool wrappers, and CLI output file writing.
- `tests/test_reporting.py` covers brief, CSV, and JSON renderers.

## Data And Reports

- `data/sample_shipments.json` is the local sample dataset.
- `reports/final_validation.txt` records final validation output.
- `reports/sample_bl_auh_002.json` is a JSON sample output.
- `reports/sample_bl_auh_002.txt` is a brief text sample output.
- `reports/sample_bl_auh_002.csv` is a CSV sample output.

## Documentation

- `docs/VALIDATION.md` defines validation goals, local gates, human gate conditions, and ZERO conditions.
- `docs/OFFICIAL_OPENAI_USAGE.md` describes how the project uses the OpenAI Agents SDK.
- `docs/REVIEW_PATCH_LOG.md` records review findings, fixes, and final commands from prior hardening work.

## Automation

- `.github/workflows/ci.yml` runs tests, lint, coverage, and offline smoke checks on GitHub Actions.

## Naming Patterns

- Domain functions use direct verbs such as `resolve_any_key`, `missing_documents`, `port_release_risks`, and `audit_invoice_lines`.
- Test names describe expected behavior in full sentences.
- Sample shipment IDs use `SHP-0001`, `SHP-0002`.
- Milestone codes use `M90`, `M91`, `M92`, `M100`, `M115`, `M116`, `M117`, and `M130`.

## Top-Level Folder Policy

The current top-level folders are `.github`, `data`, `docs`, `reports`, `src`, `tests`, and `.planning`.
New top-level folders should only be added when they represent a real new project concern.
