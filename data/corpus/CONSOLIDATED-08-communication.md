---
title: "HVDC Communication Evidence Layer Ontology — Consolidated"
type: "evidence-layer-extension"
domain: "communication"
sub-domains:
  - email
  - chat
  - approval-evidence
  - escalation-control
  - sla-clock
  - audit-proof
  - pii-redaction
version: "2.0-final"
date: "2026-04-27"
timezone: "Asia/Dubai"
status: "active"
spine_ref: "CONSOLIDATED-00-master-ontology.md"
extension_of: "hvdc-master-ontology-v2.0-final"
canonical_role: "email/chat evidence, approval action, audit record, and communication SLA extension"
layer: "evidence"
owner: "HVDC Logistics Ontology Working Set"
standards:
  - RDF
  - OWL
  - SHACL
  - SPARQL
  - JSON-LD
  - PROV-O
  - OWL-Time
  - SKOS
  - DQV
  - GS1-EPCIS-CBV
source_files:
  - 2_EXT-03-hvdc-comm-email.md
  - 2_EXT-04-hvdc-comm-chat.md
  - FMC_OrgChart_Data.json
checked_against:
  - CONSOLIDATED-00-master-ontology.md
  - CONSOLIDATED-01-core-framework-infra.md
  - CONSOLIDATED-02-warehouse-flow.md
  - CONSOLIDATED-03-document-ocr.md
  - CONSOLIDATED-04-barge-bulk-cargo.md
  - CONSOLIDATED-05-invoice-cost.md
  - CONSOLIDATED-06-material-handling.md
  - CONSOLIDATED-07-port-operations.md
  - CONSOLIDATED-09-operations.md
  - AGENTS.md
  - HVDC Logistics Ontology Review.txt
  - Palantir 온톨로지 기반 물류 자동화.pdf
validation_passes: 5
semantic_patch:
  - "Communication is evidence-only and does not redefine ShipmentUnit, RoutingPattern, JourneyStage, JourneyLeg, MilestoneEvent, WarehouseTask, PortCall, CostGuardResult, or SiteReceipt."
  - "Core connection is restricted to CommunicationEvent, ApprovalAction, AuditRecord, EvidenceAttachment, and EscalationRecord."
  - "WarehouseHandlingProfile.confirmedFlowCode remains warehouse-only; communication may cite the approved WHP identifier as evidence only."
  - "MOSB is represented as OffshoreStagingNode / MarineInterfaceNode evidence; communication shall not classify MOSB as Warehouse."
  - "PII fields from contact data are masked before register write; raw tel/e-mail never appears in the evidence graph."
  - "A message can propose, request, or approve; only an authorized Foundry Action can mutate operational truth."
  - "Email drafting defaults to EmailDraftMode; sct_ontology is not invoked or surfaced unless explicitly requested."
  - "A hard-marked EmailActionCard is mandatory for email drafting output and is not an operational ActionRequest unless the user asks to register or write an action."
final_validation_rounds: 5
final_validation_status: "PASS"
final_validated_date: "2026-04-27"
final_patch_bundle: "HVDC_Logistics_Ontology_FINAL_5x_2026-04-27"
---

# hvdc-communication · CONSOLIDATED-08

## 1. ExecSummary

`CONSOLIDATED-08`은 HVDC Logistics KG의 **communication evidence layer**이다. 이메일, WhatsApp, Telegram, Teams, meeting note, phone memo, approval memo를 `CommunicationEvent`, `ApprovalAction`, `AuditRecord`, `EvidenceAttachment`, `EscalationRecord`로 정규화한다.

비즈니스 임팩트는 **승인 누락 0.00건**, **SLA breach 조기 경보**, **OSD/NCR/DEM-DET/permit blocker 증빙 자동 연결**, **PII 마스킹 기반 감사 추적성 확보**이다. 기술 해법은 PROV-O provenance, OWL-Time SLA clock, SHACL evidence gate, SPARQL unresolved-action query, Foundry Action write-back guard를 결합한다.

KPI 목표는 `CommunicationLinkCoverage ≥ 95.00%`, `ApprovalEvidenceCompleteness ≥ 98.00%`, `PIILeakage = 0.00건`, `ActionClosureSLA ≥ 90.00%`, `Validation p95 < 5.00s`이다.

Email reply drafting은 별도 `EmailDraftMode`로 처리한다. 사용자가 단순히 답장 작성을 요청한 경우 `sct_ontology`를 자동 호출하지 않고, 하드마킹된 `EmailActionCard`와 이메일 본문 초안만 출력한다.

**ENG-KR one-liner:** Communication is proof, not operational truth; messages attach evidence, while authorized Foundry Actions update the logistics twin.

---

## 2. Governance & Scope Boundary

### 2.1 Master Governance Rule

