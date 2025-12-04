import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowRight, Wallet, Check } from 'lucide-react';
import { SPECIALIZATIONS } from '../utils/contract';

const Register = ({ 
  isConnected, 
  connectWallet, 
  registerDoctor, 
  registerPatient,
  isDoctor,
  isPatient,
  loading 
}) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // 'patient' or 'doctor'
  
  // Patient form
  const [patientName, setPatientName] = useState('');
  const [patientContact, setPatientContact] = useState('');
  
  // Doctor form
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [consultationFee, setConsultationFee] = useState('');

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    const success = await registerPatient(patientName, patientContact);
    if (success) {
      navigate('/doctors');
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const success = await registerDoctor(doctorName, specialization, hospitalName, consultationFee);
    if (success) {
      navigate('/dashboard');
    }
  };

  // Already registered
  if (isDoctor || isPatient) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="card text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-dark-100 mb-2">
              Already Registered!
            </h2>
            <p className="text-dark-400 mb-6">
              You are registered as a {isDoctor ? 'doctor' : 'patient'}.
            </p>
            <button
              onClick={() => navigate(isDoctor ? '/dashboard' : '/doctors')}
              className="btn-primary"
            >
              Go to {isDoctor ? 'Dashboard' : 'Find Doctors'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="card text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-dark-100 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-dark-400 mb-6">
              Please connect your Web3 wallet to register on the platform.
            </p>
            <button
              onClick={connectWallet}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Role selection
  if (!role) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display font-bold text-4xl text-dark-100 mb-4">
              Join <span className="gradient-text">MedBooking</span>
            </h1>
            <p className="text-dark-400">
              Choose how you want to use the platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient Card */}
            <button
              onClick={() => setRole('patient')}
              className="card-glow text-left group hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-dark-100 mb-2">
                I'm a Patient
              </h3>
              <p className="text-dark-400 mb-4">
                Book appointments with doctors, pay with crypto, and manage your healthcare journey.
              </p>
              <div className="flex items-center gap-2 text-primary-400 font-medium">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Doctor Card */}
            <button
              onClick={() => setRole('doctor')}
              className="card-glow text-left group hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-dark-100 mb-2">
                I'm a Doctor
              </h3>
              <p className="text-dark-400 mb-4">
                Join our network, set your rates, and receive patients globally with instant payments.
              </p>
              <div className="flex items-center gap-2 text-primary-400 font-medium">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Patient Registration Form
  if (role === 'patient') {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setRole(null)}
            className="text-dark-400 hover:text-dark-100 mb-6 flex items-center gap-2"
          >
            ← Back to role selection
          </button>

          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-dark-100">
                  Patient Registration
                </h2>
                <p className="text-sm text-dark-400">Create your patient profile</p>
              </div>
            </div>

            <form onSubmit={handlePatientSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Contact Information
                </label>
                <input
                  type="text"
                  value={patientContact}
                  onChange={(e) => setPatientContact(e.target.value)}
                  placeholder="Email or phone number"
                  required
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !patientName || !patientContact}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Doctor Registration Form
  return (
    <div className="min-h-screen pt-28 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => setRole(null)}
          className="text-dark-400 hover:text-dark-100 mb-6 flex items-center gap-2"
        >
          ← Back to role selection
        </button>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-dark-100">
                Doctor Registration
              </h2>
              <p className="text-sm text-dark-400">Create your professional profile</p>
            </div>
          </div>

          <form onSubmit={handleDoctorSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Dr. Jane Smith"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Specialization
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
                className="input-field"
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Hospital / Clinic Name
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="City General Hospital"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Consultation Fee (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                placeholder="0.01"
                required
                className="input-field"
              />
              <p className="text-xs text-dark-500 mt-1">
                This is the fee patients will pay for each consultation
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !doctorName || !specialization || !hospitalName || !consultationFee}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

