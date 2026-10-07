// Questions supplémentaires : histoire, Armée de l'Air et de l'Espace, défense, BIA.
const toItems = (arr) => arr.map(([q, a, d, e, l = 1]) => ({ q, a, d, e, l }));

export const HISTOIRE_EXTRA = toItems([
  ['Qui est la première femme au monde à obtenir un brevet de pilote (1910) ?', 'Raymonde de Laroche', ['Hélène Boucher', 'Amelia Earhart', 'Adrienne Bolland'], '<b>Raymonde de Laroche</b>, brevetée en mars 1910.'],
  ['Hélène Boucher est connue pour :', 'ses records de vitesse en 1934', ['la première traversée de la Manche', 'le premier vol de nuit', 'la création de l’Aéropostale'], 'Aviatrice de records, elle meurt en 1934 à seulement 26 ans.', 2],
  ['Maryse Bastié a notamment traversé en 1936 :', 'l’Atlantique Sud', ['la Manche', 'le Pacifique', 'les Alpes en planeur'], 'Elle relie Dakar à Natal (Brésil) en 1936 et bat de nombreux records de distance.', 3],
  ['En 1930, Jean Mermoz réalise la première liaison postale aérienne commerciale au-dessus de :', 'l’Atlantique Sud', ['la Méditerranée', 'l’Atlantique Nord', 'l’océan Indien'], 'Sur l’hydravion Laté 28 « Comte-de-La-Vaulx », du Sénégal au Brésil.', 2],
  ['Henri Guillaumet est célèbre pour avoir survécu en 1930 :', 'à un accident dans la cordillère des Andes, après plusieurs jours de marche', ['à un naufrage dans l’Atlantique', 'à une panne dans le désert du Sahara uniquement', 'à une collision en vol'], 'Saint-Exupéry raconte cet épisode dans « Terre des hommes ».', 2],
  ['La catastrophe du dirigeable Hindenburg (1937) a marqué :', 'la fin des grands dirigeables de transport de passagers', ['le début de l’aviation à réaction', 'la création de l’OACI', 'le premier vol transatlantique'], 'Le dirigeable gonflé à l’hydrogène prend feu à Lakehurst (États-Unis).', 2],
  ['En quelle année Spoutnik, premier satellite artificiel, est-il lancé ?', '1957', ['1945', '1961', '1969'], 'Lancé par l’URSS le 4 octobre <b>1957</b>, il ouvre la course à l’espace.'],
  ['Neil Armstrong marche sur la Lune en :', 'juillet 1969', ['avril 1961', 'décembre 1972', 'juillet 1957'], 'Mission <b>Apollo 11</b>.'],
  ['Le consortium européen Airbus est créé en :', '1970', ['1945', '1958', '1990'], 'Airbus Industrie est fondé fin 1970 ; son premier avion, l’A300, vole en 1972.', 2],
  ['Le Mirage IV, premier vecteur de la dissuasion nucléaire aéroportée française, vole pour la première fois en :', '1959', ['1939', '1975', '1986'], 'Il équipe les Forces aériennes stratégiques à partir de 1964.', 3],
]);

