# HVDC Ontology ChatGPT App Starter

판정: 실제 구현 가능한 ChatGPT App starter repo입니다.  
목적: ChatGPT 안에서 HVDC 온톨로지 corpus를 먼저 조회하고, EvidenceSnippet + ValidationFinding + ActionRecommendation을 포함한 업무 답변을 반환합니다.

## 1. What this builds

- Apps SDK / MCP server endpoint: `http://localhost:8787/mcp`
- ChatGPT iframe widget: `ui://hvdc/answer-card.html`
- Core tools:
  - `ask_hvdc_ontology`
  - `route_question`
  - `search_ontology_corpus`
  - `resolve_any_key`
  - `validate_answer`
- Local corpus folder: `data/corpus/*.md`
- Codex Skills: `.agents/skills/*/SKILL.md`
- Guardrails: CONSOLIDATED-00 mandatory, EvidenceSnippet required, Flow Code WHP-only, PII masking, Human-gate for write/action.

## 2. Install

```bash
npm install
```

## 3. Run locally

```bash
npm run dev
```

Expected:

```text
HVDC Ontology MCP server listening on http://localhost:8787/mcp
```

## 4. Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector@latest --server-url http://localhost:8787/mcp --transport http
```

Try tool:

```json
{
  "question": "AGI M130 닫아도 돼? BL-535 관련",
  "userRole": "ops_user",
  "language": "ko"
}
```

Expected verdict: `BLOCK` because AGI/DAS M130 closure requires MOSB/LCT chain evidence.

## 5. Connect from ChatGPT

1. Expose local server through HTTPS.

```bash
ngrok http 8787
```

2. ChatGPT → Settings → Apps & Connectors → Advanced settings → Developer mode ON.
3. Settings → Apps & Connectors → Create.
4. Connector URL:

```text
https://<your-ngrok-subdomain>.ngrok.app/mcp
```

5. Open a new chat, add the connector, and ask:

```text
AGI M130 닫아도 돼? BL-535 관련
```

## 6. Corpus source

The repo is wired to read approved ontology Markdown from `data/corpus/`.
Current corpus files are synchronized from the local `ontology/` source folder:

```text
CONSOLIDATED-00-master-ontology.md
CONSOLIDATED-01-core-framework-infra.md
CONSOLIDATED-02-warehouse-flow.md
CONSOLIDATED-03-document-ocr.md
CONSOLIDATED-04-barge-bulk-cargo.md
CONSOLIDATED-05-invoice-cost.md
CONSOLIDATED-06-material-chain.md
CONSOLIDATED-07-port-operations.md
CONSOLIDATED-08-communication.md
CONSOLIDATED-09-operations.md
Team_역할분담_매트릭스.md
```

After changing corpus files, rebuild the section index:

```bash
npm run index
npm run verify
```

## 7. Codex usage

Start Codex from repo root. Codex will read `AGENTS.md`. Use skill prompts such as:

```text
Use the answer-grounding skill. Improve ask_hvdc_ontology so every factual claim has EvidenceSnippet coverage.
```

```text
Use the mcp-tool-contract skill. Add export_answer_report with outputSchema and tests.
```

## 8. Production TODO

- Add authentication before exposing P1/P2 data.
- Add RBAC and approval flow before write/action tools.
- Add vector search or hybrid BM25+embedding for larger corpus.
- Add live KG/GraphDB/Foundry adapter after MVP.
- Add submission privacy policy and final app icons/screenshots.

## 9. Fail-safe behavior

| State | Trigger | Behavior |
|---|---|---|
| `NO_EVIDENCE` | No corpus evidence | Stop answer and request key/source |
| `BLOCK` | Missing master spine or AGI/DAS M130 closure evidence | Do not approve operational close |
| `WARN` | Current regulation/rate/SOP claim | Require current approved source refresh |
| `INFO` | Flow Code boundary question | Explain WHP-only boundary |
