---
title: "SCT_ONTOLOGY CARD Governance Patch v2.0"
type: "system-diagnostic-patch-spec"
domain: "hvdc-logistics-ontology-card"
version: "2.0"
date: "2026-05-17"
timezone: "Asia/Dubai"
status: "READY_FOR_IMPLEMENTATION"
owner: "HVDC Logistics Ontology Working Set"
spine_ref: "CONSOLIDATED-00-master-ontology.md"
basis:
  - "붙여넣은 마크다운(1).md"
  - "AGENTS.md"
  - "CONSOLIDATED-00-master-ontology.md"
  - "CONSOLIDATED-02~09 domain extensions"
---

# SCT_ONTOLOGY CARD Governance Patch v2.0

## 1. ExecSummary

**판정: 조건부 PASS — 운영 의사결정 CARD로 사용하려면 P0 패치 필요.**

현재 SCT_ONTOLOGY CARD는 evidence lookup / ontology drawer로는 동작하지만, **시스템 점검·패치 요청을 실제 운영 승인/메일 작성/비용 차단 요청으로 오분류할 위험**이 있다. 핵심 보정은 `IntentRouter → RulePackSelector → DecisionCard → ActionGate`의 순서와 경계를 재설계하는 것이다.

비즈니스 임팩트는 **불필요한 BLOCK 감소**, **운영 리스크 검출률 향상**, **근거-행동-승인 흐름의 감사 가능성 확보**, **Foundry Action write-back 오작동 방지**이다.

기술 해법은 `SYSTEM_QA` intent를 별도 도메인으로 분리하고, `COST/MARINE/CUSTOMS/WH/DOC/COMM` rulepack은 실제 운영 객체가 확인될 때만 firing하도록 gate를 둔다.

**ENG-KR one-liner:** System QA must audit the card; operational rulepacks must govern logistics objects only.

---

## 2. Review Finding

| No | Area | Finding | Risk | Required Patch |
|---:|---|---|---|---|
| 1 | IntentRouter | `system diagnostic / ontology patch` 요청이 `EMAIL_DRAFT` 또는 `COST_APPROVAL`로 오분류될 수 있음 | 답변 방향 왜곡, 불필요한 BLOCK | `SYSTEM_DIAGNOSTIC`, `ONTOLOGY_PATCH_REVIEW`, `CARD_RENDERING_AUDIT` intent 추가 |
| 2 | RulePackSelector | cost/invoice 키워드만으로 `COST_RULEPACK`이 과잉 firing | meta-review에서 비용 BLOCK 발생 | intent-domain-object 3조건 gate |
| 3 | DecisionCard | `PASS/BLOCK` 중심이라 운영 상태 표현 부족 | 과잉 차단 또는 불명확한 승인 상태 | verdict set 확장 |
| 4 | EvidenceRanker | 일반 architecture evidence가 직접 운영 evidence보다 상위 노출 가능 | 판단 근거 약화 | direct object evidence 우선 점수화 |
| 5 | EntityResolver | `document`, `HVDC ontology`, `summary` 같은 일반어를 entity로 인식 | Graph noise, 잘못된 startNode | stopword + `SystemComponent` class 추가 |
| 6 | ActionPlanner | `REVIEW_EVIDENCE_DRAWER` 같은 일반 action 반복 | 실행성 낮음 | ownerRole, requiredInput, allowedNow, blockedUntilApproved 필드 필수화 |
| 7 | ActionGate | dry-run / approval / write-back 경계 약함 | 자동 실행 리스크 | `DRY_RUN → APPROVAL → WRITE` 고정 |
| 8 | Renderer | AMBER / NEEDS_INPUT / ZERO 표현 약함 | 운영자가 다음 조치를 알기 어려움 | 상단 5필드 + tab 구조 표준화 |
| 9 | PII/NDA | `piiMasked=false` 표시만으로는 검토 범위 불명확 | 외부 공유 리스크 | detection scope, masking reason, data class 표시 |

---

## 3. Governance Alignment

### 3.1 Canonical Boundary

SCT_ONTOLOGY CARD는 ontology 운영 UI이지만, master semantics를 재정의하지 않는다. 다음 경계를 강제한다.

