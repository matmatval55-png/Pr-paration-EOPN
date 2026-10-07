// Psychomotricité : approximation de l'épreuve « manche + palonniers » sur téléphone.
// Le manche = incliner le téléphone (gyroscope) ou glisser le doigt ; les palonniers = deux boutons.
import { register } from '../core/registry.js';
import { el } from '../core/ui.js';

register({
  id: 'psy.manche',
  module: 'psycho',
  group: 'Psychomotricité',
  title: 'Manche et palonniers',
  desc: 'Garder l’avion dans la cible en inclinant le téléphone, et corriger le lacet aux « palonniers ».',
  noSrs: true,
  make(level, r) {
    const dur = { 1: 30, 2: 40, 3: 45 }[level];
    const radius = { 1: 0.32, 2: 0.26, 3: 0.2 }[level];
    const pedals = level >= 2;
    const turb = { 1: 0.35, 2: 0.5, 3: 0.75 }[level];
    const seed = r.int(1, 1e9);
    return {
      kind: 'custom',
      timeLimit: dur + 60,
      prompt: `<b>${dur} s</b> : garde le symbole ✈ dans le cercle vert malgré les turbulences${pedals ? ', et garde le curseur de lacet au centre avec les boutons ◀ ▶ (palonniers)' : ''}.`,
      explain: `<p>Score = pourcentage du temps passé dans la zone${pedals ? ' (60 % manche, 40 % palonniers)' : ''}. Réussi à partir de 60 %.</p><p class="tip">Fais des corrections <b>petites et précoces</b> : un pilote anticipe la dérive au lieu de la rattraper. Les grands mouvements font osciller l’avion autour de la cible. Respire calmement, épaules relâchées. C’est une approximation : la vraie épreuve (système d’évaluation candidat pilote, 20 min, éliminatoire) se passe avec un vrai manche et de vrais palonniers.</p>`,
      mount(area, finish) {
        const ui = el(`
          <div class="pm">
            <div class="pm-choice">
              <p class="small">Mode de commande :</p>
              <div class="btn-row"><button class="btn primary" data-mode="tilt">📱 Incliner le téléphone</button><button class="btn" data-mode="touch">👆 Doigt</button></div>
              <p class="small muted">Incliner : tiens le téléphone à plat devant toi, comme un manche. Doigt : fais glisser dans le cadre.</p>
            </div>
            <div class="pm-zone hidden"><div class="pm-target"></div><div class="pm-plane">✈</div><div class="pm-clock"></div></div>
            ${pedals ? '<div class="pm-yaw hidden"><div class="pm-yaw-ok"></div><div class="pm-yaw-cur"></div></div><div class="pm-pedals hidden"><button type="button" data-p="-1">◀ Gauche</button><button type="button" data-p="1">Droite ▶</button></div>' : ''}
          </div>`);
        area.append(ui);
        const zone = ui.querySelector('.pm-zone');
        const plane = ui.querySelector('.pm-plane');
        const target = ui.querySelector('.pm-target');
        const clock = ui.querySelector('.pm-clock');
        const yawCur = ui.querySelector('.pm-yaw-cur');
        target.style.width = target.style.height = radius * 100 + '%';

        let rs = seed;
        const rnd = () => ((rs = (rs * 1103515245 + 12345) % 2147483648) / 2147483648);
        let ctrl = [0, 0], pedal = 0, neutral = null, mode = 'touch';
        let x = 0, y = 0, yaw = 0, wx = 0, wy = 0, wyaw = 0;
        let inS = 0, inY = 0, frames = 0, raf = 0, over = false, t0 = 0, last = 0;

        const onOrient = (e) => {
          if (e.beta == null) return;
          if (!neutral) neutral = [e.gamma, e.beta];
          ctrl = [Math.max(-1, Math.min(1, (e.gamma - neutral[0]) / 20)), Math.max(-1, Math.min(1, (e.beta - neutral[1]) / 20))];
        };
        const onTouch = (e) => {
          const b = zone.getBoundingClientRect();
          ctrl = [Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width - 0.5) * 2)), Math.max(-1, Math.min(1, ((e.clientY - b.top) / b.height - 0.5) * 2))];
        };
        const release = () => (ctrl = [0, 0]);

        async function begin(m) {
          mode = m;
          if (m === 'tilt') {
            try {
              if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
                const p = await DeviceOrientationEvent.requestPermission();
                if (p !== 'granted') throw new Error('refus');
              }
              addEventListener('deviceorientation', onOrient);
            } catch {
              mode = 'touch';
            }
          }
          if (mode === 'touch') {
            zone.addEventListener('pointerdown', (e) => (zone.setPointerCapture?.(e.pointerId), onTouch(e)));
            zone.addEventListener('pointermove', (e) => (e.buttons || e.pointerType === 'mouse') && onTouch(e));
            zone.addEventListener('pointerup', release);
          }
          ui.querySelector('.pm-choice').remove();
          ui.querySelectorAll('.hidden').forEach((n) => n.classList.remove('hidden'));
          ui.querySelectorAll('[data-p]').forEach((b) => {
            const v = Number(b.dataset.p);
            b.addEventListener('pointerdown', (e) => (e.preventDefault(), (pedal = v)));
            ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, () => pedal === v && (pedal = 0)));
          });
          // si le capteur ne répond pas dans la seconde, on passe au doigt
          setTimeout(() => {
            if (mode === 'tilt' && !neutral) {
              mode = 'touch';
              removeEventListener('deviceorientation', onOrient);
              zone.addEventListener('pointerdown', (e) => onTouch(e));
              zone.addEventListener('pointermove', (e) => (e.buttons || e.pointerType === 'mouse') && onTouch(e));
              zone.addEventListener('pointerup', release);
            }
          }, 1000);
          t0 = last = performance.now();
          raf = requestAnimationFrame(loop);
        }

        function loop(now) {
          if (over) return;
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          // turbulence lissée
          wx += (rnd() - 0.5) * turb * 3 * dt - wx * 0.4 * dt;
          wy += (rnd() - 0.5) * turb * 3 * dt - wy * 0.4 * dt;
          wyaw += (rnd() - 0.5) * turb * 3 * dt - wyaw * 0.4 * dt;
          x = Math.max(-1, Math.min(1, x + (ctrl[0] * 1.1 + wx) * dt));
          y = Math.max(-1, Math.min(1, y + (ctrl[1] * 1.1 + wy) * dt));
          yaw = Math.max(-1, Math.min(1, yaw + (pedal * 0.9 + wyaw) * dt));
          frames++;
          const ok = Math.hypot(x, y) <= radius;
          if (ok) inS++;
          if (Math.abs(yaw) <= 0.25) inY++;
          plane.style.left = 50 + x * 45 + '%';
          plane.style.top = 50 + y * 45 + '%';
          plane.classList.toggle('on', ok);
          if (yawCur) {
            yawCur.style.left = 50 + yaw * 48 + '%';
            yawCur.classList.toggle('on', Math.abs(yaw) <= 0.25);
          }
          const left = dur - (now - t0) / 1000;
          clock.textContent = Math.ceil(left) + ' s';
          if (left <= 0) return end();
          raf = requestAnimationFrame(loop);
        }

        function end() {
          over = true;
          cancelAnimationFrame(raf);
          removeEventListener('deviceorientation', onOrient);
          const s1 = frames ? inS / frames : 0;
          const s2 = frames ? inY / frames : 0;
          const score = pedals ? 0.6 * s1 + 0.4 * s2 : s1;
          ui.querySelectorAll('button').forEach((b) => (b.disabled = true));
          finish({ ok: score >= 0.6, explainExtra: `<p>Manche : <b>${Math.round(s1 * 100)} %</b> du temps dans la cible${pedals ? ` · Palonniers : <b>${Math.round(s2 * 100)} %</b>` : ''} · Score : <b>${Math.round(score * 100)} %</b> (commande : ${mode === 'tilt' ? 'inclinaison' : 'doigt'}).</p>` });
        }

        ui.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => begin(b.dataset.mode)));
        return () => {
          over = true;
          cancelAnimationFrame(raf);
          removeEventListener('deviceorientation', onOrient);
        };
      },
    };
  },
});
