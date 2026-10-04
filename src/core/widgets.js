// DOM-free helpers for the small display components: avatar, pagination
// and breadcrumbs.

/** "Ada Lovelace" -> "AL", "grace" -> "G". Uses at most two letters. */
export function initials(name) {
  const words = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = [...words[0]][0];
  const last = words.length > 1 ? [...words[words.length - 1]][0] : '';
  return (first + last).toLocaleUpperCase('en-GB');
}

/** A stable number from a name, so the same person always gets the same colour. */
export function toneIndex(name, tones) {
  let hash = 0;
  for (const ch of String(name ?? '')) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
  return tones > 0 ? hash % tones : 0;
}

/**
 * Page numbers to show, with null for a gap: [1, null, 4, 5, 6, null, 10].
 * Always shows the first, last and current pages and `siblings` either side.
 * A gap is only used where it hides two or more pages.
 */
export function pageWindow(page, total, siblings = 1) {
  if (total < 1) return [];
  const current = Math.min(Math.max(1, Math.round(page) || 1), total);
  const wanted = new Set([1, total]);
  for (let p = current - siblings; p <= current + siblings; p++) if (p >= 1 && p <= total) wanted.add(p);
  const sorted = [...wanted].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    const gap = i > 0 ? sorted[i] - sorted[i - 1] : 1;
    if (gap === 2) out.push(sorted[i] - 1);
    else if (gap > 2) out.push(null);
    out.push(sorted[i]);
  }
  return out;
}

/**
 * Which breadcrumb indexes to show when there are too many. Keeps the first
 * and the last `max - 1`, and returns the hidden indexes in the middle.
 */
export function collapseCrumbs(count, max) {
  if (!max || max < 2 || count <= max) return { visible: [...Array(count).keys()], hidden: [] };
  const tail = max - 1;
  const hidden = [];
  for (let i = 1; i < count - tail; i++) hidden.push(i);
  const visible = [...Array(count).keys()].filter((i) => !hidden.includes(i));
  return { visible, hidden };
}
