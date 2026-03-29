package app.lovable.cb70405bb9cf47f6aac54784c26796c4.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;

/**
 * Generates a per-device AES-256 key on first run, stores it in SharedPreferences,
 * and registers it with the backend server.
 */
public class KeyManager {

    private static final String TAG = "VibeCheckKeyMgr";
    private static final String PREFS_NAME = "vibecheck_prefs";
    private static final String KEY_AES = "aes_key";
    private static final String KEY_REGISTERED = "key_registered";
    private static final String REGISTER_URL = "http://34.29.232.168:8000/api/register-device";

    /**
     * Returns the AES key (Base64). Generates one if it doesn't exist yet.
     */
    public static String getOrCreateKey(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String existing = prefs.getString(KEY_AES, null);

        if (existing != null) {
            return existing;
        }

        // Generate random 32-byte (256-bit) key
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        String keyB64 = Base64.encodeToString(key, Base64.NO_WRAP);

        prefs.edit().putString(KEY_AES, keyB64).apply();
        Log.d(TAG, "Generated new AES key");

        return keyB64;
    }

    /**
     * Registers the device + AES key with the server (once).
     * Call from a background thread.
     */
    public static void registerIfNeeded(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        if (prefs.getBoolean(KEY_REGISTERED, false)) {
            Log.d(TAG, "Device already registered with server");
            return;
        }

        String aesKey = getOrCreateKey(context);
        String deviceId = Settings.Secure.getString(
                context.getContentResolver(), Settings.Secure.ANDROID_ID);

        new Thread(() -> {
            HttpURLConnection conn = null;
            try {
                JSONObject payload = new JSONObject();
                payload.put("device_id", deviceId);
                payload.put("aes_key", aesKey);

                URL url = new URL(REGISTER_URL);
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                conn.setConnectTimeout(10000);
                conn.setReadTimeout(10000);

                OutputStream os = conn.getOutputStream();
                os.write(payload.toString().getBytes("UTF-8"));
                os.flush();
                os.close();

                int code = conn.getResponseCode();
                Log.d(TAG, "Register response: " + code);

                if (code >= 200 && code < 300) {
                    prefs.edit().putBoolean(KEY_REGISTERED, true).apply();
                    Log.d(TAG, "Device registered successfully");
                } else {
                    Log.e(TAG, "Registration failed with code: " + code);
                }
            } catch (Exception e) {
                Log.e(TAG, "Registration error", e);
            } finally {
                if (conn != null) conn.disconnect();
            }
        }).start();
    }
}
