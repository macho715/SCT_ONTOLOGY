---
type: community
cohesion: 0.07
members: 41
---

# claude-server.ts · claude-render.ts · renderAnswerMarkdown()

**Cohesion:** 0.07 - loosely connected
**Members:** 41 nodes

## Members
- [[FAILURE_STATUSES]] - code - SCT_ONTOLOGY-main/server/src/ui.ts
- [[GroundedAnswer]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[HVDC_CLAUDE_TOOL_NAMES]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[ROOT_2]] - code - SCT_ONTOLOGY-main/tests/claude-descriptor.test.ts
- [[UiRenderStatus]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[__dirname]] - code - SCT_ONTOLOGY-main/tests/claude-descriptor.test.ts
- [[answerOutputSchema]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[approvalSchema]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[buildEvidenceLabels()]] - code - SCT_ONTOLOGY-main/server/src/claude-render.ts
- [[buildUiState()]] - code - SCT_ONTOLOGY-main/server/src/ui.ts
- [[chatGptFormatInput]] - code - SCT_ONTOLOGY-main/tests/claude-descriptor.test.ts
- [[claude-descriptor.test.ts]] - code - SCT_ONTOLOGY-main/tests/claude-descriptor.test.ts
- [[claude-render.ts]] - code - SCT_ONTOLOGY-main/server/src/claude-render.ts
- [[claude-server.ts]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[claudeFormatInput]] - code - SCT_ONTOLOGY-main/tests/claude-descriptor.test.ts
- [[claudeHttpServer]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[createClaudeServer()]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[decisionCardSchema]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[domainEnum]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[evidenceSchema]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[evidenceScoreSchema]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[evidenceTraceSchema]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[intentEnum]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[logUiRenderFailure()]] - code - SCT_ONTOLOGY-main/server/src/ui.ts
- [[minimalAnswer]] - code - SCT_ONTOLOGY-main/tests/claude-descriptor.test.ts
- [[parseGroundedAnswer()]] - code - SCT_ONTOLOGY-main/server/src/claude-render.ts
- [[port_1]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[protectedOutputSchema]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[renderActions()]] - code - SCT_ONTOLOGY-main/server/src/claude-render.ts
- [[renderAnswerMarkdown()]] - code - SCT_ONTOLOGY-main/server/src/claude-render.ts
- [[renderEvidence()]] - code - SCT_ONTOLOGY-main/server/src/claude-render.ts
- [[renderEvidenceTrace()]] - code - SCT_ONTOLOGY-main/server/src/claude-render.ts
- [[renderValidation()]] - code - SCT_ONTOLOGY-main/server/src/claude-render.ts
- [[routeSchema]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[startClaudeHttpServer()]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[startClaudeStdioServer()]] - code - SCT_ONTOLOGY-main/server/src/claude-server.ts
- [[submission]] - code - SCT_ONTOLOGY-main/tests/claude-descriptor.test.ts
- [[tracedAnswer]] - code - SCT_ONTOLOGY-main/tests/claude-descriptor.test.ts
- [[ui.ts]] - code - SCT_ONTOLOGY-main/server/src/ui.ts
- [[verdictBadge()]] - code - SCT_ONTOLOGY-main/server/src/claude-render.ts
- [[withUiState()]] - code - SCT_ONTOLOGY-main/server/src/ui.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/claude-serverts__claude-renderts__renderAnswerMarkdown
SORT file.name ASC
```

## Connections to other communities
- 8 edges to [[_COMMUNITY_answer.ts · answerQuestion() · validateGrounding()]]
- 8 edges to [[_COMMUNITY_decision-card.ts · deriveIntentGroup() · deriveHumanGateState()]]
- 4 edges to [[_COMMUNITY_hvdc-server.ts · caseStatusAnswer() · buildAuditRecord()]]
- 3 edges to [[_COMMUNITY_shipment-rule.ts · evaluateShipmentRule() · buildRisks()]]
- 2 edges to [[_COMMUNITY_shipment-validation.ts · mergeShipmentValidation() · ValidationFinding]]
- 2 edges to [[_COMMUNITY_corpus.ts · searchCorpus() · fmc-role-corpus.test.ts]]
- 1 edge to [[_COMMUNITY_report-sct-card.ts · main() · renderMetricsReport()]]
- 1 edge to [[_COMMUNITY_evals.test.ts · sct-governance-runtime.test.ts · answerToText()]]

## Top bridge nodes
- [[claude-server.ts]] - degree 32, connects to 4 communities
- [[GroundedAnswer]] - degree 10, connects to 4 communities
- [[claude-render.ts]] - degree 15, connects to 3 communities
- [[ui.ts]] - degree 9, connects to 3 communities
- [[withUiState()]] - degree 4, connects to 2 communities