| Boundary | Required Rule |
|---|---|
| Master spine | `CONSOLIDATED-00` 우선 |
| Route state | `ShipmentRoutingPattern + JourneyStage + JourneyLeg + MilestoneEvent` |
| Warehouse handling | `WarehouseHandlingProfile.confirmedFlowCode` only |
| MOSB | `OffshoreStagingNode / MarineInterfaceNode`, not `Warehouse` |
| Communication | evidence layer only |
| Cost | `CostGuardResult` owns verdict; route/WH evidence는 read-only |
| Document/OCR | evidence only; transaction mutation 금지 |

### 3.2 Non-collapse Guard

| Do Not Collapse | Correct Model |
|---|---|
| System QA request → Email draft | `SYSTEM_QA` intent |
| Cost keyword → Cost approval | `COST_REVIEW` only when invoice object + approval intent exist |
| Document mention → Document-owned route truth | `routeEvidence`, `destinationEvidence`, `mosbLegIndicator` only |
| Port planned route → final route | port evidence only; master action required |
| Communication approval text → transaction mutation | `ApprovalAction` evidence; authorized Foundry Action required |

---

## 4. Target Architecture

```text
UserPrompt
  → IntentRouter
  → EntityResolver
  → EvidenceRetriever
  → EvidenceRanker
  → RulePackSelector
  → ValidationEngine
  → DecisionCard
  → ActionPlanner
  → ActionGate
  → Renderer
  → AuditRecord
```

### 4.1 Required Separation

| Layer | Owns | Must Not Own |
|---|---|---|
| `IntentRouter` | user intent classification | operational verdict |
| `EntityResolver` | object/key candidates | final logistics truth |
| `EvidenceRetriever` | candidate evidence | evidence priority |
| `EvidenceRanker` | evidence ranking score | validation decision |
| `RulePackSelector` | domain rulepack binding | rule execution |
| `ValidationEngine` | rule results | action write-back |
| `DecisionCard` | verdict, severity, blockedBy, nextAction | source mutation |
| `ActionPlanner` | proposed action | automatic execution |
| `ActionGate` | dry-run/approval/write permission | domain semantics |
| `Renderer` | operator-readable UI | hidden decision override |

---

## 5. P0 Patch — IntentRouter

### 5.1 New Intent Taxonomy

```json
{
  "systemQaIntents": [
    "SYSTEM_DIAGNOSTIC",
    "ONTOLOGY_PATCH_REVIEW",
    "CARD_RENDERING_AUDIT",
    "RULEPACK_GAP_ANALYSIS",
    "ROUTER_QA",
    "EVIDENCE_QA",
    "SCHEMA_BOUNDARY_REVIEW",
    "VALIDATION_POLICY_REVIEW"
  ],
  "operationalIntents": [
    "SHIPMENT_STATUS_CHECK",
    "CUSTOMS_RELEASE_CHECK",
    "INVOICE_AUDIT",
    "MARINE_EXECUTION_CHECK",
    "WAREHOUSE_STATUS_CHECK",
    "DOCUMENT_VALIDATION",
    "COMMUNICATION_DRAFT",
    "APPROVAL_REQUEST"
  ]
}
```

### 5.2 Hard-negative Rules

```json
{
  "hardNegativeRules": [
    {
      "whenUserMentions": ["점검", "패치", "전반", "CARD", "라우팅", "router", "validation", "ontology response", "rulepack"],
      "doNotClassifyAs": ["EMAIL_DRAFT", "EXTERNAL_SEND", "COST_APPROVAL", "SHIPMENT_EXECUTION"]
    },
    {
      "whenUserMentions": ["cost guard", "invoice", "DEM/DET"],
      "requireBeforeCostApproval": ["invoiceObject", "amount", "approvalIntent"],
      "fallbackIntent": "SYSTEM_DIAGNOSTIC_OR_COST_QA"
    },
    {
      "whenUserMentions": ["메일", "회신", "draft"],
      "requireBeforeEmailDraft": ["recipient", "communicationPurpose", "draftRequested"],
      "fallbackIntent": "COMMUNICATION_QA"
    }
  ]
}
```

### 5.3 Router Output Contract

