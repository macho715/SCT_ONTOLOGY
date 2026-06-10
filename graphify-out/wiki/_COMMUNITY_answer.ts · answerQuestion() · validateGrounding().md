---
type: community
cohesion: 0.09
members: 44
---

# answer.ts · answerQuestion() · validateGrounding()

**Cohesion:** 0.09 - loosely connected
**Members:** 44 nodes

## Members
- [[DOMAIN_RULES]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[DomainHint]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[EvidenceTraceItem]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[GENERIC_QUERY_TERMS]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[GraphPath]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[IntentCode]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[IntentRoute]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[RULEPACK_REGISTRY]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[ResolvedEntity]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[SYSTEM_COMPONENTS]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[SYSTEM_INTENTS]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[SYSTEM_INTENTS_1]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[TRACE_GENERIC_TERMS]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[answer.ts]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[answerQuestion()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[ask()]] - code - SCT_ONTOLOGY-main/tests/pipeline.test.ts
- [[buildEvidenceTrace()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[buildGraphPath()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[buildIntentActions()]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[classifyIntent()]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[composeSummary()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[decision-card-attach.test.ts]] - code - SCT_ONTOLOGY-main/tests/decision-card-attach.test.ts
- [[deriveVerdict()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[hasAmbiguousAnyKey()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[hasEvidenceSupport()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[hasP2LeakageRisk()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[intent-router.test.ts]] - code - SCT_ONTOLOGY-main/tests/intent-router.test.ts
- [[isDailyLogisticsKpiQuestion()]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[isEmailDraftRequest()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[isEmailExternalSendRequest()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[isExplicitInvoiceCostAuditQuestion()]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[isP2NdaExposureQuestion()]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[maskPii()]] - code - SCT_ONTOLOGY-main/server/src/redact.ts
- [[matchingEvidenceIds()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[p2-zero-gate.test.ts]] - code - SCT_ONTOLOGY-main/tests/p2-zero-gate.test.ts
- [[redact.ts]] - code - SCT_ONTOLOGY-main/server/src/redact.ts
- [[resolveAnyKey()]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[resolveRulePackIds()]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[routeQuestion()]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[router.ts]] - code - SCT_ONTOLOGY-main/server/src/router.ts
- [[sha256()_2]] - code - SCT_ONTOLOGY-main/server/src/redact.ts
- [[systemDiagnosticPrompts]] - code - SCT_ONTOLOGY-main/tests/intent-router.test.ts
- [[tokenizeForSupport()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts
- [[validateGrounding()]] - code - SCT_ONTOLOGY-main/server/src/answer.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/answerts__answerQuestion__validateGrounding
SORT file.name ASC
```

## Connections to other communities
- 14 edges to [[_COMMUNITY_corpus.ts · searchCorpus() · fmc-role-corpus.test.ts]]
- 12 edges to [[_COMMUNITY_decision-card.ts · deriveIntentGroup() · deriveHumanGateState()]]
- 12 edges to [[_COMMUNITY_shipment-rule.ts · evaluateShipmentRule() · buildRisks()]]
- 9 edges to [[_COMMUNITY_hvdc-server.ts · caseStatusAnswer() · buildAuditRecord()]]
- 8 edges to [[_COMMUNITY_claude-server.ts · claude-render.ts · renderAnswerMarkdown()]]
- 7 edges to [[_COMMUNITY_identifier-normalizer.ts · expandIdentifierVariants() · normalizeLookupToken()]]
- 6 edges to [[_COMMUNITY_evals.test.ts · sct-governance-runtime.test.ts · answerToText()]]
- 5 edges to [[_COMMUNITY_shipment-validation.ts · mergeShipmentValidation() · ValidationFinding]]
- 3 edges to [[_COMMUNITY_report-sct-card.ts · main() · renderMetricsReport()]]
- 3 edges to [[_COMMUNITY_index.ts · descriptor.test.ts · createHvdcServer()]]
- 2 edges to [[_COMMUNITY_worker.ts · authContext() · WriteFileDryRunResult]]

## Top bridge nodes
- [[answer.ts]] - degree 59, connects to 10 communities
- [[answerQuestion()]] - degree 28, connects to 8 communities
- [[router.ts]] - degree 28, connects to 5 communities
- [[ResolvedEntity]] - degree 6, connects to 4 communities
- [[DomainHint]] - degree 5, connects to 4 communities