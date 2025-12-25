import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Scan, 
  Users, 
  Phone, 
  Heart,
  History
} from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Scan, label: 'Scan', path: '/scan', isPrimary: true },
    { icon: Heart, label: 'Family', path: '/family' },
    { icon: Phone, label: 'SOS', path: '/sos', isEmergency: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      <div className="bg-background/80 backdrop-blur-lg border-t border-border px-4 py-2 pb-6 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.isPrimary) {
            return (
              <div key={item.label} className="relative -mt-10">
                <Button
                  variant="scan"
                  size="icon"
                  className="w-16 h-16 rounded-full shadow-glow border-4 border-background"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon size={32} />
                </Button>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary uppercase tracking-tighter">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={item.label}
              className={cn(
                "flex flex-col items-center gap-1 transition-all px-2 py-1 rounded-xl",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary",
                item.isEmergency && "text-destructive hover:text-destructive"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={20} className={cn(isActive && "animate-pulse")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
