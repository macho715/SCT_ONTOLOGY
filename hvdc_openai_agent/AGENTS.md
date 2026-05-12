<!-- GSD:project-start source:PROJECT.md -->
## Project

**HVDC OpenAI Agent SCT_ONTOLOGY Integration**

This project turns the existing `hvdc_openai_agent` Python rule engine into a support layer for the SCT_ONTOLOGY `ask_hvdc_ontology` flow.
The current Python package already resolves shipment identifiers, checks port-release and cost risks, and blocks AGI/DAS M130 closure when MOSB chain evidence is missing.
The next milestone integrates those deterministic rule results into the ontology-grounded answer path without replacing corpus evidence.

**Core Value:** `ask_hvdc_ontology` must answer HVDC logistics questions with corpus evidence first, then use the Python shipment rule engine as a secondary validation signal for BL, invoice, and AGI/DAS risk checks.

### Constraints

- **Evidence priority**: Corpus evidence is primary — the Python rule result cannot become unsupported business truth.
- **Tool contract**: `ask_hvdc_ontology` remains data-only — it must not attach `openai/outputTemplate`, `_meta.ui.resourceUri`, or `structuredContent.ui`.
- **Data maturity**: `data/sample_shipments.json` has only two sample shipments — it can support v1 validation behavior but not production coverage claims.
- **Safety**: Human gate conditions remain mandatory for high-value invoices, BLOCK or CRITICAL results, AGI/DAS missing chain evidence, and missing closure documents.
- **Testing**: Offline deterministic tests remain the default CI path — real API calls are out of scope for normal verification.
- **Security**: Planning docs and generated reports must not include real secrets, PII, private URLs, or internal commercial terms.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Summary
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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

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
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Summary
## Layers
## Entry Points
- Console script: `hvdc-agent` from `pyproject.toml`.
- Module entry point: `python -m hvdc_openai_agent.agent_app`.
- Offline execution path: `main()` -> `deterministic_snapshot()` -> `_snapshot_for_key()` -> `shipment_snapshot()`.
- Online execution path: `main()` -> `run_agent()` -> `Runner.run(build_agent(), question)`.
## Domain Model
- `MilestoneEvent`
- `Document`
- `InvoiceLine`
- `ShipmentUnit`
- `RuleResult`
## Core Data Flow
## Rule Areas
- Any-key resolution: `resolve_any_key()`.
- Milestone ordering: `MILESTONE_ORDER` and `milestone_rank()`.
- Missing document checks: `missing_documents()`.
- Port release and DEM/DET risk: `port_release_risks()`.
- AGI/DAS MOSB gate: `agi_das_gate_risk()`.
- COST-GUARD invoice audit: `audit_invoice_lines()`.
## Failure Model
- Unknown milestone code raises `DataValidationError`.
- Duplicate identifiers raise `DataValidationError`.
- Non-AED invoice data raises `DataValidationError`.
- Online mode without SDK raises a clear `RuntimeError`.
- Offline not-found lookup returns `{"found": False, ...}` instead of throwing.
## Important Boundary
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
