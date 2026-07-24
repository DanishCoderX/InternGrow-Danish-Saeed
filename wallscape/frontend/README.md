# Wallscape Frontend

React + TypeScript + Vite + Tailwind CSS v4 frontend for the AI-Powered Quote & Wallpaper Generator.

## Setup

```bash
npm install
npm run dev
```

By default it talks to a backend running locally at `http://localhost:4000/api`. To point at a deployed backend, copy `.env.example` to `.env` and set:
```
VITE_API_BASE_URL=https://your-backend.up.railway.app/api
```

## Build

```bash
npm run build
```
Outputs to `dist/` — deploy as a static site to Netlify or Vercel.

## Features

- **Random / Custom / Mood** quote modes
- **AI mood analysis** (via the backend's Groq proxy) drives both the background photo search and the UI's accent color
- **4 style presets** — Elegant Serif, Bold Modern, Minimal Sans, Handwritten — each with its own canvas-rendered typeface
- **4 export sizes** — phone wallpaper, desktop wallpaper, Instagram post, Instagram story
- **Auto-contrast** — samples the composed image's brightness where the text sits and switches between light/dark text + scrim automatically
- **Save as PNG** or **native share** (Web Share API, falls back to download if unsupported)
- **Quote of the Day** banner, same quote for every visitor each day
- **History** — every generated wallpaper logged to `localStorage`, shown as a film-strip contact sheet
- **Favorites** — star any history entry to pin it to a separate view

## Project structure

```
src/
├── components/
│   ├── QuoteOfDayBanner.tsx
│   ├── QuoteControls.tsx      # Random / Custom / Mood tabs
│   ├── PosterPreview.tsx      # live canvas preview + Unsplash attribution
│   ├── StyleControls.tsx      # style preset + export size pickers
│   ├── ActionPanel.tsx        # caption/hashtags, Save, Share, Favorite
│   └── HistoryFilmstrip.tsx   # History / Favorites contact sheet
├── lib/
│   ├── api.ts                 # backend API client
│   ├── canvasCompositor.ts    # draws background + text, auto-contrast logic
│   ├── storage.ts             # localStorage history/favorites persistence
│   ├── moodTheme.ts           # mood → accent color mapping
│   ├── stylePresets.ts
│   └── exportSizes.ts
├── types.ts
└── App.tsx
```

## Design notes

Dark, gallery-style chrome (Void `#15141A`, Surface `#1F1E26`) so the generated photo wallpaper stays the visual focus. The UI's accent color (`--mood-accent`) is set dynamically per the AI's mood classification — it's a functional indicator, not a decorative animation. History renders as a film-strip contact sheet (sprocket-hole background pattern) to tie the UI language back to photography, the subject of the app itself.
