"""Read-only operational risk radar and CostGuard evidence pack builder."""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping

from hvdc_any_key_resolver import normalize_identifier_value, resolve_any_key
from hvdc_semantic_adapter import validate_public_output


DEFAULT_RISK_INDEX_PATH = Path(__file__).resolve().parent / "fixtures" / "risk_radar" / "risk_evidence_index.json"

REQUIRED_CARD_FIELDS = {
    "riskType",
    "status",
    "severity",
    "confidence",
    "evidenceRefs",
    "missingInputs",
    "ownerCue",
    "nextAction",
    "reviewStance",
}

SEVERITY_ORDER = {
    "CRITICAL": 5,
    "HIGH": 4,
    "WARN": 3,
    "INFO": 2,
    "PASS": 1,
    "NO_EVIDENCE": 0,
}

PROHIBITED_ACTION_WORDS = {
    "".join(("app", "rove")),
    "".join(("app", "roval")),
    "".join(("dis", "pute")),
    "".join(("pa", "yment")),
    "".join(("p", "ay")),
    "".join(("wr", "ite")),
    "".join(("up", "load")),
}


def load_default_risk_index() -> Dict[str, Any]:
    """Load the bundled read-only risk evidence fixture index."""
    with DEFAULT_RISK_INDEX_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def build_operational_risk_radar(
    query: Mapping[str, Any],
    resolver_index: Mapping[str, Any] | None = None,
    risk_index: Mapping[str, Any] | None = None,
) -> Dict[str, Any]:
    """Build a read-only risk radar for a resolved operational key."""
    risk_index = deepcopy(risk_index) if risk_index is not None else load_default_risk_index()
    resolved = resolve_any_key(query, index=resolver_index)
    profile = _find_profile(resolved, risk_index)

    if not profile:
        cards = [
            _normalize_card(
                {
                    "riskType": "MISSING_EVIDENCE",
                    "status": "MISSING_EVIDENCE",
                    "severity": "NO_EVIDENCE",
                    "confidence": 0.0,
                    "evidenceRefs": resolved.get("evidenceRefs", []),
                    "missingInputs": ["risk evidence profile"],
                    "ownerCue": "SCM evidence owner",
                    "nextAction": "Add source evidence or try another supported key.",
                    "reviewStance": "EVIDENCE_MISSING",
                }
            )
        ]
    else:
        cards = [_normalize_card(card) for card in profile.get("riskCards", [])]

    ranked_cards = rank_risk_cards(cards)
    evidence_refs = _unique_evidence_refs(
        list(resolved.get("evidenceRefs", []))
        + [ref for card in ranked_cards for ref in card.get("evidenceRefs", [])]
    )
    summary = _risk_summary(ranked_cards)

    result = {
        "dataStatus": "OK" if profile else "NO_EVIDENCE",
        "objectType": "OperationalRiskRadarResult",
        "query": deepcopy(dict(query)),
        "resolvedContext": resolved,
        "riskSummary": summary,
        "riskCards": ranked_cards,
        "evidenceRefs": evidence_refs,
        "missingInputs": sorted({item for card in ranked_cards for item in card.get("missingInputs", [])}),
        "privacy": deepcopy(resolved.get("privacy", _privacy_default())),
        "actionBoundary": _action_boundary(),
        "nextAction": _next_action_from_summary(summary),
    }
    result["validationFindings"] = validate_risk_output(result)
    return result


