// WCAG colour contrast helpers. Pure functions, no DOM access.

/** Parses #rgb or #rrggbb into [r, g, b] (0 to 255). Returns null if invalid. */
export function parseHex(value) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value).trim());
  if (!m) return null;
  let hex = m[1];
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

/** Relative luminance of an [r, g, b] colour, per WCAG 2.1. */
export function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Contrast ratio between two hex colours (1 to 21). Returns NaN if either is invalid. */
export function contrastRatio(a, b) {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) return NaN;
  const [hi, lo] = [luminance(ca), luminance(cb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Describes a ratio against the WCAG thresholds for normal text. */
export function grade(ratio) {
  if (Number.isNaN(ratio)) return 'invalid';
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA large';
  return 'fail';
}

/** Expands #rgb to #rrggbb, lower-cased. Returns null if the value is not a hex colour. */
export function toHex6(value) {
  const rgb = parseHex(value);
  return rgb ? `#${rgb.map((n) => n.toString(16).padStart(2, '0')).join('')}` : null;
}

const TONES = ['success', 'warning', 'danger', 'info'];

/**
 * The colour pairs a theme must get right. `min` is the lowest acceptable
 * contrast ratio. `text` pairs are held to `strictText` (default 4.5, or 7
 * for a high contrast theme).
 */
export function themeChecks() {
  return [
    ['color-text', 'color-bg', 'text'],
    ['color-text', 'color-surface', 'text'],
    ['color-text', 'color-page', 'text'],
    ['color-muted', 'color-bg', 'text'],
    ['color-muted', 'color-surface', 'text'],
    ['color-primary-text', 'color-primary', 'text'],
    ['color-primary', 'color-bg', 'text'],
    ['color-primary', 'color-surface', 'text'],
    ['color-focus', 'color-bg', 'ui'],
    ['color-focus', 'color-surface', 'ui'],
    ['color-focus', 'color-page', 'ui'],
    ...TONES.flatMap((k) => [
      [`color-${k}`, `color-${k}-bg`, 'text'],
      ['color-text', `color-${k}-bg`, 'text'],
    ]),
  ].map(([fg, bg, kind]) => ({ fg, bg, kind }));
}

/**
 * Checks a set of tokens (keys without the --lk- prefix, hex values) against
 * themeChecks(). Returns [{ fg, bg, ratio, min, pass, label }]. A pair is
 * skipped if either colour is missing or is not hex.
 */
export function checkTokens(tokens, { strictText = 4.5 } = {}) {
  const results = [];
  for (const { fg, bg, kind } of themeChecks()) {
    if (!tokens[fg] || !tokens[bg]) continue;
    const ratio = contrastRatio(tokens[fg], tokens[bg]);
    if (Number.isNaN(ratio)) continue;
    const min = kind === 'ui' ? 3 : strictText;
    results.push({ fg, bg, ratio, min, pass: ratio >= min, label: `${fg.replace('color-', '')} on ${bg.replace('color-', '')}` });
  }
  return results;
}
