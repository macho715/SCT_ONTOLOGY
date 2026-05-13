<# Development or migration reference only. This file is not a V1 production public surface. Cloudflare MCP is the production direction. #>

Param(
  [switch]$DryRun,
  [int]$Port = 8080,
  [string]$AuthToken,
  [string]$Domain,
  [string]$BasicAuthUser,
  [string]$BasicAuthPass,
  [string]$ConfigPath = "$HOME/.config/ngrok/ngrok.yml",
  [string]$OutEnvFile = "$env:TEMP/hvdc_public_url.txt",
  [int]$StartWaitSec = 3,
  [int]$TimeoutSec = 30
)

$ErrorActionPreference = 'Stop'

function Write-Log {
  param([string]$Msg,[string]$Level='INFO')
  $ts = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  Write-Host "[$ts][$Level] $Msg"
}

function Test-Cmd {
  param([string]$Name)
  try { $null = Get-Command $Name -ErrorAction Stop; return $true } catch { return $false }
}

function Invoke-WithRetry {
  param([scriptblock]$Script,[int]$TimeoutSec=15,[int]$DelayMs=500)
  $sw = [Diagnostics.Stopwatch]::StartNew()
  $last = $null
  while ($sw.Elapsed.TotalSeconds -lt $TimeoutSec) {
    try { return & $Script } catch { $last = $_; Start-Sleep -Milliseconds $DelayMs }
  }
  if ($last) { throw $last } else { throw "Timeout after $TimeoutSec s" }
}

# 0) ngrok 확인 & AuthToken 등록
if (-not (Test-Cmd 'ngrok')) {
  throw "ngrok not found. Install with: winget install ngrok.ngrok"
}
if ($AuthToken) {
  Write-Log "Registering ngrok authtoken" 'STEP'
  ngrok config add-authtoken $AuthToken | Out-Null
}

# 1) 로컬 Mock Gateway 헬스 확인
Write-Log "Checking local gateway: http://localhost:$Port/v1/health" 'STEP'
$localOk = $false
try {
  $resp = Invoke-WithRetry { Invoke-RestMethod -Uri "http://127.0.0.1:$Port/v1/health" -TimeoutSec 3 } -TimeoutSec 8 -DelayMs 500
  if ($resp.status -ne 'ok') { throw "Unexpected health payload: $($resp | ConvertTo-Json -Compress)" }
  $localOk = $true
} catch {
  Write-Log "Local health failed: $($_.Exception.Message)" 'WARN'
}
if (-not $localOk -and -not $DryRun) { throw "Local gateway is not healthy. Start it first or use -DryRun." }

# 2) ngrok 실행 파라미터 구성
$argsList = @('http')
if ($Domain) { $argsList += @('--domain', $Domain) }
if ($BasicAuthUser -and $BasicAuthPass) { $argsList += @('--basic-auth', "$BasicAuthUser`:$BasicAuthPass") }
$argsList += @($Port)

Write-Log ("Launching ngrok: ngrok {0}" -f ($argsList -join ' ')) 'STEP'
if (-not $DryRun) {
  # 백그라운드 실행
  $p = Start-Process -FilePath ngrok -ArgumentList $argsList -NoNewWindow -PassThru
}
Start-Sleep -Seconds $StartWaitSec

# 3) ngrok 로컬 API에서 public URL 조회
$publicUrl = $null
if (-not $DryRun) {
  try {
    $tunnels = Invoke-WithRetry { Invoke-RestMethod -Uri 'http://127.0.0.1:4040/api/tunnels' -TimeoutSec 2 } -TimeoutSec $TimeoutSec -DelayMs 400
    $https = $tunnels.tunnels | Where-Object { $_.public_url -like 'https*' } | Select-Object -First 1
    if ($https) { $publicUrl = $https.public_url }
    if (-not $publicUrl) { throw "No https tunnel found from ngrok inspector." }
  } catch {
    throw "Failed to obtain public URL from ngrok: $($_.Exception.Message)"
  }
} else {
  $publicUrl = 'https://example.ngrok.app'
}

# 4) 공개 엔드포인트 헬스 확인
Write-Log "Public URL: $publicUrl" 'OK'
$healthUrl = "$publicUrl/v1/health"
if (-not $DryRun) {
  $pub = Invoke-WithRetry { Invoke-RestMethod -Uri $healthUrl -TimeoutSec 4 } -TimeoutSec 15 -DelayMs 500
  if ($pub.status -ne 'ok') { throw "Public health unexpected: $($pub | ConvertTo-Json -Compress)" }
  Write-Log "Public health OK" 'OK'
}

# 5) 결과 저장
Set-Content -Path $OutEnvFile -Value $publicUrl -Encoding ascii
Write-Log "Saved public URL to $OutEnvFile" 'OK'

# 6) 샘플 스키마 서버 URL 안내
$serverLine = "servers:`n  - url: $publicUrl/v1"
Write-Host "`nReplace in OpenAPI schema:`n$serverLine" -ForegroundColor Cyan

# 출력 오브젝트
[pscustomobject]@{
  PublicUrl = $publicUrl
  HealthUrl = $healthUrl
  Domain    = $Domain
  BasicAuth = [bool]($BasicAuthUser -and $BasicAuthPass)
  DryRun    = [bool]$DryRun
}
