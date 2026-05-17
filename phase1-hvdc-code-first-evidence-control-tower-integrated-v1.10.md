# Integrated Specification and Detailed Design: Phase 1 HVDC Code-first Evidence Control Tower v1.10

Integrated From:

- `phase1-hvdc-code-first-evidence-control-tower-Spec.md`
- `phase1-hvdc-code-first-evidence-control-tower-v1.10.md`

Generated: 2026-05-16
Status: Integrated Draft
Version: `v1.10.0-integrated.1`

---

## Integration Map

| Part   | Source                                                   | Purpose                                                                                                     |
| ------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Part 1 | `phase1-hvdc-code-first-evidence-control-tower-Spec.md`  | Testable feature specification, user stories, FR/NFR, success criteria, traceability, approval readiness    |
| Part 2 | `phase1-hvdc-code-first-evidence-control-tower-v1.10.md` | Detailed design baseline, UI direction, data model, rules, permissions, rollback, export scope, MVP backlog |

## Integration Rules

- The feature specification is the acceptance and verification control layer.
- The v1.10 detailed design is the implementation and handoff baseline.
- If wording overlaps, the specification section defines testable acceptance language and the detailed design section preserves operational detail.
- Cost and customs final judgment remain outside Phase 1.
- Original documents, contract/rate data, and P2/PII exposure remain blocked from Phase 1 export and prompt payloads.

---

# Part 1. Feature Specification

Feature ID/Branch: `phase1-hvdc-code-first-evidence-control-tower`  
Created: 2026-05-16  
Status: Draft  
Owner: `[NEEDS CLARIFICATION: 최종 Product Owner / Business Owner 역할 지정 필요]`  
Input: Uploaded `Phase 1 HVDC Code-first Evidence Control Tower v1.10` detailed design  
Last Updated: 2026-05-16  
Version: `v1.10.0-spec.1`

---

### Summary

#### Problem

현재 HVDC 물류 추적은 `BL`, `Container`, `Invoice`, `BOE`, `DO`, `WH Report`, `Site Receipt`가 서로 다른 문서·파일·메일·엑셀에 분산되어 있다.

운영자는 실제로 다음 질문에 답해야 한다.

- “이 `HVDC Code` 자재가 어디까지 왔는가?”
- “어떤 문서가 부족한가?”
- “`BL` / `BOE` / `DO` / `WH` / `Site` evidence가 서로 맞는가?”
- “누가 다음 조치를 해야 하는가?”

기존 `BL-first` 추적 방식은 해상운송 tracking에는 적합하지만, 자재·패키지·현장 수령 중심의 운영 추적에는 한계가 있다. Phase 1은 `HVDC Code`를 primary search key로 사용하고, 관련 `ShipmentUnit`과 evidence를 역방향으로 연결하는 Evidence Control Tower를 제공한다.

#### Goals

- G1: 사용자가 `HVDC Code`로 3.00초 이내 관련 `ShipmentUnit` 후보와 evidence status를 조회할 수 있다.
- G2: `HVDC Code`, `Package No`, `PO No`, `Material Code`, `Container No`, `BL No`, `BOE No`, `DO No`, `WH Receipt`, `Site Receipt`, `Invoice No`로 any-key search를 수행할 수 있다.
- G3: `ShipmentUnit`을 중심 객체로 하여 `CI`, `PL`, `BL`, `BOE`, `DO`, `Invoice`, `WH`, `Site` evidence를 통합 표시한다.
- G4: 문서 누락·불일치·partial shipment·source priority conflict를 자동 탐지하고 `Exception Queue`에 owner와 severity를 배정한다.
- G5: `Approve Link`, `Reject Link`, `Rollback`, `Redacted Export`, `Report Publication` 등 controlled action은 `Human Gate`와 `AuditRecord`를 반드시 거친다.
- G6: Phase 1은 evidence link와 discrepancy detection까지만 수행하고, cost/customs 최종 판단은 차단한다.
- G7: KPI 측정을 위해 모든 핵심 action을 event schema로 기록한다.
- G8: P2 정보, 원문 문서, 계약·단가·PII가 redacted export 또는 LLM prompt에 노출되지 않도록 한다.

#### Non-Goals

- NG1: Invoice overcharge judgment, cost approval, tariff/rate judgment는 Phase 1 범위가 아니다.
- NG2: HS final classification, customs release approval, BOE 기반 통관 최종 판단은 Phase 1 범위가 아니다.
- NG3: Vendor/carrier에게 자동 이메일 또는 외부 메시지를 발송하지 않는다.
- NG4: Original document public export를 제공하지 않는다.
- NG5: `Document` evidence가 단독으로 operational truth, stock truth, site acceptance, shipment final status를 override하지 않는다.
- NG6: Contract/rate/PII 원문을 Phase 1 data store, export, prompt payload에 포함하지 않는다.
- NG7: Full ERP/WMS/TMS master data governance 또는 master truth 수정 workflow는 Phase 1 범위가 아니다. 단, 변경이 필요한 경우 Human Gate와 audit이 필요하다.

#### Scope Summary

| Area       | In Scope                                                           | Out of Scope                                                      |
| ---------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Search     | `HVDC Code` primary search, secondary identifier search            | 비식별 자연어 검색                                                |
| Data Spine | `ShipmentUnit` 중심 evidence 연결                                  | ERP/WMS/TMS master truth 변경                                     |
| Evidence   | CI/PL/BL/BOE/DO/Invoice/WH/Site matrix                             | 원문 문서 외부 공개                                               |
| Rules      | HK/DG/EX/RB rule 기반 exception 생성                               | Cost/customs 최종 승인                                            |
| Control    | Human Gate, Audit, Rollback                                        | 무승인 write/export/send                                          |
| Export     | Redacted dashboard, exception list, evidence matrix, audit summary | Original document, invoice amount report, customs approval report |

---

### User Scenarios & Testing

#### User Story 1 - HVDC Code로 ShipmentUnit 및 Evidence 조회 (Priority: P1)

사용자는 `HVDC Code`를 입력해 관련 `ShipmentUnit`, identifier graph, document matrix, WH/Site timeline, exception, audit trail을 확인한다.

Why this priority: `HVDC Code-first`가 본 시스템의 핵심 가치이며, 기존 `BL-first` 운영 한계를 직접 해결한다.

Independent Test: Redacted sample 100.00건 중 `HVDC Code`가 존재하는 케이스를 입력하고, 3.00초 이내 후보, confidence, evidence matrix, risk status가 표시되는지 검증한다.

Acceptance Scenarios:

1. Given 유효한 `HVDC Code`가 `HVDCCodeTag`에 존재한다, When 사용자가 global search에 해당 코드를 입력한다, Then 시스템은 3.00초 이내 관련 `ShipmentUnit` 후보와 confidence score를 반환한다.
2. Given `HVDC Code`가 하나의 `ShipmentUnit`에 연결되어 있다, When 사용자가 결과를 연다, Then 시스템은 `Identifier Graph`, `Document Matrix`, `WH/Site Timeline`, `Exception Panel`, `Audit Trail`을 표시한다.
3. Given 검색 결과의 confidence가 `0.80~0.91`이다, When 결과가 표시된다, Then 시스템은 `Review recommended` 상태로 표시하고 link confirmation을 자동 수행하지 않는다.
4. Given 검색 결과가 없다, When 사용자가 `HVDC Code`를 입력한다, Then 시스템은 `No linked ShipmentUnit found`와 `Create Mapping Request` action을 제공한다.

---

#### User Story 2 - Secondary Identifier로 역추적 검색 (Priority: P1)

사용자는 `Package No`, `PO No`, `Container No`, `BL No`, `BOE No`, `DO No`, `Invoice No` 등 secondary key를 입력해 가장 가까운 객체와 `ShipmentUnit`을 찾고, 연결된 `HVDC Code` 유무를 확인한다.

Why this priority: 운영 문서에는 `HVDC Code`가 항상 존재하지 않을 수 있으므로 fallback search가 필요하다.

Independent Test: `HVDC Code`가 누락된 `BL`, `Container`, `Invoice`, `BOE`, `DO`, `WH/Site` sample을 입력하고, 시스템이 mapping required exception을 생성하는지 검증한다.

Acceptance Scenarios:

1. Given 사용자가 `BL No`를 입력한다, When 시스템이 identifier type을 감지한다, Then 시스템은 해당 BL에 연결된 `ShipmentUnit`과 `HVDC Code` 후보를 반환한다.
2. Given `Container No`는 존재하지만 연결된 `HVDC Code`가 없다, When 검색이 완료된다, Then 시스템은 `HVDC_CODE_MISSING` 상태와 `mapping.required` event를 생성한다.
3. Given `Invoice No`만 있고 shipment evidence가 없다, When 검색이 완료된다, Then 시스템은 `AMBER` severity의 cost evidence link request를 생성하고 cost judgment는 수행하지 않는다.

---

#### User Story 3 - Document Matrix와 Document Guard로 불일치 처리 (Priority: P1)

Document Controller는 `ShipmentUnit`의 `CI`, `PL`, `BL`, `BOE`, `DO`, `Invoice` evidence 상태와 confidence를 확인하고, 문서 누락·불일치 exception을 처리한다.

Why this priority: 문서 정합성은 evidence control의 핵심이며, owner assignment와 audit이 필요하다.

Independent Test: 문서 누락, quantity mismatch, container mismatch, BOE ref missing, OCR confidence low sample을 입력하고 예상 severity 및 owner가 생성되는지 확인한다.

Acceptance Scenarios:

1. Given `PL` gross weight와 `BL` gross weight 차이가 tolerance를 초과한다, When `Document Guard`가 실행된다, Then 시스템은 `DG-004` exception을 생성하고 severity를 tolerance 기준에 따라 `AMBER` 또는 `BLOCK`으로 설정한다.
2. Given `BL` container와 `DO` container가 다르다, When `Document Guard`가 실행된다, Then 시스템은 `DG-005` `BLOCK` exception을 생성하고 owner를 `Port Ops`로 배정한다.
3. Given key field OCR confidence가 `0.92` 미만이다, When field extraction이 완료된다, Then 시스템은 해당 field를 manual review 대상으로 표시하고 자동 확정하지 않는다.
4. Given `BOE` evidence가 존재한다, When 사용자가 `Customs Approval`을 요청한다, Then 시스템은 Phase 1 boundary violation으로 `BLOCK` 처리한다.

---

#### User Story 4 - Partial Shipment 식별 및 검토 (Priority: P1)

Logistics Lead는 하나의 `HVDC Code`가 여러 `ShipmentUnit`에 split되는 경우 partial shipment evidence를 확인하고, split evidence가 없으면 exception을 처리한다.

Why this priority: 동일 `HVDC Code`의 다중 연결은 정상 partial shipment일 수도 있고 잘못된 mapping일 수도 있다.

Independent Test: multi-link HVDC sample 10.00건과 partial shipment sample 10.00건을 입력해 split evidence 존재 여부에 따른 `INFO`, `AMBER`, `BLOCK` 처리를 검증한다.

Acceptance Scenarios:

1. Given 하나의 `HVDC Code`가 여러 `ShipmentUnit`에 연결되어 있고 split evidence가 존재한다, When 사용자가 detail 화면을 연다, Then 시스템은 `Partial Shipment` badge와 split qty/package/site를 표시한다.
2. Given 하나의 `HVDC Code`가 여러 `ShipmentUnit`에 연결되어 있지만 split evidence가 없다, When partial shipment check가 실행된다, Then 시스템은 `HK-011` `AMBER` exception과 evidence request를 생성한다.
3. Given 동일 `HVDC Code`가 서로 다른 site에 연결되어 있고 split evidence가 없다, When rule check가 실행된다, Then 시스템은 `HK-012` `BLOCK` exception을 생성한다.

---

#### User Story 5 - Human Gate 승인, Audit, Rollback (Priority: P1)

승인 권한을 가진 사용자는 proposed link를 검토하고 approve/reject/request evidence/escalate 중 하나를 선택한다. 잘못 승인된 link는 Human Gate를 통해 rollback한다.

Why this priority: operational truth를 변경하는 action은 무승인 자동 실행되면 안 된다.

Independent Test: link proposal, approve, reject, rollback request, rollback approval 시나리오를 실행하고 audit coverage가 100.00%인지 검증한다.

Acceptance Scenarios:

1. Given proposed `HVDC Code ↔ ShipmentUnit` link가 존재한다, When Logistics Lead가 approve한다, Then 시스템은 link status를 `CONFIRMED`로 변경하고 `link.approved`, `audit.created` event를 기록한다.
2. Given 사용자가 approval 권한이 없다, When approve link를 시도한다, Then 시스템은 action을 차단하고 audit/security event를 기록한다.
3. Given 승인된 link가 잘못된 것으로 확인된다, When Logistics Lead가 rollback을 요청하고 승인한다, Then 시스템은 이전 link 상태를 복원하고 `rollback.completed`, `audit.created` event를 기록한다.
4. Given rollback 대상 audit record가 존재하지 않는다, When rollback이 요청된다, Then 시스템은 `RB-002` `BLOCK` exception을 생성한다.

---

#### User Story 6 - Redacted Export 생성 및 차단 (Priority: P2)

Logistics Lead는 redacted dashboard, exception list, evidence matrix, audit summary를 export할 수 있다. P2, 원문 문서, invoice amount, customs approval language가 포함되면 export는 차단된다.

Why this priority: 운영 보고에는 export가 필요하지만 P2 leakage를 방지해야 한다.

