export const specifyBlocks = [
  { type: 'h', text: 'The idea' },
  {
    type: 'p',
    text: 'You do not need technical words to give a good specification. Describe what should happen, in plain language, as if telling a colleague who is going to build it: **when I do this, that happens.** Then say what must not change. Then say where it will live.',
  },
  {
    type: 'p',
    text: 'The most useful move is small. Before it builds anything, ask it to say back what it understood. That costs one message, and it surfaces a wrong assumption while it is still free to change.',
  },
  {
    type: 'compare',
    caption: 'In Rise your settings are the interface. With Claude, your words are.',
    head: ['Vague', 'Specific'],
    rows: [
      ['Make it better', 'When I click a number on the ruler, a line moves to that column of the map and cuts through every city in that time zone.'],
      ['Add a list of cities', 'A small picker beside the clock that jumps to a city. Keep the full grid, but behind a toggle.'],
      ['Make it work in our course', 'It will sit in an embed, so the colours must look the same for every learner whatever their device is set to.'],
    ],
  },
  { type: 'h', text: 'In the world time map' },
  {
    type: 'quote',
    text: 'I need the line to move when I click on the scale. So it cuts through all the cities in that time zone, does that make sense?',
    cite: 'The builder, describing behaviour in plain words',
  },
  {
    type: 'quote',
    text: 'No, we don’t want to replace being able to see multiple places on the map.',
    cite: 'The builder, stating a limit',
  },
  {
    type: 'quote',
    text: 'Before you do anything, can you confirm what you understand?',
    cite: 'The builder, before a change',
  },
  {
    type: 'p',
    text: 'That last one is probably the most reusable sentence in the whole build. The model read a colleague’s example file and replied with what it thought the idea was: a single dropdown that would replace the multi-city view. It pointed out that trade-off. Nothing had been changed yet, so the builder could say "no, keep the multi-city view" for free.',
  },
  { type: 'h', text: 'Practice' },
  {
    type: 'scenario',
    label: 'A colleague’s example file',
    data: {
      start: 'start',
      nodes: {
        start: {
          title: 'You have a good example to borrow from',
          text: 'A colleague has shared an HTML file that does something similar to yours. It has a nice idea: a dropdown list of cities, so people do not have to scroll. You want that idea in your page.\n\nYou open a conversation with Claude and attach their file.',
          choices: [
            { text: 'Say: "Use this file’s list idea in mine."', goto: 'vague' },
            { text: 'Say: "Before you do anything, tell me what you understand from this file and what you would change."', goto: 'confirm' },
          ],
        },
        vague: {
          title: 'It builds',
          text: 'Claude replaces your cities section with the dropdown and a single readout. It looks tidy. You then realise people can no longer see several cities at once, which was the point of your page.',
          choices: [{ text: 'Ask it to put things back', goto: 'confirm' }],
        },
        confirm: {
          title: 'It says what it understood',
          text: 'Claude replies: the file uses one dropdown and one readout panel, which would replace the multi-city view. It flags that trade-off and suggests an alternative: add the dropdown as a shortcut and keep the grid. It changes nothing yet.',
          choices: [
            { text: 'Say what must not change: "Keep the ability to see multiple places on the map. Add the dropdown alongside."', goto: 'good' },
            { text: 'Say "Sounds fine, go ahead" without adding anything', goto: 'mixed' },
          ],
        },
        good: {
          title: 'The right thing, first time',
          text: 'You stated the limit, so Claude builds the dropdown as an addition. The idea you liked is in, and what you needed is still there.',
          end: true,
          outcome: 'good',
        },
        mixed: {
          title: 'Probably fine, but you left it to chance',
          text: 'Claude builds its alternative. It is likely close to what you wanted, but you never said what must not change, so you are relying on its guess.',
          end: true,
          outcome: 'mixed',
        },
      },
    },
  },
  {
    type: 'say',
    title: 'Say this to Claude',
    phrases: [
      'Before you do anything, can you confirm what you understand?',
      'Here is what must not change: ...',
      'Describe the result in one paragraph, as a learner would see it. I will tell you if it is right.',
      'What would you need to know from me before building this?',
    ],
  },
  {
    type: 'callout',
    tone: 'warning',
    title: 'The usual slip',
    text: 'Describing how it looks and leaving out what happens. "Make the button blue" says nothing about what pressing it does, and the behaviour is the part that is expensive to get wrong.',
  },
  {
    type: 'journal',
    name: 'hb-specify',
    title: 'Write a specification',
    prompts: [
      { prompt: 'Take something vague you might ask for, such as "make it look nicer". Write it here.' },
      { prompt: 'Rewrite it as behaviour: "When someone does X, Y happens."' },
      { prompt: 'What must not change? What is the limit?' },
    ],
  },
];
