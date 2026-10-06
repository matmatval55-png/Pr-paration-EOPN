// Physique : 7 chapitres au format « cours + méthode + exercices générés corrigés pas à pas ».
import { n, frac, sq, sqrt, pow } from '../core/fmt.js';
import { numQ, mcqQ } from '../maths/helpers.js';

const rel = (x, pc = 0.01) => Math.max(Math.abs(x) * pc, 1e-9);

export const unites = {
  id: 'unites',
  title: 'Unités et conversions',
  niveau: 'Seconde',
  cours: `
    <h3>1. Le Système international (SI)</h3>
    <p>Unités de base : mètre (m), kilogramme (kg), seconde (s), ampère (A), kelvin (K), mole, candela. Les autres unités en découlent : newton (N = kg·m/s²), joule (J = N·m), watt (W = J/s), pascal (Pa = N/m²).</p>
    <h3>2. Préfixes</h3>
    <table class="tbl"><tr><th>G</th><th>M</th><th>k</th><th>h</th><th>c</th><th>m</th><th>µ</th><th>n</th></tr><tr><td>10⁹</td><td>10⁶</td><td>10³</td><td>10²</td><td>10⁻²</td><td>10⁻³</td><td>10⁻⁶</td><td>10⁻⁹</td></tr></table>
    <p>Ex. : 3,5 kW = 3 500 W ; 250 mA = 0,25 A ; 1 013 hPa = 101 300 Pa.</p>
    <h3>3. Vitesses</h3>
    <p>1 m/s = 3,6 km/h. Pour passer de km/h à m/s on <b>divise par 3,6</b> ; de m/s à km/h on <b>multiplie par 3,6</b>.</p>
    <h3>4. Unités aéronautiques</h3>
    <ul><li>1 NM (mille nautique) = 1 852 m ; 1 kt (nœud) = 1 NM/h ≈ 1,852 km/h.</li><li>1 ft (pied) = 0,3048 m ; 1 000 ft ≈ 305 m. Repère rapide : m ≈ ft × 0,3.</li><li>Pression : hPa (hectopascal). Atmosphère standard au niveau de la mer : 1 013,25 hPa, 15 °C.</li></ul>
    <h3>5. Surfaces et volumes</h3>
    <p>1 m² = 10 000 cm² (on élève le facteur au carré : 100²). 1 m³ = 1 000 L ; 1 L = 1 dm³.</p>`,
  methode: `<ol><li>Écris la relation entre les unités (1 km = 1 000 m).</li><li>Demande-toi si le nombre doit grossir ou diminuer (unité plus petite → nombre plus grand).</li><li>Pour les surfaces et volumes, élève le facteur au carré ou au cube.</li><li>Vérifie l’ordre de grandeur : un avion de ligne vole à ~250 m/s, pas à 2,5 m/s.</li></ol>`,
  templates: {
    1: [
      (r) => {
        const v = r.int(2, 95) / 10 * r.pick([1, 10]);
        return numQ(`Convertis ${n(v)} km en mètres.`, v * 1000, [`1 km = 1 000 m.`, `${n(v)} × 1 000 = <b>${n(v * 1000)} m</b>.`]);
      },
      (r) => {
        const v = r.pick([36, 72, 90, 108, 180, 360, 720, 900]);
        return numQ(`Convertis ${v} km/h en m/s.`, v / 3.6, [`On divise par 3,6 (car 1 h = 3 600 s et 1 km = 1 000 m).`, `${v} ÷ 3,6 = <b>${n(v / 3.6)} m/s</b>.`], { tol: 0.06 });
      },
      (r) => {
        const h = r.pick([0.25, 0.5, 0.75, 1.5, 2.25, 1.2, 0.1]);
        return numQ(`Convertis ${n(h)} h en minutes.`, h * 60, [`1 h = 60 min.`, `${n(h)} × 60 = <b>${n(h * 60)} min</b>.`], { tip: '0,5 h = 30 min, pas 50 min !' });
      },
    ],
    2: [
      (r) => {
        const kt = r.pick([100, 120, 150, 200, 250, 450]);
        const v = kt * 1.852;
        return numQ(`Convertis ${kt} kt en km/h (1 kt = 1,852 km/h). Arrondis à l’unité.`, Math.round(v), [`${kt} × 1,852 = ${n(v, 1)} km/h.`, `Arrondi : <b>${Math.round(v)} km/h</b>.`], { tol: 1.01, tip: 'Estimation rapide : kt × 2 − 7 %.' });
      },
      (r) => {
        const ft = r.pick([1000, 2500, 5000, 10000, 3500, 35000]);
        const m = ft * 0.3048;
        return numQ(`Convertis ${n(ft)} ft en mètres (1 ft = 0,3048 m), arrondi à l’unité.`, Math.round(m), [`${n(ft)} × 0,3048 = ${n(m, 1)} m.`, `Arrondi : <b>${n(Math.round(m))} m</b>.`], { tol: 1.01, tip: 'Ordre de grandeur : m ≈ ft × 0,3 (et ft ≈ m × 3,3).' });
      },
      (r) => {
        const [lab, f, unit, base] = r.pick([['kW', 1000, 'W', 'puissance'], ['mA', 0.001, 'A', 'intensité'], ['MHz', 1e6, 'Hz', 'fréquence'], ['hPa', 100, 'Pa', 'pression'], ['kJ', 1000, 'J', 'énergie']]);
        const v = r.int(2, 99) * (f < 1 ? 10 : 1) / (f >= 1e6 ? 10 : 1);
        return numQ(`Convertis ${n(v)} ${lab} en ${unit}.`, v * f, [`Le préfixe ${lab[0]} vaut ${f < 1 ? n(f) : n(f)} (${base}).`, `${n(v)} × ${n(f)} = <b>${n(v * f)} ${unit}</b>.`]);
      },
    ],
    3: [
      (r) => {
        const v = r.int(2, 30) / 10;
        return numQ(`Convertis ${n(v)} m² en cm².`, v * 10000, [`1 m = 100 cm donc 1 m² = 100² = 10 000 cm².`, `${n(v)} × 10 000 = <b>${n(v * 10000)} cm²</b>.`], { tip: 'Piège : ce n’est pas × 100 !' });
      },
      (r) => {
        const v = r.int(2, 90) / 10;
        return numQ(`Un réservoir de ${n(v)} m³ contient combien de litres ?`, v * 1000, [`1 m³ = 1 000 dm³ = 1 000 L.`, `${n(v)} × 1 000 = <b>${n(v * 1000)} L</b>.`]);
      },
      (r) => {
        const ms = r.pick([5, 10, 15, 20, 25, 50]);
        const ftmin = ms * 3.28084 * 60;
        return numQ(`Un avion monte à ${ms} m/s. Quel est son taux de montée en ft/min (arrondi à la centaine) ?`, Math.round(ftmin / 100) * 100, [`${ms} m/s × 60 = ${ms * 60} m/min.`, `1 m ≈ 3,28 ft : ${ms * 60} × 3,28 ≈ ${n(ftmin, 0)} ft/min.`, `Arrondi : <b>${n(Math.round(ftmin / 100) * 100)} ft/min</b>.`], { tol: 101 });
      },
    ],
  },
};

