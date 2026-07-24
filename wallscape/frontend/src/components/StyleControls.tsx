import { STYLE_PRESETS } from "../lib/stylePresets";
import { EXPORT_SIZES } from "../lib/exportSizes";
import type { StylePresetId, ExportSizeId } from "../types";

interface StyleControlsProps {
  stylePresetId: StylePresetId;
  onStyleChange: (id: StylePresetId) => void;
  exportSizeId: ExportSizeId;
  onExportSizeChange: (id: ExportSizeId) => void;
}

export default function StyleControls({ stylePresetId, onStyleChange, exportSizeId, onExportSizeChange }: StyleControlsProps) {
  return (
    <div className="bg-surface border border-hairline rounded-xl p-4 sm:p-5 space-y-4">
      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Style</span>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onStyleChange(preset.id)}
              className={`${preset.cssFontClass} text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                stylePresetId === preset.id
                  ? "border-[var(--mood-accent)] bg-surface-raised text-paper-mist"
                  : "border-hairline text-ink-soft hover:border-ink-soft"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Export Size</span>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {EXPORT_SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => onExportSizeChange(size.id)}
              className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-colors ${
                exportSizeId === size.id
                  ? "border-[var(--mood-accent)] bg-surface-raised text-paper-mist"
                  : "border-hairline text-ink-soft hover:border-ink-soft"
              }`}
            >
              <span className="block font-medium text-sm">{size.label}</span>
              <span className="font-mono text-[10px] text-ink-soft">
                {size.width}×{size.height}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
