// Moteur de séance : affiche les questions, chronomètre, corrige et enregistre.
import { updateMastery } from './mastery.js';
import { makeQuestion } from './registry.js';
import { record } from './stats.js';
import { onAnswer } from './srs.js';
import { el, esc, keypad, parseNum, vibrate } from './ui.js';
import { n as fmtN } from './fmt.js';
import { addReport } from './reports.js';

/**
 * opts :
 *  title       titre de la séance
 *  next(i, history) -> spec | null   fournit la question suivante (null = fin)
 *  total       nombre prévu de questions (affichage) ou null (illimité)
 *  mode        'train' (correction immédiate) | 'exam' (correction à la fin) | 'review'
 *  timePerQ    secondes par question ou null (sinon limite propre à chaque question)
 *  noTimer     true : aucun chronomètre par question
 *  totalTime   secondes pour toute la séance ou null
 *  onFinish(history, meta)
 *  onQuit()
 */
// Séance en cours (arrêtée par le routeur quand on change de page).
let active = null;
export function stopActiveQuiz() {
  active?.stop();
  active = null;
}

export function runQuiz(root, opts) {
  stopActiveQuiz();
  const history = [];
  const startAll = performance.now();
  let raf = 0;
  let cleanup = null;
  let ended = false;
  let totalTimer = null;

  root.innerHTML = '';
  const wrap = el(`
    <section class="quiz">
      <header class="quiz-head">
        <button class="btn-icon quiz-quit" aria-label="Quitter">✕</button>
        <div class="quiz-title">${esc(opts.title)}</div>
        <div class="quiz-count"></div>
      </header>
      <div class="timebar"><div></div></div>
      <div class="quiz-body"></div>
    </section>`);
  root.append(wrap);
  const body = wrap.querySelector('.quiz-body');
  const bar = wrap.querySelector('.timebar > div');
  const count = wrap.querySelector('.quiz-count');

  wrap.querySelector('.quiz-quit').onclick = () => {
    if (history.length && !confirm('Quitter la séance ? Les réponses déjà données sont enregistrées.')) return;
    stop();
    if (history.length && opts.mode !== 'exam') opts.onFinish?.(history, meta(true));
    else opts.onQuit?.();
  };

  if (opts.totalTime) {
    const end = startAll + opts.totalTime * 1000;
    totalTimer = setInterval(() => {
      const left = Math.max(0, end - performance.now());
      count.dataset.time = fmtClock(left);
      if (left <= 0) finish(true);
    }, 250);
  }

  function meta(quit = false) {
    return { ms: performance.now() - startAll, quit };
  }

  function stop() {
    ended = true;
    cancelAnimationFrame(raf);
    clearInterval(totalTimer);
    cleanup?.();
    cleanup = null;
  }

  function finish(timeout = false) {
    if (ended) return;
    stop();
    opts.onFinish?.(history, { ...meta(), timeout });
  }

  function updateCount() {
    const i = history.length + 1;
    count.textContent = opts.total ? `${Math.min(i, opts.total)} / ${opts.total}` : `n° ${i}`;
  }

  function runTimer(seconds, onExpire) {
    cancelAnimationFrame(raf);
    if (!seconds) {
      bar.style.width = '0';
      return;
    }
    const t0 = performance.now();
    const tick = () => {
      const f = (performance.now() - t0) / (seconds * 1000);
      bar.style.width = Math.min(100, f * 100) + '%';
      bar.classList.toggle('late', f > 0.8);
      if (f >= 1) onExpire();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function nextQuestion() {
    if (ended) return;
    cleanup?.();
    cleanup = null;
    const spec = opts.next(history.length, history);
    if (!spec) return finish();
    let q;
    try {
      q = makeQuestion(spec);
    } catch (e) {
      console.error(e);
      return nextQuestion();
    }
    updateCount();
    if (q.pre) showPre(q);
    else showQuestion(q);
  }

  function showPre(q) {
    body.innerHTML = '';
    const box = el(`<div class="pre"><p class="pre-label">${q.pre.label || 'Mémorise :'}</p><div class="pre-content">${q.pre.html}</div></div>`);
    body.append(box);
    runTimer(q.pre.ms / 1000, () => {
      cancelAnimationFrame(raf);
      showQuestion(q);
    });
  }

  function showQuestion(q) {
    body.innerHTML = '';
    const t0 = performance.now();
    let answered = false;
    const card = el(`
      <div class="qcard">
        <div class="q-prompt">${q.prompt}</div>
        ${q.visual ? `<div class="q-visual">${q.visual}</div>` : ''}
        <div class="q-answer"></div>
      </div>`);
    body.append(card);
    const area = card.querySelector('.q-answer');

    const answer = (result) => {
      if (answered || ended) return;
      answered = true;
      cancelAnimationFrame(raf);
      const ms = performance.now() - t0;
      const item = { spec: q.spec, q, ms, ...result };
      history.push(item);
      record(q.spec.gen, item.ok, ms);
      updateMastery(q.spec, item.ok);
      onAnswer(q.spec, item.ok, opts.mode === 'review');
      vibrate(item.ok ? 15 : [40, 40, 40]);
      if (opts.mode === 'exam') {
        cleanup?.();
        cleanup = null;
        nextQuestion();
      } else showFeedback(card, item);
    };

    const tl = opts.noTimer ? 0 : (q.timeLimit ?? opts.timePerQ);
    if (q.kind === 'custom') {
      cleanup = q.mount(area, (r) => answer(r), { mode: opts.mode }) || null;
      if (tl) runTimer(tl, () => answer({ ok: false, timeout: true }));
      else runTimer(0);
      return;
    }

    if (q.kind === 'mcq') {
      const list = el(`<div class="choices ${q.layout || ''}"></div>`);
      q.choices.forEach((c, i) => {
        const b = el(`<button type="button" class="choice" data-i="${i}"><span class="choice-letter">${'ABCDEF'[i]}</span><span class="choice-body">${c}</span></button>`);
        b.onclick = () => {
          list.querySelectorAll('.choice').forEach((x) => (x.disabled = true));
          answer({ ok: i === q.answer, given: i });
        };
        list.append(b);
      });
      area.append(list);
    } else {
      const kp = keypad({
        allowFrac: q.allowFrac !== false,
        allowNeg: q.allowNeg !== false,
        onSubmit: (txt) => {
          let ok;
          if (q.accept) ok = q.accept(txt);
          else {
            const v = parseNum(txt);
            const tol = q.tol ?? Math.max(1e-9, Math.abs(q.answer) * 1e-9);
            ok = Number.isFinite(v) && Math.abs(v - q.answer) <= tol;
          }
          kp.disable();
          answer({ ok, given: txt });
        },
      });
      area.append(kp);
      cleanup = () => kp.destroy();
    }
    runTimer(tl, () => {
      area.querySelectorAll('button').forEach((x) => (x.disabled = true));
      answer({ ok: false, timeout: true });
    });
  }

  function showFeedback(card, item) {
    const { q } = item;
    if (q.kind === 'mcq') {
      const btns = card.querySelectorAll('.choice');
      btns[q.answer]?.classList.add('right');
      if (item.given != null && item.given !== q.answer) btns[item.given]?.classList.add('wrong');
    }
    let head;
    if (item.ok) head = `<div class="fb-head ok">✓ Bonne réponse</div>`;
    else if (item.timeout) head = `<div class="fb-head ko">⏱ Temps écoulé</div>`;
    else head = `<div class="fb-head ko">✗ Réponse incorrecte</div>`;
    let ans = '';
    if (q.kind !== 'mcq' && q.kind !== 'custom') {
      const given = item.given != null ? `Ta réponse : <b>${esc(item.given)}</b> · ` : '';
      ans = `<p class="fb-ans">${given}Réponse attendue : <b>${q.answerText ?? fmtN(q.answer)}</b></p>`;
    } else if (q.kind === 'mcq' && !item.ok) {
      ans = `<p class="fb-ans">Réponse attendue : <b>${'ABCDEF'[q.answer]}</b></p>`;
    }
    const extra = item.explainExtra ? `<div class="fb-extra">${item.explainExtra}</div>` : '';
    const fb = el(`
      <div class="feedback">
        ${head}${ans}${extra}
        <div class="fb-explain"><h4>Explication</h4>${q.explain || ''}</div>
        <button class="btn primary fb-next">Suivant →</button>
        <button class="linkbtn fb-report" type="button">⚑ Signaler une erreur dans cette question</button>
      </div>`);
    card.append(fb);
    fb.querySelector('.fb-report').onclick = (e) => {
      const c = prompt('Qu’est-ce qui ne va pas ? (réponse fausse, explication peu claire, faute…)');
      if (c == null) return;
      addReport(q, c);
      e.target.textContent = '✓ Merci, signalement enregistré (voir Réglages)';
      e.target.disabled = true;
    };
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const nextBtn = fb.querySelector('.fb-next');
    if (opts.total && history.length >= opts.total) nextBtn.textContent = 'Voir le bilan';
    nextBtn.onclick = () => nextQuestion();
    nextBtn.focus({ preventScroll: true });
  }

  nextQuestion();
  active = { stop };
  return active;
}

export function fmtClock(ms) {
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function snippet(html) {
  const t = html.replace(/<sup>(.*?)<\/sup>/g, '^$1').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > 70 ? t.slice(0, 68) + '…' : t;
}

// Bilan d'une séance (liste des erreurs avec explications dépliables).
export function summaryHTML(history, { title = 'Bilan' } = {}) {
  const ok = history.filter((h) => h.ok).length;
  const ms = history.reduce((a, h) => a + h.ms, 0);
  const rate = history.length ? ok / history.length : 0;
  const wrong = history.filter((h) => !h.ok);
  return `
    <div class="summary">
      <h2>${esc(title)}</h2>
      <div class="score-ring" style="--p:${Math.round(rate * 100)}"><span>${ok}/${history.length}</span></div>
      <p class="muted center">Réussite ${Math.round(rate * 100)} % · temps moyen ${history.length ? (ms / history.length / 1000).toFixed(1).replace('.', ',') : 0} s</p>
      ${
        wrong.length
          ? `<h3>À revoir (${wrong.length})</h3><p class="muted small">Ces questions sont ajoutées à ta révision espacée.</p>
        ${wrong
          .map(
            (h, i) => `
          <details class="review-item">
            <summary>${i + 1}. ${esc(h.q.genTitle)}${h.timeout ? ' · ⏱ temps écoulé' : ''}<br><span class="small muted">${esc(snippet(h.q.prompt))}</span></summary>
            <div class="q-prompt">${h.q.prompt}</div>
            ${h.q.visual ? `<div class="q-visual">${h.q.visual}</div>` : ''}
            ${
              h.q.kind === 'mcq'
                ? `<div class="choices ${h.q.layout || ''} static">${h.q.choices
                    .map(
                      (c, j) =>
                        `<div class="choice ${j === h.q.answer ? 'right' : j === h.given ? 'wrong' : ''}"><span class="choice-letter">${'ABCDEF'[j]}</span><span class="choice-body">${c}</span></div>`,
                    )
                    .join('')}</div>`
                : h.q.kind === 'custom'
                  ? ''
                  : `<p>Ta réponse : <b>${h.given != null ? esc(h.given) : '—'}</b> · attendue : <b>${h.q.answerText ?? fmtN(h.q.answer)}</b></p>`
            }
            ${h.explainExtra ? `<div class="fb-extra">${h.explainExtra}</div>` : ''}
            <div class="fb-explain">${h.q.explain || ''}</div>
          </details>`,
          )
          .join('')}`
          : '<p class="center">Aucune erreur, bravo ! 🎯</p>'
      }
    </div>`;
}