export const cinematique = {
  id: 'cinematique',
  title: 'Vitesse et mouvement',
  niveau: 'Seconde → Première',
  cours: `
    <h3>1. Vitesse moyenne</h3><p><b>v = d / t</b> (m/s si d en m et t en s). Un mouvement est <b>uniforme</b> si la vitesse est constante, <b>rectiligne</b> si la trajectoire est une droite.</p>
    <h3>2. Accélération</h3><p>a = Δv / Δt (en m/s²). Un avion qui passe de 0 à 72 m/s en 30 s a une accélération moyenne de 2,4 m/s².</p>
    <h3>3. Mouvement uniformément accéléré (départ arrêté)</h3><p>v = a·t et d = ½·a·t². Relation utile : <b>v² = 2·a·d</b> (distance de décollage ou de freinage).</p>
    <h3>4. Chute libre</h3><p>Sans frottement, tout objet tombe avec l’accélération g ≈ 9,8 m/s² (on prend souvent 10) : v = g·t ; h = ½·g·t².</p>
    <h3>5. Vitesse moyenne sur un aller-retour</h3><p>Ce n’est <b>pas</b> la moyenne des deux vitesses : il faut diviser la distance totale par le temps total.</p>
    <h3>6. Vitesse relative (vent)</h3><p>Vitesse sol = vitesse air ± vent (vent arrière : on ajoute ; vent de face : on retire).</p>`,
  methode: `<ol><li>Liste les données avec leurs unités et convertis-les en SI.</li><li>Choisis la formule qui relie les données à l’inconnue.</li><li>Isole l’inconnue avant de remplacer par les nombres.</li><li>Contrôle l’unité et l’ordre de grandeur du résultat.</li></ol>`,
  templates: {
    1: [
      (r) => {
        const d = r.pick([100, 200, 400, 1500, 3000]), t = r.pick([10, 20, 25, 50, 100]);
        return numQ(`Un objet parcourt ${n(d)} m en ${t} s. Vitesse moyenne en m/s ?`, d / t, [`v = d / t = ${n(d)} / ${t}.`, `v = <b>${n(d / t)} m/s</b>.`]);
      },
      (r) => {
        const v = r.pick([200, 250, 300, 400, 500, 800]), t = r.pick([0.5, 1.5, 2, 3, 2.5]);
        return numQ(`Un avion vole à ${v} km/h pendant ${n(t)} h. Distance parcourue (km) ?`, v * t, [`d = v × t = ${v} × ${n(t)}.`, `d = <b>${n(v * t)} km</b>.`]);
      },
      (r) => {
        const air = r.pick([100, 120, 140, 180]), w = r.pick([15, 20, 25, 30, 40]), face = r.bool();
        return numQ(`Vitesse air ${air} kt, vent ${face ? 'de face' : 'arrière'} de ${w} kt. Vitesse sol (kt) ?`, face ? air - w : air + w, [`Vent ${face ? 'de face : il freine, on retire' : 'arrière : il pousse, on ajoute'}.`, `${air} ${face ? '−' : '+'} ${w} = <b>${face ? air - w : air + w} kt</b>.`]);
      },
    ],
    2: [
      (r) => {
        const v = r.pick([40, 50, 60, 72, 80]), t = r.pick([20, 25, 40, 50]);
        return numQ(`Au décollage, un avion passe de 0 à ${v} m/s en ${t} s. Accélération moyenne (m/s²) ?`, v / t, [`a = Δv / Δt = (${v} − 0) / ${t}.`, `a = <b>${n(v / t)} m/s²</b>.`]);
      },
      (r) => {
        const t = r.int(1, 5);
        return numQ(`Un objet tombe en chute libre sans vitesse initiale pendant ${t} s. Quelle hauteur a-t-il parcourue ? (g = 10 m/s²)`, 5 * t * t, [`h = ½ × g × t² = ½ × 10 × ${t}².`, `h = 5 × ${t * t} = <b>${5 * t * t} m</b>.`]);
      },
      (r) => {
        const v1 = r.pick([30, 40, 60]), v2 = r.pick([60, 90, 120].filter((x) => x !== v1)), d = 120;
        const vm = (2 * d) / (d / v1 + d / v2);
        return numQ(`Aller à ${v1} km/h, retour à ${v2} km/h sur la même distance (${d} km). Vitesse moyenne sur le trajet total (km/h) ?`, vm, [`Temps aller : ${d} / ${v1} = ${n(d / v1)} h ; retour : ${d} / ${v2} = ${n(d / v2)} h.`, `Distance totale ${2 * d} km, temps total ${n(d / v1 + d / v2)} h.`, `v = ${2 * d} / ${n(d / v1 + d / v2)} = <b>${n(vm, 2)} km/h</b> (et non ${(v1 + v2) / 2} !).`], { tol: rel(vm) });
      },
    ],
    3: [
      (r) => {
        const a = r.pick([2, 2.5, 3, 4]), v = r.pick([50, 60, 70, 80]);
        const d = (v * v) / (2 * a);
        return numQ(`Un avion accélère à ${n(a)} m/s² depuis l’arrêt. Quelle longueur de piste pour atteindre ${v} m/s ?`, d, [`v² = 2·a·d donc d = v² / (2a).`, `d = ${v}² / (2 × ${n(a)}) = ${v * v} / ${n(2 * a)} = <b>${n(d)} m</b>.`], { tol: rel(d) });
      },
      (r) => {
        const v = r.pick([20, 25, 30, 40]), a = r.pick([4, 5, 8]);
        const d = (v * v) / (2 * a);
        return numQ(`Un véhicule roulant à ${v} m/s freine avec une décélération de ${a} m/s². Distance de freinage (m) ?`, d, [`Même relation : v² = 2·a·d.`, `d = ${v * v} / ${2 * a} = <b>${n(d)} m</b>.`], { tol: rel(d), tip: 'Si la vitesse double, la distance de freinage est multipliée par 4.' });
      },
      (r) => {
        const h = r.pick([5, 20, 45, 80, 125]);
        const v = Math.sqrt(2 * 10 * h);
        return numQ(`Un objet tombe de ${h} m sans vitesse initiale. Vitesse à l’arrivée au sol (g = 10 m/s²) ?`, v, [`v² = 2·g·h = 2 × 10 × ${h} = ${20 * h}.`, `v = ${sqrt(20 * h)} = <b>${n(v)} m/s</b>.`], { tol: rel(v) });
      },
    ],
  },
};

