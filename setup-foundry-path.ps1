# Quick script to add Foundry to PATH for current session
$foundryPath = "$env:USERPROFILE\.foundry\bin"

# Add to current session
if ($env:PATH -notlike "*$foundryPath*") {
    $env:PATH = "$foundryPath;$env:PATH"
    Write-Host "✅ Foundry added to PATH for this session" -ForegroundColor Green
} else {
    Write-Host "✅ Foundry is already in PATH" -ForegroundColor Green
}

# Verify it works
Write-Host "`nTesting Foundry..." -ForegroundColor Cyan
forge --version
Write-Host "`n✅ Foundry is ready to use!" -ForegroundColor Green
Write-Host "`nYou can now run commands like:" -ForegroundColor Yellow
Write-Host "  forge install <package>" -ForegroundColor White
Write-Host "  forge build" -ForegroundColor White
Write-Host "  forge test" -ForegroundColor White
Write-Host "  anvil" -ForegroundColor White

