import { LkElement, define } from './core/base.js';
import { clamp } from './core/utils.js';
import './lk-progress.js';

/**
 * <lk-process> walks a learner through steps, one at a time, with a stepper
 * showing where they are. Each step is a child marked with data-lk-step.
 *
 *   <lk-process label="Planning a lesson">
 *     <div data-lk-step="Set the outcome">Decide what learners will be able to do...</div>
 *     <div data-lk-step="Plan the activities">...</div>
 *   </lk-process>
 *
 * Attributes:
 *   label  Accessible name. Required.
 *   level  Heading level for step titles, 1 to 6 (default 3).
 *
 * Without JavaScript every step is simply shown in order.
 *
 * Events:
 *   lk-step      detail: { index, title }
 *   lk-complete  detail: { steps }  when the learner finishes the last step
 */
export class LkProcess extends LkElement {
  setup() {
    const steps = [...this.querySelectorAll(':scope > [data-lk-step]')];
    if (steps.length === 0) return;
    const level = Math.round(clamp(this.getAttribute('level') ?? 3, 1, 6));
    this.index = 0;
    this.finished = false;

    const stepper = document.createElement('lk-stepper');
    stepper.setAttribute('current', '0');
    stepper.setAttribute('label', this.getAttribute('label') || 'Steps');
    const ol = document.createElement('ol');
    steps.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s.getAttribute('data-lk-step');
      ol.append(li);
    });
    stepper.append(ol);
    this.stepper = stepper;

    this.count = document.createElement('p');
    this.count.className = 'lk-process__count';

    this.panels = steps.map((step) => {
      const title = step.getAttribute('data-lk-step');
      step.removeAttribute('data-lk-step');
      step.classList.add('lk-process__step');
      step.setAttribute('role', 'group');
      const heading = document.createElement('div');
      heading.className = 'lk-process__title';
      heading.setAttribute('role', 'heading');
      heading.setAttribute('aria-level', String(level));
      heading.tabIndex = -1;
      heading.textContent = title;
      step.prepend(heading);
      step.setAttribute('aria-labelledby', (heading.id = `${this.makeId()}-title`));
      return { step, heading, title };
    });

    this.nav = document.createElement('div');
    this.nav.className = 'lk-process__nav';
    this.back = this.#button('Previous step', () => this.go(this.index - 1, { focus: true }));
    this.next = this.#button('Next step', () => this.#advance(), 'primary');
    this.nav.append(this.back, this.next);

    this.done = document.createElement('div');
    this.done.className = 'lk-process__done';
    this.done.setAttribute('role', 'status');
    this.done.hidden = true;

    this.replaceChildren(stepper, this.count, ...this.panels.map((p) => p.step), this.nav, this.done);
    this.go(0);
  }

  #button(label, onClick, variant) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lk-button';
    if (variant) b.dataset.variant = variant;
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  /** Index of the step being shown. */
  get current() {
    return this.index;
  }

  /** Shows a step by index. */
  go(index, { focus = false } = {}) {
    const target = clamp(index, 0, this.panels.length - 1);
    this.index = target;
    this.finished = false;
    this.done.hidden = true;
    this.nav.hidden = false;
    this.removeAttribute('data-complete');
    this.panels.forEach((p, i) => {
      p.step.hidden = i !== target;
    });
    this.stepper.setAttribute('current', String(target));
    this.count.textContent = `Step ${target + 1} of ${this.panels.length}`;
    this.back.disabled = target === 0;
    const last = target === this.panels.length - 1;
    this.next.textContent = last ? 'Finish' : 'Next step';
    if (focus) this.panels[target].heading.focus();
    this.emit('step', { index: target, title: this.panels[target].title });
  }

  #advance() {
    if (this.index < this.panels.length - 1) {
      this.go(this.index + 1, { focus: true });
      return;
    }
    this.finished = true;
    this.setAttribute('data-complete', '');
    this.nav.hidden = true;
    this.stepper.setAttribute('current', String(this.panels.length));
    this.count.textContent = 'All steps complete';
    this.done.hidden = false;
    this.done.replaceChildren(
      Object.assign(document.createElement('strong'), { textContent: `Done: you have completed all ${this.panels.length} steps.` }),
      ' ',
      this.#button('Start again', () => this.go(0, { focus: true }))
    );
    this.emit('complete', { steps: this.panels.length });
  }
}

define('lk-process', LkProcess);
