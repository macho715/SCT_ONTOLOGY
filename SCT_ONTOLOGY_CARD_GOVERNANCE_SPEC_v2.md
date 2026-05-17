---
title: "SCT_ONTOLOGY CARD Governance Spec v2.0"
type: "contract-spec"
domain: "hvdc-logistics-ontology-card"
version: "2.0"
date: "2026-05-18"
timezone: "Asia/Dubai"
status: "DRAFT_FOR_REVIEW"
source_spec: "SCT_ONTOLOGY_CARD_GOVERNANCE_PATCH_V2.md"
owner: "HVDC Logistics Ontology Working Set"
spine_ref: "CONSOLIDATED-00-master-ontology.md"
---

# SCT_ONTOLOGY CARD Governance Spec v2.0

## 1. Summary

This Spec defines the contract for SCT_ONTOLOGY CARD governance behavior.

The system must separate system/card diagnostic prompts from operational logistics actions. A system QA request must not trigger invoice approval, external email send, customs execution, shipment execution, or write-back behavior unless an operational object, explicit action intent, and approval gate are present.

The primary objective is to make `IntentRouter -> RulePackSelector -> DecisionCard -> ActionGate -> Renderer` testable, traceable, and safe for ChatGPT/App runtime use.

### 1.1 Scope

In scope:

- Intent classification for system QA versus operational logistics requests.
- Rulepack selection gates by intent, domain, and object evidence.
- Decision Card verdict model and blocked action representation.
- Evidence ranking priority.
- Entity resolver stopword behavior.
- Action planning and action gate safety.
- Renderer tab contract.
- PII/NDA display contract.
- Acceptance scenarios and measurable success criteria.

### 1.2 Non-goals

Out of scope:

- Changing `CONSOLIDATED-00-master-ontology.md` master semantics.
- Implementing actual Foundry write-back.
- Sending external email automatically.
- Approving customs, HS, marine execution, invoice, or warehouse mutation without human gate.
- Replacing route semantics with Flow Code.

### 1.3 Canonical boundaries

| Boundary | Required contract |
|---|---|
| Master spine | `CONSOLIDATED-00-master-ontology.md` remains the semantic authority. |
| Flow Code | `WarehouseHandlingProfile.confirmedFlowCode` only. |
| Routing | Use `ShipmentRoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`. |
| MOSB | Model as `OffshoreStagingNode` / `MarineInterfaceNode`, not Warehouse. |
| Communication | Evidence layer only unless explicit action gate is approved. |
| Cost | `CostGuardResult` owns cost verdicts; route/WH evidence is read-only. |
| Document/OCR | Evidence only; no transaction mutation. |

## 2. User Scenarios & Testing

### US-001: System diagnostic prompt isolation

Given a user asks to inspect or patch CARD, router, validation, rulepack, ontology response, or rendering behavior,
When the request is classified,
Then the system must assign a `SYSTEM_QA` domain intent and must not classify it as `EMAIL_DRAFT`, `EXTERNAL_SEND`, `COST_APPROVAL`, or `SHIPMENT_EXECUTION`.

Test mapping: `T-001`, `T-002`

### US-002: Operational cost review requires object evidence

Given a user mentions cost, invoice, DEM/DET, or CostGuard only as part of a system QA prompt,
When rulepacks are selected,
Then `COST_RULEPACK` must be skipped unless an invoice/rate/tariff object and approval or audit intent are present.

Test mapping: `T-002`, `T-003`

### US-003: Email draft boundary

Given a user asks for a reply or email draft,
When recipient, communication purpose, and draft intent are present,
Then the system may produce `DRAFT_READY` output but must not externally send without approval.

Test mapping: `T-006`, `T-007`

### US-004: Flow Code boundary enforcement

Given a user asks to use Flow Code as route KPI, customs stage, invoice bucket, or shipment routing classification,
When the ontology rules are evaluated,
Then the system must return a blocking verdict and identify `WarehouseHandlingProfile.confirmedFlowCode` as the only valid owner.

Test mapping: `T-008`

### US-005: Renderer operator clarity

Given a Decision Card payload has verdict, blocked rules, evidence, validation trace, entities, actions, and security status,
When the card renders,
Then the renderer must expose Decision, Evidence, Validation, Entities, Actions, Trace, and Security views without hiding blockedBy or nextAction.

Test mapping: `T-009`

### US-006: Write-back safety

Given any mutation, external send, approval, invoice decision, customs decision, marine execution decision, or WH Flow Code assignment is proposed,
When ActionGate evaluates the request,
Then the system must enforce `DRY_RUN -> APPROVAL -> WRITE -> AUDIT_RECORD` and block unauthorized write-back.

