// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MedBooking} from "../src/MedBooking.sol";

contract MedBookingTest is Test {
    MedBooking public medBooking;
    
    address public owner = address(this);
    address public doctor1 = makeAddr("doctor1");
    address public doctor2 = makeAddr("doctor2");
    address public patient1 = makeAddr("patient1");
    address public patient2 = makeAddr("patient2");
    
    uint256 public constant CONSULTATION_FEE = 0.01 ether;
    uint256 public constant APPOINTMENT_TIME = 1735689600; // Jan 1, 2025 00:00:00 UTC

    function setUp() public {
        medBooking = new MedBooking();
        
        // Fund test accounts
        vm.deal(patient1, 10 ether);
        vm.deal(patient2, 10 ether);
        vm.deal(doctor1, 1 ether);
        vm.deal(doctor2, 1 ether);
    }

    // ============ Doctor Registration Tests ============
    
    function test_RegisterDoctor() public {
        vm.prank(doctor1);
        medBooking.registerDoctor(
            "Dr. Alice Smith",
            "Cardiology",
            "City General Hospital",
            CONSULTATION_FEE
        );
        
        MedBooking.Doctor memory doc = medBooking.getDoctorDetails(doctor1);
        
        assertEq(doc.walletAddress, doctor1);
        assertEq(doc.name, "Dr. Alice Smith");
        assertEq(doc.specialization, "Cardiology");
        assertEq(doc.hospitalName, "City General Hospital");
        assertEq(doc.consultationFee, CONSULTATION_FEE);
        assertTrue(doc.isActive);
    }

    function test_RevertWhen_DoctorAlreadyRegistered() public {
        vm.startPrank(doctor1);
        medBooking.registerDoctor("Dr. Alice", "Cardiology", "Hospital A", CONSULTATION_FEE);
        
        vm.expectRevert("Doctor already registered");
        medBooking.registerDoctor("Dr. Alice Again", "Neurology", "Hospital B", CONSULTATION_FEE);
        vm.stopPrank();
    }

    function test_RevertWhen_DoctorNameEmpty() public {
        vm.prank(doctor1);
        vm.expectRevert("Name cannot be empty");
        medBooking.registerDoctor("", "Cardiology", "Hospital", CONSULTATION_FEE);
    }

    function test_UpdateDoctorProfile() public {
        vm.startPrank(doctor1);
        medBooking.registerDoctor("Dr. Alice", "Cardiology", "Hospital A", CONSULTATION_FEE);
        
        medBooking.updateDoctorProfile(
            "Dr. Alice Smith",
            "Cardiology & Internal Medicine",
            "Premium Medical Center",
            0.02 ether
        );
        vm.stopPrank();
        
        MedBooking.Doctor memory doc = medBooking.getDoctorDetails(doctor1);
        assertEq(doc.name, "Dr. Alice Smith");
        assertEq(doc.consultationFee, 0.02 ether);
    }

    function test_DeactivateDoctor() public {
        vm.startPrank(doctor1);
        medBooking.registerDoctor("Dr. Alice", "Cardiology", "Hospital A", CONSULTATION_FEE);
        medBooking.deactivateDoctor();
        vm.stopPrank();
        
        MedBooking.Doctor memory doc = medBooking.getDoctorDetails(doctor1);
        assertFalse(doc.isActive);
    }

    // ============ Patient Registration Tests ============
    
    function test_RegisterPatient() public {
        vm.prank(patient1);
        medBooking.registerPatient("John Doe", "john@email.com");
        
        (address walletAddress, string memory name, string memory contactInfo, bool isRegistered,) = medBooking.patients(patient1);
        
        assertEq(walletAddress, patient1);
        assertEq(name, "John Doe");
        assertEq(contactInfo, "john@email.com");
        assertTrue(isRegistered);
    }

    function test_RevertWhen_PatientAlreadyRegistered() public {
        vm.startPrank(patient1);
        medBooking.registerPatient("John Doe", "john@email.com");
        
        vm.expectRevert("Patient already registered");
        medBooking.registerPatient("John Again", "john2@email.com");
        vm.stopPrank();
    }

    // ============ Appointment Booking Tests ============
    
    function test_BookAppointment() public {
        // Setup
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        // Book appointment
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Regular checkup"
        );
        
        MedBooking.Appointment memory apt = medBooking.getAppointmentDetails(1);
        
        assertEq(apt.id, 1);
        assertEq(apt.patient, patient1);
        assertEq(apt.doctor, doctor1);
        assertEq(apt.dateTime, APPOINTMENT_TIME);
        assertEq(uint(apt.status), uint(MedBooking.AppointmentStatus.Scheduled));
        assertEq(apt.fee, CONSULTATION_FEE);
    }

    function test_RevertWhen_InsufficientPayment() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        vm.prank(patient1);
        vm.expectRevert("Insufficient payment");
        medBooking.bookAppointment{value: 0.001 ether}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
    }

    function test_RevertWhen_TimeSlotNotAvailable() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        _registerPatient(patient2);
        
        // First booking
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
        
        // Second booking at same time should fail
        vm.prank(patient2);
        vm.expectRevert("Time slot not available");
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Another checkup"
        );
    }

    function test_RevertWhen_BookingPastAppointment() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        vm.prank(patient1);
        vm.expectRevert("Cannot book past appointments");
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            block.timestamp - 1 hours,
            "Checkup"
        );
    }

    // ============ Appointment Cancellation Tests ============
    
    function test_CancelAppointment_ByPatient() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
        
        uint256 patientBalanceBefore = patient1.balance;
        
        vm.prank(patient1);
        medBooking.cancelAppointment(1);
        
        MedBooking.Appointment memory apt = medBooking.getAppointmentDetails(1);
        assertEq(uint(apt.status), uint(MedBooking.AppointmentStatus.Cancelled));
        assertEq(patient1.balance, patientBalanceBefore + CONSULTATION_FEE);
    }

    function test_CancelAppointment_ByDoctor() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
        
        vm.prank(doctor1);
        medBooking.cancelAppointment(1);
        
        MedBooking.Appointment memory apt = medBooking.getAppointmentDetails(1);
        assertEq(uint(apt.status), uint(MedBooking.AppointmentStatus.Cancelled));
    }

    function test_RevertWhen_UnauthorizedCancellation() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        _registerPatient(patient2);
        
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
        
        vm.prank(patient2);
        vm.expectRevert("Not authorized to cancel");
        medBooking.cancelAppointment(1);
    }

    // ============ Appointment Completion Tests ============
    
    function test_CompleteAppointment() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
        
        uint256 doctorBalanceBefore = doctor1.balance;
        uint256 expectedPayment = CONSULTATION_FEE - (CONSULTATION_FEE * 5 / 100); // 5% platform fee
        
        vm.prank(doctor1);
        medBooking.completeAppointment(1);
        
        MedBooking.Appointment memory apt = medBooking.getAppointmentDetails(1);
        assertEq(uint(apt.status), uint(MedBooking.AppointmentStatus.Completed));
        assertEq(doctor1.balance, doctorBalanceBefore + expectedPayment);
    }

    function test_RevertWhen_NonDoctorCompletesAppointment() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
        
        vm.prank(patient1);
        vm.expectRevert("Only doctor can complete appointment");
        medBooking.completeAppointment(1);
    }

    // ============ View Functions Tests ============
    
    function test_GetActiveDoctors() public {
        _registerDoctor(doctor1);
        
        vm.prank(doctor2);
        medBooking.registerDoctor("Dr. Bob", "Dermatology", "Hospital B", CONSULTATION_FEE);
        
        MedBooking.Doctor[] memory activeDocs = medBooking.getActiveDoctors();
        assertEq(activeDocs.length, 2);
    }

    function test_IsSlotAvailable() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        assertTrue(medBooking.isSlotAvailable(doctor1, APPOINTMENT_TIME));
        
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
        
        assertFalse(medBooking.isSlotAvailable(doctor1, APPOINTMENT_TIME));
    }

    function test_GetDoctorAppointments() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
        
        uint256[] memory docApts = medBooking.getDoctorAppointments(doctor1);
        assertEq(docApts.length, 1);
        assertEq(docApts[0], 1);
    }

    // ============ Admin Functions Tests ============
    
    function test_UpdatePlatformFee() public {
        medBooking.updatePlatformFee(10);
        assertEq(medBooking.platformFeePercent(), 10);
    }

    function test_RevertWhen_PlatformFeeTooHigh() public {
        vm.expectRevert("Fee too high");
        medBooking.updatePlatformFee(25);
    }

    function test_RevertWhen_NonOwnerUpdatesFee() public {
        vm.prank(patient1);
        vm.expectRevert("Only owner can call this function");
        medBooking.updatePlatformFee(10);
    }

    function test_WithdrawPlatformFees() public {
        _registerDoctor(doctor1);
        _registerPatient(patient1);
        
        vm.prank(patient1);
        medBooking.bookAppointment{value: CONSULTATION_FEE}(
            doctor1,
            APPOINTMENT_TIME,
            "Checkup"
        );
        
        vm.prank(doctor1);
        medBooking.completeAppointment(1);
        
        uint256 ownerBalanceBefore = owner.balance;
        uint256 contractBalance = address(medBooking).balance;
        
        medBooking.withdrawPlatformFees();
        
        assertEq(owner.balance, ownerBalanceBefore + contractBalance);
    }

    function test_TransferOwnership() public {
        address newOwner = makeAddr("newOwner");
        
        medBooking.transferOwnership(newOwner);
        
        assertEq(medBooking.owner(), newOwner);
    }

    // ============ Helper Functions ============
    
    function _registerDoctor(address _doctor) internal {
        vm.prank(_doctor);
        medBooking.registerDoctor(
            "Dr. Test",
            "General",
            "Test Hospital",
            CONSULTATION_FEE
        );
    }

    function _registerPatient(address _patient) internal {
        vm.prank(_patient);
        medBooking.registerPatient("Test Patient", "test@email.com");
    }
}

