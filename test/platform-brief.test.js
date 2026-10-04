import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyBrief, checkBrief, briefToMarkdown } from '../platform/lib/brief.js';
import { EXAMPLE, KINDS, ORIGINS, PLACES, CHECKS, BRIEF_TEXT } from '../platform/data/brief.js';
import { checkWording } from '../platform/lib/content.js';

const gaps = (brief) => checkBrief(brief).filter((r) => r.level === 'gap');

test('an empty brief has gaps on every step that needs input', () => {
  const steps = new Set(gaps(emptyBrief()).map((g) => g.step));
  assert.deepEqual([...steps].sort(), [0, 1, 2, 3, 4]);
});

test('the example brief is a good one: no gaps', () => {
  assert.deepEqual(gaps(EXAMPLE), []);
});

test('the example uses only the options the form offers', () => {
  for (const p of EXAMPLE.parts) {
    assert.ok(KINDS.includes(p.kind), p.kind);
    assert.ok(ORIGINS.includes(p.origin), p.origin);
  }
  assert.ok(PLACES.includes(EXAMPLE.place));
  for (const c of EXAMPLE.checks) assert.ok(CHECKS.includes(c), c);
});

test('tips point out recalled information, open questions and missing rules', () => {
  const brief = structuredClone(EXAMPLE);
  brief.parts = [
    { name: 'The list of capitals', kind: 'Information', origin: 'I make it myself', note: '' },
    { name: 'Layout', kind: 'A design choice', origin: 'I make it myself', note: '' },
    { name: 'The platform', kind: 'A limit (where it lives)', origin: 'Someone else has to tell me', note: '' },
  ];
  const messages = checkBrief(brief).map((r) => r.message).join('\n');
  assert.match(messages, /making yourself/);
  assert.match(messages, /Ask about "The platform"/);
  assert.match(messages, /Nothing is worked out by a rule/);
});

test('vague behaviour and a missing real-world test are flagged', () => {
  const brief = structuredClone(EXAMPLE);
  brief.behaviour = 'It looks nicer and feels modern.';
  brief.checks = ['Keyboard only'];
  const tips = checkBrief(brief).filter((r) => r.level === 'tip').map((r) => r.message).join('\n');
  assert.match(tips, /does not say what the user does/);
  assert.match(tips, /real place it will live/);
});

test('a part with no kind or origin is a gap', () => {
  const brief = structuredClone(EXAMPLE);
  brief.parts[0].origin = '';
  assert.ok(gaps(brief).some((g) => /where it comes from/.test(g.message)));
});

test('the brief is written as Markdown with every section, and table cells are safe', () => {
  const brief = structuredClone(EXAMPLE);
  brief.parts[0].note = 'a | b\nnext line';
  const md = briefToMarkdown(brief);
  for (const heading of ['## What I want', '## What it is made of', '## What it should do', '## What must not change or break', '## Where it will live', '## How I will know it works', '## How I would like to work with you']) {
    assert.ok(md.includes(heading), heading);
  }
  assert.ok(md.includes('| Coastlines | Information | Fetched from a trusted source | a / b next line |'));
  assert.ok(md.startsWith('# Brief: A live world map'));
  assert.ok(md.includes('- Several dates, not only today'));
  assert.ok(briefToMarkdown(emptyBrief()).includes('(not said)'));
});

test('brief wording follows the house rules', () => {
  assert.deepEqual(checkWording({ EXAMPLE, KINDS, ORIGINS, PLACES, CHECKS, BRIEF_TEXT }, 'brief'), []);
});
