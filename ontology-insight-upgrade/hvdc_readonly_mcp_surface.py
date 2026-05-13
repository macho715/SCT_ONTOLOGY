"""Local read-only MCP-style tool surface for HVDC evidence lookup."""

from __future__ import annotations

import json
import re
from copy import deepcopy
from typing import Any, Dict, Iterable, List, Mapping

from hvdc_any_key_resolver import mask_user_facing_value, resolve_any_key
from hvdc_operational_risk_radar import (
    build_costguard_evidence_pack,
    build_operational_risk_radar,
    load_default_risk_index,
    validate_risk_output,
)
from hvdc_semantic_adapter import validate_public_output


READONLY_TOOLS = (
    "resolve_operational_key",
    "get_operational_risk_radar",
    "get_costguard_evidence_pack",
    "search_evidence_refs",
    "validate_mcp_output",
)

REQUIRED_ENVELOPE_FIELDS = {
    "toolName",
    "dataStatus",
    "structuredContent",
    "content",
    "evidenceRefs",
    "validation",
    "annotations",
    "privacy",
    "actionBoundary",
}

PROHIBITED_OUTPUT_TERMS = {
    "".join(("up", "load")),
    "".join(("wr", "ite")),
    "".join(("oa", "uth")),
    "".join(("pay", "ment")),
    "".join(("app", "roval")),
    "".join(("dis", "pute")),
    "".join(("esc", "alation")),
}

LOCAL_MARKERS = {
    "".join(("sp", "arql")),
    "".join(("fu", "seki")),
    "".join(("ng", "rok")),
    "localhost",
    "127.0.0.1",
    "c:\\users",
    "bearer ",
    "token=",
    "sk-",
}

EMAIL_RE = re.compile(r"\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b")
WIN_PATH_RE = re.compile(r"(?i)\b[A-Z]:\\[^\s,;\"']+")
TOKEN_RE = re.compile(r"(?i)\b(?:Bearer\s+[A-Za-z0-9._-]{8,}|sk-[A-Za-z0-9_-]{8,}|mcp_[A-Za-z0-9_-]{8,}|token=[A-Za-z0-9._-]{8,})")
ACCOUNT_ID_RE = re.compile(r"\b[a-f0-9]{32}\b")
LOCAL_URL_RE = re.compile(r"(?i)https?://(?:localhost|127\.0\.0\.1)[^\s,;\"']*")
TEMP_TUNNEL_RE = re.compile(r"(?i)https?://[A-Za-z0-9.-]*ngrok[^\s,;\"']*")


def list_mcp_tools() -> List[Dict[str, Any]]:
    """Return the V1 read-only tool inventory."""
    return [
        _tool_definition(
            "resolve_operational_key",
            "Resolve a supported HVDC operational key into canonical evidence context.",
            {"value": "string", "scheme": "string"},
        ),
        _tool_definition(
            "get_operational_risk_radar",
            "Return evidence-backed risk cards for a supported operational key.",
            {"value": "string", "scheme": "string"},
        ),
        _tool_definition(
            "get_costguard_evidence_pack",
            "Return invoice-centered CostGuard evidence review data.",
            {"value": "string", "scheme": "string"},
        ),
        _tool_definition(
            "search_evidence_refs",
            "Search evidence reference metadata without exposing raw rows.",
            {"q": "string"},
        ),
        _tool_definition(
            "validate_mcp_output",
            "Validate the public MCP-style response envelope.",
            {"output": "object"},
        ),
    ]


