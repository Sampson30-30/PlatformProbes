import { LkElement, define } from './core/base.js';
import { summariseRatings } from './core/scales.js';

function readStored(key, count) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (!Array.isArray(data)) return null;
    return Array.from({ length: count }, (_, i) => (Number.isInteger(data[i]) ? data[i] : null));
  } catch {
    return null;
  }
}

/**
 * <lk-rating> is a self-assessment: the learner rates themselves on a scale
 * for one or more statements.
 *
 *   <lk-rating label="How confident are you with these skills?" scale="5"
 *              low="Not at all" high="Completely" summary name="skills-check">
 *     <div data-lk-statement="Planning a lesson"></div>
 *     <div data-lk-statement="Giving feedback"></div>
 *   </lk-rating>
 *
 * Attributes:
 *   label    Group name. Required.
 *   scale    Number of points, 2 to 10 (default 5).
 *   low      Description of the lowest point.
 *   high     Description of the highest point.
 *   summary  Show an average and areas to focus on once every statement is rated.
 *   name     Storage key. If set, ratings are remembered in this browser.
 *
 * With no statements inside, the label itself is rated.
 *
 * Events:
 *   lk-rate     detail: { index, statement, value }
 *   lk-summary  detail: { total, answered, average, focus: [statements] }
 */
export class LkRating extends LkElement {
  setup() {
    const statements = [...this.querySelectorAll(':scope > [data-lk-statement]')].map((s) => s.getAttribute('data-lk-statement'));
    const label = this.getAttribute('label') || '';
    this.items = statements.length ? statements : [label];
    this.scale = Math.round(Math.min(10, Math.max(2, Number(this.getAttribute('scale')) || 5)));
    this.low = this.getAttribute('low') || '';
    this.high = this.getAttribute('high') || '';
    this.storageKey = this.getAttribute('name') ? `lk-rating:${this.getAttribute('name')}` : '';
    this.values = (this.storageKey && readStored(this.storageKey, this.items.length)) || this.items.map(() => null);
    this.replaceChildren();
    const id = this.makeId();

    const group = document.createElement('div');
    group.className = 'lk-rating__group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', label);
    if (statements.length) {
      const title = document.createElement('p');
      title.className = 'lk-rating__label';
      title.textContent = label;
      group.append(title);
    }
    if (this.low || this.high) {
      const key = document.createElement('p');
      key.className = 'lk-rating__key';
      key.textContent = `1 = ${this.low || 'lowest'}, ${this.scale} = ${this.high || 'highest'}`;
      group.append(key);
    }

    this.items.forEach((statement, index) => {
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'lk-rating__item';
      const legend = document.createElement('legend');
      legend.className = 'lk-rating__statement';
      legend.textContent = statement;
      const scaleEl = document.createElement('div');
      scaleEl.className = 'lk-rating__scale';
      for (let n = 1; n <= this.scale; n += 1) {
        const option = document.createElement('label');
        option.className = 'lk-rating__option';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `${id}-${index}`;
        input.value = String(n);
        input.className = 'lk-rating__input';
        input.checked = this.values[index] === n;
        input.addEventListener('change', () => this.#rate(index, n));
        const text = document.createElement('span');
        text.className = 'lk-rating__number';
        text.textContent = String(n);
        option.append(input, text);
        const word = n === 1 ? this.low : n === this.scale ? this.high : '';
        if (word) {
          const hidden = document.createElement('span');
          hidden.className = 'lk-visually-hidden';
          hidden.textContent = ` (${word})`;
          option.append(hidden);
        }
        scaleEl.append(option);
      }
      fieldset.append(legend, scaleEl);
      group.append(fieldset);
    });

    this.summaryEl = document.createElement('div');
    this.summaryEl.className = 'lk-rating__summary';
    this.summaryEl.setAttribute('role', 'status');
    this.summaryEl.hidden = true;
    this.append(group, this.summaryEl);
    this.#summarise({ announce: false });
  }

  /** Ratings so far: a number per statement, or null if unanswered. */
  get ratings() {
    return [...this.values];
  }

  /** Forgets all ratings. */
  reset() {
    this.values = this.items.map(() => null);
    this.querySelectorAll('input').forEach((i) => {
      i.checked = false;
    });
    if (this.storageKey) {
      try { localStorage.removeItem(this.storageKey); } catch { /* storage unavailable */ }
    }
    this.#summarise({ announce: false });
  }

  #rate(index, value) {
    this.values[index] = value;
    if (this.storageKey) {
      try { localStorage.setItem(this.storageKey, JSON.stringify(this.values)); } catch { /* storage unavailable */ }
    }
    this.emit('rate', { index, statement: this.items[index], value });
    this.#summarise({ announce: true });
  }

  #summarise({ announce }) {
    if (!this.hasAttribute('summary')) return;
    const s = summariseRatings(this.values, this.scale);
    this.summaryEl.hidden = !s.complete;
    if (!s.complete) return;
    this.summaryEl.replaceChildren();
    const avg = document.createElement('p');
    avg.className = 'lk-rating__average';
    avg.textContent = `Your average is ${s.average} out of ${this.scale}.`;
    this.summaryEl.append(avg);
    if (s.focus.length) {
      const p = document.createElement('p');
      p.textContent = 'You might focus on:';
      const ul = document.createElement('ul');
      s.focus.forEach((i) => {
        const li = document.createElement('li');
        li.textContent = this.items[i];
        ul.append(li);
      });
      this.summaryEl.append(p, ul);
    } else {
      const p = document.createElement('p');
      p.textContent = 'You rated yourself in the upper half for every statement.';
      this.summaryEl.append(p);
    }
    if (announce) this.emit('summary', { ...s, focus: s.focus.map((i) => this.items[i]) });
  }
}

define('lk-rating', LkRating);
