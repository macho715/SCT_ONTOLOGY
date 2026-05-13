# HVDC Named Graph Migration - Default → Named Graph 전환
# SPARQL UPDATE MOVE + GSP 기반 안전한 마이그레이션

param(
    [string]$BaseUrl = "http://localhost:3030",
    [string]$Dataset = "hvdc",
    [string]$ArchiveGraph = "http://samsung.com/graph/ARCHIVE-" + (Get-Date -Format "yyyyMMdd-HHmm"),
    [string]$OfcoTtl = ".\ofco_triples.ttl",
    [string]$DsvTtl = ".\dsv_triples.ttl",
    [string]$PkgsTtl = ".\pkgs_triples.ttl",
    [string]$PayTtl = ".\pay_triples.ttl",
    [switch]$DryRun,
    [switch]$Force,
    [switch]$SkipArchive
)

# System.Web 어셈블리 로드
Add-Type -AssemblyName System.Web

# 엔드포인트 정의
$PingUrl = "$BaseUrl/$/ping"
$UpdateUrl = "$BaseUrl/$Dataset/update"
$SparqlUrl = "$BaseUrl/$Dataset/sparql"
$DataUrl = "$BaseUrl/$Dataset/data"

# 그래프 URI 정책
$TargetGraphs = @{
    "OFCO" = "http://samsung.com/graph/OFCO"
    "DSV" = "http://samsung.com/graph/DSV"
    "PKGS" = "http://samsung.com/graph/PKGS"
    "PAY" = "http://samsung.com/graph/PAY"
}

Write-Host "=== HVDC Named Graph Migration ===" -ForegroundColor Green
Write-Host "Archive Graph: $ArchiveGraph" -ForegroundColor Cyan
Write-Host "Target Graphs: $($TargetGraphs.Values -join ', ')" -ForegroundColor Cyan

# 0) 헬스체크
Write-Host "`n=== Pre-flight Checks ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $PingUrl -TimeoutSec 5
    Write-Host "✅ Fuseki server healthy: $($response.Content.Trim())" -ForegroundColor Green
} catch {
    Write-Error "❌ Fuseki server not responding at $PingUrl"
    exit 1
}

# UPDATE 엔드포인트 확인
try {
    $testUpdate = "ASK { ?s ?p ?o }"
    Invoke-RestMethod -Uri $UpdateUrl -Method Post -Body $testUpdate -ContentType "application/sparql-update" -ErrorAction Stop | Out-Null
    Write-Host "✅ SPARQL UPDATE endpoint accessible" -ForegroundColor Green
} catch {
    Write-Error "❌ SPARQL UPDATE not accessible. Ensure server started with --update option"
    exit 1
}

# 기존 Default Graph 데이터 확인
$countQuery = "SELECT (COUNT(*) AS ?count) WHERE { ?s ?p ?o }"
try {
    $curlResult = & curl -s -H "Accept: application/sparql-results+json" --data-urlencode "query=$countQuery" $SparqlUrl
    $jsonResult = $curlResult | ConvertFrom-Json
    $defaultTripleCount = [int]$jsonResult.results.bindings[0].count.value

    Write-Host "✅ Default graph contains: $defaultTripleCount triples" -ForegroundColor Green

    if ($defaultTripleCount -eq 0 -and -not $Force) {
        Write-Warning "Default graph is empty. Nothing to migrate."
        if (-not $Force) {
            exit 0
        }
    }
} catch {
    Write-Error "❌ Failed to check default graph: $($_.Exception.Message)"
    exit 1
}

# TTL 파일 존재 확인
$ttlFiles = @(
    @{name="OFCO"; file=$OfcoTtl; graph=$TargetGraphs["OFCO"]},
    @{name="DSV"; file=$DsvTtl; graph=$TargetGraphs["DSV"]},
    @{name="PKGS"; file=$PkgsTtl; graph=$TargetGraphs["PKGS"]},
    @{name="PAY"; file=$PayTtl; graph=$TargetGraphs["PAY"]}
)

Write-Host "`n=== TTL File Check ===" -ForegroundColor Yellow
foreach ($ttl in $ttlFiles) {
    if (Test-Path $ttl.file) {
        $sizeKB = [math]::Round((Get-Item $ttl.file).Length / 1KB, 2)
        Write-Host "✅ $($ttl.name): $($ttl.file) ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $($ttl.name): $($ttl.file) not found - will skip" -ForegroundColor Yellow
    }
}