export const AAE_EXTRA = toItems([
  ['Sur un Rafale, que signifie la lettre « B » (Rafale B) ?', 'biplace', ['bombardier', 'version de base', 'version de la Marine'], 'Rafale <b>B</b> = biplace, <b>C</b> = monoplace (de l’armée de l’Air), <b>M</b> = version Marine (porte-avions).'],
  ['Le Rafale possède, devant l’aile, de petites surfaces mobiles appelées :', 'plans canard', ['dérives', 'winglets', 'becs'], 'Les <b>plans canard</b> améliorent la manœuvrabilité de son aile delta.', 2],
  ['Le Meteor est :', 'un missile air-air à longue portée', ['un missile de croisière', 'un drone', 'un radar'], 'Le <b>SCALP</b> est un missile de croisière ; l’<b>ASMPA</b> est le missile nucléaire.', 2],
  ['L’A330 MRTT Phénix remplace progressivement l’ancien ravitailleur :', 'C-135 FR', ['Transall C-160', 'Mirage IV', 'Boeing 747'], 'Les C-135 de la 31e escadre d’Istres sont remplacés par les Phénix.', 3],
  ['Quel escadron met en œuvre les drones Reaper à Cognac ?', 'l’escadron de drones 1/33 « Belfort »', ['la Patrouille de France', 'l’escadron 3/30 « Lorraine »', 'le CEAM'], 'Escadron de drones <b>1/33 « Belfort »</b>, BA 709 de Cognac.', 3],
  ['Le Centre d’expertise aérienne militaire (CEAM) sert à :', 'tester les nouveaux matériels et définir les tactiques', ['former les mécaniciens', 'organiser le défilé du 14 Juillet', 'sélectionner les candidats'], 'Installé à Mont-de-Marsan, il met au point les nouvelles capacités.', 2],
  ['Que signifie CEMAAE ?', 'chef d’état-major de l’Armée de l’Air et de l’Espace', ['commandement européen des moyens aériens', 'centre d’entraînement militaire aéronautique', 'conseil d’état-major de l’AAE'], 'Le CEMAAE commande l’AAE, sous l’autorité du CEMA.'],
  ['Le 11 septembre 2020, la cérémonie du nouveau nom de l’AAE a eu lieu sur la base de :', 'Villacoublay', ['Salon-de-Provence', 'Tours', 'Istres'], 'Sur la BA 107 de Villacoublay, qui accueille notamment les avions gouvernementaux.', 3],
  ['Que signifie OPEX ?', 'opération extérieure', ['opération exceptionnelle', 'officier expert', 'opération expérimentale'], 'Les OPEX sont les opérations militaires menées hors du territoire national.'],
  ['Où se trouve le siège du ministère des Armées ?', 'à Balard, à Paris', ['à Brest', 'aux Invalides seulement', 'à Lyon'], 'Le « Pentagone à la française », à Balard (Paris 15e), regroupe les états-majors.', 2],
  ['À Cognac, quel avion a remplacé l’Epsilon et l’Alphajet pour former les pilotes de chasse ?', 'le Pilatus PC-21', ['le Rafale B', 'le Mirage 2000', 'le Cirrus SR20'], 'Programme <b>Mentor</b> : les premiers PC-21 arrivent à Cognac en 2018 ; les premières « ailes » de pilotes formés sur PC-21 sont remises en 2020.', 2],
  ['Guynemer appartenait à la célèbre escadrille :', 'des Cigognes (SPA 3)', ['La Fayette', 'Normandie-Niémen', 'des Aigles'], 'L’escadrille <b>SPA 3</b>, des « Cigognes ».', 3],
  ['Le Commandement de l’espace a été créé par un arrêté du :', '3 septembre 2019', ['14 juillet 1934', '11 septembre 2020', '1er janvier 2000'], 'Il est rattaché à l’armée de l’Air, qui devient l’Armée de l’Air et de l’Espace en 2020.', 3],
  ['Le Mirage 2000-5 est surtout un avion :', 'de défense aérienne', ['de transport', 'd’entraînement', 'de ravitaillement'], 'Il a été conçu pour l’interception et la défense aérienne.', 2],
  ['Pourquoi le ravitaillement en vol est-il stratégique ?', 'il augmente l’allonge des avions (distance et durée de mission)', ['il réduit le bruit', 'il permet de voler sans pilote', 'il remplace la maintenance'], 'Il permet par exemple des raids à très longue distance ou de longues patrouilles.'],
]);

