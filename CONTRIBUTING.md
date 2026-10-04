# Contributing

Thanks for helping. LearnKit aims to stay small, dependency-free and accessible.

## Ground rules

- No runtime dependencies and no build step required to use the library.
- Components extend `LkElement` (`src/core/base.js`), use the light DOM, and register with the `lk-` prefix.
- Every component must be fully keyboard operable and expose sensible ARIA roles.
- Style only through `--lk-*` tokens so theming keeps working. Component CSS goes in the `lk.components` layer and must not hard-code colours, radii or borders.
- Emit `lk-<name>` events for meaningful learner actions.
- Put DOM-free logic in `src/core/utils.js` (or a similar module) and add a Node test for it.

## Adding a component

1. Create `src/lk-<name>.js` and export the class, registering it with `define()`.
2. Add its styles to `src/learnkit.css`.
3. Export it from `src/index.js`.
4. Add an example to `examples/index.html` and a section to `docs/getting-started.md`.
5. Add an entry to `CHANGELOG.md`.

## Running locally

```sh
npm start   # http://localhost:8080/examples/
npm test
```

## Pull requests

Keep them focused, describe what changed and why, and include a screenshot or short recording for visual changes.