# Dry Run 모드
if ($DryRun) {
    Write-Host "`n=== DRY RUN MODE ===" -ForegroundColor Magenta
    Write-Host "Would execute the following operations:" -ForegroundColor Yellow

    if (-not $SkipArchive) {
        Write-Host "1. MOVE DEFAULT TO <$ArchiveGraph>" -ForegroundColor White
    }

    $stepNum = if ($SkipArchive) { 1 } else { 2 }
    foreach ($ttl in $ttlFiles) {
        if (Test-Path $ttl.file) {
            Write-Host "$stepNum. Upload $($ttl.file) → $($ttl.graph)" -ForegroundColor White
            $stepNum++
        }
    }

    Write-Host "`nDry run completed. Use without -DryRun to execute." -ForegroundColor Cyan
    exit 0
}

# 1) Default Graph → Archive Graph 이동 (SPARQL UPDATE)
if (-not $SkipArchive -and $defaultTripleCount -gt 0) {
    Write-Host "`n=== Moving Default Graph to Archive ===" -ForegroundColor Yellow

    $moveQuery = "MOVE DEFAULT TO <$ArchiveGraph>"

    try {
        Write-Host "Executing: $moveQuery" -ForegroundColor Cyan
        $result = Invoke-RestMethod -Uri $UpdateUrl -Method Post -Body $moveQuery -ContentType "application/sparql-update"
        Write-Host "✅ Default graph moved to archive: $ArchiveGraph" -ForegroundColor Green

        # 검증: Default Graph가 비었는지 확인
        $curlResult = & curl -s -H "Accept: application/sparql-results+json" --data-urlencode "query=$countQuery" $SparqlUrl
        $jsonResult = $curlResult | ConvertFrom-Json
        $newDefaultCount = [int]$jsonResult.results.bindings[0].count.value

        if ($newDefaultCount -eq 0) {
            Write-Host "✅ Default graph now empty" -ForegroundColor Green
        } else {
            Write-Warning "⚠️  Default graph still contains $newDefaultCount triples"
        }

        # Archive Graph 검증
        $archiveCountQuery = "SELECT (COUNT(*) AS ?count) WHERE { GRAPH <$ArchiveGraph> { ?s ?p ?o } }"
        $curlResult = & curl -s -H "Accept: application/sparql-results+json" --data-urlencode "query=$archiveCountQuery" $SparqlUrl
        $jsonResult = $curlResult | ConvertFrom-Json
        $archiveCount = [int]$jsonResult.results.bindings[0].count.value

        Write-Host "✅ Archive graph contains: $archiveCount triples" -ForegroundColor Green

    } catch {
        Write-Error "❌ MOVE operation failed: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "⚠️  Skipping archive step (SkipArchive=$SkipArchive, DefaultCount=$defaultTripleCount)" -ForegroundColor Yellow
}

# 2) 소스별 Named Graph 업로드 (GSP)
Write-Host "`n=== Uploading to Named Graphs ===" -ForegroundColor Yellow

$uploadResults = @()
foreach ($ttl in $ttlFiles) {
    if (-not (Test-Path $ttl.file)) {
        Write-Host "⚠️  Skipping $($ttl.name): file not found" -ForegroundColor Yellow
        continue
    }

    Write-Host "`nUploading $($ttl.name): $($ttl.file)" -ForegroundColor Cyan

    try {
        # GSP URL with proper encoding
        $escapedGraphUri = [System.Web.HttpUtility]::UrlEncode($ttl.graph)
        $uploadUrl = "$DataUrl?graph=$escapedGraphUri"

        # TTL 콘텐츠 읽기
        $ttlContent = Get-Content -Path $ttl.file -Raw -Encoding UTF8

        # GSP 업로드
        $startTime = Get-Date
        $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -Body $ttlContent -ContentType "text/turtle; charset=utf-8"
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds

        Write-Host "✅ Upload successful" -ForegroundColor Green
        Write-Host "   Duration: $([math]::Round($duration, 2)) seconds" -ForegroundColor White

        if ($response.tripleCount) {
            Write-Host "   Triples: $($response.tripleCount)" -ForegroundColor White
        }

        # 그래프별 검증
        $graphCountQuery = "SELECT (COUNT(*) AS ?count) WHERE { GRAPH <$($ttl.graph)> { ?s ?p ?o } }"
        $curlResult = & curl -s -H "Accept: application/sparql-results+json" --data-urlencode "query=$graphCountQuery" $SparqlUrl
        $jsonResult = $curlResult | ConvertFrom-Json
        $graphCount = [int]$jsonResult.results.bindings[0].count.value

        Write-Host "   Verified: $graphCount triples in graph" -ForegroundColor White

        $uploadResults += @{
            Name = $ttl.name
            Graph = $ttl.graph
            File = $ttl.file
            Status = "SUCCESS"
            Duration = $duration
            Triples = $graphCount
        }

    } catch {
        Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
        $uploadResults += @{
            Name = $ttl.name
            Graph = $ttl.graph
            File = $ttl.file
            Status = "ERROR"
            Duration = 0
            Triples = 0
            Error = $_.Exception.Message
        }

        if (-not $Force) {
            Write-Error "Migration failed. Use -Force to continue on errors."
            exit 1
        }
    }
}

# 3) 최종 검증 및 요약
Write-Host "`n=== Migration Summary ===" -ForegroundColor Green

# 전체 그래프 상태
$allGraphsQuery = "SELECT ?g (COUNT(*) AS ?count) WHERE { GRAPH ?g { ?s ?p ?o } } GROUP BY ?g ORDER BY DESC(?count)"
try {
    $curlResult = & curl -s -H "Accept: application/sparql-results+json" --data-urlencode "query=$allGraphsQuery" $SparqlUrl
    $jsonResult = $curlResult | ConvertFrom-Json

    Write-Host "`n--- All Named Graphs ---" -ForegroundColor Cyan
    foreach ($binding in $jsonResult.results.bindings) {
        $graphUri = $binding.g.value
        $count = $binding.count.value

        # 그래프 타입 식별
        $graphType = "OTHER"
        if ($graphUri -eq $ArchiveGraph) { $graphType = "ARCHIVE" }
        elseif ($TargetGraphs.Values -contains $graphUri) {
            $graphType = ($TargetGraphs.GetEnumerator() | Where-Object {$_.Value -eq $graphUri}).Key
        }

        Write-Host "  $graphType`: $count triples" -ForegroundColor White
        Write-Host "    URI: $graphUri" -ForegroundColor Gray
    }
} catch {
    Write-Warning "Failed to list all graphs"
}

# 업로드 결과 요약
Write-Host "`n--- Upload Results ---" -ForegroundColor Cyan
$successCount = 0
$errorCount = 0
$totalTriples = 0

foreach ($result in $uploadResults) {
    $status = if ($result.Status -eq "SUCCESS") { "✅" } else { "❌" }
    Write-Host "$status $($result.Name): $($result.Triples) triples" -ForegroundColor White

    if ($result.Status -eq "SUCCESS") {
        $successCount++
        $totalTriples += $result.Triples
    } else {
        $errorCount++
        Write-Host "    Error: $($result.Error)" -ForegroundColor Red
    }
}

Write-Host "`nMigration completed:" -ForegroundColor White
Write-Host "  Successful: $successCount graphs" -ForegroundColor Green
Write-Host "  Failed: $errorCount graphs" -ForegroundColor Red
Write-Host "  Total triples in named graphs: $totalTriples" -ForegroundColor White

# 다음 단계 안내
Write-Host "`n=== Next Steps ===" -ForegroundColor Yellow
Write-Host "1. Validate data integrity:" -ForegroundColor White
Write-Host "   .\scripts\hvdc-named-graph-manager.ps1 -Action validate" -ForegroundColor Gray
Write-Host "2. Test queries with named graphs:" -ForegroundColor White
Write-Host "   .\scripts\hvdc-query-runner.ps1 -QueryFile queries\named-graph-test.rq" -ForegroundColor Gray
Write-Host "3. Update applications to use named graph queries" -ForegroundColor White
Write-Host "4. Configure security (shiro.ini) if needed" -ForegroundColor White

if ($errorCount -gt 0) {
    Write-Host "`n⚠️  Some graphs failed to migrate. Check errors above." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "`n🎉 Migration completed successfully!" -ForegroundColor Green
    exit 0
}
