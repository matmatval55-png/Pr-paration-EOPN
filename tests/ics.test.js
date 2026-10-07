import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildICS } from '../js/planning/ics.js';
import { buildWeek } from '../js/planning/plan.js';

test('export .ics valide : un événement par jour travaillé et par séance de sport', () => {
  const plan = buildWeek({ hours: 6, days: [0, 2, 4], weeks: 50 });
  const ics = buildICS(plan, { from: new Date(2026, 9, 5), hour: '18:30', weeks: 2 });
  assert.ok(ics.startsWith('BEGIN:VCALENDAR') && ics.trim().endsWith('END:VCALENDAR'));
  const events = ics.split('BEGIN:VEVENT').length - 1;
  assert.equal(events, 2 * (3 + plan.sport.length));
  assert.match(ics, /DTSTART:20261005T183000/); // lundi 5 octobre 2026, 18 h 30
  assert.equal((ics.match(/BEGIN:VALARM/g) || []).length, events);
});
