// Chapitres : calcul et priorités, fractions, puissances et racines.
import { n, p, frac, fracN, gcd, pow, sqrt } from '../core/fmt.js';
import { numQ, mcqQ, acceptFrac, fracText } from './helpers.js';

export const calcul = {
  id: 'calcul',
  title: 'Calcul et priorités',
  niveau: 'Seconde',
  cours: `
    <h3>1. L’ordre des opérations</h3>
    <p>Dans un calcul, on effectue <b>dans cet ordre</b> :</p>
    <ol><li>les <b>parenthèses</b> (les plus intérieures d’abord) ;</li><li>les <b>puissances</b> ;</li><li>les <b>multiplications et divisions</b>, de gauche à droite ;</li><li>les <b>additions et soustractions</b>, de gauche à droite.</li></ol>
    <div class="ex">Exemple : 5 + 3 × 4 = 5 + 12 = 17 (et non 8 × 4 = 32).</div>
    <h3>2. Les nombres relatifs</h3>
    <ul><li>Additionner un négatif = soustraire : 7 + (−3) = 7 − 3 = 4.</li><li>Soustraire un négatif = additionner : 7 − (−3) = 7 + 3 = 10.</li><li><b>Règle des signes</b> (× et ÷) : deux signes identiques → résultat positif ; deux signes différents → résultat négatif. (−4) × (−5) = 20 ; (−4) × 5 = −20.</li></ul>
    <h3>3. La distributivité</h3>
    <p>k × (a + b) = k × a + k × b et k × (a − b) = k × a − k × b.</p>
    <div class="ex">Exemple : 3 × (x − 4) = 3x − 12. Et −2(x − 5) = −2x + 10 (le signe « − » change tous les signes de la parenthèse).</div>
    <h3>4. Supprimer des parenthèses</h3>
    <p>Précédée de « + », une parenthèse disparaît sans rien changer. Précédée de « − », elle disparaît en changeant le signe de chaque terme : a − (b − c) = a − b + c.</p>`,
  methode: `
    <ol><li><b>Souligne</b> d’abord l’opération prioritaire avant de calculer.</li><li>Recopie le calcul à chaque étape en remplaçant uniquement la partie calculée.</li><li>Avec les relatifs, écris les négatifs entre parenthèses : 4 × (−3).</li><li>Vérifie l’ordre de grandeur du résultat à la fin.</li></ol>
    <p class="tip">L’erreur la plus fréquente : calculer de gauche à droite sans respecter les priorités, ou oublier de changer les signes après « −( ».</p>`,
  templates: {
    1: [
      (r) => {
        const a = r.int(2, 20), b = r.int(2, 9), c = r.int(2, 9);
        return numQ(`Calcule : ${a} + ${b} × ${c}`, a + b * c, [`La multiplication est prioritaire : ${b} × ${c} = ${b * c}.`, `Puis l’addition : ${a} + ${b * c} = <b>${a + b * c}</b>.`]);
      },
      (r) => {
        const a = r.int(-15, 15), b = r.int(-15, 15) || 4;
        return numQ(`Calcule : ${p(a)} − ${p(b)}`, a - b, [`Soustraire ${p(b)}, c’est ajouter son opposé ${p(-b)}.`, `${p(a)} + ${p(-b)} = <b>${n(a - b)}</b>.`]);
      },
      (r) => {
        const a = r.int(2, 12) * r.sign(), b = r.int(2, 12) * r.sign();
        return numQ(`Calcule : ${p(a)} × ${p(b)}`, a * b, [`Valeur sans les signes : ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(a * b)}.`, `Signes ${a < 0 === b < 0 ? 'identiques → positif' : 'différents → négatif'} : <b>${n(a * b)}</b>.`]);
      },
      (r) => {
        const a = r.int(20, 60), b = r.int(2, 9), c = r.int(2, 6);
        return numQ(`Calcule : ${a} − ${b * c} ÷ ${b}`, a - c, [`La division est prioritaire : ${b * c} ÷ ${b} = ${c}.`, `${a} − ${c} = <b>${a - c}</b>.`]);
      },
    ],
    2: [
      (r) => {
        const a = r.int(2, 9), b = r.int(5, 15), c = r.int(1, 4), d = r.int(1, 20);
        return numQ(`Calcule : ${a} × (${b} − ${c}) + ${d}`, a * (b - c) + d, [`Parenthèses : ${b} − ${c} = ${b - c}.`, `Multiplication : ${a} × ${b - c} = ${a * (b - c)}.`, `Addition : ${a * (b - c)} + ${d} = <b>${a * (b - c) + d}</b>.`]);
      },
      (r) => {
        const a = r.int(5, 30), b = r.int(2, 20), c = r.int(2, 20);
        return numQ(`Calcule : ${a} − (${b} − ${c})`, a - (b - c), [`On supprime la parenthèse précédée de « − » en changeant les signes : ${a} − ${b} + ${c}.`, `${a} − ${b} = ${a - b}, puis ${n(a - b)} + ${c} = <b>${n(a - b + c)}</b>.`]);
      },
      (r) => {
        const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9), d = r.int(2, 9);
        const v = -a * -b - c * d;
        return numQ(`Calcule : (−${a}) × (−${b}) − ${c} × ${d}`, v, [`(−${a}) × (−${b}) = ${a * b} (deux signes « − » → positif).`, `${c} × ${d} = ${c * d}.`, `${a * b} − ${c * d} = <b>${n(v)}</b>.`]);
      },
      (r) => {
        const k = r.int(2, 6), a = r.int(2, 9), b = r.int(1, 9), x = r.int(-5, 5);
        return numQ(`On pose A = ${k}(${a}x − ${b}). Calcule A pour x = ${p(x)}.`, k * (a * x - b), [`Remplace x par ${p(x)} : A = ${k} × (${a} × ${p(x)} − ${b}).`, `Parenthèse : ${a * x} − ${b} = ${a * x - b}.`, `A = ${k} × ${p(a * x - b)} = <b>${n(k * (a * x - b))}</b>.`]);
      },
    ],
    3: [
      (r) => {
        const c = r.int(2, 6), q = r.int(2, 9), a = r.int(1, q * c - 1), b = q * c - a, d = r.int(2, 5), e = r.int(2, 6);
        const v = (a + b) / c - d * e;
        return numQ(`Calcule : (${a} + ${b}) ÷ ${c} − ${d} × ${e}`, v, [`Parenthèses : ${a} + ${b} = ${a + b}.`, `Division et multiplication : ${a + b} ÷ ${c} = ${q} et ${d} × ${e} = ${d * e}.`, `${q} − ${d * e} = <b>${n(v)}</b>.`]);
      },
      (r) => {
        const a = r.int(10, 30), b = r.int(5, 20), c = r.int(2, 15), d = r.int(1, 10);
        const v = a - (b - (c - d));
        return numQ(`Calcule : ${a} − [${b} − (${c} − ${d})]`, v, [`Parenthèse intérieure : ${c} − ${d} = ${c - d}.`, `Crochet : ${b} − ${p(c - d)} = ${b - (c - d)}.`, `${a} − ${p(b - (c - d))} = <b>${n(v)}</b>.`]);
      },
      (r) => {
        const a = r.int(2, 5), b = r.int(1, 7), c = r.int(2, 4), d = r.int(1, 6);
        const cx = a - c, k = -a * b + c * d;
        const res = (cx, k) => `${cx === 0 ? '' : cx === 1 ? 'x' : cx === -1 ? '−x' : n(cx) + 'x'}${k === 0 ? (cx === 0 ? '0' : '') : (cx === 0 ? n(k) : k > 0 ? ' + ' + k : ' − ' + -k)}`;
        const good = res(cx, k);
        return mcqQ(r, `Développe et réduis : ${a}(x − ${b}) − ${c}(x − ${d})`, good, [res(a + c, -a * b - c * d), res(cx, -a * b - c * d), res(a + c, k), res(cx, a * b - c * d)], [`${a}(x − ${b}) = ${a}x − ${a * b}.`, `−${c}(x − ${d}) = −${c}x + ${c * d} (le « − » change les signes).`, `On regroupe : (${a} − ${c})x + (−${a * b} + ${c * d}) = <b>${good}</b>.`]);
      },
      (r) => {
        const a = r.int(2, 4), b = r.int(2, 5), c = r.int(1, 9);
        const v = a ** 2 * b - c;
        return numQ(`Calcule : ${pow(a, 2)} × ${b} − ${c}`, v, [`La puissance d’abord : ${pow(a, 2)} = ${a * a}.`, `Puis ${a * a} × ${b} = ${a * a * b}.`, `${a * a * b} − ${c} = <b>${v}</b>.`]);
      },
    ],
  },
};