Independent Test: export payload에 PII, contract/rate, original document link, invoice amount, BOE/HS approval language가 포함된 케이스를 입력하고 차단 여부를 검증한다.

Acceptance Scenarios:

1. Given redacted evidence matrix export가 요청된다, When sanitizer가 P2 미포함을 확인하고 Human Gate 승인이 완료된다, Then 시스템은 export를 생성하고 `export.completed`, `audit.created` event를 기록한다.
2. Given original document export가 요청된다, When export rule이 실행된다, Then 시스템은 `EX-002` `BLOCK`으로 export를 차단한다.
3. Given export payload에 PII 또는 contract/rate가 포함되어 있다, When sanitizer가 실행된다, Then 시스템은 `ZERO` severity로 export를 차단하고 보안 audit을 기록한다.

---

#### Edge Cases

- EC1: `HVDC Code` no match -> `mapping.required` exception 생성, 자동 link 금지.
- EC2: secondary identifier만 존재하고 `HVDC Code`가 없음 -> nearest `ShipmentUnit` 표시 후 mapping request 생성.
- EC3: candidate score `< 0.60` -> no link 처리, review 없이 자동 연결 금지.
- EC4: candidate score `0.60~0.79` -> weak candidate로 표시, controlled action 금지.
- EC5: candidate score `0.80~0.91` -> review recommended, Human Gate 필요.
- EC6: candidate score `≥ 0.92` -> auto candidate로 제안 가능하나 link confirmation은 Human Gate 필요.
- EC7: `CI` 또는 `PL` 누락 -> `AMBER` exception 및 evidence request 생성.
- EC8: `Site Receipt Qty > WH Dispatch Qty`이고 correction/split evidence 없음 -> `BLOCK`.
- EC9: `BOE`에 `BL/container` reference 없음 -> `BLOCK`, customs evidence request 생성.
- EC10: cost/customs final judgment 요청 -> `BLOCK`, Phase 1 boundary copy 표시.
- EC11: P2가 input/export/event payload에 감지됨 -> `ZERO` 또는 `BLOCK`, 원문 저장/전송 금지.
- EC12: 승인 actor 없이 export 또는 report publication 요청 -> `BLOCK`.
- EC13: keyboard-only flow에서 search→detail→exception review가 불가능함 -> release 금지.
- EC14: required event schema 누락으로 KPI 측정 불가 -> Gate Stop.

---

### Requirements

#### Functional Requirements

##### Search & Identifier Resolution

- FR-001: System MUST provide global search with `HVDC_CODE` as the primary search key.
- FR-002: System MUST support secondary search keys: `Package No`, `PO No`, `Material Code`, `Container No`, `BL No`, `BOE No`, `DO No`, `WH Receipt`, `Site Receipt`, `Invoice No`.
- FR-003: System MUST normalize input identifiers before matching.
- FR-004: System MUST detect identifier type from input pattern and optional key type hint.
- FR-005: System MUST resolve exact `HVDC_CODE` matches through `HVDCCodeTag` before using fallback identifiers.
- FR-006: System MUST traverse secondary identifiers to the nearest object and then to the nearest `ShipmentUnit`.
- FR-007: System MUST identify whether a resolved `ShipmentUnit` has linked `HVDC Code` values.
- FR-008: System MUST create a `mapping.required` exception when a secondary identifier resolves to a `ShipmentUnit` but no `HVDC Code` is linked.
- FR-009: System MUST score candidate resolution using match signals including `HVDC Code`, `Package No`, `PO No`, `Material Code`, `Container/BL linkage`, `WH/Site linkage`, and date/lane proximity.
- FR-010: System MUST classify candidate actions by score: `≥0.92 Auto candidate`, `0.80~0.91 Review recommended`, `0.60~0.79 Weak candidate`, `<0.60 No link`.
- FR-011: System MUST NOT confirm a candidate link automatically, regardless of confidence score.

##### ShipmentUnit Spine & Evidence View

- FR-012: System MUST use `ShipmentUnit` as the central spine object for Phase 1 evidence tracking.
- FR-013: System MUST display a `ShipmentUnit Overview` containing header, current stage, risk status, identifier graph, document matrix, WH/Site timeline, exception panel, audit trail, and available actions.
- FR-014: System MUST display `Identifier Graph` relationships among `HVDC Code`, `Package`, `PO`, `BL`, `Container`, `BOE`, `DO`, `Invoice`, `WH`, and `Site Receipt` where available.
- FR-015: System MUST display `Document Matrix` rows for `CI`, `PL`, `BL`, `BOE`, `DO`, and `Invoice` with present status, confidence, key fields, mismatch count, and action.
- FR-016: System MUST label `BOE` as evidence only and MUST NOT label it as customs approval.
- FR-017: System MUST label `Invoice` as evidence only and MUST NOT label it as cost approval or overcharge judgment.
- FR-018: System MUST show source priority notes when lower-priority sources conflict with higher-priority sources.

##### Document Guard & Exception Queue

- FR-019: System MUST execute `Document Guard` rules against evidence fields and generate rule results.
- FR-020: System MUST support rule severity values: `INFO`, `AMBER`, `BLOCK`, `ZERO`.
- FR-021: System MUST create exceptions with `ruleId`, `severity`, `status`, `ownerRole`, `message`, and evidence references.
- FR-022: System MUST assign an owner role for every created exception.
- FR-023: System MUST support exception statuses: `Open`, `In Review`, `Resolved`, `Escalated`.
- FR-024: System MUST detect missing or mismatched HVDC mapping using `HK-*` rules.
- FR-025: System MUST detect cross-document mismatches using `DG-*` rules.
- FR-026: System MUST detect export violations using `EX-*` rules.
- FR-027: System MUST detect rollback issues using `RB-*` rules.
- FR-028: System MUST apply numeric tolerance rules for quantity, gross weight, net weight, CBM, package count, and site receipt quantity.
- FR-029: System MUST apply date sequence rules for ETA, DO release, WH receipt, dispatch, site receipt, BOE declaration, and document revision.
- FR-030: System MUST block non-negotiable conditions: BL/DO container mismatch, destination mismatch, BOE without BL/container reference, site receipt qty exceeding dispatch qty without split evidence, and cost/customs final judgment request.

##### Partial Shipment

- FR-031: System MUST detect when one `HVDC Code` maps to multiple `ShipmentUnits`.
- FR-032: System MUST check whether valid partial shipment evidence exists for multi-link `HVDC Code` cases.
- FR-033: System MUST show `Partial Shipment` view with split quantity, split package, target site, and shipment leg when split evidence exists.
- FR-034: System MUST create `HK-011` `AMBER` exception when partial shipment evidence is missing.
- FR-035: System MUST create `HK-012` `BLOCK` exception when the same `HVDC Code` appears in different sites without split evidence.

##### Human Gate, Audit, Rollback

- FR-036: System MUST require Human Gate approval for confirming `HVDC Code ↔ ShipmentUnit` links.
- FR-037: System MUST require Human Gate approval for rejecting proposed links.
- FR-038: System MUST require Human Gate approval for rollback of approved links.
- FR-039: System MUST require Human Gate approval for controlled export and external report publication.
- FR-040: System MUST present Human Gate payload containing summary, reversibility, P2 access status, downstream impact, evidence references, confidence, and available decisions.
- FR-041: System MUST support Human Gate decisions: `APPROVE`, `REJECT`, `REQUEST_EVIDENCE`, `ESCALATE`.
- FR-042: System MUST create immutable audit records for OCR, link proposal, link approval, link rejection, review decision, correction, override, rollback, and export events.
- FR-043: System MUST preserve before/after state and evidence references in audit records for controlled actions.
- FR-044: System MUST support rollback requests for approved links.
- FR-045: System MUST restore prior link status after approved rollback and create rollback audit records.
- FR-046: System MUST detect whether rollback affects published exports and block rollback if required by `RB-004` pending review.

##### Roles & Permissions

- FR-047: System MUST enforce role-based permissions for search, evidence view, approve link, rollback, export, cost judgment, and customs approval.
- FR-048: System MUST allow `Logistics Lead` to search, view evidence, approve links, rollback, and export with gate.
- FR-049: System MUST allow `Document Controller` to search, view evidence, approve/reject links, and request rollback only.
- FR-050: System MUST allow `Site Material Controller` to search and view limited site evidence without approve/export rights.
- FR-051: System MUST allow `Customs Broker` to view customs evidence only and MUST NOT grant customs approval capability in Phase 1.
- FR-052: System MUST allow `Finance / CostGuard` to view invoice evidence only and MUST NOT grant cost judgment capability in Phase 1.
- FR-053: System MUST prevent `Admin` configuration authority from becoming cost/customs approval authority.

##### Export & P2 Handling

- FR-054: System MUST allow Phase 1 exports only for redacted dashboard, exception list, evidence matrix, and audit summary.
- FR-055: System MUST block original document export.
- FR-056: System MUST block invoice amount export unless handled by a future approved CostGuard phase.
- FR-057: System MUST block customs approval report export.
- FR-058: System MUST block vendor/carrier email or send actions in Phase 1.
- FR-059: System MUST run export sanitizer before any export is completed.
- FR-060: System MUST block export when PII, contract/rate, original document links, invoice amounts, or BOE/HS approval language are detected.
- FR-061: System MUST store source hash references instead of original source files in exportable payloads.
- FR-062: System MUST mask role/name, vendor, invoice amount, internal link, and sensitive identifiers according to P2 policy. `[NEEDS CLARIFICATION: exact field-level masking taxonomy required]`

##### Telemetry & KPI Events

- FR-063: System MUST emit required events for search, identifier resolution, mapping, link proposal, link approval/rejection, document ingestion, document guard run, exception lifecycle, review lifecycle, rollback, export, and audit.
- FR-064: System MUST include event payload fields required for KPI calculation: event name, event version, actor role, masked session/input, input type, result count, latency, confidence, shipment unit ID, HVDC code, risk status, P2 accessed flag, and timestamp where applicable.
- FR-065: System MUST NOT include P2 raw values in event payloads.
- FR-066: System MUST calculate KPI metrics from telemetry events without relying on manual spreadsheets.

##### UI / UX

- FR-067: System MUST provide a global search input with placeholder text covering HVDC Code and secondary identifiers.
- FR-068: System MUST show `HVDC Code-first` as a primary search mode indicator.
- FR-069: System MUST show fallback banner when `HVDC Code` is missing or unlinked.
- FR-070: System MUST show `Partial Shipment` badge when one `HVDC Code` maps to multiple `ShipmentUnits`.
- FR-071: System MUST provide screens or equivalent views for Search, ShipmentUnit Overview, Document Matrix, Exception Queue, Review Workspace, Rollback Center, and Export Center.
- FR-072: System MUST provide required UX copy distinguishing evidence links from cost/customs approvals.

#### Non-Functional Requirements

- NFR-001 (Performance): Search-to-answer time for supported identifiers MUST be `≤ 3.00 sec` at P95 on the simulation dataset.
- NFR-002 (Accuracy): Correct link accuracy after Human Gate review MUST be `≥ 95.00%` on the approved validation dataset.
- NFR-003 (Coverage): `HVDC Code → ShipmentUnit` link coverage MUST be `≥ 90.00%` on redacted sample 100.00건 before production pilot.
- NFR-004 (Security/Privacy): P2 leakage count in prompts, event payloads, UI export, and generated reports MUST be `0.00건`.
- NFR-005 (Auditability): All controlled actions MUST have audit coverage of `100.00%`.
- NFR-006 (Reliability): Rollback success for rollback-requested valid cases MUST be `≥ 95.00%`.
- NFR-007 (Accessibility): Keyboard-only operation MUST support search → detail → exception review without blocker defects.
- NFR-008 (Accessibility): Error messages MUST be programmatically associated with the relevant input using accessible descriptions.
- NFR-009 (Accessibility): Severity states MUST NOT rely on color alone; labels such as `AMBER`, `BLOCK`, and `ZERO` must be visible text.
- NFR-010 (Observability): Required event coverage MUST be `100.00%`; otherwise Gate status is `Stop`.
- NFR-011 (Fail-safe): Evidence shortage, P2 exposure risk, unauthorized action, or missing approval actor MUST result in `AMBER`, `BLOCK`, or `ZERO` handling, not silent success.
- NFR-012 (Data Integrity): Numeric values and dates used in rule evaluation MUST retain precision; value loss is a Gate `Stop` condition.
- NFR-013 (Maintainability): Rule sets for identifier resolution, document guard, source priority, tolerance, export sanitizer, and rollback MUST be versioned.

---

### Key Entities / Data

#### Core Entities

