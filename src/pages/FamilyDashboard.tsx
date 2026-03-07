import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import FamilyCard from '@/components/FamilyCard';
import { mockChildren } from '@/data/mockData';
import { Child } from '@/types/vibecheck';
import { Plus } from 'lucide-react';

export default function FamilyDashboard() {
  const navigate = useNavigate();

  const handleCardTap = (child: Child) => {
    navigate(`/diagnostic/${child.id}`, { state: { child } });
  };

  return (
    <div className="min-h-screen pb-24">
      <AppHeader title="Vibecheck" subtitle="Your family's emotional wellness" />

      <div className="px-5 mt-4 space-y-4">
        {/* Quick summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-navy rounded-2xl p-5 text-primary-foreground"
        >
          <p className="text-sm font-medium opacity-80">Today's Overview</p>
          <p className="text-xl font-bold mt-1">
            {mockChildren.filter(c => c.vibeZone === 'green').length} of {mockChildren.length} vibes are healthy
          </p>
          <p className="text-xs opacity-60 mt-1">
            {mockChildren.filter(c => c.vibeZone !== 'green').length} need your attention
          </p>
        </motion.div>

        {/* Children */}
        {mockChildren.map((child, i) => (
          <FamilyCard key={child.id} child={child} index={i} onTap={handleCardTap} />
        ))}

        {/* Add child */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/setup')}
          className="w-full glass-card rounded-2xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold text-sm">Add a child</span>
        </motion.button>
      </div>
    </div>
  );
}
