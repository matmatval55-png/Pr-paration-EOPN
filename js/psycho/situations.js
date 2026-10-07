// Conscience de la situation : scénarios animés (SVG + animations SMIL) avec questions,
// dans l'esprit des entraîneurs IFR. Les dessins sont exportés pour les fiches animées.
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';
import { headingSVG } from './instruments.js';

const M = 'psycho', G = 'Conscience de la situation';
const n360 = (h) => ((h % 360) + 360) % 360;
const cap3 = (h) => String(n360(Math.round(h)) || 360).padStart(3, '0');
const rad = (d) => ((d - 90) * Math.PI) / 180;
const P = (cx, cy, r, d) => [cx + r * Math.cos(rad(d)), cy + r * Math.sin(rad(d))];
const DIRS = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
const dirName = (deg) => DIRS[Math.round(n360(deg) / 45) % 8];
const PLANE = (fill = 'var(--warn)') => `<path d="M0,-14 L3,-4 L13,2 L13,5 L3,2 L2,9 L6,12 L6,14 L0,12 L-6,14 L-6,12 L-2,9 L-3,2 L-13,5 L-13,2 L-3,-4 Z" fill="${fill}" stroke="#000" stroke-width="0.6"/>`;

/* ---------- 1. RMI / radiales VOR ---------- */
export function rmiSVG(heading, bearingTo) {
  // carte tournante (cap) + aiguille vers la station (relèvement magnétique absolu)
  const needle = `<g transform="rotate(${bearingTo - heading} 100 100)">
      <line x1="100" y1="165" x2="100" y2="40" stroke="var(--ok)" stroke-width="5" stroke-linecap="round"/>
      <polygon points="100,26 91,46 109,46" fill="var(--ok)"/>
      <line x1="94" y1="170" x2="106" y2="170" stroke="var(--ok)" stroke-width="5"/>
      <animateTransform attributeName="transform" type="rotate" from="${bearingTo - heading - 40} 100 100" to="${bearingTo - heading} 100 100" dur="1.6s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/>
    </g>`;
  return headingSVG(heading).replace('</svg>', `${needle}<circle cx="100" cy="100" r="5" fill="var(--ok)"/></svg>`);
}

export function radialMap(radial, heading) {
  const [x, y] = P(110, 110, 70, radial);
  return `<svg viewBox="0 0 220 220" class="instr" aria-label="position par rapport à la balise">
    <circle cx="110" cy="110" r="100" fill="var(--instr-bg)" stroke="var(--line)"/>
    ${[0, 90, 180, 270].map((d) => { const [a, b] = P(110, 110, 92, d); return `<text x="${a}" y="${b + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--accent)">${{ 0: 'N', 90: 'E', 180: 'S', 270: 'O' }[d]}</text>`; }).join('')}
    <line x1="110" y1="110" x2="${x}" y2="${y}" stroke="var(--ok)" stroke-width="2" stroke-dasharray="5 4"/>
    <polygon points="110,98 120,116 100,116" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="110" cy="110" r="3" fill="currentColor"/>
    <text x="${x}" y="${y - 18}" text-anchor="middle" font-size="11" fill="currentColor">R${cap3(radial)}</text>
    <g transform="translate(${x} ${y}) rotate(${heading}) scale(0.9)">${PLANE()}</g>
  </svg>`;
}

