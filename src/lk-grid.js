import { LkElement, define } from './core/base.js';
import { clamp, gridMove } from './core/utils.js';

/**
 * <lk-grid-explorer> shows a grid of tiles. Choosing a tile reveals its
 * details below, and the grid tracks which tiles have been explored.
 *
 *   <lk-grid-explorer label="Learning theories" columns="3">
 *     <div data-lk-cell="Behaviourism">Learning as a change in behaviour...</div>
 *     <div data-lk-cell="Constructivism">Learners build knowledge...</div>
 *   </lk-grid-explorer>
 *
 * Attributes:
 *   label    Accessible name for the grid. Required.
 *   columns  Number of columns, 1 to 6 (default 3). Narrow screens use fewer.
 *   level    Heading level for the detail title, 1 to 6 (default 3).
 *
 * Choosing the open tile again closes it. After choosing a tile, focus moves
 * to the details; Escape returns to the tile.
 *
 * Events:
 *   lk-explore   detail: { index, title, explored, total }
 *   lk-complete  detail: { explored, total }  when every tile has been opened
 */
export class LkGridExplorer extends LkElement {
  setup() {
    const cells = [...this.querySelectorAll(':scope > [data-lk-cell]')];
    if (cells.length === 0) return;
    const id = this.makeId();
    this.columns = Math.round(clamp(this.getAttribute('columns') ?? 3, 1, 6));
    const level = Math.round(clamp(this.getAttribute('level') ?? 3, 1, 6));
    this.active = -1;
    this.explored = new Set();
    this.completed = false;

    this.grid = document.createElement('div');
    this.grid.className = 'lk-grid__tiles';
    this.grid.setAttribute('role', 'group');
    this.grid.setAttribute('aria-label', this.getAttribute('label') || 'Explorer');
    this.grid.style.setProperty('--lk-grid-columns', String(this.columns));

    this.detail = document.createElement('div');
    this.detail.className = 'lk-grid__detail';
    this.detail.id = `${id}-detail`;
    this.detail.setAttribute('role', 'region');
    this.detail.hidden = true;
    this.detailTitle = document.createElement('div');
    this.detailTitle.className = 'lk-grid__detail-title';
    this.detailTitle.setAttribute('role', 'heading');
    this.detailTitle.setAttribute('aria-level', String(level));
    this.detailTitle.tabIndex = -1;
    this.detail.setAttribute('aria-labelledby', (this.detailTitle.id = `${id}-detail-title`));
    this.detail.append(this.detailTitle);

    this.tiles = cells.map((cell, i) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'lk-grid__tile';
      tile.setAttribute('aria-expanded', 'false');
      tile.setAttribute('aria-controls', this.detail.id);
      const label = document.createElement('span');
      label.className = 'lk-grid__tile-title';
      label.textContent = cell.getAttribute('data-lk-cell');
      const status = document.createElement('span');
      status.className = 'lk-visually-hidden';
      tile.append(label, status);
      tile.addEventListener('click', () => this.#choose(i));
      this.grid.append(tile);

      cell.removeAttribute('data-lk-cell');
      cell.classList.add('lk-grid__content');
      cell.hidden = true;
      this.detail.append(cell);
      return { tile, cell, status, title: label.textContent };
    });

    this.progress = document.createElement('p');
    this.progress.className = 'lk-grid__progress';
    this.progress.setAttribute('aria-live', 'polite');

    this.grid.addEventListener('keydown', (event) => {
      const current = this.tiles.findIndex((t) => t.tile === document.activeElement);
      if (current === -1) return;
      const next = gridMove(current, event.key, this.#visibleColumns(), this.tiles.length);
      if (next === current && !['Home', 'End'].includes(event.key)) return;
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      this.tiles[next].tile.focus();
    });
    this.detail.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.active > -1) {
        event.stopPropagation();
        const index = this.active;
        this.#close();
        this.tiles[index].tile.focus();
      }
    });

    this.replaceChildren(this.grid, this.progress, this.detail);
    this.#syncProgress();
  }

  #visibleColumns() {
    // The grid collapses to fewer columns on narrow screens; read what is really laid out.
    const template = getComputedStyle(this.grid).gridTemplateColumns;
    const count = template.split(' ').filter(Boolean).length;
    return count || this.columns;
  }

  #choose(index) {
    if (this.active === index) {
      this.#close();
      return;
    }
    this.active = index;
    this.tiles.forEach((t, i) => {
      const on = i === index;
      t.tile.setAttribute('aria-expanded', String(on));
      t.cell.hidden = !on;
    });
    this.detailTitle.textContent = this.tiles[index].title;
    this.detail.hidden = false;
    this.explored.add(index);
    this.tiles[index].tile.dataset.explored = '';
    this.#syncProgress();
    this.detailTitle.focus();
    this.emit('explore', { index, title: this.tiles[index].title, explored: this.explored.size, total: this.tiles.length });
    if (!this.completed && this.explored.size === this.tiles.length) {
      this.completed = true;
      this.setAttribute('data-complete', '');
      this.emit('complete', { explored: this.explored.size, total: this.tiles.length });
    }
  }

  #close() {
    this.active = -1;
    this.tiles.forEach((t) => {
      t.tile.setAttribute('aria-expanded', 'false');
      t.cell.hidden = true;
    });
    this.detail.hidden = true;
  }

  #syncProgress() {
    this.tiles.forEach((t, i) => {
      t.status.textContent = this.explored.has(i) ? ' (explored)' : '';
    });
    this.progress.textContent = `${this.explored.size} of ${this.tiles.length} explored.`;
  }

  /** Number of tiles opened so far. */
  get exploredCount() {
    return this.explored ? this.explored.size : 0;
  }
}

define('lk-grid-explorer', LkGridExplorer);
