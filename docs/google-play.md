# Google Play: Bible Story Pals 1.0 for Android (draft for Dan to check)

How to sign, build and upload the Android app, and what to answer in Play Console. This repo is public, so the upload key, its password and testers' email addresses stay out of it.

## What the build is

| | |
|---|---|
| Package | `com.dancruz.biblestorypals`, the same as the iOS bundle ID. It is permanent once the app exists in Play Console. |
| Version | 1.0.0, versionCode 2 (`android/app/build.gradle`). versionCode 1 was the first build, with no billing. |
| Android versions | Runs on Android 7.0 (API 24) and up. Targets Android 16 (API 36), which Google Play has required for new apps since August 31, 2026. |
| Screen | Landscape only |
| Permissions | Internet (Capacitor's web view declares it; the game makes no network requests), Google Play Billing (`com.android.vending.BILLING`) and network state (`ACCESS_NETWORK_STATE`, which the build's merged manifest also carries). |
| Native libraries | None, so Google's 16 KB page-size rule has nothing to check. |
| Purchases | The four one-time products of [product-sheet.md](product-sheet.md), through Google Play Billing 8.3.0, **only when the build has the Play licensing key** (see "The shop switch" below). A build without the key sells nothing and every story and prayer is open. |
| Size | About 12 MB as a bundle |

## Decide before the first production release

| Decision | Why it matters | Suggested |
|---|---|---|
| **Free or paid** | Google Play lets a paid app become free, but an app that has been offered free can never be made paid. | Create it as **Free**, like the App Store build. Charging later then means in-app purchases, not an upfront price. |
| **Which build goes to production** | A build without the Play licensing key gives Android families everything free. `npm run android:bundle` prints `SHOP ON` or `SHOP OFF`. | Send only a `SHOP ON` build to production, and only after a test purchase on a real phone has passed. `SHOP OFF` builds are for internal testing and for the first upload that lets products be created. |
| **App or game** | The manifest marks the app as a game (`android:appCategory="game"`): on tablets, Android 16 lets only games stay locked to landscape. | Game, category Educational |

## The shop switch

Google signs every purchase with the app's licensing key. The app checks that signature on the phone, so it needs
the public half of that key, which only exists once the app has been created in Play Console.

1. Upload any build from this repo to internal testing. It carries the billing permission, which Play Console
   needs before it lets you create products.
2. Create the four products from [product-sheet.md](product-sheet.md) (after Dan has said yes to the sheet).
3. In Play Console open **Monetize with Play → Monetization setup → Licensing** and copy the key. It is a public
   key, so it may be committed.
4. Paste it into `android/app/play-licensing-key.txt` (one line), or set the environment variable
   `BSP_PLAY_LICENSING_KEY`. Raise `versionCode` and build again: the command now prints `SHOP ON`.

What the Android shop does, and where:

| Google Play rule | How the app keeps it |
|---|---|
| Verify the purchase | `PlayReceipts.java` checks Google's signature with the licensing key, the package name and the signed purchase state. Anything that fails opens nothing and is not acknowledged. |
| Pending is not paid | A cash or pay-later purchase opens nothing. The screen says Google Play is still waiting, and the story opens by itself when the payment goes through. |
| Grant, then acknowledge | What the family owns is written to the device first; only then is the purchase acknowledged. Google refunds a purchase nobody acknowledges within 3 days. |
| Restore | What the family owns is read from Google Play at every launch, on every return to the app and on "Restore purchases", so it survives a reinstall. A purchase that finished while the app was closed is picked up and acknowledged at the next launch. A refund locks the story again. |

`npm test` checks these rules in the source, and `./gradlew :app:testDebugUnitTest` (in `android/`) runs the
signature check against keys made for the test.

**Not done yet, and it can only be done with Play Console and a phone:** a real test purchase. Install from Play
(not from a cable) with a licence-tester account, buy one product with the test card, relaunch, then uninstall,
reinstall and restore. Also buy with the "slow test card" to see a pending payment stay locked.

## One time: make the upload key

Dan does this himself. The key and its password never go into this repo or into a chat.

`keytool` comes with the JDK. If the command is not found, run it from the JDK's `bin` folder. It asks for a password and a name.

```bash
mkdir -p ~/.bible-story-pals
```

