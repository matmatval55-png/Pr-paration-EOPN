// Examen blanc : enchaînement de sections chronométrées, correction à la fin.
import { customExam } from '../core/custom-exam.js';
import { makePicker } from '../core/seen.js';
import { EXAMS } from '../exams.js';
import { VERSION } from '../version.js';
import { getGen, makeQuestion } from '../core/registry.js';
import { runQuiz, summaryHTML, fmtClock } from '../core/quiz.js';
import { store } from '../core/store.js';
import { el, esc, fmtMs } from '../core/ui.js';
import { makeRng, newSeed } from '../core/rng.js';

const CHECKPOINT = 'eopn.exam.checkpoint';

function checkpoint() {
  try {
    const attempt = JSON.parse(sessionStorage.getItem(CHECKPOINT));
    return attempt?.version === VERSION ? attempt : null;
  } catch {
    return null;
  }
}

function persist(attempt) {
  try {
    if (attempt) sessionStorage.setItem(CHECKPOINT, JSON.stringify(attempt));
    else sessionStorage.removeItem(CHECKPOINT);
  } catch {
    // Le bloc reste jouable si le navigateur interdit le stockage de session.
  }
}

const serialize = (history) => history.map(({ ok, ms, given, timeout, omitted, explainExtra }) =>
  ({ ok, ms, given, timeout, omitted, explainExtra }));

const restore = (specs, answers) => answers.map((answer, i) =>
  ({ ...answer, spec: specs[i], q: makeQuestion(specs[i]) }));

