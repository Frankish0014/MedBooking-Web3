# 🏥 MedBooking - Web3 Healthcare Appointment System

A decentralized healthcare appointment booking platform built on Ethereum. Patients can book appointments with registered doctors and pay using cryptocurrency.

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)
![Foundry](https://img.shields.io/badge/Foundry-Latest-orange)
![React](https://img.shields.io/badge/React-18-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### For Patients
- 🔍 Browse verified doctors by specialization
- 📅 Book appointments with available time slots
- 💰 Pay consultation fees in ETH (held in escrow)
- 🔄 Cancel appointments with automatic refund
- 📊 View appointment history

### For Doctors
- 📝 Register professional profile on-chain
- 💵 Set consultation fees in ETH
- ✅ Mark appointments as completed to receive payment
- 📈 Dashboard with earnings and statistics
- 🚫 Mark no-shows

### Platform Features
- 🔒 Secure smart contract escrow payments
- 📱 Responsive modern UI
- 🦊 MetaMask wallet integration
- ⛽ Transparent 5% platform fee

## 🛠️ Tech Stack

**Smart Contracts:**
- Solidity 0.8.20
- Foundry (Forge, Cast, Anvil)

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- ethers.js v6
- React Router v6
- Lucide Icons

## 📁 Project Structure

```
foundryprojects/
├── src/
│   └── MedBooking.sol      # Main smart contract
├── script/
│   └── Deploy.s.sol        # Deployment scripts
├── test/
│   └── MedBooking.t.sol    # Smart contract tests
├── lib/
│   └── forge-std/          # Foundry standard library
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks (wallet, contract)
│   │   ├── pages/          # Page components
│   │   └── utils/          # Contract ABI & helpers
│   └── package.json
├── foundry.toml            # Foundry configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

1. **Install Foundry:**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Install Node.js** (v18 or later)

3. **Install MetaMask** browser extension

### Smart Contract Setup

1. **Clone the repository:**
   ```bash
   cd foundryprojects
   ```

2. **Install dependencies:**
   ```bash
   forge install
   ```

3. **Compile contracts:**
   ```bash
   forge build
   ```

4. **Run tests:**
   ```bash
   forge test -vvv
   ```

5. **Deploy locally (Anvil):**
   ```bash
   # Terminal 1: Start local blockchain
   anvil

   # Terminal 2: Deploy contract
   forge script script/Deploy.s.sol:DeployMedBookingLocal --rpc-url http://localhost:8545 --broadcast
   ```

6. **Deploy to Sepolia testnet:**
   ```bash
   # Copy and fill environment variables
   cp .env.example .env
   
   # Deploy
   forge script script/Deploy.s.sol:DeployMedBooking --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your deployed contract address
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:** http://localhost:3000

## 📜 Smart Contract API

### Doctor Functions
| Function | Description |
|----------|-------------|
| `registerDoctor(name, specialization, hospital, fee)` | Register as a doctor |
| `updateDoctorProfile(...)` | Update profile info |
| `deactivateDoctor()` | Deactivate account |
| `completeAppointment(id)` | Mark appointment done & receive payment |
| `markNoShow(id)` | Mark patient as no-show |

### Patient Functions
| Function | Description |
|----------|-------------|
| `registerPatient(name, contact)` | Register as a patient |
| `bookAppointment(doctor, dateTime, description)` | Book (pay ETH) |
| `cancelAppointment(id)` | Cancel & get refund |

### View Functions
| Function | Description |
|----------|-------------|
| `getActiveDoctors()` | Get all active doctors |
| `getDoctorAppointments(address)` | Get doctor's appointments |
| `getPatientAppointments(address)` | Get patient's appointments |
| `isSlotAvailable(doctor, timestamp)` | Check slot availability |

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test test_BookAppointment -vvv

# Gas report
forge test --gas-report
```

## 🔐 Security Considerations

- Payments are held in escrow until appointment completion
- Only the patient or doctor can cancel their appointments
- Refunds are automatic on cancellation
- Owner can only withdraw platform fees
- No external dependencies (no oracles required)

## 🗺️ Roadmap

- [ ] Add ERC-20 token payment support
- [ ] Implement reputation/rating system
- [ ] Add recurring appointments
- [ ] IPFS storage for medical records
- [ ] Multi-chain deployment
- [ ] Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ on Ethereum
