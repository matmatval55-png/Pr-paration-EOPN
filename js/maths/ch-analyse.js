// Chapitres : fonctions, trigonométrie, vecteurs, probabilités.
import { n, p, frac, fracN, sq, sqrt, gcd } from '../core/fmt.js';
import { numQ, mcqQ, acceptFrac, fracText, poly } from './helpers.js';

export const fonctions = {
  id: 'fonctions',
  title: 'Fonctions',
  niveau: 'Seconde → Première',
  cours: `
    <h3>1. Vocabulaire</h3>
    <p>Une fonction f associe à chaque nombre x un unique nombre f(x), son <b>image</b>. Si f(a) = b, a est un <b>antécédent</b> de b.</p>
    <h3>2. Fonctions affines f(x) = ax + b</h3>
    <ul><li>Représentation : une <b>droite</b>. b = ordonnée à l’origine (là où la droite coupe l’axe vertical).</li><li>a = coefficient directeur (la pente) : a = ${frac('y<sub>B</sub> − y<sub>A</sub>', 'x<sub>B</sub> − x<sub>A</sub>')}.</li><li>a &gt; 0 : croissante ; a &lt; 0 : décroissante ; a = 0 : constante.</li></ul>
    <h3>3. Fonctions du second degré f(x) = ax² + bx + c</h3>
    <ul><li>Représentation : une <b>parabole</b>, tournée vers le haut si a &gt; 0.</li><li>Sommet en x = −b / (2a).</li><li>Discriminant Δ = b² − 4ac : Δ &gt; 0 → 2 racines ; Δ = 0 → 1 racine ; Δ &lt; 0 → aucune racine réelle. Racines : x = (−b ± √Δ) / (2a).</li></ul>
    <h3>4. Dérivée (Première)</h3>
    <p>(x<sup>n</sup>)′ = n x<sup>n−1</sup> ; (ax + b)′ = a ; (constante)′ = 0. f′(a) est le coefficient directeur de la tangente en a. Si f′ &gt; 0, f est croissante.</p>`,
  methode: `
    <ol><li>Pour une image : remplace x par la valeur <b>entre parenthèses</b> (surtout si elle est négative : (−3)² = 9).</li><li>Pour un antécédent : résous l’équation f(x) = valeur.</li><li>Pour une droite passant par A et B : calcule a, puis b = y<sub>A</sub> − a × x<sub>A</sub>.</li><li>Pour le second degré : calcule Δ avant toute chose.</li></ol>`,
  templates: {
    1: [
      (r) => {
        const a = r.int(-6, 6) || 2, b = r.int(-10, 10), x = r.int(-6, 6);
        return numQ(`f(x) = ${poly([[a, 'x'], [b, '']])}. Calcule f(${n(x)}).`, a * x + b, [`On remplace x par ${p(x)} : f(${n(x)}) = ${n(a)} × ${p(x)} ${b >= 0 ? '+' : '−'} ${Math.abs(b)}.`, `= ${n(a * x)} ${b >= 0 ? '+' : '−'} ${Math.abs(b)} = <b>${n(a * x + b)}</b>.`]);
      },
      (r) => {
        const a = r.int(-5, 5) || 3, b = r.int(-10, 10), x = r.int(-6, 8), y = a * x + b;
        return numQ(`f(x) = ${poly([[a, 'x'], [b, '']])}. Trouve l’antécédent de ${n(y)}.`, x, [`On résout ${poly([[a, 'x'], [b, '']])} = ${n(y)}.`, `${n(a)}x = ${n(y)} − ${p(b)} = ${n(y - b)}.`, `x = ${n(y - b)} ÷ ${p(a)} = <b>${n(x)}</b>.`]);
      },
      (r) => {
        const xa = r.int(-5, 3), xb = xa + r.int(1, 5), a = r.int(-4, 4) || 1, b = r.int(-6, 6);
        const ya = a * xa + b, yb = a * xb + b;
        return numQ(`Une droite passe par A(${n(xa)} ; ${n(ya)}) et B(${n(xb)} ; ${n(yb)}). Quel est son coefficient directeur ?`, a, [`a = ${frac('y<sub>B</sub> − y<sub>A</sub>', 'x<sub>B</sub> − x<sub>A</sub>')} = ${frac(`${n(yb)} − ${p(ya)}`, `${n(xb)} − ${p(xa)}`)}.`, `= ${frac(n(yb - ya), xb - xa)} = <b>${n(a)}</b>.`]);
      },
    ],
    2: [
      (r) => {
        const a = r.int(-3, 3) || 1, b = r.int(-6, 6), c = r.int(-9, 9), x = r.int(-4, 4);
        const v = a * x * x + b * x + c;
        return numQ(`f(x) = ${poly([[a, 'x²'], [b, 'x'], [c, '']])}. Calcule f(${n(x)}).`, v, [`x² = ${p(x)}² = ${x * x}.`, `f(${n(x)}) = ${n(a)} × ${x * x} + ${p(b)} × ${p(x)} + ${p(c)}.`, `= ${n(a * x * x)} + ${p(b * x)} + ${p(c)} = <b>${n(v)}</b>.`], { tip: 'Attention : (−3)² = 9 mais −3² = −9.' });
      },
      (r) => {
        const xa = r.int(-3, 2), xb = xa + r.int(1, 4), a = r.int(-3, 3) || 2, b = r.int(-5, 5);
        const ya = a * xa + b, yb = a * xb + b;
        const good = `y = ${poly([[a, 'x'], [b, '']])}`;
        return mcqQ(r, `Quelle est l’équation de la droite passant par A(${n(xa)} ; ${n(ya)}) et B(${n(xb)} ; ${n(yb)}) ?`, good, [`y = ${poly([[-a, 'x'], [b, '']])}`, `y = ${poly([[a, 'x'], [-b, '']])}`, `y = ${poly([[b || 1, 'x'], [a, '']])}`, `y = ${poly([[a, 'x'], [b + 1, '']])}`], [`a = ${frac(`${n(yb)} − ${p(ya)}`, `${n(xb)} − ${p(xa)}`)} = ${n(a)}.`, `b = y<sub>A</sub> − a × x<sub>A</sub> = ${n(ya)} − ${p(a)} × ${p(xa)} = ${n(b)}.`, `<b>${good}</b>`]);
      },
      (r) => {
        const a = r.int(-5, 5) || -2, b = r.int(-9, 9);
        const good = a > 0 ? 'croissante' : 'décroissante';
        return mcqQ(r, `La fonction f(x) = ${poly([[a, 'x'], [b, '']])} est :`, good, ['croissante', 'décroissante', 'constante'], [`Le coefficient directeur est a = ${n(a)}.`, `a ${a > 0 ? '> 0' : '< 0'} → f est <b>${good}</b> (b ne joue aucun rôle sur le sens de variation).`], { n: 3 });
      },
    ],
    3: [
      (r) => {
        const a = r.pick([1, 1, 2, -1]), x1 = r.int(-5, 5), x2 = r.bool(0.25) ? x1 : r.int(-5, 5);
        const both = r.bool(0.75);
        let A = a, B, C;
        if (both) {
          B = -a * (x1 + x2);
          C = a * x1 * x2;
        } else {
          B = r.int(-3, 3);
          C = r.int(3, 9) * Math.sign(a);
        }
        const D = B * B - 4 * A * C;
        const good = D > 0 ? '2 racines' : D === 0 ? '1 racine (double)' : 'aucune racine réelle';
        return mcqQ(r, `Combien de racines réelles a ${poly([[A, 'x²'], [B, 'x'], [C, '']])} = 0 ?`, good, ['2 racines', '1 racine (double)', 'aucune racine réelle'], [`Δ = b² − 4ac = ${p(B)}² − 4 × ${p(A)} × ${p(C)}.`, `Δ = ${B * B} − ${p(4 * A * C)} = <b>${D}</b>.`, `Δ ${D > 0 ? '> 0' : D === 0 ? '= 0' : '< 0'} → <b>${good}</b>.`], { n: 3 });
      },
      (r) => {
        const a = r.pick([1, 2, -1, -2, 3]), h = r.int(-5, 5), b = -2 * a * h, c = r.int(-8, 8);
        return numQ(`Abscisse du sommet de la parabole y = ${poly([[a, 'x²'], [b, 'x'], [c, '']])} ?`, h, [`x<sub>S</sub> = ${frac('−b', '2a')} = ${frac(n(-b), `2 × ${p(a)}`)}.`, `= ${frac(n(-b), 2 * a)} = <b>${n(h)}</b>.`]);
      },
      (r) => {
        const a = r.int(1, 4), b = r.int(-6, 6), c = r.int(-9, 9), d = r.int(-5, 5), x = r.int(-3, 3);
        // f(x) = a x^3 + b x^2 + c x + d ; f'(x) = 3a x^2 + 2b x + c
        const v = 3 * a * x * x + 2 * b * x + c;
        return numQ(`f(x) = ${poly([[a, 'x³'], [b, 'x²'], [c, 'x'], [d, '']])}. Calcule f′(${n(x)}).`, v, [`f′(x) = ${poly([[3 * a, 'x²'], [2 * b, 'x'], [c, '']])} (on dérive terme à terme : (x³)′ = 3x², (x²)′ = 2x, la constante disparaît).`, `f′(${n(x)}) = ${3 * a} × ${x * x} + ${p(2 * b)} × ${p(x)} + ${p(c)} = <b>${n(v)}</b>.`]);
      },
      (r) => {
        const x1 = r.int(-6, 6), x2 = r.int(x1 + 1, 8);
        const s = x1 + x2, pr = x1 * x2;
        return numQ(`Résous ${poly([[1, 'x²'], [-s, 'x'], [pr, '']])} = 0. Donne la <b>plus grande</b> racine.`, x2, [`Δ = ${s * s} − 4 × ${p(pr)} = ${s * s - 4 * pr} ; √Δ = ${x2 - x1}.`, `x = ${frac(`${n(s)} ± ${x2 - x1}`, 2)} → x₁ = ${n(x1)} et x₂ = ${n(x2)}.`, `La plus grande racine : <b>${n(x2)}</b>.`], { tip: 'Astuce : deux nombres de somme S et de produit P sont racines de x² − Sx + P = 0.' });
      },
    ],
  },
};

