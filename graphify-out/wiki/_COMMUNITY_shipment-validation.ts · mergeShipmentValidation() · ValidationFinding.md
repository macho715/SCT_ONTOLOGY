---
type: community
cohesion: 0.36
members: 8
---

# shipment-validation.ts · mergeShipmentValidation() · ValidationFinding

**Cohesion:** 0.36 - loosely connected
**Members:** 8 nodes

## Members
- [[ActionRecommendation]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[ShipmentValidationMerge]] - code - SCT_ONTOLOGY-main/server/src/shipment-validation.ts
- [[ValidationFinding]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[exposureNumber()]] - code - SCT_ONTOLOGY-main/server/src/shipment-validation.ts
- [[mergeShipmentValidation()]] - code - SCT_ONTOLOGY-main/server/src/shipment-validation.ts
- [[riskSeverity()]] - code - SCT_ONTOLOGY-main/server/src/shipment-validation.ts
- [[riskText()]] - code - SCT_ONTOLOGY-main/server/src/shipment-validation.ts
- [[shipment-validation.ts]] - code - SCT_ONTOLOGY-main/server/src/shipment-validation.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/shipment-validationts__mergeShipmentValidation__ValidationFinding
SORT file.name ASC
```

## Connections to other communities
- 5 edges to [[_COMMUNITY_answer.ts · answerQuestion() · validateGrounding()]]
- 5 edges to [[_COMMUNITY_decision-card.ts · deriveIntentGroup() · deriveHumanGateState()]]
- 3 edges to [[_COMMUNITY_shipment-rule.ts · evaluateShipmentRule() · buildRisks()]]
- 2 edges to [[_COMMUNITY_claude-server.ts · claude-render.ts · renderAnswerMarkdown()]]

## Top bridge nodes
- [[shipment-validation.ts]] - degree 11, connects to 3 communities
- [[ActionRecommendation]] - degree 5, connects to 3 communities
- [[ValidationFinding]] - degree 5, connects to 3 communities
- [[mergeShipmentValidation()]] - degree 6, connects to 2 communities