1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.
2. `CONSOLIDATED-08` is an **evidence layer**, not a core logistics execution layer.
3. This document owns `CommunicationEvent`, `MessageThread`, `ApprovalAction`, `AuditRecord`, `EvidenceAttachment`, `EscalationRecord`, `SLAClock`, and `PIIRedactionRecord`.
4. Program-wide shipment state uses `RoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`; communication may refer to these as target objects only.
5. Warehouse handling classification remains on `WarehouseHandlingProfile.confirmedFlowCode`; communication cannot create, assign, or infer it.
6. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`; communication can store MOSB-related approval evidence but cannot type MOSB as a warehouse.
7. A message cannot mutate operational transactions. It can create an evidence assertion, approval request, escalation, or work queue item. A separate authorized Foundry Action performs any transaction update.
8. Email drafting requests are `EmailDraftMode` by default. They do not automatically invoke `sct_ontology`, CostGuard, route verdicting, or regulatory classification.
9. Email draft output must start with a hard-marked `EmailActionCard`. The card is a presentation/triage artifact, not a KG `ActionRequest`.
10. `sct_ontology` may be invoked only by explicit user trigger, such as `sct_ontology 사용`, ontology review, risk verdict, CostGuard, compliance judgement, evidence pack creation, or Action registration.

### 2.2 Included vs Delegated Scope

| Scope item | Included in CONSOLIDATED-08 | Delegated / excluded |
|---|---|---|
| Email and chat evidence | Message, thread, sender role, receiver role, timestamp, channel, attachment hash | Mailbox administration and raw server retention policy |
| Approval action | Approve / reject / request revision / acknowledge / escalate | Final operational mutation in target domain |
| Audit proof | Provenance, reviewer, evidence pointer, action rationale, before/after object references | Legal opinion and commercial settlement |
| SLA clock | Due time, response time, breach status, escalation tier | Project schedule critical path ownership |
| PII redaction | Masked phone/e-mail, role-only exposure, hash-only identity join | HR master data and raw contact vault |
| Evidence linking | Link to ShipmentUnit, Document, PortCall, CustomsEntry, WarehouseTask, SiteReceipt, Invoice, Exception | Redefining those classes |
| RAG summary | Summarize discussion and cite evidence objects | Treating LLM summary as source-of-truth |
| Email drafting | `EmailActionCard` + email body draft in `EmailDraftMode` | Auto-running `sct_ontology` or converting the card to KG action without explicit instruction |

### 2.3 Domain Boundary Crosswalk

| Domain | Allowed interface from communication | Not allowed in CONSOLIDATED-08 |
|---|---|---|
| Master spine | Attach `CommunicationEvent`, `ApprovalAction`, `AuditRecord` to `ShipmentUnit`, `MilestoneEvent`, `Exception` | Redefine identity policy or milestone dictionary |
| Infrastructure | Reference `Party`, `RoleAssignment`, `LocationNode`, `RegulatoryRequirement` | Create authority decision as fact without evidence |
| Warehouse | Attach approval evidence to M110/M111/M120/M121 or WHP reviewer action | Own or calculate WH handling class |
| Document/OCR | Link extracted document discrepancy to message thread and reviewer decision | Replace LDG `VerificationResult` |
| Marine/Bulk | Link MWS/stability/lashing/lift approval evidence | Replace engineering approval or marine execution truth |
| Cost | Attach invoice clarification and approval record to `CostGuardResult` | Own `RateRef`, cost band, payment verdict |
| Material handling | Attach approval/evidence to release, site receipt, OSD/NCR/Claim | Mutate custody chain directly |
| Port | Attach port service clarification and OFCO/SAFEEN/ADP discussion evidence | Own `PortCall` or `TariffRef` truth |
| Operations | Feed unresolved action counts, SLA KPI, and exception communication metrics | Define route or stock analytics |

### 2.4 Evidence-only Write Guard

```text
Message received        -> CommunicationEvent + MessageThread + EvidenceAttachment
Reviewer decision       -> ApprovalAction + AuditRecord
Operational update      -> Authorized Foundry Action in target ontology
Audit closure           -> AuditRecord links beforeObjectRef, afterObjectRef, evidenceHash
```

### 2.4.1 Email Drafting Guard

```text
User says "답장 작성하라" / "draft reply" / "메일 회신 작성"
  -> EmailDraftMode
  -> Emit hard-marked EmailActionCard
  -> Emit email draft
  -> DO NOT auto-run sct_ontology
  -> DO NOT create ActionRequest unless user explicitly says register/write/escalate
