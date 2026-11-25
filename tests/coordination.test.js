import assert from 'node:assert/strict';
import test from 'node:test';
import { coordinationScore } from '../js/psycho/psychomoteur.js';

test('chaque axe de coordination doit atteindre le seuil', () => {
  assert.equal(coordinationScore(1, 0, true).ok, false);
  assert.equal(coordinationScore(0.5, 1, true).ok, false);
  assert.equal(coordinationScore(0.61, 0.61, true).ok, true);
  assert.equal(coordinationScore(0.6, 0, false).ok, true);
});
