import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepare, walkStart, walkCurrent, walkOptions, walkChoose, walkBack, walkFinished, routeText } from '../src/core/flow.js';

const model = () => [
  { text: 'Work arrives', type: 'start' },
  {
    text: 'On time?',
    branches: [
      { label: 'Yes', items: [{ text: 'Mark normally' }] },
      {
        label: 'No',
        items: [
          { text: 'Extension agreed?', branches: [
            { label: 'Yes', items: [{ text: 'Mark normally, note it' }] },
            { label: 'No', items: [{ text: 'Apply penalty' }, { text: 'Tell the learner', type: 'end' }] },
          ] },
        ],
      },
    ],
  },
  { text: 'Return feedback', type: 'end' },
];

const byText = (g, text) => Object.values(g.nodes).find((n) => n.text === text);

test('prepare numbers items in reading order and works out types', () => {
  const g = prepare(model());
  assert.equal(g.items[0].id, 'n1');
  assert.equal(g.items[1].id, 'n2');
  assert.equal(g.items[1].type, 'decision');
  assert.equal(g.items[0].type, 'start');
  assert.equal(byText(g, 'Mark normally').type, 'step');
  assert.equal(g.start, 'n1');
  assert.deepEqual(g.warnings, []);
});

test('branches rejoin what follows the decision', () => {
  const g = prepare(model());
  const target = byText(g, 'Return feedback').id;
  assert.equal(byText(g, 'Mark normally').edges[0].to, target);
  assert.equal(byText(g, 'Mark normally, note it').edges[0].to, target);
});

test('a branch that ends does not rejoin', () => {
  const g = prepare(model());
  assert.deepEqual(byText(g, 'Tell the learner').edges, []);
  assert.equal(byText(g, 'Apply penalty').edges[0].to, byText(g, 'Tell the learner').id);
});

test('decision edges carry the branch labels', () => {
  const g = prepare(model());
  assert.deepEqual(byText(g, 'On time?').edges.map((e) => e.label), ['Yes', 'No']);
});

test('joins are marked only where a branch really flows on, however deeply nested', () => {
  const g = prepare(model());
  const outer = g.items[1];
  assert.deepEqual(outer.branches.map((b) => b.joins), [true, true]);
  const inner = outer.branches[1].items[0];
  // The inner decision is last in its branch, but "Return feedback" still follows further out.
  assert.deepEqual(inner.branches.map((b) => b.joins), [true, false]);
  assert.equal(g.items[2].hasNext, false);
});

test('a decision that ends the flow never joins', () => {
  const g = prepare([{ text: 'Q', branches: [{ label: 'a', items: [{ text: 'A', type: 'end' }] }, { label: 'b', items: [{ text: 'B' }] }] }, { text: 'After' }]);
  assert.deepEqual(g.items[0].branches.map((b) => b.joins), [false, true]);
});

test('an empty branch skips straight to what follows', () => {
  const g = prepare([{ text: 'Need it?', branches: [{ label: 'Yes', items: [{ text: 'Do it' }] }, { label: 'No', items: [] }] }, { text: 'Finish' }]);
  const q = byText(g, 'Need it?');
  assert.equal(q.edges[1].to, byText(g, 'Finish').id);
  assert.equal(q.edges[0].to, byText(g, 'Do it').id);
});

test('a tree has no rejoining, and drops anything after a decision with a warning', () => {
  const g = prepare([{ text: 'Q', branches: [{ label: 'a', items: [{ text: 'A' }] }, { label: 'b', items: [{ text: 'B' }] }] }, { text: 'Ignored' }], { rejoin: false });
  assert.equal(g.warnings.length, 1);
  assert.equal(byText(g, 'Ignored'), undefined);
  assert.deepEqual(byText(g, 'A').edges, []);
  assert.deepEqual(g.items[0].branches.map((b) => b.joins), [false, false]);
});

test('an end with branches loses them, with a warning', () => {
  const g = prepare([{ text: 'Done', type: 'end', branches: [{ label: 'x', items: [{ text: 'X' }] }] }]);
  assert.equal(g.warnings.length, 1);
  assert.deepEqual(g.nodes[g.start].edges, []);
});

test('empty and odd input does not throw', () => {
  assert.equal(prepare([]).start, null);
  assert.deepEqual(walkStart(prepare([])), { path: [] });
  const g = prepare([{ text: 'Only', type: 'nonsense', branches: [] }]);
  assert.equal(g.nodes[g.start].type, 'step');
});

test('walking: options, choosing, route and finishing', () => {
  const g = prepare(model());
  let s = walkStart(g);
  assert.equal(walkCurrent(g, s).text, 'Work arrives');
  assert.deepEqual(walkOptions(g, s), [{ index: 0, to: 'n2', label: 'Next' }]);
  s = walkChoose(g, s, 0);
  assert.deepEqual(walkOptions(g, s).map((o) => o.label), ['Yes', 'No']);
  s = walkChoose(g, s, 1); // No
  s = walkChoose(g, s, 1); // Extension: No
  assert.equal(walkCurrent(g, s).text, 'Apply penalty');
  s = walkChoose(g, s, 0);
  assert.equal(walkFinished(g, s), true);
  assert.deepEqual(routeText(g, s), ['Work arrives', 'On time?', 'No', 'Extension agreed?', 'No', 'Apply penalty', 'Tell the learner']);
});

test('walking: going back, bad choices and unlabelled options', () => {
  const g = prepare([{ text: 'Q', branches: [{ items: [{ text: 'A' }] }, { items: [{ text: 'B' }] }] }]);
  let s = walkStart(g);
  assert.deepEqual(walkOptions(g, s).map((o) => o.label), ['Option 1', 'Option 2']);
  assert.equal(walkChoose(g, s, 9), s);
  const moved = walkChoose(g, s, 1);
  assert.equal(walkCurrent(g, moved).text, 'B');
  assert.deepEqual(walkBack(moved), s);
  assert.equal(walkBack(s), s);
});

test('a decision-free flow joins one step to the next and the last one finishes', () => {
  const g = prepare([{ text: 'One' }, { text: 'Two' }]);
  let s = walkChoose(g, walkStart(g), 0);
  assert.equal(walkCurrent(g, s).text, 'Two');
  assert.equal(walkFinished(g, s), true);
});

test('detail is kept on items and nodes, and defaults to empty', () => {
  const g = prepare([{ text: 'Title', detail: '  More words.  ' }, { text: 'Plain' }]);
  assert.equal(g.nodes.n1.detail, 'More words.');
  assert.equal(g.nodes.n2.detail, '');
  assert.equal(g.items[0].detail, 'More words.');
});
