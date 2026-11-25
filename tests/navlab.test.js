import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceAircraft, vorIndication } from '../js/psycho/navlab.js';

test('route sur le sol : composantes aérienne et vent venant de l’ouest', () => {
  const { x, y, heading } = advanceAircraft({ x: 0, y: 0, heading: 0 }, 0, 3600,
    { tas: 120, windFrom: 270, windKt: 30 });
  assert.ok(Math.abs(x - 30) < 1e-9);
  assert.ok(Math.abs(y - 120) < 1e-9);
  assert.equal(heading, 0);
});

test('aiguille et drapeau : route 360 vers et depuis la balise', () => {
  for (const [x, y, to, side] of [[1, -5, true, -1], [-1, -5, true, 1], [1, 5, false, -1], [-1, 5, false, 1]]) {
    const cdi = vorIndication({ x, y }, 0);
    assert.equal(cdi.valid, true);
    assert.equal(cdi.to, to);
    assert.equal(Math.sign(cdi.deviation), side);
  }
  assert.equal(vorIndication({ x: 0, y: 0.1 }, 0).valid, false);
  assert.equal(vorIndication({ x: 1, y: 0 }, 0).valid, false);
});
