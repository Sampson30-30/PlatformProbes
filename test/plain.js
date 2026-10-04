// Helpers for keeping helper text in plain English. Not a test file itself:
// the tests that use it are plain-english.test.js and platform-help.test.js.

/** Words a reader with no developer background should not meet in helper text. */
export const JARGON = /\b(dependenc(?:y|ies)|frameworks?|build steps?|web components?|markup|repos?|repositor(?:y|ies)|api|css|javascript|html|tokens?|npm|dom|syntax|modules?|stylesheets?|attributes?|json|markdown)\b/gi;

/** Jargon found in some text, lower case, without repeats. */
export function jargonIn(text) {
  return [...new Set((String(text).match(JARGON) || []).map((w) => w.toLowerCase()))];
}

/** Sentences longer than `max` words. */
export function longSentences(text, max = 28) {
  return String(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length > max);
}

/** Visible text of an HTML snippet: tags removed, entities for the common cases decoded. */
export function textOf(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&rsquo;|&#39;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The first <details class="lk-guide"> block in a page, or null. */
export function guideIn(html) {
  const match = html.match(/<details class="lk-guide"[\s\S]*?<\/details>/);
  return match ? match[0] : null;
}
