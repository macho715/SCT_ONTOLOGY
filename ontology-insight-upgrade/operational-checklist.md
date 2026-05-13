# HVDC Ontology Insight - 운영 체크리스트

## 🎯 일일 운영 루틴 (5분)

### ✅ 매일 아침 체크 (Daily Health Check)
```powershell
# 1. 서버 상태 확인
Test-NetConnection localhost -Port 3030 -InformationLevel Quiet

# 2. 기본 데이터 확인
$query = "SELECT (COUNT(*) AS ?count) WHERE { ?s ?p ?o }"
$result = Invoke-RestMethod -Uri "http://localhost:3030/hvdc/sparql" -Method Post -Body @{ query = $query } -ContentType "application/x-www-form-urlencoded"
Write-Host "Total triples: $($result.results.bindings[0].count.value)"

# 3. 핵심 쿼리 테스트
.\scripts\hvdc-query-runner.ps1 -QueryFile queries\01-monthly-warehouse-stock.rq
```

**기대 결과:**
- ✅ 서버 응답: `TcpTestSucceeded : True`
- ✅ 트리플 수: `150+` (데이터 세트에 따라)
- ✅ 쿼리 결과: `3+ rows` (창고별/월별 데이터)

---

## 📊 주간 운영 점검 (15분)

### 🔍 매주 월요일 체크 (Weekly Deep Check)
```powershell
# 전체 시스템 검증
.\full-validation.ps1 -DetailedReport

# 성능 메트릭 수집
Measure-Command { .\scripts\hvdc-query-runner.ps1 -AllQueries }

# 데이터 품질 확인
$qualityQuery = @"
PREFIX ex: <http://samsung.com/project-logistics#>
SELECT ?class (COUNT(?instance) AS ?count) WHERE {
  ?instance a ?class .
  FILTER(STRSTARTS(STR(?class), "http://samsung.com/project-logistics#"))
}
GROUP BY ?class
ORDER BY DESC(?count)
"@
Invoke-RestMethod -Uri "http://localhost:3030/hvdc/sparql" -Method Post -Body @{ query = $qualityQuery } -ContentType "application/x-www-form-urlencoded"
```

**체크 포인트:**
- [ ] 모든 핵심 쿼리 정상 실행 (4개)
- [ ] 응답 시간 < 5초 (각 쿼리)
- [ ] 클래스별 인스턴스 수 일관성
- [ ] 메모리 사용량 < 2GB

---

## 🔄 월간 유지보수 (30분)

### 🛠️ 매월 첫째 주 유지보수
```powershell
# 1. 데이터베이스 최적화
cd fuseki\apache-jena-fuseki-4.10.0
.\tdb2.tdbstats --loc .\data\tdb-hvdc

# 2. 백업 생성
$backupDate = Get-Date -Format "yyyyMM"
.\tdb2.tdbdump --loc .\data\tdb-hvdc > "backup\hvdc-backup-$backupDate.ttl"

# 3. 로그 파일 정리
Get-ChildItem -Path "logs" -Filter "*.log" | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | Remove-Item

# 4. 성능 벤치마크
.\scripts\performance-benchmark.ps1
```

---

## 🚨 장애 대응 절차

### Level 1: 서비스 중단 (즉시)
```powershell
# 1. 서버 재시작 시도
Get-Process java | Where-Object {$_.CommandLine -like "*fuseki*"} | Stop-Process -Force
Start-Sleep 5
.\start-hvdc-fuseki.bat

# 2. 기본 기능 확인
.\smoke-test.ps1

# 3. 실패 시 백업에서 복구
if ($LASTEXITCODE -ne 0) {
    # 백업에서 복구 로직
    Write-Host "Attempting backup recovery..."
}
```

### Level 2: 데이터 손상 (30분 이내)
```powershell
# 1. 데이터 무결성 검증
.\scripts\data-integrity-check.ps1

# 2. 손상 시 최신 백업에서 복구
$latestBackup = Get-ChildItem "backup\*.ttl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($latestBackup) {
    Remove-Item -Recurse -Force "fuseki\apache-jena-fuseki-4.10.0\data\tdb-hvdc"
    cd fuseki\apache-jena-fuseki-4.10.0
    .\tdb2.tdbloader --loc .\data\tdb-hvdc "..\..\$($latestBackup.Name)"
}
```

---

## 📈 성능 모니터링

### 핵심 메트릭 추적
```powershell
# 응답 시간 측정
function Measure-QueryPerformance {
    $queries = Get-ChildItem "queries\*.rq"
    $results = @()

    foreach ($query in $queries) {
        $time = Measure-Command {
            .\scripts\hvdc-query-runner.ps1 -QueryFile $query.FullName
        }
        $results += @{
            Query = $query.Name
            Duration = $time.TotalMilliseconds
        }
    }
    return $results
}

# 메모리 사용량 확인
Get-Process java | Where-Object {$_.CommandLine -like "*fuseki*"} | Select-Object ProcessName, WorkingSet64, PagedMemorySize64
```

