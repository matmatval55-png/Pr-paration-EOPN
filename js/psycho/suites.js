// Suites logiques : nombres, lettres, dominos, matrices.
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';
import { n } from '../core/fmt.js';

const M = 'psycho';

/* ---------- Suites de nombres ---------- */

const numPatterns = {
  1: [
    (r) => {
      const a = r.int(1, 30), k = r.pick([2, 3, 4, 5, 6, 7, 9, 11, 12, 15]) * r.pick([1, 1, -1]);
      const s = [0, 1, 2, 3, 4, 5].map((i) => a + (k < 0 ? 60 : 0) + i * k);
      return { s, ex: `On ajoute <b>${k > 0 ? '+' : ''}${k}</b> à chaque terme (suite arithmétique).` };
    },
    (r) => {
      const a = r.int(1, 5), k = r.pick([2, 3]);
      const s = [0, 1, 2, 3, 4, 5].map((i) => a * k ** i);
      return { s, ex: `Chaque terme est multiplié par <b>${k}</b> (suite géométrique).` };
    },
    (r) => {
      const a = r.int(10, 40), x = r.int(2, 9), y = r.int(1, 6);
      const s = [a];
      for (let i = 1; i < 6; i++) s.push(s[i - 1] + (i % 2 ? x : -y));
      return { s, ex: `On alterne <b>+${x}</b> et <b>−${y}</b>.` };
    },
  ],
  2: [
    (r) => {
      const a = r.int(1, 20), d = r.int(1, 4), st = r.int(1, 3);
      const s = [a];
      for (let i = 1; i < 6; i++) s.push(s[i - 1] + d + (i - 1) * st);
      const diffs = s.slice(1).map((v, i) => v - s[i]);
      return { s, ex: `Les écarts entre termes augmentent de ${st} à chaque fois : ${diffs.join(', ')}…` };
    },
    (r) => {
      const a = r.int(1, 6), x = r.int(1, 5), m = r.pick([2, 3]);
      const s = [a];
      for (let i = 1; i < 6; i++) s.push(i % 2 ? s[i - 1] + x : s[i - 1] * m);
      return { s, ex: `On alterne <b>+${x}</b> et <b>×${m}</b>.` };
    },
    (r) => {
      const a = r.int(1, 9), b = r.int(20, 40), x = r.int(2, 5), y = r.int(1, 4);
      const s = [];
      for (let i = 0; i < 4; i++) s.push(a + i * x, b - i * y);
      return {
        s: s.slice(0, 7),
        ex: `Deux suites sont entremêlées : les rangs impairs font +${x} (${a}, ${a + x}, ${a + 2 * x}…) et les rangs pairs font −${y} (${b}, ${b - y}, ${b - 2 * y}…).`,
      };
    },
    (r) => {
      const st = r.int(1, 6), k = r.pick([0, 1, -1, 2]);
      const s = [0, 1, 2, 3, 4, 5].map((i) => (i + st) ** 2 + k);
      return { s, ex: `Ce sont les carrés ${k ? (k > 0 ? '+ ' + k : '− ' + -k) : ''} : ${s.map((_, i) => `${i + st}²${k ? (k > 0 ? '+' + k : k) : ''}`).join(', ')}…` };
    },
  ],
  3: [
    (r) => {
      const a = r.int(1, 5), m = r.pick([2, 3]), b = r.pick([-1, 1, 2, -2, 3]);
      const s = [a];
      for (let i = 1; i < 6; i++) s.push(s[i - 1] * m + b);
      return { s, ex: `Chaque terme = terme précédent <b>×${m} ${b > 0 ? '+' : '−'} ${Math.abs(b)}</b>. Ex. : ${s[1]} × ${m} ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${s[2]}.` };
    },
    (r) => {
      const a = r.int(1, 5), b = r.int(1, 6);
      const s = [a, b];
      for (let i = 2; i < 7; i++) s.push(s[i - 1] + s[i - 2]);
      return { s, ex: `Chaque terme est la <b>somme des deux précédents</b> : ${s[2]} + ${s[3]} = ${s[4]}.` };
    },
    (r) => {
      const a = r.int(2, 10), d = r.pick([1, 2, 3]), m = 2;
      const s = [a];
      let step = d;
      for (let i = 1; i < 6; i++) {
        s.push(s[i - 1] + step);
        step *= m;
      }
      const diffs = s.slice(1).map((v, i) => v - s[i]);
      return { s, ex: `Les écarts doublent à chaque fois : ${diffs.join(', ')}…` };
    },
    (r) => {
      const st = r.int(1, 4);
      const s = [0, 1, 2, 3, 4, 5].map((i) => (i + st) ** 3);
      return { s, ex: `Ce sont les cubes : ${s.map((_, i) => `${i + st}³`).join(', ')}…` };
    },
    (r) => {
      const a = r.int(2, 9), x = r.int(2, 4);
      const s = [a];
      for (let i = 1; i < 6; i++) s.push(i % 2 ? s[i - 1] * x : s[i - 1] - a);
      return { s, ex: `On alterne <b>×${x}</b> et <b>−${a}</b>.` };
    },
  ],
};