export function renderExam(root, id) {
  const ex = EXAMS.find((e) => e.id === id) || customExam(id);
  if (!ex) {
    root.innerHTML = '<p>Examen introuvable.</p>';
    return;
  }
  let level = ex.fixedLevel || 3;
  const saved = checkpoint();
  const resumable = saved?.id === id;
  const interrupted = store.data.examInProgress?.id === id;
  const past = store.data.exams.filter((e) => e.id === id).slice(-5).reverse();
  root.innerHTML = '';
  const page = el(`
    <div>
      <a href="${ex.back || '#/psycho'}" class="small">← Retour</a>
      <h1>${esc(ex.title)}</h1>
      <p class="muted">${esc(ex.desc)}</p>
      ${interrupted ? '<p class="card warn" role="status">Passage précédent incomplet. Aucun score global enregistré.</p>' : ''}
      ${resumable ? '<button class="btn primary block" data-resume>Reprendre le passage</button><p class="small">Le délai du bloc continue. La question affichée lors de l’interruption est comptée comme omise.</p>' : ''}
      <div class="card">
        <h3>Déroulé</h3>
        ${ex.sections.map((s, i) => (s.pause ? `<div class="section-res muted"><span>☕ ${esc(s.title)}</span><span>${fmtClock(s.pause * 1000)}</span></div>` : `<div class="section-res"><span>${ex.sections.slice(0, i + 1).filter((x) => !x.pause).length}. ${esc(s.title)}</span><span class="muted">${s.count} q · ${fmtClock(s.time * 1000)}</span></div>`)).join('')}
        <p class="small muted">⚠️ Format simulé : la durée et le nombre exacts de questions des épreuves officielles ne sont pas publiés. Aucune correction pendant l’examen ; bilan détaillé à la fin.</p>
        ${ex.fixedLevel ? `<p class="small">Niveau ${ex.fixedLevel}</p>` : '<div class="field"><label>Difficulté</label><div class="seg"><button data-l="1">Facile</button><button data-l="2">Moyen</button><button data-l="3" class="on">Difficile</button></div></div>'}
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

  page.querySelector('[data-resume]')?.addEventListener('click', () => runSections(saved));

  function runSections(existing) {
    if (existing) level = existing.level;
    const seed = existing?.seed ?? newSeed();
    const rng = makeRng(seed);
    // Les formats à composition fixe conservent leurs quotas entre deux passages.
    const picker = makePicker(rng.next, { excludeSeen: !ex.fixedComposition });
    const pick = (gid) => {
      const g = getGen(gid);
      return picker(gid, g.bank ? 0 : Math.min(level, g.levels));
    };
    // Questions d'une section, préparées d'avance : si un exercice n'a plus de question nouvelle,
    // on prend dans un autre exercice de la section ; sinon la section est plus courte.
    const prepare = (s) => {
      const order = rng.shuffle(Array.from({ length: s.count }, (_, i) => s.gens[i % s.gens.length]));
      const out = [];
      for (const gid of order) {
        let sp = pick(gid);
        if (!sp && !ex.fixedComposition) {
          for (const alt of rng.shuffle(s.gens)) {
            sp = pick(alt);
            if (sp) break;
          }
        }
        if (sp) out.push(sp);
      }
      return out;
    };
    const attempt = existing || {
      id, level, seed, version: VERSION, index: 0,
      plans: ex.sections.map((section) => section.pause ? null : prepare(section)),
      answers: [], active: null,
    };
    if (attempt.plans.some((specs, i) => specs && specs.length !== ex.sections[i].count)) {
      alert('Nombre de questions disponibles insuffisant pour un examen complet.');
      return;
    }
    persist(attempt);
    store.update((s) => { s.examInProgress = { id, level, startedAt: Date.now() }; });
    store.flush();
    document.body.classList.add('in-quiz');

    function step(k) {
      attempt.index = k;
      attempt.active = null;
      persist(attempt);
      if (k >= ex.sections.length) {
        const results = ex.sections.flatMap((s, i) => s.pause ? [] : [{
          title: s.title, total: s.count, specs: attempt.plans[i],
          history: restore(attempt.plans[i], attempt.answers[i]),
        }]);
        persist(null);
        return finish(results, seed);
      }
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
        const now = Date.now();
        startBlock(k, { deadline: now + s.time * 1000, lastWall: now, exposed: false, answers: [] });
      };
    }

    function startBlock(k, block) {
      const s = ex.sections[k];
      const specs = attempt.plans[k];
      attempt.active = block;
      persist(attempt);
      runQuiz(root, {
        title: s.title, total: specs.length, mode: 'exam',
        wallDeadline: block.deadline,
        initialHistory: restore(specs, block.answers),
        next: (i) => specs[i] || null,
        onQuestion() { block.exposed = true; persist(attempt); },
        onClock() {
          const now = Date.now();
          if (now - block.lastWall >= 1000) {
            block.lastWall = now;
            persist(attempt);
          }
        },
        onProgress(history) {
          block.exposed = false;
          block.answers = serialize(history);
          block.lastWall = Math.max(block.lastWall, Date.now());
          persist(attempt);
        },
        onFinish(history, meta) {
          if (meta?.generationFailed) return;
          attempt.answers[k] = serialize(history);
          step(k + 1);
        },
        onQuit() {
          document.body.classList.remove('in-quiz');
          renderExam(root, id);
        },
      });
    }

    if (attempt.active) {
      const block = attempt.active;
      if (block.exposed) block.answers.push({ ok: false, omitted: true, ms: 0 });
      block.exposed = false;
      if (Date.now() < block.lastWall) block.deadline = Date.now();
      startBlock(attempt.index, block);
    } else {
      step(attempt.index);
    }
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

  function finish(results, seed) {
    document.body.classList.remove('in-quiz');
    const all = results.flatMap((r) => r.history);
    const ok = all.filter((h) => h.ok).length;
    const n = results.reduce((a, r) => a + r.total, 0);
    const sections = results.map(({ title, total, history }) => {
      const timeouts = history.filter((item) => item.timeout).length;
      return { title, n: total, ok: history.filter((item) => item.ok).length,
        answered: history.filter((item) => !item.timeout && !item.omitted).length, timeouts, omitted: total - history.length + history.filter((item) => item.omitted).length };
    });
    const answered = all.filter((item) => !item.timeout && !item.omitted);
    const times = answered.map((item) => item.ms).sort((a, b) => a - b);
    const median = times.length ? (times[Math.floor((times.length - 1) / 2)] + times[Math.floor(times.length / 2)]) / 2 : null;
    const version = ex.fixedComposition ? 1 : 0;
    const previous = past.find((item) => item.level === level && item.n === n && (item.formatVersion || 0) === version);
    const change = previous ? Math.round(100 * (ok / n - previous.ok / previous.n)) : null;
    const weakest = sections.reduce((worst, section) => !worst || section.ok / section.n < worst.ok / worst.n ? section : worst, null);
    // Les quotas des générateurs incluent les omissions. Les niveaux sont toujours séparés.
    const skills = new Map();
    for (const result of results) {
      result.specs.forEach((spec, i) => {
        const key = spec.gen + '|' + spec.level;
        if (!skills.has(key)) skills.set(key, { gen: spec.gen, level: spec.level, n: 0, ok: 0, omitted: 0, timeouts: 0 });
        const entry = skills.get(key);
        const response = result.history[i];
        entry.n++;
        if (!response || response.omitted) entry.omitted++;
        else if (response.timeout) entry.timeouts++;
        else if (response.ok) entry.ok++;
      });
    }
    const priorities = [...skills.values()].sort((a, b) => a.ok / a.n - b.ok / b.n)
      .filter((skill) => skill.ok < skill.n).slice(0, 3);
    if (n) store.update((s) => {
      delete s.examInProgress;
      s.exams.push({ id, title: ex.title, seed, formatVersion: version, level, ts: Date.now(), ok, n, median, sections, skills: [...skills.values()] });
      if (s.exams.length > 200) s.exams.splice(0, s.exams.length - 200);
    });

    store.flush();
    root.innerHTML = '';
    const page = el(`
      <div>
        <h1>Résultat : ${n ? Math.round((ok / n) * 100) : 0} %</h1>
        <p class="muted">${ok} bonnes réponses sur ${n} questions (les questions non traitées dans le temps comptent comme fausses).</p>
        <p>Précision sur les réponses données : ${answered.length ? Math.round(100 * ok / answered.length) + ' %' : '—'} · médiane : ${fmtMs(median)}</p>
        ${change !== null ? `<p>Écart avec le passage comparable précédent : ${change > 0 ? '+' : ''}${change} points.</p>` : ''}
        <div class="card">${sections.map((r) =>
          `<div class="section-res"><span>${esc(r.title)}<br><span class="small muted">${r.answered}/${r.n} traitées · ${r.omitted} omissions · ${r.timeouts} hors délai</span></span><b>${r.ok}/${r.n}</b></div>`
        ).join('')}</div>
        ${weakest ? `<p>Bloc à retravailler en priorité : <strong>${esc(weakest.title)}</strong> (${weakest.ok}/${weakest.n}).</p>` : ''}
        ${id === 'diagnostic-general' ? `<div class="card"><h2>Programme après diagnostic</h2>
          <p>Chaque exercice est évalué sur quelques questions. Utilise ce relevé pour choisir quoi approfondir et viser au moins 8 réponses justes sur 10 en entraînement.</p>
          ${priorities.length ? `<ul>${priorities.map((skill) => `<li><a href="#/train/${esc(skill.gen)}">${esc(getGen(skill.gen)?.title || skill.gen)}</a> · ${skill.ok}/${skill.n} · ${skill.omitted + skill.timeouts} non traitées dans le temps</li>`).join('')}</ul>` : ''}
          <a class="btn" href="#/coach">Construire une séance avec le coach</a></div>` : ''}
        ${summaryHTML(answered, { title: 'Correction détaillée (questions traitées uniquement)' })}
        <div class="btn-row"><button class="btn primary" data-again>Refaire</button><a class="btn" href="${ex.back || '#/psycho'}">Retour</a></div>
      </div>`);
    page.querySelector('[data-again]').onclick = () => renderExam(root, id);
    root.append(page);
    scrollTo(0, 0);
  }
}
