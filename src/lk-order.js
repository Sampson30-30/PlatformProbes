import { LkElement, define } from './core/base.js';
import { shuffledOrder, moveItem, checkOrder, moveMessage } from './core/order.js';

/**
 * <lk-order> asks the learner to put items in the right sequence. Write the
 * items in the CORRECT order; they are shuffled for the learner.
 *
 *   <lk-order label="Put the writing process in order">
 *     <ol><li>Plan</li><li>Draft</li><li>Revise</li><li>Publish</li></ol>
 *   </lk-order>
 *
 * Each item has Move up and Move down buttons, so it works with a keyboard,
 * a screen reader or a touch screen. Pointer users can also drag by the
 * handle. After "Check order" each item is marked right or wrong, with words
 * as well as symbols, and the learner can try again.
 *
 * Attributes:
 *   label  Question or instruction. Required.
 *
 * Events: lk-orderchange { order, labels }, lk-check { score, total, complete }.
 */
export class LkOrder extends LkElement {
  setup() {
    const source = this.querySelector(':scope > ol, :scope > ul');
    if (!source) return;
    this.items = [...source.children].filter((c) => c.localName === 'li').map((li) => li.innerHTML);
    this.texts = [...source.children].filter((c) => c.localName === 'li').map((li) => li.textContent.trim());
    if (this.items.length < 2) return;

    const id = this.makeId();
    this.heading = document.createElement('p');
    this.heading.className = 'lk-order__label';
    this.heading.id = `${id}-label`;
    this.heading.textContent = this.getAttribute('label') || 'Put these in order';

    this.list = document.createElement('ol');
    this.list.className = 'lk-order__list';
    this.list.setAttribute('aria-labelledby', this.heading.id);

    this.feedback = document.createElement('p');
    this.feedback.className = 'lk-order__feedback';
    this.feedback.setAttribute('role', 'status');

    this.live = document.createElement('p');
    this.live.className = 'lk-visually-hidden';
    this.live.setAttribute('role', 'status');

    const actions = document.createElement('div');
    actions.className = 'lk-order__actions';
    this.checkButton = this.#button('Check order', 'primary', () => this.check());
    this.resetButton = this.#button('Shuffle again', '', () => this.reset());
    actions.append(this.checkButton, this.resetButton);

    this.replaceChildren(this.heading, this.list, actions, this.feedback, this.live);
    this.list.addEventListener('dragover', (event) => this.#dragOver(event));
    this.list.addEventListener('drop', (event) => this.#drop(event));
    this.reset();
  }

  /** The current order as the learner has it, as item texts. */
  get sequence() {
    return this.order.map((i) => this.texts[i]);
  }

  /** Shuffle and clear any marking. */
  reset() {
    this.order = shuffledOrder(this.items.length);
    this.marks = null;
    this.feedback.textContent = '';
    this.#render();
  }

  /** Check the order now, as if the learner had pressed the button. */
  check() {
    this.marks = checkOrder(this.order);
    const { score, total, complete } = this.marks;
    this.feedback.textContent = complete
      ? `Correct. All ${total} are in the right order.`
      : `${score} of ${total} in the right place. Move the others and check again.`;
    this.feedback.dataset.outcome = complete ? 'good' : 'mixed';
    this.#render();
    this.emit('check', { score, total, complete });
  }

  #move(from, to, restoreFocus = true) {
    const next = moveItem(this.order, from, to);
    if (next === this.order) return;
    this.order = next;
    this.marks = null;
    this.feedback.textContent = '';
    const moved = Math.min(Math.max(to, 0), this.order.length - 1);
    this.#render();
    this.live.textContent = moveMessage(this.texts[this.order[moved]], moved, this.order.length);
    if (restoreFocus) {
      // Keep focus on the same control (up or down) so repeated presses keep working.
      const row = this.list.children[moved];
      const kind = to < from ? 'up' : 'down';
      const target = row.querySelector(`[data-move="${kind}"]:not(:disabled)`) || row.querySelector('[data-move]:not(:disabled)');
      target?.focus();
    }
    this.emit('orderchange', { order: [...this.order], labels: this.sequence });
  }

  #render() {
    const rows = this.order.map((original, position) => {
      const li = document.createElement('li');
      li.className = 'lk-order__item';
      li.draggable = true;
      li.dataset.position = String(position);
      li.addEventListener('dragstart', (event) => {
        event.dataTransfer?.setData('text/plain', String(position));
        if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
        li.classList.add('is-dragging');
      });
      li.addEventListener('dragend', () => li.classList.remove('is-dragging'));

      const handle = document.createElement('span');
      handle.className = 'lk-order__handle';
      handle.setAttribute('aria-hidden', 'true');
      handle.textContent = '⠇';

      const text = document.createElement('span');
      text.className = 'lk-order__text';
      text.innerHTML = this.items[original];

      const buttons = document.createElement('span');
      buttons.className = 'lk-order__buttons';
      const up = this.#moveButton('up', '↑', `Move ${this.texts[original]} up`, position === 0, () => this.#move(position, position - 1));
      const down = this.#moveButton('down', '↓', `Move ${this.texts[original]} down`, position === this.order.length - 1, () => this.#move(position, position + 1));
      buttons.append(up, down);

      li.append(handle, text, buttons);
      if (this.marks) {
        const ok = this.marks.correct[position];
        li.dataset.state = ok ? 'correct' : 'wrong';
        const mark = document.createElement('span');
        mark.className = 'lk-order__mark';
        mark.textContent = ok ? '✓ Right place' : '✗ Not here';
        li.append(mark);
      }
      return li;
    });
    this.list.replaceChildren(...rows);
  }

  #dragOver(event) {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  #drop(event) {
    event.preventDefault();
    const from = Number(event.dataTransfer?.getData('text/plain'));
    const row = event.target.closest('.lk-order__item');
    if (!Number.isInteger(from) || !row) return;
    this.#move(from, Number(row.dataset.position), false);
  }

  #moveButton(kind, glyph, label, disabled, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lk-order__move';
    b.dataset.move = kind;
    b.setAttribute('aria-label', label);
    b.textContent = glyph;
    b.disabled = disabled;
    b.addEventListener('click', onClick);
    return b;
  }

  #button(text, variant, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lk-button';
    if (variant) b.dataset.variant = variant;
    b.textContent = text;
    b.addEventListener('click', onClick);
    return b;
  }
}

define('lk-order', LkOrder);
