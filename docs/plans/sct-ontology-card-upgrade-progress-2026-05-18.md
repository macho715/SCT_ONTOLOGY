# SCT_ONTOLOGY Card Upgrade Progress Report

- 작성일: 2026-05-18 00:15:14 +04:00
- 세션 기준: 현재 Windows Codex 세션
- 작업 위치: `C:\Users\jichu\Downloads\HVDC Ontology Grounded`
- 기준 사양: `SCT_ONTOLOGY_CARD_UPGRADE_SPEC_v1.0.md`
- 현재 판정: PARTIAL

## 1. 요약

이번 작업은 `SCT_ONTOLOGY CARD`를 단순 evidence drawer에서 운영 의사결정 카드로 올리는 사양 중 P0와 일부 P1/P2 항목을 구현한 상태다.

완료된 핵심 범위는 다음과 같다.

- 시스템 점검 요청을 이메일 답장 또는 비용 승인으로 오분류하지 않도록 IntentRouter를 보강했다.
- RulePack Binder에 intent, domain, action 기반 rulepack 선택 구조를 추가했다.
- DecisionCard v2에 `intent`, `schemaVersion`, `allowedNow`, `blockedUntilApproved`, `humanGateState`, `rulePackIds`를 연결했다.
- EvidenceRanker v2의 `EvidenceScore`를 도입했다.
- ActionPlanner v2에 `requiredInput` 추출과 `dueBasis` 표시를 추가했다.
- Renderer에 `Decision`, `Evidence`, `Validation`, `Entities`, `Actions`, `Trace` 탭 구조를 추가했다.
- 관련 unit test와 contract test를 추가 또는 갱신했다.

아직 전체 Definition of Done은 끝나지 않았다.
React/Next.js 성능 audit, Playwright E2E, axe a11y smoke, report bundle 자동 생성, PII/NDA ZERO gate 자동화는 남아 있다.

## 2. 변경 파일

주요 변경 파일은 다음과 같다.

- `server/src/router.ts`: intent 분류, hard-negative, rulepack registry, action allow/block matrix를 추가했다.
- `server/src/answer.ts`: system diagnostic 응답 분기와 `SYS-ROUTER-001` validation finding을 추가했다.
- `server/src/corpus.ts`: EvidenceRanker v2 scoring과 requiredDoc 보존 로직을 추가했다.
- `server/src/decision-card.ts`: DecisionCard v2 필드, HumanGate state, `directSupportRatio`, `dueBasis`를 추가했다.
- `server/src/types.ts`: `IntentCode`, `EvidenceScore`, `HumanGateState` 관련 타입을 확장했다.
- `server/src/hvdc-server.ts`: ChatGPT Apps output schema를 DecisionCard v2와 EvidenceScore에 맞췄다.
- `server/src/claude-server.ts`: Claude MCP output schema를 같은 계약으로 맞췄다.
- `public/hvdc-answer-widget.html`: DecisionCard 탭 UI, HumanGate, EvidenceCoverage, ActionTable, Trace 표시를 보강했다.
- `server/src/generated/widget-html.ts`: 위젯 HTML 생성 산출물을 갱신했다.
- `schemas/sct-answer-contract.schema.json`: 외부 contract schema에 DecisionCard v2, EvidenceScore, directSupportRatio, dueBasis를 반영했다.
- `tests/intent-router.test.ts`: P0 intent hard-negative 회귀 테스트를 추가했다.
- `tests/evidence-ranker.test.ts`: P1 EvidenceRanker 회귀 테스트를 추가했다.
- `tests/decision-card.test.ts`: DecisionCard consistency, HumanGate, coverage, action 필드 테스트를 갱신했다.
- `tests/widget.test.ts`: 탭 UI와 card field 렌더링 테스트를 갱신했다.
- `tests/sct-operating-contract.test.ts`: contract schema 필수 필드 테스트를 갱신했다.
- `tests/claude-descriptor.test.ts`, `tests/pipeline.test.ts`: 확장된 route/card 계약에 맞게 fixture를 갱신했다.

## 3. Prompt-to-artifact checklist

