import { store, today } from '../core/store.js';
import { streak, weakPoints, totalAnswers } from '../core/stats.js';
import { dueItems } from '../core/srs.js';
import { esc, pct } from '../core/ui.js';
import { MODULES } from './modules.js';
import { todayBlocks, suggestion } from './planning.js';
import { MODS } from '../planning/plan.js';
import { backupDue, downloadBackup } from '../core/reports.js';

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const t = new Date(today() + 'T00:00:00');
  return Math.round((d - t) / 86400000);
}

function todayHTML() {
  const { plan, blocks, sport } = todayBlocks();
  const done = store.data.planning?.done?.[today()] || {};
  if (!blocks.length && !sport) return `<div class="card small">🗓️ Aujourd’hui : repos prévu dans ton <a href="#/planning">planning</a>.</div>`;
  return `<div class="card"><h3>🗓️ Au programme aujourd’hui</h3><div class="list">${blocks
    .map((b, i) => {
      const sg = suggestion(b.mod, plan.phase.id, i + ((new Date().getDay() + 6) % 7));
      return `<a class="row-link" href="${sg.href}"><span>${MODS[b.mod].ico}</span><span class="grow"><span class="title">${MODS[b.mod].label} · ${b.min} min ${done[`${b.mod}-${i}`] ? '✔' : ''}</span><br><span class="sub">${esc(sg.txt || '')}</span></span><span class="chev">›</span></a>`;
    })
    .join('')}${sport ? '<a class="row-link" href="#/sport"><span>🏃</span><span class="grow"><span class="title">Sport · 45 min</span></span><span class="chev">›</span></a>' : ''}</div></div>`;
}

export function renderHome(root) {
  const s = store.data;
  const st = streak();
  queueMicrotask(() =>
    root.querySelector('[data-backup]')?.addEventListener('click', () => {
      downloadBackup();
      renderHome(root);
    }),
  );
  const due = dueItems().length;
  const weak = weakPoints(3);
  const dleft = daysUntil(s.settings.selectionDate);
  const todayN = s.days[today()]?.n || 0;
  root.innerHTML = `
    <h1>Bonjour 👋</h1>
    <div class="stat-row">
      <div class="stat"><b>${st} 🔥</b><span>jour${st > 1 ? 's' : ''} d’affilée</span></div>
      <div class="stat"><b>${todayN}</b><span>questions aujourd’hui</span></div>
      <div class="stat"><b>${dleft == null ? '—' : dleft}</b><span>${dleft == null ? 'date à saisir' : 'jours avant J'}</span></div>
    </div>
    ${dleft == null ? `<div class="card small">📅 Saisis la date (même approximative) de ta sélection dans <a href="#/reglages">Réglages</a> pour le compte à rebours et le planning.</div>` : ''}
    ${backupDue() ? `<div class="card" style="border-color:var(--warn)"><b>💾 Pense à sauvegarder ta progression</b><p class="small">Aucun export depuis plus de 7 jours. Sur iPhone, les données d’un site peuvent être effacées s’il n’est pas installé sur l’écran d’accueil.</p><button class="btn primary block" data-backup>Exporter maintenant</button></div>` : ''}
    ${todayHTML()}
    ${
      due
        ? `<a class="row-link" href="#/revision" style="margin-top:12px;border-color:var(--accent)"><span style="font-size:1.4rem">🔁</span><span class="grow"><span class="title">Révisions du jour : ${due} question${due > 1 ? 's' : ''}</span><br><span class="sub">Les questions ratées reviennent à intervalles croissants.</span></span><span class="chev">›</span></a>`
        : ''
    }
    ${
      weak.length
        ? `<div class="card"><h3>🎯 Tes points faibles</h3><div class="list">${weak
            .map((w) => `<a class="row-link" href="#/train/${w.id}"><span class="grow"><span class="title">${esc(w.title)}</span><br><span class="sub">${w.n} réponses sur 30 jours</span></span><span class="badge ko">${pct(w.rate)}</span></a>`)
            .join('')}</div></div>`
        : totalAnswers() < 20
          ? `<div class="card"><h3>🚀 Par où commencer ?</h3><p>1. Fais un <a href="#/exam/express">examen express</a> pour situer ton niveau.<br>2. Commence le chapitre <a href="#/maths/calcul">Calcul et priorités</a> en maths.<br>3. Fais un premier <a href="#/sport">test sportif</a> pour connaître ton niveau.<br>4. Reviens chaque jour, même 15 minutes : la régularité compte plus que la durée.</p></div>`
          : ''
    }
    <h2>Modules</h2>
    <div class="grid">${MODULES.map(
      (m) => `<a class="tile" href="${m.href}"><span class="ico">${m.ico}</span><b>${esc(m.title)}</b><span class="small">${esc(m.sub)}</span></a>`,
    ).join('')}</div>
    <div class="card small"><a href="#/selection">ℹ️ Comment se déroule la sélection EOPN ?</a> — résumé des sources officielles, avec ce qui est confirmé et ce qui reste à vérifier.</div>`;
}
