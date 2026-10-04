// Heuristic accessibility and layout checks for a rendered page. These catch
// common mistakes; they are not a substitute for testing with a screen reader.

import { luminance } from '../../src/core/contrast.js';

function parseColour(text) {
  const rgb = /^rgba?\(([^)]+)\)$/.exec(text);
  if (rgb) {
    const p = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
  }
  const srgb = /^color\(srgb ([^)]+)\)$/.exec(text);
  if (srgb) {
    const p = srgb[1].split(/[\s/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3).map((v) => Math.round(v * 255)), a: p.length > 3 ? p[3] : 1 };
  }
  return null;
}

const blend = (top, bottom) => top.rgb.map((c, i) => Math.round(c * top.a + bottom[i] * (1 - top.a)));

function effectiveBackground(el, win) {
  const layers = [];
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    const c = parseColour(win.getComputedStyle(node).backgroundColor);
    if (c && c.a > 0) {
      layers.push(c);
      if (c.a >= 0.99) break;
    }
  }
  let base = [255, 255, 255];
  for (const layer of layers.reverse()) base = blend(layer, base);
  return base;
}

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const visible = (el) => {
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return false;
  const cs = el.ownerDocument.defaultView.getComputedStyle(el);
  return cs.visibility !== 'hidden' && cs.display !== 'none';
};

/** Text that is too faint against its background. Returns a list of messages. */
export function contrastProblems(doc) {
  const win = doc.defaultView;
  const problems = [];
  const seen = new Set();
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.nodeValue.trim()) continue;
    const el = node.parentElement;
    if (!el || ['SCRIPT', 'STYLE', 'OPTION'].includes(el.tagName) || seen.has(el) || !visible(el)) continue;
    seen.add(el);
    if (el.closest('[disabled], [aria-disabled="true"]')) continue;
    const cs = win.getComputedStyle(el);
    const fg = parseColour(cs.color);
    if (!fg) continue;
    const bg = effectiveBackground(el, win);
    const text = blend(fg, bg);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
    const min = large ? 3 : 4.5;
    const r = ratio(text, bg);
    if (r < min) problems.push(`${r.toFixed(2)}:1 (needs ${min}) for "${node.nodeValue.trim().slice(0, 40)}" in <${el.tagName.toLowerCase()} class="${el.className}">`);
  }
  return problems;
}

