# 🖼️ Wallscape — AI-Powered Quote & Wallpaper Generator

An inspirational quote generator that goes a step further: an LLM reads each quote, classifies its mood, and picks a matching photo — then composites everything into a downloadable, share-ready wallpaper.

Built for **InternGrow — App Development Track**, Task 2: *AI-Powered Quote & Wallpaper Generator*.


## 🔗 Live Demo

- **App:** https://wallscape-one.vercel.app/
- **API:** [wallscape-production.up.railway.app](https://wallscape-production.up.railway.app)

## Overview

Most quote generators just pair random text with a random photo. Wallscape's core mechanic is that the pairing is *meaningful*: a Groq-powered LLM reads the quote and returns its mood, a matching visual scene keyword, a ready-to-post social caption, and hashtags — all in a single call. That mood then drives both the Unsplash photo search and the app's own UI accent color, so the interface itself subtly reflects whatever quote you're looking at.

## Features

| Feature | Description |
|---|---|
| 🎲 **Random / Custom / Mood modes** | Get a random quote, type your own line, or pick a mood (Calm, Motivation, Love, Success, Adventure) |
| 🧠 **AI mood analysis** | Groq (Llama 3.3) classifies mood, generates an image search keyword, a social caption, and hashtags — one call |
| 🖼️ **Matching background photo** | Unsplash search driven by the AI's keyword, with full photographer attribution |
| 🎨 **Auto-contrast text** | Samples the composed image's brightness and switches light/dark text + scrim automatically |
| ✒️ **4 style presets** | Elegant Serif, Bold Modern, Minimal Sans, Handwritten — each a real canvas-rendered typeface |
| 📐 **4 export sizes** | Phone wallpaper, desktop wallpaper, Instagram post, Instagram story |
| 💾 **Save & Share** | Download as PNG, or share directly via the device share sheet (falls back to download if unsupported) |
| 📅 **Quote of the Day** | Same quote for every visitor, deterministic by day, refreshes at midnight |
| 🗂️ **History & Favorites** | Every generated wallpaper logged locally as a film-strip contact sheet; star your favorites |
| 🛡️ **Resilient by design** | Bundled fallback quotes and gradient backgrounds keep the app working end-to-end even if an external API is briefly down |

## Design Concept

A dark, gallery-style interface (Void `#15141A`, Surface `#1F1E26`) so the generated photo wallpaper stays the visual focus rather than competing with app chrome. The one signature touch: the UI's accent color shifts to match whatever mood the AI just detected — a functional "mood ring," not a decorative animation. History renders as a film-strip contact sheet, tying the interface language back to photography, the actual subject of the app.

## Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│  Frontend   │ ─────▶ │     Backend      │ ─────▶ │  ZenQuotes   │
│  (Vercel)   │        │    (Railway)     │        │  Groq        │
│ React + TS  │ ◀───── │  Node/Express    │ ◀───── │  Unsplash    │
└─────────────┘        └──────────────────┘        └──────────────┘
```

The backend proxies all three external services so the frontend never holds API keys and never hits CORS issues. Every service has a local fallback, so a single external outage never breaks the app.

## Project Structure

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

Each folder has its own README with detailed setup instructions and API reference.

## Getting Started

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env   # add your GROQ_API_KEY and UNSPLASH_ACCESS_KEY
npm install
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Open the frontend's local URL (Vite prints it, typically `http://localhost:5173`).

### Getting API keys
- **Groq:** free key at [console.groq.com](https://console.groq.com)
- **Unsplash:** free "Demo" app (50 req/hour) at [unsplash.com/developers](https://unsplash.com/developers) — see `backend/README.md` for the full registration walkthrough

## Deployment

- **Backend → Railway.** Set `GROQ_API_KEY` and `UNSPLASH_ACCESS_KEY` as service environment variables. Root directory: `backend`.
- **Frontend → Vercel.** Root directory: `frontend`. Set `VITE_API_BASE_URL` to your Railway backend's URL + `/api` (e.g. `https://wallscape-production.up.railway.app/api`).

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4, Canvas API
**Backend:** Node.js, Express, node-fetch
**APIs:** ZenQuotes (quotes), Groq / Llama 3.3 70B (mood + caption analysis), Unsplash (photos)
**Persistence:** Browser `localStorage` (history & favorites) — no database required

## Author

**Daanish Saeed** — Full Stack Web Developer (MERN) · Final-year BS Computer Science, COMSATS University Islamabad — Attock Campus
GitHub: [@DanishCoderX](https://github.com/DanishCoderX)

Built as part of the **InternGrow App Development Track**.

## License

MIT — free to use and adapt.
