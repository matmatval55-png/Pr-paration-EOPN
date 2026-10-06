// Hub « Cours » : accès aux modules de révision.
import { moduleSummary } from '../core/stats.js';
import { pct, esc } from '../core/ui.js';
import { MODULES } from './modules.js';

export function renderCours(root) {
  const ids = ['maths', 'physique', 'anglais', 'culture', 'entretien', 'sport'];
  root.innerHTML = `
    <h1>Exercices</h1>
    <p class="muted">Exercices corrigés, tests blancs et entraînements par module. Les psychotechniques ont leur propre onglet ; les fiches à lire sont dans l’onglet Cours.</p>
    <a class="row-link" href="#/bibliotheque" style="margin-bottom:12px"><span style="font-size:1.4rem">📖</span><span class="grow"><span class="title">Bibliothèque de cours</span><br><span class="sub">Toutes les fiches, sans exercices</span></span><span class="chev">›</span></a>
    <div class="grid">${MODULES.filter((m) => ids.includes(m.id))
      .map((m) => {
        const s = ['entretien', 'sport'].includes(m.id) ? null : moduleSummary(m.id, 30);
        return `<a class="tile" href="${m.href}"><span class="ico">${m.ico}</span><b>${esc(m.title)}</b><span class="small">${esc(m.sub)}${s && s.n ? ` · ${pct(s.rate)}` : ''}</span></a>`;
      })
      .join('')}</div>`;
}
