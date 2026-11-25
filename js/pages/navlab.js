import { advanceAircraft, groundTrack, NAV_SCENARIOS, signed, vorIndication } from '../psycho/navlab.js';
import { headingSVG, horizonSVG } from '../psycho/instruments.js';
import { rmiSVG } from '../psycho/situations.js';
import { cdiSVG } from '../psycho/situations2.js';
import { el } from '../core/ui.js';

export function renderNavLab(root) {
  const page = el(`<div>
    <a href="#/psycho">← Psychotechniques</a><h1>Laboratoire VOR</h1>
    <p>Règle la route sur l’OBS, intercepte l’axe vers la balise puis tiens-le pendant 12 secondes à moins de 0,25 NM et à 12° près en route sol. Le temps simulé avance trois fois plus vite.</p>
    <div class="field"><label for="nav-scenario">Scénario</label><select id="nav-scenario">${NAV_SCENARIOS.map((s, i) => `<option value="${i}">${s.title}</option>`).join('')}</select></div>
    <p data-brief></p>
    <div class="navlab-instruments card" aria-label="Instruments de navigation"></div>
    <p data-reading></p>
    <div class="field"><label for="nav-obs">Route sélectionnée sur l’OBS (°)</label><input id="nav-obs" type="range" min="0" max="359" step="1" value="0"></div>
    <div class="field"><label for="nav-bank">Inclinaison demandée (°)</label><input id="nav-bank" type="range" min="-30" max="30" step="1" value="0"></div>
    <div class="btn-row"><button type="button" class="btn" data-level>Inclinaison zéro</button><button type="button" class="btn primary" data-run>Démarrer</button><button type="button" class="btn" data-reset>Recommencer</button></div>
    <p data-result role="status"></p>
    <p class="small muted">Modèle pédagogique en palier. CDI centré à 0° et pleine déviation à 10°. L’indication est écartée près de la balise et à la limite TO/FROM. Cap et route utilisent la même référence de nord.</p>
  </div>`);
  root.replaceChildren(page);
  const select = page.querySelector('select');
  const slider = page.querySelector('#nav-bank');
  const obs = page.querySelector('#nav-obs');
  const run = page.querySelector('[data-run]');
  const result = page.querySelector('[data-result]');
  const panel = page.querySelector('.navlab-instruments');
  let scenario, aircraft, bank, stable, elapsed;
  let frame = 0, running = false, previous = null, lastDraw = 0;
  const cap = (value) => String(Math.round(value) % 360 || 360).padStart(3, '0');

  function draw() {
    const v = vorIndication(aircraft, Number(obs.value));
    panel.innerHTML = `<div>${headingSVG(aircraft.heading)}</div><div>${horizonSVG(0, bank, 'navlab')}</div><div>${v.valid ? cdiSVG(Math.max(-5, Math.min(5, v.deviation / 2)), v.to, false) : '<p>CDI indisponible</p>'}</div><div>${v.distance >= 0.2 ? rmiSVG(aircraft.heading, v.bearingTo, false) : '<p>RMI indisponible</p>'}</div>`;
    page.querySelector('[data-reading]').textContent = `Cap ${cap(aircraft.heading)}° · inclinaison ${Math.round(bank)}° · OBS ${cap(Number(obs.value))}° · distance ${v.distance.toFixed(1)} NM · ${v.valid ? (v.to ? 'TO' : 'FROM') : 'indication invalide'} · axe tenu ${Math.floor(stable)}/12 s`;
  }

  function pause() {
    running = false;
    cancelAnimationFrame(frame);
    previous = null;
    run.textContent = elapsed ? 'Reprendre' : 'Démarrer';
  }

  function reset() {
    pause();
    scenario = NAV_SCENARIOS[Number(select.value)];
    aircraft = { x: scenario.x, y: scenario.y, heading: scenario.heading };
    bank = stable = elapsed = 0;
    slider.value = '0';
    obs.value = String(scenario.course);
    run.textContent = 'Démarrer';
    run.disabled = false;
    result.textContent = '';
    page.querySelector('[data-brief]').textContent = `Route à intercepter ${cap(scenario.course)}° · vitesse vraie ${scenario.tas} kt · vent ${cap(scenario.windFrom)}° / ${scenario.windKt} kt`;
    draw();
  }

  function tick(now) {
    if (!running) return;
    const dt = previous == null ? 0 : Math.min((now - previous) / 1000, 0.05) * 3;
    previous = now;
    elapsed += dt;
    bank += (Number(slider.value) - bank) * Math.min(1, dt * 1.8);
    aircraft = advanceAircraft(aircraft, bank, dt, scenario);
    const v = vorIndication(aircraft, scenario.course);
    const track = groundTrack(aircraft.heading, scenario);
    stable = v.valid && v.to && Number(obs.value) === scenario.course &&
      Math.abs(v.crossTrack) <= 0.25 && Math.abs(signed(track - scenario.course)) <= 12 && Math.abs(bank) < 8
      ? stable + dt : 0;
    if (stable >= 12 || elapsed >= 150 || v.alongTrack >= 0) {
      const passed = stable >= 12;
      result.textContent = passed ? 'Axe intercepté et tenu pendant 12 secondes.' : 'Objectif non atteint. Recommence et anticipe la dérive.';
      pause();
      run.disabled = true;
      draw();
      return;
    }
    if (now - lastDraw >= 100) { lastDraw = now; draw(); }
    frame = requestAnimationFrame(tick);
  }

  select.onchange = reset;
  obs.oninput = draw;
  page.querySelector('[data-reset]').onclick = reset;
  page.querySelector('[data-level]').onclick = () => { slider.value = '0'; };
  run.onclick = () => {
    if (running) return pause();
    running = true;
    run.textContent = 'Pause';
    frame = requestAnimationFrame(tick);
  };
  document.addEventListener('visibilitychange', pause);
  reset();
  return () => { pause(); document.removeEventListener('visibilitychange', pause); };
}
