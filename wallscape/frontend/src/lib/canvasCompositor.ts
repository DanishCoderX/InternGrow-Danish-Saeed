import type { Background } from "../types";

export interface ComposeOptions {
  background: Background;
  quote: string;
  author: string;
  width: number;
  height: number;
  fontFamily: string;
  align: "left" | "center";
}

export interface ComposeResult {
  textColor: "light" | "dark";
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Unsplash's CDN sends CORS headers, so this keeps the canvas exportable
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load background image"));
    img.src = url;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Samples average luminance in a region to decide whether text should be light or dark. */
function sampleBrightness(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): number {
  const data = ctx.getImageData(Math.max(0, x), Math.max(0, y), Math.max(1, w), Math.max(1, h)).data;
  let total = 0;
  let count = 0;
  const step = 4 * 25; // sample every 25th pixel for performance
  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    total += 0.299 * r + 0.587 * g + 0.114 * b;
    count++;
  }
  return count > 0 ? total / count : 128;
}

export async function composeWallpaper(canvas: HTMLCanvasElement, opts: ComposeOptions): Promise<ComposeResult> {
  canvas.width = opts.width;
  canvas.height = opts.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // --- Draw background (cover-fit photo, or gradient fallback) ---
  if (opts.background.type === "photo" && opts.background.url) {
    const img = await loadImage(opts.background.url);
    const scale = Math.max(opts.width / img.width, opts.height / img.height);
    const sw = opts.width / scale;
    const sh = opts.height / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, opts.width, opts.height);
  } else {
    const grad = ctx.createLinearGradient(0, 0, opts.width, opts.height);
    grad.addColorStop(0, opts.background.from || "#3a3d5c");
    grad.addColorStop(1, opts.background.to || "#8087a3");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, opts.width, opts.height);
  }

  // --- Auto-contrast: sample brightness where the text block will sit ---
  const sampleY = Math.floor(opts.height * 0.5);
  const sampleH = Math.floor(opts.height * 0.45);
  let brightness = 100;
  try {
    brightness = sampleBrightness(ctx, 0, sampleY, opts.width, sampleH);
  } catch {
    // getImageData throws if the canvas got tainted (e.g. a CORS hiccup) — default to light text
    brightness = 100;
  }
  const textColor: "light" | "dark" = brightness > 150 ? "dark" : "light";

  // --- Scrim so text stays legible regardless of the photo underneath ---
  const scrim = ctx.createLinearGradient(0, opts.height * 0.35, 0, opts.height);
  if (textColor === "light") {
    scrim.addColorStop(0, "rgba(0,0,0,0)");
    scrim.addColorStop(1, "rgba(0,0,0,0.6)");
  } else {
    scrim.addColorStop(0, "rgba(255,255,255,0)");
    scrim.addColorStop(1, "rgba(255,255,255,0.6)");
  }
  ctx.fillStyle = scrim;
  ctx.fillRect(0, opts.height * 0.35, opts.width, opts.height * 0.65);

  // --- Ensure the chosen webfont is actually loaded before measuring/drawing text ---
  const baseFontSize = Math.round(opts.width * 0.062);
  const authorFontSize = Math.round(baseFontSize * 0.48);
  try {
    await document.fonts.load(`${baseFontSize}px "${opts.fontFamily}"`);
    await document.fonts.load(`${authorFontSize}px "Inter"`);
  } catch {
    // If font loading fails for some reason, canvas will fall back to a system font — not fatal.
  }

  // --- Draw quote text ---
  const padding = opts.width * 0.09;
  const maxWidth = opts.width - padding * 2;
  ctx.font = `${baseFontSize}px "${opts.fontFamily}"`;
  ctx.fillStyle = textColor === "light" ? "#F5F3EF" : "#1C1B1F";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = opts.align;

  const lines = wrapText(ctx, `\u201C${opts.quote}\u201D`, maxWidth);
  const lineHeight = baseFontSize * 1.3;
  const textBlockHeight = lines.length * lineHeight;
  let y = opts.height - padding * 2.4 - textBlockHeight;
  const x = opts.align === "center" ? opts.width / 2 : padding;

  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }

  // --- Author ---
  ctx.font = `${authorFontSize}px "Inter"`;
  ctx.fillText(`— ${opts.author}`, x, y + lineHeight * 0.25);

  return { textColor };
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Failed to export canvas"))), "image/png", 0.95);
  });
}
