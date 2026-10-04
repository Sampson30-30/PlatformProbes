import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subsolarLongitude, angularDistance, isDaytime, daylightRange, hoursOverWeeks } from '../platform/lib/demos.js';
import { offsetMinutes, standardOffsetMinutes, formatOffset } from '../platform/lib/time.js';

test('the sun is overhead at 0 degrees at 12:00 UTC and moves west as the day goes on', () => {
  assert.equal(subsolarLongitude(12), 0);
  assert.equal(subsolarLongitude(18), -90);
  assert.equal(subsolarLongitude(6), 90);
  assert.equal(subsolarLongitude(0), -180);
  assert.equal(subsolarLongitude(24), -180);
});

test('angular distance wraps around the globe', () => {
  assert.equal(angularDistance(170, -170), 20);
  assert.equal(angularDistance(0, 180), 180);
  assert.equal(angularDistance(-90, 90), 180);
});

test('daytime is the half of the Earth facing the sun', () => {
  assert.equal(isDaytime(0, 12), true);
  assert.equal(isDaytime(180, 12), false);
  assert.equal(isDaytime(0, 0), false);
  assert.equal(isDaytime(179, 0), true);
  const range = daylightRange(12);
  assert.deepEqual(range, { from: -90, to: 90 });
  assert.deepEqual(daylightRange(18), { from: -180, to: 0 });
  assert.equal(daylightRange(0).from, 90);
});

test('hours of practice come from a rule, not a table', () => {
  assert.equal(hoursOverWeeks(30, 10), 35);
  assert.equal(hoursOverWeeks(10, 10), 11.7);
  assert.equal(hoursOverWeeks(0, 10), 0);
});

test('offsets come from zone names and know about summer time', () => {
  const jan = new Date(Date.UTC(2026, 0, 15, 12));
  const jul = new Date(Date.UTC(2026, 6, 15, 12));
  assert.equal(offsetMinutes(jan, 'Europe/London'), 0);
  assert.equal(offsetMinutes(jul, 'Europe/London'), 60);
  assert.equal(offsetMinutes(jan, 'America/New_York'), -300);
  assert.equal(offsetMinutes(jul, 'America/New_York'), -240);
  assert.equal(offsetMinutes(jan, 'Asia/Kolkata'), 330);
  assert.equal(offsetMinutes(jul, 'Asia/Kolkata'), 330);
});

test('standard offset is the lower reading in either hemisphere', () => {
  assert.equal(standardOffsetMinutes('Europe/London', 2026), 0);
  assert.equal(standardOffsetMinutes('America/New_York', 2026), -300);
  assert.equal(standardOffsetMinutes('Australia/Sydney', 2026), 600);
  assert.equal(standardOffsetMinutes('Asia/Kolkata', 2026), 330);
});

test('offsets are formatted for people', () => {
  assert.equal(formatOffset(330), 'UTC+5:30');
  assert.equal(formatOffset(-300), 'UTC-5');
  assert.equal(formatOffset(0), 'UTC+0');
  assert.equal(formatOffset(-570), 'UTC-9:30');
});

import { describeLongitude, formatHour } from '../platform/lib/demos.js';

test('longitudes and hours are described for people', () => {
  assert.equal(describeLongitude(-90), '90 degrees west');
  assert.equal(describeLongitude(45), '45 degrees east');
  assert.equal(describeLongitude(0), '0 degrees');
  assert.equal(describeLongitude(-180), '180 degrees');
  assert.equal(formatHour(12), '12:00');
  assert.equal(formatHour(13.5), '13:30');
  assert.equal(formatHour(0), '00:00');
});