export const DEFENSE_EXTRA = toItems([
  ['L’article 51 de la Charte des Nations unies reconnaît :', 'le droit de légitime défense', ['le droit de veto', 'l’interdiction du nucléaire', 'la création de l’OTAN'], 'Un État agressé peut se défendre, individuellement ou collectivement.', 2],
  ['Où se trouve le siège de l’ONU ?', 'New York', ['Genève', 'Bruxelles', 'Paris'], 'L’Office des Nations unies à Genève est un siège secondaire.'],
  ['Combien de membres compte le Conseil de sécurité de l’ONU ?', '15', ['5', '10', '27'], '5 membres permanents + 10 membres non permanents élus pour 2 ans.', 2],
  ['Le mur de Berlin a été construit en :', '1961', ['1945', '1949', '1989'], 'Construit en <b>1961</b>, il tombe le 9 novembre 1989.'],
  ['La crise des missiles de Cuba a eu lieu en :', '1962', ['1949', '1956', '1979'], 'Moment le plus dangereux de la guerre froide entre États-Unis et URSS.'],
  ['L’URSS a été dissoute en :', '1991', ['1985', '1989', '2000'], 'En décembre 1991.'],
  ['Le Traité sur la non-prolifération des armes nucléaires (TNP) date de :', '1968', ['1945', '1991', '2017'], 'Signé en 1968 ; la France y adhère en 1992.', 3],
  ['Quelles sont les trois armées françaises ?', 'Terre, Marine nationale, Air et Espace', ['Terre, Air, Gendarmerie', 'Marine, Air, Cyber', 'Terre, Marine, Espace'], 'La Gendarmerie est une force armée rattachée au ministère de l’Intérieur ; il existe aussi des services interarmées (santé, commissariat…).'],
  ['Le 11 novembre commémore :', 'l’armistice de 1918', ['la victoire de 1945', 'la prise de la Bastille', 'la libération de Paris'], 'Le 8 mai commémore la victoire de 1945.'],
  ['Qui nomme les officiers généraux ?', 'le Président de la République, en Conseil des ministres', ['le Parlement', 'le chef d’état-major des armées', 'le Premier ministre seul'], 'Article 13 de la Constitution.', 3],
  ['Pourquoi la France se dit-elle une puissance de l’Indo-Pacifique ?', 'grâce à ses territoires et ses forces dans cette région (Nouvelle-Calédonie, Polynésie, La Réunion…)', ['parce qu’elle y a sa capitale', 'parce qu’elle est membre de l’ASEAN', 'parce que l’OTAN y est basée'], 'La France y a des territoires, des citoyens et une immense zone économique exclusive.', 2],
  ['La JDC a remplacé en 2011 :', 'la JAPD (Journée d’appel de préparation à la défense)', ['le service militaire', 'le SNU', 'les classes préparatoires militaires'], 'La JAPD existait depuis la suspension du service militaire.', 3],
  ['La guerre froide opposait principalement :', 'les États-Unis et l’URSS', ['la France et l’Allemagne', 'la Chine et le Japon', 'l’OTAN et l’ONU'], 'Affrontement indirect entre deux blocs, de 1947 environ à 1991.'],
  ['Que signifie « souveraineté » pour un État ?', 'le fait de décider librement, sans autorité supérieure', ['le fait d’avoir un roi', 'l’appartenance à l’OTAN', 'l’obligation de suivre l’ONU'], 'La défense est un pilier de la souveraineté nationale.'],
  ['Qu’est-ce que le « domaine spatial militaire » permet notamment ?', 'l’observation, les communications et la navigation par satellite', ['le transport de troupes', 'la police du ciel uniquement', 'le ravitaillement en vol'], 'D’où la création du Commandement de l’espace pour protéger ces moyens.'],
]);

export const BIA_AERO_EXTRA = toItems([
  ['Un profil symétrique à incidence nulle produit :', 'aucune portance', ['une portance maximale', 'une portance négative forte', 'une poussée'], 'Symétrique : extrados et intrados identiques, donc pas de différence de pression à incidence nulle.', 2],
  ['La « polaire » d’un avion est la courbe :', 'du Cz en fonction du Cx', ['de la vitesse en fonction du temps', 'de l’altitude en fonction de la température', 'du poids en fonction du carburant'], 'Elle permet de trouver la finesse maximale (tangente depuis l’origine).', 3],
  ['En virage en palier à 45° d’inclinaison, le facteur de charge vaut environ :', '1,41', ['1', '2', '3'], 'n = 1/cos 45° ≈ 1/0,707 ≈ 1,41.', 2],
  ['Pour planer le plus loin possible (moteur arrêté), on vole :', 'à la vitesse de finesse maximale', ['le plus vite possible', 'le plus lentement possible', 'volets sortis'], 'C’est la vitesse qui donne le meilleur rapport distance/hauteur.', 2],
  ['Quand l’incidence augmente (avant le décrochage), le Cz :', 'augmente', ['diminue', 'reste constant', 'devient nul'], 'Jusqu’à l’incidence critique, où il chute.'],
  ['L’effet Venturi décrit :', 'l’accélération d’un fluide dans un rétrécissement, avec une baisse de pression', ['le réchauffement de l’air en altitude', 'la rotation de la Terre', 'la flottabilité'], 'Principe du carburateur et du tube Venturi.', 2],
  ['Si la masse de l’avion augmente, la vitesse de finesse maximale :', 'augmente', ['diminue', 'ne change pas', 'devient nulle'], 'Il faut plus de portance, donc plus de vitesse pour le même Cz.', 3],
  ['Le rôle principal des ailerons est :', 'incliner l’avion (roulis)', ['faire monter l’avion', 'freiner au sol', 'stabiliser en lacet'], 'Braquage dissymétrique : une aile monte, l’autre descend.'],
  ['La dérive (empennage vertical) assure surtout :', 'la stabilité en lacet', ['la portance', 'la stabilité en roulis uniquement', 'la poussée'], 'Comme l’empennage d’une flèche.'],
  ['À vitesse vraie égale, en altitude, l’anémomètre indique :', 'une vitesse plus faible', ['une vitesse plus forte', 'la même vitesse', 'zéro'], 'L’air moins dense donne une pression dynamique plus faible : vitesse indiquée < vitesse vraie.', 3],
]);

