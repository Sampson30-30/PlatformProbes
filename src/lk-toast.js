import { LkElement, define } from './core/base.js';
import { toastDuration, uid } from './core/utils.js';

const SUPPORTS_POPOVER = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
const WORDS = { info: 'Note', success: 'Done', warning: 'Warning', danger: 'Error' };
const MAX_VISIBLE = 5;

/**
 * <lk-toasts> is the region that holds notifications. You rarely write it by
 * hand: call toast() and one is created for you. Add one yourself to choose
 * where notifications appear.
 *
 *   <lk-toasts placement="top-end"></lk-toasts>
 *
 * Attributes:
 *   placement  top-start, top-end, bottom-start or bottom-end (default).
 *
 * Events (on the region):
 *   lk-dismiss  detail: { id, reason }  reason: "timeout", "user", "action" or "api"
 */
export class LkToasts extends LkElement {
  setup() {
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', this.getAttribute('label') || 'Notifications');
    if (SUPPORTS_POPOVER) this.setAttribute('popover', 'manual');
    this.live = document.createElement('div');
    this.live.className = 'lk-toasts__list';
    this.live.setAttribute('aria-live', 'polite');
    this.live.setAttribute('aria-relevant', 'additions');
    this.append(this.live);
  }

  /**
   * Shows a notification and returns { id, element, dismiss }.
   * Options: tone ("info", "success", "warning", "danger"), duration (ms, 0 to
   * keep it until dismissed), action ({ label, onClick }).
   */
  show(message, { tone = 'info', duration, action } = {}) {
    if (!this.live) this._init();
    const id = uid('lk-toast');
    const el = document.createElement('div');
    el.className = 'lk-toast';
    el.id = id;
    el.dataset.tone = tone;
    el.setAttribute('role', tone === 'danger' || tone === 'warning' ? 'alert' : 'status');

    const text = document.createElement('p');
    text.className = 'lk-toast__text';
    const word = document.createElement('strong');
    word.className = 'lk-toast__word';
    word.textContent = `${WORDS[tone] || WORDS.info}: `;
    text.append(word, String(message));
    el.append(text);

    const toast = { id, element: el, dismiss: (reason = 'api') => this.#remove(toast, reason) };

    if (action?.label) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lk-button lk-toast__action';
      button.dataset.size = 'small';
      button.textContent = action.label;
      button.addEventListener('click', () => {
        action.onClick?.();
        toast.dismiss('action');
      });
      el.append(button);
    }

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'lk-toast__close';
    close.setAttribute('aria-label', 'Dismiss notification');
    const icon = document.createElement('span');
    icon.className = 'lk-toast__close-icon';
    icon.setAttribute('aria-hidden', 'true');
    close.append(icon);
    close.addEventListener('click', () => toast.dismiss('user'));
    el.append(close);

    toast.remaining = duration ?? toastDuration(message, tone);
    if (toast.remaining > 0) this.#watch(toast, el);

    this.live.append(el);
    while (this.live.children.length > MAX_VISIBLE) this.live.firstElementChild.remove();
    this.#reveal();
    return toast;
  }

  _init() {
    this._lkReady = true;
    this.setup();
  }

  #watch(toast, el) {
    const start = () => {
      toast.startedAt = Date.now();
      toast.timer = setTimeout(() => toast.dismiss('timeout'), toast.remaining);
    };
    const pause = () => {
      if (!toast.timer) return;
      clearTimeout(toast.timer);
      toast.timer = null;
      toast.remaining -= Date.now() - toast.startedAt;
    };
    // Pause while the pointer or keyboard focus is on a toast.
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', () => !toast.timer && start());
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', () => !toast.timer && !el.matches(':hover') && start());
    start();
  }

  #remove(toast, reason) {
    clearTimeout(toast.timer);
    const el = toast.element;
    if (!el.isConnected) return;
    el.remove();
    this.emit('dismiss', { id: toast.id, reason });
    if (!this.live.children.length && SUPPORTS_POPOVER) {
      try { this.hidePopover(); } catch { /* already hidden */ }
    }
  }

  #reveal() {
    if (!SUPPORTS_POPOVER) return;
    // Re-showing puts the region above anything else in the top layer, such as an open modal.
    try { this.hidePopover(); } catch { /* not open yet */ }
    try { this.showPopover(); } catch { /* unsupported state */ }
  }
}

define('lk-toasts', LkToasts);

/**
 * Shows a notification. Creates the <lk-toasts> region if the page has none.
 *
 *   toast('Progress saved', { tone: 'success' });
 *   toast('Course deleted', { action: { label: 'Undo', onClick: restore } });
 */
export function toast(message, options) {
  let region = document.querySelector('lk-toasts');
  if (!region) {
    region = document.createElement('lk-toasts');
    document.body.append(region);
  }
  if (!region._lkReady) region._init();
  return region.show(message, options);
}
