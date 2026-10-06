// Générateur pseudo-aléatoire déterministe : une même graine redonne le même exercice
// (indispensable pour la révision espacée des exercices générés).

export function newSeed() {
  return (Math.random() * 2 ** 32) >>> 0;
}

export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng = {
    next,
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    pick(arr) {
      return arr[Math.floor(next() * arr.length)];
    },
    bool(p = 0.5) {
      return next() < p;
    },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    sample(arr, n) {
      return rng.shuffle(arr).slice(0, n);
    },
    sign() {
      return next() < 0.5 ? -1 : 1;
    },
  };
  return rng;
}

// Construit un QCM : place la bonne réponse parmi des distracteurs uniques.
// `key` sert à comparer les choix (par défaut String).
export function buildChoices(rng, correct, distractors, n = 4, key = String) {
  const seen = new Set([key(correct)]);
  const out = [];
  for (const d of distractors) {
    const k = key(d);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(d);
    }
    if (out.length >= n - 1) break;
  }
  const all = rng.shuffle([correct, ...out]);
  return { choices: all, answer: all.findIndex((c) => key(c) === key(correct)) };
}
