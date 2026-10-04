import { LkElement, define } from './core/base.js';
import { initials, toneIndex } from './core/widgets.js';

const TONES = ['primary', 'success', 'warning', 'info', 'danger'];

/**
 * <lk-avatar> shows a person as a picture, or as their initials when there
 * is no picture or it fails to load.
 *
 *   <lk-avatar name="Ada Lovelace"></lk-avatar>
 *   <lk-avatar name="Grace Hopper" src="grace.jpg" size="lg"></lk-avatar>
 *
 * Attributes:
 *   name        The person's name. Used for the initials and the accessible name.
 *   src         Optional picture URL.
 *   size        sm, md (default) or lg.
 *   tone        A fixed colour (primary, success, warning, info, danger). By
 *               default the colour comes from the name, so it is stable.
 *   decorative  Hide it from screen readers, for when the name is shown next to it.
 */
export class LkAvatar extends LkElement {
  static observedAttributes = ['name', 'src', 'tone', 'decorative'];

  attributeChangedCallback() {
    if (this._lkReady) this.#sync();
  }

  setup() {
    this.#sync();
  }

  #sync() {
    const name = this.getAttribute('name') || '';
    const src = this.getAttribute('src');
    this.replaceChildren();

    if (this.hasAttribute('decorative')) {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    } else {
      this.removeAttribute('aria-hidden');
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', name || 'Person');
    }
    const tone = TONES.includes(this.getAttribute('tone')) ? this.getAttribute('tone') : TONES[toneIndex(name, TONES.length)];
    this.dataset.tone = tone;

    const showInitials = () => {
      const span = document.createElement('span');
      span.className = 'lk-avatar__initials';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = initials(name) || '?';
      this.replaceChildren(span);
    };
    if (src) {
      const img = document.createElement('img');
      img.className = 'lk-avatar__image';
      img.alt = '';
      img.src = src;
      img.addEventListener('error', showInitials);
      this.append(img);
    } else {
      showInitials();
    }
  }
}

define('lk-avatar', LkAvatar);
