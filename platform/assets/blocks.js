// Turns content blocks into DOM, using LearnKit components where they fit.
// Content is data; this file is the only place that knows how it looks.

import { inline } from '../lib/text.js';

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function jsonScript(data) {
  const s = document.createElement('script');
  s.type = 'application/json';
  s.textContent = JSON.stringify(data);
  return s;
}

let uid = 0;
const nextId = (prefix) => `${prefix}-${(uid += 1)}`;

const RENDERERS = {
  p: (b) => el('p', 'b-p', inline(b.text)),

  h: (b) => {
    const level = Math.min(4, Math.max(2, b.level || 2));
    return el(`h${level}`, 'b-h', inline(b.text));
  },

  list: (b) => {
    const list = el(b.ordered ? 'ol' : 'ul', 'b-list');
    for (const item of b.items) list.append(el('li', '', inline(item)));
    return list;
  },

  quote: (b) => {
    const fig = el('figure', 'b-quote');
    fig.append(el('blockquote', '', `<p>${inline(b.text)}</p>`));
    if (b.cite) fig.append(el('figcaption', '', inline(b.cite)));
    return fig;
  },

  callout: (b) => {
    const box = el('aside', `b-callout b-callout--${b.tone || 'info'}`);
    box.setAttribute('aria-label', b.title);
    box.append(el('p', 'b-callout__title', inline(b.title)));
    box.append(el('p', 'b-callout__text', inline(b.text)));
    return box;
  },

  compare: (b) => {
    const wrap = el('div', 'b-table');
    const table = el('table');
    if (b.caption) table.append(el('caption', '', inline(b.caption)));
    const thead = el('thead');
    const hr = el('tr');
    for (const h of b.head) hr.append(Object.assign(el('th', '', inline(h)), { scope: 'col' }));
    thead.append(hr);
    const tbody = el('tbody');
    for (const row of b.rows) {
      const tr = el('tr');
      row.forEach((cell, i) => tr.append(i === 0 ? Object.assign(el('th', '', inline(cell)), { scope: 'row' }) : el('td', '', inline(cell))));
      tbody.append(tr);
    }
    table.append(thead, tbody);
    wrap.append(table);
    return wrap;
  },

  say: (b) => {
    const box = el('section', 'b-say');
    box.setAttribute('aria-label', b.title);
    box.append(el('h3', 'b-say__title', inline(b.title)));
    const list = el('ul', 'b-say__list');
    for (const phrase of b.phrases) {
      const li = el('li');
      li.append(el('q', 'b-say__phrase', inline(phrase)));
      const copy = el('button', 'lk-button b-say__copy');
      copy.type = 'button';
      copy.dataset.size = 'small';
      copy.textContent = 'Copy';
      copy.setAttribute('aria-label', `Copy: ${phrase}`);
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(phrase.replace(/[`*]/g, ''));
          copy.textContent = 'Copied';
          setTimeout(() => { copy.textContent = 'Copy'; }, 1500);
        } catch {
          copy.textContent = 'Select and copy';
        }
      });
      li.append(copy);
      list.append(li);
    }
    box.append(list);
    return box;
  },

  quiz: (b) => {
    const q = el('lk-quiz');
    q.setAttribute('label', b.label || 'Check your understanding');
    if (b.title) q.setAttribute('title', b.title);
    q.setAttribute('level', '3');
    if (b.shuffle) q.setAttribute('shuffle', '');
    q.append(jsonScript(b.data));
    return q;
  },

  scenario: (b) => {
    const s = el('lk-scenario');
    s.setAttribute('label', b.label || 'Scenario');
    s.setAttribute('level', '3');
    s.append(jsonScript(b.data));
    return s;
  },

  spectrum: (b) => {
    const s = el('lk-spectrum');
    s.setAttribute('statement', b.statement);
    s.setAttribute('left', b.left);
    s.setAttribute('right', b.right);
    if (b.expert !== undefined) s.setAttribute('expert', String(b.expert));
    if (b.explanation) s.setAttribute('explanation', b.explanation);
    return s;
  },

  journal: (b) => {
    const j = el('lk-journal');
    j.setAttribute('name', b.name);
    if (b.title) j.setAttribute('title', b.title);
    j.setAttribute('level', '3');
    j.setAttribute('rows', String(b.rows || 4));
    for (const p of b.prompts) {
      const d = el('div');
      d.setAttribute('data-lk-prompt', p.prompt);
      if (p.hint) d.setAttribute('data-hint', p.hint);
      j.append(d);
    }
    return j;
  },

  timeline: (b) => {
    const t = el('lk-timeline');
    t.setAttribute('label', b.label || 'Timeline');
    t.setAttribute('level', '3');
    if (b.stepped) t.setAttribute('stepped', '');
    if (b.collapsible) t.setAttribute('collapsible', '');
    for (const item of b.items) {
      const d = el('div', '', item.body ? inline(item.body) : '');
      d.setAttribute('data-lk-date', item.date);
      d.setAttribute('data-title', item.title);
      t.append(d);
    }
    return t;
  },

  grid: (b) => {
    const g = el('lk-grid-explorer');
    g.setAttribute('label', b.label);
    g.setAttribute('columns', String(b.columns || 3));
    g.setAttribute('level', '3');
    for (const c of b.cells) {
      const d = el('div', '', `<p>${inline(c.body)}</p>`);
      d.setAttribute('data-lk-cell', c.title);
      g.append(d);
    }
    return g;
  },

  accordion: (b) => {
    const a = el('lk-accordion');
    a.setAttribute('label', b.label);
    a.setAttribute('level', '3');
    if (b.multiple) a.setAttribute('multiple', '');
    for (const item of b.items) {
      const d = el('div', '', `<p>${inline(item.body)}</p>`);
      d.setAttribute('data-lk-item', item.title);
      if (item.open) d.setAttribute('open', '');
      a.append(d);
    }
    return a;
  },

  process: (b) => {
    const proc = el('lk-process');
    proc.setAttribute('label', b.label);
    proc.setAttribute('level', '3');
    for (const step of b.steps) {
      const d = el('div');
      d.setAttribute('data-lk-step', step.title);
      renderBlocks(d, step.blocks);
      proc.append(d);
    }
    return proc;
  },

  rating: (b) => {
    const r = el('lk-rating');
    r.setAttribute('label', b.label);
    r.setAttribute('scale', String(b.scale || 5));
    if (b.low) r.setAttribute('low', b.low);
    if (b.high) r.setAttribute('high', b.high);
    if (b.summary) r.setAttribute('summary', '');
    if (b.name) r.setAttribute('name', b.name);
    for (const s of b.statements) {
      const d = el('div');
      d.setAttribute('data-lk-statement', s);
      r.append(d);
    }
    return r;
  },
};

/** Renders a list of blocks into `container`. Unknown block types are skipped, loudly. */
export function renderBlocks(container, blocks) {
  for (const block of blocks) {
    const render = RENDERERS[block.type];
    if (!render) {
      console.warn(`Unknown content block type "${block.type}"`);
      continue;
    }
    const node = render(block);
    if (block.id) node.id = block.id;
    container.append(node);
  }
}

export { nextId };
