# Bible Story Pals · Amiguitos de la Biblia

A bilingual (English / Español) Bible story game for **pre-K and kindergarten** (ages 3–6).
Every page is read aloud, so kids don't need to read. Each story ends with a short mini-game
that practices early-learning skills. No one can lose; wrong taps just wiggle.

| # | Story | Mini-game | Skill |
|---|-------|-----------|-------|
| 1 | God Made the World · Dios Creó el Mundo | Tap sparkles to create sun, trees, animals… | Vocabulary (EN/ES words) |
| 2 | Noah's Big Boat · El Gran Barco de Noé | Tap the animals into the ark, two by two | Counting to 8 |
| 3 | Baby Moses · El Bebé Moisés | Steer the basket down the river, catch flowers | Fine motor, counting |
| 4 | David the Brave · David el Valiente | Pick five smooth stones | Counting to 5 |
| 5 | Jonah and the Big Fish · Jonás y el Gran Pez | "Pop the red bubble!" | Colors |
| 6 | Daniel and the Lions · Daniel y los Leones | Tap each lion to put it to sleep | Counting |
| 7 | Jesus Feeds Everyone · Jesús Alimenta a Todos | Put 5 loaves and 2 fish in the basket | Counting to 7 |
| 8 | Baby Jesus Is Born · Nace el Niño Jesús | Tap stars 1-2-3-4-5 to light the way | Number recognition |

Finishing a story earns a gold star on the home screen.

## What makes it kid-, parent-, and store-friendly

- **Three language modes:** English, Español, or **EN + ES**, which reads every page in both languages. That's great for bilingual homes and dual-language classrooms. On first launch it picks the device language.
- **Read-aloud narration** uses the device's built-in text-to-speech (`es-MX`/`es-US` preferred for Spanish), so there are no audio files and the whole app is **under 250 KB**.
- **Works offline** after the first visit (service worker). Installable as an app (PWA manifest + icons).
- **No ads, no purchases, no accounts, no tracking, no network calls.** Progress is stored only on the device. This makes COPPA / Google Play "Designed for Families" / Apple Kids Category review straightforward.
- **Grown-ups area** sits behind a 3-second press-and-hold gate. It has narration and sound toggles, the language setting, Bible references for each story, parent tips, and a star reset.
- Big touch targets, swipe between pages, honors "reduce motion", and works on phones (portrait and landscape), tablets, Chromebooks and desktops.
- All art is hand-built SVG in `js/art.js`, with no emoji or stock images, so there are no licensing questions. The font (Baloo 2) is OFL-licensed and bundled.

## Run it

```bash
npm start             # or: python3 -m http.server 8080
# open http://localhost:8080
```

It is plain HTML/CSS/JS ES modules with no build step. Any static host works.

## Test it

Every pull request runs this automatically (`.github/workflows/test.yml`). To run it yourself:

```bash
npm install && npx playwright install chromium   # first time only
npm test
```

`tests/play-through.mjs` opens every story, reads every page, plays every mini-game to the
reward screen, checks language switching and phone layouts, and fails on any console error.
Add `--shots <dir>` to save a screenshot of every screen.

## Publish it

**Web (fastest, free):** every push to `main` deploys to GitHub Pages through `.github/workflows/pages.yml`.
Turn it on once under **Settings → Pages → Source: GitHub Actions**. (Pages on a private repo needs a paid GitHub plan;
on a free plan, make the repo public or upload the folder to Netlify, Cloudflare Pages or Vercel.)
It must be served over HTTPS for offline/install to work.

