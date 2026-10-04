export const reachBlocks = [
  { type: 'h', text: 'The idea' },
  {
    type: 'p',
    text: 'Ask a chat that cannot fetch anything to draw a world map, and it has to recall the coastlines from memory. The continents come out blocky and the pins overlap. Ask a Claude that can fetch real map data, run a script and look at what it made, and it builds something you can trust. **It can be the same underlying model.** The difference is what it can reach.',
  },
  {
    type: 'p',
    text: 'So before you judge what Claude can or cannot do, find out what yours can touch. "It is bad at maps" is often the wrong conclusion from a result that is really about access.',
  },
  { type: 'h', text: 'Four kinds of reach' },
  {
    type: 'grid',
    label: 'Four kinds of reach',
    columns: 2,
    cells: [
      { title: 'Sources', body: 'Can it fetch real data: a web page, an open dataset, a file you share? If not, it can only recall, and recall is where made-up details come from.' },
      { title: 'A place to run things', body: 'Can it run code or a script and read the answer? Then it can calculate and check, instead of guessing and hoping.' },
      { title: 'Eyes', body: 'Can it look at what it built, or at a screenshot you give it? Then "does that look right?" is something it can answer.' },
      { title: 'Your files and context', body: 'Can it read your project, save files where you work, and see your earlier decisions? If not, you are the copy-and-paste between steps.' },
    ],
  },
  {
    type: 'compare',
    caption: 'The same job, with and without reach',
    head: ['The job', 'Without reach', 'With reach'],
    rows: [
      ['Coastlines for a map', 'Recalled from memory, so shapes are approximate and wrong in places', 'Open geographic data fetched and converted by a script'],
      ['Clocks that stay right in summer time', 'Offsets guessed or typed in', 'The browser’s own time zone support, checked against real dates'],
      ['"Does it look right?"', 'It cannot see, so it says yes', 'It renders the page and looks, or reads your screenshot'],
      ['Getting the result to you', 'You copy and paste, and lose track of versions', 'It saves the file into your folder each time'],
    ],
  },
  {
    type: 'callout',
    tone: 'warning',
    title: 'Do not assume. Test.',
    text: 'What your Claude can reach depends on the product, your plan and your settings, and these change. The checks below are how you find out. Do not rely on someone else’s experience of a different set-up.',
  },
  { type: 'h', text: 'Find out what yours can reach' },
  {
    type: 'p',
    text: 'Try these in your own Claude, one at a time. Each one tests a kind of reach. Where it cannot, it will usually say so. That is useful to know.',
  },
  {
    type: 'say',
    title: 'Five reach checks to try',
    phrases: [
      'What tools and abilities do you have in this conversation? List them plainly.',
      'Fetch https://example.com and tell me what the page says.',
      'Run a calculation by actually running code: what is 17 per cent of 4,860? Show me the code you ran.',
      'Create a small file called hello.html in my folder, and tell me exactly where you saved it.',
      'I will share a screenshot. Describe what you see, and point out anything that looks wrong.',
    ],
  },
  { type: 'h', text: 'What your results mean' },
  {
    type: 'p',
    text: 'Two of the checks matter most for trust: fetching a real source, and running code. Answer for your own Claude and the chart will tell you what to expect from it. The other two, eyes and your files, work the same way: note them in your reflection.',
  },
  {
    type: 'flow',
    label: 'What can your Claude do for you?',
    layout: 'tree',
    walkthrough: true,
    items: [
      {
        text: 'Did it fetch https://example.com and tell you what the page says?',
        branches: [
          {
            label: 'Yes',
            items: [
              {
                text: 'Did it run code and show you the code?',
                branches: [
                  { label: 'Yes', items: [{ text: 'Sources and a place to run things', detail: 'This is the strong set-up. It can fetch real data and check its own work, so build with it, and ask it to show how it checked.' }] },
                  { label: 'No', items: [{ text: 'Sources, but nowhere to run code', detail: 'It can read real material but cannot calculate or test. Give it the facts you need, and check any numbers yourself.' }] },
                ],
              },
            ],
          },
          {
            label: 'No',
            items: [
              {
                text: 'Did it run code and show you the code?',
                branches: [
                  { label: 'Yes', items: [{ text: 'A place to run things, but no sources', detail: 'It can calculate and test, but only on what you give it. Paste or upload the data, and it can check that.' }] },
                  { label: 'No', items: [{ text: 'Recall only', detail: 'Use it to think, plan and draft. Treat every fact and number as unchecked until you have verified it yourself.' }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { type: 'p', text: 'Your results go in the reflection at the end, so you have a record of what you can use.' },
  { type: 'h', text: 'Practice' },
  {
    type: 'quiz',
    label: 'Reach: check your understanding',
    title: 'Reach',
    data: {
      questions: [
        {
          prompt: 'Someone says "Claude is bad at maps" after getting squashed continents. What is the most useful first question?',
          options: [
            { text: 'Which model were they using?', feedback: 'Worth knowing, but the same model can behave very differently with different tools.' },
            { text: 'What could it reach? Could it fetch real map data and check its own output?', correct: true, feedback: 'Yes. A result is evidence about the whole set-up, not only the model.' },
            { text: 'How was the request worded?', feedback: 'Wording matters, but no wording makes up for coastlines it has no way to fetch.' },
            { text: 'Would a different AI do better?', feedback: 'You would be guessing. Find out what is missing first.' },
          ],
          explanation: 'Capability is the model plus its tools plus its context. Change any of them and the result changes.',
        },
        {
          prompt: 'A page shows clocks for 30 cities and they are wrong after the clocks change in autumn. Which kind of reach would have helped most?',
          options: [
            { text: 'Eyes, so it could see the page', feedback: 'It would help, but the wrong times would look fine without knowing the right ones.' },
            { text: 'A place to run things, so it could compare the output with real dates', correct: true, feedback: 'Yes. Running code against several dates is how you catch this kind of error.' },
            { text: 'More detailed instructions', feedback: 'Detail helps, but the problem is not being able to check.' },
          ],
          explanation: 'Anything that depends on the date needs checking against more than today’s date, and that needs something that can run code.',
        },
        {
          prompt: 'You paste a long brief into a chat that cannot run code or fetch anything. Which expectation is fair?',
          options: [
            { text: 'It can write the plan, the wording and the structure, but any facts and numbers will be recalled, not checked.', correct: true, feedback: 'Yes. Use it for thinking and drafting, and verify anything factual yourself.' },
            { text: 'It will build the same thing as a Claude with full reach.', feedback: 'Not reliably. Without reach it cannot source or check.' },
            { text: 'It will tell you when it has made something up.', feedback: 'Not reliably either. This is why knowing the limits of your set-up matters.' },
          ],
        },
      ],
    },
  },
  {
    type: 'journal',
    name: 'hb-reach',
    title: 'My reach',
    prompts: [
      { prompt: 'Which of the five checks could your Claude do, and which could it not?', hint: 'Be specific: "fetched the page" or "said it cannot browse".' },
      { prompt: 'Think of something you would like to build. Which kind of reach would it need most?', hint: 'Sources, a place to run things, eyes, or your files.' },
      { prompt: 'Who could help you get that reach, or confirm what you have?' },
    ],
  },
];
