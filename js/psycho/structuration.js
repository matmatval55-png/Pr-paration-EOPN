// Structuration d'informations (test cognitif navigant confirmé) : extraire vite la bonne
// information d'un tableau et croiser plusieurs critères ou règles.
// Niveau 1 : lecture directe. Niveau 2 : deux critères ou un calcul. Niveau 3 : règles d'affectation.
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';

const VILLES = ['Tours', 'Istres', 'Orléans', 'Évreux', 'Nancy', 'Cognac', 'Avord', 'Salon', 'Mont-de-Marsan', 'Saint-Dizier'];
const AVIONS = ['A400M', 'C-130J', 'Phénix', 'CASA 235', 'Falcon 2000'];
const NOMS = ['Martin', 'Bernard', 'Durand', 'Petit', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Michel', 'Garcia', 'Roux', 'Fournier'];
export const hm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}h${String(m % 60).padStart(2, '0')}`;
const dur = (m) => `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;

function vols(r, n = 6) {
  const codes = new Set();
  const out = [];
  while (out.length < n) {
    const code = `CT${r.int(100, 999)}`;
    if (codes.has(code)) continue;
    codes.add(code);
    const dep = r.pick(VILLES);
    let arr = r.pick(VILLES);
    while (arr === dep) arr = r.pick(VILLES);
    const h = r.int(6 * 12, 18 * 12) * 5;
    const d = r.int(8, 40) * 5;
    out.push({ code, dep, arr, h, d, fin: h + d, avion: r.pick(AVIONS) });
  }
  return out;
}

const tableVols = (v) => `<table class="tbl struct"><tr><th>Vol</th><th>Départ</th><th>Arrivée</th><th>Heure</th><th>Durée</th><th>Avion</th></tr>${v.map((x) => `<tr><td>${x.code}</td><td>${x.dep}</td><td>${x.arr}</td><td>${hm(x.h)}</td><td>${dur(x.d)}</td><td>${x.avion}</td></tr>`).join('')}</table>`;

// Questions possibles sur un tableau de vols ; chacune renvoie null si la réponse n'est pas unique.
function qVols(level, r, v) {
  const t = r.pick(v);
  const kinds = level === 1 ? ['arrivee', 'compte', 'avion'] : ['avant', 'plusLong', 'compte2', 'arrivee'];
  const k = r.pick(kinds);
  if (k === 'arrivee') {
    const c = hm(t.fin);
    return { prompt: `À quelle heure le vol <b>${t.code}</b> arrive-t-il à ${t.arr} ?`, correct: c, distract: [hm(t.h), hm(t.fin + 10), hm(t.fin - 10), hm(t.fin + 60), hm(t.h + 60)].filter((x) => x !== c), explain: `Le vol ${t.code} part à ${hm(t.h)} et dure ${dur(t.d)} : ${hm(t.h)} + ${dur(t.d)} = <b>${c}</b>.` };
  }
  if (k === 'avion') {
    const same = v.filter((x) => x.dep === t.dep && x.h === t.h);
    if (same.length !== 1) return null;
    return { prompt: `Quel avion assure le vol qui part de <b>${t.dep}</b> à <b>${hm(t.h)}</b> ?`, correct: t.avion, distract: AVIONS.filter((a) => a !== t.avion), explain: `Ligne « ${t.dep} · ${hm(t.h)} » : vol ${t.code}, avion <b>${t.avion}</b>.` };
  }
  if (k === 'compte' || k === 'compte2') {
    const lim = r.int(9, 15) * 60;
    const rows = k === 'compte' ? v.filter((x) => x.h >= lim) : v.filter((x) => x.h >= lim && x.d > 60);
    const n = rows.length;
    const txt = k === 'compte' ? `partent à ${hm(lim)} ou plus tard` : `partent à ${hm(lim)} ou plus tard <b>et</b> durent plus d’une heure`;
    return { prompt: `Combien de vols ${txt} ?`, correct: String(n), distract: [n - 2, n - 1, n + 1, n + 2].filter((x) => x >= 0 && x <= v.length).map(String), explain: `Vols concernés : ${rows.length ? rows.map((x) => `${x.code} (${hm(x.h)}${k === 'compte2' ? `, ${dur(x.d)}` : ''})`).join(', ') : 'aucun'} → <b>${n}</b>.` };
  }
  if (k === 'avant') {
    const lim = t.fin + r.int(1, 6) * 5;
    const rows = v.filter((x) => x.avion === t.avion && x.fin <= lim);
    if (rows.length !== 1) return null;
    return { prompt: `Quel vol en <b>${t.avion}</b> arrive au plus tard à <b>${hm(lim)}</b> ?`, correct: t.code, distract: v.filter((x) => x !== t).map((x) => x.code), explain: `Vols en ${t.avion} : ${v.filter((x) => x.avion === t.avion).map((x) => `${x.code} arrive à ${hm(x.fin)}`).join(' ; ')}. Seul <b>${t.code}</b> arrive avant ${hm(lim)}.` };
  }
  // vol le plus long
  const max = Math.max(...v.map((x) => x.d));
  const rows = v.filter((x) => x.d === max);
  if (rows.length !== 1) return null;
  return { prompt: 'Quel est le vol le plus long du tableau ?', correct: rows[0].code, distract: v.filter((x) => x !== rows[0]).map((x) => x.code), explain: `Durées : ${v.map((x) => `${x.code} ${dur(x.d)}`).join(', ')}. Le plus long : <b>${rows[0].code}</b>.` };
}