const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]];
const COS = { 10: 0.985, 20: 0.94, 25: 0.906, 30: 0.866, 35: 0.819, 40: 0.766, 50: 0.643, 55: 0.574, 60: 0.5, 70: 0.342 };

function triangleSVG(labels) {
  // triangle rectangle en C (bas gauche), A en haut, B à droite
  return `<svg viewBox="0 0 220 140" class="mech" style="max-width:260px">
    <polygon points="30,120 30,20 190,120" fill="var(--card2)" stroke="currentColor" stroke-width="2"/>
    <rect x="30" y="108" width="12" height="12" fill="none" stroke="currentColor"/>
    <text x="18" y="18" font-size="13" fill="currentColor">A</text><text x="16" y="134" font-size="13" fill="currentColor">C</text><text x="194" y="134" font-size="13" fill="currentColor">B</text>
    <text x="12" y="74" font-size="12" fill="var(--accent)">${labels.ac || ''}</text>
    <text x="110" y="136" font-size="12" text-anchor="middle" fill="var(--accent)">${labels.cb || ''}</text>
    <text x="118" y="62" font-size="12" fill="var(--accent)">${labels.ab || ''}</text>
    ${labels.angB ? `<text x="160" y="114" font-size="11" fill="var(--warn)">${labels.angB}</text>` : ''}
  </svg>`;
}

