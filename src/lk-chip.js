import { LkElement, define } from './core/base.js';

/**
 * <lk-chip> is a compact label. It can be plain, selectable (a toggle) or
 * removable.
 *
 *   <lk-chip>Level 2</lk-chip>
 *   <lk-chip selectable selected>Maths</lk-chip>
 *   <lk-chip removable>Evening</lk-chip>
 *
 * Attributes:
 *   selectable  The label becomes a toggle button (aria-pressed).
 *   selected    Current state of a selectable chip. Set it or read it.
 *   removable   Adds a remove button. Fires lk-remove, then removes the chip.
 *   tone        primary, success, warning, danger or info. Optional.
 *
 * Events: lk-select { selected }, lk-remove { label }.
 */
export class LkChip extends LkElement {
  static observedAttributes = ['selected'];

  attributeChangedCallback() {
    if (this._lkReady) this.#sync();
  }

  setup() {
    const text = this.textContent.trim();
    this.label = document.createElement(this.hasAttribute('selectable') ? 'button' : 'span');
    this.label.className = 'lk-chip__label';
    this.label.append(...this.childNodes);
    this.append(this.label);

    if (this.hasAttribute('selectable')) {
      this.label.type = 'button';
      this.label.addEventListener('click', () => {
        this.toggleAttribute('selected');
        this.emit('select', { selected: this.hasAttribute('selected') });
      });
    }
    if (this.hasAttribute('removable')) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'lk-chip__remove';
      remove.setAttribute('aria-label', `Remove ${text}`);
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        this.emit('remove', { label: text });
        this.remove();
      });
      this.append(remove);
    }
    this.#sync();
  }

  get selected() {
    return this.hasAttribute('selected');
  }

  set selected(value) {
    this.toggleAttribute('selected', Boolean(value));
  }

  #sync() {
    if (this.hasAttribute('selectable')) this.label.setAttribute('aria-pressed', String(this.selected));
  }
}

define('lk-chip', LkChip);
