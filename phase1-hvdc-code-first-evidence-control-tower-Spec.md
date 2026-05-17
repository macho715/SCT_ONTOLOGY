# Feature Specification: Phase 1 HVDC Code-first Evidence Control Tower

Feature ID/Branch: `phase1-hvdc-code-first-evidence-control-tower`  
Created: 2026-05-16  
Status: Draft  
Owner: `[NEEDS CLARIFICATION: 최종 Product Owner / Business Owner 역할 지정 필요]`  
Input: Uploaded `Phase 1 HVDC Code-first Evidence Control Tower v1.10` detailed design  
Last Updated: 2026-05-16  
Version: `v1.10.0-spec.1`

---

## Summary

### Problem

현재 HVDC 물류 추적은 `BL`, `Container`, `Invoice`, `BOE`, `DO`, `WH Report`, `Site Receipt`가 서로 다른 문서·파일·메일·엑셀에 분산되어 있다.

운영자는 실제로 다음 질문에 답해야 한다.

- “이 `HVDC Code` 자재가 어디까지 왔는가?”
- “어떤 문서가 부족한가?”
- “`BL` / `BOE` / `DO` / `WH` / `Site` evidence가 서로 맞는가?”
- “누가 다음 조치를 해야 하는가?”

기존 `BL-first` 추적 방식은 해상운송 tracking에는 적합하지만, 자재·패키지·현장 수령 중심의 운영 추적에는 한계가 있다. Phase 1은 `HVDC Code`를 primary search key로 사용하고, 관련 `ShipmentUnit`과 evidence를 역방향으로 연결하는 Evidence Control Tower를 제공한다.

### Goals

- G1: 사용자가 `HVDC Code`로 3.00초 이내 관련 `ShipmentUnit` 후보와 evidence status를 조회할 수 있다.
- G2: `HVDC Code`, `Package No`, `PO No`, `Material Code`, `Container No`, `BL No`, `BOE No`, `DO No`, `WH Receipt`, `Site Receipt`, `Invoice No`로 any-key search를 수행할 수 있다.
- G3: `ShipmentUnit`을 중심 객체로 하여 `CI`, `PL`, `BL`, `BOE`, `DO`, `Invoice`, `WH`, `Site` evidence를 통합 표시한다.
- G4: 문서 누락·불일치·partial shipment·source priority conflict를 자동 탐지하고 `Exception Queue`에 owner와 severity를 배정한다.
- G5: `Approve Link`, `Reject Link`, `Rollback`, `Redacted Export`, `Report Publication` 등 controlled action은 `Human Gate`와 `AuditRecord`를 반드시 거친다.
- G6: Phase 1은 evidence link와 discrepancy detection까지만 수행하고, cost/customs 최종 판단은 차단한다.
- G7: KPI 측정을 위해 모든 핵심 action을 event schema로 기록한다.
- G8: P2 정보, 원문 문서, 계약·단가·PII가 redacted export 또는 LLM prompt에 노출되지 않도록 한다.

### Non-Goals

- NG1: Invoice overcharge judgment, cost approval, tariff/rate judgment는 Phase 1 범위가 아니다.
- NG2: HS final classification, customs release approval, BOE 기반 통관 최종 판단은 Phase 1 범위가 아니다.
- NG3: Vendor/carrier에게 자동 이메일 또는 외부 메시지를 발송하지 않는다.
- NG4: Original document public export를 제공하지 않는다.
- NG5: `Document` evidence가 단독으로 operational truth, stock truth, site acceptance, shipment final status를 override하지 않는다.
- NG6: Contract/rate/PII 원문을 Phase 1 data store, export, prompt payload에 포함하지 않는다.
- NG7: Full ERP/WMS/TMS master data governance 또는 master truth 수정 workflow는 Phase 1 범위가 아니다. 단, 변경이 필요한 경우 Human Gate와 audit이 필요하다.

### Scope Summary

| Area | In Scope | Out of Scope |
|---|---|---|
| Search | `HVDC Code` primary search, secondary identifier search | 비식별 자연어 검색 |
| Data Spine | `ShipmentUnit` 중심 evidence 연결 | ERP/WMS/TMS master truth 변경 |
| Evidence | CI/PL/BL/BOE/DO/Invoice/WH/Site matrix | 원문 문서 외부 공개 |
| Rules | HK/DG/EX/RB rule 기반 exception 생성 | Cost/customs 최종 승인 |
| Control | Human Gate, Audit, Rollback | 무승인 write/export/send |
| Export | Redacted dashboard, exception list, evidence matrix, audit summary | Original document, invoice amount report, customs approval report |

