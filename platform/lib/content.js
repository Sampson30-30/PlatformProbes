// The shape of content, and checks for it. Pure functions, no DOM access.
// Used by the tests so that a mistake in a content file fails loudly.

import { parseQuiz } from '../../src/core/quiz.js';
import { parseScenario } from '../../src/core/scenario.js';
import { prepare } from '../../src/core/flow.js';

/** Required fields for each kind of content block. */
export const BLOCK_TYPES = {
  p: ['text'],
  h: ['text'],
  list: ['items'],
  quote: ['text'],
  callout: ['title', 'text'],
  compare: ['head', 'rows'],
  say: ['title', 'phrases'],
  quiz: ['data'],
  scenario: ['data'],
  spectrum: ['statement', 'left', 'right'],
  journal: ['name', 'prompts'],
  timeline: ['items'],
  grid: ['label', 'cells'],
  accordion: ['label', 'items'],
  rating: ['label', 'statements'],
  process: ['label', 'steps'],
  flow: ['label', 'items'],
};

/** Returns a list of problems with a list of blocks. An empty list means it is fine. */
export function validateBlocks(blocks, where = 'blocks') {
  const problems = [];
  if (!Array.isArray(blocks)) return [`${where} must be a list`];
  blocks.forEach((block, i) => {
    const at = `${where}[${i}]`;
    const required = BLOCK_TYPES[block?.type];
    if (!required) {
      problems.push(`${at} has an unknown type "${block?.type}"`);
      return;
    }
    for (const field of required) {
      const value = block[field];
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        problems.push(`${at} (${block.type}) is missing "${field}"`);
      }
    }
    if (block.type === 'quiz') {
      const quiz = parseQuiz(block.data);
      if (quiz.questions.length === 0 || quiz.problems.length) problems.push(`${at} quiz: ${quiz.problems[0] || 'no questions'}`);
    }
    if (block.type === 'scenario') {
      const scenario = parseScenario(block.data);
      if (scenario.problems.length) problems.push(`${at} scenario: ${scenario.problems[0]}`);
    }
    if (block.type === 'compare') {
      for (const row of block.rows || []) {
        if (row.length !== block.head.length) problems.push(`${at} compare has a row with the wrong number of cells`);
      }
    }
    if (block.type === 'process') {
      (block.steps || []).forEach((step, n) => {
        if (!step.title) problems.push(`${at} step ${n + 1} has no title`);
        problems.push(...validateBlocks(step.blocks, `${at} step ${n + 1}`));
      });
    }
    if (block.type === 'flow') problems.push(...flowProblems(block, at));
    if (block.type === 'journal') {
      for (const p of block.prompts || []) if (!p.prompt) problems.push(`${at} journal has a prompt with no text`);
    }
  });
  return problems;
}

/** Problems with a flow block: empty text, unlabelled answers, or items the layout would ignore. */
function flowProblems(block, at) {
  const problems = [];
  const check = (items, where) => {
    if (!Array.isArray(items) || items.length === 0) {
      problems.push(`${at} flow: ${where} has no items`);
      return;
    }
    items.forEach((item, i) => {
      const here = `${where} item ${i + 1}`;
      if (!item?.text) problems.push(`${at} flow: ${here} has no text`);
      const branches = item?.branches ?? [];
      branches.forEach((branch, n) => {
        if (!branch.label) problems.push(`${at} flow: ${here} branch ${n + 1} has no label`);
        check(branch.items, `${here} branch ${n + 1}`);
      });
      if (branches.length === 1) problems.push(`${at} flow: ${here} has a single branch, which is not a decision`);
    });
  };
  check(block.items, 'the chart');
  if (problems.length === 0) {
    const graph = prepare(structuredClone(block.items), { rejoin: block.layout !== 'tree' });
    problems.push(...graph.warnings.map((w) => `${at} flow: ${w}`));
  }
  return problems;
}

/** Yields every string inside nested data. Used to check wording rules. */
export function* walkStrings(value) {
  if (typeof value === 'string') yield value;
  else if (Array.isArray(value)) for (const v of value) yield* walkStrings(v);
  else if (value && typeof value === 'object') for (const v of Object.values(value)) yield* walkStrings(v);
}

const EM_DASH = /—/;
const US_SPELLINGS = /\b(colou?rs?\b(?<!colour|colours)|behaviou?rs?\b(?<!behaviour|behaviours)|organi[sz]ation|organiz\w+|analy[sz]e|analyz\w+|center(?:s|ed)?\b|favorite|customiz\w+|realiz\w+|prioritiz\w+|summariz\w+|recogniz\w+|licen[cs]e\b(?<!licence)|catalog\b|neighbor\w*|gray\b)/i;

/** Wording rules for content: no em dashes, British spelling. Returns a list of problems. */
export function checkWording(data, where = 'content') {
  const problems = [];
  for (const raw of walkStrings(data)) {
    const text = raw.replace(/`[^`]*`/g, '');
    if (EM_DASH.test(text)) problems.push(`${where}: em dash in "${text.slice(0, 50)}"`);
    const us = text.match(US_SPELLINGS);
    if (us) problems.push(`${where}: American spelling "${us[0]}" in "${text.slice(0, 50)}"`);
  }
  return problems;
}
