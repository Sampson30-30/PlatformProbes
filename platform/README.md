# Build What Rise Can't

A small site that teaches an engineering way of working to people who build learning content, so they can make things an authoring tool cannot. Read [the roadmap](ROADMAP.md) for the thinking behind it.

## Run it

```sh
npm start        # then open http://localhost:8080/platform/
npm test         # checks the content as well as the code
```

## How it is built

- Plain HTML, CSS and JavaScript modules, using [LearnKit](../README.md) for its interactive parts. No build step.
- **Content is data.** Everything the learner reads lives in `data/`. Pages in `pages/` turn that data into DOM through `assets/blocks.js`. To change wording, edit a data file and never a page.
- `lib/text.js` turns the small inline markup (`**bold**`, `` `code` ``, `[link](page.html)`) into safe HTML. Content can never inject markup.
- `lib/content.js` describes the content blocks and checks them. The tests use it so that a mistake in a data file fails loudly.

## Checks you run in a browser

Open `http://localhost:8080/test/browser/platform.html` once with your browser set to light and once to dark. It opens every page at desktop and phone width, before and after using the interactive parts, and checks structure, headings, names, sideways scrolling and text contrast. `FINDINGS.md` records what building this taught us about LearnKit.

## Content rules, enforced by `npm test`

- British English, and no em dashes.
- Every quiz and scenario must parse with no problems.
- Every internal link must point at a real page.
- A page marked `ready: false` is hidden from the navigation until it exists.

## Adding a page of content

1. Add or edit the data in `data/`.
2. Use only the block types in `lib/content.js`. Add a new one in both `lib/content.js` and `assets/blocks.js`.
3. Run `npm test`.

## Plain-English help

Everyone who uses this site is assumed to have no developer background. Three things keep it readable:

- **An "About this page" panel on every page**, straight after the main heading: what the page is, then what you can do on it. The wording lives in `data/help.js`. For habit and case pages the list of things to do is worked out from the blocks the page contains, so it cannot promise something the page does not have. A reader can close the panel, and it stays closed on that page.
- **A short hint above the first quiz, journal, chart and so on** ("How this works"). Set `help: "text"` on a block to change its hint, or `help: false` to remove it.
- **Technical words link to their plain meaning.** Write `[[script]]`, or `[[HTML|HTML, CSS and JavaScript]]` to show different words from the entry's name. The link goes to that entry on the Words page.

Tests (`test/platform-help.test.js`, `test/plain-english.test.js`) enforce it: every page has the panel, helper text uses none of the words listed in `test/plain.js` (framework, dependency, markup and so on), sentences stay short, every `[[link]]` points at a real entry, and a page that uses a technical word must link it at least once.
