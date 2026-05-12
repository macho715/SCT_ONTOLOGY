from __future__ import annotations

import csv
import json
from io import StringIO
from typing import Any


def render_brief(snapshot_result: dict[str, Any]) -> str:
    if not snapshot_result.get("found"):
        return f"ZERO: {snapshot_result.get('message', 'No matching ShipmentUnit.')} query={snapshot_result.get('query')}"
    snapshot = snapshot_result["snapshot"]
    risk_count = len(snapshot["risks"])
    blocked = sum(1 for risk in snapshot["risks"] if risk["severity"] == "BLOCK")
    return (
        f"판정: {'ZERO' if blocked else 'AMBER' if risk_count else 'PASS'}\n"
        f"근거: shipment={snapshot['shipment_id']}, stage={snapshot['current_stage']}, "
        f"risk={risk_count}, block={blocked}, exposure=AED {snapshot['invoice_exposure_aed']}\n"
        f"다음행동: {'Human/Finance gate 후 증빙 보완' if snapshot['human_gate_required'] else '정상 모니터링'}"
    )


def snapshot_to_json(snapshot_result: dict[str, Any]) -> str:
    return json.dumps(snapshot_result, ensure_ascii=False, indent=2)


def snapshot_to_csv(snapshot_result: dict[str, Any]) -> str:
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=["section", "shipment_id", "item", "severity", "value", "detail"])
    writer.writeheader()
    if not snapshot_result.get("found"):
        writer.writerow({"section": "lookup", "shipment_id": "", "item": "query", "severity": "ZERO", "value": snapshot_result.get("query", ""), "detail": snapshot_result.get("message", "")})
        return output.getvalue()
    snapshot = snapshot_result["snapshot"]
    shipment_id = snapshot["shipment_id"]
    writer.writerow({"section": "summary", "shipment_id": shipment_id, "item": "current_stage", "severity": "", "value": snapshot["current_stage"], "detail": snapshot["routing_pattern"]})
    writer.writerow({"section": "summary", "shipment_id": shipment_id, "item": "invoice_exposure_aed", "severity": "", "value": snapshot["invoice_exposure_aed"], "detail": ""})
    for doc in snapshot["missing_documents"]:
        writer.writerow({"section": "missing_document", "shipment_id": shipment_id, "item": doc, "severity": "BLOCK", "value": "", "detail": "required evidence missing"})
    for risk in snapshot["risks"]:
        writer.writerow({"section": "risk", "shipment_id": shipment_id, "item": risk["rule"], "severity": risk["severity"], "value": "", "detail": risk["detail"]})
    for line in snapshot["invoice_audit"]:
        writer.writerow({"section": "invoice", "shipment_id": shipment_id, "item": line["line_id"], "severity": line["severity"], "value": line["delta_amount_aed"], "detail": f"{line['item']} delta={line['delta_pct']}%"})
    return output.getvalue()
