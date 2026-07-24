import type { HistoryEntry } from "../types";
import { accentForMood } from "../lib/moodTheme";

interface HistoryFilmstripProps {
  entries: HistoryEntry[];
  view: "history" | "favorites";
  onViewChange: (v: "history" | "favorites") => void;
  onSelect: (entry: HistoryEntry) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HistoryFilmstrip({ entries, view, onViewChange, onSelect, onToggleFavorite, onDelete }: HistoryFilmstripProps) {
  const shown = view === "favorites" ? entries.filter((e) => e.isFavorite) : entries;

  return (
    <div className="bg-surface border border-hairline rounded-xl p-4 sm:p-5">
      <div className="flex gap-1 mb-4">
        {(["history", "favorites"] as const).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`flex-1 font-mono text-xs uppercase tracking-wide py-2 rounded-lg transition-colors capitalize ${
              view === v ? "bg-[var(--mood-accent)] text-void font-semibold" : "text-ink-soft hover:bg-surface-raised"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="font-body text-sm text-ink-soft text-center py-8">
          {view === "favorites" ? "No favorites yet — star a wallpaper to save it here." : "No wallpapers generated yet."}
        </p>
      ) : (
        <div className="film-strip py-2 px-1 overflow-x-auto">
          <div className="flex gap-3 pl-3">
            {shown.map((entry) => {
              const accent = accentForMood(entry.mood);
              const thumbStyle =
                entry.background.type === "photo" && entry.background.url
                  ? { backgroundImage: `url(${entry.background.url})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { background: `linear-gradient(135deg, ${entry.background.from}, ${entry.background.to})` };

              return (
                <div key={entry.id} className="shrink-0 w-32">
                  <button
                    onClick={() => onSelect(entry)}
                    className="w-32 h-20 rounded-lg border border-hairline relative overflow-hidden block"
                    style={thumbStyle}
                  >
                    <span
                      className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: accent }}
                      title={entry.mood}
                    />
                  </button>
                  <p className="text-[10px] text-ink-soft truncate mt-1">{entry.author}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <button
                      onClick={() => onToggleFavorite(entry.id)}
                      className={`text-xs ${entry.isFavorite ? "text-[var(--mood-accent)]" : "text-ink-soft"}`}
                      aria-label="Toggle favorite"
                    >
                      {entry.isFavorite ? "★" : "☆"}
                    </button>
                    <button onClick={() => onDelete(entry.id)} className="text-[10px] text-ink-soft hover:text-red-400" aria-label="Delete">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