export const forces = {
  id: 'forces',
  title: 'Forces et lois de Newton',
  niveau: 'Seconde → Terminale',
  cours: `
    <h3>1. Une force</h3><p>Une force est une action mécanique caractérisée par un point d’application, une direction, un sens et une intensité (en newtons, N). On la représente par un vecteur.</p>
    <h3>2. Le poids</h3><p><b>P = m × g</b> avec g ≈ 9,8 N/kg sur Terre (souvent arrondi à 10). La masse (kg) ne change pas ; le poids dépend de l’astre (g Lune ≈ 1,6 N/kg).</p>
    <h3>3. Les trois lois de Newton</h3>
    <ol><li><b>Principe d’inertie</b> : si la somme des forces est nulle, l’objet est immobile ou en mouvement rectiligne uniforme.</li><li><b>Principe fondamental de la dynamique</b> : ΣF⃗ = m·a⃗.</li><li><b>Actions réciproques</b> : si A exerce une force sur B, B exerce sur A une force opposée, de même intensité.</li></ol>
    <h3>4. Pression</h3><p>P = F / S (Pa = N/m²). Plus la surface est petite, plus la pression est grande.</p>
    <h3>5. Application au vol</h3><p>En palier à vitesse constante : portance = poids et poussée = traînée (somme des forces nulle → principe d’inertie).</p>`,
  methode: `<ol><li>Fais le <b>bilan des forces</b> sur l’objet étudié (poids, réaction, frottements, poussée…).</li><li>Choisis un sens positif.</li><li>Applique la bonne loi (inertie si vitesse constante, ΣF = ma sinon).</li></ol>`,
  templates: {
    1: [
      (r) => {
        const m = r.pick([2, 5, 12, 60, 75, 1200]);
        return numQ(`Poids d’un objet de ${n(m)} kg sur Terre (g = 9,8 N/kg) ?`, m * 9.8, [`P = m × g = ${n(m)} × 9,8.`, `P = <b>${n(m * 9.8)} N</b>.`], { tol: rel(m * 9.8) });
      },
      (r) => {
        const f1 = r.int(2, 20) * 10, f2 = r.int(1, 15) * 10, same = r.bool();
        const res = same ? f1 + f2 : Math.abs(f1 - f2);
        return numQ(`Deux forces de même direction s’exercent sur un objet : ${f1} N et ${f2} N, ${same ? 'dans le même sens' : 'en sens opposés'}. Intensité de la résultante (N) ?`, res, [`${same ? 'Même sens : on additionne' : 'Sens opposés : on soustrait'}.`, `${f1} ${same ? '+' : '−'} ${f2} → <b>${res} N</b>.`]);
      },
      (r) => mcqQ(r, 'Un avion vole en palier, en ligne droite, à vitesse constante. Que peut-on dire des forces ?', 'Elles se compensent (somme nulle)', ['La poussée est plus grande que la traînée', 'Le poids est nul', 'La portance est plus grande que le poids'], ['Vitesse constante en ligne droite = mouvement rectiligne uniforme.', 'D’après le <b>principe d’inertie</b>, la somme des forces est nulle : portance = poids et poussée = traînée.']),
    ],
    2: [
      (r) => {
        const m = r.pick([2, 4, 10, 50, 800, 1500]), a = r.pick([0.5, 1, 2, 3, 4]);
        return numQ(`Quelle force résultante faut-il pour donner une accélération de ${n(a)} m/s² à une masse de ${n(m)} kg ?`, m * a, [`2e loi de Newton : F = m × a.`, `F = ${n(m)} × ${n(a)} = <b>${n(m * a)} N</b>.`]);
      },
      (r) => {
        const F = r.pick([600, 700, 800, 1000]), S = r.pick([0.02, 0.04, 0.05, 0.1]);
        return numQ(`Une personne de poids ${F} N se tient sur des skis de surface totale ${n(S)} m². Pression exercée sur la neige (Pa) ?`, F / S, [`P = F / S = ${F} / ${n(S)}.`, `P = <b>${n(F / S)} Pa</b>.`]);
      },
      (r) => mcqQ(r, 'Le moteur à réaction d’un avion éjecte des gaz vers l’arrière. Quelle loi explique que l’avion avance ?', 'La loi des actions réciproques (3e loi)', ['Le principe d’inertie (1re loi)', 'La loi de la gravitation', 'La loi d’Ohm'], ['Le moteur pousse les gaz vers l’arrière ; en retour, les gaz poussent le moteur (et l’avion) vers l’avant avec une force de même intensité.', 'C’est la <b>3e loi de Newton</b> (actions réciproques).']),
    ],
    3: [
      (r) => {
        const m = r.pick([1000, 1200, 1500, 2000]), T = r.pick([3000, 4000, 5000]), D = r.pick([1000, 1500, 2000]);
        const a = (T - D) / m;
        return numQ(`Un avion de ${n(m)} kg roule au sol. Poussée ${n(T)} N, frottements et traînée ${n(D)} N. Accélération (m/s²) ?`, a, [`Somme des forces horizontales : ${n(T)} − ${n(D)} = ${n(T - D)} N.`, `a = F / m = ${n(T - D)} / ${n(m)} = <b>${n(a)} m/s²</b>.`], { tol: rel(a) });
      },
      (r) => {
        const m = r.pick([60, 70, 80]), gl = 1.6;
        return numQ(`Un astronaute a une masse de ${m} kg. Quel est son poids sur la Lune (g = 1,6 N/kg) ?`, m * gl, [`La masse ne change pas : ${m} kg.`, `P = m × g<sub>Lune</sub> = ${m} × 1,6 = <b>${n(m * gl)} N</b> (environ 6 fois moins que sur Terre).`]);
      },
      (r) => {
        const m = r.pick([50, 60, 80]), a = r.pick([2, 3, 5]);
        const N = m * (10 + a);
        return numQ(`Un pilote de ${m} kg est dans un avion qui accélère vers le haut à ${a} m/s². Quelle force le siège exerce-t-il sur lui (g = 10) ?`, N, [`Bilan vertical : R − P = m·a donc R = m(g + a).`, `R = ${m} × (10 + ${a}) = <b>${N} N</b>, soit plus que son poids (${m * 10} N) : il se sent « plus lourd ».`]);
      },
    ],
  },
};

