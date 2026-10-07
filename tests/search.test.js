import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchFiches } from '../js/pages/bibliotheque.js';

test('recherche dans les fiches (sans accents, plusieurs mots)', () => {
  assert.ok(searchFiches('finesse').some((r) => r.f.id === 'aerodynamique'));
  assert.ok(searchFiches('QNH').length >= 1);
  assert.ok(searchFiches('pression').length >= 3);
  assert.ok(searchFiches('decrochage incidence').length >= 1, 'les accents doivent être ignorés');
  assert.equal(searchFiches('zzzqqq').length, 0);
});
