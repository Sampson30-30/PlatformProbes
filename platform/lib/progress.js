// Comparing two self-assessments. Pure functions, no DOM access.

/**
 * Parses a stored list of ratings. Anything malformed gives a list of nulls,
 * so a corrupt save never breaks the page.
 */
export function parseRatings(raw, count) {
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return Array.from({ length: count }, (_, i) => (Number.isInteger(data[i]) ? data[i] : null));
  } catch { /* fall through */ }
  return Array.from({ length: count }, () => null);
}

/** "up 2", "down 1" or "no change", or "" if either rating is missing. */
export function describeChange(before, after) {
  if (before === null || after === null) return '';
  const d = after - before;
  if (d === 0) return 'no change';
  return `${d > 0 ? 'up' : 'down'} ${Math.abs(d)}`;
}

/**
 * Lines up two sets of ratings against a list of labels.
 * Returns { rows: [{ label, before, after, change }], complete, averageBefore, averageAfter }.
 */
export function compareRatings(before, after, labels) {
  const rows = labels.map((label, i) => ({
    label,
    before: before[i] ?? null,
    after: after[i] ?? null,
    change: describeChange(before[i] ?? null, after[i] ?? null),
  }));
  const avg = (values) => {
    const nums = values.filter((v) => typeof v === 'number');
    return nums.length === values.length && nums.length > 0 ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10 : null;
  };
  const bothAnswered = rows.filter((r) => r.before !== null && r.after !== null).length;
  return {
    rows,
    complete: bothAnswered === rows.length && rows.length > 0,
    averageBefore: avg(rows.map((r) => r.before)),
    averageAfter: avg(rows.map((r) => r.after)),
  };
}

/** How many prompts in a saved journal have a real answer. */
export function answeredPrompts(raw) {
  try {
    const data = JSON.parse(raw);
    const entries = data && typeof data === 'object' ? data.entries : null;
    if (!entries || typeof entries !== 'object') return 0;
    return Object.entries(entries).filter(([k, v]) => /^\d+$/.test(k) && typeof v === 'string' && v.trim().length > 0).length;
  } catch {
    return 0;
  }
}
