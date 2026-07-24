import { useEffect, useRef, useState } from "react";
import type { Quote, Analysis, Background, HistoryEntry, QuoteMode, StylePresetId, ExportSizeId } from "./types";
import { fetchRandomQuote, fetchQuoteByMood, fetchQuoteOfDay, fetchMoodOptions, analyzeQuote, fetchWallpaper } from "./lib/api";
import { loadHistory, addHistoryEntry, toggleFavorite, deleteHistoryEntry } from "./lib/storage";
import { accentForMood } from "./lib/moodTheme";
import { getStylePreset } from "./lib/stylePresets";
import { getExportSize } from "./lib/exportSizes";
import { composeWallpaper, canvasToBlob } from "./lib/canvasCompositor";

import QuoteOfDayBanner from "./components/QuoteOfDayBanner";
import QuoteControls from "./components/QuoteControls";
import PosterPreview from "./components/PosterPreview";
import StyleControls from "./components/StyleControls";
import ActionPanel from "./components/ActionPanel";
import HistoryFilmstrip from "./components/HistoryFilmstrip";

const canShareFiles = typeof navigator !== "undefined" && typeof navigator.canShare === "function";

function App() {
  const [mode, setMode] = useState<QuoteMode>("random");
  const [moods, setMoods] = useState<string[]>(["calm", "motivation", "love", "success", "adventure"]);
  const [quoteOfDay, setQuoteOfDay] = useState<Quote | null>(null);

  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [background, setBackground] = useState<Background | null>(null);

  const [stylePresetId, setStylePresetId] = useState<StylePresetId>("elegant");
  const [exportSizeId, setExportSizeId] = useState<ExportSizeId>("phone");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [historyView, setHistoryView] = useState<"history" | "favorites">("history");
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  async function runGeneration(getQuote: () => Promise<Quote>) {
    setLoading(true);
    setError(null);
    try {
      const quote = await getQuote();
      setCurrentQuote(quote);
      setAnalysis(null);
      setBackground(null);

      const analysisResult = await analyzeQuote(quote.content, quote.author);
      setAnalysis(analysisResult);

      const bg = await fetchWallpaper(analysisResult.imageKeyword, analysisResult.mood);
      setBackground(bg);

      setHistory((prev) => {
        const next = addHistoryEntry(prev, {
          quote: quote.content,
          author: quote.author,
          mood: analysisResult.mood,
          caption: analysisResult.caption,
          hashtags: analysisResult.hashtags,
          background: bg,
          stylePresetId,
          exportSizeId,
        });
        setCurrentEntryId(next[0].id);
        return next;
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong generating your wallpaper. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleRandom() {
    runGeneration(fetchRandomQuote);
  }
  function handleMoodSelect(mood: string) {
    runGeneration(() => fetchQuoteByMood(mood));
  }
  function handleCustomSubmit(text: string, author: string) {
    runGeneration(() => Promise.resolve({ content: text, author: author || "Unknown" }));
  }
  function handleUseQuoteOfDay() {
    if (quoteOfDay) runGeneration(() => Promise.resolve(quoteOfDay));
  }

  function handleSelectHistoryEntry(entry: HistoryEntry) {
    setCurrentQuote({ content: entry.quote, author: entry.author });
    setAnalysis({ mood: entry.mood, imageKeyword: "", caption: entry.caption, hashtags: entry.hashtags });
    setBackground(entry.background);
    setStylePresetId(entry.stylePresetId);
    setExportSizeId(entry.exportSizeId);
    setCurrentEntryId(entry.id);
  }

  function handleDeleteEntry(id: string) {
    setHistory((prev) => deleteHistoryEntry(prev, id));
    if (currentEntryId === id) setCurrentEntryId(null);
  }

  function handleToggleFavoriteCurrent() {
    if (!currentEntryId) return;
    setHistory((prev) => toggleFavorite(prev, currentEntryId));
  }

  async function handleSave() {
    if (!canvasRef.current) return;
    try {
      const blob = await canvasToBlob(canvasRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wallscape-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Wallpaper saved to your downloads");
    } catch (err) {
      console.error(err);
      showToast("Couldn't save the wallpaper — try again");
    }
  }

  async function handleShare() {
    if (!canvasRef.current) return;
    try {
      const blob = await canvasToBlob(canvasRef.current);
      const file = new File([blob], "wallscape.png", { type: "image/png" });
      if (canShareFiles && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "My Wallscape wallpaper", text: analysis?.caption });
      } else {
        handleSave();
      }
    } catch {
      // Share was cancelled or unsupported — no toast needed, this isn't an error state.
    }
  }

  // Initial load: Quote of the Day, mood options, and a first random wallpaper.
  useEffect(() => {
    fetchQuoteOfDay().then(setQuoteOfDay).catch(() => {});
    fetchMoodOptions()
      .then((r) => setMoods(r.moods))
      .catch(() => {});
    runGeneration(fetchRandomQuote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recompose the canvas whenever the quote, background, or style/size changes.
  useEffect(() => {
    if (!currentQuote || !analysis || !background || !canvasRef.current) return;
    let cancelled = false;
    const size = getExportSize(exportSizeId);
    const preset = getStylePreset(stylePresetId);
    composeWallpaper(canvasRef.current, {
      background,
      quote: currentQuote.content,
      author: currentQuote.author,
      width: size.width,
      height: size.height,
      fontFamily: preset.canvasFontFamily,
      align: preset.align,
    }).catch((err) => {
      if (!cancelled) console.error("Compose failed:", err);
    });
    return () => {
      cancelled = true;
    };
  }, [currentQuote, analysis, background, stylePresetId, exportSizeId]);

  const accent = accentForMood(analysis?.mood);
  const aspectRatio = (() => {
    const s = getExportSize(exportSizeId);
    return s.width / s.height;
  })();
  const isFavoriteCurrent = history.find((e) => e.id === currentEntryId)?.isFavorite ?? false;
  const hasContent = !!(currentQuote && analysis && background);

  return (
    <div
      className="min-h-screen pb-16"
      style={{ ["--mood-accent" as string]: accent, ["--mood-accent-soft" as string]: `${accent}26` } as React.CSSProperties}
    >
      <header className="px-4 sm:px-8 lg:px-12 pt-8 pb-4 max-w-6xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1">AI Quote &amp; Wallpaper Generator</p>
        <h1 className="text-3xl font-bold text-paper-mist" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Wallscape
        </h1>
      </header>

      <main className="px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="mb-5">
          <QuoteOfDayBanner quote={quoteOfDay} onUse={handleUseQuoteOfDay} loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,440px)_1fr] gap-6 lg:gap-10 items-start">
          {/* Left column: live preview, sticky on desktop so it stays visible while scrolling controls */}
          <div className="lg:sticky lg:top-8">
            <PosterPreview ref={canvasRef} loading={loading} hasContent={hasContent} aspectRatio={aspectRatio} background={background} />
          </div>

          {/* Right column: all controls, stacked */}
          <div className="space-y-5 min-w-0">
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <QuoteControls
              mode={mode}
              onModeChange={setMode}
              moods={moods}
              loading={loading}
              onRandom={handleRandom}
              onCustomSubmit={handleCustomSubmit}
              onMoodSelect={handleMoodSelect}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <StyleControls
                stylePresetId={stylePresetId}
                onStyleChange={setStylePresetId}
                exportSizeId={exportSizeId}
                onExportSizeChange={setExportSizeId}
              />

              <ActionPanel
                analysis={analysis}
                disabled={!hasContent || loading}
                isFavorite={isFavoriteCurrent}
                onToggleFavorite={handleToggleFavoriteCurrent}
                onSave={handleSave}
                onShare={handleShare}
                canShare={canShareFiles}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <HistoryFilmstrip
            entries={history}
            view={historyView}
            onViewChange={setHistoryView}
            onSelect={handleSelectHistoryEntry}
            onToggleFavorite={(id) => setHistory((prev) => toggleFavorite(prev, id))}
            onDelete={handleDeleteEntry}
          />
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface-raised border border-hairline text-paper-mist font-mono text-xs uppercase tracking-wide px-4 py-2.5 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;