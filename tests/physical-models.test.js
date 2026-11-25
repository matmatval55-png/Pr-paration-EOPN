import test from 'node:test';
import assert from 'node:assert/strict';
import '../js/physique/index.js';
import { makeQuestion } from '../js/core/registry.js';

const cases = [
  ['fluides', /à (\d+) m\/s dans une section d’aire (\d+)/, ([v, ratio]) => (ratio ** 2 - 1) * v ** 2 / 2],
  ['ondes', /émise à t = (\d+) ms.*enregistré à t = (\d+) ms.*ajoute (\d+) ms/, ([a, b, d]) => (b - a - d) * 0.17],
  ['thermodynamique', /de (\d+) W fonctionne (\d+) s.*chauffe-t-elle (\d+) kg/, ([p, t, m]) => p * t / (5250 * m)],
];

for (const [id, operands, reference] of cases) {
  test(`physique.${id} : bilan indépendant à partir de l’énoncé`, () => {
    for (let seed = 0; seed < 600; seed++) {
      const q = makeQuestion({ gen: `physique.${id}`, level: 3, seed });
      const match = q.prompt.match(operands);
      assert.ok(match, q.prompt);
      assert.ok(Math.abs(q.answer - reference(match.slice(1).map(Number))) <= 0.00500001, q.prompt);
    }
  });
}
