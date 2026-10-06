// Planning : programme de la semaine selon la date de sélection, les heures disponibles et les points faibles.
import { MODS, buildWeek, weeksUntil, phaseFor, PHASES } from '../planning/plan.js';
import { store, today } from '../core/store.js';
import { weakPoints, genSummary, moduleSummary } from '../core/stats.js';
import { dueItems } from '../core/srs.js';
import { listGens } from '../core/registry.js';
import { CHAPTERS as MATHS } from '../maths/index.js';
import { CHAPTERS as PHYS } from '../physique/index.js';
import { el, esc } from '../core/ui.js';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const dayIndex = (d = new Date()) => (d.getDay() + 6) % 7; // 0 = lundi

function nextChapter(chapters) {
  return chapters.find((c) => !store.data.progress[c.genId]?.read) || chapters.find((c) => (genSummary(c.genId).rate ?? 0) < 0.7) || chapters[0];
}

function weakestIn(module, fallback) {
  const w = weakPoints(20).find((x) => x.module === module);
  if (w) return w.id;
  const gens = listGens(module).filter((g) => !g.noSrs);
  const never = gens.find((g) => !genSummary(g.id).n);
  return never ? never.id : fallback;
}

// Activité concrète proposée pour un créneau.
export function suggestion(mod, phaseId, k = 0) {
  switch (mod) {
    case 'psycho': {
      if (phaseId !== 'fond' && k % 2 === 0) return { href: phaseId === 'final' ? '#/exam/navigant' : '#/exam/tamic', txt: phaseId === 'final' ? 'Examen blanc « tests navigants »' : 'Examen blanc type TAMI-C' };
      const id = weakestIn('psycho', 'psy.problemes');
      return { href: `#/train/${id}`, txt: `Entraînement : ${listGens('psycho').find((g) => g.id === id)?.title}` };
    }
    case 'maths': {
      const c = nextChapter(MATHS);
      return { href: `#/maths/${c.id}`, txt: `Chapitre « ${c.title} » (cours puis série progressive)` };
    }
    case 'physique': {
      const c = nextChapter(PHYS);
      return { href: `#/physique/${c.id}`, txt: `Chapitre « ${c.title} »` };
    }
    case 'anglais': {
      const opts = [
        { href: '#/train/en.grammar', txt: 'Grammar (20 questions)' },
        { href: '#/train/en.reading', txt: 'Reading comprehension' },
        { href: '#/flashcards', txt: 'Flashcards + vocabulary' },
        { href: '#/exam/en-mini', txt: 'English mini-test' },
      ];
      return opts[k % opts.length];
    }
    case 'culture': {
      const opts = ['cult.aae', 'bia.aero', 'bia.meteo', 'cult.defense', 'bia.navreg', 'cult.histoire', 'bia.aeronefs'];
      const id = opts[k % opts.length];
      return { href: `#/train/${id}`, txt: listGens('culture').find((g) => g.id === id)?.title };
    }
    case 'entretien':
      return { href: '#/entretien/simulation', txt: 'Simulation : 3 questions à voix haute + notes' };
    default:
      return { href: '#/revision', txt: `Révisions espacées (${dueItems().length} dues)` };
  }
}

function currentWeek() {
  const s = store.data.settings;
  const weeks = weeksUntil(s.selectionDate);
  const mods = ['psycho', 'maths', 'anglais', 'physique', 'culture'];
  const weak = mods.filter((m) => {
    const r = moduleSummary(m, 30);
    return r.n >= 10 && r.rate < 0.6;
  });
  const days = store.data.planning?.days ?? [0, 1, 2, 3, 4, 5, 6];
  return { weeks, weak, plan: buildWeek({ hours: s.hoursPerWeek, days, weeks, weak }) };
}

export function todayBlocks() {
  const { plan } = currentWeek();
  return { plan, blocks: plan.perDay[dayIndex()], sport: plan.sport.includes(dayIndex()) };
}

