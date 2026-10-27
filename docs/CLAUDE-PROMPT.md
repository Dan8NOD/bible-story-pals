# Paste this into Claude

You are continuing **Bible Story Pals** (`Dan8NOD/bible-story-pals`), a bilingual read-aloud Bible game for ages 3–6. Read `README.md`, `js/stories.js`, `js/games.js`, `js/art.js`, and `js/main.js` (`REFS` and the grown-ups screen) before you invent anything. The canon is `docs/CREATOR-CANON.md`. Follow it.

## Job

Add the next story from the canon list, starting with **Psalm 23 (the shepherd and the green pasture)** unless Dan has named a different one in this chat. One story, complete, not a scaffold.

Ship it the way the other eleven are shipped:

- A new object in the `ALL` array in `js/stories.js`: `id`, `color`, bilingual `title`, bilingual `lesson`, `cover`, `pages` with `{ en, es }` text and a scene of `[art, x, y, scale, opts, anim]` on a 1000×600 stage, and a `game` using an existing type (`collect`, `prompt`, `steer`, `memory`, or `seek`).
- A matching line in `REFS` in `js/main.js`. For this story: `Psalm 23 · Salmo 23`.
- Reuse art in `js/art.js`. Add a new piece only if nothing there can say the thing, and keep the same stroke and ink language.
- If `sw.js` caches a file list, bump `VERSION` when you ship.

## Theology that is already decided

- God, Jesus, and the Holy Spirit keep those names in English, and Dios, Jesús, and Espíritu Santo in Spanish. Do not rename them.
- The Father is light and a voice, never a drawn person. The Spirit is a dove. Baptism already does this. Match it.
- Tone is safety and love. Dan's line, Easter 2026: Christ's sacrifice is enough. No fear plot, no "you must do more or God is not finished," no hell, no end-times.
- Ages 3–6. One idea a page. Sentences a parent can read aloud in one breath. Wrong taps only wiggle. Nobody loses.
- David and the lions already show the rule for danger: it resolves without blood. Keep it that way.

## What his dream codex is allowed to contribute

His private dream archive (not in this repo; do not copy it) has a few motifs that match Scripture. Use the picture, never the dream diary:

- A soft warm glow around the sheep and the child. Protection, not magic.
- A hand that finds the one who was missing.
- Still water, green grass, a simple cup that is full. Thank-you, not lightning.
- The child is the sheep. They are kept. They are not the hero who saves the world.

Do not import: Sacred Name debates, the Quran, other religions' scriptures, Castaneda language, blood moons, private family scenes, sex, guns, or real names from his journal.

## Psalm 23, the shape of this story

Four or five pages. Suggested spine, rewrite the words so they sound like the other stories, in both languages:

1. A shepherd watches his sheep. God is like that shepherd.
2. Green grass. Still water. The sheep has what it needs.
3. A dark place, but the shepherd's light is there, so the sheep is not afraid.
4. A cup, full. Goodness follows the sheep home.
5. Lesson on the reward screen: God is my shepherd. I am safe with Him. / Dios es mi pastor. Con Él estoy seguro.

Mini-game: tap the path home (grass, water, cup, then the shepherd's hand). Counting to 4 is enough. Say the word in the child's language the way Creation says "Sun / Sol."

## Done when

- `npm test` passes, including the new story through the reward screen.
- Every new string exists in English and Spanish.
- The grown-ups list shows the passage.
- You did not redraw God as a man, did not add a jump-scare, and did not widen the game into theology class.
- You tell Dan, in a few lines, which passage you used and what the child does with their hands.

If he asks for the following story after this one, take them in this order: Mark 10:13–16 (let the children come), Easter morning with no crucifixion scene (Luke 24 or John 20), the Good Samaritan (Luke 10), Joseph's coat as a color game (Genesis 37, stop before it gets cruel), Zacchaeus (Luke 19).
