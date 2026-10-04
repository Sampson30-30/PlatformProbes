import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initials, toneIndex, pageWindow, collapseCrumbs } from '../src/core/widgets.js';

test('initials takes the first and last words', () => {
  assert.equal(initials('Ada Lovelace'), 'AL');
  assert.equal(initials('grace'), 'G');
  assert.equal(initials('Mary Ann Evans'), 'ME');
  assert.equal(initials('  '), '');
  assert.equal(initials(undefined), '');
});

test('toneIndex is stable and in range', () => {
  assert.equal(toneIndex('Ada', 5), toneIndex('Ada', 5));
  for (const n of ['a', 'Grace Hopper', '']) assert.ok(toneIndex(n, 5) >= 0 && toneIndex(n, 5) < 5);
  assert.equal(toneIndex('x', 0), 0);
});

test('pageWindow shows everything when small', () => {
  assert.deepEqual(pageWindow(1, 1), [1]);
  assert.deepEqual(pageWindow(2, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(pageWindow(1, 0), []);
});

test('pageWindow uses gaps only where they hide two or more pages', () => {
  assert.deepEqual(pageWindow(1, 10), [1, 2, null, 10]);
  assert.deepEqual(pageWindow(5, 10), [1, null, 4, 5, 6, null, 10]);
  assert.deepEqual(pageWindow(3, 10), [1, 2, 3, 4, null, 10]);
  assert.deepEqual(pageWindow(10, 10), [1, null, 9, 10]);
});

test('pageWindow clamps a page outside the range', () => {
  assert.deepEqual(pageWindow(99, 10), [1, null, 9, 10]);
  assert.deepEqual(pageWindow(-4, 10), [1, 2, null, 10]);
});

test('collapseCrumbs keeps the first and the last items', () => {
  assert.deepEqual(collapseCrumbs(3, 4), { visible: [0, 1, 2], hidden: [] });
  assert.deepEqual(collapseCrumbs(6, 4), { visible: [0, 3, 4, 5], hidden: [1, 2] });
  assert.deepEqual(collapseCrumbs(6, 0), { visible: [0, 1, 2, 3, 4, 5], hidden: [] });
});
