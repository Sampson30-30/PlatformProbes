import { GALLERY } from '../data/gallery.js';
import { renderBlocks } from '../assets/blocks.js';
import { DEMOS } from '../assets/demos.js';
import { inline } from '../lib/text.js';
import { PAGE_HELP } from '../data/help.js';

export function buildGallery(main) {
  const article = document.createElement('article');
  article.className = 'prose prose--wide';
  article.innerHTML = `
    <header class="topic-head">
      <p class="eyebrow">Gallery</p>
      <h1>What code can do</h1>
      <p class="topic-question">What becomes possible when a rule can make the page?</p>
      <p class="topic-summary">${inline(GALLERY.intro)}</p>
    </header>`;

  const grid = document.createElement('lk-grid-explorer');
  grid.setAttribute('label', 'Things code can do');
  grid.setAttribute('columns', '3');
  grid.setAttribute('level', '2');

  for (const ex of GALLERY.exhibits) {
    const cell = document.createElement('div');
    cell.setAttribute('data-lk-cell', ex.title);
    cell.className = 'exhibit';
    renderBlocks(cell, [
      { type: 'p', text: ex.idea },
      { type: 'h', level: 3, text: 'What it is made of' },
      { type: 'list', items: ex.madeOf },
      { type: 'h', level: 3, text: 'The rule behind it' },
      { type: 'p', text: ex.rule },
    ]);
    if (ex.demo) {
      const demoWrap = document.createElement('div');
      demoWrap.className = 'demo-box';
      const label = document.createElement('p');
      label.className = 'demo-box__label';
      label.textContent = 'Try it';
      demoWrap.append(label);
      DEMOS[ex.demo](demoWrap);
      cell.append(demoWrap);
    }
    renderBlocks(cell, [
      { type: 'h', level: 3, text: 'In your teaching' },
      { type: 'p', text: ex.inTeaching },
      { type: 'say', title: 'How to ask for it', phrases: ex.ask },
      { type: 'callout', tone: 'warning', title: 'Be careful', text: ex.careful },
    ]);
    grid.append(cell);
  }
  article.append(grid);
  renderBlocks(article, [{ type: 'callout', tone: 'success', title: GALLERY.outro.title, text: GALLERY.outro.text }]);
  main.append(article);
  return { title: 'What code can do', navId: 'gallery', help: PAGE_HELP.gallery };
}
