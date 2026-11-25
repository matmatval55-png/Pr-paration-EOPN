import test from 'node:test';
import assert from 'node:assert/strict';
import { EXAMS } from '../js/psycho/index.js';
import { getGen, makeQuestion } from '../js/core/registry.js';
import { makeRng } from '../js/core/rng.js';
import { fingerprint, makePicker, markSeen } from '../js/core/seen.js';
import { store } from '../js/core/store.js';

const formats = {
  'diagnostic-initial': 30,
  'express-30': 30,
  'intermediaire-60': 60,
  'approfondi-90': 90,
  'simulation-120': 120,
  'instruments-intensif': 12,
};

test('formats chronométrés : durée et quotas stables après un premier passage', () => {
  store.reset();
  for (const [id, minutes] of Object.entries(formats)) {
    const exam = EXAMS.find((format) => format.id === id);
    assert.ok(exam.fixedComposition);
    assert.equal(exam.sections.reduce((total, section) => total + section.time, 0), minutes * 60);
    for (const level of exam.fixedLevel ? [exam.fixedLevel] : [1, 2, 3]) {
      const used = new Map();
      for (const passage of [0, 1]) {
        const pick = makePicker(makeRng(42).next, { excludeSeen: false });
        const fingerprints = new Set();
        for (const { count, gens } of exam.sections) {
          assert.equal(count % gens.length, 0);
          for (let i = 0; i < count; i++) {
            const gen = gens[i % gens.length];
            const spec = pick(gen, Math.min(level, getGen(gen).levels));
            assert.ok(spec, `${id} : quota indisponible pour ${gen}, niveau ${level}`);
            const question = makeQuestion(spec);
            const key = `${gen}:${fingerprint(question)}`;
            assert.ok(!fingerprints.has(key), `${id} : doublon pour ${gen}`);
            fingerprints.add(key);
            markSeen(spec, question);
          }
        }
        if (passage === 0) used.set(level, fingerprints);
        else assert.deepEqual(fingerprints, used.get(level));
      }
    }
  }
});
