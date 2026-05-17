# SCT_ONTOLOGY CARD 업그레이드 상세 사양서 v1.0

- 기준일: 2026-05-17 | TZ: Asia/Dubai

- 대상: SCT_ONTOLOGY CARD / HVDC ontology response system / React·Next.js frontend / validation & traceability pipeline

- 목적: 현재 카드를 단순 evidence drawer에서 운영 의사결정 카드로 승격

- 보안등급: P1 문서. P2 원문·단가·실명·내부 링크 미포함.


---

## 1. Executive Summary

| 판정 | 조건부 Go - P0 패치 선행 필요 |
| --- | --- |
| 핵심 결함 | 시스템 점검 요청을 이메일 답장 intent로 오분류, DecisionCard verdict와 primaryReason 불일치, validation/action이 운영 판단에 부족 |
| 우선순위 | IntentRouter → RulePack Binding → Severity Matrix → DecisionCard Consistency → HumanGate/ActionPlanner → EvidenceRanker/Renderer |
| 권장 산출물 | router test suite, rulepack registry, card schema v2, UI tabs, CI evidence bundle, rollback plan |

## 2. 확인한 근거와 반영 방향

| Source | 확인 내용 | SCT_ONTOLOGY 반영점 |
| --- | --- | --- |
| PROJECT_UIUX_FULL_GUIDE_v2026 | Guide↔Materials 보안 분리, Responses/Conversations/Prompts/Items, 승인형 툴 실행, WCAG 2.2 AA, Stage 0-9, Traceability, ZERO 조건 | 카드의 dataClass, sourceHash, approvalTrace, validationReport, ZERO gate를 필수 필드로 승격 |
| Vercel Agent Skills Playbook | React/Next.js 성능 우선순위: waterfall 제거, bundle size 감소, Audit→Plan→Fix→Validate→Prevent 워크플로우, 스킬 구조 | SCT frontend와 coding-agent 운영에 react-best-practices audit를 CI로 연결 |
| OpenAI Assistants Migration | Assistants → Prompts, Threads → Conversations, Runs → Responses, Run steps → Items. Assistants API shutdown 2026-08-26 | Prompt ID 버전관리, response item trace, conversation state 분리 |
| Vercel AI SDK 6 | Agent abstraction, ToolLoopAgent, tool execution approval, structured output, tool input strictness | SCT action은 needsApproval/humanGate 기반, tool loop step/time 제한 |
| W3C WCAG 2.2 | Focus Not Obscured, Dragging Movements, Target Size, Consistent Help, Redundant Entry, Accessible Authentication | 카드/approval modal/validation drawer에 A11y DoD 적용 |

## 3. 현재 SCT_ONTOLOGY CARD 진단 결과

| No | 발견 결함 | 증상 | 영향 | 패치 방향 |
| --- | --- | --- | --- | --- |
| 1 | Intent 오분류 | SYSTEM_DIAGNOSTIC 요청을 EMAIL_DRAFT로 처리 | 카드 목적과 액션이 왜곡 | SYSTEM_DIAGNOSTIC / PATCH_REVIEW intent와 hard-negative rule 추가 |
| 2 | RulePack 과잉 발화 | cost/communication keyword만으로 BLOCK/WARN 발생 | 불필요한 P0/P1 차단 | intent-domain-action 3중 조건 충족 시에만 고위험 rule 발화 |
| 3 | DecisionCard 불일치 | verdict=BLOCK이나 primaryReason='No blocking finding' | 운영 신뢰도 하락 | verdict/reason/blockedBy/allowedActions consistency validator 추가 |
| 4 | Evidence directness 부족 | Architecture evidence가 상위 노출 | 작업자가 실제 근거를 찾기 어려움 | directSupport, domainSpecificity, operationalActionability score 도입 |
| 5 | Validation coverage 부족 | 실제 missing input과 위험이 validation에 안 뜸 | AMBER/ZERO gate 약화 | domain-specific validation registry와 coverage KPI 추가 |
| 6 | Action 구체성 부족 | REVIEW_EVIDENCE_DRAWER 등 일반 액션 반복 | 다음 실행이 불명확 | ownerRole, requiredInput, allowedNow, blockedUntilApproved 포함 |
| 7 | Entity noise | document, ontology, logistics 같은 일반어가 객체로 승격 | graph/path 오염 | stopword guard와 SystemComponent type 추가 |
| 8 | GraphPath 단일화 | 복수 TR/BL/invoice 관계 표현 부족 | 충돌/의존 리스크 감지 어려움 | multi-startNode, riskEdges, blockerEdges 추가 |

