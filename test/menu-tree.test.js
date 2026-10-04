import { test } from 'node:test';
import assert from 'node:assert/strict';
import { menuTarget, nextQuery, typeaheadIndex } from '../src/core/keys.js';
import { visibleIndexes, levelOf, treeKey } from '../src/core/tree.js';
import { alignedPosition } from '../src/core/position.js';

test('menuTarget moves, wraps and skips disabled items', () => {
  const enabled = [true, false, true, true];
  assert.equal(menuTarget('ArrowDown', 0, enabled), 2);
  assert.equal(menuTarget('ArrowDown', 3, enabled), 0);
  assert.equal(menuTarget('ArrowUp', 0, enabled), 3);
  assert.equal(menuTarget('ArrowUp', 2, enabled), 0);
  assert.equal(menuTarget('Home', 3, enabled), 0);
  assert.equal(menuTarget('End', 0, enabled), 3);
  assert.equal(menuTarget('ArrowDown', -1, enabled), 0);
  assert.equal(menuTarget('ArrowUp', -1, enabled), 3);
  assert.equal(menuTarget('x', 2, enabled), 2);
  assert.equal(menuTarget('ArrowDown', 1, [false, false]), 1);
});

test('nextQuery joins quick keystrokes and restarts after a pause', () => {
  assert.equal(nextQuery('', 0, 'a', 100), 'a');
  assert.equal(nextQuery('a', 100, 'b', 300), 'ab');
  assert.equal(nextQuery('ab', 300, 'c', 2000), 'c');
  assert.equal(nextQuery('ab', 300, 'ArrowDown', 400), 'ab');
});

test('typeaheadIndex finds the next match, cycles one letter, and skips disabled', () => {
  const labels = ['Archive', 'Assign', 'Block', 'Duplicate'];
  const enabled = [true, true, true, true];
  assert.equal(typeaheadIndex(labels, enabled, -1, 'b'), 2);
  assert.equal(typeaheadIndex(labels, enabled, 0, 'a'), 1);
  assert.equal(typeaheadIndex(labels, enabled, 1, 'a'), 0);
  assert.equal(typeaheadIndex(labels, enabled, 0, 'as'), 1);
  assert.equal(typeaheadIndex(labels, enabled, 0, 'z'), -1);
  assert.equal(typeaheadIndex(labels, [true, false, true, true], 0, 'as'), -1);
  assert.equal(typeaheadIndex(labels, enabled, 0, ''), -1);
});

//  0 Unit 1
//    1 Lesson A
//    2 Lesson B
//      3 Part i
//  4 Unit 2
const NODES = [
  { parent: -1, hasChildren: true },
  { parent: 0, hasChildren: false },
  { parent: 0, hasChildren: true },
  { parent: 2, hasChildren: false },
  { parent: -1, hasChildren: true },
];

test('visibleIndexes hides the children of collapsed branches', () => {
  assert.deepEqual(visibleIndexes(NODES, new Set()), [0, 4]);
  assert.deepEqual(visibleIndexes(NODES, new Set([0])), [0, 1, 2, 4]);
  assert.deepEqual(visibleIndexes(NODES, new Set([2])), [0, 4]); // parent closed
  assert.deepEqual(visibleIndexes(NODES, new Set([0, 2])), [0, 1, 2, 3, 4]);
});

test('levelOf counts depth from one', () => {
  assert.deepEqual(NODES.map((_, i) => levelOf(NODES, i)), [1, 2, 2, 3, 1]);
});

test('treeKey moves through visible items only', () => {
  const open = new Set([0]);
  assert.equal(treeKey(NODES, open, 0, 'ArrowDown').focus, 1);
  assert.equal(treeKey(NODES, open, 2, 'ArrowDown').focus, 4);
  assert.equal(treeKey(NODES, open, 4, 'ArrowDown').focus, 4);
  assert.equal(treeKey(NODES, open, 0, 'ArrowUp').focus, 0);
  assert.equal(treeKey(NODES, open, 4, 'ArrowUp').focus, 2);
  assert.equal(treeKey(NODES, open, 2, 'Home').focus, 0);
  assert.equal(treeKey(NODES, open, 0, 'End').focus, 4);
});

test('treeKey: right opens, then enters; left closes, then goes to the parent', () => {
  assert.equal(treeKey(NODES, new Set(), 0, 'ArrowRight').open, 0);
  assert.equal(treeKey(NODES, new Set([0]), 0, 'ArrowRight').focus, 1);
  assert.equal(treeKey(NODES, new Set([0]), 1, 'ArrowRight').focus, 1); // a leaf
  assert.equal(treeKey(NODES, new Set([0]), 0, 'ArrowLeft').close, 0);
  assert.equal(treeKey(NODES, new Set([0]), 1, 'ArrowLeft').focus, 0);
  assert.equal(treeKey(NODES, new Set(), 0, 'ArrowLeft').focus, 0); // a closed root
});

test('treeKey: star opens every closed sibling branch, Enter activates', () => {
  assert.deepEqual(treeKey(NODES, new Set(), 0, '*').expandSiblings, [0, 4]);
  assert.deepEqual(treeKey(NODES, new Set([0]), 0, '*').expandSiblings, [4]);
  assert.equal(treeKey(NODES, new Set(), 4, 'Enter').activate, true);
  assert.equal(treeKey(NODES, new Set(), 4, ' ').activate, true);
});

test('alignedPosition opens below, flips above when cramped, and stays on screen', () => {
  const viewport = { width: 800, height: 600 };
  const size = { width: 200, height: 150 };
  assert.deepEqual(alignedPosition({ anchor: { top: 100, left: 50, width: 100, height: 30 }, size, viewport }), { top: 134, left: 50, side: 'bottom' });
  assert.equal(alignedPosition({ anchor: { top: 540, left: 50, width: 100, height: 30 }, size, viewport }).side, 'top');
  assert.equal(alignedPosition({ anchor: { top: 100, left: 760, width: 40, height: 30 }, size, viewport }).left, 592);
  assert.equal(alignedPosition({ anchor: { top: 100, left: 300, width: 100, height: 30 }, size, viewport, rtl: true }).left, 200);
});
