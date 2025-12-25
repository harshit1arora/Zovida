import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Send,
  MoreVertical,
  User,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Doctor } from '@/types';
import { toast } from 'sonner';

interface DoctorConsultationProps {
  doctor: Doctor;
  onClose: () => void;
}

const DoctorConsultation = ({ doctor, onClose }: DoctorConsultationProps) => {
  const [activeTab, setActiveTab] = useState<'video' | 'chat'>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'doctor', text: `Hello! I'm ${doctor.name}. I've reviewed your Zovida scan results. How can I help you today?`, time: '10:00 AM' }
  ]);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsConnecting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = { role: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');

    // Mock doctor reply
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        role: 'doctor',
        text: "I understand. Based on the scan, I recommend following the prescribed dosage strictly and monitoring for any dizziness.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  if (isConnecting) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <User size={32} className="text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-bold mt-6">Connecting to {doctor.name}</h2>
        <p className="text-muted-foreground mt-2">Securing end-to-end encrypted connection...</p>
        <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-safe/10 text-safe rounded-full text-sm font-medium">
          <Shield size={16} />
          HIPAA Compliant Session
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm leading-none">{doctor.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
              <span className="text-xs text-muted-foreground">Live Consultation</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hidden sm:flex">
            05:24
          </Badge>
          <Button variant="ghost" size="icon" onClick={() => setActiveTab(activeTab === 'video' ? 'chat' : 'video')}>
            <MessageSquare size={20} className={activeTab === 'chat' ? 'text-primary' : ''} />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical size={20} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Video Area */}
        <div className={`flex-1 relative bg-slate-900 flex items-center justify-center transition-all duration-300 ${activeTab === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          {/* Main Video (Doctor) */}
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            {isVideoOff ? (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <User size={48} className="text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium">Doctor's camera is off</p>
              </div>
            ) : (
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1559839734-2b71f1e35d8e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            
            {/* Self Video (Small) */}
            <div className="absolute top-4 right-4 w-32 h-44 rounded-xl bg-slate-800 border-2 border-white/10 shadow-2xl overflow-hidden hidden sm:block">
               <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <User size={32} className="text-slate-500" />
               </div>
               <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded text-[10px] text-white">
                 You
               </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <Button 
                variant={isMuted ? 'destructive' : 'secondary'} 
                size="icon" 
                className="h-12 w-12 rounded-full shadow-lg"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff /> : <Mic />}
              </Button>
              <Button 
                variant={isVideoOff ? 'destructive' : 'secondary'} 
                size="icon" 
                className="h-12 w-12 rounded-full shadow-lg"
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <VideoOff /> : <Video />}
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-14 w-14 rounded-full shadow-lg scale-110"
                onClick={onClose}
              >
                <PhoneOff />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-80 lg:w-96 border-l bg-background flex flex-col transition-all duration-300 ${activeTab === 'chat' ? 'flex' : 'hidden md:flex'}`}>
          <div className="p-4 border-b bg-muted/30">
            <h4 className="font-semibold text-sm">Consultation Chat</h4>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input 
                placeholder="Type a message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-muted/50 border-0 focus-visible:ring-1"
              />
              <Button type="submit" size="icon" disabled={!message.trim()}>
                <Send size={18} />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DoctorConsultation;
