# Changelog

All notable changes are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] - Unreleased

### Added
- Project foundation: `LkElement` base class, utilities, design tokens and base stylesheet.
- `<lk-tabs>` component.
- `<lk-accordion>` component, with Homepage theme styling.
- `<lk-modal>` component, built on native `<dialog>`, with Homepage theme styling.
- Theme structure: cascade layers (`lk.tokens`, `lk.components`, `lk.theme`), `data-lk-theme` and `data-lk-mode` attributes, and a wider token contract.
- `homepage` theme, based on the Homepage design system.
- `<lk-timeline>`, `<lk-grid-explorer>`, `<lk-process>` and `<lk-scenario>`.
- `<lk-spectrum>` comparison spectrum and `<lk-rating>` self-assessment.
- `<lk-journal>` reflection journal with autosave, copy and download.
- `<lk-quiz>` knowledge check from markup or JSON, with scoring logic in `core/quiz.js`.
- `toast()` and `<lk-toasts>` notifications.
- `<lk-tooltip>` and `<lk-popover>`, with `core/position.js` for placement.
- `<lk-progress>` and `<lk-stepper>`.
- `<lk-field>` and `<lk-choices>` form controls with labels, hints, errors and validation.
- `.lk-button` and `.lk-badge` classes, status colour tokens (`success`, `warning`, `danger`, `info`), and `core/contrast.js`.
- Node tests that check every theme's contrast in light and dark, and an in-browser component test runner (`test/browser/`).
- `clean` theme: a modern, rounded look in light and dark, added with no component changes.
- Examples, documentation and unit tests for core helpers.