| Entity                    | Definition                                 | Key Attributes                                                                               |
| ------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `HVDCCodeTag`             | Canonical HVDC code tag                    | `hvdcCode`, `materialId`, `status`                                                           |
| `MaterialMaster`          | Material reference object                  | `materialCode`, `descriptionMasked`, `uom`                                                   |
| `Package`                 | Package tracking object                    | `packageNo`, `poNo`, `hvdcCode`                                                              |
| `ShipmentUnit`            | Central shipment spine                     | `shipmentUnitId`, `route`, `stage`, `riskStatus`                                             |
| `Identifier`              | Searchable identifier abstraction          | `scheme`, `rawValue`, `normalizedValue`, `targetType`, `confidence`, `source`                |
| `Document`                | Evidence document metadata                 | `documentId`, `type`, `sourceHash`, `shipmentUnitId`, `confidence`                           |
| `DocumentField`           | Extracted field from document              | `fieldName`, `valueMasked`, `valueNumeric`, `valueDate`, `confidence`, `pageNo`, `rowNo`     |
| `CargoUnit`               | Container/cargo evidence                   | `containerNo`, `grossWeight`, `cbm`                                                          |
| `CustomsEntry`            | BOE evidence only                          | `boeNo`, `linkedBlNo`, `evidenceStatus`                                                      |
| `ReleaseOrder`            | DO/release evidence only                   | `doNo`, `validity`, `releaseDate`                                                            |
| `WarehouseTask`           | WH movement evidence                       | `taskType`, `warehouse`, `qty`                                                               |
| `SiteReceipt`             | Site receipt evidence                      | `site`, `receiptNo`, `receivedQty`                                                           |
| `InvoiceReference`        | Invoice evidence only                      | `invoiceNo`, `vendorMasked`, `amountMasked`                                                  |
| `PartialShipmentEvidence` | Split shipment evidence                    | `splitQty`, `splitPackage`, `targetSite`, `evidenceStatus`                                   |
| `Exception`               | Rule-generated discrepancy or control item | `ruleId`, `severity`, `owner`, `status`, `evidence`                                          |
| `ReviewDecision`          | Human Gate decision record                 | `decision`, `actorRole`, `reason`, `evidenceIds`                                             |
| `RollbackRequest`         | Request to revert approved link            | `targetAuditId`, `reason`, `status`, `approvedByRole`                                        |
| `ExportRequest`           | Redacted export request                    | `exportType`, `sanitizerStatus`, `approvalStatus`, `p2Detected`                              |
| `AuditRecord`             | Immutable audit log                        | `actionType`, `beforeState`, `afterState`, `evidence`, `rollbackAvailable`                   |
| `TelemetryEvent`          | KPI and observability event                | `eventName`, `eventVersion`, `actorRole`, `latencyMs`, `confidence`, `p2Accessed`, `payload` |

#### Entity Relationships

- `HVDCCodeTag` identifies `MaterialMaster`.
- `HVDCCodeTag` may appear in one or more `Package` records.
- `HVDCCodeTag` resolves to one or more `ShipmentUnit` records.
- `ShipmentUnit` has many `Identifier`, `Document`, `CargoUnit`, `WarehouseTask`, `SiteReceipt`, `Exception`, `ReviewDecision`, `RollbackRequest`, `ExportRequest`, and `AuditRecord` records.
- `ShipmentUnit` may have customs evidence through `CustomsEntry` and release evidence through `ReleaseOrder`.
- `ShipmentUnit` may have invoice evidence through `InvoiceReference`; this is not cost judgment.
- `HVDCCodeTag` and `ShipmentUnit` may be linked through `PartialShipmentEvidence` when split shipment exists.

#### Identifier Hierarchy

| Level | Identifier                 | Target                           | Authority             |
| ----: | -------------------------- | -------------------------------- | --------------------- |
|    L1 | `HVDC_CODE`                | `MaterialMaster` / `HVDCCodeTag` | Primary               |
|    L2 | `Package No`               | `Package`                        | Strong                |
|    L3 | `PO No`                    | `PurchaseOrder` / `Package`      | Strong                |
|    L4 | `Material Code` / `Tag No` | `MaterialMaster`                 | Strong                |
|    L5 | `Container No`             | `CargoUnit` / `Container`        | Transport evidence    |
|    L6 | `BL No`                    | `ShipmentUnit` / `BL Document`   | Transport evidence    |
|    L7 | `BOE No`                   | `CustomsEntry`                   | Customs evidence only |
|    L8 | `DO No`                    | `ReleaseOrder`                   | Release evidence only |
|    L9 | `WH Receipt No`            | `WarehouseTask`                  | Custody evidence      |
|   L10 | `Site Receipt` / `GRN`     | `SiteReceipt`                    | Site evidence         |
|   L11 | `Invoice No`               | `InvoiceReference`               | Cost evidence only    |

---

### Interfaces & Contracts

#### API-Level Contracts

