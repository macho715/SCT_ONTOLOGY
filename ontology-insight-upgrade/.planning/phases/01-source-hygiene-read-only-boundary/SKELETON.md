# Walking Skeleton: HVDC Ontology Insight Evidence Boundary

**Phase:** 1
**Generated:** 2026-05-13
**Mode:** MVP evidence skeleton

## Capability Proven End-to-End

An implementer can start from the current mixed local workspace, classify what is source versus generated state, see that nested Git evidence is unavailable, and run a deterministic hygiene check before any production MCP implementation work begins.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Public production direction | Cloudflare MCP only | V1 must avoid exposing local Flask, Fuseki, ngrok, GPTs Actions, or raw OpenAPI as production surfaces. |
| Local prototype role | Development and staging workbench | Existing Python, Fuseki, dashboards, and audit files remain useful for analysis and fixtures. |
| Git evidence mode | File-hash-only until repair | Nested Git currently fails with `fatal: bad object HEAD`, so file hashes are more honest than Git diffs. |
| Audit evidence model | Local CSV/NDJSON is prototype evidence | File hashes prove local integrity only, not production actor identity, retention, concurrency, or Cloudflare audit storage. |
| Verification language | Unit, contract, live-service, and manual checks are separate | Warnings, skips, and unavailable live services must not become PASS claims. |
| Phase 1 implementation style | Documentation plus deterministic self-check | Runtime MCP implementation starts after the boundary is clear. |

## Stack Touched in Phase 1

- [ ] Source inventory and generated-artifact boundary.
- [ ] Git evidence fallback decision.
- [ ] Dev-only markers for GPTs/ngrok/OpenAPI/local service surfaces.
- [ ] Audit evidence boundary.
- [ ] Verification reporting policy.
- [ ] Deterministic hygiene check script.

## Out of Scope

- Cloudflare Worker implementation.
- MCP tool implementation.
- OAuth, upload, write, commit, approval, or rollback tools.
- Direct Fuseki graph mutation from MCP.
- Production audit identity or retention implementation.
- Dashboard rewrite.

## Subsequent Slice Plan

- Phase 2: Map local prototype outputs into canonical HVDC ontology objects and block Flow Code misuse.
- Phase 3: Resolve operational keys into evidence-backed canonical context.
- Phase 4: Build the read-only operational risk and CostGuard evidence view.
- Phase 5: Expose and verify read-only MCP tools.