## 4. 업그레이드 우선순위

| Priority | Module | Upgrade | Acceptance Criteria |
| --- | --- | --- | --- |
| P0 | IntentRouter | SYSTEM_DIAGNOSTIC, ONTOLOGY_PATCH_REVIEW, CARD_RENDERING_AUDIT intent 추가 | 시스템 점검 프롬프트 30개 중 EMAIL_DRAFT 오분류 0건 |
| P0 | RulePack Binder | intent × domain × actionType 매트릭스 기반 rule 발화 | meta/system 질문에서 COST/EMAIL write rule 과잉 BLOCK 0건 |
| P0 | DecisionCard Consistency | verdict, severity, primaryReason, blockedBy, allowedActions 동기화 | BLOCK인데 blockedBy 없음 또는 No blocking finding 문구 발생 0건 |
| P0 | HumanGate | READ_ONLY → DRY_RUN → APPROVAL → WRITE/SEND/PUBLISH 상태머신 | P1/P2/write/send/export action은 승인 전 실행 0건 |
| P1 | EvidenceRanker | directSupport 중심 scoring | 상위 3개 evidence 중 직접 근거 비율 80.00% 이상 |
| P1 | ValidationEngine | marine/customs/cost/document/communication/system rulepack 분리 | 핵심 missing input 검출률 90.00% 이상 |
| P1 | ActionPlanner | 실행 가능 액션 생성 | 각 카드에 ownerRole, requiredInput, dueBasis, blockedUntilApproved 표시 |
| P1 | EntityResolver | stopword와 system component classification | 일반어 entity 승격률 1.00% 이하 |
| P2 | Renderer | Decision/Evidence/Validation/Entities/Actions/Trace 탭 | 작업자가 10초 이내 verdict·blockedBy·nextAction 확인 |
| P2 | React/Next.js | waterfall/bundle/a11y CI audit | Lighthouse/Playwright/a11y smoke 회귀 0건 |

## 5. Intent Router 패치

| Intent | Trigger | Required Domains | Allowed Actions | Blocked Actions |
| --- | --- | --- | --- | --- |
| SYSTEM_DIAGNOSTIC | 점검, 패치, CARD, router, validation, evidence, schema | system, master | read, diagnostic report, test scenario | email draft, external send, cost approval |
| ONTOLOGY_PATCH_REVIEW | 업그레이드, 개선, rulepack, schema, governance | system, master | patch spec, backlog, acceptance criteria | write-back without approval |
| LOGISTICS_DECISION | ETA, berth, tide, WH, customs, HS, DEM/DET | marine/customs/warehouse/cost as needed | dry-run, risk memo, input request | final authority decision without evidence |
| EMAIL_DRAFT | 답장, 이메일 초안, 수신자, thread | communication | draft only | send without approval |
| COST_GUARD | invoice, rate, AED, DEM/DET, 과청구 | cost, document | audit, variance report | invoice approval without RateRef/TariffRef |
| DOCUMENT_GUARDIAN | CI/PL/BL/BOE/DO/OCR/첨부 | document, customs | extract, compare, missing field list | customs submission without approval |

### 5.1 Hard-negative rules

- '점검/패치/CARD/router/validation/evidence/schema'가 포함되면 EMAIL_DRAFT, COST_APPROVAL, EXTERNAL_SEND로 분류 금지.

- '초안/답장/수신자/이메일 thread'가 명시된 경우에만 EMAIL_DRAFT 후보로 승격.

- 'invoice/rate/AED/DEM/DET'만으로 COST_APPROVAL 금지. approval/accept/pay/release 등 action verb가 함께 있어야 함.

## 6. Severity Matrix

| Verdict | 사용 조건 | UI 상태 | 자동 허용 | 금지 |
| --- | --- | --- | --- | --- |
| PASS | 근거·검증·필수입력 충족 | 녹색/완료 | read, internal use | 없음 |
| PASS_WITH_FINDINGS | 작은 개선점 있음, 운영 차단 아님 | 녹색+Finding badge | read, draft | write는 정책별 |
| AMBER | 근거 일부 부족 또는 simulation/추정 포함 | 노란색/주의 | dry-run, internal memo | external confirmation |
| NEEDS_INPUT | 필수 입력 누락 | 노란색/Input panel | input request | final decision |
| PENDING_APPROVAL | 발송/수정/승인 대기 | 승인 modal | preview | execution |
| DRY_RUN_ONLY | 검증 전 분석만 허용 | 회색/샌드박스 | simulation | write-back/send |
| BLOCK | 룰 위반 또는 승인 없는 side-effect | 빨간색/차단 | read only | approval/write/publish |
| ZERO | P2 노출, 법규/HS/안전 등 고위험 근거 부재 | 검정/중단 | 중단표 출력 | 모든 산출 확정 |

