package app.lovable.cb70405bb9cf47f6aac54784c26796c4.services;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

public class VibeCheckNotificationListenerService extends NotificationListenerService {

    private static final String TAG = "VibeCheckNotif";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn == null) return;
        String packageName = sbn.getPackageName();
        Log.d(TAG, "Notification posted from: " + packageName);
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        if (sbn == null) return;
        Log.d(TAG, "Notification removed from: " + sbn.getPackageName());
    }

    @Override
    public void onListenerConnected() {
        super.onListenerConnected();
        Log.d(TAG, "Notification listener connected");
    }
}
