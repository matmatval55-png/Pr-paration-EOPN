import test from 'node:test';
import assert from 'node:assert/strict';
import { customExam, customExamId } from '../js/core/custom-exam.js';

test('un format personnalisé possède un identifiant stable et des quotas fixes', () => {
  const id = customExamId(['maths', 'psycho', 'maths'], 20);
  assert.equal(id, customExamId(['psycho', 'maths'], 20));
  const exam = customExam(id);
  assert.equal(exam.fixedComposition, true);
  assert.equal(exam.sections.reduce((total, section) => total + section.time, 0), 2400);
  assert.ok(exam.sections.every((section) => section.count === 20 && section.gens.length === 4));
  assert.equal(customExam('perso-v1-20-maths_inconnue'), null);
  assert.equal(customExamId([], 20), null);
  assert.equal(customExamId(['maths'], 40), null);
});
