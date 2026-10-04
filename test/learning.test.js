import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle, startDeck, answerCard, deckSummary } from '../src/core/flashcards.js';
import { shuffledOrder, moveItem, checkOrder, moveMessage } from '../src/core/order.js';
import { parsePercent, exploredText } from '../src/core/spots.js';

const seeded = (values) => { let i = 0; return () => values[i++ % values.length]; };

test('shuffle keeps every item and does not change the input', () => {
  const input = [1, 2, 3, 4, 5];
  const out = shuffle(input, seeded([0.1, 0.9, 0.5, 0.3]));
  assert.deepEqual([...out].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
});

test('a known card leaves the queue, an unknown card goes to the back', () => {
  let state = startDeck([0, 1, 2]);
  state = answerCard(state, false);
  assert.deepEqual(state.queue, [1, 2, 0]);
  state = answerCard(state, true);
  assert.deepEqual(state.queue, [2, 0]);
  assert.deepEqual(state.missed, [0]);
  assert.equal(state.answered, 2);
});

test('the deck finishes when every card has been known, and counts first-time answers', () => {
  let state = startDeck([0, 1, 2]);
  state = answerCard(state, false); // 0 missed
  state = answerCard(state, true); // 1
  state = answerCard(state, true); // 2
  state = answerCard(state, false); // 0 missed again
  state = answerCard(state, true); // 0
  const summary = deckSummary(state);
  assert.equal(summary.done, true);
  assert.equal(summary.firstTime, 2);
  assert.deepEqual(summary.missed, [0]);
});

test('answering an empty deck changes nothing', () => {
  const state = startDeck([]);
  assert.equal(answerCard(state, true), state);
  assert.equal(deckSummary(state).done, true);
});

test('shuffledOrder is never the correct order and keeps every item', () => {
  for (let n = 2; n <= 6; n++) {
    for (let k = 0; k < 20; k++) {
      const order = shuffledOrder(n);
      assert.deepEqual([...order].sort(), [...Array(n).keys()]);
      assert.ok(!order.every((v, i) => v === i), `n=${n}`);
    }
  }
  assert.deepEqual(shuffledOrder(1), [0]);
  assert.deepEqual(shuffledOrder(0), []);
});

test('shuffledOrder repairs a shuffle that lands on the answer', () => {
  const order = shuffledOrder(3, () => 0.999); // an identity shuffle
  assert.ok(!order.every((v, i) => v === i));
});

test('moveItem moves, clamps and leaves the input alone', () => {
  const order = [0, 1, 2, 3];
  assert.deepEqual(moveItem(order, 0, 2), [1, 2, 0, 3]);
  assert.deepEqual(moveItem(order, 3, 0), [3, 0, 1, 2]);
  assert.deepEqual(moveItem(order, 1, -5), [1, 0, 2, 3]);
  assert.deepEqual(moveItem(order, 1, 99), [0, 2, 3, 1]);
  assert.equal(moveItem(order, 9, 0), order);
  assert.deepEqual(order, [0, 1, 2, 3]);
});

test('checkOrder marks each position', () => {
  assert.deepEqual(checkOrder([0, 2, 1, 3]), { correct: [true, false, false, true], score: 2, total: 4, complete: false });
  assert.equal(checkOrder([0, 1, 2]).complete, true);
});

test('moveMessage is 1-based', () => {
  assert.equal(moveMessage('Plan', 1, 4), 'Plan moved to position 2 of 4');
});

test('parsePercent reads percentages and clamps', () => {
  assert.equal(parsePercent('30'), 30);
  assert.equal(parsePercent(' 42.5% '), 42.5);
  assert.equal(parsePercent('150'), 100);
  assert.equal(parsePercent('-4'), 0);
  assert.equal(parsePercent('oops'), 50);
  assert.equal(parsePercent(undefined, 10), 10);
});

test('exploredText reports progress and completion', () => {
  assert.equal(exploredText(2, 4), '2 of 4 explored');
  assert.equal(exploredText(4, 4), 'All 4 explored');
  assert.equal(exploredText(0, 0), '');
});
