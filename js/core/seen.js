// Historique complet des questions posées : une question déjà vue n'est JAMAIS reproposée à
// l'identique (entraînement, coach, examens). Seule la page « Révisions » repose volontairement
// les questions ratées. Quand un exercice n'a plus de question nouvelle (banques à contenu fixe,
// exercices de connaissance), le tirage renvoie null et l'interface le signale.
import { store } from './store.js';
import { getGen, makeQuestion, newSpec } from './registry.js';
import { newSeed } from './rng.js';

const MAX_PER_GEN = 6000;

// Empreinte d'une question : énoncé + support + bonne réponse (l'ordre des choix ne compte pas).
export function fingerprint(q) {
  if (!q || q.kind === 'custom') return null; // exercices interactifs : séquence différente à chaque fois
  const s = `${q.prompt}|${q.visual || ''}|${q.pre?.html || ''}|${q.kind === 'mcq' ? q.choices?.[q.answer] : q.answerText ?? q.answer}`;
  let h = 5381, h2 = 52711;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h = ((h * 33) ^ c) >>> 0;
    h2 = ((h2 * 31) ^ c) >>> 0;
  }
  return h.toString(36) + h2.toString(36);
}

const histOf = (gen) => store.data.hist?.[gen] || [];
const setOf = (gen) => new Set(histOf(gen));

function safeMake(spec) {
  try {
    return makeQuestion(spec);
  } catch {
    return null;
  }
}

export function markSeen(spec, q) {
  const g = getGen(spec?.gen);
  if (!g) return;
  const fp = fingerprint(q || safeMake(spec));
  if (!fp) return;
  store.update((s) => {
    const m = (s.hist ||= {});
    const a = (m[spec.gen] ||= []);
    if (!a.includes(fp)) a.push(fp);
    if (a.length > MAX_PER_GEN) a.splice(0, a.length - MAX_PER_GEN);
  });
}

export function resetHistory(gen) {
  store.update((s) => {
    if (s.hist) delete s.hist[gen];
  });
}

export function seenTotal(gen) {
  return histOf(gen).length;
}

// Banques : nombre de questions jamais vues pour un niveau (0 = toute la banque).
export function remaining(gen, level) {
  const g = getGen(gen);
  if (!g?.bank) return null;
  const seen = setOf(gen);
  let n = 0;
  for (let i = 0; i < g.bankSize(level); i++) if (!seen.has(fingerprint(safeMake(newSpec(gen, level, i))))) n++;
  return n;
}

// Tirage d'une séance pour une banque : uniquement des questions jamais vues ; null si épuisée.
export function makeDrawer(gen, rand = Math.random) {
  const used = new Set();
  const decks = {};
  return (level) => {
    const g = getGen(gen);
    const seen = setOf(gen);
    if (!decks[level]) {
      const idx = [...Array(g.bankSize(level)).keys()];
      for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [idx[i], idx[j]] = [idx[j], idx[i]];
      }
      decks[level] = idx;
    }
    while (decks[level].length) {
      const i = decks[level].pop();
      const fp = fingerprint(safeMake(newSpec(gen, level, i)));
      if (seen.has(fp) || used.has(fp)) continue;
      used.add(fp);
      return newSpec(gen, level, i);
    }
    return null;
  };
}

// Tirage pour un exercice généré : une question jamais vue (ni avant, ni dans la séance) ; null si
// aucune n'est trouvée après de nombreux essais (toutes les variantes ont déjà été faites).
export function makeFresh(gen, rand = null, tries = 150) {
  const used = new Set();
  const seed = () => (rand ? Math.floor(rand() * 4294967296) >>> 0 : newSeed());
  return (level) => {
    const g = getGen(gen);
    if (!g) return null;
    const seen = setOf(gen);
    for (let k = 0; k < tries; k++) {
      const spec = newSpec(gen, level, seed());
      const q = safeMake(spec);
      if (!q) continue;
      const fp = fingerprint(q);
      if (!fp) return spec;
      if (seen.has(fp) || used.has(fp)) continue;
      used.add(fp);
      return spec;
    }
    return null;
  };
}

// Tirage unifié (banque ou générateur) : une fabrique par exercice, pour toute la séance.
export function makePicker(rand = null) {
  const f = {};
  return (gen, level) => (f[gen] ||= getGen(gen)?.bank ? makeDrawer(gen, rand || Math.random) : makeFresh(gen, rand))(level);
}