```

Mandatory card:

```text
[EMAIL_ACTION_CARD]
mode: EMAIL_DRAFT
ontology_use: NO_AUTO_SCT_ONTOLOGY | EXPLICIT_ONTOLOGY
reply_stance: ACKNOWLEDGE | HOLD | REQUEST_INFO | ESCALATE | APPROVE | REJECT
blocking_inputs: <comma-separated missing inputs or NONE>
next_action: <single operational next step>
send_status: DRAFT_READY | HOLD_FOR_REVIEW
[/EMAIL_ACTION_CARD]
```

For mixed requests, use two separated lanes:

```text
Email lane     -> EmailActionCard + Draft
Ontology lane  -> OntologyReview only if explicitly requested
```


### 2.5 Legacy Migration Rules

| Legacy wording / pattern | Canonical replacement | Patch action |
|---|---|---|
| Message as direct logistics state | `CommunicationEvent` evidence attached to target object | Remove direct state mutation language |
| Chat command directly updates shipment | `ActionRequest` + authorized Foundry Action | Add reviewer and audit proof |
| Email-derived route status | `RouteEvidenceAssertion` or `ApprovalAction.targetObjectRef` | Route owner remains core shipment layer |
| Message-derived WH handling class | `CommunicationEvidence` on WHP decision | WHP owner remains `CONSOLIDATED-02` |
| Raw phone/e-mail in graph | `maskedContactRef`, `roleId`, `hashKey` | Redact before write |
| Email draft auto-runs `sct_ontology` | `EmailDraftMode` with `ontology_use = NO_AUTO_SCT_ONTOLOGY` | Require explicit trigger for ontology lane |
| Draft action card treated as KG action | `EmailActionCard` presentation artifact | Convert to `ActionRequest` only on explicit register/write/escalate request |

---

## 3. Schema (RDF/OWL + SHACL 요약)

### 3.1 Ontology Layer Map

| Layer | Class / vocabulary | Purpose |
|---|---|---|
| Message | `CommunicationEvent`, `EmailMessage`, `ChatMessage`, `MeetingNote`, `PhoneMemo` | Raw or normalized communication event |
| Thread | `MessageThread`, `ConversationCluster`, `ThreadParticipant` | Multi-message discussion and participants |
| Intent | `CommunicationIntent`, `RequestIntent`, `ApprovalIntent`, `EscalationIntent`, `ClarificationIntent` | Semantic intent classification |
| Action | `ActionRequest`, `ApprovalAction`, `RevisionRequest`, `EscalationRecord`, `AcknowledgementAction` | Human decision and workflow action |
| Drafting | `EmailDraftArtifact`, `EmailActionCard` | Reply composition output; no automatic ontology invocation |
| Evidence | `EvidenceAttachment`, `AttachmentManifest`, `DocumentPointer`, `ObjectPointer`, `AuditRecord` | Provenance and proof artifact |
| SLA | `SLAClock`, `ResponseWindow`, `BreachRecord`, `EscalationTier` | Response and closure timing |
| Security | `PIIRedactionRecord`, `AccessControlTag`, `SensitivityLabel` | Privacy and access guard |
| Quality | `CommunicationKPI`, `EvidenceLinkMetric`, `ClosureMetric`, `PIILeakageMetric` | KPI observations |

### 3.2 Core Classes

| Class | Required properties | Key relations | Notes |
|---|---|---|---|
| `CommunicationEvent` | `eventId`, `channel`, `eventTime`, `normalizedSubject`, `language`, `sourceSystem` | `belongsToThread`, `hasParticipant`, `hasIntent`, `referencesObject`, `hasEvidenceAttachment` | Root evidence object |
| `EmailMessage` | `messageId`, `sentAt`, `receivedAt`, `subjectHash`, `bodyHash` | `subClassOf CommunicationEvent` | Body is optionally stored outside KG |
| `EmailDraftArtifact` | `draftId`, `draftPurpose`, `createdAt`, `language`, `sourceThreadHash` | `draftsReplyTo`, `hasEmailActionCard` | Draft-only artifact; not sent evidence until registered |
| `EmailActionCard` | `mode`, `ontologyUse`, `replyStance`, `blockingInputs`, `nextAction`, `sendStatus` | `summarizesDraft`, optional `mayOpenActionRequest` | Hard-marked output card; not a KG action by default |
| `ChatMessage` | `messageId`, `channelProvider`, `sentAt`, `messageHash` | `subClassOf CommunicationEvent` | WhatsApp/Telegram/Teams normalized |
| `MessageThread` | `threadId`, `threadStatus`, `openedAt`, `lastActivityAt` | `hasMessage`, `hasOpenAction`, `referencesObject` | One thread can reference many shipments |
| `CommunicationIntent` | `intentCode`, `confidence`, `classifierVersion` | `classifiedFrom`, `requiresActionType` | LLM/RAG intent is evidence, not truth |
| `ActionRequest` | `requestId`, `requestType`, `dueAt`, `priority`, `requestedByRole` | `targetObjectRef`, `assignedToRole`, `openedByMessage` | Creates queue item |
| `ApprovalAction` | `actionId`, `decision`, `decisionAt`, `actorRole`, `reasonCode` | `approvesRequest`, `targetObjectRef`, `supportedByEvidence`, `writesAuditRecord` | Required for human-gated updates |
| `AuditRecord` | `auditId`, `createdAt`, `actorRole`, `actionType`, `evidenceHash` | `wasDerivedFrom`, `beforeObjectRef`, `afterObjectRef` | PROV-O anchor |
| `EvidenceAttachment` | `attachmentId`, `artifactType`, `artifactHash`, `sourceUriHash`, `mimeType` | `attachedToMessage`, `pointsToDocument`, `pointsToObject` | Raw file may live in document store |
| `SLAClock` | `clockId`, `slaType`, `startAt`, `dueAt`, `closedAt`, `breachStatus` | `forThread`, `forActionRequest`, `escalatesTo` | OWL-Time compatible |
| `PIIRedactionRecord` | `redactionId`, `fieldType`, `redactedAt`, `maskPolicy`, `hashKey` | `protectsParticipant`, `appliesToMessage` | No raw phone/e-mail in KG |

### 3.3 Object Properties

| Property | Domain → Range | Cardinality | Purpose |
|---|---|---:|---|
| `belongsToThread` | `CommunicationEvent → MessageThread` | 1..1 | Thread grouping |
| `referencesObject` | `CommunicationEvent → ShipmentUnit/Document/Invoice/Exception/etc.` | 0..n | Evidence target |
| `openedByMessage` | `ActionRequest → CommunicationEvent` | 1..1 | Request provenance |
| `supportedByEvidence` | `ApprovalAction → EvidenceAttachment/CommunicationEvent/Document` | 1..n | Decision proof |
| `writesAuditRecord` | `ApprovalAction → AuditRecord` | 1..1 | Audit closure |
| `protectsParticipant` | `PIIRedactionRecord → ThreadParticipant` | 1..1 | PII protection |
| `escalatesTo` | `SLAClock → EscalationRecord` | 0..1 | Breach action |
| `linkedToVerification` | `CommunicationEvent → VerificationResult` | 0..n | LDG discrepancy discussion |

### 3.4 Data Properties

| Property | Range | Rule |
|---|---|---|
| `channel` | SKOS enum | `EMAIL`, `WHATSAPP`, `TELEGRAM`, `TEAMS`, `MEETING`, `PHONE_MEMO`, `SYSTEM_ALERT` |
| `eventTime` | `xsd:dateTime` | ISO-8601 with Asia/Dubai operational timezone or UTC offset |
| `language` | SKOS enum | `EN`, `KO`, `AR`, `MIXED`, `UNKNOWN` |
| `decision` | SKOS enum | `APPROVED`, `REJECTED`, `REVISION_REQUIRED`, `ACKNOWLEDGED`, `ESCALATED` |
| `breachStatus` | SKOS enum | `OPEN`, `ON_TIME`, `WARN`, `BREACHED`, `WAIVED` |
| `sensitivityLabel` | SKOS enum | `PUBLIC`, `PROJECT_INTERNAL`, `CONFIDENTIAL`, `PII_MASKED`, `LEGAL_HOLD` |
| `confidence` | decimal | `0.00 <= confidence <= 1.00` |
| `evidenceHash` | string | Required for every `AuditRecord` |
| `ontologyUse` | SKOS enum | `NO_AUTO_SCT_ONTOLOGY` unless explicit ontology lane is requested |
| `sendStatus` | SKOS enum | `DRAFT_READY` or `HOLD_FOR_REVIEW` |

### 3.5 Core SHACL Shapes (요약)

```turtle
comm:CommunicationEventShape a sh:NodeShape ;
  sh:targetClass comm:CommunicationEvent ;
  sh:property [ sh:path comm:eventId ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path comm:channel ; sh:minCount 1 ; sh:in ( "EMAIL" "WHATSAPP" "TELEGRAM" "TEAMS" "MEETING" "PHONE_MEMO" "SYSTEM_ALERT" ) ] ;
  sh:property [ sh:path comm:eventTime ; sh:minCount 1 ; sh:datatype xsd:dateTime ] ;
  sh:property [ sh:path comm:belongsToThread ; sh:minCount 1 ; sh:maxCount 1 ] .

