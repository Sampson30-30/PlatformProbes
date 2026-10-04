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
