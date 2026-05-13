$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$checks = @(
    @{ Requirement = 'HYGIENE-01'; Path = 'docs/SOURCE-HYGIENE.md'; Pattern = 'generated runtime artifacts' },
    @{ Requirement = 'HYGIENE-02'; Path = 'docs/SOURCE-HYGIENE.md'; Pattern = 'file-hash-only' },
    @{ Requirement = 'HYGIENE-02'; Path = 'docs/SOURCE-HYGIENE.md'; Pattern = 'fatal: bad object HEAD' },
    @{ Requirement = 'HYGIENE-03'; Path = 'docs/PUBLIC-SURFACE-BOUNDARY.md'; Pattern = 'Cloudflare MCP is the only V1 production public direction' },
    @{ Requirement = 'EVID-04'; Path = 'docs/AUDIT-EVIDENCE-BOUNDARY.md'; Pattern = 'local CSV/NDJSON evidence' },
    @{ Requirement = 'TEST-05'; Path = 'docs/VERIFICATION-REPORTING-RULES.md'; Pattern = 'live-service checks are reported separately' },
    @{ Requirement = 'TEST-06'; Path = 'docs/VERIFICATION-REPORTING-RULES.md'; Pattern = 'Warnings and skips cannot be reported as PASS' },
    @{ Requirement = 'HYGIENE-01'; Path = '.gitignore'; Pattern = 'artifacts/*.ndjson' },
    @{ Requirement = 'HYGIENE-01'; Path = '.gitignore'; Pattern = 'logs/' },
    @{ Requirement = 'HYGIENE-01'; Path = '.gitignore'; Pattern = 'fuseki/**/data/' },
    @{ Requirement = 'HYGIENE-03'; Path = 'HVDC_GPTS_ACTIONS_GUIDE.md'; Pattern = 'Development or migration reference only' },
    @{ Requirement = 'HYGIENE-03'; Path = 'HVDC_GPTS_ONECLICK_GUIDE.md'; Pattern = 'Development or migration reference only' },
    @{ Requirement = 'HYGIENE-03'; Path = 'openapi.updated.yaml'; Pattern = 'Development or migration reference only' },
    @{ Requirement = 'HYGIENE-03'; Path = 'gpts_oneclick.ps1'; Pattern = 'Development or migration reference only' },
    @{ Requirement = 'HYGIENE-03'; Path = 'ngrok_setup.ps1'; Pattern = 'Development or migration reference only' }
)

$failures = New-Object System.Collections.Generic.List[string]

foreach ($check in $checks) {
    $path = [string]$check.Path
    $pattern = [string]$check.Pattern
    $requirement = [string]$check.Requirement

    if (-not (Test-Path -LiteralPath $path)) {
        $failures.Add("BLOCK [$requirement] missing file: $path")
        continue
    }

    $match = Select-String -LiteralPath $path -SimpleMatch -Pattern $pattern -ErrorAction SilentlyContinue
    if (-not $match) {
        $failures.Add("BLOCK [$requirement] missing marker in ${path}: $pattern")
    }
}

if ($failures.Count -gt 0) {
    foreach ($failure in $failures) {
        Write-Output $failure
    }
    exit 1
}

Write-Output 'PASS Phase 1 source hygiene checks completed. No checks were skipped.'
