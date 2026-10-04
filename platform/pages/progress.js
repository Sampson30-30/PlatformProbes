import { PROGRESS } from '../data/progress.js';
import { parseRatings, compareRatings, answeredPrompts } from '../lib/progress.js';
import { findTopic } from '../data/habits.js';
import { renderBlocks } from '../assets/blocks.js';
import { inline } from '../lib/text.js';

const stored = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

function ratingBlock(name, summary = false) {
  return {
    type: 'rating',
    name,
    label: PROGRESS.label,
    scale: PROGRESS.scale,
    low: PROGRESS.low,
    high: PROGRESS.high,
    summary,
    statements: PROGRESS.statements.map((s) => s.text),
  };
}

export function buildProgress(main) {
  const article = document.createElement('article');
  article.className = 'prose prose--wide';
  article.innerHTML = `
    <header class="topic-head">
      <p class="eyebrow">Progress</p>
      <h1>Where you are</h1>
      <p class="topic-question">What has changed in how I work?</p>
      <p class="topic-summary">${inline(PROGRESS.text.intro)}</p>
    </header>`;

  const before = document.createElement('section');
  before.innerHTML = '<h2 class="b-h">1. Now</h2>';
  renderBlocks(before, [ratingBlock('hb-baseline')]);

  const after = document.createElement('section');
  after.innerHTML = `<h2 class="b-h">2. After you have practised</h2><p class="b-p">${inline(PROGRESS.text.afterIntro)}</p>`;
  renderBlocks(after, [ratingBlock('hb-after')]);

  const compare = document.createElement('section');
  compare.setAttribute('aria-labelledby', 'compare-title');
  const compareBody = document.createElement('div');
  compare.innerHTML = `<h2 class="b-h" id="compare-title">3. Side by side</h2><p class="b-p">${inline(PROGRESS.text.compareIntro)}</p>`;
  compare.append(compareBody);

  const labels = PROGRESS.statements.map((s) => findTopic(s.habit).short);
  const drawCompare = () => {
    const n = PROGRESS.statements.length;
    const result = compareRatings(parseRatings(stored('lk-rating:hb-baseline'), n), parseRatings(stored('lk-rating:hb-after'), n), labels);
    compareBody.replaceChildren();
    if (!result.rows.some((r) => r.before !== null || r.after !== null)) {
      compareBody.append(Object.assign(document.createElement('p'), { className: 'b-p', textContent: PROGRESS.text.nothingYet }));
      return;
    }
    const cell = (v) => (v === null ? 'Not rated' : `${v} of ${PROGRESS.scale}`);
    renderBlocks(compareBody, [{
      type: 'compare',
      caption: 'Your ratings',
      head: ['Habit', 'Now', 'After', 'Change'],
      rows: result.rows.map((r) => [r.label, cell(r.before), cell(r.after), r.change || 'Not yet']),
    }]);
    if (result.complete) {
      const p = document.createElement('p');
      p.className = 'b-p';
      p.setAttribute('role', 'status');
      p.textContent = `Your average went from ${result.averageBefore} to ${result.averageAfter} out of ${PROGRESS.scale}. ${PROGRESS.text.caveat}`;
      compareBody.append(p);
    }
  };
  drawCompare();
  document.addEventListener('lk-rate', () => setTimeout(drawCompare, 0));

  const journals = document.createElement('section');
  journals.innerHTML = `<h2 class="b-h">4. Your reflections</h2><p class="b-p">${inline(PROGRESS.text.journalsIntro)}</p>`;
  const list = document.createElement('ul');
  list.className = 'b-list';
  for (const j of PROGRESS.journals) {
    const done = answeredPrompts(stored(`lk-journal:${j.name}`));
    const li = document.createElement('li');
    li.innerHTML = `<a href="${j.href}">${inline(j.label)}</a>: ${done} of ${j.prompts} answered`;
    list.append(li);
  }
  const briefSaved = stored('hb-brief');
  const li = document.createElement('li');
  li.innerHTML = briefSaved ? 'You have a brief saved in the <a href="brief.html">brief builder</a>.' : 'You have not started a brief yet. Try the <a href="brief.html">brief builder</a>.';
  list.append(li);
  journals.append(list);

  article.append(before, after, compare, journals);
  main.append(article);
  return { title: 'Progress', navId: 'progress' };
}
