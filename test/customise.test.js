import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildOverrideCss, sanitizeValue, TOKEN_ORDER } from '../src/core/customise.js';

test('sanitizeValue rejects anything that could escape a declaration', () => {
  assert.equal(sanitizeValue('  #fff '), '#fff');
  assert.equal(sanitizeValue('red; } body { display: none'), null);
  assert.equal(sanitizeValue('url(x) /* hi */'), null);
  assert.equal(sanitizeValue(''), null);
  assert.equal(sanitizeValue(undefined), null);
  assert.equal(sanitizeValue('3px 3px 0 0 var(--lk-color-text)'), '3px 3px 0 0 var(--lk-color-text)');
});

test('buildOverrideCss writes only the changes, for a themed base', () => {
  const css = buildOverrideCss({
    base: 'clean',
    light: { 'color-primary': '#0a5c55' },
    dark: { 'color-primary': '#5eead4' },
    shared: { radius: '8px' },
  });
  assert.match(css, /Load this after learnkit\.css and themes\/clean\.css/);
  assert.match(css, /@layer lk\.theme \{/);
  assert.match(css, /\[data-lk-theme='clean'\] \{[\s\S]*?--lk-color-primary: #0a5c55;[\s\S]*?--lk-radius: 8px;/);
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
  assert.match(css, /\[data-lk-theme='clean'\]:not\(\[data-lk-mode='light'\]\)/);
  assert.match(css, /\[data-lk-theme='clean'\]\[data-lk-mode='dark'\] \{[\s\S]*--lk-color-primary: #5eead4;/);
  assert.doesNotMatch(css, /--lk-color-text/);
});

test('buildOverrideCss targets :root for the default look and orders tokens', () => {
  const css = buildOverrideCss({ base: '', light: { 'color-primary': '#111111', 'color-bg': '#ffffff' } });
  assert.match(css, /Load this after learnkit\.css\. \*\//);
  assert.match(css, /  :root \{/);
  assert.ok(css.indexOf('--lk-color-bg') < css.indexOf('--lk-color-primary'), 'follows TOKEN_ORDER');
  assert.doesNotMatch(css, /prefers-color-scheme/, 'no dark block when nothing changed in dark');
});

test('buildOverrideCss handles no changes, bad bases and unsafe values', () => {
  assert.match(buildOverrideCss({ base: 'clean' }), /No changes yet/);
  assert.match(buildOverrideCss({ base: "x'] { }" , light: { radius: '1px' } }), /  :root \{/);
  const css = buildOverrideCss({ base: 'soft', light: { 'color-primary': 'red; } body { x: y' }, shared: { radius: '4px' } });
  assert.doesNotMatch(css, /body/);
  assert.ok(TOKEN_ORDER.includes('radius'));
});
