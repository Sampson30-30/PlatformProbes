import { LkElement, define } from './core/base.js';
import { computePosition } from './core/position.js';

const SUPPORTS_POPOVER = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Shared by tooltip and popover: show in the top layer when possible, then place. */
class LkFloating extends LkElement {
  /** The element this one is anchored to. Subclasses set it. */
  get anchorEl() {
    return null;
  }

  get isOpen() {
    return this.hasAttribute('data-open');
  }

  _open() {
    if (this.isOpen) return;
    if (SUPPORTS_POPOVER) {
      try { this.showPopover(); } catch { /* already open */ }
    }
    this.setAttribute('data-open', '');
    this.reposition();
    window.addEventListener('resize', this._onMove);
    window.addEventListener('scroll', this._onMove, true);
  }

  _close() {
    if (!this.isOpen) return;
    this.removeAttribute('data-open');
    if (SUPPORTS_POPOVER) {
      try { this.hidePopover(); } catch { /* already closed */ }
    }
    window.removeEventListener('resize', this._onMove);
    window.removeEventListener('scroll', this._onMove, true);
  }

  _onMove = () => this.reposition();

  /** Re-places the element next to its anchor. */
  reposition() {
    const anchor = this.anchorEl;
    if (!anchor) return;
    const a = anchor.getBoundingClientRect();
    const s = this.getBoundingClientRect();
    const spot = computePosition({
      anchor: { top: a.top, left: a.left, width: a.width, height: a.height },
      size: { width: s.width, height: s.height },
      viewport: { width: document.documentElement.clientWidth, height: window.innerHeight },
      side: this.getAttribute('placement') || this.defaultSide,
    });
    this.style.top = `${spot.top}px`;
    this.style.left = `${spot.left}px`;
    this.dataset.side = spot.side;
  }

  disconnectedCallback() {
    this._close();
  }
}

/**
 * <lk-tooltip> shows a short hint when its target is hovered or focused.
 *
 *   <button id="help">Help</button>
 *   <lk-tooltip for="help">Opens the course guide</lk-tooltip>
 *
 * Use it for short, non-essential text. The target should be focusable, so
 * keyboard users can reach the hint. The tooltip stays open while the pointer
 * is over it, and Escape closes it.
 *
 * Attributes:
 *   for        Id of the target element.
 *   placement  top, bottom, left or right (default top). It flips when there
 *              is no room.
 */
export class LkTooltip extends LkFloating {
  defaultSide = 'top';

  get anchorEl() {
    const id = this.getAttribute('for');
    return (id && document.getElementById(id)) || this.previousElementSibling;
  }

  setup() {
    this.setAttribute('role', 'tooltip');
    if (!this.id) this.id = this.makeId();
    if (SUPPORTS_POPOVER) this.setAttribute('popover', 'manual');
    const target = this.anchorEl;
    if (!target) return;
    const described = new Set((target.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    described.add(this.id);
    target.setAttribute('aria-describedby', [...described].join(' '));

    const show = (delay) => {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => this._open(), delay);
    };
    const hide = (delay) => {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => this._close(), delay);
    };
    target.addEventListener('mouseenter', () => show(150));
    target.addEventListener('mouseleave', () => hide(100));
    target.addEventListener('focus', () => show(0));
    target.addEventListener('blur', () => hide(0));
    this.addEventListener('mouseenter', () => clearTimeout(this._timer));
    this.addEventListener('mouseleave', () => hide(100));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        clearTimeout(this._timer);
        this._close();
      }
    });
  }

  show() {
    clearTimeout(this._timer);
    this._open();
  }

  hide() {
    clearTimeout(this._timer);
    this._close();
  }
}

/**
 * <lk-popover> is a small panel of content that opens next to a trigger.
 * Unlike a tooltip it can hold links, buttons and form controls.
 *
 *   <button data-lk-popover="info">More about this</button>
 *   <lk-popover id="info" label="About this topic">...</lk-popover>
 *
 * It closes on Escape, on a click outside, or when focus leaves it. Focus
 * moves into the popover when it opens and returns to the trigger on Escape.
 *
 * Attributes:
 *   label      Accessible name. Required.
 *   placement  top, bottom, left or right (default bottom).
 *
 * Events: lk-open, lk-close.
 */
export class LkPopover extends LkFloating {
  defaultSide = 'bottom';

  get anchorEl() {
    return this._trigger || null;
  }

  setup() {
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-label', this.getAttribute('label') || '');
    if (!this.id) this.id = this.makeId();
    if (SUPPORTS_POPOVER) this.setAttribute('popover', 'manual');
    this.tabIndex = -1;

    this._outside = (event) => {
      if (!this.contains(event.target) && !this._trigger?.contains(event.target)) this.hide();
    };
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        this.hide({ restoreFocus: true });
      }
    });
    this.addEventListener('focusout', (event) => {
      const next = event.relatedTarget;
      if (next && !this.contains(next) && !this._trigger?.contains(next)) this.hide();
    });
  }

  /** Opens the popover next to `trigger`. */
  show(trigger = document.activeElement) {
    if (this.isOpen) return;
    this._trigger = trigger instanceof HTMLElement ? trigger : null;
    this._open();
    if (this._trigger) {
      this._trigger.setAttribute('aria-expanded', 'true');
      this._trigger.setAttribute('aria-controls', this.id);
      this._trigger.setAttribute('aria-haspopup', 'dialog');
    }
    this.reposition();
    (this.querySelector(FOCUSABLE) || this).focus({ preventScroll: true });
    document.addEventListener('pointerdown', this._outside, true);
    this.emit('open');
  }

  /** Closes the popover. Pass { restoreFocus: true } to focus the trigger again. */
  hide({ restoreFocus = false } = {}) {
    if (!this.isOpen) return;
    document.removeEventListener('pointerdown', this._outside, true);
    this._close();
    this._trigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) this._trigger?.focus();
    this.emit('close');
  }

  toggle(trigger) {
    if (this.isOpen) this.hide();
    else this.show(trigger);
  }
}

// One delegated listener opens any popover from [data-lk-popover="<id>"].
if (!globalThis.__lkPopoverTriggers) {
  globalThis.__lkPopoverTriggers = true;
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest?.('[data-lk-popover]');
    if (!trigger) return;
    const target = document.getElementById(trigger.getAttribute('data-lk-popover'));
    if (target instanceof LkPopover) {
      event.preventDefault();
      target.toggle(trigger);
    }
  });
}

define('lk-tooltip', LkTooltip);
define('lk-popover', LkPopover);
