
# sct_ontology MCP 운영 업데이트 상세안 v1.0

**작성일:** 2026-05-11  
**Owner:** MR.CHA / HVDC Logistics  
**Status:** 운영 적용안 v1.0, official source URL 최신성은 배포 전 Source Validation Gate에서 확인

## Executive Summary

`sct_ontology`는 HVDC 프로젝트 물류 업무를 위한 팀 표준 LLM 운영 계층이다. 제1 목적은 hallucination 감소, 제2 목적은 MR.CHA 도메인 지식 주입, 제3 목적은 MR.CHA와 팀원들이 같은 업무 환경에서 동일한 기준으로 LLM을 사용하게 하는 것이다.

## 확정 사항

1. 명칭은 `sct_ontology`로 고정한다.
2. MCP는 기본 업무 맥락 레이어로 동작한다.
3. 사용자가 일반 답변을 명시하지 않는 한 모든 질문은 HVDC logistics 업무 맥락으로 해석한다.
4. 답변은 Answer Contract를 따른다.
5. 고위험 업무 판단은 AMBER/ZERO gate를 통과해야 한다.
6. 팀 표준화를 위해 GitHub식 repo governance, CODEOWNERS, PR review, GitHub Actions, Golden Q&A eval을 적용한다.

## Mission Statement

`sct_ontology`는 ChatGPT 및 대형 LLM 사용 시 hallucination을 줄이고, MR.CHA의 HVDC 물류 도메인 지식·용어·workflow·evidence rule·decision gate를 LLM에 주입하며, 팀원들이 같은 업무 환경에서 항상 같은 기준·용어·증빙 요구·위험 판단으로 답변을 받게 하기 위한 팀 표준 LLM 운영 계층이다.

## P1 업데이트

| Priority | 파일 | 목적 |
|---|---|---|
| P1 | `/core/mission-statement.md` | 목적 고정 |
| P1 | `/core/mcp-default-context-policy.md` | 모든 질문을 업무 맥락으로 해석 |
| P1 | `/schemas/sct-answer-contract.schema.json` | 답변 구조 고정 |
| P1 | `/rules/sct-evidence-matrix.md` | 질문 유형별 필수 evidence 고정 |
| P1 | `/rules/sct-amber-zero-rulebook.md` | 고위험 추정 답변 차단 |
| P1 | `/evals/sct-golden-qa.csv` | 팀 답변 일관성 검증 |

## MCP 처리 순서

```text
User question
→ classify intent and risk domain
→ retrieve sct_ontology context from MCP
→ resolveAnyKey if logistics identifier exists
→ retrieve evidence
→ check evidence matrix
→ apply AMBER/ZERO gate
→ generate structured answer
→ write audit log
```

## Evidence Matrix 핵심

| Domain | Required Evidence | Missing Gate |
|---|---|---|
| Customs | CI/PL, HS, COO, BOE, permit | ZERO |
| Cost | InvoiceLine, RateRef, TariffRef, BOE/DO/Port evidence | ZERO |
| DEM/DET | discharge, free time, gate-out, empty return | ZERO/AMBER |
| ETA | carrier/forwarder update, milestone timestamp | AMBER |
| Warehouse | WH in/out, MRR, GRN, capacity | AMBER |
| OOG/Safety | dims/wt/COG, lift plan, lashing, permit | ZERO |
| Claim | POD, MRR, photo, survey, BL clause | ZERO |

## GitHub Governance

- main branch direct push 금지
- PR 필수
- CODEOWNERS approval 필수
- schema validation PASS 필수
- Golden Q&A regression PASS 필수
- high-risk rule 변경은 MR.CHA approval 필수

## Acceptance Criteria

- Answer Contract 준수율 100.00%
- Golden Q&A verdict match ≥ 95.00%
- High-risk ZERO recall 100.00%
- Hallucination incident 0.00건
- Audit log coverage 100.00%
