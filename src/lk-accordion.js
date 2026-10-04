import { LkElement, define } from './core/base.js';
import { clamp, wrap, toggleOpen, normaliseOpen } from './core/utils.js';

/**
 * <lk-accordion> turns child elements marked with data-lk-item="Title" into a
 * set of collapsible sections (WAI-ARIA accordion pattern).
 *
 * Attributes:
 *   multiple  Allow several sections to be open at once. Without it, opening
 *             one section closes the others.
 *   level     Heading level for the section headings, 1 to 6 (default 3).
 *   label     Accessible name for the group.
 *
 * Mark a child with the `open` attribute to start it expanded.
 *
 * Events:
 *   lk-toggle  detail: { index, title, open }
 */
export class LkAccordion extends LkElement {
  setup() {
    this.panels = [...this.querySelectorAll(':scope > [data-lk-item]')];
    if (this.panels.length === 0) return;

    const id = this.makeId();
    const level = Math.round(clamp(this.getAttribute('level') ?? 3, 1, 6));
    const label = this.getAttribute('label');
    if (label) {
      this.setAttribute('role', 'group');
      this.setAttribute('aria-label', label);
    }

    this.triggers = this.panels.map((panel, i) => {
      const heading = document.createElement('div');
      heading.className = 'lk-accordion__heading';
      heading.setAttribute('role', 'heading');
      heading.setAttribute('aria-level', String(level));

      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'lk-accordion__trigger';
      trigger.id = `${id}-trigger-${i}`;
      trigger.setAttribute('aria-controls', `${id}-panel-${i}`);

      const text = document.createElement('span');
      text.className = 'lk-accordion__title';
      text.textContent = panel.dataset.lkItem;
      const icon = document.createElement('span');
      icon.className = 'lk-accordion__icon';
      icon.setAttribute('aria-hidden', 'true');
      trigger.append(text, icon);
      trigger.addEventListener('click', () => this.toggle(i));

      heading.append(trigger);
      panel.before(heading);

      panel.id = `${id}-panel-${i}`;
      panel.classList.add('lk-accordion__panel');
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', trigger.id);
      return trigger;
    });

    this.addEventListener('keydown', (event) => this.#onKeydown(event));

    const initial = this.panels.flatMap((p, i) => (p.hasAttribute('open') ? [i] : []));
    this.#render(normaliseOpen(initial, this.hasAttribute('multiple')));
  }

  /** Indexes of the sections that are currently open. */
  get openIndexes() {
    return this.panels ? this.panels.flatMap((p, i) => (p.hidden ? [] : [i])) : [];
  }

  /** Toggles a section by index. */
  toggle(index) {
    if (!this.triggers || index < 0 || index >= this.panels.length) return;
    this.#change(toggleOpen(this.openIndexes, index, this.hasAttribute('multiple')), index);
  }

  /** Opens a section by index. */
  open(index) {
    if (!this.openIndexes.includes(index)) this.toggle(index);
  }

  /** Closes a section by index. */
  close(index) {
    if (this.openIndexes.includes(index)) this.toggle(index);
  }

  #change(next, changedIndex) {
    const before = this.openIndexes;
    this.#render(next);
    // Report the section the learner acted on, then any sections that closed as a side effect.
    const closed = before.filter((i) => !next.includes(i) && i !== changedIndex);
    for (const i of [changedIndex, ...closed]) {
      this.emit('toggle', {
        index: i,
        title: this.panels[i].dataset.lkItem,
        open: next.includes(i),
      });
    }
  }

  #render(open) {
    this.panels.forEach((panel, i) => {
      const isOpen = open.includes(i);
      panel.hidden = !isOpen;
      this.triggers[i].setAttribute('aria-expanded', String(isOpen));
    });
  }

  #onKeydown(event) {
    const current = this.triggers.indexOf(document.activeElement);
    if (current === -1) return;
    const last = this.triggers.length - 1;
    const moves = {
      ArrowDown: wrap(current + 1, this.triggers.length),
      ArrowUp: wrap(current - 1, this.triggers.length),
      Home: 0,
      End: last,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    this.triggers[moves[event.key]].focus();
  }
}

define('lk-accordion', LkAccordion);
