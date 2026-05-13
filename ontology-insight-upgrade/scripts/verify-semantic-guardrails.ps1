$ErrorActionPreference = "Stop"

$checks = @(
    @{ Path = "docs/SEMANTIC-ADAPTER-CONTRACT.md"; Pattern = "SEM-01"; Name = "SEM-01 contract marker" },
    @{ Path = "docs/SEMANTIC-ADAPTER-CONTRACT.md"; Pattern = "SEM-02"; Name = "SEM-02 contract marker" },
    @{ Path = "docs/SEMANTIC-ADAPTER-CONTRACT.md"; Pattern = "SEM-03"; Name = "SEM-03 contract marker" },
    @{ Path = "docs/SEMANTIC-ADAPTER-CONTRACT.md"; Pattern = "SEM-04"; Name = "SEM-04 contract marker" },
    @{ Path = "docs/SEMANTIC-ADAPTER-CONTRACT.md"; Pattern = "SEM-05"; Name = "SEM-05 contract marker" },
    @{ Path = "docs/SEMANTIC-ADAPTER-CONTRACT.md"; Pattern = "TEST-01"; Name = "TEST-01 contract marker" },
    @{ Path = "docs/SEMANTIC-ADAPTER-CONTRACT.md"; Pattern = "TEST-02"; Name = "TEST-02 contract marker" },
    @{ Path = "docs/SEMANTIC-ADAPTER-CONTRACT.md"; Pattern = "WarehouseHandlingProfile.confirmedFlowCode"; Name = "Flow Code contract boundary" },
    @{ Path = "hvdc_semantic_adapter.py"; Pattern = "NO_EVIDENCE"; Name = "NO_EVIDENCE adapter state" },
    @{ Path = "hvdc_semantic_adapter.py"; Pattern = "AMBIGUOUS"; Name = "AMBIGUOUS adapter state" },
    @{ Path = "hvdc_semantic_adapter.py"; Pattern = "CONFLICT"; Name = "CONFLICT adapter state" },
    @{ Path = "test_semantic_adapter.py"; Pattern = "confirmedFlowCode outside warehouseHandlingProfile"; Name = "Flow Code negative test" }
)

$blocked = @()
foreach ($check in $checks) {
    if (-not (Test-Path -LiteralPath $check.Path)) {
        $blocked += "BLOCK $($check.Name): missing file $($check.Path)"
        continue
    }
    if (-not (Select-String -LiteralPath $check.Path -Pattern $check.Pattern -Quiet)) {
        $blocked += "BLOCK $($check.Name): missing marker $($check.Pattern)"
    }
}

$fixtureFiles = Get-ChildItem -LiteralPath "fixtures/semantic_adapter" -Filter "*.json" -ErrorAction SilentlyContinue
if ($fixtureFiles.Count -lt 8) {
    $blocked += "BLOCK fixture coverage: expected at least 8 semantic adapter fixtures"
}

if ($blocked.Count -gt 0) {
    $blocked | ForEach-Object { Write-Host $_ }
    exit 1
}

Write-Host "PASS Phase 2 semantic guardrail checks completed. No checks were skipped."
