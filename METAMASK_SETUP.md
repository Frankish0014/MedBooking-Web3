# MetaMask Setup Guide for Local Anvil Testnet

## Step-by-Step Instructions

### Step 1: Add Localhost Network to MetaMask

1. **Open MetaMask** (click the extension icon in your browser)

2. **Click the Network Dropdown** (top of MetaMask, usually shows "Ethereum Mainnet" or another network)

3. **Click "Add Network"** or **"Add a network manually"**

4. **Enter the following details:**
   ```
   Network Name: Localhost 8545
   RPC URL: http://127.0.0.1:8545
   Chain ID: 31337
   Currency Symbol: ETH
   Block Explorer URL: (leave empty)
   ```

5. **Click "Save"**

### Step 2: Import a Test Account (Get Free Test ETH)

Anvil provides test accounts with free ETH. Here's how to import one:

1. **Get a Test Account from Anvil:**
   - Open the terminal where Anvil is running
   - You'll see a list of accounts with private keys
   - Copy one of the private keys (starts with `0x`)

   Example accounts from Anvil:
   ```
   Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

2. **Import to MetaMask:**
   - In MetaMask, click the account icon (circle at top right)
   - Click "Import Account"
   - Paste the private key
   - Click "Import"

3. **Verify you have ETH:**
   - You should see a balance (usually 10,000 ETH or more)
   - This is test ETH, not real money!

### Step 3: Switch to Localhost Network

1. **Click the network dropdown** in MetaMask
2. **Select "Localhost 8545"**
3. **Verify Chain ID shows: 31337**

### Step 4: Connect to the App

1. **Open the MedBooking app** in your browser (http://localhost:5173)
2. **Click "Connect Wallet"** button
3. **MetaMask will ask for permission** - click "Next" then "Connect"
4. **You're connected!**

## Common Issues & Solutions

### Issue: "Network not found" or "Wrong network"

**Solution:**
- Make sure Anvil is running (`anvil` command in terminal)
- Verify the RPC URL is exactly: `http://127.0.0.1:8545`
- Check Chain ID is exactly: `31337` (no spaces)

### Issue: "Insufficient funds"

**Solution:**
- Make sure you imported an account from Anvil
- Anvil accounts come with free test ETH
- If balance is 0, restart Anvil to get fresh accounts

### Issue: "Transaction keeps failing"

**Solution:**
- Make sure you're on "Localhost 8545" network (Chain ID: 31337)
- Check that Anvil is still running
- Try refreshing the page and reconnecting wallet

### Issue: "Can't see Localhost network"

**Solution:**
- Make sure you added it manually (not using a preset)
- Try restarting MetaMask
- Check that Anvil is running first

## Quick Checklist

Before using the app, verify:

- [ ] Anvil is running (check terminal)
- [ ] MetaMask has "Localhost 8545" network added
- [ ] Chain ID shows 31337
- [ ] You've imported a test account from Anvil
- [ ] Your account has ETH balance
- [ ] You're connected to the app

## Test Accounts (Default Anvil Accounts)

If you need test accounts, here are the default ones from Anvil:

**Account 1:**
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Account 2:**
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Account 3:**
- Address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- Private Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`

## Tips

1. **Use separate accounts for testing:**
   - One account for doctor registration
   - Another account for patient registration
   - This helps test the full flow

2. **Keep Anvil running:**
   - Don't close the terminal where Anvil is running
   - If you restart Anvil, you'll need to re-import accounts

3. **Reset if needed:**
   - If something goes wrong, you can restart Anvil
   - This resets the blockchain state
   - You'll need to redeploy the contract

## Visual Guide

```
MetaMask Setup Flow:
┌─────────────────┐
│ 1. Open MetaMask│
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ 2. Click Network Dropdown│
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 3. Add Network Manually  │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 4. Enter Network Details │
│    - Name: Localhost 8545│
│    - RPC: 127.0.0.1:8545│
│    - Chain ID: 31337    │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 5. Import Test Account  │
│    (from Anvil)         │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 6. Switch to Localhost  │
│    Network              │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 7. Connect to App       │
└─────────────────────────┘
```

## Need Help?

If you're still having issues:
1. Check that Anvil is running: `http://localhost:8545` should respond
2. Verify network settings in MetaMask match exactly
3. Try importing a fresh account from Anvil
4. Check browser console (F12) for errors

