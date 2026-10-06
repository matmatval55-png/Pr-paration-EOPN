// Attention / concentration : barrage, comptage, vitesse de codage.
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';
import { esc } from '../core/ui.js';

const M = 'psycho';

/* ---------- Barrage : toucher toutes les cibles ---------- */
const SETS = [
  ['b', 'd', 'p', 'q'],
  ['O', 'Q', 'C', 'G'],
  ['6', '9', 'G', 'C'],
  ['▲', '▼', '◀', '▶'],
  ['M', 'N', 'W', 'V'],
];

register({
  id: 'psy.barrage',
  module: M,
  group: 'Attention',
  title: 'Barrage',
  desc: 'Toucher le plus vite possible tous les symboles cibles d’une grille.',
  make(level, r) {
    const set = r.pick(SETS);
    const targets = level === 3 ? r.sample(set, 2) : [r.pick(set)];
    const cols = 8, rows = level === 1 ? 7 : level === 2 ? 9 : 10;
    const total = cols * rows;
    const nTarget = Math.round(total * 0.22);
    const cells = r.shuffle([
      ...Array.from({ length: nTarget }, () => r.pick(targets)),
      ...Array.from({ length: total - nTarget }, () => r.pick(set.filter((s) => !targets.includes(s)))),
    ]);
    const time = level === 1 ? 40 : level === 2 ? 45 : 50;
    const tg = targets.map((t) => `<b class="sym">${esc(t)}</b>`).join(' et ');
    return {
      kind: 'custom',
      prompt: `Touche <b>tous</b> les ${tg} (et seulement eux) avant la fin du temps, puis appuie sur « Terminé ».`,
      timeLimit: time + 2,
      explain: `<p>Le score = cibles trouvées − erreurs, rapporté au nombre de cibles. La réponse est comptée juste si tu obtiens au moins <b>80 %</b>.</p><p class="tip">Méthode : balaye la grille <b>ligne par ligne</b> dans le même sens (comme pour lire), sans revenir en arrière. Les symboles miroirs (b/d, p/q) sont des pièges classiques : fixe-toi un repère (« la panse du b est à droite »).</p>`,
      mount(area, finish) {
        const grid = document.createElement('div');
        grid.className = 'barrage';
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        const state = cells.map(() => false);
        cells.forEach((c, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = c;
          b.onclick = () => {
            state[i] = !state[i];
            b.classList.toggle('on', state[i]);
          };
          grid.append(b);
        });
        const done = document.createElement('button');
        done.className = 'btn primary block';
        done.textContent = 'Terminé';
        area.append(grid, done);
        let over = false;
        const end = () => {
          if (over) return;
          over = true;
          let hit = 0, fa = 0, miss = 0;
          [...grid.children].forEach((b, i) => {
            const isT = targets.includes(cells[i]);
            b.disabled = true;
            if (isT && state[i]) hit++, b.classList.add('hit');
            else if (isT) miss++, b.classList.add('miss');
            else if (state[i]) fa++, b.classList.add('fa');
          });
          const score = Math.max(0, (hit - fa) / nTarget);
          done.remove();
          finish({
            ok: score >= 0.8,
            explainExtra: `<p>Cibles trouvées : <b>${hit}/${nTarget}</b> · oubliées : <b>${miss}</b> (en orange) · erreurs : <b>${fa}</b> (en rouge). Score : <b>${Math.round(score * 100)} %</b>.</p>`,
          });
        };
        done.onclick = end;
        const t = setTimeout(end, time * 1000);
        return () => clearTimeout(t);
      },
    };
  },
});

/* ---------- Comptage ---------- */
register({
  id: 'psy.comptage',
  module: M,
  group: 'Attention',
  title: 'Comptage',
  desc: 'Compter les occurrences d’un symbole dans une série.',
  make(level, r) {
    const alpha = level === 1 ? 'ABCDEFGH' : level === 2 ? 'bdpqoceg' : 'MNWVXYKZ';
    const target = r.pick(alpha.split(''));
    const len = level === 1 ? 24 : level === 2 ? 36 : 48;
    const s = Array.from({ length: len }, () => (r.bool(0.18) ? target : r.pick(alpha.split(''))));
    const count = s.filter((c) => c === target).length;
    const groups = [];
    for (let i = 0; i < s.length; i += 6) groups.push(s.slice(i, i + 6).join(''));
    const { choices, answer } = buildChoices(r, count, r.shuffle([count - 1, count + 1, count - 2, count + 2]), 4);
    const counts = groups.map((g) => g.split('').filter((c) => c === target).length);
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: `Combien de fois la lettre <b class="sym">${target}</b> apparaît-elle ?`,
      visual: `<div class="count-str">${groups.map((g) => `<span>${esc(g)}</span>`).join(' ')}</div>`,
      choices: choices.map(String),
      answer,
      explain: `<p>Par groupe de 6 : ${counts.join(' + ')} = <b>${count}</b>.</p><p class="tip">Méthode : compte groupe par groupe et additionne au fur et à mesure, plutôt que de tout parcourir d’un coup (on perd le fil).</p>`,
      timeLimit: level === 1 ? 30 : level === 2 ? 40 : 50,
    };
  },
});

/* ---------- Vitesse de codage ---------- */
const SYMBOLS = ['★', '◆', '●', '▲', '■', '♥', '✚', '☾', '♣', '⬟'];

register({
  id: 'psy.codage',
  module: M,
  group: 'Attention',
  title: 'Vitesse de codage',
  desc: 'Traduire une série de symboles grâce à une table de code.',
  make(level, r) {
    const size = level === 1 ? 5 : level === 2 ? 7 : 9;
    const syms = r.sample(SYMBOLS, size);
    const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, size);
    const len = level === 1 ? 4 : level === 2 ? 5 : 6;
    const seqIdx = Array.from({ length: len }, () => r.int(0, size - 1));
    const code = seqIdx.map((i) => digits[i]).join('');
    const alt = () => {
      const a = code.split('');
      const p = r.int(0, a.length - 1);
      a[p] = String(r.pick(digits.filter((d) => String(d) !== a[p])));
      return a.join('');
    };
    const swap = () => {
      const a = code.split('');
      const p = r.int(0, a.length - 2);
      [a[p], a[p + 1]] = [a[p + 1], a[p]];
      return a.join('');
    };
    const { choices, answer } = buildChoices(r, code, [alt(), swap(), alt(), alt(), swap()], 4);
    return {
      kind: 'mcq',
      prompt: 'Quel code correspond à la série de symboles ?',
      visual: `<table class="codetab"><tr>${syms.map((s) => `<td>${s}</td>`).join('')}</tr><tr>${digits.map((d) => `<td>${d}</td>`).join('')}</tr></table>
        <div class="seq">${seqIdx.map((i) => `<span>${syms[i]}</span>`).join('')}</div>`,
      choices,
      answer,
      explain: `<p>${seqIdx.map((i) => `${syms[i]} → ${digits[i]}`).join(' · ')}</p><p>Code : <b>${code}</b>.</p><p class="tip">Les mauvaises réponses diffèrent souvent d’un seul chiffre ou de deux chiffres inversés : vérifie le début et la fin.</p>`,
      timeLimit: level === 1 ? 20 : level === 2 ? 25 : 30,
    };
  },
});
