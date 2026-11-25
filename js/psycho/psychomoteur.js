// Psychomotricité : approximation de l'épreuve « manche + palonniers » sur téléphone.
// Le manche = incliner le téléphone (gyroscope) ou glisser le doigt ; les palonniers = deux boutons.
import { register } from '../core/registry.js';
import { makeRng } from '../core/rng.js';
import { el } from '../core/ui.js';

export function coordinationScore(stick, yaw, pedals) {
  const score = pedals ? 0.6 * stick + 0.4 * yaw : stick;
  return { score, ok: score >= 0.6 && stick >= 0.6 && (!pedals || yaw >= 0.6) };
}

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
      explain: `<p>Score = pourcentage du temps passé dans la zone${pedals ? ' (60 % manche, 40 % palonniers)' : ''}. Objectif interne : 60 % au total et au moins 60 % sur chaque axe évalué.</p><p class="tip">Fais des corrections <b>petites et précoces</b> : un pilote anticipe la dérive au lieu de la rattraper. Les grands mouvements font osciller l’avion autour de la cible. Respire calmement, épaules relâchées. Cet exercice simule une charge de coordination. Le matériel du navigateur donne des sensations différentes du manche et des palonniers d’une épreuve réelle.</p>`,
      mount(area, finish, { mode: quizMode } = {}) {
        const ui = el(`
          <div class="pm">
            <div class="pm-choice">
              <p class="small">Mode de commande :</p>
              <div class="btn-row"><button class="btn primary" data-mode="tilt">📱 Incliner le téléphone</button><button class="btn" data-mode="touch">👆 Doigt</button></div>
              <p class="small muted">Incliner : tiens le téléphone à plat devant toi, comme un manche. Doigt et souris : vise dans le cadre. Clavier : flèches pour le manche, A/D pour le lacet. Une manette connectée peut piloter les deux axes.</p>
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

        const random = makeRng(seed);
        const phases = [0, 1, 2].map(() => random.next() * 2 * Math.PI);
        const keys = new Set();
        const clamp = (value) => Math.max(-1, Math.min(1, value));
        function onKey(event) {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD'].includes(event.code)) return;
          event.preventDefault();
          if (event.type === 'keydown') keys.add(event.code);
          else keys.delete(event.code);
        }
        const resetKeys = () => keys.clear();
        let ctrl = [0, 0], pedal = 0, neutral = null, mode = 'touch';
        let x = 0, y = 0, yaw = 0;
        let inS = 0, inY = 0, elapsed = 0, distance = 0, raf = 0, over = false, t0 = 0, last = 0;
        let starting = false, fallback = null;
        function stop() {
          over = true;
          clearTimeout(fallback);
          cancelAnimationFrame(raf);
          removeEventListener('deviceorientation', onOrient);
          removeEventListener('keydown', onKey);
          removeEventListener('keyup', onKey);
          removeEventListener('blur', resetKeys);
        }

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
          if (starting || over) return;
          starting = true;
          mode = m;
          if (m === 'tilt') {
            try {
              if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
                const p = await DeviceOrientationEvent.requestPermission();
                if (p !== 'granted') throw new Error('refus');
              }
              if (over) return;
              addEventListener('deviceorientation', onOrient);
            } catch {
              mode = 'touch';
            }
          }
          if (over) return;
          addEventListener('keydown', onKey);
          addEventListener('keyup', onKey);
          addEventListener('blur', resetKeys);
          if (mode === 'touch') {
            zone.addEventListener('pointerdown', (e) => (zone.setPointerCapture?.(e.pointerId), onTouch(e)));
            zone.addEventListener('pointermove', (e) => (e.buttons || e.pointerType === 'mouse') && onTouch(e));
            zone.addEventListener('pointerup', release);
            zone.addEventListener('pointercancel', release);
          }
          ui.querySelector('.pm-choice').remove();
          ui.querySelectorAll('.hidden').forEach((n) => n.classList.remove('hidden'));
          ui.querySelectorAll('[data-p]').forEach((b) => {
            const v = Number(b.dataset.p);
            b.addEventListener('pointerdown', (e) => (e.preventDefault(), (pedal = v)));
            ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, () => pedal === v && (pedal = 0)));
          });
          // si le capteur ne répond pas dans la seconde, on passe au doigt
          fallback = setTimeout(() => {
            if (mode === 'tilt' && !neutral) {
              mode = 'touch';
              removeEventListener('deviceorientation', onOrient);
              zone.addEventListener('pointerdown', (e) => onTouch(e));
              zone.addEventListener('pointermove', (e) => (e.buttons || e.pointerType === 'mouse') && onTouch(e));
              zone.addEventListener('pointerup', release);
            zone.addEventListener('pointercancel', release);
            }
          }, 1000);
          t0 = last = performance.now();
          raf = requestAnimationFrame(loop);
        }

        function loop(now) {
          if (over) return;
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          const seconds = (now - t0) / 1000;
          const [wx, wy, wyaw] = phases.map((phase, i) => turb * (
            0.36 * Math.sin(seconds * (0.45 + 0.21 * i) + phase) +
            0.16 * Math.sin(seconds * (1.3 + 0.17 * i) + phase / 2)
          ));
          const gamepad = navigator.getGamepads?.()[0];
          const useAxis = (i) => Math.abs(gamepad?.axes[i] || 0) > 0.12 ? gamepad.axes[i] : 0;
          const horizontal = Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft'));
          const vertical = Number(keys.has('ArrowDown')) - Number(keys.has('ArrowUp'));
          const rudder = Number(keys.has('KeyD')) - Number(keys.has('KeyA'));
          x = clamp(x + ((horizontal || useAxis(0) || ctrl[0]) * 1.1 + wx) * dt);
          y = clamp(y + ((vertical || useAxis(1) || ctrl[1]) * 1.1 + wy) * dt);
          yaw = clamp(yaw + ((rudder || useAxis(2) || pedal) * 0.9 + wyaw) * dt);
          elapsed += dt;
          const error = Math.hypot(x, y);
          const ok = error <= radius;
          distance += error * dt;
          if (ok) inS += dt;
          if (Math.abs(yaw) <= 0.25) inY += dt;
          plane.style.left = 50 + x * 45 + '%';
          plane.style.top = 50 + y * 45 + '%';
          plane.classList.toggle('on', quizMode !== 'exam' && ok);
          if (yawCur) {
            yawCur.style.left = 50 + yaw * 48 + '%';
            yawCur.classList.toggle('on', quizMode !== 'exam' && Math.abs(yaw) <= 0.25);
          }
          const left = dur - (now - t0) / 1000;
          clock.textContent = Math.ceil(left) + ' s';
          if (left <= 0) return end();
          raf = requestAnimationFrame(loop);
        }

        function end() {
          stop();
          const s1 = Math.min(1, inS / dur);
          const s2 = Math.min(1, inY / dur);
          const { score, ok } = coordinationScore(s1, s2, pedals);
          ui.querySelectorAll('button').forEach((b) => (b.disabled = true));
          finish({ ok: ok && elapsed >= 0.9 * dur, explainExtra: `<p>Manche : <b>${Math.round(s1 * 100)} %</b> du temps dans la cible · écart moyen : ${Math.round(100 * distance / (elapsed || 1))} % de la demi-échelle · hors tolérance : ${Math.round(Math.max(0, dur - inS))} s${pedals ? ` · Palonniers : <b>${Math.round(s2 * 100)} %</b>` : ''} · Score : <b>${Math.round(score * 100)} %</b>${elapsed < 0.9 * dur ? ' · Mesure incomplète : moins de 90 % de la séance observée.' : ''} (commande : ${mode === 'tilt' ? 'inclinaison' : 'doigt'}).</p>` });
        }

        ui.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => begin(b.dataset.mode)));
        return stop;
      },
    };
  },
});
