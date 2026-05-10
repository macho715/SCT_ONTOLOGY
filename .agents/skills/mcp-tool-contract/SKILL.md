---
name: mcp-tool-contract
description: Design or modify Apps SDK MCP tools for the HVDC ChatGPT App. Trigger when adding tool names, inputSchema, outputSchema, resourceUri, or annotations.
---

Rules
1. One job per tool.
2. Use explicit `inputSchema` and `outputSchema`.
3. Use `readOnlyHint: true` for corpus search, routing, validation, and resolve tools.
4. Any write/action/export tool must require Human-gate and AuditRecord.
5. Use `_meta.ui.resourceUri` only when a widget should render.
6. Keep `structuredContent` concise and never include secrets.

Checklist
- Tool name is action-oriented.
- Description starts with clear usage trigger.
- Schema has safe ranges and enums.
- Output includes stable identifiers for follow-up calls.
- Tests cover malformed input and no-evidence state.