register({
  id: 'psy.vor',
  module: M,
  group: G,
  title: 'Radiales VOR (RMI)',
  desc: 'Où es-tu par rapport à la balise ? Lire un RMI comme un pilote IFR.',
  make(level, r) {
    const step = level === 1 ? 45 : level === 2 ? 30 : 10;
    const radial = r.int(0, 360 / step - 1) * step;
    const bearingTo = n360(radial + 180); // QDM
    const heading = level === 1 ? 0 : r.int(0, 35) * 10;
    const ask = level === 1 ? 'pos' : r.pick(['radial', 'radial', 'pos', 'qdm']);
    const ex = `<p>L’aiguille du RMI pointe <b>vers la balise</b> : sa tête indique le relèvement à suivre pour y aller (QDM = ${cap3(bearingTo)}). La <b>queue</b> de l’aiguille indique la <b>radiale</b> sur laquelle tu te trouves (QDR = QDM ± 180 = <b>${cap3(radial)}</b>).</p><p>Radiale ${cap3(radial)} = tu es au <b>${dirName(radial)}</b> de la balise.</p>${radialMap(radial, heading)}<p class="tip">Ton cap ne change pas ta position : un avion peut être sur la radiale 090 avec n’importe quel cap. Regarde toujours l’aiguille, pas l’avion.</p>`;
    let prompt, correct, distract;
    if (ask === 'pos') {
      prompt = 'Où te trouves-tu par rapport à la balise ?';
      correct = `Au ${dirName(radial)}`;
      distract = [`Au ${dirName(radial + 180)}`, `Au ${dirName(radial + 90)}`, `Au ${dirName(radial - 90)}`, `Au ${dirName(radial + 45)}`];
    } else if (ask === 'radial') {
      prompt = 'Sur quelle radiale te trouves-tu ?';
      correct = `Radiale ${cap3(radial)}`;
      distract = [`Radiale ${cap3(bearingTo)}`, `Radiale ${cap3(radial + 90)}`, `Radiale ${cap3(radial - 90)}`, `Radiale ${cap3(heading)}`];
    } else {
      prompt = 'Quel cap faut-il prendre pour rejoindre la balise (sans vent) ?';
      correct = `Cap ${cap3(bearingTo)}`;
      distract = [`Cap ${cap3(radial)}`, `Cap ${cap3(bearingTo + 90)}`, `Cap ${cap3(heading)}`, `Cap ${cap3(bearingTo - 90)}`];
    }
    const { choices, answer } = buildChoices(r, correct, r.shuffle(distract), 4);
    return { kind: 'mcq', layout: 'row', prompt, visual: rmiSVG(heading, bearingTo), choices, answer, explain: ex, timeLimit: level === 1 ? 20 : 15 };
  },
});

/* ---------- 2. Vent, manche à air et choix de piste ---------- */
export function windSVG(rw, windFrom, speed) {
  const rhd = Number(rw) * 10; // orientation de la piste (sens d'utilisation)
  const len = 150;
  const sock = `<g transform="translate(270 60) rotate(${windFrom + 180})">
      <line x1="0" y1="18" x2="0" y2="-2" stroke="currentColor" stroke-width="2"/>
      <g><path d="M-6,-2 L6,-2 L4,-42 L-4,-42 Z" fill="#ff7a00" stroke="#000" stroke-width="0.6">
        <animateTransform attributeName="transform" type="skewX" values="-6;6;-6" dur="${speed > 15 ? 0.6 : 1.2}s" repeatCount="indefinite"/></path>
        <path d="M-5,-12 L5,-12 L4.6,-20 L-4.6,-20 Z" fill="#fff"/><path d="M-4.4,-28 L4.4,-28 L4.1,-35 L-4.1,-35 Z" fill="#fff"/></g>
    </g>`;
  const arrow = `<g transform="translate(160 160) rotate(${windFrom})">
      ${[-40, 0, 40].map((dx) => `<line x1="${dx}" y1="-150" x2="${dx}" y2="-115" stroke="var(--accent)" stroke-width="3" marker-end="url(#wa)"><animateTransform attributeName="transform" type="translate" values="0 0; 0 230" dur="${Math.max(1.2, 4 - speed / 10)}s" repeatCount="indefinite"/></line>`).join('')}
    </g>`;
  const [a, b] = [rhd, rhd + 180];
  const end = (deg, num) => { const [x, y] = P(160, 160, len / 2 + 14, deg + 180); return `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="currentColor">${num}</text>`; };
  return `<svg viewBox="0 0 320 320" class="mech" style="max-width:320px" aria-label="piste et vent">
    <defs><marker id="wa" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker><clipPath id="wclip"><rect width="320" height="320"/></clipPath></defs>
    <rect width="320" height="320" fill="var(--instr-bg)" rx="14"/>
    <g clip-path="url(#wclip)">${arrow}</g>
    <g transform="rotate(${a} 160 160)"><rect x="148" y="${160 - len / 2}" width="24" height="${len}" fill="#555" stroke="currentColor"/><line x1="160" y1="${160 - len / 2 + 6}" x2="160" y2="${160 + len / 2 - 6}" stroke="#fff" stroke-width="2" stroke-dasharray="8 7"/></g>
    ${end(a, String(rw).padStart(2, '0'))}${end(b, String(((Number(rw) + 18 - 1) % 36) + 1).padStart(2, '0'))}
    ${sock}
    <text x="12" y="22" font-size="13" font-weight="700" fill="currentColor">N ↑</text>
    <text x="12" y="306" font-size="12" fill="currentColor">Vent ${cap3(windFrom)}° / ${speed} kt</text>
  </svg>`;
}

