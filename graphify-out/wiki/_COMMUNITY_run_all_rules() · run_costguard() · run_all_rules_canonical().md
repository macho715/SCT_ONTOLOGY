---
type: community
cohesion: 0.22
members: 17
---

# run_all_rules() · run_costguard() · run_all_rules_canonical()

**Cohesion:** 0.22 - loosely connected
**Members:** 17 nodes

## Members
- [[.test_cert_check_should_validate_required_certificates()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_costguard_should_detect_price_deviations()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_hs_risk_should_identify_high_risk_codes()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[Any_10]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py
- [[CertChk가 필수 인증서를 검증해야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[CostGuard가 가격 편차를 정확히 탐지해야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[DataFrame_2]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py
- [[HS Risk가 고위험 코드를 식별해야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[Run existing rules and adapt the result for future MCP public output.      Exist]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py
- [[TestBusinessRules]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[df_items item-level DataFrame with columns including 'SOURCE_FILE','HVDC_CODE']] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py
- [[hvdc_rules.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py
- [[run_all_rules()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py
- [[run_all_rules_canonical()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py
- [[run_cert_check()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py
- [[run_costguard()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py
- [[run_hs_risk()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_rules.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/run_all_rules__run_costguard__run_all_rules_canonical
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_write_audit() · hvdc_api.py · verify_audit_integrity()]]
- 1 edge to [[_COMMUNITY_system_health_check.py · main() · Any]]
- 1 edge to [[_COMMUNITY_test_nlq_queries() · test_integration.py · test_end_to_end_integration()]]
- 1 edge to [[_COMMUNITY_hvdc_semantic_adapter.py · no_evidence_result() · adapt_invoice_risk()]]
- 1 edge to [[_COMMUNITY_test_hvdc_api.py · TestNLQEndpoint · TestIngestEndpoint]]

## Top bridge nodes
- [[run_all_rules()]] - degree 10, connects to 3 communities
- [[run_all_rules_canonical()]] - degree 6, connects to 1 community
- [[TestBusinessRules]] - degree 4, connects to 1 community