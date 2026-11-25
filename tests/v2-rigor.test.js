import test from 'node:test';
import assert from 'node:assert/strict';
import { nextMastery, status } from '../js/core/mastery.js';
import { store } from '../js/core/store.js';
import { makeQuestion, newSpec } from '../js/core/registry.js';
import '../js/psycho/calcul.js';
test('mastery requires twenty correct-level observations', () => {
  store.update(s => { s.mastery['psy.calcul'] = {lvl:3,n:100,last:Date.now(),h:Array.from({length:19},()=>[3,1])}; });
  assert.notEqual(status('psy.calcul').id,'master');
  store.update(s => s.mastery['psy.calcul'].h.push([3,1]));
  assert.equal(status('psy.calcul').id,'master');
});
test('advanced arithmetic produces finite reproducible answers', () => {
  for(let seed=1;seed<=1000;seed++){
    const spec=newSpec('psy.calcul',3,seed);
    const q=makeQuestion(spec);
    assert.ok(Number.isFinite(q.answer));
    assert.equal(q.answer,makeQuestion(spec).answer);
    assert.equal(q.timeLimit,20);
  }
});
