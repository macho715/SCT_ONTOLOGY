"""Canonical semantic adapter for local HVDC prototype outputs.

The adapter is intentionally pure and fixture-friendly. Local query and rule
outputs can keep their legacy shapes internally, but public MCP-facing output
must pass through this module before use.
"""

from __future__ import annotations

from copy import deepcopy
from typing import Any, Dict, Iterable, List, Mapping, Sequence


EVIDENCE_STATES = {
    "PASS",
    "WARN",
    "BLOCK",
    "NO_EVIDENCE",
    "AMBIGUOUS",
    "CONFLICT",
}

LOCAL_PUBLIC_OBJECT_TYPES = {"Case", "TransportEvent", "StockSnapshot", "Invoice"}

EVENT_MILESTONE_MAP = {
    "PACKED": ("M20", "Packed / Marked", "PACKING"),
    "PICKUP": ("M30", "Pickup Completed", "ORIGIN_PICKUP"),
    "PORT_IN": ("M50", "Terminal Received", "PORT_ENTRY"),
    "LOADED_ON_BOARD": ("M60", "Loaded On Board", "OCEAN"),
    "ATD": ("M61", "ATD", "OCEAN"),
    "ATA": ("M80", "ATA", "IMPORT_ARRIVAL"),
    "CUSTOMS_HOLD": ("M90", "BOE Submitted", "CUSTOMS_CLEARANCE"),
    "CUSTOMS_CLEARED": ("M91", "BOE Cleared", "CUSTOMS_CLEARANCE"),
    "GATE_OUT": ("M100", "Gate-out Completed", "INLAND_TRANSPORT"),
    "WH_IN": ("M110", "Warehouse Received", "WAREHOUSE_RECEIVING"),
    "PUT_AWAY": ("M111", "Put-away Completed", "WAREHOUSE_STORAGE"),
    "DISPATCHED": ("M121", "Dispatched", "INLAND_TRANSPORT"),
    "FINAL_OUT": ("M130", "Site Arrived", "SITE_RECEIVING"),
}


def adapt_case_timeline(local_payload: Mapping[str, Any]) -> Dict[str, Any]:
    """Map local Case/TransportEvent timeline output to canonical shipment context."""
    rows = list(local_payload.get("events") or [])
    case_number = str(local_payload.get("caseNumber") or "").strip()

    if not case_number or not rows:
        return no_evidence_result(
            query_ref=local_payload.get("sourceQuery", "case_timeline"),
            reason="Missing caseNumber or timeline rows.",
        )

    milestone_events = []
    journey_legs = []
    evidence_refs = []

    for index, row in enumerate(rows, start=1):
        event_type = str(row.get("eventType") or "UNKNOWN").strip().upper()
        milestone_code, milestone_name, journey_stage = EVENT_MILESTONE_MAP.get(
            event_type,
            ("M000", event_type.title() or "Unknown Event", "UNKNOWN"),
        )
        evidence_id = f"timeline:{case_number}:{index}"
        evidence_refs.append(
            _evidence_ref(
                evidence_id=evidence_id,
                source_type="sparql_row",
                source_field="TransportEvent",
                source_system=local_payload.get("sourceSystem", "local-fuseki"),
            )
        )
        milestone_events.append(
            {
                "objectType": "MilestoneEvent",
                "milestoneCode": milestone_code,
                "milestoneName": milestone_name,
                "eventTime": row.get("eventDate"),
                "journeyStage": journey_stage,
                "statusAfterEvent": event_type,
                "sourceEvidenceId": evidence_id,
            }
        )
        if row.get("sourceLocation") or row.get("targetLocation"):
            journey_legs.append(
                {
                    "objectType": "JourneyLeg",
                    "legId": f"leg:{case_number}:{index}",
                    "fromNode": row.get("sourceLocation"),
                    "toNode": row.get("targetLocation"),
                    "mode": row.get("transportMode"),
                    "sourceEvidenceId": evidence_id,
                }
            )

    current_stage = milestone_events[-1]["journeyStage"]
    routing_pattern = local_payload.get("routingPattern") or infer_routing_pattern(rows)

    return {
        "dataStatus": "OK",
        "evidenceState": "PASS",
        "objectType": "OperationalContext",
        "identifiers": [_identifier("HVDC_CODE", case_number, is_primary=True)],
        "shipmentUnit": {
            "objectType": "ShipmentUnit",
            "shipmentUnitId": f"su:{case_number}",
            "routingPattern": routing_pattern,
            "journeyStage": current_stage,
            "currentMilestoneCode": milestone_events[-1]["milestoneCode"],
        },
        "routingPattern": routing_pattern,
        "journeyStage": current_stage,
        "milestoneEvents": milestone_events,
        "journeyLegs": journey_legs,
        "evidenceRefs": evidence_refs,
    }


