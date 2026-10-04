# Getting started

## 1. Add the files

Copy `src/` into your project, or reference the files directly:

```html
<link rel="stylesheet" href="/learnkit/learnkit.css" />
<script type="module" src="/learnkit/index.js"></script>
```

To load only what you need, import individual components:

```html
<script type="module" src="/learnkit/lk-tabs.js"></script>
```

## 2. Write markup

```html
<lk-tabs label="Course sections" selected="1">
  <div data-lk-tab="Overview">...</div>
  <div data-lk-tab="Details">...</div>
</lk-tabs>
```

## 3. Listen for events

Every component emits bubbling events prefixed with `lk-`, so you can track learner progress:

```js
document.addEventListener('lk-tabchange', (event) => {
  console.log(event.detail.index, event.detail.title);
});
```

## Components

### `<lk-tabs>`

| Attribute | Description |
| --- | --- |
| `selected` | Zero-based index of the initially selected tab. Default `0`. |
| `label` | Accessible name for the tab list. |

| Event | Detail |
| --- | --- |
| `lk-tabchange` | `{ index, title }` |

Keyboard: Left and Right arrows move between tabs, Home and End jump to the first and last.

Markup inside `<lk-tabs>` is plain HTML. Without JavaScript, all panels are simply visible in order.


### `<lk-accordion>`

```html
<lk-accordion label="Course topics">
  <div data-lk-item="What you will learn" open>...</div>
  <div data-lk-item="How it is assessed">...</div>
</lk-accordion>
```

| Attribute | Description |
| --- | --- |
| `multiple` | Allow several sections to be open at once. Without it, opening one closes the others. |
| `level` | Heading level for the section headings, 1 to 6. Default `3`. Pick the level that fits the page outline. |
| `label` | Accessible name for the group. |
| `open` (on a section) | Start that section expanded. |

| Event | Detail |
| --- | --- |
| `lk-toggle` | `{ index, title, open }`. In single mode a section that closes because another opened also fires its own event. |

Methods: `toggle(index)`, `open(index)`, `close(index)`, and the read-only `openIndexes`.

Keyboard: Enter and Space open or close the focused section. Up and Down arrows move between headings, Home and End jump to the first and last.

Without JavaScript, every section is simply visible in order.


### `<lk-modal>`

```html
<button type="button" data-lk-open="course-modal">Course details</button>

<lk-modal id="course-modal" heading="Course details">
  <p>Content goes here.</p>
  <div class="lk-modal__actions">
    <button type="button" data-lk-close="ok">Got it</button>
  </div>
</lk-modal>
```

It uses a native `<dialog>` opened with `showModal()`, so the browser handles the top layer, keeps focus inside and makes the page behind inert.

| Attribute | Description |
| --- | --- |
| `heading` | Visible title. It is also the dialog's accessible name. |
| `label` | Accessible name to use when there is no visible heading. |
| `level` | Heading level for the title, 1 to 6. Default `2`. |
| `static` | Do not close on a backdrop click. Use it for tasks that must be finished or dismissed. Escape and the close button still work. |
| `close-label` | Accessible name for the close button. Default `Close`. |

| Event | Detail |
| --- | --- |
| `lk-open` | `{}` |
| `lk-close` | `{ returnValue }`. `"close"` for the close button, `"dismiss"` for a backdrop click, `"cancel"` for Escape, or the value of the `data-lk-close` button used. |

Open it with any element that has `data-lk-open="<id>"`, or in script with `modal.show()`. Close it with `modal.close(value)` or any element inside with `data-lk-close`. Read the state with `modal.isOpen`.

Keyboard: Escape closes. Tab and Shift+Tab stay inside the modal. Focus starts on the close button, or on any element inside that has `autofocus`, and returns to the element that opened the modal when it closes. Put `autofocus` on the safest button of a destructive confirmation.

The modal's content is hidden until the script loads, so the trigger needs JavaScript. For content that must work without it, use a normal link to a page instead.


### Buttons and badges

These are plain CSS classes, so they work on any element and need no JavaScript.

```html
<button type="button" class="lk-button" data-variant="primary">Save changes</button>
<a href="/help" class="lk-button" data-variant="link">Read the guide</a>
<span class="lk-badge" data-tone="success">Complete</span>
```

| Class | Options |
| --- | --- |
| `lk-button` | `data-variant`: `primary`, `danger`, `link`. `data-size="small"`. Use a real `disabled` attribute on buttons. |
| `lk-badge` | `data-tone`: `primary`, `success`, `warning`, `danger`, `info`. |

Buttons are at least 40px high. Badges must contain text, so meaning never depends on colour alone. Use one primary button per view, and name buttons with verbs that say what happens.


### `<lk-field>`

Adds a label, hint and error to a native `input`, `select` or `textarea`, and wires up the ARIA.

```html
<lk-field label="Email address" hint="We will only use this to reply to your message">
  <input name="email" type="email" required />
</lk-field>
```

| Attribute | Description |
| --- | --- |
| `label` | Visible label. Always provide one: never use a placeholder as a label. |
| `hint` | Help text under the label. |
| `error` | Error message from your own validation. Remove the attribute to clear it. |

The control's own rules (`required`, `type="email"`, `pattern`, `min` and so on) are checked when it loses focus, and again while typing once a message is showing. Call `field.validate()` to check on demand, for example on submit; it returns `true` or `false`. A `required` control gets a visible "(required)" marker. Error messages begin with the word "Error:", so they never rely on colour. A `type="range"` control shows its current value.

### `<lk-choices>`

Groups checkboxes or radio buttons into a `fieldset` with a legend.

```html
<lk-choices legend="Topics of interest" hint="Choose at least two" min="2">
  <label><input type="checkbox" name="topic" value="a" /> Assessment</label>
  <label><input type="checkbox" name="topic" value="b" /> Feedback</label>
</lk-choices>
```

| Attribute | Description |
| --- | --- |
| `legend` | Visible group label. |
| `hint` | Help text. |
| `error` | Error message from your own validation. |
| `min` | Minimum checked boxes in a checkbox group. |

Radio groups use the native `required` attribute on their inputs. Call `group.validate()` to check on demand.
