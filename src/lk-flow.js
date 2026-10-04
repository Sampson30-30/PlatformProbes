import { LkElement, define } from './core/base.js';
import {
  prepare, walkStart, walkCurrent, walkOptions, walkChoose, walkBack, walkFinished, routeText,
} from './core/flow.js';

const WORDS = { start: 'Start: ', end: 'End: ', decision: 'Decision: ' };

/** Position of item `i` among `n`, for drawing the connecting bars. */
function position(i, n) {
  if (n === 1) return 'only';
  return i === 0 ? 'first' : i === n - 1 ? 'last' : 'middle';
}

/**
 * <lk-flow> draws a process or a decision tree from nested lists, and can
 * walk a learner through it one choice at a time.
 *
 *   <lk-flow label="A late submission" walkthrough>
 *     <ol>
 *       <li data-type="start">Work arrives after the deadline</li>
 *       <li>Was an extension agreed?
 *         <ul>
 *           <li data-label="Yes">Mark as normal</li>
 *           <li data-label="No">Apply the late penalty</li>
 *         </ul>
 *       </li>
 *       <li data-type="end">Return feedback</li>
 *     </ol>
 *   </lk-flow>
 *
 * Writing it:
 *   <ol>        steps in order.
 *   <ul> in an <li>   branches: the item is a decision and each branch <li> is
 *               one answer. Put the answer in data-label. A branch can hold
 *               its own decision, or <ol> for more steps in that branch.
 *   data-detail Longer wording for an item, kept out of the chart. Plain text. With
 *               a walk-through it is shown in the panel when the learner arrives;
 *               without one it appears under the item's title.
 *   data-type   start, end, step or decision (decision is the default for an
 *               item with branches). A branch ending in an "end" stops there;
 *               other branches rejoin whatever follows the decision.
 *
 * Attributes:
 *   label        Accessible name. Required.
 *   layout       process (default) or tree. A tree never rejoins: every branch
 *                ends in a result, and nothing can follow a decision.
 *   walkthrough  Adds a panel that asks one question at a time, shows the
 *                route taken and highlights it on the chart.
 *
 * The chart is real nested lists, so a screen reader hears the structure and
 * the branch labels ("If Yes"). The lines and arrows are decoration.
 *
 * Events: lk-flowstep { id, text, route }, lk-flowend { route }.
 * Methods: restart(), back(). The route so far is `route`.
 */
