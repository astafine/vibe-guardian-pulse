import { motion } from 'framer-motion';
import { Shield, Eye, BarChart3, Bell, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAndroidPermissions } from '@/hooks/useAndroidPermissions';

const permissions = [
  {
    key: 'accessibility' as const,
    label: 'Accessibility Service',
    description: 'Helps your parent understand how you use your device',
    icon: Eye,
  },
];

export default function PermissionsSetup() {
  const { status, openSettings, isNative } = useAndroidPermissions();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[380px] space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl gradient-navy flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Permissions Needed</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            VibeCheck needs these permissions to keep you safe. Please enable each one.
          </p>
        </div>

        {/* Permission cards */}
        <div className="space-y-3">
          {permissions.map((perm, i) => {
            const granted = status[perm.key];
            const Icon = perm.icon;

            return (
              <motion.button
                key={perm.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => !granted && openSettings(perm.key)}
                disabled={granted}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  granted
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-border bg-card hover:border-primary/50 hover:shadow-md active:scale-[0.98]'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  granted ? 'bg-emerald-500/20' : 'bg-muted'
                }`}>
                  {granted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${granted ? 'text-emerald-600' : 'text-foreground'}`}>
                    {perm.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{perm.description}</p>
                </div>
                {!granted && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Info text */}
        {!isNative && (
          <p className="text-xs text-center text-muted-foreground bg-muted/50 rounded-xl p-3">
            ⚠️ Permission checks only work on the Android app. This is a preview of the setup screen.
          </p>
        )}
      </motion.div>
    </div>
  );
}
