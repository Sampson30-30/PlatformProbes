import { SITE, NAV } from '../data/site.js';
import { HOME } from '../data/home.js';
import { HABITS } from '../data/habits.js';
import { renderBlocks } from '../assets/blocks.js';
import { inline } from '../lib/text.js';
import { PAGE_HELP } from '../data/help.js';

export function buildHome(main) {
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
    <h1>${inline(SITE.name)}</h1>
    <p class="hero__tagline">${inline(SITE.tagline)}</p>
    <p class="hero__lede">${inline(HOME.lede)}</p>
    <p><a class="lk-button" data-variant="primary" href="${HOME.start.href}">${inline(HOME.start.label)}</a></p>`;
  main.append(hero);

  const intro = document.createElement('section');
  intro.className = 'prose';
  renderBlocks(intro, HOME.blocks);
  main.append(intro);

  const habits = document.createElement('section');
  habits.id = 'habits';
  habits.className = 'prose';
  habits.innerHTML = `<h2 class="b-h">The six habits</h2><p class="b-p">${inline(HOME.habitsIntro)}</p>`;
  renderBlocks(habits, [{
    type: 'grid',
    label: 'The six habits',
    columns: 3,
    cells: HABITS.map((h) => ({
      title: `${h.number}. ${h.short}`,
      body: `**${h.question}** ${h.summary} [Open this habit](habit.html?h=${h.id})`,
    })),
  }]);
  main.append(habits);

  const path = document.createElement('section');
  path.className = 'prose';
  path.innerHTML = `<h2 class="b-h">${inline(HOME.pathTitle)}</h2><p class="b-p">${inline(HOME.pathIntro)}</p>`;
  const ordered = [
    ['reach', 'Check what your Claude can reach.'],
    ['habits', 'Read the six habits, in any order.'],
    ['case', 'Follow a real build in the case file.'],
    ['gallery', 'Browse what code can do that Rise cannot.'],
    ['brief', 'Use the brief builder on an idea of your own.'],
  ];
  const items = ordered.flatMap(([id, text]) => {
    const page = NAV.find((n) => n.id === id);
    if (!page || !page.ready) return [];
    return [`[${text}](${page.href})`];
  });
  renderBlocks(path, [{ type: 'list', ordered: true, items }]);
  main.append(path);

  return { title: '', navId: 'home', help: PAGE_HELP.home };
}
