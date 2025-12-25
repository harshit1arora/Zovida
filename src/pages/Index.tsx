import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ZovidaLogo from '@/components/ZovidaLogo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MedicineReminders from '@/components/MedicineReminders';
import DoctorAppointments from '@/components/DoctorAppointments';
import ManualEntryModal from '@/components/ManualEntryModal';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { 
  Scan, 
  Shield, 
  Users, 
  Plus,
  Sparkles, 
  ChevronRight,
  Pill,
  Heart,
  CheckCircle,
  History,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Phone,
  UserPlus,
  Zap,
  ShieldCheck,
  Activity,
  Calendar,
  Share2
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [history, setHistory] = useState<any[]>([]);
  const [safeScore, setSafeScore] = useState(85);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('zovida_history') || '[]');
    // Defensive check and ensure we have at most 3 for the preview
    const validHistory = savedHistory
      .filter((item: any) => item && (item.timestamp || item.date))
      .slice(0, 3);
    setHistory(validHistory);

    const handleOpenManual = () => setIsManualModalOpen(true);
    window.addEventListener('open-manual-entry', handleOpenManual);
    return () => window.removeEventListener('open-manual-entry', handleOpenManual);
  }, []);

  const handleStartScan = () => {
    navigate('/scan');
  };

  const handleSeeDoctors = () => {
    navigate('/doctors');
  };

  const handleManualEntry = () => {
    setIsManualModalOpen(true);
  };

  const features = [
    {
      icon: Scan,
      title: 'Instant Scan',
      description: 'Capture any prescription with your camera',
      onClick: handleStartScan,
    },
    {
      icon: Shield,
      title: 'AI Analysis',
      description: 'Detect dangerous drug interactions',
      onClick: handleStartScan,
    },
    {
      icon: Users,
      title: 'Doctor Verified',
      description: 'See what real doctors think',
      onClick: handleSeeDoctors,
    },
    {
      icon: Plus,
      title: 'Manual Entry',
      description: 'Add drugs by name for quick safety check',
      onClick: () => setIsManualModalOpen(true),
    },
  ];

  const stats = [
    { value: '1.3M', label: 'Lives at risk yearly' },
    { value: '99.2%', label: 'Detection accuracy' },
    { value: '500+', label: 'Doctors onboard' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onManualEntry={handleManualEntry} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-safe/10 rounded-full blur-3xl" />

        <div className="container relative px-4 pt-12 pb-16">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-safe/10 text-safe mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Heart size={16} className="fill-current" />
              <span className="text-sm font-medium">{t('hero.protecting')}</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {t('hero.title')}{' '}
              <span className="text-primary">{t('hero.highlight')}</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              {t('hero.desc')}
            </p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="scan"
                size="xl"
                className="w-full max-w-xs shadow-glow"
                onClick={() => navigate('/scan')}
              >
                <Scan size={24} />
                {t('scan.button')}
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-safe" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-safe" />
                <span>No signup needed</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating pills decoration */}
          <motion.div
            className="absolute top-32 left-8 hidden md:block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Pill className="text-primary" size={24} />
            </div>
          </motion.div>
          <motion.div
            className="absolute top-48 right-12 hidden md:block"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-10 h-10 bg-safe/10 rounded-xl flex items-center justify-center">
              <Shield className="text-safe" size={20} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 border-y border-border bg-secondary/30">
        <div className="container px-4">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Scans Section */}
      {history.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="text-primary" size={24} />
                Recent Analysis
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={() => {
                  localStorage.removeItem('zovida_history');
                  setHistory([]);
                }}
              >
                Clear History
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => navigate('/results')} // Note: In a real app, you'd load this specific result
                >
                  <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/history')}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={12} />
                            {new Date(item.timestamp || item.date).toLocaleDateString()}
                          </div>
                          <p className="font-semibold text-sm">
                            {item.medicines ? item.medicines.length : item.medicineCount} Medications Analyzed
                          </p>
                        </div>
                        <div className={cn(
                          "p-2 rounded-full",
                          item.overallRisk === 'danger' ? "bg-destructive/10 text-destructive" :
                          item.overallRisk === 'caution' ? "bg-warning/10 text-warning" :
                          "bg-safe/10 text-safe"
                        )}>
                          {item.overallRisk === 'danger' && <AlertCircle size={16} />}
                          {item.overallRisk === 'caution' && <AlertTriangle size={16} />}
                          {(item.overallRisk === 'safe' || !item.overallRisk) && <CheckCircle2 size={16} />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Health Dashboard Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SafeScore Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-primary/20 bg-gradient-to-br from-white to-primary/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity size={80} className="text-primary" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="text-primary" size={20} />
                    SafeScore™
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-primary/10"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * safeScore) / 100}
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-primary">{safeScore}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Safety Index</span>
                    </div>
                  </div>
                  <p className="text-xs text-center mt-6 text-muted-foreground px-4">
                    Based on your medication adherence and scanned interaction results.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Family SafeCircle Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-accent/20 bg-gradient-to-br from-white to-accent/5 overflow-hidden relative">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="text-accent" size={20} />
                    SafeCircle™
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex -space-x-3 overflow-hidden p-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-accent/20 flex items-center justify-center text-accent">
                      <UserPlus size={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs bg-white/50 p-2 rounded-lg border border-slate-100">
                      <span className="font-medium">Mom's Reminders</span>
                      <span className="text-green-500 font-bold">Synced</span>
                    </div>
                    <div className="flex items-center justify-between text-xs bg-white/50 p-2 rounded-lg border border-slate-100">
                      <span className="font-medium">SOS Notifications</span>
                      <span className="text-blue-500 font-bold">3 Active</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-accent border-accent/20 hover:bg-accent/5" onClick={() => navigate('/family')}>
                    <Share2 size={14} className="mr-2" />
                    Manage Circle
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Smart Inventory Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-safe/20 bg-gradient-to-br from-white to-safe/5 overflow-hidden relative">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pill className="text-safe" size={20} />
                    Inventory Insight
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="flex-1">
                        <p className="text-xs font-bold">Metformin</p>
                        <p className="text-[10px] text-muted-foreground">Only 4 days left</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 text-safe">Order</Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="flex-1">
                        <p className="text-xs font-bold">Lisinopril</p>
                        <p className="text-[10px] text-muted-foreground">Expires Jan 2026</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2">Log</Button>
                    </div>
                  </div>
                  <div className="p-3 bg-safe/10 rounded-xl flex items-center gap-3">
                    <Zap size={16} className="text-safe" />
                    <p className="text-[10px] font-medium leading-tight">
                      AI Tip: Your morning meds are consistently taken 15 mins late.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Dashboard - Medicine Reminders & Appointments */}
      <section className="py-12 bg-slate-50/50">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <MedicineReminders />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <DoctorAppointments />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to safer medication
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={feature.onClick}
                className={cn(feature.onClick && "cursor-pointer")}
              >
                <Card variant="elevated" className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="text-primary" size={28} />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4">
          <motion.div
            className="text-center max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="mx-auto mb-4" size={32} />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Your Safety Matters
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Join thousands who trust Zovida to keep their medications safe. 
              It only takes a few seconds.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => navigate('/scan')}
            >
              Get Started Now
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container px-4 text-center">
          <ZovidaLogo size="sm" />
          <p className="text-sm text-muted-foreground mt-4">
            © 2026 Zovida. All Rights Reserved.
          </p>
        </div>
      </footer>

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
          onClick={handleManualEntry}
          className="w-12 h-12 rounded-full shadow-lg bg-primary text-white p-0 flex items-center justify-center border-2 border-white"
        >
          <Plus size={24} />
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
