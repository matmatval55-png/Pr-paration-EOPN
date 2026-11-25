import assert from 'node:assert/strict';
import test from 'node:test';
import '../js/psycho/situations.js';
import { makeQuestion } from '../js/core/registry.js';

test('le cap proposé annule la composante traversière du vent au degré près', () => {
  let checked = 0;
  const radians = Math.PI / 180;
  for (let seed = 0; seed < 2000; seed++) {
    const question = makeQuestion({ gen: 'psy.vent', level: 3, seed });
    const data = question.prompt.match(/vitesse vraie (\d+) kt et vent du (\d+)° à (\d+) kt/);
    if (!data) continue;
    const [, tas, bearing, speed] = data.map(Number);
    const heading = Number(question.choices[question.answer].match(/\d+/)[0]);
    const residual = tas * Math.sin(heading * radians) - speed * Math.sin(bearing * radians);
    assert.ok(Math.abs(residual) <= tas * Math.sin(0.5 * radians), `graine ${seed}`);
    checked++;
  }
  assert.ok(checked > 500);
});