| Interface                      | Purpose                                                                            | Contract Requirements                                                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/resolve`            | Resolve any supported identifier to candidate `ShipmentUnit` and `HVDC Code` links | MUST accept raw key, optional type hint, source; MUST return mode, normalized key, candidates, score, match reasons, risk status, partial shipment flag, next action, and audit metadata. |
| `GET /api/shipment-units/{id}` | Return `ShipmentUnit` detail view                                                  | MUST return primary HVDC codes, identifiers, partial shipment status, document matrix, WH timeline, site receipts, exceptions, and audit summary.                                         |
| `POST /api/document-guard/run` | Run evidence and discrepancy rules                                                 | MUST return overall result, rule checks, severity, owner role, message, and Human Gate requirement where applicable.                                                                      |
| `POST /api/review-decisions`   | Record Human Gate decision                                                         | MUST validate actor role, decision type, evidence references, and create audit record.                                                                                                    |
| `POST /api/rollback-requests`  | Request rollback for approved link                                                 | MUST validate target audit, role, shipment unit, reason, current link state, and downstream export impact.                                                                                |
| `POST /api/export-requests`    | Request controlled redacted export                                                 | MUST validate export type, role, sanitizer result, approval status, and prohibited fields.                                                                                                |
| `POST /api/events`             | Ingest telemetry event                                                             | MUST reject or sanitize P2 raw values and MUST support KPI calculation.                                                                                                                   |

#### Required Events

System MUST support at minimum:

- `search.started`
- `search.completed`
- `identifier.resolved`
- `mapping.required`
- `link.proposed`
- `link.approved`
- `link.rejected`
- `document.ingested`
- `document.guard_run`
- `exception.created`
- `exception.assigned`
- `review.opened`
- `review.closed`
- `rollback.requested`
- `rollback.completed`
- `export.requested`
- `export.completed`
- `export.blocked`
- `audit.created`

#### Source Priority Contract

System MUST apply field-level priority before declaring discrepancy:

| Field              | Priority                                                |
| ------------------ | ------------------------------------------------------- |
| HVDC Code identity | HVDC master → PL → CI → WH/Site                         |
| Package identity   | PL → HVDC master → CI → WH/Site                         |
| PO No              | PO master → CI → PL                                     |
| Container No       | BL → DO → BOE → WH                                      |
| BL No              | BL → DO → BOE → Invoice ref                             |
| Gross Weight       | PL → BL → CI                                            |
| CBM                | PL → BL → CI                                            |
| Quantity           | PL → CI → WH Receipt → Site Receipt                     |
| Site receipt qty   | Site Receipt → WH Dispatch → PL                         |
| Customs evidence   | BOE → DO → BL                                           |
| Cost evidence      | Invoice → DO/BOE/BL reference                           |
| Date sequence      | ETA → DO release → WH receipt → dispatch → site receipt |

#### Export Contract

Allowed Phase 1 export types:

- Redacted dashboard
- Exception list
- Evidence matrix
- Audit summary

Blocked Phase 1 export types:

- Original document
- Invoice amount report
- Customs approval report
- Vendor/carrier email or send action

---

### Assumptions & Dependencies

#### Assumptions

- A1: `HVDC Code` exists in material/package master for a meaningful portion of Phase 1 data.
- A2: `Package No` or `PO No` can be used as fallback to map missing `HVDC Code` cases.
- A3: Some WH/Site receipts may not contain `HVDC Code`; package/container based reverse tracing is required.
- A4: OCR confidence `≥ 0.92` is sufficient for field candidate generation but not for automatic operational truth change.
- A5: Cost/customs final decisions remain outside Phase 1 and must be blocked by rule and UX copy.
- A6: Partial shipment is a valid operational pattern and must not be treated as duplicate error when split evidence exists.
- A7: Phase 1 export can operate using redacted reports and source hashes without original document exposure.
- A8: Redacted sample 100.00건 is representative enough for MVP gate validation. `[NEEDS CLARIFICATION: sampling period, data source, and representativeness criteria required]`

#### Dependencies

- D1: HVDC master or tag registry source.
- D2: Package/PO/material mapping data.
- D3: Shipment, BL, container, BOE, DO, WH, Site, and Invoice evidence source availability.
- D4: OCR or document field extraction pipeline with confidence values, page numbers, and row references.
- D5: RBAC/auth provider capable of enforcing role-level controlled actions.
- D6: Private storage for source documents with source hash generation.
- D7: Telemetry pipeline and event storage for KPI calculation.
- D8: Export sanitizer capable of P2/PII/contract/rate/original link detection.
- D9: Accessibility QA process for keyboard/focus/error/label verification.
- D10: Human Gate approval actor list and delegation rules. `[NEEDS CLARIFICATION: approval actor per controlled action required]`

---

### Success Criteria

#### Measurable Outcomes

- SC-001: `HVDC Code Search Success Rate` MUST be `≥ 95.00%` on redacted sample 100.00건, measured by successful `search.completed` events divided by all supported HVDC-code search attempts.
- SC-002: `HVDC Code → ShipmentUnit Link Coverage` MUST be `≥ 90.00%`, measured by linked HVDC codes divided by eligible HVDC-coded sample records.
- SC-003: `Correct Link Accuracy` after review MUST be `≥ 95.00%`, measured by confirmed correct links divided by proposed links in validation.
- SC-004: `Cross-document Consistency Detection` MUST achieve `≥ 95.00%` expected rule result match on seeded discrepancy scenarios.
- SC-005: `HVDC Code → Site Receipt Traceability` MUST be `≥ 90.00%`, measured by traceable site receipt records divided by eligible site receipt sample records.
- SC-006: `Exception Owner Assignment` MUST be `100.00%`, measured by exceptions with non-empty owner role divided by created exceptions.
- SC-007: `Exception Triage Time` MUST be `≤ 1.00 day` from `exception.created` to `exception.assigned` for P1 exception types.
- SC-008: `Audit Payload Coverage` MUST be `100.00%`, measured by audited controlled actions divided by all controlled actions.
- SC-009: `Search-to-Answer Time` MUST be `≤ 3.00 sec` at P95, measured from `search.started` to `result.rendered` or equivalent event timestamp.
- SC-010: `P2 Leakage Count` MUST be `0.00건` across prompt payloads, exports, event payloads, and generated reports.
- SC-011: `Rollback Success` MUST be `≥ 95.00%`, measured by completed valid rollback requests divided by valid rollback requests.
- SC-012: `Export Safety` MUST have `0.00건` P2/original-document leakage and MUST block all seeded prohibited export cases.
- SC-013: `Required Event Coverage` MUST be `100.00%`; any missing required event for KPI-critical flow causes Gate `Stop`.
- SC-014: `Accessibility Blocker Count` MUST be `0.00건` for keyboard/focus/error/severity-label test cases before release.
- SC-015: Cost/customs final judgment requests MUST be blocked in `100.00%` of seeded boundary violation tests.

#### Gate Decision Criteria

| Gate Area         | Go                                | Revise                        | Stop                            |
| ----------------- | --------------------------------- | ----------------------------- | ------------------------------- |
| Search            | HVDC search `≥ 95.00%`            | `85.00~94.99%`                | `<85.00%`                       |
| Link              | Correct link `≥ 95.00%`           | `90.00~94.99%`                | `<90.00%`                       |
| Numeric Integrity | `100.00%` preserved               | Minor display issue           | Value loss                      |
| Event             | Required event coverage `100.00%` | Non-critical event missing    | KPI unmeasurable                |
| Audit             | Audit coverage `100.00%`          | Non-critical metadata missing | Missing controlled action audit |
| Rollback          | Rollback success `≥ 95.00%`       | `90.00~94.99%`                | `<90.00%`                       |
| A11y              | Blocker `0건`                     | Minor issue                   | Keyboard/focus blocker          |
| Security          | P2 leakage `0건`                  | Masking warning               | P2 leak                         |
| Human Gate        | Irreversible action blocked       | Warning only                  | Unauthorized write/export       |

---

### Open Questions & Clarifications

#### Open Questions

- Q1: 최종 Product Owner, Business Owner, Technical Owner는 누구인가? `[NEEDS CLARIFICATION]`
- Q2: `HVDC master`, package/PO mapping, WH/Site evidence의 authoritative source system은 무엇인가? `[NEEDS CLARIFICATION]`
- Q3: Redacted sample 100.00건의 sampling period, inclusion criteria, and acceptance dataset owner는 누구인가? `[NEEDS CLARIFICATION]`
- Q4: Controlled action별 approval actor와 delegation rule은 무엇인가? `[NEEDS CLARIFICATION]`
- Q5: P2 masking taxonomy는 field-level로 확정되어 있는가? 예: vendor, invoice amount, role/name, internal link, source filename. `[NEEDS CLARIFICATION]`
- Q6: Exception severity별 SLA는 모두 `≤ 1.00 day`인지, 아니면 `INFO/AMBER/BLOCK/ZERO`별로 다르게 적용하는지 확인 필요. `[NEEDS CLARIFICATION]`
- Q7: `CostGuard Phase`는 Phase 3으로 고정되는가, 아니면 별도 roadmap item인가? `[NEEDS CLARIFICATION]`
- Q8: API contracts는 MVP에서 실제 구현 scope인지, 아니면 design handoff reference인지 확인 필요. `[NEEDS CLARIFICATION]`
- Q9: Accessibility 기준은 WCAG 2.2 AA, 내부 기준, 또는 별도 checklist 중 무엇을 적용하는가? `[NEEDS CLARIFICATION]`
- Q10: Date/lane proximity score 산정에 필요한 route/date source와 tolerance 기준은 확정되어 있는가? `[NEEDS CLARIFICATION]`

#### Clarifications Log

- 2026-05-16 Session:
  - Q: 업로드된 v1.10 설계안을 Spec.md로 재구성할 것인가?
  - A: 예. 상세 설계의 핵심 범위는 유지하고, testable requirements, scenarios, success criteria, traceability 중심의 `Spec.md`로 변환함.

---

### Risks & Mitigations

| Risk ID | Risk                                                           | Severity    | Mitigation                                                           |
| ------- | -------------------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| R1      | 일부 문서에 `HVDC Code`가 없음                                 | AMBER       | `Package/PO/Material Code` fallback 및 mapping request queue         |
| R2      | `BL/BOE/DO`는 있으나 `HVDC Code` 연결이 없음                   | AMBER       | Secondary identifier resolution 후 `mapping.required` exception 생성 |
| R3      | Invoice에 `HVDC Code/BL/DO` 연결이 없음                        | AMBER       | Cost evidence link only, cost judgment 차단                          |
| R4      | `BOE/HS` 근거로 customs release 판단 요구                      | BLOCK       | Customs approval out of scope copy 및 Human Gate boundary            |
| R5      | Invoice 과청구 판정 요구                                       | BLOCK       | CostGuard phase로 분리, Phase 1에서는 evidence link only             |
| R6      | 하나의 `HVDC Code`가 여러 `ShipmentUnit`으로 split             | AMBER       | Partial shipment rule 및 split evidence requirement                  |
| R7      | 동일 `HVDC Code`가 다른 site로 중복 연결                       | BLOCK       | Split evidence 없으면 차단                                           |
| R8      | P2 단가/계약/PII 입력 또는 export 포함                         | ZERO        | Private pack 분리, sanitizer, prompt 금지, event masking             |
| R9      | KPI event schema 미정의                                        | ZERO        | Event schema 확정 전 Gate Stop                                       |
| R10     | Accessibility blocker                                          | ZERO        | Keyboard/focus/error/severity-label fix 전 release 금지              |
| R11     | 잘못 승인된 link 복구 불가                                     | BLOCK       | Rollback Center, audit chain, rollback gate 필수                     |
| R12     | Source priority 미적용으로 낮은 신뢰도 문서가 truth처럼 표시됨 | AMBER/BLOCK | Field-level source priority와 discrepancy copy 표시                  |
| R13     | 원문 문서 또는 invoice amount export                           | BLOCK/ZERO  | Export scope 제한, sanitizer, Human Gate                             |

---

### Traceability

| User Story                                           | Functional Requirements                                    | Non-Functional Requirements | Success Criteria                       |
| ---------------------------------------------------- | ---------------------------------------------------------- | --------------------------- | -------------------------------------- |
| US1 - HVDC Code로 ShipmentUnit 및 Evidence 조회      | FR-001~FR-018, FR-067~FR-071                               | NFR-001, NFR-003, NFR-010   | SC-001, SC-002, SC-005, SC-009, SC-013 |
| US2 - Secondary Identifier로 역추적 검색             | FR-002~FR-011, FR-063~FR-066                               | NFR-001, NFR-011            | SC-001, SC-002, SC-007, SC-013         |
| US3 - Document Matrix와 Document Guard로 불일치 처리 | FR-015~FR-030, FR-063~FR-066                               | NFR-002, NFR-012, NFR-013   | SC-003, SC-004, SC-006, SC-007, SC-013 |
| US4 - Partial Shipment 식별 및 검토                  | FR-031~FR-035                                              | NFR-002, NFR-011            | SC-003, SC-004, SC-005                 |
| US5 - Human Gate 승인, Audit, Rollback               | FR-036~FR-053, FR-063~FR-066                               | NFR-005, NFR-006, NFR-011   | SC-003, SC-008, SC-011, SC-013, SC-015 |
| US6 - Redacted Export 생성 및 차단                   | FR-054~FR-062                                              | NFR-004, NFR-005, NFR-011   | SC-010, SC-012, SC-015                 |
| Edge Cases                                           | FR-008~FR-011, FR-024~FR-030, FR-034~FR-035, FR-055~FR-060 | NFR-004, NFR-007~NFR-011    | SC-010, SC-012, SC-014, SC-015         |

---

### Reviewer Checklist

- [ ] Mandatory sections are present: `Summary`, `User Scenarios & Testing`, `Requirements`, `Assumptions & Dependencies`, `Success Criteria`.
- [ ] Each P1 user story has an independent test.
- [ ] Acceptance scenarios are observable and written in Given/When/Then form.
- [ ] Functional requirements are testable `MUST` statements.
- [ ] Cost/customs judgment is explicitly out of scope and blocked.
- [ ] P2 handling is explicit for prompts, events, exports, and source files.
- [ ] Controlled actions require Human Gate and audit.
- [ ] Failure behavior is defined for no match, ambiguity, low confidence, missing evidence, unauthorized action, P2 detection, and missing event schema.
- [ ] Success criteria are measurable with event-based calculation.
- [ ] Traceability maps user stories to FR/NFR/SC IDs.
- [ ] All `[NEEDS CLARIFICATION]` items are either resolved or accepted before `Approved` status.

---

### Approval Readiness Assessment

Current status: `Draft`.

Not approval-ready yet because the following items remain unresolved:

- Final owners and approval actors are not specified.
- Authoritative data sources are not confirmed.
- Redacted sample 100.00건 sampling rules are not specified.
- Field-level P2 masking taxonomy is not specified.
- Severity-specific SLA rules are not finalized.
- Accessibility standard is not specified.

Minimum changes needed for `Approved`:

1. Resolve Q1~Q6 at minimum.
2. Confirm `SC-001~SC-015` measurement owner and dataset.
3. Confirm role-to-permission mapping in the actual auth system.
4. Confirm export sanitizer field taxonomy and test cases.
5. Run initial review against the Reviewer Checklist.

---

### Changelog

- `v1.10.0-spec.1` (2026-05-16): Converted uploaded detailed design v1.10 into testable `Spec.md` format with scenarios, FR/NFR, assumptions, success criteria, risks, traceability, and approval-readiness assessment.

---

# Part 2. Detailed Design Baseline

### HVDC Code-first Evidence Control Tower

#### HVDC Code-first Any-key Search + ShipmentUnit Spine + Document Guard

---

### 0. Executive Summary

|  No | Item               | Value                                                                                                                   |
| --: | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
|   1 | 설계명             | Phase 1 HVDC Code-first Evidence Control Tower                                                                          |
|   2 | 핵심 목적          | HVDC Code 기준으로 자재·운송·문서·WH·Site evidence를 통합 추적                                                          |
|   3 | 중심 객체          | `ShipmentUnit`                                                                                                          |
|   4 | Primary Search Key | `HVDC_CODE`                                                                                                             |
|   5 | Secondary Keys     | Package No, PO No, Material Code, Container No, BL No, BOE No, DO No, WH Receipt, Site Receipt, Invoice No              |
|   6 | 핵심 기능          | Any-key search, identifier resolution, evidence matrix, document discrepancy, exception queue, human gate, audit log    |
|   7 | 제외 범위          | Cost approval, Invoice overcharge judgment, HS final classification, Customs release approval, vendor/carrier auto-send |
|   8 | MVP 기간           | 4.00주                                                                                                                  |
|   9 | Simulation 기준    | Redacted sample 100.00건                                                                                                |
|  10 | Gate               | Go / Revise / Stop                                                                                                      |

---

### 1. 설계 원칙

|  No | 원칙                         | 적용                                                                      |
| --: | ---------------------------- | ------------------------------------------------------------------------- |
|   1 | **HVDC Code-first**          | 검색·화면·예외·KPI의 기준을 HVDC Code로 둔다                              |
|   2 | **ShipmentUnit Spine**       | BL, BOE, DO, CI, PL, Invoice, WH, Site evidence를 `ShipmentUnit`에 연결   |
|   3 | **Evidence-only Discipline** | 문서는 “증거”이며, 통관/정산 최종판정은 하지 않는다                       |
|   4 | **Human Gate**               | link 승인, export, report publication, cost/customs 판단은 사람 승인 필요 |
|   5 | **Audit-first**              | OCR, link, review, correction, override, rollback은 audit payload 저장    |
|   6 | **P2 분리**                  | 계약·단가·PII·내부 링크는 설계 산출물과 LLM prompt에 포함 금지            |
|   7 | **Fail-safe**                | 증거 부족·P2 노출·무승인 실행은 AMBER/BLOCK/ZERO 처리                     |
|   8 | **KPI-measurable**           | 모든 핵심 action은 event schema로 측정 가능해야 함                        |
|   9 | **Rollback-ready**           | 승인된 link도 evidence 기반으로 되돌릴 수 있어야 함                       |
|  10 | **Export-safe**              | Phase 1 export는 redacted evidence/report로 제한                          |

---

## 2. Problem Statement + Objectives + Risks + Assumptions

### 2.1 Problem Statement

현재 HVDC 물류 추적은 BL, container, invoice, BOE, DO, WH report, site receipt가 각자 다른 문서·파일·메일·엑셀에 분산되어 있습니다.

운영자가 실제로 묻는 질문은 다음입니다.

```text
“이 HVDC Code 자재가 어디까지 왔는가?”
“어떤 문서가 부족한가?”
“BL/BOE/DO/WH/Site evidence가 서로 맞는가?”
“누가 다음 조치를 해야 하는가?”
```

기존 BL-first 방식은 해상운송 tracking에는 유리하지만, 자재·패키지·현장 수령 추적에는 한계가 있습니다. 따라서 Phase 1은 **HVDC Code를 검색 시작점으로 두고, 관련 ShipmentUnit과 evidence를 역방향으로 연결하는 구조**로 설계합니다.

---

### 2.2 Objectives

|  No | Objective                     | KPI                                   |     Target |
| --: | ----------------------------- | ------------------------------------- | ---------: |
|   1 | HVDC Code로 즉시 검색         | HVDC Code Search Success Rate         |   ≥ 95.00% |
|   2 | HVDC Code와 ShipmentUnit 연결 | HVDC Code → ShipmentUnit Link Rate    |   ≥ 90.00% |
|   3 | 문서 누락·불일치 자동 탐지    | Cross-document Consistency            |   ≥ 95.00% |
|   4 | WH/Site 추적성 확보           | HVDC Code → Site Receipt Traceability |   ≥ 90.00% |
|   5 | 예외 처리 owner 명확화        | Exception Owner Assignment            |    100.00% |
|   6 | 감사 가능성 확보              | Audit Payload Coverage                |    100.00% |
|   7 | 검색 응답성 확보              | Search-to-Answer Time                 | ≤ 3.00 sec |
|   8 | P2 보호                       | P2 Leakage Count                      |     0.00건 |

---

### 2.3 Risks

| Risk                                        | Level | Mitigation                         |
| ------------------------------------------- | ----- | ---------------------------------- |
| HVDC Code가 일부 문서에 없음                | AMBER | Package/PO/Material Code fallback  |
| BL/BOE/DO는 있으나 HVDC Code 연결 없음      | AMBER | mapping request queue              |
| Invoice에 HVDC Code/BL/DO 연결 없음         | AMBER | Cost evidence link only            |
| BOE/HS 근거로 customs release 판단 요구     | BLOCK | Customs Human Gate 및 Phase 1 제외 |
| Invoice 과청구 판정 요구                    | BLOCK | CostGuard Phase로 분리             |
| HVDC Code 1개가 여러 ShipmentUnit으로 split | AMBER | partial shipment rule 적용         |
| 동일 HVDC Code가 다른 site로 중복 연결      | BLOCK | split evidence 없으면 차단         |
| P2 단가/계약/PII 입력                       | ZERO  | private pack 분리, prompt 금지     |
| KPI event 미정의                            | ZERO  | event schema 확정 전 개발 중단     |
| 접근성 blocker                              | ZERO  | keyboard/focus fix 전 release 금지 |

---

### 2.4 Assumptions

|  No | 가정                                                   | 검증 태스크                                |
| --: | ------------------------------------------------------ | ------------------------------------------ |
|   1 | HVDC Code는 material/package master에 존재한다         | 최근 3개월 sample 100.00건 coverage 측정   |
|   2 | Package No 또는 PO No로 HVDC Code fallback 가능하다    | Package/PO ↔ HVDC Code mapping table 생성 |
|   3 | WH/Site receipt 일부에는 HVDC Code가 없을 수 있다      | package/container 기반 역추적 rule 검증    |
|   4 | OCR confidence 0.92 이상이면 자동 field candidate 가능 | OCR benchmark 수행                         |
|   5 | 실제 cost/customs 판정은 Phase 1 범위 밖이다           | Gate rule에 BLOCK 조건 고정                |
|   6 | HVDC Code partial shipment가 존재할 수 있다            | split shipment sample 확보                 |
|   7 | Export는 redacted report만 허용한다                    | export sanitizer test 수행                 |

---

## 3. Personas + Validation Questions

| Persona                  | 주요 과업               | 정보 요구                             | 장애 요인                             |
| ------------------------ | ----------------------- | ------------------------------------- | ------------------------------------- |
| Logistics Lead           | 전체 shipment 상태 확인 | HVDC Code별 위치, 문서상태, exception | key가 BL/Invoice 중심으로 흩어짐      |
| Document Controller      | 문서 누락·불일치 처리   | CI/PL/BL/BOE/DO mismatch              | OCR confidence, revision 관리         |
| Site Material Controller | 현장 수령 확인          | HVDC Code별 WH dispatch/site receipt  | package split, partial receipt        |
| Customs Broker           | BOE/DO evidence 확인    | BOE, DO, BL/container reference       | customs approval과 evidence 구분 필요 |
| Cost Controller          | Invoice evidence 연결   | Invoice ↔ BL/DO/BOE/HVDC link        | 금액판정은 Phase 1 제외               |

### Validation Questions

|  No | 질문                                             | 검증 방법                         |
| --: | ------------------------------------------------ | --------------------------------- |
|   1 | HVDC Code 하나로 현장 수령까지 추적 가능한가?    | sample 100.00건 traceability test |
|   2 | BL-first 대비 검색 시간이 줄어드는가?            | task time A/B test                |
|   3 | 문서 mismatch가 정확한 owner에게 배정되는가?     | exception queue simulation        |
|   4 | 승인 전 자동 write/export가 차단되는가?          | Human Gate E2E test               |
|   5 | P2 원문 없이도 운영 dashboard/report가 가능한가? | redacted sample run               |
|   6 | partial shipment가 잘못 BLOCK되지 않는가?        | split scenario test               |
|   7 | 잘못 승인된 link를 rollback할 수 있는가?         | rollback simulation               |

---

## 4. Journey Map + Emotional Beats

| Stage    | User Action        | System Response                     | Emotional Beat            | Risk               |
| -------- | ------------------ | ----------------------------------- | ------------------------- | ------------------ |
| Search   | HVDC Code 입력     | 관련 ShipmentUnit 후보 표시         | “바로 찾았다”             | no match           |
| Review   | Detail 화면 확인   | BL/CI/PL/BOE/DO/WH/Site matrix 표시 | “근거가 보인다”           | evidence mismatch  |
| Decide   | Exception 클릭     | rule, source, owner, action 표시    | “누가 해야 할지 명확하다” | owner 미지정       |
| Resolve  | evidence 보완/승인 | audit log 생성                      | “추적 가능하다”           | 무승인 수정        |
| Rollback | 잘못된 link 취소   | 이전 상태 복구 + audit              | “복구 가능하다”           | rollback 권한 오류 |
| Report   | dashboard 확인     | risk/status 집계                    | “회의 자료로 쓸 수 있다”  | P2 노출            |

---

## 5. Flows + Recovery Paths + Metrics

### 5.1 Primary Flow: HVDC Code Search

```text
User enters HVDC Code
→ normalize identifier
→ exact match in HVDCCodeTag
→ find MaterialMaster / Package / PO
→ traverse to ShipmentUnit
→ load documents, WH tasks, site receipts, exceptions
→ show confidence + evidence matrix
→ log search.completed event
```

### 5.2 Secondary Flow: Fallback Search

```text
User enters Package / PO / Container / BL / BOE / DO / Invoice
→ normalize identifier
→ resolve to nearest object
→ traverse to nearest ShipmentUnit
→ check if HVDC Code exists
→ if missing, create mapping exception
→ log search.completed or mapping.required event
```

### 5.3 Partial Shipment Flow

```text
User enters HVDC Code
→ HVDC Code maps to multiple ShipmentUnits
→ system checks split evidence
   ├─ split evidence exists → show partial shipment view
   └─ split evidence missing → create HK-011 AMBER exception
