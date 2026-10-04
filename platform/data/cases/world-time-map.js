// The world time map case file: a real build, told as decisions.
// Written from the builder's own account. It names no one else.

export const WORLD_TIME_MAP = {
  id: 'world-time-map',
  title: 'Case file: the world time map',
  question: 'What did the thinking look like, turn by turn?',
  summary: 'One real build, from a question to a finished piece, with the decisions exposed. Make your call at each step before you see what happened.',
  blocks: [
    { type: 'h', text: 'What got built' },
    {
      type: 'p',
      text: 'A live world time map in plain [[HTML, CSS and JavaScript]], with no map or time zone [[libraries|Library]]. It started as a question and ended as a learner-facing piece of a course. The finished page has:',
    },
    {
      type: 'list',
      items: [
        'real coastlines, drawn from open geographic data rather than freehand',
        'a day and night shadow worked out from the sun’s actual position, redrawn every minute',
        'ticking local clocks for 32 cities that stay correct through summer time',
        'a ruler of time offsets above and below the map: click a number and a line moves to that column, cutting through every city in that time zone',
        'a "Jump to a city" picker, and a Live/Standard toggle that switches the offset badges between today’s real offset and the fixed standard one',
        'fixed colours, so it looks identical for every learner, and an accessibility pass',
      ],
    },
    { type: 'h', text: 'How the turns worked' },
    {
      type: 'p',
      text: 'The conversation settled into a loop almost at once, and nearly every turn followed it:',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        '**The builder points at something.** A screenshot, a colleague’s comment, or a behaviour described in plain words.',
        '**Claude diagnoses before changing anything**, and says what it thinks is going on.',
        '**One decision goes back to the builder** when it is genuinely theirs, with a recommendation attached.',
        '**Claude builds, checks and republishes** the same file, and saves it into the builder’s folder each time.',
        '**The builder tests it where it will live** and reports the next thing.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'How to use this page',
      text: 'Each step below gives you the situation and a question. Choose before you read the feedback. Some turns from the early part of the build are summarised, not quoted.',
    },
    {
      type: 'process',
      label: 'Eleven turns of the world time map',
      steps: [
        {
          title: 'Can it be done without libraries?',
          blocks: [
            { type: 'p', text: 'The builder had seen a well-known commercial time zone map and asked whether something like it could be made in plain [[HTML, JavaScript and CSS|HTML, CSS and JavaScript]], or whether it would need [[libraries|Library]]. They shared the link. Claude looked at the real page, said it was possible, and offered to build one rather than describe one.' },
            {
              type: 'quiz',
              label: 'Where should the coastlines come from?',
              title: 'Decision 1',
              data: { questions: [{
                prompt: 'The map needs the shapes of the continents. Where should they come from?',
                options: [
                  { text: 'Claude recalls them from memory and draws them', feedback: 'This is where squashed continents come from. Recalled geography is approximate.' },
                  { text: 'Real open geographic data, converted into a shape by a [[script]]', correct: true, feedback: 'Yes. This is what happened.' },
                  { text: 'You trace a map image by hand', feedback: 'Slow, and still not data.' },
                ],
                explanation: 'The coastlines came from an open dataset, turned into one shape by a script. The shadow was calculated from the sun’s position, and city times came from the browser’s own time zone support. The decision that mattered most was the first: get shapes and numbers from data and code, not from memory. [Habit 1: Decompose](habit.html?h=decompose) and [Know your reach](habit.html?h=reach) are this turn.',
              }] },
            },
          ],
        },
        {
          title: 'One small ask leads to another',
          blocks: [
            { type: 'p', text: 'The map worked. The builder began shaping it: a ruler of time offsets with a Live/Standard toggle, then a question:' },
            { type: 'quote', text: 'Should the standard gmt filter change the card as well?', cite: 'The builder' },
            {
              type: 'quiz',
              label: 'What should the toggle change?',
              title: 'Decision 2',
              data: { questions: [{
                prompt: 'The Live/Standard toggle changes the ruler. The city cards also show an offset. What should happen to them?',
                options: [
                  { text: 'Nothing. They are separate.', feedback: 'Then the cards and the ruler can disagree about where a place sits.' },
                  { text: 'They should follow the same toggle, so a card and the ruler always agree', correct: true, feedback: 'Yes. That is the question the builder asked.' },
                ],
                explanation: 'Claude tied the offset badges on the cards to the same toggle. The question itself is the lesson: it asks about consistency between parts of the system, not about how any one part looks. Asking "what else does this touch?" is an engineering habit.',
              }] },
            },
          ],
        },
        {
          title: 'Describe the behaviour',
          blocks: [
            { type: 'p', text: 'The builder wanted a line on the map that moves when you click a number on the ruler.' },
            { type: 'quote', text: 'I need the line to move when I click on the scale. So it cuts through all the cities in that time zone does that make sense?', cite: 'The builder' },
            { type: 'p', text: 'Claude built it. While checking, it found a problem nobody had reported: two ruler entries (+13 and +14) landed exactly on top of -11 and -10, because of the date line. They were removed before anyone saw them.' },
            {
              type: 'quiz',
              label: 'How is a problem like this found?',
              title: 'Decision 3',
              data: { questions: [{
                prompt: 'How would you catch two labels sitting exactly on top of each other, before anyone sees them?',
                options: [
                  { text: 'Look at the page carefully', feedback: 'Two labels exactly on top of each other can look like one.' },
                  { text: 'Calculate where each label sits and check for overlaps', correct: true, feedback: 'Yes. This is what happened.' },
                  { text: 'Wait for someone to report it', feedback: 'It would be found, but later and in front of learners.' },
                ],
                explanation: 'Positions were checked as numbers, not eyeballed. Plain-English behaviour descriptions worked as a specification, and the best bug of this phase was one nobody reported. See [Habit 6: Check it where it lives](habit.html?h=verify).',
              }] },
            },
          ],
        },
        {
          title: 'White text here, dark text there',
          blocks: [
            { type: 'quote', text: 'Weirdly the artefact works with white writing which is great. But then when I open the browser as an artefact the writing of the cities are dark. Does that make sense?', cite: 'The builder, with a screenshot' },
            {
              type: 'quiz',
              label: 'What helps most in a report like this?',
              title: 'Decision 4',
              data: { questions: [{
                prompt: 'Something looks different in two places. What is the most useful thing to give Claude?',
                options: [
                  { text: 'A screenshot from each place, and a plain description of what differs', correct: true, feedback: 'Yes. The builder did this.' },
                  { text: 'A guess at the cause, to save it time', feedback: 'A wrong guess sends the diagnosis the wrong way.' },
                  { text: 'Nothing. It should be able to see it.', feedback: 'It can only see what it is shown.' },
                ],
                explanation: 'Browser buttons do not inherit the page’s text colour by default, and the preview and standalone page behaved differently. A one-line reset fixed it. A screenshot from the real context beat any amount of guessing: the diagnosis was the work, the fix was one line.',
              }] },
            },
          ],
        },
        {
          title: 'Making it fit the course',
          blocks: [
            { type: 'p', text: 'The page was going into a course platform. The builder asked for the colours to be fixed so they would not change with each learner’s device settings.' },
            {
              type: 'quiz',
              label: 'Should it follow the device theme?',
              title: 'Decision 5',
              data: { questions: [{
                prompt: 'Most pages follow each person’s light or dark setting. Should this one?',
                options: [
                  { text: 'Yes. It is the polite default.', feedback: 'Usually, yes. Here, the destination changes the answer.' },
                  { text: 'No. Every learner should see the same thing, so fix the colours on purpose', correct: true, feedback: 'Yes. The destination drove the design.' },
                ],
                explanation: 'The builder chose a dark look, Claude removed the system theme switching, and a comment in the file says why. This is hardcoding on purpose, and it is the right call here. See [Habit 3: Keep what changes apart](habit.html?h=separate).',
              }] },
            },
          ],
        },
        {
          title: 'The accessibility review',
          blocks: [
            { type: 'p', text: 'The builder ran an accessibility review against the live page. It reported 1 critical problem (the keyboard focus ring had been removed from the map’s small dots), 3 major ones (card borders too faint, selection state not exposed to assistive technology, the tooltip not announced) and 3 minor ones.' },
            {
              type: 'quiz',
              label: 'What now?',
              title: 'Decision 6',
              data: { questions: [{
                prompt: 'There are seven findings and launch is close. What is a sensible plan?',
                options: [
                  { text: 'Fix all seven before doing anything else', feedback: 'Thorough, but it delays everything for the least important findings.' },
                  { text: 'Fix the critical and major findings now, and write down the minor ones for before launch', correct: true, feedback: 'Yes. This is what happened.' },
                  { text: 'Fix nothing, since it works', feedback: 'It does not work for people who navigate by keyboard.' },
                ],
                explanation: 'Four were fixed, three were logged under "before production". The contrast ratios were calculated, not estimated, and the audit was described honestly: a static code check, not a test with a screen reader. Triage beats perfection, as long as what you deferred is written down.',
              }] },
            },
          ],
        },
        {
          title: 'A quality check round: "confirm what you understand"',
          blocks: [
            { type: 'p', text: 'A colleague’s example file had a good idea: a dropdown list of cities, so users would not have to scroll. The builder also wanted a line of explanatory text removed as noise for learners.' },
            { type: 'quote', text: 'Before you do anything, can you confirm what you understand?', cite: 'The builder' },
            { type: 'p', text: 'Claude read the file and restated it: one dropdown and one readout panel, which would replace the multi-city view. It flagged that trade-off, proposed an alternative, and changed nothing.' },
            { type: 'quote', text: 'No we don’t want to replace being able to see multiple places on the map.', cite: 'The builder' },
            {
              type: 'quiz',
              label: 'What made that possible?',
              title: 'Decision 7',
              data: { questions: [{
                prompt: 'What did one extra message at the start save?',
                options: [
                  { text: 'A wrong feature being built, and then undone', correct: true, feedback: 'Yes. The misunderstanding came out while it was still free to correct.' },
                  { text: 'Nothing, since Claude would have got it right anyway', feedback: 'It replaced a feature the builder wanted to keep. The restatement is what exposed that.' },
                ],
                explanation: 'This is the most reusable line in the whole build. See [Habit 4: Say what it should do](habit.html?h=specify).',
              }] },
            },
          ],
        },
        {
          title: 'A better idea',
          blocks: [
            { type: 'p', text: 'The builder asked Claude to explain its idea again, then offered their own: keep the full city grid, but put it behind an optional toggle, and add the dropdown beside the clock.' },
            {
              type: 'quiz',
              label: 'Whose idea wins?',
              title: 'Decision 8',
              data: { questions: [{
                prompt: 'Claude has suggested something. You think of something different. What do you do?',
                options: [
                  { text: 'Go with Claude’s. It is the expert.', feedback: 'You would lose a good idea. It knows the options, you know the learners.' },
                  { text: 'Say what you are thinking, and ask it to compare the two, with reasons', correct: true, feedback: 'Yes. The comparison is where the better design came from.' },
                  { text: 'Insist on yours without hearing its reasons', feedback: 'You might miss a real problem it has spotted.' },
                ],
                explanation: 'Claude’s reply was that this was a sharper idea than its own, and it built on it. The user’s idea beat the AI’s first one, and the AI said so. See [Habit 5: Work with it like a colleague](habit.html?h=colleague).',
              }] },
            },
          ],
        },
        {
          title: 'It works in the preview, not in the course',
          blocks: [
            { type: 'quote', text: 'Weirdly in rise the accordion doesn’t work in rise. It just shows the cities by default. Any idea?', cite: 'The builder' },
            {
              type: 'quiz',
              label: 'What does the builder say next?',
              title: 'Decision 9',
              data: { questions: [{
                prompt: 'The list works in your preview but shows open in the course platform. What is your best move?',
                options: [
                  { text: 'Describe what you see in the real place and ask for a diagnosis', correct: true, feedback: 'Yes. Only you can see the real destination.' },
                  { text: 'Assume it is a Claude bug and start again', feedback: 'You would discard working code over an environment difference.' },
                  { text: 'Tell Claude which line to change', feedback: 'You would be guessing.' },
                ],
                explanation: 'The hidden state relied on a browser default that embedded platforms often override. Claude replaced it with a rule the page owns. It said clearly that the cause was inferred, not directly observed, and that the same mechanism could affect two other elements. It was fixed and confirmed in the platform. Test where it will live. See [Habit 6](habit.html?h=verify).',
              }] },
            },
          ],
        },
        {
          title: 'Which city is selected?',
          blocks: [
            { type: 'p', text: 'Testers wanted it clearer which city is selected. The builder offered two ways and asked "Which one makes sense to you?". One was to grey out the other dots. The other was to give the clicked city its own colour. On the map, a dot’s brightness already shows whether it is daytime there.' },
            {
              type: 'quiz',
              label: 'Which approach, and why?',
              title: 'Decision 10',
              data: { questions: [{
                prompt: 'Dots already carry meaning: where a city is, and dimmer when it is daytime. How should the selected city stand out?',
                options: [
                  { text: 'Grey out all the others', feedback: 'That adds a third meaning to the dots and makes 31 cities look switched off, against the point of seeing everyone at once.' },
                  { text: 'Make the selected dot stand out with a halo and a small size increase', correct: true, feedback: 'Yes. No new colour to confuse, and nothing else is dimmed.' },
                  { text: 'Change the selected dot to a random bright colour', feedback: 'A new colour needs contrast checks and competes with the others.' },
                ],
                explanation: 'Claude argued from the page’s own rules, which is the strongest kind of argument. All three entry points (clicking a dot, a card, or the picker) went through one function, so a change in one place lit the same dot everywhere.',
              }] },
            },
          ],
        },
        {
          title: 'The duplicate +3 in October',
          blocks: [
            { type: 'quote', text: 'can you see the difference in the reference numbers? On live, plus 3 happens twice but on standard plus 3 only appears once, which seems right', cite: 'The builder, with two screenshots' },
            {
              type: 'quiz',
              label: 'What was wrong?',
              title: 'Decision 11',
              data: { questions: [{
                prompt: 'In autumn, two ruler positions showed the same number. It had looked fine in September. What kind of problem is this?',
                options: [
                  { text: 'A typing mistake in the code', feedback: 'It was invisible all of September, so it is not a simple typo.' },
                  { text: 'A muddled idea: a position on the globe versus a city’s clock', correct: true, feedback: 'Yes. A position never changes with summer time. A city’s clock does.' },
                  { text: 'A fault in the browser', feedback: 'The browser was reporting correct times.' },
                ],
                explanation: 'Each tick sits on a fixed meridian, but Live mode wrote a representative city’s current offset on it. Europe was still on summer time, so one city read a number that collided with another. The fix was to make the ruler show the fixed number always and let the toggle drive the city badges only. Some bugs only exist at certain times of year, so test time-dependent logic across the calendar.',
              }] },
            },
          ],
        },
      ],
    },
    { type: 'h', text: 'What nearly went wrong' },
    {
      type: 'compare',
      caption: 'Five near misses and what would have caught them sooner',
      head: ['What happened', 'How it was found', 'What would have caught it earlier'],
      rows: [
        ['Dark text unreadable in the standalone page', 'The builder’s screenshot', 'Opening the standalone file as well as the preview'],
        ['Ruler entries landing on top of others', 'A numeric check before shipping', 'Already caught early: this is the right habit'],
        ['Duplicate labels in October', 'The builder, from a screenshot', 'Testing date-dependent logic on several dates, not only today'],
        ['List showing open inside the course platform', 'The builder testing in the platform', 'A quick test in the real [[embed]] before calling it done'],
        ['One very long line of map data in the page file', 'Tool errors while editing', 'Keeping large generated data in its own file and adding it at build time'],
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'What to take away',
      text: 'None of this needed the builder to write code. It needed them to decompose the idea, to ask for rules rather than pictures, to describe behaviour and limits in plain words, to treat Claude as a colleague, and to check the result where it would live. The habits are the work.',
    },
    {
      type: 'journal',
      name: 'hb-case-world-time-map',
      title: 'Your turn',
      prompts: [
        { prompt: 'Which decision in this case would you have got wrong, and why?' },
        { prompt: 'Which one habit do you most want to practise on your next build?' },
        { prompt: 'What is one thing you want to make that your authoring tool cannot?' },
      ],
    },
  ],
};

export const CASES = [WORLD_TIME_MAP];
export function findCase(id) {
  return CASES.find((c) => c.id === id);
}
