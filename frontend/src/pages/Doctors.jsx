import { useEffect, useState } from 'react';
import { Search, Filter, Stethoscope, Loader } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { SPECIALIZATIONS } from '../utils/contract';

const Doctors = ({ 
  doctors, 
  loading, 
  fetchDoctors, 
  bookAppointment, 
  isPatient,
  isConnected 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    let filtered = doctors;
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpec) {
      filtered = filtered.filter(doc => 
        doc.specialization === selectedSpec
      );
    }
    
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedSpec]);

  return (
    <div className="min-h-screen pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-4">
            <Stethoscope className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-dark-300">Find Your Perfect Doctor</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark-100 mb-4">
            Our <span className="gradient-text">Medical Experts</span>
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Browse through our network of verified healthcare professionals 
            and book your appointment instantly with cryptocurrency.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              type="text"
              placeholder="Search by name or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Specialization Filter */}
          <div className="relative md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="input-field pl-12 appearance-none cursor-pointer"
            >
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-dark-400">
            Showing <span className="text-dark-100 font-medium">{filteredDoctors.length}</span> doctors
          </p>
          {!isConnected && (
            <p className="text-sm text-amber-400">
              Connect your wallet to book appointments
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-10 h-10 text-dark-600" />
            </div>
            <h3 className="font-display font-semibold text-xl text-dark-300 mb-2">
              No Doctors Found
            </h3>
            <p className="text-dark-500">
              {doctors.length === 0 
                ? "No doctors have registered yet. Be the first!"
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && filteredDoctors.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, idx) => (
              <DoctorCard
                key={doctor.walletAddress || idx}
                doctor={doctor}
                onBook={bookAppointment}
                isPatient={isPatient}
              />
            ))}
          </div>
        )}

        {/* Demo Notice */}
        {doctors.length === 0 && !loading && (
          <div className="mt-12 card bg-primary-500/5 border-primary-500/20 text-center">
            <h3 className="font-display font-semibold text-lg text-dark-100 mb-2">
              Demo Mode
            </h3>
            <p className="text-dark-400 text-sm mb-4">
              Deploy the smart contract and register doctors to see them listed here. 
              Use the Register page to add doctors to the platform.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;

