import { LkElement, define } from './core/base.js';
import { clamp } from './core/utils.js';
import { parseScenario } from './core/scenario.js';

const OUTCOMES = {
  good: { tone: 'success', label: 'Best outcome' },
  mixed: { tone: 'warning', label: 'Mixed outcome' },
  poor: { tone: 'danger', label: 'Poor outcome' },
};

/**
 * <lk-scenario> is a branching story. The learner reads a situation, chooses
 * what to do, and sees where it leads.
 *
 *   <lk-scenario label="A late submission" start="start">
 *     <div data-lk-node="start" data-title="An email arrives">
 *       <p>A learner asks for more time...</p>
 *       <ul data-lk-choices>
 *         <li data-lk-goto="strict">Say no</li>
 *         <li data-lk-goto="flex">Agree an extension</li>
 *       </ul>
 *     </div>
 *     <div data-lk-node="strict" data-end data-outcome="poor" data-title="The learner disengages">...</div>
 *     <div data-lk-node="flex" data-end data-outcome="good" data-title="The learner catches up">...</div>
 *   </lk-scenario>
 *
 * A node with no choices is an ending. data-outcome can be good, mixed or poor.
 *
 * The same scenario as JSON, in a child script or the `data` property:
 *   { "start": "a", "nodes": { "a": { "title": "...", "text": "...",
 *     "choices": [ { "text": "Do this", "goto": "b" } ] },
 *     "b": { "text": "...", "end": true, "outcome": "good" } } }
 *
 * Attributes:
 *   label  Accessible name. Required.
 *   start  Id of the first node (default: the first node).
 *   level  Heading level for node titles, 1 to 6 (default 3).
 *
 * Events:
 *   lk-choose  detail: { from, to, choice, path }
 *   lk-end     detail: { node, outcome, path }   path is the list of choices made
 */
export class LkScenario extends LkElement {
  setup() {
    let data = this.#readJson();
    this.html = {};
    if (!data) data = this.#readMarkup();
    this.#load(data);
  }

  /** Replaces the scenario and restarts it. */
  set data(value) {
    if (this._lkReady) {
      this.html = {};
      this.#load(value);
    }
  }

