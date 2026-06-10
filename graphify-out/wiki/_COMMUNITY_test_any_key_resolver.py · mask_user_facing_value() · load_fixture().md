---
type: community
cohesion: 0.29
members: 10
---

# test_any_key_resolver.py · mask_user_facing_value() · load_fixture()

**Cohesion:** 0.29 - loosely connected
**Members:** 10 nodes

## Members
- [[Return a masked string suitable for user-facing evidence excerpts.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_any_key_resolver.py
- [[load_fixture()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_any_key_resolver.py
- [[mask_user_facing_value()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_any_key_resolver.py
- [[test_any_key_resolver.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_any_key_resolver.py
- [[test_matched_result_should_include_source_confidence_evidence_and_privacy()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_any_key_resolver.py
- [[test_missing_supported_key_should_not_force_a_join()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_any_key_resolver.py
- [[test_privacy_masking_should_cover_email_path_secret_and_account_id()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_any_key_resolver.py
- [[test_resolver_fixtures_should_match_expected_output()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_any_key_resolver.py
- [[test_supported_scheme_inventory_should_include_phase3_keys()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_any_key_resolver.py
- [[test_unsupported_key_should_return_explicit_state()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_any_key_resolver.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/test_any_key_resolverpy__mask_user_facing_value__load_fixture
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_hvdc_any_key_resolver.py · normalize_identifier_value() · _mask_payload()]]
- 1 edge to [[_COMMUNITY_hvdc_readonly_mcp_surface.py · _envelope() · call_mcp_tool()]]
- 1 edge to [[_COMMUNITY_validate_public_output() · test_semantic_adapter.py · test_adapter_fixtures_should_match_expected_canonical_output()]]

## Top bridge nodes
- [[mask_user_facing_value()]] - degree 5, connects to 2 communities
- [[test_any_key_resolver.py]] - degree 8, connects to 1 community
- [[test_resolver_fixtures_should_match_expected_output()]] - degree 3, connects to 1 community