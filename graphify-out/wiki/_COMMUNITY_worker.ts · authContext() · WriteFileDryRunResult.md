---
type: community
cohesion: 0.04
members: 59
---

# worker.ts · authContext() · WriteFileDryRunResult

**Cohesion:** 0.04 - loosely connected
**Members:** 59 nodes

## Members
- [[CompleteUploadInput]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[ControlTowerActionRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerCanonicalEventRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerCaseCardRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerDestinationRequirement]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[ControlTowerDestinationRequirementRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerLatestStatusRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerMilestoneDetailRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerMilestoneRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerReceiptEventRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerShipmentRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerShipmentUnit]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[ControlTowerSiteIntakeRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerSiteReceiptSummary]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[ControlTowerValidationFinding]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[ControlTowerValidationLogRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[ControlTowerWarehouseDates]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[ControlTowerWhDwellRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[CreateUploadUrlInput]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[Env]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[HvdcControlTowerLookup]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[HvdcProtectedStorage]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[UploadTokenRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[UploadedFileRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[WriteFileCommitInput]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[WriteFileCommitResult]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[WriteFileDryRunInput]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[WriteFileDryRunResult]] - code - SCT_ONTOLOGY-main/server/src/hvdc-server.ts
- [[WriteProposalRow]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[actionRowToProposal()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[authContext()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[canonicalEventRowToReport()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[corsOrigin()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[createProtectedStorage()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[destinationRowToRequirement()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[firstMilestoneByCode()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[firstMilestoneDate()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[handleDirectUpload()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[handler]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[healthResponse()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[jsonHeaders()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[milestoneRowToEvent()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[normalizeManagedPath()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[oauthMetadata()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[parseCaseCard()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[randomToken()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[receiptRowToEvent()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[safeFileName()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[sha256Hex()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[shipmentDatesFromMilestones()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[shipmentReportStatus()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[shipmentRowToUnit()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[siteReceiptSummary()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[storageUnavailable()_1]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[uploadAuthRequired()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[validationRowToFinding()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[warehouseDatesFromMilestones()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[worker.ts]] - code - SCT_ONTOLOGY-main/server/src/worker.ts
- [[writeD1Audit()]] - code - SCT_ONTOLOGY-main/server/src/worker.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/workerts__authContext__WriteFileDryRunResult
SORT file.name ASC
```

## Connections to other communities
- 24 edges to [[_COMMUNITY_hvdc-server.ts · caseStatusAnswer() · buildAuditRecord()]]
- 4 edges to [[_COMMUNITY_identifier-normalizer.ts · expandIdentifierVariants() · normalizeLookupToken()]]
- 4 edges to [[_COMMUNITY_kv-cache.test.ts · kv-cache.ts · createControlTowerLookup()]]
- 4 edges to [[_COMMUNITY_rate-limit.ts · applyRateLimit() · worker-rate-limit.test.ts]]
- 2 edges to [[_COMMUNITY_answer.ts · answerQuestion() · validateGrounding()]]
- 2 edges to [[_COMMUNITY_index.ts · descriptor.test.ts · createHvdcServer()]]
- 2 edges to [[_COMMUNITY_mosb-gate.ts · checkMosbGate() · normalize()]]
- 2 edges to [[_COMMUNITY_team-action-router.ts · routeTeamAction() · parseMilestoneCode()]]
- 2 edges to [[_COMMUNITY_telemetry.ts · telemetry.test.ts · resolveTelemetryConfig()]]
- 1 edge to [[_COMMUNITY_decision-card.ts · deriveIntentGroup() · deriveHumanGateState()]]

## Top bridge nodes
- [[worker.ts]] - degree 92, connects to 10 communities
- [[CompleteUploadInput]] - degree 2, connects to 1 community
- [[ControlTowerDestinationRequirement]] - degree 2, connects to 1 community
- [[ControlTowerShipmentUnit]] - degree 2, connects to 1 community
- [[ControlTowerSiteReceiptSummary]] - degree 2, connects to 1 community