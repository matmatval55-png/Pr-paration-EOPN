// Simulation du jour J : enchaînement de toutes les épreuves sur ordinateur, avec pauses,
// pour travailler l'endurance mentale. Plus conseils pour la semaine et les 4 jours à Tours.
import { EXAMS, addExams } from '../exams.js';
import { store } from '../core/store.js';
import { esc } from '../core/ui.js';

const sec = (id) => EXAMS.find((e) => e.id === id)?.sections || [];
const shorten = (s, f) => ({ ...s, count: Math.max(1, Math.round(s.count * f)), time: Math.max(60, Math.round((s.time * f) / 30) * 30) });

addExams([
  {
    id: 'jourj',
    back: '#/jourj',
    title: 'Simulation jour J (complète)',
    desc: 'Toutes les épreuves sur ordinateur à la suite, avec deux courtes pauses : batterie type TAMI-C, anglais, tests navigants. Environ 1 h 30.',
    sections: [
      ...sec('tamic'),
      { title: 'Pause', pause: 180 },
      { title: 'Anglais (extrait type Chambéry)', gens: ['en.grammar', 'en.vocab', 'en.reading'], count: 30, time: 11 * 60 },
      { title: 'Pause', pause: 120 },
      ...sec('navigant'),
    ],
  },
  {
    id: 'jourj-court',
    back: '#/jourj',
    title: 'Simulation jour J (courte)',
    desc: 'Même enchaînement en version réduite (environ 45 min) pour les jours où tu as moins de temps.',
    sections: [
      ...sec('tamic').map((s) => shorten(s, 0.5)),
      { title: 'Pause', pause: 60 },
      { title: 'Anglais (extrait)', gens: ['en.grammar', 'en.vocab', 'en.reading'], count: 15, time: 6 * 60 },
      { title: 'Pause', pause: 60 },
      ...sec('navigant').filter((s) => !['psy.multitache', 'psy.manche'].includes(s.gens[0])).map((s) => shorten(s, 0.5)),
    ],
  },
]);

const totalMin = (id) => Math.round(EXAMS.find((e) => e.id === id).sections.reduce((a, s) => a + (s.pause || s.time), 0) / 60);

export const JOURS = [
  { t: 'Arrivée et tests sur ordinateur', d: 'Accueil, formalités, présentation. Tests psychotechniques (batterie type TAMI-C) et tests cognitifs des navigants, anglais type Chambéry.' },
  { t: 'Sport et tests psychomoteurs', d: 'Luc Léger, tractions ou tirage poulie haute, test Killy. Épreuve psychomotrice (manche et palonniers), qui oriente vers pilote, navigateur ou pilote à distance.' },
  { t: 'Médical', d: 'Mesures, analyses d’urine, ECG, audition, vision, entretien avec le médecin. Apporte ton dossier médical complet.' },
  { t: 'Épreuve de groupe et entretiens', d: 'Épreuve de groupe (au moins 4 candidats), entretien avec un jury de 2 navigants et un officier psychologue.' },
];

