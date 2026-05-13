# Phase 5 Research: Read-only MCP Surface & Release Verification

## Phase

Phase 5: Read-only MCP Surface & Release Verification

## Goal

V1 exposes only read-only MCP tools with structured outputs, contract tests, and a clear separation from future upload, write, and action work.

## Planning Basis

No `CONTEXT.md` exists for this phase.
This research uses the roadmap, requirements, and completed Phase 2 through Phase 4 contracts and implementations.

## Local Findings

### Available foundations from prior phases

- Phase 2 created `hvdc_semantic_adapter.py` and `docs/SEMANTIC-ADAPTER-CONTRACT.md`.
- Phase 2 blocks Flow Code misuse and local prototype object leakage in public output.
- Phase 3 created `hvdc_any_key_resolver.py` and `docs/ANY-KEY-RESOLVER-CONTRACT.md`.
- Phase 3 provides read-only key resolution with confidence, evidence refs, privacy masking, ambiguity, conflict, unsupported-key, and no-evidence states.
- Phase 4 created `hvdc_operational_risk_radar.py` and `docs/OPERATIONAL-RISK-RADAR-CONTRACT.md`.
- Phase 4 provides read-only risk radar and CostGuard evidence pack structures.
- Phase 1 created `docs/PUBLIC-SURFACE-BOUNDARY.md` and `docs/VERIFICATION-REPORTING-RULES.md`.
- Phase 1 classifies local Flask, Fuseki, ngrok, OpenAPI, GPTs Actions, and dashboards as development or migration references only.

### MCP surface needed

Phase 5 should create a local, testable MCP-facing surface before any deployment claim.

Minimum read-only tools:

- `resolve_operational_key`
- `get_operational_risk_radar`
- `get_costguard_evidence_pack`
- `search_evidence_refs`
- `validate_mcp_output`

The implementation should be deterministic and fixture-backed.
It should not start a server, deploy Cloudflare Workers, register OAuth clients, upload files, or expose a public endpoint.

### Structured output requirements

Every tool response should include:

- `toolName`
- `dataStatus`
- `structuredContent`
- `content`
- `evidenceRefs`
- `validation`
- `annotations`
- `privacy`
- `actionBoundary`

The `annotations` and `actionBoundary` blocks must make read-only behavior visible.
Missing evidence should be returned as structured status, not hidden or converted into a forced judgment.

### Release verification needed

Phase 5 must verify:

- malformed input handling
- unsupported or no-evidence input handling
- structured output shape
- evidence references
- read-only annotations
- secret and local path redaction
- no local Flask or Fuseki public exposure
- no raw SPARQL exposure
- no upload, write, OAuth, payment, dispute, approval, email, escalation, or graph mutation path

### Required boundaries

- Do not expose raw SPARQL.
- Do not import or call `hvdc_api.py`, `nlq_query_wrapper_flask.py`, local dashboard launchers, ngrok scripts, or Fuseki deployment paths from the MCP surface.
- Do not implement upload/write/OAuth/action tools in V1.
- Future upload/write/action work must remain documented as deferred, scoped, human-gated, audited, and rollback-tested.
- Do not claim Cloudflare deployment or live ChatGPT/Claude/Cursor registration from this local phase unless that is separately verified in the current session.

## Recommended Implementation Shape

Create:

- `docs/READ-ONLY-MCP-SURFACE-CONTRACT.md`
- `hvdc_readonly_mcp_surface.py`
- `fixtures/mcp_surface/query_resolve_key.json`
- `fixtures/mcp_surface/expected_resolve_key.json`
- `fixtures/mcp_surface/query_risk_radar.json`
- `fixtures/mcp_surface/expected_risk_radar.json`
- `fixtures/mcp_surface/query_costguard_pack.json`
- `fixtures/mcp_surface/expected_costguard_pack.json`
- `fixtures/mcp_surface/query_search_evidence.json`
- `fixtures/mcp_surface/expected_search_evidence.json`
- `fixtures/mcp_surface/query_validate_output.json`
- `fixtures/mcp_surface/expected_validate_output.json`
- `fixtures/mcp_surface/query_malformed_input.json`
- `fixtures/mcp_surface/expected_malformed_input.json`
- `fixtures/mcp_surface/query_secret_redaction.json`
- `fixtures/mcp_surface/expected_secret_redaction.json`
- `test_readonly_mcp_surface.py`
- `scripts/verify-readonly-mcp-surface.ps1`

Update:

- `README.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`

## Risks

- Tool wrappers can accidentally imply public Cloudflare deployment. The docs must say this phase creates the local read-only MCP contract surface, not deployment proof.
- The MCP surface can accidentally leak legacy local API, SPARQL, or Fuseki concepts. Static checks must block those imports and output markers.
- Read-only tools can still imply approval, dispute, payment, or escalation through `nextAction`. Tests must reject those action words.
- Secret redaction can regress when structured outputs combine resolver and radar data. Fixtures must include token-like and path-like inputs.
