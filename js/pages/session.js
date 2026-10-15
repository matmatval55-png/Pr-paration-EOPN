// Session chrono : tu choisis une durée, un compte à rebours démarre, et jusqu'à la fin il n'y a
// que des questions (choisies par le coach, jamais déjà vues), entrecoupées de temps en temps
// d'une fiche de cours liée à ce que tu viens de travailler (en priorité là où tu t'es trompé).
import { buildSession, COACH_MODULES } from '../core/coach.js';
import { levelFor } from '../core/mastery.js';
import { runQuiz, summaryHTML, fmtClock } from '../core/quiz.js';
import { getGen } from '../core/registry.js';
import { store } from '../core/store.js';
import { el, esc } from '../core/ui.js';
import { SECTIONS } from '../cours/index.js';
import { ficheFor, evolutionHTML } from './coach.js';

const DUREES = [10, 15, 20, 30, 45, 60];
const FREQ = { souvent: 5, parfois: 8, jamais: 0 }; // une fiche toutes les N questions
const SECTIONS_PAR_MODULE = { psycho: ['psycho', 'anime'], maths: ['maths'], physique: ['physique'], anglais: ['anglais'], culture: ['culture', 'bia', 'visuel'] };

const isRead = (f) => !!store.data.progress?.[f.key]?.read;

