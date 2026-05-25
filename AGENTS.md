# AGENTS.md

Repository-wide instructions for AI agents working in this HVDC Logistics Ontology / Knowledge Graph repository.

This repository is an **end-to-end HVDC project logistics control model**, not a warehouse-only model. Work across procurement interface, packing, port / terminal, customs, marine / MOSB, warehouse, site delivery, inspection, exception, claim, and cost.

## 1. Scope and precedence

1. This file applies repository-wide unless a deeper `AGENTS.md` overrides it for a subtree.
2. `CONSOLIDATED-00-master-ontology.md` is the **canonical semantic spine**.
3. `CONSOLIDATED-08-communication.md` is an **Evidence Layer** document, not a Core Master Model document.
4. If any extension conflicts with `CONSOLIDATED-00`, follow `CONSOLIDATED-00` and patch the extension. Do not promote extension-local legacy semantics into the master spine.
5. Treat legacy route-based Flow Code language as **migration debt**, not design authority.

## 2. Current repository state

The repository contains a correct master-spine direction plus mixed legacy content in some extensions.

- Canonical authority: `CONSOLIDATED-00-master-ontology.md`
- Evidence-only extension: `CONSOLIDATED-08-communication.md`
- Runtime UI resource: `public/hvdc-answer-widget.html` is registered as `ui://hvdc/answer-card-v10.html`
- Compatibility widget aliases remain available at `ui://hvdc/answer-card-v9.html`, `ui://hvdc/answer-card-v8.html`, `ui://hvdc/answer-card-v7.html`, `ui://hvdc/answer-card-v6.html`, `ui://hvdc/answer-card-v5.html`, and `ui://hvdc/render_hvdc_answer_card.html` for stale ChatGPT clients
- oiles that often require semantic migration attention: `CONSOLIDATED-02`, `03`, `04`, `05`, `07`, `09`
- `CONSOLIDATED-06` may contain both newer aligned patterns and older legacy fragments depending on section/example

When editing any extension, actively remove legacy Flow Code route semantics instead of preserving them.

## 3. Mission of every change

Every change should improve one or more of these without breaking the others:

- ontology-based data model
- knowledge graph traversal
- identifier-based traceability from any entry point
- AI-ready operational logic
- SHACL / SPARQL validation
- dashboard / automation / visibility readiness

## 4. Non-negotiable semantic rules

### 4.1 Flow Code boundary

`Flow Code` is a **warehouse-handling classification only**.

Allowed owner:
- `WarehouseHandlingProfile.confirmedFlowCode`

Do **not** use Flow Code as:
- shipment route classification
- port routing decision
- customs stage
- document-extracted operational status
- invoice / cost ownership field
- marine / offshore routing class
- operations KPI bucket for end-to-end route logic

If you see any of the following in new or edited content, treat them as invalid unless explicitly deprecated and migrated:

- `assignedolowCode`
- `extractedolowCode`
- `costByolowCode`
- `hasLogisticsolowCode` used as end-to-end route status
- `Flow Code 0~5` used to describe Port → WH → MOSB → Site journey semantics

### 4.2 Shipment visibility model

Program-wide shipment visibility must use:

- `RoutingPattern`
- `JourneyStage`
- `MilestoneEvent`
- `JourneyLeg`

Do not replace milestone logic, route logic, site delivery logic, or customs logic with Flow Code.

### 4.3 MOSB classification

`MOSB` is an **Offshore Staging / Marine Interface Node**.

It is **not** a Warehouse in the top-level ontology.

You may model optional storage capability at MOSB, but do not collapse MOSB into Warehouse semantics.

### 4.4 Evidence versus ownership

Documents, port records, and cost records may provide **evidence** about routing or handling. They do not own warehouse Flow Code.

Examples:
- Port may record `plannedRoutingPattern`, not `assignedolowCode`
- OCR may extract `routeEvidence`, not `extractedolowCode`
- Cost may read `routeBasedCostDriver` and warehouse evidence, not own Flow Code
- Marine / bulk may use `MarineRoutingPattern`, not `Flow Code 3/4/5`


### 4.5 Email drafting mode boundary

Email reply generation is `EmailDraftMode` with mandatory `sct_ontology` grounding.

