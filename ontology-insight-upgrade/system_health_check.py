#!/usr/bin/env python3
"""
HVDC 시스템 헬스체크 - MACHO-GPT v3.6-APEX 표준
전체 시스템 상태 점검 및 성능 메트릭 수집
"""

import sys
import os
import subprocess
import json
import time
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List
import pandas as pd

def print_section(title: str, emoji: str = "📍"):
    """섹션 헤더 출력"""
    print(f"\n{emoji} {title}")
    print("-" * 50)

def check_python_environment() -> Dict[str, Any]:
    """Python 환경 검사"""
    try:
        python_version = sys.version.split()[0]

        # 필수 패키지 체크
        required_packages = {
            'flask': 'Flask',
            'pandas': 'pandas',
            'requests': 'requests',
            'pytest': 'pytest'
        }

        package_status = {}
        for pkg_name, import_name in required_packages.items():
            try:
                __import__(import_name.lower())
                package_status[pkg_name] = "OK"
            except ImportError:
                package_status[pkg_name] = "MISSING"

        return {
            'status': 'OK',
            'version': python_version,
            'path': sys.executable,
            'packages': package_status
        }
    except Exception as e:
        return {'status': 'ERROR', 'error': str(e)}

def check_hvdc_files() -> Dict[str, Any]:
    """HVDC 핵심 파일 존재 및 무결성 검사"""
    core_files = [
        'hvdc_api.py',
        'hvdc_rules.py',
        'audit_logger.py',
        'hvdc_one_line.py',
        'hvdc-integration-demo.py'
    ]

    file_status = {}
    for file_path in core_files:
        path = Path(file_path)
        if path.exists():
            try:
                size = path.stat().st_size
                mtime = datetime.fromtimestamp(path.stat().st_mtime).isoformat()
                file_status[file_path] = {
                    'status': 'OK',
                    'size_bytes': size,
                    'last_modified': mtime
                }
            except Exception as e:
                file_status[file_path] = {'status': 'ERROR', 'error': str(e)}
        else:
            file_status[file_path] = {'status': 'MISSING'}

    missing_count = sum(1 for f in file_status.values() if f['status'] == 'MISSING')
    overall_status = 'OK' if missing_count == 0 else 'WARNING' if missing_count <= 1 else 'CRITICAL'

    return {
        'status': overall_status,
        'files': file_status,
        'missing_count': missing_count
    }

def check_api_server() -> Dict[str, Any]:
    """HVDC API 서버 상태 검사"""
    api_url = "http://localhost:5002"

    try:
        # 헬스체크 엔드포인트 테스트
        start_time = time.time()
        response = requests.get(f"{api_url}/health", timeout=5)
        response_time = (time.time() - start_time) * 1000  # ms

        if response.status_code == 200:
            return {
                'status': 'OK',
                'response_time_ms': round(response_time, 2),
                'endpoint': f"{api_url}/health",
                'server_response': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            }
        else:
            return {
                'status': 'ERROR',
                'http_status': response.status_code,
                'response_time_ms': round(response_time, 2)
            }
    except requests.ConnectionError:
        return {
            'status': 'OFFLINE',
            'message': 'API 서버가 실행되지 않음'
        }
    except Exception as e:
        return {
            'status': 'ERROR',
            'error': str(e)
        }

def check_fuseki_server() -> Dict[str, Any]:
    """Fuseki 서버 상태 검사"""
    fuseki_url = "http://localhost:3030"

    try:
        # Fuseki ping 엔드포인트 테스트
        start_time = time.time()
        response = requests.get(f"{fuseki_url}/$/ping", timeout=5)
        response_time = (time.time() - start_time) * 1000  # ms

        if response.status_code == 200:
            return {
                'status': 'OK',
                'response_time_ms': round(response_time, 2),
                'endpoint': f"{fuseki_url}/$/ping",
                'server_info': response.text.strip()
            }
        else:
            return {
                'status': 'ERROR',
                'http_status': response.status_code,
                'response_time_ms': round(response_time, 2)
            }
    except requests.ConnectionError:
        return {
            'status': 'OFFLINE',
            'message': 'Fuseki 서버가 실행되지 않음'
        }
    except Exception as e:
        return {
            'status': 'ERROR',
            'error': str(e)
        }

def check_audit_system() -> Dict[str, Any]:
    """감사 로깅 시스템 검사"""
    try:
        from audit_logger import verify_audit_integrity, get_audit_summary, write_audit

        # 테스트 감사 로그 작성
        test_entry = write_audit("health_check", "system",
                               {"test": True, "timestamp": datetime.now().isoformat()},
                               risk_level="LOW", compliance_tags=["SYSTEM_CHECK"])

        # 무결성 검증
        integrity_result = verify_audit_integrity()

        # 최근 24시간 요약
        summary = get_audit_summary(24)

        return {
            'status': 'OK',
            'test_entry_created': bool(test_entry),
            'integrity_status': integrity_result.get('status'),
            'recent_entries': summary.get('total_actions', 0),
            'audit_file_exists': Path("artifacts/audit_log.csv").exists()
        }
    except Exception as e:
        return {
            'status': 'ERROR',
            'error': str(e)
        }