export const energie = {
  id: 'energie',
  title: 'Énergie et puissance',
  niveau: 'Première',
  cours: `
    <h3>1. Énergie cinétique</h3><p><b>E<sub>c</sub> = ½ m v²</b> (J, avec m en kg et v en m/s). Si la vitesse double, l’énergie cinétique est multipliée par 4.</p>
    <h3>2. Énergie potentielle de pesanteur</h3><p><b>E<sub>p</sub> = m g h</b>.</p>
    <h3>3. Énergie mécanique</h3><p>E<sub>m</sub> = E<sub>c</sub> + E<sub>p</sub>. Sans frottements, elle se <b>conserve</b> : un planeur échange de l’altitude contre de la vitesse.</p>
    <h3>4. Travail d’une force</h3><p>W = F × d × cos α (J). Une force perpendiculaire au déplacement ne travaille pas.</p>
    <h3>5. Puissance</h3><p><b>P = E / t</b> (W = J/s). 1 kWh = 1 000 W × 3 600 s = 3,6 × 10⁶ J.</p>
    <h3>6. Rendement</h3><p>η = énergie utile / énergie reçue (toujours &lt; 1).</p>`,
  methode: `<ol><li>Convertis la vitesse en m/s et la masse en kg.</li><li>Pour un problème de chute ou de glissade sans frottement : écris E<sub>m</sub> départ = E<sub>m</sub> arrivée.</li><li>Pense à mettre la vitesse au carré !</li></ol>`,
  templates: {
    1: [
      (r) => {
        const m = r.pick([2, 10, 50, 80, 1000]), v = r.pick([2, 4, 5, 10, 20]);
        return numQ(`Énergie cinétique d’un objet de ${n(m)} kg à ${v} m/s (en J) ?`, 0.5 * m * v * v, [`E<sub>c</sub> = ½ × m × v² = 0,5 × ${n(m)} × ${v}².`, `= 0,5 × ${n(m)} × ${v * v} = <b>${n(0.5 * m * v * v)} J</b>.`]);
      },
      (r) => {
        const m = r.pick([2, 5, 10, 70]), h = r.pick([3, 10, 20, 50, 100]);
        return numQ(`Énergie potentielle de ${m} kg à ${h} m de hauteur (g = 10) ?`, m * 10 * h, [`E<sub>p</sub> = m × g × h = ${m} × 10 × ${h}.`, `= <b>${n(m * 10 * h)} J</b>.`]);
      },
      (r) => {
        const E = r.pick([600, 1200, 3000, 6000]), t = r.pick([2, 3, 10, 60]);
        return numQ(`Un moteur fournit ${n(E)} J en ${t} s. Puissance (W) ?`, E / t, [`P = E / t = ${n(E)} / ${t}.`, `P = <b>${n(E / t)} W</b>.`]);
      },
    ],
    2: [
      (r) => mcqQ(r, 'Si la vitesse d’un avion double, son énergie cinétique est :', 'multipliée par 4', ['multipliée par 2', 'inchangée', 'divisée par 2'], ['E<sub>c</sub> = ½mv² : la vitesse est au carré.', '(2v)² = 4v² → énergie <b>multipliée par 4</b>. C’est pourquoi la distance de freinage quadruple.']),
      (r) => {
        const F = r.pick([50, 100, 200, 500]), d = r.pick([2, 10, 20, 100]);
        return numQ(`Une force de ${F} N déplace un objet de ${d} m dans sa propre direction. Travail (J) ?`, F * d, [`W = F × d (force et déplacement dans la même direction, cos 0 = 1).`, `W = ${F} × ${d} = <b>${n(F * d)} J</b>.`]);
      },
      (r) => {
        const P = r.pick([500, 1000, 2000, 2500]), h = r.pick([2, 3, 5, 0.5]);
        return numQ(`Un appareil de ${n(P)} W fonctionne ${n(h)} h. Énergie consommée en kWh ?`, (P / 1000) * h, [`P = ${n(P / 1000)} kW.`, `E = P × t = ${n(P / 1000)} × ${n(h)} = <b>${n((P / 1000) * h)} kWh</b>.`]);
      },
    ],
    3: [
      (r) => {
        const h = r.pick([5, 20, 45, 80]);
        const v = Math.sqrt(20 * h);
        return numQ(`Un objet glisse sans frottement depuis une hauteur de ${h} m, sans vitesse initiale. Sa vitesse en bas (m/s, g = 10) ?`, v, [`Conservation : m·g·h = ½·m·v² (la masse se simplifie).`, `v = ${sqrt('2 g h')} = ${sqrt(20 * h)} = <b>${n(v)} m/s</b>.`]);
      },
      (r) => {
        const m = r.pick([1000, 1200, 1500]), v = r.pick([20, 30, 40]);
        const ec = 0.5 * m * v * v;
        return numQ(`Un avion de ${n(m)} kg roule à ${v} m/s. Quelle énergie (en kJ) les freins doivent-ils dissiper pour l’arrêter ?`, ec / 1000, [`Toute l’énergie cinétique est transformée en chaleur : E<sub>c</sub> = ½ × ${n(m)} × ${v}² = ${n(ec)} J.`, `= <b>${n(ec / 1000)} kJ</b>.`]);
      },
      (r) => {
        const Pin = r.pick([1000, 2000, 4000]), eta = r.pick([0.25, 0.3, 0.4, 0.8]);
        return numQ(`Un moteur reçoit ${n(Pin)} W et a un rendement de ${n(eta * 100)} %. Puissance utile (W) ?`, Pin * eta, [`P<sub>utile</sub> = η × P<sub>reçue</sub> = ${n(eta)} × ${n(Pin)}.`, `= <b>${n(Pin * eta)} W</b> ; le reste (${n(Pin * (1 - eta))} W) est perdu en chaleur.`]);
      },
    ],
  },
};

