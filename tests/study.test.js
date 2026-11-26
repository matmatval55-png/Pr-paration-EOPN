import test from 'node:test';
import assert from 'node:assert/strict';
import { studyCatalog, studyPlan } from '../js/pages/study.js';
test('guided study excludes courses without a linked generator',()=>{
 const sections=[{id:'maths',fiches:[{key:'a'},{key:'b',train:'#/train/c'},{key:'missing'}]}];
 const catalog=studyCatalog(sections,id=>['a','c'].includes(id));
 assert.deepEqual(catalog.map(x=>x.id),['a','c']);
});
test('guided study prioritizes older courses and respects subject and duration',()=>{
 const pool=[{s:{id:'maths'},f:{key:'a'}},{s:{id:'maths'},f:{key:'b'}},{s:{id:'anglais'},f:{key:'c'}}];
 assert.deepEqual(studyPlan(pool,15,'maths',{a:{studyAt:10}}).map(x=>x.f.key),['b']);
 assert.equal(studyPlan(pool,30,'all').length,3);
});
