import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computePosition } from '../src/core/position.js';

const viewport = { width: 800, height: 600 };
const size = { width: 100, height: 40 };

test('places below and centres on the anchor', () => {
  const r = computePosition({ anchor: { top: 100, left: 300, width: 80, height: 30 }, size, viewport });
  assert.deepEqual(r, { top: 138, left: 290, side: 'bottom' });
});

test('flips to the top when there is no room below', () => {
  const r = computePosition({ anchor: { top: 560, left: 300, width: 80, height: 30 }, size, viewport });
  assert.equal(r.side, 'top');
  assert.equal(r.top, 560 - 40 - 8);
});

test('keeps the preferred side when neither side fits', () => {
  const r = computePosition({ anchor: { top: 10, left: 10, width: 10, height: 10 }, size: { width: 100, height: 700 }, viewport });
  assert.equal(r.side, 'bottom');
});

test('clamps inside the viewport on the cross axis', () => {
  const left = computePosition({ anchor: { top: 100, left: 0, width: 20, height: 20 }, size, viewport });
  assert.equal(left.left, 8);
  const right = computePosition({ anchor: { top: 100, left: 790, width: 10, height: 20 }, size, viewport });
  assert.equal(right.left, 800 - 100 - 8);
});

test('supports left and right placement and an invalid side', () => {
  const a = { top: 200, left: 300, width: 60, height: 40 };
  assert.equal(computePosition({ anchor: a, size, viewport, side: 'right' }).left, 368);
  assert.equal(computePosition({ anchor: a, size, viewport, side: 'left' }).left, 300 - 100 - 8);
  assert.equal(computePosition({ anchor: a, size, viewport, side: 'nonsense' }).side, 'bottom');
});
