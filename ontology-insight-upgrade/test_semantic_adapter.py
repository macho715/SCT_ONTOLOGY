import json
from pathlib import Path

import pytest

from hvdc_semantic_adapter import (
    adapt_case_timeline,
    adapt_invoice_risk,
    adapt_stock_snapshot,
    adapt_uncertain_join,
    validate_public_output,
)


FIXTURE_DIR = Path("fixtures/semantic_adapter")


def load_fixture(name):
    with (FIXTURE_DIR / name).open("r", encoding="utf-8") as handle:
        return json.load(handle)


@pytest.mark.parametrize(
    "input_name,expected_name,adapter",
    [
        (
            "local_case_timeline.json",
            "expected_canonical_case_timeline.json",
            adapt_case_timeline,
        ),
        (
            "local_stock_snapshot.json",
            "expected_canonical_stock_snapshot.json",
            adapt_stock_snapshot,
        ),
        (
            "local_invoice_risk.json",
            "expected_canonical_invoice_risk.json",
            adapt_invoice_risk,
        ),
        (
            "local_conflict_join.json",
            "expected_canonical_conflict_join.json",
            adapt_uncertain_join,
        ),
    ],
)
def test_adapter_fixtures_should_match_expected_canonical_output(input_name, expected_name, adapter):
    local_payload = load_fixture(input_name)
    expected = load_fixture(expected_name)

    actual = adapter(local_payload)

    assert actual == expected
    assert validate_public_output(actual) == []


def test_no_evidence_state_should_not_force_a_join():
    result = adapt_uncertain_join({"lookupScheme": "INVOICE_NO", "lookupKey": "INV-MISSING"})

    assert result["dataStatus"] == "NO_EVIDENCE"
    assert result["evidenceState"] == "NO_EVIDENCE"
    assert result["operationalContext"]["candidateCount"] == 0


@pytest.mark.parametrize("object_type", ["Case", "TransportEvent", "StockSnapshot", "Invoice"])
def test_guardrail_should_block_local_object_type_leakage(object_type):
    result = {
        "objectType": "OperationalContext",
        "child": {"objectType": object_type},
    }

    violations = validate_public_output(result)

    assert violations
    assert object_type in violations[0]


def test_guardrail_should_block_confirmed_flow_code_outside_whp():
    result = {
        "objectType": "OperationalContext",
        "shipmentUnit": {
            "objectType": "ShipmentUnit",
            "confirmedFlowCode": 2,
        },
    }

    violations = validate_public_output(result)

    assert violations
    assert "confirmedFlowCode outside warehouseHandlingProfile" in violations[0]


def test_guardrail_should_allow_confirmed_flow_code_inside_whp():
    result = {
        "objectType": "OperationalContext",
        "warehouseHandlingProfile": {
            "objectType": "WarehouseHandlingProfile",
            "confirmedFlowCode": 2,
        },
    }

    assert validate_public_output(result) == []
