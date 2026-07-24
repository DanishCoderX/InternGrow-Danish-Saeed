import { useMemo, useState } from "react";
import type { Flashcard } from "../types";

interface StudyDeckProps {
  cards: Flashcard[];
  onFinishRound: (correct: number, total: number) => void;
}

export default function StudyDeck({ cards, onFinishRound }: StudyDeckProps) {
  const topics = useMemo(() => {
    const set = new Set(cards.map((c) => c.topic));
    return ["All", ...Array.from(set)];
  }, [cards]);

  const [topicFilter, setTopicFilter] = useState("All");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [marked, setMarked] = useState<Record<string, "correct" | "wrong">>({});

  const deck = useMemo(
    () => (topicFilter === "All" ? cards : cards.filter((c) => c.topic === topicFilter)),
    [cards, topicFilter]
  );

  const card = deck[index];
  const roundDone = deck.length > 0 && Object.keys(marked).length === deck.length;

  function goTo(newIndex: number) {
    setFlipped(false);
    setIndex(Math.max(0, Math.min(deck.length - 1, newIndex)));
  }

  function switchTopic(t: string) {
    setTopicFilter(t);
    setIndex(0);
    setFlipped(false);
    setMarked({});
  }

  function mark(result: "correct" | "wrong") {
    if (!card) return;
    setMarked((m) => ({ ...m, [card.id]: result }));
    if (index < deck.length - 1) {
      setTimeout(() => goTo(index + 1), 200);
    }
  }

  function finishAndRecord() {
    const correct = Object.values(marked).filter((v) => v === "correct").length;
    onFinishRound(correct, deck.length);
    setMarked({});
    setIndex(0);
    setFlipped(false);
  }

  if (deck.length === 0) {
    return (
      <div className="px-4 sm:px-8 py-16 text-center">
        <p className="font-display text-2xl text-ink-soft">No cards in this drawer yet.</p>
        <p className="font-body text-sm text-ink-soft mt-2">Add some from Manage Cards to start studying.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-8 max-w-2xl mx-auto">
      {/* Topic tabs — catalog drawer labels */}
      <div className="flex flex-wrap gap-2 mb-8">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => switchTopic(t)}
            className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm border transition-colors
              ${t === topicFilter
                ? "bg-ink text-paper border-ink"
                : "bg-transparent text-ink-soft border-rule hover:border-ink"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-4 font-mono text-xs text-ink-soft uppercase tracking-wide">
        <span>Card {index + 1} of {deck.length}</span>
        <span>{Object.keys(marked).length} answered</span>
      </div>

      {/* Flip card */}
      <div className="flip-scene h-72 sm:h-80 mb-6">
        <div
          className={`flip-card w-full h-full cursor-pointer ${flipped ? "is-flipped" : ""}`}
          onClick={() => setFlipped((f) => !f)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
          aria-label="Flip card to reveal answer"
        >
          {/* Front */}
          <div className="flip-face ruled-card absolute inset-0 bg-paper border border-rule rounded-sm shadow-[4px_4px_0_var(--color-rule),8px_8px_0_var(--color-paper-dark)] p-6 sm:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-teal-dark bg-teal/10 px-2 py-1 rounded-sm">
                {card.topic}
              </span>
              <span className="font-mono text-[10px] text-ink-soft">Question</span>
            </div>
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="font-display text-xl sm:text-2xl leading-snug text-ink">{card.question}</p>
            </div>
            <p className="font-mono text-[10px] text-ink-soft text-center mt-4">Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div className="flip-face flip-face-back ruled-card absolute inset-0 bg-paper-dark border border-rule rounded-sm shadow-[4px_4px_0_var(--color-rule)] p-6 sm:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-coral-dark bg-coral/10 px-2 py-1 rounded-sm">
                {card.topic}
              </span>
              <span className="font-mono text-[10px] text-ink-soft">Answer</span>
            </div>
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="font-body text-base sm:text-lg leading-relaxed text-ink">{card.answer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Self-grade controls, only after flip */}
      {flipped && !marked[card.id] && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => mark("wrong")}
            className="flex-1 py-2.5 font-mono text-xs uppercase tracking-wide border border-ink/20 text-ink-soft hover:border-coral hover:text-coral-dark rounded-sm transition-colors"
          >
            Missed it
          </button>
          <button
            onClick={() => mark("correct")}
            className="flex-1 py-2.5 font-mono text-xs uppercase tracking-wide bg-teal text-paper hover:bg-teal-dark rounded-sm transition-colors"
          >
            Got it
          </button>
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="font-mono text-xs uppercase tracking-wide text-ink-soft disabled:opacity-30 hover:text-ink transition-colors"
        >
          ← Previous
        </button>
        {roundDone ? (
          <button
            onClick={finishAndRecord}
            className="font-mono text-xs uppercase tracking-wide bg-coral text-paper px-4 py-2 rounded-sm hover:bg-coral-dark transition-colors"
          >
            Log Round to Ledger
          </button>
        ) : (
          <button
            onClick={() => goTo(index + 1)}
            disabled={index === deck.length - 1}
            className="font-mono text-xs uppercase tracking-wide text-ink-soft disabled:opacity-30 hover:text-ink transition-colors"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
