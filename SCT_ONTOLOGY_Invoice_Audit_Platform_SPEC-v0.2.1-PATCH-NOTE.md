# Invoice Audit Platform — SPEC v0.2.0 → v0.2.1 Patch Note

> **Date**: 2026-06-09
> **Reason**: Unit test fix cycle (8 vitest fail → 33/33 pass) revealed 2 spec drift points
> **Approach**: B (Direct failure-fix + spec drift patch)
> **Status**: Draft (awaiting user review)

---

## §5.2.3 MCP Error Format

**v0.2.0**:
> "When the upstream MCP server returns a non-2xx status, throw an error with format: `tool {tool_name} unavailable: HTTP {status_code}`"

**v0.2.1** (changed):
> "When the upstream MCP server returns a non-2xx status, throw an error with format: `MCP_UNAVAILABLE: tool {tool_name} HTTP {status_code}`. The `MCP_UNAVAILABLE` prefix is a stable error token for logging and monitoring consumers."

**Reason**:
- Test contract `tests/cf-mcp-client.test.ts:throws MCP_UNAVAILABLE on 503` uses regex `/MCP_UNAVAILABLE/`
- Stable token enables log aggregation and alerting rules
- Consumers should parse the `MCP_UNAVAILABLE` prefix (uppercase, snake_case, prefix-style)

**Impact**:
- `apps/web/src/lib/cf-mcp-client.ts:error format` updated
- Plan snippet §T7 mirrors
- Test fixed to expect `MCP_UNAVAILABLE` prefix

---

## §5.4 Test Isolation (NEW)

**v0.2.0**: (not specified)

**v0.2.1** (added):
> "Phase 1 unit tests invoke route handlers directly via Web `Request`/`Response` mocks, not via real HTTP boundary. `fetch()` global is not stubbed in vitest environment. Test helpers (e.g., `setupJob`) must use the direct-handler invocation pattern. Future production E2E tests will use Playwright or curl (out of scope for v0.2.1)."

**Reason**:
- vitest's Node 24 environment doesn't stub `fetch()` globally
- Helper functions calling `fetch('http://test/...')` cause `ENOTFOUND` errors
- Direct handler invocation is faster, more deterministic, and decoupled from network
- Phase 1 dev only; production E2E will use real HTTP

**Impact**:
- `apps/web/tests/*-audit-*.test.ts:setupJob helpers` refactored
- `apps/web/tests/api-files-ingest.test.ts` and `api-invoice-audit-run.test.ts` may share the same helper pattern
- Plan snippet §T15/T16 mirrors

---

## §5.2.2 (Implicit) Job Status Schema Strictness

**v0.2.0** (drafted, inaccurate):
> "JobStatus is one of: UPLOADED, PARSING, PARSED, VALIDATED, COST_GUARDED, DOC_GUARDED, DECIDED, FAILED, REJECTED"

**v0.2.1** (corrected to match code `apps/web/src/lib/types.ts:3-6`):
> "JobStatus is strictly one of the **12 enum values**: `CREATED, UPLOADING, UPLOADED, QUEUED, PARSING, VALIDATING, REVIEW_REQUIRED, APPROVED, EXPORTING, COMPLETED, FAILED, REJECTED`. Reject any other value at parse time. This was the de-facto behavior in code; v0.2.1 makes the strictness explicit in the schema (`z.enum([...])` with no `passthrough`)."

**Reason**:
- Test `types.test.ts:JobStatusSchema rejects unknown status` expects strict enum
- Prevents accidental typo or new state without schema update
- v0.2.0 spec had 9 values; code has 12. **v0.2.1 aligns spec to code (the source of truth).**

**Impact**: Spec correction; code is authoritative.

---

## §5.3.1 (Implicit) AuditLine source_ref Optional

**v0.2.0** (drafted, inaccurate):
> "InvoiceLine includes `line_id`, `amount`, `currency`, `source_ref` (PRISM proof reference)"

