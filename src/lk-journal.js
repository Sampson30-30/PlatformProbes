import { LkElement, define } from './core/base.js';
import { journalToMarkdown, parseStored, serialiseStored, slugify } from './core/journal.js';
import './lk-field.js';

const SAVE_DELAY = 400;

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * <lk-journal> is a reflection journal: a set of prompts with a text box
 * each. Notes are saved in this browser as the learner types, and can be
 * copied or downloaded.
 *
 *   <lk-journal name="week-1" title="Week 1 reflection">
 *     <div data-lk-prompt="What went well this week?" data-hint="Think about one lesson."></div>
 *     <div data-lk-prompt="What would you change?"></div>
 *   </lk-journal>
 *
 * Attributes:
 *   name   Storage key for this journal. Required if you want notes kept.
 *          Use a different name for each journal on your site.
 *   title  Visible title, also used in exports.
 *   level  Heading level for the title, 1 to 6 (default 2).
 *   rows   Height of each text box in rows (default 5).
 *
 * Events:
 *   lk-save    detail: { name, entries }
 *   lk-export  detail: { format, filename }   format: "copy", "text" or "json"
 */
export class LkJournal extends LkElement {
  setup() {
    const prompts = [...this.querySelectorAll(':scope > [data-lk-prompt]')].map((p) => ({
      prompt: p.getAttribute('data-lk-prompt'),
      hint: p.getAttribute('data-hint') || '',
    }));
    this.replaceChildren();
    if (prompts.length === 0) return;

    this.prompts = prompts;
    this.storageKey = this.getAttribute('name') ? `lk-journal:${this.getAttribute('name')}` : '';
    const saved = this.storageKey ? parseStored(readStorage(this.storageKey)) : {};

    const title = this.getAttribute('title');
    if (title) {
      const h = document.createElement('div');
      h.className = 'lk-journal__title';
      h.setAttribute('role', 'heading');
      h.setAttribute('aria-level', String(Math.min(6, Math.max(1, Number(this.getAttribute('level')) || 2))));
      h.textContent = title;
      this.append(h);
    }

    this.areas = prompts.map((p, i) => {
      const field = document.createElement('lk-field');
      field.setAttribute('label', p.prompt);
      if (p.hint) field.setAttribute('hint', p.hint);
      const area = document.createElement('textarea');
      area.rows = Number(this.getAttribute('rows')) || 5;
      area.value = saved[i] ?? '';
      area.addEventListener('input', () => this.#queueSave());
      field.append(area);
      this.append(field);
      return area;
    });

    const footer = document.createElement('div');
    footer.className = 'lk-journal__footer';
    this.status = document.createElement('p');
    this.status.className = 'lk-journal__status';
    this.status.setAttribute('role', 'status');
    this.actions = document.createElement('div');
    this.actions.className = 'lk-journal__actions';
    footer.append(this.status, this.actions);
    this.append(footer);
    this.#renderActions();

    if (this.storageKey && !this.#storageWorks()) {
      this.#say('Your notes cannot be saved in this browser. Use Download to keep them.');
    } else if (Object.keys(saved).length) {
      this.#say('Your saved notes have been restored.');
    }
  }

  /** The current notes: [{ prompt, text }]. */
  get entries() {
    return this.prompts ? this.prompts.map((p, i) => ({ prompt: p.prompt, text: this.areas[i].value })) : [];
  }

  /** Saves now, without waiting for typing to pause. Returns true if saved. */
  save() {
    clearTimeout(this._timer);
    if (!this.prompts || !this.storageKey) return false;
    const ok = writeStorage(this.storageKey, serialiseStored(this.areas.map((a) => a.value)));
    this.#say(ok ? `Saved at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}.` : 'Your notes could not be saved in this browser. Use Download to keep them.');
    if (ok) this.emit('save', { name: this.getAttribute('name'), entries: this.entries });
    return ok;
  }

  /**
   * Builds an export without downloading it: { filename, mime, content }.
   * format: "text" (Markdown) or "json".
   */
  export(format = 'text') {
    const title = this.getAttribute('title') || 'Reflection journal';
    const base = slugify(this.getAttribute('name') || title);
    if (format === 'json') {
      const content = JSON.stringify({ title, exported: new Date().toISOString(), entries: this.entries }, null, 2);
      return { filename: `${base}.json`, mime: 'application/json', content };
    }
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return { filename: `${base}.txt`, mime: 'text/plain', content: journalToMarkdown({ title, entries: this.entries, date }) };
  }

  /** Removes all notes, here and from storage. */
  clear() {
    this.areas?.forEach((a) => {
      a.value = '';
    });
    if (this.storageKey) {
      try { localStorage.removeItem(this.storageKey); } catch { /* storage unavailable */ }
    }
    this.#say('All notes cleared.');
  }

  #storageWorks() {
    try {
      const probe = '__lk_probe__';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  }

  #say(message) {
    this.status.textContent = message;
  }

  #queueSave() {
    clearTimeout(this._timer);
    if (!this.storageKey) return;
    this.#say('Saving...');
    this._timer = setTimeout(() => this.save(), SAVE_DELAY);
  }

  #button(label, onClick, variant) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lk-button';
    b.dataset.size = 'small';
    if (variant) b.dataset.variant = variant;
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  #renderActions() {
    const copy = this.#button('Copy to clipboard', async () => {
      const { content } = this.export('text');
      try {
        await navigator.clipboard.writeText(content);
        this.#say('Copied to the clipboard.');
        this.emit('export', { format: 'copy', filename: '' });
      } catch {
        this.#say('Copying is not available here. Use Download instead.');
      }
    });
    const text = this.#button('Download text', () => this.#download('text'));
    const json = this.#button('Download JSON', () => this.#download('json'));
    const clear = this.#button('Clear all', () => this.#confirmClear(), 'danger');
    this.actions.replaceChildren(copy, text, json, clear);
  }

  #download(format) {
    const { filename, mime, content } = this.export(format);
    const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.#say(`Downloaded ${filename}.`);
    this.emit('export', { format, filename });
  }

  #confirmClear() {
    const question = document.createElement('span');
    question.className = 'lk-journal__confirm';
    question.textContent = 'Clear all your notes? This cannot be undone.';
    const yes = this.#button('Yes, clear them', () => {
      this.clear();
      this.#renderActions();
      this.actions.lastElementChild.focus();
    }, 'danger');
    const no = this.#button('Keep my notes', () => {
      this.#renderActions();
      this.actions.lastElementChild.focus();
    });
    this.actions.replaceChildren(question, yes, no);
    no.focus();
  }
}

define('lk-journal', LkJournal);