register({
  id: 'psy.suites-nombres',
  module: M,
  group: 'Suites logiques',
  title: 'Suites de nombres',
  desc: 'Trouver le terme suivant d’une suite.',
  make(level, r) {
    const { s, ex } = r.pick(numPatterns[level])(r);
    const shown = s.slice(0, -1);
    const ans = s[s.length - 1];
    const last = shown[shown.length - 1];
    const d = ans - last;
    const { choices, answer } = buildChoices(r, ans, r.shuffle([ans + 1, ans - 1, last + d + 1, ans + 2, ans - 2, last * 2, ans + d, ans - d]), 5);
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: `Quel nombre vient ensuite ?<div class="seq">${shown.map((x) => `<span>${n(x)}</span>`).join('')}<span class="seq-q">?</span></div>`,
      choices: choices.map((c) => n(c)),
      answer,
      explain: `<p>${ex}</p><p>Le terme suivant est donc <b>${n(ans)}</b>.</p><p class="tip">Méthode : calcule d’abord les écarts entre termes consécutifs. S’ils ne sont pas constants, regarde les rapports (×), puis une alternance de deux opérations, puis deux suites entremêlées (1 terme sur 2).</p>`,
      timeLimit: 45,
    };
  },
});

/* ---------- Suites de lettres ---------- */

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const L = (i) => A[(((i - 1) % 26) + 26) % 26];
const pos = (c) => A.indexOf(c) + 1;

const letterPatterns = {
  1: [
    (r) => {
      const a = r.int(1, 10), k = r.int(1, 4);
      return { s: [0, 1, 2, 3, 4, 5].map((i) => L(a + i * k)), ex: `On avance de <b>${k}</b> lettre${k > 1 ? 's' : ''} à chaque fois.` };
    },
    (r) => {
      const a = r.int(18, 26), k = r.int(1, 3);
      return { s: [0, 1, 2, 3, 4, 5].map((i) => L(a - i * k)), ex: `On recule de <b>${k}</b> lettre${k > 1 ? 's' : ''} à chaque fois.` };
    },
  ],
  2: [
    (r) => {
      const a = r.int(1, 8), x = r.int(1, 4), y = r.int(1, 3);
      const s = [a];
      for (let i = 1; i < 6; i++) s.push(s[i - 1] + (i % 2 ? x : -y));
      return { s: s.map(L), ex: `On alterne <b>+${x}</b> et <b>−${y}</b> dans l’alphabet.` };
    },
    (r) => {
      const a = r.int(1, 5);
      const s = [a];
      for (let i = 1; i < 6; i++) s.push(s[i - 1] + i);
      return { s: s.map(L), ex: `Les sauts augmentent : +1, +2, +3, +4, +5.` };
    },
    (r) => {
      const a = r.int(1, 6), b = r.int(20, 26), x = r.int(1, 3);
      const s = [];
      for (let i = 0; i < 4; i++) s.push(L(a + i * x), L(b - i * x));
      return { s: s.slice(0, 7), ex: `Deux suites entremêlées : une avance de ${x} depuis ${L(a)}, l’autre recule de ${x} depuis ${L(b)}.` };
    },
  ],
  3: [
    (r) => {
      // paires miroirs : AZ BY CX…
      const a = r.int(1, 6), k = r.int(1, 2);
      const s = [0, 1, 2, 3, 4].map((i) => L(a + i * k) + L(27 - a - i * k));
      return { s, ex: `Chaque paire associe une lettre et sa « lettre miroir » (A↔Z, B↔Y…, la somme des rangs vaut 27). La 1re lettre avance de ${k}.` };
    },
    (r) => {
      const a = r.int(1, 8), k = r.int(1, 3), g = r.int(1, 3);
      const s = [0, 1, 2, 3, 4].map((i) => L(a + i * k) + L(a + i * k + g));
      return { s, ex: `Groupes de deux lettres séparées de ${g} ; chaque groupe avance de ${k}.` };
    },
    (r) => {
      const a = r.int(1, 4);
      const s = [a];
      for (let i = 1; i < 6; i++) s.push(s[i - 1] + i * 2 - 1);
      return { s: s.map(L), ex: `Les sauts sont les nombres impairs : +1, +3, +5, +7, +9 (après Z, on repart à A).` };
    },
  ],
};