```bash
keytool -genkeypair -v -keystore ~/.bible-story-pals/upload-key.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Then create `~/.bible-story-pals/keystore.properties` (on Windows, `%USERPROFILE%\.bible-story-pals\keystore.properties`) with three lines:

```
storeFile=upload-key.jks
storePassword=<the password you gave keytool>
keyAlias=upload
```

- A bare file name in `storeFile` means the key sits next to the properties file. A full path works too; write it with forward slashes.
- To keep the two files somewhere else, set the environment variable `BSP_KEYSTORE_PROPERTIES` to the full path of the properties file.
- Keep a copy of both files somewhere safe that is not this repo. With Play App Signing, Google holds the real signing key and this key only proves that an upload is yours, so a lost or leaked upload key can be replaced through Play Console.

## Build the bundle

Needs JDK 21 and the Android SDK. Android Studio installs both. (Capacitor 8 asks for Java 21; JDK 17 will not build it.)

```bash
npm install
```

```bash
npm run android:bundle
```

The command copies the game into `android/`, builds `android/app/build/outputs/bundle/release/app-release.aab`, and ends by saying the version, whether the bundle is signed, and whether the shop is on. Without the properties file the bundle still builds, unsigned, and the command says so: Google Play refuses an unsigned bundle.

Google Play takes each versionCode once. Before every later upload, raise `versionCode` in `android/app/build.gradle`.

## Play Console: first upload

1. **Create app.** Name `Bilingual Bible Story Pals`, default language English (United States), Game, Free.
2. **Testing → Internal testing → Create new release.** Keep Play App Signing on (Google makes and holds the signing key). Upload `app-release.aab`. Release name `1.0.0 (1)`.
3. **Testers.** Make an email list, add the testers, and send them the opt-in link. Each tester opens the link on an Android device and installs from Google Play.
4. **Before production.** A personal developer account created after November 13, 2023 must first run a closed test with at least 12 testers opted in for 14 days in a row. Organization accounts skip this.

## App content forms

| Form | Answer |
|---|---|
| Privacy policy | https://dan8nod.github.io/bible-story-pals/privacy.html |
| Ads | No ads |
| App access | All functionality is available without special access (no sign-in) |
| Content rating | Answer None or No throughout; expect **Everyone**. Read the two judgment calls in `docs/app-store-listing.md` first (David the Brave, The Good Samaritan). |
| Target audience | Ages 5 and under, and 6–8. This puts the app under the Families policy, which it meets: no ads, no accounts, no data. |
| Data safety | No data collected and none shared by the app itself. Purchases are handled by Google Play; check the form's own guidance on Google Play Billing before answering, since the build now includes Google's billing library. There is no advertising ID permission, and the plugins are text-to-speech, Capacitor's App plugin and the app's own Unlocks plugin. |
| Advertising ID | No |
| News, health, financial features, government | No |

The privacy page on `main` says there are no in-app purchases. PR #17 rewrites that page around App Store purchases at the old prices. Before a `SHOP ON` build goes to any Play track that needs a listing, the page must also describe Google Play purchases. The wording is ready in the app (grown-ups area, `POLICY` in `js/main.js`, the lines marked `play`).

## Store listing

Needed before closed testing and production, not for internal testing.

| Field (limit) | English (United States) | Spanish (Latin America) |
|---|---|---|
| App name (30) | `Bilingual Bible Story Pals` (26) | `Amiguitos de la Biblia` (22) |
| Short description (80) | `Fifteen Bible stories read aloud in English, Spanish or both, for ages 3 to 6.` (78) | `Quince historias bíblicas en voz alta en español, inglés o ambos. De 3 a 6 años.` (80) |

**Full description (4000).** Use the App Store description from `docs/app-store-listing.md` as PR #17 has it, with its two purchase sections ("The first 3 stories are free" and "Share with the ones you love") replaced by this one. Apple's Family Sharing paragraph never applies on Google Play.

```
FREE TO START
God Made the World, Noah's Big Boat and Baby Moses are free, and so are two guided prayers. A grown-up can unlock all of Story Island, all of Friendship Sea, or everything at once with a one-time in-app purchase. There are no subscriptions and no ads. Purchases sit behind a question for grown-ups and can be restored at any time.
```

```
GRATIS PARA EMPEZAR
Dios Creó el Mundo, El Gran Barco de Noé y El Bebé Moisés son gratis, y también dos oraciones guiadas. Un adulto puede desbloquear toda la Isla de las Historias, todo el Mar de la Amistad, o todo de una vez con una compra única dentro de la app. Sin suscripciones y sin anuncios. Las compras están protegidas con una pregunta para adultos y se pueden restaurar en cualquier momento.
```

**Graphics, not made yet:**

| What | Size | Note |
|---|---|---|
| App icon | 512 × 512 PNG | `icons/icon-512.png` is the right size; check it against Play's icon rules. |
| Feature graphic | 1024 × 500 | |
| Phone screenshots | At least 2, landscape, 1920 × 1080 or larger | The iPhone 6.9" screenshots are wider than the 2:1 that Play allows, so they can't be reused as they are. |
| 7-inch and 10-inch tablet screenshots | Landscape, longest side up to 3840 | The iPad 13" screenshots (2752 × 2064) fit. |
