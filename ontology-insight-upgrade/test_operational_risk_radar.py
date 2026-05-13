import json
from pathlib import Path

import pytest

from hvdc_operational_risk_radar import (
    REQUIRED_CARD_FIELDS,
    build_costguard_evidence_pack,
    build_operational_risk_radar,
    rank_risk_cards,
    validate_risk_output,
)


FIXTURE_DIR = Path("fixtures/risk_radar")
RESOLVER_FIXTURE_DIR = Path("fixtures/resolver")


def load_fixture(name):
    with (FIXTURE_DIR / name).open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_resolver_index():
    with (RESOLVER_FIXTURE_DIR / "resolver_index.json").open("r", encoding="utf-8") as handle:
        return json.load(handle)


def assert_expected_subset(actual, expected):
    assert actual["objectType"] == expected["objectType"]
    assert actual["dataStatus"] == expected["dataStatus"]
    if "riskSummary" in expected:
        assert actual["riskSummary"] == expected["riskSummary"]
    if "topRiskTypes" in expected:
        assert [card["riskType"] for card in actual["riskCards"][: len(expected["topRiskTypes"])]] == expected["topRiskTypes"]
    if "requiredMissingInputs" in expected:
        assert set(expected["requiredMissingInputs"]) <= set(actual["missingInputs"])
    if "requiredEvidenceIds" in expected:
        evidence_ids = {ref["evidenceId"] for ref in actual["evidenceRefs"]}
        assert set(expected["requiredEvidenceIds"]) <= evidence_ids


def test_invoice_risk_radar_should_match_expected_contract():
    actual = build_operational_risk_radar(
        load_fixture("query_radar_invoice.json"),
        resolver_index=load_resolver_index(),
        risk_index=load_fixture("risk_evidence_index.json"),
    )
    expected = load_fixture("expected_radar_invoice.json")

    assert_expected_subset(actual, expected)
    assert validate_risk_output(actual) == []


def test_site_risk_radar_should_match_expected_contract():
    actual = build_operational_risk_radar(
        load_fixture("query_radar_site.json"),
        resolver_index=load_resolver_index(),
        risk_index=load_fixture("risk_evidence_index.json"),
    )
    expected = load_fixture("expected_radar_site.json")

    assert_expected_subset(actual, expected)
    assert validate_risk_output(actual) == []


def test_costguard_pack_should_match_expected_contract():
    actual = build_costguard_evidence_pack(
        load_fixture("query_costguard_pack.json"),
        resolver_index=load_resolver_index(),
        risk_index=load_fixture("risk_evidence_index.json"),
    )
    expected = load_fixture("expected_costguard_pack.json")

    assert actual["objectType"] == expected["objectType"]
    assert actual["dataStatus"] == expected["dataStatus"]
    assert actual["reviewStance"] == expected["reviewStance"]
    assert actual["invoiceIdentity"]["invoiceNo"] == expected["invoiceNo"]
    assert len(actual["invoiceLines"]) == expected["lineCount"]
    assert {item["evidenceType"] for item in actual["linkedEvidence"]} == set(expected["requiredLinkedEvidence"])
    assert set(actual["missingInputs"]) == set(expected["missingInputs"])
    assert actual["costGuardResult"]["severity"] == expected["severity"]
    assert validate_risk_output(actual) == []


def test_missing_evidence_should_return_visible_gap_without_forced_judgment():
    actual = build_operational_risk_radar(
        load_fixture("query_missing_evidence.json"),
        resolver_index=load_resolver_index(),
        risk_index=load_fixture("risk_evidence_index.json"),
    )
    expected = load_fixture("expected_missing_evidence.json")

    assert_expected_subset(actual, expected)
    assert actual["riskCards"][0]["reviewStance"] == "EVIDENCE_MISSING"
    assert validate_risk_output(actual) == []


def test_every_risk_card_should_have_required_fields_and_one_next_action():
    result = build_operational_risk_radar(
        load_fixture("query_radar_invoice.json"),
        resolver_index=load_resolver_index(),
        risk_index=load_fixture("risk_evidence_index.json"),
    )

    for card in result["riskCards"]:
        assert REQUIRED_CARD_FIELDS <= set(card)
        assert card["nextAction"].count(".") == 1


def test_rank_risk_cards_should_sort_by_severity():
    cards = [
        {"riskType": "INFO_CARD", "severity": "INFO"},
        {"riskType": "HIGH_CARD", "severity": "HIGH"},
        {"riskType": "WARN_CARD", "severity": "WARN"},
    ]

    ranked = rank_risk_cards(cards)

    assert [card["riskType"] for card in ranked] == ["HIGH_CARD", "WARN_CARD", "INFO_CARD"]


@pytest.mark.parametrize("builder,query_name", [
    (build_operational_risk_radar, "query_radar_invoice.json"),
    (build_costguard_evidence_pack, "query_costguard_pack.json"),
])
def test_outputs_should_not_emit_finance_or_mutation_actions(builder, query_name):
    output = builder(
        load_fixture(query_name),
        resolver_index=load_resolver_index(),
        risk_index=load_fixture("risk_evidence_index.json"),
    )
    serialized = json.dumps(output, ensure_ascii=False).lower()

    for prohibited in ("approve", "approval", "dispute", "payment", "pay", "write", "upload"):
        assert prohibited not in serialized
    assert output["actionBoundary"]["readOnly"] is True
    assert output["actionBoundary"]["mutationAllowed"] is False


def test_phase3_resolver_context_should_be_consumed_by_radar():
    result = build_operational_risk_radar(
        load_fixture("query_radar_invoice.json"),
        resolver_index=load_resolver_index(),
        risk_index=load_fixture("risk_evidence_index.json"),
    )

    assert result["resolvedContext"]["objectType"] == "AnyKeyResolverResult"
    assert result["resolvedContext"]["status"] == "MATCHED"
    assert result["resolvedContext"]["detectedScheme"] == "INVOICE_NO"
