import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import { Shield, QrCode, CheckCircle2, Bell } from 'lucide-react';

type SetupStep = 'privacy' | 'pairing' | 'success';

export default function ChildSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SetupStep>('privacy');

  return (
    <div className="min-h-screen pb-8">
      <AppHeader title="Child Setup" subtitle="Connect a new device" showBack onBack={() => navigate('/')} />

      <div className="px-5 mt-6">
        <AnimatePresence mode="wait">
          {step === 'privacy' && (
            <motion.div key="privacy" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl gradient-navy flex items-center justify-center mb-6 shadow-xl">
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">Privacy Seal</h2>
              <p className="text-sm text-muted-foreground mt-3 max-w-[300px] leading-relaxed">
                VibeCheck respects your child's privacy.
              </p>
              <div className="mt-8 space-y-3 w-full">
                {['End-to-end encryption', 'Safety-first', 'Trusted by 500+ early-adopter families', 'DPDP Compliant'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="glass-card rounded-xl p-3 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-mint-dark flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => setStep('pairing')} className="mt-8 w-full gradient-navy text-primary-foreground font-bold py-3.5 rounded-xl">
                I Understand — Continue
              </button>
            </motion.div>
          )}

          {step === 'pairing' && (
            <motion.div key="pairing" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col items-center text-center">
              <h2 className="text-xl font-bold text-foreground">Scan to Pair</h2>
              <p className="text-sm text-muted-foreground mt-2">Open the VibeCheck app on your child's device and scan this code.</p>
              <div className="mt-8 glass-card-elevated rounded-3xl p-8">
                <div className="w-48 h-48 rounded-xl bg-foreground/5 flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Code expires in 5:00</p>
              <button onClick={() => setStep('success')} className="mt-6 w-full gradient-navy text-primary-foreground font-bold py-3.5 rounded-xl">
                Simulate Link
              </button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-24 h-24 rounded-full bg-mint flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-navy-deep" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-foreground">Link Successful!</h2>
              <p className="text-sm text-muted-foreground mt-3 max-w-[280px] leading-relaxed">
                The device is now connected. Your child will see a persistent notification.
              </p>
              <div className="mt-8 glass-card-elevated rounded-xl p-4 flex items-center gap-3 w-full">
                <Bell className="w-5 h-5 text-mint-dark" />
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Persistent Notification</p>
                  <p className="text-xs text-muted-foreground">"VibeCheck is protecting your well-being."</p>
                </div>
              </div>
              <button onClick={() => navigate('/')} className="mt-8 w-full gradient-navy text-primary-foreground font-bold py-3.5 rounded-xl">
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
