import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ScanPage from "./pages/ScanPage";
import ResultsPage from "./pages/ResultsPage";
import DoctorsPage from "./pages/DoctorsPage";
import AuthPage from "./pages/AuthPage";
import SOSPage from "./pages/SOSPage";
import FamilyPage from "./pages/FamilyPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";
import ZovidaChatbot from "./components/ZovidaChatbot";
import NetworkStatus from "./components/NetworkStatus";
import ReminderService from "./components/ReminderService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <NetworkStatus />
          <ReminderService />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/sos" element={<SOSPage />} />
            <Route path="/family" element={<FamilyPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ZovidaChatbot />
          <Toaster />
          <Sonner />
        </div>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
