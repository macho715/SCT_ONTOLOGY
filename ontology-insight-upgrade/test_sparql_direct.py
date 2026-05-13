#!/usr/bin/env python3
"""
직접 SPARQL 쿼리 테스트
"""

import requests
import json

def test_high_risk_invoices():
    """고위험 인보이스 SPARQL 쿼리 직접 테스트"""

    sparql = """
PREFIX ex: <http://samsung.com/project-logistics#>
SELECT ?invoice ?invoiceNo ?riskType ?severity ?amount WHERE {
  GRAPH ?g {
    ?invoice a ex:Invoice ;
             ex:invoiceNumber ?invoiceNo .

    OPTIONAL { ?invoice ex:vatAmount ?vatAmount . }
    OPTIONAL { ?invoice ex:dutyAmount ?dutyAmount . }
    OPTIONAL { ?invoice ex:totalAmount ?totalAmount . }

    BIND(
      IF(!BOUND(?vatAmount), "MISSING_VAT",
      IF(!BOUND(?dutyAmount), "MISSING_DUTY",
      IF(?totalAmount < 0, "NEGATIVE_AMOUNT", "OTHER")))
      AS ?riskType
    )

    BIND(
      IF(?riskType = "NEGATIVE_AMOUNT", "CRITICAL",
      IF(?riskType IN ("MISSING_VAT", "MISSING_DUTY"), "HIGH", "MEDIUM"))
      AS ?severity
    )

    BIND(COALESCE(?totalAmount, 0) AS ?amount)
    FILTER(?riskType != "OTHER")
  }
} ORDER BY DESC(?severity) LIMIT 100
"""

    url = 'http://localhost:3030/hvdc/sparql'
    headers = {'Accept': 'application/sparql-results+json'}
    data = {'query': sparql}

    try:
        response = requests.post(url, data=data, headers=headers, timeout=10)
        if response.status_code == 200:
            result = response.json()
            bindings = result.get('results', {}).get('bindings', [])
            print(f"✅ 고위험 인보이스 {len(bindings)}개 발견:")
            for binding in bindings:
                invoice_no = binding['invoiceNo']['value']
                risk_type = binding['riskType']['value']
                severity = binding['severity']['value']
                amount = binding['amount']['value']
                print(f"   - {invoice_no}: {risk_type} ({severity}) - ${amount}")
            return len(bindings) > 0
        else:
            print(f"❌ 쿼리 실패: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"❌ 오류: {e}")
        return False

def test_hvdc_codes():
    """HVDC 코드 목록 SPARQL 쿼리 직접 테스트"""

    sparql = """
PREFIX ex: <http://samsung.com/project-logistics#>
SELECT DISTINCT ?code ?caseNumber ?status WHERE {
  GRAPH ?g {
    ?case a ex:Case ;
          ex:caseNumber ?caseNumber ;
          ex:status ?status .
    ?entity ex:belongsToCase ?case ;
            ex:hvdcCode ?code .
  }
} ORDER BY ?code LIMIT 200
"""

    url = 'http://localhost:3030/hvdc/sparql'
    headers = {'Accept': 'application/sparql-results+json'}
    data = {'query': sparql}

    try:
        response = requests.post(url, data=data, headers=headers, timeout=10)
        if response.status_code == 200:
            result = response.json()
            bindings = result.get('results', {}).get('bindings', [])
            print(f"✅ HVDC 코드 {len(bindings)}개 발견:")
            for binding in bindings:
                code = binding['code']['value']
                case_number = binding['caseNumber']['value']
                status = binding['status']['value']
                print(f"   - {code} (케이스: {case_number}, 상태: {status})")
            return len(bindings) > 0
        else:
            print(f"❌ 쿼리 실패: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"❌ 오류: {e}")
        return False

def test_simple_ask():
    """간단한 ASK 쿼리 테스트"""

    ask_query = """
PREFIX ex: <http://samsung.com/project-logistics#>
ASK WHERE {
  GRAPH ?g {
    ?invoice a ex:Invoice .
  }
}
"""

    url = 'http://localhost:3030/hvdc/sparql'
    headers = {'Accept': 'application/sparql-results+json'}
    data = {'query': ask_query}

    try:
        response = requests.post(url, data=data, headers=headers, timeout=10)
        if response.status_code == 200:
            result = response.json()
            has_invoices = result.get('boolean', False)
            print(f"🔍 인보이스 존재 여부: {'있음' if has_invoices else '없음'}")
            return has_invoices
        else:
            print(f"❌ ASK 쿼리 실패: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ASK 쿼리 오류: {e}")
        return False

if __name__ == "__main__":
    print("🔍 직접 SPARQL 쿼리 테스트")
    print("=" * 50)

    # 1. ASK 쿼리로 데이터 존재 확인
    print("1. 인보이스 데이터 존재 확인:")
    has_data = test_simple_ask()

    if has_data:
        # 2. 고위험 인보이스 조회
        print("\n2. 고위험 인보이스 조회:")
        test_high_risk_invoices()

        # 3. HVDC 코드 목록 조회
        print("\n3. HVDC 코드 목록 조회:")
        test_hvdc_codes()
    else:
        print("❌ 기본 데이터가 없어서 추가 테스트를 건너뜁니다.")
