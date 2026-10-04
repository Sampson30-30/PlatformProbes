# Roadmap

LearnKit has two layers. Core primitives are general-purpose and usable on any site. Learning components are built on top of them and are what make the library distinctive.

This is a plan, not a promise. Order and scope may change.

## Layer 1: Core primitives

- [x] Tabs
- [ ] Accordion
- [ ] Modal dialog (focus trapping, Escape to close, focus return)
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

## Suggested build order

1. Accordion and modal, to prove the primitives pattern beyond tabs.
2. Quiz, the first learning component.
3. Reflection journal, which exercises persistence and export.
4. The remainder, prioritised by demand.

## Shared decisions

- **Naming:** `lk-` tag prefix, attributes for simple configuration, properties for data, `lk-*` events.
- **Accessibility:** target WCAG 2.1 AA. Each component documents its keyboard and screen reader behaviour.
- **Theming:** all styling goes through `--lk-*` tokens, so learning components inherit the look of the primitives.
- **Content as data:** learning components accept JSON as well as markup, so tooling can be built on top later.
- **Testing:** Node tests for logic, plus a browser test for each component.
- **No dependencies and no build step** for consumers.
