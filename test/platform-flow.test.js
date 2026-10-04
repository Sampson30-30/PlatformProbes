import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateBlocks, checkWording } from '../platform/lib/content.js';
import { HOME } from '../platform/data/home.js';
import { reachBlocks } from '../platform/data/topics/reach.js';
import { prepare, walkStart, walkOptions, walkChoose, walkFinished, walkCurrent } from '../src/core/flow.js';

const flowBlock = (over = {}) => ({
  type: 'flow',
  label: 'Test',
  items: [{ text: 'Q?', branches: [{ label: 'Yes', items: [{ text: 'A' }] }, { label: 'No', items: [{ text: 'B' }] }] }],
  ...over,
});

test('a good flow block validates', () => {
  assert.deepEqual(validateBlocks([flowBlock()]), []);
});

test('flow blocks are checked for the mistakes that would break the chart', () => {
  const bad = (items, extra) => validateBlocks([flowBlock({ items, ...extra })]).join(' | ');
  assert.match(validateBlocks([{ type: 'flow', items: [{ text: 'x' }] }]).join(), /missing "label"/);
  assert.match(bad([{ text: '' }]), /no text/);
  assert.match(validateBlocks([flowBlock({ items: [{ text: 'x', detail: 'Fine.' }] })]).join(), /^$/);
  assert.match(bad([{ text: 'Q', branches: [{ label: '', items: [{ text: 'a' }] }, { label: 'No', items: [{ text: 'b' }] }] }]), /no label/);
  assert.match(bad([{ text: 'Q', branches: [{ label: 'Yes', items: [] }, { label: 'No', items: [{ text: 'b' }] }] }]), /no items/);
  assert.match(bad([{ text: 'Q', branches: [{ label: 'Yes', items: [{ text: 'a' }] }] }]), /single branch/);
  assert.match(bad([{ text: 'Q', branches: [{ label: 'Y', items: [{ text: 'a' }] }, { label: 'N', items: [{ text: 'b' }] }] }, { text: 'after' }], { layout: 'tree' }), /nothing can follow a decision/);
});

const flow = reachBlocks.find((b) => b.type === 'flow');

test('the reach page has a decision tree, and it is valid and follows the site wording rules', () => {
  assert.ok(flow, 'the reach page has a flow block');
  assert.deepEqual(validateBlocks(reachBlocks), []);
  assert.deepEqual(checkWording(flow), []);
  assert.equal(flow.layout, 'tree');
  assert.equal(flow.walkthrough, true);
});

test('every path through the reach chart ends in a different result', () => {
  const graph = prepare(structuredClone(flow.items), { rejoin: false });
  const results = [];
  (function walk(state) {
    if (walkFinished(graph, state)) {
      results.push(walkCurrent(graph, state).text);
      return;
    }
    for (const option of walkOptions(graph, state)) walk(walkChoose(graph, state, option.index));
  })(walkStart(graph));
  assert.equal(results.length, 4);
  assert.equal(new Set(results).size, 4);
  for (const id of Object.keys(graph.nodes)) {
    const node = graph.nodes[id];
    if (node.edges.length === 0) assert.ok(node.detail.length > 40, `the result "${node.text}" explains what to do`);
  }
});

// ---- the home page ----


const homeFlow = HOME.blocks.find((b) => b.type === 'flow');

test('the home page has a Rise or build tree that is valid and every path ends in advice', () => {
  assert.ok(homeFlow, 'the home page has a flow block');
  assert.deepEqual(validateBlocks(HOME.blocks, 'home'), []);
  assert.equal(homeFlow.layout, 'tree');
  const graph = prepare(structuredClone(homeFlow.items), { rejoin: false });
  const results = [];
  (function walk(state) {
    if (walkFinished(graph, state)) {
      const node = walkCurrent(graph, state);
      results.push(node);
      return;
    }
    for (const option of walkOptions(graph, state)) walk(walkChoose(graph, state, option.index));
  })(walkStart(graph));
  assert.equal(results.length, 4);
  for (const node of results) assert.ok(node.detail.length > 40, `"${node.text}" says what to do next`);
  assert.equal(results.filter((n) => n.text === 'Use Rise').length, 2, 'there are two honest ways to land on Rise');
  assert.equal(results.filter((n) => n.text.startsWith('Build it')).length, 2);
});

test('the first thing the tree says is that Rise is often right', () => {
  const first = homeFlow.items[0].branches[0];
  assert.equal(first.label, 'Yes');
  assert.equal(first.items[0].text, 'Use Rise');
});