```json
{
  "intent": "SYSTEM_DIAGNOSTIC",
  "confidence": 0.00,
  "domain": "SYSTEM_QA",
  "isOperationalMutation": false,
  "eligibleRulepacks": ["SYSTEM_QA_RULEPACK"],
  "blockedRulepacks": ["COST_RULEPACK", "EMAIL_SEND_RULEPACK"],
  "reason": "Prompt asks for ontology/card patch review, not operational approval."
}
```

---

## 6. P0 Patch — Decision Severity Matrix

### 6.1 Verdict Set

| Verdict | Meaning | Write-back Allowed | Human-gate |
|---|---|---:|---:|
| `DIAGNOSTIC` | system/card review | No | No |
| `PASS` | no issue detected | No by default | No |
| `PASS_WITH_FINDINGS` | usable with minor findings | No by default | Optional |
| `DRAFT_READY` | document/draft ready | No external send | Required before external send |
| `AMBER` | evidence incomplete or moderate risk | No | Yes if operational |
| `NEEDS_INPUT` | missing required input | No | Yes |
| `PENDING_APPROVAL` | action proposed, approval required | No | Yes |
| `DRY_RUN_ONLY` | safe simulation only | No | Yes before write |
| `BLOCK` | rule violation blocks operational action | No | Yes |
| `ZERO` | high-risk / authority / HS / safety / legal ambiguity without evidence | No | Mandatory stop |

### 6.2 Severity Decision Matrix

| Context | Trigger | Verdict | Blocked Rule |
|---|---|---|---|
| System/card patch review | no operational object | `DIAGNOSTIC` | Do not fire `COST_RULEPACK` |
| Ontology schema review | class/property boundary issue | `PASS_WITH_FINDINGS` or `AMBER` | No write-back |
| Invoice approval | invoice object + amount + approval intent | `PASS/AMBER/BLOCK` | CostGuard applies |
| Invoice keyword only | no invoice object | `DIAGNOSTIC` or `NEEDS_INPUT` | No CostGuard BLOCK |
| Customs/HS decision | HS/permit authority evidence missing | `ZERO` | stop until authority evidence |
| Marine execution | tide/berth/lashing/stability missing | `AMBER` or `BLOCK` | no execution approval |
| External email send | recipient + draft + send intent | `PENDING_APPROVAL` | no auto-send |
| Document generation only | no external action | `DRAFT_READY` | no operational mutation |
| WH Flow Code write | subject not `WarehouseHandlingProfile` | `BLOCK` | `V-FLOW-001` |

---

## 7. P0 Patch — RulePackSelector

### 7.1 RulePack Binding Matrix

| RulePack | Applies When | Must Not Fire When |
|---|---|---|
| `SYSTEM_QA_RULEPACK` | card/router/rule/evidence/rendering patch review | operational shipment execution only |
| `IDENTITY_RULEPACK` | BL/PO/container/package/object key exists | generic ontology discussion only |
| `DOCUMENT_RULEPACK` | CI/PL/BL/BOE/DO/OCR evidence exists | document word used generically |
| `CUSTOMS_RULEPACK` | BOE/HS/COO/permit/release object exists | system patch review |
| `COST_RULEPACK` | invoice/rate/tariff/DEM/DET object exists + audit intent | cost keyword in QA prompt only |
| `WAREHOUSE_RULEPACK` | WH event/WHP/stock/capacity object exists | route classification discussion only |
| `MARINE_RULEPACK` | MOSB/LCT/stowage/lashing/stability object exists | marine term in architecture discussion only |
| `COMM_RULEPACK` | message/thread/recipient/draft/send context exists | system diagnostic prompt |
| `ACTION_GATE_RULEPACK` | proposed write-back or external send | passive Q&A / diagnostic |

### 7.2 Selector Logic

```json
{
  "selectorPolicy": {
    "requireIntentDomainMatch": true,
    "requireObjectEvidenceForOperationalRulepack": true,
    "allowSystemQaWithoutOperationalObject": true,
    "denyOperationalBlockOnMetaReview": true
  }
}
```

---

## 8. RulePack Specifications

### 8.1 SYSTEM_QA_RULEPACK