// Niveau 3 : affectation d'un équipage selon des règles.
function qAffectation(r) {
  const avion = r.pick(AVIONS);
  const duree = r.int(6, 50) * 5;
  const exigeHeures = duree > 180;
  const noms = r.sample(NOMS, 5);
  const pilotes = noms.map((nom) => ({ nom, qualif: r.sample(AVIONS, r.int(1, 3)), heures: r.int(2, 30) * 100, repos: r.int(6, 20) }));
  const ok = (p) => p.qualif.includes(avion) && p.repos >= 12 && (!exigeHeures || p.heures >= 1000);
  const elig = pilotes.filter(ok);
  if (elig.length !== 1) return null;
  const regles = ['être qualifié sur l’avion du vol', 'avoir au moins <b>12 h de repos</b>', 'pour un vol de plus de 3 h : avoir au moins <b>1 000 h de vol</b>'];
  const why = (p) => {
    const e = [];
    if (!p.qualif.includes(avion)) e.push(`non qualifié ${avion}`);
    if (p.repos < 12) e.push(`repos ${p.repos} h`);
    if (exigeHeures && p.heures < 1000) e.push(`${p.heures} h de vol`);
    return e.length ? e.join(', ') : 'remplit toutes les règles ✓';
  };
  return {
    visual: `<div class="card small" style="text-align:left"><b>Règles</b> : pour être affecté, un pilote doit ${regles.join(' ; ')}.</div><table class="tbl struct"><tr><th>Pilote</th><th>Qualifications</th><th>Heures de vol</th><th>Repos</th></tr>${pilotes.map((p) => `<tr><td>${p.nom}</td><td>${p.qualif.join(', ')}</td><td>${p.heures}</td><td>${p.repos} h</td></tr>`).join('')}</table>`,
    prompt: `Vol de <b>${dur(duree)}</b> en <b>${avion}</b>. Quel pilote peut être affecté ?`,
    correct: elig[0].nom,
    distract: pilotes.filter((p) => p !== elig[0]).map((p) => p.nom),
    explain: `<ul>${pilotes.map((p) => `<li><b>${p.nom}</b> : ${why(p)}</li>`).join('')}</ul><p class="tip">Méthode : applique les règles une par une et barre au fur et à mesure. Commence par la règle la plus sélective (souvent la qualification).</p>`,
    time: 60,
  };
}

// Niveau 3 : choix d'un avion selon une mission (charge, distance, piste).
const FLOTTE = [
  { n: 'A400M', charge: 30, rayon: 3300, piste: 950 },
  { n: 'C-130J', charge: 18, rayon: 3000, piste: 900 },
  { n: 'CASA 235', charge: 5, rayon: 1500, piste: 500 },
  { n: 'Phénix', charge: 40, rayon: 8000, piste: 2400 },
  { n: 'Falcon 2000', charge: 1, rayon: 5500, piste: 1700 },
];
function qMission(r) {
  // valeurs fictives d'entraînement, ordre de grandeur réaliste
  const f = FLOTTE.map((a) => ({ ...a, charge: a.charge + r.int(-2, 2) * (a.charge > 5 ? 1 : 0), rayon: a.rayon + r.int(-3, 3) * 100, piste: a.piste + r.int(-2, 2) * 50 }));
  const charge = r.int(2, 35);
  const dist = r.int(10, 60) * 100;
  const piste = r.int(8, 30) * 100;
  const ok = (a) => a.charge >= charge && a.rayon >= dist && a.piste <= piste;
  const elig = f.filter(ok);
  if (elig.length !== 1) return null;
  const why = (a) => [a.charge < charge && `charge ${a.charge} t`, a.rayon < dist && `distance ${a.rayon} km`, a.piste > piste && `piste ${a.piste} m`].filter(Boolean).join(', ') || 'convient ✓';
  return {
    visual: `<table class="tbl struct"><tr><th>Avion</th><th>Charge max</th><th>Distance max</th><th>Piste min</th></tr>${f.map((a) => `<tr><td>${a.n}</td><td>${a.charge} t</td><td>${a.rayon} km</td><td>${a.piste} m</td></tr>`).join('')}</table><p class="small muted">Valeurs fictives d’entraînement.</p>`,
    prompt: `Mission : transporter <b>${charge} t</b> sur <b>${dist} km</b> et se poser sur une piste de <b>${piste} m</b>. Quel avion choisir ?`,
    correct: elig[0].n,
    distract: f.filter((a) => a !== elig[0]).map((a) => a.n),
    explain: `<ul>${f.map((a) => `<li><b>${a.n}</b> : ${why(a)}</li>`).join('')}</ul><p class="tip">Trois critères à croiser : élimine colonne par colonne.</p>`,
    time: 50,
  };
}

register({
  id: 'psy.structuration',
  module: 'psycho',
  group: 'Structuration d’informations',
  title: 'Structuration d’informations',
  desc: 'Tableaux de vols, équipages et avions : extraire et croiser les informations vite.',
  make(level, r) {
    for (let tries = 0; tries < 200; tries++) {
      let q, visual;
      if (level === 3 && r.bool(0.6)) {
        q = r.bool() ? qAffectation(r) : qMission(r);
        visual = q?.visual;
      } else {
        const v = vols(r, level === 1 ? 5 : 7);
        q = qVols(level, r, v);
        visual = tableVols(v);
      }
      if (!q) continue;
      const distract = [...new Set(q.distract)].filter((d) => d !== q.correct);
      if (distract.length < 3) continue;
      const { choices, answer } = buildChoices(r, q.correct, r.shuffle(distract), 4);
      return { kind: 'mcq', prompt: q.prompt, visual, choices, answer, explain: `<p>${q.explain}</p>`, timeLimit: q.time || (level === 1 ? 30 : 45) };
    }
    throw new Error('structuration : génération impossible');
  },
});
