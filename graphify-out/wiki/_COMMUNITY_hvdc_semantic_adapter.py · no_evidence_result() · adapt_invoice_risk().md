---
type: community
cohesion: 0.15
members: 27
---

# hvdc_semantic_adapter.py · no_evidence_result() · adapt_invoice_risk()

**Cohesion:** 0.15 - loosely connected
**Members:** 27 nodes

## Members
- [[Any_11]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[Canonical semantic adapter for local HVDC prototype outputs.  The adapter is int]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[Convert existing hvdc_rules.run_all_rules output into canonical risk evidence.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[Convert supported local NLQSPARQL result rows into canonical read-only output.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/nlq_to_sparql.py
- [[Infer a coarse routing pattern from local locations without using Flow Code.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[Map local CaseTransportEvent timeline output to canonical shipment context.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[Map local StockSnapshot rows to canonical warehouse evidence.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[Map local invoice and rule alerts to canonical CostGuard evidence.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[Represent missing, ambiguous, or conflicting joins without forcing an answer.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[Return a canonical no-evidence response.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[Return a stable deep copy for fixture comparisons.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[_evidence_ref()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[_identifier()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[_max_severity()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[_number_or_zero()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[_walk()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[adapt_case_timeline()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[adapt_invoice_risk()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[adapt_stock_snapshot()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[adapt_uncertain_join()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[canonicalize_nlq_query_result()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/nlq_to_sparql.py
- [[canonicalize_rule_results()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[hvdc_semantic_adapter.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[infer_routing_pattern()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[no_evidence_result()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[normalized_copy()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_semantic_adapter.py
- [[test_no_evidence_state_should_not_force_a_join()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_semantic_adapter.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/hvdc_semantic_adapterpy__no_evidence_result__adapt_invoice_risk
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_hvdc_any_key_resolver.py · normalize_identifier_value() · _mask_payload()]]
- 4 edges to [[_COMMUNITY_validate_public_output() · test_semantic_adapter.py · test_adapter_fixtures_should_match_expected_canonical_output()]]
- 3 edges to [[_COMMUNITY_nlq_to_sparql.py · safe_execute_workflow() · generate_sparql()]]
- 1 edge to [[_COMMUNITY_run_all_rules() · run_costguard() · run_all_rules_canonical()]]

## Top bridge nodes
- [[hvdc_semantic_adapter.py]] - degree 15, connects to 1 community
- [[Any_11]] - degree 12, connects to 1 community
- [[no_evidence_result()]] - degree 10, connects to 1 community
- [[adapt_uncertain_join()]] - degree 8, connects to 1 community
- [[canonicalize_nlq_query_result()]] - degree 7, connects to 1 community