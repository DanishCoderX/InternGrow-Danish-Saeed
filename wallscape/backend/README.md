# Wallscape Backend

Node/Express API that proxies three external services so the frontend never needs its own API keys and never hits CORS issues:

- **ZenQuotes** — random quotes and mood-filtered quote lookup
- **Groq** (llama-3.3-70b-versatile) — analyzes a quote and returns mood, an Unsplash search keyword, a social caption, and hashtags
- **Unsplash** — searches for a photo matching that keyword

Every service has a local fallback (bundled quotes / CSS gradients), so the API keeps working end-to-end even if an external service is down or a key isn't set yet.

## Setup

```bash
cp .env.example .env
```

Fill in `.env`:
```
GROQ_API_KEY=your_key_here        # https://console.groq.com
UNSPLASH_ACCESS_KEY=your_key_here # https://unsplash.com/developers — create a "Demo" app
```

```bash
npm install
npm run dev     # nodemon, auto-restarts on changes
# or
npm start       # plain node
```

Runs on `http://localhost:4000` by default (override with `PORT` in `.env`).

## API Reference

### `GET /api/quote`
Random quote. Optional `?mood=` query param (`calm` | `motivation` | `love` | `success` | `adventure`) biases the result toward that mood.
```json
{ "content": "...", "author": "...", "source": "zenquotes" }
```

### `GET /api/quote-of-day`
Same quote for every visitor, deterministic by day-of-year. Changes at midnight.
```json
{ "content": "...", "author": "...", "date": "2026-07-14", "source": "quote-of-day" }
```

### `GET /api/moods`
List of supported mood categories for the Mood Picker.
```json
{ "moods": ["calm", "motivation", "love", "success", "adventure"] }
```

### `POST /api/analyze`
Body: `{ "quote": "...", "author": "..." }`
```json
{
  "mood": "calm",
  "imageKeyword": "misty mountain sunrise",
  "caption": "A gentle reminder to slow down today.",
  "hashtags": ["#calm", "#mindfulness", "#quoteoftheday"]
}
```

### `GET /api/wallpaper?query=...&mood=...`
Returns a matching photo (or a gradient if Unsplash is unavailable):
```json
{
  "type": "photo",
  "url": "https://images.unsplash.com/...",
  "photographer": "Jane Doe",
  "photographerUrl": "https://unsplash.com/@janedoe",
  "unsplashLink": "https://unsplash.com/photos/..."
}
```

## Notes on Unsplash compliance

Per Unsplash's API guidelines, this backend automatically pings each photo's `download_location` endpoint when it's used, and the frontend displays photographer attribution + a link back to Unsplash under every photo wallpaper.

## Deployment (Railway)

1. Push this `backend/` folder (or the whole monorepo) to GitHub
2. Create a new Railway project from the repo, pointing at the `backend` folder if using a monorepo
3. Add `GROQ_API_KEY` and `UNSPLASH_ACCESS_KEY` as environment variables in Railway's dashboard
4. Railway auto-detects `npm start` — no extra config needed
