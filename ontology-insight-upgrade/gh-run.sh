#!/usr/bin/env bash
# gh-run.sh
# Lightweight helper to run a workflow_dispatch workflow with inputs via GitHub CLI (gh)
# Usage examples:
#   ./gh-run.sh -w "HVDC Audit Integrity & Smoke Test" -r main -f target_branch=main -f run_smoke=true -f slack_notify=true
#   ./gh-run.sh --workflow-file .github/workflows/audit-smoke.yml --ref main -F params.json
#
# Notes:
# - gh CLI must be installed and authenticated (gh auth login).
# - Input fields may be passed with -f key=value multiple times or via a JSON file (-F).
# - See GitHub CLI docs: https://cli.github.com/manual/gh_workflow_run
# - See workflow_dispatch docs: https://docs.github.com/actions/managing-workflow-runs/manually-running-a-workflow

set -euo pipefail

print_usage() {
  cat <<EOF
Usage: $0 [options]
Options:
  -w, --workflow-name "NAME"    Workflow file name or display name (required unless --workflow-file used)
  -f, --field key=value          One or more inputs to pass to the workflow (repeatable)
  -F, --field-file JSON_FILE     JSON file with inputs (e.g. {"target_branch":"main","run_smoke":true})
  -r, --ref REF                  Git ref (branch or commit) to run the workflow against (default: main)
  -R, --repo REPO                GitHub repo (owner/repo). If omitted, current repo is used.
  -h, --help                     Show this help
Examples:
  $0 -w "HVDC Audit Integrity & Smoke Test" -r main -f target_branch=main -f run_smoke=true -f slack_notify=true
  $0 -w "audit-smoke.yml" -r main -F inputs.json
EOF
}

WORKFLOW=""
WORKFLOW_FILE=""
REF="main"
REPO=""
FIELDS=()
FIELD_FILE=""

# parse args
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    -w|--workflow-name) WORKFLOW="$2"; shift 2 ;;
    --workflow-file) WORKFLOW_FILE="$2"; shift 2 ;;
    -f|--field) FIELDS+=("$2"); shift 2 ;;
    -F|--field-file) FIELD_FILE="$2"; shift 2 ;;
    -r|--ref) REF="$2"; shift 2 ;;
    -R|--repo) REPO="$2"; shift 2 ;;
    -h|--help) print_usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; print_usage; exit 2 ;;
  esac
done

# Pre-checks
if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh (GitHub CLI) not found. Install from https://cli.github.com/" >&2
  exit 3
fi

# Ensure authenticated
if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh not authenticated. Run: gh auth login" >&2
  gh auth login || true
  if ! gh auth status >/dev/null 2>&1; then
    echo "ERROR: authentication still not configured. Aborting." >&2
    exit 4
  fi
fi

if [[ -z "$WORKFLOW" && -z "$WORKFLOW_FILE" ]]; then
  echo "ERROR: please provide --workflow-name or --workflow-file" >&2
  print_usage
  exit 2
fi

# Build gh workflow run command
CMD=(gh workflow run)
if [[ -n "$WORKFLOW" ]]; then
  CMD+=("$WORKFLOW")
else
  # If a workflow file path is specified, use the filename (gh accepts file name or id)
  fname=$(basename "$WORKFLOW_FILE")
  CMD+=("$fname")
fi

# add ref
CMD+=(--ref "$REF")

# Add repo if provided
if [[ -n "$REPO" ]]; then
  CMD+=(--repo "$REPO")
fi

# Attach fields
if [[ -n "$FIELD_FILE" ]]; then
  # If JSON file provided, feed via stdin to gh workflow run
  if [[ ! -f "$FIELD_FILE" ]]; then
    echo "ERROR: field file not found: $FIELD_FILE" >&2
    exit 5
  fi
  echo "Running: \${CMD[*]} with JSON fields from $FIELD_FILE"
  # gh supports reading JSON from stdin
  gh workflow run "${CMD[2]}" --ref "$REF" --repo "$REPO" < "$FIELD_FILE"
else
  # append -f for each key=value
  for kv in "${FIELDS[@]}"; do
    CMD+=(-f "$kv")
  done
  echo "Running: \${CMD[*]}"
  # run the command
  eval "${CMD[*]}"
fi

# give user a short summary of latest runs
echo
echo "Recent workflow runs (latest 5):"
if [[ -n "$WORKFLOW" ]]; then
  gh run list --workflow "$WORKFLOW" --limit 5 --repo "$REPO" || true
else
  gh run list --workflow "$fname" --limit 5 --repo "$REPO" || true
fi

echo
echo "To inspect a run's logs: gh run view <run-id> --logs --repo <owner/repo>"
