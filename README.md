# LearnKit

Dependency-free Web Components: accessible UI primitives, plus interactive components for learning content. No framework, no build step: add a script and a stylesheet, then write HTML.

```html
<link rel="stylesheet" href="learnkit.css" />
<script type="module" src="index.js"></script>

<lk-tabs label="Course sections">
  <div data-lk-tab="Overview">Start here.</div>
  <div data-lk-tab="Details">Go deeper.</div>
</lk-tabs>
```

## Status

Early foundation (v0.1.0). Currently included:

| Component | Description |
| --- | --- |
| `<lk-tabs>` | Accessible tabbed content with keyboard support |
| `<lk-accordion>` | Collapsible sections, one open at a time or several |
| `<lk-modal>` | Modal dialog with focus containment and focus return |

LearnKit is a free UI shop with three layers: general-purpose **core primitives** (tabs, accordion, modal and so on), **learning components** built on top of them (quiz, reflection journal, comparison spectrum, timeline and more), and **themes** that give any component a complete look. Available themes: `homepage` and `clean`. See the [roadmap](ROADMAP.md) for what is planned.

## Principles

- **No dependencies and no build step.** Plain ES modules and CSS.
- **Accessible by default.** Keyboard support, ARIA roles, visible focus, reduced motion respected.
- **Themeable.** Override any `--lk-*` token, or load a whole theme. See [docs/theming.md](docs/theming.md).
- **Light DOM.** Style with ordinary CSS. Content stays readable by search engines and assistive technology.
- **Content as markup or data.** Authors do not need to write JavaScript.

## Try it

```sh
npm start        # serves the repo at http://localhost:8080
# then open /examples/
npm test         # unit tests for helpers, plus contrast checks for every theme
# component tests run in the browser: open /test/browser/
```

## Documentation

- [Roadmap](ROADMAP.md)
- [Getting started](docs/getting-started.md)
- [Theming](docs/theming.md)
- [Contributing](CONTRIBUTING.md)

## Licence

[MIT](LICENSE)
