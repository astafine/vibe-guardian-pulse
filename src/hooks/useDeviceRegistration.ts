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
        let deviceId: string | null = null;

        // Try AndroidPermissionsPlugin.getDeviceId() — returns ANDROID_ID (same ID backend uses)
        try {
          const { registerPlugin } = await import('@capacitor/core');
          const AndroidPermissions = registerPlugin<{ getDeviceId: () => Promise<{ identifier: string }> }>('AndroidPermissions');
          const result = await AndroidPermissions.getDeviceId();
          deviceId = result.identifier || null;
          console.log('Got device ID from AndroidPermissions plugin:', deviceId);
        } catch (e) {
          console.warn('AndroidPermissions.getDeviceId failed:', e);
        }

        // Fallback: use Capacitor Device plugin
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
