// Coach : compose une séance personnalisée à partir des résultats précédents.
// Mélange : révisions dues (questions ratées) + points faibles + exercices non travaillés depuis longtemps
// + consolidation et découverte, chacun au niveau mémorisé (mastery.js).
import { makePicker } from './seen.js';
import { store } from './store.js';
import { listGens, getGen, newSpec } from './registry.js';
import { dueItems } from './srs.js';
import { genSummary, responseDiagnostics } from './stats.js';
import { masteryOf, levelFor, daysSince, status } from './mastery.js';
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
  const level = levelFor(g.id);
  const atLevel = m.h.filter(([observed]) => observed === level);
  const rate = atLevel.length ? atLevel.filter(([, ok]) => ok).length / atLevel.length : null;
  const d = daysSince(m.last, now);
  const timing = responseDiagnostics(g.id, 30, level);
  const examSample = store.data.exams.filter(({ ts }) => daysSince(ts, now) <= 30)
    .slice(-8).flatMap(({ skills }) => Array.isArray(skills) ? skills : [])
    .filter((skill) => skill?.gen === g.id && skill.level === level);
  const examN = examSample.reduce((total, skill) => total + skill.n, 0);
  const examOk = examSample.reduce((total, skill) => total + skill.ok, 0);
  let p;
  let reason;
  if (!m.n && !s30.n && !examN) {
    p = 1.2;
    reason = { ico: '🆕', txt: 'jamais évalué' };
  } else if (atLevel.length >= 5 && rate < 0.65) {
    p = 4 + (0.65 - rate) * 6;
    reason = { ico: '🎯', txt: `point faible au niveau ${level} (${fmtPct(rate)} sur ${atLevel.length} réponses)` };
  } else if (timing.n >= 5 && timing.timeouts / timing.n >= 0.25) {
    p = 4;
    reason = { ico: '🎯', txt: `${timing.timeouts} dépassements sur ${timing.n} mesures au niveau ${level}` };
  } else if (examN >= 5 && examOk / examN < 0.65) {
    p = 3.9;
    reason = { ico: '🎯', txt: `en examen au niveau ${level} : ${examOk}/${examN}, omissions comprises` };
  } else if (st.id === 'master' || st.id === 'rusty') {
    p = st.id === 'rusty' ? 1.5 + Math.min(2, d / 14) : 0.3;
    reason = { ico: '🔧', txt: st.id === 'rusty' ? `maîtrisé mais pas revu depuis ${d} j` : 'maîtrisé : simple entretien' };
  } else if (m.best > level) {
    p = 3.8;
    reason = { ico: '📉', txt: `repli du niveau ${m.best} au niveau ${level}` };
  } else {
    p = 2 + Math.min(2.5, (d ?? 0) / 4);
    reason = d >= 5 ? { ico: '⏳', txt: `pas travaillé depuis ${d} j` } : atLevel.length < 5
      ? { ico: '📊', txt: `données insuffisantes au niveau ${level} (${atLevel.length}/5)` }
      : { ico: '📈', txt: `consolidation au niveau ${level}` };
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
export function buildSession({ minutes = 15, module = null, seed = newSeed(), now = Date.now(), reviews = false } = {}) {
  const r = makeRng(seed);
  const pick = makePicker(r.next); // jamais une question déjà vue

  const total = Math.max(6, Math.round(minutes * 1.4));
  const items = [];
  const blocks = [];

  // 1) Révisions dues (seulement si demandé : ce sont volontairement des questions déjà vues).
  const due = (reviews ? dueItems(now) : []).filter((d) => !module || getGen(d.spec.gen)?.module === module);
  const nDue = Math.min(due.length, Math.round(total * 0.3));
  if (nDue) {
    for (const d of due.slice(0, nDue)) items.push({ spec: d.spec, gen: d.spec.gen, review: true, reason: { ico: '🔁', txt: 'question ratée à revoir' } });
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
  // Un exercice qui n'a plus de question nouvelle cède sa place au suivant de la liste.
  let deficit = 0;
  const fill = (c, n) => {
    const level = levelFor(c.g.id);
    const specs = [];
    for (let k = 0; k < n; k++) {
      const sp = pick(c.g.id, level);
      if (!sp) break;
      specs.push(sp);
    }
    c.specs = specs;
    if (specs.length) blocks.push({ gen: c.g.id, title: c.g.title, module: c.g.module, n: specs.length, level, levels: c.g.levels, reason: c.reason });
    return n - specs.length;
  };
  chosen.forEach((c, i) => {
    const n = Math.floor(left / chosen.length) + (i < left % chosen.length ? 1 : 0);
    if (n > 0) deficit += fill(c, n);
  });
  for (const c of weighted) {
    if (deficit <= 0) break;
    if (chosen.includes(c)) continue;
    chosen.push(c);
    deficit = fill(c, Math.min(per, deficit)) + Math.max(0, deficit - per);
  }

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
  if (!exams.length) out.push({ ico: '📝', txt: 'Fais un premier examen blanc pour mesurer ton niveau en conditions chronométrées simulées.', href: '#/exam/diagnostic-general' });
  else {
    const d = daysSince(exams[exams.length - 1].ts, now);
    if (d >= 14) out.push({ ico: '📝', txt: `Dernier examen blanc il y a ${d} jours : refais-en un pour mesurer tes progrès.`, href: '#/psycho' });
  }
  return out;
}

// Tendance : réussite des 7 derniers jours comparée aux 7 jours précédents.
export function trend(genId, days = 7) {
  const a = genSummary(genId, days);
  const b = genSummary(genId, days * 2);
  const prevN = b.n - a.n;
  if (a.n < 3 || prevN < 3) return null;
  const prev = (b.ok - a.ok) / prevN;
  return a.rate - prev;
}