---

## User Scenarios & Testing

### User Story 1 - HVDC Code로 ShipmentUnit 및 Evidence 조회 (Priority: P1)

사용자는 `HVDC Code`를 입력해 관련 `ShipmentUnit`, identifier graph, document matrix, WH/Site timeline, exception, audit trail을 확인한다.

Why this priority: `HVDC Code-first`가 본 시스템의 핵심 가치이며, 기존 `BL-first` 운영 한계를 직접 해결한다.

Independent Test: Redacted sample 100.00건 중 `HVDC Code`가 존재하는 케이스를 입력하고, 3.00초 이내 후보, confidence, evidence matrix, risk status가 표시되는지 검증한다.

Acceptance Scenarios:

1. Given 유효한 `HVDC Code`가 `HVDCCodeTag`에 존재한다, When 사용자가 global search에 해당 코드를 입력한다, Then 시스템은 3.00초 이내 관련 `ShipmentUnit` 후보와 confidence score를 반환한다.
2. Given `HVDC Code`가 하나의 `ShipmentUnit`에 연결되어 있다, When 사용자가 결과를 연다, Then 시스템은 `Identifier Graph`, `Document Matrix`, `WH/Site Timeline`, `Exception Panel`, `Audit Trail`을 표시한다.
3. Given 검색 결과의 confidence가 `0.80~0.91`이다, When 결과가 표시된다, Then 시스템은 `Review recommended` 상태로 표시하고 link confirmation을 자동 수행하지 않는다.
4. Given 검색 결과가 없다, When 사용자가 `HVDC Code`를 입력한다, Then 시스템은 `No linked ShipmentUnit found`와 `Create Mapping Request` action을 제공한다.

---

### User Story 2 - Secondary Identifier로 역추적 검색 (Priority: P1)

사용자는 `Package No`, `PO No`, `Container No`, `BL No`, `BOE No`, `DO No`, `Invoice No` 등 secondary key를 입력해 가장 가까운 객체와 `ShipmentUnit`을 찾고, 연결된 `HVDC Code` 유무를 확인한다.

Why this priority: 운영 문서에는 `HVDC Code`가 항상 존재하지 않을 수 있으므로 fallback search가 필요하다.

Independent Test: `HVDC Code`가 누락된 `BL`, `Container`, `Invoice`, `BOE`, `DO`, `WH/Site` sample을 입력하고, 시스템이 mapping required exception을 생성하는지 검증한다.

Acceptance Scenarios:

1. Given 사용자가 `BL No`를 입력한다, When 시스템이 identifier type을 감지한다, Then 시스템은 해당 BL에 연결된 `ShipmentUnit`과 `HVDC Code` 후보를 반환한다.
2. Given `Container No`는 존재하지만 연결된 `HVDC Code`가 없다, When 검색이 완료된다, Then 시스템은 `HVDC_CODE_MISSING` 상태와 `mapping.required` event를 생성한다.
3. Given `Invoice No`만 있고 shipment evidence가 없다, When 검색이 완료된다, Then 시스템은 `AMBER` severity의 cost evidence link request를 생성하고 cost judgment는 수행하지 않는다.

---

### User Story 3 - Document Matrix와 Document Guard로 불일치 처리 (Priority: P1)

Document Controller는 `ShipmentUnit`의 `CI`, `PL`, `BL`, `BOE`, `DO`, `Invoice` evidence 상태와 confidence를 확인하고, 문서 누락·불일치 exception을 처리한다.

Why this priority: 문서 정합성은 evidence control의 핵심이며, owner assignment와 audit이 필요하다.

Independent Test: 문서 누락, quantity mismatch, container mismatch, BOE ref missing, OCR confidence low sample을 입력하고 예상 severity 및 owner가 생성되는지 확인한다.

Acceptance Scenarios:

