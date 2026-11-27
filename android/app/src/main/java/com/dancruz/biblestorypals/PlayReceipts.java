package com.dancruz.biblestorypals;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

// Decides what a Google Play purchase record is worth. Google signs each record with the app's
// licensing key; only a record with a good signature, for this app, in the "purchased" state
// opens anything. Everything else opens nothing, including a payment Google is still waiting
// for (cash, pay later). The product ids come from the signed text, never from anything unsigned.
//
// This class uses nothing from Android, so the unit tests run it on a plain JVM.
final class PlayReceipts {
    // purchaseState inside Google's signed JSON: 0 purchased, 1 cancelled, 4 pending.
    private static final int SIGNED_STATE_PURCHASED = 0;

    private PlayReceipts() {}

    // The product ids this record pays for, or an empty list when it must open nothing.
    static List<String> entitled(String licensingKey, String packageName, String signedJson, String signature) {
        try {
            if (!signedByGoogle(licensingKey, signedJson, signature)) return Collections.emptyList();
            JSONObject receipt = new JSONObject(signedJson);
            if (!packageName.equals(receipt.optString("packageName"))) return Collections.emptyList();
            if (receipt.optInt("purchaseState", -1) != SIGNED_STATE_PURCHASED) return Collections.emptyList();
            List<String> ids = new ArrayList<>();
            JSONArray many = receipt.optJSONArray("productIds");
            if (many != null) {
                for (int i = 0; i < many.length(); i++) ids.add(many.getString(i));
            } else if (receipt.has("productId")) {
                ids.add(receipt.getString("productId"));
            }
            return ids;
        } catch (Exception e) {
            return Collections.emptyList(); // fail closed
        }
    }

    static boolean signedByGoogle(String licensingKey, String signedJson, String signature) {
        try {
            if (licensingKey == null || licensingKey.isEmpty() || signedJson == null || signedJson.isEmpty()
                    || signature == null || signature.isEmpty()) return false;
            PublicKey key = KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(base64(licensingKey)));
            Signature check = Signature.getInstance("SHA1withRSA");
            check.initVerify(key);
            check.update(signedJson.getBytes(StandardCharsets.UTF_8));
            return check.verify(base64(signature));
        } catch (Exception e) {
            return false;
        }
    }

    // Standard base64. java.util.Base64 needs Android 8 and this app runs on Android 7;
    // android.util.Base64 doesn't exist on the JVM the unit tests run on.
    static byte[] base64(String text) {
        final String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
        int bits = 0, count = 0;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == '=' ) break;
            if (c == '\n' || c == '\r' || c == ' ') continue;
            int v = alphabet.indexOf(c);
            if (v < 0) throw new IllegalArgumentException("not base64");
            bits = (bits << 6) | v;
            count += 6;
            if (count >= 8) {
                count -= 8;
                out.write((bits >> count) & 0xff);
            }
        }
        return out.toByteArray();
    }
}
