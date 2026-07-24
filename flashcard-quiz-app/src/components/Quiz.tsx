import { useState } from "react";
import type { Flashcard } from "../types";
import { pickRandomQuizCards, generateOptions } from "../storage";

interface QuizProps {
  cards: Flashcard[];
  onFinishQuiz: (correct: number, total: number) => void;
}

const QUIZ_SIZE = 20;

type Phase = "intro" | "in-progress" | "results";

interface QuizQuestion {
  card: Flashcard;
  options: string[];
}

interface GradedAnswer {
  card: Flashcard;
  selected: string;
  correct: boolean;
}

export default function Quiz({ cards, onFinishQuiz }: QuizProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<GradedAnswer[]>([]);

  const availableCount = cards.length;
  const questionCount = Math.min(QUIZ_SIZE, availableCount);

  function startQuiz() {
    const picked = pickRandomQuizCards(cards, QUIZ_SIZE);
    const built = picked.map((card) => ({ card, options: generateOptions(card, cards, 4) }));
    setQuestions(built);
    setIndex(0);
    setSelected(null);
    setResults([]);
    setPhase("in-progress");
  }

  const current = questions[index];

  function chooseOption(option: string) {
    if (selected) return; // already answered this question
    const correct = option === current.card.answer;
    setSelected(option);
    setResults((r) => [...r, { card: current.card, selected: option, correct }]);
  }

  function nextQuestion() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      const finalCorrect = results.reduce((acc, r) => acc + (r.correct ? 1 : 0), 0);
      onFinishQuiz(finalCorrect, questions.length);
      setPhase("results");
    }
  }

  const score = results.filter((r) => r.correct).length;

  if (phase === "intro") {
    return (
      <div className="px-4 sm:px-8 py-8 max-w-2xl mx-auto">
        <h2 className="font-display text-2xl mb-1">Take a Quiz</h2>
        <p className="font-mono text-xs text-ink-soft uppercase tracking-wide mb-8">
          Multiple choice — pick the best answer
        </p>

        {availableCount === 0 ? (
          <p className="font-body text-sm text-ink-soft py-6 text-center">
            No cards in the catalog yet — add some from Manage Cards first.
          </p>
        ) : (
          <div className="bg-paper border border-rule rounded-sm p-6 shadow-[3px_3px_0_var(--color-rule)] text-center">
            <p className="font-display text-xl mb-2">
              {questionCount} random question{questionCount === 1 ? "" : "s"}
            </p>
            <p className="font-body text-sm text-ink-soft mb-6">
              {availableCount < QUIZ_SIZE
                ? `You have ${availableCount} card${availableCount === 1 ? "" : "s"} total, so this round uses all of them.`
                : `Pulled at random from your full catalog of ${availableCount} cards. You'll be scored out of ${QUIZ_SIZE}.`}
            </p>
            <button
              onClick={startQuiz}
              className="font-mono text-xs uppercase tracking-wide bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-ink/80 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === "results") {
    const total = questions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="px-4 sm:px-8 py-8 max-w-2xl mx-auto">
        <h2 className="font-display text-2xl mb-1">Quiz Results</h2>
        <p className="font-mono text-xs text-ink-soft uppercase tracking-wide mb-6">Logged to your Ledger</p>

        <div className="bg-paper border border-rule rounded-sm p-6 shadow-[3px_3px_0_var(--color-rule)] text-center mb-8">
          <span className="font-display text-5xl text-ink">{score}</span>
          <span className="font-mono text-sm text-ink-soft"> / {total}</span>
          <p className="font-mono text-xs text-ink-soft uppercase tracking-wide mt-2">{pct}% correct</p>
        </div>

        <h3 className="font-display text-lg mb-3">Review</h3>
        <div className="space-y-2 mb-8">
          {results.map((r, i) => (
            <div
              key={r.card.id + i}
              className={`border rounded-sm px-4 py-3 ${
                r.correct ? "border-teal/40 bg-teal/5" : "border-coral/40 bg-coral/5"
              }`}
            >
              <p className="font-body text-sm text-ink mb-1">{r.card.question}</p>
              <p className="font-mono text-[11px] text-ink-soft">
                You picked: <span className={r.correct ? "text-teal-dark" : "text-coral-dark"}>{r.selected}</span>
              </p>
              {!r.correct && (
                <p className="font-mono text-[11px] text-ink-soft">Correct answer: <span className="text-ink">{r.card.answer}</span></p>
              )}
              {r.card.explanation && (
                <p className="font-body text-xs text-ink-soft mt-1.5">{r.card.explanation}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase("intro")}
          className="font-mono text-xs uppercase tracking-wide bg-ink text-paper px-4 py-2.5 rounded-sm hover:bg-ink/80 transition-colors"
        >
          Take Another Quiz
        </button>
      </div>
    );
  }

  // in-progress
  if (!current) return null;

  return (
    <div className="px-4 sm:px-8 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 font-mono text-xs text-ink-soft uppercase tracking-wide">
        <span>Question {index + 1} of {questions.length}</span>
        <span>Score so far: {score}</span>
      </div>

      <div className="bg-paper border border-rule rounded-sm p-6 sm:p-8 shadow-[4px_4px_0_var(--color-rule),8px_8px_0_var(--color-paper-dark)] mb-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-teal-dark bg-teal/10 px-2 py-1 rounded-sm">
          {current.card.topic}
        </span>
        <p className="font-display text-xl sm:text-2xl leading-snug text-ink mt-4">{current.card.question}</p>
      </div>

      <div className="space-y-3 mb-6">
        {current.options.map((option, i) => {
          const isSelected = selected === option;
          const isCorrectOption = option === current.card.answer;
          const showState = selected !== null;

          let stateClasses = "border-rule hover:border-ink/40 bg-white/40";
          if (showState && isCorrectOption) {
            stateClasses = "border-teal bg-teal/10";
          } else if (showState && isSelected && !isCorrectOption) {
            stateClasses = "border-coral bg-coral/10";
          }

          return (
            <button
              key={i}
              onClick={() => chooseOption(option)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-3 border rounded-sm font-body text-sm text-ink transition-colors disabled:cursor-default ${stateClasses}`}
            >
              <span className="font-mono text-xs text-ink-soft mr-2">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div>
          <div
            className={`rounded-sm px-4 py-3 mb-4 font-mono text-xs uppercase tracking-wide ${
              selected === current.card.answer ? "bg-teal/10 text-teal-dark" : "bg-coral/10 text-coral-dark"
            }`}
          >
            {selected === current.card.answer ? "Correct!" : `Not quite — correct answer: ${current.card.answer}`}
          </div>
          {current.card.explanation && (
            <p className="font-body text-sm text-ink-soft mb-4">{current.card.explanation}</p>
          )}
          <button
            type="button"
            onClick={nextQuestion}
            className="w-full font-mono text-xs uppercase tracking-wide bg-coral text-paper py-3 rounded-sm hover:bg-coral-dark transition-colors"
          >
            {index < questions.length - 1 ? "Next Question →" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}
