# Audit Evidence Boundary

**Phase:** 1
**Requirement:** EVID-04

## Decision

Local CSV/NDJSON evidence proves local file-level audit behavior only.

It does not prove production audit identity, retention, actor model, concurrency, Cloudflare storage, or cross-client traceability.

## Local Evidence Files

| Local item | What it can prove | What it cannot prove |
|---|---|---|
| `artifacts/audit_log.csv` | Local CSV rows exist from a local run. | Production actor identity, retention, or immutable storage. |
| `artifacts/audit.ndjson` | Local append-only style events exist. | Multi-user production audit consistency. |
| `artifacts/audit.ndjson.hash.json` | A local hash was produced for one local file state. | Durable production audit chain or remote tamper resistance. |
| `audit_logger.py` | Local CSV audit behavior and redaction logic. | Cloudflare-side audit storage or OAuth actor binding. |
| `audit_ndjson_and_hash.py` | Local NDJSON append, hash, verify, stats, and rotation behavior. | Production concurrency, identity, retention, or legal audit controls. |

## Production Audit Work Still Needed

Future production audit design must define:

- actor identity source
- OAuth or Access subject mapping
- retention policy
- immutable event IDs
- concurrency model
- D1 or Durable Object audit schema
- R2 artifact retention policy
- redaction and masking policy
- correlation between MCP tool call, evidence ID, and user-visible answer

## Reporting Rule

Do not write "production audit ready" from local CSV/NDJSON evidence.

Allowed wording:

- "local audit file integrity verified"
- "local CSV/NDJSON evidence exists"
- "prototype audit evidence only"

Blocked wording:

- "production audit complete"
- "Cloudflare audit identity verified"
- "retention policy enforced"

## Done Rule

EVID-04 is satisfied only when local audit evidence is clearly separated from future production audit identity and retention.
