import { LkElement, define } from './core/base.js';

const TONE_WORDS = { info: 'Information', success: 'Success', warning: 'Warning', danger: 'Problem' };

/**
 * <lk-alert> is a message that sits in the page, such as a tip or a warning.
 *
 *   <lk-alert tone="warning" heading="Deadline moved" dismissible>
 *     Submit by Friday instead.
 *   </lk-alert>
 *
 * Attributes:
 *   tone         info (default), success, warning or danger.
 *   heading      Optional bold first line.
 *   dismissible  Adds a close button. Fires lk-dismiss, then removes the alert.
 *   live         Announce the alert when it appears. Use it only for alerts
 *                added after the page loads, such as a save error.
 *
 * A visually hidden word ("Warning:") is added so the tone never relies on
 * colour alone.
 */
export class LkAlert extends LkElement {
  static observedAttributes = ['tone', 'heading', 'live'];

  attributeChangedCallback() {
    if (this._lkReady) this.#sync();
  }

  setup() {
    const body = document.createElement('div');
    body.className = 'lk-alert__body';
    body.append(...this.childNodes);

    this.icon = document.createElement('span');
    this.icon.className = 'lk-alert__icon';
    this.icon.setAttribute('aria-hidden', 'true');

    this.titleEl = document.createElement('p');
    this.titleEl.className = 'lk-alert__title';
    this.word = document.createElement('span');
    this.word.className = 'lk-visually-hidden';
    this.headingText = document.createElement('span');
    this.titleEl.append(this.word, this.headingText);

    this.content = body;
    this.append(this.icon, this.content);
    this.content.prepend(this.titleEl);

    if (this.hasAttribute('dismissible')) {
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'lk-alert__close';
      close.setAttribute('aria-label', 'Dismiss');
      close.textContent = '×';
      close.addEventListener('click', () => {
        this.emit('dismiss');
        this.remove();
      });
      this.append(close);
    }
    this.#sync();
  }

  #sync() {
    const tone = TONE_WORDS[this.getAttribute('tone')] ? this.getAttribute('tone') : 'info';
    this.dataset.tone = tone;
    const heading = this.getAttribute('heading') || '';
    this.word.textContent = `${TONE_WORDS[tone]}: `;
    this.headingText.textContent = heading;
    // With no heading the word still has to precede the text, so keep the line but hide it visually.
    this.titleEl.hidden = false;
    this.titleEl.classList.toggle('lk-alert__title--bare', !heading);
    if (this.hasAttribute('live')) this.setAttribute('role', tone === 'warning' || tone === 'danger' ? 'alert' : 'status');
    else this.removeAttribute('role');
  }
}

define('lk-alert', LkAlert);