1. Given `PL` gross weight와 `BL` gross weight 차이가 tolerance를 초과한다, When `Document Guard`가 실행된다, Then 시스템은 `DG-004` exception을 생성하고 severity를 tolerance 기준에 따라 `AMBER` 또는 `BLOCK`으로 설정한다.
2. Given `BL` container와 `DO` container가 다르다, When `Document Guard`가 실행된다, Then 시스템은 `DG-005` `BLOCK` exception을 생성하고 owner를 `Port Ops`로 배정한다.
3. Given key field OCR confidence가 `0.92` 미만이다, When field extraction이 완료된다, Then 시스템은 해당 field를 manual review 대상으로 표시하고 자동 확정하지 않는다.
4. Given `BOE` evidence가 존재한다, When 사용자가 `Customs Approval`을 요청한다, Then 시스템은 Phase 1 boundary violation으로 `BLOCK` 처리한다.

---

### User Story 4 - Partial Shipment 식별 및 검토 (Priority: P1)

Logistics Lead는 하나의 `HVDC Code`가 여러 `ShipmentUnit`에 split되는 경우 partial shipment evidence를 확인하고, split evidence가 없으면 exception을 처리한다.

Why this priority: 동일 `HVDC Code`의 다중 연결은 정상 partial shipment일 수도 있고 잘못된 mapping일 수도 있다.

Independent Test: multi-link HVDC sample 10.00건과 partial shipment sample 10.00건을 입력해 split evidence 존재 여부에 따른 `INFO`, `AMBER`, `BLOCK` 처리를 검증한다.

Acceptance Scenarios:

1. Given 하나의 `HVDC Code`가 여러 `ShipmentUnit`에 연결되어 있고 split evidence가 존재한다, When 사용자가 detail 화면을 연다, Then 시스템은 `Partial Shipment` badge와 split qty/package/site를 표시한다.
2. Given 하나의 `HVDC Code`가 여러 `ShipmentUnit`에 연결되어 있지만 split evidence가 없다, When partial shipment check가 실행된다, Then 시스템은 `HK-011` `AMBER` exception과 evidence request를 생성한다.
3. Given 동일 `HVDC Code`가 서로 다른 site에 연결되어 있고 split evidence가 없다, When rule check가 실행된다, Then 시스템은 `HK-012` `BLOCK` exception을 생성한다.

---

### User Story 5 - Human Gate 승인, Audit, Rollback (Priority: P1)

승인 권한을 가진 사용자는 proposed link를 검토하고 approve/reject/request evidence/escalate 중 하나를 선택한다. 잘못 승인된 link는 Human Gate를 통해 rollback한다.

Why this priority: operational truth를 변경하는 action은 무승인 자동 실행되면 안 된다.

Independent Test: link proposal, approve, reject, rollback request, rollback approval 시나리오를 실행하고 audit coverage가 100.00%인지 검증한다.

Acceptance Scenarios:

1. Given proposed `HVDC Code ↔ ShipmentUnit` link가 존재한다, When Logistics Lead가 approve한다, Then 시스템은 link status를 `CONFIRMED`로 변경하고 `link.approved`, `audit.created` event를 기록한다.
2. Given 사용자가 approval 권한이 없다, When approve link를 시도한다, Then 시스템은 action을 차단하고 audit/security event를 기록한다.
3. Given 승인된 link가 잘못된 것으로 확인된다, When Logistics Lead가 rollback을 요청하고 승인한다, Then 시스템은 이전 link 상태를 복원하고 `rollback.completed`, `audit.created` event를 기록한다.
4. Given rollback 대상 audit record가 존재하지 않는다, When rollback이 요청된다, Then 시스템은 `RB-002` `BLOCK` exception을 생성한다.

---

### User Story 6 - Redacted Export 생성 및 차단 (Priority: P2)

Logistics Lead는 redacted dashboard, exception list, evidence matrix, audit summary를 export할 수 있다. P2, 원문 문서, invoice amount, customs approval language가 포함되면 export는 차단된다.

Why this priority: 운영 보고에는 export가 필요하지만 P2 leakage를 방지해야 한다.

Independent Test: export payload에 PII, contract/rate, original document link, invoice amount, BOE/HS approval language가 포함된 케이스를 입력하고 차단 여부를 검증한다.

Acceptance Scenarios:

1. Given redacted evidence matrix export가 요청된다, When sanitizer가 P2 미포함을 확인하고 Human Gate 승인이 완료된다, Then 시스템은 export를 생성하고 `export.completed`, `audit.created` event를 기록한다.
2. Given original document export가 요청된다, When export rule이 실행된다, Then 시스템은 `EX-002` `BLOCK`으로 export를 차단한다.
3. Given export payload에 PII 또는 contract/rate가 포함되어 있다, When sanitizer가 실행된다, Then 시스템은 `ZERO` severity로 export를 차단하고 보안 audit을 기록한다.

