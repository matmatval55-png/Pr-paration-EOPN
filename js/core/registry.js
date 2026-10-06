// Registre de tous les générateurs d'exercices.
// Un générateur : { id, module, group, title, desc, levels, make(level, rng) -> question }
import { makeRng, newSeed } from './rng.js';

const gens = new Map();

export function register(def) {
  if (gens.has(def.id)) throw new Error('Générateur en double : ' + def.id);
  gens.set(def.id, { levels: 3, ...def });
}

export function getGen(id) {
  return gens.get(id);
}

export function listGens(module) {
  return [...gens.values()].filter((g) => !module || g.module === module);
}

// spec = { gen, level, seed } -> question complète, reproductible.
export function makeQuestion(spec) {
  const g = gens.get(spec.gen);
  if (!g) throw new Error('Générateur inconnu : ' + spec.gen);
  const q = g.make(spec.level, makeRng(spec.seed), spec);
  q.spec = spec;
  q.genTitle = g.title;
  q.module = g.module;
  return q;
}

export function newSpec(gen, level, seed = newSeed()) {
  return { gen, level, seed };
}
