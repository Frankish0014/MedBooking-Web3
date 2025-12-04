// Contract ABI - Generated from MedBooking.sol
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  // Events
  "event DoctorRegistered(address indexed doctor, string name, string specialization)",
  "event DoctorUpdated(address indexed doctor, string name, uint256 fee)",
  "event DoctorDeactivated(address indexed doctor)",
  "event PatientRegistered(address indexed patient, string name)",
  "event AppointmentBooked(uint256 indexed appointmentId, address indexed patient, address indexed doctor, uint256 dateTime)",
  "event AppointmentCancelled(uint256 indexed appointmentId, address cancelledBy)",
  "event AppointmentCompleted(uint256 indexed appointmentId)",
  "event PaymentProcessed(uint256 indexed appointmentId, uint256 amount, address doctor)",
  
  // Read Functions
  "function owner() view returns (address)",
  "function platformFeePercent() view returns (uint256)",
  "function totalAppointments() view returns (uint256)",
  "function doctors(address) view returns (address walletAddress, string name, string specialization, string hospitalName, uint256 consultationFee, bool isActive, uint256 registeredAt)",
  "function patients(address) view returns (address walletAddress, string name, string contactInfo, bool isRegistered, uint256 registeredAt)",
  "function appointments(uint256) view returns (uint256 id, address patient, address doctor, uint256 dateTime, string description, uint8 status, uint256 fee, uint256 createdAt)",
  "function getAllDoctors() view returns (address[])",
  "function getActiveDoctors() view returns (tuple(address walletAddress, string name, string specialization, string hospitalName, uint256 consultationFee, bool isActive, uint256 registeredAt)[])",
  "function getDoctorAppointments(address) view returns (uint256[])",
  "function getPatientAppointments(address) view returns (uint256[])",
  "function isSlotAvailable(address, uint256) view returns (bool)",
  "function getDoctorDetails(address) view returns (tuple(address walletAddress, string name, string specialization, string hospitalName, uint256 consultationFee, bool isActive, uint256 registeredAt))",
  "function getAppointmentDetails(uint256) view returns (tuple(uint256 id, address patient, address doctor, uint256 dateTime, string description, uint8 status, uint256 fee, uint256 createdAt))",
  
  // Write Functions - Doctor
  "function registerDoctor(string name, string specialization, string hospitalName, uint256 consultationFee)",
  "function updateDoctorProfile(string name, string specialization, string hospitalName, uint256 consultationFee)",
  "function deactivateDoctor()",
  
  // Write Functions - Patient
  "function registerPatient(string name, string contactInfo)",
  "function updatePatientProfile(string name, string contactInfo)",
  
  // Write Functions - Appointments
  "function bookAppointment(address doctor, uint256 dateTime, string description) payable",
  "function cancelAppointment(uint256 appointmentId)",
  "function completeAppointment(uint256 appointmentId)",
  "function markNoShow(uint256 appointmentId)",
  
  // Admin Functions
  "function updatePlatformFee(uint256 newFee)",
  "function withdrawPlatformFees()",
  "function transferOwnership(address newOwner)",
];

export const AppointmentStatus = {
  0: "Scheduled",
  1: "Completed", 
  2: "Cancelled",
  3: "NoShow",
};

export const SPECIALIZATIONS = [
  "General Practice",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Urology",
];

export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEth = (wei) => {
  if (!wei) return "0";
  const eth = Number(wei) / 1e18;
  return eth.toFixed(4);
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const toUnixTimestamp = (date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