---

### Edge Cases

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

## Requirements

### Functional Requirements

#### Search & Identifier Resolution

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

#### ShipmentUnit Spine & Evidence View

- FR-012: System MUST use `ShipmentUnit` as the central spine object for Phase 1 evidence tracking.
- FR-013: System MUST display a `ShipmentUnit Overview` containing header, current stage, risk status, identifier graph, document matrix, WH/Site timeline, exception panel, audit trail, and available actions.
- FR-014: System MUST display `Identifier Graph` relationships among `HVDC Code`, `Package`, `PO`, `BL`, `Container`, `BOE`, `DO`, `Invoice`, `WH`, and `Site Receipt` where available.
- FR-015: System MUST display `Document Matrix` rows for `CI`, `PL`, `BL`, `BOE`, `DO`, and `Invoice` with present status, confidence, key fields, mismatch count, and action.
- FR-016: System MUST label `BOE` as evidence only and MUST NOT label it as customs approval.
- FR-017: System MUST label `Invoice` as evidence only and MUST NOT label it as cost approval or overcharge judgment.
- FR-018: System MUST show source priority notes when lower-priority sources conflict with higher-priority sources.

#### Document Guard & Exception Queue

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

#### Partial Shipment

- FR-031: System MUST detect when one `HVDC Code` maps to multiple `ShipmentUnits`.
- FR-032: System MUST check whether valid partial shipment evidence exists for multi-link `HVDC Code` cases.
- FR-033: System MUST show `Partial Shipment` view with split quantity, split package, target site, and shipment leg when split evidence exists.
- FR-034: System MUST create `HK-011` `AMBER` exception when partial shipment evidence is missing.
- FR-035: System MUST create `HK-012` `BLOCK` exception when the same `HVDC Code` appears in different sites without split evidence.

#### Human Gate, Audit, Rollback

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

#### Roles & Permissions

- FR-047: System MUST enforce role-based permissions for search, evidence view, approve link, rollback, export, cost judgment, and customs approval.
- FR-048: System MUST allow `Logistics Lead` to search, view evidence, approve links, rollback, and export with gate.
- FR-049: System MUST allow `Document Controller` to search, view evidence, approve/reject links, and request rollback only.
- FR-050: System MUST allow `Site Material Controller` to search and view limited site evidence without approve/export rights.
- FR-051: System MUST allow `Customs Broker` to view customs evidence only and MUST NOT grant customs approval capability in Phase 1.
- FR-052: System MUST allow `Finance / CostGuard` to view invoice evidence only and MUST NOT grant cost judgment capability in Phase 1.
- FR-053: System MUST prevent `Admin` configuration authority from becoming cost/customs approval authority.

#### Export & P2 Handling

- FR-054: System MUST allow Phase 1 exports only for redacted dashboard, exception list, evidence matrix, and audit summary.
- FR-055: System MUST block original document export.
- FR-056: System MUST block invoice amount export unless handled by a future approved CostGuard phase.
- FR-057: System MUST block customs approval report export.
- FR-058: System MUST block vendor/carrier email or send actions in Phase 1.
- FR-059: System MUST run export sanitizer before any export is completed.
- FR-060: System MUST block export when PII, contract/rate, original document links, invoice amounts, or BOE/HS approval language are detected.
- FR-061: System MUST store source hash references instead of original source files in exportable payloads.
- FR-062: System MUST mask role/name, vendor, invoice amount, internal link, and sensitive identifiers according to P2 policy. `[NEEDS CLARIFICATION: exact field-level masking taxonomy required]`

#### Telemetry & KPI Events

- FR-063: System MUST emit required events for search, identifier resolution, mapping, link proposal, link approval/rejection, document ingestion, document guard run, exception lifecycle, review lifecycle, rollback, export, and audit.
- FR-064: System MUST include event payload fields required for KPI calculation: event name, event version, actor role, masked session/input, input type, result count, latency, confidence, shipment unit ID, HVDC code, risk status, P2 accessed flag, and timestamp where applicable.
- FR-065: System MUST NOT include P2 raw values in event payloads.
- FR-066: System MUST calculate KPI metrics from telemetry events without relying on manual spreadsheets.

#### UI / UX

