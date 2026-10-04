# Findings from building the platform with LearnKit

Using the library for a real site is the best test of it. What turned up, and what was done:

| Finding | What happened | Status |
| --- | --- | --- |
| Site CSS beats LearnKit's layers | A site-wide `a { color: ... }` rule turned the text of an `<a class="lk-button">` the same colour as its background. LearnKit is in cascade layers, so any ordinary CSS wins, by design. | Site CSS now excludes `.lk-button`. Worth a line in the theming guide. |
| Stepper fell apart with many steps | An 11-step process with long step names squashed every label into a one-letter column. | Fixed in the library on the `learnkit` branch: it now goes compact above five steps. |
| Transitions made a colour check misreport | The accessibility checks reported 1.12:1 text on a selected tile in dark mode. The tile was fine: the background transition had not advanced because nothing was being painted. | Checks now switch transitions off first. Worth remembering for any automated colour test. |
| Heading levels clashed with the page | A grid on the gallery page opened a level 3 heading straight after the page's level 1. Components take a `level` attribute so the page can fit them in; I had not set it correctly. | Fixed on the page. The checks now catch a skipped heading level anywhere. |
| The interactive states are where problems hide | The static pages passed every check. Only after answering quizzes and opening tiles did the checks find anything, and both findings were about the checks themselves. | Checks run before and after use. |
| HoW Digital's identity cannot be expressed yet | It uses bright accents as fills with dark text, and forbids them as text colours. LearnKit has one `primary` colour that does both jobs, so a faithful HoW theme needs a small contract extension (an accent fill and the text on it). | Not done. Recorded in the roadmap. |
| LearnKit has not been tried inside a Rise code block | The build account says the embed overrides the bare `hidden` attribute, which LearnKit uses widely. I added explicit rules for it, but this is untested. | Open. Test before putting any component in a course. |
| A sticky panel slid over the content below it | In the customiser, the preview was sticky and scrolled on its own, so the contrast section passed underneath it and the wheel got caught inside it. Found by the user, not by a test. | Fixed on `learnkit`, with a browser test that fails on the old layout. Lesson: a sticky element needs a parent that ends where it should stop, and nothing else in that parent. |
