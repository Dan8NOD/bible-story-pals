# Creator canon for Bible Story Pals

Written 2026-10-27 for whoever adds stories (Claude or otherwise).
This file is the brief. The paste-ready prompt is `docs/CLAUDE-PROMPT.md`.

The game is public. Dan's dream journal is not. Do not copy dream files, names, or private scenes into this repo.

## What this game already is

Bilingual (English / Español) read-aloud Bible stories for ages 3–6.
No one loses. Wrong taps wiggle. No ads, accounts, tracking, or purchases.
Stories are data in `js/stories.js`. Bible passages for grown-ups live in `REFS` inside `js/main.js`.
Art is hand-built SVG. The Father is drawn as light from heaven, never as a person.
The Spirit is a dove. That is already how Matthew 3:16–17 is staged. Keep it.

Code order in `js/stories.js` (the README table is close but not the same order):

| id | Story | Lesson the child hears | Passage in the grown-ups screen |
|---|---|---|---|
| creation | God Made the World | God made everything, and He made you too. | Genesis 1–2 |
| noah | Noah's Big Boat | God keeps His promises. | Genesis 6–9 |
| moses | Baby Moses | God takes care of us. | Exodus 2 |
| david | David the Brave | With God's help, you can be brave too. | 1 Samuel 17 |
| jonah | Jonah and the Big Fish | God hears us when we pray. | Jonah 1–3 |
| daniel | Daniel and the Lions | God is always with us. | Daniel 6 |
| loaves | Jesus Feeds Everyone | Jesus cares for us, and we can share too. | John 6:1–14 |
| nativity | Baby Jesus Is Born | (keep the existing lesson line) | Luke 2:1–20 |
| baptism | Jesus Is Baptized | God the Father, Jesus the Son, and the Holy Spirit love you. | Matthew 3:13–17 |
| storm | Jesus Calms the Storm | When we are scared, Jesus is with us. | Mark 4:35–41 |
| sheep | The Lost Sheep | Jesus is our Good Shepherd. He always looks for you. | Luke 15:3–7 |

Roadmap already named in the README, still unbuilt: Adam and Eve's garden, Joseph's coat (colors), Zacchaeus, the Good Samaritan, Easter morning.

## What Dan has actually said about these passages

These are settled lines from his own study and talks. They outrank mood, trend, and any agent's theology.

1. **Jesus' sacrifice is enough.** On Easter 2026 he studied the red-heifer claims and then said, in his own words, that he really feels Christ's sacrifice was enough. Do not build a "something else still has to be sacrificed" plot. Do not teach fear of not being enough.
2. **Tell the cross gently, and not yet as gore.** Ages 3–6. Easter morning can be the empty tomb, sadness that turns to joy, "Jesus is alive." No nails, blood, or beating on screen. A grown-ups note may say in one sentence that Jesus died and God raised Him.
3. **The Father is a voice and a light, not a body.** He spent time on the baptism scene for this reason. An unseen voice that teaches (a motif he trusts) matches "This is my Son, whom I love." Do not add a bearded man in the sky.
4. **Names stay as they are unless Dan says otherwise in a later message.** He has *studied* Sacred Name arguments (Yahusha / Yahuwah and related claims). He has not told this game to rename God or Jesus. The shipped copy says God, Jesus, Holy Spirit / Dios, Jesús, Espíritu Santo. Leave it. Do not "correct" the names.
5. **He reads as a gentile who wanted the good news said simply.** An Easter request was an easy letter, not a seminary paper. Kid copy stays shorter than this document. One idea per page. Read-aloud sentences.
6. **Image and choice, said softly.** A June 2026 dream had a waiting room where people realized they were made in the image, and that being with the Father was a choice. Kid version is already in Creation: "God made people. It is very good. He made you too." Do not add a rejection sermon.

## What stays out of the children's game

He has also talked through, and dreamed about, things that are for him, not for a 4-year-old:

- Sacred Name debates, Hebrew-roots arguments, the red heifer, and any "which name is the real one" lesson.
- A dream that told him to read the Quran, and later reading across Bible, Torah, and other books. No second scripture enters this app.
- End-times fear, blood moons, "who gets cleaned off the earth," hell, or punishment stories.
- Castaneda / nagual practice language, doubles, eagles, impeccability drills.
- Private family conflict, exes, anything sexual, weapons play, or real people's names from the dream journal.

If a motif only works by importing that material, drop the motif.

## Dream codex, the part that may touch a Bible story

Source: private repo `Dan8NOD/brush-bird-lake-orchid`, folder `dream-codex/` (172 tagged dreams as of the pattern file). Do not vendor those files here.

