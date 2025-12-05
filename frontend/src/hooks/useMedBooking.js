import { useState, useCallback } from 'react';
import { parseEther } from 'ethers';
import toast from 'react-hot-toast';

export const useMedBooking = (contract, account) => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);

  // Fetch user profile (check if registered as doctor or patient)
  const fetchUserProfile = useCallback(async () => {
    if (!contract || !account) return;

    try {
      // Check if registered as doctor
      try {
        const doctorData = await contract.getDoctorDetails(account);
        // Check if doctor is actually registered (isActive will be false for unregistered)
        if (doctorData && doctorData.isActive) {
          setIsDoctor(true);
          setIsPatient(false);
          setUserProfile({
            type: 'doctor',
            ...doctorData,
          });
          return;
        }
      } catch (doctorErr) {
        // If getDoctorDetails fails, user is not a doctor - continue to check patient
        // Only log if it's not a "missing revert data" error (which is expected for unregistered users)
        if (!doctorErr.message?.includes("missing revert data") && 
            !doctorErr.message?.includes("CALL_EXCEPTION")) {
          console.log("Doctor check failed (user not registered as doctor):", doctorErr.message);
        }
      }

      // Check if registered as patient
      try {
        const patientData = await contract.patients(account);
        if (patientData && patientData.isRegistered) {
          setIsPatient(true);
          setIsDoctor(false);
          setUserProfile({
            type: 'patient',
            ...patientData,
          });
          return;
        }
      } catch (patientErr) {
        // If patients() fails, user is not registered as patient
        if (!patientErr.message?.includes("missing revert data") && 
            !patientErr.message?.includes("CALL_EXCEPTION")) {
          console.log("Patient check failed (user not registered as patient):", patientErr.message);
        }
      }

      // If we get here, user is not registered as either
      setIsDoctor(false);
      setIsPatient(false);
      setUserProfile(null);
    } catch (err) {
      // Handle RPC errors more gracefully
      if (err.message?.includes("too many errors") || 
          err.message?.includes("RPC endpoint")) {
        console.error("RPC endpoint error - make sure Anvil is running on http://localhost:8545");
        // Don't throw - just log and reset state
        setIsDoctor(false);
        setIsPatient(false);
        setUserProfile(null);
      } else {
        console.error("Error fetching user profile:", err);
        setIsDoctor(false);
        setIsPatient(false);
        setUserProfile(null);
      }
    }
  }, [contract, account]);

  // Fetch all active doctors
  const fetchDoctors = useCallback(async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const activeDoctors = await contract.getActiveDoctors();
      setDoctors(activeDoctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Fetch appointments (for patient or doctor)
  const fetchAppointments = useCallback(async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      let appointmentIds = [];

      if (isDoctor) {
        appointmentIds = await contract.getDoctorAppointments(account);
      } else if (isPatient) {
        appointmentIds = await contract.getPatientAppointments(account);
      }

      const appointmentDetails = await Promise.all(
        appointmentIds.map(id => contract.getAppointmentDetails(id))
      );

      setAppointments(appointmentDetails);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  }, [contract, account, isDoctor, isPatient]);

  // Register as doctor
  const registerDoctor = useCallback(async (name, specialization, hospitalName, consultationFee) => {
    if (!contract || !account) {
      toast.error("Please connect your wallet first", { id: "register-doctor" });
      return false;
    }

    try {
      setLoading(true);
      
      // Check if already registered before attempting registration
      try {
        const doctorData = await contract.getDoctorDetails(account);
        if (doctorData && doctorData.isActive) {
          toast.error("You are already registered as a doctor!", { id: "register-doctor" });
          setLoading(false);
          return false;
        }
      } catch (checkErr) {
        // If check fails (user not registered), continue with registration attempt
        // This is expected for new registrations
        if (!checkErr.message?.includes("missing revert data") && 
            !checkErr.message?.includes("CALL_EXCEPTION")) {
          console.log("Pre-check note:", checkErr.message);
        }
      }
      
      // Validate inputs
      if (!name || !specialization || !hospitalName || !consultationFee) {
        toast.error("Please fill in all fields", { id: "register-doctor" });
        setLoading(false);
        return false;
      }

      const feeInWei = parseEther(consultationFee.toString());
      
      toast.loading("Registering doctor...", { id: "register-doctor" });
      
      const tx = await contract.registerDoctor(name, specialization, hospitalName, feeInWei);
      await tx.wait();
      
      toast.success("Successfully registered as doctor!", { id: "register-doctor" });
      await fetchUserProfile();
      return true;
    } catch (err) {
      console.error("Error registering doctor:", err);
      
      // Handle RPC errors first
      if (err.message?.includes("too many errors") || 
          err.message?.includes("RPC endpoint") ||
          err.code === "UNKNOWN_ERROR") {
        const errorMessage = "RPC endpoint error. Please ensure Anvil is running on http://localhost:8545";
        toast.error(errorMessage, { id: "register-doctor", duration: 10000 });
        return false;
      }
      
      // Extract more detailed error message
      let errorMessage = "Failed to register as doctor";
      
      // Try to extract revert reason from various error formats
      if (err.reason) {
        errorMessage = err.reason;
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.data?.data) {
        // Try to decode revert reason from error data
        try {
          const revertReason = err.data.data;
          if (revertReason && revertReason.length > 10) {
            errorMessage = `Transaction reverted: ${revertReason}`;
          }
        } catch (e) {
          console.log("Could not decode revert reason:", e);
        }
      } else if (err.error?.data?.message) {
        errorMessage = err.error.data.message;
      } else if (err.error?.message) {
        errorMessage = err.error.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Check for common MetaMask errors
      if (err.code === 4001 || 
          errorMessage.includes("user rejected") || 
          errorMessage.includes("User denied") ||
          errorMessage.includes("ACTION_REJECTED") ||
          errorMessage.includes("denied transaction")) {
        errorMessage = "Transaction was cancelled. Please approve the transaction in MetaMask to complete registration.";
        toast.error(errorMessage, { id: "register-doctor", duration: 5000 });
        return false;
      } else if (errorMessage.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction";
      } else if (errorMessage.includes("network") || errorMessage.includes("chain")) {
        errorMessage = "Network error. Please ensure you're on Localhost 8545 (Chain ID: 31337)";
      } else if (errorMessage.includes("missing revert data") || 
                 errorMessage.includes("CALL_EXCEPTION")) {
        errorMessage = "Contract call failed. Please ensure the contract is deployed and Anvil is running.";
      }
      
      toast.error(errorMessage, { id: "register-doctor", duration: 8000 });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, account, fetchUserProfile]);

  // Register as patient
  const registerPatient = useCallback(async (name, contactInfo) => {
    if (!contract || !account) {
      toast.error("Please connect your wallet first", { id: "register-patient" });
      return false;
    }

    try {
      setLoading(true);
      
      // Check if already registered before attempting registration
      try {
        const patientData = await contract.patients(account);
        if (patientData && patientData.isRegistered) {
          toast.error("You are already registered as a patient!", { id: "register-patient" });
          setLoading(false);
          return false;
        }
      } catch (checkErr) {
        // If check fails (user not registered), continue with registration attempt
        // This is expected for new registrations
        if (!checkErr.message?.includes("missing revert data") && 
            !checkErr.message?.includes("CALL_EXCEPTION")) {
          console.log("Pre-check note:", checkErr.message);
        }
      }
      
      // Validate inputs
      if (!name || !contactInfo) {
        toast.error("Please fill in all fields", { id: "register-patient" });
        setLoading(false);
        return false;
      }
      
      toast.loading("Registering patient...", { id: "register-patient" });
      
      const tx = await contract.registerPatient(name, contactInfo);
      await tx.wait();
      
      toast.success("Successfully registered as patient!", { id: "register-patient" });
      await fetchUserProfile();
      return true;
    } catch (err) {
      console.error("Error registering patient:", err);
      
      // Handle RPC errors first
      if (err.message?.includes("too many errors") || 
          err.message?.includes("RPC endpoint") ||
          err.code === "UNKNOWN_ERROR") {
        const errorMessage = "RPC endpoint error. Please ensure Anvil is running on http://localhost:8545";
        toast.error(errorMessage, { id: "register-patient", duration: 10000 });
        return false;
      }
      
      // Extract more detailed error message
      let errorMessage = "Failed to register as patient";
      
      // Try to extract revert reason from various error formats
      if (err.reason) {
        errorMessage = err.reason;
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.data?.data) {
        // Try to decode revert reason from error data
        try {
          const revertReason = err.data.data;
          if (revertReason && revertReason.length > 10) {
            errorMessage = `Transaction reverted: ${revertReason}`;
          }
        } catch (e) {
          console.log("Could not decode revert reason:", e);
        }
      } else if (err.error?.data?.message) {
        errorMessage = err.error.data.message;
      } else if (err.error?.message) {
        errorMessage = err.error.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Check for common MetaMask errors
      if (err.code === 4001 || 
          errorMessage.includes("user rejected") || 
          errorMessage.includes("User denied") ||
          errorMessage.includes("ACTION_REJECTED") ||
          errorMessage.includes("denied transaction")) {
        errorMessage = "Transaction was cancelled. Please approve the transaction in MetaMask to complete registration.";
        toast.error(errorMessage, { id: "register-patient", duration: 5000 });
        return false;
      } else if (errorMessage.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction";
      } else if (errorMessage.includes("network") || errorMessage.includes("chain")) {
        errorMessage = "Network error. Please ensure you're on Localhost 8545 (Chain ID: 31337)";
      } else if (errorMessage.includes("missing revert data") || 
                 errorMessage.includes("CALL_EXCEPTION")) {
        errorMessage = "Contract call failed. Please ensure the contract is deployed and Anvil is running.";
      }
      
      toast.error(errorMessage, { id: "register-patient", duration: 8000 });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, account, fetchUserProfile]);

  // Book appointment
  const bookAppointment = useCallback(async (doctorAddress, dateTime, description, fee) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.bookAppointment(doctorAddress, dateTime, description, {
        value: fee,
      });
      
      toast.loading("Booking appointment...", { id: "book-appointment" });
      await tx.wait();
      
      toast.success("Appointment booked successfully!", { id: "book-appointment" });
      await fetchAppointments();
      return true;
    } catch (err) {
      console.error("Error booking appointment:", err);
      toast.error(err.reason || "Failed to book appointment", { id: "book-appointment" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, fetchAppointments]);

  // Cancel appointment
  const cancelAppointment = useCallback(async (appointmentId) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.cancelAppointment(appointmentId);
      
      toast.loading("Cancelling appointment...", { id: "cancel-appointment" });
      await tx.wait();
      
      toast.success("Appointment cancelled successfully!", { id: "cancel-appointment" });
      await fetchAppointments();
      return true;
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      toast.error(err.reason || "Failed to cancel appointment", { id: "cancel-appointment" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, fetchAppointments]);

  // Complete appointment (doctor only)
  const completeAppointment = useCallback(async (appointmentId) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.completeAppointment(appointmentId);
      
      toast.loading("Completing appointment...", { id: "complete-appointment" });
      await tx.wait();
      
      toast.success("Appointment completed!", { id: "complete-appointment" });
      await fetchAppointments();
      return true;
    } catch (err) {
      console.error("Error completing appointment:", err);
      toast.error(err.reason || "Failed to complete appointment", { id: "complete-appointment" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, fetchAppointments]);

  // Check slot availability
  const checkSlotAvailable = useCallback(async (doctorAddress, dateTime) => {
    if (!contract) return false;

    try {
      return await contract.isSlotAvailable(doctorAddress, dateTime);
    } catch (err) {
      console.error("Error checking slot:", err);
      return false;
    }
  }, [contract]);

  return {
    loading,
    doctors,
    appointments,
    userProfile,
    isDoctor,
    isPatient,
    fetchUserProfile,
    fetchDoctors,
    fetchAppointments,
    registerDoctor,
    registerPatient,
    bookAppointment,
    cancelAppointment,
    completeAppointment,
    checkSlotAvailable,
  };
};

export default useMedBooking;