## 7. Validation RulePack 구성

| RulePack | 주요 대상 | 대표 룰 | Severity 예시 |
| --- | --- | --- | --- |
| SYSTEM_QA_RULEPACK | router/card/schema/evidence trace | SYS-ROUTER-001: system diagnostic must not map to email draft | P0 FAIL |
| IDENTITY_RULEPACK | TR/BL/BOE/PO/package/container | V-IDENT-001: scheme/value/normalized/source required | BLOCK |
| MARINE_RULEPACK | Mina Zayed, MOSB, berth, tide, OOG | V-MARINE-UKC-001: draft/UKC/min tide missing | AMBER/BLOCK |
| CUSTOMS_RULEPACK | HS, BOE, COO, permit | V-HS-AUTH-001: authority source required | ZERO/BLOCK |
| COST_RULEPACK | invoice, rate, DEM/DET, DO, port charge | V-COST-RATE-001: RateRef/TariffRef missing | BLOCK |
| DOCUMENT_RULEPACK | CI/PL/BL/BOE/DO/OCR | V-DOC-XMATCH-001: cross-document mismatch | AMBER/BLOCK |
| WAREHOUSE_RULEPACK | WH, site receipt, dispatch | V-WH-CAP-001: capacity and flow status missing | AMBER |
| COMM_RULEPACK | email/chat/approval/evidence | V-COMM-SEND-001: external send requires approval | PENDING_APPROVAL |
| PII_NDA_RULEPACK | P2, contacts, rates, contracts | V-P2-PROMPT-001: P2 in prompt/output | ZERO |

## 8. Frontend/React/Next.js 패치

| 영역 | 패치 항목 | 검증 |
| --- | --- | --- |
| Waterfall | Card page initial load에서 independent async를 parallelize; evidence/validation/entities/actions fetch는 dependency가 없으면 Promise.all | network waterfall trace, p95 card ready time |
| Bundle | Evidence drawer, graph viewer, JSON inspector는 dynamic import; heavy chart/graph library는 interaction 전 preload만 | bundle analyzer, initial JS budget |
| Server | card summary와 high-priority validation은 server-side에서 precompute/cache; raw evidence drawer는 lazy stream | TTFB, cache hit ratio |
| Client fetching | SWR/TanStack dedupe; refetch interval은 card status별 차등 | duplicate request 0건 |
| Re-render | tab state, drawer state, approval modal state 분리; memoization은 measured hotspot에만 | React profiler |
| A11y | keyboard tab order, focus trap, visible focus, target size, drag alternative, status messages | axe/playwright + manual keyboard pass |

## 9. 핵심 JSON Schema 초안

### DecisionCardV2
```json
{
  "schemaVersion": "sct.card.v2",
  "intent": "SYSTEM_DIAGNOSTIC | LOGISTICS_DECISION | EMAIL_DRAFT | COST_GUARD | DOCUMENT_GUARDIAN",
  "verdict": "PASS | PASS_WITH_FINDINGS | AMBER | NEEDS_INPUT | PENDING_APPROVAL | DRY_RUN_ONLY | BLOCK | ZERO",
  "severity": "P0 | P1 | P2 | INFO",
  "primaryReason": "string",
  "blockedBy": [{"ruleId": "string", "missingInputs": ["string"], "evidenceIds": ["string"]}],
  "allowedNow": ["read", "dry_run", "internal_draft"],
  "blockedUntilApproved": ["write_back", "external_send", "publish", "invoice_approval"],
  "nextAction": {"actionType": "string", "ownerRole": "string", "requiredInput": ["string"], "humanGateRequired": true},
  "evidenceCoverage": [{"domain": "string", "required": 1, "available": 0, "directSupportRatio": 0.0}],
  "trace": {"routeId": "string", "promptVersion": "string", "rulePackVersion": "string", "sourceHash": "sha256:..."}
}
```

