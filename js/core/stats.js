// Statistiques : enregistrement des réponses, séries de jours, points faibles.
import { store, today } from './store.js';
import { getGen } from './registry.js';

export function record(genId, ok, ms) {
  const d = today();
  store.update((s) => {
    const g = (s.stats[genId] ||= {});
    const row = (g[d] ||= [0, 0, 0]);
    row[0] += 1;
    row[1] += ok ? 1 : 0;
    row[2] += Math.round(ms || 0);
    const day = (s.days[d] ||= { n: 0, ok: 0, ms: 0 });
    day.n += 1;
    day.ok += ok ? 1 : 0;
    day.ms += Math.round(ms || 0);
  });
}

function dayOffset(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return today(d);
}

// Série : nombre de jours consécutifs avec au moins un exercice (aujourd'hui ou hier inclus).
export function streak() {
  const days = store.data.days;
  let i = days[today()] ? 0 : 1;
  let n = 0;
  while (days[dayOffset(i)]) {
    n++;
    i++;
  }
  return n;
}

export function bestStreak() {
  const keys = Object.keys(store.data.days).sort();
  let best = 0;
  let cur = 0;
  let prev = null;
  for (const k of keys) {
    if (prev) {
      const p = new Date(prev);
      p.setDate(p.getDate() + 1);
      cur = today(p) === k ? cur + 1 : 1;
    } else cur = 1;
    best = Math.max(best, cur);
    prev = k;
  }
  return best;
}

// Agrégat d'un générateur sur les `days` derniers jours.
export function genSummary(genId, days = 3650) {
  const g = store.data.stats[genId] || {};
  const from = dayOffset(days - 1);
  let n = 0;
  let ok = 0;
  let ms = 0;
  for (const [d, r] of Object.entries(g)) {
    if (d >= from) {
      n += r[0];
      ok += r[1];
      ms += r[2];
    }
  }
  return { n, ok, rate: n ? ok / n : null, avgMs: n ? ms / n : null };
}

export function moduleSummary(module, days = 3650) {
  let n = 0;
  let ok = 0;
  let ms = 0;
  for (const id of Object.keys(store.data.stats)) {
    const g = getGen(id);
    if (!g || g.module !== module) continue;
    const s = genSummary(id, days);
    n += s.n;
    ok += s.ok;
    ms += s.avgMs ? s.avgMs * s.n : 0;
  }
  return { n, ok, rate: n ? ok / n : null, avgMs: n ? ms / n : null };
}

// Série quotidienne (taux de réussite) pour les graphiques.
export function dailySeries(module, days = 30) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = dayOffset(i);
    let n = 0;
    let ok = 0;
    for (const [id, g] of Object.entries(store.data.stats)) {
      const def = getGen(id);
      if (module && (!def || def.module !== module)) continue;
      if (g[d]) {
        n += g[d][0];
        ok += g[d][1];
      }
    }
    out.push({ d, n, rate: n ? ok / n : null });
  }
  return out;
}

// Points faibles : exercices pratiqués (≥ 5 réponses sur 30 jours) avec réussite < 65 %,
// triés du plus faible au moins faible.
export function weakPoints(limit = 5) {
  const out = [];
  for (const id of Object.keys(store.data.stats)) {
    const g = getGen(id);
    if (!g) continue;
    const s = genSummary(id, 30);
    if (s.n >= 5 && s.rate < 0.65) out.push({ id, title: g.title, module: g.module, ...s });
  }
  return out.sort((a, b) => a.rate - b.rate).slice(0, limit);
}

export function totalAnswers() {
  return Object.values(store.data.days).reduce((a, d) => a + d.n, 0);
}
