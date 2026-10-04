import { BRIEF_TEXT, KINDS, ORIGINS, PLACES, CHECKS, EXAMPLE } from '../data/brief.js';
import { emptyBrief, checkBrief, briefToMarkdown } from '../lib/brief.js';
import { inline } from '../lib/text.js';
import { PAGE_HELP } from '../data/help.js';

const KEY = 'hb-brief';
const MAX_PARTS = 8;

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved === 'object') return { ...emptyBrief(), ...saved };
  } catch { /* nothing saved, or storage unavailable */ }
  return emptyBrief();
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function button(label, onClick, variant) {
  const b = el('button', 'lk-button', label);
  b.type = 'button';
  if (variant) b.dataset.variant = variant;
  b.addEventListener('click', onClick);
  return b;
}

export function buildBrief(main) {
  let state = load();
  const persist = () => save(state);

  // ---- field builders, bound to the state ----

  const text = (label, hint, get, set, { rows = 3, single = false } = {}) => {
    const f = el('lk-field');
    f.setAttribute('label', label);
    if (hint) f.setAttribute('hint', hint);
    const input = single ? el('input') : el('textarea');
    if (!single) input.rows = rows;
    input.value = get();
    input.addEventListener('input', () => { set(input.value); persist(); });
    f.append(input);
    return f;
  };

  const select = (label, hint, options, get, set) => {
    const f = el('lk-field');
    f.setAttribute('label', label);
    if (hint) f.setAttribute('hint', hint);
    const s = el('select');
    s.append(new Option('Choose one', ''));
    for (const o of options) s.append(new Option(o, o));
    s.value = get();
    s.addEventListener('change', () => { set(s.value); persist(); });
    f.append(s);
    return f;
  };

  // ---- the steps ----

  const partsStep = () => {
    const box = el('div', 'parts');
    const draw = () => {
      box.replaceChildren();
      state.parts.forEach((part, i) => {
        const row = el('fieldset', 'part-row');
        row.append(el('legend', '', `Part ${i + 1}`));
        row.append(
          text('Name', i === 0 ? 'For example: "The coastlines" or "Local time in each city".' : '', () => part.name, (v) => { part.name = v; }, { single: true }),
          select('What kind of thing is it?', '', KINDS, () => part.kind, (v) => { part.kind = v; }),
          select('Where does it come from?', '', ORIGINS, () => part.origin, (v) => { part.origin = v; }),
          text('Notes', '', () => part.note, (v) => { part.note = v; }, { single: true }),
        );
        if (state.parts.length > 1) {
          row.append(button(`Remove part ${i + 1}`, () => { state.parts.splice(i, 1); persist(); draw(); }));
        }
        box.append(row);
      });
      if (state.parts.length < MAX_PARTS) {
        box.append(button('Add a part', () => { state.parts.push({ name: '', kind: '', origin: '', note: '' }); persist(); draw(); }));
      }
    };
    draw();
    return [box];
  };

  const stepContent = [
    () => [
      text('What do you want to make?', 'In a sentence or two, in plain words.', () => state.idea, (v) => { state.idea = v; }),
      text('Who will use it, and what should they be able to do afterwards?', '', () => state.audience, (v) => { state.audience = v; }),
    ],
    partsStep,
    () => [
      text('Which things could a rule produce, instead of being typed in?', 'Habit 2. Think of anything that changes with the date, the learner or the data.', () => state.rules, (v) => { state.rules = v; }),
      text('What will change over time, and who will change it?', 'Habit 3. Wording, a list, colours? If you will change it, it should be easy to find.', () => state.changes, (v) => { state.changes = v; }),
    ],
    () => [
      text('What should it do?', 'Write it as "When someone does this, that happens." One line for each behaviour.', () => state.behaviour, (v) => { state.behaviour = v; }, { rows: 5 }),
      text('What must not change or break?', 'Limits count as much as features. Is there anything you already have that must stay?', () => state.mustNot, (v) => { state.mustNot = v; }),
    ],
    () => {
      const checks = el('lk-choices');
      checks.setAttribute('legend', 'What will you test across?');
      checks.setAttribute('hint', 'Pick everything that applies.');
      for (const c of CHECKS) {
        const label = el('label');
        const box = el('input');
        box.type = 'checkbox';
        box.value = c;
        box.checked = state.checks.includes(c);
        box.addEventListener('change', () => {
          state.checks = box.checked ? [...new Set([...state.checks, c])] : state.checks.filter((x) => x !== c);
          persist();
        });
        label.append(box, ` ${c}`);
        checks.append(label);
      }
      return [
        select('Where will it live?', 'The place changes what is possible.', PLACES, () => state.place, (v) => { state.place = v; }),
        text('What do you know about that place?', 'Anything it blocks, or that must look or behave a certain way there.', () => state.placeNotes, (v) => { state.placeNotes = v; }),
        text('How will you know it works for the person using it?', 'Habit 6. What would you see, or what could a learner do?', () => state.verify, (v) => { state.verify = v; }),
        checks,
      ];
    },
  ];

  // ---- the final step ----

  let proc;
  const output = el('div', 'brief-out');
  const renderOutput = () => {
    output.replaceChildren();
    const results = checkBrief(state);
    const gaps = results.filter((r) => r.level === 'gap');
    const tips = results.filter((r) => r.level === 'tip');

    const summary = el('p', 'brief-summary');
    summary.setAttribute('role', 'status');
    summary.textContent = gaps.length === 0
      ? (tips.length ? `No gaps. ${tips.length} ${tips.length === 1 ? 'thing is' : 'things are'} worth a second look.` : 'No gaps and nothing to flag. This is a strong brief.')
      : `${gaps.length} ${gaps.length === 1 ? 'gap' : 'gaps'} to fill${tips.length ? `, and ${tips.length} ${tips.length === 1 ? 'thing' : 'things'} worth a second look` : ''}.`;
    output.append(summary);

    if (results.length) {
      const list = el('ul', 'brief-checks');
      for (const r of results) {
        const li = el('li');
        li.append(el('strong', '', r.level === 'gap' ? 'Gap: ' : 'Worth a look: '), r.message, ' ');
        li.append(button(`Go to step ${r.step + 1}`, () => proc.go(r.step, { focus: true })));
        list.append(li);
      }
      output.append(list);
    }

    const area = el('textarea', 'lk-control brief-text');
    area.readOnly = true;
    area.rows = 20;
    area.value = briefToMarkdown(state);
    area.setAttribute('aria-label', 'Your brief, ready to paste into a conversation with Claude');
    const status = el('span', 'brief-status');
    status.setAttribute('role', 'status');
    const actions = el('p', 'brief-actions');
    actions.append(
      button('Copy brief', async () => {
        try { await navigator.clipboard.writeText(area.value); status.textContent = 'Copied. Paste it into a conversation with Claude.'; }
        catch { area.select(); status.textContent = 'Select the text and copy it with Ctrl+C or Cmd+C.'; }
      }, 'primary'),
      button('Download as a file', () => {
        const url = URL.createObjectURL(new Blob([area.value], { type: 'text/markdown;charset=utf-8' }));
        const a = el('a');
        a.href = url;
        a.download = 'brief.md';
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.textContent = 'Downloaded brief.md.';
      }),
      status,
    );
    output.append(area, actions);
  };

  // ---- the page ----

  const article = el('article', 'prose prose--wide');
  article.innerHTML = `
    <header class="topic-head">
      <p class="eyebrow">Tool</p>
      <h1>Brief builder</h1>
      <p class="topic-question">What would an engineer want to know before building this?</p>
      <p class="topic-summary">${inline(BRIEF_TEXT.intro)}</p>
    </header>`;

  const tools = el('p', 'brief-tools');
  const holder = el('div', 'brief-holder');

  const mount = (startAt = 0) => {
    proc = el('lk-process');
    proc.setAttribute('label', 'Brief builder');
    proc.setAttribute('level', '2');
    BRIEF_TEXT.steps.forEach((s, i) => {
      const step = el('div');
      step.setAttribute('data-lk-step', s.title);
      step.append(el('p', 'brief-hint', s.hint));
      if (i < stepContent.length) for (const node of stepContent[i]()) step.append(node);
      else step.append(output);
      proc.append(step);
    });
    proc.addEventListener('lk-step', (e) => { if (e.detail.index === BRIEF_TEXT.steps.length - 1) renderOutput(); });
    holder.replaceChildren(proc);
    if (startAt > 0) requestAnimationFrame(() => proc.go(startAt));
  };

  tools.append(
    button('Load an example', () => {
      state = { ...emptyBrief(), ...structuredClone(EXAMPLE) };
      persist();
      mount();
      note.textContent = 'Loaded the world time map brief. Read through it, then change it to see how the checks react.';
    }),
    button('Start again', () => {
      if (!confirmClear.hidden) return;
      confirmClear.hidden = false;
      confirmClear.querySelector('button').focus();
    }),
  );
  const note = el('span', 'brief-status');
  note.setAttribute('role', 'status');
  tools.append(note);

  const confirmClear = el('div', 'brief-confirm');
  confirmClear.hidden = true;
  confirmClear.append(
    el('span', '', 'Clear everything you have written here?'),
    button('Yes, clear it', () => {
      state = emptyBrief();
      persist();
      confirmClear.hidden = true;
      mount();
      note.textContent = 'Cleared.';
    }, 'danger'),
    button('Keep it', () => { confirmClear.hidden = true; }),
  );

  article.append(tools, confirmClear, holder);
  main.append(article);
  mount();
  return { title: 'Brief builder', navId: 'brief', help: PAGE_HELP.brief };
}