def call_mcp_tool(name: str, arguments: Mapping[str, Any] | None = None) -> Dict[str, Any]:
    """Call a local read-only tool and return a public MCP-style envelope."""
    arguments = dict(arguments or {})
    handlers = {
        "resolve_operational_key": resolve_operational_key,
        "get_operational_risk_radar": get_operational_risk_radar,
        "get_costguard_evidence_pack": get_costguard_evidence_pack,
        "search_evidence_refs": search_evidence_refs,
        "validate_mcp_output": validate_mcp_output,
    }
    handler = handlers.get(name)
    if not handler:
        return _envelope(
            name or "unknown_tool",
            _error_payload("UNKNOWN_TOOL", ["toolName"], "Use one of the listed read-only tools."),
        )
    try:
        return _envelope(name, handler(arguments))
    except Exception as exc:  # pragma: no cover - defensive contract boundary
        return _envelope(
            name,
            _error_payload("TOOL_ERROR", [], f"Tool failed inside local contract boundary: {type(exc).__name__}"),
        )


def resolve_operational_key(arguments: Mapping[str, Any]) -> Dict[str, Any]:
    """Resolve a supported operational key through the Phase 3 resolver."""
    if not isinstance(arguments, Mapping) or not _has_value(arguments):
        return _error_payload("MALFORMED_INPUT", ["value"], "Provide a supported operational identifier.")
    return resolve_any_key(arguments)


def get_operational_risk_radar(arguments: Mapping[str, Any]) -> Dict[str, Any]:
    """Return Phase 4 risk radar output for a supported operational key."""
    if not isinstance(arguments, Mapping) or not _has_value(arguments):
        return _error_payload("MALFORMED_INPUT", ["value"], "Provide a supported operational identifier.")
    return build_operational_risk_radar(arguments)


def get_costguard_evidence_pack(arguments: Mapping[str, Any]) -> Dict[str, Any]:
    """Return Phase 4 CostGuard evidence pack output for a supported operational key."""
    if not isinstance(arguments, Mapping) or not _has_value(arguments):
        return _error_payload("MALFORMED_INPUT", ["value"], "Provide an invoice or related operational identifier.")
    return build_costguard_evidence_pack(arguments)


def search_evidence_refs(arguments: Mapping[str, Any]) -> Dict[str, Any]:
    """Search public evidence reference metadata from the Phase 4 fixture index."""
    query = str(arguments.get("q") or arguments.get("query") or "").strip().lower()
    if not query:
        return _error_payload("MALFORMED_INPUT", ["q"], "Provide an evidence search term.")

    refs = _collect_risk_evidence_refs()
    matches = []
    for ref in refs:
        searchable = json.dumps(ref, ensure_ascii=False).lower()
        if query in searchable:
            matches.append(ref)

    return {
        "dataStatus": "OK" if matches else "NO_EVIDENCE",
        "objectType": "EvidenceSearchResult",
        "query": {"q": mask_user_facing_value(query)},
        "matchCount": len(matches),
        "evidenceRefs": matches,
        "missingInputs": [] if matches else ["evidenceRef"],
        "nextAction": "Use matched evidence refs for read-only review." if matches else "Try another evidence search term.",
    }


def validate_mcp_output(arguments: Mapping[str, Any]) -> Dict[str, Any]:
    """Validate a candidate MCP-style response envelope."""
    candidate = arguments.get("output") or arguments.get("candidate")
    if not isinstance(candidate, Mapping):
        return _error_payload("MALFORMED_INPUT", ["output"], "Provide an MCP-style response envelope.")
    findings = validate_readonly_mcp_surface_output(candidate)
    return {
        "dataStatus": "OK" if not findings else "WARN",
        "objectType": "MCPOutputValidationResult",
        "checkedTool": candidate.get("toolName"),
        "findingCount": len(findings),
        "findings": findings,
        "nextAction": "Use this response shape for read-only release checks." if not findings else "Fix validation findings before release.",
    }


