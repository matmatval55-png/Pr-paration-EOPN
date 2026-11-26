// Fiches de révision visuelles : culture de l'Armée de l'Air et de l'Espace (photos, schémas, explications).
import { carteBases, insignesGrades, organigramme, anatomieChasseur, chainePPS, schemaDissuasion, frise } from './schemas.js';
import { CREDITS } from './credits.js';

// Fiche descriptive de chaque aéronef. Photo : images/aeronefs/<id>.jpg (licence libre, voir CREDITS).
export const AERONEFS = [
  { id: 'rafale', nom: 'Dassault Rafale', role: 'Avion de combat omnirôle', facts: { Constructeur: 'Dassault Aviation (moteurs Safran M88, radar Thales)', Moteurs: '2 turboréacteurs', Versions: 'B (biplace), C (monoplace), M (Marine, porte-avions)', 'En service (AAE)': 'depuis 2006', Bases: 'Saint-Dizier, Mont-de-Marsan…' }, txt: 'Un seul avion pour toutes les missions : défense aérienne, attaque au sol, reconnaissance et dissuasion nucléaire (missile ASMPA). Aile delta et plans canard pour la manœuvrabilité. Armements : missiles air-air MICA et Meteor, missile de croisière SCALP, bombes guidées.' },
  { id: 'mirage2000d', nom: 'Dassault Mirage 2000D', role: 'Avion d’attaque au sol', facts: { Constructeur: 'Dassault Aviation', Moteur: '1 turboréacteur', Équipage: '2 (pilote + navigateur officier systèmes d’armes)', Base: 'Nancy-Ochey (BA 133)' }, txt: 'Version biplace d’assaut conventionnel de la famille Mirage 2000, très employée en opérations extérieures. Le NOSA, en place arrière, gère la navigation, les capteurs et l’armement.' },
  { id: 'a400m', nom: 'Airbus A400M Atlas', role: 'Avion de transport tactique et stratégique', facts: { Constructeur: 'Airbus', Moteurs: '4 turbopropulseurs', Base: 'Orléans-Bricy (BA 123)' }, txt: 'Il transporte troupes, véhicules et matériel sur de longues distances et peut se poser sur des pistes courtes et sommaires. Il peut aussi larguer des parachutistes et du fret.' },
  { id: 'mrtt', nom: 'Airbus A330 MRTT Phénix', role: 'Ravitailleur et transport stratégique', facts: { Constructeur: 'Airbus', Moteurs: '2 turboréacteurs', Base: 'Istres (BA 125)' }, txt: 'Il remplace les anciens C-135 FR. Il ravitaille les avions en vol (indispensable aux raids longs et à la dissuasion), transporte passagers et fret, et peut être équipé pour l’évacuation sanitaire.' },
  { id: 'e3f', nom: 'Boeing E-3F SDCA (AWACS)', role: 'Détection et contrôle aéroportés', facts: { Constructeur: 'Boeing', Signe: 'grand radar rotatif (« rotodôme ») sur le dos', Base: 'Avord (BA 702)' }, txt: 'Véritable tour de contrôle volante : il détecte les aéronefs à grande distance et coordonne les avions amis. Indispensable à la police du ciel et aux opérations complexes.' },
  { id: 'reaper', nom: 'General Atomics MQ-9 Reaper', role: 'Drone de renseignement et de frappe (MALE)', facts: { Type: 'Moyenne altitude, longue endurance', Unité: 'escadron de drones 1/33 « Belfort »', Base: 'Cognac (BA 709)' }, txt: 'Piloté à distance par un équipage (pilote, opérateur capteurs…), il peut rester en vol de longues heures pour surveiller une zone, désigner des cibles et, s’il est armé, frapper.' },
  { id: 'pc21', nom: 'Pilatus PC-21', role: 'Avion d’entraînement des pilotes de chasse', facts: { Constructeur: 'Pilatus (Suisse)', Moteur: '1 turbopropulseur', Base: 'Cognac (BA 709)' }, txt: 'Avion de formation avancée du programme Mentor : son cockpit numérique prépare directement au Rafale. Les premiers élèves formés sur PC-21 ont reçu leurs « ailes » en 2020.' },
  { id: 'paf', nom: 'Alphajet — Patrouille de France', role: 'Avion d’entraînement, patrouille acrobatique', facts: { Constructeur: 'Dassault-Dornier', Moteurs: '2 turboréacteurs', Base: 'Salon-de-Provence (BA 701)' }, txt: 'La Patrouille de France, ambassadrice de l’Armée de l’Air et de l’Espace, vole sur Alphajet. Elle ouvre traditionnellement le défilé aérien du 14 Juillet.' },
  { id: 'caracal', nom: 'Airbus Helicopters H225M Caracal', role: 'Recherche et sauvetage au combat', facts: { Constructeur: 'Airbus Helicopters', Atout: 'ravitaillable en vol', Missions: 'récupération d’équipages, opérations spéciales' }, txt: 'Hélicoptère moyen capable d’aller chercher un équipage abattu loin derrière les lignes grâce au ravitaillement en vol, une capacité unique en Europe.' },
  { id: 'c130', nom: 'Lockheed Martin C-130 Hercules', role: 'Avion de transport tactique', facts: { Constructeur: 'Lockheed Martin (États-Unis)', Moteurs: '4 turbopropulseurs', Versions: 'C-130H, C-130J et ravitailleur KC-130J' }, txt: 'Avion de transport robuste, capable d’opérer depuis des terrains courts et sommaires. Complète l’A400M pour les missions tactiques.' },
];

