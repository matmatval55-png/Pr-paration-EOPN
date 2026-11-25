import test from 'node:test';
import assert from 'node:assert/strict';
import '../js/psycho/index.js';
import { classifyMistake, mistakeEntries, mistakeKey, recordMistake } from '../js/core/mistakes.js';
import { makeQuestion } from '../js/core/registry.js';
import { store } from '../js/core/store.js';

test('le carnet conserve la réponse, la cause manuelle et les répétitions', () => {
  store.reset();
  const spec = { gen: 'psy.calcul', level: 4, seed: 42 };
  const q = makeQuestion(spec);
  recordMistake({ spec, q, given: '0', ms: 1020 });
  const key = mistakeKey(spec);
  classifyMistake(key, 'Erreur de méthode');
  recordMistake({ spec, q, timeout: true, ms: 12000 });
  classifyMistake(key, 'Cause inventée');
  const [[savedKey, item]] = mistakeEntries({ module: 'psycho', cause: 'Erreur de méthode' });
  assert.equal(savedKey, key);
  assert.equal(item.count, 2);
  assert.equal(item.expected, String(q.answer));
  assert.equal(item.timeout, true);
  assert.equal(mistakeEntries({ module: 'maths' }).length, 0);
});
