// Examen blanc : enchaînement de sections chronométrées, correction à la fin.
import { makeDrawer } from '../core/seen.js';
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
        ${ex.sections.map((s, i) => (s.pause ? `<div class="section-res muted"><span>☕ ${esc(s.title)}</span><span>${fmtClock(s.pause * 1000)}</span></div>` : `<div class="section-res"><span>${ex.sections.slice(0, i + 1).filter((x) => !x.pause).length}. ${esc(s.title)}</span><span class="muted">${s.count} q · ${fmtClock(s.time * 1000)}</span></div>`)).join('')}
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
    // Banques de questions : jamais vues d'abord, sans doublon dans l'examen.
    const pick = (gid) => {
      const g = getGen(gid);
      if (!g.bank) return newSpec(gid, Math.min(level, g.levels));
      decks[gid] ||= makeDrawer(gid, rng.next);
      return newSpec(gid, 0, decks[gid](0));
    };
    document.body.classList.add('in-quiz');
    const step = (k) => {
      if (k >= ex.sections.length) return finish(results);
      const s = ex.sections[k];
      root.innerHTML = '';
      if (s.pause) return pause(s, () => step(k + 1));
      const inter = el(`
        <div class="card center" style="margin-top:30px">
          <p class="muted">Section ${ex.sections.slice(0, k + 1).filter((x) => !x.pause).length} / ${ex.sections.filter((x) => !x.pause).length}</p>
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

  // Pause entre deux blocs : compte à rebours, reprise possible à tout moment.
  function pause(s, next) {
    const end = Date.now() + s.pause * 1000;
    const box = el(`
      <div class="card center" style="margin-top:30px">
        <p class="muted">☕ ${esc(s.title)}</p>
        <div class="big-clock" data-clock>${fmtClock(s.pause * 1000)}</div>
        <p class="small">Lève-toi, bois de l’eau, respire lentement. Ne repense pas aux questions précédentes.</p>
        <button class="btn primary block" data-go>Reprendre maintenant</button>
      </div>`);
    root.append(box);
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      clearInterval(t);
      next();
    };
    const t = setInterval(() => {
      if (!box.isConnected) return clearInterval(t);
      const left = end - Date.now();
      box.querySelector('[data-clock]').textContent = fmtClock(Math.max(0, left));
      if (left <= 0) {
        navigator.vibrate?.([100, 60, 100]);
        go();
      }
    }, 250);
    box.querySelector('[data-go]').onclick = go;
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
