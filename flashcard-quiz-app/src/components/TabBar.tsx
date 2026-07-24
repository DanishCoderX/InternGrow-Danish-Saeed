export type View = "study" | "quiz" | "manage" | "dashboard";

interface TabBarProps {
  view: View;
  onChange: (v: View) => void;
}

const TABS: { id: View; label: string }[] = [
  { id: "study", label: "Study Deck" },
  { id: "quiz", label: "Take Quiz" },
  { id: "manage", label: "Manage Cards" },
  { id: "dashboard", label: "Ledger" },
];

export default function TabBar({ view, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 px-4 sm:px-8 pt-6 flex-wrap">
      {TABS.map((tab) => {
        const active = tab.id === view;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`tab-notch relative px-4 sm:px-6 py-2.5 font-mono text-xs sm:text-sm tracking-wide uppercase transition-colors
              ${active
                ? "bg-paper text-ink font-semibold"
                : "bg-ink/5 text-ink-soft hover:bg-ink/10"}`}
            style={active ? { boxShadow: "0 -1px 0 var(--color-rule) inset" } : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
