export interface Quote {
  content: string;
  author: string;
  source?: string;
  date?: string;
}

export interface Analysis {
  mood: string;
  imageKeyword: string;
  caption: string;
  hashtags: string[];
}

export interface Background {
  type: "photo" | "gradient";
  url?: string;
  from?: string;
  to?: string;
  photographer?: string | null;
  photographerUrl?: string | null;
  unsplashLink?: string | null;
}

export type StylePresetId = "elegant" | "modern" | "minimal" | "handwritten";
export type ExportSizeId = "phone" | "desktop" | "ig-square" | "ig-story";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  quote: string;
  author: string;
  mood: string;
  caption: string;
  hashtags: string[];
  background: Background;
  stylePresetId: StylePresetId;
  exportSizeId: ExportSizeId;
  isFavorite: boolean;
}

export type QuoteMode = "random" | "custom" | "mood";