```json
[
  {
    "ruleId": "SYS-ROUTER-001",
    "target": "IntentRouter",
    "logic": "System diagnostic / ontology patch prompts must not be classified as EMAIL_DRAFT, EXTERNAL_SEND, COST_APPROVAL, or SHIPMENT_EXECUTION.",
    "severity": "P0",
    "verdictOnFail": "BLOCK",
    "action": "Patch hard-negative rules."
  },
  {
    "ruleId": "SYS-RULEPACK-001",
    "target": "RulePackSelector",
    "logic": "Operational rulepacks require matching domain object evidence.",
    "severity": "P0",
    "verdictOnFail": "BLOCK",
    "action": "Add intent-domain-object gate."
  },
  {
    "ruleId": "SYS-EVID-001",
    "target": "EvidenceRanker",
    "logic": "Top evidence must directly support prompt intent.",
    "severity": "P1",
    "verdictOnFail": "AMBER",
    "action": "Re-score evidence."
  },
  {
    "ruleId": "SYS-ENTITY-001",
    "target": "EntityResolver",
    "logic": "Generic words must not become operational startNodes.",
    "severity": "P1",
    "verdictOnFail": "AMBER",
    "action": "Apply stopword guard and SystemComponent type."
  }
]
```

### 8.2 COST_RULEPACK Trigger

```json
{
  "rulepack": "COST_RULEPACK",
  "required": {
    "intentAnyOf": ["INVOICE_AUDIT", "COST_APPROVAL", "DEMDET_REVIEW"],
    "objectAnyOf": ["Invoice", "InvoiceLine", "RateRef", "TariffRef", "DEMDETClock"],
    "evidenceAnyOf": ["invoiceNo", "amount", "currency", "rateRef", "tariffRef"]
  },
  "blockedWhen": {
    "intentAnyOf": ["SYSTEM_DIAGNOSTIC", "ONTOLOGY_PATCH_REVIEW", "CARD_RENDERING_AUDIT"],
    "missingObject": true
  }
}
```

### 8.3 COMM_RULEPACK Trigger

```json
{
  "rulepack": "COMM_RULEPACK",
  "required": {
    "intentAnyOf": ["COMMUNICATION_DRAFT", "EXTERNAL_SEND_APPROVAL", "THREAD_SUMMARY"],
    "objectAnyOf": ["CommunicationEvent", "MessageThread", "ApprovalAction"],
    "inputAnyOf": ["recipient", "thread", "channel", "draftPurpose"]
  },
  "blockedWhen": {
    "intentAnyOf": ["SYSTEM_DIAGNOSTIC", "ONTOLOGY_PATCH_REVIEW"],
    "missingRecipient": true
  }
}
```

---

## 9. P1 Patch — EvidenceRanker

### 9.1 Evidence Score

```json
{
  "evidenceScore": {
    "intentRelevance": 0.35,
    "domainSpecificity": 0.25,
    "objectDirectness": 0.20,
    "recency": 0.10,
    "authorityLevel": 0.05,
    "sourceReliability": 0.05
  }
}
```

### 9.2 Evidence Ranking Policy

| Prompt Type | Preferred Evidence | De-prioritize |
|---|---|---|
| System patch | router logs, validation trace, card schema, rulepack config | generic architecture overview |
| Invoice audit | InvoiceLine, RateRef, TariffRef, DO/BOE evidence | generic cost ontology prose |
| Marine execution | LCT plan, TideTable, StabilityCase, LashingPlan, PTW | generic marine vocabulary |
| Customs/HS | BOE, HS source, COO, CI/PL/BL, authority evidence | non-authority summary |
| Warehouse | WHReceipt, PutAwayNote, WHP, StockSnapshot, capacity | route narrative only |
| Communication | current thread, sender/recipient, approval evidence | unrelated person/org mentions |

---

## 10. P1 Patch — EntityResolver

### 10.1 Stopword Guard

```json
{
  "entityStopwords": [
    "document",
    "summary",
    "report",
    "ontology",
    "HVDC ontology",
    "card",
    "system",
    "validation",
    "evidence",
    "patch",
    "rewrite",
    "검토",
    "보고서",
    "문서"
  ],
  "allowedWhen": "explicitObjectKeyPresent"
}
```

### 10.2 New Entity Type

