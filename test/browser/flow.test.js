import { test, assert, equal, mount, click, listen, tick } from './harness.js';

const PROCESS = `<lk-flow label="Late work" walkthrough>
  <ol>
    <li data-type="start">Work arrives late</li>
    <li>Extension agreed?
      <ul>
        <li data-label="Yes">Mark as normal</li>
        <li data-label="No">Good reason?
          <ul>
            <li data-label="Yes">Short extension</li>
            <li data-label="No">Apply penalty<ol><li data-type="end">Tell the learner</li></ol></li>
          </ul>
        </li>
      </ul>
    </li>
    <li>Record the outcome</li>
    <li data-type="end">Return feedback</li>
  </ol>
</lk-flow>`;

const TREE = `<lk-flow label="Tool" layout="tree">
  <ul><li>Different for each learner?
    <ul>
      <li data-label="No">Use Rise</li>
      <li data-label="Yes">Build it with code</li>
    </ul>
  </li></ul>
</lk-flow>`;

const buttons = (el) => [...el.querySelectorAll('.lk-flow__actions button')].map((b) => b.textContent);
const press = (el, text) => click([...el.querySelectorAll('.lk-flow__actions button')].find((b) => b.textContent === text));

// ---- structure and accessibility ----

test('flow: a labelled region containing real nested lists', async () => {
  const el = await mount(PROCESS);
  const region = el.querySelector('[role=region]');
  equal(region.getAttribute('aria-label'), 'Late work');
  assert(region.tabIndex === 0, 'scrollable region is focusable');
  assert(el.querySelector('ol.lk-flow__seq'));
  assert(el.querySelectorAll('ul.lk-flow__branches').length === 2);
  equal(el.querySelectorAll('.lk-flow__step').length, 9);
});

test('flow: types and answers are in words for screen readers, not colour or shape alone', async () => {
  const el = await mount(PROCESS);
  const text = region(el);
  assert(text.includes('Start: Work arrives late'), text);
  assert(text.includes('Decision: Extension agreed?'));
  assert(text.includes('If Yes'));
  assert(text.includes('End: Return feedback'));
  assert(el.querySelector('.lk-flow__join').getAttribute('aria-hidden') === 'true');
});

function region(el) {
  return el.querySelector('[role=region]').textContent.replace(/\s+/g, ' ');
}

// ---- layout ----

test('flow: branches that flow on get a join; branches that end do not', async () => {
  const el = await mount(PROCESS);
  const inner = el.querySelectorAll('.lk-flow__branches')[1];
  const branches = inner.querySelectorAll(':scope > .lk-flow__branch');
  assert(branches[0].querySelector(':scope > .lk-flow__join'), '"Short extension" flows on');
  assert(!branches[1].querySelector(':scope > .lk-flow__join'), '"Tell the learner" ends');
});

test('flow: the joins line up at the bottom of the branches and the bar reaches the centre', async () => {
  const el = await mount(PROCESS);
  await tick(100); // the bar is placed after layout
  for (const ul of el.querySelectorAll('.lk-flow__branches[data-joins]')) {
    const box = ul.getBoundingClientRect();
    const joins = [...ul.querySelectorAll(':scope > .lk-flow__branch > .lk-flow__join')];
    assert(joins.length > 0);
    for (const j of joins) assert(Math.abs(j.getBoundingClientRect().bottom - box.bottom) < 1.5, 'join reaches the bottom of the row');
    const bar = ul.querySelector(':scope > .lk-flow__joinbar');
    assert(bar && !bar.hidden, 'bar drawn');
    const b = bar.getBoundingClientRect();
    const centre = box.left + box.width / 2;
    assert(b.left <= centre + 1 && b.right >= centre - 1, 'bar reaches the line below the decision');
    for (const j of joins) {
      const x = j.getBoundingClientRect().left + j.getBoundingClientRect().width / 2;
      assert(x >= b.left - 1 && x <= b.right + 1, 'bar reaches each joining branch');
    }
  }
});

test('flow: the chart scrolls inside its own region and never widens the page', async () => {
  const el = await mount(`<div style="width:260px">${PROCESS}</div>`);
  await tick(100);
  const region = el.querySelector('.lk-flow__scroll');
  assert(region.scrollWidth > region.clientWidth, 'the chart is wider than 260px');
  assert(getComputedStyle(region).overflowX === 'auto');
});

