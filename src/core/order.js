// DOM-free logic for <lk-order>. An "order" is an array where position i holds
// the index of the item shown there. The correct order is [0, 1, 2, ...].

import { shuffle } from './flashcards.js';

/** A shuffled order that is never already correct (when there is more than one item). */
export function shuffledOrder(count, random = Math.random) {
  const correct = [...Array(count).keys()];
  if (count < 2) return correct;
  let order = shuffle(correct, random);
  // Rotate by one if the shuffle landed on the answer. Rotation of a sorted list is never sorted.
  if (order.every((v, i) => v === i)) order = [...order.slice(1), order[0]];
  return order;
}

/** Moves the item at `from` to `to`. Out of range targets are clamped. Returns a new array. */
export function moveItem(order, from, to) {
  if (from < 0 || from >= order.length) return order;
  const target = Math.min(Math.max(to, 0), order.length - 1);
  if (target === from) return order;
  const out = [...order];
  const [item] = out.splice(from, 1);
  out.splice(target, 0, item);
  return out;
}

/** Marks each position right or wrong. */
export function checkOrder(order) {
  const correct = order.map((value, position) => value === position);
  const score = correct.filter(Boolean).length;
  return { correct, score, total: order.length, complete: score === order.length };
}

/** The sentence announced after a move. Positions are shown 1-based. */
export function moveMessage(label, position, total) {
  return `${label} moved to position ${position + 1} of ${total}`;
}