```json
{
  "class": "SystemComponent",
  "examples": [
    "IntentRouter",
    "RulePackSelector",
    "EvidenceRanker",
    "DecisionCard",
    "Renderer",
    "ActionGate",
    "ValidationEngine"
  ],
  "routing": "SYSTEM_QA",
  "mayStartGraph": true,
  "mayMutateOperationalTruth": false
}
```

### 10.3 Entity Output Contract

```json
{
  "entities": [
    {
      "label": "IntentRouter",
      "type": "SystemComponent",
      "confidence": 0.98,
      "startNodeEligible": true
    }
  ],
  "rejectedEntities": [
    {
      "label": "document",
      "reason": "generic stopword; no object key"
    }
  ]
}
```

---

## 11. P1 Patch — ActionPlanner and ActionGate

### 11.1 Action Card Required Fields

```json
{
  "actionId": "ACT-001",
  "actionType": "PATCH_CONFIG",
  "ownerRole": "Ontology Admin",
  "targetModule": "IntentRouter",
  "requiredInput": ["intent examples", "negative labels", "test cases"],
  "allowedNow": true,
  "blockedUntilApproved": false,
  "humanGateRequired": false,
  "auditRecordRequired": true,
  "writeBackMode": "DRY_RUN"
}
```

### 11.2 State Transition

```text
DRAFT
  → DRY_RUN
  → VALIDATION_RESULT
  → APPROVAL_REQUIRED
  → APPROVED
  → WRITE
  → AUDIT_RECORD
```

### 11.3 Write-back Rules

| Action Type | Auto-execute | Required Gate |
|---|---:|---|
| Evidence display | Yes | none |
| Rule simulation | Yes | dry-run only |
| Config patch proposal | No | system owner approval |
| Invoice approval | No | Cost owner + Finance gate |
| Customs/HS decision | No | authority evidence + human-gate |
| Marine execution approval | No | MWS/HSE/Marine approval |
| External email send | No | recipient + reviewer approval |
| WH Flow Code assignment | No if outside WHP | WHP owner + M110/M111 evidence |

---

## 12. P1 Patch — GraphPath

### 12.1 Current Issue

단일 `startNode` 중심 graph는 multi-shipment, multi-document, multi-domain 질문에서 누락을 만든다.

### 12.2 Required Output

```json
{
  "graphContext": {
    "startNodes": [
      {"id": "IntentRouter", "type": "SystemComponent"},
      {"id": "ValidationEngine", "type": "SystemComponent"},
      {"id": "DecisionCard", "type": "SystemComponent"}
    ],
    "riskEdges": [
      {"from": "IntentRouter", "to": "RulePackSelector", "risk": "misroute"},
      {"from": "RulePackSelector", "to": "DecisionCard", "risk": "over-block"}
    ],
    "operationalObjects": [],
    "isMetaReview": true
  }
}
```

---

## 13. P2 Patch — Renderer

### 13.1 Card Header

| Field | Example |
|---|---|
| `verdict` | `DIAGNOSTIC_WITH_P0_FINDINGS` |
| `why` | `System QA prompt misrouted to email/cost path` |
| `blockedBy` | `SYS-ROUTER-001`, `SYS-RULEPACK-001` |
| `nextAction` | `Patch IntentRouter hard-negative rules` |
| `humanGate` | `Not required for diagnostic; required before config write` |

### 13.2 Tabs

| Tab | Content |
|---|---|
| Decision | verdict, severity, reason |
| Evidence | ranked evidence with score |
| Validation | fired/skipped rulepacks and reason |
| Entities | accepted/rejected entity candidates |
| Actions | proposed actions, ownerRole, blockedUntilApproved |
| Trace | router path, rulepack path, audit trace |
| Security | PII/NDA result and masking scope |

### 13.3 Rendering Contract

```json
{
  "card": {
    "verdict": "DIAGNOSTIC_WITH_P0_FINDINGS",
    "severity": "P0",
    "blockedBy": ["SYS-ROUTER-001", "SYS-RULEPACK-001"],
    "nextAction": "Apply SCT_ONTOLOGY_CARD_GOVERNANCE_PATCH_V2",
    "rulepacksFired": ["SYSTEM_QA_RULEPACK"],
    "rulepacksSkipped": [
      {"rulepack": "COST_RULEPACK", "reason": "No invoice object and meta-review intent"},
      {"rulepack": "COMM_RULEPACK", "reason": "No recipient/draft/send intent"}
    ]
  }
}
```

