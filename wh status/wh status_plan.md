판정: **조건부 예 — 기존 `sct_ontology` MCP에 구현하면 됩니다. 신규 MCP는 불필요합니다.**
근거: 업로드 문서는 `SCT_ONTOLOGY`에 `CASE_NO` 조회 projection/함수만 추가하고, Raw Excel → TTL → D1 projection 구조를 권장합니다. 
다음행동: **`shipment_case`, `case_events`, `case_warehouse_stays`, `case_quality_findings` D1 table + `get_hvdc_case_status(case_no)` tool**부터 구현하십시오.

---

# ExecSummary

* 구현 방향은 **Excel 직접 조회가 아니라 `hvdc_wh_status.xlsx → TTL → D1 → MCP tool`**입니다.
* `hvdc_wh_status.xlsx`는 Raw Source, TTL은 Semantic Source, D1은 ChatGPT/MCP용 Query Projection입니다. 
* Master ontology 기준도 `Any-key → ShipmentUnit → route/document/customs/warehouse/site/cost/exception` trace 구조이므로, `CASE_NO`를 `ShipmentUnit` 조회 key로 붙이면 됩니다. 
* Cloudflare D1을 쓴다면 schema 변경은 migration SQL로 관리하고, Worker에서는 `env.DB.prepare(...).bind(...)` 방식으로 조회합니다. ([Cloudflare Docs][1])
* MCP tool은 `get_hvdc_case_status` 하나로 시작하고, 기존 `resolve_any_key`에는 `CASE_NO` scheme만 추가하는 구성이 가장 안전합니다.

---

# 1. 목표 아키텍처

```text
data/hvdc_wh_status.xlsx
  ↓ migrate_hvdc_status_v35_master_spine.py
hvdc_status_v35_master_spine.ttl
  ↓ ttl_to_d1_projection.py
SCT_ONTOLOGY D1 / SQLite
  ├─ shipment_case
  ├─ case_identifier
  ├─ case_events
  ├─ case_warehouse_stays
  └─ case_quality_findings
  ↓
sct_ontology MCP
  ├─ resolve_any_key(identifier_scheme="CASE_NO", value="190326")
  └─ get_hvdc_case_status(case_no="190326")
```

역할 분리는 이렇게 고정합니다.

|             Layer | 구현물                                        | 역할                                                          |
| ----------------: | ------------------------------------------ | ----------------------------------------------------------- |
|        Raw Source | `hvdc_wh_status.xlsx`                      | 원천 운영 데이터. 수정 금지                                            |
|   Semantic Source | `hvdc_status_v35_master_spine.ttl`         | ShipmentUnit, MilestoneEvent, SiteReceipt, MOSB evidence 생성 |
| Validation Source | `hvdc_status_v35_master_spine_issues.json` | M115/M116/M117 backfill gap, missing case, warning/amber finding                     |
|  Query Projection | D1 / SQLite                                | MCP 조회용 fast table                                          |
|          Human UI | Obsidian note                              | 선택. Case summary 저장소                                        |

---

# 2. DB Schema — D1 migration

Cloudflare D1 migration은 `.sql` 파일로 versioning하는 방식이 공식 문서 기준입니다. ([Cloudflare Docs][1])

파일:

