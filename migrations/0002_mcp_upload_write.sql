CREATE TABLE IF NOT EXISTS mcp_upload_tokens (
  upload_id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL,
  object_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  max_bytes INTEGER NOT NULL,
  purpose TEXT NOT NULL,
  approval_ref TEXT NOT NULL,
  approved_by_role TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mcp_uploaded_files (
  upload_id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  byte_length INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mcp_file_attachments (
  attachment_id TEXT PRIMARY KEY,
  upload_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_ref TEXT NOT NULL,
  evidence_note TEXT NOT NULL,
  approval_ref TEXT NOT NULL,
  approved_by_role TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mcp_write_proposals (
  proposal_id TEXT PRIMARY KEY,
  target_path TEXT NOT NULL,
  proposed_object_key TEXT NOT NULL,
  target_object_key TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  base_content_hash TEXT,
  change_reason TEXT NOT NULL,
  approval_ref TEXT NOT NULL,
  approved_by_role TEXT NOT NULL,
  status TEXT NOT NULL,
  commit_id TEXT,
  commit_reason TEXT,
  created_at TEXT NOT NULL,
  committed_at TEXT
);