comm:ApprovalActionShape a sh:NodeShape ;
  sh:targetClass comm:ApprovalAction ;
  sh:property [ sh:path comm:decision ; sh:minCount 1 ] ;
  sh:property [ sh:path comm:decisionAt ; sh:minCount 1 ; sh:datatype xsd:dateTime ] ;
  sh:property [ sh:path comm:actorRole ; sh:minCount 1 ] ;
  sh:property [ sh:path comm:targetObjectRef ; sh:minCount 1 ] ;
  sh:property [ sh:path comm:supportedByEvidence ; sh:minCount 1 ] ;
  sh:property [ sh:path comm:writesAuditRecord ; sh:minCount 1 ; sh:maxCount 1 ] .

comm:PIIRedactionShape a sh:NodeShape ;
  sh:targetClass comm:ThreadParticipant ;
  sh:property [ sh:path comm:maskedContactRef ; sh:minCount 1 ] ;
  sh:property [ sh:path comm:rawContactValue ; sh:maxCount 0 ] .

comm:EmailActionCardShape a sh:NodeShape ;
  sh:targetClass comm:EmailActionCard ;
  sh:property [ sh:path comm:mode ; sh:hasValue "EMAIL_DRAFT" ] ;
  sh:property [ sh:path comm:ontologyUse ; sh:minCount 1 ] ;
  sh:property [ sh:path comm:replyStance ; sh:minCount 1 ] ;
  sh:property [ sh:path comm:sendStatus ; sh:minCount 1 ] .
