import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describePosition, compareToExpert, summariseRatings } from '../src/core/scales.js';

test('describePosition names the position', () => {
  assert.equal(describePosition(50, 'A', 'B'), 'In the middle between A and B');
  assert.equal(describePosition(58, 'A', 'B'), 'Slightly towards B');
  assert.equal(describePosition(30, 'A', 'B'), 'Towards A');
  assert.equal(describePosition(80, 'A', 'B'), 'Strongly towards B');
  assert.equal(describePosition(0, 'A', 'B'), 'Fully A');
  assert.equal(describePosition(100, 'A', 'B'), 'Fully B');
  assert.equal(describePosition('x', 'A', 'B'), 'Fully A');
});

test('compareToExpert gives distance and a closeness word', () => {
  assert.deepEqual(compareToExpert(62, 75), { difference: 13, closeness: 'fairly near' });
  assert.deepEqual(compareToExpert(70, 75), { difference: 5, closeness: 'close to' });
  assert.deepEqual(compareToExpert(10, 90), { difference: 80, closeness: 'far from' });
});

test('summariseRatings averages and finds focus areas', () => {
  assert.deepEqual(summariseRatings([5, 2, null, 4], 5), { total: 4, answered: 3, complete: false, average: 3.7, focus: [1] });
  const all = summariseRatings([1, 5], 5);
  assert.equal(all.complete, true);
  assert.deepEqual(all.focus, [0]);
  assert.deepEqual(summariseRatings([], 5), { total: 0, answered: 0, complete: false, average: 0, focus: [] });
  assert.deepEqual(summariseRatings([3, 1], 3).focus, [1]);
});
