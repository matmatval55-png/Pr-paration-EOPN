import { dueItems, srsCount } from '../core/srs.js';
import { runQuiz, summaryHTML } from '../core/quiz.js';
import { el } from '../core/ui.js';

export function renderReview(root) {
  const due = dueItems();
  if (!due.length) {
    root.innerHTML = `<h1>Révisions</h1><div class="card"><p>✅ Aucune révision à faire pour le moment.</p><p class="small muted">${srsCount()} question(s) sont programmées pour plus tard. Chaque question ratée revient le lendemain, puis après 3, 7, 14 et 30 jours si tu la réussis.</p></div><a class="btn block" href="#/">Retour à l’accueil</a>`;
    return;
  }
  const specs = due.slice(0, 30).map((d) => d.spec);
  root.innerHTML = '';
  const intro = el(`<div><h1>Révisions</h1><div class="card"><p><b>${due.length}</b> question(s) à revoir${due.length > 30 ? ' (30 par séance)' : ''}.</p><p class="small muted">C’est le seul endroit où le site te repose des questions déjà vues : exactement celles que tu as ratées, pour les retenir. Partout ailleurs (entraînement, coach, examens), tu n’as que des questions nouvelles.</p><button class="btn primary block" data-go>Commencer</button></div></div>`);
  root.append(intro);
  intro.querySelector('[data-go]').onclick = () => {
    document.body.classList.add('in-quiz');
    runQuiz(root, {
      title: 'Révisions',
      total: specs.length,
      mode: 'review',
      next: (i) => specs[i] || null,
      onFinish(history) {
        document.body.classList.remove('in-quiz');
        root.innerHTML = '';
        root.append(el(`<div>${summaryHTML(history, { title: 'Bilan des révisions' })}<a class="btn primary block" href="#/">Retour à l’accueil</a></div>`));
      },
      onQuit() {
        document.body.classList.remove('in-quiz');
        renderReview(root);
      },
    });
  };
}
