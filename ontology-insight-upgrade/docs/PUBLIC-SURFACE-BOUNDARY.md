# Public Surface Boundary

**Phase:** 1
**Requirement:** HYGIENE-03

## Decision

Cloudflare MCP is the only V1 production public direction.

All existing GPTs Actions, ngrok, OpenAPI, local Flask, local Fuseki, and local dashboard files are development or migration references for V1.

## Surface Classification

| Surface | Example files | V1 status | Reason |
|---|---|---|---|
| Cloudflare MCP | Future Worker or Agent endpoint | Production direction | This is the target public MCP boundary. |
| GPTs Actions | `HVDC_GPTS_ACTIONS_GUIDE.md`, `HVDC_GPTS_ONECLICK_GUIDE.md`, `gpts_oneclick.ps1` | Development or migration reference | Existing flow exposes local services through ngrok and OpenAPI. |
| ngrok | `ngrok_setup.ps1`, generated public URLs | Development or migration reference | Tunnels are temporary local exposure, not durable production control. |
| OpenAPI schemas | `openapi.yaml`, `openapi.updated.yaml` | Development or migration reference | These describe legacy GPTs Actions, not the V1 MCP contract. |
| Local Flask | `hvdc_api.py`, `nlq_query_wrapper_flask.py` | Local workbench only | Local ports do not prove production MCP readiness. |
| Local Fuseki | `start-hvdc-fuseki.*`, `fuseki/**` | Local graph workbench only | Raw SPARQL and graph update access must not be exposed to production users. |
| Local dashboards | `dashboard_*.html`, `start-dashboard-*.ps1` | Local visualization only | Dashboards must not become the production data boundary. |

## Non-production Marker Text

Legacy public-surface files must include this visible marker:

```text
Development or migration reference only. This file is not a V1 production public surface. Cloudflare MCP is the production direction.
```

## Done Rule

HYGIENE-03 is satisfied only when users can identify ngrok, GPTs Actions, OpenAPI, local Flask, and local Fuseki assets as development or migration references.
