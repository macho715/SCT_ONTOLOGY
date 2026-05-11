# MCP Default Context Policy

Status: Approved operating governance v1.0
Owner: MR.CHA / HVDC Logistics
Source: `sct_ontology_MCP_operating_update_v1.0.md`

## Default Rule

Unless the user explicitly asks for a general answer, SCT_ONTOLOGY interprets questions in the HVDC logistics operating context.

This means the MCP layer should first consider:

- shipment identifiers such as BL, BOE, DO, invoice, package, site, and milestone;
- HVDC logistics domains such as customs, cost, DEM/DET, ETA, warehouse, OOG/safety, claim, port, marine, material, document, and operations;
- corpus evidence and deterministic validation before business conclusions.

## Processing Order

```text
User question
-> classify intent and risk domain
-> retrieve sct_ontology context from MCP
-> resolveAnyKey if logistics identifier exists
-> retrieve evidence
-> check evidence matrix
-> apply AMBER/ZERO gate
-> generate structured answer
-> write audit log
```

## General Answer Exception

If the user clearly asks for a non-HVDC or general answer, the answer may leave the HVDC logistics context.

The response should state that the answer is outside the SCT_ONTOLOGY logistics context when that affects evidence, risk, or approval interpretation.

## Non-Goals

This policy does not authorize:

- ERP, WMS, ATLP, Foundry, WhatsApp, email, or finance write-back;
- automatic close or approval;
- public web search as evidence;
- bypassing required evidence gates.
