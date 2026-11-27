package com.dancruz.biblestorypals;

import android.content.Context;
import android.content.SharedPreferences;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClient.BillingResponseCode;
import com.android.billingclient.api.BillingClient.ProductType;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

// The one-time purchases that unlock stories, worlds and prayers (js/unlocks.js), sold through
// Google Play Billing. It answers the same four calls as ios/App/App/UnlocksPlugin.swift.
//
// The rules Google Play needs, and where each one lives:
//   1. Verify: only a record signed with this app's Play licensing key counts (PlayReceipts).
//   2. Pending is not paid: a payment Google is still waiting for opens nothing.
//   3. Grant, then acknowledge: what a family owns is written to the device first, and only
//      then is the purchase acknowledged. Google refunds a purchase nobody acknowledges
//      within three days.
//   4. Restore: what a family owns is read from Google Play every time it's asked for, so a
//      purchase survives a reinstall, and one finished while the app was closed is picked up
//      (and acknowledged) the next time the app opens. A refund locks the story again.
// The app keeps no account and sends nothing anywhere but Google Play.
@CapacitorPlugin(name = "Unlocks")
public class UnlocksPlugin extends Plugin implements PurchasesUpdatedListener {
    private static final String PREFS = "unlocks";
    private static final String GRANTED = "granted";

    private BillingClient billing;
    private PluginCall buying; // the buy() call waiting for Google Play's sheet to close

    @Override
    public void load() {
        billing = BillingClient.newBuilder(getContext())
                .setListener(this)
                .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
                .enableAutoServiceReconnection()
                .build();
    }

    @Override
    protected void handleOnDestroy() {
        if (billing != null) billing.endConnection();
    }

    private interface Failed { void because(String message); }

    // Several calls can arrive while Google Play is still connecting (the game asks for what is
    // owned and for prices at the same moment), so they wait for the one connection together.
    private boolean connecting;
    private final List<Runnable> waiting = new ArrayList<>();
    private final List<Failed> waitingToFail = new ArrayList<>();

