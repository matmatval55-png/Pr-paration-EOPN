// Générateur de programme hebdomadaire (logique pure, testable).
// Entrées : date de sélection, heures/semaine, jours disponibles, modules faibles.

export const MODS = {
  psycho: { label: 'Psychotechniques', ico: '🧠' },
  maths: { label: 'Maths', ico: '📐' },
  anglais: { label: 'Anglais', ico: '🇬🇧' },
  physique: { label: 'Physique', ico: '⚛️' },
  culture: { label: 'Culture & BIA', ico: '✈️' },
  entretien: { label: 'Entretien', ico: '🎤' },
  revision: { label: 'Révisions', ico: '🔁' },
};

// Répartition (%) selon la phase. Le sport est planifié à part (3 séances / semaine).
export const PHASES = [
  { id: 'fond', min: 26, title: 'Fondations', desc: 'Reconstruire les bases (maths, anglais) et découvrir tous les types de tests.', w: { maths: 28, psycho: 24, anglais: 20, physique: 10, culture: 10, entretien: 3, revision: 5 } },
  { id: 'conso', min: 8, title: 'Consolidation', desc: 'Augmenter le volume de psychotechniques, chronométrer, préparer l’entretien.', w: { psycho: 30, maths: 15, anglais: 20, physique: 10, culture: 10, entretien: 10, revision: 5 } },
  { id: 'final', min: 0, title: 'Sprint final', desc: 'Examens blancs, révisions ciblées, simulations d’entretien. On ne commence plus de nouveau chapitre.', w: { psycho: 32, anglais: 15, maths: 8, physique: 5, culture: 10, entretien: 20, revision: 10 } },
];

export function weeksUntil(dateStr, now = new Date()) {
  if (!dateStr) return null;
  return Math.floor((new Date(dateStr + 'T00:00:00') - now) / (7 * 86400000));
}

export function phaseFor(weeks) {
  if (weeks == null) return PHASES[0];
  return PHASES.find((p) => weeks >= p.min) || PHASES[PHASES.length - 1];
}

// Répartit `blocks` créneaux de 30 min selon les poids (méthode du plus fort reste).
export function allocate(weights, blocks) {
  const tot = Object.values(weights).reduce((a, b) => a + b, 0);
  const raw = Object.entries(weights).map(([k, w]) => [k, (w / tot) * blocks]);
  const out = Object.fromEntries(raw.map(([k, v]) => [k, Math.floor(v)]));
  let left = blocks - Object.values(out).reduce((a, b) => a + b, 0);
  raw.sort((a, b) => (b[1] % 1) - (a[1] % 1));
  for (let i = 0; left > 0; i = (i + 1) % raw.length, left--) out[raw[i][0]]++;
  return out;
}

/**
 * opts : { hours, days: [0..6] (0 = lundi), weeks, weak: ['maths', …] }
 * Renvoie { phase, perDay: [[{ mod, min }], … 7 jours], alloc, sport: [indices de jours] }
 */
export function buildWeek({ hours = 6, days = [0, 1, 2, 3, 4, 5, 6], weeks = null, weak = [] }) {
  const phase = phaseFor(weeks);
  const w = { ...phase.w };
  for (const m of weak) if (w[m] != null) w[m] += 6; // renfort des points faibles
  const blocks = Math.max(1, Math.round((hours * 60) / 30));
  const alloc = allocate(w, blocks);
  // file de créneaux : on alterne les modules pour varier chaque jour
  const queue = [];
  const counts = { ...alloc };
  while (queue.length < blocks) {
    for (const k of Object.keys(counts).sort((a, b) => counts[b] - counts[a])) {
      if (counts[k] > 0) {
        queue.push(k);
        counts[k]--;
      }
    }
  }
  const d = days.length ? [...days].sort((a, b) => a - b) : [0, 1, 2, 3, 4, 5, 6];
  const perDay = Array.from({ length: 7 }, () => []);
  queue.forEach((mod, i) => {
    const day = d[i % d.length];
    const same = perDay[day].find((s) => s.mod === mod);
    if (same) same.min += 30;
    else perDay[day].push({ mod, min: 30 });
  });
  // sport : 3 séances réparties sur la semaine (lun / mer / sam par défaut, sinon jours disponibles)
  const pref = [0, 2, 5];
  const sport = pref.map((p) => (d.includes(p) ? p : d[(pref.indexOf(p) * Math.ceil(d.length / 3)) % d.length]));
  return { phase, perDay, alloc, sport: [...new Set(sport)] };
}
