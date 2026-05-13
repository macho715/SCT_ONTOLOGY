#!/usr/bin/env python3
"""
Fuseki 데이터 구조 확인 스크립트
"""

import requests
import json

def query_fuseki(sparql_query):
    """Fuseki SPARQL 쿼리 실행"""
    url = "http://localhost:3030/hvdc/sparql"
    headers = {"Accept": "application/sparql-results+json"}
    data = {"query": sparql_query}

    try:
        response = requests.post(url, data=data, headers=headers, timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ SPARQL 쿼리 실패: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ 연결 오류: {e}")
        return None

def main():
    print("🔍 Fuseki 데이터 구조 분석")
    print("=" * 50)

    # 1. 사용 가능한 RDF 타입 조회
    types_query = """
    SELECT DISTINCT ?type WHERE {
        GRAPH ?g { ?s a ?type }
    } LIMIT 20
    """

    print("📊 사용 가능한 RDF 타입:")
    result = query_fuseki(types_query)
    if result and 'results' in result:
        for binding in result['results']['bindings']:
            rdf_type = binding['type']['value']
            print(f"   - {rdf_type}")

    # 2. 그래프별 트리플 수 조회
    graphs_query = """
    SELECT ?graph (COUNT(*) AS ?count) WHERE {
        GRAPH ?graph { ?s ?p ?o }
    } GROUP BY ?graph
    """

    print("\n📈 그래프별 트리플 수:")
    result = query_fuseki(graphs_query)
    if result and 'results' in result:
        for binding in result['results']['bindings']:
            graph = binding['graph']['value']
            count = binding['count']['value']
            print(f"   - {graph.split('/')[-1]}: {count}개 트리플")

    # 3. 샘플 데이터 조회
    sample_query = """
    SELECT ?s ?p ?o WHERE {
        GRAPH ?g { ?s ?p ?o }
    } LIMIT 10
    """

    print("\n📋 샘플 트리플:")
    result = query_fuseki(sample_query)
    if result and 'results' in result:
        for i, binding in enumerate(result['results']['bindings'][:5], 1):
            s = binding['s']['value'].split('/')[-1] if '/' in binding['s']['value'] else binding['s']['value']
            p = binding['p']['value'].split('#')[-1] if '#' in binding['p']['value'] else binding['p']['value']
            o = binding['o']['value'][:50] + "..." if len(binding['o']['value']) > 50 else binding['o']['value']
            print(f"   {i}. {s} → {p} → {o}")

if __name__ == "__main__":
    main()
