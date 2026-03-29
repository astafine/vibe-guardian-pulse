package app.lovable.cb70405bb9cf47f6aac54784c26796c4.utils;

import android.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;

public class AESEncryptor {

    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";

    /**
     * Encrypts plaintext using the provided Base64-encoded AES key.
     * Returns [encryptedDataB64, ivB64].
     */
    public static String[] encrypt(String plainText, String keyB64) throws Exception {
        byte[] keyBytes = Base64.decode(keyB64, Base64.NO_WRAP);
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");

        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
        byte[] encrypted = cipher.doFinal(plainText.getBytes("UTF-8"));

        String encryptedB64 = Base64.encodeToString(encrypted, Base64.NO_WRAP);
        String ivB64 = Base64.encodeToString(iv, Base64.NO_WRAP);

        return new String[]{encryptedB64, ivB64};
    }
}
