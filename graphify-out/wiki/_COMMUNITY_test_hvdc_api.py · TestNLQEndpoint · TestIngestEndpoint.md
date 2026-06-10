---
type: community
cohesion: 0.08
members: 25
---

# test_hvdc_api.py · TestNLQEndpoint · TestIngestEndpoint

**Cohesion:** 0.08 - loosely connected
**Members:** 25 nodes

## Members
- [[.test_audit_logger_should_record_actions()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_evidence_should_return_case_traces()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_health_endpoint_should_return_ok_when_system_healthy()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_ingest_should_accept_json_path_input()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_ingest_should_require_file_when_no_path_provided()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_nlq_should_handle_boe_cipl_queries()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_nlq_should_reject_unsupported_queries()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_run_rules_should_execute_all_business_rules()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[.test_run_rules_should_handle_empty_data_gracefully()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[BOE와 CIPL 관련 자연어 쿼리를 처리해야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[JSON 형태로 파일 경로를 받아 처리해야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[TestAuditLogging]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[TestEvidenceEndpoint]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[TestHealthEndpoint]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[TestIngestEndpoint]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[TestNLQEndpoint]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[TestRulesEndpoint]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[client()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[sample_data()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[test_hvdc_api.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[데이터가 없을 때 적절한 에러를 반환해야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[비즈니스 룰을 실행하고 결과를 반환해야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[시스템이 정상일 때 헬스체크가 OK를 반환해야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[케이스 ID로 추출 증적을 조회할 수 있어야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py
- [[파일 경로가 없을 때 파일 업로드가 필요함을 알려야 함]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_hvdc_api.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/test_hvdc_apipy__TestNLQEndpoint__TestIngestEndpoint
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_write_audit() · hvdc_api.py · verify_audit_integrity()]]
- 1 edge to [[_COMMUNITY_run_all_rules() · run_costguard() · run_all_rules_canonical()]]

## Top bridge nodes
- [[test_hvdc_api.py]] - degree 9, connects to 1 community
- [[.test_audit_logger_should_record_actions()]] - degree 2, connects to 1 community