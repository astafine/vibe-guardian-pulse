import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Android?: {
      getDeviceId?: () => string;
    };
  }
}

/**
 * Registers the Android device ID against the current user in the user_devices table.
 * Uses Android's Settings.Secure.ANDROID_ID retrieved via a JS bridge or falls back to a
 * Capacitor plugin approach.
 */
export function useDeviceRegistration(userId: string | undefined, role: string | undefined) {
  useEffect(() => {
    if (!userId || role !== 'child') return;
    if (!Capacitor.isNativePlatform()) return;

    const registerDevice = async () => {
      try {
        // Try getting device ID from the Android JS bridge
        let deviceId: string | null = null;

        if (window.Android?.getDeviceId) {
          deviceId = window.Android.getDeviceId();
        }

        // Fallback: use Capacitor Device plugin if available
        if (!deviceId) {
          try {
            const { Device } = await import('@capacitor/device');
            const info = await Device.getId();
            deviceId = info.identifier;
          } catch {
            console.warn('Device plugin not available');
          }
        }

        if (!deviceId) {
          console.warn('Could not retrieve device ID');
          return;
        }

        // Upsert into user_devices
        const { error } = await supabase
          .from('user_devices' as any)
          .upsert(
            { user_id: userId, device_id: deviceId } as any,
            { onConflict: 'user_id,device_id' }
          );

        if (error) {
          console.error('Failed to register device:', error);
        } else {
          console.log('Device registered:', deviceId);
        }
      } catch (err) {
        console.error('Device registration error:', err);
      }
    };

    registerDevice();
  }, [userId, role]);
}
