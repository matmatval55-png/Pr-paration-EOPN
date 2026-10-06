// Chapitres : équations, pourcentages, proportionnalité.
import { n, p, frac, fracN } from '../core/fmt.js';
import { numQ, mcqQ, acceptFrac, fracText, poly } from './helpers.js';

export const equations = {
  id: 'equations',
  title: 'Équations et inéquations',
  niveau: 'Seconde',
  cours: `
    <h3>1. Le principe</h3>
    <p>Résoudre une équation, c’est trouver la valeur de x qui rend l’égalité vraie. On peut faire la <b>même opération des deux côtés</b> sans changer les solutions : ajouter, soustraire, multiplier ou diviser (par un nombre non nul).</p>
    <div class="ex">3x + 5 = 20 → on retire 5 : 3x = 15 → on divise par 3 : x = 5. Vérification : 3 × 5 + 5 = 20 ✓</div>
    <h3>2. x des deux côtés</h3>
    <p>On regroupe les x d’un côté, les nombres de l’autre : 5x − 3 = 2x + 9 → 5x − 2x = 9 + 3 → 3x = 12 → x = 4.</p>
    <h3>3. Équation produit nul</h3>
    <p>Un produit est nul si et seulement si l’un des facteurs est nul : (x − 2)(x + 5) = 0 ⇔ x = 2 ou x = −5.</p>
    <h3>4. Inéquations</h3>
    <p>Mêmes règles, avec une exception : si on <b>multiplie ou divise par un négatif</b>, on <b>change le sens</b> de l’inégalité. −2x &lt; 6 → x &gt; −3.</p>
    <h3>5. Systèmes de deux équations</h3>
    <p>Par <b>substitution</b> (exprimer y en fonction de x puis remplacer) ou par <b>combinaison</b> (additionner les équations pour éliminer une inconnue).</p>`,
  methode: `
    <ol><li>Développe et réduis chaque membre si besoin.</li><li>Passe les termes en x à gauche, les nombres à droite (en changeant leur signe quand ils changent de côté).</li><li>Divise par le coefficient de x.</li><li><b>Vérifie</b> en remplaçant x dans l’équation de départ : c’est rapide et ça évite la plupart des erreurs.</li></ol>
    <p class="tip">Pour un problème rédigé : 1) choisis l’inconnue, 2) traduis l’énoncé en équation, 3) résous, 4) réponds par une phrase.</p>`,
  templates: {
    1: [
      (r) => {
        const x = r.int(-10, 15), a = r.int(1, 20);
        return numQ(`Résous : x + ${a} = ${x + a}`, x, [`On retire ${a} des deux côtés : x = ${x + a} − ${a}.`, `x = <b>${x}</b>. Vérif : ${p(x)} + ${a} = ${x + a} ✓`]);
      },
      (r) => {
        const x = r.int(-9, 12), a = r.int(2, 9) * r.sign();
        return numQ(`Résous : ${n(a)}x = ${n(a * x)}`, x, [`On divise les deux côtés par ${p(a)} : x = ${frac(n(a * x), n(a))}.`, `x = <b>${x}</b>.`]);
      },
      (r) => {
        const x = r.int(-6, 10), a = r.int(2, 9), b = r.int(1, 20) * r.sign();
        return numQ(`Résous : ${a}x ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${a * x + b}`, x, [`On ${b > 0 ? 'retire' : 'ajoute'} ${Math.abs(b)} : ${a}x = ${a * x + b} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = ${a * x}.`, `On divise par ${a} : x = <b>${x}</b>.`, `Vérif : ${a} × ${p(x)} ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${a * x + b} ✓`]);
      },
    ],
    2: [
      (r) => {
        const x = r.int(-8, 10), a = r.int(3, 9), c = r.int(1, a - 1), b = r.int(-15, 15), d = (a - c) * x + b;
        return numQ(`Résous : ${poly([[a, 'x'], [b, '']])} = ${poly([[c, 'x'], [d, '']])}`, x, [`On regroupe les x à gauche : ${a}x − ${c}x = ${a - c}x.`, `Les nombres à droite : ${n(d)} − ${p(b)} = ${n(d - b)}.`, `${a - c}x = ${n(d - b)} → x = <b>${x}</b>.`]);
      },
      (r) => {
        const x = r.int(-6, 10), a = r.int(2, 6), b = r.int(-9, 9) || 2;
        return numQ(`Résous : ${a}(x ${b > 0 ? '+' : '−'} ${Math.abs(b)}) = ${a * (x + b)}`, x, [`On divise par ${a} : x ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${x + b}.`, `x = ${x + b} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = <b>${x}</b>.`], { tip: 'Tu peux aussi développer : ' + a + 'x ' + (a * b > 0 ? '+ ' : '− ') + Math.abs(a * b) + ' = ' + a * (x + b) + '.' });
      },
      (r) => {
        const a = r.int(2, 6), q = r.int(-5, 8), x = a * q, b = r.int(1, 10);
        return numQ(`Résous : ${frac('x', a)} + ${b} = ${q + b}`, x, [`On retire ${b} : ${frac('x', a)} = ${q}.`, `On multiplie par ${a} : x = <b>${x}</b>.`]);
      },
      (r) => {
        const a = r.int(2, 7), b = r.int(1, 20), num = r.int(1, 30);
        // ax + b = num -> x = (num - b)/a (fraction possible)
        return numQ(`Résous : ${a}x + ${b} = ${num} (réponse exacte, fraction acceptée)`, (num - b) / a, [`${a}x = ${num} − ${b} = ${num - b}.`, `x = ${frac(num - b, a)} = <b>${fracN(num - b, a)}</b>.`], { accept: acceptFrac(num - b, a), answerText: fracText(num - b, a) });
      },
    ],
    3: [
      (r) => {
        const a = r.int(2, 6) * r.sign(), b = r.int(-12, 12), c = r.int(-12, 12);
        const lim = (c - b) / a;
        const sign = a > 0 ? '<' : '>';
        const L = fracN(c - b, a);
        const good = `x ${sign} ${L}`;
        return mcqQ(r, `Résous l’inéquation : ${poly([[a, 'x'], [b, '']])} &lt; ${n(c)}`, good, [`x ${a > 0 ? '>' : '<'} ${L}`, `x ${sign} ${fracN(b - c, a)}`, `x ${sign} ${fracN(c + b, a)}`], [`On ${b >= 0 ? 'retire' : 'ajoute'} ${Math.abs(b)} : ${n(a)}x &lt; ${n(c - b)}.`, `On divise par ${p(a)}${a < 0 ? ' : <b>négatif → on change le sens</b>' : ' (positif, le sens ne change pas)'}.`, `<b>${good}</b> (limite ≈ ${n(lim, 2)}).`]);
      },
      (r) => {
        const x = r.int(-5, 8), y = r.int(-5, 8), a = r.int(1, 3), b = r.int(1, 3);
        // x + y = s ; a x - b y = t
        const s = x + y, t = a * x - b * y;
        return numQ(`Résous le système et donne <b>x</b> :<br>x + y = ${s}<br>${a === 1 ? '' : a}x − ${b === 1 ? '' : b}y = ${t}`, x, [`De la 1re équation : y = ${s} − x.`, `On remplace : ${a}x − ${b}(${s} − x) = ${t} → ${a + b}x − ${b * s} = ${t}.`, `${a + b}x = ${t + b * s} → x = <b>${x}</b> (et y = ${y}).`]);
      },
      (r) => {
        const a = r.int(-6, 6), b = r.int(-6, 6);
        const fact = (v) => (v === 0 ? 'x' : `(x ${v > 0 ? '−' : '+'} ${Math.abs(v)})`);
        const sols = [...new Set([a, b])].sort((u, v) => u - v);
        const good = sols.map(n).join(' et ');
        const bad1 = [...new Set([-a, -b])].sort((u, v) => u - v).map(n).join(' et ');
        return mcqQ(r, `Résous : ${fact(a)}${fact(b)} = 0`, good, [bad1, `${n(a)} seulement`, `${n(-a)} et ${n(b)}`, `${n(a * b)}`], [`Produit nul : un des facteurs est nul.`, `${fact(a)} = 0 → x = ${n(a)} ; ${fact(b)} = 0 → x = ${n(b)}.`, `Solutions : <b>${good}</b>.`], { tip: 'Piège : (x − 3) = 0 donne x = +3, pas −3.' });
      },
      (r) => {
        const x = r.int(5, 20), k = r.int(2, 4), s = x + k * x + r.int(0, 0);
        return numQ(`Paul a ${k} fois plus de flashcards que Léa. À eux deux ils en ont ${s}. Combien Léa en a-t-elle ?`, x, [`Soit x le nombre de Léa ; Paul en a ${k}x.`, `x + ${k}x = ${s} → ${k + 1}x = ${s}.`, `x = ${s} ÷ ${k + 1} = <b>${x}</b>.`]);
      },
    ],
  },
};

