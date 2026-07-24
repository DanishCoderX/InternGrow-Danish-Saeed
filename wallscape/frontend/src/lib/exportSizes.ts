import type { ExportSizeId } from "../types";

export interface ExportSize {
  id: ExportSizeId;
  label: string;
  width: number;
  height: number;
}

export const EXPORT_SIZES: ExportSize[] = [
  { id: "phone", label: "Phone Wallpaper", width: 1080, height: 1920 },
  { id: "desktop", label: "Desktop Wallpaper", width: 1920, height: 1080 },
  { id: "ig-square", label: "Instagram Post", width: 1080, height: 1080 },
  { id: "ig-story", label: "Instagram Story", width: 1080, height: 1920 },
];

export function getExportSize(id: ExportSizeId): ExportSize {
  return EXPORT_SIZES.find((s) => s.id === id) ?? EXPORT_SIZES[0];
}