    private void connected(Runnable then, Failed failed) {
        if (billing.isReady()) { then.run(); return; }
        synchronized (this) {
            waiting.add(then);
            waitingToFail.add(failed);
            if (connecting) return;
            connecting = true;
        }
        billing.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult result) {
                List<Runnable> go;
                List<Failed> stop;
                synchronized (UnlocksPlugin.this) {
                    connecting = false;
                    go = new ArrayList<>(waiting);
                    stop = new ArrayList<>(waitingToFail);
                    waiting.clear();
                    waitingToFail.clear();
                }
                if (result.getResponseCode() == BillingResponseCode.OK) for (Runnable run : go) run.run();
                else for (Failed fail : stop) fail.because("Google Play isn't available right now.");
            }
            @Override public void onBillingServiceDisconnected() { /* the client reconnects by itself */ }
        });
    }

    private Set<String> saved() {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        return new TreeSet<>(prefs.getStringSet(GRANTED, Collections.emptySet()));
    }

    private static JSObject answer(Set<String> owned, int pending) {
        JSObject r = new JSObject();
        r.put("owned", new JSArray(new ArrayList<>(owned)));
        if (pending > 0) r.put("pendingCount", pending);
        return r;
    }

    private interface Sorted { void done(Set<String> owned, int pending); }

    // Works through everything Google Play says this family has bought: verifies each record,
    // writes what is owned to the device, and only then acknowledges the purchases that still
    // need it. A record that fails the check is neither granted nor acknowledged.
    private void settle(List<Purchase> purchases, Sorted then) {
        Set<String> owned = new TreeSet<>();
        List<Purchase> toAcknowledge = new ArrayList<>();
        int pending = 0;
        for (Purchase purchase : purchases) {
            if (purchase.getPurchaseState() == Purchase.PurchaseState.PENDING) { pending++; continue; }
            if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) continue;
            List<String> ids = PlayReceipts.entitled(BuildConfig.PLAY_LICENSING_KEY, getContext().getPackageName(),
                    purchase.getOriginalJson(), purchase.getSignature());
            if (ids.isEmpty()) continue;
            owned.addAll(ids);
            if (!purchase.isAcknowledged()) toAcknowledge.add(purchase);
        }
        // Grant first: commit() returns once the grant is on disk.
        boolean granted = getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .edit().putStringSet(GRANTED, new HashSet<>(owned)).commit();
        if (granted) {
            for (Purchase purchase : toAcknowledge) {
                billing.acknowledgePurchase(
                        AcknowledgePurchaseParams.newBuilder().setPurchaseToken(purchase.getPurchaseToken()).build(),
                        result -> { /* if this didn't reach Google, the next status() tries again */ });
            }
        }
        then.done(owned, pending);
    }

    private void owned(Sorted then, Failed failed) { owned(Collections.emptyList(), then, failed); }

    // `justBought` are purchases Google Play has just handed over, in case its list hasn't caught up.
    private void owned(List<Purchase> justBought, Sorted then, Failed failed) {
        connected(() -> billing.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder().setProductType(ProductType.INAPP).build(),
                (result, purchases) -> {
                    if (result.getResponseCode() != BillingResponseCode.OK) {
                        failed.because("Google Play isn't available right now.");
                        return;
                    }
                    List<Purchase> all = new ArrayList<>(purchases);
                    Set<String> tokens = new HashSet<>();
                    for (Purchase purchase : purchases) tokens.add(purchase.getPurchaseToken());
                    for (Purchase purchase : justBought) if (tokens.add(purchase.getPurchaseToken())) all.add(purchase);
                    settle(all, then);
                }), failed);
    }

    // What the family owns. If Google Play can't be asked right now, the last answer stands.
    @PluginMethod
    public void status(PluginCall call) {
        owned((owned, pending) -> call.resolve(answer(owned, pending)),
                message -> call.resolve(answer(saved(), 0)));
    }

    @PluginMethod
    public void restore(PluginCall call) {
        owned((owned, pending) -> call.resolve(answer(owned, pending)),
                message -> call.reject(message, "FAILED"));
    }

    private interface Found { void details(List<ProductDetails> products); }

    private void details(List<String> ids, Found then, Failed failed) {
        List<QueryProductDetailsParams.Product> wanted = new ArrayList<>();
        for (String id : ids) {
            wanted.add(QueryProductDetailsParams.Product.newBuilder().setProductId(id).setProductType(ProductType.INAPP).build());
        }
        if (wanted.isEmpty()) { then.details(Collections.emptyList()); return; }
        connected(() -> billing.queryProductDetailsAsync(
                QueryProductDetailsParams.newBuilder().setProductList(wanted).build(),
                (result, found) -> {
                    if (result.getResponseCode() != BillingResponseCode.OK) {
                        failed.because("Google Play isn't available right now.");
                        return;
                    }
                    then.details(found.getProductDetailsList());
                }), failed);
    }

    // Google Play's localized price for each product it can sell.
    @PluginMethod
    public void products(PluginCall call) {
        List<String> ids = new ArrayList<>();
        try {
            JSArray asked = call.getArray("ids", new JSArray());
            for (int i = 0; i < asked.length(); i++) ids.add(asked.getString(i));
        } catch (Exception e) { /* no ids, no prices */ }
        details(ids, products -> {
            JSObject prices = new JSObject();
            for (ProductDetails product : products) {
                ProductDetails.OneTimePurchaseOfferDetails offer = product.getOneTimePurchaseOfferDetails();
                if (offer != null) prices.put(product.getProductId(), offer.getFormattedPrice());
            }
            JSObject r = new JSObject();
            r.put("prices", prices);
            call.resolve(r);
        }, message -> call.reject(message, "FAILED"));
    }

    @PluginMethod
    public void buy(PluginCall call) {
        String id = call.getString("id");
        if (id == null) { call.reject("No product was named.", "UNAVAILABLE"); return; }
        if (buying != null) { call.reject("Another purchase is still open.", "FAILED"); return; }
        details(Collections.singletonList(id), products -> {
            if (products.isEmpty()) { call.reject("This isn't available from Google Play yet.", "UNAVAILABLE"); return; }
            BillingFlowParams flow = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(Collections.singletonList(
                            BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(products.get(0)).build()))
                    .build();
            getActivity().runOnUiThread(() -> {
                buying = call;
                BillingResult opened = billing.launchBillingFlow(getActivity(), flow);
                if (opened.getResponseCode() == BillingResponseCode.ITEM_ALREADY_OWNED) { buying = null; restore(call); }
                else if (opened.getResponseCode() != BillingResponseCode.OK) {
                    buying = null;
                    call.reject("Google Play couldn't open this purchase.", "FAILED");
                }
            });
        }, message -> call.reject(message, "FAILED"));
    }

    // Google Play's sheet closed, or a purchase finished somewhere else (a pending payment that
    // went through, a purchase on another device).
    @Override
    public void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        PluginCall call = buying;
        buying = null;
        int code = result.getResponseCode();
        if (code == BillingResponseCode.USER_CANCELED) {
            if (call != null) { JSObject r = new JSObject(); r.put("cancelled", true); call.resolve(r); }
            return;
        }
        if (code != BillingResponseCode.OK && code != BillingResponseCode.ITEM_ALREADY_OWNED) {
            if (call != null) call.reject("Google Play couldn't finish this purchase.", "FAILED");
            return;
        }
        final String wanted = call == null ? null : call.getString("id");
        boolean waiting = false; // is the product just asked for still waiting for its payment?
        if (purchases != null) {
            for (Purchase purchase : purchases) {
                if (purchase.getPurchaseState() == Purchase.PurchaseState.PENDING
                        && wanted != null && purchase.getProducts().contains(wanted)) waiting = true;
            }
        }
        final boolean stillWaiting = waiting;
        // Settle against everything Google Play holds, so the answer is the whole list.
        owned(purchases == null ? Collections.emptyList() : purchases, (owned, pending) -> {
            if (call == null) return;
            if (owned.contains(wanted)) call.resolve(answer(owned, pending));
            else if (stillWaiting) { JSObject r = new JSObject(); r.put("pending", true); call.resolve(r); }
            else call.reject("Google Play couldn't verify this purchase.", "UNVERIFIED");
        }, message -> { if (call != null) call.reject(message, "FAILED"); });
    }
}
