# HVDC Dashboard Status Checker - 대시보드 상태 확인 도구

param(
    [int[]]$PortsToCheck = @(8090, 9000, 9080, 8081, 8888, 8889, 8999)
)

Write-Host "=== HVDC Dashboard Status Checker ===" -ForegroundColor Green

# 포트 사용 상태 확인 함수
function Test-PortInUse {
    param([int]$Port)

    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    } catch {
        return $false
    }
}

# Fuseki 서버 상태 확인
Write-Host "`n🔍 Checking Fuseki Server..." -ForegroundColor Yellow
try {
    $fusekiResponse = Invoke-WebRequest -Uri "http://localhost:3030/$/ping" -TimeoutSec 3
    Write-Host "✅ Fuseki Server: RUNNING (Port 3030)" -ForegroundColor Green
    Write-Host "   Response: $($fusekiResponse.Content.Trim())" -ForegroundColor Gray
} catch {
    Write-Host "❌ Fuseki Server: NOT RUNNING" -ForegroundColor Red
    Write-Host "   Start with: .\start-hvdc-fuseki.bat" -ForegroundColor Cyan
}

# 대시보드 포트 상태 확인
Write-Host "`n🌐 Checking Dashboard Ports..." -ForegroundColor Yellow

$activeDashboards = @()
foreach ($port in $PortsToCheck) {
    $isInUse = Test-PortInUse -Port $port

    if ($isInUse) {
        Write-Host "✅ Port $port`: IN USE (Possible Dashboard)" -ForegroundColor Green
        $activeDashboards += $port

        # HTTP 응답 확인
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port" -TimeoutSec 2 -UseBasicParsing
            if ($response.Content -match "HVDC Ontology Insight") {
                Write-Host "   🎯 HVDC Dashboard CONFIRMED" -ForegroundColor Green
                Write-Host "   📊 URL: http://localhost:$port" -ForegroundColor Cyan
            } else {
                Write-Host "   ❓ Unknown service" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "   ⚠️  Port in use but HTTP not responding" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚪ Port $port`: Available" -ForegroundColor Gray
    }
}

# 요약 정보
Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "   Active Dashboard Ports: $($activeDashboards.Count)" -ForegroundColor White

if ($activeDashboards.Count -gt 0) {
    Write-Host "   Running Dashboards:" -ForegroundColor White
    foreach ($port in $activeDashboards) {
        Write-Host "     • http://localhost:$port" -ForegroundColor Cyan
    }
} else {
    Write-Host "   No active dashboards found" -ForegroundColor Yellow
    Write-Host "   Start dashboard: .\start-dashboard-auto.ps1" -ForegroundColor Cyan
}

# 프로세스 정보
Write-Host "`n🔧 Related Processes:" -ForegroundColor Yellow
$powershellProcesses = Get-Process powershell -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*dashboard*"}
$javaProcesses = Get-Process java -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*fuseki*"}

if ($javaProcesses) {
    foreach ($proc in $javaProcesses) {
        Write-Host "   ☕ Java/Fuseki: PID $($proc.Id), Memory: $([math]::Round($proc.WorkingSet64/1MB, 1))MB" -ForegroundColor Green
    }
}

if ($powershellProcesses) {
    foreach ($proc in $powershellProcesses) {
        Write-Host "   🔷 PowerShell Dashboard: PID $($proc.Id)" -ForegroundColor Blue
    }
}

Write-Host "`n=== Status Check Complete ===" -ForegroundColor Green