export const electricite = {
  id: 'electricite',
  title: 'Électricité',
  niveau: 'Seconde → Première',
  cours: `
    <h3>1. Grandeurs</h3><ul><li>Intensité I (ampère, A) : se mesure avec un ampèremètre branché <b>en série</b>.</li><li>Tension U (volt, V) : se mesure avec un voltmètre branché <b>en dérivation</b>.</li><li>Résistance R (ohm, Ω).</li></ul>
    <h3>2. Loi d’Ohm</h3><p><b>U = R × I</b>.</p>
    <h3>3. Puissance et énergie</h3><p><b>P = U × I</b> (W) ; E = P × t.</p>
    <h3>4. Associations de résistances</h3><ul><li>Série : R = R₁ + R₂.</li><li>Dérivation : 1/R = 1/R₁ + 1/R₂ (donc R = R₁R₂/(R₁ + R₂)).</li></ul>
    <h3>5. Lois des circuits</h3><ul><li>Loi des nœuds : la somme des intensités qui arrivent = somme de celles qui repartent.</li><li>Loi des mailles / additivité des tensions : en série, les tensions s’additionnent.</li><li>En dérivation, les tensions sont égales.</li></ul>
    <h3>6. À bord</h3><p>Les avions légers utilisent un réseau continu de 14 ou 28 V ; les fusibles et disjoncteurs protègent chaque circuit d’une intensité trop forte.</p>`,
  methode: `<ol><li>Fais un schéma et repère série / dérivation.</li><li>Calcule d’abord la résistance équivalente.</li><li>Applique U = RI puis P = UI.</li></ol>`,
  templates: {
    1: [
      (r) => {
        const R = r.pick([10, 20, 47, 100, 220]), I = r.pick([0.1, 0.2, 0.5, 1, 2]);
        return numQ(`Une résistance de ${R} Ω est traversée par ${n(I)} A. Tension à ses bornes (V) ?`, R * I, [`Loi d’Ohm : U = R × I = ${R} × ${n(I)}.`, `U = <b>${n(R * I)} V</b>.`]);
      },
      (r) => {
        const U = r.pick([12, 14, 24, 28, 230]), I = r.pick([0.5, 2, 5, 10]);
        return numQ(`Un appareil alimenté en ${U} V consomme ${n(I)} A. Puissance (W) ?`, U * I, [`P = U × I = ${U} × ${n(I)}.`, `P = <b>${n(U * I)} W</b>.`]);
      },
      (r) => mcqQ(r, 'Comment branche-t-on un ampèremètre ?', 'En série dans le circuit', ['En dérivation aux bornes du dipôle', 'N’importe comment', 'Uniquement sur la pile'], ['L’ampèremètre doit être traversé par le courant à mesurer : il se branche <b>en série</b>.', 'Le voltmètre, lui, se branche en dérivation.']),
    ],
    2: [
      (r) => {
        const R1 = r.pick([10, 20, 30, 47]), R2 = r.pick([10, 22, 50, 100]);
        return numQ(`Deux résistances de ${R1} Ω et ${R2} Ω en <b>série</b>. Résistance équivalente (Ω) ?`, R1 + R2, [`En série, les résistances s’additionnent.`, `R = ${R1} + ${R2} = <b>${R1 + R2} Ω</b>.`]);
      },
      (r) => {
        const [R1, R2] = r.pick([[10, 10], [20, 30], [6, 12], [40, 60], [100, 100], [30, 60]]);
        const R = (R1 * R2) / (R1 + R2);
        return numQ(`Deux résistances de ${R1} Ω et ${R2} Ω en <b>dérivation</b>. Résistance équivalente (Ω) ?`, R, [`R = ${frac('R₁ × R₂', 'R₁ + R₂')} = ${frac(`${R1} × ${R2}`, `${R1} + ${R2}`)}.`, `= ${frac(R1 * R2, R1 + R2)} = <b>${n(R)} Ω</b> (plus petite que chacune).`]);
      },
      (r) => {
        const U = r.pick([12, 24, 28]), R = r.pick([4, 6, 12, 24]);
        return numQ(`Une lampe de résistance ${R} Ω est branchée sur ${U} V. Intensité (A) ?`, U / R, [`I = U / R = ${U} / ${R}.`, `I = <b>${n(U / R)} A</b>.`]);
      },
    ],
    3: [
      (r) => {
        const U = r.pick([12, 24]), R1 = r.pick([2, 4, 6]), R2 = r.pick([2, 4, 6]);
        const I = U / (R1 + R2);
        return numQ(`Un générateur de ${U} V alimente ${R1} Ω et ${R2} Ω en série. Tension aux bornes de la résistance de ${R2} Ω ?`, R2 * I, [`R totale = ${R1 + R2} Ω ; I = ${U} / ${R1 + R2} = ${n(I)} A.`, `U₂ = R₂ × I = ${R2} × ${n(I)} = <b>${n(R2 * I)} V</b>.`], { tol: 0.011 });
      },
      (r) => {
        const I1 = r.pick([0.5, 1, 1.5, 2]), I2 = r.pick([0.2, 0.3, 0.8, 1]), I3 = r.pick([0.4, 0.6, 1.2]);
        return numQ(`À un nœud arrivent ${n(I1)} A et ${n(I2)} A ; une branche repart avec ${n(I3)} A. Intensité dans l’autre branche sortante ?`, I1 + I2 - I3, [`Loi des nœuds : ${n(I1)} + ${n(I2)} = ${n(I3)} + I.`, `I = ${n(I1 + I2)} − ${n(I3)} = <b>${n(I1 + I2 - I3)} A</b>.`], { tol: 0.001 });
      },
      (r) => {
        const P = r.pick([60, 100, 240, 600]), U = r.pick([12, 24, 28]), h = r.pick([1, 2, 3]);
        const I = P / U, Ah = I * h;
        return numQ(`Un équipement de ${P} W est alimenté en ${U} V pendant ${h} h. Quelle charge (en Ah) prélève-t-il sur la batterie ?`, Ah, [`I = P / U = ${P} / ${U} = ${n(I, 2)} A.`, `Charge = I × t = ${n(I, 2)} × ${h} = <b>${n(Ah, 2)} Ah</b>.`], { tol: rel(Ah) });
      },
    ],
  },
};

