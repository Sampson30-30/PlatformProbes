import { WORDS, WORDS_TEXT } from '../data/words.js';
import { ALL_TOPICS, findTopic } from '../data/habits.js';
import { filterEntries, collectPhrases, slug } from '../lib/words.js';
import { renderBlocks } from '../assets/blocks.js';
import { inline } from '../lib/text.js';
import { PAGE_HELP } from '../data/help.js';

function entryNode(entry) {
  const topic = findTopic(entry.habit);
  const node = document.createElement('article');
  node.className = 'word';
  node.id = slug(entry.term);
  node.innerHTML = `
    <h3>${inline(entry.term)}</h3>
    <p class="word__plain">${inline(entry.plain)}</p>
    <dl class="word__facts">
      <div><dt>For example</dt><dd>${inline(entry.example)}</dd></div>
      <div><dt>What it costs you if you ignore it</dt><dd>${inline(entry.cost)}</dd></div>
    </dl>`;
  renderBlocks(node, [{ type: 'say', title: 'Say this to Claude', phrases: [entry.ask] }]);
  if (topic) {
    const p = document.createElement('p');
    p.className = 'word__habit';
    p.innerHTML = `Belongs with: <a href="habit.html?h=${topic.id}">${inline(topic.title)}</a>`;
    node.append(p);
  }
  return node;
}

export function buildWords(main) {
  const article = document.createElement('article');
  article.className = 'prose prose--wide';
  article.innerHTML = `
    <header class="topic-head">
      <p class="eyebrow">Words</p>
      <h1>Words that help</h1>
      <p class="topic-question">What do I call the move I want to ask for?</p>
      <p class="topic-summary">${inline(WORDS_TEXT.intro)}</p>
      <p class="word-jump"><a href="#vocabulary">Vocabulary</a> &middot; <a href="#phrasebook">Phrasebook</a></p>
    </header>`;

  const vocab = document.createElement('section');
  vocab.id = 'vocabulary';
  vocab.innerHTML = '<h2 class="b-h">Vocabulary</h2>';
  const search = document.createElement('lk-field');
  search.setAttribute('label', WORDS_TEXT.searchLabel);
  search.setAttribute('hint', WORDS_TEXT.searchHint);
  const input = document.createElement('input');
  input.type = 'search';
  input.autocomplete = 'off';
  search.append(input);
  const status = document.createElement('p');
  status.className = 'word-status';
  status.setAttribute('role', 'status');
  const list = document.createElement('div');
  list.className = 'words';
  vocab.append(search, status, list);

  const nodes = new Map(WORDS.map((w) => [w, entryNode(w)]));
  const draw = () => {
    const found = filterEntries(WORDS, input.value);
    list.replaceChildren(...found.map((w) => nodes.get(w)));
    status.textContent = input.value.trim()
      ? (found.length ? `${found.length} ${found.length === 1 ? 'word matches' : 'words match'}.` : 'Nothing matches. Try fewer letters.')
      : `${WORDS.length} words.`;
  };
  input.addEventListener('input', draw);
  draw();

  const book = document.createElement('section');
  book.id = 'phrasebook';
  book.innerHTML = `<h2 class="b-h">Phrasebook</h2><p class="b-p">${inline(WORDS_TEXT.phraseIntro)}</p>`;
  for (const group of collectPhrases(ALL_TOPICS)) {
    renderBlocks(book, [{ type: 'say', title: group.title, phrases: group.phrases }]);
  }

  article.append(vocab, book);
  main.append(article);

  // Open the entry named in the address, if any, once the list exists.
  const target = location.hash.slice(1);
  if (target && document.getElementById(target)) requestAnimationFrame(() => document.getElementById(target).scrollIntoView());
  return { title: 'Words', navId: 'words', help: PAGE_HELP.words };
}
