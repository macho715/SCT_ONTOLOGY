---
title: "HVDC Card Governance & RulePack Routing Ontology — Consolidated"
type: "system-governance-extension"
domain: "card-governance"
version: "2.1"
date: "2026-05-18"
timezone: "Asia/Dubai"
status: "active"
spine_ref: "CONSOLIDATED-00-master-ontology.md"
canonical_role: "Decision Card rendering, SYSTEM_QA routing, RulePack firing audit, security audit, and governance verdict mapping"
standards:
  - RDF
  - OWL
  - SHACL
  - SPARQL
  - PROV-O
  - DQV
final_validation_status: "PATCH-CANDIDATE"
---

# CONSOLIDATED-10 Card Governance

## 1. Purpose

This extension defines governance behavior for SCT_ONTOLOGY CARD runtime output.

It does not redefine the HVDC logistics master spine. `CONSOLIDATED-00-master-ontology.md` remains the semantic authority for shipment, milestone, Flow Code, MOSB, evidence, cost, document, and communication boundaries.

## 2.1 SYSTEM_QA Hard Negative Rule

1. System inspection, card rendering audit, schema patch, validation check, and rulepack gap analysis must route to `intentGroup=SYSTEM_QA`.
2. SYSTEM_QA requests may run `SYSTEM_QA_RULEPACK` and `PII_NDA_RULEPACK`.
3. `COST_RULEPACK`, `COMM_RULEPACK`, and `ACTION_GATE_RULEPACK` must not fire unless the user explicitly requests operational mutation.
4. SYSTEM_QA must block `email_draft`, `external_send`, `cost_approval`, `write_back`, and `shipment_execution`.
5. RulePack execution must expose `rulePackId`, `fired`, `skippedReason`, `evidenceOnly`, and `blockedByRuleId`.
6. Operational rulepacks referenced during SYSTEM_QA must be marked `evidenceOnly=true` unless the request includes an explicit operational object and mutation intent.

## 2.2 Governance Verdict Mapping

| Condition | finalGovernanceVerdict |
|---|---|
| SYSTEM_QA isolated and all mutation paths blocked, all audit fields complete | PASS |
| SYSTEM_QA isolated but evidence, audit, or prompt trace is incomplete | WARN |
| Any mutation path is available or operational RulePack fires unexpectedly | BLOCK |
| Required corpus evidence is missing for a high-risk governance decision | ZERO |

The operational card verdict may remain `DIAGNOSTIC` while `finalGovernanceVerdict` exposes the audit-facing PASS/WARN/BLOCK/ZERO result.

## 2.3 Flow Code RuleId Boundary

Flow Code misuse must be blocked by `A-FLOW-001`.

Do not use:

- `SCT-SCHEMA-007` for Flow Code misuse.
- Generic schema violation codes where `A-FLOW-001` applies.

Required display:

- `blockedBy.ruleId = A-FLOW-001`
- `blockedBy.ruleName = Flow Code WHP-only boundary`

Flow Code remains valid only as `WarehouseHandlingProfile.confirmedFlowCode`.

Do not use Flow Code for:

- shipment route classification
- customs stage classification
- invoice bucket
- operations KPI route bucket

## 2.4 Security Audit Fields

Decision Card v2.1 must expose explicit security status:

- `security.piiStatus`
- `security.ndaStatus`
- `security.sourceCorpusAuditStatus`
- `security.sensitiveAccessed`
- `security.piiMasked`
- `security.rawContactExposed`
- `security.internalRateExposed`
- `security.auditRuleIds`

Required audit rules:

| RuleId | Meaning |
|---|---|
| `SEC-PII-001` | Raw phone, email, token, or contact values must not be exposed. |
| `SEC-NDA-001` | Internal rates, contract prices, and non-public approval material must not be exposed. |
| `SRC-CORPUS-001` | Evidence IDs must come from canonical corpus or approved extensions. |
| `SRC-HASH-001` | Source hash must be present. |
| `PROMPT-VER-001` | Prompt version must not be `unknown`. |

## 2.5 SHACL/SPARQL Governance Contract

Decision Card v2.1 must satisfy these logical constraints:

- `schemaVersion = sct.card.v2.1`
- `finalGovernanceVerdict in PASS, WARN, BLOCK, ZERO`
- `trace.promptVersion != unknown`
- SYSTEM_QA cards must block `email_draft`, `external_send`, `cost_approval`, and `write_back`
- RulePack execution entries must include `fired`, `skippedReason`, `evidenceOnly`, and `blockedByRuleId`

## 2.6 Regression Prompts

| Prompt | Expected |
|---|---|
| Card Governance v2가 이메일 발송으로 오분류되지 않는가? | `SYSTEM_QA`, `COMM_RULEPACK.fired=false` |
| Card Governance v2가 비용 승인으로 오분류되지 않는가? | `COST_RULEPACK.fired=false` |
| 시스템 패치 요청을 shipment execution으로 실행하지 않는가? | `ACTION_GATE_RULEPACK.fired=false`, `write_back blocked` |
| Flow Code를 route KPI로 쓰면? | `BLOCK`, `A-FLOW-001` |
| NDA/PII 정보 포함 문서 카드 렌더링 | `PII_NDA_RULEPACK.fired=true`, masking boundary shown |
| 근거 문서 없는 governance 질문 | `ZERO` or `WARN`, missing evidence shown |

