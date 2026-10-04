import { LkElement, define } from './core/base.js';
import { describePosition, compareToExpert } from './core/scales.js';

/**
 * <lk-spectrum> asks a learner to place their view between two poles, then
 * compares it with an expert position.
 *
 *   <lk-spectrum statement="How should feedback be given?"
 *                left="Written" right="Spoken" expert="70"
 *                explanation="Spoken feedback allows a conversation, but write down the key points.">
 *   </lk-spectrum>
 *
 * Attributes:
 *   statement    The question or statement. Required.
 *   left, right  Labels for the two ends. Required.
 *   expert       Expert position, 0 (left) to 100 (right). Without it there is no comparison step.
 *   explanation  Why the expert holds that position. Shown on comparing.
 *
 * Events:
 *   lk-change  detail: { value }
 *   lk-reveal  detail: { value, expert, difference }
 */
export class LkSpectrum extends LkElement {
  setup() {
    const statement = this.getAttribute('statement') || '';
    const left = this.getAttribute('left') || 'Left';
    const right = this.getAttribute('right') || 'Right';
    this.hasExpert = this.hasAttribute('expert');
    this.expert = Math.min(100, Math.max(0, Number(this.getAttribute('expert')) || 0));
    this.touched = false;
    const id = this.makeId();

    const fieldset = document.createElement('fieldset');
    fieldset.className = 'lk-spectrum__fieldset';
    const legend = document.createElement('legend');
    legend.className = 'lk-spectrum__statement';
    legend.textContent = statement;

    const track = document.createElement('div');
    track.className = 'lk-spectrum__track';
    this.input = document.createElement('input');
    this.input.type = 'range';
    this.input.min = '0';
    this.input.max = '100';
    this.input.step = '1';
    this.input.value = '50';
    this.input.id = `${id}-input`;
    this.input.className = 'lk-spectrum__input';
    this.input.setAttribute('aria-label', statement);
    this.input.style.setProperty('--lk-spectrum-p', '0.5');
    track.append(this.input);

    this.marker = document.createElement('div');
    this.marker.className = 'lk-spectrum__marker';
    this.marker.hidden = true;
    this.marker.style.setProperty('--lk-spectrum-p', String(this.expert / 100));
    const flag = document.createElement('span');
    flag.className = 'lk-spectrum__flag';
    flag.textContent = 'Expert view';
    this.marker.append(flag);
    track.append(this.marker);

    const poles = document.createElement('div');
    poles.className = 'lk-spectrum__poles';
    poles.setAttribute('aria-hidden', 'true');
    const l = document.createElement('span');
    l.textContent = left;
    const r = document.createElement('span');
    r.textContent = right;
    poles.append(l, r);

    this.readout = document.createElement('p');
    this.readout.className = 'lk-spectrum__readout';
    this.readout.setAttribute('aria-live', 'polite');
    this.readout.textContent = 'Move the slider to show where you stand.';

    this.result = document.createElement('div');
    this.result.className = 'lk-spectrum__result';
    this.result.setAttribute('role', 'status');
    this.result.tabIndex = -1;
    this.result.hidden = true;

    this.actions = document.createElement('div');
    this.actions.className = 'lk-spectrum__actions';
    fieldset.append(legend, track, poles, this.readout);
    this.append(fieldset, this.result, this.actions);

    this.input.addEventListener('input', () => {
      this.touched = true;
      this.#sync();
      this.emit('change', { value: this.value });
    });
    this.left = left;
    this.right = right;
    this.#sync();
    this.#renderActions();
  }

  /** The learner's position, 0 to 100. */
  get value() {
    return Number(this.input.value);
  }

  #sync() {
    const v = this.value;
    this.input.style.setProperty('--lk-spectrum-p', String(v / 100));
    const text = describePosition(v, this.left, this.right);
    this.input.setAttribute('aria-valuetext', text);
    this.readout.textContent = this.touched ? `Your position: ${text.toLowerCase()}.` : 'Move the slider to show where you stand.';
  }

  #renderActions() {
    this.actions.replaceChildren();
    if (!this.hasExpert) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lk-button';
    b.dataset.variant = 'primary';
    b.textContent = 'Compare with the expert view';
    b.addEventListener('click', () => this.reveal());
    this.actions.append(b);
  }

  /** Shows the expert position. Does nothing until the learner has moved the slider. */
  reveal() {
    if (!this.hasExpert) return;
    if (!this.touched) {
      this.result.hidden = false;
      this.result.replaceChildren(Object.assign(document.createElement('strong'), { textContent: 'Place your position first. ' }), 'Move the slider, then compare.');
      return;
    }
    const { difference, closeness } = compareToExpert(this.value, this.expert);
    this.marker.hidden = false;
    this.input.disabled = true;
    this.result.hidden = false;
    this.result.replaceChildren();
    const summary = document.createElement('strong');
    summary.textContent = `You are ${closeness} the expert view. `;
    this.result.append(
      summary,
      `Your position is ${this.value} and the expert view is ${this.expert}, ${difference} ${difference === 1 ? 'point' : 'points'} apart. Expert view: ${describePosition(this.expert, this.left, this.right).toLowerCase()}.`
    );
    const explanation = this.getAttribute('explanation');
    if (explanation) {
      const p = document.createElement('p');
      p.className = 'lk-spectrum__explanation';
      p.textContent = explanation;
      this.result.append(p);
    }
    const again = document.createElement('button');
    again.type = 'button';
    again.className = 'lk-button';
    again.textContent = 'Change my position';
    again.addEventListener('click', () => this.#unlock());
    this.actions.replaceChildren(again);
    this.result.focus();
    this.emit('reveal', { value: this.value, expert: this.expert, difference });
  }

  #unlock() {
    this.marker.hidden = true;
    this.input.disabled = false;
    this.result.hidden = true;
    this.#renderActions();
    this.input.focus();
  }
}

define('lk-spectrum', LkSpectrum);
