import { LkElement, define } from './core/base.js';
import { percent, stepState, clamp } from './core/utils.js';

/**
 * <lk-progress> shows how far along something is.
 *
 * Attributes:
 *   value       Current value. Leave it out for an indeterminate bar.
 *   max         Maximum value (default 100).
 *   label       Accessible name, for example "Course progress". Required.
 *   show-value  Also show the percentage as text.
 */
export class LkProgress extends LkElement {
  static observedAttributes = ['value', 'max', 'label', 'show-value'];

  attributeChangedCallback() {
    if (this._lkReady) this.#sync();
  }

  setup() {
    this.bar = document.createElement('div');
    this.bar.className = 'lk-progress__bar';
    this.bar.setAttribute('role', 'progressbar');
    this.bar.setAttribute('aria-valuemin', '0');
    this.fill = document.createElement('div');
    this.fill.className = 'lk-progress__fill';
    this.bar.append(this.fill);
    this.text = document.createElement('span');
    this.text.className = 'lk-progress__text';
    this.text.setAttribute('aria-hidden', 'true');
    this.append(this.bar, this.text);
    this.#sync();
  }

  #sync() {
    const max = Number(this.getAttribute('max')) || 100;
    const hasValue = this.hasAttribute('value');
    const value = clamp(this.getAttribute('value') ?? 0, 0, max);
    const pct = percent(value, max);

    this.bar.setAttribute('aria-valuemax', String(max));
    if (hasValue) {
      this.bar.setAttribute('aria-valuenow', String(value));
      this.bar.setAttribute('aria-valuetext', `${pct}%`);
      this.fill.style.width = `${pct}%`;
    } else {
      this.bar.removeAttribute('aria-valuenow');
      this.bar.removeAttribute('aria-valuetext');
      this.fill.style.width = '';
    }
    this.toggleAttribute('data-indeterminate', !hasValue);
    this.bar.setAttribute('aria-label', this.getAttribute('label') || 'Progress');
    this.text.textContent = hasValue && this.hasAttribute('show-value') ? `${pct}%` : '';
    this.text.hidden = !this.text.textContent;
  }
}

/**
 * <lk-stepper> marks where the learner is in an ordered list of steps. It
 * shows progress; it does not hold the content of the steps.
 *
 *   <lk-stepper current="1" label="Enrolment steps">
 *     <ol><li>Your details</li><li>Choose a course</li><li>Confirm</li></ol>
 *   </lk-stepper>
 *
 * Attributes:
 *   current  Zero-based index of the current step (default 0). Change it at
 *            any time. Steps before it are complete.
 *   label    Accessible name for the list.
 */
export class LkStepper extends LkElement {
  static observedAttributes = ['current', 'label'];

  attributeChangedCallback() {
    if (this._lkReady) this.#sync();
  }

  setup() {
    this.list = this.querySelector(':scope > ol');
    if (!this.list) return;
    this.steps = [...this.list.children].filter((c) => c.localName === 'li');
    for (const step of this.steps) {
      step.classList.add('lk-stepper__step');
      const text = document.createElement('span');
      text.className = 'lk-stepper__label';
      text.append(...step.childNodes);
      const marker = document.createElement('span');
      marker.className = 'lk-stepper__marker';
      marker.setAttribute('aria-hidden', 'true');
      const status = document.createElement('span');
      status.className = 'lk-visually-hidden lk-stepper__status';
      step.append(marker, text, status);
    }
    this.#sync();
  }

  /** Zero-based index of the current step. */
  get current() {
    return this.steps ? clamp(this.getAttribute('current') ?? 0, 0, this.steps.length - 1) : 0;
  }

  set current(index) {
    this.setAttribute('current', String(index));
  }

  #sync() {
    if (!this.steps) return;
    const label = this.getAttribute('label');
    if (label) this.list.setAttribute('aria-label', label);
    const words = { complete: ' (completed)', current: ' (current step)', upcoming: '' };
    this.steps.forEach((step, i) => {
      const state = stepState(i, this.current);
      step.dataset.state = state;
      step.querySelector('.lk-stepper__status').textContent = words[state];
      if (state === 'current') step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  }
}

define('lk-progress', LkProgress);
define('lk-stepper', LkStepper);
