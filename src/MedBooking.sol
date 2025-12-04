// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedBooking
 * @author MedChain
 * @notice A decentralized healthcare appointment booking system
 * @dev Allows patients to book appointments with registered doctors
 */
contract MedBooking {
    // ============ Types ============
    
    enum AppointmentStatus {
        Scheduled,
        Completed,
        Cancelled,
        NoShow
    }

    struct Doctor {
        address walletAddress;
        string name;
        string specialization;
        string hospitalName;
        uint256 consultationFee; // in wei
        bool isActive;
        uint256 registeredAt;
    }

    struct Patient {
        address walletAddress;
        string name;
        string contactInfo;
        bool isRegistered;
        uint256 registeredAt;
    }

    struct Appointment {
        uint256 id;
        address patient;
        address doctor;
        uint256 dateTime; // Unix timestamp
        string description;
        AppointmentStatus status;
        uint256 fee;
        uint256 createdAt;
    }

    struct TimeSlot {
        uint256 startTime;
        uint256 endTime;
        bool isAvailable;
    }

    // ============ State Variables ============
    
    address public owner;
    uint256 public platformFeePercent = 5; // 5% platform fee
    uint256 public totalAppointments;
    
    mapping(address => Doctor) public doctors;
    mapping(address => Patient) public patients;
    mapping(uint256 => Appointment) public appointments;
    mapping(address => uint256[]) public doctorAppointments;
    mapping(address => uint256[]) public patientAppointments;
    mapping(address => mapping(uint256 => bool)) public doctorSchedule; // doctor => timestamp => booked
    
    address[] public registeredDoctors;
    address[] public registeredPatients;

    // ============ Events ============
    
    event DoctorRegistered(address indexed doctor, string name, string specialization);
    event DoctorUpdated(address indexed doctor, string name, uint256 fee);
    event DoctorDeactivated(address indexed doctor);
    event PatientRegistered(address indexed patient, string name);
    event AppointmentBooked(uint256 indexed appointmentId, address indexed patient, address indexed doctor, uint256 dateTime);
    event AppointmentCancelled(uint256 indexed appointmentId, address cancelledBy);
    event AppointmentCompleted(uint256 indexed appointmentId);
    event PaymentProcessed(uint256 indexed appointmentId, uint256 amount, address doctor);
    event PlatformFeeUpdated(uint256 newFee);

    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRegisteredDoctor() {
        require(doctors[msg.sender].isActive, "Not a registered active doctor");
        _;
    }

    modifier onlyRegisteredPatient() {
        require(patients[msg.sender].isRegistered, "Not a registered patient");
        _;
    }

    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
    }

    // ============ Doctor Functions ============
    
    /**
     * @notice Register a new doctor on the platform
     * @param _name Doctor's full name
     * @param _specialization Medical specialization
     * @param _hospitalName Hospital or clinic name
     * @param _consultationFee Fee per consultation in wei
     */
    function registerDoctor(
        string memory _name,
        string memory _specialization,
        string memory _hospitalName,
        uint256 _consultationFee
    ) external {
        require(!doctors[msg.sender].isActive, "Doctor already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_specialization).length > 0, "Specialization cannot be empty");
        
        doctors[msg.sender] = Doctor({
            walletAddress: msg.sender,
            name: _name,
            specialization: _specialization,
            hospitalName: _hospitalName,
            consultationFee: _consultationFee,
            isActive: true,
            registeredAt: block.timestamp
        });
        
        registeredDoctors.push(msg.sender);
        
        emit DoctorRegistered(msg.sender, _name, _specialization);
    }

    /**
     * @notice Update doctor profile information
     * @param _name Updated name
     * @param _specialization Updated specialization
     * @param _hospitalName Updated hospital name
     * @param _consultationFee Updated consultation fee
     */
    function updateDoctorProfile(
        string memory _name,
        string memory _specialization,
        string memory _hospitalName,
        uint256 _consultationFee
    ) external onlyRegisteredDoctor {
        Doctor storage doc = doctors[msg.sender];
        doc.name = _name;
        doc.specialization = _specialization;
        doc.hospitalName = _hospitalName;
        doc.consultationFee = _consultationFee;
        
        emit DoctorUpdated(msg.sender, _name, _consultationFee);
    }

    /**
     * @notice Deactivate doctor account
     */
    function deactivateDoctor() external onlyRegisteredDoctor {
        doctors[msg.sender].isActive = false;
        emit DoctorDeactivated(msg.sender);
    }

    // ============ Patient Functions ============
    
    /**
     * @notice Register a new patient on the platform
     * @param _name Patient's full name
     * @param _contactInfo Contact information (phone/email)
     */
    function registerPatient(string memory _name, string memory _contactInfo) external {
        require(!patients[msg.sender].isRegistered, "Patient already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        patients[msg.sender] = Patient({
            walletAddress: msg.sender,
            name: _name,
            contactInfo: _contactInfo,
            isRegistered: true,
            registeredAt: block.timestamp
        });
        
        registeredPatients.push(msg.sender);
        
        emit PatientRegistered(msg.sender, _name);
    }

    /**
     * @notice Update patient profile
     * @param _name Updated name
     * @param _contactInfo Updated contact info
     */
    function updatePatientProfile(string memory _name, string memory _contactInfo) external onlyRegisteredPatient {
        patients[msg.sender].name = _name;
        patients[msg.sender].contactInfo = _contactInfo;
    }

    // ============ Appointment Functions ============
    
    /**
     * @notice Book an appointment with a doctor
     * @param _doctor Address of the doctor
     * @param _dateTime Unix timestamp of appointment
     * @param _description Brief description of the visit reason
     */
    function bookAppointment(
        address _doctor,
        uint256 _dateTime,
        string memory _description
    ) external payable onlyRegisteredPatient {
        require(doctors[_doctor].isActive, "Doctor not found or inactive");
        require(_dateTime > block.timestamp, "Cannot book past appointments");
        require(!doctorSchedule[_doctor][_dateTime], "Time slot not available");
        require(msg.value >= doctors[_doctor].consultationFee, "Insufficient payment");
        
        totalAppointments++;
        uint256 appointmentId = totalAppointments;
        
        appointments[appointmentId] = Appointment({
            id: appointmentId,
            patient: msg.sender,
            doctor: _doctor,
            dateTime: _dateTime,
            description: _description,
            status: AppointmentStatus.Scheduled,
            fee: msg.value,
            createdAt: block.timestamp
        });
        
        doctorSchedule[_doctor][_dateTime] = true;
        doctorAppointments[_doctor].push(appointmentId);
        patientAppointments[msg.sender].push(appointmentId);
        
        emit AppointmentBooked(appointmentId, msg.sender, _doctor, _dateTime);
    }

    /**
     * @notice Cancel an appointment (by patient or doctor)
     * @param _appointmentId ID of the appointment to cancel
     */
    function cancelAppointment(uint256 _appointmentId) external {
        Appointment storage apt = appointments[_appointmentId];
        require(apt.id != 0, "Appointment not found");
        require(apt.status == AppointmentStatus.Scheduled, "Cannot cancel this appointment");
        require(
            msg.sender == apt.patient || msg.sender == apt.doctor,
            "Not authorized to cancel"
        );
        require(apt.dateTime > block.timestamp, "Cannot cancel past appointments");
        
        apt.status = AppointmentStatus.Cancelled;
        doctorSchedule[apt.doctor][apt.dateTime] = false;
        
        // Refund patient
        if (apt.fee > 0) {
            (bool success, ) = apt.patient.call{value: apt.fee}("");
            require(success, "Refund failed");
        }
        
        emit AppointmentCancelled(_appointmentId, msg.sender);
    }

    /**
     * @notice Mark appointment as completed and process payment
     * @param _appointmentId ID of the appointment
     */
    function completeAppointment(uint256 _appointmentId) external {
        Appointment storage apt = appointments[_appointmentId];
        require(apt.id != 0, "Appointment not found");
        require(msg.sender == apt.doctor, "Only doctor can complete appointment");
        require(apt.status == AppointmentStatus.Scheduled, "Invalid appointment status");
        
        apt.status = AppointmentStatus.Completed;
        
        // Calculate fees
        uint256 platformFee = (apt.fee * platformFeePercent) / 100;
        uint256 doctorPayment = apt.fee - platformFee;
        
        // Pay doctor
        (bool success, ) = apt.doctor.call{value: doctorPayment}("");
        require(success, "Payment to doctor failed");
        
        emit AppointmentCompleted(_appointmentId);
        emit PaymentProcessed(_appointmentId, doctorPayment, apt.doctor);
    }

    /**
     * @notice Mark patient as no-show
     * @param _appointmentId ID of the appointment
     */
    function markNoShow(uint256 _appointmentId) external {
        Appointment storage apt = appointments[_appointmentId];
        require(apt.id != 0, "Appointment not found");
        require(msg.sender == apt.doctor, "Only doctor can mark no-show");
        require(apt.status == AppointmentStatus.Scheduled, "Invalid appointment status");
        require(block.timestamp > apt.dateTime + 30 minutes, "Too early to mark no-show");
        
        apt.status = AppointmentStatus.NoShow;
        
        // Doctor still gets paid for no-shows (minus platform fee)
        uint256 platformFee = (apt.fee * platformFeePercent) / 100;
        uint256 doctorPayment = apt.fee - platformFee;
        
        (bool success, ) = apt.doctor.call{value: doctorPayment}("");
        require(success, "Payment failed");
    }

    // ============ View Functions ============
    
    /**
     * @notice Get all registered doctors
     * @return Array of doctor addresses
     */
    function getAllDoctors() external view returns (address[] memory) {
        return registeredDoctors;
    }

    /**
     * @notice Get active doctors only
     * @return Array of active doctor structs
     */
    function getActiveDoctors() external view returns (Doctor[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < registeredDoctors.length; i++) {
            if (doctors[registeredDoctors[i]].isActive) {
                activeCount++;
            }
        }
        
        Doctor[] memory activeDocs = new Doctor[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < registeredDoctors.length; i++) {
            if (doctors[registeredDoctors[i]].isActive) {
                activeDocs[index] = doctors[registeredDoctors[i]];
                index++;
            }
        }
        
        return activeDocs;
    }

    /**
     * @notice Get doctor's appointments
     * @param _doctor Doctor's address
     * @return Array of appointment IDs
     */
    function getDoctorAppointments(address _doctor) external view returns (uint256[] memory) {
        return doctorAppointments[_doctor];
    }

    /**
     * @notice Get patient's appointments
     * @param _patient Patient's address
     * @return Array of appointment IDs
     */
    function getPatientAppointments(address _patient) external view returns (uint256[] memory) {
        return patientAppointments[_patient];
    }

    /**
     * @notice Check if a time slot is available for a doctor
     * @param _doctor Doctor's address
     * @param _dateTime Unix timestamp
     * @return True if available
     */
    function isSlotAvailable(address _doctor, uint256 _dateTime) external view returns (bool) {
        return !doctorSchedule[_doctor][_dateTime] && doctors[_doctor].isActive;
    }

    /**
     * @notice Get doctor details
     * @param _doctor Doctor's address
     * @return Doctor struct
     */
    function getDoctorDetails(address _doctor) external view returns (Doctor memory) {
        return doctors[_doctor];
    }

    /**
     * @notice Get appointment details
     * @param _appointmentId Appointment ID
     * @return Appointment struct
     */
    function getAppointmentDetails(uint256 _appointmentId) external view returns (Appointment memory) {
        return appointments[_appointmentId];
    }

    // ============ Admin Functions ============
    
    /**
     * @notice Update platform fee percentage
     * @param _newFee New fee percentage (0-20)
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 20, "Fee too high");
        platformFeePercent = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    /**
     * @notice Withdraw accumulated platform fees
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Transfer ownership
     * @param _newOwner New owner address
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }

    // ============ Fallback ============
    
    receive() external payable {}
}

