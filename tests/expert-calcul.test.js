import assert from 'node:assert/strict';
import test from 'node:test';
import '../js/psycho/calcul.js';
import { makeQuestion } from '../js/core/registry.js';

const models = [
  [/\((\d+) \+ (\d+)\) × \(1 − (\d+)\/100\)/, ([a, b, p]) => a + b - (a * p + b * p) / 100],
  [/(\d+)² − (\d+)²/, ([a, b]) => a * a - b * b],
  [/de (\d+) L\. À (\d+) L\/h.*après (\d+) min/, ([capacity, flow, min]) => capacity - flow * min / 60],
  [/3\/4 de \((\d+) − (\d+)\) \+ (\d+) × 15/, ([a, b, c]) => 0.75 * a - 0.75 * b + 15 * c],
  [/À (\d+) kt pendant 18 min puis (\d+) kt pendant 16 min.*de (\d+) NM/, ([a, b, c]) => (18 * a + 16 * b) / 60 + c],
  [/√(\d+) × (\d+) \+ (\d+)³ − (\d+)²/, ([a, b, c, d]) => Math.sqrt(a) * b + c * c * c - d * d],
];

test('calcul mental expert : contrôle indépendant des six familles', () => {
  const coverage = new Set();
  for (const level of [4, 5]) {
    for (let seed = 0; seed < 1000; seed++) {
      const item = makeQuestion({ gen: 'psy.calcul', level, seed });
      const index = models.findIndex(([re]) => re.test(item.prompt));
      assert.ok(index >= 0, item.prompt);
      coverage.add(index);
      const [re, solve] = models[index];
      assert.equal(item.answer, solve(item.prompt.match(re).slice(1).map(Number)), item.prompt);
    }
  }
  assert.equal(coverage.size, models.length);
});