register({
  id: 'psy.vent',
  module: M,
  group: G,
  title: 'Vent, piste et dérive',
  desc: 'Choisir la piste face au vent, repérer le vent de travers et la dérive.',
  make(level, r) {
    const rw = r.int(1, 18); // numéro du QFU « a »
    const other = ((rw + 18 - 1) % 36) + 1;
    const rwDeg = rw * 10;
    const off = level === 1 ? r.pick([-30, -20, 0, 20, 30]) : r.pick([-70, -50, -40, 40, 50, 70]);
    const into = r.bool();
    const windFrom = n360((into ? rwDeg : rwDeg + 180) + off);
    const speed = r.int(6, 25);
    const best = into ? rw : other;
    const bestDeg = best * 10;
    const rel = ((windFrom - bestDeg + 540) % 360) - 180; // >0 : vent de la droite
    const pad = (x) => String(x).padStart(2, '0');
    const variant = level === 1 ? 'piste' : r.pick(['piste', 'travers', 'derive']);
    if (variant === 'piste' || variant === 'travers') {
      const q = variant === 'piste' ? 'Le vent est indiqué par la manche à air. Quelle piste faut-il utiliser ?' : `Tu décolles en piste ${pad(best)}. D’où vient le vent de travers ?`;
      const correct = variant === 'piste' ? `Piste ${pad(best)}` : rel > 0 ? 'De la droite' : 'De la gauche';
      const distract = variant === 'piste' ? [`Piste ${pad(best === rw ? other : rw)}`, `Piste ${pad(((best + 9 - 1) % 36) + 1)}`] : [rel > 0 ? 'De la gauche' : 'De la droite', 'Aucun vent de travers'];
      const { choices, answer } = buildChoices(r, correct, distract, 3);
      return {
        kind: 'mcq',
        prompt: q,
        visual: windSVG(rw, windFrom, speed),
        choices,
        answer,
        explain: `<p>La manche à air (et les flèches) montrent que le vent <b>vient du ${cap3(windFrom)}°</b>. On décolle et on atterrit <b>face au vent</b> : la piste dont l’orientation est la plus proche de la direction du vent est la <b>${pad(best)}</b> (orientée ${cap3(bestDeg)}°).</p><p>Écart entre le vent et l’axe de la piste ${pad(best)} : ${Math.abs(rel)}° ${rel > 0 ? 'à droite' : rel < 0 ? 'à gauche' : ''} → le vent de travers vient <b>${rel > 0 ? 'de la droite' : rel < 0 ? 'de la gauche' : 'd’aucun côté'}</b>.</p><p class="tip">La pointe de la manche à air montre où <b>va</b> le vent ; le vent vient de l’entrée (côté mât). Une manche bien gonflée = vent fort.</p>`,
        timeLimit: 25,
      };
    }
    // dérive : route nord, vent de travers
    const crossFrom = r.pick([270, 90, 240, 300, 60, 120]);
    const fromLeft = n360(crossFrom) > 180;
    const corr = r.pick([5, 8, 10]);
    const anim = `<svg viewBox="0 0 300 300" class="mech" style="max-width:300px">
      <rect width="300" height="300" fill="var(--instr-bg)" rx="14"/>
      <line x1="150" y1="290" x2="150" y2="10" stroke="var(--ok)" stroke-width="3" stroke-dasharray="10 6"/><text x="156" y="22" font-size="12" fill="var(--ok)">route voulue 360</text>
      <g><g transform="rotate(0)">${PLANE()}</g>
        <animateMotion dur="5s" repeatCount="indefinite" path="M150,270 L${fromLeft ? 230 : 70},40"/></g>
      <g transform="translate(${fromLeft ? 30 : 270} 150) rotate(${fromLeft ? 90 : -90})">${[0, 25, 50].map((y) => `<line x1="${y - 25}" y1="-20" x2="${y - 25}" y2="10" stroke="var(--accent)" stroke-width="3" marker-end="url(#da)"/>`).join('')}</g>
      <defs><marker id="da" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
      <text x="${fromLeft ? 8 : 292}" y="196" font-size="12" text-anchor="${fromLeft ? 'start' : 'end'}" fill="var(--accent)">vent</text>
    </svg>`;
    const correct = `Cap ${cap3(fromLeft ? 360 - corr : corr)} (corriger vers ${fromLeft ? 'la gauche' : 'la droite'}, face au vent)`;
    const { choices, answer } = buildChoices(r, correct, [`Cap ${cap3(fromLeft ? corr : 360 - corr)} (corriger vers ${fromLeft ? 'la droite' : 'la gauche'})`, 'Cap 360 (aucune correction)', `Cap ${cap3(fromLeft ? 270 : 90)}`], 4);
    return {
      kind: 'mcq',
      prompt: `Avec un cap 360, ton avion dérive comme sur l’animation (vent de travers ${fromLeft ? 'de l’ouest' : 'de l’est'}). Quel cap prendre pour suivre la route 360 ?`,
      visual: anim,
      choices,
      answer,
      explain: `<p>Le vent ${fromLeft ? 'd’ouest pousse l’avion vers l’est (à droite)' : 'd’est pousse l’avion vers l’ouest (à gauche)'} : c’est la <b>dérive</b>.</p><p>Pour la compenser, on oriente le nez <b>du côté d’où vient le vent</b> (on « crabe ») : cap ${cap3(fromLeft ? 360 - corr : corr)}. La route au sol redevient 360.</p><p class="tip">Règle : « on corrige face au vent ». Cap ≠ route quand il y a du vent.</p>`,
      timeLimit: 30,
    };
  },
});