  #readJson() {
    const script = this.querySelector(':scope > script[type="application/json"]');
    if (!script) return null;
    try {
      return JSON.parse(script.textContent);
    } catch {
      return null;
    }
  }

  #readMarkup() {
    const nodes = {};
    for (const el of this.querySelectorAll(':scope > [data-lk-node]')) {
      const id = el.getAttribute('data-lk-node');
      const choices = [...el.querySelectorAll('[data-lk-goto]')].map((c) => ({ text: c.textContent, goto: c.getAttribute('data-lk-goto') }));
      const clone = el.cloneNode(true);
      clone.querySelectorAll('[data-lk-choices], [data-lk-goto]').forEach((n) => n.remove());
      this.html[id] = clone.innerHTML.trim();
      nodes[id] = {
        title: el.getAttribute('data-title') || '',
        text: clone.textContent.trim(),
        choices,
        end: el.hasAttribute('data-end'),
        outcome: el.getAttribute('data-outcome') || '',
      };
    }
    return { start: this.getAttribute('start'), nodes };
  }

  #load(data) {
    this.scenario = parseScenario(data);
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', this.getAttribute('label') || 'Scenario');
    this.shell = document.createElement('div');
    this.shell.className = 'lk-scenario__shell';
    this.replaceChildren(this.shell);
    if (!this.scenario.start) {
      const p = document.createElement('p');
      p.className = 'lk-scenario__problem';
      p.textContent = 'This scenario could not be shown. It has no usable content.';
      this.shell.append(p);
      return;
    }
    this.restart();
  }

  /** Goes back to the first node. */
  restart() {
    this.trail = [{ node: this.scenario.start, choice: '' }];
    this.#render({ focus: false });
  }

  /** The choices made so far, as text. */
  get path() {
    return this.trail.slice(1).map((t) => t.choice);
  }

  #choose(choice) {
    const from = this.#current.id;
    this.trail.push({ node: choice.goto, choice: choice.text });
    this.emit('choose', { from, to: choice.goto, choice: choice.text, path: this.path });
    this.#render({ focus: true });
    const node = this.#current;
    if (node.end) this.emit('end', { node: node.id, outcome: node.outcome, path: this.path });
  }

  #back() {
    if (this.trail.length > 1) {
      this.trail.pop();
      this.#render({ focus: true });
    }
  }

  get #current() {
    return this.scenario.nodes[this.trail[this.trail.length - 1].node];
  }

  #render({ focus }) {
    const node = this.#current;
    const level = Math.round(clamp(this.getAttribute('level') ?? 3, 1, 6));
    const wrap = document.createElement('div');
    wrap.className = 'lk-scenario__node';
    wrap.dataset.end = String(node.end);

    const progress = document.createElement('p');
    progress.className = 'lk-scenario__progress';
    progress.textContent = node.end ? 'Ending' : `Decision ${this.trail.length}`;
    wrap.append(progress);

    const heading = document.createElement('div');
    heading.className = 'lk-scenario__title';
    heading.setAttribute('role', 'heading');
    heading.setAttribute('aria-level', String(level));
    heading.tabIndex = -1;
    heading.textContent = node.title || (node.end ? 'The outcome' : 'What do you do?');
    wrap.append(heading);

    if (node.end && OUTCOMES[node.outcome]) {
      const badge = document.createElement('span');
      badge.className = 'lk-badge lk-scenario__outcome';
      badge.dataset.tone = OUTCOMES[node.outcome].tone;
      badge.textContent = OUTCOMES[node.outcome].label;
      wrap.append(badge);
    }

    const body = document.createElement('div');
    body.className = 'lk-scenario__body';
    if (this.html[node.id]) body.innerHTML = this.html[node.id];
    else {
      for (const para of node.text.split(/\n{2,}/).filter(Boolean)) {
        const p = document.createElement('p');
        p.textContent = para;
        body.append(p);
      }
    }
    wrap.append(body);

    if (!node.end) {
      const list = document.createElement('ul');
      list.className = 'lk-scenario__choices';
      for (const choice of node.choices) {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'lk-button lk-scenario__choice';
        b.textContent = choice.text;
        b.addEventListener('click', () => this.#choose(choice));
        li.append(b);
        list.append(li);
      }
      wrap.append(list);
    } else if (this.path.length) {
      const review = document.createElement('div');
      review.className = 'lk-scenario__review';
      const h = document.createElement('p');
      h.className = 'lk-scenario__review-title';
      h.textContent = 'Your choices:';
      const ol = document.createElement('ol');
      for (const text of this.path) {
        const li = document.createElement('li');
        li.textContent = text;
        ol.append(li);
      }
      review.append(h, ol);
      wrap.append(review);
    }

    const nav = document.createElement('div');
    nav.className = 'lk-scenario__nav';
    if (this.trail.length > 1) {
      const back = document.createElement('button');
      back.type = 'button';
      back.className = 'lk-button';
      back.dataset.size = 'small';
      back.textContent = 'Go back one step';
      back.addEventListener('click', () => this.#back());
      nav.append(back);
      const again = document.createElement('button');
      again.type = 'button';
      again.className = 'lk-button';
      again.dataset.size = 'small';
      again.textContent = node.end ? 'Try again' : 'Start again';
      again.addEventListener('click', () => {
        this.restart();
        this.shell.querySelector('.lk-scenario__title')?.focus();
      });
      nav.append(again);
    }
    wrap.append(nav);

    this.shell.replaceChildren(wrap);
    if (focus) heading.focus();
  }
}

define('lk-scenario', LkScenario);