export const pourcentages = {
  id: 'pourcentages',
  title: 'Pourcentages',
  niveau: 'Seconde',
  cours: `
    <h3>1. Prendre un pourcentage</h3>
    <p>p % de X = ${frac('p', 100)} × X. 15 % de 80 = 0,15 × 80 = 12.</p>
    <h3>2. Calculer un pourcentage</h3>
    <p>a représente ${frac('a', 'b')} × 100 % de b. 12 sur 48 = ${frac(12, 48)} = 0,25 = 25 %.</p>
    <h3>3. Coefficient multiplicateur (CM)</h3>
    <ul><li>Augmenter de t % ⇔ multiplier par <b>1 + t/100</b> (+20 % → × 1,2).</li><li>Diminuer de t % ⇔ multiplier par <b>1 − t/100</b> (−15 % → × 0,85).</li></ul>
    <h3>4. Taux d’évolution</h3>
    <p>t = ${frac('V<sub>arrivée</sub> − V<sub>départ</sub>', 'V<sub>départ</sub>')} × 100. De 50 à 60 : (60 − 50)/50 = 0,2 → +20 %.</p>
    <h3>5. Évolutions successives</h3>
    <p>On <b>multiplie</b> les CM (on n’additionne pas les pourcentages !). +10 % puis +10 % : 1,1 × 1,1 = 1,21 → +21 %.</p>
    <h3>6. Évolution réciproque</h3>
    <p>Pour annuler une hausse de 25 % (CM 1,25), il faut multiplier par 1/1,25 = 0,8 → baisse de 20 %.</p>`,
  methode: `
    <ol><li>Transforme chaque pourcentage en <b>coefficient multiplicateur</b>.</li><li>Valeur finale = valeur initiale × CM ; valeur initiale = valeur finale ÷ CM.</li><li>Pour lire un CM : 1,08 → +8 % ; 0,92 → −8 % ; 1,5 → +50 %.</li></ol>
    <p class="tip">Calcul mental : 10 % = diviser par 10 ; 5 % = la moitié de 10 % ; 1 % = diviser par 100.</p>`,
  templates: {
    1: [
      (r) => {
        const t = r.pick([5, 10, 15, 20, 25, 30, 40, 50, 75]), b = r.pick([20, 40, 60, 80, 120, 200, 240, 360, 500]);
        return numQ(`Calcule ${t} % de ${b}.`, (t * b) / 100, [`${t} % = ${frac(t, 100)} = ${n(t / 100)}.`, `${n(t / 100)} × ${b} = <b>${n((t * b) / 100)}</b>.`], { tip: `Astuce : 10 % de ${b} = ${n(b / 10)}.` });
      },
      (r) => {
        const b = r.pick([20, 25, 40, 50, 80, 200]), t = r.pick([10, 20, 25, 40, 50, 60, 75]), a = (b * t) / 100;
        return numQ(`${n(a)} élèves sur ${b} ont le BIA. Quel pourcentage cela représente-t-il ?`, t, [`Proportion : ${frac(n(a), b)} = ${n(a / b)}.`, `${n(a / b)} × 100 = <b>${t} %</b>.`]);
      },
      (r) => {
        const b = r.pick([40, 50, 80, 120, 150, 200, 250]), t = r.pick([10, 20, 25, 30, 50]);
        return numQ(`Un prix de ${b} € augmente de ${t} %. Nouveau prix ?`, b * (1 + t / 100), [`Hausse : ${t} % de ${b} = ${n((b * t) / 100)} €.`, `${b} + ${n((b * t) / 100)} = <b>${n(b * (1 + t / 100))} €</b>.`, `Plus rapide : ${b} × ${n(1 + t / 100)}.`]);
      },
    ],
    2: [
      (r) => {
        const t = r.int(1, 60) * r.sign();
        const cm = 1 + t / 100;
        return numQ(`Quel est le coefficient multiplicateur associé à une ${t > 0 ? 'hausse' : 'baisse'} de ${Math.abs(t)} % ?`, cm, [`CM = 1 ${t > 0 ? '+' : '−'} ${frac(Math.abs(t), 100)} = 1 ${t > 0 ? '+' : '−'} ${n(Math.abs(t) / 100)} = <b>${n(cm)}</b>.`]);
      },
      (r) => {
        const v0 = r.pick([40, 50, 80, 100, 120, 200, 250, 400]), t = r.pick([-50, -40, -25, -20, -10, 5, 10, 15, 20, 25, 50, 60]);
        const v1 = v0 * (1 + t / 100);
        return numQ(`Une valeur passe de ${v0} à ${n(v1)}. Quel est le taux d’évolution (en %) ?`, t, [`t = ${frac(`${n(v1)} − ${v0}`, v0)} = ${frac(n(v1 - v0), v0)} = ${n(t / 100)}.`, `Soit <b>${t > 0 ? '+' : ''}${t} %</b>.`], { tip: 'Une baisse donne un taux négatif : tape le signe « − ».' });
      },
      (r) => {
        const b = r.pick([60, 80, 120, 150, 200, 240, 300]), t = r.pick([10, 15, 20, 25, 30, 40]);
        return numQ(`Un article à ${b} € est soldé à −${t} %. Prix soldé ?`, b * (1 - t / 100), [`CM = 1 − ${n(t / 100)} = ${n(1 - t / 100)}.`, `${b} × ${n(1 - t / 100)} = <b>${n(b * (1 - t / 100))} €</b>.`]);
      },
    ],
    3: [
      (r) => {
        const t1 = r.pick([10, 20, 25, 50, -10, -20]), t2 = r.pick([10, 20, -10, -20, -25, 50]);
        const cm = (1 + t1 / 100) * (1 + t2 / 100);
        const t = Math.round((cm - 1) * 10000) / 100;
        return numQ(`Une valeur évolue de ${t1 > 0 ? '+' : ''}${t1} %, puis de ${t2 > 0 ? '+' : ''}${t2} %. Quel est le taux global (en %) ?`, t, [`CM global = ${n(1 + t1 / 100)} × ${n(1 + t2 / 100)} = ${n(cm)}.`, `Taux = (${n(cm)} − 1) × 100 = <b>${n(t)} %</b>.`], { tip: 'On ne fait JAMAIS la somme des pourcentages (' + (t1 + t2) + ' % serait faux).' });
      },
      (r) => {
        const t = r.pick([25, 100, -20, -50, 60, -60]);
        const cm = 1 + t / 100, inv = 1 / cm;
        const tr = Math.round((inv - 1) * 10000) / 100;
        return numQ(`Après une ${t > 0 ? 'hausse' : 'baisse'} de ${Math.abs(t)} %, quel taux (en %) permet de revenir à la valeur de départ ?`, tr, [`CM de départ : ${n(cm)}. CM réciproque : 1 ÷ ${n(cm)} = ${n(inv)}.`, `Taux = (${n(inv)} − 1) × 100 = <b>${n(tr)} %</b>.`]);
      },
      (r) => {
        const v0 = r.pick([40, 80, 120, 200, 250, 400, 500]), t = r.pick([10, 20, 25, -20, -25, 50]);
        const v1 = v0 * (1 + t / 100);
        return numQ(`Après une ${t > 0 ? 'hausse' : 'baisse'} de ${Math.abs(t)} %, un prix vaut ${n(v1)} €. Quel était le prix initial ?`, v0, [`V<sub>finale</sub> = V<sub>initiale</sub> × CM, donc V<sub>initiale</sub> = V<sub>finale</sub> ÷ CM.`, `${n(v1)} ÷ ${n(1 + t / 100)} = <b>${v0} €</b>.`], { tip: 'Piège : retirer ' + Math.abs(t) + ' % de ' + n(v1) + ' ne redonne pas le prix initial.' });
      },
    ],
  },
};

