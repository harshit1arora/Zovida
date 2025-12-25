import { Shield, Pill, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ZovidaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const ZovidaLogo = ({ size = 'md', showText = true }: ZovidaLogoProps) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' },
  };

  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        <div className="bg-gradient-hero rounded-xl p-2 shadow-lg">
          <Shield 
            size={sizes[size].icon} 
            className="text-primary-foreground" 
            strokeWidth={2.5}
          />
        </div>
        <motion.div
          className="absolute -top-1 -right-1 bg-safe rounded-full p-0.5"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart size={12} className="text-safe-foreground" fill="currentColor" />
        </motion.div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizes[size].text} text-foreground tracking-tight`}>
            Zovida
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground -mt-1">
              Medicine Safety
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ZovidaLogo;
