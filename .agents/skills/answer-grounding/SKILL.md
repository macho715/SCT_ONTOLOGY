---
name: answer-grounding
description: Build and test ontology-grounded answer flows. Trigger when editing EvidenceSnippet, GroundedAnswer, ZERO states, or hallucination guard tests.
---

Workflow
1. Load CONSOLIDATED-00 as the canonical semantic spine.
2. Identify target extension documents from user intent.
3. Require EvidenceSnippet coverage for factual claims.
4. Separate operational truth from evidence-only sources.
5. Run validation: source coverage, master spine, Flow Code boundary, currentness, Human-gate.
6. Return PASS/WARN/BLOCK/INFO/NO_EVIDENCE and UI payload.

Failure cases
- No EvidenceSnippet -> NO_EVIDENCE.
- No CONSOLIDATED-00 -> BLOCK.
- AGI/DAS M130 closure without MOSB/LCT chain evidence -> BLOCK.
- Flow Code used outside WHP -> semantic warning/block.
- PII in output -> redact and retest.
