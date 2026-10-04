import { findCase } from '../data/cases/world-time-map.js';
import { renderBlocks } from '../assets/blocks.js';
import { inline } from '../lib/text.js';
import { PAGE_HELP } from '../data/help.js';

export function buildCase(main, params) {
  const study = findCase(params.get('c') || 'world-time-map');
  if (!study) {
    main.innerHTML = `<section class="prose"><h1>We could not find that case file</h1><p class="b-p">Try the <a href="case.html?c=world-time-map">world time map</a>.</p></section>`;
    return { title: 'Not found', navId: 'case' };
  }
  const article = document.createElement('article');
  article.className = 'prose prose--wide';
  article.innerHTML = `
    <header class="topic-head">
      <p class="eyebrow">Case file</p>
      <h1>${inline(study.title.replace(/^Case file: /, ''))}</h1>
      <p class="topic-question">${inline(study.question)}</p>
      <p class="topic-summary">${inline(study.summary)}</p>
    </header>`;
  renderBlocks(article, study.blocks);
  main.append(article);
  return { title: study.title, navId: 'case', help: PAGE_HELP.case(study) };
}
