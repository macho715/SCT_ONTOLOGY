---
name: privacy-redactor
description: Audit and improve PII/NDA redaction across HVDC ChatGPT App UI, logs, tests, and reports.
---

Scope
- Email addresses
- Phone numbers
- Tokens/secrets
- Private links
- Raw commercial rates/contracts

Workflow
1. Check `server/src/redact.ts` patterns.
2. Check all `content`, `structuredContent`, `_meta`, logs, README examples, and tests.
3. Add fixtures for email/phone/token masking.
4. Ensure `out/audit.jsonl` stores only hashes, not raw prompts.

Output
- Redaction diff
- PII test cases
- QA note with leakage count