register({
  id: 'psy.suites-lettres',
  module: M,
  group: 'Suites logiques',
  title: 'Suites de lettres',
  desc: 'Repérer le décalage dans l’alphabet.',
  make(level, r) {
    const { s, ex } = r.pick(letterPatterns[level])(r);
    const shown = s.slice(0, -1);
    const ans = s[s.length - 1];
    const shift = (w, k) => w.split('').map((c) => L(pos(c) + k)).join('');
    const { choices, answer } = buildChoices(r, ans, r.shuffle([shift(ans, 1), shift(ans, -1), shift(ans, 2), shift(ans, -2), ans.split('').reverse().join('')]), 5);
    const ranks = shown.concat(ans).map((w) => w.split('').map((c) => `${c}=${pos(c)}`).join(' ')).join(' · ');
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: `Quelle lettre (ou groupe) vient ensuite ?<div class="seq">${shown.map((x) => `<span>${x}</span>`).join('')}<span class="seq-q">?</span></div>`,
      choices,
      answer,
      explain: `<p>${ex}</p><p>Rangs dans l’alphabet : <span class="small">${ranks}</span></p><p>Réponse : <b>${ans}</b>.</p><p class="tip">Astuce : apprends les repères E=5, J=10, O=15, T=20, Z=26. Après Z, on repart à A.</p>`,
      timeLimit: 45,
    };
  },
});

/* ---------- Dominos ---------- */

const PIPS = {
  0: [],
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [2, 0], [0, 2], [2, 2]],
  5: [[0, 0], [2, 0], [0, 2], [2, 2], [1, 1]],
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
};

export function dominoSVG(top, bottom, q = false) {
  const half = (v, oy) =>
    q
      ? ''
      : PIPS[v].map(([x, y]) => `<circle cx="${8 + x * 12}" cy="${oy + 8 + y * 12}" r="3.6" fill="currentColor"/>`).join('');
  return `<svg class="domino" viewBox="-2 -2 44 84" width="44" height="84" aria-label="${q ? 'domino inconnu' : `domino ${top} / ${bottom}`}">
    <rect x="0" y="0" width="40" height="80" rx="6" fill="var(--card2)" stroke="currentColor" stroke-width="2"/>
    <line x1="4" y1="40" x2="36" y2="40" stroke="currentColor" stroke-width="2"/>
    ${q ? '<text x="20" y="48" text-anchor="middle" font-size="26" font-weight="700" fill="currentColor">?</text>' : half(top, 2) + half(bottom, 42)}
  </svg>`;
}

const m7 = (x) => ((x % 7) + 7) % 7;

