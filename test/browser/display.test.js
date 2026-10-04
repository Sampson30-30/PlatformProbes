import { test, assert, equal, mount, click, press, listen, tick } from './harness.js';

const TABLE = `
  <lk-table label="Courses" sortable filter>
    <table>
      <caption>Courses</caption>
      <thead><tr><th>Course</th><th>Hours</th><th data-nosort>Notes</th></tr></thead>
      <tbody>
        <tr><td>Maths</td><td>30</td><td>core</td></tr>
        <tr><td>Art</td><td>9</td><td>option</td></tr>
        <tr><td>English</td><td>100</td><td>core</td></tr>
      </tbody>
    </table>
  </lk-table>`;

const names = (el) => [...el.querySelectorAll('tbody tr')].filter((r) => !r.hidden).map((r) => r.cells[0].textContent);

// ---- lk-table ----

test('table: headers become sort buttons, except where opted out', async () => {
  const el = await mount(TABLE);
  equal(el.querySelectorAll('th button.lk-table__sort').length, 2);
  equal(el.querySelectorAll('th')[0].getAttribute('aria-sort'), 'none');
  assert(!el.querySelectorAll('th')[2].hasAttribute('aria-sort'));
  equal(el.querySelector('.lk-table__wrap').getAttribute('aria-label'), 'Courses');
  assert(el.querySelector('.lk-table__wrap').tabIndex === 0, 'scroll region is focusable');
});

test('table: sorts text, then descending, then restores the original order', async () => {
  const el = await mount(TABLE);
  const seen = listen(el, 'lk-sort');
  const button = el.querySelectorAll('th button')[0];
  click(button);
  equal(names(el), ['Art', 'English', 'Maths']);
  equal(el.querySelectorAll('th')[0].getAttribute('aria-sort'), 'ascending');
  click(button);
  equal(names(el), ['Maths', 'English', 'Art']);
  click(button);
  equal(names(el), ['Maths', 'Art', 'English']);
  equal(el.querySelectorAll('th')[0].getAttribute('aria-sort'), 'none');
  equal(seen.map((s) => s.direction), ['ascending', 'descending', 'none']);
});

test('table: numbers sort by value and the status line says so', async () => {
  const el = await mount(TABLE);
  click(el.querySelectorAll('th button')[1]);
  equal(names(el), ['Art', 'Maths', 'English']);
  assert(el.querySelector('.lk-table__status').textContent.includes('sorted by Hours, ascending'));
});

test('table: sorting one column clears the arrow on the others', async () => {
  const el = await mount(TABLE);
  const buttons = el.querySelectorAll('th button');
  click(buttons[0]);
  click(buttons[1]);
  equal(el.querySelectorAll('th')[0].getAttribute('aria-sort'), 'none');
  equal(el.querySelectorAll('th')[1].getAttribute('aria-sort'), 'ascending');
});

test('table: filter hides rows and reports how many are left', async () => {
  const el = await mount(TABLE);
  const seen = listen(el, 'lk-filter');
  const input = el.querySelector('input[type=search]');
  assert(el.querySelector('label').htmlFor === input.id, 'filter has a label');
  input.value = 'core';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  equal(names(el), ['Maths', 'English']);
  equal(el.querySelector('.lk-table__status').textContent, 'Showing 2 of 3 rows');
  equal(seen[0], { query: 'core', shown: 2, total: 3 });
  input.value = 'zzz';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  equal(el.querySelector('.lk-table__status').textContent, 'No rows match');
});

test('table: data-value overrides the text used for sorting', async () => {
  const el = await mount(`<lk-table label="D" sortable><table><thead><tr><th>When</th></tr></thead><tbody>
    <tr><td data-value="2026-03-01">1 March</td></tr><tr><td data-value="2025-12-01">1 December</td></tr></tbody></table></lk-table>`);
  click(el.querySelector('th button'));
  equal(names(el), ['1 December', '1 March']);
});

// ---- lk-alert ----

test('alert: tone word is readable, icon is hidden, no live role by default', async () => {
  const el = await mount(`<lk-alert tone="warning" heading="Deadline moved">Friday now.</lk-alert>`);
  equal(el.dataset.tone, 'warning');
  assert(el.textContent.includes('Warning: Deadline moved'));
  assert(el.querySelector('.lk-alert__icon').getAttribute('aria-hidden') === 'true');
  assert(!el.hasAttribute('role'));
  assert(el.textContent.includes('Friday now.'));
});

test('alert: live uses alert for warnings and status for the rest', async () => {
  equal((await mount(`<lk-alert tone="danger" live>x</lk-alert>`)).getAttribute('role'), 'alert');
  equal((await mount(`<lk-alert tone="success" live>x</lk-alert>`)).getAttribute('role'), 'status');
  equal((await mount(`<lk-alert tone="nonsense">x</lk-alert>`)).dataset.tone, 'info');
});

test('alert: dismiss fires an event and removes it', async () => {
  const wrap = await mount(`<div><lk-alert dismissible>x</lk-alert></div>`);
  const alert = wrap.querySelector('lk-alert');
  const seen = listen(wrap, 'lk-dismiss');
  click(alert.querySelector('.lk-alert__close'));
  equal(seen.length, 1);
  assert(!wrap.querySelector('lk-alert'), 'removed');
});

// ---- lk-chip ----

test('chip: selectable toggles aria-pressed and fires an event', async () => {
  const el = await mount(`<lk-chip selectable>Maths</lk-chip>`);
  const seen = listen(el, 'lk-select');
  const button = el.querySelector('button');
  equal(button.getAttribute('aria-pressed'), 'false');
  click(button);
  equal(button.getAttribute('aria-pressed'), 'true');
  assert(el.selected);
  equal(seen, [{ selected: true }]);
});

