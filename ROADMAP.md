# Roadmap

LearnKit is a free UI shop: a set of components that are not the standard UI libraries, plus a way to pick a look and make it your own. It has three layers.

- **Components** do the work. Core primitives are general-purpose and usable on any site. Learning components are built on top of them and are what make the library distinctive.
- **Themes** are complete skins. Any component can wear any theme.
- **Customiser** helps people choose a theme and adjust it to suit them.

This is a plan, not a promise. Order and scope may change.

## Layer 1: Core primitives

- [x] Tabs
- [x] Accordion
- [x] Modal dialog (focus trapping, Escape to close, focus return)
- [ ] Tooltip and popover
- [ ] Toast notifications
- [ ] Buttons and badges
- [ ] Form controls: text field, select, checkbox and radio groups, slider
- [ ] Progress bar and stepper

## Layer 2: Learning components

- [ ] Quiz and knowledge check
- [ ] Reflection journal with export
- [ ] Comparison spectrum
- [ ] Rating or self-assessment tool
- [ ] Timeline
- [ ] Grid explorer
- [ ] Step-by-step process
- [ ] Scenario or branching

## Layer 3: Themes and customisation

- [x] Theme structure: cascade layers, `data-lk-theme` and `data-lk-mode`, token contract (see [docs/theming.md](docs/theming.md))
- [x] Theme: Homepage (mid 1990s document web, light and dark)
- [x] A second theme that looks very different from Homepage (`clean`). This was the test that components are skin-agnostic. It needed no component changes.
- [ ] More themes, each documented and contrast-checked in light and dark
- [ ] Theme gallery: a static page showing every component in every theme, side by side
- [ ] Customiser: pick a theme, change tokens with live preview, warn on failing contrast, export the CSS

## Suggested build order

1. Accordion and modal, to prove the primitives pattern beyond tabs. Each one is styled in both themes as it lands.
2. The second theme, as soon as there are two components, to prove the skin split.
3. Quiz, the first learning component.
4. Reflection journal, which exercises persistence and export.
5. Theme gallery, once there are several components and themes to show.
6. Customiser, last. It is the largest piece and depends on a stable token contract.
7. The remainder, prioritised by demand.

## Shared decisions

- **Naming:** `lk-` tag prefix, attributes for simple configuration, properties for data, `lk-*` events.
- **Accessibility:** target WCAG 2.1 AA. Each component documents its keyboard and screen reader behaviour.
- **Theming:** components read only `--lk-*` tokens. Anything tokens cannot express (bevels, unusual shapes) goes in a theme file, using the component's classes as the public styling API. Learning components inherit the look of the primitives.
- **Layers and scoping:** LearnKit CSS lives in `lk.tokens`, `lk.components` and `lk.theme` cascade layers. Themes are scoped by `data-lk-theme`, so several can share a page.
- **Content as data:** learning components accept JSON as well as markup, so tooling can be built on top later.
- **Testing:** Node tests for logic, plus a browser test for each component.
- **No dependencies and no build step** for consumers. The gallery and customiser will also be plain HTML, CSS and JavaScript.
