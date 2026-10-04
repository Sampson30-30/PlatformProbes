import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseScenario } from '../src/core/scenario.js';

const data = {
  start: 'a',
  nodes: {
    a: { text: 'Start', choices: [{ text: 'Left', goto: 'b' }, { text: 'Right', goto: 'c' }, { text: 'Lost', goto: 'zzz' }] },
    b: { text: 'Good', end: true, outcome: 'good' },
    c: { text: 'Bad', outcome: 'poor' },
    orphan: { text: 'Never shown' },
  },
};

test('parseScenario keeps valid choices, marks endings and reports problems', () => {
  const s = parseScenario(data);
  assert.equal(s.start, 'a');
  assert.deepEqual(s.nodes.a.choices.map((c) => c.goto), ['b', 'c']);
  assert.equal(s.nodes.b.end, true);
  assert.equal(s.nodes.c.end, true, 'no choices means an ending');
  assert.equal(s.nodes.b.outcome, 'good');
  assert.equal(s.nodes.c.outcome, 'poor');
  assert.equal(s.problems.length, 2);
  assert.ok(s.problems.some((p) => p.includes('missing node "zzz"')));
  assert.ok(s.problems.some((p) => p.includes('"orphan" can never be reached')));
});

test('parseScenario accepts arrays, defaults the start and survives junk', () => {
  const s = parseScenario({ nodes: [{ id: 'x', text: 'Only' }] });
  assert.equal(s.start, 'x');
  assert.equal(parseScenario(null).start, '');
  assert.ok(parseScenario(null).problems.length > 0);
  assert.equal(parseScenario({ start: 'nope', nodes: { q: { text: '' } } }).start, 'q');
});
