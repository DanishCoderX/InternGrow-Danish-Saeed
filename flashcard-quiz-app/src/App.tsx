import { useState } from "react";
import type { StudyData } from "./types";
import { loadData, addCard, updateCard, deleteCard, recordAttempt, recordQuizAttempt } from "./storage";
import TabBar, { type View } from "./components/TabBar";
import StudyDeck from "./components/StudyDeck";
import Quiz from "./components/Quiz";
import ManageCards from "./components/ManageCards";
import Dashboard from "./components/Dashboard";

function App() {
  const [data, setData] = useState<StudyData>(() => loadData());
  const [view, setView] = useState<View>("study");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function handleAdd(card: { topic: string; question: string; answer: string }) {
    setData((d) => addCard(d, card));
    showToast("Card filed into the catalog");
  }

  function handleUpdate(id: string, updates: Partial<StudyData["cards"][number]>) {
    setData((d) => updateCard(d, id, updates));
    showToast("Card updated");
  }

  function handleDelete(id: string) {
    setData((d) => deleteCard(d, id));
    showToast("Card removed");
  }

  function handleFinishRound(correct: number, total: number) {
    setData((d) => recordAttempt(d, correct, total));
    showToast(`Round logged — ${correct}/${total} correct`);
    setView("dashboard");
  }

  function handleFinishQuiz(correct: number, total: number) {
    setData((d) => recordQuizAttempt(d, correct, total));
    showToast(`Quiz logged — ${correct}/${total} correct`);
  }

  return (
    <div className="min-h-screen">
      <header className="px-4 sm:px-8 pt-8 pb-2 max-w-3xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1">Personal Study Catalog</p>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-ink">Card Catalog</h1>
      </header>

      <div className="max-w-3xl mx-auto">
        <TabBar view={view} onChange={setView} />
      </div>

      <main className="bg-paper-dark/40 border-t border-rule min-h-[60vh]">
        {view === "study" && <StudyDeck cards={data.cards} onFinishRound={handleFinishRound} />}
        {view === "quiz" && <Quiz cards={data.cards} onFinishQuiz={handleFinishQuiz} />}
        {view === "manage" && (
          <ManageCards cards={data.cards} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} />
        )}
        {view === "dashboard" && <Dashboard data={data} />}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-paper font-mono text-xs uppercase tracking-wide px-4 py-2.5 rounded-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
