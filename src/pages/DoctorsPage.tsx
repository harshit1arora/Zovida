import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ZovidaLogo from '@/components/ZovidaLogo';
import DoctorListItem from '@/components/DoctorListItem';
import DoctorConsultation from '@/components/DoctorConsultation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { fetchDoctors } from '@/services/mockData';
import { Doctor } from '@/types';
import { ArrowLeft, Search, Filter, Scan, Plus, Users, History } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import ManualEntryModal from '@/components/ManualEntryModal';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';

const DoctorsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      const data = await fetchDoctors();
      setDoctors(data);
      setLoading(false);
    };
    loadDoctors();

    const handleOpenManual = () => setIsManualModalOpen(true);
    window.addEventListener('open-manual-entry', handleOpenManual);
    return () => window.removeEventListener('open-manual-entry', handleOpenManual);
  }, []);

  const handleConsult = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsConsulting(true);
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doctor.hospital && doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <AnimatePresence>
        {isConsulting && selectedDoctor && (
          <DoctorConsultation 
            doctor={selectedDoctor} 
            onClose={() => setIsConsulting(false)} 
          />
        )}
      </AnimatePresence>

      <Header showBack title="Find Doctors" onManualEntry={() => setIsManualModalOpen(true)} />

      <div className="container px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search by specialty, name or hospital..." 
            className="pl-10 h-12 bg-white dark:bg-slate-800 border-primary/10 focus-visible:ring-primary shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Available Now */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground">
            Consult a Doctor
          </h1>
          <p className="text-muted-foreground mt-1">
            Get expert verification for your prescription
          </p>
        </motion.div>

        {/* Available Now Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            Available Now
          </h2>
          
          <div className="space-y-4">
            {loading ? (
              // Skeleton loader
              [...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredDoctors
                .filter((d) => d.available)
                .map((doctor, index) => (
                  <DoctorListItem
                key={doctor.id}
                doctor={doctor}
                index={index}
                onConsult={handleConsult}
              />
                ))
            )}
          </div>
        </motion.div>

        {/* Unavailable Section */}
        {!loading && filteredDoctors.filter((d) => !d.available).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-muted-foreground mb-4">
              Currently Busy
            </h2>
            
            <div className="space-y-4 opacity-60">
              {filteredDoctors
                .filter((d) => !d.available)
                .map((doctor, index) => (
                  <DoctorListItem
                    key={doctor.id}
                    doctor={doctor}
                    index={index}
                    onConsult={handleConsult}
                  />
                ))}
            </div>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated" className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <p className="text-sm text-foreground">
                💡 <strong>Tip:</strong> Our doctors are clinical pharmacologists and 
                internal medicine specialists who can verify drug interactions and 
                provide personalized advice.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <ManualEntryModal 
        isOpen={isManualModalOpen} 
        onClose={() => setIsManualModalOpen(false)} 
      />
      <BottomNav />

      {/* Floating Manual Entry for Mobile */}
      <motion.div 
        className="fixed bottom-24 right-4 z-50 md:hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <Button 
          onClick={() => setIsManualModalOpen(true)}
          className="w-12 h-12 rounded-full shadow-lg bg-primary text-white p-0 flex items-center justify-center border-2 border-white"
        >
          <Plus size={24} />
        </Button>
      </motion.div>
    </div>
  );
};

export default DoctorsPage;