export class LkFlow extends LkElement {
  setup() {
    const list = this.querySelector(':scope > ol, :scope > ul');
    if (!list) return;
    const tree = this.getAttribute('layout') === 'tree';
    this._tree = tree;
    const items = this.#readItems([...list.children].filter((c) => c.localName === 'li'));
    this.graph = prepare(items, { rejoin: !tree });
    for (const w of this.graph.warnings) console.warn(`lk-flow: ${w}`);

    this.scroll = document.createElement('div');
    this.scroll.className = 'lk-flow__scroll';
    this.scroll.tabIndex = 0;
    this.scroll.setAttribute('role', 'region');
    this.scroll.setAttribute('aria-label', this.getAttribute('label') || 'Flow chart');
    this.chart = this.#renderSequence(this.graph.items);
    this.chart.classList.add('lk-flow__root');
    this.scroll.append(this.chart);
    this.dataset.layout = tree ? 'tree' : 'process';
    this.replaceChildren(this.scroll);
    // Where branches rejoin, the bar between them depends on where they land, so measure it.
    this._observer = new ResizeObserver(() => this.#drawJoins());
    this._observer.observe(this.chart);

    if (this.hasAttribute('walkthrough') && this.graph.start) {
      this.panel = document.createElement('div');
      this.panel.className = 'lk-flow__walk';
      this.kicker = document.createElement('p');
      this.kicker.className = 'lk-flow__kicker';
      this.prompt = document.createElement('p');
      this.prompt.className = 'lk-flow__prompt';
      this.prompt.setAttribute('aria-live', 'polite');
      this.detailEl = document.createElement('p');
      this.detailEl.className = 'lk-flow__detail-text';
      this.actions = document.createElement('div');
      this.actions.className = 'lk-flow__actions';
      this.routeEl = document.createElement('p');
      this.routeEl.className = 'lk-flow__route';
      this.panel.append(this.kicker, this.prompt, this.detailEl, this.actions, this.routeEl);
      this.append(this.panel);
      this.state = walkStart(this.graph);
      this.#showWalk(false);
    }
  }

  /** The route taken so far, as text. Empty without a walk-through. */
  get route() {
    return this.state ? routeText(this.graph, this.state) : [];
  }

  /** Go back to the start of the walk-through. */
  restart() {
    if (!this.panel) return;
    this.state = walkStart(this.graph);
    this.#showWalk(true);
  }

  /** Undo the last choice. */
  back() {
    if (!this.panel) return;
    this.state = walkBack(this.state);
    this.#showWalk(true);
  }

  // ---- Reading the lists ----

  #readItems(lis) {
    const out = [];
    for (const li of lis) {
      const content = [...li.childNodes].filter((n) => !(n.nodeType === 1 && (n.localName === 'ul' || n.localName === 'ol')));
      const ul = li.querySelector(':scope > ul');
      const ol = li.querySelector(':scope > ol');
      const item = {
        text: content.map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim(),
        content: content.map((n) => n.cloneNode(true)),
        type: li.dataset.type,
        detail: li.dataset.detail || '',
      };
      if (ul) {
        item.branches = [...ul.children]
          .filter((c) => c.localName === 'li')
          .map((b) => ({ label: b.dataset.label || '', items: this.#readItems([b]) }));
      }
      out.push(item);
      if (ol) out.push(...this.#readItems([...ol.children].filter((c) => c.localName === 'li')));
    }
    return out;
  }

  // ---- Drawing ----

  #renderSequence(items) {
    const ol = document.createElement('ol');
    ol.className = 'lk-flow__seq';
    items.forEach((item, i) => {
      const li = document.createElement('li');
      li.className = 'lk-flow__step';
      li.dataset.type = item.type;
      li.dataset.id = item.id;
      const node = document.createElement('div');
      node.className = 'lk-flow__node';
      if (WORDS[item.type]) {
        const word = document.createElement('span');
        word.className = 'lk-visually-hidden';
        word.textContent = WORDS[item.type];
        node.append(word);
      }
      node.append(...item.content);
      if (item.detail) {
        // With a walk-through the detail is read out in the panel instead, so it is not repeated here.
        const detail = document.createElement('span');
        detail.className = 'lk-flow__detail';
        detail.textContent = item.detail;
        detail.hidden = this.hasAttribute('walkthrough');
        node.append(detail);
      }
      li.append(node);
      if (item.branches) li.append(this.#renderBranches(item));
      else if (this._tree && i === items.length - 1) li.dataset.leaf = '';
      ol.append(li);
    });
    return ol;
  }

  #renderBranches(item) {
    const ul = document.createElement('ul');
    ul.className = 'lk-flow__branches';
    const n = item.branches.length;
    if (item.branches.some((b) => b.joins)) ul.dataset.joins = '';
    item.branches.forEach((branch, i) => {
      const li = document.createElement('li');
      li.className = 'lk-flow__branch';
      li.dataset.from = item.id;
      li.dataset.index = String(i);
      li.dataset.pos = position(i, n);
      if (branch.label) {
        const edge = document.createElement('span');
        edge.className = 'lk-flow__edge';
        const word = document.createElement('span');
        word.className = 'lk-visually-hidden';
        word.textContent = 'If ';
        edge.append(word, branch.label);
        li.append(edge);
      }
      li.append(this.#renderSequence(branch.items));
      if (branch.joins) {
        const join = document.createElement('div');
        join.className = 'lk-flow__join';
        join.setAttribute('aria-hidden', 'true');
        li.append(join);
      }
      ul.append(li);
    });
    return ul;
  }

  /** Draws the bar that brings rejoining branches back to the line below the decision. */
  #drawJoins() {
    // A chart wider than its region starts centred, so the first step is in view.
    if (!this._centred && this.scroll.scrollWidth > this.scroll.clientWidth) {
      this._centred = true;
      this.scroll.scrollLeft = (this.scroll.scrollWidth - this.scroll.clientWidth) / 2;
    }
    for (const ul of this.querySelectorAll('.lk-flow__branches[data-joins]')) {
      const box = ul.getBoundingClientRect();
      if (box.width === 0) continue;
      const centre = box.left + box.width / 2;
      const stubs = [...ul.querySelectorAll(':scope > .lk-flow__branch > .lk-flow__join')].map((j) => {
        const r = j.getBoundingClientRect();
        return r.left + r.width / 2;
      });
      const from = Math.min(centre, ...stubs);
      const to = Math.max(centre, ...stubs);
      let bar = ul.querySelector(':scope > .lk-flow__joinbar');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'lk-flow__joinbar';
        bar.setAttribute('aria-hidden', 'true');
        ul.append(bar);
      }
      bar.style.left = `${from - box.left}px`;
      bar.style.width = `${to - from}px`;
      bar.hidden = to - from < 1;
    }
  }

  disconnectedCallback() {
    this._observer?.disconnect();
  }

  // ---- Walk-through ----

  #showWalk(moveFocus) {
    const { graph, state } = this;
    const node = walkCurrent(graph, state);
    const finished = walkFinished(graph, state);
    const options = walkOptions(graph, state);

    this.kicker.textContent = finished ? (node.type === 'end' ? 'End' : 'Result') : node.edges.length > 1 ? 'Question' : 'Step';
    this.prompt.textContent = node.text;
    this.detailEl.textContent = node.detail;
    this.detailEl.hidden = !node.detail;
    this.actions.replaceChildren();
    if (state.path.length > 1) this.actions.append(this.#button('Back', '', () => this.back()));
    if (finished) {
      this.actions.append(this.#button('Start again', 'primary', () => this.restart()));
    } else {
      for (const option of options) {
        this.actions.append(this.#button(option.label, 'primary', () => {
          this.state = walkChoose(graph, this.state, option.index);
          this.#showWalk(true);
        }));
      }
    }
    const route = routeText(graph, state);
    this.routeEl.textContent = route.length > 1 ? `Your route: ${route.join(' → ')}` : '';

    // Mark the chart.
    const visited = new Set(state.path.map((p) => p.id));
    const taken = new Set(state.path.filter((p) => p.from).map((p) => `${p.from}:${p.index}`));
    for (const li of this.querySelectorAll('.lk-flow__step')) {
      const id = li.dataset.id;
      li.toggleAttribute('data-visited', visited.has(id));
      const nodeEl = li.querySelector(':scope > .lk-flow__node');
      if (id === node.id) nodeEl.setAttribute('aria-current', 'step');
      else nodeEl.removeAttribute('aria-current');
    }
    for (const li of this.querySelectorAll('.lk-flow__branch')) {
      li.toggleAttribute('data-taken', taken.has(`${li.dataset.from}:${li.dataset.index}`));
    }
    if (moveFocus) this.#revealCurrent(node.id);

    this.emit('flowstep', { id: node.id, text: node.text, route });
    if (finished) this.emit('flowend', { route });
    if (moveFocus) this.actions.querySelector('[data-variant="primary"]')?.focus({ preventScroll: true });
  }

  /** Scrolls the chart sideways, never the page, so the current step is in view. */
  #revealCurrent(id) {
    const el = this.querySelector(`.lk-flow__step[data-id="${id}"] > .lk-flow__node`);
    if (!el) return;
    const box = el.getBoundingClientRect();
    const view = this.scroll.getBoundingClientRect();
    if (box.left < view.left) this.scroll.scrollLeft -= view.left - box.left + 16;
    else if (box.right > view.right) this.scroll.scrollLeft += box.right - view.right + 16;
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

define('lk-flow', LkFlow);
