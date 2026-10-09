// Vérifie que chaque générateur produit des questions bien formées, à tous les niveaux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listGens, makeQuestion } from '../js/core/registry.js';
import '../js/psycho/index.js';
import '../js/maths/index.js';
import '../js/physique/index.js';
import '../js/anglais/index.js';
import '../js/culture/index.js';
import '../js/entretien/groupe.js';
import { parseNum } from '../js/core/ui.js';

const RUNS = 400;

for (const g of listGens()) {
  test(`générateur ${g.id}`, () => {
    for (let level = 1; level <= g.levels; level++) {
      for (let seed = 1; seed <= RUNS; seed++) {
        const spec = { gen: g.id, level, seed };
        const q = makeQuestion(spec);
        const ctx = `${g.id} niveau ${level} graine ${seed}`;
        assert.ok(q.prompt, `${ctx} : énoncé vide`);
        assert.ok(q.explain && q.explain.length > 20, `${ctx} : explication manquante`);
        assert.ok(['mcq', 'num', 'custom'].includes(q.kind), `${ctx} : type inconnu`);
        if (q.kind === 'mcq') {
          assert.ok(q.choices.length >= 2, `${ctx} : pas assez de choix`);
          assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length, `${ctx} : index de réponse invalide`);
          assert.equal(new Set(q.choices).size, q.choices.length, `${ctx} : choix en double ${JSON.stringify(q.choices)}`);
          for (const c of q.choices) assert.ok(!/undefined|NaN/.test(c), `${ctx} : choix invalide ${c}`);
        }
        if (q.kind === 'num') {
          assert.ok(q.accept || Number.isFinite(q.answer), `${ctx} : réponse non numérique`);
          // la réponse attendue, tapée telle quelle, doit être acceptée
          const typed = q.answerText != null ? String(q.answerText).replace('−', '-') : String(q.answer).replace('.', ',');
          if (q.accept) assert.ok(q.accept(typed), `${ctx} : réponse attendue refusée « ${typed} »`);
          else {
            const v = parseNum(typed);
            const tol = q.tol ?? Math.max(1e-9, Math.abs(q.answer) * 1e-9);
            assert.ok(Math.abs(v - q.answer) <= tol, `${ctx} : « ${typed} » ≠ ${q.answer}`);
          }
          if (typeof q.answer === "number") assert.ok(Math.abs(q.answer) < 1e7, `${ctx} : réponse démesurée`);
        }
        if (q.kind === 'custom') assert.equal(typeof q.mount, 'function');
        assert.ok(!/undefined|NaN/.test(q.prompt + q.explain), `${ctx} : texte contenant undefined/NaN`);
        // reproductibilité
        const q2 = makeQuestion(spec);
        assert.equal(q2.prompt, q.prompt, `${ctx} : non reproductible`);
      }
    }
  });
}

// Banques : la bonne réponse ne doit pas figurer parmi les distracteurs (sinon le QCM serait faux),
// et chaque élément doit avoir au moins 2 distracteurs distincts.
test('banques de questions bien formées', () => {
  for (const g of listGens().filter((x) => x.bank)) {
    const n = g.bankSize(0);
    for (let i = 0; i < n; i++) {
      const q = makeQuestion({ gen: g.id, level: 0, seed: i });
      assert.ok(q.choices.length >= 3, `${g.id} #${i} : pas assez de choix`);
      assert.equal(new Set(q.choices).size, q.choices.length, `${g.id} #${i} : doublon dans les choix`);
    }
  }
});
