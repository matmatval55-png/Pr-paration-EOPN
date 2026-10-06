import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notes, BAREME, noteFrom } from '../js/sport/bareme.js';

test('barème officiel : valeurs de référence', () => {
  // Hommes : palier 7+15 s = 10 ; 12 = 20 ; Killy 88 s = 10 ; 7 tractions = 10
  assert.deepEqual(notes('H', { palier: 7, sec: 15, bras: 7, killy: 88 }), { leger: 10, killy: 10, bras: 10, moyenne: 10 });
  assert.equal(notes('H', { palier: 12 }).leger, 20);
  // entre 6+45 et 7+15 : 8 (la note 9 n'existe pas pour le Luc Léger)
  assert.equal(notes('H', { palier: 7, sec: 0 }).leger, 8);
  assert.equal(notes('H', { palier: 5, sec: 0 }).leger, 0);
  // Femmes : palier 5 = 10 ; poulie 29 = 10 ; plus de 58 = 20
  assert.equal(notes('F', { palier: 5 }).leger, 10);
  assert.equal(notes('F', { bras: 29 }).bras, 10);
  assert.equal(notes('F', { bras: 60 }).bras, 20);
  assert.equal(notes('F', { bras: 58 }).bras, 19);
  // 6 tractions = 9, 3 = 5
  assert.equal(noteFrom(BAREME.bras.H, 6), 9);
  assert.equal(noteFrom(BAREME.bras.H, 3), 5);
  assert.equal(noteFrom(BAREME.killy, 170), 20);
});

test('chaque barème a 20 lignes et des seuils décroissants', () => {
  for (const arr of [BAREME.leger.H, BAREME.leger.F, BAREME.killy, BAREME.bras.H, BAREME.bras.F]) {
    assert.equal(arr.length, 20);
    const v = arr.filter((x) => x != null);
    for (let i = 1; i < v.length; i++) assert.ok(v[i] < v[i - 1]);
  }
});
