import json
from pathlib import Path

import pytest

from hvdc_any_key_resolver import (
    SUPPORTED_IDENTIFIER_SCHEMES,
    detect_identifier_scheme,
    mask_user_facing_value,
    normalize_identifier_value,
    resolve_any_key,
)
from hvdc_semantic_adapter import validate_public_output


FIXTURE_DIR = Path("fixtures/resolver")


def load_fixture(name):
    with (FIXTURE_DIR / name).open("r", encoding="utf-8") as handle:
        return json.load(handle)


@pytest.mark.parametrize(
    "raw,hint,expected_scheme,expected_normalized",
    [
        (" hvdc adopt sct 0001 ", {"scheme": "HVDC_CODE"}, "HVDC_CODE", "HVDC-ADOPT-SCT-0001"),
        ("INV-2026-0002", {}, "INVOICE_NO", "INV-2026-0002"),
        ("PO_2026_7788", {}, "PO_NO", "PO-2026-7788"),
        ("BOE 2026 missing", {"scheme": "BOE_NO"}, "BOE_NO", "BOE-2026-MISSING"),
        ("MSCU1234567", {}, "CONTAINER_NO", "MSCU1234567"),
    ],
)
def test_scheme_detection_and_normalization(raw, hint, expected_scheme, expected_normalized):
    assert detect_identifier_scheme(raw, hint) == expected_scheme
    assert normalize_identifier_value(raw) == expected_normalized


def test_supported_scheme_inventory_should_include_phase3_keys():
    required = {
        "HVDC_CODE",
        "PACKAGE_NO",
        "CASE_NO",
        "BL_NO",
        "CONTAINER_NO",
        "INVOICE_NO",
        "PO_NO",
        "BOE_NO",
        "DO_NO",
        "SITE_CODE",
        "VENDOR_CODE",
    }

    assert required <= SUPPORTED_IDENTIFIER_SCHEMES


@pytest.mark.parametrize(
    "query_name,expected_name",
    [
        ("query_hvdc_code.json", "expected_hvdc_code_context.json"),
        ("query_invoice_no.json", "expected_invoice_context.json"),
        ("query_ambiguous_container.json", "expected_ambiguous_container.json"),
        ("query_conflicting_bl.json", "expected_conflicting_bl.json"),
        ("query_missing_boe.json", "expected_missing_boe.json"),
    ],
)
def test_resolver_fixtures_should_match_expected_output(query_name, expected_name):
    actual = resolve_any_key(load_fixture(query_name), index=load_fixture("resolver_index.json"))
    expected = load_fixture(expected_name)

    assert actual == expected
    assert validate_public_output(actual) == []


def test_missing_supported_key_should_not_force_a_join():
    result = resolve_any_key({"value": "BOE-404", "scheme": "BOE_NO"}, index=load_fixture("resolver_index.json"))

    assert result["status"] == "NOT_FOUND"
    assert result["evidenceState"]["status"] == "NO_EVIDENCE"
    assert result["confidence"] == 0.0


def test_unsupported_key_should_return_explicit_state():
    result = resolve_any_key({"value": "unknown key"}, index=load_fixture("resolver_index.json"))

    assert result["status"] == "UNSUPPORTED_KEY"
    assert result["detectedScheme"] == "UNSUPPORTED_KEY"
    assert result["evidenceState"]["missingEvidence"] == ["SUPPORTED_IDENTIFIER"]


def test_privacy_masking_should_cover_email_path_secret_and_account_id():
    sensitive = (
        "C:\\Users\\jichu\\Downloads\\file.xlsx planner@example.com "
        "token=mcp_secret_123456789 c8dfb4938159505c737d009b7f217f9e"
    )

    masked = mask_user_facing_value(sensitive)

    assert "C:\\Users" not in masked
    assert "planner@example.com" not in masked
    assert "token=mcp_secret" not in masked
    assert "c8dfb4938159505c737d009b7f217f9e" not in masked
    assert "[MASKED_LOCAL_PATH]" in masked
    assert "[MASKED_EMAIL]" in masked
    assert "[MASKED_SECRET]" in masked
    assert "[MASKED_ACCOUNT_ID]" in masked


def test_matched_result_should_include_source_confidence_evidence_and_privacy():
    result = resolve_any_key(load_fixture("query_hvdc_code.json"), index=load_fixture("resolver_index.json"))

    assert result["status"] == "MATCHED"
    assert result["confidence"] == pytest.approx(0.97)
    assert result["sourceFields"]
    assert result["evidenceRefs"]
    assert result["privacy"]["rawEvidenceExposed"] is False
    assert result["privacy"]["piiMasked"] is True
