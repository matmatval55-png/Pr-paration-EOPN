// Raisonnement spatial : rotations de figures, patrons de cubes.
import { register } from '../core/registry.js';

const M = 'psycho';

/* ---------- Figures planes (polyominos) ---------- */

const norm = (cells) => {
  const mx = Math.min(...cells.map((c) => c[0]));
  const my = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};
const keyOf = (cells) => norm(cells).map((c) => c.join(',')).join(';');
// Rotation de 90° dans le sens horaire (axe y vers le bas, comme à l'écran).
const rot = (cells) => cells.map(([x, y]) => [-y, x]);
const rotN = (cells, k) => {
  let c = cells;
  for (let i = 0; i < ((k % 4) + 4) % 4; i++) c = rot(c);
  return norm(c);
};
const mirror = (cells) => norm(cells.map(([x, y]) => [-x, y]));

function randomPoly(r, size) {
  for (;;) {
    const cells = [[0, 0]];
    const has = (x, y) => cells.some((c) => c[0] === x && c[1] === y);
    while (cells.length < size) {
      const [x, y] = r.pick(cells);
      const [dx, dy] = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      if (!has(x + dx, y + dy)) cells.push([x + dx, y + dy]);
    }
    const n = norm(cells);
    const w = Math.max(...n.map((c) => c[0])) + 1;
    const h = Math.max(...n.map((c) => c[1])) + 1;
    if (w > 4 || h > 4) continue;
    // la figure doit être « chirale » : son miroir ne doit être égal à aucune de ses rotations
    const m = mirror(n);
    const rots = [0, 1, 2, 3].map((k) => keyOf(rotN(n, k)));
    if (rots.includes(keyOf(m))) continue;
    return n;
  }
}

export function polySVG(cells, accent = 0) {
  const s = 18;
  const w = Math.max(...cells.map((c) => c[0])) + 1;
  const h = Math.max(...cells.map((c) => c[1])) + 1;
  const size = 4 * s + 4;
  const ox = (size - w * s) / 2, oy = (size - h * s) / 2;
  return `<svg viewBox="0 0 ${size} ${size}" class="poly" width="${size}" height="${size}">${cells
    .map(
      ([x, y]) =>
        `<rect x="${ox + x * s}" y="${oy + y * s}" width="${s}" height="${s}" fill="var(--accent)" fill-opacity="${accent ? 0.9 : 0.55}" stroke="currentColor" stroke-width="1.5"/>`,
    )
    .join('')}</svg>`;
}

register({
  id: 'psy.rotations',
  module: M,
  group: 'Raisonnement spatial',
  title: 'Rotations de figures',
  desc: 'Reconnaître une figure tournée (et éviter les figures retournées).',
  make(level, r) {
    const size = { 1: 5, 2: 6, 3: 7 }[level];
    const base = randomPoly(r, size);
    const angles = level === 1 ? [1, 2, 3] : [1, 2, 3];
    const negative = level === 3 && r.bool(0.5);
    const deg = (k) => `${k * 90}°`;
    let items;
    if (!negative) {
      const k = r.pick(angles);
      const correct = { cells: rotN(base, k), ok: true, k };
      const used = new Set([keyOf(correct.cells)]);
      const wrong = [];
      for (const kk of r.shuffle([0, 1, 2, 3])) {
        const c = rotN(mirror(base), kk);
        if (!used.has(keyOf(c))) {
          used.add(keyOf(c));
          wrong.push({ cells: c, ok: false });
        }
        if (wrong.length === 3) break;
      }
      items = r.shuffle([correct, ...wrong]);
    } else {
      const ks = r.shuffle([0, 1, 2, 3]).slice(0, 3);
      const rights = ks.map((k) => ({ cells: rotN(base, k), ok: true, k }));
      const odd = { cells: rotN(mirror(base), r.int(0, 3)), ok: false, odd: true };
      items = r.shuffle([...rights, odd]);
    }
    const answer = negative ? items.findIndex((i) => i.odd) : items.findIndex((i) => i.ok);
    const L = 'ABCD';
    const detail = items
      .map((it, i) => (it.ok ? `<li><b>${L[i]}</b> : modèle tourné de ${deg(it.k)} dans le sens des aiguilles d’une montre${it.k === 0 ? ' (non tourné)' : ''}.</li>` : `<li><b>${L[i]}</b> : image <b>miroir</b> (figure retournée) – aucune rotation ne permet de l’obtenir.</li>`))
      .join('');
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: negative
        ? 'Trois figures sont le modèle <b>tourné</b>. Laquelle est <b>différente</b> (retournée) ?'
        : 'Quelle figure est le modèle <b>tourné</b> (sans le retourner) ?',
      visual: `<div class="model"><span class="small muted">Modèle</span>${polySVG(base, 1)}</div>`,
      choices: items.map((it) => polySVG(it.cells)),
      answer,
      explain: `<ul>${detail}</ul><p class="tip">Méthode : repère un détail asymétrique du modèle (un « bras » qui dépasse, un coin) et suis-le pendant la rotation. Si ce détail se retrouve du mauvais côté, la figure a été retournée comme dans un miroir.</p>`,
      timeLimit: level === 1 ? 40 : 30,
    };
  },
});

