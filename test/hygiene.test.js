// Things that should never be in the repository.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);

test('no file contains a merge-conflict marker', () => {
  const found = [];
  for (const file of tracked) {
    if (!/\.(html|js|mjs|css|json)$/.test(file)) continue;
    const lines = readFileSync(new URL(file, root), 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (/^(<{7}|>{7})( |$)/.test(line) || /^={7}$/.test(line)) found.push(`${file}:${i + 1}`);
    });
  }
  assert.deepEqual(found, [], 'a merge was left unfinished');
});
