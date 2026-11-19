# Google Play: Bible Story Pals 1.0 for Android (draft for Dan to check)

How to sign, build and upload the Android app, and what to answer in Play Console. This repo is public, so the upload key, its password and testers' email addresses stay out of it.

## What the build is

| | |
|---|---|
| Package | `com.dancruz.biblestorypals`, the same as the iOS bundle ID. It is permanent once the app exists in Play Console. |
| Version | 1.0.0, versionCode 1 (`android/app/build.gradle`) |
| Android versions | Runs on Android 7.0 (API 24) and up. Targets Android 16 (API 36), which Google Play has required for new apps since August 31, 2026. |
| Screen | Landscape only |
| Permissions | Internet only. Capacitor's web view declares it; the game makes no network requests. |
| Native libraries | None, so Google's 16 KB page-size rule has nothing to check. |
| Purchases | None. Every story and prayer is open, because the `Unlocks` plugin exists only on iOS. |
| Size | About 12 MB as a bundle |

## Decide before the first production release

| Decision | Why it matters | Suggested |
|---|---|---|
| **Free or paid** | Google Play lets a paid app become free, but an app that has been offered free can never be made paid. | Create it as **Free**, like the App Store build. Charging later then means in-app purchases, not an upfront price. |
| **When purchases come to Android** | The App Store build gives 3 stories free and sells the rest, up to the $6.49 Everything Pack. If this build goes to production as it is, Android families get everything free. Selling on Android means porting `UnlocksPlugin.swift` to Play Billing. | Use this open build for internal and closed testing, and decide before applying for production. |
| **App or game** | The manifest marks the app as a game (`android:appCategory="game"`): on tablets, Android 16 lets only games stay locked to landscape. | Game, category Educational |

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

Needs JDK 21 and the Android SDK. Android Studio installs both.

```bash
npm install
```

```bash
npm run android:bundle
```

The command copies the game into `android/`, builds `android/app/build/outputs/bundle/release/app-release.aab`, and ends by saying the version and whether the bundle is signed. Without the properties file the bundle still builds, unsigned, and the command says so: Google Play refuses an unsigned bundle.

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
| Data safety | No data collected and none shared. Checked in the release build: the only permission is Internet, there is no advertising ID permission, and the only plugins are text-to-speech and Capacitor's App plugin. |
| Advertising ID | No |
| News, health, financial features, government | No |

The privacy page on `main` says there are no in-app purchases, which is true for Android. PR #17 rewrites that page around App Store purchases. When it merges, the page needs a line saying that the Android app has no purchases, or the Play listing will point at a policy that describes the wrong store.

## Store listing

Needed before closed testing and production, not for internal testing.

| Field (limit) | English (United States) | Spanish (Latin America) |
|---|---|---|
| App name (30) | `Bilingual Bible Story Pals` (26) | `Amiguitos de la Biblia` (22) |
| Short description (80) | `Fifteen Bible stories read aloud in English, Spanish or both, for ages 3 to 6.` (78) | `Quince historias bíblicas en voz alta en español, inglés o ambos. De 3 a 6 años.` (80) |

**Full description (4000).** Use the App Store description from `docs/app-store-listing.md` as PR #17 has it, with its two purchase sections ("The first 3 stories are free" and "Share with the ones you love") replaced by this one:

```
EVERYTHING INCLUDED
All fifteen stories and three guided prayers are in the app. There is nothing to buy.
```

```
TODO INCLUIDO
Las quince historias y las tres oraciones guiadas vienen en la app. No hay nada que comprar.
```

If purchases come to Android, that section changes again. Apple's Family Sharing paragraph never applies on Google Play.

**Graphics, not made yet:**

| What | Size | Note |
|---|---|---|
| App icon | 512 × 512 PNG | `icons/icon-512.png` is the right size; check it against Play's icon rules. |
| Feature graphic | 1024 × 500 | |
| Phone screenshots | At least 2, landscape, 1920 × 1080 or larger | The iPhone 6.9" screenshots are wider than the 2:1 that Play allows, so they can't be reused as they are. |
| 7-inch and 10-inch tablet screenshots | Landscape, longest side up to 3840 | The iPad 13" screenshots (2752 × 2064) fit. |
