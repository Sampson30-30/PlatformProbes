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
