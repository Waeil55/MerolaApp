# Genius Kids Academy

A learning app for kids from Kindergarten to Grade 6: Reading, Math and Science, 20 levels per subject for every grade (420 levels in all),
with four ways to practice every word (I Read, I Speak, I Listen, I Write) plus two stories per level, lessons with ten questions and twenty fresh math problems per run.
Every lesson mixes exercise types: flash cards with pictures, picture match, fill in the blank, match the pairs, unscramble, dictation, sentence building, letter tracing and read-aloud.
Rewards like Duolingo: hearts, gems, daily quests, badges, treasure chests on the path, a weekly leaderboard between the kids on the device and a streak freeze. Each kid gets a profile with a name,
avatar and grade, and their own progress. Duolingo-style path and lessons, no account, no API key, no cost. Works offline after the first load.

## Run it

**Easiest (Windows):** double-click `Start-App.cmd`. It starts a tiny local server with Node and opens http://localhost:8077.

**Any computer with Node:**

```
node serve.js
```

then open http://localhost:8077 in Chrome, Edge or Safari.

**No Node?** Open `index.html` directly in Chrome. Everything works; the browser may ask for the microphone each time.

**Put it online:** upload this whole folder to any static host (GitHub Pages, Netlify, Vercel, a school server). It is plain HTML, CSS and JavaScript.

## Browsers and the microphone

- Text to speech (the app reading aloud) works in every modern browser.
- Speech recognition (I Speak, Say it, Answer by voice) works in Chrome, Edge and Safari. Chrome sends audio to Google's speech service, so it needs the internet.
- Firefox has no speech recognition. The app notices and switches I Speak to a grown-up check: the child says the word, the parent taps "Said it right" or "Not yet".

## The rules the app enforces

- **Unlocking:** every mode of a level must be played once, and the average of the best scores must reach the pass mark (90% by default, parents can change it) before the next level opens.
- **Stars:** one star per card answered correctly on the first try. Level pass bonus: 10, 15 or 20 stars for 1, 2 or 3 stars.
- **Anti-cheat:** a word the child has already mastered in that mode (two correct answers) is a review card and earns no new stars. Replaying a level that is already passed is review too. Mistakes never cost stars, so the child can keep trying until it is right, but only the first try counts for accuracy.
- **Honest accuracy:** the first answer on each card decides the score; the child can still retry to learn.

## Kids and grades

The first screen asks who is learning. Add a kid with a name, avatar and grade (KG to G6). Tap the grade pill at the top of the path to
change grade at any time; progress is kept separately for each kid and each grade. Parents can rename, re-grade or remove kids on the Parents page.

## Parents page

PIN 1234 at first (change it in settings). Shows minutes per day, each subject's level, weakest mode, words to practice together,
and settings: pass mark, mic strictness, reading voice and speed, daily goals, sounds, theme, child's name and avatar.
Backup copies all progress as text; Restore pastes it back on another device.
Parents can also switch hearts off (unlimited tries) and choose how many math problems a lesson has.

## Rewards

- **Hearts:** five per kid. A wrong first answer costs one; they come back one every 15 minutes, or all at once after practicing a passed level or My Words, or for 30 gems.
- **Gems:** earned from daily quests (+5), new badges (+5) and treasure chests (+10). Spend them on a heart refill (30) or a streak freeze (40), which keeps the streak alive through one missed day.
- **Daily quests:** three a day (stars, lessons, perfect scores, speaking, spelling, stories, math, science, minutes). Claiming one gives 10 stars and 5 gems.
- **Treasure chests:** one after every unit of five levels on the path. It opens once the fifth level is passed: +25 stars, +10 gems.
- **Badges:** 18 of them, from First steps to Road done, shown on the profile screen (tap the avatar).
- **Leaderboard:** stars earned this week by every kid on the device.

## Install it as an app (PWA)

Serve the folder over http or https (not from a file) and the browser offers **Install app** (also on the profile and Parents pages). After the first visit the service worker keeps every file on the device, so the app opens and runs with no internet. `manifest.webmanifest` and `sw.js` hold the setup; run `node tools/build-sw.js` after adding files so the cache list and version stay current, and `node tools/make-icons.js` regenerates the icons.

## Deploy

The folder is a complete static site. `.github/workflows/deploy-pages.yml` publishes it to GitHub Pages on every push to `main`; the one-time setup is Settings > Pages > Source: GitHub Actions. The app then lives at https://waeil55.github.io/MerolaApp/ and can be installed from a phone. It also runs on Netlify, Vercel or any web server. The `.nojekyll` file keeps Pages from touching the files.

## Files

- `index.html` the app shell. `styles.css` the design (light and dark).
- `content/reading-<grade>.js`, `content/science-<grade>.js`, `content/math-<grade>.js` hold the 20 levels per grade (`reading.js`, `math.js`, `science.js` are Grade 3). `content/extra-reading-<grade>.js` and `content/extra-science-<grade>.js` add ten more words, a second story, four more questions and a longer lesson to every level; `content/pictures.js` maps words to picture emoji. `content/math-lib.js` holds the math problem generators. Edit these to change words, stories, lessons or questions.
- `js/rewards.js` hearts, gems, quests, badges, chests, shop and leaderboard.
- `js/engine.js` builds decks and applies the star and review rules. `js/session.js` plays the cards. `js/views.js` the screens.
- `js/speech.js` text to speech, speech recognition and sound effects. `js/util.js` forgiving speech matching.
- `js/store.js` progress in the browser's local storage.

## Adding words

My Words: type a word, say it into the mic, or paste a list. Those words can be practiced in all four modes and show their own star rating.
