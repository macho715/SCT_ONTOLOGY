---
type: community
cohesion: 0.23
members: 18
---

# write_hash_meta() · audit_ndjson_and_hash.py · verify_hash()

**Cohesion:** 0.23 - loosely connected
**Members:** 18 nodes

## Members
- [[Any_4]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[Append audit event to NDJSON file (atomic operation)      Args         event A]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[Calculate SHA-256 hash of file]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[Calculate and write hash metadata for audit file      Returns         Dict cont]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[Get statistics about audit log file]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[Path_5]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[Rotate audit log if it exceeds size limit     Creates backup with timestamp and]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[Sanitize sensitive information in audit events     Following OWASP logging guide]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[Verify audit file integrity against stored hash      Returns         Dict conta]] - rationale - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[append_event()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[audit_ndjson_and_hash.py]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[get_audit_stats()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[main()_2]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[rotate_audit_log()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[sanitize_event()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[sha256_of_file()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[verify_hash()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py
- [[write_hash_meta()]] - code - SCT_ONTOLOGY-main/ontology-insight-upgrade/audit_ndjson_and_hash.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/write_hash_meta__audit_ndjson_and_hashpy__verify_hash
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_write_audit() · hvdc_api.py · verify_audit_integrity()]]

## Top bridge nodes
- [[write_hash_meta()]] - degree 8, connects to 1 community