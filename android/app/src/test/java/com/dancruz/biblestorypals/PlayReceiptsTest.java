package com.dancruz.biblestorypals;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Signature;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;

import org.junit.BeforeClass;
import org.junit.Test;

// What a Google Play purchase record opens. The key pairs are made here, so no real key is involved.
public class PlayReceiptsTest {
    private static final String APP = "com.dancruz.biblestorypals";
    private static final String PACK = APP + ".bundle.everything";
    private static KeyPair google;
    private static KeyPair someoneElse;

    @BeforeClass
    public static void makeKeys() throws Exception {
        KeyPairGenerator maker = KeyPairGenerator.getInstance("RSA");
        maker.initialize(2048);
        google = maker.generateKeyPair();
        someoneElse = maker.generateKeyPair();
    }

    private static String key(KeyPair pair) {
        return Base64.getEncoder().encodeToString(pair.getPublic().getEncoded());
    }

    private static String sign(KeyPair pair, String json) throws Exception {
        Signature signer = Signature.getInstance("SHA1withRSA");
        signer.initSign(pair.getPrivate());
        signer.update(json.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(signer.sign());
    }

    private static String receipt(String packageName, int state, String products) {
        return "{\"orderId\":\"GPA.0000-0000-0000-00000\",\"packageName\":\"" + packageName + "\"," + products
                + ",\"purchaseTime\":1795000000000,\"purchaseState\":" + state + ",\"purchaseToken\":\"token\",\"acknowledged\":false}";
    }

    private static String one(String id) { return "\"productId\":\"" + id + "\""; }

    @Test
    public void aPaidSignedPurchaseOpensItsProduct() throws Exception {
        String json = receipt(APP, 0, one(PACK));
        assertEquals(Collections.singletonList(PACK), PlayReceipts.entitled(key(google), APP, json, sign(google, json)));
    }

    @Test
    public void aCartOfSeveralProductsOpensEachOne() throws Exception {
        String json = receipt(APP, 0, "\"productIds\":[\"" + APP + ".world.island\",\"" + APP + ".world.sea\"]");
        assertEquals(Arrays.asList(APP + ".world.island", APP + ".world.sea"),
                PlayReceipts.entitled(key(google), APP, json, sign(google, json)));
    }

    @Test
    public void aPendingPaymentOpensNothing() throws Exception {
        String json = receipt(APP, 4, one(PACK));
        assertTrue(PlayReceipts.entitled(key(google), APP, json, sign(google, json)).isEmpty());
    }

    @Test
    public void aCancelledPurchaseOpensNothing() throws Exception {
        String json = receipt(APP, 1, one(PACK));
        assertTrue(PlayReceipts.entitled(key(google), APP, json, sign(google, json)).isEmpty());
    }

    @Test
    public void aRecordWithNoStateOpensNothing() throws Exception {
        String json = "{\"packageName\":\"" + APP + "\"," + one(PACK) + "}";
        assertTrue(PlayReceipts.entitled(key(google), APP, json, sign(google, json)).isEmpty());
    }

    @Test
    public void aPurchaseFromAnotherAppOpensNothing() throws Exception {
        String json = receipt("com.example.other", 0, one(PACK));
        assertTrue(PlayReceipts.entitled(key(google), APP, json, sign(google, json)).isEmpty());
    }

    @Test
    public void aRecordChangedAfterSigningOpensNothing() throws Exception {
        String pending = receipt(APP, 4, one(PACK));
        String forged = receipt(APP, 0, one(PACK));
        assertTrue(PlayReceipts.entitled(key(google), APP, forged, sign(google, pending)).isEmpty());
    }

    @Test
    public void aRecordSignedBySomeoneElseOpensNothing() throws Exception {
        String json = receipt(APP, 0, one(PACK));
        assertTrue(PlayReceipts.entitled(key(google), APP, json, sign(someoneElse, json)).isEmpty());
    }

    @Test
    public void withoutAKeyOrASignatureNothingOpens() throws Exception {
        String json = receipt(APP, 0, one(PACK));
        assertTrue(PlayReceipts.entitled("", APP, json, sign(google, json)).isEmpty());
        assertTrue(PlayReceipts.entitled(key(google), APP, json, "").isEmpty());
        assertTrue(PlayReceipts.entitled("not a key", APP, json, sign(google, json)).isEmpty());
        assertFalse(PlayReceipts.signedByGoogle(key(google), "", sign(google, json)));
    }

    @Test
    public void base64MatchesTheJavaDecoder() {
        byte[] bytes = new byte[259];
        for (int i = 0; i < bytes.length; i++) bytes[i] = (byte) (i * 7);
        for (int length : new int[] {0, 1, 2, 3, 258, 259}) {
            byte[] part = Arrays.copyOf(bytes, length);
            assertTrue(Arrays.equals(part, PlayReceipts.base64(Base64.getEncoder().encodeToString(part))));
        }
    }
}
