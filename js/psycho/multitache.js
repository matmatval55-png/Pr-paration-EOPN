// Multitâche : poursuite d'une cible + calcul + surveillance de voyants, en simultané.
import { register } from '../core/registry.js';
import { el } from '../core/ui.js';

const M = 'psycho';

register({
  id: 'psy.multitache',
  module: M,
  group: 'Multitâche',
  title: 'Multitâche',
  desc: 'Suivre une cible du doigt tout en calculant et en surveillant des voyants.',
  noSrs: true,
  make(level, r) {
    const dur = { 1: 30, 2: 45, 3: 60 }[level];
    const lights = level >= 2;
    const speed = { 1: 0.5, 2: 0.75, 3: 1.05 }[level];
    const seed = r.int(1, 1e9);
    return {
      kind: 'custom',
      prompt: `<b>${dur} secondes</b> : garde le doigt (ou la souris) sur la cible ◎, réponds aux calculs${lights ? ' et touche un voyant dès qu’il passe au <b style="color:var(--danger)">rouge</b>' : ''}.`,
      timeLimit: dur + 4,
      explain: `<p>Score global = ${lights ? '40 % poursuite + 40 % calculs + 20 % voyants' : '50 % poursuite + 50 % calculs'}. Réussi à partir de 60 %.</p><p class="tip">Méthode : la poursuite est une tâche « de fond » ; garde la cible dans ta vision périphérique et jette un coup d’œil bref aux calculs. Ne t’acharne pas sur un calcul difficile : une réponse rapide vaut mieux qu’une poursuite perdue. C’est exactement ce qu’on attend d’un pilote : piloter d’abord, puis gérer le reste.</p>`,
      mount(area, finish) {
        const ui = el(`
          <div class="mt">
            <div class="mt-track"><div class="mt-target">◎</div><div class="mt-clock"></div></div>
            <div class="mt-calc"><div class="mt-q">Prépare-toi…</div><div class="mt-ans"></div></div>
            ${lights ? '<div class="mt-lights"><button type="button" class="light" data-i="0">Moteur</button><button type="button" class="light" data-i="1">Carburant</button><button type="button" class="light" data-i="2">Hydraulique</button></div>' : ''}
          </div>`);
        area.append(ui);
        const track = ui.querySelector('.mt-track');
        const target = ui.querySelector('.mt-target');
        const clock = ui.querySelector('.mt-clock');
        const qEl = ui.querySelector('.mt-q');
        const ansEl = ui.querySelector('.mt-ans');
        let rs = seed;
        const rnd = () => ((rs = (rs * 1103515245 + 12345) % 2147483648) / 2147483648);
        let pointer = null;
        const setP = (e) => {
          const b = track.getBoundingClientRect();
          pointer = [e.clientX - b.left, e.clientY - b.top];
        };
        track.addEventListener('pointerdown', (e) => {
          track.setPointerCapture?.(e.pointerId);
          setP(e);
        });
        track.addEventListener('pointermove', (e) => {
          if (e.pointerType === 'mouse' || e.buttons || e.pressure) setP(e);
        });
        track.addEventListener('pointerup', (e) => {
          if (e.pointerType !== 'mouse') pointer = null;
        });
        track.addEventListener('pointerleave', () => (pointer = null));

        let tx = 0.5, ty = 0.5, vx = 0.3, vy = 0.2, inside = 0, frames = 0;
        let calcOk = 0, calcN = 0, curAns = null;
        let lightOk = 0, lightN = 0, litIdx = -1, litT = 0;
        const t0 = performance.now();
        let last = t0, nextCalc = t0 + 800, nextLight = t0 + 4000 + rnd() * 3000;
        let raf = 0, over = false;

        const newCalc = () => {
          const a = 2 + Math.floor(rnd() * (level === 3 ? 18 : 9));
          const b = 2 + Math.floor(rnd() * 9);
          const op = rnd() < 0.5 ? '+' : '×';
          const res = op === '+' ? a + b : a * b;
          const opts = [res, res + (rnd() < 0.5 ? 1 : -1) * (1 + Math.floor(rnd() * 3)), res + (op === '×' ? a : 10)];
          const sh = opts.map((v) => [rnd(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
          qEl.textContent = `${a} ${op} ${b} = ?`;
          ansEl.innerHTML = '';
          curAns = res;
          calcN++;
          sh.forEach((v) => {
            const bt = document.createElement('button');
            bt.type = 'button';
            bt.textContent = v;
            bt.onclick = () => {
              if (curAns == null) return;
              if (v === curAns) calcOk++;
              bt.classList.add(v === curAns ? 'right' : 'wrong');
              curAns = null;
              nextCalc = performance.now() + 500;
            };
            ansEl.append(bt);
          });
          nextCalc = performance.now() + (level === 3 ? 4000 : 5000);
        };

        if (lights)
          ui.querySelectorAll('.light').forEach((b) =>
            (b.onclick = () => {
              const i = Number(b.dataset.i);
              if (i === litIdx) {
                lightOk++;
                b.classList.remove('red');
                litIdx = -1;
              } else {
                lightOk = Math.max(0, lightOk - 0.5);
                b.classList.add('flash');
                setTimeout(() => b.classList.remove('flash'), 200);
              }
            }),
          );

        const loop = (now) => {
          if (over) return;
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          // déplacement de la cible (marche aléatoire lissée)
          vx += (rnd() - 0.5) * 1.6 * dt * speed * 3;
          vy += (rnd() - 0.5) * 1.6 * dt * speed * 3;
          const vmax = 0.35 * speed;
          vx = Math.max(-vmax, Math.min(vmax, vx));
          vy = Math.max(-vmax, Math.min(vmax, vy));
          tx += vx * dt;
          ty += vy * dt;
          if (tx < 0.08 || tx > 0.92) (vx = -vx), (tx = Math.max(0.08, Math.min(0.92, tx)));
          if (ty < 0.12 || ty > 0.88) (vy = -vy), (ty = Math.max(0.12, Math.min(0.88, ty)));
          const b = track.getBoundingClientRect();
          const px = tx * b.width, py = ty * b.height;
          target.style.transform = `translate(${px - 22}px, ${py - 22}px)`;
          frames++;
          const isIn = pointer && Math.hypot(pointer[0] - px, pointer[1] - py) < 34;
          if (isIn) inside++;
          target.classList.toggle('on', !!isIn);
          if (now >= nextCalc) {
            if (curAns != null) qEl.classList.add('missed'), setTimeout(() => qEl.classList.remove('missed'), 300);
            newCalc();
          }
          if (lights) {
            if (litIdx >= 0 && now - litT > 2500) {
              ui.querySelectorAll('.light')[litIdx].classList.remove('red');
              litIdx = -1;
            }
            if (litIdx < 0 && now >= nextLight) {
              litIdx = Math.floor(rnd() * 3);
              litT = now;
              lightN++;
              ui.querySelectorAll('.light')[litIdx].classList.add('red');
              nextLight = now + 3500 + rnd() * 4000;
            }
          }
          const left = dur - (now - t0) / 1000;
          clock.textContent = Math.ceil(left) + ' s';
          if (left <= 0) return end();
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        const end = () => {
          over = true;
          cancelAnimationFrame(raf);
          const tr = frames ? inside / frames : 0;
          const ca = calcN ? calcOk / calcN : 0;
          const li = lightN ? lightOk / lightN : 1;
          const score = lights ? 0.4 * tr + 0.4 * ca + 0.2 * li : 0.5 * tr + 0.5 * ca;
          ui.querySelectorAll('button').forEach((x) => (x.disabled = true));
          finish({
            ok: score >= 0.6,
            explainExtra: `<p>Poursuite : <b>${Math.round(tr * 100)} %</b> du temps sur la cible · Calculs : <b>${calcOk}/${calcN}</b>${lights ? ` · Voyants : <b>${Math.round(lightOk)}/${lightN}</b>` : ''}<br>Score global : <b>${Math.round(score * 100)} %</b></p>`,
          });
        };
        return () => {
          over = true;
          cancelAnimationFrame(raf);
        };
      },
    };
  },
});
