// Coach : séance personnalisée selon les résultats précédents, et page de suivi détaillé.
import { buildSession, advice, trend, COACH_MODULES, candidates } from '../core/coach.js';
import { masteryOf, masteryScore, status, recentRate, daysSince, levelFor } from '../core/mastery.js';
import { runQuiz, summaryHTML } from '../core/quiz.js';
import { listGens, getGen } from '../core/registry.js';
import { genSummary } from '../core/stats.js';
import { store } from '../core/store.js';
import { lineChart } from '../core/charts.js';
import { el, esc, pct, fmtMs } from '../core/ui.js';
import { SECTIONS } from '../cours/index.js';

const LVL = ['', 'Facile', 'Moyen', 'Difficile'];

// Fiche de cours associée à un exercice (lien « relire le cours »).
export function ficheFor(genId) {
  for (const s of SECTIONS) for (const f of s.fiches) if (f.key === genId || f.train === `#/train/${genId}`) return { href: `#/fiche/${s.id}/${f.id}`, title: f.title };
  return null;
}

function seg(name, options, value) {
  return `<div class="seg wrap" data-name="${name}">${options.map(([v, l]) => `<button type="button" data-v="${v}" class="${String(v) === String(value) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
}

const lvlBadge = (genId) => {
  const g = getGen(genId);
  if (!g || (g.levels || 1) < 2) return '';
  return `<span class="badge">niv. ${levelFor(genId)}/${g.levels}</span>`;
};

export function renderCoach(root, module = null) {
  const state = { minutes: store.data.settings.coachMinutes || 15, module: module || 'all' };
  let plan = null;
  const draw = () => {
    plan = buildSession({ minutes: Number(state.minutes), module: state.module === 'all' ? null : state.module });
    root.innerHTML = '';
    const page = el(`<div>
      <h1>🧭 Séance coach</h1>
      <p class="muted">Une séance construite à partir de <b>tes résultats</b> : les questions ratées à revoir, tes points faibles, ce que tu n’as pas travaillé depuis longtemps, chacun à <b>ton niveau</b> actuel. Le niveau monte après 4 bonnes réponses sur 5 et baisse après 2 erreurs d’affilée, et il est mémorisé d’une séance à l’autre.</p>
      <div class="card">
        <div class="field"><label>Durée</label>${seg('minutes', [[10, '10 min'], [15, '15 min'], [25, '25 min'], [40, '40 min']], state.minutes)}</div>
        <div class="field"><label>Matière</label>${seg('module', [['all', 'Tout'], ...Object.keys(COACH_MODULES).map((k) => [k, { psycho: 'Psycho', maths: 'Maths', physique: 'Physique', anglais: 'Anglais', culture: 'Culture' }[k]])], state.module)}</div>
      </div>
      <div class="card"><h3>Programme (${plan.total} questions)</h3>
        <div class="list">${plan.blocks
          .map(
            (b) => `<div class="row-link" style="cursor:default"><span style="font-size:1.3rem">${b.reason.ico}</span><span class="grow"><span class="title">${esc(b.title)} · ${b.n} q.</span><br><span class="sub">${esc(b.reason.txt)}${b.level && b.levels > 1 ? ` · niveau ${LVL[b.level] || b.level}` : ''}</span></span></div>`,
          )
          .join('')}</div>
        <p class="small muted">Les exercices sont mélangés (entrelacement) : c’est plus difficile sur le moment, mais on retient mieux, et c’est plus proche du vrai test.</p>
        <button class="btn primary block" data-go>Commencer la séance</button>
        <button class="btn block" data-redo style="margin-top:8px">🎲 Proposer une autre séance</button>
      </div>
      <a class="btn block" href="#/suivi">📈 Voir mon suivi détaillé</a>
    </div>`);
    root.append(page);
    page.querySelectorAll('.seg').forEach((s) =>
      s.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        state[s.dataset.name] = b.dataset.v;
        if (s.dataset.name === 'minutes') store.update((d) => (d.settings.coachMinutes = Number(b.dataset.v)));
        draw();
      }),
    );
    page.querySelector('[data-redo]').onclick = draw;
    page.querySelector('[data-go]').onclick = () => start(plan);
  };

  function start(p) {
    const before = Object.fromEntries(p.blocks.filter((b) => b.gen).map((b) => [b.gen, levelFor(b.gen)]));
    document.body.classList.add('in-quiz');
    runQuiz(root, {
      title: 'Séance coach',
      total: p.items.length,
      mode: 'train',
      next: (i) => p.items[i]?.spec || null,
      onFinish(history) {
        document.body.classList.remove('in-quiz');
        root.innerHTML = '';
        root.append(el(`<div>${summaryHTML(history, { title: 'Bilan de la séance' })}${evolutionHTML(before, history)}<a class="btn primary block" href="#/coach">Nouvelle séance</a><a class="btn block" href="#/suivi" style="margin-top:8px">📈 Mon suivi</a></div>`));
      },
      onQuit() {
        document.body.classList.remove('in-quiz');
        draw();
      },
    });
  }
  draw();
}

// Bilan par exercice : réussite de la séance et changement de niveau.
export function evolutionHTML(before, history) {
  const by = {};
  for (const h of history) {
    const r = (by[h.spec.gen] ||= { n: 0, ok: 0 });
    r.n++;
    r.ok += h.ok ? 1 : 0;
  }
  const rows = Object.entries(by).map(([id, r]) => {
    const g = getGen(id);
    const b = before[id];
    const a = levelFor(id);
    const ch = b == null || (g.levels || 1) < 2 ? '' : a > b ? `<span class="badge ok">niveau ${b} → ${a} ⬆</span>` : a < b ? `<span class="badge warn">niveau ${b} → ${a} ⬇</span>` : `<span class="badge">niveau ${a}</span>`;
    const f = r.ok / r.n < 0.6 ? ficheFor(id) : null;
    return `<div class="section-res"><span>${esc(g.title)}<br><span class="small muted">${r.ok}/${r.n} ${f ? `· <a href="${f.href}">relire le cours</a>` : ''}</span></span>${ch}</div>`;
  });
  return rows.length ? `<div class="card"><h3>Évolution par exercice</h3>${rows.join('')}<p class="small muted">Prochaine séance : le coach tiendra compte de ces résultats.</p></div>` : '';
}

