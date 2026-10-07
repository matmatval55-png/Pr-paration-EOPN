// Bande sonore du test Luc Léger (navette 20 m), générée par le téléphone.
// Vitesses : le livret officiel indique palier 12 = 14 km/h ; avec la progression standard
// de +0,5 km/h par palier, cela donne 8,5 km/h au palier 1 (à vérifier sur la bande officielle).
import { el, toast } from '../core/ui.js';
import { BAREME, noteFrom, fmtLeger } from '../sport/bareme.js';
import { store } from '../core/store.js';
import { recordActivity } from '../core/stats.js';

export const speed = (p) => 8.5 + 0.5 * (p - 1); // km/h
export const shuttleTime = (p) => 20 / (speed(p) / 3.6); // secondes pour 20 m
export const shuttlesIn = (p) => Math.round(60 / shuttleTime(p));

// Chronologie des bips : [{ t, palier, navette, newPalier }]
export function timeline(startPalier = 1, maxPalier = 20) {
  const ev = [];
  let t = 0;
  for (let p = startPalier; p <= maxPalier; p++) {
    for (let k = 1; k <= shuttlesIn(p); k++) {
      t += shuttleTime(p);
      ev.push({ t, palier: p, navette: k, newPalier: k === shuttlesIn(p) });
    }
  }
  return ev;
}

export let pendingLeger = null;
export const consumePendingLeger = () => {
  const v = pendingLeger;
  pendingLeger = null;
  return v;
};