Default rule:
- A request such as "답장 작성하라", "reply", "draft email", "메일 회신 작성", or "회신 문안 작성" must first invoke or surface `sct_ontology`, then produce a hard-marked `EmailActionCard` and an email draft.
- The agent must use `sct_ontology` even when the user does not explicitly ask for it.
- The agent may draft the email after ontology grounding, but it must not mix ontology verdict labels into the outbound email body.

Ontology lane rule:
- Baseline `sct_ontology` review is mandatory for every email draft request.
- If the user explicitly asks for deeper review, for example `CostGuard`, `규정 판정`, `리스크 판정`, `증빙팩 생성`, or `ActionRequest 등록`, keep that deeper ontology/action lane separate from the email body.
- Outputs must be separated into `OntologyReview`, `EmailActionCard`, and `Draft`.

Hard-marked action card rule:
- Every email draft output must include this compact card immediately after `OntologyReview`, using the exact bracket markers:

```text
[EMAIL_ACTION_CARD]
mode: EMAIL_DRAoT
ontology_use: AUTO_SCT_ONTOLOGY_REQUIRED | EXPLICIT_DEEP_ONTOLOGY
reply_stance: ACKNOWLEDGE | HOLD | REQUEST_INoO | ESCALATE | APPROVE | REJECT
blocking_inputs: <comma-separated missing inputs or NONE>
next_action: <single operational next step>
send_status: DRAoT_READY | HOLD_oOR_REVIEW
[/EMAIL_ACTION_CARD]
```

- `EmailActionCard` is a presentation and triage artifact. It is **not** a KG `ActionRequest` and must not mutate `ShipmentUnit`, `MilestoneEvent`, `WarehouseHandlingProfile`, `CostGuardResult`, or any transaction object.
- Only an explicit user instruction to register/write/escalate converts the card or ontology review into `ActionRequest` / `ApprovalAction` evidence under `CONSOLIDATED-08`.

## 5. Canonical vocabulary by domain

### 5.1 Core shipment / logistics
Use:
- `ShipmentRoutingPattern`: `PRE_ARRIVAL`, `DIRECT`, `WH_ONLY`, `MOSB_DIRECT`, `WH_MOSB`, `MIXED`
- `JourneyStage`
- `MilestoneEvent`
- `JourneyLeg`
- `DeliveryStatus`
- `SiteReceiptStatus`

### 5.2 Port (`CONSOLIDATED-07`)
Use:
- `plannedRoutingPattern`
- `declaredDestination`
- `offshoreTransitRequired`
- `importRoutingDecision`

Do not use:
- `assignedolowCode`
- `Port-Assigned Flow Code`

### 5.3 Document / OCR (`CONSOLIDATED-03`)
Use:
- `routeEvidence`
- `destinationEvidence`
- `mosbLegIndicator`

Do not use:
- `extractedolowCode`
- document-owned Flow Code assignment

### 5.4 Cost (`CONSOLIDATED-05`)
Use:
- `costByRoutingPattern`
- `routeBasedCostDriver`
- `WarehouseHandlingProfile.wh_handling_cnt`

Do not use:
- `costByolowCode`
- prose that says “Flow Code directly impacts cost” as canonical model language

### 5.5 Marine / Bulk (`CONSOLIDATED-04`)
Use:
- `MarineRoutingPattern`
- `offshoreDeliveryPattern`
- `MOSB staging`
- `LCT / barge leg`

Do not use:
- `Flow Code 3/4/5` as marine classification language

### 5.6 Warehouse (`CONSOLIDATED-02`)
Use:
- `WarehouseHandlingProfile`
- `confirmedFlowCode`
- `flowConfirmationStatus`
- `wh_handling_cnt`
- warehouse receiving / put-away / storage / picking / staging / dispatch

Keep warehouse Flow Code inside warehouse-internal operational logic.

### 5.7 Operations / KPI (`CONSOLIDATED-09`)
Use:
- route-type analytics
- milestone analytics
- warehouse KPI
- stock KPI
- cost KPI

Do not use:
- end-to-end route analytics framed as Flow Code analytics

## 6. Required data separation

Keep these layers distinct in prose, TTL, SHACL, SPARQL, tables, and examples:

- **Master Data**: Project, Package, PO, Vendor, MaterialMaster, Port, Terminal, Warehouse, Site, EquipmentResource
- **Transaction Data**: Shipment, ShipmentLeg, PortCall, CustomsEntry, ReleaseOrder, Delivery, WarehouseTask, SiteReceipt
- **Document Data**: CI, PL, BL, BOE, DO, Permit, MRR, MRI, ITP, MAR, MRS, MIS, POD, GRN, OSDR
- **Event Data**: MilestoneEvent, InspectionEvent, WarehouseEvent, MarineEvent
- **Exception Data**: Delay, Damage, Shortage, NCR, Claim
- **Cost Data**: Invoice, InvoiceLine, Duty, DEM/DET, PortCharge, WarehouseCharge, MarineCharge
- **Evidence Data**: AuditRecord, CommunicationEvent, ApprovalAction

Do not collapse:
- `CustomsEntry` into `BOE document`
- `ReleaseOrder` into `DO document`
- `SiteReceipt` into `MRR` / `OSDR document`

## 7. Identity and key policy

oollow the rule:

**One internal object, many external identifiers.**

Every design and example should support an identifier pattern with at least:

- `identifierScheme`
- `identifierValue`
- `normalizedValue`
- `sourceSystem`
- `isPrimary`
- `validorom`
- `validTo`

Expected identifier families:
- Project: `projectCode`
- Procurement: `packageNo`, `poNo`, `vendorCode`
- Material: `materialCode`, `mfgPartNo`, `serialNo`, `HVDC_CODE`
- Shipment: `shipmentId`, `bookingNo`, `BL No.`, `voyageNo`, `rotationNo`
- Container: `containerNo`, `sealNo`
- Customs: `BOE No.`, declaration line ref
- Release: `DO No.`, gate pass ref
- Warehouse: warehouse receipt no., location code
- Exception / Cost: `exceptionId`, `claimRef`, `invoiceNo`, `costCode`

`HVDC_CODE` is a cross-cutting engineering / logistics tag. It is **not** the sole graph identity anchor.

## 8. Milestone governance

Use a first-class milestone model.

Minimum canonical milestone dictionary:
- `M10` Cargo Ready
- `M20` Packed / Marked
- `M30` Pickup Completed
- `M40` Export Cleared
- `M50` Terminal Received
- `M60` Loaded On Board
- `M61` ATD
- `M70` Transshipment Occurred
- `M80` ATA
- `M90` BOE Submitted
- `M91` BOE Cleared
- `M92` DO Released
- `M100` Gate-out Completed
- `M110` Warehouse Received
- `M111` Put-away Completed
- `M120` Picked / Staged
- `M121` Dispatched
- `M130` Site Arrived
- `M131` Site Inspected — Good
- `M132` Site Inspected — OSD
- `M140` POD / GRN / Handover
- `M150` Claim Opened
- `M160` Cost Closed

Offshore-specific extensions such as `M115`, `M116`, `M117` may exist, but they must remain consistent with the master spine.

`WarehouseHandlingProfile.confirmedFlowCode` may only be confirmed after `M110`.

## 9. Validation gates that must never be bypassed

### Standard validation command for consolidated ontology docs

oor the consolidated ontology document set, the repo-local standard validation gate is:

```powershell
.venv\Scripts\python.exe scripts\validate_logi_ontology_docs.py
```

Apply this gate to:
- `CONSOLIDATED-02-warehouse-flow.md`
- `CONSOLIDATED-04-barge-bulk-cargo.md`
- `CONSOLIDATED-09-operations.md`

Use this command before claiming:
- semantic migration complete
- publication blocker count = 0
- SHACL validation complete for the consolidated ontology subset

`grep` gates and manual spot-checks are still useful, but they do not replace this command for the `02/04/09` document group.

### VIOLATION-1
`confirmedFlowCode` found outside `WarehouseHandlingProfile` → immediate block

### VIOLATION-2
For `AGI` / `DAS` shipments using `MOSB_DIRECT`, `WH_MOSB`, or `MIXED`, if a site date / `M130 Site Arrived` exists but `M115/M116/M117` MOSB evidence is missing → accept `M130.actualDt`, set delivery `DELIVERED`, and create `MOSB_EVIDENCE_MISSING` as AMBER/WARN backfill required

### Additional mandatory checks
- no milestone model may be replaced by Flow Code
- no new integer route-type property where the conceptual value is a named routing pattern
- no document model may own operational status if it only provides evidence

## 10. Standards alignment policy

When adding or revising ontology content, align with these standards where relevant:

