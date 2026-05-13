# HVDC Performance Monitor - KPI 모니터링 및 성능 대시보드
# 실시간 성능 지표 수집 및 임계값 알림

param(
    [string]$BaseUrl = "http://localhost:3030",
    [string]$Dataset = "hvdc",
    [int]$IntervalSeconds = 60,
    [int]$MaxIterations = 0,  # 0 = 무한 실행
    [string]$LogFile = "logs\hvdc-performance.log",
    [switch]$AlertMode,
    [switch]$SingleRun
)

# KPI 임계값 설정
$KPI_THRESHOLDS = @{
    MaxQueryTime = 500      # 밀리초
    MaxPingTime = 100       # 밀리초
    MinSuccessRate = 95     # 퍼센트
    MaxMemoryMB = 2048      # MB
    MaxCpuPercent = 80      # 퍼센트
}

$PingUrl = "$BaseUrl/$/ping"
$SparqlUrl = "$BaseUrl/$Dataset/sparql"
$StatsUrl = "$BaseUrl/$/stats/$Dataset"

Write-Host "=== HVDC Performance Monitor ===" -ForegroundColor Green
Write-Host "Monitoring: $BaseUrl/$Dataset" -ForegroundColor Cyan
Write-Host "Interval: $IntervalSeconds seconds" -ForegroundColor Cyan

