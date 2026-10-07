// Point d'entrée : navigation par « hash » (#/page), thème, service worker.
import './psycho/index.js';
import { CHAPTERS as MATHS } from './maths/index.js';
import { CHAPTERS as PHYS } from './physique/index.js';
import './anglais/index.js';
import './culture/index.js';
import { store } from './core/store.js';
import { applyTheme, applyFontSize } from './theme.js';
import { renderHome } from './pages/home.js';
import { renderPsycho } from './pages/psycho.js';
import { renderTrain } from './pages/train.js';
import { renderExam } from './pages/exam.js';
import { renderCourseList, renderChapter } from './pages/course.js';
import { renderReview } from './pages/review.js';
import { renderStats } from './pages/stats.js';
import { renderSettings } from './pages/settings.js';
import { renderSelection } from './pages/selection.js';
import { getGen } from './core/registry.js';
import { stopActiveQuiz } from './core/quiz.js';
import { renderHub } from './pages/hub.js';
import { renderCours } from './pages/cours.js';
import { renderFlashList, renderFlashDeck, deckStats } from './pages/flashcards.js';
import { DECKS } from './anglais/index.js';
import { GROUPS as CULTURE_GROUPS } from './culture/index.js';
import { renderEntretien, renderSimulation } from './pages/entretien.js';
import { renderSport } from './pages/sport.js';
import { renderLeger } from './pages/leger.js';
import { renderDiagnostic } from './pages/diagnostic.js';
import { renderChecklist } from './pages/checklist.js';
import { renderPlanning } from './pages/planning.js';
import { renderBibliotheque, renderFiche } from './pages/bibliotheque.js';

const view = document.getElementById('view');

// Valeur par défaut de la date de sélection (« vers fin 2027 », modifiable dans les réglages)
if (!store.data.settings.selectionDate && !store.data.settings.dateAsked) {
  store.update((s) => {
    s.settings.selectionDate = '2027-11-30';
    s.settings.dateAsked = true;
  });
}

const backFor = (genId) => {
  const g = getGen(genId);
  if (!g) return '#/';
  if (g.bank || !['maths', 'physique'].includes(g.module)) return `#/${g.module}`;
  return `#/${g.module}/${genId.split('.')[1]}/exos`;
};

