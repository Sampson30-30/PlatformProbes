// Safe text helpers for content. Pure functions, no DOM access.

import { slug } from './words.js';

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ENTITIES[c]);
}

// Links may go to another page of this site or to an https address. Nothing else.
const SAFE_HREF = /^(https:\/\/[^\s"'<>]+|[a-z0-9-]+\.html(\?[a-z0-9=&_-]*)?(#[a-z0-9-]+)?|#[a-z0-9-]+)$/i;

export function isSafeHref(href) {
  return SAFE_HREF.test(href);
}

/**
 * Turns the small inline markup used in content into safe HTML.
 *   **bold**   `code`   [label](page.html)   [label](https://example.com)
 *   [[term]]   [[words you see|Term]]   a link to that term's plain meaning on the Words page
 * Everything else is escaped, so content can never inject markup.
 */
export function inline(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g, (match, shown, target) => `<a class="term" href="words.html#${slug(target || shown)}">${shown}</a>`);
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
    const raw = href.replace(/&amp;/g, '&');
    if (!isSafeHref(raw)) return label;
    const external = raw.startsWith('https://');
    return `<a href="${escapeHtml(raw)}"${external ? ' rel="noopener noreferrer"' : ''}>${label}</a>`;
  });
  return html;
}

/** The text a screen reader or a test would see: inline markup removed. */
export function plain(text) {
  return String(text)
    .replace(/\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}
