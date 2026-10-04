import { LkElement, define } from './core/base.js';
import { clamp } from './core/utils.js';
import { parseQuiz, scoreQuestion, scoreQuiz, shuffle } from './core/quiz.js';

/**
 * <lk-quiz> is a knowledge check: one question at a time, instant feedback,
 * then a score. Write the questions as markup, as JSON, or both.
 *
 * Markup:
 *   <lk-quiz label="Check your understanding">
 *     <div data-lk-question="Which of these is formative assessment?">
 *       <div data-lk-option correct data-feedback="Yes: it informs teaching.">A quick quiz</div>
 *       <div data-lk-option>A final exam</div>
 *       <p data-lk-explanation>Formative assessment happens during learning.</p>
 *     </div>
 *   </lk-quiz>
 *
 * Mark more than one option `correct` for a "choose all that apply" question.
 *
 * JSON (a child script, or the `data` property):
 *   <script type="application/json">
 *     { "title": "Quiz", "questions": [
 *       { "prompt": "Pick one", "options": ["A", "B"], "answer": 0, "explanation": "..." } ] }
 *   </script>
 *
 * Attributes:
 *   label    Accessible name for the quiz.
 *   title    Visible title (the JSON title is used if this is missing).
 *   level    Heading level for the title and results, 1 to 6 (default 2).
 *   shuffle  Shuffle the order of the options each attempt.
 *
 * Events:
 *   lk-answer    detail: { id, index, correct, selected }
 *   lk-complete  detail: { correct, total, percent, points }
 */
export class LkQuiz extends LkElement {
  setup() {
    this.addEventListener('submit', (event) => event.preventDefault());
    const data = this.#readJson() ?? this.#readMarkup();
    this.replaceChildren(...[...this.children].filter((c) => c.matches('script[type="application/json"]')));
    this.#start(parseQuiz(data));
  }

  /** Replaces the quiz with new data and restarts it. */
  set data(value) {
    if (!this._lkReady) return;
    this.#start(parseQuiz(value));
  }

  /** Restarts the quiz from the first question. */
  reset() {
    this.#start(this.quiz);
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
    const questions = [...this.querySelectorAll(':scope > [data-lk-question]')].map((q) => ({
      prompt: q.getAttribute('data-lk-question'),
      type: q.getAttribute('data-type'),
      options: [...q.querySelectorAll('[data-lk-option]')].map((o) => ({
        text: o.textContent,
        correct: o.hasAttribute('correct'),
        feedback: o.getAttribute('data-feedback'),
      })),
      explanation: q.querySelector('[data-lk-explanation]')?.textContent.trim(),
    }));
    return { questions };
  }

