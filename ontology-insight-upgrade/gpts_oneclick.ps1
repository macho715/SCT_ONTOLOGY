<# Development or migration reference only. This file is not a V1 production public surface. Cloudflare MCP is the production direction. #>

<#
One‑click orchestrator for GPTs Actions connectivity via ngrok + schema patch

Usage (PowerShell):
  # 1) 준비: 캔버스의 "HVDC Gateway – OpenAPI 3.1.0 (Compat)"를 openapi.yaml로 저장
  # 2) 실행 예시:
  .\gpts_oneclick.ps1 -AuthToken "<NGROK_TOKEN>" -InSchema ".\openapi.yaml" -OutSchema ".\openapi.updated.yaml" -Port 8080 -StartMock -HostSchema

Switches:
  -StartMock : mock_gateway_server.py를 백그라운드로 기동(없으면 스킵)
  -HostSchema: openapi.updated.yaml을 로컬 http.server(8000) + ngrok로 공개(Builder의 "URL에서 가져오기"용)

Requires:
  - ngrok v3 (winget install ngrok.ngrok)
  - Python 3 (local API/mock + http.server)
  - .\ngrok_setup.ps1, .\update_openapi_schema.py (동일 폴더)
#>
Param(
  [Parameter(Mandatory=$true)][string]$AuthToken,
  [Parameter(Mandatory=$true)][string]$InSchema,
  [string]$OutSchema = "",
  [int]$Port = 8080,
  [switch]$StartMock,
  [switch]$HostSchema,
  [string]$Domain,
  [string]$BasicAuthUser,
  [string]$BasicAuthPass,
  [int]$WaitSec = 3
)
$ErrorActionPreference = 'Stop'
function Log($m,$lvl='INFO'){ $ts=(Get-Date).ToString('yyyy-MM-dd HH:mm:ss'); Write-Host "[$ts][$lvl] $m" }
function Need($cmd,$msg){ if(-not (Get-Command $cmd -ErrorAction SilentlyContinue)){ throw $msg } }

Need 'python'  'Python not found. Install Python 3 first.'
Need 'ngrok'   'ngrok not found. Install with: winget install ngrok.ngrok'

# 0) Mock 서버 기동(선택)
if($StartMock){
  try{
    Log "Starting Mock Gateway on port $Port" 'STEP'
    $wgDir = (Resolve-Path ".").Path
    $p = Start-Process -FilePath python -ArgumentList "mock_gateway_server.py" -WorkingDirectory $wgDir -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds $WaitSec
  } catch { Log "Mock start skipped: $($_.Exception.Message)" 'WARN' }
}

# 1) ngrok 터널 + 공개 URL 획득
Log "Launching ngrok tunnel for :$Port" 'STEP'
$ngrok = .\ngrok_setup.ps1 -AuthToken $AuthToken -Port $Port -Domain $Domain -BasicAuthUser $BasicAuthUser -BasicAuthPass $BasicAuthPass
$PublicUrl = $ngrok.PublicUrl
if(-not $PublicUrl){ throw "Failed to get public URL from ngrok_setup.ps1" }
Log "Public API URL: $PublicUrl" 'OK'

# 2) 스키마 패치 (servers.url → $PublicUrl/v1)
if([string]::IsNullOrWhiteSpace($OutSchema)){
  $root,[string]$ext = [System.IO.Path]::ChangeExtension($InSchema,$null),[System.IO.Path]::GetExtension($InSchema)
  if([string]::IsNullOrWhiteSpace($ext)){ $ext = ".yaml" }
  $OutSchema = "$root.updated$ext"
}
Log "Patching schema → $OutSchema" 'STEP'
python .\update_openapi_schema.py --in "$InSchema" --out "$OutSchema" --url "$PublicUrl" | Write-Host

# 3) (선택) 스키마 호스팅 + 두 번째 터널(8000)
$SchemaUrl = $null
if($HostSchema){
  $schemaDir = Split-Path -Parent (Resolve-Path $OutSchema)
  Log "Hosting schema via http.server :8000 ($schemaDir)" 'STEP'
  $httpProc = Start-Process -FilePath python -ArgumentList "-m http.server 8000" -WorkingDirectory $schemaDir -PassThru -WindowStyle Hidden
  Start-Sleep -Seconds $WaitSec
  Log "Opening second ngrok tunnel for :8000" 'STEP'
  $null = Start-Process -FilePath ngrok -ArgumentList @('http','8000') -NoNewWindow -PassThru
  Start-Sleep -Seconds $WaitSec
  # 4040에서 8000용 공개 URL 조회
  try{
    $tunnels = Invoke-RestMethod -Uri 'http://127.0.0.1:4040/api/tunnels' -TimeoutSec 4
    $SchemaUrl = ($tunnels.tunnels | Where-Object { $_.public_url -like 'https*' -and $_.config.addr -like '*:8000' } | Select-Object -First 1).public_url
  } catch { Log "Failed to fetch second tunnel URL: $($_.Exception.Message)" 'WARN' }
  if($SchemaUrl){ $SchemaUrl = "$SchemaUrl/$(Split-Path -Leaf $OutSchema)"; Log "Schema URL: $SchemaUrl" 'OK' }
}

# 4) 결과 요약 + 클립보드 복사
$serverLine = "servers:`n  - url: $PublicUrl/v1"
$summary = @()
$summary += "Public API:    $PublicUrl"
$summary += "Health:        $PublicUrl/v1/health"
$summary += "Schema file:   $OutSchema"
if($SchemaUrl){ $summary += "Schema URL:    $SchemaUrl" }
$summary += "Paste this into your OpenAPI if needed:"
$summary += $serverLine
$summaryText = ($summary -join "`n")
$summaryText | Set-Clipboard

Write-Host "`n=== ONE-CLICK SUMMARY ===" -ForegroundColor Cyan
Write-Host $summaryText
Write-Host "(The summary has been copied to your clipboard.)" -ForegroundColor DarkGray

# 5) 친절한 다음단계 힌트
Write-Host "`nNext:" -ForegroundColor Yellow
if($SchemaUrl){
  Write-Host "• GPTs Builder → 작업 → 스키마: URL에서 가져오기 → $SchemaUrl" -ForegroundColor Yellow
}else{
  Write-Host "• GPTs Builder → 작업 → 스키마: 붙여넣기 → $OutSchema 내용 전체 복사" -ForegroundColor Yellow
}
Write-Host "• 인증: (헬스만 확인 시) 없음 → 연결 확인 후 API Key(X-API-Key)로 전환" -ForegroundColor Yellow
