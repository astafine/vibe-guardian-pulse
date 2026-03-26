package app.lovable.cb70405bb9cf47f6aac54784c26796c4.services;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.view.accessibility.AccessibilityEvent;
import android.util.Log;

public class VibeCheckAccessibilityService extends AccessibilityService {

    private static final String TAG = "VibeCheckA11y";

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event == null) return;

        int eventType = event.getEventType();
        CharSequence packageName = event.getPackageName();

        if (packageName == null) return;

        switch (eventType) {
            case AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED:
                Log.d(TAG, "Window changed: " + packageName);
                break;
            case AccessibilityEvent.TYPE_VIEW_CLICKED:
                Log.d(TAG, "View clicked in: " + packageName);
                break;
        }
    }

    @Override
    public void onInterrupt() {
        Log.d(TAG, "Accessibility service interrupted");
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        Log.d(TAG, "Accessibility service connected");
    }
}
