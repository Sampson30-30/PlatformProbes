import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHex, contrastRatio, grade } from '../src/core/contrast.js';

test('parseHex handles short, long and invalid values', () => {
  assert.deepEqual(parseHex('#fff'), [255, 255, 255]);
  assert.deepEqual(parseHex('#0f766e'), [15, 118, 110]);
  assert.equal(parseHex('red'), null);
});

test('contrastRatio matches known values', () => {
  assert.equal(contrastRatio('#000000', '#ffffff').toFixed(2), '21.00');
  assert.equal(contrastRatio('#777777', '#ffffff').toFixed(2), '4.48');
  assert.ok(Number.isNaN(contrastRatio('nope', '#fff')));
});

test('grade maps ratios to levels', () => {
  assert.equal(grade(21), 'AAA');
  assert.equal(grade(4.5), 'AA');
  assert.equal(grade(3.2), 'AA large');
  assert.equal(grade(2), 'fail');
});

import { toHex6, checkTokens, themeChecks } from '../src/core/contrast.js';

test('toHex6 expands and normalises hex colours', () => {
  assert.equal(toHex6('#FFF'), '#ffffff');
  assert.equal(toHex6('#0F766E'), '#0f766e');
  assert.equal(toHex6('rgb(0 0 0)'), null);
});

test('checkTokens reports pass and fail per pair and skips unusable ones', () => {
  const tokens = { 'color-text': '#000000', 'color-bg': '#ffffff', 'color-surface': '#777777', 'color-focus': '#cccccc', 'color-page': 'rgb(1 2 3)' };
  const results = checkTokens(tokens);
  const byLabel = Object.fromEntries(results.map((r) => [r.label, r]));
  assert.equal(byLabel['text on bg'].pass, true);
  assert.equal(byLabel['text on surface'].pass, true);
  assert.equal(byLabel['focus on bg'].pass, false);
  assert.equal(byLabel['focus on bg'].min, 3);
  assert.equal(byLabel['text on page'], undefined, 'non-hex colours are skipped');
  assert.equal(checkTokens({ 'color-text': '#666666', 'color-bg': '#ffffff' }, { strictText: 7 })[0].pass, false);
  assert.equal(themeChecks().length, 19);
});
