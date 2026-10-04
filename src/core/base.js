import { uid } from './utils.js';

/**
 * Base class for all LearnKit components.
 *
 * Components use the light DOM so authors can style them with ordinary CSS
 * and so content stays visible to search engines and assistive technology.
 * Subclasses implement `setup()`, which runs once when the element is ready.
 */
export class LkElement extends HTMLElement {
  connectedCallback() {
    if (this._lkReady) return;
    // Wait for the parser so child content exists when setup() runs.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._init(), { once: true });
    } else {
      this._init();
    }
  }

  _init() {
    if (this._lkReady || !this.isConnected) return;
    this._lkReady = true;
    this.setup();
    this.classList.add('lk-ready');
  }

  /** Override in subclasses. */
  setup() {}

  /** Dispatches a bubbling `lk-<name>` event. */
  emit(name, detail = {}) {
    this.dispatchEvent(
      new CustomEvent(`lk-${name}`, { detail, bubbles: true, composed: true })
    );
  }

  /** Unique id helper scoped to the component's tag name. */
  makeId() {
    return uid(this.localName);
  }
}

/** Registers a custom element once, so loading a script twice is harmless. */
export function define(tag, ctor) {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}
