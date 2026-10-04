import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNumber, detectType, sortIndexes, nextDirection, matchRow, tableSummary } from '../src/core/table.js';

test('parseNumber reads currency, commas and percentages', () => {
  assert.equal(parseNumber('£1,250'), 1250);
  assert.equal(parseNumber(' 42% '), 42);
  assert.equal(parseNumber('-3.5'), -3.5);
  assert.ok(Number.isNaN(parseNumber('')));
  assert.ok(Number.isNaN(parseNumber('12 weeks')));
  assert.ok(Number.isNaN(parseNumber('1.2.3')));
});

test('detectType needs every filled value to be a number', () => {
  assert.equal(detectType(['1', '20', '']), 'number');
  assert.equal(detectType(['1', 'two']), 'text');
  assert.equal(detectType(['', '']), 'text');
});

test('sortIndexes sorts numbers by value, not as text', () => {
  assert.deepEqual(sortIndexes(['10', '9', '100'], 'number', 'ascending'), [1, 0, 2]);
  assert.deepEqual(sortIndexes(['10', '9', '100'], 'number', 'descending'), [2, 0, 1]);
});

test('sortIndexes sorts text naturally and ignores case', () => {
  assert.deepEqual(sortIndexes(['b2', 'A', 'b10'], 'text', 'ascending'), [1, 0, 2]);
});

test('sortIndexes puts empty values last in both directions and is stable', () => {
  assert.deepEqual(sortIndexes(['', 'a', 'a', 'b'], 'text', 'ascending'), [1, 2, 3, 0]);
  assert.deepEqual(sortIndexes(['', 'a', 'a', 'b'], 'text', 'descending'), [3, 1, 2, 0]);
});

test('nextDirection cycles through ascending, descending and none', () => {
  assert.equal(nextDirection('none'), 'ascending');
  assert.equal(nextDirection('ascending'), 'descending');
  assert.equal(nextDirection('descending'), 'none');
});

test('matchRow needs every word and ignores case', () => {
  assert.ok(matchRow(['Maths', 'Level 2'], 'maths 2'));
  assert.ok(!matchRow(['Maths', 'Level 2'], 'maths 3'));
  assert.ok(matchRow(['x'], '   '));
});

test('tableSummary reads naturally', () => {
  assert.equal(tableSummary(8, 8), '8 rows');
  assert.equal(tableSummary(1, 1), '1 row');
  assert.equal(tableSummary(3, 8), 'Showing 3 of 8 rows');
  assert.equal(tableSummary(0, 8), 'No rows match');
  assert.equal(tableSummary(0, 0), 'No rows');
});
