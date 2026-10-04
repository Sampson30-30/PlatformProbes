// Opens every platform page at desktop and phone widths and checks structure,
// headings, names, layout and text contrast. Run it in light and in dark.
import { test, assert, tick } from './harness.js';
import { NAV } from '../../platform/data/site.js';
import { ALL_TOPICS } from '../../platform/data/habits.js';
import { contrastProblems, headingProblems, nameProblems, structureProblems, overflowProblems } from './a11y.js';

const pages = [
  ...NAV.filter((n) => n.ready && !n.href.includes('#') && !n.href.startsWith('habit.html')).map((n) => n.href),
  ...ALL_TOPICS.map((t) => `habit.html?h=${t.id}`),
];

async function open(href, width) {
  const frame = document.createElement('iframe');
  frame.style.cssText = `position:absolute;left:-9999px;top:0;width:${width}px;height:900px;border:0`;
  frame.src = `../../platform/${href}`;
  document.body.append(frame);
  await new Promise((resolve) => { frame.onload = resolve; });
  const doc = frame.contentDocument;
  for (let i = 0; i < 50 && !doc.querySelector('main')?.children.length; i += 1) await tick(40);
  // Transitions do not advance when nothing is being painted, which would
  // make colours look half-changed. Switch them off so checks see the end state.
  const style = doc.createElement('style');
  style.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
  doc.head.append(style);
  await tick(500);
  return { frame, doc };
}

for (const width of [1100, 360]) {
  for (const href of pages) {
    test(`${href} @${width}px`, async () => {
      const { frame, doc } = await open(href, width);
      try {
        const problems = [
          ...structureProblems(doc),
          ...headingProblems(doc),
          ...nameProblems(doc),
          ...overflowProblems(doc),
          ...contrastProblems(doc),
        ];
        assert(problems.length === 0, `\n  ${problems.slice(0, 8).join('\n  ')}${problems.length > 8 ? `\n  ...and ${problems.length - 8} more` : ''}`);
      } finally {
        frame.remove();
      }
    });
  }
}

// The same checks again after using the interactive parts, so feedback,
// endings and revealed content are checked too.
import { exercise } from './a11y.js';

for (const width of [1100, 360]) {
  for (const href of pages) {
    test(`${href} @${width}px after use`, async () => {
      const { frame, doc } = await open(href, width);
      try {
        await exercise(doc);
        const problems = [...overflowProblems(doc), ...headingProblems(doc), ...nameProblems(doc), ...contrastProblems(doc)];
        assert(problems.length === 0, `\n  ${problems.slice(0, 8).join('\n  ')}${problems.length > 8 ? `\n  ...and ${problems.length - 8} more` : ''}`);
      } finally {
        frame.remove();
      }
    });
  }
}
