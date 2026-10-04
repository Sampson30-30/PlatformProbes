// Plain-English helper text: what each page is, what you can do on it, and a
// short hint above each kind of interactive part. Written for someone with no
// developer background. A test keeps it free of technical words.
//
// Change the wording here, never in the pages.

/** What you can do, worked out from the kinds of block a page contains. */
const FROM_BLOCK = {
  say: 'Copy a phrase to say to Claude, and use it in your own conversation.',
  quiz: 'Answer the practice questions. You can try again, and nothing is marked or sent to anyone.',
  journal: 'Write a short reflection. It is saved on this device only.',
  flow: 'Answer the questions in the chart to follow one route through it.',
  scenario: 'Choose what you would do in a situation, and see what happens.',
  process: 'Move through the steps one at a time, using the Next step button.',
  timeline: 'Open each event to see what happened and when.',
  grid: 'Open each tile to read more.',
  spectrum: 'Move the slider to where you stand, then compare with an expert.',
  rating: 'Rate how confident you feel. There are no wrong answers.',
  accordion: 'Open each heading to read more.',
};

/** The things you can do on a page, from its blocks, in the order they first appear. */
export function canFromBlocks(blocks) {
  const seen = [];
  const walk = (list) => {
    for (const block of list || []) {
      if (FROM_BLOCK[block.type] && !seen.includes(block.type)) seen.push(block.type);
      if (block.type === 'process') for (const step of block.steps || []) walk(step.blocks);
    }
  };
  walk(blocks);
  return seen.map((type) => FROM_BLOCK[type]);
}

export const PAGE_HELP = {
  home: {
    what: 'This site is a short course in a way of working: how to ask Claude for what you actually want, and how to check what you get back. It is for people who build learning content and want to make things that Rise cannot.',
    can: [
      'Start with “Know your reach” to find out what your own Claude can do.',
      'Use the chart on this page to see whether an idea suits Rise or needs something built.',
      'Read the six habits, one at a time or in any order.',
      'Follow a real build in the case file.',
    ],
  },
  reach: {
    what: 'Before anything else, find out what your own Claude can and cannot do. Two people using the same Claude can get very different results, because they have different tools switched on.',
    can: [
      'Read why “what can it reach?” is the first question to ask.',
      'Try the five checks in your own Claude. Each has a Copy button, so you can paste it straight into a conversation.',
      'Use the chart to see what your results mean.',
      'Write down what you found in the reflection at the end. It is saved on this device only.',
    ],
  },
  habit: (topic) => ({
    what: `This is habit ${topic.number} of 6. A habit here is a question you can ask before, during or after you build something.`,
    can: ['Read the idea and the examples.', ...canFromBlocks(topic.blocks)],
  }),
  case: (study) => ({
    what: 'A real build, told as a story: what was asked for, what went wrong, and what fixed it. It shows the habits being used.',
    can: ['Read it from the top, and notice which habit is at work in each part.', ...canFromBlocks(study.blocks)],
  }),
  gallery: {
    what: 'A set of things that code can do and Rise cannot, shown working. It is here to give you ideas, not to teach you how to build them.',
    can: [
      'Open any tile to read what it is and what it is made of.',
      'Try the working example inside it, where there is one.',
      'Copy the phrase under “How to ask for it” and use it with Claude.',
      'Take an idea you like to the brief builder.',
    ],
  },
  brief: {
    what: 'A set of questions that helps you describe what you want built, so that Claude gets a clear request. At the end it writes your answers up as one message you can paste into a conversation. Your answers are saved on this device only.',
    can: [
      'Work through the steps in order. You can go back at any time.',
      'Press “Load an example” to see a finished one.',
      'Copy the finished brief, or download it as a file.',
      'Press “Start again” to clear everything. It asks you first.',
    ],
  },
  words: {
    what: 'Short, plain meanings for the words engineers use, and what to say to Claude when you want that move.',
    can: [
      'Search for a word, or for part of one.',
      'Read what it means, an example, and what it costs you if you ignore it.',
      'Copy the phrase to say to Claude.',
      'Use the Phrasebook to find every phrase from the habit pages in one place.',
    ],
  },
  progress: {
    what: 'A record of how your way of working changes. You rate yourself now, practise, rate yourself again, and see the difference. Everything is saved on this device only.',
    can: [
      'Rate yourself on each habit now.',
      'Come back after you have practised and rate yourself again.',
      'See your two sets of ratings side by side.',
      'See which reflections you have written.',
    ],
  },
  coach: {
    what: 'A guide for whoever runs a session with a group. If you are learning on your own, you can skip it.',
    can: [
      'See a suggested plan for a session of about 90 minutes.',
      'Read coaching notes for each part: what to ask and what to look for.',
      'Change the timings to suit your group. They have not yet been tried with one.',
    ],
  },
};

/**
 * A short hint shown above the first part of each kind on a page. A block can
 * set its own with `help: "text"`, or switch it off with `help: false`.
 */
export const BLOCK_HELP = {
  quiz: 'Choose an answer, then press Check answer. You can try again. Nothing is marked or sent anywhere.',
  journal: 'Write as much or as little as you like. Your notes are saved in this web browser, on this device only, and nothing is sent anywhere. Use Copy to clipboard or Download text to keep them.',
  rating: 'For each statement, choose the number that fits you best. There are no wrong answers.',
  spectrum: 'Move the slider to where you stand, then press “Compare with the expert view”.',
  scenario: 'Read the situation, then choose what you would do. You can go back a step, or start again, to see where a different choice leads.',
  grid: 'Select a tile to open it. The line beneath shows how many you have explored.',
  process: 'Use Next step and Previous step to move through, one step at a time.',
  timeline: 'Open an event to read more. If you see a “Show next event” button, press it to reveal the next one.',
  flow: (block) => (block.walkthrough
    ? 'Answer each question to follow one route through the chart. The route you take is highlighted, and Back lets you change an answer.'
    : 'Read the chart from the top. Each line shows where a step leads.'),
  say: 'Copy a phrase, paste it into your own conversation with Claude, and change it to fit what you are doing.',
  accordion: 'Select a heading to open or close it.',
};

/** The hint for a block, or null. `already` is the set of kinds already hinted on this page. */
export function hintFor(block, already) {
  if (block.help === false) return null;
  if (typeof block.help === 'string') return block.help;
  const source = BLOCK_HELP[block.type];
  if (!source) return null;
  const key = block.type === 'flow' ? `flow:${Boolean(block.walkthrough)}` : block.type;
  if (already.has(key)) return null;
  already.add(key);
  return typeof source === 'function' ? source(block) : source;
}
