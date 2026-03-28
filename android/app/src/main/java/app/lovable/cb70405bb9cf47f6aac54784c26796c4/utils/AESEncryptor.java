package app.lovable.cb70405bb9cf47f6aac54784c26796c4.utils;

import android.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;

public class AESEncryptor {

    private static final String AES_KEY_B64 = "5CTqECucIw3lEj9gg8O4eRwtw6IcJ2buzn9HoTdwh3U=";
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";

    public static String[] encrypt(String plainText) throws Exception {
        byte[] keyBytes = Base64.decode(AES_KEY_B64, Base64.NO_WRAP);
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
