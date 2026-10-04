// Live demos for the gallery. Each takes a host element and fills it.
// The calculations live in lib/, where they are tested. This file is only wiring.

import { subsolarLongitude, isDaytime, daylightRange, describeLongitude, formatHour, hoursOverWeeks } from '../lib/demos.js';
import { offsetMinutes, standardOffsetMinutes, formatOffset } from '../lib/time.js';
import { HABITS } from '../data/habits.js';
import { renderBlocks } from './blocks.js';

function h(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.textContent = html;
  return node;
}

function rangeField(label, hint, { min, max, step, value }) {
  const field = document.createElement('lk-field');
  field.setAttribute('label', label);
  if (hint) field.setAttribute('hint', hint);
  const input = document.createElement('input');
  input.type = 'range';
  Object.assign(input, { min, max, step, value });
  field.append(input);
  return { field, input };
}

function sun(host) {
  const { field, input } = rangeField('Time of day, in UTC', 'Drag to move the sun across the world.', { min: 0, max: 23.5, step: 0.5, value: 12 });
  const strip = h('div', 'sun-strip');
  strip.setAttribute('role', 'img');
  const cells = Array.from({ length: 24 }, (_, i) => {
    const cell = h('div', 'sun-strip__cell');
    cell.style.setProperty('--i', String(i));
    strip.append(cell);
    return { cell, lon: -180 + 7.5 + i * 15 };
  });
  const scale = h('div', 'sun-scale');
  scale.setAttribute('aria-hidden', 'true');
  for (const t of ['180° W', '90° W', '0°', '90° E', '180° E']) scale.append(h('span', '', t));
  const readout = h('p', 'demo-readout');
  readout.setAttribute('aria-live', 'polite');

  const update = () => {
    const hour = Number(input.value);
    for (const c of cells) c.cell.toggleAttribute('data-day', isDaytime(c.lon, hour));
    const { from, to } = daylightRange(hour);
    const text = `At ${formatHour(hour)} UTC the sun is overhead at ${describeLongitude(subsolarLongitude(hour))}. It is daytime from ${describeLongitude(from)} to ${describeLongitude(to)}.`;
    readout.textContent = text;
    strip.setAttribute('aria-label', text);
  };
  input.addEventListener('input', update);
  update();
  host.append(field, strip, scale, readout);
}

const ZONES = [
  ['London', 'Europe/London'], ['New York', 'America/New_York'], ['Mumbai', 'Asia/Kolkata'],
  ['Tokyo', 'Asia/Tokyo'], ['Sydney', 'Australia/Sydney'], ['Auckland', 'Pacific/Auckland'],
  ['Los Angeles', 'America/Los_Angeles'], ['Johannesburg', 'Africa/Johannesburg'],
];

function zones(host) {
  const field = document.createElement('lk-field');
  field.setAttribute('label', 'Pick a place');
  const select = document.createElement('select');
  for (const [city, tz] of ZONES) select.append(new Option(city, tz));
  field.append(select);
  const clock = h('p', 'zone-clock');
  const note = h('p', 'demo-readout');
  host.append(field, clock, note);

  const draw = () => {
    if (!host.isConnected) return;
    const tz = select.value;
    const now = new Date();
    clock.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
    const current = offsetMinutes(now, tz);
    const standard = standardOffsetMinutes(tz);
    const summer = current > standard;
    note.textContent = `${formatOffset(current)} now. Standard time here is ${formatOffset(standard)}. ${summer ? 'This place is on summer time right now.' : 'This place is not on summer time right now.'}`;
  };
  select.addEventListener('change', draw);
  draw();
  setInterval(draw, 1000);
}

function memory(host) {
  const KEY = 'hb-demo-visits';
  let count = 0;
  try {
    count = Number(localStorage.getItem(KEY)) || 0;
    count += 1;
    localStorage.setItem(KEY, String(count));
  } catch {
    count = 0;
  }
  const line = h('p', 'demo-readout');
  const reset = h('button', 'lk-button', 'Make it forget');
  reset.type = 'button';
  reset.dataset.size = 'small';
  const say = () => {
    line.textContent = count > 0
      ? `You have opened this page ${count} ${count === 1 ? 'time' : 'times'} on this device. Only this browser knows.`
      : 'This browser is not letting the page remember anything, so the count cannot be kept. That is the learner’s choice to make, and the page copes.';
  };
  reset.addEventListener('click', () => {
    try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
    count = 0;
    line.textContent = 'Forgotten. The next visit starts again from one.';
  });
  say();
  host.append(line, reset);
}