export const trigo = {
  id: 'trigo',
  title: 'Pythagore et trigonométrie',
  niveau: 'Seconde → Première',
  cours: `
    <h3>1. Théorème de Pythagore</h3>
    <p>Dans un triangle <b>rectangle</b>, le carré de l’hypoténuse (côté opposé à l’angle droit, le plus long) est égal à la somme des carrés des deux autres côtés : <b>${sq('AB')} = ${sq('AC')} + ${sq('CB')}</b>.</p>
    <h3>2. Trigonométrie dans le triangle rectangle : « SOH CAH TOA »</h3>
    <ul><li>sin = <b>O</b>pposé / <b>H</b>ypoténuse</li><li>cos = <b>A</b>djacent / <b>H</b>ypoténuse</li><li>tan = <b>O</b>pposé / <b>A</b>djacent</li></ul>
    <h3>3. Valeurs remarquables</h3>
    <table class="tbl"><tr><th>angle</th><th>0°</th><th>30°</th><th>45°</th><th>60°</th><th>90°</th></tr><tr><td>cos</td><td>1</td><td>√3/2</td><td>√2/2</td><td>1/2</td><td>0</td></tr><tr><td>sin</td><td>0</td><td>1/2</td><td>√2/2</td><td>√3/2</td><td>1</td></tr></table>
    <h3>4. Radians et cercle trigonométrique (Première)</h3>
    <p>180° = π rad. Donc 90° = π/2, 60° = π/3, 45° = π/4, 30° = π/6. Sur le cercle de rayon 1, le point associé à l’angle x a pour coordonnées (cos x ; sin x). Toujours : cos² x + sin² x = 1.</p>
    <h3>5. Application aéro : pente de descente</h3>
    <p>Une approche à 3° : on perd environ 5 % de la distance parcourue en hauteur (tan 3° ≈ 0,052), soit ≈ 300 ft par NM.</p>`,
  methode: `
    <ol><li>Repère l’angle droit puis l’<b>hypoténuse</b>.</li><li>Depuis l’angle étudié, nomme les côtés « opposé » et « adjacent ».</li><li>Choisis la formule qui contient le côté connu ET le côté cherché.</li><li>Pour Pythagore, cherche d’abord si les longueurs forment un triplet connu (3-4-5, 5-12-13, 8-15-17).</li></ol>`,
  templates: {
    1: [
      (r) => {
        const [a, b, c] = r.pick(TRIPLES);
        return numQ(`Triangle ABC rectangle en C avec AC = ${a} et CB = ${b}. Calcule l’hypoténuse AB.`, c, [`Pythagore : ${sq('AB')} = ${sq('AC')} + ${sq('CB')} = ${a * a} + ${b * b} = ${c * c}.`, `AB = ${sqrt(c * c)} = <b>${c}</b>.`], { visual: triangleSVG({ ac: a, cb: b, ab: '?' }) });
      },
      (r) => {
        const [a, b, c] = r.pick(TRIPLES);
        return numQ(`Triangle ABC rectangle en C, hypoténuse AB = ${c} et AC = ${a}. Calcule CB.`, b, [`${sq('CB')} = ${sq('AB')} − ${sq('AC')} = ${c * c} − ${a * a} = ${b * b}.`, `CB = <b>${b}</b>.`], { visual: triangleSVG({ ac: a, cb: '?', ab: c }) });
      },
      (r) => {
        const which = r.pick(['sin', 'cos', 'tan']);
        const good = { sin: 'AC / AB', cos: 'CB / AB', tan: 'AC / CB' }[which];
        return mcqQ(r, `Dans le triangle ABC rectangle en C, que vaut ${which}(B̂) ?`, good, ['AC / AB', 'CB / AB', 'AC / CB', 'CB / AC', 'AB / AC'], [`Depuis l’angle B : hypoténuse = AB, côté opposé = AC, côté adjacent = CB.`, `${which} = ${{ sin: 'opposé / hypoténuse', cos: 'adjacent / hypoténuse', tan: 'opposé / adjacent' }[which]} = <b>${good}</b>.`], { visual: triangleSVG({ angB: 'B̂' }), tip: 'SOH CAH TOA.' });
      },
    ],
    2: [
      (r) => {
        const ang = r.pick(Object.keys(COS).map(Number)), h = r.pick([5, 8, 10, 12, 20, 50]);
        const v = h * COS[ang];
        return numQ(`ABC rectangle en C, AB = ${h} et B̂ = ${ang}°. Calcule CB (arrondi au dixième). Donnée : cos(${ang}°) ≈ ${n(COS[ang])}.`, Math.round(v * 10) / 10, [`CB est le côté adjacent à B̂, AB l’hypoténuse : cos B̂ = CB / AB.`, `CB = AB × cos B̂ = ${h} × ${n(COS[ang])} = ${n(v, 3)}.`, `Arrondi : <b>${n(Math.round(v * 10) / 10)}</b>.`], { tol: 0.11, visual: triangleSVG({ ab: h, cb: '?', angB: ang + '°' }) });
      },
      (r) => {
        const [ang, ratio] = r.pick([[60, '1/2'], [30, '√3/2'], [45, '√2/2']]);
        const good = `${ang}°`;
        return mcqQ(r, `Quel angle aigu a pour cosinus ${ratio} ?`, good, ['30°', '45°', '60°', '90°'], [`Valeurs remarquables : cos 30° = √3/2, cos 45° = √2/2, cos 60° = 1/2.`, `Donc <b>${good}</b>.`]);
      },
      (r) => {
        const [a, , c] = r.pick(TRIPLES);
        return numQ(`ABC rectangle en C, AC = ${a}, AB = ${c}. Calcule sin(B̂) (fraction ou décimal).`, a / c, [`sin B̂ = opposé / hypoténuse = AC / AB.`, `= ${frac(a, c)} = <b>${fracN(a, c)}</b> = ${n(a / c, 3)}.`], { accept: acceptFrac(a, c), answerText: fracText(a, c) });
      },
    ],
    3: [
      (r) => {
        const d = r.pick([30, 45, 60, 90, 120, 135, 150, 180, 270, 360]);
        const g = gcd(d, 180);
        const num = d / g, den = 180 / g;
        const good = `${num === 1 ? '' : num}π${den === 1 ? '' : '/' + den}`;
        const alt = (k, m) => `${k === 1 ? '' : k}π${m === 1 ? '' : '/' + m}`;
        return mcqQ(r, `Convertis ${d}° en radians.`, good, [alt(den, num), alt(num, den * 2), alt(num * 2, den), alt(num + 1, den)], [`180° = π rad, donc ${d}° = ${frac(d, 180)} π.`, `${frac(d, 180)} = ${fracN(d, 180)} → <b>${good}</b> rad.`]);
      },
      (r) => {
        const items = [
          ['cos(π/3)', '1/2'], ['sin(π/6)', '1/2'], ['cos(π/4)', '√2/2'], ['sin(π/3)', '√3/2'], ['cos(π)', '−1'], ['sin(π/2)', '1'], ['cos(π/2)', '0'], ['cos(2π/3)', '−1/2'], ['sin(5π/6)', '1/2'], ['cos(5π/6)', '−√3/2'],
        ];
        const [e, v] = r.pick(items);
        return mcqQ(r, `Que vaut ${e} ?`, v, r.shuffle(['1/2', '−1/2', '√2/2', '√3/2', '−√3/2', '0', '1', '−1']), [`Place l’angle sur le cercle trigonométrique : cos = abscisse, sin = ordonnée.`, `${e} = <b>${v}</b>.`], { tip: 'Les angles « de la gauche » (entre π/2 et π) ont un cosinus négatif et un sinus positif.' });
      },
      (r) => {
        const nm = r.pick([2, 3, 4, 5, 6, 8, 10]);
        const ft = nm * 300;
        return numQ(`En finale avec une pente de 3°, on descend d’environ 300 ft par NM. Quelle hauteur (en ft) faut-il avoir à ${nm} NM du seuil de piste ?`, ft, [`Proportionnalité : ${nm} NM × 300 ft/NM = <b>${ft} ft</b>.`, `Origine du 300 ft : 1 NM ≈ 6 076 ft et tan 3° ≈ 0,052 → 6 076 × 0,052 ≈ 318 ft, arrondi à 300.`]);
      },
      (r) => {
        const [a, b, c] = r.pick(TRIPLES);
        return numQ(`Sachant que cos x = ${frac(a, c)} et que x est aigu, calcule sin x (fraction).`, b / c, [`cos² x + sin² x = 1 → sin² x = 1 − ${frac(a * a, c * c)} = ${frac(c * c - a * a, c * c)}.`, `x aigu → sin x &gt; 0 : sin x = ${frac(sqrt(b * b), c)} = <b>${fracN(b, c)}</b>.`], { accept: acceptFrac(b, c), answerText: fracText(b, c) });
      },
    ],
  },
};

