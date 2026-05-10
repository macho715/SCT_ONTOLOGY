/goal

Goal:
Bring the HVDC Ontology ChatGPT App repository to an operationally reliable Option B state: ontology changes are automatically verified, Apps SDK tool contracts are submission-ready, Evidence Drawer behavior is testable, golden evaluations cover high-risk prompts, and repository security monitoring is documented.

Scope:
- Repository root: `C:\Users\jichu\Downloads\HVDC Ontology Grounded`
- Planning inputs: `plan.md`, `docs/SPEC_IMPROVEMENTS.md`, `AGENTS.md`
- App/server files: `server/src/**`, `public/**`, `chatgpt-app-submission.json`
- Corpus and index files: `ontology/**`, `data/corpus/**`, `data/index/**`, `scripts/index_corpus.py`
- Tests and evaluation files: `tests/**`
- GitHub workflow files: `.github/workflows/**`
- Exclusions: production data mutation, ERP/WMS/ATLP/Foundry write-back, external message sending, unapproved Railway production deploy, unapproved secret or token changes.

Hard Constraints:
1. Read `AGENTS.md` before making changes and keep its reporting and evidence rules.
2. Do not delete files unless the user gives explicit approval for exact file paths.
3. Do not expose secrets, tokens, credentials, private URLs, phone numbers, or email addresses in output.
4. Do not install packages, change lockfiles, access external network, commit, push, deploy, or alter GitHub/Railway settings without explicit approval.
5. Do not change ontology semantics, compliance interpretation, CostGuard thresholds, Flow Code boundaries, or human-gate rules without a separate domain approval.
6. Keep local CI verification, GitHub Actions verification, and live Railway MCP validation as separate evidence categories.
7. Treat `data/index/**` as generated evidence unless the generated-artifact policy is explicitly changed.

Required Workflow:
1. Confirm the current git state, current branch, remote, and uncommitted files.
2. Read `plan.md`, `docs/SPEC_IMPROVEMENTS.md`, and relevant source files before editing.
3. Resolve or explicitly preserve open questions from `docs/SPEC_IMPROVEMENTS.md`.
4. Build an affected-file inventory and route work using the dispatch split.
5. Strengthen GitHub Actions verification for corpus/index/app contract checks.
6. Strengthen Apps SDK descriptor parity checks for `outputSchema`, `_meta`, and tool annotations.
7. Improve Evidence Drawer rendering and fallback behavior without weakening PII masking.
8. Add or expand golden eval fixtures for AGI M130, Flow Code, NO_EVIDENCE, stale-source compliance, and invoice/cost human-gate behavior.
9. Document GitHub security monitoring status for Secret Scanning, Dependabot alerts, and Code Scanning.
10. Run local verification and collect evidence.
11. Stop for approval before commit, push, deployment, external settings changes, or production configuration changes.
12. Produce a final summary with changed files, generated files, commands, tests, results, risks, and next action.

Verification:
- `npm run index` completes and reports indexed corpus documents/chunks.
- JSON validation passes for `data/index/corpus_index.json`, `data/index/source_role_map.json`, and `chatgpt-app-submission.json`.
- `npm run verify` passes locally.
- Descriptor parity tests confirm server tools and submission tools match.
- Golden eval tests pass for required high-risk prompt classes.
- PII redaction tests pass for email and phone-like examples.
- Evidence Drawer checks confirm source document, section path, doc hash, validation status, and fallback text are present.
- GitHub security monitoring status is documented with evidence or marked unavailable/pending.

Stop Conditions:
Stop and ask before continuing if:
1. A required change would delete, move, or rename files outside the approved scope.
2. Package installation, lockfile change, external network access, commit, push, deployment, GitHub settings changes, or Railway settings changes are needed.
3. Secrets, tokens, credentials, private URLs, phone numbers, email addresses, or other sensitive data may be exposed.
4. Ontology semantics, compliance interpretation, CostGuard thresholds, Flow Code rules, or human-gate rules need to change.
5. Verification cannot run or cannot prove the final state.
6. GitHub Actions passes but live Railway MCP behavior differs from local behavior.

Deliverables:
- Updated implementation files needed for Option B, if approved.
- Updated tests or golden eval fixtures.
- Updated GitHub Actions workflow, if approved.
- Updated `docs/SPEC_IMPROVEMENTS.md` or follow-up notes resolving open questions.
- Security monitoring status note.
- Final evidence report with local command results and remaining risks.

