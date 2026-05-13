#!/usr/bin/env python3
"""
HVDC GPT Gateway Client v1.0.2
Samsung HVDC x MACHO-GPT Gateway API 통합 클라이언트
"""

import requests
import json
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import logging
from dataclasses import dataclass
from enum import Enum

# 설정
GATEWAY_BASE_URL = "https://api.hvdc-gateway.example.com/v1"
DEFAULT_API_KEY = "your-api-key-here"  # 환경변수 또는 설정파일에서 로드 권장

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Site(Enum):
    """HVDC 프로젝트 사이트"""
    MIR = "MIR"
    SHU = "SHU"
    DAS = "DAS"
    AGI = "AGI"

class UOM(Enum):
    """단위"""
    EA = "EA"
    BOX = "BOX"
    PAL = "PAL"

class Status(Enum):
    """아이템 상태"""
    OK = "OK"
    OSD = "OSD"  # Over, Short, Damage

class TransportMode(Enum):
    """운송 모드"""
    SEA = "SEA"
    ROAD = "ROAD"
    RORO = "RORO"

class RiskLevel(Enum):
    """위험도 레벨"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class CostBand(Enum):
    """CostGuard 밴드"""
    PASS = "PASS"
    WARN = "WARN"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

@dataclass
class MRRItem:
    """MRR 아이템"""
    part_no: str
    qty: float
    status: Status
    uom: Optional[UOM] = None
    remarks: Optional[str] = None

@dataclass
class EtaResult:
    """ETA 예측 결과"""
    eta_utc: datetime
    transit_hours: float
    risk_level: RiskLevel
    notes: Optional[str] = None

@dataclass
class CostEstimate:
    """비용 추정 결과"""
    estimated_cost: float
    band: CostBand
    thresholds: Dict[str, float]

class HVDCGatewayClient:
    """HVDC Gateway API 클라이언트"""

    def __init__(self, base_url: str = GATEWAY_BASE_URL, api_key: str = DEFAULT_API_KEY):
        self.base_url = base_url
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'X-API-Key': api_key,
            'Content-Type': 'application/json',
            'User-Agent': 'HVDC-Gateway-Client/1.0.2'
        })

    def health_check(self) -> Dict[str, Any]:
        """헬스체크 실행"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            response.raise_for_status()
            result = response.json()

            logger.info(f"✅ Gateway health: {result['status']} at {result['timestamp']}")
            return result

        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Health check failed: {str(e)}")
            raise

    def create_mrr_draft(self,
                        po_no: str,
                        site: Site,
                        items: List[MRRItem],
                        packing_list_text: Optional[str] = None) -> Dict[str, Any]:
        """MRR 드래프트 생성"""

        payload = {
            "po_no": po_no,
            "site": site.value,
            "items": [
                {
                    "part_no": item.part_no,
                    "qty": item.qty,
                    "status": item.status.value,
                    "uom": item.uom.value if item.uom else None,
                    "remarks": item.remarks
                }
                for item in items
            ]
        }

        if packing_list_text:
            payload["packing_list_text"] = packing_list_text

        try:
            response = self.session.post(f"{self.base_url}/mrr/draft", json=payload)
            response.raise_for_status()
            result = response.json()

            logger.info(f"✅ MRR draft created for PO {po_no}, confidence: {result['confidence']:.2f}")
            return result

        except requests.exceptions.RequestException as e:
            logger.error(f"❌ MRR draft creation failed: {str(e)}")
            raise

    def predict_eta(self,
                   origin: str,
                   destination: str,
                   mode: TransportMode,
                   departure_utc: Optional[datetime] = None) -> EtaResult:
        """ETA 예측"""

        payload = {
            "origin": origin,
            "destination": destination,
            "mode": mode.value
        }

        if departure_utc:
            payload["departure_utc"] = departure_utc.isoformat()

        try:
            response = self.session.post(f"{self.base_url}/predict/eta", json=payload)
            response.raise_for_status()
            result = response.json()

            eta_result = EtaResult(
                eta_utc=datetime.fromisoformat(result["eta_utc"].replace('Z', '+00:00')),
                transit_hours=result["transit_hours"],
                risk_level=RiskLevel(result["risk_level"]),
                notes=result.get("notes")
            )

            logger.info(f"✅ ETA predicted: {eta_result.eta_utc} ({eta_result.transit_hours}h, {eta_result.risk_level.value})")
            return eta_result

        except requests.exceptions.RequestException as e:
            logger.error(f"❌ ETA prediction failed: {str(e)}")
            raise

    def estimate_cost(self,
                     input_tokens: int,
                     output_tokens: int,
                     input_cost_per_1k: float,
                     output_cost_per_1k: float) -> CostEstimate:
        """CostGuard 비용 추정"""

        payload = {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "input_cost_per_1k": input_cost_per_1k,
            "output_cost_per_1k": output_cost_per_1k
        }

        try:
            response = self.session.post(f"{self.base_url}/costguard/estimate", json=payload)
            response.raise_for_status()
            result = response.json()

            cost_estimate = CostEstimate(
                estimated_cost=result["estimated_cost"],
                band=CostBand(result["band"]),
                thresholds=result.get("thresholds", {})
            )

            logger.info(f"✅ Cost estimated: ${cost_estimate.estimated_cost:.4f} ({cost_estimate.band.value})")
            return cost_estimate

        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Cost estimation failed: {str(e)}")
            raise

