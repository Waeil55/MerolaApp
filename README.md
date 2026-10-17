# Genius Kids Academy

A learning app for kids from Kindergarten to Grade 6: Reading, Math and Science, 20 levels per subject for every grade (420 levels in all), plus Understand, a 50-level reading comprehension path,
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

## Understand: learning to understand what you read

Many children can read the words but cannot answer questions about a story. Usually they do not know what the question is asking for, or where to find the answer. Understand is a separate 50-level path, the same for every grade, that teaches both.

| Stage | Levels | What the child does |
|---|---|---|
| Words | 1-10 | Picture and word meaning, then sorting words into WHO, WHAT, WHERE and WHEN |
| Sentences | 11-20 | One sentence, one question, one question type per level: picture match, who, what, where, when, how many, true or false, why |
| Mini stories | 21-30 | Two or three sentences: order of events, feelings, reasons, he/she/it/they, word clues, main idea |
| Paragraphs | 31-40 | Four to six sentences: looking back, time order, cause and effect, characters, titles, word meaning, clues, comparing, facts |
| Long stories | 41-50 | Stories and articles in four or five parts with eight questions: a fable, a diary, a mystery, two articles, and a final story |

How it teaches:

- **Question words first.** A tip card teaches each new question type with an example, and every question carries a coloured chip (WHO, WHERE, WHY...) that says what kind of answer to look for.
- **Look back.** The text stays on screen. In Read together mode, Show me where lights up the sentence that holds the answer and marks the key words. After a wrong answer the sentence turns yellow so the child sees where the answer was; after a right answer it turns green.
- **Two modes per level.** Read together gives tips, pictures and, for long stories, one part at a time with the questions for that part right after it. Show what you know has no hints and, from stage 4, folds the text away behind a Look back button. The level passes at the pass mark across both modes, and the first answer counts.
- **Find my level.** Up to ten quick questions, two per stage, stop at the first miss and open every level below the starting point. Placed levels earn no stars and no chests.
- **Everywhere.** Reading story questions and Science lesson questions now use the same Look back cards, with the answer sentence found automatically.

The content lives in `content/understand-1.js` to `understand-3.js`. Each question names the words that hold its answer (`e`), and `node tools/check-understand.js` checks every level, option list and evidence sentence.

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

The folder is a complete static site. `.github/workflows/deploy-pages.yml` publishes it to GitHub Pages on every push to `main`; the one-time setup is Settings > Pages > Build and deployment > Source: GitHub Actions, then re-run the workflow from the Actions tab. The app then lives at https://waeil55.github.io/MerolaApp/ and can be installed from a phone. It also runs on Netlify, Vercel or any web server. The `.nojekyll` file keeps Pages from touching the files.

## Files

- `index.html` the app shell. `styles.css` the design (light and dark).
- `content/reading-<grade>.js`, `content/science-<grade>.js`, `content/math-<grade>.js` hold the 20 levels per grade (`reading.js`, `math.js`, `science.js` are Grade 3). `content/extra-reading-<grade>.js` and `content/extra-science-<grade>.js` add ten more words, a second story, four more questions and a longer lesson to every level; `content/pictures.js` maps words to picture emoji. `content/math-lib.js` holds the math problem generators. Edit these to change words, stories, lessons or questions.
- `js/rewards.js` hearts, gems, quests, badges, chests, shop and leaderboard.
- `js/understand.js` the comprehension engine: sentence splitting, evidence finding, decks for the five stages, placement, and look-back cards for stories and lessons.
- `js/engine.js` builds decks and applies the star and review rules. `js/session.js` plays the cards. `js/views.js` the screens.
- `js/speech.js` text to speech, speech recognition and sound effects. `js/util.js` forgiving speech matching.
- `js/store.js` progress in the browser's local storage.

## Adding words

My Words: type a word, say it into the mic, or paste a list. Those words can be practiced in all four modes and show their own star rating.