# 로그 디렉토리 생성
$logDir = Split-Path $LogFile -Parent
if ($logDir -and -not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# 성능 테스트 쿼리들
$PERFORMANCE_QUERIES = @{
    "Simple Count" = "SELECT (COUNT(*) AS ?count) WHERE { ?s ?p ?o }"
    "Case Count" = "PREFIX ex:<http://samsung.com/project-logistics#> SELECT (COUNT(?case) AS ?count) WHERE { ?case a ex:Case }"
    "Graph Stats" = "SELECT ?g (COUNT(*) AS ?count) WHERE { GRAPH ?g { ?s ?p ?o } } GROUP BY ?g ORDER BY DESC(?count) LIMIT 5"
    "Recent Data" = "PREFIX ex:<http://samsung.com/project-logistics#> SELECT ?code ?date WHERE { ?case a ex:Case ; ex:caseNumber ?code ; ex:extractedDate ?date } ORDER BY DESC(?date) LIMIT 10"
}

function Write-Log {
    param($Message, $Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    if ($LogFile) {
        $logEntry | Add-Content -Path $LogFile -Encoding UTF8
    }
}

function Test-FusekiHealth {
    $healthData = @{
        Timestamp = Get-Date
        PingSuccess = $false
        PingTimeMs = 0
        ServerReachable = $false
    }

    try {
        $startTime = Get-Date
        $response = Invoke-WebRequest -Uri $PingUrl -TimeoutSec 5
        $endTime = Get-Date

        $healthData.PingTimeMs = ($endTime - $startTime).TotalMilliseconds
        $healthData.PingSuccess = ($response.StatusCode -eq 200)
        $healthData.ServerReachable = $true

        if ($healthData.PingTimeMs -gt $KPI_THRESHOLDS.MaxPingTime) {
            Write-Log "⚠️  HIGH PING TIME: $([math]::Round($healthData.PingTimeMs, 2))ms (threshold: $($KPI_THRESHOLDS.MaxPingTime)ms)" "WARN"
        }

    } catch {
        Write-Log "❌ Server health check failed: $($_.Exception.Message)" "ERROR"
        $healthData.ServerReachable = $false
    }

    return $healthData
}

function Test-QueryPerformance {
    $queryResults = @{}

    foreach ($queryName in $PERFORMANCE_QUERIES.Keys) {
        $query = $PERFORMANCE_QUERIES[$queryName]
        $queryData = @{
            Name = $queryName
            Success = $false
            TimeMs = 0
            ResultCount = 0
            Error = $null
        }

        try {
            $startTime = Get-Date
            $curlResult = & curl -s -H "Accept: application/sparql-results+json" --data-urlencode "query=$query" $SparqlUrl
            $endTime = Get-Date

            $queryData.TimeMs = ($endTime - $startTime).TotalMilliseconds

            $jsonResult = $curlResult | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($jsonResult -and $jsonResult.results -and $jsonResult.results.bindings) {
                $queryData.Success = $true
                $queryData.ResultCount = $jsonResult.results.bindings.Count

                if ($queryData.TimeMs -gt $KPI_THRESHOLDS.MaxQueryTime) {
                    Write-Log "⚠️  SLOW QUERY: '$queryName' took $([math]::Round($queryData.TimeMs, 2))ms (threshold: $($KPI_THRESHOLDS.MaxQueryTime)ms)" "WARN"
                }
            }

        } catch {
            $queryData.Error = $_.Exception.Message
            Write-Log "❌ Query '$queryName' failed: $($queryData.Error)" "ERROR"
        }

        $queryResults[$queryName] = $queryData
    }

    return $queryResults
}

function Get-SystemResources {
    $resourceData = @{
        Timestamp = Get-Date
        MemoryUsageMB = 0
        CpuPercent = 0
        DiskSpaceGB = 0
        FusekiProcesses = @()
    }

    try {
        # Java/Fuseki 프로세스 찾기
        $javaProcesses = Get-Process java -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*fuseki*"}

        foreach ($proc in $javaProcesses) {
            $memoryMB = [math]::Round($proc.WorkingSet64 / 1MB, 2)
            $resourceData.MemoryUsageMB += $memoryMB
            $resourceData.FusekiProcesses += @{
                PID = $proc.Id
                MemoryMB = $memoryMB
                StartTime = $proc.StartTime
            }

            if ($memoryMB -gt $KPI_THRESHOLDS.MaxMemoryMB) {
                Write-Log "⚠️  HIGH MEMORY USAGE: PID $($proc.Id) using $memoryMB MB (threshold: $($KPI_THRESHOLDS.MaxMemoryMB) MB)" "WARN"
            }
        }

        # CPU 사용률 (간단한 추정)
        $cpuCounter = Get-Counter "\Process(java*)\% Processor Time" -ErrorAction SilentlyContinue
        if ($cpuCounter) {
            $resourceData.CpuPercent = ($cpuCounter.CounterSamples | Measure-Object -Property CookedValue -Average).Average
        }

        # 디스크 공간
        $drive = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'" -ErrorAction SilentlyContinue
        if ($drive) {
            $resourceData.DiskSpaceGB = [math]::Round($drive.FreeSpace / 1GB, 2)
        }

    } catch {
        Write-Log "⚠️  Resource monitoring failed: $($_.Exception.Message)" "WARN"
    }

    return $resourceData
}

function Generate-PerformanceReport {
    param($HealthData, $QueryResults, $ResourceData)

    Write-Host "`n=== Performance Report ===" -ForegroundColor Cyan
    Write-Host "Timestamp: $($HealthData.Timestamp.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White

    # 서버 상태
    Write-Host "`n--- Server Health ---" -ForegroundColor Yellow
    $pingStatus = if ($HealthData.PingSuccess) { "✅ OK" } else { "❌ FAIL" }
    Write-Host "Ping: $pingStatus ($([math]::Round($HealthData.PingTimeMs, 2))ms)" -ForegroundColor White

    # 쿼리 성능
    Write-Host "`n--- Query Performance ---" -ForegroundColor Yellow
    $successCount = 0
    $totalTime = 0

    foreach ($queryName in $QueryResults.Keys) {
        $result = $QueryResults[$queryName]
        $status = if ($result.Success) { "✅" } else { "❌" }
        $time = [math]::Round($result.TimeMs, 2)

        Write-Host "$status $queryName`: ${time}ms ($($result.ResultCount) results)" -ForegroundColor White

        if ($result.Success) {
            $successCount++
            $totalTime += $result.TimeMs
        }
    }

    $successRate = [math]::Round(($successCount / $QueryResults.Count) * 100, 1)
    $avgTime = if ($successCount -gt 0) { [math]::Round($totalTime / $successCount, 2) } else { 0 }

    Write-Host "Success Rate: $successRate% (threshold: $($KPI_THRESHOLDS.MinSuccessRate)%)" -ForegroundColor White
    Write-Host "Average Time: ${avgTime}ms" -ForegroundColor White

    # 시스템 리소스
    Write-Host "`n--- System Resources ---" -ForegroundColor Yellow
    Write-Host "Memory Usage: $($ResourceData.MemoryUsageMB) MB" -ForegroundColor White
    Write-Host "CPU Usage: $([math]::Round($ResourceData.CpuPercent, 1))%" -ForegroundColor White
    Write-Host "Free Disk: $($ResourceData.DiskSpaceGB) GB" -ForegroundColor White
    Write-Host "Fuseki Processes: $($ResourceData.FusekiProcesses.Count)" -ForegroundColor White

    # KPI 요약
    Write-Host "`n--- KPI Status ---" -ForegroundColor Yellow
    $kpiStatus = @()

    if ($HealthData.PingTimeMs -le $KPI_THRESHOLDS.MaxPingTime) { $kpiStatus += "✅ Ping Time" } else { $kpiStatus += "❌ Ping Time" }
    if ($avgTime -le $KPI_THRESHOLDS.MaxQueryTime) { $kpiStatus += "✅ Query Time" } else { $kpiStatus += "❌ Query Time" }
    if ($successRate -ge $KPI_THRESHOLDS.MinSuccessRate) { $kpiStatus += "✅ Success Rate" } else { $kpiStatus += "❌ Success Rate" }
    if ($ResourceData.MemoryUsageMB -le $KPI_THRESHOLDS.MaxMemoryMB) { $kpiStatus += "✅ Memory" } else { $kpiStatus += "❌ Memory" }

    foreach ($status in $kpiStatus) {
        Write-Host $status -ForegroundColor White
    }

    # 로그 기록
    $logData = @{
        Timestamp = $HealthData.Timestamp
        PingTimeMs = $HealthData.PingTimeMs
        SuccessRate = $successRate
        AvgQueryTimeMs = $avgTime
        MemoryUsageMB = $ResourceData.MemoryUsageMB
        CpuPercent = $ResourceData.CpuPercent
    }

    $csvLine = "$($logData.Timestamp.ToString('yyyy-MM-dd HH:mm:ss')),$($logData.PingTimeMs),$($logData.SuccessRate),$($logData.AvgQueryTimeMs),$($logData.MemoryUsageMB),$($logData.CpuPercent)"
    $csvLine | Add-Content -Path ($LogFile -replace '\.log$', '.csv') -Encoding UTF8

    return $logData
}

# CSV 헤더 생성 (첫 실행 시)
$csvFile = $LogFile -replace '\.log$', '.csv'
if (-not (Test-Path $csvFile)) {
    "Timestamp,PingTimeMs,SuccessRate,AvgQueryTimeMs,MemoryUsageMB,CpuPercent" | Set-Content -Path $csvFile -Encoding UTF8
}

Write-Log "Performance monitoring started"

$iteration = 0
do {
    $iteration++

    Write-Host "`n" + "="*60 -ForegroundColor Gray
    Write-Host "Iteration: $iteration" -ForegroundColor Gray

    # 성능 데이터 수집
    $healthData = Test-FusekiHealth
    $queryResults = Test-QueryPerformance
    $resourceData = Get-SystemResources

    # 보고서 생성
    $report = Generate-PerformanceReport -HealthData $healthData -QueryResults $queryResults -ResourceData $resourceData

    if ($SingleRun) {
        break
    }

    if ($MaxIterations -gt 0 -and $iteration -ge $MaxIterations) {
        break
    }

    # 대기
    if (-not $SingleRun) {
        Write-Host "`nNext check in $IntervalSeconds seconds... (Ctrl+C to stop)" -ForegroundColor Gray
        Start-Sleep $IntervalSeconds
    }

} while ($true)

Write-Log "Performance monitoring completed"
Write-Host "`n📊 Performance data logged to: $LogFile" -ForegroundColor Cyan
Write-Host "📈 CSV data saved to: $csvFile" -ForegroundColor Cyan
