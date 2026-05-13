# HVDC Dashboard Clean - JavaScript 구문 오류 완전 해결
# 따옴표 이스케이프 문제 해결 + 안전한 HTML 생성

param(
    [int]$Port = 8099,
    [switch]$OpenBrowser
)

Write-Host "=== HVDC Dashboard Clean (JS Fixed) ===" -ForegroundColor Green
Write-Host "Port: $Port" -ForegroundColor Cyan

# Fuseki 확인
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3030/$/ping" -TimeoutSec 5
    Write-Host "✅ Fuseki server: $($response.Content.Trim())" -ForegroundColor Green
} catch {
    Write-Error "❌ Fuseki server not accessible"
    exit 1
}

# 포트 확인
function Test-PortAvailable {
    param([int]$Port)
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch { return $false }
}

if (-not (Test-PortAvailable -Port $Port)) {
    $alternatives = @(8099, 8100, 8101, 8102, 9099)
    foreach ($alt in $alternatives) {
        if (Test-PortAvailable -Port $alt) {
            $Port = $alt
            break
        }
    }
}

Write-Host "🚀 Using port: $Port" -ForegroundColor Green

# HTML 파일 직접 생성 (따옴표 문제 해결)
$htmlFile = "dashboard_clean_$Port.html"

# HTML 내용을 Here-String 대신 파일로 직접 생성
@"
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HVDC Dashboard - Clean Version</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
        }
        .header h1 {
            color: #333;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .status-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 5px solid #28a745;
        }
        .status-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .status-icon {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #28a745;
            animation: pulse 2s infinite;
        }
        .status-error {
            background: #dc3545;
            animation: none;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .metric-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            transition: transform 0.3s ease;
        }
        .metric-card:hover {
            transform: translateY(-5px);
        }
        .metric-card.error {
            background: linear-gradient(135deg, #dc3545, #c82333);
        }
        .metric-value {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .metric-label {
            font-size: 1.1em;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .test-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
        }
        .test-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-warning { background: #ffc107; color: #212529; }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .log-content {
            background: #2d3748;
            color: #a0aec0;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            max-height: 200px;
            overflow-y: auto;
            white-space: pre-wrap;
        }
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .success { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Samsung HVDC Ontology Insight</h1>
            <p>Clean Dashboard - JavaScript Fixed (Port: $Port)</p>
        </div>

        <div class="status-bar">
            <div class="status-item">
                <div class="status-icon" id="statusIcon"></div>
                <span id="statusText">Initializing...</span>
            </div>
            <div class="status-item">
                <span id="lastUpdate">Last Update: Loading...</span>
            </div>
            <div class="status-item">
                <span id="queryCount">Queries: 0</span>
            </div>
        </div>

        <div class="test-section">
            <h3>🧪 Test Controls</h3>
            <div class="test-buttons">
                <button class="btn btn-primary" onclick="testProxy()">Test Proxy</button>
                <button class="btn btn-success" onclick="refreshData()">Refresh Data</button>
                <button class="btn btn-warning" onclick="clearLog()">Clear Log</button>
            </div>
            <div class="log-content" id="logContent">Dashboard initializing...\n</div>
        </div>

        <div class="metrics-grid">
            <div class="metric-card" id="triplesCard">
                <div class="metric-value" id="totalTriples">
                    <div class="loading"></div>
                </div>
                <div class="metric-label">Total Triples</div>
            </div>

            <div class="metric-card" id="casesCard">
                <div class="metric-value" id="totalCases">
                    <div class="loading"></div>
                </div>
                <div class="metric-label">HVDC Cases</div>
            </div>

            <div class="metric-card" id="graphsCard">
                <div class="metric-value" id="namedGraphs">
                    <div class="loading"></div>
                </div>
                <div class="metric-label">Named Graphs</div>
            </div>

            <div class="metric-card" id="classesCard">
                <div class="metric-value" id="dataClasses">
                    <div class="loading"></div>
                </div>
                <div class="metric-label">Data Classes</div>
            </div>
        </div>
    </div>

    <script>
        // 안전한 JavaScript - 모든 따옴표 문제 해결
        const PROXY_URL = '/api/sparql';
        let queryCounter = 0;

        function log(message, isError) {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = isError ? 'ERROR' : 'INFO';
            const logEntry = '[' + timestamp + '] ' + prefix + ': ' + message + '\n';

            const logElement = document.getElementById('logContent');
            logElement.textContent = logEntry + logElement.textContent;

            // 최대 30줄 유지
            const lines = logElement.textContent.split('\n');
            if (lines.length > 30) {
                logElement.textContent = lines.slice(0, 30).join('\n');
            }
        }

        function updateStatus(connected, message) {
            const statusIcon = document.getElementById('statusIcon');
            const statusText = document.getElementById('statusText');

            if (connected) {
                statusIcon.className = 'status-icon';
                statusText.innerHTML = '<span class="success">' + (message || 'Connected') + '</span>';
            } else {
                statusIcon.className = 'status-icon status-error';
                statusText.innerHTML = '<span class="error">' + (message || 'Error') + '</span>';
            }
        }

        async function executeSparql(query, description) {
            queryCounter++;
            document.getElementById('queryCount').textContent = 'Queries: ' + queryCounter;

            log('Executing: ' + description);

            try {
                const response = await fetch(PROXY_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: query })
                });

                if (!response.ok) {
                    throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                log('Success: ' + description + ' (' + data.results.bindings.length + ' results)');
                updateStatus(true, 'SPARQL Working');

                return data;

            } catch (error) {
                log('Failed: ' + description + ' - ' + error.message, true);
                updateStatus(false, 'SPARQL Error');
                return null;
            }
        }

        async function updateMetrics() {
            log('Starting metrics update...');

            const queries = [
                {
                    query: 'SELECT (COUNT(*) AS ?count) WHERE { ?s ?p ?o }',
                    description: 'Total Triples',
                    elementId: 'totalTriples',
                    cardId: 'triplesCard'
                },
                {
                    query: 'PREFIX ex:<http://samsung.com/project-logistics#> SELECT (COUNT(?case) AS ?count) WHERE { ?case a ex:Case }',
                    description: 'HVDC Cases',
                    elementId: 'totalCases',
                    cardId: 'casesCard'
                },
                {
                    query: 'SELECT (COUNT(DISTINCT ?g) AS ?count) WHERE { GRAPH ?g { ?s ?p ?o } }',
                    description: 'Named Graphs',
                    elementId: 'namedGraphs',
                    cardId: 'graphsCard'
                },
                {
                    query: 'SELECT (COUNT(DISTINCT ?class) AS ?count) WHERE { ?s a ?class }',
                    description: 'Data Classes',
                    elementId: 'dataClasses',
                    cardId: 'classesCard'
                }
            ];

            for (let i = 0; i < queries.length; i++) {
                const queryInfo = queries[i];
                const result = await executeSparql(queryInfo.query, queryInfo.description);

                if (result && result.results.bindings.length > 0) {
                    const count = parseInt(result.results.bindings[0].count.value);
                    document.getElementById(queryInfo.elementId).textContent = count.toLocaleString();
                    document.getElementById(queryInfo.cardId).classList.remove('error');
                } else {
                    document.getElementById(queryInfo.elementId).innerHTML = '<span class="error">Error</span>';
                    document.getElementById(queryInfo.cardId).classList.add('error');
                }

                // 각 쿼리 간 간격
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            document.getElementById('lastUpdate').textContent = 'Last Update: ' + new Date().toLocaleTimeString();
            log('Metrics update completed');
        }

        // 테스트 함수들
        async function testProxy() {
            log('Testing proxy connection...');
            const result = await executeSparql('SELECT (COUNT(*) AS ?count) WHERE { ?s ?p ?o }', 'Proxy Test');
            if (result) {
                log('Proxy test successful!');
            } else {
                log('Proxy test failed!', true);
            }
        }

        async function refreshData() {
            log('Manual refresh requested');
            await updateMetrics();
        }

        function clearLog() {
            document.getElementById('logContent').textContent = 'Log cleared...\n';
            log('Log cleared by user');
        }

        // 초기화
        async function initialize() {
            log('Dashboard initializing...');
            updateStatus(false, 'Connecting...');

            await updateMetrics();

            // 30초마다 자동 갱신
            setInterval(updateMetrics, 30000);

            log('Dashboard initialization completed');
        }

        // 페이지 로드 시 시작
        document.addEventListener('DOMContentLoaded', initialize);
    </script>
</body>
</html>
"@ | Out-File -FilePath $htmlFile -Encoding UTF8

Write-Host "📄 Clean HTML file created: $htmlFile" -ForegroundColor Green

# HTTP 서버 시작
Write-Host "🚀 Starting clean dashboard server..." -ForegroundColor Yellow

try {
    $listener = [System.Net.HttpListener]::new()
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()

    $dashboardUrl = "http://localhost:$Port"
    Write-Host "✅ Clean dashboard started!" -ForegroundColor Green
    Write-Host "🌐 Dashboard URL: $dashboardUrl" -ForegroundColor Cyan
    Write-Host "📄 HTML File: $htmlFile" -ForegroundColor Cyan

    if ($OpenBrowser -or -not $PSBoundParameters.ContainsKey('OpenBrowser')) {
        Write-Host "🌐 Opening browser..." -ForegroundColor Yellow
        Start-Process $dashboardUrl
    }

    Write-Host "`n=== Clean Dashboard Running ===" -ForegroundColor Green
    Write-Host "🔧 JavaScript 구문 오류 완전 해결" -ForegroundColor Green
    Write-Host "📝 따옴표 이스케이프 문제 수정" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow

    # HTML 파일 내용 읽기
    $htmlContent = Get-Content -Path $htmlFile -Raw -Encoding UTF8

    $requestCount = 0
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $requestCount++
            $path = $request.Url.LocalPath
            Write-Host "[$requestCount] $(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $path" -ForegroundColor Gray

            if ($path -eq "/api/sparql" -and $request.HttpMethod -eq "POST") {
                # SPARQL 프록시
                try {
                    $reader = [System.IO.StreamReader]::new($request.InputStream, [System.Text.Encoding]::UTF8)
                    $requestBody = $reader.ReadToEnd()
                    $reader.Close()

                    $jsonRequest = $requestBody | ConvertFrom-Json
                    $sparqlQuery = $jsonRequest.query

                    Write-Host "    🔄 Proxying: $($sparqlQuery.Substring(0, [Math]::Min(50, $sparqlQuery.Length)))..." -ForegroundColor Blue

                    # Fuseki에 요청
                    $fusekiResponse = Invoke-RestMethod -Uri "http://localhost:3030/hvdc/sparql" -Method Post -Headers @{
                        "Accept" = "application/sparql-results+json"
                        "Content-Type" = "application/sparql-query"
                    } -Body $sparqlQuery

                    $jsonResponse = $fusekiResponse | ConvertTo-Json -Depth 10 -Compress
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResponse)

                    $response.ContentType = "application/json; charset=utf-8"
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)

                    Write-Host "    ✅ Proxy success: $($fusekiResponse.results.bindings.Count) results" -ForegroundColor Green

                } catch {
                    Write-Host "    ❌ Proxy error: $($_.Exception.Message)" -ForegroundColor Red

                    $errorResponse = @{ error = $_.Exception.Message } | ConvertTo-Json
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorResponse)

                    $response.StatusCode = 500
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            } else {
                # HTML 제공
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($htmlContent)
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }

            $response.Close()

        } catch [System.Net.HttpListenerException] {
            break
        } catch {
            Write-Warning "Request error: $($_.Exception.Message)"
        }
    }

} catch {
    Write-Error "❌ Server start failed: $($_.Exception.Message)"
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        Write-Host "🛑 Clean dashboard stopped" -ForegroundColor Yellow
    }

    # 임시 파일 정리
    if (Test-Path $htmlFile) {
        Remove-Item $htmlFile -Force
        Write-Host "🗑️  Temporary file cleaned up" -ForegroundColor Gray
    }

    Write-Host "=== Session ended ===" -ForegroundColor Green
}