/* ---------- 3. Tour de piste ---------- */
const BRANCHES = [
  { id: 'montee', nom: 'Montée initiale (après décollage)', path: 'M60,200 L230,200', pts: [[90, 200], [190, 200]], rot: 90 },
  { id: 'travers', nom: 'Vent traversier', path: 'M250,180 L250,90', pts: [[250, 160], [250, 110]], rot: 0 },
  { id: 'arriere', nom: 'Vent arrière', path: 'M230,70 L60,70', pts: [[200, 70], [100, 70]], rot: 270 },
  { id: 'base', nom: 'Étape de base', path: 'M40,90 L40,180', pts: [[40, 110], [40, 160]], rot: 180 },
  { id: 'finale', nom: 'Finale', path: 'M20,200 L60,200', pts: [[10, 200], [50, 200]], rot: 90 },
];

export function circuitSVG(branchId, animateAll = false) {
  const b = BRANCHES.find((x) => x.id === branchId) || BRANCHES[0];
  const loop = 'M20,200 L230,200 Q250,200 250,180 L250,90 Q250,70 230,70 L60,70 Q40,70 40,90 L40,180 Q40,200 20,200';
  const plane = animateAll
    ? `<g><g transform="rotate(90)">${PLANE()}</g><animateMotion dur="12s" repeatCount="indefinite" rotate="auto" path="${loop}"/></g>`
    : `<g>${`<g transform="rotate(90)">${PLANE()}</g>`}<animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto" path="M${b.pts[0].join(',')} L${b.pts[1].join(',')}"/></g>`;
  return `<svg viewBox="0 0 280 240" class="mech" style="max-width:340px" aria-label="tour de piste">
    <rect width="280" height="240" fill="var(--instr-bg)" rx="14"/>
    <rect x="60" y="192" width="150" height="16" fill="#555" stroke="currentColor"/><line x1="66" y1="200" x2="204" y2="200" stroke="#fff" stroke-dasharray="8 6"/>
    <text x="64" y="225" font-size="11" fill="currentColor">Piste — décollage vers la droite →</text>
    <path d="${loop}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 5" opacity="0.6"/>
    ${animateAll ? BRANCHES.map((x) => `<text x="${{ montee: 150, travers: 258, arriere: 150, base: 32, finale: 22 }[x.id]}" y="${{ montee: 186, travers: 135, arriere: 60, base: 135, finale: 186 }[x.id]}" font-size="10" text-anchor="${x.id === 'base' ? 'end' : x.id === 'travers' ? 'start' : 'middle'}" fill="currentColor">${x.nom.split(' (')[0]}</text>`).join('') : ''}
    ${plane}
  </svg>`;
}

