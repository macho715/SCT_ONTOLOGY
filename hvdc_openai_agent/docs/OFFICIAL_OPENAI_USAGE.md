# OpenAI Agents SDK Usage Notes

이 프로젝트의 online mode는 OpenAI Agents SDK 패턴을 따릅니다.

- `Agent(...)`: logistics assistant instructions와 tools 묶음 정의
- `@function_tool`: deterministic Python rule functions를 tool로 노출
- `Runner.run(...)`: user natural language question 실행
- `OPENAI_API_KEY`: online mode 필수
- `OPENAI_MODEL`: 기본 `gpt-5.4-mini`, 환경변수로 교체 가능

Offline mode는 API call 없이 동일한 rule engine을 검증하기 위한 운영 안전장치입니다.