def adapt_stock_snapshot(local_payload: Mapping[str, Any]) -> Dict[str, Any]:
    """Map local StockSnapshot rows to canonical warehouse evidence."""
    rows = list(local_payload.get("snapshots") or [])
    if not rows:
        return no_evidence_result(
            query_ref=local_payload.get("sourceQuery", "stock_snapshot"),
            reason="No stock snapshot rows.",
        )

    warehouse_evidence = []
    evidence_refs = []

    for index, row in enumerate(rows, start=1):
        warehouse = str(row.get("warehouse") or "UNKNOWN").strip()
        evidence_id = f"stock:{warehouse}:{row.get('yearMonth', 'unknown')}:{index}"
        evidence_refs.append(
            _evidence_ref(
                evidence_id=evidence_id,
                source_type="sparql_row",
                source_field="StockSnapshot",
                source_system=local_payload.get("sourceSystem", "local-fuseki"),
            )
        )
        warehouse_evidence.append(
            {
                "objectType": "WarehouseEvidence",
                "warehouseId": warehouse,
                "period": row.get("yearMonth"),
                "totalInbound": _number_or_zero(row.get("totalInbound")),
                "totalOutbound": _number_or_zero(row.get("totalOutbound")),
                "netMovement": _number_or_zero(row.get("netMovement")),
                "closingStock": _number_or_zero(row.get("avgClosingStock")),
                "warehouseRoleEvidence": row.get("warehouseType"),
                "sourceEvidenceId": evidence_id,
            }
        )

    result = {
        "dataStatus": "OK",
        "evidenceState": "PASS",
        "objectType": "OperationalContext",
        "identifiers": [
            _identifier(
                "WAREHOUSE",
                str(warehouse_evidence[0]["warehouseId"]),
                is_primary=True,
            )
        ],
        "operationalContext": {
            "objectType": "WarehouseEvidenceSet",
            "routingPattern": None,
            "journeyStage": "WAREHOUSE_STORAGE",
        },
        "routingPattern": None,
        "journeyStage": "WAREHOUSE_STORAGE",
        "warehouseEvidence": warehouse_evidence,
        "evidenceRefs": evidence_refs,
    }

    flow_code = local_payload.get("confirmedFlowCode")
    if flow_code is not None:
        result["warehouseHandlingProfile"] = {
            "objectType": "WarehouseHandlingProfile",
            "flowConfirmationStatus": local_payload.get("flowConfirmationStatus", "confirmed"),
            "confirmedFlowCode": flow_code,
            "sourceEvidenceId": evidence_refs[0]["evidenceId"],
        }

    return result


