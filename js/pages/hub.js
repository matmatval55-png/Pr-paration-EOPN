// Page d'accueil d'un module à exercices (psycho, anglais, culture…) : examens blancs + exercices groupés.
import { listGens } from '../core/registry.js';
import { EXAMS } from '../exams.js';
import { genSummary } from '../core/stats.js';
import { esc, pct } from '../core/ui.js';

export function genRow(g) {
  const s = genSummary(g.id, 30);
  const cls = s.rate == null ? '' : s.rate < 0.5 ? 'ko' : s.rate < 0.75 ? 'warn' : 'ok';
  return `<a class="row-link" href="#/train/${g.id}"><span class="grow"><span class="title">${esc(g.title)}</span><br><span class="sub">${esc(g.desc || '')}</span></span><span class="badge ${cls}">${s.n ? pct(s.rate) : 'nouveau'}</span><span class="chev">›</span></a>`;
}

export function renderHub(root, { module, title, intro, groups, icons = {}, before = '', after = '' }) {
  const gens = listGens(module);
  const exams = EXAMS.filter((e) => e.back === `#/${module}`);
  const order = groups || [...new Set(gens.map((g) => g.group))];
  root.innerHTML = `
    <h1>${esc(title)}</h1>
    <p class="muted">${intro}</p>
    ${before}
    ${
      exams.length
        ? `<h2>📝 Tests blancs</h2><div class="list">${exams
            .map((e) => `<a class="row-link" href="#/exam/${e.id}"><span style="font-size:1.4rem">⏱️</span><span class="grow"><span class="title">${esc(e.title)}</span><br><span class="sub">${esc(e.desc)}</span></span><span class="chev">›</span></a>`)
            .join('')}</div>`
        : ''
    }
    ${order
      .map((gr) => {
        const items = gens.filter((g) => g.group === gr);
        return items.length ? `<h2>${icons[gr] || ''} ${esc(gr)}</h2><div class="list">${items.map(genRow).join('')}</div>` : '';
      })
      .join('')}
    ${after}`;
}
