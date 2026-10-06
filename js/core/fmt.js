// Mise en forme mathématique en HTML (sans bibliothèque externe, fonctionne hors ligne).

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

// Nombre à la française : virgule décimale, espace fine pour les milliers.
export function n(x, maxDec = 4) {
  if (typeof x !== 'number') return String(x);
  let r = Number(x.toFixed(maxDec));
  if (Object.is(r, -0)) r = 0;
  const neg = r < 0;
  const [int, dec] = Math.abs(r).toString().split('.');
  const intFmt = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int;
  return (neg ? '−' : '') + intFmt + (dec ? ',' + dec : '');
}

// Nombre entre parenthèses s'il est négatif : (−3)
export function p(x) {
  return x < 0 ? `(${n(x)})` : n(x);
}

export function frac(a, b) {
  return `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
}

// Fraction a/b simplifiée, avec signe devant. Renvoie un entier si b divise a.
export function fracN(a, b) {
  if (b < 0) {
    a = -a;
    b = -b;
  }
  const g = gcd(a, b);
  a /= g;
  b /= g;
  if (b === 1) return n(a);
  return (a < 0 ? '−' : '') + frac(Math.abs(a), b);
}

export function simplify(a, b) {
  if (b < 0) {
    a = -a;
    b = -b;
  }
  const g = gcd(a, b);
  return [a / g, b / g];
}

export function sq(x) {
  return `${x}<sup>2</sup>`;
}

export function pow(x, e) {
  return `${x}<sup>${e}</sup>`;
}

export function sqrt(x) {
  return `√<span class="ovl">${x}</span>`;
}

// Liste d'étapes de correction
export function steps(arr) {
  return `<ol class="steps">${arr.map((s) => `<li>${s}</li>`).join('')}</ol>`;
}
