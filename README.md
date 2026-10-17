# Genius Kids Academy

A learning app for kids from Kindergarten to Grade 6 with four subjects: Reading, Math, Science and Understand (reading comprehension).
Every grade has its own 50 levels in every subject, written for that grade: 7 grades x 4 subjects x 50 levels = 1,400 levels. A Kindergarten child learns letters and sounds; a Grade 3 child starts with syllable types and prefixes; a Grade 6 child works on Greek and Latin roots, ratios, cells and argument writing. The full list of levels is in [CURRICULUM.md](CURRICULUM.md).
There are four ways to practice every word (I Read, I Speak, I Listen, I Write) plus four stories per Reading level, two-part lessons with fourteen or more questions in Science, word problems and fresh math problems on every run.

In total the app holds about 10,600 words to study, 1,400 stories with 4,300 questions, 5,100 Science questions in lessons of 44,000 words, and 880 Understand passages with 3,800 evidence-checked questions, plus 1,090 picture sentences and sorting words. Replaying a level brings new words, stories, questions and passages instead of repeating the same ones.

**Library.** The book button in the bottom bar opens the Library: every level of every subject for the child's grade, with search across words, stories, lessons and passages. Open a level to read its words (tap the ear to hear one), its stories and lessons, its questions with a Show answer button, or fresh math examples.
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

Many children can read the words but cannot answer questions about a story. Usually they do not know what the question is asking for, or where to find the answer. Understand teaches both, with its own 50 levels for each grade in five stages of ten levels:

| Grade | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 |
|---|---|---|---|---|---|
| KG | Picture words | Word groups | Picture sentences | Question words | Tiny stories |
| G1 | Sentences | Question words | Two sentences | Three sentences | Short stories |
| G2 | Mini stories | Story clues | Paragraphs | Facts and details | Longer stories |
| G3 | Paragraphs | Nonfiction | Stories in parts | Thinking deeper | Long texts |
| G4 | Main idea | Inference | Informational texts | Literature | Long texts |
| G5 | Theme and summary | Figurative language | Informational texts | Compare texts | Long texts |
| G6 | Central idea | Author's craft | Argument | Literary analysis | Long texts |

How it teaches:

- **Question words first.** A tip card teaches each new question type with an example, and every question carries a coloured chip (WHO, WHERE, WHY...) that says what kind of answer to look for.
- **Look back.** The text stays on screen. In Read together mode, Show me where lights up the sentence that holds the answer and marks the key words. After a wrong answer the sentence turns yellow so the child sees where the answer was; after a right answer it turns green.
- **Two modes per level.** Read together gives tips, pictures and, for long stories, one part at a time with the questions for that part right after it. Show what you know has no hints and, from stage 4, folds the text away behind a Look back button. The level passes at the pass mark across both modes, and the first answer counts.
- **Find my level.** Up to ten quick questions from the child's own grade, two per stage, stop at the first miss and open every level below the starting point. Placed levels earn no stars and no chests.
- **Everywhere.** Reading story questions and Science lesson questions now use the same Look back cards, with the answer sentence found automatically.

Each question names the words that hold its answer (`e`), and the content check below confirms every evidence phrase is really in the text.

## How the app is organized

Four labeled tabs at the bottom, so a child can find everything alone:
- **Learn**: a greeting with today's goal, one big Continue card (finish an unfinished lesson, or start the next level), the four subjects and the learning path.
- **Practice**: Brain Boost, three games (Word Pop, Math Sprint, Memory Match), Reading and Science mix, My mistakes, My Words and a thinking challenge from Nova.
- **Library**: one search box for every subject, Keep going (levels opened recently), Saved (tap the heart on any level), then every level with Flashcards, Practice this level and Ask Nova.
- **Me**: comfort settings, My Words, grown-ups (PIN), streak, hearts, quests, badges and the shop.

**Finish later.** A lesson in progress is saved after every card. Leaving asks "Take a break?" and the Learn page then shows Continue at the exact card.

