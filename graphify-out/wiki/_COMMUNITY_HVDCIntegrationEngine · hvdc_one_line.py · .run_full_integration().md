---
type: community
cohesion: 0.11
members: 34
---

# HVDCIntegrationEngine · hvdc_one_line.py · .run_full_integration()

**Cohesion:** 0.11 - loosely connected
**Members:** 34 nodes

## Members
- [[.__init__()_2]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[.check_fuseki_health()_1]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[.extract_hvdc_codes_from_sources()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[.generate_case_triples()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[.generate_source_link_triples()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[.query_fuseki()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[.run_full_integration()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[.upload_ttl_to_fuseki()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[.validate_integration()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[DataFrame]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[DataFrame_1]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[Fuseki에서 SPARQL 쿼리 실행]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[HVDC CODE 추출 → 온톨로지 생성 → Fuseki 연동]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[HVDC CODE들로부터 Case 트리플 생성]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[HVDC 코드 표기 표준화 공백구분자 - '-', 대문자, 중복 '-' 축약, 'HVDC-' 접두 유지.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[HVDCIntegrationEngine]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[OFCO ALL INV, OFCO ALL INV.(1), OFCO ALL INV.2 등을 동일 소스로 정규화.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[Path_6]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[_apply_header_aliases()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[_extract_from_row_strings()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[_iter_paths()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[_logical_source_name()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[_normalize_code()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[_read_excel_all_sheets()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[create_sample_excel()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[demo_integration()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[demo_usage()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[hvdc-integration-demo.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[hvdc_one_line()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[hvdc_one_line.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[test_patterns()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[다양한 소스(OFCODSVPKGS기성 등)에서 HVDC CODE를 추출해 단일 DF로 반환.     - 입력 파일 경로디렉토리글롭 패]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py
- [[다양한 소스에서 HVDC CODE 추출]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc-integration-demo.py
- [[문자열(glob 허용)경로리스트 혼용 입력을 모두 Path 리스트로 확장.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_one_line.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/HVDCIntegrationEngine__hvdc_one_linepy__run_full_integration
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_write_audit() · hvdc_api.py · verify_audit_integrity()]]

## Top bridge nodes
- [[hvdc_one_line()]] - degree 13, connects to 1 community