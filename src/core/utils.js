// Pure helpers with no DOM access, so they can be unit tested in Node.

let counter = 0;

/** Returns a unique id string such as "lk-tabs-3", for wiring up ARIA attributes. */
export function uid(prefix = 'lk') {
  counter += 1;
  return `${prefix}-${counter}`;
}

/** Clamps a number into the range [min, max]. Non-numbers fall back to min. */
export function clamp(value, min, max) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

/** Wraps an index around a list length, so -1 becomes the last item. */
export function wrap(index, length) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

/**
 * Returns the list of open item indexes after toggling `index`.
 * In single mode (multiple = false) opening an item closes the others.
 */
export function toggleOpen(open, index, multiple = false) {
  if (open.includes(index)) return open.filter((i) => i !== index);
  return multiple ? [...open, index].sort((a, b) => a - b) : [index];
}

/** Trims a list of initially open indexes to what the mode allows. */
export function normaliseOpen(open, multiple = false) {
  return multiple ? open : open.slice(0, 1);
}

/** Returns value as a percentage of max, clamped to 0 to 100 and rounded. */
export function percent(value, max = 100) {
  const m = Number(max);
  if (!(m > 0)) return 0;
  return Math.round(clamp((Number(value) / m) * 100, 0, 100));
}

/** State of step `index` when the current step is `current`. */
export function stepState(index, current) {
  if (index < current) return 'complete';
  if (index === current) return 'current';
  return 'upcoming';
}

/**
 * How long a notification should stay up, in milliseconds. Longer messages
 * get more time so they can be read. Returns 0 (stay until dismissed) for
 * the tones that should not disappear on their own.
 */
export function toastDuration(message, tone = 'info') {
  if (tone === 'danger') return 0;
  const length = String(message).length;
  return Math.min(4000 + length * 60, 15000);
}

/**
 * Moves through a grid of `count` items laid out in `columns` columns, in
 * reading order. Returns the new index for an arrow, Home or End key, or the
 * same index if the key does nothing there.
 */
export function gridMove(index, key, columns, count) {
  const cols = Math.max(1, columns);
  const last = count - 1;
  switch (key) {
    case 'ArrowRight': return Math.min(index + 1, last);
    case 'ArrowLeft': return Math.max(index - 1, 0);
    case 'ArrowDown': return index + cols <= last ? index + cols : index;
    case 'ArrowUp': return index - cols >= 0 ? index - cols : index;
    case 'Home': return 0;
    case 'End': return last;
    default: return index;
  }
}
