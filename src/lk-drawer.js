import { define } from './core/base.js';
import { LkModal } from './lk-modal.js';

/**
 * <lk-drawer> is a panel that slides in from the side of the screen, for
 * navigation, filters or details that should not take over the page. It is a
 * modal dialog underneath: focus stays inside while it is open, the page
 * behind is inert, and Escape or a click outside closes it.
 *
 *   <button data-lk-open="filters">Filters</button>
 *   <lk-drawer id="filters" heading="Filter courses" side="start">...</lk-drawer>
 *
 * It takes every attribute, method and event of <lk-modal>, and adds:
 *   side  start or end (default end). It follows the reading direction.
 *
 * Set --lk-drawer-width to change the width (default 24rem, never wider than
 * the screen).
 */
export class LkDrawer extends LkModal {
  setup() {
    super.setup();
    this.dialog.classList.remove('lk-modal__dialog');
    this.dialog.classList.add('lk-drawer__dialog');
    this.#side();
  }

  static observedAttributes = ['side'];

  attributeChangedCallback() {
    if (this._lkReady) this.#side();
  }

  #side() {
    this.dialog.dataset.side = this.getAttribute('side') === 'start' ? 'start' : 'end';
  }
}

define('lk-drawer', LkDrawer);
