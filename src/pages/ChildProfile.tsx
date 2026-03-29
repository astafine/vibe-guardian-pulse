import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Sparkles, Shield, X, Copy, LogOut, Link2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const emojis = [
  { icon: '😊', label: 'Great' },
  { icon: '🙂', label: 'Good' },
  { icon: '😐', label: 'Okay' },
  { icon: '😔', label: 'Not great' },
  { icon: '😢', label: 'Rough' },
];

const nudgeTemplates = [
  { emoji: '🤗', text: "I'd love some quality time tonight" },
  { emoji: '💬', text: "Can we talk later? Nothing urgent" },
  { emoji: '❤️', text: "Just wanted to say I love you" },
];

const toolkitItems = [
  { emoji: '🫁', title: 'Box Breathing', desc: '1 min · Inhale 4s, hold 4s, exhale 4s' },
  { emoji: '🌊', title: 'Ocean Sounds', desc: '1 min · Calm white noise' },
  { emoji: '🧊', title: 'Grounding 5-4-3-2-1', desc: '1 min · Use your senses' },
  { emoji: '🎵', title: 'Hum Along', desc: '1 min · Pick a tune and hum' },
];

const counselors = [
  { name: 'Mrs. Sunita Sharma', role: 'Senior School Counselor', emoji: '👩‍🏫' },
  { name: 'Mr. Rajesh Iyer', role: 'Student Wellness Coordinator', emoji: '👨‍🏫' },
  { name: 'Ms. Priya Nair', role: 'Junior School Counselor', emoji: '👩‍💼' },
];

type ActivePanel = null | 'nudge' | 'toolkit' | 'counselor';

