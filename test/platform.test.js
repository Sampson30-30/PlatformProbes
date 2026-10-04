// Checks the platform's content and structure, so a slip in a data file fails loudly.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { escapeHtml, inline, isSafeHref, plain } from '../platform/lib/text.js';
import { validateBlocks, checkWording, walkStrings } from '../platform/lib/content.js';
import { NAV, SITE } from '../platform/data/site.js';
import { HOME } from '../platform/data/home.js';
import { ALL_TOPICS, HABITS, REACH } from '../platform/data/habits.js';
import { CASES } from '../platform/data/cases/world-time-map.js';
import { GALLERY } from '../platform/data/gallery.js';
import { WORDS, WORDS_TEXT } from '../platform/data/words.js';
import { COACH } from '../platform/data/coach.js';
import { slug, filterEntries, collectPhrases } from '../platform/lib/words.js';

const root = new URL('../platform/', import.meta.url);
const pageFiles = new Set(readdirSync(root).filter((f) => f.endsWith('.html')));

// ---- text helpers ----

test('inline escapes everything and only allows small markup', () => {
  assert.equal(inline('a <b>x</b> & "y"'), 'a &lt;b&gt;x&lt;/b&gt; &amp; &quot;y&quot;');
  assert.equal(inline('**bold** and `code`'), '<strong>bold</strong> and <code>code</code>');
  assert.equal(inline('[Habit](habit.html?h=derive)'), '<a href="habit.html?h=derive">Habit</a>');
  assert.equal(inline('[Out](https://example.com/a?b=1&c=2)'), '<a href="https://example.com/a?b=1&amp;c=2" rel="noopener noreferrer">Out</a>');
  assert.doesNotMatch(inline('[Bad](javascript:alert(1))'), /<a /, 'unsafe links are dropped');
  assert.equal(inline('[Bad](http://example.com)'), 'Bad');
  assert.equal(inline('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('isSafeHref and plain behave', () => {
  assert.ok(isSafeHref('index.html#habits'));
  assert.ok(isSafeHref('#top'));
  assert.ok(!isSafeHref('//evil.example'));
  assert.ok(!isSafeHref('data:text/html,hi'));
  assert.equal(plain('**a** [b](x.html) `c`'), 'a b c');
  assert.equal(escapeHtml("it's"), 'it&#39;s');
});

test('wording checks catch em dashes and American spellings but allow code', () => {
  assert.equal(checkWording({ a: 'plain text' }).length, 0);
  assert.equal(checkWording({ a: 'a — b' }).length, 1);
  assert.ok(checkWording({ a: 'the color of it' }).length >= 1);
  assert.ok(checkWording({ a: 'organize this' }).length >= 1);
  assert.equal(checkWording({ a: 'the colour and behaviour' }).length, 0);
  assert.equal(checkWording({ a: 'set `--lk-color-text` here' }).length, 0);
});

test('validateBlocks reports missing fields and unknown types', () => {
  assert.deepEqual(validateBlocks([{ type: 'p', text: 'ok' }]), []);
  assert.ok(validateBlocks([{ type: 'p' }])[0].includes('missing "text"'));
  assert.ok(validateBlocks([{ type: 'nope' }])[0].includes('unknown type'));
  assert.ok(validateBlocks([{ type: 'compare', head: ['a', 'b'], rows: [['1']] }]).some((p) => p.includes('wrong number')));
  assert.ok(validateBlocks([{ type: 'quiz', data: { questions: [{ prompt: 'x', options: ['a', 'b'] }] } }]).length > 0);
  assert.ok(validateBlocks('nope')[0].includes('must be a list'));
});

// ---- the site itself ----

test('every ready page in the navigation has a file', () => {
  for (const page of NAV.filter((n) => n.ready)) {
    const file = page.href.split(/[?#]/)[0];
    assert.ok(pageFiles.has(file) || existsSync(new URL(file, root)), `${page.id}: ${file} is missing`);
  }
  assert.equal(new Set(NAV.map((n) => n.id)).size, NAV.length, 'navigation ids are unique');
});

test('topics are well formed, and ready ones have valid blocks', () => {
  assert.equal(HABITS.length, 6);
  assert.equal(new Set(ALL_TOPICS.map((t) => t.id)).size, ALL_TOPICS.length, 'ids are unique');
  assert.equal(REACH.number, 0);
  HABITS.forEach((h, i) => assert.equal(h.number, i + 1));
  for (const t of ALL_TOPICS) {
    for (const field of ['id', 'short', 'title', 'question', 'summary']) assert.ok(t[field], `${t.id} needs ${field}`);
    assert.ok(t.question.endsWith('?'), `${t.id} question should end with a question mark`);
    if (t.ready) {
      assert.ok(t.blocks.length > 0, `${t.id} is ready but has no blocks`);
      assert.deepEqual(validateBlocks(t.blocks, t.id), []);
    }
  }
});

test('internal links in content point to real pages and topics', () => {
  const topicIds = new Set(ALL_TOPICS.map((t) => t.id));
  const known = (href) => {
    if (href.startsWith('https://') || href.startsWith('#')) return true;
    const [file, query = ''] = href.split('#')[0].split('?');
    if (!existsSync(new URL(file, root))) return false;
    const h = new URLSearchParams(query).get('h');
    return !h || topicIds.has(h);
  };
  const all = [SITE, HOME, ALL_TOPICS, CASES, GALLERY, WORDS];
  for (const data of all) {
    for (const text of walkStrings(data)) {
      for (const [, , href] of text.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
        assert.ok(known(href), `broken link "${href}" in "${text.slice(0, 40)}"`);
      }
    }
  }
});

test('home, site and topic wording follows the house rules', () => {
  assert.deepEqual(checkWording(HOME, 'home'), []);
  assert.deepEqual(checkWording(SITE, 'site'), []);
  assert.deepEqual(checkWording(ALL_TOPICS, 'topics'), []);
  assert.deepEqual(validateBlocks(HOME.blocks, 'home'), []);
});

test('case files are well formed, free of names and follow the wording rules', () => {
  assert.ok(CASES.length >= 1);
  for (const study of CASES) {
    assert.deepEqual(validateBlocks(study.blocks, study.id), []);
    assert.deepEqual(checkWording(study, study.id), []);
    const text = [...walkStrings(study)].join(' ');
    // The repository is public, so no real colleague is ever named.
    for (const name of ['Sam', 'Freeman', 'Kirsty', 'Matt ', 'Emma', 'Alex']) {
      assert.ok(!new RegExp(`\\b${name.trim()}\\b`).test(text), `case file mentions "${name.trim()}"`);
    }
  }
});

test('the case file has a decision at each step of its process', () => {
  const process = CASES[0].blocks.find((b) => b.type === 'process');
  assert.ok(process.steps.length >= 8);
  for (const step of process.steps) {
    assert.ok(step.blocks.some((b) => b.type === 'quiz'), `step "${step.title}" has no decision`);
  }
});

test('gallery exhibits are complete, honest about their limits and well worded', () => {
  assert.equal(GALLERY.exhibits.length, 8);
  assert.equal(new Set(GALLERY.exhibits.map((e) => e.id)).size, 8);
  const demos = new Set(['sun', 'zones', 'memory', 'paths', 'views', 'whatif', 'marking']);
  for (const ex of GALLERY.exhibits) {
    for (const field of ['title', 'idea', 'rule', 'inTeaching', 'careful']) assert.ok(ex[field], `${ex.id} needs ${field}`);
    assert.ok(ex.madeOf.length >= 2, `${ex.id} should say what it is made of`);
    assert.ok(ex.ask.length >= 1, `${ex.id} should say how to ask for it`);
    assert.ok(ex.demo === null || demos.has(ex.demo), `${ex.id} has an unknown demo`);
  }
  assert.deepEqual(checkWording(GALLERY, 'gallery'), []);
});

test('vocabulary entries are complete, unique and linked to real habits', () => {
  assert.ok(WORDS.length >= 20);
  const slugs = new Set();
  const topicIds = new Set(ALL_TOPICS.map((t) => t.id));
  for (const w of WORDS) {
    for (const field of ['term', 'plain', 'example', 'cost', 'ask', 'habit']) assert.ok(w[field], `${w.term} needs ${field}`);
    assert.ok(topicIds.has(w.habit), `${w.term} points at an unknown habit`);
    assert.ok(!slugs.has(slug(w.term)), `duplicate term ${w.term}`);
    slugs.add(slug(w.term));
    assert.ok(w.plain.length < 200, `${w.term}: keep the plain meaning short`);
  }
  assert.deepEqual(checkWording({ WORDS, WORDS_TEXT }, 'words'), []);
});

test('search finds terms and aliases first, then meanings, and ignores case and punctuation', () => {
  const names = (q) => filterEntries(WORDS, q).map((w) => w.term);
  assert.equal(slug('Edge case'), 'edge-case');
  assert.equal(filterEntries(WORDS, '').length, WORDS.length);
  assert.equal(names('hard-coded')[0], 'Hardcoded');
  assert.equal(names('LIBRARY')[0], 'Library');
  assert.equal(names('framework')[0], 'Library');
  assert.equal(names('spec')[0], 'Specification');
  assert.ok(names('summer').length === 0 || names('summer').every((t) => typeof t === 'string'));
  assert.deepEqual(names('zzzz'), []);
  assert.ok(names('typed in').includes('Derived'), 'matches inside the plain meaning');
});

test('the phrasebook gathers every say block exactly once', () => {
  const groups = collectPhrases(ALL_TOPICS);
  assert.equal(groups.length, 7);
  const total = groups.reduce((n, g) => n + g.phrases.length, 0);
  const expected = ALL_TOPICS.flatMap((t) => t.blocks.filter((b) => b.type === 'say').flatMap((b) => b.phrases)).length;
  assert.equal(total, expected);
  assert.ok(total >= 25);
});

test('the coach guide is valid, honest about its limits and well worded', () => {
  assert.deepEqual(validateBlocks(COACH.blocks, 'coach'), []);
  assert.deepEqual(checkWording(COACH, 'coach'), []);
  const accordion = COACH.blocks.find((b) => b.type === 'accordion');
  assert.equal(accordion.items.length, ALL_TOPICS.length, 'coaching notes for the reach check and every habit');
  assert.ok(COACH.honest.includes('not yet been tried'));
  const text = [...walkStrings(COACH)].join(' ');
  for (const name of ['Sam', 'Freeman', 'Kirsty', 'Emma', 'Alex']) assert.ok(!new RegExp(`\\b${name}\\b`).test(text), name);
});