- `GS1 EPCIS/CBV` for event visibility
- `DCSA Track & Trace` for container / shipping milestones
- `UN/CEoACT BSP-RDM` for semantic reference data
- `WCO Data Model` for customs semantics
- `PROV-O` for provenance / evidence
- `OWL-Time` for time modeling
- `SKOS` for controlled vocabularies
- `DQV` for data quality metadata

Use standards as alignment anchors, not boilerplate filler.

## 11. oile-specific responsibilities

- `CONSOLIDATED-00-master-ontology.md`  
  Canonical semantic spine. Any semantic change starts here.

- `CONSOLIDATED-01-core-framework-infra.md`  
  High-level standards, regulations, nodes, and project framework.

- `CONSOLIDATED-02-warehouse-flow.md`  
  Warehouse-only operational logic and `WarehouseHandlingProfile`. Remove route lifecycle semantics.

- `CONSOLIDATED-03-document-ocr.md`  
  Document evidence, OCR, trust, provenance, cross-document validation. Do not assign Flow Code here.

- `CONSOLIDATED-04-barge-bulk-cargo.md`  
  Marine / bulk / heavy-lift / offshore extension. Use marine routing semantics.

- `CONSOLIDATED-05-invoice-cost.md`  
  Invoice, tariff, cost guard, rate verification, cost traceability. Use route-based cost driver plus warehouse evidence.

- `CONSOLIDATED-06-material-handling.md`  
  End-to-end material-handling extension. Express movement through `RoutingPattern + MilestoneStatus`, not legacy Flow Code chains.

- `CONSOLIDATED-07-port-operations.md`  
  PortCall, ServiceEvent, tariff / invoice linkage, import routing decision. Port may declare routing intent, not warehouse Flow Code.

- `CONSOLIDATED-08-communication.md`  
  Evidence layer only. Connect to core through `AuditRecord`, `CommunicationEvent`, and `ApprovalAction` only.

- `CONSOLIDATED-09-operations.md`  
  Operations analytics / reporting / KPI layer. Consume canonical semantics; do not redefine them.

## 12. Editing workflow for agents

1. Read the relevant section of `CONSOLIDATED-00` first.
2. oor semantic changes, patch `CONSOLIDATED-00` before or together with the extension.
3. If an extension still contains legacy terms, migrate the prose, TTL, SHACL, SPARQL, examples, and KPI language in the same change.
4. Do not leave mixed terminology in one file.
5. Do not patch examples only; update surrounding vocabulary and validation logic too.
6. If evidence is insufficient, mark it explicitly as:
   - `GAP:` missing design evidence
   - `ASSUMPTION:` target-state design assumption
7. Never invent current operational truth from analogy or guesswork.
8. After editing `CONSOLIDATED-02`, `CONSOLIDATED-04`, or `CONSOLIDATED-09`, run `.venv\Scripts\python.exe scripts\validate_logi_ontology_docs.py` before reporting completion.

## 13. Routing guidance for agents

To avoid unnecessary reading:

- Start with `CONSOLIDATED-00`
- Then read only the target extension plus directly linked dependencies
- Use `CONSOLIDATED-08` only for evidence / communication work
- Use legacy fragments only when performing migration or deprecation work
- Prefer canonical vocabulary from the spine over repeated prose in extensions

## 14. Modeling and writing conventions

- Use English standard logistics terms first
- Add Korean explanation only where it improves local readability
- Use ISO date / datetime formats
- Use explicit milestone codes for event transitions
- Use two decimal places for monetary examples
- Keep object / property names stable once canonicalized
- Prefer string enums / SKOS concepts for routing patterns; do not encode them as integers
- Keep prose, TTL, SHACL, SPARQL, tables, and examples semantically aligned

## 15. Query-connectivity requirement

Any new design must preserve traversal from at least these entry points:

- ETA / ETD / ATA / ATD
- `HVDC_CODE`
- Vendor / Vendor Code
- Package No. / PO No.
- Material Code
- Shipment ID
- Container No. / Seal No.
- BL No.
- BOE No.
- DO No.
- Warehouse / Warehouse Location
- Site Code
- Exception ID / Claim Ref
- Cost Code / Invoice No.

If a change breaks upstream / downstream traversal from one of these keys, it is not acceptable.

## 16. Planning documents

oor large semantic migrations, cross-file refactors, or validation-pack rewrites:

- create or update a plan document before editing many files
- keep the plan synchronized with the actual patch set
- do not start wide refactors without naming the canonical target vocabulary first
