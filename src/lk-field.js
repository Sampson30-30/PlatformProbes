import { LkElement, define } from './core/base.js';

const TEXT_CONTROLS = 'input:not([type=checkbox]):not([type=radio]):not([type=hidden]), select, textarea';

/** Joins whitespace-separated id lists without duplicates. */
function mergeIds(...lists) {
  return [...new Set(lists.flatMap((l) => (l || '').split(/\s+/)).filter(Boolean))].join(' ');
}

/** Shared by lk-field and lk-choices: renders the hint and error elements. */
function renderMessages(host, { hintEl, errorEl, hint, error }) {
  hintEl.textContent = hint || '';
  hintEl.hidden = !hint;
  errorEl.replaceChildren();
  errorEl.hidden = !error;
  if (error) {
    const word = document.createElement('strong');
    word.className = 'lk-field__error-word';
    word.textContent = 'Error: ';
    errorEl.append(word, error);
  }
  host.toggleAttribute('data-invalid', Boolean(error));
}

/**
 * <lk-field> adds a label, hint and error message to a native text-like
 * control (input, select or textarea) and wires up the ARIA for you.
 *
 * Attributes:
 *   label  Visible label text. Required for accessibility.
 *   hint   Help text shown under the label.
 *   error  Error message. Set it from your own validation; clear it to remove.
 *
 * Built-in validation: the control's own rules (required, pattern, min, and so
 * on) are checked when it loses focus, and again as the learner types once a
 * message is showing. Call field.validate() to check on demand.
 *
 * A range input also shows its current value.
 */
export class LkField extends LkElement {
  static observedAttributes = ['label', 'hint', 'error'];

  attributeChangedCallback() {
    if (this._lkReady) this.#sync();
  }

  setup() {
    const control = this.querySelector(TEXT_CONTROLS);
    if (!control) return;
    this.control = control;
    const id = control.id || (control.id = `${this.makeId()}-control`);

    this.labelEl = document.createElement('label');
    this.labelEl.className = 'lk-field__label';
    this.labelEl.htmlFor = id;

    this.hintEl = document.createElement('div');
    this.hintEl.className = 'lk-field__hint';
    this.hintEl.id = `${id}-hint`;

    this.errorEl = document.createElement('div');
    this.errorEl.className = 'lk-field__error';
    this.errorEl.id = `${id}-error`;
    this.errorEl.setAttribute('aria-live', 'polite');

    control.classList.add('lk-control');
    control.setAttribute('aria-describedby', mergeIds(control.getAttribute('aria-describedby'), this.hintEl.id, this.errorEl.id));

    const row = document.createElement('div');
    row.className = 'lk-field__row';
    control.before(row);
    row.append(control);

    if (control.type === 'range') {
      this.valueEl = document.createElement('output');
      this.valueEl.className = 'lk-field__value';
      this.valueEl.htmlFor = id;
      this.valueEl.setAttribute('aria-live', 'off');
      row.append(this.valueEl);
      control.addEventListener('input', () => this.#syncValue());
    }

    this.prepend(this.labelEl, this.hintEl);
    this.append(this.errorEl);

    control.addEventListener('blur', () => {
      this._touched = true;
      this.validate();
    });
    control.addEventListener('input', () => {
      if (this._touched || this._message) this.validate();
    });

    this.#sync();
  }

  /** Checks the control's own validity and shows the browser's message. */
  validate() {
    if (!this.control) return true;
    const ok = this.control.checkValidity();
    this._message = ok ? '' : this.control.validationMessage;
    this.#sync();
    return ok;
  }

  #syncValue() {
    if (this.valueEl) this.valueEl.textContent = this.control.value;
  }

  #sync() {
    const label = this.getAttribute('label') || '';
    this.labelEl.textContent = label;
    if (this.control.required) {
      const req = document.createElement('span');
      req.className = 'lk-field__required';
      req.textContent = ' (required)';
      this.labelEl.append(req);
    }
    const error = this.getAttribute('error') || this._message || '';
    renderMessages(this, { hintEl: this.hintEl, errorEl: this.errorEl, hint: this.getAttribute('hint'), error });
    this.control.setAttribute('aria-invalid', String(Boolean(error)));
    this.#syncValue();
  }
}

/**
 * <lk-choices> groups checkboxes or radio buttons into a fieldset with a
 * legend, hint and error. Put plain `<label><input ...> Text</label>` children
 * inside it.
 *
 * Attributes:
 *   legend  Visible group label. Required for accessibility.
 *   hint    Help text shown under the legend.
 *   error   Error message from your own validation.
 *   min     Minimum number of checked boxes, for checkbox groups.
 *
 * Call group.validate() to check on demand. Radio groups use the native
 * `required` attribute on their inputs.
 */
export class LkChoices extends LkElement {
  static observedAttributes = ['legend', 'hint', 'error'];

  attributeChangedCallback() {
    if (this._lkReady) this.#sync();
  }

  setup() {
    const labels = [...this.querySelectorAll(':scope > label')];
    if (labels.length === 0) return;
    const id = this.makeId();

    this.fieldset = document.createElement('fieldset');
    this.fieldset.className = 'lk-choices__fieldset';
    this.legendEl = document.createElement('legend');
    this.legendEl.className = 'lk-field__label';
    this.hintEl = document.createElement('div');
    this.hintEl.className = 'lk-field__hint';
    this.hintEl.id = `${id}-hint`;
    this.errorEl = document.createElement('div');
    this.errorEl.className = 'lk-field__error';
    this.errorEl.id = `${id}-error`;
    this.errorEl.setAttribute('aria-live', 'polite');

    const list = document.createElement('div');
    list.className = 'lk-choices__list';
    for (const label of labels) {
      label.classList.add('lk-choice');
      list.append(label);
    }
    this.inputs = [...list.querySelectorAll('input')];
    this.fieldset.setAttribute('aria-describedby', `${this.hintEl.id} ${this.errorEl.id}`);
    this.fieldset.append(this.legendEl, this.hintEl, list, this.errorEl);
    this.append(this.fieldset);

    this.fieldset.addEventListener('focusout', (event) => {
      if (this.fieldset.contains(event.relatedTarget)) return;
      this._touched = true;
      this.validate();
    });
    this.fieldset.addEventListener('change', () => {
      if (this._touched || this._message) this.validate();
    });

    this.#sync();
  }

  /** Checks the group and shows a message when it is not valid. */
  validate() {
    if (!this.inputs) return true;
    const min = Number(this.getAttribute('min')) || 0;
    let message = '';
    if (min > 0) {
      const checked = this.inputs.filter((i) => i.checked).length;
      if (checked < min) message = `Select at least ${min} ${min === 1 ? 'option' : 'options'}.`;
    }
    if (!message) {
      const bad = this.inputs.find((i) => !i.checkValidity());
      if (bad) message = bad.validationMessage;
    }
    this._message = message;
    this.#sync();
    return !message;
  }

  #sync() {
    this.legendEl.textContent = this.getAttribute('legend') || '';
    const error = this.getAttribute('error') || this._message || '';
    renderMessages(this, { hintEl: this.hintEl, errorEl: this.errorEl, hint: this.getAttribute('hint'), error });
    for (const input of this.inputs) input.setAttribute('aria-invalid', String(Boolean(error)));
  }
}

define('lk-field', LkField);
define('lk-choices', LkChoices);
