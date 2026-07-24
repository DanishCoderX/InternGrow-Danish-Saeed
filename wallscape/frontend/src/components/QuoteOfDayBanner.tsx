import type { Quote } from "../types";

interface QuoteOfDayBannerProps {
  quote: Quote | null;
  onUse: () => void;
  loading: boolean;
}

export default function QuoteOfDayBanner({ quote, onUse, loading }: QuoteOfDayBannerProps) {
  if (!quote) return null;

  return (
    <div className="bg-surface-raised border border-hairline rounded-xl px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--mood-accent)]">Quote of the Day</span>
        <p className="text-sm text-paper-mist truncate mt-0.5">
          "{quote.content}" <span className="text-ink-soft">— {quote.author}</span>
        </p>
      </div>
      <button
        onClick={onUse}
        disabled={loading}
        className="shrink-0 font-mono text-[10px] uppercase tracking-wide border border-hairline rounded-lg px-3 py-2 text-paper-mist hover:border-[var(--mood-accent)] disabled:opacity-50 transition-colors"
      >
        Use This
      </button>
    </div>
  );
}
