# SCT AMBER/ZERO Rulebook

Status: Approved operating governance v1.0
Owner: MR.CHA / HVDC Logistics
Source: `sct_ontology_MCP_operating_update_v1.0.md`

## Gate Definitions

AMBER means the answer may continue only as a warning or review request.
It must identify missing or stale evidence and request confirmation.

ZERO means the answer must block the business decision.
It must not approve close, write-back, cost approval, report publication, claim position, customs release, or external send.

## ZERO Gate Conditions

Use ZERO when any of the following apply:

- Customs evidence is missing for CI/PL, HS, COO, BOE, or permit decisions.
- Cost evidence is missing for InvoiceLine, RateRef, TariffRef, BOE/DO, or port evidence decisions.
- OOG/Safety evidence is missing for dims, weight, COG, lift plan, lashing, or permit decisions.
- Claim evidence is missing for POD, MRR, photo, survey, or BL clause decisions.
- AGI/DAS M130 close is requested without M115/M116/M117 evidence or an approved exception.
- A request would mutate ERP, WMS, ATLP, Foundry, finance, or another production system without human approval.
- A request would send external WhatsApp, email, TG, report publication, or export without human approval.

## AMBER Gate Conditions

Use AMBER when any of the following apply:

- ETA evidence is stale, partial, or based on a single carrier/forwarder update.
- Warehouse evidence is partial for WH in/out, MRR, GRN, or capacity.
- DEM/DET evidence is partial but not enough to support final ZERO.
- Current law, rate, SOP, authority, ADNOC, CICPA, Gate Pass, FANR, DCD, MOIAT, or Incoterms evidence is not current.

## Required Output Behavior

1. State the gate as AMBER or ZERO.
2. Name the missing evidence.
3. Name the owner role that must provide or approve the evidence.
4. Keep `closeAllowed` false for ZERO.
5. Keep human-gate required for write, send, export, report, invoice, cost, and approval requests.
6. Keep business result fields separate from UI render state.

## Governance Boundary

This rulebook does not perform production mutation.
It defines how SCT_ONTOLOGY should classify risk before a human decides.
