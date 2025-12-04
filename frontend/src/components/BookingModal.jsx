import { useState } from 'react';
import { X, Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import { formatEth, toUnixTimestamp } from '../utils/contract';

const BookingModal = ({ doctor, onClose, onBook }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date || !time || !description) return;
    
    setLoading(true);
    
    const dateTime = toUnixTimestamp(`${date}T${time}:00`);
    const success = await onBook(
      doctor.walletAddress,
      dateTime,
      description,
      doctor.consultationFee
    );
    
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg glass rounded-3xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-dark-100">
            Book Appointment
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-dark-700 text-dark-400 hover:text-dark-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="flex items-center gap-4 p-4 bg-dark-800 rounded-2xl mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-display font-bold">
            {doctor.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DR'}
          </div>
          <div>
            <h3 className="font-semibold text-dark-100">{doctor.name}</h3>
            <p className="text-sm text-dark-400">{doctor.specialization}</p>
            <p className="text-sm text-primary-400 font-mono mt-1">
              {formatEth(doctor.consultationFee)} ETH
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
              <Calendar className="w-4 h-4" />
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              required
              className="input-field"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
              <Clock className="w-4 h-4" />
              Select Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    time === slot
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-600'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
              <FileText className="w-4 h-4" />
              Reason for Visit
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for the appointment..."
              required
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-dark-300">
              <p>Payment of <span className="text-amber-400 font-mono">{formatEth(doctor.consultationFee)} ETH</span> will be held in escrow until the appointment is completed.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !date || !time || !description}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