def adapt_invoice_risk(local_payload: Mapping[str, Any]) -> Dict[str, Any]:
    """Map local invoice and rule alerts to canonical CostGuard evidence."""
    invoice = dict(local_payload.get("invoice") or {})
    alerts = list(local_payload.get("alerts") or [])
    invoice_no = str(invoice.get("invoiceNumber") or "").strip()

    if not invoice_no and not alerts:
        return no_evidence_result(
            query_ref=local_payload.get("sourceQuery", "invoice_risk"),
            reason="Missing invoice and alert evidence.",
        )

    evidence_refs = []
    for index, alert in enumerate(alerts or [invoice], start=1):
        evidence_refs.append(
            _evidence_ref(
                evidence_id=f"invoice:{invoice_no or 'unknown'}:{index}",
                source_type="rule_alert" if alerts else "sparql_row",
                source_field=alert.get("riskType") or alert.get("severity") or "Invoice",
                source_system=local_payload.get("sourceSystem", "local-rules"),
            )
        )

    severities = [str(alert.get("severity") or "WARN").upper() for alert in alerts]
    severity = _max_severity(severities)
    evidence_state = "WARN" if severity in {"WARN", "HIGH", "CRITICAL"} else "PASS"

    return {
        "dataStatus": "OK",
        "evidenceState": evidence_state,
        "objectType": "OperationalContext",
        "identifiers": [
            _identifier("INVOICE_NO", invoice_no, is_primary=True),
            _identifier("HVDC_CODE", invoice.get("hvdcCode") or local_payload.get("hvdcCode")),
        ],
        "operationalContext": {
            "objectType": "CostEvidenceContext",
            "routingPattern": invoice.get("routingPattern"),
            "journeyStage": invoice.get("journeyStage"),
        },
        "routingPattern": invoice.get("routingPattern"),
        "journeyStage": invoice.get("journeyStage"),
        "costGuardResult": {
            "objectType": "CostGuardResult",
            "invoiceNo": invoice_no,
            "reviewStance": "REVIEW_REQUIRED" if evidence_state == "WARN" else "NO_EXCEPTION_DETECTED",
            "severity": severity,
            "riskTypes": [alert.get("riskType") for alert in alerts if alert.get("riskType")],
            "missingInputs": sorted(
                {item for alert in alerts for item in alert.get("missingInputs", [])}
            ),
            "sourceEvidenceIds": [ref["evidenceId"] for ref in evidence_refs],
        },
        "invoiceEvidence": {
            "objectType": "InvoiceEvidence",
            "invoiceNo": invoice_no,
            "totalAmount": invoice.get("totalAmount"),
            "currency": invoice.get("currency"),
            "supplierName": invoice.get("supplierName"),
        },
        "evidenceRefs": evidence_refs,
    }


def adapt_uncertain_join(local_payload: Mapping[str, Any]) -> Dict[str, Any]:
    """Represent missing, ambiguous, or conflicting joins without forcing an answer."""
    candidates = list(local_payload.get("candidates") or [])
    conflicts = list(local_payload.get("conflicts") or [])
    lookup_key = local_payload.get("lookupKey")

    if conflicts:
        state = "CONFLICT"
        data_status = "CONFLICT"
        reason = "Sources disagree on material fields."
    elif len(candidates) > 1:
        state = "AMBIGUOUS"
        data_status = "AMBIGUOUS"
        reason = "Multiple candidates matched the same key."
    elif not candidates:
        state = "NO_EVIDENCE"
        data_status = "NO_EVIDENCE"
        reason = "No candidate matched the requested key."
    else:
        state = "PASS"
        data_status = "OK"
        reason = "Single candidate matched."

    return {
        "dataStatus": data_status,
        "evidenceState": state,
        "objectType": "OperationalContext",
        "identifiers": [_identifier(str(local_payload.get("lookupScheme") or "LOOKUP_KEY"), lookup_key, is_primary=True)],
        "operationalContext": {
            "objectType": "JoinEvidenceContext",
            "reason": reason,
            "candidateCount": len(candidates),
        },
        "candidates": candidates,
        "conflicts": conflicts,
        "evidenceRefs": [
            _evidence_ref(
                evidence_id=f"join:{lookup_key or 'unknown'}:{index}",
                source_type="join_candidate",
                source_field=str(candidate.get("sourceField") or "unknown"),
                source_system=str(candidate.get("sourceSystem") or "local-fixture"),
            )
            for index, candidate in enumerate(candidates, start=1)
        ],
    }


def no_evidence_result(query_ref: Any, reason: str) -> Dict[str, Any]:
    """Return a canonical no-evidence response."""
    query_name = str(query_ref or "unknown")
    return {
        "dataStatus": "NO_EVIDENCE",
        "evidenceState": "NO_EVIDENCE",
        "objectType": "OperationalContext",
        "identifiers": [],
        "operationalContext": {
            "objectType": "NoEvidenceContext",
            "reason": reason,
        },
        "evidenceRefs": [
            _evidence_ref(
                evidence_id=f"no-evidence:{query_name}",
                source_type="query",
                source_field=query_name,
                source_system="local-prototype",
            )
        ],
    }


