# Cloudflare Remote MCP Migration Plan

작성일: 2026-05-13

## Execution status - 2026-05-13

현재 상태는 구현 완료 기준이다.
Cloudflare Workers MCP, R2 binding, D1 audit logging, Claude/Cursor/ChatGPT remote MCP 연결 문서가 production URL 기준으로 전환되었다.

운영 MCP URL:

```text
https://hvdc-ontology-chatgpt-app.mscho715.workers.dev/mcp
```

## Phase 1: Business Review

### 1.1 문제 정의

현재 상태는 기존 Node 배포 런타임 후보를 고르는 단계를 지나 Cloudflare Workers 전환을 완료한 단계다.
목표 상태는 외부 AI 클라이언트가 Cloudflare MCP URL로 접속하고, 파일 읽기, 검색, 감사 로그를 안전하게 처리하는 Remote MCP 서버를 운영하는 것이다. 쓰기, 업로드, 승인 workflow는 다음 범위다.

가정:
- 현재 코드는 Cloudflare Workers MCP로 이전되었다.
- 현재 작업 범위는 구현 후 문서 정합성, 연결 설정, 검증 결과를 맞추는 것이다.
- 실제 비용은 트래픽, 파일 용량, 업로드 빈도, 로그 보존 기간을 확인한 뒤 산정한다.

영향 범위:
- MCP endpoint: `/mcp`
- MCP transport: Streamable HTTP
- storage: 파일은 R2, metadata/index/audit는 D1 또는 Durable Objects
- tools: read, search, dry-run write, commit write, upload, audit
- optional UI: Vercel dashboard는 선택사항이며 MCP runtime과 분리한다.

공식 문서 기준 확인:
- MCP 공식 스펙은 표준 transport로 `stdio`와 `Streamable HTTP`를 둔다.
- Streamable HTTP 서버는 하나의 MCP endpoint에서 `POST`와 `GET`을 지원해야 한다.
- Cloudflare Agents 문서는 remote MCP가 Streamable HTTP와 OAuth로 동작한다고 설명한다.
- Cloudflare R2는 multipart upload로 대형 파일 업로드, 재시도, 병렬 업로드에 적합하다.
- Workers request body limit은 plan에 따라 달라지므로, 대형 파일은 Workers 프록시가 아니라 R2 direct upload로 설계해야 한다.
- Vercel Blob server upload는 Vercel Functions request body 4.5 MB 제한 때문에 대형 업로드 주 런타임으로 부적합하다.

### 1.2 제안 옵션

| 옵션 | 설명 | 공수(일) | 리스크 | 비용(AED) |
|------|------|---------:|--------|-----------|
| A | Cloudflare Workers/Agents + R2 + D1/Durable Objects | 5-8 | 초기 OAuth, 업로드 토큰, 감사 로그 설계가 필요하다. | TBD. 공식 pricing과 예상 사용량 확인 필요 |
| B | Render + Supabase Storage/Postgres | 4-7 | MCP 공식 배포 경로가 약하고, upload/storage는 별도 통합이 필요하다. | TBD. 공식 pricing과 예상 사용량 확인 필요 |
| C | Vercel + Supabase 또는 Vercel Blob | 4-6 | Vercel 단독은 대형 upload와 long-running MCP server에 제약이 있다. | TBD. 공식 pricing과 예상 사용량 확인 필요 |

### 1.3 추천 & 근거

추천 옵션은 A, Cloudflare Workers/Agents + R2 + D1/Durable Objects다.
이유는 remote MCP, Streamable HTTP, OAuth, R2 upload, scoped permission을 한 플랫폼에서 가장 자연스럽게 묶을 수 있기 때문이다.
Vercel은 MCP runtime이 아니라 dashboard/admin UI로만 쓰는 것이 안전하다.

롤백 전략:
- Cloudflare 검증 실패 시 `server/src/index.ts` Node fallback과 직전 Git commit으로 되돌린다.

### 1.4 승인 요청

- [ ] Phase 1 승인

승인 후 Phase 2에서 Mermaid 구조도, 파일 변경 목록, 작업 순서, 테스트 전략, 위험 완화안을 작성한다.
