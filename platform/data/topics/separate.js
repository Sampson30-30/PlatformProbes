export const separateBlocks = [
  { type: 'h', text: 'The idea' },
  {
    type: 'p',
    text: 'Three kinds of thing change at different speeds and for different reasons: **what you are showing** (the content or data), **what it does** (the behaviour) and **how it looks** (the design). When they are tangled together, one change means a hunt through everything. When they are kept apart, one change is one edit.',
  },
  {
    type: 'p',
    text: '**Hardcoded** means a value is written into the place that uses it, instead of being kept in one spot and referred to. If the college blue is written out in 200 places, changing it means 200 edits and you will miss some. If it is named once and used in 200 places, it is one edit.',
  },
  {
    type: 'compare',
    caption: 'Something you already know from Rise',
    head: ['', 'Kept apart', 'Tangled'],
    rows: [
      ['Changing the look of a whole course', 'Change the course theme once and every lesson follows', 'Edit every block by hand'],
      ['Changing a name that appears 40 times', 'It is stored once and shown 40 times', 'It is typed 40 times'],
    ],
  },
  { type: 'h', text: 'In the world time map' },
  {
    type: 'list',
    items: [
      '**The cities are a list.** Adding a city is adding one line, not redrawing anything.',
      '**The colours have names.** The page defines them once and refers to them by name everywhere.',
      '**The map outline was in the wrong place.** The land shape is one line of about 75,000 characters in the middle of the page file. Every time a tool opened the file, that line got in the way. The lesson written down afterwards: keep big generated data in its own file and put it into the page when you build.',
    ],
  },
  {
    type: 'callout',
    tone: 'success',
    title: 'Hardcoding on purpose',
    text: 'The colours in the map were fixed deliberately, so it looks identical for every learner whatever their device is set to. A comment in the file says so. Hardcoding is not always wrong. The question is whether you chose it, and whether the next person can tell.',
  },
  { type: 'h', text: 'Practice' },
  {
    type: 'scenario',
    label: 'Changing the brand colour',
    data: {
      start: 'start',
      nodes: {
        start: {
          title: 'A request arrives',
          text: 'Your manager says the college is changing its blue. You have a resource built with Claude, with about 40 pages of material.\n\nYou open it and notice the blue is written out in a lot of places.',
          choices: [
            { text: 'Ask Claude to find every blue and change it, page by page', goto: 'hunt' },
            { text: 'Ask Claude where the blue is defined and used, and how many places it appears', goto: 'ask' },
          ],
        },
        hunt: {
          title: 'The hunt',
          text: 'Claude changes most of them. Two weeks later someone finds three pages still on the old blue, and one place where a similar blue should not have changed.',
          choices: [{ text: 'Ask Claude why this keeps happening', goto: 'ask' }],
        },
        ask: {
          title: 'A useful answer',
          text: 'Claude reports 143 places. It explains that the blue is typed out each time rather than named once, and that you can restructure so it is defined in one place and used by name everywhere.',
          choices: [
            { text: 'Ask for the restructure first, then change the colour in one place', goto: 'good' },
            { text: 'Skip the restructure and just change the 143 places', goto: 'mixed' },
          ],
        },
        good: {
          title: 'One edit',
          text: 'Claude defines the blue once, replaces the 143 places with its name, checks nothing else changed, and then changes the one definition. Next time the brand changes, it is a one-line edit.',
          end: true,
          outcome: 'good',
        },
        mixed: {
          title: 'Fixed, until next time',
          text: 'It works. The next brand change brings the same 143 edits, and you have to trust it again to find them all.',
          end: true,
          outcome: 'mixed',
        },
      },
    },
  },
  {
    type: 'quiz',
    label: 'Keep apart: check your understanding',
    title: 'Hardcoded, or kept apart?',
    data: {
      questions: [
        {
          prompt: 'A page lists 30 cities. Which structure makes adding a 31st easiest?',
          options: [
            { text: 'A list of cities that the page reads, so you add one line', correct: true, feedback: 'Yes. The content is data, kept apart from the layout.' },
            { text: 'A separate block of layout for each city', feedback: 'Adding one means copying a block and editing it by hand, and every block can drift.' },
          ],
        },
        {
          prompt: 'You are building a one-page handout that will be used once. How much separating is worth doing?',
          options: [
            { text: 'Very little. It will not change, so keep it simple.', correct: true, feedback: 'Yes. Separating has a cost. Ask whether it will change, and who will change it.' },
            { text: 'Always as much as possible', feedback: 'Over-separating makes small things harder to follow. It is a trade-off, not a rule.' },
          ],
        },
      ],
    },
  },
  {
    type: 'say',
    title: 'Say this to Claude',
    phrases: [
      'If I change this later, how many places would you have to touch? If it is more than one, restructure so it is one.',
      'Where is this value defined, and where is it used?',
      'Keep the content in its own data file and the layout separate from it.',
      'Is anything in here hardcoded on purpose? If so, add a comment saying why.',
    ],
  },
  {
    type: 'callout',
    tone: 'warning',
    title: 'The usual slip',
    text: 'Over-separating. A one-off does not need a data file and a settings panel. Ask: will this change, and who will change it?',
  },
  {
    type: 'journal',
    name: 'hb-separate',
    title: 'Where would a change hurt?',
    prompts: [
      { prompt: 'Think of something you made that you often have to change. What is it?' },
      { prompt: 'How many places do you touch to change it?' },
      { prompt: 'What would it look like if it was only one?' },
    ],
  },
];
