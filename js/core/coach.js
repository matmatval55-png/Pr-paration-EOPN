// Coach : compose une séance personnalisée à partir des résultats précédents.
// Mélange : révisions dues (questions ratées) + points faibles + exercices non travaillés depuis longtemps
// + consolidation et découverte, chacun au niveau mémorisé (mastery.js).
import { store } from './store.js';
import { listGens, getGen, newSpec } from './registry.js';
import { dueItems } from './srs.js';
import { genSummary } from './stats.js';
import { masteryOf, levelFor, recentRate, daysSince, status } from './mastery.js';
import { makeRng, newSeed } from './rng.js';

export const COACH_MODULES = { psycho: 'Psychotechniques', maths: 'Maths', physique: 'Physique', anglais: 'Anglais', culture: 'Culture & BIA' };
// Poids de chaque module : psychotechniques prioritaires (épreuve éliminatoire), maths renforcées (point faible déclaré).
export const MODULE_WEIGHT = { psycho: 1.6, maths: 1.4, anglais: 1, physique: 0.9, culture: 0.9 };

const fmtPct = (r) => `${Math.round(r * 100)} %`;

// Priorité d'un exercice et raison principale (affichée à l'utilisateur).
export function priority(g, now = Date.now()) {
  const m = masteryOf(g.id);
  const st = status(g.id);
  const s30 = genSummary(g.id, 30);
  const rate = recentRate(m) ?? s30.rate;
  const d = daysSince(m.last, now);
  let p = 0;
  let reason;
  if (!m.n && !s30.n) {
    p = 1.2;
    reason = { ico: '🆕', txt: 'jamais travaillé : découverte' };
  } else if (st.id === 'weak' || (rate != null && rate < 0.65)) {
    p = 4 + (0.65 - (rate ?? 0.5)) * 6;
    reason = { ico: '🎯', txt: `point faible (${fmtPct(rate ?? 0)} de réussite récente)` };
  } else if (st.id === 'master' || st.id === 'rusty') {
    p = st.id === 'rusty' ? 1.5 + Math.min(2, d / 14) : 0.3;
    reason = { ico: '🔧', txt: st.id === 'rusty' ? `maîtrisé mais pas revu depuis ${d} j` : 'maîtrisé : simple entretien' };
  } else {
    p = 2 + Math.min(2.5, (d ?? 0) / 4);
    reason = d >= 5 ? { ico: '⏳', txt: `pas travaillé depuis ${d} j` } : { ico: '📈', txt: `consolidation au niveau ${levelFor(g.id)}` };
  }
  p *= MODULE_WEIGHT[g.module] ?? 1;
  return { p, reason };
}

export function candidates(module) {
  return listGens(module)
    .filter((g) => COACH_MODULES[g.module] && !g.noSrs)
    .map((g) => ({ g, ...priority(g) }))
    .sort((a, b) => b.p - a.p);
}