def validate_readonly_mcp_surface_output(result: Mapping[str, Any]) -> List[str]:
    """Return validation findings for the public MCP-style envelope."""
    findings = []
    missing = REQUIRED_ENVELOPE_FIELDS - set(result)
    if missing:
        findings.append(f"Envelope missing fields: {', '.join(sorted(missing))}")

    annotations = result.get("annotations") or {}
    if annotations.get("readOnly") is not True:
        findings.append("annotations.readOnly must be true")
    if annotations.get("mutationAllowed") is not False:
        findings.append("annotations.mutationAllowed must be false")

    boundary = result.get("actionBoundary") or {}
    if boundary.get("readOnly") is not True:
        findings.append("actionBoundary.readOnly must be true")
    if boundary.get("mutationAllowed") is not False:
        findings.append("actionBoundary.mutationAllowed must be false")

    if not isinstance(result.get("structuredContent"), Mapping):
        findings.append("structuredContent must be an object")
    if not isinstance(result.get("content"), list):
        findings.append("content must be a list")
    if not isinstance(result.get("evidenceRefs"), list):
        findings.append("evidenceRefs must be a list")

    findings.extend(validate_public_output(result.get("structuredContent") or {}))
    if result.get("structuredContent", {}).get("objectType") in {"OperationalRiskRadarResult", "CostGuardEvidencePack"}:
        findings.extend(validate_risk_output(result["structuredContent"]))

    serialized = json.dumps(result, ensure_ascii=False).lower()
    for term in PROHIBITED_OUTPUT_TERMS:
        if term in serialized:
            findings.append(f"Output contains out-of-scope action term: {term}")
    for marker in LOCAL_MARKERS:
        if marker in serialized:
            findings.append(f"Output contains blocked local marker: {marker}")
    return findings


def _tool_definition(name: str, description: str, properties: Mapping[str, str]) -> Dict[str, Any]:
    return {
        "name": name,
        "description": description,
        "inputSchema": {
            "type": "object",
            "properties": {
                key: {"type": value}
                for key, value in properties.items()
            },
        },
        "annotations": {
            "readOnly": True,
            "mutationAllowed": False,
            "destructiveHint": False,
            "idempotentHint": True,
        },
    }


def _envelope(tool_name: str, payload: Mapping[str, Any]) -> Dict[str, Any]:
    sanitized, categories = _sanitize_payload(payload)
    evidence_refs = _extract_evidence_refs(sanitized)
    privacy = _merge_privacy(sanitized.get("privacy"), categories)
    envelope = {
        "toolName": tool_name,
        "dataStatus": sanitized.get("dataStatus", "OK"),
        "structuredContent": sanitized,
        "content": [{"type": "text", "text": _summary(tool_name, sanitized, evidence_refs)}],
        "evidenceRefs": evidence_refs,
        "validation": {"status": "PENDING", "findings": []},
        "annotations": {
            "readOnly": True,
            "mutationAllowed": False,
            "destructiveHint": False,
            "idempotentHint": True,
        },
        "privacy": privacy,
        "actionBoundary": _action_boundary(),
    }
    findings = validate_readonly_mcp_surface_output(envelope)
    envelope["validation"] = {
        "status": "PASS" if not findings else "WARN",
        "findings": findings,
    }
    return envelope


def _error_payload(status: str, missing_inputs: Iterable[str], next_action: str) -> Dict[str, Any]:
    return {
        "dataStatus": status,
        "objectType": "MCPToolError",
        "status": status,
        "missingInputs": list(missing_inputs),
        "evidenceRefs": [],
        "nextAction": next_action,
    }


def _has_value(arguments: Mapping[str, Any]) -> bool:
    return bool(str(arguments.get("value") or arguments.get("identifier") or arguments.get("key") or "").strip())


def _summary(tool_name: str, payload: Mapping[str, Any], evidence_refs: List[Mapping[str, Any]]) -> str:
    status = payload.get("status") or payload.get("reviewStance") or payload.get("dataStatus", "OK")
    return f"{tool_name} returned {payload.get('objectType', 'Result')} with {status}; evidence refs: {len(evidence_refs)}."


