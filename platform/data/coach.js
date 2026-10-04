// The coach's guide. Written for whoever runs a session.

export const COACH = {
  intro: 'This guide is for whoever runs a session: you do not need to be an engineer, but it helps if you have built something with Claude yourself. The platform is built so people can work through it alone. A session adds the thing that matters most, which is hearing how someone else thinks about a problem.',
  honest: 'Everything on this page is a suggestion. The timings and exercises have not yet been tried with a group, so change them freely and tell whoever maintains the platform what worked.',
  blocks: [
    { type: 'h', text: 'A session in about 90 minutes' },
    {
      type: 'compare',
      caption: 'A suggested shape. Adjust the timings to the group.',
      head: ['Minutes', 'What happens', 'Notes'],
      rows: [
        ['10', 'Start from a real frustration. Ask: "Think of something you made in Rise that was hard. What did you wish it could do?"', 'Write the answers up. They become the ideas for later.'],
        ['10', 'Know your reach. Everyone runs the five checks in their own Claude and compares.', 'Expect surprises. Differences between people are the point.'],
        ['25', 'One habit. Pick the one that matches what they said in the first ten minutes. Read it, do the practice, discuss.', 'Use the coaching notes below for questions to ask.'],
        ['35', 'The brief builder, in pairs, on a real idea from the first exercise.', 'One person talks, one types, then swap. Ask pairs to read each other’s gaps list.'],
        ['10', 'Close. Each person says what they will try this week, and who will check in with them.', 'A named check-in matters more than the plan.'],
      ],
    },
    { type: 'h', text: 'Coaching notes for each part' },
    {
      type: 'accordion',
      label: 'Coaching notes',
      items: [
        { title: 'Know your reach', body: '**Ask:** What can yours do? How do you know? **Good looks like:** they have run the checks rather than assumed. **Common stumble:** mistaking confidence for ability. A fluent answer does not mean it fetched or checked anything. **Exercise:** run the five checks side by side on two people’s set-ups and explain the differences.' },
        { title: 'Decompose', body: '**Ask:** What is this made of? Which parts would you not want Claude to make up? **Good looks like:** they name information, rules and limits, not only features. **Common stumble:** listing screens or pages instead of parts. **Exercise:** take a Rise lesson they know well and ask which parts are content, which are behaviour and which are looks.' },
        { title: 'Derive, don’t draw', body: '**Ask:** What do you retype each time? **Good looks like:** they spot something repeated and describe the rule in a sentence. **Common stumble:** wanting to derive things that are really choices, such as colour or order. **Exercise:** find three things in a past course that were typed by hand and could have been worked out.' },
        { title: 'Keep what changes apart', body: '**Ask:** If the college changed its blue tomorrow, what would you touch? **Good looks like:** they talk about one place. **Common stumble:** building everything in one go in one big request, so nothing is separable. **Exercise:** compare changing a Rise course theme with changing the wording in twenty separate blocks.' },
        { title: 'Say what it should do', body: '**Ask:** Say it to me as if I am building it. What happens when you click that? **Good looks like:** they use "when this, that" sentences and state a limit without being asked. **Common stumble:** describing looks and leaving out behaviour. **Exercise:** in pairs, one describes an interactive idea in words only, and the other sketches it. Compare, and see what the words left out.' },
        { title: 'Work with it like a colleague', body: '**Ask:** What did you ask its opinion on? Where did you disagree? **Good looks like:** they sometimes disagree with it and say why. **Common stumble:** accepting the first answer, or ignoring advice they asked for. **Exercise:** ask Claude for two options on something, then make each person pick one and defend it.' },
        { title: 'Check it where it lives', body: '**Ask:** Where will a learner open this? Have you opened it there? **Good looks like:** they can name something they did not check. **Common stumble:** treating "done" as evidence. **Exercise:** for something they have built, list what has been checked and what is only assumed.' },
      ],
    },
    { type: 'h', text: 'The transfer test' },
    {
      type: 'p',
      text: 'The aim is not that people finish the pages. It is that, given a brief they have never seen, they ask the questions an engineer would ask. To test that, give each person a short, unfamiliar brief before and after, and have them write the questions they would ask before building. Then score each with the checklist below.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Did they break the idea into parts?',
        'Did they ask where the information would come from, rather than assuming it?',
        'Did they look for something a rule could produce?',
        'Did they ask what must not break, or what limits apply?',
        'Did they ask where it will live?',
        'Did they ask how they would know it works?',
      ],
    },
    {
      type: 'p',
      text: 'A score out of six before and after is a fair signal. It is not a grade. Keep it between you and the learner, and use it to decide which habit to practise next.',
    },
    { type: 'h', text: 'What to build first, and when to stop and ask' },
    {
      type: 'callout',
      tone: 'success',
      title: 'Good first projects',
      text: 'Something that runs in a browser, has no logins, holds no personal data, and has one clear purpose: an interactive activity, a calculator, a visual explainer. If it goes wrong, little is lost.',
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Stop and ask first if it',
      text: 'Collects or shows personal data about learners. Connects to a college system. Needs a login. Reuses someone else’s content or images. Will be relied on by many people. Then ask who looks after the system, who is responsible for the data, and who will maintain what you build.',
    },
    {
      type: 'p',
      text: 'One question every project should answer early: **who will look after this in a year?** If the answer is one person, write that down and decide whether that is acceptable.',
    },
    { type: 'h', text: 'Looking after people' },
    {
      type: 'list',
      items: [
        'Do not use a colleague’s unfinished attempt as a bad example. Their first attempt is everyone’s first attempt.',
        'Keep self-assessments private. They belong to the learner.',
        'This repository and site may be public. Never put names, internal documents or learner data in them.',
        'Check the licence of anything fetched from elsewhere before relying on it.',
      ],
    },
    { type: 'h', text: 'What this platform does not claim' },
    {
      type: 'list',
      items: [
        'It has not been tested with a group of learners yet.',
        'The reach checks depend on the product and plan each person has, and these change.',
        'The accessibility of the pages was checked by running code and reading it, not with a screen reader.',
        'It teaches a way of thinking. It does not make anyone able to build safely at scale.',
      ],
    },
  ],
};
