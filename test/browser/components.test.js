import { test, assert, equal, mount, click, press, listen, tick } from './harness.js';

// ---- lk-tabs ----

test('tabs: builds tablist and selects first tab', async () => {
  const el = await mount(`<lk-tabs label="T"><div data-lk-tab="A">a</div><div data-lk-tab="B">b</div></lk-tabs>`);
  const tabs = el.querySelectorAll('[role=tab]');
  equal(tabs.length, 2);
  equal(el.selectedIndex, 0);
  assert(el.querySelectorAll('[role=tabpanel]')[1].hidden);
});

test('tabs: arrow keys move and wrap, event fires', async () => {
  const el = await mount(`<lk-tabs><div data-lk-tab="A">a</div><div data-lk-tab="B">b</div></lk-tabs>`);
  const seen = listen(el, 'lk-tabchange');
  const tabs = el.querySelectorAll('[role=tab]');
  tabs[0].focus();
  press(tabs[0], 'ArrowLeft');
  equal(el.selectedIndex, 1);
  equal(seen.length, 1);
  press(document.activeElement, 'Home');
  equal(el.selectedIndex, 0);
});

// ---- lk-accordion ----

test('accordion: single mode closes others', async () => {
  const el = await mount(`<lk-accordion><div data-lk-item="A" open>a</div><div data-lk-item="B">b</div></lk-accordion>`);
  equal(el.openIndexes, [0]);
  click(el.querySelectorAll('button')[1]);
  equal(el.openIndexes, [1]);
});

test('accordion: multiple mode keeps several open and reports events', async () => {
  const el = await mount(`<lk-accordion multiple level="4"><div data-lk-item="A" open>a</div><div data-lk-item="B">b</div></lk-accordion>`);
  const seen = listen(el, 'lk-toggle');
  click(el.querySelectorAll('button')[1]);
  equal(el.openIndexes, [0, 1]);
  equal(seen[0], { index: 1, title: 'B', open: true });
  equal(el.querySelector('[role=heading]').getAttribute('aria-level'), '4');
});

test('accordion: arrow keys move focus between headings', async () => {
  const el = await mount(`<lk-accordion><div data-lk-item="A">a</div><div data-lk-item="B">b</div></lk-accordion>`);
  const buttons = el.querySelectorAll('button');
  buttons[0].focus();
  press(buttons[0], 'ArrowDown');
  assert(document.activeElement === buttons[1], 'focus moved');
});

// ---- lk-modal ----

test('modal: opens from trigger, closes with Escape-equivalent, returns focus', async () => {
  const wrap = await mount(`<div><button id="opener" data-lk-open="m1">Open</button><lk-modal id="m1" heading="Hi"><p>Body</p></lk-modal></div>`);
  const opener = wrap.querySelector('#opener');
  const modal = wrap.querySelector('lk-modal');
  const seen = listen(modal, 'lk-close');
  opener.focus();
  opener.click();
  assert(modal.isOpen, 'open');
  assert(modal.dialog.getAttribute('aria-labelledby'), 'labelled');
  modal.close('ok');
  await tick(20);
  assert(!modal.isOpen, 'closed');
  equal(seen[0], { returnValue: 'ok' });
  assert(document.activeElement === opener, 'focus returned');
});

// ---- buttons and badges (CSS only) ----

test('button: variants resolve to token colours', async () => {
  const wrap = await mount(`<div><button class="lk-button" data-variant="primary">Go</button><span class="lk-badge" data-tone="danger">Error</span></div>`);
  const btn = wrap.querySelector('.lk-button');
  const badge = wrap.querySelector('.lk-badge');
  assert(getComputedStyle(btn).minHeight === '40px', 'touch target height');
  assert(getComputedStyle(btn).backgroundColor !== 'rgba(0, 0, 0, 0)', 'primary has fill');
  assert(getComputedStyle(badge).borderTopWidth === '1px');
});

// ---- lk-field and lk-choices ----

test('field: wires label, hint and error to the control', async () => {
  const el = await mount(`<lk-field label="Email" hint="We reply here"><input type="email" required></lk-field>`);
  const input = el.querySelector('input');
  const label = el.querySelector('label');
  assert(label.htmlFor === input.id, 'label for');
  const described = input.getAttribute('aria-describedby').split(' ');
  equal(described.length, 2);
  assert(label.textContent.includes('(required)'), 'required marker');
  el.setAttribute('error', 'Enter an email address');
  assert(input.getAttribute('aria-invalid') === 'true', 'invalid');
  assert(el.querySelector('.lk-field__error').textContent.includes('Enter an email address'));
  el.removeAttribute('error');
  assert(input.getAttribute('aria-invalid') === 'false', 'cleared');
});

test('field: validates on blur using native rules', async () => {
  const el = await mount(`<lk-field label="Name"><input required></lk-field>`);
  const input = el.querySelector('input');
  input.dispatchEvent(new FocusEvent('blur'));
  assert(input.getAttribute('aria-invalid') === 'true', 'invalid after blur');
  input.value = 'Alex';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  assert(input.getAttribute('aria-invalid') === 'false', 'valid after typing');
});

test('field: range shows its value', async () => {
  const el = await mount(`<lk-field label="Confidence"><input type="range" min="0" max="10" value="4"></lk-field>`);
  const out = el.querySelector('output');
  equal(out.textContent, '4');
  const input = el.querySelector('input');
  input.value = '7';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  equal(out.textContent, '7');
});

test('choices: builds fieldset and enforces min', async () => {
  const el = await mount(`<lk-choices legend="Topics" min="2"><label><input type="checkbox" name="t"> A</label><label><input type="checkbox" name="t"> B</label></lk-choices>`);
  assert(el.querySelector('fieldset > legend').textContent === 'Topics');
  assert(el.validate() === false, 'fails with none checked');
  el.querySelectorAll('input').forEach((i) => (i.checked = true));
  assert(el.validate() === true, 'passes with two');
  assert(!el.hasAttribute('data-invalid'));
});