register({
  id: 'psy.circuit',
  module: M,
  group: G,
  title: 'Tour de piste',
  desc: 'Situer l’avion dans le circuit d’aérodrome (tour de piste main gauche).',
  make(level, r) {
    const b = r.pick(BRANCHES);
    const variant = level >= 2 && r.bool(0.5) ? 'next' : 'where';
    const idx = BRANCHES.indexOf(b);
    const next = BRANCHES[(idx + 1) % BRANCHES.length];
    const correct = variant === 'where' ? b.nom : next.nom;
    const { choices, answer } = buildChoices(r, correct, r.shuffle(BRANCHES.map((x) => x.nom)), 4);
    return {
      kind: 'mcq',
      prompt: variant === 'where' ? 'Dans quelle branche du tour de piste se trouve l’avion ?' : 'Quelle est la prochaine branche du tour de piste pour cet avion ?',
      visual: circuitSVG(b.id),
      choices,
      answer,
      explain: `<p>L’avion est en <b>${b.nom.toLowerCase()}</b>.</p>${circuitSVG(b.id, true)}<p>Ordre d’un tour de piste : montée initiale → <b>vent traversier</b> → <b>vent arrière</b> (parallèle à la piste, sens inverse de l’atterrissage) → <b>étape de base</b> → <b>finale</b> (alignement sur l’axe). Ici le circuit est « main gauche » : tous les virages se font à gauche, ce qui est le cas standard.</p>`,
      timeLimit: 15,
    };
  },
});

/* ---------- 4. PAPI ---------- */
const PAPI = [
  { w: 4, txt: 'Trop haut', ex: '4 blancs : bien au-dessus du plan de descente.' },
  { w: 3, txt: 'Légèrement trop haut', ex: '3 blancs, 1 rouge : un peu au-dessus du plan.' },
  { w: 2, txt: 'Sur le plan de descente', ex: '2 blancs, 2 rouges : sur le plan (souvent 3°).' },
  { w: 1, txt: 'Légèrement trop bas', ex: '1 blanc, 3 rouges : un peu sous le plan.' },
  { w: 0, txt: 'Trop bas', ex: '4 rouges : nettement trop bas, danger d’obstacles.' },
];

