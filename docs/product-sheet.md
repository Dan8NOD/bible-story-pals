# Product sheet: Bible Story Pals (proposal for Dan, 2026-11-26)

**Nothing here has been created or changed in any store.** This is the sheet to say yes or no to. The code on the
branch `weekend/free-to-play-shop` already matches it; the prices a family sees always come from the store itself.

## The offer

- The app is **free to download** on both stores.
- **Free for everyone:** 3 stories (God Made the World, Noah's Big Boat, Baby Moses) and 2 voice-guided prayers
  (Thank You, God and Goodnight, God).
- **To buy, once each, no subscriptions:** four products, every one between $2 and $10.

| Product id | Name (EN / ES) | What it opens | USD | Stores |
|---|---|---|---|---|
| `com.dancruz.biblestorypals.world.sea` | All of Friendship Sea / Todo el Mar de la Amistad | The 3 Friendship Sea stories | **$2.99** | App Store, Google Play |
| `com.dancruz.biblestorypals.world.island` | All of Story Island / Toda la Isla de las Historias | The 9 paid Story Island stories | **$4.99** | App Store, Google Play |
| `com.dancruz.biblestorypals.prayer.blessing` | Prayer: God Bless the People I Love / Oración: Dios bendiga a quienes amo | The third voice-guided prayer | **$2.00** | App Store, Google Play |
| `com.dancruz.biblestorypals.bundle.everything` | Everything Pack / Paquete Completo | All 12 paid stories and the prayer | **$6.49** | App Store, Google Play |

Bought separately the three smaller products come to $9.98, so the Everything Pack saves $3.49. The game no longer
says "half price"; it says the pack costs less than buying separately, which stays true if a price moves.

All four ids already exist in App Store Connect (Drafts, issue #25). Product ids are permanent, so Google Play gets
the same ids, byte for byte. All four are **non-consumable / one-time products**.

## Descriptions

Google Play needs 50 to 200 characters. App Store Connect allows 55 at most, so it keeps its shorter lines.

| Product | Google Play description, English | Google Play description, Spanish | App Store Connect (55 max) |
|---|---|---|---|
| `world.sea` | Unlock all three Friendship Sea stories, read aloud in English and Spanish, each with its own mini-game. One-time purchase. | Desbloquea las tres historias del Mar de la Amistad, leídas en español e inglés, cada una con su minijuego. Compra única. | Unlocks All of Friendship Sea. One-time purchase. / Desbloquea Todo el Mar de la Amistad. Compra única. |
| `world.island` | Unlock the nine Story Island stories that are not free, read aloud in English and Spanish, each with its own mini-game. One-time purchase. | Desbloquea las nueve historias de la Isla de las Historias que no son gratis, leídas en español e inglés, cada una con su minijuego. Compra única. | Unlocks All of Story Island. One-time purchase. / Desbloquea Toda la Isla de las Historias. Compra única. |
| `prayer.blessing` | Unlock the voice-guided prayer God Bless the People I Love, for a family to say together in English or Spanish. One-time purchase. | Desbloquea la oración guiada Dios bendiga a quienes amo, para que la familia la diga junta en español o inglés. Compra única. | Unlocks the prayer God Bless the People I Love. / Desbloquea la oración Dios bendiga a quienes amo. |
| `bundle.everything` | Unlock every story in both worlds and every voice-guided prayer in Bible Story Pals, in English and Spanish. One-time purchase. | Desbloquea todas las historias de los dos mundos y todas las oraciones guiadas de Amiguitos de la Biblia, en español e inglés. Compra única. | Unlocks every story in every world and every prayer. / Desbloquea todos los cuentos y todas las oraciones. |

## What changes from today

| Product | Today | Proposed | Why |
|---|---|---|---|
| `world.sea` | $2.00 | $2.99 | Three stories. Keeps the pack clearly above the single prayer. |
| `world.island` | $2.00 | $4.99 | Nine stories. |
| `prayer.blessing` | $1.00 | $2.00 | $1.00 is under the $2 floor. |
| `bundle.everything` | $6.49 | $6.49 | Unchanged. |
| 12 single stories (`story.david`, `story.psalm23`, `story.jonah`, `story.daniel`, `story.nativity`, `story.baptism`, `story.storm`, `story.loaves`, `story.sheep`, `story.bigcatch`, `story.samaritan`, `story.zacchaeus`) | $1.00 each | **Not offered** | $1.00 is under the $2 floor, and $2 for one five-minute story is poor value next to the packs. |

About the 12 single-story products:

- They exist in App Store Connect as Drafts. **Leave them there and do not submit them.** Do not delete them: a
  deleted product id can never be used again.
- They are **not** created in Google Play.
- The game still honours them: if a TestFlight tester already owns one, that story stays open.
- To sell single stories again at $2.00 each, set `SELL_SINGLE_STORIES = true` in `js/unlocks.js`, price the 12 at
  $2.00 in App Store Connect and create the same 12 ids in Google Play. That is the only code change.

## What each store needs once Dan says yes

**App Store Connect** (products exist; three prices change):

1. `world.island` to $4.99, `world.sea` to $2.99, `prayer.blessing` to $2.00. `bundle.everything` stays $6.49.
2. Submit only these four with the app version. Leave the 12 single stories as Drafts.
3. The review screenshot of the unlock screen changes (no "This story" button now): take a new one from the new build.

**Google Play** (nothing exists yet):

1. Upload a build that carries the billing permission (any build from this branch) to internal testing. Play Console
   only lets products be created after that.
2. Link the payments profile if it is not linked (Dan's step: it involves bank and tax details).
3. Create the four one-time products above: same ids, the names and Play descriptions above, purchase option `buy`,
   USD price from the table, then Activate. Check that each is marked backwards compatible.
4. Copy the app's licensing key (Monetize with Play, Monetization setup, Licensing) into
   `android/app/play-licensing-key.txt` and build again. **Until that key is in the build, the Android app sells
   nothing and every story is open** (see docs/google-play.md).
5. Test buy on a real phone installed from Play with a licence-tester account: buy, relaunch, reinstall and restore.
