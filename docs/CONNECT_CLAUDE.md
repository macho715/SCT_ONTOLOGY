# Connect HVDC Ontology App to Claude

## Overview

The HVDC Ontology Claude App runs on port **8788** (separate from the ChatGPT server on 8787). It uses the standard MCP SDK — no ChatGPT-specific extensions required.

---

## Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "hvdc-ontology": {
      "command": "npm",
      "args": ["run", "claude:start"],
      "cwd": "/path/to/HVDC-Ontology-Grounded"
    }
  }
}
```

Config file location:
- **macOS/Linux**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

---

## Claude Code (CLI)

### Start the server manually

```bash
npm run claude:dev
```

Then add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "hvdc-ontology": {
      "url": "http://localhost:8788/mcp"
    }
  }
}
```

Or via the CLI flag:

```bash
claude --mcp-server "hvdc-ontology=http://localhost:8788/mcp"
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `CLAUDE_PORT` | `8788` | Claude server port |
| `PORT` | `8787` | ChatGPT server port (unchanged) |

Both servers can run simultaneously.

---

## Available Tools (6)

| Tool | Description |
|---|---|
| `ask_hvdc_ontology` | Corpus-grounded answer with evidence and validation |
| `render_hvdc_answer_card` | Markdown card from any GroundedAnswer (ChatGPT or Claude format) |
| `route_question` | Classify question into domains + required docs |
| `search_ontology_corpus` | Evidence snippets from approved HVDC documents |
| `resolve_any_key` | Resolve BL, BOE, DO, Invoice, HVDC code identifiers |
| `validate_answer` | Check evidence coverage, human-gate, currentness |

---

## Test Prompts

1. **Basic answer**: `AGI M130 닫아도 돼? BL-535 관련`
   - Expected: `BLOCK` verdict with human-gate action

2. **Flow Code boundary**: `Flow Code 어디에 써?`
   - Expected: WHP-only explanation with evidence

3. **Evidence search**: `BOE 123 지연 원인 근거를 찾아줘`
   - Expected: Evidence snippets from corpus

4. **Identifier resolution**: `BL-535 관련 자재 상태 확인해줘`
   - Expected: Resolved entity candidates

5. **Format parsing test**: Run `ask_hvdc_ontology`, then pass the result to `render_hvdc_answer_card`
   - Expected: Markdown card with verdict, route, evidence, actions

---

## Format Compatibility

`render_hvdc_answer_card` accepts **both** response formats:

**ChatGPT format** (from the ChatGPT App on port 8787):
```json
{
  "structuredContent": { "...GroundedAnswer...", "ui": { "templateUrl": "ui://hvdc/..." } },
  "_meta": { "openai/outputTemplate": "ui://hvdc/..." }
}
```

**Claude format** (from this server on port 8788):
```json
{
  "answerId": "...",
  "verdict": "PASS",
  "summary": "...",
  "..."
}
```

Both are normalized to the same markdown card output.
