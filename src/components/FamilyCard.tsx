import { motion } from 'framer-motion';
import { Child } from '@/types/vibecheck';
import VibeMeter from './VibeMeter';
import TrendBadge from './TrendBadge';
import { ChevronRight } from 'lucide-react';

interface FamilyCardProps {
  child: Child;
  index: number;
  onTap: (child: Child) => void;
}

export default function FamilyCard({ child, index, onTap }: FamilyCardProps) {
  const isActionable = child.vibeZone !== 'green';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={() => isActionable && onTap(child)}
      className={`glass-card-elevated rounded-2xl p-5 ${
        isActionable ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl gradient-navy flex items-center justify-center text-2xl shadow-lg">
          {child.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-lg leading-tight">{child.name}</h3>
          <p className="text-muted-foreground text-sm">Age {child.age}</p>
          <div className="mt-1.5">
            <TrendBadge text={child.trendText} direction={child.trendDirection} />
          </div>
        </div>

        {/* Vibe Meter */}
        <div className="flex flex-col items-center">
          <VibeMeter score={child.vibeScore} zone={child.vibeZone} size={100} />
        </div>
      </div>

      {isActionable && (
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-center gap-1 text-xs font-semibold text-primary">
          <span>View Insights</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      )}
    </motion.div>
  );
}