```

### 3.6 Foundry Object Model

| Foundry object | Ontology class | Primary key | Links |
|---|---|---|---|
| `COMMUNICATION_EVENT` | `CommunicationEvent` | `eventId` | Thread, target object, attachment |
| `MESSAGE_THREAD` | `MessageThread` | `threadId` | Messages, action requests, target objects |
| `ACTION_REQUEST` | `ActionRequest` | `requestId` | Thread, assignee role, due time |
| `APPROVAL_ACTION` | `ApprovalAction` | `actionId` | Request, evidence, audit record |
| `AUDIT_RECORD` | `AuditRecord` | `auditId` | Actor role, source evidence, before/after refs |
| `SLA_CLOCK` | `SLAClock` | `clockId` | Thread/action, escalation |
| `PII_REDACTION_RECORD` | `PIIRedactionRecord` | `redactionId` | Participant, mask policy |

---

## 4. Integration (Foundry↔ERP/WMS/ATLP/Invoice)

### 4.1 Source System Interfaces

| Source | Input | Output in CONSOLIDATED-08 | Ownership boundary |
|---|---|---|---|
| Gmail / Outlook | Message metadata, subject/body hash, attachment manifest | `EmailMessage`, `EvidenceAttachment`, `MessageThread` | Does not create shipment truth |
| Email draft UI | User-provided email text and draft request | `EmailDraftArtifact`, `EmailActionCard` | Does not auto-call `sct_ontology` and does not create KG action |
| WhatsApp / Telegram / Teams | Message ID, group, timestamp, sender role, content hash | `ChatMessage`, `CommunicationIntent`, `SLAClock` | Does not create approved action |
| Document store / LDG | Document pointer, VerificationResult, OCR discrepancy | `DocumentPointer`, `linkedToVerification` | LDG owns document validation |
| ERP / WMS / ATLP | Object identifiers and status references | `ObjectPointer` to ShipmentUnit/WarehouseTask/ReleaseOrder | Target system owns transaction |
| Invoice / CostGuard | Invoice clarification and approval request | `ActionRequest`, `ApprovalAction`, `AuditRecord` | Cost domain owns verdict |
| Port / OFCO | Port service clarification and release evidence discussion | `CommunicationEvent` linked to `PortCall`/`ServiceEvent` | Port domain owns port event |
| FMC Org Chart | Role, site, designation, masked contact reference | `ThreadParticipant`, `RoleAssignment` | Raw PII remains outside KG |

### 4.2 Canonical Ingestion Pipeline

```text
1. Channel collector
   - Collect message metadata, timestamp, channel, sender role, recipient role.
   - Store raw body only in approved secure store if policy permits.

2. Redaction gate
   - Replace phone/e-mail with masked references.
   - Preserve role, site, designation, organization unit, and hash join key.

3. Thread resolver
   - Join by message thread id, subject hash, object key, date window, and sender/receiver role.
   - Do not merge unrelated shipments only because the same person appears.

4. Intent classifier
   - Classify as INFO, REQUEST, APPROVAL, ESCALATION, CLARIFICATION, CLAIM, COST_QUERY.
   - Store classifier version and confidence.

5. Object linker
   - Resolve HVDC_CODE, BL, DO, BOE, invoice, container, package, PO, site, warehouse, exception, claim.
   - Attach unresolved keys to `UnresolvedEvidenceKey`.

6. Action gate
   - Create `ActionRequest` if action is required.
   - Create `ApprovalAction` only when actor role is authorized and evidence exists.

7. Audit write
   - Write `AuditRecord` with evidence hash, before/after object references, and reviewer role.
