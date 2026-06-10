---
type: community
cohesion: 0.21
members: 15
---

# corpus.ts · searchCorpus() · fmc-role-corpus.test.ts

**Cohesion:** 0.21 - loosely connected
**Members:** 15 nodes

## Members
- [[CorpusChunk]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[EvidenceScore]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[OPERATIONAL_ACTION_TERMS]] - code - SCT_ONTOLOGY-main/server/src/corpus.ts
- [[buildEvidenceScore()]] - code - SCT_ONTOLOGY-main/server/src/corpus.ts
- [[clamp01()]] - code - SCT_ONTOLOGY-main/server/src/corpus.ts
- [[corpus-data.ts]] - code - SCT_ONTOLOGY-main/server/src/generated/corpus-data.ts
- [[corpus.ts]] - code - SCT_ONTOLOGY-main/server/src/corpus.ts
- [[evidence-ranker.test.ts]] - code - SCT_ONTOLOGY-main/tests/evidence-ranker.test.ts
- [[fmc-role-corpus.test.ts]] - code - SCT_ONTOLOGY-main/tests/fmc-role-corpus.test.ts
- [[loadCorpus()]] - code - SCT_ONTOLOGY-main/server/src/corpus.ts
- [[renderedAnswerText()_1]] - code - SCT_ONTOLOGY-main/tests/fmc-role-corpus.test.ts
- [[searchCorpus()]] - code - SCT_ONTOLOGY-main/server/src/corpus.ts
- [[supportStateFor()]] - code - SCT_ONTOLOGY-main/server/src/corpus.ts
- [[tokenize()]] - code - SCT_ONTOLOGY-main/server/src/corpus.ts
- [[topThreeDirectSupportRatio()]] - code - SCT_ONTOLOGY-main/tests/evidence-ranker.test.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/corpusts__searchCorpus__fmc-role-corpustestts
SORT file.name ASC
```

## Connections to other communities
- 14 edges to [[_COMMUNITY_answer.ts · answerQuestion() · validateGrounding()]]
- 4 edges to [[_COMMUNITY_decision-card.ts · deriveIntentGroup() · deriveHumanGateState()]]
- 2 edges to [[_COMMUNITY_claude-server.ts · claude-render.ts · renderAnswerMarkdown()]]
- 2 edges to [[_COMMUNITY_hvdc-server.ts · caseStatusAnswer() · buildAuditRecord()]]
- 1 edge to [[_COMMUNITY_shipment-rule.ts · evaluateShipmentRule() · buildRisks()]]

## Top bridge nodes
- [[corpus.ts]] - degree 20, connects to 5 communities
- [[searchCorpus()]] - degree 10, connects to 3 communities
- [[fmc-role-corpus.test.ts]] - degree 7, connects to 1 community
- [[evidence-ranker.test.ts]] - degree 5, connects to 1 community
- [[loadCorpus()]] - degree 4, connects to 1 community