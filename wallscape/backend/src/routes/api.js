const express = require("express");
const { getRandomQuote, getQuoteByMood, getQuoteOfTheDay, MOOD_KEYWORDS } = require("../services/quoteService");
const { analyzeQuote } = require("../services/aiService");
const { searchWallpaper } = require("../services/unsplashService");

const router = express.Router();

router.get("/quote", async (req, res) => {
  const { mood } = req.query;
  const quote = mood ? await getQuoteByMood(mood) : await getRandomQuote();
  res.json(quote);
});

router.get("/moods", (req, res) => {
  res.json({ moods: Object.keys(MOOD_KEYWORDS) });
});

router.get("/quote-of-day", (req, res) => {
  const quote = getQuoteOfTheDay();
  res.json(quote);
});

router.post("/analyze", async (req, res) => {
  const { quote, author } = req.body || {};
  if (!quote || typeof quote !== "string") {
    return res.status(400).json({ error: "Missing 'quote' string in request body" });
  }
  const analysis = await analyzeQuote(quote, author || "Unknown");
  res.json(analysis);
});

router.get("/wallpaper", async (req, res) => {
  const { query, mood } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing 'query' search param" });
  }
  const background = await searchWallpaper(query, mood);
  res.json(background);
});

module.exports = router;
