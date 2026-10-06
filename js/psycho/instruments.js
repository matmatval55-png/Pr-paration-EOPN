// Lecture d'instruments : conservateur de cap, altimètre, anémomètre, horizon artificiel.
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';
import { n } from '../core/fmt.js';

const M = 'psycho';
const rad = (d) => ((d - 90) * Math.PI) / 180; // 0° = en haut, sens horaire
const P = (cx, cy, r, d) => [cx + r * Math.cos(rad(d)), cy + r * Math.sin(rad(d))];
const cap3 = (h) => String(((Math.round(h) % 360) + 360) % 360 || 360).padStart(3, '0');
const norm360 = (h) => ((h % 360) + 360) % 360;

export function headingSVG(h) {
  let ticks = '';
  for (let d = 0; d < 360; d += 5) {
    const long = d % 10 === 0;
    const [x1, y1] = P(100, 100, 88, d);
    const [x2, y2] = P(100, 100, long ? 76 : 82, d);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${long ? 2 : 1}"/>`;
  }
  let labels = '';
  for (let d = 0; d < 360; d += 30) {
    const lab = { 0: 'N', 90: 'E', 180: 'S', 270: 'W' }[d] ?? String(d / 10);
    const [x, y] = P(100, 100, 63, d);
    labels += `<text x="${x}" y="${y + 6}" text-anchor="middle" font-size="${lab.length === 1 && isNaN(lab) ? 18 : 15}" font-weight="700" fill="${isNaN(lab) ? 'var(--accent)' : 'currentColor'}" transform="rotate(${d} ${x} ${y})">${lab}</text>`;
  }
  return `<svg viewBox="0 0 200 200" class="instr" aria-label="conservateur de cap">
    <circle cx="100" cy="100" r="97" fill="var(--instr-bg)" stroke="currentColor" stroke-width="3"/>
    <g transform="rotate(${-h} 100 100)">${ticks}${labels}</g>
    <polygon points="100,4 93,18 107,18" fill="var(--warn)"/>
    <path d="M100 82 L100 122 M80 100 L120 100 M90 117 L110 117" stroke="var(--warn)" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

export function altimeterSVG(alt) {
  let dial = '';
  for (let i = 0; i < 50; i++) {
    const d = i * 7.2;
    const long = i % 5 === 0;
    const [x1, y1] = P(100, 100, 90, d);
    const [x2, y2] = P(100, 100, long ? 76 : 84, d);
    dial += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${long ? 3 : 1.2}"/>`;
  }
  for (let i = 0; i < 10; i++) {
    const [x, y] = P(100, 100, 64, i * 36);
    dial += `<text x="${x}" y="${y + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">${i}</text>`;
  }
  const big = ((alt % 1000) / 1000) * 360;
  const small = ((alt % 10000) / 10000) * 360;
  const needle = (deg, len, w, col) => {
    const [x, y] = P(100, 100, len, deg);
    return `<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  };
  return `<svg viewBox="0 0 200 200" class="instr" aria-label="altimètre">
    <circle cx="100" cy="100" r="97" fill="var(--instr-bg)" stroke="currentColor" stroke-width="3"/>
    ${dial}
    <text x="100" y="128" text-anchor="middle" font-size="11" fill="currentColor">ALT · ft</text>
    ${needle(small, 44, 9, 'var(--warn)')}
    ${needle(big, 80, 4, 'currentColor')}
    <circle cx="100" cy="100" r="6" fill="currentColor"/>
  </svg>`;
}

const ASI_A = (v) => -135 + (v / 200) * 270;
export function asiSVG(v) {
  const arc = (a, b, r, col, w) => {
    const [x1, y1] = P(100, 100, r, ASI_A(a));
    const [x2, y2] = P(100, 100, r, ASI_A(b));
    const large = ASI_A(b) - ASI_A(a) > 180 ? 1 : 0;
    return `<path d="M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}" stroke="${col}" stroke-width="${w}" fill="none"/>`;
  };
  let dial = '';
  for (let s = 0; s <= 200; s += 10) {
    const long = s % 20 === 0;
    const [x1, y1] = P(100, 100, 90, ASI_A(s));
    const [x2, y2] = P(100, 100, long ? 78 : 84, ASI_A(s));
    dial += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${long ? 2.5 : 1.2}"/>`;
    if (long && s >= 40) {
      const [x, y] = P(100, 100, 64, ASI_A(s));
      dial += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">${s}</text>`;
    }
  }
  const [nx, ny] = P(100, 100, 82, ASI_A(v));
  return `<svg viewBox="0 0 200 200" class="instr" aria-label="anémomètre">
    <circle cx="100" cy="100" r="97" fill="var(--instr-bg)" stroke="currentColor" stroke-width="3"/>
    ${arc(45, 100, 94, '#e8e8e8', 4)}${arc(55, 140, 90, '#2ecc71', 6)}${arc(140, 170, 90, '#f1c40f', 6)}${arc(169, 171, 90, '#e74c3c', 8)}
    ${dial}
    <text x="100" y="135" text-anchor="middle" font-size="11" fill="currentColor">kt</text>
    <line x1="100" y1="100" x2="${nx}" y2="${ny}" stroke="var(--warn)" stroke-width="4" stroke-linecap="round"/>
    <circle cx="100" cy="100" r="6" fill="currentColor"/>
  </svg>`;
}