export function renderJourJ(root) {
  const past = (store.data.exams || []).filter((e) => e.id === 'jourj' || e.id === 'jourj-court').slice(-5).reverse();
  const last = past[0];
  const weakest = last ? [...last.sections].sort((a, b) => a.ok / a.n - b.ok / b.n).slice(0, 3) : [];
  root.innerHTML = `
    <h1>🎯 Simulation du jour J</h1>
    <p class="muted">À la sélection, tu passes <b>4 jours à Tours</b> et les épreuves s’enchaînent. La fatigue fait chuter les scores en fin de série : il faut s’entraîner à rester concentré longtemps, pas seulement à réussir des exercices isolés.</p>
    <a class="row-link" href="#/exam/jourj" style="border-color:var(--accent)"><span style="font-size:1.4rem">⏱️</span><span class="grow"><span class="title">Simulation complète (≈ ${totalMin('jourj')} min)</span><br><span class="sub">TAMI-C → pause → anglais → pause → tests navigants</span></span><span class="chev">›</span></a>
    <a class="row-link" href="#/exam/jourj-court" style="margin-top:8px"><span style="font-size:1.4rem">⏲️</span><span class="grow"><span class="title">Version courte (≈ ${totalMin('jourj-court')} min)</span><br><span class="sub">Même enchaînement, moitié moins de questions</span></span><span class="chev">›</span></a>
    ${last ? `<div class="card"><h3>Dernière simulation : ${Math.round((last.ok / last.n) * 100)} %</h3><p class="small muted">${new Date(last.ts).toLocaleDateString('fr-FR')} · ${esc(last.title)}</p>${last.sections.map((s) => `<div class="section-res"><span class="small">${esc(s.title)}</span><b>${s.ok}/${s.n}</b></div>`).join('')}<p class="small"><b>À travailler en priorité :</b> ${weakest.map((s) => esc(s.title)).join(', ')}.</p>${past.length > 1 ? `<p class="small muted">Historique : ${past.map((p) => `${Math.round((p.ok / p.n) * 100)} %`).reverse().join(' → ')}</p>` : ''}</div>` : ''}
    <div class="card"><h3>Conseils pour la simulation</h3><ul>
      <li>Fais-la <b>une fois toutes les 2 à 3 semaines</b>, puis chaque semaine le dernier mois.</li>
      <li><b>Conditions réelles</b> : téléphone en mode avion, pas de pause en dehors de celles prévues, pas de musique.</li>
      <li><b>Mode fatigue</b> : de temps en temps, fais-la après une séance de sport ou en fin de journée. Le jour J, tu ne seras pas frais à chaque épreuve.</li>
      <li>Compare tes scores en <b>début et fin</b> de simulation : si la fin chute, travaille l’endurance (séances longues, sommeil).</li>
    </ul></div>
    <div class="card"><h3>Les 4 jours à Tours : exemple d’organisation</h3>
      <p class="small muted">⚠️ La durée (4 jours) et la liste des épreuves sont confirmées par la source officielle, mais <b>pas l’ordre</b> : voici une organisation possible pour te projeter.</p>
      ${JOURS.map((j, i) => `<div class="section-res" style="align-items:flex-start"><span><b>Bloc ${i + 1} : ${j.t}</b><br><span class="small">${j.d}</span></span></div>`).join('')}
    </div>
    <div class="card"><h3>La dernière semaine</h3><ul>
      <li><b>J-7 à J-3</b> : entraînement léger et régulier, une dernière simulation complète en début de semaine, puis plus de nouveauté.</li>
      <li><b>Sommeil</b> : couche-toi et lève-toi à heure fixe, à l’heure du réveil prévu à Tours. Vise 8 h.</li>
      <li><b>Sport</b> : pas de séance très dure dans les 3 jours avant (récupération pour le Luc Léger).</li>
      <li><b>J-1</b> : prépare ta pochette (voir la checklist), relis tes fiches d’entretien, rien de nouveau. Pas d’alcool, pas d’écran tard.</li>
      <li><b>Sur place</b> : mange à heures régulières, hydrate-toi, entre deux épreuves ne refais pas l’épreuve dans ta tête.</li>
    </ul></div>
    <div class="card"><h3>Gérer le stress</h3>
      <p><b>Respiration lente</b> (cohérence cardiaque) : inspire 5 secondes, expire 5 secondes, pendant 3 à 5 minutes. À faire avant une épreuve ou un entretien. Entraîne-toi dès maintenant pour que ce soit un réflexe.</p>
      <p><b>Pendant un test</b> : une question bloque ? Choisis la meilleure option, passe, et ne la regarde plus. Une question ratée ne doit pas en coûter trois.</p>
    </div>
    <div class="list"><a class="row-link" href="#/sante"><span>🩺</span><span class="grow"><span class="title">Médical et hygiène de vie</span></span><span class="chev">›</span></a><a class="row-link" href="#/checklist"><span>✅</span><span class="grow"><span class="title">Checklist de candidature (pochette du jour J)</span></span><span class="chev">›</span></a><a class="row-link" href="#/groupe"><span>👥</span><span class="grow"><span class="title">Épreuve de groupe</span></span><span class="chev">›</span></a></div>`;
}
