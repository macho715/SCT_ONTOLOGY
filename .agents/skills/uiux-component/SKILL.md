---
name: uiux-component
description: Build or audit the ChatGPT iframe widget for Answer Card, Evidence Drawer, Validation Gate, and Ontology Path.
---

UI contract
1. Render `structuredContent` from `window.openai.toolOutput` or `ui/notifications/tool-result`.
2. Show verdict first.
3. Show route documents and evidence hash.
4. Keep Evidence Drawer expandable.
5. Show Human-gate next actions clearly.
6. Use accessible HTML: semantic sections, visible focus, sufficient target size, no keyboard trap.

Do not
- Do not fetch external domains unless CSP is explicitly updated.
- Do not expose PII, API keys, raw contracts, or internal rates.
