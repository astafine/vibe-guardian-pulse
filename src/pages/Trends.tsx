import AppHeader from '@/components/AppHeader';
import { mockChildren } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function Trends() {
  return (
    <div className="min-h-screen pb-24">
      <AppHeader title="Trends" subtitle="Weekly emotional patterns" />
      <div className="px-5 mt-4 space-y-4">
        {mockChildren.map((child, i) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-elevated rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{child.avatar}</span>
              <h3 className="font-bold text-foreground">{child.name}</h3>
            </div>
            {/* Mini chart placeholder */}
            <div className="flex items-end gap-1 h-16">
              {Array.from({ length: 7 }).map((_, d) => {
                const h = Math.max(15, Math.min(100, child.vibeScore + (Math.sin(d * 1.5) * 20)));
                return (
                  <motion.div
                    key={d}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1 + d * 0.05, duration: 0.4 }}
                    className={`flex-1 rounded-t-md ${
                      h > 65 ? 'bg-mint' : h > 40 ? 'bg-warning' : 'bg-destructive/60'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