Test mapping: `T-010`

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Verification |
|---|---|---:|---|
| FR-001 | The system must support `SYSTEM_DIAGNOSTIC`, `ONTOLOGY_PATCH_REVIEW`, `CARD_RENDERING_AUDIT`, `RULEPACK_GAP_ANALYSIS`, `ROUTER_QA`, `EVIDENCE_QA`, `SCHEMA_BOUNDARY_REVIEW`, and `VALIDATION_POLICY_REVIEW` intents. | P0 | Intent router unit tests |
| FR-002 | Diagnostic prompts must not be classified as `EMAIL_DRAFT`, `EXTERNAL_SEND`, `COST_APPROVAL`, or `SHIPMENT_EXECUTION`. | P0 | Negative intent tests |
| FR-003 | Operational rulepacks must require intent-domain-object alignment before firing. | P0 | RulePackSelector tests |
| FR-004 | `COST_RULEPACK` must require invoice/rate/tariff/DEMDET object evidence plus cost approval or audit intent. | P0 | Cost rulepack gate tests |
| FR-005 | `COMM_RULEPACK` must require message/thread/recipient/draft context before firing. | P0 | Communication rulepack gate tests |
| FR-006 | Decision verdicts must include `DIAGNOSTIC`, `PASS`, `PASS_WITH_FINDINGS`, `DRAFT_READY`, `AMBER`, `NEEDS_INPUT`, `PENDING_APPROVAL`, `DRY_RUN_ONLY`, `BLOCK`, and `ZERO`. | P0 | Decision Card contract tests |
| FR-007 | Flow Code must be valid only as `WarehouseHandlingProfile.confirmedFlowCode`. | P0 | Flow Code boundary tests |
| FR-008 | EvidenceRanker must prioritize direct intent/object evidence over generic architecture evidence. | P1 | Evidence ranking tests |
| FR-009 | EntityResolver must reject generic stopwords as operational start nodes unless explicit object keys are present. | P1 | Entity resolver tests |
| FR-010 | EntityResolver must support `SystemComponent` for modules such as `IntentRouter`, `RulePackSelector`, `EvidenceRanker`, `DecisionCard`, `Renderer`, `ActionGate`, and `ValidationEngine`. | P1 | Entity type tests |
| FR-011 | ActionPlanner must emit `ownerRole`, `requiredInput`, `allowedNow`, `blockedUntilApproved`, `humanGateRequired`, `auditRecordRequired`, and `writeBackMode`. | P1 | Action payload tests |
| FR-012 | ActionGate must enforce `DRY_RUN -> APPROVAL -> WRITE -> AUDIT_RECORD`. | P1 | Action gate tests |
| FR-013 | Graph context must support multiple `startNodes`, `riskEdges`, `operationalObjects`, and `isMetaReview`. | P1 | Graph context tests |
| FR-014 | Renderer must expose Decision, Evidence, Validation, Entities, Actions, Trace, and Security tabs or equivalent tabbed sections. | P2 | Widget/render tests |
| FR-015 | Renderer header must expose verdict, why, blockedBy, nextAction, and humanGate. | P2 | Widget/render tests |
| FR-016 | PII/NDA display must show detection scope, masked fields, data class, external share status, and reason. | P2 | Security banner tests |

### 3.2 Non-functional Requirements

| ID | Requirement | Priority | Verification |
|---|---|---:|---|
| NFR-001 | Router QA accuracy must be measured using a reproducible prompt set. | P0 | Regression suite |
| NFR-002 | Unauthorized write-back rate must remain 0.00%. | P0 | Action gate tests |
| NFR-003 | Decision Card output must be deterministic for the same input payload. | P0 | Snapshot/unit tests |
| NFR-004 | Renderer must not rely on color alone for verdict, risk, or status. | P2 | Accessibility review |
| NFR-005 | Evidence and action outputs must be audit-traceable. | P1 | Trace payload tests |
| NFR-006 | PII/NDA status must be explicit before external sharing. | P1 | Security tests |

## 4. Assumptions & Dependencies

| ID | Assumption or dependency | Status |
|---|---|---|
| AD-001 | `CONSOLIDATED-00-master-ontology.md` remains the canonical semantic spine. | Accepted |
| AD-002 | Operational write-back uses a separate approval and audit mechanism. | Accepted |
| AD-003 | Foundry Action write-back is not automatically executed by SCT_ONTOLOGY CARD. | Accepted |
| AD-004 | Existing ChatGPT/App renderer can be extended without changing the master ontology. | Accepted |
| AD-005 | Test fixtures can include system QA prompts and operational object prompts. | Accepted |
| AD-006 | Direct evidence can be scored separately from generic architecture evidence. | Accepted |

## 5. Success Criteria

| ID | Metric | Target | Verification |
|---|---|---:|---|
| SC-001 | Router accuracy on approved QA/operational prompt set | `>= 95.00%` | Intent regression report |
| SC-002 | False CostGuard block reduction on meta-review prompts | `>= 80.00%` | Before/after QA set |
| SC-003 | Top-3 direct evidence coverage | `>= 90.00%` | EvidenceRanker test report |
| SC-004 | Action audit completeness | `100.00%` | Action payload audit tests |
| SC-005 | Unauthorized write-back | `0.00%` | ActionGate test suite |
| SC-006 | Generic operational startNode leakage | `0.00%` | EntityResolver stopword tests |
| SC-007 | Renderer operator nextAction clarity | `>= 95.00%` | Manual or rubric-based UX review |
| SC-008 | Monthly router/rulepack regression pass rate | `>= 98.00%` | Regression run report |