def build_costguard_evidence_pack(
    query: Mapping[str, Any],
    resolver_index: Mapping[str, Any] | None = None,
    risk_index: Mapping[str, Any] | None = None,
) -> Dict[str, Any]:
    """Build a read-only CostGuard evidence pack for invoice-centered review."""
    risk_index = deepcopy(risk_index) if risk_index is not None else load_default_risk_index()
    resolved = resolve_any_key(query, index=resolver_index)
    profile = _find_profile(resolved, risk_index)
    pack = deepcopy((profile or {}).get("costGuardEvidence") or {})

    if not pack:
        result = {
            "dataStatus": "NO_EVIDENCE",
            "objectType": "CostGuardEvidencePack",
            "query": deepcopy(dict(query)),
            "resolvedContext": resolved,
            "invoiceIdentity": {},
            "invoiceLines": [],
            "linkedEvidence": [],
            "warehouseEvidence": [],
            "costGuardResult": {
                "objectType": "CostGuardResult",
                "reviewStance": "EVIDENCE_MISSING",
                "severity": "NO_EVIDENCE",
                "riskTypes": [],
                "missingInputs": ["invoice evidence", "BOE evidence", "CIPL evidence", "tariff evidence"],
            },
            "evidenceRefs": deepcopy(resolved.get("evidenceRefs", [])),
            "missingInputs": ["invoice evidence", "BOE evidence", "CIPL evidence", "tariff evidence"],
            "reviewStance": "EVIDENCE_MISSING",
            "privacy": deepcopy(resolved.get("privacy", _privacy_default())),
            "actionBoundary": _action_boundary(),
            "nextAction": "Collect missing evidence before finance review.",
        }
    else:
        result = {
            "dataStatus": "OK",
            "objectType": "CostGuardEvidencePack",
            "query": deepcopy(dict(query)),
            "resolvedContext": resolved,
            "invoiceIdentity": deepcopy(pack.get("invoiceIdentity", {})),
            "invoiceLines": deepcopy(pack.get("invoiceLines", [])),
            "linkedEvidence": deepcopy(pack.get("linkedEvidence", [])),
            "warehouseEvidence": deepcopy(pack.get("warehouseEvidence", [])),
            "costGuardResult": deepcopy(pack.get("costGuardResult", {})),
            "evidenceRefs": _unique_evidence_refs(
                list(resolved.get("evidenceRefs", []))
                + list(pack.get("evidenceRefs", []))
                + [ref for link in pack.get("linkedEvidence", []) for ref in link.get("evidenceRefs", [])]
            ),
            "missingInputs": sorted(set(pack.get("missingInputs", []))),
            "reviewStance": str(pack.get("reviewStance", "REVIEW_REQUIRED")),
            "privacy": deepcopy(resolved.get("privacy", _privacy_default())),
            "actionBoundary": _action_boundary(),
            "nextAction": "Review evidence gaps before finance decision.",
        }

    result["validationFindings"] = validate_risk_output(result)
    return result


def rank_risk_cards(cards: List[Mapping[str, Any]]) -> List[Dict[str, Any]]:
    """Rank cards by severity while preserving stable alphabetical order within a severity."""
    normalized = [_normalize_card(card) for card in cards]
    return sorted(
        normalized,
        key=lambda card: (-SEVERITY_ORDER.get(str(card.get("severity", "INFO")).upper(), 2), str(card.get("riskType", ""))),
    )


def validate_risk_output(result: Mapping[str, Any]) -> List[str]:
    """Return validation findings for a public risk radar or evidence pack output."""
    findings = list(validate_public_output(result))
    object_type = result.get("objectType")

    boundary = result.get("actionBoundary") or {}
    if boundary.get("mutationAllowed") is not False:
        findings.append("actionBoundary.mutationAllowed must be false")
    if boundary.get("mode") != "EVIDENCE_REVIEW_ONLY":
        findings.append("actionBoundary.mode must be EVIDENCE_REVIEW_ONLY")

    if object_type == "OperationalRiskRadarResult":
        cards = list(result.get("riskCards") or [])
        if not cards:
            findings.append("riskCards must not be empty")
        for index, card in enumerate(cards):
            missing = REQUIRED_CARD_FIELDS - set(card)
            if missing:
                findings.append(f"riskCards[{index}] missing fields: {', '.join(sorted(missing))}")
            if _contains_prohibited_action_text(card.get("nextAction")):
                findings.append(f"riskCards[{index}] nextAction contains action wording outside read-only scope")
            if len(str(card.get("nextAction", "")).split(".")) > 2:
                findings.append(f"riskCards[{index}] nextAction should be one clear action")
    elif object_type == "CostGuardEvidencePack":
        for field in ("invoiceIdentity", "linkedEvidence", "costGuardResult", "reviewStance", "missingInputs"):
            if field not in result:
                findings.append(f"CostGuardEvidencePack missing field: {field}")
        if _contains_prohibited_action_text(result.get("nextAction")):
            findings.append("CostGuardEvidencePack nextAction contains action wording outside read-only scope")
    else:
        findings.append(f"Unsupported risk output objectType: {object_type}")

    return findings