- FR-067: System MUST provide a global search input with placeholder text covering HVDC Code and secondary identifiers.
- FR-068: System MUST show `HVDC Code-first` as a primary search mode indicator.
- FR-069: System MUST show fallback banner when `HVDC Code` is missing or unlinked.
- FR-070: System MUST show `Partial Shipment` badge when one `HVDC Code` maps to multiple `ShipmentUnits`.
- FR-071: System MUST provide screens or equivalent views for Search, ShipmentUnit Overview, Document Matrix, Exception Queue, Review Workspace, Rollback Center, and Export Center.
- FR-072: System MUST provide required UX copy distinguishing evidence links from cost/customs approvals.

### Non-Functional Requirements

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

## Key Entities / Data

### Core Entities

| Entity | Definition | Key Attributes |
|---|---|---|
| `HVDCCodeTag` | Canonical HVDC code tag | `hvdcCode`, `materialId`, `status` |
| `MaterialMaster` | Material reference object | `materialCode`, `descriptionMasked`, `uom` |
| `Package` | Package tracking object | `packageNo`, `poNo`, `hvdcCode` |
| `ShipmentUnit` | Central shipment spine | `shipmentUnitId`, `route`, `stage`, `riskStatus` |
| `Identifier` | Searchable identifier abstraction | `scheme`, `rawValue`, `normalizedValue`, `targetType`, `confidence`, `source` |
| `Document` | Evidence document metadata | `documentId`, `type`, `sourceHash`, `shipmentUnitId`, `confidence` |
| `DocumentField` | Extracted field from document | `fieldName`, `valueMasked`, `valueNumeric`, `valueDate`, `confidence`, `pageNo`, `rowNo` |
| `CargoUnit` | Container/cargo evidence | `containerNo`, `grossWeight`, `cbm` |
| `CustomsEntry` | BOE evidence only | `boeNo`, `linkedBlNo`, `evidenceStatus` |
| `ReleaseOrder` | DO/release evidence only | `doNo`, `validity`, `releaseDate` |
| `WarehouseTask` | WH movement evidence | `taskType`, `warehouse`, `qty` |
| `SiteReceipt` | Site receipt evidence | `site`, `receiptNo`, `receivedQty` |
| `InvoiceReference` | Invoice evidence only | `invoiceNo`, `vendorMasked`, `amountMasked` |
| `PartialShipmentEvidence` | Split shipment evidence | `splitQty`, `splitPackage`, `targetSite`, `evidenceStatus` |
| `Exception` | Rule-generated discrepancy or control item | `ruleId`, `severity`, `owner`, `status`, `evidence` |
| `ReviewDecision` | Human Gate decision record | `decision`, `actorRole`, `reason`, `evidenceIds` |
| `RollbackRequest` | Request to revert approved link | `targetAuditId`, `reason`, `status`, `approvedByRole` |
| `ExportRequest` | Redacted export request | `exportType`, `sanitizerStatus`, `approvalStatus`, `p2Detected` |
| `AuditRecord` | Immutable audit log | `actionType`, `beforeState`, `afterState`, `evidence`, `rollbackAvailable` |
| `TelemetryEvent` | KPI and observability event | `eventName`, `eventVersion`, `actorRole`, `latencyMs`, `confidence`, `p2Accessed`, `payload` |

### Entity Relationships

- `HVDCCodeTag` identifies `MaterialMaster`.
- `HVDCCodeTag` may appear in one or more `Package` records.
- `HVDCCodeTag` resolves to one or more `ShipmentUnit` records.
- `ShipmentUnit` has many `Identifier`, `Document`, `CargoUnit`, `WarehouseTask`, `SiteReceipt`, `Exception`, `ReviewDecision`, `RollbackRequest`, `ExportRequest`, and `AuditRecord` records.
- `ShipmentUnit` may have customs evidence through `CustomsEntry` and release evidence through `ReleaseOrder`.
- `ShipmentUnit` may have invoice evidence through `InvoiceReference`; this is not cost judgment.
- `HVDCCodeTag` and `ShipmentUnit` may be linked through `PartialShipmentEvidence` when split shipment exists.

### Identifier Hierarchy

