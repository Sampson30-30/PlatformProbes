# Findings from building the platform with LearnKit

Using the library for a real site is the best test of it. What turned up, and what was done:

| Finding | What happened | Status |
| --- | --- | --- |
| Site CSS beats LearnKit's layers | A site-wide `a { color: ... }` rule turned the text of an `<a class="lk-button">` the same colour as its background. LearnKit is in cascade layers, so any ordinary CSS wins, by design. | Site CSS now excludes `.lk-button`. Worth a line in the theming guide. |
| Stepper fell apart with many steps | An 11-step process with long step names squashed every label into a one-letter column. | Fixed in the library on the `learnkit` branch: it now goes compact above five steps. |