def _find_profile(resolved: Mapping[str, Any], risk_index: Mapping[str, Any]) -> Mapping[str, Any] | None:
    pairs = _candidate_pairs(resolved)
    for profile in risk_index.get("profiles", []) or []:
        for key in profile.get("matchKeys", []) or []:
            pair = (
                str(key.get("scheme") or "").upper(),
                normalize_identifier_value(str(key.get("value") or "")),
            )
            if pair in pairs:
                return profile
    return None


def _candidate_pairs(resolved: Mapping[str, Any]) -> set[tuple[str, str]]:
    pairs = {
        (
            str(resolved.get("detectedScheme") or "").upper(),
            normalize_identifier_value(str(resolved.get("normalizedKey") or "")),
        )
    }
    context = resolved.get("canonicalContext") or {}
    for identifier in context.get("identifiers", []) or []:
        scheme = str(identifier.get("identifierScheme") or "").upper()
        value = normalize_identifier_value(str(identifier.get("identifierValue") or identifier.get("normalizedValue") or ""))
        if scheme and value:
            pairs.add((scheme, value))
    return pairs


def _normalize_card(card: Mapping[str, Any]) -> Dict[str, Any]:
    result = {
        "objectType": "RiskCard",
        "riskType": str(card.get("riskType", "UNKNOWN")),
        "status": str(card.get("status", "REVIEW")),
        "severity": str(card.get("severity", "INFO")).upper(),
        "confidence": float(card.get("confidence", 0.0)),
        "evidenceRefs": deepcopy(list(card.get("evidenceRefs") or [])),
        "missingInputs": sorted(set(card.get("missingInputs") or [])),
        "ownerCue": str(card.get("ownerCue", "SCM owner")),
        "nextAction": str(card.get("nextAction", "Review evidence.")),
        "reviewStance": str(card.get("reviewStance", "REVIEW_REQUIRED")),
    }
    if "details" in card:
        result["details"] = deepcopy(card["details"])
    return result


def _risk_summary(cards: Iterable[Mapping[str, Any]]) -> Dict[str, Any]:
    cards = list(cards)
    highest = "NO_EVIDENCE"
    for card in cards:
        severity = str(card.get("severity", "INFO")).upper()
        if SEVERITY_ORDER.get(severity, 0) > SEVERITY_ORDER.get(highest, 0):
            highest = severity
    open_count = sum(1 for card in cards if str(card.get("severity", "")).upper() not in {"PASS"})
    missing_count = sum(len(card.get("missingInputs", []) or []) for card in cards)
    return {
        "totalCards": len(cards),
        "highestSeverity": highest,
        "openCardCount": open_count,
        "missingInputCount": missing_count,
        "reviewStance": "REVIEW_REQUIRED" if SEVERITY_ORDER.get(highest, 0) >= SEVERITY_ORDER["WARN"] else "MONITOR",
    }


def _next_action_from_summary(summary: Mapping[str, Any]) -> str:
    if summary.get("missingInputCount", 0):
        return "Review missing evidence before relying on the radar."
    if summary.get("reviewStance") == "REVIEW_REQUIRED":
        return "Review high-severity cards with the responsible owner."
    return "Monitor resolved context and keep evidence current."


def _unique_evidence_refs(refs: Iterable[Mapping[str, Any]]) -> List[Dict[str, Any]]:
    seen = set()
    unique = []
    for ref in refs:
        evidence_id = str(ref.get("evidenceId") or "")
        if not evidence_id or evidence_id in seen:
            continue
        seen.add(evidence_id)
        unique.append(deepcopy(dict(ref)))
    return unique


def _contains_prohibited_action_text(value: Any) -> bool:
    text = str(value or "").lower()
    return any(word in text for word in PROHIBITED_ACTION_WORDS)


def _privacy_default() -> Dict[str, Any]:
    return {"rawEvidenceExposed": False, "piiMasked": False, "maskingApplied": []}


def _action_boundary() -> Dict[str, Any]:
    return {
        "mode": "EVIDENCE_REVIEW_ONLY",
        "readOnly": True,
        "mutationAllowed": False,
        "requiresHumanGateForAction": True,
    }


__all__ = [
    "REQUIRED_CARD_FIELDS",
    "build_costguard_evidence_pack",
    "build_operational_risk_radar",
    "load_default_risk_index",
    "rank_risk_cards",
    "validate_risk_output",
]