register({
  id: 'psy.dominos',
  module: M,
  group: 'Suites logiques',
  title: 'Dominos',
  desc: 'Trouver le domino qui complète la série (valeurs de 0 à 6).',
  make(level, r) {
    const len = 5;
    let tops = [], bots = [], ex;
    const t0 = r.int(0, 6), b0 = r.int(0, 6);
    if (level === 1) {
      const a = r.pick([1, 1, 2]), b = r.pick([0, 1, -1]);
      for (let i = 0; i < len; i++) {
        tops.push(m7(t0 + i * a));
        bots.push(m7(b0 + i * b));
      }
      ex = `Moitié du haut : ${a > 0 ? '+' : ''}${a} à chaque domino. Moitié du bas : ${b === 0 ? 'toujours la même valeur' : (b > 0 ? '+' : '') + b + ' à chaque domino'}.`;
    } else if (level === 2) {
      const a = r.pick([1, 2, 3, -1, -2]), b = r.pick([1, 2, -1, -2, 3]);
      for (let i = 0; i < len; i++) {
        tops.push(m7(t0 + i * a));
        bots.push(m7(b0 + i * b));
      }
      ex = `Haut : ${a > 0 ? '+' : ''}${a} ; bas : ${b > 0 ? '+' : ''}${b}. Les valeurs « tournent » de 0 à 6 : après 6 vient 0 (et avant 0 vient 6).`;
    } else {
      const variant = r.int(0, 2);
      if (variant === 0) {
        const a = r.int(1, 3), c = r.int(1, 3);
        for (let i = 0; i < len; i++) {
          tops.push(m7(t0 + i * a));
          bots.push(m7(t0 + i * a + c));
        }
        ex = `Haut : +${a} à chaque fois. Le bas vaut toujours le haut + ${c} (modulo 7 : après 6 on revient à 0).`;
      } else if (variant === 1) {
        const x = r.int(1, 3), y = r.int(1, 3);
        let t = t0;
        for (let i = 0; i < len; i++) {
          tops.push(m7(t));
          bots.push(m7(b0 - i));
          t += i % 2 ? y : x;
        }
        ex = `Haut : on alterne +${x} et +${y}. Bas : −1 à chaque domino.`;
      } else {
        const a = r.int(1, 2);
        tops.push(t0);
        bots.push(b0);
        for (let i = 1; i < len; i++) {
          tops.push(m7(bots[i - 1] + a));
          bots.push(m7(tops[i - 1] + a));
        }
        ex = `Le haut d’un domino = le bas du précédent + ${a} ; le bas = le haut du précédent + ${a} (les moitiés se croisent).`;
      }
    }
    const T = tops[len - 1], B = bots[len - 1];
    const cand = [
      [T, B],
      [B, T],
      [m7(T + 1), B],
      [T, m7(B + 1)],
      [m7(T - 1), m7(B - 1)],
      [m7(T + 1), m7(B - 1)],
    ];
    const { choices, answer } = buildChoices(r, cand[0], r.shuffle(cand.slice(1)), 4, (c) => c.join('-'));
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: `Quel domino complète la série ?<div class="seq dominos">${tops
        .slice(0, -1)
        .map((t, i) => dominoSVG(t, bots[i]))
        .join('')}${dominoSVG(0, 0, true)}</div>`,
      choices: choices.map(([t, b]) => dominoSVG(t, b)),
      answer,
      explain: `<p>${ex}</p><p>Le domino manquant est <b>${T} / ${B}</b> (haut / bas).</p><p class="tip">Méthode : étudie séparément la suite des moitiés du haut et celle du bas. Si rien ne colle, compare le haut d’un domino avec le bas du précédent.</p>`,
      timeLimit: 60,
    };
  },
});

/* ---------- Matrices 3×3 ---------- */

const SHAPES = ['cercle', 'carré', 'triangle'];
const FILLS = ['vide', 'gris', 'noir'];

function shapeSVG(shape, x, y, s, fill) {
  const f = fill === 'vide' ? 'none' : 'currentColor';
  const op = fill === 'gris' ? ' fill-opacity="0.4"' : '';
  const st = `stroke="currentColor" stroke-width="2" fill="${f}"${op}`;
  if (shape === 'cercle') return `<circle cx="${x}" cy="${y}" r="${s / 2}" ${st}/>`;
  if (shape === 'carré') return `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" ${st}/>`;
  return `<polygon points="${x},${y - s / 2} ${x + s / 2},${y + s / 2} ${x - s / 2},${y + s / 2}" ${st}/>`;
}

