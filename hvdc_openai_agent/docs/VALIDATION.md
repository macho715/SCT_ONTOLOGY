# Validation Pack

## 검증 목표

- Any-key lookup: BL/BOE/DO/Invoice/Container/HVDC_CODE/Package 기준 `ShipmentUnit` 해석
- Port release: M90/M91/M92/M100/M130 문서·DEM/DET·Gate closure risk
- COST-GUARD: line-level standard/rate/evidence variance 및 Human gate
- Fail-safe: SDK 미설치·키 미설정 시 offline deterministic mode로 검증 가능

## 로컬 게이트

```bash
python -m pytest -q
PYTHONPATH=src python -m compileall -q src tests
PYTHONPATH=src python -m hvdc_openai_agent.agent_app BL-AUH-002 --offline --format brief
```

## 운영 Human Gate

다음 조건은 자동 확정 금지입니다.

- invoice exposure 또는 line amount `>= 100,000.00 AED`
- COST-GUARD severity `CRITICAL` 또는 `BLOCK`
- AGI/DAS cargo가 M115/M116/M117 없이 M130 도달
- DO/BOE/SITE_RECEIPT 증빙 누락

## ZERO 기준

- tariff/rate/evidence source가 없는데 비용 판단이 필요한 경우
- HS/UAE customs/regulatory 판단이 필요한데 근거 문서가 없는 경우
- OOG/lifting/stowage/safety 판단이 필요한데 dimension/weight/COG/lashing evidence가 없는 경우
