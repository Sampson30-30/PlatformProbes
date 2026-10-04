import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, journalToMarkdown, parseStored, serialiseStored } from '../src/core/journal.js';

test('slugify makes safe file names', () => {
  assert.equal(slugify('Week 1: Plan!'), 'week-1-plan');
  assert.equal(slugify('  Café  notes '), 'cafe-notes');
  assert.equal(slugify('???'), 'journal');
});

test('journalToMarkdown formats prompts and empty answers', () => {
  const md = journalToMarkdown({
    title: 'Week 1',
    date: '4 October 2026',
    entries: [
      { prompt: 'What went well?', text: ' Planning. ' },
      { prompt: 'What next?', text: '' },
    ],
  });
  assert.equal(md, '# Week 1\n\n_4 October 2026_\n\n## What went well?\n\nPlanning.\n\n## What next?\n\n_No response._\n');
});

test('stored data round trips and ignores corruption', () => {
  const saved = serialiseStored(['a', '', 'c'], new Date('2026-10-04T10:00:00Z'));
  assert.deepEqual(parseStored(saved), { 0: 'a', 2: 'c' });
  assert.deepEqual(parseStored('not json'), {});
  assert.deepEqual(parseStored('{"entries":{"x":"bad","1":5,"2":"ok"}}'), { 2: 'ok' });
  assert.deepEqual(parseStored(null), {});
});
