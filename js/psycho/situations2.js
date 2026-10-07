// Situations de vol (suite) : visualisation spatiale, aiguilles de navigation (CDI/ILS), circuit d'attente,
// signaux lumineux, interception, situations d'urgence. Animations SVG (SMIL).
import { register } from '../core/registry.js';
import { registerBank } from '../core/bank.js';
import { buildChoices } from '../core/rng.js';
import { horizonSVG, headingSVG } from './instruments.js';

const M = 'psycho', G = 'Conscience de la situation';
const n360 = (h) => ((h % 360) + 360) % 360;
const cap3 = (h) => String(n360(Math.round(h)) || 360).padStart(3, '0');
const DIR8 = ['nord', 'nord-est', 'est', 'sud-est', 'sud', 'sud-ouest', 'ouest', 'nord-ouest'];
const PLANE = (fill = 'var(--warn)') => `<path d="M0,-14 L3,-4 L13,2 L13,5 L3,2 L2,9 L6,12 L6,14 L0,12 L-6,14 L-6,12 L-2,9 L-3,2 L-13,5 L-13,2 L-3,-4 Z" fill="${fill}" stroke="#000" stroke-width="0.6"/>`;

/* ---------- 1. Visualisation spatiale : instruments → image de l'avion ---------- */
// Image : vue de l'avion depuis l'arrière (inclinaison + assiette) et flèche de direction sur une rose.
export function avionVue({ bank, pitch, heading }, small = false) {
  const tilt = pitch > 0 ? 'nez haut' : pitch < 0 ? 'nez bas' : 'palier';
  const rear = `<g transform="translate(60 52) rotate(${bank})">
      <rect x="-50" y="-2" width="100" height="5" rx="2" fill="currentColor"/>
      <rect x="-3" y="-20" width="6" height="22" rx="2" fill="currentColor"/>
      <rect x="-14" y="-18" width="28" height="3" rx="1.5" fill="currentColor"/>
      <ellipse cx="0" cy="2" rx="9" ry="8" fill="var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="0" cy="2" r="3" fill="var(--accent)"/>
    </g>
    <line x1="2" y1="100" x2="118" y2="100" stroke="var(--ok)" stroke-width="2"/>
    <text x="60" y="114" text-anchor="middle" font-size="10" fill="currentColor">vu de derrière</text>
    <g transform="translate(108 18)"><path d="${pitch > 0 ? 'M0,8 L0,-8 M-5,-3 L0,-8 L5,-3' : pitch < 0 ? 'M0,-8 L0,8 M-5,3 L0,8 L5,3' : 'M-8,0 L8,0'}" stroke="var(--danger)" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>
    <text x="108" y="38" text-anchor="middle" font-size="8" fill="var(--danger)">${tilt}</text>`;
  const rose = heading == null ? '' : `<g transform="translate(160 60)">
      <circle r="44" fill="var(--instr-bg)" stroke="var(--line)"/>
      ${['N', 'E', 'S', 'O'].map((l, i) => `<text x="${Math.sin((i * Math.PI) / 2) * 36}" y="${-Math.cos((i * Math.PI) / 2) * 36 + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="var(--accent)">${l}</text>`).join('')}
      <g transform="rotate(${heading})"><line x1="0" y1="18" x2="0" y2="-22" stroke="currentColor" stroke-width="3"/><polygon points="0,-30 -7,-18 7,-18" fill="currentColor"/></g>
    </g>`;
  const w = heading == null ? 120 : 210;
  return `<svg viewBox="0 0 ${w} 120" width="${small ? w * 0.9 : w}" class="vue" aria-label="avion">${rear}${rose}</svg>`;
}

register({
  id: 'psy.orientation',
  module: M,
  group: G,
  title: 'Visualisation spatiale (instruments → avion)',
  desc: 'À partir de l’horizon artificiel et du cap, retrouver l’image de l’avion.',
  make(level, r) {
    const pitch = r.pick([-10, 0, 10]);
    const bank = r.pick([-30, 0, 30]);
    const heading = level === 1 ? null : r.int(0, 7) * 45;
    const truth = { bank, pitch, heading };
    const key = (c) => `${c.bank}|${c.pitch}|${c.heading}`;
    const cands = [
      { ...truth, bank: -bank || 30 },
      { ...truth, pitch: -pitch || 10 },
      { ...truth, bank: -bank || -30, pitch: -pitch || -10 },
    ];
    if (heading != null) cands.push({ ...truth, heading: n360(heading + 180) }, { ...truth, heading: n360(heading + 90) }, { ...truth, heading: n360(360 - heading) });
    const pool = r.shuffle(cands).filter((c) => key(c) !== key(truth));
    const { choices, answer } = buildChoices(r, truth, level === 3 ? pool.filter((c) => c.heading !== truth.heading).concat(pool) : pool, 4, key);
    const bankTxt = bank === 0 ? 'ailes à plat' : `inclinaison à ${bank > 0 ? 'droite' : 'gauche'}`;
    const pitchTxt = pitch === 0 ? 'en palier' : pitch > 0 ? 'en montée (nez haut)' : 'en descente (nez bas)';
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: 'Quelle image correspond à ces instruments ?',
      visual: `<div class="instr-row">${horizonSVG(pitch, bank, 'or')}${heading != null ? headingSVG(heading) : ''}</div>`,
      choices: choices.map((c) => avionVue(c, true)),
      answer,
      explain: `<p>L’horizon montre un avion <b>${pitchTxt}</b>, <b>${bankTxt}</b>${heading != null ? `, et le conservateur de cap indique <b>${cap3(heading)}</b> (vers le ${DIR8[Math.round(heading / 45) % 8]})` : ''}.</p><p>${avionVue(truth)}</p><p class="tip">Méthode : traite <b>un critère à la fois</b> et élimine. 1) L’inclinaison (quelle aile est basse sur la maquette ?). 2) L’assiette (maquette au-dessus ou en dessous de l’horizon ?). 3) Le cap. Ce type de question évalue la « visualisation spatiale à partir des instruments », une épreuve confirmée par la source officielle.</p>`,
      timeLimit: level === 1 ? 20 : 25,
    };
  },
});

/* ---------- 2. Aiguilles de navigation : CDI (VOR) et ILS ---------- */
export function cdiSVG(dev, to = true) {
  // dev de -5 à +5 points ; aiguille à droite = route à droite
  const x = 100 + dev * 14;
  return `<svg viewBox="0 0 200 218" class="instr" aria-label="CDI">
    <circle cx="100" cy="100" r="96" fill="var(--instr-bg)" stroke="currentColor" stroke-width="4"/>
    ${[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((d) => `<circle cx="${100 + d * 14}" cy="100" r="3" fill="currentColor" opacity="0.7"/>`).join('')}
    <circle cx="100" cy="100" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="${x}" y1="30" x2="${x}" y2="170" stroke="var(--warn)" stroke-width="5" stroke-linecap="round"><animate attributeName="x1" values="100;${x}" dur="1.4s" fill="freeze"/><animate attributeName="x2" values="100;${x}" dur="1.4s" fill="freeze"/></line>
    <text x="150" y="60" font-size="16" font-weight="800" fill="var(--ok)">${to ? 'TO ▲' : 'FROM ▼'}</text>
    <text x="100" y="213" text-anchor="middle" font-size="11" fill="currentColor">CDI (VOR)</text>
  </svg>`;
}

export function ilsSVG(loc, gs) {
  // loc : aiguille verticale (+ = à droite), gs : aiguille horizontale (+ = au-dessus)
  const x = 100 + loc * 14, y = 100 - gs * 14;
  return `<svg viewBox="0 0 200 218" class="instr" aria-label="ILS">
    <circle cx="100" cy="100" r="96" fill="var(--instr-bg)" stroke="currentColor" stroke-width="4"/>
    ${[-4, -3, -2, -1, 1, 2, 3, 4].map((d) => `<circle cx="${100 + d * 14}" cy="100" r="2.6" fill="currentColor" opacity="0.6"/><circle cx="100" cy="${100 + d * 14}" r="2.6" fill="currentColor" opacity="0.6"/>`).join('')}
    <line x1="${x}" y1="35" x2="${x}" y2="165" stroke="var(--warn)" stroke-width="5" stroke-linecap="round"><animate attributeName="x1" values="100;${x}" dur="1.4s" fill="freeze"/><animate attributeName="x2" values="100;${x}" dur="1.4s" fill="freeze"/></line>
    <line x1="35" y1="${y}" x2="165" y2="${y}" stroke="var(--ok)" stroke-width="5" stroke-linecap="round"><animate attributeName="y1" values="100;${y}" dur="1.4s" fill="freeze"/><animate attributeName="y2" values="100;${y}" dur="1.4s" fill="freeze"/></line>
    <path d="M70 100 L92 100 M108 100 L130 100 M100 92 L100 108" stroke="currentColor" stroke-width="2"/>
    <text x="100" y="213" text-anchor="middle" font-size="11" fill="currentColor">ILS : alignement (orange) / pente (vert)</text>
  </svg>`;
}

register({
  id: 'psy.navaig',
  module: M,
  group: G,
  title: 'Aiguilles de navigation (CDI, ILS)',
  desc: 'Lire l’écart de route et de pente, savoir vers où corriger.',
  make(level, r) {
    if (level === 1 || r.bool(0.4)) {
      const dev = r.pick([-4, -3, -2, 2, 3, 4]);
      const right = dev > 0;
      const { choices, answer } = buildChoices(r, `La route est à ${right ? 'droite' : 'gauche'} : je corrige vers la ${right ? 'droite' : 'gauche'}`, [`La route est à ${right ? 'gauche' : 'droite'} : je corrige vers la ${right ? 'gauche' : 'droite'}`, 'Je suis exactement sur la route', `Je suis à ${right ? 'droite' : 'gauche'} de la route : je ne corrige pas`], 4);
      return {
        kind: 'mcq',
        prompt: 'Tu suis une route VOR (indicateur TO, route affichée = ta route). Que t’indique l’aiguille ?',
        visual: cdiSVG(dev),
        choices,
        answer,
        explain: `<p>L’aiguille du CDI représente la <b>route</b> : si elle est à ${right ? 'droite' : 'gauche'}, la route est à ${right ? 'droite' : 'gauche'} de toi → <b>« on va vers l’aiguille »</b>.</p><p>Chaque point vaut environ 2° d’écart sur un VOR. Ici : ${Math.abs(dev)} points ≈ ${Math.abs(dev) * 2}°.</p><p class="tip">Ce réflexe marche tant que la route affichée correspond à ta direction de vol (TO vers la balise ou FROM en s’éloignant avec la bonne route). Sinon, la lecture s’inverse.</p>`,
        timeLimit: 15,
      };
    }
    const loc = r.pick([-3, -2, 0, 2, 3]);
    const gs = r.pick([-2, -1, 0, 1, 2]);
    const pos = (loc === 0 ? 'dans l’axe' : `à ${loc > 0 ? 'gauche' : 'droite'} de l’axe`) + ', ' + (gs === 0 ? 'sur le plan de descente' : gs > 0 ? 'sous le plan de descente' : 'au-dessus du plan de descente');
    const act = (loc === 0 ? 'garder le cap' : `corriger vers la ${loc > 0 ? 'droite' : 'gauche'}`) + ' et ' + (gs === 0 ? 'garder le taux de descente' : gs > 0 ? 'réduire le taux de descente' : 'augmenter le taux de descente');
    const askPos = r.bool();
    const all = [];
    for (const l of [-1, 0, 1]) for (const g of [-1, 0, 1]) {
      const p = (l === 0 ? 'dans l’axe' : `à ${l > 0 ? 'gauche' : 'droite'} de l’axe`) + ', ' + (g === 0 ? 'sur le plan de descente' : g > 0 ? 'sous le plan de descente' : 'au-dessus du plan de descente');
      const a = (l === 0 ? 'garder le cap' : `corriger vers la ${l > 0 ? 'droite' : 'gauche'}`) + ' et ' + (g === 0 ? 'garder le taux de descente' : g > 0 ? 'réduire le taux de descente' : 'augmenter le taux de descente');
      all.push(askPos ? `Je suis ${p}` : a.charAt(0).toUpperCase() + a.slice(1));
    }
    const correct = askPos ? `Je suis ${pos}` : act.charAt(0).toUpperCase() + act.slice(1);
    const { choices, answer } = buildChoices(r, correct, r.shuffle(all), 4);
    return {
      kind: 'mcq',
      prompt: askPos ? 'En approche ILS, où es-tu par rapport à l’axe et au plan de descente ?' : 'En approche ILS, que dois-tu faire ?',
      visual: ilsSVG(loc, gs),
      choices,
      answer,
      explain: `<p>Les aiguilles montrent où se trouvent l’axe et le plan, <b>pas l’avion</b>. Le centre du cadran, c’est toi.</p><ul><li>Aiguille verticale (alignement) ${loc === 0 ? 'centrée → tu es dans l’axe' : `à ${loc > 0 ? 'droite' : 'gauche'} → l’axe est à ${loc > 0 ? 'droite' : 'gauche'}, tu es donc à ${loc > 0 ? 'gauche' : 'droite'}`}.</li><li>Aiguille horizontale (pente) ${gs === 0 ? 'centrée → sur le plan' : gs > 0 ? 'en haut → le plan est au-dessus, tu es trop bas' : 'en bas → le plan est en dessous, tu es trop haut'}.</li></ul><p>Action : <b>${act}</b>. On « vole vers les aiguilles » pour les recentrer.</p>`,
      timeLimit: 20,
    };
  },
});

/* ---------- 3. Circuit d'attente ---------- */
export function holdingSVG(phase, standard = true) {
  // Point de report (fix) à droite, branche de rapprochement vers la droite (est), virages à droite (standard).
  const s = standard ? 1 : -1;
  const yIn = 120, yOut = 120 - 70 * s;
  const loop = `M60,${yIn} L220,${yIn} A35,35 0 0 ${standard ? 0 : 1} 220,${yOut} L60,${yOut} A35,35 0 0 ${standard ? 0 : 1} 60,${yIn}`;
  const seg = { rapprochement: `M80,${yIn} L200,${yIn}`, eloignement: `M200,${yOut} L80,${yOut}`, virage: `M220,${yIn} A35,35 0 0 ${standard ? 0 : 1} 220,${yOut}` }[phase];
  return `<svg viewBox="0 0 300 200" class="mech" style="max-width:340px" aria-label="circuit d'attente">
    <rect width="300" height="200" fill="var(--instr-bg)" rx="14"/>
    <path d="${loop}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 5" opacity="0.6"/>
    <polygon points="220,${yIn - 8} 228,${yIn} 220,${yIn + 8} 212,${yIn}" fill="var(--danger)"/><text x="220" y="${yIn + 24}" text-anchor="middle" font-size="11" fill="currentColor">point d’attente</text>
    <g><g transform="rotate(90)">${PLANE()}</g><animateMotion dur="${phase ? 3 : 10}s" repeatCount="indefinite" rotate="auto" path="${seg || loop}"/></g>
  </svg>`;
}

register({
  id: 'psy.attente',
  module: M,
  group: G,
  title: 'Circuit d’attente',
  desc: 'Comprendre l’hippodrome d’attente : branches, sens des virages, durées.',
  make(level, r) {
    const variant = level === 1 ? r.pick(['ou', 'sens']) : r.pick(['ou', 'sens', 'duree', 'ou']);
    const phase = r.pick(['rapprochement', 'eloignement', 'virage']);
    const names = { rapprochement: 'Branche de rapprochement (vers le point)', eloignement: 'Branche d’éloignement', virage: 'Virage' };
    let prompt, correct, distract;
    if (variant === 'ou') {
      prompt = 'Dans quelle partie du circuit d’attente se trouve l’avion ?';
      correct = names[phase];
      distract = Object.values(names).concat(['Hors du circuit']);
    } else if (variant === 'sens') {
      prompt = 'Dans un circuit d’attente standard, dans quel sens se font les virages ?';
      correct = 'À droite';
      distract = ['À gauche', 'Au choix du pilote', 'Alternativement à droite et à gauche'];
    } else {
      prompt = 'Sous le FL 140, combien de temps dure la branche de rapprochement d’une attente standard ?';
      correct = '1 minute';
      distract = ['30 secondes', '2 minutes', '5 minutes'];
    }
    const { choices, answer } = buildChoices(r, correct, distract, 4);
    return {
      kind: 'mcq',
      prompt,
      visual: holdingSVG(variant === 'ou' ? phase : null),
      choices,
      answer,
      explain: `<p>Un <b>circuit d’attente</b> est un hippodrome autour d’un point (balise ou point de report), utilisé quand le contrôle fait patienter un avion.</p><ul><li><b>Branche de rapprochement</b> : vers le point d’attente.</li><li>Au point : virage, puis <b>branche d’éloignement</b>, puis virage pour revenir.</li><li>Attente <b>standard</b> : virages à <b>droite</b> (sinon on parle d’attente « non standard », virages à gauche).</li><li>Branche de rapprochement de <b>1 minute</b> jusqu’au FL 140 (1 min 30 au-dessus).</li></ul>`,
      timeLimit: 15,
    };
  },
});

/* ---------- 4. Signaux lumineux de la tour ---------- */
export const SIGNAUX = [
  { c: '#2ecc71', f: false, air: 'Autorisé à atterrir', sol: 'Autorisé à décoller' },
  { c: '#ff3b30', f: false, air: 'Céder le passage et continuer à tourner en circuit', sol: 'Arrêtez-vous' },
  { c: '#2ecc71', f: true, air: 'Revenez pour atterrir (l’autorisation suivra)', sol: 'Autorisé à rouler' },
  { c: '#ff3b30', f: true, air: 'Aérodrome dangereux : n’atterrissez pas', sol: 'Dégagez l’aire d’atterrissage' },
  { c: '#ffffff', f: true, air: 'Atterrissez sur cet aérodrome et gagnez l’aire de stationnement (l’autorisation suivra)', sol: 'Retournez à votre point de départ sur l’aérodrome' },
];
export function signalSVG(sig) {
  return `<svg viewBox="0 0 240 170" class="mech" style="max-width:300px" aria-label="signal lumineux">
    <rect width="240" height="170" fill="#0b1a33" rx="14"/>
    <rect x="30" y="60" width="44" height="90" fill="#7b8794"/><rect x="18" y="38" width="68" height="26" rx="4" fill="#5b6b7c"/><rect x="24" y="44" width="56" height="12" fill="#9fd3ff" opacity="0.6"/>
    <circle cx="86" cy="50" r="7" fill="${sig.c}">${sig.f ? '<animate attributeName="opacity" values="1;0.05;1" dur="0.8s" repeatCount="indefinite"/>' : ''}</circle>
    <path d="M90,50 L232,20 L232,80 Z" fill="${sig.c}" opacity="0.18">${sig.f ? '<animate attributeName="opacity" values="0.25;0;0.25" dur="0.8s" repeatCount="indefinite"/>' : ''}</path>
    <text x="150" y="155" text-anchor="middle" font-size="12" fill="#cfd8e3">${sig.f ? 'feu clignotant' : 'feu fixe'}</text>
  </svg>`;
}

register({
  id: 'psy.signaux',
  module: M,
  group: G,
  title: 'Signaux lumineux de la tour',
  desc: 'Comprendre les signaux lumineux (utile en cas de panne radio).',
  make(level, r) {
    const sig = r.pick(SIGNAUX);
    const where = level === 1 ? 'air' : r.pick(['air', 'sol']);
    const correct = sig[where];
    const { choices, answer } = buildChoices(r, correct, r.shuffle(SIGNAUX.map((s) => s[where]).concat(SIGNAUX.map((s) => s[where === 'air' ? 'sol' : 'air']))), 4);
    const col = sig.c === '#2ecc71' ? 'vert' : sig.c === '#ff3b30' ? 'rouge' : 'blanc';
    return {
      kind: 'mcq',
      prompt: `${where === 'air' ? 'En vol' : 'Au sol'}, la tour te dirige ce signal (feu ${col} ${sig.f ? 'clignotant' : 'fixe'}). Que signifie-t-il ?`,
      visual: signalSVG(sig),
      choices,
      answer,
      explain: `<p>Feu <b>${col} ${sig.f ? 'clignotant' : 'fixe'}</b> ${where === 'air' ? 'en vol' : 'au sol'} : <b>${correct}</b>.</p><table class="tbl" style="text-align:left"><tr><th>Signal</th><th>En vol</th><th>Au sol</th></tr>${SIGNAUX.map((s) => `<tr><td>${s.c === '#2ecc71' ? 'Vert' : s.c === '#ff3b30' ? 'Rouge' : 'Blanc'} ${s.f ? 'clignotant' : 'fixe'}</td><td>${s.air}</td><td>${s.sol}</td></tr>`).join('')}</table><p class="tip">Utilisés quand la radio ne fonctionne pas. En vol, on accuse réception en balançant les ailes (de jour) ; au sol, en bougeant les ailerons ou la gouverne de direction.</p>`,
      timeLimit: 20,
    };
  },
});

/* ---------- 5. Interception ---------- */
export function interceptionSVG(kind) {
  const fighter = `<path d="M0,-12 L4,0 L18,8 L18,11 L4,8 L3,14 L7,17 L-7,17 L-3,14 L-4,8 L-18,11 L-18,8 L-4,0 Z" fill="#7f8c99" stroke="#000" stroke-width="0.6"/>`;
  const anim =
    kind === 'suivre'
      ? `<animateTransform attributeName="transform" type="rotate" values="-25;25;-25" dur="0.9s" repeatCount="indefinite" additive="sum"/>`
      : kind === 'liberer'
        ? `<animateMotion dur="2.5s" repeatCount="indefinite" path="M0,0 C20,-20 40,-50 90,-70"/>`
        : `<animate attributeName="opacity" values="1;0.6;1" dur="1s" repeatCount="indefinite"/>`;
  return `<svg viewBox="0 0 280 200" class="mech" style="max-width:320px" aria-label="interception">
    <rect width="280" height="200" fill="#3a8fd9" rx="14"/><rect y="150" width="280" height="50" fill="#5e8f4a"/>
    <path d="M40 200 L110 120 L170 120 L240 200 Z" fill="#00000022"/>
    <text x="140" y="190" text-anchor="middle" font-size="11" fill="#fff">vue depuis ton cockpit</text>
    <g transform="translate(95 70)"><g>${fighter}${anim}</g></g>
    ${kind === 'atterrir' ? '<circle cx="95" cy="86" r="4" fill="#fff"><animate attributeName="opacity" values="1;0.2;1" dur="0.6s" repeatCount="indefinite"/></circle><text x="95" y="110" text-anchor="middle" font-size="10" fill="#fff">train sorti, phares allumés</text>' : ''}
    <text x="12" y="20" font-size="11" font-weight="700" fill="#fff">Chasseur devant, à gauche</text>
  </svg>`;
}

const INTER = {
  suivre: { q: 'Un chasseur se place devant toi, légèrement au-dessus et à gauche, et bat des ailes. Que signifie ce signal ?', a: 'Vous avez été intercepté, suivez-moi', d: ['Vous pouvez continuer votre route', 'Atterrissez immédiatement sur place', 'Montez et dégagez la zone'], e: 'Balancement des ailes devant l’avion intercepté (en général à sa gauche), puis virage lent vers la direction voulue = <b>« vous avez été intercepté, suivez-moi »</b>. Tu réponds en <b>balançant les ailes</b> à ton tour et tu suis.' },
  liberer: { q: 'Le chasseur qui t’escortait s’écarte brusquement par un virage en montée, sans couper ta route. Que signifie ce signal ?', a: 'Vous pouvez continuer votre route', d: ['Suivez-moi', 'Atterrissez sur l’aérodrome le plus proche', 'Vous allez être abattu'], e: 'Dégagement brusque en virage montant (90° ou plus) sans croiser ta trajectoire = <b>« vous pouvez continuer »</b>. Tu réponds en balançant les ailes.' },
  atterrir: { q: 'Le chasseur sort son train, allume ses phares et survole la piste d’un aérodrome. Que signifie ce signal ?', a: 'Atterrissez sur cet aérodrome', d: ['Suivez-moi vers un autre pays', 'Vous pouvez continuer', 'Faites demi-tour'], e: 'Train sorti, phares allumés, survol de la piste = <b>« atterrissez sur cet aérodrome »</b>. Tu sors ton train (s’il est rentrant), tu suis et tu te poses.' },
  conduite: { q: 'Tu es intercepté. Quelles sont les bonnes actions ?', a: 'Suivre les instructions de l’intercepteur, appeler sur 121,5 MHz et afficher 7700 au transpondeur (sauf autre instruction)', d: ['Accélérer pour s’éloigner de la zone', 'Couper la radio pour éviter les interférences', 'Ignorer l’intercepteur si l’on est en règle'], e: 'Règles de l’air : se conformer aux signaux de l’intercepteur, prévenir l’organisme de contrôle si possible, tenter le contact sur la fréquence d’urgence <b>121,5 MHz</b> et afficher <b>7700</b> au transpondeur, sauf instruction contraire.' },
};

register({
  id: 'psy.interception',
  module: M,
  group: G,
  title: 'Interception (signaux)',
  desc: 'La police du ciel vue du pilote intercepté : comprendre les signaux.',
  make(level, r) {
    const k = level === 1 ? r.pick(['suivre', 'liberer']) : r.pick(Object.keys(INTER));
    const it = INTER[k];
    const { choices, answer } = buildChoices(r, it.a, it.d, 4);
    return { kind: 'mcq', prompt: it.q, visual: interceptionSVG(k === 'conduite' ? 'suivre' : k), choices, answer, explain: `<p>${it.e}</p><p class="tip">Ces signaux sont internationaux (règles de l’air). Ils servent aux avions de la posture permanente de sûreté aérienne quand un appareil ne répond pas à la radio.</p>`, timeLimit: 25 };
  },
});

/* ---------- 6. Situations d'urgence et décisions (banque illustrée) ---------- */
const ICON = (emoji, anim = 'pulse') => `<div class="sit-ico ${anim}">${emoji}</div>`;
const URGENCES = [
  { ctx: ICON('🛫⚠️'), q: 'Juste après le décollage, à 300 ft, le moteur s’arrête. Que fais-tu ?', a: 'Rendre la main pour garder la vitesse et atterrir à peu près droit devant', d: ['Faire immédiatement demi-tour vers la piste', 'Tirer sur le manche pour garder de la hauteur', 'Chercher la panne avant tout'], e: 'À basse hauteur, un demi-tour fait perdre trop de hauteur et risque le décrochage en virage. On garde la <b>vitesse</b> (nez vers le bas) et on se pose dans un secteur devant soi (environ ±30°).' },
  { ctx: ICON('✈️💨', 'drift'), q: 'En croisière, le moteur s’arrête. Quelle est la première priorité ?', a: 'Afficher la vitesse de meilleur plané et choisir un terrain d’atterrissage', d: ['Appeler la radio en premier', 'Essayer de redémarrer pendant plusieurs minutes avant de faire autre chose', 'Monter pour gagner du temps'], e: '« <b>Piloter, naviguer, communiquer</b> » : d’abord la vitesse de plané et le choix d’un champ (si possible face au vent), puis la recherche de panne (carburant, magnétos, réchauffage carburateur), enfin le message (MAYDAY, 7700).' },
  { ctx: ICON('🧊⚙️'), q: 'En croisière par temps humide, le régime moteur baisse lentement et le moteur tourne irrégulièrement. Cause probable et action ?', a: 'Givrage du carburateur : réchauffage carburateur plein', d: ['Panne d’huile : couper le moteur', 'Turbulence : réduire la vitesse', 'Trop de carburant : appauvrir à fond'], e: 'Le givrage carburateur peut survenir même par 15-20 °C si l’air est humide. Symptômes : baisse de régime, fonctionnement irrégulier. Action : <b>réchauffage carburateur plein</b> (le moteur peut d’abord tourner plus mal le temps que la glace fonde).' },
  { ctx: ICON('⛈️', 'flash'), q: 'Un cumulonimbus se trouve sur ta route. Que fais-tu ?', a: 'Le contourner très largement ou faire demi-tour', d: ['Passer dessous pour rester en vue du sol', 'Le traverser rapidement au milieu', 'Monter au-dessus en passant à travers'], e: 'Grêle, turbulence violente, foudre, givrage, cisaillement : on ne s’approche <b>jamais</b> d’un cumulonimbus, ni dessous ni dedans. On le contourne avec une grande marge, ou on fait demi-tour.' },
  { ctx: ICON('🌫️', 'fade'), q: 'En vol à vue, la visibilité baisse et les nuages descendent devant toi. Quelle décision ?', a: 'Faire demi-tour tôt vers une zone où la météo est connue et bonne', d: ['Descendre sous les nuages et continuer', 'Continuer en espérant que ça s’améliore', 'Monter dans les nuages'], e: 'La poursuite du vol VFR dans une météo qui se dégrade est une cause majeure d’accidents. La bonne décision est <b>précoce</b> : demi-tour ou déroutement tant que les conditions le permettent.' },
  { ctx: ICON('☁️❓', 'fade'), q: 'Tu entres par erreur dans un nuage et tu perds tout repère extérieur. Que fais-tu ?', a: 'Passer sur les instruments, remettre les ailes à plat et faire demi-tour en virage modéré', d: ['Se fier à ses sensations', 'Faire un virage serré et piqué pour ressortir vite', 'Lâcher les commandes'], e: 'Sans repère extérieur, l’oreille interne trompe vite (désorientation spatiale). On <b>croit les instruments</b> : ailes à plat sur l’horizon artificiel, puis virage modéré pour revenir vers la zone claire.' },
  { ctx: ICON('📻❌'), q: 'Ta radio tombe en panne en vol VFR. Que fais-tu ?', a: 'Afficher 7600, continuer en VFR et se poser sur l’aérodrome approprié en surveillant les signaux lumineux', d: ['Afficher 7500', 'Entrer dans l’espace contrôlé pour qu’on te voie au radar', 'Se poser immédiatement dans un champ'], e: '<b>7600</b> = panne radio. On reste en VFR, on évite les espaces où le contact radio est obligatoire et on se pose sur un terrain adapté en guettant les <b>signaux lumineux</b> de la tour.' },
  { ctx: ICON('🔥', 'flash'), q: 'Feu moteur en vol : quelle est l’idée générale de la procédure ?', a: 'Appliquer la check-list : couper l’arrivée de carburant, puis préparer un atterrissage au plus vite', d: ['Ouvrir les fenêtres pour aérer', 'Remettre plein gaz pour éteindre le feu', 'Continuer la navigation prévue'], e: 'On applique la <b>check-list du manuel de vol</b> (elle varie selon l’avion). Le principe : priver le feu de carburant, puis se poser rapidement (atterrissage forcé si nécessaire).' },
  { ctx: ICON('🌀', 'spin'), q: 'L’avion part en vrille involontaire. Quelle est la sortie standard ?', a: 'Réduire, palonnier opposé à la rotation, manche vers l’avant, puis ressource douce une fois la rotation arrêtée', d: ['Mettre plein gaz et tirer', 'Palonnier du côté de la rotation', 'Braquer les ailerons contre la rotation'], e: 'Sortie type (à adapter au manuel de vol) : <b>réduire</b> la puissance, ailerons au neutre, <b>palonnier opposé</b> à la rotation, <b>manche en avant</b> pour casser l’incidence, puis ressource douce quand la rotation s’arrête.' },
  { ctx: ICON('🔔', 'flash'), q: 'En finale, l’avertisseur de décrochage retentit. Que fais-tu ?', a: 'Rendre la main pour diminuer l’incidence et afficher de la puissance', d: ['Tirer sur le manche pour ne pas perdre d’altitude', 'Sortir plus de volets immédiatement', 'Ignorer l’alarme si l’on voit la piste'], e: 'L’avertisseur signale une incidence proche du décrochage. La réponse est toujours de <b>diminuer l’incidence</b> (rendre la main) et d’ajouter de la puissance. Si l’approche n’est plus stabilisée : remise de gaz.' },
  { ctx: ICON('🛬↩️'), q: 'En courte finale, l’approche n’est pas stabilisée (trop haut, trop vite). Bonne décision ?', a: 'Remettre les gaz et refaire une approche', d: ['Forcer l’atterrissage', 'Piquer fortement pour rattraper le plan', 'Sortir le parachute'], e: 'La <b>remise de gaz</b> est une manœuvre normale, pas un échec. Une approche non stabilisée est une cause classique de sortie de piste.' },
  { ctx: ICON('🧭❓'), q: 'Tu es perdu en navigation VFR. Quelle méthode adopter ?', a: 'Garder un cap constant, prévenir sur la fréquence (SIV), estimer sa position et chercher un repère marquant', d: ['Tourner en rond pour chercher', 'Descendre très bas pour lire les panneaux', 'Couper la radio pour se concentrer'], e: 'Rester calme : <b>cap constant</b>, calcul de la position estimée (temps × vitesse), recherche d’un repère net (autoroute, ville, fleuve), et appel à l’aide (SIV, contrôle) qui peut te localiser au radar.' },
  { ctx: ICON('⛽'), q: 'En vol, tu constates que le carburant restant est plus faible que prévu. Bonne décision ?', a: 'Se dérouter tôt vers l’aérodrome le plus proche adapté', d: ['Continuer en réduisant un peu la vitesse', 'Monter le plus haut possible', 'Attendre la réserve pour décider'], e: 'Le carburant ne se négocie pas : on se <b>déroute tôt</b>, tant qu’on a encore des options. Beaucoup d’accidents sont des pannes sèches évitables.' },
  { ctx: ICON('🌡️⚠️'), q: 'La pression d’huile chute et la température d’huile monte. Que fais-tu ?', a: 'Prévoir un atterrissage rapide, réduire la puissance et surveiller ; préparer un atterrissage forcé', d: ['Mettre plein gaz pour refroidir', 'Ignorer : les instruments sont souvent faux', 'Couper immédiatement le moteur en croisière au-dessus de la mer'], e: 'Pression basse + température haute = panne moteur probable à court terme. On se rapproche d’un terrain, on réduit les sollicitations et on prépare la suite.' },
  { ctx: ICON('💨🛬', 'drift'), q: 'En finale, fort vent de travers venant de la droite. Quelle correction ?', a: 'Mettre le nez de l’avion vers la droite (dans le vent) pour garder l’axe', d: ['Mettre le nez vers la gauche', 'Accélérer fortement', 'Ne rien faire : la piste est large'], e: 'On corrige la dérive en orientant le nez <b>du côté d’où vient le vent</b> (crabe), puis on aligne l’avion avec l’axe juste avant le toucher (décrabe ou aile basse).' },
  { ctx: ICON('✈️↕️', 'pulse'), q: 'Tu décolles derrière un gros avion de ligne. Quel danger particulier ?', a: 'Les turbulences de sillage (tourbillons en bout d’aile)', d: ['Le bruit', 'La fumée des réacteurs', 'Aucun si la piste est libre'], e: 'Les gros avions laissent des <b>tourbillons de sillage</b> qui peuvent retourner un petit avion. On respecte un espacement (souvent 2 à 3 min) et on décolle avant leur point de rotation.' },
  { ctx: ICON('🐦', 'drift'), q: 'Une nuée d’oiseaux apparaît en courte finale. Réaction la plus sûre ?', a: 'Remettre les gaz en montant si possible au-dessus des oiseaux', d: ['Piquer sous les oiseaux à pleine vitesse', 'Fermer les yeux', 'Couper le moteur'], e: 'Le péril aviaire est réel : les oiseaux plongent souvent en cas de danger, donc on tend à <b>monter</b>. Remise de gaz si l’approche n’est plus sûre.' },
  { ctx: ICON('😵', 'fade'), q: 'Seul à bord à 12 000 ft sans oxygène, tu te sens euphorique et lent. Que se passe-t-il ?', a: 'Début d’hypoxie : descendre immédiatement', d: ['Fatigue normale : continuer', 'Mal de l’air : ouvrir l’aération', 'Hyperventilation : retenir sa respiration'], e: 'L’<b>hypoxie</b> (manque d’oxygène) est insidieuse : euphorie, lenteur, erreurs. Remède : <b>descendre</b> (et oxygène si disponible). Au-delà d’environ 10 000 ft, l’oxygène devient nécessaire.' },
  { ctx: ICON('🫁'), q: 'Stressé, tu respires très vite, tes doigts picotent et tu as la tête qui tourne. Que faire ?', a: 'Ralentir volontairement la respiration (hyperventilation)', d: ['Respirer encore plus vite', 'Monter en altitude', 'Ignorer'], e: 'L’<b>hyperventilation</b> (souvent due au stress) donne des symptômes proches de l’hypoxie. Remède : respirer lentement, parler à voix haute (cela ralentit le rythme).' },
  { ctx: ICON('🌙', 'fade'), q: 'De nuit, tu fixes une lumière isolée et tu as l’impression qu’elle bouge. Comment l’expliquer ?', a: 'Une illusion visuelle (autocinétisme) : il faut balayer du regard et croire les instruments', d: ['Un OVNI', 'Une panne d’instrument', 'Un effet du carburant'], e: 'L’<b>autocinétisme</b> : une lumière fixe regardée longtemps dans le noir semble bouger. On évite de fixer, on balaie et on se fie aux instruments.' },
  { ctx: ICON('🔄', 'spin'), q: 'Après un long virage dans les nuages, tu remets les ailes à plat et tu as l’impression de tourner dans l’autre sens. Que faire ?', a: 'Croire les instruments : c’est une illusion de l’oreille interne', d: ['Corriger dans le sens de la sensation', 'Fermer les yeux pour se recentrer', 'Secouer la tête'], e: 'Lors d’un virage prolongé, l’oreille interne s’habitue ; en sortant du virage, elle donne une fausse sensation de rotation inverse (« leans », vertige). Seuls les <b>instruments</b> disent la vérité.' },
  { ctx: ICON('⚡', 'flash'), q: 'Panne électrique totale en vol VFR de jour sur un petit avion à pistons. Le moteur s’arrête-t-il ?', a: 'Non : l’allumage par magnétos est indépendant de la batterie', d: ['Oui, immédiatement', 'Oui, au bout de 5 minutes', 'Seulement en montée'], e: 'Sur un moteur à pistons classique, les <b>magnétos</b> produisent leur propre courant d’allumage. On perd la radio et certains instruments, mais le moteur continue de tourner.' },
  { ctx: ICON('🚪💨', 'drift'), q: 'Une porte s’ouvre en vol juste après le décollage. Priorité ?', a: 'Continuer à piloter normalement, faire un tour de piste et se poser pour la fermer', d: ['Lâcher les commandes pour la fermer immédiatement', 'Faire un virage serré pour la refermer', 'Couper le moteur'], e: 'Une porte ouverte fait du bruit et impressionne mais met rarement l’avion en danger. Le vrai danger est de <b>cesser de piloter</b>. Piloter d’abord, puis se reposer pour la fermer.' },
  { ctx: ICON('🛞', 'pulse'), q: 'Au roulage à l’atterrissage, l’avion part vers la gauche. Que fais-tu ?', a: 'Corriger avec le palonnier (et le frein) du côté opposé pour rester dans l’axe', d: ['Tirer sur le manche', 'Remettre plein gaz en virant', 'Ne rien faire'], e: 'Au sol, la direction se tient aux <b>pieds</b> (palonnier, roulette, freins différentiels). Si l’avion ne peut être tenu et que la vitesse le permet, une remise de gaz peut être envisagée.' },
  { ctx: ICON('🏔️', 'fade'), q: 'Tu voles en montagne vers une crête. Comment la franchir en sécurité ?', a: 'Arriver avec une marge de hauteur et de biais (à 45°) pour pouvoir faire demi-tour', d: ['Perpendiculairement au ras de la crête', 'Le plus vite possible en descente', 'Peu importe l’angle'], e: 'On aborde une crête <b>en biais</b> avec de la marge : si un courant descendant apparaît, on peut s’écarter vers la vallée. Côté sous le vent = rabattants.' },
  { ctx: ICON('🛩️🛩️', 'pulse'), q: 'Deux avions convergent à la même altitude. Toi, tu vois l’autre sur ta droite. Qui a la priorité ?', a: 'L’autre avion (il vient de ta droite) : tu dois t’écarter', d: ['Toi', 'Le plus rapide', 'Le plus gros'], e: 'Règle de l’air : en convergence, l’aéronef qui voit l’autre à sa <b>droite</b> lui cède le passage (en général en passant derrière lui).' },
  { ctx: ICON('🎧'), q: 'Le contrôleur te donne une instruction que tu n’as pas comprise. Que fais-tu ?', a: 'Demander de répéter (« say again ») plutôt que de deviner', d: ['Faire ce qui semble logique', 'Ne pas répondre', 'Répondre « roger » et attendre'], e: 'Une instruction mal comprise est une source classique d’incident. On ne devine jamais : « <b>répétez</b> » / « say again ». Et on <b>collationne</b> (répète) les instructions importantes.' },
  { ctx: ICON('🌫️🛬', 'fade'), q: 'Arrivé à destination, le brouillard recouvre l’aérodrome. Que fais-tu ?', a: 'Se dérouter vers le terrain de dégagement prévu', d: ['Descendre pour chercher la piste', 'Attendre en tournant jusqu’à la panne de carburant', 'Se poser à côté sur une route'], e: 'C’est pour cela qu’on prévoit un <b>terrain de dégagement</b> et du carburant en conséquence avant le vol.' },
  { ctx: ICON('🤒'), q: 'Le matin d’un vol, tu as un rhume avec le nez bouché. Que décides-tu ?', a: 'Ne pas voler : risque de barotraumatisme (douleurs d’oreilles et sinus en descente)', d: ['Voler en prenant un décongestionnant', 'Voler mais rester bas', 'Voler : ce n’est qu’un rhume'], e: 'Avec les trompes d’Eustache bouchées, la pression ne s’équilibre pas en descente : douleur intense, voire perforation du tympan. Avant de voler, on vérifie son état (méthode « <b>I’M SAFE</b> » : maladie, médicaments, stress, alcool, fatigue, alimentation).' },
  { ctx: ICON('🍷'), q: 'Tu as bu de l’alcool la veille au soir. Que retenir ?', a: 'Respecter un délai sans alcool avant de voler (souvent au moins 8 h) et un taux nul ou quasi nul', d: ['Un café suffit à éliminer l’alcool', 'Seul l’alcool fort compte', 'Voler en altitude atténue les effets'], e: 'L’altitude <b>renforce</b> les effets de l’alcool. Les règles imposent un délai (souvent « 8 h bottle to throttle ») et un taux très bas ; dans les armées, la tolérance est nulle.' },
];

registerBank({ id: 'psy.urgences', module: M, group: G, title: 'Situations d’urgence et décisions', desc: 'Panne moteur, givrage, orage, météo, nuages, radio, feu, vrille, remise de gaz…', items: URGENCES, timeLimit: 30 });
