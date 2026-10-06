// Examen blanc : enchaînement de sections chronométrées, correction à la fin.
import { EXAMS } from '../exams.js';
import { newSpec, getGen } from '../core/registry.js';
import { runQuiz, summaryHTML, fmtClock } from '../core/quiz.js';
import { store } from '../core/store.js';
import { el, esc } from '../core/ui.js';
import { makeRng, newSeed } from '../core/rng.js';

export function renderExam(root, id) {
  const ex = EXAMS.find((e) => e.id === id);
  if (!ex) {
    root.innerHTML = '<p>Examen introuvable.</p>';
    return;
  }
  let level = 2;
  const past = store.data.exams.filter((e) => e.id === id).slice(-5).reverse();
  root.innerHTML = '';
  const page = el(`
    <div>
      <a href="${ex.back || '#/psycho'}" class="small">← Retour</a>
      <h1>${esc(ex.title)}</h1>
      <p class="muted">${esc(ex.desc)}</p>
      <div class="card">
        <h3>Déroulé</h3>
        ${ex.sections.map((s, i) => `<div class="section-res"><span>${i + 1}. ${esc(s.title)}</span><span class="muted">${s.count} q · ${fmtClock(s.time * 1000)}</span></div>`).join('')}
        <p class="small muted">⚠️ Format simulé : la durée et le nombre exacts de questions des épreuves officielles ne sont pas publiés. Aucune correction pendant l’examen ; bilan détaillé à la fin.</p>
        <div class="field"><label>Difficulté</label><div class="seg"><button data-l="1">Facile</button><button data-l="2" class="on">Moyen</button><button data-l="3">Difficile</button></div></div>
        <button class="btn primary block" data-start>Démarrer l’examen</button>
      </div>
      ${past.length ? `<div class="card"><h3>Derniers résultats</h3>${past.map((p) => `<div class="section-res"><span>${new Date(p.ts).toLocaleDateString('fr-FR')} · niv. ${p.level}</span><b>${Math.round((p.ok / p.n) * 100)} %</b></div>`).join('')}</div>` : ''}
    </div>`);
  root.append(page);
  page.querySelectorAll('[data-l]').forEach((b) =>
    (b.onclick = () => {
      level = Number(b.dataset.l);
      page.querySelectorAll('[data-l]').forEach((x) => x.classList.toggle('on', x === b));
    }),
  );
  page.querySelector('[data-start]').onclick = () => runSections();

  function runSections() {
    const results = [];
    const rng = makeRng(newSeed());
    const decks = {};
    // Banques de questions : on pioche dans un paquet mélangé, sans remise.
    const pick = (gid) => {
      const g = getGen(gid);
      if (!g.bank) return newSpec(gid, Math.min(level, g.levels));
      const lvl = 0;
      const key = gid + lvl;
      if (!decks[key]?.length) decks[key] = rng.shuffle([...Array(g.bankSize(lvl)).keys()]);
      return newSpec(gid, lvl, decks[key].pop());
    };
    document.body.classList.add('in-quiz');
    const step = (k) => {
      if (k >= ex.sections.length) return finish(results);
      const s = ex.sections[k];
      root.innerHTML = '';
      const inter = el(`
        <div class="card center" style="margin-top:30px">
          <p class="muted">Section ${k + 1} / ${ex.sections.length}</p>
          <h2>${esc(s.title)}</h2>
          <p>${s.count} question${s.count > 1 ? 's' : ''} · ${fmtClock(s.time * 1000)}</p>
          <button class="btn primary block" data-go>Commencer la section</button>
          <button class="btn block danger" data-stop>Abandonner l’examen</button>
        </div>`);
      root.append(inter);
      inter.querySelector('[data-stop]').onclick = () => {
        document.body.classList.remove('in-quiz');
        renderExam(root, id);
      };
      inter.querySelector('[data-go]').onclick = () => {
        const order = Array.from({ length: s.count }, (_, i) => s.gens[i % s.gens.length]);
        const gens = rng.shuffle(order);
        runQuiz(root, {
          title: s.title,
          total: s.count,
          mode: 'exam',
          totalTime: s.time,
          next: (i) => (i < s.count ? pick(gens[i]) : null),
          onFinish(history) {
            results.push({ title: s.title, total: s.count, history });
            step(k + 1);
          },
          onQuit() {
            document.body.classList.remove('in-quiz');
            renderExam(root, id);
          },
        });
      };
    };
    step(0);
  }

  function finish(results) {
    document.body.classList.remove('in-quiz');
    const all = results.flatMap((r) => r.history);
    const ok = all.filter((h) => h.ok).length;
    const n = results.reduce((a, r) => a + r.total, 0);
    store.update((s) => {
      s.exams.push({ id, title: ex.title, level, ts: Date.now(), ok, n, sections: results.map((r) => ({ title: r.title, ok: r.history.filter((h) => h.ok).length, n: r.total, answered: r.history.length })) });
      if (s.exams.length > 200) s.exams.splice(0, s.exams.length - 200);
    });
    root.innerHTML = '';
    const page = el(`
      <div>
        <h1>Résultat : ${Math.round((ok / n) * 100)} %</h1>
        <p class="muted">${ok} bonnes réponses sur ${n} questions (les questions non traitées dans le temps comptent comme fausses).</p>
        <div class="card">${results
          .map((r) => {
            const o = r.history.filter((h) => h.ok).length;
            return `<div class="section-res"><span>${esc(r.title)}<br><span class="small muted">${r.history.length}/${r.total} traitées</span></span><b>${o}/${r.total}</b></div>`;
          })
          .join('')}</div>
        ${summaryHTML(all, { title: 'Correction détaillée' })}
        <div class="btn-row"><button class="btn primary" data-again>Refaire</button><a class="btn" href="${ex.back || '#/psycho'}">Retour</a></div>
      </div>`);
    page.querySelector('[data-again]').onclick = () => renderExam(root, id);
    root.append(page);
    scrollTo(0, 0);
  }
}
