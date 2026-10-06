// Point d'entrée : navigation par « hash » (#/page), thème, service worker.
import './psycho/index.js';
import { CHAPTERS as MATHS } from './maths/index.js';
import { store } from './core/store.js';
import { applyTheme } from './theme.js';
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
  if (g.module === 'psycho') return '#/psycho';
  return `#/${g.module}/${genId.split('.')[1]}/exos`;
};

const routes = [
  [/^$/, () => renderHome(view), 'home'],
  [/^psycho$/, () => renderPsycho(view), 'psycho'],
  [/^train\/(.+)$/, (m) => renderTrain(view, decodeURIComponent(m[1]), { back: backFor(decodeURIComponent(m[1])) }), 'psycho'],
  [/^exam\/(.+)$/, (m) => renderExam(view, m[1]), 'psycho'],
  [/^maths$/, () => renderCourseList(view, { module: 'maths', title: 'Maths', chapters: MATHS, intro: 'On repart des bases (seconde) jusqu’au niveau terminale. Chaque chapitre : un cours court, une méthode, puis des exercices corrigés pas à pas du plus facile au plus difficile. Conseil : fais les chapitres dans l’ordre, le calcul d’abord.' }), 'maths'],
  [/^maths\/([^/]+)(?:\/([^/]+))?$/, (m) => renderChapter(view, { module: 'maths', chapters: MATHS, id: m[1], tab: m[2] }), 'maths'],
  [/^revision$/, () => renderReview(view), 'home'],
  [/^stats$/, () => renderStats(view), 'stats'],
  [/^(reglages|plus)$/, () => renderSettings(view), 'plus'],
  [/^selection$/, () => renderSelection(view), 'plus'],
];

function route() {
  stopActiveQuiz();
  document.body.classList.remove('in-quiz');
  const path = location.hash.replace(/^#\/?/, '');
  for (const [re, fn, tab] of routes) {
    const m = path.match(re);
    if (m) {
      view.innerHTML = '';
      fn(m);
      document.querySelectorAll('.bottomnav a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
      scrollTo(0, 0);
      return;
    }
  }
  location.hash = '#/';
}

addEventListener('hashchange', route);
// Un lien vers la page courante doit quand même recharger la vue (ex. « Retour » après un entraînement).
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a && a.getAttribute('href') === location.hash) {
    e.preventDefault();
    route();
  }
});

applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
route();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
