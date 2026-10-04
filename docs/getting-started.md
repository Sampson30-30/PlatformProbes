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
