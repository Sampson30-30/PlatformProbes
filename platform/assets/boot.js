// Builds the page shell (skip link, header, navigation, footer) and then
// hands the main area to the page. Every page calls boot() once.

import '../../src/index.js';
import { SITE, NAV } from '../data/site.js';
import { escapeHtml } from '../lib/text.js';

function header(currentId) {
  const bar = document.createElement('header');
  bar.className = 'site-header';
  const links = NAV.filter((n) => n.ready)
    .map((n) => `<li><a href="${escapeHtml(n.href)}"${n.id === currentId ? ' aria-current="page"' : ''}>${escapeHtml(n.label)}</a></li>`)
    .join('');
  bar.innerHTML = `
    <div class="site-header__inner">
      <a class="site-brand" href="index.html">${escapeHtml(SITE.name)}</a>
      <nav aria-label="Main"><ul class="site-nav">${links}</ul></nav>
    </div>`;
  return bar;
}

function footer() {
  const f = document.createElement('footer');
  f.className = 'site-footer';
  f.innerHTML = `<p>Built with LearnKit. What you type stays on this device: nothing is sent anywhere.</p>`;
  return f;
}

/**
 * build(main, params) fills the main element and may return
 * { title, navId } to name the page and mark its place in the navigation.
 */
export function boot(build) {
  const root = document.documentElement;
  root.lang = 'en-GB';
  root.dataset.lkTheme = SITE.theme;

  const app = document.getElementById('app');
  const main = document.createElement('main');
  main.id = 'main';
  main.className = 'site-main';
  main.tabIndex = -1;
  const result = build(main, new URLSearchParams(location.search)) || {};

  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#main';
  skip.textContent = 'Skip to main content';

  app.replaceChildren(skip, header(result.navId || 'home'), main, footer());
  document.title = result.title ? `${result.title} | ${SITE.name}` : SITE.name;
}
