export const decomposeBlocks = [
  { type: 'h', text: 'The idea' },
  {
    type: 'p',
    text: 'From the outside, a project looks like one thing: "a world time map". On the inside it is several different things. Some are information you need to get from somewhere. Some are rules. Some are design choices. Some are limits set by where it will live.',
  },
  {
    type: 'p',
    text: 'Decomposing means listing those parts, and for each one asking **where does it come from?** The answer is usually one of four things: you make it, you fetch it, it is worked out by a rule, or you have to ask someone. The parts that must come from outside, such as real data, are exactly the ones a model will invent if you let it.',
  },
  {
    type: 'compare',
    caption: 'In Rise and with code',
    head: ['', 'In Rise', 'With code and Claude'],
    rows: [
      ['Who decides the parts?', 'Rise does. You pick from the blocks it offers.', 'You do. You decide what the parts are and where each one comes from.'],
      ['When the idea does not fit', 'You look for a block that nearly does.', 'You break the idea down until each part is something that can be made.'],
    ],
  },
  { type: 'h', text: 'In the world time map' },
  {
    type: 'p',
    text: 'The idea was "a world map that shows the time everywhere". Broken down, it was this:',
  },
  {
    type: 'compare',
    caption: 'What the world time map is made of',
    head: ['Part', 'What kind of thing', 'Where it came from'],
    rows: [
      ['The coastlines', 'Data', 'Open geographic data, fetched and converted into one shape by a [[script]]'],
      ['The time in each city', 'A rule', 'The browser’s own time zone support, which knows about summer time'],
      ['Day and night shading', 'A calculation', 'Worked out from where the sun is, for every point on the map'],
      ['Click a number, a line moves', 'Behaviour', 'Described in plain words, then built'],
      ['The colours', 'A design choice', 'Decided by the builder, and fixed on purpose'],
      ['Where it will live', 'A limit', 'A Rise [[embed]], which affects several of the choices above'],
    ],
  },
  {
    type: 'quote',
    text: 'The decision that mattered most was the first one: get shapes and numbers from data and code, not from memory.',
    cite: 'From the build account',
  },
  { type: 'h', text: 'Practice' },
  {
    type: 'p',
    text: 'For each part, decide where it should come from. There is no trick. The point is to ask the question before anything is built.',
  },
  {
    type: 'quiz',
    label: 'Decompose: where does each part come from?',
    title: 'Where does it come from?',
    data: {
      questions: [
        {
          prompt: 'You want a page with the capital city of every country. Where should the list come from?',
          options: [
            { text: 'Fetched from a trusted source, then checked', correct: true, feedback: 'Yes. Facts like this are data. Recalled lists have gaps and errors.' },
            { text: 'Recalled by the model from memory', feedback: 'It will look confident, and some entries will be wrong.' },
            { text: 'Typed in by you, one by one', feedback: 'Possible, but slow, and you are now the source. A trusted list is better.' },
          ],
        },
        {
          prompt: 'You want each lesson to show how many days remain until the deadline. This is best treated as:',
          options: [
            { text: 'A rule, worked out from today’s date and the deadline', correct: true, feedback: 'Yes. It changes every day, so it has to be calculated.' },
            { text: 'Text you update each morning', feedback: 'It will be wrong on the first day you forget.' },
            { text: 'A picture of a calendar', feedback: 'A picture is right once, then wrong.' },
          ],
        },
        {
          prompt: 'The colour of the headings should be:',
          options: [
            { text: 'A design choice, made by you', correct: true, feedback: 'Yes. Some things are decisions, not data and not calculations.' },
            { text: 'Fetched from a trusted source', feedback: 'Unless it comes from a brand guide, there is nothing to fetch. You choose.' },
            { text: 'Worked out by a rule', feedback: 'You could, but the starting point is a choice.' },
          ],
        },
        {
          prompt: 'You are told it must work inside a course platform that blocks some features. This is:',
          options: [
            { text: 'A limit on where it will live, which can change other decisions', correct: true, feedback: 'Yes. Name limits early, because they reshape the parts.' },
            { text: 'A detail to deal with at the end', feedback: 'Discovering it at the end can mean rebuilding parts you thought were done.' },
          ],
        },
      ],
    },
  },
  {
    type: 'say',
    title: 'Say this to Claude',
    phrases: [
      'Before you build anything, list what this is made of, and where each part would come from. Do not build yet.',
      'Which parts of this should come from real data, and which from rules?',
      'What are you recalling from memory here that we should fetch and check instead?',
      'Where will this live, and does that change any of the parts?',
    ],
  },
  {
    type: 'callout',
    tone: 'warning',
    title: 'The usual slip',
    text: 'Asking for the whole thing in one go. A single request hides all the parts, so the model fills the gaps with guesses and you cannot tell which parts are sound.',
  },
  {
    type: 'journal',
    name: 'hb-decompose',
    title: 'Decompose an idea of yours',
    prompts: [
      { prompt: 'In a sentence, what do you want to make?' },
      { prompt: 'List three parts it is made of.', hint: 'Think: information, rules, behaviour, design, limits.' },
      { prompt: 'For each part: do you make it, fetch it, work it out, or have to ask someone?' },
    ],
  },
];
