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

test('banques : jamais deux fois la même question, puis tirage vide quand tout est vu', async () => {
  const { makeDrawer, markSeen, remaining, resetHistory } = await import('../js/core/seen.js');
  store.reset();
  const id = 'psy.urgences';
  const size = getGen(id).bankSize(1);
  const got = new Set();
  for (let s = 0; s < 20; s++) {
    const draw = makeDrawer(id);
    for (let k = 0; k < 5; k++) {
      const spec = draw(1);
      if (!spec) break;
      const q = makeQuestion(spec);
      assert.ok(!got.has(q.prompt), 'question répétée');
      got.add(q.prompt);
      markSeen(spec, q);
    }
  }
  assert.equal(got.size, size);
  assert.equal(makeDrawer(id)(1), null);
  assert.equal(remaining(id, 1), 0);
  // vue en examen (niveau 0 = toute la banque) : aussi exclue
  assert.equal(remaining(id, 0), 0);
  resetHistory(id);
  assert.equal(remaining(id, 1), size);
});

test('exercices générés : jamais deux fois la même question, même sur des milliers de questions', async () => {
  const { makeFresh, markSeen, fingerprint } = await import('../js/core/seen.js');
  store.reset();
  for (const id of ['psy.calcul', 'psy.attente', 'maths.fractions']) {
    if (!getGen(id)) continue;
    const seen = new Set();
    for (let s = 0; s < 40; s++) {
      const fresh = makeFresh(id);
      for (let k = 0; k < 10; k++) {
        const spec = fresh(2);
        if (!spec) break;
        const q = makeQuestion(spec);
        const fp = fingerprint(q);
        assert.ok(!seen.has(fp), `${id} : question répétée`);
        seen.add(fp);
        markSeen(spec, q);
      }
    }
  }
  // exercice à variantes limitées : une fois tout vu, plus rien (pas de doublon)
  const id = 'psy.interception';
  const fresh = makeFresh(id, null, 400);
  let n = 0;
  for (let k = 0; k < 40; k++) {
    const spec = fresh(1);
    if (!spec) break;
    markSeen(spec, makeQuestion(spec));
    n++;
  }
  assert.ok(n > 0 && n < 40);
  assert.equal(makeFresh(id, null, 400)(1), null);
});
