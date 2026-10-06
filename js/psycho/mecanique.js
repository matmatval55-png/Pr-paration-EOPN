// Compréhension mécanique : engrenages, leviers, poulies, hydraulique, balances.
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';
import { n } from '../core/fmt.js';

const M = 'psycho';

function gearsSVG(radii, firstCW, crossedAt = -1) {
  let x = 0;
  const pos = [];
  radii.forEach((rad, i) => {
    if (i === 0) x = rad + 6;
    else x += radii[i - 1] + rad + 2;
    pos.push(x);
  });
  const W = x + radii[radii.length - 1] + 6;
  const H = Math.max(...radii) * 2 + 30;
  const cy = H / 2;
  const arrow = firstCW
    ? `<path d="M ${pos[0] - 10} ${cy - radii[0] - 8} A ${radii[0] + 8} ${radii[0] + 8} 0 0 1 ${pos[0] + 10} ${cy - radii[0] - 8}" fill="none" stroke="var(--accent)" stroke-width="3" marker-end="url(#ah)"/>`
    : `<path d="M ${pos[0] + 10} ${cy - radii[0] - 8} A ${radii[0] + 8} ${radii[0] + 8} 0 0 0 ${pos[0] - 10} ${cy - radii[0] - 8}" fill="none" stroke="var(--accent)" stroke-width="3" marker-end="url(#ah)"/>`;
  return `<svg viewBox="0 -14 ${W} ${H + 14}" class="mech" style="max-width:${Math.min(W * 2.2, 520)}px">
    <defs><marker id="ah" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
    ${radii
      .map(
        (rad, i) => `<circle cx="${pos[i]}" cy="${cy}" r="${rad}" fill="var(--card2)" stroke="currentColor" stroke-width="5" stroke-dasharray="4 3"/>
        <circle cx="${pos[i]}" cy="${cy}" r="3" fill="currentColor"/>
        <text x="${pos[i]}" y="${cy + rad + 16}" text-anchor="middle" font-size="12" fill="currentColor">${i === 0 ? 'A' : i === radii.length - 1 ? '?' : ''}</text>`,
      )
      .join('')}
    ${arrow}
  </svg>`;
}

