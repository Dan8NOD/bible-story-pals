# Creator canon for Torah Story Pals

Written 2026-11-13 for whoever adds stories (Claude or otherwise). This file is the brief.
The paste-ready prompt is `docs/CLAUDE-PROMPT.md`.

The game is public. Dan's dream journal is not. Do not copy dream files, names, or private scenes into this repo.

## What this game is

Read-aloud stories from the Hebrew Bible for ages 3–6, in English, Spanish and Hebrew.
No one loses. Wrong taps wiggle. No ads, accounts or tracking.
Stories are data in `js/stories.js`. Where each one comes from is in `REFS` inside `js/main.js`.
Art is hand-built SVG.

It grew out of Bible Story Pals and shares its engine. It is a separate app with its own rules.
Nothing from the New Testament belongs here, and the Bible Story Pals canon does not apply.

## What Dan decided on 2026-11-13

1. **The whole Hebrew Bible, not only the five books.** Torah, Prophets and Writings.
2. **Two worlds.** Torah Trail holds the stories from the five books. Kings and Prophets holds the rest, in the
   order the books come in the Hebrew Bible (Samuel, Kings, Jonah, Psalms, Ruth, Esther, Daniel).
3. **God's name is Hashem** in English and Spanish, and השם in Hebrew. Don't write "God", "Dios", "Lord" or
   "Adonai" in a line a child hears.
4. **Three languages:** English, Spanish and Hebrew. Every line needs all three.
5. **The app is called Torah Story Pals** · Amiguitos de la Torá · חברים לסיפורי התורה.

## What Claude chose that day, for Dan to keep or change

Dan did not rule on these. They are how the first build was written.

- **People keep their usual names** in English and Spanish: Noah, Moses, Noé, Moisés. Not Noach, Moshe.
  Spanish says Boaz and Mordejai, and uses *rezar* for "pray", the way Jewish families do.
- **Hashem is never drawn.** A voice from heaven is light pouring down (`heavenLight`).
- **No halos.** An angel has wings and a white robe.
- **No folded hands.** People who pray lift their hands or stand quietly. The family in the prayers stands with
  open hands.
- **Shabbat belongs in the stories.** Creation ends with the seventh day. The manna story gathers double on Friday.
- **Queen Esther's story never shows Hashem speaking**, because the book of Esther never names Him. She finds her
  courage; the grown-up can say where it came from.
- **Passages use the Hebrew Bible's chapter and verse numbers**, which differ from church Bibles in places
  (Psalm 4:9, not 4:8).
- **Hebrew speaks to "you" in the plural** (לחצו, מצאתם), so no line guesses whether a child is a boy or a girl.
  It is written without vowel points, except where one word could be read two ways (נָח, rested).
- **The first three stories are free:** Creation, Noah and Abraham, the first three stops on Torah Trail.

## What still needs a person

- **A native Hebrew speaker has not read the Hebrew.** Claude wrote it. It needs that read before the App Store.
- **The prayers are plain family prayers** ("Dear Hashem… Amen"), not the traditional ones. Modeh Ani, the bedtime
  Shema and the blessing over children would fit the same three slots, but saying them in an app is a question
  for someone who knows the practice. Ask Dan before changing them.
- **The app's Hebrew name** is a first try.

## Tone

- Safety and love. No fear plot, no punishment story, no end-times.
- Danger resolves without blood. The giant falls over asleep. The lions go to sleep. The sea opens.
- Slavery in Egypt is "the people had to work hard all day. They wanted to be free." No whips, no plagues on
  screen, no drowning army.
- Joseph's brothers "were not kind to him" and he "was taken far away". No pit.
- Esther's people "are in danger". No villain is named or drawn.
- Bravery is "Hashem is with me", not winning a fight.
- A soft warm glow around someone means they are kept safe. Protection, not magic.

## What stays out

- Anything from the New Testament.
- Debates about names, calendars or who is right.
- End-times fear, punishment stories, or anything a 4-year-old would lie awake over.
- Private family matters, real people's names, anything from the dream journal.

## Craft rules

- Short enough to be spoken. A page is one or two sentences, one idea.
- All three languages on every page, lesson, prompt and word.
- Spanish should sound like speech to a child, not a textbook.
- No new game engine. No new dependency. Plain ES modules.
- Do not make a child feel they failed. Wrong taps wiggle.
- Add the passage to `REFS`, add the story to a world in `WORLDS`, and run `npm run storekit`, or it is not done.
- `npm test` plays every story to the reward screen. New stories have to survive that.
- A line that is reworded loses its recorded voice. Keep a kept line's English and Spanish exactly as they are
  unless the wording has to change.
- Do not touch the ElevenLabs budget or `audio/` unless the task is narration.

## Stories that would fit next

Rebecca at the well (kindness to a stranger, counting jars). The Ten Commandments at Sinai. Joshua and the walls
of Jericho (counting to seven). Deborah under her palm tree. Hannah's prayer. Solomon asks for a wise heart.
Build one or two at a time.
