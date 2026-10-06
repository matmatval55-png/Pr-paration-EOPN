// Calcul mental rapide et problèmes arithmétiques (type « raisonnement arithmétique »).
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';
import { n } from '../core/fmt.js';

const M = 'psycho';

const mental = {
  1: [
    (r) => {
      const a = r.int(12, 89), b = r.int(12, 89);
      const u = (a % 10) + (b % 10);
      return { q: `${a} + ${b}`, a: a + b, ex: `Dizaines : ${a - (a % 10)} + ${b - (b % 10)} = ${a - (a % 10) + b - (b % 10)} ; unités : ${a % 10} + ${b % 10} = ${u} ; total ${a + b}.` };
    },
    (r) => {
      const a = r.int(40, 99), b = r.int(11, a - 5);
      return { q: `${a} − ${b}`, a: a - b, ex: `Astuce : ${a} − ${b} = ${a} − ${b - (b % 10)} − ${b % 10} = ${a - (b - (b % 10))} − ${b % 10} = ${a - b}.` };
    },
    (r) => {
      const a = r.int(3, 12), b = r.int(3, 12);
      return { q: `${a} × ${b}`, a: a * b, ex: `Table de ${a} : ${a} × ${b} = ${a * b}. Les tables jusqu’à 12 doivent être automatiques.` };
    },
    (r) => {
      const b = r.int(3, 12), c = r.int(3, 12);
      return { q: `${b * c} ÷ ${b}`, a: c, ex: `On cherche combien de fois ${b} dans ${b * c} : ${b} × ${c} = ${b * c}, donc ${c}.` };
    },
  ],
  2: [
    (r) => {
      const a = r.int(13, 99), b = r.int(3, 9);
      const d = a - (a % 10);
      return { q: `${a} × ${b}`, a: a * b, ex: `${a} × ${b} = ${d} × ${b} + ${a % 10} × ${b} = ${d * b} + ${(a % 10) * b} = ${a * b}.` };
    },
    (r) => {
      const a = r.int(120, 899), b = r.int(105, 499);
      return { q: `${a} + ${b}`, a: a + b, ex: `Centaines, puis dizaines, puis unités : ${a} + ${b} = ${a + b}.` };
    },
    (r) => {
      const p = r.pick([10, 20, 25, 50, 5, 15, 30, 75]), b = r.pick([40, 60, 80, 120, 160, 200, 240, 300, 360, 480]);
      const res = (p * b) / 100;
      return { q: `${p} % de ${b}`, a: res, ex: `${p} % = ${p}/100. 10 % de ${b} = ${b / 10}${p === 10 ? '' : ` ; donc ${p} % = ${n(b / 10)} × ${n(p / 10)} = ${n(res)}`}.` };
    },
    (r) => {
      const a = r.int(2, 9) + r.int(1, 9) / 10, k = r.pick([10, 100, 1000]);
      return { q: `${n(a)} × ${k}`, a: a * k, ex: `Multiplier par ${k} : la virgule se décale de ${String(k).length - 1} rang(s) vers la droite → ${n(a * k)}.` };
    },
    (r) => {
      const h = r.int(1, 4), m = r.pick([15, 20, 30, 45, 10, 40]);
      return { q: `${h} h ${m} min = ? min`, a: h * 60 + m, ex: `${h} h = ${h * 60} min ; ${h * 60} + ${m} = ${h * 60 + m} min.` };
    },
  ],
  3: [
    (r) => {
      const a = r.int(12, 49), b = r.int(11, 29);
      const d = b - (b % 10);
      return { q: `${a} × ${b}`, a: a * b, ex: `${a} × ${b} = ${a} × ${d} + ${a} × ${b % 10} = ${a * d} + ${a * (b % 10)} = ${a * b}.` };
    },
    (r) => {
      const a = r.int(11, 25);
      return { q: `${a}²`, a: a * a, ex: `${a}² = ${a} × ${a} = ${a * a}. À connaître par cœur : les carrés jusqu’à 25.` };
    },
    (r) => {
      const d = r.pick([3, 4, 5, 6, 8]), num = r.int(1, d - 1), b = d * r.int(4, 30);
      return { q: `${num}/${d} de ${b}`, a: (num * b) / d, ex: `${b} ÷ ${d} = ${b / d}, puis × ${num} = ${(num * b) / d}.` };
    },
    (r) => {
      const a = r.int(150, 990), b = r.int(160, a);
      return { q: `${a} − ${b}`, a: a - b, ex: `Complément : de ${b} à ${Math.ceil(b / 100) * 100} il y a ${Math.ceil(b / 100) * 100 - b}, puis jusqu’à ${a} : ${a - Math.ceil(b / 100) * 100}. Total ${a - b}.` };
    },
    (r) => {
      const a = r.pick([0.5, 0.25, 1.5, 2.5, 0.2, 0.75]), b = r.pick([12, 16, 24, 36, 40, 48, 64, 80]);
      return { q: `${n(a)} × ${b}`, a: a * b, ex: `${n(a)} × ${b} : ${a === 0.5 ? 'c’est la moitié' : a === 0.25 ? 'c’est le quart' : a === 0.75 ? 'trois quarts' : a === 0.2 ? 'un cinquième' : 'on décompose'} → ${n(a * b)}.` };
    },
    (r) => {
      const b = r.int(12, 25), c = r.int(4, 15);
      return { q: `${b * c} ÷ ${b}`, a: c, ex: `Estime d’abord : ${b} × 10 = ${b * 10}, donc le résultat est ${c >= 10 ? 'supérieur ou égal à' : 'inférieur à'} 10. Puis vérifie : ${b} × ${c} = ${b * c} → réponse ${c}.` };
    },
  ],
};

