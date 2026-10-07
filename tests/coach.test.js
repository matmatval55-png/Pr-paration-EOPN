// Suivi adaptatif : progression des niveaux et composition des séances coach.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../js/psycho/index.js';
import '../js/maths/index.js';
import '../js/physique/index.js';
import '../js/anglais/index.js';
import '../js/culture/index.js';
import { nextMastery, updateMastery, levelFor, status, masteryScore } from '../js/core/mastery.js';
import { buildSession, candidates, advice } from '../js/core/coach.js';
import { getGen, makeQuestion } from '../js/core/registry.js';
import { record } from '../js/core/stats.js';
import { store } from '../js/core/store.js';

const play = (answers, level = null, max = 3) => {
  let m;
  for (const ok of answers) m = nextMastery(m, level ?? m?.lvl ?? 1, ok, max);
  return m;
};

test('le niveau monte après 4 bonnes réponses sur 5', () => {
  assert.equal(play([1, 1, 1, 1]).lvl, 1);
  assert.equal(play([1, 0, 1, 1, 1]).lvl, 2);
  assert.equal(play([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]).lvl, 3);
});

test('le niveau baisse après 2 erreurs d’affilée et ne dépasse pas le max', () => {
  const m = play([1, 1, 1, 1, 1, 0, 0]);
  assert.equal(m.lvl, 1);
  assert.equal(m.best, 2);
  assert.equal(play(Array(30).fill(1), null, 2).lvl, 2);
  assert.equal(play([0, 0, 0]).lvl, 1);
});

test('après une baisse, il faut 5 nouvelles réponses pour remonter', () => {
  let m = play([1, 1, 1, 1, 1, 0, 0]);
  m = nextMastery(m, 1, true);
  assert.equal(m.lvl, 1);
});

test('les réponses de niveau 0 (examens) ne changent pas le niveau', () => {
  assert.equal(play(Array(10).fill(1), 0).lvl, 1);
});

test('séance coach : bon nombre de questions, questions valides et entrelacées', () => {
  store.reset();
  for (const minutes of [10, 15, 25, 40]) {
    const s = buildSession({ minutes, seed: minutes });
    assert.equal(s.total, Math.round(minutes * 1.4));
    for (const it of s.items) {
      const q = makeQuestion(it.spec);
      assert.ok(q.prompt, it.spec.gen);
      assert.ok(!getGen(it.spec.gen).noSrs);
    }
    const gens = new Set(s.items.map((i) => i.gen));
    assert.ok(gens.size >= 2);
    assert.notEqual(s.items[0].gen, s.items[1].gen);
  }
});

test('séance ciblée sur un module', () => {
  store.reset();
  const s = buildSession({ minutes: 15, module: 'maths', seed: 3 });
  assert.ok(s.items.every((i) => getGen(i.gen).module === 'maths'));
});

test('un point faible est priorisé et repris au niveau mémorisé', () => {
  store.reset();
  const id = 'psy.vor';
  for (let i = 0; i < 6; i++) {
    record(id, i % 3 === 0, 5000);
    updateMastery({ gen: id, level: 1, seed: i }, i % 3 === 0);
  }
  assert.equal(status(id).id, 'weak');
  assert.equal(candidates()[0].g.id, id);
  const s = buildSession({ minutes: 15, seed: 1 });
  assert.ok(s.items.some((i) => i.gen === id));
  assert.ok(advice().some((a) => a.href === `#/train/${id}`));
  // l'utilisateur a déjà travaillé : au plus une découverte par séance
  for (const g of ['psycho', 'maths', 'physique', 'anglais', 'culture'].flatMap((m) => candidates(m).slice(0, 4).map((c) => c.g.id))) for (let i = 0; i < 3; i++) updateMastery({ gen: g, level: 1, seed: i }, true);
  const s2 = buildSession({ minutes: 15, seed: 2 });
  assert.ok(s2.blocks.filter((b) => b.reason.ico === '🆕').length <= 1);
});

test('maîtrise : score et statut', () => {
  store.reset();
  const id = 'psy.vor';
  for (let i = 0; i < 20; i++) updateMastery({ gen: id, level: levelFor(id), seed: i }, true);
  assert.equal(levelFor(id), getGen(id).levels);
  assert.equal(status(id).id, 'master');
  assert.equal(masteryScore(id), 100);
});
