import { LkElement, define } from './core/base.js';
import { shuffle, startDeck, answerCard, deckSummary } from './core/flashcards.js';

/**
 * <lk-flashcards> is a stack of cards for recall practice. The learner reads
 * the front, tries to remember the back, reveals it, then says whether they
 * knew it. Cards they did not know come round again until all are known.
 *
 *   <lk-flashcards label="Key terms" shuffle>
 *     <div data-lk-card="Formative assessment">Assessment during learning, used to shape the teaching.</div>
 *     <div data-lk-card="Summative assessment">Assessment at the end, used to judge what was learned.</div>
 *   </lk-flashcards>
 *
 * Attributes:
 *   label    Accessible name. Required.
 *   shuffle  Present the cards in a random order.
 *
 * The attribute value of data-lk-card is the front; the element's content is
 * the back and may contain markup.
 *
 * Events: lk-reveal { index }, lk-cardanswer { index, known },
 * lk-deckcomplete { total, firstTime }.
 */
export class LkFlashcards extends LkElement {
  setup() {
    this.cards = [...this.querySelectorAll(':scope > [data-lk-card]')].map((el) => ({
      front: el.getAttribute('data-lk-card'),
      back: [...el.childNodes].map((n) => n.cloneNode(true)),
    }));
    if (this.cards.length === 0) return;
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', this.getAttribute('label') || 'Flashcards');
    this.replaceChildren();
    this.stage = document.createElement('div');
    this.stage.className = 'lk-flashcards__stage';
    this.live = document.createElement('p');
    this.live.className = 'lk-visually-hidden';
    this.live.setAttribute('role', 'status');
    this.append(this.stage, this.live);
    this.restart();
  }

  /** Start again with every card. */
  restart() {
    this.#begin([...this.cards.keys()]);
  }

  /** Start again with only the cards that were missed. */
  practiseMissed() {
    const missed = deckSummary(this.deck).missed;
    this.#begin(missed.length ? missed : [...this.cards.keys()]);
  }

  #begin(indexes) {
    this.deck = startDeck(this.hasAttribute('shuffle') ? shuffle(indexes) : indexes);
    this.revealed = false;
    this.#render();
  }

  #render(focus) {
    const summary = deckSummary(this.deck);
    this.stage.replaceChildren();
    this.stage.classList.toggle('is-done', summary.done);
    if (summary.done) {
      this.#renderDone(summary);
      return;
    }
    const index = this.deck.queue[0];
    const card = this.cards[index];

    const count = document.createElement('p');
    count.className = 'lk-flashcards__count';
    count.textContent = `${summary.total - summary.remaining} of ${summary.total} known`;

    const face = document.createElement('div');
    face.className = 'lk-flashcards__card';
    const front = document.createElement('p');
    front.className = 'lk-flashcards__front';
    front.textContent = card.front;
    face.append(front);

    const actions = document.createElement('div');
    actions.className = 'lk-flashcards__actions';

    if (!this.revealed) {
      const show = this.#button('Show answer', 'primary', () => {
        this.revealed = true;
        this.emit('reveal', { index });
        this.#render(true);
      });
      actions.append(show);
    } else {
      const back = document.createElement('div');
      back.className = 'lk-flashcards__back';
      back.append(...card.back.map((n) => n.cloneNode(true)));
      face.append(back);
      actions.append(
        this.#button('I knew it', 'primary', () => this.#answer(true)),
        this.#button('Not yet', '', () => this.#answer(false))
      );
    }
    this.stage.append(count, face, actions);
    if (focus) actions.querySelector('button').focus();
  }

  #answer(known) {
    const index = this.deck.queue[0];
    this.deck = answerCard(this.deck, known);
    this.revealed = false;
    this.emit('cardanswer', { index, known });
    const summary = deckSummary(this.deck);
    this.#render(true);
    if (summary.done) {
      this.emit('deckcomplete', { total: summary.total, firstTime: summary.firstTime });
      this.stage.querySelector('[tabindex="-1"]')?.focus();
    } else {
      this.live.textContent = known ? 'Marked as known.' : 'This card will come round again.';
    }
  }

  #renderDone(summary) {
    const heading = document.createElement('p');
    heading.className = 'lk-flashcards__result';
    heading.tabIndex = -1;
    heading.textContent = `Finished. You knew ${summary.firstTime} of ${summary.total} the first time.`;
    const actions = document.createElement('div');
    actions.className = 'lk-flashcards__actions';
    if (summary.missed.length > 0) {
      actions.append(
        this.#button(`Practise the ${summary.missed.length} I missed`, 'primary', () => {
          this.practiseMissed();
          this.stage.querySelector('button')?.focus();
        })
      );
    }
    actions.append(
      this.#button('Start again', summary.missed.length ? '' : 'primary', () => {
        this.restart();
        this.stage.querySelector('button')?.focus();
      })
    );
    this.stage.append(heading, actions);
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

define('lk-flashcards', LkFlashcards);
