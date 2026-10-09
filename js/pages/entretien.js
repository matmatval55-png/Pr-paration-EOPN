// Module Entretien : méthode, banque de questions avec notes personnelles, simulation chronométrée.
import { THEMES, QUESTIONS, METHODE, CRITERES } from '../entretien/data.js';
import { store } from '../core/store.js';
import { recordActivity } from '../core/stats.js';
import { el, esc } from '../core/ui.js';
import { fmtClock } from '../core/quiz.js';

const qid = (q) => QUESTIONS.indexOf(q);

function advice(q) {
  return `<div class="fb-explain"><h4>Ce que le jury évalue</h4><p>${q.attendu}</p><h4>Comment structurer</h4><p>${q.plan}</p><h4>Pièges à éviter</h4><p>${q.pieges}</p></div>`;
}

export function renderEntretien(root) {
  const notes = store.data.interview?.notes || {};
  const hist = (store.data.interview?.sessions || []).slice(-5).reverse();
  root.innerHTML = '';
  const page = el(`
    <div>
      <h1>Entretien</h1>
      <p class="muted">${QUESTIONS.length} questions classiques, avec ce que le jury attend et les pièges à éviter. Prépare tes notes, puis entraîne-toi à voix haute en simulation.</p>
      <a class="row-link" href="#/groupe" style="border-color:var(--accent);margin-bottom:8px"><span style="font-size:1.4rem">👥</span><span class="grow"><span class="title">Épreuve de groupe</span><br><span class="sub">Sujets, chrono avec rappels, grille d’évaluation pour tes proches, quiz des bons réflexes.</span></span><span class="chev">›</span></a>
      <a class="row-link" href="#/entretien/simulation" style="border-color:var(--accent)"><span style="font-size:1.4rem">🎤</span><span class="grow"><span class="title">Mode simulation</span><br><span class="sub">Une question au hasard, 20 s de réflexion, 2 min pour répondre, puis auto-évaluation.</span></span><span class="chev">›</span></a>
      ${hist.length ? `<div class="card"><h3>Dernières simulations</h3>${hist.map((h) => `<div class="section-res"><span class="small">${esc(QUESTIONS[h.q]?.q || '')}<br><span class="muted">${new Date(h.ts).toLocaleDateString('fr-FR')}</span></span><b>${h.score}/${CRITERES.length}</b></div>`).join('')}</div>` : ''}
      <details class="card"><summary><b>📋 Méthode et conseils</b></summary><div class="course">${METHODE}</div></details>
      ${THEMES.map((t) => `<h2>${esc(t)}</h2><div class="list">${QUESTIONS.filter((q) => q.theme === t)
        .map((q) => `<details class="review-item"><summary>${esc(q.q)}${notes[qid(q)] ? ' <span class="badge ok">notes</span>' : ''}</summary>${advice(q)}<label class="small"><b>Mes notes (mots-clés, exemples)</b></label><textarea rows="4" data-note="${qid(q)}" placeholder="Ex. : déclic = baptême de l’air à 14 ans ; BIA en 1re ; exemple STAR : capitaine de l’équipe de hand…">${esc(notes[qid(q)] || '')}</textarea></details>`)
        .join('')}</div>`).join('')}
    </div>`);
  root.append(page);
  page.querySelectorAll('textarea[data-note]').forEach((ta) =>
    ta.addEventListener('input', () =>
      store.update((s) => {
        s.interview ||= { notes: {}, sessions: [] };
        s.interview.notes ||= {};
        if (ta.value.trim()) s.interview.notes[ta.dataset.note] = ta.value;
        else delete s.interview.notes[ta.dataset.note];
      }),
    ),
  );
}

// Enregistrement audio de la réponse (pour se réécouter) — rien n'est envoyé ni conservé après la page.
function recorder() {
  let rec = null, stream = null, chunks = [];
  return {
    get supported() {
      return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
    },
    async start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = [];
        rec = new MediaRecorder(stream);
        rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
        rec.start();
        return true;
      } catch {
        return false;
      }
    },
    stop() {
      return new Promise((resolve) => {
        if (!rec || rec.state === 'inactive') return resolve(null);
        rec.onstop = () => {
          stream?.getTracks().forEach((t) => t.stop());
          resolve(chunks.length ? new Blob(chunks, { type: rec.mimeType || 'audio/webm' }) : null);
        };
        rec.stop();
      });
    },
    kill() {
      try {
        rec?.state !== 'inactive' && rec?.stop();
      } catch {
        /* déjà arrêté */
      }
      stream?.getTracks().forEach((t) => t.stop());
    },
  };
}

