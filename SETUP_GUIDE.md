# MedBooking Setup Guide

## Current Status ✅

- ✅ Node.js installed (v25.2.1)
- ✅ npm installed (v11.6.2)
- ✅ Frontend dependencies installed
- ✅ Foundry installed (v1.5.0-stable) - **INSTALLED AND WORKING!**
- ✅ forge-std library installed
- ✅ MedBooking contract built successfully
- ✅ Anvil local blockchain running
- ✅ Contract deployed at: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- ✅ Frontend configured and running

## Step 1: Install Foundry (REQUIRED)

Foundry is required to build and deploy the smart contract. On Windows, you have several options:

### Option A: Download foundryup.exe manually
1. Go to: https://github.com/foundry-rs/foundry/releases/latest
2. Download `foundryup.exe` for Windows
3. Run `foundryup.exe` in PowerShell (may require admin)
4. Restart your terminal

### Option B: Use Git Bash or WSL
If you have Git Bash or WSL installed:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Option C: Use Chocolatey (if installed)
```powershell
choco install foundry
```

## Step 2: Verify Foundry Installation

After installing, verify it works:
```powershell
forge --version
anvil --version
```

## Step 3: Build and Deploy Contract

Once Foundry is installed:

```powershell
# Install Foundry dependencies
forge install

# Build the contract
forge build

# Run tests
forge test

# Start Anvil (in a separate terminal)
anvil

# Deploy to local Anvil (in another terminal)
forge script script/Deploy.s.sol:DeployMedBookingLocal --rpc-url http://localhost:8545 --broadcast
```

**Copy the deployed contract address from the output!**

## Step 4: Configure Frontend

1. Create `.env` file in the `frontend` directory:
```env
VITE_CONTRACT_ADDRESS=0x... (paste the address from Step 3)
```

2. Or update `frontend/src/utils/contract.js` directly with the contract address.

## Step 5: Start Frontend

```powershell
cd frontend
npm run dev
```

The app will open at http://localhost:5173 (or the port shown in terminal)

## Step 6: Configure MetaMask

1. Add Localhost network:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. Import a test account from Anvil (use one of the private keys shown when you started Anvil)

## Using Foundry in New PowerShell Terminals

If you open a new PowerShell terminal and `forge` is not recognized, run this first:

```powershell
$env:PATH = "$env:USERPROFILE\.foundry\bin;$env:PATH"
```

Or use the helper script:
```powershell
.\setup-foundry-path.ps1
```

**Note:** Foundry is permanently added to your PATH, but you may need to restart PowerShell or run the command above in new terminals.

## Troubleshooting

- **"Forge not found"**: Run `$env:PATH = "$env:USERPROFILE\.foundry\bin;$env:PATH"` in your current terminal, or restart PowerShell
- **"Contract not found"**: Make sure you deployed the contract and updated the address
- **"Insufficient funds"**: Import a test account with ETH from Anvil
- **"Network error"**: Make sure Anvil is running