function views(host) {
  const items = HABITS.map((hab) => ({ name: hab.short, question: hab.question, number: hab.number }));
  const group = h('div', 'demo-toggle');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'How to show the list');
  const out = h('div', 'views-out');
  out.setAttribute('aria-live', 'polite');
  const renderers = {
    List: () => {
      const ul = h('ul', 'views-list');
      for (const i of items) ul.append(h('li', '', `${i.number}. ${i.name}`));
      return ul;
    },
    Chips: () => {
      const wrap = h('div', 'views-chips');
      for (const i of items) wrap.append(Object.assign(h('span', 'lk-badge', i.name), {}));
      return wrap;
    },
    Table: () => {
      const table = h('table', 'views-table');
      const head = table.createTHead().insertRow();
      for (const t of ['No.', 'Habit', 'Question']) head.append(Object.assign(document.createElement('th'), { scope: 'col', textContent: t }));
      const body = table.createTBody();
      for (const i of items) {
        const row = body.insertRow();
        row.insertCell().textContent = String(i.number);
        row.insertCell().textContent = i.name;
        row.insertCell().textContent = i.question;
      }
      return table;
    },
  };
  const show = (name) => {
    out.replaceChildren(renderers[name]());
    group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.textContent === name)));
  };
  for (const name of Object.keys(renderers)) {
    const b = h('button', 'lk-button', name);
    b.type = 'button';
    b.dataset.size = 'small';
    b.addEventListener('click', () => show(name));
    group.append(b);
  }
  host.append(h('p', 'demo-readout', 'The same six habits, kept as one list in a data file. Three ways of showing it:'), group, out);
  show('List');
}

function whatif(host) {
  const { field, input } = rangeField('Minutes of practice a day', 'Try different amounts.', { min: 5, max: 120, step: 5, value: 30 });
  const result = h('p', 'whatif-result');
  result.setAttribute('aria-live', 'polite');
  const update = () => {
    const hours = hoursOverWeeks(input.value, 10);
    result.textContent = `${input.value} minutes a day for 10 weeks is about ${hours} hours.`;
  };
  input.addEventListener('input', update);
  update();
  host.append(field, result, h('p', 'demo-readout', 'The rule: minutes a day, times 7, times 10 weeks, divided by 60. It leaves out missed days, which is the sort of thing a good model would say.'));
}

function paths(host) {
  renderBlocks(host, [{
    type: 'scenario',
    label: 'A learner asks for help',
    data: {
      start: 'start',
      nodes: {
        start: { title: 'A message arrives', text: 'A learner writes: "I’m stuck on the task and I don’t know where to start."', choices: [
          { text: 'Send them a worked answer', goto: 'answer' },
          { text: 'Ask what they have tried so far', goto: 'ask' },
        ] },
        answer: { title: 'They copy it', text: 'They hand in your answer and learn little.', end: true, outcome: 'poor' },
        ask: { title: 'A better conversation', text: 'They share their first attempt, and you point to the one step that is stopping them.', end: true, outcome: 'good' },
      },
    },
  }]);
}

function marking(host) {
  renderBlocks(host, [{
    type: 'quiz',
    label: 'A shuffled question',
    shuffle: true,
    data: { questions: [{
      prompt: 'Which of these is a rule, rather than a picture?',
      options: [
        { text: 'A table of offsets typed in for each city', feedback: 'Tempting, but it is only right until the clocks change.' },
        { text: 'A zone name that the browser looks up', correct: true, feedback: 'Yes. The browser works out the answer each time.' },
        { text: 'A screenshot of a clock', feedback: 'A picture shows one moment.' },
      ],
      explanation: 'Reload the page and the options come in a different order.',
    }] },
  }]);
}

export const DEMOS = { sun, zones, memory, views, whatif, paths, marking };
