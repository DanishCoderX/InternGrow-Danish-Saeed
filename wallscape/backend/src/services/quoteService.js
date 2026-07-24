const fetch = require("node-fetch");
const { FALLBACK_QUOTES } = require("../data/fallbackQuotes");

const ZENQUOTES_RANDOM_URL = "https://zenquotes.io/api/random";
const ZENQUOTES_BULK_URL = "https://zenquotes.io/api/quotes";

// ZenQuotes is a small free service — some free APIs quietly deprioritize requests with
// no User-Agent (Node's default fetch sends a generic one), and its response times can be
// inconsistent, so we send a normal browser-like header and give it a more generous timeout.
const ZENQUOTES_FETCH_OPTIONS = {
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    Accept: "application/json",
  },
};

// Simple keyword buckets used to filter quotes for the Mood Picker feature.
// Not a full sentiment model — just enough signal to bias results toward the chosen mood.
const MOOD_KEYWORDS = {
  calm: ["calm", "peace", "quiet", "stillness", "patience", "serenity", "still"],
  motivation: ["success", "achieve", "goal", "work", "effort", "dream", "persever", "hard"],
  love: ["love", "heart", "kindness", "compassion", "care"],
  success: ["success", "win", "achieve", "accomplish", "victory", "great"],
  adventure: ["journey", "adventure", "explore", "travel", "risk", "courage", "path"],
};

function randomFallbackQuote() {
  const pick = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  return { ...pick, source: "fallback" };
}

/** Fetches one random quote from ZenQuotes; falls back to the bundled list on any failure. */
async function getRandomQuote() {
  try {
    const res = await fetch(ZENQUOTES_RANDOM_URL, ZENQUOTES_FETCH_OPTIONS);
    if (!res.ok) throw new Error(`ZenQuotes responded ${res.status}`);
    const data = await res.json();
    const entry = Array.isArray(data) ? data[0] : null;
    if (!entry || !entry.q) throw new Error("Unexpected ZenQuotes response shape");
    return { content: entry.q, author: entry.a || "Unknown", source: "zenquotes" };
  } catch (err) {
    console.error("[quoteService] ZenQuotes fetch failed, using fallback:", err.message);
    return randomFallbackQuote();
  }
}

/** Fetches a quote biased toward a chosen mood category (calm, motivation, love, success, adventure). */
async function getQuoteByMood(mood) {
  const key = mood?.toLowerCase();
  const keywords = MOOD_KEYWORDS[key];
  if (!keywords) return getRandomQuote();

  try {
    const res = await fetch(ZENQUOTES_BULK_URL, ZENQUOTES_FETCH_OPTIONS);
    if (res.ok) {
      const data = await res.json();
      const matches = Array.isArray(data)
        ? data.filter((q) => q.q && keywords.some((k) => q.q.toLowerCase().includes(k)))
        : [];
      if (matches.length > 0) {
        const pick = matches[Math.floor(Math.random() * matches.length)];
        return { content: pick.q, author: pick.a || "Unknown", source: "zenquotes-matched" };
      }
    }
  } catch (err) {
    console.error("[quoteService] Mood-filtered ZenQuotes fetch failed:", err.message);
  }

  // Fall back to the local bundle, filtered by the same keywords if possible.
  const localMatches = FALLBACK_QUOTES.filter((q) => keywords.some((k) => q.content.toLowerCase().includes(k)));
  const pool = localMatches.length > 0 ? localMatches : FALLBACK_QUOTES;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { ...pick, source: localMatches.length > 0 ? "fallback-matched" : "fallback-random" };
}

/** Day-of-year based deterministic pick — same quote for every visitor, all day. */
function getQuoteOfTheDay() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / 86400000);
  const index = dayOfYear % FALLBACK_QUOTES.length;
  const dateStr = now.toISOString().slice(0, 10);
  return { ...FALLBACK_QUOTES[index], date: dateStr, source: "quote-of-day" };
}

module.exports = { getRandomQuote, getQuoteByMood, getQuoteOfTheDay, MOOD_KEYWORDS };