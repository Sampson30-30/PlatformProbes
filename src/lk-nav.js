import { LkElement, define } from './core/base.js';
import { pageWindow, collapseCrumbs } from './core/widgets.js';

/**
 * <lk-breadcrumbs> shows where the learner is in a hierarchy.
 *
 *   <lk-breadcrumbs label="You are here" max="4">
 *     <ol>
 *       <li><a href="/">Home</a></li>
 *       <li><a href="/courses">Courses</a></li>
 *       <li>Maths</li>
 *     </ol>
 *   </lk-breadcrumbs>
 *
 * Attributes:
 *   label  Accessible name (default "Breadcrumb").
 *   max    Longest trail to show. Middle items collapse behind a button that
 *          reveals them.
 *
 * The last item is marked aria-current="page" for you.
 */
export class LkBreadcrumbs extends LkElement {
  setup() {
    this.setAttribute('role', 'navigation');
    this.setAttribute('aria-label', this.getAttribute('label') || 'Breadcrumb');
    const list = this.querySelector(':scope > ol');
    if (!list) return;
    const items = [...list.children].filter((c) => c.localName === 'li');
    const last = items[items.length - 1];
    if (last && !list.querySelector('[aria-current]')) {
      (last.querySelector('a') || last).setAttribute('aria-current', 'page');
    }

    const { hidden } = collapseCrumbs(items.length, Number(this.getAttribute('max')) || 0);
    if (hidden.length === 0) return;
    for (const i of hidden) items[i].hidden = true;
    const more = document.createElement('li');
    more.className = 'lk-breadcrumbs__more';
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Show ${hidden.length} more ${hidden.length === 1 ? 'level' : 'levels'}`);
    button.textContent = '…';
    button.addEventListener('click', () => {
      for (const i of hidden) items[i].hidden = false;
      more.remove();
      (items[hidden[0]].querySelector('a') || items[hidden[0]]).focus?.();
      this.emit('expand', { count: hidden.length });
    });
    more.append(button);
    items[hidden[0]].before(more);
  }
}

/**
 * <lk-pagination> moves between pages of results.
 *
 *   <lk-pagination label="Results" total="12" page="1"></lk-pagination>
 *
 * Attributes:
 *   total     Number of pages.
 *   page      Current page (1-based). Change it at any time.
 *   label     Accessible name (default "Pagination").
 *   siblings  Pages shown either side of the current one (default 1).
 *
 * Fires lk-pagechange { page } when the learner chooses a page. It does not
 * load anything: listen for the event and show the right content.
 */
export class LkPagination extends LkElement {
  static observedAttributes = ['total', 'page', 'siblings', 'label'];

  attributeChangedCallback() {
    if (this._lkReady) this.#render();
  }

  setup() {
    this.setAttribute('role', 'navigation');
    this.status = document.createElement('p');
    this.status.className = 'lk-visually-hidden';
    this.status.setAttribute('role', 'status');
    this.list = document.createElement('ul');
    this.list.className = 'lk-pagination__list';
    this.append(this.list, this.status);
    this.list.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-page]');
      if (button && !button.disabled) this.#go(Number(button.dataset.page), button.dataset.kind);
    });
    this.#render();
  }

  get total() {
    return Math.max(0, Math.floor(Number(this.getAttribute('total'))) || 0);
  }

  get page() {
    return Math.min(Math.max(1, Math.floor(Number(this.getAttribute('page'))) || 1), Math.max(1, this.total));
  }

  set page(value) {
    this.setAttribute('page', String(value));
  }

  #go(page, kind) {
    if (page === this.page) return;
    this.setAttribute('page', String(page)); // re-renders
    this.status.textContent = `Page ${this.page} of ${this.total}`;
    // The button that was used has been rebuilt: put focus back on its replacement.
    const same = this.list.querySelector(`button[data-kind="${kind}"]:not(:disabled)`);
    (same || this.list.querySelector('[aria-current]'))?.focus();
    this.emit('pagechange', { page: this.page });
  }

  #render() {
    this.setAttribute('aria-label', this.getAttribute('label') || 'Pagination');
    const { page, total } = this;
    const make = (text, label, target, kind, extra = {}) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lk-pagination__button';
      b.textContent = text;
      if (label) b.setAttribute('aria-label', label);
      b.dataset.page = String(target);
      b.dataset.kind = kind;
      Object.assign(b, extra);
      li.append(b);
      return { li, b };
    };
    const items = [];
    const prev = make('Previous', '', page - 1, 'prev', { disabled: page <= 1 });
    items.push(prev.li);
    for (const p of pageWindow(page, total, Number(this.getAttribute('siblings')) || 1)) {
      if (p === null) {
        const gap = document.createElement('li');
        gap.className = 'lk-pagination__gap';
        gap.textContent = '…';
        items.push(gap);
        continue;
      }
      const item = make(String(p), p === page ? `Page ${p}, current page` : `Page ${p}`, p, `page-${p}`);
      if (p === page) item.b.setAttribute('aria-current', 'page');
      items.push(item.li);
    }
    const next = make('Next', '', page + 1, 'next', { disabled: page >= total });
    items.push(next.li);
    this.list.replaceChildren(...(total > 0 ? items : []));
  }
}

define('lk-breadcrumbs', LkBreadcrumbs);
define('lk-pagination', LkPagination);
