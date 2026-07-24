import type { StudyData } from "../types";
import { last7DaysAttempts, isStreakAtRisk } from "../storage";

interface DashboardProps {
  data: StudyData;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function Dashboard({ data }: DashboardProps) {
  const week = last7DaysAttempts(data);
  const atRisk = isStreakAtRisk(data);
  const maxTotal = Math.max(1, ...week.map((w) => w.total));

  const totalCorrect = week.reduce((s, w) => s + w.correct, 0);
  const totalAnswered = week.reduce((s, w) => s + w.total, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="px-4 sm:px-8 py-8 max-w-3xl mx-auto">
      <h2 className="font-display text-2xl mb-1">The Ledger</h2>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide mb-8">
        Weekly scores, study streak &amp; quiz history
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {/* Streak — punch card style */}
        <div className="bg-paper border border-rule rounded-sm p-5 shadow-[3px_3px_0_var(--color-rule)]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Study Streak</span>
            {atRisk && data.streak.current > 0 && (
              <span className="font-mono text-[9px] uppercase tracking-wide text-coral-dark bg-coral/10 px-1.5 py-0.5 rounded-sm">
                Study today to keep it
              </span>
            )}
          </div>
          <div className="flex items-end gap-2 mb-4">
            <span className="font-display text-5xl text-ink">{data.streak.current}</span>
            <span className="font-mono text-xs text-ink-soft mb-1.5">day{data.streak.current === 1 ? "" : "s"}</span>
          </div>
          {/* Punch card dots representing last 7 days */}
          <div className="flex gap-1.5">
            {week.map((w, i) => (
              <div
                key={w.date}
                className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[9px]
                  ${w.total > 0 ? "bg-teal border-teal-dark text-paper" : "border-rule text-ink-soft/40"}`}
                title={w.date}
              >
                {DAY_LABELS[i]}
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-ink-soft mt-3">
            Longest streak: {data.streak.longest} day{data.streak.longest === 1 ? "" : "s"}
          </p>
        </div>

        {/* Accuracy summary */}
        <div className="bg-paper border border-rule rounded-sm p-5 shadow-[3px_3px_0_var(--color-rule)]">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">7-Day Accuracy</span>
          <div className="flex items-end gap-2 mt-4 mb-4">
            <span className="font-display text-5xl text-ink">{accuracy}%</span>
          </div>
          <p className="font-mono text-[11px] text-ink-soft">
            {totalCorrect} correct of {totalAnswered} answered
          </p>
        </div>
      </div>

      {/* Weekly tally-bar chart */}
      <div className="bg-paper border border-rule rounded-sm p-5 shadow-[3px_3px_0_var(--color-rule)]">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Weekly Scores</span>
        <div className="flex items-end gap-3 sm:gap-5 mt-6 h-40">
          {week.map((w, i) => {
            const heightPct = w.total > 0 ? Math.max(8, (w.total / maxTotal) * 100) : 4;
            const correctPct = w.total > 0 ? (w.correct / w.total) * 100 : 0;
            return (
              <div key={w.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-sm relative overflow-hidden bg-rule/30"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-teal"
                      style={{ height: `${correctPct}%` }}
                    />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-ink-soft">{DAY_LABELS[i]}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 font-mono text-[10px] text-ink-soft">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-teal inline-block rounded-sm" /> Correct</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rule/30 inline-block rounded-sm" /> Total answered</span>
        </div>
      </div>

      {/* Quiz history — every completed "Take Quiz" round, most recent first */}
      <div className="bg-paper border border-rule rounded-sm p-5 shadow-[3px_3px_0_var(--color-rule)] mt-8">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Quiz History</span>

        {data.quizHistory.length === 0 ? (
          <p className="font-body text-sm text-ink-soft mt-4">
            No quiz rounds yet — take a quiz from the Take Quiz tab to see your history here.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-rule">
            {data.quizHistory.map((entry) => {
              const pct = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;
              const when = new Date(entry.timestamp).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });
              return (
                <div key={entry.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <span className="font-mono text-[11px] text-ink-soft">{when}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm text-ink">
                      {entry.correct}/{entry.total}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-sm ${
                        pct >= 70 ? "bg-teal/10 text-teal-dark" : pct >= 40 ? "bg-mustard/10 text-mustard" : "bg-coral/10 text-coral-dark"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
