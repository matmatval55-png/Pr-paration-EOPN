// Questionnaire de personnalité (entraînement) et préparation à l'entretien avec le psychologue.
import { ITEMS, SCALE, DIMENSIONS, score, QUESTIONS_PSY, METHODE_PSY } from '../entretien/personnalite.js';
import { store } from '../core/store.js';
import { recordActivity } from '../core/stats.js';
import { el, esc } from '../core/ui.js';

const PER_PAGE = 10;
const level = (v) => (v == null ? '' : v >= 70 ? 'haut' : v <= 35 ? 'bas' : 'moyen');

function resultHTML(res, past) {
  const { dims, desir, incoh, meanGap } = res;
  const coh = meanGap < 0.8 ? ['bonne', 'ok'] : meanGap < 1.4 ? ['moyenne', 'warn'] : ['faible', 'ko'];
  const extremes = Object.entries(dims).filter(([, v]) => level(v) !== 'moyen' && v != null);
  return `
    <div class="card"><h3>Ton profil</h3>
      ${Object.entries(DIMENSIONS).map(([k, d]) => `<div class="mrow"><div class="mrow-h"><b>${d.label}</b><span>${dims[k]} / 100</span></div><div class="mbar"><div style="width:${dims[k]}%"></div></div><div class="small muted">${d.desc}</div></div>`).join('')}
      <p class="small muted">Aucun score n’est « bon » ou « mauvais » : un profil équilibré et cohérent avec tes exemples compte plus qu’un score élevé partout.</p>
    </div>
    <div class="card"><h3>Fiabilité de tes réponses</h3>
      <p>Cohérence : <span class="badge ${coh[1]}">${coh[0]}</span></p>
      ${incoh.length ? `<p class="small">Réponses qui se contredisent (même idée, réponses éloignées) :</p><ul class="small">${incoh.map((g) => `<li>« ${esc(g.a.txt)} » / « ${esc(g.b.txt)} »${g.same ? '' : ' (sens opposé)'}</li>`).join('')}</ul><p class="small muted">Relis ces phrases : laquelle te décrit vraiment ? Le psychologue pourrait t’interroger sur ce point.</p>` : '<p class="small">Tes réponses aux questions reformulées sont cohérentes.</p>'}
      <p>Image de soi : ${desir >= 3.5 ? '<span class="badge ko">trop parfaite</span></p><p class="small">Tu as approuvé des phrases que personne ne peut honnêtement approuver (« je n’ai jamais menti »…). Dans un vrai questionnaire, cela fait douter de la sincérité de l’ensemble de tes réponses.</p>' : desir >= 2.5 ? '<span class="badge warn">à surveiller</span></p><p class="small">Attention à ne pas te présenter comme irréprochable.</p>' : '<span class="badge ok">réaliste</span></p>'}
    </div>
    ${extremes.length ? `<div class="card"><h3>Questions que le psychologue pourrait te poser</h3>${extremes.map(([k, v]) => `<p><b>${DIMENSIONS[k].label}</b> (${level(v) === 'haut' ? 'score élevé' : 'score bas'})</p><ul>${QUESTIONS_PSY[k][level(v)].map((q) => `<li>${esc(q)}</li>`).join('')}</ul>`).join('')}<p class="tip">Prépare pour chacune un exemple concret et vrai (situation, action, résultat, ce que tu en as appris).</p></div>` : ''}
    ${past.length > 1 ? `<div class="card"><h3>Évolution</h3>${past.slice(-4).map((p) => `<div class="section-res"><span class="small">${new Date(p.ts).toLocaleDateString('fr-FR')}</span><span class="small muted">${Object.keys(DIMENSIONS).map((k) => `${DIMENSIONS[k].label.split(' ')[0]} ${p.dims[k]}`).join(' · ')}</span></div>`).join('')}<p class="small muted">Ta personnalité ne change pas en quelques semaines : de gros écarts entre deux passages signalent plutôt des réponses peu spontanées.</p></div>` : ''}`;
}