export const optique = {
  id: 'optique',
  title: 'Optique et ondes',
  niveau: 'Seconde → Première',
  cours: `
    <h3>1. La lumière</h3><p>Dans le vide (et presque dans l’air), elle se propage en ligne droite à <b>c = 3,00 × 10⁸ m/s</b>. Une année-lumière est la distance parcourue en un an (≈ 9,46 × 10¹⁵ m).</p>
    <h3>2. Réflexion</h3><p>Angle de réflexion = angle d’incidence (mesurés par rapport à la normale).</p>
    <h3>3. Réfraction</h3><p>Indice d’un milieu : n = c / v (n ≥ 1). Loi de Snell-Descartes : n₁ sin i₁ = n₂ sin i₂. En passant dans un milieu plus réfringent, le rayon se rapproche de la normale.</p>
    <h3>4. Lentilles minces convergentes</h3><p>Distance focale f′ ; vergence C = 1 / f′ (dioptries δ, f′ en mètres). Relation de conjugaison : ${frac(1, "OA′")} − ${frac(1, 'OA')} = ${frac(1, "f′")} (mesures algébriques).</p>
    <h3>5. Couleurs et ondes</h3><p>Lumière blanche = mélange de toutes les couleurs (spectre du violet ≈ 400 nm au rouge ≈ 800 nm). Les ondes radio (VHF aéronautique ≈ 118–137 MHz) et la lumière sont des ondes électromagnétiques : λ = c / f.</p>`,
  methode: `<ol><li>Les angles se mesurent toujours par rapport à la <b>normale</b> (perpendiculaire à la surface).</li><li>Pour une lentille : convertis f′ en mètres avant de calculer la vergence.</li><li>Pour λ = c/f : convertis les MHz en Hz.</li></ol>`,
  templates: {
    1: [
      (r) => {
        const i = r.pick([20, 30, 35, 45, 60]);
        return numQ(`Un rayon arrive sur un miroir plan avec un angle d’incidence de ${i}°. Angle de réflexion (°) ?`, i, [`Loi de la réflexion : angle réfléchi = angle incident.`, `= <b>${i}°</b>.`]);
      },
      (r) => {
        const fcm = r.pick([10, 20, 25, 50]);
        return numQ(`Une lentille convergente a une distance focale de ${fcm} cm. Vergence (δ) ?`, 100 / fcm, [`f′ = ${fcm} cm = ${n(fcm / 100)} m.`, `C = 1 / f′ = 1 / ${n(fcm / 100)} = <b>${n(100 / fcm)} δ</b>.`]);
      },
      (r) => mcqQ(r, 'La lumière blanche est :', 'un mélange de lumières de toutes les couleurs', ['une lumière d’une seule couleur', 'une onde sonore', 'une lumière sans longueur d’onde'], ['Un prisme décompose la lumière blanche en un spectre continu, du violet au rouge (expérience de Newton).']),
    ],
    2: [
      (r) => {
        const nn = r.pick([1.33, 1.5, 2.42]);
        return numQ(`Indice d’un milieu n = ${n(nn)}. Vitesse de la lumière dans ce milieu (en 10⁸ m/s, arrondi au centième) ?`, Math.round((3 / nn) * 100) / 100, [`v = c / n = 3,00 × 10⁸ / ${n(nn)}.`, `v ≈ <b>${n(Math.round((3 / nn) * 100) / 100)} × 10⁸ m/s</b>.`], { tol: 0.011 });
      },
      (r) => {
        const f = r.pick([118, 120, 121.5, 125, 300]);
        const l = 300 / f;
        return numQ(`Une radio VHF émet à ${n(f)} MHz. Longueur d’onde (m, au centième) ?`, Math.round(l * 100) / 100, [`λ = c / f = 3 × 10⁸ / (${n(f)} × 10⁶).`, `= 300 / ${n(f)} ≈ <b>${n(Math.round(l * 100) / 100)} m</b>.`], { tol: 0.011, tip: '121,5 MHz est la fréquence de détresse aéronautique.' });
      },
      (r) => {
        const d = r.pick([3e8, 1.5e11, 3.84e8]);
        const name = { 3e8: 'un objet situé à 300 000 km', 1.5e11: 'le Soleil (1,5 × 10¹¹ m)', 3.84e8: 'la Lune (3,84 × 10⁸ m)' }[d];
        return numQ(`Combien de secondes met la lumière pour nous parvenir depuis ${name} ?`, d / 3e8, [`t = d / c = ${n(d / 1e8)} × 10⁸ / (3 × 10⁸).`, `t ≈ <b>${n(d / 3e8, 2)} s</b>${d === 1.5e11 ? ' (soit environ 8 min 20 s)' : ''}.`], { tol: rel(d / 3e8) });
      },
    ],
    3: [
      (r) => {
        const [i, sin] = r.pick([[30, 0.5], [45, 0.707], [60, 0.866]]);
        const n2 = 1.5;
        const s2 = sin / n2;
        return mcqQ(r, `Un rayon passe de l’air (n = 1) au verre (n = 1,5) avec i₁ = ${i}° (sin ${i}° ≈ ${n(sin)}). Que vaut sin i₂ ?`, n(Math.round(s2 * 100) / 100), [n(Math.round(sin * 1.5 * 100) / 100), n(sin), n(Math.round((sin / 2) * 100) / 100)], [`Snell-Descartes : 1 × sin ${i}° = 1,5 × sin i₂.`, `sin i₂ = ${n(sin)} / 1,5 ≈ <b>${n(Math.round(s2 * 100) / 100)}</b> : le rayon se rapproche de la normale.`]);
      },
      (r) => {
        const f = r.pick([10, 20]), oa = -r.pick([30, 40, 60]);
        const oap = 1 / (1 / f + 1 / oa);
        return numQ(`Lentille convergente f′ = ${f} cm ; objet à ${-oa} cm devant (OA = ${oa} cm). Position de l’image OA′ (cm) ?`, oap, [`${frac(1, "OA′")} = ${frac(1, "f′")} + ${frac(1, 'OA')} = ${frac(1, f)} + ${frac(1, oa)}.`, `= ${n(1 / f + 1 / oa, 4)} cm⁻¹ → OA′ = <b>${n(oap, 1)} cm</b> (image réelle, derrière la lentille).`], { tol: 0.15 });
      },
      (r) => mcqQ(r, 'Pourquoi le ciel est-il bleu ?', 'L’air diffuse davantage les courtes longueurs d’onde (bleu)', ['L’océan se reflète dans le ciel', 'Le Soleil émet surtout du bleu', 'L’ozone est bleu'], ['Les molécules de l’air diffusent beaucoup plus la lumière bleue (courte longueur d’onde) que la rouge : c’est la <b>diffusion de Rayleigh</b>.', 'Au coucher du soleil, la lumière traverse plus d’atmosphère : le bleu est diffusé en route et il reste surtout du rouge-orangé.']),
    ],
  },
};