export function cellSVG(c, q = false) {
  if (q) return `<svg viewBox="0 0 60 60" class="mcell"><text x="30" y="40" text-anchor="middle" font-size="28" font-weight="700" fill="currentColor">?</text></svg>`;
  const pos = { 1: [[30, 30]], 2: [[18, 30], [42, 30]], 3: [[30, 16], [17, 42], [43, 42]] }[c.count];
  const s = c.count === 1 ? 26 : 18;
  return `<svg viewBox="0 0 60 60" class="mcell" aria-label="${c.count} ${c.shape} ${c.fill}">${pos.map(([x, y]) => shapeSVG(c.shape, x, y, s, c.fill)).join('')}</svg>`;
}

const RULES = {
  const: { f: (p) => () => p[0], txt: (name, vals) => `${name} : toujours « ${vals[0]} ».` },
  row: { f: (p) => (r) => p[r], txt: (name) => `${name} : identique dans chaque ligne, change d’une ligne à l’autre.` },
  col: { f: (p) => (r, c) => p[c], txt: (name) => `${name} : identique dans chaque colonne (change de gauche à droite).` },
  latin: { f: (p) => (r, c) => p[(r + c) % 3], txt: (name) => `${name} : chaque valeur apparaît une seule fois par ligne et par colonne.` },
  latin2: { f: (p) => (r, c) => p[(c - r + 3) % 3], txt: (name) => `${name} : chaque valeur apparaît une seule fois par ligne et par colonne.` },
};

register({
  id: 'psy.matrices',
  module: M,
  group: 'Suites logiques',
  title: 'Matrices',
  desc: 'Compléter un tableau 3×3 de figures (forme, nombre, remplissage).',
  make(level, r) {
    const pools = {
      1: [['col', 'const', 'const'], ['row', 'const', 'const'], ['const', 'col', 'const'], ['const', 'const', 'latin']],
      2: [['latin', 'col', 'const'], ['row', 'latin', 'const'], ['col', 'const', 'latin'], ['latin', 'const', 'row']],
      3: [['latin', 'latin2', 'col'], ['latin', 'col', 'latin2'], ['row', 'latin', 'latin2'], ['latin2', 'latin', 'latin']],
    };
    const [rs, rc, rf] = r.pick(pools[level]);
    const ps = r.shuffle(SHAPES), pc = r.shuffle([1, 2, 3]), pf = r.shuffle(FILLS);
    const fs = RULES[rs].f(ps), fc = RULES[rc].f(pc), ff = RULES[rf].f(pf);
    const grid = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.push({ shape: fs(i, j), count: fc(i, j), fill: ff(i, j) });
    const ans = grid[8];
    const other = (arr, v) => arr.filter((x) => x !== v);
    const cand = [
      { ...ans, shape: r.pick(other(SHAPES, ans.shape)) },
      { ...ans, count: r.pick(other([1, 2, 3], ans.count)) },
      { ...ans, fill: r.pick(other(FILLS, ans.fill)) },
      { ...ans, shape: r.pick(other(SHAPES, ans.shape)), fill: r.pick(other(FILLS, ans.fill)) },
      { ...ans, count: r.pick(other([1, 2, 3], ans.count)), shape: r.pick(other(SHAPES, ans.shape)) },
    ];
    const key = (c) => `${c.shape}${c.count}${c.fill}`;
    const { choices, answer } = buildChoices(r, ans, r.shuffle(cand), 5, key);
    const lines = [RULES[rs].txt('Forme', ps), RULES[rc].txt('Nombre', pc), RULES[rf].txt('Remplissage', pf)];
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: 'Quelle case complète la matrice ?',
      visual: `<div class="matrix">${grid.map((c, i) => (i === 8 ? cellSVG(c, true) : cellSVG(c))).join('')}</div>`,
      choices: choices.map((c) => cellSVG(c)),
      answer,
      explain: `<ul>${lines.map((l) => `<li>${l}</li>`).join('')}</ul><p>La case manquante contient donc <b>${ans.count} ${ans.shape}${ans.count > 1 ? 's' : ''} ${ans.fill === 'vide' ? 'vide' + (ans.count > 1 ? 's' : '') : ans.fill === 'gris' ? 'gris' : 'noir' + (ans.count > 1 ? 's' : '')}</b>.</p><p class="tip">Méthode : analyse les attributs <b>un par un</b> (forme, puis nombre, puis remplissage) en lisant les lignes, puis les colonnes.</p>`,
      timeLimit: 60,
    };
  },
});
