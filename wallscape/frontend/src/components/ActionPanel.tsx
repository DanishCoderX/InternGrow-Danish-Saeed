import { useState } from "react";
import type { Analysis } from "../types";

interface ActionPanelProps {
  analysis: Analysis | null;
  disabled: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSave: () => void;
  onShare: () => void;
  canShare: boolean;
}

export default function ActionPanel({
  analysis,
  disabled,
  isFavorite,
  onToggleFavorite,
  onSave,
  onShare,
  canShare,
}: ActionPanelProps) {
  const [copied, setCopied] = useState(false);

  function handleCopyCaption() {
    if (!analysis) return;
    const text = `${analysis.caption}\n\n${analysis.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="bg-surface border border-hairline rounded-xl p-4 sm:p-5 space-y-4">
      {analysis && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">AI Caption</span>
            <button
              onClick={handleCopyCaption}
              className="font-mono text-[10px] uppercase tracking-wide text-[var(--mood-accent)] hover:opacity-80"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-sm text-paper-mist">{analysis.caption}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {analysis.hashtags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] text-[var(--mood-accent)] bg-[var(--mood-accent-soft)] px-2 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={disabled}
          className="flex-1 bg-[var(--mood-accent)] text-void font-semibold text-sm py-3 rounded-lg disabled:opacity-40 transition-opacity"
        >
          Save Wallpaper
        </button>
        {canShare && (
          <button
            onClick={onShare}
            disabled={disabled}
            className="px-4 border border-hairline rounded-lg text-paper-mist hover:border-[var(--mood-accent)] disabled:opacity-40 transition-colors"
            aria-label="Share"
            title="Share"
          >
            ↗
          </button>
        )}
        <button
          onClick={onToggleFavorite}
          disabled={disabled}
          className={`px-4 border rounded-lg transition-colors disabled:opacity-40 ${
            isFavorite ? "border-[var(--mood-accent)] text-[var(--mood-accent)]" : "border-hairline text-paper-mist hover:border-[var(--mood-accent)]"
          }`}
          aria-label="Toggle favorite"
          title="Toggle favorite"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
