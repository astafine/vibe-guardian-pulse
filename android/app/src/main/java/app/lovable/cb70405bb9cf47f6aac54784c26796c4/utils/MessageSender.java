package app.lovable.cb70405bb9cf47f6aac54784c26796c4.utils;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class MessageSender {

    private static final String TAG = "VibeCheckSender";
    private static final String SERVER_URL = "http://34.29.232.168:8000/api/chat-ingest";

    public static void send(final Context context, final String deviceId, final String app, final String encryptedData, final String iv, final long timestamp) {
        new Thread(() -> {
            HttpURLConnection conn = null;
            try {
                showToast(context, "Sending " + app + " message to server...");

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

                 String responseBody = readStream(
                    responseCode >= 200 && responseCode < 400 ? conn.getInputStream() : conn.getErrorStream()
                );
                Log.d(TAG, "Server response body: " + responseBody);

                if (responseCode >= 200 && responseCode < 300) {
                    showToast(context, "Server send OK (" + responseCode + ")");
                } else {
                    showToast(context, "Server send failed (" + responseCode + ")");
                }
            } catch (Exception e) {
                Log.e(TAG, "Failed to send message", e);
                showToast(context, "Send error: " + e.getClass().getSimpleName());
            } finally {
                if (conn != null) conn.disconnect();
            }
        }).start();
    }

    private static void showToast(Context context, String message) {
        if (context == null) return;

        Handler handler = new Handler(Looper.getMainLooper());
        handler.post(() -> Toast.makeText(context.getApplicationContext(), message, Toast.LENGTH_SHORT).show());
    }

    private static String readStream(InputStream stream) {
        if (stream == null) return "";

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
            StringBuilder builder = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }

            return builder.toString();
        } catch (Exception e) {
            Log.e(TAG, "Failed to read response body", e);
            return "";
        }
    }
}
