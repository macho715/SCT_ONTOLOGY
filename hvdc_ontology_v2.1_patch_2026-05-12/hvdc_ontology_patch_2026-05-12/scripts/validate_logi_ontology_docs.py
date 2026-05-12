#!/usr/bin/env python3
"""
HVDC Logistics Ontology semantic guard.

Purpose:
- Enforce Flow Code / WHP boundary.
- Detect residual route-coded Flow Code leakage outside explicit migration/deprecation text.
- Check MOSB is not typed as Warehouse in canonical examples.
- Check SPARQL snippets in CONSOLIDATED-09 include the prefixes they use.

Exit codes:
  0 PASS
  1 FAIL
"""
from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
DOCS = [
    "CONSOLIDATED-00-master-ontology.md",
    "CONSOLIDATED-01-core-framework-infra.md",
    "CONSOLIDATED-02-warehouse-flow.md",
    "CONSOLIDATED-03-document-ocr.md",
    "CONSOLIDATED-04-barge-bulk-cargo.md",
    "CONSOLIDATED-05-invoice-cost.md",
    "CONSOLIDATED-06-material-handling.md",
    "CONSOLIDATED-07-port-operations.md",
    "CONSOLIDATED-08-communication.md",
    "CONSOLIDATED-09-operations.md",
    "AGENTS.md",
]

ALLOWED_MIGRATION_CONTEXT = re.compile(
    r"(Legacy|Migration|Do not|Do not use|Not allowed|Disallowed|Boundary|Validation|Guard|Deprecated|deprecation|"
    r"replacement|Replace|Remove|VIOLATION|Expected result|Patch action|must not|not own|not |never|evidence only|read-only|PASS)",
    re.IGNORECASE,
)

BANNED_FLOW_TERMS = [
    "assignedFlowCode",
    "extractedFlowCode",
    "costByFlowCode",
    "hasLogisticsFlowCode",
    "Port-Assigned Flow Code",
]

ROUTE_FLOW_PATTERNS = [
    re.compile(r"Flow Code\s+[0-5].*(Port|WH|MOSB|Site|route|customs|marine)", re.IGNORECASE),
    re.compile(r"(Port|WH|MOSB|Site|route|customs|marine).*Flow Code\s+[0-5]", re.IGNORECASE),
    re.compile(r"Flow Code.*(route|routing|journey|lifecycle|end-to-end)", re.IGNORECASE),
    re.compile(r"(route|routing|journey|lifecycle|end-to-end).*Flow Code", re.IGNORECASE),
]

PREFIX_RE = re.compile(r"^PREFIX\s+(\w+):", re.MULTILINE)
USED_PREFIX_RE = re.compile(r"\b([A-Za-z][A-Za-z0-9_-]*):[A-Za-z_][A-Za-z0-9_-]*")
IGNORE_PREFIXES = {"http", "https", "mailto", "urn"}


def iter_lines(path: Path) -> Iterable[tuple[int, str]]:
    for i, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        yield i, line


def in_allowed_context(line: str) -> bool:
    stripped = line.strip()
    # Markdown tables and governance bullets are often explicit migration / do-not-use maps.
    # They are allowed as documentation, while concrete TTL/SPARQL/prose assertions are checked.
    if stripped.startswith("|") or stripped.startswith("-"):
        return True
    return bool(ALLOWED_MIGRATION_CONTEXT.search(line))


def check_flow_terms(errors: list[str]) -> None:
    for doc in DOCS:
        path = ROOT / doc
        if not path.exists():
            errors.append(f"MISSING: {doc}")
            continue
        for lineno, line in iter_lines(path):
            # Banned legacy identifiers may appear in explicit migration/deprecation maps only.
            for term in BANNED_FLOW_TERMS:
                if term in line and not in_allowed_context(line):
                    errors.append(f"{doc}:{lineno}: legacy identifier outside migration context: {term}")
            # Route-coded Flow Code wording must be migration-only.
            for pat in ROUTE_FLOW_PATTERNS:
                if pat.search(line) and not in_allowed_context(line):
                    errors.append(f"{doc}:{lineno}: route-coded Flow Code wording outside guard/migration context: {line.strip()}")


def check_master_flow_dictionary(errors: list[str]) -> None:
    path = ROOT / "CONSOLIDATED-00-master-ontology.md"
    text = path.read_text(encoding="utf-8")
    required = [
        "STANDARD_INDOOR",
        "STANDARD_OUTDOOR",
        "SPECIAL_INDOOR",
        "SPECIAL_OUTDOOR",
        "HAZMAT_DG",
        "OOG_ABNORMAL",
    ]
    for token in required:
        if token not in text:
            errors.append(f"CONSOLIDATED-00-master-ontology.md: missing WHP class {token}")
    disallowed_value_names = [
        "PRE_WH_OR_TENTATIVE",
        "WH_BYPASS_CONFIRMED",
        "WH_LINKED_OFFSHORE_HANDLING",
        "MULTI_WH_OFFSHORE_HANDLING",
        "MIXED_OR_UNRESOLVED_WH_PATTERN",
    ]
    for token in disallowed_value_names:
        if token in text:
            errors.append(f"CONSOLIDATED-00-master-ontology.md: route-like confirmedFlowCode value remains: {token}")


def check_mosb_not_warehouse(errors: list[str]) -> None:
    risky = re.compile(r"MOSB\s+(a|rdf:type|typed as|is)\s+[`\"]?Warehouse", re.IGNORECASE)
    for doc in DOCS:
        path = ROOT / doc
        if not path.exists():
            continue
        for lineno, line in iter_lines(path):
            if risky.search(line) and not in_allowed_context(line):
                errors.append(f"{doc}:{lineno}: MOSB typed as Warehouse outside guard context")


def check_sparql_prefixes(errors: list[str]) -> None:
    path = ROOT / "CONSOLIDATED-09-operations.md"
    text = path.read_text(encoding="utf-8")
    blocks = re.findall(r"```sparql\n(.*?)\n```", text, flags=re.DOTALL)
    for idx, block in enumerate(blocks, start=1):
        declared = set(PREFIX_RE.findall(block))
        used = {m.group(1) for m in USED_PREFIX_RE.finditer(block)} - IGNORE_PREFIXES
        missing = sorted(used - declared)
        if missing:
            errors.append(f"CONSOLIDATED-09-operations.md: SPARQL block {idx} missing PREFIX declarations: {', '.join(missing)}")


def main() -> int:
    errors: list[str] = []
    check_flow_terms(errors)
    check_master_flow_dictionary(errors)
    check_mosb_not_warehouse(errors)
    check_sparql_prefixes(errors)
    if errors:
        print("FAIL")
        for e in errors:
            print(f"- {e}")
        return 1
    print("PASS")
    print("- Flow Code route leakage: 0.00 blockers")
    print("- Master/WHP confirmedFlowCode dictionary alignment: PASS")
    print("- MOSB top-level Warehouse typing: 0.00 blockers")
    print("- CONSOLIDATED-09 SPARQL prefix completeness: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
