-- PR-1: indexes before seeding
CREATE INDEX IF NOT EXISTS idx_identifier_value
  ON identifier_index(identifier_value);

CREATE INDEX IF NOT EXISTS idx_identifier_type_value
  ON identifier_index(identifier_scheme, identifier_value);

CREATE INDEX IF NOT EXISTS idx_milestone_su_code
  ON milestone_event(shipment_unit_id, milestone_code);

CREATE INDEX IF NOT EXISTS idx_milestone_code
  ON milestone_event(milestone_code);