def check_business_rules() -> Dict[str, Any]:
    """비즈니스 룰 엔진 검사"""
    try:
        from hvdc_rules import run_all_rules
        import pandas as pd

        # 테스트 데이터로 룰 실행
        test_data = pd.DataFrame({
            'HVDC_CODE': ['HVDC-TEST-001'],
            'INVOICE_VALUE': [1000.0],
            'QTY': [1],
            'UNIT_PRICE': [1000.0],
            'HS_CODE': ['8504.40.90'],
            'CERTS': 'MOIAT,FANR',
            'SOURCE_FILE': 'health_check_test.xlsx',
            'LOGICAL_SOURCE': 'HEALTH_CHECK',
            'EXTRACTION_TRACE': 'system_test',
            'ROW_INDEX': [1]
        })

        std_rates = {'HVDC-TEST-001': 1000.0}
        hs_prefixes = ['85']
        required_certs = ['MOIAT', 'FANR']

        start_time = time.time()
        result = run_all_rules(test_data, std_rates, hs_prefixes, required_certs)
        execution_time = (time.time() - start_time) * 1000  # ms

        return {
            'status': 'OK',
            'execution_time_ms': round(execution_time, 2),
            'cost_alerts': len(result.get('cost_alerts', [])),
            'hs_alerts': len(result.get('hs_alerts', [])),
            'cert_alerts': len(result.get('cert_alerts', []))
        }
    except Exception as e:
        return {
            'status': 'ERROR',
            'error': str(e)
        }

def run_performance_tests() -> Dict[str, Any]:
    """성능 테스트 실행"""
    metrics = {}

    # 메모리 사용량
    try:
        import psutil
        process = psutil.Process()
        memory_mb = process.memory_info().rss / 1024 / 1024
        metrics['memory_usage_mb'] = round(memory_mb, 2)
    except ImportError:
        metrics['memory_usage_mb'] = 'N/A (psutil not available)'
    except Exception as e:
        metrics['memory_usage_mb'] = f'Error: {e}'

    # 디스크 사용량
    try:
        artifacts_dir = Path("artifacts")
        if artifacts_dir.exists():
            total_size = sum(f.stat().st_size for f in artifacts_dir.rglob('*') if f.is_file())
            metrics['artifacts_size_mb'] = round(total_size / 1024 / 1024, 2)
        else:
            metrics['artifacts_size_mb'] = 0
    except Exception as e:
        metrics['artifacts_size_mb'] = f'Error: {e}'

    return metrics

def generate_recommendations(health_report: Dict[str, Any]) -> List[str]:
    """상태에 따른 권장사항 생성"""
    recommendations = []

    # Python 패키지 체크
    python_status = health_report.get('components', {}).get('python', {})
    if python_status.get('packages'):
        missing_packages = [pkg for pkg, status in python_status['packages'].items() if status == 'MISSING']
        if missing_packages:
            recommendations.append(f"📦 누락된 패키지 설치: pip install {' '.join(missing_packages)}")

    # API 서버 체크
    api_status = health_report.get('components', {}).get('api_server', {})
    if api_status.get('status') == 'OFFLINE':
        recommendations.append("🚀 API 서버 시작: python hvdc_api.py")

    # Fuseki 서버 체크
    fuseki_status = health_report.get('components', {}).get('fuseki_server', {})
    if fuseki_status.get('status') == 'OFFLINE':
        recommendations.append("🔧 Fuseki 서버 시작: .\\start-hvdc-fuseki.bat")

    # 성능 최적화
    performance = health_report.get('performance_metrics', {})
    memory_usage = performance.get('memory_usage_mb')
    if isinstance(memory_usage, (int, float)) and memory_usage > 500:
        recommendations.append("⚡ 메모리 사용량 높음 - 시스템 리소스 모니터링 권장")

    # 감사 로그 체크
    audit_status = health_report.get('security_status', {}).get('audit_system', {})
    if audit_status.get('integrity_status') != 'SUCCESS':
        recommendations.append("🔒 감사 로그 무결성 검증 필요: /audit/verify 엔드포인트 호출")

    if not recommendations:
        recommendations.append("✅ 모든 시스템이 정상 작동 중입니다!")

    return recommendations