### EvidenceScore
```json
{
  "evidenceId": "CONSOLIDATED-04-barge-bulk-cargo#42",
  "intentRelevance": 0.00,
  "domainSpecificity": 0.00,
  "directSupport": 0.00,
  "authorityLevel": 0.00,
  "operationalActionability": 0.00,
  "recency": 0.00,
  "finalScore": 0.00,
  "supportState": "SUPPORTED | PARTIAL | NO_DIRECT_EVIDENCE | CONTRADICTED"
}
```

### HumanGateStateMachine
```json
READ_ONLY -> DRY_RUN -> APPROVAL_REQUESTED -> APPROVED_ACTION -> EXECUTED -> AUDITED
                       -> DENIED -> CANCELLED
                       -> EXPIRED -> NEEDS_REVIEW
```

## 10. CI / Traceability Pipeline

| Stage | Command | Pass Criteria |
| --- | --- | --- |
| lint/typecheck | npm run lint && npm run typecheck | type error 0건 |
| unit | npm run test:unit -- card router validation | router/rulepack/schema unit pass |
| build | npm run build | production build pass, bundle budget pass |
| E2E smoke | npm run test:e2e -- sct-card | SYSTEM_DIAGNOSTIC, COST_GUARD, EMAIL_DRAFT, MARINE_DECISION scenarios pass |
| a11y smoke | npm run test:a11y -- sct-card | WCAG 2.2 AA blocker 0건 |
| report bundle | npm run report:sct-card | decision-log, simulation-log, validation-report, changelog 생성 |

## 11. QA 시나리오

| Scenario | Input | Expected Verdict | Must Not Happen |
| --- | --- | --- | --- |
| System diagnostic | SCT_ONTOLOGY CARD 전반 점검/패치 | PASS_WITH_FINDINGS 또는 AMBER | EMAIL_DRAFT intent |
| Email draft | 이 메일에 답장 초안 작성 | DRAFT_READY/PENDING_APPROVAL | 외부 발송 자동 실행 |
| Cost guard dry-run | invoice 과청구 검토 | DRY_RUN_ONLY/NEEDS_INPUT | RateRef 없이 approval |
| Marine loadout | tide simulation 기반 berth 판단 | AMBER/NEEDS_INPUT | UKC 없이 PASS |
| P2 leakage | 계약 단가/실명 포함 | ZERO | 문서 원문 노출 |
| Document OCR | CI/PL/BL 비교 | PASS_WITH_FINDINGS/AMBER | low OCR confidence 숨김 |

## 12. Implementation Roadmap

### Phase 0: 1-2일
- IntentRouter hard-negative rule 추가
- DecisionCard consistency validator 추가
- SYSTEM_QA_RULEPACK 최소 구현
- 6개 회귀 시나리오 unit test 작성


### Phase 1: 3-7일
- EvidenceRanker score 도입
- RulePack Binder와 validation coverage KPI 도입
- ActionPlanner v2와 HumanGate state machine 연결
- Card Renderer 탭 구조 적용


### Phase 2: 2주
- React/Next.js 성능 audit, dynamic import, request dedupe
- Playwright E2E + axe a11y smoke
- Traceability bundle 자동 생성


### Phase 3: 3-4주
- Multi-entity GraphPath/riskEdges
- PII/NDA scanner와 ZERO gate 자동화
- 운영 dashboard와 report bundle 배포


## 13. Definition of Done

- SYSTEM_DIAGNOSTIC 오분류 0건.
- BLOCK 카드의 blockedBy/primaryReason/blockedActions 불일치 0건.
- 상위 evidence 3개 중 직접 근거 80.00% 이상.
- P1/P2 또는 write/send/publish action은 approval 없이 실행 0건.
- WCAG 2.2 AA blocker 0건.
- CI에서 lint/typecheck/test/build/E2E/a11y/report-bundle 통과.


## 14. Source References

- PROJECT_UIUX_FULL_GUIDE_v2026.md: Guide/Materials 분리, Responses/Conversations/Prompts/Items, 승인형 툴 실행, WCAG 2.2, Stage 0-9, ZERO gate.

- vercel-react-best-practices-skill-playbook.md: Agent Skills, React/Next.js 성능 우선순위, Audit→Plan→Fix→Validate→Prevent.

- OpenAI Assistants migration guide, checked 2026-05-17.

- Vercel AI SDK 6 blog, checked 2026-05-17.

- W3C WCAG 2.2 Recommendation, checked 2026-05-17.

- vercel-labs/agent-skills GitHub repository, checked 2026-05-17.
