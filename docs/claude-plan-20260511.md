# Claude 전용 HVDC Ontology App — 구현 계획

| 항목 | 값 |
|---|---|
| 문서명 | Claude 전용 HVDC Ontology App Implementation Plan |
| 작성일 | 2026-05-11 |
| 기준 문서 | `chatgpt-app-submission.json`, `server/src/index.ts`, `SYSTEM_ARCHITECTURE.md` |
| 파이프라인 위치 | **[plan]** → review → ship → qa |

---

## Phase 1 — CEO Review

### 1.1 문제 정의

**현재 상태**: HVDC Ontology 답변 앱은 ChatGPT 전용으로만 동작한다. `@modelcontextprotocol/ext-apps`, `ui://hvdc/` 리소스 URI, `openai/outputTemplate` 메타 등 ChatGPT SDK 의존 요소가 하드코딩되어 있어 Claude Desktop / Claude Code에서는 tool이 노출되지 않고 위젯 렌더링이 불가능하다.

**목표 상태**: 동일한 corpus·answer 코어를 유지하면서 Claude 전용 MCP 서버 레이어를 추가한다. Claude 클라이언트에서 6개 tool을 즉시 사용하고, ChatGPT 포맷과 Claude 포맷 양쪽 응답을 파싱하는 공통 렌더러를 확보한다.

**영향 범위**: HVDC Project Logistics 사용자 全員 — ChatGPT 미사용자·Claude Code 사용자(개발팀 포함) 포함.

---

### 1.2 제안 옵션

| 옵션 | 설명 | 공수(일) | 리스크 | 비용 |
|---|---|---|---|---|
| **A — 별도 Claude 서버 (추천)** | `server/src/claude-server.ts` 신규 작성. 표준 MCP SDK만 사용. ChatGPT 서버(8787)와 포트 분리(8788). 양쪽 포맷 파싱용 `claude-render.ts` 추가 | **2** | 낮음 — 공유 코어 무변경 | 0 AED (내부) |
| **B — 단일 서버 분기** | `server/src/index.ts`에 `CLIENT_TYPE` 환경변수 분기 추가. ChatGPT/Claude를 같은 파일에서 처리 | 1 | 중간 — 기존 ChatGPT 동작 회귀 위험, descriptor.test.ts 파괴 가능 | 0 AED |
| **C — Proxy 서버** | 기존 ChatGPT 서버 앞에 Claude 전용 proxy를 두어 메타 변환 | 3 | 높음 — 운영 복잡도 증가, 추가 배포 환경 필요 | 0 AED |

---

### 1.3 추천 & 근거

**옵션 A 추천**. 공유 코어(`answer.ts`, `corpus.ts`, `router.ts`, `redact.ts`, `types.ts`)를 그대로 재사용하면서 Claude 전용 서버를 독립 파일로 분리하기 때문에 기존 ChatGPT 동작·테스트가 전혀 영향받지 않는다. 포트 분리로 두 클라이언트를 동시에 연결할 수 있다.

**롤백 전략**: `claude-server.ts`만 삭제하면 완전 원복. 기존 `index.ts` / `chatgpt-app-submission.json` 무변경이므로 ChatGPT 연결 즉시 복원 가능.

---

### 1.4 승인 요청

- [ ] Phase 1 승인 — 옵션 A로 진행

---

## Phase 2 — Engineering Review

### 2.1 아키텍처 다이어그램

```mermaid
graph TD
  subgraph 공유 코어 (변경 없음)
    ANSWER["server/src/answer.ts"]
    CORPUS["server/src/corpus.ts"]
    ROUTER["server/src/router.ts"]
    REDACT["server/src/redact.ts"]
    TYPES["server/src/types.ts"]
  end

  subgraph ChatGPT 레이어 (기존 유지)
    CGT_IDX["server/src/index.ts<br/>(registerAppTool, ext-apps)"]
    CGT_UI["server/src/ui.ts"]
    CGT_WIDGET["public/hvdc-answer-widget.html<br/>ui://hvdc/answer-card-v6.html"]
    CGT_SUB["chatgpt-app-submission.json"]
  end

  subgraph Claude 레이어 (신규)
    CL_SERVER["server/src/claude-server.ts<br/>(표준 MCP SDK, 포트 8788)"]
    CL_RENDER["server/src/claude-render.ts<br/>(양쪽 포맷 파서 + 마크다운 렌더러)"]
    CL_SUB["claude-app-submission.json"]
    CL_DOC["docs/CONNECT_CLAUDE.md"]
  end

  subgraph 테스트 (신규)
    CL_TEST["tests/claude-descriptor.test.ts"]
  end

  CL_SERVER --> ANSWER
  CL_SERVER --> CORPUS
  CL_SERVER --> ROUTER
  CL_SERVER --> REDACT
  CL_SERVER --> TYPES
  CL_SERVER --> CL_RENDER

  CGT_IDX --> ANSWER
  CGT_IDX --> CORPUS
  CGT_IDX --> ROUTER
  CGT_IDX --> REDACT
  CGT_IDX --> TYPES
  CGT_IDX --> CGT_UI

  CL_RENDER -->|"파싱 A: ChatGPT format\n(_meta openai/outputTemplate 포함)"| TYPES
  CL_RENDER -->|"파싱 B: Claude format\n(GroundedAnswer 직접)"| TYPES

  CL_TEST --> CL_SERVER
  CL_TEST --> CL_SUB
```

