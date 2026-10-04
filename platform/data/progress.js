// The self-assessment: one statement for the reach check and one for each habit.

export const PROGRESS = {
  scale: 5,
  low: 'Not yet',
  high: 'Almost every time',
  label: 'How true is each of these for you?',
  statements: [
    { habit: 'reach', text: 'I know what my Claude can reach and what it cannot.' },
    { habit: 'decompose', text: 'I break an idea into parts and decide where each one comes from before building.' },
    { habit: 'derive', text: 'I look for a rule that can produce something, instead of making each one by hand.' },
    { habit: 'separate', text: 'I keep content, behaviour and looks apart, so a change is one edit.' },
    { habit: 'specify', text: 'I describe what it should do, and what it must not break, in plain words.' },
    { habit: 'colleague', text: 'I ask Claude for a diagnosis and its view, then make the decision myself.' },
    { habit: 'verify', text: 'I check my work in the place it will live, and say what I have not checked.' },
  ],
  text: {
    intro: 'Rate yourself honestly now, before you go further. Come back after you have worked through the habits and rate yourself again. Nothing here is marked, shared or sent anywhere. It is for you.',
    afterIntro: 'Once you have worked through some of the habits and used the brief builder on an idea of your own, rate yourself again here.',
    compareIntro: 'Your two sets of ratings, side by side.',
    caveat: 'A score can go down after you learn more. You now know what you did not know, and that is progress too. Look at the habits where it moved and ask why.',
    journalsIntro: 'The reflections you have written on this device.',
    nothingYet: 'Rate yourself in both sections to see the comparison.',
  },
  journals: [
    { name: 'hb-reach', label: 'Know your reach', href: 'habit.html?h=reach', prompts: 3 },
    { name: 'hb-decompose', label: 'Decompose', href: 'habit.html?h=decompose', prompts: 3 },
    { name: 'hb-derive', label: 'Derive, don’t draw', href: 'habit.html?h=derive', prompts: 3 },
    { name: 'hb-separate', label: 'Keep what changes apart', href: 'habit.html?h=separate', prompts: 3 },
    { name: 'hb-specify', label: 'Say what it should do', href: 'habit.html?h=specify', prompts: 3 },
    { name: 'hb-colleague', label: 'Work with it like a colleague', href: 'habit.html?h=colleague', prompts: 2 },
    { name: 'hb-verify', label: 'Check it where it lives', href: 'habit.html?h=verify', prompts: 3 },
    { name: 'hb-case-world-time-map', label: 'Case file: the world time map', href: 'case.html?c=world-time-map', prompts: 3 },
  ],
};