// Retourne { items: [{spec, gen, reason}], blocks: [{gen, title, n, level, reason}] }.
// minutes : durée visée (≈ 1,4 question par minute).
export function buildSession({ minutes = 15, module = null, seed = newSeed(), now = Date.now() } = {}) {
  const r = makeRng(seed);
  const total = Math.max(6, Math.round(minutes * 1.4));
  const items = [];
  const blocks = [];

  // 1) Révisions dues : au plus 30 % de la séance.
  const due = dueItems(now).filter((d) => !module || getGen(d.spec.gen)?.module === module);
  const nDue = Math.min(due.length, Math.round(total * 0.3));
  if (nDue) {
    for (const d of due.slice(0, nDue)) items.push({ spec: d.spec, gen: d.spec.gen, reason: { ico: '🔁', txt: 'question ratée à revoir' } });
    blocks.push({ gen: null, title: 'Révisions espacées', n: nDue, level: null, reason: { ico: '🔁', txt: `${nDue} question(s) ratée(s) précédemment` } });
  }

  // 2) Exercices choisis par priorité, avec un peu de hasard pour varier, 1 découverte maximum.
  const pool = candidates(module);
  const left = total - items.length;
  const per = left >= 18 ? 4 : 3;
  const nGens = Math.max(1, Math.ceil(left / per));
  const chosen = [];
  let discoveries = 0;
  const weighted = pool.map((c) => ({ ...c, w: c.p * (0.75 + r.next() * 0.5) })).sort((a, b) => b.w - a.w);
  // 2e passage : si les exercices déjà travaillés ne suffisent pas (débutant), on complète par des découvertes.
  for (const strict of [true, false]) {
    for (const c of weighted) {
      if (chosen.length >= nGens) break;
      if (chosen.includes(c)) continue;
      if (strict && c.reason.ico === '🆕') {
        if (discoveries >= 1) continue;
        discoveries++;
      }
      // pas plus de la moitié des exercices dans le même module (sauf séance ciblée)
      if (!module && chosen.filter((x) => x.g.module === c.g.module).length >= Math.ceil(nGens / 2)) continue;
      chosen.push(c);
    }
  }
  // répartition équitable des questions entre les exercices retenus
  chosen.forEach((c, i) => {
    const n = Math.floor(left / chosen.length) + (i < left % chosen.length ? 1 : 0);
    if (n <= 0) return;
    const level = levelFor(c.g.id);
    const bankIdx = c.g.bank ? r.shuffle([...Array(c.g.bankSize(level)).keys()]) : null;
    const specs = [];
    for (let k = 0; k < n; k++) specs.push(newSpec(c.g.id, level, bankIdx ? bankIdx[k % bankIdx.length] : newSeed()));
    c.specs = specs;
    blocks.push({ gen: c.g.id, title: c.g.title, module: c.g.module, n, level, levels: c.g.levels, reason: c.reason });
  });

  // 3) Entrelacement des exercices (meilleur pour la mémorisation qu'une série du même type).
  const queues = chosen.filter((c) => c.specs?.length).map((c) => c.specs.map((spec) => ({ spec, gen: c.g.id, reason: c.reason })));
  while (queues.some((q) => q.length)) for (const q of queues) if (q.length) items.push(q.shift());

  return { items, blocks, total: items.length };
}

// Recommandations textuelles pour la page de suivi.
export function advice(now = Date.now()) {
  const out = [];
  const data = store.data;
  const lastByModule = {};
  for (const [id, m] of Object.entries(data.mastery || {})) {
    const g = getGen(id);
    if (!g) continue;
    lastByModule[g.module] = Math.max(lastByModule[g.module] || 0, m.last || 0);
  }
  for (const [mod, name] of Object.entries(COACH_MODULES)) {
    const d = daysSince(lastByModule[mod], now);
    if (d == null) out.push({ ico: '🆕', txt: `Tu n’as encore rien fait en ${name}.`, href: `#/coach/${mod}` });
    else if (d >= 7) out.push({ ico: '⏳', txt: `${name} : rien depuis ${d} jours. Une séance ciblée de 10 min suffit à entretenir.`, href: `#/coach/${mod}` });
  }
  const weak = candidates().filter((c) => c.reason.ico === '🎯').slice(0, 3);
  for (const c of weak) out.push({ ico: '🎯', txt: `${c.g.title} : ${c.reason.txt}. Relis la fiche de cours puis refais 10 questions au niveau ${levelFor(c.g.id)}.`, href: `#/train/${c.g.id}` });
  const exams = data.exams || [];
  if (!exams.length) out.push({ ico: '📝', txt: 'Fais un premier examen blanc pour mesurer ton niveau en conditions réelles.', href: '#/exam/express' });
  else {
    const d = daysSince(exams[exams.length - 1].ts, now);
    if (d >= 14) out.push({ ico: '📝', txt: `Dernier examen blanc il y a ${d} jours : refais-en un pour mesurer tes progrès.`, href: '#/psycho' });
  }
  return out;
}

// Tendance : réussite des 7 derniers jours comparée aux 7 jours précédents.
export function trend(genId) {
  const a = genSummary(genId, 7);
  const b = genSummary(genId, 14);
  const prevN = b.n - a.n;
  if (a.n < 3 || prevN < 3) return null;
  const prev = (b.ok - a.ok) / prevN;
  return a.rate - prev;
}
