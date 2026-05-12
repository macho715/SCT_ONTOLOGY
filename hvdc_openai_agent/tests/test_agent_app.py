from __future__ import annotations

from datetime import datetime, timezone

from hvdc_openai_agent.agent_app import deterministic_snapshot


def test_offline_snapshot_does_not_require_agents_sdk():
    result = deterministic_snapshot("BL-AUH-002", now=datetime(2026, 5, 11, tzinfo=timezone.utc))
    assert result["found"] is True
    assert result["snapshot"]["shipment_id"] == "SHP-0002"
    assert result["snapshot"]["human_gate_required"] is True


def test_offline_snapshot_not_found():
    result = deterministic_snapshot("NO-SUCH-BL")
    assert result == {"found": False, "query": "NO-SUCH-BL", "message": "No matching ShipmentUnit."}

from pathlib import Path

import pytest

from hvdc_openai_agent import agent_app
from hvdc_openai_agent.agent_app import build_agent, cost_guard, main, port_release_board, search_shipment


def test_tool_wrappers_return_expected_sections_without_sdk():
    assert search_shipment("BL-DXB-001")["found"] is True
    cost = cost_guard("INV-DSV-2002")
    assert cost["invoice_exposure_aed"] == "120900.00"
    board = port_release_board("BL-AUH-002")
    assert board["current_stage"] == "M130"


def test_build_agent_requires_sdk_when_not_installed():
    if agent_app.Agent is not None:
        pytest.skip("Agents SDK installed in this environment")
    with pytest.raises(RuntimeError):
        build_agent()


def test_main_offline_writes_output_file(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    out = tmp_path / "result.csv"
    monkeypatch.setattr(
        "sys.argv",
        ["hvdc-agent", "BL-AUH-002", "--offline", "--format", "csv", "--output", str(out)],
    )
    main()
    assert "invoice,SHP-0002,L1,CRITICAL" in out.read_text(encoding="utf-8")


def test_main_offline_prints_brief(capsys: pytest.CaptureFixture[str], monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr("sys.argv", ["hvdc-agent", "NO-SUCH", "--offline", "--format", "brief"])
    main()
    assert "ZERO" in capsys.readouterr().out