export const vecteurs = {
  id: 'vecteurs',
  title: 'Vecteurs',
  niveau: 'Seconde → Première',
  cours: `
    <h3>1. Coordonnées d’un vecteur</h3>
    <p>Pour A(x<sub>A</sub> ; y<sub>A</sub>) et B(x<sub>B</sub> ; y<sub>B</sub>) : <b>AB⃗ (x<sub>B</sub> − x<sub>A</sub> ; y<sub>B</sub> − y<sub>A</sub>)</b>. « Arrivée moins départ ».</p>
    <h3>2. Opérations</h3>
    <ul><li>Somme : u⃗(x ; y) + v⃗(x′ ; y′) = (x + x′ ; y + y′).</li><li>Produit par un réel : k u⃗ = (kx ; ky).</li><li>Relation de Chasles : AB⃗ + BC⃗ = AC⃗.</li></ul>
    <h3>3. Norme (longueur)</h3>
    <p>‖u⃗‖ = √(x² + y²). AB = √((x<sub>B</sub> − x<sub>A</sub>)² + (y<sub>B</sub> − y<sub>A</sub>)²).</p>
    <h3>4. Milieu</h3><p>Milieu de [AB] : ((x<sub>A</sub> + x<sub>B</sub>)/2 ; (y<sub>A</sub> + y<sub>B</sub>)/2).</p>
    <h3>5. Colinéarité</h3><p>u⃗(x ; y) et v⃗(x′ ; y′) sont colinéaires ⇔ <b>xy′ − yx′ = 0</b> (déterminant nul).</p>
    <h3>6. Produit scalaire (Première)</h3><p>u⃗·v⃗ = xx′ + yy′. Si u⃗·v⃗ = 0, les vecteurs sont orthogonaux.</p>
    <h3>7. Application : le vent</h3><p>La vitesse sol d’un avion = vecteur vitesse air + vecteur vent : c’est une somme de vecteurs (triangle des vitesses).</p>`,
  methode: `<ol><li>Écris toujours « arrivée − départ » pour les coordonnées.</li><li>Fais un petit schéma, même à main levée.</li><li>Pour la colinéarité, calcule le déterminant ; pour l’orthogonalité, le produit scalaire.</li></ol>`,
  templates: {
    1: [
      (r) => {
        const xa = r.int(-6, 6), ya = r.int(-6, 6), xb = r.int(-6, 6), yb = r.int(-6, 6);
        const good = `(${n(xb - xa)} ; ${n(yb - ya)})`;
        return mcqQ(r, `A(${n(xa)} ; ${n(ya)}), B(${n(xb)} ; ${n(yb)}). Coordonnées de AB⃗ ?`, good, [`(${n(xa - xb)} ; ${n(ya - yb)})`, `(${n(xb + xa)} ; ${n(yb + ya)})`, `(${n(yb - ya)} ; ${n(xb - xa)})`, `(${n(xb - xa)} ; ${n(ya - yb)})`], [`AB⃗ = (x<sub>B</sub> − x<sub>A</sub> ; y<sub>B</sub> − y<sub>A</sub>) = (${n(xb)} − ${p(xa)} ; ${n(yb)} − ${p(ya)}).`, `= <b>${good}</b>.`]);
      },
      (r) => {
        const a = r.int(-5, 5), b = r.int(-5, 5), c = r.int(-5, 5), d = r.int(-5, 5);
        const good = `(${n(a + c)} ; ${n(b + d)})`;
        return mcqQ(r, `u⃗(${n(a)} ; ${n(b)}) et v⃗(${n(c)} ; ${n(d)}). Coordonnées de u⃗ + v⃗ ?`, good, [`(${n(a - c)} ; ${n(b - d)})`, `(${n(a * c)} ; ${n(b * d)})`, `(${n(a + b)} ; ${n(c + d)})`, `(${n(a + c)} ; ${n(b - d)})`], [`On additionne les abscisses : ${n(a)} + ${p(c)} = ${n(a + c)}.`, `Puis les ordonnées : ${n(b)} + ${p(d)} = ${n(b + d)} → <b>${good}</b>.`]);
      },
      (r) => {
        const k = r.int(-4, 4) || 2, a = r.int(-5, 5), b = r.int(-5, 5);
        return numQ(`u⃗(${n(a)} ; ${n(b)}). Quelle est l’<b>abscisse</b> de ${n(k)}u⃗ ?`, k * a, [`${n(k)}u⃗ = (${n(k)} × ${p(a)} ; ${n(k)} × ${p(b)}) = (${n(k * a)} ; ${n(k * b)}).`, `Abscisse : <b>${n(k * a)}</b>.`]);
      },
    ],
    2: [
      (r) => {
        const [x, y, nn] = r.pick(TRIPLES);
        const sx = r.sign(), sy = r.sign();
        return numQ(`Calcule la norme de u⃗(${n(sx * x)} ; ${n(sy * y)}).`, nn, [`‖u⃗‖ = √(${p(sx * x)}² + ${p(sy * y)}²) = √(${x * x} + ${y * y}) = √${nn * nn}.`, `= <b>${nn}</b>.`]);
      },
      (r) => {
        const xa = r.int(-8, 8), xb = r.int(-8, 8), ya = r.int(-8, 8), yb = r.int(-8, 8);
        return numQ(`A(${n(xa)} ; ${n(ya)}) et B(${n(xb)} ; ${n(yb)}). Abscisse du milieu de [AB] ?`, (xa + xb) / 2, [`x<sub>I</sub> = ${frac(`${n(xa)} + ${p(xb)}`, 2)} = ${frac(n(xa + xb), 2)} = <b>${n((xa + xb) / 2)}</b>.`]);
      },
      (r) => {
        const a = r.int(-4, 4) || 1, b = r.int(-4, 4) || 2, k = r.pick([2, 3, -2, -1]);
        const col = r.bool();
        const c = col ? k * a : k * a + r.pick([1, -1]), d = k * b;
        const det = a * d - b * c;
        const good = det === 0 ? 'Oui, colinéaires' : 'Non, pas colinéaires';
        return mcqQ(r, `u⃗(${n(a)} ; ${n(b)}) et v⃗(${n(c)} ; ${n(d)}) sont-ils colinéaires ?`, good, ['Oui, colinéaires', 'Non, pas colinéaires'], [`Déterminant : x × y′ − y × x′ = ${n(a)} × ${p(d)} − ${p(b)} × ${p(c)} = ${n(a * d)} − ${p(b * c)} = ${n(det)}.`, `${det === 0 ? 'Nul' : 'Non nul'} → <b>${good}</b>.`], { n: 2 });
      },
    ],
    3: [
      (r) => {
        const a = r.int(-5, 5), b = r.int(-5, 5), c = r.int(-5, 5), d = r.int(-5, 5);
        return numQ(`Calcule le produit scalaire u⃗·v⃗ avec u⃗(${n(a)} ; ${n(b)}) et v⃗(${n(c)} ; ${n(d)}).`, a * c + b * d, [`u⃗·v⃗ = xx′ + yy′ = ${n(a)} × ${p(c)} + ${p(b)} × ${p(d)}.`, `= ${n(a * c)} + ${p(b * d)} = <b>${n(a * c + b * d)}</b>.`]);
      },
      (r) => {
        const a = r.int(1, 5), b = r.int(1, 5) * r.sign(), m = r.int(-5, 5) || 3;
        // u(a ; b), v(m*b... ) chercher y tel que u.v=0 avec v(-b*k ; y): a*(-b) + b*y = 0 -> y = a
        const x = b * m;
        const y = (-a * x) / b;
        return numQ(`u⃗(${n(a)} ; ${n(b)}) et v⃗(${n(x)} ; y). Pour quelle valeur de y sont-ils orthogonaux ?`, y, [`Orthogonaux ⇔ u⃗·v⃗ = 0 : ${n(a)} × ${p(x)} + ${p(b)} × y = 0.`, `${n(a * x)} + ${p(b)}y = 0 → y = ${frac(n(-a * x), n(b))} = <b>${n(y)}</b>.`]);
      },
      (r) => {
        const good = 'AC⃗';
        const [X, Y, Z] = r.pick([['A', 'B', 'C'], ['A', 'D', 'C']]);
        return mcqQ(r, `Simplifie : ${X}${Y}⃗ + ${Y}${Z}⃗`, good, ['CA⃗', `${X}${Y}⃗`, '0⃗', `${Y}${Z}⃗`], [`Relation de Chasles : le point « intermédiaire » ${Y} disparaît.`, `${X}${Y}⃗ + ${Y}${Z}⃗ = <b>${good}</b>.`]);
      },
      (r) => {
        const air = r.pick([100, 120, 150, 200]), w = r.pick([20, 30, 40, 50]), face = r.bool();
        const v = face ? air - w : air + w;
        return numQ(`Un avion vole à ${air} kt (vitesse air) avec un vent de ${w} kt ${face ? '<b>de face</b>' : '<b>arrière</b>'}. Quelle est sa vitesse sol ?`, v, [`Vecteurs de même direction : on ${face ? 'soustrait (sens opposés)' : 'additionne (même sens)'}.`, `${air} ${face ? '−' : '+'} ${w} = <b>${v} kt</b>.`]);
      },
    ],
  },
};

