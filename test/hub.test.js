// The home page links to everything. This checks that none of those links is broken.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);

function localLinks(file) {
  const html = readFileSync(new URL(file, root), 'utf8');
  const base = file.includes('/') ? file.slice(0, file.lastIndexOf('/') + 1) : '';
  return [...html.matchAll(/href="([^"#]+)"/g)]
    .map((m) => m[1])
    .filter((href) => !/^(https?:|mailto:)/.test(href))
    .map((href) => new URL(href, new URL(base, root)).pathname);
}

test('every link on the home page points at a real file or page', () => {
  const links = localLinks('index.html');
  assert.ok(links.length >= 9);
  for (const path of links) {
    const target = new URL(`.${path.replace(new URL('.', root).pathname, '/')}`, root);
    const file = path.endsWith('/') ? new URL('index.html', target) : target;
    assert.ok(existsSync(file), `broken link: ${path}`);
  }
});

test('the other pages link back to the home page', () => {
  for (const file of ['examples/index.html', 'gallery/index.html', 'customiser/index.html', 'test/browser/index.html']) {
    const html = readFileSync(new URL(file, root), 'utf8');
    assert.match(html, /class="back-link"/, `${file} has no way back`);
  }
});
