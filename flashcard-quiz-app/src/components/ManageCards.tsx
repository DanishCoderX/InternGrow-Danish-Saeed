import { useState } from "react";
import type { Flashcard } from "../types";

interface ManageCardsProps {
  cards: Flashcard[];
  onAdd: (card: { topic: string; question: string; answer: string }) => void;
  onUpdate: (id: string, updates: Partial<Flashcard>) => void;
  onDelete: (id: string) => void;
}

const emptyForm = { topic: "", question: "", answer: "" };

export default function ManageCards({ cards, onAdd, onUpdate, onDelete }: ManageCardsProps) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.topic.trim() || !form.question.trim() || !form.answer.trim()) return;

    if (editingId) {
      onUpdate(editingId, form);
      setEditingId(null);
    } else {
      onAdd(form);
    }
    setForm(emptyForm);
  }

  function startEdit(card: Flashcard) {
    setEditingId(card.id);
    setForm({ topic: card.topic, question: card.question, answer: card.answer });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div className="px-4 sm:px-8 py-8 max-w-3xl mx-auto">
      <h2 className="font-display text-2xl mb-1">{editingId ? "Edit Card" : "Add a New Card"}</h2>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide mb-5">
        {editingId ? "Update the entry below" : "File a fresh entry into the catalog"}
      </p>

      <form onSubmit={submit} className="bg-paper border border-rule rounded-sm p-5 mb-10 shadow-[3px_3px_0_var(--color-rule)]">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-1.5">Topic</label>
            <input
              value={form.topic}
              onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
              placeholder="e.g. React, DSA, History"
              className="w-full px-3 py-2 border border-rule rounded-sm bg-white/60 font-body text-sm focus:border-teal outline-none"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-1.5">Question</label>
          <textarea
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            rows={2}
            placeholder="What do you want to be quizzed on?"
            className="w-full px-3 py-2 border border-rule rounded-sm bg-white/60 font-body text-sm focus:border-teal outline-none resize-none"
          />
        </div>
        <div className="mb-5">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-1.5">Answer</label>
          <textarea
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            rows={2}
            placeholder="The correct answer or explanation"
            className="w-full px-3 py-2 border border-rule rounded-sm bg-white/60 font-body text-sm focus:border-teal outline-none resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="font-mono text-xs uppercase tracking-wide bg-ink text-paper px-4 py-2.5 rounded-sm hover:bg-ink/80 transition-colors"
          >
            {editingId ? "Save Changes" : "Add to Deck"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="font-mono text-xs uppercase tracking-wide text-ink-soft px-4 py-2.5 hover:text-ink transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="font-display text-xl mb-4">
        All Cards <span className="font-mono text-sm text-ink-soft">({cards.length})</span>
      </h3>
      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-start justify-between gap-4 bg-paper border border-rule rounded-sm px-4 py-3 hover:border-ink/30 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-teal-dark bg-teal/10 px-1.5 py-0.5 rounded-sm">
                {card.topic}
              </span>
              <p className="font-body text-sm text-ink mt-1.5 truncate">{card.question}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => startEdit(card)}
                className="font-mono text-[10px] uppercase tracking-wide text-ink-soft hover:text-teal-dark transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(card.id)}
                className="font-mono text-[10px] uppercase tracking-wide text-ink-soft hover:text-coral-dark transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <p className="font-body text-sm text-ink-soft py-6 text-center">No cards yet — add your first one above.</p>
        )}
      </div>
    </div>
  );
}