```text
migrations/0001_case_projection.sql
```

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS migration_run (
  run_id              TEXT PRIMARY KEY,
  source_excel        TEXT,
  source_ttl          TEXT NOT NULL,
  source_issues_json  TEXT,
  source_hash         TEXT,
  case_count          INTEGER,
  created_at          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS shipment_case (
  case_no             TEXT PRIMARY KEY,
  shipment_unit_uri   TEXT NOT NULL,
  routing_pattern     TEXT,
  current_stage       TEXT,
  site_code           TEXT,
  vendor_name         TEXT,
  package_no          TEXT,
  po_no               TEXT,
  gross_weight_kg     REAL,
  volume_cbm          REAL,
  source_hash         TEXT,
  updated_at          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS case_identifier (
  identifier_scheme   TEXT NOT NULL,
  normalized_value    TEXT NOT NULL,
  case_no             TEXT NOT NULL,
  target_uri          TEXT,
  confidence_score    REAL DEFAULT 1.00,
  source_system       TEXT,
  PRIMARY KEY (identifier_scheme, normalized_value),
  FOREIGN KEY (case_no) REFERENCES shipment_case(case_no) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS case_events (
  event_id            TEXT PRIMARY KEY,
  case_no             TEXT NOT NULL,
  milestone_code      TEXT NOT NULL,
  milestone_name      TEXT,
  journey_stage       TEXT,
  planned_dt          TEXT,
  estimated_dt        TEXT,
  actual_dt           TEXT,
  event_location      TEXT,
  source_uri          TEXT,
  evidence_doc_uri    TEXT,
  FOREIGN KEY (case_no) REFERENCES shipment_case(case_no) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS case_warehouse_stays (
  stay_id             TEXT PRIMARY KEY,
  case_no             TEXT NOT NULL,
  warehouse_id        TEXT,
  received_dt         TEXT,
  putaway_dt          TEXT,
  dispatched_dt       TEXT,
  dwell_days          REAL,
  open_flag           INTEGER DEFAULT 0,
  dwell_risk_band     TEXT,
  FOREIGN KEY (case_no) REFERENCES shipment_case(case_no) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS case_quality_findings (
  finding_id          TEXT PRIMARY KEY,
  case_no             TEXT,
  severity            TEXT NOT NULL,
  rule_id             TEXT NOT NULL,
  message             TEXT NOT NULL,
  evidence_uri        TEXT,
  created_at          TEXT NOT NULL,
  FOREIGN KEY (case_no) REFERENCES shipment_case(case_no) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_case_identifier_case
  ON case_identifier(case_no);

CREATE INDEX IF NOT EXISTS idx_case_events_case_milestone
  ON case_events(case_no, milestone_code);

CREATE INDEX IF NOT EXISTS idx_case_events_actual
  ON case_events(actual_dt);

CREATE INDEX IF NOT EXISTS idx_case_wh_stays_case
  ON case_warehouse_stays(case_no);

CREATE INDEX IF NOT EXISTS idx_case_quality_case
  ON case_quality_findings(case_no, severity);
```

실행:

```bash
npx wrangler d1 migrations create sct_ontology_db case_projection
npx wrangler d1 migrations apply sct_ontology_db --local
npx wrangler d1 migrations apply sct_ontology_db --remote
```

---

# 3. TTL → D1 projection script

파일:

```text
scripts/ttl_to_d1_projection.py
```

> 가정: 실제 TTL predicate 이름은 프로젝트 TTL과 다를 수 있습니다. 아래 `PREDICATE_MAP`만 실제 TTL vocabulary에 맞게 수정하면 됩니다.

```python
from __future__ import annotations

import hashlib
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from rdflib import Graph, Namespace, URIRef


HVDC = Namespace("http://samsung.com/project-logistics#")

PREDICATE_MAP = {
    "case_no": HVDC.caseNo,
    "shipment_unit": HVDC.ShipmentUnit,
    "routing_pattern": HVDC.hasRoutingPattern,
    "current_stage": HVDC.hasCurrentStage,
    "site_code": HVDC.siteCode,
    "vendor_name": HVDC.vendorName,
    "package_no": HVDC.packageNo,
    "po_no": HVDC.poNo,
    "gross_weight_kg": HVDC.grossWeightKg,
    "volume_cbm": HVDC.volumeCbm,
    "has_milestone": HVDC.hasMilestone,
    "milestone_code": HVDC.milestoneCode,
    "milestone_name": HVDC.milestoneName,
    "journey_stage": HVDC.journeyStage,
    "planned_dt": HVDC.plannedDt,
    "estimated_dt": HVDC.estimatedDt,
    "actual_dt": HVDC.actualDt,
    "event_location": HVDC.eventLocation,
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def first_literal(g: Graph, subject: URIRef, predicate: URIRef) -> str | None:
    value = next(g.objects(subject, predicate), None)
    return str(value) if value is not None else None


def upsert_case(conn: sqlite3.Connection, row: dict[str, Any]) -> None:
    conn.execute(
        """
        INSERT INTO shipment_case (
          case_no, shipment_unit_uri, routing_pattern, current_stage, site_code,
          vendor_name, package_no, po_no, gross_weight_kg, volume_cbm,
          source_hash, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(case_no) DO UPDATE SET
          shipment_unit_uri=excluded.shipment_unit_uri,
          routing_pattern=excluded.routing_pattern,
          current_stage=excluded.current_stage,
          site_code=excluded.site_code,
          vendor_name=excluded.vendor_name,
          package_no=excluded.package_no,
          po_no=excluded.po_no,
          gross_weight_kg=excluded.gross_weight_kg,
          volume_cbm=excluded.volume_cbm,
          source_hash=excluded.source_hash,
          updated_at=excluded.updated_at
        """,
        (
            row["case_no"],
            row["shipment_unit_uri"],
            row.get("routing_pattern"),
            row.get("current_stage"),
            row.get("site_code"),
            row.get("vendor_name"),
            row.get("package_no"),
            row.get("po_no"),
            row.get("gross_weight_kg"),
            row.get("volume_cbm"),
            row.get("source_hash"),
            row["updated_at"],
        ),
    )


def upsert_identifier(conn: sqlite3.Connection, scheme: str, value: str, case_no: str, uri: str) -> None:
    conn.execute(
        """
        INSERT INTO case_identifier (
          identifier_scheme, normalized_value, case_no, target_uri, confidence_score, source_system
        )
        VALUES (?, ?, ?, ?, 1.00, 'TTL_PROJECTION')
        ON CONFLICT(identifier_scheme, normalized_value) DO UPDATE SET
          case_no=excluded.case_no,
          target_uri=excluded.target_uri,
          confidence_score=excluded.confidence_score,
          source_system=excluded.source_system
        """,
        (scheme, value.strip().upper(), case_no, uri),
    )


def insert_event(conn: sqlite3.Connection, row: dict[str, Any]) -> None:
    event_key = "|".join([
        row["case_no"],
        row["milestone_code"],
        row.get("actual_dt") or row.get("planned_dt") or row.get("estimated_dt") or "",
        row.get("source_uri") or "",
    ])
    event_id = hashlib.sha256(event_key.encode()).hexdigest()

    conn.execute(
        """
        INSERT OR REPLACE INTO case_events (
          event_id, case_no, milestone_code, milestone_name, journey_stage,
          planned_dt, estimated_dt, actual_dt, event_location, source_uri, evidence_doc_uri
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            event_id,
            row["case_no"],
            row["milestone_code"],
            row.get("milestone_name"),
            row.get("journey_stage"),
            row.get("planned_dt"),
            row.get("estimated_dt"),
            row.get("actual_dt"),
            row.get("event_location"),
            row.get("source_uri"),
            row.get("evidence_doc_uri"),
        ),
    )


def recompute_warehouse_stays(conn: sqlite3.Connection) -> None:
    conn.execute("DELETE FROM case_warehouse_stays")

    rows = conn.execute(
        """
        SELECT
          c.case_no,
          MAX(CASE WHEN e.milestone_code = 'M110' THEN e.actual_dt END) AS received_dt,
          MAX(CASE WHEN e.milestone_code = 'M111' THEN e.actual_dt END) AS putaway_dt,
          MAX(CASE WHEN e.milestone_code = 'M121' THEN e.actual_dt END) AS dispatched_dt
        FROM shipment_case c
        LEFT JOIN case_events e ON e.case_no = c.case_no
        GROUP BY c.case_no
        """
    ).fetchall()

    for case_no, received_dt, putaway_dt, dispatched_dt in rows:
        if not received_dt:
            continue

        # SQLite에서 dwell_days 계산. 미출고 건은 현재 시각 기준 open stay.
        dwell = conn.execute(
            """
            SELECT ROUND(
              julianday(COALESCE(?, datetime('now'))) - julianday(?),
              2
            )
            """,
            (dispatched_dt, received_dt),
        ).fetchone()[0]

        # 가정: 7.00일 이하 PASS, 14.00일 이하 WARN, 초과 HIGH.
        if dwell is None:
            risk = "UNKNOWN"
        elif dwell <= 7.00:
            risk = "PASS"
        elif dwell <= 14.00:
            risk = "WARN"
        else:
            risk = "HIGH"

        stay_id = hashlib.sha256(f"{case_no}|{received_dt}|{dispatched_dt}".encode()).hexdigest()

        conn.execute(
            """
            INSERT INTO case_warehouse_stays (
              stay_id, case_no, received_dt, putaway_dt, dispatched_dt,
              dwell_days, open_flag, dwell_risk_band
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                stay_id,
                case_no,
                received_dt,
                putaway_dt,
                dispatched_dt,
                dwell,
                1 if dispatched_dt is None else 0,
                risk,
            ),
        )


def load_issues(conn: sqlite3.Connection, issues_path: Path) -> None:
    if not issues_path.exists():
        return

    issues = json.loads(issues_path.read_text(encoding="utf-8"))
    if isinstance(issues, dict):
        issues = issues.get("issues", [])

    for item in issues:
        case_no = str(item.get("case_no") or item.get("caseNo") or "").strip()
        rule_id = str(item.get("rule_id") or item.get("ruleId") or "UNKNOWN_RULE")
        severity = str(item.get("severity") or "WARNING").upper()
        message = str(item.get("message") or "")
        evidence_uri = item.get("evidence_uri") or item.get("evidenceUri")

        finding_id = hashlib.sha256(f"{case_no}|{rule_id}|{message}".encode()).hexdigest()

        conn.execute(
            """
            INSERT OR REPLACE INTO case_quality_findings (
              finding_id, case_no, severity, rule_id, message, evidence_uri, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (finding_id, case_no or None, severity, rule_id, message, evidence_uri, now_iso()),
        )


def project_ttl_to_sqlite(ttl_path: Path, issues_path: Path, db_path: Path) -> None:
    g = Graph()
    g.parse(ttl_path, format="turtle")

    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON")

    source_hash = sha256_file(ttl_path)
    updated_at = now_iso()

    for shipment_unit in g.subjects(predicate=None, object=PREDICATE_MAP["shipment_unit"]):
        case_no = first_literal(g, shipment_unit, PREDICATE_MAP["case_no"])
        if not case_no:
            continue

        case_no_norm = case_no.strip().upper()

        case_row = {
            "case_no": case_no_norm,
            "shipment_unit_uri": str(shipment_unit),
            "routing_pattern": first_literal(g, shipment_unit, PREDICATE_MAP["routing_pattern"]),
            "current_stage": first_literal(g, shipment_unit, PREDICATE_MAP["current_stage"]),
            "site_code": first_literal(g, shipment_unit, PREDICATE_MAP["site_code"]),
            "vendor_name": first_literal(g, shipment_unit, PREDICATE_MAP["vendor_name"]),
            "package_no": first_literal(g, shipment_unit, PREDICATE_MAP["package_no"]),
            "po_no": first_literal(g, shipment_unit, PREDICATE_MAP["po_no"]),
            "gross_weight_kg": first_literal(g, shipment_unit, PREDICATE_MAP["gross_weight_kg"]),
            "volume_cbm": first_literal(g, shipment_unit, PREDICATE_MAP["volume_cbm"]),
            "source_hash": source_hash,
            "updated_at": updated_at,
        }
        upsert_case(conn, case_row)
        upsert_identifier(conn, "CASE_NO", case_no_norm, case_no_norm, str(shipment_unit))

        for milestone in g.objects(shipment_unit, PREDICATE_MAP["has_milestone"]):
            milestone_code = first_literal(g, milestone, PREDICATE_MAP["milestone_code"])
            if not milestone_code:
                continue

            insert_event(conn, {
                "case_no": case_no_norm,
                "milestone_code": milestone_code,
                "milestone_name": first_literal(g, milestone, PREDICATE_MAP["milestone_name"]),
                "journey_stage": first_literal(g, milestone, PREDICATE_MAP["journey_stage"]),
                "planned_dt": first_literal(g, milestone, PREDICATE_MAP["planned_dt"]),
                "estimated_dt": first_literal(g, milestone, PREDICATE_MAP["estimated_dt"]),
                "actual_dt": first_literal(g, milestone, PREDICATE_MAP["actual_dt"]),
                "event_location": first_literal(g, milestone, PREDICATE_MAP["event_location"]),
                "source_uri": str(milestone),
            })

    recompute_warehouse_stays(conn)
    load_issues(conn, issues_path)

    case_count = conn.execute("SELECT COUNT(*) FROM shipment_case").fetchone()[0]
    conn.execute(
        """
        INSERT OR REPLACE INTO migration_run (
          run_id, source_excel, source_ttl, source_issues_json,
          source_hash, case_count, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            hashlib.sha256(f"{ttl_path}|{source_hash}".encode()).hexdigest(),
            "data/hvdc_wh_status.xlsx",
            str(ttl_path),
            str(issues_path),
            source_hash,
            case_count,
            updated_at,
        ),
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    project_ttl_to_sqlite(
        ttl_path=Path("data/hvdc_status_v35_master_spine.ttl"),
        issues_path=Path("data/hvdc_status_v35_master_spine_issues.json"),
        db_path=Path("local_sct_ontology.db"),
    )
```

설치:

```bash
python -m venv .venv
source .venv/bin/activate
pip install rdflib
python scripts/ttl_to_d1_projection.py
```

---

# 4. D1로 적재

로컬 SQLite에서 D1로 옮기는 방식은 2개입니다.

| Option | 방식                                                       | 판정                         |
| -----: | -------------------------------------------------------- | -------------------------- |
|      A | Python이 `seed_projection.sql` 생성 후 `wrangler d1 execute` | 추천                         |
|      B | Worker API로 batch insert                                 | 대량 적재 시 관리 복잡              |
|      C | Excel 직접 D1 insert                                       | 비추천. TTL semantic 결과 누락 가능 |

권장 명령:

```bash
sqlite3 local_sct_ontology.db .dump > seed_projection.sql

npx wrangler d1 execute sct_ontology_db \
  --local \
  --file=seed_projection.sql

npx wrangler d1 execute sct_ontology_db \
  --remote \
  --file=seed_projection.sql
```

---

# 5. 조회 함수 — `get_hvdc_case_status`

Cloudflare Worker에서 D1은 `env.DB` binding으로 접근하며, query는 `prepare()` 후 `bind()`로 parameter를 묶는 방식입니다. ([Cloudflare Docs][2])

파일:

```text
src/services/case-status.ts
```

```ts
export interface Env {
  DB: D1Database;
}

export type CaseStatusResult = {
  case_no: string;
  shipment: Record<string, unknown>;
  events: Record<string, unknown>[];
  warehouse_stays: Record<string, unknown>[];
  quality_findings: Record<string, unknown>[];
  gates: {
    agi_das_mosb_gate: "PASS" | "WARN" | "AMBER" | "NOT_APPLICABLE";
    has_m110: boolean;
    has_m115: boolean;
    has_m130: boolean;
  };
};

function normalizeCaseNo(caseNo: string): string {
  return caseNo.trim().toUpperCase();
}

export async function getHvdcCaseStatus(
  env: Env,
  caseNo: string
): Promise<CaseStatusResult> {
  const normalized = normalizeCaseNo(caseNo);

  const shipment = await env.DB.prepare(
    `
    SELECT *
    FROM shipment_case
    WHERE case_no = ?
    `
  ).bind(normalized).first();

  if (!shipment) {
    throw new Error(`CASE_NOT_FOUND: ${normalized}`);
  }

  const eventsResult = await env.DB.prepare(
    `
    SELECT *
    FROM case_events
    WHERE case_no = ?
    ORDER BY
      COALESCE(actual_dt, estimated_dt, planned_dt),
      milestone_code
    `
  ).bind(normalized).all();

  const staysResult = await env.DB.prepare(
    `
    SELECT *
    FROM case_warehouse_stays
    WHERE case_no = ?
    ORDER BY received_dt
    `
  ).bind(normalized).all();

  const findingsResult = await env.DB.prepare(
    `
    SELECT *
    FROM case_quality_findings
    WHERE case_no = ?
    ORDER BY
      CASE severity
        WHEN 'AMBER' THEN 1
        WHEN 'CRITICAL' THEN 2
        WHEN 'WARN' THEN 2
        ELSE 4
      END,
      created_at DESC
    `
  ).bind(normalized).all();

  const gate = await env.DB.prepare(
    `
    WITH m AS (
      SELECT
        case_no,
        MAX(CASE WHEN milestone_code = 'M110' THEN actual_dt END) AS m110_dt,
        MAX(CASE WHEN milestone_code = 'M115' THEN actual_dt END) AS m115_dt,
        MAX(CASE WHEN milestone_code = 'M130' THEN actual_dt END) AS m130_dt
      FROM case_events
      WHERE case_no = ?
      GROUP BY case_no
    )
    SELECT
      CASE
        WHEN s.site_code IN ('AGI', 'DAS')
         AND s.routing_pattern IN ('MOSB_DIRECT', 'WH_MOSB', 'MIXED')
         AND m.m130_dt IS NOT NULL
         AND m.m115_dt IS NULL
        THEN 'AMBER'
        WHEN s.site_code IN ('AGI', 'DAS')
         AND s.routing_pattern IN ('MOSB_DIRECT', 'WH_MOSB', 'MIXED')
        THEN 'PASS'
        ELSE 'NOT_APPLICABLE'
      END AS agi_das_mosb_gate,
      CASE WHEN m.m110_dt IS NOT NULL THEN 1 ELSE 0 END AS has_m110,
      CASE WHEN m.m115_dt IS NOT NULL THEN 1 ELSE 0 END AS has_m115,
      CASE WHEN m.m130_dt IS NOT NULL THEN 1 ELSE 0 END AS has_m130
    FROM shipment_case s
    LEFT JOIN m ON m.case_no = s.case_no
    WHERE s.case_no = ?
    `
  ).bind(normalized, normalized).first();

  return {
    case_no: normalized,
    shipment,
    events: eventsResult.results ?? [],
    warehouse_stays: staysResult.results ?? [],
    quality_findings: findingsResult.results ?? [],
    gates: {
      agi_das_mosb_gate: String(gate?.agi_das_mosb_gate ?? "NOT_APPLICABLE") as
        | "PASS"
        | "WARN"
        | "AMBER"
        | "NOT_APPLICABLE",
      has_m110: Boolean(gate?.has_m110),
      has_m115: Boolean(gate?.has_m115),
      has_m130: Boolean(gate?.has_m130),
    },
  };
}
```

---

# 6. MCP tool 등록

MCP는 server가 tool을 노출하고, 각 tool은 name과 schema를 갖는 구조입니다. 공식 spec도 tool이 database query/API call/computation 같은 외부 작업을 수행할 수 있다고 설명합니다. ([Model Context Protocol][3])

파일:

```text
src/tools/get-hvdc-case-status.ts
```

```ts
import * as z from "zod/v4";
import { getHvdcCaseStatus, Env } from "../services/case-status";

export function registerGetHvdcCaseStatusTool(server: any, env: Env) {
  server.registerTool(
    "get_hvdc_case_status",
    {
      description:
        "Return HVDC warehouse/case status by Case No, including milestones, warehouse dwell, quality findings, and AGI/DAS MOSB gate.",
      inputSchema: z.object({
        case_no: z.string().min(1).describe("HVDC Case No. Example: 190326"),
      }),
    },
    async ({ case_no }: { case_no: string }) => {
      const result = await getHvdcCaseStatus(env, case_no);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
```

SDK는 2026-03-30 기준 `v1.29.00` release가 보이고, 공식 README는 `registerTool` 예시를 제공합니다. 실제 repo가 v1 구성을 쓰고 있으면 package/API import만 현재 repo 방식에 맞추면 됩니다. ([GitHub][4])

---

# 7. 기존 `resolve_any_key` 확장

`CASE_NO`를 기존 Any-key resolver에 추가합니다.

```ts
export async function resolveAnyKey(
  env: Env,
  identifierScheme: string,
  value: string
) {
  const scheme = identifierScheme.trim().toUpperCase();
  const normalizedValue = value.trim().toUpperCase();

  const row = await env.DB.prepare(
    `
    SELECT
      i.identifier_scheme,
      i.normalized_value,
      i.case_no,
      i.target_uri,
      i.confidence_score,
      c.shipment_unit_uri,
      c.routing_pattern,
      c.current_stage,
      c.site_code
    FROM case_identifier i
    JOIN shipment_case c ON c.case_no = i.case_no
    WHERE i.identifier_scheme = ?
      AND i.normalized_value = ?
    `
  ).bind(scheme, normalizedValue).first();

  if (!row) {
    return {
      matched: false,
      identifier_scheme: scheme,
      normalized_value: normalizedValue,
      reason: "NO_MATCH",
    };
  }

  return {
    matched: true,
    ...row,
  };
}
```

초기 등록 data:

```sql
INSERT OR REPLACE INTO case_identifier
(identifier_scheme, normalized_value, case_no, target_uri, confidence_score, source_system)
SELECT
  'CASE_NO',
  UPPER(case_no),
  case_no,
  shipment_unit_uri,
  1.00,
  'TTL_PROJECTION'
FROM shipment_case;
```

---

# 8. 검증 Query

## 8.1 Case count 검증

문서 기준 boundary는 `Case No.` 기준 7,566개 ShipmentUnit입니다. 

```sql
SELECT COUNT(*) AS case_count
FROM shipment_case;
```

기대값:

```text
case_count = 7566
```

## 8.2 CASE_NO identifier coverage

```sql
SELECT
  COUNT(*) AS total_case,
  SUM(CASE WHEN i.case_no IS NOT NULL THEN 1 ELSE 0 END) AS case_no_identifier_count,
  ROUND(
    SUM(CASE WHEN i.case_no IS NOT NULL THEN 1 ELSE 0 END) * 100.00 / COUNT(*),
    2
  ) AS coverage_pct
FROM shipment_case c
LEFT JOIN case_identifier i
  ON i.case_no = c.case_no
 AND i.identifier_scheme = 'CASE_NO';
```

기준:

```text
coverage_pct = 100.00
```

## 8.3 AGI/DAS M115 gap 검증

현재 정책은 AGI/DAS site arrival 또는 M130 site date를 배송 완료 evidence로 인정하고, MOSB/LCT chain evidence 누락은 gate 차단이 아니라 `MOSB_EVIDENCE_MISSING` AMBER/WARN backfill finding으로 처리합니다. 

```sql
WITH m AS (
  SELECT
    case_no,
    MAX(CASE WHEN milestone_code = 'M115' THEN actual_dt END) AS m115_dt,
    MAX(CASE WHEN milestone_code = 'M130' THEN actual_dt END) AS m130_dt
  FROM case_events
  GROUP BY case_no
)
SELECT
  s.case_no,
  s.site_code,
  s.routing_pattern,
  m.m115_dt,
  m.m130_dt
FROM shipment_case s
JOIN m ON m.case_no = s.case_no
WHERE s.site_code IN ('AGI', 'DAS')
  AND s.routing_pattern IN ('MOSB_DIRECT', 'WH_MOSB', 'MIXED')
  AND m.m130_dt IS NOT NULL
  AND m.m115_dt IS NULL;
```

결과가 있으면 `case_quality_findings`에 `MOSB_EVIDENCE_MISSING` rule로 `AMBER` 또는 `WARN`을 write하고, M130/SiteReceipt delivery는 유지합니다.

---

# 9. API 응답 포맷

`get_hvdc_case_status("190326")` 응답은 아래 JSON으로 고정합니다.

```json
{
  "case_no": "190326",
  "shipment": {
    "shipment_unit_uri": "urn:hvdc:shipment-unit:190326",
    "routing_pattern": "WH_MOSB",
    "current_stage": "WH_STORAGE",
    "site_code": "AGI",
    "vendor_name": "MASKED_OR_VENDOR",
    "gross_weight_kg": 1200.00,
    "volume_cbm": 4.25
  },
  "events": [
    {
      "milestone_code": "M110",
      "milestone_name": "Warehouse Received",
      "actual_dt": "2026-02-01T10:00:00+04:00"
    }
  ],
  "warehouse_stays": [
    {
      "received_dt": "2026-02-01T10:00:00+04:00",
      "dispatched_dt": null,
      "dwell_days": 12.00,
      "open_flag": 1,
      "dwell_risk_band": "WARN"
    }
  ],
  "quality_findings": [],
  "gates": {
    "agi_das_mosb_gate": "PASS",
    "has_m110": true,
    "has_m115": true,
    "has_m130": false
  }
}
```

---

# 10. 운영 절차

| Step | 실행                             | Pass 기준                |
| ---: | ------------------------------ | ---------------------- |
|    1 | `hvdc_wh_status.xlsx` 원본 동결    | raw 수정 0.00건           |
|    2 | Excel → TTL 재생성                | `Case No.` 7,566건 생성   |
|    3 | TTL → D1 projection            | `shipment_case` 7,566건 |
|    4 | issues JSON 적재                 | finding 누락 0.00건       |
|    5 | `resolve_any_key(CASE_NO)` 테스트 | match rate 100.00%     |
|    6 | `get_hvdc_case_status` 테스트     | p95 < 5.00s            |
|    7 | AGI/DAS M115/M116/M117 gap query | AMBER/WARN backfill 자동 표시 |
|    8 | Obsidian note 생성               | 선택사항                   |

---

# 11. Fail-safe / Human-gate

MCP spec도 tool invocation에는 human-in-the-loop가 있어야 한다고 명시합니다. ([Model Context Protocol][3])

따라서 아래는 자동 mutation 금지입니다.

|                            상황 | MCP 처리                           |
| ----------------------------: | -------------------------------- |
|                  `case_no` 없음 | `CASE_NOT_FOUND`                 |
|            `CASE_NO` 중복 match | `AMBIGUOUS_IDENTIFIER`           |
| AGI/DAS `M130`/site date 있음 + `M115/M116/M117` 없음 | `MOSB_EVIDENCE_MISSING` AMBER/WARN backfill |
|              Dwell days 계산 불가 | `WARNING_DWELL_UNKNOWN`          |
|            TTL source hash 변경 | projection 재생성 전까지 stale warning |
| Raw Excel과 TTL case count 불일치 | ZERO: projection publish 중단      |

---

# CmdRec

```text
/logi-master data-spine --validate RAW_EXCEL_TO_TTL_TO_D1
/logi-master report --deep MCP_CASE_STATUS_TOOL
/logi-master predict --fast CASE_DWELL_RISK
```

[1]: https://developers.cloudflare.com/d1/reference/migrations/ "Migrations · Cloudflare D1 docs"
[2]: https://developers.cloudflare.com/d1/worker-api/d1-database/ "D1 Database · Cloudflare D1 docs"
[3]: https://modelcontextprotocol.io/specification/2025-11-25/server/tools "Tools - Model Context Protocol"
[4]: https://github.com/modelcontextprotocol/typescript-sdk "GitHub - modelcontextprotocol/typescript-sdk: The official TypeScript SDK for Model Context Protocol servers and clients · GitHub"
