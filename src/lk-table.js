import { LkElement, define } from './core/base.js';
import { detectType, sortIndexes, nextDirection, matchRow, tableSummary } from './core/table.js';

/**
 * <lk-table> makes a native <table> sortable and filterable. The table stays
 * ordinary HTML, so it reads well without JavaScript.
 *
 *   <lk-table label="Courses" sortable filter>
 *     <table>
 *       <caption>Courses this term</caption>
 *       <thead><tr><th>Course</th><th>Hours</th></tr></thead>
 *       <tbody>...</tbody>
 *     </table>
 *   </lk-table>
 *
 * Attributes:
 *   label     Accessible name for the scrolling region. Required.
 *   sortable  Header cells become sort buttons. Put data-nosort on a <th> to skip it.
 *   filter    Adds a search box that hides rows without every typed word.
 *   striped   Shades alternate rows.
 *
 * Sorting reads numbers (including £, % and commas) when every value in a
 * column is a number, otherwise sorts text naturally. A cell's data-value
 * attribute overrides its text, for dates or hidden sort keys. A third click
 * on a header restores the original order.
 *
 * Events: lk-sort { column, direction }, lk-filter { query, shown, total }.
 */
export class LkTable extends LkElement {
  static observedAttributes = ['sortable', 'filter'];

  attributeChangedCallback() {
    if (this._lkReady) this.#build();
  }

  setup() {
    this.table = this.querySelector('table');
    if (!this.table) return;
    this.body = this.table.tBodies[0];
    if (!this.body) return;
    this.rows = [...this.body.rows];
    this.query = '';
    this.sort = { column: -1, direction: 'none' };

    this.wrap = document.createElement('div');
    this.wrap.className = 'lk-table__wrap';
    this.wrap.tabIndex = 0;
    this.wrap.setAttribute('role', 'region');
    this.table.before(this.wrap);
    this.wrap.append(this.table);

    this.status = document.createElement('p');
    this.status.className = 'lk-table__status';
    this.status.setAttribute('role', 'status');
    this.append(this.status);

    this.#build();
  }

  #cellValue(row, column) {
    const cell = row.cells[column];
    if (!cell) return '';
    return cell.dataset.value ?? cell.textContent.trim();
  }

  #build() {
    this.wrap.setAttribute('aria-label', this.getAttribute('label') || 'Table');

    // Filter box
    if (this.hasAttribute('filter') && !this.tools) {
      const id = this.makeId();
      this.tools = document.createElement('div');
      this.tools.className = 'lk-table__tools';
      const label = document.createElement('label');
      label.className = 'lk-field__label';
      label.htmlFor = `${id}-filter`;
      label.textContent = 'Filter rows';
      this.input = document.createElement('input');
      this.input.type = 'search';
      this.input.id = `${id}-filter`;
      this.input.className = 'lk-control';
      this.input.autocomplete = 'off';
      this.input.addEventListener('input', () => {
        this.query = this.input.value;
        this.#apply();
        this.emit('filter', { query: this.query, shown: this.shown, total: this.rows.length });
      });
      this.tools.append(label, this.input);
      this.wrap.before(this.tools);
    } else if (!this.hasAttribute('filter') && this.tools) {
      this.tools.remove();
      this.tools = this.input = null;
      this.query = '';
    }

    // Sort buttons
    const headers = this.table.tHead ? [...this.table.tHead.rows[this.table.tHead.rows.length - 1].cells] : [];
    this.headers = headers;
    const sortable = this.hasAttribute('sortable');
    headers.forEach((th, column) => {
      const existing = th.querySelector('.lk-table__sort');
      if (sortable && !th.hasAttribute('data-nosort') && !existing) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'lk-table__sort';
        button.append(...th.childNodes);
        const arrow = document.createElement('span');
        arrow.className = 'lk-table__arrow';
        arrow.setAttribute('aria-hidden', 'true');
        button.append(arrow);
        th.append(button);
        button.addEventListener('click', () => this.sortBy(column));
      } else if (!sortable && existing) {
        existing.querySelector('.lk-table__arrow')?.remove();
        th.replaceChildren(...existing.childNodes);
        th.removeAttribute('aria-sort');
      }
    });
    this.#apply();
  }

  /** Sort by a column index. Repeat calls cycle ascending, descending, original order. */
  sortBy(column, direction) {
    const next = direction ?? nextDirection(this.sort.column === column ? this.sort.direction : 'none');
    this.sort = { column: next === 'none' ? -1 : column, direction: next };
    this.#apply();
    this.emit('sort', { column, direction: next });
  }

  #apply() {
    // Order
    let order = this.rows.map((_, i) => i);
    if (this.sort.column >= 0) {
      const values = this.rows.map((r) => this.#cellValue(r, this.sort.column));
      const th = this.headers[this.sort.column];
      const type = th?.dataset.type || detectType(values);
      order = sortIndexes(values, type, this.sort.direction);
    }
    for (const i of order) this.body.append(this.rows[i]);

    // Filter
    this.shown = 0;
    for (const row of this.rows) {
      const match = matchRow([...row.cells].map((c) => c.textContent), this.query);
      row.hidden = !match;
      if (match) this.shown++;
    }

    // Header state and announcement
    this.headers.forEach((th, column) => {
      if (!th.querySelector('.lk-table__sort')) return;
      if (column === this.sort.column) th.setAttribute('aria-sort', this.sort.direction);
      else th.setAttribute('aria-sort', 'none');
    });
    const parts = [tableSummary(this.shown, this.rows.length)];
    if (this.sort.column >= 0) {
      const name = this.headers[this.sort.column].textContent.trim();
      parts.push(`sorted by ${name}, ${this.sort.direction}`);
    }
    this.status.textContent = parts.join(', ');
  }
}

define('lk-table', LkTable);
