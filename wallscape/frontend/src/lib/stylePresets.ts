import type { StylePresetId } from "../types";

export interface StylePreset {
  id: StylePresetId;
  label: string;
  cssFontClass: string;
  /** Font family exactly as loaded via Google Fonts, used for canvas fillText. */
  canvasFontFamily: string;
  align: "left" | "center";
}

export const STYLE_PRESETS: StylePreset[] = [
  { id: "elegant", label: "Elegant Serif", cssFontClass: "preset-font-elegant", canvasFontFamily: "Playfair Display", align: "center" },
  { id: "modern", label: "Bold Modern", cssFontClass: "preset-font-modern", canvasFontFamily: "Space Grotesk", align: "left" },
  { id: "minimal", label: "Minimal Sans", cssFontClass: "preset-font-minimal", canvasFontFamily: "Inter", align: "left" },
  { id: "handwritten", label: "Handwritten", cssFontClass: "preset-font-handwritten", canvasFontFamily: "Caveat", align: "center" },
];

export function getStylePreset(id: StylePresetId): StylePreset {
  return STYLE_PRESETS.find((p) => p.id === id) ?? STYLE_PRESETS[0];
}
