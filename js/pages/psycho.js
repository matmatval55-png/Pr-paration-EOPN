import { listGens } from '../core/registry.js';
import { GROUPS, EXAMS } from '../psycho/index.js';
import { genSummary } from '../core/stats.js';
import { esc, pct } from '../core/ui.js';

const ICONS = { 'Suites logiques': '🔢', 'Raisonnement verbal': '🔤', 'Raisonnement spatial': '🧊', 'Compréhension mécanique': '⚙️', Attention: '🎯', Mémoire: '🧠', Calcul: '➗', Multitâche: '🕹️', Psychomotricité: '✈️', 'Conscience de la situation': '🛰️', Instruments: '🧭' };

export function renderPsycho(root) {
  const gens = listGens('psycho');
  root.innerHTML = `
    <h1>Tests psychotechniques</h1>
    <p class="muted">Exercices générés à l’infini, chronométrés, avec correction expliquée. Les épreuves officielles se passent sur ordinateur ; ici tout est adapté au téléphone et à la tablette.</p>
    <h2>📝 Examens blancs</h2>
    <div class="list">${EXAMS.map(
      (e) => `<a class="row-link" href="#/exam/${e.id}"><span style="font-size:1.4rem">⏱️</span><span class="grow"><span class="title">${esc(e.title)}</span><br><span class="sub">${esc(e.desc)}</span></span><span class="chev">›</span></a>`,
    ).join('')}</div>
    <a class="row-link" href="#/personnalite" style="margin-top:8px"><span style="font-size:1.4rem">🧠</span><span class="grow"><span class="title">Personnalité et psychologue</span><br><span class="sub">Questionnaire d’entraînement et préparation de l’entretien avec l’officier psychologue</span></span><span class="chev">›</span></a>
    ${GROUPS.map((gr) => {
      const items = gens.filter((g) => g.group === gr);
      return `<h2>${ICONS[gr] || ''} ${esc(gr)}</h2><div class="list">${items
        .map((g) => {
          const s = genSummary(g.id, 30);
          const cls = s.rate == null ? '' : s.rate < 0.5 ? 'ko' : s.rate < 0.75 ? 'warn' : 'ok';
          return `<a class="row-link" href="#/train/${g.id}"><span class="grow"><span class="title">${esc(g.title)}</span><br><span class="sub">${esc(g.desc || '')}</span></span><span class="badge ${cls}">${s.n ? pct(s.rate) : 'nouveau'}</span><span class="chev">›</span></a>`;
        })
        .join('')}</div>`;
    }).join('')}
    <div class="card small muted">
      <b>Limites :</b> le test palonnier et l’épreuve psychomotrice officielle (« système d’évaluation candidat pilote ») se passent avec un vrai manche et de vrais palonniers. L’exercice « Manche et palonniers » (téléphone incliné + boutons) et le multitâche s’en approchent, sans les remplacer.
    </div>`;
}
