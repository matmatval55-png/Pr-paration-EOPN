import { store } from '../core/store.js';
import { streak, bestStreak, moduleSummary, dailySeries, weakPoints, genSummary, totalAnswers } from '../core/stats.js';
import { srsCount, dueItems } from '../core/srs.js';
import { listGens } from '../core/registry.js';
import { rateChart, hbars } from '../core/charts.js';
import { esc, pct, fmtMs } from '../core/ui.js';

const MOD_NAMES = { psycho: 'Psychotechniques', maths: 'Maths', physique: 'Physique', anglais: 'Anglais', culture: 'Culture & BIA' };
const ACTIVITY = (s) => `${(s.interview?.sessions || []).length} simulation(s) d’entretien · ${(s.sport || []).filter((x) => x.type === 'seance').length} séance(s) de sport · ${(s.sport || []).filter((x) => x.type === 'test').length} test(s) sportif(s)`;

export function renderStats(root) {
  const mods = Object.keys(MOD_NAMES).filter((m) => listGens(m).length);
  let range = 30;
  const draw = () => {
    const weak = weakPoints(6);
    const exams = store.data.exams.slice(-8).reverse();
    const timeTotal = Object.values(store.data.days).reduce((a, d) => a + d.ms, 0);
    root.innerHTML = `
      <h1>Tableau de bord</h1>
      <div class="stat-row">
        <div class="stat"><b>${streak()} 🔥</b><span>série actuelle</span></div>
        <div class="stat"><b>${bestStreak()}</b><span>meilleure série</span></div>
        <div class="stat"><b>${totalAnswers()}</b><span>réponses au total</span></div>
      </div>
      <div class="stat-row" style="margin-top:8px">
        <div class="stat"><b>${Math.round(timeTotal / 60000)}</b><span>minutes d’exercices</span></div>
        <div class="stat"><b>${dueItems().length}</b><span>révisions dues</span></div>
        <div class="stat"><b>${srsCount()}</b><span>questions en révision</span></div>
      </div>
      <div class="card">
        <h3>Progression</h3>
        <div class="seg" style="margin-bottom:8px"><button data-r="14" class="${range === 14 ? 'on' : ''}">14 j</button><button data-r="30" class="${range === 30 ? 'on' : ''}">30 j</button><button data-r="90" class="${range === 90 ? 'on' : ''}">90 j</button></div>
        ${rateChart(dailySeries(null, range))}
      </div>
      <div class="card"><h3>Par module (${range} j)</h3>${hbars(mods.map((m) => {
        const s = moduleSummary(m, range);
        return { label: MOD_NAMES[m], rate: s.rate, sub: `${s.n} rép. · ${fmtMs(s.avgMs)}/q` };
      }))}</div>
      <div class="card"><h3>🎯 Points faibles détectés</h3>
        ${weak.length ? `<p class="small muted">Exercices avec moins de 65 % de réussite (au moins 5 réponses sur 30 jours).</p><div class="list">${weak.map((w) => `<a class="row-link" href="#/train/${w.id}"><span class="grow"><span class="title">${esc(w.title)}</span><br><span class="sub">${MOD_NAMES[w.module] || w.module} · ${w.n} réponses</span></span><span class="badge ko">${pct(w.rate)}</span><span class="chev">›</span></a>`).join('')}</div>` : '<p class="muted">Rien à signaler pour l’instant (il faut au moins 5 réponses par exercice).</p>'}
      </div>
      ${mods
        .map(
          (m) => `<details class="card"><summary><b>Détail : ${MOD_NAMES[m]}</b></summary>${hbars(
            listGens(m).map((g) => {
              const s = genSummary(g.id, range);
              return { label: g.title, rate: s.rate, sub: s.n ? `${s.n} rép. · ${fmtMs(s.avgMs)}` : 'jamais fait' };
            }),
          )}</details>`,
        )
        .join('')}
      <div class="card small"><b>Autres activités :</b> ${ACTIVITY(store.data)}</div>
      <div class="card"><h3>Examens blancs</h3>${exams.length ? exams.map((e) => `<div class="section-res"><span>${esc(e.title)}<br><span class="small muted">${new Date(e.ts).toLocaleDateString('fr-FR')} · niveau ${e.level}</span></span><b>${Math.round((e.ok / e.n) * 100)} %</b></div>`).join('') : '<p class="muted">Aucun examen blanc pour l’instant.</p>'}</div>`;
    root.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => ((range = Number(b.dataset.r)), draw())));
  };
  draw();
}