→ user reviews package/qty/site split
→ Human Gate confirms link if operational truth changes
```

### 5.4 Rollback Flow

```text
Review Decision approved
→ audit record created
→ rollback token generated
→ wrong link detected
→ rollback request created
→ Human Gate review
→ previous link status restored
→ rollback audit record created
```

### 5.5 Recovery Paths

|  No | Failure                | Detection                         | Recovery                              | Log              |
| --: | ---------------------- | --------------------------------- | ------------------------------------- | ---------------- |
|   1 | HVDC Code no match     | no identifier found               | create candidate / request mapping    | search audit     |
|   2 | Multiple ShipmentUnits | duplicate candidate               | partial shipment check / review queue | resolution audit |
|   3 | Missing CI/PL          | document matrix gap               | request evidence                      | exception log    |
|   4 | BOE mismatch           | BOE ref not linked                | customs evidence review               | BLOCK log        |
|   5 | Invoice only           | no shipment evidence              | Cost evidence link request            | AMBER log        |
|   6 | OCR low confidence     | confidence < 0.92                 | manual field review                   | OCR audit        |
|   7 | Site receipt mismatch  | received qty > dispatch qty       | site review                           | BLOCK log        |
|   8 | Export requested       | no approval actor                 | stop action                           | Human Gate log   |
|   9 | Wrong link approved    | user/system rollback request      | rollback gate                         | rollback audit   |
|  10 | P2 detected in export  | sanitizer detects sensitive field | export blocked                        | ZERO log         |

### 5.6 Metrics

| Metric                | Event                                     |     Target |
| --------------------- | ----------------------------------------- | ---------: |
| Search Success        | `search.completed`                        |   ≥ 95.00% |
| Search-to-Answer Time | `search.started → result.rendered`        | ≤ 3.00 sec |
| Link Accuracy         | `link.confirmed / link.proposed`          |   ≥ 95.00% |
| Exception Triage Time | `exception.created → owner.assigned`      | ≤ 1.00 day |
| Review Completion     | `review.closed / review.opened`           |   ≥ 90.00% |
| Audit Coverage        | `audited_actions / controlled_actions`    |    100.00% |
| Rollback Success      | `rollback.completed / rollback.requested` |   ≥ 95.00% |
| Export Safety         | `export.blocked_p2_count`                 |     0.00건 |

---

## 6. Event Schema

### 6.1 Required Events

| Event                 | Trigger                   | Required |
| --------------------- | ------------------------- | -------: |
| `search.started`      | 검색 시작                 |      Yes |
| `search.completed`    | 검색 결과 반환            |      Yes |
| `identifier.resolved` | identifier candidate 생성 |      Yes |
| `mapping.required`    | HVDC Code mapping 필요    |      Yes |
| `link.proposed`       | link 제안                 |      Yes |
| `link.approved`       | link 승인                 |      Yes |
| `link.rejected`       | link 반려                 |      Yes |
| `document.ingested`   | 문서 업로드/추출          |      Yes |
| `document.guard_run`  | rule 실행                 |      Yes |
| `exception.created`   | exception 생성            |      Yes |
| `exception.assigned`  | owner 배정                |      Yes |
| `review.opened`       | review 시작               |      Yes |
| `review.closed`       | review 종료               |      Yes |
| `rollback.requested`  | rollback 요청             |      Yes |
| `rollback.completed`  | rollback 완료             |      Yes |
| `export.requested`    | export 요청               |      Yes |
| `export.blocked`      | export 차단               |      Yes |
| `audit.created`       | audit record 생성         |      Yes |

### 6.2 Event Payload Schema

```json
{
  "eventName": "search.completed",
  "eventVersion": "1.00",
  "actorRole": "Logistics Lead",
  "sessionId": "SESSION-MASKED",
  "inputType": "HVDC_CODE",
  "inputMasked": "HVDC-XXXX-0001",
  "resultCount": 1,
  "latencyMs": 1200,
  "confidence": 0.96,
  "shipmentUnitId": "SU-2026-000123",
  "hvdcCode": "HVDC-XXXX-0001",
  "riskStatus": "AMBER",
  "p2Accessed": false,
  "createdAt": "2026-05-15T00:00:00+04:00"
}
```

### 6.3 KPI Mapping

| KPI                           |                     Numerator |            Denominator | Event Source     |
| ----------------------------- | ----------------------------: | ---------------------: | ---------------- |
| HVDC Code Search Success Rate | successful `search.completed` | all `search.completed` | search events    |
| Link Accuracy                 |       confirmed correct links |         proposed links | link events      |
| Exception Owner Assignment    |           assigned exceptions |     created exceptions | exception events |
| Audit Payload Coverage        |                 audit records |     controlled actions | audit events     |
| Rollback Success              |            completed rollback |     requested rollback | rollback events  |
| Export Safety                 |                  safe exports |        export requests | export events    |

---

## 7. IA + Label Strategy

### 7.1 Information Architecture

```text
HVDC Control Tower
├─ Search
│  ├─ HVDC Code Search
│  └─ Secondary Identifier Search
├─ ShipmentUnit
│  ├─ Overview
│  ├─ Identifier Graph
│  ├─ Document Matrix
│  ├─ WH/Site Timeline
│  ├─ Partial Shipment View
│  ├─ Exceptions
│  └─ Audit Trail
├─ Document Guard
│  ├─ Rule Results
│  ├─ Mismatch Viewer
│  ├─ Source Priority View
│  └─ Evidence Requests
├─ Exception Queue
│  ├─ INFO
│  ├─ AMBER
│  ├─ BLOCK
│  └─ ZERO
├─ Review Workspace
├─ Rollback Center
├─ Upload/Ingestion
└─ Reports
   ├─ Redacted Dashboard
   ├─ Exception List
   └─ Evidence Matrix Export
```

### 7.2 Label Strategy

| Use         | Label            | 금지 Label           |
| ----------- | ---------------- | -------------------- |
| 자재 검색   | HVDC Code        | Item only            |
| 운송 묶음   | ShipmentUnit     | Shipment alone       |
| 문서 증거   | Evidence         | Truth                |
| 정합성 오류 | Discrepancy      | Error only           |
| 사람 확인   | Human Gate       | Auto approve         |
| 비용 연결   | Invoice Evidence | Cost approval        |
| 통관 연결   | BOE Evidence     | Customs approval     |
| 부분 선적   | Partial Shipment | Duplicate only       |
| 복구        | Rollback         | Delete               |
| 내보내기    | Redacted Export  | Full document export |

---

## 8. UI Direction + Component Specs + A11y Notes

### 8.1 Screen 1 — Global Search

#### 목적

HVDC Code를 최우선 검색키로 사용하고, secondary key도 허용합니다.

| Component       | Spec                                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| Search input    | placeholder: `Search HVDC Code, Package, PO, Container, BL, BOE, DO, Invoice` |
| Primary chip    | `HVDC Code-first`                                                             |
| Type detector   | 입력값 패턴으로 key type 추정                                                 |
| Result list     | confidence 높은 순                                                            |
| Fallback banner | HVDC Code 미연결 시 mapping request 표시                                      |
| Partial badge   | 여러 ShipmentUnit 연결 시 `Partial Shipment` badge                            |
| Event logging   | `search.started`, `search.completed`                                          |

#### States

| State     | UI                                                        |
| --------- | --------------------------------------------------------- |
| Loading   | `Resolving HVDC Code…`                                    |
| Empty     | `No linked ShipmentUnit found` + `Create Mapping Request` |
| Ambiguous | 후보 2개 이상 + 비교표                                    |
| Partial   | ShipmentUnit 여러 개 + split evidence 표시                |
| Success   | ShipmentUnit card + risk badge                            |
| Error     | source failure + retry                                    |

#### A11y DoD

| 항목     | 요구                                        |
| -------- | ------------------------------------------- |
| Keyboard | Enter 검색, ↑↓ 후보 이동                    |
| Focus    | 결과 렌더 후 첫 후보로 자동 focus 이동 금지 |
| Error    | 오류 메시지와 input `aria-describedby` 연결 |
| Target   | 주요 버튼 target size 확보                  |
| Color    | AMBER/BLOCK은 text label 병행               |
| Help     | 검색 예시 도움말을 동일 위치에 제공         |

---

### 8.2 Screen 2 — ShipmentUnit Overview

| Section               | Content                                                     |
| --------------------- | ----------------------------------------------------------- |
| Header                | HVDC Code, ShipmentUnit ID, current stage, risk             |
| Identifier Graph      | HVDC Code ↔ Package ↔ PO ↔ BL ↔ Container ↔ BOE/DO     |
| Partial Shipment View | split qty, split package, site, shipment leg                |
| Document Matrix       | CI/PL/BL/BOE/DO/Invoice presence/confidence                 |
| WH/Site Timeline      | receipt, put-away, dispatch, site receipt                   |
| Exception Panel       | open INFO/AMBER/BLOCK/ZERO                                  |
| Actions               | request evidence, assign owner, create review, export draft |

#### Layout

```text
[HVDC Code Header + Risk Badge + Partial Shipment Badge]
[Identifier Graph]          [Current Status]
[Document Matrix]           [Exception Panel]
[WH/Site Timeline]          [Source Priority Notes]
[Audit Trail]               [Rollback Available]
```

---

### 8.3 Screen 3 — Document Matrix

| Doc     | Present | Confidence | Key Fields                | Mismatch | Action        |
| ------- | ------: | ---------: | ------------------------- | -------: | ------------- |
| CI      |     Yes |       0.94 | PO, qty, value masked     |        0 | View          |
| PL      |     Yes |       0.96 | package, dims, weight     |        1 | Review        |
| BL      |     Yes |       0.98 | BL, container, POD        |        0 | View          |
| BOE     |     Yes |       0.91 | BOE, BL ref, container    |        1 | Evidence only |
| DO      |      No |          - | -                         |        - | Request       |
| Invoice |     Yes |       0.88 | invoice no, vendor masked |        1 | Link only     |

#### Required UX Copy

```text
BOE Evidence: linked
Customs Approval: out of Phase 1 / Human Gate required

