// The brief builder's logic: checking a brief for gaps, and writing it out.
// Pure functions, no DOM access.

export function emptyBrief() {
  return {
    idea: '',
    audience: '',
    parts: [
      { name: '', kind: '', origin: '', note: '' },
      { name: '', kind: '', origin: '', note: '' },
      { name: '', kind: '', origin: '', note: '' },
    ],
    rules: '',
    changes: '',
    behaviour: '',
    mustNot: '',
    place: '',
    placeNotes: '',
    verify: '',
    checks: [],
  };
}

const filled = (s) => String(s ?? '').trim().length > 0;
const namedParts = (brief) => brief.parts.filter((p) => filled(p.name));

/**
 * Looks for gaps. Each result is { level: 'gap' | 'tip', step, message }.
 * A gap is something a good brief needs. A tip is worth a moment's thought.
 * `step` is the zero-based step to go back to.
 */
export function checkBrief(brief) {
  const out = [];
  const gap = (step, message) => out.push({ level: 'gap', step, message });
  const tip = (step, message) => out.push({ level: 'tip', step, message });

  if (!filled(brief.idea)) gap(0, 'Say what you want to make, in a sentence.');
  if (!filled(brief.audience)) gap(0, 'Say who will use it and what they should be able to do afterwards.');

  const parts = namedParts(brief);
  if (parts.length < 3) gap(1, 'List at least three parts it is made of. One lump is too big to build well.');
  for (const p of parts) {
    if (!filled(p.kind) || !filled(p.origin)) gap(1, `Say what kind of thing "${p.name.trim()}" is and where it comes from.`);
  }
  for (const p of parts) {
    if (p.kind === 'Information' && p.origin === 'I make it myself') {
      tip(1, `"${p.name.trim()}" is information you are making yourself. How will it be checked? Real information is usually fetched from a source.`);
    }
    if (p.origin === 'Someone else has to tell me') {
      tip(1, `Ask about "${p.name.trim()}" before building. It can change other decisions.`);
    }
  }
  if (parts.length >= 3 && !parts.some((p) => p.origin === 'Worked out by a rule')) {
    tip(1, 'Nothing is worked out by a rule. Is there anything you would otherwise type in that could be calculated?');
  }
  if (!filled(brief.rules)) tip(2, 'Say which things a rule could produce, instead of being typed in.');
  if (!filled(brief.changes)) gap(2, 'Say what will change over time, and who will change it. That decides what is kept apart.');

  if (!filled(brief.behaviour)) gap(3, 'Describe what happens when someone uses it: "When I do this, that happens."');
  else if (!/when|if|click|press|choose|pick|select|tap|open/i.test(brief.behaviour)) {
    tip(3, 'Your behaviour description does not say what the user does. Try "When I click ..., ... happens."');
  }
  if (!filled(brief.mustNot)) tip(3, 'Say what must not change or break. Limits shape a design as much as features do.');

  if (!filled(brief.place) || brief.place === 'I am not sure yet') gap(4, 'Say where it will live. It changes what is possible.');
  if (!filled(brief.verify)) gap(4, 'Say how you will know it works for the person using it.');
  if (!brief.checks || brief.checks.length === 0) gap(4, 'Pick at least one thing to test across.');
  else if (!brief.checks.includes('The real place it will live') && brief.place && brief.place !== 'A single file I share') {
    tip(4, 'Plan to test in the real place it will live, not only in a preview.');
  }
  return out;
}

const cell = (s) => String(s ?? '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim() || '(not said)';
const para = (s) => (filled(s) ? String(s).trim() : '(not said)');

/** Writes the brief as Markdown, ready to paste into a conversation with Claude. */
export function briefToMarkdown(brief) {
  const parts = namedParts(brief);
  const lines = [];
  lines.push(`# Brief: ${para(brief.idea).split('\n')[0].slice(0, 80)}`);
  lines.push('', '## What I want', para(brief.idea));
  lines.push('', '## Who it is for', para(brief.audience));
  lines.push('', '## What it is made of', '', '| Part | Kind of thing | Where it comes from | Notes |', '| --- | --- | --- | --- |');
  for (const p of parts) lines.push(`| ${cell(p.name)} | ${cell(p.kind)} | ${cell(p.origin)} | ${cell(p.note)} |`);
  if (parts.length === 0) lines.push('| (none listed) | | | |');
  lines.push('', '## Work these out, do not type them in', para(brief.rules));
  lines.push('', '## What will change, and who will change it', para(brief.changes));
  lines.push('', '## What it should do', para(brief.behaviour));
  lines.push('', '## What must not change or break', para(brief.mustNot));
  lines.push('', '## Where it will live', para(brief.place));
  if (filled(brief.placeNotes)) lines.push('', para(brief.placeNotes));
  lines.push('', '## How I will know it works', para(brief.verify));
  lines.push('', '## What I will test across', ...(brief.checks && brief.checks.length ? brief.checks.map((c) => `- ${c}`) : ['(not said)']));
  lines.push(
    '', '## How I would like to work with you',
    '- Before you build anything, tell me what you understood and what you are unsure of.',
    '- For each part, tell me where it would come from, and flag anything you would be recalling from memory rather than fetching or calculating.',
    '- Where there is a real choice, give me your view and your reasons, and I will decide.',
    '- When you say it is done, tell me what you checked and what you only assumed.',
  );
  return `${lines.join('\n')}\n`;
}
