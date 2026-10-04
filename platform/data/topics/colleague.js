export const colleagueBlocks = [
  { type: 'h', text: 'The idea' },
  {
    type: 'p',
    text: 'Ordering a model around like a vending machine ("make me this", "now make me that") throws away most of what it is good for. Treat it more like a colleague who is quick, knowledgeable and willing to be told they are wrong. The work is a conversation between two people who both think.',
  },
  {
    type: 'p',
    text: 'In practice that means three moves. **Ask for a diagnosis before a change:** "what do you think is going on?" **Ask for its view and its reasons:** "which would you pick, and why?" **Then decide yourself.** The final call is yours, because you know the learners, the college and the limits.',
  },
  {
    type: 'compare',
    caption: 'Vending machine and colleague',
    head: ['Vending machine', 'Colleague'],
    rows: [
      ['Make the selected city stand out.', 'People want it clearer which city is selected. I could grey out the others or give that one its own colour. Which makes sense to you, and why?'],
      ['It is broken in Rise. Fix it.', 'The list shows open by default in Rise but not in my preview. Any idea why?'],
      ['(Accepting whatever it suggests)', 'Could you explain that idea again? What else did you consider?'],
    ],
  },
  { type: 'h', text: 'In the world time map' },
  {
    type: 'p',
    text: 'The builder wanted the clicked city to be obvious. Two ways came to mind, and the question went to Claude: "Which one makes sense to you?" Its answer argued from the page’s own rules. The dots already carried two meanings (position, and dimmer when it is daytime). Greying out the others would add a third, and make the other 31 cities look switched off, which works against the point of seeing everyone at once. It suggested a halo and a small size increase instead.',
  },
  {
    type: 'p',
    text: 'It went the other way too. The builder had an idea of their own: put the cities in an optional accordion. Claude’s reply was that this was a sharper idea than its own, and it built on it. A good colleague says so when you are right.',
  },
  { type: 'h', text: 'Practice' },
  {
    type: 'quiz',
    label: 'Colleague: who makes the call?',
    title: 'Who should make this call?',
    data: {
      questions: [
        {
          prompt: 'Something works in your preview but not in the course platform. Who does what?',
          options: [
            { text: 'You report exactly what you see, and ask Claude to diagnose before it changes anything', correct: true, feedback: 'Yes. You are the only one who can see the real destination, and a diagnosis first avoids fixes that do not address the cause.' },
            { text: 'You tell Claude which line to change', feedback: 'You would be guessing at the cause. Let it diagnose.' },
            { text: 'You ask Claude to try things until it works', feedback: 'It might, but you will not know why, and it may break something else.' },
          ],
        },
        {
          prompt: 'Claude gives two options and recommends one. Whose decision is it?',
          options: [
            { text: 'Yours. Weigh its reasons, and pick.', correct: true, feedback: 'Yes. The reasons are the useful part. The decision stays with the person who knows the learners.' },
            { text: 'Claude’s. It is the expert.', feedback: 'It is expert in the options, not in your learners or your college.' },
          ],
        },
        {
          prompt: 'You had an idea, and Claude suggests a different one. What is a good next step?',
          options: [
            { text: 'Ask it to compare the two, with reasons, then choose', correct: true, feedback: 'Yes. Sometimes yours wins. In this build, the builder’s idea beat Claude’s first one.' },
            { text: 'Drop yours, since it is a model', feedback: 'You would lose good ideas. Test them against each other.' },
            { text: 'Insist on yours without hearing why', feedback: 'You might miss a real problem it has spotted.' },
          ],
        },
      ],
    },
  },
  {
    type: 'say',
    title: 'Say this to Claude',
    phrases: [
      'Before you change anything, tell me what you think is going on.',
      'Which of these would you pick, and why? I will decide.',
      'Could you explain that again, as if I am new to it?',
      'What are you least sure about in what you have just done?',
    ],
  },
  {
    type: 'callout',
    tone: 'warning',
    title: 'The usual slip',
    text: 'Letting it decide something that is really yours. It will give a confident answer to a question like "what is the right trade-off for these learners?" even though only you can weigh that.',
  },
  {
    type: 'journal',
    name: 'hb-colleague',
    title: 'Your decisions',
    prompts: [
      { prompt: 'Think of a decision in something you are building that only you can make. What is it?' },
      { prompt: 'What would you ask Claude for, in order to make it well?' },
    ],
  },
];
