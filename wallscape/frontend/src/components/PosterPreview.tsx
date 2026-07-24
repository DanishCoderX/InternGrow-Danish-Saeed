import { forwardRef } from "react";
import type { Background } from "../types";

interface PosterPreviewProps {
  loading: boolean;
  hasContent: boolean;
  aspectRatio: number; // width / height
  background: Background | null;
}

const PosterPreview = forwardRef<HTMLCanvasElement, PosterPreviewProps>(
  ({ loading, hasContent, aspectRatio, background }, ref) => {
    return (
      <div className="relative">
        <div
          className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-hairline bg-surface shadow-[0_0_60px_-15px_var(--mood-accent-soft)]"
          style={{ aspectRatio }}
        >
          <canvas ref={ref} className="w-full h-full object-cover" />

          {(loading || !hasContent) && (
            <div className="absolute inset-0 flex items-center justify-center bg-void/70 backdrop-blur-sm">
              <p className="font-mono text-xs text-ink-soft uppercase tracking-wide text-center px-6">
                {loading ? "Composing your wallpaper…" : "Generate a quote to preview it here"}
              </p>
            </div>
          )}
        </div>

        {background?.type === "photo" && background.photographer && (
          <p className="text-center font-mono text-[10px] text-ink-soft mt-2">
            Photo by{" "}
            {background.photographerUrl ? (
              <a href={background.photographerUrl} target="_blank" rel="noreferrer" className="underline hover:text-[var(--mood-accent)]">
                {background.photographer}
              </a>
            ) : (
              background.photographer
            )}{" "}
            on{" "}
            {background.unsplashLink ? (
              <a href={background.unsplashLink} target="_blank" rel="noreferrer" className="underline hover:text-[var(--mood-accent)]">
                Unsplash
              </a>
            ) : (
              "Unsplash"
            )}
          </p>
        )}
      </div>
    );
  }
);

PosterPreview.displayName = "PosterPreview";
export default PosterPreview;
