# Paste this into Claude

You are continuing **Torah Story Pals**, a read-aloud story game for ages 3–6 in English, Spanish and Hebrew. It
lives on the `feat/torah-version` branch of `Dan8NOD/bible-story-pals`. That branch is its own app: never merge it
into `main`, and never merge `main` into it. Read `CLAUDE.md`, `README.md`, `js/stories.js`, `js/games.js`,
`js/art.js`, and `js/main.js` (`REFS` and the grown-ups screen) before you invent anything. The canon is
`docs/CREATOR-CANON.md`. Follow it.

## Job

Add the next story Dan names in this chat. One story, complete, not a scaffold.

Ship it the way the other fifteen are shipped:

- A new object in the `ALL` array in `js/stories.js`: `id`, `color`, `title`, `lesson`, `cover`, `pages` with
  `{ en, es, he }` text and a scene of `[art, x, y, scale, opts, anim]` on a 1000×600 stage, and a `game` using an
  existing type (`collect`, `prompt`, `steer`, `memory`, or `seek`).
- Its id in one of the two worlds in `WORLDS`, in the Hebrew Bible's order.
- A matching line in `REFS` in `js/main.js`, in all three languages, with the Hebrew Bible's chapter numbers.
- Reuse art in `js/art.js`. Add a new piece only if nothing there can say the thing, and keep the same stroke and
  ink language.
- Run `npm run storekit`, bump `VERSION` in `sw.js`, and make `npm test` pass.

## Already decided

- God's name is Hashem in English and Spanish, and השם in Hebrew.
- Hashem is never drawn. A voice from heaven is light pouring down.
- No halos, no folded hands, nothing from the New Testament.
- Tone is safety and love. Danger resolves without blood. No fear plot, no punishment story.
- Ages 3–6. One idea a page. Sentences a parent can read aloud in one breath. Wrong taps only wiggle.
- Hebrew speaks to "you" in the plural and is written without vowel points.

## Say so plainly

The Hebrew in this game has not been read by a native speaker. If you write more of it, tell Dan it needs that
read too. Don't call it finished.
