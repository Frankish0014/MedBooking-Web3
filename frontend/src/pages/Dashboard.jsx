import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { formatEth, formatAddress } from '../utils/contract';

const Dashboard = ({
  userProfile,
  appointments,
  fetchAppointments,
  isDoctor,
  isConnected,
  account,
}) => {
  useEffect(() => {
    if (isConnected && isDoctor) {
      fetchAppointments();
    }
  }, [fetchAppointments, isConnected, isDoctor]);

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
            <p className="text-dark-400">
              Please connect your wallet to access the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not a doctor
  if (!isDoctor) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="card text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-dark-100 mb-2">
              Doctor Dashboard
            </h2>
            <p className="text-dark-400 mb-6">
              This dashboard is only available for registered doctors.
            </p>
            <Link to="/register" className="btn-primary">
              Register as Doctor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const scheduled = appointments.filter(a => a.status === 0n || a.status === 0).length;
  const completed = appointments.filter(a => a.status === 1n || a.status === 1).length;
  const totalEarnings = appointments
    .filter(a => a.status === 1n || a.status === 1)
    .reduce((sum, a) => sum + (Number(a.fee) * 0.95), 0); // 95% after platform fee

  return (
    <div className="min-h-screen pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-dark-100 mb-2">
              Doctor Dashboard
            </h1>
            <p className="text-dark-400">
              Welcome back, {userProfile?.name || 'Doctor'}
            </p>
          </div>
          
          <Link to="/appointments" className="btn-secondary flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            View All Appointments
          </Link>
        </div>

        {/* Profile Card */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-display font-bold text-2xl">
              {userProfile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DR'}
            </div>
            
            <div className="flex-1">
              <h2 className="font-display font-bold text-2xl text-dark-100">
                {userProfile?.name || 'Unknown'}
              </h2>
              <p className="text-primary-400 font-medium">{userProfile?.specialization}</p>
              <p className="text-dark-500 text-sm">{userProfile?.hospitalName}</p>
              <p className="text-dark-500 text-sm font-mono mt-1">{formatAddress(account)}</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/30">
                <p className="text-xs text-dark-400 mb-1">Consultation Fee</p>
                <p className="text-lg font-mono font-semibold text-primary-400">
                  {formatEth(userProfile?.consultationFee)} ETH
                </p>
              </div>
              <button className="btn-ghost flex items-center gap-2 text-sm">
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-dark-500">Pending</span>
            </div>
            <p className="text-3xl font-display font-bold text-dark-100">{scheduled}</p>
            <p className="text-sm text-dark-400">Scheduled Appointments</p>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-xs text-dark-500">Done</span>
            </div>
            <p className="text-3xl font-display font-bold text-dark-100">{completed}</p>
            <p className="text-sm text-dark-400">Completed Appointments</p>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs text-dark-500">Total</span>
            </div>
            <p className="text-3xl font-display font-bold text-dark-100">{appointments.length}</p>
            <p className="text-sm text-dark-400">Total Appointments</p>
          </div>
          
          <div className="card bg-gradient-to-br from-primary-600 to-primary-700 border-primary-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-primary-200">Earnings</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">
              {(totalEarnings / 1e18).toFixed(4)}
            </p>
            <p className="text-sm text-primary-200">ETH Earned</p>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-dark-100">
              Recent Appointments
            </h3>
            <Link to="/appointments" className="text-sm text-primary-400 hover:text-primary-300">
              View All →
            </Link>
          </div>
          
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400">No appointments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-dark-500 border-b border-dark-700">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map((apt, idx) => {
                    const status = Number(apt.status);
                    const statusText = ['Scheduled', 'Completed', 'Cancelled', 'No Show'][status];
                    const statusColor = ['text-blue-400', 'text-primary-400', 'text-red-400', 'text-amber-400'][status];
                    
                    return (
                      <tr key={idx} className="border-b border-dark-800 last:border-0">
                        <td className="py-4 font-mono text-dark-300">#{apt.id?.toString()}</td>
                        <td className="py-4">
                          <span className="font-mono text-sm text-dark-400">
                            {formatAddress(apt.patient)}
                          </span>
                        </td>
                        <td className="py-4 text-dark-300">
                          {new Date(Number(apt.dateTime) * 1000).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span className={`${statusColor} font-medium`}>{statusText}</span>
                        </td>
                        <td className="py-4 text-right font-mono text-dark-300">
                          {formatEth(apt.fee)} ETH
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

