// Maîtrise par exercice : niveau atteint mémorisé d'une séance à l'autre, réussite récente,
// score de maîtrise (0-100) et statut. Mis à jour après chaque réponse (quiz.js).
import { store } from './store.js';
import { getGen } from './registry.js';

const RECENT = 12; // nombre de dernières réponses prises en compte
const DAY = 86400000;

const blank = () => ({ lvl: 1, best: 1, n: 0, ok: 0, last: 0, h: [], up: 0 });

// Règle de progression : 4 bonnes réponses sur les 5 dernières au niveau actuel → niveau +1 ;
// 2 erreurs d'affilée au niveau actuel → niveau −1. Le niveau 0 (examens, banque entière) ne compte que pour la réussite.
export function nextMastery(m, level, ok, maxLevel = 3, now = Date.now()) {
  const r = { ...blank(), ...m, h: [...(m?.h || [])] };
  r.n += 1;
  r.ok += ok ? 1 : 0;
  r.last = now;
  r.h.push([level, ok ? 1 : 0]);
  if (r.h.length > RECENT) r.h.splice(0, r.h.length - RECENT);
  if (level && level === r.lvl) {
    const atLvl = r.h.filter(([l]) => l === r.lvl);
    const last5 = atLvl.slice(-5);
    const last2 = atLvl.slice(-2);
    if (r.lvl < maxLevel && last5.length === 5 && last5.filter(([, o]) => o).length >= 4) {
      r.lvl += 1;
      r.up = now;
      r.h = r.h.map(([l, o]) => [l === r.lvl - 1 ? -l : l, o]); // les anciennes réponses ne comptent plus pour le prochain palier
    } else if (r.lvl > 1 && last2.length === 2 && !last2[0][1] && !last2[1][1]) {
      r.lvl -= 1;
      r.h = r.h.map(([l, o]) => [l === r.lvl + 1 ? -l : l, o]);
    }
  }
  r.lvl = Math.min(r.lvl, maxLevel);
  r.best = Math.max(r.best, r.lvl);
  return r;
}

export function updateMastery(spec, ok) {
  const g = getGen(spec?.gen);
  if (!g) return;
  store.update((s) => {
    s.mastery ||= {};
    s.mastery[spec.gen] = nextMastery(s.mastery[spec.gen], spec.level, ok, g.levels || 1);
  });
}

export function masteryOf(genId) {
  return { ...blank(), ...(store.data.mastery?.[genId] || {}) };
}

export function levelFor(genId) {
  const g = getGen(genId);
  return Math.min(masteryOf(genId).lvl, g?.levels || 1);
}

export function recentRate(m) {
  return m.h.length ? m.h.filter(([, o]) => o).length / m.h.length : null;
}

// Score 0-100 : chaque niveau franchi pèse autant ; la réussite récente remplit le niveau en cours.
export function masteryScore(genId) {
  const g = getGen(genId);
  const m = masteryOf(genId);
  if (!m.n) return 0;
  const L = g?.levels || 1;
  const rate = recentRate(m) ?? 0;
  return Math.round(((m.lvl - 1 + rate) / L) * 100);
}

export function daysSince(ts, now = Date.now()) {
  return ts ? Math.floor((now - ts) / DAY) : null;
}

// Statut lisible pour l'affichage.
export function status(genId) {
  const g = getGen(genId);
  const m = masteryOf(genId);
  const rate = recentRate(m);
  if (!m.n) return { id: 'new', label: 'jamais fait', cls: '' };
  if (m.n >= 8 && m.lvl >= (g?.levels || 1) && rate >= 0.8) {
    const d = daysSince(m.last);
    return d > 14 ? { id: 'rusty', label: 'maîtrisé, à entretenir', cls: 'warn' } : { id: 'master', label: 'maîtrisé', cls: 'ok' };
  }
  if (m.n >= 4 && rate < 0.6) return { id: 'weak', label: 'fragile', cls: 'ko' };
  return { id: 'learning', label: 'en progression', cls: '' };
}
