import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  History, 
  ArrowLeft, 
  Search, 
  Trash2, 
  ChevronRight, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
  Plus,
  ShieldCheck,
  Activity,
  Filter,
  Clock,
  Pill,
  Scan
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import ManualEntryModal from '@/components/ManualEntryModal';
import { useScanStore } from '@/store/scanStore';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { AnalysisResult } from '@/types';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { setResult } = useScanStore();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'danger' | 'safe'>('all');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('zovida_history') || '[]');
    // Defensive check for items and sorting
    const validItems = saved.filter((item: any) => item && (item.timestamp || item.date));
    setHistory(validItems.sort((a: any, b: any) => {
      const dateA = new Date(a.timestamp || a.date).getTime();
      const dateB = new Date(b.timestamp || b.date).getTime();
      return dateB - dateA;
    }));
  }, []);

  const stats = {
    total: history.length,
    danger: history.filter(h => h.overallRisk === 'danger').length,
    safe: history.filter(h => h.overallRisk === 'safe').length,
    safetyScore: history.length > 0 
      ? Math.round((history.filter(h => h.overallRisk === 'safe').length / history.length) * 100) 
      : 100
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire history?')) {
      localStorage.removeItem('zovida_history');
      setHistory([]);
    }
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('zovida_history', JSON.stringify(updated));
  };

  const viewResult = (result: AnalysisResult) => {
    // Ensure we have a valid result object before navigating
    if (result && result.medicines) {
      setResult(result);
      navigate('/results');
    }
  };

  const filteredHistory = history.filter(item => {
    const medicines = item.medicines || [];
    const matchesSearch = medicines.some(med => med.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.overallRisk && item.overallRisk.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'danger' && item.overallRisk === 'danger') ||
                         (activeFilter === 'safe' && item.overallRisk === 'safe');
    return matchesSearch && matchesFilter;
  });

  const groupHistoryByDate = (items: AnalysisResult[]) => {
    const groups: { [key: string]: AnalysisResult[] } = {};
    items.forEach(item => {
      const date = new Date(item.timestamp || (item as any).date);
      if (isNaN(date.getTime())) return; // Skip invalid dates

      let groupKey = format(date, 'MMMM d, yyyy');
      if (isToday(date)) groupKey = 'Today';
      else if (isYesterday(date)) groupKey = 'Yesterday';
      
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });
    return groups;
  };

  const groupedHistory = groupHistoryByDate(filteredHistory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      <Header 
        showBack 
        title="Scan History" 
        onManualEntry={() => setIsManualModalOpen(true)} 
      />

      <main className="container max-w-2xl px-4 py-6 space-y-6">
        {/* Summary Stats */}
        {history.length > 0 && !searchQuery && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Your Activity</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[11px] h-7 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full" 
                onClick={handleClearHistory}
              >
                <Trash2 size={12} className="mr-1.5" />
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-slate-800 border-primary/5">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Scans</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border-primary/5">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  stats.safetyScore > 70 ? "bg-safe/10 text-safe" : "bg-danger/10 text-danger"
                )}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Safety Score</p>
                  <p className="text-xl font-bold">{stats.safetyScore}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by medicine or risk level..." 
              className="pl-10 h-12 bg-white dark:bg-slate-800 border-primary/10 focus-visible:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              className="rounded-full px-4 h-8 text-xs"
              onClick={() => setActiveFilter('all')}
            >
              All Scans
            </Button>
            <Button 
              variant={activeFilter === 'danger' ? 'default' : 'outline'} 
              size="sm" 
              className={cn(
                "rounded-full px-4 h-8 text-xs",
                activeFilter === 'danger' && "bg-danger hover:bg-danger/90 border-danger"
              )}
              onClick={() => setActiveFilter('danger')}
            >
              <AlertTriangle size={12} className="mr-1.5" />
              High Risk
            </Button>
            <Button 
              variant={activeFilter === 'safe' ? 'default' : 'outline'} 
              size="sm" 
              className={cn(
                "rounded-full px-4 h-8 text-xs",
                activeFilter === 'safe' && "bg-safe hover:bg-safe/90 border-safe"
              )}
              onClick={() => setActiveFilter('safe')}
            >
              <CheckCircle2 size={12} className="mr-1.5" />
              Safe
            </Button>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-8">
          {Object.keys(groupedHistory).length > 0 ? (
            Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 px-1">
                  <Calendar size={12} />
                  {date}
                </h3>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="overflow-hidden border-primary/5 hover:border-primary/20 transition-all cursor-pointer group active:scale-[0.98] shadow-sm bg-white dark:bg-slate-800"
                        onClick={() => viewResult(item)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                              item.overallRisk === 'danger' ? "bg-danger/10 text-danger" :
                              item.overallRisk === 'caution' ? "bg-caution/10 text-caution" :
                              "bg-safe/10 text-safe"
                            )}>
                              {item.overallRisk === 'danger' ? <AlertTriangle size={24} /> :
                               item.overallRisk === 'caution' ? <Info size={24} /> :
                               <CheckCircle2 size={24} />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-sm truncate max-w-[150px] sm:max-w-none">
                                  {(item.medicines || []).map(m => m.name).join(' + ') || 'Medication Scan'}
                                </h3>
                                <Badge variant="outline" className={cn(
                                  "text-[10px] py-0 px-1.5 h-4 font-bold shrink-0",
                                  item.overallRisk === 'danger' ? "border-danger text-danger bg-danger/5" :
                                  item.overallRisk === 'caution' ? "border-caution text-caution bg-caution/5" :
                                  "border-safe text-safe bg-safe/5"
                                )}>
                                  {(item.overallRisk || 'unknown').toUpperCase()}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock size={10} />
                                  {format(new Date(item.timestamp || (item as any).date), 'h:mm a')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Pill size={10} />
                                  {(item.medicines || []).length} med{(item.medicines || []).length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => deleteItem(item.id, e)}
                            >
                              <Trash2 size={14} />
                            </Button>
                            <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 px-4 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-primary/20 space-y-6 shadow-inner">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                <div className="relative bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center text-primary">
                  <History size={48} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl">
                  {searchQuery ? "No matching results" : "Your History is Empty"}
                </h3>
                <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                  {searchQuery 
                    ? `We couldn't find any scans matching "${searchQuery}". Try a different keyword.` 
                    : "Every time you scan a prescription or check a medication, it will be saved here for quick reference."}
                </p>
              </div>
              {!searchQuery && (
                <div className="flex flex-col gap-3">
                  <Button onClick={() => navigate('/scan')} className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-full shadow-lg shadow-primary/20">
                    <Scan size={18} className="mr-2" />
                    Scan Prescription
                  </Button>
                  <Button variant="ghost" onClick={() => setIsManualModalOpen(true)} className="text-primary hover:bg-primary/5">
                    <Plus size={18} className="mr-2" />
                    Manual Check
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

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

export default HistoryPage;