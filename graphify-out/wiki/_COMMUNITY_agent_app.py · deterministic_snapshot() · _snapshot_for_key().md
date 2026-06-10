---
type: community
cohesion: 0.11
members: 38
---

# agent_app.py · deterministic_snapshot() · _snapshot_for_key()

**Cohesion:** 0.11 - loosely connected
**Members:** 38 nodes

## Members
- [[Any]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[Any_2]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/reporting.py
- [[CaptureFixture]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py
- [[F]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[MonkeyPatch]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py
- [[Path_1]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[Path_3]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py
- [[Resolve BL, BOE, DO, Invoice, Container, HVDC_CODE, Package No. and return shipm]] - rationale - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[Return M90M91M92M100 release risks, missing documents, and DEMDET exposure i]] - rationale - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[Run COST-GUARD invoice audit for a shipment and return line-level AED deltas and]] - rationale - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[_parse_now()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[_snapshot_for_key()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[agent_app.py]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[build_agent()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[cost_guard()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[datetime]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[deterministic_snapshot()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[function_tool()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[load_dataset()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[main()_1]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[port_release_board()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[render_brief()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/reporting.py
- [[reporting.py]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/reporting.py
- [[run_agent()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[search_shipment()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/agent_app.py
- [[snapshot_to_csv()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/reporting.py
- [[snapshot_to_json()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/src/hvdc_openai_agent/reporting.py
- [[test_agent_app.py]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py
- [[test_build_agent_requires_sdk_when_not_installed()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py
- [[test_csv_export_contains_risk_and_invoice_rows()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_reporting.py
- [[test_json_export_is_valid_unicode_json()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_reporting.py
- [[test_main_offline_prints_brief()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py
- [[test_main_offline_writes_output_file()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py
- [[test_offline_snapshot_does_not_require_agents_sdk()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py
- [[test_offline_snapshot_not_found()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py
- [[test_render_brief_flags_zero_for_blocked_shipment()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_reporting.py
- [[test_reporting.py]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_reporting.py
- [[test_tool_wrappers_return_expected_sections_without_sdk()]] - code - SCT_ONTOLOGY-main/hvdc_openai_agent/tests/test_agent_app.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/agent_apppy__deterministic_snapshot___snapshot_for_key
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_core.py · load_shipments() · Decimal]]

## Top bridge nodes
- [[agent_app.py]] - degree 16, connects to 1 community
- [[_snapshot_for_key()]] - degree 10, connects to 1 community
- [[load_dataset()]] - degree 4, connects to 1 community