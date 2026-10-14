// Questions déjà vues des banques à contenu fixe, mémorisées d'une séance à l'autre :
// on propose d'abord les questions jamais vues, et on recommence un cycle quand toute la banque y est passée.
import { store } from './store.js';
import { getGen, makeQuestion, newSpec } from './registry.js';
import { newSeed } from './rng.js';

const keyOf = (gen, level) => `${gen}|${level || 0}`;

export function markSeen(spec) {
  const g = getGen(spec?.gen);
  if (!g?.bank) return;
  const size = g.bankSize(spec.level);
  const idx = (spec.seed ?? 0) % size;
  store.update((s) => {
    const m = (s.seen ||= {});
    const k = keyOf(spec.gen, spec.level);
    const a = (m[k] ||= []);
    if (!a.includes(idx)) a.push(idx);
    if (a.length >= size) m[k] = []; // banque terminée : nouveau cycle
  });
}

export function seenCount(gen, level) {
  return (store.data.seen?.[keyOf(gen, level)] || []).length;
}

// Tirage pour une séance : jamais vues d'abord, sans doublon dans la séance.
export function makeDrawer(gen, rand = Math.random) {
  const used = {};
  return (level) => {
    const g = getGen(gen);
    const all = [...Array(g.bankSize(level)).keys()];
    const seen = new Set(store.data.seen?.[keyOf(gen, level)] || []);
    const u = (used[level] ||= new Set());
    let pool = all.filter((i) => !seen.has(i) && !u.has(i));
    if (!pool.length) pool = all.filter((i) => !u.has(i));
    if (!pool.length) {
      u.clear();
      pool = all;
    }
    const i = pool[Math.floor(rand() * pool.length)];
    u.add(i);
    return i;
  };
}

/* ---------- Exercices générés : éviter de reproposer une question récente ---------- */
// Certains générateurs n'ont que quelques dizaines de variantes : on garde l'empreinte des
// questions récentes et on cherche d'abord une question jamais vue récemment.
const RECENT_MAX = 150;

export function fingerprint(q) {
  if (!q || q.kind === 'custom') return null;
  const s = `${q.prompt}|${q.visual || ''}|${q.kind === 'mcq' ? q.choices?.[q.answer] : q.answerText ?? q.answer}`;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function markRecent(spec, q) {
  const g = getGen(spec?.gen);
  if (!g || g.bank) return;
  const fp = fingerprint(q);
  if (!fp) return;
  store.update((s) => {
    const m = (s.recent ||= {});
    const a = (m[spec.gen] ||= []).filter((x) => x !== fp);
    a.push(fp);
    if (a.length > RECENT_MAX) a.splice(0, a.length - RECENT_MAX);
    m[spec.gen] = a;
  });
}

// Fabrique de spécifications « fraîches » pour un générateur (une par séance).
export function makeFresh(gen, rand = null, tries = 30) {
  const used = new Set();
  const seed = () => (rand ? Math.floor(rand() * 4294967296) >>> 0 : newSeed());
  return (level) => {
    const g = getGen(gen);
    if (!g || g.bank) return newSpec(gen, level);
    const recent = store.data.recent?.[gen] || [];
    const rank = new Map(recent.map((fp, i) => [fp, i]));
    let best = null;
    for (let k = 0; k < tries; k++) {
      const spec = newSpec(gen, level, seed());
      let fp;
      try {
        fp = fingerprint(makeQuestion(spec));
      } catch {
        continue;
      }
      if (!fp) return spec; // exercice interactif : toujours différent
      if (!used.has(fp) && !rank.has(fp)) {
        used.add(fp);
        return spec;
      }
      // sinon on garde la moins récente des questions pas encore vues dans la séance
      const score = used.has(fp) ? -1 : RECENT_MAX - rank.get(fp);
      if (!best || score > best.score) best = { spec, fp, score };
    }
    if (best) used.add(best.fp);
    return best ? best.spec : newSpec(gen, level);
  };
}
