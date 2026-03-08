import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import { physicalOptions, stressorOptions } from '@/data/mockData';
import { Activity } from 'lucide-react';

type Step = 'observations' | 'processing';

export default function DiagnosticFlow() {
  const navigate = useNavigate();
  const { childId } = useParams();
  const location = useLocation();
  const child = location.state?.child;
  const [step, setStep] = useState<Step>('observations');
  const [physical, setPhysical] = useState<string[]>([]);
  const [stressors, setStressors] = useState<string[]>([]);

  const toggleChip = (value: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  const handleSubmit = () => {
    setStep('processing');
    setTimeout(() => navigate(`/action-plan/${childId}`, { state: { child, physical, stressors } }), 3000);
  };

  return (
    <div className="min-h-screen pb-8">
      <AppHeader
        title="Real-World Observations"
        subtitle={child?.first_name ? `Understanding ${child.first_name}'s signals` : 'Understanding signals'}
        showBack
        onBack={() => navigate(-1)}
      />

      <div className="px-5 mt-6">
        <AnimatePresence mode="wait">
          {step === 'observations' && (
            <motion.div
              key="observations"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Physical signs */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">What are you seeing at home?</h2>
                <p className="text-sm text-muted-foreground mt-1">Select all that apply</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {physicalOptions.map(opt => (
                    <Chip key={opt} label={opt} selected={physical.includes(opt)} onToggle={() => toggleChip(opt, physical, setPhysical)} />
                  ))}
                </div>
              </div>

              {/* Stressors */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Any known stressors?</h2>
                <p className="text-sm text-muted-foreground mt-1">Select all that apply</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {stressorOptions.map(opt => (
                    <Chip key={opt} label={opt} selected={stressors.includes(opt)} onToggle={() => toggleChip(opt, stressors, setStressors)} />
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={physical.length === 0 && stressors.length === 0}
                className="w-full gradient-navy text-primary-foreground font-bold py-3.5 rounded-xl disabled:opacity-40 transition-opacity"
              >
                Analyze Observations
              </button>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-mint/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full bg-mint/40"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.15, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <div className="w-16 h-16 rounded-full gradient-navy flex items-center justify-center z-10">
                  <Activity className="w-7 h-7 text-primary-foreground" />
                </div>
              </div>
              <p className="mt-8 text-center text-sm font-medium text-muted-foreground max-w-[260px] leading-relaxed">
                Cross-referencing digital vibes with physical observations...
              </p>
              <div className="flex gap-1.5 mt-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Chip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        selected
          ? 'gradient-navy text-primary-foreground shadow-md'
          : 'glass-card text-foreground hover:bg-sand-warm'
      }`}
    >
      {label}
    </button>
  );
}
