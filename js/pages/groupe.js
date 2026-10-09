// Épreuve de groupe : méthode, sujets, séance chronométrée avec rappels, grille d'évaluation.
import { SUJETS, TYPES, ROLES, CRITERES_GROUPE, METHODE_GROUPE } from '../entretien/groupe.js';
import { store } from '../core/store.js';
import { recordActivity } from '../core/stats.js';
import { el, esc } from '../core/ui.js';
import { fmtClock } from '../core/quiz.js';

const MAX = CRITERES_GROUPE.length * 4;

function sujetHTML(s) {
  return `<div class="card"><span class="badge">${TYPES[s.type].ico} ${TYPES[s.type].label}</span><h2 style="margin-top:8px">${esc(s.t)}</h2><p>${esc(s.txt)}</p><p><b>Consigne :</b> ${esc(s.consigne)}</p></div>`;
}

export function renderGroupe(root) {
  let timer = null;
  const stopTimer = () => clearInterval(timer);
  const hist = () => (store.data.interview?.groupe || []).slice(-8).reverse();
  const state = { type: 'all', idx: null, minutes: 20 };

  const pick = () => {
    const pool = SUJETS.map((s, i) => i).filter((i) => state.type === 'all' || SUJETS[i].type === state.type);
    state.idx = pool[Math.floor(Math.random() * pool.length)];
  };

  function home() {
    stopTimer();
    if (state.idx == null) pick();
    const s = SUJETS[state.idx];
    const h = hist();
    root.innerHTML = '';
    const page = el(`<div>
      <a href="#/entretien" class="small">← Entretien</a>
      <h1>👥 Épreuve de groupe</h1>
      <p class="muted">Épreuve confirmée : au moins 4 candidats, observés par le jury. Ce n’est pas la réponse qui compte, mais <b>ton comportement dans le groupe</b>. Entraîne-toi avec 3 ou 4 proches : ce module donne le sujet, le chrono, des rappels et une grille d’évaluation.</p>
      <a class="row-link" href="#/train/ent.groupe" style="border-color:var(--accent)"><span style="font-size:1.4rem">🧠</span><span class="grow"><span class="title">Quiz : les bons réflexes en groupe</span><br><span class="sub">30 situations : que faire ?</span></span><span class="chev">›</span></a>
      <div class="card"><h3>Lancer une séance</h3>
        <div class="field"><label>Type de sujet</label><div class="seg wrap" data-name="type">${[['all', 'Tous'], ...Object.entries(TYPES).map(([k, v]) => [k, v.ico + ' ' + v.label.split(' ')[0]])].map(([v, l]) => `<button data-v="${v}" class="${state.type === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>
        <div class="field"><label>Durée de la discussion</label><div class="seg" data-name="minutes">${[10, 20, 30].map((m) => `<button data-v="${m}" class="${state.minutes === m ? 'on' : ''}">${m} min</button>`).join('')}</div></div>
      </div>
      ${sujetHTML(s)}
      <div class="btn-row"><button class="btn" data-other>🎲 Autre sujet</button><button class="btn primary" data-go>▶ Commencer</button></div>
      <button class="btn block" data-eval style="margin-top:8px">📝 Évaluer sans chrono (grille pour un proche)</button>
      ${h.length ? `<div class="card"><h3>Mes dernières séances</h3>${h.map((x) => `<div class="section-res"><span class="small">${esc(SUJETS[x.s]?.t || '')}<br><span class="muted">${new Date(x.ts).toLocaleDateString('fr-FR')} · évalué par ${x.who === 'moi' ? 'moi' : 'un proche'}</span></span><b>${x.total}/${MAX}</b></div>`).join('')}${progressHint(h)}</div>` : ''}
      <details class="card"><summary><b>📋 Méthode, phrases utiles et pièges</b></summary><div class="course">${METHODE_GROUPE}</div></details>
      <details class="card"><summary><b>🎭 Les rôles utiles dans un groupe</b></summary>${ROLES.map((r) => `<p><b>${r.ico} ${r.r}</b> : ${esc(r.d)}</p>`).join('')}<p class="tip">Aucun rôle ne suffit seul. Le meilleur candidat combine contribution sur le fond + un ou deux rôles de facilitation.</p></details>
      <details class="card"><summary><b>📚 Les ${SUJETS.length} sujets (avec pistes)</b></summary>${SUJETS.map((x) => `<details class="review-item"><summary>${TYPES[x.type].ico} ${esc(x.t)}</summary><p>${esc(x.txt)}</p><p><b>Consigne :</b> ${esc(x.consigne)}</p><p class="tip"><b>Pistes :</b> ${esc(x.pistes)}</p></details>`).join('')}</details>
    </div>`);
    root.append(page);
    page.querySelectorAll('.seg').forEach((sg) =>
      sg.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (sg.dataset.name === 'type') {
          state.type = b.dataset.v;
          pick();
        } else state.minutes = Number(b.dataset.v);
        home();
      }),
    );
    page.querySelector('[data-other]').onclick = () => (pick(), home());
    page.querySelector('[data-go]').onclick = () => lecture();
    page.querySelector('[data-eval]').onclick = () => evaluation(null);
  }

  // Compte à rebours générique avec rappels à des instants donnés (secondes écoulées).
  function countdown(sec, box, onEnd, reminders = []) {
    stopTimer();
    const t0 = Date.now();
    const shown = new Set();
    const tick = () => {
      const el2 = (Date.now() - t0) / 1000;
      const left = Math.max(0, sec - el2);
      box.querySelector('[data-clock]').textContent = fmtClock(left * 1000);
      for (const [at, msg] of reminders)
        if (el2 >= at && !shown.has(at)) {
          shown.add(at);
          const tip = box.querySelector('[data-tip]');
          tip.innerHTML = msg;
          tip.classList.remove('flash-in');
          void tip.offsetWidth;
          tip.classList.add('flash-in');
          navigator.vibrate?.(60);
        }
      if (left <= 0) {
        stopTimer();
        navigator.vibrate?.([100, 60, 100]);
        onEnd();
      }
    };
    timer = setInterval(tick, 250);
    tick();
  }

  function lecture() {
    const s = SUJETS[state.idx];
    root.innerHTML = '';
    const box = el(`<div><h1>📖 Lecture individuelle</h1><div class="big-clock" data-clock></div>${sujetHTML(s)}
      <label class="small"><b>Tes idées (3 ou 4) et ta proposition de méthode</b></label><textarea rows="4" placeholder="Ex. : 1) lister, 2) critère commun, 3) classer…"></textarea>
      <div class="card small" data-tip>Repère 3 ou 4 idées, et prépare une phrase pour lancer le groupe.</div>
      <button class="btn primary block" data-next>Passer à la discussion</button><button class="btn block" data-quit style="margin-top:8px">Abandonner</button></div>`);
    root.append(box);
    box.querySelector('[data-next]').onclick = () => discussion();
    box.querySelector('[data-quit]').onclick = home;
    countdown(180, box, discussion);
  }

  function discussion() {
    const s = SUJETS[state.idx];
    const sec = state.minutes * 60;
    root.innerHTML = '';
    const box = el(`<div><h1>💬 Discussion</h1><div class="big-clock" data-clock></div>
      <div class="card" data-tip style="border-color:var(--accent)">Prends la parole dans les 2 premières minutes : reformule le sujet et propose une méthode.</div>
      ${sujetHTML(s)}
      <button class="btn primary block" data-next>Terminer et évaluer</button><button class="btn block" data-quit style="margin-top:8px">Abandonner</button></div>`);
    root.append(box);
    const done = () => evaluation(state.idx);
    box.querySelector('[data-next]').onclick = done;
    box.querySelector('[data-quit]').onclick = home;
    countdown(sec, box, done, [
      [120, '⏱️ 2 min : as-tu déjà parlé ? Sinon, lance-toi en rebondissant sur une idée.'],
      [sec * 0.3, '👂 Reformule l’idée de quelqu’un avant de donner la tienne.'],
      [sec * 0.5, '📝 Mi-temps : propose un point d’étape (« Si je résume, on est d’accord sur… »).'],
      [sec * 0.65, '🤝 Quelqu’un est-il resté discret ? Donne-lui la parole.'],
      [sec - 180, '⏳ Plus que 3 min : il faut une conclusion commune. Propose une synthèse.'],
      [sec - 30, '🏁 30 secondes : formulez la décision finale.'],
    ]);
  }

  function evaluation(sIdx) {
    stopTimer();
    const scores = CRITERES_GROUPE.map(() => 0);
    let who = 'moi';
    root.innerHTML = '';
    const box = el(`<div><h1>📝 Grille d’évaluation</h1>
      <p class="muted">À remplir par toi ou, mieux, par un proche qui a observé la séance. 1 = pas du tout, 4 = tout à fait.</p>
      <div class="field"><label>Évalué par</label><div class="seg" data-name="who"><button data-v="moi" class="on">Moi-même</button><button data-v="proche">Un proche</button></div></div>
      ${CRITERES_GROUPE.map((c, i) => `<div class="card"><p style="margin:0 0 8px"><b>${i + 1}.</b> ${esc(c)}</p><div class="seg" data-c="${i}">${[1, 2, 3, 4].map((v) => `<button data-v="${v}">${v}</button>`).join('')}</div></div>`).join('')}
      <label class="small"><b>Commentaire (un point fort, un point à travailler)</b></label><textarea rows="3" data-note></textarea>
      <button class="btn primary block" data-save disabled>Enregistrer</button><button class="btn block" data-quit style="margin-top:8px">Annuler</button></div>`);
    root.append(box);
    const save = box.querySelector('[data-save]');
    box.querySelectorAll('.seg').forEach((sg) =>
      sg.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        sg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
        if (sg.dataset.name === 'who') who = b.dataset.v;
        else scores[Number(sg.dataset.c)] = Number(b.dataset.v);
        save.disabled = scores.some((v) => !v);
      }),
    );
    box.querySelector('[data-quit]').onclick = home;
    save.onclick = () => {
      const total = scores.reduce((a, b) => a + b, 0);
      store.update((d) => {
        d.interview ||= { notes: {}, sessions: [] };
        (d.interview.groupe ||= []).push({ ts: Date.now(), s: sIdx ?? state.idx, who, scores, total, note: box.querySelector('[data-note]').value.trim() });
      });
      recordActivity(state.minutes * 60000);
      const weakest = scores.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]).slice(0, 2).filter(([v]) => v < 4);
      root.innerHTML = '';
      const res = el(`<div><h1>Résultat : ${total}/${MAX}</h1><div class="score-ring" style="--p:${Math.round((total / MAX) * 100)}"><span>${Math.round((total / MAX) * 100)} %</span></div>
        ${weakest.length ? `<div class="card"><h3>À travailler en priorité</h3><ul>${weakest.map(([, i]) => `<li>${esc(CRITERES_GROUPE[i])}</li>`).join('')}</ul></div>` : '<div class="card">Excellent sur tous les critères. Change de sujet et de groupe pour confirmer.</div>'}
        ${SUJETS[sIdx ?? state.idx] ? `<div class="card tip"><b>Pistes sur ce sujet :</b> ${esc(SUJETS[sIdx ?? state.idx].pistes)}</div>` : ''}
        <button class="btn primary block" data-back>Retour</button></div>`);
      root.append(res);
      res.querySelector('[data-back]').onclick = () => (pick(), home());
    };
  }

  home();
  return stopTimer;
}

function progressHint(h) {
  if (h.length < 2) return '';
  const d = h[0].total - h[h.length - 1].total;
  return `<p class="small muted">${d > 0 ? `📈 +${d} points depuis ta première séance listée.` : d < 0 ? `📉 ${d} points : change de sujet et relis la méthode.` : 'Score stable : vise les critères les plus faibles.'}</p>`;
}
