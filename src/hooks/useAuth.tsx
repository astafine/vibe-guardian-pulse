import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  role: 'parent' | 'child';
  school_name: string | null;
  link_code: string | null;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFetchRef = useRef(false);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    setProfile(data as UserProfile | null);
    setLoading(false);
  };

  useEffect(() => {
    // First get the existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        profileFetchRef.current = true;
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Then listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Skip if getSession already triggered this fetch
          if (profileFetchRef.current) {
            profileFetchRef.current = false;
            return;
          }
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return { user, session, profile, loading, signOut };
}
