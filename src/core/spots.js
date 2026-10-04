// DOM-free logic for <lk-hotspot>.

/** Reads a coordinate such as "30", "30%" or " 30.5 " as a percentage between 0 and 100. */
export function parsePercent(value, fallback = 50) {
  const n = parseFloat(String(value ?? '').replace('%', ''));
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : fallback;
}

/** "2 of 4 explored", or a completion message. */
export function exploredText(explored, total) {
  if (total === 0) return '';
  return explored >= total ? `All ${total} explored` : `${explored} of ${total} explored`;
}