test('chip: removable names what it removes and takes the chip away', async () => {
  const wrap = await mount(`<div><lk-chip removable>Evening</lk-chip></div>`);
  const seen = listen(wrap, 'lk-remove');
  const remove = wrap.querySelector('.lk-chip__remove');
  equal(remove.getAttribute('aria-label'), 'Remove Evening');
  click(remove);
  equal(seen, [{ label: 'Evening' }]);
  assert(!wrap.querySelector('lk-chip'));
});

// ---- lk-avatar ----

test('avatar: initials, accessible name and a stable colour', async () => {
  const a = await mount(`<lk-avatar name="Ada Lovelace"></lk-avatar>`);
  const b = await mount(`<lk-avatar name="Ada Lovelace"></lk-avatar>`);
  equal(a.textContent, 'AL');
  equal(a.getAttribute('role'), 'img');
  equal(a.getAttribute('aria-label'), 'Ada Lovelace');
  equal(a.dataset.tone, b.dataset.tone);
});

test('avatar: a broken picture falls back to initials, decorative hides it', async () => {
  const el = await mount(`<lk-avatar name="Grace Hopper" src="missing-picture.png"></lk-avatar>`);
  await tick(300);
  equal(el.textContent, 'GH');
  const deco = await mount(`<lk-avatar name="Grace Hopper" decorative></lk-avatar>`);
  equal(deco.getAttribute('aria-hidden'), 'true');
  assert(!deco.hasAttribute('role'));
});

// ---- lk-switch ----

test('switch: a real checkbox with the switch role, label and hint', async () => {
  const el = await mount(`<lk-switch label="Reminders" hint="Weekly" name="rem" checked></lk-switch>`);
  const input = el.querySelector('input');
  equal(input.getAttribute('role'), 'switch');
  assert(input.checked && el.checked);
  equal(el.querySelector('label').textContent, 'Reminders');
  assert(input.getAttribute('aria-describedby') === el.querySelector('.lk-switch__hint').id);
  equal(input.name, 'rem');
});

test('switch: toggling fires lk-change and keeps the attribute in step', async () => {
  const el = await mount(`<lk-switch label="Reminders"></lk-switch>`);
  const seen = listen(el, 'lk-change');
  click(el.querySelector('input'));
  equal(seen, [{ checked: true }]);
  assert(el.hasAttribute('checked'));
  el.checked = false;
  assert(!el.querySelector('input').checked);
});

// ---- lk-breadcrumbs ----

const CRUMBS = (max = '') => `<lk-breadcrumbs ${max}><ol>
  <li><a href="#a">Home</a></li><li><a href="#b">Courses</a></li><li><a href="#c">Level 2</a></li><li><a href="#d">Maths</a></li><li>Unit 1</li></ol></lk-breadcrumbs>`;

test('breadcrumbs: a labelled navigation with the last item marked current', async () => {
  const el = await mount(CRUMBS());
  equal(el.getAttribute('role'), 'navigation');
  equal(el.getAttribute('aria-label'), 'Breadcrumb');
  equal(el.querySelector('[aria-current]').textContent, 'Unit 1');
});

test('breadcrumbs: max collapses the middle and the button reveals it', async () => {
  const el = await mount(CRUMBS('max="3"'));
  equal([...el.querySelectorAll('li:not([hidden])')].map((l) => l.textContent), ['Home', '…', 'Maths', 'Unit 1']);
  const button = el.querySelector('.lk-breadcrumbs__more button');
  equal(button.getAttribute('aria-label'), 'Show 2 more levels');
  click(button);
  equal(el.querySelectorAll('li[hidden]').length, 0);
  assert(!el.querySelector('.lk-breadcrumbs__more'));
});

// ---- lk-pagination ----

const labels = (el) => [...el.querySelectorAll('button')].map((b) => b.textContent);

test('pagination: shows a window of pages with the current one marked', async () => {
  const el = await mount(`<lk-pagination total="10" page="5"></lk-pagination>`);
  equal(labels(el), ['Previous', '1', '4', '5', '6', '10', 'Next']);
  equal(el.querySelector('[aria-current]').textContent, '5');
  equal(el.querySelector('[aria-current]').getAttribute('aria-label'), 'Page 5, current page');
});

test('pagination: choosing a page fires an event, announces it and keeps focus', async () => {
  const el = await mount(`<lk-pagination total="10" page="1"></lk-pagination>`);
  const seen = listen(el, 'lk-pagechange');
  const next = el.querySelector('button[data-kind=next]');
  next.focus();
  click(next);
  equal(seen, [{ page: 2 }]);
  equal(el.page, 2);
  assert(el.querySelector('[role=status]').textContent === 'Page 2 of 10');
  assert(document.activeElement.dataset.kind === 'next', 'focus stays on Next');
});

test('pagination: previous is disabled on the first page, and hitting the end moves focus', async () => {
  const el = await mount(`<lk-pagination total="2" page="1"></lk-pagination>`);
  assert(el.querySelector('button[data-kind=prev]').disabled);
  const next = el.querySelector('button[data-kind=next]');
  next.focus();
  click(next);
  assert(el.querySelector('button[data-kind=next]').disabled);
  assert(document.activeElement.hasAttribute('aria-current'), 'focus moved to the current page');
});

test('pagination: setting the page from outside re-renders', async () => {
  const el = await mount(`<lk-pagination total="3" page="1"></lk-pagination>`);
  el.page = 3;
  equal(el.querySelector('[aria-current]').textContent, '3');
});