---

## 14. P2 Patch — PII/NDA Display

```json
{
  "pii": {
    "detected": false,
    "checkedFields": ["userPrompt", "evidenceSnippet", "draftOutput", "actionPayload"],
    "maskedFields": [],
    "dataClass": "P1_INTERNAL_LOGISTICS",
    "externalShareAllowed": false,
    "reason": "Internal system diagnostic; no external send approval."
  },
  "nda": {
    "containsInternalProcess": true,
    "containsContractRate": false,
    "containsPersonalContact": false,
    "safeForInternalUse": true,
    "safeForExternalUse": false
  }
}
```

---

## 15. Acceptance Tests

| Test ID | Prompt | Expected Intent | Expected Rulepack | Expected Verdict |
|---|---|---|---|---|
| T-001 | "CARD 전반 점검 후 패치해줘" | `SYSTEM_DIAGNOSTIC` | `SYSTEM_QA_RULEPACK` | `DIAGNOSTIC` |
| T-002 | "cost guard rule이 과잉 BLOCK 되는지 점검" | `SYSTEM_DIAGNOSTIC` | `SYSTEM_QA_RULEPACK` | `DIAGNOSTIC_WITH_FINDINGS` |
| T-003 | "이 invoice 100,000.00 AED 승인 가능?" | `COST_APPROVAL` | `COST_RULEPACK` | `PASS/AMBER/BLOCK` |
| T-004 | "BOE 없이 gate-out 가능?" | `CUSTOMS_RELEASE_CHECK` | `CUSTOMS_RULEPACK` | `BLOCK` |
| T-005 | "AGI cargo M130인데 M115 없음" | `MARINE_EXECUTION_CHECK` | `MARINE_RULEPACK` | `BLOCK` |
| T-006 | "이메일 답장 써줘" | `COMMUNICATION_DRAFT` | `COMM_RULEPACK` | `DRAFT_READY` |
| T-007 | "이메일 보내줘" | `EXTERNAL_SEND_APPROVAL` | `COMM_RULEPACK + ACTION_GATE_RULEPACK` | `PENDING_APPROVAL` |
| T-008 | "Flow Code로 route KPI 만들어줘" | `SCHEMA_BOUNDARY_REVIEW` | `SYSTEM_QA_RULEPACK` | `BLOCK` |

---

## 16. Final Patch Spec

```json
{
  "patchName": "SCT_ONTOLOGY_CARD_GOVERNANCE_PATCH_V2",
  "priority": "P0",
  "effectiveDate": "2026-05-17",
  "policy": {
    "canonicalSpine": "CONSOLIDATED-00-master-ontology.md",
    "flowCodeOwner": "WarehouseHandlingProfile.confirmedFlowCode",
    "mosbClass": "OffshoreStagingNode / MarineInterfaceNode",
    "writeBackPolicy": "DRY_RUN -> APPROVAL -> WRITE -> AUDIT_RECORD"
  },
  "changes": [
    {
      "module": "IntentRouter",
      "change": "Add SYSTEM_QA intents and hard-negative rules against EMAIL_DRAFT, EXTERNAL_SEND, COST_APPROVAL, SHIPMENT_EXECUTION for diagnostic prompts.",
      "priority": "P0"
    },
    {
      "module": "RulePackSelector",
      "change": "Bind rulepacks by intent + domain + object evidence; prevent operational rulepacks from firing on meta-system review.",
      "priority": "P0"
    },
    {
      "module": "DecisionCard",
      "change": "Replace binary PASS/BLOCK bias with DIAGNOSTIC, PASS_WITH_FINDINGS, AMBER, NEEDS_INPUT, PENDING_APPROVAL, DRY_RUN_ONLY, BLOCK, ZERO.",
      "priority": "P0"
    },
    {
      "module": "EvidenceRanker",
      "change": "Prioritize direct operational/system evidence over generic architecture evidence using weighted score.",
      "priority": "P1"
    },
    {
      "module": "EntityResolver",
      "change": "Add stopword guard and SystemComponent entity type; reject generic terms as operational startNodes.",
      "priority": "P1"
    },
    {
      "module": "ActionPlanner",
      "change": "Generate executable actions with ownerRole, requiredInput, allowedNow, blockedUntilApproved, writeBackMode.",
      "priority": "P1"
    },
    {
      "module": "ActionGate",
      "change": "Enforce DRY_RUN -> APPROVAL -> WRITE -> AUDIT_RECORD for config changes and operational mutations.",
      "priority": "P1"
    },
    {
      "module": "GraphBuilder",
      "change": "Support multi-startNode system graph and operational graph; include riskEdges.",
      "priority": "P1"
    },
    {
      "module": "Renderer",
      "change": "Expose Decision, Evidence, Validation, Entities, Actions, Trace, Security tabs with blockedBy and nextAction at header.",
      "priority": "P2"
    },
    {
      "module": "SecurityBanner",
      "change": "Show PII/NDA detection scope, dataClass, masking reason, externalShareAllowed.",
      "priority": "P2"
    }
  ],
  "expectedResult": {
    "routerAccuracyTarget": ">= 95.00%",
    "falseCostBlockReduction": ">= 80.00%",
    "directEvidenceTop3Coverage": ">= 90.00%",
    "actionAuditCompleteness": "100.00%",
    "unauthorizedWriteBack": "0.00"
  }
}
```