export default function ChildProfile() {
  const { profile } = useAuth();
  const [reflected, setReflected] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [nudgeSent, setNudgeSent] = useState(false);

  const [generatingCode, setGeneratingCode] = useState(false);
  const [localLinkCode, setLocalLinkCode] = useState(profile?.link_code || null);

  const generateLinkCode = async () => {
    setGeneratingCode(true);
    try {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 12; i++) code += chars[Math.floor(Math.random() * chars.length)];

      const { error } = await supabase
        .from('profiles')
        .update({ link_code: code })
        .eq('user_id', profile!.user_id);
      if (error) throw error;
      setLocalLinkCode(code);
      toast.success('Link code generated! Share it with your parent.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate code');
    } finally {
      setGeneratingCode(false);
    }
  };

  const copyLinkCode = () => {
    const code = localLinkCode || profile?.link_code;
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success('Link code copied!');
    }
  };

  const handleReflect = () => {
    setReflected(true);
  };

  const handleNudge = () => {
    setNudgeSent(true);
    setTimeout(() => {
      setActivePanel(null);
      setNudgeSent(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-child-bg text-child-foreground pb-6 relative overflow-hidden">
      {/* Starry background dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-child-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-[max(1.5rem,env(safe-area-inset-top))] pb-2 px-6 relative z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-child-accent/20 flex items-center justify-center text-lg">
              🏠
            </div>
            <div>
              <h1 className="text-xl font-bold text-child-foreground">VibeCheck</h1>
              <p className="text-xs text-child-muted">Always here in the background</p>
            </div>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
            className="p-2 rounded-lg text-child-muted hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <div className="px-5 mt-6 space-y-5 relative z-10">
        {/* Link Code for Parent */}
        {(localLinkCode || profile?.link_code) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-child-card rounded-2xl p-4 border border-child-border flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-child-muted">Your link code (share with parent)</p>
              <p className="text-lg font-mono font-bold tracking-widest text-child-foreground mt-1">{localLinkCode || profile?.link_code}</p>
            </div>
            <button onClick={copyLinkCode} className="p-2 rounded-lg bg-child-accent/20 text-child-accent">
              <Copy className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-child-card rounded-2xl p-5 border border-child-border text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-xl bg-child-accent/20 flex items-center justify-center mx-auto">
              <Link2 className="w-7 h-7 text-child-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-child-foreground">Connect with your parent</p>
              <p className="text-xs text-child-muted mt-1">Generate a code and share it so your parent can link to your profile</p>
            </div>
            <button
              onClick={generateLinkCode}
              disabled={generatingCode}
              className="w-full py-3 rounded-xl bg-child-accent text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
            >
              {generatingCode ? 'Generating...' : 'Generate Link Code'}
            </button>
          </motion.div>
        )}

        {/* Daily Reflection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-child-card rounded-2xl p-6 border border-child-border"
        >
          <p className="text-sm text-child-muted mb-1">Daily Reflection</p>
          <p className="text-lg font-semibold text-child-foreground mb-5">
            How's the day treating you?
          </p>

          <AnimatePresence mode="wait">
            {!reflected ? (
              <motion.div
                key="emojis"
                className="flex justify-between"
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {emojis.map((e) => (
                  <button
                    key={e.label}
                    onClick={handleReflect}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <span className="text-3xl transition-transform group-hover:scale-125 group-active:scale-110">
                      {e.icon}
                    </span>
                    <span className="text-[10px] text-child-muted">{e.label}</span>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.p
                key="thanks"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-child-accent text-center py-2"
              >
                Thanks for checking in ✨
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Support Suite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {/* Nudge Parents */}
          <button
            onClick={() => setActivePanel(activePanel === 'nudge' ? null : 'nudge')}
            className="w-full bg-child-card rounded-2xl p-4 border border-child-border flex items-center gap-4 text-left hover:border-child-accent/40 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-child-accent/20 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-child-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm text-child-foreground">Nudge Parents</p>
              <p className="text-xs text-child-muted mt-0.5">Initiate conversation</p>
            </div>
          </button>

          <AnimatePresence>
            {activePanel === 'nudge' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-child-card rounded-2xl p-4 border border-child-border space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-child-muted font-medium">Pick a message</p>
                    <button onClick={() => setActivePanel(null)} className="text-child-muted hover:text-child-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {nudgeSent ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-child-accent text-center py-3"
                    >
                      Sent! 💛
                    </motion.p>
                  ) : (
                    nudgeTemplates.map((t) => (
                      <button
                        key={t.text}
                        onClick={handleNudge}
                        className="w-full text-left p-3 rounded-xl bg-child-bg/60 hover:bg-child-accent/10 transition-colors flex items-center gap-3"
                      >
                        <span className="text-lg">{t.emoji}</span>
                        <span className="text-sm text-child-foreground">{t.text}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Talk to Counselor */}
          <button
            onClick={() => setActivePanel(activePanel === 'counselor' ? null : 'counselor')}
            className="w-full bg-child-card rounded-2xl p-4 border border-child-border flex items-center gap-4 text-left hover:border-child-accent/40 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-child-teal/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-child-teal" />
            </div>
            <div>
              <p className="font-semibold text-sm text-child-foreground">Talk to Counselor</p>
              <p className="text-xs text-child-muted mt-0.5">Quick link to school support</p>
            </div>
          </button>

          <AnimatePresence>
            {activePanel === 'counselor' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-child-card rounded-2xl p-4 border border-child-border space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-child-muted font-medium">School Counselors</p>
                    <button onClick={() => setActivePanel(null)} className="text-child-muted hover:text-child-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {counselors.map((c) => (
                    <div
                      key={c.name}
                      className="w-full p-3 rounded-xl bg-child-bg/60 flex items-center gap-3"
                    >
                      <span className="text-xl">{c.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-child-foreground">{c.name}</p>
                        <p className="text-[11px] text-child-muted">{c.role}</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-child-teal/20 text-child-teal text-xs font-medium hover:bg-child-teal/30 transition-colors">
                        Contact
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Toolkit */}
          <button
            onClick={() => setActivePanel(activePanel === 'toolkit' ? null : 'toolkit')}
            className="w-full bg-child-card rounded-2xl p-4 border border-child-border flex items-center gap-4 text-left hover:border-child-accent/40 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-child-purple/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-child-purple" />
            </div>
            <div>
              <p className="font-semibold text-sm text-child-foreground">The Toolkit</p>
              <p className="text-xs text-child-muted mt-0.5">1-minute stress-busters</p>
            </div>
          </button>

          <AnimatePresence>
            {activePanel === 'toolkit' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-child-card rounded-2xl p-4 border border-child-border space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-child-muted font-medium">Quick tools</p>
                    <button onClick={() => setActivePanel(null)} className="text-child-muted hover:text-child-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {toolkitItems.map((t) => (
                    <button
                      key={t.title}
                      className="w-full text-left p-3 rounded-xl bg-child-bg/60 hover:bg-child-teal/10 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">{t.emoji}</span>
                      <div>
                        <p className="text-sm font-medium text-child-foreground">{t.title}</p>
                        <p className="text-[11px] text-child-muted">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Privacy & Transparency Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-40"
      >
        <div className="max-w-[430px] mx-auto px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <div className="bg-child-card/80 backdrop-blur-xl rounded-xl px-4 py-3 border border-child-border flex items-start gap-3">
            <Shield className="w-4 h-4 text-child-teal shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-child-muted">
              VibeCheck is active. Your chats are private and encrypted. We only watch for sustained shifts to keep you safe.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
