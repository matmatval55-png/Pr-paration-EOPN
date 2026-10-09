// Jour J, épreuve de groupe et journal santé.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../js/psycho/index.js';
import '../js/anglais/index.js';
import { EXAMS } from '../js/exams.js';
import { getGen } from '../js/core/registry.js';
import { SUJETS, TYPES, CRITERES_GROUPE } from '../js/entretien/groupe.js';
import { healthAdvice } from '../js/pages/sante.js';
import '../js/pages/jourj.js';

test('les simulations jour J enchaînent des sections valides et des pauses', () => {
  for (const id of ['jourj', 'jourj-court']) {
    const ex = EXAMS.find((e) => e.id === id);
    assert.ok(ex, id);
    assert.ok(ex.sections.filter((s) => s.pause).length === 2);
    for (const s of ex.sections.filter((x) => !x.pause)) {
      assert.ok(s.count >= 1 && s.time >= 60, s.title);
      for (const g of s.gens) assert.ok(getGen(g), g);
    }
  }
  const full = EXAMS.find((e) => e.id === 'jourj');
  const min = full.sections.reduce((a, s) => a + (s.pause || s.time), 0) / 60;
  assert.ok(min > 80 && min < 130, String(min));
});

test('sujets de groupe complets', () => {
  assert.ok(SUJETS.length >= 20);
  for (const s of SUJETS) {
    assert.ok(TYPES[s.type], s.t);
    for (const k of ['t', 'txt', 'consigne', 'pistes']) assert.ok(s[k]?.length > 10, `${s.t} ${k}`);
  }
  assert.equal(CRITERES_GROUPE.length, 8);
});

test('conseils santé', () => {
  assert.deepEqual(healthAdvice({}).tips, []);
  const log = {};
  for (let i = 1; i <= 7; i++) log[`2026-01-0${i}`] = { sleep: '6', sport: '10', caf: '5', alc: '2', screens: true, mood: '2' };
  const { avg, tips } = healthAdvice(log);
  assert.equal(avg.sleep, 6);
  assert.equal(avg.alc, 14);
  assert.equal(tips.length, 6);
  const good = healthAdvice({ '2026-01-01': { sleep: '8', sport: '60' } });
  assert.equal(good.tips.length, 1);
  assert.match(good.tips[0], /correct/);
});

test('questionnaire de personnalité : scores, cohérence, désirabilité', async () => {
  const { ITEMS, score, DIMENSIONS, PAIRS } = await import('../js/entretien/personnalite.js');
  assert.equal(ITEMS.length, 60);
  assert.equal(new Set(ITEMS.map((i) => i.id)).size, 60);
  // réponses « idéales » cohérentes : 5 aux items directs, 1 aux inversés, 1 à la désirabilité
  const ans = {};
  for (const i of ITEMS) ans[i.id] = i.dim === 'desir' ? 1 : i.dim === 'ctrl' ? 3 : i.dir > 0 ? 5 : 1;
  for (const [a, b, same] of PAIRS) ans[a] = same ? ans[b] : 6 - ans[b];
  const r = score(ans);
  for (const k of Object.keys(DIMENSIONS)) assert.equal(r.dims[k], 100, k);
  assert.equal(r.incoh.length, 0);
  assert.equal(r.desir, 1);
  // tout à 5 : incohérences détectées et désirabilité élevée
  const all5 = Object.fromEntries(ITEMS.map((i) => [i.id, 5]));
  const r2 = score(all5);
  assert.equal(r2.desir, 5);
  assert.ok(r2.incoh.length >= 3);
  for (const k of Object.keys(DIMENSIONS)) assert.equal(r2.dims[k], 50, k);
});