---

### 2.2 파일 변경 목록

| 파일 | 변경 유형 | 설명 |
|---|---|---|
| `server/src/claude-server.ts` | **create** | Claude 전용 MCP 서버. 표준 `@modelcontextprotocol/sdk` `server.tool()` 사용. `ext-apps` 없음. 포트 `CLAUDE_PORT \|\| 8788`. 6개 tool 등록. |
| `server/src/claude-render.ts` | **create** | `GroundedAnswer` → 마크다운 카드 렌더러. ChatGPT format(openai 메타 포함) + Claude format 양쪽 파싱. |
| `claude-app-submission.json` | **create** | Claude 앱 설정. `chatgpt-app-submission.json`과 병렬 구조. `claude_desktop_config.json` 스니펫 포함. |
| `docs/CONNECT_CLAUDE.md` | **create** | Claude Desktop / Claude Code 연결 가이드. 테스트 프롬프트 5개. |
| `tests/claude-descriptor.test.ts` | **create** | `claude-app-submission.json` ↔ Claude 서버 tool 목록 parity 검증. 포맷 파싱 round-trip 테스트. |
| `package.json` | **modify** | `"claude:dev"`, `"claude:start"` 스크립트 추가. |
| `AGENTS.md` | **modify** | Claude 전용 섹션 추가 (tool 목록, 포트, 파싱 계약). |

> **⚠️ 파일명 충돌 체크**:
> - `claude-server.ts`: `server/src/` 내 없음 — 안전
> - `claude-render.ts`: `server/src/` 내 없음 — 안전 (기존 `ui.ts`는 ChatGPT 전용 유지)
> - `claude-app-submission.json`: 루트 내 없음 — 안전
> - `docs/CONNECT_CLAUDE.md`: `docs/` 내 없음 — 안전
> - `tests/claude-descriptor.test.ts`: `tests/` 내 없음 — 안전

---

### 2.3 의존성 & 순서

```
1. server/src/claude-render.ts    ← TYPES 의존만 있음. 독립 작성 가능.
2. server/src/claude-server.ts    ← claude-render.ts 완료 후 작성.
3. claude-app-submission.json     ← claude-server.ts tool 목록 확정 후 작성.
4. tests/claude-descriptor.test.ts ← 2, 3 완료 후 작성.
5. docs/CONNECT_CLAUDE.md         ← 2 완료 후 작성 (포트·URL 확정).
6. package.json 수정              ← 2 완료 후 스크립트 추가.
7. AGENTS.md 수정                 ← 전체 완료 후 문서 갱신.
```

---

### 2.4 Claude 전용 파싱 계약 (`claude-render.ts`)

```
입력 A — ChatGPT format (render_hvdc_answer_card 응답):
  {
    structuredContent: { ...GroundedAnswer, ui: { templateUrl: "ui://hvdc/..." } },
    _meta: { "openai/outputTemplate": "ui://hvdc/...", ui: { resourceUri: "..." } }
  }
  → _meta 제거, structuredContent.ui 제거
  → GroundedAnswer 추출 → 마크다운 렌더링

입력 B — Claude format (ask_hvdc_ontology 또는 claude-server.ts 응답):
  {
    structuredContent: { ...GroundedAnswer }   // ui 없음
  }
  → 직접 마크다운 렌더링

공통 출력 (마크다운 카드):
  ## HVDC Ontology Answer — {verdict}
  **Route:** {requiredDocs join ", "}
  **Summary:** {summary}
  **Business Impact:** {businessImpact}
  ### Evidence ({evidence.length}건)
  - [{docId}] {sectionPath} — confidence {confidence}
  ...
  ### Validation
  - [{severity}] {ruleId}: {message}
  ### Next Actions
  - {actionType} (ownerRole: {ownerRole}, humanGate: {humanGateRequired})
```

---

### 2.5 `claude-server.ts` tool 등록 방식