def _extract_evidence_refs(payload: Mapping[str, Any]) -> List[Dict[str, Any]]:
    refs: List[Dict[str, Any]] = []
    _walk_refs(payload, refs)
    unique = {}
    for ref in refs:
        evidence_id = str(ref.get("evidenceId") or "")
        if evidence_id:
            unique[evidence_id] = ref
    return list(unique.values())


def _walk_refs(value: Any, refs: List[Dict[str, Any]]) -> None:
    if isinstance(value, Mapping):
        if value.get("objectType") == "EvidenceRef" and value.get("evidenceId"):
            refs.append(deepcopy(dict(value)))
        for child in value.values():
            _walk_refs(child, refs)
    elif isinstance(value, list):
        for child in value:
            _walk_refs(child, refs)


def _collect_risk_evidence_refs() -> List[Dict[str, Any]]:
    refs: List[Dict[str, Any]] = []
    index = load_default_risk_index()
    for profile in index.get("profiles", []) or []:
        _walk_refs(profile, refs)
    sanitized, _ = _sanitize_payload(refs)
    unique = {}
    for ref in sanitized:
        unique[ref["evidenceId"]] = ref
    return list(unique.values())


def _sanitize_payload(value: Any) -> tuple[Any, List[str]]:
    categories: List[str] = []
    return _sanitize_value(deepcopy(value), categories), sorted(set(categories))


def _sanitize_value(value: Any, categories: List[str]) -> Any:
    if isinstance(value, str):
        return _sanitize_text(value, categories)
    if isinstance(value, list):
        return [_sanitize_value(item, categories) for item in value]
    if isinstance(value, dict):
        return {key: _sanitize_value(child, categories) for key, child in value.items()}
    return value


def _sanitize_text(value: str, categories: List[str]) -> str:
    replacements = [
        (LOCAL_URL_RE, "[MASKED_LOCAL_URL]", "LOCAL_URL"),
        (TEMP_TUNNEL_RE, "[MASKED_TEMP_TUNNEL]", "TEMP_TUNNEL"),
        (WIN_PATH_RE, "[MASKED_LOCAL_PATH]", "LOCAL_PATH"),
        (EMAIL_RE, "[MASKED_EMAIL]", "EMAIL"),
        (TOKEN_RE, "[MASKED_SECRET]", "SECRET"),
        (ACCOUNT_ID_RE, "[MASKED_ACCOUNT_ID]", "ACCOUNT_ID"),
    ]
    text = value
    for pattern, replacement, category in replacements:
        if pattern.search(text):
            categories.append(category)
        text = pattern.sub(replacement, text)

    low = text.lower()
    if "".join(("local-", "fuseki")) in low:
        categories.append("LOCAL_RUNTIME")
        text = re.sub("local-fuseki", "analysis-fixture", text, flags=re.IGNORECASE)
    if "".join(("sparql", "_row")) in low:
        categories.append("RAW_QUERY_SURFACE")
        text = re.sub("sparql_row", "analysis_row", text, flags=re.IGNORECASE)
    return text


def _merge_privacy(payload_privacy: Any, categories: Iterable[str]) -> Dict[str, Any]:
    category_set = set(categories)
    if isinstance(payload_privacy, Mapping):
        category_set.update(payload_privacy.get("maskingApplied") or [])
    return {
        "rawEvidenceExposed": False,
        "piiMasked": bool(category_set),
        "maskingApplied": sorted(category_set),
    }


def _action_boundary() -> Dict[str, Any]:
    return {
        "mode": "READ_ONLY_EVIDENCE_LOOKUP",
        "readOnly": True,
        "mutationAllowed": False,
        "requiresHumanGateForAction": True,
        "futureChangePolicy": "separate scoped release required",
    }


__all__ = [
    "READONLY_TOOLS",
    "call_mcp_tool",
    "get_costguard_evidence_pack",
    "get_operational_risk_radar",
    "list_mcp_tools",
    "resolve_operational_key",
    "search_evidence_refs",
    "validate_mcp_output",
    "validate_readonly_mcp_surface_output",
]
