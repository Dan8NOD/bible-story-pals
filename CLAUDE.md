# Notes for Claude

Dan works on this repo with Claude on several machines: the MacBook Air, the iMac, and Claude.ai cloud sessions.
They can't see each other's chats, so **GitHub is the shared channel**. Anything another machine needs to know goes
on GitHub, not only in your chat.

## This branch is Torah Story Pals

`feat/torah-version` is a different app from `main`: Torah Story Pals (`com.dancruz.torahstorypals`), with stories
from the Hebrew Bible only, the name Hashem, and a third language, Hebrew.

- **Never merge this branch into `main`, and never merge `main` into it.** `main` is Bible Story Pals and publishes
  that app's website. A pull request for Torah work targets `feat/torah-version`.
- Start a session here with `git pull origin feat/torah-version`, not step 1 below.
- A fix to the shared engine (games, audio, purchases) that both apps need is made once on each branch.
- `docs/CREATOR-CANON.md` on this branch is the Torah brief. The Bible Story Pals brief does not apply here.
- `OPEN_FOR_TESTERS` in `js/config.js` is `true`: tester builds open every story and sell nothing. It goes to
  `false` only for the App Store build, after the in-app purchases exist in App Store Connect.
- The Hebrew has not been checked by a native speaker. Don't tell anyone it is ready for the App Store until it has.

## Start of every session

1. `git pull origin main`.
2. Read the open issues labeled **`claude-handoff`**, newest comments first. Also check the open PRs.
   - `gh issue list --label claude-handoff --state open`, then `gh issue view <n> --comments`
   - or `gh pr list`
   - or use the GitHub connector.
3. Tell Dan what's waiting and who is on it, then ask him before you pick something up.

## Working on a handoff issue

- **Claim it first.** Comment `Taking this — <machine>` (MacBook Air, iMac or cloud). If another machine claimed it,
  hasn't posted "done" or "stopping", and its last comment is under 2 hours old, don't start. Ask Dan first. This
  matters most for ElevenLabs, where two machines would pay for the same clips twice.
- **Post progress as comments:** what you did, what's left, and credits spent. Sign each one with the machine name.
  Keep the checklist in the issue body up to date.
- **Push work to a branch and open a PR** with `Closes #<issue>`. Put nothing on `main` directly.
- **When you stop,** finished or not, leave a comment saying where things stand and what the next machine should do.
- **Something for another machine?** Open an issue labeled `claude-handoff` that says which machine it's for and
  why: what to do, the exact commands, and how you'll know it's done.

## Never on GitHub

API keys, tokens, passwords, or anything from Dan's private dream archive. GitHub Pages publishes this whole repo,
so these notes are public too.

## Which machine can do what

- **ElevenLabs recording** (`tools/voices.mjs`): only a Mac whose terminal has `ELEVENLABS_API_KEY` set. Cloud
  sessions have no key and can't reach `api.elevenlabs.io`. Keep the voices in `audio/manifest.json`, and never use
  `--redo` unless Dan asks for new voices.
- **iOS builds and TestFlight** (`ios/`, `npm run ios`): only a Mac with Xcode.
- **Code, stories, tests and PRs:** any machine. `npm test` must pass before you push.