```

### 4.3 Any-key Resolution Inputs

| Key type | Communication evidence field | Target class |
|---|---|---|
| `HVDC_CODE` | `mentionedKey` / `subjectKey` | `ShipmentUnit`, `Package`, `MaterialMaster` |
| BL / Container / Seal | `mentionedTransportKey` | `BillOfLadingDocument`, `Container`, `JourneyLeg` |
| BOE / DO / Permit | `mentionedReleaseKey` | `CustomsEntry`, `ReleaseOrder`, `PermitDocument` |
| Invoice / OFCO / SAFEEN / ADP | `mentionedCostKey` | `Invoice`, `InvoiceLine`, `PortServiceEvent` |
| Warehouse / Bin / Yard | `mentionedWarehouseKey` | `WarehouseTask`, `StockSnapshot`, `WarehouseHandlingProfile` |
| Site / AGI / DAS / MIR / SHU | `mentionedSiteKey` | `SiteReceipt`, `LocationNode` |
| OSDR / NCR / Claim | `mentionedExceptionKey` | `Exception`, `NCR`, `Claim` |

### 4.4 Target Object Update Guard

| Message content | Allowed automatic output | Requires human-gated action |
|---|---|---|
| "Please approve DO release" | `ActionRequest(type=RELEASE_APPROVAL)` | Yes, before release update |
| "Invoice line is accepted" | `ApprovalAction(decision=APPROVED)` if actor is authorized | Yes, before CostGuard closure |
| "Cargo is damaged" | `CommunicationEvent` + `ActionRequest(type=OSD_INSPECTION)` | Yes, before NCR/Claim creation |
| "AGI delivery confirmed" | `CommunicationEvent` with site delivery evidence | Yes, before M130 site receipt if no system event |
| "Storage class confirmed" | Evidence attached to WHP review | Yes, WHP remains warehouse-owned |
| "답장 작성하라" / "draft reply" | `EmailActionCard` + draft body | No, unless user explicitly requests ontology review or action registration |
| "sct_ontology 사용 후 답장" | `EmailActionCard(ontologyUse=EXPLICIT_ONTOLOGY)` + separate `OntologyReview` + draft | Yes, if review result is used for operational mutation |

### 4.5 Email Drafting Output Contract

Email draft outputs must be structurally predictable:

1. `EmailActionCard` first.
2. `Draft` second.
3. `Notes` optional and limited to missing input or send-risk.
4. `OntologyReview` forbidden unless explicitly requested.
5. No `WARN/HIGH/CRITICAL` ontology verdict banner in normal draft mode; use `reply_stance` and `send_status` instead.

Example for a hold/request-info reply:

```text
[EMAIL_ACTION_CARD]
mode: EMAIL_DRAFT
ontology_use: NO_AUTO_SCT_ONTOLOGY
reply_stance: HOLD
blocking_inputs: HE forwarder PIC, booking availability, OEM receiving readiness, cargo dims/wt/condition
next_action: request HE forwarder and OEM receiving confirmation before shipment decision
send_status: DRAFT_READY
[/EMAIL_ACTION_CARD]
```

---

## 5. Validation (SPARQL/RAG/Human-gate)

### 5.0 Prompt-level Gate — Email Drafting

| Rule ID | Trigger | Required output | Block condition |
|---|---|---|---|
| `COMM-DRAFT-001` | reply/draft email request | `EmailActionCard` + draft | missing hard-marked card |
| `COMM-DRAFT-002` | reply/draft email request | `ontology_use = NO_AUTO_SCT_ONTOLOGY` | `sct_ontology` invoked without explicit trigger |
| `COMM-DRAFT-003` | mixed draft + ontology request | separated Email lane and Ontology lane | ontology verdict mixed into email body |
| `COMM-DRAFT-004` | action/register request absent | no KG `ActionRequest` write | card converted into operational action without instruction |

### 5.1 SPARQL — Communication must not own logistics state

```sparql
SELECT ?msg ?badPredicate WHERE {
  ?msg a comm:CommunicationEvent .
  ?msg ?badPredicate ?value .
  FILTER(?badPredicate IN (
    hvdc:hasRoutingPattern,
    hvdc:hasJourneyStage,
    hvdc:hasMilestoneStatus,
    wh:confirmedFlowCode,
    cost:costGuardVerdict
  ))
}
```

Expected result: **0.00 rows**. Communication can reference target objects, not set these fields.

### 5.2 SPARQL — ApprovalAction completeness

```sparql
SELECT ?action WHERE {
  ?action a comm:ApprovalAction .
  FILTER NOT EXISTS { ?action comm:decision ?decision }
  UNION
  { FILTER NOT EXISTS { ?action comm:actorRole ?role } }
  UNION
  { FILTER NOT EXISTS { ?action comm:targetObjectRef ?target } }
  UNION
  { FILTER NOT EXISTS { ?action comm:supportedByEvidence ?evidence } }
  UNION
  { FILTER NOT EXISTS { ?action comm:writesAuditRecord ?audit } }
}
```

Expected result: **0.00 rows** before any operational mutation.

### 5.3 SPARQL — Open action breach list

```sparql
SELECT ?request ?dueAt ?thread ?target WHERE {
  ?request a comm:ActionRequest ;
           comm:dueAt ?dueAt ;
           comm:requestStatus "OPEN" ;
           comm:targetObjectRef ?target ;
           comm:openedByMessage ?msg .
  ?msg comm:belongsToThread ?thread .
  FILTER(?dueAt < NOW())
}
ORDER BY ?dueAt
```

Use for SLA escalation and daily action backlog.

### 5.4 SPARQL — PII leakage candidate

```sparql
SELECT ?node ?field WHERE {
  ?node ?field ?value .
  FILTER(?field IN (comm:rawPhone, comm:rawEmail, comm:rawContactValue))
}
```

Expected result: **0.00 rows**. Raw contact values remain in secured source systems or are masked before register write.

### 5.5 SPARQL — Evidence link completeness

```sparql
SELECT ?thread WHERE {
  ?thread a comm:MessageThread .
  FILTER NOT EXISTS { ?thread comm:referencesObject ?target }
  FILTER NOT EXISTS { ?thread comm:triageStatus "GENERAL_BROADCAST" }
}
```

Expected result: **0.00 unresolved operational threads**.

### 5.6 RAG Check Rules

| RAG item | Trigger | Required action |
|---|---|---|
| Regulation or authority instruction | MOIAT/FANR/DCD/ADNOC/CICPA/Port authority wording appears | Attach source document and action date |
| Commercial approval | Cost, rate, invoice, DEM/DET, variation wording appears | Link to CostGuard / Contract / ApprovalAction |
| Operational exception | Delay, damage, shortage, OSD, NCR, claim wording appears | Open `ActionRequest` and evidence pack |
| Site delivery | AGI/DAS/MIR/SHU arrival wording appears | Link to milestone candidate and require material gate |
| Privacy | Phone/e-mail/person contact fields appear | Apply `PIIRedactionRecord` before KG write |

### 5.7 Human-gate

Human-gate is mandatory when any of the following is true:

| Condition | Gate |
|---|---|
| Cost exposure > 100,000.00 AED | Cost owner approval |
| Regulatory statement or permit validity affects release | Compliance owner approval |
| M130 site receipt is inferred from communication only | Material handling owner approval |
| WH handling class is referenced in communication | Warehouse owner approval |
| Marine stability/lashing/lift approval is discussed | Marine / engineering owner approval |
| Raw contact PII is detected | Data protection owner approval before write |

---

## 6. Compliance (Incoterms/MOIAT/FANR/DCD/ADNOC)

### 6.1 Compliance Role

`CONSOLIDATED-08` does not decide compliance. It stores evidence of communication, approvals, and audit lineage for compliance-related decisions.

| Compliance area | Communication evidence | Target owner |
|---|---|---|
| Incoterms 2020 | Cost/risk responsibility clarification, handover discussion | Contract / Cost domain |
| MOIAT / Customs | BOE, certificate, exemption, clearance discussion | Customs / Document domain |
| FANR | Nuclear/radiation-related certificate discussion | Compliance owner |
| DCD / DG | Dangerous goods permit and safety note discussion | Warehouse / HSE / Document domain |
| ADNOC / CICPA / GatePass | Site/offshore access and gate pass approval evidence | Material handling / Site / Port |
| Port authority / SAFEEN / ADP | Service clarification, berth/gate discussion | Port operations |
| Data privacy | PII masking and access control records | Data governance |

### 6.2 Access and Privacy Guard

1. Raw body text is optional. The evidence graph can operate using `bodyHash`, `summary`, `attachmentHash`, and `object pointers`.
2. Phone/e-mail from the organization chart is masked before any register write.
3. Names may be retained only as role-linked participant labels when project policy permits.
4. Sensitive threads receive `sensitivityLabel = CONFIDENTIAL` or `PII_MASKED`.
5. Legal hold threads cannot be auto-archived without a retention policy action.

### 6.3 Audit Retention

| Evidence type | Retention recommendation | Notes |
|---|---|---|
| ApprovalAction | Project closeout + contractual retention | Required for release/cost/compliance decisions |
| AuditRecord | Same as target transaction | Keep before/after refs |
| MessageThread summary | Project closeout + audit window | Keep hash and role metadata |
| Raw message body | Policy-controlled secure store | Not required inside KG |
| Attachment manifest | Same as referenced document | Hash required |
| PII redaction log | Same as communication register | No raw PII |

---

## 7. Options ≥3 (Pros/Cons/Cost/Risk/Time)

| Option | Scope | Pros | Cons | Est. cost | Risk | Time |
|---|---|---|---|---:|---|---:|
| A | Evidence Register Lite | Fast deployment; thread/action visibility; low integration complexity | Limited automation; manual target linking | 30,000.00 AED | MEDIUM | 2.00 weeks |
| B | Approval & SLA Control | ApprovalAction, SLAClock, escalation, audit proof | Needs role model and access policy | 75,000.00 AED | MEDIUM | 4.00 weeks |
| C | RAG Evidence Copilot | Summaries, intent classification, unresolved action extraction | Requires model governance and confidence gating | 120,000.00 AED | HIGH | 6.00 weeks |
| D | Integrated Communication Twin | Full linkage to LDG, CostGuard, WMS, Port, Material, Ops dashboards | Highest governance and integration load | 180,000.00 AED | HIGH | 8.00 weeks |

Recommended baseline: **Option B** for immediate approval/SLA control. Scale to **Option D** when target object links and PII redaction policy are stable.

---

## 8. Roadmap (Prepare→Pilot→Build→Operate→Scale + KPI)

| Phase | Duration | Work package | KPI |
|---|---:|---|---|
| Prepare | 1.00 week | Define channel list, role dictionary, PII mask policy, evidence target classes | Role coverage ≥ 95.00% |
| Pilot | 2.00 weeks | Ingest sample email/chat threads, build `MessageThread`, link to 3.00 target domains | Link precision ≥ 90.00% |
| Build | 3.00 weeks | Add `ActionRequest`, `ApprovalAction`, `SLAClock`, `AuditRecord`, SHACL gates | Approval completeness ≥ 98.00% |
| Operate | Ongoing | Daily unresolved-action report, SLA breach alert, audit pack creation | SLA breach resolution ≤ 24.00 hrs |
| Scale | 4.00 weeks | Add RAG summarization, cross-domain evidence search, Ops dashboard hooks | CommunicationLinkCoverage ≥ 95.00% |

---

## 9. Automation notes (RPA/LLM/Sheets/TG hooks)

### 9.1 Foundry Functions

| Function | Input | Output | Guard |
|---|---|---|---|
| `normalizeMessageEvent` | raw channel payload | `CommunicationEvent` | PII redaction pre-check |
| `resolveMessageThread` | message metadata + target keys | `MessageThread` | Avoid cross-shipment false merge |
| `classifyCommunicationIntent` | message summary + attachments | `CommunicationIntent` | Store confidence and classifier version |
| `openActionRequest` | intent + target object | `ActionRequest` | Require target or triage status |
| `recordApprovalAction` | request + actor role + decision | `ApprovalAction` + `AuditRecord` | Check authorization |
| `createEvidencePack` | thread + target object + attachments | `ProofArtifact` | Hash required |
| `emailDraftGuard` | email text + draft request | `EmailActionCard` + draft | `NO_AUTO_SCT_ONTOLOGY` unless explicit trigger |
| `escalateBreachedSLA` | SLAClock | `EscalationRecord` | Business hours calendar |

### 9.2 RPA / Messaging Hooks

```text
/email-intake --source=gmail --mask-pii --link-anykey
/chat-intake --source=telegram --mask-pii --open-actions
/approval-gate --target=<objectKey> --evidence=<threadId> --human-gate
/sla-watch --domain=release,cost,claim --threshold=24.00h
```

### 9.3 LLM Guardrail

| LLM output | Allowed use | Not allowed |
|---|---|---|
| Thread summary | Analyst review, audit pack prefill | Operational fact without evidence |
| Intent classification | Queue routing | Approval decision |
| Key extraction | Candidate object linking | Identity resolution without confidence |
| Risk note | Escalation hint | Regulatory interpretation as fact |
| Email draft | Reply composition | Automatic ontology verdict or KG mutation |
| EmailActionCard | Draft triage and send-readiness | Replacement for `ActionRequest` without explicit user instruction |

### 9.4 Sheets / Dashboard Hooks

| Sheet / dashboard | Metric | Source |
|---|---|---|
| Daily Action Backlog | Open actions by domain and owner role | `ActionRequest` |
| Approval Completeness | ApprovalAction with evidence and audit | `ApprovalAction` |
| SLA Breach Heatmap | Breach count by domain/site | `SLAClock` |
| Exception Communication | OSD/NCR/Claim threads by age | `MessageThread` + `Exception` |
| PII Compliance | Redaction coverage and leakage count | `PIIRedactionRecord` |

---

## 10. QA checklist & Assumptions

### 10.1 QA Checklist

| # | Check | Expected |
|---:|---|---|
| 1.00 | `CommunicationEvent` has channel and eventTime | PASS |
| 2.00 | Every actionable thread has `ActionRequest` or triage status | PASS |
| 3.00 | `ApprovalAction` has actorRole, decision, target, evidence, audit | PASS |
| 4.00 | No communication object writes route, milestone, cost verdict, or WH handling class directly | PASS |
| 5.00 | Raw phone/e-mail fields are absent from KG | PASS |
| 6.00 | Every attachment has artifact hash | PASS |
| 7.00 | Every audit record has evidence hash | PASS |
| 8.00 | RAG summaries are marked as summaries, not evidence truth | PASS |
| 9.00 | MOSB is described as offshore staging / marine interface only | PASS |
| 10.00 | SLAClock closedAt cannot precede startAt | PASS |
| 11.00 | High-value cost approval has Human-gate | PASS |
| 12.00 | Regulatory statements require current source/evidence link | PASS |
| 13.00 | Communication object links to at least one target or `GENERAL_BROADCAST` triage | PASS |
| 14.00 | Names from FMC role data do not expose phone/e-mail | PASS |
| 15.00 | LLM confidence is stored for intent classification | PASS |
| 16.00 | Authorized actor role is checked before approval mutation | PASS |
| 17.00 | Cross-domain target objects are referenced, not redefined | PASS |
| 18.00 | Validation p95 remains < 5.00s for indexed keys | PASS |
| 19.00 | All operational updates write before/after object refs | PASS |
| 20.00 | ZERO/Failsafe table used when evidence is insufficient | PASS |

### 10.2 Assumptions

| Assumption | Impact | Mitigation |
|---|---|---|
| Email/chat channels can provide stable message IDs or hashes | Thread resolution depends on stable keys | Store channel-specific fallback hash |
| Project role dictionary is approved | Actor authorization depends on role | Keep role approval as Prepare-phase gate |
| Raw message storage policy may differ by channel | KG may not store bodies | Use body hash + summary + attachment manifest |
| FMC contact data contains PII | Raw contact values cannot be written to KG | Apply mask and hash before register write |
| RAG/LLM confidence may be imperfect | Wrong target linkage risk | Human-gate low-confidence action |

### 10.3 ZERO / Fail-safe

| 단계 | 이유 | 위험 | 요청데이터 | 다음조치 |
|---|---|---|---|---|
| Evidence write paused | Target object unresolved or PII unmasked | False linkage / privacy leakage | HVDC key, source message hash, role confirmation | Run `resolveAnyKey` and redaction gate |
| Approval action paused | Actor role not authorized | Unauthorized transaction update | RoleAssignment and approval matrix | Human-gate by domain owner |
| Compliance summary paused | Current authority source missing | Wrong release decision | Permit/SOP/source document and action date | RAG verification and compliance review |
| Operational mutation paused | Message is only a request or claim | Transaction truth contamination | Approved action and evidence pack | Foundry Action after reviewer approval |

---

## 11. CmdRec

```text
/switch_mode LATTICE + /logi-master report --deep --KRsummary
/logi-master cert-chk --deep --KRsummary
/logi-master kpi-dash --communication-sla --noheatmap
```
