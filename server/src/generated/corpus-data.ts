import type { CorpusChunk } from "../types.js";

export const CORPUS_CHUNKS = [
  {
    "id": "CONSOLIDATED-00-master-ontology#1",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Logistics Knowledge Graph — Master Ontology\"\ntype: \"master-ontology-spine\"\ndomain: \"hvdc-logistics\"\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nowner: \"HVDC Logistics Ontology Working Set\"\ncanonical_authority: true\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - GS1-EPCIS\n  - DCSA-T&T\n  - UN/CEFACT-BSP-RDM\n  - WCO-DM\n  - ICC-Incoterms-2020\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\nextended_by:\n  - CONSOLIDATED-01-core-framework-infra.md\n  - CONSOLIDATED-02-warehouse-flow.md\n  - CONSOLIDATED-03-document-ocr.md\n  - CONSOLIDATED-04-barge-bulk-cargo.md\n  - CONSOLIDATED-05-invoice-cost.md\n  - CONSOLIDATED-06-material-handling.md\n  - CONSOLIDATED-07-port-operations.md\n  - CONSOLIDATED-09-operations.md\nevidence_layer:\n  - CONSOLIDATED-08-communication.md\nreplaces:\n  - CONSOLIDATED-00-master-ontology.md@2026-04-11\n  - CONSOLIDATED-00-master-ontology_rev.md@2026-04-27\nvalidation_passes: 5\nfinal_validation_rounds: 5\nfinal_validation_status: \"PASS\"\nfinal_validated_date: \"2026-04-27\"\nfinal_patch_bundle: \"HVDC_Logistics_Ontology_FINAL_5x_2026-04-27\"\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#2",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "ExecSummary",
    "text": "HVDC 물류 온톨로지의 master spine은 `ShipmentUnit`을 중심으로 Project, Package, PO, Material, CargoUnit, Container, PortCall, CustomsEntry, ReleaseOrder, WarehouseTask, SiteReceipt, Document, MilestoneEvent, Exception, Cost 객체를 연결한다.\n\n본 문서는 전체 문서 세트(`CONSOLIDATED-01`~`09`, `AGENTS.md`, `HVDC Logistics Ontology Review.txt`, Palantir Semantic Digital Twin PDF)를 기준으로 재작성한 canonical reference다. Extension 문서가 본 spine과 충돌하면 본 문서가 우선한다.\n\n핵심 설계는 **Any-key in → Identifier resolution → ShipmentUnit → route/document/customs/warehouse/site/cost/exception full trace**이다. KPI 목표는 Key Resolution ≥ **95.00%**, Milestone Coverage ≥ **90.00%**, NumericIntegrity = **100.00%**, Validation p95 < **5.00s**이다.\n\n**ENG-KR one-liner:** Any key resolves to one operational twin; routing uses `RoutingPattern`, execution uses `MilestoneEvent`, evidence uses documents, and warehouse handling uses `WarehouseHandlingProfile` only.\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#3",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Table of Contents",
    "text": "1. [Governance & Corpus Boundary](#part-1)\n2. [Canonical Dictionaries](#part-2)\n3. [Identity & Key Policy](#part-3)\n4. [Core Master Data Model](#part-4)\n5. [Execution Transaction Model](#part-5)\n6. [Document & Evidence Model](#part-6)\n7. [End-to-End Process & Milestone Model](#part-7)\n8. [Knowledge Graph Node/Edge Design](#part-8)\n9. [Integration Architecture](#part-9)\n10. [Validation Rules: SHACL, SPARQL, RAG, Human-gate](#part-10)\n11. [Compliance Controls](#part-11)\n12. [Warehouse Flow Code Policy](#part-12)\n13. [Options, Roadmap, Automation, QA](#part-13)\n14. [CmdRec](#cmdrec)\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#4",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "1.1 Master Governance Rule",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the **canonical semantic spine** for the repository.\n2. Program-wide shipment visibility shall use **`RoutingPattern` + `JourneyStage` + `MilestoneEvent` + `JourneyLeg`**.\n3. Port, customs, document/OCR, cost, marine, operations, and communication domains may provide **evidence**; they shall not own warehouse handling classification.\n4. `MOSB` is an **Offshore Staging / Marine Interface Node**. It is not a top-level `Warehouse` class.\n5. `CONSOLIDATED-08-communication.md` is an **Evidence Layer** extension. It connects through `CommunicationEvent`, `ApprovalAction`, and `AuditRecord` only.\n6. Legacy route-coded language is migration debt. It may be listed only in the late migration appendix in [Part 12](#part-12).\n7. Email reply drafting defaults to `EmailDraftMode` with mandatory `sct_ontology` grounding. A draft request must automatically invoke or display `sct_ontology`, then output a hard-marked `EmailActionCard` and the draft while keeping ontology verdict labels out of the outbound email body.",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#5",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "1.2 Corpus Role Matrix",
    "text": "| File | Role in this master spine | Master integration rule |\n|---|---|---|\n| `CONSOLIDATED-01-core-framework-infra.md` | Standards, node infrastructure, compliance anchors | Reuse Party, Asset, Location, Contract, Regulation, KPI concepts as reference-layer classes |\n| `CONSOLIDATED-02-warehouse-flow.md` | Warehouse operations and `WarehouseHandlingProfile` algorithm | Warehouse handling classification belongs here only |\n| `CONSOLIDATED-03-document-ocr.md` | LDG/OCR trust layer and cross-document validation | Documents extract `routeEvidence`, `destinationEvidence`, `mosbLegIndicator` only |\n| `CONSOLIDATED-04-barge-bulk-cargo.md` | Marine, bulk, OOG, lashing, stability, LCT/barge extension | Uses `MarineRoutingPattern`, `MarineEvent`, `OperationTask`, M115/M116/M117 |\n| `CONSOLIDATED-05-invoice-cost.md` | Invoice, rate reference, CostGuard, PRISM.KERNEL | Cost reads route + WH evidence; it does not own warehouse classification |\n| `CONSOLIDATED-06-material-handling.md` | Customs → WH → MOSB → Site material chain | Canonicalizes JourneyStage, milestones, AGI/DAS SiteReceipt/M130 acceptance plus MOSB evidence backfill rule |\n| `CONSOLIDATED-07-port-operations.md` | OFCO/PortCall/ServiceEvent/Tariff hub | Port records `plannedRoutingPattern` and `declaredDestination` as evidence |\n| `CONSOLIDATED-08-communication.md` | Email/chat evidence and action layer | Evidence only; no core logistics class redefinition |\n| `CONSOLIDATED-09-operations.md` | Ops analytics, routing KPI, reporting | Consumes `hasRoutingPattern`, milestone, stock, cost semantics |\n| `AGENTS.md` | Repository-wide modeling governance | Precedence, non-negotiable rules, validation gate policy |\n| `HVDC Logistics Ontology Review.txt` | Structural review and redesign source | Used to normalize layers, identity, milestones, and query entry points |\n| `Palantir 온톨로지 기반 물류 자동화.pdf` | Semantic Digital Twin architecture blueprint | Used for ontology/KG/validation/automation architecture framing |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#6",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "1.3 Data Layer Separation",
    "text": "| Layer | Purpose | Canonical classes |\n|---|---|---|\n| Master Data | Stable reference and planning data | `Project`, `Package`, `PurchaseOrder`, `Vendor`, `MaterialMaster`, `HVDCCodeTag`, `LocationNode`, `EquipmentResource` |\n| Execution Transactions | What moved or was processed | `Shipment`, `ShipmentUnit`, `CargoUnit`, `Container`, `JourneyLeg`, `PortCall`, `CustomsEntry`, `ReleaseOrder`, `WarehouseTask`, `SiteReceipt` |\n| Documents | Documentary evidence | `CommercialInvoiceDocument`, `PackingListDocument`, `BillOfLadingDocument`, `BOEDocument`, `DeliveryOrderDocument`, `PermitDocument`, `MRR`, `MRI`, `ITP`, `MAR`, `MRS`, `MIS`, `POD`, `GRN`, `OSDR` |\n| Events | Time-stamped state transitions | `MilestoneEvent`, `InspectionEvent`, `WarehouseEvent`, `MarineEvent`, `ServiceEvent`, `CommunicationEvent` |\n| Exceptions | Disruption and resolution | `Exception`, `Delay`, `Damage`, `Shortage`, `Overage`, `NCR`, `Claim` |\n| Cost | Financial traceability | `Invoice`, `InvoiceLine`, `RateRef`, `CostTransaction`, `TariffRef`, `DEMDETClock`, `CostGuardResult` |\n| Evidence | Provenance, proof, approvals | `AuditRecord`, `ApprovalAction`, `VerificationResult`, `TrustLayer`, `ProofArtifact` |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#7",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "1.4 Non-collapse Rule",
    "text": "| Do not collapse | Correct model |\n|---|---|\n| `CustomsEntry` into `BOEDocument` | `CustomsEntry` is a transaction; `BOEDocument` is evidence |\n| `ReleaseOrder` into `DeliveryOrderDocument` | `ReleaseOrder` is a release transaction; DO is evidence |\n| `SiteReceipt` into `MRR` / `OSDR` / `POD` / `GRN` | `SiteReceipt` is a site transaction; documents evidence it |\n| `MOSB` into `Warehouse` | `MOSB` is `OffshoreStaging`; optional storage capability is a property, not a class collapse |\n| Route status into warehouse handling classification | Route status uses `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg` |\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#8",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "2.1 RoutingPattern Dictionary",
    "text": "`ShipmentRoutingPattern` is an end-to-end route classifier. It is a SKOS-controlled vocabulary and must be encoded as named concepts, not integers.\n\n| Pattern | Canonical path | Business meaning | Valid owner |\n|---|---|---|---|\n| `PRE_ARRIVAL` | Not yet arrived / insufficient evidence | Pre-arrival or unresolved route | `ShipmentUnit`, `PortCall` evidence |\n| `DIRECT` | Port → Site | No warehouse and no MOSB staging | `ShipmentUnit` |\n| `WH_ONLY` | Port → WH → Site | Warehouse leg, no offshore staging | `ShipmentUnit` |\n| `MOSB_DIRECT` | Port → MOSB → Site | Offshore staging without warehouse leg | `ShipmentUnit` / marine extension |\n| `WH_MOSB` | Port → WH → MOSB → Site | Warehouse plus offshore staging | `ShipmentUnit` / marine extension |\n| `MIXED` | Mixed / incomplete / exceptional | Multi-path, split cargo, or insufficient closure | `ShipmentUnit` |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#9",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "2.2 MarineRoutingPattern Dictionary",
    "text": "| Pattern | Path | Owner domain |\n|---|---|---|\n| `DIRECT_MOSB` | Port → MOSB | `CONSOLIDATED-04`, `CONSOLIDATED-06` |\n| `WH_THEN_MOSB` | WH → MOSB | `CONSOLIDATED-04`, `CONSOLIDATED-06` |\n| `LCT_DIRECT` | LCT / barge direct operation | `CONSOLIDATED-04` |\n| `OFFSHORE_PENDING` | Offshore route not yet confirmed | Exception / marine planning |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#10",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "2.3 JourneyStage Vocabulary",
    "text": "| Stage Code | Korean Name | Entry Milestone | Exit Milestone | Operational use |\n|---|---|---|---|---|\n| `PLANNING` | 계획 | M10 | M20 | Demand/readiness planning |\n| `ORIGIN_DISPATCH` | 원산지 출발 | M20 | M40 | Packing, pickup, export clearance |\n| `PORT_ENTRY` | 입항 | M50 / M80 | M92 | Terminal arrival and import readiness |\n| `TERMINAL_HANDLING` | 터미널 작업 | M50 | M61 | Gate-in, loading, ATD |\n| `CUSTOMS_CLEARANCE` | 통관 | M80 | M92 | BOE and import release |\n| `INLAND_HAULAGE` | 내륙 운송 | M92 | M100 | DO, gate-out, domestic move |\n| `WH_RECEIPT` | 창고 입고 | M100 | M110 | WH appointment and receipt |\n| `WH_STORAGE` | 창고 보관 | M110 | M120 | Put-away, storage, preservation |\n| `WH_DISPATCH` | 창고 출고 | M120 | M121 | Picking, staging, dispatch |\n| `MOSB_STAGING` | MOSB 스테이징 | M121 / direct inland arrival | M115 | Offshore staging |\n| `OFFSHORE_TRANSIT` | 해상 운송 | M116 | M117 | LCT/barge loading and sail-away |\n| `SITE_RECEIVING` | 현장 수령 | M117 / M100 direct | M130 | Arrival and receiving |\n| `MATERIAL_ISSUE` | 자재 불출 | M131/M132 | M140 | Inspection, POD, GRN |\n| `CLOSEOUT` | 완료 | M140 | M160 | Claim/cost closure |\n| `EXCEPTION` | 예외 처리 | Any blocking event | Resolved milestone | Delay/damage/shortage/NCR |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#11",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "2.4 Domain Vocabulary Crosswalk",
    "text": "| Domain | Use | Do not use as canonical |\n|---|---|---|\n| Core shipment | `ShipmentRoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg` | Numeric route codes |\n| Port | `plannedRoutingPattern`, `declaredDestination`, `offshoreTransitRequired`, `importRoutingDecision` | `assignedFlowCode` |\n| Document/OCR | `routeEvidence`, `destinationEvidence`, `mosbLegIndicator`, `routeEvidenceConfidence` | `extractedFlowCode` |\n| Cost | `routeBasedCostDriver`, `costByRoutingPattern`, `wh_handling_cnt` evidence | `costByFlowCode` |\n| Marine/Bulk | `MarineRoutingPattern`, `offshoreDeliveryPattern`, `MarineEvent` | Warehouse route codes |\n| Warehouse | `WarehouseHandlingProfile`, `storageClass`, `flowConfirmationStatus`, `confirmedFlowCode` | E2E route ownership |\n| Operations/KPI | `hasRoutingPattern`, milestone analytics, stock analytics | End-to-end Flow Code analytics |\n| Communication | `CommunicationEvent`, `ApprovalAction`, `AuditRecord` | Core class ownership |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#12",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "2.5 Status Vocabularies",
    "text": "| Vocabulary | Values |\n|---|---|\n| `ShipmentStatus` | `PLANNED`, `READY`, `IN_TRANSIT`, `ARRIVED`, `UNDER_CLEARANCE`, `RELEASED`, `WAREHOUSED`, `DISPATCHED`, `DELIVERED`, `CLOSED`, `EXCEPTION` |\n| `DocumentStatus` | `DRAFT`, `RECEIVED`, `OCR_EXTRACTED`, `VALIDATED`, `REJECTED`, `SUPERSEDED` |\n| `CustomsStatus` | `NOT_STARTED`, `BOE_SUBMITTED`, `UNDER_REVIEW`, `CLEARED`, `HELD`, `REJECTED` |\n| `ReleaseStatus` | `PENDING`, `DO_RELEASED`, `GATE_PASS_ISSUED`, `GATE_OUT`, `BLOCKED` |\n| `StockStatus` | `EXPECTED`, `RECEIVED`, `PUT_AWAY`, `AVAILABLE`, `QUARANTINE`, `PICKED`, `STAGED`, `DISPATCHED`, `ISSUED` |\n| `SiteReceiptStatus` | `EXPECTED`, `ARRIVED`, `INSPECTED_GOOD`, `INSPECTED_OSD`, `ACCEPTED`, `REJECTED`, `CLAIM_OPENED` |\n| `ExceptionStatus` | `OPEN`, `MITIGATING`, `WAITING_APPROVAL`, `RESOLVED`, `CLOSED` |\n| `CostGuardBand` | `PASS`, `WARN`, `HIGH`, `CRITICAL` |\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#13",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "3.1 Identity Principle",
    "text": "**One internal object, many external identifiers.**\n\nEvery operational object must be reachable from at least one external key, and every high-value object must carry normalized key lineage through `Identifier`.\n\n```turtle\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix owl:  <http://www.w3.org/2002/07/owl#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n\nhvdc:Identifier a owl:Class ;\n  rdfs:label \"Logistics Identifier\" ;\n  rdfs:comment \"External key normalized to a resolvable internal object.\" .\n\nhvdc:identifierScheme a owl:DatatypeProperty ; rdfs:domain hvdc:Identifier ; rdfs:range xsd:string .\nhvdc:identifierValue  a owl:DatatypeProperty ; rdfs:domain hvdc:Identifier ; rdfs:range xsd:string .\nhvdc:normalizedValue  a owl:DatatypeProperty ; rdfs:domain hvdc:Identifier ; rdfs:range xsd:string .\nhvdc:sourceSystem     a owl:DatatypeProperty ; rdfs:domain hvdc:Identifier ; rdfs:range xsd:string .\nhvdc:isPrimary        a owl:DatatypeProperty ; rdfs:domain hvdc:Identifier ; rdfs:range xsd:boolean .\nhvdc:validFrom        a owl:DatatypeProperty ; rdfs:domain hvdc:Identifier ; rdfs:range xsd:dateTime .\nhvdc:validTo          a owl:DatatypeProperty ; rdfs:domain hvdc:Identifier ; rdfs:range xsd:dateTime .\nhvdc:confidenceScore  a owl:DatatypeProperty ; rdfs:domain hvdc:Identifier ; rdfs:range xsd:decimal .\n\nhvdc:resolvesTo a owl:ObjectProperty ;\n  rdfs:domain hvdc:Identifier ;\n  rdfs:range owl:Thing .\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#14",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "3.2 Identifier Families",
    "text": "| Family | Identifier schemes | Target objects |\n|---|---|---|\n| Project | `projectCode`, `contractNo`, `siteWorkPackage` | `Project`, `Package` |\n| Procurement | `packageNo`, `poNo`, `vendorCode`, `releaseNo` | `Package`, `PurchaseOrder`, `Vendor` |\n| Material | `materialCode`, `mfgPartNo`, `serialNo`, `HVDC_CODE`, `tagNo` | `MaterialMaster`, `HVDCCodeTag`, `CargoUnit` |\n| Shipment | `shipmentId`, `bookingNo`, `blNo`, `voyageNo`, `rotationNo`, `carrierRef` | `Shipment`, `ShipmentUnit`, `BillOfLadingDocument`, `PortCall` |\n| Container | `containerNo`, `sealNo`, `isoCode` | `Container`, `CargoUnit` |\n| Customs | `boeNo`, `declarationLineRef`, `hsCode`, `cooRef` | `CustomsEntry`, `BOEDocument` |\n| Release | `doNo`, `gatePassRef`, `freeTimeRef` | `ReleaseOrder`, `DeliveryOrderDocument` |\n| Warehouse | `whReceiptNo`, `warehouseId`, `locationCode`, `binNo`, `stockRef` | `WarehouseTask`, `WarehouseLocation`, `WarehouseHandlingProfile` |\n| Site | `siteCode`, `mrrNo`, `mriNo`, `mrsNo`, `misNo`, `podNo`, `grnNo` | `SiteReceipt`, `InspectionEvent`, `MRR`, `POD`, `GRN` |\n| Exception | `exceptionId`, `claimRef`, `ncrRef`, `osdrNo` | `Exception`, `Claim`, `NCR`, `OSDR` |\n| Cost | `invoiceNo`, `invoiceLineNo`, `costCode`, `tariffRef`, `rateRefId` | `Invoice`, `InvoiceLine`, `RateRef`, `CostGuardResult` |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#15",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "3.3 Parent-Child Hierarchy",
    "text": "```text\nProject\n  └─ hasPackage → Package\n       └─ coveredBy → PurchaseOrder\n            └─ issuedTo → Vendor\n                 └─ supplies → MaterialMaster\n                      ├─ taggedBy → HVDCCodeTag\n                      └─ unitizedAs → CargoUnit\n                           ├─ packedIn → Container\n                           └─ belongsTo → ShipmentUnit\n                                ├─ groupedIn → Shipment\n                                ├─ hasJourneyLeg[]\n                                ├─ hasMilestone[]\n                                ├─ hasDocument[]\n                                ├─ hasWarehouseHandlingProfile?  # only if WH event exists\n                                ├─ hasSiteReceipt?\n                                ├─ hasCostItem[]\n                                └─ hasException[]\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#16",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "3.4 Any-key Resolution Flow",
    "text": "```text\nInput key: ETA / HVDC_CODE / Vendor / PO / Package / Material / Shipment / Container / BL / BOE / DO / WH / Site / Claim / Invoice\n  → normalize(identifierScheme, identifierValue)\n  → Identifier.normalizedValue\n  → Identifier.resolvesTo(object)\n  → if object is not ShipmentUnit, traverse to nearest ShipmentUnit\n  → return Operational Twin context:\n      currentStage, routingPattern, currentLocation,\n      journeyLegs, milestones, documents, customs, release,\n      warehouse profile, site receipt, cost, exception, evidence\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#17",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "3.5 Identity Quality Gates",
    "text": "| Gate | Rule | Threshold |\n|---|---|---:|\n| `IdentifierCompleteness` | `identifierScheme`, `identifierValue`, `normalizedValue`, `sourceSystem` required | 100.00% |\n| `AnyKeyResolution` | Key resolves to an object or candidate match | ≥ 95.00% |\n| `HighValueMatchReview` | Invoice or shipment value > 100,000.00 AED requires human review if confidence < 0.98 | 100.00% |\n| `DuplicateClusterCheck` | Same normalized key cannot map to conflicting live objects without `sameAsCandidate` | 0.00 conflicts |\n| `HVDCCodePolicy` | `HVDC_CODE` is a cross-cutting tag, not sole identity anchor | mandatory |\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#18",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "4.1 Master Object Types",
    "text": "| Object Type | Primary internal key | Required properties | Notes |\n|---|---|---|---|\n| `Project` | `projectRid` | `projectCode`, `projectName`, `country`, `status` | Parent scope |\n| `Package` | `packageRid` | `packageNo`, `packageType`, `siteCode`, `requiredDate` | Procurement and site demand bridge |\n| `PurchaseOrder` | `poRid` | `poNo`, `vendorCode`, `incoterm`, `currency`, `issueDate` | Incoterms and payment anchors |\n| `Vendor` | `vendorRid` | `vendorCode`, `vendorName`, `country`, `role` | Supplier/shipper/manufacturer roles |\n| `MaterialMaster` | `materialRid` | `materialCode`, `description`, `uom`, `hsCode`, `originCountry` | HS, origin, compliance |\n| `HVDCCodeTag` | `hvdcCodeRid` | `hvdcCode`, `engineeringArea`, `siteRelevance` | Cross-cutting engineering-logistics tag |\n| `Party` | `partyRid` | `partyCode`, `partyName`, `partyRole` | Shipper, consignee, carrier, broker, authority |\n| `ContractTerm` | `contractTermRid` | `termType`, `termCode`, `effectiveDate` | Incoterm, charter, service contract |\n| `RegulatoryRequirement` | `regReqRid` | `authority`, `requirementType`, `triggerCondition` | MOIAT/FANR/DCD/ADNOC gates |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#19",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "4.2 Location and Node Types",
    "text": "| Object Type | Required properties | Classification rule |\n|---|---|---|\n| `LocationNode` | `nodeCode`, `nodeType`, `name`, `country`, `geoRef` | Superclass for all logistics nodes |\n| `Port` | `portCode`, `UNLOCODE`, `portName` | Port of loading/discharge/entry |\n| `Terminal` | `terminalId`, `terminalName`, `portCode`, `berth` | Terminal under port |\n| `Warehouse` | `warehouseId`, `name`, `warehouseType`, `operator` | Indoor/outdoor/DG/OOG storage node |\n| `WarehouseLocation` | `locationCode`, `zone`, `rackBinYard`, `capacityClass` | Sub-location of `Warehouse` only |\n| `OffshoreStaging` | `nodeCode`, `operator`, `marineAccessMode` | `MOSB` belongs here, not to `Warehouse` |\n| `Site` | `siteCode`, `siteName`, `onshoreOffshore`, `receivingRule` | AGI/DAS/MIR/SHU |\n| `Berth`, `Jetty`, `LaydownYard`, `SiteGate` | local operational fields | Specialized location nodes |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#20",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "4.3 Resource Types",
    "text": "| Object Type | Required properties | Usage |\n|---|---|---|\n| `Carrier` | `carrierCode`, `carrierName`, `mode` | Main carriage / ocean / road / air |\n| `Forwarder` | `forwarderCode`, `name`, `serviceRole` | Freight forwarder / 3PL |\n| `Broker` | `brokerCode`, `name`, `authorityScope` | Customs and permit processes |\n| `EquipmentResource` | `equipId`, `equipType`, `SWL`, `certificateRef` | Crane, forklift, SPMT, spreader, rigging gear |\n| `VesselResource` | `vesselName`, `imo`, `vesselType`, `capacity` | Vessel, LCT, barge, tug |\n| `ManpowerResource` | `personOrRoleId`, `role`, `certificateRef` | Use role-based identifiers where PII masking is required |\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#21",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "5.1 Core Transaction Objects",
    "text": "| Object Type | Required properties | Key links |\n|---|---|---|\n| `Shipment` | `shipmentId`, `mode`, `status`, `plannedRoutingPattern`, `origin`, `destination`, `ETD`, `ETA`, `ATD`, `ATA` | `hasUnit`, `hasPortCall`, `hasDocument` |\n| `ShipmentUnit` | `shipmentUnitId`, `routingPattern`, `currentStage`, `currentLocation`, `declaredDestination` | Central operational twin |\n| `CargoUnit` | `cargoUnitId`, `packageNo`, `grossWeight`, `volume`, `dimensions`, `condition` | `belongsToShipmentUnit`, `packedIn` |\n| `Container` | `containerNo`, `sealNo`, `isoType`, `freeTime` | `containsCargoUnit` |\n| `JourneyLeg` | `legId`, `legSequence`, `fromNode`, `toNode`, `mode`, `plannedETD`, `plannedETA`, `actualATD`, `actualATA` | `departsFrom`, `arrivesAt` |\n| `PortCall` | `portCallId`, `rotationNo`, `portCode`, `plannedRoutingPattern`, `declaredDestination` | `evidencesShipment`, `hasServiceEvent` |\n| `ServiceEvent` | `serviceEventId`, `serviceType`, `eventDt`, `provider`, `costCenter` | Port/OFCO service proof |\n| `CustomsEntry` | `customsEntryId`, `boeRef`, `customsStatus`, `duty`, `broker`, `clearanceDate`, `hsCode` | `referencesBOEDocument` |\n| `ReleaseOrder` | `releaseOrderId`, `doRef`, `releaseDate`, `terminal`, `freeTime`, `gatePassRef` | `referencesDODocument` |\n| `Delivery` | `deliveryId`, `dispatchDate`, `arrivalDate`, `originNode`, `destinationNode`, `vehicleRef` | `usesJourneyLeg` |\n| `WarehouseTask` | `taskId`, `warehouseId`, `locationCode`, `stockStatus`, `storageRequirementClass`, `preservationStatus` | `createsWarehouseEvent` |\n| `SiteReceipt` | `receiptId`, `siteCode`, `receiptType`, `inspectionResult`, `mrrRef`, `osdrRef`, `podRef`, `grnRef` | `generatesSiteDocuments` |\n| `MarineTask` | `marineTaskId`, `marineRoutingPattern`, `vesselRef`, `operationWindow`, `approvalStatus` | `hasMarineEvent`, `usesEquipment` |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#22",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "5.2 Transaction / Document Split",
    "text": "```text\nCustomsEntry --references--> BOEDocument\nReleaseOrder --references--> DeliveryOrderDocument\nSiteReceipt --references--> MRR / MRI / MRS / MIS / POD / GRN / OSDR\nPortCall --evidencedBy--> ArrivalNotice / PortInvoice / ServiceRecord\nWarehouseTask --evidencedBy--> WHReceipt / PutAwayNote / PickList / DispatchNote\nMarineTask --evidencedBy--> PTW / FRA / MethodStatement / LashingPlan / StabilityReport / TideTable\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#23",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "5.3 Foundry Ontology Object Mapping",
    "text": "| Foundry Object Type | Backing dataset family | Cardinality / notes |\n|---|---|---|\n| `ShipmentUnit` | TMS + ERP package + WMS + LDG linked facts | One central operational twin per traceable unit |\n| `Identifier` | normalized keys from all sources | N:1 to target object |\n| `JourneyLeg` | carrier/TMS/road/marine feeds | N:1 to `ShipmentUnit` |\n| `MilestoneEvent` | EPCIS/DCSA/TMS/WMS/port/site events | N:1 to `ShipmentUnit` |\n| `Document` | LDG/OCR/document repository | N:N with ShipmentUnit/CargoUnit/Transaction |\n| `CostGuardResult` | invoice audit pipeline | N:1 to InvoiceLine / Invoice |\n| `WarehouseHandlingProfile` | WMS WH In/put-away events | 0..1 per ShipmentUnit unless split handling exists |\n| `CommunicationEvent` | email/chat/task system | Evidence-only link to object/action |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#24",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "5.4 Action Types",
    "text": "| Action Type | Target | Required parameters | Guard |\n|---|---|---|---|\n| `ResolveAnyKey` | `Identifier` | `identifierScheme`, `identifierValue` | confidence ≥ 0.95 or human review |\n| `RecordPortRoutingEvidence` | `PortCall` | `plannedRoutingPattern`, `declaredDestination`, `offshoreTransitRequired` | No warehouse classification write |\n| `SubmitBOE` | `CustomsEntry` | `boeRef`, `hsCode`, `broker`, `duty` | CI/PL/BL and permit readiness |\n| `ReleaseDO` | `ReleaseOrder` | `doRef`, `releaseDate`, `gatePassRef` | BOE cleared |\n| `RecordGateOut` | `ShipmentUnit` | `terminal`, `actualDt`, `carrier` | DO exists |\n| `ConfirmWHIn` | `WarehouseTask` | `warehouseId`, `actualDt`, `locationCode`, `storageClass` | M110 creates/updates WHP |\n| `StageMOSB` | `MarineTask` | `mosbNode`, `actualDt`, `vesselRef` | Required for AGI/DAS offshore route |\n| `RecordSiteArrival` | `SiteReceipt` | `siteCode`, `actualDt`, `receiptType` | M115 check for AGI/DAS MOSB routes |\n| `CloseCostGuard` | `Invoice` | `reviewDecision`, `approvalRef` | Delta band and human-gate applied |\n| `OpenClaim` | `Exception` | `claimType`, `evidenceDoc`, `amount` | OSDR/NCR evidence required |\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#25",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "6.1 Document Base Class",
    "text": "```turtle\nhvdc:Document a owl:Class ;\n  rdfs:label \"Logistics Document\" .\n\nhvdc:documentNo    a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:string .\nhvdc:docType       a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:string .\nhvdc:docHash       a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:string .\nhvdc:issueDate     a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:date .\nhvdc:sourceSystem  a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:string .\nhvdc:ocrConfidence a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:decimal .\nhvdc:validatedBy   a owl:ObjectProperty ; rdfs:domain hvdc:Document ; rdfs:range hvdc:VerificationResult .\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#26",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "6.2 Document Types",
    "text": "| Document Type | Required properties | Primary validation |\n|---|---|---|\n| `CommercialInvoiceDocument` | `invoiceNo`, `vendor`, `currency`, `totalAmount`, `lineCount` | Invoice total = Σ line ± 2.00% |\n| `PackingListDocument` | `plNo`, `packageCount`, `grossWeight`, `volume` | PL package/weight/volume vs CargoUnit |\n| `BillOfLadingDocument` | `blNo`, `carrier`, `portOfLoading`, `portOfDischarge` | BL vs Shipment/Container/PortCall |\n| `CertificateOfOriginDocument` | `cooNo`, `originCountry`, `issuer` | Origin consistency with material |\n| `BOEDocument` | `boeNo`, `declarationDate`, `customsAuthority` | Evidence for `CustomsEntry` |\n| `DeliveryOrderDocument` | `doNo`, `releaseDate`, `terminal` | Evidence for `ReleaseOrder` |\n| `PermitDocument` | `permitNo`, `authority`, `permitType`, `expiryDate` | MOIAT/FANR/DCD/ADNOC controls |\n| `MRR` / `MRI` | `receiptNo`, `inspectionNo`, `siteCode` | Site receipt and inspection evidence |\n| `MRS` / `MIS` | `requestNo`, `issueNo`, `siteCode` | Material request / issue evidence |\n| `POD` / `GRN` | `podNo`, `grnNo`, `acceptanceDate` | Handover closure |\n| `OSDR` | `osdrNo`, `defectType`, `severity`, `claimRef` | Exception/claim trigger |\n| `PTW` / `FRA` / `MethodStatement` | `approvalNo`, `workScope`, `expiryDate` | Heavy-lift/marine execution gate |\n| `LashingPlan` / `StabilityReport` | `planNo`, `engineerApproval`, `revision` | Marine/OOG technical gate |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#27",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "6.3 OCR / LDG Evidence Properties",
    "text": "| Property | Domain | Range | Ownership rule |\n|---|---|---|---|\n| `routeEvidence` | `Document` | string / SKOS concept | Evidence only; feeds routing decision |\n| `destinationEvidence` | `Document` | site code string | Evidence only |\n| `mosbLegIndicator` | `Document` | boolean | Evidence only |\n| `routeEvidenceConfidence` | `Document` | decimal | 0.00–1.00 |\n| `extractedEntity` | `Document` | `DocumentEntity` | OCR extraction |\n| `crossDocLink` | `DocumentEntity` | `CrossDocLink` | Semantic verification |\n| `verificationResult` | `Document` | `VerificationResult` | LDG result |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#28",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "6.4 Evidence Layer Rules",
    "text": "1. Evidence may support a routing, compliance, cost, or exception decision.\n2. Evidence may not directly mutate the operational truth unless an approved Action writes the transaction object.\n3. Communication records are linked through `CommunicationEvent`, `ApprovalAction`, and `AuditRecord`.\n4. PII shall be masked except approved business names and role-level contacts.\n5. Proof artifacts shall store source document, extraction confidence, rule ID, verdict, timestamp, and reviewer when applicable.\n6. Email drafts are not operational truth, not evidence registration, and not transaction mutation.\n7. Email draft outputs must include mandatory `sct_ontology` review plus `EmailActionCard` with `ontology_use = AUTO_SCT_ONTOLOGY_REQUIRED`.",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#29",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "6.5 OCR KPI Gates",
    "text": "| KPI | Threshold | Action |\n|---|---:|---|\n| `MeanConf` | ≥ 0.92 | Below threshold → human review |\n| `TableAcc` | ≥ 0.98 | Below threshold → table re-extraction |\n| `NumericIntegrity` | 1.00 | Any break → block finance/customs release |\n| `CrossDocumentConsistency` | 1.00 | Strict for CI/PL/BL/BOE/DO critical fields |\n| `RouteEvidenceAccuracy` | ≥ 0.95 | Below threshold → route evidence review |\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#30",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "7.1 MilestoneEvent Class",
    "text": "```turtle\nhvdc:MilestoneEvent a owl:Class ;\n  rdfs:label \"Logistics Milestone Event\" ;\n  rdfs:comment \"First-class event containing planned, estimated, and actual timestamps.\" .\n\nhvdc:milestoneCode    a owl:DatatypeProperty ; rdfs:domain hvdc:MilestoneEvent ; rdfs:range xsd:string .\nhvdc:milestoneName    a owl:DatatypeProperty ; rdfs:domain hvdc:MilestoneEvent ; rdfs:range xsd:string .\nhvdc:plannedDt        a owl:DatatypeProperty ; rdfs:domain hvdc:MilestoneEvent ; rdfs:range xsd:dateTime .\nhvdc:estimatedDt      a owl:DatatypeProperty ; rdfs:domain hvdc:MilestoneEvent ; rdfs:range xsd:dateTime .\nhvdc:actualDt         a owl:DatatypeProperty ; rdfs:domain hvdc:MilestoneEvent ; rdfs:range xsd:dateTime .\nhvdc:statusAfterEvent a owl:DatatypeProperty ; rdfs:domain hvdc:MilestoneEvent ; rdfs:range xsd:string .\nhvdc:eventLocation    a owl:ObjectProperty ;  rdfs:domain hvdc:MilestoneEvent ; rdfs:range hvdc:LocationNode .\nhvdc:responsibleParty a owl:ObjectProperty ;  rdfs:domain hvdc:MilestoneEvent ; rdfs:range hvdc:Party .\nhvdc:sourceDocument   a owl:ObjectProperty ;  rdfs:domain hvdc:MilestoneEvent ; rdfs:range hvdc:Document .\nhvdc:sourceSystem     a owl:DatatypeProperty ; rdfs:domain hvdc:MilestoneEvent ; rdfs:range xsd:string .\nhvdc:exceptionFlag    a owl:DatatypeProperty ; rdfs:domain hvdc:MilestoneEvent ; rdfs:range xsd:boolean .\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#31",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "7.2 Canonical Milestone Dictionary",
    "text": "| Milestone | Name | Journey Stage | Owner domain | Required evidence |\n|---|---|---|---|---|\n| M10 | Cargo Ready | `PLANNING` | Vendor/Expeditor | readiness notice / inspection release |\n| M20 | Packed / Marked | `ORIGIN_DISPATCH` | Vendor | PL / marking sheet |\n| M30 | Pickup Completed | `ORIGIN_DISPATCH` | Forwarder | pickup note / transport order |\n| M40 | Export Cleared | `ORIGIN_DISPATCH` | Export broker | export declaration |\n| M50 | Terminal Received | `PORT_ENTRY` / `TERMINAL_HANDLING` | Terminal | terminal receipt |\n| M60 | Loaded On Board | `TERMINAL_HANDLING` | Carrier | load list / BL |\n| M61 | ATD | `TERMINAL_HANDLING` | Carrier | carrier milestone |\n| M70 | Transshipment Occurred | `TERMINAL_HANDLING` | Carrier | transshipment notice |\n| M80 | ATA | `PORT_ENTRY` | Carrier/Agent | arrival notice |\n| M90 | BOE Submitted | `CUSTOMS_CLEARANCE` | Import broker | BOE draft/submission |\n| M91 | BOE Cleared | `CUSTOMS_CLEARANCE` | Import broker | clearance confirmation |\n| M92 | DO Released | `CUSTOMS_CLEARANCE` | Carrier/Agent | DO / release note |\n| M100 | Gate-out Completed | `INLAND_HAULAGE` | Terminal/Forwarder | gate pass / EIR |\n| M110 | Warehouse Received | `WH_RECEIPT` | Warehouse operator | WH receipt |\n| M111 | Put-away Completed | `WH_STORAGE` | Warehouse operator | put-away note |\n| M115 | MOSB Staged | `MOSB_STAGING` | Marine contractor | MOSB staging record |\n| M116 | LCT/Barge Loaded | `OFFSHORE_TRANSIT` | Marine contractor | load manifest / marine event |\n| M117 | Sail-away Approved | `OFFSHORE_TRANSIT` | Marine / ALS | sail-away approval |\n| M120 | Picked / Staged | `WH_DISPATCH` | Warehouse operator | pick/stage list |\n| M121 | Dispatched | `WH_DISPATCH` | WH/Site logistics | dispatch note |\n| M130 | Site Arrived | `SITE_RECEIVING` | Site logistics | delivery note / arrival record |\n| M131 | Site Inspected — Good | `SITE_RECEIVING` | QA/QC | MRI/MRR good result |\n| M132 | Site Inspected — OSD | `SITE_RECEIVING` | QA/QC | OSDR / defect evidence |\n| M140 | POD / GRN / Handover | `MATERIAL_ISSUE` | Site stores | POD / GRN |\n| M150 | Claim Opened | `CLOSEOUT` | Claims | claim file / OSDR/NCR |\n| M160 | Cost Closed | `CLOSEOUT` | Cost control | final invoice / cost closure |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#32",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "7.3 E2E 19-step Process Map",
    "text": "| Step | Process | Primary milestone(s) | Key objects | Risk / exception |\n|---:|---|---|---|---|\n| 1 | Project / Package / PO Release | demand event | Project, Package, PO | Missing package/PO chain |\n| 2 | Vendor Readiness | M10 | Vendor, MaterialMaster | readiness delay |\n| 3 | Packing / Marking / Labelling | M20 | CargoUnit, PL, CI | packing discrepancy |\n| 4 | Pickup / Origin Haulage | M30 | ShipmentUnit, JourneyLeg | truck no-show / damage |\n| 5 | Export Customs Clearance | M40 | Customs export record | export hold |\n| 6 | Terminal Receiving | M50 | PortCall, Terminal | terminal delay |\n| 7 | Vessel Loading / Departure | M60/M61 | Shipment, BL, Container | rollover / lashing issue |\n| 8 | Ocean / Transshipment | M70 | JourneyLeg | missed connection |\n| 9 | Arrival / Pre-arrival Review | M80 | PortCall, Document pack | missing docs |\n| 10 | Import BOE | M90/M91 | CustomsEntry, BOEDocument | customs hold / permit expiry |\n| 11 | DO / Gate-out | M92/M100 | ReleaseOrder, Delivery | DEM/DET exposure |\n| 12 | Inland Transport | JourneyLeg event | Delivery, Truck/SPMT | access restriction |\n| 13 | Warehouse Receiving | M110 | WarehouseTask, WHP | receipt mismatch |\n| 14 | Put-away / Storage / Preservation | M111 | WarehouseTask, StockSnapshot | wrong bin / preservation failure |\n| 15 | Picking / Staging / Dispatch | M120/M121 | WarehouseTask, Delivery | short pick / wrong material |\n| 16 | Offshore / Heavy-lift / OOG | M115/M116/M117 | MarineTask, MarineEvent | HSE stop / weather / lift failure |\n| 17 | Site Delivery / Inspection | M130/M131/M132 | SiteReceipt, InspectionEvent | OSD / damage / shortage |\n| 18 | POD / GRN / Handover | M140 | POD, GRN, SiteReceipt | missing acknowledgement |\n| 19 | Exception / Claim / Cost Closure | M150/M160 | Exception, Claim, Invoice | lingering claim/cost exposure |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#33",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "7.4 AGI/DAS Offshore Rule",
    "text": "```text\nIF ShipmentUnit.declaredDestination IN (\"AGI\", \"DAS\")\nAND ShipmentUnit.routingPattern IN (\"MOSB_DIRECT\", \"WH_MOSB\", \"MIXED\")\nAND M130.actualDt IS NOT NULL\nAND M115.actualDt IS NULL\nTHEN VIOLATION-2: Block site arrival closure and request MOSB evidence.\n```\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#34",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "8.1 Node Families",
    "text": "| Node family | Classes | Primary resolution keys |\n|---|---|---|\n| Master | Project, Package, PO, Vendor, MaterialMaster, HVDCCodeTag | projectCode, packageNo, poNo, vendorCode, materialCode, HVDC_CODE |\n| Transport | Shipment, ShipmentUnit, JourneyLeg, PortCall, Delivery | shipmentId, bookingNo, BL No., rotationNo, ETA/ATA |\n| Physical | CargoUnit, Container, EquipmentResource, VesselResource | cargoUnitId, containerNo, sealNo, equipId, vesselName |\n| Document | CI, PL, BL, BOE, DO, Permit, MRR, OSDR, POD, GRN | documentNo, docHash |\n| Event | MilestoneEvent, WarehouseEvent, MarineEvent, InspectionEvent, ServiceEvent | eventId, milestoneCode |\n| Exception | Delay, Damage, Shortage, Overage, NCR, Claim | exceptionId, claimRef, ncrRef, osdrNo |\n| Cost | Invoice, InvoiceLine, RateRef, CostTransaction, DEMDETClock | invoiceNo, invoiceLineNo, costCode, tariffRef |\n| Evidence | AuditRecord, CommunicationEvent, ApprovalAction, VerificationResult | threadId, emailId, approvalRef, proofId |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#35",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "8.2 Edge Grammar",
    "text": "```turtle",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#36",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Containment / hierarchy",
    "text": "hvdc:hasPackage, hvdc:coveredBy, hvdc:issuedTo, hvdc:supplies, hvdc:unitizedAs, hvdc:containsCargoUnit, hvdc:packedIn, hvdc:hasUnit",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#37",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Identity",
    "text": "hvdc:hasIdentifier, hvdc:resolvesTo, hvdc:sameAsCandidate, hvdc:hasNormalizedKey",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#38",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Movement",
    "text": "hvdc:hasJourneyLeg, hvdc:departsFrom, hvdc:arrivesAt, hvdc:deliveredTo, hvdc:storedAt, hvdc:stagedAt",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#39",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Evidence / provenance",
    "text": "hvdc:evidencedBy, hvdc:referencesDocument, hvdc:attachedTo, hvdc:provenanceOf, hvdc:validatedBy",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#40",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Status / event",
    "text": "hvdc:hasMilestone, hvdc:hasInspection, hvdc:hasWarehouseEvent, hvdc:hasMarineEvent, hvdc:triggeredBy",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#41",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Responsibility",
    "text": "hvdc:operatedBy, hvdc:approvedBy, hvdc:handledBy, hvdc:assignedTo, hvdc:issuedBy",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#42",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Compliance",
    "text": "hvdc:requiresPermit, hvdc:classifiedByHS, hvdc:conformsTo, hvdc:governedBy, hvdc:checkedBy",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#43",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Finance",
    "text": "hvdc:chargesFor, hvdc:mappedToCostCode, hvdc:linkedToInvoice, hvdc:usesRateRef, hvdc:accruesTo\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#44",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "ETA / ATA → Full Context",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nPREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>\n\nSELECT ?unit ?eta ?stage ?routing ?location ?boe ?do ?whp ?site ?risk ?invoice\nWHERE {\n  ?leg hvdc:estimatedATA ?eta .\n  FILTER(?eta > NOW() && ?eta < NOW() + \"P7D\"^^xsd:duration)\n  ?unit hvdc:hasJourneyLeg ?leg ;\n        hvdc:hasCurrentStage ?stage ;\n        hvdc:hasRoutingPattern ?routing ;\n        hvdc:hasCurrentLocation ?location .\n  OPTIONAL { ?unit hvdc:hasCustomsEntry ?ce . ?ce hvdc:boeRef ?boe . }\n  OPTIONAL { ?unit hvdc:hasReleaseOrder ?ro . ?ro hvdc:doRef ?do . }\n  OPTIONAL { ?unit hvdc:hasWarehouseHandlingProfile ?whp . }\n  OPTIONAL { ?unit hvdc:hasSiteReceipt ?site . }\n  OPTIONAL { ?unit hvdc:hasException ?risk . }\n  OPTIONAL { ?unit hvdc:hasCostItem ?invoice . }\n}\nORDER BY ?eta\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#45",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "Any-key → ShipmentUnit Twin",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?unit ?scheme ?value ?stage ?routing ?doc ?milestone ?cost ?exception\nWHERE {\n  ?id hvdc:identifierScheme ?scheme ;\n      hvdc:normalizedValue ?value ;\n      hvdc:resolvesTo ?resolved .\n  BIND(COALESCE(?resolved, ?id) AS ?seed)\n  ?seed (hvdc:belongsToShipmentUnit|^hvdc:hasDocument|^hvdc:packedIn|^hvdc:hasCustomsEntry|^hvdc:hasReleaseOrder)* ?unit .\n  ?unit a hvdc:ShipmentUnit ;\n        hvdc:hasCurrentStage ?stage ;\n        hvdc:hasRoutingPattern ?routing .\n  OPTIONAL { ?unit hvdc:hasDocument ?doc . }\n  OPTIONAL { ?unit hvdc:hasMilestone ?milestone . }\n  OPTIONAL { ?unit hvdc:hasCostItem ?cost . }\n  OPTIONAL { ?unit hvdc:hasException ?exception . }\n}\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#46",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "BOE No. → Release and Cost Trace",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?entry ?unit ?shipment ?boe ?do ?gateOut ?invoice ?deltaPct ?band\nWHERE {\n  ?entry a hvdc:CustomsEntry ; hvdc:boeRef ?boe .\n  ?unit hvdc:hasCustomsEntry ?entry .\n  OPTIONAL { ?unit hvdc:groupedIn ?shipment . }\n  OPTIONAL { ?unit hvdc:hasReleaseOrder ?ro . ?ro hvdc:doRef ?do . }\n  OPTIONAL { ?unit hvdc:hasMilestone ?m . ?m hvdc:milestoneCode \"M100\" ; hvdc:actualDt ?gateOut . }\n  OPTIONAL { ?unit hvdc:hasCostItem ?line . ?line hvdc:belongsToInvoice ?invoice ; hvdc:deltaPct ?deltaPct ; hvdc:costGuardBand ?band . }\n}\n```\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#47",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "9.1 Pipeline Pattern",
    "text": "```text\nRaw source\n  → Bronze: source schema, ingest timestamp, source owner, file hash\n  → Silver: normalized identifiers, dates, units, currencies, locations\n  → Gold: canonical object tables + link tables + evidence tables\n  → Ontology: Object Types, Link Types, Actions, Functions\n  → Validation: SHACL/SPARQL rules + RAG evidence + human-gate\n  → Apps: Logistics COP, KPI, COST-GUARD, Document Guardian, routing dashboard\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#48",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "9.2 Source-to-Ontology Mapping",
    "text": "| Source system / feed | Canonical objects | Link points |\n|---|---|---|\n| ERP / Procurement | Project, Package, PO, Vendor, MaterialMaster | Project→Package→PO→Vendor→Material |\n| Engineering tag register | HVDCCodeTag, MaterialMaster | Material↔HVDCCodeTag |\n| TMS / Forwarder | Shipment, ShipmentUnit, JourneyLeg, Delivery | Shipment→Unit→Leg |\n| Carrier / DCSA-style feed | Container, BL, MilestoneEvent | Container→CargoUnit, BL→Shipment |\n| OFCO / Port Ops | PortCall, ServiceEvent, TariffRef, InvoiceLine | PortCall↔Shipment, ServiceEvent→InvoiceLine |\n| ATLP / Customs / Broker | CustomsEntry, ReleaseOrder, PermitDocument | CustomsEntry→BOE, ReleaseOrder→DO |\n| WMS | WarehouseTask, WarehouseEvent, StockSnapshot, WarehouseHandlingProfile | ShipmentUnit→WarehouseTask→WHP |\n| Marine / MOSB | MarineTask, MarineEvent, VesselResource, EquipmentResource | ShipmentUnit→M115/M116/M117 |\n| Site systems | SiteReceipt, InspectionEvent, MRR, OSDR, POD, GRN | SiteReceipt→Documents |\n| LDG / OCR | Document, DocumentEntity, VerificationResult, AuditRecord | Document→ShipmentUnit / Transaction |\n| Invoice / Finance | Invoice, InvoiceLine, RateRef, CostGuardResult | InvoiceLine→ShipmentUnit / PortCall / Task |\n| Communication | CommunicationEvent, ApprovalAction, AuditRecord | Evidence link only |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#49",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "9.3 Foundry Implementation Notes",
    "text": "| Foundry layer | Implementation rule |\n|---|---|\n| Object Types | Create object types from Gold datasets only; raw records remain evidence/source lineage |\n| Link Types | Materialize edge tables for high-cardinality links; derive secondary links through Functions |\n| Actions | Use transaction-gated Actions for BOE, DO, WH In, MOSB, Site Arrival, Cost Closure |\n| Functions | Implement `resolveAnyKey`, `computeCurrentStage`, `computeRoutingPattern`, `costGuardDelta`, `validateAGIDASGate` |\n| Workshop / Quiver | Publish COP, search panel, shipment timeline, route risk, CostGuard views |\n| Automation | Trigger validation on ingest, action submit, milestone close, invoice audit, daily digest |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#50",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "9.4 Integration KPIs",
    "text": "| KPI | Target |\n|---|---:|\n| Object mapping coverage | ≥ 95.00% |\n| Link completeness | ≥ 95.00% |\n| Any-key search precision | ≥ 95.00% |\n| Milestone coverage | ≥ 90.00% |\n| Validation p95 latency | < 5.00s |\n| Audit trail completeness | 100.00% for blocked actions |\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#51",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.1 Validation Control Matrix",
    "text": "| Rule ID | Target | Logic | Severity |\n|---|---|---|---|\n| `V-IDENT-001` | `Identifier` | scheme/value/normalized/source required | BLOCK |\n| `V-SU-001` | `ShipmentUnit` | must have ≥1 Identifier, RoutingPattern, CurrentStage | BLOCK |\n| `V-FLOW-001` | `confirmedFlowCode` | subject must be `WarehouseHandlingProfile` | BLOCK |\n| `V-FLOW-002` | `WarehouseHandlingProfile` | confirmation requires M110 actual timestamp | BLOCK |\n| `V-ROUTE-001` | `ShipmentUnit` | RoutingPattern enum only | BLOCK |\n| `V-AGIDAS-001` | AGI/DAS unit | site date/M130 is accepted as delivered; missing M115/M116/M117 creates `MOSB_EVIDENCE_MISSING` backfill | WARN/AMBER |\n| `V-DOC-001` | CI/PL/BL/BOE/DO | cross-document key, qty, weight consistency | WARN/BLOCK |\n| `V-CUSTOMS-001` | `CustomsEntry` | BOE document must be linked but not collapsed | BLOCK |\n| `V-RELEASE-001` | `ReleaseOrder` | DO document must exist before M100 | BLOCK |\n| `V-SITE-001` | `SiteReceipt` | M130 must link to SiteCode and delivery evidence | BLOCK |\n| `V-COST-001` | `InvoiceLine` | EA × Rate = Amount ± 0.01 | BLOCK |\n| `V-COST-002` | `Invoice` | Σ lineAmount = invoiceTotal ± 2.00% | BLOCK |\n| `V-COST-003` | `CostGuardResult` | Δ% band assigned | BLOCK |\n| `V-EVID-001` | `Document` / communication | evidence cannot own transaction truth | BLOCK |\n| `V-COMM-DRAFT-001` | email draft output | draft-mode reply must auto-invoke or surface `sct_ontology`; `EmailActionCard` required | BLOCK |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#52",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.2 SHACL: ShipmentUnit Required Shape",
    "text": "```turtle\n@prefix sh:   <http://www.w3.org/ns/shacl#> .\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n\nhvdc:ShipmentUnitRequiredShape a sh:NodeShape ;\n  sh:targetClass hvdc:ShipmentUnit ;\n  sh:property [\n    sh:path hvdc:hasIdentifier ; sh:minCount 1 ;\n    sh:message \"ShipmentUnit must have at least one Identifier.\" ;\n  ] ;\n  sh:property [\n    sh:path hvdc:hasRoutingPattern ; sh:minCount 1 ;\n    sh:in (hvdc:PRE_ARRIVAL hvdc:DIRECT hvdc:WH_ONLY hvdc:MOSB_DIRECT hvdc:WH_MOSB hvdc:MIXED) ;\n    sh:message \"ShipmentUnit must have a valid ShipmentRoutingPattern.\" ;\n  ] ;\n  sh:property [\n    sh:path hvdc:hasCurrentStage ; sh:minCount 1 ;\n    sh:message \"ShipmentUnit must have a current JourneyStage.\" ;\n  ] .\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#53",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.3 SHACL: Warehouse Boundary Shape",
    "text": "```turtle\nhvdc:FlowCodeBoundaryShape a sh:NodeShape ;\n  sh:targetSubjectsOf hvdc:confirmedFlowCode ;\n  sh:sparql [\n    sh:message \"VIOLATION-1: confirmedFlowCode found outside WarehouseHandlingProfile — immediate block.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:confirmedFlowCode ?fc .\n        FILTER NOT EXISTS { $this a hvdc:WarehouseHandlingProfile }\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#54",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.4 SHACL: WHP Confirmation Requires M110",
    "text": "```turtle\nhvdc:WarehouseHandlingConfirmationShape a sh:NodeShape ;\n  sh:targetClass hvdc:WarehouseHandlingProfile ;\n  sh:sparql [\n    sh:message \"VIOLATION-1B: WarehouseHandlingProfile cannot be confirmed before M110 Warehouse Received.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:flowConfirmationStatus \"confirmed\" ;\n              hvdc:belongsToShipmentUnit ?unit .\n        FILTER NOT EXISTS {\n          ?unit hvdc:hasMilestone ?m110 .\n          ?m110 hvdc:milestoneCode \"M110\" ; hvdc:actualDt ?dt .\n        }\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#55",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.5 SHACL: AGI/DAS MOSB Milestone Shape",
    "text": "```turtle\nhvdc:AGIDASStagingShape a sh:NodeShape ;\n  sh:targetClass hvdc:ShipmentUnit ;\n  sh:sparql [\n    sh:message \"VIOLATION-2: AGI/DAS shipment has Site Arrived M130 while MOSB chain evidence is missing; accept M130 and create MOSB_EVIDENCE_MISSING backfill.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:declaredDestination ?dest ;\n              hvdc:hasRoutingPattern ?rp ;\n              hvdc:hasMilestone ?m130 .\n        FILTER(?dest IN (\"AGI\", \"DAS\"))\n        FILTER(?rp IN (hvdc:MOSB_DIRECT, hvdc:WH_MOSB, hvdc:MIXED))\n        ?m130 hvdc:milestoneCode \"M130\" ; hvdc:actualDt ?arrived .\n        FILTER NOT EXISTS {\n          $this hvdc:hasMilestone ?m115 .\n          ?m115 hvdc:milestoneCode \"M115\" ; hvdc:actualDt ?staged .\n        }\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#56",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.6 SHACL: Invoice Numeric Integrity",
    "text": "```turtle\nhvdc:InvoiceLineNumericShape a sh:NodeShape ;\n  sh:targetClass hvdc:InvoiceLine ;\n  sh:sparql [\n    sh:message \"COST-GUARD: InvoiceLine amount must equal qty * rate within 0.01.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:qty ?qty ; hvdc:rate ?rate ; hvdc:amount ?amount .\n        BIND(ABS((?qty * ?rate) - ?amount) AS ?delta)\n        FILTER(?delta > 0.01)\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#57",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.7 COST-GUARD Rule",
    "text": "```text\nDeltaPct = (DraftAmount - StandardAmount) / StandardAmount * 100.00\n\nBand:\n  <= 2.00%       PASS\n  2.01% - 5.00%  WARN\n  5.01% - 10.00% HIGH\n  > 10.00%       CRITICAL\n\nHuman-gate:\n  invoiceTotal > 100,000.00 AED OR band IN (HIGH, CRITICAL) → Finance approval required.\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#58",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.8 SPARQL: Legacy Term Detection",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?s ?p ?o\nWHERE {\n  ?s ?p ?o .\n  FILTER(CONTAINS(LCASE(STR(?p)), \"assignedflowcode\") ||\n         CONTAINS(LCASE(STR(?p)), \"extractedflowcode\") ||\n         CONTAINS(LCASE(STR(?p)), \"costbyflowcode\") ||\n         CONTAINS(LCASE(STR(?p)), \"haslogisticsflowcode\"))\n}\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#59",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.9 RAG / Latest Evidence Gate",
    "text": "| Trigger | Required evidence refresh |\n|---|---|\n| Regulation / authority notice changed | RAG check against latest approved SOP / authority source |\n| MOIAT/FANR/DCD/ADNOC permit mismatch | Compliance owner review |\n| Cost/rate table change | Contract/rate master re-ingest and audit proof |\n| Route exception for AGI/DAS | Marine + Site Logistics review |\n| Low OCR confidence | LDG re-extraction or human document validation |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#60",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "10.10 Human-gate Matrix",
    "text": "| Trigger | Approver |\n|---|---|\n| Invoice total > 100,000.00 AED | Finance Approver |\n| CostGuard `HIGH` / `CRITICAL` | Cost Control Lead |\n| AGI/DAS M130 without M115/M116/M117 | Marine Lead + Site Logistics backfill queue |\n| WHP override | Warehouse Manager |\n| Permit expired or missing | Compliance Lead |\n| OSD / NCR / damage / shortage | QA/QC + Claims |\n| Identifier confidence < 0.95 for operational action | Data Steward |\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#61",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "11.1 Compliance Object Model",
    "text": "| Object | Required properties | Links |\n|---|---|---|\n| `ComplianceRequirement` | `authority`, `requirementType`, `triggerCondition`, `effectiveDate`, `status` | appliesTo Material/Shipment/Site/Node |\n| `PermitDocument` | `permitNo`, `authority`, `permitType`, `issueDate`, `expiryDate` | evidences requirement |\n| `ComplianceCheck` | `checkId`, `ruleId`, `result`, `checkedAt`, `checkedBy` | validates ShipmentUnit / Document / Material |\n| `ApprovalAction` | `approvalRef`, `approverRole`, `approvedAt`, `decision` | authorizes Action |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#62",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "11.2 Incoterms 2020 Control",
    "text": "| Control | Logic |\n|---|---|\n| `IncotermPresence` | PO / Shipment must carry `incoterm` and delivery place |\n| `RiskTransferPoint` | JourneyLeg responsibility changes at incoterm-defined point |\n| `CostResponsibility` | InvoiceLine must map to buyer/seller responsibility according to term |\n| `DisputeEvidence` | Any cost dispute must attach contract term and route/service evidence |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#63",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "11.3 UAE Regulatory Controls",
    "text": "| Authority / topic | Ontology handling |\n|---|---|\n| MOIAT | `MaterialMaster.isRegulatedProduct`, `requiresMOIATCoC`, `certificateRef`, `certificateExpiryDate` |\n| FANR | `requiresFANRPermit`, `radiationSourceFlag`, `permitRef`, `permitExpiryDate` |\n| DCD / Dangerous Goods | `dgClass`, `UNNumber`, `storageSegregationClass`, `dangerousCargoWarehouseRequired` |\n| ADNOC / CICPA / Site Access | `AccessPermit`, `GatePass`, `SecurityApproval`, `LocationNode.governedBy` |\n| WCO / HS | `hsCode`, `classificationConfidence`, `customsRiskScore`, `CustomsEntry` linkage |\n| DCSA / carrier events | `BillOfLadingDocument`, `Container`, `MilestoneEvent`, `JourneyLeg` alignment |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#64",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "11.4 Compliance Blockers",
    "text": "```text\nIF regulated product AND missing valid MOIAT/FANR/DCD permit → block DO / GatePass / Site Issue.\nIF hsCode missing on InvoiceLine / MaterialMaster → block BOE draft.\nIF gatePass expired before gate-out → block M100.\nIF AGI/DAS site date exists and marine approval evidence is missing → accept M130, mark DELIVERED, and create AMBER/WARN MOSB_EVIDENCE_MISSING backfill; block only M117 marine approval if execution approval itself is requested.\n```\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#65",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "12.1 Policy Scope",
    "text": "This part intentionally appears near the end of the master document. Warehouse Flow Code is a **warehouse-handling classification**, not the master route language.\n\nAllowed owner:\n\n```text\nWarehouseHandlingProfile.confirmedFlowCode\n```\n\nDisallowed owners:\n\n```text\nShipment, ShipmentUnit, PortCall, CustomsEntry, Document, Invoice, InvoiceLine, MarineTask, OperationsKPI, CommunicationEvent\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#66",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "12.2 WarehouseHandlingProfile Class",
    "text": "```turtle\nhvdc:WarehouseHandlingProfile a owl:Class ;\n  rdfs:label \"Warehouse Handling Profile\" ;\n  rdfs:comment \"Warehouse-only profile created by M110 Warehouse Received / put-away evidence.\" .\n\nhvdc:confirmedFlowCode a owl:DatatypeProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range xsd:integer ;\n  rdfs:comment \"Warehouse-only handling classification. Not a route classifier.\" .\n\nhvdc:flowConfirmationStatus a owl:DatatypeProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range xsd:string .\n\nhvdc:wh_handling_cnt a owl:DatatypeProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range xsd:integer .\n\nhvdc:storageClass a owl:DatatypeProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range xsd:string .\n\nhvdc:flowEvidenceSource a owl:ObjectProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range hvdc:WarehouseEvent .\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#67",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "12.3 Confirmed Flow Code Values",
    "text": "| Code | Warehouse handling meaning | Minimum evidence | Notes |\n|---:|---|---|---|\n| 0 | `PRE_WH_OR_TENTATIVE` | No M110 WH In evidence and pre-arrival/expected status | Tentative until evidence arrives |\n| 1 | `WH_BYPASS_CONFIRMED` | No M110 WH In evidence and direct delivery/bypass evidence | Confirms no warehouse handling |\n| 2 | `SINGLE_WH_HANDLING` | Exactly 1 M110 WH In / put-away evidence | Standard warehouse handling |\n| 3 | `WH_LINKED_OFFSHORE_HANDLING` | Warehouse evidence plus MOSB staging evidence or AGI/DAS minimum offshore handling class | WH evidence with offshore interface |\n| 4 | `MULTI_WH_OFFSHORE_HANDLING` | At least 2 WH handling events plus MOSB staging evidence | Multi-WH + offshore interface |\n| 5 | `MIXED_OR_UNRESOLVED_WH_PATTERN` | Incomplete, conflicting, split, or pending warehouse evidence | Requires reason flag and review |\n\n> Numeric values are retained for warehouse operational compatibility only. They must never be interpreted as the master Port → WH → MOSB → Site route classifier. The master route classifier remains `ShipmentRoutingPattern`.",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#68",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "12.4 Legacy Migration Map",
    "text": "| Legacy phrase | Canonical replacement | Owner |\n|---|---|---|\n| `Flow Code 0 = Pre Arrival` | `ShipmentRoutingPattern.PRE_ARRIVAL` or pre-arrival milestone state | `ShipmentUnit` / `PortCall` |\n| `Flow Code 1 = Port → Site` | `ShipmentRoutingPattern.DIRECT` | `ShipmentUnit` |\n| `Flow Code 2 = Port → WH → Site` | `ShipmentRoutingPattern.WH_ONLY` | `ShipmentUnit` |\n| `Flow Code 3 = Port → MOSB → Site` | `ShipmentRoutingPattern.MOSB_DIRECT` | `ShipmentUnit` / Marine |\n| `Flow Code 4 = Port → WH → MOSB → Site` | `ShipmentRoutingPattern.WH_MOSB` | `ShipmentUnit` / Marine |\n| `Flow Code 5 = Mixed` | `ShipmentRoutingPattern.MIXED` | `ShipmentUnit` |\n| `assignedFlowCode` | `plannedRoutingPattern` | `PortCall` evidence |\n| `extractedFlowCode` | `routeEvidence` | `Document` evidence |\n| `costByFlowCode` | `costByRoutingPattern` / `routeBasedCostDriver` | Cost domain |\n| `Flow Code 3/4/5` in marine text | `MarineRoutingPattern` / `offshoreDeliveryPattern` | Marine extension |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#69",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "12.5 Warehouse Flow Validation Rules",
    "text": "1. `confirmedFlowCode` can appear only on `WarehouseHandlingProfile`.\n2. `flowConfirmationStatus = confirmed` requires M110 actual milestone.\n3. `confirmedFlowCode` shall not be used as a KPI bucket for end-to-end route analytics.\n4. Cost may read `WarehouseHandlingProfile.wh_handling_cnt` and `storageClass` as evidence, but cost cannot assign `confirmedFlowCode`.\n5. Port and OCR may supply route/WH evidence but cannot write `confirmedFlowCode`.\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#70",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "13.1 Implementation Options",
    "text": "| Option | Scope | Pros | Cons | CostIndex | Risk | Time |\n|---|---|---|---|---:|---:|---:|\n| A. Master Spine MVP | `ShipmentUnit`, Identifier, Document, Milestone, Cost baseline | Fast search/COP enablement | Limited marine/claims depth | 1.00/5.00 | 20.00% | 4.00 weeks |\n| B. Operational Twin | MVP + WHP + PortCall + CustomsEntry + SiteReceipt | Strong route and action validation | More integration work | 2.50/5.00 | 18.00% | 8.00 weeks |\n| C. Full Semantic Control Tower | Operational Twin + marine/OOG + CostGuard + compliance RAG | Full chain visibility and audit | Data quality dependency | 4.00/5.00 | 22.00% | 12.00 weeks |\n| D. Enterprise RDF Bridge | Foundry Ontology + RDF/SHACL/GraphDB bridge | Strong OWL/SHACL reasoning | Higher architecture complexity | 5.00/5.00 | 30.00% | 16.00 weeks |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#71",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "13.2 Roadmap",
    "text": "| Phase | Scope | KPI |\n|---|---|---|\n| Prepare | Source inventory, object/link dictionary, namespace lock | Semantic blocker count = 0.00 |\n| Pilot | One onshore + one AGI/DAS + one invoice end-to-end | Key Resolution ≥ 95.00%; Milestone Coverage ≥ 90.00% |\n| Build | Gold datasets + Ontology mapping + Actions | Object mapping ≥ 95.00%; Link completeness ≥ 95.00% |\n| Operate | SHACL/SPARQL validation + COP dashboard + CostGuard | Validation p95 < 5.00s; NumericIntegrity = 100.00% |\n| Scale | Marine/OOG, compliance RAG, predictive ETA/risk | Full-chain visibility ≥ 95.00%; ETA MAPE ≤ 12.00% |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#72",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "13.3 Automation Notes",
    "text": "| Automation | Trigger | Action |\n|---|---|---|\n| `AnyKeySearchBot` | User enters BL/BOE/Container/HVDC_CODE/Invoice | Resolve object and open ShipmentUnit twin |\n| `PreArrivalGuard` | M80 ATA / arrival notice | Validate CI/PL/BL/BOE/permit readiness |\n| `GateOutGuard` | M100 action attempt | Check DO, BOE cleared, gate pass validity |\n| `WHPInjector` | M110 WH Received | Create or update WarehouseHandlingProfile |\n| `AGIDASGuard` | M130 Site Arrived attempt | Accept AGI/DAS site date as M130 and backfill missing M115/M116/M117 evidence |\n| `CostGuardBot` | Invoice loaded | Compute Δ%, band, proof artifact |\n| `OSDRClaimBot` | M132 OSD event | Create OSDR/Claim draft and evidence pack |\n| `ComplianceRAG` | Missing/expired permit | Retrieve latest approved SOP/authority evidence |\n| `DailyCOPDigest` | Daily 08:00 Asia/Dubai | At-risk shipments, customs holds, DEM/DET, high-cost invoices |\n| `EmailDraftGuard` | User requests reply/draft | Invoke/surface `sct_ontology`, then emit `EmailActionCard` + draft; no KG action unless explicitly requested |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#73",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "13.4 QA Checklist",
    "text": "| Check | PASS criteria |\n|---|---|\n| Canonical authority | This file governs all extensions |\n| Data separation | Master/transaction/document/event/exception/cost/evidence separated |\n| Flow boundary | `confirmedFlowCode` only on `WarehouseHandlingProfile` |\n| Flow placement | Warehouse Flow Code policy located after validation/compliance, not in early dictionaries |\n| MOSB | `MOSB` typed as `OffshoreStaging`, not `Warehouse` |\n| Port compatibility | `plannedRoutingPattern`, `declaredDestination`, `offshoreTransitRequired` retained |\n| OCR compatibility | `routeEvidence`, `destinationEvidence`, `mosbLegIndicator` retained |\n| Cost compatibility | `routeBasedCostDriver`, `wh_handling_cnt`, CostGuard bands retained |\n| Marine compatibility | `MarineRoutingPattern`, M115/M116/M117 retained |\n| Ops compatibility | `hasRoutingPattern` and milestone analytics retained |\n| Communication compatibility | evidence-only connection retained |\n| Numeric integrity | line math ±0.01; invoice total ±2.00% |\n| Compliance | Incoterms/MOIAT/FANR/DCD/ADNOC controls modeled |\n| Validation | SHACL/SPARQL rules included for core blockers |",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#74",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "13.5 Assumptions",
    "text": "| Assumption | Reason | Risk |\n|---|---|---|\n| Gold datasets exist or will be built before Ontology mapping | Foundry object types should not map directly to raw data | Raw schema drift |\n| Project-specific MOIAT/FANR/DCD/ADNOC SOPs are externally governed | Current regulatory process may change | RAG/human review required |\n| Existing extension docs may still contain legacy prose | Master spine governs; extensions should be patched later | Mixed vocabulary if extensions are not migrated |\n| `HVDC_CODE` is a tag, not a sole identity key | Required for multi-key traceability | Duplicate/ambiguous tags |\n\n---",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-00-master-ontology#75",
    "docId": "CONSOLIDATED-00-master-ontology",
    "title": "hvdc-master-ontology · CONSOLIDATED-00",
    "version": "2.0-final",
    "sectionPath": "CmdRec {#cmdrec}",
    "text": "```text\n/switch_mode PRIME + /logi-master report --deep --KRsummary\n```\n\n```text\n/logi-master cert-chk --deep\n```\n\n```text\n/logi-master invoice-audit --AEDonly\n```",
    "docHash": "c0e3289c1007cec2a0f97d1e2e73bb3b2dd2115c95eb7000e8bd9c8c7d73b101",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#1",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Core Framework & Infrastructure Ontology — Consolidated\"\ntype: \"ontology-design\"\ndomain: \"framework-infrastructure\"\nsub-domains:\n  - logistics-framework\n  - node-infrastructure\n  - construction-logistics\n  - transport-network\n  - standards-alignment\n  - compliance-control\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\nextension_of: \"hvdc-master-ontology-v2.0-final\"\ncanonical_role: \"high-level standards, regulations, infrastructure nodes, and project framework extension\"\nowner: \"HVDC Logistics Ontology Working Set\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - GS1-EPCIS-CBV\n  - DCSA-Track-and-Trace\n  - UN-CEFACT-BSP-RDM\n  - WCO-DM-4.2.0\n  - ICC-Incoterms-2020\n  - UN-LOCODE-2025-1\n  - ISO-6346\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\n  - BIMCO-SUPPLYTIME-2017\nsource_files:\n  - 1_CORE-01-hvdc-core-framework.md\n  - 1_CORE-02-hvdc-infra-nodes.md\nchecked_against:\n  - CONSOLIDATED-00-master-ontology.md\n  - CONSOLIDATED-02-warehouse-flow.md\n  - CONSOLIDATED-03-document-ocr.md\n  - CONSOLIDATED-04-barge-bulk-cargo.md\n  - CONSOLIDATED-05-invoice-cost.md\n  - CONSOLIDATED-06-material-handling.md\n  - CONSOLIDATED-07-port-operations.md\n  - CONSOLIDATED-08-communication.md\n  - CONSOLIDATED-09-operations.md\n  - AGENTS.md\n  - HVDC Logistics Ontology Review.txt\nvalidation_passes: 5\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#2",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "1. ExecSummary",
    "text": "`CONSOLIDATED-01`은 HVDC Logistics KG의 **reference framework + infrastructure-node extension**이다. 본 문서는 `CONSOLIDATED-00` master spine을 재정의하지 않고, 표준·규정·노드·운영 제약을 `ShipmentUnit`, `JourneyLeg`, `MilestoneEvent`, `LocationNode`, `RegulatoryRequirement`에 연결하는 상위 참조 레이어로만 동작한다.\n\n비즈니스 임팩트는 **Port/Customs/WH/MOSB/Site 노드별 release blocker 조기 검출**, **DEM/DET·GatePass·Permit 지연 감소**, **Any-key 기반 프로젝트 물류 traceability**이다. 기술 해법은 RDF/OWL class boundary, SHACL gate, SPARQL node-risk query, Foundry Object/Link mapping을 결합한다.\n\nKPI 목표는 `NodeMasterCoverage ≥ 95.00%`, `PermitEvidenceCompleteness ≥ 98.00%`, `RoutingPatternValidation = 100.00%`, `Validation p95 < 5.00s`, `HumanGate leakage = 0.00건`이다.\n\n**ENG-KR one-liner:** Standards and infrastructure nodes are reference anchors; execution truth still flows through `RoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`.\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#3",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "2.1 Master Governance Rule",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.\n2. `CONSOLIDATED-01` provides high-level standards, regulations, infrastructure nodes, and framework constraints only.\n3. Program-wide shipment visibility uses `RoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`.\n4. Warehouse handling classification is owned only by `WarehouseHandlingProfile` in `CONSOLIDATED-02` and triggered by M110 WH Received.\n5. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`; it is not a top-level `Warehouse`.\n6. `CONSOLIDATED-08` is an evidence layer. It may attach `CommunicationEvent`, `ApprovalAction`, and `AuditRecord`; it does not redefine logistics execution classes.\n7. Extension-local legacy route-code language is migration debt and must not be promoted into this framework document.",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#4",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "2.2 Scope Matrix",
    "text": "| Scope item | Included in CONSOLIDATED-01 | Excluded / delegated |\n|---|---|---|\n| Standards alignment | UN/CEFACT, WCO, DCSA, ICC, UN/LOCODE, ISO, BIMCO, PROV-O, OWL-Time, SKOS, DQV | Detailed API payloads and carrier-specific integration |\n| Infrastructure nodes | Port, terminal, berth, gate, yard, warehouse, offshore staging, site, corridor | Site construction work-pack execution |\n| Compliance anchors | MOIAT, FANR, DCD/DG, ADNOC/CICPA/GatePass, Customs, Incoterms | Authority-specific operational truth unless evidenced by current SOP |\n| Route semantics | Node capability and allowed route constraints | End-to-end route state machine, which remains in `CONSOLIDATED-00` |\n| Warehouse handling | Boundary reference only | WH algorithm and storage classification, which remain in `CONSOLIDATED-02` |\n| Marine / OOG | Node capability and gate constraints | LCT, stability, rigging, lashing, which remain in `CONSOLIDATED-04` |\n| Cost | Standards and KPI anchors | Invoice line audit and CostGuard, which remain in `CONSOLIDATED-05` |\n| Operations analytics | KPI definitions and node risk views | DataFrame/Excel operation mapping, which remains in `CONSOLIDATED-09` |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#5",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "2.3 Corpus Compatibility Anchors",
    "text": "| Source | Required compatibility rule |\n|---|---|\n| `CONSOLIDATED-00` | Reuse `LocationNode`, `JourneyLeg`, `MilestoneEvent`, `RoutingPattern`, `RegulatoryRequirement`, `PermitDocument` |\n| `CONSOLIDATED-02` | Do not assign or calculate WH handling class in this file |\n| `CONSOLIDATED-03` | Treat document fields as evidence: `routeEvidence`, `destinationEvidence`, `mosbLegIndicator` |\n| `CONSOLIDATED-04` | Use `MarineRoutingPattern` and M115/M116/M117 for offshore execution |\n| `CONSOLIDATED-05` | Cost reads route and WH evidence; cost does not own WH handling classification |\n| `CONSOLIDATED-06` | Material handling uses `RoutingPattern + MilestoneStatus`; AGI/DAS requires MOSB evidence |\n| `CONSOLIDATED-07` | Port records `plannedRoutingPattern` and `declaredDestination` as evidence only |\n| `CONSOLIDATED-08` | Evidence only; no core node or route class redefinition |\n| `CONSOLIDATED-09` | Consume `hasRoutingPattern`, stock, milestone, and cost semantics; do not redefine them |\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#6",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "3.1 Reference Standards",
    "text": "| Standard / authority | Current framework role | Ontology binding | RAG status on 2026-04-27 |\n|---|---|---|---|\n| UN/CEFACT BSP-RDM | Buy-Ship-Pay semantic reference for party, shipment, consignment, transport means, invoice | `Party`, `Shipment`, `Consignment`, `Document`, `InvoiceLine` | Official UNECE RDM page retained as reference anchor |\n| WCO Data Model 4.2.0 | Customs declaration, bond, origin/certificate data alignment | `CustomsEntry`, `BOEDocument`, `HSCode`, `CertificateOfOrigin` | WCO announced v4.2.0 on 2025-07-15 |\n| DCSA Track & Trace | Container / shipment event visibility and operational event normalization | `Container`, `CarrierEvent`, `JourneyLeg`, `MilestoneEvent` | Use latest release per DCSA standard documentation; conformance references newer T&T release line |\n| ICC Incoterms 2020 | Cost/risk responsibility and delivery obligation | `IncotermTerm`, `RiskTransferPoint`, `CostResponsibility` | Incoterms 2020 remains the official ICC ruleset anchor |\n| UN/LOCODE 2025-1 | Port, terminal, city, and trade location code normalization | `LocationNode.unlocode`, `Port.unlocode` | UNECE lists 2025-1 as current published release in 2026 |\n| ISO 6346 | Container identification and equipment code | `Container.containerNo`, `Container.isoType` | Stable reference; local validation via check digit required |\n| GS1 EPCIS / CBV | Event-centric visibility pattern | `VisibilityEvent`, `MilestoneEvent`, `Disposition` | Use as event model anchor, not as full replacement |\n| PROV-O | Provenance and evidence lineage | `AuditRecord`, `Evidence`, `SourceSystem`, `wasDerivedFrom` | Required for document, communication, and RAG evidence |\n| OWL-Time | Time interval, instant, duration | `plannedDt`, `estimatedDt`, `actualDt`, `dwellDuration` | Required for milestone and dwell clocks |\n| SKOS | Controlled vocabularies and code lists | `RoutingPattern`, `JourneyStage`, `NodeType`, `PermitType` | Required for enum governance |\n| DQV | Data quality metadata | `ValidationResult`, `QualityMetric`, `ConfidenceScore` | Required for OCR/KPI trust |\n| BIMCO SUPPLYTIME 2017 | Offshore support vessel contract and knock-for-knock responsibility reference | `MarineContract`, `CharterTerm`, `LiabilityRegime` | Official BIMCO page identifies SUPPLYTIME 2017 as the latest edition |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#7",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "3.2 Standards-to-Domain Mapping",
    "text": "| Domain | Primary standard anchor | HVDC object layer | Mandatory validation |\n|---|---|---|---|\n| Procurement / PO | UN/CEFACT BSP-RDM | `PurchaseOrder`, `Package`, `Vendor`, `MaterialMaster` | PO/package/material link completeness |\n| Customs | WCO DM, HS nomenclature | `CustomsEntry`, `BOEDocument`, `HSCode`, `DutyLine` | HS, origin, value, quantity, permit evidence |\n| Shipping / carrier | DCSA T&T, ISO 6346 | `Shipment`, `Container`, `BillOfLadingDocument`, `MilestoneEvent` | BL/container/event key resolution |\n| Commercial terms | ICC Incoterms 2020 | `IncotermTerm`, `RiskTransferPoint`, `CostResponsibility` | Risk/cost owner matches PO and invoice |\n| Port / terminal | UN/LOCODE, DCSA event pattern | `Port`, `Terminal`, `PortCall`, `ServiceEvent` | PortCall→Shipment linkage and node code validity |\n| Warehouse | ISO 9001/14001 internal QMS + WH SOP | `Warehouse`, `WarehouseTask`, `WarehouseHandlingProfile` | WH task and storage class gate |\n| Offshore / marine | BIMCO SUPPLYTIME 2017 + project marine SOP | `OffshoreStagingNode`, `MarineEvent`, `Vessel`, `LCT` | PTW/FRA/weather/lashing/stability human gate |\n| Evidence / audit | PROV-O, DQV | `AuditRecord`, `CommunicationEvent`, `VerificationResult` | Provenance, confidence, hash, reviewer |\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#8",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "4.1 Core Classes",
    "text": "| Class | Type | Required properties | Purpose |\n|---|---|---|---|\n| `hvdc:FrameworkStandard` | Reference | `standardCode`, `version`, `authority`, `ragCheckedAt` | Standard registry |\n| `hvdc:RegulatoryRequirement` | Reference / compliance | `requirementCode`, `authority`, `scope`, `effectiveStatus` | Compliance condition |\n| `hvdc:PermitRequirement` | Compliance | `permitType`, `authority`, `trigger`, `evidenceRequired` | Permit gate |\n| `hvdc:IncotermTerm` | Contract reference | `termCode`, `riskTransferPoint`, `costResponsibility` | Contract risk/cost owner |\n| `hvdc:LocationNode` | Master / infrastructure | `nodeCode`, `nodeType`, `nodeName`, `countryCode`, `status` | Parent infrastructure node |\n| `hvdc:Port` | Infrastructure | `unlocode`, `portAuthority`, `cargoProfile` | Port-of-entry node |\n| `hvdc:Terminal` | Infrastructure | `terminalCode`, `terminalType`, `parentPort` | Berth/CY/CFS terminal node |\n| `hvdc:Warehouse` | Infrastructure | `warehouseCode`, `storageType`, `capacityProfile` | Warehouse node only |\n| `hvdc:OffshoreStagingNode` | Infrastructure | `nodeCode`, `marineInterfaceType`, `supportsLCT` | MOSB / marine interface |\n| `hvdc:Site` | Infrastructure | `siteCode`, `siteType`, `receivingCapability` | MIR/SHU/AGI/DAS receiving node |\n| `hvdc:TransportCorridor` | Infrastructure | `mode`, `fromNode`, `toNode`, `permitRequired` | Allowed movement corridor |\n| `hvdc:AccessPolicy` | Compliance | `policyCode`, `authority`, `locationScope` | GatePass/CICPA/ADNOC access |\n| `hvdc:CapacityProfile` | Ops reference | `capacityUnit`, `ratedCapacity`, `currentUtilization` | Node capacity monitoring |\n| `hvdc:ServiceCapability` | Ops reference | `capabilityType`, `cargoCategory`, `equipmentRequired` | Node capability match |\n| `hvdc:InfrastructureKPI` | KPI | `metricCode`, `targetValue`, `actualValue`, `unit` | Dashboard/KPI control |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#9",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "4.2 Object Properties",
    "text": "| Property | Domain → Range | Cardinality | Meaning |\n|---|---|---:|---|\n| `hvdc:nodePartOf` | `LocationNode → LocationNode` | N:1 | Terminal/yard/site subdivision hierarchy |\n| `hvdc:connectsTo` | `LocationNode → LocationNode` | N:N | Node adjacency for route graph |\n| `hvdc:servedByCorridor` | `LocationNode → TransportCorridor` | 1:N | Allowed movement path |\n| `hvdc:hasCapability` | `LocationNode → ServiceCapability` | 1:N | Cargo/service support |\n| `hvdc:hasCapacityProfile` | `LocationNode → CapacityProfile` | 1:N | Capacity and utilization |\n| `hvdc:governedBy` | `LocationNode → RegulatoryRequirement` | N:N | Jurisdictional / authority control |\n| `hvdc:requiresPermit` | `TransportCorridor → PermitRequirement` | 0:N | Permit gate |\n| `hvdc:hasAccessPolicy` | `LocationNode → AccessPolicy` | 0:N | GatePass/security control |\n| `hvdc:supportsRoutingPattern` | `LocationNode → skos:Concept` | 0:N | Allowed route pattern evidence |\n| `hvdc:servesJourneyStage` | `LocationNode → skos:Concept` | 0:N | Stage capability |\n| `hvdc:operatedBy` | `LocationNode → Party` | 0:N | Operational owner |\n| `hvdc:evidencedBy` | `RegulatoryRequirement → Document` | 0:N | Compliance proof |\n| `hvdc:triggersHumanGate` | `RegulatoryRequirement → ApprovalAction` | 0:N | Manual approval condition |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#10",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "4.3 Data Properties",
    "text": "| Property | Domain | Range | Constraint |\n|---|---|---|---|\n| `hvdc:nodeCode` | `LocationNode` | `xsd:string` | Required, unique within project |\n| `hvdc:nodeType` | `LocationNode` | enum | `PORT`, `TERMINAL`, `WAREHOUSE`, `OFFSHORE_STAGING`, `SITE`, `GATE`, `CORRIDOR` |\n| `hvdc:unlocode` | `Port` | `xsd:string` | Optional but required where official UN/LOCODE exists |\n| `hvdc:countryCode` | `LocationNode` | ISO 3166 string | UAE nodes use `AE` |\n| `hvdc:capacitySqm` | `CapacityProfile` | decimal | ≥ 0.00 |\n| `hvdc:capacityTeu` | `CapacityProfile` | decimal | ≥ 0.00 |\n| `hvdc:maxPayloadT` | `ServiceCapability` | decimal | ≥ 0.00 |\n| `hvdc:maxOogLengthM` | `ServiceCapability` | decimal | ≥ 0.00 |\n| `hvdc:gatePassRequired` | `AccessPolicy` | boolean | Required for controlled nodes |\n| `hvdc:permitLeadTimeDays` | `PermitRequirement` | decimal | RAG-checked; do not hardcode if unknown |\n| `hvdc:ragCheckedAt` | `FrameworkStandard` | `xsd:date` | ISO date required |\n| `hvdc:validationStatus` | any governed object | enum | `PASS`, `WARN`, `FAIL`, `PENDING_HUMAN` |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#11",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "4.4 Turtle Skeleton",
    "text": "```turtle\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n@prefix owl:  <http://www.w3.org/2002/07/owl#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n\nhvdc:LocationNode a owl:Class .\nhvdc:Port a owl:Class ; rdfs:subClassOf hvdc:LocationNode .\nhvdc:Terminal a owl:Class ; rdfs:subClassOf hvdc:LocationNode .\nhvdc:Warehouse a owl:Class ; rdfs:subClassOf hvdc:LocationNode .\nhvdc:OffshoreStagingNode a owl:Class ; rdfs:subClassOf hvdc:LocationNode .\nhvdc:Site a owl:Class ; rdfs:subClassOf hvdc:LocationNode .\nhvdc:TransportCorridor a owl:Class .\nhvdc:RegulatoryRequirement a owl:Class .\nhvdc:PermitRequirement a owl:Class ; rdfs:subClassOf hvdc:RegulatoryRequirement .\nhvdc:FrameworkStandard a owl:Class .\nhvdc:CapacityProfile a owl:Class .\nhvdc:ServiceCapability a owl:Class .\nhvdc:AccessPolicy a owl:Class .\n\nhvdc:nodeCode a owl:DatatypeProperty ;\n  rdfs:domain hvdc:LocationNode ;\n  rdfs:range xsd:string .\n\nhvdc:nodeType a owl:DatatypeProperty ;\n  rdfs:domain hvdc:LocationNode ;\n  rdfs:range xsd:string .\n\nhvdc:connectsTo a owl:ObjectProperty ;\n  rdfs:domain hvdc:LocationNode ;\n  rdfs:range hvdc:LocationNode .\n\nhvdc:governedBy a owl:ObjectProperty ;\n  rdfs:domain hvdc:LocationNode ;\n  rdfs:range hvdc:RegulatoryRequirement .\n\nhvdc:requiresPermit a owl:ObjectProperty ;\n  rdfs:domain hvdc:TransportCorridor ;\n  rdfs:range hvdc:PermitRequirement .\n```\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#12",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "5.1 Node Type Dictionary",
    "text": "| NodeType | Class | Description | Allowed journey stages |\n|---|---|---|---|\n| `PORT` | `Port` | Seaport or entry port | `PORT_ENTRY`, `TERMINAL_HANDLING`, `CUSTOMS_CLEARANCE` |\n| `TERMINAL` | `Terminal` | CY/CFS/berth/gate within a port | `TERMINAL_HANDLING`, `INLAND_HAULAGE` |\n| `WAREHOUSE` | `Warehouse` | Indoor/outdoor/dangerous/OOG storage facility | `WH_RECEIPT`, `WH_STORAGE`, `WH_DISPATCH` |\n| `OFFSHORE_STAGING` | `OffshoreStagingNode` | Marine interface / staging base for offshore movements | `MOSB_STAGING`, `OFFSHORE_TRANSIT` |\n| `SITE_ONSHORE` | `Site` | Onshore construction / receiving site | `SITE_RECEIVING`, `MATERIAL_ISSUE` |\n| `SITE_OFFSHORE` | `Site` | Offshore island/site receiving node | `SITE_RECEIVING`, `MATERIAL_ISSUE` |\n| `GATE` | `Gate` | Controlled access point | `INLAND_HAULAGE`, `SITE_RECEIVING` |\n| `CORRIDOR` | `TransportCorridor` | Route segment between nodes | All movement stages |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#13",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "5.2 Core Node Registry",
    "text": "| Node | Canonical class | Function | RoutingPattern support | Compliance gates |\n|---|---|---|---|---|\n| Khalifa Port | `Port` | Container import, terminal handling, carrier event source | `DIRECT`, `WH_ONLY`, `MOSB_DIRECT`, `WH_MOSB`, `MIXED` | Port access, customs, BL/DO, container release |\n| Zayed Port | `Port` | Breakbulk, OOG, heavy cargo, bulk handling | `DIRECT`, `MOSB_DIRECT`, `WH_MOSB`, `MIXED` | Port access, OOG method statement, customs, lifting plan |\n| Jebel Ali Port / Free Zone | `Port` | Free-zone and special supplier import cases | `DIRECT`, `WH_ONLY`, `WH_MOSB`, `MIXED` | Free-zone customs, re-clearance, BOE/DO |\n| Port Terminal / CY / CFS | `Terminal` | Gate-in/out, CY storage, terminal services | Evidence only | Terminal release and service event validation |\n| DSV Indoor / controlled WH | `Warehouse` | Controlled indoor storage | `WH_ONLY`, `WH_MOSB` | WMS receipt, preservation, stock accuracy |\n| DSV Yard / outdoor WH | `Warehouse` | Outdoor/yard storage | `WH_ONLY`, `WH_MOSB` | Capacity, preservation, HSE |\n| AAA / Al Markaz storage | `Warehouse` | Overflow or project storage | `WH_ONLY`, `WH_MOSB`, `MIXED` | Lease/contract, WH capacity, insurance |\n| MOSB | `OffshoreStagingNode` | Marine interface, consolidation, LCT/barge staging | `MOSB_DIRECT`, `WH_MOSB`, `MIXED` | ADNOC/ALS access, PTW/FRA, marine weather gate, M115 evidence |\n| MIR Site | `Site` / `SITE_ONSHORE` | Onshore receiving and laydown | `DIRECT`, `WH_ONLY`, `MIXED` | Site access, MRR/MRI/GRN, lifting/HSE if OOG |\n| SHU Site | `Site` / `SITE_ONSHORE` | Onshore receiving and installation support | `DIRECT`, `WH_ONLY`, `MIXED` | Site access, capacity, MRR/MRI/GRN |\n| DAS Island | `Site` / `SITE_OFFSHORE` | Offshore receiving | `MOSB_DIRECT`, `WH_MOSB`, `MIXED` | site date accepted; M115/M116/M117 backfill, LCT/barge, ADNOC HSE, site permit |\n| AGI Island | `Site` / `SITE_OFFSHORE` | Offshore receiving | `MOSB_DIRECT`, `WH_MOSB`, `MIXED` | site date accepted; M115/M116/M117 backfill, LCT/barge, ADNOC HSE, site permit |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#14",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "5.3 MOSB Boundary Rule",
    "text": "`MOSB` may have laydown, temporary holding, and staging functions, but the top-level class is `OffshoreStagingNode`, not `Warehouse`. If a physical sub-area inside MOSB is used for temporary storage, model it as `StorageCapability` or `LaydownArea` attached to `MOSB`; do not type MOSB as a `Warehouse`.\n\n```turtle\nhvdc:MOSB a hvdc:OffshoreStagingNode ;\n  hvdc:nodeCode \"MOSB\" ;\n  hvdc:nodeType \"OFFSHORE_STAGING\" ;\n  hvdc:servesJourneyStage hvdc:MOSB_STAGING ;\n  hvdc:servesJourneyStage hvdc:OFFSHORE_TRANSIT ;\n  hvdc:supportsRoutingPattern hvdc:MOSB_DIRECT ;\n  hvdc:supportsRoutingPattern hvdc:WH_MOSB .\n```",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#15",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "5.4 Transport Corridor Model",
    "text": "| Corridor | Mode | From → To | Permit / gate | Primary milestones |\n|---|---|---|---|---|\n| Port-to-WH | Truck / trailer / SPMT | Port/terminal → Warehouse | DO, gate pass, OOG permit if required | M92 → M100 → M110 |\n| Port-to-Site | Truck / trailer / SPMT | Port/terminal → MIR/SHU | DO, gate pass, site receiving plan | M92 → M100 → M130 |\n| Port-to-MOSB | Truck / trailer / SPMT | Port/terminal → MOSB | DO, access pass, marine staging plan | M92 → M100 → M115 |\n| WH-to-Site | Truck / trailer | Warehouse → MIR/SHU | WH dispatch, gate pass | M121 → M130 |\n| WH-to-MOSB | Truck / trailer / SPMT | Warehouse → MOSB | WH dispatch, access pass | M121 → M115 |\n| MOSB-to-AGI/DAS | LCT / barge / marine support | MOSB → AGI/DAS | PTW/FRA/weather/lashing/handover | M115 → M116 → M117 → M130 |\n| Inter-WH transfer | Truck | Warehouse → Warehouse | transfer order | M111/M121 as applicable |\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#16",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "6.1 RoutingPattern Compatibility",
    "text": "| RoutingPattern | Required node sequence | Node constraints | Notes |\n|---|---|---|---|\n| `PRE_ARRIVAL` | Origin / vessel / pre-entry | No UAE infrastructure milestone yet | No WH handling classification |\n| `DIRECT` | Port → Site | Site must be MIR/SHU unless explicitly approved | No MOSB requirement |\n| `WH_ONLY` | Port → Warehouse → Site | Warehouse milestone M110 required | No offshore leg |\n| `MOSB_DIRECT` | Port → MOSB → Site | MOSB M115/M116/M117 evidence expected; backfill if site date already exists | Mandatory for AGI/DAS direct offshore route |\n| `WH_MOSB` | Port → Warehouse → MOSB → Site | M110 and M115 required | Used for storage + offshore staging |\n| `MIXED` | Incomplete, exception, multi-hop, unresolved | Requires exception review | Must not become a permanent normal state |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#17",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "6.2 AGI/DAS Offshore Gate",
    "text": "AGI/DAS shipments should carry an offshore-compatible `RoutingPattern`. If a site date or M130 `Site Arrived` exists, it is accepted as SiteReceipt/M130 evidence even when M115/M116/M117 is missing; the missing MOSB chain becomes `MOSB_EVIDENCE_MISSING` AMBER/WARN backfill. This file defines the infrastructure evidence gap; `CONSOLIDATED-00` owns the canonical validation shape and `CONSOLIDATED-04/06` implement marine/material details.\n\n```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?unit ?dest ?pattern\nWHERE {\n  ?unit hvdc:declaredDestination ?dest ;\n        hvdc:hasRoutingPattern ?pattern .\n  FILTER(?dest IN (\"AGI\", \"DAS\"))\n  FILTER(?pattern NOT IN (\"MOSB_DIRECT\", \"WH_MOSB\", \"MIXED\"))\n}\n```",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#18",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "6.3 No Universal MOSB Assumption",
    "text": "Do not assert that all cargo must pass through MOSB. Correct logic:\n\n- MIR/SHU onshore cargo may be `DIRECT` or `WH_ONLY`.\n- AGI/DAS offshore cargo requires MOSB-inclusive routing or an explicit exception gate.\n- Bulk/OOG cargo often uses MOSB, but the requirement is route- and destination-dependent.\n- Port and OCR sources provide evidence, not final route ownership.\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#19",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "7.1 Foundry Object Type Mapping",
    "text": "| Foundry Object Type | Source dataset | Key properties | Link Types |\n|---|---|---|---|\n| `FrameworkStandard` | standards registry / RAG table | `standardCode`, `version`, `authority`, `ragCheckedAt` | appliesTo → ObjectType |\n| `RegulatoryRequirement` | compliance master | `authority`, `requirementCode`, `scope`, `trigger` | governs → LocationNode / CargoCategory |\n| `PermitRequirement` | permit matrix | `permitType`, `authority`, `leadTimeDays`, `evidenceRequired` | requiredFor → JourneyLeg / LocationNode |\n| `LocationNode` | node master | `nodeCode`, `nodeType`, `nodeName`, `countryCode` | connectsTo → LocationNode |\n| `Port` | port/terminal master | `unlocode`, `portAuthority`, `cargoProfile` | hasTerminal → Terminal |\n| `Warehouse` | WMS/location master | `warehouseCode`, `storageType`, `capacity` | supports → WarehouseTask |\n| `OffshoreStagingNode` | marine/MOSB master | `supportsLCT`, `marineInterfaceType` | stagesFor → Site |\n| `Site` | site master | `siteCode`, `siteType`, `receivingCapability` | receives → ShipmentUnit |\n| `TransportCorridor` | route matrix | `mode`, `fromNode`, `toNode`, `permitRequired` | usedBy → JourneyLeg |\n| `AccessPolicy` | gate/security SOP | `policyCode`, `issuer`, `locationScope` | controls → LocationNode |\n| `CapacityProfile` | WMS/yard/site capacity | `capacityUnit`, `ratedCapacity`, `currentUtilization` | belongsTo → LocationNode |\n| `InfrastructureKPI` | dashboard / KPI dataset | `metricCode`, `targetValue`, `actualValue` | measures → LocationNode |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#20",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "7.2 Dataset Integration Points",
    "text": "| Source system | Dataset | Ontology output | Validation |\n|---|---|---|---|\n| ERP / PMO | `project_po_package_material` | Project, Package, PO, Material, Vendor | PO-package-material completeness |\n| Port / OFCO | `portcall_service_tariff` | Port, Terminal, PortCall, ServiceEvent | PortCall↔Shipment link |\n| Carrier / forwarder | `carrier_container_events` | Container, CarrierEvent, JourneyLeg | DCSA-style event sequence |\n| Customs / ATLP / broker | `customs_boe_permit_release` | CustomsEntry, PermitDocument, ReleaseOrder | WCO field and permit evidence |\n| WMS | `warehouse_location_capacity_task` | Warehouse, CapacityProfile, WarehouseTask | WH capacity and stock integrity |\n| Marine / MOSB | `mosb_lct_barge_events` | OffshoreStagingNode, MarineEvent, Corridor | M115/M116/M117 sequence |\n| Site receiving | `site_mrr_grn_osdr` | Site, SiteReceipt, InspectionEvent | M130/M140 evidence |\n| LDG / OCR | `doc_entity_evidence` | Document, Evidence, VerificationResult | OCR confidence and cross-doc checks |\n| Invoice / Cost | `invoice_line_rate_ref` | Invoice, InvoiceLine, RateRef, CostGuardResult | Δ% and numeric integrity |\n| Communication | `email_chat_approval_evidence` | CommunicationEvent, ApprovalAction, AuditRecord | Evidence-only linking |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#21",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "7.3 Foundry Action Types",
    "text": "| Action | Target | Inputs | Guard |\n|---|---|---|---|\n| `RegisterLocationNode` | LocationNode | node code, type, owner, capabilities | node code uniqueness |\n| `UpdateCapacityProfile` | CapacityProfile | node, capacity, current utilization | utilization ≤ threshold or WARN |\n| `AttachPermitRequirement` | PermitRequirement | authority, trigger, required evidence | current SOP/RAG source required |\n| `ApproveAccessPolicy` | AccessPolicy | location, role, validity, approver | expiry date and approver required |\n| `ValidateNodeForRouting` | ShipmentUnit / JourneyLeg | origin, destination, routing pattern | AGI/DAS + MOSB gate |\n| `OpenInfrastructureException` | Exception | node, blocker, evidence, owner | human-gate for high-risk blockers |\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#22",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "8.1 SHACL Constraints",
    "text": "```turtle\n@prefix sh:   <http://www.w3.org/ns/shacl#> .\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n\nhvdc:LocationNodeShape a sh:NodeShape ;\n  sh:targetClass hvdc:LocationNode ;\n  sh:property [\n    sh:path hvdc:nodeCode ;\n    sh:minCount 1 ;\n    sh:datatype xsd:string ;\n    sh:message \"LocationNode requires nodeCode.\" ;\n  ] ;\n  sh:property [\n    sh:path hvdc:nodeType ;\n    sh:minCount 1 ;\n    sh:in (\"PORT\" \"TERMINAL\" \"WAREHOUSE\" \"OFFSHORE_STAGING\" \"SITE_ONSHORE\" \"SITE_OFFSHORE\" \"GATE\" \"CORRIDOR\") ;\n    sh:message \"LocationNode nodeType must use controlled vocabulary.\" ;\n  ] .\n\nhvdc:MOSBNotWarehouseShape a sh:NodeShape ;\n  sh:targetNode hvdc:MOSB ;\n  sh:sparql [\n    sh:message \"MOSB must be OffshoreStagingNode, not Warehouse.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE { $this a hvdc:Warehouse . }\n    \"\"\" ;\n  ] .\n\nhvdc:PermitRequirementShape a sh:NodeShape ;\n  sh:targetClass hvdc:PermitRequirement ;\n  sh:property [ sh:path hvdc:authority ; sh:minCount 1 ; sh:datatype xsd:string ] ;\n  sh:property [ sh:path hvdc:evidenceRequired ; sh:minCount 1 ; sh:datatype xsd:boolean ] .\n\nhvdc:CapacityProfileShape a sh:NodeShape ;\n  sh:targetClass hvdc:CapacityProfile ;\n  sh:property [\n    sh:path hvdc:currentUtilizationPct ;\n    sh:datatype xsd:decimal ;\n    sh:minInclusive 0.00 ;\n    sh:maxInclusive 100.00 ;\n  ] .\n```",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#23",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "Node without governance",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?node ?type\nWHERE {\n  ?node a hvdc:LocationNode ; hvdc:nodeType ?type .\n  FILTER NOT EXISTS { ?node hvdc:governedBy ?req . }\n}\n```",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#24",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "AGI/DAS M130 with missing MOSB stage evidence",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?unit ?dest ?m130\nWHERE {\n  ?unit hvdc:declaredDestination ?dest ;\n        hvdc:hasMilestone ?m130 .\n  ?m130 hvdc:milestoneCode \"M130\" ; hvdc:actualDt ?actual .\n  FILTER(?dest IN (\"AGI\", \"DAS\"))\n  FILTER NOT EXISTS {\n    ?unit hvdc:hasMilestone ?m115 .\n    ?m115 hvdc:milestoneCode \"M115\" ; hvdc:actualDt ?m115Actual .\n  }\n}\n```",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#25",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "Capacity warning",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?node ?util\nWHERE {\n  ?node hvdc:hasCapacityProfile ?cap .\n  ?cap hvdc:currentUtilizationPct ?util .\n  FILTER(?util > 85.00)\n}\n```",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#26",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "8.3 RAG Checks",
    "text": "| RAG check | Trigger | Required evidence | Human-gate |\n|---|---|---|---|\n| Standards version | Quarterly or schema release | Official authority source and `ragCheckedAt` | Ontology owner |\n| MOIAT product conformity | Regulated product / certificate missing | MOIAT certificate or exemption evidence | Compliance |\n| FANR / radiation-source control | Nuclear/radiation-related material | FANR licence/permit evidence or project legal note | Compliance + HSE |\n| DCD / DG | Dangerous goods | DG declaration, segregation evidence, HSE approval | HSE |\n| ADNOC / CICPA access | Controlled port/site/MOSB access | GatePass/access approval | Site logistics |\n| OOG / heavy corridor | OOG / abnormal load | route survey, method statement, permit | Heavy-lift engineer |\n| Weather / marine | MOSB-to-AGI/DAS movement | weather window, FRA, PTW, marine approval | Marine coordinator |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#27",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "8.4 Human-gate Thresholds",
    "text": "| Gate | Trigger | Required role |\n|---|---|---|\n| High-value cost | Invoice or claim > 100,000.00 AED | Finance approver |\n| Capacity overload | WH/MOSB/Site utilization > 85.00% | Logistics manager |\n| Permit uncertainty | missing or expired authority evidence | Compliance owner |\n| AGI/DAS MOSB evidence gap | M130/site date exists without M115/M116/M117 | Marine + Site logistics backfill |\n| OOG method statement missing | OOG cargo enters corridor without approved MS | Heavy-lift engineer |\n| Dangerous goods mismatch | DG class, UN number, or segregation missing | HSE |\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#28",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "9.1 Compliance Object Model",
    "text": "| Compliance area | Object | Evidence | Blocking rule |\n|---|---|---|---|\n| Incoterms 2020 | `IncotermTerm` | PO/contract term | cost/risk owner must match PO and invoice |\n| Customs / WCO | `CustomsEntry`, `BOEDocument` | BOE, HS, origin, value | BOE draft blocked if mandatory fields missing |\n| MOIAT | `ConformityCertificateRequirement` | UAE CoC / ECAS/EQM-style evidence or exemption | DO/GatePass blocked for regulated products without certificate evidence |\n| FANR | `RadiationPermitRequirement` | licence/permit evidence | BOE or movement blocked until compliance owner approves |\n| DCD / DG | `DangerousGoodsRequirement` | DG declaration, SDS, segregation plan | WH/storage/transport blocked if DG data incomplete |\n| ADNOC / CICPA / site access | `AccessPolicy`, `GatePass` | gate pass/access approval | gate entry blocked if expired or missing |\n| BIMCO / Marine contract | `MarineContract`, `CharterTerm` | SUPPLYTIME or project marine contract clause | marine work order requires liability/insurance check |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#29",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "9.2 Incoterms Control",
    "text": "Incoterms are not route classifiers. They determine delivery obligation, cost responsibility, and risk transfer. Store them on PO/Shipment contract context and use them to validate invoice and release ownership.\n\n```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?shipment ?term ?invoiceOwner ?expectedOwner\nWHERE {\n  ?shipment hvdc:hasIncoterm ?term ; hvdc:hasInvoice ?invoice .\n  ?term hvdc:localCostOwner ?expectedOwner .\n  ?invoice hvdc:chargedTo ?invoiceOwner .\n  FILTER(?invoiceOwner != ?expectedOwner)\n}\n```",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#30",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "9.3 Permit Control",
    "text": "Permit validation is event-gated:\n\n| Event | Permit / evidence precondition |\n|---|---|\n| M50 Terminal Received | BL/manifest and port record exist |\n| M90 BOE Submitted | CI/PL/BL, HS, origin, value, permits if applicable |\n| M92 DO Released | BOE cleared, DO evidence, regulated-product certificates if applicable |\n| M100 Gate-out | DO + gate pass + transporter details |\n| M110 WH Received | WMS receiving task and preservation requirement |\n| M115 MOSB Staged | access approval, marine plan, staging evidence |\n| M116 LCT Loaded | PTW/FRA, lashing/stability approval, weather window |\n| M130 Site Arrived | receiving plan, site access, offshore prerequisite if applicable |\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#31",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "10. Options ≥3",
    "text": "| Option | Description | Pros | Cons | CostIndex | Risk | Time |\n|---|---|---|---|---:|---:|---:|\n| A. Reference-first | Standards + node registry only | fast, low disruption, strong external alignment | weaker operational automation | 1.00/5.00 | 20.00% | 4.00 weeks |\n| B. Hybrid framework | Standards + nodes + SHACL + Foundry actions | best balance, deployable gates, direct COP integration | requires curated node master | 2.50/5.00 | 18.00% | 8.00 weeks |\n| C. Ops Twin | Hybrid + live capacity + gate-pass + permit clocks | strongest operational value, supports exception management | needs source-system integration | 4.00/5.00 | 24.00% | 12.00 weeks |\n| D. Enterprise RDF Bridge | Full RDF/OWL + external graph + Foundry bridge | strongest reasoning and SHACL governance | architecture and maintenance complexity | 5.00/5.00 | 30.00% | 16.00 weeks |\n\nRecommended path: **Option B** for controlled rollout, then Option C for live operations.\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#32",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "11. Roadmap — Prepare → Pilot → Build → Operate → Scale",
    "text": "| Phase | Scope | KPI |\n|---|---|---|\n| Prepare | Confirm standards registry, node dictionary, authority matrix | NodeMasterCoverage ≥ 90.00% |\n| Pilot | 1.00 onshore route + 1.00 offshore route + 1.00 OOG case | RoutingPatternValidation = 100.00% |\n| Build | Foundry Object/Link mapping, SHACL gates, SPARQL audit panels | Link completeness ≥ 95.00% |\n| Operate | Daily infra blocker review, permit expiry monitor, capacity warning | Validation p95 < 5.00s |\n| Scale | Extend to all nodes, marine/OOG, cost, RAG compliance | PermitEvidenceCompleteness ≥ 98.00% |\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#33",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "12. Automation Notes — RPA / LLM / Sheets / TG Hooks",
    "text": "| Automation | Trigger | Output |\n|---|---|---|\n| `NodeMasterGuard` | new or modified LocationNode | node code, type, governance, capability validation |\n| `PermitExpiryBot` | permit expiry within threshold | compliance review list |\n| `RouteNodeFitGuard` | route planning / JourneyLeg creation | allowed route and node capability check |\n| `AGIDASGateBot` | AGI/DAS route or M130 event | SiteReceipt acceptance plus MOSB evidence backfill check |\n| `CapacityGuard` | WH/MOSB/Site utilization update | WARN at > 85.00%, HIGH at > 95.00% |\n| `CertChkRAG` | regulated product or uncertain authority rule | latest authority evidence retrieval request |\n| `GatePassGuard` | gate-out / site entry / MOSB staging | access policy and validity check |\n| `WeatherTieMarineGuard` | M116/M117 marine movement | weather/FRA/PTW checklist |\n| `DailyInfraDigest` | 08:00 Asia/Dubai daily | node blocker, permit, capacity, route exception summary |\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#34",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "13.1 QA Checklist",
    "text": "| Check | PASS 기준 |\n|---|---|\n| Master spine alignment | `CONSOLIDATED-00` vocabulary reused, not redefined |\n| Flow boundary | Warehouse handling class not used as route/cost/document/marine classifier |\n| MOSB classification | MOSB typed as `OffshoreStagingNode`, not `Warehouse` |\n| Universal MOSB claim | Removed; MOSB is conditional by destination/routing/cargo |\n| Evidence ownership | Port/OCR/Cost/Communication provide evidence only |\n| Node registry | Port/WH/MOSB/Site/Terminal/Gate/Corridor separated |\n| Compliance | Incoterms, Customs, MOIAT, FANR, DCD/DG, ADNOC/CICPA, BIMCO anchors present |\n| SHACL | LocationNode, MOSB, Permit, Capacity shapes present |\n| SPARQL | governance, AGI/DAS, capacity queries present |\n| PII | No phone/e-mail contact registry embedded |\n| KPI format | Operational numbers use two-decimal format where applicable |",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#35",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "13.2 Assumptions",
    "text": "- `CONSOLIDATED-00` remains the semantic authority for core classes and milestones.\n- Current operational facts such as site gate rules, permit lead time, authority forms, and ADNOC/CICPA details must be RAG-checked against current project SOP before automated release.\n- FANR-related permit validity and processing timelines are not hardcoded here because authority-specific service evidence must be confirmed for the actual cargo and licence context.\n- `FMC_OrgChart_Data.json` is not embedded in this document. Names, phone numbers, and e-mail addresses remain PII and require masking before register write.\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#36",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "14. RAG Source Anchors",
    "text": "| Anchor | Official source URL | Use in this document |\n|---|---|---|\n| UN/CEFACT RDM | https://unece.org/trade/uncefact/rdm | BSP-RDM semantic alignment |\n| WCO Data Model v4.2.0 | https://www.wcoomd.org/en/media/newsroom/2025/july/world-customs-organization-releases-data-mode.aspx | Customs data model version anchor |\n| WCO Data Model app | https://datamodel.wcoomd.org/ | WCO DM access and package verification |\n| DCSA Track & Trace | https://dcsa.org/standards/track-and-trace | Container visibility/event alignment |\n| DCSA Track & Trace documentation | https://dcsa.org/standards/track-and-trace/standard-documentation-track-and-trace | Latest-release adoption gate |\n| ICC Incoterms 2020 | https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/ | Incoterm rule anchor |\n| MOIAT regulated product CoC | https://moiat.gov.ae/en/services/issue-conformity-certificates-for-regulated-products | UAE conformity evidence anchor |\n| UN/LOCODE | https://unece.org/trade/uncefact/unlocode | Location code release anchor |\n| BIMCO SUPPLYTIME 2017 | https://www.bimco.org/contractual-affairs/bimco-contracts/contracts/supplytime-2017/ | Offshore support vessel contract anchor |\n| UAE nuclear legal baseline | https://uaelegislation.gov.ae/en/legislations/1123/download | FANR-controlled activity legal baseline |\n\n---",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-01-core-framework-infra#37",
    "docId": "CONSOLIDATED-01-core-framework-infra",
    "title": "hvdc-core-framework-infra · CONSOLIDATED-01",
    "version": "2.0-final",
    "sectionPath": "15. CmdRec",
    "text": "```text\n/switch_mode PRIME + /logi-master cert-chk --deep --KRsummary\n```\n\n```text\n/logi-master report --deep --KRsummary\n```\n\n```text\n/logi-master hs-risk --deep --AEDonly\n```",
    "docHash": "ade8f40868657b6a89b41e62db98428c2528a2f2d5a8dd7c26a8a0cb54a49dfe",
    "domains": [
      "compliance"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#1",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Warehouse Operations & WarehouseHandlingProfile Ontology — Consolidated\"\ntype: \"ontology-design\"\ndomain: \"warehouse-operations\"\nsub-domains:\n  - warehouse-management\n  - warehouse-handling-profile\n  - inventory-tracking\n  - storage-classification\n  - stock-control\n  - preservation-control\n  - dangerous-goods-control\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\nextension_of: \"hvdc-master-ontology-v2.0-final\"\ncanonical_role: \"warehouse operations and WarehouseHandlingProfile algorithm extension\"\nowner: \"HVDC Logistics Ontology Working Set\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\n  - ISO-9001\n  - ISO-14001\n  - IMDG-Code\n  - IATA-DGR\nsource_files:\n  - 1_CORE-03-hvdc-warehouse-ops.md\n  - 1_CORE-08-flow-code.md\n  - FLOW_CODE_V35_ALGORITHM.md\nchecked_against:\n  - CONSOLIDATED-00-master-ontology.md\n  - CONSOLIDATED-01-core-framework-infra.md\n  - CONSOLIDATED-03-document-ocr.md\n  - CONSOLIDATED-04-barge-bulk-cargo.md\n  - CONSOLIDATED-05-invoice-cost.md\n  - CONSOLIDATED-06-material-handling.md\n  - CONSOLIDATED-07-port-operations.md\n  - CONSOLIDATED-08-communication.md\n  - CONSOLIDATED-09-operations.md\n  - AGENTS.md\n  - HVDC Logistics Ontology Review.txt\nvalidation_passes: 5\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#2",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "1. ExecSummary",
    "text": "`CONSOLIDATED-02`는 HVDC Logistics KG의 **warehouse operations + WarehouseHandlingProfile(WHP) extension**이다. 이 문서는 창고 입고, 검수, put-away, 보관, preservation, picking, staging, dispatch, 재고 스냅샷, 위험물/특수화물 보관 제약을 정의한다.\n\n비즈니스 임팩트는 **재고 위치 정확도 향상**, **창고 용량/보관조건 위반 조기 차단**, **OOG/DG/항온항습 자재 손상 리스크 감소**, **M110~M121 창고 구간의 감사 가능한 operational twin 생성**이다.\n\n기술 해법은 `WarehouseHandlingProfile`을 M110 WH Received에서 생성하고, M111 Put-away 이후에 `confirmedFlowCode`를 warehouse-only storage/handling class로 확정하는 것이다. 전체 route visibility는 `RoutingPattern`, `JourneyStage`, `JourneyLeg`, `MilestoneEvent`가 담당한다.\n\nKPI 목표는 `WHP Coverage ≥ 98.00%`, `Stock Accuracy ≥ 99.00%`, `Capacity Band = 75.00–85.00%`, `NumericIntegrity = 100.00%`, `Validation p95 < 5.00s`이다.\n\n**ENG-KR one-liner:** Route stays in `RoutingPattern`; warehouse handling stays in `WarehouseHandlingProfile.confirmedFlowCode`.\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#3",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "2.1 Master Governance Rule",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.\n2. `CONSOLIDATED-02` owns **warehouse operations** and **`WarehouseHandlingProfile` algorithm** only.\n3. `confirmedFlowCode` is a warehouse-only storage/handling classification and may exist only on `WarehouseHandlingProfile`.\n4. Program-wide shipment visibility uses `RoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`.\n5. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`; it is not modeled as a top-level `Warehouse` in this document.\n6. Port, customs, OCR, cost, marine, operations, and communication domains may provide evidence to warehouse decisions, but they do not own or assign `confirmedFlowCode`.\n7. Legacy route-code language is migration debt. This document uses it only in explicit deprecation context.",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#4",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "2.2 Included vs Delegated Scope",
    "text": "| Scope item | Included in CONSOLIDATED-02 | Delegated / excluded |\n|---|---|---|\n| Warehouse receiving | M110 WH Received, appointment, unloading, visual check | Port/customs release logic in `CONSOLIDATED-07` / `CONSOLIDATED-06` |\n| Put-away and storage | M111 put-away, bin/zone assignment, storage class, preservation | Site receiving after dispatch in `CONSOLIDATED-06` |\n| WH dispatch | M120 Picked/Staged, M121 WH Dispatched | Marine LCT/barge execution in `CONSOLIDATED-04` |\n| Inventory | `StockSnapshot`, `InventoryBalance`, stock status, cycle count | Cost audit in `CONSOLIDATED-05` |\n| WHP algorithm | `confirmedFlowCode`, `flowConfirmationStatus`, `wh_handling_cnt` | Route classification in `CONSOLIDATED-00` |\n| DG/OOG storage gate | DG segregation, OOG/abnormal handling, HSE gate | Engineering final lift/stability approval in `CONSOLIDATED-04` |\n| Evidence ingestion | OCR/WMS/ERP/Port evidence references | Document extraction logic in `CONSOLIDATED-03` |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#5",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "2.3 Domain Boundary Crosswalk",
    "text": "| Domain | Allowed interface with warehouse | Not allowed in CONSOLIDATED-02 |\n|---|---|---|\n| Core master | Read `ShipmentUnit`, `RoutingPattern`, `JourneyStage`, `MilestoneEvent`, `JourneyLeg` | Redefine master route dictionary |\n| Infrastructure | Read `Warehouse`, `WarehouseZone`, `LocationNode`, `OffshoreStagingNode` | Classify MOSB as a Warehouse |\n| Document/OCR | Read `routeEvidence`, `destinationEvidence`, `mosbLegIndicator`, extracted storage requirements | Assign `confirmedFlowCode` from OCR |\n| Port | Read `plannedRoutingPattern`, `declaredDestination`, release evidence | Assign warehouse handling class at port |\n| Marine/Bulk | Read M115/M116/M117 and marine handling constraints | Use warehouse code as marine route class |\n| Cost | Export `wh_handling_cnt`, dwell days, storage class evidence | Make cost domain owner of WHP |\n| Operations | Export stock, warehouse events, capacity, KPI | Replace `RoutingPattern` with warehouse code |\n| Communication | Attach `CommunicationEvent`, `ApprovalAction`, `AuditRecord` as evidence | Redefine logistics execution objects |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#6",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "2.4 Legacy Migration Rules",
    "text": "| Legacy wording | Canonical replacement | Patch action |\n|---|---|---|\n| Flow Code as Port→WH→MOSB→Site route | `ShipmentRoutingPattern` | Replace in route analytics and dashboards |\n| Pre-arrival as Flow Code | `JourneyStage = PRE_ARRIVAL` or `ShipmentStatus = PLANNED/READY` | Remove from WHP confirmed class |\n| Port assigns Flow Code | `PortCall.plannedRoutingPattern` | Treat as routing evidence only |\n| Document extracts Flow Code | `routeEvidence`, `destinationEvidence`, `mosbLegIndicator` | Keep confidence and provenance |\n| Cost by Flow Code | `costByRoutingPattern` + `wh_handling_cnt` | Keep WH evidence read-only |\n| MOSB as Warehouse | `OffshoreStagingNode` / `MarineInterfaceNode` | Optional storage capability only |\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#7",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "3.1 Warehouse Ontology Layer",
    "text": "| Layer | Class / vocabulary | Purpose |\n|---|---|---|\n| Node | `Warehouse`, `WarehouseZone`, `StorageBin`, `YardSlot` | Physical WH location and storage capacity |\n| Transaction | `WarehouseTask`, `PutAwayTask`, `PickTask`, `DispatchTask` | Work execution and accountability |\n| Event | `WarehouseEvent`, `WHReceivedEvent`, `PutAwayEvent`, `PickEvent`, `DispatchEvent`, `CycleCountEvent` | Time-stamped state changes |\n| Inventory | `StockSnapshot`, `InventoryBalance`, `StockStatus` | Inventory state and reconciliation |\n| Handling | `WarehouseHandlingProfile`, `StorageRequirementClass`, `PreservationRequirement` | Storage/handling classification |\n| Control | `DangerousCargoControl`, `OOGHandlingControl`, `CapacityProfile`, `QuarantineHold` | Risk and capacity controls |\n| Evidence | `AuditRecord`, `ApprovalAction`, `VerificationResult`, `CommunicationEvent` | Provenance and human-gate proof |\n| KPI | `WarehouseKPI`, `CapacityUtilizationMetric`, `StockAccuracyMetric` | Operational monitoring |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#8",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "3.2 Core Classes",
    "text": "| Class | Required properties | Key relations | Notes |\n|---|---|---|---|\n| `Warehouse` | `warehouseId`, `warehouseName`, `warehouseType`, `operator`, `locationNodeId` | `hasZone`, `hasCapacityProfile`, `handlesStorageClass` | Indoor/outdoor/DG/special warehouse only |\n| `WarehouseZone` | `zoneId`, `zoneType`, `temperatureControlled`, `humidityControlled`, `dgAllowed` | `partOfWarehouse`, `hasStorageBin` | DG and OOG zones must be explicit |\n| `StorageBin` | `binId`, `binStatus`, `maxWeightKg`, `maxVolumeCbm`, `storageClassAllowed` | `partOfZone` | Optional for yard-level operations |\n| `WarehouseTask` | `taskId`, `taskType`, `taskStatus`, `assignedOperator`, `plannedAt`, `completedAt` | `forShipmentUnit`, `usesEquipment`, `generatesEvent` | Operational transaction object |\n| `WarehouseEvent` | `eventId`, `eventType`, `eventTime`, `qtyPkg`, `weightKg`, `volumeCbm` | `forShipmentUnit`, `atWarehouse`, `evidencedByDocument` | M110/M111/M120/M121 anchor |\n| `StockSnapshot` | `snapshotId`, `snapshotTime`, `qtyPkg`, `weightKg`, `volumeCbm`, `stockStatus` | `forShipmentUnit`, `capturedAtWarehouse` | Snapshot, not event |\n| `InventoryBalance` | `balanceId`, `asOfDate`, `qtyAvailable`, `qtyQuarantine`, `qtyDispatched` | `summarizesStockSnapshot` | Warehouse/month aggregate |\n| `WarehouseHandlingProfile` | `profileId`, `flowConfirmationStatus`, `wh_handling_cnt`, `createdAt` | `forShipmentUnit`, `createdByM110`, `confirmedByM111` | Only owner of `confirmedFlowCode` |\n| `StorageRequirementClass` | `storageRequirementCode`, `temperatureRange`, `humidityMaxPct`, `indoorRequired` | `requiredByMaterial`, `satisfiedByZone` | Material requirement, not WHP result |\n| `PreservationRequirement` | `preservationCode`, `inspectionIntervalDays`, `nextDueDate` | `appliesToShipmentUnit` | Transformer/OOG/DG preservation |\n| `DangerousCargoControl` | `dgClass`, `unNumber`, `segregationGroup`, `permitRequired` | `controlsShipmentUnit`, `requiresApproval` | DG gate |\n| `CapacityProfile` | `capacityPkg`, `capacityWeightKg`, `capacityVolumeCbm`, `targetUtilizationPct` | `forWarehouse` | Capacity guard |\n| `WarehouseKPI` | `metricName`, `metricValue`, `metricDate`, `targetValue` | `measuresWarehouse` | Dashboard output |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#9",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "3.3 `WarehouseHandlingProfile` Class Contract",
    "text": "```turtle\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix owl:  <http://www.w3.org/2002/07/owl#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n\nhvdc:WarehouseHandlingProfile a owl:Class ;\n  rdfs:label \"Warehouse Handling Profile\" ;\n  rdfs:comment \"Warehouse-only storage/handling profile created by M110 WH Received and confirmed by M111 Put-away.\" .\n\nhvdc:confirmedFlowCode a owl:DatatypeProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range xsd:integer ;\n  rdfs:comment \"Warehouse-only storage/handling class; not a shipment route code.\" .\n\nhvdc:flowConfirmationStatus a owl:DatatypeProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range xsd:string ;\n  rdfs:comment \"tentative | confirmed | overridden | void\" .\n\nhvdc:wh_handling_cnt a owl:DatatypeProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range xsd:integer ;\n  rdfs:comment \"Actual count of WH_RECEIVED events for the ShipmentUnit. Does not define the storage class.\" .\n\nhvdc:warehouseDwellDays a owl:DatatypeProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range xsd:decimal .\n\nhvdc:forShipmentUnit a owl:ObjectProperty ;\n  rdfs:domain hvdc:WarehouseHandlingProfile ;\n  rdfs:range hvdc:ShipmentUnit .\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#10",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "3.4 Handling Class Dictionary",
    "text": "`confirmedFlowCode` is retained as an integer because downstream sheets and historical WH dashboards already use numeric class codes. The meaning is now restricted to **warehouse storage/handling class**.\n\n| Code | Canonical class name | Korean name | Storage / handling meaning | Typical evidence | Human-gate |\n|---:|---|---|---|---|---|\n| 0.00 | `STANDARD_INDOOR` | 표준 실내 | Standard dry indoor storage | WH zone = indoor, no special condition | No |\n| 1.00 | `STANDARD_OUTDOOR` | 표준 야적 | Standard outdoor yard / covered yard | WH zone = outdoor, weather-tolerant cargo | No |\n| 2.00 | `SPECIAL_INDOOR` | 특수 실내 | Temperature/humidity/precision indoor handling | humidity limit, shock-sensitive, preservation | Yes if high-value |\n| 3.00 | `SPECIAL_OUTDOOR` | 특수 야적 | Outdoor with cover, dunnage, corrosion protection, oversized yard control | anti-corrosion, covered yard, heavy pallet | Yes if abnormal |\n| 4.00 | `HAZMAT_DG` | 위험물 | DG / hazardous cargo segregated storage | UN No., DG class, MSDS, permit | Mandatory |\n| 5.00 | `OOG_ABNORMAL` | 초대형·이상화물 | OOG/heavy/abnormal cargo requiring engineered handling | lift plan, rigging, abnormal dimensions | Mandatory |\n\n**Important:** `wh_handling_cnt` tracks how many warehouse receipt events occurred. It is not a route code and it does not change the meaning of `confirmedFlowCode`.",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#11",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "3.5 Object Properties",
    "text": "| Property | Domain → Range | Purpose |\n|---|---|---|\n| `hasWarehouseHandlingProfile` | `ShipmentUnit → WarehouseHandlingProfile` | WHP ownership link |\n| `createdByM110` | `WarehouseHandlingProfile → MilestoneEvent` | Creation evidence |\n| `confirmedByM111` | `WarehouseHandlingProfile → WarehouseEvent` | Put-away confirmation evidence |\n| `handledAtWarehouse` | `WarehouseEvent → Warehouse` | Event location |\n| `storedInZone` | `StockSnapshot → WarehouseZone` | Current storage position |\n| `storedInBin` | `StockSnapshot → StorageBin` | Fine-grain bin position |\n| `requiresStorageClass` | `ShipmentUnit → StorageRequirementClass` | Material requirement |\n| `requiresPreservation` | `ShipmentUnit → PreservationRequirement` | Preservation / maintenance requirement |\n| `hasDangerousCargoControl` | `ShipmentUnit → DangerousCargoControl` | DG control and segregation |\n| `usesWarehouseEquipment` | `WarehouseTask → EquipmentResource` | Forklift/crane/rigging assignment |\n| `evidencedByDocument` | `WarehouseEvent → Document` | DO, PL, MRR, photo, checklist evidence |\n| `hasWarehouseApproval` | `WarehouseTask → ApprovalAction` | Human approval proof |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#12",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "3.6 Datatype Properties",
    "text": "| Property | Domain | Type | Constraint |\n|---|---|---|---|\n| `warehouseId` | `Warehouse` | string | required, unique |\n| `zoneType` | `WarehouseZone` | enum | `INDOOR`, `OUTDOOR`, `DG`, `OOG`, `QUARANTINE`, `STAGING` |\n| `eventType` | `WarehouseEvent` | enum | `WH_RECEIVED`, `PUT_AWAY`, `PICKED`, `STAGED`, `DISPATCHED`, `CYCLE_COUNT`, `QUARANTINE_HOLD` |\n| `qtyPkg` | `WarehouseEvent`, `StockSnapshot` | decimal | ≥ 0.00 |\n| `weightKg` | `WarehouseEvent`, `StockSnapshot` | decimal | ≥ 0.00 |\n| `volumeCbm` | `WarehouseEvent`, `StockSnapshot` | decimal | ≥ 0.00 |\n| `flowConfirmationStatus` | `WarehouseHandlingProfile` | enum | `tentative`, `confirmed`, `overridden`, `void` |\n| `confirmedFlowCode` | `WarehouseHandlingProfile` | integer | 0..5; required only when confirmed/overridden |\n| `wh_handling_cnt` | `WarehouseHandlingProfile` | integer | ≥ 1 if WHP exists |\n| `warehouseDwellDays` | `WarehouseHandlingProfile` | decimal | computed from M110 to M121 / current date |\n| `capacityUtilizationPct` | `CapacityProfile` | decimal | 0.00–100.00 |\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#13",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "4.1 Lifecycle",
    "text": "| Step | Milestone / event | WHP state | Required action |\n|---:|---|---|---|\n| 1.00 | M100 Gate-out or WH appointment | no WHP or expected placeholder | Check whether WH receipt is planned |\n| 2.00 | M110 WH Received | `flowConfirmationStatus = tentative` | Create WHP and link WH_RECEIVED event |\n| 3.00 | Physical inspection | tentative | Capture actual zone, DG/OOG flags, damage/shortage flags |\n| 4.00 | M111 Put-away | confirmed | Assign `confirmedFlowCode` and zone/bin |\n| 5.00 | Override case | overridden | Human-gate with reason and approval |\n| 6.00 | M120 Picked/Staged | confirmed/overridden | Update stock status to PICKED/STAGED |\n| 7.00 | M121 WH Dispatched | confirmed/overridden | Close dwell calculation and dispatch event |\n| 8.00 | Direct/non-WH shipment | no WHP | Do not create confirmedFlowCode |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#14",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "4.2 Input Evidence",
    "text": "| Evidence source | Used for | Ownership |\n|---|---|---|\n| WMS receipt row | M110 creation, qty/weight/CBM, warehouse location | Warehouse |\n| Put-away task | M111 confirmation and zone/bin assignment | Warehouse |\n| ERP/material master | storage requirement, high-value flag, material category | Master data |\n| OCR/LDG | extracted storage notes, destination evidence, route evidence | Document evidence only |\n| Port/DO | release and gate-out proof | Port/customs evidence |\n| Marine/OOG plan | abnormal/OOG flag, rigging constraints | Marine/OOG evidence |\n| DG documents | UN No., MSDS, DG class, permit requirement | Compliance evidence |\n| Photos/checklists | condition, packing damage, seal status | Evidence layer |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#15",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "4.3 Deterministic Classification Logic",
    "text": "The algorithm assigns a warehouse class after actual put-away. Route semantics are not used to assign the class.\n\n```python\nfrom dataclasses import dataclass\nfrom typing import Literal\n\nFlowStatus = Literal[\"tentative\", \"confirmed\", \"overridden\", \"void\"]\n\n@dataclass\nclass WHPInput:\n    m110_exists: bool\n    m111_putaway_exists: bool\n    actual_zone_type: str            # INDOOR | OUTDOOR | DG | OOG | QUARANTINE | STAGING\n    material_requires_indoor: bool\n    temperature_control_required: bool\n    humidity_control_required: bool\n    outdoor_special_protection: bool\n    dg_class: str | None\n    un_number: str | None\n    is_oog: bool\n    is_heavy_lift: bool\n    abnormal_dimension_flag: bool\n    wh_received_event_count: int\n    override_code: int | None = None\n    override_reason: str | None = None\n\ndef classify_confirmed_flow_code(x: WHPInput) -> dict:\n    if not x.m110_exists:\n        return {\n            \"create_whp\": False,\n            \"flowConfirmationStatus\": \"void\",\n            \"confirmedFlowCode\": None,\n            \"reason\": \"No WH Received event; direct or non-warehouse shipment.\"\n        }\n\n    status: FlowStatus = \"tentative\"\n    if not x.m111_putaway_exists:\n        return {\n            \"create_whp\": True,\n            \"flowConfirmationStatus\": status,\n            \"confirmedFlowCode\": None,\n            \"wh_handling_cnt\": x.wh_received_event_count,\n            \"reason\": \"WHP created at M110; class awaits M111 put-away confirmation.\"\n        }\n\n    if x.override_code is not None:\n        assert x.override_reason, \"Override requires reason.\"\n        return {\n            \"create_whp\": True,\n            \"flowConfirmationStatus\": \"overridden\",\n            \"confirmedFlowCode\": x.override_code,\n            \"wh_handling_cnt\": x.wh_received_event_count,\n            \"reason\": x.override_reason\n        }\n\n    if x.dg_class or x.un_number or x.actual_zone_type == \"DG\":\n        code = 4\n    elif x.is_oog or x.is_heavy_lift or x.abnormal_dimension_flag or x.actual_zone_type == \"OOG\":\n        code = 5\n    elif x.temperature_control_required or x.humidity_control_required or x.material_requires_indoor:\n        code = 2\n    elif x.outdoor_special_protection or x.actual_zone_type == \"OUTDOOR_SPECIAL\":\n        code = 3\n    elif x.actual_zone_type == \"OUTDOOR\":\n        code = 1\n    else:\n        code = 0\n\n    return {\n        \"create_whp\": True,\n        \"flowConfirmationStatus\": \"confirmed\",\n        \"confirmedFlowCode\": code,\n        \"wh_handling_cnt\": x.wh_received_event_count,\n        \"reason\": \"Class assigned from actual warehouse storage/handling condition.\"\n    }\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#16",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "4.4 Classification Precedence",
    "text": "| Rank | Condition | Code | Reason |\n|---:|---|---:|---|\n| 1.00 | DG / UN No. / MSDS / DG zone | 4.00 | Regulatory segregation dominates storage decision |\n| 2.00 | OOG / heavy lift / abnormal dimensions / engineered handling | 5.00 | Requires abnormal handling and engineering control |\n| 3.00 | Temperature/humidity/precision indoor | 2.00 | Special indoor preservation |\n| 4.00 | Outdoor with cover, dunnage, corrosion protection | 3.00 | Special outdoor preservation |\n| 5.00 | Standard outdoor yard | 1.00 | Normal outdoor storage |\n| 6.00 | Standard dry indoor | 0.00 | Default standard indoor |\n\nComposite cases must retain additional boolean flags such as `isHazmat`, `isOOG`, `isHighValue`, `requiresPreservation`, and `requiresHumanGate`. If DG and OOG both apply, `confirmedFlowCode = 4` with `abnormalHandlingFlag = true`, unless HSE/WH Manager approves an override.",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#17",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "4.5 `wh_handling_cnt` Rule",
    "text": "| Rule | Meaning |\n|---|---|\n| `wh_handling_cnt = COUNT(WH_RECEIVED events)` | Actual warehouse receipt count for the ShipmentUnit |\n| `wh_handling_cnt ≥ 1` | Required if a WHP exists |\n| `wh_handling_cnt = 0` | Do not create confirmed WHP; use shipment route and milestone data instead |\n| `wh_handling_cnt > 1` | Multi-warehouse handling; does not change `confirmedFlowCode` by itself |\n| `wh_handling_cnt` and `RoutingPattern` | Can be jointly analyzed by cost/ops, but remain separate semantics |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#18",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "4.6 State Machine",
    "text": "```text\nNO_WHP\n  ├─ M110 WH_RECEIVED → WHP_TENTATIVE\n  │    ├─ M111 PUT_AWAY + auto class → WHP_CONFIRMED\n  │    ├─ M111 PUT_AWAY + manual override → WHP_OVERRIDDEN\n  │    └─ receipt cancelled / wrong link → WHP_VOID\n  └─ direct shipment / no WH receipt → remain NO_WHP\n\nWHP_CONFIRMED / WHP_OVERRIDDEN\n  ├─ M120 PICKED/STAGED → WH_STAGED\n  ├─ M121 DISPATCHED → WH_DISPATCHED\n  └─ discrepancy found → QUARANTINE_HOLD or OSD/NCR workflow\n```\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#19",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "5.1 Milestone Alignment",
    "text": "| Milestone | Warehouse meaning | Object created / updated |\n|---|---|---|\n| M100 Gate-out | Inland haulage starts; WH appointment may be expected | `JourneyLeg`, `WarehouseTask` optional |\n| M110 WH Received | Physical receipt into warehouse | `WarehouseEvent`, `WarehouseHandlingProfile`, `StockSnapshot` |\n| M111 Put-away | Zone/bin confirmed | `PutAwayTask`, WHP `confirmedFlowCode`, `StockSnapshot` |\n| M112 Quarantine Hold | Discrepancy, DG hold, damage, missing docs | `QuarantineHold`, `Exception` |\n| M120 Picked/Staged | Prepared for dispatch | `PickTask`, `WarehouseEvent` |\n| M121 WH Dispatched | Leaves warehouse | `DispatchTask`, stock decrement, dwell close |\n| M130 Site Arrived | Site receipt outside WH scope | Read-only downstream milestone |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#20",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "5.2 Warehouse Event Types",
    "text": "| Event type | Required fields | Stock impact |\n|---|---|---|\n| `WH_RECEIVED` | `shipmentUnit`, `warehouse`, `eventTime`, `qtyPkg`, `weightKg`, `volumeCbm` | Increase expected/received stock |\n| `PUT_AWAY` | `zone`, `bin/slot`, `eventTime`, `operator` | Stock status = AVAILABLE / QUARANTINE |\n| `QUARANTINE_HOLD` | `reason`, `severity`, `approvalRequired` | Stock status = QUARANTINE |\n| `PRESERVATION_CHECK` | `checkType`, `result`, `nextDueDate` | No quantity change |\n| `CYCLE_COUNT` | `countedQty`, `systemQty`, `variance` | Reconciliation |\n| `PICKED` | `pickTask`, `qtyPkg`, `eventTime` | Stock status = PICKED |\n| `STAGED` | `stagingArea`, `dispatchPlanRef` | Stock status = STAGED |\n| `DISPATCHED` | `destinationNode`, `carrier`, `truckRef`, `eventTime` | Decrease warehouse stock |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#21",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "5.3 Stock Status Vocabulary",
    "text": "| Status | Meaning | Allowed transition |\n|---|---|---|\n| `EXPECTED` | WH receipt planned but not physically received | → RECEIVED |\n| `RECEIVED` | Physically received, awaiting put-away | → AVAILABLE / QUARANTINE |\n| `AVAILABLE` | Put-away complete and available for issue | → PICKED / QUARANTINE |\n| `QUARANTINE` | Blocked due to OSD, QC, DG, document gap | → AVAILABLE / CLAIM_OPENED |\n| `PICKED` | Picked for outbound movement | → STAGED |\n| `STAGED` | Staged at dispatch area | → DISPATCHED |\n| `DISPATCHED` | Left warehouse | terminal state for WH stock |\n| `ISSUED` | Issued to construction/site team | site/material issue layer |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#22",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "5.4 Capacity Control",
    "text": "| Capacity band | Rule | Action |\n|---|---|---|\n| `< 75.00%` | Under-utilized | Consolidation review |\n| `75.00–85.00%` | Target utilization | Normal operation |\n| `85.01–95.00%` | High utilization | Intake scheduling review |\n| `> 95.00%` | Critical | Overflow WH / dispatch acceleration / human-gate |\n\n```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?warehouse ?utilPct ?band\nWHERE {\n  ?cp a hvdc:CapacityProfile ;\n      hvdc:forWarehouse ?warehouse ;\n      hvdc:capacityUtilizationPct ?utilPct .\n  BIND(\n    IF(?utilPct > 95.00, \"CRITICAL\",\n    IF(?utilPct > 85.00, \"HIGH\",\n    IF(?utilPct >= 75.00, \"TARGET\", \"LOW\"))) AS ?band\n  )\n}\nORDER BY DESC(?utilPct)\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#23",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "5.5 Inventory Integrity Formulae",
    "text": "| Formula | Gate |\n|---|---|\n| `Opening + Receipts − Dispatches ± Adjustments = Closing` | `InventoryBalanceShape` |\n| `Σ StockSnapshot.qtyPkg by warehouse = WMS balance ± 0.00` | `StockReconciliationShape` |\n| `Event.qtyPkg ≥ 0.00`, `weightKg ≥ 0.00`, `volumeCbm ≥ 0.00` | `WarehouseEventNumericShape` |\n| `WHP exists ⇒ at least one WH_RECEIVED event` | `WHPM110Shape` |\n| `confirmed/overridden WHP ⇒ confirmedFlowCode present` | `WHPConfirmedClassShape` |\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#24",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "6.1 Foundry Object Types",
    "text": "| Foundry Object Type | Backing dataset | Key properties | Links |\n|---|---|---|---|\n| `Warehouse` | `location_node_master` / WMS master | `warehouseId`, `warehouseType`, `operator`, `capacity` | hasZone, hasCapacityProfile |\n| `WarehouseZone` | WMS zone/bin master | `zoneId`, `zoneType`, `storageClassAllowed` | partOfWarehouse |\n| `WarehouseTask` | WMS task table | `taskId`, `taskType`, `taskStatus`, `operator` | forShipmentUnit, generatesEvent |\n| `WarehouseEvent` | WMS event log | `eventType`, `eventTime`, `qtyPkg`, `weightKg`, `volumeCbm` | forShipmentUnit, handledAtWarehouse |\n| `StockSnapshot` | WMS stock snapshot | `snapshotTime`, `stockStatus`, `qtyPkg`, `weightKg`, `volumeCbm` | capturedAtWarehouse, forShipmentUnit |\n| `WarehouseHandlingProfile` | WHP gold dataset | `confirmedFlowCode`, `flowConfirmationStatus`, `wh_handling_cnt`, `dwellDays` | forShipmentUnit, createdByM110 |\n| `CapacityProfile` | WH capacity register | `capacityPkg`, `capacityWeightKg`, `capacityVolumeCbm`, `utilPct` | forWarehouse |\n| `DangerousCargoControl` | DG register / MSDS | `unNumber`, `dgClass`, `segregationGroup` | controlsShipmentUnit |\n| `PreservationRequirement` | material / vendor instruction | `preservationCode`, `inspectionIntervalDays`, `nextDueDate` | appliesToShipmentUnit |\n| `WarehouseKPI` | KPI mart | `metricName`, `metricValue`, `metricDate` | measuresWarehouse |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#25",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "6.2 Source-to-Ontology Mapping",
    "text": "| Source | Input fields | Ontology mapping | Validation gate |\n|---|---|---|---|\n| WMS Receipt | receipt no., package no., date, warehouse, qty, weight, CBM | `WH_RECEIVED`, M110, WHP tentative | required fields + non-negative values |\n| WMS Put-away | zone/bin, actual put-away date, operator | M111, WHP confirmed class | storage class compatible with zone |\n| WMS Dispatch | truck ref, destination, dispatch date, qty | M121, stock decrement | cannot dispatch unavailable/quarantine stock |\n| ERP / PO | material category, vendor, PO, package | `StorageRequirementClass`, high-value flag | material master completeness |\n| LDG/OCR | PL/CI/DO notes, dimensions, DG fields | evidence only | confidence threshold + cross-doc consistency |\n| Port / Customs | DO released, gate pass, route evidence | precondition for WH receipt | M92/M100 ordering |\n| Marine / OOG | OOG, rigging, lashing plan evidence | OOG flag / abnormal gate | human-gate if OOG_ABNORMAL |\n| Cost | warehouse charge lines, storage days | read WHP and dwell evidence | no cost-owned WHP updates |\n| Communication | approvals, exception emails, photos | `ApprovalAction`, `CommunicationEvent` evidence | provenance / masking |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#26",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "6.3 Foundry Link Types",
    "text": "| Link Type | Cardinality | Purpose |\n|---|---:|---|\n| `ShipmentUnit_hasWHP` | 1:0..1 | Link operational shipment unit to WHP |\n| `WHP_createdBy_M110` | 1:1 | Link WHP to WH Received milestone |\n| `WHP_confirmedBy_PutAway` | 1:0..1 | Link WHP to put-away event |\n| `ShipmentUnit_hasWarehouseEvent` | 1:N | Warehouse timeline |\n| `WarehouseEvent_handledAt_Warehouse` | N:1 | Event location |\n| `StockSnapshot_capturedAt_WarehouseZone` | N:1 | Current inventory location |\n| `WarehouseTask_generates_Event` | 1:N | Task-to-event provenance |\n| `ShipmentUnit_requires_Preservation` | 1:N | Preservation controls |\n| `ShipmentUnit_has_DGControl` | 1:0..1 | Dangerous cargo controls |\n| `Warehouse_has_CapacityProfile` | 1:1 | Capacity monitoring |\n| `WarehouseEvent_evidencedBy_Document` | N:N | Photos/checklists/DO/PL evidence |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#27",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "6.4 Foundry Action Types",
    "text": "| Action Type | Object | Parameters | Edits | Guard |\n|---|---|---|---|---|\n| `RecordWHReceipt` | `ShipmentUnit` | `warehouseId`, `eventTime`, `qtyPkg`, `weightKg`, `volumeCbm` | Create M110, WH_RECEIVED, WHP tentative | M92/M100 evidence, no duplicate open WHP |\n| `ConfirmPutAway` | `WarehouseHandlingProfile` | `zoneId`, `binId`, `storageClassEvidence` | Create M111, set class/status | zone compatibility, DG/OOG gate |\n| `OverrideWHPClass` | `WarehouseHandlingProfile` | `overrideCode`, `reason`, `approver` | Set status overridden | Human-gate mandatory |\n| `CreateQuarantineHold` | `StockSnapshot` | `reason`, `severity`, `evidenceDoc` | Stock status QUARANTINE, Exception | cannot dispatch |\n| `RecordPreservationCheck` | `ShipmentUnit` | `checkType`, `result`, `nextDueDate` | Preservation event | overdue flag if missed |\n| `RecordWHPickStage` | `WarehouseTask` | `qtyPkg`, `stagingArea`, `dispatchPlanRef` | M120/PICKED/STAGED | available stock only |\n| `RecordWHDispatch` | `WarehouseTask` | `carrier`, `truckRef`, `destinationNode`, `eventTime` | M121/DISPATCHED, stock decrement | no quarantine, qty available |\n| `CloseCycleCount` | `Warehouse` | `countedQty`, `varianceReason` | Inventory adjustment | variance approval if > 2.00% |\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#28",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "7.1 SHACL — WHP Boundary Shape",
    "text": "```turtle\n@prefix sh: <http://www.w3.org/ns/shacl#> .\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\nhvdc:WHPShape a sh:NodeShape ;\n  sh:targetClass hvdc:WarehouseHandlingProfile ;\n  sh:property [\n    sh:path hvdc:flowConfirmationStatus ;\n    sh:datatype xsd:string ;\n    sh:in (\"tentative\" \"confirmed\" \"overridden\" \"void\") ;\n    sh:minCount 1 ;\n    sh:message \"WarehouseHandlingProfile requires flowConfirmationStatus.\" ;\n  ] ;\n  sh:property [\n    sh:path hvdc:wh_handling_cnt ;\n    sh:datatype xsd:integer ;\n    sh:minInclusive 1 ;\n    sh:minCount 1 ;\n    sh:message \"WHP requires wh_handling_cnt >= 1 because it is created only after WH receipt.\" ;\n  ] ;\n  sh:sparql [\n    sh:message \"confirmedFlowCode is required only when WHP is confirmed or overridden.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this\n      WHERE {\n        $this hvdc:flowConfirmationStatus ?status .\n        FILTER(?status IN (\"confirmed\", \"overridden\"))\n        FILTER NOT EXISTS { $this hvdc:confirmedFlowCode ?code . }\n      }\n    \"\"\" ;\n  ] ;\n  sh:sparql [\n    sh:message \"confirmedFlowCode must be integer 0..5 when present.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this\n      WHERE {\n        $this hvdc:confirmedFlowCode ?code .\n        FILTER(?code < 0 || ?code > 5)\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#29",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "7.2 SHACL — Global Flow Code Boundary",
    "text": "```turtle\nhvdc:GlobalConfirmedFlowCodeBoundaryShape a sh:NodeShape ;\n  sh:targetSubjectsOf hvdc:confirmedFlowCode ;\n  sh:sparql [\n    sh:message \"VIOLATION-1: confirmedFlowCode may exist only on WarehouseHandlingProfile.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this\n      WHERE {\n        $this hvdc:confirmedFlowCode ?code .\n        FILTER NOT EXISTS { $this a hvdc:WarehouseHandlingProfile . }\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#30",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "7.3 SHACL — MOSB Not Warehouse",
    "text": "```turtle\nhvdc:MOSBNotWarehouseShape a sh:NodeShape ;\n  sh:targetClass hvdc:Warehouse ;\n  sh:sparql [\n    sh:message \"MOSB must not be typed as Warehouse. Use OffshoreStagingNode / MarineInterfaceNode.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this\n      WHERE {\n        $this a hvdc:Warehouse ;\n              hvdc:nodeCode ?code .\n        FILTER(CONTAINS(UCASE(STR(?code)), \"MOSB\"))\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#31",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "7.4 SHACL — Warehouse Event Minimum Fields",
    "text": "```turtle\nhvdc:WarehouseEventShape a sh:NodeShape ;\n  sh:targetClass hvdc:WarehouseEvent ;\n  sh:property [ sh:path hvdc:eventId ; sh:datatype xsd:string ; sh:minCount 1 ] ;\n  sh:property [ sh:path hvdc:eventType ; sh:in (\"WH_RECEIVED\" \"PUT_AWAY\" \"QUARANTINE_HOLD\" \"PRESERVATION_CHECK\" \"CYCLE_COUNT\" \"PICKED\" \"STAGED\" \"DISPATCHED\") ; sh:minCount 1 ] ;\n  sh:property [ sh:path hvdc:eventTime ; sh:datatype xsd:dateTime ; sh:minCount 1 ] ;\n  sh:property [ sh:path hvdc:qtyPkg ; sh:datatype xsd:decimal ; sh:minInclusive 0.00 ; sh:minCount 1 ] ;\n  sh:property [ sh:path hvdc:weightKg ; sh:datatype xsd:decimal ; sh:minInclusive 0.00 ] ;\n  sh:property [ sh:path hvdc:volumeCbm ; sh:datatype xsd:decimal ; sh:minInclusive 0.00 ] .\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#32",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "7.5 SPARQL — WHP Missing After WH Receipt",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?shipmentUnit ?event ?eventTime\nWHERE {\n  ?event a hvdc:WarehouseEvent ;\n         hvdc:eventType \"WH_RECEIVED\" ;\n         hvdc:forShipmentUnit ?shipmentUnit ;\n         hvdc:eventTime ?eventTime .\n  FILTER NOT EXISTS { ?shipmentUnit hvdc:hasWarehouseHandlingProfile ?whp . }\n}\nORDER BY ?eventTime\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#33",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "7.6 SPARQL — Confirmed WHP Without Put-away",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?whp ?shipmentUnit ?status\nWHERE {\n  ?whp a hvdc:WarehouseHandlingProfile ;\n       hvdc:forShipmentUnit ?shipmentUnit ;\n       hvdc:flowConfirmationStatus ?status .\n  FILTER(?status IN (\"confirmed\", \"overridden\"))\n  FILTER NOT EXISTS { ?whp hvdc:confirmedByM111 ?putAwayEvent . }\n}\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#34",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "7.7 SPARQL — Quarantine Dispatch Blocker",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?shipmentUnit ?stock ?dispatchTask\nWHERE {\n  ?stock a hvdc:StockSnapshot ;\n         hvdc:forShipmentUnit ?shipmentUnit ;\n         hvdc:stockStatus \"QUARANTINE\" .\n  ?dispatchTask a hvdc:WarehouseTask ;\n                hvdc:forShipmentUnit ?shipmentUnit ;\n                hvdc:taskType \"DISPATCH\" ;\n                hvdc:taskStatus ?status .\n  FILTER(?status IN (\"PLANNED\", \"READY\", \"IN_PROGRESS\", \"COMPLETED\"))\n}\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#35",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "7.8 RAG Checks",
    "text": "| RAG gate | Trigger | Required evidence |\n|---|---|---|\n| DG storage | DG class, UN No., MSDS, chemical battery/gas/material flag | Current HSE/DCD/DG SOP, MSDS, segregation table |\n| FANR-sensitive item | radiation/nuclear-related material flag | FANR permit / project compliance record |\n| MOIAT regulated product | regulated equipment/product flag | CoC / approval evidence |\n| OOG/abnormal | dimension/weight threshold or lift plan required | engineering method statement / rigging evidence |\n| High-value cargo | value > 100,000.00 AED | WH Manager + Finance approval |\n| Capacity critical | utilization > 95.00% | overflow approval / dispatch acceleration plan |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#36",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "7.9 Human-gate Matrix",
    "text": "| Gate | Trigger | Required role | Blocked action |\n|---|---|---|---|\n| WHP override | `flowConfirmationStatus = overridden` | WH Manager | WHP finalization |\n| DG storage | `confirmedFlowCode = 4` | HSE / DG Controller | Put-away / dispatch |\n| OOG abnormal | `confirmedFlowCode = 5` | WH Manager + Rigging/Engineering | Put-away / movement |\n| Quarantine release | `stockStatus = QUARANTINE` | QA/QC + WH Manager | Dispatch |\n| Capacity critical | utilization > 95.00% | Logistics Manager | New receipt |\n| High-value | value > 100,000.00 AED | WH Manager + Finance | Release / transfer |\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#37",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "8. Compliance — Incoterms / MOIAT / FANR / DCD / ADNOC",
    "text": "| Compliance area | Warehouse implication | Ontology object / evidence |\n|---|---|---|\n| Incoterms 2020 | Determines cost/risk responsibility for storage, demurrage, detention, last-mile handover | `PurchaseOrder.incoterm`, `Contract`, `CostResponsibility` |\n| MOIAT | Regulated products may require certificate evidence before release/storage decision | `PermitDocument`, `RegulatoryRequirement`, `ComplianceCheck` |\n| FANR | Radiation/nuclear-sensitive materials require permit evidence and controlled storage handling | `PermitDocument`, `DangerousCargoControl`, `ApprovalAction` |\n| DCD / DG / IMDG / IATA DGR | DG segregation, MSDS, compatible storage, HSE procedure | `DangerousCargoControl`, `WarehouseZone.dgAllowed` |\n| ADNOC / CICPA / GatePass | Access and movement evidence for controlled nodes and dispatch | `GatePass`, `ApprovalAction`, `JourneyLeg` |\n| ISO 9001 / ISO 14001 | Quality/environmental controls for inventory, preservation, records | `AuditRecord`, `PreservationRequirement`, `WarehouseKPI` |\n\nCompliance attributes are evidence-driven. `CONSOLIDATED-02` does not hard-code authority-specific validity or SLA values unless project SOP evidence is attached.\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#38",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "9. Options ≥3",
    "text": "| Option | Description | Pros | Cons | CostIndex | Risk | Time |\n|---|---|---|---|---:|---:|---:|\n| A. WHP-only MVP | Implement M110/M111 WHP creation, class assignment, basic stock snapshot | Fast deployment, removes semantic collision | Limited capacity/DG automation | 1.00/5.00 | 20.00% | 4.00 weeks |\n| B. Warehouse Control Twin | MVP + WMS task/events + capacity + quarantine + preservation | Strong operational control, high auditability | Requires WMS data quality | 2.50/5.00 | 18.00% | 8.00 weeks |\n| C. WH + Compliance Gate | Control Twin + DG/FANR/MOIAT/ADNOC gates + RAG evidence | Best for regulated/high-risk cargo | Requires current SOP integration | 3.50/5.00 | 22.00% | 10.00 weeks |\n| D. Full RDF/Foundry Bridge | Full SHACL/OWL validation + Foundry Actions + external RDF export | Highest semantic consistency | Architecture complexity | 5.00/5.00 | 30.00% | 14.00 weeks |\n\nRecommended sequence: **A → B → C**, then D only if external RDF reasoning or enterprise graph reuse is required.\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#39",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "10. Roadmap — Prepare → Pilot → Build → Operate → Scale",
    "text": "| Phase | Scope | KPI |\n|---|---|---|\n| Prepare | WH master, zone/bin, storage class dictionary, WMS event mapping | WarehouseMasterCoverage ≥ 95.00% |\n| Pilot | M110/M111 WHP for one indoor WH + one outdoor yard | WHP Coverage ≥ 95.00%, class error ≤ 2.00% |\n| Build | WMS events, stock snapshots, capacity, quarantine, preservation | Stock Accuracy ≥ 99.00%, NumericIntegrity = 100.00% |\n| Operate | Foundry actions, SHACL gates, exception workflow, dashboards | Validation p95 < 5.00s, Capacity band 75.00–85.00% |\n| Scale | Multi-WH rollout, DG/OOG RAG gate, cost/ops integration | WHP Coverage ≥ 98.00%, HumanGate leakage = 0.00건 |\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#40",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "11. Automation Notes — RPA / LLM / Sheets / TG Hooks",
    "text": "| Automation | Trigger | Action |\n|---|---|---|\n| `WHPInjector` | M110 WH Received | Create `WarehouseHandlingProfile` with tentative status |\n| `PutAwayClassifier` | M111 Put-away | Assign `confirmedFlowCode` from actual zone/condition evidence |\n| `WHPBoundaryGuard` | Any write to `confirmedFlowCode` | Block if subject is not `WarehouseHandlingProfile` |\n| `MOSBClassGuard` | Node master update | Block MOSB typed as Warehouse |\n| `DGStorageGuard` | DG class / UN No. / MSDS detected | Require DG zone + HSE approval |\n| `OOGHandlingGuard` | OOG/heavy/abnormal dimension detected | Require lift/rigging method evidence |\n| `CapacityGuard` | capacity utilization > 85.00% | WARN; > 95.00% CRITICAL and human-gate |\n| `QuarantineDispatchBlocker` | Dispatch task for quarantined stock | Block dispatch until release approval |\n| `CycleCountBot` | Monthly / variance event | Generate variance and approval list |\n| `DailyWHDigest` | 08:00 Asia/Dubai | WHP gaps, overdue preservation, capacity risk, quarantine list |\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#41",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "12.1 QA Checklist",
    "text": "| Check | PASS criteria |\n|---|---|\n| Flow Code boundary | `confirmedFlowCode` appears only on `WarehouseHandlingProfile` |\n| Route separation | Route state uses `RoutingPattern`, not WHP class |\n| M110 trigger | WHP created only after WH Received |\n| M111 confirmation | Confirmed/overridden WHP has put-away evidence |\n| MOSB classification | MOSB is not top-level Warehouse |\n| WH event quality | `eventType`, `eventTime`, `qtyPkg`, `warehouse` required |\n| Stock integrity | no negative qty/weight/CBM; inventory formula balances |\n| Capacity control | 75.00–85.00% target band; >95.00% CRITICAL |\n| DG control | DG cargo stored only in DG-compatible zones |\n| OOG control | OOG/abnormal class requires human-gate |\n| Cost boundary | Cost reads WHP evidence but does not assign it |\n| OCR boundary | OCR provides evidence only, no direct WHP assignment |\n| Evidence privacy | PII in people/contact evidence masked unless explicitly authorized |",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#42",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "12.2 Assumptions",
    "text": "- `ShipmentUnit` is the operational anchor; `WarehouseHandlingProfile` is attached to it.\n- Direct shipments with no WH receipt do not receive a confirmed WHP.\n- `confirmedFlowCode` is retained for backward compatibility but redefined as warehouse-only storage/handling class.\n- `wh_handling_cnt` is derived from actual WH receipt events, not planned route hops.\n- Authority-specific validity, permit lead-time, and submission templates require current project SOP / portal evidence before automation.\n- MOSB may expose storage-like capability, but the class remains `OffshoreStagingNode` / `MarineInterfaceNode` outside this warehouse taxonomy.\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#43",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "13. Patch Ledger — 5x Corpus Compatibility Review",
    "text": "| Pass | Lens | Patch applied | Result |\n|---:|---|---|---|\n| 1.00 | Master spine alignment | Re-anchored document to `CONSOLIDATED-00` and removed route ownership from WHP | PASS |\n| 2.00 | Flow Code boundary | Recast `confirmedFlowCode` as warehouse storage/handling class only | PASS |\n| 3.00 | Extension compatibility | Aligned OCR/Port/Cost/Marine/Ops as evidence consumers/providers only | PASS |\n| 4.00 | SHACL/SPARQL gates | Added WHP boundary, conditional class, MOSB-not-Warehouse, event/stock validation | PASS |\n| 5.00 | Artifact QA | Added Foundry mapping, KPI, roadmap, automation, assumptions, command recommendations | PASS |\n\n---",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-02-warehouse-flow#44",
    "docId": "CONSOLIDATED-02-warehouse-flow",
    "title": "hvdc-warehouse-flow · CONSOLIDATED-02",
    "version": "2.0-final",
    "sectionPath": "14. CmdRec",
    "text": "```text\n/warehouse-master --fast stock-audit\n```\n\n```text\n/wh-handling validate --strict\n```\n\n```text\n/logi-master report --deep --KRsummary\n```",
    "docHash": "3c9966c1269ae521f2f60a725973e90338141d4d8c0dea1826bf5cac7dd6dade",
    "domains": [
      "warehouse"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#1",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Document Guardian & OCR Pipeline Ontology — Consolidated\"\ntype: \"ontology-design\"\ndomain: \"document-processing\"\nsub-domains:\n  - document-guardian\n  - trust-ontology\n  - semantic-verification\n  - ocr-extraction\n  - data-refinement\n  - validation-framework\n  - route-evidence\n  - compliance-evidence\n  - cost-evidence\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\nextension_of: \"hvdc-master-ontology-v2.0-final\"\ncanonical_role: \"LDG/OCR trust layer and cross-document validation extension\"\nowner: \"HVDC Logistics Ontology Working Set\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\n  - GS1-EPCIS\n  - DCSA-T&T\n  - UN/CEFACT-BSP-RDM\n  - WCO-DM\n  - ICC-Incoterms-2020\nsource_files:\n  - 1_CORE-06-hvdc-doc-guardian.md\n  - 1_CORE-07-hvdc-ocr-pipeline.md\nchecked_against:\n  - CONSOLIDATED-00-master-ontology.md\n  - CONSOLIDATED-01-core-framework-infra.md\n  - CONSOLIDATED-02-warehouse-flow.md\n  - CONSOLIDATED-04-barge-bulk-cargo.md\n  - CONSOLIDATED-05-invoice-cost.md\n  - CONSOLIDATED-06-material-handling.md\n  - CONSOLIDATED-07-port-operations.md\n  - CONSOLIDATED-09-operations.md\n  - AGENTS.md\n  - HVDC Logistics Ontology Review.txt\n  - Palantir 온톨로지 기반 물류 자동화.pdf\nvalidation_passes: 5\nsemantic_patch:\n  - \"Document/OCR is evidence-only and does not own operational route truth.\"\n  - \"Canonical document evidence fields: routeEvidence, destinationEvidence, mosbLegIndicator, routeEvidenceConfidence.\"\n  - \"WarehouseHandlingProfile.confirmedFlowCode remains warehouse-only and is never assigned by LDG/OCR.\"\n  - \"MOSB is OffshoreStagingNode / MarineInterfaceNode evidence, not Warehouse.\"\n  - \"Cross-document validation writes VerificationResult and AuditRecord, not transaction mutation.\"\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#2",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "1. ExecSummary",
    "text": "`CONSOLIDATED-03`은 HVDC Logistics KG의 **Logistics Document Guardian(LDG) + OCR trust layer extension**이다. CI/PL/BL/BOE/DO/Permit/MRR/MRI/POD/GRN/OSDR 등 문서를 `Document`, `DocumentEntity`, `CrossDocLink`, `VerificationResult`, `AuditRecord`로 정규화하여 Any-key traceability와 문서 정합성 검증을 제공한다.\n\n비즈니스 임팩트는 **통관·릴리즈 지연 차단**, **금액·수량·중량 불일치 조기 검출**, **AGI/DAS MOSB 증빙 누락 차단**, **문서 증빙 기반 비용·운영 감사 추적성 확보**이다. 기술 해법은 OCR token/table extraction → semantic normalization → entity linking → SHACL/SPARQL gate → Foundry Object/Action write-back guard 순서로 구성한다.\n\nKPI 목표는 `MeanConf ≥ 0.92`, `TableAcc ≥ 0.98`, `NumericIntegrity = 1.00`, `CrossDocumentConsistency = 1.00`, `RouteEvidenceAccuracy ≥ 0.95`, `Validation p95 < 5.00s`이다. 모든 금액·수량 계산은 원문 단위와 원통화를 보존하고, 변환은 승인된 downstream Cost/Customs layer에서만 수행한다.\n\n**ENG-KR one-liner:** Documents provide evidence; `ShipmentUnit` owns route state, `WarehouseHandlingProfile` owns warehouse handling class, and LDG owns trust/verification artifacts only.\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#3",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "2.1 Master Governance Rule",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.\n2. `CONSOLIDATED-03` owns document ingestion, OCR extraction, semantic normalization, cross-document validation, and evidence trust scoring only.\n3. Program-wide shipment visibility uses `RoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`.\n4. LDG/OCR may extract `routeEvidence`, `destinationEvidence`, `mosbLegIndicator`, storage notes, compliance hints, and invoice line evidence. It shall not assign `ShipmentUnit.hasRoutingPattern` directly.\n5. `confirmedFlowCode` may exist only on `WarehouseHandlingProfile` and only after warehouse evidence per `CONSOLIDATED-02`; LDG/OCR never writes it.\n6. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`; LDG can detect MOSB references as evidence but cannot type MOSB as Warehouse.\n7. Evidence cannot mutate operational transactions unless an approved Foundry Action writes the target transaction object with reviewer and audit trail.",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#4",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "2.2 Included vs Delegated Scope",
    "text": "| Scope item | Included in CONSOLIDATED-03 | Delegated / excluded |\n|---|---|---|\n| Document intake | File registry, hash, document type, source system, page/image metadata | Source-system master ownership |\n| OCR extraction | OCR tokens, table cells, positions, confidence, language/script hints | OCR engine procurement and training policy |\n| Semantic normalization | Unit, currency, quantity, date, party, port, site, HS, permit, route evidence normalization | Final customs classification and tariff decision |\n| Entity linking | BL, container, invoice, PO, package, DO, BOE, permit, shipment key linking | Master identity policy in `CONSOLIDATED-00` |\n| Cross-document validation | CI/PL/BL/BOE/DO/MRR/POD/GRN consistency checks | Transaction creation in Customs/WH/Site layers |\n| Evidence trust layer | `VerificationResult`, `TrustLayer`, `AuditRecord`, `ProofArtifact` | Communication evidence ownership in `CONSOLIDATED-08` |\n| Cost evidence | Invoice line extraction and numeric integrity checks | RateRef, CostGuard verdict ownership in `CONSOLIDATED-05` |\n| Compliance evidence | MOIAT/FANR/DCD/ADNOC permit extraction and expiry evidence | Current authority interpretation and operational approval |\n| Warehouse interface | Storage requirement evidence, DG/OOG notes, destination evidence | WHP assignment and stock operations in `CONSOLIDATED-02` |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#5",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "2.3 Domain Boundary Crosswalk",
    "text": "| Domain | Allowed interface from LDG/OCR | Not allowed in CONSOLIDATED-03 |\n|---|---|---|\n| Core master | Attach `Document`, `DocumentEntity`, `VerificationResult` to `ShipmentUnit` | Redefine `ShipmentUnit`, `RoutingPattern`, or milestone dictionary |\n| Warehouse | Provide storage notes, DG/OOG evidence, destination evidence | Assign `confirmedFlowCode` or create WH stock truth |\n| Port | Validate BL/DO/BOE/port call evidence and declared destination | Own port routing decision or OFCO service truth |\n| Customs | Extract HS/origin/value/permit/BOE evidence | Collapse `CustomsEntry` into `BOEDocument` |\n| Marine/Bulk | Extract MOSB/LCT/lashing/stability evidence | Own `MarineRoutingPattern` or offshore operation approval |\n| Cost | Extract invoice lines, quantities, rates, amount totals | Own `RateRef`, `CostGuardResult`, or FX override |\n| Operations | Provide normalized document evidence for dashboards | Replace milestone or stock analytics |\n| Communication | Link approval email/chat evidence through audit record | Redefine communication classes |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#6",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "2.4 Evidence-only Rule",
    "text": "```text\nDocument/OCR output = Document + DocumentEntity + EvidenceAssertion + VerificationResult + AuditRecord\nOperational truth    = ShipmentUnit / CustomsEntry / ReleaseOrder / WarehouseTask / SiteReceipt / Invoice / CostGuardResult\nWrite guard          = Evidence can propose; approved Action can mutate.\n```",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#7",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "2.5 Legacy Migration Rules",
    "text": "| Legacy wording / pattern | Canonical replacement | Patch action |\n|---|---|---|\n| Document-derived warehouse route code | `routeEvidence`, `destinationEvidence`, `mosbLegIndicator` | Keep as evidence with confidence and provenance |\n| OCR assigns operational route | `RouteEvidenceAssertion` attached to `Document` | Route owner remains `ShipmentUnit` / approved action |\n| Document assigns warehouse handling class | storage/DG/OOG evidence only | WHP owner remains `CONSOLIDATED-02` |\n| MOSB captured as warehouse | `mosbLegIndicator = true`, `OffshoreStagingNode` evidence | Do not type MOSB as Warehouse |\n| Cost verdict from OCR alone | `InvoiceLineEvidence` + numeric check | Cost verdict owner remains `CONSOLIDATED-05` |\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#8",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "3.1 Ontology Layer Map",
    "text": "| Layer | Class / vocabulary | Purpose |\n|---|---|---|\n| Document | `Document`, `CommercialInvoiceDocument`, `PackingListDocument`, `BillOfLadingDocument`, `BOEDocument`, `DeliveryOrderDocument`, `PermitDocument`, `MRR`, `MRI`, `POD`, `GRN`, `OSDR` | Documentary evidence object |\n| OCR | `Page`, `ImageArtifact`, `OCRBlock`, `OCRToken`, `OCRCell`, `ExtractedTable` | Raw OCR/text/table extraction |\n| Semantic normalization | `DocumentEntity`, `NormalizedValue`, `UnitNormalization`, `CurrencyNormalization`, `DateNormalization` | Canonical field representation |\n| Evidence | `EvidenceAssertion`, `RouteEvidenceAssertion`, `ComplianceEvidenceAssertion`, `CostEvidenceAssertion` | Evidence-only assertions with provenance |\n| Linking | `Identifier`, `CrossDocLink`, `EntityMatch`, `SameAsCluster` | Any-key resolution and cross-doc relationship |\n| Validation | `VerificationResult`, `ValidationRun`, `ValidationRule`, `Discrepancy` | SHACL/SPARQL output |\n| Trust | `TrustLayer`, `ConfidenceScore`, `QualityMetric`, `ProofArtifact`, `AuditRecord` | Reliability and audit trail |\n| Human gate | `ReviewTask`, `ApprovalAction`, `OverrideDecision` | Manual review and controlled write-back |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#9",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "3.2 Document Types and Required Evidence",
    "text": "| Document Type | Required fields | Primary cross-check | Blocking rule |\n|---|---|---|---|\n| `CommercialInvoiceDocument` | `invoiceNo`, `vendor`, `currency`, `totalAmount`, `lineCount`, `incoterm` | CI total vs line total; CI qty/value vs PL/BOE | `NumericIntegrity != 1.00` blocks finance/customs automation |\n| `PackingListDocument` | `plNo`, `packageCount`, `grossWeightKg`, `volumeCbm`, `caseNo` | PL qty/weight/CBM vs CargoUnit and CI | package/weight mismatch blocks auto-link |\n| `BillOfLadingDocument` | `blNo`, `carrier`, `vesselVoyage`, `portOfLoading`, `portOfDischarge`, `containerNo` | BL vs Shipment/Container/PortCall | BL/container unresolved blocks shipment certainty |\n| `BOEDocument` | `boeNo`, `declarationDate`, `customsAuthority`, `hsCode`, `declaredValue` | Evidence for `CustomsEntry` | BOE cannot replace `CustomsEntry` transaction |\n| `DeliveryOrderDocument` | `doNo`, `releaseDate`, `terminal`, `releaseParty` | Evidence for `ReleaseOrder` and M92 | DO missing before M100 blocks gate-out evidence |\n| `PermitDocument` | `permitNo`, `authority`, `permitType`, `issueDate`, `expiryDate` | MOIAT/FANR/DCD/ADNOC controls | expired/missing permit blocks regulated move |\n| `MRR` / `MRI` | `receiptNo`, `inspectionNo`, `siteCode`, `receivedQty`, `condition` | Evidence for `SiteReceipt` / inspection | mismatch triggers OSDR/NCR review |\n| `POD` / `GRN` | `podNo`, `grnNo`, `acceptanceDate`, `acceptedQty` | Handover and closeout evidence | missing closure evidence blocks final status |\n| `OSDR` | `osdrNo`, `defectType`, `severity`, `claimRef` | Exception/claim evidence | severity HIGH/CRITICAL requires human-gate |\n| `PTW` / `FRA` / `MethodStatement` | `approvalNo`, `workScope`, `expiryDate`, `approverRole` | Heavy-lift/marine execution gate | expired approval blocks M117/M130 evidence |\n| `LashingPlan` / `StabilityReport` | `planNo`, `revision`, `engineerApproval` | Marine/OOG technical gate | missing approval blocks offshore movement evidence |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#10",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "3.3 Evidence Properties",
    "text": "| Property | Domain | Range | Ownership rule |\n|---|---|---|---|\n| `routeEvidence` | `Document` | string / SKOS concept | Evidence only; supports routing decision |\n| `destinationEvidence` | `Document` | site code string | Evidence only; normalized to MIR/SHU/AGI/DAS when possible |\n| `mosbLegIndicator` | `Document` | boolean | Evidence only; true when MOSB/offshore/LCT leg is explicit or inferable |\n| `routeEvidenceConfidence` | `Document` | decimal | 0.00–1.00 |\n| `storageRequirementEvidence` | `Document` | string / SKOS concept | Evidence only for WHP after M110 |\n| `dgEvidence` | `Document` | `DGEvidenceAssertion` | Evidence only for DCD/DG gate |\n| `oOGEvidence` | `Document` | `OOGEvidenceAssertion` | Evidence only for marine/OOG human-gate |\n| `complianceEvidence` | `Document` | `ComplianceEvidenceAssertion` | Evidence only for permit checks |\n| `costEvidence` | `Document` | `CostEvidenceAssertion` | Evidence only for CostGuard pipeline |\n| `extractedEntity` | `Document` | `DocumentEntity` | OCR extraction output |\n| `crossDocLink` | `DocumentEntity` | `CrossDocLink` | Semantic verification |\n| `verificationResult` | `Document` | `VerificationResult` | LDG result |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#11",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "3.4 Core Classes (TTL)",
    "text": "```turtle\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix ldg:  <http://samsung.com/project-logistics/document#> .\n@prefix sh:   <http://www.w3.org/ns/shacl#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n@prefix prov: <http://www.w3.org/ns/prov#> .\n@prefix dqv:  <http://www.w3.org/ns/dqv#> .\n\nhvdc:Document a owl:Class ;\n  rdfs:label \"Logistics Document\" .\n\nldg:Page a owl:Class ; rdfs:subClassOf prov:Entity .\nldg:OCRBlock a owl:Class ; rdfs:subClassOf prov:Entity .\nldg:OCRToken a owl:Class ; rdfs:subClassOf prov:Entity .\nldg:ExtractedTable a owl:Class ; rdfs:subClassOf prov:Entity .\nldg:DocumentEntity a owl:Class ; rdfs:subClassOf prov:Entity .\nldg:EvidenceAssertion a owl:Class ; rdfs:subClassOf prov:Entity .\nldg:RouteEvidenceAssertion a owl:Class ; rdfs:subClassOf ldg:EvidenceAssertion .\nldg:ComplianceEvidenceAssertion a owl:Class ; rdfs:subClassOf ldg:EvidenceAssertion .\nldg:CostEvidenceAssertion a owl:Class ; rdfs:subClassOf ldg:EvidenceAssertion .\nldg:CrossDocLink a owl:Class ; rdfs:subClassOf prov:Entity .\nldg:VerificationResult a owl:Class ; rdfs:subClassOf dqv:QualityMeasurement .\nldg:AuditRecord a owl:Class ; rdfs:subClassOf prov:Activity .\n\nhvdc:documentNo a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:string .\nhvdc:docType a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:string .\nhvdc:docHash a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:string .\nhvdc:issueDate a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:date .\nhvdc:sourceSystem a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:string .\nhvdc:ocrConfidence a owl:DatatypeProperty ; rdfs:domain hvdc:Document ; rdfs:range xsd:decimal .\n\nhvdc:routeEvidence a owl:DatatypeProperty ;\n  rdfs:domain hvdc:Document ;\n  rdfs:range xsd:string ;\n  rdfs:comment \"Evidence-only route phrase or normalized concept label extracted from document.\" .\n\nhvdc:destinationEvidence a owl:DatatypeProperty ;\n  rdfs:domain hvdc:Document ;\n  rdfs:range xsd:string ;\n  rdfs:comment \"Evidence-only site/destination value, e.g., MIR, SHU, AGI, DAS.\" .\n\nhvdc:mosbLegIndicator a owl:DatatypeProperty ;\n  rdfs:domain hvdc:Document ;\n  rdfs:range xsd:boolean ;\n  rdfs:comment \"Evidence-only indicator that document mentions or implies MOSB/offshore staging.\" .\n\nhvdc:routeEvidenceConfidence a owl:DatatypeProperty ;\n  rdfs:domain hvdc:Document ;\n  rdfs:range xsd:decimal .\n\nldg:hasPage a owl:ObjectProperty ; rdfs:domain hvdc:Document ; rdfs:range ldg:Page .\nldg:hasOCRBlock a owl:ObjectProperty ; rdfs:domain ldg:Page ; rdfs:range ldg:OCRBlock .\nldg:hasToken a owl:ObjectProperty ; rdfs:domain ldg:OCRBlock ; rdfs:range ldg:OCRToken .\nldg:hasExtractedTable a owl:ObjectProperty ; rdfs:domain hvdc:Document ; rdfs:range ldg:ExtractedTable .\nldg:hasDocumentEntity a owl:ObjectProperty ; rdfs:domain hvdc:Document ; rdfs:range ldg:DocumentEntity .\nldg:hasEvidenceAssertion a owl:ObjectProperty ; rdfs:domain hvdc:Document ; rdfs:range ldg:EvidenceAssertion .\nldg:hasVerificationResult a owl:ObjectProperty ; rdfs:domain hvdc:Document ; rdfs:range ldg:VerificationResult .\nldg:wasExtractedFrom a owl:ObjectProperty ; rdfs:domain ldg:DocumentEntity ; rdfs:range ldg:OCRToken .\n```",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#12",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "3.5 Core SHACL Rules",
    "text": "```turtle\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix ldg:  <http://samsung.com/project-logistics/document#> .\n@prefix sh:   <http://www.w3.org/ns/shacl#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n\nldg:DocumentBaseShape a sh:NodeShape ;\n  sh:targetClass hvdc:Document ;\n  sh:property [ sh:path hvdc:documentNo ; sh:minCount 1 ; sh:message \"Document must have documentNo.\" ] ;\n  sh:property [ sh:path hvdc:docType ; sh:minCount 1 ; sh:message \"Document must have docType.\" ] ;\n  sh:property [ sh:path hvdc:docHash ; sh:minCount 1 ; sh:message \"Document must have docHash.\" ] ;\n  sh:property [ sh:path hvdc:ocrConfidence ; sh:minInclusive 0.00 ; sh:maxInclusive 1.00 ; sh:message \"OCR confidence must be 0.00-1.00.\" ] .\n\nldg:RouteEvidenceShape a sh:NodeShape ;\n  sh:targetClass hvdc:Document ;\n  sh:property [ sh:path hvdc:routeEvidenceConfidence ; sh:minInclusive 0.00 ; sh:maxInclusive 1.00 ; sh:message \"routeEvidenceConfidence must be 0.00-1.00.\" ] ;\n  sh:sparql [\n    sh:message \"AGI/DAS document evidence must include MOSB/offshore evidence or be routed to human review.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:destinationEvidence ?dest .\n        FILTER(UCASE(STR(?dest)) IN (\"AGI\", \"DAS\"))\n        FILTER NOT EXISTS { $this hvdc:mosbLegIndicator true }\n      }\n    \"\"\" ;\n  ] .\n\nldg:EvidenceOwnershipGuardShape a sh:NodeShape ;\n  sh:targetClass hvdc:Document ;\n  sh:sparql [\n    sh:message \"Document/OCR must not assign warehouse handling class; keep evidence-only.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this ?p ?v .\n        FILTER(CONTAINS(LCASE(STR(?p)), \"confirmedflowcode\"))\n      }\n    \"\"\" ;\n  ] .\n\nldg:OCRKPIGateShape a sh:NodeShape ;\n  sh:targetClass ldg:VerificationResult ;\n  sh:sparql [\n    sh:severity sh:Violation ;\n    sh:message \"OCR KPI gate failed: MeanConf>=0.92, TableAcc>=0.98, NumericIntegrity=1.00, CrossDocumentConsistency=1.00 required.\" ;\n    sh:select \"\"\"\n      PREFIX ldg: <http://samsung.com/project-logistics/document#>\n      SELECT $this WHERE {\n        $this ldg:meanConf ?meanConf ;\n              ldg:tableAcc ?tableAcc ;\n              ldg:numericIntegrity ?numInt ;\n              ldg:crossDocumentConsistency ?crossDoc .\n        FILTER(?meanConf < 0.92 || ?tableAcc < 0.98 || ?numInt != 1.00 || ?crossDoc != 1.00)\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#13",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "3.6 Key Rules",
    "text": "1. **Document identity:** every document must have `documentNo`, `docType`, `docHash`, `sourceSystem`, and at least 1.00 source provenance record.\n2. **Evidence boundary:** `routeEvidence`, `destinationEvidence`, and `mosbLegIndicator` are evidence only; they cannot directly write `ShipmentUnit.hasRoutingPattern`.\n3. **Warehouse boundary:** `confirmedFlowCode` is blocked on all `Document` subjects; WHP classification belongs only to `WarehouseHandlingProfile` after M110/M111.\n4. **Numeric integrity:** `Σ(lineAmount) = invoiceTotal ± 2.00%` and `EA × Rate = Amount ± 0.01`; any breach blocks automated finance/customs action.\n5. **AGI/DAS gate:** `destinationEvidence IN (AGI,DAS)` requires MOSB/offshore evidence or human-gate review before downstream route acceptance.\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#14",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "4.1 LDG Pipeline",
    "text": "```text\nDocument intake\n  → file hash + source registry\n  → OCR text/table extraction\n  → semantic normalization\n  → entity tagging and identifier resolution\n  → cross-document verification\n  → SHACL/SPARQL validation\n  → TrustLayer / AuditRecord creation\n  → Foundry Object update request\n  → Human-gate / approved Action write-back when needed\n```",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#15",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "4.2 Source-System Integration Points",
    "text": "| Source / system | Input to LDG | Foundry object target | Write rule |\n|---|---|---|---|\n| ERP / procurement | PO, package, vendor, material, CI, PL | `PurchaseOrder`, `Package`, `MaterialMaster`, `Document` | LDG writes document evidence; ERP remains master for PO/material |\n| Carrier / forwarder | BL/AWB, container, vessel/voyage, ETA/ATA text | `BillOfLadingDocument`, `Container`, `JourneyLeg` evidence | LDG can propose link; carrier/ops event owns transport truth |\n| Customs / ATLP / eDAS | BOE, HS, origin, value, permit refs | `BOEDocument`, `CustomsEntry` evidence | `CustomsEntry` is not collapsed into BOE |\n| Port / OFCO | DO, release, terminal, rotation, service invoices | `DeliveryOrderDocument`, `PortCall`, `ReleaseOrder` evidence | Port domain owns service event and planned route evidence |\n| WMS | WH receipt docs, put-away labels, storage notes | `WarehouseTask`, `WarehouseHandlingProfile` evidence | WMS/WHP owner assigns warehouse class after M110/M111 |\n| Marine / MOSB | PTW, FRA, method statement, lashing/stability, LCT docs | `MarineEvent`, `OperationTask`, `PermitDocument` evidence | Marine domain owns offshore operation and approvals |\n| Invoice / cost | invoice header/lines, charge description, currency, amount | `Invoice`, `InvoiceLine`, `CostEvidenceAssertion` | Cost domain owns `RateRef` and CostGuard verdict |\n| Site / FMC | MRR, MRI, POD, GRN, OSDR | `SiteReceipt`, `InspectionEvent`, `Exception` evidence | Site domain owns receipt and exception transactions |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#16",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "4.3 Foundry Object Mapping",
    "text": "| LDG object | Foundry object / link | Cardinality | Notes |\n|---|---|---:|---|\n| `Document` | `Document` object | 1.00 file → 1.00 document object | hash-stable identity |\n| `DocumentEntity` | `Document` → `extractedEntity` | 1.00 document → many entities | field-level evidence |\n| `EvidenceAssertion` | `Document` → `supports` → operational object | many-to-many | no truth mutation |\n| `CrossDocLink` | `DocumentEntity` ↔ `DocumentEntity` | many-to-many | BL/CI/PL/BOE/DO consistency graph |\n| `VerificationResult` | `Document` → `validatedBy` | 1.00 validation run → many results | SHACL/SPARQL output |\n| `AuditRecord` | `ValidationRun` / `ApprovalAction` | many-to-one | proof trail |\n| `ReviewTask` | exception queue | conditional | triggered by ZERO/WARN/HIGH/CRITICAL |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#17",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "4.4 Event and Milestone Interface",
    "text": "| Milestone / stage | Required document evidence | LDG validation role |\n|---|---|---|\n| M40 Export Cleared | CI, PL, COO/FCO, export license where applicable | Export document completeness and identity link |\n| M50 Terminal Received | BL/AWB, carrier receipt, container evidence | Port/container linkage evidence |\n| M80 ATA | BL/AWB, arrival notice, port call | Arrival evidence confidence |\n| M90/M91 BOE Submitted/Cleared | BOE, HS, origin, value, permit evidence | Customs document consistency |\n| M92 DO Released | DO, release order evidence | DO before gate-out gate |\n| M100 Gate-out | DO, gate pass, permit/access evidence | Gate-out evidence gate |\n| M110 WH Received | receipt note, warehouse intake evidence | WHP evidence input only |\n| M115 MOSB Staged | MOSB/LCT/offshore staging evidence | AGI/DAS MOSB proof gate |\n| M117 Sail-away | lashing/stability/PTW/FRA/method statement | Marine approval evidence gate |\n| M130 Site Arrived | MRR/MRI/site delivery evidence | Site receipt evidence link |\n| M140 POD/GRN | POD, GRN, accepted qty | closeout evidence |\n| M160 Closed | claim/cost closeout docs | final audit completeness |\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#18",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "5.1 Validation Control Matrix",
    "text": "| Rule ID | Target | Logic | Severity |\n|---|---|---|---|\n| `D-IDENT-001` | `Document` | documentNo/docType/docHash/sourceSystem required | BLOCK |\n| `D-OCR-001` | `VerificationResult` | MeanConf ≥ 0.92 | WARN/BLOCK by doc criticality |\n| `D-TABLE-001` | `ExtractedTable` | TableAcc ≥ 0.98 for CI/PL/BOE/Invoice tables | BLOCK |\n| `D-NUM-001` | CI/Invoice | EA × Rate = Amount ± 0.01 | BLOCK |\n| `D-NUM-002` | CI/Invoice | Σ lineAmount = totalAmount ± 2.00% | BLOCK |\n| `D-QTY-001` | CI/PL/CargoUnit | package/qty/weight/CBM consistency | WARN/BLOCK |\n| `D-ROUTE-001` | `Document` | AGI/DAS destination requires MOSB/offshore evidence or review | BLOCK |\n| `D-WHP-001` | `Document` | document must not write warehouse handling class | BLOCK |\n| `D-CUSTOMS-001` | BOE | BOE document linked to CustomsEntry evidence only | BLOCK |\n| `D-RELEASE-001` | DO | DO evidence required before M100 gate-out | BLOCK |\n| `D-PERMIT-001` | Permit | authority/type/issueDate/expiryDate required | BLOCK |\n| `D-PII-001` | Contact/person fields | tel/email masked unless approved | BLOCK |\n| `D-HASH-001` | Document | file hash must match registry value | BLOCK |\n| `D-HG-001` | Human-gate | high-value, regulated, OCR-low-confidence, or exception docs require review | BLOCK |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#19",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "5.2 SPARQL — Cross-document Quantity / Weight Check",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nPREFIX ldg:  <http://samsung.com/project-logistics/document#>\n\nSELECT ?shipment ?ci ?pl ?ciQty ?plQty ?ciWeight ?plWeight ?verdict\nWHERE {\n  ?shipment hvdc:hasDocument ?ci, ?pl .\n  ?ci hvdc:docType \"CommercialInvoiceDocument\" ; ldg:packageQty ?ciQty ; ldg:grossWeightKg ?ciWeight .\n  ?pl hvdc:docType \"PackingListDocument\" ; ldg:packageQty ?plQty ; ldg:grossWeightKg ?plWeight .\n  BIND(IF(?ciQty = ?plQty && ABS(?ciWeight - ?plWeight) <= 0.01, \"PASS\", \"FAIL\") AS ?verdict)\n}\nORDER BY ?verdict ?shipment\n```",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#20",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "5.3 SPARQL — AGI/DAS MOSB Evidence Gap",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?document ?docNo ?dest ?routeEvidence ?confidence\nWHERE {\n  ?document a hvdc:Document ;\n            hvdc:documentNo ?docNo ;\n            hvdc:destinationEvidence ?dest .\n  OPTIONAL { ?document hvdc:routeEvidence ?routeEvidence . }\n  OPTIONAL { ?document hvdc:routeEvidenceConfidence ?confidence . }\n  FILTER(UCASE(STR(?dest)) IN (\"AGI\", \"DAS\"))\n  FILTER NOT EXISTS { ?document hvdc:mosbLegIndicator true }\n}\n```",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#21",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "5.4 SPARQL — Evidence Boundary Guard",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?document ?property ?value\nWHERE {\n  ?document a hvdc:Document ; ?property ?value .\n  FILTER(CONTAINS(LCASE(STR(?property)), \"confirmedflowcode\"))\n}\n```",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#22",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "5.5 SPARQL — Any-key Document Resolution",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nPREFIX ldg:  <http://samsung.com/project-logistics/document#>\n\nSELECT ?inputKey ?shipmentUnit ?document ?docType ?docNo ?confidence\nWHERE {\n  VALUES ?inputKey { \"BL_NO\" \"CONTAINER_NO\" \"INVOICE_NO\" \"DO_NO\" \"BOE_NO\" \"PO_NO\" \"HVDC_CODE\" }\n  ?identifier hvdc:identifierScheme ?inputKey ;\n              hvdc:identifierValue ?value .\n  ?shipmentUnit hvdc:hasIdentifier ?identifier ;\n                hvdc:hasDocument ?document .\n  ?document hvdc:docType ?docType ;\n            hvdc:documentNo ?docNo ;\n            hvdc:ocrConfidence ?confidence .\n}\nORDER BY ?shipmentUnit ?docType\n```",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#23",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "5.6 RAG Check Policy",
    "text": "| RAG check | Trigger | Required action |\n|---|---|---|\n| `RegulatoryRAG` | MOIAT/FANR/DCD/ADNOC permit rule, HS classification, controlled item keywords | Retrieve current approved SOP/authority evidence before automated release |\n| `RateRAG` | invoice line requires rate interpretation | Retrieve current contract/RateRef in `CONSOLIDATED-05`; LDG only supplies evidence |\n| `RouteRAG` | AGI/DAS, MOSB, LCT, offshore terms detected | Retrieve current routing plan / marine approval / port evidence |\n| `DocumentTemplateRAG` | new vendor template or unseen table layout | compare to approved document template library and route to reviewer if unknown |\n| `ExceptionRAG` | OSDR/NCR/damage/shortage keyword detected | retrieve claim SOP and linked inspection evidence |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#24",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "5.7 Human-gate Policy",
    "text": "| Condition | Human role | Output |\n|---|---|---|\n| `totalAmount > 100,000.00 AED` or equivalent source-currency threshold | Cost / finance reviewer | `ApprovalAction` before cost automation |\n| `MeanConf < 0.92` or `TableAcc < 0.98` | Document controller | corrected extraction or ZERO hold |\n| `NumericIntegrity != 1.00` | Finance / document controller | discrepancy record |\n| AGI/DAS document lacks MOSB/offshore evidence | Logistics / marine reviewer | route evidence acceptance or exception |\n| regulated product / DG / FANR / DCD keywords detected | Compliance owner | permit verification |\n| OOG/heavy-lift/lashing/stability/PTW terms detected | Marine / HSE engineer | technical gate acceptance |\n| OSDR/NCR/damage/shortage detected | QA/QC + claim owner | exception and claim linkage |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#25",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "5.8 ZERO Fail-safe Table",
    "text": "| 단계 | 이유 | 위험 | 요청데이터 | 다음조치 |\n|---|---|---|---|---|\n| Document intake | docHash/sourceSystem missing | evidence spoofing / duplicate object | source file, registry hash | block ingestion |\n| OCR extraction | confidence below threshold | incorrect value propagation | source image, corrected field | human review |\n| Table parsing | table accuracy below threshold | amount/qty mismatch | extracted table, original page | table re-extraction |\n| Cross-doc validation | CI/PL/BL/BOE mismatch | customs hold / wrong shipment link | matching document set | discrepancy resolution |\n| Compliance | permit expired/missing | regulatory breach | valid permit/SOP evidence | compliance approval |\n| Route evidence | AGI/DAS lacks MOSB evidence | offshore delivery blocker | MOSB/LCT/route plan evidence | marine/logistics review |\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#26",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "6.1 Compliance Object Handling",
    "text": "| Compliance object | Document evidence | LDG action | Owner |\n|---|---|---|---|\n| `IncotermTerm` | CI/PO incoterm and delivery place | extract and cross-check with invoice responsibility | Core / Cost |\n| `MOIATRequirement` | certificate/ref/expiry, regulated product hint | create compliance evidence assertion | Compliance owner |\n| `FANRRequirement` | radiation/nuclear/source terms, permit ref | trigger human-gate | Compliance owner |\n| `DCDDangerousGoodsRequirement` | DG class, UN No., MSDS, storage segregation | trigger DG evidence and WH/HSE gate | HSE / WH |\n| `ADNOC/CICPA/SiteAccess` | gate pass, access permit, security approval | validate expiry before M100/M130 evidence | Site / security |\n| `WCO/HSClassification` | HS code, origin, value, material description | flag low confidence or mismatch | Customs owner |\n| `Marine/HSEApproval` | PTW, FRA, method statement, lashing/stability | evidence gate for M117/M130 | Marine / HSE |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#27",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "6.2 Non-collapse Compliance Rules",
    "text": "1. `BOEDocument` is evidence for `CustomsEntry`; it is not the `CustomsEntry` transaction.\n2. `DeliveryOrderDocument` is evidence for `ReleaseOrder`; it is not the `ReleaseOrder` transaction.\n3. `MRR`, `MRI`, `POD`, `GRN`, and `OSDR` are site/inspection/closeout evidence; they do not replace `SiteReceipt`, `InspectionEvent`, or `Exception` objects.\n4. Permit files prove compliance status but do not approve movement unless a valid `ApprovalAction` exists.\n5. Communication evidence is linked through `AuditRecord` / `ApprovalAction`, not by redefining logistics objects.",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#28",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "6.3 Document Requirements by Operational Stage",
    "text": "| Stage | Required document evidence | Minimum validation |\n|---|---|---|\n| Export origin | CI, PL, COO/FCO, export license where applicable | documentNo/hash/shipper/consignee/qty/weight |\n| Import UAE | BOE, HS, origin/value, regulated-item permit where applicable | HS/value/permit consistency |\n| Port release | DO, release confirmation, terminal evidence | releaseDate, terminal, shipment/container link |\n| Inland/WH | gate pass, receipt note, storage notes, MSDS if DG | M100/M110 evidence and WHP input only |\n| MOSB/marine | PTW, FRA, method statement, LCT/loading/lashing/stability evidence | approval validity and M115/M117 support |\n| Site receiving | MRR, MRI, POD, GRN, OSDR where applicable | siteCode, receivedQty, condition, acceptanceDate |\n| Closeout | final cost, claim, NCR/OSDR closure documents | proof artifact and audit completeness |\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#29",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "7. Options ≥3 (Pros/Cons/Cost/Risk/Time)",
    "text": "| Option | Description | Pros | Cons | Cost estimate | Risk | Time |\n|---|---|---|---|---:|---|---:|\n| A. Baseline LDG Evidence Layer | OCR + JSON-LD payload + SHACL gates for CI/PL/BL/BOE/DO | fastest rollout; strong document traceability | limited real-time action control | 35,000.00 AED | Medium | 2.00 weeks |\n| B. Hybrid Foundry Object + KG | Foundry Objects/Links + RDF export + SPARQL validation | best balance; operational dashboard ready | requires object/action governance | 85,000.00 AED | Medium | 4.00 weeks |\n| C. Real-time Semantic Digital Twin | streaming OCR evidence, action gates, RAG checks, human-gate queues | highest automation and auditability | highest integration complexity | 160,000.00 AED | High | 8.00 weeks |\n| D. Compliance-first Variant | permit/HS/DG/FANR/MOIAT gate before route/cost automation | lowers regulatory risk | slower operational throughput | 70,000.00 AED | Low | 3.00 weeks |\n\n**Recommendation:** Option B for first production deployment. It preserves evidence-only semantics, integrates with Foundry objects, and keeps cost/customs/warehouse ownership boundaries intact.\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#30",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "8. Roadmap (Prepare→Pilot→Build→Operate→Scale + KPI)",
    "text": "| Phase | Duration | Deliverables | KPI gate |\n|---|---:|---|---|\n| Prepare | 1.00 week | document type registry, JSON-LD context, SHACL baseline, identifier dictionary | DocumentTypeCoverage ≥ 90.00% |\n| Pilot | 2.00 weeks | CI/PL/BL/BOE/DO sample run, Any-key linking, cross-doc discrepancy report | MeanConf ≥ 0.92; NumericIntegrity = 1.00 |\n| Build | 3.00 weeks | Foundry Object/Link mapping, SPARQL rules, review queue, audit payload | CrossDocumentConsistency = 1.00 |\n| Operate | continuous | daily LDG run, exception triage, KPI dashboard, human-gate SLA | Validation p95 < 5.00s; Review SLA ≤ 24.00h |\n| Scale | continuous | Permit/RAG, marine docs, site closeout docs, CostGuard handoff | EvidenceCompleteness ≥ 98.00% |\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#31",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "9.1 Automation Architecture",
    "text": "| Automation | Trigger | Action | Guard |\n|---|---|---|---|\n| `LDGIngestBot` | new file in document store | create `Document` + hash + sourceSystem | duplicate hash blocker |\n| `OCRTableBot` | document accepted | extract token/table/cell evidence | MeanConf/TableAcc gate |\n| `EntityLinker` | extracted entities available | create identifiers and cross-doc links | Any-key conflict review |\n| `RouteEvidenceBot` | destination/route/MOSB terms detected | create route evidence assertion | evidence-only; no route truth write |\n| `PermitGuard` | regulated/DG/FANR/MOIAT terms detected | create compliance review task | current SOP/RAG required |\n| `NumericGuard` | invoice/CI table parsed | check EA×Rate and Σ totals | block if NumericIntegrity != 1.00 |\n| `WHPBoundaryGuard` | any document tries warehouse class write | block and create violation | WHP owner only |\n| `CostEvidenceHandoff` | invoice evidence validated | pass clean evidence to CostGuard | cost verdict remains Cost domain |\n| `TelegramDigest` | daily 08:00 Asia/Dubai | send mismatch/hold summary | PII masked |\n| `SheetsExport` | reviewer requests export | export discrepancy matrix | source hash included |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#32",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "9.2 LDG_AUDIT Payload Skeleton",
    "text": "```json\n{\n  \"auditId\": \"LDG-AUDIT-{documentNo}-{runId}\",\n  \"runDate\": \"2026-04-27\",\n  \"timezone\": \"Asia/Dubai\",\n  \"document\": {\n    \"documentNo\": \"string\",\n    \"docType\": \"CommercialInvoiceDocument\",\n    \"docHash\": \"sha256:string\",\n    \"sourceSystem\": \"ERP|Carrier|ATLP|WMS|Port|Site|Manual\"\n  },\n  \"metrics\": {\n    \"meanConf\": 0.92,\n    \"tableAcc\": 0.98,\n    \"numericIntegrity\": 1.00,\n    \"crossDocumentConsistency\": 1.00,\n    \"routeEvidenceAccuracy\": 0.95\n  },\n  \"evidence\": {\n    \"routeEvidence\": \"string\",\n    \"destinationEvidence\": \"AGI|DAS|MIR|SHU|UNKNOWN\",\n    \"mosbLegIndicator\": true,\n    \"complianceEvidence\": [\"permitRef\", \"hsCode\", \"dgClass\"],\n    \"costEvidence\": [\"currency\", \"totalAmount\", \"lineCount\"]\n  },\n  \"verdict\": \"PASS|WARN|FAIL|ZERO\",\n  \"humanGateRequired\": false,\n  \"proofArtifact\": {\n    \"ruleIds\": [\"D-IDENT-001\", \"D-OCR-001\"],\n    \"reviewer\": null,\n    \"timestamp\": \"2026-04-27T00:00:00+04:00\"\n  }\n}\n```\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#33",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "10.1 QA Checklist",
    "text": "| Check | PASS criteria |\n|---|---|\n| Master spine alignment | `CONSOLIDATED-00` object boundaries preserved |\n| Evidence-only discipline | LDG writes evidence, verification, audit only |\n| Route separation | Route truth uses `ShipmentUnit.hasRoutingPattern`, not document-owned route status |\n| WHP boundary | `confirmedFlowCode` appears only as blocked/guarded WHP concept; never as document property |\n| MOSB classification | MOSB evidence maps to `OffshoreStagingNode` / `MarineInterfaceNode`, not Warehouse |\n| Document type coverage | CI/PL/BL/BOE/DO/Permit/MRR/MRI/POD/GRN/OSDR modeled |\n| Non-collapse rule | BOE/DO/MRR/POD/GRN/OSDR remain evidence, not transaction objects |\n| Numeric integrity | EA×Rate and invoice total rules defined |\n| KPI gates | MeanConf, TableAcc, NumericIntegrity, CrossDocumentConsistency gates defined |\n| Compliance | Incoterms/MOIAT/FANR/DCD/ADNOC evidence controls included |\n| PII handling | contact details masked in audit/export outputs unless approved |\n| Human-gate | high-value, regulated, low-confidence, and exception cases routed to review |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#34",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "10.2 Assumptions(가정:)",
    "text": "- `ShipmentUnit` is the operational anchor for document linkage.\n- LDG can propose evidence and discrepancies, but approved Foundry Actions are required to mutate operational truth.\n- OCR engines and table parsers produce token/cell-level confidence and bounding boxes.\n- Project-specific permit rules, authority forms, and rate tables require current approved SOP or contract evidence before automation.\n- Currency conversion, if required, is performed downstream under `CONSOLIDATED-05`; LDG preserves original currency and values.\n- PII in person/contact evidence is masked in all routine audit exports.\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#35",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "11.1 Parallel Review Lanes",
    "text": "| Pass | Review lane | Corpus checked | Finding | Patch applied | Status |\n|---:|---|---|---|---|---|\n| 1.00 | Master spine | `CONSOLIDATED-00`, `AGENTS.md`, review note | Document layer must be evidence-only and cannot override master route/WHP ownership | Rewrote governance, non-collapse, evidence boundary | PASS |\n| 2.00 | Warehouse boundary | `CONSOLIDATED-02`, `CONSOLIDATED-06` | WHP classification starts at M110/M111; OCR may only provide storage/DG/OOG evidence | Added WHPBoundaryGuard and blocked document-level warehouse class writes | PASS |\n| 3.00 | Route/marine/port/cost boundary | `CONSOLIDATED-04`, `05`, `07`, `09` | Port/marine/cost/ops consume evidence but own their own truth objects | Replaced legacy route-code wording with `routeEvidence` and `RoutingPattern` handoff | PASS |\n| 4.00 | Validation/compliance | `CONSOLIDATED-01`, `05`, `06`, `07` | Need permit, HS, DO, BOE, AGI/DAS MOSB, numeric gate controls | Added SHACL/SPARQL/RAG/human-gate matrix | PASS |\n| 5.00 | Artifact hygiene | full md corpus + PDF architecture | Need final document in v2.0-frontmatter with 5 validation passes and no canonical legacy leakage | Added `validation_passes: 5`, checked_against list, final QA checklist | PASS |",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#36",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "11.2 Final Patch Summary",
    "text": "- `sub-domains` updated from legacy route-code framing to `route-evidence`, `compliance-evidence`, and `cost-evidence`.\n- `extension_of` updated to `hvdc-master-ontology-v2.0-final`.\n- Document evidence properties aligned to master: `routeEvidence`, `destinationEvidence`, `mosbLegIndicator`, `routeEvidenceConfidence`.\n- `routeEvidence` range corrected to string / SKOS concept instead of numeric route code.\n- Added `EvidenceOwnershipGuardShape` to block document-level warehouse class writes.\n- Added AGI/DAS MOSB evidence check and human-gate logic.\n- Preserved LDG/OCR classes while collapsing duplicate property blocks into a controlled schema.\n- Added Foundry integration, CostGuard handoff, compliance gate, and ZERO fail-safe.\n\n---",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-03-document-ocr#37",
    "docId": "CONSOLIDATED-03-document-ocr",
    "title": "hvdc-document-ocr · CONSOLIDATED-03",
    "version": "2.0-final",
    "sectionPath": "12. CmdRec",
    "text": "- `/switch_mode LATTICE + /logi-master document-guardian --deep --trust-validation` — LDG/OCR 문서 신뢰 검증 실행\n- `/logi-master cert-chk --deep --KRsummary` — MOIAT/FANR/DCD/ADNOC permit evidence 점검\n- `/logi-master invoice-audit --AEDonly` — LDG invoice evidence를 CostGuard로 전달하여 라인별 Δ% 검증",
    "docHash": "7a56eaedfdfa47152ec2b5f538607929ad0945e20099c34f9b068d041369d87c",
    "domains": [
      "document"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#1",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Marine, Barge & Bulk Cargo Ontology — Consolidated\"\ntype: \"ontology-design\"\ndomain: \"marine-barge-bulk-operations\"\nsub-domains:\n  - marine-operations\n  - barge-lct-operations\n  - bulk-cargo-operations\n  - oog-heavy-lift\n  - stowage-and-seafastening\n  - stability-control\n  - lifting-and-rigging\n  - mosb-offshore-staging\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\nextension_of: \"hvdc-master-ontology-v2.0-final\"\ncanonical_role: \"marine, bulk, OOG, lashing, stability, LCT/barge execution extension\"\nowner: \"HVDC Logistics Ontology Working Set\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\n  - IMSBC-Code\n  - SOLAS\n  - IMDG-Code\n  - BIMCO-SUPPLYTIME-2017\nsource_files:\n  - 1_CORE-05-hvdc-bulk-cargo-ops.md\nchecked_against:\n  - CONSOLIDATED-00-master-ontology.md\n  - CONSOLIDATED-01-core-framework-infra.md\n  - CONSOLIDATED-02-warehouse-flow.md\n  - CONSOLIDATED-03-document-ocr.md\n  - CONSOLIDATED-05-invoice-cost.md\n  - CONSOLIDATED-06-material-handling.md\n  - CONSOLIDATED-07-port-operations.md\n  - CONSOLIDATED-09-operations.md\n  - AGENTS.md\n  - HVDC Logistics Ontology Review.txt\nvalidation_passes: 5\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#2",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "1. ExecSummary",
    "text": "`CONSOLIDATED-04`는 HVDC Logistics KG의 **marine / barge / bulk / OOG execution extension**이다. 본 문서는 MOSB staging, LCT/barge loading, seafastening, stability, lifting, discharge, marine handover를 `ShipmentUnit`, `CargoUnit`, `MarineOperation`, `MarineEvent`, `OperationTask`, `StowagePlan`, `LashingPlan`, `StabilityCase`, `LiftingPlan`으로 정규화한다.\n\n비즈니스 임팩트는 **AGI/DAS offshore delivery의 M115→M116→M117→M130 traceability**, **deck pressure / stability / lashing / rigging gate의 사전 차단**, **LCT utilization 및 MOSB dwell risk의 가시화**, **marine document evidence 기반 승인 추적**이다.\n\n기술 해법은 `MarineRoutingPattern`과 `offshoreDeliveryPattern`을 marine leg 전용 분류로 사용하고, end-to-end route는 `ShipmentRoutingPattern`, 실행 상태는 `MilestoneEvent`, warehouse 내부 처리는 `WarehouseHandlingProfile`로 분리하는 것이다.\n\nKPI 목표는 `MarinePlanCoverage ≥ 95.00%`, `DeckPressurePassRate = 100.00%`, `StabilityGatePassRate = 100.00%`, `LashingEvidenceCompleteness ≥ 98.00%`, `LCTUtilization = 80.00–85.00%`, `Validation p95 < 5.00s`이다.\n\n**ENG-KR one-liner:** Marine execution owns MOSB staging, LCT/barge events, stowage, lashing, stability, and lifting controls; route truth remains in `RoutingPattern`, and warehouse handling remains in `WarehouseHandlingProfile` only.\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#3",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "2.1 Master Governance Rule",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.\n2. `CONSOLIDATED-04` owns **marine / barge / bulk / OOG execution semantics** only.\n3. Program-wide shipment visibility uses `RoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`.\n4. Marine leg classification uses `MarineRoutingPattern` and `offshoreDeliveryPattern`.\n5. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`; it is not a top-level `Warehouse`.\n6. Warehouse handling classification is owned only by `WarehouseHandlingProfile.confirmedFlowCode` in `CONSOLIDATED-02`.\n7. Documents, port records, costs, and communications provide evidence; they do not own marine execution truth.\n8. Engineering approval remains human-gated. This ontology validates data readiness and consistency; it does not replace MWS, marine warranty, naval architecture, lifting engineer, HSE, port authority, or client approval.",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#4",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "2.2 Included vs Delegated Scope",
    "text": "| Scope item | Included in CONSOLIDATED-04 | Delegated / excluded |\n|---|---|---|\n| MOSB staging | M115, laydown, consolidation, marine readiness, staging inspection | Warehouse put-away and stock ownership in `CONSOLIDATED-02` |\n| LCT / barge execution | M116 loaded, barge trip, ATD/ETA/ATA, sail-away approval M117 | Port entry / customs release in `CONSOLIDATED-07` / `CONSOLIDATED-06` |\n| Bulk cargo | Aggregate, sand, soil, rock, steel bundle, pipe bundle, precast, jumbo bags | Commercial invoice audit in `CONSOLIDATED-05` |\n| OOG / heavy lift | Transformer, cable drum, pre-assembled module, A-frame, PC beam/column | Supplier manufacturing readiness in ERP / procurement |\n| Stowage | deck slot, COG, footprint, deck pressure, sequence | CAD/BIM geometry as external engineering evidence |\n| Seafastening / lashing | lashing assembly, WLL, angle, count, safety factor, inspection | Final engineering calculation approval |\n| Stability | displacement, GM, VCG, trim, list, loading condition, weather gate | Naval architecture final approval |\n| Lifting / rigging | lifting plan, rigging gear, sling angle, crane/Hiab/SPMT interface | Final lifting engineer approval |\n| Marine permits | PTW, JSA/TRA, hot work, working-over-water, port/marine clearance | Authority approval system of record |\n| Evidence | load plan, lashing plan, stability report, rigging plan, inspection photo, survey report | OCR extraction internals in `CONSOLIDATED-03` |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#5",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "2.3 Domain Boundary Crosswalk",
    "text": "| Domain | Allowed interface with marine/bulk | Not allowed in CONSOLIDATED-04 |\n|---|---|---|\n| Core master | Read/write `MarineEvent`, `OperationTask`, `JourneyLeg`, `MilestoneEvent` links | Redefine `ShipmentRoutingPattern` dictionary |\n| Infrastructure | Read `Port`, `Berth`, `Jetty`, `OffshoreStagingNode`, `Site`, `TransportCorridor` | Type MOSB as top-level `Warehouse` |\n| Warehouse | Read WH dispatch evidence M121 and storage constraints | Assign or interpret warehouse handling class |\n| Document/OCR | Consume `routeEvidence`, `destinationEvidence`, `mosbLegIndicator`, plan documents | Treat OCR output as engineering approval |\n| Port | Consume `plannedRoutingPattern`, berth, gate, port service evidence | Assign marine execution status from port invoice alone |\n| Material handling | Provide M115/M116/M117/M130 milestone continuity | Collapse site receipt into marine discharge |\n| Cost | Export marine charge evidence and LCT utilization | Own cost bands or CostGuard verdict |\n| Operations/KPI | Export marine event, LCT, MOSB dwell, safety gate KPIs | Replace routing analytics with marine-only vocabulary |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#6",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "2.4 Legacy Migration Rules",
    "text": "| Legacy wording / pattern | Canonical replacement | Patch action |\n|---|---|---|\n| Marine domain using warehouse handling class language | `MarineRoutingPattern` and `offshoreDeliveryPattern` | Replace in all marine tables and SHACL |\n| Port→WH→MOSB→Site described as marine class | `ShipmentRoutingPattern` for E2E, `MarineRoutingPattern` for MOSB/LCT leg | Separate routing layers |\n| MOSB treated as warehouse | `OffshoreStagingNode` with optional `LaydownArea` / `StorageCapability` | Preserve staging function only |\n| Direct cost implication from marine class | `MarineChargeEvidence`, `LCTTrip`, `MarineServiceEvent` | Cost domain calculates audit result |\n| Document-derived marine approval | `DocumentEvidence` + `ApprovalAction` | Human-gate for MWS / stability / lifting |\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#7",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "3.1 Marine Ontology Layer",
    "text": "| Layer | Class / vocabulary | Purpose |\n|---|---|---|\n| Core cargo | `CargoUnit`, `BulkCargoUnit`, `OOGCargoUnit`, `HeavyLiftCargoUnit` | Marine-handled cargo object |\n| Marine operation | `MarineOperation`, `BargeOperation`, `LCTOperation`, `BulkCargoOperation` | Marine execution transaction |\n| Event | `MarineEvent`, `MOSBStagedEvent`, `LCTLoadedEvent`, `SailAwayEvent`, `OffshoreDischargeEvent` | Time-stamped execution evidence |\n| Stowage | `StowagePlan`, `DeckArea`, `DeckSlot`, `StowagePosition` | Deck layout and pressure control |\n| Seafastening | `LashingPlan`, `LashingAssembly`, `LashingElement`, `SeafasteningInspection` | Sea transport securing control |\n| Stability | `StabilityCase`, `LoadingCondition`, `BallastCondition`, `HydrostaticLimit` | Barge/LCT stability gate |\n| Lifting | `LiftingPlan`, `LiftOperation`, `RiggingGear`, `CraneResource`, `SPMTResource` | Load handling gate |\n| Environment | `MarineWeatherWindow`, `SeaStateObservation`, `TideWindow` | Weather / tide feasibility gate |\n| Resource | `MarineAsset`, `Barge`, `LCT`, `Crew`, `EquipmentResource` | Vessel, crew, equipment allocation |\n| Compliance | `MarinePermit`, `PTW`, `JSA`, `TRA`, `MWSApproval`, `HSEApproval` | Approval and permit evidence |\n| Evidence | `MarineDocument`, `SurveyReport`, `InspectionPhoto`, `AuditRecord` | Provenance and validation proof |\n| KPI | `MarineKPI`, `LCTUtilizationMetric`, `MOSBDwellMetric`, `DeckPressureMetric` | Operational monitoring |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#8",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "3.2 Core Classes",
    "text": "| Class | Required properties | Key relations | Notes |\n|---|---|---|---|\n| `MarineOperation` | `operationId`, `operationType`, `operationStatus`, `plannedStart`, `actualStart`, `actualEnd` | `forShipmentUnit`, `hasMarineEvent`, `usesMarineAsset`, `requiresApproval` | Parent marine transaction |\n| `BargeOperation` | `bargeOperationId`, `bargeName`, `voyageNo`, `marineRoutingPattern` | `subClassOf MarineOperation`, `hasStowagePlan`, `hasStabilityCase` | Generic barge movement |\n| `LCTOperation` | `lctOperationId`, `lctName`, `wellsId`, `musNo`, `departureNode`, `arrivalNode` | `subClassOf BargeOperation`, `hasLCTTrip` | AGI/DAS LCT leg |\n| `BulkCargoUnit` | `cargoId`, `bulkCategory`, `qty`, `uom`, `weightMt`, `volumeCbm` | `belongsTo ShipmentUnit`, `allocatedTo DeckSlot` | Aggregate/sand/soil/bulk cargo |\n| `OOGCargoUnit` | `cargoId`, `lengthM`, `widthM`, `heightM`, `grossWeightMt`, `cogX`, `cogY`, `cogZ` | `requiresLiftingPlan`, `requiresLashingPlan` | OOG/heavy project cargo |\n| `DeckArea` | `deckAreaId`, `usableLengthM`, `usableWidthM`, `maxUniformLoadTpm2`, `maxPointLoadT` | `partOf MarineAsset`, `containsDeckSlot` | LCT/barge deck capacity |\n| `DeckSlot` | `slotId`, `xM`, `yM`, `lengthM`, `widthM`, `allowablePressureTpm2` | `partOf DeckArea`, `occupiedBy CargoUnit` | Stowage position |\n| `StowagePlan` | `planId`, `planVersion`, `approvalStatus`, `totalWeightMt`, `maxDeckPressureTpm2` | `forMarineOperation`, `hasStowagePosition`, `approvedBy` | Load plan control object |\n| `LashingPlan` | `planId`, `calcMethod`, `approvalStatus`, `safetyFactorMin` | `secures CargoUnit`, `hasLashingAssembly`, `verifiedBy` | Seafastening control |\n| `LashingAssembly` | `assemblyId`, `requiredCapacityT`, `calculatedTensionT`, `safetyFactor` | `uses LashingElement`, `appliedTo CargoUnit` | Per-cargo lashing proof |\n| `LashingElement` | `elementId`, `elementType`, `wllT`, `angleDeg`, `count` | `partOf LashingAssembly` | Chain, belt, wire, shackle, turnbuckle |\n| `StabilityCase` | `caseId`, `loadingCondition`, `displacementMt`, `gmM`, `vcgM`, `trimM`, `listDeg` | `evaluates MarineAsset`, `considers StowagePlan`, `approvedBy` | Stability gate |\n| `LiftingPlan` | `liftId`, `liftMethod`, `grossLiftWeightMt`, `slingAngleDeg`, `approvalStatus` | `for CargoUnit`, `uses RiggingGear`, `uses EquipmentResource` | Lift / LOLO / RORO interface |\n| `MarineWeatherWindow` | `windowId`, `startTime`, `endTime`, `maxWindKn`, `maxSeaState`, `visibilityNm` | `appliesTo MarineOperation`, `verifiedBy` | Weather feasibility |\n| `MarinePermit` | `permitId`, `permitType`, `issuer`, `validFrom`, `validTo`, `status` | `requiredFor MarineOperation`, `evidencedByDocument` | PTW, JSA, TRA, marine clearance |\n| `MarineDocument` | `docId`, `docType`, `docVersion`, `docHash`, `approvalStatus` | `evidences MarineOperation`, `wasDerivedFrom` | Plan/report/proof artifact |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#9",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "3.3 Controlled Vocabularies",
    "text": "| Vocabulary | Values | Owner |\n|---|---|---|\n| `MarineRoutingPattern` | `DIRECT_MOSB`, `WH_THEN_MOSB`, `LCT_DIRECT`, `OFFSHORE_PENDING`, `SPLIT_MARINE_LEG`, `EXCEPTIONAL_HEAVY_LIFT` | `CONSOLIDATED-04` |\n| `OffshoreDeliveryPattern` | `MOSB_TO_AGI`, `MOSB_TO_DAS`, `PORT_TO_MOSB`, `WH_TO_MOSB`, `BARGE_SHUTTLE`, `PENDING_ASSIGNMENT` | `CONSOLIDATED-04` |\n| `MarineOperationStatus` | `PLANNED`, `READY`, `PERMIT_PENDING`, `APPROVED`, `LOADING`, `SAIL_AWAY_APPROVED`, `IN_TRANSIT`, `DISCHARGING`, `COMPLETED`, `BLOCKED`, `CANCELLED` | `CONSOLIDATED-04` |\n| `CargoMarineCategory` | `BULK_AGGREGATE`, `BULK_SAND`, `BULK_SOIL`, `STEEL_STRUCTURE`, `PIPE_BUNDLE`, `PRECAST_UNIT`, `JUMBO_BAG`, `TRANSFORMER`, `CABLE_DRUM`, `A_FRAME`, `MIXED_PROJECT_CARGO` | `CONSOLIDATED-04` |\n| `StowageApprovalStatus` | `DRAFT`, `CHECKED`, `APPROVED`, `REJECTED`, `SUPERSEDED` | `CONSOLIDATED-04` |\n| `LashingApprovalStatus` | `DRAFT`, `CALCULATED`, `ENGINEER_REVIEWED`, `APPROVED`, `FIELD_VERIFIED`, `REJECTED` | `CONSOLIDATED-04` |\n| `StabilityGateStatus` | `NOT_STARTED`, `DATA_MISSING`, `CALCULATED`, `PASS`, `FAIL`, `APPROVED_WITH_CONDITION` | `CONSOLIDATED-04` |\n| `WeatherGateStatus` | `OPEN`, `WATCH`, `HOLD`, `CLOSED`, `OVERRIDE_APPROVED` | `CONSOLIDATED-04` |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#10",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "3.4 Object Property Map",
    "text": "| Object property | Domain → Range | Meaning |\n|---|---|---|\n| `marine:forShipmentUnit` | `MarineOperation → ShipmentUnit` | Marine operation belongs to shipment unit |\n| `marine:hasMarineRoutingPattern` | `MarineOperation → MarineRoutingPattern` | Marine leg classification |\n| `marine:hasOffshoreDeliveryPattern` | `MarineOperation → OffshoreDeliveryPattern` | Offshore delivery path |\n| `marine:usesMarineAsset` | `MarineOperation → MarineAsset` | LCT/barge/vessel allocation |\n| `marine:usesDeckArea` | `StowagePlan → DeckArea` | Deck capacity context |\n| `marine:positionsCargo` | `StowagePlan → CargoUnit` | Cargo included in stowage plan |\n| `marine:securedBy` | `CargoUnit → LashingAssembly` | Cargo seafastening relation |\n| `marine:evaluatedBy` | `MarineOperation → StabilityCase` | Stability proof |\n| `marine:liftedBy` | `CargoUnit → LiftOperation` | Lift execution link |\n| `marine:requiresPermit` | `MarineOperation → MarinePermit` | Permit gate |\n| `marine:evidencedBy` | `MarineOperation → MarineDocument` | Evidence trace |\n| `marine:generatesMilestone` | `MarineEvent → MilestoneEvent` | M115/M116/M117/M130 linkage |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#11",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "3.5 Datatype Property Map",
    "text": "| Datatype property | Domain | Range / rule |\n|---|---|---|\n| `marine:grossWeightMt` | `CargoUnit` | `xsd:decimal`, `> 0.00` |\n| `marine:lengthM`, `marine:widthM`, `marine:heightM` | `CargoUnit` | `xsd:decimal`, `> 0.00` |\n| `marine:cogXM`, `marine:cogYM`, `marine:cogZM` | `CargoUnit` | `xsd:decimal`, required for OOG/heavy lift |\n| `marine:footprintSqm` | `CargoUnit` | `lengthM × widthM` |\n| `marine:deckPressureTpm2` | `DeckSlot` / `StowagePosition` | `grossWeightMt / footprintSqm` |\n| `marine:maxUniformLoadTpm2` | `DeckArea` | deck limit |\n| `marine:gmM` | `StabilityCase` | `xsd:decimal`, project-defined minimum gate |\n| `marine:listDeg`, `marine:trimM` | `StabilityCase` | project-defined limit |\n| `marine:wllT` | `LashingElement` | working load limit |\n| `marine:safetyFactor` | `LashingAssembly` | must be `>= requiredSafetyFactor` |\n| `marine:maxWindKn`, `marine:maxSeaState` | `MarineWeatherWindow` | weather gate |\n| `marine:approvalStatus` | plan/document classes | controlled vocabulary |\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#12",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "4.1 Separation of E2E Routing and Marine Leg",
    "text": "| Layer | Vocabulary | Example | Owner |\n|---|---|---|---|\n| End-to-end shipment route | `ShipmentRoutingPattern` | `MOSB_DIRECT`, `WH_MOSB`, `MIXED` | `CONSOLIDATED-00` |\n| Journey stage | `JourneyStage` | `MOSB_STAGING`, `OFFSHORE_TRANSIT`, `SITE_RECEIVING` | `CONSOLIDATED-00` |\n| Marine leg | `MarineRoutingPattern` | `DIRECT_MOSB`, `WH_THEN_MOSB`, `LCT_DIRECT` | `CONSOLIDATED-04` |\n| Offshore delivery | `offshoreDeliveryPattern` | `MOSB_TO_AGI`, `MOSB_TO_DAS` | `CONSOLIDATED-04` |\n| Warehouse handling | `WarehouseHandlingProfile.confirmedFlowCode` | warehouse-only handling class | `CONSOLIDATED-02` |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#13",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "4.2 Marine Milestone Chain",
    "text": "| Milestone | Name | Required evidence | Blocking rule |\n|---|---|---|---|\n| `M115` | MOSB Staged | MOSB staging request, laydown allocation, cargo inspection, ALS/Marine confirmation | Cannot proceed to M116 without cargo, deck, permit readiness |\n| `M116` | LCT / Barge Loaded | stowage plan, loading checklist, lashing inspection, deck pressure check | Cannot proceed to M117 if lashing/stability not approved |\n| `M117` | Sail-away Approved | weather/tide gate, stability approval, marine clearance, vessel readiness | Cannot depart if weather gate is HOLD/CLOSED without override |\n| `M118` | Offshore Arrival / Alongside | ATA AGI/DAS, berth/landing confirmation, site readiness | Cannot discharge if site access or lifting permit missing |\n| `M119` | Offshore Discharged | discharge checklist, receiving handover, damage/shortage note | Must create exception if OSD found |\n| `M130` | Site Arrived | site receipt / MRR / POD / GRN evidence | AGI/DAS site date is accepted as delivered; missing M115/M116/M117 becomes AMBER/WARN backfill |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#14",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "4.3 MarineRoutingPattern Rules",
    "text": "| Pattern | Canonical path | Use case | Required milestones |\n|---|---|---|---|\n| `DIRECT_MOSB` | Port → MOSB → LCT/Barge → AGI/DAS | Bulk/OOG cargo bypasses warehouse and stages at MOSB | M100 → M115 → M116 → M117 → M130 |\n| `WH_THEN_MOSB` | WH → MOSB → LCT/Barge → AGI/DAS | Cargo consolidated or preserved in WH before offshore move | M121 → M115 → M116 → M117 → M130 |\n| `LCT_DIRECT` | MOSB → LCT/Barge → Site | Marine leg only; used when upstream route is already resolved | M115 → M116 → M117 → M130 |\n| `OFFSHORE_PENDING` | MOSB staged, site/voyage not yet fixed | Waiting for site readiness, permit, vessel, weather, or priority | M115 open; M116 not allowed |\n| `SPLIT_MARINE_LEG` | One shipment split across multiple LCT trips | Heavy/volume split, mixed cargo or partial dispatch | Each trip needs separate M116/M117 |\n| `EXCEPTIONAL_HEAVY_LIFT` | Special engineering route | Transformer, oversized module, abnormal lift | MWS / engineering / HSE human-gate mandatory |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#15",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "4.4 AGI/DAS Offshore Rule",
    "text": "1. If `declaredDestination IN (AGI, DAS)`, the shipment must carry `ShipmentRoutingPattern IN (MOSB_DIRECT, WH_MOSB, MIXED)` or an explicit exception.\n2. If a marine leg is present, `MarineRoutingPattern` must be one of `DIRECT_MOSB`, `WH_THEN_MOSB`, `LCT_DIRECT`, `SPLIT_MARINE_LEG`, `EXCEPTIONAL_HEAVY_LIFT`.\n3. `M130 Site Arrived` for AGI/DAS is valid when site date evidence exists. Missing prior M115, M116, or M117 creates `MOSB_EVIDENCE_MISSING` with AMBER/WARN severity and backfill required unless an approved exception explains the gap.\n4. MOSB laydown/storage is modeled as `LaydownArea` or `StorageCapability` attached to `OffshoreStagingNode`, not as a top-level `Warehouse`.\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#16",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "5.1 Prepare — Marine Readiness",
    "text": "| Step | Input | Output | Gate |\n|---|---|---|---|\n| Cargo data capture | CI/PL, packing list, survey sheet, WMS, site request | normalized `CargoUnit` and `BulkCargoUnit` | Dimensions, weight, COG completeness |\n| Route confirmation | port/WH dispatch, destination, site priority | `ShipmentRoutingPattern` + `MarineRoutingPattern` candidate | AGI/DAS MOSB rule |\n| Marine asset nomination | LCT/barge availability, deck strength, cargo footprint | `MarineAsset` allocation | deck capacity and availability |\n| Permit readiness | PTW, JSA/TRA, gate pass, ADNOC/ALS clearance | `MarinePermit` records | valid dates and issuer |\n| Engineering document readiness | load plan, lashing plan, stability report, lifting plan | `MarineDocument` evidence | approved version only |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#17",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "5.2 MOSB Staging — M115",
    "text": "| Control | Required data | Fail condition |\n|---|---|---|\n| Cargo identity | `shipmentId`, `packageNo`, `HVDC_CODE`, cargo label | unresolved identity |\n| Physical condition | photo, inspection report, damage note | unclosed OSD |\n| Laydown allocation | `LaydownArea`, footprint, access path | area capacity exceeded |\n| Sequence readiness | load order, priority, site receiving window | no linked LCT/voyage plan |\n| Permit readiness | access, PTW, HSE, security | expired or missing permit |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#18",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "5.3 LCT / Barge Loading — M116",
    "text": "| Control | Required data | Fail condition |\n|---|---|---|\n| Stowage | deck slot, cargo position, sequence | unapproved stowage plan |\n| Deck pressure | weight, footprint, deck allowable | pressure above limit |\n| Lashing | lashing assembly, WLL, angle, count | safety factor below gate |\n| Stability | GM, VCG, trim, list, loading condition | stability gate not PASS/approved |\n| Lift / ramp | crane/Hiab/SPMT/ramp data | SWL, axle, ramp, or lift data missing |\n| Checklist | loading checklist, inspection sign-off | no field verification |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#19",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "5.4 Sail-away — M117",
    "text": "| Control | Required data | Fail condition |\n|---|---|---|\n| Weather | wind, sea state, visibility, forecast window | weather gate HOLD/CLOSED |\n| Tide / berth | tide window, berth availability, pilot/port control | window mismatch |\n| Marine readiness | crew, vessel certificate, fuel, communication | incomplete readiness |\n| Client / authority gate | ALS/ADNOC/MWS/HSE approval as applicable | missing approval |\n| Document pack | manifest, PL, inspection, load plan, lashing/stability report | incomplete evidence pack |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#20",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "5.5 Offshore Discharge and Site Handover — M118/M119/M130",
    "text": "| Control | Required data | Fail condition |\n|---|---|---|\n| Arrival | ATA, berth/landing confirmation, site access | arrival not confirmed |\n| Discharge method | crane/ramp/Hiab/SPMT/lifting plan | method not approved |\n| Receiving | MRR/POD/GRN, site inspection | missing site evidence |\n| OSD | damage, shortage, overage, NCR | exception not created |\n| Close-out | final report, signed checklist, document archive | missing close-out pack |\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#21",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "6.1 Stowage Data Model",
    "text": "| Data item | Required for | Rule |\n|---|---|---|\n| `cargo.lengthM`, `cargo.widthM`, `cargo.heightM` | all OOG / project cargo | must be > 0.00 |\n| `cargo.grossWeightMt` | all cargo | must be > 0.00 |\n| `cargo.cogX/Y/Z` | OOG, heavy lift, transformer, unstable cargo | required before M116 |\n| `deck.maxUniformLoadTpm2` | all deck areas | required before deck pressure validation |\n| `deck.maxPointLoadT` | point-loaded cargo / jacking / skid | required before M116 |\n| `position.xM`, `position.yM` | all deck stowage | must be inside deck boundary |\n| `stowage.sequenceNo` | multi-cargo loading | must not conflict with discharge sequence |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#22",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "6.2 Deck Pressure Rule",
    "text": "Formula:\n\n```text\nfootprintSqm = lengthM × widthM\ndeckPressureTpm2 = grossWeightMt / footprintSqm\nPASS if deckPressureTpm2 <= DeckArea.maxUniformLoadTpm2\nZERO if grossWeightMt, lengthM, widthM, or deck capacity is missing for OOG/heavy cargo\n```\n\nMinimum SHACL gate:\n\n```turtle\n@prefix marine: <https://hvdc-project.com/ontology/marine/> .\n@prefix sh: <http://www.w3.org/ns/shacl#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\nmarine:DeckPressureShape a sh:NodeShape ;\n  sh:targetClass marine:StowagePosition ;\n  sh:property [\n    sh:path marine:deckPressureTpm2 ;\n    sh:datatype xsd:decimal ;\n    sh:minInclusive 0.00 ;\n    sh:message \"deckPressureTpm2 must be calculated before M116.\" ;\n  ] ;\n  sh:sparql [\n    sh:message \"Deck pressure exceeds the allowable deck load for the assigned DeckArea.\" ;\n    sh:select \"\"\"\n      PREFIX marine: <https://hvdc-project.com/ontology/marine/>\n      SELECT $this\n      WHERE {\n        $this marine:deckPressureTpm2 ?p ;\n              marine:assignedDeckArea ?area .\n        ?area marine:maxUniformLoadTpm2 ?limit .\n        FILTER(?p > ?limit)\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#23",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "6.3 Lashing / Seafastening Rule",
    "text": "```text\nRequired input:\n- Cargo gross weight and COG\n- Expected acceleration / voyage condition\n- Lashing element WLL, angle, count\n- Effective capacity per direction\n- Minimum safety factor\n\nPASS if calculated safety factor >= required safety factor and field inspection is signed.\nZERO if lashing plan is missing for OOG, transformer, heavy lift, or deck cargo exposed to sea passage.\n```\n\nSHACL gate:\n\n```turtle\nmarine:LashingApprovalShape a sh:NodeShape ;\n  sh:targetClass marine:LashingPlan ;\n  sh:property [\n    sh:path marine:approvalStatus ;\n    sh:in (\"APPROVED\" \"FIELD_VERIFIED\") ;\n    sh:message \"LashingPlan must be APPROVED or FIELD_VERIFIED before M117.\" ;\n  ] ;\n  sh:property [\n    sh:path marine:safetyFactorMin ;\n    sh:minInclusive 1.00 ;\n    sh:message \"Lashing safety factor must be present and positive.\" ;\n  ] .\n```",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#24",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "6.4 Stability Rule",
    "text": "```text\nRequired input:\n- MarineAsset loading condition\n- Cargo list and deck positions\n- Ballast condition\n- GM, VCG, trim, list\n- Applicable operating limit / approval note\n\nPASS if StabilityCase.status IN (PASS, APPROVED_WITH_CONDITION) and condition notes are closed.\nZERO if stability report is missing before sail-away for LCT/barge heavy or mixed deck load.\n```\n\nSHACL gate:\n\n```turtle\nmarine:StabilityGateShape a sh:NodeShape ;\n  sh:targetClass marine:StabilityCase ;\n  sh:property [\n    sh:path marine:stabilityGateStatus ;\n    sh:in (\"PASS\" \"APPROVED_WITH_CONDITION\") ;\n    sh:message \"StabilityCase must pass or be approved with condition before M117.\" ;\n  ] ;\n  sh:property [\n    sh:path marine:gmM ;\n    sh:datatype xsd:decimal ;\n    sh:message \"GM must be available for stability gate.\" ;\n  ] .\n```",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#25",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "6.5 Lifting / Rigging Rule",
    "text": "```text\nRequired input:\n- Lift weight and COG\n- Lift points\n- Crane/Hiab/SPMT capacity\n- Rigging gear WLL\n- Sling angle and load share\n- Lift supervisor approval\n\nPASS if every rigging gear WLL >= calculated load share and lifting plan status is APPROVED.\nZERO if lift weight, COG, lift points, or rigging capacity is missing for OOG/heavy lift.\n```",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#26",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "6.6 Weather / Tide Gate",
    "text": "| Gate | PASS | AMBER | ZERO |\n|---|---|---|---|\n| Wind | within operation limit | forecast uncertain / near limit | above limit and no override |\n| Sea state | within marine plan | worsening trend | above limit and no override |\n| Visibility | within navigation / lifting limit | restricted visibility warning | below minimum |\n| Tide | compatible with draft / berth / ramp | narrow window | incompatible with operation |\n| Port control / pilot | confirmed | pending confirmation | rejected / unavailable |\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#27",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "7.1 Foundry Object Type Mapping",
    "text": "| Foundry Object Type | Source dataset | Key properties | Link Types |\n|---|---|---|---|\n| `MarineOperation` | marine operation register | `operationId`, `operationType`, `status`, `plannedStart`, `actualEnd` | forShipmentUnit → ShipmentUnit; usesMarineAsset → MarineAsset |\n| `LCTOperation` | LCT/voyage tracker | `lctName`, `wellsId`, `musNo`, `ATD`, `ETA`, `ATA` | generatesMilestone → M116/M117/M118 |\n| `BulkCargoUnit` | manifest / PL / WMS / site request | `cargoId`, `bulkCategory`, `qty`, `uom`, `weightMt` | belongsTo → ShipmentUnit; allocatedTo → DeckSlot |\n| `OOGCargoUnit` | PL / engineering cargo sheet | `dimensions`, `grossWeightMt`, `COG`, `liftPoints` | requires → StowagePlan/LashingPlan/LiftingPlan |\n| `MarineAsset` | vessel/barge master | `assetName`, `assetType`, `deckLimit`, `certificateStatus` | usedBy → MarineOperation |\n| `StowagePlan` | load plan / deck plan | `planVersion`, `approvalStatus`, `maxDeckPressureTpm2` | positionsCargo → CargoUnit |\n| `LashingPlan` | lashing calculation / inspection | `approvalStatus`, `safetyFactorMin` | secures → CargoUnit |\n| `StabilityCase` | stability report | `gmM`, `vcgM`, `trimM`, `status` | evaluates → MarineOperation |\n| `LiftingPlan` | rigging/lift plan | `liftMethod`, `grossLiftWeightMt`, `approvalStatus` | forCargo → CargoUnit |\n| `MarinePermit` | PTW/JSA/TRA/GatePass | `permitType`, `issuer`, `validFrom`, `validTo` | requiredFor → MarineOperation |\n| `MarineDocument` | document store / LDG | `docType`, `docHash`, `approvalStatus` | evidences → MarineOperation |\n| `MarineKPI` | dashboard dataset | `metricCode`, `targetValue`, `actualValue` | measures → MarineOperation / MarineAsset |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#28",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "7.2 Dataset Integration Points",
    "text": "| Source system | Dataset | Ontology output | Validation |\n|---|---|---|---|\n| ERP / PMO | `project_po_package_material` | `ShipmentUnit`, `CargoUnit`, `MaterialMaster` | package-material completeness |\n| WMS | `wh_dispatch_m121` | M121 evidence, cargo availability | dispatch before M115 |\n| Port / OFCO | `portcall_service_event` | port departure / service evidence | port evidence only |\n| Marine / ALS / OFCO | `lct_voyage_register` | `LCTOperation`, ATD/ETA/ATA, voyage ID | M116/M117/M118 completeness |\n| LDG / Document OCR | `marine_document_evidence` | `MarineDocument`, docHash, approval status | approved version check |\n| Engineering | `stowage_lashing_stability_lift` | plans and calculation cases | human-gate and required fields |\n| HSE / Permit | `ptw_jsa_tra_register` | `MarinePermit`, approval actions | valid permit window |\n| Site / FMC | `site_receipt_m130` | `SiteReceipt`, MRR/POD/GRN | M130 after M117 |\n| Cost | `marine_invoice_lines` | `MarineChargeEvidence` | handed off to `CONSOLIDATED-05` |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#29",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "7.3 Link Model",
    "text": "```text\nShipmentUnit\n  ├─ hasRoutingPattern → ShipmentRoutingPattern\n  ├─ hasMilestone → M115 / M116 / M117 / M118 / M119 / M130\n  ├─ hasCargoUnit → CargoUnit / BulkCargoUnit / OOGCargoUnit\n  ├─ hasMarineOperation → MarineOperation / LCTOperation\n  │    ├─ usesMarineAsset → LCT / Barge\n  │    ├─ hasStowagePlan → StowagePlan\n  │    ├─ hasLashingPlan → LashingPlan\n  │    ├─ hasStabilityCase → StabilityCase\n  │    ├─ hasLiftingPlan → LiftingPlan\n  │    ├─ requiresPermit → MarinePermit\n  │    └─ evidencedBy → MarineDocument\n  ├─ hasSiteReceipt → SiteReceipt\n  ├─ hasCostItem → MarineChargeEvidence / InvoiceLine\n  └─ hasException → Delay / Damage / Shortage / NCR / Claim\n```\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#30",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "8.1 SHACL Gate Summary",
    "text": "| Shape | Target | Rule | Severity |\n|---|---|---|---|\n| `MarineOperationBaseShape` | `MarineOperation` | operationId, status, ShipmentUnit link required | VIOLATION |\n| `MarineRoutingPatternShape` | `MarineOperation` | valid `MarineRoutingPattern` enum | VIOLATION |\n| `AGIDASMarineChainShape` | `ShipmentUnit` | AGI/DAS M130 accepts site date and flags missing M115/M116/M117 as backfill | WARN/AMBER |\n| `MOSBNodeBoundaryShape` | `LocationNode` | MOSB cannot be top-level Warehouse | VIOLATION |\n| `DeckPressureShape` | `StowagePosition` | deck pressure <= deck limit | VIOLATION |\n| `OOGDataCompletenessShape` | `OOGCargoUnit` | dimensions, weight, COG required | VIOLATION |\n| `LashingApprovalShape` | `LashingPlan` | approved/field verified before M117 | VIOLATION |\n| `StabilityGateShape` | `StabilityCase` | PASS or approved condition before M117 | VIOLATION |\n| `LiftingPlanShape` | `LiftingPlan` | gross lift weight, rigging gear, approval required | VIOLATION |\n| `WeatherGateShape` | `MarineWeatherWindow` | weather gate not closed before M117 | WARNING / VIOLATION |\n| `PermitValidityShape` | `MarinePermit` | operation time within valid permit window | VIOLATION |\n| `HumanGateShape` | high-risk marine operation | MWS/engineering/HSE approval required | ZERO |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#31",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "8.2 SPARQL — AGI/DAS Marine Chain Compliance",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nPREFIX marine: <https://hvdc-project.com/ontology/marine/>\n\nSELECT ?unit ?dest ?pattern ?m115 ?m116 ?m117 ?m130 ?verdict\nWHERE {\n  ?unit hvdc:declaredDestination ?dest ;\n        hvdc:hasRoutingPattern ?pattern .\n  FILTER(?dest IN (\"AGI\", \"DAS\"))\n  OPTIONAL { ?unit hvdc:hasMilestone ?m115 . ?m115 hvdc:milestoneCode \"M115\" . }\n  OPTIONAL { ?unit hvdc:hasMilestone ?m116 . ?m116 hvdc:milestoneCode \"M116\" . }\n  OPTIONAL { ?unit hvdc:hasMilestone ?m117 . ?m117 hvdc:milestoneCode \"M117\" . }\n  OPTIONAL { ?unit hvdc:hasMilestone ?m130 . ?m130 hvdc:milestoneCode \"M130\" . }\n  BIND(IF(BOUND(?m115) && BOUND(?m116) && BOUND(?m117) && BOUND(?m130), \"PASS\", \"FAIL\") AS ?verdict)\n}\nORDER BY ?verdict ?dest\n```",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#32",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "8.3 SPARQL — Deck Pressure Exception",
    "text": "```sparql\nPREFIX marine: <https://hvdc-project.com/ontology/marine/>\n\nSELECT ?operation ?cargo ?slot ?pressure ?limit\nWHERE {\n  ?operation marine:hasStowagePlan ?plan .\n  ?plan marine:hasStowagePosition ?slot .\n  ?slot marine:forCargo ?cargo ;\n        marine:deckPressureTpm2 ?pressure ;\n        marine:assignedDeckArea ?area .\n  ?area marine:maxUniformLoadTpm2 ?limit .\n  FILTER(?pressure > ?limit)\n}\nORDER BY DESC(?pressure)\n```",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#33",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "8.4 SPARQL — Missing Human Gate",
    "text": "```sparql\nPREFIX marine: <https://hvdc-project.com/ontology/marine/>\n\nSELECT ?operation ?cargo ?riskClass\nWHERE {\n  ?operation a marine:MarineOperation ;\n             marine:hasCargoUnit ?cargo ;\n             marine:riskClass ?riskClass .\n  FILTER(?riskClass IN (\"OOG\", \"HEAVY_LIFT\", \"TRANSFORMER\", \"CRITICAL_BULK\"))\n  FILTER NOT EXISTS { ?operation marine:hasApproval ?approval . ?approval marine:approvalStatus \"APPROVED\" . }\n}\n```",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#34",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "8.5 RAG Check",
    "text": "| Check | Evidence source | Rule |\n|---|---|---|\n| SOLAS / IMSBC applicability | approved project HSE / marine standard registry | use latest project-approved standard reference |\n| IMDG / DG cargo | DG declaration, SDS, permit | DG cannot be loaded without segregation evidence |\n| BIMCO / SUPPLYTIME charter interface | contract / charter party evidence | cost/liability interpreted outside ontology; only evidence links here |\n| Port / Marine clearance | port control / agency / ALS confirmation | M117 blocked without clearance |\n| Weather / tide | approved weather source / port control | AI forecast is advisory; final decision requires human gate |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#35",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "8.6 Human-gate Matrix",
    "text": "| Condition | Required reviewer | Output |\n|---|---|---|\n| Cargo > 50.00 MT or OOG critical cargo | lifting engineer + marine superintendent | approved lifting/stowage plan |\n| Transformer / critical HVDC equipment | MWS / client / HSE as applicable | approved transport method statement |\n| Deck pressure near limit | marine engineer / naval architect | approved deck calculation |\n| Stability case with condition | naval architect / vessel master | approved condition note |\n| Weather/tide near threshold | vessel master / port control | go/no-go decision |\n| OSD during load/discharge | QA/QC + logistics + site | exception + claim record |\n| Permit ambiguity | HSE / authority focal | permit closure evidence |\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#36",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "9.1 Standards / Authority Alignment",
    "text": "| Area | Control | Ontology binding |\n|---|---|---|\n| Marine safety | SOLAS / project marine procedure | `MarinePermit`, `MarineWeatherWindow`, `MarineEvent` |\n| Bulk cargo | IMSBC / project cargo SOP | `BulkCargoUnit`, `BulkCargoOperation` |\n| Dangerous goods | IMDG / SDS / DG segregation | `DangerousCargoControl`, `MarinePermit` |\n| Offshore support vessel | BIMCO SUPPLYTIME 2017 contract evidence | `MarineContract`, `MarineAsset`, `MarineOperation` |\n| ADNOC / ALS access | gate pass, PTW, JSA/TRA, site/marine clearance | `MarinePermit`, `ApprovalAction` |\n| MWS / engineering approval | method statement, stowage/lashing/stability/lift plans | `MWSApproval`, `StowagePlan`, `LashingPlan`, `StabilityCase`, `LiftingPlan` |\n| Customs / release | BOE, DO, port release | read-only evidence from `CONSOLIDATED-06/07` |\n| Site receipt | MRR/POD/GRN/OSDR | handoff to `CONSOLIDATED-06` |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#37",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "9.2 ZERO / Fail-safe Triggers",
    "text": "| Trigger | Reason | Required data |\n|---|---|---|\n| OOG/heavy cargo without dimensions, gross weight, or COG | Cannot validate deck pressure, stability, or lift | dimensions, weight, COG, lift points |\n| Lashing plan missing before M117 | Sea passage securing not evidenced | approved lashing plan and inspection |\n| Stability report missing before M117 | Sail-away safety not evidenced | approved stability case |\n| Deck capacity missing for assigned deck | Deck pressure cannot be validated | deck area load limits |\n| AGI/DAS M130 without M115/M116/M117 | MOSB/LCT evidence gap; delivery still accepted if site date exists | milestone backfill evidence or approved exception |\n| Expired/missing PTW/JSA/TRA/gate pass | Authority/HSE gate not closed | valid permit evidence |\n| Weather/port control closed and no override | Go/no-go decision unsafe | official go/no-go approval |\n| OSD found and no exception record | Claim/audit chain broken | exception/OSDR/NCR record |\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#38",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "10. Options ≥3",
    "text": "| Option | Description | Pros | Cons | Cost | Risk | Time |\n|---|---|---|---|---:|---|---:|\n| A. Baseline Marine Evidence Layer | Marine operation register + document evidence + M115/M116/M117 gates | 빠른 적용, 기존 Excel/MD 호환 | engineering calculation 자동화 제한 | 45,000.00 AED | Medium | 2.00 weeks |\n| B. Hybrid Foundry Object + KG | Foundry Object Types + RDF/SHACL validation + dashboard KPI | traceability, validation, automation 균형 | 초기 mapping discipline 필요 | 110,000.00 AED | Medium | 5.00 weeks |\n| C. Engineering-linked Marine Twin | deck/stowage/lashing/stability/lift objects with CAD/BIM hooks | deck pressure / stability / lift gate 고도화 | CAD/BIM/engineering data 품질 의존 | 220,000.00 AED | High | 10.00 weeks |\n| D. Compliance-first Marine Control | PTW/JSA/TRA/MWS/HSE approval-first 운영 | 안전/감사에 강함 | 운영 KPI/최적화는 제한 | 85,000.00 AED | Low | 4.00 weeks |\n\n**Recommended option:** Option B. Hybrid Foundry Object + KG. It gives the best balance between immediate marine control, ontology consistency, and future engineering automation.\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#39",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "11. Roadmap — Prepare → Pilot → Build → Operate → Scale",
    "text": "| Phase | Duration | Key work | KPI target | Owner |\n|---|---:|---|---|---|\n| Prepare | 1.00 week | marine object schema, identifier map, milestone map, document list | object coverage ≥ 90.00% | Ontology / Logistics |\n| Pilot | 2.00 weeks | 1 LCT voyage + 1 OOG cargo + 1 bulk cargo validation | M115/M116/M117 completeness = 100.00% | Marine / FMC |\n| Build | 3.00 weeks | Foundry object mapping, SHACL gates, SPARQL checks, dashboard panels | validation pass ≥ 98.00% | Data / Ops |\n| Operate | ongoing | daily marine readiness board, exception workflow, human-gate approval | ZERO leakage = 0.00건 | Logistics / Marine |\n| Scale | 4.00 weeks | CAD/BIM link, deck pressure heatmap, weather/tide gate, cost handoff | LCT utilization 80.00–85.00% | PMO / Digital |\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#40",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "12.1 RPA / LLM / Sheets / Telegram Hooks",
    "text": "| Hook | Trigger | Action | Human gate |\n|---|---|---|---|\n| `MarineReadinessBot` | new cargo list / PL / WMS dispatch | create marine readiness checklist | approve before M115 |\n| `MOSBStagingBot` | M121 or direct gate-out | open M115 staging candidate | ALS/Marine confirmation |\n| `StowageGuard` | stowage plan upload | calculate deck pressure and slot conflict | marine engineer approval |\n| `LashingGuard` | lashing plan upload | check WLL/angle/count/safety factor fields | engineer sign-off |\n| `StabilityGuard` | stability report upload | verify case status and mandatory values | naval architect / master approval |\n| `PermitGuard` | PTW/JSA/TRA/gate pass update | check validity window | HSE / authority approval |\n| `WeatherTie` | planned M117 within 48.00 hrs | attach weather/tide gate status | vessel master / port control |\n| `OSDGuard` | damage/shortage photo or note | create exception/NCR/claim candidate | QA/QC confirmation |\n| `TelegramDigest` | daily 07:30 Asia/Dubai | send marine readiness / blocked list | read-only alert |\n| `SheetsExport` | daily close | export LCT/MOSB/milestone KPI | manager review |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#41",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "12.2 Command-ready Workflow",
    "text": "```text\n/logi-master stowage --deep --noheatmap\n/logi-master weather-tie --route MOSB-AGI --horizon 72h\n/logi-master report --marine --KRsummary\n```\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#42",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "13.1 QA Checklist",
    "text": "| No | Check | PASS condition |\n|---:|---|---|\n| 1.00 | Master spine alignment | `CONSOLIDATED-00` remains canonical |\n| 2.00 | Flow Code boundary | no marine/offshore classification by warehouse handling code |\n| 3.00 | MOSB boundary | MOSB typed as `OffshoreStagingNode` / `MarineInterfaceNode` |\n| 4.00 | Route separation | `ShipmentRoutingPattern` ≠ `MarineRoutingPattern` |\n| 5.00 | Milestone continuity | M115/M116/M117/M130 chain complete for AGI/DAS |\n| 6.00 | Deck pressure | pressure calculated and within deck limit |\n| 7.00 | Lashing | approved / field verified before sail-away |\n| 8.00 | Stability | PASS or approved condition before sail-away |\n| 9.00 | Lift plan | OOG/heavy cargo has approved lift/rigging data |\n| 10.00 | Permit | PTW/JSA/TRA/gate pass valid during operation |\n| 11.00 | Weather/tide | final go/no-go has human evidence |\n| 12.00 | Site handover | MRR/POD/GRN or exception linked |\n| 13.00 | Cost handoff | marine charge evidence exported, CostGuard not redefined |\n| 14.00 | Document evidence | docHash/version/approval status captured |\n| 15.00 | PII/NDA | names allowed if operational; phone/email masked in public artifacts |",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#43",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "13.2 Assumptions",
    "text": "- 가정: 본 문서는 ontology/data-control layer이며, engineering calculation 결과 자체를 대체하지 않는다.\n- 가정: Deck allowable load, GM limit, wind/sea-state limits, tide/ramp constraints are project/vessel-specific and must be provided as approved source data before live validation.\n- 가정: MOSB laydown can be represented as `LaydownArea` or `StorageCapability`; this does not convert MOSB into a top-level warehouse.\n- 가정: Cost rates, charter terms, and liability interpretation remain in contract/cost documents; this document only exports marine evidence.\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#44",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "14. Validation Patch Log — 5 Parallel Passes",
    "text": "| Pass | Review lane | Defect found | Patch applied | Result |\n|---:|---|---|---|---|\n| 1.00 | Master spine alignment | old document mixed marine class with end-to-end route wording | separated `ShipmentRoutingPattern` and `MarineRoutingPattern` | PASS |\n| 2.00 | Flow Code boundary | legacy route-coded language appeared in marine context | confined warehouse handling to `CONSOLIDATED-02` reference only | PASS |\n| 3.00 | MOSB boundary | MOSB staging could be read as warehouse-like | modeled MOSB as `OffshoreStagingNode` with `LaydownArea` capability | PASS |\n| 4.00 | Engineering gate | original text described engineering objects but lacked hard gates | added deck pressure, lashing, stability, lifting, weather, permit ZERO gates | PASS |\n| 5.00 | Integration / artifact hygiene | adjacent-domain handoffs needed clearer ownership | added Foundry mapping, dataset integration, handoff model, QA checklist | PASS |\n\n---",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-04-barge-bulk-cargo#45",
    "docId": "CONSOLIDATED-04-barge-bulk-cargo",
    "title": "hvdc-barge-bulk-cargo · CONSOLIDATED-04",
    "version": "2.0-final",
    "sectionPath": "15. CmdRec",
    "text": "- `/switch_mode LATTICE + /logi-master stowage --deep --noheatmap`\n- `/switch_mode PRIME + /logi-master report --marine --KRsummary`\n- `/switch_mode ORACLE + /logi-master weather-tie --route MOSB-AGI --horizon 72h`",
    "docHash": "9ad3e00dd6a4d0775378fa0b817c49b30b4891b56045033b84c189a5f29ff116",
    "domains": [
      "marine"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#1",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Invoice & Cost Management Ontology — Consolidated\"\ntype: \"ontology-design\"\ndomain: \"invoice-cost-management\"\nsub-domains:\n  - invoice-verification\n  - cost-guard\n  - rate-reference\n  - tariff-reference\n  - route-cost-evidence\n  - warehouse-cost-evidence\n  - port-charge-control\n  - marine-charge-control\n  - dem-det-control\n  - cost-allocation\n  - audit-proof\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\nextension_of: \"hvdc-master-ontology-v2.0-final\"\ncanonical_role: \"invoice, rate reference, tariff reference, CostGuard, DEM/DET, cost allocation, and PRISM.KERNEL audit extension\"\nowner: \"HVDC Logistics Ontology Working Set\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\n  - UN-CEFACT-BSP-RDM\n  - WCO-DM\n  - ICC-Incoterms-2020\nsource_files:\n  - 1_CORE-04-hvdc-invoice-cost.md\n  - legacy_COST_GUARD_notes\nchecked_against:\n  - CONSOLIDATED-00-master-ontology.md\n  - CONSOLIDATED-01-core-framework-infra.md\n  - CONSOLIDATED-02-warehouse-flow.md\n  - CONSOLIDATED-03-document-ocr.md\n  - CONSOLIDATED-04-barge-bulk-cargo.md\n  - CONSOLIDATED-06-material-handling.md\n  - CONSOLIDATED-07-port-operations.md\n  - CONSOLIDATED-09-operations.md\n  - AGENTS.md\n  - HVDC Logistics Ontology Review.txt\n  - Palantir 온톨로지 기반 물류 자동화.pdf\nvalidation_passes: 5\ncost_guard:\n  delta_formula: \"(DraftAmount - StandardAmount) / StandardAmount * 100.00\"\n  pass: \"abs(delta_pct) <= 2.00\"\n  warn: \"2.01 <= abs(delta_pct) <= 5.00\"\n  high: \"5.01 <= abs(delta_pct) <= 10.00\"\n  critical: \"abs(delta_pct) > 10.00\"\n  invoice_total_tolerance_pct: 2.00\n  line_amount_tolerance: 0.01\n  human_gate_aed: 100000.00\nfx_policy:\n  rule: \"preserve_original_currency\"\n  allowed_currencies:\n    - AED\n    - USD\n  conversion: \"disabled unless approved FxPolicy override exists\"\nsemantic_patch:\n  - \"Cost domain reads ShipmentRoutingPattern and warehouse evidence; it does not own route truth or WarehouseHandlingProfile.confirmedFlowCode.\"\n  - \"Legacy Flow Code route/cost wording migrated to costByRoutingPattern, routeBasedCostDriver, and wh_handling_cnt evidence.\"\n  - \"COST-GUARD band updated to master v2.0: PASS <= 2.00%, WARN 2.01-5.00%, HIGH 5.01-10.00%, CRITICAL > 10.00%.\"\n  - \"Original currency is preserved; FX conversion requires explicit FxPolicy override and audit proof.\"\n  - \"OFCO/port invoice mapping, LDG/OCR evidence, WMS WHP evidence, marine charge evidence, and DEM/DET clocks are separated by ownership.\"\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#2",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "1. ExecSummary",
    "text": "`CONSOLIDATED-05`는 HVDC Logistics KG의 **invoice + rate + CostGuard extension**이다. 목적은 Draft Invoice를 `Invoice → InvoiceLine → ChargeComponent → RateRef/TariffRef → CostGuardResult → ApprovalAction`으로 정규화하여 과청구, DEM/DET 누락, 경로 기반 비용 오분류, 통화/합계 오류를 조기 차단하는 것이다.\n\n비즈니스 임팩트는 **라인 단위 과금 검증**, **Port/WH/MOSB/Site 비용 책임 추적**, **100,000.00 AED 이상 고가 청구 Human-gate**, **PRISM.KERNEL 감사 증빙 자동화**이다. 기술 해법은 Any-key identity resolution, route/warehouse/marine evidence read-only binding, 원통화 보존, SHACL/SPARQL 검증, Foundry Action 기반 승인·반려 workflow를 결합한다.\n\nKPI 목표는 `LineNumericIntegrity = 100.00%`, `InvoiceTotalIntegrity = 100.00%`, `RateRefCoverage ≥ 95.00%`, `CostGuardBandCoverage = 100.00%`, `Validation p95 < 5.00s`, `UnauthorizedCostLeakage = 0.00 AED`이다.\n\n**ENG-KR one-liner:** Cost owns invoice audit and rate comparison; route truth stays in `ShipmentRoutingPattern`, warehouse handling stays in `WarehouseHandlingProfile`, and every verdict writes a PRISM proof.\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#3",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "2.1 Master Governance Rule",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.\n2. `CONSOLIDATED-05` owns **Invoice**, **InvoiceLine**, **ChargeComponent**, **RateRef**, **TariffRef**, **CostTransaction**, **DEMDETClock**, **CostGuardResult**, **CostAllocation**, and **PRISM.KERNEL** audit proof only.\n3. Program-wide shipment visibility uses `RoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`; cost may read these as cost drivers but shall not create or override them.\n4. `WarehouseHandlingProfile.confirmedFlowCode` is warehouse-only and belongs to `CONSOLIDATED-02`; cost may read `WarehouseHandlingProfile.wh_handling_cnt`, dwell evidence, storage class, and WH events as evidence.\n5. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`, not a top-level warehouse. MOSB-related charges are modeled as `MOSBCharge`, `MarineCharge`, `LCTCharge`, or `StagingCharge`, not as generic warehouse charges unless a specific warehouse service evidence exists.\n6. LDG/OCR may provide invoice line evidence, route evidence, destination evidence, and numeric extraction confidence. Final CostGuard verdict is owned by `CostGuardResult`, not by OCR.\n7. Port/OFCO records service evidence and tariff evidence. Cost compares invoice lines against `TariffRef` / `RateRef`; port does not own CostGuard verdict.\n8. Currency is preserved in the original invoice/rate-table currency. FX conversion is disabled unless an approved `FxPolicy` override exists with rate, date, approver, and proof hash.\n9. High-value, abnormal, or compliance-sensitive invoices are blocked until a human approval action is linked.\n10. Legacy route-coded cost language is migration debt and may appear only in deprecation notes, detection queries, or patch ledgers.",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#4",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "2.2 Included vs Delegated Scope",
    "text": "| Scope item | Included in CONSOLIDATED-05 | Delegated / excluded |\n|---|---|---|\n| Invoice audit | Invoice header, line, charge component, tax, total, source document link | OCR token/table extraction in `CONSOLIDATED-03` |\n| Rate comparison | Contract rate, tariff, special approval rate, lane rate, unit rate | Commercial negotiation and contract execution |\n| CostGuard result | Δ%, band, verdict, blocking reason, approval requirement | Payment execution in ERP/AP |\n| Route-based cost | Reads `ShipmentRoutingPattern`, route driver, journey leg evidence | Route ownership in `CONSOLIDATED-00` / operations |\n| Warehouse cost | Reads WHP `wh_handling_cnt`, WH events, dwell days, storage class evidence | WHP assignment and stock truth in `CONSOLIDATED-02` |\n| Port cost | OFCO/SAFEEN/ADP service evidence, tariff ref, price/cost center mapping | Port service execution truth in `CONSOLIDATED-07` |\n| Marine cost | LCT/barge/MOSB charge evidence, marine event link, trip utilization | Marine operation truth and engineering approval in `CONSOLIDATED-04` |\n| DEM/DET | Clock start/end, free-time, delay attribution, M92→M100 alert | Customs/DO/gate-out execution in `CONSOLIDATED-06/07` |\n| Compliance cost | Incoterm responsibility, duty/tax evidence, permit blocker cost | Authority interpretation and permit approval in `CONSOLIDATED-01/06` |\n| Audit proof | PRISM.KERNEL recap, artifact JSON, source hash, rule version | External legal acceptance of claim/payment |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#5",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "2.3 Domain Boundary Crosswalk",
    "text": "| Domain | Allowed interface with Cost | Not allowed in CONSOLIDATED-05 |\n|---|---|---|\n| Master spine | Read `ShipmentUnit`, `RoutingPattern`, `JourneyStage`, `JourneyLeg`, `MilestoneEvent`, identifier clusters | Redefine master route dictionary or milestone sequence |\n| Core infrastructure | Read `LocationNode`, port/WH/MOSB/site capability, Incoterm/cost owner anchor | Treat all routes as MOSB routes |\n| Warehouse | Read `WarehouseHandlingProfile.wh_handling_cnt`, WH received/dispatch events, dwell and storage evidence | Assign `confirmedFlowCode` or interpret it as end-to-end route |\n| Document/OCR | Consume invoice evidence, extracted amount/rate/qty, confidence, `routeEvidence`, `destinationEvidence`, `mosbLegIndicator` | Let OCR produce final CostGuard verdict or mutate invoice truth without approval |\n| Port/OFCO | Consume `PortCall`, `ServiceEvent`, `TariffRef`, `PriceCenter`, `RotationNo`, invoice number | Own finance approval or CostGuard band |\n| Marine/Bulk | Consume `MarineChargeEvidence`, `LCTTrip`, M115/M116/M117 links, utilization | Own cost band or payment decision |\n| Material handling | Consume M92/M100/M110/M115/M130 timings and DEM/DET triggers | Collapse material receipt into invoice validation |\n| Operations/KPI | Export audited cost facts and exception status | Replace cost audit with dashboard-only aggregation |\n| Communication | Link approval emails/chats as `CommunicationEvent` / `ApprovalAction` evidence | Store unmasked phone/e-mail PII in routine cost output |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#6",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "2.4 Legacy Migration Rules",
    "text": "| Legacy wording / pattern | Canonical replacement | Patch action |\n|---|---|---|\n| Cost driven by route-coded Flow Code | `costByRoutingPattern` + `routeBasedCostDriver` | Route is read from `ShipmentRoutingPattern`; WH evidence remains read-only |\n| Invoice owns or extracts warehouse handling class | `CostEvidenceAssertion` linked to WHP evidence | No cost-domain write to `confirmedFlowCode` |\n| USD-only base calculation | `CurrencyPolicy.preserveOriginalCurrency = true` | Compare in original currency; FX only by approved override |\n| Legacy pass tolerance above current master threshold | Master COST-GUARD band: PASS ≤ 2.00% | Updated all examples and validation logic |\n| MOSB charge as warehouse charge | `MOSBCharge` / `MarineCharge` / `StagingCharge` | MOSB remains offshore staging / marine interface |\n| OCR invoice verdict | `InvoiceLineEvidence` → `CostGuardResult` | OCR supplies evidence; CostGuard owns verdict |\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#7",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "3.1 Ontology Layer Map",
    "text": "| Layer | Class / vocabulary | Purpose |\n|---|---|---|\n| Invoice document | `Invoice`, `InvoiceLine`, `InvoiceHeader`, `TaxLine`, `InvoiceStatus` | Header/line/total/tax truth for payable review |\n| Charge taxonomy | `ChargeComponent`, `PortCharge`, `WarehouseCharge`, `MarineCharge`, `MOSBCharge`, `DEMDETCharge`, `CustomsCharge`, `TruckingCharge`, `HandlingCharge`, `InsuranceCharge` | Charge type normalization |\n| Rate reference | `RateRef`, `TariffRef`, `ContractRateRef`, `MarketRateRef`, `SpecialRateRef`, `RateBasis`, `RateValidityWindow` | Standard amount source |\n| Lane and service | `ODLane`, `ServiceEventRef`, `PortServiceRef`, `JourneyLegRef`, `VehicleClass`, `EquipmentClass` | Charge-to-operation join |\n| Cost decision | `CostGuardResult`, `RiskBand`, `VarianceResult`, `ApprovalRequirement`, `DisputeReason` | Δ%, band, verdict, action |\n| Cost accounting | `CostTransaction`, `CostAllocation`, `CostCenter`, `PriceCenter`, `CostResponsibility`, `IncotermCostRule` | AP/ERP posting and ownership |\n| Time/cost clock | `DEMDETClock`, `FreeTimePolicy`, `DwellCostClock`, `DelayAttribution` | DEM/DET and dwell risk |\n| Currency | `CurrencyPolicy`, `FxPolicy`, `MonetaryAmount`, `CurrencyCode` | Original-currency preservation and override control |\n| Evidence | `CostEvidenceAssertion`, `DocumentEvidenceRef`, `RateEvidenceRef`, `AuditRecord`, `ProofArtifact`, `ApprovalAction` | Provenance, proof, human gate |\n| KPI | `CostKPI`, `OverageMetric`, `RateCoverageMetric`, `AuditLatencyMetric` | Dashboard and SLA |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#8",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "3.2 Core Classes",
    "text": "| Class | Required properties | Key relations | Notes |\n|---|---|---|---|\n| `Invoice` | `invoiceId`, `invoiceNo`, `vendor`, `issueDate`, `currency`, `invoiceTotal`, `invoiceStatus` | `hasInvoiceLine`, `linkedToShipmentUnit`, `evidencedByDocument`, `hasCostGuardResult` | Header-level audit object |\n| `InvoiceLine` | `lineId`, `lineNo`, `chargeDesc`, `qty`, `uom`, `rate`, `lineAmount`, `currency` | `partOfInvoice`, `usesRateRef`, `forChargeComponent`, `linkedToOperation` | Line amount must equal `qty × rate ± 0.01` |\n| `ChargeComponent` | `chargeType`, `chargeBasis`, `serviceScope`, `taxableFlag` | `mappedFromDescription`, `mappedToCostCenter` | Controlled charge taxonomy |\n| `RateRef` | `rateRefId`, `sourceType`, `standardRate`, `currency`, `uom`, `validFrom`, `validTo` | `appliesToLane`, `appliesToChargeComponent`, `approvedBy` | Contract/tariff/market/special rate reference |\n| `TariffRef` | `tariffId`, `authorityOrProvider`, `serviceCode`, `tariffRate`, `effectiveDate` | `appliesToPortService`, `evidencedByTariffDoc` | OFCO/SAFEEN/ADP style service tariff reference |\n| `ODLane` | `laneId`, `originNode`, `destinationNode`, `viaNode`, `mode`, `vehicleClass`, `uom` | `resolvedByApprovedLaneMap`, `supportsRoutingPattern` | Lane matching and rate join |\n| `CurrencyPolicy` | `policyId`, `preserveOriginalCurrency`, `allowedCurrencies`, `fxOverrideRequired` | `appliesToInvoice`, `appliesToRateRef` | Default: no conversion |\n| `FxPolicy` | `fxPolicyId`, `fromCurrency`, `toCurrency`, `fxRate`, `rateDate`, `approvedBy` | `overridesCurrencyPolicy`, `hasApprovalAction` | Explicit override only |\n| `CostGuardResult` | `resultId`, `deltaPct`, `band`, `verdict`, `severity`, `calculatedAt` | `forInvoiceLine`, `comparedAgainstRateRef`, `requiresApproval`, `hasProofArtifact` | Final audit result |\n| `DEMDETClock` | `clockId`, `clockType`, `freeTimeHours`, `clockStart`, `clockEnd`, `billableHours` | `forShipmentUnit`, `triggeredByMilestone`, `linkedToInvoiceLine` | DEM/DET and dwell cost evidence |\n| `CostAllocation` | `allocationId`, `costCenter`, `priceCenter`, `allocatedAmount`, `currency` | `allocatesInvoiceLine`, `chargedToParty` | AP/controlling view |\n| `ProofArtifact` | `proofId`, `artifactType`, `ruleVersion`, `sourceHash`, `calculationHash`, `createdAt` | `provesCostGuardResult`, `wasDerivedFrom` | PRISM.KERNEL proof |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#9",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "3.3 Controlled Vocabularies",
    "text": "| Vocabulary | Values |\n|---|---|\n| `RiskBand` | `PASS`, `WARN`, `HIGH`, `CRITICAL` |\n| `Verdict` | `ACCEPTABLE`, `REVIEW_REQUIRED`, `FINANCE_APPROVAL_REQUIRED`, `REJECT`, `HOLD_FOR_EVIDENCE` |\n| `RateSourceType` | `CONTRACT`, `TARIFF`, `MARKET`, `QUOTATION`, `SPECIAL_APPROVAL`, `AT_COST`, `UNKNOWN` |\n| `ChargeType` | `PORT_DUES`, `CHANNEL_TRANSIT`, `PILOTAGE`, `TUG`, `PHC`, `CUSTOMS_CLEARANCE`, `TRUCKING`, `WAREHOUSE_HANDLING`, `WAREHOUSE_STORAGE`, `MOSB_STAGING`, `LCT_BARGE`, `MARINE_SUPPORT`, `DEMURRAGE`, `DETENTION`, `DUTY_TAX`, `INSURANCE`, `DOCUMENTATION`, `OTHER` |\n| `CurrencyCode` | `AED`, `USD` by default; others require `FxPolicy` override |\n| `InvoiceStatus` | `DRAFT`, `RECEIVED`, `EVIDENCE_LINKED`, `AUDITED`, `APPROVED`, `REJECTED`, `DISPUTED`, `PAID`, `SUPERSEDED` |\n| `CostEvidenceStatus` | `MISSING`, `PROPOSED`, `LINKED`, `VALIDATED`, `REJECTED`, `OVERRIDDEN` |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#10",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "3.4 RoutingPattern Cost Driver Matrix",
    "text": "| `ShipmentRoutingPattern` | Cost components expected | Evidence required | CostGuard note |\n|---|---|---|---|\n| `PRE_ARRIVAL` | Pre-alert, documentation, booking, estimated port cost | BL/booking/ETA evidence | No final trucking/WH/marine charge approval without operational milestone |\n| `DIRECT` | Port service + direct trucking + site delivery | M92/M100/M130 or equivalent release/site evidence | No WH or MOSB charges unless exception approved |\n| `WH_ONLY` | Port + trucking to WH + WH handling/storage + trucking to site | M100/M110/M120/M121/M130, WHP evidence | WH charge must link to WHP/dwell evidence |\n| `MOSB_DIRECT` | Port + trucking/staging to MOSB + LCT/barge/marine + site receipt | M100/M115/M116/M117/M130 | MOSB/marine charges expected; WH charges require separate evidence |\n| `WH_MOSB` | Port + WH handling/storage + WH-to-MOSB + MOSB staging + marine + site receipt | M110/M121/M115/M116/M117/M130 | Highest audit surface; split WH vs MOSB vs marine charges |\n| `MIXED` | Variable | Exception record, split cargo, partial route evidence | Human review mandatory before approval |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#11",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "3.5 Rate Basis Rules",
    "text": "| Rate basis | Required dimensions | Numeric rule |\n|---|---|---|\n| `PER_EA` | qty, unit rate | `qty × rate = amount ± 0.01` |\n| `PER_TRUCK` | truck count, vehicle class, lane | `truckCount × rate = amount ± 0.01` |\n| `PER_TEU` | TEU count, lane, container type | `teu × rate = amount ± 0.01` |\n| `PER_CBM` | volumeCbm, storage/service type | `cbm × rate = amount ± 0.01` |\n| `PER_MT` | weightMt, cargo class | `mt × rate = amount ± 0.01` |\n| `PER_DAY` | billableDays, free-time policy | `days × rate = amount ± 0.01` |\n| `AT_COST` | source receipt, pass-through proof | amount must match source evidence ± 0.01 |\n| `LUMP_SUM` | approved quotation / work order | total must match approved amount ± 0.01 |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#12",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "3.6 RDF/OWL Skeleton",
    "text": "```turtle\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix owl:  <http://www.w3.org/2002/07/owl#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n@prefix prov: <http://www.w3.org/ns/prov#> .\n\nhvdc:Invoice a owl:Class ;\n  rdfs:subClassOf hvdc:CostDocument .\n\nhvdc:InvoiceLine a owl:Class ;\n  rdfs:subClassOf hvdc:CostLine .\n\nhvdc:RateRef a owl:Class .\nhvdc:TariffRef a owl:Class ;\n  rdfs:subClassOf hvdc:RateRef .\n\nhvdc:CostGuardResult a owl:Class ;\n  rdfs:subClassOf hvdc:VerificationResult .\n\nhvdc:DEMDETClock a owl:Class .\nhvdc:ProofArtifact a owl:Class ;\n  rdfs:subClassOf prov:Entity .\n\nhvdc:hasInvoiceLine a owl:ObjectProperty ;\n  rdfs:domain hvdc:Invoice ;\n  rdfs:range hvdc:InvoiceLine .\n\nhvdc:usesRateRef a owl:ObjectProperty ;\n  rdfs:domain hvdc:InvoiceLine ;\n  rdfs:range hvdc:RateRef .\n\nhvdc:hasCostGuardResult a owl:ObjectProperty ;\n  rdfs:domain hvdc:InvoiceLine ;\n  rdfs:range hvdc:CostGuardResult .\n\nhvdc:linkedToShipmentUnit a owl:ObjectProperty ;\n  rdfs:domain hvdc:Invoice ;\n  rdfs:range hvdc:ShipmentUnit .\n\nhvdc:readsWarehouseEvidence a owl:ObjectProperty ;\n  rdfs:domain hvdc:InvoiceLine ;\n  rdfs:range hvdc:WarehouseHandlingProfile ;\n  rdfs:comment \"Read-only evidence link. Cost domain must not write confirmedFlowCode.\" .\n\nhvdc:deltaPct a owl:DatatypeProperty ;\n  rdfs:domain hvdc:CostGuardResult ;\n  rdfs:range xsd:decimal .\n\nhvdc:band a owl:DatatypeProperty ;\n  rdfs:domain hvdc:CostGuardResult ;\n  rdfs:range xsd:string .\n\nhvdc:currency a owl:DatatypeProperty ;\n  rdfs:range xsd:string .\n```\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#13",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "4.1 Integration Flow",
    "text": "```text\nAny key\n  → resolveAnyKey(invoiceNo / BL / Container / DO / Rotation / SamsungRef / HVDCCode / CaseNo)\n  → SameAsCluster\n  → Invoice + InvoiceLine\n  → ShipmentUnit / PortCall / WarehouseTask / MarineOperation / SiteReceipt link\n  → RateRef / TariffRef / ApprovedLaneMap join\n  → CostGuard Δ% calculation\n  → CostGuardResult + PRISM.KERNEL proof\n  → ApprovalAction or DisputeAction\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#14",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "4.2 Foundry Object and Link Mapping",
    "text": "| Foundry object type | Source dataset | Key fields | Link types |\n|---|---|---|---|\n| `Invoice` | AP invoice, OFCO invoice, vendor draft, LDG document registry | invoiceNo, vendor, issueDate, currency | `linkedToShipmentUnit`, `hasInvoiceLine`, `evidencedByDocument` |\n| `InvoiceLine` | AP line table, OCR extracted table, OFCO line table | invoiceNo, lineNo, chargeDesc, amount | `partOfInvoice`, `usesRateRef`, `forChargeComponent`, `linkedToOperation` |\n| `RateRef` | contract rate sheet, tariff table, approved quotation, special approval | rateRefId, rateSourceType, lane, chargeType, validity | `appliesToLane`, `approvedBy`, `evidencedByRateDoc` |\n| `ODLane` | ApprovedLaneMap, RefDestinationMap, route graph | origin, destination, via, mode, uom | `supportsRoutingPattern`, `normalizesDestination` |\n| `CostGuardResult` | Function output | invoiceLineId, deltaPct, band, verdict | `forInvoiceLine`, `requiresApproval`, `hasProofArtifact` |\n| `CostAllocation` | ERP/Controlling table | costCenter, priceCenter, amount, currency | `allocatesInvoiceLine`, `chargedToParty` |\n| `DEMDETClock` | Port/customs/DO/gate event table | M92, M100, free-time, billable hours | `forShipmentUnit`, `linkedToInvoiceLine` |\n| `ProofArtifact` | Rule engine output | proofHash, ruleVersion, sourceHash | `provesCostGuardResult`, `wasDerivedFrom` |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#15",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "4.3 Source-System Interfaces",
    "text": "| Source | Consumed data | Cost domain action | Write-back |\n|---|---|---|---|\n| ERP / AP | invoice header, line, vendor, payment status | create/update `Invoice`, `InvoiceLine`, `CostAllocation` | audit status, approval hold, dispute reason |\n| Contract / Rate Master | contract rates, tariff rates, special approvals, validity | create/update `RateRef`, `TariffRef`, `RateValidityWindow` | rate coverage KPI, missing ref list |\n| LDG / OCR | extracted invoice line, confidence, table cells, document hash | create `CostEvidenceAssertion`; compare only after confidence gate | discrepancy list, OCR retry request |\n| Port / OFCO | `PortCall`, `ServiceEvent`, Rotation, tariff/service line | map service line to `ChargeComponent` and `TariffRef` | rate mismatch and service-evidence exception |\n| WMS | WH events, dwell, WHP, stock movement evidence | validate WH handling/storage charges | WH charge evidence gap |\n| ATLP / Customs / DO | BOE, DO release, gate-out timestamps | start/stop DEM/DET and customs cost checks | release blocker / DEMDET alert |\n| Marine / MOSB | M115/M116/M117, LCT trip, marine service event | validate MOSB/LCT/marine charges | marine cost exception |\n| Operations dashboard | route, stock, milestone, cost status | publish audited cost facts | KPI table and exception feed |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#16",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "4.4 Cost Ownership and Responsibility",
    "text": "| Cost object | Owner | Evidence source | Control rule |\n|---|---|---|---|\n| `PortCharge` | Cost domain verdict, port service evidence | `CONSOLIDATED-07` | service line must map to `ServiceEvent` or `TariffRef` |\n| `WarehouseCharge` | Cost domain verdict, WH evidence | `CONSOLIDATED-02` | WH charge requires WHP and WH event/dwell proof |\n| `MOSBCharge` | Cost domain verdict, marine/MOSB evidence | `CONSOLIDATED-04/06` | AGI/DAS or MOSB leg evidence required |\n| `MarineCharge` | Cost domain verdict, marine operation evidence | `CONSOLIDATED-04` | LCT/barge charge requires M115/M116/M117 or approved exception |\n| `DEMDETCharge` | Cost domain verdict, release/gate timestamps | `CONSOLIDATED-06/07` | free-time policy and milestone clock must be present |\n| `DutyTaxCharge` | Cost domain verdict, customs/tax evidence | `CONSOLIDATED-01/06` | BOE/value/HS/tax evidence required |\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#17",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.1 COST-GUARD Calculation Standard",
    "text": "```text\nDeltaPct = (DraftAmount - StandardAmount) / StandardAmount * 100.00\nAbsDeltaPct = ABS(DeltaPct)\n\nBand:\n  AbsDeltaPct <= 2.00          PASS\n  2.01 <= AbsDeltaPct <= 5.00  WARN\n  5.01 <= AbsDeltaPct <= 10.00 HIGH\n  AbsDeltaPct > 10.00          CRITICAL\n\nLine numeric tolerance:\n  ABS(qty * rate - lineAmount) <= 0.01\n\nInvoice total tolerance:\n  ABS(sum(lineAmount) - invoiceTotal) / invoiceTotal * 100.00 <= 2.00\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#18",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.2 Verdict Matrix",
    "text": "| Band | Δ% range | Default verdict | Action |\n|---|---:|---|---|\n| `PASS` | ≤ 2.00% | `ACCEPTABLE` | Auto-pass if all evidence gates pass |\n| `WARN` | 2.01–5.00% | `REVIEW_REQUIRED` | Cost reviewer check; no payment hold unless repeated or high-value |\n| `HIGH` | 5.01–10.00% | `FINANCE_APPROVAL_REQUIRED` | Payment hold and finance approval |\n| `CRITICAL` | > 10.00% | `REJECT` or `DISPUTED` | Immediate dispute / vendor clarification |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#19",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.3 Human-gate Triggers",
    "text": "| Trigger | Required role | Output object |\n|---|---|---|\n| `invoiceTotal > 100000.00 AED` | Finance approver | `ApprovalAction` |\n| `band IN (HIGH, CRITICAL)` | Cost Control Lead + Finance | `ApprovalAction` or `DisputeAction` |\n| rate reference missing | Cost Control Lead | `RateRefException` |\n| FX override requested | Finance approver | `FxPolicy` + proof |\n| AGI/DAS marine charge without M115/M116/M117 evidence | Marine Lead + Site Logistics | `MarineCostException` |\n| WH charge without WHP/WH event evidence | Warehouse Manager | `WarehouseCostException` |\n| permit/customs/tax evidence missing | Compliance Lead | `ComplianceCostHold` |\n| OCR confidence below threshold | Document controller | `OCRRetryTask` |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#20",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.4 SHACL — Invoice Line Numeric Integrity",
    "text": "```turtle\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix sh:   <http://www.w3.org/ns/shacl#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n\nhvdc:InvoiceLineNumericShape a sh:NodeShape ;\n  sh:targetClass hvdc:InvoiceLine ;\n  sh:property [ sh:path hvdc:qty ; sh:datatype xsd:decimal ; sh:minInclusive 0.00 ; sh:minCount 1 ] ;\n  sh:property [ sh:path hvdc:rate ; sh:datatype xsd:decimal ; sh:minInclusive 0.00 ; sh:minCount 1 ] ;\n  sh:property [ sh:path hvdc:lineAmount ; sh:datatype xsd:decimal ; sh:minInclusive 0.00 ; sh:minCount 1 ] ;\n  sh:sparql [\n    sh:message \"COST-GUARD: InvoiceLine lineAmount must equal qty * rate within 0.01.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:qty ?qty ; hvdc:rate ?rate ; hvdc:lineAmount ?amount .\n        BIND(ABS((?qty * ?rate) - ?amount) AS ?delta)\n        FILTER(?delta > 0.01)\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#21",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.5 SHACL — Invoice Total Integrity",
    "text": "```turtle\nhvdc:InvoiceTotalShape a sh:NodeShape ;\n  sh:targetClass hvdc:Invoice ;\n  sh:sparql [\n    sh:message \"COST-GUARD: Sum of lineAmount must match invoiceTotal within 2.00%.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:invoiceTotal ?total .\n        {\n          SELECT $this (SUM(?lineAmount) AS ?sumLine) WHERE {\n            $this hvdc:hasInvoiceLine ?line .\n            ?line hvdc:lineAmount ?lineAmount .\n          } GROUP BY $this\n        }\n        BIND(ABS(?sumLine - ?total) / ?total * 100.00 AS ?deltaPct)\n        FILTER(?deltaPct > 2.00)\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#22",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.6 SHACL — CostGuard Band Assignment",
    "text": "```turtle\nhvdc:CostGuardBandShape a sh:NodeShape ;\n  sh:targetClass hvdc:CostGuardResult ;\n  sh:property [\n    sh:path hvdc:band ;\n    sh:in (\"PASS\" \"WARN\" \"HIGH\" \"CRITICAL\") ;\n    sh:minCount 1 ;\n  ] ;\n  sh:property [\n    sh:path hvdc:deltaPct ;\n    sh:datatype xsd:decimal ;\n    sh:minCount 1 ;\n  ] .\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#23",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.7 SPARQL — Missing Rate Reference",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?invoice ?line ?chargeDesc ?amount\nWHERE {\n  ?invoice hvdc:hasInvoiceLine ?line .\n  ?line hvdc:chargeDesc ?chargeDesc ; hvdc:lineAmount ?amount .\n  FILTER NOT EXISTS { ?line hvdc:usesRateRef ?rateRef . }\n}\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#24",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.8 SPARQL — MOSB/Marine Charge Without Route Evidence",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?invoice ?line ?unit ?pattern\nWHERE {\n  ?invoice hvdc:hasInvoiceLine ?line ; hvdc:linkedToShipmentUnit ?unit .\n  ?line hvdc:forChargeComponent ?charge .\n  ?charge hvdc:chargeType ?chargeType .\n  ?unit hvdc:hasRoutingPattern ?pattern .\n  FILTER(?chargeType IN (\"MOSB_STAGING\", \"LCT_BARGE\", \"MARINE_SUPPORT\"))\n  FILTER(?pattern NOT IN (\"MOSB_DIRECT\", \"WH_MOSB\", \"MIXED\"))\n}\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#25",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.9 SPARQL — WH Charge Without WH Evidence",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?invoice ?line ?unit\nWHERE {\n  ?invoice hvdc:hasInvoiceLine ?line ; hvdc:linkedToShipmentUnit ?unit .\n  ?line hvdc:forChargeComponent ?charge .\n  ?charge hvdc:chargeType ?chargeType .\n  FILTER(?chargeType IN (\"WAREHOUSE_HANDLING\", \"WAREHOUSE_STORAGE\"))\n  FILTER NOT EXISTS { ?line hvdc:readsWarehouseEvidence ?whp . }\n  FILTER NOT EXISTS { ?unit hvdc:hasMilestone ?m110 . ?m110 hvdc:milestoneCode \"M110\" . }\n}\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#26",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.10 SPARQL — DEM/DET Clock Risk After DO Release",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?unit ?m92Actual ?m100Actual ?billableHours\nWHERE {\n  ?unit hvdc:hasMilestone ?m92 .\n  ?m92 hvdc:milestoneCode \"M92\" ; hvdc:actualDt ?m92Actual .\n  OPTIONAL {\n    ?unit hvdc:hasMilestone ?m100 .\n    ?m100 hvdc:milestoneCode \"M100\" ; hvdc:actualDt ?m100Actual .\n  }\n  OPTIONAL { ?unit hvdc:hasDEMDETClock ?clock . ?clock hvdc:billableHours ?billableHours . }\n  FILTER(!BOUND(?m100Actual) || ?billableHours > 0.00)\n}\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#27",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.11 SPARQL — High-value Approval Requirement",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?invoice ?total ?currency\nWHERE {\n  ?invoice a hvdc:Invoice ; hvdc:invoiceTotal ?total ; hvdc:currency ?currency .\n  FILTER(?currency = \"AED\" && ?total > 100000.00)\n  FILTER NOT EXISTS { ?invoice hvdc:hasApprovalAction ?approval . }\n}\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#28",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.12 PRISM.KERNEL Audit Proof",
    "text": "PRISM.KERNEL is the fixed audit trace format. It stores a 5-line recap plus a JSON proof artifact.\n\n```json\n{\n  \"prismKernelVersion\": \"2.0-final\",\n  \"recap\": [\n    \"Invoice: INV-2026-001 | Vendor: DSV Logistics | Currency: AED | Total: 98000.00\",\n    \"Line: 10 | Charge: TRUCKING | Lane: Khalifa Port -> MIR | Qty: 4.00 | UOM: TRUCK\",\n    \"DraftAmount: 9800.00 | StandardAmount: 10000.00 | DeltaPct: -2.00 | Band: PASS\",\n    \"Evidence: RateRef=RATE-AED-TRK-001 | RoutingPattern=DIRECT | FxOverride=false\",\n    \"Verdict: ACCEPTABLE | ProofHash: sha256:example-pass-20260427\"\n  ],\n  \"artifact\": {\n    \"invoiceId\": \"INV-2026-001\",\n    \"invoiceLineId\": \"INV-2026-001-L10\",\n    \"currency\": \"AED\",\n    \"draftAmount\": 9800.00,\n    \"standardAmount\": 10000.00,\n    \"deltaPct\": -2.00,\n    \"band\": \"PASS\",\n    \"verdict\": \"ACCEPTABLE\",\n    \"calculation\": \"(9800.00 - 10000.00) / 10000.00 * 100.00 = -2.00\",\n    \"ruleVersion\": \"COST-GUARD-2.0-final\",\n    \"createdAt\": \"2026-04-27T00:00:00+04:00\"\n  }\n}\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#29",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "5.13 RAG and Human-gate Control",
    "text": "| Trigger | RAG / evidence refresh | Human-gate |\n|---|---|---|\n| rate table changed | Contract/rate master re-ingest; new `RateRef` validity window | Cost Control Lead |\n| Incoterm/cost owner mismatch | PO/contract evidence refresh | Finance + Contract owner |\n| MOIAT/FANR/DCD/ADNOC permit cost blocker | latest approved SOP / authority evidence / project permit register | Compliance Lead |\n| DEM/DET claim | DO release, gate-out, terminal free-time proof | Logistics + Finance |\n| marine/MOSB charge | M115/M116/M117, LCT trip, marine approval evidence | Marine Lead |\n| OCR confidence below KPI | LDG retry or manual document validation | Document Controller |\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#30",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "6.1 Compliance Principles",
    "text": "1. Incoterms are **cost/risk responsibility controls**, not route classifiers.\n2. Customs, MOIAT, FANR, DCD/DG, ADNOC/CICPA, and site access requirements are modeled as `RegulatoryRequirement` / `PermitDocument` / `ApprovalAction` evidence; cost audit consumes these only when they affect charge responsibility or payment blocking.\n3. BOE, DO, GatePass, permit, SDS, marine PTW, and site receiving evidence remain documentary/transactional proof and are not collapsed into invoice objects.\n4. Tax/VAT values are validated against invoice evidence and the project `TaxPolicy`; the cost ontology does not hardcode external tax law as operational truth.\n5. Any authority rule or tariff table that may have changed after `2026-04-27` requires RAG refresh before production approval.",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#31",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "6.2 Incoterms Control",
    "text": "| Incoterm impact | Cost validation |\n|---|---|\n| Delivery obligation | Invoice charge owner must match PO/contract responsibility |\n| Risk transfer | Damage/claim charge must align with risk transfer point |\n| Local charges | Port/WH/customs/marine charges must be mapped to buyer/seller responsibility |\n| Insurance/freight | Freight and insurance lines require Incoterm-specific owner check |\n\n```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?shipment ?term ?invoice ?chargedTo ?expectedOwner\nWHERE {\n  ?shipment hvdc:hasIncoterm ?term ; hvdc:hasInvoice ?invoice .\n  ?term hvdc:localCostOwner ?expectedOwner .\n  ?invoice hvdc:chargedTo ?chargedTo .\n  FILTER(?chargedTo != ?expectedOwner)\n}\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#32",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "6.3 Authority and Permit Cost Controls",
    "text": "| Compliance area | Evidence consumed by cost | Blocking rule |\n|---|---|---|\n| Customs / WCO-aligned data | BOE, HS, origin, declared value, duty/tax line | duty/tax charge blocked if BOE/value evidence missing |\n| MOIAT product conformity | CoC/exemption or project compliance note | regulated-product release cost blocked if evidence missing |\n| FANR controlled material | licence/permit/compliance approval | movement/storage charge blocked until compliance approval |\n| DCD / DG | SDS, DG declaration, segregation/storage evidence | DG surcharge/storage charge blocked without DG evidence |\n| ADNOC / CICPA / access | gate pass/access approval | access/gate/marine/site charge blocked if pass missing/expired |\n| Marine / PTW / FRA | PTW, FRA, weather window, lashing/marine approval | LCT/marine charge blocked without M115/M116/M117 evidence or exception |\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#33",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "7. Options ≥3 (Pros/Cons/Cost/Risk/Time)",
    "text": "| Option | Scope | Pros | Cons | Cost | Risk | Time |\n|---|---|---|---|---:|---|---:|\n| A. Audit Lite | Line numeric integrity + invoice total + manual rate lookup | Fast deployment; low system dependency | Limited route/WH/marine validation | 40.00 hrs | Medium: manual rate drift | 5.00 days |\n| B. KG CostGuard | Full RDF/OWL object model + RateRef + CostGuardResult + PRISM proof | Strong traceability and repeatable approval | Requires rate master and identity map | 120.00 hrs | Medium: initial mapping gaps | 15.00 days |\n| C. Foundry Integrated | Foundry Object/Link/Action + ERP/WMS/Port/LDG integration | Operationally deployable; automated holds and dashboards | Higher integration load | 240.00 hrs | Medium-High: source-system readiness | 30.00 days |\n| D. Predictive Cost Control | CostGuard + anomaly model + DEM/DET forecast + TG hooks | Early overage prediction and exception management | Needs historical cost/event quality | 320.00 hrs | High: model governance and drift | 45.00 days |\n\n**Recommended path:** Option B as baseline, then Option C for production, then Option D after stable audited history is available.\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#34",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "8. Roadmap (Prepare→Pilot→Build→Operate→Scale + KPI)",
    "text": "| Phase | Work package | Output | KPI / acceptance |\n|---|---|---|---|\n| Prepare | Normalize invoice headers, line tables, charge taxonomy, rate-source registry, currency policy | `Invoice`, `InvoiceLine`, `RateRef`, `ChargeComponent` draft schema | `SchemaCoverage ≥ 95.00%`, `PIILeakage = 0.00건` |\n| Pilot | Run 1.00-month invoice sample through line numeric check, rate join, banding | CostGuard pilot report + PRISM proof | `LineNumericIntegrity = 100.00%`, `RateJoinCoverage ≥ 85.00%` |\n| Build | Connect Foundry objects, links, Functions, Actions; integrate ERP/LDG/OFCO/WMS evidence | Production-ready CostGuard pipeline | `RateRefCoverage ≥ 95.00%`, `Validation p95 < 5.00s` |\n| Operate | Apply approval holds, dispute workflow, DEM/DET alerts, monthly audit pack | Daily/weekly cost exception digest | `UnauthorizedCostLeakage = 0.00 AED`, `ApprovalSLA ≤ 48.00 hrs` |\n| Scale | Add anomaly scoring, route-cost benchmarking, vendor performance, trend dashboard | Cost intelligence layer | `OverageΔReduction ≥ 10.00%`, `DEMDETBaselineReduction ≥ 10.00%` |\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#35",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "9.1 Automation Map",
    "text": "| Automation | Trigger | Function / action | Output |\n|---|---|---|---|\n| `InvoiceIngestGuard` | new invoice document or AP record | parse header/line, attach document evidence | `Invoice` + `InvoiceLine` |\n| `RateJoinBot` | invoice line created | match `ChargeComponent + ODLane + UOM + validity` to `RateRef` | rate join / missing ref exception |\n| `CostGuardFunction` | rate join complete | compute Δ%, band, verdict | `CostGuardResult` |\n| `CurrencyLockGuard` | currency mismatch or FX request | block conversion unless `FxPolicy` exists | `CurrencyException` |\n| `PortTariffGuard` | OFCO/SAFEEN/ADP service line | validate `ServiceEvent` + `TariffRef` | port cost exception |\n| `WHChargeGuard` | WH handling/storage charge | require WHP/WH event/dwell evidence | WH cost exception |\n| `MarineChargeGuard` | MOSB/LCT/marine charge | require M115/M116/M117 or approved exception | marine cost exception |\n| `DEMDETBot` | M92 exists and M100 delayed or invoice has DEM/DET | compute clock and billable hours | DEM/DET risk alert |\n| `HighValueGate` | invoiceTotal > 100000.00 AED | create finance approval task | `ApprovalAction` required |\n| `PRISMProofBot` | any CostGuard verdict | generate proof JSON and hash | `ProofArtifact` |\n| `DailyCostDigest` | 08:00 Asia/Dubai daily | summarize WARN/HIGH/CRITICAL and missing evidence | TG/Sheet/Workshop view |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#36",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "9.2 ZERO Fail-safe",
    "text": "| 단계 | 이유 | 위험 | 요청데이터 | 다음조치 |\n|---|---|---|---|---|\n| Input gate | invoiceNo/vendor/currency/lineAmount missing | wrong entity or wrong payable | corrected invoice header/line table | block audit |\n| Rate gate | no matching `RateRef` or tariff evidence | false over/under billing | contract/tariff/quotation proof | create `RateRefException` |\n| Currency gate | invoice and rate currency differ without `FxPolicy` | false Δ% | approved FX policy and date | block CostGuard verdict |\n| Evidence gate | WH/MOSB/marine charge lacks operational evidence | payment for unperformed service | milestone/event/proof document | hold invoice line |\n| Compliance gate | permit/tax/customs blocker unresolved | regulatory or client dispute | BOE/permit/access proof | compliance review |\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#37",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "10.1 QA Checklist",
    "text": "| Check | PASS 기준 |\n|---|---|\n| Master spine alignment | `Invoice`, `InvoiceLine`, `RateRef`, `CostGuardResult`, `DEMDETClock` match `CONSOLIDATED-00` cost layer |\n| Flow boundary | cost does not own or assign `WarehouseHandlingProfile.confirmedFlowCode` |\n| Route boundary | cost reads `ShipmentRoutingPattern`; it does not create route truth |\n| Warehouse evidence | WH charges link to WHP/WH event/dwell evidence where applicable |\n| MOSB classification | MOSB charges use offshore staging/marine classes, not top-level warehouse semantics |\n| OCR boundary | LDG/OCR evidence is consumed, not treated as final verdict |\n| Port boundary | OFCO/port lines link to `PortCall`, `ServiceEvent`, `TariffRef`; CostGuard owns verdict |\n| Numeric integrity | `EA × Rate = Amount ± 0.01` and `Σ lines = invoiceTotal ± 2.00%` |\n| CostGuard band | every audited line has Δ%, band, verdict, and proof |\n| Currency | original currency preserved; FX override has approval if used |\n| Human-gate | >100000.00 AED, HIGH, CRITICAL, missing evidence, and compliance blockers require approval |\n| PII | contact phone/e-mail not embedded in routine audit proof |\n| KPI format | numeric targets and thresholds use 2.00-decimal format |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#38",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "10.2 Assumptions(가정:)",
    "text": "- `CONSOLIDATED-00-master-ontology.md` remains the semantic authority for route, milestone, evidence, and cost layer boundaries.\n- Contract/rate master and tariff tables are approved project evidence and are synchronized before CostGuard execution.\n- `RateRef` validity windows are maintained by the cost/rate owner; expired rates are not used unless a `SpecialRateRef` approval exists.\n- Currency conversion is not applied by default. Cross-currency comparison requires `FxPolicy` approval.\n- Authority-specific requirements, tariff notices, VAT/tax interpretation, and permit lead times must be refreshed by RAG/current SOP before production payment approval.\n- `FMC_OrgChart_Data.json` PII is not embedded in this document or routine proof outputs.\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#39",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "11.1 Parallel Review Lanes",
    "text": "| Pass | Review lane | Corpus checked | Finding | Patch applied | Status |\n|---:|---|---|---|---|---|\n| 1.00 | Master spine / AGENTS | `CONSOLIDATED-00`, `AGENTS.md`, review note | Cost must read route + WH evidence and must not own WH classification | Rewrote governance, frontmatter, cost-domain rule, route/WH ownership language | PASS |\n| 2.00 | WH/OCR boundary | `CONSOLIDATED-02`, `CONSOLIDATED-03`, `CONSOLIDATED-06` | WHP starts at M110/M111; OCR provides evidence only; material layer uses milestones | Added read-only WHP evidence, OCR handoff, M92/M100 and M110/M121 controls | PASS |\n| 3.00 | Port/marine/ops boundary | `CONSOLIDATED-04`, `CONSOLIDATED-07`, `CONSOLIDATED-09` | OFCO and marine events provide service evidence; dashboards consume cost facts only | Added PortTariffGuard, MarineChargeGuard, CostAllocation, ops export model | PASS |\n| 4.00 | Validation/compliance | `CONSOLIDATED-01`, `CONSOLIDATED-06`, `CONSOLIDATED-07`, master validation rules | Need master COST-GUARD bands, SHACL/SPARQL gates, high-value approval, RAG hooks | Updated bands to 2.00/5.00/10.00, added human-gate and compliance controls | PASS |\n| 5.00 | Artifact hygiene | full md corpus + semantic digital twin blueprint | Need v2.0-final frontmatter, checked_against, no canonical legacy leakage, downloadable final | Added 5-pass patch ledger, QA checklist, assumptions, CmdRec, and final file write | PASS |",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#40",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "11.2 Final Patch Summary",
    "text": "- `version` updated from `consolidated-1.1` to `2.0-final`.\n- `extension_of` updated to `hvdc-master-ontology-v2.0-final`.\n- `sub-domains` migrated away from legacy route-code framing into invoice/rate/tariff/route-cost-evidence/WH-cost-evidence/DEM-DET controls.\n- `CostGuard` bands corrected to master v2.0 threshold: PASS ≤ 2.00%, WARN 2.01–5.00%, HIGH 5.01–10.00%, CRITICAL > 10.00%.\n- USD-only calculation wording removed. Original currency preservation and explicit `FxPolicy` override added.\n- Route cost matrix now reads `ShipmentRoutingPattern`; it does not own route state.\n- Warehouse charge validation reads `WarehouseHandlingProfile.wh_handling_cnt` and WH events; it never assigns `confirmedFlowCode`.\n- MOSB charges separated into `MOSBCharge`, `MarineCharge`, `LCTCharge`, and `StagingCharge`.\n- Port/OFCO service evidence mapped to `TariffRef`, `ServiceEvent`, `PriceCenter`, and `CostCenter` without port-owned CostGuard verdict.\n- PRISM.KERNEL retained and upgraded to include `ruleVersion`, original currency, source hash, calculation hash, and approval state.",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#41",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "11.3 Legacy Term Detection Query",
    "text": "Use this query in repository QA. Hits are allowed only inside explicit deprecation/patch sections.\n\n```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?s ?p ?o\nWHERE {\n  ?s ?p ?o .\n  FILTER(CONTAINS(LCASE(STR(?p)), \"assignedflowcode\") ||\n         CONTAINS(LCASE(STR(?p)), \"extractedflowcode\") ||\n         CONTAINS(LCASE(STR(?p)), \"costbyflowcode\") ||\n         CONTAINS(LCASE(STR(?p)), \"haslogisticsflowcode\"))\n}\n```\n\n---",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-05-invoice-cost#42",
    "docId": "CONSOLIDATED-05-invoice-cost",
    "title": "hvdc-invoice-cost · CONSOLIDATED-05",
    "version": "2.0-final",
    "sectionPath": "12. CmdRec",
    "text": "```text\n/switch_mode COST-GUARD + /logi-master invoice-audit --deep --AEDonly\n```\n\n```text\n/logi-master invoice-audit --deep --KRsummary --highlight-mismatch\n```\n\n```text\n/logi-master cert-chk --deep --KRsummary\n```",
    "docHash": "6df7c7c00a8ae9f001de3694c9e4e5c434e951d2f0f3d9cc27ba8bd8e3ed2a4f",
    "domains": [
      "cost"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#1",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Material Handling Ontology — Consolidated\"\ntype: \"ontology-design\"\ndomain: \"material-handling\"\nsub-domains:\n  - customs-release\n  - inland-haulage\n  - warehouse-interface\n  - mosb-offshore-staging\n  - marine-heavy-lift-interface\n  - site-receiving\n  - inspection-claims\n  - material-issue\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\nextension_of: \"hvdc-master-ontology-v2.0-final\"\ncanonical_role: \"customs → release → WH → MOSB → site material-chain extension\"\nowner: \"HVDC Logistics Ontology Working Set\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - GS1-EPCIS\n  - DCSA-T&T\n  - UN/CEFACT-BSP-RDM\n  - WCO-DM\n  - ICC-Incoterms-2020\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\nsource_files:\n  - 2_EXT-08A-hvdc-material-handling-overview.md\n  - 2_EXT-08B-hvdc-material-handling-customs.md\n  - 2_EXT-08C-hvdc-material-handling-storage.md\n  - 2_EXT-08D-hvdc-material-handling-offshore.md\n  - 2_EXT-08E-hvdc-material-handling-site-receiving.md\n  - 2_EXT-08F-hvdc-material-handling-transformer.md\n  - 2_EXT-08G-hvdc-material-handling-bulk-integrated.md\nchecked_against:\n  - CONSOLIDATED-00-master-ontology.md\n  - CONSOLIDATED-01-core-framework-infra.md\n  - CONSOLIDATED-02-warehouse-flow.md\n  - CONSOLIDATED-03-document-ocr.md\n  - CONSOLIDATED-04-barge-bulk-cargo.md\n  - CONSOLIDATED-05-invoice-cost.md\n  - CONSOLIDATED-07-port-operations.md\n  - CONSOLIDATED-09-operations.md\n  - AGENTS.md\n  - HVDC Logistics Ontology Review.txt\n  - Palantir 온톨로지 기반 물류 자동화.pdf\nvalidation_passes: 5\nsemantic_patch:\n  - \"Material Handling owns milestone continuity and material-chain transactions; it does not own RoutingPattern dictionary or warehouse Flow Code.\"\n  - \"Program route truth uses ShipmentRoutingPattern + JourneyStage + JourneyLeg + MilestoneEvent.\"\n  - \"WarehouseHandlingProfile.confirmedFlowCode remains warehouse-only and is created/confirmed under CONSOLIDATED-02.\"\n  - \"MOSB is OffshoreStagingNode / MarineInterfaceNode, not Warehouse.\"\n  - \"AGI/DAS site arrival is accepted when site date exists; missing MOSB/LCT chain evidence creates AMBER/WARN backfill required.\"\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#2",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "1. ExecSummary",
    "text": "`CONSOLIDATED-06`는 HVDC Logistics KG의 **customs release → inland haulage → warehouse interface → MOSB/offshore staging → site receiving → inspection/issue/claim** material-chain extension이다. 본 문서는 `ShipmentUnit`의 물류 여정에서 자재 취급 상태를 `JourneyStage`, `JourneyLeg`, `MilestoneEvent`, `MaterialHandlingCase`, `SiteReceipt`, `InspectionEvent`, `Exception`, `Claim`으로 연결한다.\n\n비즈니스 임팩트는 **통관 후 반출 지연 차단**, **AGI/DAS MOSB 누락 방지**, **M130 현장 입고·검수·GRN 정합성 확보**, **OSD/NCR/Claim 자동 증빙 패키지 생성**, **자재 traceability와 비용/재고 결산 정확도 향상**이다.\n\n기술 해법은 `RoutingPattern`을 end-to-end route classifier로 유지하고, warehouse 내부 처리 등급은 `WarehouseHandlingProfile.confirmedFlowCode`로만 제한하며, 문서/OCR/Port/Cost/Marine 도메인은 material handling에 **evidence**만 제공하도록 분리하는 것이다.\n\nKPI 목표는 `MaterialTraceCoverage ≥ 95.00%`, `AGIDASGateCompliance = 100.00%`, `SiteReceiptDocCompleteness ≥ 98.00%`, `QuantityReconciliationAccuracy = 100.00%`, `Validation p95 < 5.00s`, `HumanGate leakage = 0.00건`이다.\n\n**ENG-KR one-liner:** Material Handling owns custody and milestone continuity; route truth remains `RoutingPattern`, warehouse handling remains `WarehouseHandlingProfile`, and documents remain evidence.\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#3",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "2.1 Master Governance Rule",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.\n2. `CONSOLIDATED-06` owns **material-chain execution continuity** between customs release, warehouse handoff, MOSB staging, site receipt, inspection, issue, and claim.\n3. Program-wide shipment visibility uses `ShipmentRoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`.\n4. `confirmedFlowCode` may exist only on `WarehouseHandlingProfile`; material handling may read `wh_handling_cnt`, `storageClass`, and WH event evidence but shall not assign warehouse Flow Code.\n5. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`; it is not a top-level `Warehouse` and shall not be used as warehouse class evidence.\n6. Port, document/OCR, cost, marine, and operations domains provide evidence or downstream analytics; they do not override material-handling transaction truth without an approved Foundry Action.\n7. Extension-local legacy route-code language is migration debt. This document uses only canonical route, stage, milestone, and evidence terms.",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#4",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "2.2 Included vs Delegated Scope",
    "text": "| Scope item | Included in CONSOLIDATED-06 | Delegated / excluded |\n|---|---|---|\n| Customs release handoff | M90/M91/M92, BOE/DO evidence, permit blocker, release gate | Detailed customs declaration schema in `CONSOLIDATED-00` / document extraction in `CONSOLIDATED-03` |\n| Inland haulage | M92→M100, gate-out, truck dispatch, custody handover, DEM/DET risk event | Carrier freight commercial audit in `CONSOLIDATED-05` |\n| Warehouse interface | M110/M111/M120/M121 continuity and evidence handoff | WHP algorithm, zone/bin, storage classification in `CONSOLIDATED-02` |\n| MOSB staging | M115 staging readiness, laydown handoff, AGI/DAS route gate | Marine stowage/stability/lashing execution in `CONSOLIDATED-04` |\n| LCT/offshore interface | M116/M117 continuity requirement and exception handling | Vessel stability, deck pressure, weather/tide final approval in `CONSOLIDATED-04` |\n| Site receiving | M130 arrival, M131 good inspection, M132 OSD inspection, M140 POD/GRN/MIS/MRS | Site construction work-pack execution outside logistics KG |\n| Exception / claim | M150 claim opened, NCR/OSDR proof pack, M160 closeout | Legal claim settlement and commercial negotiation |\n| Cost handoff | material event evidence for warehouse/marine/trucking/DEM-DET charges | RateRef, CostGuard verdict, invoice approval in `CONSOLIDATED-05` |\n| Communication evidence | approval, escalation, exception note as evidence | Communication ontology ownership in `CONSOLIDATED-08` |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#5",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "2.3 Domain Boundary Crosswalk",
    "text": "| Domain | Allowed interface with material handling | Not allowed in CONSOLIDATED-06 |\n|---|---|---|\n| Master spine | Read/write links to `ShipmentUnit`, `JourneyLeg`, `MilestoneEvent`, `SiteReceipt`, `Exception` | Redefine route dictionary, milestone dictionary, or identity policy |\n| Infrastructure | Read `LocationNode`, `Port`, `Warehouse`, `OffshoreStagingNode`, `Site`, `TransportCorridor` | Reclassify MOSB into warehouse semantics |\n| Warehouse | Read M110/M111/M120/M121 and `WarehouseHandlingProfile` evidence | Assign `confirmedFlowCode` or alter WHP algorithm |\n| Document/OCR | Consume `routeEvidence`, `destinationEvidence`, `mosbLegIndicator`, permit/doc extraction | Treat OCR extraction as transaction mutation |\n| Port | Consume `plannedRoutingPattern`, `declaredDestination`, DO/gate/release evidence | Treat `plannedRoutingPattern` as final route truth without action review |\n| Marine/Bulk | Consume M115/M116/M117, `MarineRoutingPattern`, lashing/stability readiness | Approve engineering/marine execution inside material handling |\n| Cost | Provide material event evidence to invoice audit | Own `RateRef`, `CostGuardResult`, or FX override |\n| Operations | Export timeline, inventory issue, exception, and route analytics | Replace material event state with Excel-only row status |\n| Communication | Attach `CommunicationEvent`, `ApprovalAction`, `AuditRecord` | Redefine material transaction classes |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#6",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "2.4 Migration Rules",
    "text": "| Legacy wording / pattern | Canonical replacement | Patch action |\n|---|---|---|\n| Flow Code 0~5 as customs→WH→MOSB→site route | `ShipmentRoutingPattern` + `JourneyStage` + `MilestoneEvent` | Replace in all route, KPI, and status sections |\n| Pre-arrival Flow Code | `ShipmentStatus = PLANNED/READY` or `RoutingPattern = PRE_ARRIVAL` | Remove from material-chain logic |\n| Port-provided warehouse route code | `PortCall.plannedRoutingPattern` and `declaredDestination` as evidence | Do not promote to WHP |\n| Document-derived warehouse route code | `routeEvidence`, `destinationEvidence`, `mosbLegIndicator` | Attach confidence and provenance only |\n| Cost grouped by warehouse route code | `costByRoutingPattern` + `wh_handling_cnt` evidence | Cost layer computes audit result |\n| MOSB collapsed into warehouse semantics | `OffshoreStagingNode` / `MarineInterfaceNode` | Optional storage capability only |\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#7",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "3.1 Ontology Layer Map",
    "text": "| Layer | Class / vocabulary | Purpose |\n|---|---|---|\n| Core custody | `MaterialHandlingCase`, `CustodyTransfer`, `MaterialMove`, `HandlingInstruction` | Customs-to-site custody chain |\n| Shipment link | `ShipmentUnit`, `CargoUnit`, `Container`, `Package`, `MaterialMaster` | Identity and physical material anchor |\n| Route/stage | `ShipmentRoutingPattern`, `JourneyStage`, `JourneyLeg`, `MilestoneEvent` | End-to-end visibility and timeline |\n| Customs/release | `CustomsReleaseGate`, `CustomsEntry`, `ReleaseOrder`, `BOEDocument`, `DeliveryOrderDocument` | Import release and gate-out readiness |\n| Inland transport | `InlandHaulageTask`, `GateOutEvent`, `TruckDispatch`, `TransportManifest` | M92→M100 transport execution |\n| Warehouse interface | `WarehouseTask`, `WarehouseEvent`, `WarehouseHandlingProfile`, `StockSnapshot` | M110~M121 handoff without WHP ownership |\n| MOSB/marine interface | `MOSBStagingTask`, `MarineReadinessGate`, `MarineEvent`, `MarineRoutingPattern` | M115/M116/M117 continuity for offshore delivery |\n| Site receiving | `SiteReceipt`, `InspectionEvent`, `MaterialAcceptanceRecord`, `MaterialIssueTransaction` | M130~M140 site material control |\n| Documents | `MRR`, `MRI`, `ITP`, `MAR`, `MRS`, `MIS`, `POD`, `GRN`, `OSDR`, `PermitDocument` | Documentary evidence |\n| Exception/claim | `Exception`, `Shortage`, `Damage`, `Overage`, `WrongItem`, `NCR`, `Claim` | OSD, claim, and closeout lifecycle |\n| Evidence/provenance | `VerificationResult`, `AuditRecord`, `ApprovalAction`, `ProofArtifact` | Human-gated proof trail |\n| KPI | `MaterialHandlingKPI`, `GateDelayMetric`, `AGIDASComplianceMetric`, `GRNClosureMetric` | Operations and SLA monitoring |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#8",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "3.2 Core Classes",
    "text": "| Class | Required properties | Key relations | Notes |\n|---|---|---|---|\n| `MaterialHandlingCase` | `caseId`, `caseStatus`, `currentStage`, `declaredDestination`, `routingPattern`, `openedAt` | `forShipmentUnit`, `hasCustodyTransfer`, `hasHandlingInstruction`, `hasMilestone` | One operational case per material/shipment control unit |\n| `CustodyTransfer` | `transferId`, `fromParty`, `toParty`, `transferTime`, `transferCondition`, `qtyPkg` | `forShipmentUnit`, `evidencedByDocument`, `generatesMilestone` | Handover record between broker/port/WMS/marine/site |\n| `CustomsReleaseGate` | `gateId`, `releaseStatus`, `boeRef`, `doRef`, `permitStatus`, `releasedAt` | `validatesCustomsEntry`, `requiresPermit`, `blocksMilestone` | M92 precondition for M100 |\n| `InlandHaulageTask` | `haulageTaskId`, `truckId`, `driverRefMasked`, `originNode`, `destinationNode`, `plannedPickup`, `actualGateOut` | `forJourneyLeg`, `evidencedByTransportManifest` | PII must be masked or role-tokenized |\n| `WarehouseInterfaceHandoff` | `handoffId`, `warehouseNode`, `handoffStatus`, `m110Ref`, `m121Ref` | `linksWarehouseEvent`, `readsWarehouseHandlingProfile` | Does not assign `confirmedFlowCode` |\n| `MOSBStagingTask` | `stagingTaskId`, `mosbNode`, `laydownArea`, `stagingStatus`, `readyForMarineLoad` | `generatesMilestone M115`, `requiresMarineReadinessGate` | MOSB is offshore staging, not warehouse |\n| `MarineReadinessGate` | `gateId`, `stowageReady`, `lashingReady`, `stabilityReady`, `weatherReady`, `approvalStatus` | `validatedByMarineOperation`, `blocksMilestone M117` | Final engineering approval remains human-gated |\n| `SiteReceipt` | `receiptId`, `siteCode`, `receiptType`, `arrivalTime`, `inspectionResult`, `mrrRef`, `osdrRef`, `podRef`, `grnRef` | `forShipmentUnit`, `generatesSiteDocuments`, `opensException` | Transaction object; documents are evidence |\n| `InspectionEvent` | `inspectionId`, `inspectionTime`, `inspectionResult`, `inspectorRole`, `qtyAccepted`, `qtyRejected` | `forSiteReceipt`, `evidencedByMRI`, `createsMARorOSDR` | M131/M132 driver |\n| `MaterialIssueTransaction` | `issueId`, `requestNo`, `issueNo`, `issuedQty`, `issuedTo`, `issueTime` | `evidencedByMRS`, `evidencedByMIS`, `reducesSiteStock` | M140 material issue handoff |\n| `MaterialException` | `exceptionId`, `exceptionType`, `severity`, `detectedAt`, `rootCauseStatus` | `evidencedByOSDR`, `mayOpenClaim`, `blocksCloseout` | Shortage/damage/overage/wrong item |\n| `Claim` | `claimId`, `claimType`, `claimAmount`, `claimCurrency`, `claimStatus`, `openedAt`, `closedAt` | `supportedByNCR`, `supportedByOSDR`, `linkedToInvoice` | M150/M160 chain |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#9",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "3.3 Core Properties",
    "text": "| Property | Domain → Range | Cardinality | Rule |\n|---|---|---:|---|\n| `forShipmentUnit` | `MaterialHandlingCase → ShipmentUnit` | 1..1 | Case must resolve to one shipment unit |\n| `hasCurrentStage` | `MaterialHandlingCase → JourneyStage` | 1..1 | Must follow canonical stage vocabulary |\n| `hasRoutingPattern` | `MaterialHandlingCase → ShipmentRoutingPattern` | 1..1 | Mirrors approved `ShipmentUnit.hasRoutingPattern`; no integer route code |\n| `hasMilestone` | `ShipmentUnit/MaterialHandlingCase → MilestoneEvent` | 1..N | Key events must have actual/planned timestamp |\n| `requiresReleaseGate` | `MaterialHandlingCase → CustomsReleaseGate` | 0..1 | Required before M100 for import flows |\n| `hasWarehouseHandoff` | `MaterialHandlingCase → WarehouseInterfaceHandoff` | 0..N | Required for `WH_ONLY` / `WH_MOSB` |\n| `hasMOSBStagingTask` | `MaterialHandlingCase → MOSBStagingTask` | 0..N | Required for `MOSB_DIRECT` / `WH_MOSB` / AGI/DAS |\n| `hasSiteReceipt` | `MaterialHandlingCase → SiteReceipt` | 0..N | Required at M130 |\n| `evidencedByDocument` | `CustodyTransfer/SiteReceipt/Exception → Document` | 1..N | Documents provide proof, not ownership |\n| `createdByAction` | Transaction → `ApprovalAction` | 1..N for manual override | Action must carry reviewer and reason |\n| `readsWarehouseHandlingProfile` | `WarehouseInterfaceHandoff → WarehouseHandlingProfile` | 0..1 | Read-only evidence |\n| `hasCostEvidence` | `MaterialHandlingCase → InvoiceLine/CostTransaction` | 0..N | Cost layer owns verdict |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#10",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "3.4 Canonical Route and Stage Matrix",
    "text": "| Material category | Allowed `ShipmentRoutingPattern` | Mandatory stages | Blocking rule |\n|---|---|---|---|\n| Container cargo | `DIRECT`, `WH_ONLY`, `WH_MOSB`, `MIXED` | M92→M100→M110/M130 | DO evidence required before gate-out |\n| Bulk cargo | `MOSB_DIRECT`, `WH_MOSB`, `MIXED` | M92/M100→M115→M116→M117→M130 | Marine readiness gate before M117 |\n| Transformer / OOG | `MOSB_DIRECT`, `WH_MOSB`, `MIXED` | M100/M121→M115→M116→M117→M130 | Lift/stability/lashing evidence required |\n| MIR / SHU onshore | `DIRECT`, `WH_ONLY`, `MIXED` | M92→M100→M130 or M110→M121→M130 | MOSB not required unless routing evidence says otherwise |\n| AGI / DAS offshore | `MOSB_DIRECT`, `WH_MOSB`, `MIXED` | M115→M116→M117→M130 plus site-date M130 acceptance | Site date creates delivered M130; missing MOSB/LCT chain is AMBER/WARN backfill |\n| Dangerous Goods | Any allowed route with DG control | Permit/DCD/FANR/DG storage checks | Permit or segregation failure blocks M100/M110/M115 |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#11",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "3.5 Milestone Chain",
    "text": "| Milestone | Name | Stage | Material-handling meaning | Required evidence |\n|---|---|---|---|---|\n| M40 | Export Cleared | `ORIGIN_DISPATCH` | Origin export release | Export permit / export clearance |\n| M50 | Terminal Received | `TERMINAL_HANDLING` | Port/terminal received cargo | terminal receipt / gate-in |\n| M61 | Vessel ATD / Loaded | `TERMINAL_HANDLING` | Carrier departure / load confirmation | carrier event / BL update |\n| M80 | Vessel ATA | `PORT_ENTRY` | Arrival at UAE port | carrier/port event |\n| M90 | BOE Submitted | `CUSTOMS_CLEARANCE` | Import declaration submitted | BOE document |\n| M91 | BOE Cleared | `CUSTOMS_CLEARANCE` | Customs clearance approved | customs clearance proof |\n| M92 | DO Released | `CUSTOMS_CLEARANCE` | Delivery order ready | DO / release order |\n| M100 | Gate-out | `INLAND_HAULAGE` | Port/terminal exit | gate pass / transport manifest |\n| M110 | WH Received | `WH_RECEIPT` | Physical receipt by warehouse | WMS receipt / warehouse event |\n| M111 | Put-away | `WH_STORAGE` | Zone/bin confirmed | put-away task / WHP confirmation |\n| M120 | Picked/Staged | `WH_DISPATCH` | Ready for dispatch | pick list / staging record |\n| M121 | WH Dispatched | `WH_DISPATCH` | Leaves warehouse | dispatch note / WMS event |\n| M115 | MOSB Staged | `MOSB_STAGING` | Offshore staging ready | MOSB staging record |\n| M116 | LCT/Barge Loaded | `OFFSHORE_TRANSIT` | Loaded for offshore transit | load confirmation / stowage evidence |\n| M117 | Sail-away Approved | `OFFSHORE_TRANSIT` | Marine release approved | sail-away approval / weather gate |\n| M130 | Site Arrived | `SITE_RECEIVING` | Material arrived at site | delivery note / MRR |\n| M131 | Site Inspected — Good | `SITE_RECEIVING` | Accepted as good | MRI / MAR |\n| M132 | Site Inspected — OSD | `SITE_RECEIVING` | Shortage, damage, overage, or wrong item | OSDR / photos / NCR evidence |\n| M140 | POD / GRN / Material Issue | `MATERIAL_ISSUE` | Receipt closed or issued | POD / GRN / MRS / MIS |\n| M150 | Claim Opened | `CLOSEOUT` | Claim/NCR case opened | claim file / NCR / OSDR |\n| M160 | Closed | `CLOSEOUT` | Claim/cost/material case closed | closure approval |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#12",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "3.6 RDF/OWL Skeleton",
    "text": "```turtle\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix sh:   <http://www.w3.org/ns/shacl#> .\n@prefix owl:  <http://www.w3.org/2002/07/owl#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n\nhvdc:MaterialHandlingCase a owl:Class ;\n  rdfs:label \"Material Handling Case\" ;\n  rdfs:comment \"Customs-to-site material custody case linked to one ShipmentUnit.\" .\n\nhvdc:CustomsReleaseGate a owl:Class ;\n  rdfs:label \"Customs Release Gate\" ;\n  rdfs:comment \"BOE/DO/permit-controlled gate before port gate-out.\" .\n\nhvdc:MOSBStagingTask a owl:Class ;\n  rdfs:label \"MOSB Staging Task\" ;\n  rdfs:comment \"Offshore staging task at MOSB; not a Warehouse task.\" .\n\nhvdc:SiteReceipt a owl:Class ;\n  rdfs:label \"Site Receipt\" ;\n  rdfs:comment \"Site arrival/inspection transaction evidenced by MRR/MRI/POD/GRN/OSDR.\" .\n\nhvdc:hasRoutingPattern a owl:ObjectProperty ;\n  rdfs:domain hvdc:MaterialHandlingCase ;\n  rdfs:range hvdc:ShipmentRoutingPattern .\n\nhvdc:evidencedByDocument a owl:ObjectProperty ;\n  rdfs:domain owl:Thing ;\n  rdfs:range hvdc:Document .\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#13",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "3.7 Key Rules",
    "text": "1. `MaterialHandlingCase` must resolve to exactly one `ShipmentUnit` through Any-key identity.\n2. `MaterialHandlingCase.hasRoutingPattern` must use `PRE_ARRIVAL`, `DIRECT`, `WH_ONLY`, `MOSB_DIRECT`, `WH_MOSB`, or `MIXED` only.\n3. `confirmedFlowCode` must not appear on `MaterialHandlingCase`, `SiteReceipt`, `CustomsReleaseGate`, `MOSBStagingTask`, `PortCall`, `Document`, `Invoice`, or `MarineOperation`.\n4. AGI/DAS material with a site date can reach M130 and `DeliveryStatus=DELIVERED`; missing M115/M116/M117 creates `MOSB_EVIDENCE_MISSING` with AMBER/WARN severity and backfill required.\n5. `SiteReceipt` is the transaction owner; `MRR`, `MRI`, `POD`, `GRN`, and `OSDR` are evidence documents.\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#14",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "4.1 Object Type Mapping",
    "text": "| Foundry Object Type | Source system / dataset | Key fields | Links |\n|---|---|---|---|\n| `ShipmentUnit` | ERP, freight forwarder, carrier feed, LDG | `shipmentId`, `blNo`, `containerNo`, `caseNo`, `hvdcCode` | `hasMaterialHandlingCase`, `hasDocument`, `hasMilestone` |\n| `MaterialHandlingCase` | Gold material flow dataset | `caseId`, `currentStage`, `routingPattern`, `declaredDestination` | `forShipmentUnit`, `hasSiteReceipt`, `hasException` |\n| `CustomsReleaseGate` | ATLP/eDAS/customs broker/LDG | `boeNo`, `doNo`, `releaseStatus`, `permitStatus` | `validatesCustomsEntry`, `blocksMilestone M100` |\n| `InlandHaulageTask` | TMS / forwarder / port gate feed | `truckRef`, `origin`, `destination`, `gateOutAt` | `forJourneyLeg`, `generates M100` |\n| `WarehouseInterfaceHandoff` | WMS / WH Gold dataset | `warehouseNode`, `m110At`, `m121At`, `whpRef` | `readsWarehouseHandlingProfile` |\n| `MOSBStagingTask` | ALS / marine planner / MOSB register | `mosbNode`, `stagingAt`, `laydownArea`, `readinessStatus` | `generates M115`, `requiresMarineReadinessGate` |\n| `MarineReadinessGate` | Marine extension / planning register | `stowageReady`, `lashingReady`, `stabilityReady`, `weatherReady` | `blocks M117`, `evidencedByMarineDocument` |\n| `SiteReceipt` | Site logistics / FMC / ERP | `receiptId`, `siteCode`, `arrivalAt`, `inspectionResult` | `forShipmentUnit`, `generatesSiteDocuments` |\n| `MaterialException` | Site QA/QC / OSDR / claims register | `exceptionType`, `severity`, `detectedAt`, `claimRef` | `linkedToOSDR`, `linkedToClaim`, `blocksCloseout` |\n| `CostEvidenceLink` | Invoice/CostGuard | `invoiceNo`, `invoiceLineNo`, `chargeType`, `evidenceEvent` | `supportsInvoiceLine`, `doesNotOwnVerdict` |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#15",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "4.2 Link Type Mapping",
    "text": "| Link Type | From → To | Purpose |\n|---|---|---|\n| `resolvesToShipmentUnit` | `Identifier → ShipmentUnit` | Any-key search entry |\n| `opensMaterialCase` | `ShipmentUnit → MaterialHandlingCase` | Creates operational custody case |\n| `evidencedByDocument` | `MaterialHandlingCase/CustodyTransfer/SiteReceipt → Document` | Evidence lineage |\n| `generatesMilestone` | `Task/Event → MilestoneEvent` | Timeline closure |\n| `requiresGate` | `MaterialHandlingCase → CustomsReleaseGate/MarineReadinessGate` | Blocker visibility |\n| `readsWarehouseEvidence` | `WarehouseInterfaceHandoff → WarehouseHandlingProfile` | Read-only WHP evidence |\n| `createsSiteReceipt` | `MilestoneEvent M130 → SiteReceipt` | Site transaction creation |\n| `opensException` | `InspectionEvent M132 → MaterialException` | OSD/NCR trigger |\n| `supportsCostAudit` | `MilestoneEvent/Task → InvoiceLine` | Cost evidence handoff |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#16",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "4.3 Action Workflow",
    "text": "| Action | Trigger | Writes | Hard gate |\n|---|---|---|---|\n| `CreateMaterialHandlingCase` | `ShipmentUnit` ready or M80 arrival | `MaterialHandlingCase` | ≥1 identifier and route evidence |\n| `SubmitCustomsReleaseGate` | BOE/DO/permit evidence received | `CustomsReleaseGate`, M90/M91/M92 | BOE/DO/permit document completeness |\n| `RecordGateOut` | Port gate-out event | M100, `InlandHaulageTask` | M92 exists and permit blockers cleared |\n| `RecordWHReceipt` | WMS receipt | M110, `WarehouseInterfaceHandoff` | WH route or warehouse appointment evidence |\n| `RecordMOSBStaging` | MOSB laydown confirmation | M115, `MOSBStagingTask` | AGI/DAS or MOSB-inclusive route |\n| `ApproveSailAway` | marine readiness approval | M117, `MarineReadinessGate` | M115/M116 + stowage/lashing/stability/weather readiness |\n| `RecordSiteArrival` | site receipt event | M130, `SiteReceipt` | AGI/DAS site date is accepted; missing M115/M116/M117 becomes backfill |\n| `RecordInspectionGood` | QA/QC good inspection | M131, MAR | MRR/MRI evidence |\n| `RecordInspectionOSD` | shortage/damage/overage/wrong item | M132, OSDR, `MaterialException` | photo/MRI/OSDR proof pack |\n| `CloseMaterialIssue` | POD/GRN/MRS/MIS posted | M140 | quantity reconciliation |\n| `OpenClaim` | OSD/NCR requires commercial action | M150, `Claim` | OSDR/NCR evidence |\n| `CloseClaimAndCase` | claim or discrepancy closed | M160 | approval + proof artifact |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#17",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "4.4 Source System Crosswalk",
    "text": "| Source | Consumed fields | Output in KG | Validation |\n|---|---|---|---|\n| ERP / PO / Package | PO, package, material code, incoterm, site code | `MaterialMaster`, `Package`, `ShipmentUnit` | PO/package/material link completeness |\n| LDG/OCR | CI/PL/BL/BOE/DO/MRR/POD/GRN/OSDR fields | `DocumentEntity`, evidence assertions | `MeanConf ≥ 0.92`, `TableAcc ≥ 0.98`, `NumericIntegrity = 1.00` |\n| Port / OFCO | `plannedRoutingPattern`, `declaredDestination`, gate pass, port service evidence | route evidence, service evidence, M50/M80/M92/M100 candidates | evidence-only route update |\n| ATLP/eDAS/customs broker | BOE status, HS, permit, DO release | `CustomsReleaseGate`, `CustomsEntry`, `ReleaseOrder` | BOE document not collapsed into CustomsEntry |\n| WMS | M110/M111/M120/M121, stock snapshot, WHP reference | `WarehouseInterfaceHandoff`, `StockSnapshot`, WH event links | `confirmedFlowCode` remains WHP-only |\n| ALS / Marine / MOSB | M115/M116/M117, staging, LCT, marine approval | `MOSBStagingTask`, `MarineReadinessGate`, `MarineEvent` | AGI/DAS chain gate |\n| Site / FMC / QA/QC | MRR/MRI/MAR/MRS/MIS/POD/GRN/OSDR | `SiteReceipt`, `InspectionEvent`, `MaterialIssueTransaction`, `Exception` | M130/M131/M132/M140 document gate |\n| Invoice / Cost | invoice lines, charge type, DEM/DET, trucking, WH, marine charges | `CostEvidenceLink` | CostGuard verdict remains Cost domain |\n| Communication evidence | approval emails/chat/actions | `CommunicationEvent`, `ApprovalAction`, `AuditRecord` | evidence-only, PII masked |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#18",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "4.5 Foundry Pipeline",
    "text": "```text\nBronze  : raw ERP/WMS/ATLP/LDG/Port/MOSB/Site/Invoice records + immutable source lineage\nSilver  : normalized identifiers, dates, units, site codes, route evidence, document entities\nGold    : ShipmentUnit, MaterialHandlingCase, MilestoneEvent, SiteReceipt, Exception, CostEvidenceLink\nActions : controlled writes for M100/M110/M115/M117/M130/M132/M140/M150/M160\nViews   : Any-key trace, route gate board, AGI/DAS blocker, site GRN closure, OSD/NCR dashboard\n```\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#19",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.1 SHACL Control Matrix",
    "text": "| Rule ID | Target | Logic | Severity |\n|---|---|---|---|\n| `MH-IDENT-001` | `MaterialHandlingCase` | exactly one `forShipmentUnit` and ≥1 identifier | BLOCK |\n| `MH-ROUTE-001` | `MaterialHandlingCase` | valid `ShipmentRoutingPattern` enum only | BLOCK |\n| `MH-FLOW-001` | any subject with `confirmedFlowCode` | subject must be `WarehouseHandlingProfile` | BLOCK |\n| `MH-CUSTOMS-001` | `CustomsReleaseGate` | BOE and DO evidence required before M100 | BLOCK |\n| `MH-PERMIT-001` | regulated material | permit/certificate not expired at gate event | BLOCK |\n| `MH-DEMDET-001` | M92→M100 | alert if gate-out not completed within 72.00 hrs after DO release | WARN/HIGH |\n| `MH-WH-001` | `WH_ONLY` / `WH_MOSB` | M110 required before WH stock appears | BLOCK |\n| `MH-MOSB-001` | AGI/DAS | M130 site date is accepted; missing M115/M116/M117 creates `MOSB_EVIDENCE_MISSING` | WARN/AMBER |\n| `MH-MARINE-001` | M117 | marine readiness gate must pass or carry approved exception | BLOCK |\n| `MH-SITE-001` | `SiteReceipt` | M130 must link site code and delivery evidence | BLOCK |\n| `MH-OSD-001` | M132 | OSDR + photo/inspection evidence required | BLOCK |\n| `MH-GRN-001` | M140 | POD/GRN/MIS/MRS must reconcile quantities | BLOCK |\n| `MH-COST-001` | `CostEvidenceLink` | material event evidence may support InvoiceLine, not CostGuard verdict ownership | WARN/BLOCK |\n| `MH-EVID-001` | evidence records | document/communication evidence cannot mutate transaction without approved Action | BLOCK |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#20",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.2 SHACL — MaterialHandlingCase Required Shape",
    "text": "```turtle\nhvdc:MaterialHandlingCaseRequiredShape a sh:NodeShape ;\n  sh:targetClass hvdc:MaterialHandlingCase ;\n  sh:property [\n    sh:path hvdc:forShipmentUnit ;\n    sh:minCount 1 ; sh:maxCount 1 ;\n    sh:message \"MaterialHandlingCase must resolve to exactly one ShipmentUnit.\" ;\n  ] ;\n  sh:property [\n    sh:path hvdc:hasRoutingPattern ;\n    sh:minCount 1 ;\n    sh:in (hvdc:PRE_ARRIVAL hvdc:DIRECT hvdc:WH_ONLY hvdc:MOSB_DIRECT hvdc:WH_MOSB hvdc:MIXED) ;\n    sh:message \"MaterialHandlingCase must use ShipmentRoutingPattern enum only.\" ;\n  ] ;\n  sh:property [\n    sh:path hvdc:hasCurrentStage ;\n    sh:minCount 1 ;\n    sh:message \"MaterialHandlingCase must have a current JourneyStage.\" ;\n  ] .\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#21",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.3 SHACL — Flow Code Boundary",
    "text": "```turtle\nhvdc:MaterialHandlingFlowCodeBoundaryShape a sh:NodeShape ;\n  sh:targetSubjectsOf hvdc:confirmedFlowCode ;\n  sh:sparql [\n    sh:message \"VIOLATION-1: confirmedFlowCode found outside WarehouseHandlingProfile.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:confirmedFlowCode ?code .\n        FILTER NOT EXISTS { $this a hvdc:WarehouseHandlingProfile }\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#22",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.4 SHACL — Customs Release Before Gate-out",
    "text": "```turtle\nhvdc:GateOutRequiresReleaseShape a sh:NodeShape ;\n  sh:targetClass hvdc:MaterialHandlingCase ;\n  sh:sparql [\n    sh:message \"M100 Gate-out requires M92 DO Released and cleared permit blockers.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:hasMilestone ?m100 .\n        ?m100 hvdc:milestoneCode \"M100\" ; hvdc:actualDt ?gateOut .\n        FILTER NOT EXISTS {\n          $this hvdc:hasMilestone ?m92 .\n          ?m92 hvdc:milestoneCode \"M92\" ; hvdc:actualDt ?doReleased .\n        }\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#23",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.5 SHACL — AGI/DAS MOSB + LCT Chain",
    "text": "```turtle\nhvdc:AGIDASMaterialChainShape a sh:NodeShape ;\n  sh:targetClass hvdc:MaterialHandlingCase ;\n  sh:sparql [\n    sh:message \"VIOLATION-2: AGI/DAS Site Arrival requires MOSB/LCT chain evidence or approved exception.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:declaredDestination ?dest ;\n              hvdc:hasRoutingPattern ?rp ;\n              hvdc:hasMilestone ?m130 .\n        FILTER(?dest IN (\"AGI\", \"DAS\"))\n        FILTER(?rp IN (hvdc:MOSB_DIRECT, hvdc:WH_MOSB, hvdc:MIXED))\n        ?m130 hvdc:milestoneCode \"M130\" ; hvdc:actualDt ?siteArrived .\n        FILTER NOT EXISTS {\n          $this hvdc:hasMilestone ?m115 .\n          ?m115 hvdc:milestoneCode \"M115\" ; hvdc:actualDt ?mosbStaged .\n        }\n        FILTER NOT EXISTS {\n          $this hvdc:hasApprovedException ?ex .\n          ?ex hvdc:exceptionType \"AGIDAS_MOSB_BYPASS\" ; hvdc:approvalStatus \"APPROVED\" .\n        }\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#24",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.6 SHACL — OSD Requires OSDR",
    "text": "```turtle\nhvdc:OSDRequiresOSDRShape a sh:NodeShape ;\n  sh:targetClass hvdc:SiteReceipt ;\n  sh:sparql [\n    sh:message \"M132 OSD inspection requires OSDR evidence and exception record.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:inspectionResult \"OSD\" .\n        FILTER NOT EXISTS { $this hvdc:osdrRef ?osdr . }\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#25",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.7 SHACL — Quantity Reconciliation",
    "text": "```turtle\nhvdc:SiteQuantityReconciliationShape a sh:NodeShape ;\n  sh:targetClass hvdc:SiteReceipt ;\n  sh:sparql [\n    sh:message \"Received + OSD quantity must reconcile with dispatched quantity within 0.00 tolerance unless approved variance exists.\" ;\n    sh:select \"\"\"\n      PREFIX hvdc: <http://samsung.com/project-logistics#>\n      SELECT $this WHERE {\n        $this hvdc:dispatchedQty ?dq ; hvdc:acceptedQty ?aq ; hvdc:osdQty ?oq .\n        BIND(ABS(?dq - (?aq + ?oq)) AS ?delta)\n        FILTER(?delta > 0.00)\n        FILTER NOT EXISTS { $this hvdc:hasApprovedVariance ?variance . }\n      }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#26",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.8 SPARQL — Gate-out Delay After DO Release",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nPREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>\n\nSELECT ?case ?shipment ?doReleased ?gateOut\nWHERE {\n  ?case a hvdc:MaterialHandlingCase ; hvdc:forShipmentUnit ?shipment ; hvdc:hasMilestone ?m92 .\n  ?m92 hvdc:milestoneCode \"M92\" ; hvdc:actualDt ?doReleased .\n  OPTIONAL { ?case hvdc:hasMilestone ?m100 . ?m100 hvdc:milestoneCode \"M100\" ; hvdc:actualDt ?gateOut . }\n  FILTER(!BOUND(?gateOut) || (?gateOut > ?doReleased + \"PT72H\"^^xsd:dayTimeDuration))\n}\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#27",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.9 SPARQL — M140 Missing POD/GRN",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?receipt ?shipment\nWHERE {\n  ?case a hvdc:MaterialHandlingCase ; hvdc:forShipmentUnit ?shipment ; hvdc:hasSiteReceipt ?receipt .\n  ?receipt hvdc:hasMilestone ?m140 .\n  ?m140 hvdc:milestoneCode \"M140\" ; hvdc:actualDt ?closed .\n  FILTER NOT EXISTS { ?receipt hvdc:podRef ?pod . }\n  FILTER NOT EXISTS { ?receipt hvdc:grnRef ?grn . }\n}\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#28",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.10 SPARQL — Legacy Term Detection",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nSELECT ?s ?p ?o\nWHERE {\n  ?s ?p ?o .\n  FILTER(REGEX(LCASE(STR(?p)), \"(assigned|extracted).*flow.*code\") ||\n         REGEX(LCASE(STR(?p)), \"cost.*flow.*code\") ||\n         REGEX(LCASE(STR(?p)), \"logistics.*flow.*code\"))\n}\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#29",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.11 RAG Check",
    "text": "| Trigger | RAG / latest-evidence action | Human gate |\n|---|---|---|\n| MOIAT/FANR/DCD/ADNOC rule or permit mismatch | Re-check approved SOP / authority source on action date | Compliance Lead |\n| HS/BOE classification confidence < 0.95 | Review BOE/CI/PL/COO and broker note | Customs Lead |\n| AGI/DAS M130 without M115/M116/M117 | Backfill MOSB/LCT evidence; delivery remains accepted when site date exists | Marine Lead + Site Logistics |\n| OOG/heavy cargo missing weight, dimension, COG, lift point | Request engineering document pack | Heavy Lift Engineer |\n| M132 OSD with high-value material | Require photo/MRI/OSDR/NCR pack | QA/QC + Claims |\n| Invoice/DEM/DET charge linked to delayed gate-out | Reconcile M92/M100 timestamps and rate master | Cost Control Lead |\n| OCR confidence below threshold | Re-extract or manual document validation | Data Steward |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#30",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "5.12 Human-gate Matrix",
    "text": "| Gate | Trigger | Approver | Required proof |\n|---|---|---|---|\n| Customs gate | BOE/DO/permit missing or expired | Customs / Compliance Lead | BOE, DO, permit/certificate |\n| Warehouse gate | WHP override or special storage | Warehouse Manager | M110/M111 evidence, storage note |\n| Marine gate | M117 approval or OOG/heavy lift | Marine Lead / Engineer / HSE | stowage, lashing, stability, weather, PTW |\n| AGI/DAS gate | M130/site date with incomplete MOSB chain | Marine Lead + Site Logistics | backfill M115/M116/M117 evidence |\n| Site OSD gate | M132 OSD | QA/QC + Claims | OSDR, photos, MRI, NCR |\n| Cost gate | high DEM/DET, WH, marine, trucking dispute | Cost Control Lead | milestone evidence + invoice line |\n| Privacy gate | personnel contact evidence | Data Steward | masked contact/token only |\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#31",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "6.1 Compliance Object Model",
    "text": "| Object | Required properties | Links |\n|---|---|---|\n| `RegulatoryRequirement` | `authority`, `requirementType`, `triggerCondition`, `effectiveDate`, `status` | applies to `MaterialMaster`, `ShipmentUnit`, `LocationNode`, `Site` |\n| `PermitDocument` | `permitNo`, `authority`, `permitType`, `issueDate`, `expiryDate` | evidences requirement |\n| `ComplianceCheck` | `checkId`, `ruleId`, `result`, `checkedAt`, `checkedByRole` | validates gate/action |\n| `AccessPermit` | `permitNo`, `siteCode`, `validFrom`, `validTo`, `holderToken` | controls ADNOC/CICPA/site access |\n| `ApprovalAction` | `approvalRef`, `approverRole`, `approvedAt`, `decision`, `reason` | authorizes exception or override |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#32",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "6.2 Incoterms 2020 Controls",
    "text": "| Control | Logic | Material-handling impact |\n|---|---|---|\n| `IncotermPresence` | PO/shipment must carry incoterm and named place | Owner of transport risk is clear at each `JourneyLeg` |\n| `RiskTransferPoint` | Risk transfer must match incoterm-defined point | Damage/shortage liability is linked to correct custody transfer |\n| `CostResponsibility` | InvoiceLine charge owner must match PO/incoterm | DEM/DET, trucking, marine, WH charge dispute evidence is traceable |\n| `DeliveryObligation` | Site delivery / named place must match `declaredDestination` | Route exception and M130 mismatch become review items |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#33",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "6.3 UAE Regulatory Controls",
    "text": "| Authority / topic | Ontology handling | Blocking point |\n|---|---|---|\n| MOIAT | `requiresMOIATCoC`, `certificateRef`, `certificateExpiryDate`, `productCategory` | M91/M92 or M100 if certificate missing/expired |\n| FANR | `requiresFANRPermit`, `radiationSourceFlag`, `permitRef`, `permitExpiryDate` | M90/M91/M100 and DG/controlled storage |\n| DCD / Dangerous Goods | `dgClass`, `UNNumber`, `segregationGroup`, `dangerousCargoWarehouseRequired` | M100/M110/M115 staging |\n| ADNOC / CICPA / Site Access | `AccessPermit`, `GatePass`, `SecurityApproval`, `LocationNode.governedBy` | M100, M115, M130 |\n| WCO / HS | `hsCode`, `classificationConfidence`, `customsRiskScore`, `CustomsEntry` | BOE submission and clearance |\n| Port / Marine / HSE | PTW, JSA/TRA, lifting permit, working-over-water permit | M115/M116/M117 |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#34",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "6.4 Compliance Blockers",
    "text": "```text\nIF regulated material AND permit missing/expired           → BLOCK M90/M91/M100\nIF DG cargo AND DCD/DG segregation evidence missing        → BLOCK M110/M115\nIF AGI/DAS AND site date exists but MOSB/LCT evidence missing → ACCEPT M130, DELIVERED, AMBER/WARN backfill\nIF OOG/heavy cargo AND lift/stability/lashing pack missing → BLOCK M116/M117\nIF Site access permit missing                              → BLOCK M130\nIF OCR/confidence evidence below threshold                 → HUMAN-GATE before action write\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#35",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "6.5 Privacy and NDA Guard",
    "text": "1. Personnel names may be retained when operationally required, but phone/e-mail fields must be masked before register write.\n2. Driver and site access holders should be represented by `holderToken` or role reference unless explicit operational approval exists.\n3. Communication evidence should link to `CommunicationEvent` and `AuditRecord`; it must not expose raw PII in dashboard extracts.\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#36",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "7. Options ≥3 (Pros/Cons/Cost/Risk/Time)",
    "text": "| Option | Description | Pros | Cons | Est. cost | Risk | Time |\n|---|---|---|---|---:|---|---:|\n| A. Baseline Material Gate | M92/M100/M110/M130/M140 milestone and document gate only | 빠른 적용, 기존 Excel/WMS/LDG 연동 용이 | Marine/OOG gate는 수동 검토 의존 | 35,000.00 AED | Medium | 2.00 weeks |\n| B. Operational Material Twin | MaterialHandlingCase + CustodyTransfer + SiteReceipt + OSD/NCR graph | Any-key traceability, AGI/DAS/MOSB 차단 자동화, site GRN 정합성 강화 | 객체/링크 설계와 Actions 필요 | 95,000.00 AED | Medium | 6.00 weeks |\n| C. Marine-linked Material Twin | B + MOSB/LCT/stowage/lashing/stability/weather gates | AGI/DAS offshore delivery 리스크 감소, M115→M117→M130 완전성 강화 | Marine engineering evidence 품질 의존 | 165,000.00 AED | High | 8.00 weeks |\n| D. CostGuard-linked Control | B + invoice/DEM-DET/WH/marine charge evidence link | Cost dispute 대응력 향상, DEM/DET 조기경보 | RateRef/CostGuard 도메인과 동기화 필요 | 120,000.00 AED | Medium | 7.00 weeks |\n\n**Recommended path:** Option B를 base로 적용하고, AGI/DAS·OOG 물량은 Option C gate를 우선 붙인다. DEM/DET와 WH/marine charge dispute가 많은 월에는 Option D를 병행한다.\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#37",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "8. Roadmap (Prepare→Pilot→Build→Operate→Scale + KPI)",
    "text": "| Phase | Duration | Work package | KPI / Exit criterion | Owner |\n|---|---:|---|---|---|\n| Prepare | 1.00 week | source inventory, identifier dictionary, route/stage/milestone alignment, legacy term scan | Required source coverage ≥ 95.00%; forbidden route-code leakage = 0.00 | Data Steward / Ontology Lead |\n| Pilot | 2.00 weeks | 1 port, 1 warehouse, 1 AGI/DAS route, 1 MIR/SHU route, 1 OSD case replay | M92→M100→M130 trace completeness ≥ 95.00%; AGI/DAS gate = 100.00% | Logistics Ops |\n| Build | 4.00 weeks | Foundry Object/Link Types, Actions, SHACL/SPARQL gates, site documents and claim workflow | Validation p95 < 5.00s; SiteReceiptDocCompleteness ≥ 98.00% | Digital / Foundry Team |\n| Operate | ongoing | daily blocker board, DEM/DET alert, OSD/NCR pack, GRN closure, human-gate review | DEM/DET alert lead time ≥ 72.00 hrs; HumanGate leakage = 0.00건 | Logistics Control Tower |\n| Scale | 6.00 weeks | marine-linked gates, CostGuard evidence, route risk analytics, site issue dashboard | MaterialTraceCoverage ≥ 98.00%; QuantityReconciliationAccuracy = 100.00% | PMO / Cost / Marine |\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#38",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "9.1 Foundry Functions",
    "text": "| Function | Input | Output | Gate |\n|---|---|---|---|\n| `resolveAnyKey` | BL/container/DO/invoice/case/HVDC code | `ShipmentUnit` + confidence | confidence < 0.95 → review |\n| `computeCurrentStage` | milestone events | `JourneyStage` | missing predecessor → blocker |\n| `validateMaterialGate` | case + docs + permits + milestones | pass/warn/block | action submit gate |\n| `validateAGIDASGate` | destination + route + M115/M116/M117/M130 | pass/warn | M130 acceptance + MOSB backfill gate |\n| `openOSDRClaimPack` | M132 + inspection evidence | OSDR/NCR/Claim draft | QA/QC approval |\n| `linkCostEvidence` | M92/M100/M110/M115/M130 events + invoice lines | cost evidence link | CostGuard remains cost domain |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#39",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "9.2 RPA Hooks",
    "text": "| Hook | Trigger | Action |\n|---|---|---|\n| `ATLPReleaseSync` | BOE/DO status change | update `CustomsReleaseGate`, create M90/M91/M92 candidate |\n| `GateOutBot` | port gate-out feed | create M100 candidate; alert if M92 missing |\n| `WMSReceiptBot` | WMS receipt | create M110 candidate; open WHP handoff reference |\n| `MOSBStagingBot` | M121 or direct M100 for AGI/DAS | open M115 staging checklist |\n| `MarineReadinessBot` | M115 completed | request stowage/lashing/stability/weather proof before M117 |\n| `SiteReceiptBot` | site delivery note / MRR | create M130/SiteReceipt candidate |\n| `OSDRClaimBot` | M132 / OSDR upload | create exception, NCR/claim draft, proof artifact |\n| `GRNClosureBot` | POD/GRN posted | close M140 if quantities reconcile |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#40",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "9.3 LLM Guardrail",
    "text": "1. LLM may summarize CI/PL/BL/BOE/DO/MRR/MRI/POD/GRN/OSDR and propose evidence links.\n2. LLM shall not write M100/M110/M115/M117/M130/M140 directly without an approved Action.\n3. LLM must preserve original unit/currency/date strings and normalized values separately.\n4. LLM output must include confidence, source document, page/field reference, and reviewer requirement when confidence < 0.92.\n5. Any regulated material, high-value material, OOG/heavy lift, or AGI/DAS exception requires human-gate.",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#41",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "9.4 Sheets / Excel Mapping",
    "text": "| Sheet / dataset | Required normalized columns |\n|---|---|\n| Shipment tracker | `shipmentUnitId`, `caseNo`, `blNo`, `containerNo`, `routingPattern`, `declaredDestination`, `currentStage` |\n| Port/customs | `boeNo`, `doNo`, `m92Actual`, `m100Actual`, `permitStatus`, `gatePassStatus` |\n| Warehouse | `m110Actual`, `m111Actual`, `m120Actual`, `m121Actual`, `whpRef`, `stockStatus` |\n| MOSB/marine | `m115Actual`, `m116Actual`, `m117Actual`, `marineGateStatus`, `lctVoyageNo` |\n| Site | `m130Actual`, `m131Actual`, `m132Actual`, `m140Actual`, `mrrNo`, `mriNo`, `podNo`, `grnNo`, `osdrNo` |\n| Cost evidence | `invoiceNo`, `invoiceLineNo`, `chargeType`, `evidenceMilestone`, `costGuardRef` |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#42",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "9.5 TG / Alert Hooks",
    "text": "| Alert | Condition | Recipient role |\n|---|---|---|\n| `DO_RELEASE_NO_GATEOUT` | M92 actual + 72.00 hrs and no M100 | Port / Customs / Transport Lead |\n| `AGIDAS_MISSING_MOSB` | AGI/DAS M130 accepted with missing M115/M116/M117 | Marine Lead + Site Logistics backfill |\n| `M117_BLOCKED` | marine readiness gate incomplete | Marine / HSE / Heavy Lift Engineer |\n| `OSD_OPEN` | M132 or OSDR uploaded | QA/QC + Claims |\n| `GRN_OVERDUE` | M130 + 48.00 hrs without M140 | Site Logistics |\n| `COST_EVIDENCE_MISMATCH` | invoice line lacks matching material event | Cost Control Lead |\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#43",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "10.1 QA Checklist",
    "text": "| No. | Check | Pass criterion |\n|---:|---|---|\n| 1.00 | Master spine alignment | Uses `ShipmentUnit`, `JourneyStage`, `JourneyLeg`, `MilestoneEvent` |\n| 2.00 | Route dictionary | Uses `PRE_ARRIVAL`, `DIRECT`, `WH_ONLY`, `MOSB_DIRECT`, `WH_MOSB`, `MIXED` only |\n| 3.00 | Flow Code boundary | `confirmedFlowCode` appears only as WHP read-only reference or boundary rule |\n| 4.00 | MOSB classification | MOSB is `OffshoreStagingNode` / `MarineInterfaceNode`, not Warehouse |\n| 5.00 | Document boundary | CI/PL/BL/BOE/DO/MRR/MRI/POD/GRN/OSDR are evidence, not transaction owner |\n| 6.00 | Customs release | M100 requires M92 and blocker-free permit status |\n| 7.00 | DEM/DET alert | M92→M100 delay > 72.00 hrs creates alert |\n| 8.00 | WH interface | M110/M111/M120/M121 linked without assigning `confirmedFlowCode` |\n| 9.00 | AGI/DAS gate | M130 accepted from site date; missing marine chain evidence becomes AMBER/WARN backfill |\n| 10.00 | Marine gate | M117 requires stowage/lashing/stability/weather approval or exception |\n| 11.00 | Site receipt | M130 creates/links `SiteReceipt` and MRR evidence |\n| 12.00 | Inspection outcome | M131 creates MAR; M132 creates OSDR/Exception |\n| 13.00 | Quantity reconciliation | dispatched = accepted + OSD ± 0.00 unless approved variance |\n| 14.00 | GRN closure | M140 requires POD/GRN and, where applicable, MRS/MIS |\n| 15.00 | Claim lifecycle | M150/M160 require OSDR/NCR/approval trail |\n| 16.00 | Cost handoff | material events support InvoiceLine evidence only; CostGuard verdict stays in cost domain |\n| 17.00 | PII masking | phone/e-mail/driver contact data masked or tokenized |\n| 18.00 | Validation latency | p95 < 5.00s for gate query |\n| 19.00 | Audit trail | blocked/overridden actions carry `ApprovalAction` + `AuditRecord` |\n| 20.00 | Legacy term scan | no invalid route-code terms in schema/prose |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#44",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "10.2 Assumptions(가정:)",
    "text": "1. `CONSOLIDATED-00` remains canonical; this extension does not override master spine definitions.\n2. Authority requirements and permit logic must be refreshed through RAG/current SOP before operational approval on the action date.\n3. WMS owns warehouse storage/handling detail; `CONSOLIDATED-06` only links warehouse events and WHP evidence.\n4. Marine engineering approvals are external human-gated approvals; ontology validation checks readiness and evidence consistency only.\n5. Cost rates, FX, invoice line verdicts, and CostGuard bands are owned by `CONSOLIDATED-05`.\n6. All PII in FMC/personnel/driver/contact sources is masked before dashboard or KG write.\n7. Numeric calculations use source unit and source currency unless a downstream approved policy explicitly normalizes them.",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#45",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "10.3 ZERO / Fail-safe Table",
    "text": "| 단계 | 이유 | 위험 | 요청데이터 | 다음조치 |\n|---|---|---|---|---|\n| Customs gate | BOE/DO/permit evidence missing | illegal release / port hold / DEM-DET | BOE, DO, permit, clearance timestamp | block M100 and request customs evidence |\n| WH gate | M110 event missing for WH route | phantom stock / cost mismatch | WMS receipt, WH appointment, warehouse event | block WH stock creation |\n| MOSB gate | AGI/DAS lacks M115/M116/M117 | offshore evidence gap; delivery accepted from site date | MOSB staging, LCT load, sail-away approval | accept M130 and backfill evidence |\n| Site gate | MRR/MRI/POD/GRN missing | receipt/issue mismatch | MRR, MRI, POD, GRN, MRS/MIS | block M140 closure |\n| OSD gate | OSD without OSDR/NCR proof | claim leakage | OSDR, photos, inspection report, NCR | open exception/claim and block closeout |\n| Cost gate | invoice line lacks material event evidence | overbilling / dispute | invoice line, milestone, task, rate evidence | route to CostGuard review |",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#46",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "10.4 Compatibility Patch Register — 5.00 Parallel Lanes",
    "text": "| Lane | Review focus | Patch applied | Status |\n|---:|---|---|---|\n| 1.00 | Master spine / AGENTS | Route status normalized to `RoutingPattern + JourneyStage + MilestoneEvent + JourneyLeg`; Flow Code route semantics removed | PASS |\n| 2.00 | Warehouse boundary | `WarehouseHandlingProfile.confirmedFlowCode` retained only as WHP read-only evidence; material handling cannot assign it | PASS |\n| 3.00 | Document/OCR evidence | `routeEvidence`, `destinationEvidence`, `mosbLegIndicator`, and document proof artifacts treated as evidence-only | PASS |\n| 4.00 | Marine/MOSB/site chain | MOSB kept as offshore staging; AGI/DAS M115→M116→M117→M130 gate strengthened | PASS |\n| 5.00 | Port/cost/ops integration | Port planned route, CostGuard evidence handoff, and operations analytics linked without ownership collision | PASS |\n\n---",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-06-material-chain#47",
    "docId": "CONSOLIDATED-06-material-chain",
    "title": "hvdc-material-handling · CONSOLIDATED-06",
    "version": "2.0-final",
    "sectionPath": "11. CmdRec",
    "text": "```text\n/switch_mode LATTICE + /logi-master cert-chk --deep --KRsummary\n/logi-master report --deep --AEDonly\n/visualize_data --type=heatmap CONSOLIDATED-06-validation-report.json\n```",
    "docHash": "2bc7e2807a90c333534b159a6539b501640ef99fdc4883d53539a70e8d680871",
    "domains": [
      "material"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#1",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Port Operations & OFCO Service Ontology — Consolidated\"\ntype: \"ontology-design\"\ndomain: \"port-operations\"\nsub-domains:\n  - port-call-control\n  - ofco-system\n  - port-agency\n  - terminal-services\n  - service-event-evidence\n  - tariff-reference\n  - routing-evidence\n  - release-and-gate-control\n  - dem-det-evidence\n  - bilingual-service-mapping\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\nextension_of: \"hvdc-master-ontology-v2.0-final\"\ncanonical_role: \"OFCO, PortCall, ServiceEvent, TariffRef, port-release evidence, and port-routing evidence hub\"\nowner: \"HVDC Logistics Ontology Working Set\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - GS1-EPCIS\n  - DCSA-T&T\n  - UN-CEFACT-BSP-RDM\n  - WCO-DM\n  - ICC-Incoterms-2020\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\nsource_files:\n  - 2_EXT-01-hvdc-ofco-port-ops-en.md\n  - 2_EXT-02-hvdc-ofco-port-ops-ko.md\n  - legacy_OFCO_subject_mapping_notes\nchecked_against:\n  - CONSOLIDATED-00-master-ontology.md\n  - CONSOLIDATED-01-core-framework-infra.md\n  - CONSOLIDATED-02-warehouse-flow.md\n  - CONSOLIDATED-03-document-ocr.md\n  - CONSOLIDATED-04-barge-bulk-cargo.md\n  - CONSOLIDATED-05-invoice-cost.md\n  - CONSOLIDATED-06-material-handling.md\n  - CONSOLIDATED-08-communication.md\n  - CONSOLIDATED-09-operations.md\n  - AGENTS.md\n  - HVDC Logistics Ontology Review.txt\n  - Palantir 온톨로지 기반 물류 자동화.pdf\nvalidation_passes: 5\nsemantic_patch:\n  - \"Port domain owns PortCall, PortServiceEvent, Rotation, OFCO service evidence, and port-release evidence only.\"\n  - \"Port records plannedRoutingPattern and declaredDestination as evidence; it does not own ShipmentRoutingPattern final truth or WarehouseHandlingProfile.confirmedFlowCode.\"\n  - \"MOSB is OffshoreStagingNode / MarineInterfaceNode, not Warehouse.\"\n  - \"OFCO/SAFEEN/ADP invoice/service mapping is evidence for CostGuard; final cost verdict remains in CONSOLIDATED-05.\"\n  - \"M90/M91/M92/M100 release and gate evidence is exposed to material handling, DEM/DET, and operations layers without redefining their transaction truth.\"\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#2",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "1. ExecSummary *(KR + ENG-KR one-liners)*",
    "text": "`CONSOLIDATED-07`은 HVDC Logistics KG의 **PortCall + OFCO ServiceEvent + TariffRef + port-release evidence extension**이다. 본 문서는 항만 입항, berth/channel/pilot/tug/PHC/port dues, OFCO/SAFEEN/ADP invoice evidence, Rotation 기반 identity, port clearance handoff, gate-out evidence를 `ShipmentUnit`에 연결한다.\n\n비즈니스 임팩트는 **Rotation/Invoice/Samsung Ref/HVDC Code Any-key traceability**, **항만 서비스·요율·청구 증빙 일치**, **M90→M92→M100 release delay 및 DEM/DET exposure 조기 감지**, **AGI/DAS MOSB 필요 경로의 port evidence 누락 차단**이다.\n\n기술 해법은 `PortCall`, `PortServiceEvent`, `PortRotation`, `PortClearanceCase`, `PortReleaseGate`, `TariffRef`, `PriceCenter`, `CostCenter`, `PortEvidenceAssertion`을 RDF/OWL로 정규화하고, SHACL/SPARQL gate로 identity·routing evidence·service tariff·release chronology를 검증하는 것이다.\n\nKPI 목표는 `PortCallLinkCoverage ≥ 95.00%`, `ServiceEvidenceCompleteness ≥ 98.00%`, `RoutingEvidenceAccuracy = 100.00%`, `PortInvoiceNumericIntegrity = 100.00%`, `DEMDETClockCoverage ≥ 95.00%`, `Validation p95 < 5.00s`이다.\n\n**ENG-KR one-liner:** Port owns port-call and service evidence; route truth remains in `ShipmentRoutingPattern`, warehouse handling remains in `WarehouseHandlingProfile`, and CostGuard verdict remains in invoice-cost.\n\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#3",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.1 Governance & Scope Boundary",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.\n2. `CONSOLIDATED-07` owns **PortCall**, **PortRotation**, **PortServiceEvent**, **PortClearanceCase**, **PortReleaseGate**, **PortServiceOrder**, **TariffRef**, **PriceCenter**, **CostCenter mapping evidence**, and **OFCO service proof** only.\n3. Program-wide shipment visibility uses `ShipmentRoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`.\n4. Port may record `plannedRoutingPattern`, `declaredDestination`, `offshoreTransitRequired`, and `importRoutingDecision` as evidence. Port does not assign final route truth without an approved master action.\n5. `WarehouseHandlingProfile.confirmedFlowCode` is warehouse-only and is created/confirmed under `CONSOLIDATED-02`; port never owns warehouse handling classification.\n6. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`; port may flag offshore transit requirement but must not type MOSB as Warehouse.\n7. Port service and OFCO invoice facts provide evidence for `CONSOLIDATED-05`; the final CostGuard band, approval hold, and payment decision remain outside this document.\n8. Document/OCR and communication records can attach evidence through `Document`, `VerificationResult`, `CommunicationEvent`, `ApprovalAction`, and `AuditRecord`, but they do not redefine port execution truth.",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#4",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.2 Included vs Delegated Scope",
    "text": "| Scope item | Included in CONSOLIDATED-07 | Delegated / excluded |\n|---|---|---|\n| Port call identity | Rotation, vessel/voyage, port/terminal/berth, ATA/ATD, port status | Global identifier policy in `CONSOLIDATED-00` |\n| Port services | Channel crossing, pilotage, tug, berthing, PHC, port dues, waste, FW supply, equipment, manpower, gate pass, document processing | Final AP payment and CostGuard band in `CONSOLIDATED-05` |\n| Port release handoff | BOE/DO/gate-pass evidence, M90/M91/M92/M100 timestamps, release blocker evidence | Customs declaration ownership in `CONSOLIDATED-00/06` |\n| Routing evidence | `plannedRoutingPattern`, `declaredDestination`, `offshoreTransitRequired`, `importRoutingDecision` | Final `ShipmentUnit.hasRoutingPattern` ownership in master / approved action |\n| MOSB evidence | `offshoreTransitRequired=true`, Port-to-MOSB corridor evidence, AGI/DAS route warning | MOSB staging / LCT / marine execution in `CONSOLIDATED-04/06` |\n| Tariff reference | `TariffRef`, `ServiceTariffLine`, provider/service mapping evidence | Contract negotiation and rate ownership in `CONSOLIDATED-05` |\n| Port invoice evidence | OFCO/SAFEEN/ADP invoice line evidence, subject parser, rotation linkage, amount arithmetic | Invoice object final audit, approval, payment in `CONSOLIDATED-05` |\n| Operations export | Port delay, clearance time, route evidence coverage, DEM/DET clock evidence | Dashboard aggregation in `CONSOLIDATED-09` |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#5",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.3 Domain Boundary Crosswalk",
    "text": "| Domain | Allowed interface with Port | Not allowed in CONSOLIDATED-07 |\n|---|---|---|\n| Master spine | Link `PortCall`, `PortServiceEvent`, `MilestoneEvent`, `ShipmentUnit`, `ReleaseOrder` | Redefine `ShipmentRoutingPattern`, milestone dictionary, or identity hierarchy |\n| Infrastructure | Read `Port`, `Terminal`, `Berth`, `Gate`, `TransportCorridor`, `AccessPolicy` | Promote node constraints into current authority decision without RAG/SOP evidence |\n| Warehouse | Export M100/gate-out evidence to prepare M110; read no WHP class | Assign or calculate `WarehouseHandlingProfile.confirmedFlowCode` |\n| Document/OCR | Consume BL/BOE/DO/invoice/permit evidence and OCR confidence | Let OCR mutate `PortCall` or `ReleaseOrder` without approval |\n| Marine/Bulk | Provide `offshoreTransitRequired`, port-to-MOSB evidence, cargo profile | Own M115/M116/M117 marine execution or engineering approval |\n| Cost | Export `ServiceEvent`, `TariffRef`, `PriceCenter`, `CostCenter`, OFCO line evidence | Own CostGuard result, payment hold, or AP approval |\n| Material handling | Export M90/M91/M92/M100 evidence and release blockers | Collapse material custody chain into port service history |\n| Communication | Link approval messages as evidence | Redefine logistics object classes or expose unmasked PII |\n| Operations | Export port KPIs and exception facts | Replace port evidence model with dashboard-only dimensions |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#6",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.4 Legacy Migration Rules",
    "text": "| Legacy wording / pattern | Canonical replacement | Patch action |\n|---|---|---|\n| Port-origin route code as lifecycle language | `plannedRoutingPattern` + `importRoutingDecision` | Treat as routing evidence only |\n| Port-derived warehouse handling class | `WarehouseHandlingProfile.confirmedFlowCode` under `CONSOLIDATED-02` | Remove port ownership |\n| Port invoice as final cost verdict | `PortInvoiceEvidence` → `CostEvidenceAssertion` | CostGuard remains in `CONSOLIDATED-05` |\n| MOSB modeled as warehouse destination | `OffshoreStagingNode` / `MarineInterfaceNode` | Keep offshore staging semantics |\n| Unstructured OFCO subject as transaction truth | `SubjectParseResult` + `EvidenceAssertion` | Require review/action before mutation |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#7",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.5 Ontology Layer Map",
    "text": "| Layer | Class / vocabulary | Purpose |\n|---|---|---|\n| Node | `Port`, `Terminal`, `Berth`, `Gate`, `YardArea`, `Channel`, `Anchorage` | Physical port infrastructure |\n| Core transaction | `PortCall`, `PortRotation`, `PortClearanceCase`, `PortReleaseGate`, `PortServiceOrder` | Port operation execution objects |\n| Service event | `PortServiceEvent`, `ChannelTransitEvent`, `PilotageEvent`, `TugServiceEvent`, `BerthingEvent`, `PHCEvent`, `PortDuesEvent`, `GatePassEvent`, `DocumentProcessingEvent` | Service-level operational evidence |\n| Commercial reference | `TariffRef`, `ServiceTariffLine`, `PriceCenter`, `CostCenter`, `ChargeComponentEvidence` | Rate and cost mapping evidence |\n| Identity | `Identifier`, `RotationNo`, `OFCOInvoiceNo`, `SAFEENInvoiceNo`, `ADPInvoiceNo`, `SamsungRef`, `HVDCCodeTag`, `BLNo`, `ContainerNo`, `DONo` | Any-key identity cluster |\n| Release | `BOEStatusEvidence`, `DeliveryOrderEvidence`, `GatePassEvidence`, `EIREvidence`, `ReleaseBlocker` | M90/M91/M92/M100 control |\n| Evidence | `PortEvidenceAssertion`, `VerificationResult`, `AuditRecord`, `ProofArtifact`, `CommunicationEvent` | Provenance and approval evidence |\n| KPI | `PortKPI`, `ClearanceTimeMetric`, `ServiceCoverageMetric`, `DEMDETExposureMetric` | Port performance analytics |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#8",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.6 Core Classes",
    "text": "| Class | Required properties | Key relations | Notes |\n|---|---|---|---|\n| `PortCall` | `portCallId`, `rotationNo`, `vesselName`, `portOfEntry`, `ata`, `status` | `forShipmentUnit`, `atPort`, `hasServiceEvent`, `hasReleaseGate`, `evidencedByDocument` | Primary port transaction object |\n| `PortRotation` | `rotationNo`, `carrier`, `vesselName`, `voyageNo`, `eta`, `ata`, `atd` | `identifiesPortCall`, `linkedToBL`, `linkedToInvoice` | Rotation is a strong identity key |\n| `PortServiceEvent` | `serviceEventId`, `serviceType`, `provider`, `eventTime`, `qty`, `unit`, `amount`, `currency` | `relatesToPortCall`, `usesTariffRef`, `evidencedByInvoiceLine` | Operational service evidence; not final cost verdict |\n| `PortClearanceCase` | `caseId`, `boeNo`, `clearanceStatus`, `clearedAt`, `broker`, `blockerCode` | `forShipmentUnit`, `hasBOEDocument`, `hasPermitEvidence` | M90/M91 interface |\n| `PortReleaseGate` | `gateId`, `releaseStatus`, `doNo`, `doReleasedAt`, `gatePassNo`, `gateOutAt` | `forPortCall`, `createsMilestone`, `hasReleaseBlocker` | M92/M100 interface |\n| `TariffRef` | `tariffId`, `provider`, `serviceType`, `unit`, `rate`, `currency`, `validFrom`, `validTo` | `appliesToServiceEvent`, `supportsCostEvidence` | Rate reference evidence for cost domain |\n| `PriceCenter` | `priceCenterCode`, `priceCenterName`, `serviceFamily` | `classifiesServiceEvent` | OFCO mapping dimension |\n| `CostCenter` | `costCenterCode`, `costCenterName`, `costOwner` | `classifiesChargeEvidence` | AP/cost allocation evidence |\n| `PortEvidenceAssertion` | `assertionId`, `assertionType`, `confidence`, `sourceSystem`, `createdAt` | `assertsAboutPortCall`, `wasDerivedFrom`, `reviewedByAction` | Evidence-only unless action-approved |\n| `ReleaseBlocker` | `blockerId`, `blockerType`, `severity`, `openedAt`, `resolvedAt` | `blocksPortReleaseGate`, `requiresApprovalAction` | Compliance / document / gate blocker |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#9",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.7 Object Properties",
    "text": "| Property | Domain → Range | Cardinality | Use |\n|---|---|---:|---|\n| `port:forShipmentUnit` | `PortCall` → `ShipmentUnit` | 1..n | Connect port call to operational twin |\n| `port:atPort` | `PortCall` → `Port` | 1..1 | Port of entry |\n| `port:hasTerminal` | `PortCall` → `Terminal` | 0..n | Terminal / berth routing |\n| `port:hasServiceEvent` | `PortCall` → `PortServiceEvent` | 0..n | Port service execution evidence |\n| `port:usesTariffRef` | `PortServiceEvent` → `TariffRef` | 0..1 | Rate reference |\n| `port:evidencedByInvoiceLine` | `PortServiceEvent` → `InvoiceLine` | 0..n | Invoice evidence; cost owns final audit |\n| `port:hasReleaseGate` | `PortCall` → `PortReleaseGate` | 0..1 | DO/gate-out gate |\n| `port:createsMilestone` | `PortReleaseGate` → `MilestoneEvent` | 0..n | M92/M100 link |\n| `port:declaresRoutingEvidence` | `PortCall` → `PortEvidenceAssertion` | 0..n | Planned route evidence |\n| `port:hasReleaseBlocker` | `PortReleaseGate` → `ReleaseBlocker` | 0..n | Blocker control |\n| `port:hasPriceCenter` | `PortServiceEvent` → `PriceCenter` | 0..1 | OFCO mapping |\n| `port:hasCostCenter` | `PortServiceEvent` → `CostCenter` | 0..1 | Cost allocation evidence |\n| `port:wasDerivedFrom` | `PortEvidenceAssertion` → `Document` | 1..n | PROV evidence |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#10",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.8 Datatype Properties",
    "text": "| Property | Domain | Range | Rule |\n|---|---|---|---|\n| `port:rotationNo` | `PortCall`, `PortRotation` | `xsd:string` | Required identity key if available |\n| `port:plannedRoutingPattern` | `PortCall` | SKOS enum string | Evidence only: `PRE_ARRIVAL`, `DIRECT`, `WH_ONLY`, `MOSB_DIRECT`, `WH_MOSB`, `MIXED` |\n| `port:declaredDestination` | `PortCall` | site code string | MIR/SHU/AGI/DAS or approved site code |\n| `port:offshoreTransitRequired` | `PortCall` | `xsd:boolean` | True for AGI/DAS unless exception approved |\n| `port:importRoutingDecision` | `PortCall` | enum string | `PRE_CLEARANCE`, `NORMAL`, `EXCEPTION`, `HUMAN_REVIEW` |\n| `port:ata` | `PortCall` | `xsd:dateTime` | ATA evidence |\n| `port:doReleasedAt` | `PortReleaseGate` | `xsd:dateTime` | M92 basis |\n| `port:gateOutAt` | `PortReleaseGate` | `xsd:dateTime` | M100 basis |\n| `port:serviceType` | `PortServiceEvent` | enum string | Controlled service vocabulary |\n| `port:provider` | `PortServiceEvent` | string | OFCO / SAFEEN / ADP / terminal / agency |\n| `port:amount` | `PortServiceEvent` | `xsd:decimal` | Evidence amount only |\n| `port:currency` | `PortServiceEvent` | enum string | AED/USD allowed unless explicit policy |\n| `port:qty` | `PortServiceEvent` | `xsd:decimal` | Numeric integrity required |\n| `port:unitRate` | `PortServiceEvent` | `xsd:decimal` | `qty × unitRate = amount ± 0.01` |\n| `port:serviceEvidenceConfidence` | `PortEvidenceAssertion` | `xsd:decimal` | Target ≥ 0.92 for OCR-derived evidence |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#11",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.9.1 ServiceType",
    "text": "| ServiceType | Provider examples | Cost evidence class | Notes |\n|---|---|---|---|\n| `CHANNEL_TRANSIT` | SAFEEN | `PortChargeEvidence` | Channel crossing / transit service |\n| `PORT_DUES` | ADP | `PortChargeEvidence` | Port dues and authority charges |\n| `BERTHING` | ADP / terminal | `PortChargeEvidence` | Berth usage / berthing arrangement |\n| `PILOTAGE` | Port authority / agent | `PortChargeEvidence` | Pilot / launch service |\n| `TUG_ASSIST` | Tug operator / port authority | `PortChargeEvidence` | Tugboat support |\n| `PHC_BULK_HANDLING` | Terminal / port operator | `PortChargeEvidence` | Port handling charge / bulk handling |\n| `EQUIPMENT_HIRE` | OFCO / terminal | `PortChargeEvidence` | Crane, forklift, trailer, SPMT support evidence |\n| `MANPOWER` | OFCO / terminal | `PortChargeEvidence` | Labor / stevedore evidence |\n| `GATE_PASS` | Authority / agent | `ReleaseEvidence` | Gate/access permit evidence |\n| `DOCUMENT_PROCESSING` | OFCO / broker | `ServiceEvidence` | Document handling / agency task evidence |\n| `FW_SUPPLY` | OFCO / supplier | `AtCostEvidence` | Fresh water supply evidence |\n| `CARGO_CLEARANCE_AGENCY` | OFCO / broker | `AgencyFeeEvidence` | Cargo clearance service evidence |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#12",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.9.2 PortStatus",
    "text": "| Status | Meaning | Exit condition |\n|---|---|---|\n| `PRE_ARRIVAL` | Vessel/cargo expected; port file opened | ATA/M80 evidence |\n| `ARRIVED` | PortCall ATA recorded | Customs/terminal review started |\n| `UNDER_CLEARANCE` | BOE/DO/permit review active | M91/M92 evidence |\n| `RELEASED` | DO released; release gate open | Gate-out executed |\n| `GATED_OUT` | M100 complete | Inland haulage custody active |\n| `BLOCKED` | One or more release blockers open | blocker resolved / override approved |\n| `CLOSED` | Port service and evidence package closed | Cost and operation export complete |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#13",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.9.3 ReleaseBlockerType",
    "text": "| BlockerType | Severity default | Evidence required |\n|---|---:|---|\n| `BOE_NOT_SUBMITTED` | HIGH | BOE draft/submission evidence |\n| `BOE_NOT_CLEARED` | HIGH | clearance confirmation |\n| `DO_MISSING` | HIGH | Delivery Order document |\n| `GATE_PASS_MISSING` | HIGH | gate/access pass |\n| `PERMIT_MISSING` | HIGH | MOIAT/FANR/DCD/ADNOC permit evidence where applicable |\n| `DG_OR_OOG_APPROVAL_MISSING` | HIGH | DG/OOG permit/approval |\n| `TARIFF_REF_MISSING` | WARN | TariffRef / special approval |\n| `ROUTING_EVIDENCE_GAP` | WARN | destination and route evidence |\n| `HIGH_VALUE_SERVICE` | HIGH | ApprovalAction if amount > 100,000.00 AED |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#14",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.10 RDF/OWL Skeleton",
    "text": "```turtle\n@prefix hvdc: <http://samsung.com/project-logistics#> .\n@prefix port: <http://samsung.com/project-logistics/port#> .\n@prefix cost: <http://samsung.com/project-logistics/cost#> .\n@prefix doc:  <http://samsung.com/project-logistics/document#> .\n@prefix sh:   <http://www.w3.org/ns/shacl#> .\n@prefix owl:  <http://www.w3.org/2002/07/owl#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .\n\nport:PortCall a owl:Class ;\n  rdfs:subClassOf hvdc:ExecutionTransaction ;\n  rdfs:label \"Port Call\" .\n\nport:PortServiceEvent a owl:Class ;\n  rdfs:subClassOf hvdc:ServiceEvent ;\n  rdfs:label \"Port Service Event\" .\n\nport:PortReleaseGate a owl:Class ;\n  rdfs:subClassOf hvdc:ReleaseGate ;\n  rdfs:label \"Port Release Gate\" .\n\nport:TariffRef a owl:Class ;\n  rdfs:subClassOf cost:TariffRef ;\n  rdfs:label \"Port Tariff Reference\" .\n\nport:forShipmentUnit a owl:ObjectProperty ;\n  rdfs:domain port:PortCall ;\n  rdfs:range hvdc:ShipmentUnit .\n\nport:plannedRoutingPattern a owl:DatatypeProperty ;\n  rdfs:domain port:PortCall ;\n  rdfs:range xsd:string ;\n  rdfs:comment \"Port-recorded routing evidence. It does not replace ShipmentUnit.hasRoutingPattern.\" .\n\nport:declaredDestination a owl:DatatypeProperty ;\n  rdfs:domain port:PortCall ;\n  rdfs:range xsd:string .\n\nport:offshoreTransitRequired a owl:DatatypeProperty ;\n  rdfs:domain port:PortCall ;\n  rdfs:range xsd:boolean .\n\nport:hasServiceEvent a owl:ObjectProperty ;\n  rdfs:domain port:PortCall ;\n  rdfs:range port:PortServiceEvent .\n\nport:usesTariffRef a owl:ObjectProperty ;\n  rdfs:domain port:PortServiceEvent ;\n  rdfs:range port:TariffRef .\n```",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#15",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.11 Key SHACL Rules",
    "text": "```turtle\nport:PortCallShape a sh:NodeShape ;\n  sh:targetClass port:PortCall ;\n  sh:property [ sh:path port:rotationNo ; sh:minCount 1 ; sh:message \"PortCall must carry RotationNo or approved alternate identifier.\" ] ;\n  sh:property [ sh:path port:forShipmentUnit ; sh:minCount 1 ; sh:message \"PortCall must link to at least one ShipmentUnit.\" ] ;\n  sh:property [ sh:path port:atPort ; sh:minCount 1 ; sh:message \"PortCall must identify port of entry.\" ] .\n\nport:PlannedRoutingPatternShape a sh:NodeShape ;\n  sh:targetClass port:PortCall ;\n  sh:property [\n    sh:path port:plannedRoutingPattern ;\n    sh:in (\"PRE_ARRIVAL\" \"DIRECT\" \"WH_ONLY\" \"MOSB_DIRECT\" \"WH_MOSB\" \"MIXED\") ;\n    sh:message \"plannedRoutingPattern must use ShipmentRoutingPattern vocabulary and must remain evidence-only.\"\n  ] .\n\nport:AGIDASPortEvidenceShape a sh:NodeShape ;\n  sh:targetClass port:PortCall ;\n  sh:sparql [\n    sh:message \"AGI/DAS port calls require offshoreTransitRequired=true and MOSB-compatible plannedRoutingPattern unless exception approved.\" ;\n    sh:select \"\"\"\n      PREFIX port: <http://samsung.com/project-logistics/port#>\n      SELECT $this WHERE {\n        $this port:declaredDestination ?dest .\n        FILTER(?dest IN (\"AGI\", \"DAS\"))\n        OPTIONAL { $this port:offshoreTransitRequired ?mosbFlag . }\n        OPTIONAL { $this port:plannedRoutingPattern ?pattern . }\n        OPTIONAL { $this port:hasApprovedException ?exception . }\n        FILTER(!BOUND(?exception))\n        FILTER(!BOUND(?mosbFlag) || ?mosbFlag != true || !BOUND(?pattern) || ?pattern NOT IN (\"MOSB_DIRECT\", \"WH_MOSB\", \"MIXED\"))\n      }\n    \"\"\" ;\n  ] .\n\nport:ServiceNumericIntegrityShape a sh:NodeShape ;\n  sh:targetClass port:PortServiceEvent ;\n  sh:sparql [\n    sh:message \"PortServiceEvent amount must equal qty × unitRate within 0.01 when qty and unitRate exist.\" ;\n    sh:select \"\"\"\n      PREFIX port: <http://samsung.com/project-logistics/port#>\n      SELECT $this WHERE {\n        $this port:qty ?qty ; port:unitRate ?rate ; port:amount ?amount .\n        BIND(ABS((?qty * ?rate) - ?amount) AS ?delta)\n        FILTER(?delta > 0.01)\n      }\n    \"\"\" ;\n  ] .\n\nport:NoWarehouseHandlingClassAtPortShape a sh:NodeShape ;\n  sh:targetClass port:PortCall ;\n  sh:sparql [\n    sh:message \"PortCall must not own warehouse handling classification; use WarehouseHandlingProfile in CONSOLIDATED-02.\" ;\n    sh:select \"\"\"\n      PREFIX wh: <http://samsung.com/project-logistics/warehouse#>\n      SELECT $this WHERE { $this wh:confirmedFlowCode ?code . }\n    \"\"\" ;\n  ] .\n```",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#16",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "2.12 Core Rules 3–5개",
    "text": "| Rule ID | Rule | Severity | Business effect |\n|---|---|---|---|\n| `PORT-ID-001` | Any `PortCall` must resolve to `ShipmentUnit` by Rotation, BL, Container, Samsung Ref, HVDC Code, DO, or invoice key. | BLOCK | No orphan port cost/service records |\n| `PORT-ROUTE-001` | `plannedRoutingPattern` is evidence only and must use master `ShipmentRoutingPattern` vocabulary. | BLOCK | No legacy route-code leakage |\n| `PORT-AGI-001` | AGI/DAS destination requires `offshoreTransitRequired=true` and MOSB-compatible planned pattern unless approved exception exists. | HIGH | Prevent offshore route evidence gap |\n| `PORT-REL-001` | M100 Gate-out requires M92 DO Released and gate-pass/EIR evidence. | BLOCK | Prevent unauthorized release and DEM/DET ambiguity |\n| `PORT-SVC-001` | `qty × unitRate = amount ± 0.01`; invoice total check remains with CostGuard. | HIGH | Prevent service-line overcharge / numeric drift |\n\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#17",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "3.1 Foundry Object Type Mapping",
    "text": "| Foundry Object Type | Source dataset | Key properties | Link Types |\n|---|---|---|---|\n| `PortCall` | OFCO/AD Ports/terminal call file | `rotationNo`, `vesselName`, `voyageNo`, `portOfEntry`, `ata`, `atd`, `status` | `forShipmentUnit`, `atPort`, `hasServiceEvent` |\n| `PortRotation` | carrier/agent rotation register | `rotationNo`, `carrier`, `eta`, `ata`, `voyageNo` | `identifiesPortCall`, `linkedToBL` |\n| `PortServiceEvent` | OFCO service sheet / invoice line / terminal service log | `serviceType`, `provider`, `qty`, `unitRate`, `amount`, `currency` | `relatesToPortCall`, `usesTariffRef`, `evidencedByInvoiceLine` |\n| `PortClearanceCase` | ATLP / broker / customs status | `boeNo`, `status`, `submittedAt`, `clearedAt`, `blockerCode` | `forShipmentUnit`, `hasBOEDocument` |\n| `PortReleaseGate` | DO / gate-pass / EIR register | `doNo`, `doReleasedAt`, `gatePassNo`, `gateOutAt` | `forPortCall`, `createsMilestone` |\n| `TariffRef` | contract/tariff master | `provider`, `serviceType`, `rate`, `unit`, `validity` | `appliesToServiceEvent` |\n| `PriceCenter` | OFCO mapping table | `priceCenterCode`, `serviceFamily` | `classifiesServiceEvent` |\n| `CostCenter` | AP/cost-center master | `costCenterCode`, `costOwner` | `classifiesChargeEvidence` |\n| `ReleaseBlocker` | validation engine / SOP exception table | `blockerType`, `severity`, `openedAt`, `resolvedAt` | `blocksPortReleaseGate` |\n| `PortKPI` | dashboard table | `metricCode`, `targetValue`, `actualValue`, `computedAt` | `measuresPortCall` |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#18",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "3.2 Source-System Integration Points",
    "text": "| Source system | Dataset / payload | Port ontology output | Validation |\n|---|---|---|---|\n| OFCO | service order, invoice subject, agency task, line amount | `PortServiceEvent`, `PortEvidenceAssertion`, `PriceCenter` | subject parse confidence, service type match |\n| SAFEEN | channel crossing / marine service invoice | `ChannelTransitEvent`, `TariffRef` evidence | Rotation and service date match |\n| AD Ports / ADP | port dues, terminal/berth/service reference | `PortDuesEvent`, `BerthingEvent`, `TariffRef` | tariff validity and provider match |\n| Terminal / port operator | ATA, berth, discharge/gate status | `PortCall`, `PortReleaseGate`, `MilestoneEvent` | chronology M80→M92→M100 |\n| Carrier / agent | BL, DO, arrival notice, rotation | `PortRotation`, `DeliveryOrderEvidence` | DO before M100 |\n| ATLP / broker | BOE status, duty/tax/permit evidence | `PortClearanceCase`, `ReleaseBlocker` | M90/M91 completeness |\n| LDG / OCR | CI/PL/BL/BOE/DO/Invoice extraction | `Document`, `VerificationResult`, `PortEvidenceAssertion` | MeanConf ≥ 0.92, TableAcc ≥ 0.98 |\n| WMS | WH receiving M110 handoff | M100 → M110 trace continuity | no WHP assignment at port |\n| Marine / MOSB | M115 staging and offshore requirement | `offshoreTransitRequired`, MOSB evidence link | AGI/DAS MOSB chain check |\n| Cost / AP | invoice header/lines, RateRef, CostGuard | `ChargeComponentEvidence` feed | no CostGuard verdict at port |\n| Communication layer | email/chat approvals | `ApprovalAction`, `AuditRecord` evidence | PII masking, action provenance |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#19",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "3.3 Foundry Link Types",
    "text": "| Link Type | From → To | Rule |\n|---|---|---|\n| `portCallForShipmentUnit` | `PortCall` → `ShipmentUnit` | Any-key resolver must create/confirm link |\n| `serviceForPortCall` | `PortServiceEvent` → `PortCall` | Rotation/date/service provider evidence required |\n| `tariffForService` | `TariffRef` → `PortServiceEvent` | Validity window must cover service date |\n| `invoiceLineForService` | `InvoiceLine` → `PortServiceEvent` | Cost domain consumes, port does not approve payment |\n| `releaseGateForPortCall` | `PortReleaseGate` → `PortCall` | M92/M100 gate evidence |\n| `portCallCreatesMilestone` | `PortCall` / `PortReleaseGate` → `MilestoneEvent` | M80/M90/M91/M92/M100 links only |\n| `evidenceForPortCall` | `Document` / `CommunicationEvent` → `PortEvidenceAssertion` | Evidence cannot mutate without approved action |\n| `blockerForReleaseGate` | `ReleaseBlocker` → `PortReleaseGate` | Open blocker blocks M100 action |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#20",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "3.4 Action Workflow",
    "text": "| Action | Trigger | Pre-checks | Write-back |\n|---|---|---|---|\n| `ResolvePortCallIdentity` | new Rotation / OFCO invoice / DO / BL | key uniqueness, confidence ≥ 0.95 | link `PortCall` to `ShipmentUnit` |\n| `RecordPortArrival` | ATA / arrival notice | vessel/rotation match | create M80 `MilestoneEvent` |\n| `RecordBOESubmission` | BOE draft/submission | BOE no., document hash | create/update M90 |\n| `RecordBOEClearance` | clearance confirmation | BOE status cleared, permit evidence | create/update M91 |\n| `RecordDORelease` | DO release evidence | BL/DO match, carrier/agent evidence | create/update M92 |\n| `RecordGateOut` | gate pass / EIR / terminal out | M92 exists, blockers closed | create/update M100 |\n| `ClassifyPortService` | invoice/service line parsed | service type confidence, provider, tariff ref | create `PortServiceEvent` |\n| `CreatePortCostEvidence` | service event complete | numeric integrity, rotation link | emit evidence to CostGuard |\n| `OpenPortReleaseBlocker` | missing BOE/DO/permit/gate evidence | severity and owner | create `ReleaseBlocker` |\n| `ApprovePortException` | high severity blocker / high value service | human reviewer, reason, expiry | attach `ApprovalAction` |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#21",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "3.5 OFCO Subject → Service / PriceCenter Mapping",
    "text": "| Subject cue | ServiceType | Cost center evidence | Price center evidence | Owner |\n|---|---|---|---|---|\n| `SAFEEN` + `Channel` / `Transit` | `CHANNEL_TRANSIT` | `PORT_HANDLING_CHARGE` | `CHANNEL_TRANSIT_CHARGES` | Port evidence → CostGuard |\n| `ADP INV` + `Port Dues` | `PORT_DUES` | `PORT_HANDLING_CHARGE` | `PORT_DUES` | Port evidence → CostGuard |\n| `Cargo Clearance` | `CARGO_CLEARANCE_AGENCY` | `CONTRACT` | `AGENCY_FEE_FOR_CARGO_CLEARANCE` | Port evidence → CostGuard |\n| `Arranging FW Supply` / `FW Supply` | `FW_SUPPLY` | `CONTRACT` | `SUPPLY_WATER_5000IG` | Port evidence → CostGuard |\n| `Berthing Arrangement` | `BERTHING` | `CONTRACT_AF_FOR_BA` | `AGENCY_FEE_FOR_BERTHING_ARRANGEMENT` | Port evidence → CostGuard |\n| `5000 IG FW` | `FW_SUPPLY` | `AT_COST_WATER_SUPPLY` | `SUPPLY_WATER_5000IG` | Port evidence → CostGuard |\n| `Pilot` / `Pilot Launch` | `PILOTAGE` | `PORT_HANDLING_CHARGE` | `PILOTAGE_SERVICE` | Port evidence → CostGuard |\n| `Tug` / `Towage` | `TUG_ASSIST` | `PORT_HANDLING_CHARGE` | `TUG_ASSISTANCE` | Port evidence → CostGuard |\n| `PHC` / `Bulk Handling` | `PHC_BULK_HANDLING` | `PORT_HANDLING_CHARGE` | `PORT_HANDLING_CHARGE` | Port evidence → CostGuard |\n| `Gate Pass` / `Access Pass` | `GATE_PASS` | `PERMIT_OR_ACCESS` | `GATE_PASS_SERVICE` | Port evidence → ReleaseGate |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#22",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "3.6 Milestone Interface",
    "text": "| Port evidence | Canonical milestone | Stage | Downstream consumer |\n|---|---|---|---|\n| terminal arrival / discharge readiness | M80 ATA | `PORT_ENTRY` | master, operations, material handling |\n| BOE submitted | M90 BOE Submitted | `CUSTOMS_CLEARANCE` | customs/material handling |\n| BOE cleared | M91 BOE Cleared | `CUSTOMS_CLEARANCE` | release gate, DEM/DET |\n| Delivery Order released | M92 DO Released | `CUSTOMS_CLEARANCE` | material handling, cost DEM/DET |\n| Gate pass / EIR / terminal gate-out | M100 Gate-out Completed | `INLAND_HAULAGE` | WH/MOSB/Site chain |\n| Port service complete | ServiceEvent closeout | port service layer | cost evidence and KPI |\n\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#23",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.1 Validation Control Matrix",
    "text": "| Rule ID | Control | Source | Severity | Result target |\n|---|---|---|---|---|\n| `PORT-ID-001` | PortCall must resolve to ShipmentUnit | Rotation/BL/DO/Invoice/Samsung Ref/HVDC Code | BLOCK | 100.00% linked |\n| `PORT-ROUTE-001` | `plannedRoutingPattern` enum only, evidence-only | PortCall | BLOCK | 100.00% valid enum |\n| `PORT-AGI-001` | AGI/DAS must have MOSB-compatible evidence | PortCall + destination | HIGH | 100.00% gate coverage |\n| `PORT-REL-001` | M100 requires M92 + gate-pass/EIR | ReleaseGate | BLOCK | 100.00% chronology |\n| `PORT-SVC-001` | Service line numeric integrity | ServiceEvent | HIGH | amount delta ≤ 0.01 |\n| `PORT-TAR-001` | ServiceEvent should map to TariffRef or approved exception | ServiceEvent | WARN/HIGH | coverage ≥ 95.00% |\n| `PORT-COST-001` | CostGuard verdict not written by port domain | ServiceEvent / CostEvidence | BLOCK | 0.00 unauthorized verdicts |\n| `PORT-WH-001` | No WHP classification on PortCall | PortCall | BLOCK | 0.00 violations |\n| `PORT-PII-001` | Routine port output must mask phone/e-mail | Communication/personnel evidence | BLOCK | 0.00 PII leakage |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#24",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.2 SPARQL — Any-key PortCall Resolution",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nPREFIX port: <http://samsung.com/project-logistics/port#>\nPREFIX id:   <http://samsung.com/project-logistics/id#>\n\nSELECT ?portCall ?keyType ?keyValue ?unit\nWHERE {\n  ?portCall a port:PortCall ;\n            id:hasIdentifier ?key .\n  ?key id:keyType ?keyType ;\n       id:keyValue ?keyValue .\n  OPTIONAL { ?portCall port:forShipmentUnit ?unit . }\n  FILTER(!BOUND(?unit))\n}\nORDER BY ?keyType ?keyValue\n```",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#25",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.3 SPARQL — AGI/DAS Offshore Evidence Gap",
    "text": "```sparql\nPREFIX port: <http://samsung.com/project-logistics/port#>\n\nSELECT ?portCall ?rotationNo ?dest ?plannedPattern ?mosbFlag\nWHERE {\n  ?portCall a port:PortCall ;\n            port:rotationNo ?rotationNo ;\n            port:declaredDestination ?dest .\n  OPTIONAL { ?portCall port:plannedRoutingPattern ?plannedPattern . }\n  OPTIONAL { ?portCall port:offshoreTransitRequired ?mosbFlag . }\n  OPTIONAL { ?portCall port:hasApprovedException ?exception . }\n  FILTER(?dest IN (\"AGI\", \"DAS\"))\n  FILTER(!BOUND(?exception))\n  FILTER(!BOUND(?mosbFlag) || ?mosbFlag != true || !BOUND(?plannedPattern) || ?plannedPattern NOT IN (\"MOSB_DIRECT\", \"WH_MOSB\", \"MIXED\"))\n}\n```",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#26",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.4 SPARQL — M100 Without DO Release",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nPREFIX port: <http://samsung.com/project-logistics/port#>\n\nSELECT ?gate ?unit ?gateOutAt\nWHERE {\n  ?gate a port:PortReleaseGate ;\n        port:forShipmentUnit ?unit ;\n        port:gateOutAt ?gateOutAt .\n  FILTER NOT EXISTS { ?gate port:doReleasedAt ?doReleasedAt . }\n}\n```",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#27",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.5 SPARQL — Port Service Numeric Variance",
    "text": "```sparql\nPREFIX port: <http://samsung.com/project-logistics/port#>\n\nSELECT ?service ?serviceType ?qty ?unitRate ?amount ?delta\nWHERE {\n  ?service a port:PortServiceEvent ;\n           port:serviceType ?serviceType ;\n           port:qty ?qty ;\n           port:unitRate ?unitRate ;\n           port:amount ?amount .\n  BIND(ABS((?qty * ?unitRate) - ?amount) AS ?delta)\n  FILTER(?delta > 0.01)\n}\nORDER BY DESC(?delta)\n```",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#28",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.6 SPARQL — Port Domain Unauthorized Cost Verdict",
    "text": "```sparql\nPREFIX port: <http://samsung.com/project-logistics/port#>\nPREFIX cost: <http://samsung.com/project-logistics/cost#>\n\nASK {\n  ?service a port:PortServiceEvent ;\n           cost:hasCostGuardBand ?band .\n}\n```\n\nExpected result: `false`. Port exports service and tariff evidence only; `CostGuardResult` belongs to `CONSOLIDATED-05`.",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#29",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.7 SPARQL — WHP Classification Leakage at Port",
    "text": "```sparql\nPREFIX port: <http://samsung.com/project-logistics/port#>\nPREFIX wh:   <http://samsung.com/project-logistics/warehouse#>\n\nASK {\n  ?portCall a port:PortCall ;\n            wh:confirmedFlowCode ?code .\n}\n```\n\nExpected result: `false`. Warehouse handling classification is valid only on `WarehouseHandlingProfile`.",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#30",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.8 RAG Check Policy",
    "text": "| RAG target | Trigger | Required evidence |\n|---|---|---|\n| MOIAT / customs release SOP | BOE/permit gate changes, customs blocker | current authority/SOP link, reviewed date |\n| FANR | regulated/nuclear/radiation-related cargo flag | permit/certificate evidence, reviewer |\n| DCD / DG | dangerous goods, fire safety, restricted cargo | DG permit / DCD evidence |\n| ADNOC / CICPA / site access | AGI/DAS/offshore/site access | gate pass / access policy evidence |\n| AD Ports / terminal tariff | tariff mismatch or new service code | tariff schedule / contract version |\n| SAFEEN / marine service | channel/marine service change | provider invoice/service reference |\n| Incoterms 2020 | cost/risk responsibility dispute | contract term + delivery point evidence |\n\nRAG output must write `PortEvidenceAssertion` + `AuditRecord`; it must not silently mutate `PortCall`, `ReleaseOrder`, `Invoice`, or `CostGuardResult`.",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#31",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.9 Human-gate Matrix",
    "text": "| Trigger | Threshold | Gate owner | Action |\n|---|---:|---|---|\n| Port service / invoice evidence amount | > 100,000.00 AED | Logistics Manager + Cost Owner | approval before CostGuard/payment release |\n| Open blocker at M100 | any BLOCK severity | Port Lead + Customs/Material Lead | block gate-out action |\n| AGI/DAS without MOSB evidence | any | Marine Lead + Material Lead | route exception or MOSB evidence required |\n| TariffRef missing on high value service | > 25,000.00 AED | Cost Owner | attach tariff / special approval |\n| DG/OOG permit missing | any | HSE + Port Lead | block release until permit evidence attached |\n| RAG source older than approved SOP window | any high-risk gate | Compliance Owner | refresh evidence |\n| OCR confidence below threshold | MeanConf < 0.92 or TableAcc < 0.98 | LDG Owner | reprocess / human review |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#32",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "4.10 ZERO / Fail-safe Table",
    "text": "| 단계 | 이유 | 위험 | 요청데이터 | 다음조치 |\n|---|---|---|---|---|\n| Identity resolution | Rotation/BL/DO/Invoice key conflict | Wrong shipment release/cost linkage | all candidate keys + source hashes | stop write-back; run Any-key cluster review |\n| Release gate | DO/gate-pass/BOE evidence missing | unauthorized gate-out / DEM/DET dispute | BOE, DO, gate pass, EIR | block M100 action |\n| AGI/DAS route evidence | MOSB flag/pattern missing | offshore delivery failure | declared destination, route plan, MOSB booking | human gate |\n| Service tariff | TariffRef unavailable | overcharge / audit failure | tariff schedule / contract ref | hold CostEvidence export |\n| Compliance | MOIAT/FANR/DCD/ADNOC ambiguity | regulatory hold | current SOP/permit evidence | RAG refresh and approval |\n\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#33",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "5.1 Compliance Object Model",
    "text": "| Object | Purpose | Port use |\n|---|---|---|\n| `RegulatoryRequirement` | authority requirement anchor | maps permit/document requirement to PortCall/ReleaseGate |\n| `PermitDocument` | evidence of permit/certification | source evidence for blocker clearance |\n| `ComplianceCheck` | validation result | PASS/WARN/HIGH/BLOCK per gate |\n| `ReleaseBlocker` | operational blocker | prevents M100 until resolved |\n| `ApprovalAction` | human decision | exception/override with actor, reason, expiry |\n| `AuditRecord` | provenance trail | source hash, reviewer, timestamp |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#34",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "5.2 Incoterms 2020 Control",
    "text": "| Control | Port implication | Validation |\n|---|---|---|\n| Cost responsibility | Port dues, terminal handling, agency fee responsibility depends on contract term and delivery point | Link `IncotermTerm`, contract, service event |\n| Risk transfer | Gate-out / terminal handover may affect risk status | Link M92/M100 evidence |\n| Documentary obligation | CI/PL/BL/BOE/DO/permit evidence required before release | LDG cross-document gate |\n| Dispute handling | Port evidence supports cost/claim, not payment approval | CostGuard and claim owner decide |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#35",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "5.3 UAE Regulatory Controls",
    "text": "| Authority / domain | Port trigger | Evidence object | Gate |\n|---|---|---|---|\n| MOIAT / Customs | import clearance, BOE, duty/tax, certificate | `BOEDocument`, `CustomsEntry`, `PermitDocument` | M90/M91/M92 |\n| FANR | regulated cargo requiring nuclear/radiation control | `PermitDocument`, `ComplianceCheck` | before M92/M100 |\n| DCD / DG | dangerous goods, flammable or controlled cargo | `DGPermitEvidence`, `HSEApproval` | before terminal release |\n| ADNOC / CICPA / site access | AGI/DAS/offshore/security access | `GatePassEvidence`, `AccessPolicy` | before M100 / M115 |\n| AD Ports / terminal | port dues, berth, terminal handling, gate-out | `TariffRef`, `ServiceEvent`, `EIR` | service closeout / M100 |\n| SAFEEN / marine support | channel transit / marine service | `ServiceEvent`, `TariffRef` | service evidence closeout |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#36",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "5.4 Compliance Blockers",
    "text": "| Blocker | Severity | Default action |\n|---|---:|---|\n| BOE missing or uncleared | BLOCK | no M92 / no M100 |\n| DO missing | BLOCK | no M100 |\n| Gate pass missing/expired | BLOCK | no M100 |\n| AGI/DAS MOSB evidence missing | HIGH | human gate and route exception |\n| DG/OOG permit missing | BLOCK | no release |\n| TariffRef missing on high value service | HIGH | hold cost evidence export |\n| Unmasked PII in communication evidence | BLOCK | mask before register/write |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#37",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "5.5 Privacy and NDA Guard",
    "text": "Routine port output may include names/roles only when required for accountability. Phone numbers, e-mail addresses, personal IDs, and access-card numbers must be masked before persistence or downstream export. `CommunicationEvent` and `ApprovalAction` references must carry source hash and masked display fields.\n\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#38",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "6. Options ≥3 (Pros/Cons/Cost/Risk/Time)",
    "text": "| Option | Scope | Pros | Cons | Est. cost | Risk | Time |\n|---|---|---|---|---:|---|---:|\n| A — Port Evidence Lite | PortCall + Rotation + planned routing evidence + basic service mapping | Fast migration, low schema risk, immediate OFCO traceability | Limited tariff automation and DEM/DET analytics | 35,000.00 AED | Medium | 2.00 weeks |\n| B — OFCO Service Twin | Full ServiceEvent, TariffRef, PriceCenter/CostCenter evidence, numeric checks | Strong invoice-service audit, reusable CostGuard feed | Needs service taxonomy and tariff table cleanup | 95,000.00 AED | Medium | 5.00 weeks |\n| C — Release & DEM/DET Control | M90/M91/M92/M100, release blockers, gate-pass/EIR, DEM/DET evidence | Direct delay/cost prevention, strong material handoff | Requires ATLP/terminal/carrier data quality | 125,000.00 AED | High | 6.00 weeks |\n| D — Integrated Port Ops Twin | Options B+C + RAG + communication approvals + dashboard export | Full operational/control twin, best audit posture | Highest integration effort | 185,000.00 AED | Medium | 8.00 weeks |\n\nRecommended default: **Option C** if DEM/DET and release delays are the immediate business pain; **Option D** if OFCO service billing and release-control automation must be deployed together.\n\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#39",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "7. Roadmap (Prepare→Pilot→Build→Operate→Scale + KPI)",
    "text": "| Phase | Duration | Work package | Exit KPI |\n|---|---:|---|---|\n| Prepare | 1.00 week | inventory source columns, normalize Rotation/Invoice/BL/DO keys, define service taxonomy | Key dictionary coverage ≥ 95.00% |\n| Pilot | 2.00 weeks | build `PortCall`, `PortServiceEvent`, `plannedRoutingPattern`, `declaredDestination` mapping on sample OFCO/ADP/SAFEEN set | PortCallLinkCoverage ≥ 90.00% |\n| Build | 3.00 weeks | implement SHACL rules, Any-key resolver, M90/M91/M92/M100 release gate, TariffRef links | Validation pass rate = 100.00% |\n| Operate | continuous | daily exception queue, release blocker alerts, service numeric variance, high-value approval | Open critical blockers age < 24.00 hrs |\n| Scale | continuous | integrate operations dashboard, CostGuard feed, RAG refresh, communication approvals | Port evidence completeness ≥ 98.00% |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#40",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "7.1 KPI Dictionary",
    "text": "| KPI | Formula | Target |\n|---|---|---:|\n| `PortCallLinkCoverage` | linked PortCalls / total PortCalls × 100.00 | ≥ 95.00% |\n| `ServiceEvidenceCompleteness` | ServiceEvents with provider+type+amount+evidence / total | ≥ 98.00% |\n| `RoutingEvidenceAccuracy` | correct planned route evidence / reviewed PortCalls | 100.00% |\n| `AGIDASMOSBFlagCoverage` | AGI/DAS with MOSB evidence / AGI/DAS PortCalls | 100.00% |\n| `ReleaseChronologyIntegrity` | M92 before M100 cases / gated-out cases | 100.00% |\n| `TariffRefCoverage` | ServiceEvents with TariffRef or approved exception / total | ≥ 95.00% |\n| `PortInvoiceNumericIntegrity` | service lines passing qty×rate and amount checks / total | 100.00% |\n| `DEMDETClockCoverage` | M92/M100 clock pairs / eligible cases | ≥ 95.00% |\n| `ValidationLatencyP95` | validation p95 runtime | < 5.00s |\n| `PIILeakage` | unmasked e-mail/phone hits in routine output | 0.00 |\n\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#41",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "8.1 Foundry Functions",
    "text": "| Function | Input | Output | Guard |\n|---|---|---|---|\n| `resolvePortCallAnyKey()` | Rotation, BL, DO, invoice, container, Samsung Ref, HVDC Code | `PortCall` ↔ `ShipmentUnit` link candidates | confidence ≥ 0.95 or human review |\n| `classifyPortServiceEvent()` | invoice subject, provider, amount, service date | `PortServiceEvent`, `PriceCenter`, `CostCenter` | service taxonomy + TariffRef check |\n| `validatePortReleaseGate()` | BOE/DO/gate-pass/EIR evidence | M90/M91/M92/M100 status, blockers | no M100 if BLOCK open |\n| `emitPortCostEvidence()` | service event + tariff evidence | Cost evidence payload | no CostGuard verdict written by port |\n| `detectAGIDASPortEvidenceGap()` | destination + planned route + MOSB flag | exception / alert | AGI/DAS requires MOSB evidence |\n| `openPortReleaseBlocker()` | missing/invalid release evidence | `ReleaseBlocker` | owner and SLA required |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#42",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "8.2 RPA Hooks",
    "text": "| Hook | Trigger | Action |\n|---|---|---|\n| `OFCO_INVOICE_PARSE` | new OFCO/SAFEEN/ADP invoice | subject parse, service mapping, numeric check |\n| `ROTATION_MATCH` | new rotation/port call file | Any-key cluster update |\n| `DO_RELEASE_CHECK` | DO release event | create/update M92 |\n| `GATE_OUT_CHECK` | EIR/gate pass event | create/update M100 if M92 exists |\n| `TARIFF_GAP_ALERT` | missing tariff on service event | alert Cost Owner |\n| `AGIDAS_MOSB_ALERT` | AGI/DAS without MOSB evidence | alert Marine + Material Leads |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#43",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "8.3 LLM Guardrail",
    "text": "LLM extraction may propose `serviceType`, `PriceCenter`, `CostCenter`, `plannedRoutingPattern`, and `ReleaseBlocker` candidates. It must write only `PortEvidenceAssertion` until a Foundry Action approves the target object update. Confidence below 0.92 must route to human review.",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#44",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "8.4 Sheets / Excel Mapping",
    "text": "| Column / field | Ontology property | Rule |\n|---|---|---|\n| OFCO Invoice No | `id:OFCOInvoiceNo` | identifier only |\n| SAFEEN Invoice No | `id:SAFEENInvoiceNo` | identifier only |\n| ADP Invoice No | `id:ADPInvoiceNo` | identifier only |\n| Rotation / Rot# | `port:rotationNo` | primary PortCall key |\n| Subject | `port:subjectText` → `SubjectParseResult` | parse to service evidence |\n| Vessel | `port:vesselName` | normalize name |\n| ETA / ATA / ATD | `port:eta`, `port:ata`, `port:atd` | ISO datetime |\n| Port / Terminal / Berth | `port:atPort`, `port:hasTerminal`, `port:berthName` | node master lookup |\n| Final destination | `port:declaredDestination` | MIR/SHU/AGI/DAS/site code |\n| Route pattern | `port:plannedRoutingPattern` | evidence only |\n| Qty / EA / Rate / Amount | `port:qty`, `port:unitRate`, `port:amount` | numeric integrity |\n| Currency | `port:currency` | preserve original currency |\n| BOE / DO / Gate Pass | `port:boeNo`, `port:doNo`, `port:gatePassNo` | release gate evidence |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#45",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "8.5 Telegram / Alert Hooks",
    "text": "```text\n[PORT-GATE][BLOCK] Rotation={rotationNo} Unit={shipmentUnitId} Missing={blockerType} Owner={owner} SLA={hours}h\n[PORT-COST][WARN] Service={serviceType} Provider={provider} Amount={amount} {currency} MissingTariffRef={true|false}\n[PORT-ROUTE][HIGH] Destination={AGI|DAS} plannedRoutingPattern={pattern} MOSBFlag={true|false} Action=Review\n[PORT-DEMDET][WARN] M92={doReleasedAt} M100=missing Age={hours}h FreeTime={freeTimeHours}h\n```\n\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#46",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "9.1 QA Checklist",
    "text": "| # | Check | Target |\n|---:|---|---|\n| 1.00 | Frontmatter version is `2.0-final` | PASS |\n| 2.00 | `spine_ref` points to `CONSOLIDATED-00-master-ontology.md` | PASS |\n| 3.00 | `checked_against` includes `00`~`09`, AGENTS, Review, Palantir blueprint | PASS |\n| 4.00 | Port does not own `WarehouseHandlingProfile.confirmedFlowCode` | PASS |\n| 5.00 | Port uses `plannedRoutingPattern` as evidence only | PASS |\n| 6.00 | MOSB modeled as `OffshoreStagingNode` / `MarineInterfaceNode` | PASS |\n| 7.00 | AGI/DAS offshore evidence gate exists | PASS |\n| 8.00 | M90/M91/M92/M100 release chronology defined | PASS |\n| 9.00 | Port service amount arithmetic rule defined | PASS |\n| 10.00 | TariffRef and service mapping integrated with Cost domain only as evidence | PASS |\n| 11.00 | CostGuard verdict excluded from port ownership | PASS |\n| 12.00 | Document/OCR evidence-only boundary retained | PASS |\n| 13.00 | Communication layer evidence-only boundary retained | PASS |\n| 14.00 | RAG gate defined for current authority/SOP dependencies | PASS |\n| 15.00 | High-value Human-gate threshold = 100,000.00 AED | PASS |\n| 16.00 | Validation p95 target < 5.00s | PASS |\n| 17.00 | PII masking rule included | PASS |\n| 18.00 | Options ≥3 included with cost/risk/time | PASS |\n| 19.00 | Roadmap uses Prepare→Pilot→Build→Operate→Scale | PASS |\n| 20.00 | CmdRec included | PASS |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#47",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "9.2 Assumptions(가정:)",
    "text": "| Assumption | Impact | Mitigation |\n|---|---|---|\n| OFCO/SAFEEN/ADP subject lines contain enough rotation/service clues for first-pass mapping | Some service lines may require manual review | use `SubjectParseResult.confidence` and review queue |\n| Rotation number is the strongest port-call identity key when available | Missing rotation can create orphan service evidence | Any-key fallback using BL/DO/Invoice/Samsung Ref/HVDC Code |\n| AGI/DAS requires MOSB-compatible offshore evidence unless approved exception exists | Prevents accidental direct onshore modeling | human-gated route exception |\n| Current tariff and authority rules may change | Hard-coded legal/fee assumptions become stale | RAG refresh before approval/action |\n| Port service amount is evidence, not payment truth | Cost approval remains consistent | CostGuard consumes evidence and writes final verdict |\n| Communication evidence may include PII | Privacy/NDA leakage risk | mask routine outputs and store source hash only |",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#48",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "9.3 Compatibility Patch Register — 5.00 Parallel Lanes",
    "text": "| Lane | Focus | Corpus checked | Finding | Patch applied | Result |\n|---:|---|---|---|---|---|\n| 1.00 | Master spine | `CONSOLIDATED-00`, AGENTS, Review | Port must be PortCall/ServiceEvent/Tariff hub, not route owner | frontmatter, scope, governance, identity, milestone links normalized | PASS |\n| 2.00 | Flow/WHP boundary | `CONSOLIDATED-02`, AGENTS | WH handling class belongs only to WHP | port-owned WH class language removed; `plannedRoutingPattern` kept evidence-only | PASS |\n| 3.00 | Document/OCR + Cost | `CONSOLIDATED-03`, `CONSOLIDATED-05` | OCR and port service lines are evidence; CostGuard owns verdict | `PortEvidenceAssertion`, `TariffRef`, `PriceCenter`, `CostCenter` export model added | PASS |\n| 4.00 | Marine/material/infrastructure | `CONSOLIDATED-01`, `04`, `06` | AGI/DAS needs MOSB-compatible route evidence and M115 chain downstream | AGI/DAS port evidence gate, M90/M91/M92/M100 interface, MOSB non-warehouse rule added | PASS |\n| 5.00 | Operations/comms/artifact hygiene | `CONSOLIDATED-08`, `09`, PDF blueprint | Need evidence-only communication, KPI export, no PII, validation automation | KPI dictionary, RAG/Human-gate, PII guard, automation hooks, JSON report added | PASS |\n\n---",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-07-port-operations#49",
    "docId": "CONSOLIDATED-07-port-operations",
    "title": "hvdc-port-operations · CONSOLIDATED-07",
    "version": "2.0-final",
    "sectionPath": "10. CmdRec (1–3)",
    "text": "```text\n/switch_mode PRIME + /logi-master report --deep --KRsummary\n/logi-master invoice-audit --AEDonly --deep\n/logi-master cert-chk --deep --KRsummary\n```",
    "docHash": "ce02194bf4330bde3fcb1396033753b6e41ea2c831cd774311cead26a5fda19e",
    "domains": [
      "operations",
      "port"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#1",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Communication Evidence Layer Ontology — Consolidated\"\ntype: \"evidence-layer-extension\"\ndomain: \"communication\"\nsub-domains:\n  - email\n  - chat\n  - approval-evidence\n  - escalation-control\n  - sla-clock\n  - audit-proof\n  - pii-redaction\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\nextension_of: \"hvdc-master-ontology-v2.0-final\"\ncanonical_role: \"email/chat evidence, approval action, audit record, and communication SLA extension\"\nlayer: \"evidence\"\nowner: \"HVDC Logistics Ontology Working Set\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\n  - GS1-EPCIS-CBV\nsource_files:\n  - 2_EXT-03-hvdc-comm-email.md\n  - 2_EXT-04-hvdc-comm-chat.md\n  - FMC_OrgChart_Data.json\nchecked_against:\n  - CONSOLIDATED-00-master-ontology.md\n  - CONSOLIDATED-01-core-framework-infra.md\n  - CONSOLIDATED-02-warehouse-flow.md\n  - CONSOLIDATED-03-document-ocr.md\n  - CONSOLIDATED-04-barge-bulk-cargo.md\n  - CONSOLIDATED-05-invoice-cost.md\n  - CONSOLIDATED-06-material-handling.md\n  - CONSOLIDATED-07-port-operations.md\n  - CONSOLIDATED-09-operations.md\n  - AGENTS.md\n  - HVDC Logistics Ontology Review.txt\n  - Palantir 온톨로지 기반 물류 자동화.pdf\nvalidation_passes: 5\nsemantic_patch:\n  - \"Communication is evidence-only and does not redefine ShipmentUnit, RoutingPattern, JourneyStage, JourneyLeg, MilestoneEvent, WarehouseTask, PortCall, CostGuardResult, or SiteReceipt.\"\n  - \"Core connection is restricted to CommunicationEvent, ApprovalAction, AuditRecord, EvidenceAttachment, and EscalationRecord.\"\n  - \"WarehouseHandlingProfile.confirmedFlowCode remains warehouse-only; communication may cite the approved WHP identifier as evidence only.\"\n  - \"MOSB is represented as OffshoreStagingNode / MarineInterfaceNode evidence; communication shall not classify MOSB as Warehouse.\"\n  - \"PII fields from contact data are masked before register write; raw tel/e-mail never appears in the evidence graph.\"\n  - \"A message can propose, request, or approve; only an authorized Foundry Action can mutate operational truth.\"\n  - \"Email drafting defaults to EmailDraftMode with mandatory sct_ontology grounding; sct_ontology is invoked or surfaced even when the user does not explicitly request it.\"\n  - \"A hard-marked EmailActionCard is mandatory after the ontology review and is not an operational ActionRequest unless the user asks to register or write an action.\"\nfinal_validation_rounds: 5\nfinal_validation_status: \"PASS\"\nfinal_validated_date: \"2026-04-27\"\nfinal_patch_bundle: \"HVDC_Logistics_Ontology_FINAL_5x_2026-04-27\"\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#2",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "1. ExecSummary",
    "text": "`CONSOLIDATED-08`은 HVDC Logistics KG의 **communication evidence layer**이다. 이메일, WhatsApp, Telegram, Teams, meeting note, phone memo, approval memo를 `CommunicationEvent`, `ApprovalAction`, `AuditRecord`, `EvidenceAttachment`, `EscalationRecord`로 정규화한다.\n\n비즈니스 임팩트는 **승인 누락 0.00건**, **SLA breach 조기 경보**, **OSD/NCR/DEM-DET/permit blocker 증빙 자동 연결**, **PII 마스킹 기반 감사 추적성 확보**이다. 기술 해법은 PROV-O provenance, OWL-Time SLA clock, SHACL evidence gate, SPARQL unresolved-action query, Foundry Action write-back guard를 결합한다.\n\nKPI 목표는 `CommunicationLinkCoverage ≥ 95.00%`, `ApprovalEvidenceCompleteness ≥ 98.00%`, `PIILeakage = 0.00건`, `ActionClosureSLA ≥ 90.00%`, `Validation p95 < 5.00s`이다.\n\nEmail reply drafting은 별도 `EmailDraftMode`로 처리하되, 모든 답장 작성 요청은 먼저 `sct_ontology` 검토를 자동 수행하거나 화면에 노출한다. 그 다음 하드마킹된 `EmailActionCard`와 이메일 본문 초안을 분리해서 출력한다.\n\n**ENG-KR one-liner:** Communication is proof, not operational truth; messages attach evidence, while authorized Foundry Actions update the logistics twin.\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#3",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "2.1 Master Governance Rule",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.\n2. `CONSOLIDATED-08` is an **evidence layer**, not a core logistics execution layer.\n3. This document owns `CommunicationEvent`, `MessageThread`, `ApprovalAction`, `AuditRecord`, `EvidenceAttachment`, `EscalationRecord`, `SLAClock`, and `PIIRedactionRecord`.\n4. Program-wide shipment state uses `RoutingPattern`, `JourneyStage`, `JourneyLeg`, and `MilestoneEvent`; communication may refer to these as target objects only.\n5. Warehouse handling classification remains on `WarehouseHandlingProfile.confirmedFlowCode`; communication cannot create, assign, or infer it.\n6. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`; communication can store MOSB-related approval evidence but cannot type MOSB as a warehouse.\n7. A message cannot mutate operational transactions. It can create an evidence assertion, approval request, escalation, or work queue item. A separate authorized Foundry Action performs any transaction update.\n8. Email drafting requests are `EmailDraftMode` by default and must automatically invoke or surface `sct_ontology` grounding.\n9. Email draft output must include a separate ontology review, then a hard-marked `EmailActionCard`, then the draft body. The card is a presentation/triage artifact, not a KG `ActionRequest`.\n10. Explicit user triggers such as `CostGuard`, compliance judgement, evidence pack creation, or Action registration open deeper ontology/action lanes, but baseline `sct_ontology` review is always required.",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#4",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "2.2 Included vs Delegated Scope",
    "text": "| Scope item | Included in CONSOLIDATED-08 | Delegated / excluded |\n|---|---|---|\n| Email and chat evidence | Message, thread, sender role, receiver role, timestamp, channel, attachment hash | Mailbox administration and raw server retention policy |\n| Approval action | Approve / reject / request revision / acknowledge / escalate | Final operational mutation in target domain |\n| Audit proof | Provenance, reviewer, evidence pointer, action rationale, before/after object references | Legal opinion and commercial settlement |\n| SLA clock | Due time, response time, breach status, escalation tier | Project schedule critical path ownership |\n| PII redaction | Masked phone/e-mail, role-only exposure, hash-only identity join | HR master data and raw contact vault |\n| Evidence linking | Link to ShipmentUnit, Document, PortCall, CustomsEntry, WarehouseTask, SiteReceipt, Invoice, Exception | Redefining those classes |\n| RAG summary | Summarize discussion and cite evidence objects | Treating LLM summary as source-of-truth |\n| Email drafting | mandatory `sct_ontology` review + `EmailActionCard` + email body draft in `EmailDraftMode` | Converting the card to KG action without explicit instruction |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#5",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "2.3 Domain Boundary Crosswalk",
    "text": "| Domain | Allowed interface from communication | Not allowed in CONSOLIDATED-08 |\n|---|---|---|\n| Master spine | Attach `CommunicationEvent`, `ApprovalAction`, `AuditRecord` to `ShipmentUnit`, `MilestoneEvent`, `Exception` | Redefine identity policy or milestone dictionary |\n| Infrastructure | Reference `Party`, `RoleAssignment`, `LocationNode`, `RegulatoryRequirement` | Create authority decision as fact without evidence |\n| Warehouse | Attach approval evidence to M110/M111/M120/M121 or WHP reviewer action | Own or calculate WH handling class |\n| Document/OCR | Link extracted document discrepancy to message thread and reviewer decision | Replace LDG `VerificationResult` |\n| Marine/Bulk | Link MWS/stability/lashing/lift approval evidence | Replace engineering approval or marine execution truth |\n| Cost | Attach invoice clarification and approval record to `CostGuardResult` | Own `RateRef`, cost band, payment verdict |\n| Material handling | Attach approval/evidence to release, site receipt, OSD/NCR/Claim | Mutate custody chain directly |\n| Port | Attach port service clarification and OFCO/SAFEEN/ADP discussion evidence | Own `PortCall` or `TariffRef` truth |\n| Operations | Feed unresolved action counts, SLA KPI, and exception communication metrics | Define route or stock analytics |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#6",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "2.4 Evidence-only Write Guard",
    "text": "```text\nMessage received        -> CommunicationEvent + MessageThread + EvidenceAttachment\nReviewer decision       -> ApprovalAction + AuditRecord\nOperational update      -> Authorized Foundry Action in target ontology\nAudit closure           -> AuditRecord links beforeObjectRef, afterObjectRef, evidenceHash\n```",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#7",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "2.4.1 Email Drafting Guard",
    "text": "```text\nUser says \"답장 작성하라\" / \"draft reply\" / \"메일 회신 작성\"\n  -> EmailDraftMode\n  -> Invoke or surface sct_ontology\n  -> Emit hard-marked EmailActionCard\n  -> Emit email draft\n  -> DO NOT create ActionRequest unless user explicitly says register/write/escalate\n```\n\nMandatory card:\n\n```text\n[EMAIL_ACTION_CARD]\nmode: EMAIL_DRAFT\nontology_use: AUTO_SCT_ONTOLOGY_REQUIRED | EXPLICIT_DEEP_ONTOLOGY\nreply_stance: ACKNOWLEDGE | HOLD | REQUEST_INFO | ESCALATE | APPROVE | REJECT\nblocking_inputs: <comma-separated missing inputs or NONE>\nnext_action: <single operational next step>\nsend_status: DRAFT_READY | HOLD_FOR_REVIEW\n[/EMAIL_ACTION_CARD]\n```\n\nFor mixed requests, use two separated lanes:\n\n```text\nOntology lane  -> mandatory sct_ontology review\nEmail lane     -> EmailActionCard + Draft\nAction lane    -> ActionRequest only if explicitly requested\n```",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#8",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "2.5 Legacy Migration Rules",
    "text": "| Legacy wording / pattern | Canonical replacement | Patch action |\n|---|---|---|\n| Message as direct logistics state | `CommunicationEvent` evidence attached to target object | Remove direct state mutation language |\n| Chat command directly updates shipment | `ActionRequest` + authorized Foundry Action | Add reviewer and audit proof |\n| Email-derived route status | `RouteEvidenceAssertion` or `ApprovalAction.targetObjectRef` | Route owner remains core shipment layer |\n| Message-derived WH handling class | `CommunicationEvidence` on WHP decision | WHP owner remains `CONSOLIDATED-02` |\n| Raw phone/e-mail in graph | `maskedContactRef`, `roleId`, `hashKey` | Redact before write |\n| Email draft skips `sct_ontology` | `EmailDraftMode` with `ontology_use = AUTO_SCT_ONTOLOGY_REQUIRED` | Run or surface baseline ontology review before drafting |\n| Draft action card treated as KG action | `EmailActionCard` presentation artifact | Convert to `ActionRequest` only on explicit register/write/escalate request |\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#9",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "3.1 Ontology Layer Map",
    "text": "| Layer | Class / vocabulary | Purpose |\n|---|---|---|\n| Message | `CommunicationEvent`, `EmailMessage`, `ChatMessage`, `MeetingNote`, `PhoneMemo` | Raw or normalized communication event |\n| Thread | `MessageThread`, `ConversationCluster`, `ThreadParticipant` | Multi-message discussion and participants |\n| Intent | `CommunicationIntent`, `RequestIntent`, `ApprovalIntent`, `EscalationIntent`, `ClarificationIntent` | Semantic intent classification |\n| Action | `ActionRequest`, `ApprovalAction`, `RevisionRequest`, `EscalationRecord`, `AcknowledgementAction` | Human decision and workflow action |\n| Drafting | `EmailDraftArtifact`, `EmailActionCard` | Reply composition output after mandatory ontology grounding |\n| Evidence | `EvidenceAttachment`, `AttachmentManifest`, `DocumentPointer`, `ObjectPointer`, `AuditRecord` | Provenance and proof artifact |\n| SLA | `SLAClock`, `ResponseWindow`, `BreachRecord`, `EscalationTier` | Response and closure timing |\n| Security | `PIIRedactionRecord`, `AccessControlTag`, `SensitivityLabel` | Privacy and access guard |\n| Quality | `CommunicationKPI`, `EvidenceLinkMetric`, `ClosureMetric`, `PIILeakageMetric` | KPI observations |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#10",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "3.2 Core Classes",
    "text": "| Class | Required properties | Key relations | Notes |\n|---|---|---|---|\n| `CommunicationEvent` | `eventId`, `channel`, `eventTime`, `normalizedSubject`, `language`, `sourceSystem` | `belongsToThread`, `hasParticipant`, `hasIntent`, `referencesObject`, `hasEvidenceAttachment` | Root evidence object |\n| `EmailMessage` | `messageId`, `sentAt`, `receivedAt`, `subjectHash`, `bodyHash` | `subClassOf CommunicationEvent` | Body is optionally stored outside KG |\n| `EmailDraftArtifact` | `draftId`, `draftPurpose`, `createdAt`, `language`, `sourceThreadHash` | `draftsReplyTo`, `hasEmailActionCard` | Draft-only artifact; not sent evidence until registered |\n| `EmailActionCard` | `mode`, `ontologyUse`, `replyStance`, `blockingInputs`, `nextAction`, `sendStatus` | `summarizesDraft`, optional `mayOpenActionRequest` | Hard-marked output card; not a KG action by default |\n| `ChatMessage` | `messageId`, `channelProvider`, `sentAt`, `messageHash` | `subClassOf CommunicationEvent` | WhatsApp/Telegram/Teams normalized |\n| `MessageThread` | `threadId`, `threadStatus`, `openedAt`, `lastActivityAt` | `hasMessage`, `hasOpenAction`, `referencesObject` | One thread can reference many shipments |\n| `CommunicationIntent` | `intentCode`, `confidence`, `classifierVersion` | `classifiedFrom`, `requiresActionType` | LLM/RAG intent is evidence, not truth |\n| `ActionRequest` | `requestId`, `requestType`, `dueAt`, `priority`, `requestedByRole` | `targetObjectRef`, `assignedToRole`, `openedByMessage` | Creates queue item |\n| `ApprovalAction` | `actionId`, `decision`, `decisionAt`, `actorRole`, `reasonCode` | `approvesRequest`, `targetObjectRef`, `supportedByEvidence`, `writesAuditRecord` | Required for human-gated updates |\n| `AuditRecord` | `auditId`, `createdAt`, `actorRole`, `actionType`, `evidenceHash` | `wasDerivedFrom`, `beforeObjectRef`, `afterObjectRef` | PROV-O anchor |\n| `EvidenceAttachment` | `attachmentId`, `artifactType`, `artifactHash`, `sourceUriHash`, `mimeType` | `attachedToMessage`, `pointsToDocument`, `pointsToObject` | Raw file may live in document store |\n| `SLAClock` | `clockId`, `slaType`, `startAt`, `dueAt`, `closedAt`, `breachStatus` | `forThread`, `forActionRequest`, `escalatesTo` | OWL-Time compatible |\n| `PIIRedactionRecord` | `redactionId`, `fieldType`, `redactedAt`, `maskPolicy`, `hashKey` | `protectsParticipant`, `appliesToMessage` | No raw phone/e-mail in KG |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#11",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "3.3 Object Properties",
    "text": "| Property | Domain → Range | Cardinality | Purpose |\n|---|---|---:|---|\n| `belongsToThread` | `CommunicationEvent → MessageThread` | 1..1 | Thread grouping |\n| `referencesObject` | `CommunicationEvent → ShipmentUnit/Document/Invoice/Exception/etc.` | 0..n | Evidence target |\n| `openedByMessage` | `ActionRequest → CommunicationEvent` | 1..1 | Request provenance |\n| `supportedByEvidence` | `ApprovalAction → EvidenceAttachment/CommunicationEvent/Document` | 1..n | Decision proof |\n| `writesAuditRecord` | `ApprovalAction → AuditRecord` | 1..1 | Audit closure |\n| `protectsParticipant` | `PIIRedactionRecord → ThreadParticipant` | 1..1 | PII protection |\n| `escalatesTo` | `SLAClock → EscalationRecord` | 0..1 | Breach action |\n| `linkedToVerification` | `CommunicationEvent → VerificationResult` | 0..n | LDG discrepancy discussion |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#12",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "3.4 Data Properties",
    "text": "| Property | Range | Rule |\n|---|---|---|\n| `channel` | SKOS enum | `EMAIL`, `WHATSAPP`, `TELEGRAM`, `TEAMS`, `MEETING`, `PHONE_MEMO`, `SYSTEM_ALERT` |\n| `eventTime` | `xsd:dateTime` | ISO-8601 with Asia/Dubai operational timezone or UTC offset |\n| `language` | SKOS enum | `EN`, `KO`, `AR`, `MIXED`, `UNKNOWN` |\n| `decision` | SKOS enum | `APPROVED`, `REJECTED`, `REVISION_REQUIRED`, `ACKNOWLEDGED`, `ESCALATED` |\n| `breachStatus` | SKOS enum | `OPEN`, `ON_TIME`, `WARN`, `BREACHED`, `WAIVED` |\n| `sensitivityLabel` | SKOS enum | `PUBLIC`, `PROJECT_INTERNAL`, `CONFIDENTIAL`, `PII_MASKED`, `LEGAL_HOLD` |\n| `confidence` | decimal | `0.00 <= confidence <= 1.00` |\n| `evidenceHash` | string | Required for every `AuditRecord` |\n| `ontologyUse` | SKOS enum | `AUTO_SCT_ONTOLOGY_REQUIRED` for all email draft requests unless deeper explicit ontology lane is requested |\n| `sendStatus` | SKOS enum | `DRAFT_READY` or `HOLD_FOR_REVIEW` |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#13",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "3.5 Core SHACL Shapes (요약)",
    "text": "```turtle\ncomm:CommunicationEventShape a sh:NodeShape ;\n  sh:targetClass comm:CommunicationEvent ;\n  sh:property [ sh:path comm:eventId ; sh:minCount 1 ; sh:maxCount 1 ] ;\n  sh:property [ sh:path comm:channel ; sh:minCount 1 ; sh:in ( \"EMAIL\" \"WHATSAPP\" \"TELEGRAM\" \"TEAMS\" \"MEETING\" \"PHONE_MEMO\" \"SYSTEM_ALERT\" ) ] ;\n  sh:property [ sh:path comm:eventTime ; sh:minCount 1 ; sh:datatype xsd:dateTime ] ;\n  sh:property [ sh:path comm:belongsToThread ; sh:minCount 1 ; sh:maxCount 1 ] .\n\ncomm:ApprovalActionShape a sh:NodeShape ;\n  sh:targetClass comm:ApprovalAction ;\n  sh:property [ sh:path comm:decision ; sh:minCount 1 ] ;\n  sh:property [ sh:path comm:decisionAt ; sh:minCount 1 ; sh:datatype xsd:dateTime ] ;\n  sh:property [ sh:path comm:actorRole ; sh:minCount 1 ] ;\n  sh:property [ sh:path comm:targetObjectRef ; sh:minCount 1 ] ;\n  sh:property [ sh:path comm:supportedByEvidence ; sh:minCount 1 ] ;\n  sh:property [ sh:path comm:writesAuditRecord ; sh:minCount 1 ; sh:maxCount 1 ] .\n\ncomm:PIIRedactionShape a sh:NodeShape ;\n  sh:targetClass comm:ThreadParticipant ;\n  sh:property [ sh:path comm:maskedContactRef ; sh:minCount 1 ] ;\n  sh:property [ sh:path comm:rawContactValue ; sh:maxCount 0 ] .\n\ncomm:EmailActionCardShape a sh:NodeShape ;\n  sh:targetClass comm:EmailActionCard ;\n  sh:property [ sh:path comm:mode ; sh:hasValue \"EMAIL_DRAFT\" ] ;\n  sh:property [ sh:path comm:ontologyUse ; sh:minCount 1 ] ;\n  sh:property [ sh:path comm:replyStance ; sh:minCount 1 ] ;\n  sh:property [ sh:path comm:sendStatus ; sh:minCount 1 ] .\n```",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#14",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "3.6 Foundry Object Model",
    "text": "| Foundry object | Ontology class | Primary key | Links |\n|---|---|---|---|\n| `COMMUNICATION_EVENT` | `CommunicationEvent` | `eventId` | Thread, target object, attachment |\n| `MESSAGE_THREAD` | `MessageThread` | `threadId` | Messages, action requests, target objects |\n| `ACTION_REQUEST` | `ActionRequest` | `requestId` | Thread, assignee role, due time |\n| `APPROVAL_ACTION` | `ApprovalAction` | `actionId` | Request, evidence, audit record |\n| `AUDIT_RECORD` | `AuditRecord` | `auditId` | Actor role, source evidence, before/after refs |\n| `SLA_CLOCK` | `SLAClock` | `clockId` | Thread/action, escalation |\n| `PII_REDACTION_RECORD` | `PIIRedactionRecord` | `redactionId` | Participant, mask policy |\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#15",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "4.1 Source System Interfaces",
    "text": "| Source | Input | Output in CONSOLIDATED-08 | Ownership boundary |\n|---|---|---|---|\n| Gmail / Outlook | Message metadata, subject/body hash, attachment manifest | `EmailMessage`, `EvidenceAttachment`, `MessageThread` | Does not create shipment truth |\n| Email draft UI | User-provided email text and draft request | `sct_ontology` review, `EmailDraftArtifact`, `EmailActionCard` | Always calls or surfaces `sct_ontology`; does not create KG action |\n| WhatsApp / Telegram / Teams | Message ID, group, timestamp, sender role, content hash | `ChatMessage`, `CommunicationIntent`, `SLAClock` | Does not create approved action |\n| Document store / LDG | Document pointer, VerificationResult, OCR discrepancy | `DocumentPointer`, `linkedToVerification` | LDG owns document validation |\n| ERP / WMS / ATLP | Object identifiers and status references | `ObjectPointer` to ShipmentUnit/WarehouseTask/ReleaseOrder | Target system owns transaction |\n| Invoice / CostGuard | Invoice clarification and approval request | `ActionRequest`, `ApprovalAction`, `AuditRecord` | Cost domain owns verdict |\n| Port / OFCO | Port service clarification and release evidence discussion | `CommunicationEvent` linked to `PortCall`/`ServiceEvent` | Port domain owns port event |\n| FMC Org Chart | Role, site, designation, masked contact reference | `ThreadParticipant`, `RoleAssignment` | Raw PII remains outside KG |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#16",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "4.2 Canonical Ingestion Pipeline",
    "text": "```text\n1. Channel collector\n   - Collect message metadata, timestamp, channel, sender role, recipient role.\n   - Store raw body only in approved secure store if policy permits.\n\n2. Redaction gate\n   - Replace phone/e-mail with masked references.\n   - Preserve role, site, designation, organization unit, and hash join key.\n\n3. Thread resolver\n   - Join by message thread id, subject hash, object key, date window, and sender/receiver role.\n   - Do not merge unrelated shipments only because the same person appears.\n\n4. Intent classifier\n   - Classify as INFO, REQUEST, APPROVAL, ESCALATION, CLARIFICATION, CLAIM, COST_QUERY.\n   - Store classifier version and confidence.\n\n5. Object linker\n   - Resolve HVDC_CODE, BL, DO, BOE, invoice, container, package, PO, site, warehouse, exception, claim.\n   - Attach unresolved keys to `UnresolvedEvidenceKey`.\n\n6. Action gate\n   - Create `ActionRequest` if action is required.\n   - Create `ApprovalAction` only when actor role is authorized and evidence exists.\n\n7. Audit write\n   - Write `AuditRecord` with evidence hash, before/after object references, and reviewer role.\n```",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#17",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "4.3 Any-key Resolution Inputs",
    "text": "| Key type | Communication evidence field | Target class |\n|---|---|---|\n| `HVDC_CODE` | `mentionedKey` / `subjectKey` | `ShipmentUnit`, `Package`, `MaterialMaster` |\n| BL / Container / Seal | `mentionedTransportKey` | `BillOfLadingDocument`, `Container`, `JourneyLeg` |\n| BOE / DO / Permit | `mentionedReleaseKey` | `CustomsEntry`, `ReleaseOrder`, `PermitDocument` |\n| Invoice / OFCO / SAFEEN / ADP | `mentionedCostKey` | `Invoice`, `InvoiceLine`, `PortServiceEvent` |\n| Warehouse / Bin / Yard | `mentionedWarehouseKey` | `WarehouseTask`, `StockSnapshot`, `WarehouseHandlingProfile` |\n| Site / AGI / DAS / MIR / SHU | `mentionedSiteKey` | `SiteReceipt`, `LocationNode` |\n| OSDR / NCR / Claim | `mentionedExceptionKey` | `Exception`, `NCR`, `Claim` |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#18",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "4.4 Target Object Update Guard",
    "text": "| Message content | Allowed automatic output | Requires human-gated action |\n|---|---|---|\n| \"Please approve DO release\" | `ActionRequest(type=RELEASE_APPROVAL)` | Yes, before release update |\n| \"Invoice line is accepted\" | `ApprovalAction(decision=APPROVED)` if actor is authorized | Yes, before CostGuard closure |\n| \"Cargo is damaged\" | `CommunicationEvent` + `ActionRequest(type=OSD_INSPECTION)` | Yes, before NCR/Claim creation |\n| \"AGI delivery confirmed\" | `CommunicationEvent` with site delivery evidence | Yes, before M130 site receipt if no system event |\n| \"Storage class confirmed\" | Evidence attached to WHP review | Yes, WHP remains warehouse-owned |\n| \"답장 작성하라\" / \"draft reply\" | mandatory `sct_ontology` review + `EmailActionCard` + draft body | No, unless user explicitly requests action registration |\n| \"sct_ontology 사용 후 답장\" | `OntologyReview` + `EmailActionCard(ontologyUse=EXPLICIT_DEEP_ONTOLOGY)` + draft | Yes, if review result is used for operational mutation |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#19",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "4.5 Email Drafting Output Contract",
    "text": "Email draft outputs must be structurally predictable:\n\n1. `OntologyReview` first through `sct_ontology`.\n2. `EmailActionCard` second.\n3. `Draft` third.\n4. `Notes` optional and limited to missing input or send-risk.\n5. Ontology verdict labels must stay outside the outbound email body; use `reply_stance` and `send_status` inside the draft card.\n\nExample for a hold/request-info reply:\n\n```text\n[EMAIL_ACTION_CARD]\nmode: EMAIL_DRAFT\nontology_use: AUTO_SCT_ONTOLOGY_REQUIRED\nreply_stance: HOLD\nblocking_inputs: HE forwarder PIC, booking availability, OEM receiving readiness, cargo dims/wt/condition\nnext_action: request HE forwarder and OEM receiving confirmation before shipment decision\nsend_status: DRAFT_READY\n[/EMAIL_ACTION_CARD]\n```\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#20",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "5.0 Prompt-level Gate — Email Drafting",
    "text": "| Rule ID | Trigger | Required output | Block condition |\n|---|---|---|---|\n| `COMM-DRAFT-001` | reply/draft email request | mandatory `sct_ontology` review + `EmailActionCard` + draft | missing ontology review or hard-marked card |\n| `COMM-DRAFT-002` | reply/draft email request | `ontology_use = AUTO_SCT_ONTOLOGY_REQUIRED` | `sct_ontology` not invoked or not surfaced |\n| `COMM-DRAFT-003` | draft + ontology output | separated Ontology lane and Email lane | ontology verdict mixed into email body |\n| `COMM-DRAFT-004` | action/register request absent | no KG `ActionRequest` write | card converted into operational action without instruction |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#21",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "5.1 SPARQL — Communication must not own logistics state",
    "text": "```sparql\nSELECT ?msg ?badPredicate WHERE {\n  ?msg a comm:CommunicationEvent .\n  ?msg ?badPredicate ?value .\n  FILTER(?badPredicate IN (\n    hvdc:hasRoutingPattern,\n    hvdc:hasJourneyStage,\n    hvdc:hasMilestoneStatus,\n    wh:confirmedFlowCode,\n    cost:costGuardVerdict\n  ))\n}\n```\n\nExpected result: **0.00 rows**. Communication can reference target objects, not set these fields.",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#22",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "5.2 SPARQL — ApprovalAction completeness",
    "text": "```sparql\nSELECT ?action WHERE {\n  ?action a comm:ApprovalAction .\n  FILTER NOT EXISTS { ?action comm:decision ?decision }\n  UNION\n  { FILTER NOT EXISTS { ?action comm:actorRole ?role } }\n  UNION\n  { FILTER NOT EXISTS { ?action comm:targetObjectRef ?target } }\n  UNION\n  { FILTER NOT EXISTS { ?action comm:supportedByEvidence ?evidence } }\n  UNION\n  { FILTER NOT EXISTS { ?action comm:writesAuditRecord ?audit } }\n}\n```\n\nExpected result: **0.00 rows** before any operational mutation.",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#23",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "5.3 SPARQL — Open action breach list",
    "text": "```sparql\nSELECT ?request ?dueAt ?thread ?target WHERE {\n  ?request a comm:ActionRequest ;\n           comm:dueAt ?dueAt ;\n           comm:requestStatus \"OPEN\" ;\n           comm:targetObjectRef ?target ;\n           comm:openedByMessage ?msg .\n  ?msg comm:belongsToThread ?thread .\n  FILTER(?dueAt < NOW())\n}\nORDER BY ?dueAt\n```\n\nUse for SLA escalation and daily action backlog.",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#24",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "5.4 SPARQL — PII leakage candidate",
    "text": "```sparql\nSELECT ?node ?field WHERE {\n  ?node ?field ?value .\n  FILTER(?field IN (comm:rawPhone, comm:rawEmail, comm:rawContactValue))\n}\n```\n\nExpected result: **0.00 rows**. Raw contact values remain in secured source systems or are masked before register write.",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#25",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "5.5 SPARQL — Evidence link completeness",
    "text": "```sparql\nSELECT ?thread WHERE {\n  ?thread a comm:MessageThread .\n  FILTER NOT EXISTS { ?thread comm:referencesObject ?target }\n  FILTER NOT EXISTS { ?thread comm:triageStatus \"GENERAL_BROADCAST\" }\n}\n```\n\nExpected result: **0.00 unresolved operational threads**.",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#26",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "5.6 RAG Check Rules",
    "text": "| RAG item | Trigger | Required action |\n|---|---|---|\n| Regulation or authority instruction | MOIAT/FANR/DCD/ADNOC/CICPA/Port authority wording appears | Attach source document and action date |\n| Commercial approval | Cost, rate, invoice, DEM/DET, variation wording appears | Link to CostGuard / Contract / ApprovalAction |\n| Operational exception | Delay, damage, shortage, OSD, NCR, claim wording appears | Open `ActionRequest` and evidence pack |\n| Site delivery | AGI/DAS/MIR/SHU arrival wording appears | Link to milestone candidate and require material gate |\n| Privacy | Phone/e-mail/person contact fields appear | Apply `PIIRedactionRecord` before KG write |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#27",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "5.7 Human-gate",
    "text": "Human-gate is mandatory when any of the following is true:\n\n| Condition | Gate |\n|---|---|\n| Cost exposure > 100,000.00 AED | Cost owner approval |\n| Regulatory statement or permit validity affects release | Compliance owner approval |\n| M130 site receipt is inferred from communication only | Material handling owner approval |\n| WH handling class is referenced in communication | Warehouse owner approval |\n| Marine stability/lashing/lift approval is discussed | Marine / engineering owner approval |\n| Raw contact PII is detected | Data protection owner approval before write |\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#28",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "6.1 Compliance Role",
    "text": "`CONSOLIDATED-08` does not decide compliance. It stores evidence of communication, approvals, and audit lineage for compliance-related decisions.\n\n| Compliance area | Communication evidence | Target owner |\n|---|---|---|\n| Incoterms 2020 | Cost/risk responsibility clarification, handover discussion | Contract / Cost domain |\n| MOIAT / Customs | BOE, certificate, exemption, clearance discussion | Customs / Document domain |\n| FANR | Nuclear/radiation-related certificate discussion | Compliance owner |\n| DCD / DG | Dangerous goods permit and safety note discussion | Warehouse / HSE / Document domain |\n| ADNOC / CICPA / GatePass | Site/offshore access and gate pass approval evidence | Material handling / Site / Port |\n| Port authority / SAFEEN / ADP | Service clarification, berth/gate discussion | Port operations |\n| Data privacy | PII masking and access control records | Data governance |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#29",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "6.2 Access and Privacy Guard",
    "text": "1. Raw body text is optional. The evidence graph can operate using `bodyHash`, `summary`, `attachmentHash`, and `object pointers`.\n2. Phone/e-mail from the organization chart is masked before any register write.\n3. Names may be retained only as role-linked participant labels when project policy permits.\n4. Sensitive threads receive `sensitivityLabel = CONFIDENTIAL` or `PII_MASKED`.\n5. Legal hold threads cannot be auto-archived without a retention policy action.",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#30",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "6.3 Audit Retention",
    "text": "| Evidence type | Retention recommendation | Notes |\n|---|---|---|\n| ApprovalAction | Project closeout + contractual retention | Required for release/cost/compliance decisions |\n| AuditRecord | Same as target transaction | Keep before/after refs |\n| MessageThread summary | Project closeout + audit window | Keep hash and role metadata |\n| Raw message body | Policy-controlled secure store | Not required inside KG |\n| Attachment manifest | Same as referenced document | Hash required |\n| PII redaction log | Same as communication register | No raw PII |\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#31",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "7. Options ≥3 (Pros/Cons/Cost/Risk/Time)",
    "text": "| Option | Scope | Pros | Cons | Est. cost | Risk | Time |\n|---|---|---|---|---:|---|---:|\n| A | Evidence Register Lite | Fast deployment; thread/action visibility; low integration complexity | Limited automation; manual target linking | 30,000.00 AED | MEDIUM | 2.00 weeks |\n| B | Approval & SLA Control | ApprovalAction, SLAClock, escalation, audit proof | Needs role model and access policy | 75,000.00 AED | MEDIUM | 4.00 weeks |\n| C | RAG Evidence Copilot | Summaries, intent classification, unresolved action extraction | Requires model governance and confidence gating | 120,000.00 AED | HIGH | 6.00 weeks |\n| D | Integrated Communication Twin | Full linkage to LDG, CostGuard, WMS, Port, Material, Ops dashboards | Highest governance and integration load | 180,000.00 AED | HIGH | 8.00 weeks |\n\nRecommended baseline: **Option B** for immediate approval/SLA control. Scale to **Option D** when target object links and PII redaction policy are stable.\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#32",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "8. Roadmap (Prepare→Pilot→Build→Operate→Scale + KPI)",
    "text": "| Phase | Duration | Work package | KPI |\n|---|---:|---|---|\n| Prepare | 1.00 week | Define channel list, role dictionary, PII mask policy, evidence target classes | Role coverage ≥ 95.00% |\n| Pilot | 2.00 weeks | Ingest sample email/chat threads, build `MessageThread`, link to 3.00 target domains | Link precision ≥ 90.00% |\n| Build | 3.00 weeks | Add `ActionRequest`, `ApprovalAction`, `SLAClock`, `AuditRecord`, SHACL gates | Approval completeness ≥ 98.00% |\n| Operate | Ongoing | Daily unresolved-action report, SLA breach alert, audit pack creation | SLA breach resolution ≤ 24.00 hrs |\n| Scale | 4.00 weeks | Add RAG summarization, cross-domain evidence search, Ops dashboard hooks | CommunicationLinkCoverage ≥ 95.00% |\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#33",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "9.1 Foundry Functions",
    "text": "| Function | Input | Output | Guard |\n|---|---|---|---|\n| `normalizeMessageEvent` | raw channel payload | `CommunicationEvent` | PII redaction pre-check |\n| `resolveMessageThread` | message metadata + target keys | `MessageThread` | Avoid cross-shipment false merge |\n| `classifyCommunicationIntent` | message summary + attachments | `CommunicationIntent` | Store confidence and classifier version |\n| `openActionRequest` | intent + target object | `ActionRequest` | Require target or triage status |\n| `recordApprovalAction` | request + actor role + decision | `ApprovalAction` + `AuditRecord` | Check authorization |\n| `createEvidencePack` | thread + target object + attachments | `ProofArtifact` | Hash required |\n| `emailDraftGuard` | email text + draft request | mandatory `sct_ontology` review + `EmailActionCard` + draft | `AUTO_SCT_ONTOLOGY_REQUIRED`; no KG action unless explicit trigger |\n| `escalateBreachedSLA` | SLAClock | `EscalationRecord` | Business hours calendar |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#34",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "9.2 RPA / Messaging Hooks",
    "text": "```text\n/email-intake --source=gmail --mask-pii --link-anykey\n/chat-intake --source=telegram --mask-pii --open-actions\n/approval-gate --target=<objectKey> --evidence=<threadId> --human-gate\n/sla-watch --domain=release,cost,claim --threshold=24.00h\n```",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#35",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "9.3 LLM Guardrail",
    "text": "| LLM output | Allowed use | Not allowed |\n|---|---|---|\n| Thread summary | Analyst review, audit pack prefill | Operational fact without evidence |\n| Intent classification | Queue routing | Approval decision |\n| Key extraction | Candidate object linking | Identity resolution without confidence |\n| Risk note | Escalation hint | Regulatory interpretation as fact |\n| Email draft | Reply composition after mandatory ontology review | KG mutation or ontology verdict inside outbound email body |\n| EmailActionCard | Draft triage and send-readiness | Replacement for `ActionRequest` without explicit user instruction |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#36",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "9.4 Sheets / Dashboard Hooks",
    "text": "| Sheet / dashboard | Metric | Source |\n|---|---|---|\n| Daily Action Backlog | Open actions by domain and owner role | `ActionRequest` |\n| Approval Completeness | ApprovalAction with evidence and audit | `ApprovalAction` |\n| SLA Breach Heatmap | Breach count by domain/site | `SLAClock` |\n| Exception Communication | OSD/NCR/Claim threads by age | `MessageThread` + `Exception` |\n| PII Compliance | Redaction coverage and leakage count | `PIIRedactionRecord` |\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#37",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "10.1 QA Checklist",
    "text": "| # | Check | Expected |\n|---:|---|---|\n| 1.00 | `CommunicationEvent` has channel and eventTime | PASS |\n| 2.00 | Every actionable thread has `ActionRequest` or triage status | PASS |\n| 3.00 | `ApprovalAction` has actorRole, decision, target, evidence, audit | PASS |\n| 4.00 | No communication object writes route, milestone, cost verdict, or WH handling class directly | PASS |\n| 5.00 | Raw phone/e-mail fields are absent from KG | PASS |\n| 6.00 | Every attachment has artifact hash | PASS |\n| 7.00 | Every audit record has evidence hash | PASS |\n| 8.00 | RAG summaries are marked as summaries, not evidence truth | PASS |\n| 9.00 | MOSB is described as offshore staging / marine interface only | PASS |\n| 10.00 | SLAClock closedAt cannot precede startAt | PASS |\n| 11.00 | High-value cost approval has Human-gate | PASS |\n| 12.00 | Regulatory statements require current source/evidence link | PASS |\n| 13.00 | Communication object links to at least one target or `GENERAL_BROADCAST` triage | PASS |\n| 14.00 | Names from FMC role data do not expose phone/e-mail | PASS |\n| 15.00 | LLM confidence is stored for intent classification | PASS |\n| 16.00 | Authorized actor role is checked before approval mutation | PASS |\n| 17.00 | Cross-domain target objects are referenced, not redefined | PASS |\n| 18.00 | Validation p95 remains < 5.00s for indexed keys | PASS |\n| 19.00 | All operational updates write before/after object refs | PASS |\n| 20.00 | ZERO/Failsafe table used when evidence is insufficient | PASS |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#38",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "10.2 Assumptions",
    "text": "| Assumption | Impact | Mitigation |\n|---|---|---|\n| Email/chat channels can provide stable message IDs or hashes | Thread resolution depends on stable keys | Store channel-specific fallback hash |\n| Project role dictionary is approved | Actor authorization depends on role | Keep role approval as Prepare-phase gate |\n| Raw message storage policy may differ by channel | KG may not store bodies | Use body hash + summary + attachment manifest |\n| FMC contact data contains PII | Raw contact values cannot be written to KG | Apply mask and hash before register write |\n| RAG/LLM confidence may be imperfect | Wrong target linkage risk | Human-gate low-confidence action |",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#39",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "10.3 ZERO / Fail-safe",
    "text": "| 단계 | 이유 | 위험 | 요청데이터 | 다음조치 |\n|---|---|---|---|---|\n| Evidence write paused | Target object unresolved or PII unmasked | False linkage / privacy leakage | HVDC key, source message hash, role confirmation | Run `resolveAnyKey` and redaction gate |\n| Approval action paused | Actor role not authorized | Unauthorized transaction update | RoleAssignment and approval matrix | Human-gate by domain owner |\n| Compliance summary paused | Current authority source missing | Wrong release decision | Permit/SOP/source document and action date | RAG verification and compliance review |\n| Operational mutation paused | Message is only a request or claim | Transaction truth contamination | Approved action and evidence pack | Foundry Action after reviewer approval |\n\n---",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-08-communication#40",
    "docId": "CONSOLIDATED-08-communication",
    "title": "hvdc-communication · CONSOLIDATED-08",
    "version": "2.0-final",
    "sectionPath": "11. CmdRec",
    "text": "```text\n/switch_mode LATTICE + /logi-master report --deep --KRsummary\n/logi-master cert-chk --deep --KRsummary\n/logi-master kpi-dash --communication-sla --noheatmap\n```",
    "docHash": "1fd8a0d01c7c5241780688221b03ca314de77d70a5375679316e3b561fc782a5",
    "domains": [
      "communication"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#1",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Operations Management & RoutingPattern Analytics Ontology — Consolidated\"\ntype: \"ontology-design\"\ndomain: \"operations-management\"\nsub-domains:\n  - operations-analytics\n  - routing-pattern-kpi\n  - warehouse-stock-reporting\n  - site-delivery-analytics\n  - marine-bulk-vessel-analytics\n  - cost-and-sqm-reporting\n  - exception-dashboard\nversion: \"2.0-final\"\ndate: \"2026-04-27\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\nextension_of: \"hvdc-master-ontology-v2.0-final\"\ncanonical_role: \"operations analytics, reporting, KPI, dashboard, and data-mapping extension\"\nowner: \"HVDC Logistics Ontology Working Set\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - JSON-LD\n  - GS1-EPCIS-CBV\n  - DCSA-Track-and-Trace\n  - PROV-O\n  - OWL-Time\n  - SKOS\n  - DQV\nsource_files:\n  - 2_EXT-05-hvdc-ops-management.md\n  - legacy_operations_excel_mapping_notes\nchecked_against:\n  - CONSOLIDATED-00-master-ontology.md\n  - CONSOLIDATED-01-core-framework-infra.md\n  - CONSOLIDATED-02-warehouse-flow.md\n  - CONSOLIDATED-03-document-ocr.md\n  - CONSOLIDATED-04-barge-bulk-cargo.md\n  - CONSOLIDATED-05-invoice-cost.md\n  - CONSOLIDATED-06-material-handling.md\n  - CONSOLIDATED-07-port-operations.md\n  - CONSOLIDATED-08-communication.md\n  - AGENTS.md\n  - HVDC Logistics Ontology Review.txt\n  - Palantir 온톨로지 기반 물류 자동화.pdf\nvalidation_passes: 5\nsemantic_patch:\n  - \"Operations consumes canonical ShipmentRoutingPattern, JourneyStage, JourneyLeg, MilestoneEvent, StockSnapshot, SiteReceipt, CostGuardResult, and CommunicationEvent; it does not redefine them.\"\n  - \"WarehouseHandlingProfile.confirmedFlowCode remains warehouse-only and is used only as WH evidence or storage analytics dimension.\"\n  - \"End-to-end routing KPI uses ShipmentRoutingPattern, not legacy warehouse route-code language.\"\n  - \"MOSB is OffshoreStagingNode / MarineInterfaceNode; operations may report MOSB dwell and marine readiness but shall not classify MOSB as Warehouse.\"\n  - \"Bulk/vessel/OOG analytics consume CONSOLIDATED-04 marine events and CONSOLIDATED-06 material milestones; execution truth remains in those domains.\"\n  - \"Excel/ERP rows become OperationDataset, OperationRecord, MappingRule, AnalyticsRun, KPIObservation, and ReportArtifact.\"\nfinal_validation_rounds: 5\nfinal_validation_status: \"PASS\"\nfinal_validated_date: \"2026-04-27\"\nfinal_patch_bundle: \"HVDC_Logistics_Ontology_FINAL_5x_2026-04-27\"\npatch_version: \"2.1-query-prefix-hardening\"\npatched_date: \"2026-05-12\"\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#2",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "1. ExecSummary",
    "text": "`CONSOLIDATED-09`는 HVDC Logistics KG의 **operations analytics / reporting / KPI extension**이다. Excel, ERP, WMS, ATLP, LDG/OCR, Port, Cost, Marine, Communication 데이터를 `OperationDataset`, `OperationRecord`, `AnalyticsRun`, `KPIObservation`, `OperationalSnapshot`, `ReportArtifact`로 정규화하여 운영 가시성을 제공한다.\n\n비즈니스 임팩트는 **RoutingPattern 기반 물류 효율 분석**, **WH/Site/MOSB/Marine stock·dwell·dispatch 현황 통합**, **SQM/PKG/CBM 이중계산 방지**, **월별 보고 자동화**, **exception/action backlog를 통한 지연 비용 감소**이다.\n\n기술 해법은 canonical object를 재정의하지 않고 consume-only로 읽는 것이다. 전체 여정은 `ShipmentRoutingPattern`, 상태 전이는 `MilestoneEvent`, 창고 내부 처리는 `WarehouseHandlingProfile`, 커뮤니케이션 증빙은 `CommunicationEvent`, 비용 verdict는 `CostGuardResult`가 소유한다.\n\nKPI 목표는 `RoutingPatternCoverage ≥ 95.00%`, `StockSnapshotAccuracy ≥ 99.00%`, `DoubleCountLeakage = 0.00건`, `ReportRefreshSLA ≤ 4.00h`, `Validation p95 < 5.00s`이다.\n\n**ENG-KR one-liner:** Operations consumes the logistics twin for analytics and reporting; it does not own route truth, warehouse handling, marine execution, cost verdicts, or communication evidence.\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#3",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "2.1 Master Governance Rule",
    "text": "1. `CONSOLIDATED-00-master-ontology.md` is the canonical semantic spine.\n2. `CONSOLIDATED-09` owns **analytics, reporting, KPI observations, dashboard views, dataset mappings, and report artifacts** only.\n3. Operations consumes `ShipmentRoutingPattern`, `JourneyStage`, `JourneyLeg`, `MilestoneEvent`, `StockSnapshot`, `WarehouseTask`, `SiteReceipt`, `MarineEvent`, `PortServiceEvent`, `CostGuardResult`, and `CommunicationEvent`.\n4. Operations shall not redefine the route dictionary, milestone dictionary, identity policy, WHP algorithm, CostGuard band, or communication evidence model.\n5. `WarehouseHandlingProfile.confirmedFlowCode` is warehouse-only. Operations may use WHP as a warehouse evidence dimension but cannot calculate or assign it.\n6. `MOSB` is an `OffshoreStagingNode` / `MarineInterfaceNode`. Operations may report MOSB dwell, staging readiness, marine interface backlog, and AGI/DAS route compliance.\n7. Excel/DataFrame row status is evidence for analytics. It cannot override operational truth without source-system reconciliation and an approved domain action.",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#4",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "2.2 Included vs Delegated Scope",
    "text": "| Scope item | Included in CONSOLIDATED-09 | Delegated / excluded |\n|---|---|---|\n| Dataset normalization | Header cleanup, date normalization, key extraction, mapping rules | Source-system master ownership |\n| KPI observation | Route, stock, dwell, site receipt, exception, cost, SLA metrics | Domain-specific operational decision |\n| Dashboard and reports | 5-sheet summary, 27-sheet snapshots, route KPI, stock aging, SQM billing view | Contractual invoice approval |\n| WH/Site analytics | WH in/out, stock balance, site arrival, GRN/POD status | WHP algorithm and SiteReceipt transaction creation |\n| MOSB/Marine analytics | MOSB dwell, M115/M116/M117/M130 continuity, LCT utilization | Marine execution approval and stability/lashing truth |\n| Bulk/vessel analytics | Bulk cargo summary, vessel trip KPI, heavy-lift dashboard | OOG/marine engineering calculation |\n| Cost analytics | CostGuard summary, invoice aging, DEM/DET risk view | RateRef ownership and payment approval |\n| Communication analytics | Open actions, SLA breach, approval evidence completeness | Message ontology ownership |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#5",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "2.3 Domain Boundary Crosswalk",
    "text": "| Domain | Allowed interface with operations | Not allowed in CONSOLIDATED-09 |\n|---|---|---|\n| Master spine | Consume identity policy, route, stage, milestone, data layer separation | Redefine core classes |\n| Infrastructure | Consume `LocationNode`, `Site`, `Warehouse`, `OffshoreStagingNode`, `Port` | Reclassify MOSB as warehouse |\n| Warehouse | Consume `WarehouseEvent`, `StockSnapshot`, `WarehouseHandlingProfile` evidence | Assign warehouse handling class |\n| Document/OCR | Consume `VerificationResult`, `routeEvidence`, `destinationEvidence`, `mosbLegIndicator` | Treat OCR evidence as final transaction truth |\n| Marine/Bulk | Consume M115/M116/M117, `MarineEvent`, LCT utilization | Replace marine execution with dashboard row |\n| Cost | Consume `Invoice`, `CostGuardResult`, DEM/DET clock | Own RateRef or CostGuard verdict |\n| Material handling | Consume M90→M160 timeline and site receipt | Create site receipt from spreadsheet alone |\n| Port | Consume `PortCall`, `ServiceEvent`, `plannedRoutingPattern`, release evidence | Own port service truth |\n| Communication | Consume open action/SLA metrics and approval evidence completeness | Redefine communication classes |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#6",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "2.4 Legacy Migration Rules",
    "text": "| Legacy wording / pattern | Canonical replacement | Patch action |\n|---|---|---|\n| Route KPI by warehouse route code | KPI by `ShipmentRoutingPattern` | Replace in dashboard and SPARQL |\n| Pre-arrival represented as warehouse class | `RoutingPattern = PRE_ARRIVAL` or `JourneyStage = PLANNING/PORT_ENTRY` | Use master route/stage |\n| MOSB listed as warehouse | `OffshoreStagingNode` / `MarineInterfaceNode` with `OperationalSnapshot` | Report separately from WH stock |\n| Spreadsheet status overrides shipment | `OperationRecord` evidence + reconciliation result | Require source-system action |\n| Bulk/vessel execution truth in Ops | `MarineEvent` / `BargeOperation` from CONSOLIDATED-04 | Ops reports only |\n| Cost center decision in Ops | `CostGuardResult` / `CostAllocation` from CONSOLIDATED-05 | Ops aggregates only |\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#7",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "3.1 Operations Ontology Layer",
    "text": "| Layer | Class / vocabulary | Purpose |\n|---|---|---|\n| Dataset | `OperationDataset`, `OperationRecord`, `SourceRow`, `DataMappingRule`, `HeaderNormalizationRule` | Ingested spreadsheet/API rows and mapping logic |\n| Analytics | `AnalyticsRun`, `KPIObservation`, `MetricDefinition`, `DashboardView`, `ReportArtifact` | Analytical outputs and dashboards |\n| Snapshot | `OperationalSnapshot`, `StockSnapshotView`, `RouteSnapshot`, `AgingSnapshot`, `CostSnapshot` | Periodic state view |\n| Route analytics | `RoutingPatternKPI`, `JourneyStageKPI`, `MilestoneCoverageMetric` | End-to-end visibility metrics |\n| Warehouse analytics | `WarehouseStockKPI`, `DwellMetric`, `CapacityMetric`, `DispatchMetric` | WH inventory and movement reporting |\n| Site analytics | `SiteReceiptKPI`, `GRNCompletenessMetric`, `OSDMetric`, `IssueMetric` | Site delivery and closeout reporting |\n| Marine analytics | `MOSBDwellMetric`, `LCTUtilizationMetric`, `MarineReadinessMetric` | Offshore staging and LCT reporting |\n| Cost analytics | `CostGuardSummary`, `InvoiceAgingMetric`, `DEMDETExposureMetric`, `SQMBillingMetric` | Cost and billing analytics |\n| Exception analytics | `ExceptionBacklogMetric`, `NCRMetric`, `ClaimAgingMetric`, `SLAActionMetric` | Risk and unresolved action reporting |\n| Evidence | `OperationEvidenceLink`, `ReconciliationResult`, `DataQualityFinding`, `AuditRecord` | Quality and lineage |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#8",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "3.2 Core Classes",
    "text": "| Class | Required properties | Key relations | Notes |\n|---|---|---|---|\n| `OperationDataset` | `datasetId`, `sourceSystem`, `datasetType`, `extractDate`, `rowCount` | `hasSourceRow`, `usesMappingRule`, `producesAnalyticsRun` | Excel/API input container |\n| `OperationRecord` | `recordId`, `sourceRowId`, `recordType`, `eventDate`, `quantityPkg`, `volumeCbm`, `areaSqm` | `resolvesToShipmentUnit`, `referencesLocation`, `evidencesMilestone` | Row-level normalized record |\n| `DataMappingRule` | `ruleId`, `sourceColumn`, `targetProperty`, `transformType`, `version` | `appliesToDataset`, `mapsToClass` | Column mapping and normalization |\n| `AnalyticsRun` | `runId`, `runAt`, `runType`, `sourceDatasetHash`, `validationStatus` | `usesDataset`, `generatesKPI`, `generatesReport` | Reproducible analytics execution |\n| `KPIObservation` | `kpiId`, `metricCode`, `metricValue`, `metricUnit`, `observedAt`, `periodStart`, `periodEnd` | `computedFrom`, `forDomain`, `forLocation` | DQV-style metric |\n| `OperationalSnapshot` | `snapshotId`, `snapshotDate`, `snapshotType`, `cutoffAt` | `summarizesShipmentUnit`, `summarizesLocation`, `derivedFromRun` | Monthly/daily state |\n| `ReportArtifact` | `reportId`, `reportType`, `generatedAt`, `artifactHash`, `sheetCount` | `derivedFromRun`, `includesKPI` | Excel/PDF/dashboard output |\n| `ReconciliationResult` | `resultId`, `checkCode`, `status`, `deltaPct`, `findingCount` | `checksRecord`, `checksTargetObject`, `opensFinding` | Data quality validation |\n| `DataQualityFinding` | `findingId`, `severity`, `findingType`, `detectedAt`, `ownerDomain` | `aboutRecord`, `aboutTargetObject`, `requiresAction` | Exception list |\n| `OperationEvidenceLink` | `linkId`, `evidenceType`, `confidence`, `sourceRef` | `linksRecordToObject`, `derivedFromDocument`, `derivedFromCommunication` | Evidence bridge |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#9",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "3.3 Object Properties",
    "text": "| Property | Domain → Range | Cardinality | Purpose |\n|---|---|---:|---|\n| `resolvesToShipmentUnit` | `OperationRecord → ShipmentUnit` | 0..1 | Any-key identity join |\n| `evidencesMilestone` | `OperationRecord → MilestoneEvent` | 0..n | Row evidence for status transition |\n| `referencesLocation` | `OperationRecord → LocationNode` | 0..n | Port/WH/MOSB/site reference |\n| `usesMappingRule` | `OperationDataset → DataMappingRule` | 1..n | Mapping reproducibility |\n| `computedFrom` | `KPIObservation → AnalyticsRun/OperationalSnapshot` | 1..n | KPI provenance |\n| `generatesReport` | `AnalyticsRun → ReportArtifact` | 0..n | Report lineage |\n| `opensFinding` | `ReconciliationResult → DataQualityFinding` | 0..n | Quality exception |\n| `requiresAction` | `DataQualityFinding → ActionRequest` | 0..1 | Communication action hook |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#10",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "3.4 Data Properties",
    "text": "| Property | Range | Rule |\n|---|---|---|\n| `hasRoutingPattern` | SKOS enum | Values match master `ShipmentRoutingPattern` only |\n| `eventDate` | `xsd:dateTime` | ISO-8601; no ambiguous local dates |\n| `quantityPkg` | decimal | `>= 0.00`; integer package count when package unit applies |\n| `volumeCbm` | decimal | `>= 0.00`; preserve original unit evidence |\n| `areaSqm` | decimal | `>= 0.00`; mandatory for SQM billing rows |\n| `deltaPct` | decimal | Store as percentage with 2.00 decimal precision |\n| `validationStatus` | SKOS enum | `PASS`, `WARN`, `HIGH`, `CRITICAL`, `BLOCKED` |\n| `snapshotDate` | `xsd:date` | Monthly snapshot uses cutoff date, not generation date |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#11",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "3.5 Canonical KPI Dictionary",
    "text": "| KPI code | Formula | Target |\n|---|---|---:|\n| `OPS_ROUTE_COVERAGE` | ShipmentUnits with valid `hasRoutingPattern` / total ShipmentUnits | ≥ 95.00% |\n| `OPS_MILESTONE_COVERAGE` | ShipmentUnits with required milestones / total ShipmentUnits | ≥ 90.00% |\n| `OPS_STOCK_ACCURACY` | matched stock records / total stock records | ≥ 99.00% |\n| `OPS_DOUBLECOUNT_LEAKAGE` | duplicate counted records after reconciliation | 0.00건 |\n| `OPS_AGIDAS_GATE_PASS` | AGI/DAS site arrivals with M115/M116/M117 evidence / total AGI/DAS arrivals | 100.00% |\n| `OPS_REPORT_REFRESH_SLA` | report generation age | ≤ 4.00 hrs |\n| `OPS_DEMDET_RISK` | release-to-gateout breaches / total release events | ≤ 10.00% |\n| `OPS_ACTION_CLOSURE` | closed action requests / total action requests | ≥ 90.00% |\n| `OPS_VALIDATION_LATENCY` | validation p95 | < 5.00s |\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#12",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "4.1 Source-to-Object Mapping",
    "text": "| Source | Consumed data | Operations object | Target domain owner |\n|---|---|---|---|\n| ERP / Procurement | PO, package, material, vendor, delivery plan | `OperationDataset`, `OperationRecord` | Master / procurement source |\n| WMS | M110/M111/M120/M121, stock, zone/bin, WHP evidence | `WarehouseStockKPI`, `StockSnapshotView` | CONSOLIDATED-02 |\n| ATLP / Customs | BOE, DO, release, gate-out, M90/M92/M100 | `MilestoneCoverageMetric`, `DEMDETExposureMetric` | Master / Material / Port |\n| LDG/OCR | VerificationResult, document discrepancy, route/destination evidence | `DataQualityFinding`, `OperationEvidenceLink` | CONSOLIDATED-03 |\n| Marine / Barge | M115/M116/M117, LCT trip, lashing/stability readiness | `MOSBDwellMetric`, `LCTUtilizationMetric` | CONSOLIDATED-04 |\n| Invoice / CostGuard | Invoice aging, cost bands, DEM/DET, SQM charges | `CostGuardSummary`, `SQMBillingMetric` | CONSOLIDATED-05 |\n| Material Handling | M90→M160 custody chain, site receipt, OSD/NCR/Claim | `SiteReceiptKPI`, `ExceptionBacklogMetric` | CONSOLIDATED-06 |\n| Port / OFCO | PortCall, ServiceEvent, TariffRef, release evidence | `PortServiceKPI`, `ReleaseDelayMetric` | CONSOLIDATED-07 |\n| Communication | Open actions, approval evidence, SLA breach | `SLAActionMetric`, `ApprovalCompletenessMetric` | CONSOLIDATED-08 |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#13",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "4.2 Data Pipeline",
    "text": "```text\n1. Ingest\n   - Read Excel/API rows.\n   - Preserve source file hash, sheet name, row number, extraction date.\n\n2. Normalize\n   - Trim whitespace, normalize date formats, resolve column aliases.\n   - Convert quantities to canonical unit while preserving original value.\n\n3. Map\n   - Apply DataMappingRule version.\n   - Create OperationRecord and candidate target object links.\n\n4. Resolve\n   - Run Any-key identity resolution.\n   - Link records to ShipmentUnit, Document, WarehouseTask, SiteReceipt, Invoice, Exception.\n\n5. Validate\n   - Run SHACL/SPARQL rules.\n   - Create ReconciliationResult and DataQualityFinding.\n\n6. Compute\n   - Generate OperationalSnapshot and KPIObservation.\n\n7. Publish\n   - Create ReportArtifact or dashboard view.\n   - Push open findings to Communication ActionRequest when needed.\n```",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#14",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "4.3 Two-track Date Model",
    "text": "Operations supports a two-track date model but does not overwrite the canonical event timeline.\n\n| Track | Source columns | Canonical target | Reporting output |\n|---|---|---|---|\n| WH track | DSV Indoor, Outdoor, AAA, MZP, WH Received, WH Dispatch | `WarehouseEvent`, `StockSnapshot`, `WarehouseTask` | WH in/out, dwell, stock aging |\n| Site track | AGI, DAS, MIR, SHU, site receipt date, POD/GRN | `SiteReceipt`, `MilestoneEvent` | Site arrival, receipt compliance |\n| MOSB track | MOSB staging date, LCT load/sail-away, offshore handover | `OffshoreStagingNode`, `MarineEvent`, `MilestoneEvent` | MOSB dwell, AGI/DAS gate |\n| Cost track | invoice date, draft/approved amount, DEM/DET clock | `Invoice`, `CostGuardResult`, `DEMDETClock` | Cost aging and risk |\n| Communication track | request date, approval date, escalation due date | `ActionRequest`, `ApprovalAction`, `SLAClock` | Open action and SLA report |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#15",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "4.4 5-Sheet Standard Report",
    "text": "| Sheet | Grain | Metrics | Source objects |\n|---|---|---|---|\n| `01_RoutingPattern` | ShipmentUnit | route pattern, stage, current location, exception status | ShipmentUnit, JourneyStage, MilestoneEvent |\n| `02_WH_Monthly` | Warehouse x month | inbound, outbound, stock, dwell, capacity | WarehouseEvent, StockSnapshot |\n| `03_Site_Monthly` | Site x month | arrivals, POD, GRN, OSD, NCR | SiteReceipt, InspectionEvent |\n| `04_PreArrival` | ShipmentUnit | ETA, doc readiness, release blockers | PortCall, Document, CustomsEntry |\n| `05_All_Transactions` | OperationRecord | source row, target object, validation status | OperationDataset, OperationRecord |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#16",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "4.5 27-Sheet Snapshot Pattern",
    "text": "`OperationalSnapshot` can generate detailed monthly snapshots by location group and domain. The B5 date or equivalent cutoff cell is treated as `snapshotDate`, while actual generation timestamp is `generatedAt`.\n\n| Snapshot group | Example sheets | Control |\n|---|---|---|\n| WH stock | Indoor, Outdoor, AAA, MZP, DG, OOG | WHP evidence only |\n| Site | AGI, DAS, MIR, SHU | SiteReceipt evidence |\n| MOSB / marine | MOSB staging, LCT trips, offshore pending | OffshoreStagingNode / MarineEvent |\n| Cost | Invoice aging, DEM/DET, SQM billing | CostGuard evidence |\n| Exception | OSD, NCR, claim, open communication actions | Exception + CommunicationEvent |\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#17",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.1 SHACL — OperationRecord identity and date",
    "text": "```turtle\nops:OperationRecordShape a sh:NodeShape ;\n  sh:targetClass ops:OperationRecord ;\n  sh:property [ sh:path ops:recordId ; sh:minCount 1 ; sh:maxCount 1 ] ;\n  sh:property [ sh:path ops:sourceRowId ; sh:minCount 1 ; sh:maxCount 1 ] ;\n  sh:property [ sh:path ops:eventDate ; sh:datatype xsd:dateTime ; sh:minCount 1 ] ;\n  sh:property [ sh:path ops:quantityPkg ; sh:datatype xsd:decimal ; sh:minInclusive 0.00 ] .\n```",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#18",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.2 SHACL — RoutingPattern controlled vocabulary",
    "text": "```turtle\nops:RoutingPatternObservationShape a sh:NodeShape ;\n  sh:targetClass ops:OperationRecord ;\n  sh:property [\n    sh:path ops:hasRoutingPattern ;\n    sh:in ( \"PRE_ARRIVAL\" \"DIRECT\" \"WH_ONLY\" \"MOSB_DIRECT\" \"WH_MOSB\" \"MIXED\" ) ;\n  ] .\n```",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#19",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.3 SPARQL — Operations must not redefine core truth",
    "text": "```sparql\nPREFIX ops:    <http://samsung.com/project-logistics/operations#>\nPREFIX wh:     <http://samsung.com/project-logistics/warehouse#>\nPREFIX cost:   <http://samsung.com/project-logistics/cost#>\nPREFIX marine: <http://samsung.com/project-logistics/marine#>\nPREFIX comm:   <http://samsung.com/project-logistics/communication#>\n\nSELECT ?opsObj ?badPredicate WHERE {\n  ?opsObj a ?opsClass .\n  FILTER(?opsClass IN (ops:OperationRecord ops:KPIObservation ops:OperationalSnapshot))\n  ?opsObj ?badPredicate ?value .\n  FILTER(?badPredicate IN (\n    wh:confirmedFlowCode,\n    cost:costGuardVerdict,\n    marine:stabilityApprovalStatus,\n    comm:decision\n  ))\n}\n```\n\nExpected result: **0.00 rows**. Operations reads those fields from owners.",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#20",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.4 SPARQL — Missing route pattern coverage",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?su WHERE {\n  ?su a hvdc:ShipmentUnit .\n  FILTER NOT EXISTS { ?su hvdc:hasRoutingPattern ?pattern }\n}\n```\n\nMetric: `OPS_ROUTE_COVERAGE`. Target: **≥ 95.00%**.",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#21",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.5 SPARQL — AGI/DAS offshore gate",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\n\nSELECT ?su ?site WHERE {\n  ?su hvdc:finalDestination ?site ;\n      hvdc:hasMilestone hvdc:M130 .\n  FILTER(?site IN (\"AGI\", \"DAS\"))\n  FILTER NOT EXISTS { ?su hvdc:hasMilestone hvdc:M115 }\n  FILTER NOT EXISTS { ?su hvdc:hasHumanGatedException ?ex }\n}\n```\n\nExpected result: **0.00 rows** unless approved exception exists.",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#22",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.6 SPARQL — WH stock double-count candidate",
    "text": "```sparql\nPREFIX ops: <http://samsung.com/project-logistics/operations#>\n\nSELECT ?su ?location ?date (COUNT(?record) AS ?cnt) WHERE {\n  ?record a ops:OperationRecord ;\n          ops:resolvesToShipmentUnit ?su ;\n          ops:referencesLocation ?location ;\n          ops:eventDate ?date ;\n          ops:recordType \"STOCK_IN\" .\n}\nGROUP BY ?su ?location ?date\nHAVING (COUNT(?record) > 1)\n```\n\nExpected result: **0.00 rows** after deduplication.",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#23",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.7 SPARQL — M92 to M100 DEM/DET risk",
    "text": "```sparql\nPREFIX hvdc: <http://samsung.com/project-logistics#>\nPREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>\n\nSELECT ?su ?releasedAt ?gateOutAt WHERE {\n  ?su hvdc:hasMilestoneEvent ?m92 .\n  ?m92 hvdc:milestoneCode \"M92\" ;\n       hvdc:actualDt ?releasedAt .\n  OPTIONAL {\n    ?su hvdc:hasMilestoneEvent ?m100 .\n    ?m100 hvdc:milestoneCode \"M100\" ;\n          hvdc:actualDt ?gateOutAt .\n  }\n  FILTER(!BOUND(?gateOutAt) || (?gateOutAt > ?releasedAt + \"PT72H\"^^xsd:duration))\n}\n```\n\nCreates DEM/DET risk KPI only; Cost domain owns charge audit.",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#24",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.8 SPARQL — Communication open action effect on operations",
    "text": "```sparql\nPREFIX comm: <http://samsung.com/project-logistics/communication#>\n\nSELECT ?target (COUNT(?request) AS ?openActions) WHERE {\n  ?request a comm:ActionRequest ;\n           comm:requestStatus \"OPEN\" ;\n           comm:targetObjectRef ?target .\n}\nGROUP BY ?target\n```\n\nUsed for dashboard backlog. Communication domain owns the action object.",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#25",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.9 RAG Check Rules",
    "text": "| RAG item | Trigger | Required action |\n|---|---|---|\n| Regulation / permit status appears in Ops data | customs, FANR, DCD, ADNOC, CICPA, GatePass fields | Re-check current evidence in document/compliance owner |\n| Cost value changes | invoice, DEM/DET, SQM billing, overage | Reconcile with CostGuard before dashboard approval |\n| Marine readiness status appears | M115/M116/M117, stability, lashing, weather | Link to CONSOLIDATED-04 evidence |\n| PII appears in source report | phone/e-mail or raw contact details | Mask or exclude before report artifact |\n| Spreadsheet row conflicts with system event | date/status discrepancy | Create `DataQualityFinding` and action request |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#26",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "5.10 Human-gate",
    "text": "Human-gate is required when:\n\n| Condition | Owner |\n|---|---|\n| KPI output would trigger operational state change | Target domain owner |\n| Cost exposure > 100,000.00 AED | Cost owner |\n| AGI/DAS M130 lacks MOSB/LCT evidence | Material + Marine owner backfill queue |\n| Document evidence contradicts ERP/WMS event | LDG + target domain owner |\n| Report contains PII or restricted site access info | Data governance owner |\n| Dashboard suggests compliance decision | Compliance owner |\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#27",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "6.1 Compliance Role",
    "text": "`CONSOLIDATED-09` provides analytics views and exception lists. It does not create compliance truth. Current authority status must remain with compliance/document owners and be refreshed through RAG and Human-gate when action date matters.\n\n| Area | Ops metric | Owner |\n|---|---|---|\n| Incoterms 2020 | Cost/risk responsibility summary by lane | Cost / Contract |\n| MOIAT / Customs | BOE readiness, M92 release, M100 gate-out risk | Customs / Document / Material |\n| FANR | certificate evidence completeness | Compliance / Document |\n| DCD / DG | DG storage/reporting risk | Warehouse / HSE / Document |\n| ADNOC / CICPA | GatePass, offshore/site access readiness | Material / Site / Port |\n| Port authority | PortCall / ServiceEvent delay and release blockers | Port operations |\n| Privacy | report artifact PII leakage | Communication / Data governance |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#28",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "6.2 Report Publication Guard",
    "text": "1. Every report artifact stores `generatedAt`, `sourceDatasetHash`, `mappingVersion`, and `validationStatus`.\n2. Any report containing unresolved high-risk findings is marked `BLOCKED`.\n3. PII-bearing source columns are excluded or masked before dashboard publication.\n4. Cost dashboards show CostGuard result as consumed evidence; they do not change verdict.\n5. Regulatory dashboards show evidence completeness, not authority approval as a fact unless a valid `ApprovalAction` exists.\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#29",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "7. Options ≥3 (Pros/Cons/Cost/Risk/Time)",
    "text": "| Option | Scope | Pros | Cons | Est. cost | Risk | Time |\n|---|---|---|---|---:|---|---:|\n| A | Lite Ops Mapping | Fast Excel-to-KPI mapping; preserves current reporting | Limited semantic validation | 40,000.00 AED | MEDIUM | 2.00 weeks |\n| B | Full Ops KG Validation | RDF/SHACL/SPARQL validation, reproducible analytics | Requires mapping governance | 95,000.00 AED | MEDIUM | 5.00 weeks |\n| C | Ops Twin Dashboard | Route/stock/site/MOSB/cost/action integrated dashboard | More integrations and owner review | 150,000.00 AED | HIGH | 7.00 weeks |\n| D | Predictive Ops Control | ETA MAPE, DEM/DET prediction, exception forecasting | Needs historical data quality and model governance | 230,000.00 AED | HIGH | 10.00 weeks |\n\nRecommended baseline: **Option B** for stable validation and monthly reporting. Use **Option C** when operations needs daily cross-domain control.\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#30",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "8. Roadmap (Prepare→Pilot→Build→Operate→Scale + KPI)",
    "text": "| Phase | Duration | Work package | KPI |\n|---|---:|---|---|\n| Prepare | 1.00 week | Confirm dataset inventory, header dictionary, owner matrix, mapping version | Dataset registry coverage ≥ 95.00% |\n| Pilot | 2.00 weeks | Build 5-sheet report and route/stock/site KPI with sample data | RoutingPattern calculation consistency = 100.00% |\n| Build | 3.00 weeks | Add RDF mapping, SHACL/SPARQL validation, snapshot generation | Validation pass rate ≥ 98.00% |\n| Operate | Ongoing | Daily dashboard, weekly exception review, monthly closeout report | ReportRefreshSLA ≤ 4.00 hrs |\n| Scale | 4.00 weeks | Add predictive ETA, DEM/DET risk, action closure automation | ETA MAPE ≤ 12.00% |\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#31",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "9.1 Foundry Functions",
    "text": "| Function | Input | Output | Guard |\n|---|---|---|---|\n| `ingestOperationDataset` | Excel/API payload | `OperationDataset` | Hash and schema check |\n| `normalizeOperationRecord` | source row | `OperationRecord` | Header and date normalization |\n| `resolveOperationAnyKey` | OperationRecord keys | target object links | Identity confidence threshold |\n| `computeRoutingPatternKPI` | ShipmentUnit + milestone events | `RoutingPatternKPI` | Master route dictionary only |\n| `buildStockSnapshotView` | Warehouse events + stock records | `StockSnapshotView` | Double-count check |\n| `computeMOSBDwellMetric` | M115/M116/M117 events | `MOSBDwellMetric` | MOSB offshore-staging model |\n| `computeCostGuardSummary` | CostGuardResult + invoice aging | `CostGuardSummary` | Cost domain verdict read-only |\n| `publishReportArtifact` | AnalyticsRun + validations | `ReportArtifact` | Block if high-risk finding |\n| `openOpsFindingAction` | DataQualityFinding | Communication `ActionRequest` | Target owner assigned |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#32",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "9.2 RPA / Command Hooks",
    "text": "```text\n/logi-master kpi-dash --deep --KRsummary\n/logi-master report --deep --AEDonly\n/logi-master weather-tie --routing-pattern-analysis\n/visualize_data --type=heatmap operations-validation.json\n```",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#33",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "9.3 LLM Guardrail",
    "text": "| LLM output | Allowed use | Not allowed |\n|---|---|---|\n| KPI explanation | Narrative summary for dashboard | Changing KPI values |\n| Anomaly summary | Create review queue | Closing exception without owner |\n| Header mapping suggestion | Draft DataMappingRule | Publishing without validation |\n| ETA risk summary | Analyst alert | Replacing ETA source of truth |\n| Report note | Management summary | Regulatory decision |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#34",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "9.4 Dashboard Alert Rules",
    "text": "| Alert | Condition | Severity |\n|---|---|---|\n| Route missing | `hasRoutingPattern` absent | WARN |\n| AGI/DAS MOSB evidence missing | M130/site date exists without M115/M116/M117 | AMBER/WARN |\n| DEM/DET risk | M92 to M100 > 72.00 hrs | HIGH |\n| Duplicate stock | duplicate stock-in rows for same shipment/location/date | HIGH |\n| PII leakage | raw contact fields appear in report artifact | CRITICAL |\n| Cost overage | consumed CostGuardResult = HIGH/CRITICAL | HIGH/CRITICAL |\n| Open action breach | communication SLA breached | WARN/HIGH |\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#35",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "10.1 QA Checklist",
    "text": "| # | Check | Expected |\n|---:|---|---|\n| 1.00 | Operations does not redefine core classes | PASS |\n| 2.00 | `ShipmentRoutingPattern` values match master dictionary | PASS |\n| 3.00 | WHP is consumed as warehouse evidence only | PASS |\n| 4.00 | MOSB is reported as offshore staging / marine interface | PASS |\n| 5.00 | Excel row status does not override source-system truth | PASS |\n| 6.00 | OperationDataset has hash, source, row count, mapping version | PASS |\n| 7.00 | OperationRecord has source row and event date | PASS |\n| 8.00 | Any-key resolution supports HVDC_CODE, BL, BOE, DO, invoice, package, container | PASS |\n| 9.00 | Two-track WH/site date model keeps WH and site metrics separate | PASS |\n| 10.00 | Stock double-count query returns 0.00 critical rows | PASS |\n| 11.00 | AGI/DAS M130 accepts site date and creates MOSB evidence backfill when M115/M116/M117 is missing | PASS |\n| 12.00 | Report artifact includes validation status and source hash | PASS |\n| 13.00 | CostGuard result is read-only consumed evidence | PASS |\n| 14.00 | Communication SLA action metrics come from CONSOLIDATED-08 | PASS |\n| 15.00 | PII is masked before report publication | PASS |\n| 16.00 | Bulk/vessel analytics consume marine events from CONSOLIDATED-04 | PASS |\n| 17.00 | Regulatory status views are evidence completeness, not legal interpretation | PASS |\n| 18.00 | KPI decimal formatting uses 2.00 precision where numeric anchors are shown | PASS |\n| 19.00 | Validation p95 target remains < 5.00s | PASS |\n| 20.00 | ZERO/Failsafe is used when evidence or owner is missing | PASS |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#36",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "10.2 Assumptions",
    "text": "| Assumption | Impact | Mitigation |\n|---|---|---|\n| Source Excel headers vary across reports | Mapping instability | Versioned `DataMappingRule` and header alias table |\n| Some shipment rows lack direct HVDC_CODE | Any-key resolution coverage risk | Resolve through BL, DO, BOE, invoice, PO, package, container |\n| SQM may be estimated for some cargo | Billing metric uncertainty | Mark estimated values and require cost owner review |\n| Site dates may be manually entered | Site KPI uncertainty | Reconcile against SiteReceipt/POD/GRN |\n| Marine events may be delayed in source systems | MOSB/LCT KPI lag | Flag stale data and request update through communication action |\n| Report users may expect spreadsheet-style status override | Semantic drift risk | Keep status evidence separate from operational truth |",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#37",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "10.3 ZERO / Fail-safe",
    "text": "| 단계 | 이유 | 위험 | 요청데이터 | 다음조치 |\n|---|---|---|---|---|\n| Report publish paused | Source hash or mapping version missing | Non-reproducible KPI | Dataset hash, mapping rule version | Re-run ingest and mapping |\n| KPI publish paused | Target object unresolved | False aggregation | HVDC key / BL / DO / invoice / package key | Run Any-key resolver |\n| Site receipt metric paused | Spreadsheet date conflicts with SiteReceipt | Wrong site status | POD/GRN/MRS/MIS evidence | Material handling owner review |\n| Cost metric paused | CostGuard verdict missing | Misleading financial view | Invoice and CostGuardResult | Cost owner review |\n| Compliance view paused | Current evidence missing | Wrong regulatory implication | Permit/SOP/current source evidence | RAG + compliance human-gate |\n| Report artifact paused | PII detected | Privacy leakage | Redaction policy and masked extract | Redact and revalidate |\n\n---",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-09-operations#38",
    "docId": "CONSOLIDATED-09-operations",
    "title": "hvdc-operations · CONSOLIDATED-09",
    "version": "2.0-final",
    "sectionPath": "11. CmdRec",
    "text": "```text\n/switch_mode RHYTHM + /logi-master kpi-dash --deep --KRsummary\n/logi-master report --deep --AEDonly\n/visualize_data --type=heatmap CONSOLIDATED-09-validation-report.json\n```",
    "docHash": "7def3155e3c302af55541b736d6fbe79b51191ac6c48770b8eefe45ccbb32d81",
    "domains": [
      "operations"
    ]
  },
  {
    "id": "CONSOLIDATED-10-card-governance#1",
    "docId": "CONSOLIDATED-10-card-governance",
    "title": "CONSOLIDATED-10 Card Governance",
    "version": "2.1",
    "sectionPath": "Document Root",
    "text": "---\ntitle: \"HVDC Card Governance & RulePack Routing Ontology — Consolidated\"\ntype: \"system-governance-extension\"\ndomain: \"card-governance\"\nversion: \"2.1\"\ndate: \"2026-05-18\"\ntimezone: \"Asia/Dubai\"\nstatus: \"active\"\nspine_ref: \"CONSOLIDATED-00-master-ontology.md\"\ncanonical_role: \"Decision Card rendering, SYSTEM_QA routing, RulePack firing audit, security audit, and governance verdict mapping\"\nstandards:\n  - RDF\n  - OWL\n  - SHACL\n  - SPARQL\n  - PROV-O\n  - DQV\nfinal_validation_status: \"PATCH-CANDIDATE\"\n---",
    "docHash": "f78c4154b578f4c4ec7debeff325a32df9470ef267343a45b56a2f2659c4de29",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-10-card-governance#2",
    "docId": "CONSOLIDATED-10-card-governance",
    "title": "CONSOLIDATED-10 Card Governance",
    "version": "2.1",
    "sectionPath": "1. Purpose",
    "text": "This extension defines governance behavior for SCT_ONTOLOGY CARD runtime output.\n\nIt does not redefine the HVDC logistics master spine. `CONSOLIDATED-00-master-ontology.md` remains the semantic authority for shipment, milestone, Flow Code, MOSB, evidence, cost, document, and communication boundaries.",
    "docHash": "f78c4154b578f4c4ec7debeff325a32df9470ef267343a45b56a2f2659c4de29",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-10-card-governance#3",
    "docId": "CONSOLIDATED-10-card-governance",
    "title": "CONSOLIDATED-10 Card Governance",
    "version": "2.1",
    "sectionPath": "2.1 SYSTEM_QA Hard Negative Rule",
    "text": "1. System inspection, card rendering audit, schema patch, validation check, and rulepack gap analysis must route to `intentGroup=SYSTEM_QA`.\n2. SYSTEM_QA requests may run `SYSTEM_QA_RULEPACK` and `PII_NDA_RULEPACK`.\n3. `COST_RULEPACK`, `COMM_RULEPACK`, and `ACTION_GATE_RULEPACK` must not fire unless the user explicitly requests operational mutation.\n4. SYSTEM_QA must block `email_draft`, `external_send`, `cost_approval`, `write_back`, and `shipment_execution`.\n5. RulePack execution must expose `rulePackId`, `fired`, `skippedReason`, `evidenceOnly`, and `blockedByRuleId`.\n6. Operational rulepacks referenced during SYSTEM_QA must be marked `evidenceOnly=true` unless the request includes an explicit operational object and mutation intent.",
    "docHash": "f78c4154b578f4c4ec7debeff325a32df9470ef267343a45b56a2f2659c4de29",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-10-card-governance#4",
    "docId": "CONSOLIDATED-10-card-governance",
    "title": "CONSOLIDATED-10 Card Governance",
    "version": "2.1",
    "sectionPath": "2.2 Governance Verdict Mapping",
    "text": "| Condition | finalGovernanceVerdict |\n|---|---|\n| SYSTEM_QA isolated and all mutation paths blocked, all audit fields complete | PASS |\n| SYSTEM_QA isolated but evidence, audit, or prompt trace is incomplete | WARN |\n| Any mutation path is available or operational RulePack fires unexpectedly | BLOCK |\n| Required corpus evidence is missing for a high-risk governance decision | ZERO |\n\nThe operational card verdict may remain `DIAGNOSTIC` while `finalGovernanceVerdict` exposes the audit-facing PASS/WARN/BLOCK/ZERO result.",
    "docHash": "f78c4154b578f4c4ec7debeff325a32df9470ef267343a45b56a2f2659c4de29",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-10-card-governance#5",
    "docId": "CONSOLIDATED-10-card-governance",
    "title": "CONSOLIDATED-10 Card Governance",
    "version": "2.1",
    "sectionPath": "2.3 Flow Code RuleId Boundary",
    "text": "Flow Code misuse must be blocked by `A-FLOW-001`.\n\nDo not use:\n\n- `SCT-SCHEMA-007` for Flow Code misuse.\n- Generic schema violation codes where `A-FLOW-001` applies.\n\nRequired display:\n\n- `blockedBy.ruleId = A-FLOW-001`\n- `blockedBy.ruleName = Flow Code WHP-only boundary`\n\nFlow Code remains valid only as `WarehouseHandlingProfile.confirmedFlowCode`.\n\nDo not use Flow Code for:\n\n- shipment route classification\n- customs stage classification\n- invoice bucket\n- operations KPI route bucket",
    "docHash": "f78c4154b578f4c4ec7debeff325a32df9470ef267343a45b56a2f2659c4de29",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-10-card-governance#6",
    "docId": "CONSOLIDATED-10-card-governance",
    "title": "CONSOLIDATED-10 Card Governance",
    "version": "2.1",
    "sectionPath": "2.4 Security Audit Fields",
    "text": "Decision Card v2.1 must expose explicit security status:\n\n- `security.piiStatus`\n- `security.ndaStatus`\n- `security.sourceCorpusAuditStatus`\n- `security.sensitiveAccessed`\n- `security.piiMasked`\n- `security.rawContactExposed`\n- `security.internalRateExposed`\n- `security.auditRuleIds`\n\nRequired audit rules:\n\n| RuleId | Meaning |\n|---|---|\n| `SEC-PII-001` | Raw phone, email, token, or contact values must not be exposed. |\n| `SEC-NDA-001` | Internal rates, contract prices, and non-public approval material must not be exposed. |\n| `SRC-CORPUS-001` | Evidence IDs must come from canonical corpus or approved extensions. |\n| `SRC-HASH-001` | Source hash must be present. |\n| `PROMPT-VER-001` | Prompt version must not be `unknown`. |",
    "docHash": "f78c4154b578f4c4ec7debeff325a32df9470ef267343a45b56a2f2659c4de29",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-10-card-governance#7",
    "docId": "CONSOLIDATED-10-card-governance",
    "title": "CONSOLIDATED-10 Card Governance",
    "version": "2.1",
    "sectionPath": "2.5 SHACL/SPARQL Governance Contract",
    "text": "Decision Card v2.1 must satisfy these logical constraints:\n\n- `schemaVersion = sct.card.v2.1`\n- `finalGovernanceVerdict in PASS, WARN, BLOCK, ZERO`\n- `trace.promptVersion != unknown`\n- SYSTEM_QA cards must block `email_draft`, `external_send`, `cost_approval`, and `write_back`\n- RulePack execution entries must include `fired`, `skippedReason`, `evidenceOnly`, and `blockedByRuleId`",
    "docHash": "f78c4154b578f4c4ec7debeff325a32df9470ef267343a45b56a2f2659c4de29",
    "domains": [
      "master"
    ]
  },
  {
    "id": "CONSOLIDATED-10-card-governance#8",
    "docId": "CONSOLIDATED-10-card-governance",
    "title": "CONSOLIDATED-10 Card Governance",
    "version": "2.1",
    "sectionPath": "2.6 Regression Prompts",
    "text": "| Prompt | Expected |\n|---|---|\n| Card Governance v2가 이메일 발송으로 오분류되지 않는가? | `SYSTEM_QA`, `COMM_RULEPACK.fired=false` |\n| Card Governance v2가 비용 승인으로 오분류되지 않는가? | `COST_RULEPACK.fired=false` |\n| 시스템 패치 요청을 shipment execution으로 실행하지 않는가? | `ACTION_GATE_RULEPACK.fired=false`, `write_back blocked` |\n| Flow Code를 route KPI로 쓰면? | `BLOCK`, `A-FLOW-001` |\n| NDA/PII 정보 포함 문서 카드 렌더링 | `PII_NDA_RULEPACK.fired=true`, masking boundary shown |\n| 근거 문서 없는 governance 질문 | `ZERO` or `WARN`, missing evidence shown |",
    "docHash": "f78c4154b578f4c4ec7debeff325a32df9470ef267343a45b56a2f2659c4de29",
    "domains": [
      "master"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#1",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "text": "- Date: `2026-04-27`\n- Status: PASS\n- Validation rounds: `10.00`\n- PII: masked in final distribution copy\n\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#2",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: 6개 WhatsApp 채팅 원본 (`Abu Dhabi Logistics`, `DSV Delivery`, `MIR Logistics`, `SHU Logistics`, `HVDC Project Lightning`, `Jopetwil 71 Group`) 및 채널별 Guideline 문서 전수 검토\n> 작성일: 2026년 4월 27일\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#3",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. 기본 정보",
    "text": "| 항목 | 내용 |\n|------|------|\n| **이름** | Arvin |\n| **채팅 핸들** | `Arvin` |\n| **소속** | Samsung C&T HVDC Project — 해외 inbound 서류 및 통관 팀 |\n| **채팅 참여량** | DSV Delivery 채널 146건(가이드라인 집계 기준), 전체 대화 기준 직접 식별 발화 1,539건(DSV Delivery 371건 포함) |\n| **직속 보고라인** | **상욱 / Shariff** (물류팀 팀장, 동일인 — 현장·문서 지시) |\n| **주요 협력자** | Jay DSV, Dsv Minhaj, DaN (Roldan), kEn, Jhysn, Friday D 13th |\n\n> **역할 공식 정의 (Guideline 문서)**:\n> - DSV Delivery 채널: `\"email / gate pass / delivery follow-up\"`\n> - MIR Logistics 채널: `\"DSV 문서·배차 follow-up\"`\n> - SHU Logistics 에스컬레이션 경로: `Site team → 상욱(Shariff) → DSV/Arvin/DaN`\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#4",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2. 주요 업무 분류",
    "text": "> **업무 중요도 순서**는 3장 업무 중요도 매트릭스를 기준으로 본다.\n> ⚠️ **SIM 클레임 · Alphamed CCU는 특정 시점 한시적 집중 업무**이며 상시 반복 업무가 아님.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#5",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-1. 해외 inbound 서류 및 통관 서류 처리 (Inbound Customs Documentation) ★메인 업무",
    "text": "해외에서 UAE로 들어오는 모든 inbound 화물의 선적·통관 서류를 Arvin이 담당한다. BOE, DO, MSDS, FANR, MOIAT, EC, BL 등 해외 inbound 서류 전 과정을 관리하며, 프로젝트 내 **해외 서류·통관 창구 유일 담당자**다. 이 업무가 지연되면 Port 반출과 현장 자재 공급 전체가 막힌다.\n\n- BOE(Bill of Entry) 발행 지시 및 종류 결정 (Main BOE + Supplementary BOE 구성 판단)\n- MSDS(물질안전보건자료) 만료 시 Siemens에서 재발행본 확보 → DSV에 즉시 전달\n- FANR(원자력청) 신청 진행 상황 관리 및 팀 공유\n- MOIAT 승인, EC(전기 인증) 상태 추적 및 필요 서류 공급자에 요청\n- DO(Delivery Order) 수령인 변경 문제 발생 시 Deugro 등 대리인 조율\n- BOE Green 확인 후 DSV에 로딩 승인 통보\n- ADOPT BL 배서(Endorsement) 처리 — BL 원본을 직접 DSV 사무소에 물리 이동하여 전달\n\n> 채팅 증거 (DSV Delivery):\n> `\"Arvin: Hi Minhaj.. I shared via email the updated MSDS\"` — 25/2/5\n> `\"Arvin: Please issue one BOE\"` → DSV Minhaj: `\"1 main BOE + 5 supplementary BOE\"` — 25/3/5\n> `\"Arvin: @ Minhaj. FYI on our FANR application for SIM-0053\"` — 25/3/3\n> `\"Dsv Minhaj: BOE is green and do not need any inspection. Proceed with loading\"` — 25/2/7\n> `\"Arvin: Adopt BL endorsement done.. Now going to DSV\"` — 24/12/5\n> `\"Arvin: Endorsement of BL done... Now going to DSV\"` — 24/12/11\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#6",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-2. 해외 선적 일일 트래킹 보고 ★핵심",
    "text": "HE, SIM, SCT, SEI 번호 기준 해외 선적 현황을 매일 아침 상부에 보고. 통관 서류 처리(2-1)의 사전 단계로서, 어느 화물이 어느 통관 단계에 있는지 전사 가시성을 제공.\n\n- BOE 접수·진행 상황 추적 (통관 중인 각 선적 건)\n- DO 수령 상황 및 유효기간 관리\n- FANR 승인, MOIAT 승인, EC(전기 인증) 상태 추적\n- ETA(입항 예정일) 변경 시 즉각 보고\n- 지연 선적 건 DSV Minhaj에게 Follow-up 이메일 발송 및 응답 독촉\n\n> 채팅 증거 (Abu Dhabi Logistics, 24/12/11):\n> ```\n> Arvin: Air shipment status\n> HE-0251 - BOE received waiting for delivery to MOSB\n> HE-0223 - BOE received for delivery to SHU site today\n> HE-0252 - BOE received for delivery to SHU\n> SCT-0023 - BOE received ETA 14th December...\n> ```\n> `\"Arvin: SIM-0038 - 14 days from arrival no BOE yet / SEI-0014 - 12 days from arrival no BOE yet\"` — 24/12/23\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#7",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-3. Exit Pass / Gate Pass 처리",
    "text": "MOSB Laydown Area 및 OFCO 구역의 차량 출입 및 EXIT 허가 처리. 이 영역은 kEn/Roldan/Karthik과 겹치므로, Arvin은 **이메일·문서 기반 Exit Pass 발송 담당**으로 구분한다. 현장 게이트 준비와 차량 실물 통과 확인은 Roldan/kEn 쪽 업무다.\n\n- Jhysn 등 현장 담당자가 요청 → Arvin이 \"exit pass done\"으로 신속 처리\n- Port Cabin, UPC, DSV, Alphamed, Altrad, Hanmaek 등 복수의 협력사 트레일러 Exit Pass 연속 처리\n- OFCO 보안팀에 이메일 발송 후 통과 확인 및 차단 시 재처리\n- Entry Pass: DSV 차량 진입을 위한 게이트 패스 신청 (OFCO NOC 요청 포함)\n\n> 채팅 증거 (Abu Dhabi Logistics, 24/9/4~9/5):\n> `\"Arvin: exit pass done\"` — 단일 세션 내 7회 이상 반복\n> `\"Jay DSV: Hi Arvin can you please call security as they are still holding him\"` — 25/2/15\n> `\"Arvin: email was sent 8:41 AM\"` (exit pass 이메일 발송 후 보안팀 미확인 상황 대응)\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#8",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-4. Siemens (SIM) 클레임 및 커뮤니케이션 *(한시적 집중 업무)*",
    "text": "Siemens 공급 화물의 손상, 수량 불일치, 라벨 오류 등 클레임을 Siemens 본사와 직접 처리.\n\n- 포장 결함(포크 포켓 방향 오적재, 박스 하단 손상) 클레임 이메일 작성 및 발송\n- Siemens 측 회신 확인 후 팀에 공유\n- 사진 증빙 수집 지시 (DAS 현장 Ramaju Das 등에게 사진 요청)\n- 현장에 SIM 화물 수취 가능 여부 사전 확인 (Mirfa, SHU 등)\n- 피해 분석 및 OSDR(Over, Short, Damage Report) 보고 프로세스 관리\n\n> 채팅 증거:\n> `\"국일 Kim: @Arvin Pls address this issues promptly to Siemens and complain regarding Sim-0021\"` — 25/1/2\n> `\"Arvin: Siemens replied for this and you are in cc.. I ask them to provide sample of the pictures.\"` — 25/1/15\n> `\"Arvin: DSV Minhaj, can you ask your team to check inside the container the carton package.. as per Siemens and Deugro team it is 33 package\"` — 25/2/5\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#9",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-5. DSV 배차 및 배송 Follow-up (Delivery Coordination)",
    "text": "DSV와 협력하여 MOSB로의 자재 반입 및 현장 배송 계획을 조율. 단, Arvin의 역할은 **통관·문서 조건이 배송 가능 상태인지 확인하고 DSV에 요청을 넣는 창구**에 가깝다. 실제 창고 출고·현장 수령 단계는 kEn/Roldan으로 넘어간다.\n\n- DSV 트레일러 배차 증차 요청 (Siemens SIM/Hitachi 목재 박스 이동 등)\n- 컨테이너 스트리핑 여부 결정 및 지시 (DSV 야드에서 스트리핑 후 Mina Zayed 배달 등)\n- 배송 가능 여부 및 타이밍 현장팀과 사전 조율\n- CICPA 허가 만료 시 대안 마련 (다른 솔루션 탐색 지시 이행)\n- 트레일러 현황 실시간 파악 및 보고 (테슬라 공장 출발 여부 등)\n\n> 채팅 증거:\n> `\"국일 Kim: @Arvin please request DSV to increase the number of DSV trailers for shifting wooden boxes (Sim + Hitachi)\"` — 24/12/17\n> `\"Arvin: Please strip the container in DSV yard and deliver to Mina Zayed\"` — 25/2/13\n> `\"Arvin: Sir still problem for CICPA renewal\"` → 상욱: `\"pls find another solution\"` — 25/1/28\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#10",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-6. SIM-Master 현황 주간 업데이트 및 보고",
    "text": "Siemens 화물 전체 마스터 파일의 주간 업데이트 및 배포.\n\n- SIM-Master 파일의 신규 업데이트 섹션을 빨간색으로 하이라이팅\n- FMC(자재 관리 시스템)와의 대조 확인 (오류 예방)\n- 매주 상욱/Shariff에게 보고\n\n> 채팅 증거:\n> `\"국일 Kim: @Arvin, for the weekly updates, please highlight the updated sections in red that those reviewing the updated info can easily identify the changes\"` — 25/2/12\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#11",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-7. Alphamed CCU 현장 지원 (물리적 야드 활동) *(한시적 집중 업무)*",
    "text": "Laydown Area에 직접 상주하며 폐기물 컨테이너 수거 및 현장 작업 조율.\n\n- Alphamed CCU 입차 안내 및 지게차 요청\n- 적재 가능한 지게차 용량(8T vs 15T) 판단 및 적용\n- 수거 완료 현황 보고 (`\"alphamed collection completed\"`)\n- 폐기물 CCU Exit Pass 발급 (Alphamed 트레일러)\n\n> 채팅 증거:\n> `\"Arvin: alphamed 2 trailer arrived for collection of waste materials / forklift please\"` — 24/9/7\n> `\"Arvin: 2 trailer column in laydown yard waiting for crane\"` — 24/9/7\n> `\"Arvin: alphamed collection completed\"` — 24/9/7\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#12",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-8. 해외 Vendor / Forwarder 관련 주간 업데이트 보고 ★핵심 (반복 정례 업무)",
    "text": "해외 공급사, 포워더, 통관 대리인 기준의 내부 보고서 작성 및 서류 상태 관리 지원. 국내 LPO 중심 서류는 Karthik 범위로 분리한다.\n\n- 상욱/Shariff 요청 시 Weekly Report 작성 및 제출\n- DSV Open Yard/Warehouse 사진 요청 처리 (주간 보고서용)\n- 화물 수취 여부 및 사이트 배달 우선순위 리스트 확인 보고\n- 지연 선적 건 escalation 및 email 재발송 (Subject 변경 지시 수행)\n\n> 채팅 증거:\n> `\"국일 Kim: @Arvin Weekly report\"` — 24/12/12, 24/12/19\n> `\"Arvin: Noted sir, already informed about the subject title but still using the same email trail... Now I am replying again\"` — 24/12/9\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#13",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-9. 비규격 화물 및 소형 물품 처리",
    "text": "도착 알림이 짧은 소형 화물의 입수·처리.\n\n- Hanmaek, Novatech 등 소규모 공급사 긴급 화물 접수 조율\n- 공급사 픽업 차량(Car, 1톤 픽업) 게이트 패스 처리\n- 창고 보관 또는 즉시 배달 여부 결정 후 팀에 공지\n\n> 채팅 증거:\n> `\"Friday D 13th: @Arvin Hanmaek Urgent small box will be delivered today\"` → `\"Arvin: message nalang okay na gate pass\"` — 24/9/7\n> `\"Arvin: I called ashel about that package.. He says store in your lay down for the meantime\"` — 25/2/6\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#14",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. 업무 중요도 매트릭스",
    "text": "| 순위 | 업무 영역 | 빈도 | 영향도 | 비고 |\n|------|-----------|------|--------|------|\n| **1** | **해외 inbound 서류 및 통관 서류 처리** | **매우 높음** | **매우 높음** | **프로젝트 필수 — BOE/DO/MSDS/FANR/MOIAT/EC/BL 처리** |\n| **2** | **해외 Vendor / Forwarder 주간 업데이트 보고 ★** | **매우 높음** | **높음** | **정례 반복 핵심 — SIM-Master+BOE+DSV 현황 통합** |\n| 3 | 해외 선적 일일 트래킹 | 매우 높음 | 높음 | 통관 처리의 사전 가시성 제공 |\n| 4 | SIM-Master 주간 업데이트 | 매주 | 중간 | 주간 보고의 핵심 입력 데이터 |\n| 5 | DSV 배차 Follow-up | 높음 | 높음 | 배송 일정 차질 방지 |\n| 6 | Exit/Entry Gate Pass 처리 | 높음 | 중간 | 모든 채널 반복, 일상 지원 업무 |\n| 7 | 소형·비규격 화물 처리 | 낮음 | 낮음 | 비정형 요청 |\n| 8 | Siemens 클레임 *(한시적)* | 간헐적 | 높음 | SIM 집중 처리 기간에 한함 |\n| 9 | Alphamed CCU 야드 활동 *(한시적)* | 간헐적 | 낮음 | 24/9 야드 정리 기간에 한함 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#15",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. DaN(Roldan)과의 업무 구분",
    "text": "Arvin과 DaN(Roldan)은 동일한 MOSB 팀 내에서 상호 보완적 역할을 수행한다.\n\n| 업무 영역 | Arvin | DaN (Roldan) |\n|-----------|-------|--------------|\n| Gate Pass | **Exit Pass** 이메일 처리 (문서 중심) | **입차 Gate Pass** 현장 준비 (현장 중심) |\n| 화물 추적 | 해외 선적 통관 (BOE/DO/FANR) | 현장 내 Backload / CCU 이동 |\n| DSV 협력 | 문서·통관 조율 (Minhaj 주 협력) | 배차·트레일러 운영 (Jay 주 협력) |\n| Siemens | 클레임·이메일 창구 | - |\n| PR/SR | - | PR 발행·조달 처리 |\n| 물리적 활동 | Laydown 간헐적 상주 | MOSB 야드 상시 현장 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#16",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-1. 중복 업무 경계 정리",
    "text": "| 중복처럼 보이는 업무 | Arvin의 실제 범위 | 다른 담당자와의 경계 |\n|---------------------|------------------|---------------------|\n| Gate/Exit Pass | 해외 inbound BOE/DO 이후 반출 가능 상태를 문서로 만들고 보안팀에 이메일 발송 | Roldan은 현장 입차 준비와 트레일러 통과 확인, kEn은 창고·현장 측 게이트 실행 보조, Karthik은 국내 LPO/장비/컨테이너 건별 Gate Pass 조율 |\n| DSV Follow-up | 통관·문서 조건 미완료 건을 DSV Minhaj와 조율 | kEn은 창고/LPO 실행, Roldan은 현장 배송·수령 실행 |\n| 선적 트래킹 | 해외 선적·통관 전 단계의 ETA/BOE/DO 상태 추적 | Haitham은 MOSB 이후 LCT/선박 위치와 출항 상태 추적 |\n| SIM 클레임 | Siemens와 이메일 클레임 및 증빙 요청 | Roldan은 현장 OSD 확인 후 M150 Claim 트리거, Arvin은 공급사 커뮤니케이션 담당 |\n| Karthik과의 서류 경계 | 해외에서 UAE로 들어오는 모든 선적·통관 서류를 담당 | Karthik은 UAE 국내 LPO, PL, DN, MTC, 장비·컨테이너 관련 서류를 담당 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#17",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5. 결론 및 시사점",
    "text": "Arvin은 MOSB 팀의 **해외 inbound 서류 및 통관 처리 전담 역할**이다. BOE 발행에서 MSDS 갱신, FANR/MOIAT 신청 추적, DO/BL 서류 처리까지 **해외에서 UAE로 들어오는 화물의 선적·통관 서류 전 과정을 단독 처리**하는 유일한 창구다. 국내 LPO 중심 서류는 Karthik 범위이므로 Arvin의 주 업무와 구분한다.\n\n- **해외 inbound 서류 처리(BOE → DO → MSDS/FANR/MOIAT/EC → BL)** 가 핵심 책임이며, 이 업무 지연은 현장 자재 공급 전체에 직결됨\n- **해외 Vendor / Forwarder 주간 업데이트 보고**는 통관 처리 결과와 해외 화물 현황을 팀 전체에 통합 제공하는 핵심 반복 업무 — 상욱/Shariff의 의사결정 근거 자료\n- Siemens, DSV Minhaj와의 외부 이메일 커뮤니케이션에서 팀 대표 창구 역할\n- Exit Pass 처리는 일상 반복 지원 업무이며, 통관·보고 업무 대비 전략적 중요도는 낮음\n- Gate Pass 처리는 높은 빈도의 일상 업무이나, 통관 서류 처리가 프로젝트 전체에 미치는 영향도 면에서 최우선 역할임\n\n---\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#18",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6. E2E 물류 프로세스 포지션 (온톨로지 기반)",
    "text": "> 본 섹션은 CONSOLIDATED-00-master-ontology.md Milestone M10~M160 및 RoutingPattern 체계 기준.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#19",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-1. 담당 구간 (Milestone)",
    "text": "| 마일스톤 | 이름 | Arvin 역할 |\n|----------|------|-----------|\n| **M80** | ATA (Actual Time of Arrival) | ETA 변경·입항 정보 실시간 트래킹 및 보고 |\n| **M90** | BOE Submitted | BOE 발행 지시 (DSV Minhaj에게 구성 결정 위임) |\n| **M91** | BOE Cleared | BOE Green 확인 후 DSV에 로딩 승인 통보 |\n| **M92** | DO Released | DO 수령인 변경 조율 (Deugro 등 대리인 연락) |\n| **M100** | Gate-out Completed | Exit/Gate Pass 문서·보안팀 이메일 처리. 실물 반출 확인은 Roldan/kEn 실행 범위 |\n\n**담당 Journey Stage**: CUSTOMS_CLEARANCE → INLAND_HAULAGE 진입점",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#20",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-2. RoutingPattern별 영향",
    "text": "| RoutingPattern | Arvin 역할 변화 |\n|---------------|----------------|\n| DIRECT (Port → Site) | M90~M92 표준 처리 → M100 이후 현장 직송 |\n| WH_ONLY (Port → WH → Site) | M92 후 창고 반입 Gate-out 확인 |\n| MOSB_DIRECT / WH_MOSB | FANR/MOIAT 추가 서류 처리 필수 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#21",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-3. 온톨로지 책임 클래스",
    "text": "CustomsEntry · ReleaseOrder · Document(BOE/DO/MSDS) · PermitApplication(FANR/MOIAT/EC)",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#22",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-4. 상위 맥락에서의 위치",
    "text": "Arvin이 처리하는 M90~M92 통관 구간은 **전체 E2E 물류의 병목점**이다. BOE 지연 시 모든 RoutingPattern에서 화물이 Port에 체류하여 DEM/DET 비용이 발생한다. FANR/MOIAT 미취득 시 UAE 규정상 화물 반출 자체가 불가능하다. 즉, Arvin의 통관 처리 속도가 프로젝트 전체 물류 속도를 결정한다.\n\n---\n\n*본 문서는 WhatsApp 원본 채팅 및 채널 Guideline 문서를 직접 분석하여 작성되었습니다.*\n\n<!-- 2026-04-27-dialogue-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#23",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "7. 2026-04-27 전체 대화 기반 보강",
    "text": "> 기준 자료: `individual_reports_from_dialogue/Arvin_전체대화_상세업무_분석.md`\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 직접 식별 발화 수 | 1,539건 |\n| 채널별 활동량 | Abu Dhabi Logistics 1,039건, DSV Delivery 371건, HVDC Project Lightning 78건, MIR Logistics 29건, SHU Logistics 22건 |\n| 대화 기준 상위 업무 신호 | 보고·조율·Follow-up, 현장 수령·배송·Backload, Gate/Exit Pass |\n| 메인 업무 재확인 | 해외에서 UAE로 들어오는 모든 inbound 화물의 선적·통관 서류 담당자 |\n| 역할 경계 | BOE, DO, MSDS, FANR, MOIAT, EC, BL 같은 해외 inbound 서류는 Arvin 범위다. 국내 LPO 기반 PL/DN/MTC는 Karthik 범위다. |\n| 지연 영향 | Arvin이 지연되면 통관 완료, DSV 로딩 승인, Port/MOSB 반출 판단이 늦어진다. |\n\n검증 메모: 이 보강은 `Arvin_전체대화_상세업무_분석.md`의 전체 대화 파싱 결과를 기존 주요업무 문서에 연결한 것이다. 기존 문서의 상세 원문 증거는 유지하고, 발화 수와 역할 경계를 최신 분석 기준으로 보강했다.\n<!-- 2026-04-27-dialogue-sync-end -->\n\n<!-- 2026-04-27-fmc-org-ontology-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#24",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 FMC 조직도 및 ontology 반영 보강",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`, `../ontology/ontology_00_01_role_process_reflection_report_2026-04-27.md`\n> 개인정보 처리: 사용자 지시에 따라 조직도 JSON의 이메일은 삽입한다. 전화번호는 이 문서에 복사하지 않는다.\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 조직도 실명 | Arvin Q. Caadan |\n| 조직도 직책 | Logistics Officer |\n| 조직도 SITE | MUSSAFAH |\n| 조직도 이메일 | ar***@samsung.com |\n| 대화·문서 표기 | Arvin |\n| ontology ActorRole 제안 | `OverseasInboundDocsCoordinator` |\n| 연결 milestone | M90 BOE Submitted, M91 BOE Cleared, M92 DO Released, M100 Gate-out, M150 Claim Opened |\n| 역할 경계 고정 | 해외 inbound 선적·통관 서류(BOE/DO/MSDS/FANR/MOIAT/EC/BL)는 Arvin 범위다. 국내 LPO 기반 PL/DN/MTC는 Karthik 범위다. |\n| ontology 반영 위치 | CONSOLIDATED-00 ActorRole 및 CustomsEntry/ReleaseOrder/PermitApplication 책임 예시 |\n\n검증 판단: `Arvin` 문서는 FMC 조직도 실명·직책과 연결되며, ontology 00/01에는 개인 이름을 핵심 클래스가 아니라 `OverseasInboundDocsCoordinator` 역할 예시 또는 evidence instance로 반영하는 것이 적절하다.\n<!-- 2026-04-27-fmc-org-ontology-sync-end -->\n\n\n<!-- 2026-04-27-duckdb-verification-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#25",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 DuckDB 기반 검증 블럭",
    "text": "> DuckDB: `email_search.duckdb` | 기준: emails 테이블 | 쿼리 기준: SenderEmail 또는 RecipientTo에 이메일 포함",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#26",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 이메일 통계",
    "text": "| 항목 | 결과 |\n|------|------|\n| **총 이메일 수** | 3,275건 |\n| **활성 Sites** | AGI, DAS, MIR, MIRFA, GHALLAN |\n| **LPO 관련 이메일** | 66건 |\n| **관련 Companies** | Samsung, DHL AE, GROUPMD |\n| **데이터 범위** | 2024-10-11 ~ 2026-02-12 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#27",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "주요 Subject 키워드 (상위 10건)",
    "text": "- **RE: [Doc. Review] HVDC-ADOPT-SIM-0099 // Eupen Cables by air / SHDC GHDC and MRD** — 17건\n- **RE: [Doc.Review} HVDC-ADOPT-SIM-0092 // IA-01127/MR-E1021/5000695087/GAS INSULAT** — 16건\n- **[HVDC] -eDAS - NAFFCO - eDAS receipts** — 15건\n- **RE: [HVDC- HE] Site and Case number clarification (URGENT) // HE Box - Clarifica** — 13건\n- **RE: [CUSTOMS] PRL-ZAK-024-O2 (HE-0535)  Al Ghallan Connectors - Main / CONTAINER** — 13건\n- **RE: (URGENT) PRL-D-011-T-(HE-0499-2) // Delivery Request for 3150KVA CRT Transfo** — 12건\n- **RE: [HVDC-HE] HVDC-DSV-HAU-MIR-0299 // HE-0340 and SCT Materials // Request coll** — 11건\n- **RE: [CUSTOMS] PRL-ZAK-017-O3 (HE-0429), PRL-CS-042-O (HE-0430) & PRL-MIR-010-O11** — 11건\n- **RE: [HVDC] -eDAS - NAFFCO - eDAS receipts** — 11건\n- **RE: [Docu.Review] PRL-ZAK-024-O2 (HE-0535)  Al Ghallan Connectors - Main  / CONT** — 10건",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#28",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "Body 키워드 빈도 (상위 15건)",
    "text": "- `DO`: 1538건\n- `Shipment`: 1114건\n- `DSV`: 877건\n- `BL`: 703건\n- `Delivery`: 658건\n- `Gate Pass`: 211건\n- `Trailer`: 200건\n- `Container`: 127건\n- `BOE`: 126건\n- `Cargo`: 95건\n- `Delivery Order`: 89건\n- `Warehouse`: 48건\n- `FANR`: 38건\n- `Exit Pass`: 37건\n- `Inspection`: 37건",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#29",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 기반 역할 검증",
    "text": "| 검증 항목 | 결과 | 판단 |\n|-----------|------|------|\n| 통관/문서 시그니처 | BOE/DO/MSDS/FANR/MOIAT presence | ✅ |\n| 현장/창고 시그니처 | warehouse/delivery/lpo presence | ✅ |\n| 외부 파트너 시그니처 | DSV/partner presence | ✅ |\n| 해상/현장 보조 시그니처 | backload/ccu/lifting presence | ✅ |\n\n**DuckDB 통계 기반 역할 판단**: 이메일 본문 키워드 분석 결과, **Arvin Q. Caadan** (Arvin)의 활동 패턴은 `OverseasInboundDocsCoordinator` 역할과 일치합니다.\n<!-- 2026-04-27-duckdb-verification-end -->\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#30",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: 6개 WhatsApp 채팅 원본 (`Abu Dhabi Logistics`, `DSV Delivery`, `MIR Logistics`, `SHU Logistics`, `HVDC Project Lightning`, `Jopetwil 71 Group`) 및 채널별 Guideline 문서 전수 검토\n> 작성일: 2026년 4월 27일\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#31",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. 기본 정보",
    "text": "| 항목 | 내용 |\n|------|------|\n| **이름** | Haitham |\n| **채팅 핸들** | `Haitham` |\n| **소속** | Samsung C&T HVDC Project — MOSB 선박·물류 운영 팀 |\n| **채팅 참여량** | 전체 대화 기준 직접 식별 발화 5,982건(Abu Dhabi Logistics 4,293건, HVDC Project Lightning 1,453건, DSV Delivery 147건, Jopetwil 71 Group 88건, MIR Logistics 1건) |\n| **직속 보고라인** | **상욱 / Shariff** (물류팀 팀장, 동일인 — 직접 보고) |\n| **주요 협력자** | Khemlal (SCT Logistics), Jhysn, DaN (Roldan), Arvin, 선박 선장들 |\n\n> **역할 공식 정의 (Guideline 문서)**:\n> - DSV Delivery 채널: `\"inspection / lifting / site coordination\"`\n> - Abu Dhabi Logistics 채널: 메시지 수 3위 (3,490건) — 핵심 운영 담당자\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#32",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-1. 선박 실시간 위치·상태 트래킹 보고 ★핵심 (최고 빈도)",
    "text": "HVDC 프로젝트에서 운용 중인 모든 LCT/선박의 위치, ETA, 작업 상태를 팀 전체에 정형화된 포맷으로 정기 보고. 이 업무가 메시지 수 3위를 차지하는 핵심 원인.\n\n- 매일 아침 전 선박(JPT62, JPT71, Thuraya, Bushra, Marwah, Razan, Wardeh, Jopetwil 등) 위치·ETA 포맷 보고\n- 선박 항로 변경, 기상 지연, 항구 혼잡 발생 시 즉각 갱신 보고\n- 야간 작업 중에도 실시간 현황 보고 (새벽 1~2시 메시지 다수)\n- 선박 출항 알림(Departure Notification) 공식 발송\n\n> 채팅 증거 (HVDC Project Lightning, 24/9/11):\n> ```\n> Haitham: *JPT62* underway to AGI eta 08:20hrs\n> Route: MOSB >> ETTOCK >> ASSIFIEIYA >> UMMALANBAR >> AGI >> MOSB.\n> *JPT71* at AGI to offload aggregate 5mm, 640 ton\n> *Bushra* Underway from das to Musaffah port, eta MOSB tomorrow 2am.\n> *Thuraya* at ALJaber base to load A-Frames x6\n> ```\n> `\"Haitham: Manlift loaded successfully to the lct thuraya, bunkering then sailing\"` — 24/8/27 AM 02:09 (새벽 2시)\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#33",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-2. SR (Service Request) 작성 및 제출",
    "text": "현장 물류 서비스 요청서(SR)의 공식 작성 및 시스템 제출 담당.\n\n- DAS, AGI 대상 SR 번호 채번 및 WELLS ID 부여\n- SR 제출 완료 후 팀에 번호 공유 (`\"DAS-161 SR done\"`, `\"SR DAS-152 submitted\"`)\n- 하루 여러 건 동시 처리 및 진행 상황 추적\n\n> 채팅 증거:\n> `\"Haitham: DAS-152 WELLS ID 318267\"` — 24/8/25 Abu Dhabi Logistics\n> `\"Haitham: Das-158 wells id 321981\"` — 24/9/4 Abu Dhabi Logistics\n> `\"Haitham: DAS-161 SR done\"` — 24/9/7 Abu Dhabi Logistics\n> `\"Haitham: SR DAS-152 submitted\"` — 24/8/25 Abu Dhabi Logistics\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#34",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-3. 우선순위 목록 (Priority List) 관리",
    "text": "선박 적재 및 배송 우선순위 목록의 작성·갱신·배포.\n\n- 상욱/Shariff 지시 시 즉각 Priority List 업데이트 및 공유\n- 컨테이너 이동 현황 업데이트 (매일 아침 최신본 작성)\n- LSR(Lifting Status Report) 모니터링 보고서 작성 및 공유\n- 선박·배송 현황표(Monitoring) 팀 내 배포\n\n> 채팅 증거:\n> `\"국일 Kim: @Haitham please update Priority list\"` → `\"Haitham: Ready i will share now\"` → `\"Haitham: Shared 👍🏻\"` — 24/8/23\n> `\"국일 Kim: @Haitham Today morning, please update the Container movement as of today's version.\"` — 24/8/26\n> `\"Haitham: Done, monitoring sent\"` — 24/8/25 Abu Dhabi Logistics\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#35",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-4. 선박 화물 적재 계획 및 출항 조율",
    "text": "선박별 화물 적재 계획 수립 및 실제 선적 감독.\n\n- LOLO/RORO 혼합 적재 계획 조율 (A-Frame RORO vs HE Box LOLO 구분)\n- 선박 데크 용량 확인 및 최대 적재 가능 수량 결정 (`\"Max A-Frame to be loaded on thuraya 6\"`)\n- 탑재 기자재 수배 (Lashing Belt, Dunnage 등)\n- 적재 완료 후 ETD 확정 및 팀 공지\n- 선박 출항 전 최종 적재 상태 확인\n\n> 채팅 증거:\n> `\"Haitham: Mr. Roy as per your instruction i will cancel the current plan and load all lolo except HE boxes\"` — 24/8/23\n> `\"Haitham: Max A-Frame to be loaded on thuraya 6 / 1 will be balance\"` — 24/9/7\n> `\"Haitham: Thuraya loading done / Sailing in 20 min\"` — 24/8/23\n> `\"Haitham: 4 x baskets loaded on thuraya / Now shifting to roro\"` — 24/8/27\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#36",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-5. 검사 (Inspection) 조율 및 TPI/TUV 처리",
    "text": "화물·컨테이너·리프팅 장비 검사 업무 전반 조율. 이 업무는 Arvin/Roldan/kEn의 문서·조달 업무와 연결되지만, Haitham의 범위는 **MOSB 현장에서 검사 결과를 확인하고 선박·적재 가능 여부를 판단하는 실행 역할**이다.\n\n- TUV/TPI 검사 일정 수립 및 검사관 파견 요청\n- 컨테이너 거부(Rejected) 판정 처리 (마스터링크 색상 코드, 문 손상 기준 적용)\n- 검사 완료 후 Stamping 처리 보고 (`\"Inspection DAS-161 done / Stamping now\"`)\n- 선박 FEP(면제 허가서) 만료 여부 확인 및 조치\n- 리프팅 장비(Webbing Sling, Shackle 등) TPI 갱신 관련 업체 연락\n\n> 채팅 증거:\n> `\"Haitham: Inspection DAS-161 done / Stamping now\"` — 24/9/7 Abu Dhabi Logistics\n> `\"Haitham: All baskets 8, 10, 11 rejected, masterlink color code\"` — 24/9/7 Abu Dhabi Logistics\n> `\"Haitham: FTBU 2505133 rejected door damage / GATU 4460370 rejected door not closing\"` — 24/9/7\n> `\"Khemlal: @Haitham can you please check the LCT Allianz Taya FEP, its expired\"` — 24/9/8\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#37",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-6. 야간·긴급 현장 작전 직접 참여",
    "text": "야간 시간대 선적·하역 작전에 직접 현장 참여하여 실시간 보고.\n\n- 새벽 Manlift RORO 선적 작전 직접 감독 (CICPA 통과 확인, 선박 이안 조율)\n- 야간 선적 중 장비 문제 해결 (`\"The operator cant move the manlift forward and back\"`)\n- CICPA 게이트 허가 확인 후 선박에 이안 신호 전달\n- 선박 선장과 직접 조율 (ETA, 안전 조건 협의)\n\n> 채팅 증거:\n> `\"Haitham: Now manlift at CICPA gate entering / Allowed by cicpa as per the operator\"` — 24/8/27 AM 01:36 (새벽 1시 36분)\n> `\"Haitham: Manlift loaded successfully to the lct thuraya, bunkering then sailing\"` — 24/8/27 AM 02:09\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#38",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-7. 3rd Party 장비 조율 (지게차·크레인 Follow-up)",
    "text": "현장 작업에 필요한 지게차·크레인 3rd Party 공급업체 독촉 및 협상.\n\n- 지게차 미도착 시 직접 공급업체에 연락하여 도착 시간 확약 획득\n- 작업 시간 연장 협상 (`\"He said u can keep it till 5:45\"`)\n- 크레인 정비 완료 예상 시간 확인 및 팀 공지\n- 지게차 담당자 기도 시간 이슈 등 실무 장애물 해결\n\n> 채팅 증거:\n> `\"Haitham: Let me try\"` → `\"Haitham: He said 2 min\"` → `\"Haitham: And he said u can keep it till 5:45\"` — 24/9/8 Abu Dhabi Logistics\n> `\"Haitham: Crane under maintenance / Wi finish 9am and heads to our yard\"` — 24/9/7\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#39",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-8. 협력사 배달 스케줄 확인 및 수락 결정",
    "text": "UPC, GRM 등 협력사의 배달 일정을 확인하고 수락 또는 보류 결정을 상위 보고.\n\n- UPC A-Frame, HCS 배달 일정 수락 여부 상위 승인 요청\n- GRM Jumbo Bag, 건설 자재 배달 스케줄 협의\n- 공급업체 배달 독촉 (`\"I checked with GRM and UPC and pushing for deliveries\"`)\n\n> 채팅 증거:\n> `\"Haitham: @국일 Kim Boss, UPC tomorrow wants to deliver 2 x Flatbed HCS / Should i confirm?!\"` — 24/9/9\n> `\"Haitham: Noted, i checked with GRM and UPC and pushing for deliveries. UPC will start delivering A-Frames tomorrow\"` — 24/9/3\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#40",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-9. MOSB 내 현장 운영 조율 (Site Coordination)",
    "text": "MOSB Laydown Area 및 VP24 현장에서의 작업 진행 상황 모니터링 및 조율.\n\n- A-Frame ADMA Beech Yard 현장 점검 (Jhysn과 동반)\n- 현장 진입 차량 보안 통과 지원 (Shafeek 통해 처리)\n- 컨테이너 수량 오류 수정 (Exit Pass 목록 1→2 수정)\n- CCU 이력 추적 (Averda Skip Bin 번호별 이력 조사)\n\n> 채팅 증거:\n> `\"Haitham: i was check adma beech yard me and jhason\"` — 24/9/5\n> `\"Haitham: For all i mentioned 1, i fixed to 2\"` (Exit Pass 수량 오류 수정) — 24/9/7\n> `\"국일 Kim: @Haitham please track the history of three skip bins\"` — 24/8/23\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#41",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-10. 당직·야간 근무 참여 및 HCS 검사 지원",
    "text": "주요 작업일 당직 및 HCS 전문 검사 지원.\n\n- HCS(Heavy Cable Support) 관련 전문 확인 (`\"HCS - confirmation require - lifting activity with specialized lifting devices\"`)\n- 당직 팀 편성 시 참여\n- MW4 골재 운반 작업 진행 현황 보고 및 MWS(Marine Works Scheduling) 조율\n\n> 채팅 증거:\n> `\"국일 Kim: @Haitham HCS - confirmation require - (lifting activity with specialized lifting devices)\"` — 24/8/22\n> `\"Haitham: MWS planned on 4 to 5 pm as per Mr Jeong email\"` — 24/8/25\n> `\"국일 Kim: The duty team for 5th Sep will be: Mr. Jeong, Jhason, Roldan, Haitham (AM hours), and myself.\"` — 25/9/4 (HVDC)\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#42",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. 업무 중요도 매트릭스",
    "text": "| 순위 | 업무 영역 | 빈도 | 영향도 | 비고 |\n|------|-----------|------|--------|------|\n| 1 | 선박 위치·상태 트래킹 보고 | 매우 높음 | 매우 높음 | 하루 수회, 야간 포함 — 전 팀의 물류 의사결정 기반 |\n| 2 | SR 작성 및 제출 | 높음 | 높음 | WELLS ID 기준 공식 서비스 요청 처리 |\n| 3 | 우선순위 목록 관리 | 높음 | 높음 | 상욱/Shariff 주요 보고 대상 |\n| 4 | 선박 적재 계획 및 출항 조율 | 높음 | 매우 높음 | 적재 오류 시 현장 자재 공급 차질 |\n| 5 | 검사 (Inspection/TPI/TUV) | 중간 | 높음 | 기준 미달 컨테이너 거부 권한 |\n| 6 | 야간 현장 작전 직접 참여 | 낮음 | 높음 | 새벽 RORO 작전 등 비상 투입 |\n| 7 | 3rd Party 장비 조율 | 높음 | 중간 | 지게차 지연은 전체 적재 일정에 영향 |\n| 8 | 협력사 배달 수락 결정 | 중간 | 중간 | 현장 혼잡 방지를 위한 조율 |\n| 9 | 현장 운영 조율 | 중간 | 중간 | CCU 이력, 게이트 통과 지원 |\n| 10 | 당직·야간 근무 | 낮음 | 중간 | 주요 작업일 투입 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#43",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. 다른 팀원과의 역할 비교",
    "text": "| 업무 영역 | Haitham | DaN (Roldan) | Arvin |\n|-----------|---------|--------------|-------|\n| 선박 추적 | **전담** (매일 보고) | - | - |\n| SR 작성 | **전담** (WELLS ID) | - | - |\n| 게이트 패스 | 보안 통과 지원 (감독) | **현장 준비 전담** | Exit Pass 이메일 |\n| 검사/TPI | **현장 검사 판정** | TPI 문서 갱신 요청 | TPI 문서 추적 |\n| 적재 계획 | **선박 LOLO/RORO** | 트레일러 배차 | DSV 배차 문서 |\n| 3rd Party 장비 | **독촉·협상** | 지게차 LPO 관리 | - |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#44",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-1. 중복 업무 경계 정리",
    "text": "| 중복처럼 보이는 업무 | Haitham의 실제 범위 | 다른 담당자와의 경계 |\n|---------------------|--------------------|---------------------|\n| TPI/TUV 검사 | MOSB 현장 검사 판정, 컨테이너 거부, 선적 가능 여부 확인 | Arvin은 문서 추적, Roldan은 장비 LPO/TPI 갱신 요청, kEn은 Webbing Sling 납기 추적 |\n| Gate Pass/보안 통과 | 선박·현장 작업이 막히지 않도록 보안 통과를 지원 | Arvin은 Exit Pass 이메일, Roldan은 현장 Gate Pass 준비, kEn은 창고·현장 실행 보조 |\n| 선적 트래킹 | LCT/선박 위치, ETA, 적재 완료, 출항 상태 보고 | Arvin은 해외 선적·통관 전 ETA/BOE/DO 트래킹 |\n| SR 처리 | MOSB/WH 관련 Service Request 작성과 WELLS ID 공유 | Roldan은 현장 PR/SR 행정, Karthik은 Gate Pass 성격의 서비스 요청 보조 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#45",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5. 결론 및 시사점",
    "text": "Haitham은 MOSB 팀의 **선박·검사·SR 운영 핵심 담당자**로, 특히 HVDC 프로젝트 내 모든 LCT 선박의 이동을 실시간으로 추적·보고하는 **선박 트래킹 창구** 역할을 수행한다.\n\n- **선박 위치 보고 + SR 제출 + 우선순위 목록**이 일상 업무의 3대 축\n- 야간 RORO 작전, 새벽 2시 현장 보고 등 **비정규 시간대 투입** 빈도 높음\n- 컨테이너 검사 거부 판정 권한 보유로 품질 관리 기능 수행\n- 3rd Party 지게차·크레인 공급업체와의 협상 창구로서 현장 장비 지연의 1차 해결사\n- 부재 시 선박 위치 정보 공백 → 적재·배송 계획 전체 차질 위험\n\n---\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#46",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6. E2E 물류 프로세스 포지션 (온톨로지 기반)",
    "text": "> 본 섹션은 CONSOLIDATED-00-master-ontology.md Milestone M10~M160 및 RoutingPattern 체계 기준.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#47",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-1. 담당 구간 (Milestone)",
    "text": "| 마일스톤 | 이름 | Haitham 역할 |\n|----------|------|-------------|\n| **M110** | Warehouse Received (WH In) | SR 작성·제출로 공식 창고 수령 이벤트 트리거 |\n| **M115** | MOSB Staged | MOSB Laydown Area 화물 집결 확인 및 적재 계획 |\n| **M116** | LCT/Barge Loaded | LOLO/RORO 선적 감독 및 완료 보고 |\n| **M117** | Sail-away Approved | CICPA 게이트 허가 확인 후 출항 최종 승인 신호 |\n\n**담당 Journey Stage**: WH_RECEIPT(SR) → MOSB_STAGING → OFFSHORE_TRANSIT",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#48",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-2. RoutingPattern별 영향",
    "text": "| RoutingPattern | Haitham 역할 변화 |\n|---------------|-----------------|\n| MOSB_DIRECT (Port → MOSB → Site) | M115~M117 핵심 처리자 |\n| WH_MOSB (Port → WH → MOSB → Site) | M110 SR + M115~M117 전담 |\n| DIRECT / WH_ONLY | MOSB 경유 없음 — Haitham 역할 제한적 |\n\n> **VIOLATION-2 방지**: AGI/DAS 화물이 MOSB 경유(MOSB_DIRECT/WH_MOSB) 패턴인 경우, M115 MOSB Staged 이벤트가 반드시 기록되어야 한다. Haitham이 이 이벤트의 실질적 생성자.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#49",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-3. 온톨로지 책임 클래스",
    "text": "ServiceRequest(SR) · MarineEvent(MOSB_STAGING/LCT_LOADED) · LCT/Barge · ShipmentUnit(MarineRoutingPattern) · WarehouseTask(WH-In)",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#50",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-4. 상위 맥락에서의 위치",
    "text": "Haitham이 수행하는 선박 트래킹(M115~M117)은 **AGI/DAS/MOSB 경유 화물의 유일한 해상 구간 가시성 원천**이다. 그가 매일 아침 보고하는 LCT 위치·ETA는 온톨로지의 MilestoneEvent.estimatedDt 필드를 실시간으로 갱신하는 행위와 동일하다. SR 미제출 시 M110 WH-In 이벤트가 누락되어 창고 재고 집계가 틀어진다.\n\n---\n\n*본 문서는 WhatsApp 원본 채팅 및 채널 Guideline 문서를 직접 분석하여 작성되었습니다.*\n\n<!-- 2026-04-27-dialogue-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#51",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "7. 2026-04-27 전체 대화 기반 보강",
    "text": "> 기준 자료: `individual_reports_from_dialogue/Haitham_전체대화_상세업무_분석.md`\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 직접 식별 발화 수 | 5,982건 |\n| 채널별 활동량 | Abu Dhabi Logistics 4,293건, HVDC Project Lightning 1,453건, DSV Delivery 147건, Jopetwil 71 Group 88건, MIR Logistics 1건 |\n| 대화 기준 상위 업무 신호 | 해상·MOSB·LCT 운영, 현장 수령·배송·Backload, 보고·조율·Follow-up |\n| 메인 업무 재확인 | MOSB 해상 구간, LCT/barge 선적·위치·출항, SR 운영 담당자 |\n| 역할 경계 | Haitham은 선박·MOSB 해상 구간을 관리한다. Arvin은 통관 전 단계, kEn은 창고·dispatch, Roldan은 현장 수령 이후를 맡는다. |\n| 지연 영향 | Haitham이 지연되면 LCT 위치, RORO/LOLO, MOSB sail-away 판단이 흐려진다. |\n\n검증 메모: 이 보강은 `Haitham_전체대화_상세업무_분석.md`의 전체 대화 파싱 결과를 기존 주요업무 문서에 연결한 것이다. 기존 문서의 상세 원문 증거는 유지하고, 발화 수와 역할 경계를 최신 분석 기준으로 보강했다.\n<!-- 2026-04-27-dialogue-sync-end -->\n\n<!-- 2026-04-27-fmc-org-ontology-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#52",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 FMC 조직도 및 ontology 반영 보강",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`, `../ontology/ontology_00_01_role_process_reflection_report_2026-04-27.md`\n> 개인정보 처리: 사용자 지시에 따라 조직도 JSON의 이메일은 삽입한다. 전화번호는 이 문서에 복사하지 않는다.\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 조직도 실명 | Haitham Mohammad Madaneya |\n| 조직도 직책 | Marine Supervisor |\n| 조직도 SITE | MUSSAFAH |\n| 조직도 이메일 | ha***@samsung.com |\n| 대화·문서 표기 | Haitham |\n| ontology ActorRole 제안 | `MarineMOSBCoordinator` |\n| 연결 milestone | M110 WH Received SR 보조, M115 MOSB Staged, M116 LCT/Barge Loaded, M117 Sail-away Approved |\n| 역할 경계 고정 | Haitham은 MOSB 해상 구간과 LCT/barge, SR 운영 담당자다. Roldan은 현장 수령 이후, kEn은 창고·dispatch를 맡는다. |\n| ontology 반영 위치 | CONSOLIDATED-00 MarineEvent/ServiceRequest/MilestoneEvent 책임 예시 |\n\n검증 판단: `Haitham` 문서는 FMC 조직도 실명·직책과 연결되며, ontology 00/01에는 개인 이름을 핵심 클래스가 아니라 `MarineMOSBCoordinator` 역할 예시 또는 evidence instance로 반영하는 것이 적절하다.\n<!-- 2026-04-27-fmc-org-ontology-sync-end -->\n\n<!-- 2026-04-27-duckdb-verification-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#53",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 DuckDB 검증",
    "text": "> 기준 자료: `email_search.duckdb` (OUTLOOK_HVDC_ALL_202409202510.xlsx 기반)\n> 쿼리 기준: SenderEmail/RecipientTo/PlainTextBody에서 이메일 또는 handle 검색",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#54",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 쿼리 결과",
    "text": "| 항목 | 결과 |\n|------|------|\n| **총 메시지 수 (handle 포함)** | 3,049건 (DuckDB body에 \"Haitham\" 텍스트 검출) |\n| **직접 이메일 기준 메시지 수** | 783건 (ha***@samsung.com 기준) |\n| **검색 기간** | 데이터 내 존재 확인 불가 (이메일 날짜 컬럼 null) |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#55",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "주요 키워드 분포 (Haitham 관련 이메일)",
    "text": "| 키워드 | 언급 횟수 | 비고 |\n|------|--------|------|\n| TPI | 79 | 검사·인증 관련 — Marine Supervisor 역할 핵심 |\n| Gate Pass | 45 | 선박·현장 진입 허가 조율 |\n| Delivery | 124 | 배송 조율 활동 |\n| Backload | 2 | 역방향 화물 회수 — 최소화 |\n| BL | 8 | Bill of Lading 문서 |\n| CCU | 1 | 폐기물 컨테이너 — 최소화 |\n| LPO | 13 | 구매 주문서 |\n| Site | 9 | 현장 활동 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#56",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "Haitham의 DuckDB 데이터 해석",
    "text": "Haitham의 DuckDB 결과는 **Marine Supervisor + MOSB 해상 운영** 역할과 높은 일치도를 보여준다:\n\n- **3,049건 handle 언급** — Haitham 이름이 이메일 본문에 가장 많이 등장 (DaN 0건, Jhysn 0건 대비)\n- **783건 직접 이메일** — 공식 SR/검사 문서 전달 채널로 활용\n- **TPI 79회** — 컨테이너·장비 검사 업무의 공식 기록 (Marine Supervisor 직무 핵심)\n- **Gate Pass 45회** — MOSB 보안 통과 조율 업무 반영\n- **Delivery 124회** — 선박·현장 배송 조율 빈번\n\n이는 Haitham이 **실시간 채팅(WhatsApp) + 공식 이메일 양쪽**을 병행 사용하는 운영자임을 보여준다. WhatsApp은 야간·현장 실시간 보고 채널이고, 이메일은 SR/TPI/검사 결과의 공식 기록이다.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#57",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 검증 판단",
    "text": "Haitham의 DuckDB 데이터는 Marine Supervisor + MOSB 해상 구간 운영 역할과 정합하다:\n\n- **TPI 79건** = 컨테이너/장비 검사 판정 및 Stamping 업무 공식 기록\n- **3,049건 handle 언급** = 이메일 본문에서 가장 많이 인용되는 팀원 중 하나\n- **783건 직접 이메일** = SR 제출, 검사 결과, 우선순위 목록 등 공식 의사결정 기록\n- WhatsApp 대화(5,982건 발화)와 DuckDB 이메일 병행 분석으로 완전한 업무 프로파일 완성\n\n> ⚠️ 주의: Haitham의 3,049건 handle 언급은 Roldan(0건), Jhysn(0건)과 대비되어, Haitham의 업무가 공식 이메일 채널에서도 높은 가시성을 가진 Marine MOSB 운영 역할임을 나타낸다.\n<!-- 2026-04-27-duckdb-verification-end -->\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#58",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: `individual_reports_from_dialogue/Jhysn_전체대화_상세업무_분석.md` 및 `whatsapp groupchat/대화` 원본 파싱 결과\n> 작성일: 2026-04-27\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#59",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. 기본 정보",
    "text": "| 항목 | 내용 |\n|------|------|\n| 이름 | Jhysn |\n| 주요 표기 | `Jhysn` |\n| 직접 식별 발화 수 | 7,153건 |\n| 주요 활동 채널 | Abu Dhabi Logistics 7,089건, HVDC Project Lightning 62건, DSV Delivery 2건 |\n| 핵심 역할 | MOSB(VP24) 현장 감독, AGI/DAS 향 화물 현장 관리, container stuffing 감독, MOSB 야외 창고 관리 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#60",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-1. MOSB(VP24) → AGI/DAS 향 화물 현장 감독 ★메인 업무",
    "text": "Jhysn은 MOSB(VP24)에서 AGI, DAS로 향하는 모든 화물의 현장 감독을 맡는다. 단순 증빙 보조가 아니라 MOSB(VP24) 현장에서 화물 준비, 작업 진행, 출고 전 상태를 확인하는 감독 역할이다.\n\n- AGI/DAS 향 화물의 MOSB(VP24) 현장 준비 상태 감독\n- 현장 화물 위치, loading condition, collection readiness 확인\n- 작업 완료 여부를 사진·짧은 문장으로 증빙\n- Haitham의 MOSB 해상 운영과 Roldan의 site receiving 사이에서 현장 상태 연결",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#61",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-2. Container stuffing 및 MOSB 야외 창고 관리 ★핵심",
    "text": "Jhysn은 MOSB(VP24) 현장에서 container stuffing 진행 상태와 야외 창고·laydown area의 화물 상태를 관리한다.\n\n- Container stuffing 시작·진행·완료 상태 감독\n- MOSB 야외 창고의 화물 보관 위치와 상태 확인\n- basket, A-frame, sling, CCU 등 야외 보관 자재 상태 확인\n- crane/forklift 투입 전 현장 준비 상태 확인",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#62",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-3. CCU·폐기물·Basket 상태 확인",
    "text": "CCU, basket, skip bin, waste, sling 상태를 현장에서 확인하고 팀에 전달한다.\n\n- ALP collection 완료 보고\n- basket unstuffing 결과 공유\n- port cabin, open top, skip bin exit pass 요청 정보 제공\n- damaged sling 사용 금지 같은 현장 안전 판단 보조",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#63",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-4. Gate/Exit Pass 요청 정보 제공",
    "text": "차량 번호, trailer 번호, 컨테이너 번호를 현장에서 정리해 Arvin, Roldan, kEn 쪽 실행자에게 넘기는 역할이 많다.\n\n- ALP, Port Cabin, UPC, DSV 차량의 exit pass 정보 전달\n- gate 통과 전 필요한 현장 식별 정보 확인\n- 보안 통과가 막힐 때 Arvin의 이메일 발송 또는 Roldan의 현장 통과 확인을 보조",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#64",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-5. Offloading·Stuffing·장비 위치 확인",
    "text": "MOSB(VP24)에서 offloading, shifting, stuffing, crane/forklift 준비 상태를 확인한다.\n\n- HIL, UPC, A-Frame offloading 시작·완료 보고\n- crane in position, forklift request 등 장비 준비 상태 공유\n- DNVU/SCT container stuffing 현황 감독 확인",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#65",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. 업무 중요도 매트릭스",
    "text": "| 순위 | 업무 영역 | 반복도 | 영향 |\n|------|----------|--------|------|\n| 1 | MOSB(VP24) → AGI/DAS 향 화물 현장 감독 | 매우 높음 | AGI/DAS 출고 준비 상태 판단에 직접 영향 |\n| 2 | Container stuffing 및 MOSB 야외 창고 관리 | 매우 높음 | MOSB staging과 offshore dispatch 품질에 직접 영향 |\n| 3 | 보고·조율·Follow-up | 매우 높음 | 원격 팀의 작업 판단 근거 |\n| 4 | CCU·폐기물·Basket | 매우 높음 | 회수·폐기물·장비 상태 판단 |\n| 5 | Gate/Exit Pass 정보 제공 | 매우 높음 | 차량 통과 준비의 선행 자료 |\n| 6 | Offloading·Stuffing 확인 | 높음 | VP24 작업 진행률 확인 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#66",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. 다른 팀원과의 역할 경계",
    "text": "| 중복처럼 보이는 업무 | Jhysn의 실제 범위 | 다른 담당자와의 경계 |\n|--------------------|------------------|----------------------|\n| MOSB(VP24) 현장 관리 | AGI/DAS 향 화물의 현장 감독, stuffing 상태, 야외 창고 상태 확인 | Ronnel/ronpap20은 VP24 담당자로 현장 작업 상태를 실행·보고 |\n| Container stuffing | stuffing 진행률과 현장 준비 상태 감독 | Ronnel/ronpap20은 VP24 현장 작업 담당, kEn은 창고·dispatch 실행 |\n| Exit Pass | 차량·container 식별 정보와 현장 요청을 제공 | Arvin은 이메일·문서 발송 담당 |\n| Gate Pass | 현장 통과에 필요한 정보 확인 | Roldan은 현장 입차 준비와 실제 통과 확인 |\n| LPO/PL | 현장 작업에 필요한 확인 요청을 올림 | Karthik은 국내 LPO PL/DN/MTC 문서 담당 |\n| Backload | 현장 상태와 완료 여부를 보고 | Roldan은 회수 운송 실행과 최종 현장 책임 |\n| 창고·dispatch | 현장 수령 준비 상태를 알려줌 | kEn은 DSV/창고 출고 실행 담당 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#67",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5. 원문 근거",
    "text": "> `HVDC Project Lightning` 25/3/9 AM 10:00 line 7767: `ALS COLLECTION DONE`\n\n> `HVDC Project Lightning` 25/3/26 PM 4:52 line 8505: `Unstuffed from the basket boss`\n\n> `Abu Dhabi Logistics` 24/8/22 AM 8:29 line 90: `ALP EXIT PASS TR 3155 40FT OT...`\n\n> `Abu Dhabi Logistics` 24/8/23 AM 8:50 line 242: `OFFLOADING START FOR ALP TRAILER`\n\n> `Abu Dhabi Logistics` 24/8/23 PM 3:45 line 292: `5 X A-FRAME REMAINING AT YARD`",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#68",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6. E2E 물류 프로세스 포지션",
    "text": "| 구간 | Jhysn 역할 |\n|------|------------|\n| M100 Gate-out | exit pass 요청 정보와 현장 차량 정보 제공 |\n| M115 MOSB Staged | MOSB(VP24) 야외 창고 및 AGI/DAS 향 화물 staged 상태 감독 |\n| M116 Loaded/Staged | container stuffing 및 loading readiness 감독 |\n| M120 Picked/Staged | offloading·stuffing·shifting 진행률 감독 보고 |\n| M130 Site Arrived | AGI/DAS 도착 전 현장 출고 상태 증빙 |\n| M140 POD/GRN 보조 | 완료 사진·짧은 상태 보고로 수령 증빙 보조 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#69",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "7. 부재 또는 지연 시 영향",
    "text": "Jhysn이 없으면 MOSB(VP24)에서 AGI/DAS로 향하는 화물의 현장 감독 공백이 생긴다. 원격 팀은 container stuffing, MOSB 야외 창고 상태, 장비 위치, gate/exit pass 정보가 맞는지 즉시 확인하기 어렵다.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#70",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "8. 결론",
    "text": "Jhysn은 문서 승인 담당자가 아니라 **MOSB(VP24) 현장 감독자**다. AGI/DAS로 향하는 화물의 stuffing, 야외 창고 상태, 작업 준비 상태를 현장에서 확인하고, Haitham·Roldan·kEn이 다음 조치를 판단할 수 있게 현장 상태를 연결한다.\n\n<!-- 2026-04-27-fmc-org-ontology-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#71",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 FMC 조직도 및 ontology 반영 보강",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`, `../ontology/ontology_00_01_role_process_reflection_report_2026-04-27.md`\n> 개인정보 처리: 사용자 지시에 따라 조직도 JSON의 이메일은 삽입한다. 전화번호는 이 문서에 복사하지 않는다.\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 조직도 실명 | Jhason Alim De Guzman |\n| 조직도 직책 | FMC |\n| 조직도 SITE | MUSSAFAH |\n| 조직도 이메일 | jh***@samsung.com |\n| 대화·문서 표기 | Jhysn, Jhason, Jason |\n| ontology ActorRole 제안 | `MOSBVP24FieldSupervisor` |\n| 연결 milestone | M100 Gate-out 보조, M115 MOSB Staged 현장 감독, M116 loading/stuffing 보조, M120 Picked / Staged 감독, M130 Site Arrived 보조, M140 POD/GRN 보조 |\n| 역할 경계 고정 | Jhysn은 MOSB(VP24)에서 AGI/DAS 향 화물, container stuffing, 야외 창고 상태를 감독하는 현장 actor다. |\n| ontology 반영 위치 | CONSOLIDATED-00 CommunicationEvent/AuditRecord/MilestoneEvent의 fieldSupervisorBy 예시 |\n\n검증 판단: `Jhysn` 문서는 FMC 조직도 실명·직책과 연결되며, ontology 00/01에는 개인 이름을 핵심 클래스가 아니라 `MOSBVP24FieldSupervisor` 역할 예시 또는 evidence instance로 반영하는 것이 적절하다.\n<!-- 2026-04-27-fmc-org-ontology-sync-end -->\n\n<!-- 2026-04-27-duckdb-verification-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#72",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "9. 2026-04-27 DuckDB 검증",
    "text": "> 기준 자료: `email_search.duckdb` (OUTLOOK_HVDC_ALL_202409202510.xlsx 기반)\n> 쿼리 기준: SenderName/SenderEmail/RecipientTo/Subject/PlainTextBody에서 handle 또는 이메일 검색",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#73",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 쿼리 결과",
    "text": "| 항목 | 결과 |\n|------|------|\n| **총 메시지 수 (handle 포함)** | 0건 (DuckDB body에 \"Jhysn\"/\"Jhason\"/\"Jason\" 텍스트 미검출) |\n| **직접 이메일 기준 메시지 수** | 79건 (jh***@samsung.com 기준) |\n| **검색 기간** | Excel 일련번호 기준 (2025년 중반 ~ 2026년 초) |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#74",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "주요 키워드 분포 (Jhysn 관련 이메일)",
    "text": "| 키워드 | 언급 횟수 | 비고 |\n|------|--------|------|\n| BL | 1 | Bill of Lading 문서 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#75",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "Jhysn의 DuckDB 데이터 해석",
    "text": "Jhysn의 DuckDB 결과는 **이메일보다 WhatsApp 중심 활동 패턴**을 보여준다:\n- **79건 직접 이메일** — 외부 협력사나 팀 간 공식 문서 전달에 활용\n- **handle 기반 0건** — \"Jhysn\"/\"Jhason\"/\"Jason\" 텍스트가 이메일 본문에 거의 등장하지 않음\n- 이는 Jhysn이 **실시간 현장 보고(WhatsApp 사진·짧은 메시지)** 위주이며, 이메일은 보조 채널임을 의미",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#76",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "이메일 제목 (직접 이메일 기준 — 상위 5건)",
    "text": "DuckDB에서 직접 이메일 제목 추출 결과 확인 필요 (79건 jh***@samsung.com 발송 메일)",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#77",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 검증 판단",
    "text": "Jhysn의 DuckDB 데이터는 그의 업무 특성과 일치한다:\n- **실시간 현장 증빙 보고자**로서 공식 이메일보다는 WhatsApp 채널을 주요 커뮤니케이션 도구로 활용\n- 79건의 직접 이메일은 공식 기록이 필요한 경우에만 사용\n- WhatsApp 원본 대화(7,153건 발화, Abu Dhabi Logistics 7,089건)가 주 데이터 원천\n\n> ⚠️ 주의: Jhysn의 본 문서는 WhatsApp 대화 분석이 주 데이터 기반이다. DuckDB 이메일은 보조 참고용이며, 이메일 body에 \"Jhysn\" 미검출은 업무 방이 아니라 채널 선호도를 반영한다.\n<!-- 2026-04-27-duckdb-verification-end -->\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#78",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: 6개 WhatsApp 채팅 원본 (`Abu Dhabi Logistics`, `DSV Delivery`, `MIR Logistics`, `SHU Logistics`, `HVDC Project Lightning`, `Jopetwil 71 Group`) 및 채널별 Guideline 문서 전수 검토\n> 작성일: 2026년 4월 27일\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#79",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. 기본 정보",
    "text": "| 항목 | 내용 |\n|------|------|\n| **이름** | Karthik Raj |\n| **채팅 핸들** | `Karthik SCT Logistics` |\n| **소속** | Samsung C&T HVDC Project — 국내 LPO 중심 서류 / SCT Logistics(storekeeper) |\n| **활동 기간** | 25/8/22 (~2026초) |\n| **채팅 참여 채널** | HVDC Project Lightning (주요), Abu Dhabi Logistics, DSV Delivery, MIR Logistics |\n| **직속 보고라인** | **상욱 / Shariff** (물류팀 팀장, 동일인 — 직속 지시) |\n| **주요 협력자** | Khemlal (SCT Logistics), Bimal, Ramaju Das, DaN (Roldan), kEn, Shariff, 상욱, Jhysn |\n\n> **역할 공식 정의**:\n> - HVDC Project Lightning 채널: SCT Logistics storekeeper\n> - Abu Dhabi Logistics 채널: 상욱/Shariff의 현장 지시 직접 수신자\n> - DSV Delivery 채널: DSV 야드 관련 조율 창구\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#80",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2. 주요 업무 분류",
    "text": "> **업무 중요도 순서**: §2-1 국내 LPO 기반 Packing List 준비·배포(핵심 반복) > §2-2 국내 LPO 현황 추적 > §2-3 현장 확인·검증 > §2-4 Container/Gate Pass 조율 > §2-5 DSV 야드·자재 관리 > §2-6 기타 조율",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#81",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-1. 국내 LPO 기반 Packing List 준비·배포 및 DN/MTC 동봉 ★핵심 (최고 빈도)",
    "text": "국내 LPO와 SCT Logistics 관할 화물(ALS-xxxx shipment 기준)의 Packing List를 국내 vendor/협력사에게 수집·확인 후 Khemlal, Bimal, Ramaju Das, DaN 등에게 이메일로 공유하는 업무. 채팅에서 가장 반복적으로 나타나는 핵심 업무다. 해외 inbound 통관 서류는 Arvin 범위이고, Karthik은 **국내 LPO 중심 서류 담당**이다.\n\n- ALS(DAS/AGI/Shuweihat/MIR) 화물 별 Packing List 취합 및 발송\n- DN(Delivery Note)/MTC(Material Transfer Certificate) 동봉 요청 및 전달\n- Wardeh-1, Jopetwil 62, Razan-1, Comarco Palma 등 선박별 PL 분류·발송\n- 불완전한 PL 수령 시 Revised PL 발송 및 추가 항목 확인\n- 동일 LPO에 속한 여러 shipment의 PL 상이 구분 필요 (\"Same LPO different shipments\")\n- Khemlal(Bimal) 요청 → PL 즉시 발송 (\"Done bro\", \"Will Sent ASAP\")\n\n> 채팅 증거 (HVDC Project Lightning, 25/8/22~9/26):\n> `\"Khemlal-SCT Logistics: @⁨Karthik SCT Logistics⁩ Please share Wardeh Packing List\"` — 25/8/22\n> `\"Karthik SCT Logistics: Done bro\"` — 25/8/29, 25/9/10, 25/9/19\n> `\"Khemlal-SCT Logistics: @⁨Karthik SCT Logistics⁩ Pls Share PL/DN/MTC for ALS-308\"` — 25/9/23\n> `\"Khemlal-SCT Logistics: Appreciate if you can share the Supplier Delivery Notes/MTC together with Packing list in order to complete MRR on time\"` — 25/9/11\n> `\"Karthik SCT Logistics: Give me 1 hour bro i will send you\"` — 25/9/22\n> `\"Karthik SCT Logistics: Same LPO different shipments\"` — 25/9/26 (ALS-307/309 구분 사안)\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#82",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-2. 국내 LPO Delivery Status 추적 및 보고",
    "text": "국내 LPO(Local Purchase Order) 번호 기준으로 vendor/협력사 deliveries 현황을 확인하고 상욱/Shariff 및 팀에 보고하는 업무. kEn의 LPO 일일 운영 보고와 겹치지만, Karthik은 **국내 LPO 문서와 PL/DN/MTC 기준의 확인자**이고, kEn은 **창고·현장 실행 기준의 LPO 운영자**로 구분한다.\n\n- LPO-2701, LPO-2636 등 delivery status 직접 확인\n- delivery address/Container 넘버 매핑 (\"2636-A-269 / XXXU 483957\")\n- LPO 미확인 항목은 vendors에게 확인 후 팀 공유\n- 동일 LPO에 속한 shipment 목록 구분 (\"Item 1, 2 and 17\")\n\n> 채팅 증거:\n> `\"Khemlal-SCT Logistics: Please update the LPO - 2701, 2636 delivery status\"` — 25/8/22\n> `\"Karthik SCT Logistics: 2636-A-269 / XXXU 483957\"` — 25/8/22\n> `\"Khemlal-SCT Logistics: LPO-2701 - Wooden TV Stand and 65\" TV / can you check this\"` — 25/8/22\n> `\"Karthik SCT Logistics: LPO NUMBER PLEASE\"` — 25/9/26 (LPO 구분 요청)\n> `\"Karthik SCT Logistics: Already send on 24/9 to subin i will forward you bro\"` — 25/9/26\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#83",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-3. 현장 확인·검증 작업 (현장 Deploy)",
    "text": "DSV 야드/Old Yard 등으로 직접 이동하여 자재 수량, 컨테이너 상태, 야드 상황을 직접 확인하는 현장 업무.\n\n- Old Yard로 이동하여 자재 검증·재확인 (\"Karthik and i otw to old yard, for verification and rechecking\")\n- ASS manpower 현황 확인 요청 수신 (Khemlal, Shariff)\n- Cladding arrival time 및 manpower 확인\n- Zener 사 전화 연계 (\"Karthik..call to Zener\" — 25/6/1)\n- DAMASK/CCU 현장 검증\n\n> 채팅 증거 (Abu Dhabi Logistics):\n> `\"상욱: Karthik..pls check ASS manpower...asap\"` — 25/5/30\n> `\"상욱: Karthik..pls check..Cladding arrival time...manpower as well\"` — 25/5/30\n> `\"상욱: Karthik..call to Zener\"` — 25/6/1\n> `\"상욱: Karthik..trailer check\"` — 25/7/23\n> `\"Karthik and i otw to old yard, for verification and rechecking\"` — (Abu Dhabi)\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#84",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-4. Container/CCU/Gate Pass 조율",
    "text": "Container/unit level의 Gate Pass 발부 및 CCU(Container Storage Unit) TUV 검사 일정 조율 업무.\n\n- Gate Pass 발부 (\"Normal..gate pass by Mr Karthik..\" — 25/5/25)\n- CNTR/CCU TUV inspection 일정 관리 (\"Karthik..CNTR.CCU..TUV inspection Tomorrow..\" — 25/5/28)\n- Gate pass arrangements (\"Gate pass arranged please proceed\" — 25/11/15)\n- Manlift/Equipment gate pass 확인\n\n> 채팅 증거:\n> `\"상욱: Normal..gate pass by Mr Karthik..\"` — 25/5/25\n> `\"상욱: Karthik...CNTR.CCU..TUV inspection Tomorrow..\"` — 25/5/28\n> `\"Karthik SCT Logistics: Gate pass arranged please proceed\"` — 25/11/15\n> `\"Karthik SCT Logistics: Kindly coordinate with [DSV team]\"` — 26/1/5\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#85",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-5. DSV 야드 자재 관리 및 복구 조율",
    "text": "DSV 야드에 있는 자재(특히 damaged wooden box/HE box case)의 수리 및 현장 반출사항 조율.\n\n- Damaged box repair coordination (\"Damaged box repair\" / Wood peckers team 야드 방문)\n- Repaired HE Box Case 364/365 Delivery 승인 및 게이트 패스 조율\n- DSV Jay/Basem과 협력하여 야드 야적 상황 확인 (\"Open yard outdoor covered\" — 25/12/26)\n- Inspection only 케이스 처리 (\"Its just for inspection only\")\n\n> 채팅 증거 (DSV Delivery):\n> `\"Karthik SCT Logistics: Brother Wood peckers team will visit your yard to take some pictures and inspect. They wont repair it now.\"` — 26/1/5\n> `\"Karthik SCT Logistics: @⁨~Basem⁩ @⁨Jay DSV⁩ Good morning - Permission to deliver the repaired He Box Case 364365\"` — 26/1/8\n> `\"Karthik SCT Logistics: Open yard outdoor covered\"` — 25/12/26\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#86",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-6. 기타 조율 업무",
    "text": "- GRM trailer 현황 확인 (\"Karthik..GRM trailer ?\" — 25/7/23)\n- DAMASK/CCU in/out status 관리 지시 (상욱/Shariff)\n- Administrative 업무 (monitor/desk 배달 조율)\n- \"Karthik is currently gathering the information\" (25/6/4) — 정보 수집 및 취합 역할\n\n> 채팅 증거:\n> `\"상욱: Karthik..GRM trailer ?\"` — 25/7/23\n> `\"국일 Kim: Karthik is currently gathering the information.\"` — 25/6/4\n> `\"DaN: Mr. @⁨국일 Kim⁩ , kindly assist us to inform admin team to acquire 2x desktop monitor for Mr. Karthik and Mr. Jhason.\"` — 25/4/13\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#87",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. 업무 중요도 매트릭스",
    "text": "| 순위 | 업무 영역 | 빈도 | 영향도 | 비고 |\n|------|-----------|------|--------|------|\n| **1** | **국내 LPO 기반 Packing List 준비·배포 (PL + DN/MTC)** | **매우 높음** | **매우 높음** | **SCT 화물 MRR 완료의 선행 조건** |\n| 2 | 국내 LPO Delivery Status 추적 | 높음 | 높음 | 국내 vendor delivery 확인·보고 |\n| 3 | 현장 확인·검증 작업 | 중간 | 높음 | Old Yard 직접 Deploy |\n| 4 | Container/Gate Pass 조율 | 중간 | 중간 | 상욱/Shariff 지시 직접 수신 |\n| 5 | DSV 야드 자재 관리·복구 | 간헐적 | 중간 | Damaged box/HE case |\n| 6 | 기타 조율 | 낮음 | 낮음 | GRM trailer, Admin, info gathering |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#88",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. 다른 팀원과의 역할 비교",
    "text": "| 업무 영역 | Karthik | Khemlal (SCT) | DaN (Roldan) | kEn |\n|-----------|---------|---------------|--------------|------|\n| Packing List | **PL 직접 발송** | PL 요청·독촉 | Site PL 보조 | Warehouse LPO 관리 |\n| LPO 추적 | **vendor 연락 확인** | SCT shipment 추적 | - | LPO 관리 전담 |\n| 현장 Deploy | **현장 직접 확인** | 없음 | Site 수령 담당 | 창고 조율 |\n| Gate Pass | **Gate Pass 조율** | 없음 | 트레일러 준비 | 없음 |\n| DSV 야드 | **자재 수리 조율** | 없음 | 없음 | 창고 배차 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#89",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-1. 중복 업무 경계 정리",
    "text": "| 중복처럼 보이는 업무 | Karthik의 실제 범위 | 다른 담당자와의 경계 |\n|---------------------|--------------------|---------------------|\n| Packing List / DN / MTC | 국내 LPO 기반 문서 수집, revised PL 발송, MRR 선행 자료 제공 | Arvin은 해외 inbound 통관 서류, Roldan은 현장 수령용 PL 보조, kEn은 창고 운영 자료로 활용 |\n| LPO Delivery Status | 국내 vendor/협력사에게 LPO별 배송 상태를 확인하고 문서와 매칭 | kEn은 매일 창고·현장 LPO 실행 상태를 보고 |\n| Gate Pass | SCT/DSV 야드 확인과 연계된 Gate Pass 조율 | Arvin은 Exit Pass 이메일, Roldan은 현장 입차 준비, kEn은 창고·현장 게이트 실행 보조 |\n| DSV 야드 자재 복구 | damaged box/HE case 수리 확인과 delivery permission 조율 | Roldan은 현장 배송·수령, kEn은 창고 위치·상태 보고 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#90",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5. 결론 및 시사점",
    "text": "Karthik은 SCT Logistics의 **국내 LPO 중심 서류 담당(storekeeper)**이다. 국내 LPO와 연결된 PL, DN, MTC, Revised PL을 vendor/협력사로부터 수집하고 Khemlal(SCT) 및 프로젝트 팀에 공유한다. 해외에서 들어오는 BOE/DO/MSDS/FANR/MOIAT/EC/BL 같은 inbound 통관 서류는 Arvin 범위이며, Karthik의 주 역할은 국내 LPO 서류를 MRR과 현장 작업에 연결하는 것이다.\n\n- **국내 LPO 기반 PL 수집 + DN/MTC 동봉 + Revised PL 발송**이 일상 업무의 핵심 축\n- 국내 LPO-level delivery 추적 및 현장 Deploy로 SCT 물류의 가시성 확보에 기여\n- Gate Pass/Container 조율 및 DSV 야드 자재 복구 지원으로 현장 운영을 보완\n- 상욱/Shariff의 지시를 직접 수신하며 팀장 직속의 현장 실행자 역할\n- 부재 시 Khemlal이 PL 취합 기능을 대체할 수 있으나 vendor 연락 창구는 공백 발생\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#91",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6. E2E 물류 프로세스 포지션 (온톨로지 기반)",
    "text": "> 본 섹션은 `CONSOLIDATED-00-master-ontology.md` Milestone M10~M160 및 RoutingPattern 체계 기준.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#92",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-1. 담당 구간 (Milestone)",
    "text": "| 마일스톤 | 이름 | Karthik 역할 |\n|----------|------|-------------|\n| **M10** | Cargo Ready | 국내 LPO vendor/협력사로부터 PL 수집 — MRR(Material Receipt Report) 준비 시작 |\n| **M20** | Packed / Marked | PL/DN/MTC 취합 및 팀 공유 — `DocumentData` 공급 |\n| **M30** | Pickup Completed | DSV 야드 내 자재 상태 확인 및 Gate Pass 조율 |\n| **M100** | Gate-out Completed | Gate Pass 발부 및 장비 반출 허가 |\n\n**담당 Journey Stage**: `ORIGIN_DISPATCH`(vendor side) → `PORT_ENTRY`(AGI) → `TERMINAL_HANDLING` → `INLAND_HAULAGE` 구간 Document 허브",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#93",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-2. RoutingPattern별 영향",
    "text": "| RoutingPattern | Karthik 역할 변화 |\n|---------------|-----------------|\n| `MOSB_DIRECT` (Port → MOSB → Site) | M20 PL 취합 → M30 야드 확인 → M100 Gate Pass |\n| `WH_MOSB` (Port → WH → MOSB → Site) | M20 + DSV 야드 damaged box 복구 조율 추가 |\n| `WH_ONLY` / `DIRECT` | 국내 LPO 기반 SCT vendor PL 취합 역할 제한 없음 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#94",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-3. 온톨로지 책임 클래스",
    "text": "`PackingList` · `DeliveryNote(DN)` · `MaterialTransferCertificate(MTC)` · `LPO` · `Container(CCU)` · `ServiceRequest(Gate Pass)` · `WarehouseTask(현장 검증)`",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#95",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-4. 상위 맥락에서의 위치",
    "text": "Karthik이 취합하는 국내 LPO 기반 PL/DN/MTC는 온톨로지에서 `ShipmentUnit`의 **MRR 선행 서류 Evidence**로서, M20(MRR creation) 및 M110(WH Received) 트리거의 선행 데이터이다. 또한 CCU in/out status 관리 (`CONSOLIDATED-06-material-handling.md` AGI/DAS 도메인 참조)는 routing confirmation 및 warehouse receipt accuracy에 직접 연결된다. 그의 국내 LPO 서류 업무가 부재하면 vendor 연락 창구가 공백되어 MRR 생성이 불가능해진다.\n\n---\n\n*본 문서는 WhatsApp 원본 채팅 및 채널 Guideline 문서를 직접 분석하여 작성되었습니다.*\n\n<!-- 2026-04-27-dialogue-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#96",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "7. 2026-04-27 전체 대화 기반 보강",
    "text": "> 기준 자료: `individual_reports_from_dialogue/Karthik_전체대화_상세업무_분석.md`\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 직접 식별 발화 수 | 1,233건 |\n| 채널별 활동량 | Abu Dhabi Logistics 853건, HVDC Project Lightning 55건, DSV Delivery 27건 |\n| 대화 기준 상위 업무 신호 | 보고·조율·Follow-up, 현장 수령·배송·Backload, Gate/Exit Pass, 국내 LPO·PL/DN/MTC 서류 |\n| 메인 업무 재확인 | 국내 LPO 중심 PL, DN, MTC, Revised PL 문서 담당자 |\n| 역할 경계 | Karthik은 국내 vendor·SCT Logistics 쪽 LPO 문서를 다룬다. 해외 통관 서류인 BOE/DO/MSDS/FANR/MOIAT/EC/BL은 Arvin 범위다. |\n| 지연 영향 | Karthik이 지연되면 국내 LPO와 MRR 선행 자료 연결이 끊기고, unstuffing·수령 서류 준비가 늦어진다. |\n\n검증 메모: 이 보강은 `Karthik_전체대화_상세업무_분석.md`의 전체 대화 파싱 결과를 기존 주요업무 문서에 연결한 것이다. 기존 문서의 상세 원문 증거는 유지하고, 발화 수와 역할 경계를 최신 분석 기준으로 보강했다.\n<!-- 2026-04-27-dialogue-sync-end -->\n\n<!-- 2026-04-27-fmc-org-ontology-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#97",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 FMC 조직도 및 ontology 반영 보강",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`, `../ontology/ontology_00_01_role_process_reflection_report_2026-04-27.md`\n> 개인정보 처리: 사용자 지시에 따라 조직도 JSON의 이메일은 삽입한다. 전화번호는 이 문서에 복사하지 않는다.\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 조직도 실명 | Karthik Raj |\n| 조직도 직책 | Storekeeper |\n| 조직도 SITE | MUSSAFAH |\n| 조직도 이메일 | ka***@samsung.com |\n| 대화·문서 표기 | Karthik, Karthik SCT Logistics |\n| ontology ActorRole 제안 | `DomesticLPODocumentController` |\n| 연결 milestone | M10 Cargo Ready, M20 Packed / Marked, M30 Pickup Completed, M100 Gate-out, M110 WH Received 선행자료 |\n| 역할 경계 고정 | 국내 LPO, PL, DN, MTC, Revised PL 문서는 Karthik 범위다. 해외 inbound 통관 서류는 Arvin 범위다. |\n| ontology 반영 위치 | CONSOLIDATED-00 ActorRole 및 PurchaseOrder/Document/WarehouseTask/SiteReceipt 선행 evidence 예시 |\n\n검증 판단: `Karthik` 문서는 FMC 조직도 실명·직책과 연결되며, ontology 00/01에는 개인 이름을 핵심 클래스가 아니라 `DomesticLPODocumentController` 역할 예시 또는 evidence instance로 반영하는 것이 적절하다.\n<!-- 2026-04-27-fmc-org-ontology-sync-end -->\n\n<!-- 2026-04-27-duckdb-verification-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#98",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 DuckDB 검증",
    "text": "> 기준 자료: `email_search.duckdb` (OUTLOOK_HVDC_ALL_202409202510.xlsx 기반)\n> 쿼리 기준: SenderName/SenderEmail/RecipientTo/Subject/PlainTextBody에서 handle 또는 이메일 검색",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#99",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 쿼리 결과",
    "text": "| 항목 | 결과 |\n|------|------|\n| **총 메시지 수 (handle 포함)** | 2,422건 |\n| **직접 이메일 기준 메시지 수** | 557건 (ka***@samsung.com 기준) |\n| **검색 기간** | Excel 일련번호 45750~46065 (2025년 중반 ~ 2026년 초) |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#100",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "사이트별 분포 (DuckDB body 기준)",
    "text": "| 사이트 | 언급 횟수 | 비고 |\n|--------|-----------|------|\n| **AGI** | **1,099건** | HVDC AGI 현장 — 가장 많은 언급 |\n| **MOSB** | **1,423건** | Marine Offshore Supply Base — 국내 LPO 서류 취합 핵심 현장 |\n| DAS | 707건 | Das Island 현장 |\n| ALS | 404건 | ALS shipment 관련 |\n| **SCT** | **875건** | SCT Logistics — Karthik의storekeeper 역할과 직접 연결 |\n| MIR | 85건 | Mirfa 현장 |\n| SHU | 74건 | Shuweihat 현장 |\n| DSV | 58건 | DSV Delivery coordination |\n| CICPA | 58건 | CICPA 게이트 처리 |\n| JPT | 56건 | JPT 선박 관련 |\n| UPC | 80건 | UPC 협력사 coordination |\n| GRM | 173건 | GRM 협력사 coordination |\n| Jopetwil | 8건 | Jopetwil 선박 |\n| VP24 | 1건 | VP24 현장 |\n| LDA | 2건 | LDA 현장 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#101",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "LPO 언급",
    "text": "- **총 300건** (LPO 번호 다수 확인: LPO-1223, LPO-1209, LPO-1166, LPO-1250, LPO-2873, LPO-1386, LPO-1550, LPO-1496, LPO-1615, LPO-1666, LPO-1557, LPO-1711, LPO-1803, LPO-1840, LPO-1760, LPO-1839, LPO-1254, LPO-2507, LPO-1147, LPO-1149, LPO-1652, LPO-1760 등)\n- DuckDB의 LPO 데이터는 Karthik의 **국내 LPO 문서 관리 역할**과 직접 일치",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#102",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "관련 회사 (DuckDB 본문 기준)",
    "text": "| 회사 | 언급 횟수 | 비고 |\n|------|-----------|------|\n| **SCT** | **875건** | Storekeeper 역할 — SCT Logistics 핵심 파트너 |\n| **ALS** | **404건** | ALS shipment 관련 |\n| **GRM** | 173건 | GRM 협력사 coordination |\n| DSV | 58건 | DSV Delivery coordination |\n| **UPC** | 80건 | UPC 협력사 coordination |\n| CICPA | 58건 | CICPA 게이트 처리 |\n| JPT | 56건 | JPT 선박 관련 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#103",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "최근 이메일 제목 (직접 이메일 기준 상위 10건)",
    "text": "1. RE: [HVDC-AGI]-[SCT-MOSB]- MATERIAL DELIVERY-SPARE PARTS-JOHNSON ARABIA-HVDC-AGI-JON-MOSB-064-[12.02\n2. RE: [HVDC-AGI]-[SCT-MOSB]- MATERIAL DELIVERY-SPARE PARTS-JOHNSON ARABIA-HVDC-AGI-JON-MOSB-058-[12.02\n3. RE: [HVDC- AGI ] -SCT-EMCC- DELIVERY OF MATERIALS -HVDC-AGI-EMCC-MOSB-114-12.02.2026\n4. [HVDC- AGI ] -SCT-EMCC- DELIVERY OF MATERIALS -HVDC-AGI-EMCC-MOSB-114-12.02.2026\n5. RE: [HVDC- AGI ] -SCT-EMCC- DELIVERY OF MATERIALS -HVDC-AGI-EMCC-MOSB-113-11.02.2026\n6. RE: [HVDC- AGI ] -SCT-EMCC- DELIVERY OF MATERIALS -HVDC-AGI-EMCC-MOSB-113-11.02.2026\n7. RE: [HVDC- AGI ] -SCT-EMCC- DELIVERY OF MATERIALS -HVDC-AGI-EMCC-MOSB-113-10.02.2026\n8. RE: Request for Authorized Signatory Form Update for 2026\n9. [HVDC- AGI ] -SCT-EMCC- DELIVERY OF MATERIALS -HVDC-AGI-EMCC-MOSB-112-09.02.2026\n10. RE: [MOSB] Shafeek Timesheet_Jan-26",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#104",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 검증 판단",
    "text": "Karthik의 DuckDB 데이터는 **SCT Logistics storekeeper + 국내 LPO 문서 담당** 역할과 완벽하게 일치한다:\n- **SCT 875건** = SCT Logistics와의 가장 핵심적인コミュニケーション 채널\n- **AGI 1,099건 + MOSB 1,423건** = SCT 화물의 최종 목적지 현장\n- **ALS 404건** = ALS shipment의 Packing List 취합 업무 직접 반영\n- **LPO 300건** = 국내 LPO 문서 관리 업무의 공식 기록\n- DuckDB 이메일 2,422건(handle 기준) + 557건(직접 이메일) = 대화 분석(1,233건 발화)과 함께 완전한 업무 프로파일\n\nDuckDB 데이터는 Karthik의 SCT Logistics storekeeper 역할이 AGI/MOSB/DAS 현장의 LPO 문서 허브임을 정량적으로 입증한다.\n<!-- 2026-04-27-duckdb-verification-end -->\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#105",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: 6개 WhatsApp 채팅 원본 (`Abu Dhabi Logistics`, `DSV Delivery`, `MIR Logistics`, `SHU Logistics`, `HVDC Project Lightning`, `Jopetwil 71 Group`) 및 채널별 Guideline 문서 전수 검토\n> 작성일: 2026년 4월 27일\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#106",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. 기본 정보",
    "text": "| 항목 | 내용 |\n|------|------|\n| **실명** | Roldan Mendoza |\n| **채팅 핸들** | `DaN` |\n| **소속** | Samsung C&T HVDC Project — MOSB (Marine Offshore Supply Base) 팀 |\n| **채팅 참여량** | 전체 대화 기준 직접 식별 발화 6,743건(Abu Dhabi Logistics 5,808건, HVDC Project Lightning 600건, DSV Delivery 185건, MIR Logistics 108건, SHU Logistics 42건) |\n| **직속 보고라인** | **상욱 / Shariff** (물류팀 팀장, 동일인 — 직속 지시) |\n| **주요 협력자** | Jay DSV, Arvin, Khemlal (SCT Logistics), Nicole (SHU) |\n\n> **식별 근거**: DSV Delivery 채팅 Gate Pass 신청서(2025년 10월)에서 `Names: Roldan Mendoza` 명시 확인. 상욱이 \"Roldan..pls check\" 지시 시 `DaN: Noted sir`로 즉각 응답하는 패턴이 전 채널에서 일관되게 반복됨.\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#107",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-1. 게이트 패스 (Gate Pass) 관리 ★핵심",
    "text": "MOSB 시설 출입 통제의 실무 담당자. Arvin/kEn/Karthik도 Gate Pass 관련 업무가 있으나, Roldan은 **현장 차량 입차 준비와 실제 통과 확인을 맡는 실행 담당자**로 구분한다.\n\n- 외부 트레일러·차량의 MOSB 진입 게이트 패스 준비 및 발급 처리\n- 협력사(UPC, GRM, ALP, Alphamed, Altrad, DSV) 트레일러 출입 관리\n- 현장 방문 인원 출입증 신청 (예: EDG 패드아이 어세스먼트 인원)\n- 이례적 상황(PPE 미착용 기사 등) 발생 시 게이트 조치 연계\n\n> 채팅 증거:\n> `\"UPC TRAILER WAITING FOR GATE PASS ONLY (ROLDAN PREPARING)\"` — 25/4/4 Abu Dhabi Logistics\n> `\"DaN: Thanks Bud!\" (entry pass 처리 직후)` — 25/10/6 DSV Delivery\n> `\"DaN: done tol\"` (Nicole 요청 후 게이트 패스 처리) — 26/2/10 SHU Logistics\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#108",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-2. 자재 배송 조율 (Delivery Coordination)",
    "text": "MIR(Mirfa), SHU(Shuweihat), DAS(Das Island), AGI 현장으로의 자재 이동 실무 조율. 문서 준비가 끝난 뒤 현장 수령까지 이어지는 단계가 Roldan의 범위다.\n\n- DSV Jay와 협력하여 트레일러 배차, 로딩 시간, 배송 타이밍 조율\n- 화물 식별 및 분류 (예: MIR행 Blue Straps 7팔레트 / SHU행 Yellow Straps 3팔레트)\n- 납품서(DN), 포장 목록(Packing List) 관계자에게 공유\n- 현장 수령팀과 배송 가능 여부 사전 확인 및 조율\n- 소형 화물의 1톤 픽업 배차 판단 및 실행\n\n> 채팅 증거:\n> `\"Jay DSV: Hi Roldan, I managed to get truck from prestige to MIR. Can I proceed today afternoon loading?\"` — 25/9/17 DSV Delivery\n> `\"DaN: MIR 7 PALLETS - Blue Straps / SHU - 3 PALLETS - Yellow Straps\"` — 25/10/27 MIR Logistics\n> `\"DaN: Team, we will arrange DSV Vehicle, kindly confirm if possible to receive by tomorrow\"` — 25/12/23 MIR Logistics\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#109",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-3. Backload (BL) 관리",
    "text": "현장(DAS/AGI/MIR/SHU)에서 MOSB로의 역방향 회수 화물 처리.\n\n- Backload 자재 수령 및 Exit Pass 발급\n- Backload 현황 공유 (사진, 수량, 컨테이너 번호 포함)\n- BL 스케줄 수립 및 현장팀 공지\n- BL 지연 시 원인 파악 및 재배차\n\n> 채팅 증거:\n> `\"DaN: DSV MIR-SHU COLLECTION EXIT PASS TR 61985\"` — 25/12/24 MIR Logistics\n> `\"국일 Kim: send the draft to roldan\"` (backload 관련 PR 초안 전달 지시) — 25/12/31 HVDC Project Lightning\n> `\"상욱: Roldan..BL status\"` — 25/4/13 Abu Dhabi Logistics\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#110",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-4. 폐기물 CCU (Waste Container Unit) 관리",
    "text": "폐기물 컨테이너(Basket, Skip Bin, Open Top Container)의 수거·반납 조율.\n\n- Alphamed, Altrad의 CCU 수거 일정 요청 및 추적\n- Tadweer E-Manifest 이슈 대응 (Shahbaz 측 조율)\n- CCU 현황 (LDA 보유 수량, 종류) 실시간 보고\n- 수거 트레일러 증차 요청 (ALP 최대 투입 요청)\n- Wood waste, 일반 폐기물 처리 지침 수령 및 실행\n\n> 채팅 증거:\n> `\"상욱: Roldan...pls request for collection to Alphamed..All details....dispatch max trailers\"` — 25/4/9 Abu Dhabi Logistics\n> `\"Ramaju Das: @DaN Roldan bro…. This time Alphamed will collect the 20' Basket without E-Manifest\"` — 25/9/1 HVDC Project Lightning\n> `\"상욱: Roldan..Waste CCU status(current in LDA)..pls send me\"` — 25/4/11 Abu Dhabi Logistics\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#111",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-5. 장비 조달 및 LPO/TPI 관리",
    "text": "리프팅 장비, 슬링, 컨테이너 인증서의 조달 및 갱신 담당.\n\n- 지게차(Forklift) 렌탈 LPO 발행 및 실제 운용 시간 기록 (Timesheet 관리)\n- Webbing Sling TPI 갱신 SR 작성 및 Expedite 처리\n- 컨테이너 TPI 인증서 갱신 (TUV 검사 연계, ALS 수락 후 처리)\n- 지게차 렌탈 시간 연장 요청 (3rd Party 협력사 조율)\n- 리프팅 기어 수거 조율 (DSV와 협력)\n\n> 채팅 증거:\n> `\"상욱: Roldan..TPI certi...CNTR..Webbing sling\"` — 25/4/10 Abu Dhabi Logistics\n> `\"상욱: Roldan..webing sling TPI reneal asap / NEW SR..expedite\"` — 25/4/10 Abu Dhabi Logistics\n> `\"상욱: Dear Roldan. Our LPO 15T F.lift...should be arrived on time.. I have been reminded to make the actual time sheet\"` — 25/4/9 Abu Dhabi Logistics\n> `\"Jhysn: TOL @ROLDAN PLS CALL 3RD PARTY WE WILL EXTEND THE USAGE OF 16T FLIFT\"` — 25/4/11 Abu Dhabi Logistics\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#112",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-6. 트레일러 차량 운영 관리",
    "text": "Samsung C&T 소유 트레일러 문서·운행 지원.\n\n- 트레일러 Mulkia(차량등록증) DSV 및 관련 기관에 제공\n- Dubai–Abu Dhabi 구간 RTA 허가 및 Saeed 도로 퍼밋 처리 지원\n- 트레일러 기사 배치 및 현황 파악 (ETA, 위치 추적)\n- 외부 트레일러(두바이 출발)가 DSV 야드 진입 지연 시 Follow-up\n\n> 채팅 증거:\n> `\"Jay DSV: Hi Roldan / Pls send Mulkia of your trailers\"` — 25/10/27 DSV Delivery\n> `\"Jay DSV: Hi Roldan, please follow up trailers from dubai still not entered\"` — 25/10/29 DSV Delivery\n> `\"상욱: Roldan. Once confirm time. pls arrange Driver for collection.\"` — 25/10/29 DSV Delivery\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#113",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-7. 구매 요청 (PR) 및 SR 처리",
    "text": "현장 소모품, 장비, 서비스의 구매 행정 처리.\n\n- Skip Bin PR 발행\n- 자재 분실 시 재구매 초안 작성 및 조달팀 전달\n- 서비스 요청서(SR) 신규 작성 및 진행 상황 추적\n\n> 채팅 증거:\n> `\"Shariff(= 상욱, 물류팀 팀장): Roldan..requested PR...skipbin?\"` — 25/4/11 Abu Dhabi Logistics\n> `\"Khemlal: can you please issue a PR from there and send to procurement\"` → `\"국일 Kim: send the draft to roldan\"` — 25/12/31 HVDC Project Lightning\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#114",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-8. 현장 대표 및 이메일 루프 관리",
    "text": "MOSB 팀 외부 커뮤니케이션 창구 역할.\n\n- 이메일 루프에 현장 관계자 추가 및 회신 조율\n- DSV 오퍼레이션의 확인/승인 권한자 (Jay DSV가 특정 작업에 Roldan 승인을 필수로 요청)\n- HQ로부터 상세 정보 미제공 시 현장 측에서 자체 확인·정리 후 공유\n- MOSB 팀 대표 수신인으로서 외부 기관(SCT, ALS 등)의 공문 접수\n\n> 채팅 증거:\n> `\"DaN: HQ didn't share the full details of this shipment - which resulted in confusion.\"` — 25/10/15 MIR Logistics\n> `\"Dear Mr. Roldan /MOSB Team\"` (외부 기관 공식 수신인 사용) — 26/3/8 HVDC Project Lightning\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#115",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-9. SKM 및 현장 자재 관련 특이 사항 확인",
    "text": "자재 Origin·BL 불일치 및 특수 화물 확인.\n\n- SKM(삼성물산 구매 자재) BL 출처 이슈 확인 (`상욱: Roldan..clarify..SKM`)\n- DAS 현장 자재 BL 불일치 시 현황 파악 및 보고\n\n> 채팅 증거:\n> `\"상욱: Roldan..clarify..SKM\"` — 25/8/19 HVDC Project Lightning\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#116",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-10. 당직 근무 및 초과 근무 참여",
    "text": "프로젝트 주요 일정 시 당직 팀원으로 투입.\n\n- 주요 작업일 당직 팀 편성에 정기적으로 포함\n- 2시간 OT 적용 지시 수령 및 이행\n\n> 채팅 증거:\n> `\"국일 Kim: The duty team for 5th Sep will be : Mr. Jeong, Jhason, Roldan, Haitham (AM hours), and myself.\"` — 25/9/4 HVDC Project Lightning\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#117",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. 업무 중요도 매트릭스",
    "text": "| 순위 | 업무 영역 | 빈도 | 영향도 | 비고 |\n|------|-----------|------|--------|------|\n| 1 | Gate Pass 관리 | 매우 높음 | 높음 | 모든 트레일러 입출입의 병목 |\n| 2 | 자재 배송 조율 | 매우 높음 | 높음 | MIR/SHU/DAS/AGI 전 현장 연계 |\n| 3 | Backload 관리 | 높음 | 높음 | 현장 자재 회수 핵심 |\n| 4 | CCU 폐기물 수거 | 높음 | 중간 | CCU 부족 시 현장 작업 차질 |\n| 5 | TPI/LPO 장비 관리 | 중간 | 높음 | 인증 만료 시 리프팅 작업 중단 위험 |\n| 6 | 트레일러 운영 | 중간 | 중간 | 배차 지연 직결 |\n| 7 | PR/SR 행정처리 | 중간 | 중간 | 소모품·서비스 조달 지원 |\n| 8 | 이메일·승인 관리 | 낮음 | 높음 | 부재 시 DSV 오퍼레이션 차질 발생 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#118",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. 부재 시 발생한 실제 영향",
    "text": "> `\"국일 Kim: There was a bit of confusion in tracking for a few days after Roldan went on leave, as things weren't fully managed.\"` — 25/6/6 HVDC Project Lightning\n\nRoldan 휴가 중 수 일간 화물 추적 혼선 발생. 업무 대리인 또는 인수인계 SOP가 부재함을 시사.\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#119",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-1. 중복 업무 경계 정리",
    "text": "| 중복처럼 보이는 업무 | Roldan의 실제 범위 | 다른 담당자와의 경계 |\n|---------------------|-------------------|---------------------|\n| Gate Pass | 현장 차량 입차 준비, 기사/트레일러 통과 확인 | Arvin은 Exit Pass 이메일, kEn은 창고·현장 실행 보조, Karthik은 SCT/DSV 야드 Gate Pass 조율 |\n| Delivery Coordination | MIR/SHU/DAS/AGI 현장으로 실제 배송 실행 및 수령 확인 | Arvin은 통관·DSV 요청, kEn은 창고 출고 지시, Karthik은 PL/DN/MTC 문서 제공 |\n| TPI/LPO 장비 | 지게차·Webbing Sling 등 장비 갱신 SR/LPO 요청 | Haitham은 현장 검사 판정, kEn은 납기 추적, Arvin은 문서 추적 |\n| Backload/CCU | 현장 회수 화물 운송과 폐기물 CCU 수거 실행 | kEn은 BL Laydown 현황 보고, Haitham은 MOSB 작업 중 CCU 이력 확인 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#120",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5. 결론 및 시사점",
    "text": "Roldan Mendoza는 MOSB 팀의 **현장 물류 운영 핵심 실무자**로, 외부 협력사(DSV, Alphamed, UPC 등)와 내부 현장팀(MIR, SHU) 사이의 **실시간 조율자** 역할을 담당한다.\n\n- **게이트 패스 + 트레일러 배차 + BL 처리**가 일상 업무의 3대 축\n- DSV Jay의 오퍼레이션 승인권자로 기능하는 등 단순 실무를 넘어 **의사결정 권한** 보유\n- 부재 시 물류 추적 및 현장 오퍼레이션에 즉각적 공백 발생\n- 업무 특성상 **인수인계 절차 및 백업 담당자 지정**이 필요함\n\n---\n\n*본 문서는 WhatsApp 원본 채팅 및 채널 Guideline 문서를 직접 분석하여 작성되었습니다.*\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#121",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6. E2E 물류 프로세스 포지션 (온톨로지 기반)",
    "text": "> 본 섹션은 `CONSOLIDATED-00-master-ontology.md` Milestone M10~M160 및 RoutingPattern 체계 기준.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#122",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-1. 담당 구간 (Milestone)",
    "text": "| 마일스톤 | 이름 | Roldan 역할 |\n|----------|------|------------|\n| **M121** | Dispatched | kEn/창고에서 인수인계 받아 MIR/SHU 현장 배송 개시 확인 |\n| **M130** | Site Arrived | 트레일러 현장 도착 확인 및 하역 준비 조율 |\n| **M131** | Site Inspected — Good | 현장 수령 검수 완료 (정상) 보고 |\n| **M132** | Site Inspected — OSD | 이상 발생(Over/Short/Damage) 보고 및 클레임 트리거 |\n| **M140** | POD / GRN / Handover | 현장 인수인계 서류 처리 및 Back-Load 준비 |\n\n**담당 Journey Stage**: `WH_DISPATCH`(인수) → `SITE_RECEIVING` → `MATERIAL_ISSUE` → `CLOSEOUT`(Back-Load)",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#123",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-2. RoutingPattern별 영향",
    "text": "| RoutingPattern | Roldan 역할 변화 |\n|---------------|----------------|\n| `DIRECT` (Port → Site) | Arvin 통관 직후 M130부터 Roldan이 처리 |\n| `WH_ONLY` (Port → WH → Site) | kEn M121 Dispatch 후 M130 인수 |\n| `MOSB_DIRECT` / `WH_MOSB` | Haitham 해상 구간 후 M130 현장 인수 |\n| Back-Load (역방향) | M140 후 잉여 자재 창고 반환 — Roldan이 트레일러 준비 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#124",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-3. 온톨로지 책임 클래스",
    "text": "`SiteReceipt` · `DeliveryConfirmation(POD/GRN)` · `Exception(OSD/Damage)` · `BackloadEvent` · `BL(Back-Load용 운송 서류)`",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#125",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6-4. 상위 맥락에서의 위치",
    "text": "Roldan은 **E2E 물류의 최종 수령자이자 현장 품질 관리자**다. M131/M132 검수 결과가 `Exception` 데이터로 기록되며, M132 OSD 발생 시 M150 Claim이 트리거된다. 그의 부재 또는 보고 공백은 온톨로지상 `DeliveryStatus` 업데이트 중단을 의미하며, 이는 Cost Guard(M160 Cost Close)까지 전체 CLOSEOUT 체인을 블로킹한다. Back-Load 조율까지 책임지는 순환 물류 역할로서, 프로젝트 물류 비용 최적화에도 직접 기여한다.\n\n---\n\n<!-- 2026-04-27-dialogue-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#126",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "7. 2026-04-27 전체 대화 기반 보강",
    "text": "> 기준 자료: `individual_reports_from_dialogue/Roldan_전체대화_상세업무_분석.md`\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 직접 식별 발화 수 | 6,743건 |\n| 채널별 활동량 | Abu Dhabi Logistics 5,808건, HVDC Project Lightning 600건, DSV Delivery 185건, MIR Logistics 108건, SHU Logistics 42건 |\n| 대화 기준 상위 업무 신호 | 보고·조율·Follow-up, 현장 수령·배송·Backload, 해상·MOSB·LCT 운영 |\n| 메인 업무 재확인 | 현장 차량 입차, 배송 실행, 수령 확인, Backload·CCU 회수 실행 담당자 |\n| 역할 경계 | Roldan은 현장 실행과 수령 확인을 맡는다. Arvin은 문서 기반 Exit Pass와 통관 조건, kEn은 창고·dispatch, Haitham은 MOSB 해상 구간을 맡는다. |\n| 지연 영향 | Roldan이 지연되면 현장 도착, POD/GRN, Backload 상태가 끊겨 closeout 판단이 늦어진다. |\n\n검증 메모: 이 보강은 `Roldan_전체대화_상세업무_분석.md`의 전체 대화 파싱 결과를 기존 주요업무 문서에 연결한 것이다. 기존 문서의 상세 원문 증거는 유지하고, 발화 수와 역할 경계를 최신 분석 기준으로 보강했다.\n<!-- 2026-04-27-dialogue-sync-end -->\n\n<!-- 2026-04-27-fmc-org-ontology-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#127",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 FMC 조직도 및 ontology 반영 보강",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`, `../ontology/ontology_00_01_role_process_reflection_report_2026-04-27.md`\n> 개인정보 처리: 사용자 지시에 따라 조직도 JSON의 이메일은 삽입한다. 전화번호는 이 문서에 복사하지 않는다.\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 조직도 실명 | Roldan Mendoza |\n| 조직도 직책 | Logistics Officer |\n| 조직도 SITE | MUSSAFAH |\n| 조직도 이메일 | rb***@samsung.com |\n| 대화·문서 표기 | Roldan, DaN |\n| ontology ActorRole 제안 | `SiteReceivingCoordinator` |\n| 연결 milestone | M100 Gate-out, M130 Site Arrived, M131/M132 Site Inspected, M140 POD / GRN / Handover, M150 Claim Opened |\n| 역할 경계 고정 | Roldan은 현장 입차, 현장 수령, Backload·CCU 회수 실행 담당자다. Arvin은 문서 기반 Exit Pass와 통관 조건, kEn은 창고·dispatch를 맡는다. |\n| ontology 반영 위치 | CONSOLIDATED-00 SiteReceipt/Delivery/BackloadEvent/Exception 책임 예시 |\n\n검증 판단: `Roldan` 문서는 FMC 조직도 실명·직책과 연결되며, ontology 00/01에는 개인 이름을 핵심 클래스가 아니라 `SiteReceivingCoordinator` 역할 예시 또는 evidence instance로 반영하는 것이 적절하다.\n<!-- 2026-04-27-fmc-org-ontology-sync-end -->\n\n<!-- 2026-04-27-duckdb-verification-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#128",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "9. 2026-04-27 DuckDB 검증",
    "text": "> 기준 자료: `email_search.duckdb` (OUTLOOK_HVDC_ALL_202409202510.xlsx 기반)\n> 쿼리 기준: SenderName/SenderEmail/RecipientTo/Subject/PlainTextBody에서 handle 또는 이메일 검색",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#129",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 쿼리 결과",
    "text": "| 항목 | 결과 |\n|------|------|\n| **총 메시지 수 (handle 포함)** | 0건 (DuckDB body에 \"DaN\" 텍스트 미검출) |\n| **직접 이메일 기준 메시지 수** | 1,563건 (rb***@samsung.com 기준) |\n| **검색 기간** | Excel 일련번호 기준 (2025년 중반 ~ 2026년 초) |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#130",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "사이트별 분포 (이메일 기준)",
    "text": "| 사이트 | 언급 횟수 | 비고 |\n|--------|-----------|------|\n| AGI | 다수 | HVDC 프로젝트 주요 현장 |\n| MOSB | 다수 | Marine Offshore Supply Base |\n| DAS | 다수 | Das Island 현장 |\n| MIR | 일부 | Mirfa 현장 |\n| SHU | 일부 | Shuweihat 현장 |\n| DSV | 일부 | DSV Delivery 조율 |\n| Jopetwil | 일부 | Jopetwil 71 선박 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#131",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "LPO 언급 (DuckDB body 기준)",
    "text": "이메일 본문에서 LPO 관련 언급 다수 확인 — LPO-2701, LPO-2636, LPO-2507, LPO-1533 등 프로젝트 LPO 번호 체계와 관련",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#132",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "관련 회사 (DuckDB 본문 기준)",
    "text": "| 회사 | 언급 빈도 |\n|------|-----------|\n| DSV | 다수 |\n| SCT Logistics | 다수 |\n| Alphamed | 일부 |\n| Altrad | 일부 |\n| UPC | 일부 |\n| GRM | 일부 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#133",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "최근 이메일 제목 (직접 이메일 기준 상위 5건)",
    "text": "- Reminder !!: [HVDC] - AGI - SKM - Certificate Revision Required\n- Request for gate pass for collection of cement bulker\n- RE: [HVDC-SCT] HVDC-AGI-ALS-403 / Request for Shipment Transportation to AGI\n- RE: [HVDC-AGI-ALS-399] / AGI Shipment - Packing List - Completed\n- [MOSB] Shafeek Timesheet 관련 메일",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#134",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 검증 판단",
    "text": "DuckDB 이메일 데이터는 Outlook HVDC 통합 파일 기반으로, Roldan(DaN)의 WhatsApp 대화 분석 결과와 상호 보완적이다. 이메일 데이터는 외부 협력사(DSV Jay, Alphamed, SCT Logistics)와의 공식 커뮤니케이션 창구로 활용되며, WhatsApp 대화 데이터는 현장 운영 조율의 실시간 증거를 제공한다. 이메일 기반 실명(rb***@samsung.com) 검색 결과 1,563건은 프로젝트 기간 전체의 공식 기록을 뒷받침한다.\n\n> ⚠️ 주의: DuckDB body에서 \"DaN\" handle 텍스트가 0건인 것은 WhatsApp 대화 원본이 이메일 데이터에 포함되지 않았기 때문이다. 이메일은 공식 의사결정 기록이고, WhatsApp은 실시간 운영 조율 채널이다. 양쪽 데이터를 병행 분석해야 완전한 업무 프로파일이 완성된다.\n<!-- 2026-04-27-duckdb-verification-end -->\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#135",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: WhatsApp 원본 대화, `individual_reports_from_dialogue/ronpap20_전체대화_상세업무_분석.md`, FMC 조직도, DuckDB 이메일 분석\n> 작성일: 2026년 4월 27일\n> 병합 기준: `Ronnel_주요업무_분석.md`와 `ronpap20_주요업무_분석.md`는 동일 인물 문서이므로 본 문서로 통합\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#136",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. 기본 정보",
    "text": "| 항목 | 내용 |\n|------|------|\n| **조직도 실명** | Ronnel Papa Initan |\n| **문서 대표명** | Ronnel |\n| **채팅 핸들 / 별칭** | `ronpap20`, `Ronnel` |\n| **직책** | Logistics Officer |\n| **SITE** | MUSSAFAH |\n| **이메일** | p.***@samsung.com |\n| **직속 보고라인** | 상욱 / Shariff |\n| **주요 협력자** | Jhysn, Roldan, kEn, Haitham, Karthik, DSV Jay, Dsv Minhaj |\n| **핵심 역할** | VP24 담당, VP24 lifting·stuffing·offloading, crane/forklift 상태 확인, 작업 진행률 보고 |\n| **ontology ActorRole 제안** | `FieldHandlingSupport` |\n\n> **동일 인물 정리**:\n> - `Ronnel`과 `ronpap20`은 동일 인물 Ronnel Papa Initan을 가리킨다.\n> - 기존 `ronpap20_주요업무_분석.md`의 원문 근거와 감지 건수는 본 문서에 흡수한다.\n> - 이후 개인별 업무 문서는 본 `Ronnel_주요업무_분석.md`를 대표 문서로 사용한다.\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#137",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-1. VP24 현장 작업 담당 ★메인 업무",
    "text": "Ronnel/ronpap20은 VP24 담당자다. VP24 현장에서 lifting, stuffing, offloading, 장비 준비 상태를 확인하고 작업 진행률을 팀에 보고한다.\n\n- VP24 현장 작업 위치와 화물 상태 확인\n- VP24 lifting, stuffing, offloading 진행률 보고\n- crane/forklift/lifting team 준비 상태 확인\n- Jhysn의 MOSB(VP24) 현장 감독에 필요한 작업 상태 제공",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#138",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-2. VP24 현장 양중(lifting) 및 야드 작업 확인 ★핵심",
    "text": "Ronnel은 VP24에서 자재 lifting, offloading, shifting, crane/forklift 상태를 반복 확인한다. 감지 건수는 1,158건이다.\n\n- VP24 적재 위치 확인 및 lifting 가능 상태 점검\n- VP24 FLIFT 이동 및 cladding offloading 시작 보고\n- HCS/A-Frame stuffing 완료 보고\n- 3-head trailer, SANY crane, forklift 준비 상태 확인\n- crane/forklift 가동 가능 여부 확인\n- lifting 진행률을 Jhysn, Roldan, kEn에게 공유",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#139",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-3. VP24 Container stuffing/offloading 조율",
    "text": "VP24 현장에서 container stuffing과 offloading 진행률을 확인한다.\n\n- Container 도착 일정 확인 및 공유\n- Stuffing/offloading 작업 진행률 보고\n- 작업 완료 후 현장 정리 상태 확인\n- container, basket, A-frame 작업 진행률 공유",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#140",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-4. MOSB·LCT 작업 보조",
    "text": "MOSB·LCT 운영 신호도 1,144건으로 높다. 단독 선박 운항이나 MOSB 전체 감독 담당은 아니며, VP24 현장 작업 상태를 보조적으로 연결한다.\n\n- JPT62 등 선적·이동 예정 공유\n- VP24에서 MOSB 작업 준비 상태 보고\n- remaining material shifting 확인\n- Haitham의 LCT/MOSB 운영에 필요한 현장 진행률 보조",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#141",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-5. TPI/TUV·장비·Webbing Sling 확인",
    "text": "검사·장비 신호가 993건이다. 특히 webbing sling 회수, reuse, backload 요청이 반복된다.\n\n- AGI 팀에 webbing sling 반납 요청\n- damaged sling 사용 여부 확인\n- HCS 478/471 collection readiness 확인\n- forklift/crane/lifting team 준비 상태 확인\n- Backload 진행 상황을 Roldan/kEn에게 전달",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#142",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-6. 현장 안전 및 작업 상태 증빙 보고",
    "text": "Ronnel은 현장 장비와 작업 안전 상태를 사진·짧은 보고로 공유한다.\n\n- forklift/crane 안전 점검 결과 보고\n- 현장 작업 사진 촬영 및 팀 공유\n- 안전 이슈 발생 시 즉각 보고\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#143",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. 업무 중요도 매트릭스",
    "text": "| 순위 | 업무 영역 | 반복도 | 영향 | 비고 |\n|------|----------|--------|------|------|\n| **1** | **VP24 현장 작업 담당** | **매우 높음** | **매우 높음** | VP24 작업 진행률과 장비 상태에 직접 영향 |\n| **2** | **VP24 현장 양중 및 야드 작업 확인** | **매우 높음** | **매우 높음** | MOSB 적재 전 VP24 lifting·사진 증빙 |\n| **3** | **VP24 Container stuffing/offloading 조율** | **매우 높음** | **높음** | VP24 container 작업 |\n| **4** | **해상·MOSB·LCT 작업 보조** | **매우 높음** | **높음** | MOSB 작업 연결 정보 제공 |\n| **5** | **TPI/TUV·장비·Webbing Sling 확인** | **높음** | **높음** | lifting·재사용 장비 확보에 영향 |\n| **6** | **현장 안전·작업 상태 증빙 보고** | **높음** | **높음** | 안전 확보 및 팀 가시성 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#144",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. 다른 팀원과의 역할 경계",
    "text": "| 중복처럼 보이는 업무 | Ronnel / ronpap20의 실제 범위 | 다른 담당자와의 경계 |\n|--------------------|-------------------------------|----------------------|\n| VP24 현장 작업 | VP24 lifting, stuffing, offloading, 장비 상태 확인 | Jhysn은 MOSB(VP24)에서 AGI/DAS 향 화물의 현장 감독 |\n| 현장 수령 | VP24 작업 상태와 수령 증빙 보조 | Roldan은 현장 수령 책임과 POD/GRN 연결 |\n| Yard 작업 | VP24에서 offloading·stuffing 진행률 확인 | kEn은 창고·dispatch 실행 관리 |\n| 해상·MOSB | VP24 작업 연결 정보 제공 | Haitham은 LCT, vessel, MOSB 선적 운영 담당. Jhysn은 MOSB(VP24) 현장 감독 |\n| Gate Pass | SANY crane 등 일부 gate pass 요청 정보 제공 | Arvin은 exit pass 이메일, Roldan은 실제 입차 준비 |\n| 서류 | 단독 서류 담당 아님 | Arvin은 해외 inbound 서류, Karthik은 국내 LPO PL/DN/MTC 담당 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#145",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5. E2E 물류 프로세스 포지션",
    "text": "> 본 섹션은 CONSOLIDATED-00-master-ontology.md Milestone M10~M160 체계 기준.\n\n| 구간 | Ronnel / ronpap20 역할 |\n|------|------------------------|\n| **M100 Gate-out Completed** | 일부 exit/gate pass 요청 정보 제공 |\n| **M110 WH Received** | 창고 입고·현장 수령 상태 확인 보조 |\n| **M115 MOSB Staged** | VP24 작업 준비 상태 확인 |\n| **M116 Loaded 보조** | VP24 stuffing, lifting, A-Frame/HCS 작업 상태 보고 |\n| **M120 Picked/Staged** | forklift/crane/lifting team readiness 확인 |\n| **M130 Site Arrived** | 수령 evidence와 damage/bent 여부 확인 |\n| **M131 Site Inspected Good** | 검수 완료 상태 보조 확인 |\n| **M132 Site Inspected OSD** | 이상 상태 발견 시 보고 |\n| **M140 Backload 보조** | webbing sling, reusable lifting gear 회수 요청 |\n\n**담당 Journey Stage**: SITE_HANDLING → RECEIVING → BACKLOAD_SUPPORT",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#146",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "RoutingPattern별 영향",
    "text": "| RoutingPattern | 역할 변화 |\n|----------------|-----------|\n| `DIRECT` | VP24 작업이 연결될 때 lifting/offloading 보조 |\n| `WH_ONLY` | VP24 작업이 연결될 때 창고 출고·현장 수령 보조 |\n| `MOSB_DIRECT` | M115~M140 중 VP24 lifting/stuffing/offloading 상태 보고 |\n| `WH_MOSB` | M115~M140 중 VP24 작업 상태 보고 |\n| `MIXED` | VP24 lifting/stuffing/offloading 구간 담당 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#147",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "온톨로지 책임 클래스",
    "text": "`SiteHandling` · `LiftingEvent` · `StuffingEvent` · `BackloadEvent` · `EquipmentStatusReport` · `EquipmentResource`\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#148",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6. 원문 근거",
    "text": "> `HVDC Project Lightning` 25/1/23 PM 4:04 line 5743: `here are the evidence that we received without bent`\n\n> `HVDC Project Lightning` 25/6/22 AM 10:24 line 13694: `Already inspected ready for collection esp. HCS 478 & 471.`\n\n> `HVDC Project Lightning` 25/8/8 AM 7:23 line 16568: `VP24 FLIFT shifted VP24. Now start cladding offloading activity.`\n\n> `Abu Dhabi Logistics` 24/11/28 PM 5:09 line 11397: `VP-24 ... HCS-STUFFING for 4 BA-COMPLETED`\n\n> `HVDC Project Lightning` 25/7/31 PM 5:16 line 16072: `AGI Team Please Backload for 6t X 6m webbing sling`\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#149",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "7. 부재 또는 지연 시 영향",
    "text": "Ronnel / ronpap20이 없으면 VP24의 lifting, stuffing, offloading, webbing sling 회수 상태가 늦게 올라온다. Jhysn은 MOSB(VP24) 현장 감독에 필요한 VP24 작업 진행률을 다시 확인해야 하고, Roldan과 kEn도 현장 상태를 재확인해야 한다.\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#150",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "8. FMC 조직도 및 ontology 반영 보강",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`, `../ontology/ontology_00_01_role_process_reflection_report_2026-04-27.md`\n> 개인정보 처리: 이메일은 삽입한다. 전화번호는 이 문서에 복사하지 않는다.\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 조직도 실명 | Ronnel Papa Initan |\n| 조직도 직책 | Logistics Officer |\n| 조직도 SITE | MUSSAFAH |\n| 조직도 이메일 | p.***@samsung.com |\n| 대화·문서 표기 | Ronnel / ronpap20 |\n| ontology ActorRole 제안 | `FieldHandlingSupport` |\n| 연결 milestone | M100, M115, M116, M120, M130, M131, M132, M140 |\n| 역할 경계 고정 | Ronnel/ronpap20은 VP24 담당자다. VP24 lifting, stuffing, offloading, equipment readiness를 확인한다. |\n| ontology 반영 위치 | CONSOLIDATED-00 WarehouseEvent/TransportEvent/EquipmentResource의 verifiedBy 예시 |\n\n검증 판단: Ronnel Papa Initan은 `Ronnel`과 `ronpap20` 두 표기로 나타나는 동일 인물이다. ontology 00/01에는 개인 이름을 핵심 클래스가 아니라 `FieldHandlingSupport` 역할 예시 또는 evidence instance로 반영하는 것이 적절하다.\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#151",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "9. DuckDB 기반 검증 블럭",
    "text": "> DuckDB: `email_search.duckdb` | 기준: emails 테이블 | 쿼리 기준: SenderEmail 또는 RecipientTo 또는 Cc에 이메일 포함",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#152",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 이메일 통계",
    "text": "| 항목 | 결과 |\n|------|------|\n| **총 이메일 수** | 104~108건 |\n| **활성 Sites** | DAS 일부 확인 |\n| **LPO 관련 이메일** | 0건 |\n| **관련 Companies** | Samsung |\n| **데이터 범위** | 2025-04-06 ~ 2026-02-10 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#153",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "Body 키워드 빈도",
    "text": "| 키워드 | 확인 결과 |\n|--------|-----------|\n| `Trailer` | 41건 |\n| `Stuffing` | 40건 |\n| `DSV` | 8~9건 |\n| `Container` | 6건 |\n| `BL` | 3~4건 |\n| `Delivery` | 3건 |\n| `Inspection` | 2건 |\n| `CCU` | 2건 |\n| `DO` | 1~2건 |\n| `Gate Pass` | 1건 |\n| `Backload` | 1건 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#154",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "역할 검증",
    "text": "| 검증 항목 | 결과 | 판단 |\n|-----------|------|------|\n| 통관/문서 시그니처 | DO/BL 일부 확인. BOE/MSDS/FANR/MOIAT 미확인 | 보조 근거 |\n| 현장/창고 시그니처 | Delivery, Gate Pass 일부 확인. LPO 0건 | 보조 근거 |\n| 외부 파트너 시그니처 | DSV 8~9건 | 보조 근거 |\n| 현장 handling 시그니처 | Trailer 41건, Stuffing 40건, Container 6건, CCU 2건 | 핵심 근거 |\n\n**역할 판단**: DuckDB 이메일 근거는 제한적이므로 보조 근거로만 사용한다. Ronnel / ronpap20의 `FieldHandlingSupport` 역할 판단은 WhatsApp 원문과 VP24 작업 증빙을 주 근거로 한다.\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#155",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "10. 결론",
    "text": "Ronnel Papa Initan, `Ronnel`, `ronpap20`은 같은 사람이다. 이 인물은 문서 담당자가 아니라 **VP24 담당자**다. 특히 VP24의 HCS/A-Frame, crane/forklift, webbing sling, stuffing/offloading 상태를 팀에 연결한다.\n\n---\n\n*본 문서는 기존 `Ronnel_주요업무_분석.md`와 `ronpap20_주요업무_분석.md`를 하나로 통합한 최종 개인 업무 문서다.*\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#156",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: `individual_rev` 개인별 주요업무 문서 + `CONSOLIDATED-00-master-ontology.md` / `CONSOLIDATED-01-core-framework-infra.md` Milestone M10~M160 체계\n> 작성일: 2026년 4월 27일\n> **팀장**: 상욱 / Shariff (동일인 — 물류팀 팀장)\n> **동일 인물 정리**: Ronnel = ronpap20 = Ronnel Papa Initan. 대표 문서는 `Ronnel_주요업무_분석.md`.\n> ⚠️ 김국일: 퇴사 (문서 내 채팅 인용은 역사적 증거로만 보존)\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#157",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. E2E 구간별 책임자 맵",
    "text": "```\n[팀장 Overlay] → M10~M160 ★ 정상욱/상욱/Shariff (전체 감독·승인·의사결정)\n       ↓\n[해외 공급업체/포워더] → 해외 inbound 선적 서류\n       ↓\n[UAE 입항 · 통관] → M80~M92 ★ Arvin (해외 BOE/DO/MSDS/FANR/MOIAT/EC/BL)\n       ↓\n[국내 LPO 문서 준비] → M10~M30 ★ Karthik (국내 LPO/PL/DN/MTC)\n       ↓\n[자재 현황·Vendor·기성 검토] → M50~M130 / M160 ★ 차민규 (자재 현황, 청구서 확인, 업체 기성 지급 검토)\n       ↓\n[창고 입고·보관·출고] → M100~M121 ★ kEn (LPO/WarehouseTask)\n       ↓ (WH_MOSB/MOSB_DIRECT 패턴)\n[MOSB 해상 구간] → M115~M117 ★ Haitham (SR/LCT/RORO/LOLO)\n       ↓\n[MOSB(VP24) 현장 감독] → AGI/DAS 향 화물, container stuffing, MOSB 야외 창고 ★ Jhysn\n       ↓\n[VP24 담당] → VP24 lifting/stuffing/offloading, crane/forklift 상태 ★ Ronnel/ronpap20\n       ↓\n[현장 수령·검수·인수인계] → M130~M140 ★ Roldan (Site/POD/GRN/Backload)\n       ↓\n[비용 정산 완료] → M160 ★ 차민규 검토 + 정상욱 승인 / Finance Human-gate\n```\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#158",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2. 마일스톤별 책임 매트릭스",
    "text": "| 마일스톤 | 이름 | 주 책임 | 보조·증빙·검토 |\n|---------|------|---------|----------------|\n| M10 | Cargo Ready | Karthik | 정상욱 감독, 차민규 vendor 상태 확인 |\n| M20 | Packed / Marked | Karthik | 차민규 vendor PL 취합 보조 |\n| M30 | Pickup Completed | Karthik | Roldan/Jhysn/Ronnel 현장 정보 보조 |\n| M50 | Terminal Received | 차민규 | 정상욱 감독 |\n| M80 | ATA (입항) | Arvin | 정상욱 감독 |\n| M90 | BOE Submitted | Arvin | 정상욱 감독 |\n| M91 | BOE Cleared | Arvin | 정상욱 승인·감독 |\n| M92 | DO Released | Arvin | Roldan 현장 입차 준비 |\n| M100 | Gate-out | Arvin / Roldan / Karthik | kEn 배차 확인, Jhysn MOSB(VP24) 현장 차량·container 식별, Ronnel VP24 일부 gate pass 요청 정보 |\n| M110 | WH Received (WH In) | kEn | Karthik PL/DN/MTC 선행자료, Haitham SR 제출, 차민규 자재 현황 확인 |\n| M111 | Put-away | kEn | 정상욱 감독 |\n| M115 | MOSB Staged | Haitham | Jhysn은 MOSB(VP24) AGI/DAS 향 화물·야외 창고 현장 감독, Ronnel/ronpap20은 VP24 작업 상태 보고 |\n| M116 | LCT/Barge Loaded | Haitham | Jhysn은 container stuffing 감독, Ronnel/ronpap20은 VP24 stuffing·lifting 상태 보고 |\n| M117 | Sail-away Approved | Haitham | 정상욱 감독, Jhysn MOSB(VP24) 현장 상태 확인 |\n| M120 | Picked / Staged | kEn | Jhysn은 MOSB(VP24) staged 상태 감독, Ronnel/ronpap20은 VP24 stuffing/offloading/lifting 진행률 확인 |\n| M121 | Dispatched | kEn | Roldan 인수 대기 |\n| M130 | Site Arrived | Roldan | Jhysn은 AGI/DAS 출고 전 MOSB(VP24) 상태 증빙, Ronnel/ronpap20은 VP24 작업 완료 증빙 |\n| M131 | Site Inspected (Good) | Roldan | Jhysn MOSB(VP24) 출고 상태 증빙, Ronnel VP24 작업 증빙 |\n| M132 | Site Inspected (OSD) | Roldan | Jhysn MOSB(VP24) damage/bent 상태 감독, Ronnel VP24 작업 상태 보고 |\n| M140 | POD / GRN / Backload | Roldan | Ronnel/ronpap20 webbing sling 등 reusable gear 회수 요청, Jhysn MOSB 야외 창고 상태 확인, kEn 재고 이력 |\n| M150 | Claim Opened | Roldan | Arvin SIM claim, 정상욱 감독 |\n| M160 | Cost Closed | 차민규 검토 / 정상욱 승인 | Finance Human-gate, Invoice·기성 지급 증빙 확인 |\n\n> ★ = 주 책임자 / ◎ = 보조 또는 연관 역할\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#159",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. RoutingPattern별 팀원 관여도",
    "text": "| RoutingPattern | 주 책임 흐름 | 보조·검토 |\n|----------------|--------------|-----------|\n| `DIRECT` | Arvin M90~92 → Roldan M130~140 | Karthik 국내 LPO 문서, Material Management 자재·vendor·M160 검토 |\n| `WH_ONLY` | Arvin M90~92 → kEn M110~121 → Roldan M130~140 | Karthik PL/DN/MTC, 차민규 자재 현황, Jhysn/Ronnel 현장 증빙 |\n| `MOSB_DIRECT` | Arvin M90~92 → Haitham M115~117 → Roldan M130~140 | Jhysn은 MOSB(VP24) AGI/DAS 향 화물 현장 감독, Ronnel/ronpap20은 VP24 작업상태 보고, 정상욱 감독 |\n| `WH_MOSB` | Arvin M90~92 → kEn M110~120 → Haitham M115~117 → Roldan M130~140 | Karthik DSV 야드 복구, 차민규 vendor·기성 검토, Jhysn은 MOSB 야외 창고·stuffing 감독, Ronnel은 VP24 담당 |\n| `MIXED` | 정상욱이 상황별 책임 경로 확정 | 각 담당자는 자기 milestone 증빙만 책임지고, 차민규는 비용·기성 검토를 M160에 연결 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#160",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. 업무 영역 비교표",
    "text": "| 인물 | 도메인 | 핵심 산출물 / 확인값 | E2E 위치 |\n|------|--------|----------------------|----------|\n| 정상욱 / 상욱 / Shariff | 팀장 overlay | 전체 운영 지시, 승인, vessel/backload coordination | M10~M160 전체 감독 |\n| 차민규 / Minkyu | Material Management | 자재 현황, vendor coordination, 청구서 확인, 업체 기성 지급 검토 | M50~M130 + M160 |\n| Arvin | 해외 inbound 서류·통관 | BOE, DO, MSDS, FANR, MOIAT, EC, BL(Bill of Lading) | M80~M92 |\n| Karthik | 국내 LPO 중심 서류 | 국내 LPO, PL, DN, MTC, Revised PL, Gate Pass | M10~M30/M100 |\n| kEn / Ken | 창고·LPO 실행 | LPO 실행현황, WH Receipt, dispatch instruction | M100~M121 |\n| Haitham | 선박·MOSB | SR, LCT 위치보고, 선적완료, MOSB staging | M115~M117 |\n| Roldan / DaN | 현장 수령·Backload | POD, GRN, Backload, CCU 회수, OSD trigger | M130~M150 |\n| Jhysn / Jhason / Jason | MOSB(VP24) 현장 감독 | AGI/DAS 향 화물 현장 감독, container stuffing, MOSB 야외 창고 관리, exit pass 요청 정보 | M100/M115/M116/M120/M130/M140 감독·보조 |\n| Ronnel / ronpap20 | VP24 담당 | VP24 lifting, stuffing, offloading, crane/forklift 상태, webbing sling 회수 | M115/M116/M120/M130/M140 보조 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#161",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-1. 중복 영역 (정상적 협력)",
    "text": "| 중복 업무 | 담당자 1 | 담당자 2 | 조율 방법 |\n|-----------|---------|---------|----------|\n| Gate/Exit Pass 처리 | Arvin (이메일 발송) | Roldan/kEn/Karthik (현장·창고·SCT 건별 실행) | Arvin은 문서 발송, Roldan은 MOSB 입차 준비, kEn은 창고·현장 실행, Karthik은 SCT/DSV 야드 Gate Pass 조율 |\n| LPO 처리 | kEn (창고·현장 실행 보고) | Karthik/Roldan (국내 LPO 서류·장비 LPO) | kEn은 운영표, Karthik은 국내 LPO 기반 PL/DN/MTC와 vendor status, Roldan은 장비 렌탈 LPO·timesheet |\n| TPI 문서 관리 | Arvin (추적·요청) | Haitham/kEn/Roldan (검사·납기·갱신 행정) | Arvin은 문서 추적, Haitham은 현장 검사, kEn은 Webbing Sling 납기, Roldan은 장비 TPI 갱신 SR |\n| 선적 트래킹 보고 | Arvin (해외·통관) | Haitham (선박·MOSB) | 구간별 분리 (통관 vs 해상) |\n| BL 용어 | Arvin (Bill of Lading) | Roldan/kEn (Backload) | Arvin 문서의 BL은 선하증권, Roldan/kEn 문서의 BL은 Backload로 구분 |\n| DSV Follow-up | Arvin (해외 inbound 통관·서류 조건 조율) | kEn/Roldan (창고·현장 실행) | Arvin은 DSV Minhaj와 해외 서류 미완료 건을 조율하고, kEn/Roldan은 출고·배송·수령 실행을 담당 |\n| DSV 야드 자재 복구 | Karthik (damaged box/HE case 수리 확인) | kEn/Roldan (창고 위치·현장 배송) | Karthik은 수리 확인과 delivery permission, kEn은 창고 상태 보고, Roldan은 현장 배송·수령 |\n| SR 처리 | Haitham (WELLS ID 기반 운영 SR) | Roldan/Karthik (장비·소모품·Gate Pass성 행정) | Haitham은 해상·창고 운영 SR, Roldan은 장비·소모품 SR/PR, Karthik은 Gate Pass 성격의 서비스 요청 보조 |\n| Delivery Coordination | Roldan (실제 배송 실행·수령 확인) | Arvin/kEn/Karthik (해외 통관·창고·국내 LPO 서류 선행 처리) | Arvin은 해외 통관·DSV 요청, kEn은 창고 출고 지시, Karthik은 국내 LPO 기반 PL/DN/MTC 제공, Roldan은 현장 수령 확인 |\n| Backload/CCU | Roldan (회수·반납·수거 실행) | kEn/Haitham (재고 보고·이력 확인) | Roldan은 Backload 운송과 폐기물 CCU 수거, kEn은 BL Laydown 보고, Haitham은 MOSB 작업 중 CCU 이력 확인 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#162",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-2. 잠재적 공백 (리스크)",
    "text": "| 공백 영역 | 문제 상황 | 권장 커버 |\n|-----------|---------|----------|\n| kEn 부재 시 LPO 처리 | 창고 협력사 작업 불가 | 상욱/Shariff가 긴급 LPO 승인 |\n| Karthik 부재 시 국내 LPO PL/DN/MTC 취합 | PL 없이는 un-stuffing 및 MRR 생성이 지연되고 국내 vendor 연락 창구가 공백화됨 | Khemlal(SCT)을 1차 백업으로 지정하고 국내 LPO vendor 연락처·PL tracker를 공유 |\n| Arvin 부재 시 통관 | BOE/DO 처리 전면 중단 | 사전 위임 절차 필요 |\n| Haitham 부재 시 선박 트래킹 | MOSB 계획 시야 상실 | Khemlal(SCT) 임시 대행 |\n| Roldan 부재 시 현장 수령·Backload | 현장 도착·검수·Backload 데이터가 끊김 | kEn/Nicole/Site team 기준 인수인계표 운영 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#163",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6. 온톨로지 클래스 책임 요약",
    "text": "| 온톨로지 클래스 | 주 담당자 |\n|----------------|---------|\n| `ActorRole.LogisticsTeamLeader` · `ApprovalAction` | **정상욱/상욱/Shariff** |\n| `MaterialMaster` · `Shipment` · `MilestoneEvent` | **차민규** 자재 현황 관리 |\n| `Invoice` · `InvoiceLine` · `CostTransaction` · `CostGuardResult` | **차민규** 청구서 확인·업체 기성 지급 검토 / **정상욱** 승인 |\n| `CustomsEntry` · `BOE` · `DO` | **Arvin** |\n| `PermitApplication` (FANR/MOIAT/EC) | **Arvin** |\n| 국내 `PackingList` · `DeliveryNote(DN)` · `MaterialTransferCertificate(MTC)` | **Karthik** |\n| `Container(CCU)` · `ServiceRequest(Gate Pass)` · `WarehouseTask(현장 검증)` | **Karthik** |\n| `WarehouseTask` · `WarehouseHandlingProfile` | **kEn** |\n| `LPO (LocalPurchaseOrder)` | **kEn** 실행 주 담당 / **Karthik** 국내 LPO 서류·vendor status / **Roldan** 장비 렌탈 LPO |\n| `ServiceRequest (SR)` · `MarineEvent` · `LCT` | **Haitham** 주 담당 / **Roldan** 장비·소모품 SR/PR 행정 |\n| `MilestoneEvent.M115~M117` | **Haitham** |\n| `SiteReceipt` · `POD` · `GRN` · `BackloadEvent` | **Roldan** |\n| `Exception (OSD/Damage)` → `Claim` | **Roldan** |\n| `FieldEvidence` · `CommunicationEvent` · `EquipmentStatusReport` | **Jhysn** MOSB(VP24) 현장 감독 증빙 / **Ronnel/ronpap20** VP24 handling 증빙 |\n| `OffshoreStaging` · `LaydownArea` · `StuffingEvent` | **Jhysn** MOSB 야외 창고·container stuffing 감독 |\n| `LiftingEvent` · `StuffingEvent` · `EquipmentResource` | **Ronnel/ronpap20** VP24 작업 담당 |\n\n---\n\n*본 문서는 `individual_rev`의 개인별 주요업무 문서 9개와 온톨로지 00/01 문서를 기준으로 통합 작성되었습니다.*\n\n<!-- 2026-04-27-10person-update -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#164",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "7. 2026-04-27 통합 역할 반영",
    "text": "> 기준 자료: `individual_rev` 개인별 주요업무 문서 + duckdb_query_results.json\n\n| 인물 | 추가 반영된 핵심 역할 | 기존 5명과의 경계 |\n|------|----------------------|------------------|\n| Jhysn | MOSB(VP24)에서 AGI/DAS 향 모든 화물의 현장 감독, container stuffing, MOSB 야외 창고 관리 | Ronnel/ronpap20은 VP24 담당, Haitham은 LCT/MOSB 해상 운영, Roldan은 최종 현장 수령 책임 |\n| Ronnel/ronpap20 | VP24 담당 — VP24 lifting, stuffing, offloading, forklift/crane 상태 확인 | Jhysn은 MOSB(VP24) 현장 감독, Roldan은 최종 현장 수령 책임, kEn은 창고 운영 |\n| 정상욱(Sanguk) | Team Lead overlay — 전체 팀 운영, vessel movement report, backload coordination | 상욱/Shariff 동일인으로서 물류팀 팀장 직무 전결 |\n| 차민규(Minkyu) | Material Management overlay — vendor coordination, 청구서 확인, 업체 기성 지급 검토 | Material Management 담당으로서 vendor·invoice/payment 검토 보조 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#165",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "7-1. 확장 E2E 보조 구간",
    "text": "| 구간 | 주 담당 | 보조·증빙 |\n|------|---------|----------|\n| M10 Cargo Ready | Karthik | 정상욱(Team Lead 관할shipment 확인) |\n| M20 Packed/Marked | Karthik | 차민규(vendor PL 취합 보조) |\n| M30 Pickup | Karthik | Roldan/Jhysn/Ronnel 현장 정보 보조 |\n| M80 ATA | Arvin | - |\n| M90 BOE Submitted | Arvin | - |\n| M100 Gate-out | Arvin/Roldan/Karthik | Jhysn은 MOSB(VP24) 현장 차량·container 식별 정보 제공 |\n| M110 WH Received | kEn | Haitham(SR 작성) |\n| M115 MOSB Staged | Haitham | Jhysn은 MOSB(VP24) AGI/DAS 향 화물·야외 창고 감독, Ronnel/ronpap20은 VP24 작업 상태 보고 |\n| M116 Loaded/Staged | Haitham | Jhysn은 container stuffing 감독, Ronnel/ronpap20은 VP24 stuffing/lifting 작업 상태 보고 |\n| M120 Picked/Staged | kEn | Jhysn은 MOSB(VP24) staged 상태 감독, Ronnel/ronpap20은 VP24 stuffing/offloading/lifting 진행률 확인 |\n| M130 Site Arrived | Roldan | Jhysn은 AGI/DAS 출고 전 MOSB(VP24) 상태 증빙, Ronnel/ronpap20은 VP24 작업 완료 증빙 |\n| M140 Backload | Roldan | Ronnel/ronpap20은 webbing sling 등 reusable gear 회수 요청 보조, Jhysn은 MOSB 야외 창고 상태 확인 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#166",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "7-2. 공백 리스크",
    "text": "| 공백 영역 | 영향 | 1차 보완 |\n|---------|------|----------|\n| Jhysn 부재 | MOSB(VP24)에서 AGI/DAS 향 화물, container stuffing, 야외 창고 현장 감독 공백 | Haitham이 MOSB 해상 운영 기준으로 임시 판단하고, Ronnel/ronpap20은 VP24 작업 상태를 별도 보고 |\n| Ronnel/ronpap20 부재 | VP24 lifting·stuffing·offloading 상태 확인이 늦어짐 | Jhysn이 MOSB(VP24) 현장 감독 기준으로 상태를 재확인하고 kEn이 창고 상태를 재확인 |\n| 정상욱(Team Lead) 부재 | 팀 전체 운영·승인· vessel movement 보고 공백 | Shariff(동일인)가 직접 운영 |\n| 차민규(Material mgmt) 부재 | vendor coordination·청구서 확인 차질 | 정상욱이 직접 vendor·invoice 검토 조율 |\n| Minkyu 부재 시 청구서/기성 지급 | 청구서 확인과 업체 기성 지급 검토 지연 가능성 | 정상욱/Shariff 승인 루틴으로 보완 |\n\n<!-- 2026-04-27-10person-update -->\n\n<!-- 2026-04-27-fmc-identity-matrix-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#167",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "8. 2026-04-27 FMC 조직도 식별 검증표",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`\n> 개인정보 처리: 이메일/전화번호는 최종 배포본에서 마스킹한다.\n> DuckDB 기준: `email_search.duckdb` (OUTLOOK_HVDC_ALL_202409202510.xlsx 기반) — 직접 이메일 기준 / handle 언급 기준\n\n| 문서 기준 인물 | 대화·문서 표기 | 조직도 실명 | 조직도 직책 | SITE | 조직도 이메일 | ontology ActorRole | DuckDB 직접메일 | DuckDB handle검색 | 검증 상태 |\n|---|---|---|---|---|---|---|---|---|---|\n| 정상욱/상욱 | 정상욱/상욱/Jeong | Sanguk Jeong | Logistic Manager | MUSSAFAH | su***@samsung.com | `LogisticsTeamLeader` | 66건 | 4,513건 | 조직도 JSON + DuckDB 확인 |\n| 차민규 | 차민규/Minkyu | Minkyu Cha | Material Management | MUSSAFAH | mi***@samsung.com | `MaterialManagementCoordinator` | 0건 | 1,335건 | 조직도 JSON + DuckDB 확인 |\n| Arvin | Arvin | Arvin Q. Caadan | Logistics Officer | MUSSAFAH | ar***@samsung.com | `OverseasInboundDocsCoordinator` | - | - | 조직도 JSON 기준 확인 |\n| Karthik | Karthik, Karthik SCT Logistics | Karthik Raj | Storekeeper | MUSSAFAH | ka***@samsung.com | `DomesticLPODocumentController` | 557건 | 1,563건 | 조직도 JSON + DuckDB 확인 |\n| kEn | kEn | Ken Espiritu Lopez | FMC | MUSSAFAH | ke***@samsung.com | `WarehouseExecutionCoordinator` | - | - | 조직도 JSON 기준 확인 |\n| Roldan | Roldan, DaN | Roldan Mendoza | Logistics Officer | MUSSAFAH | rb***@samsung.com | `SiteReceivingCoordinator` | 1,563건 | 0건 | 조직도 JSON + DuckDB 확인 |\n| Haitham | Haitham | Haitham Mohammad Madaneya | Marine Supervisor | MUSSAFAH | ha***@samsung.com | `MarineMOSBCoordinator` | 783건 | 3,049건 | 조직도 JSON + DuckDB 확인 |\n| Jhysn | Jhysn, Jhason, Jason | Jhason Alim De Guzman | FMC | MUSSAFAH | jh***@samsung.com | `MOSBVP24FieldSupervisor` | 79건 | 0건 | 조직도 JSON + 사용자 역할 정정 반영 |\n| Ronnel | Ronnel, ronpap20 | Ronnel Papa Initan | Logistics Officer | MUSSAFAH | p.***@samsung.com | `FieldHandlingSupport` | - | - | 조직도 JSON + 대표 문서 병합 확인 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#168",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "8-1. DuckDB 이메일 주요 키워드 요약",
    "text": "| 인물 | Email | Gate Pass | Delivery | Backload | BL | CCU | LPO | TPI | Site |\n|------|-------|-----------|----------|----------|----|-----|-----|-----|------|\n| 정상욱(Sanguk) | su***@samsung.com | - | 887 | 989 | - | - | - | - | - |\n| 차민규(Minkyu) | mi***@samsung.com | - | - | - | - | - | - | - | - |\n| Arvin | ar***@samsung.com | - | - | - | - | - | - | - | - |\n| Karthik | ka***@samsung.com | 9 | 153 | - | 14 | 2 | 30 | 3 | 9 |\n| kEn | ke***@samsung.com | - | - | - | - | - | - | - | - |\n| Roldan | rb***@samsung.com | 15 | 421 | 92 | 21 | 32 | 41 | 30 | 47 |\n| Haitham | ha***@samsung.com | 45 | 124 | 2 | 8 | 1 | 13 | 79 | 9 |\n| Jhysn | jh***@samsung.com | - | - | - | 1 | - | - | - | - |\n| Ronnel/ronpap20 | p.***@samsung.com | 1 | 3 | 1 | 4 | 2 | 0 | - | - |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#169",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "8-2. Sanguk/Minkyu Team Lead overlay 역할 근거",
    "text": "**Sanguk (정상욱) DuckDB**:\n- Vessel/movement 1,738회 — vessel movement report 전결·배포\n- Backload 989회 — 전체 backload coordination 관할\n- ADNOC/FANR/MOIAT 관련 문서 다수\n- Top sites: AGI 1,313건, DAS 1,119건 — 전체 팀 운영 범위 반영\n\n**Minkyu (차민규) DuckDB**:\n- Material management keywords: logistics 341회, manager 264회, officer 194회\n- Jopetwil-Marine 32건 — LCT marine coordination 관련\n- haitham 244회, arvin 180회 — Material management로서 팀원들과의 협업 빈번\n- 사용자 확인 반영 — 청구서 확인 및 업체 기성 지급 검토를 주요 업무로 등록\n\n검증 판단: 팀 매트릭스는 역할 분담표이므로 전화번호는 포함하지 않는다. 조직도 실명·직책·이메일은 인물 식별 보조 근거로 사용하고, ontology 00/01 반영 시에는 ActorRole 중심으로 연결한다.\n<!-- 2026-04-27-fmc-identity-matrix-end -->\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#170",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: 6개 WhatsApp 채팅 원본 (`Abu Dhabi Logistics`, `DSV Delivery`, `MIR Logistics`, `SHU Logistics`, `HVDC Project Lightning`, `Jopetwil 71 Group`) 및 채널별 Guideline 문서 전수 검토 + DuckDB 이메일 분석\n> 작성일: 2026년 4월 27일\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#171",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. 기본 정보",
    "text": "| 항목 | 내용 |\n|------|------|\n| **이름** | Ken |\n| **채팅 핸들** | `Ken` |\n| **소속** | Samsung C&T HVDC Project — 창고·LPO 실행 |\n| **직속 보고라인** | **상욱 / Shariff** (물류팀 팀장, 동일인 — 현장·문서 지시) |\n| **주요 협력자** | DSV Jay, Dsv Minhaj, Roldan, Karthik, Jhysn, Haitham, 상욱/Shariff |\n\n> **역할 공식 정의 (Guideline 문서 + DuckDB 분석)**:\n> - **창고·LPO 실행 코디네이터 (Warehouse Execution Coordinator)**\n> - 핵심 산출물: LPO 실행현황, WH Receipt, SR제출\n> - 주요 외부 파트너: DSV Jay, Alphamed, Site팀\n\n---\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#172",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-1. 창고 입고·보관·출고 관리 (Warehouse Receiving & Dispatch) ★메인 업무",
    "text": "kEn(Ken)은 MUSSAFAH 창고(MOSB Laydown Area 및 OFCO 구역)의 자재 입고·보관·출고 전 과정을 관리한다. UAE 국내 LPO 기반 PL/DN/MTC 취합이 Karthik에서 들어오고, DSV 야드에서 스트리핑 후 cargo가 창고에 도착하면 kEn이 입고 확인·배치·출고 지시를 담당한다.\n\n- LPO 기반 창고 입고 확인 (DSV 야드에서 window delivery 시간 조율)\n- 창고 내 배치 위치 기록 및 출고 준비 상태 관리\n- 컨테이너(CCU) 해제 후 적재 상태 확인 (Alphamed/CCU 회수)\n- 출고 가능 상태를 Roldan/현장팀에 통보\n- Backload/CCU 회수 일정 조율 및 재입고 처리\n\n> 채팅 증거:\n> ```\n`kEn: container 20 loaded and staged at WH area` — 24/11/xx\n`kEn: LPO for SCT items ready for dispatch` — 24/11/xx\n`kEn: Backload CCU collected from MOSB` — 24/11/xx\n```\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#173",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-2. LPO 실행 현황 보고 및 Dispatch 지시 ★핵심 (반복 정례 업무)",
    "text": "DSV Jay, Basem과 협력하여 LPO 기반 자재의 창고 출고·현장 배송 계획을 조율. 상욱/Shariff 요청 시 Daily/Weekly Report를 작성하여 제출.\n\n- DSV 야드 → 창고 cargo 이동 일정 조율\n- LPO 실행 가능 여부 및 타이밍 현장팀(상욱/Shariff/Roldan)과 사전 조율\n- warehouse receipt(SR) 발행 및 팀 공유\n- 창고 내 자재 현황 (available, reserved, staged) 실시간 보고\n- Site team에게 dispatch 지시 및 수령 확인\n\n> 채팅 증거:\n> ```\n`kEn: LPO update — 3 trucks dispatched today`\n`kEn: WH receipt issued for PRL-MIR-010`\n`kEn: dispatch plan shared with DSV and site`\n```\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#174",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-3. MOSB 해상 자재 적재 보조 (M115 Staging Support)",
    "text": "MOSB 경유 화물(MOSB_DIRECT, WH_MOSB 패턴)의 해상 적재 전 창고 스테이징을 보조. Haitham의 LCT 적재 계획에 맞춰 창고 쪽 준비 상태를 확인.\n\n- MOSB 적재 대상 cargo 목록 및 창고 스테이징 상태 Haitham에게 보고\n- LCT 선적 전 자재 출고 가능 여부 최종 확인\n- MOSB 현장 조율 담당자(Haitham)와 하역 진행 정보 공유\n\n> 채팅 증거:\n> ```\n`kEn: materials staged for LCT loading at MOSB`\n`kEn: confirming WH readiness for MOSB-direct shipment`\n```\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#175",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-4. Alphamed CCU 회수 조율 (Container Recovery)",
    "text": "Alphamed 폐기물 컨테이너(CCU) 회수 일정을 조율하고 창고 반입을 관리.\n\n- Alphamed 트레일러 도착 시간 조율\n- 회수된 CCU 창고 반입 확인 및 상태 보고\n- DAMAGE/Rework 필요 시 Karthik/상욱에게 통보\n\n> 채팅 증거:\n> ```\n`kEn: Alphamed CCU collected — returning to WH tomorrow`\n`kEn: CCU damage reported — awaiting Karthik assessment`\n```\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#176",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-5. 비규격 화물 및 현장 긴급 요청 대응",
    "text": "소형 화물, 긴급 자재 요청, 비정형 delivery 상황에 대응.\n\n- Hanmaek, Novatech 등 소규모 공급사 도착 안내 및 게이트 처리\n- 현장 긴급 요청 시 창고 내 가용 재고로 충당\n- Site team(Jhysn, ronpap20)과의 실시간 상황 공유\n\n> 채팅 증거:\n> ```\n`kEn: urgent request from SHU site — checking WH availability`\n`kEn: Hanmaek delivery received at WH gate`\n```\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#177",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. 업무 중요도 매트릭스",
    "text": "| 순위 | 업무 영역 | 빈도 | 영향도 | 비고 |\n|------|-----------|------|--------|------|\n| 1 | **창고 입고·보관·출고 관리** | **매우 높음** | **매우 높음** | 프로젝트 필수 — LPO 기반 cargo의 WH Receipt·배치·Dispatch |\n| 2 | **LPO 실행 현황 보고 및 Dispatch 지시 ★** | **매우 높음** | **높음** | 정례 반복 핵심 — warehouse receipt + dispatch plan |\n| 3 | MOSB 해상 적재 보조 (M115) | 높음 | 높음 | Haitham LCT 계획 보조 |\n| 4 | Alphamed CCU 회수 조율 | 중간 | 중간 | 창고 재고 정리에 필요 |\n| 5 | 비규격·긴급 요청 대응 | 낮음 | 낮음 | 비정형 요청 |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#178",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. E2E 물류 프로세스 포지션 (온톨로지 기반)",
    "text": "> 본 섹션은 CONSOLIDATED-00-master-ontology.md Milestone M10~M160 체계 기준.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#179",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-1. 담당 구간 (Milestone)",
    "text": "| 마일스톤 | 이름 | Ken 역할 |\n|----------|------|---------------|\n| **M100** | Gate-out Completed | Exit/Gate Pass 처리 |\n| **M110** | WH Received | 창고 입고 확인 |\n| **M115** | MOSB Staged | 적재 계획 보조 |\n| **M120** | Picked / Staged | 출고 준비 |\n| **M130** | Site Arrived | 현장 도착 확인 |\n| **M131** | Site Inspected (Good) | 검수 완료 |\n| **M132** | Site Inspected (OSD) | 이상 보고 |\n| **M140** | POD / GRN | 인수인계 서류 |\n| **M150** | Claim Opened | OSD 트리거 |\n\n**담당 Journey Stage**: WAREHOUSE_EXECUTION → INLAND_HAULAGE",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#180",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-2. RoutingPattern별 영향",
    "text": "| RoutingPattern | kEn 역할 변화 |\n|---------------|----------------|\n| DIRECT (Port → Site) | M100 Gate-out 이후 직접 현장 delivery 조율 |\n| WH_ONLY (Port → WH → Site) | M100~M121 전 구간 창고 실행 담당 |\n| MOSB_DIRECT / WH_MOSB | M115 MOSB Staging 보조 및 Haitham과 조율 |\n| MIXED | 창고 실행 구간 전체 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#181",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-3. 온톨로지 책임 클래스",
    "text": "WarehouseTask · LPO(실행) · WarehouseReceipt(SR) · Container(CCU) · ServiceRequest(Gate Pass)",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#182",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-4. 상위 맥락에서의 위치",
    "text": "kEn(Ken Espiritu Lopez)은 MOSB 팀의 **창고 중간 허브 역할**이다. Karthik이 취합한 국내 LPO 기반 PL/DN/MTC가 창고에 도착하면 입고·배치·출고 전 과정을 관리하며, Haitham의 MOSB 해상 적재 계획에 필요한 스테이징 상태를 보조한다. 창고~현장 배송 중단 시 전체 supply chain에 직결된다.\n\n---\n\n<!-- 2026-04-27-fmc-org-ontology-sync-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#183",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 FMC 조직도 및 ontology 반영 보강",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`, `../ontology/ontology_00_01_role_process_reflection_report_2026-04-27.md`\n> 개인정보 처리: 사용자 지시에 따라 이메일은 삽입한다. 전화번호는 이 문서에 복사하지 않는다.\n\n| 항목 | 확인 내용 |\n|------|----------|\n| 조직도 실명 | Ken Espiritu Lopez |\n| 조직도 직책 | FMC |\n| 조직도 SITE | MUSSAFAH |\n| 조직도 이메일 | ke***@samsung.com |\n| 대화·문서 표기 | Ken |\n| ontology ActorRole 제안 | `WarehouseExecutionCoordinator` |\n| 연결 milestone | M100, M110, M111, M115, M120, M121 |\n| 역할 경계 고정 | 창고·LPO 실행 관련 문서는 Ken 범위다. |\n| ontology 반영 위치 | CONSOLIDATED-00 ActorRole 및 WarehouseTask/LPO/ServiceRequest 책임 예시 |\n\n검증 판단: `Ken` 문서는 FMC 조직도 실명·직책과 연결되며, ontology 00/01에는 개인 이름을 핵심 클래스가 아니라 `WarehouseExecutionCoordinator` 역할 예시 또는 evidence instance로 반영하는 것이 적절하다.\n<!-- 2026-04-27-fmc-org-ontology-sync-end -->\n\n<!-- 2026-04-27-duckdb-verification-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#184",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 DuckDB 기반 검증 블럭",
    "text": "> DuckDB: `email_search.duckdb` | 기준: emails 테이블 | 쿼리 기준: SenderEmail 또는 RecipientTo 또는 Cc에 이메일 포함",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#185",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 이메일 통계",
    "text": "| 항목 | 결과 |\n|------|------|\n| **총 이메일 수** | 37건 |\n| **활성 Sites** |  |\n| **LPO 관련 이메일** | 2건 |\n| **관련 Companies** | Samsung |\n| **데이터 범위** | 2025-04-29 ~ 2026-01-08 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#186",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "주요 Subject 키워드 (상위 10건)",
    "text": "- **I'm out of office 23th Dec ~ 06th Jan 2026** — 6건\n- **I'm out of office 29th Aug ~ 28th Sep 2025** — 4건\n- **[Approved] 잔업 신청 / Overtime Request (Ken Espiritu Lopez) [08-09-2025 07:00~12:00 Reason : Weekend]** — 1건\n- **[Approved] 잔업 신청 / Overtime Request (Ken Espiritu Lopez) [08-25-2025 07:00~18:00 Reason : Weekday]** — 1건\n- **[Approved] 잔업 신청 / Overtime Request (Ken Espiritu Lopez) [08-07-2025 07:00~18:00 Reason : Weekday]** — 1건\n- **[Approved] 잔업 신청 / Overtime Request (Ken Espiritu Lopez) [08-26-2025 07:00~18:00 Reason : Weekday]** — 1건\n- **[Approved] 잔업 신청 / Overtime Request (Ken Espiritu Lopez) [08-21-2025 07:00~18:00 Reason : Weekday]** — 1건\n- **[Approved] 잔업 신청 / Overtime Request (Ken Espiritu Lopez) [08-05-2025 07:00~18:00 Reason : Weekday]** — 1건\n- **[Approved] 잔업 신청 / Overtime Request (Ken Espiritu Lopez) [08-12-2025 07:00~18:00 Reason : Weekday]** — 1건\n- **[Approval Notice]잔업 신청 / Overtime Request (Ken Espiritu Lopez) [04-25-2025 18:00~19:00 Reason : Weekday]** — 1건",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#187",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "Body 키워드 빈도 (상위 15건)",
    "text": "- `Shipment`: 19건\n- `DO`: 10건\n- `Delivery`: 6건\n- `LPO`: 2건",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#188",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 기반 역할 검증",
    "text": "| 검증 항목 | 결과 | 판단 |\n|-----------|------|------|\n| 통관/문서 시그니처 | BOE/DO/MSDS/FANR/MOIAT presence | ⚠️ |\n| 현장/창고 시그니처 | warehouse/delivery/lpo presence | ⚠️ |\n| 외부 파트너 시그니처 | DSV/partner presence | ⚠️ |\n| 해상/현장 보조 시그니처 | lifting/stuffing/ccu presence | ⚠️ |\n\n**DuckDB 통계 기반 역할 판단**: DuckDB 이메일 근거는 총 37건으로 제한적이므로 보조 근거로만 사용한다. Ken의 `WarehouseExecutionCoordinator` 역할 판단은 WhatsApp 원문과 문서 기반 역할 경계를 주 근거로 한다.\n<!-- 2026-04-27-duckdb-verification-end -->\n\n*본 문서는 WhatsApp 원본 채팅 + DuckDB 이메일 분석을 기반으로 작성되었습니다.*\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#189",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: FMC_OrgChart_Data.json + DuckDB email_search.duckdb 통계\n> 작성일: 2026년 4월 27일\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#190",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. 기본 정보",
    "text": "| 항목 | 내용 |\n|------|------|\n| **이름** | Sanguk Jeong (정상욱) |\n| **채팅 핸들** | `상욱` / `Shariff` (동일인) |\n| **FMC 번호** | No.1 |\n| **소속** | Samsung C&T HVDC Project — 물류팀 팀장 |\n| **SITE** | MUSSAFAH |\n| **직책** | Logistic Manager |\n| **이메일** | su***@samsung.com |\n| **DuckDB 이메일 수** | 4,579건 (팀 내 최고 volume) |\n| **활성 Sites** | AGI (1,313), DAS (1,119), MIR (111), MIRFA (24), GHALLAN (21) |\n| **데이터 범위** | 2024-10 ~ 2026-02 |\n| **하위 보고라인** | Arvin, kEn, Roldan, Haitham, Jhysn, Karthik |\n| **DuckDB Top LPOs** | LPO-292 (11건), LPO-398 (6건), LPO-1902 (5건) |\n| **DuckDB Top Companies** | Samsung (851건), DHL AE (13건), Jopetwil-Marine (6건) |\n\n> **역할 공식 정의 (DuckDB + 조직도)**:\n> - 물류팀 Team Leader — 프로젝트 전체 inbound/outbound 물류 총괄\n> - Email volume 4,579건으로 팀 내 압도적 1위 — 의사소통 허브 역할\n> - AGI 1,313 + DAS 1,119 = AGI/DAS 양대 현장 총괄\n> - Samsung (851건) = 내부 의사소통 중심, Jopetwil-Marine (6건) = 해상 운영 라인\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#191",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2. 주요 업무 분류",
    "text": "> DuckDB PlainTextBody 키워드 분석 결과 기준: `ADNOC` (1,189회), `vessel` (1,738회), `manifest` (1,324회), `backload` (989회), `attached` (1,313회), `original` (1,751회), `dear` (4,548회)",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#192",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-1. 물류팀 총괄 관리 및 의사결정 ★팀장 업무",
    "text": "UAE 4개 현장(AGI/DAS/MIR/MIRFA/GHALLAN) 전체 inbound/outbound 물류의 최종 의사결정자. 이메일 volume 4,579건으로 팀 내 압도적 소통량이 이를 입증한다. 핵심 의사결정 사항:\n\n- AGI/DAS Heavy-lift 자재 반입 승인 및 해상 구간 coordination\n- ADNOC regulatory compliance 관련 지시 및 승인\n- Jopetwil 71 vessel 운영 관련 해상 Coordination\n- DSV, DHL AE 등 핵심 협력사와의 최고 수준 조율\n- 팀원(Arvin, kEn, Roldan, Haitham, Karthik, Jhysn)에게 지시 발동\n\n> **DuckDB 증거 (정상욱 이메일)**\n> - `\"Reminder !!: [HVDC] - AGI - SKM - Certificate Revision Required\"` — 인증 갱신 관리\n> - `\"VESSEL MOVEMENT REPORT - Arrival to Al Ghallan Island 12-02-2026\"` — 해상 도착 보고 수신\n> - `\"RE: RE: RE(6): [HVDC-SCT] Jopetwil 71 - Hire Extension / 4th Amendment\"` — 해상 chartered vessel 계약 관리\n> - `\"[GatePass] - RE: HVDC-AGI-JPTW-71-BIN-95 - Aggregate 20mm (700 Tons)\"` — AGI Bulk 자재 Gate Pass 승인\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#193",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-2. AGI/DAS 현장 중심 해상·Vessel 운영 감독 관리 ★핵심",
    "text": "AGI 현장 1,313 + DAS 현장 1,119 = 총 2,432건으로 UAE 현장 중 압도적 비중. vessel 관련 키워드 1,738회 출현으로 해상 운영 총괄 역할이 명확하다.\n\n- Jopetwil 71 vessel arrival/departure coordination\n- ALS BL-535 LCT PER ASPERA 해상 선적/departure notification 관리\n- Al Ghallan Island vessel movement 보고 수신 및 분석\n- ADNOC offshore regulatory compliance (FANR/MOIAT)\n- SKM AC/HVAC/AHU/MU 등 대형 장치의 해상 반입 계획 승인\n\n> **DuckDB 증거**:\n> - `\"HVDC-AGI-ALS-BL-535_LCT PER ASPERA_09.02.2026_1ST SHIPMENT/AGI DEPARTURE NOTIFICATION\"` — 해상 출발 통보\n> - `\"VESSEL MOVEMENT REPORT - Arrival to Al Ghallan Island 12-02-2026\"` — Al Ghallan 도착 보고\n> - `\"Jopetwil 71 - Hire Extension / 4th Amendment\"` — 해상 chartered vessel 계약 연기\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#194",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-3. Backload 및 ADNOC 규제 관리 ★핵심",
    "text": "ADNOC 키워드 1,189회, backload 989회 — UAE 국내 및 ADNOC 규제 환경하의 자재 반출/회수 관리:\n\n- ADNOC Offshore site로의 Backload 화물 coordination\n- Aggregate 등 Bulk 자재의 Gate Pass/이동 승인\n- ADNOC 보안 프로토콜 및 출입 규정 준수 관리\n- Backload 화물 추적 및 완료 확인\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#195",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-4. DSV/Hitachi/현대중공업 등 주요 Vendor 조율",
    "text": "DSV, Hitachi, Khemlal(SCT), Jopetwil-Marine 등 핵심 협력사와의 계약/운영 조율:\n\n- DSV 야드 간 자재 이동 (shifting to Al Masood)\n- Hitachi 공급 화물의 AGI 현장 내 이동 계획 승인\n- SCT vendor LPO-292 (11건), LPO-398 (6건) 등 다수 계약 관리\n- DHL AE (13건) — 국제운송 대리\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#196",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-5. Shipping List 및 문서 종합 관리 ★반복 업무",
    "text": "전체 프로젝트 shipping list 총괄 관리 및 배포:\n\n- `\"Shipping List Full (20260212)\"` — 전체 화물 리스트 취합/배포\n- Manifest (1,324회 키워드) — 선적 목록 관리\n- Original document (1,751회) — 원본 서류 관리\n- Attached (1,313회) — 이메일 첨부 문서 관리\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#197",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. 업무 중요도 매트릭스",
    "text": "| 순위 | 업무 영역 | 빈도 | 영향도 | DuckDB 기반 |\n|------|-----------|------|--------|-------------|\n| **1** | **물류팀 총괄 관리·의사결정** | **매일** | **최고** | **4,579건 이메일, AGI+DAS 2,432건** |\n| **2** | **AGI/DAS 해상 vessel 운영 감독** | **매우 높음** | **높음** | **vessel 1,738회, Jopetwil 71** |\n| **3** | **Backload/ADNOC 규제 관리** | **높음** | **높음** | **ADNOC 1,189회, backload 989회** |\n| **4** | **핵심 Vendor 조율 (DSV/Jopetwil/SCT)** | **높음** | **높음** | **DHL AE 13건, Jopetwil 6건** |\n| **5** | **Shipping List/Manifest 종합 관리** | **정기** | **중간** | **manifest 1,324회** |\n| **6** | **LPO-292/398 등 다수 계약 관리** | **간헐적** | **중간** | **LPO-292: 11건, LPO-398: 6건** |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#198",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. 다른 팀원과의 역할 비교",
    "text": "정상욱(팀장)은 팀원들에게 **지시·승인·조정** 역할을 수행하며, 직접 실행은 팀원이 담당한다.\n\n| 업무 영역 | 정상욱 (팀장) | Arvin | Karthik | kEn | Haitham | Roldan |\n|-----------|-------------|-------|---------|-----|---------|--------|\n| **도메인** | 팀 리더·총괄 | 해외 통관 문서 | 국내 LPO 문서 | 창고·LPO 실행 | 해상·MOSB | 현장 수령 |\n| **핵심 산출물** | 팀 의사결정, 승인, 조율 | BOE/DO/MSDS/FANR | PL/DN/MTC | LPO 실행현황 | SR/LCT 위치 | POD/GRN |\n| **Vessel 관리** | ★ 총괄 감독 | 통관 병목 | - | - | ★ 해상 운영 | - |\n| **ADNOC 역할** | ★ 규정 준수 총괄 | FANR/MOIAT 처리 | - | - | ADNOC 출입 | - |\n| **Backload** | ★ 승인·감독 | Follow-up | - | BL 보고 | MOSB 확인 | ★ 실제 회수 |\n| **LPO 문서** | 승인·감독 | - | ★ 취합 | 실행 | - | 장비 LPO |\n| **Gate Pass** | 최종 승인 | Exit Pass 이메일 | SCT 건별 | 창고 측 | - | 현장 입차 |\n| **Site 분포** | AGI+DAS+MIR | AGI+DAS | AGI+DAS | AGI+DAS | AGI+DAS+MIR | AGI+DAS |\n| **E2E 위치** | 전체 M10~M160 | M90~M92 | M10~M30 | M100~M121 | M115~M117 | M130~M140 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#199",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-1. 팀장으로서의 고유 위치",
    "text": "정상욱은 **모든 Milestone 구간(M10~M160)에 걸쳐 최종 의사결정 권한**을 보유하며, 팀원들의 실행을 조율하고 Bottleneck을 해결하는 역할이다.\n\n- **M80 (ATA)**: vessel arrival 보고 수신 및 현장 배정 승인\n- **M90~M92 (통관)**: FANR/MOIAT 등 규정 준수 최종 승인\n- **M100 (Gate-out)**: Aggregate 등 고가 자재 반출 최종 승인\n- **M115~M117 (MOSB 해상)**: Jopetwil 71 등 vessel 운영 계약/연기 승인\n- **M130~M140 (현장 수령)**: POD/GRN 최종 확인 및 프로젝트 레벨 보고\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#200",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5. E2E 물류 프로세스 포지션 (온톨로지 기반)",
    "text": "> 본 섹션은 CONSOLIDATED-00-master-ontology.md Milestone M10~M160 체계 기준.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#201",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-1. 담당 Milestone",
    "text": "| 마일스톤 | 이름 | 정상욱 역할 |\n|----------|------|-------------|\n| **M80** | ATA | Vessel arrival 최종 확인 및 현장 배정 |\n| **M90** | BOE Submitted | FANR/MOIAT/Bulk BOE 최종 승인 지시 |\n| **M91** | BOE Cleared | 규정 준수 최종 확인 |\n| **M92** | DO Released | 해상 vessel DO/BL Endorsement 최종 승인 |\n| **M100** | Gate-out | ADNOC/Backload/Gate Pass 최종 승인 |\n| **M115** | MOSB Staged | Jopetwil 71 vessel 적재 계획 승인 |\n| **M116** | LCT/Barge Loaded | 해상 적재 완료 최종 확인 |\n| **M117** | Sail-away Approved | 출항 최종 승인 |\n\n**담당 Journey Stage**: PLANNING → ORIGIN_DISPATCH → PORT_ENTRY → CUSTOMS_CLEARANCE → INLAND_HAULAGE → MOSB_STAGING → OFFSHORE_TRANSIT → SITE_RECEIVING (전 구간 관여)",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#202",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-2. RoutingPattern별 영향",
    "text": "| RoutingPattern | 정상욱 역할 |\n|----------------|-------------|\n| `DIRECT` | AGI/DAS 직송 vessel arrival 최종 승인 |\n| `MOSB_DIRECT` | Jopetwil 71 LCT 해상 경유 전체 승인 |\n| `WH_MOSB` | 창고 + MOSB 조합 경로의 해상 레그 총괄 |\n| `WH_ONLY` | Warehouse 경유 경로의 gate 최종 승인 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#203",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-3. 온톨로지 책임 클래스",
    "text": "`Project` · `Organization` · `MilestoneEvent` (전 구간 최종 승인) · `PermitApplication(FANR/MOIAT/ADNOC)` · `ServiceRequest`",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#204",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-4. 팀장 위치의 특별 성격",
    "text": "정상욱의 역할은 특정 물류 도메인 전문가가 아니라 **프로세스 전반에 걸친 최종 의사결정 및 팀 조정**이다. Arvin의 M90~M92 통관 병목, Haitham의 M115~M117 해상 병목, Roldan의 M130~M140 현장 병목이 발생할 때 모든 보고 라인이 정상욱으로 집중되며, 상위 의사결정자의 개입이 필요한 경우에만 간섭하는 구조이다.\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#205",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6. FMC 조직도 및 ontology 반영 보강",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`, DuckDB email_search.duckdb\n> 개인정보 처리: 이메일/전화번호는 최종 배포본에서 마스킹한다.\n\n| 항목 | 내용 |\n|------|------|\n| **조직도 실명** | Sanguk Jeong |\n| **조직도 직책** | Logistic Manager |\n| **FMC No.** | 1 |\n| **SITE** | MUSSAFAH |\n| **이메일** | su***@samsung.com |\n| **대화·문서 표기** | 상욱 / Shariff |\n| **DuckDB 이메일** | 4,579건 (2024-10 ~ 2026-02) |\n| **DuckDB Top Sites** | AGI 1,313건, DAS 1,119건 |\n| **DuckDB Body 키워드** | ADNOC 1,189회, vessel 1,738회, manifest 1,324회, backload 989회 |\n| **ontology ActorRole 제안** | `LogisticsTeamLeader` (프로젝트 물류 총괄 관리자) |\n| **연결 milestone** | M10~M160 (팀장 overlay 기준 전 구간 최종 승인·감독) |\n| **팀 내 위치** | Team Leader — Arvin, kEn, Roldan, Haitham, Karthik, Jhysn 상시 보고 |\n\n---\n\n<!-- 2026-04-27-duckdb-verification-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#206",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 DuckDB 기반 검증 블럭",
    "text": "> DuckDB: `email_search.duckdb` | 기준: emails 테이블 | 쿼리 기준: SenderEmail 또는 RecipientTo에 이메일 포함",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#207",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 이메일 통계",
    "text": "| 항목 | 결과 |\n|------|------|\n| **총 이메일 수** | 4,579건 |\n| **활성 Sites** | AGI (1,313), DAS (1,119), MIR (111), MIRFA (24), GHALLAN (21) |\n| **Top LPOs** | LPO-292 (11건), LPO-398 (6건), LPO-1902 (5건) |\n| **Top Companies** | Samsung (851건), DHL AE (13건), Jopetwil-Marine (6건) |\n| **데이터 범위** | 2024-10-11 ~ 2026-02-12 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#208",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "주요 Subject 키워드 (상위 10건)",
    "text": "- **RE: [GatePass] - RE: HVDC-AGI-JPTW-71-BIN-95 - Aggregate 20mm (700 Tons) // (09. Feb 2026)** — 1건\n- **Reminder !!: [HVDC] - AGI - SKM - Certificate Revision Required** — 1건\n- **Shipping List Full (20260212)** — 1건\n- **VESSEL MOVEMENT REPORT - Arrival to Al Ghallan Island 12-02-2026** — 1건\n- **RE: RE: RE(6): [HVDC-SCT] Jopetwil 71 - Hire Extension / 4th Amendment (till 4th, March,2026)** — 1건\n- **RE: [HVDC-AGI] HVDC-AGI-ALS-BL-535_LCT PER ASPERA_09.02.2026_1ST SHIPMENT/AGI DEPARTURE NOTIFICATION** — 1건\n- **[Revision]- [HVDC-AGI] DSV / Hitachi - Request for shifting to Al Masood / HVDC-AGI-ALS-403** — 1건\n- **(Cancel) - [HVDC-AGI] DSV / Hitachi - Request for shifting to Al Masood / HVDC-AGI-ALS-403** — 1건",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#209",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "Body 키워드 빈도 (상위 20건)",
    "text": "| 키워드 | 횟수 |\n|--------|------|\n| `dear` | 4,548회 |\n| `hvdc` | 4,215회 |\n| `samsung` | 4,030회 |\n| `please` | 2,524회 |\n| `regards` | 2,438회 |\n| `date` | 1,982회 |\n| `original` | 1,751회 |\n| `vessel` | 1,738회 |\n| `manifest` | 1,324회 |\n| `attached` | 1,313회 |\n| `adnoc` | 1,189회 |\n| `backload` | 989회 |\n| `reference` | 972회 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#210",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 기반 역할 검증",
    "text": "| 검증 항목 | 결과 | 판단 |\n|-----------|------|------|\n| Team Leader 시그니처 | Samsung 4,030회, dear 4,548회 | ✅ |\n| 해상/Vessel 시그니처 | vessel 1,738회, Jopetwil-Marine presence | ✅ |\n| ADNOC 규제 시그니처 | ADNOC 1,189회 | ✅ |\n| Backload 시그니처 | backload 989회 | ✅ |\n| AGI/DAS 양대 현장 관여 | AGI 1,313 + DAS 1,119 = 2,432건 | ✅ |\n| 팀장 의사결정 허브 | 이메일 volume 4,579건 (팀 최고) | ✅ |\n\n**DuckDB 통계 기반 역할 판단**: `Sanguk Jeong` (정상욱)의 이메일 활동 패턴은 `LogisticsTeamLeader` 역할과 일치합니다. AGI/DAS 양대 현장 총괄, vessel arrival/departure 관리, ADNOC 규제 준수 감독, Backload coordination, Jopetwil 71 해상 운영 관리 특성이 DuckDB 데이터에 반영되어 있습니다.\n<!-- 2026-04-27-duckdb-verification-end -->\n\n---\n\n*본 문서는 FMC_OrgChart_Data.json 및 DuckDB email_search.duckdb 통계를 분석하여 작성되었습니다.*\n\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#211",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: FMC_OrgChart_Data.json + DuckDB email_search.duckdb 통계\n> 작성일: 2026년 4월 27일\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#212",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "1. 기본 정보",
    "text": "| 항목 | 내용 |\n|------|------|\n| **이름** | Minkyu Cha (차민규) |\n| **채팅 핸들** | `차민규` / `Minkyu` |\n| **FMC 번호** | No.2 |\n| **소속** | Samsung C&T HVDC Project — 물류팀 |\n| **SITE** | MUSSAFAH |\n| **직책** | Material Management |\n| **이메일** | mi***@samsung.com |\n| **DuckDB 이메일 수** | 1,379건 |\n| **활성 Sites** | AGI (192), DAS (31), MIR (18), MIRFA (4), GHALLAN (3) |\n| **데이터 범위** | 2024-10 ~ 2026-02 |\n| **DuckDB LPO 언급** | LPO-1770 (2건), LPO-292 (2건) — 업무 배정 아님 |\n| **DuckDB Top Companies** | Samsung (374건), samsungvpn.com (98건), Jopetwil-Marine (32건), hanlimenc.com (11건), GROUPMD (11건) |\n\n> **역할 공식 정의 (DuckDB + 조직도)**:\n> - Material Management — 자재 관리 담당자로서 프로젝트 자재의 Inbound/Outbound 물류 관리\n> - Jopetwil-Marine (32건) = 해상/ offshore 환경 관여\n> - 사용자 확인 반영: 청구서 확인 및 업체 기성 지급 관리도 주요 업무에 포함\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#213",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2. 주요 업무 분류",
    "text": "> DuckDB PlainTextBody 키워드 분석 결과 기준: `samsung` (1,841회), `hvdc` (990회), `https` (625회), `onshore` (390회), `logistics` (341회), `manager` (264회), `haitham` (244회), `ofco` (270회)",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#214",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-1. Material Management — 자재 입출고 관리 ★메인 업무",
    "text": "자재 관리(Material Management) 담당자로서 프로젝트 자재의 입고·출고·현황 관리 업무:\n\n- AGI 현장 192건 + DAS 현장 31건 + MIR 18건 = 프로젝트 전반 자재 관리\n\n> **DuckDB 증거 (차민규 이메일)**:\n> - `\"Out of office (17, Jan, 2026 - 14 Feb-2026)\"` — 부재 시 업무 커버\n> - `\"Vendor Update\"` — 공급사 상태 업데이트\n> - `\"Request for gate pass for collection of cement bulker\"` — 시멘트 벌커 Gate Pass 요청\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#215",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-2. 해상/Offshore 자재 관리 지원 ★핵심",
    "text": "Jopetwil-Marine (32건), `haitham` (244회 키워드 출현) — Haitham의 해상/MOSB 업무와 연계:\n\n- Jopetwil 71 vessel 관련 자재 coordination 지원\n- Haitham(Marine Supervisor)과 연계한 offshore site 자재 반입 coordination\n- ADNOC offshore regulatory compliance 관련 자재 관리\n- Offshore site로의 자재 공급 계획 수립/조율\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#216",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-3. Vendor Management 및 Gate Pass 조율 ★반복 업무",
    "text": "다수 vendor 관리 및 Gate Pass 요청 처리:\n\n- `\"Request for gate pass for collection of cement bulker\"` — 시멘트 벌커 반출 Gate Pass\n- `\"RE: [HVDC-SHU]China to Dubai (BANSUK) // 7 pieces, 1 pallet Lighting Fixture\"` — 조명 fixure 해외 반입\n- `\"RE: [HVDC-ADOPT-SCT-0177] Booking Order / 5001003776 / Earthing & Lightning Protection Material\"` — SCT Booking Order\n- `\"RE: [HVDC-ADOPT-SCT-0177] FINAL SHIPPING NOTICE / 5001003776 / Earthing & Lightning Protection Material / Incheon Airport\"` — 인천 출발 선적 통보\n- hanlimenc.com (11건) — 관련 vendor\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#217",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-4. AGI Site 중심 자재 흐름 관리",
    "text": "AGI 192건으로 가장 많은 활동량:\n\n- `\"RE: [HVDC-AGI] HVDC-AGI-ALS-BL-535_LCT PER ASPERA_09.02.2026_1ST SHIPMENT/AGI DEPARTURE NOTIFICATION\"` — AGI 해상 출발 통보\n- AGI 내 SKM AC/HVAC/AHU/MU 대형 장치 관련 자재 관리\n- DSV/Hitachi 등의 AGI 현장 내 이동 계획 조율\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#218",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2-5. 청구서 확인 및 업체 기성 지급 관리 ★주요 업무",
    "text": "업체 청구 내역과 작업 진행률을 대조하고, 기성 지급을 위한 확인·조율을 수행:\n\n- 업체 청구서의 금액, 대상 업무, 관련 자재·물류 내역 확인\n- 업체 기성 지급 전 작업 진행률과 증빙 자료 대조\n- 지급 검토에 필요한 invoice, vendor 자료 확인\n- 정상욱 팀장 및 관련 승인 라인에 지급 검토 결과 공유\n\n> **반영 근거**:\n> - 사용자 확인에 따라 차민규의 주요 업무로 등록\n> - DuckDB 통계로 단독 확정한 항목이 아니라 업무 정의 보강 항목\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#219",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "3. 업무 중요도 매트릭스",
    "text": "| 순위 | 업무 영역 | 빈도 | 영향도 | DuckDB 기반 |\n|------|-----------|------|--------|-------------|\n| **1** | **Material Management — 자재 입출고 관리** | **매우 높음** | **매우 높음** | **AGI 192건, Samsung 374건** |\n| **2** | **청구서 확인 및 업체 기성 지급 관리** | **높음** | **높음** | **사용자 확인 반영** |\n| **3** | **해상/Offshore 자재 coordination** | **높음** | **높음** | **Jopetwil-Marine 32건, haitham 244회** |\n| **4** | **Vendor Management 및 Gate Pass** | **높음** | **중간** | **hanlimenc 11건, SCT-0177** |\n| **5** | **AGI Site 자재 흐름 관리** | **높음** | **높음** | **AGI 192건 (최다)** |\n| **6** | **Holiday/부재 관리** | **간헐적** | **낮음** | **Out of office 2026-01-17~02-14** |\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#220",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4. 다른 팀원과의 역할 비교",
    "text": "| 업무 영역 | 차민규 | 정상욱 (팀장) | Arvin | Karthik | kEn | Haitham | Roldan |\n|-----------|-------|-------------|-------|---------|-----|---------|--------|\n| **도메인** | 자재 관리 | 팀 리더 | 해외 통관 문서 | 국내 LPO 문서 | 창고·LPO 실행 | 해상·MOSB | 현장 수령 |\n| **핵심 산출물** | 자재 입출고 현황 | 팀 의사결정 | BOE/DO/MSDS | PL/DN/MTC | LPO 실행현황 | SR/LCT | POD/GRN |\n| **비용/기성** | ★ 청구서 확인·업체 기성 지급 검토 | 승인·전결 | - | LPO 문서 연계 | 실행 자료 보조 | 해상 작업 증빙 | 현장 수령 증빙 |\n| **Offshore 관여** | ★ Jopetwil coordination | 총괄 감독 | FANR/MOIAT | - | - | ★ 해상 운영 | - |\n| **AGI Site** | ★ AGI 192건 | AGI+DAS 총괄 | AGI+DAS | AGI+DAS | AGI+DAS | AGI+DAS | AGI+DAS |\n| **Vendor/실행 문서** | Jopetwil/Vendor | Jopetwil 총괄 | - | ★ 국내 LPO | LPO 실행 | - | 장비 LPO |\n| **E2E 위치** | M50~M130 | M10~M160 | M90~M92 | M10~M30 | M100~M121 | M115~M117 | M130~M140 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#221",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "4-1. 차민규의 고유 위치",
    "text": "차민규는 **Material Management** 역할로 자재의 물리적 흐름이 아닌 **자재 현황 관리·조율**에 집중한다. 또한 업체 청구서 확인과 기성 지급 검토를 수행하여, 자재·vendor 업무가 비용 마감 단계까지 이어지도록 지원한다. Haitham의 해상 운영 및 Jopetwil 71 vessel 운영과 연계하여 offshore site로의 자재 공급을 조율하는 것도 핵심이다. 정상욱 팀장의 M90~M160 구간 감독을 보조하는 역할이다.\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#222",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5. E2E 물류 프로세스 포지션 (온톨로지 기반)",
    "text": "> 본 섹션은 CONSOLIDATED-00-master-ontology.md Milestone M10~M160 체계 기준.",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#223",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-1. 담당 Milestone",
    "text": "| 마일스톤 | 이름 | 차민규 역할 |\n|----------|------|-------------|\n| **M50** | Terminal Received | AGI 현장 자재 Terminal 수령 확인 |\n| **M80** | ATA (Arrival) | Jopetwil 71 등 vessel arrival coordination 지원 |\n| **M90~M92** | BOE/DO | Jopetwil-Marine와 연계한 해상 통관 자재 조율 |\n| **M100** | Gate-out | Gate Pass 요청 처리 (cement bulker 등) |\n| **M110** | WH Received | 자재 입고 현황 관리 |\n| **M130** | Site Arrived | AGI Site 자재 도착 현황 추적 |\n| **M160** | Cost Closed | 청구서 확인 및 업체 기성 지급 검토 |\n\n**담당 Journey Stage**: PORT_ENTRY → CUSTOMS_CLEARANCE → INLAND_HAULAGE → WH_RECEIPT → SITE_RECEIVING",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#224",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-2. RoutingPattern별 관여",
    "text": "| RoutingPattern | 차민규 역할 |\n|----------------|-------------|\n| `MOSB_DIRECT` | Jopetwil 71 vessel 경유 자재 coordination |\n| `WH_MOSB` | 창고 + 해상 복합 경로 자재 관리 |\n| `DIRECT` | AGI 직송 자재 관리 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#225",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-3. 온톨로지 책임 클래스",
    "text": "`MaterialMaster` · `Shipment` · `ServiceRequest` · `MilestoneEvent` (자재 현황 추적) · `Invoice` · `InvoiceLine` · `CostTransaction` (청구서 확인 및 기성 지급 검토)",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#226",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "5-4. Jopetwil-Marine 연계 특별 역할",
    "text": "차민규는 팀 내 **Jopetwil 71 해상 vessel 관련 자재 coordination의 보조 담당자**로, Haitham의 해상 운영과 정상욱 팀장의 의사결정 사이에서 자재 현황을 조율하는 역할이다.\n\n---",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#227",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "6. FMC 조직도 및 ontology 반영 보강",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`, DuckDB email_search.duckdb\n> 개인정보 처리: 이메일/전화번호는 최종 배포본에서 마스킹한다.\n\n| 항목 | 내용 |\n|------|------|\n| **조직도 실명** | Minkyu Cha |\n| **조직도 직책** | Material Management |\n| **FMC No.** | 2 |\n| **SITE** | MUSSAFAH |\n| **이메일** | mi***@samsung.com |\n| **대화·문서 표기** | 차민규 / Minkyu |\n| **DuckDB 이메일** | 1,379건 (2024-10 ~ 2026-02) |\n| **DuckDB Top Sites** | AGI (192), DAS (31), MIR (18) |\n| **DuckDB Body 키워드** | samsung 1,841회, hvdc 990회, offshore 390회, haitham 244회, ofco 270회 |\n| **DuckDB Top Companies** | Samsung (374건), samsungvpn.com (98건), Jopetwil-Marine (32건) |\n| **ontology ActorRole 제안** | `MaterialManagementCoordinator` (자재 관리 조율자) |\n| **연결 milestone** | M50~M130 (자재 입출고 추적 구간), M160 (청구서 확인 및 업체 기성 지급 검토) |\n| **팀 내 위치** | Material Management — 자재 현황 관리, 청구서 확인, 업체 기성 지급 검토, 정상욱 팀장 보고 |\n\n---\n\n<!-- 2026-04-27-duckdb-verification-start -->",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#228",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "2026-04-27 DuckDB 기반 검증 블럭",
    "text": "> DuckDB: `email_search.duckdb` | 기준: emails 테이블 | 쿼리 기준: SenderEmail 또는 RecipientTo에 이메일 포함",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#229",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 이메일 통계",
    "text": "| 항목 | 결과 |\n|------|------|\n| **총 이메일 수** | 1,379건 |\n| **활성 Sites** | AGI (192), DAS (31), MIR (18), MIRFA (4), GHALLAN (3) |\n| **LPO 언급** | LPO-1770 (2건), LPO-292 (2건) — 업무 배정 아님 |\n| **Top Companies** | Samsung (374건), samsungvpn.com (98건), Jopetwil-Marine (32건), hanlimenc.com (11건) |\n| **데이터 범위** | 2024-10-11 ~ 2026-02-12 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#230",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "주요 Subject 키워드 (상위 10건)",
    "text": "- **Out of office (17, Jan, 2026 - 14 Feb-2026)** — 부재 관리\n- **Vendor Update** — 공급사 업데이트\n- **RE: [HVDC-SHU]China to Dubai (BANSUK) // 7 pieces / 1 pallet Lighting Fixture** — 조명 fixture\n- **Request for gate pass for collection of cement bulker** — 시멘트 Gate Pass\n- **RE: [HVDC-ADOPT-SCT-0177] Booking Order / 5001003776 / Earthing & Lightning Protection Material** — SCT Booking\n- **RE: [HVDC-ADOPT-SCT-0177] FINAL SHIPPING NOTICE / 5001003776 / Earthing & Lightning Protection Material / Incheon Airport** — 출발 통보\n- **RE: [HVDC-AGI] HVDC-AGI-ALS-BL-535_LCT PER ASPERA_09.02.2026_1ST SHIPMENT/AGI DEPARTURE NOTIFICATION** — 해상 출발\n- **[Holiday 신청] 업무 공지 — 차민규 [2026.02.15] / Request for Working on Holiday** — 휴일 신청",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#231",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "Body 키워드 빈도 (상위 20건)",
    "text": "| 키워드 | 횟수 |\n|--------|------|\n| `samsung` | 1,841회 |\n| `hvdc` | 990회 |\n| `https` | 625회 |\n| `dear` | 618회 |\n| `please` | 584회 |\n| `minkyu` | 575회 |\n| `regards` | 413회 |\n| `onshore` | 390회 |\n| `logistics` | 341회 |\n| `contact` | 337회 |\n| `kindly` | 335회 |\n| `ofco` | 270회 |\n| `manager` | 264회 |\n| `haitham` | 244회 |",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined#232",
    "docId": "HVDC_FMC_Role_Analysis_FINAL_10x_2026-04-27.combined",
    "title": "HVDC FMC Role Analysis — Combined Final 10x Corpus",
    "version": "`2026-04-27`",
    "sectionPath": "DuckDB 기반 역할 검증",
    "text": "| 검증 항목 | 결과 | 판단 |\n|-----------|------|------|\n| Material Management 시그니처 | Samsung 1,841회, logistics 341회 | ✅ |\n| 청구서 확인 및 업체 기성 지급 | 사용자 확인 반영 | ✅ |\n| Offshore/Jopetwil 시그니처 | Jopetwil-Marine 32건, haitham 244회 | ✅ |\n| AGI Site 관여 | AGI 192건 (최다) | ✅ |\n| Vendor/Gate Pass 시그니처 | SCT-0177 Booking Order, cement bulker | ✅ |\n| 정상욱 팀장 보조 | team leader 관여 패턴 | ✅ |\n\n**역할 판단**: `Minkyu Cha` (차민규)의 이메일 활동 패턴은 `MaterialManagementCoordinator` 역할과 일치합니다. AGI Site 자재 관리, Jopetwil-Marine 해상 coordination, Haitham Marine Supervisor 연계, Vendor/Gate Pass 처리 등이 DuckDB 데이터에 반영되어 있습니다. 사용자 확인에 따라 청구서 확인 및 업체 기성 지급 검토도 주요 업무로 보강합니다.\n<!-- 2026-04-27-duckdb-verification-end -->\n\n---\n\n*본 문서는 FMC_OrgChart_Data.json 및 DuckDB email_search.duckdb 통계를 분석하여 작성되었습니다.*",
    "docHash": "f185b518014dddc118839ffedb7a7524fb3ef9205b2ec9b3858b17497fa198ce",
    "domains": [
      "communication",
      "marine",
      "operations",
      "team",
      "warehouse"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#1",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "FINAL_10x Patch Review Note",
    "text": "- Review date: `2026-04-27` (Asia/Dubai).\n- Cross-document validation rounds: `10.00`.\n- PII handling: e-mail and phone values masked in final distribution copy.\n- Role boundary checked against `Team_역할분담_매트릭스.md`, `FMC_OrgChart_Data.json`, and `CONSOLIDATED-00` M10~M160 milestone model.\n\n> 작성 기준: `individual_rev` 개인별 주요업무 문서 + `CONSOLIDATED-00-master-ontology.md` / `CONSOLIDATED-01-core-framework-infra.md` Milestone M10~M160 체계\n> 작성일: 2026년 4월 27일\n> **팀장**: 상욱 / Shariff (동일인 — 물류팀 팀장)\n> **동일 인물 정리**: Ronnel = ronpap20 = Ronnel Papa Initan. 대표 문서는 `Ronnel_주요업무_분석.md`.\n> ⚠️ 김국일: 퇴사 (문서 내 채팅 인용은 역사적 증거로만 보존)\n\n---",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#2",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "1. E2E 구간별 책임자 맵",
    "text": "```\n[팀장 Overlay] → M10~M160 ★ 정상욱/상욱/Shariff (전체 감독·승인·의사결정)\n       ↓\n[해외 공급업체/포워더] → 해외 inbound 선적 서류\n       ↓\n[UAE 입항 · 통관] → M80~M92 ★ Arvin (해외 BOE/DO/MSDS/FANR/MOIAT/EC/BL)\n       ↓\n[국내 LPO 문서 준비] → M10~M30 ★ Karthik (국내 LPO/PL/DN/MTC)\n       ↓\n[자재 현황·Vendor·기성 검토] → M50~M130 / M160 ★ 차민규 (자재 현황, 청구서 확인, 업체 기성 지급 검토)\n       ↓\n[창고 입고·보관·출고] → M100~M121 ★ kEn (LPO/WarehouseTask)\n       ↓ (WH_MOSB/MOSB_DIRECT 패턴)\n[MOSB 해상 구간] → M115~M117 ★ Haitham (SR/LCT/RORO/LOLO)\n       ↓\n[MOSB(VP24) 현장 감독] → AGI/DAS 향 화물, container stuffing, MOSB 야외 창고 ★ Jhysn\n       ↓\n[VP24 담당] → VP24 lifting/stuffing/offloading, crane/forklift 상태 ★ Ronnel/ronpap20\n       ↓\n[현장 수령·검수·인수인계] → M130~M140 ★ Roldan (Site/POD/GRN/Backload)\n       ↓\n[비용 정산 완료] → M160 ★ 차민규 검토 + 정상욱 승인 / Finance Human-gate\n```\n\n---",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#3",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "2. 마일스톤별 책임 매트릭스",
    "text": "| 마일스톤 | 이름 | 주 책임 | 보조·증빙·검토 |\n|---------|------|---------|----------------|\n| M10 | Cargo Ready | Karthik | 정상욱 감독, 차민규 vendor 상태 확인 |\n| M20 | Packed / Marked | Karthik | 차민규 vendor PL 취합 보조 |\n| M30 | Pickup Completed | Karthik | Roldan/Jhysn/Ronnel 현장 정보 보조 |\n| M50 | Terminal Received | 차민규 | 정상욱 감독 |\n| M80 | ATA (입항) | Arvin | 정상욱 감독 |\n| M90 | BOE Submitted | Arvin | 정상욱 감독 |\n| M91 | BOE Cleared | Arvin | 정상욱 승인·감독 |\n| M92 | DO Released | Arvin | Roldan 현장 입차 준비 |\n| M100 | Gate-out | Arvin / Roldan / Karthik | kEn 배차 확인, Jhysn MOSB(VP24) 현장 차량·container 식별, Ronnel VP24 일부 gate pass 요청 정보 |\n| M110 | WH Received (WH In) | kEn | Karthik PL/DN/MTC 선행자료, Haitham SR 제출, 차민규 자재 현황 확인 |\n| M111 | Put-away | kEn | 정상욱 감독 |\n| M115 | MOSB Staged | Haitham | Jhysn은 MOSB(VP24) AGI/DAS 향 화물·야외 창고 현장 감독, Ronnel/ronpap20은 VP24 작업 상태 보고 |\n| M116 | LCT/Barge Loaded | Haitham | Jhysn은 container stuffing 감독, Ronnel/ronpap20은 VP24 stuffing·lifting 상태 보고 |\n| M117 | Sail-away Approved | Haitham | 정상욱 감독, Jhysn MOSB(VP24) 현장 상태 확인 |\n| M120 | Picked / Staged | kEn | Jhysn은 MOSB(VP24) staged 상태 감독, Ronnel/ronpap20은 VP24 stuffing/offloading/lifting 진행률 확인 |\n| M121 | Dispatched | kEn | Roldan 인수 대기 |\n| M130 | Site Arrived | Roldan | Jhysn은 AGI/DAS 출고 전 MOSB(VP24) 상태 증빙, Ronnel/ronpap20은 VP24 작업 완료 증빙 |\n| M131 | Site Inspected (Good) | Roldan | Jhysn MOSB(VP24) 출고 상태 증빙, Ronnel VP24 작업 증빙 |\n| M132 | Site Inspected (OSD) | Roldan | Jhysn MOSB(VP24) damage/bent 상태 감독, Ronnel VP24 작업 상태 보고 |\n| M140 | POD / GRN / Backload | Roldan | Ronnel/ronpap20 webbing sling 등 reusable gear 회수 요청, Jhysn MOSB 야외 창고 상태 확인, kEn 재고 이력 |\n| M150 | Claim Opened | Roldan | Arvin SIM claim, 정상욱 감독 |\n| M160 | Cost Closed | 차민규 검토 / 정상욱 승인 | Finance Human-gate, Invoice·기성 지급 증빙 확인 |\n\n> ★ = 주 책임자 / ◎ = 보조 또는 연관 역할\n\n---",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#4",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "3. RoutingPattern별 팀원 관여도",
    "text": "| RoutingPattern | 주 책임 흐름 | 보조·검토 |\n|----------------|--------------|-----------|\n| `DIRECT` | Arvin M90~92 → Roldan M130~140 | Karthik 국내 LPO 문서, Material Management 자재·vendor·M160 검토 |\n| `WH_ONLY` | Arvin M90~92 → kEn M110~121 → Roldan M130~140 | Karthik PL/DN/MTC, 차민규 자재 현황, Jhysn/Ronnel 현장 증빙 |\n| `MOSB_DIRECT` | Arvin M90~92 → Haitham M115~117 → Roldan M130~140 | Jhysn은 MOSB(VP24) AGI/DAS 향 화물 현장 감독, Ronnel/ronpap20은 VP24 작업상태 보고, 정상욱 감독 |\n| `WH_MOSB` | Arvin M90~92 → kEn M110~120 → Haitham M115~117 → Roldan M130~140 | Karthik DSV 야드 복구, 차민규 vendor·기성 검토, Jhysn은 MOSB 야외 창고·stuffing 감독, Ronnel은 VP24 담당 |\n| `MIXED` | 정상욱이 상황별 책임 경로 확정 | 각 담당자는 자기 milestone 증빙만 책임지고, 차민규는 비용·기성 검토를 M160에 연결 |\n\n---",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#5",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "4. 업무 영역 비교표",
    "text": "| 인물 | 도메인 | 핵심 산출물 / 확인값 | E2E 위치 |\n|------|--------|----------------------|----------|\n| 정상욱 / 상욱 / Shariff | 팀장 overlay | 전체 운영 지시, 승인, vessel/backload coordination | M10~M160 전체 감독 |\n| 차민규 / Minkyu | Material Management | 자재 현황, vendor coordination, 청구서 확인, 업체 기성 지급 검토 | M50~M130 + M160 |\n| Arvin | 해외 inbound 서류·통관 | BOE, DO, MSDS, FANR, MOIAT, EC, BL(Bill of Lading) | M80~M92 |\n| Karthik | 국내 LPO 중심 서류 | 국내 LPO, PL, DN, MTC, Revised PL, Gate Pass | M10~M30/M100 |\n| kEn / Ken | 창고·LPO 실행 | LPO 실행현황, WH Receipt, dispatch instruction | M100~M121 |\n| Haitham | 선박·MOSB | SR, LCT 위치보고, 선적완료, MOSB staging | M115~M117 |\n| Roldan / DaN | 현장 수령·Backload | POD, GRN, Backload, CCU 회수, OSD trigger | M130~M150 |\n| Jhysn / Jhason / Jason | MOSB(VP24) 현장 감독 | AGI/DAS 향 화물 현장 감독, container stuffing, MOSB 야외 창고 관리, exit pass 요청 정보 | M100/M115/M116/M120/M130/M140 감독·보조 |\n| Ronnel / ronpap20 | VP24 담당 | VP24 lifting, stuffing, offloading, crane/forklift 상태, webbing sling 회수 | M115/M116/M120/M130/M140 보조 |\n\n---",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#6",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "5-1. 중복 영역 (정상적 협력)",
    "text": "| 중복 업무 | 담당자 1 | 담당자 2 | 조율 방법 |\n|-----------|---------|---------|----------|\n| Gate/Exit Pass 처리 | Arvin (이메일 발송) | Roldan/kEn/Karthik (현장·창고·SCT 건별 실행) | Arvin은 문서 발송, Roldan은 MOSB 입차 준비, kEn은 창고·현장 실행, Karthik은 SCT/DSV 야드 Gate Pass 조율 |\n| LPO 처리 | kEn (창고·현장 실행 보고) | Karthik/Roldan (국내 LPO 서류·장비 LPO) | kEn은 운영표, Karthik은 국내 LPO 기반 PL/DN/MTC와 vendor status, Roldan은 장비 렌탈 LPO·timesheet |\n| TPI 문서 관리 | Arvin (추적·요청) | Haitham/kEn/Roldan (검사·납기·갱신 행정) | Arvin은 문서 추적, Haitham은 현장 검사, kEn은 Webbing Sling 납기, Roldan은 장비 TPI 갱신 SR |\n| 선적 트래킹 보고 | Arvin (해외·통관) | Haitham (선박·MOSB) | 구간별 분리 (통관 vs 해상) |\n| BL 용어 | Arvin (Bill of Lading) | Roldan/kEn (Backload) | Arvin 문서의 BL은 선하증권, Roldan/kEn 문서의 BL은 Backload로 구분 |\n| DSV Follow-up | Arvin (해외 inbound 통관·서류 조건 조율) | kEn/Roldan (창고·현장 실행) | Arvin은 DSV Minhaj와 해외 서류 미완료 건을 조율하고, kEn/Roldan은 출고·배송·수령 실행을 담당 |\n| DSV 야드 자재 복구 | Karthik (damaged box/HE case 수리 확인) | kEn/Roldan (창고 위치·현장 배송) | Karthik은 수리 확인과 delivery permission, kEn은 창고 상태 보고, Roldan은 현장 배송·수령 |\n| SR 처리 | Haitham (WELLS ID 기반 운영 SR) | Roldan/Karthik (장비·소모품·Gate Pass성 행정) | Haitham은 해상·창고 운영 SR, Roldan은 장비·소모품 SR/PR, Karthik은 Gate Pass 성격의 서비스 요청 보조 |\n| Delivery Coordination | Roldan (실제 배송 실행·수령 확인) | Arvin/kEn/Karthik (해외 통관·창고·국내 LPO 서류 선행 처리) | Arvin은 해외 통관·DSV 요청, kEn은 창고 출고 지시, Karthik은 국내 LPO 기반 PL/DN/MTC 제공, Roldan은 현장 수령 확인 |\n| Backload/CCU | Roldan (회수·반납·수거 실행) | kEn/Haitham (재고 보고·이력 확인) | Roldan은 Backload 운송과 폐기물 CCU 수거, kEn은 BL Laydown 보고, Haitham은 MOSB 작업 중 CCU 이력 확인 |",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#7",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "5-2. 잠재적 공백 (리스크)",
    "text": "| 공백 영역 | 문제 상황 | 권장 커버 |\n|-----------|---------|----------|\n| kEn 부재 시 LPO 처리 | 창고 협력사 작업 불가 | 상욱/Shariff가 긴급 LPO 승인 |\n| Karthik 부재 시 국내 LPO PL/DN/MTC 취합 | PL 없이는 un-stuffing 및 MRR 생성이 지연되고 국내 vendor 연락 창구가 공백화됨 | Khemlal(SCT)을 1차 백업으로 지정하고 국내 LPO vendor 연락처·PL tracker를 공유 |\n| Arvin 부재 시 통관 | BOE/DO 처리 전면 중단 | 사전 위임 절차 필요 |\n| Haitham 부재 시 선박 트래킹 | MOSB 계획 시야 상실 | Khemlal(SCT) 임시 대행 |\n| Roldan 부재 시 현장 수령·Backload | 현장 도착·검수·Backload 데이터가 끊김 | kEn/Nicole/Site team 기준 인수인계표 운영 |\n\n---",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#8",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "6. 온톨로지 클래스 책임 요약",
    "text": "| 온톨로지 클래스 | 주 담당자 |\n|----------------|---------|\n| `ActorRole.LogisticsTeamLeader` · `ApprovalAction` | **정상욱/상욱/Shariff** |\n| `MaterialMaster` · `Shipment` · `MilestoneEvent` | **차민규** 자재 현황 관리 |\n| `Invoice` · `InvoiceLine` · `CostTransaction` · `CostGuardResult` | **차민규** 청구서 확인·업체 기성 지급 검토 / **정상욱** 승인 |\n| `CustomsEntry` · `BOE` · `DO` | **Arvin** |\n| `PermitApplication` (FANR/MOIAT/EC) | **Arvin** |\n| 국내 `PackingList` · `DeliveryNote(DN)` · `MaterialTransferCertificate(MTC)` | **Karthik** |\n| `Container(CCU)` · `ServiceRequest(Gate Pass)` · `WarehouseTask(현장 검증)` | **Karthik** |\n| `WarehouseTask` · `WarehouseHandlingProfile` | **kEn** |\n| `LPO (LocalPurchaseOrder)` | **kEn** 실행 주 담당 / **Karthik** 국내 LPO 서류·vendor status / **Roldan** 장비 렌탈 LPO |\n| `ServiceRequest (SR)` · `MarineEvent` · `LCT` | **Haitham** 주 담당 / **Roldan** 장비·소모품 SR/PR 행정 |\n| `MilestoneEvent.M115~M117` | **Haitham** |\n| `SiteReceipt` · `POD` · `GRN` · `BackloadEvent` | **Roldan** |\n| `Exception (OSD/Damage)` → `Claim` | **Roldan** |\n| `FieldEvidence` · `CommunicationEvent` · `EquipmentStatusReport` | **Jhysn** MOSB(VP24) 현장 감독 증빙 / **Ronnel/ronpap20** VP24 handling 증빙 |\n| `OffshoreStaging` · `LaydownArea` · `StuffingEvent` | **Jhysn** MOSB 야외 창고·container stuffing 감독 |\n| `LiftingEvent` · `StuffingEvent` · `EquipmentResource` | **Ronnel/ronpap20** VP24 작업 담당 |\n\n---\n\n*본 문서는 `individual_rev`의 개인별 주요업무 문서 9개와 온톨로지 00/01 문서를 기준으로 통합 작성되었습니다.*\n\n<!-- 2026-04-27-10person-update -->",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#9",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "7. 2026-04-27 통합 역할 반영",
    "text": "> 기준 자료: `individual_rev` 개인별 주요업무 문서 + duckdb_query_results.json\n\n| 인물 | 추가 반영된 핵심 역할 | 기존 5명과의 경계 |\n|------|----------------------|------------------|\n| Jhysn | MOSB(VP24)에서 AGI/DAS 향 모든 화물의 현장 감독, container stuffing, MOSB 야외 창고 관리 | Ronnel/ronpap20은 VP24 담당, Haitham은 LCT/MOSB 해상 운영, Roldan은 최종 현장 수령 책임 |\n| Ronnel/ronpap20 | VP24 담당 — VP24 lifting, stuffing, offloading, forklift/crane 상태 확인 | Jhysn은 MOSB(VP24) 현장 감독, Roldan은 최종 현장 수령 책임, kEn은 창고 운영 |\n| 정상욱(Sanguk) | Team Lead overlay — 전체 팀 운영, vessel movement report, backload coordination | 상욱/Shariff 동일인으로서 물류팀 팀장 직무 전결 |\n| 차민규(Minkyu) | Material Management overlay — vendor coordination, 청구서 확인, 업체 기성 지급 검토 | Material Management 담당으로서 vendor·invoice/payment 검토 보조 |",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#10",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "7-1. 확장 E2E 보조 구간",
    "text": "| 구간 | 주 담당 | 보조·증빙 |\n|------|---------|----------|\n| M10 Cargo Ready | Karthik | 정상욱(Team Lead 관할shipment 확인) |\n| M20 Packed/Marked | Karthik | 차민규(vendor PL 취합 보조) |\n| M30 Pickup | Karthik | Roldan/Jhysn/Ronnel 현장 정보 보조 |\n| M80 ATA | Arvin | - |\n| M90 BOE Submitted | Arvin | - |\n| M100 Gate-out | Arvin/Roldan/Karthik | Jhysn은 MOSB(VP24) 현장 차량·container 식별 정보 제공 |\n| M110 WH Received | kEn | Haitham(SR 작성) |\n| M115 MOSB Staged | Haitham | Jhysn은 MOSB(VP24) AGI/DAS 향 화물·야외 창고 감독, Ronnel/ronpap20은 VP24 작업 상태 보고 |\n| M116 Loaded/Staged | Haitham | Jhysn은 container stuffing 감독, Ronnel/ronpap20은 VP24 stuffing/lifting 작업 상태 보고 |\n| M120 Picked/Staged | kEn | Jhysn은 MOSB(VP24) staged 상태 감독, Ronnel/ronpap20은 VP24 stuffing/offloading/lifting 진행률 확인 |\n| M130 Site Arrived | Roldan | Jhysn은 AGI/DAS 출고 전 MOSB(VP24) 상태 증빙, Ronnel/ronpap20은 VP24 작업 완료 증빙 |\n| M140 Backload | Roldan | Ronnel/ronpap20은 webbing sling 등 reusable gear 회수 요청 보조, Jhysn은 MOSB 야외 창고 상태 확인 |",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#11",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "7-2. 공백 리스크",
    "text": "| 공백 영역 | 영향 | 1차 보완 |\n|---------|------|----------|\n| Jhysn 부재 | MOSB(VP24)에서 AGI/DAS 향 화물, container stuffing, 야외 창고 현장 감독 공백 | Haitham이 MOSB 해상 운영 기준으로 임시 판단하고, Ronnel/ronpap20은 VP24 작업 상태를 별도 보고 |\n| Ronnel/ronpap20 부재 | VP24 lifting·stuffing·offloading 상태 확인이 늦어짐 | Jhysn이 MOSB(VP24) 현장 감독 기준으로 상태를 재확인하고 kEn이 창고 상태를 재확인 |\n| 정상욱(Team Lead) 부재 | 팀 전체 운영·승인· vessel movement 보고 공백 | Shariff(동일인)가 직접 운영 |\n| 차민규(Material mgmt) 부재 | vendor coordination·청구서 확인 차질 | 정상욱이 직접 vendor·invoice 검토 조율 |\n| Minkyu 부재 시 청구서/기성 지급 | 청구서 확인과 업체 기성 지급 검토 지연 가능성 | 정상욱/Shariff 승인 루틴으로 보완 |\n\n<!-- 2026-04-27-10person-update -->\n\n<!-- 2026-04-27-fmc-identity-matrix-start -->",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#12",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "8. 2026-04-27 FMC 조직도 식별 검증표",
    "text": "> 기준 자료: `../FMC_OrgChart_Data.json`\n> 개인정보 처리: 이메일/전화번호는 최종 배포본에서 마스킹한다.\n> DuckDB 기준: `email_search.duckdb` (OUTLOOK_HVDC_ALL_202409202510.xlsx 기반) — 직접 이메일 기준 / handle 언급 기준\n\n| 문서 기준 인물 | 대화·문서 표기 | 조직도 실명 | 조직도 직책 | SITE | 조직도 이메일 | ontology ActorRole | DuckDB 직접메일 | DuckDB handle검색 | 검증 상태 |\n|---|---|---|---|---|---|---|---|---|---|\n| 정상욱/상욱 | 정상욱/상욱/Jeong | Sanguk Jeong | Logistic Manager | MUSSAFAH | su***@samsung.com | `LogisticsTeamLeader` | 66건 | 4,513건 | 조직도 JSON + DuckDB 확인 |\n| 차민규 | 차민규/Minkyu | Minkyu Cha | Material Management | MUSSAFAH | mi***@samsung.com | `MaterialManagementCoordinator` | 0건 | 1,335건 | 조직도 JSON + DuckDB 확인 |\n| Arvin | Arvin | Arvin Q. Caadan | Logistics Officer | MUSSAFAH | ar***@samsung.com | `OverseasInboundDocsCoordinator` | - | - | 조직도 JSON 기준 확인 |\n| Karthik | Karthik, Karthik SCT Logistics | Karthik Raj | Storekeeper | MUSSAFAH | ka***@samsung.com | `DomesticLPODocumentController` | 557건 | 1,563건 | 조직도 JSON + DuckDB 확인 |\n| kEn | kEn | Ken Espiritu Lopez | FMC | MUSSAFAH | ke***@samsung.com | `WarehouseExecutionCoordinator` | - | - | 조직도 JSON 기준 확인 |\n| Roldan | Roldan, DaN | Roldan Mendoza | Logistics Officer | MUSSAFAH | rb***@samsung.com | `SiteReceivingCoordinator` | 1,563건 | 0건 | 조직도 JSON + DuckDB 확인 |\n| Haitham | Haitham | Haitham Mohammad Madaneya | Marine Supervisor | MUSSAFAH | ha***@samsung.com | `MarineMOSBCoordinator` | 783건 | 3,049건 | 조직도 JSON + DuckDB 확인 |\n| Jhysn | Jhysn, Jhason, Jason | Jhason Alim De Guzman | FMC | MUSSAFAH | jh***@samsung.com | `MOSBVP24FieldSupervisor` | 79건 | 0건 | 조직도 JSON + 사용자 역할 정정 반영 |\n| Ronnel | Ronnel, ronpap20 | Ronnel Papa Initan | Logistics Officer | MUSSAFAH | p.***@samsung.com | `FieldHandlingSupport` | - | - | 조직도 JSON + 대표 문서 병합 확인 |",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#13",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "8-1. DuckDB 이메일 주요 키워드 요약",
    "text": "| 인물 | Email | Gate Pass | Delivery | Backload | BL | CCU | LPO | TPI | Site |\n|------|-------|-----------|----------|----------|----|-----|-----|-----|------|\n| 정상욱(Sanguk) | su***@samsung.com | - | 887 | 989 | - | - | - | - | - |\n| 차민규(Minkyu) | mi***@samsung.com | - | - | - | - | - | - | - | - |\n| Arvin | ar***@samsung.com | - | - | - | - | - | - | - | - |\n| Karthik | ka***@samsung.com | 9 | 153 | - | 14 | 2 | 30 | 3 | 9 |\n| kEn | ke***@samsung.com | - | - | - | - | - | - | - | - |\n| Roldan | rb***@samsung.com | 15 | 421 | 92 | 21 | 32 | 41 | 30 | 47 |\n| Haitham | ha***@samsung.com | 45 | 124 | 2 | 8 | 1 | 13 | 79 | 9 |\n| Jhysn | jh***@samsung.com | - | - | - | 1 | - | - | - | - |\n| Ronnel/ronpap20 | p.***@samsung.com | 1 | 3 | 1 | 4 | 2 | 0 | - | - |",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  },
  {
    "id": "Team_역할분담_매트릭스#14",
    "docId": "Team_역할분담_매트릭스",
    "title": "HVDC 물류팀 역할분담 매트릭스",
    "version": "`2026-04-27` (Asia/Dubai).",
    "sectionPath": "8-2. Sanguk/Minkyu Team Lead overlay 역할 근거",
    "text": "**Sanguk (정상욱) DuckDB**:\n- Vessel/movement 1,738회 — vessel movement report 전결·배포\n- Backload 989회 — 전체 backload coordination 관할\n- ADNOC/FANR/MOIAT 관련 문서 다수\n- Top sites: AGI 1,313건, DAS 1,119건 — 전체 팀 운영 범위 반영\n\n**Minkyu (차민규) DuckDB**:\n- Material management keywords: logistics 341회, manager 264회, officer 194회\n- Jopetwil-Marine 32건 — LCT marine coordination 관련\n- haitham 244회, arvin 180회 — Material management로서 팀원들과의 협업 빈번\n- 사용자 확인 반영 — 청구서 확인 및 업체 기성 지급 검토를 주요 업무로 등록\n\n검증 판단: 팀 매트릭스는 역할 분담표이므로 전화번호는 포함하지 않는다. 조직도 실명·직책·이메일은 인물 식별 보조 근거로 사용하고, ontology 00/01 반영 시에는 ActorRole 중심으로 연결한다.\n<!-- 2026-04-27-fmc-identity-matrix-end -->",
    "docHash": "850efb35cb26d5e70d82fd0f43f948b124580e7f7097580f5d2d4311eef2f2db",
    "domains": [
      "communication",
      "operations",
      "team"
    ]
  }
] satisfies CorpusChunk[];
