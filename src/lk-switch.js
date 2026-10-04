import { LkElement, define } from './core/base.js';

/**
 * <lk-switch> is an on/off setting, built on a native checkbox with
 * role="switch" so it works in forms and with every assistive technology.
 *
 *   <lk-switch label="Email reminders" hint="One a week" name="reminders" checked></lk-switch>
 *
 * Attributes: label (required), hint, name, value, checked, disabled.
 * Read or set `.checked`. Fires lk-change { checked }.
 */
export class LkSwitch extends LkElement {
  static observedAttributes = ['label', 'hint', 'checked', 'disabled'];

  attributeChangedCallback() {
    if (this._lkReady) this.#sync();
  }

  setup() {
    const id = this.makeId();
    this.input = document.createElement('input');
    this.input.type = 'checkbox';
    this.input.id = `${id}-input`;
    this.input.className = 'lk-switch__input';
    this.input.setAttribute('role', 'switch');
    this.labelEl = document.createElement('label');
    this.labelEl.className = 'lk-switch__label';
    this.labelEl.htmlFor = this.input.id;
    this.track = document.createElement('span');
    this.track.className = 'lk-switch__track';
    this.track.setAttribute('aria-hidden', 'true');
    this.hintEl = document.createElement('span');
    this.hintEl.className = 'lk-field__hint lk-switch__hint';
    this.hintEl.id = `${id}-hint`;
    this.input.addEventListener('change', () => {
      this.toggleAttribute('checked', this.input.checked);
      this.emit('change', { checked: this.input.checked });
    });
    this.replaceChildren(this.input, this.track, this.labelEl, this.hintEl);
    this.#sync();
  }

  get checked() {
    return this.input ? this.input.checked : this.hasAttribute('checked');
  }

  set checked(value) {
    this.toggleAttribute('checked', Boolean(value));
  }

  #sync() {
    const hint = this.getAttribute('hint') || '';
    this.labelEl.textContent = this.getAttribute('label') || '';
    this.hintEl.textContent = hint;
    this.hintEl.hidden = !hint;
    if (hint) this.input.setAttribute('aria-describedby', this.hintEl.id);
    else this.input.removeAttribute('aria-describedby');
    if (this.getAttribute('name')) this.input.name = this.getAttribute('name');
    this.input.value = this.getAttribute('value') ?? 'on';
    this.input.checked = this.hasAttribute('checked');
    this.input.disabled = this.hasAttribute('disabled');
  }
}

define('lk-switch', LkSwitch);
