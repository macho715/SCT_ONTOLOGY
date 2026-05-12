---
last_mapped: 2026-05-11
focus: quality
---

# Conventions

## Python Style

- The code uses `from __future__ import annotations`.
- Type hints are used throughout public and internal functions.
- Domain records use frozen dataclasses in `src/hvdc_openai_agent/core.py`.
- Enum values use `StrEnum` for severity strings.
- Money calculations use `Decimal`, not float arithmetic.

## Formatting And Linting

- Ruff is configured in `pyproject.toml`.
- Line length is `120`.
- Target Python version is `py311`.
- Ruff lint rules include `E`, `F`, `I`, `UP`, `B`, and `SIM`.
- `Makefile` exposes `lint` and `format` targets.

## Error Handling

- Data trust failures use `DataValidationError`.
- OpenAI SDK absence is handled at import time in `src/hvdc_openai_agent/agent_app.py`.
- Online mode raises a clear `RuntimeError` when SDK components are unavailable.
- Offline lookup miss returns a structured ZERO-style result instead of crashing.

## Rule Result Shape

- Rule severity values are defined in `Severity`.
- `RuleResult.as_dict()` normalizes rule output to dictionaries.
- Rule output includes `severity`, `rule`, `detail`, `evidence_refs`, and `human_gate`.
- Invoice audit output includes line amount fields, delta fields, evidence refs, and checks.

## Domain Conventions

- Milestone ordering must use `MILESTONE_ORDER`, not string comparison.
- `normalize_key()` uppercases and normalizes whitespace for identifier matching.
- `money()` quantizes AED values to two decimals with `ROUND_HALF_UP`.
- `pct()` quantizes percentages to two decimals.

## CLI Conventions

- `--offline` selects deterministic local mode.
- `--data` allows an alternate shipment JSON path.
- `--now` makes DEM/DET checks reproducible.
- `--format` supports `json`, `brief`, and `csv`.
- `--output` writes offline output to a file.

## Test Conventions

- Tests are behavior-focused and use descriptive names.
- Tests use local sample JSON from `data/sample_shipments.json`.
- Tests use fixed timestamps for DEM/DET behavior when needed.
- `pytest` is configured with `pythonpath = ["src"]`.

## Documentation Conventions

- README examples show both offline deterministic mode and online OpenAI SDK mode.
- Validation docs separate local gates, human gates, and ZERO criteria.
- Review logs capture both the issue and the verification command.