def canonicalize_rule_results(rule_results: Mapping[str, Any], context: Mapping[str, Any] | None = None) -> Dict[str, Any]:
    """Convert existing hvdc_rules.run_all_rules output into canonical risk evidence."""
    context = context or {}
    alerts: List[Dict[str, Any]] = []
    for key in ("cost_alerts", "hs_alerts", "cert_alerts"):
        for alert in rule_results.get(key, []) or []:
            normalized = dict(alert)
            normalized["riskType"] = key.replace("_alerts", "").upper()
            alerts.append(normalized)

    return adapt_invoice_risk(
        {
            "sourceSystem": "hvdc_rules",
            "invoice": {
                "invoiceNumber": context.get("invoiceNumber"),
                "hvdcCode": context.get("hvdcCode"),
                "routingPattern": context.get("routingPattern"),
                "journeyStage": context.get("journeyStage"),
            },
            "alerts": alerts,
        }
    )


def validate_public_output(value: Any) -> List[str]:
    """Return semantic guardrail violations for a canonical public output."""
    violations: List[str] = []
    _walk(value, path="", violations=violations)
    return violations


def infer_routing_pattern(rows: Sequence[Mapping[str, Any]]) -> str:
    """Infer a coarse routing pattern from local locations without using Flow Code."""
    locations = " ".join(
        str(part or "")
        for row in rows
        for part in (row.get("sourceLocation"), row.get("targetLocation"))
    ).upper()
    if "MOSB" in locations and ("WH" in locations or "WAREHOUSE" in locations):
        return "WH_MOSB"
    if "MOSB" in locations:
        return "MOSB_DIRECT"
    if "WAREHOUSE" in locations or "WH" in locations:
        return "WH_ONLY"
    return "DIRECT"


def _walk(value: Any, path: str, violations: List[str]) -> None:
    if isinstance(value, Mapping):
        object_type = value.get("objectType")
        if object_type in LOCAL_PUBLIC_OBJECT_TYPES:
            violations.append(f"Local objectType leaked at {path or '<root>'}: {object_type}")
        for key, child in value.items():
            child_path = f"{path}.{key}" if path else str(key)
            if key == "confirmedFlowCode" and not path.endswith("warehouseHandlingProfile"):
                violations.append(f"confirmedFlowCode outside warehouseHandlingProfile at {child_path}")
            if key.lower() in {"flowcode", "flow_code"}:
                violations.append(f"Flow Code field outside canonical WHP path at {child_path}")
            _walk(child, child_path, violations)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _walk(child, f"{path}[{index}]", violations)


def _identifier(
    scheme: str,
    value: Any,
    *,
    source_system: str = "local-prototype",
    is_primary: bool = False,
) -> Dict[str, Any]:
    if value in (None, ""):
        return {
            "identifierScheme": scheme,
            "identifierValue": None,
            "normalizedValue": None,
            "sourceSystem": source_system,
            "isPrimary": is_primary,
            "evidenceState": "NO_EVIDENCE",
        }
    text = str(value).strip()
    return {
        "identifierScheme": scheme,
        "identifierValue": text,
        "normalizedValue": text.upper().replace(" ", "-"),
        "sourceSystem": source_system,
        "isPrimary": is_primary,
        "evidenceState": "PASS",
    }


def _evidence_ref(
    *,
    evidence_id: str,
    source_type: str,
    source_field: str,
    source_system: str,
) -> Dict[str, str]:
    return {
        "objectType": "EvidenceRef",
        "evidenceId": evidence_id,
        "sourceType": source_type,
        "sourceField": source_field,
        "sourceSystem": source_system,
    }


def _number_or_zero(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _max_severity(severities: Iterable[str]) -> str:
    order = {"PASS": 0, "WARN": 1, "HIGH": 2, "CRITICAL": 3, "BLOCK": 4}
    result = "PASS"
    for severity in severities:
        if order.get(severity, 1) > order.get(result, 0):
            result = severity
    return result


def normalized_copy(value: Any) -> Any:
    """Return a stable deep copy for fixture comparisons."""
    return deepcopy(value)
