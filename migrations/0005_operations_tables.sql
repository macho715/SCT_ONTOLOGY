-- Migration 0005: Document operations tables provisioned outside migrations
-- These five tables exist in the live hvdc-mcp-audit D1 database and are
-- managed by the HVDC Control Tower data pipeline. This migration records
-- their canonical DDL so schema drift detection (scripts/verify-bindings.ts)
-- can treat them as expected rather than undocumented.
--
-- DDL recovered from sqlite_master on 2026-05-15 via Cloudflare Bindings MCP.
-- Row counts at recovery: shipment_unit=913, destination_requirement=1310,
-- receipt_event=2053, action_queue=790, validation_log=1089.

CREATE TABLE IF NOT EXISTS shipment_unit (
  shipment_unit_id          TEXT PRIMARY KEY,
  source_line_id            TEXT,
  vendor                    TEXT,
  category                  TEXT,
  po_no                     TEXT,
  invoice_no                TEXT,
  incoterms                 TEXT,
  declared_destination_set  TEXT,
  declared_destination_count INTEGER,
  current_stage             TEXT,
  current_location          TEXT,
  routing_pattern           TEXT,
  latest_receipt_dt         TEXT,
  final_delivery_dt         TEXT,
  site_completion_rate      REAL,
  missing_required_destination TEXT,
  received_without_flag     TEXT
);

CREATE TABLE IF NOT EXISTS destination_requirement (
  requirement_id      TEXT PRIMARY KEY,
  shipment_unit_id    TEXT NOT NULL,
  destination_code    TEXT NOT NULL,
  required_flag       INTEGER NOT NULL,
  source_column       TEXT,
  source_line_id      TEXT,
  validation_status   TEXT,
  reason_code         TEXT
);

CREATE TABLE IF NOT EXISTS receipt_event (
  receipt_event_id            TEXT PRIMARY KEY,
  shipment_unit_id            TEXT NOT NULL,
  location_code               TEXT NOT NULL,
  location_type               TEXT,
  actual_receipt_dt           TEXT,
  source_column               TEXT,
  source_line_id              TEXT,
  matched_required_destination INTEGER NOT NULL DEFAULT 0,
  validation_status           TEXT,
  reason_code                 TEXT
);

CREATE TABLE IF NOT EXISTS action_queue (
  action_id        TEXT PRIMARY KEY,
  shipment_unit_id TEXT NOT NULL,
  action_type      TEXT NOT NULL,
  owner_role       TEXT NOT NULL,
  target_location  TEXT,
  due_at           TEXT,
  status           TEXT,
  reason_code      TEXT
);

CREATE TABLE IF NOT EXISTS validation_log (
  validation_id    TEXT PRIMARY KEY,
  shipment_unit_id TEXT NOT NULL,
  rule_id          TEXT NOT NULL,
  severity         TEXT,
  field            TEXT,
  value            TEXT,
  reason_code      TEXT
);