| Level | Identifier | Target | Authority |
|---:|---|---|---|
| L1 | `HVDC_CODE` | `MaterialMaster` / `HVDCCodeTag` | Primary |
| L2 | `Package No` | `Package` | Strong |
| L3 | `PO No` | `PurchaseOrder` / `Package` | Strong |
| L4 | `Material Code` / `Tag No` | `MaterialMaster` | Strong |
| L5 | `Container No` | `CargoUnit` / `Container` | Transport evidence |
| L6 | `BL No` | `ShipmentUnit` / `BL Document` | Transport evidence |
| L7 | `BOE No` | `CustomsEntry` | Customs evidence only |
| L8 | `DO No` | `ReleaseOrder` | Release evidence only |
| L9 | `WH Receipt No` | `WarehouseTask` | Custody evidence |
| L10 | `Site Receipt` / `GRN` | `SiteReceipt` | Site evidence |
| L11 | `Invoice No` | `InvoiceReference` | Cost evidence only |

---

## Interfaces & Contracts

### API-Level Contracts

| Interface | Purpose | Contract Requirements |
|---|---|---|
| `POST /api/resolve` | Resolve any supported identifier to candidate `ShipmentUnit` and `HVDC Code` links | MUST accept raw key, optional type hint, source; MUST return mode, normalized key, candidates, score, match reasons, risk status, partial shipment flag, next action, and audit metadata. |
| `GET /api/shipment-units/{id}` | Return `ShipmentUnit` detail view | MUST return primary HVDC codes, identifiers, partial shipment status, document matrix, WH timeline, site receipts, exceptions, and audit summary. |
| `POST /api/document-guard/run` | Run evidence and discrepancy rules | MUST return overall result, rule checks, severity, owner role, message, and Human Gate requirement where applicable. |
| `POST /api/review-decisions` | Record Human Gate decision | MUST validate actor role, decision type, evidence references, and create audit record. |
| `POST /api/rollback-requests` | Request rollback for approved link | MUST validate target audit, role, shipment unit, reason, current link state, and downstream export impact. |
| `POST /api/export-requests` | Request controlled redacted export | MUST validate export type, role, sanitizer result, approval status, and prohibited fields. |
| `POST /api/events` | Ingest telemetry event | MUST reject or sanitize P2 raw values and MUST support KPI calculation. |

### Required Events

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

### Source Priority Contract

System MUST apply field-level priority before declaring discrepancy:

| Field | Priority |
|---|---|
| HVDC Code identity | HVDC master → PL → CI → WH/Site |
| Package identity | PL → HVDC master → CI → WH/Site |
| PO No | PO master → CI → PL |
| Container No | BL → DO → BOE → WH |
| BL No | BL → DO → BOE → Invoice ref |
| Gross Weight | PL → BL → CI |
| CBM | PL → BL → CI |
| Quantity | PL → CI → WH Receipt → Site Receipt |
| Site receipt qty | Site Receipt → WH Dispatch → PL |
| Customs evidence | BOE → DO → BL |
| Cost evidence | Invoice → DO/BOE/BL reference |
| Date sequence | ETA → DO release → WH receipt → dispatch → site receipt |

### Export Contract

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

## Assumptions & Dependencies

### Assumptions

- A1: `HVDC Code` exists in material/package master for a meaningful portion of Phase 1 data.
- A2: `Package No` or `PO No` can be used as fallback to map missing `HVDC Code` cases.
- A3: Some WH/Site receipts may not contain `HVDC Code`; package/container based reverse tracing is required.
- A4: OCR confidence `≥ 0.92` is sufficient for field candidate generation but not for automatic operational truth change.
- A5: Cost/customs final decisions remain outside Phase 1 and must be blocked by rule and UX copy.
- A6: Partial shipment is a valid operational pattern and must not be treated as duplicate error when split evidence exists.
- A7: Phase 1 export can operate using redacted reports and source hashes without original document exposure.
- A8: Redacted sample 100.00건 is representative enough for MVP gate validation. `[NEEDS CLARIFICATION: sampling period, data source, and representativeness criteria required]`

### Dependencies

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

## Success Criteria

### Measurable Outcomes

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

### Gate Decision Criteria

| Gate Area | Go | Revise | Stop |
|---|---|---|---|
| Search | HVDC search `≥ 95.00%` | `85.00~94.99%` | `<85.00%` |
| Link | Correct link `≥ 95.00%` | `90.00~94.99%` | `<90.00%` |
| Numeric Integrity | `100.00%` preserved | Minor display issue | Value loss |
| Event | Required event coverage `100.00%` | Non-critical event missing | KPI unmeasurable |
| Audit | Audit coverage `100.00%` | Non-critical metadata missing | Missing controlled action audit |
| Rollback | Rollback success `≥ 95.00%` | `90.00~94.99%` | `<90.00%` |
| A11y | Blocker `0건` | Minor issue | Keyboard/focus blocker |
| Security | P2 leakage `0건` | Masking warning | P2 leak |
| Human Gate | Irreversible action blocked | Warning only | Unauthorized write/export |