function photo(id, alt) {
  const c = CREDITS[id];
  if (!c) return '';
  return `<figure class="photo"><img src="images/aeronefs/${id}.jpg" alt="${alt}" loading="lazy" width="792" height="445"><figcaption>Photo : ${c.artist} — <a href="${c.page}" target="_blank" rel="noopener">fiche officielle</a>.</figcaption></figure>`;
}

const dl = (facts) => `<dl class="facts">${Object.entries(facts).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;

export const FICHES_VISUEL = [
  {
    id: 'aeronefs',
    title: 'Les aéronefs de l’AAE en photos',
    train: '#/train/cult.aae',
    html: `<p>Les appareils à connaître pour l’entretien : à quoi ils servent, qui les construit, où ils sont basés. Astuce : sache dire en une phrase le rôle de chacun.</p>
      ${AERONEFS.map((a) => `<h2>${a.nom}</h2><section class="aero-card visual-v42"><div class="visual-role">${a.role}</div>${photo(a.id, a.nom)}${dl(a.facts)}<p>${a.txt}</p><details class="visual-recall"><summary>Test mémoire : quel est son rôle principal ?</summary><p>${a.role}</p></details></section>`).join('')}
      <p class="tip">Les flottes évoluent (retraits, livraisons) : vérifie l’actualité avant l’entretien.</p>`,
  },
  {
    id: 'anatomie',
    title: 'Anatomie d’un avion de combat',
    train: '#/train/bia.aeronefs',
    html: `<p>Savoir nommer les éléments d’un avion de combat montre ton intérêt réel pour le métier.</p>${anatomieChasseur()}
      <h3>À retenir</h3>
      <ul><li><b>Aile delta</b> (en triangle) : adaptée aux grandes vitesses ; les <b>plans canard</b> à l’avant améliorent la manœuvrabilité.</li><li>Les <b>élevons</b> au bord de fuite commandent à la fois le tangage et le roulis sur une aile delta sans empennage horizontal.</li><li>La <b>perche</b> permet le ravitaillement en vol (système « panier » du ravitailleur).</li><li>Le <b>radar</b> est dans le nez, sous un radôme transparent aux ondes.</li><li>Les <b>entrées d’air</b> alimentent les réacteurs ; les <b>tuyères</b> éjectent les gaz (avec postcombustion pour plus de poussée).</li></ul>`,
  },
  {
    id: 'carte',
    title: 'Carte des bases aériennes',
    train: '#/train/cult.aae',
    html: `<p>Situe les principales bases sur la carte et retiens ce qu’elles accueillent. Le jour de la sélection, tu seras à <b>Tours</b> ; l’École de l’air et de l’espace est à <b>Salon-de-Provence</b>.</p>${carteBases()}`,
  },
  {
    id: 'grades',
    title: 'Grades et insignes (schéma)',
    train: '#/train/cult.aae',
    html: `<p>Les grades d’officiers se reconnaissent au nombre de galons, ceux des généraux au nombre d’étoiles.</p>${insignesGrades()}
      <h3>Moyen mnémotechnique</h3>
      <p>Sous-lieutenant <b>1</b> → lieutenant <b>2</b> → capitaine <b>3</b> → commandant <b>4</b> → lieutenant-colonel et colonel <b>5</b> (avec 2 galons argentés pour le lieutenant-colonel). Généraux : de <b>2</b> à <b>5</b> étoiles.</p>
      <h3>Sous-officiers et militaires du rang</h3>
      <p>Sergent → sergent-chef → adjudant → adjudant-chef → major. Aviateur de 2e classe → aviateur de 1re classe → caporal → caporal-chef → caporal-chef de 1re classe.</p>
      <p>Pour t’adresser à un officier lors de la sélection : « mon lieutenant », « mon capitaine », « mon commandant », « mon colonel », « mon général ». (Usage traditionnel ; dans le doute, écoute comment les autres s’expriment.)</p>`,
  },
  {
    id: 'organisation',
    title: 'Organisation de l’AAE',
    train: '#/train/cult.defense',
    html: `<p>Qui commande quoi : de la Constitution jusqu’à l’escadron.</p>${organigramme()}
      <h3>À retenir</h3><ul><li>Le Président est le <b>chef des armées</b> ; le Parlement autorise la déclaration de guerre et la prolongation des opérations extérieures au-delà de 4 mois.</li><li>Le <b>CEMA</b> commande les opérations de toutes les armées ; le <b>CEMAAE</b> est responsable de la préparation de l’Armée de l’Air et de l’Espace.</li><li>Les aviateurs servent sur des <b>bases aériennes</b> (BA + numéro), dans des escadres et escadrons (ex. escadron de chasse 3/30 « Lorraine »).</li></ul>`,
  },
  {
    id: 'pps',
    title: 'La police du ciel (PPS) en schéma',
    train: '#/train/cult.aae',
    html: `<p>La <b>posture permanente de sûreté aérienne</b> protège l’espace aérien français 24 h/24, 365 jours par an.</p>${chainePPS()}
      <p class="tip">Exemple d’entretien : « Pouvez-vous me citer une mission de l’AAE qui se déroule en ce moment même ? » → la police du ciel : des équipages sont en alerte en permanence.</p>`,
  },
  {
    id: 'dissuasion',
    title: 'La dissuasion nucléaire en schéma',
    train: '#/train/cult.defense',
    html: `<p>But : protéger les <b>intérêts vitaux</b> de la France en dissuadant toute agression, quelle qu’en soit l’origine.</p>${schemaDissuasion()}
      <h3>Vocabulaire</h3><ul><li><b>FAS</b> : Forces aériennes stratégiques, créées en 1964 (Mirage IV).</li><li><b>ASMPA</b> : missile air-sol moyenne portée amélioré.</li><li><b>Poker</b> : exercice de raid nucléaire simulé, plusieurs fois par an.</li></ul>`,
  },
  {
    id: 'frise',
    title: 'Frise chronologique illustrée',
    train: '#/train/cult.histoire',
    html: `<p>Dix dates clés, de Blériot à l’Armée de l’Air et de l’Espace.</p>${frise()}<p>Pour aller plus loin : fiche « Grandes dates de l’aviation » dans la section Culture militaire.</p>`,
  },
];

const diagram=(label,body)=>'<figure class="schema visual-diagram"><svg viewBox="0 0 360 210" role="img" aria-label="'+label+'">'+body+'</svg><figcaption>'+label+' · schéma de principe</figcaption></figure>';
const txt=(x,y,t)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="currentColor" font-size="13" font-weight="600">'+t+'</text>';
const line=(x,y,X,Y,color='#315f91')=>'<path d="M'+x+' '+y+' L'+X+' '+Y+'" stroke="'+color+'" stroke-width="3" fill="none"/>';
const plane='<path d="M65 105 L100 102 L85 75 L99 75 L126 101 L276 101 Q300 101 310 110 Q300 119 276 119 L105 119 Z" fill="#94a9bc" stroke="#315f91"/><path d="M165 109 L125 154 L151 154 L216 110 Z" fill="#c0cfdb" stroke="#315f91"/>';
const recall=(q,a)=>'<details class="visual-recall"><summary>'+q+'</summary><p>'+a+'</p></details>';
FICHES_VISUEL.push(
{id:'axes-vol',title:'Les trois axes de rotation',train:'#/physique/vol/exos',html:'<h2>Roulis, tangage, lacet</h2>'+diagram('Axes du mouvement de l’avion',plane+line(42,110,330,110)+line(180,30,180,190,'#b86a36')+line(115,165,245,55,'#34816c')+txt(65,95,'Roulis')+txt(180,20,'Lacet')+txt(270,48,'Tangage'))+'<h2>Associer les commandes</h2><p>Roulis : rotation autour de l’axe longitudinal, commandée principalement par les ailerons. Tangage : axe transversal, gouverne de profondeur. Lacet : axe vertical, gouverne de direction.</p>'+recall('Quelle rotation fait monter le nez ?','Le tangage.')},
{id:'triangle-vent',title:'Triangle des vitesses et dérive',train:'#/physique/cinematique/exos',html:'<h2>Trois vecteurs</h2>'+diagram('Vitesse air + vent = vitesse sol',line(45,170,220,45)+line(220,45,310,45,'#b86a36')+line(45,170,310,45,'#34816c')+txt(105,85,'Vitesse air')+txt(265,30,'Vent')+txt(210,135,'Vitesse sol'))+'<h2>Comprendre la dérive</h2><p>La vitesse sol est la somme vectorielle de la vitesse de l’avion par rapport à l’air et de la vitesse du vent. Le cap et la route peuvent donc différer.</p>'+recall('Un vent traversier peut-il modifier la route ?','Oui, si le cap n’est pas corrigé.')},
{id:'pente-visuelle',title:'Visualiser une pente de descente',train:'#/maths/trigo/exos',html:'<h2>Distance et hauteur</h2>'+diagram('Triangle de descente, angles exagérés',line(35,170,325,170)+line(35,45,35,170)+line(35,45,325,170,'#34816c')+txt(180,190,'Distance horizontale')+txt(65,100,'h')+txt(280,150,'3°'))+'<h2>Calcul</h2><p>h = distance horizontale × tan(3°). À 5 NM, cela représente environ 1 592 ft au-dessus du point de référence, sans hauteur de franchissement du seuil.</p>'+recall('À distance double, que devient la hauteur sur la même pente ?','Elle double.')});
