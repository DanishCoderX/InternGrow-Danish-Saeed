// Mirrors the gradient keys in the backend's unsplashService fallback, so the
// UI accent and the fallback wallpaper gradient always agree on a mood's color.
export const MOOD_ACCENTS: Record<string, string> = {
  calm: "#5EC8C0",
  determined: "#E15252",
  hopeful: "#F2B84B",
  joyful: "#F2B84B",
  peaceful: "#8FBF9F",
  bold: "#8B5CF6",
  default: "#D9A441",
};

export function accentForMood(mood: string | undefined): string {
  if (!mood) return MOOD_ACCENTS.default;
  const lower = mood.toLowerCase();
  const key = Object.keys(MOOD_ACCENTS).find((k) => lower.includes(k));
  return key ? MOOD_ACCENTS[key] : MOOD_ACCENTS.default;
}
