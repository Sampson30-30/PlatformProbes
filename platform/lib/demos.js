// The small calculations behind the gallery's live demos. Pure functions, no DOM access.

/** Longitude (-180 to 180) where the sun is directly overhead at a given UTC hour (0 to 24). */
export function subsolarLongitude(utcHour) {
  const lon = -(Number(utcHour) - 12) * 15;
  return ((((lon + 180) % 360) + 360) % 360) - 180;
}

/** Shortest angular distance in degrees between two longitudes. */
export function angularDistance(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * Is it daytime on the equator at this longitude at this UTC hour?
 * A simplification: day is the half of the Earth facing the sun.
 */
export function isDaytime(longitude, utcHour) {
  return angularDistance(longitude, subsolarLongitude(utcHour)) < 90;
}

/** The longitudes where it is daytime: { from, to }, going east from `from`. */
export function daylightRange(utcHour) {
  const centre = subsolarLongitude(utcHour);
  const wrap = (lon) => ((((lon + 180) % 360) + 360) % 360) - 180;
  return { from: wrap(centre - 90), to: wrap(centre + 90) };
}

/** Whole and half hours of practice over some weeks, from minutes a day. */
export function hoursOverWeeks(minutesPerDay, weeks) {
  return Math.round(((Number(minutesPerDay) * 7 * Number(weeks)) / 60) * 10) / 10;
}

/** -90 becomes "90 degrees west", 45 becomes "45 degrees east", 0 becomes "0 degrees". */
export function describeLongitude(lon) {
  const n = Math.round(lon);
  if (n === 0) return '0 degrees';
  if (Math.abs(n) === 180) return '180 degrees';
  return `${Math.abs(n)} degrees ${n < 0 ? 'west' : 'east'}`;
}

/** 12 becomes "12:00", 13.5 becomes "13:30". */
export function formatHour(hour) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
