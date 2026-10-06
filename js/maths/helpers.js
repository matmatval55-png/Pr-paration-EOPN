// Outils communs aux chapitres de maths et de physique.
import { buildChoices } from '../core/rng.js';
import { parseNum } from '../core/ui.js';
import { gcd, n, steps } from '../core/fmt.js';

export function numQ(prompt, answer, stepList, opts = {}) {
  return {
    kind: 'num',
    prompt,
    answer,
    explain: steps(stepList) + (opts.tip ? `<p class="tip">${opts.tip}</p>` : ''),
    tol: opts.tol,
    answerText: opts.answerText,
    accept: opts.accept,
    allowFrac: opts.allowFrac,
    visual: opts.visual,
  };
}

export function mcqQ(r, prompt, correct, distractors, stepList, opts = {}) {
  const { choices, answer } = buildChoices(r, correct, distractors, opts.n || 4);
  return {
    kind: 'mcq',
    layout: opts.layout,
    prompt,
    choices,
    answer,
    explain: steps(stepList) + (opts.tip ? `<p class="tip">${opts.tip}</p>` : ''),
    visual: opts.visual,
  };
}

// Accepte une fraction égale à a/b ; si `irreducible`, exige aussi la forme simplifiée.
export function acceptFrac(a, b, irreducible = false) {
  return (txt) => {
    const v = parseNum(txt);
    if (!Number.isFinite(v) || Math.abs(v - a / b) > 1e-9) return false;
    if (!irreducible) return true;
    const t = txt.replace(/\s/g, '');
    if (!t.includes('/')) return Number.isInteger(v);
    const [p, q] = t.split('/').map(Number);
    return Number.isInteger(p) && Number.isInteger(q) && gcd(p, q) === 1;
  };
}

export function fracText(a, b) {
  if (b < 0) (a = -a), (b = -b);
  const g = gcd(a, b);
  a /= g;
  b /= g;
  return b === 1 ? n(a) : `${a < 0 ? '−' : ''}${Math.abs(a)}/${b}`;
}

// Monôme a·x avec signes propres : « 3x », « − x », « + 5 »
export function term(a, v = 'x', first = false) {
  if (a === 0) return '';
  const s = a < 0 ? '− ' : first ? '' : '+ ';
  const abs = Math.abs(a);
  const coef = v && abs === 1 ? '' : n(abs);
  return `${s}${coef}${v}`.trim();
}

// Polynôme à partir de coefficients [[coef, 'x²'], [coef, 'x'], [coef, '']]
export function poly(terms) {
  const out = [];
  for (const [c, v] of terms) {
    if (c === 0) continue;
    out.push(term(c, v, out.length === 0));
  }
  return out.join(' ') || '0';
}
