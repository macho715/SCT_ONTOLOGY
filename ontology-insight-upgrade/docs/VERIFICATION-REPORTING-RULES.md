# Verification Reporting Rules

**Phase:** 1
**Requirements:** TEST-05, TEST-06

## Decision

Verification reports must separate unit tests, contract tests, live-service checks, manual checks, and artifact checks.

Warnings and skips cannot be reported as PASS.

## Test Classes

| Class | Examples | How to report |
|---|---|---|
| Unit tests | `python -m pytest test_hvdc_api.py -v --tb=short` | PASS only when the command exits 0 and assertions run. |
| Contract tests | Future MCP schema or read-only output checks | PASS only when the contract checker exits 0. |
| Live-service checks | `python test_sparql_direct.py`, `python system_health_check.py`, `smoke-test.ps1`, `full-validation.ps1` | Report separately because local services and ports affect results. |
| Manual checks | Browser, dashboard, or console observation | Report as manual observation, not automated PASS. |
| Artifact checks | Hash checks, marker checks, generated report inspection | Report the exact file and command used. |

## PASS Rule

PASS means every required check ran and succeeded.

Do not report PASS when:

- a command was skipped
- a local service was unavailable
- a warning remains
- a file marker is missing
- only an old generated report was inspected
- Git could not provide reliable evidence

Use these labels instead:

- `PASS`: required checks ran and succeeded
- `BLOCK`: required evidence is missing or failed
- `WARN`: non-blocking issue remains
- `SKIP`: check was intentionally not run
- `NO_EVIDENCE`: no usable evidence exists

## Live-service Rule

TEST-05 is satisfied only when live-service checks are reported separately from unit or contract tests.

Live-service checks include local Flask, local Fuseki, ngrok, dashboard, and bridge probes.

## Warning and Skip Rule

TEST-06 is satisfied only when warnings and skips cannot be reported as PASS.

If a required check is skipped, the final result is not PASS.
