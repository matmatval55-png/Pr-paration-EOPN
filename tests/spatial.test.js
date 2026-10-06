import { test } from 'node:test';
import assert from 'node:assert/strict';
import { foldNet, validViews } from '../js/psycho/spatial.js';

// Patron en croix :   .A..
//                     BCDE
//                     .F..
// Replié faces imprimées vers l'extérieur, avec C face à nous : A dessus, C devant, D à droite.
const cross = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]];

test('patron en croix : faces opposées', () => {
  const label = foldNet(cross);
  assert.ok(label);
  const pairs = [[0, 1], [2, 3], [4, 5]].map(([a, b]) => [label[a], label[b]].sort().join(''));
  // A(0)–F(5), B(1)–D(3), C(2)–E(4)
  assert.deepEqual(pairs.sort(), ['05', '13', '24']);
});

test('patron en croix : orientation (chiralité) correcte', () => {
  const views = validViews(foldNet(cross)).map((v) => v.join(''));
  // vue dessus=A, gauche=C (face avant), droite=D
  assert.ok(views.includes('023'), 'la vue A/C/D doit être valide');
  assert.ok(!views.includes('032'), 'la vue miroir A/D/C doit être invalide');
  assert.equal(views.length, 24);
});

test('un carré 2×2 ne se replie pas en cube', () => {
  assert.equal(foldNet([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]]), null);
});