**No jumps in difficulty.** `node tools/difficulty.js` measures every level (word syllables and sentence length for Reading, lesson sentences for Science, passage length and stage for Understand, answer size for Math) and lists steps over 35%. The lesson builder smooths them:
- Every level lesson opens with two warm-up cards from the level before (no stars, not scored, no hearts lost).
- Its own cards go from easier to harder in three bands, shuffled inside each band.
- The first level of a new Understand stage opens with a bridge passage or items in the old style.
- Phrases (similes, proverbs, idioms) are built from word tiles instead of typed letter by letter.
- After two misses in a row the next card is the easiest of the next few, with a kind word.

**Fun and smart.** Combos cheer at 3, 5, 8, 12, 16 and 20 right in a row. Brain Boost uses spaced repetition: each word or question answered moves up a box when it is right the first time (back in 1, 2, 4, 7, 14, then 30 days) and back to the start when missed, so review comes just before it would be forgotten. Games use only the child's grade and the levels already reached, keep a best score and give up to 10 stars.

## Voice, Nova the AI teacher, and studying comfortably

- Recorded human voice (first choice, free forever, no account): every lesson word and sentence is recorded once with the free Kokoro voice "Heart" and published with the app in `audio/v1/` (about 82,000 short MP3 clips). The app splits a text into sentences (`js/voicekey.js`), and when every sentence is recorded it plays them at once; a text that is not recorded (Nova's answers, names) uses the voices below. A `|` in a spoken text marks where recorded parts join and is never said. To record after content changes: `node tools/voice/texts.js` (lists the clips), then from the folder beside the app `node record.mjs --workers 8 --threads 1` (voice-recorder, resumable), then `node tools/voice/index.js` before committing.

**Voice.** Every word, sentence, story, lesson and teacher answer goes through one voice layer (`js/speech.js`).
- First choice, no key on the device: the same voice as the Mariam app, OpenAI `tts-1` (voice Nova by default) from a small Supabase function, `kids-tts`, in the Mariam Supabase project (bgkugdyrqtsglavoghvb) or the second project (tfqcgakqhnmkyhwbgeth); the app checks both and uses the one that answers (source in `server/kids-tts/index.ts`). The OpenAI key stays on the server as the `OPENAI_API_KEY` secret the Mariam app already uses. The function only answers this site, caps each clip at 600 characters and limits each address to 400 clips an hour; the app saves every clip, so repeats cost nothing. The app checks the function when it opens and uses the next voice when it is not reachable. To turn it on, run from the Mariam1 folder: `npx supabase login`, then `npx supabase functions deploy kids-tts --no-verify-jwt --project-ref bgkugdyrqtsglavoghvb`.
- Next, free, no key or account: a human-sounding AI voice (Kokoro, open source) that runs on the device in a worker (`js/tts-worker.js`). It downloads once (about 90 MB; computers with a graphics card get the faster WebGPU model), every lesson prepares its words as it opens, and every clip is kept, so repeats start at once. A word that is not ready within a moment is said by the device voice while the human voice is made for next time. Not available inside the Claude app, where the device voice speaks.
- Free and instant: the app ranks the voices on the device and picks the most natural one (neural, online, enhanced, Siri and Google voices first). Microsoft Edge and Safari have very human voices; Parents can choose another one.
- AI voice: on the Parents page, choose OpenAI or ElevenLabs and paste your own key. Clips are cached on the device (they replay instantly and work offline once heard), the next card's words are fetched ahead of time, and long texts start after the first sentence while the rest loads. If the key or the internet fails, the device voice takes over at once.

**Nova, the AI teacher** (`js/teacher.js`). The Ask button on every screen opens a chat that knows what the child sees: the card, its question and choices, the passage, story or lesson, the level, or the Library level that is open. While a question is unsolved Nova gives hints and guiding questions, never the answer; after it is solved Nova explains why. A wrong answer shows "Get a hint from Nova"; a solved one shows "Why? Ask Nova". Quick buttons change with the screen (hint, explain a word, read it to me, quiz me, teach me this level, homework help). Answers are read aloud with the app voice, and the child can speak the question (where the browser has a microphone).
- In the Claude app (the artifact), Nova uses Claude through the page's sample capability with no key; the first question asks the viewer to allow it.
- On the web version, a parent adds an Anthropic (Claude) or OpenAI key on the Parents page. The default is Claude Haiku 5.5 for speed; Sonnet 5.5 can be chosen.
- With no AI, Nova still reads things aloud, gives hints, points to the sentence that holds the answer and explains a solved answer from the text.
Keys are typed by the parent, stored only on that device in their own slot (`gka.keys.v1`), never included in backups, and sent only to that company. Set a spending limit in the provider account.

**Shuffle.** Each level keeps a shuffle bag of the words, stories, Science questions, Understand sentences, picture words and passage groups it has not shown yet. Every run draws from the bag and it refills, reshuffled, only when empty, so a child sees everything in a level in a new order before anything repeats; checks are shuffled too. "Same order" in the comfort panel or the level page turns this off.

**Study comfortably.** The Aa button in the top bar opens the comfort panel, with no PIN: text size (normal, large, extra large), easy-read letters (Lexend), voice speed, shuffle or same order, Nova reading answers aloud, and calm mode (no moving effects). Home has a Find box that searches every subject, Mix practice (a new shuffle of every level reached), My mistakes, the Library and Ask Nova. The Library has an All tab for searching everything, and every level has Flashcards (flip, hear, shuffle, swipe), Practice this level (when it is open) and Ask Nova.

## Content and the content check

Each grade has a folder, `content/kg` to `content/g6`, holding that grade's files: `reading-01.js` and up, `math.js`, `science-01.js` and up, and `understand-01.js` and up. Each file adds levels to one subject of one grade, and the app joins them by level number. Files named `reading-x1.js`, `science-x2.js`, `understand-x1.js` and so on are extra parts (`extra: true`): they add more words, stories, questions, a second lesson part (`lesson2`), passages, sentences or picture words to levels that already exist. A word or Science question that is already in the level is not added twice.

After changing content, run these three commands:

```
node tools/build-index.js
node tools/check-content.js
node tools/build-sw.js
```

The first adds every content file to `index.html`. The second checks that every grade has levels 1 to 50 in every subject and that every level is well formed: enough words, stories with questions, lessons of a real length, answer options that include the answer, math generators that never fail, and Understand evidence that exists in the text. It must end with "all content complete, no errors". The third refreshes the offline cache list. `node tools/build-curriculum.js` rewrites CURRICULUM.md.

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

The app is live at **https://waeil55.github.io/MerolaApp/** as an installable web app. GitHub Pages publishes the `main` branch (Settings > Pages > Deploy from a branch, main, root), so every push to `main` updates the site within a minute or two. Run `node tools/build-sw.js` before pushing when files are added, so the offline cache list stays complete. The `.nojekyll` file keeps Pages from touching the files. The folder also runs on Netlify, Vercel or any web server.

## Files

- `index.html` the app shell. `styles.css` the design (light and dark).
- `content/<grade>/` holds that grade's 50 levels for each subject (see above). `content/pictures.js` maps words to picture emoji. `content/math-lib.js` and `content/math-more.js` hold the math problem and word problem generators. Edit these to change words, stories, lessons or questions.
- `js/rewards.js` hearts, gems, quests, badges, chests, shop and leaderboard.
- `js/speech.js` the voice layer (device voices, AI voices with cache and prefetch, microphone, sound effects).
- `js/games.js` the Practice tab, Brain Boost entry and the three games.
- `tools/difficulty.js` difficulty report for every level.
- `js/teacher.js` Nova, the AI teacher, with built-in help when no AI is available.
- `js/understand.js` the comprehension engine: sentence splitting, evidence finding, decks for the five stages, placement, and look-back cards for stories and lessons.
- `js/engine.js` builds decks and applies the star and review rules. `js/session.js` plays the cards. `js/views.js` the screens.
- `js/speech.js` text to speech, speech recognition and sound effects. `js/util.js` forgiving speech matching.
- `js/store.js` progress in the browser's local storage.

## Adding words

My Words: type a word, say it into the mic, or paste a list. Those words can be practiced in all four modes and show their own star rating.