test('flow: a tree never rejoins, marks its results, and has no join bars', async () => {
  const el = await mount(TREE);
  await tick(50);
  equal(el.dataset.layout, 'tree');
  assert(!el.querySelector('.lk-flow__join'));
  assert(!el.querySelector('.lk-flow__joinbar'));
  equal(el.querySelectorAll('[data-leaf]').length, 2);
  assert(!el.querySelector('.lk-flow__walk'), 'no walk-through unless asked for');
});

test('flow: no list, an empty list and odd markup do not throw', async () => {
  const a = await mount(`<lk-flow label="x"></lk-flow>`);
  assert(!a.graph);
  const b = await mount(`<lk-flow label="x" walkthrough><ol></ol></lk-flow>`);
  assert(!b.querySelector('.lk-flow__walk'));
  const c = await mount(`<lk-flow label="x"><ol><li data-type="end">Done<ul><li data-label="x">Nope</li></ul></li></ol></lk-flow>`);
  equal(c.querySelectorAll('.lk-flow__step').length, 1);
});

// ---- walk-through ----

test('flow walkthrough: starts on the first step without taking focus', async () => {
  const before = document.activeElement;
  const el = await mount(PROCESS);
  equal(el.querySelector('.lk-flow__prompt').textContent, 'Work arrives late');
  equal(el.querySelector('.lk-flow__kicker').textContent, 'Step');
  equal(buttons(el), ['Next']);
  equal(el.querySelector('[aria-current=step]').textContent.includes('Work arrives late'), true);
  assert(document.activeElement === before, 'nothing was focused on load');
});

test('flow walkthrough: choosing answers follows the route, marks the chart and reports it', async () => {
  const el = await mount(PROCESS);
  const steps = listen(el, 'lk-flowstep');
  const ends = listen(el, 'lk-flowend');
  press(el, 'Next');
  equal(el.querySelector('.lk-flow__kicker').textContent, 'Question');
  equal(buttons(el), ['Back', 'Yes', 'No']);
  assert(document.activeElement.textContent === 'Yes', 'focus lands on the first answer');
  press(el, 'No');
  press(el, 'No');
  equal(el.querySelector('.lk-flow__prompt').textContent, 'Apply penalty');
  press(el, 'Next');
  equal(el.querySelector('.lk-flow__kicker').textContent, 'End');
  equal(buttons(el), ['Back', 'Start again']);
  assert(el.querySelector('.lk-flow__route').textContent.includes('Extension agreed? → No → Good reason? → No → Apply penalty'));
  equal(el.querySelectorAll('.lk-flow__branch[data-taken]').length, 2);
  equal(el.querySelectorAll('.lk-flow__step[data-visited]').length, 5);
  equal(ends.length, 1);
  equal(steps.length, 4); // one for each choice made after the listener was added
  equal(el.route.at(-1), 'Tell the learner');
});

test('flow walkthrough: back undoes a choice and start again resets the chart', async () => {
  const el = await mount(PROCESS);
  press(el, 'Next');
  press(el, 'Yes');
  equal(el.querySelector('.lk-flow__prompt').textContent, 'Mark as normal');
  press(el, 'Back');
  equal(el.querySelector('.lk-flow__prompt').textContent, 'Extension agreed?');
  equal(el.querySelectorAll('.lk-flow__branch[data-taken]').length, 0);
  press(el, 'Yes');
  press(el, 'Next'); // Record the outcome
  press(el, 'Next'); // Return feedback
  equal(buttons(el), ['Back', 'Start again']);
  press(el, 'Start again');
  equal(el.querySelector('.lk-flow__prompt').textContent, 'Work arrives late');
  equal(el.querySelectorAll('.lk-flow__step[data-visited]').length, 1);
  assert(!buttons(el).includes('Back'));
});

test('flow walkthrough: a tree ends on a result', async () => {
  const el = await mount(TREE.replace('layout="tree"', 'layout="tree" walkthrough'));
  equal(buttons(el), ['No', 'Yes']);
  press(el, 'Yes');
  equal(el.querySelector('.lk-flow__kicker').textContent, 'Result');
  equal(el.querySelector('.lk-flow__prompt').textContent, 'Build it with code');
  equal(buttons(el), ['Back', 'Start again']);
});
