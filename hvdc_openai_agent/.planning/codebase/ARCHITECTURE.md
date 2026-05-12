---
last_mapped: 2026-05-11
focus: arch
---

# Architecture

## Summary

The codebase is a small layered Python CLI application.
The core rule engine is deterministic and independent from the optional OpenAI Agents SDK wrapper.

## Layers

1. Data loading and validation in `src/hvdc_openai_agent/core.py`.
2. Deterministic logistics rules in `src/hvdc_openai_agent/core.py`.
3. Agent and CLI orchestration in `src/hvdc_openai_agent/agent_app.py`.
4. Output rendering in `src/hvdc_openai_agent/reporting.py`.
5. Tests in `tests/`.

## Entry Points

- Console script: `hvdc-agent` from `pyproject.toml`.
- Module entry point: `python -m hvdc_openai_agent.agent_app`.
- Offline execution path: `main()` -> `deterministic_snapshot()` -> `_snapshot_for_key()` -> `shipment_snapshot()`.
- Online execution path: `main()` -> `run_agent()` -> `Runner.run(build_agent(), question)`.

## Domain Model

`src/hvdc_openai_agent/core.py` defines immutable dataclasses:

- `MilestoneEvent`
- `Document`
- `InvoiceLine`
- `ShipmentUnit`
- `RuleResult`

The domain model is intentionally simple and file-backed.
It does not depend on the OpenAI SDK.

## Core Data Flow

1. Load JSON from `data/sample_shipments.json`.
2. Convert raw rows into `ShipmentUnit` objects.
3. Validate milestone codes, currency, invoice values, and identifier uniqueness.
4. Resolve a user-provided key through `resolve_any_key()`.
5. Build a `shipment_snapshot()` with current stage, missing documents, risks, invoice audit, exposure, and human gate status.
6. Render the result as JSON, brief text, CSV, or online natural-language answer.

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

The deterministic rule engine is the source of truth.
The OpenAI agent layer should call tools before answering and must not invent shipment status, tariff, HS, or regulatory facts.