export function renderPlanning(root) {
  const s = store.data.settings;
  const { weeks, weak, plan } = currentWeek();
  const days = store.data.planning?.days ?? [0, 1, 2, 3, 4, 5, 6];
  const done = store.data.planning?.done?.[today()] || {};
  const di = dayIndex();
  const week0 = new Date();
  week0.setDate(week0.getDate() - di);
  const row = (b, dayI, i) => {
    const sug = suggestion(b.mod, plan.phase.id, i + dayI);
    const key = `${b.mod}-${i}`;
    const isToday = dayI === di;
    return `<div class="row-link" style="cursor:default">
      <span style="font-size:1.3rem">${MODS[b.mod].ico}</span>
      <span class="grow"><span class="title">${MODS[b.mod].label} · ${b.min} min</span><br><a class="sub" href="${sug.href}">${esc(sug.txt || '')} →</a></span>
      ${isToday ? `<button class="btn-icon" data-done="${key}" aria-label="Fait">${done[key] ? '✔' : '○'}</button>` : ''}
    </div>`;
  };
  root.innerHTML = '';
  const page = el(`
    <div>
      <h1>Planning</h1>
      <div class="card">
        <div class="stat-row">
          <div class="stat"><b>${weeks == null ? '—' : Math.max(0, weeks)}</b><span>semaines avant J</span></div>
          <div class="stat"><b>${s.hoursPerWeek} h</b><span>par semaine</span></div>
          <div class="stat"><b>${esc(plan.phase.title)}</b><span>phase actuelle</span></div>
        </div>
        <p class="small" style="margin-top:10px">${esc(plan.phase.desc)}</p>
        ${weak.length ? `<p class="small">🎯 Temps renforcé pour : <b>${weak.map((m) => MODS[m].label).join(', ')}</b> (moins de 60 % de réussite sur 30 jours).</p>` : ''}
        ${weeks != null && weeks < 0 ? '<p class="small" style="color:var(--danger)">La date de sélection est passée : mets-la à jour dans les réglages.</p>' : ''}
      </div>
      <h2>Aujourd’hui (${JOURS[di]})</h2>
      <div class="list">${plan.perDay[di].length ? plan.perDay[di].map((b, i) => row(b, di, i)).join('') : '<p class="muted">Jour de repos 😴</p>'}
        ${plan.sport.includes(di) ? `<a class="row-link" href="#/sport"><span style="font-size:1.3rem">🏃</span><span class="grow"><span class="title">Sport · 45 min</span><br><span class="sub">Séance du programme →</span></span></a>` : ''}
      </div>
      <h2>Ma semaine</h2>
      ${JOURS.map((j, d) => {
        if (d === di) return '';
        const date = new Date(week0);
        date.setDate(week0.getDate() + d);
        const blocks = plan.perDay[d];
        return `<details class="card" ${d === (di + 1) % 7 ? 'open' : ''}><summary><b>${j}</b> <span class="small muted">${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · ${blocks.reduce((a, b) => a + b.min, 0)} min${plan.sport.includes(d) ? ' + sport' : ''}</span></summary>
          <div class="list" style="margin-top:8px">${blocks.length ? blocks.map((b, i) => row(b, d, i)).join('') : '<p class="muted small">Repos</p>'}${plan.sport.includes(d) ? '<div class="row-link"><span>🏃</span><span class="grow">Sport · 45 min</span></div>' : ''}</div></details>`;
      }).join('')}
      <div class="card">
        <h3>Mes disponibilités</h3>
        <p class="small muted">Jours où tu peux travailler (les heures par semaine et la date se règlent dans <a href="#/reglages">Réglages</a>).</p>
        <div class="daypick">${JOURS.map((j, d) => `<label><input type="checkbox" data-day="${d}" ${days.includes(d) ? 'checked' : ''}>${j.slice(0, 3)}</label>`).join('')}</div>
      </div>
      <details class="card"><summary><b>Comment le planning est calculé</b></summary><div class="course small">
        <p>Le temps est découpé en créneaux de 30 min, répartis selon la phase :</p>
        <ul>${PHASES.map((p) => `<li><b>${p.title}</b> (${p.min ? `plus de ${p.min} semaines avant J` : 'les 8 dernières semaines'}) : ${Object.entries(p.w).map(([k, v]) => `${MODS[k].label} ${v} %`).join(', ')}.</li>`).join('')}</ul>
        <p>Les modules où tu réussis moins de 60 % des questions reçoivent du temps en plus. Le sport (3 séances de 45 min) s’ajoute à ces heures. Les activités proposées suivent ta progression : chapitre non lu, exercice le plus faible, examen blanc…</p>
      </div></details>
    </div>`);
  root.append(page);
  page.querySelectorAll('[data-done]').forEach((b) =>
    (b.onclick = () => {
      store.update((d) => {
        d.planning ||= {};
        d.planning.done ||= {};
        const t = (d.planning.done[today()] ||= {});
        t[b.dataset.done] = !t[b.dataset.done];
      });
      b.textContent = store.data.planning.done[today()][b.dataset.done] ? '✔' : '○';
    }),
  );
  page.querySelectorAll('[data-day]').forEach((c) =>
    (c.onchange = () => {
      const sel = [...page.querySelectorAll('[data-day]:checked')].map((x) => +x.dataset.day);
      store.update((d) => ((d.planning ||= {}).days = sel.length ? sel : [0, 1, 2, 3, 4, 5, 6]));
      renderPlanning(root);
    }),
  );
}
void phaseFor;
