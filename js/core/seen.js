// Questions déjà vues des banques à contenu fixe, mémorisées d'une séance à l'autre :
// on propose d'abord les questions jamais vues, et on recommence un cycle quand toute la banque y est passée.
import { store } from './store.js';
import { getGen } from './registry.js';

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