| Spec requirement | Current status | Evidence artifact | Verification |
| --- | --- | --- | --- |
| P0 IntentRouter: `SYSTEM_DIAGNOSTIC`, `ONTOLOGY_PATCH_REVIEW`, `CARD_RENDERING_AUDIT` | DONE | `server/src/router.ts`, `tests/intent-router.test.ts` | 시스템 점검 프롬프트 30개가 `EMAIL_DRAFT`로 가지 않는 테스트 통과 |
| P0 hard-negative: 점검/패치/CARD/router/validation/evidence/schema는 email/cost/send 금지 | DONE | `server/src/router.ts` | `tests/intent-router.test.ts` 통과 |
| P0 RulePack Binder: intent x domain x action matrix | DONE | `RULEPACK_REGISTRY`, `resolveRulePackIds` | system intent에서 `COMM_RULEPACK`, `COST_RULEPACK` 제외 테스트 통과 |
| P0 DecisionCard consistency | DONE | `server/src/decision-card.ts` | BLOCK card의 `blockedBy`, `primaryReason`, `blockedActions` 테스트 통과 |
| P0 HumanGate state machine | PARTIAL | `deriveHumanGateState`, widget HumanGate 표시 | state field와 pending/approved 표시 검증 완료. 실제 write/send/publish 실행 레벨 차단은 별도 작업 필요 |
| P0 6 regression scenarios | DONE | `tests/intent-router.test.ts`, `tests/evals.test.ts` | focused tests와 golden eval 통과 |
| P1 EvidenceRanker score | PARTIAL | `EvidenceScore`, `tests/evidence-ranker.test.ts` | directSupport top-3 threshold 테스트 통과. 전체 도메인 평가셋 80.00% 리포트는 아직 없음 |
| P1 ValidationEngine rulepack 분리와 coverage KPI | PARTIAL | 기존 validation + `SYS-ROUTER-001` | rulepack 분리는 일부 반영. missing input 검출률 90.00% KPI 리포트는 아직 없음 |
| P1 ActionPlanner v2 | PARTIAL | `ActionItem.requiredInput`, `dueBasis`, `blockedUntilApproved` | card action table 테스트 통과. owner workflow SLA나 due rule registry는 아직 없음 |
| P1 EntityResolver stopword/system component classification | NOT DONE | 없음 | 일반어 entity 승격률 1.00% 이하 측정 없음 |
| P2 Renderer tabs | PARTIAL | `public/hvdc-answer-widget.html` | `Decision/Evidence/Validation/Entities/Actions/Trace` 탭 HTML/JS와 widget test 통과. 실제 브라우저 수동 검증은 아직 없음 |
| P2 React/Next.js performance audit | NOT DONE | 없음 | 이 repo는 현재 Next.js frontend가 아니며 Lighthouse/Playwright/a11y smoke 미실행 |
| P2 Traceability bundle 자동 생성 | NOT DONE | 없음 | `npm run report:sct-card` 스크립트 없음 |
| P3 Multi-entity GraphPath/riskEdges | NOT DONE | 없음 | 기존 단일 graphPath 유지 |
| P3 PII/NDA scanner와 ZERO gate 자동화 | NOT DONE | 없음 | PII mask는 기존 동작 유지. P2 원문/단가/실명 ZERO 자동 gate는 미완료 |

## 4. 검증 기록

현재 세션에서 실행한 검증은 다음과 같다.

| Command | Result | Meaning |
| --- | --- | --- |
| `npm run typecheck` | PASS | 생성 산출물 갱신 후 TypeScript compile check 통과 |
| `npx vitest run tests/intent-router.test.ts tests/decision-card.test.ts tests/widget.test.ts tests/sct-operating-contract.test.ts tests/decision-card-attach.test.ts` | PASS | P0 router/card/widget/contract focused regression 통과 |
| `npx vitest run tests/widget.test.ts tests/sct-operating-contract.test.ts tests/decision-card.test.ts tests/evidence-ranker.test.ts` | PASS, 11 matched test files / 166 tests | Renderer tab 추가 후 focused verification 통과 |
| `npm test` | PASS, 21 test files / 282 tests | Renderer tab 변경 후 전체 unit suite 최종 회귀 통과 |
| `npm run worker:dry-run` | PASS, Total Upload 3733.10 KiB / gzip 693.93 KiB | Renderer tab 변경 후 Cloudflare Worker dry-run bundle 검증 통과 |

주의:

- `npm test`와 `worker:dry-run`은 sandbox 권한 문제 때문에 승인된 elevated 실행으로 검증했다.
- Renderer tab 추가 후 전체 `npm test`와 `worker:dry-run`을 다시 실행했고 둘 다 통과했다.

## 5. 현재 남은 위험

남은 실제 위험은 다음과 같다.

- P1/P2/P3 요구사항이 모두 끝난 것은 아니다.
- 현재 widget tab은 HTML/JS unit 수준에서 검증했다. 실제 ChatGPT iframe 또는 브라우저 수동 조작 검증은 아직 없다.
- React/Next.js 관련 요구사항은 이 저장소 구조와 직접 맞지 않는다. 별도 frontend가 생기면 별도 audit가 필요하다.
- validation coverage 90.00%, direct evidence 80.00%는 일부 canonical query 테스트만 있다. 전체 평가 리포트는 아직 없다.
- report bundle, E2E, a11y, ZERO gate 자동화는 아직 구현하지 않았다.

## 6. 다음 작업 1개

실제 ChatGPT iframe 또는 브라우저 수동 조작으로 Renderer tab UX를 확인한다.
