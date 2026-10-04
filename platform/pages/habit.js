import { ALL_TOPICS, findTopic } from '../data/habits.js';
import { renderBlocks } from '../assets/blocks.js';
import { inline, escapeHtml } from '../lib/text.js';
import { PAGE_HELP } from '../data/help.js';

export function buildHabit(main, params) {
  const topic = findTopic(params.get('h') || 'reach');
  if (!topic) {
    main.innerHTML = `<section class="prose"><h1>We could not find that page</h1><p class="b-p">Try the <a href="index.html#habits">list of habits</a>.</p></section>`;
    return { title: 'Not found', navId: 'habits' };
  }

  const article = document.createElement('article');
  article.className = 'prose';
  const eyebrow = topic.number === 0 ? 'Before you start' : `Habit ${topic.number} of 6`;
  article.innerHTML = `
    <header class="topic-head">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h1>${inline(topic.title)}</h1>
      <p class="topic-question"><span class="visually-hidden">The question: </span>${inline(topic.question)}</p>
      <p class="topic-summary">${inline(topic.summary)}</p>
    </header>`;

  if (topic.ready) {
    renderBlocks(article, topic.blocks);
  } else {
    renderBlocks(article, [{ type: 'callout', tone: 'info', title: 'This page is still being written', text: 'The question above is settled. The examples and practice are on their way.' }]);
  }

  const index = ALL_TOPICS.indexOf(topic);
  const prev = ALL_TOPICS[index - 1];
  const next = ALL_TOPICS[index + 1];
  const pager = document.createElement('nav');
  pager.className = 'pager';
  pager.setAttribute('aria-label', 'Previous and next');
  pager.innerHTML = `
    ${prev ? `<a class="pager__prev" href="habit.html?h=${prev.id}"><span class="pager__label">Previous</span> ${inline(prev.title)}</a>` : '<span></span>'}
    ${next ? `<a class="pager__next" href="habit.html?h=${next.id}"><span class="pager__label">Next</span> ${inline(next.title)}</a>` : '<span></span>'}`;
  article.append(pager);
  main.append(article);

  return { title: topic.title, navId: topic.number === 0 ? 'reach' : 'habits', help: topic.number === 0 ? PAGE_HELP.reach : PAGE_HELP.habit(topic) };
}
