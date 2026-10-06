// Enregistre un chapitre de cours (maths, physique…) comme générateur d'exercices.
// Chapitre : { id, title, niveau, cours, methode, templates: { 1: [...], 2: [...], 3: [...] } }
import { register } from './registry.js';

export function registerChapters(module, chapters) {
  for (const ch of chapters) {
    ch.genId = `${module}.${ch.id}`;
    ch.module = module;
    register({
      id: ch.genId,
      module,
      group: ch.niveau,
      title: ch.title,
      make(level, r) {
        const q = r.pick(ch.templates[level])(r);
        q.timeLimit = q.timeLimit ?? null;
        q.explain = `<p class="small muted">Niveau ${level} · ${ch.title}</p>` + q.explain;
        return q;
      },
    });
  }
  return chapters;
}

export function templateCount(ch) {
  return Object.values(ch.templates).reduce((a, t) => a + t.length, 0);
}
