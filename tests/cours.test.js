// Vérifie la bibliothèque de cours : fiches complètes, identifiants uniques, liens valides.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SECTIONS } from '../js/cours/index.js';
import '../js/psycho/index.js';
import '../js/anglais/index.js';
import '../js/culture/index.js';
import { getGen } from '../js/core/registry.js';
import { EXAMS } from '../js/exams.js';
import { readFileSync } from 'node:fs';

const app = readFileSync('js/app.js', 'utf8');

test('chaque fiche a un titre, un contenu et un identifiant unique', () => {
  let total = 0;
  for (const s of SECTIONS) {
    const ids = new Set();
    for (const f of s.fiches) {
      assert.ok(f.title && f.html && f.html.length > 300, `${s.id}/${f.id} : contenu trop court`);
      assert.ok(!ids.has(f.id), `${s.id}/${f.id} : identifiant en double`);
      assert.ok(!/undefined|NaN/.test(f.html), `${s.id}/${f.id} : texte invalide`);
      ids.add(f.id);
      total++;
    }
  }
  assert.ok(total >= 50, `seulement ${total} fiches`);
});

test('les liens « S’entraîner » mènent vers une page existante', () => {
  for (const s of SECTIONS)
    for (const f of s.fiches) {
      const h = f.train.replace('#/', '');
      if (h.startsWith('train/')) assert.ok(getGen(h.slice(6)), `${f.train} : exercice inconnu`);
      else if (h.startsWith('exam/')) assert.ok(EXAMS.some((e) => e.id === h.slice(5)), `${f.train} : examen inconnu`);
      else assert.ok(app.includes(`^${h.split('/')[0]}`), `${f.train} : route inconnue`);
    }
});
