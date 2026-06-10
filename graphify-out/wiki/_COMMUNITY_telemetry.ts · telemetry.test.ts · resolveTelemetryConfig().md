---
type: community
cohesion: 0.33
members: 9
---

# telemetry.ts · telemetry.test.ts · resolveTelemetryConfig()

**Cohesion:** 0.33 - loosely connected
**Members:** 9 nodes

## Members
- [[DEFAULT_EMPTY_HEADER]] - code - SCT_ONTOLOGY-main/server/src/telemetry.ts
- [[OTelEnv]] - code - SCT_ONTOLOGY-main/server/src/telemetry.ts
- [[OtelConfig]] - code - SCT_ONTOLOGY-main/server/src/telemetry.ts
- [[hasTelemetryEndpoint()]] - code - SCT_ONTOLOGY-main/server/src/telemetry.ts
- [[parseHeaderPairs()]] - code - SCT_ONTOLOGY-main/server/src/telemetry.ts
- [[resolveTelemetryConfig()]] - code - SCT_ONTOLOGY-main/server/src/telemetry.ts
- [[telemetry.test.ts]] - code - SCT_ONTOLOGY-main/tests/telemetry.test.ts
- [[telemetry.ts]] - code - SCT_ONTOLOGY-main/server/src/telemetry.ts
- [[withSpan()]] - code - SCT_ONTOLOGY-main/server/src/telemetry.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/telemetryts__telemetrytestts__resolveTelemetryConfig
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_hvdc-server.ts · caseStatusAnswer() · buildAuditRecord()]]
- 2 edges to [[_COMMUNITY_index.ts · descriptor.test.ts · createHvdcServer()]]
- 2 edges to [[_COMMUNITY_worker.ts · authContext() · WriteFileDryRunResult]]

## Top bridge nodes
- [[telemetry.ts]] - degree 10, connects to 2 communities
- [[resolveTelemetryConfig()]] - degree 5, connects to 1 community
- [[telemetry.test.ts]] - degree 5, connects to 1 community
- [[withSpan()]] - degree 3, connects to 1 community