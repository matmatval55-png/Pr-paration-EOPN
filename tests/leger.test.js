import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speed, shuttleTime, shuttlesIn, timeline } from '../js/pages/leger.js';

test('vitesses Luc Léger cohérentes avec le livret (palier 12 = 14 km/h)', () => {
  assert.equal(speed(1), 8.5);
  assert.equal(speed(12), 14);
  assert.ok(Math.abs(shuttleTime(1) - 20 / (8.5 / 3.6)) < 1e-9);
});

test('chaque palier dure environ une minute', () => {
  for (let p = 1; p <= 15; p++) {
    const d = shuttlesIn(p) * shuttleTime(p);
    assert.ok(Math.abs(d - 60) < 5, `palier ${p} : ${d.toFixed(1)} s`);
  }
  const ev = timeline(1, 3);
  assert.equal(ev.filter((e) => e.newPalier).length, 3);
  assert.ok(ev.every((e, i) => i === 0 || e.t > ev[i - 1].t));
});
