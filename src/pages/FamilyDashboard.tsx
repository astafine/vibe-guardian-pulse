import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Link2, Users } from 'lucide-react';

interface LinkedChild {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  school_name: string | null;
}

export default function FamilyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchLinkedChildren = async () => {
      // Get linked child IDs
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
          <p className="text-sm font-medium opacity-80">Family Overview</p>
          <p className="text-xl font-bold mt-1">
            {children.length} {children.length === 1 ? 'child' : 'children'} linked
          </p>
          <p className="text-xs opacity-60 mt-1">
            {children.length === 0 ? 'Link a child to get started' : 'Tap a child to check in'}
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
          children.map((child, i) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              onClick={() => navigate(`/diagnostic/${child.user_id}`, { state: { child } })}
              className="glass-card-elevated rounded-2xl p-5 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gradient-navy flex items-center justify-center text-2xl shadow-lg">
                  🧒
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-lg leading-tight">{child.first_name} {child.last_name}</h3>
                  <p className="text-muted-foreground text-sm">Age {getAge(child.date_of_birth)}</p>
                  {child.school_name && (
                    <p className="text-muted-foreground text-xs mt-0.5">{child.school_name}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
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

        {/* Link existing child */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          onClick={() => navigate('/link-child')}
          className="w-full glass-card rounded-2xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link2 className="w-5 h-5" />
          <span className="font-semibold text-sm">Link a child's profile</span>
        </motion.button>

        {/* Add child device */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/setup')}
          className="w-full glass-card rounded-2xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold text-sm">Add a child device</span>
        </motion.button>
      </div>
    </div>
  );
}