export const probas = {
  id: 'probas',
  title: 'Probabilités',
  niveau: 'Seconde → Première',
  cours: `
    <h3>1. Situation d’équiprobabilité</h3>
    <p>Si toutes les issues ont la même chance : <b>P(A) = nombre d’issues favorables / nombre total d’issues</b>. Une probabilité est toujours entre 0 et 1.</p>
    <h3>2. Événement contraire</h3><p>P(Ā) = 1 − P(A). « Au moins un » se calcule souvent par le contraire de « aucun ».</p>
    <h3>3. Union et intersection</h3><p>P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Si A et B sont incompatibles : P(A ∪ B) = P(A) + P(B).</p>
    <h3>4. Expériences à plusieurs étapes (arbres)</h3><p>On <b>multiplie</b> les probabilités le long d’une branche, on <b>additionne</b> les branches qui mènent au même résultat. Avec remise : les probabilités ne changent pas. Sans remise : elles changent à chaque tirage.</p>
    <h3>5. Probabilités conditionnelles (Première)</h3><p>P<sub>A</sub>(B) = P(A ∩ B) / P(A) : probabilité de B sachant A.</p>
    <h3>6. Espérance</h3><p>E(X) = Σ x<sub>i</sub> × P(X = x<sub>i</sub>) : la valeur moyenne qu’on obtiendrait en répétant l’expérience un grand nombre de fois.</p>`,
  methode: `<ol><li>Décris l’univers : combien d’issues au total ?</li><li>Compte les issues favorables (fais une liste ou un tableau si besoin).</li><li>Pour plusieurs étapes, fais un <b>arbre</b>.</li><li>Vérifie : le résultat doit être entre 0 et 1.</li></ol><p class="tip">Les réponses se saisissent en fraction (ex. 3/8) ou en décimal.</p>`,
  templates: {
    1: [
      (r) => {
        const R = r.int(1, 8), B = r.int(1, 8), V = r.int(0, 6);
        const tot = R + B + V;
        const col = r.pick(['rouge', 'bleue']);
        const k = col === 'rouge' ? R : B;
        return numQ(`Une urne contient ${R} boules rouges, ${B} bleues${V ? ` et ${V} vertes` : ''}. On tire une boule au hasard. P(${col}) ?`, k / tot, [`Total : ${tot} boules ; favorables : ${k}.`, `P = ${frac(k, tot)} = <b>${fracN(k, tot)}</b>.`], { accept: acceptFrac(k, tot), answerText: fracText(k, tot) });
      },
      (r) => {
        const ev = r.pick([['un nombre pair', [2, 4, 6]], ['un multiple de 3', [3, 6]], ['un nombre supérieur à 4', [5, 6]], ['un nombre premier', [2, 3, 5]], ['un 6', [6]]]);
        return numQ(`On lance un dé équilibré à 6 faces. Probabilité d’obtenir ${ev[0]} ?`, ev[1].length / 6, [`Issues favorables : ${ev[1].join(', ')} → ${ev[1].length} sur 6.`, `P = ${frac(ev[1].length, 6)} = <b>${fracN(ev[1].length, 6)}</b>.`], { accept: acceptFrac(ev[1].length, 6), answerText: fracText(ev[1].length, 6) });
      },
      (r) => {
        const pa = r.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6, 0.72]);
        return numQ(`La probabilité qu’un vol soit retardé est ${n(pa)}. Probabilité qu’il ne soit pas retardé ?`, 1 - pa, [`Événement contraire : P(Ā) = 1 − P(A).`, `1 − ${n(pa)} = <b>${n(1 - pa)}</b>.`]);
      },
    ],
    2: [
      (r) => {
        const R = r.int(2, 6), B = r.int(2, 6), tot = R + B;
        return numQ(`Urne : ${R} rouges et ${B} bleues. On tire 2 boules <b>avec remise</b>. P(deux rouges) ?`, (R * R) / (tot * tot), [`Chaque tirage : P(rouge) = ${frac(R, tot)}.`, `Avec remise, on multiplie : ${frac(R, tot)} × ${frac(R, tot)} = ${frac(R * R, tot * tot)} = <b>${fracN(R * R, tot * tot)}</b>.`], { accept: acceptFrac(R * R, tot * tot), answerText: fracText(R * R, tot * tot) });
      },
      (r) => {
        const L = r.int(2, 4), c = r.pick([['chiffres', 10], ['lettres (A à Z)', 26]]);
        return numQ(`Combien de codes différents de ${L} ${c[0]} peut-on former (répétitions autorisées) ?`, c[1] ** L, [`${c[1]} choix pour chaque position, ${L} positions.`, `${Array(L).fill(c[1]).join(' × ')} = <b>${n(c[1] ** L)}</b>.`]);
      },
      (r) => {
        const pa = r.pick([0.3, 0.4, 0.5, 0.6]), pb = r.pick([0.2, 0.3, 0.4, 0.5]), pab = r.pick([0.1, 0.15, 0.2].filter((x) => x <= Math.min(pa, pb)));
        return numQ(`P(A) = ${n(pa)}, P(B) = ${n(pb)}, P(A ∩ B) = ${n(pab)}. Calcule P(A ∪ B).`, pa + pb - pab, [`P(A ∪ B) = P(A) + P(B) − P(A ∩ B).`, `= ${n(pa)} + ${n(pb)} − ${n(pab)} = <b>${n(pa + pb - pab)}</b>.`], { tol: 1e-6, tip: 'On retire l’intersection, sinon elle est comptée deux fois.' });
      },
    ],
    3: [
      (r) => {
        const R = r.int(2, 6), B = r.int(2, 6), tot = R + B;
        return numQ(`Urne : ${R} rouges et ${B} bleues. On tire 2 boules <b>sans remise</b>. P(deux rouges) ?`, (R * (R - 1)) / (tot * (tot - 1)), [`1er tirage : P(rouge) = ${frac(R, tot)}.`, `2e tirage (il reste ${R - 1} rouges sur ${tot - 1}) : ${frac(R - 1, tot - 1)}.`, `P = ${frac(R, tot)} × ${frac(R - 1, tot - 1)} = ${frac(R * (R - 1), tot * (tot - 1))} = <b>${fracN(R * (R - 1), tot * (tot - 1))}</b>.`], { accept: acceptFrac(R * (R - 1), tot * (tot - 1)), answerText: fracText(R * (R - 1), tot * (tot - 1)) });
      },
      (r) => {
        const g = r.pick([5, 10, 20]), pw = r.pick([[1, 4], [1, 5], [1, 10], [1, 2]]), cost = r.pick([1, 2, 3, 5]);
        const E = (g * pw[0]) / pw[1] - cost;
        return numQ(`Un jeu coûte ${cost} €. On gagne ${g} € avec une probabilité ${frac(...pw)}, sinon rien. Espérance du gain net (en €) ?`, E, [`Gain net : ${g - cost} € avec P = ${frac(...pw)}, et −${cost} € avec P = ${frac(pw[1] - pw[0], pw[1])}.`, `E = ${g - cost} × ${frac(...pw)} + (−${cost}) × ${frac(pw[1] - pw[0], pw[1])} = <b>${n(E)} €</b>.`, E < 0 ? 'Espérance négative : le jeu est perdant en moyenne.' : E > 0 ? 'Espérance positive : le jeu est favorable au joueur.' : 'Jeu équitable.']);
      },
      (r) => {
        const pa = r.pick([0.2, 0.3, 0.4, 0.5, 0.6]), pba = r.pick([0.1, 0.2, 0.25, 0.5, 0.8]);
        return numQ(`P(A) = ${n(pa)} et P<sub>A</sub>(B) = ${n(pba)}. Calcule P(A ∩ B).`, pa * pba, [`P(A ∩ B) = P(A) × P<sub>A</sub>(B) (on multiplie le long de la branche).`, `= ${n(pa)} × ${n(pba)} = <b>${n(pa * pba)}</b>.`], { tol: 1e-6 });
      },
      (r) => {
        const p1 = r.pick([0.1, 0.2, 0.5]), k = r.int(2, 3);
        const v = 1 - (1 - p1) ** k;
        return numQ(`Un test a une probabilité ${n(p1)} d’être réussi à chaque tentative (tentatives indépendantes). P(au moins une réussite en ${k} tentatives) ?`, v, [`Contraire : « aucune réussite » = ${n(1 - p1)}<sup>${k}</sup> = ${n((1 - p1) ** k)}.`, `P = 1 − ${n((1 - p1) ** k)} = <b>${n(v)}</b>.`], { tol: 1e-6 });
      },
    ],
  },
};