/* ---------- Patrons de cubes ---------- */

// Faces du cube (repère fixe) : 0 dessous, 1 dessus, 2 nord(+y), 3 sud(−y), 4 est(+x), 5 ouest(−x)
export const OPP = { 0: 1, 1: 0, 2: 3, 3: 2, 4: 5, 5: 4 };

// « Fait rouler » un cube sur le patron : la face posée sur chaque case reçoit son étiquette.
// Renvoie label[face] = indice de case, ou null si le patron ne se replie pas en cube.
export function foldNet(cells) {
  // On travaille sur le patron vu en miroir pour obtenir la face extérieure imprimée
  // (rouler un cube sur la feuille donne la face intérieure).
  const mc = cells.map(([x, y]) => [-x, y]);
  const idx = new Map(mc.map((c, i) => [c.join(','), i]));
  const label = {};
  const seen = new Set();
  const roll = {
    E: (s) => ({ ...s, B: s.E, E: s.T, T: s.W, W: s.B }),
    W: (s) => ({ ...s, B: s.W, W: s.T, T: s.E, E: s.B }),
    S: (s) => ({ ...s, B: s.S, S: s.T, T: s.N, N: s.B }),
    N: (s) => ({ ...s, B: s.N, N: s.T, T: s.S, S: s.B }),
  };
  const dirs = { E: [1, 0], W: [-1, 0], S: [0, 1], N: [0, -1] };
  const visit = (i, st) => {
    seen.add(i);
    if (label[st.B] != null) return false;
    label[st.B] = i;
    const [x, y] = mc[i];
    for (const [d, [dx, dy]] of Object.entries(dirs)) {
      const j = idx.get(`${x + dx},${y + dy}`);
      if (j != null && !seen.has(j)) if (visit(j, roll[d](st)) === false) return false;
    }
    return true;
  };
  const ok = visit(0, { B: 0, T: 1, N: 2, S: 3, E: 4, W: 5 });
  if (!ok || Object.keys(label).length !== 6) return null;
  return label;
}

function randomNet(r) {
  for (;;) {
    const cells = [[0, 0]];
    const has = (x, y) => cells.some((c) => c[0] === x && c[1] === y);
    while (cells.length < 6) {
      const [x, y] = r.pick(cells);
      const [dx, dy] = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      if (!has(x + dx, y + dy)) cells.push([x + dx, y + dy]);
    }
    const n = norm(cells);
    const w = Math.max(...n.map((c) => c[0])) + 1;
    const h = Math.max(...n.map((c) => c[1])) + 1;
    if (w > 5 || h > 4) continue;
    const label = foldNet(n);
    if (label) return { cells: n, label };
  }
}

// Toutes les vues valides (dessus, gauche, droite) d’un cube : 8 coins × 3 rotations.
export function validViews(label) {
  const out = [];
  for (const sx of [1, -1])
    for (const sy of [1, -1])
      for (const sz of [1, -1]) {
        const X = sx > 0 ? 4 : 5, Y = sy > 0 ? 2 : 3, Z = sz > 0 ? 1 : 0;
        const t = sx * sy * sz > 0 ? [X, Y, Z] : [X, Z, Y];
        for (let k = 0; k < 3; k++) out.push([t[k], t[(k + 1) % 3], t[(k + 2) % 3]].map((f) => label[f]));
      }
  return out;
}

const FACE_COLORS = ['#e4572e', '#29b6f6', '#ffc914', '#76b041', '#a259ff', '#f2f2f2'];
const FACE_TXT = ['#fff', '#002', '#220', '#fff', '#fff', '#111'];
const LET = 'ABCDEF';

function netSVG(cells) {
  const s = 30;
  const w = Math.max(...cells.map((c) => c[0])) + 1;
  const h = Math.max(...cells.map((c) => c[1])) + 1;
  return `<svg viewBox="-2 -2 ${w * s + 4} ${h * s + 4}" class="net" width="${w * s + 4}" height="${h * s + 4}">${cells
    .map(
      ([x, y], i) =>
        `<rect x="${x * s}" y="${y * s}" width="${s}" height="${s}" fill="${FACE_COLORS[i]}" stroke="currentColor" stroke-width="1.5"/><text x="${x * s + s / 2}" y="${y * s + s / 2 + 6}" text-anchor="middle" font-size="16" font-weight="700" fill="${FACE_TXT[i]}">${LET[i]}</text>`,
    )
    .join('')}</svg>`;
}

