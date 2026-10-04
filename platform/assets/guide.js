// The "About this page" panel. Built on the same native <details> pattern as
// LearnKit's .lk-guide, so it opens and closes with a keyboard and needs no
// script to work. This file only fills it in and remembers if it was closed.

import { inline } from '../lib/text.js';

const KEY = 'hb-guide-closed:';

function remembered(page) {
  try { return localStorage.getItem(KEY + page) === '1'; } catch { return false; }
}

function remember(page, closed) {
  try {
    if (closed) localStorage.setItem(KEY + page, '1');
    else localStorage.removeItem(KEY + page);
  } catch { /* the panel just reopens next time */ }
}

/** Builds the panel for { what, can: [] }. `page` names it for remembering. */
export function guideNode(help, page) {
  const details = document.createElement('details');
  details.className = 'lk-guide';
  details.open = !remembered(page);
  details.innerHTML = `
    <summary>About this page</summary>
    <div class="lk-guide__body">
      <p><strong>What this is.</strong> ${inline(help.what)}</p>
      <p class="lk-guide__title">What you can do here</p>
      <ul>${help.can.map((c) => `<li>${inline(c)}</li>`).join('')}</ul>
    </div>`;
  details.addEventListener('toggle', () => remember(page, !details.open));
  return details;
}

/** Puts the panel straight after the page's main heading block. */
export function placeGuide(main, help, page) {
  const h1 = main.querySelector('h1');
  if (!h1 || !help) return;
  const anchor = h1.closest('header, .hero') || h1;
  anchor.after(guideNode(help, page));
}
