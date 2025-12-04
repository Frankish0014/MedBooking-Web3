import { useState } from 'react';
import { MapPin, Clock, DollarSign, Calendar, Star, ChevronRight } from 'lucide-react';
import { formatAddress, formatEth } from '../utils/contract';
import BookingModal from './BookingModal';

const DoctorCard = ({ doctor, onBook, isPatient }) => {
  const [showModal, setShowModal] = useState(false);

  const specializationColors = {
    'Cardiology': 'from-red-500 to-rose-600',
    'Dermatology': 'from-pink-500 to-fuchsia-600',
    'Neurology': 'from-purple-500 to-violet-600',
    'Pediatrics': 'from-cyan-500 to-blue-600',
    'Orthopedics': 'from-amber-500 to-orange-600',
    'Psychiatry': 'from-indigo-500 to-blue-600',
    'General Practice': 'from-primary-500 to-emerald-600',
    'default': 'from-primary-500 to-primary-600',
  };

  const getGradient = (spec) => {
    return specializationColors[spec] || specializationColors['default'];
  };

  return (
    <>
      <div className="card-glow group hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradient(doctor.specialization)} flex items-center justify-center text-white font-display font-bold text-xl shadow-lg`}>
            {doctor.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DR'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-lg text-dark-100 truncate">
                {doctor.name || 'Unknown Doctor'}
              </h3>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">4.9</span>
              </div>
            </div>
            
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getGradient(doctor.specialization)} text-white`}>
              {doctor.specialization || 'General'}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-dark-400">
            <MapPin className="w-4 h-4 text-dark-500" />
            <span className="text-sm truncate">{doctor.hospitalName || 'Private Practice'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-dark-400">
            <Clock className="w-4 h-4 text-dark-500" />
            <span className="text-sm">Available Today</span>
          </div>
          
          <div className="flex items-center gap-2 text-dark-400">
            <DollarSign className="w-4 h-4 text-dark-500" />
            <span className="text-sm font-mono">
              {formatEth(doctor.consultationFee)} ETH
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-dark-700 flex items-center justify-between">
          <span className="text-xs text-dark-500 font-mono">
            {formatAddress(doctor.walletAddress)}
          </span>
          
          {isPatient ? (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 text-primary-400 hover:text-primary-300 font-medium text-sm group-hover:gap-2 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              Book Now
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-dark-500">Register as patient to book</span>
          )}
        </div>
      </div>

      {showModal && (
        <BookingModal
          doctor={doctor}
          onClose={() => setShowModal(false)}
          onBook={onBook}
        />
      )}
    </>
  );
};

export default DoctorCard;

