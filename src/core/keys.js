// DOM-free keyboard logic shared by <lk-menu> and <lk-tree>.

/**
 * Where arrow keys, Home and End move to in a list. `enabled` says which
 * items can be focused. Arrow keys wrap. Returns the new index, or `current`
 * when the key does nothing here.
 */
export function menuTarget(key, current, enabled) {
  const on = enabled.map((e, i) => (e ? i : -1)).filter((i) => i >= 0);
  if (on.length === 0) return current;
  if (key === 'Home') return on[0];
  if (key === 'End') return on[on.length - 1];
  if (key === 'ArrowDown') return on.find((i) => i > current) ?? on[0];
  if (key === 'ArrowUp') return [...on].reverse().find((i) => i < current) ?? on[on.length - 1];
  return current;
}

/**
 * Builds the text typed so far for type-ahead. A pause longer than `timeout`
 * milliseconds starts again. Keys that are not a single character (arrows,
 * Enter and so on) leave it alone.
 */
export function nextQuery(buffer, lastTime, key, now, timeout = 700) {
  if (key.length !== 1) return buffer;
  return now - lastTime > timeout ? key : buffer + key;
}

/**
 * Finds the item that type-ahead should move to, or -1. Typing one letter
 * repeatedly cycles through the items that start with it. Longer text looks
 * for the first match, starting at the current item.
 */
export function typeaheadIndex(labels, enabled, current, query) {
  const q = String(query ?? '').toLowerCase();
  if (!q || labels.length === 0) return -1;
  const cycle = [...q].every((c) => c === q[0]);
  const term = cycle ? q[0] : q;
  const start = cycle ? current + 1 : Math.max(current, 0);
  for (let i = 0; i < labels.length; i++) {
    const index = (start + i) % labels.length;
    if (enabled[index] && labels[index].trim().toLowerCase().startsWith(term)) return index;
  }
  return -1;
}