---

## Open Questions & Clarifications

### Open Questions

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

### Clarifications Log

- 2026-05-16 Session:
  - Q: 업로드된 v1.10 설계안을 Spec.md로 재구성할 것인가?
  - A: 예. 상세 설계의 핵심 범위는 유지하고, testable requirements, scenarios, success criteria, traceability 중심의 `Spec.md`로 변환함.

---

## Risks & Mitigations

| Risk ID | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | 일부 문서에 `HVDC Code`가 없음 | AMBER | `Package/PO/Material Code` fallback 및 mapping request queue |
| R2 | `BL/BOE/DO`는 있으나 `HVDC Code` 연결이 없음 | AMBER | Secondary identifier resolution 후 `mapping.required` exception 생성 |
| R3 | Invoice에 `HVDC Code/BL/DO` 연결이 없음 | AMBER | Cost evidence link only, cost judgment 차단 |
| R4 | `BOE/HS` 근거로 customs release 판단 요구 | BLOCK | Customs approval out of scope copy 및 Human Gate boundary |
| R5 | Invoice 과청구 판정 요구 | BLOCK | CostGuard phase로 분리, Phase 1에서는 evidence link only |
| R6 | 하나의 `HVDC Code`가 여러 `ShipmentUnit`으로 split | AMBER | Partial shipment rule 및 split evidence requirement |
| R7 | 동일 `HVDC Code`가 다른 site로 중복 연결 | BLOCK | Split evidence 없으면 차단 |
| R8 | P2 단가/계약/PII 입력 또는 export 포함 | ZERO | Private pack 분리, sanitizer, prompt 금지, event masking |
| R9 | KPI event schema 미정의 | ZERO | Event schema 확정 전 Gate Stop |
| R10 | Accessibility blocker | ZERO | Keyboard/focus/error/severity-label fix 전 release 금지 |
| R11 | 잘못 승인된 link 복구 불가 | BLOCK | Rollback Center, audit chain, rollback gate 필수 |
| R12 | Source priority 미적용으로 낮은 신뢰도 문서가 truth처럼 표시됨 | AMBER/BLOCK | Field-level source priority와 discrepancy copy 표시 |
| R13 | 원문 문서 또는 invoice amount export | BLOCK/ZERO | Export scope 제한, sanitizer, Human Gate |

---

## Traceability

| User Story | Functional Requirements | Non-Functional Requirements | Success Criteria |
|---|---|---|---|
| US1 - HVDC Code로 ShipmentUnit 및 Evidence 조회 | FR-001~FR-018, FR-067~FR-071 | NFR-001, NFR-003, NFR-010 | SC-001, SC-002, SC-005, SC-009, SC-013 |
| US2 - Secondary Identifier로 역추적 검색 | FR-002~FR-011, FR-063~FR-066 | NFR-001, NFR-011 | SC-001, SC-002, SC-007, SC-013 |
| US3 - Document Matrix와 Document Guard로 불일치 처리 | FR-015~FR-030, FR-063~FR-066 | NFR-002, NFR-012, NFR-013 | SC-003, SC-004, SC-006, SC-007, SC-013 |
| US4 - Partial Shipment 식별 및 검토 | FR-031~FR-035 | NFR-002, NFR-011 | SC-003, SC-004, SC-005 |
| US5 - Human Gate 승인, Audit, Rollback | FR-036~FR-053, FR-063~FR-066 | NFR-005, NFR-006, NFR-011 | SC-003, SC-008, SC-011, SC-013, SC-015 |
| US6 - Redacted Export 생성 및 차단 | FR-054~FR-062 | NFR-004, NFR-005, NFR-011 | SC-010, SC-012, SC-015 |
| Edge Cases | FR-008~FR-011, FR-024~FR-030, FR-034~FR-035, FR-055~FR-060 | NFR-004, NFR-007~NFR-011 | SC-010, SC-012, SC-014, SC-015 |

---

## Reviewer Checklist

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

## Approval Readiness Assessment

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

## Changelog

- `v1.10.0-spec.1` (2026-05-16): Converted uploaded detailed design v1.10 into testable `Spec.md` format with scenarios, FR/NFR, assumptions, success criteria, risks, traceability, and approval-readiness assessment.
