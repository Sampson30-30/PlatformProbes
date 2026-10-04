import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uid, clamp, wrap, toggleOpen, normaliseOpen, percent, stepState, toastDuration, gridMove } from '../src/core/utils.js';

test('uid returns unique prefixed ids', () => {
  const a = uid('lk-demo');
  const b = uid('lk-demo');
  assert.match(a, /^lk-demo-\d+$/);
  assert.notEqual(a, b);
});

test('clamp keeps values in range and handles bad input', () => {
  assert.equal(clamp(5, 0, 3), 3);
  assert.equal(clamp(-2, 0, 3), 0);
  assert.equal(clamp('2', 0, 3), 2);
  assert.equal(clamp('nope', 0, 3), 0);
});

test('wrap loops indexes around both ends', () => {
  assert.equal(wrap(-1, 4), 3);
  assert.equal(wrap(4, 4), 0);
  assert.equal(wrap(2, 4), 2);
  assert.equal(wrap(1, 0), 0);
});

test('toggleOpen opens, closes and respects single mode', () => {
  assert.deepEqual(toggleOpen([], 1), [1]);
  assert.deepEqual(toggleOpen([1], 2), [2]);
  assert.deepEqual(toggleOpen([1], 1), []);
  assert.deepEqual(toggleOpen([2], 0, true), [0, 2]);
  assert.deepEqual(toggleOpen([0, 2], 2, true), [0]);
});

test('normaliseOpen keeps one item in single mode', () => {
  assert.deepEqual(normaliseOpen([1, 2], false), [1]);
  assert.deepEqual(normaliseOpen([1, 2], true), [1, 2]);
  assert.deepEqual(normaliseOpen([], false), []);
});

test('percent clamps and rounds', () => {
  assert.equal(percent(40, 100), 40);
  assert.equal(percent(1, 3), 33);
  assert.equal(percent(5, 0), 0);
  assert.equal(percent(150, 100), 100);
  assert.equal(percent(-5, 100), 0);
  assert.equal(percent('x', 100), 0);
});

test('stepState labels steps relative to the current one', () => {
  assert.equal(stepState(0, 1), 'complete');
  assert.equal(stepState(1, 1), 'current');
  assert.equal(stepState(2, 1), 'upcoming');
});

test('toastDuration scales with length and keeps errors until dismissed', () => {
  assert.equal(toastDuration('Saved', 'success'), 4300);
  assert.ok(toastDuration('x'.repeat(100), 'info') > toastDuration('Saved', 'info'));
  assert.equal(toastDuration('x'.repeat(1000), 'info'), 15000);
  assert.equal(toastDuration('Failed', 'danger'), 0);
});

test('gridMove navigates a grid in reading order', () => {
  // 3 columns, 8 items:  0 1 2 / 3 4 5 / 6 7
  assert.equal(gridMove(0, 'ArrowRight', 3, 8), 1);
  assert.equal(gridMove(7, 'ArrowRight', 3, 8), 7);
  assert.equal(gridMove(0, 'ArrowLeft', 3, 8), 0);
  assert.equal(gridMove(1, 'ArrowDown', 3, 8), 4);
  assert.equal(gridMove(5, 'ArrowDown', 3, 8), 5);
  assert.equal(gridMove(4, 'ArrowUp', 3, 8), 1);
  assert.equal(gridMove(1, 'ArrowUp', 3, 8), 1);
  assert.equal(gridMove(4, 'Home', 3, 8), 0);
  assert.equal(gridMove(4, 'End', 3, 8), 7);
  assert.equal(gridMove(4, 'a', 3, 8), 4);
});
