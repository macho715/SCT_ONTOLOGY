# CHANGELOG

이 문서는 현재 저장소 상태와 확인된 Git 이력을 기준으로 작성한다.

## Release / Verification State

```mermaid
flowchart TD
  A["Initial app upload<br/>Commit 48d606d"] --> B["Plan/spec goal commit<br/>Commit 0c629f7"]
  B --> C["Unreleased Option B local implementation<br/>현재 로컬 미커밋 / 미푸시 상태"]
  C --> D["Next action<br/>commit"]
  D --> E["Next action<br/>push"]
  E --> F["Next action<br/>GitHub Actions 확인"]
```

## Unreleased - Option B local implementation

현재 작업 트리에만 있는 로컬 구현이다.
아직 push 또는 GitHub Actions 통과로 확인하지 않았다.

### Added

- 평가용 golden prompt를 11개로 확장했다.
- Apps SDK/MCP tool descriptor와 `chatgpt-app-submission.json`의 일치 여부를 확인하는 테스트를 추가했다.
- 위젯 UI가 verdict, route documents, evidence, validation, PII state, review warning, next action을 표시하도록 확장했다.
- corpus index가 stale 상태인지 확인하는 `scripts/check_index_drift.py`를 추가했다.

### Changed

- 근거가 질문을 실제로 뒷받침하지 않으면 evidence를 비우고 `NO_EVIDENCE`로 닫도록 답변 검증을 강화했다.
- Flow Code를 route, customs, invoice, KPI bucket 분류에 쓰려는 질문은 `BLOCK`으로 처리하도록 강화했다.
- write, send, export, report, invoice, cost, approval 관련 질문에는 Human-gate action을 붙이도록 강화했다.
- GitHub workflow의 index 검증 단계를 stale index 확인 방식으로 바꿨다.

### Verified

- 로컬에서 `npm run verify`를 실행했다.
- 결과: TypeScript typecheck 통과, 활성 Vitest 4개 파일 / 23개 테스트 통과.
- 로컬에서 `python scripts/check_index_drift.py`를 실행했다.
- 결과: corpus index는 최신 상태이고 `source_role_map.json`은 유효한 JSON으로 확인됐다.

### Risks

- 이 Option B 구현은 현재 커밋되지 않은 로컬 변경이다.
- GitHub Actions 실행 결과는 현재 세션에서 확인하지 않았다.
- GitHub에 push된 상태도 현재 세션에서 확인하지 않았다.
- security 문서 기준으로 Dependabot security updates와 code scanning은 아직 owner action이 필요하다.

## 2026-05-10 - Plan/spec goal commit

Commit: `0c629f7 Add operational improvement plan and spec`

### Added

- 운영 개선 목표 문서를 추가했다.
- 개선 spec 문서를 추가했다.
- 실행 계획 초안을 `docs/operations/plan.md`에 추가했다.

### Changed

- 초기 앱 업로드 이후, 구현 목표와 운영 개선 범위를 문서로 분리했다.

### Verified

- Git commit 이력과 commit stat으로 파일 추가 범위를 확인했다.

### Risks

- 이 커밋은 문서 중심 변경이다.
- 실제 runtime 구현 완료를 의미하지 않는다.

## 2026-05-10 - Initial app upload

Commit: `48d606d Initial HVDC ontology ChatGPT app`

### Added

- HVDC Ontology Grounded ChatGPT App의 초기 코드와 문서를 추가했다.
- Apps SDK/MCP 서버, corpus 검색, answer composition, redaction, routing, type 정의를 추가했다.
- approved ontology corpus와 index 파일을 추가했다.
- 초기 README, AGENTS.md, 보안 문서, QA 문서, 연결 문서를 추가했다.
- 초기 위젯 HTML과 pipeline test를 추가했다.
- Codex agent skill 문서를 `.agents/skills/` 아래에 추가했다.

### Changed

- 저장소의 기본 앱 구조와 검증 구조를 한 번에 만든 첫 업로드다.

### Verified

- Git commit 이력과 commit stat으로 초기 업로드 범위를 확인했다.

### Risks

- 초기 업로드는 넓은 범위의 scaffold다.
- 실제 운영 사용 전에는 각 tool contract, corpus grounding, privacy gate 검증이 필요하다.
