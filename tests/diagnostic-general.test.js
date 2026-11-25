import test from 'node:test';
import assert from 'node:assert/strict';
import '../js/maths/index.js';
import '../js/physique/index.js';
import '../js/anglais/index.js';
import '../js/culture/index.js';
import { EXAMS } from '../js/exams.js';
import { fingerprint, makePicker } from '../js/core/seen.js';
import { getGen, makeQuestion } from '../js/core/registry.js';
import { makeRng } from '../js/core/rng.js';

for (const [id, minutes] of [['diagnostic-general', 40], ['simulation-180', 180], ['coordination', 6]]) {
  test(`${id} : durée, quotas et génération sur 25 graines`, () => {
    const exam = EXAMS.find((format) => format.id === id);
    assert.equal(exam.sections.reduce((total, s) => total + s.time, 0), minutes * 60);
    for (const level of exam.fixedLevel ? [exam.fixedLevel] : [1, 2, 3]) {
      for (let seed = 0; seed < 25; seed++) {
        const rng = makeRng(seed);
        const pick = makePicker(rng.next, { excludeSeen: false });
        const used = new Set();
        for (const section of exam.sections) {
          assert.equal(section.count % section.gens.length, 0);
          for (const id of rng.shuffle(Array.from({ length: section.count }, (_, i) => section.gens[i % section.gens.length]))) {
            const gen = getGen(id);
            assert.ok(gen, id);
            const spec = pick(id, gen.bank ? 0 : Math.min(level, gen.levels));
            assert.ok(spec, `${id} · ${level} · ${seed}`);
            const key = fingerprint(makeQuestion(spec));
            if (key) {
              assert.ok(!used.has(key), `${id} · ${level} · ${seed}`);
              used.add(key);
            }
          }
        }
      }
    }
  });
}
