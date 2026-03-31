import { useEffect, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface LinkedChild {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  device_id: string | null;
}

interface MentalStateEntry {
  emotional_state: { overall_score: number };
  analyzed_at: string;
}

export default function Trends() {
  const { user } = useAuth();
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [trendsData, setTrendsData] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchChildren = async () => {
      const { data: links } = await supabase
        .from('parent_child_links')
        .select('child_id')
        .eq('parent_id', user.id)
        .eq('status', 'active');

      if (!links || links.length === 0) {
        setChildren([]);
        setLoading(false);
        return;
      }

      const childIds = links.map(l => l.child_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', childIds);

      const { data: devices } = await supabase
        .from('user_devices')
        .select('user_id, device_id')
        .in('user_id', childIds);

      const deviceMap = new Map(devices?.map(d => [d.user_id, d.device_id]) || []);

      const mapped = (profiles || []).map(p => ({
        id: p.id,
        user_id: p.user_id,
        first_name: p.first_name,
        last_name: p.last_name,
        device_id: deviceMap.get(p.user_id) || null,
      }));

      setChildren(mapped);

      // Fetch trends for each child with a device
      const trends: Record<string, number[]> = {};
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      for (const child of mapped) {
        if (!child.device_id) continue;
        try {
          const res = await fetch(
            `${supabaseUrl}/functions/v1/mental-state?device_id=${child.device_id}`,
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              },
            }
          );
          if (res.ok) {
            const json = await res.json();
            const entries: MentalStateEntry[] = Array.isArray(json) ? json : [json];
            const scores = entries
              .slice(0, 7)
              .map(e => Math.round((e.emotional_state?.overall_score ?? 0) * 100))
              .reverse();
            trends[child.user_id] = scores;
          }
        } catch {
          // ignore fetch errors
        }
      }
      setTrendsData(trends);
      setLoading(false);
    };

    fetchChildren();
  }, [user]);

  return (
    <div className="min-h-screen pb-24">
      <AppHeader title="Trends" subtitle="Weekly emotional patterns" />
      <div className="px-5 mt-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="glass-card-elevated rounded-2xl p-5 animate-pulse">
                <div className="h-5 bg-muted rounded w-32 mb-4" />
                <div className="h-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : children.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card-elevated rounded-2xl p-8 text-center"
          >
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-lg">No children linked</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Link a child from the Family dashboard to see trends.
            </p>
          </motion.div>
        ) : (
          children.map((child, i) => {
            const scores = trendsData[child.user_id] || [];
            const hasData = scores.length > 0;

            return (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-elevated rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧒</span>
                  <h3 className="font-bold text-foreground">{child.first_name} {child.last_name}</h3>
                </div>

                {hasData ? (
                  <>
                    <div className="flex items-end gap-1 h-16">
                      {scores.map((score, d) => (
                        <motion.div
                          key={d}
                          initial={{ height: 0 }}
                          animate={{ height: `${score}%` }}
                          transition={{ delay: i * 0.1 + d * 0.05, duration: 0.4 }}
                          className={`flex-1 rounded-t-md ${
                            score > 65 ? 'bg-mint' : score > 40 ? 'bg-warning' : 'bg-destructive/60'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                      {scores.map((_, idx) => (
                        <span key={idx}>#{idx + 1}</span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No data yet — waiting for device activity.
                  </p>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
