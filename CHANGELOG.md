# Changelog

All notable changes are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] - Unreleased

### Fixed
- Customiser: the sticky preview no longer slides over the contrast checks or traps the scroll wheel. Contrast and export now sit below the whole layout, and a live contrast summary sits beside the preview. A browser test covers it.
- `lk-stepper` with many steps or long names no longer squashes its labels: it goes compact (current label only, others kept for screen readers) when there are more than five steps.

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
- Customiser at `/customiser/`: start from any theme, edit tokens with a live preview and contrast checks, export CSS. Export logic in `core/customise.js`.
- Theme gallery at `/gallery/`, and `data-lk-mode="light"` plus `color-scheme` so native controls follow the mode.
- `contrast` (AAA), `bold` and `soft` themes.
- `clean` theme: a modern, rounded look in light and dark, added with no component changes.
- Examples, documentation and unit tests for core helpers.
