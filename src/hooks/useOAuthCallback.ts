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

      try {
        const url = new URL(event.url);
        
        // Extract tokens from query params, hash fragment, or fragment as query params
        // Supabase may return tokens in different formats depending on the flow
        const hashParams = new URLSearchParams(
          url.hash.startsWith('#') ? url.hash.substring(1) : ''
        );
        
        const accessToken = url.searchParams.get('access_token') || 
                           hashParams.get('access_token');
        const refreshToken = url.searchParams.get('refresh_token') ||
                            hashParams.get('refresh_token');

        if (accessToken) {
          console.log('[OAuthCallback] Found access token, setting session...');

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
            // Close the browser that was opened for OAuth
            try {
              const { Browser } = await import('@capacitor/browser');
              await Browser.close();
            } catch (_) {}
          }
        } else {
          console.log('[OAuthCallback] No access_token found in URL, params:', url.search, 'hash:', url.hash);
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
