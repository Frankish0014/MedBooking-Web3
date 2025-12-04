import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Loader, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import AppointmentCard from '../components/AppointmentCard';

const Appointments = ({
  appointments,
  loading,
  fetchAppointments,
  cancelAppointment,
  completeAppointment,
  isDoctor,
  isPatient,
  isConnected,
}) => {
  useEffect(() => {
    if (isConnected && (isDoctor || isPatient)) {
      fetchAppointments();
    }
  }, [fetchAppointments, isConnected, isDoctor, isPatient]);

  // Not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="card text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-dark-100 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-dark-400 mb-6">
              Please connect your wallet to view your appointments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not registered
  if (!isDoctor && !isPatient) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="card text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-dark-100 mb-2">
              Register First
            </h2>
            <p className="text-dark-400 mb-6">
              You need to register as a patient or doctor to view appointments.
            </p>
            <Link to="/register" className="btn-primary">
              Register Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Stats
  const scheduled = appointments.filter(a => a.status === 0n || a.status === 0).length;
  const completed = appointments.filter(a => a.status === 1n || a.status === 1).length;
  const cancelled = appointments.filter(a => a.status === 2n || a.status === 2).length;

  return (
    <div className="min-h-screen pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-dark-100 mb-2">
              My Appointments
            </h1>
            <p className="text-dark-400">
              {isDoctor ? 'Manage your patient appointments' : 'View and manage your booked appointments'}
            </p>
          </div>
          
          {!isDoctor && (
            <Link to="/doctors" className="btn-primary">
              Book New Appointment
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-dark-100">{scheduled}</p>
              <p className="text-sm text-dark-500">Scheduled</p>
            </div>
          </div>
          
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-dark-100">{completed}</p>
              <p className="text-sm text-dark-500">Completed</p>
            </div>
          </div>
          
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-dark-100">{cancelled}</p>
              <p className="text-sm text-dark-500">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && appointments.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-dark-600" />
            </div>
            <h3 className="font-display font-semibold text-xl text-dark-300 mb-2">
              No Appointments Yet
            </h3>
            <p className="text-dark-500 mb-6">
              {isDoctor 
                ? "You haven't received any appointment bookings yet."
                : "You haven't booked any appointments yet."
              }
            </p>
            {!isDoctor && (
              <Link to="/doctors" className="btn-primary">
                Find a Doctor
              </Link>
            )}
          </div>
        )}

        {/* Appointments List */}
        {!loading && appointments.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment, idx) => (
              <AppointmentCard
                key={appointment.id?.toString() || idx}
                appointment={appointment}
                isDoctor={isDoctor}
                onCancel={cancelAppointment}
                onComplete={completeAppointment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;

