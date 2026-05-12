#!/usr/bin/env python3
"""Validate email drafting guard patch for HVDC communication ontology."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
checks = []

def require(path: str, token: str, label: str):
    text = (ROOT / path).read_text(encoding="utf-8")
    ok = token in text
    checks.append((label, ok, path, token))

require("AGENTS.md", "Email drafting mode boundary", "AGENTS email drafting boundary")
require("AGENTS.md", "NO_AUTO_SCT_ONTOLOGY", "AGENTS no-auto ontology token")
require("AGENTS.md", "[EMAIL_ACTION_CARD]", "AGENTS hard-marked card template")
require("data/corpus/CONSOLIDATED-00-master-ontology.md", "V-COMM-DRAFT-001", "Master validation rule")
require("data/corpus/CONSOLIDATED-08-communication.md", "Email Drafting Guard", "Communication drafting guard")
require("data/corpus/CONSOLIDATED-08-communication.md", "EmailActionCard", "Communication EmailActionCard class/rule")
require("data/corpus/CONSOLIDATED-08-communication.md", "COMM-DRAFT-002", "Communication no-auto ontology gate")
require("ontology/HVDC_Logistics_Ontology.combined.md", "Email Drafting Guard", "Combined corpus includes guard")

failed = [c for c in checks if not c[1]]
for label, ok, path, token in checks:
    status = "PASS" if ok else "FAIL"
    print(f"{status}: {label} ({path})")

if failed:
    print("\nBlockers:")
    for label, ok, path, token in failed:
        print(f"- {label}: missing {token!r} in {path}")
    sys.exit(1)

print("\nPASS: email drafting guard patch validated.")
