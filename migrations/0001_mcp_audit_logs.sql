CREATE TABLE IF NOT EXISTS mcp_audit_logs (
  id TEXT PRIMARY KEY,
  tool_name TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  output_hash TEXT NOT NULL,
  pii_masked INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mcp_audit_logs_created_at
  ON mcp_audit_logs (created_at);

CREATE INDEX IF NOT EXISTS idx_mcp_audit_logs_tool_name
  ON mcp_audit_logs (tool_name);