register({
  id: 'psy.calcul',
  module: M,
  group: 'Calcul',
  title: 'Calcul mental',
  desc: 'Opérations rapides avec le pavé numérique.',
  make(level, r) {
    const t = r.pick(mental[level])(r);
    return {
      kind: 'num',
      prompt: `<div class="big-calc">${t.q} = ?</div>`,
      answer: t.a,
      explain: `<p>${t.ex}</p>`,
      timeLimit: level === 1 ? 12 : level === 2 ? 18 : 25,
    };
  },
});

/* ---------- Problèmes arithmétiques ---------- */

const hhmm = (min) => {
  min = ((min % 1440) + 1440) % 1440;
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`;
};

const problems = [
  // vitesse-distance-temps
  (r) => {
    const v = r.pick([120, 180, 240, 300, 360, 420, 480]);
    const t = r.pick([15, 20, 30, 40, 45, 90, 75, 150]);
    const d = (v * t) / 60;
    const { choices, answer } = buildChoices(r, d, r.shuffle([v * t / 100, d * 2, d / 2, d + v / 4, v]), 4);
    return {
      prompt: `Un avion vole à ${v} km/h. Quelle distance parcourt-il en ${t} minutes ?`,
      choices: choices.map((c) => n(c) + ' km'),
      answer,
      explain: `<p>Distance = vitesse × temps, avec le temps en <b>heures</b> : ${t} min = ${t}/60 h.</p><p>${v} km/h = ${n(v / 60)} km par minute → ${n(v / 60)} × ${t} = <b>${n(d)} km</b>.</p><p class="tip">Réflexe pilote : convertis la vitesse « par minute » (${v} km/h = ${n(v / 60)} km/min).</p>`,
    };
  },
  (r) => {
    const v = r.pick([120, 150, 180, 240, 300, 360]);
    const d = v * r.pick([0.5, 1.5, 2, 2.5, 0.75, 1.25]);
    const t = (d / v) * 60;
    const { choices, answer } = buildChoices(r, t, r.shuffle([t + 15, t - 10, t * 2, (d / v) * 100, t + 30]), 4);
    return {
      prompt: `Quelle durée faut-il pour parcourir ${n(d)} km à ${v} km/h ?`,
      choices: choices.map((c) => hhmm(c).replace(/^0 h /, '') + (c < 60 ? ' min' : '')),
      answer,
      explain: `<p>Temps = distance ÷ vitesse = ${n(d)} ÷ ${v} = ${n(d / v)} h.</p><p>${n(d / v)} h = ${n(t)} min = <b>${hhmm(t)}</b>.</p><p class="tip">Attention : 1,5 h = 1 h 30 (et non 1 h 50) car 0,5 h = 30 min.</p>`,
    };
  },
  // heure d'arrivée
  (r) => {
    const dep = r.int(6, 20) * 60 + r.pick([0, 10, 15, 25, 35, 40, 45, 50]);
    const dur = r.int(1, 4) * 60 + r.pick([10, 20, 35, 40, 50, 55]);
    const arr = dep + dur;
    const { choices, answer } = buildChoices(r, hhmm(arr), r.shuffle([hhmm(arr + 40), hhmm(arr - 60), hhmm(arr + 60), hhmm(dep + dur - 40), hhmm(arr - 20)]), 4);
    return {
      prompt: `Décollage à ${hhmm(dep)}, durée de vol ${hhmm(dur)}. À quelle heure atterrit l’avion ?`,
      choices,
      answer,
      explain: `<p>On ajoute les heures puis les minutes : ${hhmm(dep)} + ${Math.floor(dur / 60)} h = ${hhmm(dep + Math.floor(dur / 60) * 60)}, puis + ${dur % 60} min = <b>${hhmm(arr)}</b>.</p><p class="tip">Si les minutes dépassent 60, on retire 60 et on ajoute 1 h.</p>`,
    };
  },
  // consommation carburant
  (r) => {
    const c = r.pick([30, 40, 45, 60, 80, 120]);
    const t = r.pick([30, 45, 90, 105, 135, 150]);
    const f = (c * t) / 60;
    const { choices, answer } = buildChoices(r, f, r.shuffle([(c * t) / 100, f + c / 2, f * 2, c + t / 60, f - c / 4]), 4);
    return {
      prompt: `Un avion consomme ${c} L/h. Combien consomme-t-il pour un vol de ${hhmm(t)} ?`,
      choices: choices.map((x) => n(x) + ' L'),
      answer,
      explain: `<p>${hhmm(t)} = ${n(t / 60)} h. Consommation = ${c} × ${n(t / 60)} = <b>${n(f)} L</b>.</p>`,
    };
  },
  // proportionnalité / prix
  (r) => {
    const q1 = r.pick([3, 4, 5, 6, 8]), p1 = q1 * r.pick([2, 3, 4, 5, 7, 12]);
    const q2 = r.pick([7, 9, 10, 12, 15].filter((x) => x !== q1));
    const p2 = (p1 / q1) * q2;
    const { choices, answer } = buildChoices(r, p2, r.shuffle([p1 + q2, p2 + p1 / q1, p2 - p1 / q1, p1 * q2]), 4);
    return {
      prompt: `${q1} pièces de rechange coûtent ${p1} €. Combien coûtent ${q2} pièces identiques ?`,
      choices: choices.map((x) => n(x) + ' €'),
      answer,
      explain: `<p>Prix d’une pièce : ${p1} ÷ ${q1} = ${n(p1 / q1)} €. Pour ${q2} pièces : ${n(p1 / q1)} × ${q2} = <b>${n(p2)} €</b>.</p><p class="tip">Méthode du « retour à l’unité » : cherche toujours la valeur pour 1.</p>`,
    };
  },
  // pourcentage d'évolution
  (r) => {
    const base = r.pick([200, 250, 400, 500, 800, 1200]);
    const p = r.pick([10, 20, 25, 15, 5, 30]);
    const up = r.bool();
    const res = base * (1 + (up ? p : -p) / 100);
    const { choices, answer } = buildChoices(r, res, r.shuffle([base * (1 + (up ? -p : p) / 100), base + p, res + base / 10, base * p / 100]), 4);
    return {
      prompt: `Un réservoir contient ${base} L. Son contenu ${up ? 'augmente' : 'diminue'} de ${p} %. Combien contient-il maintenant ?`,
      choices: choices.map((x) => n(x) + ' L'),
      answer,
      explain: `<p>${p} % de ${base} = ${n((base * p) / 100)} L. ${base} ${up ? '+' : '−'} ${n((base * p) / 100)} = <b>${n(res)} L</b>.</p><p class="tip">Plus rapide : multiplier par ${n(1 + (up ? p : -p) / 100)} (coefficient multiplicateur).</p>`,
    };
  },
  // travail en commun / débit
  (r) => {
    const a = r.pick([2, 3, 4, 6]), b = r.pick([3, 4, 6, 12].filter((x) => x !== a));
    const t = (a * b) / (a + b);
    const tm = Math.round(t * 60);
    const { choices, answer } = buildChoices(r, tm, r.shuffle([Math.round(((a + b) / 2) * 60), a * 60, Math.round((tm * 3) / 2), tm + 30]), 4);
    return {
      prompt: `Une pompe remplit une citerne en ${a} h, une seconde en ${b} h. Ensemble, combien de temps leur faut-il ?`,
      choices: choices.map((x) => hhmm(x)),
      answer,
      explain: `<p>En 1 h, la 1re remplit 1/${a} de la citerne, la 2e 1/${b}. Ensemble : 1/${a} + 1/${b} = ${a + b}/${a * b} par heure.</p><p>Durée = ${a * b}/${a + b} h ≈ ${n(t, 2)} h = <b>${hhmm(tm)}</b>.</p>`,
    };
  },
  // moyenne
  (r) => {
    const notes = Array.from({ length: 4 }, () => r.int(6, 18));
    const target = r.int(11, 14);
    const need = target * 5 - notes.reduce((a, b) => a + b, 0);
    if (need < 0 || need > 20) return problems[7](r);
    const { choices, answer } = buildChoices(r, need, r.shuffle([need + 2, need - 2, target, need + 5, need - 1]), 4);
    return {
      prompt: `Tes 4 premières notes sont ${notes.join(', ')}. Quelle 5e note te faut-il pour avoir exactement ${target} de moyenne ?`,
      choices: choices.map(String),
      answer,
      explain: `<p>Pour une moyenne de ${target} sur 5 notes, la somme doit valoir ${target} × 5 = ${target * 5}.</p><p>Somme actuelle : ${notes.join(' + ')} = ${notes.reduce((a, b) => a + b, 0)}. Il manque <b>${need}</b>.</p>`,
    };
  },
];

register({
  id: 'psy.problemes',
  module: M,
  group: 'Calcul',
  title: 'Problèmes arithmétiques',
  desc: 'Vitesses, durées, carburant, pourcentages… (épreuve confirmée à Tours).',
  make(level, r) {
    const pool = level === 1 ? [0, 2, 4, 5] : level === 2 ? [0, 1, 2, 3, 4, 5, 7] : [1, 3, 6, 7, 0, 5];
    const q = problems[r.pick(pool)](r);
    return { kind: 'mcq', timeLimit: level === 1 ? 75 : level === 2 ? 60 : 50, ...q };
  },
});
