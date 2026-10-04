// The reach check and the six habits. Each page body lives in `blocks`.
// A habit with no blocks yet is marked `ready: false` and shows a placeholder.

export const REACH = {
  id: 'reach',
  short: 'Reach',
  number: 0,
  title: 'Know your reach',
  question: 'What can my Claude actually touch?',
  summary: 'Two people can use the same model and get very different results. The difference is often what it can reach.',
  ready: false,
  blocks: [],
};

export const HABITS = [
  {
    id: 'decompose',
    short: 'Decompose',
    number: 1,
    title: 'Decompose',
    question: 'What is it made of, and where does each part come from?',
    summary: 'Break an idea into its parts and decide where each one comes from before anything is built.',
    ready: false,
    blocks: [],
  },
  {
    id: 'derive',
    short: 'Derive',
    number: 2,
    title: 'Derive, don’t draw',
    question: 'Can a rule make this, instead of me making each one?',
    summary: 'A picture shows one answer. A rule produces every answer, and stays right when things change.',
    ready: false,
    blocks: [],
  },
  {
    id: 'separate',
    short: 'Keep apart',
    number: 3,
    title: 'Keep what changes apart',
    question: 'If this changes, how many places do I touch?',
    summary: 'Keep content, behaviour and looks separate, so a change in one is not a hunt through all three.',
    ready: false,
    blocks: [],
  },
  {
    id: 'specify',
    short: 'Specify',
    number: 4,
    title: 'Say what it should do, and what it must not break',
    question: 'How would I describe this to a colleague who is going to build it?',
    summary: 'Plain words about behaviour and limits are a specification. Ask it to repeat back what it understood.',
    ready: false,
    blocks: [],
  },
  {
    id: 'colleague',
    short: 'Colleague',
    number: 5,
    title: 'Work with it like a colleague',
    question: 'What do I want its opinion on, and what is my decision?',
    summary: 'Ask for a diagnosis before a change, ask what it would pick and why, then decide yourself.',
    ready: false,
    blocks: [],
  },
  {
    id: 'verify',
    short: 'Check',
    number: 6,
    title: 'Check it where it lives',
    question: 'How will I know it works for the person who uses it?',
    summary: 'Check with numbers, test in the real destination and across dates, and write down what you left for later.',
    ready: false,
    blocks: [],
  },
];

export const ALL_TOPICS = [REACH, ...HABITS];

export function findTopic(id) {
  return ALL_TOPICS.find((t) => t.id === id);
}
