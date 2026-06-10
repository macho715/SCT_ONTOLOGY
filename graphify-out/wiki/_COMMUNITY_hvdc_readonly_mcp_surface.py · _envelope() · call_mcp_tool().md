---
type: community
cohesion: 0.11
members: 42
---

# hvdc_readonly_mcp_surface.py · _envelope() · call_mcp_tool()

**Cohesion:** 0.11 - loosely connected
**Members:** 42 nodes

## Members
- [[Any_9]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[Call a local read-only tool and return a public MCP-style envelope.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[Local read-only MCP-style tool surface for HVDC evidence lookup.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[Resolve a supported operational key through the Phase 3 resolver.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[Return Phase 4 CostGuard evidence pack output for a supported operational key.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[Return Phase 4 risk radar output for a supported operational key.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[Return the V1 read-only tool inventory.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[Return validation findings for the public MCP-style envelope.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[Search public evidence reference metadata from the Phase 4 fixture index.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[Validate a candidate MCP-style response envelope.]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_action_boundary()_1]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_collect_risk_evidence_refs()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_envelope()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_error_payload()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_extract_evidence_refs()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_has_value()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_merge_privacy()_1]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_sanitize_payload()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_sanitize_text()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_sanitize_value()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_summary()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_tool_definition()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[_walk_refs()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[assert_envelope()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[call_fixture()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[call_mcp_tool()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[get_costguard_evidence_pack()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[get_operational_risk_radar()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[hvdc_readonly_mcp_surface.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[list_mcp_tools()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[load_fixture()_2]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[resolve_operational_key()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[search_evidence_refs()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[test_mcp_surface_fixtures_should_match_expected_contract()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[test_no_evidence_and_unsupported_key_states_should_remain_visible()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[test_outputs_should_not_expose_local_runtime_or_action_markers()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[test_readonly_mcp_surface.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[test_secret_and_local_markers_should_be_redacted_from_public_envelope()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[test_tool_inventory_should_include_only_readonly_v1_tools()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[test_unknown_tool_should_return_structured_error_not_traceback()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/test_readonly_mcp_surface.py
- [[validate_mcp_output()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py
- [[validate_readonly_mcp_surface_output()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/hvdc_readonly_mcp_surface.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/hvdc_readonly_mcp_surfacepy___envelope__call_mcp_tool
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_build_operational_risk_radar() · hvdc_operational_risk_radar.py · build_costguard_evidence_pack()]]
- 1 edge to [[_COMMUNITY_test_any_key_resolver.py · mask_user_facing_value() · load_fixture()]]
- 1 edge to [[_COMMUNITY_validate_public_output() · test_semantic_adapter.py · test_adapter_fixtures_should_match_expected_canonical_output()]]

## Top bridge nodes
- [[validate_readonly_mcp_surface_output()]] - degree 9, connects to 2 communities
- [[_collect_risk_evidence_refs()]] - degree 6, connects to 1 community
- [[get_costguard_evidence_pack()]] - degree 6, connects to 1 community
- [[get_operational_risk_radar()]] - degree 6, connects to 1 community
- [[search_evidence_refs()]] - degree 6, connects to 1 community