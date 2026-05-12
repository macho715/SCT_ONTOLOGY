# HVDC OpenAI Logistics Agent

OpenAI Agents SDK를 사용하는 HVDC logistics control MVP입니다. OpenAI API 없이도 `--offline` 모드에서 동일한 rule engine을 직접 검증할 수 있습니다.

## 기능

| 기능 | 설명 |
|---|---|
| Any-key Search | BL, BOE, DO, Invoice, Container, HVDC_CODE, Package No.로 ShipmentUnit 조회 |
| Port Release Board | M90/M91/M92/M100/M130 기준 DO/BOE/SITE_RECEIPT 누락, DEM/DET risk 탐지 |
| COST-GUARD | InvoiceLine별 rate/standard/evidence delta 및 Human gate 판단 |
| AGI/DAS Gate | AGI/DAS cargo가 M115/M116/M117 없이 M130으로 닫히는 오류 차단 |
| Offline Report | `json`, `brief`, `csv` 출력 지원 |

## 설치

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
```

OpenAI API 사용 시:

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL="gpt-5.4-mini"
```

## 실행

Offline deterministic mode:

```bash
hvdc-agent BL-AUH-002 --offline --format brief
hvdc-agent BL-AUH-002 --offline --format json
hvdc-agent BL-AUH-002 --offline --format csv --output out.csv
```

OpenAI Agents SDK mode:

```bash
hvdc-agent "BL-AUH-002 현재 DEM/DET와 DO 리스크 요약"
```

## 테스트

```bash
python -m pytest -q
PYTHONPATH=src python -m compileall -q src tests
```

선택 게이트:

```bash
python -m pytest --cov=hvdc_openai_agent --cov-report=term-missing
ruff check src tests
```

## 데이터 스키마 요약

```json
{
  "shipment_id": "SHP-0002",
  "routing_pattern": "PORT_TO_MOSB_TO_SITE",
  "identifiers": {"BL": "BL-AUH-002", "HVDC_CODE": "HVDC-ADOPT-002-0002"},
  "milestones": [{"code": "M90", "occurred_at": "2026-05-01T06:00:00+00:00"}],
  "documents": [{"doc_type": "BOE", "ref": "BOE-8899"}],
  "invoice_lines": [{"line_id": "L1", "quantity": 1, "rate": "120000.00", "draft_amount": "120000.00"}]
}
```

## Fail-safe

- SDK 미설치: online mode는 명시 오류, offline mode는 정상 동작
- source/evidence 부재: `BLOCK` 또는 `ZERO` 성격의 결과 반환
- 100,000.00 AED 이상 또는 CRITICAL/BLOCK: Human/Finance gate required
- 내부 계약 단가·PII는 샘플에 포함하지 않음