export function renderSimulation(root) {
  let theme = 'all';
  let timers = [];
  let recordOn = true;
  const mic = recorder();
  let audioUrl = null;
  const clear = () => (timers.forEach(clearInterval), (timers = []));
  root.innerHTML = '';
  const page = el(`
    <div>
      <a href="#/entretien" class="small">← Entretien</a>
      <h1>Simulation d’entretien</h1>
            <label class="check mic-opt"><input type="checkbox" id="rec" checked> 🎙️ Enregistrer ma réponse pour me réécouter (reste sur le téléphone)</label>
      <div class="field"><label for="theme">Thème</label><select id="theme"><option value="all">Tous les thèmes</option>${THEMES.map((t) => `<option>${esc(t)}</option>`).join('')}</select></div>
      <div class="sim"></div>
    </div>`);
  root.append(page);
  const sim = page.querySelector('.sim');
  page.querySelector('#theme').onchange = (e) => ((theme = e.target.value), intro());
  if (!mic.supported) page.querySelector('.mic-opt').remove();
  else page.querySelector('#rec').onchange = (e) => (recordOn = e.target.checked);

  function intro() {
    clear();
    mic.kill();
    evaluating = false;
    sim.innerHTML = `<div class="card center"><p>Mets-toi dans les conditions : assis, droit, à voix haute. Imagine le jury en face de toi.</p><button class="btn primary block" data-go>Tirer une question</button></div>`;
    sim.querySelector('[data-go]').onclick = ask;
  }

  function countdown(sec, label, onEnd, elTarget) {
    const end = Date.now() + sec * 1000;
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      elTarget.textContent = `${label} ${fmtClock(left)}`;
      if (left <= 0) {
        clear();
        onEnd();
      }
    };
    tick();
    timers.push(setInterval(tick, 250));
  }

  function ask() {
    clear();
    evaluating = false;
    const pool = QUESTIONS.filter((q) => theme === 'all' || q.theme === theme);
    const q = pool[Math.floor(Math.random() * pool.length)];
    const t0 = Date.now();
    sim.innerHTML = `
      <div class="card">
        <p class="small muted">${esc(q.theme)}</p>
        <h2 style="margin-top:4px">« ${esc(q.q)} »</h2>
        <div class="big-calc sim-clock"></div>
        <div class="progress"><div class="sim-bar" style="width:0"></div></div>
        <button class="btn primary block" data-next>Je commence à répondre</button>
      </div>`;
    const clock = sim.querySelector('.sim-clock');
    const btn = sim.querySelector('[data-next]');
    let speaking = false;
    const speak = async () => {
      if (speaking) return;
      speaking = true;
      clear();
      btn.onclick = null;
      if (recordOn && mic.supported) {
        const ok = await mic.start();
        if (ok) sim.querySelector('.sim-clock').insertAdjacentHTML('afterend', '<p class="center small" style="color:var(--danger)">● Enregistrement en cours</p>');
      }
      btn.textContent = 'J’ai terminé';
      btn.onclick = () => evaluate(q, t0);
      const bar = sim.querySelector('.sim-bar');
      const start = Date.now();
      timers.push(setInterval(() => (bar.style.width = Math.min(100, ((Date.now() - start) / 120000) * 100) + '%'), 250));
      countdown(120, '🎤 Réponse :', () => evaluate(q, t0), clock);
    };
    btn.onclick = speak;
    countdown(20, '🤔 Réflexion :', speak, clock);
  }

  let evaluating = false;
  async function evaluate(q, t0) {
    if (evaluating) return;
    evaluating = true;
    clear();
    const blob = await mic.stop();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioUrl = blob ? URL.createObjectURL(blob) : null;
    sim.innerHTML = `
      <div class="card">
        <h3>« ${esc(q.q)} »</h3>
        <p class="small muted">Durée totale : ${fmtClock(Date.now() - t0)}</p>
        ${audioUrl ? `<h4>🎧 Réécoute ta réponse</h4><audio controls src="${audioUrl}" style="width:100%"></audio><p class="small muted">Repère les « euh », les silences, les phrases trop longues, le ton monotone. <a href="${audioUrl}" download="entretien-${new Date().toISOString().slice(0, 10)}.webm">Télécharger</a></p>` : ''}
        <h4>Auto-évaluation</h4>
        ${CRITERES.map((c, i) => `<label class="check"><input type="checkbox" data-c="${i}"> ${esc(c)}</label>`).join('')}
        ${advice(q)}
        <div class="btn-row"><button class="btn primary" data-save>Enregistrer et question suivante</button></div>
      </div>`;
    sim.querySelector('[data-save]').onclick = () => {
      const score = sim.querySelectorAll('input[data-c]:checked').length;
      store.update((s) => {
        s.interview ||= { notes: {}, sessions: [] };
        s.interview.sessions ||= [];
        s.interview.sessions.push({ ts: Date.now(), q: qid(q), score });
        if (s.interview.sessions.length > 300) s.interview.sessions.shift();
      });
      recordActivity(Date.now() - t0);
      evaluating = false;
      ask();
    };
  }

  intro();
  return () => {
    clear();
    mic.kill();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  };
}