## 6. Acceptance Test Matrix

| Test ID | Given | When | Then | Requirement IDs |
|---|---|---|---|---|
| T-001 | User prompt is "CARD 전반 점검 후 패치해줘" | IntentRouter classifies it | Intent is `SYSTEM_DIAGNOSTIC`; rulepack is `SYSTEM_QA_RULEPACK`; verdict is `DIAGNOSTIC`. | FR-001, FR-002, FR-003 |
| T-002 | User prompt is "cost guard rule이 과잉 BLOCK 되는지 점검" | RulePackSelector runs | `COST_RULEPACK` is skipped; `SYSTEM_QA_RULEPACK` fires. | FR-002, FR-003, FR-004 |
| T-003 | User prompt asks "이 invoice 100,000.00 AED 승인 가능?" with invoice evidence | RulePackSelector runs | `COST_RULEPACK` fires and returns `PASS`, `AMBER`, or `BLOCK`. | FR-003, FR-004, FR-006 |
| T-004 | User asks "BOE 없이 gate-out 가능?" | Validation runs | `CUSTOMS_RULEPACK` blocks the action. | FR-003, FR-006 |
| T-005 | AGI cargo has `M130` but lacks `M115` where required | Validation runs | Marine rule returns `BLOCK`. | FR-003, FR-006 |
| T-006 | User asks "이메일 답장 써줘" with recipient and purpose | COMM rule evaluates | Output is `DRAFT_READY`; no external send occurs. | FR-005, FR-006, FR-012 |
| T-007 | User asks "이메일 보내줘" | ActionGate evaluates | Verdict is `PENDING_APPROVAL`; send is blocked until approval. | FR-005, FR-006, FR-012 |
| T-008 | User asks "Flow Code로 route KPI 만들어줘" | Flow Code boundary rule evaluates | Verdict is `BLOCK`; WHP-only owner is shown. | FR-006, FR-007 |
| T-009 | Decision Card payload includes validation, entities, actions, trace, and security fields | Renderer renders the card | Required tabs or equivalent sections are visible. | FR-014, FR-015, FR-016 |
| T-010 | Any write-back action is proposed without approval | ActionGate evaluates | Write is blocked and audit requirement is surfaced. | FR-011, FR-012 |

## 7. Traceability Matrix

| Scenario | FR IDs | NFR IDs | SC IDs |
|---|---|---|---|
| US-001 | FR-001, FR-002, FR-003 | NFR-001, NFR-003 | SC-001 |
| US-002 | FR-003, FR-004 | NFR-001, NFR-003 | SC-002 |
| US-003 | FR-005, FR-006, FR-012 | NFR-002, NFR-006 | SC-004, SC-005 |
| US-004 | FR-006, FR-007 | NFR-003, NFR-005 | SC-005 |
| US-005 | FR-014, FR-015, FR-016 | NFR-004, NFR-006 | SC-007 |
| US-006 | FR-011, FR-012 | NFR-002, NFR-005 | SC-004, SC-005 |

## 8. Open Questions

| ID | Question | Impact |
|---|---|---|
| OQ-001 | What is the approved minimum prompt set size for router accuracy measurement beyond the initial 30-case target? | Affects SC-001 confidence. |
| OQ-002 | What rubric will measure `operator nextAction clarity >= 95.00%`? | Affects SC-007 reproducibility. |
| OQ-003 | Which audit table or durable store is authoritative for `AUDIT_RECORD` once write-back is implemented? | Affects FR-012 and SC-004. |
| OQ-004 | Should renderer tabs be literal tabs or is an equivalent accessible section layout acceptable? | Affects FR-014 implementation acceptance. |

## 9. Clarifications Log

| Date | Clarification | Source |
|---|---|---|
| 2026-05-18 | Companion Spec is generated from `SCT_ONTOLOGY_CARD_GOVERNANCE_PATCH_V2.md` without changing the source patch document. | User request |

## 10. Approval Readiness Checklist

| Check | Status |
|---|---|
| Mandatory Summary section exists | PASS |
| User scenarios are independently testable | PASS |
| Functional requirements use stable FR IDs | PASS |
| Non-functional requirements use stable NFR IDs | PASS |
| Success criteria use stable SC IDs | PASS |
| Acceptance tests use Given/When/Then | PASS |
| Traceability matrix exists | PASS |
| Critical ambiguities are visible as Open Questions | PASS |
| Implementation code is excluded | PASS |

## 11. Approval Status

Current status: `DRAFT_FOR_REVIEW`

Approval blocker:

- `OQ-001`, `OQ-002`, and `OQ-003` should be resolved before marking this Spec as `APPROVED`.

