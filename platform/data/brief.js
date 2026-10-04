// Options and an example for the brief builder.

export const KINDS = [
  'Information',
  'A rule or calculation',
  'Behaviour (what it does)',
  'A design choice',
  'A limit (where it lives)',
];

export const ORIGINS = [
  'I make it myself',
  'Fetched from a trusted source',
  'Worked out by a rule',
  'Someone else has to tell me',
];

export const PLACES = [
  'Inside a Rise course',
  'A web page on a college site',
  'A single file I share',
  'I am not sure yet',
];

export const CHECKS = [
  'Several dates, not only today',
  'Phone, tablet and desktop',
  'Keyboard only',
  'A screen reader',
  'The real place it will live',
  'A slow connection',
];

export const BRIEF_TEXT = {
  intro: 'Turn an idea into a brief that an engineer would be glad to receive. Work through the six steps. Your answers stay on this device, and at the end you get a brief to give to Claude, plus a list of gaps to think about first.',
  steps: [
    { title: 'The idea', hint: 'Say what and who, in plain words.' },
    { title: 'What it is made of', hint: 'Habit 1: decompose. For each part, where does it come from?' },
    { title: 'Rules and change', hint: 'Habits 2 and 3: what can a rule produce, and what will change?' },
    { title: 'Behaviour and limits', hint: 'Habit 4: what should it do, and what must not break?' },
    { title: 'Where it lives and how to check', hint: 'Habit 6: where will it be used, and how will you know it works?' },
    { title: 'Your brief', hint: 'Check for gaps, then copy the brief.' },
  ],
};

// A good brief, from the world time map. Used by "Load an example".
export const EXAMPLE = {
  idea: 'A live world map that shows the local time in cities around the world, for a course on working across time zones.',
  audience: 'Learners on the course. Afterwards they can say what time it is in another place, and why it differs.',
  parts: [
    { name: 'Coastlines', kind: 'Information', origin: 'Fetched from a trusted source', note: 'Open geographic data, converted into one shape by a script' },
    { name: 'Local time in each city', kind: 'A rule or calculation', origin: 'Worked out by a rule', note: 'Use zone names and the browser’s time zone support, so summer time is right' },
    { name: 'Day and night shading', kind: 'A rule or calculation', origin: 'Worked out by a rule', note: 'From the sun’s position, redrawn every minute' },
    { name: 'Click a number, a line moves', kind: 'Behaviour (what it does)', origin: 'I make it myself', note: 'A ruler of offsets above and below the map' },
    { name: 'Colours', kind: 'A design choice', origin: 'I make it myself', note: 'Fixed on purpose so it looks the same for every learner' },
    { name: 'The course platform', kind: 'A limit (where it lives)', origin: 'Someone else has to tell me', note: 'Which browser features the embed blocks' },
  ],
  rules: 'Clocks, shading and offsets are all worked out. No time is typed in.',
  changes: 'The list of cities will grow, and the brand colours may change. I will change both, so keep them in one place each.',
  behaviour: 'When I click a number on the ruler, a line moves to that column and cuts through every city in that time zone.\nWhen I pick a city, its dot is highlighted and its time is shown.',
  mustNot: 'Do not remove the ability to see several cities on the map at once.',
  place: 'Inside a Rise course',
  placeNotes: 'The colours must look identical for every learner. Some browser features may be blocked in the embed, so test there.',
  verify: 'A learner can read the time in any city within a few seconds, on any device, in any month of the year.',
  checks: ['Several dates, not only today', 'Phone, tablet and desktop', 'Keyboard only', 'The real place it will live'],
};
