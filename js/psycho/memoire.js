// Mémoire : empan de chiffres (endroit / envers), séquences spatiales, images.
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';

const M = 'psycho';

register({
  id: 'psy.memoire-chiffres',
  module: M,
  group: 'Mémoire',
  title: 'Mémoire des chiffres',
  desc: 'Retenir une série de chiffres (à l’endroit ou à l’envers).',
  make(level, r) {
    const len = { 1: r.int(5, 6), 2: r.int(7, 8), 3: r.int(8, 9) }[level];
    const backwards = level >= 2 && r.bool(level === 3 ? 0.6 : 0.35);
    const ds = Array.from({ length: len }, () => r.int(0, 9));
    const expected = (backwards ? [...ds].reverse() : ds).join('');
    return {
      kind: 'num',
      allowFrac: false,
      allowNeg: false,
      pre: {
        label: `Mémorise ces ${len} chiffres${backwards ? ' — tu devras les redonner <b>à l’envers</b>' : ''} :`,
        html: `<div class="digits">${ds.join(' ')}</div>`,
        ms: 600 * len + 1000,
      },
      prompt: backwards ? 'Tape la série <b>à l’envers</b> (du dernier au premier chiffre).' : 'Tape la série dans l’ordre.',
      answer: expected,
      answerText: expected,
      accept: (t) => t.replace(/\D/g, '') === expected,
      explain: `<p>Série montrée : <b>${ds.join(' ')}</b>${backwards ? ` → à l’envers : <b>${expected.split('').join(' ')}</b>` : ''}.</p><p class="tip">Méthode : regroupe par paquets de 2 ou 3 (« 47 – 18 – 29 ») et répète-les mentalement. Pour l’envers, visualise les paquets puis lis-les de droite à gauche.</p>`,
      timeLimit: 25,
    };
  },
});

register({
  id: 'psy.memoire-sequence',
  module: M,
  group: 'Mémoire',
  title: 'Séquences spatiales',
  desc: 'Reproduire l’ordre d’allumage de cases (type « Simon »).',
  make(level, r) {
    const size = level === 3 ? 4 : 3;
    const len = { 1: 4, 2: 5, 3: 6 }[level] + r.int(0, 1);
    const seq = [];
    while (seq.length < len) {
      const c = r.int(0, size * size - 1);
      if (c !== seq[seq.length - 1]) seq.push(c);
    }
    return {
      kind: 'custom',
      prompt: 'Regarde l’ordre dans lequel les cases s’allument, puis touche-les dans le même ordre.',
      explain: `<p>Séquence : ${seq.map((c) => `case ${Math.floor(c / size) + 1}-${(c % size) + 1}`).join(' → ')} (ligne-colonne).</p><p class="tip">Méthode : donne un nom ou un chiffre à chaque case et récite la séquence (« haut-gauche, centre, bas… »), ou mémorise le « dessin » formé par le trajet.</p>`,
      mount(area, finish) {
        const grid = document.createElement('div');
        grid.className = 'simon';
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        const btns = [];
        for (let i = 0; i < size * size; i++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.disabled = true;
          grid.append(b);
          btns.push(b);
        }
        const info = document.createElement('p');
        info.className = 'center muted';
        info.textContent = 'Observe…';
        area.append(grid, info);
        const timers = [];
        seq.forEach((c, i) => {
          timers.push(setTimeout(() => btns[c].classList.add('lit'), 700 + i * 750));
          timers.push(setTimeout(() => btns[c].classList.remove('lit'), 700 + i * 750 + 500));
        });
        timers.push(
          setTimeout(() => {
            info.textContent = 'À toi ! (0/' + len + ')';
            btns.forEach((b) => (b.disabled = false));
          }, 700 + len * 750),
        );
        const given = [];
        btns.forEach((b, i) =>
          (b.onclick = () => {
            given.push(i);
            b.classList.add('lit');
            setTimeout(() => b.classList.remove('lit'), 180);
            info.textContent = `À toi ! (${given.length}/${len})`;
            const pos = given.length - 1;
            if (given[pos] !== seq[pos] || given.length === len) {
              btns.forEach((x) => (x.disabled = true));
              const ok = given[pos] === seq[pos];
              if (!ok) {
                btns[i].classList.add('fa');
                btns[seq[pos]].classList.add('miss');
              }
              finish({ ok, explainExtra: ok ? '' : `<p>Erreur au ${pos + 1}<sup>e</sup> appui (en rouge ton choix, en orange la bonne case).</p>` });
            }
          }),
        );
        return () => timers.forEach(clearTimeout);
      },
    };
  },
});

const ICONS = ['✈️', '🚁', '🚀', '⚓', '🛰️', '🧭', '⛽', '🎯', '🔧', '📡', '⭐', '🌙', '☀️', '⚡', '🔑', '🏁', '🛡️', '🗺️', '⏱️', '🔔'];

register({
  id: 'psy.memoire-images',
  module: M,
  group: 'Mémoire',
  title: 'Mémoire visuelle',
  desc: 'Retenir des images et leur position.',
  make(level, r) {
    const nb = { 1: 4, 2: 6, 3: 9 }[level];
    const cols = nb === 4 ? 2 : 3;
    const icons = r.sample(ICONS, nb);
    const grid = (arr, hl = -1) =>
      `<div class="imgrid" style="grid-template-columns:repeat(${cols},1fr)">${arr
        .map((x, i) => `<span class="${i === hl ? 'hl' : ''}">${x ?? (i === hl ? '?' : '')}</span>`)
        .join('')}</div>`;
    const variant = level === 1 ? 'absent' : r.pick(['absent', 'position']);
    const pre = { label: 'Mémorise les images et leur place :', html: grid(icons), ms: { 1: 4000, 2: 5000, 3: 7000 }[level] };
    if (variant === 'absent') {
      const absent = r.pick(ICONS.filter((x) => !icons.includes(x)));
      const shown = r.sample(icons, 3);
      const { choices, answer } = buildChoices(r, absent, shown, 4);
      return {
        kind: 'mcq',
        layout: 'row big',
        pre,
        prompt: 'Laquelle de ces images <b>n’était pas</b> présente ?',
        choices,
        answer,
        explain: `<p>Les images présentes étaient : ${icons.join(' ')}</p>${grid(icons)}<p class="tip">Astuce : nomme chaque image à voix basse en la regardant ; la mémoire verbale renforce la mémoire visuelle.</p>`,
      };
    }
    const p = r.int(0, nb - 1);
    const { choices, answer } = buildChoices(r, icons[p], r.shuffle(icons.filter((_, i) => i !== p)), 4);
    return {
      kind: 'mcq',
      layout: 'row big',
      pre,
      prompt: `Quelle image se trouvait dans la case marquée « ? » ?<div class="q-visual">${grid(Array(nb).fill(null), p)}</div>`,
      choices,
      answer,
      explain: `<p>La grille était :</p>${grid(icons, p)}<p class="tip">Astuce : mémorise ligne par ligne en inventant une petite histoire (« l’avion vole vers la lune… »).</p>`,
    };
  },
});