export const BIA_AERONEFS_EXTRA = toItems([
  ['L’huile d’un moteur à pistons sert à :', 'lubrifier et refroidir', ['carburer', 'allumer le mélange', 'gonfler les pneus'], 'Surveille toujours pression et température d’huile.'],
  ['L’alternateur sert à :', 'produire l’électricité et recharger la batterie', ['démarrer le moteur seul', 'mesurer la vitesse', 'chauffer le carburant'], 'Le démarreur utilise la batterie ; l’alternateur la recharge ensuite.'],
  ['Le compte-tours indique :', 'le régime du moteur (tr/min)', ['la vitesse de l’avion', 'l’altitude', 'la quantité de carburant'], 'Sur une hélice à pas fixe, il reflète directement la puissance.'],
  ['Quelle forme d’aile ont le Rafale et les Mirage ?', 'une aile delta', ['une aile droite', 'une aile en flèche inversée', 'une aile haubanée'], 'Aile en triangle, adaptée aux grandes vitesses.', 2],
  ['Le train d’atterrissage rentrant permet :', 'de réduire la traînée en vol', ['d’atterrir plus court', 'de flotter sur l’eau', 'd’augmenter la portance'], 'Moins de traînée = plus de vitesse et moins de consommation.'],
  ['Si le tube de Pitot est bouché (prise statique libre), en montée l’anémomètre :', 'indique une vitesse qui augmente, comme un altimètre', ['indique zéro', 'reste juste', 'indique la vitesse verticale'], 'La pression totale reste piégée alors que la statique baisse : l’indication augmente avec l’altitude.', 3],
  ['Le système d’injection remplace :', 'le carburateur', ['la magnéto', 'l’hélice', 'le train'], 'Il dose le carburant plus précisément et limite le givrage carburateur.', 2],
  ['Les winglets servent à :', 'réduire la traînée induite', ['augmenter la poussée', 'freiner', 'stabiliser en tangage'], 'Ils limitent les tourbillons en bout d’aile.'],
  ['Le carburant AVGAS 100LL est de couleur :', 'bleue', ['rouge', 'verte', 'incolore'], 'La couleur évite de confondre les carburants.', 2],
  ['Un « turboréacteur double flux » est surtout utilisé :', 'sur les avions de ligne', ['sur les ULM', 'sur les planeurs', 'sur les ballons'], 'Plus économique et silencieux grâce à la soufflante.'],
]);

