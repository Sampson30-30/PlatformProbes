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
