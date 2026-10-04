import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uid, clamp, wrap } from '../src/core/utils.js';

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
