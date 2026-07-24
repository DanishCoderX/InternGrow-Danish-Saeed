# InternGrow — App Development Track

Three apps built for the **InternGrow App Development Track**, each covering a different theme: local-first productivity, AI-augmented creativity, and a full-stack cross-platform product with accounts and sync.

| | Project | Task | Stack | Live |
|---|---|---|---|---|
| 📇 | [Card Catalog](#-card-catalog--smart-flashcard-quiz-app) | Task 1 — Smart Flashcard Quiz App with Analytics | React · TypeScript · Vite · Tailwind | [flashcard-quiz-app-murex.vercel.app](https://flashcard-quiz-app-murex.vercel.app/) |
| 🖼️ | [Wallscape](#️-wallscape--ai-powered-quote--wallpaper-generator) | Task 2 — AI-Powered Quote & Wallpaper Generator | React · TypeScript · Node/Express · Groq · Unsplash | [wallscape-one.vercel.app](https://wallscape-one.vercel.app/) |
| 💧 | [Vital](#-vital--fitness--hydration-tracker) | Task 3 — Advanced Fitness & Hydration Tracker | Expo · React Native · Node/Express · MongoDB | [vital-ivory-tau.vercel.app](https://vital-ivory-tau.vercel.app) |

---

## 📇 Card Catalog — Smart Flashcard Quiz App

A personalized flashcard study app with topic-based organization, a flip-to-reveal quiz mode, and a performance dashboard tracking weekly scores and daily study streaks.

**Live:** https://flashcard-quiz-app-murex.vercel.app/

### Overview
Card Catalog reimagines flashcard study as a personal library system — topics are drawers, each card is a ruled index card you flip to check your answer, and every study round gets logged into a ledger-style dashboard. No backend, no sign-up — everything persists locally in the browser.

### Features
- 🗂️ **Categorized decks** — add, edit, and delete cards, organized by topic/subject
- 🔄 **Flip-to-reveal** — click or press `Enter` to flip a card between question and answer
- ⬅️➡️ **Deck navigation** — Next / Previous, filterable per topic
- ✅ **Self-grading** — mark each card "Got it" or "Missed it"
- 📊 **Performance dashboard** — weekly quiz scores as a tally-bar chart, plus 7-day accuracy
- 🔥 **Study streak tracker** — punch-card style streak view with a longest-streak record

### Design concept
Styled after a personal library card catalog: topic tabs read like drawer labels, flashcards render as ruled index cards with a stacked-deck shadow, and the dashboard is framed as "The Ledger" — a study log, not just a stats page.

**Palette:** Paper `#FAF6EC` · Ink `#2B2A28` · Teal `#3F6E64` · Coral `#C1553A` · Mustard `#C99A2E`
**Type:** Fraunces (display) + Inter (body) + IBM Plex Mono (labels/stats)

### Tech stack
React 18 · TypeScript · Vite · Tailwind CSS v4 · `localStorage` persistence (no backend)

### Project structure
```
flashcard-quiz-app/
├── src/
│   ├── components/
│   │   ├── TabBar.tsx        # View switcher (Study / Manage / Ledger)
│   │   ├── StudyDeck.tsx     # Flip-card quiz mode + navigation
│   │   ├── ManageCards.tsx   # Add / edit / delete cards
│   │   └── Dashboard.tsx     # Weekly scores + streak tracker
│   ├── storage.ts            # localStorage persistence + streak/score logic
│   ├── types.ts              # Shared TypeScript types
│   ├── App.tsx
│   └── index.css             # Design tokens + flip-card animation
├── index.html
└── package.json
```

### Getting started
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static build to dist/ — deployable to Netlify, Vercel, or GitHub Pages
```

### Roadmap
- Export/import deck as JSON
- Spaced-repetition scheduling (e.g. SM-2 algorithm)
- Multi-device sync via a lightweight backend

---

## 🖼️ Wallscape — AI-Powered Quote & Wallpaper Generator

An inspirational quote generator that goes a step further: an LLM reads each quote, classifies its mood, and picks a matching photo — then composites everything into a downloadable, share-ready wallpaper.

**Live:** https://wallscape-one.vercel.app/

**API:** [wallscape-production.up.railway.app](https://wallscape-production.up.railway.app)

### Overview
Most quote generators just pair random text with a random photo. Wallscape's core mechanic is that the pairing is *meaningful*: a Groq-powered LLM reads the quote and returns its mood, a matching visual scene keyword, a ready-to-post social caption, and hashtags — all in a single call. That mood then drives both the Unsplash photo search and the app's own UI accent color, so the interface itself subtly reflects whatever quote you're looking at.

### Features
- 🎲 **Random / Custom / Mood modes** — random quote, type your own line, or pick a mood (Calm, Motivation, Love, Success, Adventure)
- 🧠 **AI mood analysis** — Groq (Llama 3.3) classifies mood, generates an image search keyword, a social caption, and hashtags — one call
- 🖼️ **Matching background photo** — Unsplash search driven by the AI's keyword, with full photographer attribution
- 🎨 **Auto-contrast text** — samples the composed image's brightness and switches light/dark text + scrim automatically
- ✒️ **4 style presets** — Elegant Serif, Bold Modern, Minimal Sans, Handwritten — each a real canvas-rendered typeface
- 📐 **4 export sizes** — phone wallpaper, desktop wallpaper, Instagram post, Instagram story
- 💾 **Save & Share** — download as PNG, or share via the device share sheet (falls back to download if unsupported)
- 📅 **Quote of the Day** — same quote for every visitor, deterministic by day, refreshes at midnight
- 🗂️ **History & Favorites** — every generated wallpaper logged locally as a film-strip contact sheet; star your favorites
- 🛡️ **Resilient by design** — bundled fallback quotes and gradient backgrounds keep the app working end-to-end even if an external API is briefly down

### Design concept
A dark, gallery-style interface (Void `#15141A`, Surface `#1F1E26`) so the generated photo wallpaper stays the visual focus rather than competing with app chrome. The signature touch: the UI's accent color shifts to match whatever mood the AI just detected — a functional "mood ring," not a decorative animation. History renders as a film-strip contact sheet, tying the interface language back to photography.

### Architecture
```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│  Frontend   │ ─────▶ │     Backend      │ ─────▶ │  ZenQuotes   │
│  (Vercel)   │        │    (Railway)     │        │  Groq        │
│ React + TS  │ ◀───── │  Node/Express    │ ◀───── │  Unsplash    │
└─────────────┘        └──────────────────┘        └──────────────┘
```
The backend proxies all three external services so the frontend never holds API keys and never hits CORS issues. Every service has a local fallback, so a single external outage never breaks the app.

### Project structure
```
wallscape/
├── backend/    Node/Express API — proxies ZenQuotes, Groq, and Unsplash
│   ├── src/
│   │   ├── routes/api.js
│   │   ├── services/        # quoteService, aiService, unsplashService
│   │   └── data/fallbackQuotes.js
│   └── README.md
└── frontend/   React + TypeScript + Vite + Tailwind
    ├── src/
    │   ├── components/      # QuoteControls, PosterPreview, StyleControls, ActionPanel, HistoryFilmstrip
    │   ├── lib/              # api, canvasCompositor, storage, moodTheme, stylePresets, exportSizes
    │   └── App.tsx
    └── README.md
```

### Getting started
```bash
# Terminal 1 — backend
cd backend
cp .env.example .env   # add your GROQ_API_KEY and UNSPLASH_ACCESS_KEY
npm install
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
npm run dev             # http://localhost:5173
```

**API keys:** Groq free key at [console.groq.com](https://console.groq.com) ·Unsplash free "Demo" app (50 req/hour) at [unsplash.com/developers](https://unsplash.com/developers)

### Deployment
- **Backend → Railway.** Set `GROQ_API_KEY` and `UNSPLASH_ACCESS_KEY` as service env vars. Root directory: `backend`.
- **Frontend → Vercel.** Root directory: `frontend`. Set `VITE_API_BASE_URL` to the Railway backend URL + `/api`.

### Tech stack
**Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4, Canvas API
**Backend:** Node.js, Express, node-fetch
**APIs:** ZenQuotes (quotes), Groq / Llama 3.3 70B (mood + caption analysis), Unsplash (photos)
**Persistence:** Browser `localStorage` (history & favorites) — no database required

---

## 💧 Vital — Fitness & Hydration Tracker

A cross-platform fitness and hydration tracker — one Expo codebase for iOS, Android, and a real website — with user accounts, automatic cross-device sync, and native features that gracefully degrade to sensible web equivalents where the browser can't do what a phone can.

**Web app:** [vital-ivory-tau.vercel.app](https://vital-ivory-tau.vercel.app)

**API:** [vital-backend.bonto.run](https://vital-backend.bonto.run)

**Android:** downloadable APK linked from the web app's banner (built via EAS)

### Project structure
```
vital/
├── app/        Expo (React Native + TypeScript) — the actual app, runs on iOS/Android/web
└── backend/    Node/Express + MongoDB — auth, sync, and password reset API
```

### Features

**Accounts & sync**
- Email/password signup and login, plus Google Sign-In (native + web)
- Forgot password — emailed 6-digit reset code, no deep-linking complexity
- Change password while logged in
- Delete account — permanently removes the account and all synced data, with a confirmation step
- Data automatically syncs across every device you log into
- Offline-resilient login — reopening the app without a connection uses your last-known session instead of logging you out
- Weight collected at sign-up, feeding directly into calorie accuracy

**Workouts** — full CRUD, 8 workout types with auto-estimated calories (MET formula × body weight, still manually editable), quick-log presets

**Steps**
- Native: automatic tracking via the device's motion sensor (with a proper Activity Recognition permission request)
- Web: manual entry / quick-increment buttons, since browsers have no step sensor

**Hydration** — animated SVG progress ring, quick-add buttons + custom amount, daily history log, custom daily goal

**Reminders**
- Native: real scheduled notifications, fire even when the app's closed, with a "+250ml" quick-action button on the notification itself
- Web: browser notifications while the tab's open — clearly labeled as a browser limitation, not hidden

**Dashboard & insights** — today's calories/steps/hydration at a glance, weekly/monthly chart toggle, hydration streak tracker (current + longest), rest days that protect your streak without breaking it

**Achievements** — 6 auto-checked badges based on real logged data

**Personalization** — full light/dark theme with a genuinely distinct dark palette, not just inverted colors

**Data portability** — CSV export (all data types) and import (merges into existing data), share a weekly summary card as an image

**Cross-platform by design** — one codebase → iOS, Android, and a real website; installable as a PWA on web; downloadable Android APK linked from the web app

### Honest platform notes
Called out explicitly in the UI rather than silently faked:
- **Storage:** uses `AsyncStorage` instead of the brief's suggested SQLite/Room, since SQLite doesn't exist in a browser and this app genuinely needs to run on both.
- **Step counting:** only real phones have a motion sensor — the web version says so and offers manual entry instead.
- **Reminders:** web notifications require the tab to stay open — there's no background push without a server-side push subscription, which is out of scope here.

### Tech stack
**Frontend:** Expo (SDK 57), React Native, TypeScript, React Navigation, `react-native-svg`, `expo-notifications`, `expo-sensors`, `expo-auth-session`, `expo-file-system` / `expo-sharing` / `expo-document-picker`, `react-native-view-shot` + `html2canvas`
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt, `google-auth-library`, Nodemailer (Gmail SMTP)
**Persistence:** `AsyncStorage` (instant local reads/writes) with debounced background sync to the backend when signed in

### Setup

**1. MongoDB Atlas (free tier)** — create a free cluster, get your connection string, set it as `MONGODB_URI`.

**2. Google OAuth** — create Web, Android, and iOS OAuth client IDs in Google Cloud Console. The Web client ID goes in the backend's `.env`; all three go into `app/src/components/GoogleSignInButton.tsx`. See `backend/README.md` for the full walkthrough, including the Android-specific custom URI scheme requirement.

**3. Gmail SMTP (for password reset emails)** — enable 2-Step Verification on a Gmail account, generate an App Password, set `GMAIL_USER` / `GMAIL_APP_PASSWORD`. Without these, reset codes are logged to the server console instead of emailed — fine for local testing.

**4. JWT secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**5. Run it**
```bash
# Terminal 1 — backend
cd backend
cp .env.example .env   # fill in the values above
npm install
npm run dev

# Terminal 2 — app
cd app
npm install
npm start
```
Press `w` for web, or scan the QR code with Expo Go for native — completely free, no build required.

### Deployment
- **Backend** → any Node host (deployed here on Bonto; Railway also works). Set the same env vars as `.env.example`.
- **Web app** → Vercel/Netlify. Build command: `npm run build:web` (inside `app/`). Set `EXPO_PUBLIC_API_BASE_URL` to your backend's URL + `/api`.
- **Android APK** → `eas build --platform android --profile preview` (free tier, no Play Store needed). See `app/README.md` for the full walkthrough, including hosting the resulting `.apk` as a GitHub Release for a permanent download link.

---

## Author

**Daanish (Daanish Saeed)** — Full Stack Web Developer (MERN) · Final-year BS Computer Science, COMSATS University Islamabad — Attock Campus
GitHub: [@DanishCoderX](https://github.com/DanishCoderX)

All three apps were built as part of the **InternGrow App Development Track**.

## License

MIT — free to use and adapt.
