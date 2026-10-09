// Fiches de cours : méthodes pour chaque type de test psychotechnique.
import { frac } from '../core/fmt.js';

export const FICHES_PSYCHO = [
  {
    id: 'principes',
    title: 'Réussir les tests psychotechniques',
    train: '#/exam/express',
    html: `
      <p>Les tests psychotechniques ne mesurent pas des connaissances mais des <b>aptitudes</b> : raisonner, se représenter l’espace, traiter vite une information, rester attentif. Bonne nouvelle : ces aptitudes <b>s’entraînent</b>. La source officielle conseille un mois d’exercices quotidiens au minimum.</p>
      <h3>Ce qui est évalué (source officielle)</h3>
      <ul><li><b>TAMI-C</b> : raisonnement, spatial, arithmétique, verbal, attention, vitesse de codage.</li><li><b>Tests navigants</b> : visualisation spatiale à partir des instruments, lecture rapide d’instruments, problèmes arithmétiques, attention en multitâche, structuration rapide d’informations, palonnier et épreuve psychomotrice.</li></ul>
      <h3>Les 6 règles d’or</h3>
      <ol>
        <li><b>Gère ton temps</b> : ne bloque jamais plus de 2 fois le temps moyen sur une question. Passe et reviens si c’est possible.</li>
        <li><b>Vitesse ET justesse</b> : à l’entraînement, commence sans chrono pour comprendre, puis chronomètre-toi.</li>
        <li><b>Élimine</b> les réponses absurdes avant de chercher la bonne.</li>
        <li><b>Méthode systématique</b> : chaque type de test a sa routine (voir les fiches suivantes). Applique-la toujours dans le même ordre.</li>
        <li><b>Régularité</b> : 20 minutes par jour valent mieux que 3 heures le dimanche.</li>
        <li><b>Forme physique</b> : sommeil, hydratation, pas de nuit blanche avant les tests.</li>
      </ol>
      <h3>Le jour J</h3>
      <p>Lis entièrement chaque consigne et fais les exemples sérieusement. Ne te laisse pas déstabiliser par une épreuve ratée : chaque épreuve est notée séparément. Respire lentement entre deux épreuves (inspiration 4 s, expiration 6 s).</p>`,
  },
  {
    id: 'suites',
    title: 'Suites logiques (nombres, lettres, dominos)',
    train: '#/train/psy.suites-nombres',
    html: `
      <h3>La routine en 4 questions</h3>
      <ol>
        <li><b>Quels sont les écarts ?</b> Écris la différence entre chaque terme. S’ils sont constants → suite arithmétique (+k).</li>
        <li><b>Les écarts forment-ils eux-mêmes une suite ?</b> (+1, +2, +3… ou ×2 : 1, 2, 4, 8…)</li>
        <li><b>Est-ce multiplicatif ?</b> Rapport constant → suite géométrique (×k). Ou « ×a + b ».</li>
        <li><b>Y a-t-il deux suites mêlées ?</b> Regarde les termes de rang impair et de rang pair séparément ; ou une alternance de deux opérations (+3, ×2, +3, ×2…).</li>
      </ol>
      <div class="ex">2, 5, 11, 23, 47 → écarts 3, 6, 12, 24 : ils doublent → prochain écart 48 → <b>95</b> (c’est aussi ×2 + 1).</div>
      <h3>À connaître par cœur</h3>
      <ul><li>Carrés : 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.</li><li>Cubes : 1, 8, 27, 64, 125, 216.</li><li>Puissances de 2 : 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1 024.</li><li>Fibonacci : chaque terme = somme des deux précédents (1, 1, 2, 3, 5, 8, 13…).</li><li>Nombres premiers : 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.</li></ul>
      <h3>Suites de lettres</h3>
      <p>Transforme les lettres en nombres (A = 1 … Z = 26), applique la routine, puis reconvertis. Repères : <b>E = 5, J = 10, O = 15, T = 20, Z = 26</b>. Après Z on revient à A. Les paires « miroir » (A–Z, B–Y, C–X) ont des rangs dont la somme vaut 27.</p>
      <h3>Dominos</h3>
      <p>Chaque moitié va de 0 à 6, et la suite « tourne » : après 6 vient 0. Étudie la suite des moitiés du haut, puis celle du bas, séparément. Si ça ne marche pas, compare le haut d’un domino au bas du précédent (les moitiés peuvent se croiser).</p>`,
  },
  {
    id: 'matrices',
    title: 'Matrices de figures',
    train: '#/train/psy.matrices',
    html: `
      <p>Une matrice 3 × 3 contient des figures qui varient selon des <b>attributs</b> : forme, nombre, couleur ou remplissage, taille, orientation, position.</p>
      <h3>La méthode</h3>
      <ol><li>Liste les attributs qui changent (souvent 2 ou 3).</li><li>Pour <b>chaque attribut séparément</b>, lis les lignes puis les colonnes.</li><li>Identifie la règle parmi les plus fréquentes (ci-dessous).</li><li>Construis mentalement la case manquante, <b>puis</b> cherche-la dans les réponses (et pas l’inverse).</li></ol>
      <h3>Les règles les plus fréquentes</h3>
      <ul>
        <li><b>Constante</b> : l’attribut est le même partout.</li>
        <li><b>Par ligne / par colonne</b> : identique dans une ligne, change d’une ligne à l’autre.</li>
        <li><b>Distribution (« carré latin »)</b> : chaque valeur apparaît une seule fois par ligne et par colonne. La case manquante a la valeur qui manque.</li>
        <li><b>Progression</b> : +1 élément, rotation de 45° ou 90° à chaque case.</li>
        <li><b>Addition / soustraction</b> : case 3 = case 1 + case 2 (superposition), ou on retire les éléments communs.</li>
      </ul>
      <p class="tip">Les mauvaises réponses diffèrent souvent de la bonne par <b>un seul</b> attribut. Si tu hésites entre deux réponses, cherche l’attribut qui les distingue et vérifie seulement celui-là.</p>`,
  },
  {
    id: 'spatial',
    title: 'Raisonnement spatial : rotations et cubes',
    train: '#/train/psy.cubes',
    html: `
      <h3>Rotation ou miroir ?</h3>
      <p>Une figure <b>tournée</b> garde son « sens » ; une figure <b>retournée</b> (miroir) l’inverse : aucune rotation ne permet de passer de l’une à l’autre. Ta main droite tournée reste une main droite ; dans un miroir, elle devient une main gauche.</p>
      <ol><li>Repère un <b>détail asymétrique</b> (un bras qui dépasse, un coin).</li><li>Situe-le par rapport à un autre détail : « le bras est à droite quand la base est en bas ».</li><li>Fais tourner mentalement la figure pour remettre la base en bas, puis vérifie où est le bras.</li></ol>
      <p class="tip">Astuce : tourner de 180° revient à lire la figure « à l’envers » (haut ↔ bas et gauche ↔ droite en même temps).</p>
      <h3>Patrons de cube</h3>
      <ul>
        <li>Un cube a 6 faces, et 11 patrons différents sont possibles.</li>
        <li><b>Règle n° 1</b> : deux faces séparées par <b>exactement une case</b> sur une même ligne ou colonne du patron sont <b>opposées</b>. Deux faces opposées ne sont <b>jamais visibles ensemble</b> sur un dessin de cube.</li>
        <li><b>Règle n° 2</b> : deux faces qui se touchent par un côté dans le patron sont voisines sur le cube.</li>
        <li><b>Règle n° 3 (le sens)</b> : autour d’un coin du cube, les trois faces apparaissent dans un ordre (horaire ou anti-horaire). Un cube « miroir » a les bonnes faces dans le mauvais ordre.</li>
      </ul>
      <div class="ex">Méthode rapide : 1) liste les 3 paires de faces opposées ; 2) élimine tout cube qui montre une paire opposée ; 3) pour les cubes restants, vérifie l’ordre des faces autour du coin en repliant mentalement à partir d’une face commune.</div>`,
  },
  {
    id: 'mecanique',
    title: 'Compréhension mécanique',
    train: '#/train/psy.mecanique',
    html: `
      <h3>Engrenages</h3>
      <ul><li>Deux roues en contact tournent en <b>sens inverse</b>. Dans un train de roues : roues n° 1, 3, 5… dans le même sens ; n° 2, 4, 6… dans l’autre.</li><li>Roues reliées par une <b>courroie droite</b> : même sens. Courroie <b>croisée</b> : sens inverse.</li><li>Vitesse : N<sub>A</sub> × Z<sub>A</sub> = N<sub>B</sub> × Z<sub>B</sub> (Z = nombre de dents). La petite roue tourne plus vite.</li><li>Deux roues sur le même axe tournent ensemble (même sens, même vitesse).</li></ul>
      <h3>Leviers</h3>
      <p>Équilibre : <b>force × distance au pivot</b> identique des deux côtés (moment). Plus on appuie loin du pivot, moins il faut de force.</p>
      <h3>Poulies</h3>
      <ul><li>Poulie fixe : change seulement la direction de la force.</li><li>Palan à n brins porteurs : force divisée par n, mais il faut tirer n fois plus de corde.</li></ul>
      <h3>Fluides</h3>
      <ul><li>Pression = force ÷ surface. Presse hydraulique : la force est multipliée par le rapport des surfaces.</li><li>Pression dans un liquide : augmente avec la profondeur, pas avec la forme du récipient.</li><li>Vases communicants : le liquide est au même niveau partout.</li><li>Un fluide accélère dans un rétrécissement et sa pression baisse (effet Venturi).</li></ul>
      <h3>Autres réflexes</h3>
      <ul><li>Plan incliné : plus il est long et peu pentu, moins il faut de force (mais plus de distance).</li><li>Centre de gravité bas et base large = objet stable.</li><li>Une roue plus grande parcourt plus de distance par tour (périmètre = 2πr).</li></ul>`,
  },
  {
    id: 'attention',
    title: 'Attention, barrage et codage',
    train: '#/train/psy.codage',
    html: `
      <h3>Barrage (trouver des cibles dans une grille)</h3>
      <ul><li>Balaye <b>ligne par ligne</b>, toujours dans le même sens, sans revenir en arrière.</li><li>Fixe-toi un repère pour les symboles miroirs : b/d (la panse du b est à droite), p/q.</li><li>Garde un rythme régulier : la précision compte autant que la vitesse (une erreur annule une bonne réponse).</li></ul>
      <h3>Comptage</h3>
      <p>Découpe la série en petits groupes (de 5 ou 6), compte chaque groupe et additionne au fur et à mesure. Pointe du doigt si c’est permis.</p>
      <h3>Vitesse de codage</h3>
      <ul><li>Mémorise la table de code par paires dès le début (les 3-4 premières associations).</li><li>Les réponses fausses diffèrent souvent d’un seul caractère ou de deux caractères inversés : vérifie le début et la fin du code.</li><li>Ne relis pas toute la table à chaque symbole : retiens ce que tu viens d’utiliser.</li></ul>
      <h3>Entretenir sa concentration</h3>
      <p>La concentration baisse après 15-20 minutes d’effort. Entraîne-toi sur des séries de plus en plus longues, et coupe le téléphone (notifications) pendant les séances.</p>`,
  },
  {
    id: 'memoire',
    title: 'Mémoire : techniques',
    train: '#/train/psy.memoire-chiffres',
    html: `
      <p>La mémoire de travail retient en moyenne <b>7 ± 2 éléments</b>. Pour aller au-delà, on regroupe et on donne du sens.</p>
      <h3>Chiffres</h3>
      <ul><li><b>Regroupement</b> : 4 7 1 8 2 9 → « 47 – 18 – 29 » (3 éléments au lieu de 6).</li><li><b>Répétition subvocale</b> : répète la série dans ta tête en rythme.</li><li><b>À l’envers</b> : mémorise les paquets à l’endroit, puis lis chaque paquet de droite à gauche en commençant par le dernier.</li><li>Associe à des repères connus : années (1918), codes (7700), heures (18 h 29).</li></ul>
      <h3>Séquences spatiales</h3>
      <p>Donne un nom à chaque case (« haut-gauche, centre, bas… ») ou mémorise la forme du trajet (un « Z », un « L »).</p>
      <h3>Images</h3>
      <p>Nomme chaque image à voix basse et invente une petite histoire qui les relie dans l’ordre (« l’avion vole vers la lune, puis… »). Pour les positions, mémorise ligne par ligne.</p>
      <h3>Pour progresser</h3>
      <p>Allonge progressivement les séries (+1 élément quand tu réussis 3 fois d’affilée). Le sommeil consolide la mémoire : révise la veille au soir plutôt que juste avant.</p>`,
  },
  {
    id: 'calcul',
    title: 'Calcul mental : les astuces',
    train: '#/train/psy.calcul',
    html: `
      <h3>Multiplications rapides</h3>
      <ul>
        <li><b>× 5</b> = × 10 puis ÷ 2 : 48 × 5 = 480 ÷ 2 = 240.</li>
        <li><b>× 9</b> = × 10 − le nombre : 37 × 9 = 370 − 37 = 333.</li>
        <li><b>× 11</b> (2 chiffres) : 53 × 11 → 5 (5+3) 3 = 583.</li>
        <li><b>× 25</b> = × 100 ÷ 4 : 36 × 25 = 3 600 ÷ 4 = 900.</li>
        <li><b>Décomposer</b> : 27 × 14 = 27 × 10 + 27 × 4 = 270 + 108 = 378.</li>
        <li><b>Doubler / diviser par deux</b> : 16 × 35 = 8 × 70 = 560.</li>
        <li>Carré d’un nombre finissant par 5 : 35² → 3 × 4 = 12, puis on écrit 25 → 1 225.</li>
      </ul>
      <h3>Additions et soustractions</h3>
      <ul><li>Arrondir puis corriger : 398 + 247 = 400 + 247 − 2 = 645.</li><li>Soustraire par complément : 1 000 − 387 → de 387 à 400 : 13, puis 600 → 613.</li></ul>
      <h3>Pourcentages</h3>
      <ul><li>10 % = ÷ 10 ; 5 % = moitié de 10 % ; 1 % = ÷ 100 ; 25 % = ÷ 4 ; 50 % = ÷ 2.</li><li>x % de y = y % de x : 8 % de 50 = 50 % de 8 = 4.</li></ul>
      <h3>Temps et vitesses (problèmes de pilote)</h3>
      <ul>
        <li>Convertis la vitesse par minute : 180 kt = 3 NM/min ; 240 km/h = 4 km/min ; 120 kt = 2 NM/min.</li>
        <li>Durées : 1,5 h = 1 h 30 ; 0,25 h = 15 min ; 0,1 h = 6 min ; 20 min = 1/3 h.</li>
        <li>Additionne les heures puis les minutes ; au-delà de 60 min, retire 60 et ajoute 1 h.</li>
        <li>Consommation : débit (L/h) × durée (en h).</li>
      </ul>
      <h3>Fractions utiles</h3>
      <p>${frac(1, 2)} = 0,5 · ${frac(1, 4)} = 0,25 · ${frac(3, 4)} = 0,75 · ${frac(1, 5)} = 0,2 · ${frac(1, 8)} = 0,125 · ${frac(1, 3)} ≈ 0,333 · ${frac(2, 3)} ≈ 0,667.</p>
      <p class="tip">Toujours <b>estimer</b> avant de calculer : si la réponse trouvée est loin de l’estimation, il y a une erreur.</p>`,
  },
  {
    id: 'instruments',
    title: 'Lire les instruments de bord',
    train: '#/train/psy.horizon',
    html: `
      <h3>Le « T basique »</h3>
      <p>Au centre, l’<b>horizon artificiel</b> ; à gauche l’<b>anémomètre</b> (vitesse) ; à droite l’<b>altimètre</b> ; en dessous le <b>conservateur de cap</b>. Autour : variomètre (vitesse verticale) et indicateur de virage avec la bille.</p>
      <h3>Horizon artificiel</h3>
      <ul><li>La maquette (l’avion) est <b>fixe</b>, l’horizon bouge. Bleu = ciel, marron = sol.</li><li><b>Assiette</b> : maquette au-dessus de la ligne d’horizon = nez haut (montée) ; en dessous = nez bas (descente).</li><li><b>Inclinaison</b> : regarde quelle aile de la maquette est plus basse que l’horizon → c’est le côté du virage. L’horizon, lui, penche dans le sens <b>opposé</b>.</li></ul>
      <h3>Conservateur de cap</h3>
      <ul><li>On lit la valeur sous le repère du haut. N = 360, E = 090, S = 180, W = 270.</li><li>Les chiffres sont en dizaines de degrés : « 3 » = 030, « 12 » = 120, « 33 » = 330.</li><li>Virage à droite : on <b>ajoute</b> ; à gauche : on <b>retire</b>. On reste entre 001 et 360.</li><li>Cap inverse = cap ± 180 (astuce : + 200 − 20).</li></ul>
      <h3>Altimètre (2 aiguilles)</h3>
      <p>Petite aiguille = <b>milliers</b> de pieds, grande aiguille = <b>centaines</b>. Lis d’abord la petite (ordre de grandeur), puis précise avec la grande. Ex. : petite entre 3 et 4, grande sur 5 → 3 500 ft.</p>
      <h3>Anémomètre</h3>
      <p>Arcs de couleur : blanc = plage d’utilisation des volets ; vert = utilisation normale ; jaune = air calme seulement ; trait rouge = <b>VNE</b> (à ne jamais dépasser).</p>
      <h3>Variomètre et bille</h3>
      <p>Le variomètre indique la vitesse verticale (ft/min). La bille indique la symétrie du vol : « le pied chasse la bille » (bille à droite → palonnier à droite).</p>`,
  },
  {
    id: 'multitache',
    title: 'Multitâche et gestion du stress',
    train: '#/train/psy.multitache',
    html: `
      <p>Les tests navigants évaluent ta capacité à <b>partager ton attention</b> entre plusieurs tâches et à <b>prioriser</b>.</p>
      <h3>Prioriser comme un pilote</h3>
      <p>La règle de base en aviation : <b>« aviate, navigate, communicate »</b> — d’abord piloter (tenir l’avion), ensuite naviguer, enfin communiquer. Dans un test multitâche, la tâche continue (poursuite, pilotage) est la priorité ; les tâches ponctuelles (calcul, voyants) passent après.</p>
      <h3>Technique</h3>
      <ul><li>Garde la tâche principale dans ta vision périphérique et fais des coups d’œil <b>brefs</b> vers les autres.</li><li>Ne t’acharne pas sur un calcul difficile : une réponse rapide et approximative vaut mieux qu’une poursuite perdue.</li><li>Réagis aux alarmes tout de suite : c’est souvent la tâche la plus « payante ».</li></ul>
      <h3>Gérer le stress</h3>
      <ul><li><b>Respiration</b> : inspire 4 s par le nez, expire 6 s. Trois cycles suffisent à faire baisser le rythme cardiaque.</li><li><b>Dialogue intérieur</b> : remplace « je rate tout » par « prochaine action : … ».</li><li><b>Une erreur passée est passée</b> : concentre-toi sur la question suivante.</li><li>Entraîne-toi en conditions réelles (chrono, bruit) pour que le jour J ressemble à l’entraînement.</li></ul>`,
  },
  {
    id: 'structuration',
    title: 'Structuration d’informations',
    train: '#/train/psy.structuration',
    html: `
      <p>Test cognitif des navigants (confirmé par la source officielle) : on te donne un <b>tableau</b> (vols, équipages, avions…) et des questions qui demandent de <b>trouver et croiser</b> des informations vite. C’est le quotidien d’un équipage : lire un plan de vol, une liste de terrains, des consignes.</p>
      <h3>Méthode</h3>
      <ol><li><b>Lis la question d’abord</b>, puis le tableau : tu sais ce que tu cherches.</li><li>Repère les <b>colonnes utiles</b> (souvent 2 ou 3 sur 6) et ignore le reste.</li><li>Avec plusieurs critères, <b>élimine</b> critère par critère, en commençant par le plus sélectif.</li><li>Pour une heure d’arrivée : heure de départ + durée, en séparant heures et minutes (10h45 + 1 h 30 = 11h45 + 30 min = 12h15).</li><li>Pour un comptage, parcours le tableau <b>une seule fois</b>, ligne par ligne, en comptant sur tes doigts.</li></ol>
      <h3>Pièges</h3>
      <ul><li>« Au plus tard à 14h00 » inclut 14h00 ; « après 14h00 » ne l’inclut pas.</li><li>Ne confonds pas heure de départ et heure d’arrivée.</li><li>Une règle « pour les vols de plus de 3 h » ne s’applique pas aux autres vols.</li></ul>`,
  },
  {
    id: 'verbal',
    title: 'Raisonnement verbal',
    train: '#/train/psy.verbal',
    html: `
      <h3>Synonymes et contraires</h3>
      <p>Remplace le mot dans une phrase simple : le bon synonyme doit garder le sens. Méfie-toi des mots qui se ressemblent (probant ≠ probable ; prodigue ≠ prodigieux).</p>
      <h3>Analogies (A est à B ce que C est à ?)</h3>
      <ol><li>Formule la relation entre A et B en une phrase : « le pilote <i>conduit</i> l’avion ».</li><li>Applique la même phrase à C : « le capitaine <i>conduit</i> … le navire ».</li></ol>
      <p>Relations fréquentes : partie/tout, outil/fonction, cause/effet, contraire, catégorie/élément, auteur/œuvre, instrument/grandeur mesurée.</p>
      <h3>Intrus</h3>
      <p>Trouve la catégorie commune à la majorité des mots ; l’intrus est celui qui n’y entre pas. S’il y a plusieurs possibilités, choisis le critère le plus précis.</p>
      <h3>Enrichir son vocabulaire</h3>
      <p>Lis la presse (rubriques défense et sciences), note les mots inconnus et cherche-les. Connaître les préfixes aide beaucoup : <i>a-/in-</i> (contraire), <i>ambi-</i> (les deux), <i>pré-</i> (avant), <i>-cide</i> (qui tue), <i>-phile</i> (qui aime).</p>`,
  },
];
