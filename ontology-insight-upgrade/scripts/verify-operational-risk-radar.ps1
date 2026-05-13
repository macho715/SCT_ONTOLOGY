$ErrorActionPreference = "Stop"

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][scriptblock]$Script
    )

    Write-Host "==> $Name"
    & $Script
}

Invoke-Step "Python syntax check" {
    python -m py_compile hvdc_operational_risk_radar.py hvdc_any_key_resolver.py hvdc_semantic_adapter.py
}

Invoke-Step "Operational risk radar pytest suite" {
    python -m pytest test_operational_risk_radar.py -v --tb=short
}

Invoke-Step "Any-key resolver regression suite" {
    python -m pytest test_any_key_resolver.py -v --tb=short
}

Invoke-Step "Semantic adapter regression suite" {
    python -m pytest test_semantic_adapter.py -v --tb=short
}

Invoke-Step "Read-only radar static guardrail" {
    $source = Get-Content -Raw "hvdc_operational_risk_radar.py"
    $blockedPatterns = @(
        "requests\.",
        "httpx\.",
        "urlopen",
        "open\([^)]*,\s*['""]w",
        "\.write\(",
        "upload",
        "oauth"
    )

    foreach ($pattern in $blockedPatterns) {
        if ($source -match $pattern) {
            throw "Blocked radar mutation/network marker found: $pattern"
        }
    }
}

Invoke-Step "Expected risk radar fixture count" {
    $expected = @(
        "fixtures\risk_radar\expected_radar_invoice.json",
        "fixtures\risk_radar\expected_radar_site.json",
        "fixtures\risk_radar\expected_costguard_pack.json",
        "fixtures\risk_radar\expected_missing_evidence.json"
    )
    foreach ($file in $expected) {
        if (-not (Test-Path $file)) {
            throw "Missing expected risk radar fixture: $file"
        }
    }
}

Write-Host "PASS: operational risk radar verification completed"
