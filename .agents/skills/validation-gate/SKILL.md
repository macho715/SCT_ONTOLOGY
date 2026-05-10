---
name: validation-gate
description: Implement and test SHACL/SPARQL/RAG/Human-gate validation rules for the HVDC ontology answer app.
---

Required gates
1. A-ROUTE-001: CONSOLIDATED-00 mandatory.
2. A-ANS-001: EvidenceSnippet required.
3. A-FLOW-001: Flow Code WHP-only.
4. A-CURRENT-001: current regulation/rate/SOP requires freshness.
5. A-PII-001: phone/email/token must be masked.
6. A-ACTION-001: write/action/export/send requires Human-gate.

Output
- `ValidationFinding[]`
- tests for PASS/WARN/BLOCK/NO_EVIDENCE
- update `docs/QA_REPORT.md`