Patterns that rhyme with passages already in this game:

| His motif | Where it shows up | Passage it can serve | How it may look on screen |
|---|---|---|---|
| A warm circle big enough for the family, gratitude that they are together | Protection wing, Christmas 2025 | Psalm 91 sense of being covered; also the shepherd who keeps the flock | A soft glow around the child and the sheep. Not a magic shield, not a weapon. |
| A father goes down into the dark and finds his son's hand | Dec 24, 2025 | Luke 15, the one who is lost; the Father who does not abandon | The shepherd's hand finding the sheep. No hole, no drowning. |
| Gratitude, waking before he could finish "gratitude to God" | Nov 2025 | Psalm 100, give thanks; pairs with Jonah's "God hears us" | A thank-you the child can tap. One short line. |
| Gold light and a cup that fills an empty chest after prayer | 2026 vision he called one of his strongest | Psalm 23:5 the cup overflows; Jonah's prayer in the dark | Warm gold light, a simple cup, a heart that fills. No lightning. |
| A voice that teaches and is not attached to a body | 2026 | Matthew 3:17 | Already built as heaven-light plus words. Do not "improve" it into a face. |
| Two quiet figures in white, looking up, more interested in heaven than in being heroes | 2026 | Luke 24:4 and John 20, the Easter morning messengers | Friendly, still, white. They point to the empty tomb. They do not fight. |
| Storm outside, the place you are in holds | Jun 23, 2026 | Mark 4:35–41, already shipped | Do not restage the storm story. If you echo it, the lesson stays "Jesus is with us," not "be tough." |
| Humility. Being a guest. The shepherd, not the owner of the building | Sep 21, 2026 talk, Psalm 23. This night is in his conversation memory; it is not a numbered file in the codex (the log goes N53, then N57). | Psalm 23, Luke 15 | Green pasture, still water, "I will not be afraid." The child is the sheep, not the hero. |

Dominant clusters in the codex, for tone only: protection of family (34), threat that dissolves instead of a fight (27), teachers in white (16). That is why David picks up stones and the giant falls over asleep, and why the lions go to sleep. Keep consequences non-graphic. Bravery is "God is with me," not winning a fight.

## Next stories, in the order that matches him

Build at most one or two at a time. Each one needs `{ en, es }` on every string, a `REFS` line, a scene on the 1000×600 stage, and a mini-game that already exists (`collect`, `prompt`, `steer`, `memory`, `seek`). Then bump `VERSION` in `sw.js` if you ship.

1. **Psalm 23 / green pasture** as its own short story, or a second page-set beside the lost sheep. Lesson: God is my shepherd. I have what I need. I am not afraid. Skill: follow the path, tap the still water, the grass, the cup. The glow around the sheep may be warm, even orange-gold. Do not explain the color.
2. **Let the little children come** (Mark 10:13–16). Lesson: Jesus wants the children close. Skill: bring each child to Jesus. This matches the family-protection thread better than another battle story.
3. **Easter morning** (Luke 24:1–12 or John 20:1–18, grown-ups can cite either). Lesson: Jesus is alive. Sadness turned into joy. Two figures in white, an empty tomb, a garden. No crucifixion scene. Memory match or a seek game (find the living Jesus in the garden, gently).
4. **Good Samaritan** (Luke 10:25–37). Lesson: we help the person who is hurt. No moral about who is "the other kind." Bandages, a donkey, an inn.
5. **Joseph's coat** (Genesis 37, the coat only). Lesson: God is with Joseph even when the coat is gone. Color-tap game. Stop before the pit gets scary; the grown-ups note can say brothers were unkind and God stayed with Joseph.
6. **Zacchaeus** (Luke 19:1–10). Lesson: Jesus sees you even if you are small. Climb, then come down. Pairs with "He always looks for you."

Adam and Eve's garden can wait. If it is built, it is "God walked with them in the garden" and "we can say sorry," not the curse, the serpent as a horror, or nakedness.

## Craft rules already true in this repo

- Short enough to be spoken. A page is one or two sentences.
- Both languages on every page, lesson, prompt, and word.
- Spanish should sound like speech to a child in a bilingual US home, not a textbook.
- No new game engine. No new dependency. Plain ES modules.
- Do not draw the Father as a person.
- Do not make a child feel they failed. Wrong taps wiggle.
- Add the passage to `REFS` or it is not done.
- `npm test` plays every story to the reward screen. New stories have to survive that.
- Do not touch the ElevenLabs budget or `audio/` unless the task is narration.