**App Store and Google Play (where the downloads are):** wrap the same files with [Capacitor](https://capacitorjs.com):

```bash
npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "Bible Story Pals" com.yourname.biblestorypals --web-dir .
npx cap add android && npx cap add ios
npx cap sync && npx cap open android   # or: npx cap open ios
```

Before submitting:
- Lock orientation to landscape in the native projects if you prefer (the web version supports both).
- For best narration inside native apps, consider adding `@capacitor-community/text-to-speech`.
  It uses the same OS voices and is more reliable than the WebView's speech API on some Android devices.
- Google Play: target the **Designed for Families** program, ages 5 & under / 6–8, with content rating "Everyone".
- Apple: Kids Category, ages 5 & under. Privacy "nutrition label": **Data Not Collected**.

## Voices (ElevenLabs)

Narration plays recorded ElevenLabs clips from `audio/` when they exist, and the device's own voice for any line
that hasn't been recorded yet. Clips are named by a hash of their text, so editing a line just falls back to the
device voice until it is recorded again.

```bash
export ELEVENLABS_API_KEY=...                  # elevenlabs.io → Profile → API keys
node tools/voices.mjs --list-voices            # pick a warm storyteller voice for each language
export ELEVENLABS_VOICE_EN=<id> ELEVENLABS_VOICE_ES=<id>
node tools/voices.mjs --dry-run --budget 499   # what it would record, and the cost
node tools/voices.mjs --budget 499             # record (never spends more than the budget)
```

Then bump `VERSION` in `sw.js` and commit `audio/`. Running it again continues where it stopped and never pays for
a line twice. Lines are recorded in priority order: the whole Creation story first, then shared lines (praise and
counting), then the other stories.

| Model | Credits/character | First story (EN + ES) | All 8 stories |
|---|---|---|---|
| `eleven_flash_v2_5` (default) | 0.5 | ~500 | ~3,000 |
| `eleven_multilingual_v2` (`--model`) | 1 | ~1,000 | ~5,900 |

`npm run test:voices` checks the script against a fake ElevenLabs server, so it costs no credits.

## Donations

Set `DONATE_URL` in `js/config.js` to your Ko-fi, Buy Me a Coffee, PayPal.me or Stripe payment link. A bilingual
"Support" section with a **Donate** button then appears in the grown-ups area, behind the hold-to-open gate, so
children can't reach it. It stays hidden inside the native App Store / Google Play builds: Apple and Google don't
allow external donation links in apps (except registered nonprofits). Use in-app "tip" purchases there if you want
in-app support later.

## Getting downloads (App Store Optimization)

- **Title:** `Bible Story Pals: Kids Bible` / Spanish listing `Amiguitos de la Biblia: Biblia para niños`.
  Localize the store listing in **both** English and Spanish (US + Mexico + Latin America). Spanish-language
  kids' Bible apps have far less competition than English ones.
- **Keywords:** kids bible, bible stories for kids, preschool, toddler, bilingual, español, biblia para niños,
  historias bíblicas, Noah's ark, Christian games.
- **Screenshots:** use the reward screen, Noah's ark game and the EN + ES caption. Run `npm test -- --shots shots/`
  to capture them all.
- **Free with no ads** is the hook. Churches, Sunday schools, Christian preschools and homeschool co-ops share
  apps like this. A one-page flyer with a QR code to the web version is a cheap way to reach them.
- **Retention:** add a new story every few weeks (see roadmap) so families come back.

## Add a story

Stories are plain data in `js/stories.js`: pages with `{ en, es }` text, plus a scene made from art pieces
(`[art, x, y, scale, options, animation]` on a 1000×600 stage). Then pick one of three mini-game types:

- `collect`: tap items. Modes are `fly` (into a target), `reveal` (sparkle → new thing, says the word) and `transform` (e.g. lion → sleeping lion).
- `prompt`: "tap the ___" rounds (colors, numbers, shapes…).
- `steer`: drag to guide something and catch items.

Add the new file names to `sw.js` if you add files, and bump `VERSION` there whenever you ship changes.

## Roadmap ideas

- More stories: Adam & Eve's garden, Joseph's coat (colors), Jesus calms the storm, Zacchaeus, the Good Samaritan, the Lost Sheep (counting/hide-and-seek), Easter morning.
- Recorded human narration (EN + ES) as an optional upgrade over device voices.
- Sing-along songs ("This Little Light of Mine" / "Esta lucecita").
- Coloring pages generated from the same SVG art.
- Sticker book screen for collected stars.

## Project layout

```
index.html            app shell
css/style.css         all styles + animations
js/main.js            screens: home, story, game, reward, grown-ups
js/stories.js         the 8 stories (bilingual text, scenes, game configs)
js/games.js           mini-game engine (collect / prompt / steer)
js/art.js             SVG characters, animals, props, backgrounds
js/audio.js           narration (Web Speech) + synthesized sound effects (Web Audio)
js/i18n.js, store.js  UI words, settings & progress
sw.js, manifest.webmanifest, icons/   offline + install
tests/play-through.mjs                end-to-end test
tools/make-icons.mjs                  regenerates the app icons from the art
```
