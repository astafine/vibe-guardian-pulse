import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import VibeMeter from '@/components/VibeMeter';
import TrendBadge from '@/components/TrendBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Link2, Users, ChevronRight, ClipboardCheck, X } from 'lucide-react';
import { VibeZone } from '@/types/vibecheck';

interface LinkedChild {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  school_name: string | null;
}

// Dummy vibe data per child (will come from phone content analysis model later)
function getDummyVibeData(childId: string): { vibeScore: number; vibeZone: VibeZone; trendText: string; trendDirection: 'up' | 'stable' | 'down'; weeklyScores: number[] } {
  // Generate consistent dummy data based on childId hash
  const hash = childId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const score = 30 + (hash % 60); // 30-89 range
  const zone: VibeZone = score >= 70 ? 'green' : score >= 45 ? 'yellow' : 'red';
  const directions: Array<'up' | 'stable' | 'down'> = ['up', 'stable', 'down'];
  const dir = directions[hash % 3];
  const trendTexts = {
    up: 'Improving this week',
    stable: 'Stable for 5 days',
    down: '3-day downward trend',
  };
  // Generate 7 daily scores for the week
  const weeklyScores = Array.from({ length: 7 }, (_, i) => {
    const base = score + Math.sin(i * 1.5 + hash) * 15;
    return Math.max(10, Math.min(100, Math.round(base)));
  });

  return { vibeScore: score, vibeZone: zone, trendText: trendTexts[dir], trendDirection: dir, weeklyScores };
}

export default function FamilyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchLinkedChildren = async () => {
      const { data: links } = await supabase
        .from('parent_child_links')
        .select('child_id')
        .eq('parent_id', user.id)
        .eq('status', 'active');

      if (links && links.length > 0) {
        const childIds = links.map(l => l.child_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', childIds);
        
        if (profiles) {
          setChildren(profiles.map(p => ({
            id: p.id,
            user_id: p.user_id,
            first_name: p.first_name,
            last_name: p.last_name,
            date_of_birth: p.date_of_birth,
            school_name: p.school_name,
          })));
        }
      }
      setLoading(false);
    };

    fetchLinkedChildren();
  }, [user]);

  const getAge = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
    return age;
  };

  const toggleExpand = (childId: string) => {
    setExpandedChildId(expandedChildId === childId ? null : childId);
  };

  return (
    <div className="min-h-screen pb-24">
      <AppHeader title="VibeCheck" subtitle="Your family's emotional wellness" />

      <div className="px-5 mt-4 space-y-4">
        {/* Quick summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-navy rounded-2xl p-5 text-primary-foreground"
        >
          <p className="text-sm font-medium opacity-80">Family Overview</p>
          <p className="text-xl font-bold mt-1">
            {children.length} {children.length === 1 ? 'child' : 'children'} linked
          </p>
          <p className="text-xs opacity-60 mt-1">
            {children.length === 0 ? 'Link a child to get started' : 'Tap a child to see trends'}
          </p>
        </motion.div>

        {/* Linked children */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="glass-card-elevated rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted rounded w-32" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : children.length > 0 ? (
          children.map((child, i) => {
            const vibeData = getDummyVibeData(child.user_id);
            const isExpanded = expandedChildId === child.user_id;

            return (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="glass-card-elevated rounded-2xl overflow-hidden"
              >
                {/* Main card - tap to expand trends */}
                <div
                  onClick={() => toggleExpand(child.user_id)}
                  className="p-5 cursor-pointer active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-navy flex items-center justify-center text-2xl shadow-lg">
                      🧒
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-lg leading-tight">{child.first_name} {child.last_name}</h3>
                      <p className="text-muted-foreground text-sm">Age {getAge(child.date_of_birth)}</p>
                      <div className="mt-1.5">
                        <TrendBadge text={vibeData.trendText} direction={vibeData.trendDirection} />
                      </div>
                    </div>
                    <VibeMeter score={vibeData.vibeScore} zone={vibeData.vibeZone} size={100} />
                  </div>
                </div>

                {/* Expanded trends section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-border/50">
                        {/* Weekly trend chart */}
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Weekly Trend</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedChildId(null); }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-end gap-1.5 h-20">
                          {vibeData.weeklyScores.map((score, d) => (
                            <motion.div
                              key={d}
                              initial={{ height: 0 }}
                              animate={{ height: `${score}%` }}
                              transition={{ delay: d * 0.05, duration: 0.4 }}
                              className={`flex-1 rounded-t-md ${
                                score > 65 ? 'bg-mint' : score > 40 ? 'bg-warning' : 'bg-destructive/60'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <span key={d}>{d}</span>
                          ))}
                        </div>

                        {/* Insight Interview CTA (optional) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/diagnostic/${child.user_id}`, { state: { child } });
                          }}
                          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                          <span>Verify Physical Signs</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card-elevated rounded-2xl p-8 text-center"
          >
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-lg">No children linked yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Link a child's profile or add a new child device to get started.
            </p>
          </motion.div>
        )}

        {/* Add a child */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          onClick={() => navigate('/link-child')}
          className="w-full glass-card rounded-2xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold text-sm">Add a child</span>
        </motion.button>
      </div>
    </div>
  );
}
