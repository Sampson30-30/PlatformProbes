# Platform roadmap

Working title: **Build What Rise Can't**. A change of title is a one-line edit.

## Why this exists

Colleagues who author in Rise are asking for help building things Rise cannot do. The tool is not the obstacle. The obstacle is a way of thinking. An authoring tool decides what is possible and you pick from it. Code, with Claude doing the typing, lets you decide what is possible, but only if you think like an engineer: break the thing down, source what you need, write a rule instead of drawing a picture, and check the result where it will live.

So this platform does not teach Claude, syntax or any one tool. It teaches a way of working, and it shows what that way of working makes possible.

## Who it is for

Learning designers and teachers at HoW who know Rise well, are curious about building with Claude, and have a real thing they want to make. They are experts in teaching, not in code. The platform should respect that and use it.

## What success looks like

A colleague who has used it can take a new, unfamiliar brief and ask the questions an engineer would ask before building anything. We measure that, not page views:

- a self-assessment of the six habits before and after (kept on their own device)
- the brief builder, used on a brief of their own, as the transfer test

## What it is not

- Not a Claude Code manual or a prompt cookbook.
- Not a syntax course. People will never write code better or faster than Claude can.
- Not a Rise migration guide. Rise appears only as a familiar point of comparison.
- Not a place for anything internal or about named colleagues. **This repository is public.**

## The shape

**Before you start: know your reach.** What can your Claude actually touch? A chat that cannot fetch data or run code recalls from memory. One that can will source and check. This is the first lever, and the biggest difference between two people using the same model.

**Six habits.** Each habit is a question you ask, a move you make, a worked example from a real build, a short practice, and the words to say to Claude.

1. **Decompose.** What is it made of, and where does each part come from?
2. **Derive, don't draw.** Can a rule make this, instead of me making each one?
3. **Keep what changes apart.** If this changes, how many places do I touch?
4. **Say what it should do, and what it must not break.** Describe behaviour in plain words, state the limits, and ask it to confirm what it understood.
5. **Work with it like a colleague.** Ask for a diagnosis before a change, ask for its opinion, then decide.
6. **Check it where it lives.** Verify with numbers, test in the real destination and across dates, say what is inferred rather than verified, and write down what you deferred.

**A case file.** One real build, turn by turn, with the thinking exposed: the world time map. Learners meet the decisions and choose before they see what happened.

**A gallery of what code can do.** Things an authoring tool cannot do, each broken down into what it is made of and the rule behind it. It is there to inspire, and it makes habit 1 and habit 2 visible.

**A brief builder.** A guided worksheet that turns an idea into an engineer's brief: what it is made of, where each part comes from, the rule, the limits, where it lives and how to check it. The output is a brief to give to Claude. It is the transfer test.

**Words.** A short plain-English vocabulary (source of truth, hardcoded, dependency, constraint, edge case and so on) with what each costs you when ignored and what to say to Claude. Concepts are taught as moves, with the name attached afterwards.

**A coach's guide.** For whoever runs sessions: how to use each part, questions to ask, and what good looks like.

## Principles

1. **Practise, don't just read.** Every habit has something to decide or do. Reading is the thin layer between.
2. **Plain English first, name second.**
3. **Their expertise is the bridge.** Learning outcomes, cognitive load and accessibility are already engineering questions in disguise.
4. **Content is data, not markup.** Pages render from data files, so changing wording never means touching layout. This is habit 3, practised by the platform itself.
5. **Built from LearnKit.** The platform dogfoods the library. Where it needs something LearnKit lacks, that is a finding to record.
6. **Honest about limits.** Say what is inferred, what was tested and what was not.
7. **British English. No em dashes.** The content tests enforce the second one.
8. **Static files, no build step, no accounts, nothing leaves the device.** Progress is stored locally.

## Stages

Each stage ends with working, tested pages, a commit and a push.

- [x] **0. This roadmap.**
- [x] **1. Foundations.** Shell (navigation, layout, theme), a small renderer that turns content data into pages, the content format, content tests (structure, links, British English, no em dashes, valid quiz and scenario data), README.
- [x] **2. Reach and the six habits.** All seven pages, each with idea, example, practice, "say this to Claude" and a reflection prompt.
- [ ] **3. Case file: the world time map.** A stepped story of the build with decision points, written from the build account and free of colleague details and internal references.
- [ ] **4. Gallery.** Eight things code can do, each decomposed, with two small live demos built for the purpose.
- [ ] **5. Brief builder.** Guided worksheet with a quality check and an export.
- [ ] **6. Words.** Searchable plain-English vocabulary and phrasebook.
- [ ] **7. Progress and coach's guide.** Before and after self-assessment, a progress view, and the guide for whoever runs sessions.
- [ ] **8. Review.** Accessibility pass, responsive check, content read-through against the principles, and a list of what is unverified.

## Decisions I have made, for you to overturn

- **A separate branch** (`platform`), built on `learnkit`, so the library's history stays clean.
- **Theme: `clean`.** It is friendly and modern, and it is a real test of LearnKit. A HoW-branded theme is a possible later stage, with one catch: the HoW Digital identity uses its bright accents as fills with dark text and forbids them as text colours, but LearnKit's token contract has one `primary` colour for both jobs. Supporting that means a small contract extension (an accent fill and the text that sits on it).
- **Fonts:** system fonts only, so nothing external loads.
- **No colleague is named or described.** The case file uses only your own words and the build decisions.
- **No brand assets** (logos) are copied into a public repository.

## Open questions

- The brief for the transfer test. We agreed to come back to this. The brief builder works without one.
- Where this will be hosted. It is static files, so any web server will do, including the .NET estate's.
- Whether LearnKit components work inside a Rise code block. Not needed here, and untested.
- Whether to mirror this plan into ClickUp. I have not touched ClickUp.
