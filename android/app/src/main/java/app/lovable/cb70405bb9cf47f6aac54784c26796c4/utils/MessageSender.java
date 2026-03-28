package app.lovable.cb70405bb9cf47f6aac54784c26796c4.utils;

import android.util.Log;
import org.json.JSONObject;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class MessageSender {

    private static final String TAG = "VibeCheckSender";
    private static final String SERVER_URL = "http://34.29.232.168/api/chat-ingest";

    public static void send(final String deviceId, final String app, final String encryptedData, final String iv, final long timestamp) {
        new Thread(() -> {
            HttpURLConnection conn = null;
            try {
                JSONObject payload = new JSONObject();
                payload.put("device_id", deviceId);
                payload.put("app", app);
                payload.put("encrypted_data", encryptedData);
                payload.put("iv", iv);
                payload.put("timestamp", timestamp);

                URL url = new URL(SERVER_URL);
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

                int responseCode = conn.getResponseCode();
                Log.d(TAG, "Server response: " + responseCode);
            } catch (Exception e) {
                Log.e(TAG, "Failed to send message", e);
            } finally {
                if (conn != null) conn.disconnect();
            }
        }).start();
    }
}
