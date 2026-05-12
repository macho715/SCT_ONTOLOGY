from __future__ import annotations

from hvdc_openai_agent.agent_app import deterministic_snapshot
from hvdc_openai_agent.reporting import render_brief, snapshot_to_csv, snapshot_to_json


def test_render_brief_flags_zero_for_blocked_shipment():
    result = deterministic_snapshot("BL-AUH-002")
    text = render_brief(result)
    assert "판정: ZERO" in text
    assert "AED 120900.00" in text


def test_csv_export_contains_risk_and_invoice_rows():
    result = deterministic_snapshot("BL-AUH-002")
    csv_text = snapshot_to_csv(result)
    assert "risk,SHP-0002" in csv_text
    assert "invoice,SHP-0002,L1,CRITICAL" in csv_text


def test_json_export_is_valid_unicode_json():
    result = deterministic_snapshot("NO-SUCH")
    assert '"found": false' in snapshot_to_json(result)
