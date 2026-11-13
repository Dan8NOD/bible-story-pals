# Torah Story Pals · Amiguitos de la Torá · חברים לסיפורי התורה

A story game in **English, Español and עברית** for **pre-K and kindergarten** (ages 3–6), with stories from the
Torah, the Prophets and the Writings. Every page is read aloud, so kids don't need to read. Each story ends with a
short mini-game that practices early-learning skills. No one can lose; wrong taps just wiggle.

It is the sister app of [Bible Story Pals](https://github.com/Dan8NOD/bible-story-pals) and shares its engine.
This code lives on the `feat/torah-version` branch of that repo. **It must never be merged into `main`**: `main` is
Bible Story Pals and publishes that app's website.

**Torah Trail** (the five books of the Torah)

| # | Story | Passage | Mini-game | Skill |
|---|-------|---------|-----------|-------|
| 1 | Hashem Made the World | Genesis 1–2 | Tap sparkles to find the sun, trees, animals… | Vocabulary |
| 2 | Noah's Big Boat | Genesis 6–9 | Tap the animals into the ark, two by two | Counting to 8 |
| 3 | Abraham Counts the Stars | Genesis 12, 15 | Tap stars 1-2-3-4-5 | Number recognition |
| 4 | Joseph's Colorful Coat | Genesis 37, 41–45 | Memory match: red, blue and yellow coats | Memory, colors |
| 5 | Baby Moses | Exodus 2 | Steer the basket down the river, catch flowers | Fine motor, counting |
| 6 | Crossing the Sea | Exodus 14–15 | Tap the people to help them cross | Counting to 6 |
| 7 | Bread from Heaven | Exodus 16 | Fill six baskets with manna | Counting to 6 |

**Kings and Prophets** (the Prophets and the Writings, in the Hebrew Bible's order)

| # | Story | Passage | Mini-game | Skill |
|---|-------|---------|-----------|-------|
| 8 | Samuel Hears a Voice | 1 Samuel 3 | "Listen! Tap the moon." | Listening, vocabulary |
| 9 | David the Brave | 1 Samuel 17 | Pick five smooth stones | Counting to 5 |
| 10 | Elijah and the Ravens | 1 Kings 17 | Find the raven behind the bushes | Searching |
| 11 | Jonah and the Big Fish | Jonah 1–3 | "Pop the red bubble!" | Colors |
| 12 | Hashem Is My Shepherd | Psalm 23 | Tap the path home: grass, water, cup, the shepherd's hand | Order, counting to 4 |
| 13 | Ruth and Naomi | Ruth 1–2 | Gather grain into Ruth's basket | Counting to 6 |
| 14 | Queen Esther | Esther 2–8 | Find Queen Esther in the garden | Searching |
| 15 | Daniel and the Lions | Daniel 6 | Tap each lion to put it to sleep | Counting |

Each world has its own map and a tab above it. Finishing a story earns a gold star on the home screen.

## How this version speaks and draws

- **God's name is "Hashem"** in English and Spanish, and **השם** in Hebrew.
- **Hashem is never drawn.** A voice from heaven is shown as light pouring down.
- **No halos and no folded hands.** Angels have wings and a white robe. People who pray lift their hands or stand
  quietly. The prayers tab is an open prayer book.
- **Shabbat is part of the stories**: Creation ends on the seventh day, and the manna story gathers double on Friday.
- **Passages follow the Hebrew Bible's numbering** (the bedtime prayer's verse is Psalm 4:9, which church Bibles
  number 4:8).
- **People keep their usual English and Spanish names** (Noah, Moses, Noé, Moisés). Spanish uses *rezar* for "pray",
  and the names Boaz and Mordejai.
- **Hebrew speaks to "you" in the plural** (לחצו, מצאתם), so no line has to guess whether a child is a boy or a girl.
  It is written without vowel points.

The Hebrew text was written by Claude and **has not been checked by a native speaker yet**. Have one read it
before the app goes to the App Store.

### Voice-Guided Prayers · Oraciones guiadas · תפילות מודרכות

Three short prayers a family says together, opened from the **Voice-Guided Prayers** tab above the map. The voice
reads one line, then the screen shows **"Your turn!"** with a filling bar while everyone says it back, then moves on
by itself. Pause holds the current step, the arrows step through by hand, and Listen starts the line over. With
narration off, each line waits long enough for a grown-up to read it aloud.

| Prayer | Passage | App Store build |
|---|---|---|
| Thank You, Hashem · Gracias, Hashem · תודה, השם | Psalm 100:4 | Free |
| Goodnight, Hashem · Buenas noches, Hashem · לילה טוב, השם | Psalm 4:9 | Free |
| Hashem Bless the People I Love · Hashem bendiga a quienes amo · ברכה לאהובים שלנו (includes a pause to say the names of people you love) | Numbers 6:24 | $1, the price of one story |

The prayers are data in `js/prayers.js`. They don't earn stars, and on the website all three are open.

## What makes it kid-, parent-, and store-friendly

- **Three languages, one or two at a time.** The chips **English**, **Español** and **עברית** are switches. Turn on
  two and every page is shown and read in both. On first launch it picks the device language.
- **Hebrew reads right to left**, while the buttons stay where a child already knows them.
- **Read-aloud narration** plays recorded clips where a line has one, and the device's own voice for the rest.
- **Works offline** after the first visit (service worker). Installable as an app (PWA manifest + icons).
- **No ads, no accounts, no tracking, no network calls.** Progress is stored only on the device. The website is
  free. In the App Store build the first **3 stories are free**, then a grown-up can buy any story for **$1** or
  everything left in a world for **$2** (see below).
- **Grown-ups area** sits behind a 3-second press-and-hold gate. It has narration and sound toggles, the language
  switches, the passage for each story, parent tips, and a star reset.
- Big touch targets, swipe between pages, honors "reduce motion", and works on phones (portrait and landscape),
  tablets, Chromebooks and desktops.
- All art is hand-built SVG in `js/art.js`, with no emoji or stock images, so there are no licensing questions. The
  font (Baloo 2) is OFL-licensed and bundled. It has no Hebrew letters, so Hebrew uses the device's own font.

## Run it

```bash
npm start             # or: python3 -m http.server 8080
# open http://localhost:8080
```

It is plain HTML/CSS/JS ES modules with no build step. Any static host works.

## Test it

```bash
npm install && npx playwright install chromium   # first time only
npm test
```

`tests/play-through.mjs` opens every story, reads every page, plays every mini-game to the reward screen, checks
the language switches and phone layouts, and fails on any console error. Add `--shots <dir>` to save a screenshot
of every screen, and `--lang he` (or `es`, `en+he`…) to take them in another language.

## Publish it

**Web:** there is no website for this version yet. GitHub Pages publishes only `main`, which is Bible Story Pals.
The privacy policy inside the app names `dan8nod.github.io/torah-story-pals/privacy.html` (`POLICY_URL` in
`js/config.js`), so that page has to exist before a build goes to the App Store. The simplest way is to give this
version its own repository with Pages turned on.

**iOS (App Store / TestFlight):** the Capacitor project lives in `ios/` (bundle ID `com.dancruz.torahstorypals`,
iPad and iPhone, landscape only, version in Xcode's General tab). After changing the game:

```bash
npm install
npm run ios        # copies the game into www/ and syncs it into ios/
npm run ios:open   # opens Xcode: pick your team under Signing, Any iOS Device, Product → Archive
```

Inside the app, lines without a recorded clip are read by `@capacitor-community/text-to-speech` (the native iOS
voice) instead of the WebView's speech API, the Donate button stays hidden, and the service worker is off.
`ios/App/App/PrivacyInfo.xcprivacy` declares no tracking and no data collected. `npm run icons` redraws the app
icon and the launch image from the game art.

**Tester builds.** While `OPEN_FOR_TESTERS` in `js/config.js` is `true`, the app opens every story and prayer and
hides everything about buying, the way the website does. The grown-ups area says so. It is on today because the
in-app purchases don't exist in App Store Connect yet. Set it to `false` for the build that goes to the App Store.

**Unlocking stories (App Store build only).** The first three stops on Torah Trail are free: Creation, Noah and
Abraham. A locked story shows a padlock on the map and opens to a "Time to ask a grown-up!" screen offering that
story or everything left in its world. The grown-ups area sells the worlds too, and both screens can restore
purchases. Buying sits behind a times-table question written in words and answered on a keypad, the kind of
parental gate Apple's Kids Category asks for. `js/unlocks.js` holds the rules and `ios/App/App/UnlocksPlugin.swift`
talks to StoreKit 2. What a family owns comes from the App Store's signed transactions, so purchases survive a
reinstall, follow the family's Apple ID, and lock again after a refund. To try a purchase in the simulator without
App Store Connect, run from Xcode: the shared `App` scheme uses `ios/App/App/Unlocks.storekit`.

In App Store Connect: accept the Paid Apps agreement (Business), then under the app go to **Monetization → In-App
Purchases → +** and create these 15 **Non-Consumable** products. `npm run storekit -- --table` prints every
product with its English, Spanish and Hebrew display name, and `npm run storekit` rewrites `Unlocks.storekit`
after stories change.

| Product ID (`com.dancruz.torahstorypals.` + …) | Unlocks | Price |
|---|---|---|
| `world.torah` | Everything on Torah Trail (4 paid stories) | $2.00 |
| `world.prophets` | Everything in Kings and Prophets (8 stories) | $2.00 |
| `story.joseph`, `story.moses`, `story.redsea`, `story.manna` | One Torah Trail story | $1.00 |
| `story.samuel`, `story.david`, `story.elijah`, `story.jonah`, `story.psalm23`, `story.ruth`, `story.esther`, `story.daniel` | One Kings and Prophets story | $1.00 |
| `prayer.blessing` | The voice-guided prayer Hashem Bless the People I Love | $1.00 |

The game shows whatever price the App Store reports, so the buttons always match the tier you pick.

## Voices (ElevenLabs)

Narration plays recorded ElevenLabs clips from `audio/` when they exist, and the device's own voice for any line
that hasn't been recorded yet. Clips are named by a hash of their text, so editing a line just falls back to the
device voice until it is recorded again.

```bash
export ELEVENLABS_API_KEY=...                  # elevenlabs.io → Profile → API keys
node tools/voices.mjs --dry-run --budget 1000  # what it would record, and the cost (needs no key)
node tools/voices.mjs --budget 1000            # record (never spends more than the budget)
```

English and Spanish keep the voices already in `audio/manifest.json`, so those need no setting. Hebrew needs a
voice the first time (`node tools/voices.mjs --list-voices`, then `export ELEVENLABS_VOICE_HE=<id>`) and records
with Eleven v3, because Flash and Multilingual v2 don't speak Hebrew. `--langs he` records one language alone.
After removing or rewording stories, `node tools/voices.mjs --prune` deletes clips no line uses any more.

Then bump `VERSION` in `sw.js` and commit `audio/`. Running it again continues where it stopped and never pays for
a line twice. Lines are recorded in priority order: the whole Creation story first, then shared lines (praise and
counting), then the voice-guided prayers, then the other stories.

| What | Model | Credits/character | To finish every line |
|---|---|---|---|
| English + Spanish | `eleven_flash_v2_5` | 0.5 | about 5,000 (148 of 336 clips carried over from Bible Story Pals) |
| Hebrew | `eleven_v3` | 1 | about 5,300 (nothing recorded yet) |

`npm run test:voices` checks the script against a fake ElevenLabs server, so it costs no credits.

## Donations

Set `DONATE_URL` in `js/config.js` to your Ko-fi, Buy Me a Coffee, PayPal.me or Stripe payment link. A "Support"
section with a **Donate** button then appears in the grown-ups area, behind the hold-to-open gate, so children
can't reach it. It stays hidden inside the native App Store / Google Play builds: Apple and Google don't allow
external donation links in apps (except registered nonprofits).

## Add a story

Stories are plain data in `js/stories.js`: pages with `{ en, es, he }` text, plus a scene made from art pieces
(`[art, x, y, scale, options, animation]` on a 1000×600 stage). Then pick a mini-game type:

- `collect`: tap items. Modes are `fly` (into a target), `reveal` (sparkle → new thing, says the word) and
  `transform` (e.g. empty basket → full basket).
- `prompt`: "tap the ___" rounds (colors, numbers, listening…).
- `steer`: drag to guide something and catch items.
- `memory`: flip cards to find pairs.
- `seek`: find who is hiding behind the bushes.

Add the story's id to a world in `WORLDS`, its passage to `REFS` in `js/main.js`, and run `npm run storekit`.
Bump `VERSION` in `sw.js` whenever you ship changes. `docs/CREATOR-CANON.md` is the brief for what belongs here.

## Roadmap ideas

- A native speaker's pass over the Hebrew, and a rounded Hebrew font to match Baloo 2.
- Hebrew that mirrors the whole screen (arrows and all), not just the words.
- More stories: Rebecca at the well, the Ten Commandments, Joshua and Jericho, Deborah, Hannah, Solomon's wish.
- Holiday ribbons on the map (Purim on Queen Esther, Passover on Crossing the Sea, Shavuot on Ruth).
- Traditional prayers as a choice: Modeh Ani, the bedtime Shema, the blessing over children.

## Project layout

```
index.html            app shell
css/style.css         all styles + animations
js/main.js            screens: home, story, game, reward, prayers, grown-ups
js/stories.js         the 15 stories and the two worlds (text in three languages, scenes, game configs)
js/prayers.js         the 3 voice-guided prayers (lines, echo steps, scenes)
js/games.js           mini-game engine (collect / prompt / steer / memory / seek)
js/art.js             SVG characters, animals, props, backgrounds
js/audio.js           narration (recorded clips, then the device voice) + synthesized sound effects
js/i18n.js, store.js  UI words, languages, settings & progress
js/unlocks.js         App Store build: 3 free stories, then $1 a story or $2 a world; 2 free prayers, then $1 a prayer
ios/                  Capacitor iOS app (UnlocksPlugin.swift sells stories and worlds)
tools/                voices.mjs (ElevenLabs), make-icons.mjs, make-storekit.mjs, stage-www.mjs
tests/                play-through, regressions, voices, native, unlocks, prayers
```
