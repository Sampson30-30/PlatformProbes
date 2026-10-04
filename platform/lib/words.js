// Vocabulary search and phrase gathering. Pure functions, no DOM access.

/** "Edge case" becomes "edge-case". Used for page anchors. */
export function slug(term) {
  return String(term).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const normalise = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Entries that match a search. Matches the term and its aliases first,
 * then the plain meaning. An empty search returns everything, in order.
 */
export function filterEntries(entries, query) {
  const q = normalise(query);
  if (!q) return entries;
  const scored = [];
  entries.forEach((entry, i) => {
    const names = [entry.term, ...(entry.aliases || [])].map(normalise);
    let score = 0;
    if (names.some((n) => n === q)) score = 4;
    else if (names.some((n) => n.startsWith(q))) score = 3;
    else if (names.some((n) => n.includes(q))) score = 2;
    else if (normalise(entry.plain).includes(q)) score = 1;
    if (score) scored.push({ entry, score, i });
  });
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).map((s) => s.entry);
}

/**
 * Gathers the "say this to Claude" phrases from every topic, so they are
 * written once and shown twice. Returns [{ id, title, phrases }].
 */
export function collectPhrases(topics) {
  return topics.flatMap((topic) => {
    const phrases = (topic.blocks || []).filter((b) => b.type === 'say').flatMap((b) => b.phrases);
    return phrases.length ? [{ id: topic.id, title: topic.title, phrases }] : [];
  });
}