export const proportionnalite = {
  id: 'proportionnalite',
  title: 'Proportionnalité et grandeurs',
  niveau: 'Seconde',
  cours: `
    <h3>1. Situation de proportionnalité</h3>
    <p>Deux grandeurs sont proportionnelles si on passe de l’une à l’autre en multipliant toujours par le même nombre (le coefficient). Ex. : prix = 1,8 × litres.</p>
    <h3>2. Règle de trois / produit en croix</h3>
    <p>Si 4 L coûtent 7,20 €, alors 10 L coûtent : 7,20 ÷ 4 × 10 = 18 €. Dans un tableau de proportionnalité, a/b = c/d ⇔ a × d = b × c.</p>
    <h3>3. Vitesse, distance, temps</h3>
    <p><b>d = v × t</b> ; v = d / t ; t = d / v. Attention aux unités : km/h avec des heures. 1 h 15 = 1,25 h. Conversion : 1 m/s = 3,6 km/h.</p>
    <h3>4. Échelles</h3>
    <p>Échelle 1/50 000 : 1 cm sur la carte = 50 000 cm = 500 m en vrai.</p>
    <h3>5. Proportionnalité inverse</h3>
    <p>Quand une grandeur double et l’autre est divisée par deux (ex. : vitesse et temps de trajet pour une même distance), le <b>produit</b> reste constant.</p>
    <h3>6. Unités utiles en aéronautique</h3>
    <p>1 nœud (kt) = 1 NM/h ≈ 1,852 km/h ; 1 ft ≈ 0,3048 m ; 1 NM = 1 852 m.</p>`,
  methode: `
    <ol><li>Vérifie d’abord que la situation est bien proportionnelle (pas de frais fixes, etc.).</li><li>Utilise le <b>retour à l’unité</b> : valeur pour 1, puis multiplie.</li><li>Écris les unités à chaque ligne : c’est le meilleur moyen de repérer une erreur.</li><li>Convertis les durées en heures décimales : 45 min = 0,75 h ; 20 min = 1/3 h.</li></ol>`,
  templates: {
    1: [
      (r) => {
        const q1 = r.pick([2, 3, 4, 5, 6]), u = r.pick([1.5, 2, 2.5, 3, 4, 1.8]), q2 = r.pick([7, 8, 10, 12, 15]);
        return numQ(`${q1} litres de carburant coûtent ${n(q1 * u)} €. Combien coûtent ${q2} litres ?`, q2 * u, [`Prix d’un litre : ${n(q1 * u)} ÷ ${q1} = ${n(u)} €.`, `${q2} × ${n(u)} = <b>${n(q2 * u)} €</b>.`]);
      },
      (r) => {
        const v = r.pick([60, 80, 90, 100, 120, 150]), t = r.pick([0.5, 1.5, 2, 2.5, 3, 0.25, 1.25]);
        return numQ(`Un véhicule roule à ${v} km/h pendant ${n(t)} h. Quelle distance parcourt-il (en km) ?`, v * t, [`d = v × t = ${v} × ${n(t)}.`, `d = <b>${n(v * t)} km</b>.`]);
      },
      (r) => {
        const e = r.pick([25000, 50000, 100000, 250000]), c = r.int(2, 12);
        const km = (c * e) / 100000;
        return numQ(`Sur une carte au 1/${n(e)}, deux points sont à ${c} cm. Distance réelle en km ?`, km, [`${c} cm × ${n(e)} = ${n(c * e)} cm réels.`, `${n(c * e)} cm = ${n((c * e) / 100)} m = <b>${n(km)} km</b>.`], { tip: '1 km = 100 000 cm.' });
      },
    ],
    2: [
      (r) => {
        const v = r.pick([18, 36, 54, 72, 90, 108, 144]);
        return numQ(`Convertis ${v} km/h en m/s.`, v / 3.6, [`${v} km/h = ${v} 000 m en 3 600 s.`, `${v * 1000} ÷ 3 600 = <b>${n(v / 3.6)} m/s</b> (on divise par 3,6).`]);
      },
      (r) => {
        const d = r.pick([150, 200, 240, 300, 360, 450]), v = r.pick([120, 180, 240, 300]);
        const t = (d / v) * 60;
        if (!Number.isInteger(t)) return proportionnalite.templates[2][1](r);
        return numQ(`Combien de minutes faut-il pour parcourir ${d} km à ${v} km/h ?`, t, [`t = d ÷ v = ${d} ÷ ${v} = ${n(d / v)} h.`, `${n(d / v)} h × 60 = <b>${t} min</b>.`]);
      },
      (r) => {
        const a = r.pick([3, 4, 5, 6, 8]), b = r.pick([12, 15, 18, 20, 24, 30]), c = r.pick([7, 9, 10, 14]);
        return numQ(`Complète le tableau de proportionnalité : ${a} → ${b} ; ${c} → ?`, (b * c) / a, [`Produit en croix : ? = ${frac(`${b} × ${c}`, a)}.`, `= ${frac(b * c, a)} = <b>${fracN(b * c, a)}</b>.`], { accept: acceptFrac(b * c, a), answerText: fracText(b * c, a) });
      },
    ],
    3: [
      (r) => {
        const w = r.pick([2, 3, 4, 6]), d = r.pick([6, 8, 12, 9]), w2 = r.pick([1, 2, 3, 4, 6, 8, 12].filter((x) => x !== w && (w * d) % x === 0));
        return numQ(`${w} mécaniciens révisent un avion en ${d} h. En combien d’heures ${w2} mécaniciens le feraient-ils (même rythme) ?`, (w * d) / w2, [`Travail total : ${w} × ${d} = ${w * d} heures-mécanicien.`, `Avec ${w2} mécaniciens : ${w * d} ÷ ${w2} = <b>${n((w * d) / w2)} h</b>.`], { tip: 'Proportionnalité INVERSE : plus de personnes → moins de temps.' });
      },
      (r) => {
        const c = r.pick([5, 6, 6.5, 7, 8, 4.5]), d = r.pick([150, 250, 320, 400, 450]);
        return numQ(`Une voiture consomme ${n(c)} L aux 100 km. Combien de litres pour ${d} km ?`, (c * d) / 100, [`Pour 1 km : ${n(c)} ÷ 100 = ${n(c / 100)} L.`, `${d} × ${n(c / 100)} = <b>${n((c * d) / 100)} L</b>.`]);
      },
      (r) => {
        const kt = r.pick([100, 120, 150, 200, 250]), t = r.pick([0.5, 1, 1.5, 2]);
        const nm = kt * t, km = nm * 1.852;
        return numQ(`Un avion vole à ${kt} kt (nœuds) pendant ${n(t)} h. Quelle distance en km ? (1 NM = 1,852 km)`, km, [`Distance en milles nautiques : ${kt} × ${n(t)} = ${n(nm)} NM.`, `${n(nm)} × 1,852 = <b>${n(km, 3)} km</b>.`], { tol: 0.6, tip: 'Une réponse arrondie à l’unité est acceptée.' });
      },
    ],
  },
};
