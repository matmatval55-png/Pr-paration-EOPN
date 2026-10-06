// Bibliothèque de cours : uniquement des fiches à lire, avec suivi de lecture.
import { SECTIONS } from '../cours/index.js';
import { store } from '../core/store.js';
import { el, esc } from '../core/ui.js';

const isRead = (f) => !!store.data.progress[f.key]?.read;

export function renderBibliotheque(root) {
  const all = SECTIONS.flatMap((s) => s.fiches);
  const read = all.filter(isRead).length;
  root.innerHTML = `
    <h1>📖 Cours</h1>
    <p class="muted">Toutes les fiches de cours, sans exercices : à lire tranquillement, dans les transports ou avant de dormir. Chaque fiche renvoie vers les exercices correspondants.</p>
    <div class="card"><div class="section-res" style="border:0"><span><b>${read}</b> fiche(s) lue(s) sur ${all.length}</span><b>${Math.round((read / all.length) * 100)} %</b></div><div class="progress"><div style="width:${(read / all.length) * 100}%"></div></div></div>
    ${SECTIONS.map((s) => {
      const r = s.fiches.filter(isRead).length;
      return `<details class="card" ${r < s.fiches.length && r > 0 ? 'open' : ''}>
        <summary><b>${s.ico} ${esc(s.title)}</b> <span class="small muted">· ${r}/${s.fiches.length} lues</span></summary>
        <div class="list" style="margin-top:8px">${s.fiches
          .map((f, i) => `<a class="row-link" href="#/fiche/${s.id}/${f.id}"><span class="badge ${isRead(f) ? 'ok' : ''}">${isRead(f) ? '✓' : i + 1}</span><span class="grow"><span class="title">${esc(f.title)}</span>${f.sub ? `<br><span class="sub">${esc(f.sub)}</span>` : ''}</span><span class="chev">›</span></a>`)
          .join('')}</div></details>`;
    }).join('')}
    <a class="row-link" href="#/selection"><span>ℹ️</span><span class="grow"><span class="title">La sélection EOPN</span><br><span class="sub">Déroulé, conditions, barème et sources officielles</span></span><span class="chev">›</span></a>`;
}

export function renderFiche(root, secId, id) {
  const sec = SECTIONS.find((s) => s.id === secId);
  const i = sec ? sec.fiches.findIndex((f) => f.id === id) : -1;
  if (i < 0) return renderBibliotheque(root);
  const f = sec.fiches[i];
  const prev = sec.fiches[i - 1], next = sec.fiches[i + 1];
  root.innerHTML = '';
  const page = el(`
    <div>
      <a href="#/bibliotheque" class="small">← Cours · ${esc(sec.title)}</a>
      <h1>${esc(f.title)}</h1>
      <p class="small muted">${sec.ico} ${esc(sec.title)} · fiche ${i + 1}/${sec.fiches.length}</p>
      <article class="card course fiche">${f.html}</article>
      <button class="btn block ${isRead(f) ? '' : 'primary'}" data-read>${isRead(f) ? '✓ Fiche lue (annuler)' : 'Marquer comme lue'}</button>
      ${f.train ? `<a class="btn block" href="${f.train}">✏️ S’entraîner sur ce thème</a>` : ''}
      <div class="btn-row" style="margin-top:10px">
        ${prev ? `<a class="btn" href="#/fiche/${sec.id}/${prev.id}">← ${esc(prev.title)}</a>` : ''}
        ${next ? `<a class="btn" href="#/fiche/${sec.id}/${next.id}">${esc(next.title)} →</a>` : ''}
      </div>
    </div>`);
  root.append(page);
  page.querySelector('[data-read]').onclick = () => {
    store.update((s) => {
      const p = (s.progress[f.key] ||= {});
      p.read = !p.read;
    });
    if (isRead(f) && next) location.hash = `#/fiche/${sec.id}/${next.id}`;
    else renderFiche(root, secId, id);
  };
}
