# SCT Evidence Matrix

Status: Approved operating governance v1.0
Owner: MR.CHA / HVDC Logistics
Source: `sct_ontology_MCP_operating_update_v1.0.md`

## Purpose

This matrix defines the minimum evidence expected before SCT_ONTOLOGY can support high-risk HVDC logistics answers.

Missing required evidence must not be filled by inference.
Missing required evidence moves the answer to AMBER or ZERO according to the gate column.

## Matrix

| Domain | Required Evidence | Missing Gate |
|---|---|---|
| Customs | CI/PL, HS, COO, BOE, permit | ZERO |
| Cost | InvoiceLine, RateRef, TariffRef, BOE/DO/Port evidence | ZERO |
| DEM/DET | discharge, free time, gate-out, empty return | ZERO/AMBER |
| ETA | carrier/forwarder update, milestone timestamp | AMBER |
| Warehouse | WH in/out, MRR, GRN, capacity | AMBER |
| OOG/Safety | dims/wt/COG, lift plan, lashing, permit | ZERO |
| Claim | POD, MRR, photo, survey, BL clause | ZERO |

## Operating Rules

1. Required evidence must be returned from approved corpus, approved operational records, or an approved exception record.
2. Rule output without supporting evidence is secondary validation only.
3. Rule output must not create fake corpus evidence IDs.
4. If the required evidence is absent, the answer must ask for the missing evidence instead of closing the business decision.
5. High-risk close, cost approval, claim, customs, OOG/safety, or report publication decisions require human-gate review.

## Review Notes

This file is governance evidence.
It is not added to `data/corpus/` and is not runtime corpus evidence unless a later phase explicitly indexes it.