---

## 17. Implementation Roadmap

| Phase | Priority | Work Item | KPI |
|---|---:|---|---|
| Prepare | P0 | intent examples / negative examples 수집 | test set ≥ 30.00 cases |
| Patch-1 | P0 | IntentRouter hard-negative rule 적용 | misroute = 0.00 in QA set |
| Patch-2 | P0 | RulePackSelector domain/object gate 적용 | false operational BLOCK ≤ 2.00% |
| Patch-3 | P0 | Decision verdict set 확장 | PASS/BLOCK-only ratio < 30.00% |
| Patch-4 | P1 | EvidenceRanker score 적용 | top-3 direct evidence ≥ 90.00% |
| Patch-5 | P1 | Entity stopword + SystemComponent class | generic startNode leakage = 0.00 |
| Patch-6 | P1 | ActionGate dry-run/approval/write 고정 | unauthorized write = 0.00 |
| Patch-7 | P2 | Renderer tabs/security banner 적용 | operator nextAction clarity ≥ 95.00% |
| Operate | P2 | monthly router/rulepack regression | regression pass ≥ 98.00% |

---

## 18. QA Checklist

| Check | PASS Criteria |
|---|---|
| Meta-review isolation | system/card/ontology patch prompt fires only `SYSTEM_QA_RULEPACK` |
| Operational rulepack gate | cost/marine/customs/WH rulepack requires object evidence |
| Flow Code boundary | `confirmedFlowCode` appears only on `WarehouseHandlingProfile` |
| Route semantics | route uses `ShipmentRoutingPattern + JourneyStage + JourneyLeg + MilestoneEvent` |
| Evidence ownership | document/port/communication/cost evidence cannot mutate transaction truth |
| MOSB classification | MOSB is not `Warehouse` |
| CostGuard scope | CostGuard only on invoice/rate/tariff/DEMDET objects |
| Communication scope | email/chat output cannot send externally without approval |
| PII/NDA scope | checked fields and masking reason displayed |
| Write-back safety | all mutation paths require approval and audit record |

---

## 19. Assumptions

- 이 패치는 SCT_ONTOLOGY CARD의 governance/runtime behavior를 다루며, `CONSOLIDATED-00` master spine 자체를 변경하지 않는다.
- 실제 Foundry Action write-back은 별도 권한 모델과 audit table이 존재한다는 전제다.
- 외부 발송, 통관/HS, marine execution, invoice approval은 모두 dry-run 결과만 자동 생성하고 최종 처리는 human-gate를 통과해야 한다.
- 내부 계약단가, PII, authority portal 결과는 본 패치 문서에 직접 포함하지 않는다.

---

## 20. CmdRec

```text
/logi-master report --deep --KRsummary
```

```text
/switch_mode ORACLE + /logi-master cert-chk --deep
```

```text
/logi-master invoice-audit --AEDonly --fast
```
