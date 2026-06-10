---
type: community
cohesion: 0.07
members: 56
---

# decision-card.ts · deriveIntentGroup() · deriveHumanGateState()

**Cohesion:** 0.07 - loosely connected
**Members:** 56 nodes

## Members
- [[APPROVAL_PENDING_BLOCKED]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[ActionGateEvaluation]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[ActionItem]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[ActionStatus]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[ApprovalStatus]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[BlockedByEntry]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[CacheConfig]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[CardVerdict]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[DataClass]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[DecisionCardPayload]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[DecisionCardSecurity]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[DecisionCardTrace]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[DecisionRule]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[EvidenceCoverageItem]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[EvidenceDomainStatus]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[ExportType]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[FinalGovernanceVerdict]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[HumanGateState]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[IntentGroup]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[PII_RISK_BLOCKED]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[PiiStatus]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[REASON_CODE_TO_RULE]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[RULE_MATRIX]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[RulePackExecutionItem]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[SYSTEM_QA_INTENTS]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[SecurityStatus]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[ShipmentRuleStatus]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[ShipmentRuleSupportLevel]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[UiAnswerState]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[VerdictMappingRule]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[WriteBackMode]] - code - SCT_ONTOLOGY-main/server/src/types.ts
- [[ZERO_GATE_BLOCKED]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[baseDerive]] - code - SCT_ONTOLOGY-main/tests/decision-card.test.ts
- [[buildBlockedActions()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[buildBlockedByEntries()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[buildEvidenceCoverage()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[buildRulePackExecution()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[buildUnblockSummary()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[decision-card.test.ts]] - code - SCT_ONTOLOGY-main/tests/decision-card.test.ts
- [[decision-card.ts]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[deriveHumanGateState()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[deriveIntentGroup()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[deriveNextAction()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[derivePiiStatus()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[deriveSecurity()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[deriveVerdict()_1]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[deterministicSourceHash()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[evaluateActionGate()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[makeAnswer()]] - code - SCT_ONTOLOGY-main/tests/decision-card.test.ts
- [[mapActions()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[mapGovernanceVerdict()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[pickHighestSeverity()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[resolveRuleForFinding()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[toDecisionCardPayload()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[truncate()]] - code - SCT_ONTOLOGY-main/server/src/decision-card.ts
- [[types.ts]] - code - SCT_ONTOLOGY-main/server/src/types.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/decision-cardts__deriveIntentGroup__deriveHumanGateState
SORT file.name ASC
```

## Connections to other communities
- 12 edges to [[_COMMUNITY_answer.ts · answerQuestion() · validateGrounding()]]
- 11 edges to [[_COMMUNITY_doc-guardian.ts · cost-guard.ts · checkDocGuardian()]]
- 8 edges to [[_COMMUNITY_claude-server.ts · claude-render.ts · renderAnswerMarkdown()]]
- 5 edges to [[_COMMUNITY_shipment-validation.ts · mergeShipmentValidation() · ValidationFinding]]
- 5 edges to [[_COMMUNITY_shipment-rule.ts · evaluateShipmentRule() · buildRisks()]]
- 5 edges to [[_COMMUNITY_evals.test.ts · sct-governance-runtime.test.ts · answerToText()]]
- 4 edges to [[_COMMUNITY_corpus.ts · searchCorpus() · fmc-role-corpus.test.ts]]
- 4 edges to [[_COMMUNITY_mosb-gate.ts · checkMosbGate() · normalize()]]
- 3 edges to [[_COMMUNITY_team-action-router.ts · routeTeamAction() · parseMilestoneCode()]]
- 1 edge to [[_COMMUNITY_report-sct-card.ts · main() · renderMetricsReport()]]
- 1 edge to [[_COMMUNITY_hvdc-server.ts · caseStatusAnswer() · buildAuditRecord()]]
- 1 edge to [[_COMMUNITY_worker.ts · authContext() · WriteFileDryRunResult]]

## Top bridge nodes
- [[types.ts]] - degree 77, connects to 12 communities
- [[decision-card.ts]] - degree 56, connects to 5 communities
- [[toDecisionCardPayload()]] - degree 19, connects to 1 community
- [[decision-card.test.ts]] - degree 14, connects to 1 community