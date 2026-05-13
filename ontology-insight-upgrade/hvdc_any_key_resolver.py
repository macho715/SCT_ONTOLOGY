"""Read-only operational identifier resolver for HVDC ontology contexts.

The resolver accepts supported business keys, normalizes them, and returns
canonical context plus evidence metadata. It does not write files, call network
services, mutate graph data, or expose raw evidence rows by default.
"""

from __future__ import annotations

import json
import re
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, MutableMapping, Tuple

from hvdc_semantic_adapter import adapt_uncertain_join, no_evidence_result, validate_public_output


SUPPORTED_IDENTIFIER_SCHEMES = {
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

RESOLVER_STATUSES = {
    "MATCHED",
    "AMBIGUOUS",
    "NOT_FOUND",
    "CONFLICTING_EVIDENCE",
    "UNSUPPORTED_KEY",
    "MASKED",
}

DEFAULT_INDEX_PATH = Path(__file__).resolve().parent / "fixtures" / "resolver" / "resolver_index.json"

EMAIL_RE = re.compile(r"\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b")
WIN_PATH_RE = re.compile(
    r"(?i)\b[A-Z]:\\.*?(?=(?:\s+[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b|\s+token=|\s+Bearer\s+|\s+sk-|\s+mcp_|\s+[a-f0-9]{32}\b|$|[,;\"']))"
)
TOKEN_RE = re.compile(
    r"(?i)\b(?:Bearer\s+[A-Za-z0-9._-]{8,}|sk-[A-Za-z0-9_-]{8,}|mcp_[A-Za-z0-9_-]{8,}|token=[A-Za-z0-9._-]{8,})"
)
ACCOUNT_ID_RE = re.compile(r"\b[a-f0-9]{32}\b")


def load_default_index() -> Dict[str, Any]:
    """Load the bundled read-only fixture index."""
    with DEFAULT_INDEX_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_identifier_value(value: str) -> str:
    """Normalize an operational key without guessing its business meaning."""
    text = str(value or "").strip().upper()
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-{2,}", "-", text)
    return text.strip("-")


def detect_identifier_scheme(value: str, hints: Mapping[str, Any] | None = None) -> str:
    """Detect a supported identifier scheme. Explicit hints take precedence."""
    hints = hints or {}
    hinted = str(
        hints.get("scheme")
        or hints.get("identifierScheme")
        or hints.get("detectedScheme")
        or ""
    ).strip().upper()
    if hinted in SUPPORTED_IDENTIFIER_SCHEMES:
        return hinted

    normalized = normalize_identifier_value(value)
    if normalized.startswith("HVDC-"):
        return "HVDC_CODE"
    if normalized.startswith("PKG-") or normalized.startswith("PACKAGE-"):
        return "PACKAGE_NO"
    if normalized.startswith("CASE-"):
        return "CASE_NO"
    if normalized.startswith("BL-"):
        return "BL_NO"
    if normalized.startswith("INV-") or normalized.startswith("INVOICE-"):
        return "INVOICE_NO"
    if normalized.startswith("PO-"):
        return "PO_NO"
    if normalized.startswith("BOE-"):
        return "BOE_NO"
    if normalized.startswith("DO-"):
        return "DO_NO"
    if normalized.startswith("VEND-") or normalized.startswith("SUP-"):
        return "VENDOR_CODE"
    if normalized in {"MIR", "DAS", "AGI", "MOSB"} or normalized.startswith("SITE-"):
        return "SITE_CODE"
    if normalized.startswith("CONT-") or re.fullmatch(r"[A-Z]{4}\d{7}", normalized):
        return "CONTAINER_NO"
    return "UNSUPPORTED_KEY"


def mask_user_facing_value(value: str) -> str:
    """Return a masked string suitable for user-facing evidence excerpts."""
    masked, _ = _mask_text(str(value or ""))
    return masked


def resolve_any_key(query: Mapping[str, Any], index: Mapping[str, Any] | None = None) -> Dict[str, Any]:
    """Resolve a supported operational key into read-only canonical context."""
    index = deepcopy(index) if index is not None else load_default_index()
    raw_value = str(query.get("value") or query.get("identifier") or query.get("key") or "").strip()
    scheme = detect_identifier_scheme(raw_value, query)
    normalized_key = normalize_identifier_value(raw_value)

    if not raw_value or scheme == "UNSUPPORTED_KEY":
        return _unsupported_result(raw_value, normalized_key)

    conflict = _find_conflict(index, scheme, normalized_key)
    if conflict:
        return _conflict_result(raw_value, scheme, normalized_key, conflict)

    matches = _find_matches(index, scheme, normalized_key)
    if len(matches) == 1:
        return _matched_result(raw_value, scheme, normalized_key, matches[0])
    if len(matches) > 1:
        return _ambiguous_result(raw_value, scheme, normalized_key, matches)
    return _not_found_result(raw_value, scheme, normalized_key)


def _matched_result(raw_value: str, scheme: str, normalized_key: str, record: Mapping[str, Any]) -> Dict[str, Any]:
    masked_source_fields, privacy = _mask_payload(list(record.get("sourceFields") or []))
    context = deepcopy(record.get("canonicalContext") or {})
    semantic_violations = validate_public_output(context)
    status = "MATCHED" if not semantic_violations else "CONFLICTING_EVIDENCE"

    result = {
        "dataStatus": "OK" if status == "MATCHED" else "CONFLICT",
        "objectType": "AnyKeyResolverResult",
        "query": {
            "rawValue": raw_value,
            "schemeHint": scheme,
            "normalizedValue": normalized_key,
        },
        "detectedScheme": scheme,
        "normalizedKey": normalized_key,
        "status": status,
        "confidence": float(record.get("confidence", 0.9)),
        "canonicalContext": context,
        "sourceFields": masked_source_fields,
        "evidenceRefs": deepcopy(record.get("evidenceRefs") or []),
        "evidenceState": {
            "status": "PASS" if status == "MATCHED" else "CONFLICT",
            "candidateCount": 1,
            "missingEvidence": [],
            "conflicts": semantic_violations,
        },
        "privacy": privacy,
        "nextAction": "Use resolved context for read-only risk review.",
    }
    return result


def _ambiguous_result(
    raw_value: str,
    scheme: str,
    normalized_key: str,
    matches: Iterable[Mapping[str, Any]],
) -> Dict[str, Any]:
    candidates = []
    evidence_refs = []
    privacy_accumulator: List[Mapping[str, Any]] = []
    for record in matches:
        masked_fields, privacy = _mask_payload(list(record.get("sourceFields") or []))
        privacy_accumulator.append(privacy)
        candidates.append(
            {
                "recordId": record.get("recordId"),
                "confidence": record.get("confidence", 0.5),
                "canonicalIdentifiers": deepcopy(record.get("canonicalContext", {}).get("identifiers", [])),
                "sourceFields": masked_fields,
            }
        )
        evidence_refs.extend(deepcopy(record.get("evidenceRefs") or []))

    return {
        "dataStatus": "AMBIGUOUS",
        "objectType": "AnyKeyResolverResult",
        "query": {
            "rawValue": raw_value,
            "schemeHint": scheme,
            "normalizedValue": normalized_key,
        },
        "detectedScheme": scheme,
        "normalizedKey": normalized_key,
        "status": "AMBIGUOUS",
        "confidence": 0.55,
        "canonicalContext": adapt_uncertain_join(
            {
                "lookupScheme": scheme,
                "lookupKey": normalized_key,
                "candidates": [
                    {
                        "sourceSystem": candidate["sourceFields"][0]["sourceSystem"],
                        "sourceField": candidate["sourceFields"][0]["sourceField"],
                        "recordId": candidate["recordId"],
                    }
                    for candidate in candidates
                    if candidate["sourceFields"]
                ],
            }
        ),
        "candidates": candidates,
        "sourceFields": [],
        "evidenceRefs": evidence_refs,
        "evidenceState": {
            "status": "AMBIGUOUS",
            "candidateCount": len(candidates),
            "missingEvidence": [],
            "conflicts": [],
        },
        "privacy": _merge_privacy(privacy_accumulator),
        "nextAction": "Review alternate candidates before using this key.",
    }


def _conflict_result(
    raw_value: str,
    scheme: str,
    normalized_key: str,
    conflict: Mapping[str, Any],
) -> Dict[str, Any]:
    masked_candidates, privacy = _mask_payload(list(conflict.get("candidates") or []))
    semantic_context = adapt_uncertain_join(
        {
            "lookupScheme": scheme,
            "lookupKey": normalized_key,
            "candidates": masked_candidates,
            "conflicts": deepcopy(conflict.get("conflicts") or []),
        }
    )
    return {
        "dataStatus": "CONFLICT",
        "objectType": "AnyKeyResolverResult",
        "query": {
            "rawValue": raw_value,
            "schemeHint": scheme,
            "normalizedValue": normalized_key,
        },
        "detectedScheme": scheme,
        "normalizedKey": normalized_key,
        "status": "CONFLICTING_EVIDENCE",
        "confidence": float(conflict.get("confidence", 0.4)),
        "canonicalContext": semantic_context,
        "candidates": masked_candidates,
        "sourceFields": [],
        "evidenceRefs": deepcopy(semantic_context.get("evidenceRefs") or []),
        "evidenceState": {
            "status": "CONFLICT",
            "candidateCount": len(masked_candidates),
            "missingEvidence": [],
            "conflicts": deepcopy(conflict.get("conflicts") or []),
        },
        "privacy": privacy,
        "nextAction": "Resolve conflicting evidence before relying on this key.",
    }


def _not_found_result(raw_value: str, scheme: str, normalized_key: str) -> Dict[str, Any]:
    context = no_evidence_result(query_ref=normalized_key, reason="No resolver index record matched this key.")
    return {
        "dataStatus": "NO_EVIDENCE",
        "objectType": "AnyKeyResolverResult",
        "query": {
            "rawValue": raw_value,
            "schemeHint": scheme,
            "normalizedValue": normalized_key,
        },
        "detectedScheme": scheme,
        "normalizedKey": normalized_key,
        "status": "NOT_FOUND",
        "confidence": 0.0,
        "canonicalContext": context,
        "sourceFields": [],
        "evidenceRefs": deepcopy(context.get("evidenceRefs") or []),
        "evidenceState": {
            "status": "NO_EVIDENCE",
            "candidateCount": 0,
            "missingEvidence": [scheme],
            "conflicts": [],
        },
        "privacy": _privacy_result(False, []),
        "nextAction": "Ask for another identifier or add evidence to the source index.",
    }


def _unsupported_result(raw_value: str, normalized_key: str) -> Dict[str, Any]:
    return {
        "dataStatus": "NO_EVIDENCE",
        "objectType": "AnyKeyResolverResult",
        "query": {
            "rawValue": raw_value,
            "schemeHint": None,
            "normalizedValue": normalized_key,
        },
        "detectedScheme": "UNSUPPORTED_KEY",
        "normalizedKey": normalized_key,
        "status": "UNSUPPORTED_KEY",
        "confidence": 0.0,
        "canonicalContext": no_evidence_result(
            query_ref=normalized_key or "empty-query",
            reason="Identifier scheme is unsupported or empty.",
        ),
        "sourceFields": [],
        "evidenceRefs": [],
        "evidenceState": {
            "status": "NO_EVIDENCE",
            "candidateCount": 0,
            "missingEvidence": ["SUPPORTED_IDENTIFIER"],
            "conflicts": [],
        },
        "privacy": _privacy_result(False, []),
        "nextAction": "Use a supported HVDC operational identifier.",
    }


def _find_matches(index: Mapping[str, Any], scheme: str, normalized_key: str) -> List[Mapping[str, Any]]:
    matches = []
    for record in index.get("records", []) or []:
        for identifier in record.get("identifiers", []) or []:
            if str(identifier.get("scheme") or "").upper() != scheme:
                continue
            if normalize_identifier_value(str(identifier.get("value") or "")) == normalized_key:
                matches.append(record)
                break
    return matches


def _find_conflict(index: Mapping[str, Any], scheme: str, normalized_key: str) -> Mapping[str, Any] | None:
    for conflict in index.get("conflicts", []) or []:
        if str(conflict.get("scheme") or "").upper() != scheme:
            continue
        if normalize_identifier_value(str(conflict.get("value") or "")) == normalized_key:
            return conflict
    return None


def _mask_payload(value: Any) -> Tuple[Any, Dict[str, Any]]:
    categories: List[str] = []
    masked = _mask_recursive(deepcopy(value), categories)
    return masked, _privacy_result(bool(categories), categories)


def _mask_recursive(value: Any, categories: List[str]) -> Any:
    if isinstance(value, str):
        masked, found = _mask_text(value)
        categories.extend(found)
        return masked
    if isinstance(value, list):
        return [_mask_recursive(item, categories) for item in value]
    if isinstance(value, MutableMapping):
        return {key: _mask_recursive(child, categories) for key, child in value.items()}
    return value


def _mask_text(value: str) -> Tuple[str, List[str]]:
    found: List[str] = []

    def apply(pattern: re.Pattern[str], replacement: str, category: str, text: str) -> str:
        if pattern.search(text):
            found.append(category)
        return pattern.sub(replacement, text)

    masked = value
    masked = apply(WIN_PATH_RE, "[MASKED_LOCAL_PATH]", "LOCAL_PATH", masked)
    masked = apply(EMAIL_RE, "[MASKED_EMAIL]", "EMAIL", masked)
    masked = apply(TOKEN_RE, "[MASKED_SECRET]", "SECRET", masked)
    masked = apply(ACCOUNT_ID_RE, "[MASKED_ACCOUNT_ID]", "ACCOUNT_ID", masked)
    return masked, found


def _privacy_result(masked: bool, categories: Iterable[str]) -> Dict[str, Any]:
    return {
        "rawEvidenceExposed": False,
        "piiMasked": masked,
        "maskingApplied": sorted(set(categories)),
    }


def _merge_privacy(items: Iterable[Mapping[str, Any]]) -> Dict[str, Any]:
    categories: List[str] = []
    masked = False
    for item in items:
        masked = masked or bool(item.get("piiMasked"))
        categories.extend(item.get("maskingApplied") or [])
    return _privacy_result(masked, categories)


__all__ = [
    "RESOLVER_STATUSES",
    "SUPPORTED_IDENTIFIER_SCHEMES",
    "detect_identifier_scheme",
    "load_default_index",
    "mask_user_facing_value",
    "normalize_identifier_value",
    "resolve_any_key",
]
