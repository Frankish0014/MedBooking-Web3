# Script to check if an account is already registered as a doctor
param(
    [Parameter(Mandatory=$true)]
    [string]$Address
)

$env:PATH = "$env:USERPROFILE\.foundry\bin;$env:PATH"
$contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

Write-Host "`n=== Checking Doctor Registration Status ===" -ForegroundColor Cyan
Write-Host "Account: $Address" -ForegroundColor Yellow
Write-Host "Contract: $contractAddress" -ForegroundColor Yellow
Write-Host ""

# Check if account is registered
$result = cast call $contractAddress "doctors(address)(bool)" $Address --rpc-url http://localhost:8545 2>&1

if ($LASTEXITCODE -eq 0) {
    if ($result -match "true") {
        Write-Host "❌ Account IS already registered as a doctor!" -ForegroundColor Red
        Write-Host "`nSolution: Use a different MetaMask account or register as a patient instead." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Account is NOT registered as a doctor" -ForegroundColor Green
        Write-Host "`nYou should be able to register. If you're still getting errors, check:" -ForegroundColor Yellow
        Write-Host "  1. Network is Localhost 8545 (Chain ID: 31337)" -ForegroundColor White
        Write-Host "  2. All form fields are filled" -ForegroundColor White
        Write-Host "  3. Anvil is running" -ForegroundColor White
    }
} else {
    Write-Host "❌ Error checking status: $result" -ForegroundColor Red
    Write-Host "`nMake sure:" -ForegroundColor Yellow
    Write-Host "  1. Anvil is running (http://localhost:8545)" -ForegroundColor White
    Write-Host "  2. Contract is deployed" -ForegroundColor White
    Write-Host "  3. Address is correct" -ForegroundColor White
}

Write-Host ""