  #start(quiz) {
    this.quiz = quiz;
    this.index = 0;
    this.results = [];
    this.views = quiz.questions.map((q) => ({
      ...q,
      options: this.hasAttribute('shuffle') ? shuffle(q.options) : q.options,
    }));
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', this.getAttribute('label') || 'Quiz');
    this.shell = document.createElement('div');
    this.shell.className = 'lk-quiz__shell';
    const keep = [...this.children].filter((c) => c.matches('script[type="application/json"]'));
    this.replaceChildren(...keep, this.shell);
    if (this.views.length === 0) {
      this.#empty(quiz.problems);
      return;
    }
    this.#renderQuestion();
  }

  #empty(problems) {
    const p = document.createElement('p');
    p.className = 'lk-quiz__problem';
    p.textContent = problems.length ? `This quiz could not be shown. ${problems[0]}` : 'This quiz has no questions.';
    this.shell.replaceChildren(p);
  }

  #heading(text, className) {
    const h = document.createElement('div');
    h.className = className;
    h.setAttribute('role', 'heading');
    h.setAttribute('aria-level', String(Math.round(clamp(this.getAttribute('level') ?? 2, 1, 6))));
    h.tabIndex = -1;
    h.textContent = text;
    return h;
  }

  #header() {
    const header = document.createElement('div');
    header.className = 'lk-quiz__header';
    const title = this.getAttribute('title') || this.quiz.title;
    if (title) header.append(this.#heading(title, 'lk-quiz__title'));
    const count = document.createElement('p');
    count.className = 'lk-quiz__count';
    count.textContent = `Question ${this.index + 1} of ${this.views.length}`;
    header.append(count);
    return header;
  }

  #renderQuestion() {
    const q = this.views[this.index];
    const form = document.createElement('form');
    form.className = 'lk-quiz__question';
    form.noValidate = true;

    const fieldset = document.createElement('fieldset');
    fieldset.className = 'lk-quiz__fieldset';
    const legend = document.createElement('legend');
    legend.className = 'lk-quiz__prompt';
    legend.tabIndex = -1;
    legend.textContent = q.prompt;
    const hint = document.createElement('p');
    hint.className = 'lk-quiz__hint';
    hint.textContent = q.type === 'multiple' ? 'Choose all that apply.' : 'Choose one answer.';

    const list = document.createElement('div');
    list.className = 'lk-quiz__options';
    const name = `${this.makeId()}-${q.id}`;
    q.options.forEach((option, i) => {
      const label = document.createElement('label');
      label.className = 'lk-choice lk-quiz__option';
      const input = document.createElement('input');
      input.type = q.type === 'multiple' ? 'checkbox' : 'radio';
      input.name = name;
      input.value = String(i);
      const body = document.createElement('span');
      body.className = 'lk-quiz__option-body';
      const text = document.createElement('span');
      text.className = 'lk-quiz__text';
      text.textContent = option.text;
      const tag = document.createElement('strong');
      tag.className = 'lk-quiz__tag';
      const feedback = document.createElement('span');
      feedback.className = 'lk-quiz__option-feedback';
      body.append(text, tag, feedback);
      label.append(input, body);
      list.append(label);
    });

    fieldset.append(legend, hint, list);
    const error = document.createElement('div');
    error.className = 'lk-field__error lk-quiz__error';
    error.setAttribute('aria-live', 'polite');
    error.hidden = true;
    const result = document.createElement('div');
    result.className = 'lk-quiz__result';
    result.setAttribute('role', 'status');
    result.tabIndex = -1;
    result.hidden = true;
    const actions = document.createElement('div');
    actions.className = 'lk-quiz__actions';
    const check = this.#button('Check answer', 'primary');
    actions.append(check);
    form.append(fieldset, error, result, actions);

    check.addEventListener('click', () => {
      const inputs = [...list.querySelectorAll('input')];
      const selected = inputs.flatMap((input, i) => (input.checked ? [i] : []));
      if (selected.length === 0) {
        error.hidden = false;
        error.replaceChildren(Object.assign(document.createElement('strong'), { textContent: 'Error: ' }), 'Choose an answer before you check it.');
        inputs[0].focus();
        return;
      }
      error.hidden = true;
      this.#check(q, inputs, selected, { list, result, actions, check });
    });

    this.shell.replaceChildren(this.#header(), form);
    this.removeAttribute('data-complete');
  }

  #button(label, variant) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lk-button';
    if (variant) b.dataset.variant = variant;
    b.textContent = label;
    return b;
  }

  #check(q, inputs, selected, ui) {
    const score = scoreQuestion(q, selected);
    this.results[this.index] = score;
    const labels = [...ui.list.children];
    q.options.forEach((option, i) => {
      const label = labels[i];
      const chosen = selected.includes(i);
      inputs[i].disabled = true;
      const tag = label.querySelector('.lk-quiz__tag');
      if (chosen && option.correct) {
        label.dataset.result = 'correct';
        tag.textContent = ' Correct';
      } else if (chosen) {
        label.dataset.result = 'incorrect';
        tag.textContent = ' Incorrect';
      } else if (option.correct) {
        label.dataset.result = 'missed';
        tag.textContent = ' Correct answer';
      }
      if (chosen && option.feedback) {
        label.querySelector('.lk-quiz__option-feedback').textContent = ` ${option.feedback}`;
      }
    });

    const totalCorrect = q.options.filter((o) => o.correct).length;
    let message;
    if (score.correct) {
      message = q.type === 'multiple' ? `Correct. You found all ${totalCorrect} correct answers.` : 'Correct.';
    } else if (q.type === 'multiple') {
      message = `Not quite. You found ${score.hits} of ${totalCorrect} correct answers`;
      message += score.wrong ? ` and chose ${score.wrong} incorrect ${score.wrong === 1 ? 'option' : 'options'}.` : '.';
    } else {
      message = 'Not quite. The correct answer is marked.';
    }
    ui.result.hidden = false;
    ui.result.dataset.result = score.correct ? 'correct' : 'incorrect';
    ui.result.replaceChildren();
    const strong = document.createElement('strong');
    strong.textContent = message;
    ui.result.append(strong);
    if (q.explanation) {
      const p = document.createElement('p');
      p.className = 'lk-quiz__explanation';
      p.textContent = q.explanation;
      ui.result.append(p);
    }

    const last = this.index === this.views.length - 1;
    const next = this.#button(last ? 'See your results' : 'Next question', 'primary');
    next.addEventListener('click', () => {
      if (last) this.#renderResults();
      else {
        this.index += 1;
        this.#renderQuestion();
        this.shell.querySelector('.lk-quiz__prompt').focus();
      }
    });
    ui.actions.replaceChildren(next);
    ui.result.focus();
    this.emit('answer', { id: q.id, index: this.index, correct: score.correct, selected });
  }

  #renderResults() {
    const summary = scoreQuiz(this.results);
    const wrap = document.createElement('div');
    wrap.className = 'lk-quiz__results';
    const heading = this.#heading('Your results', 'lk-quiz__title');
    const score = document.createElement('p');
    score.className = 'lk-quiz__score';
    score.textContent = `You got ${summary.correct} of ${summary.total} correct (${summary.percent}%).`;
    const list = document.createElement('ol');
    list.className = 'lk-quiz__summary';
    this.views.forEach((q, i) => {
      const li = document.createElement('li');
      const ok = this.results[i]?.correct;
      li.dataset.result = ok ? 'correct' : 'incorrect';
      const word = document.createElement('strong');
      word.textContent = ok ? 'Correct: ' : 'Not correct: ';
      li.append(word, q.prompt);
      list.append(li);
    });
    const again = this.#button('Try again');
    again.addEventListener('click', () => {
      this.reset();
      this.shell.querySelector('.lk-quiz__prompt')?.focus();
    });
    const actions = document.createElement('div');
    actions.className = 'lk-quiz__actions';
    actions.append(again);
    wrap.append(heading, score, list, actions);
    this.shell.replaceChildren(wrap);
    this.toggleAttribute('data-complete', true);
    heading.focus();
    this.emit('complete', summary);
  }
}

define('lk-quiz', LkQuiz);