const routes = [
  [/^$/, () => renderHome(view), 'home'],
  [/^psycho$/, () => renderPsycho(view), 'psycho'],
  [/^train\/(.+)$/, (m) => renderTrain(view, decodeURIComponent(m[1]), { back: backFor(decodeURIComponent(m[1])) }), 'psycho'],
  [/^exam\/(.+)$/, (m) => renderExam(view, m[1]), 'psycho'],
  [/^maths$/, () => renderCourseList(view, { module: 'maths', title: 'Maths', chapters: MATHS, intro: 'On repart des bases (seconde) jusqu’au niveau terminale. Chaque chapitre : un cours court, une méthode, puis des exercices corrigés pas à pas du plus facile au plus difficile. Conseil : fais les chapitres dans l’ordre, le calcul d’abord.' }), 'cours'],
  [/^maths\/test$/, () => renderDiagnostic(view), 'cours'],
  [/^maths\/([^/]+)(?:\/([^/]+))?$/, (m) => renderChapter(view, { module: 'maths', chapters: MATHS, id: m[1], tab: m[2] }), 'cours'],
  [/^physique$/, () => renderCourseList(view, { module: 'physique', title: 'Physique', chapters: PHYS, intro: 'Mécanique, énergie, électricité, optique et mécanique du vol, au format cours + méthode + exercices corrigés pas à pas. Les chapitres « Unités » et « Vitesse » sont prioritaires : on les retrouve dans les problèmes des tests.' }), 'cours'],
  [/^physique\/([^/]+)(?:\/([^/]+))?$/, (m) => renderChapter(view, { module: 'physique', chapters: PHYS, id: m[1], tab: m[2] }), 'cours'],
  [/^anglais$/, () => renderHub(view, { module: 'anglais', title: 'Anglais', intro: 'Objectif C1. Le test officiel (« test de Chambéry ») est un QCM de compréhension écrite : 150 questions en 55 minutes, soit environ 22 s par question. Travaille la vitesse autant que la justesse. (Module en anglais, explications parfois en français.)', groups: ['Grammar', 'Vocabulary', 'Radiotelephony', 'Reading'], icons: { Grammar: '📘', Vocabulary: '🗂️', Radiotelephony: '📻', Reading: '📰' }, before: `<a class="row-link" href="#/flashcards" style="border-color:var(--accent)"><span style="font-size:1.4rem">🃏</span><span class="grow"><span class="title">Flashcards</span><br><span class="sub">${DECKS.reduce((a, d) => a + deckStats(d).due, 0)} carte(s) à revoir · révision espacée</span></span><span class="chev">›</span></a>` }), 'cours'],
  [/^flashcards$/, () => renderFlashList(view), 'cours'],
  [/^flashcards\/(.+)$/, (m) => renderFlashDeck(view, m[1]), 'cours'],
  [/^culture$/, () => renderHub(view, { module: 'culture', title: 'Culture & BIA', intro: 'Culture militaire et aéronautique (utile pour l’entretien et un éventuel test de culture, non confirmé officiellement) et révision complète du BIA.', groups: CULTURE_GROUPS, icons: { [CULTURE_GROUPS[0]]: '🎖️', [CULTURE_GROUPS[1]]: '🛩️' } }), 'cours'],
  [/^entretien$/, () => renderEntretien(view), 'cours'],
  [/^entretien\/simulation$/, () => renderSimulation(view), 'cours'],
  [/^sport$/, () => renderSport(view), 'cours'],
  [/^sport\/leger$/, () => renderLeger(view), 'cours'],
  [/^planning$/, () => renderPlanning(view), 'planning'],
  [/^checklist$/, () => renderChecklist(view), 'planning'],
  [/^cours$/, () => renderCours(view), 'cours'],
  [/^bibliotheque$/, () => renderBibliotheque(view), 'biblio'],
  [/^fiche\/([^/]+)\/([^/]+)$/, (m) => renderFiche(view, m[1], m[2]), 'biblio'],
  [/^revision$/, () => renderReview(view), 'home'],
  [/^stats$/, () => renderStats(view), 'stats'],
  [/^(reglages|plus)$/, () => renderSettings(view), 'plus'],
  [/^selection$/, () => renderSelection(view), 'plus'],
];

let pageCleanup = null;
function route() {
  stopActiveQuiz();
  pageCleanup?.();
  pageCleanup = null;
  document.body.classList.remove('in-quiz');
  const path = location.hash.replace(/^#\/?/, '');
  for (const [re, fn, tab] of routes) {
    const m = path.match(re);
    if (m) {
      view.innerHTML = '';
      const c = fn(m);
      if (typeof c === 'function') pageCleanup = c;
      document.querySelectorAll('.bottomnav a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
      scrollTo(0, 0);
      return;
    }
  }
  location.hash = '#/';
}

addEventListener('hashchange', route);
// Boutons « Écouter » : lecture par la synthèse vocale du téléphone (exercices d'écoute radio).
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-speak]');
  if (!b) return;
  if (!('speechSynthesis' in window)) return alert('La synthèse vocale n’est pas disponible : affiche le texte.');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(b.dataset.speak);
  u.lang = 'en-GB';
  u.rate = Number(b.dataset.rate) || 1;
  const v = speechSynthesis.getVoices().find((x) => /^en(-|_)(GB|US)/i.test(x.lang));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
});
// Un lien vers la page courante doit quand même recharger la vue (ex. « Retour » après un entraînement).
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a && a.getAttribute('href') === location.hash) {
    e.preventDefault();
    route();
  }
});

applyTheme();
applyFontSize();
// Demande au navigateur de ne pas effacer les données (évite le nettoyage automatique de Safari).
navigator.storage?.persist?.().catch(() => {});
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
route();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