function findFiche(href) {
  const m = href.match(/^#\/fiche\/([^/]+)\/([^/]+)$/);
  const sec = m && SECTIONS.find((s) => s.id === m[1]);
  const f = sec?.fiches.find((x) => x.id === m[2]);
  return f ? { sec, f } : null;
}

// Choix de la fiche : d'abord celle d'un exercice raté dans le bloc, puis d'un exercice travaillé,
// puis une fiche non lue de la même matière ; jamais deux fois la même dans la session.
export function pickFiche(blockHistory, shown, module) {
  const ids = (h) => [...new Set(h.map((x) => x.spec.gen))];
  const wrong = ids(blockHistory.filter((h) => !h.ok));
  for (const gen of [...wrong, ...ids(blockHistory)]) {
    const ref = ficheFor(gen);
    const got = ref && findFiche(ref.href);
    if (got && !shown.has(got.f.key)) return { ...got, why: wrong.includes(gen) ? `Tu viens de te tromper en « ${getGen(gen)?.title} »` : `Lié à « ${getGen(gen)?.title} »` };
  }
  const mods = module ? [module] : [...new Set(blockHistory.map((h) => getGen(h.spec.gen)?.module).filter(Boolean))];
  const pool = mods.flatMap((m) => (SECTIONS_PAR_MODULE[m] || []).flatMap((sid) => {
    const sec = SECTIONS.find((s) => s.id === sid);
    return sec ? sec.fiches.map((f) => ({ sec, f })) : [];
  })).filter((x) => !shown.has(x.f.key));
  const unread = pool.filter((x) => !isRead(x.f));
  const list = unread.length ? unread : pool;
  if (!list.length) return null;
  return { ...list[Math.floor(Math.random() * list.length)], why: unread.length ? 'Une fiche que tu n’as pas encore lue' : 'Pour réviser' };
}

export function renderSession(root) {
  const st = store.data.settings;
  const state = { minutes: st.sessionMinutes || 20, module: 'all', fiches: st.sessionFiches || 'parfois' };
  let ticker = null;
  const stopTicker = () => clearInterval(ticker);

  function setup() {
    stopTicker();
    root.innerHTML = '';
    const seg = (name, opts, val) => `<div class="seg wrap" data-name="${name}">${opts.map(([v, l]) => `<button type="button" data-v="${v}" class="${String(v) === String(val) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const page = el(`<div>
      <h1>Session chrono</h1>
      <p class="muted">Choisis combien de temps tu veux réviser. Un compte à rebours démarre et, jusqu’à la fin, le site enchaîne les questions choisies par le coach (jamais une question déjà vue). De temps en temps, une <b>fiche de cours</b> s’intercale, en priorité sur ce que tu viens de rater.</p>
      <div class="card">
        <div class="field"><label>Durée</label>${seg('minutes', DUREES.map((m) => [m, `${m} min`]), state.minutes)}</div>
        <div class="field"><label>Matière</label>${seg('module', [['all', 'Tout'], ...Object.keys(COACH_MODULES).map((k) => [k, { psycho: 'Psycho', maths: 'Maths', physique: 'Physique', anglais: 'Anglais', culture: 'Culture' }[k]])], state.module)}</div>
        <div class="field"><label>Fiches de cours</label>${seg('fiches', [['souvent', 'Souvent'], ['parfois', 'Parfois'], ['jamais', 'Jamais']], state.fiches)}<p class="small muted">Souvent : une fiche toutes les 5 questions environ ; parfois : toutes les 8.</p></div>
        <button class="btn primary block" data-go>Lancer ${state.minutes} minutes</button>
      </div>
    </div>`);
    root.append(page);
    page.querySelectorAll('.seg').forEach((sg) =>
      sg.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        state[sg.dataset.name] = sg.dataset.name === 'minutes' ? Number(b.dataset.v) : b.dataset.v;
        store.update((d) => {
          d.settings.sessionMinutes = state.minutes;
          d.settings.sessionFiches = state.fiches;
        });
        setup();
      }),
    );
    page.querySelector('[data-go]').onclick = start;
  }

  function start() {
    const module = state.module === 'all' ? null : state.module;
    const endAt = Date.now() + state.minutes * 60000;
    const left = () => Math.max(0, endAt - Date.now());
    const every = FREQ[state.fiches];
    const all = [];
    const fichesLues = [];
    const shown = new Set();
    const before = {};
    let queue = [];
    let quit = false;

    const refill = () => {
      const plan = buildSession({ minutes: Math.max(10, Math.ceil(left() / 60000)), module });
      for (const it of plan.items) if (!(it.gen in before)) before[it.gen] = levelFor(it.gen);
      queue.push(...plan.items.map((it) => it.spec));
    };

    const block = () => {
      if (!left() || quit) return end();
      if (!queue.length) refill();
      if (!queue.length) return end(true);
      const n = every || 1000;
      const specs = queue.splice(0, n);
      document.body.classList.add('in-quiz');
      runQuiz(root, {
        title: `Session ${state.minutes} min`,
        total: null,
        countOffset: all.length,
        mode: 'train',
        totalTime: Math.ceil(left() / 1000),
        next: (i) => (left() ? specs[i] || null : null),
        onFinish(history, meta) {
          all.push(...history);
          if (meta?.quit) quit = true;
          if (quit || meta?.timeout || !left()) return end();
          // questions non posées de ce bloc : remises en tête de file
          queue.unshift(...specs.slice(history.length));
          if (every) fiche(history);
          else block();
        },
        onQuit() {
          quit = true;
          end();
        },
      });
    };

    const fiche = (history) => {
      const got = pickFiche(history, shown, module);
      if (!got) return block();
      shown.add(got.f.key);
      document.body.classList.add('in-quiz');
      root.innerHTML = '';
      const box = el(`<div>
        <div class="quiz-head"><button class="btn-icon" data-quit aria-label="Arrêter">✕</button><div class="quiz-title">Fiche de cours</div><div class="quiz-count" data-clock></div></div>
        <p class="small muted">${esc(got.why)} · ${esc(got.sec.title)}</p>
        <h1>${esc(got.f.title)}</h1>
        <article class="card course fiche">${got.f.html}</article>
        <button class="btn primary block" data-next>J’ai lu, je reprends les questions →</button>
        <button class="btn block" data-skip>Passer cette fiche</button>
      </div>`);
      root.append(box);
      scrollTo(0, 0);
      const clock = box.querySelector('[data-clock]');
      const tick = () => {
        clock.textContent = `⏱ ${fmtClock(left())}`;
        if (!left()) end();
      };
      tick();
      stopTicker();
      ticker = setInterval(tick, 500);
      box.querySelector('[data-next]').onclick = () => {
        stopTicker();
        store.update((s) => ((s.progress[got.f.key] ||= {}).read = true));
        fichesLues.push(got);
        block();
      };
      box.querySelector('[data-skip]').onclick = () => (stopTicker(), block());
      box.querySelector('[data-quit]').onclick = () => {
        if (!confirm('Arrêter la session ?')) return;
        quit = true;
        end();
      };
    };

    let ended = false;
    const end = (empty = false) => {
      if (ended) return;
      ended = true;
      stopTicker();
      document.body.classList.remove('in-quiz');
      const spent = state.minutes * 60000 - left();
      store.update((s) => (s.sessions ||= []).push({ ts: Date.now(), min: state.minutes, ms: spent, n: all.length, ok: all.filter((h) => h.ok).length, fiches: fichesLues.length }));
      root.innerHTML = '';
      const res = el(`<div>
        <h1>Session terminée</h1>
        <div class="stat-row"><div class="stat"><b>${Math.round(spent / 60000)}</b><span>minutes</span></div><div class="stat"><b>${all.length}</b><span>questions</span></div><div class="stat"><b>${fichesLues.length}</b><span>fiches lues</span></div></div>
        ${empty ? '<div class="card small">Plus de question nouvelle disponible pour cette matière : la session s’arrête ici.</div>' : ''}
        ${all.length ? summaryHTML(all, { title: 'Bilan des questions' }) : ''}
        ${evolutionHTML(before, all)}
        ${fichesLues.length ? `<div class="card"><h3>Fiches lues</h3>${fichesLues.map((x) => `<a class="row-link" href="#/fiche/${x.sec.id}/${x.f.id}" style="margin-top:6px"><span class="grow"><span class="title">${esc(x.f.title)}</span><br><span class="sub">${esc(x.sec.title)}</span></span><span class="chev">›</span></a>`).join('')}</div>` : ''}
        <button class="btn primary block" data-again>Nouvelle session</button>
        <a class="btn block" href="#/">Accueil</a>
      </div>`);
      res.querySelector('[data-again]').onclick = setup;
      root.append(res);
      scrollTo(0, 0);
    };

    block();
  }

  setup();
  return stopTicker;
}
