import { LkElement, define } from './core/base.js';
import { visibleIndexes, levelOf, treeKey } from './core/tree.js';
import { nextQuery, typeaheadIndex } from './core/keys.js';

/**
 * <lk-tree> shows nested content that can be opened and closed, such as a
 * course outline. Write it as nested lists.
 *
 *   <lk-tree label="Course contents">
 *     <ul>
 *       <li open>Unit 1
 *         <ul>
 *           <li><a href="#a">Lesson A</a></li>
 *           <li data-value="b">Lesson B</li>
 *         </ul>
 *       </li>
 *       <li>Unit 2<ul><li>Lesson C</li></ul></li>
 *     </ul>
 *   </lk-tree>
 *
 * Attributes:
 *   label  Accessible name. Required.
 *
 * On an item: `open` starts a branch expanded; `data-value` is reported with
 * the selection. An item containing a link follows the link when chosen.
 *
 * Keyboard (one tab stop for the whole tree): Up and Down move, Right opens a
 * branch then moves into it, Left closes it then moves to the parent, Home
 * and End jump, `*` opens all branches at that level, Enter or Space chooses,
 * and typing a letter jumps to a matching item.
 *
 * Choosing an item marks it as the current one (aria-selected) and fires
 * lk-select { label, value, path }. Opening or closing fires lk-toggle
 * { label, open }. Methods: expandAll(), collapseAll(), select(index).
 */
export class LkTree extends LkElement {
  setup() {
    const root = this.querySelector(':scope > ul, :scope > ol');
    if (!root) return;
    root.setAttribute('role', 'tree');
    root.setAttribute('aria-label', this.getAttribute('label') || 'Tree');
    root.classList.add('lk-tree__root');
    this.rootList = root;

    this.items = [...root.querySelectorAll('li')];
    this.nodes = this.items.map((li) => ({
      parent: this.items.indexOf(li.parentElement.closest('li')),
      hasChildren: Boolean(li.querySelector(':scope > ul, :scope > ol')),
    }));
    this.expanded = new Set();
    this.current = -1;
    this.focusIndex = 0;
    this._query = '';
    this._lastKey = 0;

    this.items.forEach((li, i) => {
      const node = this.nodes[i];
      li.setAttribute('role', 'treeitem');
      li.classList.add('lk-tree__item');
      li.setAttribute('aria-level', String(levelOf(this.nodes, i)));
      li.removeAttribute('tabindex');

      const sub = li.querySelector(':scope > ul, :scope > ol');
      if (sub) {
        sub.setAttribute('role', 'group');
        sub.classList.add('lk-tree__group');
      }
      const row = document.createElement('div');
      row.className = 'lk-tree__row';
      const twisty = document.createElement('span');
      twisty.className = 'lk-tree__twisty';
      twisty.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'lk-tree__label';
      label.append(...[...li.childNodes].filter((n) => n !== sub && n !== row));
      row.append(twisty, label);
      li.prepend(row);
      li.querySelectorAll(':scope > .lk-tree__row a').forEach((a) => { a.tabIndex = -1; });
      if (node.hasChildren && li.hasAttribute('open')) this.expanded.add(i);
    });

    root.addEventListener('keydown', (event) => this.#key(event));
    root.addEventListener('click', (event) => {
      const row = event.target.closest('.lk-tree__row');
      if (!row) return;
      const index = this.items.indexOf(row.parentElement);
      this.#focus(index);
      this.#choose(index, !event.target.closest('a'));
    });
    this.#sync();
  }

  /** Opens every branch. */
  expandAll() {
    this.nodes.forEach((n, i) => n.hasChildren && this.expanded.add(i));
    this.#sync();
  }

  /** Closes every branch. */
  collapseAll() {
    this.expanded.clear();
    if (!visibleIndexes(this.nodes, this.expanded).includes(this.focusIndex)) this.focusIndex = 0;
    this.#sync();
  }

  /** Chooses the item at `index` (document order, from zero). */
  select(index) {
    if (!this.items[index]) return;
    for (let p = this.nodes[index].parent; p >= 0; p = this.nodes[p].parent) this.expanded.add(p);
    this.#choose(index, false);
    this.#focus(index, false);
  }

  get selectedLabel() {
    return this.current >= 0 ? this.#labelOf(this.current) : '';
  }

  #labelOf(index) {
    return this.items[index].querySelector(':scope > .lk-tree__row .lk-tree__label').textContent.trim();
  }

  #focus(index, move = true) {
    this.focusIndex = index;
    this.#sync();
    if (move) this.items[index].focus();
  }

  #toggle(index, open) {
    if (!this.nodes[index].hasChildren) return;
    if (open) this.expanded.add(index);
    else this.expanded.delete(index);
    this.#sync();
    this.emit('toggle', { label: this.#labelOf(index), open });
  }

  #choose(index, allowToggle) {
    const node = this.nodes[index];
    if (node.hasChildren && allowToggle) this.#toggle(index, !this.expanded.has(index));
    this.current = index;
    this.#sync();
    const path = [];
    for (let p = index; p >= 0; p = this.nodes[p].parent) path.unshift(this.#labelOf(p));
    this.emit('select', { label: this.#labelOf(index), value: this.items[index].dataset.value ?? this.#labelOf(index), path });
  }

  #key(event) {
    const li = event.target.closest('[role=treeitem]');
    if (!li || event.ctrlKey || event.metaKey || event.altKey) return;
    const index = this.items.indexOf(li);
    const { key } = event;
    const result = treeKey(this.nodes, this.expanded, index, key);

    if (key.length === 1 && key !== '*' && key !== ' ') {
      event.preventDefault();
      const now = Date.now();
      this._query = nextQuery(this._query, this._lastKey, key, now);
      this._lastKey = now;
      const visible = visibleIndexes(this.nodes, this.expanded);
      const found = typeaheadIndex(visible.map((i) => this.#labelOf(i)), visible.map(() => true), visible.indexOf(index), this._query);
      if (found >= 0) this.#focus(visible[found]);
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '*', 'Enter', ' '].includes(key)) return;
    event.preventDefault();
    if (result.open !== null) this.#toggle(result.open, true);
    if (result.close !== null) this.#toggle(result.close, false);
    if (result.expandSiblings) result.expandSiblings.forEach((i) => this.#toggle(i, true));
    if (result.focus !== index) this.#focus(result.focus);
    if (result.activate) {
      const link = li.querySelector(':scope > .lk-tree__row a');
      this.#choose(index, true);
      link?.click();
    }
  }

  #sync() {
    const visible = new Set(visibleIndexes(this.nodes, this.expanded));
    this.items.forEach((li, i) => {
      const node = this.nodes[i];
      if (node.hasChildren) {
        li.setAttribute('aria-expanded', String(this.expanded.has(i)));
        li.querySelector(':scope > .lk-tree__group').hidden = !this.expanded.has(i);
      }
      li.tabIndex = visible.has(i) && i === this.focusIndex ? 0 : -1;
      li.setAttribute('aria-selected', String(i === this.current));
    });
  }
}

define('lk-tree', LkTree);
