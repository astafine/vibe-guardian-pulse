import { registerPlugin } from '@capacitor/core';

export interface PermissionStatus {
  accessibility: boolean;
  usageStats: boolean;
  notificationListener: boolean;
}

export interface AndroidPermissionsPlugin {
  checkPermissions(): Promise<PermissionStatus>;
  openAccessibilitySettings(): Promise<void>;
  openUsageStatsSettings(): Promise<void>;
  openNotificationListenerSettings(): Promise<void>;
}

const AndroidPermissions = registerPlugin<AndroidPermissionsPlugin>('AndroidPermissions');

export default AndroidPermissions;
