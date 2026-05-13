# Read-only MCP Surface Contract

## Purpose

The read-only MCP surface is the V1 local contract boundary for HVDC ontology tool output.
It wraps the Phase 3 resolver and Phase 4 risk evidence functions in MCP-style tool envelopes.

This contract covers requirements `MCP-01`, `MCP-02`, `MCP-03`, `MCP-04`, `MCP-05`, and `TEST-04`.

This contract is local proof.
It is not Cloudflare deployment proof, OAuth registration proof, or client registration proof.

## Tool Inventory

V1 exposes these read-only tool contracts:

| Tool | Purpose |
| --- | --- |
| `resolve_operational_key` | Resolve HVDC CODE, BL No., BOE No., Invoice No., Package No., PO No., container no., site code, and vendor code. |
| `get_operational_risk_radar` | Return evidence-backed risk cards for a resolved operational key. |
| `get_costguard_evidence_pack` | Return invoice-centered CostGuard evidence review data. |
| `search_evidence_refs` | Search evidence reference metadata without exposing raw source rows. |
| `validate_mcp_output` | Validate the public MCP-style response envelope. |

## Output Envelope

Every tool response must include:

- `toolName`
- `dataStatus`
- `structuredContent`
- `content`
- `evidenceRefs`
- `validation`
- `annotations`
- `privacy`
- `actionBoundary`

`content` is an operator-readable summary.
`structuredContent` carries the deterministic JSON payload.
`evidenceRefs` carries source evidence metadata only.

## Read-only Annotations

Every response must include:

```json
{
  "annotations": {
    "readOnly": true,
    "mutationAllowed": false
  },
  "actionBoundary": {
    "mode": "READ_ONLY_EVIDENCE_LOOKUP",
    "readOnly": true,
    "mutationAllowed": false,
    "requiresHumanGateForAction": true
  }
}
```

## Public Surface Boundary

The V1 MCP surface must not expose:

- raw SPARQL query text
- local Flask endpoints
- local Fuseki endpoints
- ngrok URLs
- local dashboard URLs
- local file paths
- bearer tokens or token-like strings
- direct graph update paths

Local evidence source systems may be summarized as fixture or analysis evidence.
They must not expose local runtime endpoints.

## Future Capability Separation

Future upload, graph mutation, file mutation, approval, payment, dispute, e-mail, and escalation work is outside this V1 surface.

Those future capabilities require:

- explicit scopes
- human gates
- audit records
- rollback design
- separate malformed-input tests
- separate no-evidence tests
- separate secret-redaction tests

## Verification

Phase 5 completion requires:

```powershell
python -m py_compile hvdc_readonly_mcp_surface.py hvdc_operational_risk_radar.py hvdc_any_key_resolver.py hvdc_semantic_adapter.py
python -m pytest test_readonly_mcp_surface.py -v --tb=short
python -m pytest test_operational_risk_radar.py -v --tb=short
python -m pytest test_any_key_resolver.py -v --tb=short
python -m pytest test_semantic_adapter.py -v --tb=short
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-readonly-mcp-surface.ps1
```
