import { COACH } from '../data/coach.js';
import { renderBlocks } from '../assets/blocks.js';
import { inline } from '../lib/text.js';

export function buildCoach(main) {
  const article = document.createElement('article');
  article.className = 'prose prose--wide';
  article.innerHTML = `
    <header class="topic-head">
      <p class="eyebrow">Coach’s guide</p>
      <h1>Running a session</h1>
      <p class="topic-question">How do I help a group get something from this?</p>
      <p class="topic-summary">${inline(COACH.intro)}</p>
    </header>`;
  renderBlocks(article, [{ type: 'callout', tone: 'info', title: 'A note on honesty', text: COACH.honest }]);
  renderBlocks(article, COACH.blocks);
  main.append(article);
  return { title: 'Coach’s guide', navId: 'coach' };
}
