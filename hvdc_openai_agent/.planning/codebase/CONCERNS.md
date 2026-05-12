---
last_mapped: 2026-05-11
focus: concerns
---

# Concerns

## Summary

The codebase is compact and testable, but it is still a local MVP.
The largest risks are sample-data scope, online SDK coverage, and the gap between deterministic rule outputs and real operational evidence sources.

## Sample Data Boundary

- Current data source is `data/sample_shipments.json`.
- The data contains two sample shipments.
- This is enough for deterministic demos but not enough to prove production coverage.
- Any roadmap should preserve the offline safety path while adding broader fixture coverage.

## Evidence Scope

- `InvoiceLine.evidence_refs` and milestone `evidence_ref` fields are references only.
- The project does not load or validate external evidence documents.
- `docs/VALIDATION.md` correctly warns that missing tariff, regulatory, OOG, lifting, stowage, safety, dimension, weight, COG, or lashing evidence should produce ZERO-style behavior.

## Online Mode Coverage

- Online execution depends on the OpenAI Agents SDK and `OPENAI_API_KEY`.
- Current tests avoid real API calls.
- This is appropriate for CI safety, but future online features need mock-based or contract-based tests around tool invocation and answer constraints.

## Domain Rule Risks

- Milestone ordering is now numeric, which avoids the prior string comparison issue recorded in `docs/REVIEW_PATCH_LOG.md`.
- AGI/DAS gate checks require missing M115/M116/M117 when M130 exists.
- The rule currently checks milestone timestamps, not independent document chain evidence.
- If future business rules require exception approval evidence, the data model must represent that explicitly.

## Security And Privacy

- `.env.example` must remain placeholder-only.
- Generated reports should not expose PII, tokens, private URLs, or internal commercial terms.
- `MANIFEST.json` hashes files but does not replace secret scanning.
- Before committing planning docs, scan for token-like strings.

## Portability

- `Makefile` uses Unix-style `rm -rf` in the `clean` target.
- Windows users can still run Python and pytest commands directly.
- README install examples use Unix shell activation and `export`; Windows equivalents are not shown.

## Maintainability

- `src/hvdc_openai_agent/core.py` contains both data model and all rule logic.
- This is fine for the current size.
- If rules expand, split by concern before the file becomes difficult to audit.

## Planning Risk

- New GSD project planning should treat the existing rule engine as validated baseline behavior.
- Planned work should not silently replace deterministic offline checks with LLM-only judgment.
