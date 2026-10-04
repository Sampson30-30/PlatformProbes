export const verifyBlocks = [
  { type: 'h', text: 'The idea' },
  {
    type: 'p',
    text: '"It looks right" is a start, not a finish. Check with numbers where you can: positions, totals, contrast ratios. Test in the place it will really live, not only in your preview. Test across the things that change, such as dates and devices. And be honest about what you checked and what you only believe.',
  },
  {
    type: 'p',
    text: 'You will never check everything. So **triage**: fix what stops people now, and write down what you left for later and where that note will be found.',
  },
  {
    type: 'compare',
    caption: 'You already know this from Rise',
    head: ['', 'Where it looked right', 'Where it can still fail'],
    rows: [
      ['Preview', 'On your screen, today', 'In the published course, on a learner’s device'],
      ['Published', 'In your browser', 'In a different browser, at a different time of year'],
    ],
  },
  { type: 'h', text: 'In the world time map' },
  {
    type: 'p',
    text: 'Five things nearly or actually went wrong. Each was caught by something different, and the last column is the useful one.',
  },
  {
    type: 'grid',
    label: 'What went wrong and what would catch it earlier',
    columns: 2,
    cells: [
      { title: 'Ticks on top of each other', body: 'Two entries on the ruler landed exactly on top of two others, because of the date line. **Caught by** checking positions as numbers, before anyone saw it. This is the habit working.' },
      { title: 'Unreadable button text', body: 'Dark text on a dark page, but only in the standalone file. **Caught by** a screenshot from the person using it. **Would catch it sooner:** opening the standalone file as well as the preview.' },
      { title: 'It worked in preview, not in the course platform', body: 'A list showed open when it should have been closed. The cause was inferred (the platform ignores a browser default), and the fix worked. **Would catch it sooner:** a quick test in the real [[embed]]. And note the honesty: inferred, not verified.' },
      { title: 'A duplicate label in October', body: 'Two ruler entries showed the same number, but only in autumn. **Would catch it sooner:** testing against several dates (January, April, July, October), not only today.' },
      { title: 'An accessibility review', body: 'One critical and three major problems were fixed, and three minor ones written down for before launch. The review was described honestly as a code check, not a test with a screen reader.' },
    ],
  },
  { type: 'h', text: 'Practice' },
  {
    type: 'scenario',
    label: 'Ready to go live?',
    data: {
      start: 'start',
      nodes: {
        start: {
          title: 'Launch is next week',
          text: 'Your interactive resource works perfectly in your preview, and Claude has just said it is finished. It will be used inside a course platform on learners’ own devices.',
          choices: [
            { text: 'It works and Claude says it is done. Ship it.', goto: 'ship' },
            { text: 'Ask Claude exactly what it has checked, and what it has assumed', goto: 'ask' },
          ],
        },
        ship: {
          title: 'Launch day',
          text: 'Two learners say the text is unreadable on their phones, and a menu that should start closed starts open. You find out from them.',
          end: true,
          outcome: 'poor',
        },
        ask: {
          title: 'An honest answer',
          text: 'Claude says it checked the layout in a desktop browser and computed the colour contrast. It has not tested inside the course platform, on a phone, or with a screen reader.',
          choices: [
            { text: 'Test in the real platform on a phone, and write down anything left over', goto: 'test' },
            { text: 'Decide the gaps do not matter', goto: 'risk' },
          ],
        },
        test: {
          title: 'Found early',
          text: 'In the platform, the menu is open by default. You report it, Claude diagnoses and fixes it, and you note that the cause was inferred and the fix confirmed by testing. You also list the screen reader test under "before launch".',
          end: true,
          outcome: 'good',
        },
        risk: {
          title: 'A gamble',
          text: 'It may well be fine. But you chose to gamble, and no one wrote down what was left unchecked.',
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
      'What have you actually checked, and what are you assuming?',
      'Check these numbers by calculating them, not by looking.',
      'Test this on several dates: January, April, July and October.',
      'List what is left to do before this goes live, in order of how much it matters.',
    ],
  },
  {
    type: 'callout',
    tone: 'warning',
    title: 'The usual slip',
    text: 'Treating "done" as evidence. A model saying it is finished tells you what it believes, not what it checked. Ask what it ran, what it looked at, and what it did not.',
  },
  {
    type: 'journal',
    name: 'hb-verify',
    title: 'Your checklist',
    prompts: [
      { prompt: 'Where will your thing really live, and who will use it?' },
      { prompt: 'What changes over time or between devices that you should test against?' },
      { prompt: 'What would you write down as "not yet checked"?' },
    ],
  },
];
