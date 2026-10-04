// The platform explains itself in plain English. Every page says what it is and
// what you can do on it, interactive parts carry a short hint, and any technical
// word in the body links to its plain meaning.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PAGE_HELP, BLOCK_HELP, canFromBlocks, hintFor } from '../platform/data/help.js';
import { NAV } from '../platform/data/site.js';
import { ALL_TOPICS } from '../platform/data/habits.js';
import { CASES } from '../platform/data/cases/world-time-map.js';
import { HOME } from '../platform/data/home.js';
import { GALLERY } from '../platform/data/gallery.js';
import { COACH } from '../platform/data/coach.js';
import { PROGRESS } from '../platform/data/progress.js';
import { WORDS } from '../platform/data/words.js';
import { slug } from '../platform/lib/words.js';
import { plain, inline } from '../platform/lib/text.js';
import { walkStrings, checkWording, validateBlocks } from '../platform/lib/content.js';
import { jargonIn, longSentences } from './plain.js';

const everyHelp = () => {
  const out = [];
  for (const [key, help] of Object.entries(PAGE_HELP)) {
    if (typeof help === 'function') continue;
    out.push([key, help]);
  }
  for (const t of ALL_TOPICS) out.push([`habit ${t.id}`, PAGE_HELP.habit(t)]);
  for (const c of CASES) out.push([`case ${c.id}`, PAGE_HELP.case(c)]);
  return out;
};

test('every page in the navigation says what it is and what you can do', () => {
  const keyFor = { home: 'home', reach: 'reach', habits: 'habit', case: 'case', gallery: 'gallery', brief: 'brief', words: 'words', progress: 'progress', coach: 'coach' };
  for (const page of NAV.filter((n) => n.ready)) {
    assert.ok(keyFor[page.id], `no help for the "${page.id}" page`);
    assert.ok(PAGE_HELP[keyFor[page.id]], `PAGE_HELP is missing "${keyFor[page.id]}"`);
  }
});

test('page help has a sentence on what the page is and a short list of things to do', () => {
  for (const [key, help] of everyHelp()) {
    assert.ok(help.what && help.what.length > 30, `${key}: what`);
    assert.ok(help.can.length >= 2 && help.can.length <= 7, `${key}: ${help.can.length} things to do`);
    for (const item of help.can) assert.ok(item.length < 170, `${key}: keep "${item.slice(0, 40)}" short`);
  }
});

test('helper text uses no developer jargon, short sentences, British spelling', () => {
  const texts = [];
  for (const [key, help] of everyHelp()) texts.push([key, help.what, ...help.can]);
  for (const [key, source] of Object.entries(BLOCK_HELP)) {
    if (typeof source === 'function') texts.push([`hint ${key}`, source({ walkthrough: true }), source({ walkthrough: false })]);
    else texts.push([`hint ${key}`, source]);
  }
  for (const [key, ...parts] of texts) {
    for (const part of parts) {
      const text = plain(part);
      assert.deepEqual(jargonIn(text), [], `${key}: jargon in "${text.slice(0, 60)}"`);
      assert.deepEqual(longSentences(text), [], `${key}: a sentence is too long`);
      assert.deepEqual(checkWording(part, key), []);
    }
  }
});

test('what you can do on a page follows what is actually on it', () => {
  const reach = ALL_TOPICS.find((t) => t.id === 'reach');
  const can = canFromBlocks(reach.blocks).join(' ');
  assert.match(can, /chart/);
  assert.match(can, /reflection/);
  assert.match(can, /phrase/);
  const verify = ALL_TOPICS.find((t) => t.id === 'verify');
  assert.match(canFromBlocks(verify.blocks).join(' '), /tile/);
  assert.deepEqual(canFromBlocks([{ type: 'p', text: 'x' }, { type: 'compare', head: [], rows: [] }]), []);
  assert.equal(canFromBlocks([{ type: 'quiz' }, { type: 'quiz' }]).length, 1, 'each kind once');
});

test('a hint appears above the first of each kind only, and a block can change or hide it', () => {
  const seen = new Set();
  assert.match(hintFor({ type: 'quiz' }, seen), /Check answer/);
  assert.equal(hintFor({ type: 'quiz' }, seen), null);
  assert.equal(hintFor({ type: 'p' }, seen), null);
  assert.equal(hintFor({ type: 'journal', help: false }, seen), null);
  assert.equal(hintFor({ type: 'journal', help: 'Your own words.' }, seen), 'Your own words.');
  assert.match(hintFor({ type: 'flow', walkthrough: true }, seen), /highlighted/);
  assert.match(hintFor({ type: 'flow' }, seen), /Read the chart/);
});

// ---- words in the body link to their plain meaning ----

const DATA = {
  home: HOME,
  gallery: GALLERY,
  coach: COACH,
  progress: PROGRESS,
  ...Object.fromEntries(ALL_TOPICS.map((t) => [`habit ${t.id}`, t])),
  ...Object.fromEntries(CASES.map((c) => [`case ${c.id}`, c])),
};
const TERMS = new Set(WORDS.map((w) => slug(w.term)));
const linkTargets = (text) => [...text.matchAll(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g)].map((m) => slug(m[2] || m[1]));

test('every [[term]] link points at a real entry on the Words page', () => {
  let count = 0;
  for (const [key, data] of [...Object.entries(DATA), ['words', WORDS]]) {
    for (const text of walkStrings(data)) {
      for (const target of linkTargets(text)) {
        count += 1;
        assert.ok(TERMS.has(target), `${key}: "${target}" is not a term on the Words page`);
      }
    }
  }
  assert.ok(count >= 8, 'some words are linked');
});

test('a link to a term renders as a link to its anchor', () => {
  assert.equal(inline('use a [[script]]'), 'use a <a class="term" href="words.html#script">script</a>');
  assert.equal(inline('plain [[HTML|HTML, CSS and JavaScript]]'), 'plain <a class="term" href="words.html#html-css-and-javascript">HTML</a>');
  assert.equal(plain('a [[script]] and [[HTML|HTML, CSS and JavaScript]]'), 'a script and HTML');
});

test('a technical word in the body is linked to its meaning at least once on the page', () => {
  const NEEDS = [
    [/\b(?:HTML|CSS|JavaScript)\b/, 'html-css-and-javascript'],
    [/\blibrar(?:y|ies)\b/i, 'library'],
    [/\bscripts?\b/i, 'script'],
    [/\bembed(?:s|ded)?\b/i, 'embed'],
    [/\bframeworks?\b/i, 'framework'],
    [/\bbuild steps?\b/i, 'build-step'],
    [/\bdependenc(?:y|ies)\b/i, 'dependency'],
  ];
  for (const [key, data] of Object.entries(DATA)) {
    const strings = [...walkStrings(data)];
    const linked = new Set(strings.flatMap(linkTargets));
    const bare = strings.map((t) => t.replace(/\[\[[^\]]+\]\]/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ')).join('\n');
    for (const [pattern, term] of NEEDS) {
      if (pattern.test(bare)) assert.ok(linked.has(term), `${key}: uses a word for "${term}" and never links it to the Words page`);
    }
  }
});

test('phrases to copy contain no link markup', () => {
  const blocks = [...ALL_TOPICS.flatMap((t) => t.blocks), ...CASES.flatMap((c) => c.blocks), ...GALLERY.exhibits.map((e) => ({ type: 'say', phrases: e.ask }))];
  for (const block of blocks.filter((b) => b.type === 'say')) for (const phrase of block.phrases) assert.ok(!phrase.includes('[['), `"${phrase}"`);
  assert.deepEqual(validateBlocks(HOME.blocks, 'home'), []);
});
