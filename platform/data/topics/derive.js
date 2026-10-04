export const deriveBlocks = [
  { type: 'h', text: 'The idea' },
  {
    type: 'p',
    text: 'A drawing shows one answer. A rule produces every answer. If you place 32 clocks by hand, you have 32 things to keep right. If you write the rule for a clock, you have one thing, and it is right for all 32.',
  },
  {
    type: 'p',
    text: '**Derived** means worked out from a rule or from data, instead of typed in. It is the biggest thing code does that an authoring tool cannot. It is also what makes something stay right when the world changes: next week, next year, in another place.',
  },
  {
    type: 'compare',
    caption: 'Drawn and derived',
    head: ['Drawn by hand', 'Derived by a rule'],
    rows: [
      ['A table of time offsets typed in for each city', 'A zone name for each city, and the browser works out today’s offset, summer time included'],
      ['A picture of the night side of the Earth', 'A calculation from where the sun is, for every point, every minute'],
      ['Twelve slides, one per month', 'One template and a list of months'],
      ['"3 days left", typed in', 'The deadline, and a rule that counts from today'],
    ],
  },
  { type: 'h', text: 'In the world time map' },
  {
    type: 'p',
    text: 'The night shadow is not a picture of night. For every point on the map, the page works out where the sun is and whether that point is in daylight, twilight or dark. It redraws every minute. The clocks are not 32 typed times either: each city has a zone name, and the browser knows the rules for that place.',
  },
  {
    type: 'p',
    text: 'That is why the map was still right when the clocks changed in autumn. The one bug that appeared then came from muddling two ideas: a position on the globe never changes with summer time, but a city’s clock does. A label had been treated as one when it was the other. Even the bug was about getting the rule right.',
  },
  { type: 'h', text: 'Practice' },
  {
    type: 'p',
    text: 'For each statement, place yourself on the slider, then compare with the engineering view. There are good arguments in the middle, and that is the point.',
  },
  {
    type: 'spectrum',
    statement: 'Today’s date shown at the top of a page',
    left: 'Drawn by hand',
    right: 'Derived by a rule',
    expert: 95,
    explanation: 'Typed in, it is wrong tomorrow. A rule reads the date and is right every day.',
  },
  {
    type: 'spectrum',
    statement: 'The percentage complete shown for a course',
    left: 'Drawn by hand',
    right: 'Derived by a rule',
    expert: 90,
    explanation: 'It depends on what the learner has done. Count it, do not state it.',
  },
  {
    type: 'spectrum',
    statement: 'The college logo on the first page',
    left: 'Drawn by hand',
    right: 'Derived by a rule',
    expert: 10,
    explanation: 'A logo is a design decision. Place it. There is nothing to calculate.',
  },
  {
    type: 'spectrum',
    statement: 'The order of the six sections in a handbook',
    left: 'Drawn by hand',
    right: 'Derived by a rule',
    expert: 25,
    explanation: 'Often a choice about teaching, so you decide it. If the order came from a rule, such as alphabetical or by date, you could derive it. Ask which it is.',
  },
  {
    type: 'say',
    title: 'Say this to Claude',
    phrases: [
      'Is there a rule that could produce this, instead of me listing each one?',
      'Do not type these values in. Work them out from the source, and show me how.',
      'What would go wrong in a year if we typed this in by hand?',
      'Which of these are decisions I should make, and which are calculations you can do?',
    ],
  },
  {
    type: 'callout',
    tone: 'warning',
    title: 'The usual slip',
    text: 'Deriving everything. Some things are choices, not calculations: the colour, the wording, the order you want. Derive what is true. Decide what is chosen.',
  },
  {
    type: 'journal',
    name: 'hb-derive',
    title: 'Find the rule',
    prompts: [
      { prompt: 'Think of something you update by hand in your work, again and again.' },
      { prompt: 'What changes each time? What stays the same?', hint: 'The part that changes is the input. The part that stays the same is the rule.' },
      { prompt: 'Write the rule in a sentence, as if telling a colleague.' },
    ],
  },
];
