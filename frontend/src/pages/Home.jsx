import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe, Users, Activity, Clock } from 'lucide-react';

const Home = ({ isConnected }) => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'All appointments and payments are recorded on the blockchain, ensuring complete transparency and security.',
      gradient: 'from-primary-500 to-emerald-600',
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Automatic payment processing through smart contracts. No intermediaries, no delays.',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: Globe,
      title: 'Decentralized',
      description: 'No central authority. Patients and doctors interact directly through the blockchain.',
      gradient: 'from-blue-500 to-indigo-600',
    },
  ];

  const stats = [
    { value: '1000+', label: 'Doctors', icon: Users },
    { value: '50K+', label: 'Appointments', icon: Activity },
    { value: '24/7', label: 'Availability', icon: Clock },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm text-dark-300">Powered by Ethereum Smart Contracts</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-bold text-5xl md:text-7xl text-dark-100 mb-6 animate-slide-up">
            Healthcare Meets
            <br />
            <span className="gradient-text">Web3 Innovation</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-10 animate-slide-up delay-100">
            Book appointments with verified doctors, pay securely with cryptocurrency, 
            and take control of your healthcare journey on the blockchain.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
            <Link
              to="/doctors"
              className="btn-primary flex items-center gap-2 text-lg"
            >
              Find a Doctor
              <ArrowRight className="w-5 h-5" />
            </Link>
            {!isConnected && (
              <Link
                to="/register"
                className="btn-secondary flex items-center gap-2 text-lg"
              >
                Join as Doctor
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 animate-slide-up delay-300">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-display font-bold text-2xl text-dark-100">{stat.value}</p>
                    <p className="text-sm text-dark-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-dark-100 mb-4">
              Why Choose MedBooking?
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Experience the future of healthcare with our decentralized booking platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="card-glow group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-dark-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-dark-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-dark-100 mb-4">
              How It Works
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Connect Wallet', desc: 'Link your MetaMask or any Web3 wallet' },
              { step: '02', title: 'Register', desc: 'Create your patient or doctor profile' },
              { step: '03', title: 'Book', desc: 'Find a doctor and book your appointment' },
              { step: '04', title: 'Pay & Confirm', desc: 'Secure payment held in smart contract' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-dark-600 to-transparent" />
                )}
                <div className="card text-center relative z-10">
                  <span className="font-display font-bold text-4xl gradient-text">{item.step}</span>
                  <h3 className="font-display font-semibold text-lg text-dark-100 mt-4 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-dark-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-gradient-to-br from-primary-600 to-primary-700 border-primary-500 text-center py-12">
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              Join thousands of patients and doctors already using MedBooking 
              for secure, transparent healthcare appointments.
            </p>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold py-3 px-8 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
            >
              Explore Doctors
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

