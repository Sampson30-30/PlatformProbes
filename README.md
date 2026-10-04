# LearnKit

Dependency-free Web Components for interactive learning content. No framework, no build step: add a script and a stylesheet, then write HTML.

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

Planned: quiz, reflection journal, comparison spectrum, timeline, grid explorer, rating tool and step-by-step process.

## Principles

- **No dependencies and no build step.** Plain ES modules and CSS.
- **Accessible by default.** Keyboard support, ARIA roles, visible focus, reduced motion respected.
- **Themeable with CSS variables.** Override any `--lk-*` token. See [docs/theming.md](docs/theming.md).
- **Light DOM.** Style with ordinary CSS. Content stays readable by search engines and assistive technology.
- **Content as markup or data.** Authors do not need to write JavaScript.

## Try it

```sh
npm start        # serves the repo at http://localhost:8080
# then open /examples/
npm test         # unit tests for the pure helpers
```

## Documentation

- [Getting started](docs/getting-started.md)
- [Theming](docs/theming.md)
- [Contributing](CONTRIBUTING.md)

## Licence

[MIT](LICENSE)
