// Checks every theme (and the base tokens) against contrast rules, in light and dark.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { contrastRatio } from '../src/core/contrast.js';

const root = new URL('../src/', import.meta.url);

/** Reads --lk-* declarations from the first block that starts with `selector`. */
function tokens(css, selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return null;
  const end = css.indexOf('}', start);
  const out = {};
  for (const [, name, value] of css.slice(start, end).matchAll(/--lk-([a-z-]+):\s*([^;]+);/g)) {
    out[name] = value.trim();
  }
  return out;
}

const sets = [];
const base = readFileSync(new URL('learnkit.css', root), 'utf8');
sets.push({ name: 'base light', t: tokens(base, '  :root') });
sets.push({ name: 'base dark', t: { ...tokens(base, '  :root'), ...tokens(base, "  [data-lk-mode='dark']") } });
for (const file of readdirSync(new URL('themes/', root)).filter((f) => f.endsWith('.css'))) {
  const name = file.replace('.css', '');
  const css = readFileSync(new URL(`themes/${file}`, root), 'utf8');
  const light = tokens(css, `  [data-lk-theme='${name}']`);
  const dark = tokens(css, `  [data-lk-theme='${name}'][data-lk-mode='dark']`);
  sets.push({ name: `${name} light`, t: light });
  sets.push({ name: `${name} dark`, t: { ...light, ...dark } });
}

const TONES = ['success', 'warning', 'danger', 'info'];

for (const { name, t } of sets) {
  test(`${name}: tokens exist`, () => {
    assert.ok(t, 'token block found');
    for (const key of ['color-text', 'color-bg', 'color-primary', 'color-focus', ...TONES.flatMap((k) => [`color-${k}`, `color-${k}-bg`])]) {
      assert.ok(t[key], `missing --lk-${key}`);
    }
  });

  const checks = [
    ['color-text', 'color-bg', 4.5],
    ['color-text', 'color-surface', 4.5],
    ['color-text', 'color-page', 4.5],
    ['color-muted', 'color-bg', 4.5],
    ['color-muted', 'color-surface', 4.5],
    ['color-primary-text', 'color-primary', 4.5],
    ['color-primary', 'color-bg', 4.5],
    ['color-focus', 'color-bg', 3],
    ['color-focus', 'color-surface', 3],
    ['color-focus', 'color-page', 3],
    ...TONES.flatMap((k) => [
      [`color-${k}`, `color-${k}-bg`, 4.5],
      ['color-text', `color-${k}-bg`, 4.5],
    ]),
  ];
  for (const [fg, bg, min] of checks) {
    test(`${name}: ${fg} on ${bg} is at least ${min}:1`, () => {
      if (!t || !t[fg] || !t[bg]) return; // reported by the token test
      const ratio = contrastRatio(t[fg], t[bg]);
      assert.ok(ratio >= min, `${t[fg]} on ${t[bg]} is ${ratio.toFixed(2)}:1`);
    });
  }
}
