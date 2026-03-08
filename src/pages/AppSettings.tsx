import AppHeader from '@/components/AppHeader';
import { motion } from 'framer-motion';
import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile', action: 'profile' },
      { icon: Bell, label: 'Notifications', action: 'notifications' },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { icon: Shield, label: 'Data & Privacy', action: 'privacy' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', action: 'help' },
      { icon: LogOut, label: 'Sign Out', action: 'signout' },
    ],
  },
];

export default function AppSettings() {
  const handleAction = async (action: string) => {
    if (action === 'signout') {
      await supabase.auth.signOut();
      toast.success('Signed out');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <AppHeader title="Settings" />
      <div className="px-5 mt-4 space-y-6">
        {settingsGroups.map((group, gi) => (
          <motion.div key={gi} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{group.title}</p>
            <div className="glass-card-elevated rounded-2xl overflow-hidden divide-y divide-border/50">
              {group.items.map(({ icon: Icon, label, action }, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(action)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-sand-warm/50 transition-colors ${action === 'signout' ? 'text-destructive' : ''}`}
                >
                  <Icon className={`w-5 h-5 ${action === 'signout' ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <span className="flex-1 text-left text-sm font-medium">{label}</span>
                  {action !== 'signout' && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
