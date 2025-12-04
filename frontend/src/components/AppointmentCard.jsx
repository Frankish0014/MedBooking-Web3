import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatAddress, formatEth, formatDate, AppointmentStatus } from '../utils/contract';

const AppointmentCard = ({ 
  appointment, 
  isDoctor, 
  onCancel, 
  onComplete,
  doctorInfo,
  patientInfo 
}) => {
  const status = AppointmentStatus[appointment.status] || 'Unknown';
  
  const statusConfig = {
    Scheduled: {
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    Completed: {
      icon: CheckCircle,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/30',
    },
    Cancelled: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
    },
    NoShow: {
      icon: AlertCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
  };

  const config = statusConfig[status] || statusConfig.Scheduled;
  const StatusIcon = config.icon;

  const isPast = Number(appointment.dateTime) * 1000 < Date.now();
  const canCancel = status === 'Scheduled' && !isPast;
  const canComplete = status === 'Scheduled' && isDoctor;

  return (
    <div className={`card ${config.bg} ${config.border} border`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${config.bg} ${config.border} border flex items-center justify-center`}>
            <StatusIcon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}>
              {status}
            </span>
            <p className="text-xs text-dark-500 mt-1 font-mono">
              ID: #{appointment.id?.toString()}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-mono font-semibold text-dark-100">
            {formatEth(appointment.fee)} ETH
          </p>
          <p className="text-xs text-dark-500">Consultation Fee</p>
        </div>
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-dark-900/50 rounded-xl">
        <div className="flex items-center gap-2 text-dark-300">
          <Calendar className="w-4 h-4 text-dark-500" />
          <span className="text-sm">{formatDate(appointment.dateTime)}</span>
        </div>
      </div>

      {/* Person Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
          {isDoctor 
            ? (patientInfo?.name?.[0] || 'P')
            : (doctorInfo?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DR')
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-dark-100 truncate">
            {isDoctor ? (patientInfo?.name || 'Patient') : (doctorInfo?.name || 'Doctor')}
          </p>
          <p className="text-xs text-dark-500 font-mono">
            {formatAddress(isDoctor ? appointment.patient : appointment.doctor)}
          </p>
        </div>
      </div>

      {/* Description */}
      {appointment.description && (
        <div className="mb-4 p-3 bg-dark-900/50 rounded-xl">
          <p className="text-xs text-dark-500 mb-1">Reason for visit:</p>
          <p className="text-sm text-dark-300">{appointment.description}</p>
        </div>
      )}

      {/* Actions */}
      {(canCancel || canComplete) && (
        <div className="flex gap-2 pt-4 border-t border-dark-700">
          {canCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 font-medium text-sm hover:bg-red-500/20 transition-colors"
            >
              Cancel Appointment
            </button>
          )}
          {canComplete && (
            <button
              onClick={() => onComplete(appointment.id)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/30 font-medium text-sm hover:bg-primary-500/20 transition-colors"
            >
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;