Invoice Evidence: linked
Cost Judgment: out of Phase 1 / CostGuard required
```

---

### 8.4 Screen 4 — Exception Queue

| Field        | Description                                         |
| ------------ | --------------------------------------------------- |
| Severity     | INFO / AMBER / BLOCK / ZERO                         |
| Rule ID      | HK / DG / SP / RB / EX prefix                       |
| HVDC Code    | primary grouping key                                |
| ShipmentUnit | linked object                                       |
| Evidence     | source document + field                             |
| Owner        | role-based owner                                    |
| SLA          | due date                                            |
| Status       | Open / In Review / Resolved / Escalated             |
| Action       | assign, request evidence, approve link, reject link |

---

### 8.5 Screen 5 — Review Workspace

```text
1. Summary
   - HVDC Code
   - Proposed link
   - Evidence sources
   - Confidence
   - Source priority applied

2. Risk
   - Reversible? Yes/No
   - P2 accessed? Yes/No
   - Downstream effect
   - Export impact

3. Decision
   - Approve link
   - Reject link
   - Request evidence
   - Escalate

4. Result
   - Audit ID
   - Updated status
   - Rollback option
```

---

### 8.6 Screen 6 — Rollback Center

| Component             | Spec                                                       |
| --------------------- | ---------------------------------------------------------- |
| Rollback request card | original decision, current link, requested rollback reason |
| Evidence diff         | before/after link comparison                               |
| Risk label            | downstream impact                                          |
| Human Gate buttons    | approve rollback, reject rollback, request evidence        |
| Audit trail           | rollback audit chain                                       |

---

### 8.7 Screen 7 — Export Center

| Component            | Spec                                                 |
| -------------------- | ---------------------------------------------------- |
| Export type selector | dashboard, exception list, evidence matrix           |
| P2 sanitizer status  | passed / blocked                                     |
| Redaction preview    | masked fields preview                                |
| Approval panel       | Human Gate for controlled export                     |
| Export audit         | export.requested / export.completed / export.blocked |

---

## 9. Role Permission Matrix

| Role                     | Search |    View Evidence |   Approve Link |       Rollback |         Export | Cost Judgment | Customs Approval |
| ------------------------ | -----: | ---------------: | -------------: | -------------: | -------------: | ------------: | ---------------: |
| Logistics Lead           |    Yes |              Yes |            Yes |            Yes |  Yes with gate |            No |               No |
| Document Controller      |    Yes |              Yes |            Yes |   Request only |             No |            No |               No |
| Site Material Controller |    Yes |          Limited |             No |             No |             No |            No |               No |
| Customs Broker           |    Yes | Customs evidence |             No |             No |             No |            No |    Evidence only |
| Finance / CostGuard      |    Yes | Invoice evidence |             No |             No |             No |  Phase 3 only |               No |
| Warehouse                |    Yes |      WH evidence |             No |             No |             No |            No |               No |
| Admin                    |    Yes |              Yes | Configure only | Configure only | Configure only |            No |               No |

### 9.1 Controlled Actions

| Action                            | Required Role                        |     Human Gate |
| --------------------------------- | ------------------------------------ | -------------: |
| Confirm HVDC ↔ ShipmentUnit link | Logistics Lead / Document Controller |            Yes |
| Reject proposed link              | Logistics Lead / Document Controller |            Yes |
| Rollback approved link            | Logistics Lead                       |            Yes |
| Export redacted dashboard         | Logistics Lead                       |            Yes |
| Create evidence request           | Any authorized role                  |             No |
| Publish external report           | Logistics Lead + Approval Actor      |            Yes |
| Cost judgment                     | Finance / CostGuard                  | Out of Phase 1 |
| Customs approval                  | Customs / Compliance                 | Out of Phase 1 |

---

## 10. Ontology Grounding

### 10.1 Core Boundary

```text
Allowed:
HVDC Code → Identifier → ShipmentUnit → Evidence Matrix → Exception Queue → Human Gate → Audit

Not allowed in Phase 1:
Invoice amount judgment
Overcharge decision
HS final classification
Customs release approval
Vendor/carrier auto-send
Original document public export
```

### 10.2 Object Boundary

| Domain        | Phase 1 Use                                 | Phase 1 Limit                                              |
| ------------- | ------------------------------------------- | ---------------------------------------------------------- |
| Master        | HVDC Code, Material, Package, PO            | master truth 수정은 Human Gate                             |
| Shipment      | ShipmentUnit, BL, container, route evidence | shipment final status override 금지                        |
| Document      | CI/PL/BL/BOE/DO/Invoice evidence            | document evidence가 operational truth를 단독 override 금지 |
| Warehouse     | WH receipt/dispatch evidence                | stock truth override 금지                                  |
| Site          | Site receipt evidence                       | site acceptance final approval 금지                        |
| Cost          | Invoice evidence link                       | 금액·과청구·RateRef 판단 금지                              |
| Customs       | BOE/DO evidence link                        | HS/customs release 판단 금지                               |
| Communication | approval/audit/escalation evidence          | PII 원문 export 금지                                       |

---

## 11. Identifier Hierarchy

| Level | Identifier             | Target                       | Authority             |
| ----: | ---------------------- | ---------------------------- | --------------------- |
|    L1 | `HVDC_CODE`            | MaterialMaster / HVDCCodeTag | Primary               |
|    L2 | Package No             | Package                      | Strong                |
|    L3 | PO No                  | PurchaseOrder / Package      | Strong                |
|    L4 | Material Code / Tag No | MaterialMaster               | Strong                |
|    L5 | Container No           | CargoUnit / Container        | Transport evidence    |
|    L6 | BL No                  | ShipmentUnit / BL Document   | Transport evidence    |
|    L7 | BOE No                 | CustomsEntry                 | Customs evidence only |
|    L8 | DO No                  | ReleaseOrder                 | Release evidence only |
|    L9 | WH Receipt No          | WarehouseTask                | Custody evidence      |
|   L10 | Site Receipt / GRN     | SiteReceipt                  | Site evidence         |
|   L11 | Invoice No             | InvoiceReference             | Cost evidence only    |

---

## 12. HVDC Code-first Resolution Algorithm

### 12.1 Scoring

가정: 초기 score는 MVP 기준이며, simulation 후 조정합니다.

| Match Signal            | Weight |
| ----------------------- | -----: |
| HVDC Code exact         |   0.40 |
| Package No exact        |   0.20 |
| PO No exact             |   0.10 |
| Material Code exact     |   0.10 |
| Container/BL linkage    |   0.10 |
| WH/Site receipt linkage |   0.05 |
| Date/lane proximity     |   0.05 |

### 12.2 Threshold

|     Score | Action                           |
| --------: | -------------------------------- |
|    ≥ 0.92 | Auto candidate + audit           |
| 0.80~0.91 | Review recommended               |
| 0.60~0.79 | Weak candidate only              |
|    < 0.60 | No link / create mapping request |

### 12.3 Pseudocode

```ts
type ResolutionInput = {
  rawKey: string;
  keyTypeHint?: string;
  source: "user_search" | "document_ingest" | "api";
};

async function resolveAnyKey(input: ResolutionInput) {
  const normalized = normalizeIdentifier(input.rawKey);
  const detectedType = detectIdentifierType(normalized, input.keyTypeHint);

  if (detectedType === "HVDC_CODE") {
    return resolveHvdcCodeFirst(normalized);
  }

  const nearestObject = await resolveSecondaryIdentifier(
    normalized,
    detectedType,
  );
  const shipmentUnit = await traverseToNearestShipmentUnit(nearestObject);
  const hvdcCodes = await findLinkedHvdcCodes(shipmentUnit);

  return {
    primaryMode:
      hvdcCodes.length > 0 ? "HVDC_CODE_LINKED" : "HVDC_CODE_MISSING",
    shipmentUnit,
    hvdcCodes,
    confidence: scoreCandidate(nearestObject, shipmentUnit, hvdcCodes),
    requiredAction:
      hvdcCodes.length > 0 ? "OPEN_DETAIL" : "CREATE_MAPPING_EXCEPTION",
  };
}
```

### 12.4 Partial Shipment Logic

```ts
async function evaluatePartialShipment(hvdcCode: string) {
  const linkedShipmentUnits = await findShipmentUnitsByHvdcCode(hvdcCode);

  if (linkedShipmentUnits.length <= 1) {
    return { status: "SINGLE_SHIPMENT", severity: "INFO" };
  }

  const splitEvidence = await findSplitEvidence(hvdcCode);

  if (splitEvidence.exists) {
    return {
      status: "PARTIAL_SHIPMENT_CONFIRMED",
      severity: "INFO",
      shipmentUnits: linkedShipmentUnits,
      evidence: splitEvidence,
    };
  }

  return {
    status: "PARTIAL_SHIPMENT_EVIDENCE_MISSING",
    severity: "AMBER",
    requiredAction: "REQUEST_SPLIT_EVIDENCE",
  };
}
```

---

## 13. Canonical Data Model

### 13.1 Objects

| Object                    | Purpose                 | Key Fields                                        |
| ------------------------- | ----------------------- | ------------------------------------------------- |
| `HVDCCodeTag`             | HVDC Code canonical tag | `hvdcCode`, `materialId`, `status`                |
| `MaterialMaster`          | material reference      | `materialCode`, `descriptionMasked`, `uom`        |
| `Package`                 | package tracking        | `packageNo`, `poNo`, `hvdcCode`                   |
| `ShipmentUnit`            | shipment spine          | `shipmentUnitId`, `route`, `stage`                |
| `Identifier`              | all searchable keys     | `scheme`, `rawValue`, `normalizedValue`           |
| `Document`                | evidence document       | `documentId`, `type`, `sourceHash`                |
| `DocumentField`           | extracted field         | `fieldName`, `valueMasked`, `confidence`          |
| `CargoUnit`               | container/cargo         | `containerNo`, `grossWeight`, `cbm`               |
| `CustomsEntry`            | BOE evidence            | `boeNo`, `linkedBlNo`, `evidenceStatus`           |
| `ReleaseOrder`            | DO evidence             | `doNo`, `validity`, `releaseDate`                 |
| `WarehouseTask`           | WH movement             | `taskType`, `warehouse`, `qty`                    |
| `SiteReceipt`             | site receipt            | `site`, `receiptNo`, `receivedQty`                |
| `InvoiceReference`        | invoice evidence        | `invoiceNo`, `vendorMasked`, `amountMasked`       |
| `PartialShipmentEvidence` | split shipment evidence | `splitQty`, `splitPackage`, `targetSite`          |
| `Exception`               | discrepancy             | `ruleId`, `severity`, `owner`, `status`           |
| `ReviewDecision`          | Human Gate              | `decision`, `actorRole`, `reason`                 |
| `RollbackRequest`         | approved link rollback  | `targetAuditId`, `reason`, `status`               |
| `ExportRequest`           | redacted export request | `exportType`, `sanitizerStatus`, `approvalStatus` |
| `AuditRecord`             | immutable log           | `actionType`, `before`, `after`, `evidence`       |

### 13.2 Relationships

```text
HVDCCodeTag
  ├─ identifies → MaterialMaster
  ├─ appearsIn → Package
  ├─ resolvesTo → ShipmentUnit
  └─ hasPartialShipmentEvidence → PartialShipmentEvidence

ShipmentUnit
  ├─ hasIdentifier → Identifier
  ├─ hasDocument → Document
  ├─ contains → CargoUnit
  ├─ includes → Package
  ├─ hasCustomsEvidence → CustomsEntry
  ├─ hasReleaseEvidence → ReleaseOrder
  ├─ hasWarehouseTask → WarehouseTask
  ├─ hasSiteReceipt → SiteReceipt
  ├─ hasInvoiceEvidence → InvoiceReference
  ├─ hasPartialShipmentEvidence → PartialShipmentEvidence
  ├─ hasException → Exception
  ├─ hasReviewDecision → ReviewDecision
  ├─ hasRollbackRequest → RollbackRequest
  ├─ hasExportRequest → ExportRequest
  └─ hasAuditRecord → AuditRecord
