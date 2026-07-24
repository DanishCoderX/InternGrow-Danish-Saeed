import type { Quote, Analysis, Background } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json() as Promise<T>;
}

export function fetchRandomQuote(): Promise<Quote> {
  return fetch(`${API_BASE}/quote`).then(json<Quote>);
}

export function fetchQuoteByMood(mood: string): Promise<Quote> {
  return fetch(`${API_BASE}/quote?mood=${encodeURIComponent(mood)}`).then(json<Quote>);
}

export function fetchQuoteOfDay(): Promise<Quote> {
  return fetch(`${API_BASE}/quote-of-day`).then(json<Quote>);
}

export function fetchMoodOptions(): Promise<{ moods: string[] }> {
  return fetch(`${API_BASE}/moods`).then(json<{ moods: string[] }>);
}

export function analyzeQuote(quote: string, author: string): Promise<Analysis> {
  return fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quote, author }),
  }).then(json<Analysis>);
}

export function fetchWallpaper(query: string, mood: string): Promise<Background> {
  return fetch(`${API_BASE}/wallpaper?query=${encodeURIComponent(query)}&mood=${encodeURIComponent(mood)}`).then(
    json<Background>
  );
}
