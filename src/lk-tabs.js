import { LkElement, define } from './core/base.js';
import { clamp, wrap } from './core/utils.js';

/**
 * <lk-tabs> turns child elements marked with data-lk-tab="Title" into an
 * accessible tabbed interface (WAI-ARIA tabs pattern, manual activation off).
 *
 * Attributes:
 *   selected  Zero-based index of the initially selected tab (default 0).
 *   label     Accessible name for the tab list.
 *
 * Events:
 *   lk-tabchange  detail: { index, title }
 */
export class LkTabs extends LkElement {
  setup() {
    this.panels = [...this.querySelectorAll(':scope > [data-lk-tab]')];
    if (this.panels.length === 0) return;

    const id = this.makeId();
    const list = document.createElement('div');
    list.className = 'lk-tabs__list';
    list.setAttribute('role', 'tablist');
    const label = this.getAttribute('label');
    if (label) list.setAttribute('aria-label', label);

    this.tabs = this.panels.map((panel, i) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'lk-tabs__tab';
      tab.id = `${id}-tab-${i}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', `${id}-panel-${i}`);
      tab.textContent = panel.dataset.lkTab;
      tab.addEventListener('click', () => this.select(i));

      panel.id = `${id}-panel-${i}`;
      panel.classList.add('lk-tabs__panel');
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;

      list.append(tab);
      return tab;
    });

    list.addEventListener('keydown', (event) => this.#onKeydown(event));
    this.prepend(list);

    const start = clamp(this.getAttribute('selected') ?? 0, 0, this.panels.length - 1);
    this.select(start, { silent: true });
  }

  /** Index of the currently selected tab. */
  get selectedIndex() {
    return this.tabs ? this.tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true') : -1;
  }

  /** Selects a tab by index. Pass { silent: true } to skip the event. */
  select(index, { silent = false, focus = false } = {}) {
    if (!this.tabs) return;
    const target = clamp(index, 0, this.tabs.length - 1);
    this.tabs.forEach((tab, i) => {
      const active = i === target;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      this.panels[i].hidden = !active;
    });
    if (focus) this.tabs[target].focus();
    if (!silent) this.emit('tabchange', { index: target, title: this.tabs[target].textContent });
  }

  #onKeydown(event) {
    const current = this.tabs.indexOf(document.activeElement);
    if (current === -1) return;
    const last = this.tabs.length - 1;
    const moves = {
      ArrowRight: wrap(current + 1, this.tabs.length),
      ArrowLeft: wrap(current - 1, this.tabs.length),
      Home: 0,
      End: last,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    this.select(moves[event.key], { focus: true });
  }
}

define('lk-tabs', LkTabs);
