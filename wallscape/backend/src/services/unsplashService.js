const fetch = require("node-fetch");

const SEARCH_URL = "https://api.unsplash.com/search/photos";

// A curated fallback list of Unsplash search terms mapped to CSS gradients,
// used only if the Unsplash API call fails entirely (no key set, rate-limited, network issue).
// Keeps the wallpaper generator visually working even with zero external dependencies.
const FALLBACK_GRADIENTS = {
  calm: ["#4f7c8c", "#a8d0d9"],
  determined: ["#7c2d3a", "#c96a4f"],
  hopeful: ["#f2a65a", "#f7dba7"],
  joyful: ["#f4a300", "#ffd97d"],
  peaceful: ["#4a6670", "#94b49f"],
  bold: ["#1b1b3a", "#7952b3"],
  default: ["#3a3d5c", "#8087a3"],
};

function fallbackBackground(mood) {
  const key = Object.keys(FALLBACK_GRADIENTS).find((k) => mood?.toLowerCase().includes(k)) || "default";
  const [from, to] = FALLBACK_GRADIENTS[key];
  return {
    type: "gradient",
    from,
    to,
    photographer: null,
    photographerUrl: null,
    unsplashLink: null,
  };
}

/** Searches Unsplash for a photo matching `query`; falls back to a CSS gradient if unavailable. */
async function searchWallpaper(query, mood) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn("[unsplashService] UNSPLASH_ACCESS_KEY not set, using gradient fallback");
    return fallbackBackground(mood);
  }

  try {
    const url = `${SEARCH_URL}?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      timeout: 8000,
    });
    if (!res.ok) throw new Error(`Unsplash responded ${res.status}`);
    const data = await res.json();
    const photo = data?.results?.[0];
    if (!photo) throw new Error("No Unsplash results for query");

    // Unsplash API guidelines require pinging the download endpoint whenever
    // a photo is used/downloaded by the app — fire-and-forget, don't block the response.
    if (photo.links?.download_location) {
      fetch(`${photo.links.download_location}&client_id=${accessKey}`).catch(() => {});
    }

    return {
      type: "photo",
      url: photo.urls.regular,
      photographer: photo.user?.name || "Unknown",
      photographerUrl: photo.user?.links?.html || null,
      unsplashLink: photo.links?.html || null,
    };
  } catch (err) {
    console.error("[unsplashService] Unsplash search failed, using gradient fallback:", err.message);
    return fallbackBackground(mood);
  }
}

module.exports = { searchWallpaper };
