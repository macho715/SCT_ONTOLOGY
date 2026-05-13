# Phase 3 Research: Any-key Resolver & Evidence Contract

## Phase

Phase 3: Any-key Resolver & Evidence Contract

## Goal

Users can start from supported operational identifiers and receive matched canonical context with source, confidence, evidence state, and privacy controls.

## Local Findings

### Existing identifier sources

- `hvdc-code-mapping-v2.6.2.json` defines source-specific key columns.
- PKGS uses `HVDC CODE`, `PACKAGE NO`, and `CASE NO`.
- OFCO uses `INVOICE NO`, `PO NO`, and `SUPPLIER`.
- DSV uses `BL NO`, `CONTAINER NO`, and `VESSEL`.
- PAY uses `INVOICE NO`, `PAYMENT REF`, and `AMOUNT`.
- `hvdc-code-extractor.py` already emits `HVDC_CODE_EXTRACTED`, `HVDC_CODE_CONFIDENCE`, `HVDC_CODE_METHOD`, and `HVDC_CODE_SOURCE`.
- `hvdc_one_line.py` already emits `HVDC_CODE`, `EXTRACT_METHOD`, `CONF`, `SOURCE_FILE`, `LOGICAL_SOURCE`, `SHEET_NAME`, and `ROW_INDEX`.

### Existing semantic boundary

- Phase 2 introduced `hvdc_semantic_adapter.py`.
- The adapter returns canonical routing/evidence language and blocks legacy route-as-Flow-Code semantics.
- Phase 3 should reuse the adapter for ambiguous joins and no-evidence responses.
- Phase 3 must not reintroduce `assignedFlowCode`, `extractedFlowCode`, or route lifecycle logic through resolver outputs.

### Existing audit and privacy behavior

- `audit_logger.py` masks common card, SSN, email, password, and API-key patterns.
- `audit_ndjson_and_hash.py` applies similar event sanitization.
- There is no resolver-specific privacy contract yet.
- Resolver outputs need a narrower masking layer for local paths, emails, tokens, account IDs, and raw source rows.

### Existing test patterns

- Phase 2 tests use fixture pairs under `fixtures/semantic_adapter`.
- Phase 2 guardrails use a PowerShell verifier script under `scripts/`.
- Phase 3 should follow the same pattern:
  - fixture input
  - expected normalized output
  - pytest contract tests
  - one guardrail PowerShell script

## Design Decisions

1. Implement the resolver as a pure local module first.
2. Support read-only context lookup only.
3. Return source, confidence, and evidence state with every result.
4. Separate internal raw evidence from user-safe evidence excerpts.
5. Treat ambiguous and conflicting matches as explicit resolver states, not errors.
6. Keep upload, write, OAuth mutation, and remote MCP wiring out of Phase 3.

## Target Resolver States

- `MATCHED`
- `AMBIGUOUS`
- `NOT_FOUND`
- `CONFLICTING_EVIDENCE`
- `UNSUPPORTED_KEY`
- `MASKED`

## Target Identifier Schemes

- `HVDC_CODE`
- `PACKAGE_NO`
- `CASE_NO`
- `BL_NO`
- `CONTAINER_NO`
- `INVOICE_NO`
- `PO_NO`
- `BOE_NO`
- `DO_NO`
- `SITE_CODE`
- `VENDOR_CODE`

## Evidence Output Contract

Every resolver response should include:

- `query`
- `detectedScheme`
- `normalizedKey`
- `status`
- `confidence`
- `canonicalContext`
- `sourceFields`
- `evidenceRefs`
- `evidenceState`
- `privacy`
- `nextAction`

## Risks

- Identifier formats overlap. The resolver must expose ambiguity instead of choosing silently.
- Raw source rows can leak local paths or personal data. The resolver must return masked excerpts by default.
- Source files use mixed column names. The resolver needs deterministic normalization.
- Phase 3 depends on Phase 2 semantics. Tests must confirm resolver output still uses canonical route/evidence language.

## Recommended Implementation Shape

Create:

- `docs/ANY-KEY-RESOLVER-CONTRACT.md`
- `hvdc_any_key_resolver.py`
- `fixtures/resolver/resolver_index.json`
- `fixtures/resolver/*.json`
- `test_any_key_resolver.py`
- `scripts/verify-any-key-resolver.ps1`

Update:

- `README.md` or existing operator docs only if the repo already exposes a similar runtime guide.
- `PRIVACY.md` only for resolver-specific user-visible masking behavior.
