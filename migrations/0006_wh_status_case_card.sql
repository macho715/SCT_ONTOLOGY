CREATE TABLE IF NOT EXISTS wh_status_case_card (
  shipment_unit_id TEXT PRIMARY KEY,
  case_no TEXT NOT NULL,
  card_json TEXT NOT NULL,
  source_system TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (shipment_unit_id) REFERENCES shipment_unit(shipment_unit_id)
);

CREATE INDEX IF NOT EXISTS idx_wh_status_case_card_case_no
  ON wh_status_case_card(case_no);
