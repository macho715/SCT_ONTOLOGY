import json
from pathlib import Path

import pytest

from hvdc_readonly_mcp_surface import (
    READONLY_TOOLS,
    call_mcp_tool,
    list_mcp_tools,
    validate_readonly_mcp_surface_output,
)


FIXTURE_DIR = Path("fixtures/mcp_surface")


def load_fixture(name):
    with (FIXTURE_DIR / name).open("r", encoding="utf-8") as handle:
        return json.load(handle)


def call_fixture(name):
    query = load_fixture(name)
    return call_mcp_tool(query["toolName"], query.get("arguments", {}))


def assert_envelope(actual, expected):
    assert actual["toolName"] == expected["toolName"]
    assert actual["dataStatus"] == expected["dataStatus"]
    assert actual["structuredContent"]["objectType"] == expected["objectType"]
    assert actual["validation"]["status"] == expected["validationStatus"]
    assert actual["annotations"]["readOnly"] is True
    assert actual["annotations"]["mutationAllowed"] is False
    assert actual["actionBoundary"]["readOnly"] is True
    assert actual["actionBoundary"]["mutationAllowed"] is False
    assert validate_readonly_mcp_surface_output(actual) == []

    evidence_ids = {ref["evidenceId"] for ref in actual["evidenceRefs"]}
    for evidence_id in expected.get("requiredEvidenceIds", []):
        assert evidence_id in evidence_ids


def test_tool_inventory_should_include_only_readonly_v1_tools():
    tools = list_mcp_tools()
    names = {tool["name"] for tool in tools}

    assert names == set(READONLY_TOOLS)
    for tool in tools:
        assert tool["annotations"]["readOnly"] is True
        assert tool["annotations"]["mutationAllowed"] is False


@pytest.mark.parametrize(
    "query_name,expected_name",
    [
        ("query_resolve_key.json", "expected_resolve_key.json"),
        ("query_risk_radar.json", "expected_risk_radar.json"),
        ("query_costguard_pack.json", "expected_costguard_pack.json"),
        ("query_search_evidence.json", "expected_search_evidence.json"),
        ("query_validate_output.json", "expected_validate_output.json"),
        ("query_malformed_input.json", "expected_malformed_input.json"),
    ],
)
def test_mcp_surface_fixtures_should_match_expected_contract(query_name, expected_name):
    actual = call_fixture(query_name)
    expected = load_fixture(expected_name)

    assert_envelope(actual, expected)

    if "topRiskTypes" in expected:
        actual_types = [card["riskType"] for card in actual["structuredContent"]["riskCards"][: len(expected["topRiskTypes"])]]
        assert actual_types == expected["topRiskTypes"]
    if "reviewStance" in expected:
        assert actual["structuredContent"]["reviewStance"] == expected["reviewStance"]
    if "invoiceNo" in expected:
        assert actual["structuredContent"]["invoiceIdentity"]["invoiceNo"] == expected["invoiceNo"]
    if "minimumMatchCount" in expected:
        assert actual["structuredContent"]["matchCount"] >= expected["minimumMatchCount"]
    if "findingCount" in expected:
        assert actual["structuredContent"]["findingCount"] == expected["findingCount"]
    if "status" in expected:
        assert actual["structuredContent"]["status"] == expected["status"]
    if "missingInputs" in expected:
        assert actual["structuredContent"]["missingInputs"] == expected["missingInputs"]


def test_unknown_tool_should_return_structured_error_not_traceback():
    result = call_mcp_tool("missing_tool", {"value": "INV-2026-0002"})

    assert result["structuredContent"]["objectType"] == "MCPToolError"
    assert result["structuredContent"]["status"] == "UNKNOWN_TOOL"
    assert "traceback" not in json.dumps(result, ensure_ascii=False).lower()
    assert validate_readonly_mcp_surface_output(result) == []


def test_secret_and_local_markers_should_be_redacted_from_public_envelope():
    actual = call_fixture("query_secret_redaction.json")
    expected = load_fixture("expected_secret_redaction.json")
    serialized = json.dumps(actual, ensure_ascii=False)

    assert_envelope(actual, expected)
    assert set(expected["requiredMasking"]) <= set(actual["privacy"]["maskingApplied"])
    for blocked in expected["blockedText"]:
        assert blocked not in serialized
    for marker in ("[MASKED_LOCAL_PATH]", "[MASKED_EMAIL]", "[MASKED_SECRET]", "[MASKED_ACCOUNT_ID]"):
        assert marker in serialized


def test_no_evidence_and_unsupported_key_states_should_remain_visible():
    unsupported = call_mcp_tool("resolve_operational_key", {"value": "unknown key"})
    missing = call_mcp_tool("get_operational_risk_radar", {"value": "BOE-2026-MISSING", "scheme": "BOE_NO"})

    assert unsupported["structuredContent"]["status"] == "UNSUPPORTED_KEY"
    assert unsupported["structuredContent"]["evidenceState"]["status"] == "NO_EVIDENCE"
    assert missing["structuredContent"]["dataStatus"] == "NO_EVIDENCE"
    assert missing["structuredContent"]["missingInputs"]


def test_outputs_should_not_expose_local_runtime_or_action_markers():
    outputs = [
        call_fixture("query_resolve_key.json"),
        call_fixture("query_risk_radar.json"),
        call_fixture("query_costguard_pack.json"),
        call_fixture("query_search_evidence.json"),
        call_fixture("query_secret_redaction.json"),
    ]
    blocked = [
        "sparql",
        "fuseki",
        "ngrok",
        "localhost",
        "127.0.0.1",
        "c:\\users",
        "bearer ",
        "token=",
        "sk-",
        "upload",
        "write",
        "oauth",
        "payment",
        "approval",
        "dispute",
        "escalation",
    ]

    for output in outputs:
        serialized = json.dumps(output, ensure_ascii=False).lower()
        for marker in blocked:
            assert marker not in serialized
