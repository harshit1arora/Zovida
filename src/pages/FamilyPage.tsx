import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Bell, 
  MapPin, 
  Trash2, 
  Heart, 
  ArrowLeft,
  CheckCircle2,
  Phone,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import ManualEntryModal from '@/components/ManualEntryModal';
import { useTranslation } from 'react-i18next';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  notifications: boolean;
  locationAccess: boolean;
}

const FamilyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    phone: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('zovida_family');
    if (saved) {
      setMembers(JSON.parse(saved));
    } else {
      // Default mock data
      const mock = [
        { id: '1', name: 'Mom', relation: 'Mother', phone: '+1234567890', notifications: true, locationAccess: true },
        { id: '2', name: 'Dad', relation: 'Father', phone: '+1987654321', notifications: true, locationAccess: false }
      ];
      setMembers(mock);
      localStorage.setItem('zovida_family', JSON.stringify(mock));
    }
  }, []);

  const saveMembers = (updated: FamilyMember[]) => {
    setMembers(updated);
    localStorage.setItem('zovida_family', JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!newMember.name || !newMember.phone) {
      toast.error("Please fill in all fields");
      return;
    }
    const member: FamilyMember = {
      id: Date.now().toString(),
      ...newMember,
      notifications: true,
      locationAccess: false
    };
    saveMembers([...members, member]);
    setIsAdding(false);
    setNewMember({ name: '', relation: '', phone: '' });
    toast.success("Family member added to your SafeCircle!");
  };

  const removeMember = (id: string) => {
    saveMembers(members.filter(m => m.id !== id));
    toast.info("Member removed from circle");
  };

  const toggleSetting = (id: string, setting: 'notifications' | 'locationAccess') => {
    saveMembers(members.map(m => 
      m.id === id ? { ...m, [setting]: !m[setting] } : m
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b p-4 sticky top-0 z-10">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="text-accent" />
            SafeCircle™
          </h1>
        </div>
      </header>

      <main className="container p-4 max-w-2xl mx-auto space-y-6 mt-6">
        <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20 flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="font-bold text-accent">Family Safety First</h2>
            <p className="text-sm text-accent/80 leading-tight">
              Your SafeCircle™ members will be notified if you trigger an SOS or miss critical medications.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Circle Members ({members.length})</h3>
          <Button size="sm" onClick={() => setIsAdding(true)} className="bg-accent hover:bg-accent/90">
            <UserPlus size={16} className="mr-2" />
            Add Member
          </Button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-accent/30 bg-accent/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Add New Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input 
                    placeholder="Name" 
                    value={newMember.name} 
                    onChange={e => setNewMember({...newMember, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Relation (e.g. Brother)" 
                    value={newMember.relation} 
                    onChange={e => setNewMember({...newMember, relation: e.target.value})}
                  />
                  <Input 
                    placeholder="Phone Number" 
                    value={newMember.phone} 
                    onChange={e => setNewMember({...newMember, phone: e.target.value})}
                  />
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={handleAdd}>Save Member</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-4">
          {members.map((member) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                        {member.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold">{member.name}</h4>
                        <p className="text-xs text-muted-foreground">{member.relation} • {member.phone}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeMember(member.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={member.notifications ? "default" : "outline"} 
                      size="sm" 
                      className="text-[10px] h-8"
                      onClick={() => toggleSetting(member.id, 'notifications')}
                    >
                      <Bell size={12} className="mr-1" />
                      SOS Alerts: {member.notifications ? 'ON' : 'OFF'}
                    </Button>
                    <Button 
                      variant={member.locationAccess ? "default" : "outline"} 
                      size="sm" 
                      className="text-[10px] h-8"
                      onClick={() => toggleSetting(member.id, 'locationAccess')}
                    >
                      <MapPin size={12} className="mr-1" />
                      Location: {member.locationAccess ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="pt-6">
          <Card className="border-dashed border-2">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-safe/10 rounded-full flex items-center justify-center mx-auto text-safe">
                <Heart size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold">Circle Verified</h3>
                <p className="text-sm text-muted-foreground">
                  Your medical data is encrypted and only shared with verified circle members during emergencies.
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <div className="flex items-center gap-1 text-[10px] font-bold text-safe uppercase">
                  <CheckCircle2 size={12} />
                  HIPAA Compliant
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-safe uppercase">
                  <CheckCircle2 size={12} />
                  End-to-End Encrypted
                </div>
              </div>
            </CardContent>
          </Card>
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

export default FamilyPage;