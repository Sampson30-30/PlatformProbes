// DOM-free logic for <lk-flashcards>: a queue of cards to get through.
// A card the learner knew leaves the queue. A card they did not know goes to
// the back, so it comes round again.

/** Fisher-Yates shuffle that returns a new array. `random` is injectable for tests. */
export function shuffle(items, random = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Starts a run through the given card indexes. */
export function startDeck(indexes) {
  return { queue: [...indexes], total: indexes.length, missed: [], answered: 0 };
}

/** Records an answer for the card at the front of the queue. Returns a new state. */
export function answerCard(state, known) {
  if (state.queue.length === 0) return state;
  const [card, ...rest] = state.queue;
  const missed = known || state.missed.includes(card) ? state.missed : [...state.missed, card];
  return {
    queue: known ? rest : [...rest, card],
    total: state.total,
    missed,
    answered: state.answered + 1,
  };
}

/** What to show the learner. `firstTime` is cards known without ever being missed. */
export function deckSummary(state) {
  return {
    total: state.total,
    remaining: state.queue.length,
    done: state.queue.length === 0,
    firstTime: state.total - state.missed.length,
    missed: [...state.missed],
  };
}
