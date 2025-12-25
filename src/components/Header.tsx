import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ZovidaLogo from '@/components/ZovidaLogo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { 
  Scan, 
  History, 
  Plus, 
  Users, 
  Phone,
  ArrowLeft
} from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  onManualEntry?: () => void;
  rightContent?: React.ReactNode;
}

const Header = ({ showBack, title, onManualEntry, rightContent }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleManualEntry = () => {
    if (onManualEntry) {
      onManualEntry();
    } else {
      window.dispatchEvent(new CustomEvent('open-manual-entry'));
    }
  };

  const navItems = [
    { label: 'Scan', path: '/scan', icon: Scan },
    { label: 'History', path: '/history', icon: History },
    { label: 'Manual Entry', onClick: handleManualEntry, icon: Plus },
    { label: 'Doctors', path: '/doctors', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4 sm:gap-6">
          {showBack && (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden">
              <ArrowLeft size={20} />
            </Button>
          )}
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <ZovidaLogo size="sm" showText={!showBack} />
            {title && <h1 className="text-lg font-bold md:hidden truncate max-w-[150px]">{title}</h1>}
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button 
                key={item.label}
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-sm font-medium rounded-full px-4 transition-all",
                  item.path && location.pathname === item.path 
                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => item.path ? navigate(item.path) : item.onClick?.()}
              >
                <item.icon size={16} className="mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {rightContent}
          <Button 
            variant="destructive" 
            size="sm" 
            className="hidden sm:flex items-center gap-2 rounded-full h-9 px-4 shadow-lg shadow-destructive/20"
            onClick={() => navigate('/sos')}
          >
            <Phone size={16} />
            SOS
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="sm:hidden rounded-full h-9 w-9 shadow-lg shadow-destructive/20"
            onClick={() => navigate('/sos')}
          >
            <Phone size={16} />
          </Button>
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="hidden sm:flex">
            {t('nav.signin')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
