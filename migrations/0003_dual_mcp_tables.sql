-- HVDC Dual-MCP: identifier index, milestone events, team role matrix
-- Step 1 of 8: D1 schema for Any-key Control Tower, MOSB Gate, Team Action Router

CREATE TABLE IF NOT EXISTS identifier_index (
  identifier_scheme TEXT NOT NULL,
  identifier_value  TEXT NOT NULL,
  normalized_value  TEXT NOT NULL,
  target_type       TEXT NOT NULL,
  target_rid        TEXT,
  confidence        REAL NOT NULL DEFAULT 1.0,
  source_system     TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (identifier_scheme, normalized_value)
);

CREATE INDEX IF NOT EXISTS idx_identifier_index_normalized
  ON identifier_index (normalized_value);

CREATE INDEX IF NOT EXISTS idx_identifier_index_target_rid
  ON identifier_index (target_rid);

-- milestone_event: per-ShipmentUnit milestone records for MOSB Gate and Action Router
CREATE TABLE IF NOT EXISTS milestone_event (
  id               TEXT PRIMARY KEY,
  shipment_unit_id TEXT NOT NULL,
  milestone_code   TEXT NOT NULL,
  planned_dt       TEXT,
  estimated_dt     TEXT,
  actual_dt        TEXT,
  evidence_doc_id  TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_milestone_event_shipment_unit
  ON milestone_event (shipment_unit_id);

CREATE INDEX IF NOT EXISTS idx_milestone_event_code
  ON milestone_event (milestone_code);

-- team_role_matrix: milestone × domain → owner/backup role mapping
CREATE TABLE IF NOT EXISTS team_role_matrix (
  milestone_range  TEXT NOT NULL,
  domain           TEXT NOT NULL,
  owner_role       TEXT NOT NULL,
  backup_role      TEXT,
  required_evidence TEXT,
  PRIMARY KEY (milestone_range, domain)
);

-- Seed the team role matrix from the implementation plan
INSERT OR REPLACE INTO team_role_matrix (milestone_range, domain, owner_role, backup_role, required_evidence) VALUES
  ('M80-M92',   'customs',   'Inbound Customs Documentation', 'Port/Field Gate Coordinator', 'BOE,DO,BL,MSDS,permit'),
  ('M100',      'port',      'Port/Field Gate Coordinator',   'Warehouse Execution Coordinator', 'DO,gate_pass,EIR'),
  ('M110-M121', 'warehouse', 'Warehouse Execution Coordinator', 'Site Logistics',             'WH_receipt,PL_DN_MTC'),
  ('M115-M117', 'marine',    'Marine Supervisor',             'Site Logistics',               'SR,load_manifest,sail_away_approval'),
  ('M130-M140', 'site',      'Site Receiving Coordinator',   'Material/Cost Review',          'delivery_note,MRR_MRI_POD_GRN_OSDR'),
  ('M160',      'cost',      'Material/Cost Review',          'Finance Approver',              'invoice,CostGuardResult,proof_artifact');
