import { useEffect, useState, useRef, useCallback } from 'react';
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
  const initialFetchDone = useRef(false);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    setProfile(data as UserProfile | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const INSTALL_MARKER = 'vibecheck_installed';

    const init = async () => {
      // If no install marker, treat as fresh install → clear session
      if (!localStorage.getItem(INSTALL_MARKER)) {
        localStorage.setItem(INSTALL_MARKER, 'true');
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setLoading(true);
        initialFetchDone.current = true;
        fetchProfile(s.user.id);
      } else {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);

        if (s?.user) {
          if (initialFetchDone.current) {
            initialFetchDone.current = false;
            return;
          }
          setLoading(true);
          fetchProfile(s.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  return { user, session, profile, loading, signOut };
}
