# Connect to ChatGPT

## Local run

```bash
npm install
npm run dev
```

## HTTPS tunnel

```bash
ngrok http 8787
```

## ChatGPT settings

1. Settings → Apps & Connectors → Advanced settings → Developer mode ON.
2. Settings → Apps & Connectors → Create.
3. Connector URL: `https://<subdomain>.ngrok.app/mcp`.
4. Add the connector to a new chat from the `+` → More menu.

## Test prompt

```text
AGI M130 닫아도 돼? BL-535 관련
```

Expected: Answer Card shows `BLOCK`, evidence, validation, ontology path, and Human-gate action.
