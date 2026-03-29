import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import AndroidPermissions, { PermissionStatus } from '@/plugins/AndroidPermissions';

const DEFAULT_STATUS: PermissionStatus = {
  accessibility: false,
  usageStats: false,
  notificationListener: false,
};

export function useAndroidPermissions() {
  const [status, setStatus] = useState<PermissionStatus>(DEFAULT_STATUS);
  const [loading, setLoading] = useState(true);
  const isNative = Capacitor.isNativePlatform();

  const check = useCallback(async () => {
    if (!isNative) {
      // On web, skip permissions gate — grant all
      setStatus({ accessibility: true, usageStats: true, notificationListener: true });
      setLoading(false);
      return;
    }
    try {
      const result = await AndroidPermissions.checkPermissions();
      setStatus(result);
    } catch {
      setStatus(DEFAULT_STATUS);
    }
    setLoading(false);
  }, [isNative]);

  useEffect(() => {
    check();
  }, [check]);

  // Re-check when app resumes (user comes back from settings)
  useEffect(() => {
    if (!isNative) return;
    const handleResume = () => check();
    document.addEventListener('resume', handleResume);
    return () => document.removeEventListener('resume', handleResume);
  }, [check, isNative]);

  const allGranted = status.accessibility;

  const openSettings = useCallback(async (type: 'accessibility' | 'usageStats' | 'notificationListener') => {
    if (!isNative) return;
    switch (type) {
      case 'accessibility':
        await AndroidPermissions.openAccessibilitySettings();
        break;
      case 'usageStats':
        await AndroidPermissions.openUsageStatsSettings();
        break;
      case 'notificationListener':
        await AndroidPermissions.openNotificationListenerSettings();
        break;
    }
  }, [isNative]);

  return { status, loading, allGranted, check, openSettings, isNative };
}