export function papiSVG(w) {
  const lights = [0, 1, 2, 3].map((i) => (i < w ? '#ffffff' : '#ff3b30'));
  return `<svg viewBox="0 0 300 200" class="mech" style="max-width:340px" aria-label="PAPI">
    <rect width="300" height="200" fill="#0a1a33" rx="14"/>
    <rect y="110" width="300" height="90" fill="#16301f" rx="0"/>
    <polygon points="120,200 180,200 160,112 140,112" fill="#444"/><line x1="150" y1="198" x2="150" y2="116" stroke="#fff" stroke-dasharray="8 6"/>
    ${lights.map((c, i) => `<circle cx="${70 + i * 14}" cy="140" r="5" fill="${c}"><animate attributeName="opacity" values="0.65;1;0.65" dur="1.6s" repeatCount="indefinite"/></circle>`).join('')}
    <text x="70" y="128" font-size="10" fill="#cfd8e3">PAPI</text>
    <animateTransform attributeName="transform" type="scale" values="1;1.03;1" dur="3s" repeatCount="indefinite" additive="sum"/>
  </svg>`;
}

register({
  id: 'psy.papi',
  module: M,
  group: G,
  title: 'PAPI en approche',
  desc: 'Lire les feux d’indication de pente : trop haut, sur le plan, trop bas ?',
  make(level, r) {
    const p = r.pick(PAPI);
    const { choices, answer } = buildChoices(r, p.txt, r.shuffle(PAPI.map((x) => x.txt)), level === 1 ? 3 : 5);
    return {
      kind: 'mcq',
      prompt: 'En finale, tu vois ces feux à gauche de la piste. Où es-tu par rapport au plan de descente ?',
      visual: papiSVG(p.w),
      choices,
      answer,
      explain: `<p>${p.ex}</p><p>Les 4 feux du <b>PAPI</b> sont réglés à des angles différents : plus tu es haut, plus tu vois de feux <b>blancs</b>. Repère : « blanc sur blanc, trop haut ; rouge sur rouge, tu es mort » (exagération mnémotechnique). <b>2 blancs + 2 rouges = parfait.</b></p>`,
      timeLimit: 10,
    };
  },
});

