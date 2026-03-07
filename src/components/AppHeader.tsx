import { motion } from 'framer-motion';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function AppHeader({ title, subtitle, showBack, onBack }: AppHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-[max(1rem,env(safe-area-inset-top))] pb-2 px-5"
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-foreground">
            ←
          </button>
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-gradient-navy">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </motion.header>
  );
}
