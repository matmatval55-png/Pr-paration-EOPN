import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWeek, allocate, phaseFor } from '../js/planning/plan.js';

test('la répartition utilise exactement le nombre de créneaux', () => {
  const a = allocate({ a: 1, b: 2, c: 3 }, 7);
  assert.equal(Object.values(a).reduce((x, y) => x + y, 0), 7);
});

test('le planning respecte les heures et les jours disponibles', () => {
  for (const hours of [5, 6, 7.5, 8]) {
    const w = buildWeek({ hours, days: [0, 2, 4, 5], weeks: 50 });
    const total = w.perDay.flat().reduce((a, b) => a + b.min, 0);
    assert.equal(total, Math.round((hours * 60) / 30) * 30);
    for (const d of [1, 3, 6]) assert.equal(w.perDay[d].length, 0, 'jour non disponible utilisé');
    assert.ok(w.sport.length >= 1 && w.sport.every((d) => [0, 2, 4, 5].includes(d)));
  }
});

test('les phases suivent la date de sélection', () => {
  assert.equal(phaseFor(60).id, 'fond');
  assert.equal(phaseFor(12).id, 'conso');
  assert.equal(phaseFor(3).id, 'final');
});

test('un module faible reçoit plus de temps', () => {
  const base = buildWeek({ hours: 8, weeks: 50 }).alloc.maths;
  const weak = buildWeek({ hours: 8, weeks: 50, weak: ['maths'] }).alloc.maths;
  assert.ok(weak > base);
});
