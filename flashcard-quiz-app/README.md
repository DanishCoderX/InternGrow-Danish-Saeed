# 📇 Card Catalog — Smart Flashcard Quiz App

A personalized flashcard study app with topic-based organization, a flip-to-reveal quiz mode, and a performance dashboard tracking weekly scores and daily study streaks.

Built for **InternGrow — App Development Track**, Task 1: *Smart Flashcard Quiz App with Analytics*.

![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Overview

Card Catalog reimagines flashcard study as a personal library system — topics are drawers, each card is a ruled index card you flip to check your answer, and every study round gets logged into a ledger-style dashboard. No backend, no sign-up — everything persists locally in the browser.

## Features

| Feature | Description |
|---|---|
| 🗂️ **Categorized decks** | Add, edit, and delete cards, organized by topic/subject |
| 🔄 **Flip-to-reveal** | Click or press `Enter` to flip a card between question and answer |
| ⬅️➡️ **Deck navigation** | Move through cards with Next / Previous, filterable per topic |
| ✅ **Self-grading** | Mark each card "Got it" or "Missed it" as you go |
| 📊 **Performance dashboard** | Weekly quiz scores shown as a tally-bar chart, plus 7-day accuracy |
| 🔥 **Study streak tracker** | Punch-card style streak view with a longest-streak record |

## Design Concept

Styled after a personal library card catalog:
- Topic tabs read like drawer labels
- Flashcards are rendered as ruled index cards with a stacked-deck shadow
- The dashboard is framed as "The Ledger" — a study log, not just a stats page

**Palette & type**

| Role | Color |
|---|---|
| Paper (background) | `#FAF6EC` |
| Ink (text) | `#2B2A28` |
| Teal (success/accent) | `#3F6E64` |
| Coral (alert/accent) | `#C1553A` |
| Mustard (secondary accent) | `#C99A2E` |

Typeface pairing: **Fraunces** (display/headings) + **Inter** (body) + **IBM Plex Mono** (labels, tags, stats).

## Tech Stack

- **React 18** + **TypeScript** — component logic and type safety
- **Vite** — dev server and build tooling
- **Tailwind CSS v4** — utility-first styling with a custom design token theme
- **localStorage** — client-side persistence, no backend required

## Project Structure

```
flashcard-quiz-app/
├── src/
│   ├── components/
│   │   ├── TabBar.tsx        # View switcher (Study / Manage / Ledger)
│   │   ├── StudyDeck.tsx     # Flip-card quiz mode + navigation
│   │   ├── ManageCards.tsx   # Add / edit / delete cards
│   │   └── Dashboard.tsx     # Weekly scores + streak tracker
│   ├── storage.ts            # localStorage persistence + streak/score logic
│   ├── types.ts               # Shared TypeScript types
│   ├── App.tsx
│   └── index.css              # Design tokens + flip-card animation
├── index.html
└── package.json
```

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build for Production

```bash
npm run build
```

Outputs a static build to `dist/` — deployable directly to Netlify, Vercel, or GitHub Pages.

## Roadmap / Possible Extensions

- Export/import deck as JSON
- Spaced-repetition scheduling (e.g. SM-2 algorithm)
- Multi-device sync via a lightweight backend

## Author

**Daanish** — Full Stack Web Developer (MERN) · Final-year BS Computer Science, COMSATS University Islamabad — Attock Campus
GitHub: [@DanishCoderX](https://github.com/DanishCoderX)

Built as part of the **InternGrow App Development Track**.

## License

MIT — free to use and adapt.