class HVDCGatewayIntegration:
    """HVDC Gateway와 로컬 시스템 통합"""

    def __init__(self, client: HVDCGatewayClient):
        self.client = client
        self.local_api_url = "http://localhost:5002"
        self.claude_bridge_url = "http://localhost:5003"

    def sync_mrr_with_local(self, po_no: str, site: Site, items: List[MRRItem]) -> Dict[str, Any]:
        """MRR을 Gateway와 로컬 시스템에 동기화"""

        # 1. Gateway에서 MRR 드래프트 생성
        gateway_result = self.client.create_mrr_draft(po_no, site, items)

        # 2. 로컬 감사 로그에 기록
        try:
            audit_payload = {
                "action": "mrr_sync",
                "actor": "gateway_integration",
                "case_id": po_no,
                "detail": {
                    "site": site.value,
                    "items_count": len(items),
                    "gateway_confidence": gateway_result["confidence"],
                    "warnings": gateway_result.get("warnings", [])
                },
                "risk_level": "HIGH" if gateway_result["confidence"] < 0.8 else "MEDIUM"
            }

            local_response = requests.post(
                f"{self.local_api_url}/audit/log",
                json=audit_payload,
                timeout=10
            )

            if local_response.status_code == 200:
                logger.info(f"✅ MRR sync logged locally for PO {po_no}")

        except Exception as e:
            logger.warning(f"⚠️ Local audit logging failed: {str(e)}")

        return {
            "gateway_result": gateway_result,
            "sync_status": "completed",
            "po_no": po_no,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    def enhanced_eta_prediction(self, origin: str, destination: str, mode: TransportMode) -> Dict[str, Any]:
        """Claude 브릿지와 통합된 향상된 ETA 예측"""

        # 1. Gateway에서 기본 ETA 예측
        eta_result = self.client.predict_eta(origin, destination, mode)

        # 2. Claude 브릿지를 통해 추가 정보 수집
        try:
            claude_payload = {
                "command": "weather-tie",
                "parameters": {
                    "origin": origin,
                    "destination": destination,
                    "mode": mode.value
                }
            }

            claude_response = requests.post(
                f"{self.claude_bridge_url}/claude/execute",
                json=claude_payload,
                timeout=15
            )

            if claude_response.status_code == 200:
                claude_result = claude_response.json()

                return {
                    "gateway_eta": {
                        "eta_utc": eta_result.eta_utc.isoformat(),
                        "transit_hours": eta_result.transit_hours,
                        "risk_level": eta_result.risk_level.value,
                        "notes": eta_result.notes
                    },
                    "claude_integration": claude_result.get("claude_integration", {}),
                    "enhanced_analysis": {
                        "web_search_suggestions": claude_result.get("claude_integration", {}).get("web_search_suggestions", []),
                        "recommended_actions": [
                            "Check real-time weather conditions",
                            "Verify port congestion status",
                            "Review alternative routes"
                        ]
                    },
                    "confidence_score": 0.95 if eta_result.risk_level == RiskLevel.LOW else 0.75
                }

        except Exception as e:
            logger.warning(f"⚠️ Claude integration failed: {str(e)}")

        # Fallback to gateway-only result
        return {
            "gateway_eta": {
                "eta_utc": eta_result.eta_utc.isoformat(),
                "transit_hours": eta_result.transit_hours,
                "risk_level": eta_result.risk_level.value,
                "notes": eta_result.notes
            },
            "claude_integration": None,
            "confidence_score": 0.80
        }

def main():
    """데모 실행"""
    print("🚀 HVDC Gateway Client Demo")
    print("=" * 50)

    # 클라이언트 초기화
    client = HVDCGatewayClient()
    integration = HVDCGatewayIntegration(client)

    try:
        # 1. 헬스체크
        print("1. Health Check...")
        health = client.health_check()
        print(f"   Status: {health['status']}")

        # 2. MRR 드래프트 생성 (예시)
        print("\n2. MRR Draft Creation...")
        sample_items = [
            MRRItem(part_no="HVDC-TR-001", qty=2, status=Status.OK, uom=UOM.EA),
            MRRItem(part_no="HVDC-CB-002", qty=1, status=Status.OSD, uom=UOM.BOX, remarks="Minor damage")
        ]

        mrr_result = integration.sync_mrr_with_local("PO-2025-001", Site.MIR, sample_items)
        print(f"   PO: {mrr_result['po_no']}, Status: {mrr_result['sync_status']}")

        # 3. ETA 예측
        print("\n3. Enhanced ETA Prediction...")
        eta_result = integration.enhanced_eta_prediction(
            "Khalifa Port",
            "MIR substation",
            TransportMode.ROAD
        )
        print(f"   ETA: {eta_result['gateway_eta']['eta_utc']}")
        print(f"   Risk: {eta_result['gateway_eta']['risk_level']}")
        print(f"   Confidence: {eta_result['confidence_score']:.2f}")

        # 4. 비용 추정
        print("\n4. Cost Estimation...")
        cost_result = client.estimate_cost(
            input_tokens=1000,
            output_tokens=500,
            input_cost_per_1k=0.03,
            output_cost_per_1k=0.06
        )
        print(f"   Cost: ${cost_result.estimated_cost:.4f}")
        print(f"   Band: {cost_result.band.value}")

        print("\n✅ Demo completed successfully!")

    except Exception as e:
        print(f"\n❌ Demo failed: {str(e)}")
        logger.exception("Demo execution failed")

if __name__ == "__main__":
    main()
