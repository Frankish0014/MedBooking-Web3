# Troubleshooting: "Revert Alert" When Registering Doctor

## Common Causes and Solutions

### 1. ✅ Network Mismatch (MOST COMMON)

**Problem:** MetaMask shows "Hardhat" network but you're using Anvil.

**Solution:**
1. Open MetaMask
2. Click the network dropdown (top of MetaMask)
3. Make sure you're connected to **"Localhost 8545"** or **"Anvil"** network
4. If it doesn't exist, add it:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`
5. Switch to this network before registering

### 2. ✅ Account Already Registered

**Problem:** Your wallet address is already registered as a doctor.

**Check:**
```powershell
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "doctors(address)(bool)" YOUR_ADDRESS --rpc-url http://localhost:8545
```

If it returns `true`, you're already registered. Use a different account or register as a patient instead.

**Solution:** Use a different MetaMask account or import a new test account from Anvil.

### 3. ✅ Empty Fields Validation

**Problem:** The contract requires:
- Name cannot be empty
- Specialization cannot be empty

**Solution:** Make sure all fields are filled:
- Full Name: Required
- Specialization: Required (select from dropdown)
- Hospital/Clinic Name: Required
- Consultation Fee: Required (must be > 0)

### 4. ✅ Invalid Consultation Fee

**Problem:** Fee must be a valid number > 0.

**Solution:** Enter a valid ETH amount (e.g., 0.01, 0.1, 1.0)

### 5. ✅ Anvil Not Running

**Problem:** The local blockchain isn't running.

**Check:**
```powershell
# Check if Anvil is running
Invoke-WebRequest -Uri "http://localhost:8545" -Method POST -Body '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -ContentType "application/json"
```

**Solution:** Start Anvil:
```powershell
anvil
```

### 6. ✅ Contract Address Mismatch

**Problem:** Frontend is connecting to wrong contract address.

**Check:** Open browser console (F12) and check:
- Contract address should be: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Network Chain ID should be: `31337`

### 7. ✅ Gas Estimation Failure

**Problem:** Transaction fails during gas estimation.

**Solution:** 
- Make sure you have ETH in your account (Anvil accounts have test ETH)
- Check browser console for detailed error messages
- Try increasing gas limit in MetaMask

## Quick Diagnostic Steps

1. **Check Network:**
   - MetaMask → Network → Should show "Localhost 8545" or Chain ID 31337

2. **Check Account Balance:**
   - MetaMask → Your account → Should show ETH balance

3. **Check Browser Console:**
   - Press F12 → Console tab
   - Look for error messages when you try to register

4. **Verify Anvil is Running:**
   ```powershell
   # Should return a block number
   cast block-number --rpc-url http://localhost:8545
   ```

5. **Test Contract Connection:**
   ```powershell
   # Should return owner address
   cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "owner()" --rpc-url http://localhost:8545
   ```

## Getting Detailed Error Messages

After the fix I made, you should now see more detailed error messages in the toast notification. Check:
1. Browser console (F12) for full error details
2. Toast notification for user-friendly error message
3. MetaMask transaction details for revert reason

## Still Having Issues?

1. Check browser console (F12) for detailed errors
2. Verify all prerequisites are met:
   - ✅ Anvil is running
   - ✅ MetaMask is on correct network (Chain ID 31337)
   - ✅ Account has ETH
   - ✅ All form fields are filled
   - ✅ Account is not already registered