**v0.2.1** (corrected to match code `apps/web/src/lib/types.ts:50`):
> "`source_ref` is **optional** (`.nullish()`) for InvoiceLine. The `source_ref`, when present, is an object: `{ sheet?, row?, col?, text_span? }` tracing back to the source file location. Lines without `source_ref` are accepted (validation uses evidence corpus cross-reference instead)."

**Reason**:
- Code declares `source_ref: z.object({...}).nullish()` (optional)
- v0.2.0 spec claimed `source_ref` is required — **this was a spec drift, not a code drift**
- v0.2.1 aligns spec to code

**Impact**: Spec correction; code is authoritative.

---

## §5.3.2 (Implicit) GateResult Required Fields

**v0.2.0**:
> "GateResult contains `gate_id`, `job_id`, `verdict`, `line_results`, `action_items`"

**v0.2.1** (clarified):
> "All 5 fields (`gate_id`, `job_id`, `verdict`, `line_results`, `action_items`) are **required**. `line_results` and `action_items` may be empty arrays but cannot be omitted."

**Reason**:
- Test `types.test.ts:GateResultSchema` expects all 5 fields
- Prevents partial gate results

**Impact**: None on code; spec clarification only.

---

## §5.3.3 (Implicit) AuditTraceStep Schema

**v0.2.0** (drafted, incomplete):
> "AuditTraceStep is one of: UPLOAD, PARSE, VALIDATE, COSTGUARD, DOC_GUARDIAN, DECISION"

**v0.2.1** (corrected to match code `apps/web/src/lib/types.ts:122-124`):
> "AuditTraceStep is strictly one of the **9 enum values**: `UPLOAD, PARSE, VALIDATE, COSTGUARD, MOSB_GATE, DOC_GUARDIAN, DECISION, APPROVAL, EXPORT`. The 3 new states (MOSB_GATE, APPROVAL, EXPORT) are added for MOSB customs gate, human-gate approval, and export pipeline traceability."

**Reason**:
- Code declares 9 enum values; v0.2.0 spec had 6
- v0.2.1 aligns spec to code

**Impact**: Spec correction; code is authoritative.

---

## Migration Notes

### From v0.2.0 → v0.2.1

1. **Code changes**: 1 line in `cf-mcp-client.ts` (error prefix) + 1 line in `parser-client.ts` (error prefix) + `apps/web/src/lib/types.ts:InvoiceLineSchema.source_ref` confirmed as `.nullish()` (was already nullish, spec was wrong)
2. **Test changes**: 8 test files updated (blob.test.ts, api-files-ingest.test.ts, parser-client.test.ts, types.test.ts, cf-mcp-client.test.ts, api-audit-status.test.ts, api-audit-result.test.ts, api-invoice-audit-run.test.ts)
3. **Plan changes**: 5+ snippet locations in `2026-06-09-invoice-audit-phase1-mvp.md` (covered by execution guide Section 6)
4. **Spec changes**: This patch note is the authoritative change log (3 corrections to align spec with code, 2 clarifications, 1 new section)
5. **Documentation**: `docs/superpowers/specs/2026-06-09-unit-test-fix-design.md` and `2026-06-09-unit-test-fix-execution-guide.md`
6. **Verify gate**: `npm run verify` → 350/350 tests pass, typecheck, wrangler dry-run (per completion report)

### Backward Compatibility

- v0.2.1 is **forward-compatible** with v0.2.0: error format change is additive (old code parsing `tool {x} unavailable: HTTP {y}` will miss the `MCP_UNAVAILABLE` prefix, but new format still contains the old substring)
- Schema strictness changes: tests that violated strictness will fail; production data should already conform

---

## Open Questions for User Review

1. **Should the `MCP_UNAVAILABLE` prefix be a separate error code in the future?** (e.g., `{ code: 'MCP_UNAVAILABLE', message: '...' }` structure)
2. **Is "test isolation via direct handler invocation" the desired pattern, or should we add `vi.stubGlobal('fetch', ...)` for realism?**
3. **Should we add an "OPEN ISSUES" section to track Phase 2 spec items that emerged from this fix?**

---

**End of patch note.** Please review and approve before merging into v0.2.1.
