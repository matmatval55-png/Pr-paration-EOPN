import assert from 'node:assert/strict';
import test from 'node:test';
import { store } from '../js/core/store.js';

let saved;
let full = false;
globalThis.localStorage = {
  getItem: () => saved,
  setItem(key, value) {
    if (full) throw new Error('QuotaExceededError');
    saved = value;
  },
};

test('les sauvegardes v1 brutes et enveloppées conservent données et réglages', () => {
  const stats = { 'psy.calcul': { '2026-01-01': [3, 2, 4200] } };
  store.importJSON(JSON.stringify({ stats, settings: { theme: 'light' }, planning: { days: [1] } }));
  assert.deepEqual(store.data.stats, stats);
  assert.deepEqual(store.data.planning, { days: [1], done: {} });
  const exported = store.exportJSON();
  store.reset();
  store.importJSON(exported);
  assert.deepEqual(store.data.stats, stats);
  assert.equal(store.data.settings.theme, 'light');
  assert.equal(store.data.settings.hoursPerWeek, 6);
});

test('un import invalide ou impossible à persister conserve la sauvegarde en cours', () => {
  const original = store.data;
  const persisted = saved;
  for (const backup of [
    '{"stats": { "__proto__": {} }}',
    '{"stats": {"psy.calcul":null}}',
    '{"stats": {}, "exams": {}}',
    '{"stats": {}, "version": 2}',
  ]) {
    assert.throws(() => store.importJSON(backup), /sauvegarde/);
    assert.equal(store.data, original);
    assert.equal(saved, persisted);
  }
  full = true;
  assert.throws(() => store.importJSON('{"stats": {}}'), /Quota/);
  assert.equal(store.data, original);
  assert.equal(saved, persisted);
  full = false;
});
