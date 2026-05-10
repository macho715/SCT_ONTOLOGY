---
name: submission-readiness
description: Prepare the HVDC ChatGPT App for internal pilot or ChatGPT app submission. Trigger before release or connector sharing.
---

Checklist
1. Tool names and descriptions match actual behavior.
2. `/mcp` endpoint works over HTTPS.
3. Widget resource returns `text/html;profile=mcp-app` through RESOURCE_MIME_TYPE.
4. No P2 sample data is committed.
5. Privacy policy and support contact are ready.
6. Screenshots have PII removed.
7. `npm run verify` passes.
8. Connector metadata is precise and not overbroad.

Output
- release checklist
- known limitations
- pilot runbook
