// Words and structure for the home page.

export const HOME = {
  lede: 'Rise decides what you can build. Code lets you decide, and Claude does the typing. What stops most people is not the tool. It is a way of thinking that engineers use without noticing. This site makes that way of thinking visible, and gives you things to practise it on.',
  start: { label: 'Start with your reach', href: 'habit.html?h=reach' },
  blocks: [
    {
      type: 'h',
      text: 'Who this is for',
    },
    {
      type: 'p',
      text: 'You know how to teach and how to design learning. You may have used Rise for years. You do not need to learn to write code, and you will not be asked to. You need to learn what to ask for, what to expect and what to check.',
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Why the thinking matters more, not less',
      text: 'You can build with plain language now, and that is exactly why it is easy to build the wrong thing, fast. The model will happily make what you asked for. These habits help you ask for the right thing, and notice when you did not get it.',
    },
    {
      type: 'h',
      text: 'Is it a Rise job or a build job?',
    },
    {
      type: 'p',
      text: 'Most of the time, Rise is the right answer, and this site is not trying to talk you out of it. The point is to know when it is not. Think of something you want to make and answer honestly.',
    },
    {
      type: 'flow',
      label: 'Should you use Rise or build it?',
      layout: 'tree',
      walkthrough: true,
      items: [
        {
          text: 'Is it mostly things to read, watch and answer simple questions about?',
          branches: [
            {
              label: 'Yes',
              items: [{ text: 'Use Rise', detail: 'Rise is built for exactly this, and it is quick. Building it yourself would cost time and add something to maintain, for no gain.' }],
            },
            {
              label: 'No',
              items: [
                {
                  text: 'Does it need live data, a calculation, or an interaction Rise has no block for?',
                  branches: [
                    {
                      label: 'Yes',
                      items: [{ text: 'Build it: it needs something Rise cannot do', detail: 'Rise cannot fetch real information, work things out, or invent a new kind of interaction. A build can, and can check its own answers. The world time map is an example: it has to know the real time in each place, all year. Look at the gallery for ideas, then use the brief builder to say what you want.' }],
                    },
                    {
                      label: 'No',
                      items: [
                        {
                          text: 'Will many courses use it, and does it need to stay in step?',
                          branches: [
                            {
                              label: 'Yes',
                              items: [{ text: 'Build it once, and reuse it', detail: 'One source with the wording in one place beats the same block copied into many courses and fixed by hand. This is the habit of keeping what changes apart.' }],
                            },
                            {
                              label: 'No',
                              items: [{ text: 'Use Rise', detail: 'Nothing here needs a build. Use Rise, and come back when you hit something it cannot do.' }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  habitsIntro: 'Six habits, each a question you can ask before, during or after building. Pick any tile to see the question and open the habit.',
  pathTitle: 'A way through',
  pathIntro: 'You can dip in anywhere. If you want an order:',
};
