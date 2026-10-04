import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseQuiz, scoreQuestion, scoreQuiz, shuffle } from '../src/core/quiz.js';

const sample = {
  title: 'Check',
  questions: [
    { prompt: 'Pick one', options: [{ text: 'A', correct: true, feedback: 'Yes' }, 'B', 'C'] },
    { prompt: 'Pick two', answer: [0, 2], options: ['A', 'B', 'C'], explanation: 'Because' },
    { prompt: '', options: ['A', 'B'] },
    { prompt: 'No right answer', options: ['A', 'B'] },
    { prompt: 'Too few', options: ['A'] },
  ],
};

test('parseQuiz normalises, infers types and reports problems', () => {
  const quiz = parseQuiz(sample);
  assert.equal(quiz.title, 'Check');
  assert.equal(quiz.questions.length, 2);
  assert.equal(quiz.questions[0].type, 'single');
  assert.equal(quiz.questions[0].options[0].feedback, 'Yes');
  assert.equal(quiz.questions[1].type, 'multiple');
  assert.deepEqual(quiz.questions[1].options.map((o) => o.correct), [true, false, true]);
  assert.equal(quiz.problems.length, 3);
});

test('parseQuiz accepts a bare array and tolerates junk', () => {
  assert.equal(parseQuiz([{ prompt: 'Q', answer: 1, options: ['x', 'y'] }]).questions.length, 1);
  assert.equal(parseQuiz(null).questions.length, 0);
  assert.equal(parseQuiz('nope').questions.length, 0);
});

test('scoreQuestion handles single and multiple answers', () => {
  const [single, multi] = parseQuiz(sample).questions;
  assert.equal(scoreQuestion(single, [0]).correct, true);
  assert.equal(scoreQuestion(single, [1]).correct, false);
  assert.equal(scoreQuestion(single, []).correct, false);
  assert.deepEqual(scoreQuestion(multi, [0, 2]), { correct: true, points: 1, hits: 2, wrong: 0, missed: 0 });
  const partial = scoreQuestion(multi, [0]);
  assert.equal(partial.correct, false);
  assert.equal(partial.points, 0.5);
  assert.equal(partial.missed, 1);
  assert.equal(scoreQuestion(multi, [0, 1]).points, 0);
});

test('scoreQuiz totals results', () => {
  const [single, multi] = parseQuiz(sample).questions;
  const result = scoreQuiz([scoreQuestion(single, [0]), scoreQuestion(multi, [0])]);
  assert.deepEqual(result, { total: 2, correct: 1, percent: 50, points: 1.5 });
  assert.deepEqual(scoreQuiz([]), { total: 0, correct: 0, percent: 0, points: 0 });
});

test('shuffle returns a permutation and does not mutate', () => {
  const input = [1, 2, 3, 4, 5];
  let seed = 0.3;
  const rng = () => (seed = (seed * 9301 + 0.49297) % 1);
  const out = shuffle(input, rng);
  assert.deepEqual([...out].sort(), input);
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
});