/** Headings: one h1, and no skipped levels. */
export function headingProblems(doc) {
  const problems = [];
  const all = [...doc.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')].filter(visible);
  const level = (h) => Number(h.getAttribute('aria-level')) || Number(h.tagName[1]) || 2;
  const h1s = all.filter((h) => level(h) === 1);
  if (h1s.length !== 1) problems.push(`expected one h1, found ${h1s.length}`);
  let prev = 0;
  for (const h of all) {
    const l = level(h);
    if (prev && l > prev + 1) problems.push(`heading level jumps from ${prev} to ${l} at "${h.textContent.trim().slice(0, 40)}"`);
    prev = l;
  }
  return problems;
}

function accessibleName(el, doc) {
  if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
  const by = el.getAttribute('aria-labelledby');
  if (by) return by.split(/\s+/).map((id) => doc.getElementById(id)?.textContent || '').join(' ').trim();
  if (el.id) {
    const label = doc.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (label) return label.textContent.trim();
  }
  const wrapping = el.closest('label');
  if (wrapping) return wrapping.textContent.trim();
  return (el.textContent || el.getAttribute('title') || '').trim();
}

/** Form controls, buttons and links must have a name; ids must be unique. */
export function nameProblems(doc) {
  const problems = [];
  for (const el of doc.querySelectorAll('input:not([type=hidden]), select, textarea')) {
    if (!visible(el) && el.type !== 'radio' && el.type !== 'checkbox') continue;
    if (!accessibleName(el, doc)) problems.push(`unlabelled <${el.tagName.toLowerCase()} ${el.type || ''}>`);
  }
  for (const el of doc.querySelectorAll('button, [role=button]')) {
    if (visible(el) && !accessibleName(el, doc)) problems.push(`button with no name: ${el.outerHTML.slice(0, 60)}`);
  }
  for (const el of doc.querySelectorAll('a[href]')) {
    if (visible(el) && !accessibleName(el, doc)) problems.push(`link with no name: ${el.outerHTML.slice(0, 60)}`);
  }
  const seen = new Set();
  for (const el of doc.querySelectorAll('[id]')) {
    if (seen.has(el.id)) problems.push(`duplicate id "${el.id}"`);
    seen.add(el.id);
  }
  return problems;
}

/** The page structure the site promises: skip link, main landmark, navigation. */
export function structureProblems(doc) {
  const problems = [];
  const first = doc.querySelector('a[href], button');
  if (!first || first.getAttribute('href') !== '#main') problems.push('the first focusable element should be the skip link');
  if (doc.querySelectorAll('main').length !== 1) problems.push('expected exactly one main landmark');
  if (!doc.querySelector('nav[aria-label]')) problems.push('expected a labelled navigation landmark');
  if (!doc.querySelector('[aria-current="page"]')) problems.push('the current page is not marked in the navigation');
  if (doc.documentElement.lang !== 'en-GB') problems.push('the page language should be en-GB');
  const stuck = [...doc.querySelectorAll('lk-quiz, lk-journal, lk-scenario, lk-grid-explorer, lk-process, lk-timeline, lk-accordion, lk-field, lk-rating, lk-spectrum')].filter((e) => !e.classList.contains('lk-ready'));
  if (stuck.length) problems.push(`${stuck.length} component(s) never became ready, e.g. <${stuck[0].localName}>`);
  return problems;
}

/** Nothing should make the page scroll sideways. */
export function overflowProblems(doc) {
  const root = doc.documentElement;
  return root.scrollWidth > root.clientWidth + 1 ? [`the page scrolls sideways: ${root.scrollWidth}px wide in a ${root.clientWidth}px window`] : [];
}

const settle = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms));
const buttonNamed = (root, pattern) => [...root.querySelectorAll('button')].find((b) => pattern.test(b.textContent));

/**
 * Uses the interactive parts of a page so their other states can be checked:
 * quiz feedback, scenario endings, open grid tiles, revealed spectrums, and
 * every step of a process.
 */
export async function exercise(doc) {
  for (const quiz of doc.querySelectorAll('lk-quiz')) {
    const input = quiz.querySelector('input');
    if (!input || input.closest('[hidden]')) continue;
    input.click();
    buttonNamed(quiz, /Check answer/)?.click();
  }
  for (const s of doc.querySelectorAll('lk-spectrum')) {
    const range = s.querySelector('input[type=range]');
    range.value = '20';
    range.dispatchEvent(new Event('input', { bubbles: true }));
    buttonNamed(s, /Compare/)?.click();
  }
  for (const scenario of doc.querySelectorAll('lk-scenario')) {
    for (let i = 0; i < 6; i += 1) {
      const choice = scenario.querySelector('.lk-scenario__choice');
      if (!choice) break;
      choice.click();
    }
  }
  for (const grid of doc.querySelectorAll('lk-grid-explorer')) grid.querySelector('.lk-grid__tile')?.click();
  for (const a of doc.querySelectorAll('lk-accordion')) a.querySelectorAll('button')[1]?.click();
  for (const t of doc.querySelectorAll('lk-timeline')) {
    buttonNamed(t, /Show next/)?.click();
    t.querySelector('.lk-timeline__toggle')?.click();
  }
  await settle();
  // Step through each process, answering every question on the way.
  for (const proc of doc.querySelectorAll('lk-process')) {
    for (let i = 0; i < proc.panels.length; i += 1) {
      proc.go(i);
      const quiz = proc.panels[i].step.querySelector('lk-quiz');
      if (quiz && !quiz.querySelector('.lk-quiz__result:not([hidden])')) {
        quiz.querySelector('input')?.click();
        buttonNamed(quiz, /Check answer/)?.click();
      }
      await settle(20);
    }
    proc.go(proc.panels.length - 1);
  }
  await settle(200);
}
