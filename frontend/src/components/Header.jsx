import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, LogOut, Stethoscope, User, Calendar, Home } from 'lucide-react';
import { formatAddress } from '../utils/contract';

const Header = ({ account, isConnecting, connectWallet, disconnectWallet, isDoctor, isPatient }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'My Appointments', href: '/appointments', icon: Calendar },
  ];

  if (!isDoctor && !isPatient && account) {
    navigation.push({ name: 'Register', href: '/register', icon: User });
  }

  if (isDoctor) {
    navigation.push({ name: 'Dashboard', href: '/dashboard', icon: User });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass mx-4 mt-4 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 4v8M8 8h8" />
                  <path d="M8 16c0 2.2 1.8 4 4 4s4-1.8 4-4" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-dark-100 hidden sm:block">
                Med<span className="gradient-text">Booking</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/10 text-primary-400'
                        : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Wallet Button */}
            <div className="flex items-center gap-3">
              {account ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-600">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                    <span className="text-sm font-mono text-dark-200">
                      {formatAddress(account)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="p-2 rounded-xl bg-dark-800 border border-dark-600 text-dark-300 hover:text-red-400 hover:border-red-500/50 transition-all duration-200"
                    title="Disconnect"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="btn-primary flex items-center gap-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-dark-800 border border-dark-600 text-dark-300 hover:text-dark-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-dark-700 py-4 px-4">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/10 text-primary-400'
                        : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

