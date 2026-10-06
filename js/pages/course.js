// Pages « cours » génériques (maths, physique) : liste des chapitres et chapitre (cours / méthode / exercices).
import { genSummary } from '../core/stats.js';
import { store } from '../core/store.js';
import { esc, pct, el } from '../core/ui.js';
import { renderTrain } from './train.js';

export function renderCourseList(root, { module, title, intro, chapters }) {
  const prog = store.data.progress;
  root.innerHTML = `
    <h1>${esc(title)}</h1>
    <p class="muted">${intro}</p>
    <div class="list">${chapters
      .map((ch, i) => {
        const s = genSummary(ch.genId, 3650);
        const read = prog[ch.genId]?.read;
        const cls = s.rate == null ? '' : s.rate < 0.5 ? 'ko' : s.rate < 0.75 ? 'warn' : 'ok';
        return `<a class="row-link" href="#/${module}/${ch.id}">
          <span class="badge">${i + 1}</span>
          <span class="grow"><span class="title">${esc(ch.title)}</span><br><span class="sub">${esc(ch.niveau)} · ${read ? '✓ cours lu' : 'cours non lu'} · ${s.n} exercice${s.n > 1 ? 's' : ''} faits</span></span>
          <span class="badge ${cls}">${s.n ? pct(s.rate) : '—'}</span><span class="chev">›</span></a>`;
      })
      .join('')}</div>`;
}

export function renderChapter(root, { module, chapters, id, tab = 'cours' }) {
  const ch = chapters.find((c) => c.id === id);
  if (!ch) {
    root.innerHTML = '<p>Chapitre introuvable.</p>';
    return;
  }
  const idx = chapters.indexOf(ch);
  root.innerHTML = '';
  const page = el(`
    <div>
      <a href="#/${module}" class="small">← Tous les chapitres</a>
      <h1>${esc(ch.title)}</h1>
      <p class="small muted">${esc(ch.niveau)}</p>
      <div class="tabs"><button data-t="cours">📖 Cours</button><button data-t="methode">🛠️ Méthode</button><button data-t="exos">✏️ Exercices</button></div>
      <div class="tab-body"></div>
    </div>`);
  root.append(page);
  const body = page.querySelector('.tab-body');
  const show = (t) => {
    page.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.t === t));
    history.replaceState(null, '', `#/${module}/${id}/${t}`);
    if (t === 'cours') {
      store.update((s) => ((s.progress[ch.genId] ||= {}).read = true));
      body.innerHTML = `<div class="card course">${ch.cours}</div>
        <button class="btn primary block" data-go="methode">Voir la méthode →</button>`;
    } else if (t === 'methode') {
      body.innerHTML = `<div class="card course">${ch.methode}</div>
        <button class="btn primary block" data-go="exos">S’entraîner →</button>`;
    } else {
      const s = genSummary(ch.genId, 3650);
      body.innerHTML = `
        <div class="card">
          <p>Exercices générés à l’infini, corrigés <b>pas à pas</b>, sur 3 niveaux de difficulté.</p>
          <p class="small muted">Réponses : ${s.n} · réussite ${pct(s.rate)}</p>
          <div class="list">
            <button class="row-link" data-mode="prog"><span class="grow"><span class="title">Série progressive (10 exercices)</span><br><span class="sub">3 faciles → 4 moyens → 3 difficiles. Recommandé.</span></span><span class="chev">›</span></button>
            <button class="row-link" data-mode="free"><span class="grow"><span class="title">Entraînement libre</span><br><span class="sub">Choisis le niveau et le nombre de questions.</span></span><span class="chev">›</span></button>
          </div>
        </div>
        ${idx < chapters.length - 1 ? `<a class="btn block" href="#/${module}/${chapters[idx + 1].id}">Chapitre suivant : ${esc(chapters[idx + 1].title)} →</a>` : ''}`;
      body.querySelectorAll('[data-mode]').forEach(
        (b) =>
          (b.onclick = () =>
            renderTrain(root, ch.genId, {
              back: `#/${module}/${id}/exos`,
              progressive: b.dataset.mode === 'prog',
              defaults: { count: '10', chrono: '0', level: b.dataset.mode === 'prog' ? 'prog' : 'auto' },
            })),
      );
    }
    body.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => (show(b.dataset.go), scrollTo(0, 0))));
  };
  page.querySelectorAll('.tabs button').forEach((b) => (b.onclick = () => show(b.dataset.t)));
  show(['cours', 'methode', 'exos'].includes(tab) ? tab : 'cours');
}
