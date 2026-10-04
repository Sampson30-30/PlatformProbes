import { LkElement, define } from './core/base.js';
import { alignedPosition } from './core/position.js';
import { menuTarget, nextQuery, typeaheadIndex } from './core/keys.js';

const SUPPORTS_POPOVER = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;

/**
 * <lk-menu> is a button that opens a list of actions or links.
 *
 *   <lk-menu label="More actions">
 *     <button data-lk-item value="duplicate">Duplicate</button>
 *     <a data-lk-item href="/export">Export</a>
 *     <hr />
 *     <button data-lk-item value="archive" disabled>Archive</button>
 *   </lk-menu>
 *
 * Attributes:
 *   label    Text on the trigger button. Required.
 *   variant  Optional lk-button variant for the trigger (primary, danger, link).
 *
 * Keyboard: Enter, Space and Down open it on the first item, Up opens it on
 * the last. Inside, arrows move (and wrap), Home and End jump, typing a
 * letter jumps to a matching item, Escape closes and returns focus to the
 * trigger, Tab closes. Disabled items are skipped.
 *
 * Use it for actions. For navigation between pages, a plain list of links is
 * usually better.
 *
 * Events: lk-select { label, value } when a button item is chosen, lk-open and
 * lk-close. Links just follow their href.
 */
export class LkMenu extends LkElement {
  setup() {
    const id = this.makeId();
    const source = [...this.children];

    this.trigger = document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.className = 'lk-button lk-menu__trigger';
    this.trigger.id = `${id}-trigger`;
    this.trigger.setAttribute('aria-haspopup', 'menu');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-controls', `${id}-menu`);
    if (this.getAttribute('variant')) this.trigger.dataset.variant = this.getAttribute('variant');
    const text = document.createElement('span');
    text.textContent = this.getAttribute('label') || 'Menu';
    const caret = document.createElement('span');
    caret.className = 'lk-menu__caret';
    caret.setAttribute('aria-hidden', 'true');
    this.trigger.append(text, caret);

    this.panel = document.createElement('div');
    this.panel.className = 'lk-menu__panel';
    this.panel.id = `${id}-menu`;
    this.panel.setAttribute('role', 'menu');
    this.panel.setAttribute('aria-labelledby', this.trigger.id);
    this.panel.hidden = true;
    if (SUPPORTS_POPOVER) this.panel.setAttribute('popover', 'manual');

    for (const el of source) {
      if (el.localName === 'hr') {
        el.setAttribute('role', 'separator');
        el.className = 'lk-menu__separator';
      } else if (el.hasAttribute('data-lk-item')) {
        el.setAttribute('role', 'menuitem');
        el.tabIndex = -1;
        el.classList.add('lk-menu__item');
        if (el.hasAttribute('disabled')) el.setAttribute('aria-disabled', 'true');
      } else {
        continue;
      }
      this.panel.append(el);
    }
    this.replaceChildren(this.trigger, this.panel);
    this.items = [...this.panel.querySelectorAll('[role=menuitem]')];
    this._query = '';
    this._lastKey = 0;

    this.trigger.addEventListener('click', () => (this.isOpen ? this.close(true) : this.open(0)));
    this.trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.open('first');
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.open('last');
      }
    });
    this.panel.addEventListener('keydown', (event) => this.#key(event));
    this.panel.addEventListener('click', (event) => {
      const item = event.target.closest('[role=menuitem]');
      if (!item || this.#disabled(item)) {
        event.preventDefault();
        return;
      }
      this.emit('select', { label: item.textContent.trim(), value: item.getAttribute('value') ?? item.textContent.trim() });
      this.close(true);
    });
    this._outside = (event) => {
      if (!this.contains(event.target)) this.close(false);
    };
  }

  get isOpen() {
    return Boolean(this.panel) && !this.panel.hidden;
  }

  #disabled(item) {
    return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true';
  }

  #enabled() {
    return this.items.map((item) => !this.#disabled(item));
  }

  /** Opens the menu. `where` is 'first', 'last' or an item index. */
  open(where = 'first') {
    if (this.isOpen || this.items.length === 0) return;
    this.panel.hidden = false;
    if (SUPPORTS_POPOVER) {
      try { this.panel.showPopover(); } catch { /* already open */ }
    }
    this.trigger.setAttribute('aria-expanded', 'true');
    this.#place();
    const enabled = this.#enabled();
    let index = where === 'last' ? menuTarget('End', -1, enabled) : typeof where === 'number' ? where : menuTarget('Home', -1, enabled);
    if (!enabled[index]) index = menuTarget('Home', -1, enabled);
    this.items[index]?.focus();
    document.addEventListener('pointerdown', this._outside, true);
    window.addEventListener('resize', this._place);
    window.addEventListener('scroll', this._place, true);
    this.emit('open');
  }

  /** Closes the menu. Pass true to put focus back on the trigger. */
  close(restoreFocus = false) {
    if (!this.isOpen) return;
    this.panel.hidden = true;
    if (SUPPORTS_POPOVER) {
      try { this.panel.hidePopover(); } catch { /* already closed */ }
    }
    this.trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', this._outside, true);
    window.removeEventListener('resize', this._place);
    window.removeEventListener('scroll', this._place, true);
    if (restoreFocus) this.trigger.focus();
    this.emit('close');
  }

  _place = () => this.#place();

  #place() {
    const a = this.trigger.getBoundingClientRect();
    const s = this.panel.getBoundingClientRect();
    const spot = alignedPosition({
      anchor: { top: a.top, left: a.left, width: a.width, height: a.height },
      size: { width: Math.max(s.width, a.width), height: s.height },
      viewport: { width: document.documentElement.clientWidth, height: window.innerHeight },
      rtl: getComputedStyle(this).direction === 'rtl',
    });
    this.panel.style.top = `${spot.top}px`;
    this.panel.style.left = `${spot.left}px`;
    this.panel.style.minWidth = `${a.width}px`;
    this.panel.dataset.side = spot.side;
  }

  #key(event) {
    const current = this.items.indexOf(document.activeElement);
    const enabled = this.#enabled();
    const { key } = event;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      this.items[menuTarget(key, current, enabled)]?.focus();
    } else if (key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
    } else if (key === 'Tab') {
      this.close(false);
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (key === ' ' && !this._query) return; // let Space activate the item
      event.preventDefault();
      const now = Date.now();
      this._query = nextQuery(this._query, this._lastKey, key, now);
      this._lastKey = now;
      const found = typeaheadIndex(this.items.map((i) => i.textContent), enabled, current, this._query);
      if (found >= 0) this.items[found].focus();
    }
  }

  disconnectedCallback() {
    this.close(false);
  }
}

define('lk-menu', LkMenu);
