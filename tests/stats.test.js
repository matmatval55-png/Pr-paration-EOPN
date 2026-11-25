import assert from 'node:assert/strict';
import test from 'node:test';
import { genSummary, record, responseDiagnostics } from '../js/core/stats.js';
import { store } from '../js/core/store.js';

test('la médiane exclut les délais dépassés et les sauvegardes anciennes gardent leurs agrégats', () => {
  store.reset();
  assert.deepEqual(responseDiagnostics('psy.calcul'), { n: 0, medianMs: null, timeouts: 0, wrong: 0 });
  record('psy.calcul', true, 3000);
  record('psy.calcul', false, 5000);
  record('psy.calcul', false, 12000, { timeout: true });
  assert.deepEqual(responseDiagnostics('psy.calcul'), { n: 3, medianMs: 4000, timeouts: 1, wrong: 1 });
  assert.equal(genSummary('psy.calcul').n, 3);
});
