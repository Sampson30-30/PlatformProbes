import { LkElement, define } from './core/base.js';
import { parsePercent, exploredText } from './core/spots.js';

/**
 * <lk-hotspot> puts numbered points on a picture or diagram. Choosing a point
 * shows its explanation, and the component tracks which have been explored.
 *
 *   <lk-hotspot label="Parts of a plant">
 *     <img src="plant.png" alt="A plant with a flower, stem and roots" />
 *     <div data-lk-spot data-x="50" data-y="15" data-title="Flower">Makes seeds.</div>
 *     <div data-lk-spot data-x="48" data-y="60" data-title="Stem">Carries water.</div>
 *   </lk-hotspot>
 *
 * The first child that is not a spot is the picture. It can be an <img>, an
 * <svg> or any element. Its own alt text or title should describe it.
 * data-x and data-y are percentages from the top left.
 *
 * Every point is a real button, in the order written, with its title as its
 * accessible name, so the picture is never the only way in. The explanation
 * shows beneath the picture.
 *
 * Attributes:
 *   label  Accessible name. Required.
 *
 * Events: lk-spot { index, title }, lk-allexplored { total }.
 */
export class LkHotspot extends LkElement {
  setup() {
    const spotEls = [...this.querySelectorAll(':scope > [data-lk-spot]')];
    const picture = [...this.children].find((c) => !c.hasAttribute('data-lk-spot'));
    if (spotEls.length === 0 || !picture) return;
    this.spots = spotEls.map((el, i) => ({
      x: parsePercent(el.dataset.x),
      y: parsePercent(el.dataset.y),
      title: el.dataset.title || `Point ${i + 1}`,
      body: [...el.childNodes],
    }));
    this.explored = new Set();
    this.current = -1;

    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', this.getAttribute('label') || 'Interactive picture');

    this.figure = document.createElement('div');
    this.figure.className = 'lk-hotspot__figure';
    this.figure.append(picture);
    this.buttons = this.spots.map((spot, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lk-hotspot__point';
      b.style.left = `${spot.x}%`;
      b.style.top = `${spot.y}%`;
      b.setAttribute('aria-label', spot.title);
      b.textContent = String(i + 1);
      b.addEventListener('click', () => this.select(i));
      this.figure.append(b);
      return b;
    });

    this.progress = document.createElement('p');
    this.progress.className = 'lk-hotspot__progress';
    this.detail = document.createElement('div');
    this.detail.className = 'lk-hotspot__detail';
    this.detail.setAttribute('aria-live', 'polite');
    this.replaceChildren(this.figure, this.progress, this.detail);
    this.#sync();
  }

  /** Show the explanation for point `index` (zero-based). */
  select(index) {
    if (!this.spots?.[index]) return;
    this.current = index;
    const firstTime = !this.explored.has(index);
    this.explored.add(index);
    this.#sync();
    this.emit('spot', { index, title: this.spots[index].title });
    if (firstTime && this.explored.size === this.spots.length) this.emit('allexplored', { total: this.spots.length });
  }

  #sync() {
    this.buttons.forEach((b, i) => {
      if (i === this.current) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
      b.toggleAttribute('data-explored', this.explored.has(i));
      b.setAttribute('aria-label', this.explored.has(i) ? `${this.spots[i].title} (explored)` : this.spots[i].title);
    });
    this.progress.textContent = exploredText(this.explored.size, this.spots.length);
    this.detail.replaceChildren();
    if (this.current < 0) {
      const hint = document.createElement('p');
      hint.className = 'lk-hotspot__hint';
      hint.textContent = 'Choose a numbered point to find out more.';
      this.detail.append(hint);
      return;
    }
    const spot = this.spots[this.current];
    const title = document.createElement('p');
    title.className = 'lk-hotspot__title';
    title.textContent = `${this.current + 1}. ${spot.title}`;
    this.detail.append(title, ...spot.body.map((n) => n.cloneNode(true)));
  }
}

define('lk-hotspot', LkHotspot);
