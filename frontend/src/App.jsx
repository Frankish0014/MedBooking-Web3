import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Register from './pages/Register';
import Appointments from './pages/Appointments';
import Dashboard from './pages/Dashboard';
import useWallet from './hooks/useWallet';
import useMedBooking from './hooks/useMedBooking';

function App() {
  const {
    account,
    contract,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isConnected,
  } = useWallet();

  const {
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
  } = useMedBooking(contract, account);

  // Fetch user profile when connected
  useEffect(() => {
    if (isConnected) {
      fetchUserProfile();
    }
  }, [isConnected, fetchUserProfile]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        account={account}
        isConnecting={isConnecting}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        isDoctor={isDoctor}
        isPatient={isPatient}
      />

      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={<Home isConnected={isConnected} />} 
          />
          <Route
            path="/doctors"
            element={
              <Doctors
                doctors={doctors}
                loading={loading}
                fetchDoctors={fetchDoctors}
                bookAppointment={bookAppointment}
                isPatient={isPatient}
                isConnected={isConnected}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                isConnected={isConnected}
                connectWallet={connectWallet}
                registerDoctor={registerDoctor}
                registerPatient={registerPatient}
                isDoctor={isDoctor}
                isPatient={isPatient}
                loading={loading}
              />
            }
          />
          <Route
            path="/appointments"
            element={
              <Appointments
                appointments={appointments}
                loading={loading}
                fetchAppointments={fetchAppointments}
                cancelAppointment={cancelAppointment}
                completeAppointment={completeAppointment}
                isDoctor={isDoctor}
                isPatient={isPatient}
                isConnected={isConnected}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                userProfile={userProfile}
                appointments={appointments}
                fetchAppointments={fetchAppointments}
                isDoctor={isDoctor}
                isConnected={isConnected}
                account={account}
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

