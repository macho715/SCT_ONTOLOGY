---
last_mapped: 2026-05-11
focus: quality
---

# Testing

## Summary

The project has a focused pytest suite around deterministic logistics rules, CLI behavior, and report rendering.
CI also checks lint, coverage, and an offline smoke command.

## Test Framework

- Test runner: `pytest`.
- Coverage: `pytest-cov`.
- Test configuration lives in `pyproject.toml`.
- Test discovery path is `tests`.
- Source import path is `src`.

## Test Files

- `tests/test_core.py` validates the core rule engine.
- `tests/test_agent_app.py` validates CLI and OpenAI SDK wrapper boundaries.
- `tests/test_reporting.py` validates output renderers.

## Core Rule Coverage

`tests/test_core.py` covers:

- BL and HVDC code resolution through `resolve_any_key()`.
- Numeric milestone ordering through `current_stage()`.
- Required document detection through `missing_documents()`.
- Invoice severity and missing evidence logic through `audit_invoice_lines()`.
- DEM/DET late closure and missing DO risk through `port_release_risks()`.
- AGI/DAS M130 block through `shipment_snapshot()`.
- Duplicate identifier failure.
- Unknown milestone failure.
- Zero standard invoice block.
- Negative invoice value failure.
- Non-AED currency failure.

## CLI And Agent Boundary Coverage

`tests/test_agent_app.py` covers:

- Offline snapshot behavior without requiring the OpenAI Agents SDK.
- Not-found lookup shape.
- Tool wrapper outputs for `search_shipment`, `cost_guard`, and `port_release_board`.
- `build_agent()` failure when the SDK is unavailable.
- CLI writing CSV output to a file.
- CLI printing brief ZERO output.

## Reporting Coverage

`tests/test_reporting.py` covers:

- Brief report flags blocked shipment as ZERO.
- CSV output contains risk and invoice rows.
- JSON output preserves valid Unicode JSON.

## CI Gates

`.github/workflows/ci.yml` runs:

- `ruff check src tests`.
- `pytest --cov=hvdc_openai_agent --cov-report=term-missing`.
- `hvdc-agent BL-AUH-002 --offline --format brief`.

## Local Commands

- `PYTHONPATH=src python -m pytest -q`.
- `PYTHONPATH=src python -m pytest --cov=hvdc_openai_agent --cov-report=term-missing`.
- `python -m ruff check src tests`.
- `PYTHONPATH=src python -m hvdc_openai_agent.agent_app BL-AUH-002 --offline --format brief`.

## Gaps To Watch

- Online OpenAI Agents SDK behavior is lightly covered because tests focus on offline deterministic logic.
- No integration test currently performs a real OpenAI API call.
- Coverage threshold is configured at 85 percent in `pyproject.toml`.
