from __future__ import annotations

import json
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

import pytest

from hvdc_openai_agent.core import (
    DataValidationError,
    Severity,
    audit_invoice_lines,
    current_stage,
    load_shipments,
    missing_documents,
    port_release_risks,
    resolve_any_key,
    shipment_snapshot,
)

DATA = Path(__file__).resolve().parents[1] / "data" / "sample_shipments.json"


def shipments():
    return load_shipments(json.loads(DATA.read_text(encoding="utf-8")))


def test_resolve_any_key_by_bl_and_hvdc_code():
    rows = shipments()
    assert resolve_any_key(rows, "BL-DXB-001").shipment_id == "SHP-0001"
    assert resolve_any_key(rows, "hvdc-adopt-002-0002").shipment_id == "SHP-0002"


def test_current_stage_uses_numeric_milestone_order_not_string_sort():
    rows = shipments()
    assert current_stage(resolve_any_key(rows, "BL-AUH-002")) == "M130"


def test_missing_documents_uses_stage_order():
    rows = shipments()
    missing = missing_documents(resolve_any_key(rows, "BL-AUH-002"))
    assert "DO" in missing
    assert "SITE_RECEIPT" in missing


def test_cost_guard_bands_and_block_for_missing_evidence():
    rows = shipments()
    result = audit_invoice_lines(resolve_any_key(rows, "INV-DSV-2002"))
    by_line = {row["line_id"]: row for row in result}
    assert by_line["L1"]["severity"] == Severity.CRITICAL
    assert by_line["L1"]["human_gate"] is True
    assert by_line["L2"]["severity"] == Severity.BLOCK
    assert by_line["L2"]["checks"]["missing_evidence"] is True


def test_port_release_detects_late_closed_demdet_and_missing_do():
    rows = shipments()
    risks = port_release_risks(resolve_any_key(rows, "BL-AUH-002"), now=datetime(2026, 5, 11, tzinfo=timezone.utc))
    assert any(risk["severity"] == Severity.HIGH and "closed late" in risk["detail"] for risk in risks)
    assert any(risk["severity"] == Severity.BLOCK and "DO document" in risk["detail"] for risk in risks)


def test_snapshot_contains_agi_das_gate_block():
    rows = shipments()
    snapshot = shipment_snapshot(resolve_any_key(rows, "PKG-AGI-02"))
    assert snapshot["current_stage"] == "M130"
    assert "DO" in snapshot["missing_documents"]
    assert any(risk["rule"] == "AGI/DAS MOSB Gate" for risk in snapshot["risks"])


def test_duplicate_identifier_fails_fast():
    raw = json.loads(DATA.read_text(encoding="utf-8"))
    raw[1]["identifiers"]["BL"] = raw[0]["identifiers"]["BL"]
    with pytest.raises(DataValidationError):
        load_shipments(raw)


def test_open_demdet_uses_supplied_now():
    rows = shipments()
    shipment = resolve_any_key(rows, "BL-DXB-001")
    risks = port_release_risks(shipment, now=datetime(2026, 5, 10, 12, 1, tzinfo=timezone.utc), demdet_hours=Decimal("72.00"))
    assert any(risk["rule"] == "DEM/DET Risk Alert" for risk in risks)

from hvdc_openai_agent.core import InvoiceLine, milestone_rank, money, pct


def test_money_and_pct_round_half_up():
    assert money("10.005") == Decimal("10.01")
    assert pct(Decimal("1.234")) == Decimal("1.23")


def test_unknown_milestone_fails_validation():
    raw = json.loads(DATA.read_text(encoding="utf-8"))
    raw[0]["milestones"].append({"code": "M999", "occurred_at": "2026-05-01T00:00:00+00:00"})
    with pytest.raises(DataValidationError):
        load_shipments(raw)
    with pytest.raises(DataValidationError):
        milestone_rank("M999")


def test_zero_standard_invoice_is_block():
    raw = json.loads(DATA.read_text(encoding="utf-8"))
    raw[0]["invoice_lines"] = [
        {"line_id": "Z1", "item": "Zero standard", "quantity": 1, "rate": "0.00", "draft_amount": "0.00", "standard_amount": "0.00", "evidence_refs": ["RateRef:ZERO"]}
    ]
    result = audit_invoice_lines(load_shipments(raw)[0])[0]
    assert result["severity"] == Severity.BLOCK
    assert result["checks"]["zero_standard"] is True


def test_negative_invoice_value_fails_validation():
    raw = json.loads(DATA.read_text(encoding="utf-8"))
    raw[0]["invoice_lines"][0]["draft_amount"] = "-1.00"
    with pytest.raises(DataValidationError):
        load_shipments(raw)


def test_non_aed_currency_fails_validation():
    raw = json.loads(DATA.read_text(encoding="utf-8"))
    raw[0]["invoice_lines"][0]["currency"] = "USD"
    with pytest.raises(DataValidationError):
        load_shipments(raw)