export const vol = {
  id: 'vol',
  title: 'Mécanique du vol',
  niveau: 'BIA → Terminale',
  cours: `
    <h3>1. Les quatre forces</h3><p><b>Portance</b> (vers le haut, perpendiculaire au vent relatif), <b>poids</b> (vers le bas), <b>poussée</b> (moteur, vers l’avant), <b>traînée</b> (résistance de l’air, vers l’arrière). En palier stabilisé : portance = poids, poussée = traînée.</p>
    <h3>2. Formule de la portance</h3><p>F<sub>z</sub> = ½ ρ S V² C<sub>z</sub> : ρ masse volumique de l’air, S surface alaire, V vitesse, C<sub>z</sub> coefficient de portance (dépend de l’incidence). La portance est proportionnelle à <b>V²</b>.</p>
    <h3>3. Incidence et décrochage</h3><p>Augmenter l’angle d’incidence augmente C<sub>z</sub> jusqu’à l’<b>incidence de décrochage</b> (souvent 15–18°) : l’écoulement décolle de l’extrados, la portance chute.</p>
    <h3>4. Virage et facteur de charge</h3><p>En virage en palier incliné de φ : <b>n = 1 / cos φ</b>. À 60° d’inclinaison, n = 2 : le pilote « pèse » deux fois son poids. La vitesse de décrochage augmente : V<sub>s virage</sub> = V<sub>s</sub> × √n.</p>
    <h3>5. Finesse</h3><p>f = portance / traînée = distance parcourue / hauteur perdue en vol plané. Un planeur de finesse 40 parcourt 40 km en perdant 1 000 m.</p>
    <h3>6. Atmosphère standard (ISA)</h3><p>Au niveau de la mer : 15 °C, 1 013,25 hPa. La température baisse d’environ <b>2 °C par 1 000 ft</b> (6,5 °C/km) ; la pression d’environ 1 hPa par 28 ft (≈ 8,5 m) près du sol. Quand l’altitude augmente, ρ diminue : il faut voler plus vite pour la même portance.</p>`,
  methode: `<ol><li>Identifie la grandeur qui varie et cherche si la relation est linéaire, au carré (V²) ou en racine (√n).</li><li>Raisonne en rapports : « si V est multipliée par k, la portance est multipliée par k² ».</li><li>Retiens les valeurs clés : cos 60° = 0,5 → n = 2 ; cos 45° ≈ 0,71 → n ≈ 1,41.</li></ol>`,
  templates: {
    1: [
      (r) => mcqQ(r, 'Quelle force s’oppose à l’avancement de l’avion ?', 'La traînée', ['La portance', 'La poussée', 'Le poids'], ['La <b>traînée</b> est la résistance de l’air, dirigée vers l’arrière (sens opposé au déplacement).', 'La poussée du moteur la compense.']),
      (r) => {
        const f = r.pick([8, 10, 12, 20, 40]), h = r.pick([500, 1000, 1500, 2000]);
        return numQ(`Un planeur a une finesse de ${f}. Quelle distance (km) peut-il parcourir en perdant ${n(h)} m d’altitude (air calme) ?`, (f * h) / 1000, [`Distance = finesse × hauteur = ${f} × ${n(h)} m = ${n(f * h)} m.`, `= <b>${n((f * h) / 1000)} km</b>.`]);
      },
      (r) => {
        const ft = r.pick([1000, 2000, 3000, 5000, 10000]);
        const t = 15 - 2 * (ft / 1000);
        return numQ(`En atmosphère standard, quelle température fait-il à ${n(ft)} ft ? (15 °C au sol, −2 °C par 1 000 ft)`, t, [`Baisse : ${ft / 1000} × 2 = ${2 * (ft / 1000)} °C.`, `15 − ${2 * (ft / 1000)} = <b>${n(t)} °C</b>.`]);
      },
    ],
    2: [
      (r) => {
        const k = r.pick([2, 3, 0.5]);
        const good = k === 2 ? 'multipliée par 4' : k === 3 ? 'multipliée par 9' : 'divisée par 4';
        return mcqQ(r, `Toutes choses égales par ailleurs, si la vitesse est ${k === 0.5 ? 'divisée par 2' : `multipliée par ${k}`}, la portance est :`, good, ['multipliée par 2', 'multipliée par 4', 'multipliée par 9', 'divisée par 2', 'divisée par 4'], ['La portance est proportionnelle à V² (F<sub>z</sub> = ½ρSV²C<sub>z</sub>).', `Facteur : ${n(k)}² = ${n(k * k)} → <b>${good}</b>.`]);
      },
      (r) => {
        const [phi, nn] = r.pick([[60, 2], [0, 1], [45, 1.41], [30, 1.15], [70, 2.92]]);
        return numQ(`Facteur de charge en virage en palier à ${phi}° d’inclinaison ? (arrondi au centième)`, nn, [`n = 1 / cos φ = 1 / cos ${phi}°.`, `cos ${phi}° ≈ ${n(Math.cos((phi * Math.PI) / 180), 3)} → n ≈ <b>${n(nn)}</b>.`], { tol: 0.011 });
      },
      (r) => mcqQ(r, 'Qu’est-ce que le décrochage ?', 'La perte brutale de portance quand l’incidence dépasse une valeur critique', ['Un arrêt du moteur', 'Une vitesse trop élevée', 'Le passage du mur du son'], ['Au-delà de l’<b>incidence de décrochage</b>, les filets d’air décollent de l’extrados : la portance chute.', 'Il peut se produire à <b>n’importe quelle vitesse</b> si l’incidence est trop forte (ex. : ressource brutale).']),
    ],
    3: [
      (r) => {
        const vs = r.pick([50, 60, 80, 100]);
        const v = vs * Math.SQRT2;
        return numQ(`Un avion décroche à ${vs} kt en ligne droite. Vitesse de décrochage en virage à 60° (kt, arrondi) ?`, Math.round(v), [`À 60° : n = 1 / cos 60° = 2.`, `V<sub>s</sub> × √n = ${vs} × √2 ≈ ${vs} × 1,41 = <b>${Math.round(v)} kt</b>.`], { tol: 1.01 });
      },
      (r) => {
        const m = r.pick([1000, 1200]), phi = 60;
        return numQ(`Un avion de ${n(m)} kg vire en palier à ${phi}°. Quelle portance (N) doit produire l’aile ? (g = 10)`, 2 * m * 10, [`Poids = ${n(m * 10)} N ; n = 1 / cos 60° = 2.`, `Portance = n × P = <b>${n(2 * m * 10)} N</b>.`]);
      },
      (r) => {
        const alt = r.pick([300, 500, 1000, 1500]);
        const p = 1013 - alt / 8.5;
        return numQ(`Au niveau de la mer, la pression vaut 1 013 hPa. Estime la pression à ${alt} m (1 hPa ≈ 8,5 m), arrondie à l’unité.`, Math.round(p), [`Baisse : ${alt} / 8,5 ≈ ${n(alt / 8.5, 0)} hPa.`, `1 013 − ${n(alt / 8.5, 0)} ≈ <b>${Math.round(p)} hPa</b>.`], { tol: 2.01 });
      },
    ],
  },
};

export const CHAPTERS_PHYSIQUE = [unites, cinematique, forces, energie, electricite, optique, vol];
void sq;
void pow;
