// Page d'entraînement générique pour un générateur (psycho, maths, physique…).
import { levelFor } from '../core/mastery.js';
import { getGen, newSpec } from '../core/registry.js';
import { runQuiz, summaryHTML } from '../core/quiz.js';
import { genSummary } from '../core/stats.js';
import { el, esc, pct, fmtMs } from '../core/ui.js';

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function seg(name, options, value) {
  return `<div class="seg" data-name="${name}">${options.map(([v, l]) => `<button type="button" data-v="${v}" class="${String(v) === String(value) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
}
function bindSeg(root, state) {
  root.querySelectorAll('.seg').forEach((s) =>
    s.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      s.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      state[s.dataset.name] = b.dataset.v;
    }),
  );
}

// Choix du niveau suivant en mode « auto » : +1 après 3 réussites d'affilée, −1 après 2 échecs.
export function adaptiveLevel(history, start = 1, max = 3) {
  let lvl = start, okRun = 0, koRun = 0;
  for (const h of history) {
    if (h.ok) (okRun++, (koRun = 0));
    else (koRun++, (okRun = 0));
    if (okRun >= 3 && lvl < max) (lvl++, (okRun = 0));
    if (koRun >= 2 && lvl > 1) (lvl--, (koRun = 0));
  }
  return lvl;
}

export function renderTrain(root, genId, { back = '#/psycho', progressive = false, defaults = {} } = {}) {
  const g = getGen(genId);
  if (!g) {
    root.innerHTML = '<p>Exercice introuvable.</p>';
    return;
  }
  const s = genSummary(genId, 30);
  const state = { level: defaults.level ?? 'auto', count: defaults.count ?? '10', chrono: defaults.chrono ?? (g.module === 'psycho' ? '1' : '0') };
  if (progressive) state.level = 'prog';
  root.innerHTML = '';
  const page = el(`
    <div>
      <a href="${back}" class="small">← Retour</a>
      <h1>${esc(g.title)}</h1>
      ${g.desc ? `<p class="muted">${esc(g.desc)}</p>` : ''}
      <div class="stat-row">
        <div class="stat"><b>${s.n}</b><span>réponses (30 j)</span></div>
        <div class="stat"><b>${pct(s.rate)}</b><span>réussite</span></div>
        <div class="stat"><b>${fmtMs(s.avgMs)}</b><span>temps moyen</span></div>
      </div>
      <div class="card">
        ${g.levels > 1 ? `<div class="field"><label>Niveau</label>${seg('level', [...(progressive ? [['prog', 'Progressif']] : [['auto', 'Auto']]), ...[[1, 'Facile'], [2, 'Moyen'], [3, 'Difficile']].slice(0, g.levels)], state.level)}</div>` : ''}
        <div class="field"><label>Nombre de questions</label>${seg('count', [[10, '10'], [20, '20'], ['inf', 'Illimité']], state.count)}</div>
        <div class="field"><label>Chronomètre par question</label>${seg('chrono', [[1, 'Oui'], [0, 'Non']], state.chrono)}</div>
        <p class="small muted">${g.bank ? `Banque de ${[1, 2, 3].slice(0, g.levels).reduce((a, l) => a + g.bankSize(l), 0)} questions, tirées sans répétition jusqu’à épuisement.` : progressive ? 'Progressif : 3 exercices faciles, 4 moyens puis 3 difficiles.' : g.levels > 1 ? `Auto : tu démarres à ton niveau mémorisé (${['', 'facile', 'moyen', 'difficile'][levelFor(genId)]}) ; il monte après 3 bonnes réponses d’affilée et baisse après 2 erreurs.` : ''} Correction détaillée après chaque réponse.</p>
        <button class="btn primary block" data-start>Commencer</button>
      </div>
    </div>`);
  root.append(page);
  bindSeg(page, state);
  page.querySelector('[data-start]').onclick = () => start();

  function start() {
    const total = state.count === 'inf' ? null : Number(state.count);
    const prog = [1, 1, 1, 2, 2, 2, 2, 3, 3, 3];
    const decks = {};
    // banques : on parcourt toutes les questions dans un ordre aléatoire avant de répéter
    const draw = (lvl) => {
      if (!decks[lvl]?.length) decks[lvl] = shuffle([...Array(g.bankSize(lvl)).keys()]);
      return decks[lvl].pop();
    };
    if (g.levels === 1) state.level = '1';
    document.body.classList.add('in-quiz');
    runQuiz(root, {
      title: g.title,
      total,
      mode: 'train',
      noTimer: state.chrono !== '1',
      next(i, history) {
        if (total && i >= total) return null;
        let lvl;
        if (state.level === 'auto') lvl = adaptiveLevel(history, levelFor(genId), g.levels);
        else if (state.level === 'prog') lvl = prog[Math.min(prog.length - 1, Math.floor((i / (total || 10)) * prog.length))];
        else lvl = Number(state.level);
        lvl = Math.min(lvl, g.levels);
        return g.bank ? newSpec(genId, lvl, draw(lvl)) : newSpec(genId, lvl);
      },
      onFinish(history) {
        document.body.classList.remove('in-quiz');
        showSummary(history);
      },
      onQuit() {
        document.body.classList.remove('in-quiz');
        renderTrain(root, genId, { back, progressive, defaults: state });
      },
    });
  }

  function showSummary(history) {
    root.innerHTML = '';
    const sum = el(`<div>${summaryHTML(history, { title: g.title })}<div class="btn-row"><button class="btn primary" data-again>Recommencer</button><a class="btn" href="${back}">Retour</a></div></div>`);
    sum.querySelector('[data-again]').onclick = () => start();
    root.append(sum);
    scrollTo(0, 0);
  }
}