export function renderLeger(root) {
  let ctx = null, raf = 0, wake = null, events = [], t0 = 0, startP = 1, running = false;
  const sex = store.data.settings.sex || 'H';
  root.innerHTML = '';
  const page = el(`
    <div>
      <a href="#/sport" class="small">← Sport</a>
      <h1>Bande sonore Luc Léger</h1>
      <p class="muted small">Pose deux repères à 20 m. À chaque bip, tu dois atteindre la ligne opposée. Trois bips rapides + annonce vocale = changement de palier (la vitesse augmente). Monte le son, garde l’écran allumé.</p>
      <div class="card center leger">
        <div class="leger-palier">Palier <b>—</b></div>
        <div class="leger-info small muted">Prêt</div>
        <div class="big-calc leger-clock">0:00</div>
        <div class="progress"><div class="leger-bar" style="width:0"></div></div>
        <div class="field" style="text-align:left"><label for="startp">Commencer au palier</label><select id="startp">${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1} (${String(speed(i + 1)).replace('.', ',')} km/h)</option>`).join('')}</select></div>
        <button class="btn primary block" data-go>▶ Démarrer (décompte de 5 s)</button>
        <button class="btn block danger hidden" data-stop>■ J’arrête</button>
        <div class="leger-result"></div>
      </div>
      <details class="card small"><summary><b>Vitesses par palier</b></summary><div class="table-wrap"><table class="tbl"><tr><th>Palier</th><th>km/h</th><th>s / 20 m</th><th>Allers</th></tr>${Array.from({ length: 14 }, (_, i) => i + 1)
        .map((p) => `<tr><td>${p}</td><td>${String(speed(p)).replace('.', ',')}</td><td>${shuttleTime(p).toFixed(2).replace('.', ',')}</td><td>${shuttlesIn(p)}</td></tr>`)
        .join('')}</table></div><p>Vitesses déduites du livret officiel (palier 12 = 14 km/h, +0,5 km/h par palier). La bande utilisée le jour J peut légèrement différer : <b>à vérifier</b>.</p></details>
    </div>`);
  root.append(page);
  const $ = (s) => page.querySelector(s);
  const closeCtx = () => {
    if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {});
  };

  function beep(at, freq = 880, dur = 0.12) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.6, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(ctx.destination);
    o.start(at);
    o.stop(at + dur + 0.02);
  }
  const say = (txt) => {
    try {
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = 'fr-FR';
      speechSynthesis.speak(u);
    } catch {
      /* synthèse vocale indisponible */
    }
  };

  async function start() {
    startP = Number($('#startp').value);
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    try {
      wake = await navigator.wakeLock?.request('screen');
    } catch {
      wake = null;
    }
    events = timeline(startP);
    const lead = 5;
    t0 = ctx.currentTime + lead;
    for (let i = 1; i <= lead; i++) beep(t0 - i, 600, 0.08);
    beep(t0, 1000, 0.25);
    for (const e of events) {
      if (e.newPalier) for (let k = 0; k < 3; k++) beep(t0 + e.t + k * 0.18, 1100, 0.1);
      else beep(t0 + e.t);
    }
    running = true;
    $('[data-go]').classList.add('hidden');
    $('[data-stop]').classList.remove('hidden');
    $('.leger-result').innerHTML = '';
    let lastAnnounced = startP - 1;
    const tick = () => {
      if (!running) return;
      const t = ctx.currentTime - t0;
      if (t < 0) {
        $('.leger-info').textContent = `Départ dans ${Math.ceil(-t)}…`;
        raf = requestAnimationFrame(tick);
        return;
      }
      const idx = events.findIndex((e) => e.t > t);
      if (idx < 0) return stop();
      const cur = events[idx];
      const prevT = idx ? events[idx - 1].t : 0;
      if (cur.palier !== lastAnnounced) {
        lastAnnounced = cur.palier;
        if (cur.palier > startP) say(`Palier ${cur.palier}`);
      }
      $('.leger-palier').innerHTML = `Palier <b>${cur.palier}</b> · ${String(speed(cur.palier)).replace('.', ',')} km/h`;
      $('.leger-info').textContent = `Aller ${cur.navette} / ${shuttlesIn(cur.palier)}`;
      $('.leger-clock').textContent = `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
      $('.leger-bar').style.width = ((t - prevT) / (cur.t - prevT)) * 100 + '%';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    const t = Math.max(0, ctx.currentTime - t0);
    closeCtx();
    wake?.release?.();
    speechSynthesis?.cancel?.();
    $('[data-go]').classList.remove('hidden');
    $('[data-stop]').classList.add('hidden');
    // paliers terminés + secondes dans le palier en cours (notation du barème : « 7+15s »)
    const done = events.filter((e) => e.newPalier && e.t <= t);
    const palier = done.length ? done[done.length - 1].palier : startP - 1;
    const palierEnd = done.length ? done[done.length - 1].t : 0;
    const sec = Math.min(59, Math.floor(t - palierEnd));
    const note = startP === 1 ? noteFrom(BAREME.leger[sex], palier * 60 + sec) : null;
    recordActivity(t * 1000);
    $('.leger-result').innerHTML = `
      <div class="fb-explain" style="text-align:left">
        <p>Tu as tenu <b>${Math.floor(t / 60)} min ${String(Math.floor(t % 60)).padStart(2, '0')} s</b> : palier <b>${fmtLeger(palier * 60 + sec)}</b> (${palier} palier(s) terminé(s) + ${sec} s).</p>
        ${note != null ? `<p>Note au barème officiel (${sex === 'H' ? 'hommes' : 'femmes'}) : <b>${note}/20</b>.</p><button class="btn primary block" data-save>Enregistrer dans mes tests</button>` : '<p class="small muted">Départ au-delà du palier 1 : séance d’entraînement, non notée.</p>'}
      </div>`;
    $('[data-save]')?.addEventListener('click', () => {
      pendingLeger = { palier, sec };
      toast('Complète les autres épreuves puis enregistre');
      location.hash = '#/sport';
    });
  }

  $('[data-go]').onclick = start;
  $('[data-stop]').onclick = stop;
  return () => {
    running = false;
    cancelAnimationFrame(raf);
    closeCtx();
    wake?.release?.();
  };
}
