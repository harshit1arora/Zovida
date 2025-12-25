import { create } from 'zustand';
import { AnalysisResult, RiskLevel } from '@/types';
import { simulateAnalysis } from '@/services/mockData';

interface ScanStore {
  isScanning: boolean;
  isAnalyzing: boolean;
  capturedImage: string | null;
  result: AnalysisResult | null;
  error: string | null;
  
  // Actions
  startScanning: () => void;
  stopScanning: () => void;
  captureImage: (imageData: string) => void;
  analyzeImage: (mockRiskLevel?: RiskLevel) => Promise<void>;
  clearResult: () => void;
  setResult: (result: AnalysisResult) => void;
  reset: () => void;
}

export const useScanStore = create<ScanStore>((set, get) => ({
  isScanning: false,
  isAnalyzing: false,
  capturedImage: null,
  result: null,
  error: null,

  startScanning: () => set({ isScanning: true, error: null }),
  
  stopScanning: () => set({ isScanning: false }),
  
  captureImage: (imageData: string) => set({ 
    capturedImage: imageData, 
    isScanning: false 
  }),
  
  setResult: (result: AnalysisResult) => {
    set({ result, isAnalyzing: false });
    
    // Save to local history
    const history = JSON.parse(localStorage.getItem('zovida_history') || '[]');
    // Avoid duplicates by checking ID
    const filteredHistory = history.filter((h: any) => h.id !== result.id);
    const newHistory = [result, ...filteredHistory].slice(0, 20); // Keep last 20 full results
    localStorage.setItem('zovida_history', JSON.stringify(newHistory));
  },

  analyzeImage: async (mockRiskLevel: RiskLevel = 'danger') => {
    set({ isAnalyzing: true, error: null });
    try {
      // In production, this would call Azure Computer Vision + Azure OpenAI
      const result = await simulateAnalysis(mockRiskLevel);
      set({ result, isAnalyzing: false });
      
      // Save to local history
      const history = JSON.parse(localStorage.getItem('zovida_history') || '[]');
      // Avoid duplicates
      const filteredHistory = history.filter((h: any) => h.id !== result.id);
      const newHistory = [result, ...filteredHistory].slice(0, 20); // Keep last 20
      localStorage.setItem('zovida_history', JSON.stringify(newHistory));
      
    } catch (error) {
      set({ 
        error: 'Failed to analyze prescription. Please try again.', 
        isAnalyzing: false 
      });
    }
  },
  
  clearResult: () => set({ result: null, capturedImage: null }),
  
  reset: () => set({
    isScanning: false,
    isAnalyzing: false,
    capturedImage: null,
    result: null,
    error: null,
  }),
}));
