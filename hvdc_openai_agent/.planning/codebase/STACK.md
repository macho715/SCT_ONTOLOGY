---
last_mapped: 2026-05-11
focus: tech
---

# Stack

## Summary

This project is a Python 3.11+ command-line MVP for HVDC logistics controls.
It exposes deterministic offline rule checks and an optional OpenAI Agents SDK online mode.

## Language And Runtime

- Primary language: Python.
- Required Python version: `>=3.11`, declared in `pyproject.toml`.
- Package source lives under `src/hvdc_openai_agent/`.
- Tests live under `tests/`.
- The CLI entry point is `hvdc-agent`, mapped to `hvdc_openai_agent.agent_app:main` in `pyproject.toml`.

## Packaging

- Build backend: `hatchling>=1.25`.
- Wheel package path: `src/hvdc_openai_agent`.
- Project name: `hvdc-openai-agent`.
- Current declared version: `0.2.0`.
- Release manifest exists at `MANIFEST.json` and lists file hashes for the packaged artifact.

## Runtime Dependencies

- `openai-agents>=0.3.0` for optional online agent execution.
- `pydantic>=2.0` is declared as a runtime dependency.
- The current source does not define Pydantic models; the core data model uses Python dataclasses in `src/hvdc_openai_agent/core.py`.

## Development Dependencies

- `pytest>=8.0` for tests.
- `pytest-cov>=5.0` for coverage.
- `ruff>=0.8` for lint and formatting.

## Configuration

- `OPENAI_API_KEY` is required only for online OpenAI Agents SDK mode.
- `OPENAI_MODEL` controls the model name and defaults to `gpt-5.4-mini` in `src/hvdc_openai_agent/agent_app.py`.
- `.env.example` documents local environment variables.
- Default sample data path is `data/sample_shipments.json`.

## Commands

- Test: `PYTHONPATH=src python -m pytest -q`.
- Coverage: `PYTHONPATH=src python -m pytest --cov=hvdc_openai_agent --cov-report=term-missing`.
- Lint: `python -m ruff check src tests`.
- Format: `python -m ruff format src tests`.
- Offline smoke: `PYTHONPATH=src python -m hvdc_openai_agent.agent_app BL-AUH-002 --offline --format brief`.

## CI

- GitHub Actions workflow: `.github/workflows/ci.yml`.
- CI runs on Python `3.11` and `3.12`.
- CI installs with `pip install -e '.[dev]'`.
- CI runs `ruff check src tests`, coverage tests, and an offline CLI smoke check.
