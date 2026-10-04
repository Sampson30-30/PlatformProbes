// Time zone helpers built on the browser's own Intl support. No tables of offsets.

/** Offset from UTC in minutes for a zone at a moment, summer time included. */
export function offsetMinutes(date, tz) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return Math.round((asUtc - date.getTime()) / 60000);
}

/**
 * The zone's standard (non-summer) offset. Summer time only ever moves a clock
 * forward, so the lower of a January and a July reading is the standard one,
 * in either hemisphere.
 */
export function standardOffsetMinutes(tz, year = new Date().getUTCFullYear()) {
  const jan = new Date(Date.UTC(year, 0, 15, 12));
  const jul = new Date(Date.UTC(year, 6, 15, 12));
  return Math.min(offsetMinutes(jan, tz), offsetMinutes(jul, tz));
}

/** 330 becomes "UTC+5:30", -300 becomes "UTC-5", 0 becomes "UTC+0". */
export function formatOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
}
