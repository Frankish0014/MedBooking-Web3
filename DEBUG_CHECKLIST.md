# Debug Checklist - What's Not Working?

## Quick Diagnostic Steps

### 1. Check Browser Console
1. Open your browser
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Look for **red error messages**
5. Copy any errors you see

### 2. Check MetaMask
- Is MetaMask installed?
- Is it unlocked?
- Are you on the correct network? (Localhost 8545, Chain ID: 31337)
- Do you have ETH in your account?

### 3. Check Network Connection
- Is Anvil running? (Check terminal)
- Is Frontend running? (Check terminal)
- Can you access http://localhost:3000?

### 4. Common Issues

#### "Connect Wallet" doesn't work:
- Check MetaMask is installed
- Check you're on Localhost 8545 network
- Try refreshing the page
- Check browser console for errors

#### Transaction keeps failing:
- Check Chain ID is 31337
- Check Anvil is running
- Check you have ETH
- Check browser console for error details
- Make sure you click "Confirm" in MetaMask (not "Reject")

#### "Network error" or "Provider not found":
- Anvil might not be running
- Start Anvil: `anvil`
- Refresh the page

#### "Contract not found":
- Contract might not be deployed
- Check contract address is correct
- Redeploy if needed

#### Page won't load:
- Frontend might not be running
- Start frontend: `cd frontend && npm run dev`
- Check terminal for errors

## Get Help

When reporting issues, include:
1. **What you're trying to do**
2. **Exact error message** (from browser console)
3. **What happens** when you try
4. **Screenshot** if possible

## Quick Fixes

### Restart Everything:
```powershell
# Terminal 1: Start Anvil
anvil

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### Reset MetaMask:
1. Disconnect from the app
2. Switch to a different network
3. Switch back to Localhost 8545
4. Reconnect to the app

### Clear Browser Cache:
1. Press Ctrl+Shift+Delete
2. Clear cache
3. Refresh page