/* ---------- 5. Attitudes inusuelles ---------- */
export function horizonAnimSVG(pitch, bank, id = 'ua') {
  return `<svg viewBox="0 0 200 200" class="instr" aria-label="horizon artificiel animé">
    <defs><clipPath id="c-${id}"><circle cx="100" cy="100" r="92"/></clipPath></defs>
    <g clip-path="url(#c-${id})">
      <g><animateTransform attributeName="transform" type="rotate" values="0 100 100; ${-bank} 100 100" dur="2.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1"/>
        <g><animateTransform attributeName="transform" type="translate" values="0 0; 0 ${pitch * 3}" dur="2.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1"/>
          <rect x="-200" y="-300" width="600" height="400" fill="#3a8fd9"/><rect x="-200" y="100" width="600" height="400" fill="#8b5a2b"/>
          <line x1="-200" y1="100" x2="400" y2="100" stroke="#fff" stroke-width="2.5"/>
          ${[-30, -20, -10, 10, 20, 30].map((p) => `<line x1="${p % 20 ? 85 : 72}" y1="${100 - p * 3}" x2="${p % 20 ? 115 : 128}" y2="${100 - p * 3}" stroke="#fff" stroke-width="1.5"/>`).join('')}
        </g>
      </g>
    </g>
    <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M52 100 L82 100 L90 110 L100 100 L110 110 L118 100 L148 100" stroke="var(--warn)" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

const RECOVERY = {
  low: 'Réduire la puissance, remettre les ailes à plat, puis ramener doucement le nez sur l’horizon',
  high: 'Afficher la puissance, baisser le nez vers l’horizon, puis remettre les ailes à plat',
};

register({
  id: 'psy.attitudes',
  module: M,
  group: G,
  title: 'Attitudes inusuelles',
  desc: 'L’avion part en piqué ou en cabré : reconnaître la situation et la procédure de rattrapage.',
  make(level, r) {
    const nose = r.pick(['low', 'high']);
    const pitch = nose === 'low' ? -r.int(15, 28) : r.int(15, 28);
    const bank = r.pick([-1, 1]) * r.int(35, 70);
    const side = bank > 0 ? 'droite' : 'gauche';
    const sit = nose === 'low' ? `Piqué en virage à ${side} (spirale engageante)` : `Cabré en virage à ${side}`;
    const recog = level === 1;
    const correct = recog ? sit : RECOVERY[nose];
    const distract = recog
      ? [nose === 'low' ? `Cabré en virage à ${side}` : `Piqué en virage à ${side} (spirale engageante)`, `${nose === 'low' ? 'Piqué' : 'Cabré'} en virage à ${side === 'droite' ? 'gauche' : 'droite'}`, 'Palier, ailes à plat']
      : [RECOVERY[nose === 'low' ? 'high' : 'low'], 'Tirer franchement sur le manche immédiatement, sans toucher à la puissance', 'Remettre plein gaz et tirer sur le manche, en gardant l’inclinaison'];
    const { choices, answer } = buildChoices(r, correct, distract, 4);
    return {
      kind: 'mcq',
      prompt: recog ? 'Observe l’horizon artificiel. Quelle est la situation ?' : 'L’avion est parti dans cette attitude. Quelle est la bonne séquence de rattrapage ?',
      visual: horizonAnimSVG(pitch, bank),
      choices,
      answer,
      explain: `<p>Situation : <b>${sit}</b> (assiette ${pitch > 0 ? '+' : ''}${pitch}°, inclinaison ${Math.abs(bank)}° à ${side}).</p>
        <ul><li><b>Nez bas + inclinaison</b> (la vitesse augmente vite) : <b>${RECOVERY.low}</b>. Tirer avant de remettre à plat ne fait que resserrer la spirale et augmenter le facteur de charge.</li>
        <li><b>Nez haut</b> (la vitesse diminue, risque de décrochage) : <b>${RECOVERY.high}</b>.</li></ul>
        <p class="tip">Procédure générale enseignée en pilotage aux instruments ; l’ordre exact peut varier selon l’avion et le manuel de vol.</p>`,
      timeLimit: 20,
    };
  },
});

/* ---------- 6. Trafic et anticollision ---------- */
export function trafficSVG(clock, collision, crossesAhead, dur = 6) {
  // repère relatif : notre avion au centre, nez vers le haut ; le trafic se déplace en ligne droite
  const a = clock * 30;
  const [sx, sy] = P(150, 150, 130, a);
  let ex, ey;
  if (collision) [ex, ey] = [150 + (150 - sx) * 0.15, 150 + (150 - sy) * 0.15];
  else {
    const off = crossesAhead ? -55 : 55; // passe devant (au-dessus) ou derrière
    [ex, ey] = [150 - (sx - 150) * 0.9, 150 + off - (sy - 150) * 0.2];
  }
  return `<svg viewBox="0 0 300 300" class="mech" style="max-width:320px" aria-label="trafic">
    <rect width="300" height="300" fill="var(--instr-bg)" rx="14"/>
    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => { const [x, y] = P(150, 150, 140, h * 30); return `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" fill="var(--muted)">${h}</text>`; }).join('')}
    <circle cx="150" cy="150" r="100" fill="none" stroke="var(--line)" stroke-dasharray="4 5"/><circle cx="150" cy="150" r="50" fill="none" stroke="var(--line)" stroke-dasharray="4 5"/>
    <g transform="translate(150 150)">${PLANE('var(--accent)')}</g>
    <g><circle r="9" fill="var(--danger)" opacity="0.9"/><text y="-13" text-anchor="middle" font-size="11" fill="var(--danger)">trafic</text>
      <animateMotion dur="${dur}s" repeatCount="indefinite" path="M${sx.toFixed(1)},${sy.toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)}"/></g>
  </svg>`;
}

register({
  id: 'psy.trafic',
  module: M,
  group: G,
  title: 'Trafic et anticollision',
  desc: 'Annoncer un trafic « à X heures », détecter un risque de collision, appliquer les priorités.',
  make(level, r) {
    const clock = r.pick(level === 1 ? [1, 2, 3, 9, 10, 11, 12] : [1, 2, 3, 4, 8, 9, 10, 11]);
    const collision = level >= 2 && r.bool(0.5);
    const ahead = r.bool();
    const fromRight = clock >= 1 && clock <= 5;
    let prompt, correct, distract, ex;
    if (level === 1) {
      prompt = 'Comment annoncer la position de ce trafic ?';
      correct = `Trafic à ${clock} heures`;
      distract = [`Trafic à ${(clock + 6) % 12 || 12} heures`, `Trafic à ${(clock + 2) % 12 || 12} heures`, `Trafic à ${(clock + 10) % 12 || 12} heures`];
      ex = `<p>On repère un trafic comme sur un cadran d’horloge : <b>12 heures</b> = droit devant, <b>3 heures</b> = à droite, <b>6 heures</b> = derrière, <b>9 heures</b> = à gauche. Ici : <b>${clock} heures</b>.</p>`;
    } else if (level === 2) {
      prompt = 'Le trafic garde-t-il une trajectoire de collision avec toi ?';
      correct = collision ? 'Oui : sa position relative ne change pas et il se rapproche' : `Non : il va passer ${ahead ? 'devant' : 'derrière'} toi`;
      distract = [collision ? `Non : il va passer ${ahead ? 'devant' : 'derrière'} toi` : 'Oui : sa position relative ne change pas et il se rapproche', 'Impossible de savoir sans radar', `Non : il s’éloigne`];
      ex = `<p>Règle d’or de l’anticollision : un trafic dont la <b>position relative reste fixe</b> (même « heure » dans le pare-brise) tout en <b>grossissant</b> est en <b>trajectoire de collision</b>. S’il glisse vers l’avant ou l’arrière, il passera devant ou derrière.</p><p>Ici : ${collision ? 'il reste à la même position et se rapproche → <b>danger</b>.' : `il se déplace dans le pare-brise → il passera ${ahead ? 'devant' : 'derrière'}.`}</p>`;
    } else {
      prompt = `Ce trafic converge vers toi à la même altitude, depuis ${clock} heures. Que fais-tu ?`;
      correct = fromRight ? 'Il vient de la droite : il a la priorité, je m’écarte (en passant derrière lui)' : 'Il vient de la gauche : j’ai la priorité, mais je le surveille et je reste prêt à manœuvrer';
      distract = [fromRight ? 'Il vient de la droite : j’ai la priorité, je garde ma trajectoire' : 'Il vient de la gauche : il a la priorité, je m’écarte', 'Je monte immédiatement de 1 000 ft sans regarder', 'Je ne fais rien, le contrôle s’en occupe forcément'];
      ex = `<p>Règles de l’air : quand deux aéronefs convergent à peu près à la même altitude, celui qui a l’autre <b>à sa droite</b> doit céder le passage (priorité à droite). Celui qui est prioritaire garde son cap et sa vitesse <b>mais reste vigilant</b> et manœuvre si l’autre ne réagit pas. De face, chacun s’écarte vers sa droite.</p>`;
    }
    const { choices, answer } = buildChoices(r, correct, distract, 4);
    return { kind: 'mcq', prompt, visual: trafficSVG(clock, collision, ahead), choices, answer, explain: ex, timeLimit: level === 1 ? 12 : 25 };
  },
});
