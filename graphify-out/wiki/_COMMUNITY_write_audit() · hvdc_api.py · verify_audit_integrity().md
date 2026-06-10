---
type: community
cohesion: 0.10
members: 31
---

# write_audit() · hvdc_api.py · verify_audit_integrity()

**Cohesion:** 0.10 - loosely connected
**Members:** 31 nodes

## Members
- [[Any_3]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[Enhanced audit logging with security and compliance features      Args]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[Get Fuseki graph statistics]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[PIINDA 민감 정보 마스킹 (MACHO-GPT 보안 표준)]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[POST payload       {case_ids SAMPLE1,SAMPLE2, actor user1}     or]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[Path_4]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[Payload     - files multipart upload OR {path mntdatauploaded.xlsx} in]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[Return extraction traces for a logical source (case_id), plus optional SPARQL tr]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[Safe Fuseki deployment with staging → validation → swap]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[Validate staging data without deployment]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[Very small NLQ - SPARQL POC     payload {qShow invoices where BOE != CIPL]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[audit_logger.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[audit_summary()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[audit_verify()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[calculate_integrity_hash()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[check_audit_system()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/system_health_check.py
- [[evidence()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[fuseki_deploy()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[fuseki_stats()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[fuseki_validate()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[get_audit_summary()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[health()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[hvdc_api.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[ingest()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[nlq()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[run_rules()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[sanitize_sensitive_data()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[verify_audit_integrity()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[write_audit()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py
- [[감사 로그 요약 정보 조회     Query params hours (기본 24시간)]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_api.py
- [[지정 시간 내 감사 로그 요약 (KPI 모니터링용)]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_logger.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/write_audit__hvdc_apipy__verify_audit_integrity
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_FusekiSwapManager · .deploy_with_validation() · main()]]
- 3 edges to [[_COMMUNITY_system_health_check.py · main() · Any]]
- 1 edge to [[_COMMUNITY_test_hvdc_api.py · TestNLQEndpoint · TestIngestEndpoint]]
- 1 edge to [[_COMMUNITY_write_hash_meta() · audit_ndjson_and_hash.py · verify_hash()]]
- 1 edge to [[_COMMUNITY_HVDCIntegrationEngine · hvdc_one_line.py · .run_full_integration()]]
- 1 edge to [[_COMMUNITY_run_all_rules() · run_costguard() · run_all_rules_canonical()]]

## Top bridge nodes
- [[ingest()]] - degree 6, connects to 3 communities
- [[write_audit()]] - degree 12, connects to 1 community
- [[check_audit_system()]] - degree 6, connects to 1 community
- [[fuseki_deploy()]] - degree 4, connects to 1 community
- [[fuseki_validate()]] - degree 4, connects to 1 community