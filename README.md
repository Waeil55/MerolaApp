# Genius Kids Academy

A learning app for kids from Kindergarten to Grade 6: Reading, Math and Science, 20 levels per subject for every grade (420 levels in all),
with four ways to practice every word (I Read, I Speak, I Listen, I Write) plus stories, lessons and quizzes. Each kid gets a profile with a name,
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

## Files

- `index.html` the app shell. `styles.css` the design (light and dark).
- `content/reading-<grade>.js`, `content/science-<grade>.js`, `content/math-<grade>.js` hold the 20 levels per grade (`reading.js`, `math.js`, `science.js` are Grade 3). `content/math-lib.js` holds the math problem generators. Edit these to change words, stories, lessons or questions.
- `js/engine.js` builds decks and applies the star and review rules. `js/session.js` plays the cards. `js/views.js` the screens.
- `js/speech.js` text to speech, speech recognition and sound effects. `js/util.js` forgiving speech matching.
- `js/store.js` progress in the browser's local storage.

## Adding words

My Words: type a word, say it into the mic, or paste a list. Those words can be practiced in all four modes and show their own star rating.
