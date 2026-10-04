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
