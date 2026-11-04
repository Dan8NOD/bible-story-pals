# Notes for Claude

Dan works on this repo with Claude on several machines: the MacBook Air, the iMac, and Claude.ai cloud sessions.
They can't see each other's chats, so **GitHub is the shared channel**. Anything another machine needs to know goes
on GitHub, not only in your chat.

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
