// DOM-free logic for <lk-table>: reading values, sorting and filtering.

const collator = new Intl.Collator('en-GB', { numeric: true, sensitivity: 'base' });

/** Reads a number from text such as "£1,250", "42%" or "-3.5". NaN if it is not one. */
export function parseNumber(text) {
  const cleaned = String(text ?? '').trim().replace(/[£$€,\s%]/g, '');
  if (cleaned === '' || !/^[-+]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return NaN;
  return Number(cleaned);
}

/** 'number' when every non-empty value reads as a number, otherwise 'text'. */
export function detectType(values) {
  const filled = values.filter((v) => String(v ?? '').trim() !== '');
  return filled.length > 0 && filled.every((v) => !Number.isNaN(parseNumber(v))) ? 'number' : 'text';
}

/**
 * Returns the original indexes in sorted order. Empty values always go last,
 * and equal values keep their original order, so sorting is stable.
 */
export function sortIndexes(values, type, direction) {
  const sign = direction === 'descending' ? -1 : 1;
  const isEmpty = (v) => String(v ?? '').trim() === '';
  return values
    .map((value, index) => ({ value, index }))
    .sort((a, b) => {
      const ae = isEmpty(a.value);
      const be = isEmpty(b.value);
      if (ae || be) return ae && be ? a.index - b.index : ae ? 1 : -1;
      const result =
        type === 'number'
          ? parseNumber(a.value) - parseNumber(b.value)
          : collator.compare(String(a.value), String(b.value));
      return result * sign || a.index - b.index;
    })
    .map((entry) => entry.index);
}

/** none -> ascending -> descending -> none. */
export function nextDirection(current) {
  return current === 'ascending' ? 'descending' : current === 'descending' ? 'none' : 'ascending';
}

/** A row matches when every word in the query appears somewhere in it. */
export function matchRow(cells, query) {
  const words = String(query ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = cells.join(' ').toLowerCase();
  return words.every((w) => haystack.includes(w));
}

/** The line announced to screen reader users after sorting or filtering. */
export function tableSummary(shown, total) {
  const rows = (n) => `${n} ${n === 1 ? 'row' : 'rows'}`;
  if (total === 0) return 'No rows';
  if (shown === 0) return 'No rows match';
  return shown === total ? rows(total) : `Showing ${shown} of ${rows(total)}`;
}
