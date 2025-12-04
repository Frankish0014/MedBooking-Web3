# 🚀 Quick Start Guide - Using MedBooking Frontend

## Step 1: Start the Frontend

Open a terminal in the project root and run:

```powershell
cd frontend
npm run dev
```

The frontend will start at: **http://localhost:3000** (or check the terminal output for the actual port)

## Step 2: Open in Browser

1. Open your browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:3000** (or the port shown in terminal)
3. You should see the MedBooking homepage

## Step 3: Connect MetaMask

1. **Make sure MetaMask is set up:**
   - Network: "Localhost 8545" (Chain ID: 31337)
   - Test account imported with ETH

2. **Click "Connect Wallet"** button on the homepage

3. **Approve the connection** in MetaMask popup

4. **You're connected!** ✅

## Step 4: Use the App

### Register as a Doctor:
1. Click **"Register"** in the navigation
2. Select **"I'm a Doctor"**
3. Fill in:
   - Full Name
   - Specialization (select from dropdown)
   - Hospital/Clinic Name
   - Consultation Fee (in ETH, e.g., 0.01)
4. Click **"Complete Registration"**
5. **Approve transaction in MetaMask** (click "Confirm")
6. Wait for confirmation ✅

### Register as a Patient:
1. Click **"Register"** in the navigation
2. Select **"I'm a Patient"**
3. Fill in:
   - Full Name
   - Contact Information (email/phone)
4. Click **"Complete Registration"**
5. **Approve transaction in MetaMask** (click "Confirm")
6. Wait for confirmation ✅

### Browse Doctors:
1. Click **"Doctors"** in the navigation
2. See all available doctors
3. Click **"Book Appointment"** on any doctor
4. Select date/time
5. Enter description
6. **Approve payment in MetaMask**
7. Appointment booked! ✅

### View Appointments:
1. Click **"Appointments"** in the navigation
2. See all your appointments
3. Cancel if needed (as patient)
4. Complete appointments (as doctor)

### Dashboard:
1. Click **"Dashboard"** in the navigation
2. See your profile and statistics
3. View earnings (if doctor)

## Navigation Pages

- **Home** (`http://localhost:3000/`) - Landing page with app overview
- **Doctors** (`http://localhost:3000/doctors`) - Browse and book doctors
- **Register** (`http://localhost:3000/register`) - Register as doctor or patient
- **Appointments** (`http://localhost:3000/appointments`) - View your appointments
- **Dashboard** (`http://localhost:3000/dashboard`) - Your profile and stats

## Important Notes

1. **Always approve transactions in MetaMask:**
   - When you see a MetaMask popup, click "Confirm" or "Approve"
   - Don't click "Reject" or it will cancel the transaction

2. **Stay on Localhost 8545 network:**
   - Make sure MetaMask shows "Localhost 8545"
   - Chain ID must be 31337

3. **Keep Anvil running:**
   - Don't close the terminal where Anvil is running
   - If Anvil stops, transactions will fail

4. **Use different accounts for testing:**
   - One account for doctor
   - Another account for patient
   - This lets you test the full booking flow

## Troubleshooting

### "Connect Wallet" doesn't work:
- Check MetaMask is installed
- Make sure you're on Localhost 8545 network
- Try refreshing the page

### Transactions keep failing:
- Verify Chain ID is 31337
- Check Anvil is running
- Make sure you have ETH in your account
- Check browser console (F12) for errors

### Can't see doctors:
- Make sure at least one doctor is registered
- Try refreshing the page
- Check browser console for errors

### Frontend won't start:
```powershell
cd frontend
npm install  # Install dependencies
npm run dev  # Start server
```

## Quick Commands

**Start Frontend:**
```powershell
cd frontend
npm run dev
```

**Start Anvil (if not running):**
```powershell
anvil
```

**Check if everything is running:**
- Frontend: http://localhost:3000 (or check terminal for actual port)
- Anvil: http://localhost:8545

## Full Workflow Example

1. **Start Anvil** (in Terminal 1):
   ```powershell
   anvil
   ```

2. **Start Frontend** (in Terminal 2):
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Open Browser:**
   - Go to http://localhost:3000 (or the port shown in terminal)

4. **Connect MetaMask:**
   - Click "Connect Wallet"
   - Approve connection

5. **Register as Doctor:**
   - Go to Register → I'm a Doctor
   - Fill form → Submit → Approve in MetaMask

6. **Switch Account in MetaMask:**
   - Import another test account
   - Connect to app

7. **Register as Patient:**
   - Go to Register → I'm a Patient
   - Fill form → Submit → Approve in MetaMask

8. **Book Appointment:**
   - Go to Doctors page
   - Click "Book Appointment"
   - Select time → Pay → Approve in MetaMask

9. **View Appointments:**
   - Go to Appointments page
   - See your bookings

Enjoy using MedBooking! 🏥

