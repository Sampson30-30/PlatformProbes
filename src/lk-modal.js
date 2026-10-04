import { LkElement, define } from './core/base.js';
import { clamp } from './core/utils.js';

/**
 * <lk-modal> wraps its content in a native <dialog> opened with showModal(),
 * so the browser provides the top layer, focus containment, an inert
 * background and the Escape key. LearnKit adds the heading, close button,
 * backdrop click, focus return and trigger wiring.
 *
 * Attributes:
 *   heading      Visible title. Gives the dialog its accessible name.
 *   label        Accessible name to use when there is no visible heading.
 *   level        Heading level for the title, 1 to 6 (default 2).
 *   static       Do not close when the backdrop is clicked. Escape and the
 *                close button still work.
 *   close-label  Accessible name for the close button (default "Close").
 *
 * Open it with a trigger, `<button data-lk-open="id">`, or with .show().
 * Any element inside with `data-lk-close` closes it. Its value becomes the
 * returnValue: `data-lk-close="confirm"`.
 * Give an element inside the `autofocus` attribute to choose where focus starts.
 *
 * Events:
 *   lk-open   detail: {}
 *   lk-close  detail: { returnValue }
 */
export class LkModal extends LkElement {
  setup() {
    const id = this.makeId();
    const heading = this.getAttribute('heading');
    const level = Math.round(clamp(this.getAttribute('level') ?? 2, 1, 6));

    const dialog = document.createElement('dialog');
    dialog.className = 'lk-modal__dialog';

    const header = document.createElement('div');
    header.className = 'lk-modal__header';
    if (heading) {
      const title = document.createElement('div');
      title.className = 'lk-modal__title';
      title.id = `${id}-title`;
      title.setAttribute('role', 'heading');
      title.setAttribute('aria-level', String(level));
      title.textContent = heading;
      header.append(title);
      dialog.setAttribute('aria-labelledby', title.id);
    } else if (this.getAttribute('label')) {
      dialog.setAttribute('aria-label', this.getAttribute('label'));
    }

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'lk-modal__close';
    close.setAttribute('aria-label', this.getAttribute('close-label') ?? 'Close');
    const icon = document.createElement('span');
    icon.className = 'lk-modal__close-icon';
    icon.setAttribute('aria-hidden', 'true');
    close.append(icon);
    close.addEventListener('click', () => this.close('close'));
    header.append(close);

    const body = document.createElement('div');
    body.className = 'lk-modal__body';
    body.append(...this.childNodes);

    dialog.append(header, body);
    this.append(dialog);
    this.dialog = dialog;

    dialog.addEventListener('click', (event) => {
      const closer = event.target.closest?.('[data-lk-close]');
      if (closer) {
        this.close(closer.getAttribute('data-lk-close') || 'close');
        return;
      }
      // Clicks on the backdrop are reported against the dialog itself.
      if (event.target === dialog && !this.hasAttribute('static') && !isInside(event, dialog)) {
        this.close('dismiss');
      }
    });

    // Escape closes the dialog without a return value, so name it.
    dialog.addEventListener('cancel', () => {
      dialog.returnValue = 'cancel';
    });

    dialog.addEventListener('close', () => {
      const opener = this._opener;
      this._opener = null;
      if (opener?.isConnected) opener.focus();
      this.emit('close', { returnValue: dialog.returnValue });
    });
  }

  /** True while the dialog is showing. */
  get isOpen() {
    return Boolean(this.dialog?.open);
  }

  /** Opens the dialog. `opener` is the element to return focus to. */
  show(opener = document.activeElement) {
    if (!this.dialog || this.dialog.open) return;
    this._opener = opener instanceof HTMLElement ? opener : null;
    this.dialog.returnValue = '';
    this.dialog.showModal();
    this.emit('open');
  }

  /** Closes the dialog. The value is reported as `returnValue` on lk-close. */
  close(returnValue = 'close') {
    if (this.dialog?.open) this.dialog.close(returnValue);
  }
}

function isInside(event, element) {
  const r = element.getBoundingClientRect();
  return (
    event.clientX >= r.left && event.clientX <= r.right &&
    event.clientY >= r.top && event.clientY <= r.bottom
  );
}

// One delegated listener opens any modal from [data-lk-open="<id>"].
if (!globalThis.__lkModalTriggers) {
  globalThis.__lkModalTriggers = true;
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest?.('[data-lk-open]');
    if (!trigger) return;
    const target = document.getElementById(trigger.getAttribute('data-lk-open'));
    if (target instanceof LkModal) {
      event.preventDefault();
      target.show(trigger);
    }
  });
}

define('lk-modal', LkModal);
