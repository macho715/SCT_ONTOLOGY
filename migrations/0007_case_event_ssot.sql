CREATE TABLE IF NOT EXISTS ref_case_map (
  case_norm TEXT PRIMARY KEY,
  case_raw TEXT NOT NULL,
  su_id TEXT NOT NULL,
  source_file TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  rule_ver TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ingest_audit (
  ingest_id TEXT PRIMARY KEY,
  source_file TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  total_rows INTEGER NOT NULL,
  loaded_rows INTEGER NOT NULL,
  tool_ver TEXT NOT NULL,
  load_ts TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS canonical_shipment_events (
  event_id TEXT PRIMARY KEY,
  su_id TEXT NOT NULL,
  case_no_raw TEXT NOT NULL,
  case_norm TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT,
  event_rank INTEGER NOT NULL DEFAULT 0,
  site_code TEXT,
  zone_code TEXT,
  ref_doc_no TEXT,
  remarks TEXT,
  source_column TEXT,
  source_file TEXT NOT NULL,
  source_sheet TEXT,
  source_row INTEGER,
  ingest_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (case_norm) REFERENCES ref_case_map(case_norm),
  FOREIGN KEY (ingest_id) REFERENCES ingest_audit(ingest_id)
);

CREATE INDEX IF NOT EXISTS idx_canonical_events_case_norm
  ON canonical_shipment_events(case_norm);

CREATE INDEX IF NOT EXISTS idx_canonical_events_su_type_date
  ON canonical_shipment_events(su_id, event_type, event_date);

CREATE INDEX IF NOT EXISTS idx_canonical_events_ingest
  ON canonical_shipment_events(ingest_id);

CREATE TABLE IF NOT EXISTS rollback_audit (
  rollback_id TEXT PRIMARY KEY,
  ingest_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  affected_case_count INTEGER NOT NULL,
  affected_event_count INTEGER NOT NULL,
  generated_at TEXT NOT NULL,
  executed_at TEXT,
  status TEXT NOT NULL,
  FOREIGN KEY (ingest_id) REFERENCES ingest_audit(ingest_id)
);

CREATE TABLE IF NOT EXISTS row_index (
  ingest_id TEXT NOT NULL,
  source_row INTEGER NOT NULL,
  su_id TEXT NOT NULL,
  case_norm TEXT NOT NULL,
  derived_event_id TEXT NOT NULL,
  source_file TEXT NOT NULL,
  PRIMARY KEY (ingest_id, source_row, derived_event_id),
  FOREIGN KEY (ingest_id) REFERENCES ingest_audit(ingest_id),
  FOREIGN KEY (derived_event_id) REFERENCES canonical_shipment_events(event_id)
);

CREATE VIEW IF NOT EXISTS status_latest_per_su AS
SELECT su_id, case_norm, event_type AS latest_event_type, event_date AS latest_event_date, site_code, zone_code
FROM (
  SELECT
    su_id,
    case_norm,
    event_type,
    event_date,
    site_code,
    zone_code,
    ROW_NUMBER() OVER (
      PARTITION BY su_id
      ORDER BY
        COALESCE(event_date, '') DESC,
        event_rank DESC,
        COALESCE(source_row, 0) DESC,
        CASE event_type
          WHEN 'SITE_RECEIPT' THEN 1
          WHEN 'M100_FINAL_DELIVERED' THEN 2
          WHEN 'WH_ISSUE' THEN 3
          WHEN 'WH_RECEIPT' THEN 4
          ELSE 9
        END ASC,
        event_id DESC
    ) AS rn
  FROM canonical_shipment_events
  WHERE event_date IS NOT NULL
)
WHERE rn = 1;

CREATE VIEW IF NOT EXISTS status_wh_dwell AS
SELECT
  su_id,
  case_norm,
  MIN(CASE WHEN event_type = 'WH_RECEIPT' THEN event_date END) AS warehouse_in,
  MAX(CASE WHEN event_type = 'WH_ISSUE' THEN event_date END) AS warehouse_out,
  CASE
    WHEN MIN(CASE WHEN event_type = 'WH_RECEIPT' THEN event_date END) IS NOT NULL
     AND MAX(CASE WHEN event_type = 'WH_ISSUE' THEN event_date END) IS NOT NULL
    THEN CAST(
      julianday(MAX(CASE WHEN event_type = 'WH_ISSUE' THEN event_date END))
      - julianday(MIN(CASE WHEN event_type = 'WH_RECEIPT' THEN event_date END))
      AS INTEGER
    )
    ELSE NULL
  END AS dwell_days
FROM canonical_shipment_events
WHERE event_type IN ('WH_RECEIPT', 'WH_ISSUE')
GROUP BY su_id, case_norm;

CREATE VIEW IF NOT EXISTS status_site_intake AS
SELECT
  su_id,
  case_norm,
  MAX(event_date) AS site_receipt_date,
  GROUP_CONCAT(DISTINCT site_code) AS site_codes
FROM canonical_shipment_events
WHERE event_type IN ('SITE_RECEIPT', 'M100_FINAL_DELIVERED')
GROUP BY su_id, case_norm;
