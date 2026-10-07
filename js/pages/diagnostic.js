// Test de positionnement en maths : 2 questions par chapitre (niveaux 1 et 2), sans correction pendant le test.
import { CHAPTERS as MATHS } from '../maths/index.js';
import { newSpec } from '../core/registry.js';
import { runQuiz, summaryHTML } from '../core/quiz.js';
import { store } from '../core/store.js';
import { el, esc } from '../core/ui.js';

export const DIAG_LABEL = { 2: ['Acquis', 'ok'], 1: ['À consolider', 'warn'], 0: ['Prioritaire', 'ko'] };

export function diagResult(chId) {
  const r = store.data.mathsDiag?.res?.[chId];
  return r == null ? null : r;
}

export function renderDiagnostic(root) {
  const last = store.data.mathsDiag;
  root.innerHTML = '';
  const page = el(`
    <div>
      <a href="#/maths" class="small">← Maths</a>
      <h1>Test de positionnement</h1>
      <p class="muted">20 questions (2 par chapitre : une facile, une moyenne), sans calculatrice, sans correction pendant le test. À la fin, chaque chapitre est classé <b>Acquis</b>, <b>À consolider</b> ou <b>Prioritaire</b>, et le planning en tient compte.</p>
      ${last ? `<p class="small">Dernier test : ${new Date(last.ts).toLocaleDateString('fr-FR')} · ${last.ok}/20.</p>` : ''}
      <button class="btn primary block" data-go>Commencer (≈ 20 min)</button>
    </div>`);
  root.append(page);
  page.querySelector('[data-go]').onclick = () => {
    const specs = MATHS.flatMap((c) => [newSpec(c.genId, 1), newSpec(c.genId, 2)]);
    document.body.classList.add('in-quiz');
    runQuiz(root, {
      title: 'Positionnement maths',
      total: specs.length,
      mode: 'exam',
      next: (i) => specs[i] || null,
      onFinish(history) {
        document.body.classList.remove('in-quiz');
        const res = {};
        for (const c of MATHS) res[c.id] = history.filter((h) => h.spec.gen === c.genId && h.ok).length;
        const ok = history.filter((h) => h.ok).length;
        store.update((s) => (s.mathsDiag = { ts: Date.now(), ok, res }));
        root.innerHTML = '';
        root.append(
          el(`<div>
            <h1>Résultat : ${ok}/20</h1>
            <div class="card">${MATHS.map((c) => {
              const [lab, cls] = DIAG_LABEL[res[c.id]];
              return `<a class="section-res" href="#/maths/${c.id}" style="text-decoration:none;color:inherit"><span>${esc(c.title)}</span><span class="badge ${cls}">${lab}</span></a>`;
            }).join('')}</div>
            <p class="small muted">Commence par les chapitres <b>Prioritaire</b>, dans l’ordre de la liste. Refais ce test tous les 2-3 mois pour mesurer tes progrès.</p>
            ${summaryHTML(history, { title: 'Correction' })}
            <a class="btn primary block" href="#/maths">Retour aux chapitres</a>
          </div>`),
        );
        scrollTo(0, 0);
      },
      onQuit() {
        document.body.classList.remove('in-quiz');
        renderDiagnostic(root);
      },
    });
  };
}
