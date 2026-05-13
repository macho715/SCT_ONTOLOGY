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
    python -m py_compile hvdc_readonly_mcp_surface.py hvdc_operational_risk_radar.py hvdc_any_key_resolver.py hvdc_semantic_adapter.py
}

Invoke-Step "Read-only MCP surface pytest suite" {
    python -m pytest test_readonly_mcp_surface.py -v --tb=short
}

Invoke-Step "Operational risk radar regression suite" {
    python -m pytest test_operational_risk_radar.py -v --tb=short
}

Invoke-Step "Any-key resolver regression suite" {
    python -m pytest test_any_key_resolver.py -v --tb=short
}

Invoke-Step "Semantic adapter regression suite" {
    python -m pytest test_semantic_adapter.py -v --tb=short
}

Invoke-Step "Read-only MCP surface static guardrail" {
    $source = Get-Content -Raw "hvdc_readonly_mcp_surface.py"
    $blockedPatterns = @(
        "requests\.",
        "httpx\.",
        "urlopen",
        "open\([^)]*,\s*['""]w",
        "\.write\(",
        "from\s+hvdc_api\s+import",
        "import\s+hvdc_api",
        "nlq_query_wrapper_flask",
        "start-dashboard",
        "gpts_oneclick"
    )

    foreach ($pattern in $blockedPatterns) {
        if ($source -match $pattern) {
            throw "Blocked MCP surface marker found: $pattern"
        }
    }
}

Invoke-Step "Expected MCP surface fixture count" {
    $expected = @(
        "fixtures\mcp_surface\expected_resolve_key.json",
        "fixtures\mcp_surface\expected_risk_radar.json",
        "fixtures\mcp_surface\expected_costguard_pack.json",
        "fixtures\mcp_surface\expected_search_evidence.json",
        "fixtures\mcp_surface\expected_validate_output.json",
        "fixtures\mcp_surface\expected_malformed_input.json",
        "fixtures\mcp_surface\expected_secret_redaction.json"
    )
    foreach ($file in $expected) {
        if (-not (Test-Path $file)) {
            throw "Missing expected MCP surface fixture: $file"
        }
    }
}

Write-Host "PASS: read-only MCP surface verification completed"
