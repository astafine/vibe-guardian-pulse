import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MentalStateEntry {
  device_id: string;
  analyzed_at: string;
  overall_mood: string;
  stress_level: number;
  energy_level: number;
  sentiment_score: number;
  emotions_detected: string[];
  dominant_topics: string[];
  red_flags: string[];
  positive_signals: string[];
  summary: string;
  confidence_score: number;
  messages_analyzed: number;
}

export function useMentalState(deviceId: string | null) {
  const [data, setData] = useState<MentalStateEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    if (!deviceId) return;
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/mental-state?device_id=${deviceId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : [json]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }, [fetchState]);

  return { data, loading, error, refetch: fetchState };
}