export function renderPersonnalite(root) {
  const draft = () => store.data.interview?.perso?.draft || {};
  const saveAns = (id, v) =>
    store.update((s) => {
      s.interview ||= { notes: {}, sessions: [] };
      s.interview.perso ||= { draft: {}, results: [] };
      s.interview.perso.draft[id] = v;
    });
  let page = 0;

  function home() {
    const past = store.data.interview?.perso?.results || [];
    const n = Object.keys(draft()).length;
    root.innerHTML = '';
    const box = el(`<div>
      <a href="#/entretien" class="small">← Entretien</a>
      <h1>Personnalité et psychologue</h1>
      <p class="muted">Un questionnaire d’entraînement de ${ITEMS.length} affirmations (environ 10 minutes), puis ton profil, la fiabilité de tes réponses et les questions qu’un psychologue pourrait te poser.</p>
      <div class="card"><button class="btn primary block" data-go>${n && n < ITEMS.length ? `Reprendre (${n}/${ITEMS.length})` : past.length ? 'Repasser le questionnaire' : 'Commencer le questionnaire'}</button>${n && n < ITEMS.length ? '<button class="btn block" data-reset>Recommencer à zéro</button>' : ''}<p class="small muted">Réponds comme tu es aujourd’hui, pas comme tu voudrais être. Tes réponses restent sur ton appareil.</p></div>
      ${past.length ? `<h2>Dernier résultat (${new Date(past[past.length - 1].ts).toLocaleDateString('fr-FR')})</h2>${resultHTML(past[past.length - 1], past)}` : ''}
      <details class="card"><summary><b>Comment ça marche, et comment préparer le psychologue</b></summary><div class="course">${METHODE_PSY}</div></details>
    </div>`);
    root.append(box);
    box.querySelector('[data-go]').onclick = () => {
      const d = draft();
      if (Object.keys(d).length >= ITEMS.length) store.update((s) => (s.interview.perso.draft = {}));
      page = Math.floor(Math.min(Object.keys(draft()).length, ITEMS.length - 1) / PER_PAGE);
      questions();
    };
    box.querySelector('[data-reset]')?.addEventListener('click', () => {
      store.update((s) => (s.interview.perso.draft = {}));
      home();
    });
  }

  function questions() {
    const d = draft();
    const items = ITEMS.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
    const pages = Math.ceil(ITEMS.length / PER_PAGE);
    root.innerHTML = '';
    const box = el(`<div>
      <div class="quiz-head"><button class="btn-icon" data-quit aria-label="Quitter">✕</button><div class="quiz-title">Questionnaire · page ${page + 1}/${pages}</div><div class="quiz-count">${Object.keys(d).length}/${ITEMS.length}</div></div>
      <div class="progress"><div style="width:${(Object.keys(d).length / ITEMS.length) * 100}%"></div></div>
      ${items.map((it) => `<div class="card perso-item"><p>${esc(it.txt)}</p><div class="likert" data-id="${it.id}">${SCALE.map((s, i) => `<button type="button" data-v="${i + 1}" class="${d[it.id] === i + 1 ? 'on' : ''}" title="${s}">${i + 1}</button>`).join('')}</div><div class="likert-legend small muted"><span>Pas du tout d’accord</span><span>Tout à fait d’accord</span></div></div>`).join('')}
      <div class="btn-row">${page > 0 ? '<button class="btn" data-prev>← Précédent</button>' : ''}<button class="btn primary" data-next disabled>${page < pages - 1 ? 'Suivant →' : 'Voir mon profil'}</button></div>
    </div>`);
    root.append(box);
    scrollTo(0, 0);
    const next = box.querySelector('[data-next]');
    const check = () => (next.disabled = !items.every((it) => draft()[it.id]));
    check();
    box.querySelectorAll('.likert').forEach((lk) =>
      lk.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        lk.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
        saveAns(lk.dataset.id, Number(b.dataset.v));
        box.querySelector('.quiz-count').textContent = `${Object.keys(draft()).length}/${ITEMS.length}`;
        box.querySelector('.progress > div').style.width = `${(Object.keys(draft()).length / ITEMS.length) * 100}%`;
        check();
      }),
    );
    box.querySelector('[data-quit]').onclick = home;
    box.querySelector('[data-prev]')?.addEventListener('click', () => (page--, questions()));
    next.onclick = () => {
      if (page < pages - 1) {
        page++;
        return questions();
      }
      const res = score(draft());
      store.update((s) => {
        s.interview.perso.results.push({ ts: Date.now(), ...res, incoh: res.incoh.map((g) => ({ a: g.a, b: g.b, same: g.same, gap: g.gap })) });
        s.interview.perso.draft = {};
      });
      recordActivity(10 * 60000);
      home();
      scrollTo(0, 0);
    };
  }

  home();
}