export const fractions = {
  id: 'fractions',
  title: 'Fractions',
  niveau: 'Seconde',
  cours: `
    <h3>1. Simplifier</h3>
    <p>On divise le numérateur et le dénominateur par un même nombre : ${frac(12, 18)} = ${frac('12 ÷ 6', '18 ÷ 6')} = ${frac(2, 3)}. Une fraction est <b>irréductible</b> quand on ne peut plus la simplifier.</p>
    <h3>2. Additionner / soustraire</h3>
    <p>Il faut le <b>même dénominateur</b> : ${frac(1, 4)} + ${frac(2, 3)} = ${frac(3, 12)} + ${frac(8, 12)} = ${frac(11, 12)}.</p>
    <h3>3. Multiplier</h3>
    <p>Numérateur × numérateur, dénominateur × dénominateur : ${frac(2, 3)} × ${frac(5, 7)} = ${frac(10, 21)}.</p>
    <h3>4. Diviser</h3>
    <p>Diviser par une fraction = multiplier par son <b>inverse</b> : ${frac(3, 4)} ÷ ${frac(5, 2)} = ${frac(3, 4)} × ${frac(2, 5)} = ${frac(6, 20)} = ${frac(3, 10)}.</p>
    <h3>5. Fraction d’une quantité</h3>
    <p>${frac(3, 5)} de 40 = 40 ÷ 5 × 3 = 24.</p>`,
  methode: `
    <ol><li>Avant tout calcul, <b>simplifie</b> les fractions si possible.</li><li>Pour + et −, cherche le plus petit dénominateur commun (multiple commun des dénominateurs).</li><li>Pour ×, simplifie « en croix » avant de multiplier pour garder des petits nombres.</li><li>Termine toujours par une fraction <b>irréductible</b>.</li></ol>
    <p class="tip">Pour saisir une fraction, utilise la touche « / » du pavé : 3/4.</p>`,
  templates: {
    1: [
      (r) => {
        const a = r.int(1, 9), b = r.int(a + 1, 12), k = r.int(2, 9);
        const [x, y] = [a / gcd(a, b), b / gcd(a, b)];
        return numQ(`Simplifie au maximum : ${frac(a * k, b * k)}`, x / y, [`On cherche le plus grand diviseur commun de ${a * k} et ${b * k} : c’est ${gcd(a * k, b * k)}.`, `${a * k} ÷ ${gcd(a * k, b * k)} = ${x} et ${b * k} ÷ ${gcd(a * k, b * k)} = ${y} → <b>${fracN(x, y)}</b>.`], { accept: acceptFrac(x, y, true), answerText: fracText(x, y), tip: 'La réponse doit être irréductible (ex. 2/3).' });
      },
      (r) => {
        const d = r.pick([3, 4, 5, 6, 8, 10]), nu = r.int(1, d - 1), q = d * r.int(2, 15);
        return numQ(`Calcule ${frac(nu, d)} de ${q}.`, (nu * q) / d, [`${q} ÷ ${d} = ${q / d} (un ${d === 4 ? 'quart' : 'morceau'}).`, `${q / d} × ${nu} = <b>${(nu * q) / d}</b>.`]);
      },
      (r) => {
        const d = r.int(3, 12), a = r.int(1, d - 1), b = r.int(1, d - 1);
        return numQ(`Calcule : ${frac(a, d)} + ${frac(b, d)}`, (a + b) / d, [`Même dénominateur : on additionne les numérateurs : ${frac(`${a} + ${b}`, d)} = ${frac(a + b, d)}.`, `Simplification éventuelle : <b>${fracN(a + b, d)}</b>.`], { accept: acceptFrac(a + b, d), answerText: fracText(a + b, d) });
      },
    ],
    2: [
      (r) => {
        const b = r.pick([2, 3, 4, 5, 6]), d = r.pick([3, 4, 5, 7, 8].filter((x) => x !== b)), a = r.int(1, b + 2), c = r.int(1, d + 2);
        const N = a * d + c * b, D = b * d;
        return numQ(`Calcule : ${frac(a, b)} + ${frac(c, d)}`, N / D, [`Dénominateur commun : ${b} × ${d} = ${D} (ou un multiple commun plus petit).`, `${frac(a, b)} = ${frac(a * d, D)} et ${frac(c, d)} = ${frac(c * b, D)}.`, `Somme : ${frac(N, D)} = <b>${fracN(N, D)}</b>.`], { accept: acceptFrac(N, D), answerText: fracText(N, D) });
      },
      (r) => {
        const a = r.int(1, 9), b = r.int(2, 9), c = r.int(1, 9), d = r.int(2, 9);
        return numQ(`Calcule : ${frac(a, b)} × ${frac(c, d)}`, (a * c) / (b * d), [`On multiplie les numérateurs entre eux et les dénominateurs entre eux : ${frac(`${a} × ${c}`, `${b} × ${d}`)} = ${frac(a * c, b * d)}.`, `Simplification : <b>${fracN(a * c, b * d)}</b>.`], { accept: acceptFrac(a * c, b * d), answerText: fracText(a * c, b * d) });
      },
      (r) => {
        const a = r.int(1, 9), b = r.int(2, 9), c = r.int(1, 9), d = r.int(2, 9);
        return numQ(`Calcule : ${frac(a, b)} ÷ ${frac(c, d)}`, (a * d) / (b * c), [`Diviser par ${frac(c, d)}, c’est multiplier par son inverse ${frac(d, c)}.`, `${frac(a, b)} × ${frac(d, c)} = ${frac(a * d, b * c)} = <b>${fracN(a * d, b * c)}</b>.`], { accept: acceptFrac(a * d, b * c), answerText: fracText(a * d, b * c) });
      },
      (r) => {
        const b = r.pick([2, 3, 4, 5, 6]), d = r.pick([2, 3, 4, 6, 8].filter((x) => x !== b)), a = r.int(2, 9), c = r.int(1, 5);
        const N = a * d - c * b, D = b * d;
        return numQ(`Calcule : ${frac(a, b)} − ${frac(c, d)}`, N / D, [`Dénominateur commun ${D} : ${frac(a * d, D)} − ${frac(c * b, D)}.`, `= ${frac(N, D)} = <b>${fracN(N, D)}</b>.`], { accept: acceptFrac(N, D), answerText: fracText(N, D) });
      },
    ],
    3: [
      (r) => {
        const a = r.int(1, 5), b = r.int(2, 6), c = r.int(1, 5), d = r.int(2, 5), e = r.int(1, 5), f = r.int(2, 5);
        const N = a * d * f + b * c * e, D = b * d * f;
        return numQ(`Calcule : ${frac(a, b)} + ${frac(c, d)} × ${frac(e, f)}`, N / D, [`Priorité à la multiplication : ${frac(c, d)} × ${frac(e, f)} = ${frac(c * e, d * f)}.`, `Addition avec dénominateur commun ${b * d * f} : ${frac(a * d * f, D)} + ${frac(b * c * e, D)} = ${frac(N, D)}.`, `Résultat : <b>${fracN(N, D)}</b>.`], { accept: acceptFrac(N, D), answerText: fracText(N, D) });
      },
      (r) => {
        const tot = r.pick([120, 180, 240, 360, 480]);
        const f1 = r.pick([[1, 3], [1, 4], [1, 2], [2, 3]]), f2 = r.pick([[1, 2], [1, 3], [1, 4], [3, 4]]);
        const used1 = (tot * f1[0]) / f1[1];
        const rest = tot - used1;
        const used2 = (rest * f2[0]) / f2[1];
        return numQ(`Un réservoir contient ${tot} L. On consomme ${frac(...f1)} du carburant, puis ${frac(...f2)} de ce qui <b>reste</b>. Combien de litres reste-t-il ?`, rest - used2, [`1re consommation : ${frac(...f1)} × ${tot} = ${used1} L ; il reste ${tot} − ${used1} = ${rest} L.`, `2e consommation : ${frac(...f2)} × ${rest} = ${n(used2)} L.`, `Il reste ${rest} − ${n(used2)} = <b>${n(rest - used2)} L</b>.`], { tip: '« De ce qui reste » : la deuxième fraction s’applique au reste, pas au total !' });
      },
      (r) => {
        const a = r.int(2, 9), b = r.int(2, 9), c = r.int(1, 9);
        // x / a = c / b  -> x = a c / b
        return numQ(`Trouve x : ${frac('x', a)} = ${frac(c, b)}`, (a * c) / b, [`On multiplie les deux membres par ${a} : x = ${frac(`${a} × ${c}`, b)} = ${frac(a * c, b)}.`, `x = <b>${fracN(a * c, b)}</b>.`], { accept: acceptFrac(a * c, b), answerText: fracText(a * c, b), tip: 'Produit en croix : si a/b = c/d alors a × d = b × c.' });
      },
      (r) => {
        const b = r.int(2, 6), a = r.int(1, b * 2), d = r.int(2, 6), c = r.int(1, d * 2);
        const [x1, y1] = [a * d, b * d], [x2, y2] = [c * b, b * d];
        const ans = a * d > c * b ? `${frac(a, b)} > ${frac(c, d)}` : a * d < c * b ? `${frac(a, b)} < ${frac(c, d)}` : `${frac(a, b)} = ${frac(c, d)}`;
        return mcqQ(r, `Compare ${frac(a, b)} et ${frac(c, d)}.`, ans, [`${frac(a, b)} > ${frac(c, d)}`, `${frac(a, b)} < ${frac(c, d)}`, `${frac(a, b)} = ${frac(c, d)}`], [`Même dénominateur ${y1} : ${frac(a, b)} = ${frac(x1, y1)} et ${frac(c, d)} = ${frac(x2, y2)}.`, `On compare les numérateurs ${x1} et ${x2} : <b>${ans}</b>.`], { n: 3 });
      },
    ],
  },
};