const bar = (v) => `<div class="mbar"><div style="width:${v}%"></div></div>`;
const trendTxt = (t) => (t == null ? '' : t > 0.05 ? `<span class="trend up">▲ ${Math.round(t * 100)} pts</span>` : t < -0.05 ? `<span class="trend down">▼ ${Math.round(-t * 100)} pts</span>` : '<span class="trend">= stable</span>');

export function renderSuivi(root) {
  const mods = Object.keys(COACH_MODULES).filter((m) => listGens(m).length);
  const adv = advice();
  const exams = store.data.exams || [];
  const byExam = {};
  for (const e of exams) (byExam[e.id || e.title] ||= []).push(e);
  const modScore = (m) => {
    const gs = listGens(m).filter((g) => !g.noSrs);
    return gs.length ? Math.round(gs.reduce((a, g) => a + masteryScore(g.id), 0) / gs.length) : 0;
  };
  const counts = (m) => {
    const c = { master: 0, weak: 0, new: 0, learning: 0, rusty: 0 };
    for (const g of listGens(m).filter((g) => !g.noSrs)) c[status(g.id).id]++;
    return c;
  };
  root.innerHTML = `
    <h1>📈 Mon suivi</h1>
    <p class="muted">Ta maîtrise exercice par exercice : niveau atteint, réussite récente, évolution sur 7 jours. Tout est calculé à partir de tes réponses, sur ton téléphone.</p>
    <a class="row-link" href="#/coach" style="border-color:var(--accent)"><span style="font-size:1.4rem">🧭</span><span class="grow"><span class="title">Lancer une séance coach</span><br><span class="sub">Exercices choisis selon ces résultats</span></span><span class="chev">›</span></a>
    ${adv.length ? `<div class="card"><h3>💡 Conseils du coach</h3><div class="list">${adv.map((a) => `<a class="row-link" href="${a.href}"><span>${a.ico}</span><span class="grow small">${esc(a.txt)}</span><span class="chev">›</span></a>`).join('')}</div></div>` : ''}
    <div class="card"><h3>Maîtrise par matière</h3>${mods
      .map((m) => {
        const c = counts(m);
        const v = modScore(m);
        return `<div class="mrow"><div class="mrow-h"><b>${COACH_MODULES[m]}</b><span>${v} %</span></div>${bar(v)}<div class="small muted">✅ ${c.master} maîtrisé(s) · 🎯 ${c.weak} fragile(s) · 🔧 ${c.rusty} à entretenir · 🆕 ${c.new} jamais fait(s)</div></div>`;
      })
      .join('')}</div>
    ${Object.keys(byExam).length ? `<div class="card"><h3>Examens blancs : évolution</h3>${Object.values(byExam)
      .map((list) => lineChart(list.slice(-10).map((e) => ({ d: new Date(e.ts).toISOString().slice(0, 10), v: Math.round((e.ok / e.n) * 100) })), 100, `${list[0].title} (%)`))
      .join('')}</div>` : ''}
    ${mods
      .map(
        (m) => `<details class="card" ${m === 'psycho' ? 'open' : ''}><summary><b>${COACH_MODULES[m]} : détail</b></summary><div class="list">${listGens(m)
          .filter((g) => !g.noSrs)
          .map((g) => {
            const mm = masteryOf(g.id);
            const st = status(g.id);
            const s = genSummary(g.id, 30);
            const d = daysSince(mm.last);
            return `<a class="row-link mitem" href="#/train/${g.id}"><span class="grow"><span class="title">${esc(g.title)}</span> ${lvlBadge(g.id)} <span class="badge ${st.cls}">${st.label}</span>${bar(masteryScore(g.id))}<span class="sub">${mm.n ? `récent ${pct(recentRate(mm))} · ${s.n} rép./30 j · ${fmtMs(s.avgMs)}/q · ${d === 0 ? 'aujourd’hui' : `il y a ${d} j`}` : 'jamais fait'} ${trendTxt(trend(g.id))}</span></span><span class="chev">›</span></a>`;
          })
          .join('')}</div></details>`,
      )
      .join('')}
    <div class="card small muted"><b>Comment c’est calculé ?</b> Le score de maîtrise combine le niveau atteint (facile → difficile) et la réussite sur les 12 dernières réponses. « Fragile » = moins de 60 % de réussite récente. « Maîtrisé » = niveau maximal avec au moins 80 % de réussite ; au-delà de 14 jours sans pratique, il passe « à entretenir ». La tendance compare les 7 derniers jours aux 7 précédents.</div>`;
}

// Bloc d'accueil : aperçu de la prochaine séance coach.
export function coachTeaser() {
  const top = candidates().slice(0, 2);
  if (!top.length) return '';
  return `<a class="row-link" href="#/coach" style="margin-top:12px;border-color:var(--accent)"><span style="font-size:1.4rem">🧭</span><span class="grow"><span class="title">Séance coach personnalisée</span><br><span class="sub">${top.map((c) => `${c.reason.ico} ${esc(c.g.title)}`).join(' · ')}</span></span><span class="chev">›</span></a>`;
}
