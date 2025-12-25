import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CameraCapture from '@/components/CameraCapture';
import AnalysisLoader from '@/components/AnalysisLoader';
import { useScanStore } from '@/store/scanStore';
import { RiskLevel } from '@/types';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import ZovidaLogo from '@/components/ZovidaLogo';
import { useTranslation } from 'react-i18next';

const ScanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showCamera, setShowCamera] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const { 
    isAnalyzing, 
    capturedImage, 
    result, 
    captureImage, 
    analyzeImage,
    reset 
  } = useScanStore();

  // Demo: Cycle through risk levels for demo purposes
  const demoRiskLevels: RiskLevel[] = ['danger', 'caution', 'safe'];
  const [demoIndex, setDemoIndex] = useState(0);

  const handleConsent = () => {
    setHasConsented(true);
    setShowCamera(true);
  };

  const handleCapture = async (imageData: string) => {
    captureImage(imageData);
    setShowCamera(false);
    
    // Analyze with demo risk level (rotates through each)
    await analyzeImage(demoRiskLevels[demoIndex]);
    setDemoIndex((prev) => (prev + 1) % demoRiskLevels.length);
  };

  useEffect(() => {
    if (result) {
      navigate('/results');
    }
  }, [result, navigate]);

  const handleClose = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!hasConsented && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
             <Card className="w-full max-w-md shadow-2xl border-primary/20">
               <CardHeader className="text-center pb-2">
                 <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                   <Shield className="w-8 h-8 text-primary" />
                 </div>
                 <CardTitle className="text-xl">{t('scan.consent.title')}</CardTitle>
                 <CardDescription>{t('scan.consent.desc')}</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 pt-4">
                 <div className="flex gap-3 items-start">
                   <div className="mt-0.5 bg-green-100 dark:bg-green-900 rounded-full p-1 shrink-0">
                     <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                   </div>
                   <p className="text-sm text-muted-foreground">{t('scan.consent.point1')}</p>
                 </div>
                 <div className="flex gap-3 items-start">
                   <div className="mt-0.5 bg-green-100 dark:bg-green-900 rounded-full p-1 shrink-0">
                     <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                   </div>
                   <p className="text-sm text-muted-foreground">{t('scan.consent.point2')}</p>
                 </div>
                 <div className="flex gap-3 items-start">
                   <div className="mt-0.5 bg-green-100 dark:bg-green-900 rounded-full p-1 shrink-0">
                     <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                   </div>
                   <p className="text-sm text-muted-foreground">{t('scan.consent.point3')}</p>
                 </div>
               </CardContent>
               <CardFooter className="flex flex-col gap-3">
                 <Button className="w-full bg-primary hover:bg-primary/90" size="lg" onClick={handleConsent}>
                   {t('scan.agree')}
                 </Button>
                 <Button variant="ghost" size="sm" onClick={handleClose}>
                   Cancel
                 </Button>
               </CardFooter>
             </Card>
          </motion.div>
        )}

        {hasConsented && showCamera && !isAnalyzing && (
          <CameraCapture
            onCapture={handleCapture}
            onClose={handleClose}
          />
        )}

        {isAnalyzing && (
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
              <div className="container flex items-center justify-between h-16 px-4">
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <ArrowLeft size={24} />
                </Button>
                <ZovidaLogo size="sm" showText={false} />
                <div className="w-12" />
              </div>
            </header>
            
            <AnalysisLoader />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanPage;