export const puissances = {
  id: 'puissances',
  title: 'Puissances et racines',
  niveau: 'Seconde',
  cours: `
    <h3>1. Définition</h3>
    <p>${pow('a', 'n')} = a × a × … × a (n facteurs). ${pow(2, 3)} = 2 × 2 × 2 = 8. Par convention ${pow('a', 0)} = 1 et ${pow('a', '−n')} = ${frac(1, pow('a', 'n'))}.</p>
    <h3>2. Règles de calcul</h3>
    <ul><li>${pow('a', 'm')} × ${pow('a', 'n')} = ${pow('a', 'm+n')}</li><li>${frac(pow('a', 'm'), pow('a', 'n'))} = ${pow('a', 'm−n')}</li><li>(${pow('a', 'm')})<sup>n</sup> = ${pow('a', 'm×n')}</li><li>(ab)<sup>n</sup> = ${pow('a', 'n')}${pow('b', 'n')}</li></ul>
    <h3>3. Puissances de 10 et écriture scientifique</h3>
    <p>${pow(10, 3)} = 1 000 ; ${pow(10, '−2')} = 0,01. Écriture scientifique : a × ${pow(10, 'n')} avec 1 ≤ a &lt; 10. Ex. : 45 000 = 4,5 × ${pow(10, 4)} ; 0,003 = 3 × ${pow(10, '−3')}.</p>
    <h3>4. Racines carrées</h3>
    <p>${sqrt('a')} est le nombre positif dont le carré vaut a : ${sqrt(49)} = 7. Règles : ${sqrt('ab')} = ${sqrt('a')} × ${sqrt('b')} ; ${sqrt(50)} = ${sqrt('25 × 2')} = 5${sqrt(2)}. Attention : ${sqrt('a + b')} ≠ ${sqrt('a')} + ${sqrt('b')}.</p>
    <h3>5. Signe</h3><p>(−2)<sup>n</sup> est positif si n est pair, négatif si n est impair. Mais −${pow(2, 4)} = −16 (la puissance ne porte que sur le 2).</p>`,
  methode: `
    <ol><li>Ramène tout à la <b>même base</b> avant d’appliquer les règles.</li><li>Pour l’écriture scientifique, compte de combien de rangs la virgule se déplace : vers la gauche → exposant positif.</li><li>Pour simplifier une racine, cherche le plus grand <b>carré parfait</b> qui divise le nombre (4, 9, 16, 25, 36, 49, 64, 81, 100…).</li></ol>`,
  templates: {
    1: [
      (r) => {
        const a = r.int(2, 5), e = r.int(2, a === 2 ? 6 : 3);
        return numQ(`Calcule : ${pow(a, e)}`, a ** e, [`${pow(a, e)} = ${Array(e).fill(a).join(' × ')} = <b>${a ** e}</b>.`], { tip: 'Ne confonds pas avec ' + a + ' × ' + e + ' = ' + a * e + '.' });
      },
      (r) => {
        const m = r.int(-5, 8), k = r.int(-5, 8);
        return numQ(`${pow(10, m)} × ${pow(10, k)} = ${pow(10, 'n')}. Que vaut n ?`, m + k, [`On ajoute les exposants : ${p(m)} + ${p(k)} = <b>${m + k}</b>.`]);
      },
      (r) => {
        const a = r.int(11, 99) / 10, e = r.int(2, 6);
        const val = a * 10 ** e;
        const good = `${n(a)} × ${pow(10, e)}`;
        return mcqQ(r, `Écriture scientifique de ${n(val)} ?`, good, [`${n(a * 10)} × ${pow(10, e - 1)}`, `${n(a)} × ${pow(10, e + 1)}`, `${n(a)} × ${pow(10, -e)}`, `${n(a / 10)} × ${pow(10, e + 1)}`], [`Il faut un nombre entre 1 et 10 : ${n(a)}.`, `La virgule s’est déplacée de ${e} rangs vers la gauche → ${pow(10, e)}.`, `<b>${good}</b>`]);
      },
      (r) => {
        const s = r.int(2, 15);
        return numQ(`Calcule : ${sqrt(s * s)}`, s, [`${s} × ${s} = ${s * s}, donc ${sqrt(s * s)} = <b>${s}</b>.`]);
      },
    ],
    2: [
      (r) => {
        const m = r.int(2, 9), k = r.int(2, 9), q = r.int(1, 6);
        return numQ(`Écris sous la forme ${pow('a', 'n')} : ${frac(`${pow('a', m)} × ${pow('a', k)}`, pow('a', q))}. Que vaut n ?`, m + k - q, [`Numérateur : ${pow('a', m)} × ${pow('a', k)} = ${pow('a', m + k)}.`, `Division : ${pow('a', `${m + k} − ${q}`)} = ${pow('a', m + k - q)}. n = <b>${m + k - q}</b>.`]);
      },
      (r) => {
        const m = r.int(2, 5), k = r.int(2, 5);
        return numQ(`(${pow('x', m)})<sup>${k}</sup> = ${pow('x', 'n')}. Que vaut n ?`, m * k, [`Puissance de puissance : on <b>multiplie</b> les exposants : ${m} × ${k} = <b>${m * k}</b>.`]);
      },
      (r) => {
        const a = r.pick([2, 3, 4, 5, 10]), e = r.int(1, a === 2 ? 4 : 2);
        return numQ(`Calcule ${pow(a, '−' + e)} (sous forme de fraction ou décimal).`, 1 / a ** e, [`${pow(a, '−' + e)} = ${frac(1, pow(a, e))} = ${frac(1, a ** e)}.`, `= <b>${fracN(1, a ** e)}</b>${a === 10 || a === 2 || a === 5 || a === 4 ? ` = ${n(1 / a ** e)}` : ''}.`], { accept: acceptFrac(1, a ** e), answerText: `1/${a ** e}` });
      },
      (r) => {
        const b = r.int(2, 9), e = r.int(2, 5);
        const v = (-b) ** e;
        return numQ(`Calcule : (−${b})<sup>${e}</sup>`, v, [`On multiplie ${e} fois −${b}.`, `Exposant ${e % 2 === 0 ? 'pair → résultat positif' : 'impair → résultat négatif'} : <b>${n(v)}</b>.`]);
      },
    ],
    3: [
      (r) => {
        const a = r.int(2, 9), e1 = r.int(2, 7), b = r.int(2, 4), e2 = r.int(-6, -1);
        const prod = a * b;
        const mant = prod >= 10 ? prod / 10 : prod;
        const ex = e1 + e2 + (prod >= 10 ? 1 : 0);
        const good = `${n(mant)} × ${pow(10, ex)}`;
        return mcqQ(r, `Donne l’écriture scientifique de (${a} × ${pow(10, e1)}) × (${b} × ${pow(10, e2)}).`, good, [`${prod} × ${pow(10, e1 + e2)}`, `${n(mant)} × ${pow(10, ex + 1)}`, `${n(mant)} × ${pow(10, e1 * e2)}`, `${n(mant)} × ${pow(10, ex - 1)}`].filter((x) => x !== good), [`On regroupe : (${a} × ${b}) × ${pow(10, `${e1} + (${e2})`)} = ${prod} × ${pow(10, e1 + e2)}.`, prod >= 10 ? `${prod} = ${n(mant)} × 10, donc on ajoute 1 à l’exposant.` : `${prod} est déjà entre 1 et 10.`, `<b>${good}</b>`]);
      },
      (r) => {
        const sq = r.pick([4, 9, 16, 25, 36, 49]), k = r.pick([2, 3, 5, 6, 7]);
        const good = `${Math.sqrt(sq)}${sqrt(k)}`;
        return mcqQ(r, `Simplifie : ${sqrt(sq * k)}`, good, [`${k}${sqrt(Math.sqrt(sq))}`, `${sq}${sqrt(k)}`, `${Math.sqrt(sq) + 1}${sqrt(k)}`, `${Math.sqrt(sq)}${sqrt(k + 1)}`], [`${sq * k} = ${sq} × ${k} où ${sq} est un carré parfait.`, `${sqrt(sq * k)} = ${sqrt(sq)} × ${sqrt(k)} = <b>${good}</b>.`]);
      },
      (r) => {
        const a = r.int(2, 5), m = r.int(1, 4), k = r.int(1, 3);
        // (a^m)^2 × a^k / a^(m)
        const res = 2 * m + k - m;
        return numQ(`(${pow(a, m)})<sup>2</sup> × ${pow(a, k)} ÷ ${pow(a, m)} = ${pow(a, 'n')}. Que vaut n ?`, res, [`(${pow(a, m)})<sup>2</sup> = ${pow(a, 2 * m)}.`, `${pow(a, 2 * m)} × ${pow(a, k)} = ${pow(a, 2 * m + k)}.`, `÷ ${pow(a, m)} → ${pow(a, 2 * m + k - m)}. n = <b>${res}</b>.`]);
      },
      (r) => {
        const a = r.int(2, 9);
        return numQ(`Calcule : (${sqrt(a)})<sup>2</sup> + ${sqrt(a * a * 4)}`, a + 2 * a, [`(${sqrt(a)})<sup>2</sup> = ${a} (par définition de la racine).`, `${sqrt(a * a * 4)} = ${sqrt(`${a * a} × 4`)} = ${a} × 2 = ${2 * a}.`, `${a} + ${2 * a} = <b>${3 * a}</b>.`]);
      },
    ],
  },
};