function cubeSVG([top, left, right]) {
  const face = (pts, i, cx, cy) =>
    `<polygon points="${pts}" fill="${FACE_COLORS[i]}" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><text x="${cx}" y="${cy}" text-anchor="middle" font-size="15" font-weight="700" fill="${FACE_TXT[i]}">${LET[i]}</text>`;
  return `<svg viewBox="0 0 80 84" class="cube" width="80" height="84">
    ${face('40,4 74,22 40,40 6,22', top, 40, 27)}
    ${face('6,22 40,40 40,80 6,62', left, 23, 57)}
    ${face('40,40 74,22 74,62 40,80', right, 57, 57)}
  </svg>`;
}

register({
  id: 'psy.cubes',
  module: M,
  group: 'Raisonnement spatial',
  title: 'Patrons de cubes',
  desc: 'Replier mentalement un patron et reconnaître le bon cube.',
  make(level, r) {
    const { cells, label } = randomNet(r);
    const pairs = [[0, 1], [2, 3], [4, 5]].map(([a, b]) => [label[a], label[b]].sort());
    const oppOf = (i) => {
      const p = pairs.find((pp) => pp.includes(i));
      return p[0] === i ? p[1] : p[0];
    };
    const pairTxt = pairs.map(([a, b]) => `${LET[a]}–${LET[b]}`).join(', ');
    const tipNet = `<p class="tip">Méthode : sur un patron, deux faces séparées par <b>une seule case</b> sur une même ligne (ou colonne) sont <b>opposées</b> : elles ne peuvent jamais être visibles en même temps. Ensuite, vérifie l’ordre des faces autour d’un coin : un cube « en miroir » a les bonnes faces mais dans le mauvais sens.</p>`;

    if (level === 1) {
      const f = r.int(0, 5);
      const ans = oppOf(f);
      const others = r.shuffle([0, 1, 2, 3, 4, 5].filter((x) => x !== f && x !== ans)).slice(0, 3);
      const choices = r.shuffle([ans, ...others]);
      return {
        kind: 'mcq',
        layout: 'row',
        prompt: `Une fois le patron replié en cube, quelle face est <b>opposée</b> à la face <b>${LET[f]}</b> ?`,
        visual: netSVG(cells),
        choices: choices.map((c) => `<b style="font-size:1.3em">${LET[c]}</b>`),
        answer: choices.indexOf(ans),
        explain: `<p>Faces opposées sur ce cube : <b>${pairTxt}</b>.</p><p>La face opposée à ${LET[f]} est donc <b>${LET[ans]}</b>.</p>${tipNet}`,
        timeLimit: 40,
      };
    }

    const valid = validViews(label);
    const vkey = (v) => v.join('');
    const validSet = new Set(valid.map(vkey));
    const correct = r.pick(valid);
    const wrongs = [];
    const used = new Set([vkey(correct)]);
    const push = (v, why) => {
      if (!validSet.has(vkey(v)) && !used.has(vkey(v))) {
        used.add(vkey(v));
        wrongs.push({ v, why });
      }
    };
    const nMirror = level === 3 ? 3 : 1;
    for (const v of r.shuffle(valid)) {
      if (wrongs.length >= nMirror) break;
      push([v[0], v[2], v[1]], 'mirror');
    }
    let guard = 0;
    while (wrongs.length < 3 && guard++ < 100) {
      const a = r.int(0, 5);
      const b = oppOf(a);
      const c = r.pick([0, 1, 2, 3, 4, 5].filter((x) => x !== a && x !== b));
      push(r.shuffle([a, b, c]), 'opp');
    }
    const items = r.shuffle([{ v: correct, ok: true }, ...wrongs]);
    const L = 'ABCD';
    const detail = items
      .map((it, i) => {
        if (it.ok) return `<li>Cube <b>${i + 1}</b> : correct.</li>`;
        if (it.why === 'opp') {
          const [x, y] = it.v.filter((f) => it.v.includes(oppOf(f)));
          return `<li>Cube ${i + 1} : impossible, ${LET[x]} et ${LET[y]} sont opposées.</li>`;
        }
        return `<li>Cube ${i + 1} : bonnes faces mais disposées en miroir (ordre inversé autour du coin).</li>`;
      })
      .join('');
    void L;
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: 'Quel cube peut être obtenu en repliant ce patron (faces imprimées vers l’extérieur) ?',
      visual: netSVG(cells),
      choices: items.map((it, i) => `<span class="cube-n">${i + 1}</span>${cubeSVG(it.v)}`),
      answer: items.findIndex((it) => it.ok),
      explain: `<p>Faces opposées : <b>${pairTxt}</b>.</p><ul>${detail}</ul>${tipNet}<p class="small muted">L’orientation des lettres n’a pas d’importance ici, seules les couleurs/lettres des faces comptent.</p>`,
      timeLimit: level === 2 ? 60 : 50,
    };
  },
});