const templates = [
  // 0 — sens de rotation d'un train d'engrenages
  (lvl, r) => {
    const count = lvl === 1 ? r.int(2, 4) : lvl === 2 ? r.int(4, 6) : r.int(5, 7);
    const radii = Array.from({ length: count }, () => r.int(12, 24));
    const cw = r.bool();
    const lastCW = count % 2 === 1 ? cw : !cw;
    const choices = ['Sens horaire ↻', 'Sens antihoraire ↺'];
    return {
      kind: 'mcq',
      prompt: `La roue A tourne dans le sens <b>${cw ? 'horaire ↻' : 'antihoraire ↺'}</b>. Dans quel sens tourne la dernière roue (?) ?`,
      visual: gearsSVG(radii, cw),
      choices,
      answer: lastCW ? 0 : 1,
      explain: `<p>Deux roues dentées en contact tournent toujours en <b>sens inverse</b>. Le sens change donc à chaque roue : roues n° 1, 3, 5… dans le sens de A ; roues n° 2, 4, 6… dans l’autre sens.</p><p>Il y a ${count} roues : la dernière est la n° ${count}, ${count % 2 ? 'impaire' : 'paire'} → elle tourne dans le sens <b>${lastCW ? 'horaire' : 'antihoraire'}</b>.</p><p class="tip">La taille des roues ne change pas le sens, seulement la vitesse.</p>`,
    };
  },
  // 1 — vitesse de rotation (rapport de dents)
  (lvl, r) => {
    const za = r.pick([10, 12, 15, 20, 24, 30, 36, 40, 48, 60]);
    const zb = r.pick([10, 12, 15, 20, 24, 30, 40, 60].filter((z) => z !== za));
    const na = r.pick([30, 60, 90, 120, 150, 180, 240, 300]);
    const nb = (na * za) / zb;
    if (!Number.isInteger(nb * 10)) return templates[1](lvl, r);
    const { choices, answer } = buildChoices(r, nb, r.shuffle([(na * zb) / za, na, nb * 2, nb / 2, nb + 10]), 4);
    return {
      kind: 'mcq',
      prompt: `La roue A (${za} dents) tourne à ${na} tr/min et entraîne directement la roue B (${zb} dents). À quelle vitesse tourne B ?`,
      choices: choices.map((c) => n(c) + ' tr/min'),
      answer,
      explain: `<p>Les dents passent au même rythme sur les deux roues : <b>N<sub>A</sub> × Z<sub>A</sub> = N<sub>B</sub> × Z<sub>B</sub></b>.</p><p>N<sub>B</sub> = ${na} × ${za} ÷ ${zb} = <b>${n(nb)} tr/min</b>.</p><p class="tip">Réflexe : la roue qui a <b>moins</b> de dents tourne <b>plus vite</b>.</p>`,
    };
  },
  // 2 — levier
  (lvl, r) => {
    const P = r.pick([100, 120, 200, 240, 300, 400, 500, 600]);
    const d1 = r.pick([0.5, 1, 1.5, 2]);
    const d2 = r.pick([1, 2, 3, 4, 5].filter((d) => d > d1));
    const F = (P * d1) / d2;
    if (!Number.isInteger(F * 10)) return templates[2](lvl, r);
    const { choices, answer } = buildChoices(r, F, r.shuffle([(P * d2) / d1, P, F * 2, P - F, F + 50]), 4);
    const W = 300, pv = 20 + (d1 / (d1 + d2)) * 260;
    const vis = `<svg viewBox="0 0 ${W} 90" class="mech">
      <line x1="20" y1="40" x2="280" y2="40" stroke="currentColor" stroke-width="5"/>
      <polygon points="${pv},42 ${pv - 14},70 ${pv + 14},70" fill="var(--accent)"/>
      <rect x="10" y="12" width="22" height="26" fill="var(--card2)" stroke="currentColor" stroke-width="2"/><text x="21" y="8" text-anchor="middle" font-size="11" fill="currentColor">${P} N</text>
      <path d="M 278 10 L 278 34" stroke="var(--danger)" stroke-width="3" marker-end="url(#ah2)"/>
      <defs><marker id="ah2" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="var(--danger)"/></marker></defs>
      <text x="${(20 + pv) / 2}" y="86" text-anchor="middle" font-size="11" fill="currentColor">${n(d1)} m</text>
      <text x="${(pv + 280) / 2}" y="86" text-anchor="middle" font-size="11" fill="currentColor">${n(d2)} m</text>
      <text x="270" y="8" text-anchor="end" font-size="11" fill="currentColor">F ?</text>
    </svg>`;
    return {
      kind: 'mcq',
      prompt: `Une charge de ${P} N est à ${n(d1)} m du pivot. Quelle force F faut-il exercer à ${n(d2)} m de l’autre côté pour l’équilibrer ?`,
      visual: vis,
      choices: choices.map((c) => n(c) + ' N'),
      answer,
      explain: `<p>À l’équilibre, les <b>moments</b> sont égaux : force × distance au pivot.</p><p>${P} × ${n(d1)} = F × ${n(d2)} → F = ${n(P * d1)} ÷ ${n(d2)} = <b>${n(F)} N</b>.</p><p class="tip">Plus on appuie loin du pivot, moins il faut de force (principe du pied-de-biche).</p>`,
    };
  },
  // 3 — palan / poulies
  (lvl, r) => {
    const brins = lvl === 1 ? r.pick([1, 2]) : r.pick([2, 3, 4, 6]);
    const P = r.pick([120, 240, 360, 480, 600, 720]);
    const askDist = lvl >= 2 && r.bool();
    if (askDist) {
      const h = r.pick([1, 2, 3]);
      const L = h * brins;
      const { choices, answer } = buildChoices(r, L, r.shuffle([h, L * 2, h + brins, brins]), 4);
      return {
        kind: 'mcq',
        prompt: `Un palan comporte <b>${brins} brins</b> qui soutiennent la charge mobile. Pour monter la charge de ${h} m, quelle longueur de corde faut-il tirer ?`,
        choices: choices.map((c) => n(c) + ' m'),
        answer,
        explain: `<p>Chacun des ${brins} brins doit raccourcir de ${h} m : il faut tirer ${brins} × ${h} = <b>${L} m</b> de corde.</p><p class="tip">Ce qu’on gagne en force, on le perd en distance : force divisée par ${brins}, distance multipliée par ${brins}.</p>`,
      };
    }
    const F = P / brins;
    const { choices, answer } = buildChoices(r, F, r.shuffle([P, P * brins, P / 2, P / (brins + 1), F + 20]), 4);
    return {
      kind: 'mcq',
      prompt: `Avec un palan dont <b>${brins} brin${brins > 1 ? 's' : ''}</b> soutien${brins > 1 ? 'nent' : 't'} la charge, quelle force faut-il pour soulever ${P} N (frottements négligés) ?`,
      choices: choices.map((c) => n(c) + ' N'),
      answer,
      explain: `<p>Le poids se répartit sur les brins qui soutiennent la charge : F = P ÷ nombre de brins = ${P} ÷ ${brins} = <b>${n(F)} N</b>.</p>${brins === 1 ? '<p>Une poulie fixe seule ne fait que changer la direction de la force : pas de gain.</p>' : ''}`,
    };
  },
  // 4 — presse hydraulique
  (lvl, r) => {
    const s1 = r.pick([2, 4, 5, 10]);
    const k = r.pick([5, 10, 20, 25, 50]);
    const s2 = s1 * k;
    const F1 = r.pick([10, 20, 50, 100]);
    const F2 = F1 * k;
    const { choices, answer } = buildChoices(r, F2, r.shuffle([F1, F1 / k, F2 * 2, F1 + s2]), 4);
    return {
      kind: 'mcq',
      prompt: `Presse hydraulique : on appuie avec ${F1} N sur un petit piston de ${s1} cm². Quelle force s’exerce sur le grand piston de ${s2} cm² ?`,
      choices: choices.map((c) => n(c) + ' N'),
      answer,
      explain: `<p>La <b>pression</b> est la même partout dans le liquide : P = F ÷ S.</p><p>${F1} ÷ ${s1} = F ÷ ${s2} → F = ${F1} × ${s2} ÷ ${s1} = <b>${n(F2)} N</b> (surface ${k} fois plus grande → force ${k} fois plus grande).</p>`,
    };
  },
  // 5 — balance : quel côté descend ?
  (lvl, r) => {
    const m = () => r.int(1, 6) * (lvl === 3 ? 5 : 10);
    const L = [[m(), r.int(1, 4)]];
    const R = [[m(), r.int(1, 4)]];
    if (lvl >= 2) {
      L.push([m(), r.int(1, 4)]);
      if (r.bool()) R.push([m(), r.int(1, 4)]);
    }
    const ml = L.reduce((a, [w, d]) => a + w * d, 0);
    const mr = R.reduce((a, [w, d]) => a + w * d, 0);
    if (Math.abs(ml - mr) < 1e-9 && r.bool(0.6)) return templates[5](lvl, r);
    const ans = ml > mr ? 0 : ml < mr ? 1 : 2;
    const txt = (arr) => arr.map(([w, d]) => `${w} kg à ${d} m`).join(' et ');
    const mtx = (arr) => arr.map(([w, d]) => `${w}×${d}`).join(' + ');
    return {
      kind: 'mcq',
      prompt: `Une barre est posée sur un pivot central. À gauche : ${txt(L)}. À droite : ${txt(R)}. Que se passe-t-il ?`,
      choices: ['Le côté gauche descend', 'Le côté droit descend', 'La barre reste en équilibre'],
      answer: ans,
      explain: `<p>On compare les moments (masse × distance au pivot) :</p><p>Gauche : ${mtx(L)} = <b>${ml}</b> · Droite : ${mtx(R)} = <b>${mr}</b>.</p><p>${ans === 2 ? 'Moments égaux → équilibre.' : `Le côté ${ans === 0 ? 'gauche' : 'droit'} a le plus grand moment : il descend.`}</p>`,
    };
  },
];

register({
  id: 'psy.mecanique',
  module: M,
  group: 'Compréhension mécanique',
  title: 'Compréhension mécanique',
  desc: 'Engrenages, leviers, poulies, presse hydraulique, balances.',
  make(level, r) {
    const pool = level === 1 ? [0, 1, 2, 3, 5] : [0, 1, 2, 3, 4, 5];
    const q = templates[r.pick(pool)](level, r);
    q.timeLimit = 60;
    return q;
  },
});