export const BIA_METEO_EXTRA = toItems([
  ['Dans un METAR, « TS » signifie :', 'orage', ['neige', 'brouillard', 'pluie'], 'TS = thunderstorm. RA = pluie, SN = neige, FG = brouillard, BR = brume.'],
  ['Dans un METAR, « FG » signifie :', 'brouillard', ['grêle', 'fumée', 'orage'], 'Brouillard : visibilité inférieure à 1 km.'],
  ['On parle de brouillard (et non de brume) quand la visibilité est :', 'inférieure à 1 km', ['inférieure à 10 km', 'inférieure à 5 km', 'nulle'], 'Brume : visibilité de 1 km ou plus.', 2],
  ['Le sommet en forme d’enclume caractérise :', 'le cumulonimbus', ['le stratus', 'le cirrus', 'l’altocumulus'], 'L’enclume se forme quand le nuage atteint la tropopause.'],
  ['Qu’est-ce que l’isotherme 0 °C ?', 'l’altitude où la température est de 0 °C', ['la température au sol', 'un nuage de glace', 'une ligne de front'], 'Au-dessus, risque de givrage dans les nuages.', 2],
  ['Le brouillard d’advection se forme quand :', 'de l’air chaud et humide passe au-dessus d’une surface froide', ['le sol se refroidit par nuit claire', 'il y a un orage', 'le vent est très fort et sec'], 'Fréquent sur les côtes ; le brouillard de rayonnement, lui, se forme par nuit claire et vent faible.', 2],
  ['Le TEMSI est :', 'une carte du temps significatif', ['un message d’observation', 'un code transpondeur', 'un type de nuage'], 'Elle montre fronts, nuages, givrage, turbulence prévus.', 3],
  ['Les planeurs montent grâce aux :', 'ascendances (thermiques, de pente, ondes)', ['vents descendants', 'brouillards', 'inversions'], 'Les thermiques sont des colonnes d’air chaud qui montent.'],
  ['Un front occlus résulte :', 'du rattrapage d’un front chaud par un front froid', ['de la rencontre de deux anticyclones', 'd’un orage isolé', 'd’une inversion nocturne'], 'Fréquent en fin de vie d’une perturbation.', 3],
  ['Sous un cumulonimbus, près du sol, le danger majeur est :', 'les rafales et le cisaillement de vent (microrafales)', ['le brouillard', 'la chaleur', 'l’absence de vent'], 'Les courants descendants violents s’étalent au sol.'],
]);

export const BIA_NAVREG_EXTRA = toItems([
  ['Le méridien d’origine (longitude 0°) passe par :', 'Greenwich', ['Paris', 'Le Caire', 'New York'], 'Les longitudes vont de 0 à 180° Est ou Ouest.'],
  ['La carte VAC d’un aérodrome sert à :', 'préparer l’arrivée et le départ à vue (circuits, points de report, altitudes)', ['prévoir la météo', 'calculer le carburant', 'connaître les NOTAM'], 'Carte d’approche à vue (Visual Approach Chart).', 2],
  ['Entre un avion et un planeur en route de collision, qui doit céder le passage ?', 'l’avion', ['le planeur', 'le plus rapide', 'celui qui est le plus haut'], 'Les aéronefs motorisés cèdent le passage aux planeurs, ballons et aéronefs remorquant.', 2],
  ['À l’atterrissage, quand deux aéronefs approchent du même terrain, la priorité va à :', 'celui qui est le plus bas', ['celui qui est le plus haut', 'le plus gros', 'le premier à appeler la tour'], 'Sauf instructions du contrôle ; celui qui est le plus bas ne doit pas en profiter pour couper la route.', 3],
  ['Le mode C du transpondeur transmet :', 'l’altitude-pression', ['la vitesse', 'le cap', 'la position GPS'], 'Le contrôleur voit le code et l’altitude.', 2],
  ['« Squawk ident » demande au pilote :', 'd’appuyer sur le bouton IDENT du transpondeur', ['de changer de fréquence', 'de répéter son indicatif', 'd’allumer ses phares'], 'Le plot de l’avion clignote sur l’écran radar du contrôleur.', 2],
  ['Un vent de face :', 'diminue la vitesse sol', ['augmente la vitesse sol', 'ne change rien', 'augmente la vitesse air'], 'Vitesse sol = vitesse air − vent de face.'],
  ['Les feux anticollision rouges à éclats servent à :', 'rendre l’avion visible', ['éclairer la piste', 'indiquer une urgence', 'remplacer la radio'], 'Ils sont allumés dès que le moteur tourne.'],
  ['Le nord magnétique :', 'se déplace lentement au fil des années', ['est fixe et égal au nord vrai', 'est au pôle Sud', 'n’existe pas'], 'C’est pourquoi la déclinaison des cartes est mise à jour.', 2],
  ['Sur une rose des vents, l’Ouest correspond à :', '270°', ['90°', '180°', '360°'], 'N = 360°, E = 090°, S = 180°, O = 270°.'],
]);
