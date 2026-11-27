package com.dancruz.biblestorypals;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // The shop is switched on by the Play licensing key (android/app/build.gradle). A build
        // without the key can't verify a purchase, so it has no Unlocks plugin: nothing is
        // locked and nothing is sold. The game checks for the plugin (js/unlocks.js).
        if (!BuildConfig.PLAY_LICENSING_KEY.isEmpty()) registerPlugin(UnlocksPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