export function horizonSVG(pitch, bank, id = 'h') {
  let bankTicks = '';
  for (const b of [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60]) {
    const [x1, y1] = P(100, 100, 90, b);
    const [x2, y2] = P(100, 100, b % 30 === 0 ? 78 : 84, b);
    bankTicks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="2"/>`;
  }
  let ladder = '';
  for (const p of [-20, -10, 10, 20]) {
    const y = 100 - p * 3;
    ladder += `<line x1="${p % 20 ? 85 : 75}" y1="${y}" x2="${p % 20 ? 115 : 125}" y2="${y}" stroke="#fff" stroke-width="1.5"/>`;
  }
  return `<svg viewBox="0 0 200 200" class="instr" aria-label="horizon artificiel">
    <defs><clipPath id="clip-${id}"><circle cx="100" cy="100" r="92"/></clipPath></defs>
    <g clip-path="url(#clip-${id})">
      <g transform="rotate(${-bank} 100 100) translate(0 ${pitch * 3})">
        <rect x="-200" y="-300" width="600" height="400" fill="#3a8fd9"/>
        <rect x="-200" y="100" width="600" height="400" fill="#8b5a2b"/>
        <line x1="-200" y1="100" x2="400" y2="100" stroke="#fff" stroke-width="2.5"/>
        ${ladder}
      </g>
      <g transform="rotate(${-bank} 100 100)">${bankTicks}<polygon points="100,12 94,24 106,24" fill="#fff"/></g>
    </g>
    <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="5"/>
    <polygon points="100,10 95,2 105,2" fill="var(--warn)"/>
    <path d="M52 100 L82 100 L90 110 L100 100 L110 110 L118 100 L148 100" stroke="var(--warn)" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="100" cy="100" r="3" fill="var(--warn)"/>
  </svg>`;
}

/* ---------- Lecture rapide ---------- */
register({
  id: 'psy.instruments',
  module: M,
  group: 'Instruments',
  title: 'Lecture d’instruments',
  desc: 'Lire vite un cap, une altitude, une vitesse.',
  make(level, r) {
    const type = r.pick(['cap', 'alt', 'asi']);
    if (type === 'cap') {
      const step = { 1: 30, 2: 10, 3: 5 }[level];
      const h = r.int(0, 360 / step - 1) * step;
      const { choices, answer } = buildChoices(r, cap3(h), [cap3(h + 180), cap3(360 - h), cap3(h + 10), cap3(h - 10), cap3(h + 20)], 4);
      return {
        kind: 'mcq',
        layout: 'row',
        prompt: 'Quel est le cap indiqué ?',
        visual: headingSVG(h),
        choices,
        answer,
        explain: `<p>On lit la graduation sous le repère (triangle) en haut : <b>${cap3(h)}°</b>.</p><p>Sur la rose : N = 360, E = 090, S = 180, W = 270 ; « 3 » = 030, « 12 » = 120, « 33 » = 330 (on ajoute un zéro). Chaque petit trait = 5°.</p><p class="tip">Piège classique : lire le cap opposé (en bas du cadran), ici ${cap3(h + 180)}.</p>`,
        timeLimit: 15,
      };
    }
    if (type === 'alt') {
      const step = { 1: 500, 2: 100, 3: 50 }[level];
      const max = level === 1 ? 5000 : 9900;
      const a = r.int(1, max / step) * step;
      const { choices, answer } = buildChoices(r, a, r.shuffle([a + 1000, a - 1000, a + 100, a - 100, (a % 1000) * 10 + Math.floor(a / 1000) * 100, a + 500].filter((x) => x > 0)), 4);
      const th = Math.floor(a / 1000), hu = a % 1000;
      return {
        kind: 'mcq',
        layout: 'row',
        prompt: 'Quelle altitude indique l’altimètre ?',
        visual: altimeterSVG(a),
        choices: choices.map((c) => n(c) + ' ft'),
        answer,
        explain: `<p>Petite aiguille (orange, épaisse) = <b>milliers</b> de pieds : entre ${th} et ${th + 1} → ${n(th * 1000)} ft.</p><p>Grande aiguille = <b>centaines</b> : sur ${n(hu / 100)} → ${n(hu)} ft.</p><p>Total : <b>${n(a)} ft</b>.</p><p class="tip">Commence toujours par la petite aiguille (ordre de grandeur), puis précise avec la grande.</p>`,
        timeLimit: 20,
      };
    }
    const step = { 1: 20, 2: 10, 3: 5 }[level];
    const v = r.int(40 / step, 190 / step) * step;
    const { choices, answer } = buildChoices(r, v, r.shuffle([v + 10, v - 10, v + 20, v + 5, v - 5]), 4);
    const zone = v >= 170 ? 'au-delà du trait rouge (VNE) : vitesse à ne jamais dépasser !' : v >= 140 ? 'dans l’arc jaune : vitesse autorisée seulement en air calme.' : v >= 55 ? 'dans l’arc vert : plage normale d’utilisation.' : 'en dessous de l’arc vert : proche du décrochage (lisse).';
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: 'Quelle vitesse indique l’anémomètre ?',
      visual: asiSVG(v),
      choices: choices.map((c) => c + ' kt'),
      answer,
      explain: `<p>Graduations : un chiffre tous les 20 kt, un trait tous les 10 kt. L’aiguille indique <b>${v} kt</b>.</p><p>L’aiguille est ${zone}</p><p class="small muted">(Arcs donnés à titre d’exemple, chaque avion a les siens.)</p>`,
      timeLimit: 15,
    };
  },
});

/* ---------- Horizon artificiel ---------- */
const PITCH = ['en montée', 'en palier', 'en descente'];
const BANK = ['virage à gauche', 'ailes à plat', 'virage à droite'];

register({
  id: 'psy.horizon',
  module: M,
  group: 'Instruments',
  title: 'Horizon artificiel',
  desc: 'Déterminer l’assiette et l’inclinaison (et le cap au niveau 3).',
  make(level, r) {
    let pi = r.int(0, 2), bi = r.int(0, 2);
    if (level === 1) {
      if (r.bool()) bi = 1;
      else pi = 1;
    }
    const pitch = pi === 0 ? r.int(5, 15) : pi === 2 ? -r.int(5, 15) : 0;
    const bank = bi === 0 ? -r.int(15, 45) : bi === 2 ? r.int(15, 45) : 0;
    const withCap = level === 3;
    const h = r.int(0, 11) * 30;
    const desc = (p, b, c) => `Avion ${PITCH[p]}, ${BANK[b]}${withCap ? `, cap ${cap3(c)}` : ''}`;
    const cands = [];
    for (let p = 0; p < 3; p++) for (let b = 0; b < 3; b++) for (const c of withCap ? [h, h + 180, h + 90] : [h]) cands.push([p, b, c]);
    const correct = [pi, bi, h];
    const mirror = [pi, 2 - bi, h];
    const inv = [2 - pi, bi, h];
    const pool = r.shuffle(cands.filter((c) => c.join() !== correct.join()));
    const { choices, answer } = buildChoices(r, correct, [mirror, inv, ...(withCap ? [[pi, bi, h + 180]] : []), ...pool], 4, (c) => `${c[0]}${c[1]}${norm360(c[2])}`);
    return {
      kind: 'mcq',
      prompt: `Que montre${withCap ? 'nt ces instruments' : ' l’horizon artificiel'} ?`,
      visual: `<div class="instr-row">${horizonSVG(pitch, bank, 'q')}${withCap ? headingSVG(h) : ''}</div>`,
      choices: choices.map((c) => desc(...c)),
      answer,
      explain: `<p>La maquette orange (l’avion) est <b>fixe</b> ; c’est l’horizon (bleu = ciel, marron = sol) qui bouge.</p><ul>
        <li><b>Assiette</b> : ${pi === 0 ? `la maquette est au-dessus de la ligne d’horizon (plus de ciel) → nez haut, <b>montée</b> (+${pitch}°)` : pi === 2 ? `la maquette est sous la ligne d’horizon (plus de sol) → nez bas, <b>descente</b> (${pitch}°)` : 'la maquette est sur la ligne d’horizon → <b>palier</b>'}.</li>
        <li><b>Inclinaison</b> : ${bi === 1 ? 'les ailes de la maquette sont parallèles à l’horizon → <b>ailes à plat</b>' : `l’aile ${bi === 2 ? 'droite' : 'gauche'} de la maquette est plus basse que l’horizon → <b>${BANK[bi]}</b> (${Math.abs(bank)}°)`}.</li>
        ${withCap ? `<li><b>Cap</b> : lu sous le repère du conservateur de cap : <b>${cap3(h)}</b>.</li>` : ''}
      </ul><p class="tip">Piège n° 1 : l’horizon penche dans le sens <b>opposé</b> au virage. Raisonne toujours sur la maquette : « quelle aile est basse ? ».</p>`,
      timeLimit: withCap ? 25 : 15,
    };
  },
});

/* ---------- Calcul de caps ---------- */
register({
  id: 'psy.caps',
  module: M,
  group: 'Instruments',
  title: 'Calculs de cap',
  desc: 'Virages, cap inverse, orientation mentale.',
  make(level, r) {
    const h = r.int(0, 71) * 5;
    const variant = level === 1 ? r.pick(['turn', 'inverse']) : r.pick(['turn', 'turn', 'inverse', 'double']);
    let res, prompt, ex;
    if (variant === 'inverse') {
      res = norm360(h + 180);
      prompt = `Tu voles au cap <b>${cap3(h)}</b>. Quel est le cap pour faire demi-tour (cap inverse) ?`;
      ex = `Cap inverse = cap ± 180°. ${cap3(h)} ${h >= 180 ? '− 180' : '+ 180'} = <b>${cap3(res)}</b>.<br>Astuce rapide : ajoute 200 puis retire 20 (ex. 070 → 270 − 20 = 250).`;
    } else if (variant === 'turn') {
      const t = r.int(level === 1 ? 2 : 1, level === 3 ? 34 : 18) * (level === 1 ? 15 : 5);
      const right = r.bool();
      res = norm360(h + (right ? t : -t));
      prompt = `Tu voles au cap <b>${cap3(h)}</b>. Tu effectues un virage de <b>${t}°</b> par la <b>${right ? 'droite' : 'gauche'}</b>. Nouveau cap ?`;
      ex = `Virage à droite = on <b>ajoute</b> ; à gauche = on <b>retire</b>. ${cap3(h)} ${right ? '+' : '−'} ${t} = ${h + (right ? t : -t)}${res !== h + (right ? t : -t) ? ` → on ${h + (right ? t : -t) >= 360 ? 'retire' : 'ajoute'} 360 : <b>${cap3(res)}</b>` : ` = <b>${cap3(res)}</b>`}.`;
    } else {
      const t1 = r.int(2, 18) * 5, t2 = r.int(2, 18) * 5;
      const r1 = r.bool(), r2 = r.bool();
      res = norm360(h + (r1 ? t1 : -t1) + (r2 ? t2 : -t2));
      prompt = `Cap <b>${cap3(h)}</b>. Virage de ${t1}° à ${r1 ? 'droite' : 'gauche'}, puis de ${t2}° à ${r2 ? 'droite' : 'gauche'}. Cap final ?`;
      ex = `Bilan des virages : ${r1 ? '+' : '−'}${t1} ${r2 ? '+' : '−'} ${t2} = ${(r1 ? t1 : -t1) + (r2 ? t2 : -t2)}°. ${cap3(h)} + (${(r1 ? t1 : -t1) + (r2 ? t2 : -t2)}) → <b>${cap3(res)}</b> (en restant entre 001 et 360).`;
    }
    const { choices, answer } = buildChoices(r, cap3(res), r.shuffle([cap3(res + 180), cap3(2 * h - res), cap3(res + 10), cap3(res - 10), cap3(res + 20)]), 4);
    return {
      kind: 'mcq',
      layout: 'row',
      prompt,
      visual: level === 1 ? headingSVG(h) : '',
      choices,
      answer,
      explain: `<p>${ex}</p><p class="tip">Un cap s’écrit sur 3 chiffres, de 001 à 360 (le nord = 360).</p>`,
      timeLimit: level === 1 ? 25 : 20,
    };
  },
});
