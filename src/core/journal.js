// Reflection journal formatting and storage parsing. Pure functions, no DOM access.

/** Turns a name into a safe file name part: "Week 1: Plan!" becomes "week-1-plan". */
export function slugify(text) {
  const slug = String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'journal';
}

/**
 * Formats a journal as Markdown, which also reads well as plain text.
 * entries: [{ prompt, text }]. date: an optional display string.
 */
export function journalToMarkdown({ title = 'Reflection journal', entries = [], date = '' }) {
  const parts = [`# ${title}`];
  if (date) parts.push(`_${date}_`);
  for (const { prompt, text } of entries) {
    const body = String(text ?? '').trim();
    parts.push(`## ${prompt}`, body || '_No response._');
  }
  return `${parts.join('\n\n')}\n`;
}

/**
 * Parses what was saved in storage. Returns an object of { index: text }.
 * Anything malformed gives an empty object, so a corrupt save never breaks the page.
 */
export function parseStored(json) {
  try {
    const data = JSON.parse(json);
    const source = data && typeof data === 'object' ? data.entries : null;
    if (!source || typeof source !== 'object') return {};
    const out = {};
    for (const [key, value] of Object.entries(source)) {
      if (/^\d+$/.test(key) && typeof value === 'string') out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

/** Serialises entries for storage. */
export function serialiseStored(texts, now = new Date()) {
  const entries = {};
  texts.forEach((text, i) => {
    if (text) entries[i] = text;
  });
  return JSON.stringify({ version: 1, saved: now.toISOString(), entries });
}
