// Barème sportif officiel (« Carnet évalué AAE », devenir-aviateur.gouv.fr, septembre 2025).
// ⚠️ Ce livret concerne le recrutement général ; la note minimale exigée des navigants n'y figure pas.
// Seuils : valeur minimale à atteindre pour chaque note (de 20 à 1). null = case « / » du barème.
// Luc Léger : en secondes de course équivalentes (palier × 60 + secondes).

const P = (palier, sec = 0) => palier * 60 + sec;

export const BAREME = {
  leger: {
    H: [P(12), P(11), P(10, 30), P(10), P(9, 30), P(9), P(8, 30), P(8), P(7, 45), P(7, 30), P(7, 15), null, P(6, 45), null, P(6, 15), null, P(5, 45), null, P(5, 15), null],
    F: [P(9), P(8, 30), P(8), P(7, 30), P(7), P(6, 30), P(6), P(5, 45), P(5, 30), P(5, 15), P(5), null, P(4, 45), null, P(4, 30), null, P(4, 15), null, P(4), null],
  },
  killy: [168, 160, 152, 144, 136, 128, 120, 112, 104, 96, 88, 80, 72, 64, 56, 48, 40, 32, 24, 16],
  bras: {
    H: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, null, 3, null, 2, null, 1],
    F: [59, 58, 53, 50, 47, 44, 42, 38, 34, 30, 29, 25, 24, 21, 20, 19, 16, 14, 11, 9],
  },
};

// Note obtenue : la meilleure note dont le seuil est atteint (0 si aucun).
export function noteFrom(thresholds, value) {
  for (let i = 0; i < thresholds.length; i++) {
    const t = thresholds[i];
    if (t != null && value >= t) return 20 - i;
  }
  return 0;
}

export function notes(sex, { palier = 0, sec = 0, bras = 0, killy = 0 }) {
  const leger = noteFrom(BAREME.leger[sex], P(Number(palier) || 0, Number(sec) || 0));
  const k = noteFrom(BAREME.killy, Number(killy) || 0);
  const b = noteFrom(BAREME.bras[sex], Number(bras) || 0);
  return { leger, killy: k, bras: b, moyenne: Math.round(((leger + k + b) / 3) * 10) / 10 };
}

export function fmtLeger(v) {
  if (v == null) return '/';
  const p = Math.floor(v / 60), s = v % 60;
  return s ? `${p}+${s}s` : `${p}`;
}

// Prochain seuil à atteindre au-dessus de la valeur actuelle.
export function nextTarget(thresholds, value) {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    const t = thresholds[i];
    if (t != null && t > value) return { note: 20 - i, value: t };
  }
  return null;
}
