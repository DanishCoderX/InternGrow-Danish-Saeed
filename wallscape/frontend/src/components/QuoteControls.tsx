import { useState } from "react";
import type { QuoteMode } from "../types";

interface QuoteControlsProps {
  mode: QuoteMode;
  onModeChange: (mode: QuoteMode) => void;
  moods: string[];
  loading: boolean;
  onRandom: () => void;
  onCustomSubmit: (text: string, author: string) => void;
  onMoodSelect: (mood: string) => void;
}

const MODE_LABELS: { id: QuoteMode; label: string }[] = [
  { id: "random", label: "Random" },
  { id: "custom", label: "Custom" },
  { id: "mood", label: "Mood" },
];

export default function QuoteControls({
  mode,
  onModeChange,
  moods,
  loading,
  onRandom,
  onCustomSubmit,
  onMoodSelect,
}: QuoteControlsProps) {
  const [customText, setCustomText] = useState("");
  const [customAuthor, setCustomAuthor] = useState("");

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customText.trim()) return;
    onCustomSubmit(customText.trim(), customAuthor.trim());
  }

  return (
    <div className="bg-surface border border-hairline rounded-xl p-4 sm:p-5">
      <div className="flex gap-1 mb-4">
        {MODE_LABELS.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`flex-1 font-mono text-xs uppercase tracking-wide py-2 rounded-lg transition-colors ${
              mode === m.id ? "bg-[var(--mood-accent)] text-void font-semibold" : "text-ink-soft hover:bg-surface-raised"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "random" && (
        <button
          onClick={onRandom}
          disabled={loading}
          className="w-full bg-[var(--mood-accent)] text-void font-semibold text-sm py-3 rounded-lg disabled:opacity-50 transition-opacity"
        >
          {loading ? "Generating…" : "Generate Random Quote"}
        </button>
      )}

      {mode === "custom" && (
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type your own quote or line..."
            rows={3}
            className="w-full bg-void border border-hairline rounded-lg px-3 py-2 text-sm text-paper-mist placeholder:text-ink-soft/60 focus:border-[var(--mood-accent)] outline-none resize-none"
          />
          <input
            value={customAuthor}
            onChange={(e) => setCustomAuthor(e.target.value)}
            placeholder="Author (optional)"
            className="w-full bg-void border border-hairline rounded-lg px-3 py-2 text-sm text-paper-mist placeholder:text-ink-soft/60 focus:border-[var(--mood-accent)] outline-none"
          />
          <button
            type="submit"
            disabled={loading || !customText.trim()}
            className="w-full bg-[var(--mood-accent)] text-void font-semibold text-sm py-3 rounded-lg disabled:opacity-50 transition-opacity"
          >
            {loading ? "Generating…" : "Generate From My Quote"}
          </button>
        </form>
      )}

      {mode === "mood" && (
        <div className="grid grid-cols-2 gap-2">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => onMoodSelect(m)}
              disabled={loading}
              className="capitalize bg-void border border-hairline rounded-lg py-2.5 text-sm text-paper-mist hover:border-[var(--mood-accent)] disabled:opacity-50 transition-colors"
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
