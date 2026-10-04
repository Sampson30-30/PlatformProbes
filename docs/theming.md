# Theming

LearnKit is themed with CSS custom properties. Override them on `:root` for the whole page, or on any wrapper to theme one section.

```css
:root {
  --lk-color-primary: #0b7a53;
  --lk-radius: 2px;
}

.dark-section {
  --lk-color-bg: #101418;
  --lk-color-text: #f1f3f5;
}
```

## Tokens

| Token | Purpose |
| --- | --- |
| `--lk-font` | Font stack |
| `--lk-color-text` | Body text |
| `--lk-color-muted` | Secondary text |
| `--lk-color-bg` | Component background |
| `--lk-color-surface` | Raised or secondary surfaces |
| `--lk-color-border` | Borders and dividers |
| `--lk-color-primary` | Accent and selected states |
| `--lk-color-primary-text` | Text on top of the primary colour |
| `--lk-color-focus` | Focus ring |
| `--lk-radius` | Corner radius |
| `--lk-space` | Base spacing |
| `--lk-transition` | Transition timing (set to `0ms` when the user prefers reduced motion) |

Dark mode follows `prefers-color-scheme` by default. To force a mode, set the tokens yourself on `:root`.

## Accessibility note

If you change colours, keep text contrast at WCAG AA (4.5:1 for body text) and keep the focus ring clearly visible.
