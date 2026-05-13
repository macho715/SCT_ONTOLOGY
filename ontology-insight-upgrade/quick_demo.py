#!/usr/bin/env python3
"""
빠른 HVDC Gateway 데모 (Mock 서버 사용)
"""

from hvdc_gateway_client import (
    HVDCGatewayClient, MRRItem, Site, Status, UOM, TransportMode
)

def main():
    print("🧪 Quick HVDC Gateway Demo")
    print("=" * 40)

    # Mock 서버용 클라이언트
    client = HVDCGatewayClient(
        base_url="http://localhost:8080/v1",
        api_key="demo-key"
    )

    try:
        # 1. 헬스체크
        print("1. Health Check...")
        health = client.health_check()
        print(f"   ✅ Status: {health['status']}")

        # 2. MRR 드래프트
        print("\n2. MRR Draft...")
        items = [MRRItem(part_no="HVDC-TR-001", qty=2, status=Status.OK, uom=UOM.EA)]
        mrr = client.create_mrr_draft("PO-2025-001", Site.MIR, items)
        print(f"   ✅ Confidence: {mrr['confidence']:.2f}")

        # 3. ETA 예측
        print("\n3. ETA Prediction...")
        eta = client.predict_eta("Khalifa Port", "MIR substation", TransportMode.ROAD)
        print(f"   ✅ ETA: {eta.eta_utc.strftime('%Y-%m-%d %H:%M')}")
        print(f"   ✅ Risk: {eta.risk_level.value}")

        # 4. 비용 추정
        print("\n4. Cost Estimation...")
        cost = client.estimate_cost(1000, 500, 0.03, 0.06)
        print(f"   ✅ Cost: ${cost.estimated_cost:.4f}")
        print(f"   ✅ Band: {cost.band.value}")

        print("\n🎉 All tests passed!")
        return True

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    main()
