// Logic for spectrum and rating components. Pure functions, no DOM access.

/**
 * Describes a spectrum position in words, for screen readers and summaries.
 * `value` is 0 to 100 (0 is all the way to the left pole).
 */
export function describePosition(value, left, right) {
  const v = Math.min(100, Math.max(0, Number(value) || 0));
  if (v >= 45 && v <= 55) return `In the middle between ${left} and ${right}`;
  const side = v < 50 ? left : right;
  const distance = Math.abs(v - 50);
  if (distance >= 40) return `Fully ${side}`;
  if (distance >= 25) return `Strongly towards ${side}`;
  if (distance >= 10) return `Towards ${side}`;
  return `Slightly towards ${side}`;
}

/** Compares a learner's position with the expert one. */
export function compareToExpert(value, expert) {
  const difference = Math.round(Math.abs(Number(value) - Number(expert)));
  let closeness = 'far from';
  if (difference <= 10) closeness = 'close to';
  else if (difference <= 25) closeness = 'fairly near';
  return { difference, closeness };
}

/**
 * Summarises ratings. `values` has one entry per statement: a number from 1
 * to `scale`, or null when unanswered. `focus` lists the answered statements
 * rated in the lower half of the scale, as indexes.
 */
export function summariseRatings(values, scale) {
  const answered = values.filter((v) => typeof v === 'number');
  const average = answered.length
    ? Math.round((answered.reduce((a, b) => a + b, 0) / answered.length) * 10) / 10
    : 0;
  const cutoff = Math.floor(scale / 2);
  const focus = values.flatMap((v, i) => (typeof v === 'number' && v <= cutoff ? [i] : []));
  return {
    total: values.length,
    answered: answered.length,
    complete: answered.length === values.length && values.length > 0,
    average,
    focus,
  };
}
