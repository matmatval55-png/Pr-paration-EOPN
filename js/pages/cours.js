// Hub « Cours » : accès aux modules de révision.
import { moduleSummary } from '../core/stats.js';
import { pct, esc } from '../core/ui.js';
import { MODULES } from './modules.js';

export function renderCours(root) {
  const ids = ['maths', 'physique', 'anglais', 'culture', 'entretien', 'sport'];
  root.innerHTML = `
    <h1>Réviser</h1>
    <p class="muted">Cours, exercices corrigés et entraînements. Les psychotechniques ont leur propre onglet.</p>
    <div class="grid">${MODULES.filter((m) => ids.includes(m.id))
      .map((m) => {
        const s = ['entretien', 'sport'].includes(m.id) ? null : moduleSummary(m.id, 30);
        return `<a class="tile" href="${m.href}"><span class="ico">${m.ico}</span><b>${esc(m.title)}</b><span class="small">${esc(m.sub)}${s && s.n ? ` · ${pct(s.rate)}` : ''}</span></a>`;
      })
      .join('')}</div>`;
}
