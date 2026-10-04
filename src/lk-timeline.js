import { LkElement, define } from './core/base.js';
import { clamp } from './core/utils.js';

/**
 * <lk-timeline> lays out events in order. Each event is a child marked with
 * data-lk-date.
 *
 *   <lk-timeline label="History of the college">
 *     <div data-lk-date="1962" data-title="Founded">The first classes began...</div>
 *     <div data-lk-date="1990" data-title="New campus">...</div>
 *   </lk-timeline>
 *
 * Attributes:
 *   label        Accessible name for the list.
 *   level        Heading level for event titles, 1 to 6 (default 3).
 *   collapsible  Event details open and close when the title is pressed.
 *   stepped      Show one event at a time. A button reveals the next.
 *
 * Events:
 *   lk-toggle  (collapsible)  detail: { index, title, open }
 *   lk-reveal  (stepped)      detail: { index, date, title, remaining }
 */
export class LkTimeline extends LkElement {
  setup() {
    const sources = [...this.querySelectorAll('[data-lk-date]')];
    if (sources.length === 0) return;
    const id = this.makeId();
    const level = Math.round(clamp(this.getAttribute('level') ?? 3, 1, 6));
    this.collapsible = this.hasAttribute('collapsible');
    this.stepped = this.hasAttribute('stepped');

    const list = document.createElement('ol');
    list.className = 'lk-timeline__list';
    if (this.getAttribute('label')) list.setAttribute('aria-label', this.getAttribute('label'));

    this.items = sources.map((body, i) => {
      const li = document.createElement('li');
      li.className = 'lk-timeline__item';
      const marker = document.createElement('span');
      marker.className = 'lk-timeline__marker';
      marker.setAttribute('aria-hidden', 'true');
      const main = document.createElement('div');
      main.className = 'lk-timeline__main';
      const date = document.createElement('span');
      date.className = 'lk-timeline__date';
      date.textContent = body.getAttribute('data-lk-date');

      const titleText = body.getAttribute('data-title') || '';
      const heading = document.createElement('div');
      heading.className = 'lk-timeline__title';
      heading.setAttribute('role', 'heading');
      heading.setAttribute('aria-level', String(level));
      heading.tabIndex = -1;

      body.removeAttribute('data-lk-date');
      body.removeAttribute('data-title');
      body.classList.add('lk-timeline__body');
      const hasBody = body.textContent.trim() !== '' || body.children.length > 0;
      const item = { li, body, title: titleText, date: date.textContent, heading, button: null };

      if (this.collapsible && hasBody && titleText) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'lk-timeline__toggle';
        button.id = `${id}-toggle-${i}`;
        body.id = `${id}-body-${i}`;
        button.setAttribute('aria-controls', body.id);
        button.setAttribute('aria-expanded', 'false');
        button.textContent = titleText;
        button.addEventListener('click', () => this.#toggle(i));
        heading.append(button);
        item.button = button;
        body.hidden = true;
      } else {
        heading.textContent = titleText;
        if (!titleText) heading.hidden = true;
      }

      main.append(date, heading, body);
      li.append(marker, main);
      list.append(li);
      return item;
    });

    this.revealed = this.stepped ? 1 : this.items.length;
    this.items.forEach((item, i) => {
      item.li.hidden = i >= this.revealed;
    });

    this.replaceChildren(list);
    if (this.stepped) {
      this.status = document.createElement('p');
      this.status.className = 'lk-timeline__status';
      this.status.setAttribute('role', 'status');
      this.more = document.createElement('button');
      this.more.type = 'button';
      this.more.className = 'lk-button';
      this.more.dataset.variant = 'primary';
      this.more.textContent = 'Show next event';
      this.more.addEventListener('click', () => this.revealNext());
      const footer = document.createElement('div');
      footer.className = 'lk-timeline__footer';
      footer.append(this.more, this.status);
      this.append(footer);
      this.#syncStepped();
    }
  }

  /** Reveals the next event in stepped mode. */
  revealNext() {
    if (!this.stepped || this.revealed >= this.items.length) return;
    const item = this.items[this.revealed];
    item.li.hidden = false;
    this.revealed += 1;
    this.#syncStepped();
    (item.button || item.heading).focus();
    this.emit('reveal', {
      index: this.revealed - 1,
      date: item.date,
      title: item.title,
      remaining: this.items.length - this.revealed,
    });
  }

  #syncStepped() {
    const done = this.revealed >= this.items.length;
    this.status.textContent = done
      ? `All ${this.items.length} events are showing.`
      : `Showing ${this.revealed} of ${this.items.length} events.`;
    this.more.hidden = done;
  }

  #toggle(index) {
    const item = this.items[index];
    const open = item.button.getAttribute('aria-expanded') !== 'true';
    item.button.setAttribute('aria-expanded', String(open));
    item.body.hidden = !open;
    this.emit('toggle', { index, title: item.title, open });
  }
}

define('lk-timeline', LkTimeline);