### 임계값 설정
- 🟢 **정상**: 쿼리 응답 < 3초, 메모리 < 1GB
- 🟡 **주의**: 쿼리 응답 3-10초, 메모리 1-2GB
- 🔴 **위험**: 쿼리 응답 > 10초, 메모리 > 2GB

---

## 🔐 보안 점검

### 월간 보안 체크리스트
- [ ] 기본 포트 3030 외부 노출 확인 (로컬만 권장)
- [ ] 업데이트 엔드포인트 접근 제한 확인
- [ ] 로그 파일 민감정보 포함 여부 확인
- [ ] Java 및 Fuseki 버전 보안 패치 확인

```powershell
# 외부 접근 확인
Test-NetConnection -ComputerName "외부IP" -Port 3030

# 업데이트 엔드포인트 테스트
try {
    Invoke-RestMethod -Uri "http://localhost:3030/hvdc/update" -Method Post -Body "INSERT DATA { <test:s> <test:p> <test:o> }"
    Write-Host "⚠️ UPDATE endpoint is accessible"
} catch {
    Write-Host "✅ UPDATE endpoint properly restricted"
}
```

---

## 📋 데이터 품질 관리

### 주간 데이터 품질 체크
```sparql
-- 1. 누락된 필수 속성 확인
PREFIX ex: <http://samsung.com/project-logistics#>
SELECT ?invoice WHERE {
  ?invoice a ex:Invoice .
  FILTER NOT EXISTS { ?invoice ex:invoiceDate ?date }
}

-- 2. 음수 값 확인
SELECT ?item ?amount WHERE {
  ?item ex:totalAmount ?amount .
  FILTER(?amount < 0)
}

-- 3. 날짜 형식 일관성 확인
SELECT ?snapshot ?date WHERE {
  ?snapshot ex:snapshotDate ?date .
  FILTER(!REGEX(STR(?date), "^\\d{4}-\\d{2}-\\d{2}"))
}
```

---

## 🔄 자동화 스크립트

### 자동 백업 스크립트 (`auto-backup.ps1`)
```powershell
# 매일 자동 백업 (Task Scheduler 등록)
$date = Get-Date -Format "yyyyMMdd"
$backupPath = "backup\hvdc-auto-backup-$date.ttl"

cd fuseki\apache-jena-fuseki-4.10.0
.\tdb2.tdbdump --loc .\data\tdb-hvdc > "..\..\$backupPath"

# 30일 이상 된 백업 파일 삭제
Get-ChildItem "..\..\backup\hvdc-auto-backup-*.ttl" |
    Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} |
    Remove-Item
```

### 상태 모니터링 스크립트 (`health-monitor.ps1`)
```powershell
# 5분마다 실행하여 상태 확인
$status = @{
    Timestamp = Get-Date
    ServerUp = Test-NetConnection localhost -Port 3030 -InformationLevel Quiet
    TripleCount = 0
    LastError = $null
}

try {
    $query = "SELECT (COUNT(*) AS ?count) WHERE { ?s ?p ?o }"
    $result = Invoke-RestMethod -Uri "http://localhost:3030/hvdc/sparql" -Method Post -Body @{ query = $query } -ContentType "application/x-www-form-urlencoded"
    $status.TripleCount = $result.results.bindings[0].count.value
} catch {
    $status.LastError = $_.Exception.Message
}

# 로그 기록
$status | ConvertTo-Json | Add-Content "logs\health-monitor.log"

# 알림 (선택사항)
if (-not $status.ServerUp -or $status.TripleCount -eq 0) {
    Write-Host "🚨 ALERT: HVDC system requires attention!" -ForegroundColor Red
    # 여기에 Slack/Email 알림 로직 추가 가능
}
```

---

## 📞 운영 연락망

### 장애 대응 연락 순서
1. **1차**: 시스템 관리자 (즉시)
2. **2차**: 프로젝트 매니저 (15분 내)
3. **3차**: 기술 지원팀 (30분 내)
4. **에스컬레이션**: 외부 전문가 (1시간 내)

### 정기 점검 일정
- **일일**: 오전 9시 기본 상태 확인
- **주간**: 월요일 오전 상세 점검
- **월간**: 매월 첫째 주 유지보수
- **분기**: 분기별 성능 최적화 및 업그레이드 검토

---

**💡 Pro Tip**: 모든 운영 활동은 `logs\operations.log`에 기록하여 추후 분석 및 개선에 활용하세요.
