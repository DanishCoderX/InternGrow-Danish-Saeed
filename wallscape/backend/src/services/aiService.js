const fetch = require("node-fetch");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are an assistant that analyzes inspirational quotes for a wallpaper-generator app.
Given a quote and its author, respond with ONLY a JSON object (no markdown, no prose, no code fences) with exactly these fields:
{
  "mood": "one or two words describing the emotional tone, e.g. 'calm' or 'determined'",
  "imageKeyword": "a short, vivid scene description (3-6 words) suitable as an Unsplash photo search query that visually matches the quote's mood, e.g. 'misty mountain sunrise' or 'calm ocean waves'",
  "caption": "a short, engaging one-sentence social media caption (max 25 words) that could accompany this quote as a LinkedIn/Instagram post",
  "hashtags": ["3 to 6 relevant hashtags as an array of strings, each starting with #, no spaces"]
}`;

/** Simple local fallback if Groq is unreachable, so the app still works end-to-end. */
function localFallbackAnalysis() {
  return {
    mood: "calm",
    imageKeyword: "peaceful mountain landscape",
    caption: "A little wisdom to carry with you today.",
    hashtags: ["#inspiration", "#motivation", "#quoteoftheday"],
  };
}

async function analyzeQuote(quote, author) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("[aiService] GROQ_API_KEY not set, using local fallback analysis");
    return localFallbackAnalysis();
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Quote: "${quote}"\nAuthor: ${author}` },
        ],
      }),
      timeout: 10000,
    });

    if (!res.ok) throw new Error(`Groq responded ${res.status}`);
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty Groq response");

    const parsed = JSON.parse(raw);
    return {
      mood: parsed.mood || "calm",
      imageKeyword: parsed.imageKeyword || "peaceful landscape",
      caption: parsed.caption || "A little wisdom to carry with you today.",
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.slice(0, 6) : ["#inspiration"],
    };
  } catch (err) {
    console.error("[aiService] Groq analysis failed, using local fallback:", err.message);
    return localFallbackAnalysis();
  }
}

module.exports = { analyzeQuote };
