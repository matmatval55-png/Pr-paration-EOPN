import {mountScratchpad} from '../core/scratchpad.js';
// Page d'entraînement générique pour un générateur (psycho, maths, physique…).
import { makePicker, remaining, resetHistory, seenTotal } from '../core/seen.js';
import { levelFor } from '../core/mastery.js';
import { getGen, newSpec } from '../core/registry.js';
import { runQuiz, summaryHTML } from '../core/quiz.js';
import { genSummary } from '../core/stats.js';
import { el, esc, pct, fmtMs } from '../core/ui.js';

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
        ${g.levels > 1 ? `<div class="field"><label>Niveau</label>${seg('level', [...(progressive ? [['prog', 'Progressif']] : [['auto', 'Auto']]), ...[[1, 'Facile'], [2, 'Moyen'], [3, 'Difficile'], [4, 'Expert'], [5, 'Haute intensité']].slice(0, g.levels)], state.level)}</div>` : ''}
        <div class="field"><label>Nombre de questions</label>${seg('count', [[10, '10'], [20, '20'], ['inf', 'Illimité']], state.count)}</div>
        <div class="field"><label>Chronomètre par question</label>${seg('chrono', [[1, 'Oui'], [0, 'Non']], state.chrono)}</div>
        <p class="small muted">${g.bank ? `Banque de ${g.bankSize(0)} questions, dont <b>${remaining(genId, 0)} jamais vues</b>. Tu ne retombes jamais deux fois sur la même question.` : progressive ? 'Progressif : 3 exercices faciles, 4 moyens puis 3 difficiles.' : g.levels > 1 ? `Auto : tu démarres à ton niveau mémorisé (${levelFor(genId)}) ; il monte après 4 réussites sur 5 au niveau actuel et baisse après 2 erreurs.` : ''} Correction détaillée après chaque réponse.</p>
        <button class="btn primary block" data-start>Commencer</button>
      </div>
    </div>`);
  root.append(page);
  bindSeg(page, state);
  page.querySelector('[data-start]').onclick = () => start();

  function start() {
    const total = state.count === 'inf' ? null : Number(state.count);
    const prog = [1, 1, 1, 2, 2, 2, 2, 3, 3, 3];
    // jamais une question déjà vue : historique complet (voir core/seen.js)
    const pick = makePicker();
    let exhausted = false;
    const levelAt = (i) => {
      let lvl;
      if (state.level === 'auto') lvl = levelFor(genId);
      else if (state.level === 'prog') lvl = prog[Math.min(prog.length - 1, Math.floor((i / (total || 10)) * prog.length))];
      else lvl = Number(state.level);
      return Math.min(lvl, g.levels);
    };
    // si le niveau demandé est épuisé, on essaie les autres niveaux avant d'abandonner
    const draw = (lvl) => {
      for (const l of [lvl, ...Array.from({ length: g.levels }, (_, i) => i + 1).filter((x) => x !== lvl)]) {
        const sp = pick(genId, l);
        if (sp) return sp;
      }
      exhausted = true;
      return null;
    };
    if (g.levels === 1) state.level = '1';
    const first = draw(levelAt(0));
    if (!first) return showExhausted();
    document.body.classList.add('in-quiz');
    runQuiz(root, {
      title: g.title,
      total,
      mode: 'train',
      noTimer: state.chrono !== '1',
      next(i) {
        if (total && i >= total) return null;
        return i === 0 ? first : draw(levelAt(i));
      },
      onFinish(history) {
        document.body.classList.remove('in-quiz');
        showSummary(history, exhausted);
      },
      onQuit() {
        document.body.classList.remove('in-quiz');
        renderTrain(root, genId, { back, progressive, defaults: state });
      },
    });
    if(['maths','physique'].includes(g.module))mountScratchpad(root,genId);
  }

  // Plus aucune question nouvelle pour cet exercice.
  function showExhausted() {
    root.innerHTML = '';
    const box = el(`<div><a href="${back}" class="small">← Retour</a><h1>${esc(g.title)}</h1>
      <div class="card"><h3>Tu as fait toutes les questions de cet exercice</h3>
        <p>${seenTotal(genId)} questions différentes vues. Pour que tu ne retombes jamais sur une question identique, le site n’en repropose aucune.</p>
        <p class="small muted">Tu peux revoir tes erreurs dans les Révisions, passer à un autre exercice, ou remettre cet exercice à zéro (tu reverras alors des questions déjà vues).</p>
        <a class="btn primary block" href="#/revision">Revoir mes erreurs</a>
        <a class="btn block" href="${back}">Choisir un autre exercice</a>
        <button class="btn block danger" data-reset>Remettre cet exercice à zéro</button>
      </div></div>`);
    box.querySelector('[data-reset]').onclick = () => {
      if (!confirm('Remettre cet exercice à zéro ? Tu pourras retomber sur des questions déjà vues.')) return;
      resetHistory(genId);
      renderTrain(root, genId, { back, progressive, defaults: state });
    };
    root.append(box);
  }

  function showSummary(history, exhausted = false) {
    root.innerHTML = '';
    const sum = el(`<div>${summaryHTML(history, { title: g.title })}${exhausted ? '<div class="card small">Tu as vu <b>toutes</b> les questions de cet exercice : la séance s’arrête ici pour ne jamais te reposer une question identique.</div>' : ''}<div class="btn-row"><button class="btn primary" data-again>Recommencer</button><a class="btn" href="${back}">Retour</a></div></div>`);
    sum.querySelector('[data-again]').onclick = () => start();
    root.append(sum);
    scrollTo(0, 0);
  }
}
