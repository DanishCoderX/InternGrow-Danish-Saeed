import type { HistoryEntry } from "../types";

const STORAGE_KEY = "wallscape:history:v1";

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addHistoryEntry(entries: HistoryEntry[], entry: Omit<HistoryEntry, "id" | "timestamp" | "isFavorite">): HistoryEntry[] {
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    isFavorite: false,
  };
  const next = [newEntry, ...entries];
  saveHistory(next);
  return next;
}

export function toggleFavorite(entries: HistoryEntry[], id: string): HistoryEntry[] {
  const next = entries.map((e) => (e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
  saveHistory(next);
  return next;
}

export function deleteHistoryEntry(entries: HistoryEntry[], id: string): HistoryEntry[] {
  const next = entries.filter((e) => e.id !== id);
  saveHistory(next);
  return next;
}