```typescript
// ChatGPT: registerAppTool(server, name, descriptor, handler)
// Claude: server.tool(name, description, inputSchema, handler)

server.tool(
  "ask_hvdc_ontology",
  "HVDC logistics question answered from ontology corpus with evidence, validation, and next action.",
  { question: z.string(), userRole: z.string().optional(), language: z.enum(["ko","en","auto"]).optional() },
  async ({ question, userRole, language }) => {
    const answer = answerQuestion({ question, userRole, language });
    return {
      content: [{ type: "text", text: renderAnswerMarkdown(answer) }]
    };
  }
);

// render_hvdc_answer_card: 양쪽 포맷 파싱 후 마크다운 반환
server.tool(
  "render_hvdc_answer_card",
  "Render HVDC answer card. Accepts both ChatGPT-format (with openai/_meta) and Claude-format GroundedAnswer.",
  { /* answerOutputSchema identical to ChatGPT version */ },
  async (input) => {
    const answer = parseGroundedAnswer(input); // ChatGPT or Claude format
    return {
      content: [{ type: "text", text: renderAnswerMarkdown(answer) }]
    };
  }
);
```

---

### 2.6 테스트 전략

| 테스트 | 파일 | 커버 범위 |
|---|---|---|
| Claude tool descriptor parity | `tests/claude-descriptor.test.ts` | `claude-app-submission.json` tool 이름 ↔ `claude-server.ts` tool 목록 일치 |
| ChatGPT format 파싱 | `tests/claude-descriptor.test.ts` | `_meta["openai/outputTemplate"]` 포함 입력 → GroundedAnswer 추출 성공 |
| Claude format 파싱 | `tests/claude-descriptor.test.ts` | `ui` 없는 순수 GroundedAnswer → 마크다운 렌더 성공 |
| 마크다운 카드 필수 필드 | `tests/claude-descriptor.test.ts` | verdict, route, evidence count, actions 포함 여부 |
| **기존 테스트 영향 없음** | `tests/descriptor.test.ts`, `tests/pipeline.test.ts`, `tests/evals.test.ts`, `tests/widget.test.ts` | ChatGPT 서버 코드 무변경이므로 기존 43개 테스트 전원 통과 유지 |

---

### 2.7 `claude-app-submission.json` 구조

```json
{
  "$schema": "claude-app-submission.v1.json",
  "schema_version": 1,
  "app_info": {
    "display_name": "HVDC Ontology Answer",
    "subtitle": "HVDC evidence answers for Claude",
    "description": "...",
    "category": "BUSINESS"
  },
  "mcp_server": {
    "local_url": "http://localhost:8788/mcp",
    "production_url": "https://hvdc-ontology-chatgpt-app-production.up.railway.app/mcp"
  },
  "claude_desktop_config": {
    "mcpServers": {
      "hvdc-ontology": {
        "command": "npm",
        "args": ["run", "claude:start"],
        "cwd": "<repo-path>"
      }
    }
  },
  "tools": { /* 6개 동일 */ },
  "test_cases": [ /* Claude 전용 시나리오 */ ],
  "negative_test_cases": [ /* 동일 */ ]
}
```

---

### 2.8 리스크 & 완화

| 리스크 | 영향 | 완화 |
|---|---|---|
| Claude `server.tool()` API가 `@modelcontextprotocol/sdk ^1.20.2`에서 변경됨 | Claude 서버 기동 실패 | `claude-server.ts` 작성 전 SDK 버전 확인, 기존 `McpServer.tool()` 패턴 사용 |
| `claude-render.ts`가 ChatGPT format 입력을 잘못 파싱 | 답변 데이터 누락 | `parseGroundedAnswer` 함수에 format discriminator (`_meta["openai/outputTemplate"]` 존재 여부)로 분기 |
| 포트 8788 충돌 | Claude 서버 기동 실패 | `CLAUDE_PORT` 환경변수로 override 가능하도록 구현 |
| 기존 descriptor.test.ts가 Claude 서버 파일을 인식해 ChatGPT 파일 목록 오판 | false fail | `descriptor.test.ts`는 `chatgpt-app-submission.json`만 검사하므로 영향 없음 — 단, import 범위 확인 필요 |
| `package.json` 스크립트 추가 후 `npm run verify`에 `claude:dev` 포함 여부 오해 | CI 혼선 | `verify` 스크립트 변경 없이 `claude:dev` / `claude:start`만 추가 |

---

## 파이프라인 연결

계획이 승인되면:

> 계획이 확정되었습니다. **`/review`**로 코드 리뷰 체크리스트를 준비하거나, 바로 구현을 시작하시겠습니까?

구현 순서 요약:
1. `claude-render.ts` → 2. `claude-server.ts` → 3. `claude-app-submission.json` → 4. `tests/claude-descriptor.test.ts` → 5. `docs/CONNECT_CLAUDE.md` → 6. `package.json` → 7. `AGENTS.md`

검증:
```bash
npm run verify   # 기존 43개 테스트 유지 확인
```
