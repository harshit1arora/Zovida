import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ZovidaLogo from '@/components/ZovidaLogo';
import RiskIndicator from '@/components/RiskIndicator';
import MedicineCard from '@/components/MedicineCard';
import InteractionCard from '@/components/InteractionCard';
import DoctorRatingCard from '@/components/DoctorRatingCard';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useScanStore } from '@/store/scanStore';
import { useReminderStore } from '@/store/reminderStore';
import { 
  ArrowLeft, 
  RotateCcw, 
  Lightbulb, 
  Pill,
  AlertTriangle,
  Share2,
  Volume2,
  VolumeX,
  FileText,
  MessageCircle,
  Download,
  Calendar,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Bell,
  Activity,
  Zap,
  Info,
  Users,
  Scan,
  Clock,
  ShieldAlert,
  HelpCircle,
  Flame,
  Stethoscope,
  UtensilsCrossed,
  Beer,
  ChevronDown,
  ChevronUp,
  History,
  AlertCircle,
  Briefcase,
  HeartHandshake
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import ManualEntryModal from '@/components/ManualEntryModal';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { result, capturedImage, reset, clearResult } = useScanStore();
  const { addReminder } = useReminderStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSimpleLanguage, setIsSimpleLanguage] = useState(false);
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [showClinicalStance, setShowClinicalStance] = useState(false);

  useEffect(() => {
    if (!result) {
      navigate('/');
    }
    
    const handleOpenManual = () => setIsManualModalOpen(true);
    window.addEventListener('open-manual-entry', handleOpenManual);

    return () => {
      window.speechSynthesis.cancel();
      window.removeEventListener('open-manual-entry', handleOpenManual);
    };
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const handleAddAllToReminders = () => {
    result.medicines.forEach(med => {
      addReminder({
        medicineName: med.name,
        dosage: med.dosage,
        time: "08:00 AM", // Default time
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      });
    });
    toast.success("All medications added to your schedule!");
  };

  const handleAddSingleReminder = (med: any) => {
    addReminder({
      medicineName: med.name,
      dosage: med.dosage,
      time: "08:00 AM",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    });
    toast.success(`${med.name} added to schedule`);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `
      Analysis Result. Risk Level: ${result.overallRisk}. 
      ${result.aiExplanation}
      ${result.interactions.length > 0 ? `Found ${result.interactions.length} interactions.` : ''}
    `;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleNewScan = () => {
    clearResult();
    navigate('/scan');
  };

  const handleGoHome = () => {
    reset();
    navigate('/');
  };

  const handleConsultDoctor = () => {
    navigate('/doctors');
  };

  const handleSeeAllDoctors = () => {
    navigate('/doctors');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(12, 61, 110);
    doc.text("Zovida Medical Assistant", 20, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Analysis Report", 20, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 42);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 45, 190, 45);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Overall Risk Assessment:", 20, 55);
    
    const riskColor = result.overallRisk === 'danger' ? [220, 38, 38] : result.overallRisk === 'caution' ? [217, 119, 6] : [22, 163, 74];
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.text(result.overallRisk.toUpperCase(), 80, 55);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("AI Explanation:", 20, 65);
    const splitText = doc.splitTextToSize(result.aiExplanation, 170);
    doc.text(splitText, 20, 75);
    
    doc.save("zovida-medical-report.pdf");
    toast.success("Medical Report Downloaded");
  };

  const handleWhatsAppShare = () => {
    const text = `*Zovida Medical Analysis Report*%0A%0ADate: ${new Date().toLocaleDateString()}%0ARisk Level: ${result.overallRisk.toUpperCase()}%0A%0A*Analysis:*%0A${result.aiExplanation}%0A%0A_Powered by Zovida AI Assistant_`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        showBack 
        title={t('results.title')} 
        onManualEntry={() => setIsManualModalOpen(true)}
        rightContent={
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSpeak}
              className={cn(isSpeaking && "text-primary animate-pulse bg-primary/10")}
            >
              {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={handleExportPDF} title={t('results.export.pdf')}>
                <FileText size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleWhatsAppShare} title={t('results.share.whatsapp')}>
                <MessageCircle size={20} />
              </Button>
            </div>
          </div>
        }
      />

      <main className="container max-w-4xl px-4 py-6 space-y-8">
        {/* Visual Proof Slider - WOW Feature */}
        {capturedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Scan size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Visual Scan Verification</h3>
                  <p className="text-[10px] text-muted-foreground">Compare raw capture vs. AI interpretation</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[9px] font-bold tracking-widest uppercase">
                Interactive
              </Badge>
            </div>
            
            <BeforeAfterSlider beforeImage={capturedImage} />
            
            <p className="text-center text-[10px] text-muted-foreground italic">
              * Drag the slider to see how Zovida AI identified medications on your prescription
            </p>
          </motion.div>
        )}

        {/* Trust & Transparency Card (Expandable) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Collapsible
            open={isTrustOpen}
            onOpenChange={setIsTrustOpen}
            className="w-full bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl overflow-hidden transition-all"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between p-4 h-auto hover:bg-blue-100/50 dark:hover:bg-blue-900/40 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Analysis Transparency</p>
                    <p className="text-[10px] text-blue-600/80 dark:text-blue-400/60">How we analyzed your safety</p>
                  </div>
                </div>
                {isTrustOpen ? <ChevronUp size={16} className="text-blue-400" /> : <ChevronDown size={16} className="text-blue-400" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 pt-0 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2 p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
                    <h4 className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" />
                      What we checked
                    </h4>
                    <ul className="space-y-1.5">
                      <li className="text-[10px] text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        Cross-referenced known high-risk drug interactions
                      </li>
                      <li className="text-[10px] text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        Used peer-reviewed open data (DDInter database)
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2 p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
                    <h4 className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase flex items-center gap-2">
                      <AlertCircle size={12} className="text-amber-500" />
                      Limitations
                    </h4>
                    <ul className="space-y-1.5">
                      <li className="text-[10px] text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        Did not assess specific dosages
                      </li>
                      <li className="text-[10px] text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        Did not assess your personal medical history
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-[9px] text-center text-blue-600/60 dark:text-blue-400/40 italic">
                  Always confirm this analysis with a qualified medical professional.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>

        {/* Caregiver Mode & Cross-Prescription Detection */}
        {(result.isCaregiverMode || result.crossPrescription?.detected) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {result.isCaregiverMode && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Caregiver Mode Active</h4>
                    <p className="text-[10px] text-muted-foreground">Analysis tailored for dependent care</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {result.crossPrescription?.detected && (
              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600">Cross-Prescription Detected</h4>
                    <p className="text-[10px] text-muted-foreground">
                      {result.crossPrescription.message || "Detected medicines likely from different doctors."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Interaction Summary & Urgency Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
        >
          <Card 
            variant={`risk-${result.overallRisk}` as 'risk-safe' | 'risk-caution' | 'risk-danger'}
            className="overflow-hidden border-2"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1 flex items-center gap-6">
                  <RiskIndicator level={result.overallRisk} size="lg" showLabel={false} />
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground mb-1">
                      {result.overallRisk === 'safe' && 'All Clear!'}
                      {result.overallRisk === 'caution' && 'Use Caution'}
                      {result.overallRisk === 'danger' && 'Danger Detected'}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      {result.overallRisk === 'safe' && 'No harmful interactions found'}
                      {result.overallRisk === 'caution' && 'Potential interaction needs monitoring'}
                      {result.overallRisk === 'danger' && 'Dangerous interaction detected'}
                    </p>
                  </div>
                </div>
                
                {result.safetyTimeline && (
                  <div className={cn(
                    "p-6 md:w-80 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border/20",
                    result.safetyTimeline.urgency === 'Immediate' ? "bg-danger/10" : 
                    result.safetyTimeline.urgency === 'Soon' ? "bg-caution/10" : "bg-safe/10"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className={cn(
                        result.safetyTimeline.urgency === 'Immediate' ? "text-danger" : 
                        result.safetyTimeline.urgency === 'Soon' ? "text-caution" : "text-safe"
                      )} />
                      <span className="text-xs font-bold uppercase tracking-wider">Safety Timeline</span>
                    </div>
                    <p className="text-sm font-semibold leading-tight">
                      {result.safetyTimeline.message}
                    </p>
                    <Badge variant="outline" className="mt-3 w-fit bg-background/50 border-border/20">
                      {result.safetyTimeline.urgency === 'Immediate' ? 'Urgent Action' : 
                       result.safetyTimeline.urgency === 'Soon' ? 'Action Required' : 'Routine Monitoring'}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* OCR Confidence & Session Summary Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-primary/10 overflow-hidden bg-primary/5">
            <CardHeader className="bg-primary/10 border-b py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-primary" size={18} />
                  <CardTitle className="text-base">{t('session.summary')}</CardTitle>
                </div>
                {result.ocrConfidence && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">OCR Confidence:</span>
                    <Badge 
                      variant={result.ocrConfidence === 'High' ? 'default' : result.ocrConfidence === 'Medium' ? 'secondary' : 'destructive'}
                      className="text-[10px] py-0 h-5"
                    >
                      {result.ocrConfidence}
                    </Badge>
                    {result.ocrConfidence !== 'High' && (
                      <div className="group relative">
                        <HelpCircle size={14} className="text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-popover text-popover-foreground text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-border">
                          <strong>Limited due to:</strong> {result.ocrConfidenceReason}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-full shadow-sm">
                      <Calendar size={14} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Scan Date</p>
                      <p className="text-xs font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-full shadow-sm">
                      <ShieldCheck size={14} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Analysis Mode</p>
                      <p className="text-xs font-medium">Azure AI Deep Scan</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-background rounded-xl border border-primary/10">
                  <h4 className="text-xs font-semibold mb-1.5 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-safe" />
                    Patient Advice
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
                    This summary is for your records. Export as PDF or share via WhatsApp for professional review.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-[10px] h-8 gap-2 border-primary/20 text-primary hover:bg-primary/5"
                    onClick={handleAddAllToReminders}
                  >
                    <Bell size={10} />
                    Schedule All Reminders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medicines Found */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill className="text-primary" size={20} />
                Medicines Found ({result.medicines.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.medicines.map((medicine, index) => (
                <div key={medicine.id} className="space-y-2">
                  <MedicineCard medicine={medicine} index={index} />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-[10px] h-7 gap-1 text-muted-foreground hover:text-primary"
                    onClick={() => handleAddSingleReminder(medicine)}
                  >
                    <Plus size={10} />
                    Add reminder for this medicine
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactions */}
        {result.interactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="text-caution" size={20} />
                  Interactions Detected ({result.interactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.interactions.map((interaction, index) => (
                  <InteractionCard 
                    key={`${interaction.drug1}-${interaction.drug2}`} 
                    interaction={interaction} 
                    index={index}
                  />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* AI Explanation with ELI12 Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card variant="elevated" className="overflow-hidden">
            <CardHeader className="pb-3 bg-secondary/30">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="text-trust" size={20} />
                  {isSimpleLanguage ? 'ELI12 Analysis' : 'Medical Analysis'}
                </CardTitle>
                <div className="flex items-center space-x-2 bg-background/50 p-1.5 rounded-full border border-border/50">
                  <Label htmlFor="language-toggle" className="text-[10px] font-bold uppercase tracking-tighter px-2">
                    {isSimpleLanguage ? 'Simple' : 'Pro'}
                  </Label>
                  <Switch 
                    id="language-toggle" 
                    checked={isSimpleLanguage} 
                    onCheckedChange={setIsSimpleLanguage}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-foreground leading-relaxed italic mb-4 text-sm">
                {isSimpleLanguage 
                  ? (result.simpleExplanation || result.aiExplanation) 
                  : result.aiExplanation
                }
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Common Side Effects */}
                {result.sideEffects && result.sideEffects.length > 0 && (
                  <div className="p-4 rounded-2xl bg-secondary/20 border border-secondary/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-muted-foreground">
                      <Flame size={14} className="text-orange-500" />
                      Common Side Effects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.sideEffects.map((effect, i) => (
                        <Badge key={i} variant="outline" className="bg-background text-[10px] font-medium border-orange-500/20 text-orange-700">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Signs */}
                {result.emergencySigns && result.emergencySigns.length > 0 && (
                  <div className="p-4 rounded-2xl bg-danger/5 border border-danger/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-danger">
                      <ShieldAlert size={14} />
                      Emergency Signs
                    </h4>
                    <ul className="space-y-1.5">
                      {result.emergencySigns.map((sign, i) => (
                        <li key={i} className="text-[10px] flex items-center gap-2 font-semibold text-danger/80">
                          <span className="w-1 h-1 rounded-full bg-danger shrink-0" />
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Life-Style Guard (Proactive Feature) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <UtensilsCrossed size={16} className="text-primary" />
                Lifestyle & Food Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-border/50">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Beer size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold">Alcohol</p>
                    <p className="text-[9px] text-muted-foreground">Avoid completely</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-border/50">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UtensilsCrossed size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold">Grapefruit</p>
                    <p className="text-[9px] text-muted-foreground">Blocks absorption</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {result.clinicalStance && (
            <Card className="mb-6 border-primary/20 bg-primary/5 overflow-hidden">
              <CardContent className="p-0">
                <button 
                  onClick={() => setShowClinicalStance(!showClinicalStance)}
                  className="w-full p-4 flex items-center justify-between hover:bg-primary/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                      <Stethoscope size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Clinical Interpretation</p>
                      <p className="text-[11px] text-muted-foreground italic">"Would you like to see how clinicians usually interpret this?"</p>
                    </div>
                  </div>
                  {showClinicalStance ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} className="text-primary" />}
                </button>
                
                <AnimatePresence>
                  {showClinicalStance && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 space-y-4 border-t border-primary/10">
                        <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                          "px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                          result.clinicalStance.interpretation === 'Caution' ? "border-danger text-danger bg-danger/5" :
                          result.clinicalStance.interpretation === 'Monitor' ? "border-caution text-caution bg-caution/5" :
                          "border-primary text-primary bg-primary/5"
                        )}>
                          Standard Stance: {result.clinicalStance.interpretation}
                        </Badge>
                      </div>
                        
                        <div className="space-y-3">
                          <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                            <h5 className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-2">
                              <Activity size={12} className="text-primary" />
                              Clinical Perspective
                            </h5>
                            <p className="text-xs leading-relaxed">
                              {result.clinicalStance.stance}
                            </p>
                          </div>
                          
                          <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                            <h5 className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-2">
                              <History size={12} className="text-primary" />
                              Our Insider Process
                            </h5>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {result.clinicalStance.insiderProcess}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-[9px] text-center text-muted-foreground italic">
                          This insight is based on common clinical guidelines and our internal physician review protocols.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">What To Do Next</CardTitle>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full border border-border/50">
                  <ShieldAlert size={10} className="text-amber-500" />
                  AI Guardrail
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{rec}</p>
                  </motion.li>
                ))}
              </ul>
              
              {/* AI Guardrail Statement */}
              <div className="mt-6 p-3 bg-secondary/20 rounded-xl border border-border/50 flex items-start gap-3">
                <Info size={14} className="text-muted-foreground mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  <strong>AI Guardrail:</strong> This explanation is generated by AI to assist your understanding. It is <strong>not</strong> a medical decision-making tool. Always consult a licensed professional for treatment decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bio-Timeline Visualizer (New WOW Feature) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
        >
          <Card className="border-accent/20 bg-gradient-to-br from-white to-accent/5 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="text-accent" size={20} />
                  Bio-Timeline™ Visualizer
                </CardTitle>
                <div className="px-2 py-1 bg-accent/10 rounded text-[10px] font-bold text-accent uppercase tracking-wider">
                  24H Activity
                </div>
              </div>
              <CardDescription className="text-xs">
                Overlapping medication activity windows in your bloodstream
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-6">
              <div className="space-y-6">
                {result.medicines.map((med, idx) => (
                  <div key={med.id} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-medium uppercase text-muted-foreground">
                      <span>{med.name}</span>
                      <span>8h Peak</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
                      <motion.div
                        initial={{ width: 0, x: idx * 20 + "%" }}
                        animate={{ width: "60%", x: idx * 10 + "%" }}
                        transition={{ duration: 1.5, delay: 0.5 + idx * 0.2 }}
                        className={cn(
                          "h-full rounded-full absolute",
                          idx === 0 ? "bg-primary/40" : "bg-accent/40"
                        )}
                      />
                      {/* Interaction marker */}
                      {idx === 0 && (
                        <div className="absolute left-[35%] top-0 bottom-0 w-1 bg-red-500/50 flex items-center justify-center">
                          <Zap size={8} className="text-red-600 absolute -top-3" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between pt-2 text-[8px] font-bold text-muted-foreground/60 border-t border-slate-200">
                  <span>08:00 AM</span>
                  <span>12:00 PM</span>
                  <span>04:00 PM</span>
                  <span>08:00 PM</span>
                  <span>12:00 AM</span>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-white/50 rounded-lg border border-accent/10 flex items-start gap-3">
                <Info size={14} className="text-accent mt-0.5" />
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  The <span className="text-red-500 font-bold">Zap</span> icon indicates where drugs peak simultaneously in your system, increasing the risk of the detected interactions.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Doctor Rating Card */}
        <div className="space-y-4">
          <DoctorRatingCard 
            rating={result.doctorRating} 
            onConsultClick={handleConsultDoctor}
          />
          <Button 
            variant="outline" 
            className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5"
            onClick={handleSeeAllDoctors}
          >
            <Users size={18} />
            Learn who typically reviews such risks
          </Button>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="container">
          <Button
            variant="scan"
            size="lg"
            className="w-full"
            onClick={handleNewScan}
          >
            <RotateCcw size={20} />
            Scan Another Prescription
          </Button>
        </div>
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

export default ResultsPage;
