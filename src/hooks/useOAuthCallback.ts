import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Listens for deep-link OAuth callbacks on native platforms.
 * When Google auth completes, it redirects back to the app with tokens in the URL.
 */
export function useOAuthCallback() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      console.log('[OAuthCallback] Not native platform, skipping listener');
      return;
    }

    console.log('[OAuthCallback] Setting up appUrlOpen listener...');

    const handleUrlOpen = async (event: URLOpenListenerEvent) => {
      console.log('[OAuthCallback] Received URL:', event.url);
      toast.info('Received OAuth callback...');

      try {
        const url = new URL(event.url);
        
        // Check for auth callback patterns
        const accessToken = url.searchParams.get('access_token') || 
                           url.hash.match(/access_token=([^&]*)/)?.[1];
        const refreshToken = url.searchParams.get('refresh_token') ||
                            url.hash.match(/refresh_token=([^&]*)/)?.[1];

        if (accessToken) {
          console.log('[OAuthCallback] Found access token, setting session...');
          toast.info('Setting session...');

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('[OAuthCallback] setSession error:', error);
            toast.error(`Session error: ${error.message}`);
          } else {
            console.log('[OAuthCallback] Session set successfully!');
            toast.success('Signed in successfully!');
          }
        } else {
          console.log('[OAuthCallback] No access_token found in URL');
          
          // Try extracting from hash fragment (common OAuth pattern)
          if (url.hash) {
            console.log('[OAuthCallback] Hash fragment:', url.hash);
          }
        }
      } catch (err: any) {
        console.error('[OAuthCallback] Error processing callback:', err);
        toast.error(`Callback error: ${err.message}`);
      }
    };

    App.addListener('appUrlOpen', handleUrlOpen);

    return () => {
      App.removeAllListeners();
    };
  }, []);
}
