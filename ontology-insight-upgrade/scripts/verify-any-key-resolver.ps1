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
    python -m py_compile hvdc_any_key_resolver.py hvdc_semantic_adapter.py
}

Invoke-Step "Resolver pytest suite" {
    python -m pytest test_any_key_resolver.py -v --tb=short
}

Invoke-Step "Semantic adapter regression suite" {
    python -m pytest test_semantic_adapter.py -v --tb=short
}

Invoke-Step "Read-only resolver static guardrail" {
    $source = Get-Content -Raw "hvdc_any_key_resolver.py"
    $blockedPatterns = @(
        "requests\.",
        "httpx\.",
        "urlopen",
        "open\([^)]*,\s*['""]w",
        "\.write\(",
        "upload",
        "oauth",
        "commit_write",
        "write_file_commit"
    )

    foreach ($pattern in $blockedPatterns) {
        if ($source -match $pattern) {
            throw "Blocked resolver mutation/network marker found: $pattern"
        }
    }
}

Invoke-Step "Expected resolver fixture count" {
    $expected = @(
        "fixtures\resolver\expected_hvdc_code_context.json",
        "fixtures\resolver\expected_invoice_context.json",
        "fixtures\resolver\expected_ambiguous_container.json",
        "fixtures\resolver\expected_conflicting_bl.json",
        "fixtures\resolver\expected_missing_boe.json"
    )
    foreach ($file in $expected) {
        if (-not (Test-Path $file)) {
            throw "Missing expected resolver fixture: $file"
        }
    }
}

Write-Host "PASS: any-key resolver verification completed"