```

---

## 14. Database Schema v0.10

```sql
CREATE TABLE hvdc_code_tags (
  id UUID PRIMARY KEY,
  hvdc_code TEXT NOT NULL UNIQUE,
  material_code TEXT,
  package_no TEXT,
  po_no TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE shipment_units (
  id UUID PRIMARY KEY,
  shipment_unit_no TEXT NOT NULL UNIQUE,
  current_stage TEXT,
  route_pattern TEXT,
  current_location TEXT,
  risk_status TEXT NOT NULL DEFAULT 'INFO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE identifiers (
  id UUID PRIMARY KEY,
  scheme TEXT NOT NULL,
  raw_value TEXT NOT NULL,
  normalized_value TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  confidence NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_identifiers_scheme_value
ON identifiers (scheme, normalized_value);

CREATE TABLE shipment_hvdc_links (
  id UUID PRIMARY KEY,
  shipment_unit_id UUID NOT NULL REFERENCES shipment_units(id),
  hvdc_code_tag_id UUID NOT NULL REFERENCES hvdc_code_tags(id),
  confidence NUMERIC(5,2) NOT NULL,
  link_status TEXT NOT NULL DEFAULT 'PROPOSED',
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY,
  document_type TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  source_name_masked TEXT,
  shipment_unit_id UUID REFERENCES shipment_units(id),
  uploaded_by_role TEXT,
  confidence NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_documents_hash
ON documents (source_hash);

CREATE TABLE document_fields (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id),
  field_name TEXT NOT NULL,
  value_masked TEXT,
  value_numeric NUMERIC(18,2),
  value_date DATE,
  confidence NUMERIC(5,2) NOT NULL,
  page_no INTEGER,
  row_no INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE partial_shipment_evidence (
  id UUID PRIMARY KEY,
  hvdc_code TEXT NOT NULL,
  shipment_unit_id UUID REFERENCES shipment_units(id),
  split_package_no TEXT,
  split_qty NUMERIC(18,2),
  target_site TEXT,
  evidence_document_id UUID REFERENCES documents(id),
  evidence_status TEXT NOT NULL DEFAULT 'PROPOSED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_partial_shipment_hvdc
ON partial_shipment_evidence (hvdc_code, shipment_unit_id);

CREATE TABLE exceptions (
  id UUID PRIMARY KEY,
  shipment_unit_id UUID REFERENCES shipment_units(id),
  hvdc_code TEXT,
  rule_id TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  owner_role TEXT NOT NULL,
  message TEXT NOT NULL,
  evidence JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_exceptions_hvdc_status
ON exceptions (hvdc_code, status, severity);

CREATE TABLE review_decisions (
  id UUID PRIMARY KEY,
  exception_id UUID REFERENCES exceptions(id),
  shipment_unit_id UUID REFERENCES shipment_units(id),
  decision TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rollback_requests (
  id UUID PRIMARY KEY,
  target_audit_id UUID NOT NULL,
  shipment_unit_id UUID REFERENCES shipment_units(id),
  requested_by_role TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED',
  approved_by_role TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE export_requests (
  id UUID PRIMARY KEY,
  export_type TEXT NOT NULL,
  requested_by_role TEXT NOT NULL,
  sanitizer_status TEXT NOT NULL DEFAULT 'PENDING',
  approval_status TEXT NOT NULL DEFAULT 'PENDING',
  p2_detected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_records (
  id UUID PRIMARY KEY,
  shipment_unit_id UUID REFERENCES shipment_units(id),
  actor_type TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action_type TEXT NOT NULL,
  before_state JSONB,
  after_state JSONB,
  evidence JSONB NOT NULL DEFAULT '[]',
  rollback_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE telemetry_events (
  id UUID PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_version TEXT NOT NULL DEFAULT '1.00',
  actor_role TEXT,
  session_id_masked TEXT,
  input_type TEXT,
  input_masked TEXT,
  shipment_unit_id UUID REFERENCES shipment_units(id),
  hvdc_code TEXT,
  risk_status TEXT,
  confidence NUMERIC(5,2),
  latency_ms INTEGER,
  p2_accessed BOOLEAN NOT NULL DEFAULT false,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_telemetry_event_name_created
ON telemetry_events (event_name, created_at);
```

---

## 15. API Contract v0.10

### 15.1 `POST /api/resolve`

```json
{
  "rawKey": "HVDC-XXXX-0001",
  "keyTypeHint": "HVDC_CODE",
  "source": "user_search"
}
```

Response:

```json
{
  "mode": "HVDC_CODE_FIRST",
  "normalizedKey": "HVDC-XXXX-0001",
  "candidates": [
    {
      "shipmentUnitId": "SU-2026-000123",
      "hvdcCode": "HVDC-XXXX-0001",
      "score": 0.96,
      "matchReasons": ["hvdc_code_exact", "package_link", "shipment_unit_link"],
      "riskStatus": "AMBER",
      "partialShipment": false,
      "action": "OPEN_DETAIL"
    }
  ],
  "audit": {
    "ruleVersion": "hvdc-resolution-v0.1",
    "createdAt": "2026-05-15T00:00:00+04:00"
  }
}
```

### 15.2 `GET /api/shipment-units/{id}`

```json
{
  "shipmentUnitId": "SU-2026-000123",
  "primaryHvdcCodes": ["HVDC-XXXX-0001"],
  "identifiers": {
    "packageNo": ["PKG-001"],
    "poNo": ["PO-001"],
    "containerNo": ["MSCU1234567"],
    "blNo": ["BL-001"],
    "boeNo": ["BOE-001"],
    "doNo": ["DO-001"],
    "invoiceNo": ["INV-001"]
  },
  "partialShipment": {
    "exists": false,
    "evidenceStatus": "NOT_REQUIRED"
  },
  "documentMatrix": [],
  "warehouseTimeline": [],
  "siteReceipts": [],
  "exceptions": []
}
```

### 15.3 `POST /api/document-guard/run`

```json
{
  "shipmentUnitId": "SU-2026-000123",
  "scope": "PHASE1_EVIDENCE_ONLY",
  "ruleset": "document-guard-v0.1"
}
```

Response:

```json
{
  "result": "AMBER",
  "checks": [
    {
      "ruleId": "HK-004",
      "severity": "AMBER",
      "message": "BL/Container exists but HVDC Code mapping is missing",
      "ownerRole": "Document Controller",
      "humanGateRequired": true
    }
  ]
}
```

### 15.4 `POST /api/review-decisions`

```json
{
  "exceptionId": "EXC-2026-0001",
  "decision": "APPROVE_LINK",
  "actorRole": "Logistics Lead",
  "reason": "Package and PO match confirmed",
  "evidenceIds": ["DOC-001", "FIELD-009"]
}
```

### 15.5 `POST /api/rollback-requests`

```json
{
  "targetAuditId": "AUD-2026-000001",
  "shipmentUnitId": "SU-2026-000123",
  "requestedByRole": "Logistics Lead",
  "reason": "Incorrect HVDC Code link confirmed; package evidence revised"
}
```

### 15.6 `POST /api/export-requests`

```json
{
  "exportType": "REDACTED_EVIDENCE_MATRIX",
  "requestedByRole": "Logistics Lead",
  "shipmentUnitIds": ["SU-2026-000123"],
  "includeOriginalDocuments": false,
  "includeInvoiceAmount": false,
  "includePii": false
}
```

### 15.7 `POST /api/events`

```json
{
  "eventName": "exception.created",
  "eventVersion": "1.00",
  "actorRole": "System",
  "shipmentUnitId": "SU-2026-000123",
  "hvdcCode": "HVDC-XXXX-0001",
  "riskStatus": "AMBER",
  "payload": {
    "ruleId": "HK-004",
    "ownerRole": "Document Controller"
  }
}
```

---

## 16. Source Priority Rules

### 16.1 Field Priority

| Field              | Priority                                                | Notes                            |
| ------------------ | ------------------------------------------------------- | -------------------------------- |
| HVDC Code identity | HVDC master → PL → CI → WH/Site                         | master 우선                      |
| Package identity   | PL → HVDC master → CI → WH/Site                         | packing evidence 우선            |
| PO No              | PO master → CI → PL                                     | PO master 우선                   |
| Container No       | BL → DO → BOE → WH                                      | transport evidence 우선          |
| BL No              | BL → DO → BOE → Invoice ref                             | BL 원문 우선                     |
| Gross Weight       | PL → BL → CI                                            | PL 기준, BL 차이 tolerance 적용  |
| CBM                | PL → BL → CI                                            | PL 기준                          |
| Quantity           | PL → CI → WH Receipt → Site Receipt                     | partial shipment evidence 고려   |
| Site receipt qty   | Site Receipt → WH Dispatch → PL                         | site evidence 우선               |
| Customs evidence   | BOE → DO → BL                                           | approval 아님                    |
| Cost evidence      | Invoice → DO/BOE/BL reference                           | judgment 아님                    |
| Date sequence      | ETA → DO release → WH receipt → dispatch → site receipt | impossible sequence는 BLOCK 가능 |

### 16.2 Conflict Handling

| Conflict                                                  | Severity    | Handling                        |
| --------------------------------------------------------- | ----------- | ------------------------------- |
| Lower priority source differs from higher priority source | AMBER       | discrepancy 표시                |
| Same priority source conflict                             | AMBER/BLOCK | review queue                    |
| Container mismatch                                        | BLOCK       | Port Ops review                 |
| Destination mismatch                                      | BLOCK       | Logistics Lead review           |
| BOE ref missing                                           | BLOCK       | Customs Broker evidence request |
| Invoice only, no shipment evidence                        | AMBER       | Cost evidence link request      |

---

## 17. Tolerance Rules

### 17.1 Numeric Tolerance

| Field            |             AMBER |                                    BLOCK | Notes                                       |
| ---------------- | ----------------: | ---------------------------------------: | ------------------------------------------- |
| Quantity         |   mismatch exists |        mismatch without partial evidence | exact required unless split evidence exists |
| Gross Weight     |           > 2.00% |                                  > 5.00% | PL 기준                                     |
| Net Weight       |           > 2.00% |                                  > 5.00% | PL 기준                                     |
| CBM              |           > 3.00% |                                  > 7.00% | PL 기준                                     |
| Package Count    |   mismatch exists | mismatch without split/revision evidence | exact preferred                             |
| Site Receipt Qty | > WH dispatch qty |     > WH dispatch qty without correction | site review required                        |

### 17.2 Date Tolerance

| Rule                                                   | Severity |
| ------------------------------------------------------ | -------- |
| DO release date before ETA                             | AMBER    |
| WH receipt before DO release                           | AMBER    |
| Site receipt before WH dispatch                        | BLOCK    |
| BOE declaration after site receipt without explanation | AMBER    |
| Document revision date older than linked evidence      | AMBER    |

### 17.3 Non-negotiable BLOCK

| Condition                                                    | Reason                      |
| ------------------------------------------------------------ | --------------------------- |
| Container mismatch across BL and DO                          | release risk                |
| Destination mismatch across BL/CI/PL/DO                      | route risk                  |
| BOE without BL/container reference                           | customs evidence incomplete |
| Site receipt qty exceeds dispatch qty without split evidence | custody risk                |
| Cost/customs final judgment requested                        | Phase 1 boundary violation  |

---

## 18. Document Guard Rules v0.10

### 18.1 HVDC Key Rules

| Rule ID | Rule                                                                 | Severity   | Owner                    |
| ------- | -------------------------------------------------------------------- | ---------- | ------------------------ |
| HK-001  | HVDC Code exact match found                                          | INFO       | System                   |
| HK-002  | HVDC Code maps to multiple ShipmentUnits                             | AMBER      | Logistics Lead           |
| HK-003  | Package No same but HVDC Code mismatch                               | BLOCK      | Document Controller      |
| HK-004  | BL/Container exists but HVDC Code missing                            | AMBER      | Document Controller      |
| HK-005  | Site receipt exists but HVDC Code missing                            | AMBER      | Site Material Controller |
| HK-006  | Invoice exists but no HVDC/BL/DO link                                | AMBER      | Cost Controller          |
| HK-007  | BOE exists but no BL/container link                                  | BLOCK      | Customs Broker           |
| HK-008  | User requests customs approval                                       | BLOCK      | Customs/Compliance       |
| HK-009  | User requests cost approval                                          | BLOCK      | Finance/CostGuard        |
| HK-010  | One HVDC Code maps to multiple ShipmentUnits due to partial shipment | INFO/AMBER | Logistics Lead           |
| HK-011  | Partial shipment exists but package/qty split evidence missing       | AMBER      | Document Controller      |
| HK-012  | Same HVDC Code appears in different sites without split evidence     | BLOCK      | Logistics Lead           |

### 18.2 Cross-document Rules

| Rule ID | Rule                                               | Severity    | Owner                    |
| ------- | -------------------------------------------------- | ----------- | ------------------------ |
| DG-001  | CI missing                                         | AMBER       | Document Controller      |
| DG-002  | PL missing                                         | AMBER       | Document Controller      |
| DG-003  | CI qty ≠ PL qty                                    | AMBER       | Vendor/Expeditor         |
| DG-004  | PL gross weight ≠ BL gross weight beyond tolerance | AMBER/BLOCK | Logistics Coordinator    |
| DG-005  | BL container ≠ DO container                        | BLOCK       | Port Ops                 |
| DG-006  | BOE BL ref missing                                 | BLOCK       | Customs Broker           |
| DG-007  | WH receipt qty > PL qty                            | BLOCK       | Warehouse                |
| DG-008  | Site receipt qty > WH dispatch qty                 | BLOCK       | Site Material Controller |
| DG-009  | duplicate document hash                            | INFO        | System                   |
| DG-010  | key field confidence < 0.92                        | AMBER       | Document Controller      |
| DG-011  | destination mismatch across BL/CI/PL/DO            | BLOCK       | Logistics Lead           |
| DG-012  | invoice amount judgment requested                  | BLOCK       | Finance/CostGuard        |

### 18.3 Export Rules

| Rule ID | Rule                                | Severity | Owner             |
| ------- | ----------------------------------- | -------- | ----------------- |
| EX-001  | Redacted dashboard export requested | INFO     | Logistics Lead    |
| EX-002  | Original document export requested  | BLOCK    | Admin/Security    |
| EX-003  | Invoice amount export requested     | BLOCK    | Finance/CostGuard |
| EX-004  | PII detected in export payload      | ZERO     | Security          |
| EX-005  | Export without approval actor       | BLOCK    | Logistics Lead    |

### 18.4 Rollback Rules

| Rule ID | Rule                                 | Severity | Owner          |
| ------- | ------------------------------------ | -------- | -------------- |
| RB-001  | Rollback requested for approved link | AMBER    | Logistics Lead |
| RB-002  | Rollback target audit not found      | BLOCK    | Admin          |
| RB-003  | Rollback approved                    | INFO     | System         |
| RB-004  | Rollback affects published export    | BLOCK    | Logistics Lead |

---

## 19. Agentic UX: Dry-run → Human Gate → Audit

### 19.1 Tool Execution Policy

| Action                  | Auto |             Human Gate | Reason                     |
| ----------------------- | ---: | ---------------------: | -------------------------- |
| Search                  |  Yes |                     No | read-only                  |
| Candidate link proposal |  Yes |                     No | draft only                 |
| Confirm link            |   No |                    Yes | changes operational truth  |
| Generate report draft   |  Yes |                     No | draft only                 |
| Publish/export report   |   No |                    Yes | external/controlled output |
| Rollback approved link  |   No |                    Yes | changes operational truth  |
| Cost judgment           |   No |          Yes + Phase 3 | P2/finance risk            |
| Customs approval        |   No | Yes + customs evidence | compliance risk            |
| Vendor/carrier send     |   No |                    Yes | irreversible communication |

### 19.2 Human Gate Payload

```json
{
  "summary": "Approve HVDC Code to ShipmentUnit link",
  "risk": {
    "reversible": true,
    "p2Accessed": false,
    "downstreamImpact": ["document_matrix", "exception_queue", "dashboard"]
  },
  "evidence": [
    {
      "documentType": "PL",
      "field": "packageNo",
      "confidence": 0.96
    }
  ],
  "actions": ["APPROVE", "REJECT", "REQUEST_EVIDENCE", "ESCALATE"]
}
```

### 19.3 Rollback Payload

```json
{
  "summary": "Rollback approved HVDC Code link",
  "targetAuditId": "AUD-2026-000001",
  "risk": {
    "reversible": true,
    "p2Accessed": false,
    "publishedExportAffected": false
  },
  "before": {
    "linkStatus": "CONFIRMED"
  },
  "after": {
    "linkStatus": "ROLLED_BACK"
  },
  "actions": ["APPROVE_ROLLBACK", "REJECT_ROLLBACK", "REQUEST_EVIDENCE"]
}
```

---

## 20. Export Scope

| Export Type             | Allowed in Phase 1 | Condition                   |
| ----------------------- | -----------------: | --------------------------- |
| Redacted dashboard      |                Yes | P2 masked                   |
| Exception list          |                Yes | role/name masked            |
| Evidence matrix         |                Yes | source hash only            |
| Audit summary           |                Yes | no P2, no original file     |
| Original document       |                 No | private storage only        |
| Invoice amount report   |                 No | Phase 3                     |
| Customs approval report |                 No | Customs process only        |
| Vendor/carrier email    |                 No | separate communication gate |

### 20.1 Export Sanitizer

| Check                             | Action                        |
| --------------------------------- | ----------------------------- |
| PII detected                      | ZERO / block export           |
| Contract/rate detected            | ZERO / block export           |
| Original document link detected   | BLOCK                         |
| Invoice amount detected           | BLOCK unless Phase 3 approval |
| BOE/HS approval language detected | BLOCK                         |
| Source hash only                  | allowed                       |
| Masked role/owner                 | allowed                       |

---

## 21. Security / P2 Handling

| Area           | Rule                                            |
| -------------- | ----------------------------------------------- |
| Contract/rate  | Phase 1 저장 금지                               |
| Invoice amount | masked 또는 range만 표시                        |
| PII            | role/name masking                               |
| Source files   | private storage + access log                    |
| LLM prompt     | P2 원문 금지                                    |
| Export         | Human Gate 필요                                 |
| Audit          | source hash 저장, 원문 복사 제한                |
| RBAC           | Ops, Document, Customs, Finance, WH, Admin 분리 |
| Event payload  | sensitive field 금지                            |
| Rollback       | audit chain 유지                                |

---

## 22. Prototype Pipeline + Simulation Report

### 22.1 Prototype Scope

| Prototype | 설명                                      |
| --------- | ----------------------------------------- |
| P1-A      | HVDC Code search + candidate resolution   |
| P1-B      | ShipmentUnit detail + document matrix     |
| P1-C      | Document Guard rule run + exception queue |
| P1-D      | Human Gate approval + audit log           |
| P1-E      | Partial shipment handling                 |
| P1-F      | Rollback flow                             |
| P1-G      | Redacted export flow                      |

### 22.2 Simulation Dataset

| Dataset               |  Count | Purpose                |
| --------------------- | -----: | ---------------------- |
| Normal HVDC Code      |  25.00 | baseline               |
| Missing HVDC Code     |  15.00 | fallback               |
| Multi-link HVDC Code  |  10.00 | ambiguous review       |
| Partial shipment      |  10.00 | split evidence         |
| Document mismatch     |  20.00 | Document Guard         |
| WH/Site mismatch      |  10.00 | custody timeline       |
| Invoice evidence only |   5.00 | Cost judgment BLOCK    |
| BOE evidence only     |   5.00 | Customs judgment BLOCK |
| Total                 | 100.00 | Gate simulation        |

### 22.3 Simulation Log Template

```json
{
  "scenario": "HVDC Code exact match",
  "input": "HVDC-XXXX-0001",
  "expected": "ShipmentUnit candidate returned",
  "actual": "ShipmentUnit returned with score 0.96",
  "events": ["search.started", "search.completed", "identifier.resolved"],
  "verdict": "PASS",
  "auditId": "AUD-2026-000001"
}
```

---

## 23. Validation Plan + Decision Gates

### 23.1 Gate Criteria

| Gate       | Go                              | Revise                        | Stop                      |
| ---------- | ------------------------------- | ----------------------------- | ------------------------- |
| Search     | HVDC search ≥ 95.00%            | 85.00~94.99%                  | < 85.00%                  |
| Link       | correct link ≥ 95.00%           | 90.00~94.99%                  | < 90.00%                  |
| Numeric    | Numeric Integrity 100.00%       | minor display issue           | value loss                |
| Event      | required event coverage 100.00% | non-critical event missing    | KPI unmeasurable          |
| Audit      | audit coverage 100.00%          | missing non-critical metadata | missing controlled action |
| Rollback   | rollback success ≥ 95.00%       | 90.00~94.99%                  | < 90.00%                  |
| A11y       | blocker 0건                     | minor issue                   | keyboard/focus blocker    |
| Security   | P2 leakage 0건                  | masking warning               | P2 leak                   |
| Human Gate | irreversible action blocked     | warning only                  | unauthorized write/export |

### 23.2 Acceptance Criteria

|  No | Criteria                                                                     |
| --: | ---------------------------------------------------------------------------- |
|   1 | HVDC Code 입력 시 3.00초 이내 후보 반환                                      |
|   2 | HVDC Code에서 ShipmentUnit, BL, CI, PL, BOE, DO, WH, Site evidence 확인 가능 |
|   3 | BOE/Invoice는 evidence link까지만 표시                                       |
|   4 | Cost/Customs 판단 요청 시 BLOCK                                              |
|   5 | identifier confidence < 0.92는 review queue 이동                             |
|   6 | 모든 approve/reject/request evidence는 audit log 생성                        |
|   7 | P2 원문 없이 dashboard/report 생성 가능                                      |
|   8 | keyboard-only로 search→detail→exception review 가능                          |
|   9 | partial shipment는 split evidence 기준으로 표시                              |
|  10 | 잘못 승인된 link는 Human Gate 후 rollback 가능                               |
|  11 | redacted export만 허용되고 original document export는 차단                   |
|  12 | KPI event schema 없이는 Gate Stop 처리                                       |

---

## 24. 4-Week MVP Backlog

| Week | Workstream        | Deliverable                                             | Acceptance                                  |
| ---: | ----------------- | ------------------------------------------------------- | ------------------------------------------- |
|    1 | Data foundation   | HVDC Code registry, identifier dictionary, DB migration | HVDC/Package/PO/container/BL key searchable |
|    1 | Event schema      | telemetry event table + required events                 | KPI event coverage 설계 완료                |
|    1 | UI skeleton       | search, detail, exception pages                         | route works                                 |
|    1 | RBAC baseline     | role permission matrix                                  | controlled action 분리                      |
|    2 | Resolution engine | HVDC Code-first resolver                                | sample match ≥ 90.00%                       |
|    2 | Partial shipment  | split evidence model/rules                              | HK-010~012 동작                             |
|    2 | Ingestion         | document upload + field storage                         | hash/confidence/page/row stored             |
|    2 | Source priority   | field priority engine                                   | conflict rule 적용                          |
|    3 | Document Guard    | HK/DG/EX/RB rules v0.1                                  | AMBER/BLOCK/ZERO generated                  |
|    3 | Tolerance engine  | qty/weight/CBM/date tolerance                           | rule result stable                          |
|    3 | Exception Queue   | owner/status/SLA                                        | assignment 100.00%                          |
|    3 | Export sanitizer  | redacted export check                                   | P2 export blocked                           |
|    4 | Human Gate        | approve/reject/request evidence                         | audit coverage 100.00%                      |
|    4 | Rollback Center   | rollback request/approve/audit                          | rollback simulation pass                    |
|    4 | Simulation        | 100.00 sample dry-run                                   | validation report generated                 |
|    4 | Gate Review       | Go/Revise/Stop                                          | ZERO condition 0건                          |

---

## 25. Handoff + Traceability Bundle

### 25.1 Repository Structure

```text
docs/
  guidelines/
    phase1-hvdc-code-first-evidence-control-tower-v1.10.md
  traceability/
    decision-log.md
    simulation-log.md
    validation-report.md
    changelog.md

schemas/
  shipment-unit.schema.json
  identifier.schema.json
  document-field.schema.json
  document-guard-result.schema.json
  telemetry-event.schema.json
  audit-record.schema.json
  rollback-request.schema.json
  export-request.schema.json

db/
  migrations/
    001_phase1_hvdc_spine.sql
    002_phase1_events_rollback_export.sql

rules/
  hvdc-identifier-resolution-v0.1.json
  document-guard-v0.1.json
  source-priority-v0.1.json
  tolerance-rules-v0.1.json
  export-sanitizer-v0.1.json

ui/
  wireframes/
    search.md
    shipment-unit-detail.md
    exception-queue.md
    rollback-center.md
    export-center.md
```

### 25.2 Decision Log

| Date       | Decision                    | Rationale                       | Validation      |
| ---------- | --------------------------- | ------------------------------- | --------------- |
| 2026-05-15 | HVDC Code-first 채택        | 현장/자재 중심 검색에 적합      | sample 100.00건 |
| 2026-05-15 | BOE/Invoice는 evidence only | customs/cost 판단은 BLOCK       | rule test       |
| 2026-05-15 | Human Gate 필수             | write/export/approval risk 차단 | E2E test        |
| 2026-05-15 | Event schema 추가           | KPI 측정 가능성 확보            | telemetry test  |
| 2026-05-15 | Partial shipment rule 추가  | 다중 ShipmentUnit 연결 방지     | split scenario  |
| 2026-05-15 | Rollback flow 추가          | 잘못 승인한 link 복구           | rollback test   |
| 2026-05-15 | Export scope 제한           | P2 leakage 방지                 | sanitizer test  |

---

## 26. Final ZERO Conditions

| 단계                     | 이유                            | 위험               | 요청데이터            | 다음조치       |
| ------------------------ | ------------------------------- | ------------------ | --------------------- | -------------- |
| P2 입력                  | 계약/단가/PII 원문 포함         | 정보유출           | redacted sample       | ZERO 중단      |
| Cost judgment            | RateRef/TariffRef 없음          | 정산 dispute       | Cost evidence pack    | Phase 3 분리   |
| Customs approval         | HS/COO/permit/BOE evidence 부족 | 통관 리스크        | Customs evidence pack | Human Gate     |
| Auto export/send         | 승인 actor 없음                 | 오송신             | approval payload      | 차단           |
| KPI 미측정               | event schema 없음               | 검증 불가          | event schema          | Stage 0 재정의 |
| A11y blocker             | keyboard/focus 불가             | 사용성/접근성 실패 | fix plan              | release 금지   |
| Original document export | 원문 파일 외부 노출             | P2/PII 유출        | export approval       | Phase 1 금지   |
| Rollback 불가            | 잘못된 link 복구 불가           | 운영 truth 오염    | rollback audit        | release 금지   |

---

## 27. 최종 결론

**Phase 1의 최종 형태는 `HVDC Code-first Evidence Control Tower v1.10`입니다.**

핵심 구조는 다음입니다.

```text
HVDC Code
→ Identifier Resolution
→ ShipmentUnit Spine
→ Evidence Matrix
→ Document Guard
→ Exception Queue
→ Human Gate
→ Audit / Rollback / Redacted Export
```

### 최종 확정사항

|  No | 확정                                                                       |
| --: | -------------------------------------------------------------------------- |
|   1 | 검색 시작점은 **HVDC Code**                                                |
|   2 | 시스템 중심 객체는 **ShipmentUnit**                                        |
|   3 | Phase 1 판단 범위는 **evidence link + discrepancy detection + Human Gate** |
|   4 | Cost/Customs는 자동판정하지 않는다                                         |
|   5 | KPI는 event schema로 측정한다                                              |
|   6 | partial shipment는 split evidence로 처리한다                               |
|   7 | 잘못된 link는 rollback 가능해야 한다                                       |
|   8 | export는 redacted output만 허용한다                                        |

**Gate 판정:** 개발 착수 기준 **GO**.
단, 운영 적용 전에는 redacted sample 100.00건 dry-run, a11y smoke, P2 sanitizer, Human Gate E2E, rollback E2E를 모두 통과해야 합니다.
