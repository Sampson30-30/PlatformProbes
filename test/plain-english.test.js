// The pages a colleague might land on explain themselves in plain English.
// Each has an "About this page" panel with the two parts, and the helper text
// uses none of the words that need a developer's background.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { jargonIn, longSentences, textOf, guideIn } from './plain.js';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

const PAGES = ['index.html', 'gallery/index.html', 'customiser/index.html', 'examples/index.html'];

for (const file of PAGES) {
  test(`${file} has an "About this page" panel with both parts`, () => {
    const guide = guideIn(read(file));
    assert.ok(guide, 'no <details class="lk-guide"> found');
    assert.match(guide, /<summary>About this page<\/summary>/);
    assert.match(guide, /What this is\./);
    assert.match(guide, /What you can do here/);
    assert.match(guide, /<ul>[\s\S]*<li>/, 'a list of things to do');
  });

  test(`${file} helper text uses no developer jargon and short sentences`, () => {
    const html = read(file);
    const guide = textOf(guideIn(html));
    assert.deepEqual(jargonIn(guide), [], `jargon in the panel: ${jargonIn(guide)}`);
    assert.deepEqual(longSentences(guide), [], 'sentences over 28 words');
  });
}

test('the home page introduction and card descriptions are in plain English', () => {
  const html = read('index.html');
  const tagline = textOf(html.match(/<p class="tagline">[\s\S]*?<\/p>/)[0]);
  assert.deepEqual(jargonIn(tagline), []);
  const cards = [...html.matchAll(/<p>([\s\S]*?)<\/p><\/a>/g)].map((m) => textOf(m[1]));
  // The cards for people who look after the code may use their own words.
  const forEveryone = cards.filter((c) => /building block|look|Rise course|Every part/.test(c));
  assert.ok(forEveryone.length >= 4, 'the cards for everyone were found');
  for (const text of forEveryone) assert.deepEqual(jargonIn(text), [], `jargon in "${text}"`);
});

test('the customiser and gallery section notes are in plain English', () => {
  for (const file of ['customiser/index.html', 'gallery/index.html']) {
    const notes = [...read(file).matchAll(/<p class="note">([\s\S]*?)<\/p>/g)].map((m) => textOf(m[1]));
    for (const text of notes) assert.deepEqual(jargonIn(text), [], `${file}: jargon in "${text}"`);
  }
});

test('the Rise test explains itself before it asks anything', () => {
  const html = read('rise-test/index.html');
  const intro = textOf(html.slice(html.indexOf('<h1>'), html.indexOf('<h2>What this page found')));
  assert.match(intro, /What this is\./);
  assert.match(intro, /changes nothing in your course/);
  assert.deepEqual(jargonIn(intro.replace(/Rise compatibility test/, '')), []);
});
