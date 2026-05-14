-- HVDC Control Tower datasets seeded from data/datasets/*.csv.
-- These tables are read-only operational lookup surfaces for MCP tools.

CREATE TABLE IF NOT EXISTS shipment_unit (
  shipment_unit_id TEXT PRIMARY KEY,
  source_line_id TEXT,
  vendor TEXT,
  category TEXT,
  po_no TEXT,
  invoice_no TEXT,
  incoterms TEXT,
  declared_destination_set TEXT,
  declared_destination_count INTEGER,
  current_stage TEXT,
  current_location TEXT,
  routing_pattern TEXT,
  latest_receipt_dt TEXT,
  final_delivery_dt TEXT,
  site_completion_rate REAL,
  missing_required_destination TEXT,
  received_without_flag TEXT
);

CREATE INDEX IF NOT EXISTS idx_shipment_unit_invoice_no
  ON shipment_unit (invoice_no);

CREATE INDEX IF NOT EXISTS idx_shipment_unit_po_no
  ON shipment_unit (po_no);

CREATE INDEX IF NOT EXISTS idx_shipment_unit_source_line_id
  ON shipment_unit (source_line_id);

CREATE INDEX IF NOT EXISTS idx_shipment_unit_current_stage
  ON shipment_unit (current_stage);

CREATE INDEX IF NOT EXISTS idx_shipment_unit_routing_pattern
  ON shipment_unit (routing_pattern);

CREATE TABLE IF NOT EXISTS destination_requirement (
  requirement_id TEXT PRIMARY KEY,
  shipment_unit_id TEXT NOT NULL,
  destination_code TEXT NOT NULL,
  required_flag INTEGER NOT NULL,
  source_column TEXT,
  source_line_id TEXT,
  validation_status TEXT,
  reason_code TEXT
);

CREATE INDEX IF NOT EXISTS idx_destination_requirement_shipment_unit
  ON destination_requirement (shipment_unit_id);

CREATE INDEX IF NOT EXISTS idx_destination_requirement_destination
  ON destination_requirement (destination_code);

CREATE TABLE IF NOT EXISTS receipt_event (
  receipt_event_id TEXT PRIMARY KEY,
  shipment_unit_id TEXT NOT NULL,
  location_code TEXT NOT NULL,
  location_type TEXT,
  actual_receipt_dt TEXT,
  source_column TEXT,
  source_line_id TEXT,
  matched_required_destination INTEGER NOT NULL DEFAULT 0,
  validation_status TEXT,
  reason_code TEXT
);

CREATE INDEX IF NOT EXISTS idx_receipt_event_shipment_unit
  ON receipt_event (shipment_unit_id);

CREATE INDEX IF NOT EXISTS idx_receipt_event_location
  ON receipt_event (location_code);

CREATE TABLE IF NOT EXISTS validation_log (
  validation_id TEXT PRIMARY KEY,
  shipment_unit_id TEXT NOT NULL,
  rule_id TEXT NOT NULL,
  severity TEXT,
  field TEXT,
  value TEXT,
  reason_code TEXT
);

CREATE INDEX IF NOT EXISTS idx_validation_log_shipment_unit
  ON validation_log (shipment_unit_id);

CREATE INDEX IF NOT EXISTS idx_validation_log_rule
  ON validation_log (rule_id);

CREATE TABLE IF NOT EXISTS action_queue (
  action_id TEXT PRIMARY KEY,
  shipment_unit_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  owner_role TEXT NOT NULL,
  target_location TEXT,
  due_at TEXT,
  status TEXT,
  reason_code TEXT
);

CREATE INDEX IF NOT EXISTS idx_action_queue_shipment_unit
  ON action_queue (shipment_unit_id);

CREATE INDEX IF NOT EXISTS idx_action_queue_status
  ON action_queue (status);

