import { n } from '../core/fmt.js';
import { numQ } from '../maths/helpers.js';

const rounded = (value) => Math.round(value * 100) / 100;
const q = (prompt, answer, steps) => numQ(prompt, rounded(answer), steps, { tol: 0.0051 });

export const fluides = {
  id: 'fluides', title: 'Pression et écoulements', niveau: 'Terminale',
  cours: `
    <h3>Pression et force</h3>
    <p>La pression moyenne vaut p = F/S. Une différence de pression de 2 000 Pa sur 0,03 m² exerce 60 N. Utilise l’aire en m² et distingue pression absolue et écart de pression.</p>
    <h3>Fluide au repos</h3>
    <p>À profondeur h sous une surface libre, la pression augmente de ρgh. Avec de l’eau (ρ = 1 000 kg/m³), 2 m correspondent à environ 20 kPa si g ≈ 10 m/s².</p>
    <h3>Écoulement idéal</h3>
    <p>En régime stationnaire, pour un fluide incompressible, le débit volumique Q = Sv se conserve. À hauteur constante, Bernoulli donne p + ρv²/2 constant le long d’une ligne de courant sans pertes. Ce modèle néglige viscosité et variations de masse volumique.</p>`,
  methode: '<p>Convertis les surfaces, calcule séparément débit, vitesse puis pression. Vérifie le signe : dans le rétrécissement idéal, la vitesse augmente et la pression statique diminue.</p>',
  templates: {
    1: [(r) => {
      const force = r.int(2, 25) * 30;
      return q(`Une force de ${force} N agit uniformément sur 300 cm². Quelle pression en Pa ?`, force / 0.03,
        ['1 cm² = 0,0001 m², donc 300 cm² = 0,03 m².', `Divise ${force} par 0,03.`]);
    }],
    2: [(r) => {
      const depth = r.int(3, 30) / 10;
      const areaCm = r.int(2, 12) * 100;
      const surface = areaCm / 10000;
      return q(`Une paroi horizontale de ${areaCm} cm² est à ${n(depth)} m de profondeur. Sur sa face opposée, la pression vaut celle de la surface. Calcule la force nette en N (eau, g = 10 m/s²).`,
        1000 * 10 * depth * surface, ['L’écart de pression est ρgh, avec ρ = 1 000 kg/m³.', `Multiplie cet écart par ${n(surface)} m².`]);
    }],
    3: [(r) => {
      const speed = r.int(2, 12), ratio = r.int(2, 4);
      return q(`Dans une conduite horizontale idéale, l’eau s’écoule à ${speed} m/s dans une section d’aire ${ratio} fois celle du col. Quelle chute de pression statique entre la section large et le col, en kPa (ρ = 1 000 kg/m³) ?`,
        ((ratio * speed) ** 2 - speed ** 2) / 2,
        [`Débit conservé : au col, v = ${ratio} × ${speed} = ${ratio * speed} m/s.`, 'La chute vaut ρ(v<sub>col</sub>² − v<sub>large</sub>²)/2. Divise par 1 000 pour obtenir des kPa.']);
    }],
  },
};

export const ondes = {
  id: 'ondes', title: 'Ondes, fréquence et échos', niveau: 'Première',
  cours: `
    <h3>Fréquence et longueur d’onde</h3><p>Une perturbation périodique de fréquence f a pour période T = 1/f. La longueur d’onde est λ = c/f, où c est la célérité dans le milieu. Le son et la lumière ont des célérités très différentes.</p>
    <h3>Mesurer une distance</h3><p>Pour un écho, la durée mesurée couvre l’aller et le retour. Avec c = 340 m/s, un écho sonore après 0,2 s correspond à un obstacle situé à 34 m.</p>`,
  methode: '<p>Convertis d’abord ms ou µs en secondes. Dessine le trajet et compte le nombre de segments effectivement parcourus.</p>',
  templates: {
    1: [(r) => {
      const f = r.int(2, 30) * 100;
      return q(`Un signal se répète à ${f} Hz. Calcule sa période en ms (arrondie au centième).`, 1000 / f, ['T = 1/f en secondes.', 'Multiplie par 1 000 pour passer en millisecondes.']);
    }],
    2: [(r) => {
      const f = r.int(2, 20) * 50;
      return q(`Un signal sonore de ${f} Hz se propage à 340 m/s. Quelle est sa longueur d’onde en cm (au centième) ?`, 34000 / f, ['Calcule λ = c/f en mètres.', 'Multiplie par 100 pour obtenir des centimètres.']);
    }],
    3: [(r) => {
      const emission = r.int(10, 40), arrival = emission + r.int(30, 95);
      const delay = r.int(3, 9);
      return q(`Impulsion émise à t = ${emission} ms. Son écho est enregistré à t = ${arrival + delay} ms. La chaîne de réception ajoute ${delay} ms de retard. Distance au réflecteur en m (c = 340 m/s, au centième) ?`,
        340 * (arrival - emission) / 2000, [`Retire l’horodatage de départ et le retard : ${arrival + delay} − ${emission} − ${delay} = ${arrival - emission} ms.`, 'Convertis en secondes puis multiplie par c/2 pour isoler l’aller.']);
    }],
  },
};

export const thermodynamique = {
  id: 'thermodynamique', title: 'Gaz parfaits et transferts thermiques', niveau: 'Terminale',
  cours: `
    <h3>Température absolue</h3><p>Pour les relations entre états d’un gaz, utilise T en kelvins (T ≈ θ + 273 avec θ en °C). Une variation de 1 °C correspond à une variation de 1 K.</p>
    <h3>Équation d’état</h3><p>Dans le modèle du gaz parfait, pV = nRT. À quantité et volume constants, p/T reste constant. Ainsi passer de 300 K à 330 K augmente la pression de 10 %.</p>
    <h3>Chaleur sensible</h3><p>Sans changement d’état et avec capacité thermique massique c constante, Q = mcΔT. Le bilan doit tenir compte des pertes si elles sont précisées.</p>`,
  methode: '<p>Identifie le système, les grandeurs constantes et les températures absolues. Pour un chauffage, calcule d’abord l’énergie effectivement reçue par le matériau.</p>',
  templates: {
    1: [(r) => {
      const temp = r.int(5, 45);
      return q(`Convertis ${temp} °C en K avec l’approximation 0 °C = 273 K.`, temp + 273, [`Ajoute 273 à ${temp}.`]);
    }],
    2: [(r) => {
      const pressure = r.int(4, 18) * 20, final = r.int(25, 37) * 10;
      return q(`Un gaz parfait est à ${pressure} kPa et 300 K. À volume et quantité constants, quelle pression en kPa à ${final} K (au centième) ?`,
        pressure * final / 300, [`p/T est constant : multiplie ${pressure} par ${final}/300.`, 'Utilise les températures absolues.']);
    }],
    3: [(r) => {
      const power = r.int(5, 18) * 100, seconds = r.int(3, 12) * 10, mass = r.int(1, 5);
      return q(`Une résistance de ${power} W fonctionne ${seconds} s. 20 % de l’énergie est perdue. De combien de °C chauffe-t-elle ${mass} kg d’eau (c = 4 200 J/(kg·K), au centième) ?`,
        0.8 * power * seconds / (4200 * mass), [`Énergie reçue par l’eau : 0,8 × ${power} × ${seconds} J.`, `Divise par ${mass} × 4 200 pour obtenir ΔT. Une différence en K a la même valeur numérique en °C.`]);
    }],
  },
};
