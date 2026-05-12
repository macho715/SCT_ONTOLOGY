# Phase 1: Corpus-First Rule Adapter Contract - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-11
**Phase:** 1-Corpus-First Rule Adapter Contract
**Areas discussed:** Adapter position, Rule result shape, Not-found and unavailable handling, Identifier extraction

---

## Adapter Position

| Option | Description | Selected |
|--------|-------------|----------|
| Corpus search 후, validateGrounding 전 | Corpus evidence를 먼저 확보하고, rule adapter 결과를 validation 입력으로 넣기 좋습니다. | ✓ |
| validateGrounding 후, composeSummary 전 | 기존 validation은 건드리지 않고 summary에만 rule 신호를 섞기 쉽습니다. | |
| composeSummary 후, answer object 조립 직전 | 가장 덜 침습적이지만 validation과 evidence trace 연결이 약합니다. | |

**User's choice:** Option 1
**Notes:** Adapter runs after corpus search and before `validateGrounding()`.

---

## Rule Result Shape

| Option | Description | Selected |
|--------|-------------|----------|
| `shipmentRule` 단일 객체 | `found`, `source`, `supportLevel`, `status`, `matchedKey`, `shipmentId`, `risks`, `humanGateRequired`를 담습니다. | ✓ |
| `validation[]`에만 병합 | 기존 `ValidationFinding`만 늘려서 단순하지만, 원본 rule result를 잃습니다. | |
| `evidence[]`에 sample evidence로 추가 | 구조는 쉬워 보이지만 sample rule을 corpus evidence처럼 오해할 위험이 큽니다. | |

**User's choice:** Option 1
**Notes:** Use a named object and do not disguise sample rule output as corpus evidence.

---

## Not-Found And Unavailable Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Not-found는 INFO, unavailable은 WARN | Corpus answer는 유지하고, rule adapter 상태만 표시합니다. | ✓ |
| 둘 다 WARN | 보수적이지만 sample data가 없는 정상 질문도 경고가 많아질 수 있습니다. | |
| unavailable은 BLOCK | 안전하지만 adapter 장애가 ontology 답변 전체를 막을 수 있습니다. | |

**User's choice:** Option 1
**Notes:** Not-found should not change corpus verdict by itself. Unavailable is a warning, not a hard block for normal ontology answers.

---

## Identifier Extraction

| Option | Description | Selected |
|--------|-------------|----------|
| question text + resolvedEntities 둘 다 사용 | 기존 `resolveAnyKey()` 결과를 재사용하고, Python sample key 패턴도 놓치지 않습니다. | ✓ |
| question text만 사용 | 단순하지만 상위 router가 이미 찾아낸 entity를 버립니다. | |
| resolvedEntities만 사용 | 기존 pipeline과 일관되지만 Python sample key 패턴이 router에 없으면 놓칠 수 있습니다. | |

**User's choice:** Option 1
**Notes:** Use both parent pipeline entities and raw text scanning for sample shipment keys.

---

## the agent's Discretion

- Exact enum literal names and type names are left to the planner.
- Exact implementation mechanism is left to planning, provided the Phase 1 contract remains stable and testable.

## Deferred Ideas

- Phase 2: full validation signal merge.
- Phase 3: contract and regression gates.
- Phase 4: documentation and handoff.
- v2: production evidence ingestion.