def main():
    """메인 헬스체크 실행"""
    print("🏥 HVDC 시스템 헬스체크 v3.6-APEX")
    print("=" * 60)
    print(f"⏰ 실행 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    health_report = {
        'timestamp': datetime.now().isoformat(),
        'overall_status': 'HEALTHY',
        'components': {},
        'performance_metrics': {},
        'security_status': {},
        'recommendations': []
    }

    # 1. Python 환경 검사
    print_section("Python 환경 검사", "🐍")
    python_result = check_python_environment()
    health_report['components']['python'] = python_result

    if python_result['status'] == 'OK':
        print(f"  ✅ Python {python_result['version']} - OK")
        for pkg, status in python_result.get('packages', {}).items():
            if status == 'OK':
                print(f"  ✅ {pkg} - 설치됨")
            else:
                print(f"  ❌ {pkg} - 누락")
    else:
        print(f"  ❌ Python 환경 오류: {python_result.get('error')}")
        health_report['overall_status'] = 'CRITICAL'

    # 2. HVDC 파일 검사
    print_section("HVDC 핵심 파일 검사", "📁")
    file_result = check_hvdc_files()
    health_report['components']['core_files'] = file_result

    for file_path, status in file_result['files'].items():
        if status['status'] == 'OK':
            size_kb = status['size_bytes'] / 1024
            print(f"  ✅ {file_path} - OK ({size_kb:.1f}KB)")
        elif status['status'] == 'MISSING':
            print(f"  ❌ {file_path} - 누락")
        else:
            print(f"  ⚠️  {file_path} - 오류: {status.get('error')}")

    if file_result['status'] != 'OK':
        if file_result['status'] == 'CRITICAL':
            health_report['overall_status'] = 'CRITICAL'
        elif health_report['overall_status'] == 'HEALTHY':
            health_report['overall_status'] = 'WARNING'

    # 3. API 서버 검사
    print_section("HVDC API 서버 검사", "🌐")
    api_result = check_api_server()
    health_report['components']['api_server'] = api_result

    if api_result['status'] == 'OK':
        print(f"  ✅ API 서버 - OK ({api_result['response_time_ms']:.1f}ms)")
    elif api_result['status'] == 'OFFLINE':
        print(f"  ❌ API 서버 - {api_result['message']}")
        if health_report['overall_status'] == 'HEALTHY':
            health_report['overall_status'] = 'WARNING'
    else:
        print(f"  ❌ API 서버 오류: {api_result.get('error', 'Unknown error')}")

    # 4. Fuseki 서버 검사
    print_section("Fuseki 서버 검사", "🔧")
    fuseki_result = check_fuseki_server()
    health_report['components']['fuseki_server'] = fuseki_result

    if fuseki_result['status'] == 'OK':
        print(f"  ✅ Fuseki 서버 - OK ({fuseki_result['response_time_ms']:.1f}ms)")
    elif fuseki_result['status'] == 'OFFLINE':
        print(f"  ⚠️  Fuseki 서버 - {fuseki_result['message']}")
    else:
        print(f"  ❌ Fuseki 서버 오류: {fuseki_result.get('error', 'Unknown error')}")

    # 5. 감사 시스템 검사
    print_section("감사 로깅 시스템 검사", "🔒")
    audit_result = check_audit_system()
    health_report['security_status']['audit_system'] = audit_result

    if audit_result['status'] == 'OK':
        print(f"  ✅ 감사 시스템 - OK")
        print(f"  ✅ 무결성 상태: {audit_result['integrity_status']}")
        print(f"  ✅ 최근 24시간 엔트리: {audit_result['recent_entries']}개")
    else:
        print(f"  ❌ 감사 시스템 오류: {audit_result.get('error')}")
        if health_report['overall_status'] == 'HEALTHY':
            health_report['overall_status'] = 'WARNING'

    # 6. 비즈니스 룰 검사
    print_section("비즈니스 룰 엔진 검사", "⚖️")
    rules_result = check_business_rules()
    health_report['components']['business_rules'] = rules_result

    if rules_result['status'] == 'OK':
        print(f"  ✅ 비즈니스 룰 - OK ({rules_result['execution_time_ms']:.1f}ms)")
        print(f"  ✅ CostGuard: {rules_result['cost_alerts']}개 알림")
        print(f"  ✅ HS Risk: {rules_result['hs_alerts']}개 알림")
        print(f"  ✅ CertChk: {rules_result['cert_alerts']}개 알림")
    else:
        print(f"  ❌ 비즈니스 룰 오류: {rules_result.get('error')}")
        if health_report['overall_status'] == 'HEALTHY':
            health_report['overall_status'] = 'WARNING'

    # 7. 성능 메트릭
    print_section("성능 메트릭", "📊")
    performance_result = run_performance_tests()
    health_report['performance_metrics'] = performance_result

    for metric, value in performance_result.items():
        print(f"  📈 {metric}: {value}")

    # 8. 권장사항 생성
    recommendations = generate_recommendations(health_report)
    health_report['recommendations'] = recommendations

    # 최종 결과 출력
    print_section("전체 시스템 상태", "🎯")
    status_emoji = {
        'HEALTHY': '✅',
        'WARNING': '⚠️',
        'CRITICAL': '🔴'
    }

    print(f"  {status_emoji.get(health_report['overall_status'], '❓')} 전체 상태: {health_report['overall_status']}")

    print_section("권장사항", "💡")
    for i, recommendation in enumerate(recommendations, 1):
        print(f"  {i}. {recommendation}")

    # JSON 리포트 저장
    report_file = Path("artifacts/health_report.json")
    report_file.parent.mkdir(exist_ok=True)
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(health_report, f, indent=2, ensure_ascii=False)

    print(f"\n📄 상세 리포트 저장됨: {report_file}")

    return health_report['overall_status'] == 'HEALTHY'

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
